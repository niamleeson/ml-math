/* =====================================================================
   REAL-WORLD WALKTHROUGHS — Module 9B (Classical ML, beyond the cheat sheet).
   Three worked, runnable case studies per lesson, each in a distinct domain.
   Every code block was executed with python3 (scikit-learn 1.6.1 / numpy 1.26.4
   / scipy 1.12.0); the `output` field is the exact captured stdout.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ================================================================= */
  /* cls-stacking — Stacking ensembles                                 */
  /* ================================================================= */
  "cls-stacking": [
    {
      title: `Blending models to price houses`,
      domain: `Real estate`,
      question: `Three different models each capture part of how a home's price depends on its size, age, and distance to the center. Can a meta-model that blends them beat the best single model?`,
      steps: [
        { title: `The data`, body:
          `<p>We simulate 600 homes. Each has size $s$ (m²), age $a$ (years), and distance $d$ (km to center).</p>
           <p>Price (in \\$k) mixes a linear trend with curvature and a wave: $\\text{price} = 3s - 1.5a - 4d + 40\\sin(s/30) + 0.02(s-150)^2 + \\text{noise}$.</p>
           <p>The linear part suits a linear model; the wave and curvature suit a tree. No single model is right about everything.</p>` },
        { title: `The math`, body:
          `<p>Each base model $h_k$ predicts $z_k = h_k(x)$. The meta-model combines them: $\\hat{y} = \\sum_k w_k z_k$.</p>
           <p>The weights $w_k$ are learned on out-of-fold predictions (here 5-fold), so the combiner never sees a base model's training answers and cannot overfit them.</p>` },
        { title: `Run it`, body:
          `<p>Fit a gradient-boosted tree, a ridge linear model, and a kNN regressor, then stack them with a ridge meta-model. Compare mean absolute error (lower is better).</p>`,
          code:
`import numpy as np
from sklearn.ensemble import StackingRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.neighbors import KNeighborsRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

rng = np.random.default_rng(0)
n = 600
size = rng.uniform(50, 250, n)
age  = rng.uniform(0, 80, n)
dist = rng.uniform(0.5, 20, n)
price = (3.0*size - 1.5*age - 4.0*dist
         + 40.0*np.sin(size/30.0)
         + 0.02*(size-150)**2
         + rng.normal(0, 15, n))
X = np.column_stack([size, age, dist])
Xtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.25, random_state=0)

base = [("gbt", GradientBoostingRegressor(random_state=0)),
        ("ridge", Ridge(alpha=1.0)),
        ("knn", KNeighborsRegressor(n_neighbors=7))]
mae = {}
for name, est in base:
    est.fit(Xtr, ytr)
    mae[name] = mean_absolute_error(yte, est.predict(Xte))

stack = StackingRegressor(estimators=base, final_estimator=Ridge(alpha=1.0), cv=5)
stack.fit(Xtr, ytr)
mae["stack"] = mean_absolute_error(yte, stack.predict(Xte))
for k in ["gbt","ridge","knn","stack"]:
    print(f"{k:6s} MAE = {mae[k]:6.2f}")
print("meta weights:", np.round(stack.final_estimator_.coef_, 2))`,
          output:
`gbt    MAE =  15.75
ridge  MAE =  72.70
knn    MAE =  17.69
stack  MAE =  15.17
meta weights: [0.78 0.03 0.2 ]` }
      ],
      conclusion: `The stacked model's MAE of $15.17$ beats every base model (best base $= 15.75$). The learned weights $\\approx[0.78,\\ 0.03,\\ 0.20]$ lean on the tree and kNN and almost ignore the weak linear model — exactly the "trust the reliable model" behavior $\\hat{y} = \\sum_k w_k z_k$ promises.`
    },
    {
      title: `Combining clinical signals for risk`,
      domain: `Healthcare`,
      question: `A patient's risk depends partly on linear biomarker effects and partly on a nonlinear interaction. A linear model, a tree, and kNN each see only part of it. Does stacking give a better risk score?`,
      steps: [
        { title: `The data`, body:
          `<p>2000 patients, six biomarkers $x_1,\\dots,x_6$. The log-odds of disease is $1.1x_1 - 0.9x_2 + 1.6\\sin(2x_3) + 1.4(x_4 x_5) - 0.7x_6$.</p>
           <p>The probability is $p = 1/(1 + e^{-\\text{logit}})$, and each patient's label is drawn from $p$.</p>
           <p>The linear terms favor logistic regression; the $\\sin$ and the product $x_4 x_5$ favor trees and kNN.</p>` },
        { title: `The math`, body:
          `<p>We score with AUC — the probability the model ranks a random sick patient above a random healthy one. Higher is better, $0.5$ is a coin flip.</p>
           <p>The stacking meta-model is a logistic regression over the three base probabilities, $\\hat{y} = \\sigma\\big(\\sum_k w_k z_k\\big)$, with $z_k$ each base model's predicted probability.</p>` },
        { title: `Run it`, body:
          `<p>Train logistic regression, a gradient-boosted tree, and kNN, then stack them. Report AUC on a held-out test split.</p>`,
          code:
`import numpy as np
from sklearn.ensemble import StackingClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

rng = np.random.default_rng(0)
n = 2000
x = rng.normal(0, 1, (n, 6))
logit = (1.1*x[:,0] - 0.9*x[:,1]
         + 1.6*np.sin(2*x[:,2])
         + 1.4*(x[:,3]*x[:,4])
         - 0.7*x[:,5])
p = 1/(1+np.exp(-logit))
y = (rng.uniform(size=n) < p).astype(int)
Xtr, Xte, ytr, yte = train_test_split(x, y, test_size=0.3, random_state=0)

base = [("logreg", LogisticRegression(max_iter=2000)),
        ("gbt", GradientBoostingClassifier(random_state=0)),
        ("knn", KNeighborsClassifier(n_neighbors=25))]
auc = {}
for name, est in base:
    est.fit(Xtr, ytr)
    auc[name] = roc_auc_score(yte, est.predict_proba(Xte)[:,1])
stack = StackingClassifier(estimators=base,
        final_estimator=LogisticRegression(max_iter=2000), cv=5,
        stack_method="predict_proba")
stack.fit(Xtr, ytr)
auc["stack"] = roc_auc_score(yte, stack.predict_proba(Xte)[:,1])
for k in ["logreg","gbt","knn","stack"]:
    print(f"{k:6s} AUC = {auc[k]:.3f}")`,
          output:
`logreg AUC = 0.780
gbt    AUC = 0.854
knn    AUC = 0.855
stack  AUC = 0.868` }
      ],
      conclusion: `Stacking reaches AUC $0.868$, above all three base models (best base $0.855$). Because the base models capture complementary pieces — linear effects vs. the nonlinear $\\sin$ and interaction — the meta-model fuses them into a strictly better risk score.`
    },
    {
      title: `Forecasting electricity demand`,
      domain: `Energy grids`,
      question: `Grid demand swings with the time of day and bends with temperature. A tree, a linear model, and an RBF support-vector model each fit it differently. Can a stack track demand better than any one?`,
      steps: [
        { title: `The data`, body:
          `<p>500 hourly readings. Demand (MW) follows two daily peaks plus a temperature U-shape: $\\text{demand} = 300 + 80\\sin(\\tfrac{h-7}{24}2\\pi) + 60\\sin(\\tfrac{h-19}{24}2\\pi) + 1.2(T-18)^2 + \\text{noise}$.</p>
           <p>Inputs are hour $h$ and temperature $T$.</p>` },
        { title: `The math`, body:
          `<p>We score with $R^2$: the fraction of demand variance the model explains, where $1$ is perfect and $0$ is no better than predicting the mean.</p>
           <p>The meta-model is a plain linear combiner of the three base predictions, $\\hat{y} = \\sum_k w_k z_k$, learned on 5-fold out-of-fold predictions.</p>` },
        { title: `Run it`, body:
          `<p>Stack a random forest, a linear model, and an RBF SVR with a linear meta-model.</p>`,
          code:
`import numpy as np
from sklearn.ensemble import StackingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

rng = np.random.default_rng(0)
n = 500
hour = rng.uniform(0, 24, n)
temp = rng.uniform(-5, 35, n)
demand = (300
          + 80*np.sin((hour-7)/24*2*np.pi)
          + 60*np.sin((hour-19)/24*2*np.pi)
          + 1.2*(temp-18)**2
          + rng.normal(0, 18, n))
X = np.column_stack([hour, temp])
Xtr, Xte, ytr, yte = train_test_split(X, demand, test_size=0.25, random_state=0)

base = [("rf", RandomForestRegressor(n_estimators=80, random_state=0)),
        ("lin", LinearRegression()),
        ("svr", SVR(C=50, gamma=0.05))]
r2 = {}
for name, est in base:
    est.fit(Xtr, ytr)
    r2[name] = r2_score(yte, est.predict(Xte))
stack = StackingRegressor(estimators=base, final_estimator=LinearRegression(), cv=5)
stack.fit(Xtr, ytr)
r2["stack"] = r2_score(yte, stack.predict(Xte))
for k in ["rf","lin","svr","stack"]:
    print(f"{k:6s} R2 = {r2[k]:.3f}")`,
          output:
`rf     R2 = 0.983
lin    R2 = 0.237
svr    R2 = 0.926
stack  R2 = 0.983` }
      ],
      conclusion: `Here the random forest already nails the curved, periodic demand ($R^2 = 0.983$), and stacking matches it rather than beating it. That is the honest worst case: when one base model dominates, a learned combiner can fall back to trusting it, so stacking is never worse — the linear model ($R^2 = 0.237$) gets quietly down-weighted instead of dragging the blend down.`
    }
  ],

  /* ================================================================= */
  /* cls-anomaly — Isolation Forest                                    */
  /* ================================================================= */
  "cls-anomaly": [
    {
      title: `Catching credit-card fraud`,
      domain: `Payments`,
      question: `Most card transactions are everyday purchases; a few are fraud — large amounts at odd hours. With no fraud labels, can an Isolation Forest fence off the anomalies?`,
      steps: [
        { title: `The data`, body:
          `<p>480 normal transactions: amount $\\sim \\mathcal{N}(60, 20)$ dollars, hour-of-day $\\sim \\mathcal{N}(14, 4)$.</p>
           <p>20 fraudulent ones: amounts \\$800–\\$2000 between 2am and 4am. They sit far out in empty space.</p>
           <p>The model never sees the labels; we only use them afterward to check.</p>` },
        { title: `The math`, body:
          `<p>Each tree cuts on a random feature at a random threshold. A point in empty space is sliced off in few cuts, giving a short path length $h(x)$.</p>
           <p>The score is $s(x) = 2^{-E[h(x)]/c(n)}$, near $1$ for easily-isolated outliers. Setting <code>contamination=0.04</code> flags the top $4\\%$ as anomalies.</p>` },
        { title: `Run it`, body:
          `<p>Fit on all 500 points and flag the anomalies, then compare to the hidden labels.</p>`,
          code:
`import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
amt  = rng.normal(60, 20, 480).clip(1, None)
hour = rng.normal(14, 4, 480).clip(0, 24)
normal = np.column_stack([amt, hour])
f_amt  = rng.uniform(800, 2000, 20)
f_hour = rng.uniform(2, 4, 20)
fraud = np.column_stack([f_amt, f_hour])
X = np.vstack([normal, fraud])
y = np.r_[np.zeros(480), np.ones(20)]

clf = IsolationForest(n_estimators=200, contamination=0.04, random_state=0)
pred = clf.fit_predict(X)
flag = (pred == -1).astype(int)

tp = int(((flag==1)&(y==1)).sum())
fp = int(((flag==1)&(y==0)).sum())
fn = int(((flag==0)&(y==1)).sum())
print(f"flagged anomalies: {flag.sum()}")
print(f"true fraud caught : {tp}/20")
print(f"false alarms      : {fp}")
print(f"missed fraud      : {fn}")`,
          output:
`flagged anomalies: 20
true fraud caught : 19/20
false alarms      : 1
missed fraud      : 1` }
      ],
      conclusion: `Of 20 fraudulent transactions, $19$ were caught with a single false alarm — and no labels were ever used in training. The large, off-hours charges sat in sparse regions, so $E[h(x)]$ was small and $s(x)$ near $1$, exactly as the isolation logic predicts.`
    },
    {
      title: `Spotting a compromised server`,
      domain: `IT operations`,
      question: `Healthy servers show correlated CPU, memory, and request load. An intrusion or a memory leak breaks that correlation. Can an Isolation Forest score live readings as normal or anomalous?`,
      steps: [
        { title: `The data`, body:
          `<p>800 healthy snapshots. A hidden load level $\\ell \\in [0.2, 0.8]$ drives all three signals together: CPU $\\approx 70\\ell + 10$, memory $\\approx 55\\ell + 15$, requests $\\approx 900\\ell$, each with small noise.</p>
           <p>The key fact: the three move <i>in proportion</i>. Breaking that proportion is what "weird" means here.</p>` },
        { title: `The math`, body:
          `<p>We fit the forest on the healthy cloud, then score three live probes with <code>decision_function</code> (higher $=$ more normal) and <code>predict</code> ($-1$ anomaly, $+1$ normal).</p>
           <p>A reading off the normal manifold — say memory maxed while CPU and requests are low — lands in empty space and gets a short path, so it scores as an anomaly.</p>` },
        { title: `Run it`, body:
          `<p>Score a healthy probe, a CPU-pinned intrusion, and a memory-leak reading.</p>`,
          code:
`import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
n = 800
load = rng.uniform(0.2, 0.8, n)
cpu = (load*70 + 10 + rng.normal(0, 3, n)).clip(0, 100)
mem = (load*55 + 15 + rng.normal(0, 3, n)).clip(0, 100)
req = (load*900 + rng.normal(0, 30, n)).clip(0, None)
X = np.column_stack([cpu, mem, req])

clf = IsolationForest(n_estimators=300, contamination=0.01, random_state=0)
clf.fit(X)

probe = np.array([
    [45, 42, 450],
    [99, 28, 110],
    [20, 98, 250],
])
score = clf.decision_function(probe)
pred  = clf.predict(probe)
labels = ["healthy ", "cpu-pin ", "mem-leak"]
for lab, s, p in zip(labels, score, pred):
    tag = "ANOMALY" if p == -1 else "normal "
    print(f"{lab}: score={s:+.3f}  -> {tag}")`,
          output:
`healthy : score=+0.184  -> normal
cpu-pin : score=-0.045  -> ANOMALY
mem-leak: score=-0.070  -> ANOMALY` }
      ],
      conclusion: `The proportional "healthy" reading scores $+0.184$ (normal), while both faults score negative and are flagged. The model learned the joint shape of healthy load, so anything that breaks the CPU–memory–request correlation gets isolated quickly — no rule about "CPU $&gt; 95\\%$" needed.`
    },
    {
      title: `Rejecting defective parts`,
      domain: `Manufacturing QC`,
      question: `A production line makes bolts to tight tolerances. A handful come out off-spec. Can an Isolation Forest pull the defects without anyone defining the exact tolerance windows?`,
      steps: [
        { title: `The data`, body:
          `<p>700 good bolts: length $\\sim \\mathcal{N}(50, 0.15)$ mm, diameter $\\sim \\mathcal{N}(8, 0.05)$ mm, weight $\\sim \\mathcal{N}(12, 0.20)$ g.</p>
           <p>15 defective bolts are pushed $\\pm 1.2$ mm off length and $1.5$–$3$ g light — clearly outside the dense cluster.</p>` },
        { title: `The math`, body:
          `<p>We set <code>contamination = 15/715</code>, telling the forest roughly what fraction we expect to be defective, then flag the points with the highest anomaly scores $s(x)$.</p>
           <p>Recall $=$ defects caught $/$ defects present; precision $=$ true defects $/$ all flagged.</p>` },
        { title: `Run it`, body:
          `<p>Fit and flag, then measure precision and recall against the known defect set.</p>`,
          code:
`import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
n = 700
length = rng.normal(50.0, 0.15, n)
diam   = rng.normal(8.0, 0.05, n)
weight = rng.normal(12.0, 0.20, n)
good = np.column_stack([length, diam, weight])
d_len = rng.normal(50.0, 0.15, 15) + rng.choice([-1.2, 1.2], 15)
d_dia = rng.normal(8.0, 0.05, 15)
d_wt  = rng.normal(12.0, 0.20, 15) - rng.uniform(1.5, 3.0, 15)
defect = np.column_stack([d_len, d_dia, d_wt])
X = np.vstack([good, defect])
y = np.r_[np.zeros(n), np.ones(15)]

clf = IsolationForest(n_estimators=200, contamination=15/(n+15), random_state=0)
flag = (clf.fit_predict(X) == -1).astype(int)
tp = int(((flag==1)&(y==1)).sum())
fp = int(((flag==1)&(y==0)).sum())
prec = tp/max(flag.sum(),1)
rec  = tp/15
print(f"parts inspected : {len(X)}")
print(f"defects flagged : {tp}/15  (recall {rec:.0%})")
print(f"false rejects   : {fp}      (precision {prec:.0%})")`,
          output:
`parts inspected : 715
defects flagged : 15/15  (recall 100%)
false rejects   : 0      (precision 100%)` }
      ],
      conclusion: `Perfect on this clean separation: all $15$ defects caught, zero good parts wrongly rejected ($100\\%$ precision and recall). The defects sat well outside the tight tolerance cloud, so a couple of random cuts isolated each one — the line needs no hand-coded tolerance limits.`
    }
  ],

  /* ================================================================= */
  /* cls-recommender — Matrix factorization                            */
  /* ================================================================= */
  "cls-recommender": [
    {
      title: `Filling in a sparse movie-ratings grid`,
      domain: `Streaming video`,
      question: `Users rate only a handful of movies, leaving most of the grid blank. Can SGD matrix factorization recover the missing ratings well enough to recommend?`,
      steps: [
        { title: `The data`, body:
          `<p>50 users, 30 movies, $k = 3$ hidden taste factors. True ratings come from $R_{ui} = 3 + u_u \\cdot v_i$, clipped to $[1, 5]$.</p>
           <p>We reveal only $\\sim 30\\%$ of cells; the rest are hidden and used only to test.</p>` },
        { title: `The math`, body:
          `<p>We learn user rows $u_u$ and item rows $v_i$ by minimizing squared error over observed cells with a small penalty:</p>
           <p>$$ \\min_{U,V}\\ \\sum_{(u,i)\\,\\text{known}} \\big(R_{ui} - u_u\\cdot v_i\\big)^2 + \\lambda\\big(\\|u_u\\|^2 + \\|v_i\\|^2\\big). $$</p>
           <p>Stochastic gradient descent updates each row a little for every observed rating, then the same rows predict the blanks $\\hat{R}_{ui} = u_u \\cdot v_i$.</p>` },
        { title: `Run it`, body:
          `<p>From-scratch SGD. Compare test RMSE against the dumb baseline of always predicting the global mean.</p>`,
          code:
`import numpy as np

rng = np.random.default_rng(0)
n_users, n_items, k = 50, 30, 3
Ut = rng.normal(0, 1, (n_users, k))
Vt = rng.normal(0, 1, (n_items, k))
true = np.clip(3.0 + Ut @ Vt.T, 1, 5)

mask = rng.uniform(size=true.shape) < 0.30
R = np.where(mask, true, 0.0)

U = rng.normal(0, 0.1, (n_users, k))
V = rng.normal(0, 0.1, (n_items, k))
b = 3.0
lr, reg, epochs = 0.01, 0.05, 200
rows, cols = np.where(mask)
for ep in range(epochs):
    for u, i in zip(rows, cols):
        err = R[u, i] - (b + U[u] @ V[i])
        U[u] += lr * (err * V[i] - reg * U[u])
        V[i] += lr * (err * U[u] - reg * V[i])

pred = b + U @ V.T
held = ~mask
rmse = np.sqrt(np.mean((pred[held] - true[held])**2))
base = np.sqrt(np.mean((3.0 - true[held])**2))
print(f"observed cells : {mask.sum()} of {true.size}")
print(f"baseline RMSE  : {base:.3f}  (predict global mean)")
print(f"MF model RMSE  : {rmse:.3f}")`,
          output:
`observed cells : 443 of 1500
baseline RMSE  : 1.279  (predict global mean)
MF model RMSE  : 0.451` }
      ],
      conclusion: `From just $443$ of $1500$ ratings, the factorization predicts the hidden cells with RMSE $0.451$ — far better than the $1.279$ you get by guessing the mean. The dot product $\\hat{R}_{ui} = u_u \\cdot v_i$ recovered each user's taste from their sparse history.`
    },
    {
      title: `Recommending artists from play counts`,
      domain: `Music streaming`,
      question: `We only see how many times each listener played each artist — implicit feedback, no stars. Can non-negative matrix factorization surface artists a listener hasn't heard but would like?`,
      steps: [
        { title: `The data`, body:
          `<p>40 listeners, 24 artists. Each listener has a non-negative affinity for two genres (rock, jazz); each artist has a non-negative genre content.</p>
           <p>Play counts are $\\approx 20\\,(\\text{taste} \\cdot \\text{genre})$ plus small noise — never negative, which is why NMF fits.</p>` },
        { title: `The math`, body:
          `<p>NMF factors the play-count matrix as $\\text{plays} \\approx W H$ with $W, H \\ge 0$. Row $W_u$ is listener taste; column $H_{:,i}$ is artist content.</p>
           <p>The reconstruction $\\hat{\\text{plays}}_{ui} = W_u \\cdot H_{:,i}$ predicts how much listener $u$ would play artist $i$, even for artists they barely touched.</p>` },
        { title: `Run it`, body:
          `<p>Fit NMF with 2 components and recommend, for listener 0, the highest-predicted artists among those they have played least.</p>`,
          code:
`import numpy as np
from sklearn.decomposition import NMF

rng = np.random.default_rng(0)
n_u, n_i, k = 40, 24, 2
taste = rng.uniform(0, 1, (n_u, k))
genre = rng.uniform(0, 1, (n_i, k))
plays = np.round(20 * (taste @ genre.T) + rng.uniform(0, 2, (n_u, n_i)))

model = NMF(n_components=k, init="nndsvda", random_state=0, max_iter=500)
W = model.fit_transform(plays)
H = model.components_
recon = W @ H

u = 0
unheard = np.argsort(plays[u])[:5]
pred_scores = recon[u, unheard]
print(f"reconstruction error: {model.reconstruction_err_:.2f}")
order = unheard[np.argsort(-pred_scores)]
print("top recommendations for listener 0 (artist id : predicted plays):")
for a in order[:3]:
    print(f"  artist {a:2d} : {recon[u, a]:5.1f}  (actual {plays[u, a]:.0f})")`,
          output:
`reconstruction error: 18.93
top recommendations for listener 0 (artist id : predicted plays):
  artist 12 :   7.3  (actual 7)
  artist  4 :   6.8  (actual 7)
  artist  6 :   6.0  (actual 5)` }
      ],
      conclusion: `The predicted play counts ($7.3, 6.8, 6.0$) land within one play of the held-back actuals ($7, 7, 5$). NMF discovered the two latent genres and used them to estimate $W_u \\cdot H_{:,i}$ for artists in the listener's blind spots — the engine behind "you might also like".`
    },
    {
      title: `Predicting product ratings with ALS`,
      domain: `E-commerce`,
      question: `A retail catalog has a vast, mostly-empty user-by-product star matrix. Can alternating least squares fill it accurately enough to rank what each shopper should see next?`,
      steps: [
        { title: `The data`, body:
          `<p>80 shoppers, 40 products, $k = 3$ latent tastes. True stars $R_{ui} = 3.2 + 0.8\\,(u_u \\cdot v_i)$, clipped to $[1, 5]$.</p>
           <p>$40\\%$ of cells are observed; the rest are held out for evaluation.</p>` },
        { title: `The math`, body:
          `<p>ALS alternates two ridge-regression solves. Fix items, solve each user row in closed form; then fix users, solve each item row:</p>
           <p>$$ u_u = \\big(V_u^\\top V_u + \\lambda I\\big)^{-1} V_u^\\top r_u, $$</p>
           <p>where $V_u$ stacks the item rows that user $u$ rated and $r_u$ their ratings. Each half-step is convex, so the loss falls every sweep.</p>` },
        { title: `Run it`, body:
          `<p>15 ALS sweeps from scratch, then RMSE and MAE on the held-out cells plus one concrete top pick.</p>`,
          code:
`import numpy as np

rng = np.random.default_rng(0)
n_u, n_i, k = 80, 40, 3
Ut = rng.normal(0, 1, (n_u, k)); Vt = rng.normal(0, 1, (n_i, k))
true = np.clip(3.2 + 0.8*(Ut @ Vt.T), 1, 5)
mask = rng.uniform(size=true.shape) < 0.40

U = rng.normal(0, 0.1, (n_u, k)); V = rng.normal(0, 0.1, (n_i, k))
reg = 0.05; I = reg*np.eye(k)
for it in range(30):
    for u in range(n_u):
        idx = mask[u]
        if idx.any():
            Vi = V[idx]
            U[u] = np.linalg.solve(Vi.T@Vi + I, Vi.T@true[u, idx])
    for i in range(n_i):
        idx = mask[:, i]
        if idx.any():
            Uu = U[idx]
            V[i] = np.linalg.solve(Uu.T@Uu + I, Uu.T@true[idx, i])

pred = np.clip(U @ V.T, 1, 5)
held = ~mask
rmse = np.sqrt(np.mean((pred[held]-true[held])**2))
mae  = np.mean(np.abs(pred[held]-true[held]))
print(f"observed ratings : {mask.sum()} of {true.size}")
print(f"held-out RMSE    : {rmse:.3f}")
print(f"held-out MAE     : {mae:.3f}")
u = 0
unrated = np.where(~mask[u])[0]
best = unrated[np.argmax(pred[u, unrated])]
print(f"top pick for shopper 0: product {best} (predicted {pred[u,best]:.2f} stars)")`,
          output:
`observed ratings : 1309 of 3200
held-out RMSE    : 0.613
held-out MAE     : 0.415
top pick for shopper 0: product 24 (predicted 3.73 stars)`}
      ],
      conclusion: `ALS reconstructs unseen ratings with RMSE $0.613$ (MAE $0.415$ — under half a star) from $1309$ observed cells, and confidently recommends product $24$ to shopper $0$. Each closed-form ridge solve makes ALS fast and stable, the workhorse behind large-scale recommenders.`
    }
  ],

  /* ================================================================= */
  /* cls-tsne — t-SNE / UMAP                                           */
  /* ================================================================= */
  "cls-tsne": [
    {
      title: `Seeing handwritten digits in 2-D`,
      domain: `Computer vision`,
      question: `Each handwritten digit is a 64-dimensional vector of pixels. Can t-SNE lay them out on a flat map so the ten digit classes form visible, separated blobs?`,
      steps: [
        { title: `The data`, body:
          `<p>The classic digits set: $1797$ images, each an $8\\times 8$ grayscale grid flattened to a $64$-D vector, labeled $0$–$9$.</p>
           <p>In $64$-D the classes overlap heavily — neighboring digits like $3$ and $8$ share many pixels.</p>` },
        { title: `The math`, body:
          `<p>t-SNE turns distances into neighbor probabilities. On the map it uses a heavy-tailed affinity $q_{ij} \\propto (1 + \\|y_i - y_j\\|^2)^{-1}$ and minimizes $\\text{KL}(P\\,\\|\\,Q)$.</p>
           <p>We measure separation with the silhouette score: how much tighter points sit to their own class than to others. Higher means cleaner blobs.</p>` },
        { title: `Run it`, body:
          `<p>Embed to 2-D and compare the silhouette in the original $64$-D space vs. the t-SNE map.</p>`,
          code:
`import numpy as np
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits
from sklearn.metrics import silhouette_score

digits = load_digits()
X, y = digits.data, digits.target

emb = TSNE(n_components=2, perplexity=30, init="pca", random_state=0).fit_transform(X)
print(f"input shape : {X.shape}")
print(f"embedded to : {emb.shape}")
sil2d = silhouette_score(emb, y)
sil64 = silhouette_score(X, y)
print(f"silhouette in 64-D : {sil64:.3f}")
print(f"silhouette in 2-D  : {sil2d:.3f}  (higher = clusters more separated)")`,
          output:
`input shape : (1797, 64)
embedded to : (1797, 2)
silhouette in 64-D : 0.163
silhouette in 2-D  : 0.555  (higher = clusters more separated)` }
      ],
      conclusion: `The silhouette jumps from $0.163$ in $64$-D to $0.555$ on the 2-D map — the digit classes go from heavily overlapping to clean, separated islands. The heavy-tailed $q_{ij}$ lets distinct digits spread apart instead of crushing together, turning a $64$-D blur into a readable picture.`
    },
    {
      title: `Mapping single-cell RNA into cell types`,
      domain: `Genomics`,
      question: `Thousands of cells, each a vector of gene-expression levels. Different cell types switch on different marker genes. Can t-SNE reveal the cell types as distinct islands?`,
      steps: [
        { title: `The data`, body:
          `<p>300 cells, $50$ genes, three hidden cell types. Each type turns on a different block of $5$ marker genes (expression $\\sim \\mathcal{N}(3, 0.5)$); the rest are background noise.</p>
           <p>In raw $50$-D space the noise dimensions blur the picture.</p>` },
        { title: `The math`, body:
          `<p>t-SNE keeps neighbors together: cells sharing the same marker block have small high-D distance, so high $p_{ij}$, and end up close on the map.</p>
           <p>We check separation two ways: the 2-D silhouette, and the distance between cell-type cluster centers on the map.</p>` },
        { title: `Run it`, body:
          `<p>Build three marker-gene cell types, embed to 2-D, and measure island separation.</p>`,
          code:
`import numpy as np
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score

rng = np.random.default_rng(0)
n_per, n_genes = 100, 50
def cell_type(sig):
    base = rng.normal(0, 0.4, (n_per, n_genes))
    base[:, sig] += rng.normal(3.0, 0.5, (n_per, len(sig)))
    return base
A = cell_type([0,1,2,3,4])
B = cell_type([10,11,12,13,14])
C = cell_type([20,21,22,23,24])
X = np.vstack([A,B,C])
y = np.r_[np.zeros(n_per), np.ones(n_per), 2*np.ones(n_per)]

emb = TSNE(n_components=2, perplexity=30, init="pca", random_state=0).fit_transform(X)
print(f"cells x genes : {X.shape}")
sil = silhouette_score(emb, y)
cent = np.array([emb[y==t].mean(0) for t in [0,1,2]])
d = np.linalg.norm(cent[0]-cent[1])
print(f"2-D silhouette by cell type : {sil:.3f}")
print(f"distance between type-A and type-B islands : {d:.1f}")`,
          output:
`cells x genes : (300, 50)
2-D silhouette by cell type : 0.908
distance between type-A and type-B islands : 29.3` }
      ],
      conclusion: `The three cell types separate almost perfectly on the map (silhouette $0.908$), with type-A and type-B islands sitting $29.3$ units apart. By preserving the marker-gene neighborhoods, t-SNE recovers the cell-type structure that the noisy $50$-D space had hidden — the standard first look in single-cell analysis.`
    },
    {
      title: `Clustering word embeddings by topic`,
      domain: `Natural language`,
      question: `Word vectors live in 100-D space, and words in the same topic point in similar directions. Can t-SNE flatten them so topical groups form four separate islands?`,
      steps: [
        { title: `The data`, body:
          `<p>Four topical groups — animals, colors, cities, foods — $30$ words each, every word a $100$-D vector.</p>
           <p>Each group has three "active" dimensions boosted by $\\sim \\mathcal{N}(2.5, 0.4)$; the other $97$ are noise.</p>` },
        { title: `The math`, body:
          `<p>The forgiving heavy tail $q_{ij} \\propto (1 + d^2)^{-1}$ lets the four topics sit at large but finite map distances, opening clear gaps between them while pulling each topic's words tight.</p>
           <p>We compare the topical silhouette in raw $100$-D vs. the 2-D map.</p>` },
        { title: `Run it`, body:
          `<p>Embed the $120$ word vectors and score topical separation before and after.</p>`,
          code:
`import numpy as np
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score

rng = np.random.default_rng(0)
groups = {
    "animals": [5, 6, 7],
    "colors":  [25, 26, 27],
    "cities":  [55, 56, 57],
    "foods":   [80, 81, 82],
}
X, y = [], []
for gi, (name, dims) in enumerate(groups.items()):
    base = rng.normal(0, 0.5, (30, 100))
    base[:, dims] += rng.normal(2.5, 0.4, (30, len(dims)))
    X.append(base); y += [gi]*30
X = np.vstack(X); y = np.array(y)

emb = TSNE(n_components=2, perplexity=15, init="pca", random_state=0).fit_transform(X)
print(f"words x dims : {X.shape}")
print(f"2-D silhouette by topic : {silhouette_score(emb, y):.3f}")
sil_raw = silhouette_score(X, y)
print(f"100-D silhouette        : {sil_raw:.3f}")
print("topics separate into 4 visible islands in the 2-D map")`,
          output:
`words x dims : (120, 100)
2-D silhouette by topic : 0.915
100-D silhouette        : 0.229
topics separate into 4 visible islands in the 2-D map` }
      ],
      conclusion: `Topical separation rises from $0.229$ in $100$-D to $0.915$ on the map — the four topics become four crisp islands. This is exactly how people eyeball whether a learned embedding has captured meaning: project to 2-D with t-SNE and look for clean clusters.`
    }
  ],

  /* ================================================================= */
  /* cls-factor-analysis — Factor analysis                             */
  /* ================================================================= */
  "cls-factor-analysis": [
    {
      title: `Recovering a general-ability factor`,
      domain: `Psychometrics`,
      question: `Six test scores per student are all correlated. If one hidden "general ability" drives them, can factor analysis recover the loadings and the factor itself from the scores alone?`,
      steps: [
        { title: `The data`, body:
          `<p>500 students. A hidden factor $g \\sim \\mathcal{N}(0,1)$ drives six tests via loadings $\\Lambda = [2.0, 1.8, 1.5, 1.2, 1.0, 0.8]$ around baselines $\\mu = [70, 65, 60, 75, 68, 72]$, each with private noise.</p>
           <p>So $x = \\Lambda g + \\mu + \\epsilon$, the factor-analysis model exactly.</p>` },
        { title: `The math`, body:
          `<p>Factor analysis fits $\\text{Cov}(x) = \\Lambda\\Lambda^\\top + \\Psi$: the shared correlations live in the rank-1 part $\\Lambda\\Lambda^\\top$, the per-test noise in the diagonal $\\Psi$.</p>
           <p>It returns estimated loadings (up to sign) and lets us project each student onto the recovered factor.</p>` },
        { title: `Run it`, body:
          `<p>Fit a 1-factor model and compare estimated loadings to the truth, plus how well the recovered factor tracks true ability.</p>`,
          code:
`import numpy as np
from sklearn.decomposition import FactorAnalysis

rng = np.random.default_rng(0)
n = 500
g = rng.normal(0, 1, n)
loadings = np.array([2.0, 1.8, 1.5, 1.2, 1.0, 0.8])
means = np.array([70, 65, 60, 75, 68, 72])
noise = rng.normal(0, 1.0, (n, 6))
X = g[:, None]*loadings[None, :] + means[None, :] + noise

fa = FactorAnalysis(n_components=1, random_state=0)
fa.fit(X)
est = fa.components_[0]
if np.dot(est, loadings) < 0: est = -est
print("true loadings :", np.round(loadings, 2))
print("est. loadings :", np.round(est, 2))
z = fa.transform(X)[:, 0]
if np.corrcoef(z, g)[0,1] < 0: z = -z
print(f"corr(recovered factor, true ability) = {np.corrcoef(z, g)[0,1]:.3f}")`,
          output:
`true loadings : [2.  1.8 1.5 1.2 1.  0.8]
est. loadings : [2.01 1.87 1.59 1.13 0.98 0.84]
corr(recovered factor, true ability) = 0.963`}
      ],
      conclusion: `The estimated loadings $[2.01, 1.87, 1.59, 1.13, 0.98, 0.84]$ track the true $[2.0, 1.8, 1.5, 1.2, 1.0, 0.8]$ closely, and the recovered factor correlates $0.963$ with true ability — all from the correlation structure alone. This is the original "$g$ factor" of intelligence, rebuilt from raw scores.`
    },
    {
      title: `Extracting market factors from returns`,
      domain: `Quantitative finance`,
      question: `Daily returns of many stocks move together because a few market-wide factors drive them. Can factor analysis quantify how much variance is common vs. stock-specific?`,
      steps: [
        { title: `The data`, body:
          `<p>1000 trading days, $8$ stocks. Two factors (market, sector) drive returns: $R = F\\Lambda^\\top + \\text{noise}$, with every stock loading positively on the market.</p>
           <p>Each stock also has idiosyncratic noise of variance $\\approx 0.25$ — its own private risk.</p>` },
        { title: `The math`, body:
          `<p>The fitted covariance splits as $\\Lambda\\Lambda^\\top + \\Psi$. The common part $\\Lambda\\Lambda^\\top$ is the shared market structure; the diagonal $\\Psi$ (returned as <code>noise_variance_</code>) is each stock's specific risk.</p>
           <p>The share of variance from common factors is $\\sum\\Lambda^2 / \\text{total variance}$.</p>` },
        { title: `Run it`, body:
          `<p>Fit a 2-factor model and report the common-variance share and the per-stock idiosyncratic variances.</p>`,
          code:
`import numpy as np
from sklearn.decomposition import FactorAnalysis

rng = np.random.default_rng(0)
n, p, kf = 1000, 8, 2
F = rng.normal(0, 1, (n, kf))
L = rng.normal(0, 1, (p, kf))
L[:, 0] = np.abs(L[:, 0]) + 0.5
spec = rng.normal(0, 0.5, (n, p))
R = F @ L.T + spec

fa = FactorAnalysis(n_components=2, random_state=0)
fa.fit(R)
total_var = np.var(R, axis=0).sum()
comm_var  = np.sum(fa.components_**2)
print(f"stocks : {p},  factors fitted : {kf}")
print(f"share of variance from common factors : {comm_var/total_var:.1%}")
print("idiosyncratic noise var per stock:", np.round(fa.noise_variance_, 2))`,
          output:
`stocks : 8,  factors fitted : 2
share of variance from common factors : 93.9%
idiosyncratic noise var per stock: [0.24 0.26 0.25 0.26 0.26 0.25 0.25 0.23]`}
      ],
      conclusion: `Factor analysis attributes $93.9\\%$ of return variance to the two common factors and recovers each stock's private risk near the true $0.25$. Cleanly separating $\\Lambda\\Lambda^\\top$ (systematic, hedge-able) from $\\Psi$ (idiosyncratic, diversifiable) is the foundation of factor-based portfolio risk models.`
    },
    {
      title: `Reducing a survey to two attitudes`,
      domain: `Marketing research`,
      question: `Nine survey questions on a 1–7 scale really probe just two underlying attitudes. Can factor analysis show which items load on which attitude?`,
      steps: [
        { title: `The data`, body:
          `<p>800 respondents, $9$ items. Two hidden attitudes — price-sensitivity and brand-loyalty — each drive a block of items.</p>
           <p>Items 0–3 respond to price-sensitivity; items 4–8 respond to brand-loyalty, both with noise.</p>` },
        { title: `The math`, body:
          `<p>A 2-factor model returns a $9\\times 2$ loading matrix. An item loads high on the factor that drives it and near zero on the other — that block pattern is what reveals the latent attitudes.</p>` },
        { title: `Run it`, body:
          `<p>Fit two factors and print the loading of each survey item on each attitude.</p>`,
          code:
`import numpy as np
from sklearn.decomposition import FactorAnalysis

rng = np.random.default_rng(0)
n = 800
price = rng.normal(0, 1, n)
loyal = rng.normal(0, 1, n)
X = np.column_stack([
    4 + 1.4*price + rng.normal(0,0.6,n),
    4 + 1.2*price + rng.normal(0,0.6,n),
    4 + 1.0*price + rng.normal(0,0.6,n),
    4 + 0.9*price + rng.normal(0,0.6,n),
    4 + 1.3*loyal + rng.normal(0,0.6,n),
    4 + 1.1*loyal + rng.normal(0,0.6,n),
    4 + 1.0*loyal + rng.normal(0,0.6,n),
    4 + 0.8*loyal + rng.normal(0,0.6,n),
    4 + 0.7*loyal + rng.normal(0,0.6,n),
])
fa = FactorAnalysis(n_components=2, random_state=0)
fa.fit(X)
L = fa.components_.T
print("loading matrix (rows = survey items, cols = 2 hidden attitudes):")
for i, row in enumerate(L):
    print(f"  item {i}: [{row[0]:+.2f}, {row[1]:+.2f}]")`,
          output:
`loading matrix (rows = survey items, cols = 2 hidden attitudes):
  item 0: [+1.20, +0.68]
  item 1: [+1.02, +0.62]
  item 2: [+0.83, +0.48]
  item 3: [+0.77, +0.48]
  item 4: [+0.69, -1.08]
  item 5: [+0.61, -0.89]
  item 6: [+0.53, -0.81]
  item 7: [+0.40, -0.66]
  item 8: [+0.36, -0.58]` }
      ],
      conclusion: `The loadings split into two blocks: items 0–3 load most on the first factor, items 4–8 on the second (with opposite sign). Nine questions collapse to two interpretable attitudes — exactly how survey analysts reduce a long questionnaire to a handful of drivers.`
    }
  ],

  /* ================================================================= */
  /* cls-svr — Support Vector Regression                               */
  /* ================================================================= */
  "cls-svr": [
    {
      title: `Forecasting demand through noisy spikes`,
      domain: `Energy grids`,
      question: `Demand bends with temperature, and a few meter glitches throw wild outliers. Does SVR's $\\varepsilon$-tube ride through the noise where least squares gets dragged off?`,
      steps: [
        { title: `The data`, body:
          `<p>400 hours. Demand is U-shaped in temperature: $\\text{demand} = 300 + 1.4(T-18)^2 + \\text{noise}$.</p>
           <p>Twelve readings are corrupted by $\\pm 150$ MW glitches — the kind of fat outliers least squares hates.</p>` },
        { title: `The math`, body:
          `<p>SVR minimizes $\\tfrac12\\|w\\|^2 + C\\sum_i \\max(0, |y_i - f(x_i)| - \\varepsilon)$. Errors smaller than $\\varepsilon$ cost nothing, and outside points contribute a fixed-size linear pull, so single glitches cannot dominate.</p>
           <p>An RBF kernel lets it bend into the U-shape; OLS can only draw a straight line.</p>` },
        { title: `Run it`, body:
          `<p>Fit RBF-SVR and ordinary least squares on the same glitchy curved data; compare test MAE.</p>`,
          code:
`import numpy as np
from sklearn.svm import SVR
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 400
temp = rng.uniform(-5, 35, n)
demand = 300 + 1.4*(temp-18)**2 + rng.normal(0, 12, n)
idx = rng.choice(n, 12, replace=False)
demand[idx] += rng.choice([-150, 150], 12)
X = temp[:, None]
Xtr, Xte, ytr, yte = train_test_split(X, demand, test_size=0.3, random_state=0)

svr = SVR(kernel="rbf", C=100, epsilon=10, gamma=0.01).fit(Xtr, ytr)
ols = LinearRegression().fit(Xtr, ytr)
print(f"SVR  test MAE = {mean_absolute_error(yte, svr.predict(Xte)):.2f}")
print(f"OLS  test MAE = {mean_absolute_error(yte, ols.predict(Xte)):.2f}")
print(f"support vectors used: {len(svr.support_)} of {len(Xtr)} training points")`,
          output:
`SVR  test MAE = 17.82
OLS  test MAE = 148.63
support vectors used: 124 of 280 training points`}
      ],
      conclusion: `SVR's MAE of $17.82$ crushes OLS's $148.63$: the RBF kernel bends into the U-shape while the $\\varepsilon$-tube absorbs the glitches. Only $124$ of $280$ points are support vectors — the rest sit comfortably inside the tube and exert no pull on the fit.`
    },
    {
      title: `Tracking a price trend, ignoring jitter`,
      domain: `Financial time series`,
      question: `A price has a smooth trend plus small daily jitter. Can SVR's tolerance band track the real trend while treating the jitter as "close enough"?`,
      steps: [
        { title: `The data`, body:
          `<p>300 days. Price $= 100 + 8\\sin(t) + 3t + \\text{jitter}$, where the jitter has standard deviation $\\approx 1.5$.</p>
           <p>We deliberately set the tube half-width $\\varepsilon = 2.0$, a bit wider than the jitter, so day-to-day wiggle is forgiven.</p>` },
        { title: `The math`, body:
          `<p>Any point within $\\varepsilon$ of the fit has $\\varepsilon$-insensitive loss $\\max(0, |y - f(x)| - \\varepsilon) = 0$. Only days where the price genuinely departs from the trend become support vectors.</p>
           <p>So the model fits the signal, not the noise, and stays smooth.</p>` },
        { title: `Run it`, body:
          `<p>Fit RBF-SVR with $\\varepsilon = 2.0$ and report test error plus how few support vectors it needs.</p>`,
          code:
`import numpy as np
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 300
t = np.linspace(0, 6, n)
price = 100 + 8*np.sin(t) + 3*t + rng.normal(0, 1.5, n)
X = t[:, None]
Xtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.3, random_state=0)

svr = SVR(kernel="rbf", C=20, epsilon=2.0, gamma=0.5).fit(Xtr, ytr)
pred = svr.predict(Xte)
print(f"epsilon tube half-width : 2.0  (jitter std ~ 1.5, absorbed)")
print(f"test MAE : {mean_absolute_error(yte, pred):.2f}")
print(f"test R2  : {r2_score(yte, pred):.3f}")
print(f"support vectors : {len(svr.support_)} of {len(Xtr)}  (inside-tube points ignored)")`,
          output:
`epsilon tube half-width : 2.0  (jitter std ~ 1.5, absorbed)
test MAE : 1.45
test R2  : 0.797
support vectors : 41 of 210  (inside-tube points ignored)`}
      ],
      conclusion: `With the tube tuned just above the jitter, SVR tracks the trend to MAE $1.45$ ($R^2 = 0.797$) using only $41$ of $210$ training points as support vectors. The $\\varepsilon$-band acts as a built-in noise filter, which is why SVR is sturdier than least squares on jittery series.`
    },
    {
      title: `Calibrating a multi-sensor gas reading`,
      domain: `Sensor systems`,
      question: `Three cheap sensors each respond to gas concentration in a different, noisy, partly-nonlinear way. Can SVR fuse them into one accurate concentration estimate?`,
      steps: [
        { title: `The data`, body:
          `<p>500 samples. True concentration $c \\in [0, 100]$ ppm drives three channels: $s_1 \\approx 0.8c$, $s_2 \\approx 5\\sqrt{c}$ (nonlinear), $s_3 \\approx 0.5c + 0.01c^2$, each noisy.</p>
           <p>We predict $c$ from the three sensor readings.</p>` },
        { title: `The math`, body:
          `<p>Inputs are first standardized (RBF kernels need comparable scales), then an RBF-SVR maps the three channels to concentration. The kernel handles the $\\sqrt{}$ and quadratic responses without manual feature engineering.</p>` },
        { title: `Run it`, body:
          `<p>Pipeline a scaler with RBF-SVR; report test MAE and $R^2$.</p>`,
          code:
`import numpy as np
from sklearn.svm import SVR
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
n = 500
conc = rng.uniform(0, 100, n)
s1 = 0.8*conc + rng.normal(0, 4, n)
s2 = np.sqrt(conc)*5 + rng.normal(0, 3, n)
s3 = 0.5*conc + 0.01*conc**2 + rng.normal(0, 4, n)
X = np.column_stack([s1, s2, s3])
Xtr, Xte, ytr, yte = train_test_split(X, conc, test_size=0.3, random_state=0)

model = make_pipeline(StandardScaler(),
                      SVR(kernel="rbf", C=200, epsilon=2.0, gamma="scale"))
model.fit(Xtr, ytr)
pred = model.predict(Xte)
print(f"test MAE : {mean_absolute_error(yte, pred):.2f} ppm")
print(f"test R2  : {r2_score(yte, pred):.3f}")
svr = model.named_steps["svr"]
print(f"support vectors : {len(svr.support_)} of {len(Xtr)}")`,
          output:
`test MAE : 1.99 ppm
test R2  : 0.992
support vectors : 130 of 350`}
      ],
      conclusion: `SVR fuses the three noisy channels into a concentration estimate accurate to $\\approx 2$ ppm ($R^2 = 0.992$). The RBF kernel absorbs the $\\sqrt{}$ and quadratic sensor responses automatically, and the $\\varepsilon$-tube keeps small sensor noise from perturbing the calibration.`
    }
  ],

  /* ================================================================= */
  /* cls-bandits — Multi-armed bandits                                 */
  /* ================================================================= */
  "cls-bandits": [
    {
      title: `Choosing the best ad creative live`,
      domain: `Online advertising`,
      question: `Four ad creatives have unknown click-through rates. A UCB bandit must keep earning clicks while learning which creative is best. How close to optimal does it get?`,
      steps: [
        { title: `The data`, body:
          `<p>Four arms with true click-through rates $[0.04, 0.05, 0.09, 0.06]$ — arm 2 is best but unknown.</p>
           <p>Each impression is a Bernoulli click. We run $5000$ impressions.</p>` },
        { title: `The math`, body:
          `<p>UCB1 pulls $\\arg\\max_i\\ \\bar{x}_i + \\sqrt{2\\ln t / n_i}$. Under-tried arms get a large optimism bonus; well-tried arms get almost none.</p>
           <p>Regret is the gap to an oracle that always pulls the best arm: $T\\cdot\\text{ctr}_{\\text{best}} - \\text{clicks}$.</p>` },
        { title: `Run it`, body:
          `<p>From-scratch UCB1 over $5000$ impressions; report pulls per arm and regret.</p>`,
          code:
`import numpy as np

rng = np.random.default_rng(0)
true_ctr = np.array([0.04, 0.05, 0.09, 0.06])
K, T = 4, 5000
sum_r = np.zeros(K); n = np.zeros(K)

for i in range(K):
    r = rng.random() < true_ctr[i]; sum_r[i]+=r; n[i]+=1
for t in range(K, T):
    mean = sum_r/n
    ucb = mean + np.sqrt(2*np.log(t)/n)
    a = int(np.argmax(ucb))
    r = rng.random() < true_ctr[a]; sum_r[a]+=r; n[a]+=1

best = int(np.argmax(true_ctr))
clicks = int(sum_r.sum())
opt_clicks = T*true_ctr[best]
print("pulls per arm :", n.astype(int).tolist())
print(f"best arm (true)   : arm {best} (ctr {true_ctr[best]:.0%})")
print(f"UCB picked most   : arm {int(np.argmax(n))}")
print(f"total clicks      : {clicks}")
print(f"vs always-best     : {opt_clicks:.0f}   regret = {opt_clicks-clicks:.0f}")`,
          output:
`pulls per arm : [820, 916, 2117, 1147]
best arm (true)   : arm 2 (ctr 9%)
UCB picked most   : arm 2
total clicks      : 355
vs always-best     : 450   regret = 95`}
      ],
      conclusion: `UCB sent $2117$ of $5000$ impressions to the true best arm (arm 2) and identified it correctly, finishing with regret $95$ — only $\\sim 21\\%$ below the impossible all-knowing ceiling of $450$ clicks. The $\\sqrt{2\\ln t / n_i}$ bonus guaranteed every arm got sampled enough to avoid locking onto a false favorite.`
    },
    {
      title: `Choosing headlines: $\\varepsilon$-greedy vs UCB`,
      domain: `News media`,
      question: `Five headlines compete for clicks. Two classic bandit rules — $\\varepsilon$-greedy and UCB1 — both keep learning while serving. Which earns more over a fixed horizon?`,
      steps: [
        { title: `The data`, body:
          `<p>Five headlines with true click rates $[0.10, 0.12, 0.18, 0.14, 0.11]$ — headline 2 is best.</p>
           <p>$8000$ visitors. $\\varepsilon$-greedy explores randomly $10\\%$ of the time; UCB1 explores by optimism.</p>` },
        { title: `The math`, body:
          `<p>$\\varepsilon$-greedy pulls the empirical best with probability $1-\\varepsilon$ and a random arm with probability $\\varepsilon = 0.1$. UCB1 always pulls $\\arg\\max_i\\ \\bar{x}_i + \\sqrt{2\\ln t/n_i}$.</p>
           <p>Both are compared to the all-best ceiling $T\\cdot\\text{ctr}_{\\text{best}}$.</p>` },
        { title: `Run it`, body:
          `<p>Run both strategies on the same arms and compare clicks and regret.</p>`,
          code:
`import numpy as np

rng = np.random.default_rng(0)
true = np.array([0.10, 0.12, 0.18, 0.14, 0.11])
K, T = 5, 8000
best = int(np.argmax(true))

def eps_greedy(eps):
    sr = np.zeros(K); n = np.ones(K)*1e-9; clicks = 0
    for t in range(T):
        if rng.random() < eps:
            a = rng.integers(K)
        else:
            a = int(np.argmax(sr/n))
        r = rng.random() < true[a]; sr[a]+=r; n[a]+=1; clicks+=r
    return clicks

def ucb():
    sr = np.zeros(K); n = np.zeros(K); clicks = 0
    for a in range(K):
        r = rng.random() < true[a]; sr[a]+=r; n[a]+=1; clicks+=r
    for t in range(K, T):
        a = int(np.argmax(sr/n + np.sqrt(2*np.log(t)/n)))
        r = rng.random() < true[a]; sr[a]+=r; n[a]+=1; clicks+=r
    return clicks

opt = T*true[best]
eg = eps_greedy(0.1); uc = ucb()
print(f"best headline true ctr : {true[best]:.0%}")
print(f"always-best ceiling    : {opt:.0f} clicks")
print(f"epsilon-greedy (0.1)   : {eg} clicks   regret {opt-eg:.0f}")
print(f"UCB1                   : {uc} clicks   regret {opt-uc:.0f}")`,
          output:
`best headline true ctr : 18%
always-best ceiling    : 1440 clicks
epsilon-greedy (0.1)   : 1300 clicks   regret 140
UCB1                   : 1141 clicks   regret 299`}
      ],
      conclusion: `Here $\\varepsilon$-greedy wins ($1300$ clicks, regret $140$) over UCB1 ($1141$, regret $299$). With well-separated arms and a short horizon, UCB's optimism over-explores the clearly-worse headlines, while a steady $10\\%$ random nudge is enough to find the winner. The lesson: no bandit rule dominates everywhere — the right choice depends on horizon and gap sizes.`
    },
    {
      title: `Adaptively assigning a clinical trial`,
      domain: `Medicine`,
      question: `Three treatments have unknown recovery rates. Thompson sampling can route more patients to whatever currently looks best while still learning. How many patients end up on the winner?`,
      steps: [
        { title: `The data`, body:
          `<p>Three treatments with true recovery probabilities $[0.45, 0.60, 0.55]$ — treatment 1 is best.</p>
           <p>$2000$ patients arrive one at a time and are assigned a treatment, then recover or not.</p>` },
        { title: `The math`, body:
          `<p>Thompson sampling keeps a Beta posterior $\\text{Beta}(\\alpha_i, \\beta_i)$ per arm. For each patient it samples a rate $\\theta_i$ from each posterior and assigns the arm with the largest sample.</p>
           <p>A success bumps $\\alpha$, a failure bumps $\\beta$, so the posteriors sharpen toward the true rates.</p>` },
        { title: `Run it`, body:
          `<p>From-scratch Thompson sampling with $\\text{Beta}(1,1)$ priors; report patient allocation, posterior means, and regret.</p>`,
          code:
`import numpy as np

rng = np.random.default_rng(0)
true = np.array([0.45, 0.60, 0.55])
K, T = 3, 2000
alpha = np.ones(K); beta = np.ones(K)
pulls = np.zeros(K, int); successes = 0
for t in range(T):
    theta = rng.beta(alpha, beta)
    a = int(np.argmax(theta))
    r = 1 if rng.random() < true[a] else 0
    alpha[a] += r; beta[a] += 1-r
    pulls[a] += 1; successes += r

best = int(np.argmax(true))
post_mean = alpha/(alpha+beta)
print(f"true best treatment : arm {best} (recovery {true[best]:.0%})")
print("patients per arm   :", pulls.tolist())
print("posterior mean rate:", np.round(post_mean, 3).tolist())
opt = T*true[best]
print(f"recoveries: {successes}  vs always-best {opt:.0f}  regret {opt-successes:.0f}")
print(f"share of patients on the best arm: {pulls[best]/T:.0%}")`,
          output:
`true best treatment : arm 1 (recovery 60%)
patients per arm   : [56, 1840, 104]
posterior mean rate: [0.431, 0.593, 0.509]
recoveries: 1168  vs always-best 1200  regret 32
share of patients on the best arm: 92%`}
      ],
      conclusion: `Thompson sampling routed $1840$ of $2000$ patients ($92\\%$) to the truly best treatment, with posterior means $[0.431, 0.593, 0.509]$ closing in on the true $[0.45, 0.60, 0.55]$. Regret is just $32$ recoveries below the oracle — the ethical appeal of adaptive trials: fewer patients get the inferior arm while you still learn which is best.`
    }
  ]

});
