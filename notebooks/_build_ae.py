import json

PATH = "paper-autoencoder.ipynb"
nb = json.load(open(PATH))
orig = nb["cells"]

def md(text):
    lines = text.split("\n")
    src = [l + "\n" for l in lines[:-1]] + [lines[-1]]
    return {"cell_type": "markdown", "metadata": {}, "source": src}

def code(text):
    lines = text.split("\n")
    src = [l + "\n" for l in lines[:-1]] + [lines[-1]]
    return {"cell_type": "code", "metadata": {}, "execution_count": None,
            "outputs": [], "source": src}

cells = []

# cell 0: title/intro markdown — keep, lightly warm final paragraph
intro = orig[0]
intro_text = "".join(intro["source"])
old_final = "This notebook is a practice scaffold for the **Deep Autoencoder — Reducing the Dimensionality of Data with Neural Networks (2006)** lesson. Run the cells, then tackle the practice problems at the bottom. _Save a copy to your Drive (File → Save a copy in Drive) to edit and keep your work._"
new_final = "This notebook builds the deep autoencoder one step at a time: define the bottleneck network, train it to rebuild its own input, then compare its 2-D code against PCA's. Run each cell, read the note above it, then tackle the practice problems at the bottom. _Save a copy to your Drive (File → Save a copy in Drive) to edit and keep your work._"
assert old_final in intro_text, "intro final paragraph not found"
intro_text = intro_text.replace(old_final, new_final)
cells.append(md(intro_text))

# cell 1: setup — split combined import onto separate lines
cells.append(code(
"""# Setup — numpy / pandas / scikit-learn / matplotlib ship with Colab.
import numpy as np
import matplotlib.pyplot as plt"""))

# cells 2,3: "## First, look at the data" markdown + code — KEEP EXACTLY
cells.append(orig[2])
cells.append(orig[3])

# cell 4: "## Reference implementation — PyTorch" markdown — keep heading
cells.append(orig[4])

# Now de-densify the big reference implementation (orig cell 5) into steps.

cells.append(md(
"""### Step 1 — Set up PyTorch and check the reconstruction loss

An autoencoder is trained to **rebuild its own input**, so the loss is just how far the reconstruction lands from the original. Here we warm up on a 4-pixel toy image to make that loss concrete: sum the squared per-pixel errors, then average them to get the mean squared error (MSE). This is the exact quantity the network will minimize on real images."""))

cells.append(code(
"""import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import torchvision
import torchvision.transforms as T

torch.manual_seed(0)
np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Sanity-check the worked example: reconstruction MSE on a 4-pixel toy image.
x_toy  = torch.tensor([1.0, 0.0, 0.8, 0.2])
xh_toy = torch.tensor([0.9, 0.1, 0.6, 0.2])

squared_errors = (x_toy - xh_toy) ** 2
sse = squared_errors.sum()    # sum of squared errors
mse = squared_errors.mean()   # mean over the 4 pixels

print("worked example:  sum of squared errors =", round(sse.item(), 4),
      " MSE =", round(mse.item(), 4))
# worked example:  sum of squared errors = 0.06   MSE = 0.015"""))

cells.append(md(
"""### Step 2 — Define the deep autoencoder and load MNIST

The network funnels 784 pixels down through hidden layers to a **2-number bottleneck code**, then expands back out to 784 pixels. That narrow middle forces the network to keep only the most informative structure. The `linear` switch swaps every ReLU for an identity — an ablation that turns the autoencoder into plain PCA. We then load a 6000-image MNIST subset, flattened to 784-dim vectors in `[0, 1]`; the labels are kept only for plotting and evaluation, never for training."""))

cells.append(code(
"""# The deep autoencoder: encoder -> 2-D code (bottleneck) -> decoder.
class AutoEncoder(nn.Module):
    def __init__(self, code=2, linear=False):      # linear=True -> ablation (= PCA)
        super().__init__()
        act = nn.Identity if linear else nn.ReLU   # remove nonlinearity for the ablation
        self.enc = nn.Sequential(
            nn.Linear(784, 256), act(),
            nn.Linear(256, 64), act(),
            nn.Linear(64, code),
        )
        self.dec = nn.Sequential(
            nn.Linear(code, 64), act(),
            nn.Linear(64, 256), act(),
            nn.Linear(256, 784), nn.Sigmoid(),
        )

    def encode(self, x):
        return self.enc(x)                         # the low-dimensional code z

    def forward(self, x):
        z = self.enc(x)
        return self.dec(z)                         # reconstruction x-hat


# An MNIST subset (torchvision, preinstalled). Flatten to 784, values in [0,1].
tf  = T.Compose([T.ToTensor(), T.Lambda(lambda t: t.view(-1))])
raw = torchvision.datasets.MNIST("./data", train=True, download=True, transform=tf)

idx = np.random.RandomState(0).permutation(len(raw))[:6000]
X   = torch.stack([raw[i][0] for i in idx]).to(device)   # (6000, 784)
y   = torch.tensor([raw[i][1] for i in idx])             # labels: ONLY for plotting/eval"""))

cells.append(md(
"""### Step 3 — Train the autoencoder and build the PCA baseline

Now train the network to reconstruct each batch, minimizing the MSE between input and output — notice the loss is computed against the **input itself**, never a label. Once trained, the encoder turns each image into a 2-D code. For comparison we compute PCA's first two principal components on the same centered images; that linear projection is the classic baseline the paper aims to beat."""))

cells.append(code(
"""def train_ae(linear=False, epochs=40, lr=1e-3):
    torch.manual_seed(0)
    ae = AutoEncoder(code=2, linear=linear).to(device)
    opt = torch.optim.Adam(ae.parameters(), lr=lr)
    loss_fn = nn.MSELoss()
    ae.train()
    B = 256
    for ep in range(epochs):
        perm = torch.randperm(len(X))
        tot = 0.0
        nb = 0
        for s in range(0, len(X), B):
            xb = X[perm[s:s+B]]
            xh = ae(xb)
            loss = loss_fn(xh, xb)                 # reconstruct the INPUT (no label)
            opt.zero_grad()
            loss.backward()
            opt.step()
            tot += loss.item()
            nb += 1
        if ep % 10 == 0:
            print(f"  epoch {ep:2d}  recon MSE {tot/nb:.4f}")
    return ae

print("=== train deep (nonlinear) autoencoder ===")
ae = train_ae(linear=False)
with torch.no_grad():
    Z_ae = ae.encode(X).cpu().numpy()             # 2-D autoencoder codes

# PCA baseline: first two principal components of the SAME flattened images.
Xc = (X - X.mean(0)).cpu()
U, S, V = torch.pca_lowrank(Xc, q=2)
Z_pca = (Xc @ V).numpy()                          # 2-D PCA embedding"""))

cells.append(md(
"""### Step 4 — Measure separation and run the linear ablation

How "good" is each 2-D code? We score it by how well a simple 15-nearest-neighbor classifier separates the digit classes using only those two numbers. The nonlinear autoencoder code should score higher than PCA. Finally, retrain a **linear** autoencoder: with the nonlinearity removed it can only span a flat subspace, so its score should collapse back to PCA's — exactly the paper's claim in reverse."""))

cells.append(code(
"""def knn_acc(Z, y, k=15):                          # 1-fold k-NN accuracy on the 2-D code
    Z = torch.tensor(Z, dtype=torch.float32)
    g = np.random.RandomState(0).permutation(len(y))
    tr, te = g[:5000], g[5000:]
    d = torch.cdist(Z[te], Z[tr])                 # distances test->train
    nn_idx = d.topk(k, largest=False).indices     # k nearest train points
    votes = y[tr][nn_idx]
    pred = torch.mode(votes, dim=1).values
    return (pred == y[te]).float().mean().item()

acc_ae  = knn_acc(Z_ae,  y)
acc_pca = knn_acc(Z_pca, y)
print("2-D code class separation (15-NN accuracy):")
print(f"  autoencoder (nonlinear): {acc_ae:.3f}")
print(f"  PCA (linear, 2 comp):    {acc_pca:.3f}")

# Ablation: linear autoencoder (remove nonlinearity) -> should match PCA.
print("\\n=== ablation: LINEAR autoencoder (no nonlinearity, = PCA) ===")
ae_lin = train_ae(linear=True)
with torch.no_grad():
    Z_lin = ae_lin.encode(X).cpu().numpy()
print(f"  linear-AE 2-D code 15-NN accuracy: {knn_acc(Z_lin, y):.3f} (~ PCA level)")
# The nonlinear autoencoder's 2-D code separates digits better than PCA's first 2 components
# (Fig. 3); removing the nonlinearity collapses it back to ~PCA.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)"""))

# cell 6: "## Visualize the data & results" markdown — keep
cells.append(orig[6])

# De-densify the visualization cell (orig cell 7) into steps.
cells.append(md(
"""### Step 1 — Rebuild the model and data for a self-contained run

This visualization cell stands on its own, so it re-imports torch and redefines the same `AutoEncoder`, MNIST loader, and helper functions used above. Re-seeding keeps the run reproducible. Nothing here is new logic — it just repackages Step 2's pieces so the panel can be produced independently."""))

cells.append(code(
"""import torch
import torch.nn as nn
import numpy as np
import torchvision
import torchvision.transforms as T

torch.manual_seed(0)
np.random.seed(0)

# Deep autoencoder 2-D code vs PCA 2-D embedding on an MNIST subset (toy reproduction of Fig. 3),
# plus the linear-autoencoder ablation (= PCA).
class AutoEncoder(nn.Module):
    def __init__(s, code=2, linear=False):
        super().__init__()
        act = nn.Identity if linear else nn.ReLU
        s.enc = nn.Sequential(
            nn.Linear(784, 256), act(),
            nn.Linear(256, 64), act(),
            nn.Linear(64, code),
        )
        s.dec = nn.Sequential(
            nn.Linear(code, 64), act(),
            nn.Linear(64, 256), act(),
            nn.Linear(256, 784), nn.Sigmoid(),
        )

    def encode(s, x):
        return s.enc(x)

    def forward(s, x):
        return s.dec(s.enc(x))

tf  = T.Compose([T.ToTensor(), T.Lambda(lambda t: t.view(-1))])
raw = torchvision.datasets.MNIST("./data", train=True, download=True, transform=tf)
idx = np.random.RandomState(0).permutation(len(raw))[:6000]
X = torch.stack([raw[i][0] for i in idx])
y = torch.tensor([raw[i][1] for i in idx])"""))

cells.append(md(
"""### Step 2 — Train both autoencoders and the PCA embedding

Define the training loop and the 15-NN separation metric, then produce three 2-D embeddings: the nonlinear autoencoder code, the linear-autoencoder code (the ablation), and PCA's first two components. These are the same computations as the reference cell, gathered here so the next step can score them side by side."""))

cells.append(code(
"""def train_ae(linear=False, epochs=40):
    torch.manual_seed(0)
    ae = AutoEncoder(linear=linear)
    opt = torch.optim.Adam(ae.parameters(), lr=1e-3)
    loss_fn = nn.MSELoss()
    ae.train()
    B = 256
    for ep in range(epochs):
        perm = torch.randperm(len(X))
        for s0 in range(0, len(X), B):
            xb = X[perm[s0:s0+B]]
            loss = loss_fn(ae(xb), xb)
            opt.zero_grad()
            loss.backward()
            opt.step()
    return ae

def knn_acc(Z, y, k=15):
    Z = torch.tensor(np.asarray(Z), dtype=torch.float32)
    g = np.random.RandomState(0).permutation(len(y))
    tr, te = g[:5000], g[5000:]
    d = torch.cdist(Z[te], Z[tr])
    nn_idx = d.topk(k, largest=False).indices
    pred = torch.mode(y[tr][nn_idx], dim=1).values
    return round((pred == y[te]).float().mean().item(), 3)

ae = train_ae(linear=False)
with torch.no_grad():
    Z_ae = ae.encode(X).numpy()

Xc = X - X.mean(0)
U, S, V = torch.pca_lowrank(Xc, q=2)
Z_pca = (Xc @ V).numpy()

ae_lin = train_ae(linear=True)
with torch.no_grad():
    Z_lin = ae_lin.encode(X).numpy()"""))

cells.append(md(
"""### Step 3 — Compare the three codes

Print the 15-NN class-separation accuracy for each embedding. The nonlinear autoencoder code should separate the digits best; the linear autoencoder should fall back to roughly PCA's level — confirming the nonlinearity is what buys the advantage."""))

cells.append(code(
"""print("autoencoder (nonlinear) 2-D code 15-NN acc:", knn_acc(Z_ae,  y))
print("linear autoencoder (ablation, = PCA)      :", knn_acc(Z_lin, y))
print("PCA (first 2 components)                  :", knn_acc(Z_pca, y))
# Nonlinear autoencoder 2-D code separates digits better than PCA; linear AE collapses to ~PCA."""))

# Practice section + all problem/solution cells (orig 8..17) — KEEP EXACTLY
cells.extend(orig[8:])

nb["cells"] = cells
nb["metadata"]["enhanced_walkthrough"] = True
json.dump(nb, open(PATH, "w"), indent=1, ensure_ascii=False)
print("wrote", PATH, "cells:", len(cells))
