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
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["dl-conv", "dl-pooling", "dl-cnn-params", "dl-forward-prop", "dl-backprop", "dl-optimizers"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>wire <code>nn.Conv2d</code>, <code>nn.BatchNorm2d</code>, <code>nn.ReLU</code>, and <code>nn.MaxPool2d</code> into convolutional blocks and trace the <code>(N, C, H, W)</code> shape through each one;</li>
<li>compute the flattened feature size by hand (each <code>MaxPool2d(2)</code> halves H and W) so the first <code>nn.Linear</code> head has the right input width;</li>
<li>subclass <code>nn.Module</code> into a small image classifier and run the full data &rarr; train &rarr; evaluate loop on MNIST.</li>
</ul>
<p><b>The API you'll own:</b> <code>nn.Conv2d</code>, <code>nn.MaxPool2d</code>, <code>nn.BatchNorm2d</code>, <code>nn.Sequential</code>, <code>torch.flatten(x, 1)</code>, <code>nn.Linear</code>, <code>nn.Module</code> (<code>__init__</code>/<code>forward</code>).</p>`,

    concept: `<p>A <b>CNN (Convolutional Neural Network)</b> is a stack of layers that turn an image into a class. Reach for one whenever the input is an image or any grid-structured data &mdash; photos, scans, spectrograms, board grids &mdash; where nearby values are related. Unlike an MLP (Multi-Layer Perceptron) on flattened pixels, a CNN shares a small filter across the whole image, so it learns far fewer parameters and exploits spatial locality (see <code>dl-conv</code>).</p>
<p>The network is a <b>funnel</b> in two halves:</p>
<ul>
<li><b>Convolutional blocks.</b> <code>Conv2d</code> finds local patterns, <code>BatchNorm2d</code> steadies the signal, <code>ReLU</code> adds a nonlinearity, and <code>MaxPool2d</code> shrinks the spatial map. Each block makes the picture smaller in space but richer in channels.</li>
<li><b>The head.</b> You <code>flatten</code> the final feature map into one long vector and feed it to a <code>Linear</code> layer that outputs one score (logit) per class.</li>
</ul>
<p>The one shape rule you live by: PyTorch convolutions want <code>(N, C, H, W)</code> &mdash; batch, channels, height, width. A grayscale MNIST batch is <code>(N, 1, 28, 28)</code>. Trace the spatial size through the blocks (28 &rarr; 14 &rarr; 7 after two <code>MaxPool2d(2)</code>) so you know the flattened size (32 &times; 7 &times; 7 = <b>1568</b>) the head needs.</p>`,

    apiTable: [
      { sig: "nn.Conv2d(in_ch, out_ch, kernel_size, stride=1, padding=0)", does: "A convolution layer: learns <code>out_ch</code> filters of size <code>kernel_size</code>, sliding over the <code>(N, C, H, W)</code> input. <code>padding=1</code> with a 3&times;3 kernel keeps H and W.", snippet: "nn.Conv2d(1, 16, 3, padding=1)" },
      { sig: "nn.MaxPool2d(kernel_size)", does: "Downsamples each channel by taking the max over each window. <code>MaxPool2d(2)</code> halves H and W.", snippet: "nn.MaxPool2d(2)          # 28 -> 14" },
      { sig: "nn.BatchNorm2d(num_features)", does: "Normalizes each channel using batch stats in <code>train()</code>, running stats in <code>eval()</code>. <code>num_features</code> = channel count.", snippet: "nn.BatchNorm2d(16)" },
      { sig: "nn.ReLU()", does: "Elementwise nonlinearity <code>max(0, x)</code>. Goes between conv and pool in each block.", snippet: "nn.ReLU()" },
      { sig: "nn.Sequential(*layers)", does: "Chains layers into one module that runs them in order &mdash; the easy way to build a feature extractor.", snippet: "nn.Sequential(conv, bn, relu, pool)" },
      { sig: "x.unsqueeze(1)", does: "Inserts the channel axis: turns a grayscale batch <code>(N, H, W)</code> into <code>(N, 1, H, W)</code> that <code>Conv2d</code> accepts.", snippet: "x = arr.unsqueeze(1)     # (64,1,28,28)" },
      { sig: "torch.flatten(x, 1)", does: "Flattens every axis after the batch dim: a <code>(N, 32, 7, 7)</code> map becomes <code>(N, 1568)</code> for the <code>Linear</code> head.", snippet: "torch.flatten(x, 1)      # (N, 1568)" },
      { sig: "nn.Linear(in_features, out_features)", does: "The classifier head. <code>in_features</code> must equal channels&times;H&times;W after the last pool (32&times;7&times;7 = 1568); <code>out_features</code> = number of classes.", snippet: "nn.Linear(32*7*7, 10)" },
      { sig: "class Net(nn.Module): __init__ / forward", does: "Subclass <code>nn.Module</code>: register layers in <code>__init__</code>, define the data flow in <code>forward</code>. Calling <code>model(x)</code> runs <code>forward</code>.", snippet: "def forward(self, x): ..." },
      { sig: "H_out = floor((H + 2p - k)/s) + 1", does: "Conv/pool output-size rule per spatial dim. A 3&times;3, <code>p=1</code>, <code>s=1</code> conv keeps size; <code>MaxPool2d(2)</code> halves it.", snippet: "(28 + 2*1 - 3)/1 + 1 = 28" }
    ],

    codeTour: [
      {
        explain: `<b>Data: normalize, then batch.</b> <code>ToTensor</code> turns each <code>uint8</code> 0..255 image into a float <code>(1, 28, 28)</code> tensor in 0..1; <code>Normalize</code> shifts it to roughly zero mean, unit variance using MNIST's stats. The <code>DataLoader</code> feeds shuffled batches of <code>(N, 1, 28, 28)</code> to the loop.`,
        code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

tfm = transforms.Compose([
    transforms.ToTensor(),                       # uint8 0..255 -> float 0..1, (1,28,28)
    transforms.Normalize((0.1307,), (0.3081,)),  # MNIST mean/std
])
train_ds = datasets.MNIST("./data", train=True,  download=True, transform=tfm)
test_ds  = datasets.MNIST("./data", train=False, download=True, transform=tfm)
train_dl = DataLoader(train_ds, batch_size=128, shuffle=True)
test_dl  = DataLoader(test_ds,  batch_size=256, shuffle=False)

imgs, labels = next(iter(train_dl))
print(imgs.shape, labels.shape)`,
        output: `torch.Size([128, 1, 28, 28]) torch.Size([128])`
      },
      {
        explain: `<b>The model: two conv blocks + a Linear head.</b> Each block is <code>Conv2d &rarr; BatchNorm2d &rarr; ReLU &rarr; MaxPool2d</code>. With <code>padding=1</code> the 3&times;3 convs keep the spatial size, and each <code>MaxPool2d(2)</code> halves it: 28 &rarr; 14 &rarr; 7. Channels grow 1 &rarr; 16 &rarr; 32, so the flattened size is 32 &times; 7 &times; 7 = <b>1568</b>.`,
        code: `class SmallCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU(), nn.MaxPool2d(2),   # -> (N,16,14,14)
            nn.Conv2d(16, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),  # -> (N,32,7,7)
        )
        self.head = nn.Linear(32 * 7 * 7, num_classes)   # 1568 -> 10 logits (no softmax!)

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)   # keep batch dim -> (N, 1568)
        return self.head(x)

model = SmallCNN().to(device)
print(model.features(torch.randn(5, 1, 28, 28).to(device)).shape)  # feature-map shape
print(model(torch.randn(5, 1, 28, 28).to(device)).shape)           # logits shape`,
        output: `torch.Size([5, 32, 7, 7])
torch.Size([5, 10])`
      },
      {
        explain: `<b>Loss and optimizer.</b> <code>CrossEntropyLoss</code> expects raw logits and integer class labels &mdash; it applies log-softmax internally, so there is no softmax layer on the head. <code>Adam</code> gets the model's parameters and a learning rate.`,
        code: `loss_fn = nn.CrossEntropyLoss()                 # logits + integer labels
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
print(sum(p.numel() for p in model.parameters()), "parameters")`,
        output: `19722 parameters`
      },
      {
        explain: `<b>The training loop.</b> Set <code>model.train()</code> (so BatchNorm uses batch stats), then per batch: move data to the device, <code>zero_grad</code> &rarr; forward &rarr; loss &rarr; <code>backward</code> &rarr; <code>step</code>. Accumulate <code>loss.item()</code> (a plain number, no graph) and the average train loss falls each epoch.`,
        code: `EPOCHS = 3
for epoch in range(EPOCHS):
    model.train()                               # BatchNorm uses batch stats
    running = 0.0
    for images, labels in train_dl:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()                   # clear grads (they accumulate)
        loss = loss_fn(model(images), labels)   # forward + loss
        loss.backward()                         # backprop fills .grad
        optimizer.step()                        # update weights
        running += loss.item()                  # .item() -> no graph kept
    print(f"epoch {epoch+1}/{EPOCHS}  avg train loss {running/len(train_dl):.4f}")`,
        output: `epoch 1/3  avg train loss 0.1614
epoch 2/3  avg train loss 0.0513
epoch 3/3  avg train loss 0.0380`
      },
      {
        explain: `<b>Evaluation.</b> Switch to <code>model.eval()</code> so BatchNorm uses its stored running stats, and wrap the pass in <code>torch.no_grad()</code> so no autograd graph is built. Count correct predictions via <code>argmax</code> over the logits.`,
        code: `model.eval()                                    # BatchNorm -> running stats
correct = total = 0
with torch.no_grad():                           # no graph at inference
    for images, labels in test_dl:
        images, labels = images.to(device), labels.to(device)
        preds = model(images).argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

print(f"test accuracy: {correct/total:.4f}  on {total} images")`,
        output: `test accuracy: 0.9901  on 10000 images`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each printed line:</p>
<ul>
<li>The data chunk prints <code>torch.Size([128, 1, 28, 28]) torch.Size([128])</code> &mdash; one batch of 128 grayscale 28&times;28 images and their 128 integer labels. That <code>(N, 1, 28, 28)</code> shape is exactly what <code>Conv2d</code> wants.</li>
<li>The model chunk prints the feature-map shape <code>torch.Size([5, 32, 7, 7])</code> (two <code>MaxPool2d(2)</code> took 28 &rarr; 7, channels grew to 32) and the logits shape <code>torch.Size([5, 10])</code> &mdash; one score per class. The 32&times;7&times;7 = 1568 is what makes <code>Linear(1568, 10)</code> the right head.</li>
<li>The training loop prints a falling average loss each epoch (about 0.16 &rarr; 0.05 &rarr; 0.04) &mdash; proof the weights are moving downhill.</li>
<li>The eval chunk prints test accuracy around <code>0.99 on 10000 images</code>. It must come after <code>model.eval()</code>; skip that and BatchNorm uses the wrong stats and the number is noisy.</li>
</ul>
<p>Exact numbers depend on the seed and the hardware: even with <code>torch.manual_seed(0)</code>, GPU (Graphics Processing Unit) kernels are not bit-for-bit reproducible, so expect the loss and accuracy to land near &mdash; not exactly on &mdash; these values. A free GPU runtime helps but is not required.</p>`,

    cheatsheet: [
      { code: "nn.Conv2d(1, 16, 3, padding=1)", note: "1->16 channels, 3x3 kernel, padding=1 keeps H/W" },
      { code: "nn.MaxPool2d(2)", note: "halves H and W; channels unchanged" },
      { code: "nn.BatchNorm2d(16)", note: "per-channel norm; batch stats (train) vs running (eval)" },
      { code: "x = arr.unsqueeze(1)", note: "add channel axis: (N,H,W) -> (N,1,H,W)" },
      { code: "torch.flatten(x, 1)", note: "keep batch dim; (N,32,7,7) -> (N,1568)" },
      { code: "nn.Linear(32*7*7, 10)", note: "head; in_features = channels*H*W = 1568" },
      { code: "H_out = (H + 2p - k)//s + 1", note: "conv/pool output-size rule" },
      { code: "model.eval(); with torch.no_grad():", note: "test-time: running BN stats, no graph" },
      { code: "nn.CrossEntropyLoss()(logits, labels)", note: "raw logits + integer labels, no softmax" }
    ],

    deeper: `<p>This lesson is the PyTorch assembly; the math lives in the concept lessons:</p>
<ul>
<li>what a filter computes &mdash; <a onclick="App.open('dl-conv')">convolution</a>;</li>
<li>downsampling with max pooling &mdash; <a onclick="App.open('dl-pooling')">pooling</a>;</li>
<li>counting the weights in each layer &mdash; <a onclick="App.open('dl-cnn-params')">CNN parameters</a>;</li>
<li>how <code>loss.backward()</code> fills each <code>.grad</code> &mdash; <a onclick="App.open('dl-backprop')">backpropagation</a>;</li>
<li>how <code>optimizer.step()</code> updates the weights &mdash; <a onclick="App.open('dl-optimizers')">optimizers</a>.</li>
</ul>`,

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
        q: `<b>Type this in Colab.</b> The channel-axis pitfall. Make a grayscale batch
            <code>arr = torch.randn(64, 28, 28)</code>. Try <code>nn.Conv2d(1, 8, 3)(arr)</code> and observe the shape
            error, then add the channel axis with <code>arr.unsqueeze(1)</code> and run it. Predict the output shape
            before running.`,
        steps: [
          { do: `Insert C=1 with <code>arr.unsqueeze(1)</code> to get <code>(64, 1, 28, 28)</code>.`, why: `<code>nn.Conv2d</code> wants <code>(N, C, H, W)</code> — an explicit channel axis even for grayscale.` },
          { do: `Run the conv and print <code>out.shape</code>.`, why: `A 3&times;3 conv with no padding trims the border, so 28&rarr;26.` }
        ],
        answer: `<pre><code>import torch, torch.nn as nn
arr = torch.randn(64, 28, 28)
# nn.Conv2d(1, 8, 3)(arr)  -> RuntimeError: expected 4D input (N,C,H,W)
x = arr.unsqueeze(1)              # (64, 1, 28, 28)
out = nn.Conv2d(1, 8, 3)(x)
print(out.shape)                  # torch.Size([64, 8, 26, 26])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Verify the conv output-shape formula. Feed <code>x = torch.randn(2, 3, 32, 32)</code>
            through (a) <code>nn.Conv2d(3, 16, kernel_size=3, padding=1)</code> and (b)
            <code>nn.Conv2d(3, 16, kernel_size=5, stride=2, padding=0)</code>. Predict each output's H and W from
            $H_{out}=\\lfloor (H+2p-k)/s \\rfloor + 1$, then verify.`,
        steps: [
          { do: `Apply both convs and print <code>.shape</code>.`, why: `Padded 3&times;3 (p=1,s=1) keeps 32; the 5&times;5 stride-2 gives (32-5)/2+1 = 14.` },
          { do: `Check the channel dim is the conv's <code>out_channels</code> (16).`, why: `<code>out_channels</code> is how many filters/feature maps the layer learns.` }
        ],
        answer: `<pre><code>x = torch.randn(2, 3, 32, 32)
a = nn.Conv2d(3, 16, kernel_size=3, padding=1)(x)
b = nn.Conv2d(3, 16, kernel_size=5, stride=2, padding=0)(x)
print(a.shape)   # torch.Size([2, 16, 32, 32])  (p=1,s=1 keeps size)
print(b.shape)   # torch.Size([2, 16, 14, 14])  ((32-5)/2 + 1 = 14)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Trace a two-block feature extractor. Build
            <code>nn.Sequential(Conv2d(1,16,3,padding=1), ReLU(), MaxPool2d(2), Conv2d(16,32,3,padding=1), ReLU(), MaxPool2d(2))</code>
            and run an MNIST-sized input <code>torch.randn(4, 1, 28, 28)</code> through it. Predict the final shape,
            then compute the flattened feature count.`,
        steps: [
          { do: `Print the output shape after the two conv+pool blocks.`, why: `Each <code>MaxPool2d(2)</code> halves H and W: 28&rarr;14&rarr;7, with 32 channels.` },
          { do: `Compute <code>32 * 7 * 7</code> for the flattened size.`, why: `That is the input width the first <code>Linear</code> head needs.` }
        ],
        answer: `<pre><code>feat = nn.Sequential(
    nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
    nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
)
out = feat(torch.randn(4, 1, 28, 28))
print(out.shape)            # torch.Size([4, 32, 7, 7])
print(32 * 7 * 7)           # 1568  -> Linear(1568, num_classes)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The flatten-size pitfall. Build a tiny CNN where the head is wrongly
            <code>nn.Linear(100, 10)</code> after the two-block extractor above. Feed a <code>(4, 1, 28, 28)</code> batch
            and read the <code>mat1 and mat2 shapes cannot be multiplied</code> error. Fix the head to the correct size.`,
        steps: [
          { do: `Flatten with <code>torch.flatten(x, 1)</code> (keep the batch dim) before the <code>Linear</code>.`, why: `The head is a matrix multiply; the in-features must equal channels&times;H&times;W = 1568.` },
          { do: `Replace <code>Linear(100, 10)</code> with <code>Linear(1568, 10)</code>.`, why: `Matching the flattened size removes the shape-mismatch error.` }
        ],
        answer: `<pre><code>class Net(nn.Module):
    def __init__(s, in_feats):
        super().__init__()
        s.feat = feat                       # the 2-block extractor above
        s.head = nn.Linear(in_feats, 10)
    def forward(s, x):
        return s.head(torch.flatten(s.feat(x), 1))

x = torch.randn(4, 1, 28, 28)
# Net(100)(x)   -> RuntimeError: mat1 and mat2 shapes cannot be multiplied (4x1568 and 100x10)
print(Net(1568)(x).shape)    # torch.Size([4, 10])  -- correct flattened size</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Count a Conv2d's parameters. Build
            <code>conv = nn.Conv2d(3, 16, kernel_size=3)</code> and print
            <code>sum(p.numel() for p in conv.parameters())</code>. Predict it first:
            weights = out&times;in&times;k&times;k, plus one bias per output channel.`,
        steps: [
          { do: `Compute weights <code>16 * 3 * 3 * 3 = 432</code> plus <code>16</code> biases.`, why: `A Conv2d learns one <code>k&times;k</code> filter per (in, out) channel pair, plus a per-output bias.` },
          { do: `Verify with <code>sum(p.numel() for p in conv.parameters())</code>.`, why: `<code>.numel()</code> totals every weight and bias the layer holds.` }
        ],
        answer: `<pre><code>conv = nn.Conv2d(3, 16, kernel_size=3)
print(sum(p.numel() for p in conv.parameters()))   # 448
# weights 16*3*3*3 = 432, biases 16  ->  432 + 16 = 448</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The eval-mode pitfall with BatchNorm. Build
            <code>bn = nn.BatchNorm2d(4)</code> and a fixed input <code>x = torch.randn(8, 4, 6, 6)</code>. Print
            <code>bn(x).mean().item()</code> in <code>bn.train()</code> mode, then in <code>bn.eval()</code> mode, and
            note they differ.`,
        steps: [
          { do: `Run the same input through <code>bn.train()</code> then <code>bn.eval()</code>.`, why: `Train mode normalizes with the batch's own stats; eval mode uses stored running stats.` },
          { do: `Observe the two outputs differ.`, why: `That difference is exactly why forgetting <code>model.eval()</code> at test time corrupts the numbers.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
bn = nn.BatchNorm2d(4)
x = torch.randn(8, 4, 6, 6)
bn.train(); print(round(bn(x).mean().item(), 4))   # ~ 0.0    (batch stats -> centered)
bn.eval();  print(round(bn(x).mean().item(), 4))   # ~ 0.0276 (running stats -> not centered)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Run one full training step of a small CNN. With <code>torch.manual_seed(0)</code>,
            build the <code>Net(1568)</code> from before, <code>CrossEntropyLoss</code> (raw logits, no softmax),
            <code>Adam(lr=1e-3)</code>, a batch <code>x = torch.randn(8, 1, 28, 28)</code>, and labels
            <code>y = torch.randint(0, 10, (8,))</code>. Do zero_grad &rarr; forward &rarr; loss &rarr; backward &rarr;
            step and print the loss.`,
        steps: [
          { do: `Pass raw logits to <code>CrossEntropyLoss</code> with integer labels.`, why: `The loss applies log-softmax internally — no softmax layer on the head.` },
          { do: `Run <code>opt.zero_grad()</code> before <code>loss.backward()</code>.`, why: `Gradients accumulate across batches; zeroing keeps each step's update correct.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = Net(1568)
crit = nn.CrossEntropyLoss()
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
x = torch.randn(8, 1, 28, 28)
y = torch.randint(0, 10, (8,))
opt.zero_grad()
loss = crit(model(x), y)     # logits + integer labels
loss.backward()
opt.step()
print(round(loss.item(), 4))   # ~ 2.45  (near ln(10)=2.30 at init)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Assemble a clean LeNet-style model class end-to-end and confirm the output shape.
            Subclass <code>nn.Module</code> with two <code>Conv2d&rarr;BatchNorm2d&rarr;ReLU&rarr;MaxPool2d</code> blocks
            (1&rarr;16&rarr;32 channels, padding=1) and a <code>Linear(1568, 10)</code> head. Feed
            <code>torch.randn(5, 1, 28, 28)</code> and print the logits shape.`,
        steps: [
          { do: `Put the conv blocks in <code>self.features</code> and the head in <code>self.head</code>.`, why: `Separating the feature extractor from the classifier head is the standard CNN layout.` },
          { do: `In <code>forward</code>, <code>torch.flatten(x, 1)</code> before the head.`, why: `Flattening keeps the batch dim and turns the 32&times;7&times;7 map into the 1568-vector the head expects.` }
        ],
        answer: `<pre><code>class SmallCNN(nn.Module):
    def __init__(s, num_classes=10):
        super().__init__()
        s.features = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),
        )
        s.head = nn.Linear(32 * 7 * 7, num_classes)   # raw logits (no softmax)
    def forward(s, x):
        return s.head(torch.flatten(s.features(x), 1))

print(SmallCNN()(torch.randn(5, 1, 28, 28)).shape)   # torch.Size([5, 10])</code></pre>`
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
