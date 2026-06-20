/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 3 (Deep Learning, CS230), PART A.
   Lessons 1-14 in file order:
     dl-neuron, dl-activations, dl-forward-prop, dl-cross-entropy,
     dl-backprop, dl-optimizers, dl-minibatch, dl-init, dl-dropout,
     dl-batchnorm, dl-early-stopping, dl-conv, dl-pooling,
     dl-conv-hyperparams.
   Each lesson has exactly 3 walkthroughs in distinct real-world domains.
   torch is NOT available: code uses numpy / scipy / scikit-learn.
   Every code block was actually run with python3; output is exact stdout.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================ dl-neuron ============================ */
  "dl-neuron": [
    {
      title: `One neuron scoring an image patch`,
      domain: `Computer vision`,
      question: `What single number does one neuron output for a small grayscale image patch?`,
      steps: [
        { title: `The data`, body: `<p>Take an 8&times;8 grayscale digit patch. Flatten it into a vector $x$ of 64 pixel intensities, each in $[0,1]$. One neuron has 64 weights $w$ (one per pixel) and a bias $b$.</p>` },
        { title: `The math`, body: `<p>The neuron computes $z = w^\\top x + b$: multiply each pixel by its weight, sum, then add the bias. That is one dot product plus one number.</p>` },
        { title: `Run it`, body: `<p>Build the patch and weights with numpy and compute the dot product.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
# 8x8 grayscale digit patch flattened -> 64 pixel intensities in [0,1]
x = rng.random(64)
w = rng.normal(0, 0.1, 64)   # one neuron's weights
b = 0.5
z = w @ x + b                # dot product + bias
print("z = w.x + b =", round(z, 4))`,
          output: `z = w.x + b = 0.8693` }
      ],
      conclusion: `The neuron collapses 64 pixels into a single pre-activation $z = w^\\top x + b = 0.8693$. Stacked by the thousands, these dot-products become an image classifier.`
    },
    {
      title: `A neuron over speech MFCC features`,
      domain: `Speech recognition`,
      question: `Given the MFCC features of one audio frame, what pre-activation does a neuron produce?`,
      steps: [
        { title: `The data`, body: `<p>A 25&nbsp;ms speech frame is summarized by 13 MFCC numbers (a compact description of the sound). That is the input vector $x$.</p>` },
        { title: `The math`, body: `<p>The neuron weights each MFCC by how much it matters for a phoneme, sums them, and adds a bias: $z = w^\\top x + b$.</p>` },
        { title: `Run it`, body: `<p>One frame, one neuron, one dot product.</p>`,
          code: `import numpy as np
# 13 MFCC speech features for one audio frame
x = np.array([2.1,-0.4,1.3,0.7,-1.1,0.2,0.9,-0.3,0.5,-0.8,1.0,0.1,-0.6])
w = np.array([0.3,-0.5,0.2,0.1,0.4,-0.2,0.6,0.0,-0.3,0.5,0.1,-0.4,0.2])
b = -0.25
z = float(np.dot(w, x) + b)
print("pre-activation z =", round(z, 4))`,
          output: `pre-activation z = 0.36` }
      ],
      conclusion: `The frame's 13 MFCCs combine into one number $z = 0.36$. An acoustic model has thousands of such neurons firing on every frame.`
    },
    {
      title: `A spam-word neuron`,
      domain: `NLP (spam filtering)`,
      question: `From the word counts in an email, what raw spam score does a neuron give?`,
      steps: [
        { title: `The data`, body: `<p>Count four words in an email: $x = [\\text{free}, \\text{money}, \\text{meeting}, \\text{hello}]$. Spammy words get positive weights, normal words get negative weights.</p>` },
        { title: `The math`, body: `<p>$z = w^\\top x + b$. A high $z$ leans spam, a low $z$ leans not-spam. The bias $b$ sets the baseline.</p>` },
        { title: `Run it`, body: `<p>Counts $[3,2,0,1]$ with weights $[1.5,1.2,-1.0,-0.3]$ and bias $-2$.</p>`,
          code: `import numpy as np
# spam neuron: counts of [free, money, meeting, hello]
x = np.array([3, 2, 0, 1])
w = np.array([1.5, 1.2, -1.0, -0.3])
b = -2.0
z = int(np.dot(w, x)) + b
print("spam score z =", z)`,
          output: `spam score z = 4.0` }
      ],
      conclusion: `Three "free" and two "money" mentions push $z = 4.0$, well above 0 — a strong spam lean before any activation squishes it to a probability.`
    }
  ],

  /* ========================= dl-activations ========================= */
  "dl-activations": [
    {
      title: `ReLU on a conv feature map`,
      domain: `Computer vision`,
      question: `What does ReLU do to the raw outputs of a convolution layer?`,
      steps: [
        { title: `The data`, body: `<p>A convolution produces signed numbers $z$ at each location: negatives mean "anti-pattern", positives mean "pattern found".</p>` },
        { title: `The math`, body: `<p>$\\text{ReLU}(z) = \\max(0, z)$. Keep positives, flatten negatives to 0. This is the activation in almost every modern vision net.</p>` },
        { title: `Run it`, body: `<p>Apply ReLU elementwise.</p>`,
          code: `import numpy as np
# raw conv outputs (logits) for a vision feature map cell
z = np.array([-3.0, -0.5, 0.0, 2.0, 5.0])
relu = np.maximum(0, z)
print("z   =", z.tolist())
print("ReLU=", relu.tolist())`,
          output: `z   = [-3.0, -0.5, 0.0, 2.0, 5.0]
ReLU= [0.0, 0.0, 0.0, 2.0, 5.0]` }
      ],
      conclusion: `ReLU keeps $\\{2, 5\\}$ and zeroes out the negatives. The bend at 0 is what lets stacked layers learn curvy patterns instead of one straight line.`
    },
    {
      title: `Sigmoid as a tumor probability`,
      domain: `Medical imaging`,
      question: `How does sigmoid turn a tumor-detector's raw score into a probability?`,
      steps: [
        { title: `The data`, body: `<p>The detector's final neuron outputs one logit $z$ for a scan. We need a probability in $[0,1]$ for "tumor present".</p>` },
        { title: `The math`, body: `<p>$\\sigma(z) = \\frac{1}{1+e^{-z}}$. Big positive $z$ &rarr; near 1, big negative $z$ &rarr; near 0, and $\\sigma(0) = 0.5$.</p>` },
        { title: `Run it`, body: `<p>Map several logits through sigmoid.</p>`,
          code: `import numpy as np
# tumor-detector final logit -> sigmoid probability
def sigmoid(z): return 1/(1+np.exp(-z))
for z in [-2.0, 0.0, 1.5, 4.0]:
    print("z=%5.1f  sigmoid=%.4f" % (z, sigmoid(z)))`,
          output: `z= -2.0  sigmoid=0.1192
z=  0.0  sigmoid=0.5000
z=  1.5  sigmoid=0.8176
z=  4.0  sigmoid=0.9820` }
      ],
      conclusion: `A logit of $4.0$ becomes a $0.982$ probability of tumor. Sigmoid is the standard final activation for yes/no medical screening.`
    },
    {
      title: `tanh inside a sentiment cell`,
      domain: `NLP (sentiment)`,
      question: `Why is tanh used to squash a recurrent hidden state, and what range does it give?`,
      steps: [
        { title: `The data`, body: `<p>A recurrent net carries a running sentiment "state" $z$ that can drift large in either direction as words stream in.</p>` },
        { title: `The math`, body: `<p>$\\tanh(z) = \\frac{e^{z}-e^{-z}}{e^{z}+e^{-z}}$ squashes any value into $(-1, 1)$, centered at 0 — handy for a signed signal.</p>` },
        { title: `Run it`, body: `<p>Squash a range of states.</p>`,
          code: `import numpy as np
# tanh squashes a sentiment hidden state to (-1, 1)
z = np.array([-3.0, -1.0, 0.0, 1.0, 3.0])
print("tanh =", np.round(np.tanh(z), 4).tolist())`,
          output: `tanh = [-0.9951, -0.7616, 0.0, 0.7616, 0.9951]` }
      ],
      conclusion: `Even an extreme state of $\\pm 3$ is held inside $(-1, 1)$ as $\\pm 0.9951$. The zero-centered range keeps recurrent states from blowing up.`
    }
  ],

  /* ======================== dl-forward-prop ========================= */
  "dl-forward-prop": [
    {
      title: `Forward pass over an image patch`,
      domain: `Computer vision`,
      question: `How does a 2-layer net turn 3 pixel values into one prediction?`,
      steps: [
        { title: `The data`, body: `<p>Input a tiny 3-pixel patch $x = [1, 2, 0.5]$. Layer 1 has 2 ReLU neurons; layer 2 produces one output.</p>` },
        { title: `The math`, body: `<p>$a^{[1]} = \\text{ReLU}(W^{[1]}x + b^{[1]})$, then $y = W^{[2]}a^{[1]} + b^{[2]}$. The output of layer 1 becomes the input of layer 2.</p>` },
        { title: `Run it`, body: `<p>Chain the two matrix-vector products.</p>`,
          code: `import numpy as np
# 2-layer net forward pass on a 3-pixel image patch
x = np.array([1.0, 2.0, 0.5])
W1 = np.array([[0.5,-1.0,0.3],[1.0,0.2,-0.4]]); b1 = np.array([0.1,-0.5])
W2 = np.array([1.5,-0.5]); b2 = 0.2
relu = lambda z: np.maximum(0,z)
a1 = relu(W1@x + b1)
y = W2@a1 + b2
print("a1 =", np.round(a1,3).tolist())
print("y  =", round(float(y),4))`,
          output: `a1 = [0.0, 0.7]
y  = -0.15` }
      ],
      conclusion: `ReLU zeroed the first hidden neuron, so only $a^{[1]}_2 = 0.7$ flows on, giving $y = -0.15$. That left-to-right chaining is forward propagation.`
    },
    {
      title: `Predicting a steering angle`,
      domain: `Self-driving`,
      question: `From lane offset and curvature, what steering command does a small net output?`,
      steps: [
        { title: `The data`, body: `<p>Inputs $x = [\\text{lane offset}, \\text{road curvature}] = [0.8, -0.3]$. The output is a steering angle squashed by tanh into $(-1, 1)$.</p>` },
        { title: `The math`, body: `<p>Hidden layer: $a^{[1]} = \\text{ReLU}(W^{[1]}x + b^{[1]})$. Output: $\\text{steer} = \\tanh(W^{[2]}a^{[1]} + b^{[2]})$.</p>` },
        { title: `Run it`, body: `<p>Run the forward pass to a steering value.</p>`,
          code: `import numpy as np
# tiny steering net: inputs = [lane_offset, curvature]
x = np.array([0.8, -0.3])
W1 = np.array([[1.2,-0.7],[0.4,0.9],[-1.0,0.5]]); b1 = np.array([0.0,0.1,-0.2])
W2 = np.array([0.6,-0.4,0.9]); b2 = 0.05
a1 = np.maximum(0, W1@x + b1)
steer = float(np.tanh(W2@a1 + b2))   # steering angle in (-1,1)
print("hidden =", np.round(a1,3).tolist())
print("steering =", round(steer,4))`,
          output: `hidden = [1.17, 0.15, 0.0]
steering = 0.5993` }
      ],
      conclusion: `A positive lane offset drives $\\text{steer} = 0.5993$ — a moderate right correction. The whole driving policy is forward props like this, many times a second.`
    },
    {
      title: `Softmax over phoneme classes`,
      domain: `Speech recognition`,
      question: `How does the output layer pick one of three phonemes?`,
      steps: [
        { title: `The data`, body: `<p>The hidden layer's activation $a^{[1]}$ feeds an output layer with 3 neurons, one per phoneme class.</p>` },
        { title: `The math`, body: `<p>Logits $= W^{[2]}a^{[1]} + b^{[2]}$, then softmax $p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$ turns them into probabilities that sum to 1.</p>` },
        { title: `Run it`, body: `<p>Forward to logits, then softmax, then argmax.</p>`,
          code: `import numpy as np
def softmax(z):
    e = np.exp(z - z.max()); return e/e.sum()
# forward pass to 3 phoneme classes
a1 = np.array([0.5, 1.2, -0.3, 0.8])
W2 = np.array([[1.0,-0.5,0.2,0.4],[0.1,0.9,-0.3,0.0],[-0.6,0.2,1.1,-0.2]])
b2 = np.array([0.1,-0.2,0.0])
logits = W2@a1 + b2
p = softmax(logits)
print("logits =", np.round(logits,3).tolist())
print("probs  =", np.round(p,4).tolist())
print("predicted phoneme =", int(np.argmax(p)))`,
          output: `logits = [0.26, 1.02, -0.55]
probs  = [0.2791, 0.5968, 0.1242]
predicted phoneme = 1` }
      ],
      conclusion: `Softmax converts the logits to probabilities $[0.28, 0.60, 0.12]$, so phoneme&nbsp;1 wins with $0.5968$. Forward prop ends at the prediction.`
    }
  ],

  /* ======================= dl-cross-entropy ========================= */
  "dl-cross-entropy": [
    {
      title: `How much a cat/dog guess costs`,
      domain: `Computer vision`,
      question: `For a true "cat" image, how does the loss grow as the predicted probability shrinks?`,
      steps: [
        { title: `The data`, body: `<p>True label $y = 1$ (it is a cat). The model outputs a probability $z$. Compare four confidence levels.</p>` },
        { title: `The math`, body: `<p>$L = -[\\,y\\log z + (1-y)\\log(1-z)\\,]$. With $y = 1$ this is just $L = -\\log z$.</p>` },
        { title: `Run it`, body: `<p>Sweep the predicted probability.</p>`,
          code: `import numpy as np
# binary cross-entropy: is this image a cat? true label y=1
y = 1
for p in [0.9, 0.5, 0.1, 0.01]:
    L = -(y*np.log(p) + (1-y)*np.log(1-p))
    print("p=%.2f  loss=%.4f" % (p, L))`,
          output: `p=0.90  loss=0.1054
p=0.50  loss=0.6931
p=0.10  loss=2.3026
p=0.01  loss=4.6052` }
      ],
      conclusion: `Confident-and-right ($p=0.9$) costs $0.105$; confident-and-wrong ($p=0.01$) costs $4.605$. Cross-entropy punishes confident mistakes hardest.`
    },
    {
      title: `Average loss over a batch of scans`,
      domain: `Medical imaging`,
      question: `What is the mean cross-entropy across five disease-screening predictions?`,
      steps: [
        { title: `The data`, body: `<p>Five scans with true labels $y$ and model probabilities $p$. We want one number summarizing how wrong the batch was.</p>` },
        { title: `The math`, body: `<p>Average the per-example losses: $\\frac{1}{N}\\sum_i -[\\,y_i\\log p_i + (1-y_i)\\log(1-p_i)\\,]$.</p>` },
        { title: `Run it`, body: `<p>Use sklearn's $\\texttt{log\\_loss}$.</p>`,
          code: `import numpy as np
from sklearn.metrics import log_loss
# 5 scans, true disease labels, model probabilities
y = np.array([1,0,1,1,0])
p = np.array([0.95,0.10,0.80,0.30,0.05])
print("avg cross-entropy =", round(log_loss(y, p),4))`,
          output: `avg cross-entropy = 0.327` }
      ],
      conclusion: `The batch averages to $0.327$. The one bad prediction ($y=1$ but $p=0.30$) dominates the average — exactly the signal training drives down.`
    },
    {
      title: `Cross-entropy for language ID`,
      domain: `NLP (language detection)`,
      question: `How wrong is a 3-way language guess when the true class scores the lowest logit?`,
      steps: [
        { title: `The data`, body: `<p>Three candidate languages with logits $[1, 2, 3]$. The true language is class 2 (index 2).</p>` },
        { title: `The math`, body: `<p>Softmax to probabilities, then multi-class cross-entropy $L = -\\log p_{\\text{true}}$.</p>` },
        { title: `Run it`, body: `<p>Softmax then read off the true class.</p>`,
          code: `import numpy as np
# multi-class cross-entropy for language ID (true class = 2)
def softmax(z):
    e=np.exp(z-z.max()); return e/e.sum()
logits = np.array([1.0, 2.0, 3.0])
p = softmax(logits)
true = 2
L = -np.log(p[true])
print("probs =", np.round(p,4).tolist())
print("loss  =", round(float(L),4))`,
          output: `probs = [0.09, 0.2447, 0.6652]
loss  = 0.4076` }
      ],
      conclusion: `The true class got $p = 0.6652$, so the loss is $-\\log(0.6652) = 0.4076$. Driving this down pushes the true-class probability toward 1.`
    }
  ],

  /* ========================== dl-backprop =========================== */
  "dl-backprop": [
    {
      title: `Chain rule on one weight`,
      domain: `Computer vision`,
      question: `For a single weight in a ReLU neuron, what gradient does backprop compute and how does the weight update?`,
      steps: [
        { title: `The data`, body: `<p>Forward: $z = wx$, $a = \\text{ReLU}(z)$, $L = (a-y)^2$, with $x=3$, $w=1$, $y=2$.</p>` },
        { title: `The math`, body: `<p>$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a}\\cdot\\frac{\\partial a}{\\partial z}\\cdot\\frac{\\partial z}{\\partial w} = 2(a-y)\\cdot[z&gt;0]\\cdot x$, then $w \\leftarrow w - \\eta\\frac{\\partial L}{\\partial w}$.</p>` },
        { title: `Run it`, body: `<p>Chain the three slopes and take one gradient step.</p>`,
          code: `import numpy as np
# one weight, chain rule. forward: z=w*x, a=relu(z), L=(a-y)^2
x, w, y = 3.0, 1.0, 2.0
z = w*x; a = max(0,z)
dL_da = 2*(a-y)            # 2*(3-2)=2
da_dz = 1.0 if z>0 else 0  # relu slope
dz_dw = x
grad = dL_da*da_dz*dz_dw
eta = 0.1
w_new = w - eta*grad
print("loss      =", (a-y)**2)
print("dL/dw     =", grad)
print("new w     =", round(w_new,3))`,
          output: `loss      = 1.0
dL/dw     = 6.0
new w     = 0.7` }
      ],
      conclusion: `Backprop chains $2 \\times 1 \\times 3 = 6$ for $\\frac{\\partial L}{\\partial w}$, then steps $w$ from $1$ to $0.7$ — downhill on the loss.`
    },
    {
      title: `Gradient check on a logistic neuron`,
      domain: `NLP (text classification)`,
      question: `Does the analytic backprop gradient match a numerical estimate?`,
      steps: [
        { title: `The data`, body: `<p>A logistic neuron over a 4-feature text vector with true label $y = 1$. We trust backprop only if it matches a finite-difference check.</p>` },
        { title: `The math`, body: `<p>For sigmoid + cross-entropy the gradient is famously simple: $\\frac{\\partial L}{\\partial w} = (p - y)\\,x$. Compare it to $\\frac{L(w+\\epsilon) - L(w-\\epsilon)}{2\\epsilon}$.</p>` },
        { title: `Run it`, body: `<p>Compute both and the max difference.</p>`,
          code: `import numpy as np
# numeric gradient check vs analytic backprop on a logistic neuron
rng = np.random.default_rng(0)
x = rng.normal(size=4); w = rng.normal(size=4); y = 1.0
def sigmoid(z): return 1/(1+np.exp(-z))
def loss(w):
    p = sigmoid(w@x); return -(y*np.log(p)+(1-y)*np.log(1-p))
p = sigmoid(w@x)
analytic = (p - y)*x          # dL/dw for logistic + BCE
eps = 1e-6; numeric = np.zeros(4)
for i in range(4):
    wp = w.copy(); wp[i]+=eps; wm=w.copy(); wm[i]-=eps
    numeric[i] = (loss(wp)-loss(wm))/(2*eps)
print("analytic =", np.round(analytic,5).tolist())
print("numeric  =", np.round(numeric,5).tolist())
print("max diff =", round(float(np.max(np.abs(analytic-numeric))),9))`,
          output: `analytic = [-0.03846, 0.04041, -0.19591, -0.03209]
numeric  = [-0.03846, 0.04041, -0.19591, -0.03209]
max diff = 0.0` }
      ],
      conclusion: `Analytic and numeric gradients agree to within $10^{-9}$, so the backprop formula $(p-y)x$ is correct — the standard gradient-check engineers run before training.`
    },
    {
      title: `Backprop through two layers`,
      domain: `Speech recognition`,
      question: `How do gradients flow back through a hidden ReLU layer to its weight matrix?`,
      steps: [
        { title: `The data`, body: `<p>Input $x = [1, -2]$, target $y = 0$. Forward: $z^{[1]} = W^{[1]}x$, $a^{[1]} = \\text{ReLU}(z^{[1]})$, $\\hat{y} = W^{[2]}a^{[1]}$.</p>` },
        { title: `The math`, body: `<p>Back: $\\frac{\\partial L}{\\partial \\hat{y}} = 2(\\hat{y}-y)$; $\\frac{\\partial L}{\\partial W^{[2]}} = \\frac{\\partial L}{\\partial \\hat{y}}a^{[1]}$; push through ReLU with $[z^{[1]}&gt;0]$ to get $\\frac{\\partial L}{\\partial W^{[1]}}$.</p>` },
        { title: `Run it`, body: `<p>Do the full backward pass.</p>`,
          code: `import numpy as np
# backprop through a 2-layer net by chaining local gradients
x = np.array([1.0,-2.0]); y = 0.0
W1 = np.array([[0.5,-1.0],[1.0,0.5]]); W2 = np.array([1.0,-1.0])
z1 = W1@x; a1 = np.maximum(0,z1)
yhat = W2@a1
L = (yhat-y)**2
dL_dyhat = 2*(yhat-y)
dL_dW2 = dL_dyhat*a1
da1 = dL_dyhat*W2
dz1 = da1*(z1>0)
dL_dW1 = np.outer(dz1, x)
print("yhat   =", round(float(yhat),3), " loss =", round(float(L),3))
print("dL/dW2 =", np.round(dL_dW2,3).tolist())
print("dL/dW1 =", np.round(dL_dW1,3).tolist())`,
          output: `yhat   = 2.5  loss = 6.25
dL/dW2 = [12.5, 0.0]
dL/dW1 = [[5.0, -10.0], [-0.0, 0.0]]` }
      ],
      conclusion: `The ReLU gate kills the gradient for the second hidden unit (its $z^{[1]} \\le 0$), so its weight row stays $[0, 0]$. Backprop is just the chain rule routed through the forward graph.`
    }
  ],

  /* ========================= dl-optimizers ========================== */
  "dl-optimizers": [
    {
      title: `Momentum vs plain SGD downhill`,
      domain: `Computer vision`,
      question: `On a simple bowl loss, does momentum reach the bottom faster than plain SGD?`,
      steps: [
        { title: `The data`, body: `<p>Minimize $f(x) = x^2$ starting at $x = 4$. The gradient is $f'(x) = 2x$; the minimum is at 0.</p>` },
        { title: `The math`, body: `<p>SGD: $x \\leftarrow x - \\eta f'(x)$. Momentum keeps a velocity $v \\leftarrow \\beta v + (1-\\beta)f'(x)$ then $x \\leftarrow x - \\eta v$, building speed in a consistent direction.</p>` },
        { title: `Run it`, body: `<p>Run 5 steps of each and compare positions.</p>`,
          code: `import numpy as np
# minimize f(x)=x^2 from x=4. compare plain SGD vs momentum.
def df(x): return 2*x
lr = 0.1
x_sgd = 4.0; x_mom = 4.0; v = 0.0; beta = 0.9
for step in range(1,6):
    x_sgd -= lr*df(x_sgd)
    v = beta*v + (1-beta)*df(x_mom); x_mom -= lr*v
print("step  SGD     Momentum")
x_sgd=4.0; x_mom=4.0; v=0.0
for step in range(1,6):
    x_sgd -= lr*df(x_sgd)
    v = beta*v + (1-beta)*df(x_mom); x_mom -= lr*v
    print("%4d  %.4f  %.4f" % (step, x_sgd, x_mom))`,
          output: `step  SGD     Momentum
   1  3.2000  3.9200
   2  2.5600  3.7696
   3  2.0480  3.5588
   4  1.6384  3.2980
   5  1.3107  2.9973` }
      ],
      conclusion: `Here SGD's larger steps actually drop faster early, but momentum's velocity is still building — across many steps it accelerates and smooths out the zig-zags that slow plain SGD on real loss surfaces.`
    },
    {
      title: `Adam's adaptive steps`,
      domain: `Speech recognition`,
      question: `How does Adam adapt its step size as it homes in on the minimum of a loss?`,
      steps: [
        { title: `The data`, body: `<p>Minimize $f(w) = (w-3)^2$ from $w = 0$. The optimum is $w = 3$.</p>` },
        { title: `The math`, body: `<p>Adam tracks a smoothed gradient $m$ and squared gradient $v$, bias-corrects them, and steps $w \\leftarrow w - \\eta\\,\\hat{m}/(\\sqrt{\\hat{v}}+\\epsilon)$ — a per-weight adaptive rate.</p>` },
        { title: `Run it`, body: `<p>Run 5 Adam updates.</p>`,
          code: `import numpy as np
# Adam optimizer steps on a 1-D quadratic loss f(w)=(w-3)^2
def grad(w): return 2*(w-3)
w=0.0; m=0.0; v=0.0; b1,b2,eps,lr=0.9,0.999,1e-8,0.5
for t in range(1,6):
    g=grad(w)
    m=b1*m+(1-b1)*g; vv=b2*v+(1-b2)*g*g; v=vv
    mhat=m/(1-b1**t); vhat=v/(1-b2**t)
    w-=lr*mhat/(np.sqrt(vhat)+eps)
    print("t=%d  w=%.4f" % (t, w))`,
          output: `t=1  w=0.5000
t=2  w=0.9956
t=3  w=1.4823
t=4  w=1.9541
t=5  w=2.4031` }
      ],
      conclusion: `Adam marches steadily from $0$ toward the optimum $3$, taking near-uniform-size steps because it normalizes by the gradient magnitude — no manual step tuning needed.`
    },
    {
      title: `Adam vs SGD on a trained net`,
      domain: `NLP (text classification)`,
      question: `With the same budget, which optimizer drives a real network's training loss lower?`,
      steps: [
        { title: `The data`, body: `<p>A 300-sample, 20-feature classification dataset, fit by an MLP with one 16-unit hidden layer for 60 iterations.</p>` },
        { title: `The math`, body: `<p>Both solvers do gradient descent; Adam additionally adapts the per-weight step using past gradients. We compare the final training loss.</p>` },
        { title: `Run it`, body: `<p>Train once with $\\texttt{sgd}$ and once with $\\texttt{adam}$.</p>`,
          code: `import warnings; warnings.filterwarnings("ignore")
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
X,y = make_classification(n_samples=300, n_features=20, random_state=0)
for solver in ["sgd","adam"]:
    clf = MLPClassifier(hidden_layer_sizes=(16,), solver=solver,
                        max_iter=60, random_state=0)
    clf.fit(X,y)
    print("%-4s final training loss = %.4f" % (solver, clf.loss_))`,
          output: `sgd  final training loss = 0.5477
adam final training loss = 0.4226` }
      ],
      conclusion: `With identical settings, Adam reaches a lower loss ($0.4226$ vs $0.5477$) in the same 60 iterations — why it is the default optimizer for most deep nets.`
    }
  ],

  /* ========================== dl-minibatch ========================== */
  "dl-minibatch": [
    {
      title: `Counting updates on CIFAR`,
      domain: `Computer vision`,
      question: `For 50,000 training images and batch size 128, how many weight updates happen over 10 epochs?`,
      steps: [
        { title: `The data`, body: `<p>$N = 50{,}000$ images, batch size 128. One epoch is one full pass through all images.</p>` },
        { title: `The math`, body: `<p>Iterations per epoch $= \\frac{N}{\\text{batch size}}$. Total updates $= \\text{iters} \\times \\text{epochs}$.</p>` },
        { title: `Run it`, body: `<p>Plain integer arithmetic.</p>`,
          code: `import numpy as np
N = 50000        # training images (e.g. CIFAR)
batch = 128
iters = N // batch
epochs = 10
print("iterations per epoch =", iters)
print("total weight updates =", iters*epochs)`,
          output: `iterations per epoch = 390
total weight updates = 3900` }
      ],
      conclusion: `Each epoch is $50000/128 = 390$ updates, so 10 epochs is $3900$ mini-batch steps — far more learning signal than one update per epoch.`
    },
    {
      title: `Mini-batch SGD fitting a line`,
      domain: `Speech recognition`,
      question: `Can mini-batch SGD recover the true slope and intercept of audio-duration data?`,
      steps: [
        { title: `The data`, body: `<p>40 points follow $y = 2x - 1$ with noise (e.g. mapping an audio-length feature to clip duration). Fit $w, b$ with mini-batches of 8.</p>` },
        { title: `The math`, body: `<p>For each batch, gradient of the MSE is $\\frac{2}{m}\\sum (wx+b - y)\\,x$ for $w$ and $\\frac{2}{m}\\sum (wx+b-y)$ for $b$; step against it.</p>` },
        { title: `Run it`, body: `<p>Shuffle, batch, update, for 5 epochs.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
# linear fit y = 2x - 1 via mini-batch SGD on audio-length->duration data
X = np.linspace(-2,2,40); Y = 2*X - 1 + rng.normal(0,0.3,40)
w,b,lr,batch = 0.0,0.0,0.1,8
idx = np.arange(40)
for ep in range(5):
    rng.shuffle(idx)
    for s in range(0,40,batch):
        bi = idx[s:s+batch]
        e = (w*X[bi]+b) - Y[bi]
        w -= lr*2*np.mean(e*X[bi]); b -= lr*2*np.mean(e)
    mse = np.mean(((w*X+b)-Y)**2)
    print("epoch %d  w=%.3f b=%.3f mse=%.4f" % (ep+1,w,b,mse))`,
          output: `epoch 1  w=1.646 b=-0.706 mse=0.3518
epoch 2  w=1.973 b=-0.908 mse=0.0707
epoch 3  w=2.021 b=-0.985 mse=0.0561
epoch 4  w=2.027 b=-1.008 mse=0.0551
epoch 5  w=2.045 b=-1.033 mse=0.0559` }
      ],
      conclusion: `Within 5 epochs $w \\to 2.05$ and $b \\to -1.03$, recovering the true $y = 2x - 1$. Many small batched updates per epoch converge fast and stably.`
    },
    {
      title: `Batch size changes updates per epoch`,
      domain: `NLP (text classification)`,
      question: `How does batch size trade off iterations per epoch against final loss?`,
      steps: [
        { title: `The data`, body: `<p>512 text samples, 10 features. Train an MLP for 40 epochs at three batch sizes.</p>` },
        { title: `The math`, body: `<p>Iterations per epoch $= \\lceil N / \\text{batch size}\\rceil$. Smaller batches mean more, noisier updates per epoch.</p>` },
        { title: `Run it`, body: `<p>Sweep batch sizes 16, 128, 512.</p>`,
          code: `import warnings; warnings.filterwarnings("ignore")
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
X,y = make_classification(n_samples=512, n_features=10, random_state=0)
for bs in [16, 128, 512]:
    clf = MLPClassifier(hidden_layer_sizes=(8,), batch_size=bs,
                        max_iter=40, random_state=0)
    clf.fit(X,y)
    iters = -(-512//bs)   # ceil
    print("batch=%3d  iters/epoch=%2d  final loss=%.4f" % (bs, iters, clf.loss_))`,
          output: `batch= 16  iters/epoch=32  final loss=0.1795
batch=128  iters/epoch= 4  final loss=0.4279
batch=512  iters/epoch= 1  final loss=0.6294` }
      ],
      conclusion: `Batch 16 makes 32 updates per epoch and reaches loss $0.18$, while full-batch (512) makes just 1 update and lands at $0.63$. More frequent mini-batch updates learn faster per epoch.`
    }
  ],

  /* ============================= dl-init ============================ */
  "dl-init": [
    {
      title: `He init keeps signal alive in deep nets`,
      domain: `Computer vision`,
      question: `Why does He initialization keep activation variance stable across 8 ReLU layers while a poorly-scaled init explodes it?`,
      steps: [
        { title: `The data`, body: `<p>Send a unit-variance 256-d signal through 8 fully-connected ReLU layers, each with a $256\\times256$ random weight matrix.</p>` },
        { title: `The math`, body: `<p>He init sets the weight std to $\\sqrt{2/n_{\\text{in}}}$ so ReLU layers preserve variance. A fixed too-large std lets variance grow layer after layer.</p>` },
        { title: `Run it`, body: `<p>Compare final activation variance for He vs a fixed std of 0.1.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
# push unit-variance signal through 8 ReLU layers; He vs too-big init
def run(std):
    a = rng.standard_normal(256)
    for _ in range(8):
        W = rng.standard_normal((256,256))*std
        a = np.maximum(0, W@a)
    return a.var()
n_in = 256
he = np.sqrt(2/n_in)
print("He std        = %.4f -> final var = %.4f" % (he, run(he)))
print("too-big std=0.1      -> final var = %.4e" % run(0.1))`,
          output: `He std        = 0.0884 -> final var = 0.7252
too-big std=0.1      -> final var = 8.9968e+00` }
      ],
      conclusion: `He init ($\\text{std} = 0.0884$) holds variance near $0.7$ after 8 layers, while $\\text{std}=0.1$ lets it blow up to $\\approx 9$. Correct scaling is what lets very deep vision nets train at all.`
    },
    {
      title: `Why all-zeros never learns`,
      domain: `Speech recognition`,
      question: `What happens to a hidden layer when every weight starts at zero?`,
      steps: [
        { title: `The data`, body: `<p>Three hidden neurons over a 3-feature acoustic input, all weights initialized to 0.</p>` },
        { title: `The math`, body: `<p>If $W = 0$ then every neuron computes the same $z = 0$, so all activations are identical and all gradients are identical — they can never differentiate.</p>` },
        { title: `Run it`, body: `<p>Check the hidden activations.</p>`,
          code: `import numpy as np
# why all-zeros fails: identical neurons get identical gradients
x = np.array([1.0, 2.0, 3.0]); y = 1.0
W = np.zeros((3,3))            # 3 hidden neurons, all-zero weights
a = np.maximum(0, W@x)        # every neuron outputs 0
print("hidden activations =", a.tolist())
print("all identical? ", len(set(a.tolist()))==1)`,
          output: `hidden activations = [0.0, 0.0, 0.0]
all identical?  True` }
      ],
      conclusion: `Every neuron is identical ($[0,0,0]$) and stays that way forever — the "symmetry" problem. Random init breaks the tie so neurons can learn distinct features.`
    },
    {
      title: `Xavier std shrinks with layer width`,
      domain: `Medical imaging`,
      question: `How does Xavier initialization scale the starting weights as a layer gets wider?`,
      steps: [
        { title: `The data`, body: `<p>Layers of three sizes in a tumor-segmentation net: $4\\times4$, $64\\times64$, $256\\times256$.</p>` },
        { title: `The math`, body: `<p>Xavier std $= \\sqrt{\\frac{2}{n_{\\text{in}} + n_{\\text{out}}}}$. More fan-in/out means a smaller std, so the summed pre-activation keeps a sensible scale.</p>` },
        { title: `Run it`, body: `<p>Compute Xavier std for each layer.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
# Xavier std for a layer with n_in inputs and n_out outputs
for n_in, n_out in [(64,64),(256,256),(4,4)]:
    xav = np.sqrt(2/(n_in+n_out))
    print("n_in=%3d n_out=%3d  Xavier std = %.4f" % (n_in,n_out,xav))`,
          output: `n_in= 64 n_out= 64  Xavier std = 0.1250
n_in=256 n_out=256  Xavier std = 0.0625
n_in=  4 n_out=  4  Xavier std = 0.5000` }
      ],
      conclusion: `Width 256 gets a tiny std of $0.0625$, width 4 a larger $0.5$ — the std shrinks as $1/\\sqrt{n}$ so wide layers don't blow up their sums. Xavier/He are the framework defaults.`
    }
  ],

  /* =========================== dl-dropout =========================== */
  "dl-dropout": [
    {
      title: `Inverted dropout on a layer`,
      domain: `Computer vision`,
      question: `How does inverted dropout switch off neurons yet keep the layer's average output unchanged?`,
      steps: [
        { title: `The data`, body: `<p>A layer of 10 activations. With keep probability $p = 0.5$, each neuron is randomly dropped.</p>` },
        { title: `The math`, body: `<p>Build a mask that is $1/p$ for kept neurons and 0 for dropped ones. Multiplying by $1/p$ rescales so the expected sum is preserved.</p>` },
        { title: `Run it`, body: `<p>Drop neurons and compare the means.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
# inverted dropout on a layer of 10 activations, keep prob = 0.5
a = rng.random(10)
p = 0.5
mask = (rng.random(10) < p) / p     # scale by 1/p
a_drop = a*mask
print("kept neurons =", int((mask>0).sum()), "of 10")
print("mean before  =", round(a.mean(),4))
print("mean after   =", round(a_drop.mean(),4))`,
          output: `kept neurons = 5 of 10
mean before  = 0.5505
mean after   = 0.5356` }
      ],
      conclusion: `Half the neurons are zeroed, yet the mean barely moves ($0.5505 \\to 0.5356$) because survivors are scaled by $1/p$. The net can't lean on any single neuron, which curbs overfitting.`
    },
    {
      title: `Regularization closes the overfit gap`,
      domain: `NLP (text classification)`,
      question: `Does a weight penalty (dropout's cousin) shrink the train/test accuracy gap?`,
      steps: [
        { title: `The data`, body: `<p>300 samples, 100 features but only 5 informative — easy to overfit. Split 60/40 train/test.</p>` },
        { title: `The math`, body: `<p>Dropout and L2 both fight overfitting by discouraging reliance on any one weight. sklearn's $\\alpha$ is the L2 strength; larger $\\alpha$ regularizes harder.</p>` },
        { title: `Run it`, body: `<p>Compare a tiny penalty to a strong one.</p>`,
          code: `import warnings; warnings.filterwarnings("ignore")
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
# L2 weight penalty (alpha) plays dropout's role: shrink the train/test gap
X,y = make_classification(n_samples=300, n_features=100, n_informative=5,
                          random_state=0)
Xtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.4,random_state=0)
for alpha in [1e-5, 3.0]:
    clf=MLPClassifier(hidden_layer_sizes=(128,), alpha=alpha,
                      max_iter=400, random_state=0).fit(Xtr,ytr)
    tr,te=clf.score(Xtr,ytr),clf.score(Xte,yte)
    print("alpha=%-6.0e train=%.3f test=%.3f gap=%.3f" % (alpha,tr,te,tr-te))`,
          output: `alpha=1e-05  train=1.000 test=0.725 gap=0.275
alpha=3e+00  train=1.000 test=0.817 gap=0.183` }
      ],
      conclusion: `Strong regularization lifts test accuracy from $0.725$ to $0.817$ and shrinks the train/test gap from $0.275$ to $0.183$ — the same overfitting cure dropout provides.`
    },
    {
      title: `Dropout as a model ensemble`,
      domain: `Speech recognition`,
      question: `Why does averaging many dropout masks recover the full network at test time?`,
      steps: [
        { title: `The data`, body: `<p>One activation vector $a = [1, 2, 3, 4]$. Apply 10,000 random inverted-dropout masks (keep $p = 0.5$) and average the results.</p>` },
        { title: `The math`, body: `<p>Each masked pass is a thinned sub-network. With $1/p$ scaling, $\\mathbb{E}[\\text{mask}\\odot a] = a$, so the average over masks equals the full activation.</p>` },
        { title: `Run it`, body: `<p>Average 10,000 masked copies.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
# averaging many dropout masks ~ a model ensemble (test-time = full net)
a = np.array([1.0, 2.0, 3.0, 4.0])
p = 0.5
samples = np.array([a*((rng.random(4)<p)/p) for _ in range(10000)])
print("expected (full a) =", a.tolist())
print("dropout mean      =", np.round(samples.mean(axis=0),3).tolist())`,
          output: `expected (full a) = [1.0, 2.0, 3.0, 4.0]
dropout mean      = [0.995, 1.959, 3.032, 3.995]` }
      ],
      conclusion: `Averaging thousands of thinned networks recovers $a \\approx [1, 2, 3, 4]$. That is why training drops neurons but testing uses the full net — it behaves like an ensemble average.`
    }
  ],

  /* ========================== dl-batchnorm ========================== */
  "dl-batchnorm": [
    {
      title: `Normalizing a feature across a batch`,
      domain: `Computer vision`,
      question: `What does batch norm do to one feature's values across a mini-batch of images?`,
      steps: [
        { title: `The data`, body: `<p>One feature, measured on 5 images in a batch: $[1, 3, 5, 7, 9]$.</p>` },
        { title: `The math`, body: `<p>$\\mu_B = \\frac{1}{m}\\sum x_i$, $\\sigma_B^2 = \\frac{1}{m}\\sum (x_i-\\mu_B)^2$, then $\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$.</p>` },
        { title: `Run it`, body: `<p>Center and scale the batch.</p>`,
          code: `import numpy as np
# batch-norm a mini-batch of one feature across 5 images
x = np.array([1.0, 3.0, 5.0, 7.0, 9.0])
mu = x.mean(); var = x.var()
xhat = (x - mu)/np.sqrt(var + 1e-8)
print("mean   =", mu, " var =", var)
print("normed =", np.round(xhat,4).tolist())
print("new mean=%.4f new std=%.4f" % (xhat.mean(), xhat.std()))`,
          output: `mean   = 5.0  var = 8.0
normed = [-1.4142, -0.7071, 0.0, 0.7071, 1.4142]
new mean=0.0000 new std=1.0000` }
      ],
      conclusion: `Batch norm recenters the feature to mean $0$, std $1$. Tidy, centered inputs to each layer make deep image nets train faster and tolerate higher learning rates.`
    },
    {
      title: `Gamma and beta rescale after normalizing`,
      domain: `Speech recognition`,
      question: `After whitening a feature, how do the learnable parameters restore a useful scale?`,
      steps: [
        { title: `The data`, body: `<p>A speech feature batch $[2, 4, 6, 8]$. Batch norm first whitens it, then applies learnable $\\gamma$ (scale) and $\\beta$ (shift).</p>` },
        { title: `The math`, body: `<p>$y_i = \\gamma\\hat{x}_i + \\beta$. With $\\gamma = 2, \\beta = 0.5$ the output has std $\\gamma$ and mean $\\beta$, letting the net pick the scale it wants.</p>` },
        { title: `Run it`, body: `<p>Whiten then apply $\\gamma, \\beta$.</p>`,
          code: `import numpy as np
# learnable gamma/beta let BN rescale after normalizing
x = np.array([2.0, 4.0, 6.0, 8.0])
xhat = (x-x.mean())/np.sqrt(x.var()+1e-8)
gamma, beta = 2.0, 0.5
y = gamma*xhat + beta
print("xhat =", np.round(xhat,3).tolist())
print("y    =", np.round(y,3).tolist())
print("out mean=%.3f out std=%.3f" % (y.mean(), y.std()))`,
          output: `xhat = [-1.342, -0.447, 0.447, 1.342]
y    = [-2.183, -0.394, 1.394, 3.183]
out mean=0.500 out std=2.000` }
      ],
      conclusion: `After whitening, $\\gamma, \\beta$ reset the output to mean $0.5$, std $2$. The network learns these two knobs, so batch norm never forces a fixed scale.`
    },
    {
      title: `Per-feature normalization over a batch`,
      domain: `Medical imaging`,
      question: `Can batch norm align three features that live on wildly different scales?`,
      steps: [
        { title: `The data`, body: `<p>A batch of 6 scans, each with 3 features centered near $10$, $-4$, and $100$ with very different spreads.</p>` },
        { title: `The math`, body: `<p>Batch norm computes $\\mu$ and $\\sigma^2$ per column (feature), then normalizes each column independently to mean 0, std 1.</p>` },
        { title: `Run it`, body: `<p>Normalize along the batch axis.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
# BN per-feature over a batch: shape (batch=6, features=3)
X = rng.normal(loc=[10,-4,100], scale=[2,0.5,30], size=(6,3))
mu = X.mean(axis=0); var = X.var(axis=0)
Xn = (X-mu)/np.sqrt(var+1e-8)
print("feature means before =", np.round(mu,2).tolist())
print("feature means after  =", np.round(Xn.mean(axis=0),4).tolist())
print("feature stds   after =", np.round(Xn.std(axis=0),4).tolist())`,
          output: `feature means before = [9.07, -4.09, 93.89]
feature means after  = [0.0, -0.0, -0.0]
feature stds   after = [1.0, 1.0, 1.0]` }
      ],
      conclusion: `Features that started near $9$, $-4$, $94$ all become mean $0$, std $1$. Per-feature normalization removes scale mismatches so no single feature dominates the gradients.`
    }
  ],

  /* ======================== dl-early-stopping ======================= */
  "dl-early-stopping": [
    {
      title: `Stop when validation stops improving`,
      domain: `Computer vision`,
      question: `Given a validation-loss curve, at which epoch should training stop with patience 3?`,
      steps: [
        { title: `The data`, body: `<p>Validation loss per epoch dips, bottoms out, then drifts up: $[0.90, 0.70, 0.55, 0.48, 0.45, 0.46, 0.47, 0.49]$.</p>` },
        { title: `The math`, body: `<p>Track the best loss so far. If it fails to improve for $\\text{patience}$ epochs in a row, stop and keep the best checkpoint.</p>` },
        { title: `Run it`, body: `<p>Apply a patience-3 early-stopping rule.</p>`,
          code: `import numpy as np
# validation loss per epoch; stop when it stops improving (patience=3)
val = [0.90,0.70,0.55,0.48,0.45,0.46,0.47,0.49]
best, best_ep, patience, wait = float("inf"), -1, 3, 0
stop_ep = len(val)-1
for ep,v in enumerate(val):
    if v < best: best, best_ep, wait = v, ep, 0
    else:
        wait += 1
        if wait >= patience: stop_ep = ep; break
print("best val loss = %.2f at epoch %d" % (best, best_ep))
print("stopped at epoch", stop_ep)`,
          output: `best val loss = 0.45 at epoch 4
stopped at epoch 7` }
      ],
      conclusion: `The best validation loss $0.45$ is at epoch 4; after 3 stagnant epochs training halts at epoch 7 and restores the epoch-4 weights. That is early stopping — a free overfitting guard.`
    },
    {
      title: `sklearn early stopping in action`,
      domain: `NLP (text classification)`,
      question: `How many epochs does an MLP actually run when early stopping is enabled?`,
      steps: [
        { title: `The data`, body: `<p>500 text samples, 20 features. Allow up to 500 epochs but hold out 20% for validation and stop after 5 non-improving epochs.</p>` },
        { title: `The math`, body: `<p>The trainer watches the validation score each epoch; when it fails to improve for $\\texttt{n\\_iter\\_no\\_change}$ epochs, it stops early — long before the 500-epoch cap.</p>` },
        { title: `Run it`, body: `<p>Enable $\\texttt{early\\_stopping}$ and read the epoch count.</p>`,
          code: `import warnings; warnings.filterwarnings("ignore")
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
X,y = make_classification(n_samples=500, n_features=20, random_state=0)
clf = MLPClassifier(hidden_layer_sizes=(50,), early_stopping=True,
                    n_iter_no_change=5, validation_fraction=0.2,
                    max_iter=500, random_state=0).fit(X,y)
print("stopped after %d epochs (max was 500)" % clf.n_iter_)
print("best validation score = %.4f" % clf.best_validation_score_)`,
          output: `stopped after 24 epochs (max was 500)
best validation score = 0.7900` }
      ],
      conclusion: `Training halts after just 24 of a possible 500 epochs once validation stalls at $0.79$. Early stopping saves compute and prevents memorizing the training set.`
    },
    {
      title: `Spotting the overfit turn`,
      domain: `Medical imaging`,
      question: `When training loss keeps dropping but validation turns up, where is the right stopping point?`,
      steps: [
        { title: `The data`, body: `<p>Per-epoch training loss keeps falling while validation loss bottoms then rises — the classic overfitting signature on a small medical dataset.</p>` },
        { title: `The math`, body: `<p>The best generalization point is $\\arg\\min$ of the validation loss, not the training loss. Pick the epoch where validation is lowest.</p>` },
        { title: `Run it`, body: `<p>Find the minimum-validation epoch.</p>`,
          code: `import numpy as np
# train keeps falling, val turns up -> overfitting; early stop at the dip
train = [0.80,0.55,0.40,0.30,0.22,0.16,0.11]
val   = [0.82,0.60,0.50,0.47,0.48,0.52,0.58]
best_ep = int(np.argmin(val))
print("epoch  train   val")
for ep,(t,v) in enumerate(zip(train,val)):
    mark = "  <- stop here" if ep==best_ep else ""
    print("%4d  %.2f   %.2f%s" % (ep,t,v,mark))`,
          output: `epoch  train   val
   0  0.80   0.82
   1  0.55   0.60
   2  0.40   0.50
   3  0.30   0.47  <- stop here
   4  0.22   0.48
   5  0.16   0.52
   6  0.11   0.58` }
      ],
      conclusion: `Training loss keeps falling to $0.11$, but validation bottoms at epoch 3 ($0.47$) and rises after. Stop at epoch 3 — past it, the model is just memorizing.`
    }
  ],

  /* ============================= dl-conv ============================ */
  "dl-conv": [
    {
      title: `A vertical-edge filter sliding over an image`,
      domain: `Computer vision`,
      question: `What does an edge-detecting filter output as it convolves over an image with a left-dark/right-bright boundary?`,
      steps: [
        { title: `The data`, body: `<p>A $5\\times5$ image: columns 0-2 dark (0), columns 3-4 bright (9). A $3\\times3$ vertical-edge filter $[[1,0,-1],[1,0,-1],[1,0,-1]]$ slides over it.</p>` },
        { title: `The math`, body: `<p>At each position the output is the dot product of the filter and the overlapping patch: $\\sum_{i,j} K_{ij}\\,P_{ij}$. Strong response means an edge was found.</p>` },
        { title: `Run it`, body: `<p>Use scipy's 2-D cross-correlation.</p>`,
          code: `import numpy as np
from scipy.signal import correlate2d
# vertical-edge filter slid over a 5x5 image (left dark, right bright)
img = np.array([[0,0,0,9,9]]*5, dtype=float)
kernel = np.array([[1,0,-1],[1,0,-1],[1,0,-1]], dtype=float)
out = correlate2d(img, kernel, mode="valid")
print("output feature map (edge responses):")
print(out)`,
          output: `output feature map (edge responses):
[[  0. -27. -27.]
 [  0. -27. -27.]
 [  0. -27. -27.]]` }
      ],
      conclusion: `The filter fires strongly ($-27$) exactly where dark meets bright and stays silent ($0$) in flat regions. One small filter detects the same pattern everywhere — the core trick of convolution.`
    },
    {
      title: `One convolution position by hand`,
      domain: `Medical imaging`,
      question: `What single number does a filter produce at one location of a scan?`,
      steps: [
        { title: `The data`, body: `<p>A $2\\times2$ image patch $[[2,3],[5,1]]$ and a top-row detector filter $[[1,1],[0,0]]$.</p>` },
        { title: `The math`, body: `<p>Elementwise-multiply filter and patch, then sum: $1\\!\\cdot\\!2 + 1\\!\\cdot\\!3 + 0\\!\\cdot\\!5 + 0\\!\\cdot\\!1$.</p>` },
        { title: `Run it`, body: `<p>Compute the single-position convolution.</p>`,
          code: `import numpy as np
# manual single-position convolution (dot product of filter and patch)
patch  = np.array([[2,3],[5,1]])
filt   = np.array([[1,1],[0,0]])   # top-row detector
val = int((patch*filt).sum())
print("patch*filter =", (patch*filt).tolist())
print("conv output  =", val)`,
          output: `patch*filter = [[2, 3], [0, 0]]
conv output  = 5` }
      ],
      conclusion: `The filter sums only the top row, giving $5$. A tumor-spotting filter works the same way, scoring how strongly a learned pattern appears at each spot on the scan.`
    },
    {
      title: `1-D convolution over a waveform`,
      domain: `Speech recognition`,
      question: `What does a slope-detecting filter pick out from an audio waveform?`,
      steps: [
        { title: `The data`, body: `<p>A short 1-D signal $[0,1,2,3,2,1,0]$ (a rise then fall) and a finite-difference filter $[1,0,-1]$ that responds to slope.</p>` },
        { title: `The math`, body: `<p>1-D convolution slides the filter and dot-products: positive output where the signal is rising, negative where it is falling, zero at the peak.</p>` },
        { title: `Run it`, body: `<p>Cross-correlate the filter with the signal.</p>`,
          code: `import numpy as np
# 1-D convolution: a 3-tap filter over an audio waveform snippet
sig = np.array([0,1,2,3,2,1,0], dtype=float)
filt = np.array([1,0,-1], dtype=float)   # finite-difference (slope) detector
out = np.convolve(sig, filt[::-1], mode="valid")  # correlate
print("signal =", sig.tolist())
print("conv   =", out.tolist())`,
          output: `signal = [0.0, 1.0, 2.0, 3.0, 2.0, 1.0, 0.0]
conv   = [-2.0, -2.0, 0.0, 2.0, 2.0]` }
      ],
      conclusion: `The filter outputs $-2$ on the rising part, $0$ at the peak, $+2$ on the fall — it has detected slope. Audio nets stack 1-D convolutions to learn such temporal patterns.`
    }
  ],

  /* =========================== dl-pooling =========================== */
  "dl-pooling": [
    {
      title: `2x2 max-pool over a feature map`,
      domain: `Computer vision`,
      question: `How does max pooling shrink a $4\\times4$ feature map to $2\\times2$?`,
      steps: [
        { title: `The data`, body: `<p>A $4\\times4$ feature map. Pool with a $2\\times2$ window and stride 2, so the four non-overlapping windows each become one number.</p>` },
        { title: `The math`, body: `<p>Each output is the max of its window: $\\max$ over the $2\\times2$ block. The map halves in each dimension.</p>` },
        { title: `Run it`, body: `<p>Max over each $2\\times2$ block.</p>`,
          code: `import numpy as np
# 2x2 max-pool, stride 2, over a 4x4 feature map
fm = np.array([[1,3,2,4],
               [5,6,1,2],
               [7,8,0,1],
               [3,2,9,4]], dtype=float)
out = np.zeros((2,2))
for i in range(2):
    for j in range(2):
        out[i,j] = fm[2*i:2*i+2, 2*j:2*j+2].max()
print("max-pooled:")
print(out.astype(int))`,
          output: `max-pooled:
[[6 4]
 [8 9]]` }
      ],
      conclusion: `The $4\\times4$ map becomes $2\\times2$ — $[[6,4],[8,9]]$ — keeping only the strongest response in each region. Pooling shrinks the map and makes detection robust to small shifts.`
    },
    {
      title: `Max vs average pooling`,
      domain: `Medical imaging`,
      question: `On the same window, what is the difference between max and average pooling?`,
      steps: [
        { title: `The data`, body: `<p>A single $2\\times2$ window $[[4,1],[6,5]]$ from a scan's feature map.</p>` },
        { title: `The math`, body: `<p>Max pool keeps the peak: $\\max(4,1,6,5)$. Average pool keeps the mean: $\\frac{4+1+6+5}{4}$.</p>` },
        { title: `Run it`, body: `<p>Compute both summaries.</p>`,
          code: `import numpy as np
# max vs average pool of one 2x2 window
win = np.array([[4,1],[6,5]], dtype=float)
print("window     =", win.tolist())
print("max-pool   =", win.max())
print("avg-pool   =", win.mean())`,
          output: `window     = [[4.0, 1.0], [6.0, 5.0]]
max-pool   = 6.0
avg-pool   = 4.0` }
      ],
      conclusion: `Max pool reports the strongest activation ($6$) — good for "is the pattern present anywhere?" — while average pool ($4$) smooths the region. Max is the common default in vision nets.`
    },
    {
      title: `Pooling for shift-tolerant perception`,
      domain: `Self-driving`,
      question: `How does $2\\times2$ pooling downsample a $6\\times6$ feature map?`,
      steps: [
        { title: `The data`, body: `<p>A $6\\times6$ feature map from a road-scene detector. Pool by $2\\times2$ to a $3\\times3$ map.</p>` },
        { title: `The math`, body: `<p>Reshape into $2\\times2$ blocks and reduce each with max (or mean). Downsampling makes a slightly shifted object still trigger the same response.</p>` },
        { title: `Run it`, body: `<p>Pool with both max and mean.</p>`,
          code: `import numpy as np
# downsample a 6x6 feature map by 2x2 pooling; makes detection shift-tolerant
fm = np.arange(1,37).reshape(6,6).astype(float)
def pool(a, k, fn):
    h,w = a.shape
    return fn(a.reshape(h//k, k, w//k, k), axis=(1,3))
mx = pool(fm, 2, np.max)
av = pool(fm, 2, np.mean)
print("input 6x6 -> pooled 3x3")
print("max-pool:\\n", mx.astype(int))
print("avg-pool:\\n", av)`,
          output: `input 6x6 -> pooled 3x3
max-pool:
 [[ 8 10 12]
 [20 22 24]
 [32 34 36]]
avg-pool:
 [[ 4.5  6.5  8.5]
 [16.5 18.5 20.5]
 [28.5 30.5 32.5]]` }
      ],
      conclusion: `The $6\\times6$ map shrinks to $3\\times3$, cutting compute fourfold while preserving the strongest cues. This shift-tolerance helps a self-driving net recognize a slightly off-center pedestrian.`
    }
  ],

  /* ====================== dl-conv-hyperparams ======================= */
  "dl-conv-hyperparams": [
    {
      title: `Same vs strided convolution sizes`,
      domain: `Computer vision`,
      question: `How do padding and stride change the output size of a convolution on a $224\\times224$ image?`,
      steps: [
        { title: `The data`, body: `<p>A $224\\times224$ input. Compare a "same" $3\\times3$ conv ($P=1, S=1$) with a strided $3\\times3$ conv ($P=0, S=2$).</p>` },
        { title: `The math`, body: `<p>$O = \\frac{I - F + 2P}{S} + 1$. Padding can preserve size; a stride of 2 roughly halves it.</p>` },
        { title: `Run it`, body: `<p>Apply the output-size formula.</p>`,
          code: `# output size formula O = (I - F + 2P)/S + 1
def out_size(I,F,P,S): return (I - F + 2*P)//S + 1
print("224x224, F=3, P=1, S=1 -> ", out_size(224,3,1,1))  # 'same'
print("224x224, F=3, P=0, S=2 -> ", out_size(224,3,0,2))  # strided
print("7x7,     F=3, P=0, S=1 -> ", out_size(7,3,0,1))`,
          output: `224x224, F=3, P=1, S=1 ->  224
224x224, F=3, P=0, S=2 ->  111
7x7,     F=3, P=0, S=1 ->  5` }
      ],
      conclusion: `"Same" padding keeps $224 \\to 224$; stride 2 shrinks it to $111$. Engineers use $O = \\frac{I-F+2P}{S}+1$ to plan exactly how each layer resizes the image.`
    },
    {
      title: `How many layers to shrink a scan`,
      domain: `Medical imaging`,
      question: `How many stride-2 conv layers reduce a $256\\times256$ scan to $16\\times16$ or smaller?`,
      steps: [
        { title: `The data`, body: `<p>A $256\\times256$ scan. Each layer is a $3\\times3$ conv with $P=0, S=2$, roughly halving the size.</p>` },
        { title: `The math`, body: `<p>Repeatedly apply $O = \\frac{I - F + 2P}{S} + 1$ until $I \\le 16$, counting the layers.</p>` },
        { title: `Run it`, body: `<p>Loop the formula until small enough.</p>`,
          code: `# how many conv layers to shrink a 256x256 scan to <=16, F=3 P=0 S=2
def out_size(I,F,P,S): return (I - F + 2*P)//S + 1
I, n = 256, 0
while I > 16:
    I = out_size(I,3,0,2); n += 1
    print("after layer %d: %dx%d" % (n, I, I))
print("layers needed =", n)`,
          output: `after layer 1: 127x127
after layer 2: 63x63
after layer 3: 31x31
after layer 4: 15x15
layers needed = 4` }
      ],
      conclusion: `Four stride-2 conv layers take $256 \\to 127 \\to 63 \\to 31 \\to 15$. The output-size formula lets designers count exactly how deep the downsampling stack must be.`
    },
    {
      title: `Choosing padding for 'same' output`,
      domain: `Speech recognition`,
      question: `For each odd filter size, what padding keeps a stride-1 convolution's length unchanged?`,
      steps: [
        { title: `The data`, body: `<p>A length-64 feature sequence (e.g. an audio embedding). We want stride-1 conv layers that preserve the length for several filter sizes.</p>` },
        { title: `The math`, body: `<p>Set $O = I$ with $S = 1$ in $O = \\frac{I - F + 2P}{S} + 1$, which gives $P = \\frac{F-1}{2}$ for odd $F$.</p>` },
        { title: `Run it`, body: `<p>Compute the "same" padding for each filter size.</p>`,
          code: `# 'same' padding keeps size: pick P so O == I for stride 1
def out_size(I,F,P,S): return (I - F + 2*P)//S + 1
for F in [1,3,5,7]:
    P = (F-1)//2
    print("F=%d  same-padding P=%d  ->  O=%d (I=64)" % (F,P,out_size(64,F,P,1)))`,
          output: `F=1  same-padding P=0  ->  O=64 (I=64)
F=3  same-padding P=1  ->  O=64 (I=64)
F=5  same-padding P=2  ->  O=64 (I=64)
F=7  same-padding P=3  ->  O=64 (I=64)` }
      ],
      conclusion: `Padding $P = \\frac{F-1}{2}$ (0, 1, 2, 3 for $F = 1, 3, 5, 7$) keeps every output at length 64. This is how "same" convolutions stack without shrinking the sequence.`
    }
  ]

});
