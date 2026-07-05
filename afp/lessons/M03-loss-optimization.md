# M3 · Loss & optimization
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** derive/explain logloss + L1/L2 and what the optimizer does

## Overview

Training a model means choosing what "wrong" costs, then using an optimizer to reduce that cost. A pCTR (predicted click-through rate) model is not trained by wishing for high AUC (area under the ROC curve); it is trained by assigning loss to predicted probabilities, taking steps that reduce average loss, and controlling the model so it does not simply fit the training set.

This module keeps the real math visible because the math is the explanation: log loss comes from the Bernoulli likelihood, gradients tell the optimizer which way is uphill, and L1/L2 penalties change the fitted weights.

**By the end you can answer:**
- What is a loss, and why minimize average loss over training examples?
- How does Bernoulli likelihood lead to binary log loss, and what does log loss punish?
- When should you use MSE (mean squared error), MAE (mean absolute error), or Huber for regression?
- What is a gradient, and what does the update $w \leftarrow w - \eta\nabla L(w)$ do?
- What happens when the learning rate is too small or too large?
- How do batch, stochastic, and mini-batch gradient descent differ, and what do momentum and Adam (adaptive moment estimation) add?
- How do L1 and L2 regularization differ in sparsity, shrinkage, and geometry?
- How does regularization strength trade bias against variance?

Three sub-lessons:

- **M3.1 Loss functions** — empirical risk, log loss, and regression losses.
- **M3.2 Gradient descent & the optimizer** — gradients, learning rates, SGD (stochastic gradient descent), momentum, and Adam.
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

**Visualizing "Use when" — three pictures.** Each one makes a column of the table concrete.

*1 · The loss shapes — who punishes a big error?*

![MSE, MAE and Huber loss as a function of the residual](afp/assets/m3-loss-shapes.png)

Near zero all three agree, but as the residual grows **MSE (red) shoots up quadratically** while **MAE (blue) rises only linearly**. That single fact *is* the "Use when": pick MSE when large errors *should* dominate the fit (punish them hard; noise ~Gaussian); pick MAE when a few outliers should *not* dominate. Huber (green) traces MSE near zero and MAE in the tails.

*2 · The outlier tug-of-war — where does the fit land?*

![Fitting a single constant to clustered points plus one outlier: the MSE fit is the mean and is dragged toward the outlier, while the MAE median and Huber fits stay with the bulk](afp/assets/m3-loss-outliers.png)

Fit one constant to six clustered points plus an outlier at 60. The MSE-optimal constant is the **mean (17.9)** — dragged a third of the way to the outlier. The MAE-optimal constant is the **median (11.0)**, and Huber lands there too: both stay with the bulk. This is exactly why you reach for MAE/Huber when genuine outliers exist.

*3 · The gradient — why Huber optimizes smoothly.*

![Derivative of each loss: MSE slope is unbounded, MAE slope jumps discontinuously at zero, Huber slope is continuous through zero yet bounded](afp/assets/m3-loss-gradient.png)

The optimizer steps by the loss's slope. **MSE's** slope $2r$ is smooth but unbounded, so one outlier yanks the step. **MAE's** slope is $\pm1$ with a discontinuous jump at 0, so it jitters near the optimum and carries no "how close am I" magnitude. **Huber's** slope is continuous through 0 (smooth, like MSE) yet clipped in the tails (bounded, like MAE) — smooth optimization *plus* robustness.

Reproduce the tug-of-war (example 2) yourself:

```python
import numpy as np
def huber(r, d=1.0):
    a = np.abs(r)
    return np.where(a <= d, 0.5 * r**2, d * (a - 0.5 * d))

y = np.array([9, 10, 10, 11, 12, 13, 60.])                  # clustered points + one outlier
c = np.linspace(8, 62, 20001)
mse_fit = c[np.argmin([((y - t) ** 2).mean() for t in c])]  # = mean   ~ 17.9  (dragged)
mae_fit = c[np.argmin([np.abs(y - t).mean() for t in c])]   # = median = 11.0  (robust)
hub_fit = c[np.argmin([huber(y - t).mean()   for t in c])]  # ~ 11.0          (robust+smooth)
print(mse_fit, mae_fit, hub_fit)
```

**Concrete loss examples — one per loss.**

- **Log loss:** for a clicked impression, predicting $p=0.80$ costs $-\log(0.80)=0.223$; predicting $p=0.20$ costs $-\log(0.20)=1.609$.
- **MSE:** if predicted conversion value is $\hat{y}=30$ and actual is $y=20$, then $r=10$ and MSE costs $10^2=100$.
- **MAE:** on the same residual $r=10$, MAE costs $|10|=10$, so the outlier is not squared.
- **Huber:** with threshold $\delta=1$, residual $r=0.5$ costs $0.5r^2=0.125$, while residual $r=10$ costs $\delta(|r|-0.5\delta)=9.5$.

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

**One training set, five optimizer variants.**

- **Batch GD (gradient descent):** compute one gradient from all 1,000 impressions, then update once; stable, but each step reads the whole dataset.
- **SGD:** update after one impression, such as a single clicked row; cheap, but the step can point in a noisy direction.
- **Mini-batch GD:** update after 128 impressions; the gradient is less noisy than one row and much cheaper than all rows.
- **Momentum:** if five mini-batches in a row all push the bid weight upward, the velocity accumulates and moves faster along that consistent direction.
- **Adam:** if a rare `campaign_id` embedding receives sparse, uneven gradients while dense features update every batch, Adam gives each parameter its own adapted step scale.

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

**A numbered walkthrough — watch regularization rescue an overfit model.** To build the intuition, fit a **degree-9 polynomial** to just **10 noisy points** from a gentle true curve, then watch what an L2 penalty does (reproduce it with the code below).

![Degree-9 fit: with no penalty the curve oscillates wildly through every point; with L2 it smoothly tracks the true curve](afp/assets/m3-reg-fit.png)

1. **Fit with no penalty ($\lambda = 0$).** With 10 free coefficients and 10 points, the polynomial threads *exactly* through every point — **training MSE = 0.0000**. Looks perfect.
2. **Now look between the points (red curve).** To hit every *noisy* point, the curve swings violently up and down; on held-out points its **validation MSE = 42,335** — catastrophic. Training loss said "perfect," validation says "useless." That gap *is* overfitting (high variance).
3. **Find the fingerprint — gigantic weights.** The largest fitted coefficient is **$|w| \approx 48{,}600{,}000$**. Those enormous, nearly-cancelling numbers are what let the curve wiggle hard enough to chase noise.

![Coefficient magnitudes on a log scale: no-penalty weights reach tens of millions, L2 weights stay near single digits](afp/assets/m3-reg-coefs.png)

4. **Make complexity cost something.** Add the L2 penalty: minimize $\text{loss} + \lambda\sum_j w_j^2$. Now every unit of weight has a price, so the optimizer keeps a big coefficient *only* if it lowers the loss more than it adds to the penalty. Noise-chasing wiggles stop being worth it.
5. **Refit with a small $\lambda = 10^{-3}$.** The biggest weight collapses from **48.6 million → 4.6** (green bars). The fitted curve smooths back onto the true shape. Training MSE rises a hair (**0.0000 → 0.0079**) — but validation MSE plummets **42,335 → 0.023**. That trade — pay a little training fit, buy a huge drop in variance — is the entire point of regularization.
6. **Sweep $\lambda$ and watch the U-curve.** Too small → still overfit; too large → the penalty crushes even useful weights toward 0 and the model **underfits** (nearly a flat line). Validation error is **U-shaped** in $\lambda$; the bottom here sits at **$\lambda \approx 1.2\times10^{-3}$**.

![Train MSE rises monotonically with lambda while validation MSE is U-shaped, minimized near lambda 1e-3](afp/assets/m3-reg-ucurve.png)

7. **L1 vs L2 on the same model.** L2 shrinks *all* weights smoothly toward zero. L1 ($\sum_j|w_j|$) instead drives the least-useful weights *exactly* to zero — here Lasso zeros out **5 of the 9** polynomial terms, giving a sparse model that also does feature selection.

**The intuition in one line:** big weights are how a model memorizes noise; regularization makes the model *pay* for weight, so it keeps only the weights that genuinely earn their keep — trading a sliver of training fit for a large cut in variance.

```python
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression, Ridge

rng = np.random.default_rng(7)
x = np.sort(rng.uniform(0, 1, 10))
y = 0.5 + 0.45*np.sin(2*np.pi*x) + rng.normal(0, 0.12, 10)
P = PolynomialFeatures(9, include_bias=False).fit_transform(x[:, None])

lin   = LinearRegression().fit(P, y)   # max|w| ~ 4.9e7   → memorizes noise, val explodes
ridge = Ridge(alpha=1e-3).fit(P, y)    # max|w| ~ 4.6     → smooth, val MSE collapses
print("max weight:", abs(lin.coef_).max(), "->", round(abs(ridge.coef_).max(), 1))
```

**Same sparse ad model, two regularizers.**

- **L1:** if `rare_region_X` has a tiny unstable weight, L1 can drive that coefficient exactly to 0, removing the feature from the linear score.
- **L2:** if `bid` and `daily_budget` are both useful and correlated, L2 tends to keep both nonzero but smaller, such as shrinking weights 2.0 and 1.5 toward 1.2 and 0.9 rather than dropping one.

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

