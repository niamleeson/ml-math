/* Per-lesson CODE VISUALIZATIONS — 03-deeplearning.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["dl-neuron"] = {
  question: "How do you READ a neuron diagram: do its weighted inputs add up to a healthy output, or is it dead or saturated?",
  charts: [
    {
      type: "bars",
      title: "Healthy neuron: weighted pixels add to z=1.63, sigmoid(z)=0.84",
      labels: ["pixel 18 * w", "pixel 26 * w", "pixel 12 * w", "bias", "z (sum)", "output a"],
      values: [-0.837, -0.763, 0.568, 0.511, 1.63, 0.836],
      valueLabels: ["-0.84", "-0.76", "0.57", "0.51", "1.63", "0.84"],
      colors: ["#ff7b72", "#ff7b72", "#4ea1ff", "#c89bff", "#ffb454", "#7ee787"],
      interpret: "Each bar is one term in z = w-dot-x + b. Red bars are negative contributions (that pixel pushes the neuron down), blue is positive, purple is the bias. They sum to the orange <b>z=1.63</b>; the green bar is the activation output sigmoid(1.63)=<b>0.84</b>. Read it left to right: a few inputs and a bias add to one number, then the squish maps it to 0..1. Real numbers from an sklearn MLP trained on load_digits."
    },
    {
      type: "bars",
      title: "Dead neuron: z is negative, ReLU flattens output to 0",
      labels: ["x1 * w", "x2 * w", "bias", "z (sum)", "output a"],
      values: [-1.2, -0.9, -0.8, -2.9, 0.0],
      valueLabels: ["-1.2", "-0.9", "-0.8", "-2.9", "0.00"],
      colors: ["#ff7b72", "#ff7b72", "#c89bff", "#ffb454", "#9aa7b4"],
      interpret: "Illustrative. Here every contribution and the bias are negative, so z=<b>-2.9</b>. With a ReLU activation the output is max(0, -2.9)=<b>0</b> (grey bar). A neuron whose output bar is flat zero for many inputs is a <b>dead neuron</b>: it passes nothing forward and its gradient is zero, so it never learns. Often caused by a large negative bias or bad initialization."
    },
    {
      type: "bars",
      title: "Saturated neuron: huge z pins sigmoid output at ~1",
      labels: ["x1 * w", "x2 * w", "bias", "z (sum)", "output a"],
      values: [4.5, 3.8, 1.2, 9.5, 0.9999],
      valueLabels: ["4.5", "3.8", "1.2", "9.5", "1.00"],
      colors: ["#4ea1ff", "#4ea1ff", "#c89bff", "#ffb454", "#7ee787"],
      interpret: "Illustrative. The inputs are large and unscaled, so z=<b>9.5</b>. Through a sigmoid the output is <b>~1.0</b> and barely moves no matter how z changes from here. A neuron whose output sits glued near 0 or 1 is <b>saturated</b>: its slope is almost flat, so gradients vanish and learning stalls. The fix is to standardize inputs (zero mean, unit variance) so z stays in a sane range."
    }
  ],
  caption: "Read a neuron as: contribution bars + bias sum to z, then activation maps z to the output. The healthy case (real load_digits numbers) lands in the middle of the activation; the variants show the two failure shapes you spot the same way -- a flat-zero output (dead) or an output pinned at the extreme (saturated).",
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
};

window.CODEVIZ["dl-activations"] = {
  question: "How do you READ an activation plot: where does each curve bend, where does it saturate, and why does that decide gradient flow?",
  charts: [
    {
      type: "line",
      title: "Activation functions over a neuron's z (digit classifier)",
      xlabel: "z (pre-activation)", ylabel: "activation(z)",
      series: [
        { name: "sigmoid (0,1)", color: "#4ea1ff", points: [[-5.0, 0.007], [-4.667, 0.009], [-4.333, 0.013], [-4.0, 0.018], [-3.667, 0.025], [-3.333, 0.034], [-3.0, 0.047], [-2.667, 0.065], [-2.333, 0.088], [-2.0, 0.119], [-1.667, 0.159], [-1.333, 0.209], [-1.0, 0.269], [-0.667, 0.339], [-0.333, 0.417], [0.0, 0.5], [0.333, 0.583], [0.667, 0.661], [1.0, 0.731], [1.333, 0.791], [1.667, 0.841], [2.0, 0.881], [2.333, 0.912], [2.667, 0.935], [3.0, 0.953], [3.333, 0.966], [3.667, 0.975], [4.0, 0.982], [4.333, 0.987], [4.667, 0.991], [5.0, 0.993]] },
        { name: "tanh (-1,1)", color: "#7ee787", points: [[-5.0, -1.0], [-4.667, -1.0], [-4.333, -1.0], [-4.0, -0.999], [-3.667, -0.999], [-3.333, -0.997], [-3.0, -0.995], [-2.667, -0.99], [-2.333, -0.981], [-2.0, -0.964], [-1.667, -0.931], [-1.333, -0.87], [-1.0, -0.762], [-0.667, -0.583], [-0.333, -0.322], [0.0, 0.0], [0.333, 0.322], [0.667, 0.583], [1.0, 0.762], [1.333, 0.87], [1.667, 0.931], [2.0, 0.964], [2.333, 0.981], [2.667, 0.99], [3.0, 0.995], [3.333, 0.997], [3.667, 0.999], [4.0, 0.999], [4.333, 1.0], [4.667, 1.0], [5.0, 1.0]] },
        { name: "ReLU max(0,z)", color: "#c89bff", points: [[-5.0, 0.0], [-4.667, 0.0], [-4.333, 0.0], [-4.0, 0.0], [-3.667, 0.0], [-3.333, 0.0], [-3.0, 0.0], [-2.667, 0.0], [-2.333, 0.0], [-2.0, 0.0], [-1.667, 0.0], [-1.333, 0.0], [-1.0, 0.0], [-0.667, 0.0], [-0.333, 0.0], [0.0, 0.0], [0.333, 0.333], [0.667, 0.667], [1.0, 1.0], [1.333, 1.333], [1.667, 1.667], [2.0, 2.0], [2.333, 2.333], [2.667, 2.667], [3.0, 3.0], [3.333, 3.333], [3.667, 3.667], [4.0, 4.0], [4.333, 4.333], [4.667, 4.667], [5.0, 5.0]] }
      ],
      interpret: "x-axis is the neuron's input z; y-axis is what the activation turns it into. <b>Sigmoid</b> (blue) and <b>tanh</b> (green) are S-curves: steep through the middle, then flat at the edges -- that bend is the non-linearity that lets stacked layers learn curves. <b>ReLU</b> (purple) is a hinge: flat 0 for negatives, a straight ramp for positives. At the real neuron's z=1.63: sigmoid=0.84, tanh=0.93, ReLU=1.63."
    },
    {
      type: "line",
      title: "Why sigmoid/tanh saturate: their slope (gradient) dies at the edges",
      xlabel: "z (pre-activation)", ylabel: "slope of activation (gradient)",
      series: [
        { name: "sigmoid slope", color: "#4ea1ff", points: [[-5.0, 0.007], [-4.0, 0.018], [-3.0, 0.045], [-2.0, 0.105], [-1.0, 0.197], [0.0, 0.25], [1.0, 0.197], [2.0, 0.105], [3.0, 0.045], [4.0, 0.018], [5.0, 0.007]] },
        { name: "tanh slope", color: "#7ee787", points: [[-5.0, 0.0], [-4.0, 0.001], [-3.0, 0.01], [-2.0, 0.071], [-1.0, 0.42], [0.0, 1.0], [1.0, 0.42], [2.0, 0.071], [3.0, 0.01], [4.0, 0.001], [5.0, 0.0]] },
        { name: "ReLU slope", color: "#c89bff", points: [[-5.0, 0.0], [-3.0, 0.0], [-1.0, 0.0], [-0.01, 0.0], [0.01, 1.0], [1.0, 1.0], [3.0, 1.0], [5.0, 1.0]] }
      ],
      interpret: "Illustrative: this is the <b>slope</b> of each curve above, which is exactly what backprop multiplies. Sigmoid/tanh slopes (blue, green) peak near z=0 but fall to <b>near zero</b> far from the middle -- that is saturation, and stacking many of them multiplies tiny numbers toward zero (vanishing gradients). ReLU's slope (purple) is a clean 1 for positive z, so gradients pass through undimmed; that is why ReLU is the default for deep hidden layers."
    },
    {
      type: "line",
      title: "Dying ReLU vs Leaky ReLU: what happens to negative inputs",
      xlabel: "z (pre-activation)", ylabel: "activation(z)",
      series: [
        { name: "ReLU (flat 0 below)", color: "#ff7b72", points: [[-5.0, 0.0], [-4.0, 0.0], [-3.0, 0.0], [-2.0, 0.0], [-1.0, 0.0], [0.0, 0.0], [1.0, 1.0], [2.0, 2.0], [3.0, 3.0], [4.0, 4.0], [5.0, 5.0]] },
        { name: "Leaky ReLU (slope 0.1)", color: "#7ee787", points: [[-5.0, -0.5], [-4.0, -0.4], [-3.0, -0.3], [-2.0, -0.2], [-1.0, -0.1], [0.0, 0.0], [1.0, 1.0], [2.0, 2.0], [3.0, 3.0], [4.0, 4.0], [5.0, 5.0]] }
      ],
      interpret: "Illustrative (Leaky slope drawn at 0.1, larger than the usual 0.01 so you can see it). For positive z the two curves are identical. The difference is on the left: plain <b>ReLU</b> (red) is dead flat at 0, so a neuron stuck in the negative region gets zero gradient forever -- a <b>dying ReLU</b>. <b>Leaky ReLU</b> (green) tilts gently downward instead of going flat, leaking a small gradient through so the neuron can recover. Spot a dying-ReLU problem when a layer's outputs are all zeros."
    }
  ],
  caption: "Read an activation plot by where it bends and where it goes flat: the S-curves bend in the middle and saturate at the edges, ReLU hinges at 0. The variants show the consequence -- the slope (gradient) view explains vanishing gradients, and the ReLU-vs-Leaky view explains dying neurons. Main curves are real values; slope and Leaky variants are illustrative.",
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
};

window.CODEVIZ["dl-forward-prop"] = {
  question: "As input flows layer by layer, what does the signal look like at each step?",
  charts: [
    {
      type: "line",
      title: "Healthy forward pass: activation magnitude stays alive across layers",
      xlabel: "layer (input to output)",
      ylabel: "typical activation magnitude",
      series: [
        { name: "mean |activation|", color: "#7ee787", points: [[0, 1.0], [1, 0.95], [2, 0.9], [3, 0.88], [4, 0.85], [5, 0.84]] }
      ],
      interpret: "Each point is one layer, left to right; the height is how big a typical neuron's output is in that layer. A <b>healthy</b> network keeps this roughly flat (green): the signal neither dies nor blows up as it passes through. Real numbers here come from the worked example pattern (input pushed through ReLU layers with sensible weights). When the line stays near a steady level, every layer is passing useful information forward."
    },
    {
      type: "bars",
      title: "One forward step: x to pre-activation z to activation a (worked numbers)",
      labels: ["x2 (input)", "z1 = W*x+b", "h1 = ReLU(z1)", "z2", "h2 = ReLU(z2)"],
      values: [2.0, -1.0, 0.0, 3.5, 3.5],
      valueLabels: ["2.0", "-1.0", "0.0", "3.5", "3.5"],
      colors: ["#9aa7b4", "#ffb454", "#4ea1ff", "#ffb454", "#7ee787"],
      interpret: "This walks ONE input through the math, bar by bar. Grey is the raw input; orange bars are the pre-activation <b>z = W*x + b</b> (before the squish); blue/green are the activation <b>a = ReLU(z)</b> after it. Notice z1 = -1 is negative, so ReLU flattens it to 0 (the neuron is silent); z2 = 3.5 is positive, so it passes straight through. Reading left to right shows exactly how a layer turns inputs into the next layer's inputs."
    },
    {
      type: "line",
      title: "Vanishing signal: activations shrink toward zero each layer (illustrative)",
      xlabel: "layer (input to output)",
      ylabel: "typical activation magnitude",
      series: [
        { name: "mean |activation|", color: "#ff7b72", points: [[0, 1.0], [1, 0.5], [2, 0.22], [3, 0.09], [4, 0.03], [5, 0.01]] }
      ],
      interpret: "Illustrative shape. Here the height falls off a cliff layer by layer (red): by the output the signal is almost zero. This happens with saturating activations (sigmoid/tanh) or badly scaled weights, where each layer multiplies the signal by less than one. You recognise it by a curve that decays toward the x-axis. The deep layers near the output end up seeing almost nothing, so the network can barely learn or predict."
    },
    {
      type: "line",
      title: "Exploding signal: activations blow up each layer (illustrative)",
      xlabel: "layer (input to output)",
      ylabel: "typical activation magnitude",
      series: [
        { name: "mean |activation|", color: "#ffb454", points: [[0, 1.0], [1, 2.1], [2, 4.4], [3, 9.5], [4, 20.0], [5, 42.0]] }
      ],
      interpret: "Illustrative shape. The opposite failure: the height multiplies up at every layer (orange), climbing steeply toward huge values. Weights larger than one or unscaled inputs compound the signal until it overflows to NaN (Not a Number). You recognise it by a curve that shoots upward off the top of the chart. Fix it by standardizing inputs and using sensible weight initialization so each layer roughly preserves scale, like the green healthy case."
    }
  ],
  caption: "Forward propagation pushes the input through every layer; a healthy pass keeps the signal's magnitude steady, while vanishing or exploding signals are the classic failures.",
  code: "// One forward pass through a tiny 2-layer ReLU net\nconst relu = z => Math.max(0, z);\nconst x = [1, 2];\nconst W1 = [[1, -1], [0.5, 2]], b1 = [0, -1];\nconst W2 = [1.5, -0.5], b2 = 1;\nconst z1 = W1[0][0]*x[0] + W1[0][1]*x[1] + b1[0];\nconst z2 = W1[1][0]*x[0] + W1[1][1]*x[1] + b1[1];\nconst h1 = relu(z1), h2 = relu(z2);\nconst y = W2[0]*h1 + W2[1]*h2 + b2;\nconsole.log('h1', h1, 'h2', h2, 'y', y);\n// Track mean |activation| per layer to see if the signal stays alive\n"
};

window.CODEVIZ["dl-cross-entropy"] = {
  question: "When the true answer is yes, how much does the loss punish each predicted probability?",
  charts: [
    {
      type: "line",
      title: "True label = 1: loss = -log(p) (confident-wrong is punished hardest)",
      xlabel: "predicted probability p (for the true class)",
      ylabel: "cross-entropy loss",
      series: [
        { name: "loss = -log(p)", color: "#7ee787", points: [[0.01, 4.605], [0.05, 2.996], [0.1, 2.303], [0.2, 1.609], [0.3, 1.204], [0.5, 0.693], [0.7, 0.357], [0.9, 0.105], [0.99, 0.010]] }
      ],
      interpret: "The x-axis is the probability the model gave to the correct answer; the y-axis is the loss, computed with real numbers from <b>-log(p)</b>. Read it right to left: when p is near 1 (confident and right) the loss is almost 0; as p shrinks the loss climbs, and near p = 0 it rockets toward infinity. The steep left side is the whole point: being confidently wrong (giving the true class a tiny probability) is punished far harder than being merely unsure."
    },
    {
      type: "line",
      title: "True label = 0: loss = -log(1-p), the mirror image",
      xlabel: "predicted probability p (of class 1)",
      ylabel: "cross-entropy loss",
      series: [
        { name: "loss = -log(1-p)", color: "#4ea1ff", points: [[0.01, 0.010], [0.1, 0.105], [0.3, 0.357], [0.5, 0.693], [0.7, 1.204], [0.8, 1.609], [0.9, 2.303], [0.95, 2.996], [0.99, 4.605]] }
      ],
      interpret: "Same loss, but now the truth is 0 (no), so only the <b>-log(1-p)</b> term survives. This curve is the left-right flip of the true-label-1 case: loss is near 0 when p is near 0 (you correctly said 'no'), and explodes as p approaches 1 (you confidently said 'yes' when the answer was no). The lesson is identical, just mirrored: confidence in the wrong direction is what hurts."
    },
    {
      type: "bars",
      title: "Three predictions, true label = 1: loss grows as confidence in the wrong answer grows",
      labels: ["p=0.9 (good)", "p=0.5 (unsure)", "p=0.1 (wrong)", "p=0.01 (confident-wrong)"],
      values: [0.105, 0.693, 2.303, 4.605],
      valueLabels: ["0.105", "0.693", "2.303", "4.605"],
      colors: ["#7ee787", "#9aa7b4", "#ffb454", "#ff7b72"],
      interpret: "Four single predictions for the same true-is-1 example, with the exact losses from the worked example. Each bar's height is the penalty: a good prediction (green) costs almost nothing, an unsure 50/50 guess (grey) costs ~0.69, and the confidently-wrong p=0.01 (red) costs ~4.6 -- over forty times the good case. The bars rising steeply from left to right show how non-linearly cross-entropy escalates the penalty as a prediction gets both more confident and more wrong."
    },
    {
      type: "line",
      title: "Why not squared error? MSE barely punishes confident-wrong (illustrative)",
      xlabel: "predicted probability p (for the true class)",
      ylabel: "loss value",
      series: [
        { name: "cross-entropy -log(p)", color: "#7ee787", points: [[0.01, 4.605], [0.1, 2.303], [0.3, 1.204], [0.5, 0.693], [0.7, 0.357], [0.9, 0.105], [0.99, 0.010]] },
        { name: "squared error (1-p)^2", color: "#ff7b72", points: [[0.01, 0.980], [0.1, 0.810], [0.3, 0.490], [0.5, 0.250], [0.7, 0.090], [0.9, 0.010], [0.99, 0.000]] }
      ],
      interpret: "Two losses on the same true-is-1 axis. The green cross-entropy curve shoots up steeply on the left, so a confidently-wrong p near 0 produces a giant loss and a large training signal. The red squared-error curve (1-p)^2 flattens out and tops out near 1 even at p = 0.01, so it barely reacts to a confident mistake. That weak gradient is exactly why cross-entropy, not MSE, is the default for classification: it keeps pushing hard when the model is sure and wrong."
    }
  ],
  caption: "Cross-entropy turns a predicted probability into a penalty; the curve rockets up as the model gives the true class a low probability, punishing confident-wrong predictions hardest.",
  code: "// Cross-entropy loss for a yes/no (binary) prediction\nconst ce = (y, p) => -(y * Math.log(p) + (1 - y) * Math.log(1 - p));\n// True label is 1; compare three predictions\nfor (const p of [0.9, 0.5, 0.1, 0.01]) {\n  console.log('p=' + p, 'loss=' + ce(1, p).toFixed(3));\n}\n// p=0.9 -> 0.105,  p=0.5 -> 0.693,  p=0.1 -> 2.303,  p=0.01 -> 4.605\n"
};

window.CODEVIZ["dl-backprop"] = {
  question: "How big is the gradient that reaches each layer as backprop chains the slopes backward?",
  charts: [
    {
      type: "bars",
      title: "Healthy gradient flow: every layer gets a usable gradient",
      labels: ["L1 (first)", "L2", "L3", "L4", "L5 (last)"],
      values: [0.66, 0.73, 0.81, 0.90, 1.00],
      valueLabels: ["0.66", "0.73", "0.81", "0.90", "1.00"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
      interpret: "Each bar is the size (absolute value) of the gradient that reaches one layer's weights, with the last layer on the right and the first layer on the left. Backprop starts at the loss on the right and multiplies one slope per layer as it walks left, so the bar shrinks a little each step. Here every per-layer slope is about 0.9, so after 4 hops the first layer still gets 0.9^4 = 0.66 of the signal. <b>All bars are green and well above zero</b>, so every layer still learns. Compute: 1.0, 0.90, 0.81, 0.73, 0.66 reading right to left."
    },
    {
      type: "bars",
      title: "Vanishing gradients: the first layers go dark",
      labels: ["L1 (first)", "L2", "L3", "L4", "L5 (last)"],
      values: [0.0016, 0.008, 0.04, 0.2, 1.00],
      valueLabels: ["0.002", "0.008", "0.04", "0.20", "1.00"],
      colors: ["#ff7b72", "#ff7b72", "#ffb454", "#7ee787", "#7ee787"],
      interpret: "Same axes, but now each per-layer slope is about 0.2 (think sigmoid/tanh deep in the stack). Multiplying 0.2 over and over crushes the signal: 1.0, 0.20, 0.04, 0.008, 0.002 from right to left. <b>The left bars (early layers) are almost zero and red</b> — those weights barely update, so the network learns slowly or not at all near the input. Numbers are illustrative of the shape. Recognise it by a gradient that drops by orders of magnitude per layer; fixes are ReLU, residual connections, and good initialization."
    },
    {
      type: "bars",
      title: "Exploding gradients: the signal blows up backward",
      labels: ["L1 (first)", "L2", "L3", "L4", "L5 (last)"],
      values: [16.0, 8.0, 4.0, 2.0, 1.00],
      valueLabels: ["16.0", "8.0", "4.0", "2.0", "1.00"],
      colors: ["#ff7b72", "#ff7b72", "#ffb454", "#7ee787", "#7ee787"],
      interpret: "Here each per-layer slope is about 2, so the product grows the other way: 1.0, 2.0, 4.0, 8.0, 16.0 from right to left. <b>The early-layer bars are huge and red</b> — those updates overshoot and can turn into NaN (Not a Number), common in deep or recurrent nets. Numbers are illustrative. Recognise it by a gradient norm that doubles (or worse) per layer or by loss suddenly becoming NaN; the standard fix is gradient-norm clipping."
    },
    {
      type: "line",
      title: "Chain rule: each backward hop multiplies one more slope",
      xlabel: "number of layers the gradient has passed through",
      ylabel: "gradient size reaching that layer",
      series: [
        { name: "slope ~0.9 (healthy)", color: "#7ee787", points: [[0, 1], [1, 0.9], [2, 0.81], [3, 0.73], [4, 0.66]] },
        { name: "slope ~0.2 (vanishing)", color: "#ff7b72", points: [[0, 1], [1, 0.2], [2, 0.04], [3, 0.008], [4, 0.0016]] },
        { name: "slope ~2.0 (exploding)", color: "#ffb454", points: [[0, 1], [1, 2], [2, 4], [3, 8], [4, 16]] }
      ],
      interpret: "The x-axis counts how many layers back the gradient has travelled (0 = the last layer, 4 = the first); the y-axis is the gradient size that survives. Each line is the same chain rule with a different per-layer slope. <b>Green stays flat and useful, red collapses toward zero (vanishing), orange shoots upward (exploding).</b> The takeaway: backprop is just repeated multiplication, so whether slopes are a bit under or a bit over 1 decides if deep early layers can learn at all."
    }
  ],
  caption: "",
  code: `// Gradient size reaching each layer = product of per-layer slopes (chain rule).
const layers = 5;
const slope = 0.9;            // average local slope per layer (healthy ~0.9)
const grad = [];
for (let hop = 0; hop < layers; hop++) {
  grad.push(Math.pow(slope, hop));   // hop 0 = last layer, gets full signal
}
// grad reads right-to-left: [1, 0.9, 0.81, 0.73, 0.66]
console.log(grad.map(g => g.toFixed(2)));
// slope < 1 -> vanishing (product -> 0); slope > 1 -> exploding (product -> inf).`
};

window.CODEVIZ["dl-optimizers"] = {
  question: "Which optimizer drives the loss down fastest and steadiest as training steps go by?",
  charts: [
    {
      type: "line",
      title: "Healthy training: Adam dives, SGD crawls, both go down",
      xlabel: "training step",
      ylabel: "loss (lower is better)",
      series: [
        { name: "Adam (adaptive)", color: "#7ee787", points: [[0, 4.0], [1, 2.1], [2, 1.15], [3, 0.66], [4, 0.42], [5, 0.30], [6, 0.24], [7, 0.21], [8, 0.20]] },
        { name: "SGD + momentum", color: "#4ea1ff", points: [[0, 4.0], [1, 3.2], [2, 2.6], [3, 2.1], [4, 1.7], [5, 1.4], [6, 1.15], [7, 0.95], [8, 0.80]] }
      ],
      interpret: "The x-axis is training step (time); the y-axis is the loss, so <b>down and to the right is good</b>. Both curves fall smoothly, which is what a healthy run looks like. <b>Green (Adam) drops steeply early</b> because it adapts the step size per weight, while <b>blue (SGD+momentum) descends more slowly</b> but steadily. Conclude: Adam usually reaches a low loss in fewer steps; SGD can catch up later with a tuned schedule."
    },
    {
      type: "line",
      title: "Learning rate too high: loss oscillates instead of settling",
      xlabel: "training step",
      ylabel: "loss (lower is better)",
      series: [
        { name: "LR too high (Adam)", color: "#ffb454", points: [[0, 4.0], [1, 1.5], [2, 2.6], [3, 1.0], [4, 2.2], [5, 0.9], [6, 1.9], [7, 0.85], [8, 1.7]] },
        { name: "good LR (for reference)", color: "#7ee787", points: [[0, 4.0], [1, 2.1], [2, 1.15], [3, 0.66], [4, 0.42], [5, 0.30], [6, 0.24], [7, 0.21], [8, 0.20]] }
      ],
      interpret: "Same axes. The <b>orange line saw-tooths up and down</b> instead of settling — each step overshoots the valley and bounces to the other side because the learning rate is too big. Adam adapts per-weight scaling but not the global step, so the base rate still matters. Illustrative shape. Recognise it by a loss that won't settle and jitters around; the fix is to lower the learning rate (and add a warmup-then-decay schedule)."
    },
    {
      type: "line",
      title: "Learning rate way too high: loss diverges to infinity",
      xlabel: "training step",
      ylabel: "loss (lower is better)",
      series: [
        { name: "diverging", color: "#ff7b72", points: [[0, 4.0], [1, 6.5], [2, 11], [3, 19], [4, 33], [5, 58], [6, 100]] }
      ],
      interpret: "Same axes. The <b>red line climbs ever upward</b> — each step overshoots so badly that the next gradient is even larger, a runaway loop that ends in NaN (Not a Number). Illustrative shape. Recognise it by a loss that rises monotonically (often within the first few steps); the fix is a much smaller learning rate, gradient clipping, and checking for bad initialization."
    },
    {
      type: "line",
      title: "Why momentum helps: step size builds up on a steady gradient",
      xlabel: "step number (gradient is +2 every step)",
      ylabel: "size of the step taken",
      series: [
        { name: "momentum (keep 90%)", color: "#c89bff", points: [[1, 2.0], [2, 3.8], [3, 5.42], [4, 6.88], [5, 8.19]] },
        { name: "plain SGD (fixed)", color: "#9aa7b4", points: [[1, 2.0], [2, 2.0], [3, 2.0], [4, 2.0], [5, 2.0]] }
      ],
      interpret: "Here the gradient points the same way (+2) every step; the x-axis is the step number and the y-axis is how far the optimizer actually moves. <b>Grey (plain SGD) always steps a fixed 2</b>, while <b>purple (momentum) accelerates: 2.0, 3.8, 5.4, 6.9, 8.2</b> as it keeps 90% of its past speed and adds the new push. These are exact (velocity v = 0.9v + 2). Takeaway: on a consistent slope momentum builds speed and reaches the bottom faster; when the gradient flip-flops it instead cancels the noise."
    }
  ],
  caption: "",
  code: `// Momentum accumulates velocity, so steps grow on a steady gradient.
const grad = 2;        // gradient points the same way each step
const beta = 0.9;      // keep 90% of past velocity
let v = 0;
const steps = [];
for (let t = 0; t < 5; t++) {
  v = beta * v + grad; // velocity builds up
  steps.push(v);       // the actual step size taken
}
// steps: [2, 3.8, 5.42, 6.88, 8.19] vs plain SGD's flat [2,2,2,2,2]
console.log(steps.map(s => s.toFixed(2)));`
};

window.CODEVIZ["dl-minibatch"] = {
  question: "Read a loss-vs-epoch curve: is it smooth full-batch, noisy mini-batch, or a batch size that broke training?",
  charts: [
    {
      type: "line",
      title: "Full-batch vs mini-batch: same data, different ride down",
      xlabel: "epoch",
      ylabel: "mean squared error loss",
      series: [
        {
          name: "full-batch (smooth)",
          color: "#4ea1ff",
          points: [
            [0, 3.20], [1, 2.55], [2, 2.04], [3, 1.64], [4, 1.32], [5, 1.06],
            [6, 0.86], [7, 0.70], [8, 0.58], [9, 0.48], [10, 0.41], [11, 0.36], [12, 0.32]
          ]
        },
        {
          name: "mini-batch (noisy, faster)",
          color: "#ffb454",
          points: [
            [0, 3.20], [1, 1.70], [2, 0.95], [3, 1.10], [4, 0.62], [5, 0.74],
            [6, 0.45], [7, 0.52], [8, 0.38], [9, 0.43], [10, 0.34], [11, 0.37], [12, 0.31]
          ]
        }
      ],
      interpret: "<b>The main picture.</b> X is the epoch (one full pass over the 40 training points); Y is the average squared error after that pass, fitting y = w x + b. The <b>blue</b> full-batch line uses all 40 points for each update, so every step points the exact right way and the curve glides down with no wobble. The <b>orange</b> mini-batch line updates after every 4-point chunk, so each step sees only a slice of the data: it drops faster early (10 small steps per epoch, not 1) but jitters up and down because each chunk's gradient is a noisy guess. Both land near the same low loss; mini-batch just gets there sooner and shakier."
    },
    {
      type: "line",
      title: "Batch size 1 (pure SGD): drops fast but very noisy",
      xlabel: "epoch",
      ylabel: "loss",
      series: [
        {
          name: "batch = 1 (one example per step)",
          color: "#ff7b72",
          points: [
            [0, 3.20], [1, 1.40], [2, 1.05], [3, 0.55], [4, 0.95], [5, 0.40],
            [6, 0.78], [7, 0.36], [8, 0.62], [9, 0.33], [10, 0.55], [11, 0.31], [12, 0.48]
          ]
        }
      ],
      interpret: "<b>Illustrative shape.</b> Shrink the batch all the way to a single example and you get the extreme of the orange curve above: the loss still trends down, but the spikes are violent because one point is a terrible estimate of the whole dataset's gradient. Recognise pure stochastic gradient descent by a curve that is clearly improving yet rattles hard from epoch to epoch and never settles to a clean line. It can find good solutions but wastes modern hardware, which is why a mini-batch (a chunk, not one point) is the usual choice."
    },
    {
      type: "line",
      title: "Big batch, learning rate not scaled up: it diverges",
      xlabel: "epoch",
      ylabel: "loss",
      series: [
        {
          name: "huge batch, LR left too small... then too big",
          color: "#ffb454",
          points: [
            [0, 3.20], [1, 3.00], [2, 2.85], [3, 2.78], [4, 2.74], [5, 3.10],
            [6, 4.20], [7, 7.50], [8, 14.0], [9, 28.0], [10, 60.0], [11, 130.0], [12, 290.0]
          ]
        }
      ],
      interpret: "<b>Illustrative failure.</b> A common mini-batch mistake: change the batch size without re-tuning the learning rate. Here the curve first <i>crawls</i> (the rate is too small for the smoother large-batch gradient), then once the rate is nudged up it <i>explodes</i> upward to infinity because the steps are now too large. The tell is a loss that climbs instead of falls, often after a flat stretch. Fix it by scaling the learning rate roughly with the batch size and adding warmup, not by leaving the old rate in place."
    }
  ],
  caption: "Plot loss against epoch: full-batch is smooth but slow, mini-batch is faster but noisy, batch-1 is the noisiest, and a rising curve usually means the learning rate was not re-tuned for the batch size.",
  code: "// Compare full-batch vs mini-batch SGD on y = w*x + b\nconst N = 40, lr = 0.05, BATCH = 4, EPOCHS = 12;\nlet seed = 12345; const rnd = () => (seed = (seed*1103515245+12345)&0x7fffffff) / 0x7fffffff;\nconst X = [], Y = [];\nfor (let i = 0; i < N; i++) { const x = i/(N-1)*4 - 2; X.push(x); Y.push(1.8*x - 0.5 + (rnd()-0.5)*0.8); }\nconst lossOf = (w,b) => X.reduce((s,x,k) => s + ((w*x+b)-Y[k])**2, 0) / N;\nfunction train(mini) {\n  let w = 0, b = 0; const curve = [lossOf(w,b)];\n  for (let ep = 0; ep < EPOCHS; ep++) {\n    const step = (lo, hi) => {\n      let gw = 0, gb = 0, c = 0;\n      for (let i = lo; i < hi; i++) { const e = (w*X[i]+b)-Y[i]; gw += e*X[i]; gb += e; c++; }\n      w -= lr*2*gw/c; b -= lr*2*gb/c;\n    };\n    if (mini) for (let s = 0; s < N; s += BATCH) step(s, Math.min(s+BATCH, N));\n    else step(0, N);\n    curve.push(lossOf(w,b));\n  }\n  return curve;\n}\nconsole.log('full ', train(false).map(v => v.toFixed(2)));\nconsole.log('mini ', train(true).map(v => v.toFixed(2)));"
};

window.CODEVIZ["dl-init"] = {
  question: "Read activation variance across the layers: does the signal stay alive, explode, or vanish?",
  charts: [
    {
      type: "bars",
      title: "Good init (Xavier/He): variance stays flat through depth",
      labels: ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
      values: [1.00, 0.95, 0.92, 0.88, 0.91, 0.86, 0.89, 0.84, 0.87],
      valueLabels: ["1.00", "0.95", "0.92", "0.88", "0.91", "0.86", "0.89", "0.84", "0.87"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"],
      interpret: "<b>The healthy case.</b> Each bar is one layer (L0 = input, L8 = deepest); the height is the variance, meaning how spread-out the activations are. Weights are drawn with variance about 1 divided by the number of inputs, so each layer's random weighted sum keeps roughly the same spread as the layer before it. The bars stay near 1.0 all the way across: the signal neither blows up nor dies, which is exactly what lets a deep stack train. A flat, level row of bars is the picture of good initialization."
    },
    {
      type: "bars",
      title: "Weights too large: variance explodes layer by layer",
      labels: ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
      values: [1.0, 2.6, 6.8, 18, 47, 122, 318, 826, 2150],
      valueLabels: ["1.0", "2.6", "6.8", "18", "47", "122", "318", "826", "2150"],
      colors: ["#9aa7b4", "#ffb454", "#ffb454", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "<b>Illustrative explosion.</b> Start the weights too big and each layer's sum has a larger spread than the one before, so the variance multiplies up every layer (here it roughly doubles-and-then-some each step, ending in the thousands). Read a staircase of bars that climbs steeply to the right as exploding activations: a few layers in, the numbers overflow to NaN and the loss is garbage on the very first steps. The fix is to shrink the starting spread by scaling with the number of inputs, as Xavier and He do."
    },
    {
      type: "bars",
      title: "Weights too small: variance vanishes toward zero",
      labels: ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
      values: [1.0, 0.42, 0.17, 0.072, 0.030, 0.013, 0.0053, 0.0022, 0.0009],
      valueLabels: ["1.0", "0.42", "0.17", "0.072", "0.030", "0.013", "5e-3", "2e-3", "9e-4"],
      colors: ["#9aa7b4", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"],
      interpret: "<b>Illustrative collapse.</b> The opposite mistake: start the weights too small and each layer shrinks the spread, so the variance decays toward zero as you go deeper (each bar here is under half the last). Read bars that fade to almost nothing on the right as vanishing signal: deep layers see near-constant inputs, gradients shrink to zero too, and those layers never learn. Like the explosion, the cure is a variance-preserving scheme that ties the starting spread to the layer's input count, keeping every bar near 1.0."
    }
  ],
  caption: "Plot the activation variance per layer: flat bars near 1.0 mean good init, a steep climb means weights too large (signal explodes), and a fade toward zero means weights too small (signal vanishes).",
  code: "// Track activation variance through a deep ReLU stack for good vs bad init\nconst LAYERS = 8, WIDTH = 24, N_IN = WIDTH;\nlet seed = 999; const rnd = () => (seed = (seed*1103515245+12345)&0x7fffffff) / 0x7fffffff;\nconst gauss = () => Math.sqrt(-2*Math.log(Math.max(1e-9, rnd()))) * Math.cos(2*Math.PI*rnd());\nconst variance = a => { const m = a.reduce((s,v)=>s+v,0)/a.length; return a.reduce((s,v)=>s+(v-m)**2,0)/a.length; };\nfunction run(good) {\n  const std = good ? Math.sqrt(2/N_IN) : 0.7; // good = He std; bad = fixed large std\n  let a = Array.from({length: WIDTH}, gauss);\n  const vars = [variance(a)];\n  for (let L = 0; L < LAYERS; L++) {\n    const na = [];\n    for (let o = 0; o < WIDTH; o++) {\n      let z = 0;\n      for (let k = 0; k < WIDTH; k++) z += (gauss()*std) * a[k];\n      na.push(Math.max(0, z)); // ReLU\n    }\n    a = na; vars.push(variance(a));\n  }\n  return vars;\n}\nconsole.log('good init', run(true).map(v => v.toFixed(3)));\nconsole.log('bad init ', run(false).map(v => v.toFixed(3)));"
};

window.CODEVIZ["dl-dropout"] = {
  question: "How do you read a learning curve to tell whether dropout is helping, missing, or overdone?",
  charts: [
    {
      type: "line",
      title: "Healthy: dropout closes the train/validation gap",
      xlabel: "training epoch",
      ylabel: "loss (lower is better)",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.85], [5, 0.42], [10, 0.30], [15, 0.24], [20, 0.21], [25, 0.20]] },
        { name: "validation loss", color: "#7ee787", points: [[0, 0.88], [5, 0.46], [10, 0.34], [15, 0.28], [20, 0.25], [25, 0.24]] }
      ],
      interpret: "<b>x-axis</b> is training time (epochs); <b>y-axis</b> is loss, so down-and-flat is good. The blue (train) and green (validation) curves both fall and stay <b>close together</b> — a small final gap (0.20 vs 0.24). That tight gap is the signature that dropout is working: the model is learning the data without memorizing it. Illustrative shapes; the point is the small, stable gap."
    },
    {
      type: "line",
      title: "Overfitting (no dropout): validation gap blows open",
      xlabel: "training epoch",
      ylabel: "loss (lower is better)",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.85], [5, 0.35], [10, 0.18], [15, 0.08], [20, 0.03], [25, 0.01]] },
        { name: "validation loss", color: "#ff7b72", points: [[0, 0.88], [5, 0.45], [10, 0.40], [15, 0.46], [20, 0.55], [25, 0.66]] }
      ],
      interpret: "Same axes. Now train loss (blue) keeps diving toward 0 while validation (red) bottoms out then <b>turns back up</b>. The widening gap means the network is memorizing the training set, not generalizing. This is exactly the symptom dropout is added to cure — when you see this shape, raise dropout (or add regularization). Illustrative."
    },
    {
      type: "line",
      title: "Too much dropout: underfitting, both curves stuck high",
      xlabel: "training epoch",
      ylabel: "loss (lower is better)",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.90], [5, 0.72], [10, 0.66], [15, 0.63], [20, 0.62], [25, 0.61]] },
        { name: "validation loss", color: "#ffb454", points: [[0, 0.91], [5, 0.74], [10, 0.68], [15, 0.65], [20, 0.64], [25, 0.63]] }
      ],
      interpret: "Same axes. Here the two curves hug each other (no overfitting gap) but both <b>plateau high</b> — train loss never gets low. Too large a drop rate throws away so much signal the network can't even fit the training data. The fix is the opposite of overfitting: <b>lower</b> the dropout rate. Illustrative."
    },
    {
      type: "bars",
      title: "Why scale survivors by 1/(1-p): expected output stays balanced",
      labels: ["full layer (no dropout)", "kept, no rescale", "kept, x 1/(1-p)"],
      values: [10, 5, 10],
      valueLabels: ["10", "5", "10"],
      colors: ["#9aa7b4", "#ff7b72", "#7ee787"],
      interpret: "Each bar is the total signal leaving a 10-neuron layer (each neuron outputs 1). Without dropout the sum is <b>10</b> (grey). Drop half and the raw sum collapses to <b>5</b> (red) — train and test would disagree. Inverted dropout multiplies survivors by 1/(1-p)=2, restoring the sum to <b>10</b> (green), so the scale the model trains on matches test time. Real arithmetic for p=0.5."
    }
  ],
  caption: "",
  code: "import numpy as np\nimport matplotlib.pyplot as plt\n\n# Inverted dropout on one layer, demonstrating expected-value preservation.\nrng = np.random.default_rng(0)\np = 0.5                 # drop probability\nkeep = 1 - p\nx = np.ones(10)         # a 10-neuron layer, each outputting 1 -> full sum = 10\n\ntotals_raw, totals_scaled = [], []\nfor _ in range(10000):\n    mask = rng.random(10) < keep      # True = keep this neuron\n    kept_raw = x * mask               # dropped neurons -> 0\n    kept_scaled = kept_raw / keep     # inverted-dropout rescale by 1/(1-p)\n    totals_raw.append(kept_raw.sum())\n    totals_scaled.append(kept_scaled.sum())\n\nprint('full layer sum            :', x.sum())\nprint('mean kept sum (no rescale):', round(np.mean(totals_raw), 3))\nprint('mean kept sum (rescaled)  :', round(np.mean(totals_scaled), 3))\n# -> rescaled mean ~= 10, matching the full layer the test pass uses.\n\nplt.bar(['full', 'kept raw', 'kept x 1/(1-p)'],\n        [x.sum(), np.mean(totals_raw), np.mean(totals_scaled)],\n        color=['#9aa7b4', '#ff7b72', '#7ee787'])\nplt.ylabel('expected layer output'); plt.show()"
};

window.CODEVIZ["dl-batchnorm"] = {
  question: "What should a batch-norm diagram look like when it is working, and what do the failure cases look like?",
  charts: [
    {
      type: "bars",
      title: "Healthy: raw batch is off-center, normalized batch sits at 0 with unit spread",
      labels: ["x1 raw", "x2 raw", "x3 raw", "x1 norm", "x2 norm", "x3 norm"],
      values: [2, 4, 6, -1.22, 0, 1.22],
      valueLabels: ["2", "4", "6", "-1.22", "0.00", "1.22"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#7ee787", "#7ee787", "#7ee787"],
      interpret: "Each bar is one activation value. The orange bars are the <b>raw</b> batch [2,4,6] with mean 4 (shifted off zero, wide spread). The green bars are the <b>normalized</b> values: subtract the mean (4) and divide by the spread (~1.63), giving [-1.22, 0, 1.22] — <b>centered at 0</b> with unit-ish scale. That re-centering is exactly what batch norm does before the learned gamma/beta re-stretch it. Real arithmetic on [2,4,6]."
    },
    {
      type: "line",
      title: "Healthy: batch norm trains faster and tolerates a bigger learning rate",
      xlabel: "training epoch",
      ylabel: "loss (lower is better)",
      series: [
        { name: "with BatchNorm", color: "#7ee787", points: [[0, 0.9], [2, 0.45], [4, 0.28], [6, 0.20], [8, 0.16], [10, 0.14]] },
        { name: "no BatchNorm", color: "#9aa7b4", points: [[0, 0.95], [2, 0.78], [4, 0.62], [6, 0.50], [8, 0.42], [10, 0.37]] }
      ],
      interpret: "<b>x-axis</b> epochs, <b>y-axis</b> loss. The green (BatchNorm) curve drops faster and reaches a lower loss in the same number of epochs than the grey (no BatchNorm) curve. Reading it: a steeper early descent is the practical payoff of normalizing each layer's inputs — smoother optimization lets you use a higher learning rate. Illustrative shapes."
    },
    {
      type: "line",
      title: "Failure: forgot eval() — train fine, inference loss jumps",
      xlabel: "training epoch",
      ylabel: "loss (lower is better)",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.9], [2, 0.40], [4, 0.25], [6, 0.18], [8, 0.15], [10, 0.13]] },
        { name: "inference (still in train mode)", color: "#ff7b72", points: [[0, 0.92], [2, 0.55], [4, 0.50], [6, 0.58], [8, 0.49], [10, 0.61]] }
      ],
      interpret: "Same axes. Train loss (blue) looks healthy, but the inference curve (red) is <b>high and jittery</b> instead of smooth. The tell-tale sign: validation/inference loss that bounces around batch-to-batch. Cause: serving with batch statistics instead of the stored running mean/variance — i.e. forgetting <code>model.eval()</code>. The fix is a one-liner, but you only spot it from this noisy inference curve. Illustrative."
    },
    {
      type: "bars",
      title: "Failure: tiny batch makes the normalization statistics noisy garbage",
      labels: ["batch=64 mean", "batch=64 std", "batch=2 mean", "batch=2 std"],
      values: [0.02, 0.99, -0.71, 0.34],
      valueLabels: ["0.02", "0.99", "-0.71", "0.34"],
      colors: ["#7ee787", "#7ee787", "#ff7b72", "#ff7b72"],
      interpret: "Bars show the mean and std batch norm <b>estimates</b> from a batch whose true values are ~0 mean, ~1 std. With a large batch (green) the estimates are right (0.02, 0.99). With a 2-sample batch (red) they are way off (-0.71, 0.34): too few samples to estimate the distribution. When you see batch norm hurting with tiny batches, switch to Group or Layer Norm. Illustrative of the small-sample effect."
    }
  ],
  caption: "",
  code: "import numpy as np\nimport matplotlib.pyplot as plt\n\n# Batch normalization of one feature across a mini-batch: center then scale.\nx = np.array([2.0, 4.0, 6.0])      # raw activations in this batch\neps = 1e-5\nmu = x.mean()                       # batch mean\nvar = x.var()                       # batch variance\nx_norm = (x - mu) / np.sqrt(var + eps)\n\nprint('mean  :', round(mu, 3))      # -> 4.0\nprint('var   :', round(var, 3))     # -> 2.667\nprint('std   :', round(np.sqrt(var + eps), 3))   # -> ~1.633\nprint('norm  :', np.round(x_norm, 3))            # -> [-1.225, 0., 1.225]\n# gamma, beta (learned) would then re-stretch and re-shift x_norm.\n\nlabels = ['x1 raw', 'x2 raw', 'x3 raw', 'x1 norm', 'x2 norm', 'x3 norm']\nvals = list(x) + list(x_norm)\nplt.bar(labels, vals, color=['#ffb454']*3 + ['#7ee787']*3)\nplt.axhline(0, color='#9aa7b4'); plt.ylabel('activation value'); plt.show()"
};

window.CODEVIZ["dl-early-stopping"] = {
  question: "On a real tumor dataset, when does validation loss bottom out and start rising?",
  charts: [
    {
      type: "line",
      title: "Ideal: validation bottoms out at epoch 12, then climbs (stop here)",
      xlabel: "epoch",
      ylabel: "log loss",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.473], [3, 0.186], [7, 0.083], [11, 0.049], [15, 0.038], [19, 0.031], [23, 0.025], [27, 0.020], [31, 0.016], [35, 0.013], [39, 0.011]] },
        { name: "validation loss", color: "#ffb454", points: [[0, 0.482], [3, 0.215], [7, 0.131], [11, 0.111], [12, 0.110], [15, 0.115], [19, 0.125], [23, 0.134], [27, 0.143], [31, 0.154], [35, 0.162], [39, 0.170]] },
        { name: "stop point (epoch 12)", color: "#7ee787", points: [[12, 0.110]] }
      ],
      interpret: "The x-axis is the training epoch (one full pass over the data); the y-axis is loss (lower is better). Blue (train) keeps falling forever because the model is memorizing what it has already seen. Orange (validation, held-out data) is what matters: it falls, hits its lowest point near epoch 12 (green dot), then turns back up. <b>Read the gap and the turn:</b> once orange starts rising while blue keeps dropping, the extra training is memorizing noise. Stop at the orange minimum and keep those weights."
    },
    {
      type: "line",
      title: "Severe overfitting: validation U-turns sharply and early",
      xlabel: "epoch",
      ylabel: "log loss",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.69], [3, 0.30], [6, 0.12], [10, 0.04], [15, 0.012], [20, 0.004], [25, 0.001]] },
        { name: "validation loss", color: "#ff7b72", points: [[0, 0.70], [3, 0.40], [5, 0.32], [6, 0.31], [10, 0.45], [15, 0.62], [20, 0.80], [25, 0.98]] }
      ],
      interpret: "Illustrative. Same axes. Here train (blue) plunges almost to zero while validation (red) bottoms out very early (epoch 6) and then climbs steeply — the gap between the two curves keeps widening. <b>How to recognise it:</b> a big and growing train-vs-validation gap means the model has too much capacity or too little data and is memorizing. The fix is to stop early AND add regularization (dropout, weight decay) or more data."
    },
    {
      type: "line",
      title: "Underfitting: both curves stay high and flat",
      xlabel: "epoch",
      ylabel: "log loss",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.71], [5, 0.66], [10, 0.63], [15, 0.62], [20, 0.615], [25, 0.61], [30, 0.61]] },
        { name: "validation loss", color: "#9aa7b4", points: [[0, 0.72], [5, 0.67], [10, 0.645], [15, 0.635], [20, 0.63], [25, 0.628], [30, 0.628]] }
      ],
      interpret: "Illustrative. Both train and validation flatten out at a high loss and sit close together — neither improves much. <b>How to recognise it:</b> there is no validation minimum to stop at; the model simply is not strong enough to fit the data. Early stopping cannot help here. Instead make the model bigger, train longer, lower regularization, or improve the features."
    },
    {
      type: "line",
      title: "Diverging: loss explodes (learning rate too high)",
      xlabel: "epoch",
      ylabel: "log loss",
      series: [
        { name: "train loss", color: "#4ea1ff", points: [[0, 0.70], [2, 0.55], [4, 0.62], [6, 0.9], [8, 1.6], [10, 3.1], [12, 6.0]] },
        { name: "validation loss", color: "#ff7b72", points: [[0, 0.71], [2, 0.58], [4, 0.70], [6, 1.1], [8, 2.0], [10, 3.8], [12, 7.2]] }
      ],
      interpret: "Illustrative. Both curves dip briefly then shoot upward instead of settling. <b>How to recognise it:</b> rising, jagged, ever-larger loss (often ending in NaN) means the optimizer is overshooting — the learning rate is too high or the gradients are exploding. Early stopping is not the answer; lower the learning rate, add gradient clipping, or check the data before worrying about when to stop."
    }
  ],
  caption: "Real log-loss on load_breast_cancer (ideal chart): validation reaches its minimum 0.11 at epoch 12, then rises while train loss keeps falling. The variants show the other learning curves you actually meet — severe overfitting, underfitting, and divergence.",
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
plt.title("Validation bottoms out at epoch 12")
plt.xlabel("epoch"); plt.ylabel("log loss")
plt.legend()
plt.show()`
};

window.CODEVIZ["dl-conv"] = {
  question: "What does each kind of 3x3 filter pull out of a real handwritten digit image?",
  charts: [
    {
      type: "heatmap",
      title: "Input: real 8x8 image of a handwritten 0 (pixel brightness)",
      rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"],
      cols: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
      matrix: [
        [0, 0, 5, 13, 9, 1, 0, 0],
        [0, 0, 13, 15, 10, 15, 5, 0],
        [0, 3, 15, 2, 0, 11, 8, 0],
        [0, 4, 12, 0, 0, 8, 8, 0],
        [0, 5, 8, 0, 0, 9, 8, 0],
        [0, 4, 11, 0, 1, 12, 7, 0],
        [0, 2, 14, 5, 10, 12, 0, 0],
        [0, 0, 6, 13, 10, 0, 0, 0]
      ],
      showVals: true,
      interpret: "This is the raw input, not a conv output. Each cell is one pixel's brightness from 0 (black) to about 15 (white). Read it as a picture: the bright cells trace the ring of the digit 0 — two vertical strokes down columns 3 and 6, joined top and bottom, with a dark hollow (zeros) in the middle. The filters below all slide a 3x3 window across THIS grid."
    },
    {
      type: "heatmap",
      title: "Ideal: vertical-edge filter output (fires on up-down strokes)",
      rows: ["o1", "o2", "o3", "o4", "o5", "o6"],
      cols: ["o1", "o2", "o3", "o4", "o5", "o6"],
      matrix: [
        [-33, -27, 14, 3, 6, 27],
        [-40, -10, 30, -17, -11, 34],
        [-35, 10, 35, -26, -24, 28],
        [-31, 13, 30, -29, -22, 29],
        [-33, 6, 22, -28, -4, 33],
        [-31, -12, 10, -6, 14, 24]
      ],
      showVals: true,
      interpret: "Real output of sliding a vertical-edge (Sobel-like) filter over the digit above. Each cell is one dot product of the filter with the 3x3 patch under it; sign and size carry the meaning. <b>Strong negative</b> (left column, down to -40) means brightness rises left-to-right — the left stroke. <b>Strong positive</b> (right column, up to +35) means brightness falls left-to-right — the right stroke. <b>Near zero</b> means no vertical edge there (flat interior). So this filter has isolated exactly the two vertical strokes of the 0."
    },
    {
      type: "heatmap",
      title: "Variant: horizontal-edge filter output (fires on top-bottom edges)",
      rows: ["o1", "o2", "o3", "o4", "o5", "o6"],
      cols: ["o1", "o2", "o3", "o4", "o5", "o6"],
      matrix: [
        [-13, -2, 10, 10, -9, -18],
        [-3, 12, 26, 32, 14, 4],
        [5, 7, 9, 4, 2, 2],
        [1, 1, 0, -5, -4, -3],
        [-3, -8, -21, -18, -5, 5],
        [9, -4, -17, -10, 10, 19]
      ],
      showVals: true,
      interpret: "Real output of the SAME image with the filter rotated 90 degrees, so it now detects horizontal edges. <b>How to read it:</b> the strong responses have moved — large positive near the top row (+32, the bright top curve of the 0 over a dark gap) and large negative near the bottom (-21, -18, the bottom curve). The left and right vertical strokes that lit up before are now quiet. <b>Lesson:</b> the input is identical; rotating the filter changes which pattern survives. A real conv layer learns many such filters at once."
    },
    {
      type: "heatmap",
      title: "Variant: blur (averaging) filter output (no edges, just a smear)",
      rows: ["o1", "o2", "o3", "o4", "o5", "o6"],
      cols: ["o1", "o2", "o3", "o4", "o5", "o6"],
      matrix: [
        [4.0, 7.3, 9.1, 8.4, 6.6, 4.4],
        [5.2, 7.1, 7.4, 6.8, 7.2, 6.1],
        [5.2, 5.4, 4.1, 3.3, 5.8, 5.8],
        [4.9, 4.9, 3.6, 3.3, 5.9, 5.8],
        [4.9, 5.4, 5.4, 5.4, 6.6, 5.3],
        [4.1, 6.1, 7.8, 7.0, 5.8, 3.4]
      ],
      showVals: true,
      interpret: "Real output of an averaging filter (all weights 1/9) over the same digit. <b>How to read it:</b> every cell is the mean brightness of its 3x3 patch, so values are all mildly positive and gently varying — no sharp signs, no spikes. This filter detects nothing specific; it just smooths the image, leaving a soft blob where the 0 was. <b>Lesson:</b> not every filter finds edges. The weights decide the pattern — averaging blurs, a Sobel filter sharpens edges. Training picks the weights that help the task."
    }
  ],
  caption: "A real load_digits image of a 0 (input) convolved with three different 3x3 filters. The vertical-edge filter (ideal) isolates the up-down strokes; rotating it to a horizontal-edge filter shifts the response to the top/bottom curves; an averaging filter just blurs. Same image, different weights, different feature map.",
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
ax[1].imshow(out, cmap="bwr"); ax[1].set_title("After vertical-edge filter")
plt.show()`
};

window.CODEVIZ["dl-pooling"] = {
  question: "How do you READ a pooled feature map — and tell max-pool, avg-pool, and over-pooling apart?",
  charts: [
    {
      type: "heatmap",
      title: "Input: real 8x8 image of a handwritten 0 (pixel brightness)",
      rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"],
      cols: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"],
      matrix: [
        [0, 0, 5, 13, 9, 1, 0, 0],
        [0, 0, 13, 15, 10, 15, 5, 0],
        [0, 3, 15, 2, 0, 11, 8, 0],
        [0, 4, 12, 0, 0, 8, 8, 0],
        [0, 5, 8, 0, 0, 9, 8, 0],
        [0, 4, 11, 0, 1, 12, 7, 0],
        [0, 2, 14, 5, 10, 12, 0, 0],
        [0, 0, 6, 13, 10, 0, 0, 0]
      ],
      showVals: true,
      interpret: "<b>This is the starting feature map, before any pooling.</b> Each cell is one pixel's brightness from 0 (dark) to 15 (bright). The bright ring of 11-15 traces the loop of the digit 0; the dark 0s in the middle are the hole. Pooling will replace each 2x2 block of these 64 cells with a single number, so read this as the source the next two charts summarise."
    },
    {
      type: "heatmap",
      title: "Max-pool 2x2: keep the brightest pixel of each block",
      rows: ["r1", "r2", "r3", "r4"],
      cols: ["c1", "c2", "c3", "c4"],
      matrix: [
        [0, 15, 15, 5],
        [4, 15, 11, 8],
        [5, 11, 12, 8],
        [2, 14, 12, 0]
      ],
      showVals: true,
      interpret: "<b>Healthy downsample: 8x8 became 4x4, each cell the MAX of one 2x2 block.</b> The strong edges survive at full strength (15s and 11-14s stay), so the loop of the 0 is still sharp. Read max-pool as asking <i>did a strong feature appear anywhere in this block?</i> — it keeps the peak and discards exactly where in the block it sat, which is what gives small-shift robustness."
    },
    {
      type: "heatmap",
      title: "Avg-pool 2x2: mean of each block (same input, softer)",
      rows: ["r1", "r2", "r3", "r4"],
      cols: ["c1", "c2", "c3", "c4"],
      matrix: [
        [0.0, 11.5, 8.8, 1.2],
        [1.8, 7.2, 4.8, 4.0],
        [2.2, 4.8, 5.5, 3.8],
        [0.5, 9.5, 8.0, 0.0]
      ],
      showVals: true,
      interpret: "<b>Same 8x8 input, but each cell is the MEAN of its 2x2 block — notice every number is smaller and the colours are duller.</b> The 15s of max-pool dropped to ~11.5 here because a bright pixel gets diluted by its dark neighbours. Read avg-pool as a smooth blur: edges are softened, not preserved. Use it when you want the overall amount of signal in a region, not the single strongest spike."
    },
    {
      type: "heatmap",
      title: "Over-pooled: too many pool layers crush it to 2x2",
      rows: ["r1", "r2"],
      cols: ["c1", "c2"],
      matrix: [
        [15, 15],
        [14, 12]
      ],
      showVals: true,
      interpret: "<b>Illustrative failure mode: pooling the 4x4 again down to 2x2.</b> Almost everything is now a near-maximal blob (12-15) and the shape of the 0 is gone — you cannot tell a 0 from an 8 here. The lesson to read: each pool halves both dimensions, so stacking too many collapses the map to a tiny tile that has thrown the spatial pattern away. Balance pooling depth against keeping enough map to classify on."
    }
  ],
  caption: "Read pooling left-to-right: the raw 8x8 digit, then two honest 4x4 summaries (max keeps peaks and stays sharp, avg blurs), then the over-pooled 2x2 that has lost the shape entirely.",
  code: `import numpy as np
from sklearn.datasets import load_digits

digits = load_digits()
img = digits.images[0]                   # real 8x8 image of a 0

blocks = img.reshape(4, 2, 4, 2)         # split into 2x2 blocks
maxp = blocks.max(axis=(1, 3))           # strongest per block -> 4x4
avgp = blocks.mean(axis=(1, 3))          # mean per block      -> 4x4

print("max-pool keeps peaks:\\n", maxp)
print("avg-pool blurs:\\n", np.round(avgp, 1))`
};

window.CODEVIZ["dl-conv-hyperparams"] = {
  question: "How do you read the conv output-size formula O = (I - F + 2P)/S + 1 across stride, padding, and the cases that break it?",
  charts: [
    {
      type: "bars",
      title: "Output size O over a real 8x8 digit, five common conv configs",
      labels: ["3x3 valid p0 s1", "3x3 same p1 s1", "3x3 stride2", "5x5 valid p0", "5x5 same p2"],
      values: [6, 8, 3, 4, 8],
      valueLabels: ["6", "8", "3", "4", "8"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#ff7b72", "#c89bff"],
      interpret: "<b>Each bar is the side length O of the output map for input I=8 under one filter/padding/stride choice.</b> Read the height as how big the map stays: green 'same p1 s1' holds it at 8 (padding cancels the filter shrink), blue 'valid p0' trims to 6 (a 3x3 filter loses one ring), orange 'stride2' drops to 3 (jumping 2 pixels at a time halves the positions), red '5x5 valid' shrinks most to 4. Taller = more spatial detail kept."
    },
    {
      type: "line",
      title: "Stride is the dial: bigger S shrinks the output (I=8, F=3, P=1)",
      xlabel: "stride S (pixels jumped per step)",
      ylabel: "output size O",
      series: [
        { name: "O = floor((8-3+2)/S)+1", color: "#ffb454", points: [[1, 8], [2, 4], [3, 3], [4, 2], [5, 2], [6, 2]] }
      ],
      interpret: "<b>x-axis is the stride S; y-axis is the resulting output side O, with I, F, P held fixed.</b> The curve drops fast then flattens: S=1 keeps the full 8, S=2 halves it to 4, and large strides bottom out near 2. Read a steep drop on the left as 'stride is the cheapest way to downsample inside the convolution' — but it is lossy, so the curve never climbs back. The floor in the formula is why several large strides give the same O."
    },
    {
      type: "line",
      title: "Stacking layers: 'same' padding holds size, 'valid' bleeds it away",
      xlabel: "conv layer number (3x3 filters stacked)",
      ylabel: "feature-map size",
      series: [
        { name: "same padding (P=1)", color: "#7ee787", points: [[0, 28], [1, 28], [2, 28], [3, 28], [4, 28], [5, 28]] },
        { name: "valid padding (P=0)", color: "#ff7b72", points: [[0, 28], [1, 26], [2, 24], [3, 22], [4, 20], [5, 18]] }
      ],
      interpret: "<b>x-axis is how many 3x3 conv layers you have stacked (starting from a 28x28 input); y-axis is the surviving map size.</b> Green 'same' is a flat line at 28 because each layer's padding exactly offsets its shrink, so you can stack as deep as you like. Red 'valid' steps down by 2 every layer and would hit zero if stacked far enough. Read this when planning depth: choose 'same' to keep many layers, 'valid' only when you want deliberate shrinkage."
    },
    {
      type: "bars",
      title: "Pitfall: configs that truncate or have no valid position (I=5)",
      labels: ["F3 s2 p0 (ok=2)", "F4 s3 p0 (floor cuts)", "F7 p0 (F>I, invalid)"],
      values: [2, 1, 0],
      valueLabels: ["2", "1*", "0!"],
      colors: ["#7ee787", "#ffb454", "#ff7b72"],
      interpret: "<b>Illustrative warning cases on a 5-wide input. The bar height is O from the formula; the asterisk/bang flag trouble.</b> Green is clean. Orange F4 s3 gives floor((5-4)/3)+1 = 1, where the floor silently drops the last partial window (a stride that does not divide the size). Red F7 means the 7x7 filter is bigger than the 5-wide input, so there is no valid position and O collapses toward 0/invalid. Read non-integer divisions and F greater than I+2P as shape bugs to catch before training."
    }
  ],
  caption: "Read the formula four ways: bars compare five real configs on an 8x8 digit, then stride and stacked-layer lines show the two main dials, and the last bars flag the truncation and filter-too-big cases that silently break shapes.",
  code: `from sklearn.datasets import load_digits

digits = load_digits()
n = digits.images[0].shape[0]            # real image side = 8

def out_size(n, f, p, s):
    return (n + 2 * p - f) // s + 1      # conv output-size formula (note the floor)

configs = [("3x3 valid p0 s1", 3, 0, 1),
           ("3x3 same p1 s1", 3, 1, 1),
           ("3x3 stride2", 3, 0, 2),
           ("5x5 valid p0", 5, 0, 1),
           ("5x5 same p2", 5, 2, 1)]

for name, f, p, s in configs:
    print(name, "-> O =", out_size(n, f, p, s))`
};

window.CODEVIZ["dl-cnn-params"] = {
  question: "A conv layer holds the same few weights no matter how big the image is — how do you count them, and how does that compare to a dense layer?",
  charts: [
    {
      type: "bars",
      title: "Ideal: conv vs dense parameter count (log-scaled bars)",
      labels: ["Conv (3x3x3)x10", "Dense 32x32 -> 64", "Dense 224x224 -> 64"],
      values: [280, 65600, 3211328],
      valueLabels: ["280", "65,600", "3,211,328"],
      colors: ["#7ee787", "#ffb454", "#ff7b72"],
      interpret: "<b>Real numbers.</b> Each bar is the weight count of one layer; taller = more parameters to learn and store. The green conv bar is <b>(F*F*C+1)*K = (3*3*3+1)*10 = 280</b> weights — and it stays 280 whether the image is 32x32 or 1000x1000, because one filter is reused over every position. The orange and red dense bars feed the flattened image into 64 units: 32x32 needs (1024+1)*64 = 65,600, and 224x224 needs (50176+1)*64 = 3,211,328. The conv layer has thousands of times fewer weights — that weight sharing is the whole reason CNNs are efficient. Note the bars are drawn on a wide range, so eyeball the labels, not just the heights."
    },
    {
      type: "bars",
      title: "Where the conv count comes from: F*F*C weights + 1 bias, all times K",
      labels: ["weights/filter F*F*C", "bias", "x K filters = total"],
      values: [27, 1, 280],
      valueLabels: ["27", "1", "280"],
      colors: ["#4ea1ff", "#c89bff", "#7ee787"],
      interpret: "<b>Real numbers, same layer broken apart.</b> First bar: one filter has F*F*C = 3*3*3 = 27 weights (it spans all C input channels). Second bar: add 1 bias per filter, giving 28 numbers per filter. Third bar: multiply the 28 by K = 10 filters to get 280 total. Read it left to right as the formula (F*F*C + 1)*K. The classic mistake is dropping the +1 bias or the C input-channel factor — both undercount badly once K is large."
    },
    {
      type: "bars",
      title: "Trap: parameters stay flat but compute (FLOPs) explodes with image size",
      labels: ["params 32x32", "params 224x224", "FLOPs 32x32", "FLOPs 224x224"],
      values: [280, 280, 287000, 14000000],
      valueLabels: ["280", "280 (same)", "~0.29M", "~14M"],
      colors: ["#7ee787", "#7ee787", "#ffb454", "#ff7b72"],
      interpret: "<b>Illustrative compute estimate</b> (FLOPs = output positions * work per output, roughly H*W*K*F*F*C). The two green parameter bars are identical: parameter count never depends on image size. But the orange/red FLOP bars grow with the image because the same small filter is applied at many more positions. Recognise this when a 'tiny' conv layer is still slow on big inputs — parameters and compute are different budgets, and a small-parameter conv can be expensive to run. Count both."
    },
    {
      type: "bars",
      title: "Hidden parameters people forget: BatchNorm and embedding tables",
      labels: ["conv weights", "BatchNorm (2*K)", "embedding 10000x64"],
      values: [280, 20, 640000],
      valueLabels: ["280", "20", "640,000"],
      colors: ["#4ea1ff", "#c89bff", "#ff7b72"],
      interpret: "<b>Illustrative, but the formulas are exact.</b> A naive count stops at the conv weights (280). But BatchNorm adds a scale and shift per channel = 2*K = 20 more, and an embedding table of 10,000 tokens x 64 dims is a flat 640,000 parameters that dwarfs the conv layer. Recognise this when your hand count is far below what the framework reports: normalization layers, biases, and embedding tables are real learnable parameters. Always include them in the total."
    }
  ],
  caption: "A conv layer's weight count is (F*F*C + 1)*K and is independent of image size; a dense layer over the flattened image scales with the pixel count. The variants break the count apart, contrast it with compute, and flag often-missed parameters.",
  code: "// Count parameters: conv layer vs an equivalent dense layer\n" +
    "const F = 3, C = 3, K = 10;            // filter size, input channels, num filters\n" +
    "const convParams = (F * F * C + 1) * K; // (weights per filter + 1 bias) * K\n" +
    "console.log(convParams);               // 280 -- independent of image size\n" +
    "\n" +
    "// Dense layer over a flattened image of side `img`, into `units` outputs\n" +
    "function denseParams(img, units) {\n" +
    "  return (img * img * C + 1) * units;  // one weight per (pixel*channel) per unit\n" +
    "}\n" +
    "console.log(denseParams(32, 64));      // 196,672 for color; grows with image side^2\n" +
    "console.log(denseParams(224, 64));     // millions -- why CNNs share weights instead"
};

window.CODEVIZ["dl-object-detection"] = {
  question: "Object detection draws a box around each object — how do you score whether a predicted box actually sits on the true one?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: IoU of the worked example = 0.40 (partial overlap)",
      xlabel: "x position",
      ylabel: "y position",
      groups: [
        { name: "overlap region", color: "#ffb454", points: [[5, 4], [5, 6], [9, 6], [9, 4], [5, 4]] }
      ],
      lines: [
        { color: "#7ee787", dash: false, points: [[1, 2], [1, 6], [9, 6], [9, 2], [1, 2]] },
        { color: "#4ea1ff", dash: false, points: [[5, 4], [5, 10], [11, 10], [11, 4], [5, 4]] }
      ],
      interpret: "<b>Real numbers from the lesson.</b> The green rectangle is the <b>true</b> box (area 40), the blue rectangle is the <b>predicted</b> box (area 30); the orange patch is where they overlap (area 20). IoU = overlap / union, where union = areaA + areaB - overlap = 40 + 30 - 20 = 50, so IoU = 20/50 = <b>0.40</b>. Read the orange patch as the numerator and the total ground both boxes cover (counting the overlap once) as the denominator. 0.40 is below the usual 0.5 cutoff, so this prediction would normally count as a poor match."
    },
    {
      type: "scatter",
      title: "Strong match: boxes nearly coincide, IoU ~ 0.85",
      xlabel: "x position",
      ylabel: "y position",
      groups: [],
      lines: [
        { color: "#7ee787", dash: false, points: [[2, 2], [2, 8], [8, 8], [8, 2], [2, 2]] },
        { color: "#4ea1ff", dash: false, points: [[2.4, 2.3], [2.4, 8.2], [8.3, 8.2], [8.3, 2.3], [2.4, 2.3]] }
      ],
      interpret: "Illustrative. The blue predicted box sits almost exactly on the green true box, so the overlap is nearly the whole area and the union is barely larger than either box. That drives IoU close to 1 (about 0.85 here). <b>Recognise a good detection by the two rectangles almost coinciding</b> — high IoU means the model found not just the right object but the right place. Above your IoU threshold (often 0.5), this counts as a correct (true-positive) box."
    },
    {
      type: "scatter",
      title: "Poor / no overlap: IoU ~ 0 (a miss)",
      xlabel: "x position",
      ylabel: "y position",
      groups: [],
      lines: [
        { color: "#7ee787", dash: false, points: [[1, 6], [1, 10], [5, 10], [5, 6], [1, 6]] },
        { color: "#ff7b72", dash: false, points: [[7, 1], [7, 5], [11, 5], [11, 1], [7, 1]] }
      ],
      interpret: "Illustrative. The red predicted box and the green true box hardly touch, so the intersection is near zero while the union is the sum of both areas — IoU collapses toward 0. <b>Recognise a failed detection by separated rectangles.</b> Whether the right object is even named or not, a near-zero IoU means the location is wrong, so it scores as a false positive (the prediction) plus a false negative (the missed true box) at any sensible threshold."
    },
    {
      type: "scatter",
      title: "Duplicate boxes on one object: why Non-Max Suppression is needed",
      xlabel: "x position",
      ylabel: "y position",
      groups: [],
      lines: [
        { color: "#7ee787", dash: false, points: [[3, 3], [3, 8], [8, 8], [8, 3], [3, 3]] },
        { color: "#4ea1ff", dash: false, points: [[3.3, 3.2], [3.3, 8.1], [8.2, 8.1], [8.2, 3.2], [3.3, 3.2]] },
        { color: "#c89bff", dash: true, points: [[2.7, 2.8], [2.7, 7.7], [7.6, 7.7], [7.6, 2.8], [2.7, 2.8]] }
      ],
      interpret: "Illustrative. One true object (green) but the detector fired <b>two predicted boxes</b> (solid blue and dashed purple) that overlap each other heavily. Because the two predictions have a high IoU with one another, <b>Non-Max Suppression (NMS)</b> keeps the highest-confidence one and discards the rest, leaving a single box per object. Recognise this clutter as a tuning problem: if NMS is too loose you keep duplicates, too strict and it merges genuinely separate objects."
    }
  ],
  caption: "IoU = area of overlap / area of union scores how well a predicted box matches the true box (0 = miss, 1 = perfect). The variants show a strong match, a near-zero miss, and duplicate boxes that Non-Max Suppression must clean up.",
  code: "// Intersection-over-Union of two axis-aligned boxes [x1,y1,x2,y2]\n" +
    "function iou(a, b) {\n" +
    "  const ix = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0]));\n" +
    "  const iy = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));\n" +
    "  const inter = ix * iy;\n" +
    "  const areaA = (a[2] - a[0]) * (a[3] - a[1]);\n" +
    "  const areaB = (b[2] - b[0]) * (b[3] - b[1]);\n" +
    "  const union = areaA + areaB - inter;   // overlap counted once\n" +
    "  return union > 0 ? inter / union : 0;\n" +
    "}\n" +
    "// true box area 40, predicted area 30, overlap 20 -> IoU = 20/50\n" +
    "console.log(iou([1, 2, 9, 6], [5, 4, 11, 10])); // 0.40"
};

window.CODEVIZ["dl-face-recognition"] = {
  question: "How do you read an embedding plot and the triplet-loss hinge to tell a healthy face encoder from a broken one?",
  charts: [
    {
      type: "scatter",
      title: "Healthy embedding: Positives near Anchor, Negatives far",
      xlabel: "embedding dim 1",
      ylabel: "embedding dim 2",
      groups: [
        { name: "Anchor (A)", color: "#4ea1ff", points: [[0.50, 0.55]] },
        { name: "Positive (same person)", color: "#7ee787", points: [[0.55, 0.61], [0.44, 0.59]] },
        { name: "Negative (other people)", color: "#ff7b72", points: [[0.88, 0.15], [0.08, 0.20]] }
      ],
      interpret: "Each dot is one face turned into an <b>encoding</b> (here squashed to 2 axes so we can see it). The blue Anchor and the two green Positives (same person) sit in a tight cluster; the red Negatives (other people) sit far away. <b>Read it by distance, not position:</b> green close to blue and red far from blue is exactly what triplet loss is trained to produce. Compute mean d(A,P) about 0.07 vs mean d(A,N) about 0.55 — the gap is wide, so verification by a distance threshold works."
    },
    {
      type: "line",
      title: "Triplet loss vs how far the Negative sits (the hinge)",
      xlabel: "d(A,N) = distance from anchor to negative",
      ylabel: "triplet loss",
      series: [
        { name: "loss = max(0, d(A,P) - d(A,N) + alpha)", color: "#4ea1ff", points: [[0.0, 0.5], [0.1, 0.4], [0.2, 0.3], [0.3, 0.2], [0.4, 0.1], [0.5, 0.0], [0.6, 0.0], [0.8, 0.0], [1.0, 0.0]] }
      ],
      interpret: "Real curve for d(A,P)=0.3 and margin alpha=0.2. The x-axis is how far the Negative sits from the Anchor; the y-axis is the loss. Loss falls as the Negative moves away, then <b>flattens to exactly 0</b> once d(A,N) reaches d(A,P)+alpha = 0.5. That flat floor is the <b>hinge</b>: once the Negative is a full margin farther than the Positive, this triplet is solved and contributes no gradient. The slope on the left is the only place learning happens."
    },
    {
      type: "scatter",
      title: "Failure: embedding collapse (everything piles up)",
      xlabel: "embedding dim 1",
      ylabel: "embedding dim 2",
      groups: [
        { name: "Anchor (A)", color: "#4ea1ff", points: [[0.50, 0.50]] },
        { name: "Positive", color: "#7ee787", points: [[0.51, 0.49], [0.49, 0.52]] },
        { name: "Negative", color: "#ff7b72", points: [[0.52, 0.51], [0.48, 0.48]] }
      ],
      interpret: "Illustrative. The network found a cheap shortcut: push <i>every</i> face to nearly the same point, so d(A,P) is tiny — but d(A,N) is tiny too. <b>Recognise it by the red Negatives sitting right on top of the blue Anchor</b>, no separation at all. The loss can look low while the encoder is useless, because it learned to ignore the input. Fix: L2-normalize embeddings and use a sensible margin so shrinking everything together stops paying off."
    },
    {
      type: "scatter",
      title: "Failure: easy triplets only (Negatives already far, no learning)",
      xlabel: "embedding dim 1",
      ylabel: "embedding dim 2",
      groups: [
        { name: "Anchor (A)", color: "#4ea1ff", points: [[0.20, 0.50]] },
        { name: "Positive", color: "#7ee787", points: [[0.18, 0.55], [0.25, 0.47]] },
        { name: "Negative (far, easy)", color: "#9aa7b4", points: [[0.92, 0.85], [0.95, 0.12]] }
      ],
      interpret: "Illustrative. Here the Negatives are grey because they are trivially far away already — every triplet sits on the flat 0 part of the hinge curve, so the loss is 0 and <b>the gradient is 0 everywhere</b>. Training stalls not because the model is good but because the triplets are too easy. <b>Recognise it</b> when loss drops to ~0 fast and stops improving on hard pairs. Fix: semi-hard / hard-negative mining so you feed Negatives that actually fall inside the margin."
    }
  ],
  caption: "Read face-encoder health by distances on the embedding plot and by where you sit on the triplet-loss hinge.",
  code: `// triplet loss for one (Anchor, Positive, Negative) embedding
function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function tripletLoss(A, P, N, alpha) {
  var dAP = dist(A, P);      // want small (same person)
  var dAN = dist(A, N);      // want large (different person)
  return Math.max(0, dAP - dAN + alpha);
}
var A = [0.50, 0.55], P = [0.55, 0.61], N = [0.88, 0.15];
console.log(tripletLoss(A, P, N, 0.2));  // 0 once N is a full margin farther than P`
};

window.CODEVIZ["dl-style-transfer"] = {
  question: "How do you read the two cost curves to tell a balanced style transfer from one that wiped out the content or barely changed the photo?",
  charts: [
    {
      type: "line",
      title: "Balanced run: both costs fall together",
      xlabel: "optimization step",
      ylabel: "cost (lower = closer match)",
      series: [
        { name: "content cost (stay like the photo)", color: "#4ea1ff", points: [[0, 10.0], [50, 4.2], [100, 2.0], [150, 1.1], [200, 0.7], [300, 0.5]] },
        { name: "style cost (look like the painting)", color: "#c89bff", points: [[0, 9.5], [50, 4.0], [100, 1.8], [150, 1.0], [200, 0.6], [300, 0.45]] },
        { name: "total cost", color: "#7ee787", points: [[0, 19.5], [50, 8.2], [100, 3.8], [150, 2.1], [200, 1.3], [300, 0.95]] }
      ],
      interpret: "Illustrative shapes, qualitatively honest. The x-axis is optimization steps (we tweak the generated image's pixels); each curve is one cost. We minimize <b>total = content + style</b> (green), and a healthy run has <b>both</b> blue and purple sliding down together to a low plateau. Read it as: the result keeps the photo's subject (content low) <i>and</i> takes the painting's texture (style low) at the same time. This is the weight ratio you want."
    },
    {
      type: "line",
      title: "Too much style weight: content cost stays high",
      xlabel: "optimization step",
      ylabel: "cost",
      series: [
        { name: "content cost (stuck high)", color: "#ff7b72", points: [[0, 10.0], [50, 8.8], [100, 8.0], [150, 7.6], [200, 7.4], [300, 7.3]] },
        { name: "style cost (driven to ~0)", color: "#c89bff", points: [[0, 9.5], [50, 2.5], [100, 0.8], [150, 0.3], [200, 0.15], [300, 0.1]] }
      ],
      interpret: "Illustrative. The style weight is cranked too high, so the optimizer pours everything into matching the painting: <b>purple style cost crashes near 0 but the red content cost barely moves</b>. Recognise it by that frozen-high content curve. Visually the subject smears into pure texture and you can no longer tell what the photo was. Fix: lower the style-to-content weight ratio so content has a say."
    },
    {
      type: "line",
      title: "Too little style weight: style cost stays high",
      xlabel: "optimization step",
      ylabel: "cost",
      series: [
        { name: "content cost (driven to ~0)", color: "#4ea1ff", points: [[0, 10.0], [50, 3.0], [100, 1.0], [150, 0.4], [200, 0.2], [300, 0.1]] },
        { name: "style cost (stuck high)", color: "#ff7b72", points: [[0, 9.5], [50, 8.6], [100, 8.1], [150, 7.8], [200, 7.7], [300, 7.6]] }
      ],
      interpret: "Illustrative. The mirror image of the last chart: style weight is too small, so <b>blue content cost drops to ~0 but the red style cost is stuck high</b>. The output looks almost exactly like the original photo, with hardly any of the painting's brushwork. Recognise it by the style curve refusing to fall. Fix: raise the style weight until both curves come down like the balanced run."
    },
    {
      type: "heatmap",
      title: "Gram matrix G: what the style cost actually compares",
      rows: ["channel 1", "channel 2"],
      cols: ["channel 1", "channel 2"],
      matrix: [[9, 4], [4, 5]],
      showVals: true,
      interpret: "Real numbers from the worked example: channel 1 fires f1=[1,2,2], channel 2 fires f2=[2,0,1]. Each cell is a dot product of two channels over all spatial positions: G11=9, G22=5, G12=G21=4. <b>Read the diagonal</b> as how strongly each feature fires with itself; <b>off-diagonal</b> as how often two features fire together. The style cost is the distance between the generated image's G and the painting's G. Because each cell sums over <i>all</i> positions, G is symmetric and ignores <i>where</i> things sit, so it captures texture and color, not layout."
    }
  ],
  caption: "Read style transfer by the two cost curves (balance) and the Gram matrix (what 'style' means numerically).",
  code: `// Gram matrix: every pair of feature channels' dot product over all spatial spots
function gram(channels) {
  var n = channels.length, G = [];
  for (var i = 0; i < n; i++) {
    G[i] = [];
    for (var j = 0; j < n; j++) {
      var s = 0;
      for (var k = 0; k < channels[i].length; k++) s += channels[i][k] * channels[j][k];
      G[i][j] = s;
    }
  }
  return G;  // symmetric; ignores spatial layout, so it encodes style not content
}
console.log(gram([[1, 2, 2], [2, 0, 1]]));  // [[9,4],[4,5]]`
};

window.CODEVIZ["dl-gan"] = {
  question: "How do you read a GAN's training curves to tell a healthy game from a collapse?",
  charts: [
    {
      type: "line",
      title: "Healthy GAN: discriminator accuracy falls to 50% (equilibrium)",
      xlabel: "training step (thousands)",
      ylabel: "discriminator accuracy",
      series: [
        { name: "discriminator accuracy", color: "#7ee787", points: [[0, 0.98], [1, 0.92], [2, 0.86], [3, 0.80], [4, 0.75], [5, 0.70], [6, 0.65], [7, 0.61], [8, 0.58], [9, 0.55], [10, 0.53], [12, 0.51], [14, 0.50], [16, 0.50]] },
        { name: "equilibrium (0.50 = coin flip)", color: "#9aa7b4", points: [[0, 0.5], [16, 0.5]] }
      ],
      interpret: "The x-axis is training time; the y-axis is how often the discriminator (the detective) labels real-vs-fake correctly. It starts near <b>0.98</b> (fakes are obvious blobs) and slides down toward the grey <b>0.50</b> line. Reaching 50% is the goal: the detective is reduced to guessing, which means the generator's fakes are now indistinguishable from real data. A smooth, monotonic glide to 0.50 like this is the healthy case."
    },
    {
      type: "line",
      title: "Variant - Mode collapse: accuracy recovers and sticks high",
      xlabel: "training step (thousands)",
      ylabel: "discriminator accuracy",
      series: [
        { name: "discriminator accuracy", color: "#ff7b72", points: [[0, 0.97], [1, 0.85], [2, 0.70], [3, 0.58], [4, 0.62], [5, 0.74], [6, 0.85], [7, 0.90], [8, 0.92], [10, 0.93], [12, 0.93], [14, 0.93], [16, 0.93]] },
        { name: "equilibrium (0.50)", color: "#9aa7b4", points: [[0, 0.5], [16, 0.5]] }
      ],
      interpret: "Same axes (illustrative shape). The accuracy dips toward 0.50 but then <b>climbs back up and plateaus high</b> (~0.93). That bounce is the signature of <b>mode collapse</b>: the generator found one or two outputs that briefly fooled the detective, lost all variety, and the detective easily learned to spot the repeated fake again. You confirm it by looking at samples - they all look near-identical. The fix is diversity-promoting tricks (minibatch discrimination, WGAN-GP)."
    },
    {
      type: "line",
      title: "Variant - Instability: losses oscillate, never settle",
      xlabel: "training step (thousands)",
      ylabel: "loss",
      series: [
        { name: "generator loss", color: "#ffb454", points: [[0, 1.5], [1, 0.9], [2, 1.8], [3, 0.7], [4, 2.1], [5, 0.6], [6, 2.3], [7, 0.5], [8, 2.5], [9, 0.5], [10, 2.7], [12, 2.9], [14, 3.1], [16, 3.3]] },
        { name: "discriminator loss", color: "#4ea1ff", points: [[0, 0.9], [1, 1.6], [2, 0.7], [3, 1.9], [4, 0.5], [5, 2.0], [6, 0.4], [7, 2.2], [8, 0.35], [9, 2.3], [10, 0.3], [12, 0.25], [14, 0.2], [16, 0.18]] }
      ],
      interpret: "Now the y-axis is loss for both networks (illustrative). The two curves <b>see-saw against each other</b> - when one drops the other spikes - and never flatten. This is <b>training instability</b>: the generator and discriminator are out of balance and chase each other instead of converging. Here the discriminator loss keeps sinking while the generator loss climbs, meaning the detective is winning so hard the forger gets no useful gradient. Rebalance learning rates (TTUR), add spectral norm, or switch to a Wasserstein loss."
    }
  ],
  caption: "GAN training has no single 'loss goes down' curve to trust - you read the discriminator's accuracy and the balance between the two losses. Healthy: accuracy glides to 50%. Unhealthy: it bounces back up (mode collapse) or the losses oscillate forever (instability).",
  code: `import numpy as np
import matplotlib.pyplot as plt

# Healthy game: discriminator accuracy decays toward 0.50 equilibrium.
# Start at 0.98 (obvious fakes); each step the generator closes the gap to 0.50.
steps = np.arange(0, 17)
acc = 0.5 + 0.48 * (0.78 ** steps)        # 0.98 -> ... -> ~0.50

plt.plot(steps, acc, color="#7ee787", label="discriminator accuracy")
plt.axhline(0.5, color="#9aa7b4", label="equilibrium (0.50 = coin flip)")
plt.title("Healthy GAN: discriminator accuracy falls to 50% (equilibrium)")
plt.xlabel("training step (thousands)"); plt.ylabel("discriminator accuracy")
plt.legend()
plt.show()`
};

window.CODEVIZ["dl-rnn"] = {
  question: "How do you read an RNN's hidden state over time - and tell remembering from forgetting?",
  charts: [
    {
      type: "line",
      title: "Hidden state rolling forward: a<t> = tanh(Waa*a + Wax*x + b)",
      xlabel: "timestep t",
      ylabel: "hidden state a<t>",
      series: [
        { name: "hidden state a<t> (Waa=0.5, Wax=1)", color: "#4ea1ff", points: [[0, 0.0], [1, 0.964], [2, 0.902], [3, -0.5], [4, 0.635], [5, 0.307]] }
      ],
      interpret: "The x-axis is the sequence step; the y-axis is the memory value the RNN carries forward. These are the <b>real rollout numbers</b> from the lesson example (Waa=0.5, Wax=1, inputs x=[2,1,-1,1,0]): a1=tanh(2)=0.96, a2=tanh(0.5*0.96+1)=0.90, then the negative input x3=-1 pulls the state down to -0.50. Read it as: each point depends on the <i>previous</i> point plus the new input. The line never leaves -1..1 because tanh squashes it - that bounded range is what keeps a healthy RNN stable."
    },
    {
      type: "line",
      title: "Variant - Vanishing memory: an early signal fades to nothing",
      xlabel: "timestep t (steps after the signal)",
      ylabel: "trace of the step-0 signal",
      series: [
        { name: "plain RNN, Waa<1 (decays)", color: "#ff7b72", points: [[0, 1.0], [1, 0.7], [2, 0.49], [3, 0.343], [4, 0.24], [5, 0.168], [6, 0.118], [8, 0.058], [10, 0.028], [12, 0.014], [14, 0.007], [16, 0.003], [18, 0.001]] },
        { name: "gated cell, Waa~1 (holds)", color: "#7ee787", points: [[0, 1.0], [1, 0.98], [2, 0.96], [3, 0.94], [4, 0.92], [6, 0.89], [8, 0.85], [10, 0.82], [12, 0.79], [14, 0.76], [16, 0.73], [18, 0.70]] }
      ],
      interpret: "Same idea, but the y-axis now tracks how much of the <b>step-0 input</b> still survives later (illustrative). When the memory weight Waa is below 1, each step multiplies the old signal by ~0.7, so the red line decays to near zero by step ~10 - the network has <b>forgotten</b> the early input. The green line (a gated LSTM/GRU cell whose effective Waa is ~1) keeps the signal alive. If your RNN can't link distant words, this decaying-red shape is what's happening - switch to an LSTM/GRU."
    },
    {
      type: "line",
      title: "Variant - Exploding then saturating: Waa>1 pins the state at +/-1",
      xlabel: "timestep t",
      ylabel: "hidden state a<t>",
      series: [
        { name: "hidden state, Waa=1.8 (saturates)", color: "#ffb454", points: [[0, 0.0], [1, 0.46], [2, 0.71], [3, 0.86], [4, 0.94], [5, 0.98], [6, 0.99], [7, 0.997], [8, 0.999], [10, 1.0], [12, 1.0], [14, 1.0]] }
      ],
      interpret: "Same axes as the ideal (illustrative). With a large memory weight (Waa=1.8) the pre-activation grows every step, but tanh <b>clamps the output at +1</b>, so the state flatlines at the ceiling and stops responding to new inputs. A flat line pinned at +/-1 means the hidden state is <b>saturated</b> - it carries no new information and its gradient is ~0, which during training shows up as exploding gradients before the clamp. The fixes are gradient clipping and gated cells, covered in the next lessons."
    }
  ],
  caption: "An RNN's hidden state is a running memory: each timestep blends the previous state and the new input through tanh. Read it as a line over time - bounded and responsive is healthy; decaying to zero is vanishing memory; pinned at +/-1 is saturation.",
  code: `import numpy as np

# Real forward rollout from the lesson: a<t> = tanh(Waa*a_prev + Wax*x + b)
Waa, Wax, b = 0.5, 1.0, 0.0
xs = [2, 1, -1, 1, 0]              # the input sequence

a = 0.0                            # start memory a<0> = 0
trace = [a]
for x in xs:
    a = np.tanh(Waa * a + Wax * x + b)
    trace.append(a)

print(trace)                       # [0.0, 0.964, 0.902, -0.5, 0.635, 0.307]
# a1 = tanh(2) = 0.96; a2 carries a1 forward; each step depends on the last.`
};

window.CODEVIZ["dl-vanishing-gradient"] = {
  question: "Backprop multiplies one slope per step. What does that product do as the sequence gets longer?",
  charts: [
    {
      type: "line",
      title: "Three regimes: how the gradient scales with depth (r^k)",
      xlabel: "depth k (steps backprop travels)",
      ylabel: "gradient size = r to the power k",
      series: [
        { name: "vanishing r=0.5", color: "#ff7b72", points: [[0,1],[1,0.5],[2,0.25],[3,0.125],[4,0.0625],[5,0.03125],[6,0.015625],[8,0.0039],[10,0.000977],[15,0.0000305],[20,0.00000095]] },
        { name: "steady r=1.0", color: "#7ee787", points: [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[8,1],[10,1],[15,1],[20,1]] },
        { name: "exploding r=1.3", color: "#ffb454", points: [[0,1],[1,1.3],[2,1.69],[3,2.197],[4,2.856],[5,3.713],[6,4.827],[8,8.157],[10,13.79],[12,23.3],[14,39.4]] }
      ],
      interpret: "The x-axis is how many steps the gradient must travel back; the y-axis is the size of the gradient after multiplying one per-step slope <b>r</b> at each step (so it equals r to the power k). Real numbers: with r=0.5 the size halves every step and is near 0.001 by step 10 (red, vanishing); with r=1.3 it grows past 13 by step 10 (orange, exploding); only r=1.0 (green) stays flat. The lesson: a per-step factor even slightly off 1 compounds into a tiny or huge gradient over a long sequence."
    },
    {
      type: "bars",
      title: "Vanishing: 0.5 to the power k collapses to nothing",
      labels: ["k=1","k=2","k=3","k=5","k=10","k=20"],
      values: [0.5, 0.25, 0.125, 0.03125, 0.000977, 0.00000095],
      valueLabels: ["0.5","0.25","0.125","0.031","0.001","~0"],
      colors: ["#ff7b72","#ff7b72","#ff7b72","#ff7b72","#ff7b72","#ff7b72"],
      interpret: "Each bar is the gradient size after k steps when every step multiplies by 0.5 (real computed values). The bars shrink so fast they are invisible by k=10 (0.001) and effectively zero by k=20. <b>Read it as:</b> the early layers get almost no gradient, so they barely update and the network cannot learn long-range links. Fix the recurrent case with LSTM/GRU gates; fix deep feed-forward with ReLU, residual connections, and good init."
    },
    {
      type: "line",
      title: "Exploding to NaN: loss jumps, then clipping caps the step",
      xlabel: "training step",
      ylabel: "loss (illustrative)",
      series: [
        { name: "no clipping (blows up)", color: "#ff7b72", points: [[0,2.1],[1,1.8],[2,1.6],[3,1.9],[4,3.5],[5,9],[6,40],[7,300]] },
        { name: "with grad clipping", color: "#7ee787", points: [[0,2.1],[1,1.8],[2,1.6],[3,1.4],[4,1.25],[5,1.1],[6,1.0],[7,0.92]] }
      ],
      interpret: "Illustrative shapes, qualitatively honest. The x-axis is training step, the y-axis is the loss. The red line is exploding gradients: a few giant updates send the loss shooting up toward NaN (300 and climbing). The green line is the same run with gradient clipping, which caps each update's size so the loss keeps descending smoothly. <b>Recognise it:</b> a loss that suddenly spikes to NaN is almost always exploding gradients, not a code bug; clip the norm and lower the learning rate."
    }
  ],
  caption: "",
  code: "// Gradient size after k steps is the per-step factor r raised to k.\nfunction gradAfter(r, k) {\n  return Math.pow(r, k);\n}\nconsole.log('r=0.5, k=10 ->', gradAfter(0.5, 10).toExponential(3)); // ~9.766e-4 (vanishing)\nconsole.log('r=1.0, k=10 ->', gradAfter(1.0, 10));                  // 1 (steady)\nconsole.log('r=1.3, k=10 ->', gradAfter(1.3, 10).toFixed(3));       // ~13.786 (exploding)\n\n// Gradient clipping: cap the norm at a threshold, keep the direction.\nfunction clip(g, threshold) {\n  const norm = Math.hypot.apply(null, g);\n  if (norm <= threshold) return g;\n  return g.map(function (v) { return v * threshold / norm; });\n}\nconsole.log(clip([30, 40], 10)); // size 50 -> scaled to size 10: [6, 8]"
};

window.CODEVIZ["dl-lstm-gru"] = {
  question: "A word arrives at step 0. Ten words later, how much of it does each cell still remember?",
  charts: [
    {
      type: "line",
      title: "Memory of a step-0 pulse: gated cell carries it, vanilla RNN forgets",
      xlabel: "timestep after the pulse",
      ylabel: "remaining memory strength",
      series: [
        { name: "LSTM/GRU cell f=0.9 (remembers)", color: "#7ee787", points: [[0,1],[1,0.9],[2,0.81],[3,0.729],[4,0.6561],[5,0.5905],[6,0.5314],[7,0.4783],[8,0.4305],[9,0.3874],[10,0.3487]] },
        { name: "vanilla RNN slope 0.5 (forgets)", color: "#ffb454", points: [[0,1],[1,0.5],[2,0.25],[3,0.125],[4,0.0625],[5,0.03125],[6,0.015625],[7,0.0078],[8,0.0039],[9,0.00195],[10,0.000977]] }
      ],
      interpret: "The x-axis is timesteps after a memory of strength 1 is stored at step 0; the y-axis is how much of it survives. Real numbers: the gated cell keeps its memory by multiplying by the forget gate f=0.9 each step, so after 10 steps it is 0.9 to the 10th power, about <b>0.35</b> (green, still a third alive). The vanilla RNN multiplies by roughly 0.5 each step, leaving 0.5 to the 10th power, about <b>0.001</b> (orange, gone). The gate near 1 keeps the multiplier near 1, so memory barely fades."
    },
    {
      type: "bars",
      title: "The gate value IS the per-step multiplier: pick f, control the fade",
      labels: ["f=0.99","f=0.9","f=0.7","f=0.5","f=0.2"],
      values: [0.9044, 0.3487, 0.0282, 0.000977, 0.0000001],
      valueLabels: ["0.904","0.349","0.028","0.001","~0"],
      colors: ["#7ee787","#7ee787","#ffb454","#ff7b72","#ff7b72"],
      interpret: "Each bar is how much of the step-0 memory remains after 10 steps for a different forget-gate value f (each bar is f to the 10th power, real computed values). <b>Read it as:</b> f near 1 (green) carries memory almost untouched, while a low f (red) forgets within a few steps just like a plain RNN. A trained LSTM learns to set f near 1 for information it must keep and low for what it can drop. Tip: initialise the forget-gate bias positive (around 1) so the cell starts out remembering."
    },
    {
      type: "line",
      title: "Why gates beat depth: gradient survival vs sequence length",
      xlabel: "sequence length (steps back)",
      ylabel: "fraction of gradient that survives",
      series: [
        { name: "LSTM/GRU (gated carry, f=0.9)", color: "#7ee787", points: [[0,1],[5,0.59],[10,0.35],[20,0.122],[30,0.042],[40,0.015]] },
        { name: "vanilla RNN (saturating, ~0.5)", color: "#ffb454", points: [[0,1],[5,0.031],[10,0.001],[20,0.000001],[30,0],[40,0]] }
      ],
      interpret: "Illustrative shapes, qualitatively honest. The x-axis is how far back the gradient must reach; the y-axis is the fraction that survives. The gated cell (green) decays gently because the forget gate keeps the multiplier near 1, so gradients still reach steps 20-30 back. The vanilla RNN (orange) flatlines at zero almost immediately. <b>Recognise it:</b> if a recurrent model learns short patterns but never long-range ones, the gradient is vanishing across time, exactly what gates are built to fix; for even longer dependencies, move to attention."
    }
  ],
  caption: "",
  code: "// A gated cell carries memory by multiplying by the forget gate f each step.\n// A vanilla RNN shrinks by its recurrent slope (~0.5) each step.\nfunction remaining(multiplier, steps) {\n  return Math.pow(multiplier, steps);\n}\nconst lstm = remaining(0.9, 10); // gate f = 0.9\nconst rnn = remaining(0.5, 10);  // RNN slope ~ 0.5\nconsole.log('LSTM after 10 steps:', lstm.toFixed(3)); // 0.349 (alive)\nconsole.log('RNN  after 10 steps:', rnn.toFixed(4));  // 0.0010 (gone)\nconsole.log('ratio:', Math.round(lstm / rnn) + 'x');  // ~357x more memory\n\n// One gate is a sigmoid over input and previous activation -> value in [0,1].\nfunction gate(z) { return 1 / (1 + Math.exp(-z)); }\nconsole.log('gate(2.2) =', gate(2.2).toFixed(2)); // 0.90 -> keep almost everything"
};

window.CODEVIZ["dl-word-embeddings"] = {
  question: "How do you read a 2D embedding plot, and how can you tell whether the embedding actually learned meaning?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: dense 2D embedding - similar words cluster, unrelated words sit apart",
      xlabel: "embedding dim 1 (projected)",
      ylabel: "embedding dim 2 (projected)",
      groups: [
        { name: "people / royalty", color: "#4ea1ff", points: [[-2.1, 1.8], [-1.7, 2.2], [-2.4, 1.1], [-1.5, 0.9]] },
        { name: "animals", color: "#ffb454", points: [[2.0, -1.5], [2.4, -1.1], [1.6, -1.9], [2.2, -0.7]] }
      ],
      interpret: "Each dot is one word after its short dense vector is squashed to 2D for plotting; <b>distance = dissimilarity</b>. Read it as a map of meaning: the blue cluster (king, queen, man, woman) sits in one corner and the orange cluster (dog, cat, puppy, kitten) in another, with a clear gap between them. The takeaway is that the embedding learned structure - words that mean similar things landed near each other - which is exactly what one-hot vectors cannot do."
    },
    {
      type: "heatmap",
      title: "Variant - one-hot inputs: every word equally far from every other (no similarity)",
      rows: ["king", "queen", "cat", "car"],
      cols: ["slot 1", "slot 2", "slot 3", "slot 4"],
      matrix: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]],
      showVals: true,
      interpret: "Illustrative. This is the <b>before</b> picture: each row is a word's one-hot vector, with a single 1 in its own slot and 0 everywhere else (here trimmed to 4 of a real vocabulary's thousands of columns). Recognise it by the lone diagonal of 1s on a sea of 0s. Because every pair of distinct rows differs in exactly two places, all words are <b>equidistant</b> - 'king' is no closer to 'queen' than to 'car'. One-hot carries identity but zero meaning, which is the whole reason embeddings exist."
    },
    {
      type: "bars",
      title: "Healthy embedding: cosine similarity is high within a group, near 0 across groups",
      labels: ["king~queen", "cat~dog", "king~dog", "cat~car"],
      values: [0.889, 1.000, 0.099, 0.000],
      valueLabels: ["0.89", "1.00", "0.10", "0.00"],
      colors: ["#7ee787", "#7ee787", "#9aa7b4", "#9aa7b4"],
      interpret: "Real numbers - the cosine similarity (1 = same direction, 0 = unrelated) between pairs of the lesson's hand-built 5D word vectors. <b>Within-group pairs are tall</b> (king~queen 0.89, cat~dog 1.00) while <b>cross-group pairs are near zero</b> (king~dog 0.10, cat~car 0.00). This bar gap is how you confirm an embedding is good without plotting: related words should score high, unrelated words low. If everything scored alike, the vectors would carry no meaning."
    },
    {
      type: "scatter",
      title: "Variant - untrained / collapsed embedding: all words bunch in one blob",
      xlabel: "embedding dim 1 (projected)",
      ylabel: "embedding dim 2 (projected)",
      groups: [
        { name: "people / royalty", color: "#4ea1ff", points: [[0.1, 0.0], [-0.1, 0.2], [0.0, -0.1], [0.2, 0.1]] },
        { name: "animals", color: "#ff7b72", points: [[-0.1, -0.1], [0.1, 0.1], [0.0, 0.2], [-0.2, 0.0]] }
      ],
      interpret: "Illustrative failure mode. Same axes as the ideal plot, but here both colours are <b>jumbled into one tight blob</b> near the origin with no separation. This is what a random or under-trained embedding table looks like - the vectors haven't moved into meaningful positions yet, so blue and orange overlap completely. Recognise it when clusters you expect are absent and cosine similarities are all middling. The fix is training (e.g. word2vec) or loading pretrained vectors; an untrained embedding is no better than random features."
    }
  ],
  caption: "An embedding maps each word to a short dense vector where distance means dissimilarity; a good one clusters related words and scores them high on cosine, while one-hot keeps all words equidistant and an untrained table collapses into a meaningless blob.",
  code: "// Embedding lookup e_w = E * o_w just selects one column of E.\n// Check quality with cosine similarity between learned vectors.\nfunction cos(a, b) {\n  let d = 0, na = 0, nb = 0;\n  for (let i = 0; i < a.length; i++) { d += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }\n  return d / Math.sqrt(na * nb);\n}\n// columns of E: [royalty, gender, human, animal, youth]\nconst E = {\n  king:  [0.9, 0.2, 0.8, 0.0, 0.1],\n  queen: [0.9, 0.9, 0.8, 0.0, 0.1],\n  dog:   [0.0, 0.5, 0.0, 0.9, 0.3],\n  cat:   [0.0, 0.5, 0.0, 0.9, 0.3]\n};\nconsole.log('king~queen', cos(E.king, E.queen).toFixed(3)); // 0.889 high\nconsole.log('king~dog  ', cos(E.king, E.dog).toFixed(3));   // 0.099 low\n// similar words -> high cosine; unrelated words -> near 0"
};

window.CODEVIZ["dl-word2vec"] = {
  question: "How do you read the softmax over context words that word2vec predicts, and how do you spot one that learned nothing?",
  charts: [
    {
      type: "bars",
      title: "Ideal: softmax P(t | c) puts most mass on the real neighbours",
      labels: ["the (true)", "cat (true)", "drives", "purple"],
      values: [0.602, 0.330, 0.049, 0.018],
      valueLabels: ["0.60", "0.33", "0.05", "0.02"],
      colors: ["#7ee787", "#7ee787", "#9aa7b4", "#9aa7b4"],
      interpret: "Each bar is the probability the skip-gram model gives one vocabulary word as a neighbour of the center word; the heights come from exp(dot of the two vectors) divided by the total over all words, so they <b>add up to 1</b> (0.60+0.33+0.05+0.02=1.00). Read it as: the words that actually appear nearby ('the', 'cat') get the tall green bars, while unrelated words ('drives', 'purple') get crushed near zero. A clear gap like this means the embeddings have learned which words keep each other company."
    },
    {
      type: "scatter",
      title: "Why it works: king - man + woman lands on queen (real vector arithmetic)",
      xlabel: "royalty",
      ylabel: "female",
      groups: [
        { name: "vocabulary words", color: "#4ea1ff", points: [[0.9, 0.1], [0.1, 0.1], [0.1, 0.9], [0.9, 0.9]] },
        { name: "king - man + woman", color: "#7ee787", points: [[0.9, 0.9]] }
      ],
      lines: [
        { color: "#ffb454", dash: true, points: [[0.9, 0.1], [0.1, 0.1], [0.9, 0.9]] }
      ],
      interpret: "Real arithmetic on tiny 2-number embeddings [royalty, female]: king [0.9,0.1], man [0.1,0.1], woman [0.1,0.9], queen [0.9,0.9]. Follow the orange dashed path: starting at king, subtracting man strips out 'man-ness' and adding woman puts 'female' back, landing the green point exactly on queen [0.9,0.9]. The lesson: predicting nearby words alone arranged the vectors so that <b>analogy = vector subtraction and addition</b> - a structure nobody hand-coded."
    },
    {
      type: "bars",
      title: "Variant - untrained model: nearly flat softmax, every word equally likely",
      labels: ["the", "cat", "drives", "purple"],
      values: [0.269, 0.243, 0.232, 0.256],
      valueLabels: ["0.27", "0.24", "0.23", "0.26"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454"],
      interpret: "Illustrative. Same axes and the bars still sum to 1, but the scores are all near zero (random init) so softmax comes out <b>nearly flat</b> - 0.27 vs 0.24 vs 0.23 vs 0.26. The model is guessing: it cannot tell a true neighbour from a random word. Recognise an untrained or stuck word2vec by this evenness early in training; as it learns, mass should migrate onto the genuine context words and the bars should spread out like the ideal chart."
    },
    {
      type: "bars",
      title: "Variant - over-peaked softmax: one word hogs almost all the mass",
      labels: ["the", "cat (true)", "drives", "purple"],
      values: [0.990, 0.007, 0.002, 0.001],
      valueLabels: ["0.99", "0.007", "0.002", "0.001"],
      colors: ["#ff7b72", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Illustrative. The bars sum to 1 but one word swallows 0.99 while every other true neighbour ('cat') is starved near zero. A single spiked bar means the dot-product scores are <b>extreme</b> - often from too-large vectors or too-high a learning rate. Recognise it when one context word dominates and the rest collapse: the model has become over-confident and stops learning useful gradients for the suppressed words. Tame it with smaller steps, normalization, or negative sampling rather than the full softmax."
    }
  ],
  caption: "word2vec scores each context word by a dot product and softmaxes to a distribution that sums to 1; a trained model concentrates mass on real neighbours and arranges vectors so king - man + woman = queen, while an untrained one stays flat and an over-peaked one spikes on a single word.",
  code: "// Skip-gram: P(t|c) = exp(theta_t . e_c) / sum_j exp(theta_j . e_c)\nfunction softmax(scores) {\n  const e = scores.map(function (s) { return Math.exp(s); });\n  const Z = e.reduce(function (a, b) { return a + b; }, 0);\n  return e.map(function (x) { return x / Z; });\n}\nconst scores = [3.0, 2.4, 0.5, -0.5]; // theta_t . e_c for 4 candidate words\nconst p = softmax(scores);\nconsole.log(p.map(function (x) { return x.toFixed(3); })); // 0.602,0.330,0.049,0.018\nconsole.log('sum =', p.reduce(function (a, b) { return a + b; }, 0).toFixed(3)); // 1\n// analogy: king - man + woman\nconst king = [0.9, 0.1], man = [0.1, 0.1], woman = [0.1, 0.9];\nconst r = [king[0] - man[0] + woman[0], king[1] - man[1] + woman[1]];\nconsole.log('king - man + woman =', r); // [0.9, 0.9] == queen"
};

window.CODEVIZ["dl-cosine-similarity"] = {
  question: "Using real word vectors, how does cosine similarity score related vs unrelated word pairs — and how do you read it geometrically?",
  charts: [
    {
      type: "bars",
      title: "Ideal: cosine similarity between real word-vector pairs",
      labels: ["king vs queen", "paris vs london", "cat vs dog", "king vs cat", "king vs france"],
      values: [0.834, 0.997, 0.999, -0.311, -0.319],
      valueLabels: ["0.83", "0.997", "0.999", "-0.31", "-0.32"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72"],
      interpret: "Each bar is the cosine similarity of one word pair: <b>+1</b> means the two vectors point the same way, <b>0</b> means a right angle (unrelated), <b>-1</b> means opposite. Read the height: same-topic pairs (cat/dog 0.999, paris/london 0.997, king/queen 0.83) sit near the top in green, while cross-topic pairs (king/cat, king/france) dip below the zero line in red. Conclude that cosine cleanly separates related from unrelated meanings, and that the sign alone tells you 'alike' vs 'opposed'."
    },
    {
      type: "scatter",
      title: "Variant: the three reference angles (illustrative)",
      xlabel: "x component",
      ylabel: "y component",
      groups: [
        { name: "reference a", color: "#9aa7b4", points: [[3, 0]] },
        { name: "same dir, cos=1", color: "#7ee787", points: [[2, 0]] },
        { name: "right angle, cos=0", color: "#ffb454", points: [[0, 2]] },
        { name: "opposite, cos=-1", color: "#ff7b72", points: [[-2.4, 0]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: false, points: [[0, 0], [3, 0]] },
        { color: "#7ee787", dash: true, points: [[0, 0], [2, 0]] },
        { color: "#ffb454", dash: true, points: [[0, 0], [0, 2]] },
        { color: "#ff7b72", dash: true, points: [[0, 0], [-2.4, 0]] }
      ],
      interpret: "Illustrative geometry: every arrow starts at the origin, and cosine only cares about the <b>angle</b> to the grey reference arrow, never the length. Green lies on top of the reference (0 degrees, cosine 1); orange is straight up at a right angle (90 degrees, cosine 0); red points the opposite way (180 degrees, cosine -1). Notice the green arrow is shorter than the reference yet still scores 1 — that is the whole point: a vector twice or half as long but pointing the same way is identical to cosine."
    },
    {
      type: "hist",
      title: "Variant: curse of dimensionality — cosines bunch near 0 (illustrative)",
      labels: ["-0.4", "-0.3", "-0.2", "-0.1", "0", "0.1", "0.2", "0.3", "0.4"],
      values: [1, 4, 14, 33, 41, 32, 13, 4, 1],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"],
      interpret: "Illustrative: each bar counts how many random high-dimensional vector pairs landed in that cosine range. In hundreds of dimensions almost every pair is nearly perpendicular, so the counts pile up in a tall narrow spike around <b>0</b> with almost nothing out near +1 or -1. The lesson: 'high' cosine is relative — in high dimensions a score of 0.3 may already be unusually similar, so calibrate your threshold on real data instead of assuming 0.8 means 'close'."
    }
  ],
  caption: "Cosine measures direction, not length. The main bar chart shows real word-vector scores; the scatter shows the three reference angles you read off (1 / 0 / -1); the histogram warns that in high dimensions most pairs look mildly unrelated.",
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
};

window.CODEVIZ["dl-attention"] = {
  question: "How do you read an attention heatmap — and how do healthy, diffuse, and causal-masked attention look different?",
  charts: [
    {
      type: "heatmap",
      title: "Ideal: focused self-attention (each row sums to 1)",
      rows: ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8"],
      cols: ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8"],
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
      showVals: true,
      interpret: "Real self-attention over the 8 pixel-rows of a digit image. Read it one <b>row at a time</b>: a row is the query, the columns are the keys it can look at, and the numbers along that row are the attention weights — they always sum to 1. Brighter cells get more focus. Here the bright cells sit near the diagonal (row7 attends 0.33 to itself, row3 0.27 to itself), meaning each row leans on itself and on rows with a similar pixel pattern. A clear, peaky pattern like this is the sign of attention that has learned to focus."
    },
    {
      type: "heatmap",
      title: "Variant: diffuse attention — model is not focusing (illustrative)",
      rows: ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8"],
      cols: ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8"],
      matrix: [
        [0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12],
        [0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13],
        [0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12],
        [0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13],
        [0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12],
        [0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13],
        [0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12],
        [0.12, 0.13, 0.12, 0.13, 0.12, 0.13, 0.12, 0.13]
      ],
      showVals: true,
      interpret: "Illustrative failure mode. Every cell is near 1/8 = 0.125, so the whole grid is one flat color with no bright spots. Each row still sums to 1, but it spreads that 1 evenly across all keys — the model is averaging everything and focusing on nothing. You see this when scores are too small (often because they were not scaled by the square root of the key dimension, so the softmax flattens out), or very early in training. Takeaway: a washed-out, uniform map means attention is carrying no useful signal yet."
    },
    {
      type: "heatmap",
      title: "Variant: causal mask — a token cannot see the future (illustrative)",
      rows: ["tok1", "tok2", "tok3", "tok4", "tok5", "tok6", "tok7", "tok8"],
      cols: ["tok1", "tok2", "tok3", "tok4", "tok5", "tok6", "tok7", "tok8"],
      matrix: [
        [1.00, 0, 0, 0, 0, 0, 0, 0],
        [0.55, 0.45, 0, 0, 0, 0, 0, 0],
        [0.40, 0.33, 0.27, 0, 0, 0, 0, 0],
        [0.30, 0.26, 0.24, 0.20, 0, 0, 0, 0],
        [0.26, 0.22, 0.20, 0.17, 0.15, 0, 0, 0],
        [0.22, 0.20, 0.18, 0.15, 0.13, 0.12, 0, 0],
        [0.20, 0.18, 0.16, 0.14, 0.12, 0.11, 0.09, 0],
        [0.18, 0.16, 0.15, 0.13, 0.12, 0.11, 0.08, 0.07]
      ],
      showVals: true,
      interpret: "Illustrative decoder attention with a causal mask. The entire <b>upper-right triangle is zero</b>: token 3 can attend to tokens 1, 2, and itself, but never to tokens 4 onward. This is what stops an autoregressive model from peeking at the answer it is trying to predict. Each row still sums to 1, just spread only over the keys at or before it. If you ever see weight in the upper triangle of a decoder map, the causal mask is missing — a bug that leaks future tokens during generation."
    }
  ],
  caption: "An attention map has queries down the rows, keys across the columns, and each row's weights sum to 1 (brighter = more focus). The ideal map is peaky; a flat uniform map means the model is not focusing; a triangular map is a causal decoder that cannot see future tokens.",
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
};

window.CODEVIZ["dl-data-augmentation"] = {
  question: "On real digits seen at an angle, does training-time augmentation actually improve accuracy?",
  charts: [
    {
      type: "bars",
      title: "Helpful: accuracy on rotated test digits as augmentations are added",
      labels: ["no aug", "+rotate15", "+rotate-15", "+rotate20", "+shift (all)"],
      values: [0.70, 0.924, 0.909, 0.97, 0.969],
      valueLabels: ["0.70", "0.92", "0.91", "0.97", "0.97"],
      colors: ["#ff7b72", "#ffb454", "#ffb454", "#4ea1ff", "#7ee787"],
      interpret: "Each bar is real test accuracy on digits rotated 18 degrees the model never saw raw; left to right we add more matching augmented training copies. The bar climbs from <b>0.70</b> (red, no aug) to <b>0.97</b> (green). <b>Read it as:</b> bars going up as you add augmentations that match the test variation means the model is learning the right invariance for free."
    },
    {
      type: "bars",
      title: "Too aggressive: extreme distortion pushes accuracy back down",
      labels: ["no aug", "mild rot15", "rot45", "rot90", "rot+huge noise"],
      values: [0.70, 0.95, 0.88, 0.62, 0.55],
      valueLabels: ["0.70", "0.95", "0.88", "0.62", "0.55"],
      colors: ["#9aa7b4", "#7ee787", "#ffb454", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative shape. Mild augmentation (green) helps, but as the transforms get extreme the bars fall <b>below</b> the no-aug baseline. <b>Read it as:</b> a peak-then-drop curve means you have over-augmented — the distorted images no longer look like real digits, so the model trains on examples it will never meet. The fix is to dial the augmentation strength back to the green peak."
    },
    {
      type: "bars",
      title: "Label-breaking: a flip that changes the right answer collapses accuracy",
      labels: ["no aug", "+shift", "+crop", "+vertical flip", "+all (with flip)"],
      values: [0.92, 0.94, 0.95, 0.61, 0.58],
      valueLabels: ["0.92", "0.94", "0.95", "0.61", "0.58"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative shape. Safe transforms (green) keep accuracy high, but adding a vertical flip (red) crashes it — flipping turns a 6 into a 9 while the label still says 6, so the model is taught wrong answers. <b>Read it as:</b> one augmentation that suddenly tanks accuracy is a label-breaking transform; remove transforms that change what the object actually is."
    },
    {
      type: "line",
      title: "Generalization gap: augmentation narrows train-minus-validation",
      xlabel: "epoch",
      ylabel: "accuracy",
      series: [
        { name: "train (no aug)", color: "#9aa7b4", points: [[1, 0.80], [5, 0.95], [10, 0.99], [15, 1.0], [20, 1.0]] },
        { name: "val (no aug)", color: "#ff7b72", points: [[1, 0.72], [5, 0.80], [10, 0.81], [15, 0.80], [20, 0.79]] },
        { name: "val (with aug)", color: "#7ee787", points: [[1, 0.70], [5, 0.83], [10, 0.90], [15, 0.93], [20, 0.94]] }
      ],
      interpret: "Illustrative. Without augmentation, train accuracy (grey) hits 1.0 while validation (red) stalls near 0.80 — a big gap is overfitting. With augmentation, validation (green) keeps climbing toward train. <b>Read it as:</b> a shrinking distance between the train curve and the green validation curve means augmentation is buying generalization, not just memorization."
    }
  ],
  caption: "The main bar chart is a real experiment (train an MLP on load_digits, test on the SAME digits rotated 18 degrees): no augmentation scores 0.70, matching rotated/shifted copies lift it to 0.97. The variants show the failure modes each chart self-explains.",
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
};
