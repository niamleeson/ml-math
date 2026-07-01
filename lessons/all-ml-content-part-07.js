/* All ML — authored content for Part 7: Computer Vision (7.1–7.31).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every displayed number was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 7.1 Image representation & color spaces ---------------- */
window.ALLML_CONTENT["7.1"] = {
  tagline: "Pixels become tensors, and color channels become the axes that every later vision model reads.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.1-image-representation-color-spaces.ipynb",
  context: String.raw`
    <p>Pixels become tensors, and color channels become the axes that every later vision model reads.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Image representation & color spaces chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$0.299(1)+0.587(0)+0.114(0)=0.299$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$2\times2\times3=12 channel values$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.2 Classical features (SIFT, HOG, edges, Hough) ---------------- */
window.ALLML_CONTENT["7.2"] = {
  tagline: "Before learned features, vision survived by measuring edges, corners, histograms, and geometric votes.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.2-classical-features.ipynb",
  context: String.raw`
    <p>Before learned features, vision survived by measuring edges, corners, histograms, and geometric votes.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Classical features (SIFT, HOG, edges, Hough) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$1+1+1.005+1.020=4.025 gradient weight$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$three collinear points vote for b=1, count 3$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.3 The convolution operation ---------------- */
window.ALLML_CONTENT["7.3"] = {
  tagline: "Convolution is the local dot product that lets one small filter scan an entire image.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.3-convolution-operation.ipynb",
  context: String.raw`
    <p>Convolution is the local dot product that lets one small filter scan an entire image.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. The convolution operation chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$Y_{i,j}=\sum_{u,v}X_{i+u,j+v}K_{u,v}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$1(1)+2(0)+3(0)+4(-1)=-3$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$(3-2)+1=2 positions per axis$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.4 CNN building blocks (stride, padding, pooling) ---------------- */
window.ALLML_CONTENT["7.4"] = {
  tagline: "Stride, padding, and pooling decide how much spatial detail a CNN keeps, skips, or summarizes.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.4-cnn-building-blocks.ipynb",
  context: String.raw`
    <p>Stride, padding, and pooling decide how much spatial detail a CNN keeps, skips, or summarizes.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. CNN building blocks (stride, padding, pooling) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$\lfloor(5-2)/2\rfloor+1=2$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$\max\{1,3,4,6\}=6$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.5 Transposed & dilated convolutions ---------------- */
window.ALLML_CONTENT["7.5"] = {
  tagline: "Dilated and transposed convolutions change resolution without changing the basic local-weight idea.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.5-transposed-dilated-convolutions.ipynb",
  context: String.raw`
    <p>Dilated and transposed convolutions change resolution without changing the basic local-weight idea.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Transposed & dilated convolutions chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$(2-1)2+1=3 effective field$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$1+2+3+4=10 overlap value$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.6 Depthwise-separable convolutions (MobileNet) ---------------- */
window.ALLML_CONTENT["7.6"] = {
  tagline: "Depthwise-separable convolution keeps spatial filtering and channel mixing as two cheaper jobs.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.6-depthwise-separable-convolutions.ipynb",
  context: String.raw`
    <p>Depthwise-separable convolution keeps spatial filtering and channel mixing as two cheaper jobs.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Depthwise-separable convolutions (MobileNet) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$3\times3\times3\times8=216$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$3\times3\times3+3\times8=27+24=51$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.7 Squeeze-and-Excitation blocks ---------------- */
window.ALLML_CONTENT["7.7"] = {
  tagline: "Squeeze-and-Excitation lets a network ask which channels matter before passing features onward.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.7-squeeze-excitation-blocks.ipynb",
  context: String.raw`
    <p>Squeeze-and-Excitation lets a network ask which channels matter before passing features onward.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Squeeze-and-Excitation blocks chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$(0+1+2+3+4+5+6+7+8)/9=4$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$1/(1+e^{-1})=0.731$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.8 LeNet & AlexNet ---------------- */
window.ALLML_CONTENT["7.8"] = {
  tagline: "LeNet and AlexNet show the historical jump from small CNNs to deep visual feature machines.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.8-lenet-alexnet.ipynb",
  context: String.raw`
    <p>LeNet and AlexNet show the historical jump from small CNNs to deep visual feature machines.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. LeNet & AlexNet chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$5\times5\times1\times6+6=156$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$11\times11\times3\times96+96=34{,}944$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.9 VGG & Inception ---------------- */
window.ALLML_CONTENT["7.9"] = {
  tagline: "VGG and Inception teach two complementary design instincts: go deeper simply, or branch by scale.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.9-vgg-inception.ipynb",
  context: String.raw`
    <p>VGG and Inception teach two complementary design instincts: go deeper simply, or branch by scale.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. VGG & Inception chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$1+(3-1)+(3-1)=5$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$16+32+8+8=64 channels$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.10 ResNet & residual learning ---------------- */
window.ALLML_CONTENT["7.10"] = {
  tagline: "Residual learning makes deep networks trainable by asking layers to learn corrections, not entire transformations.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.10-resnet-residual-learning.ipynb",
  context: String.raw`
    <p>Residual learning makes deep networks trainable by asking layers to learn corrections, not entire transformations.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. ResNet & residual learning chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$[1,2,3]+[0.1,-0.2,0.3]=[1.1,1.8,3.3]$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$1.05^{10}=1.629$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.11 DenseNet & EfficientNet ---------------- */
window.ALLML_CONTENT["7.11"] = {
  tagline: "DenseNet reuses all previous features; EfficientNet scales depth, width, and resolution together.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.11-densenet-efficientnet.ipynb",
  context: String.raw`
    <p>DenseNet reuses all previous features; EfficientNet scales depth, width, and resolution together.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. DenseNet & EfficientNet chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$16+4\times12=64 channels$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$1.44\times1.21^2\times1.3225^2=3.651$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.12 ConvNeXt ---------------- */
window.ALLML_CONTENT["7.12"] = {
  tagline: "ConvNeXt modernizes CNNs by borrowing transformer-era design choices while keeping convolution.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.12-convnext.ipynb",
  context: String.raw`
    <p>ConvNeXt modernizes CNNs by borrowing transformer-era design choices while keeping convolution.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. ConvNeXt chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$1+2+5+6=14 for the first patch$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$[1,1]+0.1[3,-2]=[1.3,0.8]$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.13 Anchors, IoU, NMS & mAP ---------------- */
window.ALLML_CONTENT["7.13"] = {
  tagline: "Detection metrics are geometry plus ranking: boxes must overlap, duplicates must vanish, and precision must stay high.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.13-anchors-iou-nms-map.ipynb",
  context: String.raw`
    <p>Detection metrics are geometry plus ranking: boxes must overlap, duplicates must vanish, and precision must stay high.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Anchors, IoU, NMS & mAP chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\operatorname{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$4/(9+9-4)=4/14=0.286$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$(0.78+0.62+0.90)/3=0.767$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.14 Object detection: R-CNN family ---------------- */
window.ALLML_CONTENT["7.14"] = {
  tagline: "The R-CNN family turns detection into propose, pool, classify, and refine.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.14-rcnn-family.ipynb",
  context: String.raw`
    <p>The R-CNN family turns detection into propose, pool, classify, and refine.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Object detection: R-CNN family chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$6+7+8+11+12+13+16+17+18=108$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$2{,}000\times2.5/1000=5.0 seconds$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.15 Object detection: YOLO & SSD ---------------- */
window.ALLML_CONTENT["7.15"] = {
  tagline: "YOLO and SSD make detection dense and one-stage, predicting boxes directly over grids and anchors.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.15-yolo-ssd.ipynb",
  context: String.raw`
    <p>YOLO and SSD make detection dense and one-stage, predicting boxes directly over grids and anchors.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Object detection: YOLO & SSD chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$\lfloor4[0.62,0.28]\rfloor=[2,1]$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$0.8\times0.7=0.56$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.16 Feature Pyramid Networks & RetinaNet ---------------- */
window.ALLML_CONTENT["7.16"] = {
  tagline: "FPNs restore multi-scale features; RetinaNet fixes class imbalance with focal loss.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.16-fpn-retinanet.ipynb",
  context: String.raw`
    <p>FPNs restore multi-scale features; RetinaNet fixes class imbalance with focal loss.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Feature Pyramid Networks & RetinaNet chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$2\times2 becomes 4\times4 by copying$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$(1-0.9)^2=0.01$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.17 Object detection: DETR ---------------- */
window.ALLML_CONTENT["7.17"] = {
  tagline: "DETR reframes detection as set prediction with one-to-one matching.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.17-detr.ipynb",
  context: String.raw`
    <p>DETR reframes detection as set prediction with one-to-one matching.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Object detection: DETR chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\hat\pi=\arg\min_{\pi}\sum_i C_{i,\pi(i)}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$0.3+0.5=0.8 versus 1.1+0.7=1.8$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$((0.2+0.1)+(0.5+0.3))/2=0.55$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.18 Semantic segmentation (FCN, U-Net) ---------------- */
window.ALLML_CONTENT["7.18"] = {
  tagline: "Semantic segmentation changes the output from one label per image to one label per pixel.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.18-semantic-segmentation.ipynb",
  context: String.raw`
    <p>Semantic segmentation changes the output from one label per image to one label per pixel.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Semantic segmentation (FCN, U-Net) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$8/9=0.889 correct pixels$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$3/4=0.750 class IoU$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.19 Instance & panoptic segmentation (Mask R-CNN) ---------------- */
window.ALLML_CONTENT["7.19"] = {
  tagline: "Instance and panoptic segmentation add object identity to the pixel-labeling story.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.19-instance-panoptic-segmentation.ipynb",
  context: String.raw`
    <p>Instance and panoptic segmentation add object identity to the pixel-labeling story.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Instance & panoptic segmentation (Mask R-CNN) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$4/8=0.500 mask IoU$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$(0.8+0.6)/(2+0.5+0.5)=0.467$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.20 Vision Transformers (ViT) ---------------- */
window.ALLML_CONTENT["7.20"] = {
  tagline: "Vision Transformers turn images into token sequences and let attention choose the interactions.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.20-vision-transformers-vit.ipynb",
  context: String.raw`
    <p>Vision Transformers turn images into token sequences and let attention choose the interactions.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Vision Transformers (ViT) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}(QK^\top/\sqrt d)V$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$(4/2)\times(4/2)=4 tokens$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$e^1/(e^1+e^0)=0.731 attention weight$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.21 Swin Transformer ---------------- */
window.ALLML_CONTENT["7.21"] = {
  tagline: "Swin makes transformer attention local, shifted, and hierarchical so high-resolution vision is affordable.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.21-swin-transformer.ipynb",
  context: String.raw`
    <p>Swin makes transformer attention local, shifted, and hierarchical so high-resolution vision is affordable.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Swin Transformer chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$16^2=256 global pairs$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$4\times4^2=64 window pairs$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.22 Self-supervised vision (MAE, DINO, SimCLR) ---------------- */
window.ALLML_CONTENT["7.22"] = {
  tagline: "Self-supervised vision learns from agreement, reconstruction, or teacher targets before labels arrive.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.22-self-supervised-vision.ipynb",
  context: String.raw`
    <p>Self-supervised vision learns from agreement, reconstruction, or teacher targets before labels arrive.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Self-supervised vision (MAE, DINO, SimCLR) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$e^4/(e^4+e^{0.6}+e^{-0.4})=0.957$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$(0.04+0.25+0.25)/3=0.180$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.23 Image captioning ---------------- */
window.ALLML_CONTENT["7.23"] = {
  tagline: "Image captioning connects visual features to a language decoder one word at a time.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.23-image-captioning.ipynb",
  context: String.raw`
    <p>Image captioning connects visual features to a language decoder one word at a time.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Image captioning chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$[1,1]\cdot[1,0.5]=1.5$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$-\ln(0.7)=0.357$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.24 Super-resolution ---------------- */
window.ALLML_CONTENT["7.24"] = {
  tagline: "Super-resolution reconstructs plausible high-frequency detail from low-resolution evidence.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.24-super-resolution.ipynb",
  context: String.raw`
    <p>Super-resolution reconstructs plausible high-frequency detail from low-resolution evidence.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Super-resolution chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$10\log_{10}(1/0.001)=30$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$four channels become a 2\times2 patch$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.25 Optical flow ---------------- */
window.ALLML_CONTENT["7.25"] = {
  tagline: "Optical flow estimates where each pixel moved between frames.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.25-optical-flow.ipynb",
  context: String.raw`
    <p>Optical flow estimates where each pixel moved between frames.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Optical flow chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$\sqrt{(0.5-1)^2+0^2}=0.5$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$-(-2)/1=2 normal flow$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.26 Pose estimation & keypoints ---------------- */
window.ALLML_CONTENT["7.26"] = {
  tagline: "Pose estimation turns people into structured keypoints and limbs.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.26-pose-estimation-keypoints.ipynb",
  context: String.raw`
    <p>Pose estimation turns people into structured keypoints and limbs.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Pose estimation & keypoints chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$\sqrt{0.1^2+0.2^2}=0.224 \lt 0.5$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$[3,2]-[1,1]=[2,1]$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.27 OCR & scene text ---------------- */
window.ALLML_CONTENT["7.27"] = {
  tagline: "OCR converts pixels of text into character sequences while handling uncertain alignment.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.27-ocr-scene-text.ipynb",
  context: String.raw`
    <p>OCR converts pixels of text into character sequences while handling uncertain alignment.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. OCR & scene text chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$0.95\times0.90\times0.80\times0.99=0.677$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$book to back needs two substitutions$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.28 Face recognition & metric learning ---------------- */
window.ALLML_CONTENT["7.28"] = {
  tagline: "Face recognition uses metric learning so identity is measured by distance in embedding space.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.28-face-recognition-metric-learning.ipynb",
  context: String.raw`
    <p>Face recognition uses metric learning so identity is measured by distance in embedding space.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Face recognition & metric learning chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$[3,4]/5=[0.6,0.8]$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$0.2^2-0.4^2+0.4=0.280$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.29 Video understanding & action recognition ---------------- */
window.ALLML_CONTENT["7.29"] = {
  tagline: "Video understanding adds time: the model must recognize change, not just appearance.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.29-video-understanding-action-recognition.ipynb",
  context: String.raw`
    <p>Video understanding adds time: the model must recognize change, not just appearance.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Video understanding & action recognition chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$([1,0]+[2,1]+[3,1])/3=[2,0.667]$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$2\times2\times2=8 local values$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.30 3D vision & point clouds (PointNet) ---------------- */
window.ALLML_CONTENT["7.30"] = {
  tagline: "PointNet handles unordered 3D points by applying shared features and symmetric pooling.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.30-point-clouds-pointnet.ipynb",
  context: String.raw`
    <p>PointNet handles unordered 3D points by applying shared features and symmetric pooling.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. 3D vision & point clouds (PointNet) chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$\text{visual output}=\text{local evidence}+\text{shape bookkeeping}+\text{task score}$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$\max\{[1,3],[2,1],[0,5]\}=[2,5]$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$0.5+0.5=1.000 Chamfer$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};

/* ---------------- 7.31 Neural rendering & NeRF ---------------- */
window.ALLML_CONTENT["7.31"] = {
  tagline: "NeRF renders a scene by accumulating color and density along camera rays.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.31-neural-rendering-nerf.ipynb",
  context: String.raw`
    <p>NeRF renders a scene by accumulating color and density along camera rays.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the dot products, tensor axes, norms, and weighted sums used by the visual operation.</li>
      <li><b>Convolution and attention</b> from earlier deep-learning lessons explain how local evidence or token evidence is gathered and reweighted.</li>
      <li><b>Losses and metrics</b> turn the visual output into a decision: a class, box, mask, caption token, flow vector, point-cloud feature, or rendered color.</li>
    </ul>
    <p>Where it leads: this lesson supports the rest of Part 7. Later lessons reuse the same small arithmetic at larger scale, especially when moving from image tensors to detectors (7.13), segmenters (7.18), transformers (7.20), video (7.29), 3D point clouds (7.30), and NeRF (7.31).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that pixels alone are too literal. A model needs a way to preserve the evidence that matters while ignoring nuisance changes such as small shifts, scale, duplicate boxes, background clutter, or uncertain alignment.</p>
    <p>The naive solution is to flatten everything and learn from raw coordinates. That throws away the visual structure: nearby pixels are related, channels carry different evidence, boxes overlap geometrically, frames move through time, and rays accumulate color in depth order.</p>
    <p>The design decision people gloss over is what structure to protect. Neural rendering & NeRF chooses a particular bias about locality, scale, identity, sequence, or geometry. That bias is why the method can generalize from small examples instead of memorizing one arrangement of pixels.</p>`,
  mathematics: String.raw`
    <p>The core calculation can be written as:</p>
    <div class="formula-box">$$C(r)=\sum_i T_i\alpha_i c_i,\quad T_i=\prod_{j\lt i}(1-\alpha_j)$$</div>
    <p>Here $X$ is the image, feature map, token table, mask, box set, point cloud, or ray sample table; the learned or hand-written rule produces a score; and the downstream metric decides which scores matter.</p>

    <p><b>First hand-check.</b></p>
    <ol class="work">
      <li>$1-e^{-3(0.5)}=0.777$</li>
    </ol>
    <p>This is the smallest reliable version of the mechanism. The same arithmetic is what a full system repeats over thousands of pixels, anchors, tokens, or samples.</p>

    <p><b>Second hand-check.</b></p>
    <ol class="work">
      <li>$[0.2,0.4,0.04] from weights [0.2,0.4,0.04]$</li>
    </ol>
    <p>The interpretation is practical: before trusting a large visual model, verify the local number, the shape change, and the decision rule. Computer vision bugs often look like modeling failures while actually being bookkeeping failures.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Silent shape mistakes.</b> The formula specifies which axes interact; swapping height, width, channel, time, or token axes can produce plausible pictures with wrong numbers.</li>
      <li><b>Confusing response with decision.</b> A heatmap, logit, IoU, attention weight, or density is not the final answer until the threshold, matching rule, pooling rule, or loss has been applied.</li>
      <li><b>Using the wrong inductive bias.</b> Local convolutions, global attention, one-to-one matching, symmetric point pooling, and ray accumulation encode different assumptions; the mechanism fails when the assumption does not match the visual task.</li>
    </ul>`
};
