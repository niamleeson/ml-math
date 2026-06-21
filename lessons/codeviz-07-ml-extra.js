/* =====================================================================
   CODEVIZ for MODULE 7 — Machine Learning — more.
   One window.CODEVIZ entry per lesson in 07-ml-extra.js.
   Every chart plots a REAL result computed on a REAL bundled sklearn
   dataset (load_breast_cancer, load_diabetes, load_wine).
   Numbers come from running numpy / scikit-learn on those datasets.
   Chart types: line | scatter | bars.
   Colors: blue #4ea1ff, green #7ee787, amber #ffb454, red #ff7b72, purple #c89bff.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "mlx-newton": {
    question: "Can curvature steps land on the minimum of a real loss?",
    charts: [
      {
        type: "line",
        title: "Newton iterates slide down the breast-cancer logistic loss",
        xlabel: "slope weight w (on mean tumor radius)",
        ylabel: "average logistic loss (NLL)",
        series: [
          {
            name: "logistic loss NLL(w)",
            color: "#4ea1ff",
            points: [
              [-1, 1.11362], [-0.75, 0.98408], [-0.5, 0.86419], [-0.25, 0.75567],
              [0, 0.66032], [0.25, 0.57946], [0.5, 0.51316], [0.75, 0.46007],
              [1, 0.41815], [1.25, 0.38533], [1.5, 0.3598], [1.75, 0.34005],
              [2, 0.32491], [2.25, 0.31345], [2.5, 0.30493], [2.75, 0.2988],
              [3, 0.29463], [3.25, 0.29207], [3.5, 0.29085], [3.75, 0.29077],
              [4, 0.29164], [4.25, 0.29333], [4.5, 0.29573], [4.75, 0.29874],
              [5, 0.30229], [5.25, 0.3063], [5.5, 0.31074], [5.75, 0.31554], [6, 0.32067]
            ]
          },
          {
            name: "Newton iterates (start 0 -> min 3.64)",
            color: "#c89bff",
            points: [
              [0, 0.66032], [1.5099, 0.35891], [2.4808, 0.30549],
              [3.2485, 0.29208], [3.5947, 0.2907], [3.6443, 0.29068]
            ]
          }
        ]
      }
    ],
    caption: "Real loss: logistic NLL for predicting malignant from mean tumor radius across 569 breast-cancer patients. Each Newton step uses the loss curvature to leap toward the bottom, reaching w=3.64 in about five steps.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer

# REAL data: 569 breast-cancer patients, feature 0 = mean tumor radius.
bc = load_breast_cancer()
x = bc.data[:, 0]
x = (x - x.mean()) / x.std()          # standardize the radius
y = (bc.target == 0).astype(float)    # 1 = malignant, 0 = benign

b = np.log(y.mean() / (1 - y.mean())) # fixed base log-odds intercept

def nll(w):                           # average logistic loss for slope w
    z = b + w*x
    return np.mean(np.log1p(np.exp(-(2*y - 1)*z)))
def grad(w):
    p = 1/(1 + np.exp(-(b + w*x)))
    return np.mean((p - y)*x)
def hess(w):                          # curvature of the loss
    p = 1/(1 + np.exp(-(b + w*x)))
    return np.mean(p*(1 - p)*x*x)

w = 0.0
iters = [w]
for _ in range(6):
    w = w - grad(w)/hess(w)           # Newton step: slope / curvature
    iters.append(w)
    if np.isclose(grad(w), 0.0):     # gradient essentially zero, stop
        break

grid = np.linspace(-1, 6, 29)
plt.plot(grid, [nll(v) for v in grid], color='#4ea1ff', label='logistic loss NLL(w)')
plt.plot(iters, [nll(v) for v in iters], 'o-', color='#c89bff',
         label='Newton iterates (start 0 to min 3.64)')
plt.xlabel('slope weight w (on mean tumor radius)')
plt.ylabel('average logistic loss (NLL)')
plt.title('Newton iterates slide down the breast-cancer logistic loss')
plt.legend(); plt.show()
`
  },

  "mlx-lwr": {
    question: "Can we fit a real noisy relationship without one global line?",
    charts: [
      {
        type: "scatter",
        title: "Diabetes: BMI vs disease progression with a locally-weighted fit",
        xlabel: "body mass index (standardized)",
        ylabel: "disease progression after one year",
        groups: [
          {
            name: "442 real patients (60 shown)",
            color: "#4ea1ff",
            points: [
              [-0.0838, 101], [-0.0655, 96], [-0.0612, 89], [-0.059, 86], [-0.0579, 252],
              [-0.0526, 181], [-0.0515, 75], [-0.0472, 138], [-0.0461, 74], [-0.045, 93],
              [-0.0418, 103], [-0.0375, 129], [-0.0332, 84], [-0.0288, 179], [-0.0245, 110],
              [-0.0235, 64], [-0.0224, 156], [-0.0224, 49], [-0.0191, 214], [-0.0181, 171],
              [-0.0159, 151], [-0.0116, 200], [-0.0105, 168], [-0.0105, 179], [-0.0094, 257],
              [-0.0084, 131], [-0.0073, 95], [-0.0062, 219], [-0.0051, 230], [-0.0041, 61],
              [-0.0041, 198], [-0.003, 217], [0.0013, 49], [0.0046, 191], [0.0089, 127],
              [0.011, 276], [0.0121, 235], [0.0175, 128], [0.0186, 113], [0.0207, 281],
              [0.0229, 232], [0.0251, 182], [0.0261, 196], [0.0283, 170], [0.0304, 244],
              [0.0304, 122], [0.0337, 270], [0.0337, 198], [0.0401, 155], [0.0434, 195],
              [0.0455, 175], [0.0466, 99], [0.0466, 174], [0.0542, 142], [0.0552, 68],
              [0.0585, 136], [0.0606, 215], [0.0886, 264], [0.0973, 275], [0.1048, 321]
            ]
          }
        ],
        lines: [
          {
            name: "LWR fit (refit a weighted line at every BMI)",
            color: "#ffb454",
            points: [
              [-0.0903, 75.9], [-0.085, 79.04], [-0.0796, 82.35], [-0.0743, 85.83],
              [-0.069, 89.5], [-0.0637, 93.36], [-0.0583, 97.41], [-0.053, 101.67],
              [-0.0477, 106.13], [-0.0424, 110.78], [-0.037, 115.61], [-0.0317, 120.62],
              [-0.0264, 125.77], [-0.0211, 131.04], [-0.0158, 136.4], [-0.0104, 141.8],
              [-0.0051, 147.21], [0.0002, 152.6], [0.0055, 157.94], [0.0109, 163.19],
              [0.0162, 168.35], [0.0215, 173.4], [0.0268, 178.35], [0.0322, 183.2],
              [0.0375, 187.98], [0.0428, 192.7], [0.0481, 197.4], [0.0534, 202.13],
              [0.0588, 206.91], [0.0641, 211.81], [0.0694, 216.85], [0.0747, 222.09],
              [0.0801, 227.54], [0.0854, 233.22], [0.0907, 239.11], [0.096, 245.17],
              [0.1014, 251.35], [0.1067, 257.58], [0.112, 263.74], [0.1173, 269.75],
              [0.1226, 275.5], [0.128, 280.89], [0.1333, 285.86], [0.1386, 290.32],
              [0.1439, 294.25], [0.1493, 297.62], [0.1546, 300.4], [0.1599, 302.62],
              [0.1652, 304.28], [0.1706, 305.39]
            ]
          }
        ]
      }
    ],
    caption: "Real noisy relationship: higher BMI tracks worse diabetes progression across 442 real patients. No single global formula, at each BMI we refit a Gaussian-weighted line (tau=0.04); stitched together they trace the rising trend through scattered data.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes

# REAL data: 442 diabetes patients, feature 2 = standardized BMI.
db = load_diabetes()
bmi = db.data[:, 2]
prog = db.target                         # disease progression after one year
X = np.c_[np.ones_like(bmi), bmi]        # design matrix with intercept

def lwr_predict(xq, tau=0.04):
    w = np.exp(-((bmi - xq)**2) / (2*tau**2))    # Gaussian weights near xq
    W = np.diag(w)
    A = X.T @ W @ X + 1e-6*np.eye(2)
    theta = np.linalg.solve(A, X.T @ W @ prog)   # weighted normal equations
    return float(theta @ np.array([1.0, xq]))

# show 60 patients to keep the scatter readable
rng = np.random.RandomState(0)
idx = np.sort(rng.choice(len(bmi), 60, replace=False))
grid = np.linspace(bmi.min(), bmi.max(), 50)
fit = [lwr_predict(q) for q in grid]

plt.scatter(bmi[idx], prog[idx], color='#4ea1ff', label='442 real patients (60 shown)')
plt.plot(grid, fit, color='#ffb454', label='LWR fit (refit a weighted line at every BMI)')
plt.xlabel('body mass index (standardized)')
plt.ylabel('disease progression after one year')
plt.title('Diabetes: BMI vs disease progression with a locally-weighted fit')
plt.legend(); plt.show()
`
  },

  "mlx-cross-validation": {
    question: "How good is the model when every slice gets a turn as the test set?",
    charts: [
      {
        type: "bars",
        title: "Breast-cancer logistic regression: per-fold accuracy and mean",
        labels: ["fold 1", "fold 2", "fold 3", "fold 4", "fold 5", "MEAN"],
        values: [0.9561, 0.9737, 0.9825, 1.0, 0.9823, 0.9789],
        valueLabels: ["95.6%", "97.4%", "98.2%", "100%", "98.2%", "97.9%"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Real task: predict malignant vs benign on the 569-patient breast-cancer dataset. 5-fold accuracy ranges from 95.6% to a lucky 100%; averaging the five honest tests gives the trusted CV accuracy of 97.9%.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

# REAL data: 569 breast-cancer patients, 30 features, malignant vs benign.
bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
scores = cross_val_score(LogisticRegression(max_iter=5000), X, bc.target,
                         cv=skf, scoring='accuracy')

labels = ['fold 1', 'fold 2', 'fold 3', 'fold 4', 'fold 5', 'MEAN']
vals   = list(scores) + [scores.mean()]
colors = ['#4ea1ff']*5 + ['#7ee787']
plt.bar(labels, vals, color=colors)
plt.ylabel('accuracy')
plt.title('Breast-cancer logistic regression: per-fold accuracy and mean')
plt.show()
`
  },

  "mlx-model-selection": {
    question: "Which model complexity is best on real data?",
    charts: [
      {
        type: "line",
        title: "Breast cancer: CV accuracy vs k-NN complexity (peak = best)",
        xlabel: "neighbors k (small k = more complex model)",
        ylabel: "5-fold cross-validated accuracy",
        series: [
          {
            name: "CV accuracy",
            color: "#4ea1ff",
            points: [
              [1, 0.9508], [3, 0.9578], [5, 0.9649], [7, 0.9684],
              [9, 0.9684], [15, 0.9614], [25, 0.9543], [45, 0.9526]
            ]
          }
        ]
      }
    ],
    caption: "Real model-selection sweep on the 569-patient breast-cancer dataset. Too complex (k=1, overfits each point) and too simple (k=45, washes out detail) both score worse; CV accuracy peaks at k=7 (96.8%), the best bias-variance trade-off.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score

# REAL data: 569 breast-cancer patients, 30 features.
bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)

ks, cvs = [], []
for k in [1, 3, 5, 7, 9, 15, 25, 45]:
    score = cross_val_score(KNeighborsClassifier(n_neighbors=k),
                            X, bc.target, cv=5).mean()
    ks.append(k); cvs.append(score)      # small k = more complex model

plt.plot(ks, cvs, 'o-', color='#4ea1ff', label='CV accuracy')
plt.xlabel('neighbors k (small k = more complex model)')
plt.ylabel('5-fold cross-validated accuracy')
plt.title('Breast cancer: CV accuracy vs k-NN complexity (peak = best)')
plt.legend(); plt.show()
`
  },

  "mlx-clustering-metrics": {
    question: "How many clusters does real data really have?",
    charts: [
      {
        type: "line",
        title: "Wine: average silhouette vs k (peak = true number of cultivars)",
        xlabel: "number of clusters k",
        ylabel: "average silhouette score",
        series: [
          {
            name: "avg silhouette",
            color: "#7ee787",
            points: [[2, 0.2683], [3, 0.2849], [4, 0.2457], [5, 0.2026], [6, 0.196]]
          }
        ]
      }
    ],
    caption: "Real task: cluster 178 Italian wines by 13 chemical measurements with the cultivar labels hidden. The silhouette peaks at k=3 (0.285), correctly recovering the three real grape cultivars in the data.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# REAL data: 178 wines, 13 chemical features, 3 true cultivars (labels hidden).
wn = load_wine()
X = StandardScaler().fit_transform(wn.data)

ks, sils = [], []
for k in range(2, 7):
    labels = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(X)
    ks.append(k)
    sils.append(silhouette_score(X, labels))     # mean silhouette over wines

plt.plot(ks, sils, 'o-', color='#7ee787', label='avg silhouette')
plt.xlabel('number of clusters k'); plt.ylabel('average silhouette score')
plt.title('Wine: average silhouette vs k (peak = true number of cultivars)')
plt.legend(); plt.show()
`
  },

  "mlx-error-analysis": {
    question: "Which block of chemical features actually earns its keep?",
    charts: [
      {
        type: "bars",
        title: "Wine: accuracy lost when each chemical feature block is removed",
        labels: ["alcohol/acid", "ash/Mg", "phenols", "color/hue", "proline"],
        values: [0.0503, 0.017, 0.0056, 0.0449, 0.0449],
        valueLabels: ["+5.03%", "+1.70%", "+0.56%", "+4.49%", "+4.49%"],
        colors: ["#ffb454", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
      }
    ],
    caption: "Real ablation on the 178-wine dataset (full-feature accuracy 98.9%). Dropping the alcohol/acid block costs the most accuracy (5.0%), so it carries the strongest cultivar signal; the phenols block barely matters (0.6%).",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

# REAL data: 178 wines, 13 chemical features, 3 cultivars.
wn = load_wine()
X = StandardScaler().fit_transform(wn.data)
y = wn.target
acc = lambda cols: cross_val_score(
    LogisticRegression(max_iter=5000), X[:, cols], y, cv=5).mean()

full = acc(list(range(13)))              # baseline: all 13 features
blocks = {'alcohol/acid': [0, 1, 2], 'ash/Mg': [3, 4, 5],
          'phenols': [6, 7, 8], 'color/hue': [9, 10, 11], 'proline': [12]}
names, drops = [], []
for name, cols in blocks.items():
    keep = [c for c in range(13) if c not in cols]
    names.append(name)
    drops.append(full - acc(keep))       # accuracy lost without that block

colors = ['#ffb454' if d == max(drops) else '#4ea1ff' for d in drops]
plt.bar(names, [d*100 for d in drops], color=colors)
plt.ylabel('accuracy lost (%)')
plt.title('Wine: accuracy lost when each chemical feature block is removed')
plt.show()
`
  }

});
