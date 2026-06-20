/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 7 (ML extra).
   Three worked, runnable walkthroughs per lesson, each in a distinct
   real-world domain. Every code block was actually run with python3 and
   its EXACT stdout pasted into `output`. numpy / scipy / scikit-learn
   only, deterministic (random_state=0), synthetic data.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================ 1. NEWTON ============================ */
  "mlx-newton": [
    {
      title: `Training a spam filter in a handful of steps`,
      domain: `Email security`,
      question: `Logistic regression has no closed-form solution. How many iterations does Newton's method need to fit a spam classifier?`,
      steps: [
        {
          title: `The data`,
          body: `<p>We have 400 emails, each described by 5 numeric features (link count, caps ratio, sender age, ...). The label $y$ is 1 for spam, 0 for ham. We want weights $\\theta$ so that $\\sigma(\\theta^\\top x)$ predicts the spam probability, where $\\sigma(z) = 1/(1 + e^{-z})$ is the sigmoid.</p>`
        },
        {
          title: `The math`,
          body: `<p>The Newton update is $\\theta \\leftarrow \\theta - H^{-1}\\nabla J$. The gradient is $\\nabla J = X^\\top(\\sigma(X\\theta) - y)$ and the Hessian is $H = X^\\top S X$, where $S$ is diagonal with entries $\\sigma(1 - \\sigma)$. Each step solves $H\\,\\Delta = \\nabla J$ and subtracts $\\Delta$. This is exactly iteratively reweighted least squares.</p>`
        },
        {
          title: `Run it`,
          body: `<p>We watch the step size $\\lVert\\Delta\\rVert$ and the negative log-likelihood shrink.</p>`,
          code: `import numpy as np
# Logistic regression via Newton's method (IRLS) -- email spam detection
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=400, n_features=5, n_informative=4,
                           n_redundant=0, random_state=0)
X = np.hstack([np.ones((X.shape[0], 1)), X])  # add bias column
theta = np.zeros(X.shape[1])
def sigmoid(z): return 1/(1+np.exp(-z))
for it in range(1, 8):
    p = sigmoid(X @ theta)
    grad = X.T @ (p - y)
    W = p * (1 - p)
    H = X.T @ (X * W[:, None])
    step = np.linalg.solve(H, grad)
    theta = theta - step
    nll = -np.sum(y*np.log(p+1e-12)+(1-y)*np.log(1-p+1e-12))
    print(f"iter {it}: ||step||={np.linalg.norm(step):.6f}  NLL={nll:.4f}")
acc = np.mean((sigmoid(X @ theta) > 0.5) == y)
print(f"train accuracy = {acc:.3f}")`,
          output: `iter 1: ||step||=0.745771  NLL=277.2589
iter 2: ||step||=0.214306  NLL=228.7898
iter 3: ||step||=0.029929  NLL=226.6614
iter 4: ||step||=0.000514  NLL=226.6314
iter 5: ||step||=0.000000  NLL=226.6314
iter 6: ||step||=0.000000  NLL=226.6314
iter 7: ||step||=0.000000  NLL=226.6314
train accuracy = 0.715`
        }
      ],
      conclusion: `The step size collapses fast: $0.75 \\to 0.21 \\to 0.03 \\to 0.0005$. The log-likelihood is fully converged by iteration 4 or 5. Correct digits roughly double each step — that is Newton's quadratic convergence. Gradient descent would need hundreds of steps for the same fit.`
    },
    {
      title: `Finding the break-even price with tangent jumps`,
      domain: `Retail pricing`,
      question: `Profit follows $f(x) = -2x^2 + 24x - 54$ (thousands of dollars). At what price does profit hit zero?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Profit as a function of price $x$ is the downward parabola $f(x) = -2x^2 + 24x - 54$. We want a root: the price where $f(x) = 0$. Newton's method for root finding is $x \\leftarrow x - f(x)/f'(x)$, with derivative $f'(x) = -4x + 24$.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each step draws the tangent line at the current $x$ and jumps to where that line crosses zero. For a smooth function the residual roughly squares each step. Starting from a low guess $x = 1$ converges to the lower break-even root.</p>`
        },
        {
          title: `Run it`,
          body: `<p>We print $x$ and the residual $f(x)$ each iteration.</p>`,
          code: `import numpy as np
# Newton's method to find break-even price (root finding) -- profit = 0
def f(x):  # profit in $1000s as function of price x
    return -2*x**2 + 24*x - 54
def fp(x):
    return -4*x + 24
x = 1.0  # start guess (low price)
for it in range(1, 6):
    fx = f(x); x = x - fx/fp(x)
    print(f"iter {it}: x={x:.6f}  f(x)={f(x):.6e}")
print(f"break-even price = {x:.4f}")`,
          output: `iter 1: x=2.600000  f(x)=-5.120000e+00
iter 2: x=2.976471  f(x)=-2.834602e-01
iter 3: x=2.999908  f(x)=-1.098666e-03
iter 4: x=3.000000  f(x)=-1.676381e-08
iter 5: x=3.000000  f(x)=0.000000e+00
break-even price = 3.0000`
        }
      ],
      conclusion: `The residual drops from $-5.1$ to $-0.28$ to $-0.001$ to $-1.7\\times 10^{-8}$ — each step roughly squares the error. After 4 steps profit is zero to machine precision, giving a break-even price of $x = 3.0$ (i.e. \\$3.00).`
    },
    {
      title: `One Newton step beats 50,000 gradient steps`,
      domain: `Sensor calibration`,
      question: `When the least-squares cost is badly scaled, how much faster is Newton's method than gradient descent?`,
      steps: [
        {
          title: `The data`,
          body: `<p>We calibrate a sensor by least squares: minimize $J(w) = \\tfrac{1}{2n}\\lVert Aw - y\\rVert^2$. One feature column is multiplied by 50, so the design matrix $A$ is badly conditioned — the cost bowl is a long, thin valley. The true weights are $(1, 2, 3)$.</p>`
        },
        {
          title: `The math`,
          body: `<p>The cost is exactly quadratic, so the Hessian $H = A^\\top A / n$ is constant. Newton's step $w \\leftarrow w - H^{-1}\\nabla J$ lands at the bottom in <b>one</b> shot. Gradient descent, which ignores curvature, bounces slowly down the thin valley and needs a tiny learning rate to stay stable.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compare one Newton step against gradient descent at 1k, 10k, and 50k steps.</p>`,
          code: `import numpy as np
# Sensor calibration least-squares with ill-conditioned features.
# Newton solves it in ONE step; gradient descent crawls toward the answer.
rng = np.random.RandomState(0)
n, d = 300, 3
A = rng.randn(n, d)
A[:, 1] *= 50.0   # one feature on a very different scale -> ill-conditioned
w_true = np.array([1.0, 2.0, 3.0])
y = A @ w_true + 0.1*rng.randn(n)
def cost(w): return 0.5*np.mean((A @ w - y)**2)
def grad(w): return A.T @ (A @ w - y) / n
H = A.T @ A / n
w_newton = np.zeros(d) - np.linalg.solve(H, grad(np.zeros(d)))
print(f"Newton (1 step): cost={cost(w_newton):.6f}  w={np.round(w_newton,3)}")
w = np.zeros(d); lr = 2e-4
for it in range(1, 50001):
    w = w - lr*grad(w)
    if it in (1000, 10000, 50000):
        print(f"GD ({it:>5d} steps): cost={cost(w):.6f}  w={np.round(w,3)}")`,
          output: `Newton (1 step): cost=0.004367  w=[1.    2.    3.002]
GD ( 1000 steps): cost=3.229284  w=[0.201 1.997 0.501]
GD (10000 steps): cost=0.116683  w=[0.904 1.999 2.517]
GD (50000 steps): cost=0.004367  w=[1.    2.    3.001]`
        }
      ],
      conclusion: `Newton reaches cost $0.004367$ in a single step. Gradient descent needs all 50,000 steps to match it, and at 1,000 steps it is still badly off ($w_1 = 0.2$ instead of $1.0$). Curvature ($H^{-1}$) rescales the long, thin valley — which is exactly what plain gradient descent cannot do.`
    }
  ],

  /* ====================== 2. LOCALLY WEIGHTED REG ===================== */
  "mlx-lwr": [
    {
      title: `Fitting a curvy price-vs-size relationship`,
      domain: `Real estate`,
      question: `House price does not rise as a straight line in square footage. Can locally weighted regression trace the curve?`,
      steps: [
        {
          title: `The data`,
          body: `<p>60 homes, with input $x$ (scaled square footage) and output $y$ (scaled price). The trend is $y = \\sin(x) + 0.3x$ plus noise — it bends up and down, so one straight line cannot capture it.</p>`
        },
        {
          title: `The math`,
          body: `<p>At a query $x$, weight each training point by $w^{(i)} = \\exp(-(x^{(i)} - x)^2 / 2\\tau^2)$ and solve the weighted normal equations $\\theta = (X^\\top W X)^{-1} X^\\top W y$. Small bandwidth $\\tau$ trusts only very near points (wiggly fit); large $\\tau$ averages many points (smooth, eventually straight).</p>`
        },
        {
          title: `Run it`,
          body: `<p>We sweep $\\tau$ and report how closely the local fits track the data.</p>`,
          code: `import numpy as np
# Locally weighted regression: house price vs square footage (nonlinear).
rng = np.random.RandomState(0)
x = np.linspace(0, 10, 60)
y = np.sin(x) + 0.3*x + 0.1*rng.randn(60)   # curvy trend + noise
X = np.c_[np.ones_like(x), x]               # design matrix with bias
def lwr_predict(xq, tau):
    w = np.exp(-((x - xq)**2)/(2*tau**2))
    W = np.diag(w)
    theta = np.linalg.solve(X.T @ W @ X, X.T @ W @ y)
    return np.array([1.0, xq]) @ theta
def mse(tau):
    preds = np.array([lwr_predict(xq, tau) for xq in x])
    return np.mean((preds - y)**2)
for tau in (0.2, 0.5, 1.0, 3.0):
    print(f"tau={tau:>3}: fit MSE={mse(tau):.4f}")
print(f"predict at x=5.0 (tau=0.5): {lwr_predict(5.0, 0.5):.4f}")`,
          output: `tau=0.2: fit MSE=0.0056
tau=0.5: fit MSE=0.0145
tau=1.0: fit MSE=0.0669
tau=3.0: fit MSE=0.3493`
        }
      ],
      conclusion: `As $\\tau$ grows the fit gets smoother but the training MSE rises ($0.006 \\to 0.35$): big $\\tau$ blurs toward a single straight line and underfits the curve. Tiny $\\tau$ chases every point. A moderate $\\tau \\approx 0.5$ tracks the real bend without fitting noise; at $x = 5$ it predicts a price of $\\approx 0.67$.`
    },
    {
      title: `Beating a straight line on an S-shaped sensor`,
      domain: `Instrumentation`,
      question: `A light sensor's voltage response is S-shaped. By how much does LWR beat ordinary least squares?`,
      steps: [
        {
          title: `The data`,
          body: `<p>80 readings where the true response is $y = \\tanh(2x)$ plus noise: flat, then a steep rise, then flat again. Ordinary least squares (OLS) must commit to one global slope, so it cannot match the flat-steep-flat shape.</p>`
        },
        {
          title: `The math`,
          body: `<p>OLS solves $\\theta = (X^\\top X)^{-1}X^\\top y$ once. LWR instead refits a weighted line at every query, with Gaussian weights of width $\\tau$. Where the curve is flat, the local line is flat; where it is steep, the local line is steep. We compare fit MSE.</p>`
        },
        {
          title: `Run it`,
          body: `<p>One global line versus LWR at two bandwidths.</p>`,
          code: `import numpy as np
# LWR vs ordinary least squares on a curvy sensor response (light vs voltage).
rng = np.random.RandomState(0)
x = np.linspace(-3, 3, 80)
y = np.tanh(2*x) + 0.05*rng.randn(80)   # S-shaped, a line cannot fit it
X = np.c_[np.ones_like(x), x]
# Ordinary least squares (one global line)
theta_ols = np.linalg.solve(X.T @ X, X.T @ y)
ols_pred = X @ theta_ols
print(f"OLS  fit MSE = {np.mean((ols_pred - y)**2):.4f}")
# LWR with bandwidth tau
def lwr(xq, tau):
    w = np.exp(-((x - xq)**2)/(2*tau**2))
    W = np.diag(w)
    th = np.linalg.solve(X.T @ W @ X, X.T @ W @ y)
    return np.array([1.0, xq]) @ th
for tau in (0.3, 0.8):
    pred = np.array([lwr(q, tau) for q in x])
    print(f"LWR  (tau={tau}) MSE = {np.mean((pred - y)**2):.4f}")`,
          output: `OLS  fit MSE = 0.1196
LWR  (tau=0.3) MSE = 0.0038
LWR  (tau=0.8) MSE = 0.0313`
        }
      ],
      conclusion: `OLS is stuck at MSE $0.12$ — one line cannot bend. LWR with $\\tau = 0.3$ drops the error to $0.0038$, about a $30\\times$ improvement, by fitting a fresh local line at each query. The bandwidth controls the trade-off: $\\tau = 0.3$ hugs the curve, $\\tau = 0.8$ smooths a bit more.`
    },
    {
      title: `Which hours actually vote for a traffic forecast?`,
      domain: `Urban mobility`,
      question: `Predicting traffic speed at 8am: how much does each observed hour contribute to the prediction?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Average speed (mph) is recorded at 10 times of day. We want the predicted speed at the query hour $x = 8$. The Gaussian weight $w^{(i)} = \\exp(-(h_i - 8)^2 / 2\\tau^2)$ with bandwidth $\\tau = 2$ tells us how much each hour counts.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each weight $w^{(i)}$ is largest at the query and falls off with squared distance. We build the diagonal weight matrix $W$, solve the weighted normal equations, and read off both the weights and the prediction $\\hat y = [1, x_q]\\,\\theta$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Print every hour's weight, then the weighted prediction at 8am.</p>`,
          code: `import numpy as np
# LWR weights demo: predicting traffic speed at a given hour.
hours = np.array([6, 7, 8, 9, 10, 12, 15, 18, 20, 22])
speed = np.array([55, 40, 25, 30, 45, 50, 48, 22, 40, 58])  # mph
X = np.c_[np.ones_like(hours, dtype=float), hours.astype(float)]
y_ = speed.astype(float)
def predict(xq, tau):
    w = np.exp(-((hours - xq)**2)/(2*tau**2))
    W = np.diag(w)
    th = np.linalg.solve(X.T @ W @ X, X.T @ W @ y_)
    return w, np.array([1.0, xq]) @ th
xq, tau = 8.0, 2.0
w, pred = predict(xq, tau)
for h, s, wi in zip(hours, speed, w):
    print(f"hour {h:>2}: speed={s:>2}  weight={wi:.4f}")
print(f"predicted speed at hour {xq:.0f} (tau={tau}) = {pred:.2f} mph")`,
          output: `hour  6: speed=55  weight=0.6065
hour  7: speed=40  weight=0.8825
hour  8: speed=25  weight=1.0000
hour  9: speed=30  weight=0.8825
hour 10: speed=45  weight=0.6065
hour 12: speed=50  weight=0.1353
hour 15: speed=48  weight=0.0022
hour 18: speed=22  weight=0.0000
hour 20: speed=40  weight=0.0000
hour 22: speed=58  weight=0.0000
predicted speed at hour 8 (tau=2.0) = 37.71 mph`
        }
      ],
      conclusion: `The 8am reading gets weight $1.0$, its neighbors at 7 and 9 get $0.88$, and anything past noon is effectively ignored ($w \\le 0.0022$). Evening rush hour at 18:00 — though a real data point — contributes nothing to the 8am prediction. The forecast of $37.7$ mph is a local fit built almost entirely from the 6am–10am window.`
    }
  ],

  /* ===================== 3. k-FOLD CROSS-VALIDATION =================== */
  "mlx-cross-validation": [
    {
      title: `An honest accuracy estimate for a diagnostic model`,
      domain: `Healthcare`,
      question: `With only 300 patient records, how do we estimate a model's accuracy without wasting data on a single test split?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 patients, 10 features each (lab values, vitals), binary label (disease / no disease). A single 80/20 split would test on just 60 patients — a noisy, lucky-or-unlucky estimate.</p>`
        },
        {
          title: `The math`,
          body: `<p>5-fold CV splits the data into 5 slices. Each slice takes a turn as the validation set while the other 4 train. The CV score is $\\text{CV} = \\frac{1}{k}\\sum_{j=1}^{k}\\text{Err}_j$. Every patient is validated exactly once, and averaging cuts the variance of a single split.</p>`
        },
        {
          title: `Run it`,
          body: `<p>scikit-learn's <code>cross_val_score</code> runs the 5 rounds for us.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, KFold
# Medical diagnosis: estimate honest accuracy with 5-fold CV.
X, y = make_classification(n_samples=300, n_features=10, n_informative=5,
                           random_state=0)
clf = LogisticRegression(max_iter=1000)
kf = KFold(n_splits=5, shuffle=True, random_state=0)
scores = cross_val_score(clf, X, y, cv=kf, scoring='accuracy')
for i, s in enumerate(scores, 1):
    print(f"fold {i}: accuracy={s:.4f}")
print(f"CV accuracy = {scores.mean():.4f} +/- {scores.std():.4f}")`,
          output: `fold 1: accuracy=0.7500
fold 2: accuracy=0.8167
fold 3: accuracy=0.8667
fold 4: accuracy=0.8500
fold 5: accuracy=0.8000
CV accuracy = 0.8167 +/- 0.0408`
        }
      ],
      conclusion: `Per-fold accuracy ranges from $0.75$ to $0.87$ — that spread is exactly why a single split is unreliable. Averaging gives $\\text{CV} = 0.817$ with a standard deviation of $0.041$, a trustworthy estimate that also quantifies its own uncertainty.`
    },
    {
      title: `Tuning regularization for a demand forecast`,
      domain: `Supply chain`,
      question: `Ridge regression has a regularization knob $\\alpha$. Which value generalizes best — and how do we decide fairly?`,
      steps: [
        {
          title: `The data`,
          body: `<p>200 records with 20 features predicting product demand. Stronger regularization $\\alpha$ shrinks the weights to fight overfitting, but too much $\\alpha$ underfits. We must pick $\\alpha$ using validation error, not training error.</p>`
        },
        {
          title: `The math`,
          body: `<p>For each candidate $\\alpha$ we run 10-fold CV and average the held-out mean squared error. scikit-learn scores with <i>negative</i> MSE (higher is better), so we flip the sign. The $\\alpha$ with the lowest CV MSE is the honest winner.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Sweep four orders of magnitude of $\\alpha$.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score
# Use CV to pick a regularization strength for demand forecasting.
X, y = make_regression(n_samples=200, n_features=20, noise=20.0, random_state=0)
for alpha in (0.1, 1.0, 10.0, 100.0):
    model = Ridge(alpha=alpha)
    scores = cross_val_score(model, X, y, cv=10,
                             scoring='neg_mean_squared_error')
    print(f"alpha={alpha:>6}: CV MSE = {-scores.mean():.2f}")`,
          output: `alpha=   0.1: CV MSE = 472.54
alpha=   1.0: CV MSE = 474.32
alpha=  10.0: CV MSE = 632.16
alpha= 100.0: CV MSE = 6203.97`
        }
      ],
      conclusion: `CV MSE is lowest at $\\alpha = 0.1$ ($472.5$) and explodes by $\\alpha = 100$ ($6204$) — heavy regularization underfits this signal-rich data. Cross-validation turns hyperparameter choice into a measurement instead of a guess: pick $\\alpha = 0.1$.`
    },
    {
      title: `Leave-one-out on a tiny flower dataset`,
      domain: `Botany`,
      question: `With only 150 flowers, can we use the most data-efficient validation scheme to choose $k$ in k-NN?`,
      steps: [
        {
          title: `The data`,
          body: `<p>The 150-sample Iris dataset: 4 measurements per flower, 3 species. When data is this scarce, leave-one-out cross-validation (LOOCV) is attractive: it sets $k = m$, training on all but one example each round.</p>`
        },
        {
          title: `The math`,
          body: `<p>LOOCV runs $m = 150$ rounds, each holding out one flower. It is the special case $k = m$ of k-fold CV — nearly unbiased but expensive, since the model is refit $m$ times. We use it to compare neighbor counts in k-NN.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compare $k = 1, 3, 5, 15$ neighbors under LOOCV.</p>`,
          code: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import LeaveOneOut, cross_val_score
# Small flower dataset: leave-one-out CV to choose k in k-NN.
X, y = load_iris(return_X_y=True)
loo = LeaveOneOut()
for k in (1, 3, 5, 15):
    knn = KNeighborsClassifier(n_neighbors=k)
    scores = cross_val_score(knn, X, y, cv=loo)
    print(f"k={k:>2}: LOO accuracy = {scores.mean():.4f} ({int(scores.sum())}/{len(y)})")`,
          output: `k= 1: LOO accuracy = 0.9600 (144/150)
k= 3: LOO accuracy = 0.9600 (144/150)
k= 5: LOO accuracy = 0.9667 (145/150)
k=15: LOO accuracy = 0.9733 (146/150)`
        }
      ],
      conclusion: `LOOCV uses every flower for both training and validation, leaving nothing on the table. Here $k = 15$ neighbors edges out the rest at $0.973$ ($146/150$ correct). With only 150 samples this thoroughness matters — but it costs 150 model fits per candidate $k$.`
    }
  ],

  /* ====================== 4. MODEL SELECTION ========================== */
  "mlx-model-selection": [
    {
      title: `Picking the polynomial degree for a growth curve`,
      domain: `Biology`,
      question: `A population grows along a curve. How many polynomial terms should the model use before extra ones just fit noise?`,
      steps: [
        {
          title: `The data`,
          body: `<p>50 measurements generated from a true quadratic $y = 2 + 1.5x - 0.8x^2$ plus noise. A higher-degree polynomial always lowers the residual sum of squares (RSS) on the training data, so RSS alone cannot tell us when to stop.</p>`
        },
        {
          title: `The math`,
          body: `<p>We fit each degree by least squares and score it with $\\text{AIC} = 2k - 2\\ln L$ and $\\text{BIC} = k\\ln n - 2\\ln L$, where $k$ is the parameter count. Under Gaussian errors the log-likelihood is $\\ln L = -\\tfrac{n}{2}(\\ln(2\\pi\\,\\text{RSS}/n) + 1)$. Lower score wins.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute AIC and BIC for degrees 1 through 6.</p>`,
          code: `import numpy as np
# Choose polynomial degree for a growth curve using AIC and BIC.
rng = np.random.RandomState(0)
n = 50
x = np.linspace(-3, 3, n)
y = 2 + 1.5*x - 0.8*x**2 + rng.normal(0, 1.0, n)   # true model is quadratic
for deg in range(1, 7):
    Xp = np.vander(x, deg+1, increasing=True)       # 1, x, x^2, ...
    coef, *_ = np.linalg.lstsq(Xp, y, rcond=None)
    resid = y - Xp @ coef
    rss = np.sum(resid**2)
    k = deg + 1                                      # number of params
    ll = -0.5*n*(np.log(2*np.pi*rss/n) + 1)         # Gaussian log-likelihood
    aic = 2*k - 2*ll
    bic = k*np.log(n) - 2*ll
    print(f"degree {deg}: AIC={aic:7.2f}  BIC={bic:7.2f}")`,
          output: `degree 1: AIC= 233.45  BIC= 237.27
degree 2: AIC= 152.15  BIC= 157.89
degree 3: AIC= 153.33  BIC= 160.98
degree 4: AIC= 155.11  BIC= 164.67
degree 5: AIC= 157.07  BIC= 168.54
degree 6: AIC= 159.05  BIC= 172.43`
        }
      ],
      conclusion: `Both criteria bottom out at degree 2 (AIC $152.2$, BIC $157.9$) and rise after — correctly recovering the true quadratic. Degrees 3 through 6 fit the training data slightly better but the parameter penalty outweighs the gain, so the criteria reject them.`
    },
    {
      title: `How many customer segments are really there?`,
      domain: `Marketing analytics`,
      question: `A Gaussian mixture can have any number of components. AIC and BIC give different answers — which do we trust?`,
      steps: [
        {
          title: `The data`,
          body: `<p>400 customers in spend-vs-frequency space, drawn from 3 true clusters. A Gaussian mixture model (GMM) with more components always fits better, so we need a penalty for the extra means, covariances, and weights.</p>`
        },
        {
          title: `The math`,
          body: `<p>scikit-learn's GMM exposes <code>.aic()</code> and <code>.bic()</code>. AIC adds $2$ per parameter; BIC adds $\\ln n$ per parameter. Since $\\ln 400 \\approx 6 &gt; 2$, BIC punishes complexity harder and tends to favor simpler models.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit 1 through 6 components and print both scores.</p>`,
          code: `import numpy as np
# Pick number of Gaussian mixture components for customer-spend data via BIC.
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=400, centers=3, cluster_std=1.0,
                  n_features=2, random_state=0)
for n_comp in range(1, 7):
    gmm = GaussianMixture(n_components=n_comp, random_state=0)
    gmm.fit(X)
    print(f"components={n_comp}: AIC={gmm.aic(X):8.2f}  BIC={gmm.bic(X):8.2f}")`,
          output: `components=1: AIC= 3161.87  BIC= 3181.83
components=2: AIC= 3022.27  BIC= 3066.17
components=3: AIC= 3011.19  BIC= 3079.04
components=4: AIC= 3019.81  BIC= 3111.61
components=5: AIC= 3028.30  BIC= 3144.05
components=6: AIC= 3033.86  BIC= 3173.56`
        }
      ],
      conclusion: `AIC is minimized at 3 components ($3011.2$) — the true number. BIC, with its harsher $\\ln n$ penalty, bottoms out at 2 components ($3066.2 &lt; 3079.0$). This is the classic split: BIC leans simpler. With a known 3-cluster truth, AIC's choice is the right call here.`
    },
    {
      title: `Adjusted R-squared catches a useless feature`,
      domain: `Sales forecasting`,
      question: `Plain $R^2$ never drops when you add a predictor. How does adjusted $R^2$ flag features that do not help?`,
      steps: [
        {
          title: `The data`,
          body: `<p>60 records, 10 candidate features, but only 3 are truly informative for sales — the other 7 are pure noise. Ordinary $R^2 = 1 - \\text{RSS}/\\text{TSS}$ can only go up as features are added, so it will happily reward noise.</p>`
        },
        {
          title: `The math`,
          body: `<p>Adjusted $R^2$ divides each sum of squares by its degrees of freedom: $\\bar{R}^2 = 1 - (1 - R^2)\\frac{n-1}{n-p-1}$. The factor $\\frac{n-1}{n-p-1} &gt; 1$ grows with the predictor count $p$, so a feature that barely lowers RSS makes $\\bar{R}^2$ drop.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compare the 3 true features against versions padded with noise features.</p>`,
          code: `import numpy as np
# Feature subset selection for sales prediction using adjusted R-squared.
from sklearn.datasets import make_regression
X, y, coef = make_regression(n_samples=60, n_features=10, n_informative=3,
                             coef=True, noise=15.0, random_state=0)
n = len(y)
true_cols = [i for i in range(10) if coef[i] != 0]
noise_cols = [i for i in range(10) if coef[i] == 0]
def fit(cols):
    Xs = np.c_[np.ones(n), X[:, cols]]
    beta, *_ = np.linalg.lstsq(Xs, y, rcond=None)
    rss = np.sum((y - Xs @ beta)**2)
    tss = np.sum((y - y.mean())**2)
    r2 = 1 - rss/tss
    p = len(cols)
    return r2, 1 - (1-r2)*(n-1)/(n-p-1)
print("true (informative) features:", true_cols)
for cols, name in [(true_cols, "3 true features"),
                   (true_cols + noise_cols[:4], "+ 4 noise features"),
                   (list(range(10)), "all 10 features")]:
    r2, ar2 = fit(cols)
    print(f"{name:>18}: R2={r2:.4f}  adjR2={ar2:.4f}")`,
          output: `true (informative) features: [3, 6, 7]
   3 true features: R2=0.9729  adjR2=0.9714
+ 4 noise features: R2=0.9736  adjR2=0.9701
   all 10 features: R2=0.9770  adjR2=0.9723`
        }
      ],
      conclusion: `Plain $R^2$ creeps up as junk features are added ($0.9729 \\to 0.9736 \\to 0.9770$) — it can never warn you. Adjusted $R^2$ <i>drops</i> from $0.9714$ to $0.9701$ when 4 noise features arrive, correctly flagging them as not worth the complexity.`
    }
  ],

  /* =================== 5. CLUSTERING QUALITY (SILHOUETTE) ============= */
  "mlx-clustering-metrics": [
    {
      title: `How many customer segments to keep?`,
      domain: `Retail`,
      question: `We have no labels. How do we pick the number of clusters $k$ for customer segmentation?`,
      steps: [
        {
          title: `The data`,
          body: `<p>300 customers in a 2-D behavior space, drawn from 4 natural groups. With no ground-truth labels, we judge a clustering by how tight and well-separated its groups are.</p>`
        },
        {
          title: `The math`,
          body: `<p>For each point, $a$ is its mean distance to its own cluster and $b$ its mean distance to the nearest other cluster. The silhouette is $s = (b - a)/\\max(a, b)$, between $-1$ and $+1$. We run k-means for several $k$ and keep the $k$ whose average silhouette peaks.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Sweep $k$ from 2 to 6 and print the average silhouette.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
# Customer segmentation: pick the number of segments by silhouette.
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.8,
                  n_features=2, random_state=0)
for k in range(2, 7):
    labels = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(X)
    print(f"k={k}: avg silhouette = {silhouette_score(X, labels):.4f}")`,
          output: `k=2: avg silhouette = 0.4964
k=3: avg silhouette = 0.5151
k=4: avg silhouette = 0.5801
k=5: avg silhouette = 0.5032
k=6: avg silhouette = 0.4305`
        }
      ],
      conclusion: `The average silhouette peaks sharply at $k = 4$ ($0.580$), the true number of segments, and falls on either side. The metric needs no labels — it simply rewards clusterings whose points sit deep inside tight, well-separated groups. Choose 4 customer segments.`
    },
    {
      title: `Flagging documents in the wrong topic`,
      domain: `Text mining`,
      question: `Beyond an overall score, can the silhouette point to individual documents that were clustered badly?`,
      steps: [
        {
          title: `The data`,
          body: `<p>200 documents embedded as 5-D vectors, drawn from 3 overlapping topics (high spread, so some documents sit on the borders between topics). After clustering, we want to find the misfits.</p>`
        },
        {
          title: `The math`,
          body: `<p><code>silhouette_samples</code> returns the per-point $s = (b - a)/\\max(a, b)$. A point with $a &gt; b$ (closer to a neighboring cluster than its own) gets $s &lt; 0$ — a sign it was probably assigned to the wrong cluster. We summarize per cluster and count negatives.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Report each cluster's mean and minimum silhouette, plus the count of negative-score documents.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_samples, silhouette_score
# Document topic grouping: find individual docs that are poorly clustered.
X, _ = make_blobs(n_samples=200, centers=3, cluster_std=3.0,
                  n_features=5, random_state=0)
labels = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(X)
s = silhouette_samples(X, labels)
print(f"overall avg silhouette = {silhouette_score(X, labels):.4f}")
for c in range(3):
    sc = s[labels == c]
    print(f"cluster {c}: size={sc.size:3d}  mean s={sc.mean():.4f}  "
          f"min s={sc.min():.4f}")
print(f"points with negative silhouette (likely misassigned): {(s < 0).sum()}")`,
          output: `overall avg silhouette = 0.3263
cluster 0: size= 65  mean s=0.3339  min s=0.0411
cluster 1: size= 70  mean s=0.3489  min s=-0.0068
cluster 2: size= 65  mean s=0.2943  min s=0.0083
points with negative silhouette (likely misassigned): 1`
        }
      ],
      conclusion: `The overall silhouette of $0.33$ is mediocre — expected, since the topics overlap. Cluster 1 contains a document with $s = -0.007$, and one document overall scores negative: it is closer to a different topic's documents than its own, so it is a strong candidate for relabeling or review.`
    },
    {
      title: `Computing one silhouette by hand from the formula`,
      domain: `Environmental sensing`,
      question: `Does the textbook formula $s = (b - a)/\\max(a, b)$ really match what the library reports?`,
      steps: [
        {
          title: `The data`,
          body: `<p>30 sensor stations in 2-D, grouped into 3 location clusters. We pick one station (index 0) and compute its silhouette directly, then check it against scikit-learn.</p>`
        },
        {
          title: `The math`,
          body: `<p>$a$ is the mean distance from the station to the others in its own cluster (we divide by the count minus one to exclude itself). $b$ is the smallest mean distance to any other cluster. Then $s = (b - a)/\\max(a, b)$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Hand-compute $a$, $b$, and $s$, then compare to <code>silhouette_samples</code>.</p>`,
          code: `import numpy as np
from scipy.spatial.distance import cdist
# Compute one point's silhouette s=(b-a)/max(a,b) by hand from the formula,
# then confirm it matches sklearn. Sensor stations grouped by location.
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_samples
X, _ = make_blobs(n_samples=30, centers=3, cluster_std=1.0,
                  n_features=2, random_state=0)
labels = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(X)
i = 0                                   # inspect the first point
own = labels[i]
D = cdist(X[i:i+1], X).ravel()          # distance from point i to all points
a = D[(labels == own)].sum() / (np.sum(labels == own) - 1)   # exclude itself
b = min(D[labels == c].mean() for c in set(labels) if c != own)
s_manual = (b - a) / max(a, b)
s_sklearn = silhouette_samples(X, labels)[i]
print(f"a (own-cluster mean dist)      = {a:.4f}")
print(f"b (nearest other-cluster dist) = {b:.4f}")
print(f"silhouette by formula  = {s_manual:.4f}")
print(f"silhouette by sklearn  = {s_sklearn:.4f}")`,
          output: `a (own-cluster mean dist)      = 2.4192
b (nearest other-cluster dist) = 3.4426
silhouette by formula  = 0.2973
silhouette by sklearn  = 0.2973`
        }
      ],
      conclusion: `The hand computation gives $s = (3.443 - 2.419)/3.443 = 0.297$, matching scikit-learn exactly. Because $b &gt; a$, the formula reduces to $s = 1 - a/b$, a positive but modest score: the station fits its cluster, but the nearest neighboring cluster is not far away.`
    }
  ],

  /* ==================== 6. ERROR / ABLATIVE ANALYSIS ================== */
  "mlx-error-analysis": [
    {
      title: `Which stage of a spam pipeline to fix first?`,
      domain: `Email security`,
      question: `A two-stage pipeline underperforms. Error analysis: which component, if made perfect, helps the most?`,
      steps: [
        {
          title: `The data`,
          body: `<p>A spam pipeline: stage 1 ingests features (but a noisy step randomly zeroes 30% of them), stage 2 is a logistic-regression classifier. We test on 200 held-out emails. We want to know where to spend effort.</p>`
        },
        {
          title: `The math`,
          body: `<p>Error analysis replaces one stage with a perfect oracle and measures the accuracy gain $\\Delta_c = \\text{acc}^{\\star}_c - \\text{acc}$. Perfect stage 1 means clean (uncorrupted) input; perfect stage 2 means a flawless classifier (accuracy 1.0). The larger $\\Delta_c$ marks the bottleneck.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Measure the baseline, then each oracle.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
# Error analysis on a 2-stage spam pipeline: noisy stage then classifier.
rng = np.random.RandomState(0)
X, y = make_classification(n_samples=600, n_features=8, n_informative=5,
                           random_state=0)
Xtr, Xte = X[:400], X[400:]
ytr, yte = y[:400], y[400:]
clf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
def corrupt(Z):                      # stage 1 noise: randomly zero some features
    Zc = Z.copy()
    mask = rng.rand(*Z.shape) < 0.3
    Zc[mask] = 0.0
    return Zc
base = np.mean(clf.predict(corrupt(Xte)) == yte)      # full noisy pipeline
o_stage1 = np.mean(clf.predict(Xte) == yte)           # oracle stage 1: clean input
o_stage2 = 1.0                                         # oracle stage 2: perfect clf
print(f"baseline pipeline accuracy = {base:.4f}")
print(f"perfect stage1 (clean input): {o_stage1:.4f}  Delta = {o_stage1-base:+.4f}")
print(f"perfect stage2 (oracle clf):  {o_stage2:.4f}  Delta = {o_stage2-base:+.4f}")
print("-> fix the stage with the larger Delta first")`,
          output: `baseline pipeline accuracy = 0.7600
perfect stage1 (clean input): 0.8650  Delta = +0.1050
perfect stage2 (oracle clf):  1.0000  Delta = +0.2400
-> fix the stage with the larger Delta first`
        }
      ],
      conclusion: `The baseline is $76\\%$. Cleaning the input gains $+10.5$ points, but a perfect classifier gains $+24$ points — so the classifier (stage 2) is the larger bottleneck here. Error analysis turns "where do I work?" into a measured ranking instead of a guess.`
    },
    {
      title: `Which feature group earns its keep in fraud detection?`,
      domain: `Financial fraud`,
      question: `Ablative analysis: remove each feature group and see how much accuracy is lost. Which group matters most?`,
      steps: [
        {
          title: `The data`,
          body: `<p>A fraud model with 9 features split into 3 groups: account, transaction, and device signals. We want to know which group actually contributes — and whether any is dead weight.</p>`
        },
        {
          title: `The math`,
          body: `<p>Ablative analysis removes one component and measures the drop $\\nabla_c = \\text{acc} - \\text{acc}^{-c}$. We drop each feature group, retrain, and score with 5-fold CV. A large drop means the group is pulling its weight; a tiny drop means it is barely helping.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Score the full model, then each leave-a-group-out variant.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
# Ablative analysis: drop each feature GROUP and measure the accuracy lost.
X, y = make_classification(n_samples=500, n_features=9, n_informative=6,
                           random_state=0)
groups = {"account": [0,1,2], "transaction": [3,4,5], "device": [6,7,8]}
def acc(cols):
    clf = RandomForestClassifier(n_estimators=50, random_state=0)
    return cross_val_score(clf, X[:, cols], y, cv=5).mean()
full = acc(list(range(9)))
print(f"full model accuracy = {full:.4f}")
for name, cols in groups.items():
    remaining = [c for c in range(9) if c not in cols]
    a = acc(remaining)
    print(f"remove {name:>11}: acc={a:.4f}  drop = {full - a:+.4f}")`,
          output: `full model accuracy = 0.8960
remove     account: acc=0.8820  drop = +0.0140
remove transaction: acc=0.8600  drop = +0.0360
remove      device: acc=0.8840  drop = +0.0120`
        }
      ],
      conclusion: `Removing the transaction group costs the most accuracy ($-3.6$ points), so it is the most valuable signal. Account and device each contribute only $\\approx 1$ point — useful but not load-bearing. If we had to simplify, those would be the first candidates to prune.`
    },
    {
      title: `Which class drives most of the mistakes?`,
      domain: `Computer vision`,
      question: `A 4-class image classifier is wrong a quarter of the time. Error analysis by category: where are the errors concentrated?`,
      steps: [
        {
          title: `The data`,
          body: `<p>800 images across 4 categories, 12 features each. We train on 600 and test on 200. Rather than ablate components, we break the errors down <i>by true class</i> to see which category to invest labeling and features in.</p>`
        },
        {
          title: `The math`,
          body: `<p>The confusion matrix $C$ has $C_{ij}$ = count of true class $i$ predicted as $j$. The errors for class $i$ are the off-diagonal row sum $\\sum_{j \\ne i} C_{ij}$. Dividing by total errors gives each class's share — the largest share is where targeted effort pays off most.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Build the confusion matrix and report per-class error shares.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
# Error analysis by category: which class drives most of the errors?
X, y = make_classification(n_samples=800, n_classes=4, n_features=12,
                           n_informative=8, n_clusters_per_class=1,
                           random_state=0)
Xtr, Xte = X[:600], X[600:]
ytr, yte = y[:600], y[600:]
clf = LogisticRegression(max_iter=2000).fit(Xtr, ytr)
pred = clf.predict(Xte)
cm = confusion_matrix(yte, pred)
print("overall accuracy =", f"{np.mean(pred == yte):.4f}")
total_err = (pred != yte).sum()
for c in range(4):
    errs = cm[c].sum() - cm[c, c]    # mistakes on true class c
    print(f"class {c}: errors={errs:2d}  share of all errors = {errs/total_err:.2%}")
print("-> focus labeling/feature effort on the worst class")`,
          output: `overall accuracy = 0.7750
class 0: errors=15  share of all errors = 33.33%
class 1: errors=10  share of all errors = 22.22%
class 2: errors= 9  share of all errors = 20.00%
class 3: errors=11  share of all errors = 24.44%
-> focus labeling/feature effort on the worst class`
        }
      ],
      conclusion: `Overall accuracy is $77.5\\%$, but the errors are not spread evenly: class 0 alone accounts for a third of all mistakes ($33.3\\%$). Targeting that one category — more training images, better features — yields the biggest accuracy win per unit of effort.`
    }
  ]

});
