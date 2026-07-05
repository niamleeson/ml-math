# M3 · Loss & optimization
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** derive/explain logloss + L1/L2 and what the optimizer does

## Overview

Training a model means choosing what "wrong" costs, then using an optimizer to reduce that cost. A pCTR model is not trained by wishing for high AUC; it is trained by assigning loss to predicted probabilities, taking steps that reduce average loss, and controlling the model so it does not simply fit the training set.

This module keeps the real math visible because the math is the explanation: log loss comes from the Bernoulli likelihood, gradients tell the optimizer which way is uphill, and L1/L2 penalties change the fitted weights.

**By the end you can answer:**
- What is a loss, and why minimize average loss over training examples?
- How does Bernoulli likelihood lead to binary log loss, and what does log loss punish?
- When should you use MSE, MAE, or Huber for regression?
- What is a gradient, and what does the update $w \leftarrow w - \eta\nabla L(w)$ do?
- What happens when the learning rate is too small or too large?
- How do batch, stochastic, and mini-batch gradient descent differ, and what do momentum and Adam add?
- How do L1 and L2 regularization differ in sparsity, shrinkage, and geometry?
- How does regularization strength trade bias against variance?

Three sub-lessons:

- **M3.1 Loss functions** — empirical risk, log loss, and regression losses.
- **M3.2 Gradient descent & the optimizer** — gradients, learning rates, SGD, momentum, and Adam.
- **M3.3 Regularization** — L1/L2 penalties and the bias–variance tradeoff.

---

## M3.1 · Loss functions

**The idea.** A **loss** assigns a cost to one prediction. Training minimizes **empirical risk**, the average loss on the training examples:

**Everyday analogy.** Imagine Alex predicting whether each friend will come to a picnic, then paying a penalty for every bad guess. Saying "I'm 99% sure Priya will come" and being wrong hurts much more than saying "I'm 55% sure" and being wrong; that is log loss punishing confident-but-wrong predictions. The loss is the per-guess penalty, and empirical risk is Alex's average penalty across all past invitations.

$$\hat{R}(\theta) = \frac{1}{n}\sum_{i=1}^{n}\ell(f_\theta(x_i), y_i).$$

For binary pCTR, the model predicts a probability $p$ that an impression will click, and the label $y$ is 0 or 1. The Bernoulli likelihood for one row is

$$P(y\mid p)=p^y(1-p)^{1-y}.$$

Maximizing likelihood is equivalent to minimizing negative log-likelihood:

$$\ell(p,y)=-\log P(y\mid p)=-\big[y\log p+(1-y)\log(1-p)\big].$$

So if $y=1$, the loss is $-\log p$; if $y=0$, the loss is $-\log(1-p)$. The penalty is small for confident correct predictions and very large for confident wrong predictions.

For regression, the label is continuous, so the common losses read the residual $r=\hat{y}-y$ differently:

| Loss | Formula | Use when |
|---|---|---|
| MSE | $r^2$ | large errors should be punished strongly; noise is roughly Gaussian |
| MAE | $\lvert r\rvert$ | outliers exist and should not dominate |
| Huber | quadratic near zero, linear for large $\lvert r\rvert$ | you want smooth optimization plus outlier robustness |

**Worked example — log loss by hand.** For a clicked impression ($y=1$):

| Predicted pCTR | Log loss | Interpretation |
|---:|---:|---|
| 0.90 | $-\log(0.90)=0.105$ | confident and right |
| 0.10 | $-\log(0.10)=2.303$ | wrong by a lot |
| 0.01 | $-\log(0.01)=4.605$ | confidently wrong; punished hard |

For a non-click ($y=0$), the same logic flips: predicting $p=0.01$ has loss $-\log(0.99)\approx0.010$, while predicting $p=0.90$ has loss $-\log(0.10)=2.303$.

For a regression residual of 10, MSE costs 100 while MAE costs 10. That is why a single extreme campaign value can dominate an MSE fit, while MAE or Huber can be safer when outliers are genuine and noisy.

**You'll be able to say:** *"A loss assigns a cost to one prediction; empirical risk is the average training loss we can actually minimize. For binary labels, the Bernoulli likelihood gives log loss, which heavily penalizes confident wrong probabilities. For regression, MSE punishes large errors strongly, MAE is more outlier-robust, and Huber blends the two."*

---

## M3.2 · Gradient descent & the optimizer

**The idea.** A **gradient** points in the direction where the loss increases fastest. Gradient descent moves parameters in the opposite direction:

$$w \leftarrow w - \eta\nabla L(w).$$

The learning rate $\eta$ controls step size. Too small crawls. Too large overshoots the low-loss region, oscillates, or diverges.

**Everyday analogy.** Hiking downhill in thick fog, you cannot see the valley, so you feel which way the ground slopes under your boots and step downhill. The slope you feel is the gradient, stepping opposite it is gradient descent, and your stride length is the learning rate. Tiny steps take forever; huge steps can carry you past the valley and up the other side.

A training loop is simple in shape:

```python
pred = model(x_batch)
loss = loss_fn(pred, y_batch)
grad = gradient(loss, model.weights)
model.weights = optimizer_step(model.weights, grad)
```

**Batch size changes the gradient estimate.** Batch gradient descent uses all rows for each step: stable but expensive. Stochastic gradient descent uses one row: cheap but noisy. Mini-batch uses a small batch: noisy enough to scale, stable enough to learn.

**Momentum** keeps a velocity so repeated gradients in the same direction accumulate:

$$v_t=\beta v_{t-1}+\nabla L(w_t),\qquad w_{t+1}=w_t-\eta v_t.$$

**Adam** adapts per-parameter step sizes using moving averages of the first and second moments of gradients. In practice, it helps when features have different scales or sparse parameters update unevenly.

**Worked example — one step on a bowl.** Let $L(w)=(w-3)^2$. The derivative is $\nabla L(w)=2(w-3)$. At $w=0$, the gradient is $-6$.

With $\eta=0.1$:

$$w_{new}=0-0.1(-6)=0.6.$$

The step moves toward 3, lowering loss from 9 to $(0.6-3)^2=5.76$. With $\eta=1.0$, the update jumps to 6. The next gradient is 6, so it jumps back to 0. The optimizer oscillates because the step is too large.

On a pCTR model, the same principle shows up as curves: a moderate learning rate steadily lowers train and validation log loss; a tiny one barely moves; an oversized one makes loss spike or become unstable.

**You'll be able to say:** *"The gradient points in the direction of steepest increase of the loss, so gradient descent moves weights the opposite way: `w ← w − η∇L(w)`. Too small a learning rate crawls; too large overshoots or diverges. Batch uses all rows, SGD one noisy row, mini-batch a practical middle. Momentum smooths updates with velocity; Adam adapts per-parameter step sizes from first and second moments."*

---

## M3.3 · Regularization

**The idea.** Regularization adds a penalty to the training objective so the model prefers simpler weights unless complexity clearly pays for itself:

**Everyday analogy.** Picture each model weight attached to zero by a spring, while another force pulls it toward fitting the training data. L2 regularization is a smooth spring: large weights get pulled back harder, but many remain nonzero. L1 regularization is more like charging a flat tax per pound carried on a hike; small, barely useful items are dropped entirely, so weak weights become exactly zero.

$$\min_w\ \frac{1}{n}\sum_{i=1}^{n}\ell(f_w(x_i), y_i)+\lambda\Omega(w).$$

For L2 regularization,

$$\Omega(w)=\sum_j w_j^2,$$

which smoothly shrinks many weights toward zero. For L1 regularization,

$$\Omega(w)=\sum_j |w_j|,$$

which often drives some weights exactly to zero, creating sparse models.

The geometry intuition matters. L2's constraint shape is round, so optima tend to slide smoothly. L1's constraint shape has sharp corners on the axes, so the optimum often lands with one or more coefficients exactly zero. That is why L1 can act like feature selection for sparse campaign/category features, while L2 keeps correlated signals but dampens them.

**Worked example — same weights, different penalty.** For weights $[3,4]$:

- L1 penalty is $\lambda(|3|+|4|)=7\lambda$.
- L2 penalty is $\lambda(3^2+4^2)=25\lambda$.

Now sweep $\lambda$ over `{0, 0.01, 0.1, 1, 10}`. At $\lambda=0$, training loss may be lowest but validation can suffer from overfitting. A small positive $\lambda$ can improve validation by shrinking noisy weights. At $\lambda=10$, even useful weights may be crushed; train and validation both degrade from underfitting.

```python
for lam in [0, 0.01, 0.1, 1, 10]:
    model = fit_logistic_regression(C=1 / max(lam, 1e-9))
    print(lam, train_loss(model), val_loss(model), nonzero_weights(model))
```

The right regularization is not the one with the smallest train loss; it is the one that improves validation while preserving real signal.

**You'll be able to say:** *"Regularization adds a penalty to empirical risk. L2 penalizes squared weights and shrinks many coefficients smoothly; L1 penalizes absolute weights and its diamond geometry makes some coefficients exactly zero. Increasing λ lowers variance and overfitting but raises bias when it is too strong."*

---

## Resources
- 3Blue1Brown — Neural Networks (visual gradient descent)
- d2l.ai — Optimization (SGD, momentum, Adam with code)

## Papers
- Adam: A Method for Stochastic Optimization (Kingma & Ba, 2015)

