/* Per-lesson code implementations (industry libraries). Merged into window.CODE by id.
   { lib, runnable, packages?, explain(HTML), code } — runnable ones execute via Pyodide
   (only numpy / scikit-learn / scipy / pandas available; PyTorch is copy-to-run). */
window.CODE = Object.assign(window.CODE || {}, {
  "dl-neuron": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A neuron is a dot product plus a bias, then a squish. Here is the whole thing from scratch in NumPy so you can see every number.</p>`,
    code: `import numpy as np

# one neuron: z = w . x + b, then sigmoid
w = np.array([0.5, -1.0, 2.0])   # one weight per input
b = 3.0                          # bias: shifts the result
x = np.array([4.0, 1.0, 2.0])    # the input vector

z = w @ x + b                    # dot product, then add bias
a = 1.0 / (1.0 + np.exp(-z))     # sigmoid squishes z into (0, 1)

print("z =", z)                  # pre-activation
print("a =", round(float(a), 4)) # neuron output`
  },
  "dl-activations": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The four activations side by side. Each takes the same input and reshapes it differently. ReLU is the modern default.</p>`,
    code: `import numpy as np

z = np.array([-3.0, -1.0, 0.0, 2.0, 5.0])   # try a spread of values

sigmoid = 1.0 / (1.0 + np.exp(-z))          # squish into (0, 1)
tanh = np.tanh(z)                           # squish into (-1, 1)
relu = np.maximum(0.0, z)                   # keep positives, zero negatives
leaky = np.where(z > 0, z, 0.01 * z)        # tiny slope for negatives

print("z      ", z)
print("sigmoid", np.round(sigmoid, 3))
print("tanh   ", np.round(tanh, 3))
print("relu   ", relu)
print("leaky  ", leaky)`
  },
  "dl-forward-prop": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Forward propagation in PyTorch: stack layers with <code>nn.Sequential</code>, then just call the model on an input. Each layer's output feeds the next.</p>`,
    code: `import torch
import torch.nn as nn

# 3 inputs -> 4 hidden (ReLU) -> 1 output
net = nn.Sequential(
    nn.Linear(3, 4),   # layer 1: weights W1, bias b1
    nn.ReLU(),         # activation g(.)
    nn.Linear(4, 1),   # layer 2: weights W2, bias b2
)

x = torch.tensor([[2.0, -1.0, 0.5]])   # one example, 3 features
y = net(x)                              # run all layers left to right

print("output shape:", y.shape)         # torch.Size([1, 1])
print("prediction:", y.item())          # the network's answer`
  },
  "dl-cross-entropy": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Cross-entropy in PyTorch. Use <code>BCEWithLogitsLoss</code> for yes/no: it fuses the sigmoid and the log for numerical stability, so you pass raw scores (logits), not probabilities.</p>`,
    code: `import torch
import torch.nn as nn

loss_fn = nn.BCEWithLogitsLoss()        # sigmoid + cross-entropy in one

logits = torch.tensor([2.2, -1.5, 0.3]) # raw scores from the last layer
y = torch.tensor([1.0, 0.0, 1.0])       # true labels: 1 = yes, 0 = no

loss = loss_fn(logits, y)               # average loss over the 3 examples
print("loss:", round(loss.item(), 4))

# confident-and-wrong costs the most:
print("p:", torch.sigmoid(logits).round(decimals=3).tolist())`
  },
  "dl-backprop": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Backprop is automatic in PyTorch. Call <code>loss.backward()</code> and autograd runs the chain rule for you, filling in <code>.grad</code> on every weight. The optimizer then steps downhill.</p>`,
    code: `import torch
import torch.nn as nn

model = nn.Linear(3, 1)                          # one neuron
opt = torch.optim.SGD(model.parameters(), lr=0.1)
loss_fn = nn.MSELoss()

x = torch.tensor([[1.0, 2.0, 3.0]])              # one input
target = torch.tensor([[10.0]])                  # what we want

pred = model(x)                                  # forward pass
loss = loss_fn(pred, target)                     # how wrong we are

opt.zero_grad()                                  # clear old gradients
loss.backward()                                  # chain rule: fills .grad
print("dL/dw:", model.weight.grad)               # gradient per weight
opt.step()                                       # w <- w - lr * grad
print("loss:", round(loss.item(), 4))`
  },
  "dl-optimizers": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Swapping optimizers is a one-line change in PyTorch. Adam is the usual default; it combines Momentum and RMSprop and adapts the step size per weight.</p>`,
    code: `import torch
import torch.nn as nn

model = nn.Linear(10, 1)
loss_fn = nn.MSELoss()

# pick ONE optimizer (all share the same .step() interface):
opt = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)   # Momentum
# opt = torch.optim.RMSprop(model.parameters(), lr=0.01)          # RMSprop
# opt = torch.optim.Adam(model.parameters(), lr=0.001)            # Adam (default)

X = torch.randn(64, 10)               # synthetic batch
y = torch.randn(64, 1)
for step in range(5):                 # short training loop
    opt.zero_grad()
    loss = loss_fn(model(X), y)
    loss.backward()                   # gradients
    opt.step()                        # optimizer updates the weights
    print("step", step, "loss", round(loss.item(), 4))`
  },
  "dl-minibatch": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Mini-batches in PyTorch come from a <code>DataLoader</code>. It splits the dataset into chunks and shuffles each epoch. One pass over all batches is one epoch.</p>`,
    code: `import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

X = torch.randn(1000, 4)              # N = 1000 examples
y = torch.randn(1000, 1)
ds = TensorDataset(X, y)
loader = DataLoader(ds, batch_size=100, shuffle=True)   # 1000/100 = 10 batches

model = nn.Linear(4, 1)
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.MSELoss()

for epoch in range(3):                # 3 epochs
    for xb, yb in loader:             # one mini-batch per iteration
        opt.zero_grad()
        loss = loss_fn(model(xb), yb) # loss on just this batch
        loss.backward()
        opt.step()
    print("epoch", epoch, "last-batch loss", round(loss.item(), 4))`
  },
  "dl-init": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Weight initialization in PyTorch. Layers default to sensible init, but you can apply Xavier (Glorot) or He init explicitly to keep activation variance stable through depth.</p>`,
    code: `import torch
import torch.nn as nn

net = nn.Sequential(
    nn.Linear(100, 100), nn.ReLU(),
    nn.Linear(100, 100), nn.ReLU(),
    nn.Linear(100, 10),
)

def init_weights(m):
    if isinstance(m, nn.Linear):
        nn.init.kaiming_normal_(m.weight, nonlinearity="relu")  # He init for ReLU
        nn.init.zeros_(m.bias)                                  # biases start at 0

net.apply(init_weights)               # walk every layer and init it

x = torch.randn(32, 100)
out = net(x)
print("output std:", round(out.std().item(), 3))   # stays sane, not 0 or huge`
  },
  "dl-dropout": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Dropout randomly zeroes neurons during training. In PyTorch use <code>nn.Dropout</code>; it is active in <code>train()</code> mode and automatically off in <code>eval()</code> mode.</p>`,
    code: `import torch
import torch.nn as nn

net = nn.Sequential(
    nn.Linear(20, 64), nn.ReLU(),
    nn.Dropout(p=0.5),        # drop 50% of neurons each forward pass
    nn.Linear(64, 1),
)

x = torch.randn(4, 20)

net.train()                   # training mode: dropout ON (random zeros)
print("train out:", net(x).squeeze().round(decimals=3).tolist())

net.eval()                    # eval mode: dropout OFF (use full network)
with torch.no_grad():
    print("eval  out:", net(x).squeeze().round(decimals=3).tolist())`
  },
  "dl-batchnorm": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Batch normalization rescales each layer's inputs to be centered and tidy. <code>nn.BatchNorm1d</code> tracks running statistics in training and reuses them in eval mode.</p>`,
    code: `import torch
import torch.nn as nn

net = nn.Sequential(
    nn.Linear(16, 32),
    nn.BatchNorm1d(32),       # normalize the 32 features across the batch
    nn.ReLU(),
    nn.Linear(32, 1),
)

x = torch.randn(64, 16) * 5 + 10   # messy inputs: large mean, big spread

net.train()
out = net[1](net[0](x))            # output of the BatchNorm layer
print("after BN mean:", round(out.mean().item(), 3))   # ~ 0
print("after BN std: ", round(out.std().item(), 3))    # ~ 1`
  },
  "dl-early-stopping": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Early stopping watches the validation loss and halts when it stops improving, keeping the best weights. Here is the classic patience-counter pattern.</p>`,
    code: `import torch
import torch.nn as nn
import copy

model = nn.Linear(10, 1)
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.MSELoss()
Xtr, ytr = torch.randn(200, 10), torch.randn(200, 1)
Xval, yval = torch.randn(50, 10), torch.randn(50, 1)

best_loss, best_state, patience, wait = float("inf"), None, 5, 0
for epoch in range(100):
    opt.zero_grad(); loss_fn(model(Xtr), ytr).backward(); opt.step()
    with torch.no_grad():
        val = loss_fn(model(Xval), yval).item()   # check validation
    if val < best_loss:
        best_loss, best_state, wait = val, copy.deepcopy(model.state_dict()), 0
    else:
        wait += 1
        if wait >= patience:                       # no improvement for 5 epochs
            print("stopped at epoch", epoch, "best val", round(best_loss, 4))
            break
model.load_state_dict(best_state)                  # restore best weights`
  },
  "dl-conv": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A convolutional layer slides small filters over an image. <code>nn.Conv2d</code> is the workhorse; its input is shaped (batch, channels, height, width).</p>`,
    code: `import torch
import torch.nn as nn

# 1 input channel (grayscale) -> 8 feature maps, 3x3 filters
conv = nn.Conv2d(in_channels=1, out_channels=8, kernel_size=3, padding=1)

x = torch.randn(1, 1, 28, 28)        # one 28x28 grayscale image
out = conv(x)                        # slide all 8 filters over it

print("input :", tuple(x.shape))     # (1, 1, 28, 28)
print("output:", tuple(out.shape))   # (1, 8, 28, 28) -- 8 feature maps
print("params:", sum(p.numel() for p in conv.parameters()))  # 8*(1*3*3)+8`
  },
  "dl-pooling": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Pooling shrinks a feature map by summarizing each little region. <code>nn.MaxPool2d</code> keeps the strongest signal; <code>nn.AvgPool2d</code> averages.</p>`,
    code: `import torch
import torch.nn as nn

maxpool = nn.MaxPool2d(kernel_size=2, stride=2)   # 2x2 windows, no overlap
avgpool = nn.AvgPool2d(kernel_size=2, stride=2)

x = torch.arange(16, dtype=torch.float32).reshape(1, 1, 4, 4)
print("input 4x4:\\n", x[0, 0])

print("max-pool ->", tuple(maxpool(x).shape))     # (1, 1, 2, 2)
print(maxpool(x)[0, 0])                            # the max of each 2x2 block
print("avg-pool ->")
print(avgpool(x)[0, 0])                            # the mean of each block`
  },
  "dl-conv-hyperparams": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The output-size formula for a conv layer, in plain Python. Plug in input size, filter size, padding, and stride to see how big the output map turns out.</p>`,
    code: `import numpy as np

def out_size(n, f, p, s):
    # n=input size, f=filter, p=padding, s=stride
    return (n + 2 * p - f) // s + 1

# 28x28 input, 5x5 filter
print("valid (p=0, s=1):", out_size(28, 5, 0, 1))   # 24
print("same  (p=2, s=1):", out_size(28, 5, 2, 1))   # 28 (size preserved)
print("stride 2 (p=0):  ", out_size(28, 5, 0, 2))   # 12 (downsampled)

# verify "same" padding keeps the size for any odd filter
for f in [1, 3, 5, 7]:
    p = (f - 1) // 2
    print("f=%d same padding p=%d -> out=%d" % (f, p, out_size(28, f, p, 1)))`
  },
  "dl-cnn-params": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Counting parameters in a small CNN. Each conv filter has (in_channels x fh x fw) weights plus one bias, and PyTorch lets you tally them directly.</p>`,
    code: `import torch
import torch.nn as nn

cnn = nn.Sequential(
    nn.Conv2d(3, 16, kernel_size=3, padding=1),   # 3*(3*3*3)+16... per filter
    nn.ReLU(),
    nn.Conv2d(16, 32, kernel_size=3, padding=1),
    nn.ReLU(),
)

# params for conv layer 1: out * (in * fh * fw) + out (biases)
manual = 16 * (3 * 3 * 3) + 16
print("layer-1 params (by hand):", manual)        # 448

for name, layer in [("conv1", cnn[0]), ("conv2", cnn[2])]:
    n = sum(p.numel() for p in layer.parameters())
    print(name, "params:", n)
print("total:", sum(p.numel() for p in cnn.parameters()))`
  },
  "dl-object-detection": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Intersection-over-Union (IoU) scores how well a predicted box overlaps the true box. It is the core metric behind detectors like YOLO. Here it is from scratch.</p>`,
    code: `import numpy as np

def iou(a, b):
    # boxes as (x1, y1, x2, y2)
    ix1, iy1 = max(a[0], b[0]), max(a[1], b[1])
    ix2, iy2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)   # overlap area
    area_a = (a[2] - a[0]) * (a[3] - a[1])
    area_b = (b[2] - b[0]) * (b[3] - b[1])
    union = area_a + area_b - inter                 # combined area
    return inter / union

truth = (10, 10, 50, 50)        # ground-truth box
print("perfect :", iou(truth, (10, 10, 50, 50)))    # 1.0
print("good    :", round(iou(truth, (15, 15, 55, 55)), 3))
print("no overlap:", iou(truth, (100, 100, 140, 140)))  # 0.0`
  },
  "dl-face-recognition": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Face verification learns an encoding where same-person faces sit close and different people sit far. PyTorch ships the exact triplet loss used to train it.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

triplet = nn.TripletMarginLoss(margin=0.2)   # pull anchor-positive close, push negative away

# pretend an encoder produced these 128-d face embeddings
anchor = F.normalize(torch.randn(1, 128), dim=1)    # a photo of person A
positive = anchor + 0.05 * torch.randn(1, 128)      # another photo of person A
negative = F.normalize(torch.randn(1, 128), dim=1)  # a photo of person B

loss = triplet(anchor, positive, negative)
d_pos = (anchor - positive).norm().item()    # should be small
d_neg = (anchor - negative).norm().item()    # should be large
print("dist(anchor, positive):", round(d_pos, 3))
print("dist(anchor, negative):", round(d_neg, 3))
print("triplet loss:", round(loss.item(), 4))`
  },
  "dl-style-transfer": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Neural style transfer optimizes the <i>image itself</i> to match a content target and a style target. Style is captured by the Gram matrix of feature maps.</p>`,
    code: `import torch
import torch.nn.functional as F

def gram(feat):
    # feat: (batch, channels, h, w) -> channel correlation matrix
    b, c, h, w = feat.shape
    f = feat.view(c, h * w)
    return (f @ f.t()) / (c * h * w)   # the "style" of a layer

content_feat = torch.randn(1, 16, 8, 8)        # features of the content photo
style_feat = torch.randn(1, 16, 8, 8)          # features of the style painting
img = torch.randn(1, 16, 8, 8, requires_grad=True)   # the image we optimize
opt = torch.optim.Adam([img], lr=0.05)

for step in range(5):
    opt.zero_grad()
    content_loss = F.mse_loss(img, content_feat)             # keep the content
    style_loss = F.mse_loss(gram(img), gram(style_feat))     # match the style
    (content_loss + 1e3 * style_loss).backward()             # blend the two
    opt.step()
print("final style loss:", round(F.mse_loss(gram(img), gram(style_feat)).item(), 5))`
  },
  "dl-gan": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A GAN pits a generator against a discriminator. Each has its own optimizer; they train in alternation toward opposite goals. Here is one training step of each.</p>`,
    code: `import torch
import torch.nn as nn

G = nn.Sequential(nn.Linear(8, 16), nn.ReLU(), nn.Linear(16, 4))   # noise -> fake
D = nn.Sequential(nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 1))   # sample -> real?
bce = nn.BCEWithLogitsLoss()
optG = torch.optim.Adam(G.parameters(), lr=1e-3)
optD = torch.optim.Adam(D.parameters(), lr=1e-3)

real = torch.randn(32, 4)               # a batch of real samples
noise = torch.randn(32, 8)              # random seed for the generator

# 1) train discriminator: real -> 1, fake -> 0
fake = G(noise).detach()
optD.zero_grad()
lossD = bce(D(real), torch.ones(32, 1)) + bce(D(fake), torch.zeros(32, 1))
lossD.backward(); optD.step()

# 2) train generator: fool D into calling fakes real (label 1)
optG.zero_grad()
lossG = bce(D(G(noise)), torch.ones(32, 1))
lossG.backward(); optG.step()
print("lossD", round(lossD.item(), 3), "lossG", round(lossG.item(), 3))`
  },
  "dl-rnn": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A recurrent network reads a sequence one step at a time, carrying a hidden state. <code>nn.RNN</code> does the whole loop for you; input is (batch, time, features).</p>`,
    code: `import torch
import torch.nn as nn

rnn = nn.RNN(input_size=3, hidden_size=5, batch_first=True)

# batch of 2 sequences, each 7 time-steps long, 3 features per step
x = torch.randn(2, 7, 3)
output, h_n = rnn(x)        # output: every step's hidden state; h_n: the last one

print("output:", tuple(output.shape))   # (2, 7, 5) -- a hidden vector per step
print("final h:", tuple(h_n.shape))     # (1, 2, 5) -- the carried memory
# the last step's output equals the final hidden state:
print("match:", torch.allclose(output[:, -1, :], h_n[0]))`
  },
  "dl-vanishing-gradient": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Over long sequences gradients shrink to nothing or blow up. PyTorch's <code>clip_grad_norm_</code> caps the blow-ups. Below, a deep sigmoid stack shows the shrink.</p>`,
    code: `import torch
import torch.nn as nn

# 20 sigmoid layers: gradients shrink as they flow back
layers = []
for _ in range(20):
    layers += [nn.Linear(10, 10), nn.Sigmoid()]
net = nn.Sequential(*layers)

x = torch.randn(4, 10)
loss = net(x).sum()
loss.backward()

first = net[0].weight.grad.abs().mean().item()    # gradient near the input
last = net[-2].weight.grad.abs().mean().item()     # gradient near the output
print("grad at last  layer:", round(last, 8))
print("grad at first layer:", round(first, 8))     # far smaller -> vanished

nn.utils.clip_grad_norm_(net.parameters(), max_norm=1.0)   # cap explosions
print("clipped to a safe norm")`
  },
  "dl-lstm-gru": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>LSTM and GRU add gates that decide what to remember and forget, fixing the vanishing-gradient problem of plain RNNs. Both are one-liners in PyTorch.</p>`,
    code: `import torch
import torch.nn as nn

lstm = nn.LSTM(input_size=3, hidden_size=8, batch_first=True)
gru = nn.GRU(input_size=3, hidden_size=8, batch_first=True)

x = torch.randn(2, 10, 3)        # 2 sequences, 10 steps, 3 features

out_l, (h_l, c_l) = lstm(x)      # LSTM carries hidden state h AND cell state c
out_g, h_g = gru(x)              # GRU has just one hidden state

print("LSTM out:", tuple(out_l.shape), " cell:", tuple(c_l.shape))
print("GRU  out:", tuple(out_g.shape))
# the cell state c is the long-term memory the forget gate protects
print("LSTM params:", sum(p.numel() for p in lstm.parameters()))`
  },
  "dl-word-embeddings": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>An embedding turns each word id into a learnable vector. <code>nn.Embedding</code> is a lookup table whose rows are trained by backprop like any other weights.</p>`,
    code: `import torch
import torch.nn as nn

vocab_size, dim = 1000, 16
embed = nn.Embedding(vocab_size, dim)    # 1000 words, each a 16-d vector

# a sentence as word ids: "the cat sat" -> [4, 17, 92]
sentence = torch.tensor([[4, 17, 92]])
vectors = embed(sentence)                # look up each word's vector

print("input ids :", tuple(sentence.shape))   # (1, 3)
print("embeddings:", tuple(vectors.shape))     # (1, 3, 16)
print("'cat' vector[:4]:", vectors[0, 1, :4].round(decimals=3).tolist())
# these vectors are parameters: backprop nudges similar words together`
  },
  "dl-word2vec": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The famous word2vec analogy <i>king − man + woman ≈ queen</i> is just vector arithmetic. With toy hand-set vectors, the nearest word to that result is "queen".</p>`,
    code: `import numpy as np

# tiny hand-built embeddings (royalty axis, gender axis)
vec = {
    "king":  np.array([0.9, 0.9]),
    "man":   np.array([0.1, 0.9]),
    "woman": np.array([0.1, 0.1]),
    "queen": np.array([0.9, 0.1]),
}

result = vec["king"] - vec["man"] + vec["woman"]   # the analogy
print("king - man + woman =", result)

# find the closest word by cosine similarity
def cos(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

best = max((w for w in vec if w not in ("king", "man", "woman")),
          key=lambda w: cos(result, vec[w]))
print("nearest word:", best)`
  },
  "dl-cosine-similarity": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Cosine similarity measures the angle between two vectors, ignoring their length. It is 1 for same direction, 0 for perpendicular, −1 for opposite.</p>`,
    code: `import numpy as np

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

a = np.array([1.0, 2.0, 3.0])
b = np.array([2.0, 4.0, 6.0])    # same direction as a (just scaled)
c = np.array([-1.0, 0.0, 0.0])

print("a vs b (parallel):", round(cosine(a, b), 4))    # 1.0
print("a vs c (apart)   :", round(cosine(a, c), 4))
# length does not matter, only direction:
print("a vs 100*a       :", round(cosine(a, 100 * a), 4))   # still 1.0`
  },
  "dl-attention": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Attention lets the model focus on the most relevant inputs. Below is scaled dot-product attention by hand, then PyTorch's built-in <code>nn.MultiheadAttention</code>.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# manual scaled dot-product attention
q = torch.randn(1, 4, 8)        # 4 queries, dim 8
k = torch.randn(1, 6, 8)        # 6 keys
v = torch.randn(1, 6, 8)        # 6 values
scores = q @ k.transpose(-2, -1) / (8 ** 0.5)   # similarity, scaled
weights = F.softmax(scores, dim=-1)             # rows sum to 1
out = weights @ v                                # weighted blend of values
print("attention weights sum to 1:", weights.sum(-1).round().tolist())
print("manual out:", tuple(out.shape))           # (1, 4, 8)

# the library version (multi-head)
mha = nn.MultiheadAttention(embed_dim=8, num_heads=2, batch_first=True)
attn_out, attn_w = mha(q, k, v)
print("multihead out:", tuple(attn_out.shape))`
  },
  "dl-data-augmentation": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Data augmentation makes more training images by transforming the ones you have. <code>torchvision.transforms</code> composes flips, rotations, and crops applied on the fly.</p>`,
    code: `import torch
from torchvision import transforms

augment = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),     # mirror left-right
    transforms.RandomRotation(degrees=15),      # tilt a little
    transforms.RandomResizedCrop(32, scale=(0.8, 1.0)),  # zoom/crop
    transforms.ColorJitter(brightness=0.2),     # tweak brightness
])

# a fake 3-channel 40x40 image as a tensor
img = torch.rand(3, 40, 40)

# each call yields a different random variant of the same image
v1 = augment(img)
v2 = augment(img)
print("augmented shape:", tuple(v1.shape))      # (3, 32, 32)
print("two variants differ:", not torch.equal(v1, v2))`
  }
});
