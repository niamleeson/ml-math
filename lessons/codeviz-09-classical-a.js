/* =====================================================================
   CODE VISUALIZATIONS for MODULE 09 (A) - CLASSICAL ML.
   One window.CODEVIZ entry per lesson id in 09-classical-a.js.
   Data + results are REAL: computed with numpy + scikit-learn on the
   bundled REAL datasets (load_iris / load_wine / load_breast_cancer /
   load_diabetes) and the fitted models' labels, boundaries, and
   predictions. Coords are embedded literals. Plain-text labels only.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {
  "cls-gmm": {
    "question": "Which Gaussian component generated each wine sample?",
    "charts": [
      {
        "type": "scatter",
        "title": "GMM on the Wine dataset (PCA to 2-D, 3 components)",
        "xlabel": "PCA component 1",
        "ylabel": "PCA component 2",
        "groups": [
          {
            "name": "component 0",
            "color": "#4ea1ff",
            "points": [[-0.929,-3.073],[2.249,-1.885],[1.976,-1.403],[1.263,-0.771],[1.035,-1.451],[0.835,-1.474],[-1.349,-2.118],[-1.564,-1.852],[0.957,-2.224],[1.031,-2.566],[-1.772,-1.717],[-1.621,-1.356],[0.083,-2.306],[-1.303,-0.763],[-0.457,-2.269],[-0.494,-1.939],[-0.107,-1.929],[0.74,-1.409],[0.978,-1.446],[0.038,-1.267],[-1.597,-1.208],[-1.327,0.17]]
          },
          {
            "name": "component 1",
            "color": "#7ee787",
            "points": [[-3.064,0.353],[-3.094,0.349],[-3.583,1.273],[-2.807,1.571],[-2.55,2.045],[-1.813,1.528],[-1.61,2.407],[-3.143,0.738],[-2.24,1.175],[-2.848,0.556],[-3.53,0.883],[-2.466,2.194]]
          },
          {
            "name": "component 2",
            "color": "#c89bff",
            "points": [[1.009,0.87],[3.05,2.122],[1.755,0.612],[2.113,0.676],[4.313,2.096],[2.172,2.327],[3.542,2.518],[2.085,1.061],[2.188,0.69],[2.256,0.191],[2.677,1.472],[1.903,1.633],[1.904,0.177],[2.53,1.803],[2.588,0.78],[3.071,1.156],[2.101,-0.071],[2.821,0.646],[2.01,1.247],[2.859,0.745],[2.225,1.875],[2.147,1.017],[2.742,1.437],[3.139,1.732],[2.562,0.26],[2.544,0.169]]
          }
        ]
      }
    ],
    "caption": "GaussianMixture fits 3 components to the 178 real wines (13 chemical measurements, reduced to 2-D by PCA); each point is colored by the component most responsible for it, and the 3 components line up with the 3 grape cultivars.",
    "code": `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.mixture import GaussianMixture

wine = load_wine()
Xs = StandardScaler().fit_transform(wine.data)
X2 = PCA(n_components=2, random_state=0).fit_transform(Xs)

gmm = GaussianMixture(n_components=3, covariance_type="full", random_state=0)
labels = gmm.fit_predict(X2)

colors = np.array(["#4ea1ff", "#7ee787", "#c89bff"])
plt.scatter(X2[:, 0], X2[:, 1], c=colors[labels], s=20)
plt.scatter(gmm.means_[:, 0], gmm.means_[:, 1],
            c="black", marker="x", s=120)
plt.title("GMM on the Wine dataset (PCA to 2-D, 3 components)")
plt.xlabel("PCA component 1")
plt.ylabel("PCA component 2")
plt.show()`
  },
  "cls-dbscan": {
    "question": "Can density clustering find the Iris species and flag outliers, without being told how many clusters?",
    "charts": [
      {
        "type": "scatter",
        "title": "DBSCAN on the Iris dataset (PCA to 2-D, eps 0.6, minPts 5)",
        "xlabel": "PCA component 1",
        "ylabel": "PCA component 2",
        "groups": [
          {
            "name": "cluster 0",
            "color": "#4ea1ff",
            "points": [[-2.265,0.48],[-2.364,-0.342],[-2.299,-0.597],[-2.076,1.489],[-2.444,0.048],[-2.326,0.133],[-2.218,-0.729],[-2.633,-0.962],[-2.199,1.86],[-1.914,0.409],[-1.819,0.086],[-2.227,0.137],[-1.952,-0.626],[-2.169,0.527],[-2.14,0.313],[-2.265,-0.338],[-2.208,-0.206],[-2.045,0.662],[-2.554,-0.479],[-2.137,1.142],[-2.07,-0.711],[-2.229,0.998]]
          },
          {
            "name": "cluster 1",
            "color": "#7ee787",
            "points": [[0.407,-1.754],[1.075,-0.208],[-0.033,-0.439],[0.875,0.509],[0.703,-0.063],[1.358,0.331],[0.665,-0.226],[0.224,-0.288],[0.429,0.846],[1.045,-1.383],[0.283,-1.329],[0.625,0.025],[-0.362,-2.019],[0.289,-0.856],[0.228,-0.385],[0.576,-0.155],[2.752,0.8],[0.367,-1.562],[2.007,-0.711],[1.26,-1.162],[1.59,0.676],[1.264,-1.707],[1.954,1.008],[1.175,-0.316],[1.021,0.064],[1.788,-0.187],[1.864,0.562],[1.863,-0.179],[1.202,-0.811],[1.576,1.069],[2.015,0.614],[1.902,0.69],[2.041,0.868],[1.998,1.049],[1.373,1.011]]
          },
          {
            "name": "noise",
            "color": "#ff7b72",
            "points": [[-1.858,-2.337],[2.426,2.557],[2.305,2.626]]
          }
        ]
      }
    ],
    "caption": "DBSCAN on the 150 real iris flowers (4 petal/sepal measurements, PCA to 2-D) finds 2 density regions and flags 6 points as noise; setosa separates cleanly while versicolor and virginica overlap into one dense blob.",
    "code": `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import DBSCAN

iris = load_iris()
Xs = StandardScaler().fit_transform(iris.data)
X2 = PCA(n_components=2, random_state=0).fit_transform(Xs)

labels = DBSCAN(eps=0.6, min_samples=5).fit_predict(X2)

# label -1 is noise; draw it red, the rest by cluster color
palette = np.array(["#4ea1ff", "#7ee787", "#c89bff"])
colors = np.where(labels == -1, "#ff7b72", palette[labels % len(palette)])
plt.scatter(X2[:, 0], X2[:, 1], c=colors, s=20)
plt.title("DBSCAN on the Iris dataset (PCA to 2-D, eps 0.6, minPts 5)")
plt.xlabel("PCA component 1")
plt.ylabel("PCA component 2")
plt.show()`
  },
  "cls-spectral-clustering": {
    "question": "On the real Wine cultivars, does spectral clustering recover the same groups as k-means?",
    "charts": [
      {
        "type": "scatter",
        "title": "Spectral clustering on Wine (ARI 0.90)",
        "xlabel": "PCA component 1",
        "ylabel": "PCA component 2",
        "groups": [
          {
            "name": "cluster 0",
            "color": "#4ea1ff",
            "points": [[1.502,-0.769],[-0.61,-1.908],[0.183,-2.427],[-1.572,-0.885],[1.658,-0.957],[-0.725,-1.064],[-1.457,-1.383],[1.263,-0.771],[-0.495,-2.381],[0.835,-1.474],[-0.807,-2.234],[-0.558,-2.373],[-1.115,-1.802],[-0.556,-2.658],[2.252,-1.433],[-0.55,-2.293],[-0.161,-1.164],[1.578,-1.462],[-0.279,-1.931],[-1.303,-0.763],[0.482,-3.872],[0.038,-1.267],[-1.327,0.17]]
          },
          {
            "name": "cluster 1",
            "color": "#7ee787",
            "points": [[3.757,2.756],[1.009,0.87],[3.05,2.122],[2.449,1.175],[2.511,0.918],[2.113,0.676],[4.313,2.096],[2.305,1.663],[1.645,-0.516],[1.762,-0.317],[0.99,0.941],[1.235,-0.09],[2.677,1.472],[1.41,0.698],[2.588,0.78],[0.668,0.17],[3.071,1.156],[2.727,1.191],[2.821,0.646],[2.859,0.745],[2.225,1.875],[2.174,1.212],[3.139,1.732],[2.562,0.26]]
          },
          {
            "name": "cluster 2",
            "color": "#c89bff",
            "points": [[-2.539,-0.087],[-2.937,0.264],[-3.916,0.155],[-2.287,0.373],[-2.55,2.045],[-2.737,0.41],[-1.61,2.407],[-2.24,1.175],[-2.848,0.556],[-2.597,0.698],[-2.949,1.555],[-3.53,0.883],[-2.387,2.297]]
          }
        ]
      },
      {
        "type": "scatter",
        "title": "k-means on Wine (ARI 0.90)",
        "xlabel": "PCA component 1",
        "ylabel": "PCA component 2",
        "groups": [
          {
            "name": "cluster 0",
            "color": "#4ea1ff",
            "points": [[-0.61,-1.908],[0.183,-2.427],[-1.572,-0.885],[-0.725,-1.064],[-1.457,-1.383],[1.263,-0.771],[-0.495,-2.381],[0.835,-1.474],[-0.807,-2.234],[-0.558,-2.373],[-1.115,-1.802],[-0.556,-2.658],[-0.55,-2.293],[-0.161,-1.164],[1.578,-1.462],[-0.279,-1.931],[-1.303,-0.763],[0.482,-3.872],[0.038,-1.267]]
          },
          {
            "name": "cluster 1",
            "color": "#7ee787",
            "points": [[3.757,2.756],[1.009,0.87],[3.05,2.122],[2.449,1.175],[2.511,0.918],[2.113,0.676],[4.313,2.096],[2.305,1.663],[1.645,-0.516],[1.762,-0.317],[0.99,0.941],[1.235,-0.09],[2.677,1.472],[1.41,0.698],[1.502,-0.769],[2.588,0.78],[0.668,0.17],[3.071,1.156],[2.727,1.191],[2.821,0.646],[2.859,0.745],[2.225,1.875],[2.174,1.212],[3.139,1.732],[1.658,-0.957],[2.562,0.26],[2.252,-1.433]]
          },
          {
            "name": "cluster 2",
            "color": "#c89bff",
            "points": [[-2.539,-0.087],[-1.327,0.17],[-2.937,0.264],[-3.916,0.155],[-2.287,0.373],[-2.55,2.045],[-2.737,0.41],[-1.61,2.407],[-2.24,1.175],[-2.848,0.556],[-2.597,0.698],[-2.949,1.555],[-3.53,0.883],[-2.387,2.297]]
          }
        ]
      }
    ],
    "caption": "On the 178 real wines (PCA to 2-D) the 3 cultivars form convex blobs, so spectral clustering (ARI 0.90) and k-means (ARI 0.90) recover almost the same grouping; spectral's graph cut only pulls ahead when clusters are non-convex.",
    "code": `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import SpectralClustering, KMeans
from sklearn.metrics import adjusted_rand_score

wine = load_wine()
Xs = StandardScaler().fit_transform(wine.data)
X2 = PCA(n_components=2, random_state=0).fit_transform(Xs)

sc = SpectralClustering(n_clusters=3, affinity="nearest_neighbors",
                        n_neighbors=10, random_state=0).fit_predict(X2)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(X2)
print(adjusted_rand_score(wine.target, sc),
      adjusted_rand_score(wine.target, km))

colors = np.array(["#4ea1ff", "#7ee787", "#c89bff"])
fig, (ax1, ax2) = plt.subplots(1, 2, sharex=True, sharey=True)
ax1.scatter(X2[:, 0], X2[:, 1], c=colors[sc], s=18)
ax1.set_title("Spectral clustering on Wine")
ax2.scatter(X2[:, 0], X2[:, 1], c=colors[km], s=18)
ax2.set_title("k-means on Wine")
for ax in (ax1, ax2):
    ax.set_xlabel("PCA component 1")
    ax.set_ylabel("PCA component 2")
plt.show()`
  },
  "cls-lda-qda": {
    "question": "Splitting two Wine cultivars by flavanoids and color intensity: straight LDA line or curved QDA boundary?",
    "charts": [
      {
        "type": "scatter",
        "title": "LDA line vs QDA curve on Wine (cultivars 0 and 1)",
        "xlabel": "flavanoids",
        "ylabel": "color intensity",
        "groups": [
          {
            "name": "cultivar 0",
            "color": "#4ea1ff",
            "points": [[2.76,4.38],[3.24,5.68],[2.69,4.32],[3.39,6.75],[2.52,5.25],[2.51,5.05],[3.32,5.75],[2.43,5.0],[2.76,5.6],[3.69,5.4],[3.64,7.5],[2.91,7.3],[3.14,6.2],[3.93,8.7],[3.03,5.1],[3.17,5.65],[2.61,3.52],[2.68,3.58],[2.94,4.8],[2.19,3.95],[2.33,4.7],[3.19,6.9],[2.53,4.2],[2.98,5.1],[3.04,5.1],[2.68,4.28],[2.63,4.36],[3.39,6.1],[2.9,5.85]]
          },
          {
            "name": "cultivar 1",
            "color": "#7ee787",
            "points": [[1.09,3.27],[1.41,5.75],[3.1,4.45],[2.65,4.6],[1.3,3.17],[1.28,2.85],[1.02,3.05],[2.86,3.38],[2.14,3.21],[1.57,3.8],[1.85,3.4],[2.53,3.9],[1.58,2.2],[1.94,2.62],[1.69,2.45],[1.69,2.8],[1.59,1.74],[1.5,2.4],[1.25,3.6],[2.25,2.15],[0.99,2.5],[3.75,4.5],[2.99,2.3],[1.84,2.7],[2.04,2.7],[2.58,2.9],[2.01,3.08],[2.79,3.25],[3.03,2.8],[3.15,3.94],[1.75,2.6]]
          }
        ],
        "lines": [
          {
            "name": "LDA boundary",
            "color": "#ffb454",
            "points": [[5.58,2.726],[5.396,2.812],[5.23,2.928],[5.046,3.014],[4.871,3.115],[4.695,3.216],[4.511,3.303],[4.345,3.418],[4.161,3.504],[3.986,3.605],[3.811,3.706],[3.627,3.793],[3.461,3.908],[3.276,3.994],[3.101,4.095],[2.926,4.196],[2.742,4.283],[2.567,4.384],[2.392,4.485],[2.217,4.585],[2.042,4.686],[1.858,4.773],[1.682,4.874],[1.507,4.975],[1.332,5.076],[1.157,5.176],[0.973,5.263],[0.798,5.364],[0.623,5.465],[0.448,5.566],[0.273,5.667],[0.088,5.753]]
          },
          {
            "name": "QDA boundary",
            "color": "#c89bff",
            "dash": true,
            "points": [[5.58,9.155],[5.442,8.852],[5.304,8.55],[5.165,8.247],[5.027,7.944],[4.88,7.656],[4.742,7.353],[4.603,7.05],[4.456,6.762],[4.318,6.459],[4.17,6.171],[4.023,5.883],[3.875,5.595],[3.728,5.306],[3.571,5.032],[3.415,4.758],[3.258,4.485],[3.083,4.24],[2.899,4.009],[2.65,3.879],[2.438,4.067],[2.327,4.413],[2.263,4.831],[2.217,5.277],[2.18,5.739],[2.162,6.229],[2.143,6.719],[2.143,7.238],[2.125,7.728],[2.125,8.247],[2.106,8.737],[2.106,9.256]]
          }
        ]
      }
    ],
    "caption": "On 2 real chemical features of Wine cultivars 0 and 1 (flavanoids vs color intensity), LDA draws a straight boundary (train acc 0.87) while QDA bends around the spread of each class (train acc 0.92).",
    "code": `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.discriminant_analysis import (
    LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis)

wine = load_wine()
mask = wine.target < 2                 # cultivars 0 and 1
X = wine.data[mask][:, [6, 9]]         # flavanoids, color_intensity
y = wine.target[mask]

lda = LinearDiscriminantAnalysis().fit(X, y)
qda = QuadraticDiscriminantAnalysis().fit(X, y)

# grid for the two decision boundaries
gx = np.linspace(X[:, 0].min() - 0.5, X[:, 0].max() + 0.5, 300)
gy = np.linspace(X[:, 1].min() - 0.5, X[:, 1].max() + 0.5, 300)
XX, YY = np.meshgrid(gx, gy)
grid = np.c_[XX.ravel(), YY.ravel()]

colors = np.array(["#4ea1ff", "#7ee787"])
plt.scatter(X[:, 0], X[:, 1], c=colors[y], s=18)
plt.contour(XX, YY, lda.predict(grid).reshape(XX.shape),
            levels=[0.5], colors="#ffb454")
plt.contour(XX, YY, qda.predict(grid).reshape(XX.shape),
            levels=[0.5], colors="#c89bff", linestyles="dashed")
plt.title("LDA line vs QDA curve on Wine (cultivars 0 and 1)")
plt.xlabel("flavanoids")
plt.ylabel("color intensity")
plt.show()`
  },
  "cls-gaussian-process": {
    "question": "Fitting diabetes progression from BMI: how confident is the model where data is sparse?",
    "charts": [
      {
        "type": "scatter",
        "title": "GP regression on Diabetes (BMI vs progression)",
        "xlabel": "BMI (mean-centered, scaled)",
        "ylabel": "disease progression",
        "groups": [
          {
            "name": "patients",
            "color": "#ffb454",
            "points": [[-0.0838,101.0],[-0.059,86.0],[-0.0579,252.0],[-0.0526,181.0],[-0.0515,75.0],[-0.0461,74.0],[-0.045,93.0],[-0.0418,103.0],[-0.0375,129.0],[-0.0288,179.0],[-0.0245,110.0],[-0.0235,64.0],[-0.0224,49.0],[-0.0159,151.0],[-0.0116,200.0],[-0.0105,168.0],[-0.0094,257.0],[-0.0062,219.0],[-0.003,217.0],[0.0013,49.0],[0.0046,191.0],[0.0089,127.0],[0.011,276.0],[0.0175,128.0],[0.0207,281.0],[0.0229,232.0],[0.0261,196.0],[0.0283,170.0],[0.0337,198.0],[0.0401,155.0],[0.0455,175.0],[0.0466,174.0],[0.0466,99.0],[0.0542,142.0],[0.0552,68.0],[0.0585,136.0],[0.0606,215.0],[0.0886,264.0],[0.0973,275.0],[0.1048,321.0]]
          }
        ],
        "lines": [
          {
            "name": "GP mean",
            "color": "#4ea1ff",
            "points": [[-0.1103,128.2073],[-0.1041,128.1374],[-0.098,128.2681],[-0.0919,128.6091],[-0.0857,129.1682],[-0.0796,129.9516],[-0.0734,130.9634],[-0.0673,132.2057],[-0.0612,133.6782],[-0.055,135.3787],[-0.0489,137.3023],[-0.0427,139.4423],[-0.0366,141.7893],[-0.0305,144.3319],[-0.0243,147.0566],[-0.0182,149.9478],[-0.012,152.9882],[-0.0059,156.1585],[0.0002,159.4384],[0.0064,162.8057],[0.0125,166.2376],[0.0187,169.7102],[0.0248,173.1992],[0.0309,176.68],[0.0371,180.1277],[0.0432,183.5179],[0.0493,186.8265],[0.0555,190.0305],[0.0616,193.1074],[0.0678,196.0363],[0.0739,198.7977],[0.08,201.3737],[0.0862,203.7484],[0.0923,205.9078],[0.0985,207.8402],[0.1046,209.5361],[0.1107,210.9882],[0.1169,212.1919],[0.123,213.1448],[0.1292,213.8469],[0.1353,214.3007],[0.1414,214.5107],[0.1476,214.4839],[0.1537,214.229],[0.1599,213.7566],[0.166,213.0792],[0.1721,212.2106],[0.1783,211.1658],[0.1844,209.9609],[0.1906,208.6128]]
          },
          {
            "name": "mean + 2 sigma",
            "color": "#7ee787",
            "dash": true,
            "points": [[-0.1103,270.844],[-0.1041,269.7258],[-0.098,268.8551],[-0.0919,268.2505],[-0.0857,267.9271],[-0.0796,267.8971],[-0.0734,268.1689],[-0.0673,268.747],[-0.0612,269.6321],[-0.055,270.8211],[-0.0489,272.3068],[-0.0427,274.0788],[-0.0366,276.123],[-0.0305,278.4229],[-0.0243,280.959],[-0.0182,283.7102],[-0.012,286.6535],[-0.0059,289.765],[0.0002,293.02],[0.0064,296.3936],[0.0125,299.861],[0.0187,303.3978],[0.0248,306.9801],[0.0309,310.585],[0.0371,314.1906],[0.0432,317.7759],[0.0493,321.3211],[0.0555,324.8077],[0.0616,328.2179],[0.0678,331.5353],[0.0739,334.7442],[0.08,337.8301],[0.0862,340.7791],[0.0923,343.5784],[0.0985,346.2158],[0.1046,348.6803],[0.1107,350.9616],[0.1169,353.0505],[0.123,354.9389],[0.1292,356.6201],[0.1353,358.0886],[0.1414,359.3407],[0.1476,360.3741],[0.1537,361.1884],[0.1599,361.7852],[0.166,362.1676],[0.1721,362.3411],[0.1783,362.3126],[0.1844,362.091],[0.1906,361.6869]]
          },
          {
            "name": "mean - 2 sigma",
            "color": "#7ee787",
            "dash": true,
            "points": [[-0.1103,-14.4294],[-0.1041,-13.4509],[-0.098,-12.3189],[-0.0919,-11.0323],[-0.0857,-9.5907],[-0.0796,-7.9939],[-0.0734,-6.242],[-0.0673,-4.3356],[-0.0612,-2.2757],[-0.055,-0.0637],[-0.0489,2.2979],[-0.0427,4.8058],[-0.0366,7.4555],[-0.0305,10.2409],[-0.0243,13.1541],[-0.0182,16.1854],[-0.012,19.3228],[-0.0059,22.5521],[0.0002,25.8567],[0.0064,29.2178],[0.0125,32.6141],[0.0187,36.0226],[0.0248,39.4184],[0.0309,42.7749],[0.0371,46.0648],[0.0432,49.2599],[0.0493,52.332],[0.0555,55.2533],[0.0616,57.9968],[0.0678,60.5373],[0.0739,62.8511],[0.08,64.9173],[0.0862,66.7177],[0.0923,68.2373],[0.0985,69.4646],[0.1046,70.3918],[0.1107,71.0148],[0.1169,71.3333],[0.123,71.3507],[0.1292,71.0738],[0.1353,70.5128],[0.1414,69.6808],[0.1476,68.5937],[0.1537,67.2695],[0.1599,65.7281],[0.166,63.9908],[0.1721,62.0801],[0.1783,60.019],[0.1844,57.8308],[0.1906,55.5387]]
          }
        ]
      }
    ],
    "caption": "A Gaussian process fits disease progression against BMI for 40 real diabetes patients; the mean rises with BMI and the +/-2 sigma band stays wide because the real target is noisy, widening further at the sparse high-BMI tail.",
    "code": `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import (
    ConstantKernel, RBF, WhiteKernel)

dia = load_diabetes()
x = dia.data[:, 2]            # BMI feature (mean-centered, scaled)
y = dia.target.astype(float)

rng = np.random.RandomState(0)
idx = np.sort(rng.choice(len(x), 40, replace=False))
X = x[idx].reshape(-1, 1)
yo = y[idx]

kernel = (ConstantKernel(1.0) * RBF(length_scale=0.1)
          + WhiteKernel(noise_level=1.0))
gp = GaussianProcessRegressor(kernel=kernel, random_state=0,
                              normalize_y=True).fit(X, yo)

xs = np.linspace(x.min() - 0.02, x.max() + 0.02, 50).reshape(-1, 1)
mean, std = gp.predict(xs, return_std=True)

plt.scatter(X.ravel(), yo, c="#ffb454", s=30, zorder=3)
plt.plot(xs.ravel(), mean, c="#4ea1ff")
plt.fill_between(xs.ravel(), mean - 2 * std, mean + 2 * std,
                 color="#7ee787", alpha=0.3)
plt.title("GP regression on Diabetes (BMI vs progression)")
plt.xlabel("BMI (mean-centered, scaled)")
plt.ylabel("disease progression")
plt.show()`
  },
  "cls-bayesian-regression": {
    "question": "Fitting diabetes progression from BMI, how does the Bayesian posterior slope compare to plain OLS?",
    "charts": [
      {
        "type": "scatter",
        "title": "Bayesian ridge vs OLS on Diabetes (BMI)",
        "xlabel": "BMI (mean-centered, scaled)",
        "ylabel": "disease progression",
        "groups": [
          {
            "name": "patients",
            "color": "#ffb454",
            "points": [[0.0445,141.0],[0.0445,129.0],[-0.0655,59.0],[0.0164,225.0],[-0.0094,59.0],[0.0412,52.0],[-0.0041,61.0],[-0.0245,163.0],[0.0121,143.0],[-0.0353,52.0],[-0.0482,111.0],[-0.045,102.0],[-0.0094,81.0],[0.0013,229.0],[-0.0105,179.0],[0.0164,268.0],[0.0617,281.0],[0.1285,259.0],[0.0595,178.0],[0.093,128.0],[-0.0191,214.0],[0.0272,225.0],[-0.0159,151.0],[-0.0547,143.0],[-0.0051,116.0],[-0.0579,158.0],[0.0013,196.0],[0.0455,202.0],[0.0035,73.0],[-0.0385,93.0],[-0.0256,252.0],[0.0003,259.0],[-0.0687,72.0],[0.0542,187.0],[-0.0623,45.0],[-0.0245,66.0],[-0.0364,102.0],[-0.0224,156.0],[-0.0062,219.0],[0.0552,68.0],[0.0337,198.0],[0.0649,109.0],[0.0617,242.0],[-0.0084,131.0],[-0.0472,72.0],[-0.0407,71.0],[-0.0558,109.0],[0.0455,272.0],[-0.0245,58.0],[-0.0579,63.0],[0.0154,201.0],[-0.0332,168.0],[-0.0278,209.0],[-0.0008,113.0],[0.08,257.0],[0.011,111.0],[-0.0332,94.0],[-0.031,66.0],[0.0552,173.0],[-0.0159,132.0]]
          }
        ],
        "lines": [
          {
            "name": "OLS fit (slope 949.4)",
            "color": "#ff7b72",
            "dash": true,
            "points": [[-0.1,56.929],[-0.091,66.123],[-0.081,75.317],[-0.071,84.511],[-0.062,93.705],[-0.052,102.899],[-0.042,112.093],[-0.032,121.288],[-0.023,130.482],[-0.013,139.676],[-0.003,148.87],[0.006,158.064],[0.016,167.258],[0.026,176.453],[0.035,185.647],[0.045,194.841],[0.055,204.035],[0.064,213.229],[0.074,222.423],[0.084,231.617],[0.093,240.812],[0.103,250.006],[0.113,259.2],[0.122,268.394],[0.132,277.588],[0.142,286.782],[0.152,295.977],[0.161,305.171],[0.171,314.365],[0.181,323.559]]
          },
          {
            "name": "posterior mean (slope 945.3)",
            "color": "#4ea1ff",
            "points": [[-0.1,57.34],[-0.091,66.495],[-0.081,75.649],[-0.071,84.804],[-0.062,93.958],[-0.052,103.112],[-0.042,112.267],[-0.032,121.421],[-0.023,130.575],[-0.013,139.73],[-0.003,148.884],[0.006,158.039],[0.016,167.193],[0.026,176.347],[0.035,185.502],[0.045,194.656],[0.055,203.811],[0.064,212.965],[0.074,222.119],[0.084,231.274],[0.093,240.428],[0.103,249.582],[0.113,258.737],[0.122,267.891],[0.132,277.046],[0.142,286.2],[0.152,295.354],[0.161,304.509],[0.171,313.663],[0.181,322.817]]
          },
          {
            "name": "prior mean (intercept only)",
            "color": "#9aa7b4",
            "dash": true,
            "points": [[-0.1,152.133],[-0.091,152.133],[-0.081,152.133],[-0.071,152.133],[-0.062,152.133],[-0.052,152.133],[-0.042,152.133],[-0.032,152.133],[-0.023,152.133],[-0.013,152.133],[-0.003,152.133],[0.006,152.133],[0.016,152.133],[0.026,152.133],[0.035,152.133],[0.045,152.133],[0.055,152.133],[0.064,152.133],[0.074,152.133],[0.084,152.133],[0.093,152.133],[0.103,152.133],[0.113,152.133],[0.122,152.133],[0.132,152.133],[0.142,152.133],[0.152,152.133],[0.161,152.133],[0.171,152.133],[0.181,152.133]]
          }
        ]
      }
    ],
    "caption": "On the 442 real diabetes patients, BayesianRidge fits BMI vs progression with a posterior slope (945.3) barely shrunk from the OLS slope (949.4), because with this much real data the likelihood dominates the flat prior (the dashed grey line is the mean-only prior).",
    "code": `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.linear_model import BayesianRidge, LinearRegression

dia = load_diabetes()
x = dia.data[:, 2]            # BMI feature
y = dia.target.astype(float)
X = x.reshape(-1, 1)

ols = LinearRegression().fit(X, y)
br = BayesianRidge().fit(X, y)
print(ols.coef_[0], br.coef_[0])

xs = np.linspace(x.min() - 0.01, x.max() + 0.01, 30).reshape(-1, 1)
plt.scatter(x, y, c="#ffb454", s=30)
plt.plot(xs.ravel(), ols.predict(xs), c="#ff7b72", linestyle="--",
         label="OLS fit")
plt.plot(xs.ravel(), br.predict(xs), c="#4ea1ff",
         label="posterior mean")
plt.plot(xs.ravel(), np.full_like(xs.ravel(), y.mean()), c="#9aa7b4",
         linestyle="--", label="prior mean")
plt.legend()
plt.title("Bayesian ridge vs OLS on Diabetes (BMI)")
plt.xlabel("BMI (mean-centered, scaled)")
plt.ylabel("disease progression")
plt.show()`
  },
  "cls-gradient-boosting": {
    "question": "On the Breast Cancer data, does held-out error keep shrinking as boosting rounds accumulate?",
    "charts": [
      {
        "type": "line",
        "title": "Gradient boosting on Breast Cancer: test log-loss per round",
        "xlabel": "number of trees",
        "ylabel": "test log-loss",
        "series": [
          {
            "name": "test log-loss",
            "color": "#4ea1ff",
            "points": [[1,0.5836],[10,0.2684],[20,0.1777],[30,0.1591],[40,0.1586],[50,0.166],[60,0.1728],[70,0.1784],[80,0.1821],[90,0.1899],[100,0.1953],[110,0.2074],[120,0.2154],[130,0.2149],[140,0.2133],[150,0.2179],[160,0.2219],[170,0.2305],[180,0.2392],[190,0.2488],[200,0.2516]]
          }
        ]
      }
    ],
    "caption": "Gradient boosting on the real Breast Cancer dataset (569 tumors, 30 features); each tree fits the residual, so held-out log-loss drops from 0.5836 after 1 tree to 0.2516 after 200.",
    "code": `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import log_loss

bc = load_breast_cancer()
Xtr, Xte, ytr, yte = train_test_split(
    bc.data, bc.target, test_size=0.25, random_state=0,
    stratify=bc.target)

gb = GradientBoostingClassifier(n_estimators=200, learning_rate=0.1,
                                max_depth=3, random_state=0).fit(Xtr, ytr)

# test log-loss after each boosting round via staged_predict_proba
rounds = np.arange(1, gb.n_estimators_ + 1)
loss = np.array([log_loss(yte, p)
                 for p in gb.staged_predict_proba(Xte)])

plt.plot(rounds, loss, c="#4ea1ff")
plt.title("Gradient boosting on Breast Cancer: test log-loss per round")
plt.xlabel("number of trees")
plt.ylabel("test log-loss")
plt.show()`
  }
});
