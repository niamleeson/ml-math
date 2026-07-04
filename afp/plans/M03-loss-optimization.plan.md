# Module Plan — M3 · Loss & optimization

| Field | Value |
|---|---|
| Domain | Domain 0 · ML Foundations |
| Skip if you can already… | derive/explain logloss + L1/L2 and what the optimizer does |
| Maps to (projects) | all |
| Primary structure(s) | S3 Formula + S2 Method |
| Example type | ⚑ Both |
| Sub-lessons | 3 |
| Notebooks | 3 |

## Module hub (the "complete list")
Training a model means choosing what "wrong" costs, then using an optimizer to reduce that cost
without overfitting the training set. This module keeps the genuine math visible — loss formulas,
gradients, updates, and regularizers — but every formula is tied to the answer it lets you give.

- M3.1 · Loss functions
- M3.2 · Gradient descent & the optimizer
- M3.3 · Regularization

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is a loss and why minimize average loss (empirical risk)? → M3.1
- Derive log loss from the Bernoulli likelihood; what does it penalize? → M3.1
- Regression losses (MSE/MAE/Huber) — when each? → M3.1
- What does a gradient-descent step do (w←w−η∇L), and what is the gradient? → M3.2
- Learning rate: effect of too big/too small? → M3.2
- Batch vs stochastic vs mini-batch; what do momentum/Adam add? → M3.2
- L1 vs L2 regularization (sparsity vs shrinkage) — geometry and effect? → M3.3
- How does regularization strength trade bias vs variance? → M3.3

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Loss; empirical risk minimization **ƒ** as average loss over training examples
- Bernoulli likelihood → negative log-likelihood / log loss / cross-entropy **ƒ**
- Regression losses: MSE, MAE, Huber **ƒ**
- Gradient **ƒ**; gradient descent update `w ← w − η∇L(w)` **ƒ**
- Learning rate; batch / stochastic / mini-batch SGD
- Momentum update **ƒ**; Adam first/second-moment updates **ƒ**
- L1 and L2 penalties **ƒ**; sparsity vs shrinkage; regularization strength λ
- Convexity; bias–variance tradeoff

## Sub-lessons

### M3.1 · Loss functions  —  [S3 Formula, 🧮/⚑]
- **Makes answerable:** what a loss is and why minimize average loss; log loss from Bernoulli likelihood and what it penalizes; MSE/MAE/Huber and when each fits.
- **You'll be able to say:** "A loss assigns a cost to one prediction; empirical risk is the average training loss we can actually minimize. For binary labels, the Bernoulli likelihood gives log loss, which heavily penalizes confident wrong probabilities. For regression, MSE punishes large errors strongly, MAE is more outlier-robust, and Huber blends the two."
- **Concepts:** loss, empirical risk **ƒ**, Bernoulli likelihood → log loss **ƒ**, cross-entropy, MSE/MAE/Huber **ƒ**.
- **Key Idea focus:** statement + honest derivation — start from the likelihood for a clicked/not-clicked event, take negative log-likelihood, and interpret the penalty curve.
- **Worked-example shape:** 5 easy + 5 advanced pen-paper: compute log loss for pCTR guesses, derive the two label cases, compare squared/absolute/Huber penalties on the same residuals.
- **Notebook:** Yes — plot log loss vs predicted probability for y=1/y=0 and MSE/MAE/Huber vs residual; `assert` confident-wrong log loss is larger than uncertain-wrong. Break case = an outlier residual where MSE dominates the fit.
- **Real numbers to cite:** y=1 with p=0.9 gives log loss 0.105; p=0.1 gives 2.303; p=0.01 gives 4.605. Residual 10 costs 100 under MSE vs 10 under MAE.

### M3.2 · Gradient descent & the optimizer  —  [S2 Method, ⚑]
- **Makes answerable:** what a gradient-descent step does; what the gradient is; learning-rate effects; batch vs stochastic vs mini-batch; what momentum and Adam add.
- **You'll be able to say:** "The gradient points in the direction of steepest increase of the loss, so gradient descent moves weights the opposite way: `w ← w − η∇L(w)`. Too small a learning rate crawls; too large overshoots or diverges. Batch uses all rows, SGD one noisy row, mini-batch a practical middle. Momentum smooths updates with velocity; Adam adapts per-parameter step sizes from first and second moments."
- **Concepts:** gradient **ƒ**, GD update **ƒ**, learning rate, batch/stochastic/mini-batch SGD, momentum **ƒ**, Adam **ƒ**, convexity.
- **Key Idea focus:** step-by-step pseudocode — compute predictions, compute loss, compute gradient, update weights, repeat while monitoring train/validation loss.
- **Worked-example shape:** 10+5+5 process viz: descend a 1D bowl by hand, then a 2D contour plot, then show noisy mini-batch paths and Adam's per-coordinate adaptation.
- **Notebook:** Yes — optimize a convex logistic-regression toy objective with several learning rates plus SGD/momentum/Adam; `assert` a moderate learning rate reduces loss while an oversized one increases or becomes unstable. Break case = η too large.
- **Real numbers to cite:** for `L(w)=(w−3)^2`, `w=0`, `∇L=-6`, `η=0.1` moves to 0.6; `η=1.0` jumps to 6 and oscillates.

### M3.3 · Regularization  —  [S3 Formula + Applied, ⚑]
- **Makes answerable:** L1 vs L2 regularization, sparsity vs shrinkage, geometry/effect; how regularization strength trades bias vs variance.
- **You'll be able to say:** "Regularization adds a penalty to empirical risk. L2 penalizes squared weights and shrinks many coefficients smoothly; L1 penalizes absolute weights and its diamond geometry makes some coefficients exactly zero. Increasing λ lowers variance and overfitting but raises bias when it is too strong."
- **Concepts:** L1/L2 penalties **ƒ**, λ, sparsity, shrinkage, geometry of constraint regions, bias–variance tradeoff, convexity.
- **Key Idea focus:** formula + applied effect — the same training loss with different penalties changes the fitted coefficients and the train↔validation gap.
- **Worked-example shape:** 5 easy + 5 advanced pen-paper plus applied sweep: draw L1 diamond vs L2 circle, compute penalty values for two weight vectors, sweep λ and read coefficient paths.
- **Notebook:** Yes — fit linear/logistic models with no/L1/L2 regularization on correlated features; `assert` L1 creates more zero coefficients than L2 and strong λ increases train loss. Break case = λ so large the model underfits.
- **Real numbers to cite:** weights `[3, 4]` have L1 penalty 7λ and L2 penalty 25λ; λ sweep `{0, 0.01, 0.1, 1, 10}` shows validation loss first improve then degrade.

## Coverage check
All 8 module questions map to a sub-lesson: loss/empirical risk + log loss + regression losses → M3.1; GD step + learning rate + SGD/momentum/Adam → M3.2; L1/L2 + regularization strength bias↔variance → M3.3. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
Loss/optimizer choices: binary probability → log loss; continuous target with Gaussian-ish noise → MSE;
outlier-heavy regression → MAE/Huber; small/simple convex problem → batch GD is readable; production
large data → mini-batch SGD/Adam; sparse feature selection desired → L1; smooth shrinkage desired → L2.

## Resources (from the guide)
- 3Blue1Brown — Neural Networks (visual gradient descent)
- d2l.ai — Optimization (SGD, momentum, Adam with code)

## SOTA papers (from the guide)
- Adam: A Method for Stochastic Optimization (Kingma & Ba, 2015)

## Notes / caveats
- This module has genuine math: keep the ƒ derivations and update rules, but always attach them to
  the answer the learner needs to give.
- Keep examples CPU-only and ads-flavored where possible: pCTR log loss, validation loss curves, and
  sparse campaign/category features for L1.
