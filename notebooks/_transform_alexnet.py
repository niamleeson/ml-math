import json

PATH = "/Users/jaykim/workspace/ml-math-tutor/notebooks/paper-alexnet.ipynb"
nb = json.load(open(PATH))
orig = nb["cells"]


def md(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text.splitlines(keepends=True)}


def code(text):
    return {"cell_type": "code", "metadata": {}, "execution_count": None,
            "outputs": [], "source": text.splitlines(keepends=True)}


cells = []

# --- cell 0: title/intro -- keep headings + Save-a-copy line, lightly warm final paragraph ---
cells.append(md(
    "# AlexNet — ImageNet Classification with Deep Convolutional Neural Networks (2012)\n"
    "\n"
    "_Papers · Computer Vision_\n"
    "\n"
    "**A deep CNN with ReLU, dropout, data augmentation and GPU training crushed ImageNet and launched the deep-learning era.**\n"
    "\n"
    "---\n"
    "\n"
    "This notebook is a practice scaffold for the **AlexNet — ImageNet Classification with Deep Convolutional Neural Networks (2012)** lesson. We build it up one step at a time: recompute the conv-output-size formula, assemble a scaled-down AlexNet, train it on a CIFAR-10 subset, and run the ReLU-vs-tanh ablation. Run each cell, read the note above it, then tackle the practice problems at the bottom. _Save a copy to your Drive (File → Save a copy in Drive) to edit and keep your work._"
))

# --- setup cell: split combined import ---
cells.append(code(
    "# Setup — numpy / pandas / scikit-learn / matplotlib ship with Colab.\n"
    "import numpy as np\n"
    "import matplotlib.pyplot as plt"
))

# --- data preview (orig cells 2 and 3) -- KEEP EXACTLY ---
cells.append(orig[2])
cells.append(orig[3])

# --- Reference implementation header (orig cell 4) ---
cells.append(md(
    "## Reference implementation — PyTorch\n"
    "\n"
    "We build it in four steps: (1) recompute the conv-output-size formula on the paper's conv1, "
    "(2) define a scaled-down AlexNet for 32x32 CIFAR-10, (3) set up the data and a training/eval "
    "loop, and (4) run the ReLU-vs-tanh ablation that shows why ReLU trains faster."
))

# === Step 1: conv output size formula ===
cells.append(md(
    "### Step 1 — Recompute the conv-output-size formula\n"
    "\n"
    "A convolution turns a $W\\times W$ input into $O\\times O$ where "
    "$O = \\lfloor (W - K + 2P)/S \\rfloor + 1$ for kernel $K$, stride $S$, padding $P$. We apply it "
    "to AlexNet's first layer. The paper's text says a 224-input gives 54, but reading Figure 2 with "
    "a 227 input gives the more commonly cited 55 — both are just this formula with different inputs."
))
cells.append(code(
    "import torch\n"
    "import torch.nn as nn\n"
    "import torchvision\n"
    "import torchvision.transforms as T\n"
    "\n"
    "torch.manual_seed(0)\n"
    "\n"
    "# Recompute the worked example: conv output size O = floor((W - K + 2P)/S) + 1.\n"
    "def conv_out(W, K, S, P):\n"
    "    return (W - K + 2 * P) // S + 1\n"
    "\n"
    "print(\"conv1, paper numbers (W=224, K=11, S=4, P=0):\", conv_out(224, 11, 4, 0))   # -> 54\n"
    "print(\"conv1, paper Fig.2 reading (W=227, K=11, S=4, P=0):\", conv_out(227, 11, 4, 0))  # -> 55\n"
    "# 54x54x96 with the clean no-pad 224 input; 55 with the 227/padded reading the figure uses."
))

# === Step 2: define the network ===
cells.append(md(
    "### Step 2 — Define a scaled-down AlexNet\n"
    "\n"
    "AlexNet stacks 5 convolutional layers (a feature extractor) followed by 3 fully-connected "
    "layers (a classifier), with ReLU activations and dropout in the FC layers (§ 4.2). We shrink it "
    "to fit 32x32 CIFAR-10 images. The `act` argument swaps the activation, which is the lever for "
    "the ReLU-vs-tanh ablation later."
))
cells.append(code(
    "# A scaled-down AlexNet for 32x32 CIFAR-10: 5 conv + 3 FC, ReLU, dropout.\n"
    "class TinyAlexNet(nn.Module):\n"
    "    def __init__(self, n_classes=10, act=\"relu\"):\n"
    "        super().__init__()\n"
    "        Act = nn.ReLU if act == \"relu\" else nn.Tanh   # the ablation switch\n"
    "        self.features = nn.Sequential(\n"
    "            nn.Conv2d(3,   32, 3, padding=1), Act(), nn.MaxPool2d(2),   # 32x32 -> 16x16\n"
    "            nn.Conv2d(32,  64, 3, padding=1), Act(), nn.MaxPool2d(2),   # 16x16 -> 8x8\n"
    "            nn.Conv2d(64, 128, 3, padding=1), Act(),                    # conv 3 (no pool)\n"
    "            nn.Conv2d(128,128, 3, padding=1), Act(),                    # conv 4 (no pool)\n"
    "            nn.Conv2d(128, 64, 3, padding=1), Act(), nn.MaxPool2d(2),   # 8x8 -> 4x4  (conv 5)\n"
    "        )\n"
    "        # After features: 64 channels x 4 x 4 = 1024 features.\n"
    "        self.classifier = nn.Sequential(\n"
    "            nn.Dropout(0.5), nn.Linear(64 * 4 * 4, 256), Act(),        # FC1  (dropout, §4.2)\n"
    "            nn.Dropout(0.5), nn.Linear(256, 128),        Act(),        # FC2  (dropout)\n"
    "            nn.Linear(128, n_classes),                                 # FC3 -> 10 logits\n"
    "        )\n"
    "\n"
    "    def forward(self, x):\n"
    "        x = self.features(x)\n"
    "        x = torch.flatten(x, 1)\n"
    "        return self.classifier(x)"
))

# === Step 3: data + train/eval loop ===
cells.append(md(
    "### Step 3 — Load CIFAR-10 and set up a train/eval loop\n"
    "\n"
    "We use a small CIFAR-10 subset with light augmentation (random crop + horizontal flip, echoing "
    "§ 4.1) so training is fast. The `run` function trains for a few epochs, then evaluates test "
    "accuracy with `net.eval()` — which switches dropout OFF for deterministic inference, a common "
    "pitfall if forgotten."
))
cells.append(code(
    "# A CIFAR-10 subset with light augmentation (random crop + h-flip, echoing §4.1).\n"
    "train_tfm = T.Compose([T.RandomCrop(32, padding=4), T.RandomHorizontalFlip(),\n"
    "                       T.ToTensor(),\n"
    "                       T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])\n"
    "test_tfm  = T.Compose([T.ToTensor(),\n"
    "                       T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])\n"
    "\n"
    "train_full = torchvision.datasets.CIFAR10(\"./data\", train=True,  download=True, transform=train_tfm)\n"
    "test_full  = torchvision.datasets.CIFAR10(\"./data\", train=False, download=True, transform=test_tfm)\n"
    "train_set  = torch.utils.data.Subset(train_full, range(5000))   # small + fast\n"
    "test_set   = torch.utils.data.Subset(test_full,  range(2000))\n"
    "train_ld   = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)\n"
    "test_ld    = torch.utils.data.DataLoader(test_set,  batch_size=256)\n"
    "device     = \"cuda\" if torch.cuda.is_available() else \"cpu\"\n"
    "\n"
    "\n"
    "def run(act=\"relu\", epochs=5):\n"
    "    torch.manual_seed(0)\n"
    "    net = TinyAlexNet(act=act).to(device)\n"
    "    opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9, weight_decay=5e-4)\n"
    "    lf  = nn.CrossEntropyLoss()\n"
    "    curve = []\n"
    "    for ep in range(epochs):\n"
    "        net.train(); tot = 0.0; nb = 0\n"
    "        for xb, yb in train_ld:\n"
    "            xb, yb = xb.to(device), yb.to(device)\n"
    "            opt.zero_grad(); loss = lf(net(xb), yb); loss.backward(); opt.step()\n"
    "            tot += loss.item(); nb += 1\n"
    "        curve.append(tot / nb)\n"
    "        print(f\"  [{act}] epoch {ep}  train loss {curve[-1]:.4f}\")\n"
    "    # Test accuracy (net.eval() turns dropout OFF -- §4.2 / common pitfall).\n"
    "    net.eval(); correct = 0; total = 0\n"
    "    with torch.no_grad():\n"
    "        for xb, yb in test_ld:\n"
    "            xb, yb = xb.to(device), yb.to(device)\n"
    "            pred = net(xb).argmax(1)\n"
    "            correct += (pred == yb).sum().item(); total += yb.size(0)\n"
    "    acc = correct / total\n"
    "    print(f\"  [{act}] TEST ACCURACY on 2000 CIFAR-10 images: {acc:.3f}\")\n"
    "    return curve, acc"
))

# === Step 4: ReLU vs tanh ablation ===
cells.append(md(
    "### Step 4 — Run the ReLU-vs-tanh ablation\n"
    "\n"
    "We train the same architecture twice, changing only the activation. ReLU's non-saturating "
    "positive region keeps gradients flowing, so its loss should drop faster and usually end with "
    "higher test accuracy than tanh — the paper's § 3.1 claim, reproduced on a small run."
))
cells.append(code(
    "print(\"\\nTraining scaled-down AlexNet (ReLU):\")\n"
    "relu_curve, relu_acc = run(\"relu\")\n"
    "\n"
    "# Ablation: same net with tanh instead of ReLU -- ReLU should train faster (§3.1).\n"
    "print(\"\\nABLATION -- same architecture with tanh:\")\n"
    "tanh_curve, tanh_acc = run(\"tanh\")\n"
    "\n"
    "print(\"\\nReLU train loss/epoch:\", [round(c, 3) for c in relu_curve], \" test acc:\", round(relu_acc, 3))\n"
    "print(\"tanh train loss/epoch:\", [round(c, 3) for c in tanh_curve], \" test acc:\", round(tanh_acc, 3))\n"
    "# ReLU's loss drops faster and usually ends with higher test accuracy.\n"
    "# (Exact numbers vary by hardware/seed; this is OUR small run, NOT the paper's reported ImageNet result.)"
))

# === Visualization section (orig cells 6 header, 7 code) ===
cells.append(orig[6])
# orig cell 7 is short (re-runs run() twice and prints). Split into 2 steps.
cells.append(md(
    "### Step 1 — Re-run both activations\n"
    "\n"
    "Using the same `run` helper, we retrain the ReLU and tanh nets and keep their per-epoch loss "
    "curves. Everything (architecture, optimizer, data subset, seed) is identical except the "
    "activation, so the curves isolate its effect."
))
cells.append(code(
    "# Reproduce the ReLU-vs-tanh training-speed contrast.\n"
    "# (Same TinyAlexNet + CIFAR-10 subset as above; run() returns the loss curve.)\n"
    "relu_curve, _ = run(\"relu\", epochs=5)\n"
    "tanh_curve, _ = run(\"tanh\", epochs=5)"
))
cells.append(md(
    "### Step 2 — Compare the loss curves epoch by epoch\n"
    "\n"
    "We print the two losses side by side at each epoch. ReLU's curve should sit below tanh's at "
    "every epoch — the visible signature of faster training. These are our small-run numbers, not "
    "the paper's reported result."
))
cells.append(code(
    "for ep in range(5):\n"
    "    print(f\"epoch {ep}:  ReLU {relu_curve[ep]:.3f}   tanh {tanh_curve[ep]:.3f}\")\n"
    "# ReLU's curve sits below tanh's at every epoch -- our small run, not the paper's reported result."
))

# === Practice section (orig cells 8..17) -- keep exactly ===
for c in orig[8:]:
    cells.append(c)

nb["cells"] = cells
nb["metadata"]["enhanced_walkthrough"] = True

json.dump(nb, open(PATH, "w"), indent=1)
print("wrote", len(cells), "cells")
