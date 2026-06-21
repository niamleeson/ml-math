/* Per-lesson visualizations of the code result on REAL sklearn datasets. Merged into window.CODEVIZ by id.
   { question, charts:[ chartSpec ], caption, code }  - chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   All numbers are REAL outputs from running each lesson on a bundled sklearn dataset (breast cancer / iris / wine / digits / diabetes). */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {
  "ml-supervised": {question:"Breast-cancer tumors: from 30 cell measurements, can a model tell malignant from benign on new patients?",charts:[{type:"scatter",title:"569 real tumors, top 2 PCA directions, colored by diagnosis",xlabel:"PCA component 1",ylabel:"PCA component 2",groups:[{name:"malignant",color:"#ff7b72",points:[[0.46,0.394],[12.285,-7.543],[3.111,1.569],[4.418,1.419],[1.715,-1.524],[-0.934,-2.106],[6.439,-3.577],[7.676,-3.075],[4.68,-0.969],[2.38,3.95],[-0.543,-1.317],[4.759,3.012],[1.428,-1.967],[4.809,-3.029],[1.345,-1.275],[0.664,0.437],[4.149,0.767],[0.759,-1.609],[2.705,-4.437],[5.494,-4.166],[6.059,-0.757],[2.4,4.838],[2.239,-2.69],[1.786,-0.269],[3.519,-3.859],[0.608,0.162],[0.616,0.639],[4.207,1.176],[6.227,-1.39],[6.004,-0.091]]},{name:"benign",color:"#7ee787",points:[[-2.847,-2.894],[-1.867,-0.902],[-3.194,-1.849],[-3.448,-1.425],[-2.803,-1.666],[-1.301,-1.821],[-2.793,-1.078],[-4.976,-3.386],[-4.042,-1.357],[-2.787,-2.533],[-2.976,1.811],[4.33,9.203],[-1.557,-1.038],[-1.928,-1.138],[0.393,1.083],[-0.371,0.114],[-4.019,-1.354],[-2.373,-1.682],[-2.001,-0.293],[-5.475,-0.671],[-3.455,1.307],[-2.56,-2.494],[-3.143,-1.877],[-0.78,-2.124],[-5.566,-0.478],[-3.31,0.156],[-3.996,0.96],[-2.622,2.502],[7.093,12.573],[-3.315,-1.442]]}]}],caption:"Yes. Logistic regression on the 30 standardized cell features scores 0.965 test accuracy (train 0.991) on the Wisconsin breast-cancer data.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# 569 real tumors, 30 cell-nucleus measurements each
bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
y = bc.target                      # 0 malignant, 1 benign

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)
clf = LogisticRegression(max_iter=5000).fit(Xtr, ytr)
print("test accuracy", clf.score(Xte, yte))

# project the 30-D inputs to 2-D so we can see the two diagnoses
P = PCA(n_components=2, random_state=0).fit_transform(X)
for label, color, name in [(0, "#ff7b72", "malignant"), (1, "#7ee787", "benign")]:
    pts = P[y == label]
    plt.scatter(pts[:, 0], pts[:, 1], c=color, label=name, edgecolor="k")
plt.xlabel("PCA component 1")
plt.ylabel("PCA component 2")
plt.title("Breast-cancer tumors projected to 2-D")
plt.legend()
plt.show()`},
  "ml-loss": {question:"On real diabetes-progression predictions, how hard does each loss punish a prediction error as it grows?",charts:[{type:"line",title:"Loss vs prediction error (real diabetes residual range)",xlabel:"prediction error r (true minus predicted)",ylabel:"loss",series:[{name:"squared 0.5 r squared",color:"#ffb454",points:[[-100.0,5000.0],[-91.7,4201.4],[-83.3,3472.2],[-75.0,2812.5],[-66.7,2222.2],[-58.3,1701.4],[-50.0,1250.0],[-41.7,868.1],[-33.3,555.6],[-25.0,312.5],[-16.7,138.9],[-8.3,34.7],[0.0,0.0],[8.3,34.7],[16.7,138.9],[25.0,312.5],[33.3,555.6],[41.7,868.1],[50.0,1250.0],[58.3,1701.4],[66.7,2222.2],[75.0,2812.5],[83.3,3472.2],[91.7,4201.4],[100.0,5000.0]]},{name:"absolute |r|",color:"#4ea1ff",points:[[-100.0,100.0],[-91.7,91.7],[-83.3,83.3],[-75.0,75.0],[-66.7,66.7],[-58.3,58.3],[-50.0,50.0],[-41.7,41.7],[-33.3,33.3],[-25.0,25.0],[-16.7,16.7],[-8.3,8.3],[0.0,0.0],[8.3,8.3],[16.7,16.7],[25.0,25.0],[33.3,33.3],[41.7,41.7],[50.0,50.0],[58.3,58.3],[66.7,66.7],[75.0,75.0],[83.3,83.3],[91.7,91.7],[100.0,100.0]]}]},{type:"bars",title:"Squared loss at three real residual sizes",labels:["small err 5.1","median err 40.1","large err 139.3"],values:[13.0,804.0,9702.2],colors:["#4ea1ff","#ffb454","#ff7b72"]}],caption:"A linear model on the diabetes data leaves residuals up to 164.6. Squared loss explodes on the big errors, while absolute loss grows only linearly.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# 442 real diabetes patients, target = disease progression
db = load_diabetes()
Xtr, Xte, ytr, yte = train_test_split(db.data, db.target, test_size=0.3, random_state=0)
model = LinearRegression().fit(Xtr, ytr)
residuals = yte - model.predict(Xte)        # real prediction errors

# how each loss grows across the real residual range
r = np.linspace(-100, 100, 25)
squared = 0.5 * r ** 2
absolute = np.abs(r)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.plot(r, squared, color="#ffb454", label="squared 0.5 r squared")
ax1.plot(r, absolute, color="#4ea1ff", label="absolute |r|")
ax1.set_xlabel("prediction error r")
ax1.set_ylabel("loss")
ax1.set_title("Loss vs prediction error")
ax1.legend()

ex = np.sort(np.abs(residuals))[[5, len(residuals)//2, -3]]
ax2.bar(["small", "median", "large"], 0.5 * ex ** 2,
        color=["#4ea1ff", "#ffb454", "#ff7b72"])
ax2.set_title("Squared loss at three real residual sizes")
plt.show()`},
  "ml-cost": {question:"On real diabetes data, as we vary the BMI slope theta, where does total squared cost bottom out?",charts:[{type:"line",title:"Cost J(theta) over 442 diabetes patients",xlabel:"theta (slope on BMI)",ylabel:"mean squared loss J",series:[{name:"J(theta)",color:"#4ea1ff",points:[[0.0,2964.9],[83.3,2793.8],[166.7,2638.4],[250.0,2498.6],[333.3,2374.6],[416.7,2266.3],[500.0,2173.7],[583.3,2096.8],[666.7,2035.7],[750.0,1990.2],[833.3,1960.5],[916.7,1946.4],[1000.0,1948.1],[1083.3,1965.5],[1166.7,1998.6],[1250.0,2047.4],[1333.3,2111.9],[1416.7,2192.2],[1500.0,2288.1],[1583.3,2399.8],[1666.7,2527.2],[1750.0,2670.2],[1833.3,2829.0],[1916.7,3003.5],[2000.0,3193.7]]}]}],caption:"Cost is a single bowl with one minimum near theta = 916.667, the least-squares BMI slope that best predicts disease progression.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes

# real diabetes data: predict progression from BMI alone
db = load_diabetes()
x = db.data[:, 2]              # BMI feature (already centered/scaled)
y = db.target
xbar, ybar = x.mean(), y.mean()

def cost(theta):
    pred = theta * (x - xbar) + ybar
    return np.mean(0.5 * (pred - y) ** 2)

thetas = np.linspace(0, 2000, 25)
J = [cost(t) for t in thetas]

plt.plot(thetas, J, color="#4ea1ff", label="J(theta)")
plt.xlabel("theta (slope on BMI)")
plt.ylabel("mean squared loss J")
plt.title("Cost J(theta) over the diabetes dataset")
plt.legend()
plt.show()`},
  "ml-gradient-descent": {question:"Fitting the diabetes BMI slope by gradient descent: does each step actually drive the cost down?",charts:[{type:"line",title:"Cost over gradient-descent steps (diabetes BMI slope)",xlabel:"step",ylabel:"mean squared loss J",series:[{name:"J at each step",color:"#ffb454",points:[[1.0,2962.6],[2.0,2960.3],[3.0,2958.0],[4.0,2955.8],[5.0,2953.5],[6.0,2951.2],[7.0,2948.9],[8.0,2946.6],[9.0,2944.4],[10.0,2942.1],[11.0,2939.9],[12.0,2937.6],[13.0,2935.4],[14.0,2933.1],[15.0,2930.9],[16.0,2928.7],[17.0,2926.4],[18.0,2924.2],[19.0,2922.0],[20.0,2919.8]]}]}],caption:"Yes. Each step nudges theta opposite the slope (theta minus alpha times the gradient), lowering J on the real diabetes data and converging to the least-squares slope near 21.251.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes

# real diabetes data: gradient descent on the BMI slope
db = load_diabetes()
x = db.data[:, 2]
y = db.target
xc = x - x.mean()
yc = y - y.mean()

theta = 0.0
alpha = 0.5
steps, costs = [], []
for s in range(1, 21):
    grad = np.mean((theta * xc - yc) * xc)   # slope of the cost
    theta = theta - alpha * grad             # step opposite the slope
    steps.append(s)
    costs.append(np.mean(0.5 * (theta * xc - yc) ** 2))

plt.plot(steps, costs, color="#ffb454", marker="o", label="J at each step")
plt.xlabel("step")
plt.ylabel("mean squared loss J")
plt.title("Gradient descent on the diabetes BMI slope")
plt.legend()
plt.show()`},
  "ml-linear-regression": {question:"Does a straight line fit diabetes progression from body-mass index, and what is the slope?",charts:[{type:"scatter",title:"Least-squares fit: BMI to disease progression (442 patients)",xlabel:"BMI (standardized)",ylabel:"disease progression",groups:[{name:"patients",color:"#4ea1ff",points:[[0.044,129.0],[-0.029,179.0],[0.078,233.0],[-0.047,72.0],[-0.008,31.0],[-0.085,90.0],[0.011,276.0],[-0.056,39.0],[-0.063,65.0],[-0.076,134.0],[0.03,222.0],[-0.008,131.0],[-0.026,252.0],[0.11,258.0],[0.062,242.0],[-0.019,214.0],[0.042,166.0],[0.039,310.0],[-0.042,103.0],[0.093,200.0],[-0.047,138.0],[-0.031,154.0],[-0.013,91.0],[0.056,303.0],[-0.022,156.0],[0.014,297.0],[-0.032,78.0],[0.044,141.0],[-0.07,48.0],[0.002,123.0],[0.025,182.0],[-0.026,118.0],[-0.051,75.0],[-0.019,219.0],[0.081,180.0],[0.002,85.0],[0.001,258.0],[0.007,182.0],[0.01,151.0],[0.171,242.0],[0.0,259.0],[0.006,138.0],[-0.031,172.0],[-0.025,89.0],[-0.012,206.0],[-0.062,115.0],[-0.016,104.0],[-0.036,102.0],[0.071,220.0],[0.046,202.0]]}],lines:[{name:"fit",color:"#ffb454",points:[[-0.09,66.423],[0.171,314.065]]}]}],caption:"Yes, with scatter. The line recovers a positive BMI slope of 949.435 (intercept 152.133, R^2 = 0.3439) - higher BMI tracks worse progression.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression

# 442 real diabetes patients; predict progression from BMI
db = load_diabetes()
X = db.data[:, 2:3]                # BMI feature (standardized)
y = db.target
m = LinearRegression().fit(X, y)
print("slope", m.coef_[0], "intercept", m.intercept_)

xs = np.array([[X.min()], [X.max()]])
ys = m.predict(xs)

plt.scatter(X[:, 0], y, c="#4ea1ff", edgecolor="k", label="patients")
plt.plot(xs[:, 0], ys, color="#ffb454", label="fit")
plt.xlabel("BMI (standardized)")
plt.ylabel("disease progression")
plt.title("Least-squares fit: BMI to progression")
plt.legend()
plt.show()`},
  "ml-likelihood": {question:"Of 569 real tumors, 212 are malignant. Which malignancy rate theta best explains that count?",charts:[{type:"line",title:"Log-likelihood vs assumed malignancy rate theta",xlabel:"theta (probability a tumor is malignant)",ylabel:"log-likelihood",series:[{name:"log L(theta)",color:"#c89bff",points:[[0.05,-653.407],[0.087,-549.146],[0.125,-488.512],[0.162,-448.529],[0.2,-420.863],[0.237,-401.57],[0.275,-388.494],[0.312,-380.354],[0.35,-376.352],[0.387,-375.988],[0.425,-378.96],[0.462,-385.11],[0.5,-394.401],[0.537,-406.901],[0.575,-422.79],[0.613,-442.374],[0.65,-466.112],[0.688,-494.68],[0.725,-529.057],[0.763,-570.703],[0.8,-621.876],[0.838,-686.291],[0.875,-770.669],[0.912,-889.106],[0.95,-1080.351]]}]}],caption:"The log-likelihood peaks at theta = 0.373 = 212/569, the observed malignant fraction in the breast-cancer data, which is the maximum-likelihood estimate.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer

# real data: count malignant tumors among all 569
bc = load_breast_cancer()
h = int((bc.target == 0).sum())    # malignant successes
n = len(bc.target)

def log_likelihood(theta):
    return h * np.log(theta) + (n - h) * np.log(1 - theta)

thetas = np.linspace(0.05, 0.95, 25)
ll = log_likelihood(thetas)

plt.plot(thetas, ll, color="#c89bff", label="log L(theta)")
plt.xlabel("theta (malignancy rate)")
plt.ylabel("log-likelihood")
plt.title("Log-likelihood vs malignancy rate theta")
plt.legend()
plt.show()`},
  "ml-logistic-regression": {question:"Using just mean radius and mean texture, where does logistic regression draw the line between malignant and benign?",charts:[{type:"scatter",title:"Logistic boundary on two real tumor features",xlabel:"mean radius",ylabel:"mean texture",groups:[{name:"malignant",color:"#ff7b72",points:[[20.73,31.12],[16.26,21.88],[19.81,22.15],[14.95,17.57],[13.71,20.83],[14.42,19.77],[17.75,28.03],[13.8,15.79],[14.25,21.72],[16.78,18.8],[15.1,22.02],[19.19,15.94],[17.46,39.28],[14.54,27.54],[20.34,21.51],[18.22,18.87],[20.94,23.56],[16.13,17.88],[15.46,11.89],[27.22,21.87],[15.7,20.31],[17.42,25.56],[21.37,15.1],[18.25,19.98],[15.12,16.68],[17.93,24.48],[14.58,21.53],[14.99,25.2]]},{name:"benign",color:"#7ee787",points:[[12.54,18.07],[14.26,18.17],[12.18,14.08],[12.07,13.44],[11.6,18.36],[12.42,15.04],[11.75,20.18],[11.43,17.31],[11.74,14.69],[11.89,21.17],[12.36,21.8],[13.47,14.06],[12.88,18.22],[11.75,17.56],[12.85,21.37],[14.58,13.66],[12.23,19.56],[10.51,23.09],[12.43,17.0],[13.59,21.84],[14.76,14.74],[12.39,17.48],[12.31,16.52],[14.87,20.21],[15.19,13.21],[12.75,16.7],[11.41,10.82],[9.667,18.49]]}],lines:[{name:"boundary",color:"#ffb454",points:[[6.981,57.023],[28.11,-44.904]]}]}],caption:"The fitted line splits the two real features at 0.891 accuracy: larger, coarser nuclei fall on the malignant side.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression

# two real, interpretable features of each tumor
bc = load_breast_cancer()
X = bc.data[:, [0, 1]]             # mean radius, mean texture
y = bc.target
clf = LogisticRegression(max_iter=5000).fit(X, y)
print("accuracy", clf.score(X, y))

# decision boundary: w0*x + w1*z + b = 0  ->  z = -(w0*x + b)/w1
w0, w1 = clf.coef_[0]
b = clf.intercept_[0]
xs = np.linspace(X[:, 0].min(), X[:, 0].max(), 50)
zs = -(w0 * xs + b) / w1

for label, color, name in [(0, "#ff7b72", "malignant"), (1, "#7ee787", "benign")]:
    pts = X[y == label]
    plt.scatter(pts[:, 0], pts[:, 1], c=color, label=name, edgecolor="k")
plt.plot(xs, zs, color="#ffb454", label="boundary")
plt.xlabel("mean radius")
plt.ylabel("mean texture")
plt.title("Logistic regression boundary")
plt.legend()
plt.show()`},
  "ml-softmax": {question:"Shown one real iris flower's four measurements, what probability does softmax give each of the three species?",charts:[{type:"bars",title:"Softmax species probabilities for one real iris",labels:["setosa","versicolor","virginica"],values:[0.056,0.938,0.006],colors:["#ffb454","#4ea1ff","#c89bff"]}],caption:"Softmax turns the three class scores into 0.056, 0.938, 0.006 - all positive and summing to 1; the flower is called versicolor.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

# 150 real flowers, 4 measurements, 3 species
iris = load_iris()
clf = LogisticRegression(max_iter=5000).fit(iris.data, iris.target)

# softmax probabilities for one real flower
probs = clf.predict_proba(iris.data[60:61])[0]

plt.bar(list(iris.target_names), probs,
        color=["#ffb454", "#4ea1ff", "#c89bff"])
plt.ylabel("probability")
plt.title("Softmax species probabilities for one iris")
plt.show()`},
  "ml-glm": {question:"Diabetes progression is a non-negative count-like target. Does a Poisson GLM (log link) bend with it better than a straight line?",charts:[{type:"scatter",title:"Poisson GLM vs linear fit: BMI to diabetes progression",xlabel:"BMI (shifted to start at 0)",ylabel:"disease progression",groups:[{name:"patients",color:"#4ea1ff",points:[[0.052,253.0],[0.116,52.0],[0.061,179.0],[0.044,47.0],[0.133,166.0],[0.066,89.0],[0.039,75.0],[0.0,94.0],[0.079,94.0],[0.095,107.0],[0.121,172.0],[0.129,310.0],[0.009,51.0],[0.121,244.0],[0.152,242.0],[0.101,276.0],[0.058,53.0],[0.095,200.0],[0.167,332.0],[0.079,206.0],[0.074,53.0],[0.097,109.0],[0.088,185.0],[0.097,277.0],[0.16,277.0],[0.078,160.0],[0.044,178.0],[0.043,138.0],[0.088,109.0],[0.081,60.0],[0.084,262.0],[0.092,196.0],[0.034,109.0],[0.045,90.0],[0.15,268.0],[0.074,104.0],[0.051,78.0],[0.025,153.0],[0.034,39.0],[0.183,200.0],[0.084,164.0],[0.168,233.0],[0.07,111.0],[0.136,272.0],[0.084,283.0],[0.162,295.0],[0.06,108.0],[0.111,246.0],[0.043,72.0],[0.135,141.0],[0.066,58.0],[0.179,264.0],[0.027,65.0],[0.105,297.0],[0.074,132.0]]}],lines:[{name:"Poisson (log link)",color:"#7ee787",points:[[0.0,86.865],[0.009,91.49],[0.018,96.362],[0.027,101.493],[0.036,106.897],[0.045,112.589],[0.054,118.584],[0.063,124.899],[0.072,131.549],[0.081,138.554],[0.09,145.932],[0.099,153.702],[0.108,161.886],[0.117,170.507],[0.126,179.586],[0.135,189.148],[0.144,199.22],[0.153,209.828],[0.162,221.001],[0.171,232.769],[0.18,245.163],[0.189,258.217],[0.198,271.967],[0.207,286.448],[0.216,301.701],[0.225,317.766],[0.234,334.686],[0.243,352.508],[0.252,371.278],[0.261,391.048]]},{name:"linear",color:"#ff7b72",points:[[0.0,66.423],[0.009,74.962],[0.018,83.502],[0.027,92.041],[0.036,100.58],[0.045,109.12],[0.054,117.659],[0.063,126.199],[0.072,134.738],[0.081,143.277],[0.09,151.817],[0.099,160.356],[0.108,168.895],[0.117,177.435],[0.126,185.974],[0.135,194.513],[0.144,203.053],[0.153,211.592],[0.162,220.132],[0.171,228.671],[0.18,237.21],[0.189,245.75],[0.198,254.289],[0.207,262.828],[0.216,271.368],[0.225,279.907],[0.234,288.447],[0.243,296.986],[0.252,305.525],[0.261,314.065]]}]}],caption:"The Poisson curve (coef 5.768) bends upward with the exponential mean and stays positive, while the straight line can dip below zero.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.linear_model import PoissonRegressor, LinearRegression

# real diabetes data; progression treated as a non-negative count
db = load_diabetes()
x = db.data[:, 2:3]
x = x - x.min()                    # shift BMI to start at 0
y = db.target.astype(int)

glm = PoissonRegressor(alpha=0.0, max_iter=2000).fit(x, y)   # log link
lin = LinearRegression().fit(x, y)

xs = np.linspace(x.min(), x.max(), 30).reshape(-1, 1)
plt.scatter(x[:, 0], y, c="#4ea1ff", edgecolor="k", label="patients")
plt.plot(xs[:, 0], glm.predict(xs), color="#7ee787", label="Poisson (log link)")
plt.plot(xs[:, 0], lin.predict(xs), color="#ff7b72", label="linear")
plt.xlabel("BMI (shifted)")
plt.ylabel("disease progression")
plt.title("Poisson GLM vs linear fit")
plt.legend()
plt.show()`},
  "ml-svm": {question:"On two real tumor features, can a linear SVM find the widest gap between malignant and benign?",charts:[{type:"scatter",title:"Linear SVM boundary on standardized tumor features",xlabel:"mean radius (standardized)",ylabel:"mean texture (standardized)",groups:[{name:"malignant",color:"#ff7b72",points:[[1.114,-0.731],[1.801,0.321],[0.026,0.891],[0.663,0.191],[2.58,1.787],[0.978,-0.987],[1.637,0.226],[-0.411,1.059],[1.935,0.994],[1.097,-2.073],[1.319,0.498],[0.31,2.637],[0.609,0.331],[1.461,1.671],[0.603,0.051],[-0.474,1.105],[1.713,0.086],[1.608,1.357],[0.018,1.052],[1.719,1.089],[1.836,0.454],[0.234,-0.4],[0.538,0.919],[1.75,-1.152],[0.915,0.877],[-0.241,0.23],[1.231,-0.179],[0.949,1.254]]},{name:"benign",color:"#7ee787",points:[[-0.718,1.21],[-0.826,3.379],[-0.474,-1.503],[0.237,-0.044],[-0.786,-0.4],[-1.098,-0.631],[-0.241,-1.296],[-1.532,-0.57],[-0.545,-1.21],[-1.448,-0.456],[-1.101,-0.724],[-0.897,-0.486],[-0.851,0.733],[1.057,-1.41],[-0.735,-1.129],[0.038,-0.261],[-0.746,-0.195],[-0.905,-0.163],[-1.09,1.936],[-0.633,-1.08],[-0.354,-0.249],[-0.351,-1.205],[-0.826,0.133],[-1.295,-0.786],[-0.312,-0.202],[-1.236,-0.535],[0.617,-0.835],[0.572,-1.031]]}],lines:[{name:"max-margin boundary",color:"#ffb454",points:[[-2.03,8.589],[3.971,-14.264]]}]}],caption:"Yes. The max-margin line separates the two real features at 0.889 accuracy using 157 support vectors on the margin.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data[:, [0, 1]])   # radius, texture
y = bc.target
clf = SVC(kernel="linear", C=1.0).fit(X, y)
print("support vectors", clf.support_.size)

w0, w1 = clf.coef_[0]
b = clf.intercept_[0]
xs = np.linspace(X[:, 0].min(), X[:, 0].max(), 50)
zs = -(w0 * xs + b) / w1

for label, color, name in [(0, "#ff7b72", "malignant"), (1, "#7ee787", "benign")]:
    pts = X[y == label]
    plt.scatter(pts[:, 0], pts[:, 1], c=color, label=name, edgecolor="k")
plt.plot(xs, zs, color="#ffb454", label="max-margin boundary")
plt.xlabel("mean radius (standardized)")
plt.ylabel("mean texture (standardized)")
plt.title("Linear SVM boundary")
plt.legend()
plt.show()`},
  "ml-kernels": {question:"On the full 30-feature breast-cancer data, does an RBF kernel beat a plain linear SVM?",charts:[{type:"scatter",title:"569 tumors in 2 PCA views (real classes)",xlabel:"PCA component 1",ylabel:"PCA component 2",groups:[{name:"malignant",color:"#ff7b72",points:[[7.183,0.055],[4.809,-3.029],[3.288,-1.668],[1.428,-1.967],[5.035,0.774],[7.236,-0.036],[-0.81,-2.659],[-0.39,-0.989],[2.763,-1.079],[1.803,0.166],[2.776,0.558],[11.669,4.749],[3.712,-2.807],[3.064,-1.877],[3.766,5.985],[3.303,-1.131],[3.519,-3.859],[10.934,-3.703],[4.149,0.767],[2.611,1.561],[1.715,-1.524],[2.735,-3.945],[0.851,-2.307],[4.442,-0.992],[6.439,-3.577],[7.248,-3.655],[0.759,-1.609],[2.388,-3.768]]},{name:"benign",color:"#7ee787",points:[[-2.386,2.758],[-2.894,-0.978],[-1.774,0.804],[7.093,12.573],[-2.116,1.849],[-3.368,-0.563],[-2.012,-1.103],[-2.551,0.228],[-1.325,1.469],[-4.871,-2.339],[-1.992,1.329],[-0.687,1.695],[-0.826,-1.25],[-1.077,1.804],[-3.315,-1.442],[-2.836,-0.399],[-0.771,-0.064],[-2.301,-0.932],[-3.639,1.59],[-2.059,0.32],[-3.194,-1.849],[-0.056,-0.227],[-2.976,1.811],[-3.996,0.96],[-2.786,2.311],[1.012,1.092],[-5.352,1.027],[-0.412,-0.39]]}]},{type:"bars",title:"Test accuracy: linear vs RBF kernel",labels:["linear kernel","RBF kernel"],values:[0.972,0.965],colors:["#4ea1ff","#7ee787"]}],caption:"On real tumor data both kernels do well: the linear SVM scores 0.972 and the RBF kernel 0.965 by bending the boundary in 30-D.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
y = bc.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
P = PCA(n_components=2, random_state=0).fit_transform(X)
for label, color, name in [(0, "#ff7b72", "malignant"), (1, "#7ee787", "benign")]:
    pts = P[y == label]
    ax1.scatter(pts[:, 0], pts[:, 1], c=color, label=name, edgecolor="k")
ax1.set_xlabel("PCA component 1")
ax1.set_ylabel("PCA component 2")
ax1.set_title("Breast-cancer tumors in 2-D")
ax1.legend()

lin = SVC(kernel="linear").fit(Xtr, ytr).score(Xte, yte)
rbf = SVC(kernel="rbf", gamma="scale").fit(Xtr, ytr).score(Xte, yte)
ax2.bar(["linear kernel", "RBF kernel"], [lin, rbf], color=["#4ea1ff", "#7ee787"])
ax2.set_title("Test accuracy: linear vs RBF")
plt.show()`},
  "ml-gda": {question:"Modeling each tumor class as a Gaussian: does shared (LDA) or per-class (QDA) covariance classify breast-cancer better?",charts:[{type:"scatter",title:"Two tumor classes (2 PCA views)",xlabel:"PCA component 1",ylabel:"PCA component 2",groups:[{name:"malignant",color:"#ff7b72",points:[[3.475,-1.673],[2.735,-3.945],[2.38,3.95],[1.428,-1.967],[1.786,-0.269],[8.631,-3.459],[4.704,-0.196],[1.353,-1.154],[6.004,-0.091],[4.442,-0.992],[2.79,3.386],[5.734,-1.075],[4.549,-0.816],[3.712,-2.807],[4.95,-1.544],[3.245,-1.778],[0.982,-2.21],[2.388,-3.768],[4.944,-2.848],[0.337,-3.144],[3.785,-1.902],[2.611,1.561],[1.835,-4.322],[0.342,-0.968],[-0.947,-1.685],[6.62,-6.003],[2.985,0.758],[7.144,-2.075]]},{name:"benign",color:"#7ee787",points:[[-2.926,0.377],[1.37,2.11],[-2.125,-1.195],[-3.068,1.136],[-3.557,1.663],[-1.249,-1.589],[-3.143,-1.877],[-3.146,-0.743],[-2.684,1.444],[-0.2,1.076],[-2.471,-0.138],[-0.771,-0.064],[-2.51,3.251],[-1.42,1.394],[-1.665,2.39],[-4.139,-1.377],[-1.077,1.804],[-1.143,5.599],[-4.064,-1.246],[-1.81,0.396],[-2.985,-0.673],[-2.203,1.286],[-2.836,-1.018],[-3.484,1.62],[1.323,4.789],[7.093,12.573],[1.167,2.515],[-2.224,-0.357]]}]},{type:"bars",title:"Test accuracy: LDA vs QDA",labels:["LDA shared cov","QDA per-class cov"],values:[0.972,0.958],colors:["#4ea1ff","#c89bff"]}],caption:"Both fit bell curves per diagnosis; on the breast-cancer test set LDA scores 0.972 and QDA 0.958.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import (
    LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis)
from sklearn.model_selection import train_test_split

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
y = bc.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
P = PCA(n_components=2, random_state=0).fit_transform(X)
for label, color, name in [(0, "#ff7b72", "malignant"), (1, "#7ee787", "benign")]:
    pts = P[y == label]
    ax1.scatter(pts[:, 0], pts[:, 1], c=color, label=name, edgecolor="k")
ax1.set_xlabel("PCA component 1")
ax1.set_ylabel("PCA component 2")
ax1.set_title("Two tumor classes")
ax1.legend()

lda = LinearDiscriminantAnalysis().fit(Xtr, ytr).score(Xte, yte)
qda = QuadraticDiscriminantAnalysis().fit(Xtr, ytr).score(Xte, yte)
ax2.bar(["LDA", "QDA"], [lda, qda], color=["#4ea1ff", "#c89bff"])
ax2.set_title("Test accuracy: LDA vs QDA")
plt.show()`},
  "ml-naive-bayes": {question:"Assuming the 30 tumor features are independent given the diagnosis, how confidently does naive Bayes classify real tumors?",charts:[{type:"scatter",title:"Breast-cancer tumors (2 PCA views)",xlabel:"PCA component 1",ylabel:"PCA component 2",groups:[{name:"malignant",color:"#ff7b72",points:[[2.472,-1.5],[0.342,-0.968],[3.064,-1.877],[2.251,-0.349],[4.549,-0.816],[3.288,-1.668],[-0.223,-0.702],[2.38,3.95],[3.372,2.588],[3.104,-1.236],[-1.909,-3.122],[3.793,-3.584],[1.835,-4.322],[3.51,2.172],[0.447,-2.788],[-0.742,-2.452],[7.676,-3.075],[9.513,-5.603],[4.991,-1.133],[2.227,1.942],[1.432,-1.05],[2.171,-2.826],[4.007,0.537],[4.944,-2.848],[1.314,-1.775],[2.902,4.005],[9.007,0.581],[4.555,3.087]]},{name:"benign",color:"#7ee787",points:[[-3.194,-1.849],[-1.443,0.306],[-1.237,-0.188],[-4.659,-0.223],[-3.895,0.539],[-0.749,1.798],[-0.78,-2.124],[-0.86,0.097],[-2.116,1.849],[-2.473,-0.335],[-2.001,-0.293],[-0.733,3.702],[0.347,1.541],[-3.357,-1.104],[-1.167,-1.666],[-4.038,-0.241],[-2.334,0.79],[-3.765,4.398],[-1.929,1.461],[-2.63,-0.697],[-1.655,-4.556],[-0.709,-1.568],[-2.136,-0.004],[-2.969,-0.069],[-2.125,-1.195],[-2.456,0.898],[-2.997,-2.739],[-4.478,-1.741]]}]},{type:"bars",title:"Predicted P(benign) for 3 real test tumors",labels:["tumor 1","tumor 2","tumor 3"],values:[0.0,1.0,1.0],colors:["#ffb454","#ffb454","#ffb454"]}],caption:"Multiplying per-feature Gaussians gives 0.937 test accuracy and confident per-tumor benign probabilities.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split

bc = load_breast_cancer()
X, y = bc.data, bc.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)
nb = GaussianNB().fit(Xtr, ytr)
print("accuracy", nb.score(Xte, yte))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
P = PCA(n_components=2, random_state=0).fit_transform(StandardScaler().fit_transform(X))
for label, color, name in [(0, "#ff7b72", "malignant"), (1, "#7ee787", "benign")]:
    pts = P[y == label]
    ax1.scatter(pts[:, 0], pts[:, 1], c=color, label=name, edgecolor="k")
ax1.set_xlabel("PCA component 1")
ax1.set_ylabel("PCA component 2")
ax1.set_title("Breast-cancer tumors")
ax1.legend()

p1 = nb.predict_proba(Xte[:3])[:, 1]   # P(benign) for 3 real tumors
ax2.bar(["tumor 1", "tumor 2", "tumor 3"], p1, color="#ffb454")
ax2.set_title("Predicted P(benign)")
plt.show()`},
  "ml-trees": {question:"Which of the 30 tumor measurements does a decision tree rely on most to call malignant vs benign?",charts:[{type:"bars",title:"Decision-tree feature importances (breast cancer)",labels:["mean concave points","worst area","worst texture","perimeter error","area error"],values:[0.765,0.124,0.054,0.021,0.018],colors:["#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff"]}],caption:"The tree leans hardest on 'mean concave points' (test accuracy 0.937); importances sum to 1 across all splits.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

bc = load_breast_cancer()
Xtr, Xte, ytr, yte = train_test_split(bc.data, bc.target, test_size=0.25, random_state=0)

tree = DecisionTreeClassifier(max_depth=3, random_state=0).fit(Xtr, ytr)
imp = tree.feature_importances_          # impurity reduction per feature
order = np.argsort(imp)[::-1][:5]        # top 5 features

plt.bar([bc.feature_names[i] for i in order], imp[order], color="#4ea1ff")
plt.xticks(rotation=30, ha="right")
plt.ylabel("importance")
plt.title("Decision-tree feature importances")
plt.tight_layout()
plt.show()`},
  "ml-ensembles": {question:"On breast-cancer data, does combining many trees beat a single decision tree?",charts:[{type:"bars",title:"Test accuracy: single tree vs ensembles (breast cancer)",labels:["single tree","random forest","boosting"],values:[0.881,0.972,0.965],colors:["#ff7b72","#7ee787","#ffb454"]}],caption:"Yes. One tree scores 0.881, while the random forest (0.972) and gradient boosting (0.965) combine many trees to do better.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split

bc = load_breast_cancer()
Xtr, Xte, ytr, yte = train_test_split(bc.data, bc.target, test_size=0.25, random_state=0)

tree = DecisionTreeClassifier(random_state=0).fit(Xtr, ytr).score(Xte, yte)
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(Xtr, ytr).score(Xte, yte)
gb = GradientBoostingClassifier(random_state=0).fit(Xtr, ytr).score(Xte, yte)

plt.bar(["single tree", "random forest", "boosting"], [tree, rf, gb],
        color=["#ff7b72", "#7ee787", "#ffb454"])
plt.ylabel("test accuracy")
plt.title("Single tree vs ensembles")
plt.show()`},
  "ml-knn": {question:"On breast-cancer data, how many neighbors k gives the best accuracy - too few overfits, too many oversmooths?",charts:[{type:"line",title:"kNN test accuracy vs number of neighbors k (breast cancer)",xlabel:"k (neighbors)",ylabel:"test accuracy",series:[{name:"test accuracy",color:"#4ea1ff",points:[[1.0,0.951],[3.0,0.944],[5.0,0.951],[9.0,0.951],[15.0,0.965],[25.0,0.951]]}]}],caption:"Accuracy rises then plateaus as k grows on real tumor data; very small k is jittery and mid-range k gives the steadiest fit.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

bc = load_breast_cancer()
Xtr, Xte, ytr, yte = train_test_split(bc.data, bc.target, test_size=0.25, random_state=0)

ks, acc = [1, 3, 5, 9, 15, 25], []
for k in ks:
    knn = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k))
    knn.fit(Xtr, ytr)
    acc.append(knn.score(Xte, yte))

plt.plot(ks, acc, color="#4ea1ff", marker="o", label="test accuracy")
plt.xlabel("k (neighbors)")
plt.ylabel("test accuracy")
plt.title("kNN accuracy vs k")
plt.legend()
plt.show()`},
  "ml-bias-variance": {question:"Fitting diabetes progression from BMI with growing polynomial degree, where is the sweet spot between underfitting and overfitting?",charts:[{type:"line",title:"Train vs test error over polynomial degree (diabetes BMI)",xlabel:"polynomial degree",ylabel:"mean squared error",series:[{name:"train MSE",color:"#4ea1ff",points:[[1.0,3892.7],[2.0,3892.7],[3.0,3878.8],[5.0,3863.4],[7.0,3826.3],[9.0,3819.8],[12.0,3809.6],[15.0,3788.3]]},{name:"test MSE",color:"#ff7b72",points:[[1.0,3921.4],[2.0,3922.1],[3.0,3937.5],[5.0,3894.4],[7.0,3999.3],[9.0,3941.2],[12.0,4134.1],[15.0,5400.3]]}]}],caption:"Train error keeps falling but test error dips then climbs - the U-curve bottoms out at low degree, the bias-variance sweet spot on real diabetes data.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

db = load_diabetes()
x = db.data[:, 2:3]                # BMI
y = db.target
Xtr, Xte, ytr, yte = train_test_split(x, y, test_size=0.3, random_state=0)

degrees = [1, 2, 3, 5, 7, 9, 12, 15]
tr, te = [], []
for d in degrees:
    m = make_pipeline(PolynomialFeatures(d), StandardScaler(),
                      LinearRegression()).fit(Xtr, ytr)
    tr.append(mean_squared_error(ytr, m.predict(Xtr)))
    te.append(mean_squared_error(yte, m.predict(Xte)))

plt.plot(degrees, tr, color="#4ea1ff", marker="o", label="train MSE")
plt.plot(degrees, te, color="#ff7b72", marker="o", label="test MSE")
plt.xlabel("polynomial degree")
plt.ylabel("mean squared error")
plt.title("Train vs test error")
plt.legend()
plt.show()`},
  "ml-learning-theory": {question:"On breast-cancer data, does adding more training examples close the gap between training and validation accuracy?",charts:[{type:"line",title:"Learning curve: accuracy vs training-set size (breast cancer)",xlabel:"training examples",ylabel:"accuracy",series:[{name:"train accuracy",color:"#4ea1ff",points:[[45.0,1.0],[136.0,0.987],[273.0,0.985],[455.0,0.989]]},{name:"validation accuracy",color:"#7ee787",points:[[45.0,0.775],[136.0,0.949],[273.0,0.967],[455.0,0.981]]}]}],caption:"Yes. As training size grows the train and validation curves converge on real tumor data - more data shrinks the generalization gap.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import learning_curve

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
y = bc.target

sizes, train_sc, val_sc = learning_curve(
    LogisticRegression(max_iter=5000), X, y,
    train_sizes=[0.1, 0.3, 0.6, 1.0], cv=5)

plt.plot(sizes, train_sc.mean(1), color="#4ea1ff", marker="o", label="train accuracy")
plt.plot(sizes, val_sc.mean(1), color="#7ee787", marker="o", label="validation accuracy")
plt.xlabel("training examples")
plt.ylabel("accuracy")
plt.title("Learning curve")
plt.legend()
plt.show()`},
  "ml-kmeans": {question:"The wine dataset has 178 wines from 3 cultivars. Can k-means rediscover the groups from the chemistry alone?",charts:[{type:"scatter",title:"k-means clusters (k=3) on wine chemistry, PCA view",xlabel:"PCA component 1",ylabel:"PCA component 2",groups:[{name:"cluster A",color:"#4ea1ff",points:[[-1.115,-1.802],[-1.177,-0.664],[-0.551,-2.222],[-0.366,-2.169],[0.031,-1.263],[-0.462,-0.618],[1.578,-1.462],[-0.457,-2.269],[-1.349,-2.118],[-0.097,-2.11],[0.74,-1.409],[-1.542,-1.381],[0.376,-1.027],[-1.772,-1.717],[-0.66,-2.68],[-0.495,-2.381],[-0.725,-1.064],[-0.253,-2.821],[1.41,-2.166],[-0.161,-1.164],[-0.61,-1.908],[0.482,-3.872]]},{name:"cluster B",color:"#7ee787",points:[[1.645,-0.516],[2.113,0.676],[1.087,0.242],[1.009,0.87],[2.305,1.663],[2.225,1.875],[2.172,2.327],[1.336,0.253],[1.41,0.698],[2.544,0.169],[1.899,1.631],[2.252,-1.433],[1.629,0.053],[2.821,0.646],[3.458,1.131],[2.174,1.212],[1.235,-0.09],[2.449,1.175],[2.469,1.329],[3.506,1.613],[2.742,1.437],[0.668,0.17]]},{name:"cluster C",color:"#c89bff",points:[[-2.287,0.373],[-2.949,1.555],[-3.916,0.155],[-2.539,-0.087],[-2.55,2.045],[-3.212,-0.251],[-2.807,1.571],[-2.986,0.489],[-2.321,2.356],[-2.597,0.698],[-1.048,3.515],[-1.61,2.407],[-2.37,-0.46],[-3.605,1.802],[-3.064,0.353],[-3.371,2.216],[-2.385,0.375],[-2.466,2.194],[-2.626,0.563],[-3.094,0.349],[-2.374,0.292],[-2.929,1.274]]},{name:"centroids",color:"#ffb454",points:[[-0.163,-1.768],[2.266,0.866],[-2.744,1.214]]}]},{type:"line",title:"Elbow: inertia vs number of clusters k",xlabel:"k (clusters)",ylabel:"inertia",series:[{name:"inertia",color:"#ffb454",points:[[1.0,1282.1],[2.0,628.8],[3.0,259.5],[4.0,192.4],[5.0,155.1]]}]}],caption:"Three tight clusters emerge from the 13 chemical features; the elbow bends at k=3, matching the three real cultivars.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

# 178 real wines, 13 chemical measurements each
wine = load_wine()
X = StandardScaler().fit_transform(wine.data)
P = PCA(n_components=2, random_state=0).fit_transform(X)
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(P)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
colors = ["#4ea1ff", "#7ee787", "#c89bff"]
for c in range(3):
    pts = P[km.labels_ == c]
    ax1.scatter(pts[:, 0], pts[:, 1], c=colors[c], edgecolor="k")
cen = km.cluster_centers_
ax1.scatter(cen[:, 0], cen[:, 1], c="#ffb454", marker="X", s=200,
            edgecolor="k", label="centroids")
ax1.set_xlabel("PCA component 1")
ax1.set_ylabel("PCA component 2")
ax1.set_title("k-means on wine chemistry")
ax1.legend()

ks = [1, 2, 3, 4, 5]
inertia = [KMeans(n_clusters=k, n_init=10, random_state=0).fit(P).inertia_ for k in ks]
ax2.plot(ks, inertia, color="#ffb454", marker="o", label="inertia")
ax2.set_xlabel("k (clusters)")
ax2.set_ylabel("inertia")
ax2.set_title("Elbow plot")
ax2.legend()
plt.show()`},
  "ml-em": {question:"Can a Gaussian mixture softly assign each real wine to one of three overlapping cultivar groups?",charts:[{type:"scatter",title:"GMM soft clusters (EM, 3 components) on wine, PCA view",xlabel:"PCA component 1",ylabel:"PCA component 2",groups:[{name:"component 1",color:"#4ea1ff",points:[[0.083,-2.306],[-0.55,-2.293],[2.05,-1.925],[-0.929,-3.073],[-1.793,-1.15],[0.9,-0.764],[1.035,-1.451],[-1.572,-0.885],[1.976,-1.403],[2.252,-1.433],[-0.813,-0.221],[-0.725,-1.064],[-1.772,-1.717],[-0.457,-2.269],[0.747,-2.313],[0.762,-3.375],[-1.457,-1.383],[-1.303,-0.763],[-0.807,-2.234],[1.578,-1.462],[0.376,-1.027],[0.957,-2.224]]},{name:"component 2",color:"#7ee787",points:[[-2.385,0.375],[-3.936,0.66],[-2.986,0.489],[-4.281,0.65],[-2.55,2.045],[-3.678,0.848],[-3.209,2.769],[-2.406,2.592],[-3.371,2.216],[-2.21,1.16],[-2.181,2.078],[-2.24,1.175],[-2.375,0.482],[-2.737,0.41],[-2.848,0.556],[-3.583,1.273],[-2.937,0.264],[-1.048,3.515],[-2.381,2.589],[-3.605,1.802],[-2.387,2.297],[-3.392,1.312]]},{name:"component 3",color:"#c89bff",points:[[3.071,1.156],[0.99,0.941],[1.235,-0.09],[1.41,0.698],[1.629,0.053],[1.336,0.253],[1.385,0.659],[2.01,1.247],[3.506,1.613],[1.502,-0.769],[2.085,1.061],[0.668,0.17],[2.305,1.663],[2.449,1.175],[2.677,1.472],[3.458,1.131],[1.122,0.114],[1.899,1.631],[2.544,0.169],[3.542,2.518],[3.215,0.167],[2.147,1.017]]}]}],caption:"Yes. EM fits three Gaussian components to the wine chemistry with mixture weights [0.38, 0.269, 0.351], each wine getting a probability per group.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.mixture import GaussianMixture

wine = load_wine()
X = StandardScaler().fit_transform(wine.data)
P = PCA(n_components=2, random_state=0).fit_transform(X)

gmm = GaussianMixture(n_components=3, random_state=0).fit(P)
labels = gmm.predict(P)            # hard label = argmax of soft probs
print("mixture weights", gmm.weights_)

colors = ["#4ea1ff", "#7ee787", "#c89bff"]
for c in range(3):
    pts = P[labels == c]
    plt.scatter(pts[:, 0], pts[:, 1], c=colors[c], edgecolor="k",
                label="component %d" % (c + 1))
plt.xlabel("PCA component 1")
plt.ylabel("PCA component 2")
plt.title("GMM soft clusters on wine")
plt.legend()
plt.show()`},
  "ml-hierarchical": {question:"Merging nearest wines bottom-up - which linkage best recovers the three real cultivars?",charts:[{type:"scatter",title:"Agglomerative clusters (ward, k=3) on wine, PCA view",xlabel:"PCA component 1",ylabel:"PCA component 2",groups:[{name:"cluster A",color:"#4ea1ff",points:[[-0.556,-2.658],[0.031,-1.263],[-1.597,-1.208],[0.038,-1.267],[0.762,-3.375],[-0.462,-0.618],[1.421,-1.418],[0.798,-2.377],[-0.494,-1.939],[-0.544,-0.369],[-1.793,-1.15],[1.578,-1.462],[1.035,-1.451],[0.482,-3.872],[-0.097,-2.11],[-0.253,-2.821],[-0.807,-2.234],[-0.279,-1.931],[-0.66,-2.68],[-1.836,-0.83],[-0.929,-3.073],[0.9,-0.764]]},{name:"cluster B",color:"#7ee787",points:[[-2.737,0.41],[-3.605,1.802],[-2.937,0.264],[-2.89,1.925],[-2.949,1.555],[-2.55,2.045],[-2.37,-0.46],[-2.375,0.482],[-2.21,1.16],[-2.321,2.356],[-3.916,0.155],[-2.387,2.297],[-2.181,2.078],[-3.143,0.738],[-2.678,2.761],[-2.76,2.139],[-3.53,0.883],[-3.583,1.273],[-3.094,0.349],[-2.287,0.373],[-1.813,1.528],[-1.048,3.515]]},{name:"cluster C",color:"#c89bff",points:[[2.535,-0.092],[2.059,1.609],[2.707,1.752],[1.009,0.87],[3.542,2.518],[3.215,0.167],[2.53,1.803],[1.775,0.686],[3.757,2.756],[2.5,1.241],[2.188,0.69],[2.677,1.472],[1.235,-0.09],[2.147,1.017],[2.727,1.191],[2.754,0.789],[0.668,0.17],[1.629,0.053],[3.506,1.613],[2.101,-0.071],[2.562,0.26],[2.085,1.061]]}]},{type:"bars",title:"Cluster quality (ARI vs true cultivar) by linkage",labels:["ward","average","complete"],values:[0.896,0.769,0.658],colors:["#7ee787","#ffb454","#4ea1ff"]}],caption:"Bottom-up merging of the wine chemistry recovers three clusters; ward linkage matches the true cultivars best (ARI 0.896).",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import adjusted_rand_score

wine = load_wine()
X = StandardScaler().fit_transform(wine.data)
P = PCA(n_components=2, random_state=0).fit_transform(X)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
labels = AgglomerativeClustering(n_clusters=3, linkage="ward").fit_predict(P)
colors = ["#4ea1ff", "#7ee787", "#c89bff"]
for c in range(3):
    pts = P[labels == c]
    ax1.scatter(pts[:, 0], pts[:, 1], c=colors[c], edgecolor="k")
ax1.set_xlabel("PCA component 1")
ax1.set_ylabel("PCA component 2")
ax1.set_title("Agglomerative clusters (ward)")

links = ["ward", "average", "complete"]
aris = [adjusted_rand_score(
    wine.target,
    AgglomerativeClustering(n_clusters=3, linkage=l).fit_predict(P)) for l in links]
ax2.bar(links, aris, color=["#7ee787", "#ffb454", "#4ea1ff"])
ax2.set_title("Cluster quality by linkage")
plt.show()`},
  "ml-pca": {question:"Handwritten digits live in 64 pixels. What 2 directions capture the most spread, and how much variance do they keep?",charts:[{type:"scatter",title:"Digit images projected to top 2 principal components",xlabel:"PC 1",ylabel:"PC 2",groups:[{name:"digit 0",color:"#4ea1ff",points:[[-1.274,-2.238],[-1.223,-2.255],[-2.748,-1.872],[-1.344,-1.587],[-0.701,-1.953],[-2.582,-0.633],[-0.748,-3.043],[-3.193,-0.291],[-2.855,-0.542],[-2.919,-2.252],[-1.23,-3.092],[-2.002,-1.32],[-1.421,-2.539],[-1.171,1.187],[-1.612,-3.317],[-2.252,-0.968],[-1.497,-2.971],[-1.434,-2.776],[-0.963,-3.068],[0.662,-3.638],[-2.0,-1.328],[-1.413,0.169],[-1.982,-1.421],[-0.798,-2.835],[-1.316,-1.975],[-0.53,-3.569],[-3.555,-2.158],[-0.777,-2.296],[-1.009,-3.326],[-0.99,-3.739]]},{name:"digit 1",color:"#7ee787",points:[[-1.752,1.049],[0.657,-0.034],[-2.688,1.205],[-2.268,0.986],[-0.003,0.288],[-1.125,0.415],[-0.602,1.29],[-2.505,2.052],[0.035,0.999],[0.092,0.123],[-1.951,1.234],[0.101,1.338],[-1.573,1.547],[2.35,-2.741],[-2.177,0.459],[-1.567,0.325],[0.596,0.586],[-0.613,0.946],[0.032,0.694],[-1.99,1.366],[0.579,1.077],[0.59,1.593],[-1.015,-0.418],[0.133,2.081],[-1.368,1.381],[0.809,-4.711],[-1.355,1.227],[1.439,-2.48],[0.623,1.383],[-0.102,0.545]]}]},{type:"bars",title:"Variance explained per principal component",labels:["PC1","PC2","PC3","PC4","PC5","PC6","PC7","PC8"],values:[0.12,0.096,0.084,0.065,0.049,0.042,0.039,0.034],colors:["#ffb454","#ffb454","#ffb454","#ffb454","#ffb454","#ffb454","#ffb454","#ffb454"]}],caption:"The top two of 64 directions already pull digits 0 and 1 apart, capturing about 0.216 of the total pixel variance combined.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# 1797 real 8x8 handwritten digit images, 64 pixels each
digits = load_digits()
X = StandardScaler().fit_transform(digits.data)
y = digits.target
pca = PCA(n_components=10, random_state=0).fit(X)
P = pca.transform(X)[:, :2]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
for label, color, name in [(0, "#4ea1ff", "digit 0"), (1, "#7ee787", "digit 1")]:
    pts = P[y == label]
    ax1.scatter(pts[:, 0], pts[:, 1], c=color, label=name, edgecolor="k")
ax1.set_xlabel("PC 1")
ax1.set_ylabel("PC 2")
ax1.set_title("Digits projected to 2-D")
ax1.legend()

ratio = pca.explained_variance_ratio_[:8]
ax2.bar(["PC%d" % (i + 1) for i in range(8)], ratio, color="#ffb454")
ax2.set_title("Variance explained per component")
plt.show()`},
  "ml-ica": {question:"From two blended digit-image intensity signals, can ICA recover the original independent sources?",charts:[{type:"line",title:"ICA: a mixture and the two recovered sources (digit pixels)",xlabel:"pixel index (0..63)",ylabel:"intensity (scaled)",series:[{name:"mixture",color:"#ff7b72",points:[[0.0,-0.553],[1.0,-0.504],[2.0,0.23],[3.0,0.914],[4.0,0.954],[5.0,0.227],[6.0,-0.477],[7.0,-0.553],[8.0,-0.551],[9.0,-0.185],[10.0,0.846],[11.0,0.567],[12.0,0.62],[13.0,0.772],[14.0,-0.298],[15.0,-0.552],[16.0,-0.552],[17.0,-0.271],[18.0,0.224],[19.0,-0.006],[20.0,0.604],[21.0,0.598],[22.0,-0.4],[23.0,-0.553],[24.0,-0.553],[25.0,-0.479],[26.0,-0.063],[27.0,0.644],[28.0,1.0],[29.0,0.139],[30.0,-0.524],[31.0,-0.553],[32.0,-0.553],[33.0,-0.529],[34.0,-0.163],[35.0,0.464],[36.0,0.835],[37.0,0.39],[38.0,-0.404],[39.0,-0.553],[40.0,-0.553],[41.0,-0.472],[42.0,0.031],[43.0,-0.097],[44.0,0.159],[45.0,0.636],[46.0,-0.078],[47.0,-0.553],[48.0,-0.553],[49.0,-0.45],[50.0,0.421],[51.0,0.229],[52.0,0.377],[53.0,0.743],[54.0,-0.056],[55.0,-0.548],[56.0,-0.553],[57.0,-0.513],[58.0,0.291],[59.0,0.996],[60.0,0.966],[61.0,0.328],[62.0,-0.405],[63.0,-0.548]]},{name:"recovered source 1",color:"#4ea1ff",points:[[0.0,-0.573],[1.0,-0.532],[2.0,0.167],[3.0,0.882],[4.0,0.937],[5.0,0.203],[6.0,-0.5],[7.0,-0.573],[8.0,-0.571],[9.0,-0.237],[10.0,0.853],[11.0,0.619],[12.0,0.592],[13.0,0.778],[14.0,-0.305],[15.0,-0.572],[16.0,-0.572],[17.0,-0.271],[18.0,0.368],[19.0,0.067],[20.0,0.536],[21.0,0.65],[22.0,-0.392],[23.0,-0.573],[24.0,-0.573],[25.0,-0.481],[26.0,0.059],[27.0,0.732],[28.0,1.0],[29.0,0.162],[30.0,-0.535],[31.0,-0.573],[32.0,-0.573],[33.0,-0.541],[34.0,-0.064],[35.0,0.623],[36.0,0.865],[37.0,0.265],[38.0,-0.459],[39.0,-0.573],[40.0,-0.573],[41.0,-0.476],[42.0,0.196],[43.0,0.033],[44.0,0.243],[45.0,0.578],[46.0,-0.179],[47.0,-0.573],[48.0,-0.573],[49.0,-0.465],[50.0,0.495],[51.0,0.262],[52.0,0.382],[53.0,0.69],[54.0,-0.131],[55.0,-0.569],[56.0,-0.573],[57.0,-0.539],[58.0,0.212],[59.0,0.977],[60.0,0.965],[61.0,0.294],[62.0,-0.425],[63.0,-0.569]]},{name:"recovered source 2",color:"#7ee787",points:[[0.0,-0.032],[1.0,-0.089],[2.0,-0.421],[3.0,-0.342],[4.0,-0.259],[5.0,-0.183],[6.0,-0.062],[7.0,-0.033],[8.0,-0.03],[9.0,-0.288],[10.0,-0.094],[11.0,0.229],[12.0,-0.268],[13.0,-0.092],[14.0,0.01],[15.0,-0.034],[16.0,-0.032],[17.0,0.045],[18.0,0.839],[19.0,0.445],[20.0,-0.509],[21.0,0.215],[22.0,0.115],[23.0,-0.032],[24.0,-0.032],[25.0,0.066],[26.0,0.756],[27.0,0.43],[28.0,-0.162],[29.0,0.116],[30.0,0.015],[31.0,-0.032],[32.0,-0.032],[33.0,0.01],[34.0,0.627],[35.0,0.893],[36.0,0.045],[37.0,-0.823],[38.0,-0.269],[39.0,-0.032],[40.0,-0.032],[41.0,0.048],[42.0,1.0],[43.0,0.807],[44.0,0.489],[45.0,-0.46],[46.0,-0.603],[47.0,-0.032],[48.0,-0.032],[49.0,-0.02],[50.0,0.386],[51.0,0.164],[52.0,-0.032],[53.0,-0.441],[54.0,-0.445],[55.0,-0.039],[56.0,-0.032],[57.0,-0.073],[58.0,-0.528],[59.0,-0.274],[60.0,-0.163],[61.0,-0.262],[62.0,-0.057],[63.0,-0.038]]}]}],caption:"Yes. Starting from the average images of two real digits mixed together, ICA unmixes the 64-pixel signal back into the two independent source patterns.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import FastICA

# two real source signals: the average pixel pattern of digits 3 and 8
digits = load_digits()
X, y = digits.data, digits.target
s1 = X[y == 3].mean(0)             # 64-pixel mean image of digit 3
s2 = X[y == 8].mean(0)
S = np.c_[s1, s2]
S = S - S.mean(0)

# mix the sources together, then unmix with ICA
A = np.array([[1.0, 0.7], [0.5, 1.0]])
Xmix = S @ A.T
S_hat = FastICA(n_components=2, random_state=0, max_iter=2000).fit_transform(Xmix)

def scale(v):
    m = np.abs(v).max()
    return v / m if m > 0 else v

t = np.arange(64)
plt.plot(t, scale(Xmix[:, 0]), color="#ff7b72", label="mixture")
plt.plot(t, scale(S_hat[:, 0]), color="#4ea1ff", label="recovered source 1")
plt.plot(t, scale(S_hat[:, 1]), color="#7ee787", label="recovered source 2")
plt.xlabel("pixel index")
plt.ylabel("intensity (scaled)")
plt.title("ICA unmixing of digit-pixel signals")
plt.legend()
plt.show()`},
  "ml-classification-metrics": {question:"On held-out breast-cancer tumors, how many did the model get right - and what kind of mistakes did it make?",charts:[{type:"confusion",title:"Confusion matrix on breast-cancer test set",labels:["malignant","benign"],matrix:[[60,3],[1,107]]}],caption:"On the test set: 107 benign caught, 3 benign missed, 1 malignant flagged as benign. Precision 0.97, recall 0.99 read straight off the matrix.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import ConfusionMatrixDisplay

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
y = bc.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

clf = LogisticRegression(max_iter=5000).fit(Xtr, ytr)
pred = clf.predict(Xte)

# rows = true diagnosis, columns = predicted
ConfusionMatrixDisplay.from_predictions(
    yte, pred, display_labels=["malignant", "benign"])
plt.title("Confusion matrix (breast-cancer test set)")
plt.show()`},
  "ml-roc-auc": {question:"Across every threshold, how well does the breast-cancer classifier trade true positives against false positives?",charts:[{type:"roc",title:"ROC curve (breast-cancer test set)",auc:0.9947,points:[[0.0,0.0],[0.0,0.009],[0.0,0.759],[0.016,0.759],[0.016,0.926],[0.032,0.926],[0.032,0.991],[0.063,0.991],[0.063,1.0],[1.0,1.0]]}],caption:"The curve bows hard toward the top-left with AUC = 0.9947 - far above the 0.5 diagonal of random guessing.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import RocCurveDisplay

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
y = bc.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)

clf = LogisticRegression(max_iter=5000).fit(Xtr, ytr)
scores = clf.predict_proba(Xte)[:, 1]      # probability of benign

RocCurveDisplay.from_predictions(yte, scores)
plt.plot([0, 1], [0, 1], "--", color="gray")   # random-guess diagonal
plt.title("ROC curve (breast cancer)")
plt.show()`},
  "ml-regression-metrics": {question:"How close are a linear model's diabetes-progression predictions to the true values?",charts:[{type:"scatter",title:"Predicted vs actual disease progression (test set)",xlabel:"actual progression",ylabel:"predicted progression",groups:[{name:"test patients",color:"#4ea1ff",points:[[180.0,222.35],[53.0,125.15],[71.0,115.71],[171.0,176.12],[64.0,120.28],[61.0,118.93],[321.0,239.68],[51.0,123.62],[292.0,193.26],[270.0,231.42],[96.0,85.53],[127.0,164.85],[156.0,163.79],[317.0,228.13],[170.0,133.97],[99.0,236.97],[110.0,164.14],[128.0,170.21],[297.0,208.07],[128.0,66.9],[230.0,131.1],[192.0,225.37],[63.0,112.38],[122.0,191.69],[137.0,98.64],[302.0,155.57],[49.0,91.19],[215.0,250.53],[219.0,144.09],[233.0,270.15],[47.0,46.69],[212.0,193.78],[51.0,84.59],[179.0,167.78],[131.0,165.03],[71.0,115.42],[113.0,151.44],[52.0,216.57],[89.0,71.93],[137.0,208.51],[150.0,210.16],[121.0,169.88],[155.0,212.26],[85.0,148.69],[179.0,112.24],[182.0,139.03],[195.0,237.28],[168.0,144.29],[145.0,129.9],[42.0,131.16],[208.0,237.72],[167.0,187.03],[118.0,98.53],[93.0,82.77],[182.0,112.04]]}],lines:[{name:"perfect prediction",color:"#ffb454",dash:true,points:[[42.0,42.0],[321.0,321.0]]}]}],caption:"Points scatter around the diagonal: R^2 = 0.3929 and RMSE = 55.652 in the progression score's own units.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# 442 real patients, all 10 features, progression target
db = load_diabetes()
Xtr, Xte, ytr, yte = train_test_split(db.data, db.target, test_size=0.3, random_state=0)

model = LinearRegression().fit(Xtr, ytr)
pred = model.predict(Xte)

plt.scatter(yte, pred, c="#4ea1ff", edgecolor="k", label="test patients")
lo, hi = yte.min(), yte.max()
plt.plot([lo, hi], [lo, hi], "--", color="#ffb454", label="perfect prediction")
plt.xlabel("actual progression")
plt.ylabel("predicted progression")
plt.title("Predicted vs actual")
plt.legend()
plt.show()`},
  "ml-regularization": {question:"On diabetes data, does shrinking the weights (ridge) beat plain least squares, and how much penalty is too much?",charts:[{type:"bars",title:"Test R squared: OLS vs ridge (diabetes)",labels:["OLS","ridge (CV)"],values:[0.387,0.393],colors:["#ff7b72","#7ee787"]},{type:"line",title:"Test R squared vs ridge penalty alpha",xlabel:"alpha (penalty strength)",ylabel:"test R squared",series:[{name:"test R squared",color:"#c89bff",points:[[0.01,0.387],[0.028,0.387],[0.081,0.387],[0.231,0.386],[0.658,0.386],[1.874,0.386],[5.337,0.387],[15.199,0.393],[43.288,0.406],[123.285,0.415],[351.119,0.386],[1000.0,0.297]]}]}],caption:"Ridge with cross-validated alpha = 14.384 lifts test R squared from 0.387 (OLS) to 0.393 on the diabetes data; crank alpha too high and the fit collapses.",code:`import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, RidgeCV, Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

db = load_diabetes()
X = StandardScaler().fit_transform(db.data)
y = db.target
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0)

ols = LinearRegression().fit(Xtr, ytr)
ridge = RidgeCV(alphas=np.logspace(-2, 3, 20)).fit(Xtr, ytr)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.bar(["OLS", "ridge (CV)"],
        [r2_score(yte, ols.predict(Xte)), r2_score(yte, ridge.predict(Xte))],
        color=["#ff7b72", "#7ee787"])
ax1.set_ylabel("test R squared")
ax1.set_title("OLS vs ridge")

alphas = np.logspace(-2, 3, 12)
r2s = [r2_score(yte, Ridge(alpha=a).fit(Xtr, ytr).predict(Xte)) for a in alphas]
ax2.plot(alphas, r2s, color="#c89bff", marker="o", label="test R squared")
ax2.set_xscale("log")
ax2.set_xlabel("alpha (penalty strength)")
ax2.set_ylabel("test R squared")
ax2.set_title("R squared vs ridge penalty")
ax2.legend()
plt.show()`}
});
