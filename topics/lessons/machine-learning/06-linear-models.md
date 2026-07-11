# Linear Models: Regression, Logistic Regression, and GLMs
> **Source:** CS 229 · **Category:** Model · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## ✍️ Toy Examples

These tiny examples isolate the computational mechanics from the full lesson. Each toy uses a handful of numbers, prints the intermediate values, and draws one picture so you can trace the math by hand before the larger notebook section.

### ✍️ Toy 1 · normal equations for linear regression

The normal equation turns least squares into one linear solve: build an intercept column, compute $X^TX$ and $X^Ty$, then solve for the intercept and feature weights.

```python
import numpy as np, matplotlib.pyplot as plt

t1_rng = np.random.default_rng(0)  # -> fixed seed for reproducibility
t1_X_raw = np.array([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], dtype=float)  # -> 6 items, 2 features
t1_y = np.array([1, 3, 0, 2, 4, 1], dtype=float)  # -> exact line: 1 + 2*x1 - x2
t1_ones = np.ones((t1_X_raw.shape[0], 1))  # -> column of six 1s
t1_X = np.column_stack([t1_ones, t1_X_raw])  # -> design matrix with intercept, x1, x2
t1_Xt = t1_X.T  # -> shape (3, 6)
t1_XtX = t1_Xt @ t1_X  # -> [[6,5,5],[5,7,5],[5,5,7]]
t1_Xty = t1_Xt @ t1_y  # -> [11,14,8]
t1_theta = np.linalg.solve(t1_XtX, t1_Xty)  # -> [1,2,-1]
t1_yhat = t1_X @ t1_theta  # -> [1,3,0,2,4,1]
t1_residuals = t1_y - t1_yhat  # -> all zeros
t1_sse = np.sum(t1_residuals ** 2)  # -> 0
print("rng seed fixed:", 0)
print("raw features:\n", t1_X_raw)
print("targets:", t1_y)
print("design matrix X:\n", t1_X)
print("X^T X:\n", t1_XtX)
print("X^T y:", t1_Xty)
print("theta [intercept, x1, x2]:", np.round(t1_theta, 3))
print("predictions:", np.round(t1_yhat, 3))
print("residuals:", np.round(t1_residuals, 3))
print("sum squared error:", round(float(t1_sse), 6))
assert np.allclose(t1_theta, np.array([1.0, 2.0, -1.0]))

plt.figure(figsize=(4.6, 3.6))
plt.scatter(t1_y, t1_yhat, s=80, color="tab:blue", edgecolor="black")
plt.plot([0, 4], [0, 4], color="gray", linestyle="--", label="perfect prediction")
plt.xlabel("actual y")
plt.ylabel("predicted y")
plt.title("Normal equation fit lands on the exact targets")
plt.legend()
plt.tight_layout()
plt.show()
plt.close()
```
▶ What you'll see: the $X^TX$ system, the solved weights `[1, 2, -1]`, zero residuals, and predictions on the 45° perfect-fit line.

### ✍️ Toy 2 · one squared-loss gradient step

Gradient descent does not solve the whole system at once. It starts with a guess, computes prediction errors, forms the gradient $X^T(X\theta-y)/m$, and takes one downhill step.

```python
import numpy as np, matplotlib.pyplot as plt

t2_rng = np.random.default_rng(0)  # -> fixed seed for reproducibility
t2_X_raw = np.array([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], dtype=float)  # -> 6 items, 2 features
t2_y = np.array([1, 3, 0, 2, 4, 1], dtype=float)  # -> regression targets
t2_X = np.column_stack([np.ones(t2_X_raw.shape[0]), t2_X_raw])  # -> intercept + features
t2_theta = np.array([0.0, 0.0, 0.0])  # -> deliberately bad starting weights
t2_alpha = 0.1  # -> learning rate
t2_pred = t2_X @ t2_theta  # -> [0,0,0,0,0,0]
t2_error = t2_pred - t2_y  # -> [-1,-3,0,-2,-4,-1]
t2_loss = 0.5 * np.mean(t2_error ** 2)  # -> 2.5833
t2_grad = (t2_X.T @ t2_error) / len(t2_y)  # -> [-1.833,-2.333,-1.333]
t2_theta_next = t2_theta - t2_alpha * t2_grad  # -> [0.183,0.233,0.133]
t2_pred_next = t2_X @ t2_theta_next  # -> first downhill predictions
t2_error_next = t2_pred_next - t2_y  # -> smaller errors overall
t2_loss_next = 0.5 * np.mean(t2_error_next ** 2)  # -> 1.6659
print("rng seed fixed:", 0)
print("design matrix X:\n", t2_X)
print("starting theta:", t2_theta)
print("starting predictions:", np.round(t2_pred, 3))
print("starting error:", np.round(t2_error, 3))
print("starting loss:", round(float(t2_loss), 4))
print("gradient:", np.round(t2_grad, 4))
print("next theta:", np.round(t2_theta_next, 4))
print("next predictions:", np.round(t2_pred_next, 3))
print("next error:", np.round(t2_error_next, 3))
print("next loss:", round(float(t2_loss_next), 4))
assert t2_loss_next < t2_loss

plt.figure(figsize=(4.8, 3.6))
plt.plot([0, 1], [t2_loss, t2_loss_next], marker="o", color="crimson")
plt.xticks([0, 1], ["before", "after one step"])
plt.ylabel("half mean squared error")
plt.title("One gradient step lowers squared loss")
plt.tight_layout()
plt.show()
plt.close()
```
▶ What you'll see: the first gradient, the updated weights, and a two-point loss plot dropping after one step.

### ✍️ Toy 3 · logistic sigmoid, log loss, and gradient

Logistic regression maps a linear score through the sigmoid, measures Bernoulli negative log-likelihood, then uses the gradient $X^T(p-y)/m$ to improve the probabilities.

```python
import numpy as np, matplotlib.pyplot as plt

t3_rng = np.random.default_rng(0)  # -> fixed seed for reproducibility
t3_X_raw = np.array([[-2, -1], [-1, -2], [-1, 0], [0, 1], [1, 1], [2, 1]], dtype=float)  # -> 6 items, 2 features
t3_y = np.array([0, 0, 0, 1, 1, 1], dtype=float)  # -> binary labels
t3_X = np.column_stack([np.ones(t3_X_raw.shape[0]), t3_X_raw])  # -> intercept + features
t3_theta = np.array([0.0, 1.0, 0.5])  # -> hand-picked logistic weights
t3_logits = t3_X @ t3_theta  # -> [-2.5,-2,-1,0.5,1.5,2.5]
t3_probs = 1.0 / (1.0 + np.exp(-t3_logits))  # -> [0.076,0.119,0.269,0.622,0.818,0.924]
t3_eps = 1e-12  # -> log safety
t3_loss_terms = -(t3_y * np.log(t3_probs + t3_eps) + (1.0 - t3_y) * np.log(1.0 - t3_probs + t3_eps))  # -> per-example losses
t3_loss = np.mean(t3_loss_terms)  # -> 0.2122
t3_grad = (t3_X.T @ (t3_probs - t3_y)) / len(t3_y)  # -> [-0.029,-0.146,-0.158]
t3_alpha = 0.3  # -> learning rate
t3_theta_next = t3_theta - t3_alpha * t3_grad  # -> [0.009,1.044,0.548]
t3_logits_next = t3_X @ t3_theta_next  # -> updated logits
t3_probs_next = 1.0 / (1.0 + np.exp(-t3_logits_next))  # -> updated probabilities
t3_loss_next = -np.mean(t3_y * np.log(t3_probs_next + t3_eps) + (1.0 - t3_y) * np.log(1.0 - t3_probs_next + t3_eps))  # -> 0.1987
print("rng seed fixed:", 0)
print("design matrix X:\n", t3_X)
print("labels:", t3_y)
print("theta:", t3_theta)
print("logits:", np.round(t3_logits, 3))
print("sigmoid probabilities:", np.round(t3_probs, 3))
print("per-example log losses:", np.round(t3_loss_terms, 4))
print("average log loss:", round(float(t3_loss), 4))
print("gradient:", np.round(t3_grad, 4))
print("theta after one step:", np.round(t3_theta_next, 4))
print("loss after one step:", round(float(t3_loss_next), 4))
assert t3_loss_next < t3_loss

plt.figure(figsize=(4.8, 3.6))
t3_z_grid = np.linspace(-4.0, 4.0, 200)  # -> smooth logit grid
t3_p_grid = 1.0 / (1.0 + np.exp(-t3_z_grid))  # -> sigmoid curve
plt.plot(t3_z_grid, t3_p_grid, color="tab:blue", label="sigmoid")
plt.scatter(t3_logits, t3_probs, c=t3_y, cmap="coolwarm", edgecolor="black", s=80, label="toy points")
plt.axhline(0.5, color="gray", linestyle="--")
plt.axvline(0.0, color="gray", linestyle=":")
plt.xlabel("logit z")
plt.ylabel("P(y=1|x)")
plt.title("Sigmoid turns linear scores into probabilities")
plt.legend()
plt.tight_layout()
plt.show()
plt.close()
```
▶ What you'll see: logits, probabilities, log-loss terms, a downhill gradient step, and the toy points sitting on the sigmoid curve.

### ✍️ Toy 4 · GLM link functions

A GLM starts with the same natural parameter $\eta=\theta^Tx$ but uses a response function suited to the target: identity for Gaussian data, sigmoid for Bernoulli data, and exponential for counts.

```python
import numpy as np, matplotlib.pyplot as plt

t4_rng = np.random.default_rng(0)  # -> fixed seed for reproducibility
t4_X_raw = np.array([[-2, -1], [-1, 0], [0, 1], [1, -1], [1, 1], [2, 0]], dtype=float)  # -> 6 items, 2 features
t4_X = np.column_stack([np.ones(t4_X_raw.shape[0]), t4_X_raw])  # -> intercept + features
t4_theta = np.array([0.2, 0.5, -0.3])  # -> shared linear weights
t4_eta = t4_X @ t4_theta  # -> [-0.5,-0.3,-0.1,1.0,0.4,1.2]
t4_gaussian_mean = t4_eta  # -> identity link response
t4_bernoulli_mean = 1.0 / (1.0 + np.exp(-t4_eta))  # -> sigmoid response in (0,1)
t4_poisson_mean = np.exp(t4_eta)  # -> positive count mean
t4_response_table = np.column_stack([t4_gaussian_mean, t4_bernoulli_mean, t4_poisson_mean])  # -> compare three GLM means
print("rng seed fixed:", 0)
print("raw features:\n", t4_X_raw)
print("design matrix X:\n", t4_X)
print("theta:", t4_theta)
print("natural parameter eta:", np.round(t4_eta, 3))
print("Gaussian identity means:", np.round(t4_gaussian_mean, 3))
print("Bernoulli sigmoid means:", np.round(t4_bernoulli_mean, 3))
print("Poisson exp means:", np.round(t4_poisson_mean, 3))
print("response table [Gaussian, Bernoulli, Poisson]:\n", np.round(t4_response_table, 3))
assert np.all((t4_bernoulli_mean > 0.0) & (t4_bernoulli_mean < 1.0))
assert np.all(t4_poisson_mean > 0.0)

plt.figure(figsize=(5.0, 3.6))
t4_order = np.argsort(t4_eta)  # -> sort by eta for readable curves
plt.plot(t4_eta[t4_order], t4_gaussian_mean[t4_order], "o-", label="Gaussian identity")
plt.plot(t4_eta[t4_order], t4_bernoulli_mean[t4_order], "s-", label="Bernoulli sigmoid")
plt.plot(t4_eta[t4_order], t4_poisson_mean[t4_order], "^-", label="Poisson exp")
plt.xlabel("natural parameter eta")
plt.ylabel("mean response")
plt.title("Same linear eta, different GLM response functions")
plt.legend()
plt.tight_layout()
plt.show()
plt.close()
```
▶ What you'll see: one vector of natural parameters transformed three ways, with Bernoulli means bounded and Poisson means always positive.

### ✍️ Toy 5 · L2 regularization shrinks feature weights

L2 regularization adds a penalty to the normal equations. Here the intercept is left unpenalized while the two feature weights are shrunk by solving $(X^TX+\lambda R)\theta=X^Ty$.

```python
import numpy as np, matplotlib.pyplot as plt

t5_rng = np.random.default_rng(0)  # -> fixed seed for reproducibility
t5_X_raw = np.array([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], dtype=float)  # -> 6 items, 2 features
t5_y = np.array([1, 3, 0, 2, 4, 1], dtype=float)  # -> same regression targets
t5_X = np.column_stack([np.ones(t5_X_raw.shape[0]), t5_X_raw])  # -> intercept + features
t5_XtX = t5_X.T @ t5_X  # -> unregularized normal matrix
t5_Xty = t5_X.T @ t5_y  # -> target side
t5_lambda = 2.0  # -> L2 strength
t5_R = np.diag([0.0, 1.0, 1.0])  # -> do not penalize intercept
t5_theta_ols = np.linalg.solve(t5_XtX, t5_Xty)  # -> [1,2,-1]
t5_theta_l2 = np.linalg.solve(t5_XtX + t5_lambda * t5_R, t5_Xty)  # -> [1.294,1.074,-0.426]
t5_norm_ols = np.linalg.norm(t5_theta_ols[1:])  # -> 2.236
t5_norm_l2 = np.linalg.norm(t5_theta_l2[1:])  # -> 1.155
t5_pred_ols = t5_X @ t5_theta_ols  # -> exact-fit predictions
t5_pred_l2 = t5_X @ t5_theta_l2  # -> shrunken predictions
t5_penalty = t5_lambda * np.sum(t5_theta_l2[1:] ** 2)  # -> L2 penalty contribution
print("rng seed fixed:", 0)
print("X^T X:\n", t5_XtX)
print("X^T y:", t5_Xty)
print("lambda:", t5_lambda)
print("penalty matrix R:\n", t5_R)
print("OLS theta:", np.round(t5_theta_ols, 3))
print("L2 theta:", np.round(t5_theta_l2, 3))
print("OLS feature norm:", round(float(t5_norm_ols), 3))
print("L2 feature norm:", round(float(t5_norm_l2), 3))
print("OLS predictions:", np.round(t5_pred_ols, 3))
print("L2 predictions:", np.round(t5_pred_l2, 3))
print("lambda * ||theta_features||^2:", round(float(t5_penalty), 3))
assert t5_norm_l2 < t5_norm_ols

plt.figure(figsize=(4.8, 3.6))
t5_positions = np.arange(3)  # -> intercept, x1, x2 positions
plt.bar(t5_positions - 0.18, t5_theta_ols, width=0.36, label="OLS")
plt.bar(t5_positions + 0.18, t5_theta_l2, width=0.36, label="L2")
plt.xticks(t5_positions, ["intercept", "x1", "x2"])
plt.ylabel("weight value")
plt.title("L2 regularization shrinks feature weights")
plt.legend()
plt.tight_layout()
plt.show()
plt.close()
```
▶ What you'll see: the ridge system, smaller feature-weight norm after L2, and side-by-side bars showing shrinkage.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- A **linear hypothesis** uses an intercept column and one dot product to make predictions.
- **Least squares** solves the normal equations, while **LMS / gradient descent** reaches a similar line by downhill updates.
- **Locally weighted regression** keeps linear fits but makes them query-specific, so the final curve can bend.
- **Logistic regression** uses the sigmoid to turn scores into probabilities, and **softmax / GLMs** generalize that response-function idea.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and an interactive experiment.

**What we will build, step by step:**
1. **Linear hypothesis** — turn an intercept and feature into one score, $h_\theta(x)=\theta^Tx$.
2. **Least squares and the normal equations** — solve for the line with the smallest squared residuals.
3. **LMS / gradient descent** — improve the same line by many tiny downhill updates.
4. **Locally weighted regression** — fit a fresh nearby line for each query point.
5. **Logistic regression and sigmoid** — convert linear scores into probabilities and a boundary.
6. **Softmax and GLMs** — normalize multiclass scores and see the GLM response-function idea.

### Step 0 — Set up our tools

We import NumPy (arrays, matrix products, random numbers) and Matplotlib (plots). We fix a
random **seed** so the printed numbers are reproducible, and define a tiny `log()` helper so
each line of output has a label.

```python
import numpy as np                       # NumPy: arrays, linear algebra, exponentials, and random samples.
import matplotlib.pyplot as plt          # Matplotlib: draw lines, losses, weights, and probabilities.

np.random.seed(0)                         # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)   # A comfortable default plot size.

def log(label, value):                    # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")           # Format is: [what this is] the value.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Linear hypothesis: one dot product makes predictions

A linear model adds an intercept coordinate $x_0=1$, then computes
$h_\theta(x)=\theta^Tx$. In matrix form, many predictions are just `X @ theta`, which makes
the same formula work for every row at once.

```python
x_demo = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])                 # Five one-dimensional feature values.
y_demo = np.array([-2.2, -0.8, 1.1, 2.9, 5.0])                 # Synthetic targets that roughly follow a line.
X_demo = np.column_stack([np.ones_like(x_demo), x_demo])       # Add x_0=1 so theta[0] is the intercept.
theta_demo = np.array([1.0, 1.8])                              # Choose an intercept and slope by hand.
yhat_demo = X_demo @ theta_demo                                # Compute h_theta(x) for every row at once.
residuals_demo = y_demo - yhat_demo                            # Compare observed targets to predictions.

log("design matrix first rows", X_demo[:3])                    # Show the intercept column and feature column.
log("theta = [intercept, slope]", theta_demo)                  # Show the weights used by the hypothesis.
log("predictions X @ theta", np.round(yhat_demo, 3))           # Show the predicted values.
log("residuals y - prediction", np.round(residuals_demo, 3))   # Show signed prediction errors.

x_line_demo = np.linspace(x_demo.min() - 0.3, x_demo.max() + 0.3, 100)  # Smooth x-grid for drawing the line.
X_line_demo = np.column_stack([np.ones_like(x_line_demo), x_line_demo]) # Add the same intercept column to the grid.
y_line_demo = X_line_demo @ theta_demo                         # Predict the line on the grid.
plt.scatter(x_demo, y_demo, color="black", s=70, label="data") # Draw the synthetic observations.
plt.plot(x_line_demo, y_line_demo, color="tab:blue", lw=2, label=r"$h_\theta(x)$")  # Draw the linear hypothesis.
plt.vlines(x_demo, yhat_demo, y_demo, colors="gray", linestyles="--", label="residuals")  # Draw vertical errors.
plt.xlabel("feature x"); plt.ylabel("target y")                # Label both axes.
plt.title("Linear hypothesis: predictions come from one dot product")  # Add a teaching title.
plt.legend(); plt.show()                                       # Show the legend and render the plot.
```
▶ What you'll see: a straight prediction line, plus dashed residuals showing where the hand-picked line misses.

### Step 2 — Least squares and the normal equations

Least squares chooses $\theta$ to make the squared residuals as small as possible. Setting the
gradient of $\frac12\|X\theta-y\|^2$ to zero gives the normal equations
$X^TX\theta=X^Ty$, which we solve directly on the same tiny data.

```python
XtX_demo = X_demo.T @ X_demo                                  # Compute the normal-equation matrix X^T X.
Xty_demo = X_demo.T @ y_demo                                  # Compute the right-hand side X^T y.
theta_ne_demo = np.linalg.solve(XtX_demo, Xty_demo)           # Solve X^T X theta = X^T y.
yhat_ne_demo = X_demo @ theta_ne_demo                         # Predict with the least-squares theta.
residuals_ne_demo = y_demo - yhat_ne_demo                     # Compute residuals at the optimum.
sse_ne_demo = np.sum(residuals_ne_demo ** 2)                  # Sum squared residuals to inspect the objective.

log("X^T X", XtX_demo)                                        # Show the 2-by-2 linear system matrix.
log("X^T y", np.round(Xty_demo, 3))                           # Show the target side of the equations.
log("normal-equation theta", np.round(theta_ne_demo, 4))      # Show the learned intercept and slope.
log("sum squared error", round(float(sse_ne_demo), 4))        # Show the minimized squared-error value.

y_line_ne_demo = X_line_demo @ theta_ne_demo                  # Predict the fitted line on the plotting grid.
plt.scatter(x_demo, y_demo, color="black", s=70, label="data") # Draw the original data points.
plt.plot(x_line_demo, y_line_ne_demo, color="tab:green", lw=2, label="least-squares fit")  # Draw the OLS line.
plt.vlines(x_demo, yhat_ne_demo, y_demo, colors="crimson", linestyles="--", label="residuals")  # Draw OLS residuals.
plt.xlabel("feature x"); plt.ylabel("target y")               # Label both axes.
plt.title("Normal equations: one solve finds the least-squares line")  # Add a teaching title.
plt.legend(); plt.show()                                      # Show the legend and render the plot.
```
▶ What you'll see: the learned line balances the residuals and reports a smaller squared error than a hand-picked line.

### Step 3 — LMS / gradient descent: walk downhill one update at a time

Gradient descent does not solve the normal equations in one shot. It starts with a rough
$\theta$, computes prediction errors, and repeatedly moves opposite the squared-error gradient
until the loss gets smaller.

```python
theta_gd_demo = np.array([-1.0, -0.5])                         # Start from a deliberately poor intercept and slope.
alpha_demo = 0.08                                               # Choose a small learning rate for stable updates.
steps_demo = 25                                                 # Keep the run short enough to inspect.
losses_demo = []                                                # Store mean squared error at each step.
theta_path_demo = [theta_gd_demo.copy()]                        # Store a few line positions for plotting.

for step_demo in range(steps_demo):                             # Repeat small LMS-style batch updates.
    pred_demo = X_demo @ theta_gd_demo                          # Predict using the current parameters.
    error_demo = pred_demo - y_demo                             # Use prediction-minus-target for the gradient.
    loss_demo = np.mean(error_demo ** 2)                         # Compute mean squared error for this step.
    grad_demo = (X_demo.T @ error_demo) / len(y_demo)            # Average gradient of squared error.
    losses_demo.append(loss_demo)                                # Record the loss before updating.
    theta_gd_demo = theta_gd_demo - alpha_demo * grad_demo       # Step downhill by subtracting the gradient.
    theta_path_demo.append(theta_gd_demo.copy())                 # Save the updated parameters.

log("starting theta", theta_path_demo[0])                       # Show where gradient descent began.
log("first three losses", np.round(losses_demo[:3], 4))         # Show early loss values.
log("last three losses", np.round(losses_demo[-3:], 4))         # Show later loss values after learning.
log("final gradient-descent theta", np.round(theta_gd_demo, 4)) # Show the parameters after updates.

plt.subplot(1, 2, 1)                                            # Left panel: line movement.
plt.scatter(x_demo, y_demo, color="black", s=55, label="data")  # Draw the data.
plt.plot(x_line_demo, X_line_demo @ theta_path_demo[0], "--", color="gray", label="start")  # Draw starting line.
plt.plot(x_line_demo, X_line_demo @ theta_path_demo[8], color="tab:orange", label="step 8")  # Draw middle line.
plt.plot(x_line_demo, X_line_demo @ theta_path_demo[-1], color="tab:blue", lw=2, label="final")  # Draw final line.
plt.xlabel("x"); plt.ylabel("y"); plt.title("LMS lines improve") # Label the left panel.
plt.legend()                                                     # Explain the line snapshots.
plt.subplot(1, 2, 2)                                             # Right panel: loss over time.
plt.plot(losses_demo, marker="o", color="crimson")               # Draw the loss curve.
plt.xlabel("gradient step"); plt.ylabel("MSE")                   # Label the optimization axes.
plt.title("Loss decreases")                                      # Title the right panel.
plt.tight_layout(); plt.show()                                   # Keep panels tidy and render them.
```
▶ What you'll see: the line moves toward the data while the loss curve falls step by step.

### Step 4 — Locally weighted regression: fit a nearby line for each query

A single global line can underfit curved data. Locally weighted regression gives nearby
training points larger Gaussian weights, solves a weighted least-squares problem, and repeats
that process at each query point to make a flexible curve.

```python
x_lwr_demo = np.linspace(-3.0, 3.0, 13)                         # Create one-dimensional inputs across a curved shape.
y_lwr_demo = 0.4 * x_lwr_demo**2 + 0.3 * np.sin(2 * x_lwr_demo) # Create a small synthetic nonlinear target.
X_lwr_demo = np.column_stack([np.ones_like(x_lwr_demo), x_lwr_demo])  # Build intercept-plus-feature rows.
tau_demo = 0.9                                                   # Set the bandwidth controlling how local the fit is.
query_demo = 1.2                                                 # Pick one query location to inspect.
weights_demo = np.exp(-((x_lwr_demo - query_demo) ** 2) / (2 * tau_demo**2))  # Compute Gaussian weights around the query.
W_demo = np.diag(weights_demo)                                   # Put weights on a diagonal matrix.
ridge_demo = 1e-6 * np.eye(2)                                    # Add a tiny ridge guard against singular systems.
theta_local_demo = np.linalg.solve(X_lwr_demo.T @ W_demo @ X_lwr_demo + ridge_demo, X_lwr_demo.T @ W_demo @ y_lwr_demo)  # Solve weighted OLS.
prediction_query_demo = np.array([1.0, query_demo]) @ theta_local_demo  # Predict at the query using the local line.

log("query x", query_demo)                                       # Show the query point.
log("weights near query", np.round(weights_demo, 3))             # Show which data points matter most.
log("local theta", np.round(theta_local_demo, 4))                # Show the query-specific intercept and slope.
log("local prediction", round(float(prediction_query_demo), 4))  # Show the prediction at the query.

grid_lwr_demo = np.linspace(-3.1, 3.1, 100)                      # Create many query points to trace the LWR curve.
curve_lwr_demo = []                                              # Store one local prediction per query.
for q_demo in grid_lwr_demo:                                     # Fit a separate nearby line for each query.
    w_q_demo = np.exp(-((x_lwr_demo - q_demo) ** 2) / (2 * tau_demo**2))  # Compute query-specific weights.
    W_q_demo = np.diag(w_q_demo)                                 # Convert weights to a diagonal matrix.
    theta_q_demo = np.linalg.solve(X_lwr_demo.T @ W_q_demo @ X_lwr_demo + ridge_demo, X_lwr_demo.T @ W_q_demo @ y_lwr_demo)  # Solve local OLS.
    curve_lwr_demo.append(np.array([1.0, q_demo]) @ theta_q_demo) # Save the query prediction.
curve_lwr_demo = np.array(curve_lwr_demo)                        # Convert predictions to an array for plotting.

plt.scatter(x_lwr_demo, y_lwr_demo, c=weights_demo, cmap="viridis", edgecolor="k", s=90, label="data colored by query weight")  # Plot weighted data.
plt.plot(grid_lwr_demo, curve_lwr_demo, color="tab:purple", lw=2, label="LWR curve")  # Draw the flexible curve.
plt.axvline(query_demo, color="gray", linestyle="--", label="query")  # Mark the inspected query.
plt.xlabel("x"); plt.ylabel("y")                                      # Label both axes.
plt.title("Locally weighted regression bends by solving local lines")  # Add a teaching title.
plt.legend(); plt.show()                                               # Show the legend and render the plot.
```
▶ What you'll see: points near the query are brighter, and the LWR curve bends even though each local fit is linear.

### Step 5 — Logistic regression and sigmoid: scores become probabilities

Logistic regression keeps the linear score $z=\theta^Tx$, then passes it through the sigmoid
$g(z)=1/(1+e^{-z})$. The result is a probability in $(0,1)$, and the decision boundary is where
$z=0$ because $g(0)=0.5$.

```python
x_log_demo = np.array([-2.0, -1.0, -0.2, 0.7, 1.5, 2.2])       # One feature for a tiny binary dataset.
y_log_demo = np.array([0, 0, 0, 1, 1, 1])                      # Labels where larger x tends to be class 1.
X_log_demo = np.column_stack([np.ones_like(x_log_demo), x_log_demo])  # Add the intercept column.
theta_log_demo = np.array([-0.1, 1.4])                         # Choose a simple logistic model.
z_log_demo = X_log_demo @ theta_log_demo                       # Compute linear logits.
p_log_demo = 1.0 / (1.0 + np.exp(-z_log_demo))                 # Convert logits to probabilities with sigmoid.
loss_log_demo = -np.mean(y_log_demo * np.log(p_log_demo) + (1 - y_log_demo) * np.log(1 - p_log_demo))  # Compute average log loss.
grad_log_demo = (X_log_demo.T @ (p_log_demo - y_log_demo)) / len(y_log_demo)  # Compute the logistic-loss gradient.
theta_next_log_demo = theta_log_demo - 0.5 * grad_log_demo     # Take one numerical optimization step.

log("logits theta^T x", np.round(z_log_demo, 3))               # Show unbounded linear scores.
log("sigmoid probabilities", np.round(p_log_demo, 3))          # Show probabilities after the sigmoid.
log("average logistic loss", round(float(loss_log_demo), 4))   # Show the Bernoulli negative log-likelihood.
log("theta after one gradient step", np.round(theta_next_log_demo, 4))  # Show the update direction.

z_grid_demo = np.linspace(-6.0, 6.0, 200)                      # Create score values for the sigmoid curve.
p_grid_demo = 1.0 / (1.0 + np.exp(-z_grid_demo))               # Compute sigmoid probabilities on the grid.
plt.plot(z_grid_demo, p_grid_demo, color="tab:blue", lw=2, label="sigmoid")  # Draw the S-shaped mapping.
plt.scatter(z_log_demo, p_log_demo, c=y_log_demo, cmap="coolwarm", edgecolor="k", s=80, label="toy points")  # Place examples on the curve.
plt.axhline(0.5, color="gray", linestyle="--", label="probability 0.5")  # Mark the probability threshold.
plt.axvline(0.0, color="gray", linestyle=":", label="score 0 boundary")  # Mark the logit threshold.
plt.xlabel("linear score z"); plt.ylabel("P(y=1 | x)")         # Label score and probability axes.
plt.title("Logistic regression: sigmoid turns scores into probabilities")  # Add a teaching title.
plt.legend(); plt.show()                                       # Show the legend and render the plot.
```
▶ What you'll see: negative scores map below 0.5, positive scores map above 0.5, and one gradient step updates the probability model.

### Step 6 — Softmax and GLMs: choose the right response for the target

Softmax regression extends logistic regression to $K$ classes by turning several logits into
positive probabilities that sum to 1. The broader GLM pattern is the same: use a linear natural
parameter $\eta=\theta^Tx$, then choose a response function that matches the data type.

```python
logits_demo = np.array([1.3, 0.2, -0.9])                       # Three class scores for one example.
shifted_demo = logits_demo - np.max(logits_demo)               # Shift logits for numerical stability.
exp_scores_demo = np.exp(shifted_demo)                         # Exponentiate to get positive unnormalized scores.
softmax_demo = exp_scores_demo / np.sum(exp_scores_demo)       # Normalize scores into class probabilities.
eta_values_demo = np.array([-1.0, 0.0, 1.0, 2.0])              # Example natural parameters for GLM responses.
gaussian_mean_demo = eta_values_demo                           # Gaussian identity link: mean equals eta.
bernoulli_mean_demo = 1.0 / (1.0 + np.exp(-eta_values_demo))   # Bernoulli logit link: mean is sigmoid(eta).
poisson_mean_demo = np.exp(eta_values_demo)                    # Poisson log link: mean is exp(eta).

log("class logits", logits_demo)                               # Show raw multiclass scores.
log("exp shifted scores", np.round(exp_scores_demo, 4))        # Show positive evidence values.
log("softmax probabilities", np.round(softmax_demo, 4))        # Show normalized probabilities.
log("softmax sum", round(float(np.sum(softmax_demo)), 6))      # Verify probabilities sum to one.
log("eta grid for GLMs", eta_values_demo)                      # Show the natural-parameter values.
log("Bernoulli means sigmoid(eta)", np.round(bernoulli_mean_demo, 3))  # Show one GLM response.

plt.subplot(1, 2, 1)                                           # Left panel: softmax probabilities.
plt.bar(["class 0", "class 1", "class 2"], softmax_demo, color=["tab:blue", "tab:orange", "tab:green"])  # Draw class probabilities.
plt.ylim(0, 1); plt.ylabel("probability")                      # Keep the probability scale readable.
plt.title("Softmax probabilities")                             # Title the softmax panel.
plt.subplot(1, 2, 2)                                           # Right panel: GLM response curves.
plt.plot(eta_values_demo, gaussian_mean_demo, "o-", label="Gaussian identity")  # Plot identity response.
plt.plot(eta_values_demo, bernoulli_mean_demo, "s-", label="Bernoulli sigmoid") # Plot sigmoid response.
plt.plot(eta_values_demo, poisson_mean_demo, "^-", label="Poisson exp")         # Plot exponential response.
plt.xlabel(r"natural parameter $\eta$"); plt.ylabel("mean response")            # Label GLM axes.
plt.title("GLMs reuse a linear eta")                            # Title the GLM panel.
plt.legend(); plt.tight_layout(); plt.show()                    # Show legends, tidy panels, and render.
```
▶ What you'll see: softmax bars form one probability distribution, while GLM curves show different meanings for the same linear score.

---

## 1. Overview

Linear models turn features into one weighted score, $\theta^Tx$. That score can be a real-valued prediction, a log-odds that becomes a probability, a multiclass score in softmax regression, or the natural parameter of a generalized linear model.

**One-line intuition:** learn a hyperplane first; then choose whether its output should mean a number, a probability, a class score, or a distribution parameter.

Linear models are fast, interpretable, and mathematically transparent. They are also the gateway to loss functions, likelihoods, gradient descent, decision boundaries, residual diagnostics, and the generalized linear model view used throughout machine learning and statistics.

## 2. Key Idea

### Linear hypothesis

Add an intercept coordinate $x_0=1$:

$$
x=\begin{bmatrix}1\\x_1\\\vdots\\x_n\end{bmatrix},
\qquad
\theta=\begin{bmatrix}\theta_0\\\theta_1\\\vdots\\\theta_n\end{bmatrix}.
$$

The linear hypothesis is

$$
\boxed{h_\theta(x)=\theta^Tx=\sum_{j=0}^{n}\theta_jx_j}.
$$

Geometrically, $\theta^Tx=c$ is a hyperplane. In regression, the score is the prediction. In binary classification, the score is a logit. In GLMs, the score is the natural parameter $\eta$.

### Least squares and the normal equations

For $m$ training examples, ordinary least squares minimizes

$$
J(\theta)=\frac{1}{2}\sum_{i=1}^{m}\left(h_\theta(x^{(i)})-y^{(i)}\right)^2.
$$

Let $X$ be the design matrix and $y$ the target vector. Then

$$
J(\theta)=\frac{1}{2}(X\theta-y)^T(X\theta-y).
$$

Expand:

$$
\begin{aligned}
J(\theta)
&=\frac{1}{2}\left[(X\theta)^T(X\theta)-2y^TX\theta+y^Ty\right]\\
&=\frac{1}{2}\left[\theta^TX^TX\theta-2\theta^TX^Ty+y^Ty\right].
\end{aligned}
$$

Differentiate:

$$
\nabla_\theta J(\theta)=X^TX\theta-X^Ty.
$$

At the minimum,

$$
\begin{aligned}
X^TX\theta-X^Ty&=0\\
X^TX\theta&=X^Ty.
\end{aligned}
$$

If $X^TX$ is invertible,

$$
\boxed{\theta=(X^TX)^{-1}X^Ty}.
$$

If it is singular or ill-conditioned, use the pseudoinverse $\theta=X^+y$.

### LMS / gradient descent

For one example,

$$
\frac{\partial}{\partial\theta_j}\frac{1}{2}\left(h_\theta(x^{(i)})-y^{(i)}\right)^2
=\left(h_\theta(x^{(i)})-y^{(i)}\right)x_j^{(i)}.
$$

Gradient descent subtracts this derivative. Written with error $y-h_\theta(x)$, the batch LMS update is

$$
\boxed{\forall j,\quad \theta_j\leftarrow\theta_j+\alpha\sum_{i=1}^{m}\left[y^{(i)}-h_\theta\left(x^{(i)}\right)\right]x_j^{(i)}}.
$$

Averaging by $m$ gives the same direction with a rescaled learning rate:

$$
\theta\leftarrow\theta-\alpha\frac{1}{m}X^T(X\theta-y).
$$

### Locally weighted regression

Locally weighted regression fits a query-specific linear model. A training point $x^{(i)}$ receives weight

$$
\boxed{w^{(i)}(x)=\exp\left(-\frac{\left(x^{(i)}-x\right)^2}{2\tau^2}\right)}.
$$

Small $\tau$ makes weights decay quickly; large $\tau$ makes LWR approach global OLS. With $W=\operatorname{diag}(w^{(1)},\ldots,w^{(m)})$,

$$
J_x(\theta)=\frac{1}{2}\sum_{i=1}^m w^{(i)}(x)\left(h_\theta(x^{(i)})-y^{(i)}\right)^2,
$$

and

$$
\boxed{\theta(x)=(X^TWX)^{-1}X^TWy}.
$$

### Logistic regression and sigmoid

The sigmoid is

$$
\boxed{g(z)=\frac{1}{1+e^{-z}}\in(0,1)}.
$$

Logistic regression assumes

$$
y\mid x;\theta\sim\operatorname{Bernoulli}(\phi),
$$

where

$$
\boxed{\phi=p(y=1\mid x;\theta)=g(\theta^Tx)=\frac{1}{1+\exp(-\theta^Tx)}}.
$$

For one example,

$$
p(y\mid x;\theta)=\phi^y(1-\phi)^{1-y}.
$$

The negative log-likelihood is the logistic loss:

$$
\boxed{\ell(\theta)=-\left[y\log\phi+(1-y)\log(1-\phi)\right]}.
$$

The decision boundary is

$$
g(\theta^Tx)=0.5\Longleftrightarrow \theta^Tx=0.
$$

There is no closed-form normal-equation solution for logistic regression, so we optimize numerically.

### Softmax and GLMs

For $K$ classes, softmax regression uses

$$
\boxed{\phi_i=\frac{\exp(\theta_i^Tx)}{\sum_{j=1}^{K}\exp(\theta_j^Tx)}}.
$$

Generalized linear models use exponential-family distributions:

$$
\boxed{p(y;\eta)=b(y)\exp(\eta T(y)-a(\eta))}.
$$

The GLM assumptions are

$$
(1)\quad y\mid x;\theta\sim\operatorname{ExpFamily}(\eta),
$$

$$
(2)\quad h_\theta(x)=\mathbb{E}[y\mid x;\theta],
$$

$$
(3)\quad \eta=\theta^Tx.
$$

OLS is the Gaussian GLM with identity link. Logistic regression is the Bernoulli GLM with logit link. Poisson regression is the count GLM with log link.

## 3. Worked Examples

### Setup

```python
# Import NumPy for vectorized numerical computing.
import numpy as np

# Import Matplotlib for plots and visual diagnostics.
import matplotlib.pyplot as plt

# Import synthetic binary and multiclass datasets from scikit-learn.
from sklearn.datasets import make_classification, make_moons, make_blobs

# Import scikit-learn linear models for comparison fits.
from sklearn.linear_model import LinearRegression, LogisticRegression

# Import train/test splitting for honest classification evaluation.
from sklearn.model_selection import train_test_split

# Import accuracy scoring for classification examples.
from sklearn.metrics import accuracy_score

# Import feature standardization for logistic regression stability.
from sklearn.preprocessing import StandardScaler

# Import pipelines so scaling and modeling happen together.
from sklearn.pipeline import make_pipeline

# Import sys so a missing notebook dependency can be installed with the current interpreter.
import sys

# Try to import ipywidgets for the live experiment.
try:
    # Import the widget function and slider classes when ipywidgets is already installed.
    from ipywidgets import interact, FloatSlider, IntSlider
# Provide a non-interactive fallback when ipywidgets is unavailable.
except ModuleNotFoundError:
    # Define a tiny slider object that stores the default value.
    class _FallbackSlider:
        # Accept the same keyword arguments used by ipywidgets sliders.
        def __init__(self, value, **kwargs):
            # Store the default value so the fallback can call the function once.
            self.value = value
    # Use the fallback slider for float-valued controls.
    FloatSlider = _FallbackSlider
    # Use the fallback slider for integer-valued controls.
    IntSlider = _FallbackSlider
    # Define a fallback interact that runs the function once in non-notebook Python.
    def interact(func, **kwargs):
        # Extract each slider's default value for a normal function call.
        values = {name: widget.value for name, widget in kwargs.items()}
        # Execute the plotting function once with default slider values.
        return func(**values)

# Fix the global random seed for reproducibility.
np.random.seed(229)

# Create a reusable random generator for synthetic noise.
rng = np.random.default_rng(229)

# Set a readable default figure size.
plt.rcParams["figure.figsize"] = (7, 4)

# Turn on light grid lines to make geometry easier to see.
plt.rcParams["axes.grid"] = True

# Define a numerically stable sigmoid helper.
def sigmoid(z):
    # Clip logits so the exponential does not overflow.
    z = np.clip(z, -500, 500)
    # Return the logistic transformation.
    return 1.0 / (1.0 + np.exp(-z))

# Define a helper that adds an intercept column to one-dimensional x-values.
def add_intercept(x):
    # Convert x to a flat array for predictable stacking.
    x = np.asarray(x).reshape(-1)
    # Return a matrix with ones in the first column and x in the second column.
    return np.column_stack([np.ones_like(x), x])

# Define mean squared error for regression summaries.
def mse(y_true, y_pred):
    # Average squared residuals into one scalar error metric.
    return np.mean((y_true - y_pred) ** 2)
```

### Data — swappable sources

```python
# Choose the regression source; valid options are "linear" and "sine".
REGRESSION_SOURCE = "linear"

# Choose the classification source; valid options are "separable", "moons", and "blobs3".
CLASSIFICATION_SOURCE = "separable"

# Define a reusable regression data generator.
def make_regression_data(source="linear", n=80):
    # Create evenly spaced one-dimensional feature values.
    x = np.linspace(-3.0, 3.0, n)
    # Generate linear data when the source is friendly to OLS.
    if source == "linear":
        # Draw Gaussian noise so the line is realistic rather than exact.
        noise = rng.normal(0.0, 0.8, n)
        # Create targets from a known line plus noise.
        y = 1.5 + 2.2 * x + noise
    # Generate nonlinear data when the source should break a global line.
    elif source == "sine":
        # Draw smaller noise so curvature remains visible.
        noise = rng.normal(0.0, 0.25, n)
        # Create targets from a sinusoidal curve plus mild trend.
        y = np.sin(2.0 * x) + 0.25 * x + noise
    # Reject misspelled source names clearly.
    else:
        # Raise a helpful error with valid choices.
        raise ValueError("source must be 'linear' or 'sine'")
    # Return features and targets.
    return x, y

# Define a reusable classification data generator.
def make_classification_data(source="separable", n=180):
    # Generate a linearly separable binary dataset.
    if source == "separable":
        # Make two informative features with a strong margin.
        X, y = make_classification(n_samples=n, n_features=2, n_redundant=0, n_informative=2, n_clusters_per_class=1, class_sep=1.8, random_state=229)
    # Generate nonlinear two moons for the failure case.
    elif source == "moons":
        # Make two interlocking half-circles that a line cannot separate perfectly.
        X, y = make_moons(n_samples=n, noise=0.22, random_state=229)
    # Generate three blobs for softmax regression.
    elif source == "blobs3":
        # Make three compact clusters in two dimensions.
        X, y = make_blobs(n_samples=n, centers=3, cluster_std=1.15, random_state=229)
    # Reject misspelled source names clearly.
    else:
        # Raise a helpful error with valid choices.
        raise ValueError("source must be 'separable', 'moons', or 'blobs3'")
    # Return features and labels.
    return X, y

# Generate the default regression data.
x_preview, y_preview = make_regression_data(REGRESSION_SOURCE)

# Generate the default classification data.
X_preview, y_preview_cls = make_classification_data(CLASSIFICATION_SOURCE)

# Create a preview figure with two panels.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Plot regression points in the first panel.
axes[0].scatter(x_preview, y_preview, color="black", alpha=0.75)

# Label the regression x-axis.
axes[0].set_xlabel("x")

# Label the regression y-axis.
axes[0].set_ylabel("y")

# Title the regression preview with the active source.
axes[0].set_title(f"Regression source: {REGRESSION_SOURCE}")

# Plot classification points in the second panel.
axes[1].scatter(X_preview[:, 0], X_preview[:, 1], c=y_preview_cls, cmap="coolwarm", edgecolor="k")

# Label the first classification feature.
axes[1].set_xlabel("feature 1")

# Label the second classification feature.
axes[1].set_ylabel("feature 2")

# Title the classification preview with the active source.
axes[1].set_title(f"Classification source: {CLASSIFICATION_SOURCE}")

# Prevent subplot labels from overlapping.
plt.tight_layout()

# Display the previews.
plt.show()
```

▶ What you'll see: raw data before fitting. The linear source favors OLS; the moons and sine sources reveal linear-model limitations.

👀 Always inspect geometry before trusting a linear model.

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the linear-model ideas from scratch, one small step at a time. Everything here uses only NumPy + Matplotlib and tiny inline data, so each matrix, residual, update, probability, and normalization is inspectable. Variables carry a `_w` suffix so they never collide with the examples below.

```python
import numpy as np  # NumPy gives us arrays, matrix products, solves, exponentials, and tiny optimization loops.
import matplotlib.pyplot as plt  # Matplotlib lets us see fitted lines, losses, weights, sigmoid curves, and probabilities.
np.random.seed(6)  # fix randomness so every printed number and plot is reproducible.
```

#### 1. Linear hypothesis: turn features into predictions with $X\theta$

A linear hypothesis predicts by weighting features and adding an intercept. We build the bias column by hand so the intercept is just another entry of $\theta$, making the whole model one matrix product: $\hat y=X\theta$. This approach is useful because one formula predicts every row at once and makes later fitting methods use the same design matrix.

```python
x_hyp_w = np.array([0.0, 1.0, 2.0, 3.0])  # create one tiny feature column we can inspect by eye.
y_hyp_w = np.array([1.1, 2.0, 2.9, 4.2])  # create target values that are roughly linear.
X_hyp_w = np.c_[np.ones_like(x_hyp_w), x_hyp_w]  # add a bias column so theta[0] is the intercept.
theta_hyp_w = np.array([1.0, 1.05])  # choose intercept and slope by hand before learning anything.
print("design matrix X:\n", X_hyp_w)  # inspect the bias column and feature column.
print("theta:", theta_hyp_w)  # inspect the parameters used by the hypothesis.
```
▶ What you'll see: each row begins with 1, which lets the intercept participate in the same dot product as the slope.

```python
yhat_hyp_w = X_hyp_w @ theta_hyp_w  # multiply every row by theta to compute h_theta(x) for all points.
resid_hyp_w = y_hyp_w - yhat_hyp_w  # compute residuals so prediction errors are visible.
print("predictions:", np.round(yhat_hyp_w, 3))  # inspect the fitted values from X theta.
print("residuals:", np.round(resid_hyp_w, 3))  # inspect how far each prediction is from the target.
```
▶ What you'll see: the line is close but not perfect, so residuals have small positive and negative values.

```python
x_line_hyp_w = np.linspace(x_hyp_w.min() - 0.2, x_hyp_w.max() + 0.2, 100)  # create smooth x-values for the fitted line.
X_line_hyp_w = np.c_[np.ones_like(x_line_hyp_w), x_line_hyp_w]  # add the same bias column for line predictions.
y_line_hyp_w = X_line_hyp_w @ theta_hyp_w  # compute line predictions with the same hypothesis.
plt.figure(figsize=(5.5, 3.8))  # create a compact regression plot.
plt.scatter(x_hyp_w, y_hyp_w, c="black", s=70, label="data")  # draw the observed points.
plt.plot(x_line_hyp_w, y_line_hyp_w, c="tab:blue", lw=2, label="X theta")  # draw the hand-built fitted line.
plt.xlabel("x")  # label the feature axis.
plt.ylabel("y")  # label the target axis.
plt.legend(loc="best")  # show which marks are data and which are predictions.
plt.title("1: linear hypothesis y-hat = X theta")  # title the figure with the concept number.
plt.show()  # render the hypothesis plot.
```
▶ What you'll see: a straight line produced entirely by the bias column, the feature column, and $\theta$.

*Why it's done this way: the bias-column design turns intercept-plus-slope prediction into one vectorized operation. That keeps the model simple, inspectable, and compatible with both closed-form and iterative fitting.*

#### 2. Least squares and normal equations: solve for the smallest squared error

Least squares chooses $\theta$ to minimize the sum of squared residuals, $\sum_i (y_i-\hat y_i)^2$. For the objective $J(\theta)=\lVert X\theta-y\rVert^2$, the gradient is $2X^\top(X\theta-y)$; setting that gradient to 0 gives $X^\top X\theta=X^\top y$. When $X^\top X$ is invertible, the minimizer is:

$$
\theta=(X^\top X)^{-1}X^\top y
$$

```python
x_ne_w = np.array([0.0, 1.0, 2.0, 4.0])  # choose well-spaced x-values so X^T X is well posed.
y_ne_w = np.array([1.0, 2.1, 2.8, 5.2])  # choose targets with a mostly linear pattern.
X_ne_w = np.c_[np.ones_like(x_ne_w), x_ne_w]  # build the bias-plus-feature design matrix.
XtX_ne_w = X_ne_w.T @ X_ne_w  # compute X^T X, the curvature matrix of squared error.
Xty_ne_w = X_ne_w.T @ y_ne_w  # compute X^T y, the target side of the normal equations.
print("X^T X:\n", XtX_ne_w)  # inspect the left-hand matrix.
print("X^T y:", np.round(Xty_ne_w, 3))  # inspect the right-hand vector.
```
▶ What you'll see: the normal equations compress all data points into a 2×2 system and a 2-entry vector.

```python
theta_ne_w = np.linalg.solve(XtX_ne_w, Xty_ne_w)  # solve X^T X theta = X^T y without explicitly forming an inverse.
yhat_ne_w = X_ne_w @ theta_ne_w  # compute the least-squares predictions.
resid_ne_w = y_ne_w - yhat_ne_w  # compute residuals at the optimum.
sse_ne_w = np.sum(resid_ne_w ** 2)  # compute the minimized squared-error total.
print("theta normal-equation:", np.round(theta_ne_w, 4))  # inspect the learned intercept and slope.
print("residuals:", np.round(resid_ne_w, 4))  # inspect remaining errors after fitting.
print("sum squared error:", round(sse_ne_w, 5))  # inspect the final least-squares cost.
```
▶ What you'll see: the residuals balance around zero because the gradient has been driven to zero.

```python
x_grid_ne_w = np.linspace(x_ne_w.min() - 0.2, x_ne_w.max() + 0.2, 120)  # create x-values for drawing the fitted line.
X_grid_ne_w = np.c_[np.ones_like(x_grid_ne_w), x_grid_ne_w]  # add the bias column to the plotting grid.
y_grid_ne_w = X_grid_ne_w @ theta_ne_w  # compute least-squares line predictions.
plt.figure(figsize=(5.5, 3.8))  # create a figure for the closed-form fit.
plt.scatter(x_ne_w, y_ne_w, c="black", s=70, label="data")  # draw the training points.
plt.plot(x_grid_ne_w, y_grid_ne_w, c="tab:green", lw=2, label="normal-equation fit")  # draw the learned line.
plt.vlines(x_ne_w, yhat_ne_w, y_ne_w, colors="crimson", linestyles="--", label="residuals")  # show vertical errors.
plt.xlabel("x")  # label the input axis.
plt.ylabel("y")  # label the target axis.
plt.legend(loc="best")  # explain points, line, and residuals.
plt.title("2: least squares via normal equations")  # title the figure with the concept number.
plt.show()  # render the least-squares plot.
```
▶ What you'll see: the line threads through the data while dashed residuals show what squared error remains.

*Why it's done this way: squared error has a quadratic bowl shape, so setting its gradient to zero lands at the bottom in one linear solve. Using `np.linalg.solve` is numerically cleaner than writing the inverse, while representing the same normal-equation solution.*

#### 3. LMS / gradient descent: improve $\theta$ by following the error downhill

Least-mean-squares updates parameters a little at a time instead of solving all at once. For one example, the update $\theta\leftarrow\theta+\alpha(y-\hat y)x$ moves in the negative-gradient direction because $(y-\hat y)x$ points toward predictions that reduce squared error. On a batch, we average those directions and watch the loss decrease.

```python
x_lms_w = np.array([0.0, 1.0, 2.0, 3.0])  # create a tiny regression input.
y_lms_w = np.array([0.9, 2.0, 3.1, 4.0])  # create a target that is close to y=1+x.
X_lms_w = np.c_[np.ones_like(x_lms_w), x_lms_w]  # add the intercept feature for gradient descent.
theta_lms_w = np.array([0.0, 0.0])  # start from a deliberately bad flat line.
alpha_lms_w = 0.12  # choose a small learning rate so updates are stable and visible.
print("start theta:", theta_lms_w)  # inspect the initial parameters.
print("learning rate:", alpha_lms_w)  # inspect the step size.
```
▶ What you'll see: the model begins with zero intercept and zero slope, so it underpredicts every positive target.

```python
yhat0_lms_w = X_lms_w @ theta_lms_w  # compute predictions before any update.
err0_lms_w = y_lms_w - yhat0_lms_w  # compute residuals y - y_hat.
grad_step_lms_w = (X_lms_w.T @ err0_lms_w) / len(y_lms_w)  # average the LMS direction across all points.
theta_one_lms_w = theta_lms_w + alpha_lms_w * grad_step_lms_w  # take one downhill step for squared error.
print("initial predictions:", np.round(yhat0_lms_w, 3))  # inspect the bad starting predictions.
print("average LMS direction:", np.round(grad_step_lms_w, 3))  # inspect the direction that raises useful parameters.
print("theta after one step:", np.round(theta_one_lms_w, 3))  # inspect the updated intercept and slope.
```
▶ What you'll see: because predictions are too low, the update increases both intercept and slope.

```python
theta_iter_lms_w = theta_lms_w.copy()  # reset to the same starting theta for a short training run.
loss_lms_w = []  # store mean squared error after each update.
theta_history_lms_w = [theta_iter_lms_w.copy()]  # store lines so we can see them improve.
for step_lms_w in range(10):  # run only a few steps so the process stays inspectable.
    pred_lms_w = X_lms_w @ theta_iter_lms_w  # predict with the current theta.
    err_lms_w = y_lms_w - pred_lms_w  # compute residuals for the current theta.
    loss_lms_w.append(np.mean(err_lms_w ** 2))  # record mean squared error before the update.
    theta_iter_lms_w = theta_iter_lms_w + alpha_lms_w * (X_lms_w.T @ err_lms_w) / len(y_lms_w)  # apply the batch LMS update.
    theta_history_lms_w.append(theta_iter_lms_w.copy())  # save the improved theta.
print("losses:", np.round(loss_lms_w, 4))  # inspect the decreasing error sequence.
print("final theta:", np.round(theta_iter_lms_w, 4))  # inspect the learned parameters after the short run.
```
▶ What you'll see: the loss drops quickly as repeated LMS steps move the line toward the data.

```python
x_grid_lms_w = np.linspace(x_lms_w.min() - 0.2, x_lms_w.max() + 0.2, 100)  # create a smooth plotting grid.
X_grid_lms_w = np.c_[np.ones_like(x_grid_lms_w), x_grid_lms_w]  # add the bias column for grid predictions.
plt.figure(figsize=(8.0, 3.4))  # create a two-panel figure for lines and loss.
plt.subplot(1, 2, 1)  # select the left panel for line improvement.
plt.scatter(x_lms_w, y_lms_w, c="black", s=60, label="data")  # draw the training points.
plt.plot(x_grid_lms_w, X_grid_lms_w @ theta_history_lms_w[0], c="gray", ls="--", label="start")  # draw the initial line.
plt.plot(x_grid_lms_w, X_grid_lms_w @ theta_history_lms_w[3], c="tab:orange", label="step 3")  # draw an intermediate line.
plt.plot(x_grid_lms_w, X_grid_lms_w @ theta_history_lms_w[-1], c="tab:blue", lw=2, label="step 10")  # draw the final line.
plt.xlabel("x")  # label the feature axis.
plt.ylabel("y")  # label the target axis.
plt.legend(loc="best")  # explain the line snapshots.
plt.title("3: LMS line improves")  # title the left panel.
plt.subplot(1, 2, 2)  # select the right panel for loss history.
plt.plot(range(len(loss_lms_w)), loss_lms_w, marker="o", c="crimson")  # draw mean squared error over steps.
plt.xlabel("gradient step")  # label the step axis.
plt.ylabel("MSE")  # label the loss axis.
plt.title("3: loss decreases")  # title the right panel.
plt.tight_layout()  # prevent panel labels from overlapping.
plt.show()  # render both LMS views.
```
▶ What you'll see: the fitted line rotates upward while the mean squared error curve falls.

*Why it's done this way: LMS is cheap, local, and reusable for large datasets where a matrix solve is inconvenient. Each update nudges $\theta$ in the direction that would have made recent predictions closer to their targets.*

#### 4. Locally weighted regression: fit a different nearby line for each query

Ordinary linear regression uses one global line, but nonlinear data may need the line to bend. Locally weighted regression keeps the linear formula but gives each training point a Gaussian weight based on distance to the query, then solves a weighted least-squares problem near that query. Nearby points matter most, so sweeping the query across $x$ produces a smooth curve made from many small local fits.

```python
x_lwr_w = np.array([-3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0])  # create one-dimensional inputs across a curved pattern.
y_lwr_w = np.array([2.8, 1.1, 0.2, 0.0, 0.4, 1.3, 3.1])  # create U-shaped targets that a single line cannot capture.
X_lwr_w = np.c_[np.ones_like(x_lwr_w), x_lwr_w]  # build the local linear design matrix with an intercept.
tau_lwr_w = 1.0  # choose the Gaussian bandwidth that controls how local each fit is.
x_query_lwr_w = 1.5  # choose one query point where we will inspect the weighted fit.
weights_lwr_w = np.exp(-((x_lwr_w - x_query_lwr_w) ** 2) / (2.0 * tau_lwr_w ** 2))  # compute Gaussian neighborhood weights.
print("query x:", x_query_lwr_w)  # inspect the query location.
print("weights:", np.round(weights_lwr_w, 3))  # inspect how nearby points receive larger weights.
```
▶ What you'll see: points near $x=1.5$ receive high weights, while far-left points are almost ignored.

```python
W_lwr_w = np.diag(weights_lwr_w)  # place the point weights on a diagonal matrix for weighted least squares.
ridge_lwr_w = 1e-6 * np.eye(X_lwr_w.shape[1])  # add a tiny ridge guard so the local system is never singular.
theta_lwr_w = np.linalg.solve(X_lwr_w.T @ W_lwr_w @ X_lwr_w + ridge_lwr_w, X_lwr_w.T @ W_lwr_w @ y_lwr_w)  # solve the weighted normal equations.
y_query_lwr_w = np.array([1.0, x_query_lwr_w]) @ theta_lwr_w  # predict at the query using its local line.
print("local theta:", np.round(theta_lwr_w, 4))  # inspect the intercept and slope chosen near the query.
print("local prediction:", round(float(y_query_lwr_w), 4))  # inspect the query's locally weighted prediction.
```
▶ What you'll see: the local slope is tuned to the right side of the curve rather than the whole dataset.

```python
x_grid_lwr_w = np.linspace(-3.2, 3.2, 120)  # create many query locations to trace the locally weighted curve.
y_curve_lwr_w = []  # collect one local prediction per query.
for q_lwr_w in x_grid_lwr_w:  # fit a separate weighted line around each query location.
    w_q_lwr_w = np.exp(-((x_lwr_w - q_lwr_w) ** 2) / (2.0 * tau_lwr_w ** 2))  # compute query-specific Gaussian weights.
    W_q_lwr_w = np.diag(w_q_lwr_w)  # convert weights into the diagonal matrix used by the normal equations.
    theta_q_lwr_w = np.linalg.solve(X_lwr_w.T @ W_q_lwr_w @ X_lwr_w + ridge_lwr_w, X_lwr_w.T @ W_q_lwr_w @ y_lwr_w)  # solve the local fit.
    y_curve_lwr_w.append(np.array([1.0, q_lwr_w]) @ theta_q_lwr_w)  # store the prediction at this query.
y_curve_lwr_w = np.array(y_curve_lwr_w)  # convert the collected predictions into an array for plotting.
print("first five local predictions:", np.round(y_curve_lwr_w[:5], 3))  # inspect part of the fitted curve numerically.
```
▶ What you'll see: each query has its own prediction, so the fitted values can bend instead of staying on one line.

```python
plt.figure(figsize=(5.5, 3.8))  # create a locally weighted regression figure.
plt.scatter(x_lwr_w, y_lwr_w, c=weights_lwr_w, cmap="viridis", edgecolor="k", s=90, label="data weighted for query")  # color data by their query weights.
plt.plot(x_grid_lwr_w, y_curve_lwr_w, c="tab:purple", lw=2, label="locally weighted curve")  # draw the bent prediction curve.
plt.axvline(x_query_lwr_w, c="gray", ls="--", label="query")  # mark the query whose weights are shown.
plt.xlabel("x")  # label the input axis.
plt.ylabel("y")  # label the target axis.
plt.legend(loc="best")  # explain the curve, data, and query marker.
plt.title("4: locally weighted fits bend with the query")  # title the figure with the concept number.
plt.show()  # render the LWR plot.
```
▶ What you'll see: the prediction curve bends through the U-shape, and colors show which points shaped one local fit.

*Why it's done this way: local weighting preserves the simplicity of linear least squares while relaxing the single-global-line assumption. The Gaussian kernel makes influence fade smoothly with distance, so nearby examples dominate without hard cutoffs.*

#### 5. Logistic regression and sigmoid: convert scores into probabilities

Logistic regression still starts with a linear score $z=\theta^\top x$, but classification needs a probability rather than an unbounded real number. The sigmoid $\sigma(z)=\frac{1}{1+e^{-z}}$ maps any score into $(0,1)$, increases monotonically, and crosses 0.5 exactly at $z=0$. That makes a linear boundary in score space while giving calibrated-looking probabilities for log-loss training.

```python
z_sig_w = np.linspace(-6.0, 6.0, 200)  # create scores from very negative to very positive.
p_sig_w = 1.0 / (1.0 + np.exp(-z_sig_w))  # apply the sigmoid formula to convert scores to probabilities.
print("sigmoid(-2), sigmoid(0), sigmoid(2):", np.round(1.0 / (1.0 + np.exp(-np.array([-2.0, 0.0, 2.0]))), 3))  # inspect key probability values.
```
▶ What you'll see: negative scores map below 0.5, zero maps to 0.5, and positive scores map above 0.5.

```python
x_log_w = np.array([-2.0, -1.0, 0.5, 1.5, 2.5])  # create one feature for a tiny binary problem.
y_log_w = np.array([0.0, 0.0, 1.0, 1.0, 1.0])  # create binary labels where larger x tends to mean class 1.
X_log_w = np.c_[np.ones_like(x_log_w), x_log_w]  # add an intercept column for logistic regression.
theta_log_w = np.array([-0.2, 1.1])  # choose a simple logistic model by hand.
z_log_w = X_log_w @ theta_log_w  # compute linear scores before the sigmoid.
p_log_w = 1.0 / (1.0 + np.exp(-z_log_w))  # convert scores into class-1 probabilities.
print("scores:", np.round(z_log_w, 3))  # inspect the unbounded linear scores.
print("probabilities:", np.round(p_log_w, 3))  # inspect sigmoid outputs in [0, 1].
```
▶ What you'll see: points with larger $x$ have larger scores and therefore larger class-1 probabilities.

```python
eps_log_w = 1e-12  # set a tiny clipping value to keep log calculations finite.
loss_log_w = -np.mean(y_log_w * np.log(p_log_w + eps_log_w) + (1.0 - y_log_w) * np.log(1.0 - p_log_w + eps_log_w))  # compute average logistic log-loss.
grad_log_w = (X_log_w.T @ (p_log_w - y_log_w)) / len(y_log_w)  # compute the log-loss gradient for theta.
theta_next_log_w = theta_log_w - 0.4 * grad_log_w  # take one gradient step downhill on log-loss.
print("log-loss before step:", round(loss_log_w, 4))  # inspect the current probability loss.
print("gradient:", np.round(grad_log_w, 4))  # inspect how the probabilities want theta to move.
print("theta after one step:", np.round(theta_next_log_w, 4))  # inspect the one-step update.
```
▶ What you'll see: the gradient step adjusts the intercept and slope to reduce probability error.

```python
plt.figure(figsize=(5.5, 3.8))  # create a sigmoid and probability plot.
plt.plot(z_sig_w, p_sig_w, c="tab:blue", lw=2, label="sigmoid score -> probability")  # draw the sigmoid curve.
plt.scatter(z_log_w, p_log_w, c=y_log_w, cmap="coolwarm", edgecolor="k", s=70, label="toy predictions")  # place examples on the curve.
plt.axhline(0.5, c="gray", ls="--", label="0.5 threshold")  # mark the probability decision threshold.
plt.axvline(0.0, c="gray", ls=":", label="score 0")  # mark the score where sigmoid equals 0.5.
plt.xlabel("linear score z")  # label the score axis.
plt.ylabel("P(y=1 | x)")  # label the probability axis.
plt.legend(loc="best")  # explain curve, examples, and thresholds.
plt.title("5: sigmoid maps scores to probabilities")  # title the figure with the concept number.
plt.show()  # render the logistic-regression probability plot.
```
▶ What you'll see: the S-shaped sigmoid turns any score into a probability and puts the decision threshold at score 0.

*Why it's done this way: the sigmoid is the bridge between a linear score and a Bernoulli probability. Because it is smooth and bounded, log-loss can measure probability mistakes while gradient descent can still adjust the underlying linear parameters.*

#### 6. Softmax and GLMs: normalize many scores into one distribution

A generalized linear model chooses a score formula and a response function that matches the target type. For multiclass classification, softmax takes one logit per class and returns probabilities that are positive and sum to 1. It works by exponentiating logits into positive scores, then dividing by their total:

$$
p_k=\frac{e^{z_k}}{\sum_j e^{z_j}}
$$

```python
logits_sm_w = np.array([1.2, 0.3, -0.7])  # create three class logits for one example.
shift_sm_w = logits_sm_w - np.max(logits_sm_w)  # subtract the maximum for numerical stability without changing probabilities.
exp_sm_w = np.exp(shift_sm_w)  # exponentiate shifted logits to get positive unnormalized scores.
prob_sm_w = exp_sm_w / np.sum(exp_sm_w)  # normalize the positive scores so they sum to 1.
print("logits:", logits_sm_w)  # inspect the raw class scores.
print("exp shifted logits:", np.round(exp_sm_w, 4))  # inspect positive unnormalized evidence.
print("softmax probabilities:", np.round(prob_sm_w, 4))  # inspect the normalized class probabilities.
print("sum:", round(float(np.sum(prob_sm_w)), 6))  # verify the distribution sums to one.
```
▶ What you'll see: the largest logit gets the largest probability, but every class keeps some probability mass.

```python
W_sm_w = np.array([[0.2, -0.1, 0.3], [1.0, 0.4, -0.8]])  # create weights that map bias and one feature to three logits.
x_one_sm_w = np.array([1.0, 2.0])  # create one example with a bias entry and one feature.
logits_one_sm_w = x_one_sm_w @ W_sm_w  # compute one logit per class from the linear model.
prob_one_sm_w = np.exp(logits_one_sm_w - np.max(logits_one_sm_w))  # exponentiate shifted logits for stability.
prob_one_sm_w = prob_one_sm_w / np.sum(prob_one_sm_w)  # normalize logits into a categorical distribution.
print("GLM logits for x:", np.round(logits_one_sm_w, 3))  # inspect the multiclass linear scores.
print("GLM probabilities:", np.round(prob_one_sm_w, 3))  # inspect the predicted class distribution.
```
▶ What you'll see: a linear model produces three logits, and softmax converts them into one valid probability vector.

```python
classes_sm_w = np.array(["class 0", "class 1", "class 2"])  # name the three output classes for plotting.
plt.figure(figsize=(5.5, 3.8))  # create a multiclass probability figure.
plt.bar(classes_sm_w, prob_sm_w, color=["tab:blue", "tab:orange", "tab:green"])  # draw one bar per softmax probability.
plt.ylim(0.0, 1.0)  # keep the y-axis on the probability scale.
plt.ylabel("probability")  # label the probability axis.
plt.title("6: softmax turns logits into a distribution")  # title the figure with the concept number.
plt.show()  # render the softmax bar plot.
```
▶ What you'll see: the three bars are nonnegative and add to 1, forming a categorical distribution.

*Why it's done this way: softmax preserves the ranking of logits while forcing them into a valid multiclass probability distribution. This is the GLM pattern: keep the linear score machinery, then choose the response function that matches the kind of target you need to predict.*

### 🟢 Basics (warm-up)

#### B1. Compute one linear score $\theta^Tx$ with an intercept

**Problem.** Let

$$
x=\begin{bmatrix}1\\2.5\end{bmatrix},\qquad
\theta=\begin{bmatrix}0.7\\1.2\end{bmatrix}.
$$

Compute $h_\theta(x)$.

**Steps.**

$$
\begin{aligned}
h_\theta(x)&=\theta^Tx\\
&=\begin{bmatrix}0.7&1.2\end{bmatrix}\begin{bmatrix}1\\2.5\end{bmatrix}\\
&=0.7\cdot1+1.2\cdot2.5\\
&=0.7+3.0\\
&=3.7.
\end{aligned}
$$

$$
\boxed{h_\theta(x)=3.7}
$$

```python
# Store the feature vector including intercept x_0 = 1.
x_b1 = np.array([1.0, 2.5])

# Store the parameter vector including intercept weight.
theta_b1 = np.array([0.7, 1.2])

# Compute the linear score as a dot product.
score_b1 = theta_b1 @ x_b1

# Print the feature vector.
print("x =", x_b1)

# Print the parameter vector.
print("theta =", theta_b1)

# Print the computed score.
print("theta^T x =", score_b1)
```

#### B2. Convert one score into a sigmoid probability

**Problem.** Convert $z=1.4$ into $g(z)$.

**Steps.**

$$
\begin{aligned}
g(1.4)&=\frac{1}{1+e^{-1.4}}\\
&=\frac{1}{1+0.2465969639}\\
&=0.8021838886.
\end{aligned}
$$

$$
\boxed{g(1.4)\approx0.8022}
$$

```python
# Store one logit value.
z_b2 = 1.4

# Convert the logit to a probability.
p_b2 = sigmoid(z_b2)

# Create a grid of logits for plotting the sigmoid curve.
z_grid_b2 = np.linspace(-6.0, 6.0, 400)

# Evaluate sigmoid on the grid.
p_grid_b2 = sigmoid(z_grid_b2)

# Start a new figure.
plt.figure()

# Plot the full sigmoid curve.
plt.plot(z_grid_b2, p_grid_b2, color="black", label="g(z)")

# Mark the single computed probability.
plt.scatter([z_b2], [p_b2], color="red", s=80, label=f"g({z_b2})={p_b2:.3f}")

# Draw the probability threshold line.
plt.axhline(0.5, color="gray", linestyle="--")

# Label the logit axis.
plt.xlabel("z")

# Label the probability axis.
plt.ylabel("g(z)")

# Title the plot.
plt.title("One sigmoid conversion")

# Show the legend.
plt.legend()

# Display the plot.
plt.show()

# Print the exact computed probability.
print(f"g({z_b2}) = {p_b2:.6f}")
```

▶ What you'll see: $z=1.4$ lands above probability $0.5$.

👀 Positive logits favor class 1; negative logits favor class 0.

#### B3. Compute one LWR weight

**Problem.** Compute $w^{(i)}(x)$ for $x^{(i)}=2.0$, query $x=1.2$, and $\tau=0.5$.

**Steps.**

$$
\begin{aligned}
w^{(i)}(x)&=\exp\left(-\frac{(2.0-1.2)^2}{2(0.5)^2}\right)\\
&=\exp\left(-\frac{0.64}{0.50}\right)\\
&=\exp(-1.28)\\
&\approx0.2780.
\end{aligned}
$$

$$
\boxed{w^{(i)}(1.2)\approx0.2780}
$$

```python
# Store the training point location.
x_train_b3 = 2.0

# Store the query location.
x_query_b3 = 1.2

# Store the bandwidth.
tau_b3 = 0.5

# Compute the squared distance from training point to query.
squared_distance_b3 = (x_train_b3 - x_query_b3) ** 2

# Compute the denominator in the LWR exponent.
denominator_b3 = 2.0 * tau_b3 ** 2

# Compute the final Gaussian-shaped weight.
weight_b3 = np.exp(-squared_distance_b3 / denominator_b3)

# Print the squared distance.
print("squared distance =", squared_distance_b3)

# Print the denominator.
print("2 tau^2 =", denominator_b3)

# Print the LWR weight.
print("weight =", weight_b3)
```


#### B4. Build one design-matrix row $[1,x]$

Goal: add the intercept coordinate to one raw feature value.

```python
x_raw_b4 = 3.2  # Store one scalar feature value before adding an intercept.
x_row_b4 = np.array([1.0, x_raw_b4])  # Build the design-matrix row with x_0 = 1 first.
print("design row =", x_row_b4)  # Display the row used by theta^T x.
```

▶ What you'll see: the raw feature becomes a two-entry row whose first entry is always $1$.

👀 **Takeaway:** the intercept is learned by treating the constant $1$ as another feature.

#### B5. Compute one residual $y-\widehat y$

Goal: measure the signed error of one regression prediction.

```python
y_true_b5 = 6.0  # Store the observed target value.
y_hat_b5 = 4.7  # Store one model prediction for that target.
residual_b5 = y_true_b5 - y_hat_b5  # Subtract prediction from truth to get the signed residual.
print(f"residual = {y_true_b5:.1f} - {y_hat_b5:.1f} = {residual_b5:.1f}")  # Display the residual calculation.
```

▶ What you'll see: a positive residual means the prediction is too low.

👀 **Takeaway:** residuals keep the direction of the model's mistake.

#### B6. Compute squared error for one prediction

Goal: turn one prediction error into the squared loss used by least squares.

```python
y_true_b6 = 2.0  # Store one observed target.
y_hat_b6 = 3.5  # Store one predicted target.
error_b6 = y_hat_b6 - y_true_b6  # Compute prediction minus truth for the loss formula.
squared_error_b6 = error_b6 ** 2  # Square the error so positive and negative misses both cost upward.
print(f"squared error = ({y_hat_b6:.1f} - {y_true_b6:.1f})^2 = {squared_error_b6:.2f}")  # Display the loss contribution.
```

▶ What you'll see: an error of $1.5$ contributes $2.25$ to squared error.

👀 **Takeaway:** least squares penalizes larger misses quadratically.

#### B7. Take one LMS step for one point

Goal: update $\theta$ once using one feature vector and one target.

```python
theta_b7 = np.array([0.5, 1.0])  # Store the current intercept and slope.
x_b7 = np.array([1.0, 2.0])  # Store one training row with intercept included.
y_b7 = 5.0  # Store the observed target for this one row.
alpha_b7 = 0.1  # Choose a small learning rate for one update.
pred_b7 = theta_b7 @ x_b7  # Predict with the current parameters.
error_b7 = y_b7 - pred_b7  # Compute y - h_theta(x) for the LMS update direction.
theta_new_b7 = theta_b7 + alpha_b7 * error_b7 * x_b7  # Apply theta <- theta + alpha error x.
print(f"old theta = {theta_b7}")  # Display the parameters before the step.
print(f"prediction = {pred_b7:.2f}, error = {error_b7:.2f}")  # Display the signal driving the update.
print(f"new theta = {theta_new_b7}")  # Display the parameters after one step.
```

▶ What you'll see: both parameters increase because the prediction was below the target and both features are positive.

👀 **Takeaway:** one LMS step nudges parameters in the direction that would reduce this point's error.

#### B8. Compute MSE of three predictions

Goal: average three squared prediction errors into one regression metric.

```python
y_true_b8 = np.array([1.0, 2.0, 4.0])  # Store three observed targets.
y_hat_b8 = np.array([1.5, 1.8, 3.0])  # Store three model predictions.
mse_b8 = mse(y_true_b8, y_hat_b8)  # Reuse the setup helper to average squared residuals.
print(f"MSE = {mse_b8:.3f}")  # Display the mean squared error.
```

▶ What you'll see: the three errors collapse into one nonnegative score.

👀 **Takeaway:** MSE summarizes typical squared regression error across examples.

#### B9. Compute a tiny $X^TX$ matrix

Goal: form the normal-equation matrix for two design rows.

```python
X_b9 = np.array([[1.0, 0.0], [1.0, 2.0]])  # Store two rows with intercept and one feature.
xtx_b9 = X_b9.T @ X_b9  # Multiply X transpose by X to build the normal-equation matrix.
print("X^T X =")  # Label the matrix output.
print(xtx_b9)  # Display the computed 2-by-2 matrix.
```

▶ What you'll see: the intercept column contributes counts and feature sums to $X^TX$.

👀 **Takeaway:** the normal equations start by summarizing feature-feature products.

#### B10. Compute logistic loss for one labeled example

Goal: evaluate $-[y\log p+(1-y)\log(1-p)]$ for one probability prediction.

```python
y_b10 = 1  # Store one binary label.
z_b10 = 0.8  # Store the model's logit score for that example.
p_b10 = sigmoid(z_b10)  # Convert the score into P(y=1 | x).
loss_b10 = -(y_b10 * np.log(p_b10) + (1 - y_b10) * np.log(1 - p_b10))  # Compute one-example logistic loss.
print(f"p = {p_b10:.3f}")  # Display the predicted probability.
print(f"logistic loss = {loss_b10:.3f}")  # Display the loss for the true label.
```

▶ What you'll see: a confident correct probability gives a loss below $\log 2$.

👀 **Takeaway:** logistic loss rewards assigning high probability to the observed class.

### 🟡 Easy

#### E1. Pen-and-paper: fit a line with the normal equations

**Problem.** Fit $y=\theta_0+\theta_1x$ to $(0,1)$, $(1,3)$, $(2,5)$.

**Step 1: write $X$ and $y$.**

$$
X=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},
\qquad
y=\begin{bmatrix}1\\3\\5\end{bmatrix}.
$$

**Step 2: compute $X^TX$.**

$$
\begin{aligned}
X^TX
&=\begin{bmatrix}1&1&1\\0&1&2\end{bmatrix}
\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix}\\
&=\begin{bmatrix}3&3\\3&5\end{bmatrix}.
\end{aligned}
$$

**Step 3: compute $X^Ty$.**

$$
\begin{aligned}
X^Ty
&=\begin{bmatrix}1&1&1\\0&1&2\end{bmatrix}
\begin{bmatrix}1\\3\\5\end{bmatrix}\\
&=\begin{bmatrix}9\\13\end{bmatrix}.
\end{aligned}
$$

**Step 4: invert and multiply.**

$$
(X^TX)^{-1}=\frac{1}{3\cdot5-3\cdot3}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}
=\frac{1}{6}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}.
$$

$$
\begin{aligned}
\theta
&=(X^TX)^{-1}X^Ty\\
&=\frac{1}{6}\begin{bmatrix}5&-3\\-3&3\end{bmatrix}\begin{bmatrix}9\\13\end{bmatrix}\\
&=\frac{1}{6}\begin{bmatrix}45-39\\-27+39\end{bmatrix}\\
&=\begin{bmatrix}1\\2\end{bmatrix}.
\end{aligned}
$$

**Step 5: residuals.**

$$
\hat y=X\theta=\begin{bmatrix}1\\3\\5\end{bmatrix},
\qquad
r=y-\hat y=\begin{bmatrix}0\\0\\0\end{bmatrix}.
$$

$$
\boxed{\theta_0=1,\quad\theta_1=2,\quad\hat y=1+2x}
$$

#### E2. Coded: OLS line + residual anatomy

**Problem.** Fit OLS to noisy linear data and show the fitted line, residual segments, and residual histogram.

```python
# Generate noisy linear data.
x_e2, y_e2 = make_regression_data("linear", n=70)

# Add an intercept column.
X_e2 = add_intercept(x_e2)

# Solve OLS with the pseudoinverse.
theta_e2 = np.linalg.pinv(X_e2) @ y_e2

# Compute fitted values.
y_hat_e2 = X_e2 @ theta_e2

# Compute residuals as observed minus fitted.
residuals_e2 = y_e2 - y_hat_e2

# Compute mean squared error.
mse_e2 = mse(y_e2, y_hat_e2)

# Create two subplots.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Plot the data points.
axes[0].scatter(x_e2, y_e2, color="black", alpha=0.75, label="data")

# Plot the fitted line.
axes[0].plot(x_e2, y_hat_e2, color="red", linewidth=2, label="OLS fit")

# Draw residual segments one point at a time.
for x_i, y_i, yhat_i in zip(x_e2, y_e2, y_hat_e2):
    # Draw the vertical error between observed and fitted y-values.
    axes[0].plot([x_i, x_i], [yhat_i, y_i], color="gray", alpha=0.35)

# Label the x-axis.
axes[0].set_xlabel("x")

# Label the y-axis.
axes[0].set_ylabel("y")

# Title the line plot.
axes[0].set_title(f"y = {theta_e2[0]:.2f} + {theta_e2[1]:.2f}x")

# Show the legend.
axes[0].legend()

# Plot residual histogram.
axes[1].hist(residuals_e2, bins=14, color="steelblue", edgecolor="black")

# Draw the zero-residual reference.
axes[1].axvline(0.0, color="red", linestyle="--")

# Label the residual axis.
axes[1].set_xlabel("residual")

# Label the count axis.
axes[1].set_ylabel("count")

# Title the histogram.
axes[1].set_title(f"Residuals, MSE={mse_e2:.3f}")

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()

# Print the learned parameters.
print("theta =", theta_e2)
```

▶ What you'll see: the line runs through the center of the data cloud, and residuals are vertical gaps.

👀 OLS minimizes squared vertical gaps, not absolute gaps or perpendicular distances.

#### E3. Pen-and-paper: one LMS batch update by hand

**Problem.** Use

$$
x^{(1)}=\begin{bmatrix}1\\0\end{bmatrix},\ y^{(1)}=1,
\qquad
x^{(2)}=\begin{bmatrix}1\\2\end{bmatrix},\ y^{(2)}=5,
$$

with $\theta=\begin{bmatrix}0\\1\end{bmatrix}$ and $\alpha=0.1$.

**Predictions.**

$$
h_\theta(x^{(1)})=0\cdot1+1\cdot0=0,
\qquad
h_\theta(x^{(2)})=0\cdot1+1\cdot2=2.
$$

**Errors.**

$$
e^{(1)}=1-0=1,
\qquad
e^{(2)}=5-2=3.
$$

**Intercept update.**

$$
\begin{aligned}
\sum_i e^{(i)}x_0^{(i)}&=1\cdot1+3\cdot1=4,\\
\theta_0&\leftarrow0+0.1\cdot4=0.4.
\end{aligned}
$$

**Slope update.**

$$
\begin{aligned}
\sum_i e^{(i)}x_1^{(i)}&=1\cdot0+3\cdot2=6,\\
\theta_1&\leftarrow1+0.1\cdot6=1.6.
\end{aligned}
$$

$$
\boxed{\theta_{new}=\begin{bmatrix}0.4\\1.6\end{bmatrix}}
$$

The new predictions are $0.4$ and $0.4+1.6\cdot2=3.6$, closer to targets $1$ and $5$.

#### E4. Coded: logistic regression from score to probability

**Problem.** Fit logistic regression to separable data and plot the probability field and decision boundary.

```python
# Generate separable binary data.
X_e4, y_e4 = make_classification_data("separable", n=220)

# Split into train and test sets.
X_train_e4, X_test_e4, y_train_e4, y_test_e4 = train_test_split(X_e4, y_e4, test_size=0.30, random_state=229, stratify=y_e4)

# Build a standardized logistic regression pipeline.
model_e4 = make_pipeline(StandardScaler(), LogisticRegression(random_state=229))

# Fit logistic regression to the training data.
model_e4.fit(X_train_e4, y_train_e4)

# Predict held-out classes.
pred_e4 = model_e4.predict(X_test_e4)

# Compute held-out accuracy.
acc_e4 = accuracy_score(y_test_e4, pred_e4)

# Create horizontal grid bounds.
x0_min_e4, x0_max_e4 = X_e4[:, 0].min() - 1.0, X_e4[:, 0].max() + 1.0

# Create vertical grid bounds.
x1_min_e4, x1_max_e4 = X_e4[:, 1].min() - 1.0, X_e4[:, 1].max() + 1.0

# Build a dense prediction grid.
xx_e4, yy_e4 = np.meshgrid(np.linspace(x0_min_e4, x0_max_e4, 250), np.linspace(x1_min_e4, x1_max_e4, 250))

# Flatten the grid into coordinate pairs.
grid_e4 = np.column_stack([xx_e4.ravel(), yy_e4.ravel()])

# Predict class-one probabilities on the grid.
prob_e4 = model_e4.predict_proba(grid_e4)[:, 1].reshape(xx_e4.shape)

# Create two panels.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Create logits for the sigmoid display.
z_e4 = np.linspace(-8.0, 8.0, 400)

# Plot the sigmoid curve.
axes[0].plot(z_e4, sigmoid(z_e4), color="black")

# Mark the probability threshold.
axes[0].axhline(0.5, color="red", linestyle="--")

# Mark the zero-logit boundary.
axes[0].axvline(0.0, color="red", linestyle="--")

# Label the logit axis.
axes[0].set_xlabel("z")

# Label the probability axis.
axes[0].set_ylabel("g(z)")

# Title the sigmoid panel.
axes[0].set_title("Sigmoid probability")

# Plot probability contours.
cf_e4 = axes[1].contourf(xx_e4, yy_e4, prob_e4, levels=20, cmap="coolwarm", alpha=0.75)

# Draw the 0.5 boundary.
axes[1].contour(xx_e4, yy_e4, prob_e4, levels=[0.5], colors="black", linewidths=2)

# Overlay data points.
axes[1].scatter(X_e4[:, 0], X_e4[:, 1], c=y_e4, cmap="coolwarm", edgecolor="k")

# Label the first feature.
axes[1].set_xlabel("feature 1")

# Label the second feature.
axes[1].set_ylabel("feature 2")

# Title the boundary panel.
axes[1].set_title(f"Decision boundary, accuracy={acc_e4:.3f}")

# Add a probability colorbar.
fig.colorbar(cf_e4, ax=axes[1], label="P(y=1|x)")

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()
```

▶ What you'll see: a smooth probability gradient with a straight black $p=0.5$ boundary.

👀 Logistic regression is linear in its boundary but nonlinear in its probability output.

#### E5. Pen-and-paper: Bernoulli logistic likelihood for one example

**Problem.** Let $y=1$ and $z=\theta^Tx=-0.7$. Compute probability, likelihood, log-likelihood, and loss.

**Probability.**

$$
\begin{aligned}
\phi&=g(-0.7)=\frac{1}{1+e^{0.7}}\\
&=\frac{1}{1+2.0137527}\\
&\approx0.3318122.
\end{aligned}
$$

**Likelihood.**

$$
\begin{aligned}
p(y\mid x;\theta)&=\phi^y(1-\phi)^{1-y}\\
&=\phi^1(1-\phi)^0\\
&=0.3318122.
\end{aligned}
$$

**Log-likelihood.**

$$
\log L=\log(0.3318122)\approx-1.1031860.
$$

**Loss.**

$$
\begin{aligned}
\ell&=-\left[y\log\phi+(1-y)\log(1-\phi)\right]\\
&=-\log(0.3318122)\\
&\approx1.1031860.
\end{aligned}
$$

$$
\boxed{\phi\approx0.3318,\quad L\approx0.3318,\quad \log L\approx-1.1032,\quad \ell\approx1.1032}
$$

### 🔴 Advanced

#### A1. Coded: normal equations and gradient descent on one dataset

**Problem.** Fit linear regression by normal equations and gradient descent. Show a loss curve, fitted lines, and residuals.

```python
# Generate one noisy linear dataset.
x_a1, y_a1 = make_regression_data("linear", n=90)

# Add the intercept column.
X_a1 = add_intercept(x_a1)

# Count examples for average gradients.
m_a1 = X_a1.shape[0]

# Compute the closed-form OLS solution.
theta_ne_a1 = np.linalg.pinv(X_a1) @ y_a1

# Initialize gradient descent far from the optimum.
theta_gd_a1 = np.array([-3.0, -1.0])

# Set a stable learning rate.
alpha_a1 = 0.08

# Set the number of epochs.
epochs_a1 = 120

# Create a list for parameter history.
theta_path_a1 = []

# Create a list for loss history.
loss_path_a1 = []

# Run batch gradient descent.
for epoch_a1 in range(epochs_a1):
    # Predict with current parameters.
    pred_a1 = X_a1 @ theta_gd_a1
    # Compute prediction-minus-target errors.
    error_a1 = pred_a1 - y_a1
    # Store average half-MSE loss.
    loss_path_a1.append(0.5 * np.mean(error_a1 ** 2))
    # Store current parameters.
    theta_path_a1.append(theta_gd_a1.copy())
    # Compute average gradient.
    grad_a1 = (X_a1.T @ error_a1) / m_a1
    # Step opposite the gradient.
    theta_gd_a1 = theta_gd_a1 - alpha_a1 * grad_a1

# Convert loss history to an array.
loss_path_a1 = np.array(loss_path_a1)

# Convert parameter history to an array.
theta_path_a1 = np.array(theta_path_a1)

# Compute closed-form predictions.
y_ne_a1 = X_a1 @ theta_ne_a1

# Compute gradient-descent predictions.
y_gd_a1 = X_a1 @ theta_gd_a1

# Compute gradient-descent residuals.
residuals_a1 = y_a1 - y_gd_a1

# Create three panels.
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Plot the optimization loss curve.
axes[0].plot(loss_path_a1, color="black")

# Label the epoch axis.
axes[0].set_xlabel("epoch")

# Label the loss axis.
axes[0].set_ylabel("average half-MSE")

# Title the loss panel.
axes[0].set_title("Gradient descent loss")

# Plot data points.
axes[1].scatter(x_a1, y_a1, color="black", alpha=0.7, label="data")

# Plot normal-equation line.
axes[1].plot(x_a1, y_ne_a1, color="blue", linewidth=2, label="normal equations")

# Plot gradient-descent line.
axes[1].plot(x_a1, y_gd_a1, color="red", linestyle="--", linewidth=2, label="gradient descent")

# Label the feature axis.
axes[1].set_xlabel("x")

# Label the target axis.
axes[1].set_ylabel("y")

# Title the fit panel.
axes[1].set_title("Two ways to the same line")

# Show the legend.
axes[1].legend()

# Plot residuals against x.
axes[2].scatter(x_a1, residuals_a1, color="purple", alpha=0.75)

# Draw a zero-residual line.
axes[2].axhline(0.0, color="black", linestyle="--")

# Label the feature axis.
axes[2].set_xlabel("x")

# Label the residual axis.
axes[2].set_ylabel("residual")

# Title the residual panel.
axes[2].set_title("Residual diagnostic")

# Tighten layout.
plt.tight_layout()

# Display the panels.
plt.show()

# Print closed-form parameters.
print("normal equations theta =", theta_ne_a1)

# Print gradient-descent parameters.
print("gradient descent theta =", theta_gd_a1)
```

▶ What you'll see: loss decreases, and the gradient-descent line nearly overlaps the normal-equation line.

👀 Normal equations solve in one matrix step; gradient descent solves by repeated small updates.

#### A2. Coded: locally weighted regression vs global OLS

**Problem.** On nonlinear data, compare one global line to LWR curves with several $\tau$ values.

```python
# Generate nonlinear sine data.
x_a2, y_a2 = make_regression_data("sine", n=100)

# Build the global design matrix.
X_a2 = add_intercept(x_a2)

# Fit one global OLS line.
theta_global_a2 = np.linalg.pinv(X_a2) @ y_a2

# Compute global OLS predictions.
y_global_a2 = X_a2 @ theta_global_a2

# Create query points for smooth curves.
x_query_a2 = np.linspace(x_a2.min(), x_a2.max(), 220)

# Define one-query LWR prediction.
def lwr_predict_one(x_train, y_train, x_query, tau):
    # Add an intercept column to training features.
    X_train = add_intercept(x_train)
    # Compute query-centered Gaussian weights.
    weights = np.exp(-((x_train - x_query) ** 2) / (2.0 * tau ** 2))
    # Store weights on the diagonal.
    W = np.diag(weights)
    # Compute the weighted normal-equation left side.
    left = X_train.T @ W @ X_train
    # Compute the weighted normal-equation right side.
    right = X_train.T @ W @ y_train
    # Solve using a pseudoinverse for stability.
    theta_local = np.linalg.pinv(left) @ right
    # Build the query feature vector.
    x_vec = np.array([1.0, x_query])
    # Return the local prediction at the query.
    return x_vec @ theta_local

# Store bandwidths to compare.
taus_a2 = [0.20, 0.45, 1.00]

# Compute LWR curves for every bandwidth.
lwr_curves_a2 = {tau: np.array([lwr_predict_one(x_a2, y_a2, xq, tau) for xq in x_query_a2]) for tau in taus_a2}

# Select one query location for weight visualization.
x_focus_a2 = 1.0

# Select one bandwidth for weight visualization.
tau_focus_a2 = 0.45

# Compute focus weights.
weights_focus_a2 = np.exp(-((x_a2 - x_focus_a2) ** 2) / (2.0 * tau_focus_a2 ** 2))

# Create two panels.
fig, axes = plt.subplots(1, 2, figsize=(13, 4))

# Plot weighted points with marker size proportional to weight.
axes[0].scatter(x_a2, y_a2, s=30 + 220 * weights_focus_a2, c=weights_focus_a2, cmap="viridis", edgecolor="k")

# Mark the query location.
axes[0].axvline(x_focus_a2, color="red", linestyle="--")

# Label the x-axis.
axes[0].set_xlabel("x")

# Label the y-axis.
axes[0].set_ylabel("y")

# Title the weight panel.
axes[0].set_title(f"Weights near x={x_focus_a2}")

# Plot original data.
axes[1].scatter(x_a2, y_a2, color="black", alpha=0.55, label="data")

# Plot global OLS line.
axes[1].plot(x_a2, y_global_a2, color="red", linewidth=2, label="global OLS")

# Plot each LWR curve.
for tau, curve in lwr_curves_a2.items():
    # Draw the curve for one bandwidth.
    axes[1].plot(x_query_a2, curve, linewidth=2, label=f"LWR tau={tau}")

# Label the x-axis.
axes[1].set_xlabel("x")

# Label the prediction axis.
axes[1].set_ylabel("prediction")

# Title the curve panel.
axes[1].set_title("Local lines form a nonlinear curve")

# Show the legend.
axes[1].legend()

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()
```

▶ What you'll see: nearby points are weighted heavily, and small-$\tau$ LWR bends with the sine wave.

👀 LWR is locally linear but globally flexible because the fitted parameters depend on the query point.

#### A3. Coded: logistic regression failure on nonlinear classes

**Problem.** Fit linear logistic regression to moons and inspect the underfit boundary.

```python
# Generate nonlinear two-moons data.
X_a3, y_a3 = make_classification_data("moons", n=260)

# Split into train and test sets.
X_train_a3, X_test_a3, y_train_a3, y_test_a3 = train_test_split(X_a3, y_a3, test_size=0.30, random_state=229, stratify=y_a3)

# Build a standardized linear logistic regression model.
model_a3 = make_pipeline(StandardScaler(), LogisticRegression(random_state=229))

# Fit the model.
model_a3.fit(X_train_a3, y_train_a3)

# Predict test labels.
pred_a3 = model_a3.predict(X_test_a3)

# Compute held-out accuracy.
acc_a3 = accuracy_score(y_test_a3, pred_a3)

# Create grid bounds.
x0_min_a3, x0_max_a3 = X_a3[:, 0].min() - 0.6, X_a3[:, 0].max() + 0.6

# Create grid bounds for the second feature.
x1_min_a3, x1_max_a3 = X_a3[:, 1].min() - 0.6, X_a3[:, 1].max() + 0.6

# Build prediction grid.
xx_a3, yy_a3 = np.meshgrid(np.linspace(x0_min_a3, x0_max_a3, 300), np.linspace(x1_min_a3, x1_max_a3, 300))

# Flatten grid coordinates.
grid_a3 = np.column_stack([xx_a3.ravel(), yy_a3.ravel()])

# Predict probabilities over the grid.
prob_a3 = model_a3.predict_proba(grid_a3)[:, 1].reshape(xx_a3.shape)

# Start a figure.
plt.figure(figsize=(7, 5))

# Plot probability contours.
cf_a3 = plt.contourf(xx_a3, yy_a3, prob_a3, levels=20, cmap="coolwarm", alpha=0.75)

# Draw the p=0.5 boundary.
plt.contour(xx_a3, yy_a3, prob_a3, levels=[0.5], colors="black", linewidths=2)

# Overlay true data.
plt.scatter(X_a3[:, 0], X_a3[:, 1], c=y_a3, cmap="coolwarm", edgecolor="k")

# Label the first feature.
plt.xlabel("feature 1")

# Label the second feature.
plt.ylabel("feature 2")

# Title the underfit plot.
plt.title(f"Linear boundary underfits moons, accuracy={acc_a3:.3f}")

# Add probability colorbar.
plt.colorbar(cf_a3, label="P(y=1|x)")

# Display the plot.
plt.show()
```

▶ What you'll see: a straight boundary tries to split curved interlocking moons.

👀 This is an edge case: the model class is too simple in the original feature space.

#### A4. Coded: softmax regression on three classes

**Problem.** Fit multiclass logistic regression and visualize the softmax decision regions.

```python
# Generate three-class blob data.
X_a4, y_a4 = make_classification_data("blobs3", n=240)

# Split into train and test sets.
X_train_a4, X_test_a4, y_train_a4, y_test_a4 = train_test_split(X_a4, y_a4, test_size=0.30, random_state=229, stratify=y_a4)

# Build a standardized multinomial logistic regression model.
model_a4 = make_pipeline(StandardScaler(), LogisticRegression(solver="lbfgs", random_state=229))

# Fit the softmax model.
model_a4.fit(X_train_a4, y_train_a4)

# Predict test labels.
pred_a4 = model_a4.predict(X_test_a4)

# Compute held-out accuracy.
acc_a4 = accuracy_score(y_test_a4, pred_a4)

# Create horizontal bounds.
x0_min_a4, x0_max_a4 = X_a4[:, 0].min() - 1.0, X_a4[:, 0].max() + 1.0

# Create vertical bounds.
x1_min_a4, x1_max_a4 = X_a4[:, 1].min() - 1.0, X_a4[:, 1].max() + 1.0

# Build a dense grid.
xx_a4, yy_a4 = np.meshgrid(np.linspace(x0_min_a4, x0_max_a4, 300), np.linspace(x1_min_a4, x1_max_a4, 300))

# Flatten the grid.
grid_a4 = np.column_stack([xx_a4.ravel(), yy_a4.ravel()])

# Predict class probabilities.
prob_a4 = model_a4.predict_proba(grid_a4)

# Convert probabilities to grid classes.
class_grid_a4 = np.argmax(prob_a4, axis=1).reshape(xx_a4.shape)

# Extract maximum probability as confidence.
confidence_a4 = np.max(prob_a4, axis=1).reshape(xx_a4.shape)

# Create two panels.
fig, axes = plt.subplots(1, 2, figsize=(13, 4))

# Plot decision regions.
axes[0].contourf(xx_a4, yy_a4, class_grid_a4, levels=[-0.5, 0.5, 1.5, 2.5], cmap="Set2", alpha=0.65)

# Overlay true data.
axes[0].scatter(X_a4[:, 0], X_a4[:, 1], c=y_a4, cmap="Set2", edgecolor="k")

# Label the first feature.
axes[0].set_xlabel("feature 1")

# Label the second feature.
axes[0].set_ylabel("feature 2")

# Title the region panel.
axes[0].set_title(f"Softmax regions, accuracy={acc_a4:.3f}")

# Plot confidence field.
cf_a4 = axes[1].contourf(xx_a4, yy_a4, confidence_a4, levels=20, cmap="viridis")

# Overlay true data on confidence field.
axes[1].scatter(X_a4[:, 0], X_a4[:, 1], c=y_a4, cmap="Set2", edgecolor="k")

# Label the first feature.
axes[1].set_xlabel("feature 1")

# Label the second feature.
axes[1].set_ylabel("feature 2")

# Title the confidence panel.
axes[1].set_title("Maximum softmax probability")

# Add confidence colorbar.
fig.colorbar(cf_a4, ax=axes[1], label="max probability")

# Tighten layout.
plt.tight_layout()

# Display the figure.
plt.show()
```

▶ What you'll see: three linear regions meet at boundaries, and confidence rises inside each region.

👀 Softmax regression normalizes competing linear scores into class probabilities.

#### A5. Pen-and-paper: GLM mapping for Gaussian, Bernoulli, and Poisson

**Problem.** Map three common models into the GLM template.

**Gaussian.** For unit variance,

$$
p(y;\mu)=\frac{1}{\sqrt{2\pi}}\exp\left(-\frac{(y-\mu)^2}{2}\right).
$$

Expand:

$$
\begin{aligned}
-\frac{(y-\mu)^2}{2}
&=-\frac{y^2-2\mu y+\mu^2}{2}\\
&=\mu y-\frac{\mu^2}{2}-\frac{y^2}{2}.
\end{aligned}
$$

So

$$
\eta=\mu,\quad T(y)=y,\quad a(\eta)=\frac{\eta^2}{2},\quad \mu=\theta^Tx.
$$

Thus

$$
\boxed{\mathbb{E}[y\mid x]=\theta^Tx}.
$$

**Bernoulli.**

$$
\begin{aligned}
p(y;\phi)&=\phi^y(1-\phi)^{1-y}\\
&=\exp\left(y\log\frac{\phi}{1-\phi}+\log(1-\phi)\right).
\end{aligned}
$$

Thus

$$
\eta=\log\frac{\phi}{1-\phi}.
$$

Solve:

$$
\begin{aligned}
e^\eta&=\frac{\phi}{1-\phi}\\
e^\eta(1-\phi)&=\phi\\
e^\eta&=\phi(1+e^\eta)\\
\phi&=\frac{e^\eta}{1+e^\eta}=\frac{1}{1+e^{-\eta}}.
\end{aligned}
$$

With $\eta=\theta^Tx$,

$$
\boxed{\mathbb{E}[y\mid x]=g(\theta^Tx)}.
$$

**Poisson.**

$$
\begin{aligned}
p(y;\lambda)&=\frac{e^{-\lambda}\lambda^y}{y!}\\
&=\frac{1}{y!}\exp(y\log\lambda-\lambda).
\end{aligned}
$$

Thus

$$
\eta=\log\lambda,
\quad
T(y)=y,
\quad
a(\eta)=e^\eta.
$$

Since $\lambda=e^\eta$ and $\eta=\theta^Tx$,

$$
\boxed{\mathbb{E}[y\mid x]=e^{\theta^Tx}}.
$$

| Model | Distribution | Natural parameter | Mean response |
|---|---|---|---|
| OLS | Gaussian | $\eta=\mu$ | $\theta^Tx$ |
| Logistic | Bernoulli | $\eta=\log\frac{\phi}{1-\phi}$ | $g(\theta^Tx)$ |
| Poisson | Poisson | $\eta=\log\lambda$ | $e^{\theta^Tx}$ |

### Interactive Experiment

```python
# Generate a fixed dataset for the interactive experiment.
x_int, y_int = make_regression_data("linear", n=75)

# Add an intercept column.
X_int = add_intercept(x_int)

# Count examples for gradient averaging.
m_int = X_int.shape[0]

# Define the function controlled by sliders.
def interactive_regression_fit(learning_rate=0.05, epochs=80):
    # Initialize parameters at the same point for every slider change.
    theta_int = np.array([-2.5, -1.0])
    # Create an empty list for losses.
    losses_int = []
    # Run gradient descent for the selected number of epochs.
    for epoch_int in range(epochs):
        # Compute predictions.
        pred_int = X_int @ theta_int
        # Compute errors.
        error_int = pred_int - y_int
        # Store average half-MSE loss.
        losses_int.append(0.5 * np.mean(error_int ** 2))
        # Compute average gradient.
        grad_int = (X_int.T @ error_int) / m_int
        # Update parameters.
        theta_int = theta_int - learning_rate * grad_int
    # Compute final predictions.
    final_pred_int = X_int @ theta_int
    # Create two panels.
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    # Plot training data.
    axes[0].scatter(x_int, y_int, color="black", alpha=0.75, label="data")
    # Plot fitted line.
    axes[0].plot(x_int, final_pred_int, color="red", linewidth=2, label="GD fit")
    # Label the x-axis.
    axes[0].set_xlabel("x")
    # Label the y-axis.
    axes[0].set_ylabel("y")
    # Title the fit panel.
    axes[0].set_title(f"theta=[{theta_int[0]:.2f}, {theta_int[1]:.2f}]")
    # Show the legend.
    axes[0].legend()
    # Plot loss history.
    axes[1].plot(losses_int, color="black")
    # Label the epoch axis.
    axes[1].set_xlabel("epoch")
    # Label the loss axis.
    axes[1].set_ylabel("average half-MSE")
    # Title the loss panel.
    axes[1].set_title(f"final loss={losses_int[-1]:.3f}")
    # Tighten layout.
    plt.tight_layout()
    # Display the plot.
    plt.show()

# Launch the interactive widget with learning-rate and epoch sliders.
interact(interactive_regression_fit, learning_rate=FloatSlider(value=0.05, min=0.001, max=0.25, step=0.001, description="learning rate"), epochs=IntSlider(value=80, min=1, max=300, step=1, description="epochs"))
```

▶ What you'll see: changing learning rate changes step size; changing epochs changes how long optimization runs.

👀 Too small learns slowly, moderate converges, and too large can overshoot.
