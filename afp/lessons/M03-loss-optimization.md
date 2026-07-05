# M3 · Loss & optimization
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** derive/explain logloss + L1/L2 and what the optimizer does

## Overview

Training a model is three decisions: **what counts as "wrong"** (the loss), **how to reduce it** (the optimizer), and **how to stop it from cheating** (regularization). This lesson takes each in turn — a comparison table with a plain-English explanation of every option, and one derivation worked out in full so the formulas never feel like magic.

**By the end you can answer:**
- What is a loss, and why do we minimize the *average* loss (empirical risk)?
- How do log loss, MSE, MAE, and Huber differ — what each rewards and punishes?
- Where does binary log loss *come from*, and why is its gradient exactly $p - y$?
- How do batch / SGD / mini-batch / momentum / Adam differ, and what does one optimizer step actually do?
- How do L1 and L2 differ in shrinkage, sparsity, and geometry — and how does $\lambda$ trade bias vs variance?

Three sub-lessons: **M3.1 Loss functions**, **M3.2 The optimizer**, **M3.3 Regularization**.

---

## M3.1 · Loss functions

**Concept.** A **loss** is a number that says how bad one prediction was. Training minimizes the *average* loss over all training rows — the **empirical risk**. Choosing a loss is choosing what "wrong" means: how much a miss costs, and which misses you care about most.

**Everyday analogy.** You bet on whether each friend shows up to dinner and pay a penalty for every bad guess. Saying "99% sure Priya comes" and being wrong should sting far more than saying "55% sure" and being wrong. A loss function is exactly that penalty rule; empirical risk is your average penalty over the whole season.

**Compare the four losses** (read $r = \hat{y}-y$; for classification the model outputs a probability $p$ for a 0/1 label $y$):

| Loss | Task | What it penalizes | Gradient | Outliers |
|---|---|---|---|---|
| **Log loss** | classification | confident *wrong* probabilities | $p - y$ | — |
| **MSE** | regression | the *square* of the error, $r^2$ | $2r$ | very sensitive |
| **MAE** | regression | the *size* of the error, $\lvert r\rvert$ | $\pm 1$ | robust |
| **Huber** | regression | $r^2$ near 0, $\lvert r\rvert$ in the tails | $r$, clipped to $\pm\delta$ | robust |

**What each one means, and when to reach for it:**

- **Log loss (binary cross-entropy)** — the loss for anything that outputs a *probability* (pCTR, pVTR, spam-or-not). Its whole personality is that it punishes **confident and wrong** far harder than **unsure and wrong**: a model that says $p=0.99$ for an impression that doesn't click pays a huge penalty, while $p=0.55$ pays a mild one. That pressure is what makes the probabilities *mean* something. Use it whenever you need a calibrated probability, not just a yes/no.
- **MSE (mean squared error)** — for predicting a *number* (conversion value, watch-time). Squaring the error means a mistake of 10 costs 100 while a mistake of 2 costs 4 — big misses dominate. That's ideal when large errors are genuinely the worst outcome and your noise is roughly bell-shaped, but it also means **one freak outlier can hijack the whole fit**.
- **MAE (mean absolute error)** — same regression setting, but it charges the error's plain size, so a miss of 10 costs 10, not 100. Outliers no longer dominate, which is why MAE is the **robust** choice when your data has genuine extreme values (a campaign that spent 100× the rest). Its downside is a kink at zero that makes optimization a little jittery.
- **Huber** — the compromise: it behaves like MSE for small errors (smooth, easy to optimize, sensitive where it should be) and like MAE for large ones (a big outlier can't blow up the fit). One knob $\delta$ sets the switch-over. Reach for it when you want **both** smooth training and outlier resistance.

The three pictures make the regression contrast physical.

![MSE, MAE and Huber loss as a function of the residual](afp/assets/m3-loss-shapes.png)

*Shape.* Near zero all three agree. As the error grows, **MSE (red) curves upward fast** — big errors hurt disproportionately — while **MAE (blue) rises in a straight line**. Huber (green) hugs MSE in the middle and MAE at the edges.

![Fitting one constant to clustered points plus an outlier: MSE lands at the mean and is pulled toward the outlier; MAE and Huber stay with the bulk](afp/assets/m3-loss-outliers.png)

*Consequence.* Predict a single constant for six clustered points plus one outlier at 60. MSE picks the **mean (17.9)** — dragged a third of the way to the outlier. MAE picks the **median (11.0)**, and Huber agrees. This *is* "robust to outliers," shown in one number.

![Derivative of each loss: MSE slope unbounded, MAE slope jumps at 0, Huber slope smooth through 0 but bounded](afp/assets/m3-loss-gradient.png)

*Why Huber optimizes nicely.* The optimizer steps by the slope. MSE's slope $2r$ is smooth but unbounded (an outlier yanks the step). MAE's slope is $\pm1$ with a jump at 0 (it jitters and carries no "how close am I"). Huber's slope is smooth through 0 yet flat in the tails — the best of both.

**Derivation — where log loss comes from (step by step).** This is the one to know cold.

**Step 1 — one prediction is a biased coin flip.** The label $y$ is 0 or 1. The model outputs $p$, its claimed probability that $y=1$. Grading it = asking "how probable did the model think the thing that *actually happened* was?"

**Step 2 — write that probability in one formula.**
$$P(y \mid p) = p^{\,y}\,(1-p)^{\,1-y}.$$
Check the two cases: if $y=1$ the exponents make it $p^1(1-p)^0 = p$; if $y=0$ it is $p^0(1-p)^1 = 1-p$. One expression covers both — that's the **Bernoulli** distribution.

**Step 3 — a good model makes the data probable.** Across $n$ independent rows, the probability of the whole dataset is the product
$$\mathcal{L} = \prod_{i=1}^{n} p_i^{\,y_i}(1-p_i)^{\,1-y_i}.$$
"Best model" = the one maximizing this **likelihood** (maximum-likelihood estimation).

**Step 4 — take logs to turn the product into a sum.** $\log$ is increasing, so maximizing $\mathcal{L}$ is the same as maximizing $\log\mathcal{L}$ — and logs turn the fragile product of tiny numbers into a stable sum:
$$\log \mathcal{L} = \sum_{i=1}^{n}\Big[\,y_i\log p_i + (1-y_i)\log(1-p_i)\,\Big].$$

**Step 5 — flip the sign so we can minimize.** Optimizers go downhill, so define the loss as the *negative* log-likelihood. Per row:
$$\boxed{\;\ell(p, y) = -\big[\,y\log p + (1-y)\log(1-p)\,\big]\;}$$
That is **log loss** (binary cross-entropy).

**Step 6 — sanity-check its personality.** For a click ($y=1$) it reduces to $\ell=-\log p$: as $p\to1$ the loss $\to 0$ (confident and right, no penalty); as $p\to 0$ the loss $\to \infty$ (confident and wrong, unbounded penalty). That's the "punishes confident-wrong" behavior, straight from the formula.

**Step 7 — the gradient, via the chain rule.** Let $p=\sigma(z)$ with $z=\mathbf{w}\cdot\mathbf{x}$ and $\sigma(z)=\frac{1}{1+e^{-z}}$. We want $\partial\ell/\partial\mathbf{w}$, and the chain rule splits it into three easy pieces:
$$\frac{\partial \ell}{\partial \mathbf{w}} = \frac{\partial \ell}{\partial p}\cdot\frac{\partial p}{\partial z}\cdot\frac{\partial z}{\partial \mathbf{w}}.$$
Piece 1 — differentiate Step 5 and combine the fractions:
$$\frac{\partial \ell}{\partial p} = -\Big(\frac{y}{p} - \frac{1-y}{1-p}\Big) = \frac{p - y}{p(1-p)}.$$
Piece 2 — the sigmoid's derivative is famously $\sigma'(z)=\sigma(z)\big(1-\sigma(z)\big)=p(1-p)$.
Piece 3 — $\dfrac{\partial z}{\partial \mathbf{w}} = \mathbf{x}$.

**Step 8 — multiply and watch it collapse.**
$$\frac{\partial \ell}{\partial \mathbf{w}} = \frac{p-y}{p(1-p)}\cdot p(1-p)\cdot \mathbf{x} = (p - y)\,\mathbf{x}.$$
The $p(1-p)$ cancels exactly. The gradient is **(prediction − label) × feature** — error times input. This clean result is *why* sigmoid and log loss are always paired.

**Worked example — log loss by hand.** For a clicked impression ($y=1$):

| Predicted $p$ | $\ell=-\log p$ | Reading |
|---:|---:|---|
| 0.90 | 0.105 | confident and right — tiny penalty |
| 0.10 | 2.303 | wrong — large penalty |
| 0.01 | 4.605 | confidently wrong — punished hard |

**You'll be able to say:** *"A loss scores one prediction; empirical risk is the average we minimize. Log loss falls out of the Bernoulli likelihood: write $P(y\mid p)=p^y(1-p)^{1-y}$, take $-\log$, and you get $-[y\log p+(1-y)\log(1-p)]$, which punishes confident-wrong probabilities; its gradient is the clean $(p-y)\mathbf{x}$. For regression, MSE squares errors (outlier-sensitive), MAE takes their size (robust), and Huber blends the two."*

---

## M3.2 · The optimizer

**Concept.** The optimizer's only job is to nudge the weights so the average loss goes down. It reads the **gradient** — the direction the loss increases fastest — and steps the opposite way. Every variant (SGD, momentum, Adam) is just a different answer to *how much data does each step see?* and *how big should the step be?*

**Everyday analogy.** You're on a foggy hillside and want the valley. You can't see it, so you feel the slope under your boots and step downhill. The slope is the gradient, stepping against it is gradient descent, and your stride length is the learning rate — tiny strides crawl, giant strides overshoot the valley and climb the far side.

**Compare the five optimizers:**

| Optimizer | Data per step | Step direction | Step size | Adds |
|---|---|---|---|---|
| **Batch GD** | all rows | exact | fixed $\eta$ | — |
| **SGD** | 1 row | noisy | fixed $\eta$ | — |
| **Mini-batch** | a small batch | mostly exact | fixed $\eta$ | — |
| **Momentum** | batch/mini | smoothed | fixed $\eta$ | a velocity |
| **Adam** | mini-batch | smoothed | *adapts per weight* | moments + adaptation |

**What each one is doing, and why you'd pick it:**

- **Batch gradient descent** averages the gradient over *every* training row before taking one step. The direction is the true, exact downhill — very stable — but each step re-reads the whole dataset, so it's hopeless once you have millions of rows. Fine for small problems.
- **SGD (stochastic gradient descent)** goes to the opposite extreme: one row per step. Each step is cheap and you take *lots* of them, but any single row gives a **noisy** direction that only points downhill *on average*. Surprisingly, that noise can help — it knocks the model out of flat spots and shallow traps. The default for huge/streaming data.
- **Mini-batch** is the practical middle and what almost everyone actually uses: average over a small batch (say 128 rows). Enough rows to smooth out most of the noise, few enough to be fast and GPU-friendly. Think "SGD with the jitter turned down."
- **Momentum** notices that plain SGD wastes time zig-zagging across narrow valleys. It keeps a running **velocity**: if the last several steps all pushed the same way, speed builds up in that direction (like a ball rolling downhill gathering pace), while back-and-forth wobbles cancel out. Faster, steadier convergence.
- **Adam (adaptive moment estimation)** gives **each weight its own learning rate**. It tracks a running average of each weight's gradient (direction) and of its squared gradient (how big/erratic it's been), then takes larger steps for weights with small, consistent gradients and smaller steps for weights with large, jumpy ones. That auto-tuning is why Adam is the go-to when features live on wildly different scales or when rare features (like a sparse `campaign_id` embedding) update unevenly.

**What one step actually does.** The gradient $\nabla L(w)$ points toward steepest *increase*, so to *decrease* the loss you move against it:
$$w \leftarrow w - \eta\,\nabla L(w).$$
$\eta$ is the learning rate. **Too small** → the model creeps and training takes forever. **Too large** → each step overshoots the bottom, and the loss oscillates or explodes.

*Worked step.* Take $L(w)=(w-3)^2$, so $\nabla L(w)=2(w-3)$. Start at $w=0$: the gradient is $-6$. With $\eta=0.1$, $w \leftarrow 0 - 0.1(-6) = 0.6$ — the loss drops from $9$ to $5.76$, moving toward the true minimum at $3$. With $\eta=1.0$ instead, $w \leftarrow 0 - 1.0(-6) = 6$: it leaps *past* 3 to the other side, and the next step jumps back to 0 — oscillating forever because the stride is too long.

*The two upgrades, briefly.* **Momentum** keeps a velocity $v_t = \beta v_{t-1} + \nabla L(w_t)$ and steps $w_{t+1}=w_t-\eta v_t$; repeated same-direction gradients accumulate, so it accelerates down long slopes. **Adam** keeps a mean gradient $m_t$ and mean squared gradient $v_t$ and steps by $m_t/(\sqrt{v_t}+\epsilon)$ — the division is the per-weight adaptation.

**You'll be able to say:** *"Gradient descent steps opposite the gradient, $w \leftarrow w - \eta\nabla L$; too-small $\eta$ crawls, too-large overshoots. Batch uses all rows (exact, slow), SGD one row (noisy, scalable), mini-batch the practical middle. Momentum adds a velocity so consistent directions accelerate; Adam gives each weight an adaptive step from the mean and mean-squared gradient."*

---

## M3.3 · Regularization

**Concept.** Left alone, a model minimizing only training loss will grow huge weights to thread through every noisy point — memorizing the training set instead of learning the pattern. **Regularization** adds a penalty on weight size, so the model keeps a big weight *only* if it earns its keep by lowering the loss more than it adds to the penalty. It trades a little training accuracy for a large drop in overfitting.

**Everyday analogy.** Picture every weight tied to zero by a spring while the data tugs it outward. **L2** is a smooth spring — the farther a weight stretches, the harder it's pulled back, so everything ends up small but nonzero. **L1** is a flat toll — a fixed charge for *any* nonzero weight — so weights that barely help stop being worth the toll and snap to exactly zero.

**Compare L1 vs L2:**

| Aspect | **L1 (lasso)** | **L2 (ridge)** |
|---|---|---|
| Penalty | $\sum_j \lvert w_j\rvert$ | $\sum_j w_j^2$ |
| Push on a weight | constant $\lambda\,\text{sign}(w)$ | proportional $2\lambda w$ |
| Effect | drives small weights to **exactly 0** | shrinks **all** weights smoothly |
| Result | sparse — built-in feature selection | dense — dampened, keeps correlated features |
| Geometry | diamond (corners on the axes) | circle |
| Prior (Bayesian view) | Laplace | Gaussian |

**Reading the table with intuition:**

- **The penalty** is what you add to the loss. L2 adds the *squares* of the weights; L1 adds their *absolute sizes*. That one difference drives everything below.
- **The push** is the key. Differentiate the penalty and you get the force pulling each weight toward zero. For **L2** it's $2\lambda w$ — **proportional** to the weight, so a weight of 100 is pulled hard and a weight of 0.01 is barely touched; nothing is ever forced fully to zero. For **L1** it's $\lambda\,\text{sign}(w)$ — a **constant** shove of the same strength no matter how small the weight, so a weight that isn't pulling its weight gets shoved all the way to exactly 0.
- **The result** follows: L2 gives you a **dense** model where every feature survives but shrunken — great when features are correlated and all a bit useful (keep `bid` and `daily_budget`, just smaller). L1 gives you a **sparse** model where irrelevant features vanish — effectively automatic feature selection, handy with thousands of sparse campaign/category features.
- **The geometry** is the classic picture: constraining $\sum|w|$ makes a diamond whose sharp corners sit on the axes, so the best solution often lands *on* a corner (a zero); constraining $\sum w^2$ makes a smooth circle with no corners, so solutions slide to small-but-nonzero values.
- **The prior** is the deep reason: adding L2 is mathematically identical to assuming weights come from a bell-shaped Gaussian (most are small, none exactly zero); adding L1 assumes a spiky Laplace prior (a mass of weights right at zero).

**See it rescue an overfit model.** Fit a wiggly **degree-9 polynomial** to just **10 noisy points**.

![Degree-9 fit: no penalty oscillates wildly through every point; L2 smoothly tracks the true curve](afp/assets/m3-reg-fit.png)

With **no penalty**, the curve threads every point exactly — **train MSE = 0** — but between the points it swings violently, and on held-out data **validation MSE = 42,335**. The fingerprint of that overfitting is enormous weights: the largest coefficient is about **48.6 million**.

![Coefficient magnitudes (log scale): no-penalty weights reach tens of millions; L2 weights stay near single digits](afp/assets/m3-reg-coefs.png)

Add L2 with a small $\lambda=10^{-3}$ and the biggest weight collapses from **48.6 million → 4.6**. The curve smooths back onto the truth: training MSE rises a hair (**0 → 0.008**) while validation MSE plummets (**42,335 → 0.023**). L1 on the same model instead zeros out **5 of the 9** terms — a sparse fit.

![Train MSE rises with lambda while validation MSE is U-shaped, minimized near 1e-3](afp/assets/m3-reg-ucurve.png)

Sweeping $\lambda$ traces a **U-shaped** validation curve: too small still overfits, too large crushes even useful weights into **underfitting**. The sweet spot here is $\lambda \approx 1.2\times10^{-3}$ — the essence of the **bias–variance tradeoff**.

**Derivation — how L2 becomes "weight decay" (step by step).** Add the penalty to the loss:
$$J(w) = \underbrace{\tfrac{1}{n}\textstyle\sum_i \ell_i}_{\text{data loss}} + \lambda \sum_j w_j^2.$$
The penalty's gradient is $\dfrac{\partial}{\partial w}\big(\lambda\sum_j w_j^2\big) = 2\lambda w$. Substitute into the update rule and group the $w$ terms:
$$w \leftarrow w - \eta\big(\nabla_{\!\text{loss}} + 2\lambda w\big) = \underbrace{(1 - 2\eta\lambda)}_{<1}\,w \;-\; \eta\,\nabla_{\!\text{loss}}.$$
Every step first multiplies $w$ by a number slightly below 1 — literally **decaying** the weight toward zero — *then* applies the data's gradient. For **L1**, the penalty's (sub)gradient is $\lambda\,\text{sign}(w)$, a constant that subtracts a fixed amount each step; once a weight is small enough that the data's pull can't overcome that fixed subtraction, it sticks at exactly zero — that's the algebra behind sparsity.

**You'll be able to say:** *"Regularization adds $\lambda\Omega(w)$ to the loss. L2 ($\sum w_j^2$) has gradient $2\lambda w$, a proportional pull that becomes weight decay $w\leftarrow(1-2\eta\lambda)w-\eta\nabla_{\text{loss}}$ and shrinks everything smoothly (a Gaussian prior). L1 ($\sum|w_j|$) has a constant $\lambda\,\text{sign}(w)$ push that snaps small weights to exactly zero — sparsity and feature selection (a Laplace prior). Bigger $\lambda$ cuts variance but adds bias; validation error is U-shaped in $\lambda$."*

---

## Resources
- 3Blue1Brown — Neural Networks (visual gradient descent)
- d2l.ai — Optimization (SGD, momentum, Adam with code)

## Papers
- Adam: A Method for Stochastic Optimization (Kingma & Ba, 2015)
