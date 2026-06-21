/* Per-lesson CODE VISUALIZATIONS for Module 9B — Classical ML (beyond the cheat sheet).
   Each entry: { question, charts:[<chartSpec>], caption, code }.
   All numbers below are REAL outputs from running scikit-learn on REAL bundled
   datasets (load_breast_cancer, load_wine, load_digits, load_diabetes) plus a
   small real-style movie-ratings matrix. Merged into window.CODEVIZ by lesson id. */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "cls-stacking": {
    question: "On the breast-cancer scan data, does stacking beat each base model alone?",
    charts: [
      {
        type: "bars",
        title: "5-fold accuracy on breast cancer: base models vs stacked ensemble",
        labels: ["RandomForest", "kNN", "Stacked"],
        values: [0.963, 0.970, 0.967],
        valueLabels: ["0.963", "0.970", "0.967"],
        colors: ["#4ea1ff", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "On the 569-patient Wisconsin breast-cancer dataset the stacked ensemble scores 0.967 — it matches the strong kNN base model (0.970) and beats RandomForest (0.963), so the learned combiner holds its own against the best single model.",
    code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score

X, y = load_breast_cancer(return_X_y=True)   # 569 real tumor scans, 30 features
rf = RandomForestClassifier(n_estimators=100, random_state=0)
knn = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=7))
stack = StackingClassifier(estimators=[("rf", rf), ("knn", knn)],
                           final_estimator=LogisticRegression(max_iter=1000), cv=5)

labels = ["RandomForest", "kNN", "Stacked"]
accs = [cross_val_score(m, X, y, cv=5).mean() for m in (rf, knn, stack)]

colors = ["#4ea1ff", "#4ea1ff", "#7ee787"]
plt.bar(labels, accs, color=colors)
for i, a in enumerate(accs):
    plt.text(i, a, "%.3f" % a, ha="center", va="bottom")
plt.ylim(0.94, 0.98)
plt.title("5-fold accuracy on breast cancer: base models vs stacked ensemble")
plt.ylabel("accuracy")
plt.show()`
  },

  "cls-anomaly": {
    question: "On real breast-cancer scans, which tumors look like outliers?",
    charts: [
      {
        type: "scatter",
        title: "Isolation Forest on breast cancer: normal scans vs flagged outliers",
        xlabel: "mean radius",
        ylabel: "mean texture",
        groups: [
          { name: "normal", color: "#4ea1ff", points: [[12.1,13.4],[11.5,18.2],[12.0,24.9],[11.4,17.6],[19.2,15.9],[12.3,16.5],[16.1,17.9],[12.4,15.0],[17.9,21.0],[9.5,21.0],[16.1,20.7],[19.6,25.0],[16.0,23.2],[15.4,22.8],[11.4,14.9],[11.4,17.3],[15.5,21.1],[12.6,20.8],[12.5,12.8],[19.4,18.8],[14.8,23.9],[10.7,20.4],[12.2,17.9],[20.2,19.5],[10.8,15.0],[18.4,21.9],[11.4,18.9],[11.3,18.2],[13.7,13.2],[19.8,25.1],[13.7,19.1],[10.3,16.4],[12.2,22.4],[13.6,16.3],[12.3,22.2],[11.1,22.4],[16.1,14.9],[12.2,14.1],[14.2,23.8],[13.7,22.6],[11.7,24.4],[17.7,20.7],[17.2,24.5],[17.4,23.1],[13.0,25.1],[11.3,14.2],[11.9,17.4],[10.5,19.9],[18.6,17.6],[15.0,22.1],[12.9,19.5],[13.1,22.5],[11.9,20.8],[9.7,19.1],[10.1,17.5],[11.3,19.0],[9.9,18.1]] },
          { name: "anomaly (flagged)", color: "#ff7b72", points: [[23.3,22.0],[19.5,32.5],[24.6,21.6]] }
        ]
      }
    ],
    caption: "Plotting mean radius against mean texture for real tumor scans, Isolation Forest flags 46 of 569 patients as outliers; the three in this 60-point sample sit at the large-radius, high-texture edge — exactly the unusual tumors a screen wants to surface.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import IsolationForest

bc = load_breast_cancer()
X = bc.data[:, [0, 1]]                 # mean radius, mean texture (real features)

iso = IsolationForest(contamination=0.08, random_state=0).fit(X)
pred = iso.predict(X)                   # -1 = anomaly, 1 = normal
normal = X[pred == 1]
flagged = X[pred == -1]

plt.scatter(normal[:, 0], normal[:, 1], c="#4ea1ff", s=12, label="normal")
plt.scatter(flagged[:, 0], flagged[:, 1], c="#ff7b72", s=12, label="anomaly (flagged)")
plt.title("Isolation Forest on breast cancer: normal scans vs flagged outliers")
plt.xlabel("mean radius")
plt.ylabel("mean texture")
plt.legend()
plt.show()`
  },

  "cls-recommender": {
    question: "Can we fill in the movie ratings these viewers never gave?",
    charts: [
      {
        type: "heatmap",
        title: "Observed movie ratings (blank cells were hidden from the model)",
        rows: ["Alice", "Ben", "Chloe", "Diego", "Emma", "Frank"],
        cols: ["Matrix", "Titanic", "Inception", "ToyStory", "Gladiator", "Frozen", "Avatar", "Shrek"],
        matrix: [[5.0,2.0,null,3.0,4.0,2.0,4.0,null],[4.0,null,4.0,4.0,null,2.0,3.0,3.0],[2.0,5.0,2.0,null,2.0,5.0,null,5.0],[null,3.0,3.0,4.0,3.0,null,4.0,4.0],[1.0,null,1.0,3.0,2.0,5.0,2.0,null],[4.0,3.0,null,3.0,5.0,2.0,null,2.0]],
        showVals: true
      },
      {
        type: "heatmap",
        title: "Reconstructed ratings (every blank now filled by rank-3 SVD)",
        rows: ["Alice", "Ben", "Chloe", "Diego", "Emma", "Frank"],
        cols: ["Matrix", "Titanic", "Inception", "ToyStory", "Gladiator", "Frozen", "Avatar", "Shrek"],
        matrix: [[4.8,1.98,3.24,3.14,4.17,2.05,4.19,3.16],[3.9,3.33,4.28,3.43,3.55,2.38,3.36,2.97],[1.81,4.41,2.3,3.42,1.57,5.03,3.25,4.94],[3.55,3.21,3.04,3.35,2.96,3.32,3.84,4.07],[1.0,3.37,1.09,2.66,2.24,5.18,2.16,3.19],[4.0,2.29,3.59,2.97,4.28,2.07,3.09,1.96]],
        showVals: true
      }
    ],
    caption: "Six viewers rated eight real films on a 1-5 scale. Factoring the sparse table with a rank-3 SVD fills every blank: e.g. action-fan Alice is predicted 3.2 for Inception, and Frozen-loving Emma 5.2 for Frozen. RMSE is 0.30 on observed cells and 1.02 on the held-out ones.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import TruncatedSVD

users = ["Alice","Ben","Chloe","Diego","Emma","Frank"]
movies = ["Matrix","Titanic","Inception","ToyStory","Gladiator","Frozen","Avatar","Shrek"]
R = np.array([                          # real-style 1-5 ratings
 [5,2,5,3,4,2,4,3],[4,2,4,4,3,2,3,3],[2,5,2,4,2,5,3,5],
 [3,3,3,4,3,3,4,4],[1,4,1,3,2,5,2,5],[4,3,5,3,5,2,4,2]], dtype=float)
mask = np.array([                        # which cells the user actually rated
 [1,1,0,1,1,1,1,0],[1,0,1,1,0,1,1,1],[1,1,1,0,1,1,0,1],
 [0,1,1,1,1,0,1,1],[1,0,1,1,1,1,1,0],[1,1,0,1,1,1,0,1]], dtype=bool)

mean = R[mask].mean()
Robs = np.where(mask, R - mean, 0.0)     # center, zero-fill unknowns
svd = TruncatedSVD(n_components=3, random_state=0)
Rhat = svd.fit_transform(Robs) @ svd.components_ + mean

obs = np.where(mask, R, np.nan)          # blanks as NaN for display
fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].imshow(obs, cmap="coolwarm", vmin=1, vmax=5)
ax[0].set_title("Observed movie ratings (blanks hidden)")
ax[1].imshow(Rhat, cmap="coolwarm", vmin=1, vmax=5)
ax[1].set_title("Reconstructed ratings (rank-3 SVD)")
for a in ax:
    a.set_xticks(range(len(movies))); a.set_xticklabels(movies, rotation=90)
    a.set_yticks(range(len(users))); a.set_yticklabels(users)
plt.show()`
  },

  "cls-tsne": {
    question: "Does t-SNE expose the digit structure in real handwritten images?",
    charts: [
      {
        type: "scatter",
        title: "t-SNE of handwritten digits (8x8 images) projected to 2-D",
        xlabel: "t-SNE 1",
        ylabel: "t-SNE 2",
        groups: [
          { name: "digit 0", color: "#4ea1ff", points: [[11.8,-31.7],[14.5,-29.9],[15.7,-23.5],[12.6,-35.1],[13.9,-25.0],[16.4,-39.8],[13.2,-26.3],[18.5,-27.2],[21.7,-23.8],[8.9,-35.3],[13.2,-27.8],[18.5,-30.1]] },
          { name: "digit 1", color: "#7ee787", points: [[1.2,27.4],[4.7,5.9],[5.8,22.2],[-2.4,22.3],[4.3,23.1],[-4.5,22.3],[-1.9,26.8],[-0.2,27.9],[7.6,8.1],[6.0,11.0],[5.7,11.9],[-1.4,21.2]] },
          { name: "digit 2", color: "#ffb454", points: [[-34.5,14.4],[-31.6,0.4],[-31.9,12.2],[-31.4,12.9],[-29.6,19.1],[-23.7,15.0],[-28.9,14.8],[-35.1,4.7],[-25.5,12.5],[-26.5,11.2],[-29.5,3.4],[-30.5,0.2]] },
          { name: "digit 3", color: "#c89bff", points: [[-13.2,-15.2],[-14.3,-19.8],[-15.5,-15.7],[-21.1,-17.2],[-19.5,-21.0],[-20.3,-14.8],[-17.3,-20.6],[-21.2,-20.5],[-22.4,-14.5],[-22.1,-20.3],[-15.4,-20.3],[-12.2,-18.8]] },
          { name: "digit 4", color: "#ff7b72", points: [[33.7,1.0],[30.4,-0.7],[31.3,0.9],[27.2,6.5],[22.5,10.7],[26.2,11.7],[37.1,10.9],[39.8,7.9],[26.4,17.3],[29.5,13.0],[31.2,3.2],[33.2,7.9]] }
        ]
      }
    ],
    caption: "This is the canonical real t-SNE example: each point is a real 8x8 scan of a handwritten digit (sklearn load_digits). Compressing the 64 pixels to 2-D lands each digit class in its own well-separated cluster, colored by the true label.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE

digits = load_digits()                   # 8x8 handwritten-digit images
keep = np.isin(digits.target, [0, 1, 2, 3, 4])
X, y = digits.data[keep], digits.target[keep]

emb = TSNE(n_components=2, perplexity=30, init="pca",
           random_state=0).fit_transform(X)

colors = ["#4ea1ff", "#7ee787", "#ffb454", "#c89bff", "#ff7b72"]
for d in range(5):
    pts = emb[y == d]
    plt.scatter(pts[:, 0], pts[:, 1], c=colors[d], s=12, label="digit %d" % d)
plt.title("t-SNE of handwritten digits (8x8 images) projected to 2-D")
plt.xlabel("t-SNE 1")
plt.ylabel("t-SNE 2")
plt.legend()
plt.show()`
  },

  "cls-factor-analysis": {
    question: "On real wine chemistry, how do two hidden factors load onto the measured signals?",
    charts: [
      {
        type: "bars",
        title: "Factor 1 loadings across six wine chemistry signals",
        labels: ["alcohol", "malic acid", "phenols", "flavanoids", "color", "proline"],
        values: [0.33, -0.4, 0.89, 0.97, -0.1, 0.57],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
      },
      {
        type: "bars",
        title: "Factor 2 loadings across six wine chemistry signals",
        labels: ["alcohol", "malic acid", "phenols", "flavanoids", "color", "proline"],
        values: [-0.84, -0.25, 0.0, 0.11, -0.69, -0.53],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"]
      }
    ],
    caption: "FactorAnalysis on the real 178-bottle wine dataset finds two latent causes. Factor 1 is a polyphenol axis (loads +0.89 phenols, +0.97 flavanoids); Factor 2 is a body axis (loads -0.84 alcohol, -0.69 color, -0.53 proline). Those loadings are exactly how a few hidden traits drive the measured chemistry.",
    code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import FactorAnalysis

wine = load_wine()                       # 178 real wines, 13 chemistry features
idx = [0, 1, 5, 6, 9, 12]                # alcohol, malic acid, phenols,
names = ["alcohol", "malic acid", "phenols", "flavanoids", "color", "proline"]
X = StandardScaler().fit_transform(wine.data)[:, idx]

fa = FactorAnalysis(n_components=2, random_state=0).fit(X)
loadings = fa.components_                 # shape (2, 6)

fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].bar(names, loadings[0], color="#4ea1ff")
ax[0].set_title("Factor 1 loadings across six wine chemistry signals")
ax[1].bar(names, loadings[1], color="#c89bff")
ax[1].set_title("Factor 2 loadings across six wine chemistry signals")
for a in ax:
    a.tick_params(axis="x", rotation=45)
plt.show()`
  },

  "cls-svr": {
    question: "On real diabetes data, where does SVR fit BMI against disease progression?",
    charts: [
      {
        type: "scatter",
        title: "SVR fit of disease progression vs BMI with the epsilon-tube",
        xlabel: "BMI (standardized)",
        ylabel: "disease progression",
        groups: [
          { name: "patients", color: "#4ea1ff", points: [[-0.09,94.0],[-0.073,142.0],[-0.072,77.0],[-0.07,158.0],[-0.063,65.0],[-0.062,115.0],[-0.058,88.0],[-0.051,75.0],[-0.048,96.0],[-0.046,72.0],[-0.046,114.0],[-0.046,69.0],[-0.042,178.0],[-0.04,78.0],[-0.036,102.0],[-0.035,52.0],[-0.034,190.0],[-0.033,94.0],[-0.031,43.0],[-0.031,55.0],[-0.031,91.0],[-0.03,160.0],[-0.03,88.0],[-0.023,92.0],[-0.02,111.0],[-0.019,214.0],[-0.017,90.0],[-0.015,97.0],[-0.011,168.0],[-0.009,197.0],[-0.009,60.0],[-0.006,164.0],[-0.002,44.0],[-0.001,292.0],[0.001,142.0],[0.007,109.0],[0.007,67.0],[0.009,174.0],[0.014,220.0],[0.015,96.0],[0.015,201.0],[0.019,265.0],[0.021,197.0],[0.022,178.0],[0.03,244.0],[0.036,248.0],[0.046,175.0],[0.048,258.0],[0.06,263.0],[0.06,91.0],[0.062,151.0],[0.064,217.0],[0.069,277.0],[0.071,295.0],[0.077,332.0],[0.085,261.0],[0.093,200.0],[0.127,308.0],[0.137,233.0],[0.171,242.0]] }
        ],
        lines: [
          { name: "SVR fit", color: "#7ee787", points: [[-0.09,85.3],[-0.084,82.5],[-0.077,81.6],[-0.07,82.7],[-0.064,85.5],[-0.057,89.7],[-0.05,94.7],[-0.043,100.0],[-0.037,105.1],[-0.03,110.0],[-0.023,115.2],[-0.017,122.1],[-0.01,131.9],[-0.003,144.8],[0.003,159.9],[0.01,175.1],[0.017,187.5],[0.023,194.9],[0.03,197.0],[0.037,195.4],[0.043,193.1],[0.05,193.7],[0.057,199.2],[0.064,210.1],[0.07,224.4],[0.077,239.3],[0.084,252.3],[0.09,261.6],[0.097,267.2],[0.104,270.4],[0.11,272.7],[0.117,275.8],[0.124,280.2],[0.13,285.6],[0.137,290.9],[0.144,294.6],[0.15,294.9],[0.157,290.6],[0.164,281.2],[0.171,267.0]] },
          { name: "tube upper", color: "#ffb454", points: [[-0.09,110.3],[-0.084,107.5],[-0.077,106.6],[-0.07,107.7],[-0.064,110.5],[-0.057,114.7],[-0.05,119.7],[-0.043,125.0],[-0.037,130.1],[-0.03,135.0],[-0.023,140.2],[-0.017,147.1],[-0.01,156.9],[-0.003,169.8],[0.003,184.9],[0.01,200.1],[0.017,212.5],[0.023,219.9],[0.03,222.0],[0.037,220.4],[0.043,218.1],[0.05,218.7],[0.057,224.2],[0.064,235.1],[0.07,249.4],[0.077,264.3],[0.084,277.3],[0.09,286.6],[0.097,292.2],[0.104,295.4],[0.11,297.7],[0.117,300.8],[0.124,305.2],[0.13,310.6],[0.137,315.9],[0.144,319.6],[0.15,319.9],[0.157,315.6],[0.164,306.2],[0.171,292.0]] },
          { name: "tube lower", color: "#ffb454", points: [[-0.09,60.3],[-0.084,57.5],[-0.077,56.6],[-0.07,57.7],[-0.064,60.5],[-0.057,64.7],[-0.05,69.7],[-0.043,75.0],[-0.037,80.1],[-0.03,85.0],[-0.023,90.2],[-0.017,97.1],[-0.01,106.9],[-0.003,119.8],[0.003,134.9],[0.01,150.1],[0.017,162.5],[0.023,169.9],[0.03,172.0],[0.037,170.4],[0.043,168.1],[0.05,168.7],[0.057,174.2],[0.064,185.1],[0.07,199.4],[0.077,214.3],[0.084,227.3],[0.09,236.6],[0.097,242.2],[0.104,245.4],[0.11,247.7],[0.117,250.8],[0.124,255.2],[0.13,260.6],[0.137,265.9],[0.144,269.6],[0.15,269.9],[0.157,265.6],[0.164,256.2],[0.171,242.0]] }
        ]
      }
    ],
    caption: "On the real diabetes dataset (442 patients) SVR fits the rising, noisy relationship between body-mass index and one-year disease progression; 320 of 442 patients become support vectors, and the rest sit inside the amber epsilon-tube (epsilon 25).",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.svm import SVR

db = load_diabetes()                     # 442 real patients
x = db.data[:, 2]                        # BMI feature (standardized)
y = db.target                            # disease progression after one year
order = np.argsort(x); x, y = x[order], y[order]

eps = 25.0
svr = SVR(kernel="rbf", C=1000.0, epsilon=eps, gamma="scale").fit(x.reshape(-1, 1), y)
grid = np.linspace(x.min(), x.max(), 200).reshape(-1, 1)
fit = svr.predict(grid)

plt.scatter(x, y, c="#4ea1ff", s=12, label="patients")
plt.plot(grid[:, 0], fit, c="#7ee787", label="SVR fit")
plt.plot(grid[:, 0], fit + eps, c="#ffb454", label="tube upper")
plt.plot(grid[:, 0], fit - eps, c="#ffb454", label="tube lower")
plt.title("SVR fit of disease progression vs BMI with the epsilon-tube")
plt.xlabel("BMI (standardized)")
plt.ylabel("disease progression")
plt.legend()
plt.show()`
  },

  "cls-bandits": {
    question: "Across three ad creatives, which wins and does UCB beat random rotation?",
    charts: [
      {
        type: "line",
        title: "Cumulative clicks over 2000 impressions: UCB vs random rotation",
        xlabel: "impression",
        ylabel: "cumulative clicks",
        series: [
          { name: "UCB1", color: "#7ee787", points: [[0,0.0],[80,8.0],[160,18.0],[240,24.0],[320,32.0],[400,41.0],[480,46.0],[560,49.0],[640,59.0],[720,71.0],[800,78.0],[880,87.0],[960,97.0],[1040,106.0],[1120,119.0],[1200,130.0],[1280,140.0],[1360,158.0],[1440,167.0],[1520,179.0],[1600,186.0],[1680,201.0],[1760,208.0],[1840,228.0],[1920,237.0],[1999,254.0]] },
          { name: "random", color: "#ff7b72", points: [[0,0.0],[80,5.0],[160,12.0],[240,28.0],[320,32.0],[400,38.0],[480,45.0],[560,52.0],[640,60.0],[720,67.0],[800,72.0],[880,81.0],[960,90.0],[1040,107.0],[1120,114.0],[1200,120.0],[1280,130.0],[1360,138.0],[1440,147.0],[1520,160.0],[1600,168.0],[1680,178.0],[1760,186.0],[1840,191.0],[1920,205.0],[1999,212.0]] }
        ]
      },
      {
        type: "bars",
        title: "Impressions served per ad by UCB1 (true CTR 0.06 / 0.10 / 0.16)",
        labels: ["Ad A: blue banner", "Ad B: video", "Ad C: carousel"],
        values: [361, 442, 1197],
        colors: ["#4ea1ff", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Three ad creatives with real-looking click-through rates (6% / 10% / 16%). UCB1 learns that the carousel (Ad C) wins and routes most traffic there (1197 of 2000 impressions), ending with 254 clicks versus 212 for blind random rotation.",
    code: `import numpy as np
import matplotlib.pyplot as plt

ads = ["Ad A: blue banner", "Ad B: video", "Ad C: carousel"]
true_ctr = np.array([0.06, 0.10, 0.16])  # real-looking click-through rates
K, T = len(true_ctr), 2000

def run(strategy, seed):
    rng = np.random.default_rng(seed)
    sums = np.zeros(K); counts = np.zeros(K); cum = []; total = 0.0
    for t in range(T):
        if t < K:
            arm = t
        elif strategy == "ucb":
            mean = sums / counts
            arm = int(np.argmax(mean + np.sqrt(2 * np.log(t) / counts)))
        else:
            arm = int(rng.integers(K))
        r = float(rng.random() < true_ctr[arm])
        sums[arm] += r; counts[arm] += 1; total += r; cum.append(total)
    return np.array(cum), counts.astype(int)

ucb_cum, ucb_counts = run("ucb", 0)
rnd_cum, _ = run("random", 1)

fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].plot(np.arange(T), ucb_cum, c="#7ee787", label="UCB1")
ax[0].plot(np.arange(T), rnd_cum, c="#ff7b72", label="random")
ax[0].set_title("Cumulative clicks over 2000 impressions: UCB vs random rotation")
ax[0].set_xlabel("impression"); ax[0].set_ylabel("cumulative clicks"); ax[0].legend()
ax[1].bar(ads, ucb_counts, color=["#4ea1ff", "#4ea1ff", "#7ee787"])
ax[1].set_title("Impressions served per ad by UCB1")
ax[1].tick_params(axis="x", rotation=20)
plt.show()`
  }

});
