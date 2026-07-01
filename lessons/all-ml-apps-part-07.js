/* All ML — Part 7 (Computer Vision) lesson 'Real World Applications' (5 each).
   Sets window.ALLML_CONTENT["7.x"].applications; loaded after all-ml-content-part-07.js
   and before all-ml-register.js (which copies .applications into the lesson + renders it). */

/* ---- batch A ---- */
window.ALLML_CONTENT["7.1"].applications = [
  {
    title: "Camera and web preprocessing",
    background: "<p>Every camera-to-model pipeline must convert byte pixels into the numeric scale expected by training. The lesson's normalization step is the contract that keeps display values from becoming oversized model inputs.</p>",
    numbers: "<p>A byte pixel value of $128$ becomes $128/255=0.5019607843$. Feeding raw $255$ into a $[0,1]$ model is $255\times$ the intended maximum input.</p>"
  },
  {
    title: "Medical grayscale viewers",
    background: "<p>Clinical viewers often preserve luminance because perceived brightness matters more than a simple channel average. The weighted sum keeps green-dominant brightness from being understated.</p>",
    numbers: "<p>For the lesson orange pixel $[255,128,0]$, luminance is $0.299(1)+0.587(128/255)+0.114(0)=0.5936509804$, while the channel average is $0.5006535948$.</p>"
  },
  {
    title: "OpenCV-to-web color pipelines",
    background: "<p>OpenCV commonly stores color as BGR, while web canvases and many models expect RGB. The tensor shape still looks valid, so an explicit channel-order contract is required.</p>",
    numbers: "<p>The lesson red pixel $[1,0,0]$ in RGB is stored as $[0,0,1]$ in BGR. Reading those three numbers as RGB changes one red channel into one blue channel.</p>"
  },
  {
    title: "Dataset sanity dashboards",
    background: "<p>Before training, vision teams inspect tiny tensor examples to confirm axis order, channel count, and value ranges. A small toy total catches many loading bugs.</p>",
    numbers: "<p>The lesson $2\times2\times3$ color tensor contains red, green, blue, and white pixels, so the whole-tensor sum is $1+1+1+3=6$.</p>"
  },
  {
    title: "Edge and contrast preprocessing",
    background: "<p>Contrast transforms depend on perceived brightness. Luminance weights make green count most, so grayscale edges better match human sensitivity.</p>",
    numbers: "<p>The lesson formula $Y=0.299R+0.587G+0.114B$ gives green weight $0.587$, red weight $0.299$, and blue weight $0.114$.</p>"
  }
];

window.ALLML_CONTENT["7.2"].applications = [
  {
    title: "Lane and document-line detection",
    background: "<p>The Hough transform lets many local edge points vote for a shared global line. It remains useful in lane finding, forms, receipts, and other settings with strong straight structure.</p>",
    numbers: "<p>For points $(2,0)$, $(2,1)$, and $(2,3)$ at $0^\circ$, $\rho=x\cos 0^\circ+y\sin 0^\circ=2$, so all three votes land in the same $\rho=2$ bin.</p>"
  },
  {
    title: "Pedestrian descriptors",
    background: "<p>HOG-style descriptors summarize gradient directions inside local cells, making a patch representation less sensitive to individual noisy pixels.</p>",
    numbers: "<p>In the lesson cell, magnitudes $5$ and $7$ vote into the middle bin for total $12$, while magnitude $4$ votes into the first bin.</p>"
  },
  {
    title: "Edge-quality checks",
    background: "<p>Classical inspection systems measure gradient strength before deciding whether an edge is real enough for downstream geometry.</p>",
    numbers: "<p>For gradient vector $(G_x,G_y)=(3,4)$, $m=\sqrt{3^2+4^2}=5$ and $\theta=\operatorname{atan2}(4,3)\approx53.1^\circ$.</p>"
  },
  {
    title: "Robust patch matching",
    background: "<p>Small fixed filters create local contrast scores that can be matched across image patches before a learned model is available.</p>",
    numbers: "<p>The lesson patch $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ with diagonal kernel $\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ returns $1-4=-3$.</p>"
  },
  {
    title: "Shift-tolerant feature summaries",
    background: "<p>Pooling makes handcrafted descriptors tolerant to small translations, which helps classification but can hurt precise localization.</p>",
    numbers: "<p>Max-pooling the lesson $4\times4$ activation into $2\times2$ blocks returns $\begin{bmatrix}6&5\\2&9\end{bmatrix}$.</p>"
  }
];

window.ALLML_CONTENT["7.3"].applications = [
  {
    title: "Mobile photo classifiers",
    background: "<p>Convolution replaces dense image wiring with one shared local kernel, making image models practical on phones and browsers.</p>",
    numbers: "<p>A dense $5\times5$ image-to-$5\times5$ layer uses $25\times25=625$ weights, while the lesson $2\times2$ convolution uses $4$ weights plus a bias.</p>"
  },
  {
    title: "Industrial defect scans",
    background: "<p>Shared kernels can flag the same scratch or edge pattern wherever it appears on a surface, rather than learning a separate detector for each location.</p>",
    numbers: "<p>On the lesson ramp, every valid $2\times2$ window has the same diagonal gap, producing a constant feature map with all entries $-4$.</p>"
  },
  {
    title: "Medical edge filters",
    background: "<p>Simple kernels provide interpretable local measurements in radiology preprocessing and quality-control steps.</p>",
    numbers: "<p>The lesson patch $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ dotted with $\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ gives $1+0+0-4=-3$.</p>"
  },
  {
    title: "Embedded vision memory planning",
    background: "<p>Output-size arithmetic determines activation memory on small devices. Stride is often chosen as much for memory as for modeling.</p>",
    numbers: "<p>For input $5\times5$, kernel $k=2$, stride $2$, and no padding, $\left\lfloor(5-2)/2\right\rfloor+1=2$, so the output is $2\times2$.</p>"
  },
  {
    title: "Deep receptive-field design",
    background: "<p>Stacking small convolutions grows the area each unit can see while keeping parameter counts low.</p>",
    numbers: "<p>With $3\times3$ layers, the lesson rule $1+2L$ gives $1+2(2)=5$, so two layers see a $5\times5$ region.</p>"
  }
];

window.ALLML_CONTENT["7.4"].applications = [
  {
    title: "OCR and text recognition",
    background: "<p>Small strokes can disappear when stride skips too many locations, so OCR systems track shape arithmetic carefully.</p>",
    numbers: "<p>For $n=5$, $k=2$, $p=0$, and $s=2$, $n_{out}=\left\lfloor(5-2)/2\right\rfloor+1=2$, leaving only $2\times2$ cells.</p>"
  },
  {
    title: "Border-sensitive inspection",
    background: "<p>Padding gives edge pixels more chances to be included in convolution windows, which matters when defects or text appear near borders.</p>",
    numbers: "<p>With $n=5$, $k=2$, $p=1$, and $s=1$, $n_{out}=\left\lfloor(5+2-2)/1\right\rfloor+1=6$, so the output is $6\times6$.</p>"
  },
  {
    title: "Image classifier downsampling",
    background: "<p>Max pooling keeps strong local evidence while shrinking activation maps cheaply.</p>",
    numbers: "<p>The lesson activation pools to $\begin{bmatrix}6&5\\2&9\end{bmatrix}$, preserving one maximum from each $2\times2$ block.</p>"
  },
  {
    title: "CNN parameter budgets",
    background: "<p>Counting channel-aware kernel weights is essential before deploying a model to limited hardware.</p>",
    numbers: "<p>An RGB $3\times3$ convolution with $8$ filters uses $3\times3\times3\times8=216$ weights.</p>"
  },
  {
    title: "Residual-path design",
    background: "<p>Skip connections and concatenations require compatible spatial and channel shapes, so one stride or padding choice can break the block.</p>",
    numbers: "<p>If one branch applies the stride-$2$ lesson setting it becomes $2\times2$, while a padded stride-$1$ branch can be $6\times6$; those shapes cannot be added directly.</p>"
  }
];

window.ALLML_CONTENT["7.5"].applications = [
  {
    title: "Semantic segmentation context",
    background: "<p>Dilation lets dense-prediction models see more context without reducing resolution or adding kernel weights.</p>",
    numbers: "<p>For the lesson $k=3$ and $d=2$, $k_{eff}=3+(3-1)(2-1)=5$, so three taps cover a width-$5$ footprint.</p>"
  },
  {
    title: "Super-resolution decoders",
    background: "<p>Transposed convolution is used in learned upsampling blocks that expand coarse feature maps back toward image resolution.</p>",
    numbers: "<p>For $n_{in}=3$, $s=2$, $k=3$, $p=0$, and $o=0$, $n_{out}^{trans}=(3-1)2-0+3+0=7$.</p>"
  },
  {
    title: "U-Net skip alignment",
    background: "<p>Decoder features often need to align exactly with encoder skip connections, so output padding is a one-cell shape control.</p>",
    numbers: "<p>With $n_{in}=3$, $s=2$, $k=3$, and $p=1$, output padding $o=0$ gives $5$, while $o=1$ gives $6$.</p>"
  },
  {
    title: "Checkerboard artifact debugging",
    background: "<p>Uneven overlap in transposed convolution can make alternating output positions too bright or too dark.</p>",
    numbers: "<p>In the lesson stride-kernel example, position $2$ receives two contributions while neighboring positions receive one, creating a re-derivable overlap imbalance.</p>"
  },
  {
    title: "Small-object dense prediction",
    background: "<p>Dilated filters can capture wider context around a small object while keeping the same number of learned taps.</p>",
    numbers: "<p>For input $[1,2,3,4,5]$, weights $[1,0,-1]$, and dilation $2$, the sampled values are $1,3,5$, so the dot product is $1+0-5=-4$.</p>"
  }
];

window.ALLML_CONTENT["7.6"].applications = [
  {
    title: "Phone image classifiers",
    background: "<p>MobileNet-style blocks reduce per-pixel convolution work so image classifiers can run on-device.</p>",
    numbers: "<p>For $D=3$, $C=3$, and $C'=8$, standard convolution costs $3^2\cdot3\cdot8=216$ multiplies per output pixel, while separable convolution costs $3^2\cdot3+3\cdot8=51$.</p>"
  },
  {
    title: "Browser and on-device filters",
    background: "<p>Separating spatial filtering from channel mixing lowers arithmetic enough for interactive client-side vision features.</p>",
    numbers: "<p>The lesson ratio is $51/216=0.236111\ldots$, so the separable block uses about $23.6\%$ of the standard multiply count.</p>"
  },
  {
    title: "Edge-device budget savings",
    background: "<p>Per-pixel savings compound across the output grid, which is why small block choices matter in deployment.</p>",
    numbers: "<p>On a $5\times5$ output grid, standard work is $216\cdot25=5400$ multiplies and separable work is $51\cdot25=1275$, saving $4125$.</p>"
  },
  {
    title: "Efficient segmentation backbones",
    background: "<p>Depthwise spatial filtering keeps channels separate before pointwise mixing, reducing backbone cost in dense prediction models.</p>",
    numbers: "<p>With $D=3$ and $C=3$, the depthwise step uses $3^2\cdot3=27$ multiplies and still outputs $3$ channels before mixing.</p>"
  },
  {
    title: "Architecture tradeoff analysis",
    background: "<p>Depthwise savings are real, but pointwise mixing is still required for channels to communicate.</p>",
    numbers: "<p>The lesson pointwise term is $C\cdot C'=3\cdot8=24$ multiplies, so full separable cost is $27+24=51$, not just the depthwise $27$.</p>"
  }
];

/* ---- batch B ---- */
window.ALLML_CONTENT["7.7"].applications = [
  { title: "Mobile image classification", background: "<p>SE blocks became popular in compact CNN families because they add channel calibration without changing the spatial grid.</p>", numbers: "<p>If the excitation logit is $2$, the gate is $\sigma(2)=1/(1+e^{-2})\approx0.8808$, so that channel keeps about $88.08\%$ of its signal.</p>" },
  { title: "Medical image triage", background: "<p>In scans, a channel may respond to a broad anatomical or texture cue, so global average pooling gives a compact image-level summary.</p>", numbers: "<p>For a $2\times2$ channel whose entries sum to $16$, the squeeze descriptor is $z_1=16/4=4$.</p>" },
  { title: "Product image quality models", background: "<p>Marketplace image models often need to damp channels that fire on noise, glare, or repeated background texture.</p>", numbers: "<p>The toy channel $[[2,0],[2,0]]$ has mean $z_2=(2+0+2+0)/4=1$, giving the excitation network a smaller descriptor than $z_1=4$.</p>" },
  { title: "Adaptive feature selection", background: "<p>The excitation MLP mixes channel descriptors so the gate for one channel can depend on evidence from another channel.</p>", numbers: "<p>With descriptors $z=[4,1]$, the hidden unit $0.5\cdot4-1\cdot1=1$ is positive and can drive different output gates.</p>" },
  { title: "Edge CNN calibration", background: "<p>On-device CNNs use SE-style gating to spend limited capacity on the most useful channels for the current frame.</p>", numbers: "<p>A gate of $0.8808$ turns a bottom-right activation $7$ into $7\cdot0.8808=6.1656$.</p>" }
];

window.ALLML_CONTENT["7.8"].applications = [
  { title: "Handwritten digit recognition", background: "<p>LeNet showed that small learned filters and pooling could replace hand-engineered digit features.</p>", numbers: "<p>A $5\times5$ convolution on a $32\times32$ grayscale image gives $28\times28\times6$ outputs with $5\cdot5\cdot1\cdot6=150$ filter weights.</p>" },
  { title: "ImageNet-era classifiers", background: "<p>AlexNet scaled convolutional bookkeeping to large RGB images and made ReLU training practical at ImageNet scale.</p>", numbers: "<p>Its first $11\times11$ stride-$4$ convolution maps $227\times227\times3$ to $55\times55\times96$ and uses $11\cdot11\cdot3\cdot96=34{,}848$ weights.</p>" },
  { title: "Map-size planning", background: "<p>Pooling layers reduce spatial cost while preserving the channel count produced by earlier convolutions.</p>", numbers: "<p>A $2\times2$ pool halves $28\times28\times6$ to $14\times14\times6$.</p>" },
  { title: "Training-speed audits", background: "<p>ReLU became a practical default because positive responses pass through directly while negative responses are clipped.</p>", numbers: "<p>The lesson vector maps as $[-3,0.5,4]\mapsto[0,0.5,4]$, avoiding sigmoid saturation for the positive entries.</p>" },
  { title: "Dense-head memory checks", background: "<p>Historical CNNs often spent most parameters in dense layers, so shape arithmetic is a deployment requirement.</p>", numbers: "<p>A $6\times6\times256$ tensor feeding $4096$ dense units has $6\cdot6\cdot256\cdot4096+4096=37{,}752{,}832$ parameters with biases.</p>" }
];

window.ALLML_CONTENT["7.9"].applications = [
  { title: "Simple CNN backbones", background: "<p>VGG popularized repeated $3\times3$ filters because they are easy to stack and reason about.</p>", numbers: "<p>Two stacked $3\times3$ layers see $3+(3-1)=5$ pixels across, matching a $5\times5$ receptive field in the toy setting.</p>" },
  { title: "Parameter-efficient filters", background: "<p>Replacing one large filter with smaller stacked filters can reduce weights while adding an extra nonlinearity.</p>", numbers: "<p>In one channel, one $5\times5$ filter has $25$ weights, while two $3\times3$ filters have $2\cdot9=18$ weights.</p>" },
  { title: "Multi-scale inspection", background: "<p>Inception branches let a block inspect local, medium, and pooled context at the same input location.</p>", numbers: "<p>Branches with $16,32,8,8$ channels concatenate to $16+32+8+8=64$ output channels.</p>" },
  { title: "Cost-controlled wide branches", background: "<p>A $1\times1$ bottleneck reduces channel count before an expensive spatial filter.</p>", numbers: "<p>The toy $5\times5$ branch drops from $25\cdot64\cdot32=51{,}200$ multiplies to $64\cdot16+25\cdot16\cdot32=13{,}824$ per location.</p>" },
  { title: "Architecture debugging", background: "<p>Branch concatenation fails when one branch silently shrinks its feature map.</p>", numbers: "<p>On a $28\times28$ map, padded $3\times3$ stays $28$, but unpadded $3\times3$ becomes $28-3+1=26$, so the sizes cannot concatenate.</p>" }
];

window.ALLML_CONTENT["7.10"].applications = [
  { title: "Deep image classifiers", background: "<p>Residual blocks let very deep classifiers learn corrections instead of relearning the full identity mapping.</p>", numbers: "<p>The residual vector $[0.1,-0.2,0.3]$ changes $[1,2,3]$ to $[1.1,1.8,3.3]$ by elementwise addition.</p>" },
  { title: "Identity-preserving backbones", background: "<p>If a residual branch is unnecessary, the shortcut can preserve the incoming representation exactly.</p>", numbers: "<p>With zero residual, $y=x+0=[1,2,3]$ exactly.</p>" },
  { title: "Gradient-flow debugging", background: "<p>The shortcut gives gradients a direct route even when the learned branch has a small derivative.</p>", numbers: "<p>With $dL/dy=2$ and $dF/dx=0.1$, the shortcut gradient is $2(1+0.1)=2.2$ versus branch-only $2\cdot0.1=0.2$.</p>" },
  { title: "Channel projection design", background: "<p>When a block changes channel count, a $1\times1$ projection makes the shortcut compatible with the main path.</p>", numbers: "<p>A $64\to128$ shortcut needs $1\cdot1\cdot64\cdot128=8192$ weights.</p>" },
  { title: "Detection and segmentation backbones", background: "<p>Dense prediction heads rely on residual stages that downsample features without breaking alignment.</p>", numbers: "<p>A downsample block from $56\times56\times64$ to $28\times28\times128$ must apply stride $2$ and the $64\to128$ projection on the shortcut too.</p>" }
];

window.ALLML_CONTENT["7.11"].applications = [
  { title: "Feature-reuse backbones", background: "<p>DenseNet connects each layer to later layers by concatenating features, encouraging reuse.</p>", numbers: "<p>With $C_0=16$, growth $k=12$, and $L=4$, the channel count becomes $16+4\cdot12=64$.</p>" },
  { title: "Memory planning", background: "<p>Dense concatenation makes later layers read more channels, so parameter counts grow through the block.</p>", numbers: "<p>A layer reading $40$ channels and outputting $12$ with $3\times3$ filters uses $3\cdot3\cdot40\cdot12=4320$ weights.</p>" },
  { title: "Compression stages", background: "<p>Transition layers control DenseNet memory by compressing the concatenated channel stack.</p>", numbers: "<p>A compression factor $\theta=0.5$ cuts $64$ channels to $0.5\cdot64=32$.</p>" },
  { title: "Model-family scaling", background: "<p>EfficientNet scales depth, width, and resolution together instead of tuning one axis alone.</p>", numbers: "<p>For $\alpha=1.2$, $\beta=1.1$, $\gamma=1.15$, and $\phi=2$, the factors are depth $1.2^2=1.44$, width $1.1^2=1.21$, and resolution $1.15^2=1.3225$.</p>" },
  { title: "Compute budgeting", background: "<p>Compound scaling must square width and resolution in the rough convolutional compute estimate.</p>", numbers: "<p>The combined factor is $1.44\cdot1.4641\cdot1.74800625\approx3.685$.</p>" }
];

window.ALLML_CONTENT["7.12"].applications = [
  { title: "Modern CNN backbones", background: "<p>ConvNeXt keeps convolutional spatial mixing while adopting modern block details.</p>", numbers: "<p>The lesson depthwise diagonal filter gives response $-3$ on the toy patch before channel mixing.</p>" },
  { title: "Dense prediction features", background: "<p>Depthwise filters preserve per-channel spatial structure, which is useful for detection and segmentation features.</p>", numbers: "<p>On the lesson ramp, the depthwise response map remains all $-4$, so the local slope signal is preserved across positions.</p>" },
  { title: "Small-batch training", background: "<p>LayerNorm normalizes channels within an example, avoiding dependence on large batch statistics.</p>", numbers: "<p>For $[1,2,3]$, the mean is $2$, variance is $2/3$, and normalized values are approximately $[-1.225,0,1.225]$.</p>" },
  { title: "Inverted bottlenecks", background: "<p>ConvNeXt expands channels for the hidden pointwise computation and then projects back to the residual width.</p>", numbers: "<p>With $C=3$ and expansion ratio $4$, the hidden width is $4C=12$ channels.</p>" },
  { title: "Residual channel budgets", background: "<p>The expand and project pointwise layers are often the easiest part of a ConvNeXt block to budget by hand.</p>", numbers: "<p>At one location, expansion and projection use $3\cdot12+12\cdot3=72$ weights.</p>" }
];

/* ---- batch C ---- */
window.ALLML_CONTENT["7.13"].applications = [
  { title: "Object detector evaluation", background: "<p>Detection teams need a shared rule for deciding whether a predicted box is close enough to a labeled object.</p>", numbers: "<p>For boxes $[0,0,3,3]$ and $[1,1,4,4]$, the intersection is $2\times2=4$, the union is $9+9-4=14$, and IoU is $4/14\approx0.286$.</p>" },
  { title: "Anchor target assignment", background: "<p>Anchor-based detectors train only the anchors most responsible for an object, so overlap decides which template learns.</p>", numbers: "<p>For ground truth $[1,1,3,3]$, anchor IoUs are $1/7\approx0.143$ and $4/9\approx0.444$, so the larger overlapping anchor wins.</p>" },
  { title: "Duplicate removal", background: "<p>Detectors often fire several boxes on the same object; NMS keeps the strongest local explanation.</p>", numbers: "<p>The duplicate box has overlap $6.25$ and union $11.75$, so $6.25/11.75\approx0.532\gt0.3$ and box $1$ is suppressed, leaving $[0,2]$.</p>" },
  { title: "Leaderboard metrics", background: "<p>AP rewards a detector for ranking good boxes before false positives across the full recall sweep.</p>", numbers: "<p>The lesson AP is $1.0\cdot0.33+0.75\cdot0.34+0.6\cdot0.33=0.33+0.255+0.198=0.783$.</p>" },
  { title: "Set matching", background: "<p>Matching costs connect classic detection metrics to set-prediction models such as DETR.</p>", numbers: "<p>The diagonal assignment costs $0.3+0.5=0.8$, while the cross assignment costs $1.1+0.7=1.8$, so the diagonal match wins.</p>" }
];

window.ALLML_CONTENT["7.14"].applications = [
  { title: "Proposal triage", background: "<p>R-CNN style systems first decide whether a candidate region is good enough to train as foreground.</p>", numbers: "<p>The lesson proposal has IoU $4/14\approx0.286$, which fails an illustrative positive threshold of $0.5$.</p>" },
  { title: "Faster R-CNN RPN labels", background: "<p>The region proposal network turns anchors into objectness labels using the same overlap bookkeeping as detector evaluation.</p>", numbers: "<p>Anchor IoUs $1/7$, $4/9$, and $4/9$ tie for the last two anchors; argmax chooses the first best index, $1$.</p>" },
  { title: "Region feature pooling", background: "<p>RoI pooling converts a variable-size region into a fixed feature vector for the classifier head.</p>", numbers: "<p>For proposal values $[[1,3],[2,4]]$, max pooling gives $4$ and average pooling gives $(1+3+2+4)/4=2.5$.</p>" },
  { title: "Second-stage duplicate cleanup", background: "<p>Even after proposal classification, nearby regions can describe the same object and need NMS.</p>", numbers: "<p>Because the duplicate IoU is $6.25/11.75\approx0.532\gt0.3$, second-stage NMS keeps indices $[0,2]$.</p>" },
  { title: "Box refinement", background: "<p>The regressor head moves rough proposals toward tighter object boxes instead of treating proposals as final.</p>", numbers: "<p>The simple correction $[0,0,3,3]+[1,1,1,1]=[1,1,4,4]$ matches the target and reaches IoU $1$.</p>" }
];

window.ALLML_CONTENT["7.15"].applications = [
  { title: "Real-time cameras", background: "<p>YOLO-style detectors decode a box center from a grid cell so a single pass can serve live video.</p>", numbers: "<p>Cell $(i,j)=(2,3)$ with offsets $(0.75,0.25)$ and stride $16$ gives image center $((3+0.25)16,(2+0.75)16)=(52,44)$.</p>" },
  { title: "Default-box assignment", background: "<p>SSD assigns objects to default boxes by overlap so each predictor has a clear training target.</p>", numbers: "<p>Overlaps $1/7\approx0.143$ and $4/9\approx0.444$ choose the second anchor, index $1$.</p>" },
  { title: "Confidence ranking", background: "<p>One-stage detections rank class confidence only after gating by objectness.</p>", numbers: "<p>Objectness $0.8$ times class probability $0.6$ gives $0.48$, beating $0.5\times0.9=0.45$.</p>" },
  { title: "Dense detector cleanup", background: "<p>Dense grids emit overlapping boxes around the same object, so fast detectors still need geometric pruning.</p>", numbers: "<p>NMS removes the $0.532$ IoU duplicate above threshold $0.3$ and keeps indices $[0,2]$.</p>" },
  { title: "Localization validation", background: "<p>Speed does not replace localization evaluation; every YOLO or SSD box is still judged by IoU.</p>", numbers: "<p>The lesson boxes have intersection $4$ and union $14$, so the pre-refinement IoU is $4/14\approx0.286$.</p>" }
];

window.ALLML_CONTENT["7.16"].applications = [
  { title: "Small-object detection", background: "<p>FPN carries semantic information down to high-resolution maps where small objects are still visible.</p>", numbers: "<p>The lateral map $[[1,2],[3,4]]$ plus upsampled map $[[10,10],[20,20]]$ gives $[[11,12],[23,24]]$.</p>" },
  { title: "Anchor coverage", background: "<p>Multi-scale levels help ensure at least one anchor size overlaps each object well.</p>", numbers: "<p>The lesson compares IoUs $1/7\approx0.143$ and $4/9\approx0.444$, so the larger scale is the better training target.</p>" },
  { title: "Class-imbalance training", background: "<p>RetinaNet's focal loss downweights the flood of easy background anchors.</p>", numbers: "<p>With $\alpha=0.25$, $\gamma=2$, and $p_t=0.9$, focal loss is $-0.25(0.1)^2\log(0.9)\approx0.00026$.</p>" },
  { title: "Hard-example emphasis", background: "<p>The same focal formula keeps difficult foreground or confusing examples influential.</p>", numbers: "<p>At $p_t=0.1$, focal loss is $-0.25(0.9)^2\log(0.1)\approx0.466$, about $1770\times$ the easy example.</p>" },
  { title: "Detector reporting", background: "<p>The training loss is useful only if the ranked detections improve AP.</p>", numbers: "<p>The lesson precision-recall steps produce AP $0.33+0.255+0.198=0.783$.</p>" }
];

window.ALLML_CONTENT["7.17"].applications = [
  { title: "NMS-free detection", background: "<p>DETR makes one-to-one assignment part of training so duplicates are discouraged before post-processing.</p>", numbers: "<p>The diagonal cost $0.3+0.5=0.8$ beats the cross cost $1.1+0.7=1.8$.</p>" },
  { title: "Box-cost design", background: "<p>The matching cost still needs geometric quality, not just class confidence.</p>", numbers: "<p>For the lesson boxes, $1-\operatorname{IoU}=1-4/14\approx0.714$ contributes a localization penalty.</p>" },
  { title: "Loss-weight tuning", background: "<p>DETR's class and box weights define what the assignment considers the best match.</p>", numbers: "<p>Class $0.2$ plus box $0.6$ ties class $0.7$ plus box $0.1$ because both total $0.8$.</p>" },
  { title: "Query budgeting", background: "<p>A fixed number of object queries can represent a variable number of objects only if unused slots learn no-object.</p>", numbers: "<p>With $5$ queries and $2$ objects, $5-2=3$ queries receive no-object targets.</p>" },
  { title: "Evaluation continuity", background: "<p>DETR changes training and decoding, but published detector quality still uses AP.</p>", numbers: "<p>The same precision-recall calculation gives $0.33+0.255+0.198=0.783$ AP.</p>" }
];

window.ALLML_CONTENT["7.18"].applications = [
  { title: "Medical organ masks", background: "<p>Semantic segmentation is used when every pixel needs an anatomical class rather than one image label.</p>", numbers: "<p>The lesson mask has class counts $3$ for class $0$, $4$ for class $1$, and $2$ for class $2$ across $9$ pixels.</p>" },
  { title: "Road and scene parsing", background: "<p>Autonomous-scene systems evaluate how many pixels receive the right road, vehicle, or background label.</p>", numbers: "<p>With one wrong pixel in a $3\times3$ grid, pixel accuracy is $8/9\approx0.889$.</p>" },
  { title: "Region-quality reporting", background: "<p>Class IoU is stricter than pixel accuracy because it punishes both missing and inventing a region.</p>", numbers: "<p>For class $1$, the intersection is $3$ pixels and the union is $4$ pixels, so IoU is $3/4=0.75$.</p>" },
  { title: "U-Net boundary recovery", background: "<p>Skip connections give the decoder fine spatial details that coarse upsampling alone loses.</p>", numbers: "<p>Concatenating a $2\times2\times3$ encoder map with a $2\times2\times2$ decoder map gives shape $2\times2\times5$.</p>" },
  { title: "Per-pixel training", background: "<p>Segmentation trains a softmax classifier independently at each pixel.</p>", numbers: "<p>For logits $[1,2,0]$ and true class $1$, $p_{true}=e^2/(e^1+e^2+e^0)\approx0.665$ and CE is $-\log(0.665)\approx0.408$.</p>" }
];

/* ---- batch D ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["7.19"] = window.ALLML_CONTENT["7.19"] || {};
window.ALLML_CONTENT["7.19"].applications = [
  { title: "Retail shelf instance counts", background: "<p>Retail analytics needs to know not only that product pixels are present, but how many separate packages occupy a shelf.</p>", numbers: "<p>A semantic class-1 mask with four pixels could be one object or two. Two $2\\times2$ instance masks have areas $4$ and $4$, so identity IDs turn $8$ foreground pixels into two countable items.</p>" },
  { title: "Mask evaluation", background: "<p>Segmentation benchmarks score overlap at the mask level so thin errors and missing regions are visible.</p>", numbers: "<p>If the predicted and target masks share $3$ pixels and their union has $4$, the mask score is $\\operatorname{IoU}=\\frac{3}{4}=0.75$.</p>" },
  { title: "RoI boundary precision", background: "<p>Mask R-CNN uses RoIAlign because small-object masks can shift when feature coordinates are rounded.</p>", numbers: "<p>Interpolating halfway between feature values $10$ and $14$ gives $12$, while rounding reads $10$, an illustrative $2$-unit boundary-feature error.</p>" },
  { title: "Same-class separation", background: "<p>Medical cells, cars, and packages often touch while sharing a class label, so IDs prevent merged objects.</p>", numbers: "<p>Two same-class $2\\times2$ masks each have area $4$, but owners $1$ and $2$ keep them as two instances rather than one class blob.</p>" },
  { title: "Panoptic maps", background: "<p>Panoptic segmentation combines countable things with background stuff, enforcing one owner per pixel.</p>", numbers: "<p>In a $4\\times4$ image, two four-pixel instances occupy $8$ pixels, leaving $16-8=8$ background stuff pixels.</p>" }
];

window.ALLML_CONTENT["7.20"] = window.ALLML_CONTENT["7.20"] || {};
window.ALLML_CONTENT["7.20"].applications = [
  { title: "Patch-based image classifiers", background: "<p>ViT classifiers replace sliding convolution filters with a sequence of image patches processed like tokens.</p>", numbers: "<p>A $4\\times4$ image split into $2\\times2$ patches makes $4$ tokens, and each flattened token has length $4$.</p>" },
  { title: "Layout-aware visual reasoning", background: "<p>Position embeddings tell the transformer where a patch came from, which matters when identical textures appear in different places.</p>", numbers: "<p>Adding the lesson position table makes adjacent token rows differ by $[0.03,0.03,0.03]$, so location is encoded even before attention.</p>" },
  { title: "Attention inspection", background: "<p>Attention weights expose which patch a query borrows from when a model makes a visual decision.</p>", numbers: "<p>A row score of $[1,0]$ softmaxes to approximately $[0.731,0.269]$, so the first key receives about $73.1\\%$ of the mixture.</p>" },
  { title: "Retrieval and pretraining", background: "<p>Patch embeddings can be compared for image retrieval or used as pretraining targets before fine tuning.</p>", numbers: "<p>Two nearly aligned patch vectors with cosine $0.998$ are much closer than an unrelated vector with a low cosine, making them likely retrieval neighbors.</p>" },
  { title: "Class heads", background: "<p>A ViT class token feeds a small head that converts image evidence into label probabilities.</p>", numbers: "<p>For logits $[0.1,2.0,0.5]$, softmax gives about $[0.109,0.728,0.163]$, so the second class is selected.</p>" }
];

window.ALLML_CONTENT["7.21"] = window.ALLML_CONTENT["7.21"] || {};
window.ALLML_CONTENT["7.21"].applications = [
  { title: "Dense vision backbones", background: "<p>Swin is used as a backbone when detectors and segmenters need spatial feature maps instead of one global class token.</p>", numbers: "<p>A $4\\times4$ token grid has $16$ tokens, so global attention checks $16\\times16=256$ query-key pairs.</p>" },
  { title: "Efficient local attention", background: "<p>Window attention cuts cost by comparing nearby tokens first, which is useful for high-resolution images.</p>", numbers: "<p>Four $2\\times2$ windows use $4\\cdot4\\cdot4=64$ pairs, which is $\\frac{64}{256}=25\\%$ of global attention.</p>" },
  { title: "Window-level reasoning", background: "<p>Within each window, attention still mixes value vectors according to learned similarities.</p>", numbers: "<p>With weights $[0.731,0.269]$ over values $[2,0]$ and $[0,3]$, the first output is approximately $[1.462,0.807]$.</p>" },
  { title: "Boundary communication", background: "<p>Shifted windows let neighboring regions exchange information that fixed windows would isolate.</p>", numbers: "<p>An illustrative shift size $2$ changes the grouping so boundary tokens $3$ and $4$ can share a window on the shifted pass.</p>" },
  { title: "Feature pyramids", background: "<p>Patch merging makes Swin behave like a hierarchical CNN backbone for multi-scale tasks.</p>", numbers: "<p>Merging a $4\\times4$ map with $C=3$ creates a $2\\times2$ map with $4C=12$ concatenated channels before projection to $6$.</p>" }
];

window.ALLML_CONTENT["7.22"] = window.ALLML_CONTENT["7.22"] || {};
window.ALLML_CONTENT["7.22"].applications = [
  { title: "Label-efficient pretraining", background: "<p>Self-supervised pretraining learns image features before expensive labels are available.</p>", numbers: "<p>MAE-style patching turns a $4\\times4$ image into four $2\\times2$ patches, giving a $4\\times4$ token table to mask and reconstruct.</p>" },
  { title: "Masked reconstruction", background: "<p>Position information lets a decoder know where a hidden patch belongs when reconstructing an image.</p>", numbers: "<p>The lesson position rows differ by $0.03$, so two equal-looking patch values are distinguishable by their address.</p>" },
  { title: "Contrastive representation learning", background: "<p>SimCLR-style objectives pull two safe views of the same image together in embedding space.</p>", numbers: "<p>The positive views in the lesson have cosine $0.9984$, meaning their angle is tiny compared with a weak negative such as cosine $0.20$.</p>" },
  { title: "Batch objective audits", background: "<p>InfoNCE checks whether positives beat negatives by enough after temperature scaling.</p>", numbers: "<p>With $s_+=0.9984$, $s_-=0.20$, and $\\tau=0.5$, the loss is about $0.184$, indicating the positive dominates the two-item softmax.</p>" },
  { title: "Multimodal encoder reuse", background: "<p>Self-supervised visual embeddings are often reused by retrieval, captioning, and multimodal models.</p>", numbers: "<p>The same two-token attention mixture from the lesson produces first-query components $1.462$ and $0.807$, a compact visual summary for later heads.</p>" }
];

window.ALLML_CONTENT["7.23"] = window.ALLML_CONTENT["7.23"] || {};
window.ALLML_CONTENT["7.23"].applications = [
  { title: "Accessibility alt text", background: "<p>Captioning systems generate text descriptions that make image content available to screen-reader users.</p>", numbers: "<p>A $4\\times4$ image split into $2\\times2$ patches forms a $4\\times4$ visual memory before the decoder emits words.</p>" },
  { title: "Grounded caption decoders", background: "<p>Position offsets keep a decoder from treating identical patch appearances as interchangeable evidence.</p>", numbers: "<p>The position rows differ by $[0.03,0.03,0.03]$, so a word can attend to the right visual address.</p>" },
  { title: "Word-grounding attention", background: "<p>Cross-attention lets a word query choose the image patches that support it.</p>", numbers: "<p>Using weights $[0.731,0.269]$ over values $[2,0]$ and $[0,3]$ gives a first visual mixture near $[1.462,0.807]$.</p>" },
  { title: "Next-word prediction", background: "<p>The language head turns visual and text context into a probability distribution over the next token.</p>", numbers: "<p>For vocabulary `[a,dog,runs]` and logits $[0.1,2.0,0.5]$, softmax gives approximately $[0.109,0.728,0.162]$, selecting `dog`.</p>" },
  { title: "Training loss", background: "<p>Negative log-likelihood measures whether the model assigned enough probability to the target caption word.</p>", numbers: "<p>If the target is `dog`, $-\\log(0.728)\\approx0.317$; if the target is `runs`, the loss is about $1.820$.</p>" }
];

/* ---- batch E ---- */
window.ALLML_CONTENT["7.24"].applications = [
  { title: "Photo upscaling", background: "<p>Phone galleries and creative tools upscale small crops before display or editing. Nearest-neighbor copying is the transparent baseline because it shows exactly what evidence was observed.</p>", numbers: "<p>For $\\begin{bmatrix}1&2\\3&4\\end{bmatrix}$ enlarged from $2\\times2$ to $4\\times4$, the original value $1$ fills positions $(0,0),(0,1),(1,0),(1,1)$, so the checked pixel is $1$.</p>" },
  { title: "Video enhancement", background: "<p>Streaming systems often smooth low-resolution frames before a learned model adds detail. Bilinear interpolation is useful when blocky nearest copies make motion shimmer.</p>", numbers: "<p>Halfway between samples $1$ and $2$, bilinear interpolation gives $0.5\\cdot1+0.5\\cdot2=1.5$, replacing a hard jump with a midpoint.</p>" },
  { title: "Imaging pipelines", background: "<p>Camera and medical-imaging pipelines use wider interpolation stencils when a smoother fixed resize is needed before restoration or analysis.</p>", numbers: "<p>The cubic weights $[-0.0625,0.5625,0.5625,-0.0625]$ on $[1,2,3,4]$ give $-0.0625+1.125+1.6875-0.25=2.5$.</p>" },
  { title: "Fidelity reporting", background: "<p>Benchmarks report PSNR because it converts pixel mean-squared error into a scale-aware decibel score, even when perception may disagree.</p>", numbers: "<p>Target $[1,2,3,4]$ and prediction $[1,1,3,4]$ have MSE $0.25$. With $L=4$, $10\\log_{10}(16/0.25)=18.06$ dB.</p>" },
  { title: "Residual reconstruction", background: "<p>Many super-resolution networks learn only the missing high-frequency residual after a simple upsampler has placed coarse colors on the output grid.</p>", numbers: "<p>If the upsampled row is $[1,1,2,2]$ and the desired row is $[1,1.5,2,2.5]$, the residual is $[0,0.5,0,0.5]$ with energy $0^2+0.5^2+0^2+0.5^2=0.5$.</p>" }
];

window.ALLML_CONTENT["7.25"].applications = [
  { title: "Video stabilization", background: "<p>Stabilizers estimate how image content moves between frames, then compensate for camera shake by warping frames back into alignment.</p>", numbers: "<p>A $3\\times3\\times2$ flow field stores $3\\cdot3\\cdot2=18$ scalars. A center vector $(1,0)$ means one-pixel rightward motion.</p>" },
  { title: "Frame interpolation", background: "<p>Interpolation systems synthesize in-between frames by moving pixels along estimated flow and checking brightness consistency.</p>", numbers: "<p>With $I_x=2$, $I_y=0$, $I_t=-2$, $u=1$, and $v=0$, the residual is $2\\cdot1+0\\cdot0-2=0$.</p>" },
  { title: "Motion ambiguity analysis", background: "<p>Edges create the aperture problem: one pixel may reveal motion across an edge but hide motion along it.</p>", numbers: "<p>The same equation with $v=5$ also gives $2\\cdot1+0\\cdot5-2=0$, so the vertical component is unconstrained when $I_y=0$.</p>" },
  { title: "Patch tracking", background: "<p>Classical Lucas-Kanade tracking uses a small neighborhood so multiple gradients solve both horizontal and vertical motion.</p>", numbers: "<p>The equations $2u-2=0$ and $3v-3=0$ identify $u=1$ and $v=1$, so the local flow is $(1,1)$.</p>" },
  { title: "Self-supervised warping", background: "<p>Modern video models can learn from reconstruction: move through the predicted flow field and compare the sampled frame to the original.</p>", numbers: "<p>Pixel $(1,1)$ plus flow $(1,0)$ samples $(2,1)$. If both values are $7$, the photometric error is $7-7=0$.</p>" }
];

window.ALLML_CONTENT["7.26"].applications = [
  { title: "Fitness and sports analytics", background: "<p>Workout and sports systems track joints so they can estimate form, repetition quality, or player motion rather than just detecting a person.</p>", numbers: "<p>The heatmap $H(y,x)=\\exp(-((x-3)^2+(y-1)^2)/2)$ peaks at $(1,3)$ because the exponent is $0$, so the value is $1$.</p>" },
  { title: "Near-miss supervision", background: "<p>Gaussian heatmaps make training gentler by rewarding predictions that land near the annotated joint more than far-away guesses.</p>", numbers: "<p>One column away at $(1,2)$, the value is $\\exp(-1/2)\\approx0.607$, leaving a peak-to-neighbor margin of $1-0.607=0.393$.</p>" },
  { title: "Subpixel keypoints", background: "<p>Soft-argmax postprocessing can preserve uncertainty that a hard heatmap peak would discard, improving smooth tracking.</p>", numbers: "<p>Probabilities $[0.1,0.6,0.3]$ at columns $[2,3,4]$ give $0.1\\cdot2+0.6\\cdot3+0.3\\cdot4=3.2$.</p>" },
  { title: "Heatmap-to-image mapping", background: "<p>Pose networks often predict low-resolution heatmaps, so deployment code must map heatmap cells back to input-image coordinates correctly.</p>", numbers: "<p>A $5\\times5$ heatmap from a $20\\times20$ image has stride $4$. Peak $(1,3)$ maps with center convention to $((1+0.5)4,(3+0.5)4)=(6,14)$.</p>" },
  { title: "Skeleton grouping", background: "<p>Multi-person pose systems connect joints into skeletons so an elbow peak from one person is not paired with a wrist from another.</p>", numbers: "<p>For shoulder $(1,1)$, elbow $(1,3)$, and wrist $(1,5)$, the two limb lengths are both $2$ and the shoulder-wrist distance is $4$.</p>" }
];

window.ALLML_CONTENT["7.27"].applications = [
  { title: "Document AI", background: "<p>Document recognizers convert word crops into left-to-right feature sequences before decoding text, avoiding brittle character segmentation.</p>", numbers: "<p>A $32\\times100$ crop with horizontal stride $4$ produces $100/4=25$ steps. With $64$ channels, the sequence shape is $25\\times64$.</p>" },
  { title: "License-plate reading", background: "<p>Plates and codes often contain repeated characters, which makes CTC blank handling essential rather than decorative.</p>", numbers: "<p>The path $[b,\\varnothing,o,o,\\varnothing,k]$ merges adjacent repeated $o$ labels and removes blanks, collapsing to `bok`.</p>" },
  { title: "Scene-text recognition", background: "<p>Signs and storefront text can be slanted or noisy, so recognizers rely on multiple alignments that can still spell the same word.</p>", numbers: "<p>The path $[b,\\varnothing,o,\\varnothing,o,k]$ keeps the two $o$ labels separated by a blank, so CTC collapses it to `book`.</p>" },
  { title: "Decoder scoring", background: "<p>CTC decoders score a string by summing probabilities over all valid frame-level paths, not by trusting one segmentation.</p>", numbers: "<p>Frame probabilities $0.8$, $0.5$, and $0.7$ multiply to $0.28$. Adding another valid path with probability $0.12$ gives string probability $0.40$.</p>" },
  { title: "Text crop preprocessing", background: "<p>OCR pipelines often use super-resolution or keypoint-style corner heatmaps to rectify a text crop before sequence decoding.</p>", numbers: "<p>Nearest upsampling keeps checked position $(1,1)=1$, and a corner heatmap centered at $(1,3)$ has peak value $1$.</p>" }
];

window.ALLML_CONTENT["7.28"].applications = [
  { title: "Identity verification", background: "<p>Verification compares two embeddings rather than choosing a fixed training identity, so vector normalization is the first deployment check.</p>", numbers: "<p>Vector $[3,4]$ has norm $5$ and normalizes to $[3/5,4/5]=[0.6,0.8]$, whose norm is $1$.</p>" },
  { title: "Access-control thresholds", background: "<p>Door, device, or account recovery systems convert cosine scores into accept or reject decisions using an operating threshold.</p>", numbers: "<p>Cosine with $[1,0]$ is $0.6$, giving angle $\\arccos(0.6)=53.13^\\circ$. Threshold $0.7$ rejects while $0.5$ accepts.</p>" },
  { title: "Impostor-margin training", background: "<p>Metric-learning losses focus on impostor pairs that are too close, pushing them outside a forbidden angular neighborhood.</p>", numbers: "<p>A negative cosine $0.6$ with allowed maximum $0.4$ violates the margin by $0.2$, so the squared penalty is $0.2^2=0.04$.</p>" },
  { title: "Angular-margin classifiers", background: "<p>ArcFace-style training makes the correct class work harder by lowering its effective cosine before the softmax.</p>", numbers: "<p>With scale $10$, the correct logit drops from $10\\cdot0.8=8$ to $10\\cdot0.6=6$, a drop of $2$.</p>" },
  { title: "Deployment calibration", background: "<p>Face systems need calibrated thresholds because the same score distribution can produce different false-accept and false-reject tradeoffs.</p>", numbers: "<p>At threshold $0.65$, genuine scores $[0.9,0.8,0.6]$ produce one false reject and impostor scores $[0.7,0.4,0.2]$ produce one false accept.</p>" }
];

/* ---- batch F ---- */
window.ALLML_CONTENT["7.29"].applications = [
  { title: "Action recognition from frame evidence", background: "<p>Sports analytics, robotics, and moderation systems often begin by extracting one feature vector per frame, then asking what the whole clip shows.</p>", numbers: "<p>The lesson clip uses frame features $[[1,0],[2,1],[3,1]]$. Mean pooling gives $[(1+2+3)/3,(0+1+1)/3]=[2,2/3]$, the clip descriptor used by a simple classifier.</p>" },
  { title: "Direction-sensitive activity labels", background: "<p>Many actions use the same objects but opposite temporal order, such as opening versus closing or entering versus leaving.</p>", numbers: "<p>Reversing the same features to $[[3,1],[2,1],[1,0]]$ still averages to $[2,2/3]$. The unchanged number shows why mean pooling alone loses direction.</p>" },
  { title: "Motion features for temporal order", background: "<p>Temporal differences are a cheap motion cue before moving to recurrent, attention, or 3D convolutional models.</p>", numbers: "<p>For first-coordinate values $1,2,3$, the forward differences are $1$ and $1$, averaging to $1$. Reversed values $3,2,1$ produce $-1$ and $-1$, averaging to $-1$.</p>" },
  { title: "3D convolution cues", background: "<p>Video backbones learn filters over time, height, and width so short motion patterns can be detected locally.</p>", numbers: "<p>With temporal kernel $[1,-1]$ on scalar frame values $1,3$, the response is $1\\cdot1+3\\cdot(-1)=-2$. Reversing the frames gives $3\\cdot1+1\\cdot(-1)=2$.</p>" },
  { title: "Clip classifier probabilities", background: "<p>After temporal evidence is pooled or filtered, a final classifier converts the clip descriptor into action probabilities.</p>", numbers: "<p>Using pooled $[2,2/3]$ with run logit $2$ and sit logit $2/3$, the run probability is $e^2/(e^2+e^{2/3})\\approx0.791$.</p>" }
];

window.ALLML_CONTENT["7.30"].applications = [
  { title: "LiDAR object recognition", background: "<p>Autonomous systems ingest unordered LiDAR returns, so the model must treat the scan as a set of 3D samples rather than a sentence of rows.</p>", numbers: "<p>The checked point cloud contains $[0,0,0]$, $[1,0,0]$, $[0,1,0]$, and $[0,0,1]$: $4$ rows with $3$ coordinates each, so its shape is $4\\times3$.</p>" },
  { title: "Order-invariant scanning", background: "<p>PointNet-style models use the same point feature extractor everywhere and a symmetric operation to summarize the object.</p>", numbers: "<p>The feature table $\\begin{bmatrix}1&3\\2&1\\0&5\\end{bmatrix}$ max-pools coordinate-wise to $[\\max(1,2,0),\\max(3,1,5)]=[2,5]$.</p>" },
  { title: "File-shuffle robustness", background: "<p>Point-cloud files may list identical geometry in arbitrary row order, so predictions should not change after a shuffle.</p>", numbers: "<p>Reordering rows to $\\begin{bmatrix}0&5\\1&3\\2&1\\end{bmatrix}$ keeps the coordinate-wise maxima $[2,5]$, proving permutation invariance for the pooling step.</p>" },
  { title: "Shared point features", background: "<p>The same learned function is applied to every point, preventing row index from becoming a hidden coordinate.</p>", numbers: "<p>With $h([x,y,z])=[x+2y,z]$, $h([1,0,0])=[1,0]$ and $h([0,1,0])=[2,0]$. The max over the two is $[2,0]$ regardless of order.</p>" },
  { title: "Density and multiplicity caveat", background: "<p>Max pooling is robust to duplicated samples, but that also means it can ignore how often a feature appears.</p>", numbers: "<p>Feature sets $\\{[2,5],[1,3]\\}$ and $\\{[2,5],[2,5],[1,3]\\}$ both max-pool to $[2,5]$, so duplicating the strongest point does not change the descriptor.</p>" }
];

window.ALLML_CONTENT["7.31"].applications = [
  { title: "Novel-view synthesis rays", background: "<p>NeRF renders a new view by casting one camera ray per pixel and querying a continuous field along that ray.</p>", numbers: "<p>For $r(t)=o+td$ with origin $[0,0]$, direction $[1,0.5]$, and $t=2$, the sampled point is $[0,0]+2[1,0.5]=[2,1]$.</p>" },
  { title: "Volume rendering opacity", background: "<p>Density is not directly a color or a surface; it becomes opacity after accounting for the distance between samples.</p>", numbers: "<p>With density $\\sigma=0.1$ and interval $\\delta=0.5$, opacity is $1-e^{-\\sigma\\delta}=1-e^{-0.05}\\approx0.0488$.</p>" },
  { title: "Opaque-surface modeling", background: "<p>High-density regions behave more like surfaces because they absorb more of the ray before light reaches later samples.</p>", numbers: "<p>Using the same $\\delta=0.5$ but density $\\sigma=3$, opacity is $1-e^{-1.5}\\approx0.7769$, much larger than $0.0488$.</p>" },
  { title: "Front-to-back compositing", background: "<p>Transmittance prevents hidden samples from contributing as if foreground density were transparent.</p>", numbers: "<p>For alpha values $[0.2,0.5,0.1]$, the survival before each sample is $T_1=1$, $T_2=1-0.2=0.8$, and $T_3=(1-0.2)(1-0.5)=0.4$.</p>" },
  { title: "Rendered pixel color", background: "<p>The final pixel is an accumulated radiance value, not simply the color of the nearest sample.</p>", numbers: "<p>Weights $[0.2,0.4,0.04]$ on red, green, and blue unit colors produce $0.2[1,0,0]+0.4[0,1,0]+0.04[0,0,1]=[0.2,0.4,0.04]$.</p>" }
];

