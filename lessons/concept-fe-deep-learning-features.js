/* Feature Engineering — Chapter 8, "Deep Learning... as the latest
   feature extraction technique for images".
   Self-contained: lesson + CODE + CODEVIZ merged by id "fe-deep-learning-features". */
(function () {
  window.LESSONS.push({
    id: "fe-deep-learning-features",
    title: "Deep learning as a feature extractor for images",
    tagline: "Let a convolutional network LEARN the image features, then reuse its activations instead of hand-designing SIFT or HOG.",
    module: "Feature Engineering",
    prereqs: ["dl-conv", "dl-cnn-params", "fs-transfer-learning"],

    bigIdea:
      `<p>Every feature-engineering lesson so far hand-builds features: you decide to take counts,
       a log, a bin, a tf-idf (term frequency–inverse document frequency) weight. For <b>images</b>,
       the classical version of that is hand-designing descriptors like <b>SIFT (Scale-Invariant
       Feature Transform)</b> or <b>HOG (Histogram of Oriented Gradients)</b> — a human writes the
       recipe that turns pixels into a feature vector.</p>
       <p>Zheng &amp; Casari close the book with the modern alternative: <b>deep learning</b> as the
       latest image feature-extraction technique. Instead of a human writing the recipe, a
       <b>Convolutional Neural Network (CNN)</b> <i>learns</i> the recipe from data. The key reframing
       is this: a trained image classifier is really two parts stacked together — a <b>featurizer</b>
       (everything up to the last hidden layer) that turns pixels into a feature vector, and a tiny
       <b>classifier head</b> (the final layer) that maps that vector to labels.</p>
       <p>The featurizer learns a <b>hierarchy</b>: early convolution layers detect <b>edges and
       textures</b>, middle layers combine those into <b>parts</b> (an eye, a wheel), deep layers
       detect whole <b>objects</b>. So the activations of the last hidden layer — the
       <b>penultimate layer</b> — are a powerful, general-purpose feature vector for an image. That
       single idea is the foundation of <b>transfer learning</b> (see <code>fs-transfer-learning</code>):
       take a CNN already trained on a giant dataset, chop off its classifier head, and reuse its
       penultimate activations as features for a brand-new task.</p>`,

    buildup:
      `<p>Why can one network's features help a different task? Because the early-to-middle features it
       learned — edges, corners, textures, simple shapes — are <b>not specific to its original labels</b>.
       Edges are edges whether you are sorting cats from dogs or reading X-rays. Only the last layer,
       which maps features to the <i>specific</i> classes, is task-specific. So you keep the shared
       featurizer and replace only the head.</p>
       <p>The book contrasts two ways to get an image feature vector:</p>
       <ul>
         <li><b>Hand-crafted features (SIFT / HOG).</b> A human-designed, fixed procedure: compute
         gradients, bin them into histograms of orientations. Transparent and needs no training data,
         but it cannot adapt — it captures whatever its designer thought mattered, and nothing more.</li>
         <li><b>Learned features (a CNN).</b> The procedure is <i>learned</i> by fitting millions of
         weights to data, so it discovers whatever features actually help. More powerful, but it needs
         <b>lots of labeled data and compute</b> to train from scratch.</li>
       </ul>
       <p>The escape hatch from that "lots of data and compute" cost is exactly transfer learning:
       someone else paid the cost once (training on <b>ImageNet</b>, ~1.2 million labeled photos), and
       you reuse the result. You take their pretrained CNN as a <b>frozen featurizer</b>: push your
       images through it, read off the penultimate-layer vector for each, and train a simple downstream
       model (logistic regression, a small multilayer perceptron) on those vectors. You get
       near-state-of-the-art image features without ever training a CNN yourself.</p>`,

    symbols: [
      { sym: "$\\mathbf{I}$", desc: "one input image — a grid of pixels (height by width by color channels)." },
      { sym: "$f_\\theta$", desc: "the featurizer: the pretrained CNN with its classifier head removed. $\\theta$ are its learned weights, which we freeze (keep fixed)." },
      { sym: "$\\mathbf{z}$", desc: "the feature vector $\\mathbf{z} = f_\\theta(\\mathbf{I})$ — the penultimate (last hidden) layer's activations. This is the learned, general-purpose feature vector for the image." },
      { sym: "$d$", desc: "the length of $\\mathbf{z}$ — the number of units in the penultimate layer (e.g. 512 for ResNet-18). Each component is one learned feature." },
      { sym: "$g$", desc: "the downstream classifier (the new head) trained on the features $\\mathbf{z}$ for YOUR task — often a simple logistic regression." },
      { sym: "$\\hat{y}$", desc: "the prediction for the new task: $\\hat{y} = g(\\mathbf{z}) = g(f_\\theta(\\mathbf{I}))$." }
    ],

    formula:
      `$$ \\mathbf{z} = f_\\theta(\\mathbf{I}) \\in \\mathbb{R}^{d}, \\qquad \\hat{y} = g(\\mathbf{z}), \\qquad \\theta \\text{ frozen (pretrained), only } g \\text{ trained} $$`,

    whatItDoes:
      `<p>The formula splits an image model into the two pieces the book emphasizes. The featurizer
       $f_\\theta$ takes a raw image $\\mathbf{I}$ and returns a length-$d$ vector $\\mathbf{z}$ of
       learned features — that is the "deep feature extractor". The classifier $g$ takes that vector and
       returns a label $\\hat{y}$.</p>
       <p>The phrase <b>"$\\theta$ frozen"</b> is the whole trick. You do <i>not</i> retrain the CNN; its
       weights $\\theta$ stay exactly as they were after pretraining on ImageNet. You only fit the small
       new head $g$ on your data. So the expensive, data-hungry part (learning $f_\\theta$) is reused for
       free, and the cheap part (fitting $g$ on a few hundred feature vectors) is all you actually train.
       That is why deep features <b>transfer well even when your own labels are scarce</b>.</p>`,

    derivation:
      `<p><b>Why learned features beat hand-crafted ones, and why they transfer — the book's reasoning.</b></p>
       <ul class="steps">
         <li><b>A CNN is a stack of learned filters.</b> Each convolution layer slides small filters over its input and fires where a pattern is present (see <code>dl-conv</code>). The filter weights are <i>learned</i> by gradient descent, not hand-set, so they adapt to whatever patterns reduce the training loss.</li>
         <li><b>The layers form a feature hierarchy.</b> Stacking convolutions builds features of growing abstraction: layer 1 learns edges and color blobs, layer 2 combines edges into textures and corners, deeper layers assemble parts and then whole objects. By the last hidden layer, each unit responds to a high-level, object-relevant pattern.</li>
         <li><b>The penultimate layer IS the feature vector.</b> Read off the activations of that last hidden layer and you have $\\mathbf{z}$ — a compact, learned description of the image. The final layer is just a linear classifier on top of $\\mathbf{z}$, which proves $\\mathbf{z}$ already holds everything needed to separate the classes.</li>
         <li><b>Early features are generic, so they transfer.</b> Edges, textures, and simple shapes are useful for almost any vision task, not just the one the network was trained on. Only the final layer is tied to the original labels. Chop it off and the rest is a reusable featurizer (this is exactly <code>fs-transfer-learning</code>).</li>
         <li><b>Reuse beats retraining when data is scarce.</b> Training a CNN from scratch needs huge labeled data and compute. But fitting a simple head $g$ on pretrained features $\\mathbf{z}$ needs very little — so a pretrained backbone gives you strong image features even with a few hundred examples, where hand-crafted SIFT/HOG plus a classifier would lag. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Work through the two-part split $\\hat{y}=g(f_\\theta(\\mathbf{I}))$ on a single image, ResNet-18
       sizes, with the dimensions plugged in.</p>
       <ul class="steps">
         <li><b>Input.</b> $\\mathbf{I}$ is a $224\\times224\\times3$ photo, so its raw size is
         $224\\times224\\times3 = 150{,}528$ pixel numbers &mdash; too high-dimensional and low-level to
         classify directly.</li>
         <li><b>Featurize.</b> Push $\\mathbf{I}$ through the frozen CNN $f_\\theta$. The penultimate layer
         outputs $\\mathbf{z}=f_\\theta(\\mathbf{I})\\in\\mathbb{R}^{d}$ with $d=512$ &mdash; a
         $150{,}528 / 512 = 294\\times$ reduction, from raw pixels to learned features.</li>
         <li><b>Classify your task.</b> For "muffin vs. chihuahua" (2 classes), fit a logistic regression
         $g$ on the 512-dim vectors. It has $d\\times2 + 2 = 512\\times2 + 2 = 1{,}026$ weights to learn
         (the $+2$ are the per-class biases).</li>
         <li><b>Count what you DIDN'T train.</b> ResNet-18 has $\\approx 11{,}000{,}000$ frozen weights in
         $f_\\theta$. You trained $1{,}026$, i.e. only $1026 / 11{,}000{,}000 \\approx 0.0093\\%$ &mdash;
         the other $99.99\\%$ came free from ImageNet pretraining.</li>
         <li><b>Predict.</b> For a new photo, $\\hat{y}=g(f_\\theta(\\mathbf{I}))$, reusing all the frozen
         visual know-how.</li>
       </ul>
       <table class="extable">
         <caption>Three ways to feed the same logistic-regression head $g$ (illustrative sizes; ResNet-18 backbone).</caption>
         <thead><tr><th>feature source</th><th class="num">feature dim</th><th class="num">weights you train ($\\times2$ classes)</th><th>learned from data?</th></tr></thead>
         <tbody>
           <tr><td class="row-h">raw pixels</td><td class="num">150,528</td><td class="num">301,058</td><td>no (just pixels)</td></tr>
           <tr><td class="row-h">HOG (hand-crafted)</td><td class="num">~3,780</td><td class="num">~7,562</td><td>no (fixed recipe)</td></tr>
           <tr><td class="row-h">deep features $\\mathbf{z}$</td><td class="num">512</td><td class="num">1,026</td><td>yes (frozen CNN)</td></tr>
         </tbody>
       </table>
       <p>The learned $\\mathbf{z}$ gives the smallest head to train <i>and</i> the richest features:
       512 object-level numbers usually beat 150,528 raw pixels or a fixed gradient histogram, because
       $f_\\theta$ already encodes parts and shapes a hand-crafted recipe cannot.</p>`,

    whenToUse:
      `<p><b>Reach for deep learned features whenever you have an image task</b> — they are the book's
       default modern image featurizer.</p>
       <ul>
         <li><b>Any image task with a good pretrained backbone.</b> Classification, retrieval, similarity, clustering of photos — push images through a pretrained CNN (ResNet, VGG, EfficientNet) and use the penultimate vector as features. This replaces hand-crafted SIFT/HOG in almost all modern pipelines.</li>
         <li><b>Transfer learning when labels are scarce.</b> If you have only hundreds or a few thousand labeled images, do NOT train a CNN from scratch — freeze a pretrained featurizer and train a small head. This is the highest-value case (see <code>fs-transfer-learning</code>).</li>
         <li><b>When you have lots of data AND compute.</b> Then you can go further and <b>fine-tune</b> — unfreeze some CNN layers and keep training them on your data — so the features adapt to your domain rather than staying generic.</li>
       </ul>
       <p>Prefer <b>hand-crafted features (SIFT / HOG)</b> only when you have <i>no</i> suitable pretrained
       model, very little compute, or need a fully transparent, training-free descriptor — for example a
       narrow domain unlike any pretraining data where a learned backbone gives no head start.</p>`,

    application:
      `<p>Chapter 8 frames a pretrained CNN as a general-purpose image feature extractor, and that pattern
       runs through modern computer vision.</p>
       <ul>
         <li><b>Image classification on small datasets.</b> Medical imaging, product photos, wildlife camera traps — freeze an ImageNet-pretrained backbone, extract penultimate features, train a simple classifier. The standard recipe when you cannot collect millions of labels.</li>
         <li><b>Image search and recommendation.</b> Use $\\mathbf{z}$ as an embedding: nearest-neighbor in feature space finds visually similar products or photos, exactly as bag-of-words vectors power text search.</li>
         <li><b>Feature reuse across tasks.</b> The same featurizer feeds detection, segmentation, and captioning models. The CNN counts its weights (see <code>dl-cnn-params</code>) so you can see how much pretrained know-how you are reusing — and why training it yourself would be so costly.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Training from scratch needs huge data and compute.</b> A CNN has millions of weights; fitting them needs ImageNet-scale data and GPUs. <i>Fix:</i> almost never train from scratch — start from a <b>pretrained</b> backbone and either freeze it or fine-tune.</li>
         <li><b>Domain shift from the pretraining data.</b> Features learned on natural photos (ImageNet) may not fit X-rays, satellite, or microscope images. <i>Fix:</i> fine-tune on in-domain data if you have enough, or pick a backbone pretrained on a closer domain; always check it actually helps over a baseline.</li>
         <li><b>The features are a black box.</b> Unlike a literal word count or a HOG bin, a component of $\\mathbf{z}$ has no human-readable meaning, which hurts interpretability and debugging. <i>Fix:</i> use visualization/attribution tools, and keep a simple interpretable baseline alongside.</li>
         <li><b>The models are huge.</b> Backbones are hundreds of megabytes and slow on CPU, which can be too heavy for edge or real-time use. <i>Fix:</i> use a smaller architecture (MobileNet), distill, or quantize the model.</li>
         <li><b>You must keep the RIGHT layer.</b> Take features from too early a layer and they are too low-level (just edges); take the final classification layer and they are over-specialized to the original labels. <i>Fix:</i> use the <b>penultimate</b> (last hidden) layer — generic yet high-level — as your feature vector.</li>
       </ul>`,

    practice: [
      {
        q: `You have 600 labeled photos for a new 3-class image task and a single laptop GPU. Why is training a ResNet from scratch a bad idea, and what does Chapter 8 tell you to do instead?`,
        steps: [
          { do: `Count what training from scratch must fit: ~11 million ResNet-18 weights.`, why: `Fitting that many parameters needs ImageNet-scale data (~1.2M images) and serious compute — 600 images would massively overfit.` },
          { do: `Split the network into featurizer $f_\\theta$ (up to the last hidden layer) and head $g$ (final layer).`, why: `Only the head is tied to the original labels; the featurizer's edges/textures/parts are generic and reusable.` },
          { do: `Freeze a pretrained $f_\\theta$, extract the penultimate vector $\\mathbf{z}$ for each photo, and train a simple $g$ on those 600 vectors.`, why: `Now you only fit a small head, which 600 examples can support, while reusing all the pretrained visual know-how.` }
        ],
        answer: `<p>Training from scratch would fit ~11 million weights on only 600 images — guaranteed overfitting and far too little data/compute. Instead use <b>transfer learning</b>: take a pretrained CNN, <b>freeze</b> it as a featurizer $f_\\theta$, read off the <b>penultimate-layer</b> features $\\mathbf{z}=f_\\theta(\\mathbf{I})$, and train only a simple downstream classifier $g$ on those vectors. You reuse ImageNet's learned features for free and train almost nothing yourself.</p>`
      },
      {
        q: `When using a pretrained CNN as a feature extractor, why do you take the activations of the penultimate (last hidden) layer rather than the input pixels, an early conv layer, or the final softmax layer?`,
        steps: [
          { do: `Reject raw pixels and the earliest conv layer.`, why: `Pixels are too high-dimensional and low-level; the first conv layer only fires on edges and color blobs — too generic and low-level to classify objects directly.` },
          { do: `Reject the final classification (softmax) layer.`, why: `Its outputs are probabilities over the ORIGINAL ImageNet classes — over-specialized to the pretraining labels, not your task.` },
          { do: `Choose the penultimate layer.`, why: `By the last hidden layer the hierarchy has built high-level, object-relevant features that are still generic enough to transfer — the sweet spot.` }
        ],
        answer: `<p>The penultimate layer sits at the top of the learned <b>feature hierarchy</b> — its units respond to high-level, object-level patterns (parts, shapes) — yet it is <i>not</i> tied to the original labels the way the final softmax layer is. Earlier layers (and raw pixels) are too low-level; the final layer is too task-specific. So the last hidden layer's activations $\\mathbf{z}$ are the most useful general-purpose feature vector.</p>`
      },
      {
        q: `Your team applies an ImageNet-pretrained backbone to grayscale microscope images and accuracy is disappointing. Name the likely cause from the book's pitfalls and two fixes.`,
        steps: [
          { do: `Compare the pretraining data to the new data.`, why: `ImageNet is everyday color photos; microscope images look nothing like them — this is domain shift, a pitfall the book flags.` },
          { do: `Consider fine-tuning instead of freezing.`, why: `Unfreezing some layers lets the generic features adapt toward the new domain, if you have enough in-domain labels.` },
          { do: `Consider a closer backbone or a stronger baseline check.`, why: `A backbone pretrained on medical/scientific images starts closer to the target; always verify the deep features beat a simple baseline.` }
        ],
        answer: `<p>The likely cause is <b>domain shift</b>: features learned on natural ImageNet photos transfer poorly to microscope images. Two fixes: (1) <b>fine-tune</b> the backbone on in-domain data so its features adapt to the new domain, and (2) start from a backbone <b>pretrained on a closer domain</b> (or at least confirm the deep features actually beat a simpler baseline before trusting them).</p>`
      }
    ]
  });

  window.CODE["fe-deep-learning-features"] = {
    lib: "PyTorch + torchvision",
    runnable: false,
    explain: `<p>Chapter 8's modern image featurizer: load a CNN <b>pretrained on ImageNet</b>
      (<code>resnet18</code>), <b>remove the final classification layer</b>, and use what remains as a
      frozen feature extractor. Each image becomes a 512-dimensional penultimate-layer vector
      <code>z</code>; those vectors feed a simple downstream classifier — this is transfer learning
      (see <code>fs-transfer-learning</code>). <code>runnable:false</code> because it needs PyTorch, a
      GPU, and your image folder — it runs as-is in Colab. The book's code/data are at
      <code>github.com/alicezheng/feature-engineering-book</code>.</p>`,
    code: `import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# --- 1. Load a CNN pretrained on ImageNet (the expensive part, done for us) ---
resnet = models.resnet18(pretrained=True)
resnet.eval()                       # inference mode: no dropout/batchnorm updates

# --- 2. Turn it into a FEATURIZER: chop off the final classification layer ---
# resnet.fc is the last fully-connected (classifier) layer -> 1000 ImageNet classes.
# Replace it with Identity so the network now outputs the PENULTIMATE features (512-dim).
resnet.fc = nn.Identity()

# Freeze the weights -- we reuse them, we do not train them.
for p in resnet.parameters():
    p.requires_grad = False

# Standard ImageNet preprocessing the pretrained model expects.
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

def deep_features(image_paths):
    """Extract the 512-dim penultimate-layer feature vector for each image."""
    feats = []
    with torch.no_grad():
        for path in image_paths:
            img = Image.open(path).convert('RGB')
            x = preprocess(img).unsqueeze(0)   # add batch dimension
            z = resnet(x)                      # z: penultimate-layer features, shape (1, 512)
            feats.append(z.squeeze(0).numpy())
    return feats

# --- 3. Use the learned features in a simple downstream classifier (transfer learning) ---
# X is a list of 512-dim vectors; train a plain logistic regression on YOUR labels.
from sklearn.linear_model import LogisticRegression
X = deep_features(my_image_paths)          # learned features, not hand-crafted SIFT/HOG
clf = LogisticRegression(max_iter=1000)
clf.fit(X, my_labels)                       # only THIS small head is trained
# predict on a new image: clf.predict(deep_features([new_path]))`
  };

  window.CODEVIZ["fe-deep-learning-features"] = {
    question: "Learned features should be more label-efficient than raw pixels. How does downstream accuracy compare for learned features vs raw pixels as labels get scarce -- and what does the curve look like when transfer goes WRONG (domain shift) or you read off the WRONG layer?",
    charts: [
      {
        type: "line",
        title: "Healthy transfer: learned features beat raw pixels, most when labels are scarce",
        xlabel: "labeled examples per class",
        ylabel: "test accuracy",
        series: [
          { name: "raw pixels (64-dim)", color: "#ff7b72", points: [[2.0, 0.680], [5.0, 0.856], [10.0, 0.853], [20.0, 0.907], [40.0, 0.935], [80.0, 0.963]] },
          { name: "learned features (pretrained proxy)", color: "#4ea1ff", points: [[2.0, 0.813], [5.0, 0.909], [10.0, 0.907], [20.0, 0.966], [40.0, 0.966], [80.0, 0.972]] }
        ],
        interpret: "The x-axis is how many labeled examples per class the downstream classifier gets to train on; the y-axis is its accuracy on held-out test images. Both curves rise as you move right (more labels = better), but the blue learned-features curve sits ABOVE the red raw-pixels curve everywhere, and the vertical gap between them is widest at the far LEFT. Read that as: learned features help most exactly when labels are scarce, which is the whole point of using a pretrained featurizer. This is the healthy, expected pattern."
      },
      {
        type: "line",
        title: "Domain shift: features learned elsewhere give no lift (illustrative)",
        xlabel: "labeled examples per class",
        ylabel: "test accuracy",
        series: [
          { name: "raw pixels", color: "#ff7b72", points: [[2.0, 0.62], [5.0, 0.72], [10.0, 0.79], [20.0, 0.84], [40.0, 0.88], [80.0, 0.91]] },
          { name: "learned features (wrong domain)", color: "#ffb454", points: [[2.0, 0.60], [5.0, 0.70], [10.0, 0.77], [20.0, 0.83], [40.0, 0.87], [80.0, 0.90]] }
        ],
        interpret: "Same axes, but now the two curves sit almost on top of each other and the learned-features curve (orange) is even slightly BELOW raw pixels. There is no scarce-label gap to exploit. Recognise this when the pretraining images look nothing like your images -- ImageNet photos vs X-rays or microscope slides -- so the learned edges/textures do not match your domain. The fix is to fine-tune on in-domain data or pick a closer backbone; do not assume deep features always win. (Illustrative shapes.)"
      },
      {
        type: "line",
        title: "Wrong layer: too-early features stay low-level, the final layer over-specializes (illustrative)",
        xlabel: "labeled examples per class",
        ylabel: "test accuracy",
        series: [
          { name: "penultimate layer (right)", color: "#7ee787", points: [[2.0, 0.81], [5.0, 0.90], [10.0, 0.93], [20.0, 0.96], [40.0, 0.97], [80.0, 0.97]] },
          { name: "early conv layer (too low-level)", color: "#9aa7b4", points: [[2.0, 0.66], [5.0, 0.78], [10.0, 0.83], [20.0, 0.88], [40.0, 0.91], [80.0, 0.93]] },
          { name: "final softmax layer (over-specialized)", color: "#c89bff", points: [[2.0, 0.58], [5.0, 0.66], [10.0, 0.70], [20.0, 0.73], [40.0, 0.75], [80.0, 0.76]] }
        ],
        interpret: "Same accuracy-vs-labels axes, but each curve is a DIFFERENT layer of the same network used as the feature vector. The green penultimate-layer curve is highest -- high-level yet still generic. The grey early-layer curve trails it because edges and color blobs are too low-level to separate objects. The purple final-softmax curve is lowest and barely improves: it outputs probabilities over the ORIGINAL classes, so it is over-fit to the pretraining labels, not yours. Takeaway: read off the penultimate layer, not too early and not the very end. (Illustrative shapes.)"
      }
    ],
    caption: "Chart 1 is a real numpy+scikit-learn run on load_digits (1797 8x8 images); the learned-feature stand-in is a small network trained on a SEPARATE pretrain pool, an in-browser proxy for a pretrained CNN's penultimate layer (a real CNN cannot run here). Charts 2-3 are illustrative failure modes -- domain shift, and picking the wrong layer.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# Real bundled dataset: 1797 handwritten digit images, 8x8 = 64 pixels each.
X, y = load_digits(return_X_y=True)

# A PRETRAIN pool (to LEARN the featurizer) kept disjoint from the downstream data,
# mirroring how a CNN is pretrained on a separate, larger dataset (ImageNet).
X_pre, X_rest, y_pre, y_rest = train_test_split(
    X, y, test_size=0.7, stratify=y, random_state=0)
X_tr_full, X_te, y_tr_full, y_te = train_test_split(
    X_rest, y_rest, test_size=0.28, stratify=y_rest, random_state=1)

scaler = StandardScaler().fit(X_pre)
sc = scaler.transform

# LEARNED featurizer: a small network trained on the pretrain pool; use its 32-unit
# hidden layer as the feature vector -- the proxy for a pretrained CNN's penultimate layer.
net = MLPClassifier(hidden_layer_sizes=(32,), max_iter=600,
                    random_state=0).fit(sc(X_pre), y_pre)
def feat(a):                                  # hidden-layer activations (ReLU)
    return np.maximum(sc(a) @ net.coefs_[0] + net.intercepts_[0], 0)

rng = np.random.RandomState(0)
for k in [2, 5, 10, 20, 40, 80]:              # labeled examples per class
    idx = np.hstack([rng.choice(np.where(y_tr_full == c)[0], k, replace=False)
                     for c in np.unique(y_tr_full)])
    for name, tr, te in [("raw pixels", sc(X_tr_full), sc(X_te)),
                         ("learned feat", feat(X_tr_full), feat(X_te))]:
        clf = LogisticRegression(max_iter=2000).fit(tr[idx], y_tr_full[idx])
        print(f"k={k:>2}  {name:<12}: acc={clf.score(te, y_te):.3f}")
# Learned features win at every k, and by the most when labels are scarce.`
  };
})();
