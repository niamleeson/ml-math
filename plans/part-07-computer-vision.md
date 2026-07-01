# Part 7 — Computer Vision

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F6 (Vision).

### 7.1 — Image representation & color spaces   [notebook: 7.1-image-representation-color-spaces.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Camera/web preprocessing — normalize byte RGB before inference: lesson pixel $128/255=0.5019607843$; raw $255$ is $255\times$ a $[0,1]$ model's max input.
2. Medical grayscale viewers — preserve luminance rather than channel average: lesson orange pixel gives $0.5936509804$ luminance vs $0.5006535948$ average.
3. OpenCV-to-web pipelines — prevent BGR/RGB swaps: lesson red $[1,0,0]$ stored as BGR $[0,0,1]$, so one channel-order bug flips red to blue.
4. Dataset sanity dashboards — verify tensor shape and totals: lesson $2\times2\times3$ color toy has whole-tensor sum $6$.
5. Edge/contrast preprocessing — green brightness dominates: lesson weights make green $0.587$, red $0.299$, blue $0.114$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `preprocess_image()` normalizes, tracks channel order, and computes luminance; verify $128/255=0.5019607843$, RGB toy sum $6$, and $Y([255,128,0])=0.5936509804$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) RGB/BGR/grayscale panels and first feature maps (b) accuracy-vs-complexity curve
- Pitfall on D5: RGB/BGR swap and byte/float scale mix reproduced on CIFAR, then fixed with explicit channel contract and normalization.
- Notes: Delete dead copied `conv2d`/`iou` if unused; mark CIFAR numbers illustrative because no lesson production benchmark is given.

### 7.2 — Classical features (SIFT, HOG, edges, Hough)   [notebook: 7.2-classical-features.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Lane and document-line detection — Hough votes from points $(2,0),(2,1),(2,3)$ all give $\rho=2$ at $0^\circ$.
2. Pedestrian/person descriptors — HOG bins gradients: lesson cell sends $12$ magnitude to the middle bin and $4$ to the first.
3. Edge-quality checks — gradient vector $(3,4)$ has magnitude $5$ and orientation about $53.1^\circ$.
4. Robust patch matching — diagonal kernel on $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ returns $-3$, a re-derivable local contrast score.
5. Shift-tolerant feature summaries — max-pooling the lesson $4\times4$ activation returns $\begin{bmatrix}6&5\\2&9\end{bmatrix}$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `extract_classical_features()` computes gradient magnitude/orientation, HOG bins, and Hough votes; verify $m=5$, middle-bin total $12$, Hough $\rho=2$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) edge/HOG/Hough feature-map panels (b) accuracy-vs-complexity curve
- Pitfall on D5: over-pooling descriptors and confusing fixed features with learned ones; reproduce loss of fine CIFAR localization, then fix with smaller cells/multiscale features.
- Notes: Delete dead `conv2d` unless called for the filter; keep SIFT discussion simulated with NumPy/sklearn only.

### 7.3 — The convolution operation   [notebook: 7.3-convolution-operation.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Mobile photo classifiers — replace dense image wiring: lesson $5\times5$ dense $25\to25$ uses $625$ weights vs a $2\times2$ conv uses $4$ weights plus bias.
2. Industrial defect scans — shared kernels flag repeated scratches: lesson ramp produces a constant $2\times2$ feature map of $-4$.
3. Medical edge filters — one local dot product reports $-3$ on the lesson $2\times2$ patch and diagonal kernel.
4. Embedded vision — output sizing controls memory: lesson $5\times5$, $k=2$, stride $2$ gives $2\times2$ output.
5. Deep receptive-field design — stacked $3\times3$ layers grow reach as $1+2L$, so $L=2$ sees $5\times5$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `conv2d_valid()` implements cross-correlation with stride/padding; verify patch response $-3$, ramp map all $-4$, and shape cases $4$, $2$, $6$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) learned/fixed kernel feature maps across rungs (b) accuracy-vs-complexity curve
- Pitfall on D5: confusing convolution with true flipped convolution; reproduce wrong orientation response, then fix by naming and testing cross-correlation.
- Notes: Keep only the called `conv2d_valid`; delete copied `iou` and unrelated helpers.

### 7.4 — CNN building blocks (stride, padding, pooling)   [notebook: 7.4-cnn-building-blocks.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. OCR/text recognition — preserve small strokes: lesson stride-$2$ formula on $5\times5,k=2$ yields only $2\times2$ cells.
2. Border-sensitive inspection — padding gives edge pixels chances: lesson $5\times5,k=2,p=1,s=1$ yields $6\times6$.
3. Image classifiers — max pooling keeps strongest local evidence: lesson pooled map is $\begin{bmatrix}6&5\\2&9\end{bmatrix}$.
4. CNN parameter budgets — RGB $3\times3$ conv with $8$ filters has $3\times3\times3\times8=216$ weights.
5. Residual-path design — shape choices must align; one stray stride breaks add/concat paths that require identical $H,W,C$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `cnn_block()` applies conv shape arithmetic, padding, stride, and pooling; verify $n_{out}=2$, $6$, pooled $[[6,5],[2,9]]$, and $216$ weights.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) activation maps before/after stride/pad/pool (b) accuracy-vs-complexity curve
- Pitfall on D5: dropping the floor or assuming padding preserves size; reproduce shape mismatch on CIFAR blocks, then fix with explicit formula assertions.
- Notes: Delete any copied detector IoU code; caveat that all runtime sizes stay tiny and CPU-only.

### 7.5 — Transposed & dilated convolutions   [notebook: 7.5-transposed-dilated-convolutions.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Semantic segmentation — dilation sees context without extra weights: lesson $k=3,d=2$ gives effective width $5$ with $3$ taps.
2. Super-resolution decoders — transposed conv expands a length-$3$ map with $s=2,k=3,p=0,o=0$ to length $7$.
3. U-Net skip alignment — output padding changes length from $5$ to $6$ with the same settings except $o=1$.
4. Artifact debugging — uneven overlap gives position $2$ two contributions while neighbors get one, explaining checkerboards.
5. Dense prediction on small objects — dilated dot product over $[1,2,3,4,5]$ with weights $[1,0,-1]$ returns $-4$ while skipping $2$ and $4$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `dilated_or_transposed_conv()` computes effective kernel and upsampling shape; verify $k_{eff}=5$, dilated sum $-4$, transposed lengths $7$, $5$, $6$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) dilation gridding / upsampling panels (b) IoU-vs-complexity curve
- Pitfall on D5: uneven stride-kernel overlap creates checkerboards; reproduce on CIFAR-like tiny images, then fix with resize-then-convolve.
- Notes: Delete unused generic `conv2d` if replaced by topic-specific helpers; no pretrained decoders.

### 7.6 — Depthwise-separable convolutions (MobileNet)   [notebook: 7.6-depthwise-separable-convolutions.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Phone image classifiers — toy $D=3,C=3,C'=8$ drops from $216$ to $51$ multiplies per output pixel.
2. Browser/on-device filters — separable conv uses $51/216=0.236111\ldots$, about $23.6\%$ of standard work.
3. Edge devices — the same $5\times5$ output grid saves $5400-1275=4125$ multiplies.
4. Efficient segmentation backbones — depthwise step keeps $3$ channels after $27$ spatial multiplies, then pointwise mixes.
5. Architecture tradeoff analysis — pointwise mixing still costs $3\times8=24$ multiplies, so savings are not just the depthwise $27$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `separable_conv_features()` runs depthwise spatial filters plus pointwise mixing; verify standard $216$, separable $51$, ratio $0.236111$, saved $4125$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) standard-vs-depthwise feature-map panels (b) accuracy-vs-complexity curve
- Pitfall on D5: expecting identical expressiveness and forgetting pointwise cost; reproduce accuracy drop under too-narrow channels, then fix with modest pointwise width.
- Notes: Include compute bars as annotations, but the required closing metric curve remains accuracy.

### 7.7 — Squeeze-and-Excitation blocks   [notebook: 7.7-squeeze-excitation-blocks.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. MobileNet/EfficientNet image classification — channel gate $\sigma(2)\approx0.8808$ boosts one channel while $\sigma(-1)\approx0.2689$ damps another.
2. Medical image triage — global average pooling summarizes a $2\times2$ channel to $z_1=16/4=4$.
3. Product-image quality models — channel $2$ with values $[[2,0],[2,0]]$ squeezes to $z_2=1$.
4. Adaptive feature selection — excitation hidden unit $0.5\cdot4-1\cdot1=1$ mixes channel evidence.
5. Edge CNN calibration — gate $0.8808$ turns a bottom-right value $7$ into $6.1656$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `se_block()` squeezes channel means, applies a tiny excitation MLP, and gates maps; verify $z=[4,1]$, hidden $1$, gates $[0.8808,0.2689]$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) channel gate and recalibrated feature-map panels (b) accuracy-vs-complexity curve
- Pitfall on D5: reading SE as spatial attention; reproduce failure to highlight one corner differently, then fix by explaining channel-only gates or adding a spatial baseline.
- Notes: Delete copied convolution helpers if a NumPy feature table suffices.

### 7.8 — LeNet & AlexNet   [notebook: 7.8-lenet-alexnet.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Handwritten digit recognition — LeNet first conv maps $32\times32$ to $28\times28\times6$ with $150$ weights.
2. ImageNet-era classifiers — AlexNet first conv maps $227\times227\times3$ to $55\times55\times96$ with $34{,}848$ weights.
3. Map-size planning — LeNet $2\times2$ pool halves $28\times28\times6$ to $14\times14\times6$.
4. Training speed — ReLU sends $-3\to0$, $0.5\to0.5$, $4\to4$ without sigmoid saturation.
5. Memory audits — a $6\times6\times256$ tensor into $4096$ dense units uses $37{,}752{,}832$ parameters with biases.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `tiny_lenet()` builds conv-pool-ReLU-classifier shape accounting; verify $28\times28\times6$, $150$, $14\times14\times6$, and dense $37{,}752{,}832$ as arithmetic only.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) stage-by-stage feature/prediction panels (b) accuracy-vs-complexity curve
- Pitfall on D5: flattening too early and copying historical $11\times11$ stride-$4$ kernels blindly; reproduce small-detail loss, then fix with smaller first kernels.
- Notes: Do not train AlexNet; simulate architecture arithmetic and train only tiny CPU models.

### 7.9 — VGG & Inception   [notebook: 7.9-vgg-inception.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Simple CNN backbones — two stacked $3\times3$ layers see a $5\times5$ receptive field.
2. Parameter-efficient filters — one $5\times5$ layer has $25$ weights vs two $3\times3$ layers with $18$ in the one-channel toy.
3. Multi-scale inspection — Inception branches with $16,32,8,8$ channels concatenate to $64$.
4. Cost-controlled wide branches — bottleneck cuts a $5\times5$ branch from $51{,}200$ to $13{,}824$ multiplies per location.
5. Architecture debugging — padded $3\times3$ on $28\times28$ stays $28$, unpadded becomes $26$, so concat fails.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `vgg_or_inception_features()` compares stacked small filters and multi-branch concat; verify receptive field $5$, weights $25$ vs $18$, channels $64$, cost $13{,}824$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) VGG-stack vs Inception-branch feature panels (b) accuracy-vs-complexity curve
- Pitfall on D5: concatenating mismatched branch sizes; reproduce $28$ vs $26$ failure, then fix with padding assertions.
- Notes: Delete unused detector helpers; keep branch costs illustrative and re-derivable from lesson arithmetic.

### 7.10 — ResNet & residual learning   [notebook: 7.10-resnet-residual-learning.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Deep image classifiers — residual vector $[0.1,-0.2,0.3]$ changes $[1,2,3]$ to $[1.1,1.8,3.3]$.
2. Identity-preserving backbones — zero residual returns $y=x=[1,2,3]$ exactly.
3. Gradient-flow debugging — with $dL/dy=2,dF/dx=0.1$, shortcut gradient is $2.2$ vs branch-only $0.2$.
4. Channel projection design — $64\to128$ shortcut needs $1\times1\times64\times128=8192$ weights.
5. Detection/segmentation backbones — downsample block $56\times56\times64\to28\times28\times128$ must align stride and projection on both paths.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `residual_block()` adds identity plus correction and optional projection; verify $[1.1,1.8,3.3]$, identity case, gradient $2.2$, projection $8192$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) plain-vs-residual prediction/feature panels (b) accuracy-vs-complexity curve
- Pitfall on D5: adding tensors with mismatched shapes; reproduce failing shortcut, then fix with $1\times1$ projection and stride alignment.
- Notes: Tiny residual MLP/CNN only; no large ResNet downloads.

### 7.11 — DenseNet & EfficientNet   [notebook: 7.11-densenet-efficientnet.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Feature-reuse backbones — DenseNet with $C_0=16,k=12,L=4$ grows to $64$ channels.
2. Memory planning — a layer reading $40$ channels and outputting $12$ with $3\times3$ uses $4320$ weights.
3. Compression stages — transition $\theta=0.5$ cuts $64$ channels to $32$.
4. Model-family scaling — EfficientNet constants $\alpha=1.2,\beta=1.1,\gamma=1.15,\phi=2$ give depth $1.44$, width $1.21$, resolution $1.3225$.
5. Compute budgeting — combined factor $1.44\times1.4641\times1.74800625\approx3.685$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `dense_or_compound_block()` concatenates growth channels and computes compound scaling; verify $28,40,64$, $4320$, $32$, and factor $3.685$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) feature-reuse/scaling panels (b) accuracy-vs-complexity curve
- Pitfall on D5: confusing DenseNet concat with ResNet add and underestimating compound compute; reproduce channel blow-up, then fix with compression/budget cap.
- Notes: Keep compute numbers from lesson; no EfficientNet pretrained downloads.

### 7.12 — ConvNeXt   [notebook: 7.12-convnext.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Modern CNN backbones — depthwise diagonal response on lesson patch is $-3$ before channel mixing.
2. Dense prediction features — ramp feature map remains all $-4$, preserving local slope structure.
3. Small-batch training — LayerNorm on $[1,2,3]$ has mean $2$, variance $2/3$, normalized values about $[-1.225,0,1.225]$.
4. Inverted bottlenecks — $C=3$ and expansion ratio $4$ create $12$ hidden channels.
5. Residual channel budget — pointwise expand/project at one location counts $3\times12+12\times3=72$ weights.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `convnext_block()` does depthwise spatial mix, channel LayerNorm, expansion/projection, residual add; verify response $-3$, LN values, hidden $12$, weights $72$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) depthwise/LN/residual feature panels (b) accuracy-vs-complexity curve
- Pitfall on D5: calling ConvNeXt attention or replacing depthwise with full conv; reproduce cost/behavior mismatch, then fix with per-channel spatial filters.
- Notes: CPU tiny ConvNeXt-like block; delete dead attention or IoU code.

### 7.13 — Anchors, IoU, NMS & mAP   [notebook: 7.13-anchors-iou-nms-map.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Object detector evaluation — boxes $[0,0,3,3]$ and $[1,1,4,4]$ have IoU $4/14\approx0.286$.
2. Anchor target assignment — ground truth $[1,1,3,3]$ gives anchor IoUs $1/7\approx0.143$ and $4/9\approx0.444$.
3. Duplicate removal — NMS suppresses box $1$ because IoU $6.25/11.75\approx0.532>0.3$.
4. Leaderboard metrics — lesson precision/recall steps yield AP $0.33+0.255+0.198=0.783$.
5. Set matching — cost matrix diagonal $0.3+0.5=0.8$ beats cross $1.1+0.7=1.8$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `detect_and_score()` computes IoU, anchor assignment, NMS, AP; verify $0.286$, $4/9$, kept `[0,2]`, AP $0.783$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) predicted/detected boxes and NMS panels (b) IoU-vs-complexity curve
- Pitfall on D5: using intersection over predicted area or running NMS before sorting; reproduce duplicate/mislocalized detections, then fix with union IoU and score sort.
- Notes: Keep `iou` because used; delete copied `conv2d` if unused.

### 7.14 — Object detection: R-CNN family   [notebook: 7.14-rcnn-family.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Proposal triage — lesson proposal IoU $4/14\approx0.286$ fails an illustrative $0.5$ positive threshold.
2. Faster R-CNN RPN labels — anchor IoUs $1/7$, $4/9$, $4/9$ choose first best index $1$.
3. Region feature pooling — proposal values $[[1,3],[2,4]]$ max-pool to $4$ or average to $2.5$.
4. Duplicate cleanup — second-stage NMS keeps `[0,2]` after suppressing IoU $0.532>0.3$.
5. Box refinement — proposal $[0,0,3,3]+[1,1,1,1]=[1,1,4,4]$ reaches IoU $1$ with the target.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `two_stage_detect()` proposes boxes, pools RoI features, classifies, regresses, and NMSes; verify IoU $0.286$, pool $4$, refined IoU $1$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) proposal/refined-box panels (b) IoU-vs-complexity curve
- Pitfall on D5: thinking proposals are final detections and rounding RoIs too early; reproduce poor small-object boxes, then fix with refinement and RoIAlign-style interpolation.
- Notes: Simulate RoI pooling/alignment; no detector model downloads.

### 7.15 — Object detection: YOLO & SSD   [notebook: 7.15-yolo-ssd.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Real-time cameras — grid cell $(i,j)=(2,3)$ with offsets $(0.75,0.25)$ yields image center $(52,44)$ at stride $16$.
2. Default-box assignment — anchor overlaps $1/7\approx0.143$ and $4/9\approx0.444$ choose index $1$.
3. Confidence ranking — objectness $0.8$ times class $0.6$ gives $0.48$, beating $0.5\times0.9=0.45$.
4. Dense detector cleanup — NMS removes a $0.532$ IoU duplicate and keeps `[0,2]`.
5. Localization validation — same lesson boxes score IoU $4/14\approx0.286$ before refinement.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `one_stage_detect()` decodes cell/anchor boxes with objectness and NMS; verify center $(52,44)$, confidence $0.48$, and kept `[0,2]`.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) grid/anchor prediction panels (b) IoU-vs-complexity curve
- Pitfall on D5: decoding box centers without cell offset or multiplying class scores without objectness; reproduce collapsed boxes, then fix with full formula.
- Notes: Treat digits/CIFAR as toy detection by drawing synthetic boxes around objects; no YOLO downloads.

### 7.16 — Feature Pyramid Networks & RetinaNet   [notebook: 7.16-fpn-retinanet.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Small-object detection — FPN merge adds lateral $[[1,2],[3,4]]$ and upsampled $[[10,10],[20,20]]$ to $[[11,12],[23,24]]$.
2. Anchor coverage — scale levels compare anchors with IoUs $1/7\approx0.143$ and $4/9\approx0.444$.
3. Class-imbalance training — focal loss at $p_t=0.9$ is about $0.00026$.
4. Hard-example emphasis — focal loss at $p_t=0.1$ is about $0.466$, roughly $1770\times$ the easy example.
5. Detector reporting — same AP calculation gives $0.783$ from precision/recall steps.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `fpn_retina_step()` aligns and adds pyramid maps, assigns anchors, and computes focal loss; verify merged map, focal losses $0.00026$ and $0.466$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) pyramid-level detection panels (b) IoU-vs-complexity curve
- Pitfall on D5: turning focal loss into a magic imbalance cure; reproduce noisy hard-label overweighting, then fix with label checks/alpha-gamma ablation.
- Notes: Simulate FPN maps and dense anchors; delete unrelated template helpers.

### 7.17 — Object detection: DETR   [notebook: 7.17-detr.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. NMS-free detection — cost matrix diagonal $0.3+0.5=0.8$ beats cross $1.8$ for one-to-one matching.
2. Box-cost design — lesson boxes have $1-\operatorname{IoU}=1-4/14\approx0.714$.
3. Loss-weight tuning — class $0.2$ plus box $0.6$ ties class $0.7$ plus box $0.1$ at $0.8$.
4. Query budgeting — $5$ queries with $2$ objects leave $3$ no-object targets.
5. Evaluation continuity — DETR still reports AP $0.783$ on the lesson precision-recall toy.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `set_predict_and_match()` emits fixed query boxes/classes and Hungarian-style assignment; verify costs $0.8$ vs $1.8$, no-object count $3$, AP $0.783$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) object-query matching panels (b) IoU-vs-complexity curve
- Pitfall on D5: dropping the no-object class or sorting predictions before matching; reproduce duplicated objects, then fix with permutation-invariant matching.
- Notes: Use scipy/sklearn or brute-force matching for tiny query counts; no transformer downloads.

### 7.18 — Semantic segmentation (FCN, U-Net)   [notebook: 7.18-semantic-segmentation.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Medical organ masks — lesson mask has class counts: $3$ class-0, $4$ class-1, $2$ class-2 pixels.
2. Road/scene parsing — pixel accuracy toy gets $8/9\approx0.889$ after one wrong pixel.
3. Region-quality reporting — class-1 IoU is $3/4=0.75$.
4. U-Net boundary recovery — concat $2\times2\times3$ encoder with $2\times2\times2$ decoder to $2\times2\times5$.
5. Per-pixel training — logits $[1,2,0]$ give true-class probability $0.665$ and CE $0.408$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `segment_pixels()` predicts per-pixel labels, computes pixel accuracy/IoU, and optional skip concat; verify $8/9$, IoU $0.75$, concat $2\times2\times5$, CE $0.408$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) predicted mask panels (b) IoU-vs-complexity curve
- Pitfall on D5: reporting only pixel accuracy or resizing masks like photos; reproduce high background accuracy with poor IoU, then fix with class IoU and nearest-neighbor masks.
- Notes: Use synthetic masks for all rungs; CIFAR masks may be illustrative/simulated boxes or color-threshold masks.

### 7.19 — Instance & panoptic segmentation (Mask R-CNN)   [notebook: 7.19-instance-panoptic-segmentation.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Retail shelf instance counts — semantic mask's four class-1 pixels do not say how many objects own them.
2. Mask evaluation — class-1 mask IoU is $3/4=0.75$.
3. RoI boundary precision — interpolation at coordinate $1.5$ between $10$ and $14$ gives $12$; rounding gives $10$, a $2$-unit error.
4. Same-class separation — two $2\times2$ instance masks each have area $4$ but keep IDs $1$ and $2$.
5. Panoptic maps — in a $4\times4$ image, two four-pixel instances leave $16-8=8$ background stuff pixels.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `instance_segment()` assigns instance masks, computes mask IoU, and resolves panoptic owners; verify IoU $0.75$, RoIAlign $12$ vs $10$, and background $8$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: IoU
- Closing viz: (a) instance/panoptic mask panels (b) IoU-vs-complexity curve
- Pitfall on D5: confusing semantic and instance masks or allowing overlapping panoptic owners; reproduce merged same-class objects, then fix with instance IDs and conflict resolution.
- Notes: Simulate Mask R-CNN heads; no model downloads.

### 7.20 — Vision Transformers (ViT)   [notebook: 7.20-vision-transformers-vit.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Patch-based image classifiers — $4\times4$ image with $2\times2$ patches becomes $4$ tokens, each length $4$.
2. Layout-aware visual reasoning — position rows differ by $[0.03,0.03,0.03]$ after adding $P$.
3. Attention inspection — row softmax $[1,0]$ gives weights about $[0.731,0.269]$.
4. Retrieval/pretraining — similar patch embeddings $v_1,v_2$ have cosine about $0.998$.
5. Class heads — logits $[0.1,2.0,0.5]$ softmax to about $[0.109,0.728,0.163]$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `vit_patch_attention()` patchifies, adds positions, runs scaled attention and class head; verify token table $4\times4$, softmax weights $0.731/0.269$, cosine $0.998$, probabilities.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) patch-token attention/prediction panels (b) accuracy-vs-complexity curve
- Pitfall on D5: choosing patch size only for speed or dropping $\sqrt d$ scale; reproduce small-object loss/coarse tokens, then fix with smaller patches and scaled scores.
- Notes: Tiny NumPy/sklearn transformer block only; no pretrained ViT.

### 7.21 — Swin Transformer   [notebook: 7.21-swin-transformer.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Dense vision backbones — $4\times4$ token grid global attention has $16\times16=256$ pairs.
2. Efficient local attention — four $2\times2$ windows use $4\cdot4\cdot4=64$ pairs, $25\%$ of global.
3. Window-level reasoning — two-token attention produces first output $[1.462,0.807]$ and second $[0.538,2.193]$.
4. Boundary communication — shift size $2$ changes windows so tokens $3$ and $4$ share a group.
5. Feature pyramids — patch merging $4\times4,C=3$ becomes $2\times2$ with $4C=12$ before projection to $6$ channels.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `swin_window_attention()` partitions windows, shifts, masks boundaries, and merges patches; verify pair counts $256$ vs $64$, shifted group, and $2\times2\times6$ hierarchy.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) window/shift attention panels (b) accuracy-vs-complexity curve
- Pitfall on D5: shifting without handling boundaries or skipping patch merging; reproduce wrapped-edge attention, then fix with masks and hierarchy.
- Notes: No Swin download; implement toy attention on tiny tokens.

### 7.22 — Self-supervised vision (MAE, DINO, SimCLR)   [notebook: 7.22-self-supervised-vision.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Label-efficient pretraining — MAE patchifies $4\times4$ into four $2\times2$ patches, table shape $4\times4$.
2. Masked reconstruction — positions differ by $0.03$ so the decoder knows patch address.
3. Contrastive representation learning — positive views have cosine $0.9984$.
4. Batch objective audits — with positive $0.9984$, negative $0.20$, $\tau=0.5$, InfoNCE loss is about $0.184$.
5. Multimodal encoder reuse — attention over two view tokens gives output components $1.462$ and $0.807$ for the first query.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `self_supervised_embed()` creates two views, patchifies/masks, computes cosine and InfoNCE; verify patch table $4\times4$, position gap $0.03$, cosine $0.9984$, loss $0.184$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) augmented-view/embedding panels (b) linear-probe accuracy-vs-complexity curve
- Pitfall on D5: using augmentations that change label-like content or reading high cosine as semantic proof; reproduce crop-removes-object collapse, then fix with safer augmentations and negative checks.
- Notes: Train tiny embeddings/linear probes only; no pretrained DINO/MAE.

### 7.23 — Image captioning   [notebook: 7.23-image-captioning.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Accessibility alt text — image tokens from $4\times4$ patching form a $4\times4$ visual memory before words.
2. Grounded caption decoders — position offsets between token rows are $[0.03,0.03,0.03]$.
3. Word-grounding attention — first visual mixture is approximately $[1.462,0.807]$.
4. Next-word prediction — logits for `[a,dog,runs]` yield probabilities $[0.109,0.728,0.162]$, selecting `dog`.
5. Training loss — if target is `dog`, NLL is $-\log(0.728)\approx0.317$; if `runs`, about $1.820$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `caption_step()` encodes patch tokens, cross-attends for one word, and computes next-token softmax/NLL; verify token table $4\times4$, attention vector, probabilities, and NLL.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) image panels with generated/predicted tokens and attention (b) token accuracy-vs-complexity curve
- Pitfall on D5: relying on object tags instead of visual grounding or ignoring end token; reproduce hallucinated captions, then fix with cross-attention evidence and stop-token check.
- Notes: Use toy vocab/captions generated from labels; no caption model downloads.

### 7.24 — Super-resolution   [notebook: 7.24-super-resolution.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Photo upscaling — nearest upsampling $2\times2\to4\times4$ makes pixel $(1,1)$ equal original value $1$.
2. Video enhancement — bilinear halfway between $1$ and $2$ gives $1.5$, reducing a hard step.
3. Imaging pipelines — cubic weights $[-0.0625,0.5625,0.5625,-0.0625]$ on $[1,2,3,4]$ give $2.5$.
4. Fidelity reporting — target $[1,2,3,4]$ vs prediction $[1,1,3,4]$ has MSE $0.25$ and PSNR $18.06$ dB for $L=4$.
5. Residual reconstruction — residual $[0,0.5,0,0.5]$ adds missing detail with correction energy $0.5$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `super_resolve()` upsamples then predicts residuals; verify nearest pixel $1$, bilinear $1.5$, bicubic $2.5$, PSNR $18.06$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) low-res/upscaled/residual panels (b) fidelity/accuracy-vs-complexity curve
- Pitfall on D5: optimizing PSNR as if it were perception or inventing evidence; reproduce waxy/high-PSNR vs sharp hallucination, then fix with downsample-consistency check.
- Notes: Metric mandated one across rungs; if using PSNR internally, convert to thresholded reconstruction accuracy for the curve and label PSNR as auxiliary.

### 7.25 — Optical flow   [notebook: 7.25-optical-flow.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Video stabilization — $3\times3\times2$ flow field stores $18$ scalars; center vector $(1,0)$ means one-pixel rightward motion.
2. Frame interpolation — brightness constancy with $I_x=2,I_y=0,I_t=-2,u=1,v=0$ gives residual $0$.
3. Motion ambiguity analysis — same equation with $v=5$ also gives residual $0$ when $I_y=0$.
4. Tracking patches — two equations $2u-2=0$ and $3v-3=0$ identify $(u,v)=(1,1)$.
5. Self-supervised warping — pixel $(1,1)$ plus flow $(1,0)$ samples $(2,1)$, so $7-7=0$ photometric error.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `estimate_flow()` solves tiny brightness-constancy equations and warps one frame; verify flow tensor count $18$, residual $0$, aperture ambiguity, and $(1,1)$ solution.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) flow-vector/warp panels (b) motion-direction accuracy-vs-complexity curve
- Pitfall on D5: assuming brightness stays constant or ignoring occlusion; reproduce exposure-change failure, then fix with gradient/robust photometric masks.
- Notes: D2–D5 create synthetic paired frames from shapes/digits/CIFAR crops; no optical-flow model downloads.

### 7.26 — Pose estimation & keypoints   [notebook: 7.26-pose-estimation-keypoints.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Fitness/sports analytics — heatmap $H(y,x)=\exp(-((x-3)^2+(y-1)^2)/2)$ peaks at $(1,3)$ with value $1$.
2. Near-miss supervision — one-column neighbor has value $\exp(-1/2)\approx0.607$ and margin $0.393$.
3. Subpixel keypoints — soft-argmax probabilities $[0.1,0.6,0.3]$ at columns $2,3,4$ yield $3.2$.
4. Heatmap-to-image mapping — $5\times5$ heatmap from $20\times20$ image has stride $4$; center convention gives $(6,14)$.
5. Skeleton grouping — shoulder-elbow and elbow-wrist lengths are both $2$, with shoulder-wrist distance $4$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `predict_keypoints()` builds Gaussian heatmaps, hard/soft argmax, stride mapping, and simple limb checks; verify peak $(1,3)$, value $0.607$, soft coordinate $3.2$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) keypoint heatmap/skeleton panels (b) keypoint-hit accuracy-vs-complexity curve
- Pitfall on D5: swapping row and column or forgetting output stride; reproduce shifted joints, then fix with explicit `(y,x)` convention and stride-center tests.
- Notes: Use synthetic stick figures/landmarks over all image rungs; no pose model downloads.

### 7.27 — OCR & scene text   [notebook: 7.27-ocr-scene-text.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Document AI — $32\times100$ word image with horizontal stride $4$ becomes $25\times64$ feature sequence.
2. License-plate reading — path `[b,blank,o,o,blank,k]` collapses to `bok`, showing repeated-letter risk.
3. Scene-text recognition — path `[b,blank,o,blank,o,k]` collapses to `book`.
4. Decoder scoring — frame probabilities $0.8,0.5,0.7$ multiply to path probability $0.28$; another path $0.12$ raises string probability to $0.40$.
5. Text crop preprocessing — nearest upsample keeps checked position $(1,1)=1$ and heatmap corner peak is value $1$ at $(1,3)$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `ocr_ctc_decode()` turns image columns into character distributions and CTC-collapses paths; verify sequence length $25$, `bok` vs `book`, and probability $0.40$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) text crop / character-path panels (b) character accuracy-vs-complexity curve
- Pitfall on D5: deleting blanks incorrectly or multiplying many probabilities outside log space; reproduce repeated-letter error, then fix with correct CTC collapse/log probabilities.
- Notes: Simulate word images from simple rendered arrays/digits; avoid external OCR datasets.

### 7.28 — Face recognition & metric learning   [notebook: 7.28-face-recognition-metric-learning.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Identity verification — vector $[3,4]$ normalizes to $[0.6,0.8]$ with norm $1$.
2. Access-control thresholds — cosine with $[1,0]$ is $0.6$, angle $53.13^\circ$; threshold $0.7$ rejects and $0.5$ accepts.
3. Impostor-margin training — negative cosine $0.6$ with max $0.4$ gives violation $0.2$ and squared penalty $0.04$.
4. Angular-margin classifiers — ArcFace-style margin drops logit from $10\cdot0.8=8$ to $10\cdot0.6=6$.
5. Deployment calibration — threshold $0.65$ on scores gives one false accept out of $3$ impostors and one false reject out of $3$ genuine pairs.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `verify_embedding()` normalizes embeddings, computes cosine, margins, and threshold errors; verify normalized vector, cosine $0.6$, penalty $0.04$, logit drop $2$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) embedding/similarity panels (b) verification accuracy-vs-complexity curve
- Pitfall on D5: comparing unnormalized embeddings or treating a threshold as universal; reproduce norm-driven false matches, then fix with L2 normalization and calibration sweep.
- Notes: Use class-label proxy identities from small image rungs; no face datasets or biometric downloads.

### 7.29 — Video understanding & action recognition   [notebook: 7.29-video-understanding-action-recognition.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. Action recognition — frame features `[[1,0],[2,1],[3,1]]` mean-pool to $[2,2/3]$.
2. Direction-sensitive actions — reversed frames still mean-pool to $[2,2/3]$, exposing order loss.
3. Motion features — forward differences average to $1$ while reversed differences average to $-1$.
4. 3D convolution cues — temporal kernel $[1,-1]$ on values $1,3$ gives $-2$; reversed gives $2$.
5. Clip classifier — pooled $[2,2/3]$ with logits $2$ and $2/3$ gives run probability about $0.791$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `classify_clip()` pools frame features, adds temporal differences/3D filter, and classifies; verify pooled vector, reversed equality, diff signs, and $0.791$ probability.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) frame/flow/action prediction panels (b) action accuracy-vs-complexity curve
- Pitfall on D5: averaging away the action or sampling too sparsely; reproduce forward/reverse confusion, then fix with temporal differences or tiny 3D filters.
- Notes: Create clips by moving/transforming images from each rung; no video dataset downloads.

### 7.30 — 3D vision & point clouds (PointNet)   [notebook: 7.30-point-clouds-pointnet.ipynb]   (family: F6)

**Lesson — Real World Applications (5):**
1. LiDAR object recognition — checked point cloud has $4$ rows and $3$ coordinates, shape $4\times3$.
2. Order-invariant scanning — feature table max-pools to global descriptor $[2,5]$.
3. File-shuffle robustness — reordered rows still max-pool to $[2,5]$.
4. Shared point features — $h([1,0,0])=[1,0]$, $h([0,1,0])=[2,0]$, max is $[2,0]$ regardless of order.
5. Density caveat — duplicating strongest feature leaves max $[2,5]$, so multiplicity is invisible.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `pointnet_embed()` applies shared point function and symmetric max pooling; verify shape $4\times3$, pooled $[2,5]$, reorder invariance, and duplicate invisibility.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) point-cloud/pooled-feature panels (b) classification accuracy-vs-complexity curve
- Pitfall on D5: feeding point order into the model or assuming max pooling counts parts; reproduce shuffled-order failure in a bad baseline, then fix with shared weights and symmetric max.
- Notes: Convert images to point sets of active pixels/intensity coordinates; no 3D dataset downloads.

### 7.31 — Neural rendering & NeRF   [notebook: 7.31-neural-rendering-nerf.ipynb]   (family: F6, gap)

**Lesson — Real World Applications (5):**
1. Novel-view synthesis — ray $r(t)=o+td$ with origin $[0,0]$, direction $[1,0.5]$, $t=2$ gives point $[2,1]$.
2. Volume rendering — density $0.1$ with $\delta=0.5$ gives opacity $1-e^{-0.05}\approx0.0488$.
3. Opaque-surface modeling — density $3$ with the same interval gives opacity $1-e^{-1.5}\approx0.7769$.
4. Front-to-back compositing — alpha values $[0.2,0.5,0.1]$ give transmittances $1$, $0.8$, $0.4$.
5. Rendered pixel color — weights $0.2,0.4,0.04$ on red/green/blue yield RGB $[0.2,0.4,0.04]$.

**Notebook plan:**
- Family: F6 Vision
- Concept built once (D1): `render_ray()` samples a ray, converts density to opacity, computes transmittance weights, and composites color; verify points $[2,1]$, opacities $0.0488/0.7769$, weights, RGB $[0.2,0.4,0.04]$.
- Datasets D1–D5: D1 4x4 hand patch · D2 synthetic shapes · D3 sklearn digits (8x8) · D4 MNIST subsampled · D5 CIFAR subsampled (few hundred, cached, CPU)
- Metric: accuracy
- Closing viz: (a) ray samples / rendered prediction panels (b) rendering-hit accuracy-vs-complexity curve
- Pitfall on D5: forgetting transmittance or sampling too coarsely; reproduce hidden samples shining through / missed thin structures, then fix with $T_i$ compositing and denser illustrative samples.
- Notes: Gap topic; lesson exists but likely needs extra authoring when implemented. Use 2D toy radiance fields made from image rungs, not real NeRF training or downloads.
