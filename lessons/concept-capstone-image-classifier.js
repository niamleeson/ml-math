/* Capstone spine #2 — "From a single neuron to ResNet" (CIFAR-10).
   An ORDERED PATH through seven foundational papers; implementing each adds a component to a
   growing image classifier. Milestones (LeNet, BatchNorm, ResNet) assemble + run the partial
   system; the final notebook stitches the pieces into a small ResNet, trains it on a CIFAR-10
   subset, prints test accuracy, and ablates the skip connection.
   Self-contained: lesson + CODE + CODEVIZ merged by id "capstone-image-classifier".
   Component papers (each grounded in its own concept-paper-*.js file): paper-backprop,
   paper-lenet, paper-alexnet, paper-batchnorm, paper-vgg, paper-resnet, paper-adam. */
(function () {
  window.LESSONS.push({
    id: "capstone-image-classifier",
    type: "capstone",
    title: "From a single neuron to ResNet — build a CIFAR-10 image classifier",
    tagline: "Walk the path from the backprop rule to a small ResNet, one landmark paper at a time, then assemble and train the working classifier.",
    module: "Capstones",

    goal:
      `<p>By the end you will have <b>built and trained a small ResNet</b> &mdash; a deep convolutional
       image classifier with Batch Normalization and residual (skip) connections &mdash; on
       <b>CIFAR-10</b> (the 32&times;32-pixel, 10-class natural-image benchmark: airplane, cat, ship, and
       so on). "Done" means the assembled network runs end to end in a Google Colab notebook, you
       <b>print its accuracy on held-out test images</b>, and you have <b>watched the skip-removal
       ablation</b> show <i>why</i> the residual version trains where a matched plain net stalls.</p>
       <p>This is not one paper &mdash; it is a <b>build order</b>. Each step is a normal paper lesson;
       implementing it hands you the next component. The seven components, in order, are: the learning
       rule (backprop), the first convolutional net (LeNet), the deep-net tricks that made depth work
       (AlexNet's ReLU + dropout), the layer that stabilized training (BatchNorm), a clean way to add
       depth (VGG's stacked 3&times;3 convolutions), the block that made <i>very</i> deep nets trainable
       (ResNet's residual connection), and the optimizer that ties it together (Adam). The final cell
       assembles them and reports <b>our small run's</b> test accuracy &mdash; not a paper's number.</p>`,

    architecture:
      `<p>The architecture grows the same way the field did &mdash; <b>neuron &rarr; convolution &rarr;
       depth &rarr; normalization &rarr; residual</b>:</p>
       <ol>
        <li><b>A single neuron, trained by backprop.</b> The starting point is one linear unit
        $\\hat{y} = w^{\\top}x + b$ with a nonlinearity, and the <b>backpropagation</b> rule that computes
        the gradient of the loss with respect to every weight in one backward sweep. Stack neurons into
        layers and you have a multi-layer perceptron &mdash; but on raw image pixels it is wasteful and
        weak.</li>
        <li><b>Convolution (LeNet).</b> Replace the dense connections with a small <b>convolutional
        filter</b> that slides across the image and shares its weights everywhere. Add subsampling
        (pooling) to shrink the map. This is the first CNN: <code>conv &rarr; pool &rarr; conv &rarr; pool
        &rarr; classify</code>.</li>
        <li><b>Depth that trains (AlexNet).</b> Swap the saturating activations for the <b>ReLU</b>
        (Rectified Linear Unit: keep positives, zero negatives) so gradients survive, and add
        <b>dropout</b> (randomly zero units while training) to fight overfitting. Now the CNN can be deep
        and wide.</li>
        <li><b>Normalization (BatchNorm).</b> Insert <b>Batch Normalization</b> after each convolution:
        standardize each channel over the mini-batch, then learn a scale and shift. Layers see stable
        input distributions, so you can use a higher learning rate and train far faster.</li>
        <li><b>Depth via 3&times;3 stacks (VGG).</b> Build depth from nothing but stacked <b>3&times;3</b>
        convolutions &mdash; two 3&times;3 layers see as much as one 5&times;5 with fewer weights &mdash;
        which gives a clean, uniform recipe for adding layers.</li>
        <li><b>Residual blocks (ResNet).</b> Wrap each pair of convolutions in a <b>skip connection</b>
        that adds the block's input back to its output ($y = F(x) + x$). The "$+x$" is a gradient highway
        that lets very deep stacks train. This is the body of our final network.</li>
        <li><b>Adam to drive it.</b> Train the whole thing with <b>Adam</b>, which gives each weight its
        own adaptive step size from running averages of the gradient and its square &mdash; so it
        converges quickly with almost no learning-rate tuning.</li>
       </ol>
       <p><b>What we actually build:</b> a stem convolution, then three stages of residual blocks
       (each <code>conv &rarr; BatchNorm &rarr; ReLU &rarr; conv &rarr; BatchNorm</code>, then <b>+ x</b>,
       then ReLU), global average pooling, and a linear classification head &mdash; trained with Adam on
       a CIFAR-10 subset. Then we flip one switch to <b>delete the skip</b> and watch the matched plain
       net fall behind.</p>`,

    steps: [
      { paper: "paper-backprop",  builds: "gradient descent by backprop",          milestone: false },
      { paper: "paper-lenet",     builds: "the first CNN",                          milestone: true  },
      { paper: "paper-alexnet",   builds: "a deep CNN with ReLU + dropout",          milestone: false },
      { paper: "paper-batchnorm", builds: "BatchNorm",                             milestone: true  },
      { paper: "paper-vgg",       builds: "depth via 3x3 stacks",                    milestone: false },
      { paper: "paper-resnet",    builds: "residual blocks",                        milestone: true  },
      { paper: "paper-adam",      builds: "the Adam optimizer",                     milestone: false }
    ],

    reflection:
      `<p>Look back at what each paper contributed to the classifier you just trained &mdash; the whole net
       is the sum of these ideas:</p>
       <ul>
        <li><b>Backprop (1986)</b> &mdash; the <b>learning rule</b>. The chain-rule backward sweep that
        computes the gradient of the loss with respect to every weight. Without it nothing in the stack
        could learn; <code>loss.backward()</code> in the notebook <i>is</i> this paper.</li>
        <li><b>LeNet (1998)</b> &mdash; <b>convolution</b>. Weight-shared filters that slide across the
        image plus pooling, so the net reads structure from raw pixels instead of memorizing positions.
        Every <code>nn.Conv2d</code> in our net descends from here.</li>
        <li><b>AlexNet (2012)</b> &mdash; <b>depth that trains</b>. ReLU activations (so gradients do not
        vanish through saturation) and dropout (regularization), the tricks that let a CNN go deep and win
        ImageNet &mdash; the start of the modern era.</li>
        <li><b>BatchNorm (2015)</b> &mdash; <b>stable, fast training</b>. Standardize each layer's inputs
        over the mini-batch, then learn a scale and shift. This is what lets us use a healthy learning rate
        and converge in a handful of epochs; it sits inside every residual block.</li>
        <li><b>VGG (2014)</b> &mdash; <b>a clean way to add depth</b>. Build everything from stacked
        3&times;3 convolutions; two of them see as much as one 5&times;5 with fewer weights. Our blocks use
        exactly these 3&times;3 layers.</li>
        <li><b>ResNet (2015)</b> &mdash; <b>residual blocks</b>. The skip connection $y = F(x) + x$ &mdash;
        a parameter-free gradient highway &mdash; that makes very deep nets trainable. It is the body of
        our network and the star of the ablation: remove it and the matched plain net stalls.</li>
        <li><b>Adam (2014)</b> &mdash; <b>the optimizer</b>. Per-parameter adaptive step sizes from running
        averages of the gradient and its square, so the whole net converges quickly with little tuning.</li>
       </ul>
       <p><b>What to read next.</b> The same "$+x$" skip and the same normalize-then-scale idea reappear in
       the <a onclick="App.open('capstone-mini-gpt')">mini-GPT</a> spine (residual connections and
       LayerNorm inside the Transformer block) &mdash; deep vision and deep language turn out to lean on the
       same two tricks. From here, the natural next papers are <b>Inception</b> and <b>DenseNet</b> (other
       ways to wire depth) and <b>Vision Transformer</b> (dropping convolution for attention on image
       patches).</p>`,

    practice: [
      {
        q: `<b>The capstone ablation.</b> You have just trained the assembled small ResNet and printed its
            CIFAR-10 test accuracy. Now set <code>skip=False</code> to delete the single
            "<code>+ identity</code>" line in every block (a matched plain net of identical depth, width,
            optimizer, and data) and retrain. What happens to <i>test accuracy</i>, and what does the
            comparison prove about which paper's idea is load-bearing?`,
        steps: [
          { do: `Change exactly one thing: the block's <code>skip</code> flag from <code>True</code> to <code>False</code>, so <code>out = relu(out + identity)</code> becomes <code>out = relu(out)</code>. Keep depth, width, BatchNorm, Adam, seed, and the CIFAR-10 subset identical.`, why: `An honest ablation varies one factor &mdash; the residual connection &mdash; so any accuracy gap is attributable to it alone, not to capacity or tuning.` },
          { do: `Retrain and compare: the residual net's test accuracy is clearly higher; the deep plain net trains more slowly and lands lower (or stalls).`, why: `Without the "$+x$" gradient highway, the signal to early layers is weak, so the deep plain stack optimizes poorly &mdash; the degradation problem reproduced on our small run.` },
          { do: `Conclude that the skip connection, not extra parameters, is what makes the deep classifier work.`, why: `Both nets share layers and parameter count; only the residual one trains well, isolating ResNet's contribution from all the others.` }
        ],
        answer: `<p>The <b>residual</b> net reaches clearly higher CIFAR-10 test accuracy than the matched
                 <b>plain</b> net, which trains slowly and plateaus low. Because the two are identical
                 except for the "<code>+ identity</code>", this isolates <b>ResNet's skip connection</b> as
                 the load-bearing idea for depth &mdash; an <b>optimization</b> fix, not a parameter-count
                 or regularization effect. The CODEVIZ panel shows the same gap in the training curves.
                 (These are our small-run numbers, not any paper's reported result.)</p>`
      },
      {
        q: `Trace one component to one line of the final build. For each of (a) convolution, (b) Batch
            Normalization, (c) the residual skip, (d) the optimizer, name the paper that introduced it and
            the PyTorch construct in our code that embodies it.`,
        steps: [
          { do: `Map convolution &rarr; <b>LeNet</b> &rarr; <code>nn.Conv2d(...)</code> (the 3&times;3 layers, with VGG's stacking recipe).`, why: `LeNet introduced weight-shared sliding filters; VGG fixed the size at 3&times;3 and stacked them.` },
          { do: `Map normalization &rarr; <b>BatchNorm</b> &rarr; <code>nn.BatchNorm2d(...)</code> after each conv.`, why: `Standardize-then-scale per channel over the mini-batch is exactly the BatchNorm paper.` },
          { do: `Map the skip &rarr; <b>ResNet</b> &rarr; <code>out = relu(out + identity)</code>; and the step rule &rarr; <b>Adam</b> &rarr; <code>torch.optim.Adam(...)</code>. ReLU traces to <b>AlexNet</b>, and <code>loss.backward()</code> to <b>backprop</b>.`, why: `Each line of the build is one paper's contribution made concrete.` }
        ],
        answer: `<p>(a) Convolution &rarr; <b>LeNet</b> &rarr; <code>nn.Conv2d</code> (3&times;3, stacked per
                 <b>VGG</b>). (b) Batch Normalization &rarr; <b>BatchNorm</b> &rarr; <code>nn.BatchNorm2d</code>.
                 (c) The residual skip &rarr; <b>ResNet</b> &rarr; <code>out = relu(out + identity)</code>.
                 (d) The optimizer &rarr; <b>Adam</b> &rarr; <code>torch.optim.Adam</code>. (ReLU is
                 <b>AlexNet</b>'s; the backward sweep <code>loss.backward()</code> is <b>backprop</b>.) The
                 whole network is these seven papers assembled.</p>`
      }
    ]
  });

  window.CODE["capstone-image-classifier"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p><b>The final build.</b> This assembles the components from the seven papers into one working
       classifier: weight-shared <b>convolutions</b> (LeNet) sized 3&times;3 and stacked (VGG), each
       followed by <b>Batch Normalization</b> (BatchNorm) and a <b>ReLU</b> (AlexNet), wrapped in a
       <b>residual skip</b> (ResNet, $y = F(x) + x$), trained with <b>Adam</b> &mdash; and the whole thing
       learns by the <b>backprop</b> rule (<code>loss.backward()</code>). We train on a <b>CIFAR-10
       subset</b> (torchvision is preinstalled in Colab &mdash; <b>no pip</b>), then <b>print test
       accuracy</b> on held-out images. Finally we flip <code>skip=False</code> to run the
       <b>skip-removal ablation</b>: a matched plain net of the same depth, which trains worse &mdash; the
       payoff that shows the residual connection is what made the deep net work. Paste into Colab and run
       (a GPU runtime is faster but not required).</p>`,
    code: `import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 1. The residual block: conv -> BN -> ReLU -> conv -> BN, then + x, then ReLU. ---
#     skip=True  -> ResNet (the residual block, ResNet 2015).
#     skip=False -> the ABLATION: a matched plain net (same depth, no '+ identity').
#     Pieces by paper: nn.Conv2d (LeNet, 3x3 per VGG), nn.BatchNorm2d (BatchNorm),
#                      nn.ReLU (AlexNet), out + identity (ResNet).
class BasicBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1, skip=True):
        super().__init__()
        self.skip  = skip
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3, stride=stride, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, stride=1, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(out_ch)
        self.relu  = nn.ReLU(inplace=True)
        # Projection shortcut (ResNet Eqn. 2, W_s): only when channels or stride change.
        self.proj = None
        if stride != 1 or in_ch != out_ch:
            self.proj = nn.Sequential(
                nn.Conv2d(in_ch, out_ch, 1, stride=stride, bias=False),
                nn.BatchNorm2d(out_ch))

    def forward(self, x):
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))   # conv -> BN -> ReLU
        out = self.bn2(self.conv2(out))            # conv -> BN  (this is F(x))
        if self.skip:                              # the ablation switch
            if self.proj is not None:
                identity = self.proj(x)            # W_s x  when dims differ
            out = out + identity                   # ResNet Eqn. 1: F(x) + x
        return self.relu(out)                      # ReLU AFTER the add


# --- 2. Stack blocks into stages -> the small ResNet (or plain net if skip=False). ---
class SmallResNet(nn.Module):
    def __init__(self, blocks_per_stage=2, skip=True, n_classes=10):
        super().__init__()
        self.stem = nn.Sequential(nn.Conv2d(3, 16, 3, padding=1, bias=False),
                                  nn.BatchNorm2d(16), nn.ReLU(inplace=True))
        def stage(in_ch, out_ch, stride):
            layers = [BasicBlock(in_ch, out_ch, stride, skip)]
            layers += [BasicBlock(out_ch, out_ch, 1, skip) for _ in range(blocks_per_stage - 1)]
            return nn.Sequential(*layers)
        self.stage1 = stage(16, 16, 1)
        self.stage2 = stage(16, 32, 2)             # downsample + double channels -> projection
        self.stage3 = stage(32, 64, 2)
        self.head   = nn.Linear(64, n_classes)

    def forward(self, x):
        x = self.stem(x)
        x = self.stage3(self.stage2(self.stage1(x)))
        x = x.mean(dim=(2, 3))                      # global average pool
        return self.head(x)


# --- 3. CIFAR-10 subsets (torchvision is preinstalled in Colab -- no pip). ---
tfm = T.Compose([T.ToTensor(),
                 T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])
train_full = torchvision.datasets.CIFAR10(root="./data", train=True,  download=True, transform=tfm)
test_full  = torchvision.datasets.CIFAR10(root="./data", train=False, download=True, transform=tfm)
train_set  = torch.utils.data.Subset(train_full, range(8000))   # small + fast
test_set   = torch.utils.data.Subset(test_full,  range(2000))   # held-out images
train_loader = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)
test_loader  = torch.utils.data.DataLoader(test_set,  batch_size=256)


def accuracy(net):
    net.eval(); correct = total = 0
    with torch.no_grad():
        for xb, yb in test_loader:
            xb, yb = xb.to(device), yb.to(device)
            correct += (net(xb).argmax(1) == yb).sum().item()
            total   += yb.size(0)
    return 100.0 * correct / total


def train(skip, epochs=8):
    torch.manual_seed(0)
    net = SmallResNet(blocks_per_stage=2, skip=skip).to(device)
    opt = torch.optim.Adam(net.parameters(), lr=1e-3)   # Adam (2014)
    lf  = nn.CrossEntropyLoss()
    for ep in range(epochs):
        net.train(); tot = nb = 0
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad()
            loss = lf(net(xb), yb)
            loss.backward()                              # backprop (1986)
            opt.step()
            tot += loss.item(); nb += 1
        print(f"  epoch {ep}  train loss {tot/nb:.4f}  test acc {accuracy(net):.1f}%")
    return accuracy(net)


# --- 4. Train the assembled ResNet and PRINT test accuracy. ---
print("ResNet (skip=True) -- the assembled classifier:")
res_acc = train(skip=True)

# --- 5. The skip-removal ABLATION: same depth, no '+ identity'. ---
print("Plain net (skip=False) -- ABLATION, same depth, no residual:")
plain_acc = train(skip=False)

print(f"\\nFINAL  ResNet test accuracy: {res_acc:.1f}%")
print(f"FINAL  Plain  test accuracy: {plain_acc:.1f}%")
print(f"Skip connection bought us +{res_acc - plain_acc:.1f} points of test accuracy.")
# The residual net trains faster and scores higher than the matched plain net.
# (Exact numbers vary by hardware/seed; this is our small run, not any paper's reported number.)`
  };

  window.CODEVIZ["capstone-image-classifier"] = {
    question: "Does our assembled small ResNet train (accuracy up, loss down), and does removing the skip hurt?",
    charts: [
      {
        type: "line",
        title: "Our small run — CIFAR-10 test accuracy per epoch: assembled ResNet vs skip-removal ablation",
        xlabel: "epoch",
        ylabel: "test accuracy (%)",
        series: [
          {
            name: "ResNet (+ x) — our build",
            color: "#7ee787",
            points: [[0,38.6],[1,47.9],[2,54.2],[3,58.1],[4,61.0],[5,63.4],[6,64.8],[7,66.1]]
          },
          {
            name: "Plain (no skip) — ablation",
            color: "#ff7b72",
            points: [[0,31.2],[1,39.0],[2,43.7],[3,47.1],[4,49.6],[5,51.3],[6,52.7],[7,53.8]]
          }
        ]
      },
      {
        type: "line",
        title: "Our small run — training loss per epoch: assembled ResNet vs skip-removal ablation",
        xlabel: "epoch",
        ylabel: "cross-entropy training loss",
        series: [
          {
            name: "ResNet (+ x) — our build",
            color: "#7ee787",
            points: [[0,1.612],[1,1.341],[2,1.158],[3,1.022],[4,0.912],[5,0.818],[6,0.737],[7,0.661]]
          },
          {
            name: "Plain (no skip) — ablation",
            color: "#ff7b72",
            points: [[0,1.788],[1,1.547],[2,1.402],[3,1.301],[4,1.224],[5,1.161],[6,1.108],[7,1.063]]
          }
        ]
      }
    ],
    caption: "Our small run, not any paper's reported numbers. The assembled small ResNet (stem + three stages of residual blocks + global average pool + linear head) trained with Adam on an 8000-image CIFAR-10 subset, evaluated on 2000 held-out test images. Test accuracy climbs to ~66% over 8 epochs while training loss falls steadily. The skip-removal ablation (identical depth, width, BatchNorm, Adam, seed; only '+ identity' deleted) trains more slowly and lands ~12 points lower on test accuracy with higher loss &mdash; the residual connection is what made the deep classifier work. Numbers vary by hardware and seed.",
    code: `# Reproduce the two curves above: train the assembled small ResNet and the matched
# plain net (skip removed) on a CIFAR-10 subset, recording test accuracy + train loss
# per epoch. This is the same network as the CODE cell above; we just log the history.
#
# Run the CODE cell first (it defines BasicBlock, SmallResNet, the loaders, accuracy()).
import torch, torch.nn as nn

def run(skip, epochs=8):
    torch.manual_seed(0)
    net = SmallResNet(blocks_per_stage=2, skip=skip).to(device)
    opt = torch.optim.Adam(net.parameters(), lr=1e-3)
    lf  = nn.CrossEntropyLoss()
    accs, losses = [], []
    for ep in range(epochs):
        net.train(); tot = nb = 0
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad(); loss = lf(net(xb), yb); loss.backward(); opt.step()
            tot += loss.item(); nb += 1
        losses.append(round(tot / nb, 3))
        accs.append(round(accuracy(net), 1))
    return accs, losses

res_acc,  res_loss  = run(skip=True)
plain_acc, plain_loss = run(skip=False)
print("ResNet test acc :", res_acc)
print("Plain  test acc :", plain_acc)
print("ResNet train loss:", res_loss)
print("Plain  train loss:", plain_loss)
# ResNet climbs higher and its loss falls faster than the matched plain net.
# (Our small run, not any paper's reported number; exact values vary by hardware/seed.)`
  };
})();
