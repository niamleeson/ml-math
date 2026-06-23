/* =====================================================================
   PyTorch (a complete course) — Building a CNN end-to-end.
   One self-contained file: LESSON + CODE + CODEVIZ for id "pt-cnn".
   Cross-links the dl-* concept lessons for the math (conv / pooling /
   param counting); here the focus is HOW to do it in PyTorch.
   ===================================================================== */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODE = window.CODE || {};
  window.CODEVIZ = window.CODEVIZ || {};

  window.LESSONS.push({
    id: "pt-cnn",
    title: "Building a CNN in PyTorch",
    tagline: "Wire conv, pool, and a linear head into a small image classifier, then train it.",
    module: "PyTorch (a complete course)",
    prereqs: ["dl-conv", "dl-pooling", "dl-cnn-params", "dl-forward-prop", "dl-backprop", "dl-optimizers"],

    whenToUse:
      `<p><b>Reach for a CNN (Convolutional Neural Network) whenever the input is an image or any grid-structured data</b> — photos, scans, spectrograms, board-game grids — where nearby values are related. It is the default for vision, used on its own or as a feature extractor before a transformer.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>An MLP (Multi-Layer Perceptron) on flattened pixels</b> — flattening throws away spatial locality and needs far more weights. A CNN shares a small filter across the whole image, so it learns fewer parameters and generalizes better. See the chart below for a real comparison.</li>
         <li><b>Hand-crafted image features</b> — the conv filters are learned from data, not designed by hand.</li>
       </ul>
       <p><b>Pick something else when:</b> the data is unordered tabular features (no spatial neighborhood — use dense layers or trees), or you have huge data and need long-range global structure (a Vision Transformer can win).</p>
       <p><b>The math lives elsewhere:</b> what a filter computes is in <code>dl-conv</code>, downsampling is in <code>dl-pooling</code>, and counting weights is in <code>dl-cnn-params</code>. This lesson is the PyTorch assembly.</p>`,

    application:
      `<p>This exact recipe — a few <code>nn.Conv2d</code> blocks then a <code>nn.Linear</code> head — is the backbone of digit and object recognition, medical-image triage, defect detection on a production line, and the perception stack of self-driving cars. LeNet, the original such network, classified handwritten ZIP-code digits.</p>`,

    pitfalls:
      `<ul>
         <li><b>Wrong input shape.</b> PyTorch convolutions want <code>(N, C, H, W)</code> — batch, channels, height, width — NOT <code>(N, H, W, C)</code>. A grayscale batch of 8×8 images is <code>(N, 1, 8, 8)</code>. Use <code>x.unsqueeze(1)</code> to add the channel axis; a wrong order gives a shape error or silently garbage results.</li>
         <li><b>Miscomputing the flattened size.</b> The first <code>nn.Linear</code> needs the exact number of features after the last conv/pool. Get it wrong and you get <code>mat1 and mat2 shapes cannot be multiplied</code>. Trace the spatial size by hand (each <code>MaxPool2d(2)</code> halves H and W), or print <code>x.shape</code> just before <code>flatten</code>.</li>
         <li><b>Forgetting to normalize images.</b> Feeding raw 0–255 pixels makes activations explode. Scale to roughly zero mean, unit variance (e.g. divide by 255, then <code>transforms.Normalize</code>).</li>
         <li><b>No <code>model.eval()</code> at test time.</b> Batch Normalization and Dropout behave differently in training vs evaluation. Call <code>model.eval()</code> (and wrap inference in <code>torch.no_grad()</code>) or test accuracy will be wrong and noisy.</li>
         <li><b>Channels-first vs channels-last confusion.</b> torchvision images and <code>nn.Conv2d</code> are channels-first (NCHW); many image libraries hand you channels-last (NHWC). Convert with <code>permute</code> once, at the boundary.</li>
         <li><b>Too-small or too-large kernels.</b> Tiny 1×1 kernels can't see local patterns; huge early kernels waste parameters. Modern nets stack small 3×3 kernels.</li>
         <li><b>Forgetting padding shrinks the map.</b> A 3×3 conv with no padding trims the border every layer. Use <code>padding=1</code> with a 3×3 kernel to keep the spatial size, so your flattened-size math stays simple.</li>
         <li><b>Forgetting <code>optimizer.zero_grad()</code>.</b> Gradients accumulate across batches; zero them before each <code>loss.backward()</code> or training diverges.</li>
         <li><b><code>CrossEntropyLoss</code> wants raw logits.</b> Do NOT put a softmax on the last layer — <code>nn.CrossEntropyLoss</code> applies log-softmax internally and expects integer class indices (not one-hot) as targets.</li>
       </ul>`,

    bigIdea:
      `<p>A CNN (Convolutional Neural Network) is a stack of layers that turn an image into a class.</p>
       <p>The first layers are <b>convolutional blocks</b>: <code>Conv2d</code> finds local patterns, <code>BatchNorm2d</code> steadies the signal, <code>ReLU</code> adds a nonlinearity, and <code>MaxPool2d</code> shrinks the map. Each block makes the picture smaller in space but richer in channels.</p>
       <p>Then you <b>flatten</b> the final feature map into one long vector and feed it to a <code>Linear</code> <b>head</b> that outputs one score per class.</p>`,

    buildup:
      `<p>Think of it as a funnel. An MNIST digit enters as <code>(N, 1, 28, 28)</code>: a batch of one-channel 28×28 images.</p>
       <ol>
         <li><b>Conv block 1:</b> <code>Conv2d(1, 16, 3, padding=1)</code> turns 1 channel into 16 feature maps, same 28×28. <code>ReLU</code>, then <code>MaxPool2d(2)</code> halves it to 14×14.</li>
         <li><b>Conv block 2:</b> <code>Conv2d(16, 32, 3, padding=1)</code> → 32 maps at 14×14, then pool to 7×7.</li>
         <li><b>Flatten:</b> 32 channels × 7 × 7 = <b>1568</b> numbers per image.</li>
         <li><b>Head:</b> <code>Linear(1568, 10)</code> → 10 class scores (logits).</li>
       </ol>
       <p>The whole pipeline is: <b>data → CNN → train → evaluate</b>. A <code>DataLoader</code> feeds batches, the training loop runs forward, loss, <code>backward</code>, <code>step</code>; then <code>model.eval()</code> measures test accuracy.</p>`,

    symbols: [
      { sym: "(N, C, H, W)", desc: "PyTorch image tensor shape: N images in the batch, C channels, H rows (height), W columns (width)." },
      { sym: "in_ch / out_ch", desc: "channels going into and coming out of a Conv2d — out_ch is how many filters (feature maps) it learns." },
      { sym: "kernel_size", desc: "the side length of the square filter, e.g. 3 means a 3×3 filter." },
      { sym: "stride / padding", desc: "stride = step size as the filter slides; padding = zeros added around the border so the output keeps its size." },
      { sym: "flattened size", desc: "channels × height × width of the last feature map — the input width of the first Linear layer." }
    ],

    formula: `$$ H_{out} = \\left\\lfloor \\frac{H_{in} + 2p - k}{s} \\right\\rfloor + 1 $$`,
    whatItDoes:
      `<p>This is the output-size rule for one spatial dimension of a conv (or pool), where $H_{in}$ is the input height, $p$ the padding, $k$ the kernel size, $s$ the stride, and $\\lfloor\\cdot\\rfloor$ means round down. Width follows the same rule.</p>
       <p>Two handy special cases: a 3×3 conv with $p=1,\\ s=1$ keeps the size ($H_{out}=H_{in}$); a <code>MaxPool2d(2)</code> with $k=2,\\ s=2,\\ p=0$ halves it. Chaining these is how you get the flattened size for the first <code>Linear</code>.</p>`,

    derivation:
      `<p>Under the hood, every layer you stack registers its parameters and builds an <b>autograd graph</b> on the forward pass. <code>loss.backward()</code> walks that graph backward to fill each parameter's <code>.grad</code> (this is <code>dl-backprop</code>), and <code>optimizer.step()</code> nudges the weights (this is <code>dl-optimizers</code>).</p>
       <p><code>BatchNorm2d</code> keeps running estimates of the mean and variance of each channel. In <code>model.train()</code> it normalizes using the current batch; in <code>model.eval()</code> it switches to those stored running stats — which is exactly why forgetting <code>model.eval()</code> at test time corrupts the numbers.</p>`,

    example:
      `<p>Trace one 8×8 grayscale digit (as in <code>load_digits</code>) through a two-block net with <code>padding=1</code> 3×3 convs:</p>
       <ul class="steps">
         <li>Input <code>(N, 1, 8, 8)</code>. Conv → 8 channels, still 8×8. Pool(2) → <code>(N, 8, 4, 4)</code>.</li>
         <li>Conv → 16 channels, still 4×4. Pool(2) → <code>(N, 16, 2, 2)</code>.</li>
         <li>Flatten: 16 × 2 × 2 = <b>64</b> features. So the head is <code>Linear(64, 10)</code>.</li>
       </ul>
       <p>Get that 64 wrong and PyTorch throws a shape error the moment the first batch hits the head.</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // pipeline of (label, channels, H) stages for a 28x28 MNIST input
      var stages = [
        { name: "input", ch: 1, hw: 28 },
        { name: "conv 3×3 p1", ch: 16, hw: 28 },
        { name: "pool 2", ch: 16, hw: 14 },
        { name: "conv 3×3 p1", ch: 32, hw: 14 },
        { name: "pool 2", ch: 32, hw: 7 },
        { name: "flatten", ch: 0, hw: 0 }
      ];
      var cv = document.createElement("canvas"); cv.width = 680; cv.height = 230; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
      var st = { step: 0 };
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 680, 230);
        ctx.textBaseline = "middle"; ctx.textAlign = "center";
        var n = stages.length, x0 = 30, gap = (680 - 60) / (n - 1);
        for (var i = 0; i < n; i++) {
          var s = stages[i], cx = x0 + i * gap, active = i <= st.step, cur = i === st.step;
          if (s.ch === 0) {
            // flatten box
            ctx.fillStyle = cur ? c.accent2 : (active ? c.panel : "transparent");
            ctx.strokeStyle = c.border; ctx.lineWidth = 1;
            ctx.fillRect(cx - 20, 70, 40, 46); ctx.strokeRect(cx - 20, 70, 40, 46);
            ctx.fillStyle = active ? c.ink : c.dim; ctx.font = "12px sans-serif";
            ctx.fillText("1568", cx, 93);
          } else {
            var side = 14 + s.hw * 1.4; if (side > 64) side = 64;
            var depth = Math.min(s.ch, 32) * 0.5 + 4;
            ctx.fillStyle = cur ? c.accent2 : (active ? c.accent : c.panel);
            ctx.globalAlpha = active ? 1 : 0.35;
            ctx.fillRect(cx - side / 2 + depth, 93 - side / 2 - depth, side, side);
            ctx.fillStyle = cur ? c.warn : (active ? c.purple : c.border);
            ctx.fillRect(cx - side / 2, 93 - side / 2, side, side);
            ctx.globalAlpha = 1;
            ctx.fillStyle = active ? c.ink : c.dim; ctx.font = "11px sans-serif";
            ctx.fillText(s.ch + "×" + s.hw + "²", cx, 93 + side / 2 + depth + 10);
          }
          ctx.fillStyle = active ? c.dim : c.border; ctx.font = "11px sans-serif";
          ctx.fillText(s.name, cx, 150);
          if (i < n - 1) { ctx.fillStyle = c.dim; ctx.font = "16px sans-serif"; ctx.fillText("→", cx + gap / 2, 93); }
        }
        ctx.textAlign = "start";
      }
      function readout() {
        var msgs = [
          "Input: one-channel 28×28 MNIST image, batch shape (N, 1, 28, 28).",
          "Conv2d(1, 16, 3, padding=1): 1 → 16 channels, padding keeps 28×28.",
          "MaxPool2d(2): halves spatial size to 14×14, channels unchanged.",
          "Conv2d(16, 32, 3, padding=1): 16 → 32 channels, still 14×14.",
          "MaxPool2d(2): down to 7×7. Feature map is now (N, 32, 7, 7).",
          "Flatten: 32 × 7 × 7 = <b>1568</b> features → Linear(1568, 10) head."
        ];
        rd.innerHTML = "<b>Step " + (st.step + 1) + "/6.</b> " + msgs[st.step];
      }
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "pipeline stage";
      var inp = document.createElement("input"); inp.type = "range"; inp.min = 0; inp.max = 5; inp.step = 1; inp.value = 0;
      inp.addEventListener("input", function () { st.step = parseInt(inp.value, 10); draw(); readout(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row); host.appendChild(rd);
      draw(); readout();
    },

    practice: [
      {
        q: `An MNIST batch arrives as a NumPy array of shape (64, 28, 28). What must you do before the first Conv2d, and what is the target shape?`,
        steps: [
          { do: `Note PyTorch convolutions want (N, C, H, W).`, why: `Conv2d expects an explicit channel axis even for grayscale.` },
          { do: `Add a channel axis: x = torch.tensor(arr).unsqueeze(1).`, why: `That inserts C=1 at position 1, giving (64, 1, 28, 28).` }
        ],
        answer: `<p>Convert to a tensor and add the channel dimension with <code>unsqueeze(1)</code>, producing shape <code>(64, 1, 28, 28)</code>. Feeding <code>(64, 28, 28)</code> straight in is a shape error.</p>`
      },
      {
        q: `A net does Conv(p=1, 3×3) → Pool2 → Conv(p=1, 3×3) → Pool2 on a 1×32×32 image, ending with 64 channels. What is the input size of the first Linear layer?`,
        steps: [
          { do: `Padded 3×3 convs keep the spatial size; each Pool2 halves it.`, why: `H_out = (H + 2p − k)/s + 1 = H for p=1,k=3,s=1; pool halves.` },
          { do: `32 → (pool) 16 → (pool) 8, with 64 channels.`, why: `Two MaxPool2d(2) layers halve twice: 32 → 16 → 8.` },
          { do: `Flattened size = 64 × 8 × 8.`, why: `channels × height × width of the final map.` }
        ],
        answer: `<p>$64 \\times 8 \\times 8 = 4096$. So the head is <code>Linear(4096, num_classes)</code>.</p>`
      },
      {
        q: `Test accuracy is much lower and noisier than your training accuracy suggested. The model uses BatchNorm. What is the most likely one-line bug?`,
        steps: [
          { do: `Check whether model.eval() is called before the test loop.`, why: `BatchNorm uses batch stats in train mode and running stats in eval mode.` },
          { do: `Also wrap inference in torch.no_grad().`, why: `Saves memory and signals you are not training.` }
        ],
        answer: `<p>You forgot <code>model.eval()</code>, so BatchNorm normalized test batches with their own statistics instead of the stored running stats. Call <code>model.eval()</code> (and use <code>torch.no_grad()</code>) before evaluating.</p>`
      }
    ]
  });

  window.CODE["pt-cnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A complete, LeNet-style CNN (Convolutional Neural Network) on MNIST: two conv blocks (<code>Conv2d</code> → <code>BatchNorm2d</code> → <code>ReLU</code> → <code>MaxPool2d</code>), then <code>flatten</code> → <code>Linear</code> head. It builds a <code>DataLoader</code>, runs the training loop, and prints test accuracy. Each layer ties to a concept lesson: <code>Conv2d</code> is <code>dl-conv</code>, <code>MaxPool2d</code> is <code>dl-pooling</code>, and the weight counts are <code>dl-cnn-params</code>. Paste into Google Colab — <code>torch</code> and <code>torchvision</code> are preinstalled. A free GPU (Graphics Processing Unit) helps but is not required.</p>`,
    code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- data: normalize, then a DataLoader feeds batches of (N, C, H, W) ---
tfm = transforms.Compose([
    transforms.ToTensor(),                       # uint8 0..255 -> float 0..1, shape (1, 28, 28)
    transforms.Normalize((0.1307,), (0.3081,)),  # MNIST mean/std -> zero mean, unit variance
])
train_ds = datasets.MNIST(root="./data", train=True,  download=True, transform=tfm)
test_ds  = datasets.MNIST(root="./data", train=False, download=True, transform=tfm)
train_dl = DataLoader(train_ds, batch_size=128, shuffle=True)
test_dl  = DataLoader(test_ds,  batch_size=256, shuffle=False)

# --- model: 2 conv blocks + a Linear head (LeNet-style) ---
class SmallCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, stride=1, padding=1),  # (N,1,28,28) -> (N,16,28,28)
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2),                                       # -> (N,16,14,14)
            nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1), # -> (N,32,14,14)
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),                                       # -> (N,32,7,7)
        )
        # flattened size = channels * H * W = 32 * 7 * 7 = 1568
        self.head = nn.Linear(32 * 7 * 7, num_classes)            # outputs raw logits (no softmax!)

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)   # keep batch dim, flatten the rest -> (N, 1568)
        return self.head(x)

model = SmallCNN().to(device)
loss_fn = nn.CrossEntropyLoss()                 # expects logits + integer class labels
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

# --- training loop ---
EPOCHS = 3
for epoch in range(EPOCHS):
    model.train()                               # BatchNorm uses batch stats now
    running = 0.0
    for images, labels in train_dl:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()                   # clear grads (they accumulate otherwise)
        logits = model(images)                  # forward
        loss = loss_fn(logits, labels)
        loss.backward()                         # backprop fills .grad
        optimizer.step()                        # update weights
        running += loss.item()                  # .item() detaches -> no graph kept across steps
    print(f"epoch {epoch+1}/{EPOCHS}  avg train loss {running/len(train_dl):.4f}")

# --- evaluation ---
model.eval()                                    # BatchNorm switches to running stats
correct = total = 0
with torch.no_grad():                           # no graph at inference -> less memory
    for images, labels in test_dl:
        images, labels = images.to(device), labels.to(device)
        preds = model(images).argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

print(f"test accuracy: {correct/total:.4f}  on {total} images")`
  };

  window.CODEVIZ["pt-cnn"] = {
    question: "On the same image task, does a CNN really beat a plain MLP on flattened pixels?",
    charts: [{
      type: "bars",
      title: "Test accuracy on load_digits: small CNN vs flat-pixel MLP (same 540 test images)",
      labels: ["CNN (conv+pool)", "MLP (flat pixels)"],
      values: [0.963, 0.9315],
      valueLabels: ["96.3%", "93.2%"],
      colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "Real PyTorch run on scikit-learn's load_digits (1797 real 8×8 handwritten digits, 30% held out). Two tiny models trained 12 epochs with Adam and the same DataLoader: the CNN (two Conv2d→BatchNorm→ReLU→MaxPool blocks + Linear head) reaches 96.3% test accuracy; an MLP on the 64 flattened pixels reaches 93.2%. Exploiting spatial locality wins.",
    code: `import numpy as np, torch, torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

torch.manual_seed(0); np.random.seed(0)
d = load_digits()                                  # 1797 real 8x8 digits
X = (d.images / 16.0).astype("float32")            # scale pixels to 0..1, shape (N, 8, 8)
y = d.target.astype("int64")
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)

# add channel axis -> (N, 1, 8, 8); PyTorch convs want (N, C, H, W)
Xtr_t = torch.tensor(Xtr).unsqueeze(1); Xte_t = torch.tensor(Xte).unsqueeze(1)
ytr_t = torch.tensor(ytr);              yte_t = torch.tensor(yte)
dl = DataLoader(TensorDataset(Xtr_t, ytr_t), batch_size=64, shuffle=True)

class CNN(nn.Module):                              # two conv blocks + Linear head
    def __init__(s):
        super().__init__()
        s.c1 = nn.Conv2d(1, 8, 3, padding=1);  s.b1 = nn.BatchNorm2d(8)
        s.c2 = nn.Conv2d(8, 16, 3, padding=1); s.b2 = nn.BatchNorm2d(16)
        s.pool = nn.MaxPool2d(2); s.relu = nn.ReLU(); s.fc = nn.Linear(16*2*2, 10)
    def forward(s, x):
        x = s.pool(s.relu(s.b1(s.c1(x))))          # 8x8 -> 4x4
        x = s.pool(s.relu(s.b2(s.c2(x))))          # 4x4 -> 2x2
        return s.fc(x.flatten(1))                   # 16*2*2 = 64 -> 10 logits

class MLP(nn.Module):                              # flat pixels -> dense layers
    def __init__(s):
        super().__init__()
        s.net = nn.Sequential(nn.Linear(64, 64), nn.ReLU(), nn.Linear(64, 10))
    def forward(s, x): return s.net(x.flatten(1))

def train(model, epochs=12):
    opt = torch.optim.Adam(model.parameters(), lr=1e-3); lf = nn.CrossEntropyLoss()
    for _ in range(epochs):
        model.train()
        for xb, yb in dl:
            opt.zero_grad(); lf(model(xb), yb).backward(); opt.step()
    model.eval()
    with torch.no_grad():
        return (model(Xte_t).argmax(1) == yte_t).float().mean().item()

torch.manual_seed(0); cnn_acc = train(CNN())
torch.manual_seed(0); mlp_acc = train(MLP())
print(round(cnn_acc, 4), round(mlp_acc, 4))        # -> 0.963 0.9315`
  };
})();
