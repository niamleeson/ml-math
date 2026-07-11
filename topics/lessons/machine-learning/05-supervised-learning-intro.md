# Supervised Learning: Introduction & Notations
> **Source:** CS 229 · **Category:** Concept/Framework · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 This section is written as a runnable notebook; an `.ipynb` will be generated from it. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up the core idea one tiny step at a time. Each step **prints** the numbers it
> computes and **draws a picture** so you can *see* what is happening. Run the cells in order
> from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

- Supervised learning **fits** a function to `(input, target)` pairs.
- What matters is **test** error (unseen data), not training error.
- An over-flexible model can fit the training data perfectly yet fail on test data (**overfitting**).

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

### Step 1 — Fit a line, then measure train vs test error

We have 8 points on a noisy line. We **fit on the first 6** (train) and **check on the last 2** (test). The score is mean squared error — low on both means the model generalizes.

```python
xs = np.array([0, 1, 2, 3, 4, 5, 6, 7.]); ys = 2*xs + 1 + np.random.normal(0, 1, 8)
x_tr, y_tr, x_te, y_te = xs[:6], ys[:6], xs[6:], ys[6:]
w = np.polyfit(x_tr, y_tr, 1)                                  # fit a straight line on TRAIN only
mse_tr = np.mean((np.polyval(w, x_tr) - y_tr) ** 2)
mse_te = np.mean((np.polyval(w, x_te) - y_te) ** 2)
log("fitted line (slope, intercept)", np.round(w, 2).tolist())
log("train MSE", round(mse_tr, 3)); log("test MSE", round(mse_te, 3))

grid = np.linspace(0, 7, 100)
plt.scatter(x_tr, y_tr, label="train"); plt.scatter(x_te, y_te, color="red", label="test")
plt.plot(grid, np.polyval(w, grid), color="black"); plt.title("Step 1 — line fit"); plt.legend(); plt.show()
```
▶ What you'll see: a line close to the true `2x+1`, with train and test MSE both small.

### Step 2 — Break case: an over-flexible model overfits

Now fit a wiggly **degree-5** curve to the same 6 training points. It bends to hit them almost perfectly (train error ≈ 0) but goes wild off-data, so **test error explodes**. That gap is overfitting.

```python
w5 = np.polyfit(x_tr, y_tr, 5)                                 # far too flexible for 6 points
mse_tr5 = np.mean((np.polyval(w5, x_tr) - y_tr) ** 2)
mse_te5 = np.mean((np.polyval(w5, x_te) - y_te) ** 2)
log("degree-5 train MSE (tiny!)", round(mse_tr5, 4))
log("degree-5 test MSE (huge!)", round(mse_te5, 2))
assert mse_tr5 < mse_tr                                        # it fits TRAIN better...
assert mse_te5 > mse_te                                        # ...but generalizes far worse

grid = np.linspace(0, 7, 200)
plt.scatter(x_tr, y_tr, label="train"); plt.scatter(x_te, y_te, color="red", label="test")
plt.plot(grid, np.polyval(w5, grid), color="purple"); plt.ylim(y_tr.min()-3, y_tr.max()+3)
plt.title("Step 2 — degree-5 curve OVERFITS"); plt.legend(); plt.show()
```
▶ What you'll see: near-zero train error but a much larger test error — the model memorized noise.

## 1. Overview

Supervised learning starts with examples whose inputs and correct outcomes are already known, then learns a rule for predicting the outcome of a new input. The central objects are the training set, the hypothesis $h_\theta$, the loss for one example, the cost over all examples, and the optimization rule used to choose parameters $\theta$.

The main intuition is: most supervised-learning algorithms differ in what form they choose for $h_\theta$, what output type $y$ has, what loss function measures mistakes, and how the resulting objective is optimized.

## 2. Key Idea

### The supervised-learning setup

Given a set of data points $\{x^{(1)},\ldots,x^{(m)}\}$ associated to a set of outcomes $\{y^{(1)},\ldots,y^{(m)}\}$, we want to build a classifier that learns how to predict $y$ from $x$.

Equivalently, the training set is written as

$$
\left\{\left(x^{(i)},y^{(i)}\right)\right\}_{i=1}^{m},
$$

where $x^{(i)}$ is the $i$th input and $y^{(i)}$ is the corresponding target.

**One-line reading:** supervised learning learns a map from inputs $x$ to known targets $y$ using paired training examples.

### Features and targets

The input $x^{(i)}$ contains the measured information about example $i$; its coordinates are called features. The output $y^{(i)}$ is the target, label, outcome, or response to be predicted.

For a feature vector with $n$ features,

$$
x^{(i)}=
\begin{bmatrix}
x_1^{(i)}\\
x_2^{(i)}\\
\vdots\\
x_n^{(i)}
\end{bmatrix}.
$$

**One-line reading:** features are the observed inputs, and targets are the correct outputs attached to them during training.

### Prediction type: regression versus classification

The different types of predictive models are summed up in the table below:

|  | Regression | Classifier |
|---|---|---|
| **Outcome** | Continuous | Class |
| **Examples** | Linear regression | Logistic regression, SVM, Naive Bayes |

**One-line reading:** use regression when $y$ is numerical and continuous, and use classification when $y$ is a discrete class.

### Model type: discriminative versus generative

The different models are summed up in the table below:

|  | Discriminative model | Generative model |
|---|---|---|
| **Goal** | Directly estimate $P(y\mid x)$ | Estimate $P(x\mid y)$ to deduce $P(y\mid x)$ |
| **What’s learned** | Decision boundary | Probability distributions of the data |
| **Examples** | Regressions, SVMs | GDA, Naive Bayes |

A discriminative model focuses directly on prediction. A generative model describes how each class could have generated the observed features and then uses those descriptions to infer the label.

**One-line reading:** discriminative models learn the boundary or conditional prediction directly, while generative models learn class-conditional data distributions first.

### Parametric versus non-parametric models

A parametric model assumes a fixed finite-dimensional form for the hypothesis, such as

$$
h_\theta(x)=\theta_0+\theta_1x,
$$

where learning means choosing a fixed number of parameters $\theta$. A non-parametric model does not commit to a fixed finite number of parameters in the same way; its effective complexity can grow with the data, as in nearest-neighbor-style reasoning.

**One-line reading:** parametric models compress learning into a fixed-size parameter vector $\theta$, while non-parametric models can become more flexible as the training set grows.

### Hypothesis

**Hypothesis** — The hypothesis is noted $h_\theta$ and is the model that we choose. For a given input data $x^{(i)}$, the model prediction output is $h_\theta(x^{(i)})$.

Thus, if $z^{(i)}$ denotes the prediction on example $i$, then

$$
z^{(i)}=h_\theta\left(x^{(i)}\right).
$$

**One-line reading:** the hypothesis $h_\theta$ is the chosen prediction rule, and $h_\theta(x^{(i)})$ is its prediction on example $i$.

### Loss function

**Loss function** — A loss function is a function $L:(z,y)\in\mathbb{R}\times Y\longmapsto L(z,y)\in\mathbb{R}$ that takes as inputs the predicted value $z$ corresponding to the real data value $y$ and outputs how different they are.

Common loss functions are:

| Least squared | Logistic | Hinge | Cross-entropy |
|---|---|---|---|
| $\frac{1}{2}(y-z)^2$ | $\log(1+\exp(-yz))$ | $\max(0,1-yz)$ | $-\left[y\log(z)+(1-y)\log(1-z)\right]$ |
| Linear regression | Logistic regression | SVM | Neural Network |

**One-line reading:** a loss function measures the mistake on one training example.

### Cost function

**Cost function** — The cost function $J$ is commonly used to assess the performance of a model, and is defined with the loss function $L$ as follows:

$$
J(\theta)=\sum_{i=1}^{m}L\left(h_\theta\left(x^{(i)}\right),y^{(i)}\right).
$$

The loss is per-example, while the cost aggregates losses across the full training set.

**One-line reading:** the cost $J(\theta)$ is the total training-set error produced by the hypothesis with parameters $\theta$.

### Gradient descent

By noting $\alpha\in\mathbb{R}$ the learning rate, the update rule for gradient descent is expressed with the learning rate and the cost function $J$ as follows:

$$
\theta \leftarrow \theta-\alpha\nabla J(\theta).
$$

Stochastic gradient descent (SGD) is updating the parameter based on each training example, and batch gradient descent is on a batch of training examples.

**One-line reading:** gradient descent moves parameters in the negative-gradient direction to reduce the cost.

### Likelihood and log-likelihood

The likelihood of a model $L(\theta)$ given parameters $\theta$ is used to find the optimal parameters $\theta$ through maximizing the likelihood. In practice, we use the log-likelihood $\ell(\theta)=\log(L(\theta))$ which is easier to optimize. We have:

$$
\theta^{\mathrm{opt}}=\operatorname*{argmax}_{\theta} L(\theta).
$$

**One-line reading:** maximum likelihood chooses the parameters that make the observed data most probable under the model.

### Newton's algorithm

The Newton’s algorithm is a numerical method that finds $\theta$ such that $\ell'(\theta)=0$. Its update rule is as follows:

$$
\theta \leftarrow \theta-\frac{\ell'(\theta)}{\ell''(\theta)}.
$$

The multidimensional generalization, also known as the Newton-Raphson method, has the following update rule:

$$
\theta \leftarrow \theta-\left(\nabla_\theta^2\ell(\theta)\right)^{-1}\nabla_\theta\ell(\theta).
$$

**One-line reading:** Newton's algorithm uses first and second derivatives to jump toward a stationary point of the log-likelihood.

## 3. Worked Examples

### 🟡 Easy

#### E1. Classify a task as regression or classification

**Problem.** For each task below, decide whether it is a regression problem or a classification problem.

1. House size $x$ in square feet $\to$ sale price $y$ in dollars.
2. Email text $x$ $\to$ label $y\in\{\text{spam},\text{not spam}\}$.
3. Image pixels $x$ $\to$ digit class $y\in\{0,1,2,\ldots,9\}$.

**Solution.**

Use the prediction-type rule:

| Model type | Output type |
|---|---|
| Regression | Continuous |
| Classifier | Class |

For task 1, the outcome is sale price. A price can vary continuously over many numerical values, such as

$$
325000,
\quad
325000.50,
\quad
417250,
\quad
\text{and so on.}
$$

So the target is continuous.

$$
\boxed{\text{House size }\to\text{ price is a regression problem.}}
$$

For task 2, the target is one of two names:

$$
y\in\{\text{spam},\text{not spam}\}.
$$

The numbers or words inside the email may be complicated, but the output is a discrete class.

$$
\boxed{\text{Email }\to\text{ spam/not spam is a classification problem.}}
$$

For task 3, the target is one of ten possible digit classes:

$$
y\in\{0,1,2,3,4,5,6,7,8,9\}.
$$

Although the class names are written as numbers, they are not being predicted as a continuous measurement. Predicting digit $8$ instead of digit $7$ is a class mistake, not an error of size $1$ on a continuous scale.

$$
\boxed{\text{Image }\to\text{ digit class is a classification problem.}}
$$

The final classification of the three tasks is therefore:

$$
\boxed{
\begin{array}{c|c}
\text{Task} & \text{Prediction type}\\
\hline
\text{House size }\to\text{ price} & \text{Regression}\\
\text{Email text }\to\text{ spam/not spam} & \text{Classification}\\
\text{Image }\to\text{ digit} & \text{Classification}
\end{array}}
$$

#### E2. Discriminative versus generative modeling decision

**Problem.** A medical dataset has feature vector $x$ containing age, blood pressure, and a lab measurement. The label is

$$
y\in\{0,1\},
$$

where $1$ means disease present and $0$ means disease absent. Two modeling teams propose the following approaches:

- Team D directly estimates $P(y=1\mid x)$ and predicts disease when this probability is large.
- Team G estimates $P(x\mid y=1)$ and $P(x\mid y=0)$, then uses these class-conditional densities to deduce $P(y\mid x)$.

Classify each approach as discriminative or generative, and explain what is learned.

**Solution.**

The reference distinction is:

|  | Discriminative model | Generative model |
|---|---|---|
| **Goal** | Directly estimate $P(y\mid x)$ | Estimate $P(x\mid y)$ to deduce $P(y\mid x)$ |
| **What’s learned** | Decision boundary | Probability distributions of the data |

Team D directly estimates

$$
P(y=1\mid x).
$$

This is already a conditional probability of the label given the features. For example, if for one patient Team D obtains

$$
P(y=1\mid x)=0.82,
$$

then a natural classifier with threshold $0.5$ predicts

$$
0.82>0.5
\quad\Longrightarrow\quad
\hat y=1.
$$

Because the approach goes directly from $x$ to $P(y\mid x)$ or to a decision boundary, it is discriminative.

$$
\boxed{\text{Team D uses a discriminative model.}}
$$

Team G estimates the feature distribution inside each class:

$$
P(x\mid y=1)
\quad\text{and}\quad
P(x\mid y=0).
$$

To turn these into a prediction, the model can combine them with class prior probabilities $P(y=1)$ and $P(y=0)$. The posterior probability is proportional to

$$
P(y\mid x)\propto P(x\mid y)P(y).
$$

Thus Team G first describes how diseased and non-diseased patients generate feature vectors, then deduces the label probability.

$$
\boxed{\text{Team G uses a generative model.}}
$$

The final reasoning is:

$$
\boxed{
\begin{array}{c|c|c}
\text{Team} & \text{Estimated quantity} & \text{Model type}\\
\hline
D & P(y\mid x) & \text{Discriminative}\\
G & P(x\mid y)\text{ first, then }P(y\mid x) & \text{Generative}
\end{array}}
$$

#### E3. Compute squared loss and total cost

**Problem.** A model makes predictions

$$
z=(2,4,5)
$$

for three examples whose true labels are

$$
y=(3,4,1).
$$

Using least squared loss

$$
L(z,y)=\frac{1}{2}(y-z)^2,
$$

compute each per-example loss and the total cost

$$
J(\theta)=\sum_{i=1}^{3}L\left(h_\theta\left(x^{(i)}\right),y^{(i)}\right).
$$

**Solution.**

For each example, the prediction is

$$
z^{(i)}=h_\theta\left(x^{(i)}\right).
$$

So the loss on example $i$ is

$$
L\left(z^{(i)},y^{(i)}\right)=\frac{1}{2}\left(y^{(i)}-z^{(i)}\right)^2.
$$

For example 1,

$$
z^{(1)}=2,
\qquad
y^{(1)}=3.
$$

The error is

$$
y^{(1)}-z^{(1)}=3-2=1.
$$

Therefore

$$
L\left(z^{(1)},y^{(1)}\right)=\frac{1}{2}(1)^2=\frac{1}{2}=0.5.
$$

For example 2,

$$
z^{(2)}=4,
\qquad
y^{(2)}=4.
$$

The error is

$$
y^{(2)}-z^{(2)}=4-4=0.
$$

Therefore

$$
L\left(z^{(2)},y^{(2)}\right)=\frac{1}{2}(0)^2=0.
$$

For example 3,

$$
z^{(3)}=5,
\qquad
y^{(3)}=1.
$$

The error is

$$
y^{(3)}-z^{(3)}=1-5=-4.
$$

After squaring,

$$
(-4)^2=16,
$$

so

$$
L\left(z^{(3)},y^{(3)}\right)=\frac{1}{2}(16)=8.
$$

Now sum the three losses to obtain the cost:

$$
\begin{aligned}
J(\theta)
&=L\left(z^{(1)},y^{(1)}\right)+L\left(z^{(2)},y^{(2)}\right)+L\left(z^{(3)},y^{(3)}\right)\\
&=0.5+0+8\\
&=8.5.
\end{aligned}
$$

Thus

$$
\boxed{\text{Per-example losses are }0.5,\;0,\;8.}
$$

and

$$
\boxed{J(\theta)=8.5.}
$$

The large third error dominates the cost because squared loss penalizes large residuals strongly.

#### E4. One gradient-descent step

**Problem.** Suppose a one-dimensional model parameter currently has value

$$
\theta=2.
$$

The learning rate is

$$
\alpha=0.1,
$$

and the current gradient is

$$
\nabla J(\theta)=3.5.
$$

Apply one gradient-descent update

$$
\theta\leftarrow \theta-\alpha\nabla J(\theta),
$$

and interpret the direction of movement.

**Solution.**

Start with the update formula:

$$
\theta_{\text{new}}=\theta_{\text{old}}-\alpha\nabla J(\theta_{\text{old}}).
$$

Substitute the given values:

$$
\theta_{\text{new}}=2-(0.1)(3.5).
$$

Compute the step size:

$$
(0.1)(3.5)=0.35.
$$

Therefore

$$
\theta_{\text{new}}=2-0.35=1.65.
$$

So the updated parameter is

$$
\boxed{\theta_{\text{new}}=1.65.}
$$

Because the gradient is positive,

$$
\nabla J(\theta)=3.5>0,
$$

the cost increases as $\theta$ increases locally. Gradient descent therefore moves in the negative direction:

$$
2\longrightarrow 1.65.
$$

This matches the rule: gradient descent uses $-\alpha\nabla J(\theta)$, not $+\alpha\nabla J(\theta)$.

$$
\boxed{\text{The update moves left because the gradient is positive.}}
$$

#### E5. Logistic and hinge loss from a margin

**Problem.** Let the binary label be

$$
y=1,
$$

and consider three scores

$$
z=-1,
\qquad
z=0,
\qquad
z=2.
$$

For each score, compute the margin $yz$, the logistic loss

$$
\log(1+\exp(-yz)),
$$

and the hinge loss

$$
\max(0,1-yz).
$$

Use natural logarithms. Approximate numerical values may be used.

**Solution.**

Since $y=1$, the margin is

$$
yz=(1)z=z.
$$

So the margins are

$$
\begin{array}{c|c}
z & yz\\
\hline
-1 & -1\\
0 & 0\\
2 & 2
\end{array}
$$

For $z=-1$, the margin is $yz=-1$. The logistic loss is

$$
\log(1+\exp(-yz))
=\log(1+\exp(-(-1)))
=\log(1+e^1).
$$

Using $e\approx2.718$,

$$
\log(1+e)=\log(3.718)\approx1.313.
$$

The hinge loss is

$$
\max(0,1-yz)=\max(0,1-(-1))=\max(0,2)=2.
$$

For $z=0$, the margin is $yz=0$. The logistic loss is

$$
\log(1+\exp(-0))=\log(1+1)=\log 2\approx0.693.
$$

The hinge loss is

$$
\max(0,1-0)=\max(0,1)=1.
$$

For $z=2$, the margin is $yz=2$. The logistic loss is

$$
\log(1+\exp(-2)).
$$

Since $e^{-2}\approx0.1353$,

$$
\log(1+e^{-2})\approx\log(1.1353)\approx0.127.
$$

The hinge loss is

$$
\max(0,1-2)=\max(0,-1)=0.
$$

Collecting the results:

$$
\boxed{
\begin{array}{c|c|c|c}
z & yz & \log(1+e^{-yz}) & \max(0,1-yz)\\
\hline
-1 & -1 & 1.313 & 2\\
0 & 0 & 0.693 & 1\\
2 & 2 & 0.127 & 0
\end{array}}
$$

The interpretation is that negative or small margins are penalized. The hinge loss becomes exactly zero once the margin reaches at least $1$, while logistic loss remains positive but small.

### 🔴 Advanced

#### A1. Cross-entropy penalty for confident wrong predictions

**Problem.** For binary labels $y\in\{0,1\}$ and predicted probabilities $z\in(0,1)$, the cross-entropy loss is

$$
L(z,y)=-\left[y\log(z)+(1-y)\log(1-z)\right].
$$

Compute the loss for the following four examples:

| Example | True label $y$ | Predicted probability $z$ for class $1$ |
|---|---:|---:|
| 1 | $1$ | $0.99$ |
| 2 | $1$ | $0.01$ |
| 3 | $0$ | $0.20$ |
| 4 | $0$ | $0.80$ |

Then explain why confident wrong predictions dominate the total cost.

**Solution.**

The formula has two cases.

If $y=1$, then

$$
L(z,1)=-\left[1\cdot\log z+(1-1)\log(1-z)\right]
=-\log z.
$$

If $y=0$, then

$$
L(z,0)=-\left[0\cdot\log z+(1-0)\log(1-z)\right]
=-\log(1-z).
$$

For example 1, $y=1$ and $z=0.99$, so

$$
L(0.99,1)=-\log(0.99).
$$

Using $\log(0.99)\approx-0.01005$,

$$
L(0.99,1)\approx0.01005.
$$

This is small because the model assigns high probability to the correct class.

For example 2, $y=1$ and $z=0.01$, so

$$
L(0.01,1)=-\log(0.01).
$$

Since $0.01=10^{-2}$,

$$
\log(0.01)=\log(10^{-2})=-2\log 10\approx-4.60517.
$$

Therefore

$$
L(0.01,1)\approx4.60517.
$$

This is large because the model assigns only $1\%$ probability to the true class.

For example 3, $y=0$ and $z=0.20$, so the probability assigned to the true class $0$ is

$$
1-z=1-0.20=0.80.
$$

The loss is

$$
L(0.20,0)=-\log(1-0.20)=-\log(0.80).
$$

Using $\log(0.80)\approx-0.22314$,

$$
L(0.20,0)\approx0.22314.
$$

For example 4, $y=0$ and $z=0.80$, so the probability assigned to the true class $0$ is

$$
1-z=1-0.80=0.20.
$$

The loss is

$$
L(0.80,0)=-\log(0.20).
$$

Using $\log(0.20)\approx-1.60944$,

$$
L(0.80,0)\approx1.60944.
$$

Collecting the values:

$$
\boxed{
\begin{array}{c|c|c|c}
\text{Example} & y & z & L(z,y)\\
\hline
1 & 1 & 0.99 & 0.01005\\
2 & 1 & 0.01 & 4.60517\\
3 & 0 & 0.20 & 0.22314\\
4 & 0 & 0.80 & 1.60944
\end{array}}
$$

The total cost over these four examples is

$$
\begin{aligned}
J
&=0.01005+4.60517+0.22314+1.60944\\
&=6.44780.
\end{aligned}
$$

Example 2 alone contributes

$$
\frac{4.60517}{6.44780}\approx0.7142,
$$

or about $71.4\%$ of the total cost. This shows the main behavior of cross-entropy: confident wrong predictions receive very large penalties because $-\log(p)$ becomes large when the probability $p$ assigned to the true class is close to $0$.

$$
\boxed{\text{Confident wrong predictions dominate cross-entropy because }-\log(p_{\text{true}})\to\infty\text{ as }p_{\text{true}}\to0.}
$$

#### A2. Build a full cost from a hypothesis

**Problem.** Consider the linear hypothesis

$$
h_\theta(x)=\theta_0+\theta_1x.
$$

The training set is

$$
(0,1),
\qquad
(1,3),
\qquad
(2,2),
$$

where each pair is $(x^{(i)},y^{(i)})$. Let

$$
\theta=(\theta_0,\theta_1)=(1,0.5).
$$

Using squared loss

$$
L(z,y)=\frac{1}{2}(y-z)^2,
$$

compute the prediction for each point, each loss, and the cost $J(\theta)$.

**Solution.**

First distinguish the three levels of notation.

The hypothesis is the prediction rule:

$$
h_\theta(x)=\theta_0+\theta_1x.
$$

The prediction on one example is

$$
z^{(i)}=h_\theta\left(x^{(i)}\right).
$$

The loss on one example is

$$
L\left(z^{(i)},y^{(i)}\right)=\frac{1}{2}\left(y^{(i)}-z^{(i)}\right)^2.
$$

The cost is the sum of the losses:

$$
J(\theta)=\sum_{i=1}^{3}L\left(h_\theta\left(x^{(i)}\right),y^{(i)}\right).
$$

Now substitute $\theta_0=1$ and $\theta_1=0.5$ into the hypothesis:

$$
h_\theta(x)=1+0.5x.
$$

For the first point, $(x^{(1)},y^{(1)})=(0,1)$:

$$
z^{(1)}=h_\theta(0)=1+0.5(0)=1.
$$

The residual is

$$
y^{(1)}-z^{(1)}=1-1=0,
$$

so the loss is

$$
L\left(z^{(1)},y^{(1)}\right)=\frac{1}{2}(0)^2=0.
$$

For the second point, $(x^{(2)},y^{(2)})=(1,3)$:

$$
z^{(2)}=h_\theta(1)=1+0.5(1)=1.5.
$$

The residual is

$$
y^{(2)}-z^{(2)}=3-1.5=1.5,
$$

so the loss is

$$
L\left(z^{(2)},y^{(2)}\right)=\frac{1}{2}(1.5)^2.
$$

Since

$$
(1.5)^2=2.25,
$$

we get

$$
L\left(z^{(2)},y^{(2)}\right)=1.125.
$$

For the third point, $(x^{(3)},y^{(3)})=(2,2)$:

$$
z^{(3)}=h_\theta(2)=1+0.5(2)=2.
$$

The residual is

$$
y^{(3)}-z^{(3)}=2-2=0,
$$

so the loss is

$$
L\left(z^{(3)},y^{(3)}\right)=\frac{1}{2}(0)^2=0.
$$

Now sum the losses:

$$
\begin{aligned}
J(\theta)
&=0+1.125+0\\
&=1.125.
\end{aligned}
$$

The full table is

$$
\boxed{
\begin{array}{c|c|c|c|c}
i & x^{(i)} & y^{(i)} & h_\theta(x^{(i)}) & L(h_\theta(x^{(i)}),y^{(i)})\\
\hline
1 & 0 & 1 & 1 & 0\\
2 & 1 & 3 & 1.5 & 1.125\\
3 & 2 & 2 & 2 & 0
\end{array}}
$$

and

$$
\boxed{J(\theta)=1.125.}
$$

This example separates the terms: $h_\theta$ is the model, $L$ is one-example error, and $J$ is total training-set error.

#### A3. Batch versus stochastic gradient update

**Problem.** A one-dimensional parameter starts at

$$
\theta_0=5,
$$

with learning rate

$$
\alpha=0.2.
$$

Two training examples produce gradients

$$
g_1=4,
\qquad
g_2=-1.
$$

Compute:

1. One batch gradient-descent update using the summed gradient $g_1+g_2$.
2. Two stochastic gradient-descent updates, first using $g_1$ and then using $g_2$.

Compare the paths.

**Solution.**

For batch gradient descent, the update is based on the batch gradient. Here the batch contains both examples, so

$$
g_{\text{batch}}=g_1+g_2=4+(-1)=3.
$$

The update rule is

$$
\theta\leftarrow\theta-\alpha g_{\text{batch}}.
$$

Substitute $\theta_0=5$, $\alpha=0.2$, and $g_{\text{batch}}=3$:

$$
\theta_{\text{batch}}=5-(0.2)(3).
$$

Compute the step:

$$
(0.2)(3)=0.6.
$$

Therefore

$$
\theta_{\text{batch}}=5-0.6=4.4.
$$

So one batch update gives

$$
\boxed{\theta_{\text{batch}}=4.4.}
$$

For stochastic gradient descent, we update after each training example.

Start at

$$
\theta^{(0)}=5.
$$

Using the first example gradient $g_1=4$:

$$
\theta^{(1)}=\theta^{(0)}-\alpha g_1=5-(0.2)(4).
$$

Since

$$
(0.2)(4)=0.8,
$$

we get

$$
\theta^{(1)}=5-0.8=4.2.
$$

Now use the second example gradient $g_2=-1$:

$$
\theta^{(2)}=\theta^{(1)}-\alpha g_2=4.2-(0.2)(-1).
$$

Because subtracting a negative number adds,

$$
\theta^{(2)}=4.2+0.2=4.4.
$$

Thus the two SGD steps give

$$
\boxed{5\longrightarrow4.2\longrightarrow4.4.}
$$

The final value is

$$
\boxed{\theta_{\text{SGD final}}=4.4.}
$$

In this simplified example, the final value matches the batch update because the two gradients were treated as fixed numbers independent of the intermediate value of $\theta$. The path is different:

$$
\boxed{
\begin{array}{c|c}
\text{Method} & \text{Path}\\
\hline
\text{Batch gradient descent} & 5\longrightarrow4.4\\
\text{SGD} & 5\longrightarrow4.2\longrightarrow4.4
\end{array}}
$$

In real optimization, the second stochastic gradient is usually evaluated at the updated parameter, so SGD and batch gradient descent often end at different locations after one pass.

#### A4. Maximum likelihood versus log-likelihood

**Problem.** Suppose we observe four Bernoulli outcomes

$$
1,0,1,1,
$$

where

$$
P(Y=1)=p,
\qquad
P(Y=0)=1-p.
$$

Write the likelihood $L(p)$, the log-likelihood $\ell(p)=\log L(p)$, differentiate, and solve for the maximum-likelihood estimate $p^{\mathrm{opt}}$.

**Solution.**

The observations are

$$
1,0,1,1.
$$

There are three successes and one failure. For a Bernoulli model,

$$
P(Y=1)=p
$$

and

$$
P(Y=0)=1-p.
$$

Assuming independent observations, the likelihood is the product of the probabilities assigned to the observed outcomes:

$$
L(p)=P(1,0,1,1\mid p).
$$

Thus

$$
L(p)=p(1-p)p p.
$$

Multiplying terms gives

$$
L(p)=p^3(1-p).
$$

So

$$
\boxed{L(p)=p^3(1-p).}
$$

The log-likelihood is

$$
\ell(p)=\log L(p)=\log\left(p^3(1-p)\right).
$$

Use log rules:

$$
\log(ab)=\log a+\log b
$$

and

$$
\log(p^3)=3\log p.
$$

Therefore

$$
\boxed{\ell(p)=3\log p+\log(1-p).}
$$

Now differentiate:

$$
\frac{d}{dp}\left(3\log p\right)=\frac{3}{p},
$$

and

$$
\frac{d}{dp}\log(1-p)=\frac{1}{1-p}\cdot(-1)=-\frac{1}{1-p}.
$$

So

$$
\ell'(p)=\frac{3}{p}-\frac{1}{1-p}.
$$

Set the derivative equal to zero:

$$
\frac{3}{p}-\frac{1}{1-p}=0.
$$

Move one term to the other side:

$$
\frac{3}{p}=\frac{1}{1-p}.
$$

Cross-multiply:

$$
3(1-p)=p.
$$

Expand:

$$
3-3p=p.
$$

Collect terms:

$$
3=4p.
$$

Therefore

$$
p=\frac{3}{4}.
$$

So the maximum-likelihood estimate is

$$
\boxed{p^{\mathrm{opt}}=\frac{3}{4}=0.75.}
$$

This matches the empirical fraction of successes:

$$
\frac{\text{number of ones}}{\text{number of observations}}=\frac{3}{4}.
$$

The likelihood and log-likelihood have the same maximizer because $\log$ is strictly increasing:

$$
\boxed{\operatorname*{argmax}_{p}L(p)=\operatorname*{argmax}_{p}\ell(p)=\frac{3}{4}.}
$$

#### A5. Newton's algorithm step for a scalar objective

**Problem.** Consider the scalar log-likelihood-shaped objective

$$
\ell(\theta)=-(\theta-3)^2+5.
$$

Starting from

$$
\theta_0=0,
$$

apply one Newton update

$$
\theta\leftarrow\theta-\frac{\ell'(\theta)}{\ell''(\theta)}.
$$

Then compare the Newton movement with a first-order gradient-ascent step using learning rate $\alpha=0.1$.

**Solution.**

First compute the derivatives. The objective is

$$
\ell(\theta)=-(\theta-3)^2+5.
$$

Differentiate once:

$$
\ell'(\theta)=-2(	heta-3).
$$

This can also be written as

$$
\ell'(\theta)=6-2\theta.
$$

Differentiate again:

$$
\ell''(\theta)=-2.
$$

At the starting value $\theta_0=0$,

$$
\ell'(0)=6-2(0)=6,
$$

and

$$
\ell''(0)=-2.
$$

Newton's algorithm for finding $\ell'(\theta)=0$ uses

$$
\theta_{\text{new}}=\theta_0-\frac{\ell'(\theta_0)}{\ell''(\theta_0)}.
$$

Substitute the values:

$$
\theta_{\text{new}}=0-\frac{6}{-2}.
$$

Since

$$
\frac{6}{-2}=-3,
$$

we get

$$
\theta_{\text{new}}=0-(-3)=3.
$$

Thus one Newton update gives

$$
\boxed{\theta_{\text{Newton}}=3.}
$$

This is exactly the maximizer because the parabola

$$
\ell(\theta)=-(\theta-3)^2+5
$$

has its peak at $\theta=3$.

Now compare with a first-order gradient-ascent step. Since $\ell$ is being maximized, gradient ascent would use

$$
\theta_{\text{new}}=\theta_0+\alpha\ell'(\theta_0).
$$

With $\alpha=0.1$ and $\ell'(0)=6$,

$$
\theta_{\text{ascent}}=0+(0.1)(6)=0.6.
$$

So

$$
\boxed{\theta_{\text{gradient ascent}}=0.6.}
$$

The comparison is

$$
\boxed{
\begin{array}{c|c|c}
\text{Method} & \text{Uses} & \text{One-step result from }\theta_0=0\\
\hline
\text{Newton} & \ell'(\theta)\text{ and }\ell''(\theta) & 3\\
\text{Gradient ascent} & \ell'(\theta)\text{ only plus learning rate }\alpha & 0.6
\end{array}}
$$

Newton's update moves farther because it uses curvature information through $\ell''(\theta)$. Gradient ascent only knows the local slope and must rely on the manually chosen learning rate.
