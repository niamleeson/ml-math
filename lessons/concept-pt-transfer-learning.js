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
    template: "pytorch",
    prereqs: ["pt-tensors", "pt-tensor-ops", "dl-optimizers", "fs-transfer-learning", "fe-deep-learning-features"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>load a <code>resnet18</code> pretrained on ImageNet and grab the exact preprocessing the weights expect with <code>weights.transforms()</code>;</li>
<li>freeze the backbone with <code>requires_grad = False</code> and swap <code>model.fc</code> for a new <code>nn.Linear</code> sized to your classes;</li>
<li>hand the optimizer <b>only</b> the head's parameters, train in feature-extraction mode, then switch to full fine-tuning at a small learning rate.</li>
</ul>
<p><b>The API you'll own:</b> <code>resnet18(weights=ResNet18_Weights.DEFAULT)</code>, <code>weights.transforms()</code>, <code>param.requires_grad = False</code>, <code>model.fc = nn.Linear(in, n)</code>, <code>optim.Adam(model.fc.parameters(), ...)</code>, <code>model.eval()</code> / <code>model.train()</code>.</p>`,

    concept: `<p>A deep image network learns its features in layers: early layers detect edges and colours, middle layers detect textures and parts, late layers detect whole objects. The early and middle features are <b>generic</b> — useful for almost any image task. <b>Transfer learning</b> keeps those learned layers (the <b>backbone</b>) and only replaces the last layer (the <b>head</b>) that maps features to your specific classes. For images this is the <i>default</i>: training from scratch is the exception.</p>
<p>There are two modes, on a spectrum from "reuse everything" to "adapt everything":</p>
<ul>
<li><b>Feature extraction.</b> Freeze the entire backbone, replace the final layer with a fresh <code>nn.Linear</code> sized to your classes, and train <b>only the head</b>. The backbone is a fixed feature extractor. Fast, label-efficient, the right first try on small data.</li>
<li><b>Fine-tuning.</b> Unfreeze some or all of the backbone and train it too, but with a <b>small learning rate</b> so the good pretrained weights only adjust gently. More capacity, needs more data and care — often a second phase after training the head.</li>
</ul>
<p>Two practical pieces tie it together: use <code>weights.transforms()</code> so inputs match what the model expects, and give the optimizer <b>only the parameters you intend to train</b>. The theory of why reused representations transfer is <a onclick="App.open('fs-transfer-learning')">fs-transfer-learning</a> and <a onclick="App.open('fe-deep-learning-features')">fe-deep-learning-features</a>; this lesson is the HOW in PyTorch.</p>`,

    apiTable: [
      { sig: "resnet18(weights=ResNet18_Weights.DEFAULT)", does: "Downloads the architecture <i>and</i> ImageNet-trained weights. <code>DEFAULT</code> picks the best available set.", snippet: "model = resnet18(weights=ResNet18_Weights.DEFAULT)" },
      { sig: "weights.transforms()", does: "Returns the exact resize / center-crop / normalize pipeline the weights expect. Use it on every input.", snippet: "preprocess = ResNet18_Weights.DEFAULT.transforms()" },
      { sig: "for p in model.parameters(): p.requires_grad = False", does: "Freezes the backbone — autograd stops computing or storing gradients for those tensors.", snippet: "for p in model.parameters(): p.requires_grad = False" },
      { sig: "model.fc.in_features", does: "The input size of the final layer (512 for resnet18), so you can size a new head.", snippet: "in_features = model.fc.in_features   # 512" },
      { sig: "model.fc = nn.Linear(in_features, num_classes)", does: "Swaps the 1000-way ImageNet head for a fresh layer sized to your classes (created with <code>requires_grad=True</code>).", snippet: "model.fc = nn.Linear(in_features, 5)" },
      { sig: "optim.Adam(model.fc.parameters(), lr)", does: "Optimizer over <b>only</b> the head — not <code>model.parameters()</code>. Avoids wasting work on frozen tensors.", snippet: "optim.Adam(model.fc.parameters(), lr=1e-3)" },
      { sig: "model.eval() / model.fc.train()", does: "Frozen backbone in <code>eval()</code> so batch-norm uses stored stats; head in <code>train()</code> so it learns.", snippet: "model.eval(); model.fc.train()" },
      { sig: "named_parameters()", does: "Iterate <code>(name, param)</code> pairs to confirm which tensors still require grad.", snippet: "[n for n, p in model.named_parameters() if p.requires_grad]" },
      { sig: "optim.Adam(model.parameters(), lr=1e-4)", does: "Fine-tuning phase: unfreeze all, rebuild the optimizer over everything, use a <b>small</b> learning rate.", snippet: "optim.Adam(model.parameters(), lr=1e-4)" }
    ],

    codeTour: [
      {
        explain: `<b>Load a pretrained model and its transforms.</b> <code>ResNet18_Weights.DEFAULT</code> downloads the architecture plus ImageNet weights. The <code>weights</code> object also carries <code>transforms()</code> — the exact preprocessing the model was trained on. Feed inputs any other way and accuracy collapses.`,
        code: `import torch
import torch.nn as nn
import torch.optim as optim
from torchvision.models import resnet18, ResNet18_Weights

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"
NUM_CLASSES = 5

weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)
preprocess = weights.transforms()
print(model.fc)`,
        output: `Linear(in_features=512, out_features=1000, bias=True)`
      },
      {
        explain: `<b>Freeze the backbone, swap the head.</b> Setting <code>requires_grad = False</code> on every parameter makes autograd treat them as constants. Reading <code>model.fc.in_features</code> (512) lets you build a fresh <code>nn.Linear</code> sized to your classes — created with <code>requires_grad=True</code> by default, so only it will train.`,
        code: `for param in model.parameters():
    param.requires_grad = False              # feature-extraction mode

in_features = model.fc.in_features           # 512
model.fc = nn.Linear(in_features, NUM_CLASSES)
model = model.to(device)

trainable = [n for n, p in model.named_parameters() if p.requires_grad]
print("trainable parameters:", trainable)`,
        output: `trainable parameters: ['fc.weight', 'fc.bias']`
      },
      {
        explain: `<b>Optimizer sees only the head.</b> Pass <code>model.fc.parameters()</code>, not <code>model.parameters()</code> — handing it the frozen backbone wastes bookkeeping on gradient-less tensors. <code>CrossEntropyLoss</code> expects raw logits and integer class indices, no softmax.`,
        code: `optimizer = optim.Adam(model.fc.parameters(), lr=1e-3)   # NOT model.parameters()
criterion = nn.CrossEntropyLoss()
print("params the optimizer manages:",
      len(optimizer.param_groups[0]['params']))`,
        output: `params the optimizer manages: 2`
      },
      {
        explain: `<b>Train the head.</b> A tiny synthetic batch (resnet18 wants <code>3x224x224</code> inputs) stands in for a real <code>ImageFolder</code> + <code>DataLoader</code>. Put the backbone in <code>eval()</code> so its batch-norm uses stored stats, but the head in <code>train()</code>. The standard loop: <code>zero_grad</code>, forward, <code>backward</code> (grads flow only into the head), <code>step</code>.`,
        code: `x = torch.randn(16, 3, 224, 224, device=device)
y = torch.randint(0, NUM_CLASSES, (16,), device=device)

model.eval()        # frozen backbone -> stored batch-norm stats
model.fc.train()    # head is training
for epoch in range(5):
    optimizer.zero_grad()
    logits = model(x)
    loss = criterion(logits, y)
    loss.backward()
    optimizer.step()
    print(f"epoch {epoch}: loss = {loss.item():.4f}")`,
        output: `epoch 0: loss = 1.7234
epoch 1: loss = 1.4892
epoch 2: loss = 1.2961
epoch 3: loss = 1.1377
epoch 4: loss = 1.0044`
      },
      {
        explain: `<b>Phase two: full fine-tuning.</b> Unfreeze everything, rebuild the optimizer over <code>model.parameters()</code> with a <b>small</b> learning rate (<code>1e-4</code>), and switch to <code>model.train()</code>. A large rate like <code>1e-2</code> here would take big steps and wreck the good ImageNet features.`,
        code: `for param in model.parameters():
    param.requires_grad = True
optimizer = optim.Adam(model.parameters(), lr=1e-4)   # small lr for fine-tuning
model.train()
optimizer.zero_grad()
loss = criterion(model(x), y)
loss.backward()
optimizer.step()
print("after one fine-tune step:", round(loss.item(), 4))`,
        output: `after one fine-tune step: 0.9043`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab:</p>
<ul>
<li>The first print is the ImageNet head, <code>Linear(in_features=512, out_features=1000)</code> — 512 features in, 1000 classes out — exactly what you replace.</li>
<li>After freezing and swapping, <code>trainable parameters</code> is just <code>['fc.weight', 'fc.bias']</code>: the whole backbone is frozen, only the new head trains. The optimizer correspondingly manages just <code>2</code> tensors.</li>
<li>The head-only loss falls from ~1.72 (near ln(5) ≈ 1.61, a random 5-way guess) toward ~1.00, proof the head is learning even though the backbone is frozen.</li>
<li>The fine-tune step prints one more small loss — the whole network now adapting gently at <code>lr=1e-4</code>.</li>
</ul>
<p>Exact numbers assume <code>torch.manual_seed(0)</code> and the synthetic batch; on real data and a GPU the values differ but the <i>shape</i> (loss falling from ~ln(num_classes)) is what matters. The first run downloads the pretrained weights, so expect a short pause.</p>`,

    cheatsheet: [
      { code: "model = resnet18(weights=ResNet18_Weights.DEFAULT)", note: "architecture + best ImageNet weights" },
      { code: "preprocess = weights.transforms()", note: "exact resize/crop/normalize the weights expect" },
      { code: "for p in model.parameters(): p.requires_grad = False", note: "freeze the backbone (feature extraction)" },
      { code: "model.fc = nn.Linear(model.fc.in_features, num_classes)", note: "swap head; new layer trains by default" },
      { code: "optim.Adam(model.fc.parameters(), lr=1e-3)", note: "optimizer over the HEAD only, not model.parameters()" },
      { code: "model.eval(); model.fc.train()", note: "frozen backbone uses stored batch-norm stats" },
      { code: "for p in model.parameters(): p.requires_grad = True", note: "unfreeze for fine-tuning phase two" },
      { code: "optim.Adam(model.parameters(), lr=1e-4)", note: "SMALL lr when fine-tuning the backbone" }
    ],

    deeper: `<p>This lesson is the PyTorch HOW. The theory behind it:</p>
<ul>
<li>why reusing learned representations across tasks works: <a onclick="App.open('fs-transfer-learning')">fs-transfer-learning</a>;</li>
<li>why a deep network's inner layers make such good general features: <a onclick="App.open('fe-deep-learning-features')">fe-deep-learning-features</a>;</li>
<li>the gradient-descent update the head (and later the backbone) is trained with: <a onclick="App.open('dl-optimizers')">dl-optimizers</a>.</li>
</ul>`,
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
        q: `<b>Type this in Colab.</b> Load <code>resnet18</code> with <code>ResNet18_Weights.DEFAULT</code> and print <code>model.fc</code>. Then print <code>model.fc.in_features</code> and <code>model.fc.out_features</code> so you see the ImageNet head's exact shape before you replace it.`,
        steps: [
          { do: `Build with <code>resnet18(weights=ResNet18_Weights.DEFAULT)</code>.`, why: `<code>DEFAULT</code> downloads the architecture plus the best ImageNet weights.` },
          { do: `Read <code>model.fc.in_features</code> and <code>.out_features</code>.`, why: `You need the input size (512) to size a new head, and the 1000 outputs are ImageNet's classes.` }
        ],
        answer: `<pre><code>import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights
model = resnet18(weights=ResNet18_Weights.DEFAULT)
print(model.fc)                  # Linear(in_features=512, out_features=1000, bias=True)
print(model.fc.in_features)      # 512
print(model.fc.out_features)     # 1000</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Freezing pitfall. On the loaded <code>resnet18</code>, count how many parameter tensors have <code>requires_grad=True</code> before freezing. Then freeze every parameter with <code>requires_grad=False</code> and count again. Predict the second count before running.`,
        steps: [
          { do: `Count <code>sum(p.requires_grad for p in model.parameters())</code> first.`, why: `Out of the box every tensor is trainable — that is "training from scratch".` },
          { do: `Loop <code>for p in model.parameters(): p.requires_grad = False</code>, then recount.`, why: `Freezing makes autograd skip those tensors; the count drops to 0.` }
        ],
        answer: `<pre><code>before = sum(p.requires_grad for p in model.parameters())
print(before)    # 62  (all tensors trainable)
for p in model.parameters():
    p.requires_grad = False
after = sum(p.requires_grad for p in model.parameters())
print(after)     # 0  (backbone frozen)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> After freezing the backbone, replace the head with <code>nn.Linear(in_features, 5)</code> for a 5-class task. Then print the names of the parameters that still require grad — confirm only the new <code>fc</code> trains.`,
        steps: [
          { do: `Read <code>in_features = model.fc.in_features</code>, then assign a fresh <code>model.fc = nn.Linear(in_features, 5)</code>.`, why: `A brand-new <code>nn.Linear</code> is created with <code>requires_grad=True</code> by default.` },
          { do: `List <code>[n for n, p in model.named_parameters() if p.requires_grad]</code>.`, why: `Only the new head should appear — the frozen backbone is excluded.` }
        ],
        answer: `<pre><code>in_features = model.fc.in_features          # 512
model.fc = nn.Linear(in_features, 5)        # fresh head -> requires_grad=True
trainable = [n for n, p in model.named_parameters() if p.requires_grad]
print(trainable)   # ['fc.weight', 'fc.bias']  -- only the head trains</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Optimizer pitfall. Create the optimizer for feature-extraction mode so it touches <i>only</i> the head, then print how many parameter tensors it manages. (Hint: pass <code>model.fc.parameters()</code>, not <code>model.parameters()</code>.)`,
        steps: [
          { do: `Build <code>optim.Adam(model.fc.parameters(), lr=1e-3)</code>.`, why: `Handing it the whole network would waste bookkeeping on frozen, gradient-less params.` },
          { do: `Count <code>len(optimizer.param_groups[0]['params'])</code>.`, why: `It should be 2 — the head's weight and bias only.` }
        ],
        answer: `<pre><code>import torch.optim as optim
optimizer = optim.Adam(model.fc.parameters(), lr=1e-3)   # NOT model.parameters()
print(len(optimizer.param_groups[0]['params']))   # 2  (fc.weight, fc.bias)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Use the model's expected transforms. Grab <code>preprocess = ResNet18_Weights.DEFAULT.transforms()</code> and print it. Then apply it to a fake PIL-sized tensor input by building a random <code>(3, 300, 300)</code> uint8 image and confirming the transform resizes it to the <code>3&times;224&times;224</code> the weights expect.`,
        steps: [
          { do: `Call <code>weights.transforms()</code> to get the exact resize/crop/normalize pipeline.`, why: `The weights were trained on this specific preprocessing; mismatched input collapses accuracy.` },
          { do: `Run it on a sample image and print the output shape.`, why: `It center-crops to 224 and normalizes with ImageNet statistics.` }
        ],
        answer: `<pre><code>import torch
from torchvision.models import ResNet18_Weights
weights = ResNet18_Weights.DEFAULT
preprocess = weights.transforms()
print(preprocess)   # ImageClassification(crop_size=[224], resize_size=[256], mean=..., std=...)
img = torch.randint(0, 256, (3, 300, 300), dtype=torch.uint8)
out = preprocess(img)
print(out.shape)    # torch.Size([3, 224, 224])
print(out.dtype)    # torch.float32  (normalized)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> <code>model.eval()</code> for the frozen backbone. Put the frozen-backbone model in eval mode, then put just the head back in train mode. Print <code>model.training</code> and <code>model.fc.training</code> to confirm the split.`,
        steps: [
          { do: `Call <code>model.eval()</code> on the whole model.`, why: `So the backbone's batch-norm uses stored running stats instead of recomputing from tiny batches.` },
          { do: `Call <code>model.fc.train()</code> to re-enable training only on the head.`, why: `The new head is what you actually optimize.` }
        ],
        answer: `<pre><code>model.eval()        # backbone batchnorm -> stored running stats
model.fc.train()    # but the head trains
print(model.training)      # False
print(model.fc.training)   # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> One feature-extraction training step. With the frozen backbone + new 5-class head, run a single step on a fake batch <code>x = torch.randn(8, 3, 224, 224)</code>, <code>y = torch.randint(0, 5, (8,))</code> using <code>CrossEntropyLoss</code> and the head-only optimizer. Remember <code>zero_grad()</code>. Print the loss.`,
        steps: [
          { do: `Forward through the model, score with <code>CrossEntropyLoss</code> on raw logits.`, why: `Cross-entropy wants logits and integer class indices, no softmax.` },
          { do: `<code>optimizer.zero_grad()</code>, <code>loss.backward()</code>, <code>optimizer.step()</code>.`, why: `Gradients flow only into the head; zeroing prevents them accumulating across steps.` }
        ],
        answer: `<pre><code>import torch
torch.manual_seed(0)
criterion = nn.CrossEntropyLoss()
x = torch.randn(8, 3, 224, 224)
y = torch.randint(0, 5, (8,))
optimizer.zero_grad()
logits = model(x)               # (8, 5) raw logits
loss = criterion(logits, y)
loss.backward()                 # grads only in fc
optimizer.step()
print(round(loss.item(), 4))    # ~1.6  (near ln(5), random head start)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Switch to fine-tuning. Unfreeze the whole backbone, rebuild the optimizer over <code>model.parameters()</code> with a <b>small</b> learning rate <code>1e-4</code>, switch to <code>model.train()</code>, and run one step on the same fake batch. Print the loss. Note why <code>1e-2</code> would be the wrong rate here.`,
        steps: [
          { do: `Set <code>requires_grad=True</code> on every param and rebuild <code>optim.Adam(model.parameters(), lr=1e-4)</code>.`, why: `Now the whole network adapts, but gently — pretrained weights are already good.` },
          { do: `Call <code>model.train()</code> and run one full step.`, why: `A large rate like <code>1e-2</code> would take big steps and wreck the pretrained features.` }
        ],
        answer: `<pre><code>for p in model.parameters():
    p.requires_grad = True
optimizer = optim.Adam(model.parameters(), lr=1e-4)   # small lr for fine-tuning
model.train()
optimizer.zero_grad()
loss = criterion(model(x), y)
loss.backward()
optimizer.step()
print(round(loss.item(), 4))   # another small loss; backbone now adapting gently
# lr=1e-2 here would overwrite the good ImageNet features and accuracy would drop.</code></pre>`
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
