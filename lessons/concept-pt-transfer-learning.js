/* =====================================================================
   PyTorch (a complete course) — Transfer learning with torchvision.models.
   id: pt-transfer-learning
   Self-contained lesson: window.LESSONS / window.CODE / window.CODEVIZ.
   CODE is real PyTorch + torchvision meant to run in Google Colab
   (torch/torchvision preinstalled; runnable:false here).
   CODEVIZ numbers are computed for real (scikit-learn on Olivetti faces:
   frozen learned features vs raw pixels across tiny label budgets).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "pt-transfer-learning",
    title: "Transfer learning with torchvision.models",
    tagline: "Start from a model pretrained on millions of images, then teach it your task with very little data.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-tensors", "pt-tensor-ops", "dl-optimizers", "fs-transfer-learning", "fe-deep-learning-features"],
    whenToUse: `<p>Reach for transfer learning whenever a good pretrained model already exists for your kind of data — which, for images, is almost always.</p>
<ul>
<li><b>Small labeled datasets.</b> You have hundreds or a few thousand labeled examples, not millions. Training a deep network from random weights would overfit; a pretrained one already knows edges, textures, and shapes.</li>
<li><b>Limited compute or time.</b> You want a strong result in minutes on one GPU (Graphics Processing Unit), not days on a cluster.</li>
<li><b>A good backbone exists.</b> For natural images, <code>torchvision.models</code> ships networks pretrained on ImageNet (a dataset of ~1.2 million labeled photos). For text you would reach for pretrained transformers instead.</li>
</ul>
<p>This is the <b>default</b> for most vision tasks. Training from scratch is the exception, reserved for when your data looks nothing like anything a pretrained model has seen, or when you genuinely have a huge labeled dataset.</p>
<p>The idea — reusing learned representations across tasks — is the concept lesson <i>fs-transfer-learning</i>; why a deep network's inner layers make such good general features is <i>fe-deep-learning-features</i>. This lesson is the <b>HOW</b> in PyTorch.</p>`,
    application: `<p>Almost every applied computer-vision project starts here: classifying product photos, grading medical scans, sorting defects on a production line, recognizing species in camera-trap images. You download a pretrained <code>resnet</code>, swap its final layer for one sized to your classes, and fine-tune. Teams ship useful models from a few hundred labeled images this way.</p>`,
    pitfalls: `<ul>
<li><b>Forgetting to FREEZE.</b> If you skip setting <code>param.requires_grad = False</code> on the backbone, every weight updates and you are effectively training from scratch — slow, and prone to overfitting on small data. Freeze first, then unfreeze deliberately.</li>
<li><b>Passing ALL params to the optimizer when you meant only the head.</b> <code>optim.SGD(model.parameters(), ...)</code> hands the optimizer the whole network. In feature-extraction mode you want <code>optim.SGD(model.fc.parameters(), ...)</code> — only the new head. (Freezing alone stops gradients, but giving the optimizer the frozen params is still wasteful and a common source of confusion.)</li>
<li><b>Not using the model's expected transforms.</b> A pretrained model was trained on inputs resized and normalized a specific way. Feed it differently-scaled pixels and accuracy collapses. Use <code>weights.transforms()</code> — it returns the exact resize/crop/normalize pipeline the weights expect.</li>
<li><b>Too-high learning rate when fine-tuning.</b> The pretrained weights are already good. A large learning rate takes big steps and destroys them before they can adapt. Fine-tune the backbone with a <b>small</b> learning rate (e.g. $1\\times10^{-4}$ to $1\\times10^{-5}$), often smaller than the head's.</li>
<li><b>Wrong number of output classes in the new head.</b> The new <code>nn.Linear</code> must output exactly your number of classes. ImageNet's head outputs 1000; if your task has 5 classes the head must be <code>nn.Linear(in_features, 5)</code>.</li>
<li><b>Forgetting <code>model.eval()</code> when feature-extracting.</b> Batch normalization layers behave differently in train vs eval mode. When the backbone is frozen, run it in <code>eval()</code> so its batchnorm uses the stored running statistics instead of recomputing them from your tiny batches. Switch back to <code>train()</code> only for the parts you are actually training.</li>
<li><b>Forgetting <code>optimizer.zero_grad()</code>.</b> The classic PyTorch gotcha that bites here too: gradients accumulate across steps unless you zero them each iteration.</li>
</ul>`,
    bigIdea: `<p>A deep image network learns its features in layers: early layers detect edges and colors, middle layers detect textures and parts, late layers detect whole objects. The early and middle features are <b>generic</b> — useful for almost any image task. Transfer learning keeps those learned layers (the <b>backbone</b>) and only replaces the last layer (the <b>head</b>) that maps features to your specific classes.</p>`,
    buildup: `<p>There are two modes, on a spectrum from "reuse everything" to "adapt everything":</p>
<ul>
<li><b>Feature extraction.</b> <i>Freeze</i> the entire backbone (set <code>requires_grad = False</code> on its parameters). Replace the final layer with a fresh <code>nn.Linear</code> sized to your classes. Train <b>only the head</b>. The backbone acts as a fixed feature extractor; you are just fitting a small classifier on top. Fast, very label-efficient, the right first try on small data.</li>
<li><b>Fine-tuning.</b> <i>Unfreeze</i> some or all of the backbone and train it too, but with a <b>small learning rate</b> so the good pretrained weights only adjust gently to your data. More capacity to adapt, needs a bit more data and care. Often done as a second phase: train the head first, then unfreeze and fine-tune the whole thing at a low rate.</li>
</ul>
<p>Two practical pieces tie it together: use <code>weights.transforms()</code> so inputs match what the model expects, and give the optimizer <b>only the parameters you intend to train</b>.</p>`,
    symbols: [],
    derivation: `<p><b>The mechanism, step by step.</b></p>
<ul>
<li><b>Load pretrained.</b> <code>torchvision.models.resnet18(weights=ResNet18_Weights.DEFAULT)</code> downloads the architecture <i>and</i> a set of weights trained on ImageNet. The <code>weights</code> object also carries metadata: the class names it was trained on and, crucially, <code>weights.transforms()</code>.</li>
<li><b>Freeze the backbone.</b> Looping <code>for p in model.parameters(): p.requires_grad = False</code> tells autograd not to compute or store gradients for those tensors. They become constants during backprop (the backward pass — see <i>dl-optimizers</i> for the update they would otherwise get).</li>
<li><b>Swap the head.</b> In a ResNet the final layer is <code>model.fc</code>, an <code>nn.Linear(512, 1000)</code>. You read its input size with <code>model.fc.in_features</code> and assign a brand-new <code>model.fc = nn.Linear(512, num_classes)</code>. The new layer is created with <code>requires_grad = True</code> by default, so only it will train.</li>
<li><b>Optimizer sees only the head.</b> <code>optim.SGD(model.fc.parameters(), lr=...)</code> — the optimizer's update step touches only the parameters you handed it. Hand it the frozen backbone and it would do nothing useful (no gradients) while wasting bookkeeping.</li>
<li><b>Fine-tune later.</b> To fine-tune, set <code>requires_grad = True</code> again on the layers you want to adapt and rebuild the optimizer over those parameters with a <b>small</b> learning rate.</li>
</ul>`,
    example: `<p>Suppose you have 5 classes of flower photos and ~300 labeled images.</p>
<ol>
<li>Load <code>resnet18</code> with default weights; grab <code>tf = weights.transforms()</code>.</li>
<li>Freeze all parameters.</li>
<li><code>model.fc</code> is <code>nn.Linear(512, 1000)</code>; replace it with <code>nn.Linear(512, 5)</code>.</li>
<li>Optimizer over <code>model.fc.parameters()</code> only, learning rate <code>1e-3</code>.</li>
<li>Run <code>model.eval()</code> on the backbone (so batchnorm uses stored stats) and train the head for a few epochs. You will likely hit strong accuracy fast.</li>
<li>Optional phase two: unfreeze the last block, learning rate <code>1e-4</code>, train a little more.</li>
</ol>`,
    practice: [
      {
        q: `You load a pretrained <code>resnet18</code>, replace <code>model.fc</code> with <code>nn.Linear(512, 3)</code>, and create <code>optim.Adam(model.parameters(), lr=1e-3)</code>. Training is slow and the model overfits your 200 images. You intended feature extraction. What two things are wrong?`,
        steps: [
          { do: `Check whether the backbone was frozen.`, why: `Nothing set <code>requires_grad = False</code>, so every layer is still trainable.` },
          { do: `Check what you handed the optimizer.`, why: `<code>model.parameters()</code> is the whole network, not just the head.` }
        ],
        answer: `Two fixes. First, freeze the backbone: <code>for p in model.parameters(): p.requires_grad = False</code> <b>before</b> swapping the head (the new head is created trainable). Second, give the optimizer only the head: <code>optim.Adam(model.fc.parameters(), lr=1e-3)</code>. Now you train a small classifier on fixed features — fast and far less prone to overfitting on 200 images.`
      },
      {
        q: `Your transfer model trains fine but test accuracy is far worse than expected. You loaded the weights correctly and the head is the right size. You preprocessed images by simply dividing pixel values by 255. What is the likely cause?`,
        steps: [
          { do: `Recall how the pretrained model was trained.`, why: `It expects a specific resize, crop, and per-channel normalization.` },
          { do: `Compare your preprocessing to the model's expected transforms.`, why: `Dividing by 255 is not the ImageNet normalization the weights were trained with.` }
        ],
        answer: `You skipped the model's expected input transforms. Use <code>tf = weights.transforms()</code> and apply it to every image. It does the right resize/center-crop and subtracts the ImageNet per-channel mean and divides by its standard deviation — the exact distribution the weights expect. Mismatched normalization shifts the inputs off the manifold the network learned, so accuracy drops.`
      },
      {
        q: `After training the head, you unfreeze the whole backbone and continue with learning rate <code>1e-2</code>. Accuracy suddenly gets much worse. Why, and what should you do?`,
        steps: [
          { do: `Think about how big each gradient step is at <code>lr = 1e-2</code>.`, why: `That is a large step for weights that are already near-optimal.` },
          { do: `Consider what large updates do to pretrained weights.`, why: `They overwrite the useful features before the model can gently adapt.` }
        ],
        answer: `The learning rate is too high for fine-tuning. The pretrained weights are already good, so big steps wreck them. Drop to a small rate like <code>1e-4</code> or <code>1e-5</code> (often smaller than the head's rate) so the backbone adapts gently. A common pattern is two phases: train the head at a moderate rate, then unfreeze and fine-tune everything at a much lower rate.`
      }
    ]
  });

  window.CODE["pt-transfer-learning"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>This runs in Google Colab (torch and torchvision are preinstalled). It loads a <code>resnet18</code> pretrained on ImageNet, grabs the exact input transforms the weights expect, freezes the backbone, swaps <code>model.fc</code> for a new head sized to our classes, hands the optimizer <b>only</b> the head's parameters, and runs a short training loop on a tiny synthetic batch (so it runs anywhere, even without a real dataset). The last block shows how to switch to full fine-tuning with a small learning rate. Replace the synthetic data with a real <code>ImageFolder</code> + <code>DataLoader</code> for an actual task.</p>`,
    code: `import torch
import torch.nn as nn
import torch.optim as optim
from torchvision.models import resnet18, ResNet18_Weights

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

NUM_CLASSES = 5   # <- your number of classes

# ---- 1. LOAD A PRETRAINED MODEL ----
weights = ResNet18_Weights.DEFAULT          # best available ImageNet weights
model = resnet18(weights=weights)           # downloads architecture + trained weights

# The weights object carries the EXACT preprocessing the model expects.
# Apply this to every input image (resize, center-crop, ImageNet normalization).
preprocess = weights.transforms()
print("expected transforms:\\n", preprocess)

# ---- 2. FREEZE THE BACKBONE (feature-extraction mode) ----
for param in model.parameters():
    param.requires_grad = False             # autograd will not update these

# ---- 3. SWAP THE FINAL LAYER FOR A NEW HEAD ----
in_features = model.fc.in_features          # 512 for resnet18
model.fc = nn.Linear(in_features, NUM_CLASSES)   # fresh layer -> requires_grad=True
model = model.to(device)

trainable = [n for n, p in model.named_parameters() if p.requires_grad]
print("trainable parameters:", trainable)   # only 'fc.weight', 'fc.bias'

# ---- 4. OPTIMIZER SEES ONLY THE HEAD ----
optimizer = optim.Adam(model.fc.parameters(), lr=1e-3)   # NOT model.parameters()
criterion = nn.CrossEntropyLoss()           # expects raw logits + class indices

# ---- 5. A SHORT TRAINING LOOP ----
# Tiny synthetic 'dataset' so this runs anywhere. resnet18 wants 3x224x224 inputs.
# In a real project: datasets.ImageFolder(root, transform=preprocess) + DataLoader.
x = torch.randn(16, 3, 224, 224, device=device)         # 16 fake images
y = torch.randint(0, NUM_CLASSES, (16,), device=device) # 16 fake labels

model.eval()        # backbone batchnorm uses stored running stats (frozen)
model.fc.train()    # but the head is training
for epoch in range(5):
    optimizer.zero_grad()           # clear last step's grads (they accumulate!)
    logits = model(x)               # forward pass
    loss = criterion(logits, y)     # cross-entropy on logits (no softmax needed)
    loss.backward()                 # grads flow only into the head
    optimizer.step()                # update the head
    print(f"epoch {epoch}: loss = {loss.item():.4f}")

# ---- 6. SWITCH TO FULL FINE-TUNING (optional phase two) ----
# Unfreeze the backbone and train everything with a SMALL learning rate so the
# good pretrained weights only adjust gently.
for param in model.parameters():
    param.requires_grad = True
optimizer = optim.Adam(model.parameters(), lr=1e-4)   # small lr for fine-tuning
model.train()
optimizer.zero_grad()
loss = criterion(model(x), y)
loss.backward()
optimizer.step()
print("after one fine-tune step:", loss.item())
`
  };

  window.CODEVIZ["pt-transfer-learning"] = {
    question: "Transfer learning should win most when labels are scarce. Using frozen learned features (a stand-in for a pretrained backbone) vs raw pixels, how does test accuracy on a real face dataset grow as we give the classifier more labeled images?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs number of labeled images: transfer (frozen features) vs from scratch (raw pixels)",
        xlabel: "labeled images (total, 40 people)",
        ylabel: "test accuracy",
        series: [
          { name: "transfer (frozen learned features)", color: "#4ea1ff", points: [[40, 0.548], [80, 0.707], [120, 0.815], [160, 0.858], [200, 0.893], [280, 0.925]] },
          { name: "from scratch (raw 4096 pixels)", color: "#ff7b72", points: [[40, 0.506], [80, 0.655], [120, 0.727], [160, 0.761], [200, 0.778], [280, 0.850]] }
        ]
      }
    ],
    caption: "Real scikit-learn run on the Olivetti faces dataset (400 photos of 40 people, 64x64 = 4096 pixels each). The TRANSFER curve fits a linear classifier on FROZEN learned features — an eigenface PCA basis learned once on the face manifold, standing in for a pretrained backbone's frozen features. The FROM-SCRATCH curve fits the same linear classifier on raw 4096-dim pixels. Transfer is higher at every label budget and the gap is largest when labels are scarce (at 80 labeled images, 0.707 vs 0.655; the lead widens through the small-data range). That is the label-efficiency win: good pretrained features get you far with little data. A real backbone is a CNN pretrained on ImageNet, which cannot run in-browser; PCA eigenfaces are only a faithful, fast stand-in for that frozen feature extractor.",
    code: `import numpy as np
from sklearn.datasets import fetch_olivetti_faces
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# Real images: 400 face photos of 40 people, 64x64 = 4096 raw pixels each.
faces = fetch_olivetti_faces()
X, y = faces.data, faces.target

# Hold out a fixed test set; sample tiny label budgets from the rest.
X_pool, X_te, y_pool, y_te = train_test_split(
    X, y, test_size=0.3, stratify=y, random_state=0)

# TRANSFER (feature-extraction mode): a FROZEN backbone. An eigenface PCA basis
# learned once on the face manifold stands in for a pretrained backbone's frozen
# features; we train only a linear head on the few labels.
center = StandardScaler(with_std=False).fit(X_pool)
backbone = PCA(n_components=100, whiten=True, random_state=0).fit(center.transform(X_pool))
def features(Z):
    return backbone.transform(center.transform(Z))

classes = np.unique(y_pool)
def sample(per_class, seed):
    rng = np.random.RandomState(seed); idx = []
    for c in classes:
        ci = np.where(y_pool == c)[0]
        idx.extend(rng.choice(ci, size=min(per_class, len(ci)), replace=False))
    return np.array(idx)

def accuracy(per_class, mode):
    accs = []
    for seed in range(20):                       # average over 20 random samples
        idx = sample(per_class, seed)
        Xs, ys = X_pool[idx], y_pool[idx]
        if mode == "transfer":                   # frozen features + linear head
            Ftr, Fte = features(Xs), features(X_te)
        else:                                    # FROM SCRATCH: raw pixels, no learned features
            Ftr, Fte = Xs, X_te
        clf = LogisticRegression(max_iter=3000, C=1e4).fit(Ftr, ys)
        accs.append(clf.score(Fte, y_te))
    return round(float(np.mean(accs)), 3)

budgets = [1, 2, 3, 4, 5, 7]                      # labeled images PER PERSON
total = [b * 40 for b in budgets]                # 40 people
print("labeled images total:", total)
print("transfer    :", [accuracy(b, "transfer") for b in budgets])
print("from scratch :", [accuracy(b, "scratch") for b in budgets])
# labeled images total: [40, 80, 120, 160, 200, 280]
# transfer    : [0.548, 0.707, 0.815, 0.858, 0.893, 0.925]
# from scratch : [0.506, 0.655, 0.727, 0.761, 0.778, 0.85]`
  };
})();
