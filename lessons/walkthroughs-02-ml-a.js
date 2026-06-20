/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 2 (Machine Learning), PART A.
   Lessons 1-14 in file order:
     ml-supervised, ml-loss, ml-cost, ml-gradient-descent,
     ml-linear-regression, ml-likelihood, ml-logistic-regression,
     ml-softmax, ml-glm, ml-svm, ml-kernels, ml-gda,
     ml-naive-bayes, ml-trees.
   Each lesson: 3 walkthroughs across distinct real-world domains.
   Every code step was actually run with python3; output is exact stdout.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================ ml-supervised ============================ */
  "ml-supervised": [
    {
      title: `Predicting peer-loan returns`,
      domain: `finance`,
      question: `Can past loans teach a model to predict the return of a brand-new loan?`,
      steps: [
        { title: `The data`, body: `<p>Each loan is one example: features $x$ (income, term, rate) and a numeric answer $y$ (the realized return). The answer is a number, so this is <b>regression</b>.</p>` },
        { title: `The math`, body: `<p>We fit a rule $h_\\theta(x) \\approx y$ on the first 160 loans, then test it on 40 the model never saw. The test score is the coefficient of determination $R^2 \\in (-\\infty, 1]$, where 1 is perfect.</p>` },
        { title: `Run it`, body: `<p>Synthetic loans via <code>make_regression</code>, split into train and held-out test.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression
X, y = make_regression(n_samples=200, n_features=3, noise=10.0, random_state=0)
m = LinearRegression().fit(X[:160], y[:160])
print("R^2 on held-out loans:", round(m.score(X[160:], y[160:]), 3))
new = X[160:161]
print("predicted return for new loan:", round(float(m.predict(new)[0]), 2))`,
          output: `R^2 on held-out loans: 0.988
predicted return for new loan: 140.53` }
      ],
      conclusion: `The rule learned from past loans generalizes: $R^2 = 0.988$ on unseen loans, and it predicts a return of $140.53$ for a fresh applicant. That is supervised regression at work.`
    },
    {
      title: `Diagnosing patients from labeled records`,
      domain: `healthcare`,
      question: `Given past records labeled disease / no-disease, can we diagnose new patients?`,
      steps: [
        { title: `The data`, body: `<p>Each patient is a pair $(x^{(i)}, y^{(i)})$: features $x$ (lab values) and a category $y \\in \\{0,1\\}$. Because $y$ is a category, this is <b>classification</b>.</p>` },
        { title: `The math`, body: `<p>We learn $h_\\theta$ on a training set of $m$ patients, then measure accuracy on a separate test set: the fraction where $h_\\theta(x) = y$.</p>` },
        { title: `Run it`, body: `<p>A 75/25 train/test split keeps the test patients unseen during training.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=400, n_features=5, n_informative=4, n_redundant=0, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)
clf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
print("m (training examples):", len(Xtr))
print("diagnosis accuracy on new patients:", round(clf.score(Xte, yte), 3))`,
          output: `m (training examples): 300
diagnosis accuracy on new patients: 0.76` }
      ],
      conclusion: `From $m = 300$ labeled patients the model reaches $76\\%$ accuracy on new patients. Any task with labeled past data — like diagnosis — fits the supervised recipe $h_\\theta(x) \\approx y$.`
    },
    {
      title: `Will this user click?`,
      domain: `recommenders`,
      question: `From past sessions labeled click / no-click, can we predict clicks for new users?`,
      steps: [
        { title: `The data`, body: `<p>Each session is $(x, y)$: features $x$ (time on page, past clicks, item score) and label $y \\in \\{0,1\\}$ for click. Classification again.</p>` },
        { title: `The math`, body: `<p>We train on $80\\%$ of sessions and predict the held-out $20\\%$. A forest of trees votes on each new session's label.</p>` },
        { title: `Run it`, body: `<p>Synthetic click data, then a random forest classifier.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=500, n_features=6, n_informative=4, random_state=0)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0)
clf = RandomForestClassifier(n_estimators=50, random_state=0).fit(Xtr, ytr)
print("will-click accuracy on new sessions:", round(clf.score(Xte, yte), 3))
print("predicted click for first new user:", int(clf.predict(Xte[:1])[0]))`,
          output: `will-click accuracy on new sessions: 0.84
predicted click for first new user: 0` }
      ],
      conclusion: `Trained on labeled sessions, the model predicts clicks on new users with $84\\%$ accuracy and labels the first new user as no-click ($y = 0$). Recommenders are supervised classifiers under the hood.`
    }
  ],

  /* ============================== ml-loss =============================== */
  "ml-loss": [
    {
      title: `Scoring price-prediction errors`,
      domain: `finance`,
      question: `How wrong is each house-price prediction, and which one hurts most?`,
      steps: [
        { title: `The data`, body: `<p>Four houses: true prices $y$ (in $k) and the model's guesses $z$. We want one number per house for how wrong it was.</p>` },
        { title: `The math`, body: `<p>Use least-squared loss $L(z,y) = \\tfrac12 (y - z)^2$. Squaring removes the sign and punishes big gaps much more: a gap of $30$ costs far more than $15$.</p>` },
        { title: `Run it`, body: `<p>Vectorized squared loss across all four houses.</p>`,
          code: `import numpy as np
y_true = np.array([300., 250., 410., 180.])  # true prices ($k)
y_pred = np.array([280., 260., 400., 210.])  # model predictions
loss = 0.5 * (y_true - y_pred) ** 2
print("per-house squared loss:", np.round(loss, 1).tolist())
print("worst single example loss:", round(float(loss.max()), 1))`,
          output: `per-house squared loss: [200.0, 50.0, 50.0, 450.0]
worst single example loss: 450.0` }
      ],
      conclusion: `The fourth house, off by $30$k, dominates with loss $\\tfrac12(30)^2 = 450$ — nine times the $50$ from a $10$k gap. Squared loss makes large errors loud, so training fixes them first.`
    },
    {
      title: `Penalizing confident wrong diagnoses`,
      domain: `healthcare`,
      question: `How much should we penalize a model that is confidently wrong about disease?`,
      steps: [
        { title: `The data`, body: `<p>Four patients: the model's predicted probability $p$ of disease, and the true label $y \\in \\{0,1\\}$.</p>` },
        { title: `The math`, body: `<p>For probabilities we use cross-entropy loss $L = -[y\\log p + (1-y)\\log(1-p)]$. It explodes when the model is confident and wrong, and is near $0$ when confident and right.</p>` },
        { title: `Run it`, body: `<p>Compute the per-patient cross-entropy.</p>`,
          code: `import numpy as np
p = np.array([0.9, 0.6, 0.2, 0.8])  # predicted P(disease)
y = np.array([1,    0,   0,   1  ]) # true label
ce = -(y*np.log(p) + (1-y)*np.log(1-p))
print("per-patient cross-entropy:", np.round(ce, 3).tolist())
print("largest loss (most surprised):", round(float(ce.max()), 3))`,
          output: `per-patient cross-entropy: [0.105, 0.916, 0.223, 0.223]
largest loss (most surprised): 0.916` }
      ],
      conclusion: `The patient predicted $p = 0.6$ for disease but truly healthy carries the biggest loss, $0.916$ — the model leaned the wrong way. Cross-entropy is the loss for probability outputs.`
    },
    {
      title: `Margin penalties for a fraud detector`,
      domain: `fraud`,
      question: `How does hinge loss reward a fraud classifier only when it clears the margin?`,
      steps: [
        { title: `The data`, body: `<p>Four transactions with true labels $y \\in \\{-1, +1\\}$ and a raw model score. The signed margin is $m = y \\cdot \\text{score}$.</p>` },
        { title: `The math`, body: `<p>Hinge loss is $L = \\max(0,\\ 1 - m)$. It is $0$ once a point is correct with margin $\\ge 1$, and grows linearly otherwise. This is the SVM's loss.</p>` },
        { title: `Run it`, body: `<p>Compute the hinge loss per transaction and the total.</p>`,
          code: `import numpy as np
y = np.array([1, 1, -1, -1])
score = np.array([2.0, 0.3, -1.5, 0.4])
hinge = np.maximum(0, 1 - y*score)
print("per-transaction hinge loss:", np.round(hinge, 3).tolist())
print("total hinge loss:", round(float(hinge.sum()), 3))`,
          output: `per-transaction hinge loss: [0.0, 0.7, 0.0, 1.4]
total hinge loss: 2.1` }
      ],
      conclusion: `Transactions cleared with margin $\\ge 1$ cost $0$; the borderline-correct one costs $0.7$ and the wrong-side one costs $1.4$, for a total of $2.1$. Hinge loss only pays attention near and past the boundary.`
    }
  ],

  /* ============================== ml-cost =============================== */
  "ml-cost": [
    {
      title: `The cost bowl for ad-return slope`,
      domain: `finance`,
      question: `As we change the slope $\\theta$, how does the total cost over all loans move?`,
      steps: [
        { title: `The data`, body: `<p>$50$ loans, one feature each. The cost is the average loss over all of them: $J(\\theta) = \\tfrac1m \\sum_i \\tfrac12(\\theta x^{(i)} - y^{(i)})^2$.</p>` },
        { title: `The math`, body: `<p>Loss scores one loan; cost sums (averages) over all $m$. As a function of $\\theta$ the cost is a bowl (parabola) with one lowest point.</p>` },
        { title: `Run it`, body: `<p>Evaluate $J(\\theta)$ at four slope values to trace the bowl.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_regression
X, y = make_regression(n_samples=50, n_features=1, noise=8.0, random_state=0)
X = X.ravel()
def cost(theta):
    pred = theta * X
    return float(np.mean(0.5 * (pred - y) ** 2))
for t in [0.0, 20.0, 40.0, 60.0]:
    print("theta =", t, "-> cost J =", round(cost(t), 1))`,
          output: `theta = 0.0 -> cost J = 156.0
theta = 20.0 -> cost J = 41.1
theta = 40.0 -> cost J = 440.9
theta = 60.0 -> cost J = 1355.2` }
      ],
      conclusion: `The cost dips to $41.1$ near $\\theta = 20$ then climbs on either side — a bowl. Training means finding the $\\theta$ at the bottom of this $J(\\theta)$.`
    },
    {
      title: `Total error of an ad-spend model`,
      domain: `marketing`,
      question: `How much smaller is the cost for good parameters than for bad ones?`,
      steps: [
        { title: `The data`, body: `<p>Five campaigns: ad spend ($k) and sales ($k). The true relationship is $\\text{sales} = 2 \\cdot \\text{spend} + 1$.</p>` },
        { title: `The math`, body: `<p>Cost $J(\\text{slope}, b) = \\sum_i \\tfrac12 (\\text{slope}\\cdot x_i + b - y_i)^2$. Perfect parameters give $J = 0$; wrong ones give a positive total.</p>` },
        { title: `Run it`, body: `<p>Compare the true parameters against a wrong guess.</p>`,
          code: `import numpy as np
spend = np.array([1.,2.,3.,4.,5.])      # $k ad spend
sales = np.array([3.,5.,7.,9.,11.])     # $k sales, true slope 2 + intercept 1
def J(slope, b):
    pred = slope*spend + b
    return float(np.sum(0.5*(pred-sales)**2))
print("J(slope=2, b=1):", round(J(2,1), 3))
print("J(slope=1, b=0):", round(J(1,0), 3))`,
          output: `J(slope=2, b=1): 0.0
J(slope=1, b=0): 45.0` }
      ],
      conclusion: `The correct line drives the cost to exactly $J = 0$, while the wrong line costs $45$. Lower cost literally means a better fit across the whole dataset.`
    },
    {
      title: `Batch cost over a set of images`,
      domain: `vision`,
      question: `What single number summarizes how badly a classifier fits a mini-batch?`,
      steps: [
        { title: `The data`, body: `<p>Five images with predicted probability of "cat" $p$ and true label $y \\in \\{0,1\\}$.</p>` },
        { title: `The math`, body: `<p>Sum the per-image cross-entropy loss into one cost $J = \\sum_i -[y_i\\log p_i + (1-y_i)\\log(1-p_i)]$. The mean is the per-image average.</p>` },
        { title: `Run it`, body: `<p>Total and average cross-entropy over the batch.</p>`,
          code: `import numpy as np
P = np.array([0.95,0.7,0.4,0.88,0.6])  # predicted P(cat)
Y = np.array([1,   1,  0,  1,   1  ])
costs = -(Y*np.log(P) + (1-Y)*np.log(1-P))
print("J (total cross-entropy):", round(float(costs.sum()), 4))
print("mean cost per image:", round(float(costs.mean()), 4))`,
          output: `J (total cross-entropy): 1.5575
mean cost per image: 0.3115` }
      ],
      conclusion: `The whole batch collapses to one number, $J = 1.5575$ (mean $0.3115$ per image). Gradient descent shrinks exactly this $J$ to train the classifier.`
    }
  ],

  /* ========================= ml-gradient-descent ========================= */
  "ml-gradient-descent": [
    {
      title: `Rolling the slope downhill on loan data`,
      domain: `finance`,
      question: `Watch $\\theta$ step downhill on the cost over a few epochs — does the cost drop?`,
      steps: [
        { title: `The data`, body: `<p>$200$ loans with one feature. The gradient of the mean squared error w.r.t. $\\theta$ is $\\tfrac1m \\sum_i (\\theta x_i - y_i)\\,x_i$.</p>` },
        { title: `The math`, body: `<p>The update is $\\theta \\leftarrow \\theta - \\alpha\\,\\nabla J(\\theta)$ with learning rate $\\alpha = 0.05$. Each step nudges $\\theta$ opposite the slope.</p>` },
        { title: `Run it`, body: `<p>Five manual gradient-descent epochs from $\\theta = 0$.</p>`,
          code: `import numpy as np
from sklearn.datasets import make_regression
X, y = make_regression(n_samples=200, n_features=1, noise=10.0, random_state=0)
X = X.ravel()
theta, alpha, n = 0.0, 0.05, len(X)
for epoch in range(5):
    grad = np.mean((theta*X - y) * X)
    theta -= alpha * grad
    print("epoch", epoch, "theta =", round(theta, 3), "cost =", round(float(np.mean(0.5*(theta*X-y)**2)), 1))`,
          output: `epoch 0 theta = 5.051 cost = 4420.4
epoch 1 theta = 9.838 cost = 3974.1
epoch 2 theta = 14.374 cost = 3573.4
epoch 3 theta = 18.672 cost = 3213.7
epoch 4 theta = 22.744 cost = 2890.6` }
      ],
      conclusion: `Every epoch raises $\\theta$ toward its best value and the cost falls monotonically from $4420$ to $2891$. That is gradient descent sliding down the bowl, one step at a time.`
    },
    {
      title: `Hand-rolled descent on a toy bowl`,
      domain: `marketing`,
      question: `On the simplest cost $J(\\theta) = \\theta^2$, how fast does descent reach the minimum?`,
      steps: [
        { title: `The data`, body: `<p>No dataset needed — just the cost $J(\\theta) = \\theta^2$ with known slope $\\nabla J = 2\\theta$. The minimum is at $\\theta = 0$.</p>` },
        { title: `The math`, body: `<p>Start at $\\theta = 5$, learning rate $\\alpha = 0.1$. Each step does $\\theta \\leftarrow \\theta - \\alpha\\cdot 2\\theta = 0.8\\,\\theta$, shrinking $\\theta$ by $20\\%$.</p>` },
        { title: `Run it`, body: `<p>Five descent steps printing $\\theta$ and $J$.</p>`,
          code: `import numpy as np
theta, alpha = 5.0, 0.1
for step in range(5):
    grad = 2*theta
    theta -= alpha*grad
    print("step", step, "theta =", round(theta, 4), "J =", round(theta**2, 4))`,
          output: `step 0 theta = 4.0 J = 16.0
step 1 theta = 3.2 J = 10.24
step 2 theta = 2.56 J = 6.5536
step 3 theta = 2.048 J = 4.1943
step 4 theta = 1.6384 J = 2.6844` }
      ],
      conclusion: `Each step multiplies $\\theta$ by $0.8$, so $J$ steadily shrinks toward $0$. A well-chosen $\\alpha$ makes descent glide smoothly into the valley.`
    },
    {
      title: `SGD for a click model at scale`,
      domain: `recommenders`,
      question: `Can stochastic gradient descent — one example at a time — fit an accurate click model fast?`,
      steps: [
        { title: `The data`, body: `<p>$600$ sessions with $8$ features and a click label. SGD estimates the gradient from a single example, so it scales to huge data.</p>` },
        { title: `The math`, body: `<p><code>SGDClassifier</code> with <code>log_loss</code> minimizes logistic cost by the update $\\theta \\leftarrow \\theta - \\alpha\\,\\nabla J_i(\\theta)$ using one example $i$ per step.</p>` },
        { title: `Run it`, body: `<p>Fit and report accuracy plus the number of passes SGD ran.</p>`,
          code: `import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=600, n_features=8, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.2,random_state=0)
clf = SGDClassifier(loss="log_loss", random_state=0, max_iter=200).fit(Xtr,ytr)
print("SGD-trained click model accuracy:", round(clf.score(Xte,yte), 3))
print("n iterations run:", clf.n_iter_)`,
          output: `SGD-trained click model accuracy: 0.942
n iterations run: 44` }
      ],
      conclusion: `Noisy one-example-at-a-time steps still converge in $44$ passes to $94.2\\%$ accuracy. SGD is how huge models train without ever loading the whole dataset at once.`
    }
  ],

  /* ======================== ml-linear-regression ======================== */
  "ml-linear-regression": [
    {
      title: `House price by the normal equations`,
      domain: `finance`,
      question: `Can a one-shot formula find the best price line with no iteration?`,
      steps: [
        { title: `The data`, body: `<p>Five homes with features (intercept, square feet, rooms) stacked into matrix $X$, and prices $y$ in $k.</p>` },
        { title: `The math`, body: `<p>The closed-form solution is $\\theta = (X^\\top X)^{-1} X^\\top y$. It jumps straight to the bottom of the squared-error bowl — no gradient descent.</p>` },
        { title: `Run it`, body: `<p>Solve the normal equations directly with NumPy and predict a new home.</p>`,
          code: `import numpy as np
X = np.array([[1,1000,2],[1,1500,3],[1,2000,3],[1,2500,4],[1,1800,3]], float)
y = np.array([200,300,400,500,360], float)  # $k
theta = np.linalg.inv(X.T @ X) @ X.T @ y
print("theta (intercept, per-sqft, per-room):", np.round(theta, 4).tolist())
new = np.array([1,2200,4], float)
print("predicted price ($k) for 2200 sqft / 4 rooms:", round(float(new @ theta), 1))`,
          output: `theta (intercept, per-sqft, per-room): [-0.0, 0.2, 0.0]
predicted price ($k) for 2200 sqft / 4 rooms: 440.0` }
      ],
      conclusion: `The formula recovers $0.2$ per square foot in one calculation and predicts $\\$440$k for a $2200$ sq ft home. $\\theta = (X^\\top X)^{-1}X^\\top y$ solves linear regression exactly.`
    },
    {
      title: `Recovering the true ad coefficients`,
      domain: `marketing`,
      question: `Does least-squares recover the real weights that generated the sales data?`,
      steps: [
        { title: `The data`, body: `<p>$150$ campaigns with $3$ channels each. The data is generated with known true coefficients plus noise.</p>` },
        { title: `The math`, body: `<p>Linear regression minimizes $\\sum_i (\\theta^\\top x_i - y_i)^2$. With enough data the learned $\\theta$ converges to the true generating weights.</p>` },
        { title: `Run it`, body: `<p>Fit and compare learned vs. true coefficients.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.datasets import make_regression
X, y, coef = make_regression(n_samples=150, n_features=3, noise=5.0, coef=True, random_state=0)
m = LinearRegression().fit(X, y)
print("learned coefs:", np.round(m.coef_, 2).tolist())
print("true coefs:    ", np.round(coef, 2).tolist())
print("R^2:", round(m.score(X, y), 4))`,
          output: `learned coefs: [69.73, 3.91, 24.49]
true coefs:     [69.65, 3.96, 24.74]
R^2: 0.9954` }
      ],
      conclusion: `Learned weights $[69.73, 3.91, 24.49]$ nearly match the truth $[69.65, 3.96, 24.74]$, with $R^2 = 0.995$. Least-squares uncovers which channels actually drive sales.`
    },
    {
      title: `Predicting drug dose from labs`,
      domain: `healthcare`,
      question: `How far off, in dose units, is a linear model on unseen patients?`,
      steps: [
        { title: `The data`, body: `<p>$300$ patients with $4$ lab features and a numeric target dose. Split $70/30$ into train and test.</p>` },
        { title: `The math`, body: `<p>We report root mean squared error $\\text{RMSE} = \\sqrt{\\tfrac1m \\sum_i (\\hat y_i - y_i)^2}$ on the test set — the typical error in the dose's own units.</p>` },
        { title: `Run it`, body: `<p>Fit, predict the held-out patients, take RMSE.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.datasets import make_regression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
X, y = make_regression(n_samples=300, n_features=4, noise=12.0, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
m = LinearRegression().fit(Xtr,ytr)
rmse = mean_squared_error(yte, m.predict(Xte)) ** 0.5
print("RMSE predicting drug dose:", round(rmse, 2))`,
          output: `RMSE predicting drug dose: 11.05` }
      ],
      conclusion: `The model's predictions on new patients are off by about $11$ dose units (RMSE $= 11.05$), close to the $12$ noise floor baked into the data. Linear regression is the baseline every richer model must beat.`
    }
  ],

  /* ============================ ml-likelihood ============================ */
  "ml-likelihood": [
    {
      title: `MLE conversion rate from an A/B test`,
      domain: `marketing`,
      question: `Out of $10$ visitors, $7$ converted — which conversion rate best explains that?`,
      steps: [
        { title: `The data`, body: `<p>$h = 7$ conversions in $n = 10$ visits. The likelihood of a rate $\\theta$ is $L(\\theta) = \\theta^h (1-\\theta)^{n-h}$.</p>` },
        { title: `The math`, body: `<p>Maximum likelihood picks $\\arg\\max_\\theta L(\\theta)$. For a Bernoulli count the maximizer is exactly $\\theta = h/n$.</p>` },
        { title: `Run it`, body: `<p>Evaluate the likelihood at several rates.</p>`,
          code: `import numpy as np
h, n = 7, 10
thetas = np.array([0.3, 0.5, 0.7, 0.9])
L = thetas**h * (1-thetas)**(n-h)
for t, l in zip(thetas, L):
    print("theta =", t, "-> likelihood =", format(l, ".5e"))
print("MLE conversion rate h/n =", h/n)`,
          output: `theta = 0.3 -> likelihood = 7.50141e-05
theta = 0.5 -> likelihood = 9.76562e-04
theta = 0.7 -> likelihood = 2.22357e-03
theta = 0.9 -> likelihood = 4.78297e-04
MLE conversion rate h/n = 0.7` }
      ],
      conclusion: `Likelihood peaks at $\\theta = 0.7$, exactly $h/n$. Maximum likelihood says: trust the rate that makes the observed $7/10$ most probable.`
    },
    {
      title: `Estimating mean blood pressure`,
      domain: `healthcare`,
      question: `From $50$ readings, what mean best explains them under a normal model?`,
      steps: [
        { title: `The data`, body: `<p>$50$ blood-pressure readings drawn around a true mean. We model each as normal with known spread $\\sigma = 8$.</p>` },
        { title: `The math`, body: `<p>The log-likelihood $\\log L(\\mu) = \\sum_i \\log \\mathcal{N}(x_i; \\mu, \\sigma)$ is maximized at the sample mean $\\hat\\mu = \\tfrac1m\\sum_i x_i$.</p>` },
        { title: `Run it`, body: `<p>Compute the MLE mean and compare log-likelihoods.</p>`,
          code: `import numpy as np
from scipy.stats import norm
rng = np.random.default_rng(0)
data = rng.normal(120, 8, size=50)
mu_mle = data.mean()
print("MLE mean BP:", round(float(mu_mle), 3))
ll = lambda m: float(np.sum(norm.logpdf(data, m, 8)))
print("log-lik at mu=115:", round(ll(115), 2))
print("log-lik at mu=mle:", round(ll(mu_mle), 2))`,
          output: `MLE mean BP: 121.032
log-lik at mu=115: -184.89
log-lik at mu=mle: -170.67` }
      ],
      conclusion: `The sample mean $\\hat\\mu = 121.03$ gives a higher log-likelihood ($-170.67$) than any other guess like $115$ ($-184.89$). MLE for a normal mean is simply the average.`
    },
    {
      title: `Daily fraud-alert rate`,
      domain: `fraud`,
      question: `Given counts of fraud alerts per day, what daily rate $\\lambda$ best fits them?`,
      steps: [
        { title: `The data`, body: `<p>Ten days of alert counts. Counts are modeled as Poisson with rate $\\lambda$ alerts/day.</p>` },
        { title: `The math`, body: `<p>The Poisson log-likelihood is maximized at $\\hat\\lambda = $ the sample mean of the counts.</p>` },
        { title: `Run it`, body: `<p>Compute the MLE rate and check the log-likelihood beats a wrong guess.</p>`,
          code: `import numpy as np
counts = np.array([2,0,1,3,2,1,0,2,1,2])
lam_mle = counts.mean()
def loglik(lam):
    from scipy.special import gammaln
    return float(np.sum(counts*np.log(lam) - lam - gammaln(counts+1)))
print("MLE alerts/day (lambda):", lam_mle)
print("log-lik at lambda=1.0:", round(loglik(1.0), 4))
print("log-lik at lambda=mle:", round(loglik(lam_mle), 4))`,
          output: `MLE alerts/day (lambda): 1.4
log-lik at lambda=1.0: -14.5643
log-lik at lambda=mle: -13.8537` }
      ],
      conclusion: `The mean count $\\hat\\lambda = 1.4$ maximizes the Poisson log-likelihood ($-13.85$ vs $-14.56$ at $\\lambda = 1$). Define the data's probability, then maximize it — that is MLE.`
    }
  ],

  /* ======================= ml-logistic-regression ======================= */
  "ml-logistic-regression": [
    {
      title: `Probability of fraud per transaction`,
      domain: `fraud`,
      question: `Can logistic regression output a fraud probability, not just a yes/no?`,
      steps: [
        { title: `The data`, body: `<p>$800$ transactions, $6$ features, only $\\sim10\\%$ fraud. The model outputs $P(y=1 \\mid x) = g(\\theta^\\top x)$ with the sigmoid $g$.</p>` },
        { title: `The math`, body: `<p>The sigmoid $g(z) = 1/(1+e^{-z})$ squashes the score into $(0,1)$. We read off the fraud probability for three test transactions.</p>` },
        { title: `Run it`, body: `<p>Fit and call <code>predict_proba</code> for the fraud class.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=800, n_features=6, weights=[0.9,0.1], random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.25,random_state=0)
clf = LogisticRegression(max_iter=1000).fit(Xtr,ytr)
p = clf.predict_proba(Xte[:3])[:,1]
print("fraud probabilities for 3 transactions:", np.round(p, 3).tolist())
print("test accuracy:", round(clf.score(Xte,yte), 3))`,
          output: `fraud probabilities for 3 transactions: [0.0, 0.07, 0.024]
test accuracy: 0.94` }
      ],
      conclusion: `The model returns calibrated fraud probabilities like $0.07$ and $0.024$ — all safely below $0.5$ — at $94\\%$ accuracy. A probability is far more useful than a bare yes/no for setting review thresholds.`
    },
    {
      title: `Sigmoid mapping for disease risk`,
      domain: `healthcare`,
      question: `How does the sigmoid turn a risk score into a probability?`,
      steps: [
        { title: `The data`, body: `<p>No dataset needed — just three risk scores $z = \\theta^\\top x$: a negative one, zero, and a positive one.</p>` },
        { title: `The math`, body: `<p>$g(z) = 1/(1+e^{-z})$. At $z = 0$ it is exactly $0.5$; large positive $z \\to 1$, large negative $z \\to 0$.</p>` },
        { title: `Run it`, body: `<p>Evaluate the sigmoid by hand at three scores.</p>`,
          code: `import numpy as np
def sigmoid(z): return 1/(1+np.exp(-z))
for z in [-2, 0, 2]:
    print("score z =", z, "-> P(disease) =", round(float(sigmoid(z)), 3))`,
          output: `score z = -2 -> P(disease) = 0.119
score z = 0 -> P(disease) = 0.5
score z = 2 -> P(disease) = 0.881` }
      ],
      conclusion: `A score of $0$ means a perfectly unsure $0.5$; $z = +2$ gives $0.881$ and $z = -2$ gives $0.119$. The sigmoid converts any real score into a valid disease probability.`
    },
    {
      title: `Click-through prediction quality`,
      domain: `recommenders`,
      question: `How good are the probabilities a click model produces, measured by log loss?`,
      steps: [
        { title: `The data`, body: `<p>$1000$ ad impressions with $8$ features and a click label, split $70/30$.</p>` },
        { title: `The math`, body: `<p>Logistic regression is trained by maximum likelihood, equivalent to minimizing the log loss $-\\tfrac1m\\sum_i [y_i\\log p_i + (1-y_i)\\log(1-p_i)]$.</p>` },
        { title: `Run it`, body: `<p>Report accuracy and the probabilistic log loss.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.metrics import log_loss
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=1000, n_features=8, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = LogisticRegression(max_iter=1000).fit(Xtr,ytr)
print("click-through accuracy:", round(clf.score(Xte,yte), 3))
print("log loss:", round(log_loss(yte, clf.predict_proba(Xte)), 4))`,
          output: `click-through accuracy: 0.943
log loss: 0.1585` }
      ],
      conclusion: `The click model reaches $94.3\\%$ accuracy with a low log loss of $0.159$, meaning its probabilities are both right and confident. Logistic regression is the workhorse classifier of online advertising.`
    }
  ],

  /* ============================= ml-softmax ============================= */
  "ml-softmax": [
    {
      title: `Labeling an image among four classes`,
      domain: `vision`,
      question: `How do four raw class scores become probabilities that sum to one?`,
      steps: [
        { title: `The data`, body: `<p>One image with four scores — cat, dog, bird, car. We need probabilities over the classes.</p>` },
        { title: `The math`, body: `<p>Softmax: $\\phi_i = \\exp(z_i) / \\sum_j \\exp(z_j)$. Exponentiating makes scores positive; dividing by the sum makes them add to $1$.</p>` },
        { title: `Run it`, body: `<p>Numerically stable softmax (subtract the max first).</p>`,
          code: `import numpy as np
def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()
scores = np.array([2.0, 1.0, 0.1, -1.0])  # cat, dog, bird, car
p = softmax(scores)
labels = ["cat","dog","bird","car"]
for lab, pi in zip(labels, p):
    print(lab, "->", round(float(pi), 3))
print("sum:", round(float(p.sum()), 3), "| prediction:", labels[int(p.argmax())])`,
          output: `cat -> 0.638
dog -> 0.235
bird -> 0.095
car -> 0.032
sum: 1.0 | prediction: cat` }
      ],
      conclusion: `The four scores become probabilities $[0.638, 0.235, 0.095, 0.032]$ that sum to exactly $1$, and the biggest, cat, is the prediction. Softmax is the final layer of nearly every image classifier.`
    },
    {
      title: `Three-way intent classification`,
      domain: `recommenders`,
      question: `Can a multinomial model assign a user's intent across three categories?`,
      steps: [
        { title: `The data`, body: `<p>$900$ user sessions with $8$ features and $K = 3$ intent classes (browse, compare, buy).</p>` },
        { title: `The math`, body: `<p>Multinomial logistic regression gives each class its own weights $\\theta_i$ and applies softmax to the scores $\\theta_i^\\top x$.</p>` },
        { title: `Run it`, body: `<p>Fit and read the softmax probabilities for one user.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=900, n_features=8, n_classes=3, n_informative=5, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = LogisticRegression(max_iter=2000).fit(Xtr,ytr)
print("3-way intent accuracy:", round(clf.score(Xte,yte), 3))
print("softmax probs for one user:", np.round(clf.predict_proba(Xte[:1])[0], 3).tolist())`,
          output: `3-way intent accuracy: 0.778
softmax probs for one user: [0.911, 0.014, 0.074]` }
      ],
      conclusion: `For one user the softmax outputs $[0.911, 0.014, 0.074]$ — a confident bet on the first intent — at $77.8\\%$ overall accuracy. Softmax scales logistic regression to many classes.`
    },
    {
      title: `Three-class flower diagnosis`,
      domain: `healthcare`,
      question: `On the classic Iris task, how confident is softmax per sample?`,
      steps: [
        { title: `The data`, body: `<p>The Iris dataset: $150$ samples, $4$ measurements, $3$ species — a stand-in for three-way clinical classification.</p>` },
        { title: `The math`, body: `<p>Softmax over three class scores yields probabilities $\\phi_1, \\phi_2, \\phi_3$ that sum to $1$; the largest is the prediction.</p>` },
        { title: `Run it`, body: `<p>Fit on $70\\%$, inspect the probabilities for one test sample.</p>`,
          code: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = LogisticRegression(max_iter=2000).fit(Xtr,ytr)
print("3-class diagnosis accuracy:", round(clf.score(Xte,yte), 3))
print("class probabilities, first sample:", np.round(clf.predict_proba(Xte[:1])[0], 3).tolist())`,
          output: `3-class diagnosis accuracy: 0.978
class probabilities, first sample: [0.0, 0.06, 0.94]` }
      ],
      conclusion: `The model is $97.8\\%$ accurate and puts $0.94$ probability on the third class for the first sample. Softmax turns separate class scores into one clean probability distribution.`
    }
  ],

  /* ============================== ml-glm =============================== */
  "ml-glm": [
    {
      title: `Counting website visits with Poisson regression`,
      domain: `marketing`,
      question: `For count data, does swapping the GLM family recover the true effects?`,
      steps: [
        { title: `The data`, body: `<p>$300$ pages with $3$ features. Visit counts are generated as Poisson with mean $\\exp(\\theta^\\top x)$ — counts, not yes/no.</p>` },
        { title: `The math`, body: `<p>A GLM sets $\\eta = \\theta^\\top x$ and picks a family. For Poisson the mean is $e^\\eta$ (the log link), always positive — perfect for counts.</p>` },
        { title: `Run it`, body: `<p>Fit <code>PoissonRegressor</code> and compare to the true coefficients.</p>`,
          code: `import numpy as np
from sklearn.linear_model import PoissonRegressor
rng = np.random.default_rng(0)
X = rng.normal(size=(300, 3))
true_w = np.array([0.5, -0.3, 0.2])
counts = rng.poisson(np.exp(X @ true_w))
m = PoissonRegressor(max_iter=500).fit(X, counts)
print("learned coefs:", np.round(m.coef_, 3).tolist())
print("true coefs:   ", true_w.tolist())
print("predicted visits (first 5):", np.round(m.predict(X[:5]), 2).tolist())`,
          output: `learned coefs: [0.239, -0.146, 0.106]
true coefs:    [0.5, -0.3, 0.2]
predicted visits (first 5): [1.22, 1.25, 1.19, 0.88, 0.56]` }
      ],
      conclusion: `The Poisson GLM recovers the same sign and ordering of effects and predicts sensible positive visit counts. Same recipe $\\eta = \\theta^\\top x$, just a different family for counts.`
    },
    {
      title: `Readmission risk as a Bernoulli GLM`,
      domain: `healthcare`,
      question: `Is logistic regression really just the Bernoulli member of the GLM family?`,
      steps: [
        { title: `The data`, body: `<p>$400$ patients with $5$ features and a yes/no readmission label. The Bernoulli output makes this a classification GLM.</p>` },
        { title: `The math`, body: `<p>For the Bernoulli family the inverse link is the sigmoid: mean $= 1/(1+e^{-\\eta})$ with $\\eta = \\theta^\\top x$. That is exactly logistic regression.</p>` },
        { title: `Run it`, body: `<p>Fit, compute the linear score $\\eta$, then apply the sigmoid by hand.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=400, n_features=5, random_state=0)
clf = LogisticRegression(max_iter=1000).fit(X, y)
eta = X[:3] @ clf.coef_[0] + clf.intercept_[0]
print("linear score eta:", np.round(eta, 3).tolist())
print("sigmoid(eta) = P(readmit):", np.round(1/(1+np.exp(-eta)), 3).tolist())`,
          output: `linear score eta: [3.822, 0.968, 2.699]
sigmoid(eta) = P(readmit): [0.979, 0.725, 0.937]` }
      ],
      conclusion: `Applying the sigmoid to $\\eta = \\theta^\\top x$ reproduces the model's readmission probabilities. Logistic regression is the GLM with a Bernoulli output — one framework, swap the distribution.`
    },
    {
      title: `Insurance claim size with a Gamma GLM`,
      domain: `finance`,
      question: `For positive, skewed dollar amounts, can a Gamma GLM explain the variation?`,
      steps: [
        { title: `The data`, body: `<p>$400$ policies with $3$ features. Claim amounts are positive and right-skewed, generated from a Gamma distribution with mean $\\exp(\\theta^\\top x)$.</p>` },
        { title: `The math`, body: `<p>The Gamma GLM (a <code>TweedieRegressor</code> with power $2$ and log link) models strictly positive outcomes. Fit quality is the explained deviance $D^2$.</p>` },
        { title: `Run it`, body: `<p>Fit the Gamma GLM and report $D^2$.</p>`,
          code: `import numpy as np
from sklearn.linear_model import TweedieRegressor
rng = np.random.default_rng(0)
X = rng.normal(size=(400, 3))
true_w = np.array([0.4, -0.2, 0.3])
mu = np.exp(0.5 + X @ true_w)
y = rng.gamma(shape=2.0, scale=mu/2.0)   # positive claim sizes, Gamma
m = TweedieRegressor(power=2, link="log", max_iter=2000).fit(X, y)
print("learned coefs:", np.round(m.coef_, 3).tolist())
print("D^2 (explained deviance):", round(m.score(X, y), 4))`,
          output: `learned coefs: [0.206, -0.095, 0.158]
D^2 (explained deviance): 0.2468` }
      ],
      conclusion: `The Gamma GLM explains about $25\\%$ of the deviance in skewed claim amounts while keeping every prediction positive. Counts, yes/no, dollars — one GLM template covers them all.`
    }
  ],

  /* =============================== ml-svm =============================== */
  "ml-svm": [
    {
      title: `Widest-margin tumor classifier`,
      domain: `healthcare`,
      question: `Can a maximum-margin line separate benign from malignant tumors accurately?`,
      steps: [
        { title: `The data`, body: `<p>The breast-cancer dataset: $569$ tumors, $30$ features, labeled benign/malignant. Features are standardized first.</p>` },
        { title: `The math`, body: `<p>A linear SVM solves $\\min_{w,b} \\tfrac12\\lVert w\\rVert^2$ subject to every point being on its correct side past the margin. Only the support vectors define the boundary.</p>` },
        { title: `Run it`, body: `<p>Scale, fit a linear SVM, count support vectors.</p>`,
          code: `import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
X, y = load_breast_cancer(return_X_y=True)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
sc = StandardScaler().fit(Xtr)
clf = SVC(kernel="linear", random_state=0).fit(sc.transform(Xtr), ytr)
print("tumor classification accuracy:", round(clf.score(sc.transform(Xte), yte), 3))
print("number of support vectors:", int(clf.n_support_.sum()))`,
          output: `tumor classification accuracy: 0.959
number of support vectors: 32` }
      ],
      conclusion: `The SVM reaches $95.9\\%$ accuracy using only $32$ support vectors — the few borderline tumors that pin down the widest separating street. SVMs shine when features are many but examples moderate.`
    },
    {
      title: `Margin width of a fraud boundary`,
      domain: `fraud`,
      question: `How wide is the street a linear SVM carves between fraud and legit?`,
      steps: [
        { title: `The data`, body: `<p>$600$ transactions, $10$ features, $\\sim15\\%$ fraud. A linear SVM finds the separating hyperplane.</p>` },
        { title: `The math`, body: `<p>The margin width is $2/\\lVert w\\rVert$. Smaller weight norm means a wider, more robust street between the classes.</p>` },
        { title: `Run it`, body: `<p>Fit a <code>LinearSVC</code>, compute the margin width.</p>`,
          code: `import numpy as np
from sklearn.svm import LinearSVC
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=600, n_features=10, weights=[0.85,0.15], random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.25,random_state=0)
clf = LinearSVC(random_state=0, max_iter=5000).fit(Xtr,ytr)
print("fraud detection accuracy:", round(clf.score(Xte,yte), 3))
print("margin width 2/||w||:", round(2/np.linalg.norm(clf.coef_), 4))`,
          output: `fraud detection accuracy: 0.973
margin width 2/||w||: 1.9228` }
      ],
      conclusion: `The detector hits $97.3\\%$ accuracy with a margin width of $1.92$ — a comfortably wide gap that tends to generalize to new fraud patterns.`
    },
    {
      title: `Recognizing handwritten digits`,
      domain: `vision`,
      question: `Can a linear SVM separate the ten digit classes from raw pixels?`,
      steps: [
        { title: `The data`, body: `<p>The digits dataset: $1797$ images of $8{\\times}8$ pixels, $10$ classes. Pixels are scaled to $[0,1]$.</p>` },
        { title: `The math`, body: `<p>For multiclass, scikit-learn fits one max-margin SVM per class (one-vs-one) and votes. Each is the same $\\min \\tfrac12\\lVert w\\rVert^2$ problem.</p>` },
        { title: `Run it`, body: `<p>Fit a linear SVM on the digit pixels.</p>`,
          code: `import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
X, y = load_digits(return_X_y=True)
Xtr,Xte,ytr,yte = train_test_split(X/16.0, y, test_size=0.3, random_state=0)
clf = SVC(kernel="linear", random_state=0).fit(Xtr, ytr)
print("digit recognition accuracy:", round(clf.score(Xte, yte), 3))`,
          output: `digit recognition accuracy: 0.98` }
      ],
      conclusion: `Stacking per-class maximum-margin classifiers recognizes digits at $98\\%$ accuracy. The widest-street idea scales straight from two classes to ten.`
    }
  ],

  /* ============================= ml-kernels ============================= */
  "ml-kernels": [
    {
      title: `Curved boundaries on concentric rings`,
      domain: `vision`,
      question: `When one class encircles another, can the kernel trick still separate them?`,
      steps: [
        { title: `The data`, body: `<p><code>make_circles</code>: an inner ring (class 0) surrounded by an outer ring (class 1). No straight line can split them.</p>` },
        { title: `The math`, body: `<p>The Gaussian kernel $K(x,z) = \\exp(-\\lVert x-z\\rVert^2 / 2\\sigma^2)$ implicitly lifts points into a space where a straight boundary works — without ever building the features.</p>` },
        { title: `Run it`, body: `<p>Compare a linear SVM to an RBF (Gaussian) kernel SVM.</p>`,
          code: `import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_circles
from sklearn.model_selection import train_test_split
X, y = make_circles(n_samples=400, noise=0.1, factor=0.4, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
lin = SVC(kernel="linear", random_state=0).fit(Xtr,ytr)
rbf = SVC(kernel="rbf", gamma=1.0, random_state=0).fit(Xtr,ytr)
print("linear kernel accuracy:", round(lin.score(Xte,yte), 3))
print("RBF (Gaussian) kernel accuracy:", round(rbf.score(Xte,yte), 3))`,
          output: `linear kernel accuracy: 0.525
RBF (Gaussian) kernel accuracy: 1.0` }
      ],
      conclusion: `The linear SVM is a coin flip ($52.5\\%$) on the rings, but the Gaussian kernel hits $100\\%$. The kernel trick buys a curved boundary for free.`
    },
    {
      title: `Gaussian similarity between patients`,
      domain: `healthcare`,
      question: `How does the Gaussian kernel score similarity for near vs. far points?`,
      steps: [
        { title: `The data`, body: `<p>Three feature vectors: a point $p$, an identical copy $q$, and a distant point $r$.</p>` },
        { title: `The math`, body: `<p>$K(a,b) = \\exp(-\\lVert a-b\\rVert^2 / 2\\sigma^2)$ with $\\sigma = 1$. It returns $1$ for identical points and fades toward $0$ as distance grows.</p>` },
        { title: `Run it`, body: `<p>Evaluate the kernel by hand at distance $0$ and distance $\\approx 2.83$.</p>`,
          code: `import numpy as np
def K(a, b, sigma=1.0):
    return float(np.exp(-np.sum((a-b)**2)/(2*sigma**2)))
p = np.array([1.0, 2.0]); q = np.array([1.0, 2.0]); r = np.array([3.0, 4.0])
print("K(p,p) identical points:", round(K(p,q), 4))
print("K(p,r) distance =", round(float(np.linalg.norm(p-r)),3), "->", round(K(p,r), 4))`,
          output: `K(p,p) identical points: 1.0
K(p,r) distance = 2.828 -> 0.0183` }
      ],
      conclusion: `Identical patients score $K = 1$; patients $2.83$ apart score just $0.018$. The Gaussian kernel is a smooth similarity bump — high up close, near zero far away.`
    },
    {
      title: `Tuning kernel width for default risk`,
      domain: `finance`,
      question: `How does the Gaussian width $\\gamma$ trade smoothness against fit on default data?`,
      steps: [
        { title: `The data`, body: `<p>$500$ borrowers, $8$ features, $5$ informative. We sweep the RBF width parameter $\\gamma$ (which is $1/2\\sigma^2$).</p>` },
        { title: `The math`, body: `<p>Small $\\gamma$ = wide, smooth bumps (may underfit); large $\\gamma$ = narrow, wiggly bumps (may overfit). The middle generalizes best.</p>` },
        { title: `Run it`, body: `<p>Fit RBF SVMs at three values of $\\gamma$.</p>`,
          code: `import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=500, n_features=8, n_informative=5, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
for g in [0.01, 0.1, 1.0]:
    clf = SVC(kernel="rbf", gamma=g, random_state=0).fit(Xtr,ytr)
    print("gamma =", g, "-> default-risk accuracy =", round(clf.score(Xte,yte), 3))`,
          output: `gamma = 0.01 -> default-risk accuracy = 0.867
gamma = 0.1 -> default-risk accuracy = 0.933
gamma = 1.0 -> default-risk accuracy = 0.84` }
      ],
      conclusion: `The middle width $\\gamma = 0.1$ wins at $93.3\\%$, beating both the too-smooth $0.01$ and the too-wiggly $1.0$. The kernel's width is the key knob for curved decision boundaries.`
    }
  ],

  /* =============================== ml-gda =============================== */
  "ml-gda": [
    {
      title: `Bell curves for tumor classes`,
      domain: `healthcare`,
      question: `Can modeling each tumor class as a Gaussian classify accurately?`,
      steps: [
        { title: `The data`, body: `<p>The breast-cancer dataset, $30$ features. GDA fits a bell curve $p(x\\mid y) = \\mathcal{N}(\\mu_y, \\Sigma)$ per class plus a prior $p(y)$.</p>` },
        { title: `The math`, body: `<p>Bayes' rule turns these into $p(y\\mid x) \\propto p(x\\mid y)\\,p(y)$. Shared covariance gives a linear boundary — this is LDA.</p>` },
        { title: `Run it`, body: `<p>Fit <code>LinearDiscriminantAnalysis</code> and read off the priors.</p>`,
          code: `import numpy as np
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
X, y = load_breast_cancer(return_X_y=True)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = LinearDiscriminantAnalysis().fit(Xtr,ytr)
print("LDA (GDA) tumor accuracy:", round(clf.score(Xte,yte), 3))
print("class priors p(y):", np.round(clf.priors_, 3).tolist())`,
          output: `LDA (GDA) tumor accuracy: 0.971
class priors p(y): [0.374, 0.626]` }
      ],
      conclusion: `Fitting one Gaussian per class and flipping with Bayes gives $97.1\\%$ accuracy. The learned priors $[0.374, 0.626]$ are just how common each class is — a fully generative classifier.`
    },
    {
      title: `Curved boundary for loan default`,
      domain: `finance`,
      question: `When each class has its own spread, does a quadratic boundary help?`,
      steps: [
        { title: `The data`, body: `<p>$600$ borrowers, $6$ features. Default and repay classes may have different covariances $\\Sigma_y$.</p>` },
        { title: `The math`, body: `<p>Quadratic discriminant analysis (QDA) lets each class keep its own $\\Sigma_y$, yielding a curved boundary and a posterior $p(\\text{default}\\mid x)$.</p>` },
        { title: `Run it`, body: `<p>Fit QDA and read posteriors for three borrowers.</p>`,
          code: `import numpy as np
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=600, n_features=6, n_informative=4, n_redundant=0, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = QuadraticDiscriminantAnalysis().fit(Xtr,ytr)
print("QDA default-vs-repay accuracy:", round(clf.score(Xte,yte), 3))
print("posterior p(default|x) first 3:", np.round(clf.predict_proba(Xte[:3])[:,1], 3).tolist())`,
          output: `QDA default-vs-repay accuracy: 0.872
posterior p(default|x) first 3: [0.202, 0.017, 0.956]` }
      ],
      conclusion: `QDA reaches $87.2\\%$ and outputs sharp posteriors like $0.956$ for a risky borrower. Per-class bell curves plus Bayes give both a label and a calibrated default probability.`
    },
    {
      title: `Ten Gaussians for digit images`,
      domain: `vision`,
      question: `Can one bell curve per digit recognize handwriting?`,
      steps: [
        { title: `The data`, body: `<p>The digits dataset: $10$ classes of $8{\\times}8$ pixel images. GDA fits a Gaussian per digit.</p>` },
        { title: `The math`, body: `<p>For a new image, each class asks how well its bell curve explains the pixels, weighted by the prior. The largest $p(y\\mid x)$ wins.</p>` },
        { title: `Run it`, body: `<p>Fit LDA across all ten digit classes.</p>`,
          code: `import numpy as np
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
X, y = load_digits(return_X_y=True)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = LinearDiscriminantAnalysis().fit(Xtr,ytr)
print("LDA digit accuracy (10 Gaussians):", round(clf.score(Xte,yte), 3))`,
          output: `LDA digit accuracy (10 Gaussians): 0.941` }
      ],
      conclusion: `Ten Gaussians, one per digit, classify at $94.1\\%$. Generative GDA works even with $10$ classes — model what each looks like, then let Bayes pick.`
    }
  ],

  /* =========================== ml-naive-bayes =========================== */
  "ml-naive-bayes": [
    {
      title: `A spam filter from a handful of emails`,
      domain: `marketing`,
      question: `Can multiplying per-word probabilities flag spam from tiny training data?`,
      steps: [
        { title: `The data`, body: `<p>Eight short messages labeled spam ($1$) or ham ($0$). Each becomes a bag of word counts.</p>` },
        { title: `The math`, body: `<p>Naive Bayes assumes words are independent given the class, so $P(x\\mid y) = \\prod_i P(x_i\\mid y)$. Combine with the prior and pick the larger.</p>` },
        { title: `Run it`, body: `<p>Vectorize words, fit <code>MultinomialNB</code>, classify two new messages.</p>`,
          code: `import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
docs = ["free money win now","cheap meds buy now","team meeting at noon",
        "project deadline tomorrow","win free prize click","lunch with the team",
        "claim your free reward","schedule the project review"]
labels = [1,1,0,0,1,0,1,0]  # 1 = spam
vec = CountVectorizer()
Xtr = vec.fit_transform(docs)
clf = MultinomialNB().fit(Xtr, labels)
test = ["free win now","team project meeting"]
pred = clf.predict(vec.transform(test))
print("predictions (1=spam):", pred.tolist())
print("P(spam) for each:", np.round(clf.predict_proba(vec.transform(test))[:,1], 3).tolist())`,
          output: `predictions (1=spam): [1, 0]
P(spam) for each: [0.971, 0.049]` }
      ],
      conclusion: `"free win now" scores $P(\\text{spam}) = 0.971$ and "team project meeting" only $0.049$ — both correct. Multiplying independent word probabilities makes a fast, effective spam filter.`
    },
    {
      title: `Gaussian Naive Bayes for tumors`,
      domain: `healthcare`,
      question: `With continuous lab features, does the independence assumption still classify well?`,
      steps: [
        { title: `The data`, body: `<p>Breast-cancer data, $30$ continuous features. Gaussian NB models each feature as a bell curve per class.</p>` },
        { title: `The math`, body: `<p>$P(x\\mid y) = \\prod_i \\mathcal{N}(x_i; \\mu_{iy}, \\sigma_{iy})$ — independent Gaussians. Bayes' rule plus the prior gives the prediction.</p>` },
        { title: `Run it`, body: `<p>Fit <code>GaussianNB</code> and report accuracy and priors.</p>`,
          code: `import numpy as np
from sklearn.naive_bayes import GaussianNB
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
X, y = load_breast_cancer(return_X_y=True)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = GaussianNB().fit(Xtr,ytr)
print("Gaussian NB tumor accuracy:", round(clf.score(Xte,yte), 3))
print("class priors:", np.round(clf.class_prior_, 3).tolist())`,
          output: `Gaussian NB tumor accuracy: 0.924
class priors: [0.374, 0.626]` }
      ],
      conclusion: `Even pretending the $30$ correlated features are independent, Gaussian NB reaches $92.4\\%$. The naive assumption is rarely true yet works remarkably well as a fast baseline.`
    },
    {
      title: `Hand-computed fraud posterior`,
      domain: `fraud`,
      question: `How do prior times independent likelihoods combine into a fraud probability?`,
      steps: [
        { title: `The data`, body: `<p>One transaction with three binary flags (foreign, large, night). We know each flag's probability under fraud and under legit, plus a $5\\%$ fraud prior.</p>` },
        { title: `The math`, body: `<p>Score each class as $P(y)\\prod_i P(x_i\\mid y)$, then normalize: $P(\\text{fraud}\\mid x) = \\dfrac{s_{\\text{fraud}}}{s_{\\text{fraud}} + s_{\\text{legit}}}$.</p>` },
        { title: `Run it`, body: `<p>Multiply the prior and likelihoods, then normalize.</p>`,
          code: `import numpy as np
prior_fraud = 0.05
pf = np.array([0.7, 0.6, 0.8])   # foreign, large, night | fraud
pl = np.array([0.1, 0.2, 0.3])   # same flags | legit
score_fraud = prior_fraud * np.prod(pf)
score_legit = (1-prior_fraud) * np.prod(pl)
post = score_fraud / (score_fraud + score_legit)
print("fraud score:", round(score_fraud, 6))
print("legit score:", round(score_legit, 6))
print("P(fraud | features):", round(post, 4))`,
          output: `fraud score: 0.0168
legit score: 0.0057
P(fraud | features): 0.7467` }
      ],
      conclusion: `Despite a tiny $5\\%$ prior, three strong fraud flags multiply up to $P(\\text{fraud}\\mid x) = 0.747$. Naive Bayes is just prior times a product of independent likelihoods, normalized.`
    }
  ],

  /* ============================== ml-trees ============================== */
  "ml-trees": [
    {
      title: `How tree depth trades fit for generalization`,
      domain: `finance`,
      question: `As a default-risk tree grows deeper, does test accuracy keep improving?`,
      steps: [
        { title: `The data`, body: `<p>$500$ borrowers, $6$ features. We grow trees of depth $1$, $3$, and $8$ and compare train vs. test accuracy.</p>` },
        { title: `The math`, body: `<p>Each split is chosen to minimize Gini impurity $1 - \\sum_c p_c^2$. Deeper trees fit training data better but can memorize noise.</p>` },
        { title: `Run it`, body: `<p>Train trees at three depths and print both accuracies.</p>`,
          code: `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
X, y = make_classification(n_samples=500, n_features=6, n_informative=4, n_redundant=0, random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
for d in [1, 3, 8]:
    clf = DecisionTreeClassifier(max_depth=d, random_state=0).fit(Xtr,ytr)
    print("depth", d, "train acc =", round(clf.score(Xtr,ytr),3), "test acc =", round(clf.score(Xte,yte),3))`,
          output: `depth 1 train acc = 0.714 test acc = 0.607
depth 3 train acc = 0.857 test acc = 0.72
depth 8 train acc = 0.974 test acc = 0.733` }
      ],
      conclusion: `Train accuracy climbs to $97.4\\%$ at depth $8$, but test accuracy stalls near $73\\%$ — the deep tree memorizes noise. Moderate depth keeps the staircase of splits honest.`
    },
    {
      title: `A readable triage rule`,
      domain: `healthcare`,
      question: `Can a shallow tree give an accurate, human-readable triage rule?`,
      steps: [
        { title: `The data`, body: `<p>Breast-cancer data. We cap the tree at depth $2$ so the whole rule fits on a card.</p>` },
        { title: `The math`, body: `<p>The root split is the single yes/no question that most reduces Gini impurity. <code>export_text</code> prints the learned threshold.</p>` },
        { title: `Run it`, body: `<p>Fit a depth-2 tree and print its top split.</p>`,
          code: `import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
X, y = load_breast_cancer(return_X_y=True)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)
clf = DecisionTreeClassifier(max_depth=2, random_state=0).fit(Xtr,ytr)
print("triage tree accuracy:", round(clf.score(Xte,yte), 3))
print(export_text(clf, max_depth=1).strip().split(chr(10))[0])`,
          output: `triage tree accuracy: 0.947
|--- feature_27 &lt;= 0.14` }
      ],
      conclusion: `A two-question tree reaches $94.7\\%$ accuracy, and the top rule is just "is feature_27 &le; $0.14$?". Trees power triage and credit scoring precisely because the reasoning is transparent.`
    },
    {
      title: `Gini impurity of a churn split`,
      domain: `marketing`,
      question: `By how much does splitting on "age &gt; 30" purify a churn group?`,
      steps: [
        { title: `The data`, body: `<p>Ten customers: $5$ churn, $5$ stay. Splitting on "age &gt; 30" gives a $4$-churn/$1$-stay group and a $1$-churn/$4$-stay group.</p>` },
        { title: `The math`, body: `<p>Gini $= 1 - (p_1^2 + p_0^2)$. The split's quality is the size-weighted Gini of the two children — lower is purer.</p>` },
        { title: `Run it`, body: `<p>Compute Gini before and after the split.</p>`,
          code: `import numpy as np
def gini(n1, n0):
    n = n1 + n0
    p = n1 / n
    return 1 - (p**2 + (1-p)**2)
print("before split (5 churn, 5 stay) gini:", round(gini(5,5), 3))
print("age>30 (4 churn, 1 stay) gini:", round(gini(4,1), 3))
print("age<=30 (1 churn, 4 stay) gini:", round(gini(1,4), 3))
weighted = (5*gini(4,1) + 5*gini(1,4)) / 10
print("weighted gini after split:", round(weighted, 3))`,
          output: `before split (5 churn, 5 stay) gini: 0.5
age>30 (4 churn, 1 stay) gini: 0.32
age<=30 (1 churn, 4 stay) gini: 0.32
weighted gini after split: 0.32` }
      ],
      conclusion: `The split drops impurity from $0.5$ to a weighted $0.32$, so "age &gt; 30" is a good question. Trees greedily pick whichever split purifies the groups most.`
    }
  ]

});
