# M3 · Loss & optimization
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** derive/explain logloss + L1/L2 and what the optimizer does

## Overview

Training a model means choosing what "wrong" costs, then using an optimizer to reduce that cost. A pCTR (predicted click-through rate) model is not trained by wishing for high AUC (area under the ROC curve); it is trained by assigning loss to predicted probabilities, taking steps that reduce average loss, and controlling the model so it does not simply fit the training set.

**Each section leads with the concept and a compare-and-contrast, then derives the math — so every formula arrives already motivated.** Log loss will come from the Bernoulli likelihood, gradients will tell the optimizer which way is uphill, and L1/L2 penalties will change the fitted weights.

**By the end you can answer:**
- What is a loss, and why minimize average loss (empirical risk) over training examples?
- How do log loss, MSE (mean squared error), MAE (mean absolute error), and Huber compare — what each penalizes, its gradient, and when to use it?
- How is binary log loss derived from the Bernoulli likelihood, and why is its gradient simply $p - y$?
- How do batch, stochastic (SGD), mini-batch, momentum, and Adam (adaptive moment estimation) compare, and what does the update $w \leftarrow w - \eta\nabla L(w)$ actually do?
- What happens when the learning rate is too small or too large?
- How do L1 and L2 compare in shrinkage, sparsity, geometry, and priors — and how does each enter the weight update?
- How does regularization strength $\lambda$ trade bias against variance?

Three sub-lessons:

- **M3.1 Loss functions** — compare log loss / MSE / MAE / Huber, *then* derive log loss from the Bernoulli likelihood.
- **M3.2 Gradient descent & the optimizer** — compare batch / SGD / mini-batch / momentum / Adam, *then* derive the update, momentum, and Adam.
- **M3.3 Regularization** — compare L1 vs L2 and watch regularization rescue an overfit model, *then* derive weight decay and the L1 sparsity push.

---

## M3.1 · Loss functions

**Concept.** A **loss** assigns a cost to a single prediction. Training minimizes the *average* loss over the training set — the **empirical risk**. The loss you pick *is* your definition of "wrong": how much a miss costs, and which kinds of miss you care about most. Classification and regression use different losses because "wrong" means different things (a wrong probability vs. a wrong number).

**Everyday analogy.** Imagine Alex predicting whether each friend will come to a picnic, then paying a penalty for every bad guess. Saying "I'm 99% sure Priya will come" and being wrong hurts much more than saying "I'm 55% sure" and being wrong; that is log loss punishing confident-but-wrong predictions. The loss is the per-guess penalty, and empirical risk is Alex's average penalty across all past invitations.

**Compare & contrast — four losses.** Read the residual as $r=\hat{y}-y$; for classification the model outputs a probability $p$ for a 0/1 label $y$.

| Loss | Task | Penalizes | Gradient (wrt prediction) | Outlier sensitivity | Use when |
|---|---|---|---|---|---|
| **Log loss** | classification | confident-*wrong* probabilities (→ ∞) | $p - y$ | — (probabilities) | binary / probability outputs (pCTR, pVTR) |
| **MSE** | regression | squared residual $r^2$ | $2r$ (unbounded) | **high** (squares errors) | large errors *should* dominate; noise ≈ Gaussian |
| **MAE** | regression | absolute residual $\lvert r\rvert$ | $\pm 1$ (jumps at 0) | **low** | genuine outliers should *not* dominate |
| **Huber** | regression | quadratic near 0, linear in tails | $r$, then clipped to $\pm\delta$ | low | you want smooth optimization *and* robustness |

The three pictures below make the regression contrast concrete.

*1 · The loss shapes — who punishes a big error?*

![MSE, MAE and Huber loss as a function of the residual](afp/assets/m3-loss-shapes.png)

Near zero all three agree, but as the residual grows **MSE (red) shoots up quadratically** while **MAE (blue) rises only linearly**. That single fact *is* the "use when": pick MSE when large errors *should* dominate the fit; pick MAE when a few outliers should *not*. Huber (green) traces MSE near zero and MAE in the tails.

*2 · The outlier tug-of-war — where does the fit land?*

![Fitting a single constant to clustered points plus one outlier: the MSE fit is the mean and is dragged toward the outlier, while the MAE median and Huber fits stay with the bulk](afp/assets/m3-loss-outliers.png)

Fit one constant to six clustered points plus an outlier at 60. The MSE-optimal constant is the **mean (17.9)** — dragged a third of the way to the outlier. The MAE-optimal constant is the **median (11.0)**, and Huber lands there too: both stay with the bulk. This is exactly why you reach for MAE/Huber when genuine outliers exist.

*3 · The gradient — why Huber optimizes smoothly.*

![Derivative of each loss: MSE slope is unbounded, MAE slope jumps discontinuously at zero, Huber slope is continuous through zero yet bounded](afp/assets/m3-loss-gradient.png)

The optimizer steps by the loss's slope. **MSE's** slope $2r$ is smooth but unbounded, so one outlier yanks the step. **MAE's** slope is $\pm1$ with a discontinuous jump at 0, so it jitters near the optimum and carries no "how close am I" magnitude. **Huber's** slope is continuous through 0 (smooth, like MSE) yet clipped in the tails (bounded, like MAE) — smooth optimization *plus* robustness.

Reproduce the tug-of-war (picture 2) yourself:

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

**Now the derivation — where log loss comes from.** With the concepts in place, the math is short. Training minimizes empirical risk,

$$\hat{R}(\theta) = \frac{1}{n}\sum_{i=1}^{n}\ell(f_\theta(x_i), y_i).$$

For binary pCTR the model predicts a probability $p$ that an impression clicks, and the label $y$ is 0 or 1 — a single **Bernoulli** trial, whose likelihood is

$$P(y\mid p)=p^{y}(1-p)^{1-y}.$$

Maximizing the likelihood over the data is the same as minimizing its **negative log-likelihood**; taking $-\log$ of one term gives binary log loss:

$$\ell(p,y)=-\log P(y\mid p)=-\big[y\log p+(1-y)\log(1-p)\big].$$

So if $y=1$ the loss is $-\log p$; if $y=0$ it is $-\log(1-p)$ — tiny for confident-correct, exploding for confident-wrong.

**Its gradient is remarkably clean**, which is *why* log loss pairs naturally with the sigmoid. Write $p=\sigma(z)$ for logit $z=\mathbf{w}\cdot\mathbf{x}$, and use $\sigma'(z)=\sigma(z)\,(1-\sigma(z))$:

$$\frac{\partial \ell}{\partial z}=\sigma(z)-y = p-y \qquad\Rightarrow\qquad \frac{\partial \ell}{\partial \mathbf{w}}=(p-y)\,\mathbf{x}.$$

The gradient is just **(prediction − label) × feature** — the whole training signal in one expression. The regression losses are their table formulas: MSE $=r^2$, MAE $=\lvert r\rvert$, Huber $=\tfrac12 r^2$ for $\lvert r\rvert\le\delta$ else $\delta(\lvert r\rvert-\tfrac12\delta)$.

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

For a non-click ($y=0$) the logic flips: predicting $p=0.01$ has loss $-\log(0.99)\approx0.010$, while predicting $p=0.90$ has loss $-\log(0.10)=2.303$.

**You'll be able to say:** *"A loss assigns a cost to one prediction; empirical risk is the average training loss we minimize. Log loss (classification) comes from the Bernoulli likelihood and punishes confident-wrong probabilities, with the clean gradient $p-y$. For regression, MSE punishes large errors strongly (and is dragged by outliers), MAE is outlier-robust, and Huber blends the two — quadratic near 0, linear in the tails."*

---

## M3.2 · Gradient descent & the optimizer

**Concept.** The optimizer's one job is to adjust the weights so the average loss goes down. It does this using the **gradient** — the direction in which the loss increases fastest — and stepping the *opposite* way. Everything else (SGD, momentum, Adam) is a variation on *how much of the data each step sees* and *how the step size is chosen*.

**Everyday analogy.** Hiking downhill in thick fog, you cannot see the valley, so you feel which way the ground slopes under your boots and step downhill. The slope you feel is the gradient, stepping opposite it is gradient descent, and your stride length is the learning rate. Tiny steps take forever; huge steps can carry you past the valley and up the other side.

**Compare & contrast — five optimizers.** They differ in how much data each step uses and whether the step size adapts.

| Optimizer | Data per step | Cost / step | Gradient noise | Adds | Use when |
|---|---|---|---|---|---|
| **Batch GD** | all rows | high | none | — | small data; you want the stable, exact direction |
| **SGD** | 1 row | tiny | high | — | huge / streaming data; noise can even help escape saddles |
| **Mini-batch** | a small batch (e.g. 128) | moderate | some | — | the practical default, esp. on GPUs |
| **Momentum** | batch/mini + a velocity | ≈ same | smoothed | accumulated velocity | long ravines; consistent gradient directions |
| **Adam** | mini-batch + gradient moments | ≈ same | adapted | per-parameter step size | sparse/uneven gradients, features at different scales |

**One training set, five variants, made concrete.**

- **Batch GD (gradient descent):** compute one gradient from all 1,000 impressions, then update once; stable, but each step reads the whole dataset.
- **SGD:** update after one impression, such as a single clicked row; cheap, but the step can point in a noisy direction.
- **Mini-batch GD:** update after 128 impressions; the gradient is less noisy than one row and much cheaper than all rows.
- **Momentum:** if five mini-batches in a row all push the bid weight upward, the velocity accumulates and moves faster along that consistent direction.
- **Adam:** if a rare `campaign_id` embedding receives sparse, uneven gradients while dense features update every batch, Adam gives each parameter its own adapted step scale.

**Now the derivation — what a step actually does.** The gradient $\nabla L(w)$ points toward steepest *increase*, so to *decrease* the loss you move against it:

$$w \leftarrow w - \eta\,\nabla L(w).$$

The learning rate $\eta$ is the step size: too small crawls, too large overshoots the low-loss region, oscillates, or diverges. In code the loop is just:

```python
pred = model(x_batch)
loss = loss_fn(pred, y_batch)
grad = gradient(loss, model.weights)
model.weights = optimizer_step(model.weights, grad)   # e.g. w -= lr * grad
```

**Momentum** keeps a running velocity so repeated gradients in the same direction build up speed:

$$v_t=\beta v_{t-1}+\nabla L(w_t),\qquad w_{t+1}=w_t-\eta v_t.$$

**Adam** tracks the first moment $m_t$ (mean gradient) and second moment $v_t$ (mean squared gradient) with exponential averages, then steps by $m_t/(\sqrt{v_t}+\epsilon)$ — a per-parameter learning rate that is large where gradients are small/consistent and small where they are large/erratic.

**Worked example — one step on a bowl.** Let $L(w)=(w-3)^2$, so $\nabla L(w)=2(w-3)$. At $w=0$ the gradient is $-6$.

With $\eta=0.1$:

$$w_{new}=0-0.1(-6)=0.6.$$

The step moves toward 3, lowering loss from 9 to $(0.6-3)^2=5.76$. With $\eta=1.0$ the update jumps to 6; the next gradient is $6$, so it jumps back to 0 — the optimizer oscillates because the step is too large. On a pCTR model the same principle shows up as curves: a moderate learning rate steadily lowers train and validation log loss; a tiny one barely moves; an oversized one makes loss spike or diverge.

**You'll be able to say:** *"The gradient points in the direction of steepest increase, so gradient descent moves weights the opposite way: `w ← w − η∇L(w)`. Too small a learning rate crawls; too large overshoots or diverges. Batch uses all rows (stable, expensive), SGD one noisy row (cheap, scalable), mini-batch the practical middle. Momentum accumulates a velocity to smooth and accelerate; Adam adapts a per-parameter step from the first and second moments of the gradients."*

---

## M3.3 · Regularization

**Concept.** A model minimizing only training loss will happily grow huge weights to memorize noise. **Regularization** adds a penalty on the weights so the model keeps a coefficient *only if it lowers the loss more than it adds to the penalty* — trading a little training fit for a large drop in variance. The two everyday penalties, L1 and L2, differ in *how* they push weights toward zero, and that difference decides whether you get a sparse model or a smoothly shrunk one.

**Everyday analogy.** Picture each model weight attached to zero by a spring, while another force pulls it toward fitting the training data. **L2** is a smooth spring: large weights get pulled back harder, but many remain nonzero. **L1** is more like charging a flat tax per pound carried on a hike; small, barely-useful items are dropped entirely, so weak weights become exactly zero.

**Compare & contrast — L1 vs L2.** Both add $\lambda\,\Omega(w)$ to the objective; they differ in $\Omega$ and therefore in how they enter the gradient.

| Aspect | **L1 (lasso)** | **L2 (ridge)** |
|---|---|---|
| Penalty $\Omega(w)$ | $\sum_j \lvert w_j\rvert$ | $\sum_j w_j^2$ |
| Gradient contribution | $\lambda\,\text{sign}(w_j)$ — a *constant* push | $2\lambda w_j$ — *proportional* to the weight |
| Effect on weights | drives small weights **exactly to 0** | shrinks **all** weights smoothly; rarely exactly 0 |
| Resulting model | sparse → built-in feature selection | dense, dampened; keeps correlated features |
| Constraint geometry | diamond (corners on the axes) | circle |
| Bayesian prior (MAP) | Laplace | Gaussian |
| Use when | many irrelevant features; you want sparsity | correlated/related features you want to keep but shrink |

**Same sparse ad model, two regularizers.**

- **L1:** if `rare_region_X` has a tiny unstable weight, L1 can drive that coefficient exactly to 0, removing the feature from the linear score.
- **L2:** if `bid` and `daily_budget` are both useful and correlated, L2 tends to keep both nonzero but smaller — e.g. shrinking weights 2.0 and 1.5 toward 1.2 and 0.9 rather than dropping one.

**Intuition — watch regularization rescue an overfit model.** Fit a **degree-9 polynomial** to just **10 noisy points** from a gentle true curve, then watch what an L2 penalty does.

![Degree-9 fit: with no penalty the curve oscillates wildly through every point; with L2 it smoothly tracks the true curve](afp/assets/m3-reg-fit.png)

1. **Fit with no penalty ($\lambda = 0$).** With 10 free coefficients and 10 points, the polynomial threads *exactly* through every point — **training MSE = 0.0000**. Looks perfect.
2. **Now look between the points (red curve).** To hit every *noisy* point, the curve swings violently up and down; on held-out points its **validation MSE = 42,335** — catastrophic. Training loss said "perfect," validation says "useless." That gap *is* overfitting (high variance).
3. **Find the fingerprint — gigantic weights.** The largest fitted coefficient is **$|w| \approx 48{,}600{,}000$**. Those enormous, nearly-cancelling numbers are what let the curve wiggle hard enough to chase noise.

![Coefficient magnitudes on a log scale: no-penalty weights reach tens of millions, L2 weights stay near single digits](afp/assets/m3-reg-coefs.png)

4. **Make complexity cost something.** Add the L2 penalty: minimize $\text{loss} + \lambda\sum_j w_j^2$. Now every unit of weight has a price, so the optimizer keeps a big coefficient *only* if it lowers the loss more than it adds to the penalty. Noise-chasing wiggles stop being worth it.
5. **Refit with a small $\lambda = 10^{-3}$.** The biggest weight collapses from **48.6 million → 4.6** (green bars). The fitted curve smooths back onto the true shape. Training MSE rises a hair (**0.0000 → 0.0079**) — but validation MSE plummets **42,335 → 0.023**. That trade — pay a little training fit, buy a huge drop in variance — is the entire point of regularization.
6. **Sweep $\lambda$ and watch the U-curve.** Too small → still overfit; too large → the penalty crushes even useful weights toward 0 and the model **underfits** (nearly a flat line). Validation error is **U-shaped** in $\lambda$; the bottom here sits at **$\lambda \approx 1.2\times10^{-3}$**.

![Train MSE rises monotonically with lambda while validation MSE is U-shaped, minimized near lambda 1e-3](afp/assets/m3-reg-ucurve.png)

7. **L1 vs L2 on the same model.** L2 shrinks *all* weights smoothly toward zero. L1 instead drives the least-useful weights *exactly* to zero — here Lasso zeros out **5 of the 9** polynomial terms, giving a sparse model that also does feature selection.

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

**Now the derivation — how each penalty enters the update.** Add the penalty to empirical risk:

$$\min_w\ \frac{1}{n}\sum_{i=1}^{n}\ell(f_w(x_i), y_i)+\lambda\,\Omega(w).$$

For **L2**, $\Omega(w)=\sum_j w_j^2$, whose gradient is $2\lambda w$. Folding it into the step gives **weight decay** — every weight is scaled down a touch *before* the data's gradient is applied:

$$w \leftarrow (1-2\eta\lambda)\,w \;-\; \eta\,\nabla_{\text{loss}}(w).$$

Because the pull is *proportional* to $w$, large weights are pulled hardest and everything shrinks smoothly, but nothing is forced to exactly 0.

For **L1**, $\Omega(w)=\sum_j \lvert w_j\rvert$, whose (sub)gradient is $\lambda\,\text{sign}(w_j)$ — a **constant** push toward 0 regardless of the weight's size. A small weight receives the same shove as a large one, so weights that don't earn their keep are driven *exactly* to 0. That is the algebra behind the diamond geometry and the sparsity.

**Worked example — same weights, different penalty.** For weights $[3,4]$:

- L1 penalty is $\lambda(|3|+|4|)=7\lambda$.
- L2 penalty is $\lambda(3^2+4^2)=25\lambda$.

Now sweep $\lambda$ over `{0, 0.01, 0.1, 1, 10}`. At $\lambda=0$, training loss may be lowest but validation can suffer from overfitting. A small positive $\lambda$ can improve validation by shrinking noisy weights. At $\lambda=10$, even useful weights are crushed and train and validation both degrade from underfitting.

```python
for lam in [0, 0.01, 0.1, 1, 10]:
    model = fit_logistic_regression(C=1 / max(lam, 1e-9))   # C is inverse regularization
    print(lam, train_loss(model), val_loss(model), nonzero_weights(model))
```

The right regularization is not the one with the smallest train loss; it is the one that improves validation while preserving real signal.

**You'll be able to say:** *"Regularization adds a penalty $\lambda\Omega(w)$ to empirical risk. L2 ($\sum w_j^2$) has gradient $2\lambda w$, giving proportional weight decay that shrinks all weights smoothly (a Gaussian prior). L1 ($\sum|w_j|$) has subgradient $\lambda\,\text{sign}(w)$, a constant push that drives small weights exactly to 0 — sparsity and feature selection (a Laplace prior, diamond geometry). Raising $\lambda$ lowers variance but raises bias when too strong; validation error is U-shaped in $\lambda$."*

---

## Resources
- 3Blue1Brown — Neural Networks (visual gradient descent)
- d2l.ai — Optimization (SGD, momentum, Adam with code)

## Papers
- Adam: A Method for Stochastic Optimization (Kingma & Ba, 2015)
