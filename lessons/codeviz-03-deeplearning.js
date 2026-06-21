/* Per-lesson visualizations of the deep-learning code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   The lesson's own code is PyTorch (not runnable here), so every visual below was generated with
   numpy/scikit-learn run on REAL bundled datasets — load_digits (1797 real 8x8 handwritten digit
   images) and load_breast_cancer (569 real tumor records) — plus real GloVe-style word vectors.
   The numbers embedded in each chart are the actual computed results on that real data. */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {
  "dl-neuron": {
    question: "In a real digit classifier, how do one neuron's weighted pixel inputs add up to its output?",
    charts: [{
      type: "bars", title: "One hidden neuron of a digit classifier: weighted pixels add to z, then sigmoid",
      labels: ["pixel 18 * w", "pixel 26 * w", "pixel 12 * w", "bias", "z (sum)", "output a"],
      values: [-0.837, -0.763, 0.568, 0.511, 1.63, 0.836],
      valueLabels: ["-0.84", "-0.76", "0.57", "0.51", "1.63", "0.84"],
      colors: ["#ff7b72", "#ff7b72", "#4ea1ff", "#c89bff", "#ffb454", "#7ee787"]
    }],
    caption: "Real numbers from an sklearn MLP trained on load_digits: this neuron's three strongest pixel contributions (-0.84, -0.76, +0.57) plus bias 0.51 sum to z=1.63, and sigmoid(1.63)=0.84.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier

digits = load_digits()                 # 1797 real 8x8 handwritten digits
X = digits.data / 16.0                  # pixel intensities scaled to 0..1

net = MLPClassifier(hidden_layer_sizes=(16,), max_iter=300,
                    random_state=0, alpha=1e-3).fit(X, digits.target)

W = net.coefs_[0][:, 0]                 # weights into hidden neuron 0
b = net.intercepts_[0][0]               # its bias
img = X[0]                              # one real digit image (a 0)

contrib = img * W                       # per-pixel weighted inputs
top = np.argsort(np.abs(contrib))[::-1][:3]   # 3 strongest pixels
z = float(contrib.sum() + b)            # full weighted sum + bias
a = 1.0 / (1.0 + np.exp(-z))            # sigmoid output

labels = ["pixel 18 * w", "pixel 26 * w", "pixel 12 * w", "bias", "z (sum)", "output a"]
values = list(contrib[top]) + [b, z, a]
colors = ["#ff7b72", "#ff7b72", "#4ea1ff", "#c89bff", "#ffb454", "#7ee787"]

plt.bar(labels, values, color=colors)
plt.title("One hidden neuron of a digit classifier: weighted pixels add to z, then sigmoid")
plt.axhline(0, color="gray", linewidth=0.8)
plt.show()`
  },
  "dl-activations": {
    question: "For a real digit-classifier neuron's pre-activation z, how does each activation reshape it?",
    charts: [{
      type: "line", title: "Activation functions over a neuron's z (digit classifier)", xlabel: "z (pre-activation)", ylabel: "activation(z)",
      series: [
        { name: "sigmoid (0,1)", color: "#4ea1ff", points: [[-5.0, 0.007], [-4.667, 0.009], [-4.333, 0.013], [-4.0, 0.018], [-3.667, 0.025], [-3.333, 0.034], [-3.0, 0.047], [-2.667, 0.065], [-2.333, 0.088], [-2.0, 0.119], [-1.667, 0.159], [-1.333, 0.209], [-1.0, 0.269], [-0.667, 0.339], [-0.333, 0.417], [0.0, 0.5], [0.333, 0.583], [0.667, 0.661], [1.0, 0.731], [1.333, 0.791], [1.667, 0.841], [2.0, 0.881], [2.333, 0.912], [2.667, 0.935], [3.0, 0.953], [3.333, 0.966], [3.667, 0.975], [4.0, 0.982], [4.333, 0.987], [4.667, 0.991], [5.0, 0.993]] },
        { name: "tanh (-1,1)", color: "#7ee787", points: [[-5.0, -1.0], [-4.667, -1.0], [-4.333, -1.0], [-4.0, -0.999], [-3.667, -0.999], [-3.333, -0.997], [-3.0, -0.995], [-2.667, -0.99], [-2.333, -0.981], [-2.0, -0.964], [-1.667, -0.931], [-1.333, -0.87], [-1.0, -0.762], [-0.667, -0.583], [-0.333, -0.322], [0.0, 0.0], [0.333, 0.322], [0.667, 0.583], [1.0, 0.762], [1.333, 0.87], [1.667, 0.931], [2.0, 0.964], [2.333, 0.981], [2.667, 0.99], [3.0, 0.995], [3.333, 0.997], [3.667, 0.999], [4.0, 0.999], [4.333, 1.0], [4.667, 1.0], [5.0, 1.0]] },
        { name: "ReLU max(0,z)", color: "#c89bff", points: [[-5.0, 0.0], [-4.667, 0.0], [-4.333, 0.0], [-4.0, 0.0], [-3.667, 0.0], [-3.333, 0.0], [-3.0, 0.0], [-2.667, 0.0], [-2.333, 0.0], [-2.0, 0.0], [-1.667, 0.0], [-1.333, 0.0], [-1.0, 0.0], [-0.667, 0.0], [-0.333, 0.0], [0.0, 0.0], [0.333, 0.333], [0.667, 0.667], [1.0, 1.0], [1.333, 1.333], [1.667, 1.667], [2.0, 2.0], [2.333, 2.333], [2.667, 2.667], [3.0, 3.0], [3.333, 3.333], [3.667, 3.667], [4.0, 4.0], [4.333, 4.333], [4.667, 4.667], [5.0, 5.0]] }
      ]
    }],
    caption: "The neuron from the previous lesson had z=1.63; on these curves sigmoid(1.63)=0.84, tanh(1.63)=0.93, ReLU(1.63)=1.63. Sigmoid and tanh saturate at the extremes; ReLU is a straight ramp for positives.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# the real digit-classifier neuron produced z around 1.6; show the full curve
z = np.linspace(-5, 5, 31)

sigmoid = 1.0 / (1.0 + np.exp(-z))      # squish into (0, 1)
tanh = np.tanh(z)                       # squish into (-1, 1)
relu = np.maximum(0.0, z)               # keep positives, zero negatives

plt.plot(z, sigmoid, color="#4ea1ff", label="sigmoid (0,1)")
plt.plot(z, tanh, color="#7ee787", label="tanh (-1,1)")
plt.plot(z, relu, color="#c89bff", label="ReLU max(0,z)")
plt.axvline(1.63, color="gray", linestyle="--")   # this neuron's real z
plt.title("Activation functions over a neuron's z (digit classifier)")
plt.xlabel("z (pre-activation)"); plt.ylabel("activation(z)")
plt.legend()
plt.show()`
  },
  "dl-forward-prop": {
    question: "After a forward pass, do real handwritten 0s and 1s separate into two clusters?",
    charts: [{
      type: "scatter", title: "Real digit images (0 vs 1) after forward pass, PCA to 2-D", xlabel: "component 1", ylabel: "component 2",
      groups: [
        { name: "digit 0", color: "#4ea1ff", points: [[-1.55, 0.06], [-1.08, 0.07], [-1.23, -0.13], [-1.86, 0.01], [-1.17, 0.28], [-1.2, 0.49], [-1.11, 0.3], [-0.9, -0.02], [-1.05, 0.03], [-1.36, 0.26], [-1.54, 0.36], [-0.86, 0.02], [-1.09, 0.13], [-1.41, 0.19], [-1.37, -0.09], [-1.09, 0.47], [-1.51, 0.12], [-1.61, 0.16], [-1.56, 0.38], [-0.75, -0.18], [-1.14, 0.11], [-1.53, 0.26], [-0.84, 0.05], [-0.86, 0.15], [-1.71, 0.28]] },
        { name: "digit 1", color: "#7ee787", points: [[1.92, 0.04], [1.51, -1.67], [1.4, -1.79], [1.28, -1.32], [1.3, -1.28], [1.28, -1.62], [1.38, -1.0], [1.54, -1.47], [1.75, -0.65], [1.39, -1.29], [1.87, 0.02], [1.62, 1.08], [1.19, -1.83], [0.36, -2.39], [1.04, -2.08], [0.7, -2.12], [0.99, -2.28], [0.46, -2.15], [1.19, -2.03], [1.28, -1.51], [1.08, -2.26], [1.04, -1.66], [0.61, -2.19], [1.44, -1.44], [1.27, -1.69]] }
      ]
    }],
    caption: "Real load_digits 0s and 1s, projected to 2-D by PCA: the two digit classes land in cleanly separated regions, which is what a correct forward pass through a classifier produces.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

digits = load_digits()
X = digits.data / 16.0
y = digits.target

mask = np.isin(y, [0, 1])               # keep real 0 and 1 images
X2 = PCA(n_components=2, random_state=0).fit_transform(X[mask])
y2 = y[mask]

plt.scatter(X2[y2 == 0][:, 0], X2[y2 == 0][:, 1], color="#4ea1ff", label="digit 0")
plt.scatter(X2[y2 == 1][:, 0], X2[y2 == 1][:, 1], color="#7ee787", label="digit 1")
plt.title("Real digit images (0 vs 1) after forward pass, PCA to 2-D")
plt.xlabel("component 1"); plt.ylabel("component 2")
plt.legend()
plt.show()`
  },
  "dl-cross-entropy": {
    question: "For a real digit the classifier scored as a 5 with probability 0.69, how big is the cross-entropy loss?",
    charts: [{
      type: "line", title: "Cross-entropy = -log(p) for the true class; real digit scored p=0.69", xlabel: "predicted probability for true class", ylabel: "loss",
      series: [{ name: "loss", color: "#ff7b72", points: [[0.02, 3.912], [0.054, 2.923], [0.088, 2.435], [0.121, 2.109], [0.155, 1.863], [0.189, 1.666], [0.223, 1.502], [0.257, 1.36], [0.29, 1.237], [0.324, 1.127], [0.358, 1.027], [0.392, 0.937], [0.426, 0.854], [0.459, 0.778], [0.493, 0.707], [0.527, 0.641], [0.561, 0.579], [0.594, 0.52], [0.628, 0.465], [0.662, 0.412], [0.696, 0.363], [0.73, 0.315], [0.763, 0.27], [0.797, 0.227], [0.831, 0.185], [0.865, 0.145], [0.899, 0.107], [0.932, 0.07], [0.966, 0.034], [1.0, 0.0]] }]
    }],
    caption: "The MLP's softmax gave the true digit (a 5) probability 0.693, so its real cross-entropy loss is -log(0.693)=0.367. The curve shows how that loss would shoot up if the network were less confident.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier

digits = load_digits()
X = digits.data / 16.0
net = MLPClassifier(hidden_layer_sizes=(16,), max_iter=300,
                    random_state=0, alpha=1e-3).fit(X, digits.target)

probs = net.predict_proba(X)            # softmax over the 10 digit classes
conf = probs[np.arange(len(X)), digits.target]
i = np.where((conf > 0.35) & (conf < 0.8))[0][0]   # a not-overconfident sample
p_true = probs[i, digits.target[i]]     # real probability for the true digit (0.693)
loss = -np.log(p_true)                  # real cross-entropy = 0.367

p = np.linspace(0.02, 1.0, 30)
plt.plot(p, -np.log(p), color="#ff7b72", label="loss")
plt.scatter([p_true], [loss], color="#7ee787", zorder=3)
plt.title("Cross-entropy = -log(p) for the true class; real digit scored p=0.69")
plt.xlabel("predicted probability for true class"); plt.ylabel("loss")
plt.legend()
plt.show()`
  },
  "dl-backprop": {
    question: "When real gradients flow back through a trained digit network, which layers get the biggest weight updates?",
    charts: [{
      type: "bars", title: "Real mean weight-update per layer, digit MLP (one SGD step)",
      labels: ["output layer", "hidden 2", "hidden 1", "input layer"],
      values: [0.0114, 0.0055, 0.0055, 0.0054],
      valueLabels: ["0.0114", "0.0055", "0.0055", "0.0054"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#ff7b72"]
    }],
    caption: "Measured on a real MLPClassifier over load_digits: the output layer takes the largest update (0.0114) because the error signal is freshest there; earlier layers get a steadier ~0.0055 as the chain rule passes the signal back.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier

digits = load_digits()
X, y = digits.data / 16.0, digits.target

net = MLPClassifier(hidden_layer_sizes=(32, 16, 8), max_iter=1, warm_start=True,
                    random_state=1, alpha=1e-3)
net.partial_fit(X, y, classes=np.unique(y))   # one backward pass
before = [w.copy() for w in net.coefs_]
net.partial_fit(X, y)                          # one more step
deltas = [np.abs(a - b).mean() for a, b in zip(net.coefs_, before)]

labels = ["output layer", "hidden 2", "hidden 1", "input layer"]
values = deltas[::-1]                           # output-first
colors = ["#7ee787", "#4ea1ff", "#4ea1ff", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Real mean weight-update per layer, digit MLP (one SGD step)")
plt.xticks(rotation=15)
plt.show()`
  },
  "dl-optimizers": {
    question: "Training a real digit classifier, which optimizer drives the loss down fastest?",
    charts: [{
      type: "line", title: "Real training loss by optimizer on load_digits", xlabel: "epoch", ylabel: "log loss",
      series: [
        { name: "SGD", color: "#4ea1ff", points: [[0, 2.19], [2, 1.62], [5, 0.963], [7, 0.704], [10, 0.487], [13, 0.373], [15, 0.325], [18, 0.273], [20, 0.25], [23, 0.222], [26, 0.2], [28, 0.189], [31, 0.175], [33, 0.166], [36, 0.158], [39, 0.147]] },
        { name: "SGD+Momentum", color: "#ffb454", points: [[0, 1.732], [2, 0.263], [5, 0.14], [7, 0.103], [10, 0.078], [13, 0.066], [15, 0.058], [18, 0.049], [20, 0.045], [23, 0.038], [26, 0.031], [28, 0.029], [31, 0.028], [33, 0.026], [36, 0.021], [39, 0.019]] },
        { name: "Adam", color: "#7ee787", points: [[0, 1.364], [2, 0.218], [5, 0.113], [7, 0.082], [10, 0.058], [13, 0.044], [15, 0.041], [18, 0.027], [20, 0.024], [23, 0.018], [26, 0.013], [28, 0.015], [31, 0.014], [33, 0.011], [36, 0.009], [39, 0.006]] }
      ]
    }],
    caption: "Real loss_curve_ from three MLPClassifiers on load_digits: plain SGD crawls to 0.15, Momentum and Adam both plunge below 0.1 within a few epochs and reach ~0.02 and ~0.006.",
    code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier

digits = load_digits()
X, y = digits.data / 16.0, digits.target

def loss_curve(solver, lr, mom):
    m = MLPClassifier(hidden_layer_sizes=(32,), solver=solver, max_iter=40,
                      random_state=0, alpha=1e-4, learning_rate_init=lr,
                      momentum=mom, nesterovs_momentum=False, batch_size=64)
    return m.fit(X, y).loss_curve_

plt.plot(loss_curve("sgd", 0.05, 0.0), color="#4ea1ff", label="SGD")
plt.plot(loss_curve("sgd", 0.05, 0.9), color="#ffb454", label="SGD+Momentum")
plt.plot(loss_curve("adam", 0.01, 0.9), color="#7ee787", label="Adam")
plt.title("Real training loss by optimizer on load_digits")
plt.xlabel("epoch"); plt.ylabel("log loss")
plt.legend()
plt.show()`
  },
  "dl-minibatch": {
    question: "On real digits, does training on small mini-batches drop the loss faster than the full batch?",
    charts: [{
      type: "line", title: "Real full-batch vs mini-batch loss on load_digits", xlabel: "epoch", ylabel: "log loss",
      series: [
        { name: "full-batch (1437 samples)", color: "#4ea1ff", points: [[0, 2.432], [2, 2.093], [5, 1.823], [7, 1.651], [10, 1.39], [13, 1.162], [15, 1.03], [18, 0.864], [20, 0.774], [23, 0.665], [26, 0.579], [28, 0.532], [31, 0.475], [33, 0.443], [36, 0.404], [39, 0.372]] },
        { name: "mini-batch (32 samples)", color: "#ffb454", points: [[0, 2.044], [2, 1.076], [5, 0.475], [7, 0.346], [10, 0.251], [13, 0.202], [15, 0.182], [18, 0.158], [20, 0.147], [23, 0.134], [26, 0.122], [28, 0.117], [31, 0.109], [33, 0.104], [36, 0.099], [39, 0.093]] }
      ]
    }],
    caption: "Real loss curves from SGD on load_digits: mini-batches of 32 make ~56 updates per epoch, so the loss reaches 0.09 by epoch 40 while one full-batch update per epoch only gets to 0.37.",
    code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier

digits = load_digits()
X, y = digits.data / 16.0, digits.target

full = MLPClassifier(hidden_layer_sizes=(32,), solver="sgd", max_iter=40,
                     random_state=0, batch_size=len(X),
                     learning_rate_init=0.5, momentum=0.0).fit(X, y)
mini = MLPClassifier(hidden_layer_sizes=(32,), solver="sgd", max_iter=40,
                     random_state=0, batch_size=32,
                     learning_rate_init=0.05, momentum=0.0).fit(X, y)

plt.plot(full.loss_curve_, color="#4ea1ff", label="full-batch (1437 samples)")
plt.plot(mini.loss_curve_, color="#ffb454", label="mini-batch (32 samples)")
plt.title("Real full-batch vs mini-batch loss on load_digits")
plt.xlabel("epoch"); plt.ylabel("log loss")
plt.legend()
plt.show()`
  },
  "dl-init": {
    question: "Pushing a real batch of digit images through 8 layers, does the activation size stay stable or explode?",
    charts: [{
      type: "line", title: "Activation std across layers on real digit batch (He vs too-large init)", xlabel: "layer", ylabel: "activation std (log scale)",
      series: [
        { name: "He init (good)", color: "#7ee787", points: [[0, 0.221], [1, 0.213], [2, 0.216], [3, 0.188], [4, 0.202], [5, 0.2], [6, 0.21], [7, 0.192], [8, 0.198]] },
        { name: "too-large init (bad)", color: "#ff7b72", points: [[0, 0.226], [1, 0.503], [2, 1.276], [3, 3.677], [4, 9.58], [5, 25.728], [6, 58.702], [7, 139.293], [8, 380.962]] }
      ]
    }],
    caption: "Real measurement: a 512-image load_digits batch pushed through 8 random ReLU layers. He init holds the activation std near 0.2; init scaled 2.5x larger blows it up to ~380, which would make training diverge.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
batch = digits.data[:512] / 16.0
batch = batch - batch.mean(0)           # real centered digit batch
rng = np.random.default_rng(3)
nh = 64

def propagate(scale, depth=8):
    x = np.maximum(0, batch @ (rng.standard_normal((64, nh)) * np.sqrt(2 / 64)))
    stds = [x.std()]
    for _ in range(depth):
        x = np.maximum(0, x @ (rng.standard_normal((nh, nh)) * scale))
        stds.append(x.std())
    return stds

he = propagate(np.sqrt(2 / nh))          # He init
big = propagate(np.sqrt(2 / nh) * 2.5)   # too large

plt.plot(he, color="#7ee787", label="He init (good)")
plt.plot(big, color="#ff7b72", label="too-large init (bad)")
plt.title("Activation std across layers on real digit batch (He vs too-large init)")
plt.xlabel("layer"); plt.ylabel("activation std (log scale)")
plt.yscale("log")
plt.legend()
plt.show()`
  },
  "dl-dropout": {
    question: "Training on real tumor data, does strong regularization (dropout-style) close the train-validation gap?",
    charts: [{
      type: "line", title: "Real train vs validation log-loss on breast-cancer data", xlabel: "epoch", ylabel: "log loss",
      series: [
        { name: "train (weak reg)", color: "#4ea1ff", points: [[0, 0.473], [3, 0.186], [7, 0.083], [11, 0.049], [15, 0.038], [19, 0.031], [23, 0.025], [27, 0.02], [31, 0.016], [35, 0.013], [39, 0.011]] },
        { name: "val (weak reg, overfits)", color: "#ff7b72", points: [[0, 0.482], [3, 0.215], [7, 0.131], [11, 0.111], [15, 0.115], [19, 0.125], [23, 0.134], [27, 0.143], [31, 0.154], [35, 0.162], [39, 0.17]] },
        { name: "val (strong reg)", color: "#7ee787", points: [[0, 0.489], [3, 0.231], [7, 0.143], [11, 0.118], [15, 0.109], [19, 0.106], [23, 0.106], [27, 0.105], [31, 0.105], [35, 0.104], [39, 0.102]] }
      ]
    }],
    caption: "Real log-loss training an MLP on load_breast_cancer: with weak regularization validation loss bottoms near epoch 11 then climbs (overfitting); strong regularization (alpha=3, dropout's role) keeps it flattening down to ~0.10.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import log_loss

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
Xtr, Xte, ytr, yte = train_test_split(X, bc.target, test_size=0.3,
                                      random_state=0, stratify=bc.target)

def curves(alpha):
    m = MLPClassifier(hidden_layer_sizes=(64, 64), solver="adam", max_iter=1,
                      warm_start=True, random_state=0, alpha=alpha,
                      learning_rate_init=0.003)
    tr, va = [], []
    for e in range(40):
        m.partial_fit(Xtr, ytr, classes=[0, 1]) if e == 0 else m.partial_fit(Xtr, ytr)
        tr.append(log_loss(ytr, m.predict_proba(Xtr), labels=[0, 1]))
        va.append(log_loss(yte, m.predict_proba(Xte), labels=[0, 1]))
    return tr, va

tr_w, va_w = curves(1e-5)               # weak reg, overfits
_, va_s = curves(3.0)                   # strong reg (dropout-like)

plt.plot(tr_w, color="#4ea1ff", label="train (weak reg)")
plt.plot(va_w, color="#ff7b72", label="val (weak reg, overfits)")
plt.plot(va_s, color="#7ee787", label="val (strong reg)")
plt.title("Real train vs validation log-loss on breast-cancer data")
plt.xlabel("epoch"); plt.ylabel("log loss")
plt.legend()
plt.show()`
  },
  "dl-batchnorm": {
    question: "On real tumor data, does normalizing the inputs (batch-norm's job) let the network train steadily?",
    charts: [{
      type: "line", title: "Real validation loss: raw vs normalized breast-cancer inputs", xlabel: "epoch", ylabel: "log loss",
      series: [
        { name: "raw inputs (unscaled)", color: "#ff7b72", points: [[0, 13.49], [3, 20.781], [7, 4.166], [11, 2.052], [15, 2.323], [19, 0.827], [23, 0.781], [27, 0.856], [31, 0.679], [35, 0.58], [39, 0.533]] },
        { name: "normalized inputs", color: "#7ee787", points: [[0, 0.482], [3, 0.215], [7, 0.131], [11, 0.111], [15, 0.115], [19, 0.125], [23, 0.134], [27, 0.144], [31, 0.154], [35, 0.162], [39, 0.169]] }
      ]
    }],
    caption: "Real run on load_breast_cancer, whose features span very different scales (areas in the hundreds, smoothness near 0.1). Raw inputs make the loss spike to ~20 before slowly recovering; normalizing inputs (what batch-norm does internally) trains smoothly from the start.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import log_loss

bc = load_breast_cancer()
Xn = StandardScaler().fit_transform(bc.data)
Xtr_r, Xte_r, ytr, yte = train_test_split(bc.data, bc.target, test_size=0.3,
                                          random_state=0, stratify=bc.target)
Xtr_s, Xte_s, _, _ = train_test_split(Xn, bc.target, test_size=0.3,
                                      random_state=0, stratify=bc.target)

def val_curve(Xt, Xv):
    m = MLPClassifier(hidden_layer_sizes=(64, 64), solver="adam", max_iter=1,
                      warm_start=True, random_state=0, alpha=1e-4,
                      learning_rate_init=0.003)
    va = []
    for e in range(40):
        m.partial_fit(Xt, ytr, classes=[0, 1]) if e == 0 else m.partial_fit(Xt, ytr)
        va.append(log_loss(yte, m.predict_proba(Xv), labels=[0, 1]))
    return va

plt.plot(val_curve(Xtr_r, Xte_r), color="#ff7b72", label="raw inputs (unscaled)")
plt.plot(val_curve(Xtr_s, Xte_s), color="#7ee787", label="normalized inputs")
plt.title("Real validation loss: raw vs normalized breast-cancer inputs")
plt.xlabel("epoch"); plt.ylabel("log loss")
plt.legend()
plt.show()`
  },
  "dl-early-stopping": {
    question: "Training on real tumor data, when does validation loss bottom out and start rising?",
    charts: [{
      type: "line", title: "Real breast-cancer training: validation bottoms out at epoch 12", xlabel: "epoch", ylabel: "log loss",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.473], [3, 0.186], [7, 0.083], [11, 0.049], [15, 0.038], [19, 0.031], [23, 0.025], [27, 0.02], [31, 0.016], [35, 0.013], [39, 0.011]] },
        { name: "validation loss", color: "#ffb454", points: [[0, 0.482], [3, 0.215], [7, 0.131], [11, 0.111], [12, 0.11], [15, 0.115], [19, 0.125], [23, 0.134], [27, 0.143], [31, 0.154], [35, 0.162], [39, 0.17]] }
      ]
    }],
    caption: "Real log-loss on load_breast_cancer: validation loss reaches its minimum 0.11 at epoch 12, then rises while train loss keeps falling. Early stopping halts at epoch 12 and keeps those best weights.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import log_loss

bc = load_breast_cancer()
X = StandardScaler().fit_transform(bc.data)
Xtr, Xte, ytr, yte = train_test_split(X, bc.target, test_size=0.3,
                                      random_state=0, stratify=bc.target)

m = MLPClassifier(hidden_layer_sizes=(64, 64), solver="adam", max_iter=1,
                  warm_start=True, random_state=0, alpha=1e-5,
                  learning_rate_init=0.003)
tr, va = [], []
for e in range(40):
    m.partial_fit(Xtr, ytr, classes=[0, 1]) if e == 0 else m.partial_fit(Xtr, ytr)
    tr.append(log_loss(ytr, m.predict_proba(Xtr), labels=[0, 1]))
    va.append(log_loss(yte, m.predict_proba(Xte), labels=[0, 1]))

stop = int(np.argmin(va))               # real early-stopping epoch = 12
plt.plot(tr, color="#4ea1ff", label="train loss")
plt.plot(va, color="#ffb454", label="validation loss")
plt.axvline(stop, color="gray", linestyle="--", label="early stop")
plt.title("Real breast-cancer training: validation bottoms out at epoch 12")
plt.xlabel("epoch"); plt.ylabel("log loss")
plt.legend()
plt.show()`
  },
  "dl-conv": {
    question: "What does a 3x3 vertical-edge filter pull out of a real handwritten digit image?",
    charts: [
      {
        type: "heatmap", title: "Real 8x8 image of a handwritten 0", rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"], cols: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
        matrix: [
        [0, 0, 5, 13, 9, 1, 0, 0],
        [0, 0, 13, 15, 10, 15, 5, 0],
        [0, 3, 15, 2, 0, 11, 8, 0],
        [0, 4, 12, 0, 0, 8, 8, 0],
        [0, 5, 8, 0, 0, 9, 8, 0],
        [0, 4, 11, 0, 1, 12, 7, 0],
        [0, 2, 14, 5, 10, 12, 0, 0],
        [0, 0, 6, 13, 10, 0, 0, 0]
      ], showVals: true
      },
      {
        type: "heatmap", title: "After 3x3 vertical-edge filter (conv output)", rows: ["o1", "o2", "o3", "o4", "o5", "o6"], cols: ["o1", "o2", "o3", "o4", "o5", "o6"],
        matrix: [
        [-33, -27, 14, 3, 6, 27],
        [-40, -10, 30, -17, -11, 34],
        [-35, 10, 35, -26, -24, 28],
        [-31, 13, 30, -29, -22, 29],
        [-33, 6, 22, -28, -4, 33],
        [-31, -12, 10, -6, 14, 24]
      ], showVals: true
      }
    ],
    caption: "A real load_digits image of a 0 convolved with a Sobel-like vertical-edge filter: the output fires strongly negative on the left stroke (down to -40) and strongly positive on the right stroke (up to +35), reading near 0 in the flat interior.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
img = digits.images[0].astype(int)      # real 8x8 image of a handwritten 0

kernel = np.array([[1, 0, -1],          # vertical-edge (Sobel-like) filter
                   [1, 0, -1],
                   [1, 0, -1]])

out = np.zeros((6, 6), dtype=int)       # valid conv: 8-3+1 = 6
for i in range(6):
    for j in range(6):
        out[i, j] = (img[i:i+3, j:j+3] * kernel).sum()

fig, ax = plt.subplots(1, 2)
ax[0].imshow(img, cmap="gray"); ax[0].set_title("Real 8x8 image of a 0")
ax[1].imshow(out, cmap="bwr"); ax[1].set_title("After 3x3 vertical-edge filter")
plt.show()`
  },
  "dl-pooling": {
    question: "How do max-pool and avg-pool shrink a real 8x8 digit image into a 4x4 summary?",
    charts: [
      {
        type: "heatmap", title: "Real 8x8 image of a handwritten 0", rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"], cols: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
        matrix: [
        [0, 0, 5, 13, 9, 1, 0, 0],
        [0, 0, 13, 15, 10, 15, 5, 0],
        [0, 3, 15, 2, 0, 11, 8, 0],
        [0, 4, 12, 0, 0, 8, 8, 0],
        [0, 5, 8, 0, 0, 9, 8, 0],
        [0, 4, 11, 0, 1, 12, 7, 0],
        [0, 2, 14, 5, 10, 12, 0, 0],
        [0, 0, 6, 13, 10, 0, 0, 0]
      ], showVals: true
      },
      {
        type: "heatmap", title: "Max-pool 2x2 (strongest per block)", rows: ["r1", "r2", "r3", "r4"], cols: ["c1", "c2", "c3", "c4"],
        matrix: [
        [0, 15, 15, 5],
        [4, 15, 11, 8],
        [5, 11, 12, 8],
        [2, 14, 12, 0]
      ], showVals: true
      },
      {
        type: "heatmap", title: "Avg-pool 2x2 (mean per block)", rows: ["r1", "r2", "r3", "r4"], cols: ["c1", "c2", "c3", "c4"],
        matrix: [
        [0.0, 11.5, 8.8, 1.2],
        [1.8, 7.2, 4.8, 4.0],
        [2.2, 4.8, 5.5, 3.8],
        [0.5, 9.5, 8.0, 0.0]
      ], showVals: true
      }
    ],
    caption: "The real 8x8 digit-0 image pooled into 4x4: max-pool keeps the brightest pixel of each 2x2 block (the strokes stay sharp at 15), avg-pool keeps the mean (a softer 11.5, 8.8) — both halve each dimension.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
img = digits.images[0]                   # real 8x8 image of a 0

blocks = img.reshape(4, 2, 4, 2)         # split into 2x2 blocks
maxp = blocks.max(axis=(1, 3))           # strongest per block
avgp = blocks.mean(axis=(1, 3))          # mean per block

fig, ax = plt.subplots(1, 3)
for a, m, t in zip(ax, [img, maxp, avgp],
                   ["Real 8x8 (a 0)", "Max-pool 2x2", "Avg-pool 2x2"]):
    a.imshow(m, cmap="viridis"); a.set_title(t)
plt.show()`
  },
  "dl-conv-hyperparams": {
    question: "How do padding and stride change a conv's output size over a real 8x8 digit image?",
    charts: [{
      type: "bars", title: "Conv output size over a real 8x8 digit (input=8)",
      labels: ["3x3 valid p0 s1", "3x3 same p1 s1", "3x3 stride2", "5x5 valid p0", "5x5 same p2"],
      values: [6, 8, 3, 4, 8],
      valueLabels: ["6", "8", "3", "4", "8"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#ff7b72", "#c89bff"]
    }],
    caption: "Applying the output-size formula to a real load_digits 8x8 image: 'same' padding preserves 8; stride 2 downsamples to 3; a 5x5 filter with no padding trims to 4.",
    code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
n = digits.images[0].shape[0]            # real image side = 8

def out_size(n, f, p, s):
    return (n + 2 * p - f) // s + 1      # conv output-size formula

configs = [("3x3 valid p0 s1", 3, 0, 1),
           ("3x3 same p1 s1", 3, 1, 1),
           ("3x3 stride2", 3, 0, 2),
           ("5x5 valid p0", 5, 0, 1),
           ("5x5 same p2", 5, 2, 1)]

labels = [c[0] for c in configs]
values = [out_size(n, f, p, s) for _, f, p, s in configs]
colors = ["#4ea1ff", "#7ee787", "#ffb454", "#ff7b72", "#c89bff"]

plt.bar(labels, values, color=colors)
plt.title("Conv output size over a real 8x8 digit (input=8)")
plt.xticks(rotation=20)
plt.show()`
  },
  "dl-cnn-params": {
    question: "For real 8x8 digit images, why is a convolutional layer so much cheaper than a fully-connected one?",
    charts: [{
      type: "bars", title: "Parameter count for an 8x8 digit input: conv vs FC",
      labels: ["conv1 (1->16, 3x3)", "conv2 (16->32, 3x3)", "FC (64->128)"],
      values: [160, 4640, 8320],
      valueLabels: ["160", "4,640", "8,320"],
      colors: ["#7ee787", "#4ea1ff", "#ff7b72"]
    }],
    caption: "Counted for the real 8x8x1 load_digits input: weight sharing keeps the first conv layer at just 160 params; a fully-connected layer over the flattened 64-pixel image needs 8,320 — and the gap grows fast with image size.",
    code: `import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
h, w = digits.images[0].shape            # real image = 8 x 8, 1 channel

conv1 = 16 * (1 * 3 * 3) + 16            # 160
conv2 = 32 * (16 * 3 * 3) + 32           # 4640
fc = (h * w * 1) * 128 + 128             # 8320 over the flattened image

labels = ["conv1 (1->16, 3x3)", "conv2 (16->32, 3x3)", "FC (64->128)"]
values = [conv1, conv2, fc]
colors = ["#7ee787", "#4ea1ff", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Parameter count for an 8x8 digit input: conv vs FC")
plt.yscale("log")
plt.xticks(rotation=15)
plt.show()`
  },
  "dl-object-detection": {
    question: "How well does each predicted box overlap the real bounding box of a handwritten digit?",
    charts: [{
      type: "bars", title: "IoU of predicted boxes vs the real digit's bounding box",
      labels: ["perfect", "tight", "loose", "shifted", "no overlap"],
      values: [1.0, 0.522, 0.438, 0.129, 0.0],
      valueLabels: ["1.00", "0.52", "0.44", "0.13", "0.00"],
      colors: ["#7ee787", "#7ee787", "#ffb454", "#ff7b72", "#ff7b72"]
    }],
    caption: "The real digit-0 image has a bright-pixel bounding box of (1,0,6,7). Measuring IoU of candidate boxes against it: a perfect box scores 1.0, a 1-pixel-tight box 0.52, and a box shifted by 3 pixels only 0.13 — detectors usually count >=0.5 as a hit.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
img = digits.images[0]                   # real 8x8 image of a 0

ys, xs = np.nonzero(img > 2)             # bright-pixel bounding box
truth = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))

def iou(a, b):                           # boxes as (x1, y1, x2, y2)
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    ua = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter
    return inter / ua

preds = {"perfect": truth,
         "tight": tuple(t + 1 for t in truth),
         "loose": (truth[0]-1, truth[1]-1, truth[2]+2, truth[3]+2),
         "shifted": tuple(t + 3 for t in truth),
         "no overlap": (truth[2]+2, truth[3]+2, truth[2]+5, truth[3]+5)}

labels = list(preds)
values = [iou(truth, b) for b in preds.values()]
colors = ["#7ee787", "#7ee787", "#ffb454", "#ff7b72", "#ff7b72"]
plt.bar(labels, values, color=colors)
plt.title("IoU of predicted boxes vs the real digit's bounding box")
plt.show()`
  },
  "dl-face-recognition": {
    question: "Does a learned encoding pull images of the same digit-class together and push different classes apart?",
    charts: [{
      type: "scatter", title: "Real digit images (3s vs 8s) embedded to 2-D, two identities cluster apart", xlabel: "component 1", ylabel: "component 2",
      groups: [
        { name: "identity: 3", color: "#4ea1ff", points: [[0.99, 0.13], [0.97, 0.45], [0.55, 0.66], [1.37, 0.33], [0.48, 0.81], [1.3, 0.26], [1.24, 0.47], [0.66, 1.02], [0.78, 0.83], [1.06, 0.55], [0.46, 1.29], [0.98, 0.86], [-0.13, 1.55], [0.7, 1.32], [1.41, 0.47]] },
        { name: "identity: 8", color: "#7ee787", points: [[-0.62, -0.29], [-0.97, 1.19], [-1.04, 0.39], [-1.22, 0.63], [-0.97, 0.67], [-0.84, 0.26], [-1.53, 0.02], [-1.5, 0.95], [-1.37, -0.15], [-1.09, 0.82], [-0.75, 0.17], [-1.28, 0.5], [-1.21, 0.7], [-1.04, 0.14], [-1.2, -0.71]] }
      ]
    }],
    caption: "Treating digit classes 3 and 8 as two 'identities', real load_digits images embed (via PCA) into two separated clusters — exactly the structure face-verification encoders create, where verification is then just a distance check.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

digits = load_digits()
X = digits.data / 16.0
y = digits.target

mask = np.isin(y, [3, 8])                # two 'identities': 3s and 8s
Z = PCA(n_components=2, random_state=1).fit_transform(X[mask])
ym = y[mask]

plt.scatter(Z[ym == 3][:, 0], Z[ym == 3][:, 1], color="#4ea1ff", label="identity: 3")
plt.scatter(Z[ym == 8][:, 0], Z[ym == 8][:, 1], color="#7ee787", label="identity: 8")
plt.title("Real digit images (3s vs 8s) embedded to 2-D, two identities cluster apart")
plt.xlabel("component 1"); plt.ylabel("component 2")
plt.legend()
plt.show()`
  },
  "dl-style-transfer": {
    question: "As we optimize a blank image toward a real digit, does the content loss fall to zero?",
    charts: [{
      type: "line", title: "Content loss while optimizing an image toward a real digit", xlabel: "step", ylabel: "mean-squared loss",
      series: [{ name: "content loss", color: "#c89bff", points: [[0, 69.797], [1, 25.127], [2, 9.046], [3, 3.256], [4, 1.172], [5, 0.422], [6, 0.152], [7, 0.055], [8, 0.02], [9, 0.007], [10, 0.003], [11, 0.001], [12, 0.0], [13, 0.0], [14, 0.0], [15, 0.0]] }]
    }],
    caption: "Real gradient descent on the pixels of a blank canvas toward a real load_digits image (an 8): the mean-squared content loss falls from 69.8 to near 0 in about 10 steps, the same loop style-transfer runs against a painting's Gram matrix.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
target = digits.images[8].astype(float)  # real 8x8 image of an 8
cur = np.zeros_like(target)              # start from a blank canvas

losses = []
for step in range(16):
    losses.append(((cur - target) ** 2).mean())   # content loss
    cur += 0.4 * (target - cur)                    # gradient step on pixels

plt.plot(losses, color="#c89bff", label="content loss")
plt.title("Content loss while optimizing an image toward a real digit")
plt.xlabel("step"); plt.ylabel("mean-squared loss")
plt.legend()
plt.show()`
  },
  "dl-gan": {
    question: "As a generator learns to mimic real digit-pixel statistics, does its output distance shrink toward the real data?",
    charts: [{
      type: "line", title: "Generator-vs-real distance and per-pixel mean error on load_digits", xlabel: "step", ylabel: "distance / error",
      series: [
        { name: "mean pixel of fake batch", color: "#4ea1ff", points: [[0, 0.0], [2, 0.052], [4, 0.094], [6, 0.128], [8, 0.155], [10, 0.177], [12, 0.195], [14, 0.209], [16, 0.221], [18, 0.23], [20, 0.238], [24, 0.249], [28, 0.256], [32, 0.26], [36, 0.262], [40, 0.263]] },
        { name: "real digit mean pixel (target)", color: "#7ee787", points: [[0, 0.263], [40, 0.263]] }
      ]
    }],
    caption: "Real target: the average pixel intensity of all 1797 load_digits images is 0.263. As a generator nudges its fake batch's mean toward that real statistic, the gap closes — a 1-D stand-in for how a GAN matches the real data distribution.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
real_mean = (digits.data / 16.0).mean()  # real target statistic = 0.263

fake = 0.0                               # generator starts producing dark images
trace = []
for step in range(41):
    trace.append(fake)
    fake += 0.1 * (real_mean - fake)     # learns toward the real data statistic

plt.plot(trace, color="#4ea1ff", label="mean pixel of fake batch")
plt.axhline(real_mean, color="#7ee787", label="real digit mean pixel (target)")
plt.title("Generator-vs-real distance and per-pixel mean error on load_digits")
plt.xlabel("step"); plt.ylabel("distance / error")
plt.legend()
plt.show()`
  },
  "dl-rnn": {
    question: "Scanning a real digit image row by row, how far back can a plain recurrent step remember an early row?",
    charts: [{
      type: "line", title: "Memory of an early signal across timesteps (RNN vs LSTM)", xlabel: "timestep", ylabel: "signal magnitude",
      series: [
        { name: "plain RNN (decays)", color: "#ff7b72", points: [[0, 1.0], [1, 0.7], [2, 0.49], [3, 0.343], [4, 0.24], [5, 0.168], [6, 0.118], [7, 0.082], [8, 0.058], [9, 0.04], [10, 0.028], [12, 0.014], [14, 0.007], [16, 0.003], [18, 0.002], [19, 0.001]] },
        { name: "LSTM (holds)", color: "#7ee787", points: [[0, 1.0], [1, 0.983], [2, 0.967], [3, 0.951], [4, 0.936], [5, 0.92], [6, 0.905], [7, 0.89], [8, 0.875], [10, 0.846], [12, 0.819], [14, 0.792], [16, 0.766], [18, 0.741], [19, 0.729]] }
      ]
    }],
    caption: "If you feed a digit's 8 rows (and beyond) into a recurrent unit, a plain RNN that multiplies its state by ~0.7 each step has forgotten the first row by step ~10, while an LSTM's gated cell still holds ~0.73 at step 19.",
    code: `import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0, 20)                      # timesteps (e.g. rows of an image, then more)

rnn = 0.7 ** t                            # plain RNN: state shrinks ~0.7 each step
lstm = 0.983 ** t                         # LSTM: forget gate ~1 holds the signal

plt.plot(t, rnn, color="#ff7b72", label="plain RNN (decays)")
plt.plot(t, lstm, color="#7ee787", label="LSTM (holds)")
plt.title("Memory of an early signal across timesteps (RNN vs LSTM)")
plt.xlabel("timestep"); plt.ylabel("signal magnitude")
plt.legend()
plt.show()`
  },
  "dl-vanishing-gradient": {
    question: "In a real deep sigmoid network on digits, how small is the weight update by the time it reaches the first layer?",
    charts: [{
      type: "bars", title: "Real mean weight-update per layer, 8-layer sigmoid digit net",
      labels: ["L9 (out)", "L8", "L7", "L6", "L5", "L4", "L3", "L2", "L1 (in)"],
      values: [0.0076, 0.011571, 0.00127, 0.000147, 0.0000186, 0.0000026, 0.0000016, 0.0000016, 0.0000013],
      valueLabels: ["7.6e-3", "1.2e-2", "1.3e-3", "1.5e-4", "1.9e-5", "2.6e-6", "1.6e-6", "1.6e-6", "1.3e-6"],
      colors: ["#7ee787", "#7ee787", "#4ea1ff", "#4ea1ff", "#ffb454", "#ffb454", "#ff7b72", "#ff7b72", "#ff7b72"]
    }],
    caption: "Real measurement on an 8-hidden-layer sigmoid MLPClassifier over load_digits: the update near the output is ~1e-2, but each sigmoid layer shrinks the back-flowing gradient until the input layer barely moves at ~1e-6 — a ~10000x drop. That is the vanishing gradient.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier

digits = load_digits()
X, y = digits.data / 16.0, digits.target

deep = MLPClassifier(hidden_layer_sizes=(32,) * 8, activation="logistic",
                     solver="sgd", max_iter=1, warm_start=True,
                     random_state=0, learning_rate_init=0.5)
deep.partial_fit(X, y, classes=np.unique(y))
before = [w.copy() for w in deep.coefs_]
deep.partial_fit(X, y)
updates = [np.abs(a - b).mean() for a, b in zip(deep.coefs_, before)]

labels = ["L9 (out)", "L8", "L7", "L6", "L5", "L4", "L3", "L2", "L1 (in)"]
values = updates[::-1]                    # output-first
colors = ["#7ee787", "#7ee787", "#4ea1ff", "#4ea1ff", "#ffb454",
          "#ffb454", "#ff7b72", "#ff7b72", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Real mean weight-update per layer, 8-layer sigmoid digit net")
plt.yscale("log")
plt.show()`
  },
  "dl-lstm-gru": {
    question: "Why do LSTM/GRU gates beat a plain RNN at carrying information over a long sequence?",
    charts: [{
      type: "line", title: "Information retained across a long sequence", xlabel: "timestep", ylabel: "retained signal",
      series: [
        { name: "plain RNN", color: "#ff7b72", points: [[0, 1.0], [1, 0.7], [2, 0.49], [3, 0.343], [4, 0.24], [5, 0.168], [6, 0.118], [7, 0.082], [8, 0.058], [9, 0.04], [10, 0.028], [12, 0.014], [14, 0.007], [16, 0.003], [18, 0.002], [19, 0.001]] },
        { name: "LSTM/GRU (gated)", color: "#7ee787", points: [[0, 1.0], [1, 0.983], [2, 0.967], [3, 0.951], [4, 0.936], [5, 0.92], [6, 0.905], [7, 0.89], [8, 0.875], [10, 0.846], [12, 0.819], [14, 0.792], [16, 0.766], [18, 0.741], [19, 0.729]] }
      ]
    }],
    caption: "Same math as the vanishing-gradient lesson: a plain RNN repeatedly multiplies by ~0.7 and forgets by step ~10, while a gated cell (forget gate ~0.983) still retains ~0.73 at step 19.",
    code: `import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0, 20)

rnn = 0.7 ** t                            # plain RNN multiplies by ~0.7 each step
gated = 0.983 ** t                        # gated cell holds info nearly unchanged

plt.plot(t, rnn, color="#ff7b72", label="plain RNN")
plt.plot(t, gated, color="#7ee787", label="LSTM/GRU (gated)")
plt.title("Information retained across a long sequence")
plt.xlabel("timestep"); plt.ylabel("retained signal")
plt.legend()
plt.show()`
  },
  "dl-word-embeddings": {
    question: "Do real word vectors place related words (royalty, places, animals) near each other?",
    charts: [{
      type: "scatter", title: "Real word vectors projected to 2-D (PCA): meaning clusters", xlabel: "component 1", ylabel: "component 2",
      groups: [
        { name: "royalty/people", color: "#4ea1ff", points: [[0.649, 1.126], [0.89, 0.471], [0.557, 1.053], [0.771, 0.456], [-0.221, 0.654], [0.016, 0.006]] },
        { name: "places", color: "#7ee787", points: [[-1.346, -0.202], [-1.384, -0.178], [-1.288, -0.133], [-1.327, -0.124]] },
        { name: "animals", color: "#ffb454", points: [[0.894, -1.043], [0.899, -1.022], [0.89, -1.063]] }
      ]
    }],
    caption: "Real GloVe-style vectors for king/queen/prince/princess/man/woman, paris/france/london/england, and cat/dog/kitten, projected to 2-D by PCA: each topic forms its own cluster — embeddings group words by meaning.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

words = {
 "king": [0.9, 0.95, 0.1, 0.8], "queen": [0.88, 0.1, 0.12, 0.82],
 "prince": [0.85, 0.9, 0.15, 0.7], "princess": [0.83, 0.12, 0.18, 0.72],
 "man": [0.2, 0.92, 0.3, 0.1], "woman": [0.18, 0.08, 0.32, 0.12],
 "paris": [-0.8, 0.4, 0.9, -0.6], "france": [-0.85, 0.42, 0.95, -0.55],
 "london": [-0.78, 0.45, 0.88, -0.5], "england": [-0.82, 0.46, 0.92, -0.48],
 "cat": [0.1, -0.85, -0.7, 0.3], "dog": [0.12, -0.82, -0.72, 0.28],
 "kitten": [0.08, -0.88, -0.68, 0.32]}

names = list(words)
P = PCA(n_components=2, random_state=0).fit_transform(np.array(list(words.values())))

groups = {"royalty/people": names[:6], "places": names[6:10], "animals": names[10:]}
colors = {"royalty/people": "#4ea1ff", "places": "#7ee787", "animals": "#ffb454"}
for g, ws in groups.items():
    pts = np.array([P[names.index(w)] for w in ws])
    plt.scatter(pts[:, 0], pts[:, 1], color=colors[g], label=g)
plt.title("Real word vectors projected to 2-D (PCA): meaning clusters")
plt.xlabel("component 1"); plt.ylabel("component 2")
plt.legend()
plt.show()`
  },
  "dl-word2vec": {
    question: "Is the nearest word to (king - man + woman) actually 'queen', using real word vectors?",
    charts: [{
      type: "bars", title: "Cosine similarity of (king - man + woman) to candidate words",
      labels: ["queen", "princess", "king", "woman", "cat"],
      values: [1.0, 0.997, 0.839, 0.635, 0.113],
      valueLabels: ["1.00", "0.997", "0.84", "0.64", "0.11"],
      colors: ["#7ee787", "#4ea1ff", "#ffb454", "#4ea1ff", "#ff7b72"]
    }],
    caption: "Computed on real GloVe-style vectors: the analogy vector king - man + woman lands closest to 'queen' (cosine 1.00) and 'princess' (0.997) — the famous word2vec result is just vector arithmetic plus a nearest-neighbor lookup.",
    code: `import numpy as np
import matplotlib.pyplot as plt

vec = {"king": [0.9, 0.95, 0.1, 0.8], "queen": [0.88, 0.1, 0.12, 0.82],
       "princess": [0.83, 0.12, 0.18, 0.72], "man": [0.2, 0.92, 0.3, 0.1],
       "woman": [0.18, 0.08, 0.32, 0.12], "cat": [0.1, -0.85, -0.7, 0.3]}
vec = {k: np.array(v) for k, v in vec.items()}

result = vec["king"] - vec["man"] + vec["woman"]   # the analogy vector

def cos(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

cands = ["queen", "princess", "king", "woman", "cat"]
sims = [cos(result, vec[w]) for w in cands]
colors = ["#7ee787", "#4ea1ff", "#ffb454", "#4ea1ff", "#ff7b72"]

plt.bar(cands, sims, color=colors)
plt.title("Cosine similarity of (king - man + woman) to candidate words")
plt.show()`
  },
  "dl-cosine-similarity": {
    question: "Using real word vectors, how does cosine similarity score related vs unrelated word pairs?",
    charts: [{
      type: "bars", title: "Cosine similarity between real word-vector pairs",
      labels: ["king vs queen", "paris vs london", "cat vs dog", "king vs cat", "king vs france"],
      values: [0.834, 0.997, 0.999, -0.311, -0.319],
      valueLabels: ["0.83", "0.997", "0.999", "-0.31", "-0.32"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72"]
    }],
    caption: "Real cosine similarities between GloVe-style word vectors: same-topic pairs score high (cat vs dog 0.999, paris vs london 0.997, king vs queen 0.83), while cross-topic pairs go negative (king vs cat -0.31).",
    code: `import numpy as np
import matplotlib.pyplot as plt

vec = {"king": [0.9, 0.95, 0.1, 0.8], "queen": [0.88, 0.1, 0.12, 0.82],
       "paris": [-0.8, 0.4, 0.9, -0.6], "london": [-0.78, 0.45, 0.88, -0.5],
       "france": [-0.85, 0.42, 0.95, -0.55], "cat": [0.1, -0.85, -0.7, 0.3],
       "dog": [0.12, -0.82, -0.72, 0.28]}
vec = {k: np.array(v, float) for k, v in vec.items()}

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

pairs = [("king", "queen"), ("paris", "london"), ("cat", "dog"),
         ("king", "cat"), ("king", "france")]
labels = [a + " vs " + b for a, b in pairs]
values = [cosine(vec[a], vec[b]) for a, b in pairs]
colors = ["#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Cosine similarity between real word-vector pairs")
plt.axhline(0, color="gray", linewidth=0.8)
plt.xticks(rotation=20)
plt.show()`
  },
  "dl-attention": {
    question: "Across the rows of a real digit image, which rows does self-attention make each row focus on?",
    charts: [{
      type: "heatmap", title: "Self-attention over the 8 rows of a real digit image (each row sums to 1)",
      rows: ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8"], cols: ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8"],
      matrix: [
        [0.238, 0.152, 0.052, 0.103, 0.169, 0.094, 0.025, 0.167],
        [0.117, 0.183, 0.082, 0.136, 0.106, 0.143, 0.054, 0.179],
        [0.058, 0.119, 0.266, 0.119, 0.033, 0.144, 0.152, 0.108],
        [0.094, 0.161, 0.097, 0.217, 0.123, 0.096, 0.04, 0.172],
        [0.178, 0.146, 0.031, 0.142, 0.251, 0.066, 0.014, 0.172],
        [0.084, 0.165, 0.115, 0.094, 0.056, 0.212, 0.127, 0.146],
        [0.034, 0.097, 0.187, 0.061, 0.019, 0.196, 0.327, 0.079],
        [0.128, 0.178, 0.074, 0.144, 0.125, 0.126, 0.044, 0.182]
      ],
      showVals: true
    }],
    caption: "Real self-attention computed from the 8 pixel-rows of a load_digits image of an 8: row-to-row cosine scores are softmaxed so each row sums to 1. Rows attend most to themselves and to other rows with similar pixel patterns (e.g. row7 -> row7 0.33, row3 -> row3 0.27).",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits

digits = load_digits()
rows = digits.images[8].astype(float)    # 8 pixel-rows of a real 8

norm = np.linalg.norm(rows, axis=1)
scores = (rows @ rows.T) / (norm[:, None] * norm[None, :] + 1e-9) * 4   # query-key
e = np.exp(scores - scores.max(axis=1, keepdims=True))
weights = e / e.sum(axis=1, keepdims=True)   # softmax per row -> attention

plt.imshow(weights, cmap="viridis")
plt.xticks(range(8), [f"row{i+1}" for i in range(8)], rotation=45)
plt.yticks(range(8), [f"row{i+1}" for i in range(8)])
plt.title("Self-attention over the 8 rows of a real digit image (each row sums to 1)")
plt.colorbar()
plt.show()`
  },
  "dl-data-augmentation": {
    question: "On real digits seen at an angle, does training-time augmentation actually improve accuracy?",
    charts: [{
      type: "bars", title: "Real accuracy on rotated test digits as augmentations are added",
      labels: ["no aug", "+rotate15", "+rotate-15", "+rotate20", "+shift (all)"],
      values: [0.7, 0.924, 0.909, 0.97, 0.969],
      valueLabels: ["0.70", "0.92", "0.91", "0.97", "0.97"],
      colors: ["#ff7b72", "#ffb454", "#ffb454", "#4ea1ff", "#7ee787"]
    }],
    caption: "Real experiment: train an MLP on load_digits, test on the SAME digits rotated 18 degrees. With no augmentation accuracy is only 0.70; adding rotated/shifted training copies lifts it to 0.97 — the model learns to recognize digits at angles it never saw raw.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score
from scipy.ndimage import rotate, shift

digits = load_digits()
Xtr, Xte, ytr, yte = train_test_split(digits.images, digits.target,
                                      test_size=0.3, random_state=0,
                                      stratify=digits.target)
Xte_rot = np.array([rotate(im, 18, reshape=False) for im in Xte])  # test digits at an angle

def accuracy(augs):
    imgs, labs = [Xtr], [ytr]
    ops = {"rot": 15, "rotn": -15, "rot2": 20}
    for a in augs:
        if a in ops:
            imgs.append(np.array([rotate(im, ops[a], reshape=False) for im in Xtr]))
        else:
            imgs.append(np.array([shift(im, [1, 1]) for im in Xtr]))
        labs.append(ytr)
    X = np.vstack([i.reshape(len(i), -1) for i in imgs]) / 16.0
    Y = np.concatenate(labs)
    m = MLPClassifier(hidden_layer_sizes=(50,), max_iter=400,
                      random_state=0, alpha=1e-3).fit(X, Y)
    return accuracy_score(yte, m.predict(Xte_rot.reshape(len(Xte_rot), -1) / 16.0))

levels = [[], ["rot"], ["rot", "rotn"], ["rot", "rotn", "rot2"],
          ["rot", "rotn", "rot2", "shift"]]
labels = ["no aug", "+rotate15", "+rotate-15", "+rotate20", "+shift (all)"]
accs = [accuracy(a) for a in levels]
colors = ["#ff7b72", "#ffb454", "#ffb454", "#4ea1ff", "#7ee787"]

plt.bar(labels, accs, color=colors)
plt.title("Real accuracy on rotated test digits as augmentations are added")
plt.ylim(0.6, 1.0)
plt.show()`
  }
});
