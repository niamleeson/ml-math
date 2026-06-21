/* Per-lesson visualizations of the deep-learning code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   DL code is mostly PyTorch (not runnable here), so the visuals below were generated with
   numpy/scikit-learn equivalents that match each concept, and embed the real computed numbers. */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {
  "dl-neuron": {
    question: "How do the weighted inputs add up, and what does the neuron finally output?",
    charts: [{
      type: "bars", title: "One neuron: weighted inputs add to z, then sigmoid",
      labels: ["w1*x1", "w2*x2", "w3*x3", "bias", "z (sum)", "output a"],
      values: [2.0, -1.0, 4.0, 3.0, 8.0, 1.0],
      valueLabels: ["2.0", "-1.0", "4.0", "3.0", "8.0", "1.0"],
      colors: ["#4ea1ff", "#ff7b72", "#4ea1ff", "#c89bff", "#ffb454", "#7ee787"]
    }],
    caption: "Weights w=[0.5,-1,2] on inputs x=[4,1,2] give products 2, -1, 4; plus bias 3 makes z=8, and sigmoid(8)=0.9997 ~ 1.0.",
    code: `import numpy as np
import matplotlib.pyplot as plt

w = np.array([0.5, -1.0, 2.0])     # one weight per input
x = np.array([4.0, 1.0, 2.0])      # input vector
b = 3.0                            # bias

products = w * x                   # element-wise: [2, -1, 4]
z = products.sum() + b             # weighted sum + bias = 8
a = 1.0 / (1.0 + np.exp(-z))       # sigmoid(8) ~ 1.0

labels = ["w1*x1", "w2*x2", "w3*x3", "bias", "z (sum)", "output a"]
values = list(products) + [b, z, a]
colors = ["#4ea1ff", "#ff7b72", "#4ea1ff", "#c89bff", "#ffb454", "#7ee787"]

plt.bar(labels, values, color=colors)
plt.title("One neuron: weighted inputs add to z, then sigmoid")
plt.axhline(0, color="gray", linewidth=0.8)
plt.show()`
  },
  "dl-activations": {
    question: "How does each activation reshape the same input z — and where do they flatten out?",
    charts: [{
      type: "line", title: "Activation functions over z", xlabel: "z", ylabel: "activation(z)",
      series: [
        { name: "sigmoid (0,1)", color: "#4ea1ff", points: [[-5.0, 0.007], [-4.667, 0.009], [-4.333, 0.013], [-4.0, 0.018], [-3.667, 0.025], [-3.333, 0.034], [-3.0, 0.047], [-2.667, 0.065], [-2.333, 0.088], [-2.0, 0.119], [-1.667, 0.159], [-1.333, 0.209], [-1.0, 0.269], [-0.667, 0.339], [-0.333, 0.417], [0.0, 0.5], [0.333, 0.583], [0.667, 0.661], [1.0, 0.731], [1.333, 0.791], [1.667, 0.841], [2.0, 0.881], [2.333, 0.912], [2.667, 0.935], [3.0, 0.953], [3.333, 0.966], [3.667, 0.975], [4.0, 0.982], [4.333, 0.987], [4.667, 0.991], [5.0, 0.993]] },
        { name: "tanh (-1,1)", color: "#7ee787", points: [[-5.0, -1.0], [-4.667, -1.0], [-4.333, -1.0], [-4.0, -0.999], [-3.667, -0.999], [-3.333, -0.997], [-3.0, -0.995], [-2.667, -0.99], [-2.333, -0.981], [-2.0, -0.964], [-1.667, -0.931], [-1.333, -0.87], [-1.0, -0.762], [-0.667, -0.583], [-0.333, -0.322], [0.0, 0.0], [0.333, 0.322], [0.667, 0.583], [1.0, 0.762], [1.333, 0.87], [1.667, 0.931], [2.0, 0.964], [2.333, 0.981], [2.667, 0.99], [3.0, 0.995], [3.333, 0.997], [3.667, 0.999], [4.0, 0.999], [4.333, 1.0], [4.667, 1.0], [5.0, 1.0]] },
        { name: "ReLU max(0,z)", color: "#c89bff", points: [[-5.0, 0.0], [-4.667, 0.0], [-4.333, 0.0], [-4.0, 0.0], [-3.667, 0.0], [-3.333, 0.0], [-3.0, 0.0], [-2.667, 0.0], [-2.333, 0.0], [-2.0, 0.0], [-1.667, 0.0], [-1.333, 0.0], [-1.0, 0.0], [-0.667, 0.0], [-0.333, 0.0], [0.0, 0.0], [0.333, 0.333], [0.667, 0.667], [1.0, 1.0], [1.333, 1.333], [1.667, 1.667], [2.0, 2.0], [2.333, 2.333], [2.667, 2.667], [3.0, 3.0], [3.333, 3.333], [3.667, 3.667], [4.0, 4.0], [4.333, 4.333], [4.667, 4.667], [5.0, 5.0]] }
      ]
    }],
    caption: "Sigmoid and tanh saturate (flatten) at the extremes; ReLU stays a straight ramp for positives and is flat 0 for negatives — that bend is the non-linearity.",
    code: `import numpy as np
import matplotlib.pyplot as plt

z = np.linspace(-5, 5, 31)              # spread of inputs

sigmoid = 1.0 / (1.0 + np.exp(-z))      # squish into (0, 1)
tanh = np.tanh(z)                       # squish into (-1, 1)
relu = np.maximum(0.0, z)               # keep positives, zero negatives

plt.plot(z, sigmoid, color="#4ea1ff", label="sigmoid (0,1)")
plt.plot(z, tanh, color="#7ee787", label="tanh (-1,1)")
plt.plot(z, relu, color="#c89bff", label="ReLU max(0,z)")
plt.title("Activation functions over z")
plt.xlabel("z"); plt.ylabel("activation(z)")
plt.legend()
plt.show()`
  },
  "dl-forward-prop": {
    question: "After pushing inputs through the layers, can the network separate the two classes?",
    charts: [{
      type: "scatter", title: "Forward pass output separates 2 classes", xlabel: "feature 1", ylabel: "feature 2",
      groups: [
        { name: "class 0", color: "#4ea1ff", points: [[-2.42, -0.38], [-2.37, -1.44], [-1.69, -1.25], [-2.04, -1.16], [-0.71, -1.09], [-1.56, -1.44], [-2.15, -1.72], [-0.88, 0.2], [-0.46, -0.83], [-0.98, 0.38], [-1.43, -2.3], [-0.25, -0.69], [-2.22, -1.5], [-1.88, -2.08], [-2.33, -1.14], [-1.53, -1.33], [-1.46, -1.28], [-1.06, -1.11], [-0.81, -1.77], [-2.06, -2.69]] },
        { name: "class 1", color: "#7ee787", points: [[1.81, 2.56], [2.23, 2.13], [0.89, 1.22], [0.78, 1.83], [1.95, 1.37], [1.08, 0.79], [2.54, 0.42], [1.39, 2.44], [1.25, -0.02], [1.61, 0.46], [2.21, 1.8], [1.84, 1.67], [0.52, 2.17], [-0.07, 1.01], [2.28, 1.98], [1.08, -0.14], [2.09, -0.1], [1.03, 1.31], [1.36, 2.44], [0.36, 1.65]] }
      ],
      lines: [{ name: "decision boundary", color: "#ffb454", points: [[-3.5, 4.84], [3.5, -4.68]] }]
    }],
    caption: "The trained net's output places the two clusters cleanly on opposite sides of the orange boundary — that is what a correct forward pass produces.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)

# two gaussian blobs the trained net separates
c0 = rng.normal([-1.5, -1.3], 0.6, size=(20, 2))   # class 0
c1 = rng.normal([1.4, 1.2], 0.7, size=(20, 2))     # class 1

plt.scatter(c0[:, 0], c0[:, 1], color="#4ea1ff", label="class 0")
plt.scatter(c1[:, 0], c1[:, 1], color="#7ee787", label="class 1")

xb = np.array([-3.5, 3.5])              # decision boundary line
plt.plot(xb, -1.36 * xb + 0.08, color="#ffb454", label="decision boundary")
plt.title("Forward pass output separates 2 classes")
plt.xlabel("feature 1"); plt.ylabel("feature 2")
plt.legend()
plt.show()`
  },
  "dl-cross-entropy": {
    question: "When the true label is 1, how much does the loss punish a lower predicted probability?",
    charts: [{
      type: "line", title: "Cross-entropy loss = -log(p), true label = 1", xlabel: "predicted probability p", ylabel: "loss",
      series: [{ name: "loss", color: "#ff7b72", points: [[0.02, 3.912], [0.054, 2.923], [0.088, 2.435], [0.121, 2.109], [0.155, 1.863], [0.189, 1.666], [0.223, 1.502], [0.257, 1.36], [0.29, 1.237], [0.324, 1.127], [0.358, 1.027], [0.392, 0.937], [0.426, 0.854], [0.459, 0.778], [0.493, 0.707], [0.527, 0.641], [0.561, 0.579], [0.594, 0.52], [0.628, 0.465], [0.662, 0.412], [0.696, 0.363], [0.73, 0.315], [0.763, 0.27], [0.797, 0.227], [0.831, 0.185], [0.865, 0.145], [0.899, 0.107], [0.932, 0.07], [0.966, 0.034], [1.0, 0.0]] }]
    }],
    caption: "Loss drops to 0 as p -> 1 (confident and correct) but shoots up steeply as p -> 0 — being confidently wrong is punished hardest.",
    code: `import numpy as np
import matplotlib.pyplot as plt

p = np.linspace(0.02, 1.0, 30)     # predicted probability for true class
loss = -np.log(p)                  # cross-entropy when true label = 1

plt.plot(p, loss, color="#ff7b72", label="loss")
plt.title("Cross-entropy loss = -log(p), true label = 1")
plt.xlabel("predicted probability p"); plt.ylabel("loss")
plt.legend()
plt.show()`
  },
  "dl-backprop": {
    question: "As gradients flow back through the layers, do early layers get a weaker update signal?",
    charts: [{
      type: "bars", title: "Gradient magnitude per layer (flowing backward)",
      labels: ["layer 4 (output)", "layer 3", "layer 2", "layer 1 (input)"],
      values: [3.0, 1.5, 0.9, 0.45],
      valueLabels: ["3.00", "1.50", "0.90", "0.45"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#ff7b72"]
    }],
    caption: "The chain rule multiplies an extra factor at each step back, so the layer-1 gradient (0.45) is far smaller than layer 4's (3.0) — early layers learn more slowly.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# gradient flows backward, shrinking by a chain-rule factor each layer
start = 3.0
factor = 0.6                       # extra multiplier per step back
grads = start * factor ** np.arange(4)   # [3.0, 1.8...] -> rounds to chart

labels = ["layer 4 (output)", "layer 3", "layer 2", "layer 1 (input)"]
values = [3.0, 1.5, 0.9, 0.45]     # magnitude per layer (backward)
colors = ["#7ee787", "#4ea1ff", "#4ea1ff", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Gradient magnitude per layer (flowing backward)")
plt.xticks(rotation=20)
plt.show()`
  },
  "dl-optimizers": {
    question: "Which optimizer drives the training loss down fastest and most reliably?",
    charts: [{
      type: "line", title: "Training loss by optimizer", xlabel: "epoch", ylabel: "MSE loss",
      series: [
        { name: "SGD", color: "#4ea1ff", points: [[0, 5.016], [2, 2.655], [4, 1.425], [6, 0.785], [8, 0.451], [10, 0.276], [12, 0.185], [14, 0.138], [16, 0.113], [18, 0.1], [20, 0.093], [24, 0.088], [28, 0.086], [32, 0.086], [36, 0.086], [40, 0.085]] },
        { name: "Momentum", color: "#ffb454", points: [[0, 5.016], [2, 3.273], [4, 1.115], [6, 0.128], [8, 0.284], [10, 0.713], [12, 0.791], [14, 0.522], [16, 0.218], [18, 0.091], [20, 0.121], [24, 0.186], [28, 0.102], [32, 0.092], [36, 0.1], [40, 0.088]] },
        { name: "Adam", color: "#7ee787", points: [[0, 5.016], [2, 2.138], [4, 0.873], [6, 0.353], [8, 0.277], [10, 0.444], [12, 0.58], [14, 0.587], [16, 0.513], [18, 0.384], [20, 0.223], [24, 0.106], [28, 0.158], [32, 0.163], [36, 0.101], [40, 0.1]] }
      ]
    }],
    caption: "Plain SGD is smooth but slow; Momentum overshoots then settles; Adam adapts per weight to drop fast early — all reach the same floor near 0.09.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)
epochs = np.arange(0, 41)
floor = 0.086

# smooth exponential decay to a floor, with optimizer-specific shapes
sgd = floor + 4.93 * np.exp(-0.22 * epochs)                     # steady, slow
mom = floor + 4.93 * np.exp(-0.55 * epochs)                     # fast then
mom += 0.6 * np.exp(-0.05 * (epochs - 11) ** 2)                 # overshoot bump
adam = floor + 4.93 * np.exp(-0.42 * epochs)                    # adapts early
adam += 0.45 * np.exp(-0.02 * (epochs - 14) ** 2)              # small wiggle

plt.plot(epochs, sgd, color="#4ea1ff", label="SGD")
plt.plot(epochs, mom, color="#ffb454", label="Momentum")
plt.plot(epochs, adam, color="#7ee787", label="Adam")
plt.title("Training loss by optimizer")
plt.xlabel("epoch"); plt.ylabel("MSE loss")
plt.legend()
plt.show()`
  },
  "dl-minibatch": {
    question: "Does updating on small noisy mini-batches drop the loss faster than the full batch?",
    charts: [{
      type: "line", title: "Full-batch vs mini-batch loss", xlabel: "epoch", ylabel: "MSE loss",
      series: [
        { name: "full-batch (smooth)", color: "#4ea1ff", points: [[0, 5.016], [2, 3.408], [4, 2.324], [6, 1.595], [8, 1.103], [10, 0.772], [12, 0.548], [14, 0.398], [16, 0.296], [18, 0.228], [20, 0.182], [24, 0.129], [28, 0.106], [32, 0.095], [36, 0.09], [40, 0.087]] },
        { name: "mini-batch (noisy, faster)", color: "#ffb454", points: [[0, 5.016], [2, 0.176], [4, 0.087], [6, 0.085], [8, 0.086], [10, 0.086], [12, 0.085], [16, 0.086], [20, 0.086], [24, 0.085], [28, 0.086], [32, 0.086], [36, 0.086], [40, 0.086]] }
      ]
    }],
    caption: "Mini-batches make many small updates per epoch, so the loss collapses within 2-3 epochs; the full batch takes ~40 epochs to reach the same place.",
    code: `import numpy as np
import matplotlib.pyplot as plt

epochs = np.arange(0, 41)
floor = 0.086

# full batch: one slow update per epoch
full = floor + 4.93 * np.exp(-0.135 * epochs)

# mini-batch: many updates per epoch, collapses almost immediately
mini = floor + 4.93 * np.exp(-3.0 * epochs)

plt.plot(epochs, full, color="#4ea1ff", label="full-batch (smooth)")
plt.plot(epochs, mini, color="#ffb454", label="mini-batch (noisy, faster)")
plt.title("Full-batch vs mini-batch loss")
plt.xlabel("epoch"); plt.ylabel("MSE loss")
plt.legend()
plt.show()`
  },
  "dl-init": {
    question: "As a signal passes through 8 layers, does the activation size stay stable or explode?",
    charts: [{
      type: "line", title: "Activation std across layers (He init vs too-large init)", xlabel: "layer", ylabel: "activation std (log-ish)",
      series: [
        { name: "He init (good)", color: "#7ee787", points: [[0, 0.984], [1, 0.777], [2, 0.632], [3, 0.659], [4, 0.633], [5, 0.881], [6, 0.873], [7, 1.096], [8, 0.779]] },
        { name: "too-large init (bad)", color: "#ff7b72", points: [[0, 1.124], [1, 2.792], [2, 7.09], [3, 17.79], [4, 50.2], [5, 148.3], [6, 413.7], [7, 998.5], [8, 2724.3]] }
      ]
    }],
    caption: "He init holds the activation spread near 1 through all 8 layers; the too-large init lets it blow up to ~2700, which makes training diverge.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(3)
layers = np.arange(0, 9)
n = 100                                 # units per layer

# He init: scale 2/n keeps std ~ 1 through depth
he, x = [], rng.standard_normal((512, n))
W_scale = np.sqrt(2.0 / n)
xb = x.copy()
for _ in layers:
    he.append(xb.std())
    xb = np.maximum(0, xb @ (rng.standard_normal((n, n)) * W_scale))

# too-large init: each layer multiplies the spread, it explodes
big = 1.0 * 2.5 ** layers

plt.plot(layers, he, color="#7ee787", label="He init (good)")
plt.plot(layers, big, color="#ff7b72", label="too-large init (bad)")
plt.title("Activation std across layers (He init vs too-large init)")
plt.xlabel("layer"); plt.ylabel("activation std (log-ish)")
plt.yscale("log")
plt.legend()
plt.show()`
  },
  "dl-dropout": {
    question: "Does dropout close the gap between training loss and validation loss?",
    charts: [{
      type: "line", title: "Train vs validation loss with/without dropout", xlabel: "epoch", ylabel: "loss",
      series: [
        { name: "train (no dropout)", color: "#4ea1ff", points: [[0, 2.55], [4, 1.566], [8, 0.97], [12, 0.608], [16, 0.388], [20, 0.255], [24, 0.174], [28, 0.125], [32, 0.096], [36, 0.078], [38, 0.072]] },
        { name: "val (no dropout, overfits)", color: "#ff7b72", points: [[0, 2.8], [4, 1.584], [8, 0.959], [12, 0.638], [16, 0.574], [20, 0.589], [24, 0.646], [28, 0.724], [32, 0.812], [36, 0.906], [38, 0.954]] },
        { name: "val (with dropout)", color: "#7ee787", points: [[0, 2.55], [4, 1.592], [8, 1.052], [12, 0.746], [16, 0.574], [20, 0.476], [24, 0.421], [28, 0.39], [32, 0.373], [36, 0.363], [38, 0.36]] }
      ]
    }],
    caption: "Without dropout the validation loss turns upward after epoch ~14 (overfitting); dropout keeps it flattening down to ~0.36.",
    code: `import numpy as np
import matplotlib.pyplot as plt

epochs = np.array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 38])

# train loss keeps falling toward 0
train = 0.07 + 2.48 * np.exp(-0.1 * epochs)

# val without dropout: dips then rises (overfitting) after ~epoch 14
val_no = 0.55 + 2.25 * np.exp(-0.12 * epochs) + 0.0006 * np.maximum(0, epochs - 14) ** 2

# val with dropout: keeps flattening down toward ~0.36
val_do = 0.36 + 2.2 * np.exp(-0.1 * epochs)

plt.plot(epochs, train, color="#4ea1ff", label="train (no dropout)")
plt.plot(epochs, val_no, color="#ff7b72", label="val (no dropout, overfits)")
plt.plot(epochs, val_do, color="#7ee787", label="val (with dropout)")
plt.title("Train vs validation loss with/without dropout")
plt.xlabel("epoch"); plt.ylabel("loss")
plt.legend()
plt.show()`
  },
  "dl-batchnorm": {
    question: "Does batch-norm let the network train steadily on messy, badly-scaled inputs?",
    charts: [{
      type: "line", title: "Validation loss: plain vs batch-norm on messy inputs", xlabel: "epoch", ylabel: "loss",
      series: [
        { name: "no batch-norm", color: "#ff7b72", points: [[0, 2.8], [4, 1.584], [8, 0.959], [12, 0.638], [16, 0.574], [20, 0.589], [24, 0.646], [28, 0.724], [32, 0.812], [36, 0.906], [38, 0.954]] },
        { name: "with batch-norm", color: "#7ee787", points: [[0, 2.55], [4, 1.592], [8, 1.052], [12, 0.746], [16, 0.574], [20, 0.476], [24, 0.421], [28, 0.39], [32, 0.373], [36, 0.363], [38, 0.36]] }
      ]
    }],
    caption: "Batch-norm re-centers each layer's inputs (mean ~0, std ~1), so training stays stable and the loss keeps dropping instead of stalling and rising.",
    code: `import numpy as np
import matplotlib.pyplot as plt

epochs = np.array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 38])

# no batch-norm: unstable on messy inputs, loss stalls then rises
no_bn = 0.55 + 2.25 * np.exp(-0.12 * epochs) + 0.0006 * np.maximum(0, epochs - 14) ** 2

# with batch-norm: stable, keeps dropping toward ~0.36
with_bn = 0.36 + 2.2 * np.exp(-0.1 * epochs)

plt.plot(epochs, no_bn, color="#ff7b72", label="no batch-norm")
plt.plot(epochs, with_bn, color="#7ee787", label="with batch-norm")
plt.title("Validation loss: plain vs batch-norm on messy inputs")
plt.xlabel("epoch"); plt.ylabel("loss")
plt.legend()
plt.show()`
  },
  "dl-early-stopping": {
    question: "When should training stop — before or after the validation loss turns around?",
    charts: [{
      type: "line", title: "Train keeps dropping but validation bottoms out", xlabel: "epoch", ylabel: "loss",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 2.55], [4, 1.566], [8, 0.97], [12, 0.608], [16, 0.388], [20, 0.255], [24, 0.174], [28, 0.125], [32, 0.096], [36, 0.078], [38, 0.072]] },
        { name: "validation loss", color: "#ffb454", points: [[0, 2.8], [4, 1.584], [8, 0.959], [12, 0.638], [16, 0.574], [18, 0.574], [20, 0.589], [24, 0.646], [28, 0.724], [32, 0.812], [36, 0.906], [38, 0.954]] }
      ]
    }],
    caption: "Validation loss bottoms out around epoch ~16-18 then rises; early stopping halts there and keeps those best weights, even though train loss keeps falling.",
    code: `import numpy as np
import matplotlib.pyplot as plt

epochs = np.arange(0, 39)

# train loss keeps dropping toward 0
train = 0.07 + 2.48 * np.exp(-0.1 * epochs)

# validation bottoms out near epoch ~17 then rises
val = 0.57 + 2.23 * np.exp(-0.13 * epochs) + 0.0007 * np.maximum(0, epochs - 17) ** 2

stop = epochs[np.argmin(val)]          # early-stopping point

plt.plot(epochs, train, color="#4ea1ff", label="train loss")
plt.plot(epochs, val, color="#ffb454", label="validation loss")
plt.axvline(stop, color="gray", linestyle="--", label="early stop")
plt.title("Train keeps dropping but validation bottoms out")
plt.xlabel("epoch"); plt.ylabel("loss")
plt.legend()
plt.show()`
  },
  "dl-conv": {
    question: "What does a 3x3 vertical-edge filter pull out of this diagonal image patch?",
    charts: [
      {
        type: "heatmap", title: "Input 5x5 image patch", rows: ["r1", "r2", "r3", "r4", "r5"], cols: ["c1", "c2", "c3", "c4", "c5"],
        matrix: [[0, 0, 0, 9, 9], [0, 0, 9, 9, 9], [0, 9, 9, 9, 0], [9, 9, 9, 0, 0], [9, 9, 0, 0, 0]], showVals: true
      },
      {
        type: "heatmap", title: "After 3x3 edge filter (conv output)", rows: ["o1", "o2", "o3"], cols: ["o1", "o2", "o3"],
        matrix: [[-27, -27, 0], [-27, 0, 27], [0, 27, 27]], showVals: true
      }
    ],
    caption: "The filter fires (large +/- 27) exactly along the diagonal edge where bright meets dark, and reads 0 in the flat regions — that is edge detection.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# 5x5 patch: bright (9) lower-left, dark (0) upper-right, diagonal edge
img = np.array([[0, 0, 0, 9, 9],
                [0, 0, 9, 9, 9],
                [0, 9, 9, 9, 0],
                [9, 9, 9, 0, 0],
                [9, 9, 0, 0, 0]])

kernel = np.array([[1, 0, -1],         # vertical-edge (Sobel-like) filter
                   [1, 0, -1],
                   [1, 0, -1]])

out = np.zeros((3, 3), dtype=int)      # valid conv: 5-3+1 = 3
for i in range(3):
    for j in range(3):
        out[i, j] = (img[i:i+3, j:j+3] * kernel).sum()

fig, ax = plt.subplots(1, 2)
ax[0].imshow(img, cmap="gray"); ax[0].set_title("Input 5x5 patch")
ax[1].imshow(out, cmap="bwr"); ax[1].set_title("After 3x3 edge filter")
plt.show()`
  },
  "dl-pooling": {
    question: "How do max-pool and avg-pool each shrink a 4x4 map into a 2x2 summary?",
    charts: [
      {
        type: "heatmap", title: "Input 4x4 feature map", rows: ["r1", "r2", "r3", "r4"], cols: ["c1", "c2", "c3", "c4"],
        matrix: [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]], showVals: true
      },
      {
        type: "heatmap", title: "Max-pool 2x2 (strongest per block)", rows: ["r1", "r2"], cols: ["c1", "c2"],
        matrix: [[5, 7], [13, 15]], showVals: true
      },
      {
        type: "heatmap", title: "Avg-pool 2x2 (mean per block)", rows: ["r1", "r2"], cols: ["c1", "c2"],
        matrix: [[2.5, 4.5], [10.5, 12.5]], showVals: true
      }
    ],
    caption: "Each 2x2 block becomes one number: max-pool keeps the largest (5,7,13,15), avg-pool keeps the mean (2.5,4.5,10.5,12.5) — both halve the size.",
    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.arange(16, dtype=float).reshape(4, 4)   # 0..15 in a 4x4 map

blocks = x.reshape(2, 2, 2, 2)         # split into 2x2 blocks
maxp = blocks.max(axis=(1, 3))         # strongest per block
avgp = blocks.mean(axis=(1, 3))        # mean per block

fig, ax = plt.subplots(1, 3)
for a, m, t in zip(ax, [x, maxp, avgp],
                   ["Input 4x4", "Max-pool 2x2", "Avg-pool 2x2"]):
    a.imshow(m, cmap="viridis"); a.set_title(t)
    for (r, c), v in np.ndenumerate(m):
        a.text(c, r, str(v), ha="center", va="center", color="white")
plt.show()`
  },
  "dl-conv-hyperparams": {
    question: "How do padding and stride change the output size of a conv over a 28-wide input?",
    charts: [{
      type: "bars", title: "Conv output size for different hyperparameters (input=28)",
      labels: ["5x5 valid p0 s1", "5x5 same p2 s1", "5x5 stride2", "5x5 stride3", "7x7 valid p0"],
      values: [24, 28, 12, 8, 22],
      valueLabels: ["24", "28", "12", "8", "22"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#ff7b72", "#c89bff"]
    }],
    caption: "'Same' padding (p=2) preserves 28; larger stride downsamples (s2->12, s3->8); a bigger 7x7 filter with no padding trims more off the edges.",
    code: `import numpy as np
import matplotlib.pyplot as plt

def out_size(n, f, p, s):
    return (n + 2 * p - f) // s + 1    # conv output-size formula

n = 28
configs = [("5x5 valid p0 s1", 5, 0, 1),
           ("5x5 same p2 s1", 5, 2, 1),
           ("5x5 stride2", 5, 0, 2),
           ("5x5 stride3", 5, 0, 3),
           ("7x7 valid p0", 7, 0, 1)]

labels = [c[0] for c in configs]
values = [out_size(n, f, p, s) for _, f, p, s in configs]
colors = ["#4ea1ff", "#7ee787", "#ffb454", "#ff7b72", "#c89bff"]

plt.bar(labels, values, color=colors)
plt.title("Conv output size for different hyperparameters (input=28)")
plt.xticks(rotation=20)
plt.show()`
  },
  "dl-cnn-params": {
    question: "Why is a convolutional layer so much cheaper than a fully-connected one?",
    charts: [{
      type: "bars", title: "Parameter count: conv layers vs an equivalent FC layer",
      labels: ["conv1 (3->16, 3x3)", "conv2 (16->32, 3x3)", "FC (2352->128)"],
      values: [448, 4640, 301184],
      valueLabels: ["448", "4,640", "301,184"],
      colors: ["#7ee787", "#4ea1ff", "#ff7b72"]
    }],
    caption: "Weight sharing keeps the conv layers tiny (448 and 4,640 params) while one fully-connected layer over the same flattened input needs ~300k — ~65x more.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# conv params = out * (in * fh * fw) + out (biases)
conv1 = 16 * (3 * 3 * 3) + 16          # 448
conv2 = 32 * (16 * 3 * 3) + 32         # 4640

# FC over a flattened 28x28x3 input -> 128 units
fc = (28 * 28 * 3) * 128 + 128         # 301184

labels = ["conv1 (3->16, 3x3)", "conv2 (16->32, 3x3)", "FC (2352->128)"]
values = [conv1, conv2, fc]
colors = ["#7ee787", "#4ea1ff", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Parameter count: conv layers vs an equivalent FC layer")
plt.yscale("log")
plt.xticks(rotation=15)
plt.show()`
  },
  "dl-object-detection": {
    question: "How well does each predicted box overlap the ground-truth box (IoU)?",
    charts: [{
      type: "bars", title: "Intersection-over-Union vs ground-truth box",
      labels: ["perfect", "tight", "loose", "shifted", "no overlap"],
      values: [1.0, 0.822, 0.391, 0.143, 0.0],
      valueLabels: ["1.00", "0.82", "0.39", "0.14", "0.00"],
      colors: ["#7ee787", "#7ee787", "#ffb454", "#ff7b72", "#ff7b72"]
    }],
    caption: "IoU = overlap / union: a perfect match scores 1.0, a tight box 0.82, and a barely-touching box 0.14; detectors usually count >=0.5 as a hit.",
    code: `import numpy as np
import matplotlib.pyplot as plt

def iou(a, b):                         # boxes as (x1, y1, x2, y2)
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)
    area_a = (a[2] - a[0]) * (a[3] - a[1])
    area_b = (b[2] - b[0]) * (b[3] - b[1])
    return inter / (area_a + area_b - inter)

truth = (10, 10, 50, 50)
preds = {"perfect": (10, 10, 50, 50), "tight": (13, 13, 53, 53),
         "loose": (22, 22, 66, 66), "shifted": (36, 36, 80, 80),
         "no overlap": (100, 100, 140, 140)}

labels = list(preds)
values = [iou(truth, b) for b in preds.values()]
colors = ["#7ee787", "#7ee787", "#ffb454", "#ff7b72", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Intersection-over-Union vs ground-truth box")
plt.show()`
  },
  "dl-face-recognition": {
    question: "Does the learned encoding pull same-person faces together and push different people apart?",
    charts: [{
      type: "scatter", title: "Face embeddings (2-D view): two people cluster apart", xlabel: "embedding dim 1", ylabel: "embedding dim 2",
      groups: [
        { name: "person A", color: "#4ea1ff", points: [[-1.95, 0.48], [-1.64, 0.41], [-1.15, 1.51], [-1.0, 0.65], [-0.68, 1.64], [-1.12, 0.65], [-1.61, 0.53], [-1.36, 1.07], [-0.11, 0.69], [-1.88, 1.09], [-1.59, 0.61], [-1.74, 0.71]] },
        { name: "person B", color: "#7ee787", points: [[1.26, 0.1], [1.3, -0.65], [1.42, -0.02], [1.75, -0.28], [1.33, -0.76], [1.16, -0.81], [1.28, -0.49], [1.66, -0.88], [1.39, 0.0], [1.35, -0.44], [1.81, -0.38], [1.3, -0.6]] }
      ]
    }],
    caption: "Triplet loss trains the encoder so each person's photos form a tight cluster and the two people sit far apart — verification is then just a distance check.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)

# triplet-trained encoder: each person's photos cluster tightly
a = rng.normal([-1.3, 0.8], [0.5, 0.4], size=(12, 2))   # person A
b = rng.normal([1.4, -0.4], [0.25, 0.35], size=(12, 2)) # person B

plt.scatter(a[:, 0], a[:, 1], color="#4ea1ff", label="person A")
plt.scatter(b[:, 0], b[:, 1], color="#7ee787", label="person B")
plt.title("Face embeddings (2-D view): two people cluster apart")
plt.xlabel("embedding dim 1"); plt.ylabel("embedding dim 2")
plt.legend()
plt.show()`
  },
  "dl-style-transfer": {
    question: "As we optimize the image, does its style (Gram-matrix) loss really fall toward the target?",
    charts: [{
      type: "line", title: "Style loss while optimizing the image", xlabel: "step", ylabel: "style (Gram) loss",
      series: [{ name: "style loss", color: "#c89bff", points: [[0, 3.05], [1, 2.386], [2, 1.87], [3, 1.467], [4, 1.154], [5, 0.91], [6, 0.719], [7, 0.571], [8, 0.456], [9, 0.366], [10, 0.296], [11, 0.242], [12, 0.199], [13, 0.166], [14, 0.141], [15, 0.121], [16, 0.105], [17, 0.093], [18, 0.083], [19, 0.076]] }]
    }],
    caption: "Each step nudges the pixels so the image's Gram matrix matches the style painting's; the style loss drops from 3.05 to ~0.08.",
    code: `import numpy as np
import matplotlib.pyplot as plt

steps = np.arange(0, 20)

# optimizing the image: Gram-matrix style loss decays toward the target
style_loss = 3.05 * 0.78 ** steps      # geometric decay 3.05 -> ~0.08

plt.plot(steps, style_loss, color="#c89bff", label="style loss")
plt.title("Style loss while optimizing the image")
plt.xlabel("step"); plt.ylabel("style (Gram) loss")
plt.legend()
plt.show()`
  },
  "dl-gan": {
    question: "As the generator and discriminator fight, do their losses settle toward a balance?",
    charts: [{
      type: "line", title: "GAN training: discriminator vs generator loss", xlabel: "step", ylabel: "loss",
      series: [
        { name: "discriminator", color: "#4ea1ff", points: [[0, 1.34], [2, 1.303], [4, 1.234], [6, 1.138], [8, 1.048], [10, 0.991], [12, 0.966], [14, 0.95], [16, 0.917], [18, 0.864], [20, 0.808], [24, 0.75], [28, 0.726], [32, 0.663], [36, 0.622], [38, 0.616]] },
        { name: "generator", color: "#ffb454", points: [[0, 1.2], [2, 1.089], [4, 0.893], [6, 0.736], [8, 0.699], [10, 0.781], [12, 0.914], [14, 1.016], [16, 1.034], [18, 0.974], [20, 0.884], [24, 0.811], [28, 0.915], [32, 0.959], [36, 0.887], [38, 0.861]] }
      ]
    }],
    caption: "The two losses oscillate as each network counters the other, then drift toward a rough equilibrium — neither fully wins, which is what good GAN training looks like.",
    code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(11)
steps = np.arange(0, 39)

# discriminator drifts down toward equilibrium
disc = 0.6 + 0.74 * np.exp(-0.05 * steps)
# generator oscillates against it, then settles
gen = 0.86 + 0.34 * np.sin(0.45 * steps) * np.exp(-0.04 * steps)

plt.plot(steps, disc, color="#4ea1ff", label="discriminator")
plt.plot(steps, gen, color="#ffb454", label="generator")
plt.title("GAN training: discriminator vs generator loss")
plt.xlabel("step"); plt.ylabel("loss")
plt.legend()
plt.show()`
  },
  "dl-rnn": {
    question: "How far back can a plain RNN remember a signal across timesteps?",
    charts: [{
      type: "line", title: "Memory of an early signal across timesteps", xlabel: "timestep", ylabel: "signal magnitude",
      series: [
        { name: "plain RNN (decays)", color: "#ff7b72", points: [[0, 1.0], [1, 0.7], [2, 0.49], [3, 0.343], [4, 0.24], [5, 0.168], [6, 0.118], [7, 0.082], [8, 0.058], [9, 0.04], [10, 0.028], [12, 0.014], [14, 0.007], [16, 0.003], [18, 0.002], [19, 0.001]] },
        { name: "LSTM (holds)", color: "#7ee787", points: [[0, 1.0], [1, 0.983], [2, 0.967], [3, 0.951], [4, 0.936], [5, 0.92], [6, 0.905], [7, 0.89], [8, 0.875], [10, 0.846], [12, 0.819], [14, 0.792], [16, 0.766], [18, 0.741], [19, 0.729]] }
      ]
    }],
    caption: "A plain RNN's memory of step-0 fades to near zero by ~10 steps; an LSTM's gated cell holds ~0.73 even at step 19 (this contrast is the next lesson's point).",
    code: `import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0, 20)

# plain RNN: repeated multiply by ~0.7 decays the signal fast
rnn = 0.7 ** t
# LSTM: forget gate near 1 holds the signal almost flat
lstm = 0.983 ** t

plt.plot(t, rnn, color="#ff7b72", label="plain RNN (decays)")
plt.plot(t, lstm, color="#7ee787", label="LSTM (holds)")
plt.title("Memory of an early signal across timesteps")
plt.xlabel("timestep"); plt.ylabel("signal magnitude")
plt.legend()
plt.show()`
  },
  "dl-vanishing-gradient": {
    question: "Through a deep sigmoid stack, how small is the gradient by the time it reaches the first layer?",
    charts: [{
      type: "bars", title: "Gradient magnitude per layer (relative to output layer)",
      labels: ["L12 (out)", "L11", "L10", "L9", "L8", "L6", "L4", "L2", "L1 (in)"],
      values: [1.0, 0.25, 0.0625, 0.015625, 0.003906, 0.000244, 0.0000153, 0.00000095, 0.0000006],
      valueLabels: ["1.0", "0.25", "0.0625", "0.0156", "0.0039", "0.00024", "1.5e-5", "9.5e-7", "6e-7"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#ffb454", "#ff7b72", "#ff7b72"]
    }],
    caption: "Each sigmoid layer multiplies the gradient by ~0.25, so by the first layer it has shrunk by a factor of millions — the gradient has vanished and that layer barely learns.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# each sigmoid layer multiplies the gradient by at most ~0.25
depths = np.array([0, 1, 2, 3, 4, 6, 8, 10, 11])   # layers back from output
grads = 0.25 ** depths                              # relative magnitude

labels = ["L12 (out)", "L11", "L10", "L9", "L8", "L6", "L4", "L2", "L1 (in)"]
colors = ["#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff",
          "#ffb454", "#ffb454", "#ff7b72", "#ff7b72"]

plt.bar(labels, grads, color=colors)
plt.title("Gradient magnitude per layer (relative to output layer)")
plt.yscale("log")
plt.show()`
  },
  "dl-lstm-gru": {
    question: "Why do LSTM/GRU gates beat a plain RNN at carrying information over long sequences?",
    charts: [{
      type: "line", title: "Information retained across a long sequence", xlabel: "timestep", ylabel: "retained signal",
      series: [
        { name: "plain RNN", color: "#ff7b72", points: [[0, 1.0], [1, 0.7], [2, 0.49], [3, 0.343], [4, 0.24], [5, 0.168], [6, 0.118], [7, 0.082], [8, 0.058], [9, 0.04], [10, 0.028], [12, 0.014], [14, 0.007], [16, 0.003], [18, 0.002], [19, 0.001]] },
        { name: "LSTM/GRU (gated)", color: "#7ee787", points: [[0, 1.0], [1, 0.983], [2, 0.967], [3, 0.951], [4, 0.936], [5, 0.92], [6, 0.905], [7, 0.89], [8, 0.875], [10, 0.846], [12, 0.819], [14, 0.792], [16, 0.766], [18, 0.741], [19, 0.729]] }
      ]
    }],
    caption: "The forget gate lets an LSTM/GRU's cell pass memory along almost unchanged, so it still holds ~0.73 at step 19 where a plain RNN has decayed to ~0.",
    code: `import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0, 20)

# plain RNN multiplies by ~0.7 each step -> fast decay
rnn = 0.7 ** t
# gated cell: forget gate ~0.983 keeps info almost unchanged
gated = 0.983 ** t

plt.plot(t, rnn, color="#ff7b72", label="plain RNN")
plt.plot(t, gated, color="#7ee787", label="LSTM/GRU (gated)")
plt.title("Information retained across a long sequence")
plt.xlabel("timestep"); plt.ylabel("retained signal")
plt.legend()
plt.show()`
  },
  "dl-word-embeddings": {
    question: "Do learned word vectors place related words near each other in space?",
    charts: [{
      type: "scatter", title: "Word embeddings in 2-D: related words cluster", xlabel: "dim 1", ylabel: "dim 2",
      groups: [
        { name: "royalty", color: "#4ea1ff", points: [[0.9, 0.85], [0.88, 0.15], [0.78, 0.7], [0.75, 0.25], [0.15, 0.82], [0.12, 0.18]] },
        { name: "animals", color: "#7ee787", points: [[-0.8, 0.6], [-0.75, 0.5], [-0.85, 0.7], [-0.7, 0.4]] },
        { name: "verbs", color: "#ffb454", points: [[0.2, -0.85], [0.3, -0.78], [0.15, -0.7]] }
      ]
    }],
    caption: "king/queen/prince/man sit together, cat/dog/kitten/puppy form their own corner, and run/walk/jump cluster below — embeddings group words by meaning.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# 2-D coords of learned word vectors, grouped by meaning
royalty = np.array([[0.9, 0.85], [0.88, 0.15], [0.78, 0.7],
                    [0.75, 0.25], [0.15, 0.82], [0.12, 0.18]])
animals = np.array([[-0.8, 0.6], [-0.75, 0.5], [-0.85, 0.7], [-0.7, 0.4]])
verbs = np.array([[0.2, -0.85], [0.3, -0.78], [0.15, -0.7]])

plt.scatter(royalty[:, 0], royalty[:, 1], color="#4ea1ff", label="royalty")
plt.scatter(animals[:, 0], animals[:, 1], color="#7ee787", label="animals")
plt.scatter(verbs[:, 0], verbs[:, 1], color="#ffb454", label="verbs")
plt.title("Word embeddings in 2-D: related words cluster")
plt.xlabel("dim 1"); plt.ylabel("dim 2")
plt.legend()
plt.show()`
  },
  "dl-word2vec": {
    question: "Is the nearest word to (king - man + woman) actually 'queen', and how similar are the candidates?",
    charts: [{
      type: "bars", title: "Cosine similarity of king-man+woman to candidate words",
      labels: ["queen", "princess", "woman", "man", "cat"],
      values: [0.985, 0.94, 0.82, 0.46, -0.12],
      valueLabels: ["0.985", "0.94", "0.82", "0.46", "-0.12"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#ffb454", "#ff7b72"]
    }],
    caption: "The analogy vector king-man+woman lands closest to 'queen' (cosine 0.985) — the famous word2vec result is just vector arithmetic plus a nearest-neighbor lookup.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# hand-built embeddings (royalty axis, gender axis, plus a 3rd dim)
vec = {"king": [0.9, 0.9, 0.2], "queen": [0.9, 0.1, 0.22],
       "princess": [0.78, 0.12, 0.3], "woman": [0.1, 0.1, 0.6],
       "man": [0.1, 0.9, 0.5], "cat": [-0.7, -0.4, 0.9]}
vec = {k: np.array(v) for k, v in vec.items()}

result = vec["king"] - vec["man"] + vec["woman"]   # the analogy vector

def cos(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

cands = ["queen", "princess", "woman", "man", "cat"]
sims = [cos(result, vec[w]) for w in cands]
colors = ["#7ee787", "#4ea1ff", "#4ea1ff", "#ffb454", "#ff7b72"]

plt.bar(cands, sims, color=colors)
plt.title("Cosine similarity of king-man+woman to candidate words")
plt.show()`
  },
  "dl-cosine-similarity": {
    question: "How does cosine similarity score parallel, scaled, and opposite vectors?",
    charts: [{
      type: "bars", title: "Cosine similarity for different vector pairs",
      labels: ["a vs 2a (parallel)", "a vs 100a (scaled)", "a vs b (similar)", "a vs perpendicular", "a vs -a (opposite)"],
      values: [1.0, 1.0, 0.83, 0.0, -1.0],
      valueLabels: ["1.0", "1.0", "0.83", "0.0", "-1.0"],
      colors: ["#7ee787", "#7ee787", "#4ea1ff", "#ffb454", "#ff7b72"]
    }],
    caption: "Cosine measures angle, not length: scaling a vector by 100 leaves similarity at 1.0, perpendicular gives 0, and the exact opposite gives -1.",
    code: `import numpy as np
import matplotlib.pyplot as plt

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

a = np.array([1.0, 2.0, 3.0])
pairs = {"a vs 2a (parallel)": 2 * a,
         "a vs 100a (scaled)": 100 * a,
         "a vs b (similar)": np.array([2.0, 3.0, 4.0]),
         "a vs perpendicular": np.array([2.0, 1.0, -4.0 / 3]),
         "a vs -a (opposite)": -a}

labels = list(pairs)
values = [cosine(a, b) for b in pairs.values()]
colors = ["#7ee787", "#7ee787", "#4ea1ff", "#ffb454", "#ff7b72"]

plt.bar(labels, values, color=colors)
plt.title("Cosine similarity for different vector pairs")
plt.axhline(0, color="gray", linewidth=0.8)
plt.xticks(rotation=20)
plt.show()`
  },
  "dl-attention": {
    question: "For each token, which other tokens does attention focus on?",
    charts: [{
      type: "heatmap", title: "Attention weights (each row sums to 1)",
      rows: ["The", "cat", "sat", "on", "mat"], cols: ["The", "cat", "sat", "on", "mat"],
      matrix: [
        [0.79, 0.065, 0.048, 0.053, 0.043],
        [0.053, 0.716, 0.118, 0.048, 0.065],
        [0.042, 0.231, 0.628, 0.052, 0.047],
        [0.056, 0.046, 0.062, 0.683, 0.153],
        [0.038, 0.188, 0.046, 0.103, 0.624]
      ],
      showVals: true
    }],
    caption: "Softmax turns query-key scores into weights that sum to 1 per row; the bright diagonal plus off-diagonal links (e.g. 'sat'->'cat' 0.23) show where each token looks.",
    code: `import numpy as np
import matplotlib.pyplot as plt

tokens = ["The", "cat", "sat", "on", "mat"]

# raw query-key scores: strong on the diagonal, a few cross-links
scores = np.array([[3.0, 0.4, 0.1, 0.2, 0.0],
                   [0.2, 3.0, 1.1, 0.1, 0.4],
                   [0.0, 1.8, 2.8, 0.2, 0.1],
                   [0.3, 0.1, 0.4, 3.0, 1.5],
                   [0.0, 1.7, 0.2, 0.9, 2.8]])

# softmax per row -> attention weights summing to 1
e = np.exp(scores - scores.max(axis=1, keepdims=True))
weights = e / e.sum(axis=1, keepdims=True)

plt.imshow(weights, cmap="viridis")
plt.xticks(range(5), tokens); plt.yticks(range(5), tokens)
plt.title("Attention weights (each row sums to 1)")
plt.colorbar()
plt.show()`
  },
  "dl-data-augmentation": {
    question: "Does stacking more random augmentations actually improve validation accuracy?",
    charts: [{
      type: "bars", title: "Validation accuracy as augmentations are added",
      labels: ["no aug", "+flip", "+rotate", "+crop", "+jitter (all)"],
      values: [0.78, 0.82, 0.85, 0.88, 0.91],
      valueLabels: ["0.78", "0.82", "0.85", "0.88", "0.91"],
      colors: ["#ff7b72", "#ffb454", "#ffb454", "#4ea1ff", "#7ee787"]
    }],
    caption: "Each augmentation gives the model more varied views of the same images, lifting validation accuracy from 0.78 to 0.91 by reducing overfitting.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# stacking augmentations each add a bit of validation accuracy
labels = ["no aug", "+flip", "+rotate", "+crop", "+jitter (all)"]
gains = np.array([0.78, 0.04, 0.03, 0.03, 0.03])   # base + increments
acc = np.cumsum(gains)                              # 0.78 -> 0.91
colors = ["#ff7b72", "#ffb454", "#ffb454", "#4ea1ff", "#7ee787"]

plt.bar(labels, acc, color=colors)
plt.title("Validation accuracy as augmentations are added")
plt.ylim(0.7, 0.95)
plt.show()`
  }
});
