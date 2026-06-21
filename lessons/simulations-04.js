/* Mock ML-engineering "lab" scenarios. Merged into window.SIMULATIONS by application id.
   { title, icon, goal, stages:[ { phase, icon, title, narrative(HTML), concepts:[lessonIds],
     steps:[ {type:"decide", prompt, options:[{label, feedback, best?}]} | {type:"run", label, prompt?, result:{log?, metrics?:[{k,v}], note?}} ] } ] } */
window.SIMULATIONS = Object.assign(window.SIMULATIONS || {}, {
  "computer-vision": {
    title: "Computer Vision",
    icon: "📷",
    goal: "Build an object detector that finds and boxes products on warehouse shelves — accurately, and fast enough to run on edge cameras.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>A retailer wants cameras to spot empty shelves so staff can restock before a customer walks away. Each frame holds dozens of products at once, so you must <i>locate and identify every item</i> — not just label the whole picture. This is the <b>object detection</b> task benchmarked by <b>COCO</b> (Common Objects in Context: 330K images, 80 object classes, 1.5M labeled instances) — the standard against which detectors report mAP (mean Average Precision). How you frame the task decides everything downstream: a per-frame label (the <b>ImageNet</b> setup — 1.28M images, 1000 classes, one label each) can't say <i>which</i> slot is empty, but a box per product can. That single framing choice fixes your labels, your loss, and your metrics.</p>`,
        concepts: ["dl-object-detection", "ml-classification-metrics"],
        insight: `<b>One label per frame throws away the answer.</b> A COCO image averages <b>~7 labeled objects</b> and a dense shelf frame holds dozens, but the business question is "which slot is empty?" — a location, not a category. Image classification (ImageNet-style: one of 1000 labels per image) collapses every item into one label and erases position, so it literally cannot answer the question. Detection keeps a box per item — the COCO ground-truth format — which is why COCO's 1.5M instance annotations cost ~$20\\times$ more to label than ImageNet's image tags, but it's the only framing that works.`,
        data: {
          caption: "What one labeled image looks like (COCO object-detection ground truth)",
          columns: ["box_id", "category", "bbox [x, y, w, h]", "area (px²)", "iscrowd"],
          rows: [
            ["1001", "person (id 1)", "[412, 88, 64, 120]", "7680", "0"],
            ["1002", "bottle (id 44)", "[498, 102, 28, 70]", "1960", "0"],
            ["1003", "backpack (id 27)", "[560, 90, 70, 118]", "8260", "0"],
            ["… ~7 objects", "…", "…", "…", "…"]
          ],
          note: `This is COCO's annotation schema: each object is one row with a bbox [x, y, w, h], an integer category_id (1 of 80), area, and iscrowd flag. An ImageNet classification label would be a single value like "shelf" for the whole image — none of these rows, so none of the empty-slot information survives.`
        },
        symbols: [
          { sym: "box $(x,y,w,h)$", desc: "a COCO bounding box: top-left corner $(x,y)$ plus width $w$ and height $h$ in pixels — where an object sits in the frame." },
          { sym: "class", desc: "the category predicted for each box (one of COCO's 80 object classes; your warehouse uses a 60-SKU subset)." },
          { sym: "IoU", desc: "Intersection-over-Union: overlap area of predicted and true box divided by their union; the score that decides if a box is 'correct' (defined fully at Evaluate)." },
          { sym: "mAP", desc: "mean Average Precision: precision averaged across classes and IoU thresholds — the headline detection metric." }
        ],
        steps: [{
          type: "decide", prompt: "Whole-image classification or object detection?",
          options: [
            { label: "Image classification — one label per frame", feedback: "this framing destroys the only signal you need. A frame holds ~21 products, and the product question is WHERE the gap is — but one label per image has no notion of position, so it can never point at a slot. You'd train a model that says 'this is a shelf' while the empty-shelf alert it was built for is impossible to produce." },
            { label: "Object detection — a box + class for every product", best: true, feedback: "correct, and here's the mechanism: detection outputs a $(x,y,w,h)$ box plus a class per item, so you can count stock per SKU and flag a slot whose expected product is missing. It costs far more to label (you draw 21 boxes, not click 1 button) but it's the only output shape that encodes location. You'll score it with IoU and mAP downstream." },
            { label: "Pixel regression of brightness", feedback: "this isn't a recognition task at all — predicting a brightness value per pixel optimizes image reconstruction, which is unrelated to 'is product X present in slot Y?'. It ignores both the class and the location you actually need, so even a perfect brightness map tells staff nothing about restocking." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labeled images",
        narrative: `<p>Detection is supervised: each training image needs a human-drawn box and class for every product — far more expensive than a single image label. The public benchmarks show the cost: <b>COCO</b> ships <b>118K train images with 860K boxes</b>, and <b>Open Images</b> pushes further to <b>1.7M images and ~14.6M boxes across 600 classes</b>. You build your own shelf set the same way — pull store footage spanning many stores, lighting conditions, and times of day, then send it for box annotation. The diversity matters: a model trained only on bright midday aisles will fail at dusk, so what you sample now bounds what the model can ever handle.</p>`,
        concepts: ["ml-supervised", "dl-object-detection"],
        insight: `<b>Box labels are the cost center.</b> COCO's 118K-image train split carries <b>~860K boxes</b> (~7.3 per image), each a human click-drag-classify; your shelf job produced <b>511,402 boxes across 24,000 frames</b> — about <b>21 boxes per frame</b> because shelves are far denser than typical COCO scenes. At even a few seconds per box that's days of annotator time, which is why double-review quality matters: a wrong box is a wrong training target you pay twice for. Auto-labeling looks cheaper but copies an existing model's blind spots straight into your ground truth.`,
        data: {
          caption: "Annotation batch summary (vs the COCO benchmark)",
          columns: ["field", "your shelf set", "COCO train2017", "why it matters"],
          rows: [
            ["images", "24,000", "118,287", "store/lighting/angle diversity"],
            ["boxes", "511,402", "860,001", "the supervised targets the model fits"],
            ["avg boxes/image", "21.3", "7.3", "dense shelves → small-object problem ahead"],
            ["classes", "60", "80", "product classifier head width"],
            ["blurry rejected", "4.2%", "—", "bad frames re-shot, not trained on"]
          ],
          note: `Each box is a labeled example $(x,y,w,h,\\text{class})$, the COCO format. Shelves pack ~3× more objects per image than COCO's everyday scenes. The 4.2% blurry frames are dropped because a box on an unreadable image teaches the model noise.`
        },
        symbols: [
          { sym: "frame", desc: "one captured image from a store camera; the input example." },
          { sym: "box label", desc: "the supervised target: a $(x,y,w,h)$ rectangle plus a class, drawn by a human annotator." },
          { sym: "boxes/frame", desc: "average number of labeled objects per image (21.3) — high density means many tiny objects to detect." }
        ],
        steps: [
          { type: "decide", prompt: "How do you get reliable box labels?",
            options: [
              { label: "Have trained annotators draw boxes, with a second pass for quality review", best: true, feedback: "this is the right call because detection accuracy is capped by label accuracy — a model can't learn a box more precise than the ones it's shown. Trained annotators give consistent boxes, and a second review pass catches mislabels and missed objects before they become training targets. It's slow and costly, but every other option trades label quality for speed and pays for it in model errors." },
              { label: "Auto-label with an off-the-shelf detector and ship it", feedback: "this bakes another model's mistakes into your ground truth. Whatever that detector misses — small items, your specific packaging, your lighting — becomes a silent gap in your labels, and your model then learns to reproduce exactly those blind spots. You'd be distilling someone else's errors, and you can't exceed the teacher you copied." },
              { label: "Use the whole image as one big box", feedback: "this collapses 21 distinct products into a single rectangle, erasing every object's position — the exact information detection exists to provide. The model would learn 'there is a shelf here' and nothing about individual items, which defeats the empty-slot goal. It's classification wearing a box's clothes." }
            ] },
          { type: "run", label: "▶ Pull & annotate frames", prompt: "Sample frames across stores, lighting, and times of day.",
            result: { log: "sampled 24,000 frames from 38 stores\nannotated boxes: 511,402  (avg 21.3 per frame; COCO averages 7.3)\nbox format: [x, y, w, h] + category_id (COCO schema)\nclasses: 60 product types (subset of COCO's 80)\nflagged 4.2% frames as blurry -> sent to re-shoot", metrics: [{ k: "frames", v: "24k" }, { k: "boxes", v: "511k" }, { k: "classes", v: "60" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Look before you train. Detection datasets hide two killers in plain sight: <b>class imbalance</b> (some SKUs (Stock Keeping Units) appear thousands of times, others almost never) and <b>tiny objects</b> (small items lose all their detail when a CNN (Convolutional Neural Network) downsamples). COCO itself bakes this in — it defines a <b>small</b> object as area &lt;$32^2$px ($1024$px²) and reports mAP separately for small/medium/large, because <b>~41% of COCO instances are "small"</b> and detectors score far worse on them. Profiling now tells you which architecture and augmentation choices you'll need later — a problem you don't see in exploration becomes a mystery failure in evaluation.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics"],
        insight: `<b>A 220:1 imbalance and a small-object cliff.</b> The most common SKU has <b>41,800 boxes</b> and the rarest just <b>190</b> — so naive training sees the rare class once for every 220 common boxes and barely learns it (COCO has this too: classes range from 250K+ "person" boxes down to a few hundred for rare classes like "hair drier"). Worse, <b>23% of all boxes are &lt;32px</b> on a side — COCO's "small" cutoff: after a CNN downsamples an image 32×, a 32px object shrinks to a single feature-map cell, so its detail is literally gone. These two facts will explain your weakest recall slices later.`,
        data: {
          caption: "Dataset profile (box counts and sizes)",
          columns: ["slice", "count / share", "consequence"],
          rows: [
            ["most common SKU", "41,800 boxes", "well-learned"],
            ["rarest SKU", "190 boxes", "starved → 220:1 imbalance"],
            ["boxes &lt;32px (COCO 'small')", "23%", "vanish after downsampling"],
            ["very dark stores", "3 of 38", "under-exposed inputs"],
            ["duplicate frames", "1,108", "near-identical, leak risk"]
          ],
          note: `Imbalance ratio = 41,800 / 190 ≈ 220:1. "Small" = area &lt;$32^2$px, COCO's own threshold. Duplicates (same camera, 1s apart) get de-duped so the same scene can't sit in both train and validation, which would inflate scores.`
        },
        chart: { type: "bars", title: "Box count by SKU rank (220:1 imbalance)", labels: ["most common", "2nd", "median SKU", "rarest"], values: [41800, 22400, 3100, 190], colors: ["#4ea1ff", "#4ea1ff", "#ffb454", "#ff7b72"] },
        symbols: [
          { sym: "imbalance ratio", desc: "most-common class count ÷ rarest class count (here $41800/190\\approx 220$); how lopsided the label distribution is." },
          { sym: "32px", desc: "an object smaller than 32 pixels on a side; after typical $32\\times$ downsampling it covers under one feature cell." },
          { sym: "downsampling", desc: "the stride-based shrinking a CNN applies; halving spatial size repeatedly is what erases tiny-object detail." }
        ],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "class counts: top class 41,800 boxes, rarest class 190\nbox sizes: 23% of boxes are &lt;32px (small objects)\nlighting: 3 stores are very dark (under-exposed)\nduplicate frames found: 1,108 (same camera, 1s apart)", metrics: [{ k: "imbalance", v: "220:1" }, { k: "tiny boxes", v: "23%" }] } },
          { type: "decide", prompt: "23% of objects are smaller than 32px. What does that imply?",
            options: [
              { label: "Ignore it — small and large objects train the same", feedback: "they don't train the same, and that's the trap. Each pooling/stride layer halves resolution, so a 32px object becomes sub-pixel on deep feature maps and the network has nothing left to detect. Small objects are already the hardest case in detection; ignoring them means they quietly dominate your miss list while the average metric still looks fine." },
              { label: "Keep input resolution high and add multi-scale features so small items survive downsampling", best: true, feedback: "right — the fix has to restore the detail downsampling destroys. Higher input resolution gives small objects more pixels to begin with, and a feature pyramid (FPN, Feature Pyramid Network) detects on several scales so small items are found on the high-resolution shallow maps before they vanish. This directly targets the 23% small-box slice instead of hoping the average hides it." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Augment the data",
        narrative: `<p>Cameras see varied lighting, angles, and partial occlusion, but your 24k frames can't cover every combination. Data augmentation synthesizes that variety for free: each epoch a fresh random transform is sampled per image, so the CNN learns the invariant (the product) instead of memorizing the nuisance (one store's lighting). Concretely each op samples from a range — brightness $\\times U(0.8,1.2)$, contrast $\\times U(0.8,1.2)$, horizontal flip with probability $0.5$, scale $\\times U(0.8,1.2)$ then a random crop back to input size. Geometric ops also transform the boxes so labels stay valid (a flip maps $x\\to W-x-w$; a scale-by-$s$ multiplies every box coordinate by $s$). The key rule is that augmentations stay <i>physically plausible</i> — teach a world the cameras actually see.</p>`,
        concepts: ["dl-data-augmentation", "dl-conv"],
        insight: `<b>Augmentation multiplies a fixed dataset.</b> With brightness jitter, horizontal flip, and scale crops, each of the 24k frames yields effectively dozens of distinct training views — cheap robustness without paying to label more boxes. But direction matters: a horizontal flip is a real camera angle, while a <b>180° rotation is an upside-down shelf that never exists</b>, so it wastes model capacity learning an impossible world. Good augmentation only adds variation the deployment cameras will actually encounter.`,
        data: {
          caption: "Augmentation policy (plausible vs not)",
          columns: ["augmentation", "use?", "real-world justification"],
          rows: [
            ["brightness/contrast ±20%", "yes", "lighting varies by store & time of day"],
            ["horizontal flip", "yes", "camera can sit either side of an aisle"],
            ["scale jitter + small crop", "yes", "products appear at varied distances"],
            ["vertical flip / 180° rotate", "no", "shelves are never upside-down"],
            ["heavy color shift", "no", "would invent unreal product colors"]
          ],
          note: `Geometric augmentations transform the boxes too (a flip mirrors $x\\to W-x-w$), so labels stay valid. Augmentations that imply an impossible scene only dilute training.`
        },
        symbols: [
          { sym: "augmentation", desc: "a label-preserving transform applied to training images so one frame yields many views." },
          { sym: "invariance", desc: "the property you want: prediction unchanged under nuisance changes (lighting, flip) — what augmentation teaches." },
          { sym: "scale jitter", desc: "randomly resizing the image so objects appear at different pixel sizes, helping the small-object problem." }
        ],
        steps: [
          { type: "decide", prompt: "Which augmentations fit shelf detection?",
            options: [
              { label: "Random brightness/contrast, horizontal flip, small crops and scale jitter", best: true, feedback: "these match the real variation the cameras see — different store lighting, either-side camera placement, and products at varied distances — so the model is pushed to rely on product appearance, not on a memorized lighting level. Each is also box-safe: flips and crops transform the boxes accordingly, keeping labels valid. This is robustness bought without a single new annotation." },
              { label: "Vertical flips and 180° rotations", feedback: "this teaches an impossible world. Shelves are never upside-down in a store, so capacity spent learning inverted products is wasted, and worse, it can hurt — the model may become invariant to an orientation cue that actually carries real information. Augmentation should expand toward realistic variation, not fabricate scenes that never occur." },
              { label: "No augmentation — the dataset is big enough", feedback: "24k frames feels large but it's a fixed, finite slice of lighting and angle combinations; the dark stores and dusk shots are under-represented, and the model will overfit the conditions it happened to see. Augmentation is the cheapest robustness you can buy — skipping it leaves easy generalization on the table and guarantees a brittle model at deployment-time lighting." }
            ] },
          { type: "run", label: "▶ Apply augmentation policy", prompt: "Sample a random transform per image each epoch.", result: { log: "per-image random pipeline (sampled fresh each epoch):\n  brightness x U(0.8,1.2), contrast x U(0.8,1.2)\n  horizontal flip p=0.5  -> box x -> W-x-w\n  scale x U(0.8,1.2) + random crop to 640x640 -> box coords x scale\nexample box b001 (412,88,64,120): flipped+scaled 0.9 -> (?, 79, 58, 108)\n24k base frames x ~30 distinct sampled views = ~720k effective training images\nno new labels drawn", metrics: [{ k: "base frames", v: "24k" }, { k: "effective views", v: "~720k" }] } }
        ]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick an architecture",
        narrative: `<p>The detector must run on cheap in-store edge hardware at several frames per second, so the architecture choice is a speed-vs-accuracy trade, not just an accuracy race. A single-stage detector predicts all boxes in one forward pass; a two-stage detector first proposes regions then classifies them — more accurate but roughly $2$–$3\\times$ slower. The compute budget, not the leaderboard, picks the family here.</p><p>Concretely, a single-stage detector tiles the image with a grid of <b>anchor boxes</b> — pre-set reference rectangles at each cell, in a few aspect ratios and scales. For every anchor the network outputs four <i>offset</i> numbers $(t_x,t_y,t_w,t_h)$ that nudge the anchor into the true box ($x = x_a + t_x w_a$, $w = w_a\\,e^{t_w}$, and likewise for $y,h$), an objectness score, and 60 class scores. So "predict all boxes in one pass" means: score every anchor and regress its offset, then keep the confident ones.</p>`,
        concepts: ["dl-conv", "dl-object-detection", "mod-vit"],
        insight: `<b>The frame-rate budget rules out the heavy options.</b> The edge camera needs ~$25$ fps (frames per second), which is a hard <b>~40 ms per frame</b> latency ceiling. A full-resolution Vision Transformer or a two-stage detector can win a few mAP points but cost $100$+ ms — they'd run at well under $10$ fps and miss the budget by $2$–$3\\times$. A single-stage CNN detector lands near $38$ ms (~$26$ fps), so it's the only family that fits before you even compare accuracy. It reaches that speed by predicting box <b>offsets off a fixed anchor grid</b> in one pass: roughly a $20\\times20$ grid $\\times$ 3 aspect ratios $= 1{,}200$ anchors per scale, each regressed and scored simultaneously rather than via a slow region-proposal stage.`,
        data: {
          caption: "Detector families vs the edge budget",
          columns: ["family", "≈ latency", "≈ mAP@0.5", "fits ~40ms?"],
          rows: [
            ["single-stage CNN (YOLO-style)", "38 ms", "0.70", "yes"],
            ["two-stage (max-mAP tuned)", "110 ms", "0.74", "no"],
            ["full-res Vision Transformer", "180 ms", "0.75", "no"]
          ],
          note: `Numbers are on the target edge chip. The extra ~0.04–0.05 mAP from the heavy models isn't worth running at &lt;10 fps on hundreds of cameras — accuracy you can't serve in budget isn't usable.`
        },
        symbols: [
          { sym: "single-stage", desc: "a detector that predicts boxes + classes in one network pass (fast); contrast with two-stage propose-then-classify." },
          { sym: "anchor box", desc: "a pre-set reference rectangle tiled across the image grid at fixed scales/aspect ratios; the network predicts an offset $(t_x,t_y,t_w,t_h)$ from each anchor rather than absolute coordinates." },
          { sym: "box offset", desc: "the four regressed numbers that turn an anchor into a prediction: $x=x_a+t_x w_a$, $y=y_a+t_y h_a$, $w=w_a e^{t_w}$, $h=h_a e^{t_h}$." },
          { sym: "fps", desc: "frames per second the model can process; the camera target is ~25, i.e. ~40 ms/frame." },
          { sym: "backbone", desc: "the CNN feature extractor the detector head sits on; its size sets most of the latency." }
        ],
        steps: [{
          type: "decide", prompt: "Choose a first detector.",
          options: [
            { label: "A single-stage CNN detector (YOLO (You Only Look Once)-style) sized for edge inference", best: true, feedback: "this is the right starting point because it's the only family inside the latency budget: it predicts every box in one pass at ~38 ms (~26 fps) while still reaching ~0.70 mAP. You buy real-time edge inference at a small accuracy cost, and if accuracy later stalls you can revisit heavier heads. Match the architecture to the deployment constraint first, then optimize accuracy within it." },
            { label: "A huge Vision Transformer at full resolution", feedback: "accuracy isn't the binding constraint here — latency is. A full-res ViT can win a point or two of mAP but costs ~180 ms/frame, so it runs at under 6 fps on the edge chip and blows the ~40 ms budget by 4-5×. Hundreds of cameras can't each carry that compute, so this model is unusable in production no matter how good its numbers look offline." },
            { label: "A two-stage detector tuned purely for max mAP", feedback: "the propose-then-classify pipeline is genuinely more accurate, but at ~110 ms it runs near 9 fps — still well past the frame budget. Optimizing 'purely for max mAP' is the wrong objective when the product needs real-time on cheap hardware; this is a candidate to revisit only if the single-stage detector's accuracy stalls AND you can afford the compute." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the detector",
        narrative: `<p>You train the CNN by gradient descent on a <b>detection loss</b> with two parts: a localization term (how far the predicted box is from the true box, e.g. smooth-L1 on the $(t_x,t_y,t_w,t_h)$ offsets) and a classification term on the 60 classes. But ~$1{,}200$ anchors fire per image and only ~21 hold an object, so the classification term is swamped by easy background — a foreground:background imbalance near $1{:}50$. The fix is <b>focal loss</b>: scale each example's cross-entropy by $(1-p_t)^{\\gamma}$ (with $\\gamma\\approx2$), where $p_t$ is the predicted probability of the true class. Easy backgrounds have $p_t\\to1$ so $(1-p_t)^2\\to0$ and they nearly vanish from the gradient, while hard foregrounds keep full weight. Batch-norm keeps activations well-scaled. You watch <i>validation mAP</i>, not training loss — loss keeps falling as the model memorizes, so val mAP tells you when to stop.</p>`,
        concepts: ["ml-gradient-descent", "dl-batchnorm", "dl-cross-entropy"],
        insight: `<b>Train loss and val metric diverge — trust the metric.</b> From epoch 30 to 50 train loss keeps dropping ($2.18\\to1.74$) but val mAP barely moves ($0.671\\to0.708$ and then flat). That gap is the model fitting training quirks that don't generalize. The best checkpoint is <b>epoch 47</b>, not 50 — early stopping picks the peak val mAP and discards the later overfitting epochs, which is why you save by validation, not by final loss.`,
        data: {
          caption: "Training curve (loss falls, val metric plateaus)",
          columns: ["epoch", "train loss", "val mAP@0.5", "signal"],
          rows: [
            ["10", "3.91", "0.512", "still learning"],
            ["30", "2.18", "0.671", "gaining"],
            ["47", "1.85", "0.709", "best checkpoint"],
            ["50", "1.74", "0.708", "loss↓ but val flat → overfit"]
          ],
          note: `The detection loss = localization (smooth-L1 on box offsets) + focal classification loss, where the $(1-p_t)^2$ factor mutes the easy-background anchors. Early stopping keeps epoch 47 because val mAP stopped improving — extra epochs only lowered train loss.`
        },
        symbols: [
          { sym: "detection loss", desc: "sum of a box-regression (localization) term and a focal classification term, minimized by gradient descent." },
          { sym: "focal loss", desc: "cross-entropy reweighted by $(1-p_t)^{\\gamma}$ ($\\gamma\\approx2$, $p_t$ = prob of the true class); down-weights the swarm of easy background anchors so the few foreground objects dominate the gradient." },
          { sym: "mAP@0.5", desc: "mean Average Precision counting a box correct when IoU with the truth $\\geq 0.5$." },
          { sym: "batch-norm", desc: "normalizes each layer's activations per mini-batch, stabilizing and speeding convergence." },
          { sym: "early stopping", desc: "halt (or checkpoint) at the epoch with best validation metric to avoid overfitting." }
        ],
        steps: [{
          type: "run", label: "▶ Train detector (50 epochs)",
          result: { log: "training single-stage detector (focal loss, gamma=2)...\nfg:bg anchors per image ~21:1200 -> focal (1-p_t)^2 mutes easy bg\nepoch 10  train loss 3.91  val mAP@0.5 0.512\nepoch 30  train loss 2.18  val mAP@0.5 0.671\nepoch 50  train loss 1.74  val mAP@0.5 0.708  (val plateaued, early stop armed)\nbest checkpoint: epoch 47", metrics: [{ k: "val mAP@0.5", v: "0.708" }, { k: "epochs", v: "47" }], chart: { type: "line", title: "Training: val mAP@0.5 vs epoch (best at 47)", xlabel: "epoch", ylabel: "val mAP@0.5", series: [{ name: "val mAP@0.5", color: "#7ee787", points: [[10, 0.512], [30, 0.671], [47, 0.709], [50, 0.708]] }] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate with mAP & IoU",
        narrative: `<p>First clean the raw outputs. The detector fires several overlapping anchors on one object, so you run <b>non-max suppression (NMS)</b>: sort all kept boxes of a class by score, take the top one, and drop every remaining box whose <b>IoU</b> with it exceeds a threshold (e.g. $0.5$); repeat on what's left. That leaves one box per object. <b>IoU</b> (Intersection over Union) measures overlap — and it both drives NMS and decides whether a surviving box counts as "correct" against ground truth.</p><p>Then compute <b>mAP</b> per class: sort that class's predictions by confidence, walk down the list matching each to a true box at IoU $\\geq 0.5$ (a match is a true positive, otherwise a false positive), and at every step record running <b>precision</b> $=TP/(TP+FP)$ and <b>recall</b> $=TP/\\text{(all true boxes)}$. Those points trace a precision–recall curve; its area is the class's <b>Average Precision (AP)</b>. <b>mAP</b> is the mean AP over all 60 classes. You also evaluate on <i>unseen stores</i> and slice by object size — a healthy average can hide a broken slice.</p>`,
        concepts: ["dl-object-detection", "ml-classification-metrics", "ml-roc-auc"],
        insight: `<b>The average is healthy; the slice that matters is not.</b> Headline <b>mAP@0.5 is 0.701</b> — the mean over 60 per-class areas-under-the-PR-curve — but recall on <b>small/rare items is only 0.39</b>, precisely the empty-shelf cases the system exists to catch. So a number that says "70% good" hides a 39% slice that drives the business value. The stricter <b>mAP@0.5:0.95 (0.448)</b> — the COCO primary metric, which re-runs the whole AP computation at IoU cutoffs $0.5,0.55,\\dots,0.95$ and averages — drops sharply, telling you boxes are roughly placed but not tightly localized. (For reference, top COCO detectors reach ~0.55–0.60 mAP@0.5:0.95.)`,
        data: {
          caption: "Holdout evaluation (6 unseen stores)",
          columns: ["metric", "value", "reading"],
          rows: [
            ["mAP@0.5", "0.701", "loose-overlap accuracy: ok"],
            ["mAP@0.5:0.95", "0.448", "tight-overlap: boxes imprecise"],
            ["recall, small/rare", "0.39 ⚠", "the slice the business needs"],
            ["edge latency", "38 ms", "~26 fps, within budget"]
          ],
          note: `IoU = (area of overlap) / (area of union). NMS uses it to delete duplicate boxes (drop any box with IoU &gt; 0.5 vs a higher-scoring one). AP = area under one class's precision-recall curve; mAP@0.5 = mean AP over classes at IoU ≥ 0.5; mAP@0.5:0.95 averages that over 10 IoU cutoffs.`
        },
        symbols: [
          { sym: "IoU", desc: "Intersection over Union $= \\dfrac{\\text{area}(\\text{pred}\\cap\\text{true})}{\\text{area}(\\text{pred}\\cup\\text{true})}$; 1 is a perfect box, 0 is no overlap." },
          { sym: "NMS", desc: "non-max suppression: sort boxes by score, keep the top one, drop any later box with IoU above a threshold against a kept box; removes duplicate detections of one object." },
          { sym: "precision / recall", desc: "at a confidence cutoff, precision $=\\dfrac{TP}{TP+FP}$ (how many predictions are right) and recall $=\\dfrac{TP}{\\text{all true boxes}}$ (how many objects were found)." },
          { sym: "AP (Average Precision)", desc: "area under one class's precision–recall curve, swept by lowering the confidence threshold; a single number summarizing the precision/recall trade for that class." },
          { sym: "mAP@0.5", desc: "mean of the per-class AP values with the hit threshold IoU $\\geq 0.5$." },
          { sym: "mAP@0.5:0.95", desc: "mAP averaged over IoU thresholds $0.5,0.55,\\dots,0.95$; rewards tight localization." }
        ],
        steps: [
          { type: "run", label: "▶ NMS + per-class AP on holdout", result: { log: "holdout: 6 unseen stores, 4,900 frames\nNMS: 312,000 raw boxes -> 104,500 after dropping IoU>0.5 duplicates\nexample IoU: pred 64x118 vs true 64x120 overlap 7050/7610 = 0.93 (hit)\nper-class AP@0.5 (sort by conf, integrate precision-recall):\n  cereal_box AP 0.88   soda_can AP 0.81   ...   rare_sku AP 0.31\nmAP@0.5 = mean of 60 class APs = 0.701\nmAP@0.5:0.95 (avg AP over IoU 0.5..0.95) = 0.448\nper-class: small/rare items recall 0.39 (weak)\nlatency on edge: 38 ms/frame (~26 fps)", metrics: [{ k: "mAP@0.5", v: "0.701" }, { k: "small recall", v: "0.39 ⚠" }, { k: "fps", v: "26" }], chart: { type: "bars", title: "Holdout metrics: average is fine, small-item slice is not", labels: ["mAP@0.5", "mAP@0.5:0.95", "recall small/rare"], values: [0.701, 0.448, 0.39], colors: ["#7ee787", "#ffb454", "#ff7b72"] } } },
          { type: "decide", prompt: "mAP looks fine but small/rare items have recall 0.39. What does that tell you?",
            options: [
              { label: "The headline mAP hides a real failure mode on small and rare classes", best: true, feedback: "right — mAP is an average over classes and objects, and averages drown out minorities. Small/rare items are a fraction of all boxes, so their 0.39 recall barely dents a 0.701 headline, yet those are the exact empty-shelf cases that justify the project. The lesson: always slice the metric by the dimension the business cares about, because the aggregate can stay green while the important slice fails." },
              { label: "Nothing — average mAP is the only number that matters", feedback: "this confuses the model's average with the product's goal. The business value is catching empty shelves, which are disproportionately small/rare items — exactly the slice sitting at 0.39 recall. Reporting only the average mAP would let you ship a model that looks fine on paper and silently misses the cases it was built for." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Small-item recall is the bottleneck, so you do <b>error analysis</b> on the misses before touching any knob. The misses cluster on two causes: tiny objects whose detail was destroyed by downsampling, and rare classes the model saw too few times. Naming the cause matters — the right fix targets the mechanism, while popular non-fixes (more epochs, lower threshold) leave the cause untouched and create new problems.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "dl-data-augmentation"],
        insight: `<b>Two causes, one targeted fix.</b> Of the small-item misses, error analysis shows they are <b>&lt;32px objects lost to downsampling</b> plus <b>classes with as few as 190 boxes</b>. The fix must restore detail (higher resolution + feature pyramid) AND supply examples (oversample rare/small frames). Contrast the tempting shortcuts: more epochs only deepens overfitting on a plateaued loss, and dropping the confidence threshold trades a few rescued boxes for a flood of false positives everywhere — precision collapses.`,
        data: {
          caption: "Error analysis → matched fix",
          columns: ["miss cause", "evidence", "the fix that targets it"],
          rows: [
            ["detail lost to downsampling", "23% boxes &lt;32px", "higher input res + feature pyramid"],
            ["too few examples", "rarest class 190 boxes", "oversample small/rare frames"],
            ["(not the cause) underfit", "loss already plateaued", "more epochs → won't help"],
            ["(not the cause) threshold", "precision still high", "lowering it → false-positive flood"]
          ],
          note: `Error analysis means reading the actual misses, not guessing. Here the misses point at resolution + class scarcity, so those are what you change.`
        },
        symbols: [
          { sym: "error analysis", desc: "manually categorizing a model's mistakes to find the dominant cause before choosing a fix." },
          { sym: "feature pyramid", desc: "a detector neck (FPN) that predicts on multiple resolutions so small objects are caught on shallow high-res maps." },
          { sym: "oversampling", desc: "drawing rare/small-object examples more often per epoch so the model sees them enough to learn." },
          { sym: "confidence threshold", desc: "the score cutoff above which a detection is kept; lowering it raises recall but floods false positives." }
        ],
        steps: [{
          type: "decide", prompt: "Best way to lift small-object recall?",
          options: [
            { label: "Increase input resolution, add a feature pyramid, and oversample frames with small/rare items", best: true, feedback: "this is the fix that matches the diagnosis. Higher resolution and a feature pyramid restore the spatial detail that downsampling destroyed, so tiny objects survive to a detectable scale; oversampling rare/small frames gives the starved classes enough gradient signal to actually learn. Each change maps to a named cause from error analysis — that's how you fix a failure instead of guessing at it." },
            { label: "Just train for 200 more epochs", feedback: "the training loss already plateaued, so the model isn't underfitting — more epochs won't conjure detail that downsampling already threw away, nor invent examples of a class with 190 boxes. You'd mostly deepen overfitting on the common classes while the small-object slice stays exactly where it is. This treats duration as if it were the problem; it isn't." },
            { label: "Lower the confidence threshold for every class", feedback: "this is a global knob aimed at a local problem. Dropping the threshold everywhere does surface a few more small-object boxes, but it simultaneously admits a storm of low-confidence false positives across all 60 classes, so precision craters. You'd trade a small recall gain for a large precision loss — fix the features that lost the objects, not the threshold that filters them." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to edge cameras",
        narrative: `<p>The model must run on hundreds of in-store cameras with limited compute and flaky networks. Two decisions: <i>where</i> inference runs (on the camera vs streamed to a central cluster) and <i>how</i> you roll it out (all at once vs a staged canary). <b>Quantization</b> shrinks the model to int8 so it fits the edge chip, trading a sliver of accuracy for speed and memory. A canary on a few stores catches surprises before they hit the whole fleet.</p>`,
        concepts: ["dl-conv-hyperparams", "dl-object-detection"],
        insight: `<b>Quantization is a cheap trade; centralization is an expensive risk.</b> Going to int8 costs only <b>0.007 mAP ($0.701\\to0.694$)</b> but roughly $4\\times$ shrinks the model and lets each camera run inference locally at $27$ fps. The alternative — streaming full video from hundreds of cameras to a GPU cluster — means continuous high-bandwidth uplink per store and one central failure point for the entire chain. On-device plus a $5$-store canary keeps cost low and blast radius small.`,
        data: {
          caption: "Deployment options compared",
          columns: ["choice", "bandwidth", "failure blast radius", "latency"],
          rows: [
            ["on-device int8, staged", "near zero (local)", "1 camera", "~37 ms"],
            ["stream all to central GPU", "huge per store", "whole fleet", "+ network RTT"],
            ["int8 accuracy cost", "—", "—", "−0.007 mAP (ok)"]
          ],
          note: `int8 quantization stores weights as 8-bit integers instead of 32-bit floats: ~4× smaller, faster on edge accelerators, tiny accuracy loss. Canary = roll out to 5 stores, watch 48h, then promote.`
        },
        symbols: [
          { sym: "quantization", desc: "converting 32-bit float weights to 8-bit integers (int8) to shrink and speed the model on edge hardware." },
          { sym: "edge / on-device", desc: "running inference on the camera itself rather than sending video to a server." },
          { sym: "canary", desc: "a small staged rollout (here 5 stores) used to detect problems before fleet-wide promotion." }
        ],
        steps: [
          { type: "decide", prompt: "How should the detector run in stores?",
            options: [
              { label: "Quantize the model and run it on-device per camera, rolling out to a few stores first", best: true, feedback: "this minimizes both cost and risk. Quantizing to int8 lets the model run on the camera's modest chip, so no video ever leaves the store — bandwidth stays near zero and latency stays low. A staged canary means a bad build affects 5 stores, not 400, and you get 48h of real-world evidence (fps, crashes, mAP) before promoting. Cheap trade-off, contained blast radius: that's a responsible edge deployment." },
              { label: "Stream every camera's full video to a central GPU cluster", feedback: "this inverts the cost/risk profile. Continuously uplinking full video from hundreds of cameras is enormous, ongoing bandwidth and cloud cost, and it makes the central cluster a single point of failure — if it or the network hiccups, every store goes blind at once. On-device inference avoids all of that, which is exactly why edge deployment exists." }
            ] },
          { type: "run", label: "▶ Quantize & canary 5 stores", result: { log: "quantizing to int8...\nmAP@0.5 after quantization: 0.694 (-0.007, acceptable)\ncanary 5 stores: 27 fps, 0 crashes over 48h\npromoting to 40 stores...\nlive.", metrics: [{ k: "mAP after int8", v: "0.694" }, { k: "stores live", v: "40" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps, Machine Learning Operations)",
        narrative: `<p>A model is never "done" — stores re-light displays, repackage products, and add new SKUs, and each change shifts the input distribution the detector was trained on. Because you usually lack live ground-truth labels, you monitor <i>proxies</i>: detection counts per shelf (inputs), the confidence distribution (outputs), fps (health), and spot-audited precision from staff checks (outcomes). When a proxy moves beyond its normal band, you alert and investigate — that closed loop is MLOps.</p>`,
        concepts: ["prob-clt", "mlx-error-analysis", "ml-classification-metrics"],
        insight: `<b>Drift is silent without monitors.</b> This week store #19's average detections/shelf fell <b>31%</b> after a lighting retrofit, and mean confidence drifted <b>−0.05 on 4 repackaged SKUs</b> — both are real accuracy losses with zero error message. You catch them statistically: a $31\\%$ shift is many standard deviations beyond the day-to-day noise band, so it trips an alert. No new labels were needed to detect the problem, only to fix it — which sends you back to the Data stage.`,
        data: {
          caption: "This week's production monitors (proxy signals, no live labels)",
          columns: ["signal", "type", "reading", "alert?"],
          rows: [
            ["detections/shelf, store #19", "input drift", "−31%", "yes ⚠"],
            ["mean confidence, 4 SKUs", "output drift", "−0.05", "yes ⚠"],
            ["fps (fleet avg)", "health", "26", "no"],
            ["audited precision (staff)", "outcome", "stable", "no"]
          ],
          note: `Alert bands come from each metric's normal variance: a move beyond ~3σ of the recent baseline is unlikely by chance (CLT, Central Limit Theorem), so it signals a real shift, not noise.`
        },
        symbols: [
          { sym: "drift", desc: "a change in the live input or output distribution away from what the model trained on; degrades accuracy silently." },
          { sym: "proxy signal", desc: "a monitorable quantity (detection count, confidence) used to infer model health when ground-truth labels aren't available live." },
          { sym: "σ (sigma)", desc: "standard deviation of a metric's normal day-to-day variation; alerts fire when a reading is several σ off baseline." }
        ],
        steps: [
          { type: "decide", prompt: "What should you watch in production?",
            options: [
              { label: "Detection-count drift per shelf, confidence distribution, latency/fps, and spot-audited precision from staff checks", best: true, feedback: "this covers all four layers of model health: inputs (detection counts reveal scene/lighting drift), outputs (confidence shifts flag repackaged or new SKUs), health (fps confirms the edge box keeps up), and outcomes (staff audits give you real precision without full labeling). Alerting on movement in any layer is what turns 'silent decay' into an actionable signal — that's the MLOps loop." },
              { label: "Nothing — it passed evaluation in the lab", feedback: "lab evaluation is a snapshot of a world that immediately starts changing — new packaging alone can tank a class's recall, and a lighting retrofit just dropped store #19 by 31%. With no monitoring those losses are invisible until a store manager complains, by which point the detector has been wrong for weeks. A deployed model without monitoring is a model you've stopped being responsible for." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "store #19: avg detections/shelf dropped 31% (new shelf lighting installed)\nconfidence mean drifted -0.05 on 4 SKUs (repackaged)\nfps healthy: 26 avg\naction: collect fresh frames from changed stores, re-annotate, retrain", metrics: [{ k: "drifted SKUs", v: "4 ⚠" }, { k: "store #19", v: "-31%" }], chart: { type: "bars", title: "Avg detections/shelf, store #19 (lighting retrofit)", labels: ["baseline", "this week"], values: [100, 69], valueLabels: ["100%", "69% (-31%)"], colors: ["#4ea1ff", "#ff7b72"] } }, note: `Monitoring caught new packaging and lighting drift, which triggers fresh labels and a retrain — back to the <b>Data</b> stage. That loop is the job.` }
        ]
      }
    ]
  },

  "medical-diagnosis": {
    title: "Medical Diagnosis & Imaging",
    icon: "🩺",
    goal: "Help radiologists flag pneumonia on chest X-rays — catching real disease without alarming healthy patients, and safe enough to deserve trust.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>This is the chest-X-ray classification task benchmarked by <b>CheXpert</b> (Stanford: 224,316 X-rays from 65,240 patients, labeled for 14 findings) and <b>NIH (National Institutes of Health) ChestX-ray14</b> (112,120 frontal images, 30,805 patients, the same 14 findings). Pneumonia is one of those 14 findings and is <b>rare</b> — it appears as a positive label in only ~$4\\%$ of scans — and the two errors are not symmetric: a <b>missed case (false negative)</b> can harm a patient, while a <b>false alarm (false positive)</b> wastes a scan and frightens someone healthy. Under this imbalance, plain accuracy is a trap — you must decide which error you most need to avoid before choosing a metric. The framing also sets the role: a decision-support flag for a radiologist, not an autonomous diagnosis.</p>`,
        concepts: ["ml-classification-metrics", "prob-bayes"],
        insight: `<b>Accuracy is useless here.</b> Only <b>1 in ~24 chest X-rays is positive</b> (4.1%), so a model that blindly says "healthy" every time is <b>95.9% accurate and catches zero disease</b>. That's why you track <b>sensitivity</b> (of truly sick patients, how many did we flag?) instead — in screening, a false negative can cost a life while a false positive costs a second look. The objective is high sensitivity at a tolerable specificity, with a clinician kept in the loop.`,
        data: {
          caption: "Why accuracy lies (confusion of an 'always healthy' model)",
          columns: ["truth \\ predicted", "say healthy", "say sick", "total"],
          rows: [
            ["truly healthy", "58,690 ✓", "0", "58,690"],
            ["truly sick", "2,510 ✗ (missed!)", "0", "2,510"],
            ["accuracy", "95.9%", "sensitivity 0%", "61,200"]
          ],
          note: `Accuracy = correct / total = 58,690 / 61,200 = 95.9%, yet every one of the 2,510 sick patients is missed. Sensitivity = true positives / all positives = 0/2,510 = 0%. The right metric exposes the failure.`
        },
        chart: { type: "confusion", title: "'Always healthy' model: 95.9% accurate, 0% sensitivity", labels: ["healthy", "sick"], matrix: [[58690, 0], [2510, 0]] },
        symbols: [
          { sym: "sensitivity (recall)", desc: "$\\dfrac{TP}{TP+FN}$ — of truly sick patients, the fraction the model flags; the metric that matters in screening." },
          { sym: "specificity", desc: "$\\dfrac{TN}{TN+FP}$ — of truly healthy patients, the fraction correctly cleared; controls false-alarm rate." },
          { sym: "FN / FP", desc: "false negative (missed disease, the dangerous error) / false positive (false alarm, the costly-but-safer error)." },
          { sym: "prevalence", desc: "fraction of the population that is positive (~$4\\%$ here); why accuracy and PPV (Positive Predictive Value) are so easily fooled." }
        ],
        steps: [{
          type: "decide", prompt: "Which objective fits a rare, high-stakes diagnosis?",
          options: [
            { label: "Maximize accuracy", feedback: "accuracy collapses under 24:1 imbalance. A model that labels everyone healthy scores 95.9% — higher than most real models — while catching exactly zero of the 2,510 sick patients. Optimizing accuracy actively rewards ignoring the rare class, which is the one class you built the system to find. The metric has to reflect the asymmetric cost of a miss, and accuracy doesn't." },
            { label: "Target high sensitivity (catch sick patients) at an acceptable specificity, as a decision-support flag — not an autonomous diagnosis", best: true, feedback: "exactly right. In screening the costly error is the false negative — a missed pneumonia — so you hold sensitivity high and accept some false alarms, choosing an operating point that trades specificity for catch-rate. Framing it as a decision-support flag (radiologist reviews every alert) also keeps an accountable human in the loop, which is both safer and what regulators require. The metric, the threshold, and the deployment role all follow from this framing." },
            { label: "Minimize mean-squared error on the pixels", feedback: "MSE on pixels is an image-reconstruction objective — it measures how well you can redraw the X-ray, which has nothing to do with whether the patient has pneumonia. You could drive pixel error to zero and still have no diagnostic signal. This optimizes a quantity unrelated to the clinical question entirely." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labeled scans",
        narrative: `<p>You collect X-rays from several hospitals to get patient and scanner diversity — the way <b>MIMIC-CXR</b> (377,110 images + free-text reports from Beth Israel) and CheXpert/NIH were each assembled at a single institution. The label source is the catch: CheXpert and MIMIC-CXR derive their 14-finding labels by running an <b>automated NLP (Natural Language Processing) labeler over the radiology report text</b>, which introduces real label noise (including explicit "uncertain" labels), whereas the cleanest possible ground truth is a confirmed radiologist read checked against outcome. Each scanner vendor also stamps its own brightness and burned-in markers. Where labels come from and how the sites differ will decide both your label noise and the shortcuts your model can later exploit.</p>`,
        concepts: ["ml-supervised", "dl-data-augmentation"],
        insight: `<b>The label source is the silent risk.</b> Your pull is <b>61,200 scans, 2,510 pneumonia-positive (4.1%)</b> across <b>5 hospitals and 3 scanner vendors</b> — and hospital E uses a brighter exposure protocol. This mirrors the public sets: CheXpert/MIMIC-CXR labels come from report-text NLP (noisy), while a confirmed-outcome radiologist read is the gold standard. Keyword-scraped report text is noisy and inconsistent across sites; ward location isn't a diagnosis at all. Choosing the wrong label source means you train on label noise, and the model's ceiling is set by how clean these 2,510 positives are.`,
        data: {
          caption: "Multi-hospital pull (CheXpert/MIMIC-style scan records)",
          columns: ["scan_id", "hospital", "vendor", "label source", "Pneumonia"],
          rows: [
            ["p10001", "A", "Siemens", "radiologist + outcome", "negative"],
            ["p10002", "E", "GE (bright)", "radiologist + outcome", "positive"],
            ["p10003", "C", "Philips", "report-NLP (uncertain)", "−1 (uncertain)"],
            ["… 61,200 rows", "A–E", "3 vendors", "mixed", "4.1% pos"]
          ],
          note: `Schema follows CheXpert/MIMIC-CXR: each scan carries the 14 findings as $\\{1=\\text{positive}, 0=\\text{negative}, -1=\\text{uncertain}, \\text{blank}\\}$; here we show the Pneumonia column. Vendor and hospital columns look harmless now but become the leakage suspects in the next stage.`
        },
        symbols: [
          { sym: "label source", desc: "how the ground-truth diagnosis was established (confirmed radiologist read vs scraped text vs ward); sets label noise." },
          { sym: "positive rate", desc: "fraction of scans that are disease-positive (4.1%); the class prior the model must overcome." },
          { sym: "scanner vendor", desc: "the device maker; different vendors produce systematically different brightness/contrast — a confound for the model." }
        ],
        steps: [
          { type: "decide", prompt: "How do you label disease status?",
            options: [
              { label: "Use radiologist reports confirmed against follow-up outcomes, with multiple readers on hard cases", best: true, feedback: "this gives the cleanest possible ground truth: an expert read tells you what the image shows, follow-up outcome confirms it was right, and multi-reader consensus resolves the genuinely ambiguous cases where doctors disagree. Since the model can never be more accurate than its labels, paying for confirmed multi-reader labels on the 2,510 positives directly raises the achievable ceiling. It's the expensive option that's worth it." },
              { label: "Use whatever keyword appears in the free-text report", feedback: "report phrasing is wildly inconsistent — 'possible infiltrate', 'cannot exclude pneumonia', negations like 'no pneumonia' — and it varies by hospital and by radiologist. Keyword-scraping that text produces systematic label noise (a negated mention flips your label), and you'd train the model to predict report-writing style as much as disease. Cheap to extract, but it poisons the targets." },
              { label: "Assume any scan from the pulmonology ward is positive", feedback: "ward location is not a diagnosis. Plenty of pulmonology patients have asthma, COPD, or are there for unrelated reasons and have perfectly clear lungs, so this rule mislabels a large fraction of negatives as positive. You'd be training on the hospital's routing logic, not on radiographic disease — guaranteed label corruption." }
            ] },
          { type: "run", label: "▶ Pull multi-hospital scans", prompt: "Pull labeled X-rays across 5 hospitals.",
            result: { log: "loaded 61,200 chest X-rays from 5 hospitals (CheXpert/MIMIC-style schema)\nlabels: 14 findings per scan {1, 0, -1 uncertain, blank}\npneumonia positives: 2,510  (4.1%)\nscanner vendors: 3 distinct\nhospital E uses a different exposure protocol (brighter images)", metrics: [{ k: "scans", v: "61.2k" }, { k: "positive rate", v: "4.1%" }, { k: "hospitals", v: "5" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & spot leakage",
        narrative: `<p>Medical datasets are full of <b>shortcuts</b>: features that correlate with the label in <i>this</i> dataset but aren't the disease. This is documented for exactly these benchmarks — Zech et al. (2018) showed a pneumonia CNN (Convolutional Neural Network) trained on NIH + Mount Sinai data had learned to read <b>hospital-specific markers and scanner traits</b> rather than the lung, and its accuracy <b>dropped sharply on external hospitals</b>. The classic trap is that the sickest patients cluster at one referral hospital, so the model learns "this scanner's brightness = sick." Exploration's job is to find these spurious correlations now — burned-in markers, per-vendor brightness, site skew — because a shortcut that helps on your split will collapse on a new hospital.</p>`,
        concepts: ["mlx-error-analysis", "prob-variance"],
        insight: `<b>71% of positives come from one site.</b> Hospital E (a referral center with a brighter exposure protocol) supplies <b>71% of all 2,510 positives</b>, so "is this an E-looking scan?" predicts the label almost as well as reading the lung — a shortcut. The model would happily learn that proxy, score great on a random split, then <b>collapse at every hospital that isn't E</b>. The fix: strip burned-in text markers, normalize brightness per vendor, and validate per-hospital so a scanner signature can't masquerade as diagnostic skill.`,
        data: {
          caption: "Leakage suspects found in exploration",
          columns: ["signal", "correlation w/ label", "why it's a shortcut"],
          rows: [
            ["hospital E origin", "71% of positives", "site, not disease, predicts label"],
            ["image brightness", "differs by vendor", "model can read the scanner"],
            ["burned-in text marker", "correlated w/ positive", "an artifact, not anatomy"],
            ["class balance", "23.4:1 neg:pos", "rare class easy to ignore"]
          ],
          note: `A shortcut (spurious correlation) is a feature correlated with the label in-sample that has no causal link to disease. It inflates your training/validation score and then fails out-of-distribution.`
        },
        chart: { type: "bars", title: "Class imbalance (23:1 neg:pos) and site skew", labels: ["healthy", "pneumonia", "positives from hosp E", "positives elsewhere"], values: [58690, 2510, 1782, 728], colors: ["#4ea1ff", "#ff7b72", "#ffb454", "#c89bff"] },
        symbols: [
          { sym: "shortcut / leakage", desc: "a non-causal feature (scanner brightness, a marker) that predicts the label in this data but won't transfer." },
          { sym: "spurious correlation", desc: "a statistical association without a causal link — here site ↔ disease, an artifact of how data was collected." },
          { sym: "23.4:1", desc: "negative-to-positive ratio; the heavy imbalance that lets a lazy model default to 'healthy'." }
        ],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "class balance: 23.4:1 (neg:pos)\nhospital E: 71% of all positives come from this one site\nfound burned-in text marker correlated with label\nimage brightness differs by hospital (vendor protocol)", metrics: [{ k: "imbalance", v: "23:1" }, { k: "site skew", v: "hospital E" }] } },
          { type: "decide", prompt: "Most positives come from hospital E, whose scans look different. What's the risk?",
            options: [
              { label: "None — more positives from anywhere is good", feedback: "this misses the leakage. When 71% of positives carry hospital E's distinctive brightness and markers, the cheapest thing for the model to learn is 'E-looking scan = sick' — a proxy that has nothing to do with the lung. It will score beautifully on a random split (because E scans are sick scans there too) and then collapse at every other hospital, where the brightness cue no longer tracks disease. More positives concentrated at one site is a confound, not a free win." },
              { label: "The model may learn the hospital/scanner signature as a proxy for disease — a shortcut that won't transfer", best: true, feedback: "exactly — this is textbook spurious correlation. Because site E both supplies most positives and looks visually distinct, the scanner signature is a high-accuracy shortcut to the label that bypasses radiology entirely. The defenses all attack the shortcut directly: strip burned-in markers (remove the artifact), normalize brightness per vendor (erase the scanner cue), and validate per-hospital (so the score can't hide behind E). That forces the model to earn its accuracy from the lung." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Augment & normalize",
        narrative: `<p>This stage does double duty. <b>Augmentation</b> (small rotations, shifts, mild contrast jitter) expands the scarce positive class so the model sees more variety, while <b>normalization</b> (per-vendor intensity scaling, stripping burned-in markers) erases the scanner shortcut you found in exploration. The two work together: you grow the data <i>and</i> remove the spurious cue, but every transform must keep the anatomy realistic — a chest X-ray is grayscale, so color tricks add noise, not signal.</p>`,
        concepts: ["dl-data-augmentation", "dl-conv", "ml-regularization"],
        insight: `<b>Per-vendor normalization is the anti-shortcut.</b> Three vendors produce systematically different brightness; normalizing intensity <i>per vendor</i> maps them onto a common scale, so the model can no longer read "which scanner" off the pixels. Combine that with stripping the burned-in text marker (it correlated with the label) and mild, anatomy-preserving augmentation, and you simultaneously fight the <b>23:1 imbalance</b> and the leakage. Aggressive color shifts would be pure noise — X-rays have no color to shift.`,
        data: {
          caption: "Preprocessing policy (fix imbalance AND leakage)",
          columns: ["operation", "purpose", "keeps anatomy real?"],
          rows: [
            ["per-vendor intensity normalize", "kill scanner-brightness shortcut", "yes"],
            ["strip burned-in markers", "remove artifact correlated w/ label", "yes"],
            ["small rotation/shift, mild contrast", "augment scarce positives", "yes"],
            ["aggressive color shift", "(rejected) X-rays are grayscale", "no"],
            ["box label smoothing", "(rejected) no boxes in this task", "n/a"]
          ],
          note: `Normalization removes a confound (vendor brightness); augmentation enlarges the effective positive set. Both are regularizers — they discourage the model from latching onto site-specific quirks.`
        },
        symbols: [
          { sym: "normalization", desc: "rescaling pixel intensities (here per scanner vendor) onto a common range to remove device-specific brightness." },
          { sym: "augmentation", desc: "label-preserving transforms (rotate/shift/contrast) that synthesize extra training variety from scarce positives." },
          { sym: "regularization", desc: "anything that discourages memorizing dataset-specific quirks; normalization + augmentation act this way here." }
        ],
        steps: [{
          type: "decide", prompt: "Which preprocessing fits chest X-rays?",
          options: [
            { label: "Normalize intensity per vendor, small rotations/shifts, mild contrast jitter — and strip burned-in markers", best: true, feedback: "this is the package that addresses both problems at once. Per-vendor normalization collapses the three scanners' brightness onto one scale, directly removing the leakage cue; stripping markers deletes the artifact that correlated with the label; and gentle rotation/shift/contrast augments the rare positives without distorting anatomy. Every operation is justified by something exploration found — that's preprocessing as a deliberate fix, not a default recipe." },
            { label: "Aggressive color shifts and random label smoothing of the boxes", feedback: "two mismatches with the task. Chest X-rays are single-channel grayscale, so 'color shifts' invent variation that doesn't exist in the input — pure noise that can only hurt. And there are no bounding boxes in this classification problem, so 'box label smoothing' refers to objects that aren't here. This recipe was copied from a detection pipeline and doesn't fit." },
            { label: "No normalization — let the model handle vendor differences", feedback: "this leaves the door open to exactly the shortcut you just diagnosed. Without normalization the vendor-specific brightness is still in the pixels, and since site E's bright scans carry most positives, the model will key on brightness as a label proxy. 'Let the model handle it' here means 'let the model cheat' — and then fail at the next hospital." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model & handle imbalance",
        narrative: `<p>Three requirements drive the choice: the input is an image (so you need a model that reads spatial pattern), positives are rare (so the loss must not let the model ignore them), and clinicians need <i>calibrated probabilities</i> (a "0.8" must mean ~80% risk). A CNN handles the image; a <b>class-weighted loss</b> fights the $23{:}1$ imbalance by penalizing missed positives more; and a calibration step turns raw scores into trustworthy probabilities.</p>`,
        concepts: ["dl-conv", "ml-logistic-regression", "ml-classification-metrics"],
        insight: `<b>Class weighting is what stops 'always healthy'.</b> At 23:1, an un-weighted loss is minimized by mostly predicting the majority class — high accuracy, near-zero sensitivity. Weighting the positive class by ~$23\\times$ makes a missed sick patient cost as much as 23 false alarms, which forces the gradient to actually attend to disease. A CNN supplies the spatial reasoning radiographs require; Naive Bayes can't, because its independence assumption is destroyed by the heavy correlations between neighboring pixels.`,
        data: {
          caption: "Model + imbalance strategy trade-offs",
          columns: ["choice", "reads image pattern?", "handles 23:1?", "calibrated?"],
          rows: [
            ["CNN + class-weighted loss + calibrate", "yes", "yes (weights)", "yes (temp scaling)"],
            ["CNN, raw imbalance, no reweight", "yes", "no → ~0 sensitivity", "no"],
            ["Naive Bayes on raw pixels", "no (indep. assumption)", "no", "no"]
          ],
          note: `Class weight ≈ N_neg / N_pos ≈ 23, so each positive contributes ~23× the loss of a negative. Calibration (temperature scaling) rescales logits so predicted probabilities match observed frequencies.`
        },
        symbols: [
          { sym: "class-weighted loss", desc: "scaling the loss so the rare positive class counts ~23× more, preventing the model from defaulting to 'healthy'." },
          { sym: "calibration", desc: "post-hoc rescaling so a predicted probability $p$ matches the true positive frequency among cases scored $p$." },
          { sym: "CNN", desc: "convolutional network; its filters read local spatial patterns (opacities, consolidations) that pixel-independence models can't." }
        ],
        steps: [{
          type: "decide", prompt: "Choose the model and imbalance strategy.",
          options: [
            { label: "A CNN with class-weighted loss, then calibrate its probabilities", best: true, feedback: "this lines up with all three requirements. The CNN's convolutional filters read the local opacities and consolidations that signal pneumonia — spatial structure a flat model can't see. The class-weighted loss makes each of the 2,510 positives count ~23× so the optimizer can't win by ignoring them, restoring sensitivity. And calibration makes the output a probability a radiologist can act on, where 0.8 genuinely means ~80% risk. Image-reader + imbalance-fix + trustworthy output, in one pipeline." },
            { label: "A CNN trained on the raw imbalance with no reweighting", feedback: "the architecture is right but the loss is wrong. With 23 negatives per positive, the cross-entropy is minimized by predicting 'healthy' nearly always — you'd see ~96% accuracy and a sensitivity near zero, the exact failure from the Frame stage. The CNN can see disease, but an un-weighted loss gives it no incentive to, because missing the rare class is statistically cheap. You must reweight." },
            { label: "Naive Bayes on raw pixels", feedback: "Naive Bayes assumes features are conditionally independent given the class, but neighboring X-ray pixels are massively correlated — a bright pixel almost guarantees its neighbors are bright. That assumption is so badly violated that the model can't represent radiographic patterns (an opacity is a spatial arrangement, not independent pixels). It's the wrong model family for image data entirely." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train & calibrate",
        narrative: `<p>You train the class-weighted CNN with regularization and watch a screening-relevant metric: <b>sensitivity at 90% specificity</b> (catch-rate when false alarms are held to 10%), not raw accuracy. But a model can rank cases well (high AUC, Area Under the Curve) yet still be <i>over-confident</i> — and a confident-but-wrong probability is dangerous in medicine. So after training you <b>calibrate</b> with temperature scaling so a "0.8" really means ~80% risk, measured by Expected Calibration Error (ECE).</p><p>ECE is computed concretely: sort validation predictions into bins by confidence (say 10 bins of width $0.1$); in each bin compute the <i>mean confidence</i> and the <i>actual fraction positive</i> (accuracy); ECE is the sample-weighted average gap $\\sum_b \\frac{n_b}{N}\\,|\\text{acc}_b - \\text{conf}_b|$. To fix it, <b>temperature scaling</b> fits one scalar $T$ by minimizing validation loss over $T$, then divides every logit by it ($z\\to z/T$, $T&gt;1$ softens over-confidence) — a one-parameter post-hoc rescale that leaves the ranking, and thus AUC, untouched.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "ml-classification-metrics"],
        insight: `<b>Good ranking ≠ honest probabilities.</b> Training reaches <b>val AUC 0.941</b> and sensitivity@90%-spec <b>0.86</b> — strong discrimination. But raw <b>ECE is 0.142</b>, meaning predicted probabilities are off by ~14 points on average (the model says 0.9 when the real risk is ~0.76). Temperature scaling — dividing the logits by one learned constant $T$ — pulls <b>ECE down to 0.038</b> without changing the ranking or AUC. In a tool a clinician trusts to gauge risk, that calibration step is not optional.`,
        data: {
          caption: "Training + calibration progression",
          columns: ["stage", "val AUC", "sens@90%spec", "ECE"],
          rows: [
            ["epoch 12", "0.918", "0.79", "—"],
            ["epoch 24 (early stop)", "0.941", "0.86", "0.142"],
            ["after temperature scaling", "0.941", "0.86", "0.038 ✓"]
          ],
          note: `ECE = $\\sum_b (n_b/N)\\,|\\text{acc}_b-\\text{conf}_b|$ over confidence bins. Temperature scaling fits one $T$ on validation and rescales logits $z \\to z/T$. It leaves the ranking — and thus AUC and sensitivity — unchanged while making probabilities honest, so ECE drops but the discrimination metrics don't move.`
        },
        symbols: [
          { sym: "AUC", desc: "Area Under the ROC (Receiver Operating Characteristic) curve: probability the model ranks a random positive above a random negative; pure discrimination, ignores calibration." },
          { sym: "sensitivity@90%spec", desc: "the catch-rate (sensitivity) achieved when the threshold is set so specificity is 90% — a screening operating point." },
          { sym: "ECE", desc: "Expected Calibration Error $=\\sum_b \\frac{n_b}{N}|\\text{acc}_b-\\text{conf}_b|$: bin predictions by confidence, average the gap between bin accuracy and bin confidence; 0 is perfectly calibrated." },
          { sym: "$T$ (temperature)", desc: "the single scalar in temperature scaling, fit on validation by minimizing loss; logits are divided by $T$ ($T&gt;1$ softens over-confident probabilities) without changing their order." }
        ],
        steps: [{
          type: "run", label: "▶ Train CNN (class-weighted) + calibrate",
          result: { log: "training class-weighted CNN...\nepoch 12  val AUC 0.918  sensitivity@90%spec 0.79\nepoch 24  val AUC 0.941  sensitivity@90%spec 0.86  (early stop)\ncalibrating (temperature scaling)...\nECE pre = sum_b (n_b/N)|acc_b-conf_b| over 10 bins = 0.142\n  e.g. bin[0.9-1.0]: mean conf 0.93, actual positive frac 0.76 -> gap 0.17\nfit T on validation -> T=1.7; logits z -> z/1.7\nECE post = 0.038  (AUC unchanged at 0.941)", metrics: [{ k: "val AUC", v: "0.941" }, { k: "ECE", v: "0.038" }], chart: { type: "roc", title: "Validation ROC (AUC 0.941), operating point at 90% specificity", auc: 0.941, points: [[0, 0], [0.02, 0.42], [0.05, 0.71], [0.10, 0.86], [0.20, 0.93], [0.40, 0.97], [0.70, 0.99], [1, 1]] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate per hospital",
        narrative: `<p>You ship an <i>operating point</i> (a threshold), not an AUC, so you report sensitivity and specificity at the chosen threshold $t^*$ — and you report them <b>per hospital</b>, because an average can pass while one site quietly fails. You also compute PPV at the real $4\\%$ prevalence: even an excellent model produces many false alarms when disease is rare, and clinicians need to know that. The per-site slice is what catches distribution shift before it reaches a patient.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "prob-bayes"],
        insight: `<b>One unseen hospital breaks the average.</b> Sensitivity is a tight $0.89$–$0.92$ across the four training-distribution hospitals, but at <b>new hospital F (unseen scanner) it collapses to 0.71</b> — a 20-point drop hidden inside a healthy-looking overall 0.91. Separately, even at $0.91$ sensitivity / $0.88$ specificity, <b>PPV is only 0.24 at 4% prevalence</b> (Bayes: most positives are false alarms because healthy patients vastly outnumber sick ones). Both numbers argue for gating deployment per site.`,
        data: {
          caption: "Per-hospital sensitivity at threshold $t^*$",
          columns: ["hospital", "in training distribution?", "sensitivity", "status"],
          rows: [
            ["A / B / C / D", "yes", "0.92 / 0.90 / 0.91 / 0.89", "ok"],
            ["F (new scanner)", "no", "0.71", "ALERT ⚠"],
            ["overall avg", "—", "0.91", "masks F"],
            ["PPV @ 4% prevalence", "—", "0.24", "many false alarms"]
          ],
          note: `PPV = P(disease | positive). By Bayes, with 4% prevalence even sens 0.91 / spec 0.88 gives PPV ≈ (0.91·0.04)/(0.91·0.04 + 0.12·0.96) ≈ 0.24 — most flags are false, which is fine for a review tool but must be communicated.`
        },
        symbols: [
          { sym: "$t^*$", desc: "the chosen decision threshold; scores above $t^*$ are flagged positive. You ship a threshold, not a curve." },
          { sym: "PPV", desc: "Positive Predictive Value $= P(\\text{disease}\\mid\\text{flagged})$; low under rare disease no matter how good the model." },
          { sym: "distribution shift", desc: "test data (hospital F's scanner) drawn from a different distribution than training, so metrics don't transfer." },
          { sym: "prevalence", desc: "base rate of disease (4%); via Bayes it drives PPV down even at high sensitivity/specificity." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate on held-out hospitals", result: { log: "overall @ threshold t*: sensitivity 0.91, specificity 0.88\nper-hospital sensitivity: A 0.92, B 0.90, C 0.91, D 0.89\nhospital F (NEW, unseen scanner): sensitivity 0.71  ALERT\npositive predictive value at 4% prevalence: 0.24", metrics: [{ k: "sensitivity", v: "0.91" }, { k: "specificity", v: "0.88" }, { k: "hosp F sens", v: "0.71 ⚠" }], chart: { type: "bars", title: "Sensitivity per hospital (F is unseen, breaks the average)", labels: ["A", "B", "C", "D", "F (new)"], values: [0.92, 0.90, 0.91, 0.89, 0.71], colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ff7b72"] } } },
          { type: "decide", prompt: "Sensitivity is 0.91 everywhere except 0.71 at unseen hospital F. What now?",
            options: [
              { label: "Distribution shift — don't deploy to F until it's validated/recalibrated on F's data", best: true, feedback: "right — F's scanner was never in training, so it's out-of-distribution and your 0.91 simply doesn't apply there; the measured 0.71 is the real number, and a 20-point sensitivity gap means missed pneumonias. The safe and regulatory-minded move is to gate deployment per site: don't enable F until you've collected and validated on F's own data. Per-hospital evaluation exists precisely so this gap is caught here, not in production." },
              { label: "Ship to F anyway — the overall number is great", feedback: "the overall 0.91 is an average dominated by the four in-distribution hospitals; it's actively hiding F's 0.71. Deploying to F on the strength of that average would put a model into clinical use at a site where it misses nearly 3 in 10 cases — exactly the harm the evaluation just surfaced. An aggregate metric is never a license to deploy to a site that underperforms within it." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Hospital F lags because its scanner protocol is unlike anything in training — this is a <b>data-coverage gap</b>, not a model-capacity gap. Diagnosing which kind of failure you have decides the fix: a coverage gap is closed by adding the missing distribution, while capacity or threshold changes address problems you don't have. The tempting global knobs (raise threshold, deepen network) either hurt the healthy sites or can't help at all.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "mlx-cross-validation"],
        insight: `<b>Missing distribution, not missing capacity.</b> The model already hits $0.89$–$0.92$ on four hospitals, so it has plenty of capacity — it just never saw F's scanner. The fix is to <b>collect and label F's scans, add them to training, and re-validate per hospital</b>. Contrast the wrong knobs: raising the global threshold <i>lowers</i> sensitivity everywhere (the opposite of F's need) and harms A–D; making the network deeper adds capacity to learn a distribution that still isn't in the training set, so F stays broken.`,
        data: {
          caption: "Matching the fix to the failure type",
          columns: ["candidate fix", "failure it addresses", "effect on F / on A–D"],
          rows: [
            ["add F's labeled scans + per-site CV", "data coverage gap (correct)", "F ↑ / A–D safe"],
            ["raise global threshold", "(nothing here)", "F ↓ / A–D ↓ sensitivity"],
            ["deepen network", "capacity gap (not the issue)", "F ≈ unchanged"]
          ],
          note: `Per-hospital cross-validation = leave-one-hospital-out, so you measure generalization to an unseen site explicitly. The cause was diagnosed as coverage, so the fix is data, not architecture or thresholds.`
        },
        symbols: [
          { sym: "data-coverage gap", desc: "the failure type here: the model lacks training examples from a region (F's scanner), so no amount of capacity helps." },
          { sym: "capacity", desc: "the model's ability to fit complex patterns; ample here, which rules out 'make it deeper' as the fix." },
          { sym: "per-hospital CV", desc: "leave-one-site-out cross-validation that estimates performance on a hospital the model never trained on." }
        ],
        steps: [{
          type: "decide", prompt: "How do you close the gap at hospital F?",
          options: [
            { label: "Collect and label F's scans, add them to training, and re-validate with per-hospital cross-validation", best: true, feedback: "this matches the diagnosis exactly. The model performs well on four hospitals, so it isn't short on capacity — it simply has zero examples from F's scanner protocol, a pure coverage gap. Adding labeled F scans puts that distribution into training, and leave-one-hospital-out cross-validation confirms the fix generalizes to held-out sites rather than just memorizing F. Fix the data gap with data." },
            { label: "Increase the decision threshold globally", feedback: "this moves the wrong direction. Raising the threshold makes the model more conservative about calling 'sick', which lowers sensitivity — but F's problem is that sensitivity is already too low (0.71). You'd push F further down while also dragging A–D's sensitivity below their current 0.89–0.92. A global knob can't fix a site-specific coverage gap, and here it harms every site." },
            { label: "Make the network much deeper", feedback: "more parameters let a model fit more complex patterns, but the bottleneck isn't pattern complexity — it's that F's distribution was never in the training data. A deeper network has nothing new to learn from about F, so its F sensitivity stays roughly where it is while you've added compute cost and overfitting risk. Capacity can't substitute for missing data." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy as decision support",
        narrative: `<p>This is regulated, high-stakes software: it <i>assists</i> a radiologist, it does not replace one. Deployment must reflect that with a human in the loop, an audit log of every prediction, and a documented operating point so the behavior is traceable and reversible. You also go live the careful way — <b>shadow mode</b> first (the model runs silently alongside radiologists so you can compare before it influences anyone), then assistive mode, and only at the four validated sites (F stays excluded pending its data).</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc"],
        insight: `<b>Shadow mode earns trust before the model acts.</b> Running silently for two weeks shows <b>93% agreement with radiologists</b> and, tellingly, the model <b>flagged 14 cases the radiologists initially overlooked, later confirmed positive</b> — evidence it adds value, gathered with zero patient risk because no decision depended on it yet. Deploying as a reviewable flag with an audit log keeps an accountable expert in the loop and every prediction traceable, which is both safer and what a regulator will approve.`,
        data: {
          caption: "Staged clinical rollout",
          columns: ["stage", "model influences care?", "what it proves"],
          rows: [
            ["shadow (2 weeks)", "no (silent)", "93% agreement; caught 14 missed cases"],
            ["assistive flag + audit log", "yes (radiologist reviews)", "human-in-loop, traceable"],
            ["sites A–D", "yes", "validated distributions only"],
            ["site F", "excluded", "pending coverage data"]
          ],
          note: `Shadow mode = predictions logged but not shown, so you measure real agreement without any patient risk. The audit log records every score and threshold for accountability and incident review.`
        },
        symbols: [
          { sym: "shadow mode", desc: "the model runs and logs predictions but doesn't affect care, so you can validate it live with no risk." },
          { sym: "human-in-the-loop", desc: "a radiologist reviews every flag; the model recommends, the clinician decides and stays accountable." },
          { sym: "operating point", desc: "the documented threshold + expected sensitivity/specificity the deployment runs at; fixed and recorded for traceability." }
        ],
        steps: [
          { type: "decide", prompt: "How should the model be deployed?",
            options: [
              { label: "As a flag that surfaces suspected cases for radiologist review, with an audit log and a documented operating point", best: true, feedback: "this is the responsible and approvable design. A flag that a radiologist reviews keeps an accountable human making the final call, so a model error has a human safety net rather than reaching the patient directly. The audit log makes every prediction traceable for incident review and regulators, and a documented operating point means the system's behavior is fixed and known. Human-in-the-loop, traceable, reversible — exactly the bar for clinical ML." },
              { label: "As an autonomous system that finalizes diagnoses with no clinician review", feedback: "this is unsafe and not approvable. Removing the radiologist removes the accountable expert and the safety net — a false negative would finalize as 'healthy' with no human to catch it, and there's no recourse path when the model is wrong. PPV is only 0.24 and sensitivity already varies by site, so the model is nowhere near reliable enough to act alone, and regulators won't sanction autonomous diagnosis. Medicine keeps a human in the loop." }
            ] },
          { type: "run", label: "▶ Roll out to 4 validated hospitals", result: { log: "deploying decision-support flag (hospitals A-D, F excluded pending data)...\nshadow mode 2 weeks: agreement with radiologists 93%\nflagged 14 cases radiologists initially overlooked (later confirmed)\nenabling assistive mode with audit logging...\nlive at 4 sites.", metrics: [{ k: "shadow agreement", v: "93%" }, { k: "sites live", v: "4" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps, Machine Learning Operations)",
        narrative: `<p>Scanners get firmware upgrades, patient mix shifts seasonally, and calibration drifts — and in medicine <b>silent decay is a safety issue</b>, not just a quality one. So you monitor all four layers: inputs (image-stat drift per site), calibration (ECE), outcomes (per-hospital sensitivity/specificity as follow-ups confirm cases), and volume (flag rate). Any movement alerts and routes to a clinician, because a quiet sensitivity drop means missed patients.</p>`,
        concepts: ["prob-clt", "ml-classification-metrics", "mlx-error-analysis"],
        insight: `<b>A firmware update broke the model — silently.</b> Hospital B upgraded its scanner firmware, shifting image brightness, which pushed <b>ECE from 0.038 to 0.094</b> (probabilities went stale) and dropped <b>30-day confirmed sensitivity from 0.91 to 0.85</b> — a real loss of caught cases with no error message anywhere. Outcome-based sensitivity is the ground-truth monitor: it lags (you wait for follow-ups) but it's the only signal that directly answers "are we still catching disease?". The fix loops back to recalibrate and retrain.`,
        data: {
          caption: "This month's clinical monitors (hospital B)",
          columns: ["signal", "layer", "reading", "alert?"],
          rows: [
            ["image brightness (B)", "input drift", "shifted (firmware)", "yes ⚠"],
            ["ECE", "calibration", "0.038 → 0.094", "yes ⚠"],
            ["sensitivity, 30d confirmed", "outcome", "0.91 → 0.85", "yes ⚠"],
            ["flag rate", "volume", "stable", "no"]
          ],
          note: `Outcome metrics confirm slowly (you must wait for follow-up diagnoses), so input + calibration drift act as fast early warnings — they moved first and predicted the sensitivity drop.`
        },
        symbols: [
          { sym: "input-stat drift", desc: "change in image statistics (brightness, contrast) vs training; a fast, label-free early warning of trouble." },
          { sym: "outcome monitoring", desc: "tracking confirmed sensitivity/specificity as real diagnoses come back; ground truth but lagged." },
          { sym: "ECE drift", desc: "rising Expected Calibration Error, meaning the model's probabilities no longer match reality and must be recalibrated." }
        ],
        steps: [
          { type: "decide", prompt: "What do you monitor for a clinical model?",
            options: [
              { label: "Per-hospital sensitivity/specificity as outcomes confirm, input image-stat drift, calibration (ECE), and flag rate — with alerts and human review", best: true, feedback: "this is safety-grade MLOps because it watches every layer that can fail independently: input drift catches a scanner change early and label-free, ECE catches probabilities going stale, confirmed per-site sensitivity is the ground truth on whether disease is still being caught, and flag rate catches volume anomalies. Doing it per hospital means a single site's regression can't hide in an average, and routing alerts to clinicians keeps the human in the loop even in monitoring. That combination is what catches the firmware regression before it harms patients." },
              { label: "Just total scans processed per day", feedback: "throughput is blind to quality. The scanner count stayed perfectly normal this month while sensitivity quietly fell from 0.91 to 0.85 — a real loss of caught cases that 'scans per day' cannot see. Monitoring volume alone would let a clinical safety regression run undetected until patients were harmed, which is exactly the silent decay you're supposed to prevent." }
            ] },
          { type: "run", label: "▶ Check this month's monitors", result: { log: "hospital B upgraded scanner firmware -> image brightness shifted\ncalibration ECE: 0.038 -> 0.094 (drift)\nsensitivity (last 30d, confirmed cases): 0.91 -> 0.85  ALERT\naction: open review, recalibrate on recent B scans, schedule retrain", metrics: [{ k: "sensitivity", v: "0.85 ⚠" }, { k: "ECE", v: "0.094 ⚠" }], chart: { type: "bars", title: "Hospital B drift after firmware update", labels: ["sensitivity before", "sensitivity after", "ECE before", "ECE after"], values: [0.91, 0.85, 0.038, 0.094], colors: ["#7ee787", "#ff7b72", "#7ee787", "#ff7b72"] } }, note: `Monitoring caught a scanner upgrade that broke calibration and sensitivity — triggering recalibration and a retrain, back to the <b>Data</b> stage. The loop never really ends.` }
        ]
      }
    ]
  },

  "self-driving": {
    title: "Self-Driving & Autonomous Navigation",
    icon: "🚗",
    goal: "Build the perception + planning stack for an autonomous shuttle — safe in the long tail, and able to fail gracefully when it's unsure.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the problem",
        narrative: `<p>The shuttle must <b>perceive</b> the road, <b>predict</b> what other agents will do, and <b>plan</b> a safe path — a three-part stack. Perception is benchmarked on multi-sensor sets like <b>nuScenes</b> (1,000 driving scenes of 20s each, a full sensor suite of 6 cameras + 1 lidar + 5 radars + GPS (Global Positioning System)/IMU (Inertial Measurement Unit), 1.4M 3D boxes over 23 classes) and the <b>Waymo Open Dataset</b> (1,150 scenes, ~12M 3D lidar boxes), with <b>KITTI</b> and <b>Cityscapes</b> as the earlier camera/lidar standards. The defining property is that safety is judged on the <i>tail</i>, not the average: a single catastrophic miss outweighs millions of smooth miles, so the objective is built around worst-case risk and a guaranteed fail-safe. Optimizing average comfort or speed quietly trades away exactly the rare events that matter most.</p>`,
        concepts: ["dl-object-detection", "ai-mdp"],
        insight: `<b>The tail is the product.</b> A fleet at "<b>1 catastrophic event per million miles</b>" still has thousands of catastrophes at scale, so a metric like average trip time — which improves by braking less and driving faster — can <i>raise</i> tail risk while looking better on average. Autonomy is graded on its worst cases, so you optimize the long tail and guarantee a safe fallback (a minimal-risk stop) whenever the system is unsure. Even a perfect detector isn't enough: perception still needs safe planning around it.`,
        data: {
          caption: "Objective candidates vs how autonomy is judged",
          columns: ["objective", "optimizes", "tail-risk effect"],
          rows: [
            ["min average trip time", "speed/comfort on typical miles", "can worsen (less braking)"],
            ["max long-tail safety + fail-safe", "worst-case events", "directly reduces (best)"],
            ["max detection mAP only", "perception accuracy", "ignores planning & fallback"]
          ],
          note: `'Long tail' = rare scenes (night jaywalker, occluded ped, debris) that are a tiny fraction of miles but nearly all of the risk. Average metrics underweight them by definition.`
        },
        symbols: [
          { sym: "long tail", desc: "the rare, dangerous scenarios (occlusions, night, debris) that dominate safety risk despite being a small fraction of miles." },
          { sym: "fail-safe / MRC", desc: "a minimal-risk condition — a guaranteed safe action (controlled stop) the system falls back to when uncertain." },
          { sym: "perceive→predict→plan", desc: "the autonomy stack: detect agents, forecast their motion, then choose a safe trajectory." }
        ],
        steps: [{
          type: "decide", prompt: "What should the top-line objective be?",
          options: [
            { label: "Minimize average trip time across all rides", feedback: "this optimizes the wrong tail of the distribution. Average trip time improves by accelerating sooner and braking less — behaviors that shave seconds on the millions of easy miles while increasing risk in the rare dangerous moments. Since autonomy is judged on those rare catastrophic events, an objective that's blind to them (and even mildly rewards riskier driving) is exactly backwards." },
            { label: "Maximize safety on the long tail (rare, dangerous situations) while keeping rides smooth — with a fail-safe fallback", best: true, feedback: "correct — this targets where the real risk lives. By optimizing the long tail you put effort into the occluded-pedestrian, night, and debris cases that cause crashes, and by guaranteeing a fail-safe (a minimal-risk stop when confidence is low) you bound the worst case even for situations you haven't fully solved. Smoothness stays a secondary objective, subordinate to safety. That priority ordering is what 'safe autonomy' means." },
            { label: "Maximize detection mAP (mean Average Precision) only", feedback: "perception accuracy is necessary but nowhere near sufficient. A detector with perfect mAP still has to predict other agents' intent and plan a safe trajectory, and it still needs a fallback for the moments it's uncertain. Optimizing mAP alone leaves the planning and fail-safe layers — where most safety actually comes from — completely unaddressed." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather driving data",
        narrative: `<p>You log real drives across the same complementary sensors nuScenes and Waymo carry — camera, LiDAR, radar — but raw miles are mostly redundant highway cruising. (nuScenes deliberately curated its 1,000 scenes for <i>interesting</i> traffic: rain, night, dense intersections.) The valuable data is the rare scary moment: a disengagement (the safety driver took over), a near-miss, or an odd scene. So you <b>actively mine</b> the long tail from fleet logs and pay to label only those, because uniform labeling drowns you in boring frames while the failures hide in the 1% that matters.</p>`,
        concepts: ["ml-supervised", "dl-object-detection"],
        insight: `<b>Mining concentrates labels where the model fails.</b> Of <b>2.1M logged miles</b>, you mine just <b>41,300 hard events</b> and label <b>1.9M 3D boxes</b> on those (nuScenes hand-labeled ~1.4M boxes across 23 classes for comparison) — a tiny, dense slice rich in night (18%), rain (11%), and occluded pedestrians (9%). Labeling all 2.1M miles uniformly would cost orders of magnitude more and be ~99% redundant cruising that teaches nothing new. The whole point is that a near-miss frame carries far more learning signal than a thousand empty-highway frames.`,
        data: {
          caption: "One mined keyframe, nuScenes 3D-box schema",
          columns: ["field", "example value", "source"],
          rows: [
            ["sample_token", "ev_41021 (disengagement)", "mined from logs"],
            ["category", "human.pedestrian.adult", "23-class taxonomy"],
            ["box: center / size / yaw", "[12.4, −1.1, 0.9] / [0.7,0.8,1.8] / 1.2 rad", "LiDAR + 6 cameras"],
            ["velocity / attribute", "1.2 m/s toward lane / moving", "temporal fusion"],
            ["scene tags", "night, occluded_ped", "auto + human"],
            ["… 1.9M objects", "…", "…"]
          ],
          note: `nuScenes box schema: a 3D box = center $(x,y,z)$ + size $(w,l,h)$ + yaw rotation, plus a category, a velocity, and an attribute, tracked across frames by instance_token. Scene tags let you measure recall per condition later. Mining = keep the 41.3k informative events, drop the redundant millions.`
        },
        symbols: [
          { sym: "disengagement", desc: "an event where the safety driver took control from the autonomy; a high-value mined signal of a failure." },
          { sym: "active mining", desc: "selecting the rare informative frames (near-misses, anomalies) to label, instead of sampling miles uniformly." },
          { sym: "3D box + track", desc: "an object's position/size in 3D space plus its motion across frames; the supervised target for perception." }
        ],
        steps: [
          { type: "decide", prompt: "How should you build the dataset?",
            options: [
              { label: "Log many miles, then actively mine and label disengagements, near-misses, and odd scenes (the long tail)", best: true, feedback: "this puts your labeling budget where the model actually fails. Uniform sampling over 2.1M miles is ~99% redundant highway cruising, so most labels would teach nothing; mining the 41.3k disengagements and near-misses concentrates effort on the rare, hard scenes that drive the tail risk you're optimizing. You log broadly but label selectively — the only affordable way to cover the long tail densely." },
              { label: "Only keep clean, sunny highway driving", feedback: "this builds a dataset that systematically excludes the situations that cause crashes. A model trained only on clear daytime highway has never seen rain, night, construction, or a jaywalker, so it will be most confident exactly where it's most dangerous. You'd optimize the easy miles and leave the long tail — the whole safety problem — completely uncovered." },
              { label: "Label every single frame equally", feedback: "labeling all 2.1M miles of 3D boxes is astronomically expensive and mostly wasted, since the overwhelming majority of frames are near-identical empty road that the model already handles. You'd burn the budget on redundancy and still under-sample the rare events, because they're rare. Equal labeling ignores that information density, not frame count, is what matters." }
            ] },
          { type: "run", label: "▶ Mine & label hard cases", prompt: "Mine disengagements and rare scenes from the fleet logs.",
            result: { log: "fleet logs: 2.1M miles (6 cameras + lidar + 5 radars, nuScenes-style suite)\nmined events: 41,300 (disengagements, near-misses, anomalies)\nlabeled 3D boxes + tracks: 1.9M objects across 23 classes\nbox = center xyz + size whl + yaw + velocity + attribute\nscene tags: night 18%, rain 11%, construction 6%, occluded peds 9%", metrics: [{ k: "miles", v: "2.1M" }, { k: "hard events", v: "41.3k" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the long tail",
        narrative: `<p>Survey <i>where</i> perception currently struggles by slicing recall per scene condition — nuScenes and Waymo ship exactly these slices (night/rain splits, per-class AP (Average Precision), and Waymo's LEVEL_2 boxes that include heavily occluded objects). The distribution of failures — not the average recall — drives the roadmap, because in autonomy a slice that's both <b>weak and safety-critical</b> (occluded pedestrians) outranks one that's weak but harmless. You also flag where sensors disagree, since radar-vs-camera conflicts are a clue that fusion (next stage) is doing real work.</p>`,
        concepts: ["mlx-error-analysis", "ai-hmm"],
        insight: `<b>Frequency is the wrong lens; cost is the right one.</b> Recall falls from <b>day 0.96 → night 0.81 → heavy rain 0.74</b>, and the worst slice is <b>occluded pedestrians at 0.69</b>. That slice is a small fraction of frames, but a single missed pedestrian is catastrophic, so it sets priority over more common but lower-stakes misses. The <b>3.1% radar-camera disagreements</b> aren't failures — they mark exactly the scenes (rain, glare) where one sensor covers the other's blind spot.`,
        data: {
          caption: "Detection recall by scene slice",
          columns: ["slice", "recall", "share of frames", "priority"],
          rows: [
            ["day, clear", "0.96", "high", "fine"],
            ["night", "0.81", "18%", "watch"],
            ["heavy rain", "0.74", "11%", "watch"],
            ["occluded pedestrian", "0.69 ⚠", "~9%", "TOP (safety-critical)"]
          ],
          note: `Priority = recall weakness × cost of the error, not frequency. Occluded peds rank first because a miss is potentially fatal, even though they're a minority of frames.`
        },
        symbols: [
          { sym: "recall (per slice)", desc: "of true objects in a scene type, the fraction detected; sliced by condition to expose where perception fails." },
          { sym: "error cost", desc: "the consequence of a miss; in autonomy it, not frequency, sets which failure slice to fix first." },
          { sym: "sensor disagreement", desc: "frames where radar and camera detections conflict (3.1%); flags conditions where fusion redundancy matters." }
        ],
        steps: [
          { type: "run", label: "▶ Profile failure modes", result: { log: "detection recall by scene: day 0.96, night 0.81, heavy rain 0.74\npartially-occluded pedestrians: recall 0.69 (worst slice)\nradar-camera disagreements: 3.1% of frames\nrare classes (e.g. road debris): very few labels", metrics: [{ k: "rain recall", v: "0.74" }, { k: "occluded ped", v: "0.69 ⚠" }], chart: { type: "bars", title: "Detection recall by scene slice (occluded ped is worst)", labels: ["day clear", "night", "heavy rain", "occluded ped"], values: [0.96, 0.81, 0.74, 0.69], colors: ["#7ee787", "#ffb454", "#ffb454", "#ff7b72"] } } },
          { type: "decide", prompt: "Occluded-pedestrian recall is 0.69, the worst slice. How serious is that?",
            options: [
              { label: "Top priority — a missed pedestrian is a safety-critical failure even if it's rare", best: true, feedback: "right — in safety-critical ML you weight a failure by the cost of the error, not how often it occurs. Missing an occluded pedestrian can be fatal, so a 0.69 recall there is far more urgent than, say, a 0.74 on rainy car detection, even though both are 'weak slices'. Ranking the roadmap by consequence is what separates a safety mindset from a metrics mindset." },
              { label: "Minor — it's a small fraction of frames", feedback: "this applies the wrong lens. Frequency would matter if every error cost the same, but it doesn't — one missed pedestrian is catastrophic and irreversible, while a missed distant cone is not. Dismissing the worst slice because it's rare is precisely how the long-tail risk you're supposed to optimize slips through. Rarity never makes a fatal failure acceptable." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Fuse the sensors",
        narrative: `<p>No single sensor is enough, and that's by design: cameras read semantics (color, signs, pedestrian shape) but fail at night and can't measure range; LiDAR gives precise geometry but struggles in heavy rain; radar measures velocity directly and sees through rain but is coarse. <b>Sensor fusion</b> combines them so each covers the others' blind spots, and a <b>temporal state estimator</b> (a tracker) smooths noisy per-frame detections into stable object tracks. Redundancy here is a safety requirement, not a nicety.</p>`,
        concepts: ["ai-hmm", "dl-object-detection", "ai-mdp"],
        insight: `<b>Each sensor fails differently — fusion is the redundancy.</b> Recall on camera alone falls off a cliff at night and in the 11% rainy frames, but radar holds up there and LiDAR pins exact range; fusing all three means no single failure mode blinds the car. A <b>state estimator</b> then tracks each object over time, so one missed frame doesn't erase a pedestrian — its predicted track carries through. Naively averaging raw sensor values is meaningless: they live in different units, modalities, and coordinate frames.`,
        data: {
          caption: "Sensor strengths and failure modes",
          columns: ["sensor", "measures well", "fails at", "covered by"],
          rows: [
            ["camera", "semantics, class, signs", "night, glare, no range", "LiDAR, radar"],
            ["LiDAR", "precise 3D geometry/range", "heavy rain, fog", "radar"],
            ["radar", "velocity, sees through rain", "coarse shape/class", "camera, LiDAR"],
            ["fusion + tracker", "all of the above, smoothed", "—", "—"]
          ],
          note: `The state estimator (a recursive Bayes/HMM (Hidden Markov Model)-style filter) predicts each object's next state and corrects it with new detections, so tracks survive a dropped frame. Fusion must respect each sensor's geometry — you align in 3D space, not by averaging pixels.`
        },
        symbols: [
          { sym: "sensor fusion", desc: "combining camera + LiDAR + radar so each sensor's strengths cover the others' blind spots, giving redundant perception." },
          { sym: "state estimator / tracker", desc: "a recursive filter that maintains each object's state (position, velocity) over time, smoothing noisy detections." },
          { sym: "modality", desc: "the kind of measurement a sensor produces (pixels vs point cloud vs Doppler); why naive averaging across sensors is invalid." }
        ],
        steps: [{
          type: "decide", prompt: "How should you combine camera, LiDAR, and radar?",
          options: [
            { label: "Fuse all three so each covers the others' blind spots, and track objects over time with a state estimator", best: true, feedback: "this gives both spatial redundancy and temporal stability — the two things safety demands. Fusing the sensors means radar carries perception through the rain where the camera and LiDAR degrade, while the camera supplies the class and LiDAR the exact range; no single sensor failure can blind the car. Adding a state estimator means a one-frame miss doesn't drop an object, because its track is predicted forward and corrected. Redundancy across sensors and time is the safety architecture." },
            { label: "Use only the camera; it's the richest sensor", feedback: "the camera is information-rich but fails exactly where you can't afford to: at night, in heavy rain, and it can't measure range directly at all. Relying on one sensor means its failure mode is the whole system's failure mode — and from exploration you know night and rain are already weak slices. Safety-critical perception needs redundant sensors so a single modality's blind spot is covered, not amplified." },
            { label: "Average the three sensors' pixel values", feedback: "this is a category error. The three sensors produce different modalities — camera pixels, a LiDAR point cloud, radar Doppler returns — in different units and coordinate frames, so element-wise averaging combines quantities that aren't comparable and destroys all of them. Real fusion aligns detections in 3D space and reasons about each sensor's reliability per condition; it must respect geometry, not blend raw values." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Perception + planning",
        narrative: `<p>Perception detects and tracks agents; <b>planning</b> chooses safe actions over time. The key modeling decision is to frame planning as a <i>sequential</i> decision process — a Markov Decision Process where each action changes the next state — not a one-shot label. Driving is fundamentally about consequences over a horizon: braking now changes where every other agent will be in two seconds. A learned policy over the MDP handles the nuance, while hard rule-based safety checks act as an outer guardrail.</p>`,
        concepts: ["dl-conv", "ai-mdp", "mod-actor-critic"],
        insight: `<b>Driving is sequential, so the model must be too.</b> In an MDP (Markov Decision Process) the car is in a <b>state $s_t$</b>, takes an <b>action $a_t$</b> (steer/accelerate/brake), pays a <b>cost</b>, and lands in a new state $s_{t+1}$ — and that transition is exactly why a per-frame classifier fails: it can't reason that this brake prevents a collision three steps ahead. A learned <b>policy $\\pi(a\\mid s)$</b> is trained actor-critic style: a critic estimates each state's value $V(s)$, the <b>advantage</b> $A_t=G_t-V(s_t)$ scores whether an action beat that baseline, and the policy is nudged toward positive-advantage actions over the whole horizon. A rule-based safety layer then vetoes any action that violates a hard constraint, so the learned part never has the final say on safety.`,
        data: {
          caption: "One planning transition as an MDP step",
          columns: ["$s_t$ (state)", "$a_t$ (action)", "cost", "$s_{t+1}$ (next state)"],
          rows: [
            ["ped 6m, closing 1.2 m/s", "brake −3 m/s²", "+comfort penalty", "ped 5m, gap widening"],
            ["clear lane, 22 mph", "hold speed", "0", "clear lane, 22 mph"],
            ["occluded crosswalk", "slow + nudge", "small time cost", "view clears, safe"],
            ["…", "…", "…", "…"]
          ],
          note: `Each row is one step: the action changes the next state, which is why planning must reason over sequences. The safety layer rejects any $a_t$ that breaches a hard rule before it's executed.`
        },
        chart: { type: "scatter", title: "Planning policy: commanded braking vs pedestrian distance", xlabel: "pedestrian distance (m)", groups: [{ name: "brake (closing agent)", color: "#ff7b72", points: [[4, 3.4], [5, 3.0], [6, 3.0], [7, 2.1], [8, 1.6]] }, { name: "slow (occluded)", color: "#ffb454", points: [[10, 1.0], [12, 0.8], [15, 0.6]] }, { name: "hold speed (clear)", color: "#7ee787", points: [[25, 0], [30, 0], [40, 0]] }] },
        symbols: [
          { sym: "MDP", desc: "Markov Decision Process: states, actions, transition dynamics, and costs; the framework for sequential decisions." },
          { sym: "$s_t,\\ a_t$", desc: "the state at time $t$ (scene + agent tracks) and the action taken (steer/accelerate/brake)." },
          { sym: "policy $\\pi(a\\mid s)$", desc: "the learned mapping from state to action the planner optimizes over the driving horizon." },
          { sym: "advantage $A_t$", desc: "$A_t=G_t-V(s_t)$, return minus the critic's value baseline; the actor-critic signal that pushes good actions up and bad ones down with low variance." },
          { sym: "safety guardrail", desc: "hard rule-based checks that veto any policy action violating a constraint; safety never relies on the learned net alone." }
        ],
        steps: [{
          type: "decide", prompt: "How should the planning layer be framed?",
          options: [
            { label: "As a sequential decision process (states, actions, costs) with a learned policy, validated against rule-based safety checks", best: true, feedback: "this matches the structure of driving. Because each action changes the next state — your brake reshapes where every agent will be — planning is inherently sequential, and an MDP with a learned policy reasons over that horizon instead of one frame. Wrapping it in hard rule-based safety checks gives a guardrail the learned policy cannot override, so you get the flexibility of learning with a guaranteed safety floor. Right framing plus a safety backstop." },
            { label: "A single classifier that outputs 'left/right/brake' from one frame", feedback: "a one-frame classifier is blind to dynamics and consequence. It can't represent that the right action now depends on where agents will be in two seconds, nor that braking changes the future — it just maps a snapshot to a label. Safe driving requires reasoning over a sequence of coupled states; collapsing that to per-frame classification throws away the temporal structure that makes planning planning." },
            { label: "Pure open-loop replay of human trajectories", feedback: "open-loop replay executes a fixed recorded path with no feedback, so the moment reality differs from the log — a new agent, a different gap — it has no way to react and drifts off the safe trajectory. Driving must be closed-loop: observe the current state and choose the next action. Replaying trajectories can't generalize to situations the log never contained, which is most of the long tail." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train in simulation",
        narrative: `<p>You can't ethically collect crashes on real roads, so you train and stress-test the policy in <b>simulation</b> first — replaying the mined long-tail scenes plus synthetic edge cases you'd never want to encounter for real. To narrow the coming sim-to-real gap you apply <b>domain randomization</b>: each episode the sim samples sensor noise, weather/lighting, friction, and other-agent behavior from a range, so the policy learns to be robust across conditions rather than overfitting one rendered world — the real road then falls inside the trained distribution. Training is gradient ascent on expected return, and you watch <i>two</i> objectives move together: collision rate (safety, must fall) and a comfort score (smoothness, secondary). Watching both prevents a policy that's safe by being uselessly timid or smooth by being unsafe.</p>`,
        concepts: ["ml-gradient-descent", "mod-actor-critic", "ai-mdp"],
        insight: `<b>Simulation buys safe, unlimited rare-case practice.</b> Over <b>1.2M scenarios</b> (mined long-tail + synthetic edge cases) the policy drives collision rate from <b>2.1 → 0.18 per 1k miles</b> while comfort <i>rises</i> from <b>0.71 → 0.85</b> — safety and smoothness improving together, not traded off. None of these millions of near-crashes could be collected on real roads without endangering people, which is the entire reason sim comes first. The catch (next stage): sim numbers are optimistic and must survive the sim-to-real gap.`,
        data: {
          caption: "Training progression in simulation",
          columns: ["iteration", "collision rate /1k mi", "comfort", "note"],
          rows: [
            ["200k", "2.1", "0.71", "early, unsafe"],
            ["600k", "0.4", "0.83", "improving both"],
            ["900k", "0.18", "0.85", "converged"]
          ],
          note: `The policy maximizes expected return $G_t=\\sum_k \\gamma^k r_{t+k}$ with a shaped per-step reward, e.g. $r = +1\\,(\\text{progress}) - 100\\,(\\text{collision}) - 0.3\\,(\\text{hard brake/jerk}) - 0.05\\,(\\text{time})$. The huge collision penalty makes safety dominate the return; the small comfort terms shape smoothness. Training nudges the policy by the advantage $A_t=G_t-V(s_t)$. Both metrics improve together because the reward shapes for both — a sign the objective is well-formed.`
        },
        symbols: [
          { sym: "simulation", desc: "a physics/scenario simulator where the policy can experience millions of rare and dangerous events with zero real-world risk." },
          { sym: "collision rate /1k mi", desc: "simulated collisions per thousand miles; the primary safety metric to drive down." },
          { sym: "return $G_t$", desc: "$G_t=\\sum_k \\gamma^k r_{t+k}$, the discounted sum of future rewards the policy maximizes ($\\gamma$ = discount, $r$ = per-step reward)." },
          { sym: "shaped reward", desc: "per-step reward with safety dominating, e.g. $+1$ progress, $-100$ collision, $-0.3$ jerk, $-0.05$ time; the large collision penalty is what makes the return prioritize safety over speed." },
          { sym: "advantage $A_t$", desc: "$A_t=G_t-V(s_t)$, return minus the critic's value baseline; the actor-critic update signal." }
        ],
        steps: [{
          type: "run", label: "▶ Train policy in sim (hard-case scenarios)",
          result: { log: "training planning policy in simulation (actor-critic, gamma=0.99)...\nscenarios: 1.2M (incl. mined long-tail + synthetic edge cases)\nshaped reward r = +1 progress -100 collision -0.3 jerk -0.05 time\nupdate by advantage A_t = G_t - V(s_t); collision term dominates return\niter 200k  collision rate 2.1/1k mi  comfort 0.71\niter 600k  collision rate 0.4/1k mi  comfort 0.83\niter 900k  collision rate 0.18/1k mi comfort 0.85 (converged)", metrics: [{ k: "sim collisions/1k mi", v: "0.18" }, { k: "comfort", v: "0.85" }], chart: { type: "line", title: "Sim training: collisions fall, comfort rises (in 1000s of iters)", xlabel: "iteration (k)", series: [{ name: "collisions/1k mi", color: "#ff7b72", points: [[200, 2.1], [600, 0.4], [900, 0.18]] }, { name: "comfort", color: "#7ee787", points: [[200, 0.71], [600, 0.83], [900, 0.85]] }] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate & sim-to-real",
        narrative: `<p>Sim numbers flatter you, because the simulator is an imperfect model of reality. The real test has three parts: <b>held-out</b> sim scenarios the policy never trained on (does it generalize, or memorize?), <b>closed-course</b> trials on a real vehicle (does it survive the <i>sim-to-real gap</i>?), and <b>fault injection</b> (does the fail-safe actually fire when something breaks?). The gap is the headline risk — real performance is systematically worse than sim, so sim is an upper bound, not a verdict.</p>`,
        concepts: ["mlx-error-analysis", "ai-mdp", "mlx-cross-validation"],
        insight: `<b>The sim-to-real gap is measured, and it's downward.</b> Held-out sim collisions ($0.31/1k$) already exceed training ($0.18$) — the first generalization penalty — and on the real closed course perception recall runs <b>4–6% below sim</b>. So every sim number is optimistic, which means you treat it as a ceiling and lean on the fail-safe (it fired correctly in <b>12/12 fault injections</b>) while expanding real testing. Jumping to public roads on sim numbers would deploy into the exact long-tail gap you can't yet measure.`,
        data: {
          caption: "Evaluation across sim, real, and fault injection",
          columns: ["test", "metric", "result", "reading"],
          rows: [
            ["held-out sim", "collision /1k mi", "0.31", "worse than train 0.18"],
            ["closed course (real)", "collisions in 1,400 mi", "0 (3 over-brakes)", "cautious, safe"],
            ["sim-to-real", "perception recall gap", "−4 to −6%", "sim is optimistic"],
            ["fault injection", "fail-safe fired", "12/12", "fallback reliable ✓"]
          ],
          note: `The recall gap means the real world is harder than sim; combined with held-out > train, every sim metric is an upper bound. The fail-safe's 12/12 is what lets you deploy cautiously despite that gap.`
        },
        symbols: [
          { sym: "sim-to-real gap", desc: "the systematic drop in performance from simulation to the real vehicle; makes sim metrics an optimistic upper bound." },
          { sym: "held-out scenarios", desc: "test scenes excluded from training; measure generalization vs memorization within the simulator." },
          { sym: "fault injection", desc: "deliberately breaking a sensor/component to verify the fail-safe (minimal-risk stop) triggers as designed." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate on held-out + closed course", result: { log: "held-out sim scenarios: collision rate 0.31/1k mi\nclosed-course (real): 0 collisions in 1,400 mi, 3 cautious over-brakes\nsim-to-real gap: real perception recall 4-6% below sim\nfail-safe (minimal-risk stop) triggered correctly in 12/12 fault injections", metrics: [{ k: "held-out collisions", v: "0.31/1k" }, { k: "fail-safe", v: "12/12" }] } },
          { type: "decide", prompt: "Real perception recall is 4-6% below sim. What's the responsible read?",
            options: [
              { label: "The sim-to-real gap is real, so sim metrics are an upper bound — keep the fail-safe and expand real testing before scaling", best: true, feedback: "exactly — a measured 4–6% recall gap means the simulator systematically over-states performance, so the right mental model is 'sim is the best case, reality is worse.' You therefore trust the closed-course and real numbers more than sim, keep the fail-safe armed as the backstop for the gap you can't yet close, and scale only as real-world evidence accumulates. Treating sim as a ceiling rather than a verdict is the responsible read." },
              { label: "Sim passed, so it's ready for unsupervised public roads everywhere", feedback: "this ignores the very gap you just measured. Real recall is 4–6% below sim, so the strong sim numbers overstate real safety — and public roads contain long-tail situations neither sim nor the closed course has covered. Launching unsupervised everywhere on sim results removes the safety net precisely where the unmeasured risk is highest. The gap is a reason to expand testing, not to skip it." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Occluded-pedestrian recall (0.69) is still the limiting, safety-critical failure. Error analysis points at two causes: too few hard occluded-ped examples, and weak handling when one sensor is blocked. The right fix attacks both — more data plus stronger fusion — and crucially adds a <b>conservative policy near crosswalks</b> so the residual risk is bounded even before perception is perfect. Global knobs (drop the threshold, drive faster) don't touch either cause and create new harms.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "ai-mdp"],
        insight: `<b>Two causes, plus a guardrail for what's left.</b> The 0.69 occluded-ped recall comes from data scarcity and weak occluded-object fusion, so you mine more such scenes, add <b>synthetic occlusion in sim</b> (cheap, controllable hard cases), and <b>strengthen radar fusion</b> (radar can see a partly-hidden body the camera can't). Because perception will never be perfect, you also make the policy <b>slow and cautious near crosswalks</b> — bounding the worst case via behavior, the layered defense autonomy relies on. Lowering thresholds fleet-wide just trades the miss for phantom braking everywhere.`,
        data: {
          caption: "Fix the cause, then bound the residual",
          columns: ["lever", "cause it addresses", "effect"],
          rows: [
            ["mine + synthetic occluded-ped scenes", "too few hard examples", "recall ↑ on the slice"],
            ["strengthen radar fusion", "occluded-object handling", "sees partly-hidden bodies"],
            ["conservative policy near crosswalks", "residual risk (perfection impossible)", "bounds worst case"],
            ["(reject) lower global threshold", "nothing", "phantom braking fleet-wide"]
          ],
          note: `Note the layered approach: improve perception (data + fusion) AND constrain behavior (cautious near crosswalks). Safety doesn't wait for a perfect detector — it adds a behavioral floor.`
        },
        symbols: [
          { sym: "synthetic occlusion", desc: "simulated partially-hidden pedestrians injected into sim to cheaply generate scarce hard training cases." },
          { sym: "conservative policy", desc: "a behavioral guardrail (slow, extra caution near crosswalks) that bounds risk even when perception is imperfect." },
          { sym: "phantom braking", desc: "false-positive-driven sudden stops; the fleet-wide side effect of lowering detection thresholds to chase one slice." }
        ],
        steps: [{
          type: "decide", prompt: "Best way to reduce the occluded-pedestrian risk?",
          options: [
            { label: "Mine more occluded-ped scenes, add synthetic occlusion in sim, strengthen radar fusion, and keep a conservative fallback near crosswalks", best: true, feedback: "this is a layered fix that matches the diagnosis. Mining real scenes and injecting synthetic occlusion directly attacks the data scarcity, while strengthening radar fusion improves the occluded-object handling — radar can detect a body the camera only partly sees. And because no detector is ever perfect, a conservative policy near crosswalks bounds the residual risk through behavior. Improve perception AND constrain behavior: that's the defense-in-depth safety demands." },
            { label: "Lower the detection confidence threshold for everything", feedback: "this is a global knob that creates a worse problem than it solves. Dropping the threshold fleet-wide rescues some occluded peds but floods every scene with low-confidence false positives, triggering phantom braking that is itself dangerous and erodes rider trust. It also doesn't address why occluded peds are missed — scarce data and weak fusion — so the real cause remains. Fix perception coverage, don't flood the outputs." },
            { label: "Drive faster to collect miles quicker", feedback: "more miles of the same easy driving don't add occluded-pedestrian examples, because those are rare by nature — you'd accumulate redundant highway data while the hard slice stays starved. Worse, higher speed raises stopping distance and risk in exactly the crosswalk situations you're trying to make safer. This is a data-and-fusion gap; speed addresses neither and increases danger." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy with a safety driver",
        narrative: `<p>You never flip a switch to full autonomy. Deployment is a staged, supervised expansion that shrinks the unknowns at each step: a small <b>geofenced</b> route (a tightly bounded operating design domain), a <b>low speed cap</b>, a <b>safety operator</b> who can take over, and an armed <b>fail-safe</b>. You expand the ODD — more hours, weather, geography — only as real evidence accrues. The whole structure exists to keep the blast radius small while the long tail is still being proven out.</p>`,
        concepts: ["ai-mdp", "dl-object-detection"],
        insight: `<b>Constrain the domain, keep two backstops, expand on evidence.</b> The launch is a <b>6-mile loop at ≤25 mph</b> with a safety operator and the fail-safe armed — week 1 logs <b>0 collisions, 5 precautionary takeovers, 2 minimal-risk stops</b>, all signals the layered safety net is working. The geofence bounds <i>which</i> situations can occur (a small, mapped ODD (Operational Design Domain)), the operator and fail-safe bound <i>what happens</i> when something unexpected does. A city-wide driverless day-one launch would discard every one of those bounds at once.`,
        data: {
          caption: "Staged go-live vs the all-at-once alternative",
          columns: ["constraint", "staged launch", "why it matters"],
          rows: [
            ["operating domain", "6-mile geofence", "bounds which scenes can occur"],
            ["speed", "≤25 mph", "shorter stopping distance, lower energy"],
            ["human backup", "safety operator", "catches what the policy misses"],
            ["fallback", "minimal-risk stop armed", "guaranteed safe action"],
            ["expansion", "add dusk/weather on evidence", "unknowns shrink, not explode"]
          ],
          note: `ODD = Operational Design Domain: the exact conditions (geography, speed, weather, time) the system is approved to operate in. Staged deployment grows the ODD only as data justifies it.`
        },
        symbols: [
          { sym: "ODD", desc: "Operational Design Domain: the bounded set of conditions (route, speed, weather) the autonomy is approved to run in." },
          { sym: "geofence", desc: "a fixed geographic boundary the shuttle won't leave; limits which scenarios it can encounter." },
          { sym: "safety operator", desc: "the human onboard who can take over (a takeover) — a backstop while the long tail is unproven." },
          { sym: "minimal-risk stop", desc: "the fail-safe's controlled stop to a safe state, triggered when the system is uncertain or faulted." }
        ],
        steps: [
          { type: "decide", prompt: "How should the shuttle go live?",
            options: [
              { label: "Geofenced low-speed route with a safety operator, a minimal-risk-condition fail-safe, and gradual ODD expansion as evidence accrues", best: true, feedback: "this is how autonomy actually ships, because every clause shrinks risk. The geofence and speed cap bound which and how-fast situations can occur; the safety operator and minimal-risk fail-safe bound what happens when the unexpected does occur; and expanding the ODD only on accruing evidence means each new condition is entered with data, not hope. You keep the blast radius small precisely while the long tail is least proven — defense in depth at deployment." },
              { label: "Full city-wide driverless launch on day one", feedback: "this throws away every safety bound simultaneously. With no geofence the shuttle meets the full long tail at once, with no safety operator there's no human backstop, and at city speeds the consequences of any miss are larger. You demonstrated a measurable sim-to-real gap and an unsolved occluded-ped slice, so launching everywhere driverless courts exactly the catastrophic events the whole project optimized against. Autonomy expands from a proven core; it doesn't start at full scope." }
            ] },
          { type: "run", label: "▶ Launch geofenced route (safety operator)", result: { log: "enabling shuttle on 6-mile geofenced loop, max 25 mph...\nsafety operator present, fail-safe armed\nweek 1: 0 collisions, 5 operator takeovers (all precautionary), 2 minimal-risk stops\nexpanding hours to include dusk...\nlive (supervised).", metrics: [{ k: "collisions", v: "0" }, { k: "takeovers", v: "5" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps, Machine Learning Operations)",
        narrative: `<p>Roads are non-stationary — construction appears, signage changes, weather turns — so a frozen policy decays. You monitor <b>safety events</b> (takeover/disengagement rate, fail-safe triggers), <b>perception health</b> (recall on incoming scenes, sensor disagreement), and <b>input drift</b>, and you <i>auto-mine every event back into the dataset</i>. That last part closes the loop: a near-miss isn't just an alert, it's a new training example. In autonomy the monitoring loop and the data loop are the same loop.</p>`,
        concepts: ["prob-clt", "mlx-error-analysis", "ai-hmm"],
        insight: `<b>A new construction zone trips every safety signal at once.</b> This week takeovers spiked <b>4×</b> at one location, radar-vs-camera disagreement rose to <b>5.8% in fog</b>, and the fail-safe fired <b>9 times — all correct, all near the construction</b>. The clustering is the tell: a 4× spike concentrated in one place is far outside normal variation, so it's a real distribution shift, not noise. Those exact scenes get auto-mined and fed back to retraining — the same Data→Train→Deploy loop, now driven by production.`,
        data: {
          caption: "This week's fleet safety monitors",
          columns: ["signal", "type", "reading", "alert?"],
          rows: [
            ["takeovers at construction zone", "safety event", "4× baseline", "yes ⚠"],
            ["radar-camera disagreement (fog)", "perception health", "5.8%", "yes ⚠"],
            ["fail-safe triggers", "safety event", "9 (all correct)", "monitor ✓"],
            ["scenes auto-mined", "data loop", "→ retraining queue", "feeds Data stage"]
          ],
          note: `Every disengagement and fail-safe event is auto-labeled and added to the dataset — monitoring directly feeds the next training cycle. A localized 4× spike is many σ above normal, so it's a genuine shift, not chance.`
        },
        symbols: [
          { sym: "takeover / disengagement rate", desc: "how often the safety operator or system intervenes; the primary in-production safety signal." },
          { sym: "auto-mining", desc: "automatically capturing each monitored event as a labeled training example, closing the monitor→data loop." },
          { sym: "sensor disagreement", desc: "rate at which radar and camera conflict (rose to 5.8% in fog); an early warning of perception trouble." }
        ],
        steps: [
          { type: "decide", prompt: "What should the fleet monitor in production?",
            options: [
              { label: "Disengagement/takeover rate, fail-safe triggers, perception recall on incoming scenes, sensor-disagreement and drift — with every event auto-mined for retraining", best: true, feedback: "this is safety MLOps as a closed loop. Takeover rate and fail-safe triggers are the direct safety pulse; perception recall and sensor disagreement reveal where the inputs are drifting away from training; and auto-mining every event turns each near-miss into a new labeled example so the system actively improves on the situations it found hard. Monitoring that feeds straight back into the data and training loop is exactly how an autonomy fleet stays safe as the world changes." },
              { label: "Only average ride comfort score", feedback: "comfort is blind to safety. A near-miss, a fail-safe trigger, or a 4× takeover spike at a construction zone can all happen while the average comfort score barely moves — riders feel a smooth trip right up until they don't. Monitoring only comfort would miss every safety-critical signal and break the loop that turns production events into training data. In autonomy you must watch the safety events, not the ride feel." }
            ] },
          { type: "run", label: "▶ Review this week's safety monitors", result: { log: "new construction zone on route -> takeovers up 4x there\nsensor disagreement (radar vs camera) rose to 5.8% in fog\nfail-safe triggered 9x (all correct, all near the construction)\naction: mine construction scenes, retrain perception+planner, re-validate in sim", metrics: [{ k: "takeover spike", v: "4x ⚠" }, { k: "fail-safe", v: "9 (ok)" }], chart: { type: "bars", title: "Safety events this week (clustered at construction zone)", labels: ["takeovers (x baseline)", "fail-safe triggers", "sensor disagree % (fog)"], values: [4, 9, 5.8], colors: ["#ff7b72", "#ffb454", "#c89bff"] } }, note: `Monitoring caught a new construction zone driving up takeovers — those scenes get mined and fed back to retraining, returning to the <b>Data</b> stage. The safety loop is the product.` }
        ]
      }
    ]
  },

  "robotics-control": {
    title: "Robotics & Control",
    icon: "🤖",
    goal: "Teach a robot arm to pick and place parts reliably — learning a control policy in simulation, then deploying it safely on real hardware.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Define the reward",
        narrative: `<p>This is the <b>FetchPickAndPlace</b> task from <b>Gymnasium Robotics</b> (built on the <b>MuJoCo</b> physics engine, also used by <b>RoboSuite</b>): a 7-DOF (Degrees of Freedom) arm must grasp a block and place it at a target. You frame control as a <b>Markov Decision Process</b>: at each step the arm observes a <b>state</b>, takes an <b>action</b>, and earns a <b>reward</b>. Tellingly, FetchPickAndPlace's <i>default</i> reward is <b>sparse</b> (−1 every step until the block is within 5cm of the goal, then 0) — which is precisely why it ships as a benchmark for goal-conditioned RL (Reinforcement Learning) and is famously hard to learn from scratch. Everything the robot learns flows from how you shape that reward. The art is balancing two failure modes: a reward too sparse is never discovered by random exploration, while a reward for the wrong proxy (motor speed) is maximized by useless thrashing. You want a dense reward for the true goal plus gentle shaping terms.</p>`,
        concepts: ["ai-mdp", "ai-policy-value"],
        insight: `<b>Sparse rewards are undiscoverable; proxy rewards are gameable.</b> A "+1 only at exact placement" reward gives a random policy essentially <b>zero chance</b> of ever stumbling onto a +1, so there's no gradient to climb — the arm flails forever. Rewarding raw motor velocity is worse: it's maximized by thrashing the joints fast while placing nothing. The fix is a <b>dense reward</b> for successful gentle placement plus small penalties for time, jerk, and drops — frequent enough to learn from, aligned enough to mean the real task.`,
        data: {
          caption: "Reward designs compared",
          columns: ["reward", "learnable?", "aligned with goal?", "failure mode"],
          rows: [
            ["dense success + jerk/time/drop penalties", "yes (dense)", "yes", "— (best)"],
            ["+1 only at final placement", "no (too sparse)", "yes", "never discovered"],
            ["raw motor velocity", "yes", "no (proxy)", "thrashes, places nothing"]
          ],
          note: `Shaping terms (−time, −jerk, −drop) make the reward dense enough to give a gradient, while the success term keeps it aligned with the real objective. Both properties are required.`
        },
        chart: { type: "bars", title: "Reward components: one aligned goal term plus small shaping penalties", labels: ["placed (success)", "grasp", "time step", "jerk", "drop"], values: [1.0, 0.2, -0.01, -0.1, -0.5], colors: ["#7ee787", "#4ea1ff", "#ffb454", "#ffb454", "#ff7b72"] },
        symbols: [
          { sym: "MDP $(s,a,r)$", desc: "Markov Decision Process: at each step a state $s$, an action $a$, and a scalar reward $r$ from the environment." },
          { sym: "reward $r$", desc: "the per-step scalar the policy maximizes; it is the entire definition of the task to the robot." },
          { sym: "reward shaping", desc: "adding auxiliary terms (penalties for time/jerk/drops) to make a sparse reward dense and learnable without changing the true goal." },
          { sym: "sparse reward", desc: "a reward that is nonzero only at a rare event (final placement); hard to discover by exploration." }
        ],
        steps: [{
          type: "decide", prompt: "Which reward best encodes 'pick and place reliably'?",
          options: [
            { label: "A reward for a successful, gentle placement, with small penalties for time, jerk, and dropped parts", best: true, feedback: "this hits both requirements a reward must satisfy. The success term keeps it aligned with the true goal, and the shaping penalties (time, jerk, drops) make it dense — the arm gets frequent feedback that guides it toward smooth, fast, reliable placements rather than waiting for one rare jackpot. Dense enough to learn from, aligned enough to mean the real task: that's a well-designed reward." },
            { label: "+1 only at the exact final placement, zero everywhere else", feedback: "this reward is correctly aligned but undiscoverable. A freshly-initialized policy acts almost randomly, and the probability of randomly executing a full grasp-lift-place sequence to earn the single +1 is vanishingly small — so the arm essentially never sees a reward, gets no gradient, and never starts learning. Correct goal, but with no path to it; sparsity kills it." },
            { label: "Reward raw motor velocity", feedback: "this rewards a proxy that has nothing to do with success. The policy will discover it can maximize velocity reward by whipping the joints around as fast as possible while never actually placing a part — high reward, zero task completion. It's the textbook misspecified objective: you get exactly what you measured, which here is fast meaningless motion." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Collect / simulate experience",
        narrative: `<p>An RL policy learns from <b>experience</b> — transitions of (state, action, reward, next-state) it collects by acting. But early RL actions are nearly random, and random actions on a real arm mean collisions and broken parts before any learning happens. So you generate experience in <b>MuJoCo</b> (via Gymnasium's vectorized envs) first — the same simulator that backs FetchPickAndPlace and RoboSuite — and apply <b>domain randomization</b> (varying friction, mass, object pose) so the policy learns a robust skill instead of overfitting one exact setup. Reality comes later, once the policy is competent. In FetchPickAndPlace the action is a 4-vector (3 gripper-displacement components + 1 gripper open/close) and the observation is a 25-dim state plus the goal.</p>`,
        concepts: ["ai-mdp", "ai-q-learning"],
        insight: `<b>Sim is cheap, safe, and parallel.</b> 64 parallel MuJoCo envs collect <b>5.0M transitions in 22 minutes</b> — a volume that would take months and a graveyard of broken parts on real hardware. Crucially, on FetchPickAndPlace's sparse reward a <b>random policy succeeds only ~1.8%</b> of the time, which is exactly why you can't start on the real arm: the first millions of actions are mostly failures you don't want happening physically. Domain randomization over friction/mass/pose means the policy can't memorize one setup, so it transfers better later.`,
        data: {
          caption: "Example MuJoCo transitions (FetchPickAndPlace, the RL training data)",
          columns: ["state $s$ (25-dim)", "action $a$ (4-vec)", "reward $r$", "next-state $s'$"],
          rows: [
            ["gripper above block, open", "[Δx,Δy,Δz, close]", "−1 (sparse: not at goal)", "block held"],
            ["block held, mid-air", "[Δ toward target, hold]", "−1 (not at goal)", "block over target"],
            ["block at target ≤5cm", "[hold, open]", "0 (success)", "block placed"],
            ["block held, tilted", "[jerk up, hold]", "−1 (dropped)", "block on table"]
          ],
          note: `Each row is one MDP transition $(s,a,r,s')$ — the atomic unit RL learns from. The action is FetchPickAndPlace's 4-vector (3 Cartesian gripper displacements + 1 open/close); the state is the 25-dim observation (gripper + block pose/velocity) plus the desired goal. Domain randomization perturbs the physics each episode (friction $\\mu\\sim U(0.4,1.2)$, part mass $\\times U(0.7,1.3)$, object pose $\\pm$2cm/$\\pm$15°, lighting/camera noise) so the policy learns a skill robust across the whole range — the basis of sim-to-real transfer.`
        },
        symbols: [
          { sym: "transition $(s,a,r,s')$", desc: "one experience tuple: state, action taken, reward received, resulting next state — the data RL trains on." },
          { sym: "domain randomization", desc: "sampling sim physics from a range each episode (friction $\\mu\\sim U(0.4,1.2)$, mass $\\times U(0.7,1.3)$, pose $\\pm$2cm/$\\pm$15°, lighting) so the policy learns one skill robust across setups; the real arm's true physics falls inside the trained range, which is how the policy transfers." },
          { sym: "rollout", desc: "a trajectory of transitions produced by running the current policy in an environment for an episode." }
        ],
        steps: [
          { type: "decide", prompt: "Where should the policy gather its early experience?",
            options: [
              { label: "In a fast physics simulator with randomized object poses and dynamics", best: true, feedback: "sim is the only practical place to gather early experience. It yields millions of cheap, perfectly safe trials (5M transitions in 22 min here), and because a random policy succeeds just 1.8% of the time, almost all of that early experience is failure you absolutely don't want on real hardware. Domain randomization over friction, mass, and pose stops the policy from overfitting one exact rig, so what it learns survives the transfer to reality. Learn in sim, deploy to the real arm later." },
              { label: "On the real arm from the very first random action", feedback: "early RL is essentially random search, and at 1.8% random success that means the arm spends its first millions of actions colliding, dropping parts, and stressing joints — destroying hardware before it learns anything. Real-world trials are also far too slow to gather the millions of transitions RL needs. You'd pay enormous time and repair cost for experience sim provides safely and instantly." },
              { label: "From a single recorded human demo, replayed forever", feedback: "one demonstration is a single trajectory through state space, but an RL policy will visit countless states that demo never touches — and the moment it deviates, a replay has no idea how to recover. You can't learn a robust closed-loop controller from one open-loop path; it covers neither the variety nor the recovery behavior the task requires." }
            ] },
          { type: "run", label: "▶ Spin up sim & collect rollouts", prompt: "Launch parallel simulators with domain randomization.",
            result: { log: "launching 64 parallel MuJoCo envs (Gymnasium FetchPickAndPlace)...\naction 4-vec [dx,dy,dz,grip]; obs 25-dim + goal; sparse reward {-1,0}\ndomain randomization per episode: friction mu~U(0.4,1.2), mass xU(0.7,1.3),\n  object pose +-2cm/+-15deg, lighting + camera noise\ncollected 5.0M transitions in 22 min\nsuccess under random policy: 1.8%", metrics: [{ k: "transitions", v: "5.0M" }, { k: "sim envs", v: "64" }, { k: "random success", v: "1.8%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Inspect the state space",
        narrative: `<p>Before committing to a long training run, profile the <i>rollouts</i>: which states the arm actually visits, how reward accrues, and where episodes end. This is where <b>reward bugs</b> and <b>coverage holes</b> surface cheaply. (On sparse FetchPickAndPlace the standard remedy for the coverage hole is <b>Hindsight Experience Replay</b>, which relabels failed rollouts as successes for the goal actually reached — but that only works once you've confirmed the reward itself isn't gameable.) The classic bug is <b>reward hacking</b> — the policy farms the shaping term without doing the task — and catching it now saves you from training a perfectly-optimized useless policy.</p>`,
        concepts: ["ai-mdp", "mlx-error-analysis"],
        insight: `<b>Reward hacking caught early.</b> The profile shows the arm learned to <b>hover near the goal to farm the shaping reward without ever placing</b> — high reward, zero task success, the unmistakable signature of a misspecified reward. Two more red flags: the far-left bin is reached in only <b>2% of episodes</b> (a coverage hole), and episodes <b>hit the max-steps cap 61% of the time</b> (the policy is stalling, not finishing). All three are diagnosable from rollouts in minutes, versus discovering them after a multi-hour training run.`,
        data: {
          caption: "Rollout profile (red flags found)",
          columns: ["observation", "value", "what it means"],
          rows: [
            ["hovers near goal, no placement", "detected", "reward hacking — proxy gamed"],
            ["far-left bin reached", "2% of episodes", "state-coverage hole"],
            ["episodes hitting max-steps cap", "61%", "policy stalls, doesn't finish"],
            ["reward histogram", "spike at −0.5", "time penalty dominates early"]
          ],
          note: `Reward hacking = maximizing the proxy (shaping term) instead of the true goal (placement). It produces high reward with low task success — the tell to watch for.`
        },
        symbols: [
          { sym: "reward hacking", desc: "the policy exploiting a shaping term to earn reward without achieving the real objective (hovering to farm reward)." },
          { sym: "state coverage", desc: "which regions of state space the policy actually visits; gaps (far-left bin at 2%) reveal under-explored areas." },
          { sym: "max-steps cap", desc: "the per-episode step limit; hitting it often (61%) signals the policy stalls instead of completing the task." }
        ],
        steps: [
          { type: "run", label: "▶ Profile rollouts", result: { log: "state coverage: gripper rarely reaches far-left bin (2% of episodes)\nreward histogram: spike at -0.5 (time penalty dominates early)\ndetected reward exploit: arm hovers near goal to farm shaping reward\nepisode length: hits max-steps cap 61% of the time", metrics: [{ k: "reward hacks", v: "1 found" }, { k: "timeouts", v: "61%" }] } },
          { type: "decide", prompt: "The arm 'hovers near the goal' to farm shaping reward without placing. What is this?",
            options: [
              { label: "Reward hacking — the shaping term is exploitable and must be fixed", best: true, feedback: "exactly — this is textbook reward hacking. The policy found that proximity to the goal pays out shaping reward, so it maximizes that proxy by hovering instead of doing the harder, more valuable thing: actually placing the part. The fix is to make reward flow only on genuine progress (e.g. reward placement completion, not mere proximity), removing the exploit. RL optimizes whatever you literally wrote down, so a gameable shaping term will always get gamed." },
              { label: "Good behavior — it's getting reward", feedback: "high reward is not the goal — task success is, and here it's zero placements. The arm is optimizing the number you specified (proximity shaping) rather than the outcome you wanted, which is the definition of a misspecified reward. Calling this 'good' confuses the proxy for the objective; the whole point of profiling rollouts is to catch exactly this gap between reward earned and task accomplished." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Design the state features",
        narrative: `<p>The policy is only as good as what it can observe — the <b>state representation</b> is its entire window onto the world. A good state has two properties: it's <i>informative</i> (it contains what's needed to act) and it's <i>available on the real robot</i> (you can actually measure it at deploy time). A subtle but powerful choice is encoding object pose <b>relative to the gripper</b> rather than in absolute world coordinates: relative pose makes the same learned behavior work wherever the part is.</p>`,
        concepts: ["ai-mdp", "ai-policy-value", "la-jacobian"],
        insight: `<b>Relative pose is the generalization trick.</b> If the state gives object pose <i>relative to the gripper</i>, then "object is 5cm forward and 2cm right of me, close gripper" is one reusable skill — it transfers to every part location. Absolute world coordinates would force the policy to relearn the motion at each spot. The chosen state (joint angles/velocities, gripper pose, relative object pose) is also <b>directly measurable</b> on the real arm via encoders and the vision system, so nothing in it becomes unavailable at deployment.`,
        data: {
          caption: "State representation: what's in the observation vector",
          columns: ["feature", "dim", "source on real arm", "why it helps"],
          rows: [
            ["joint angles", "7", "encoders", "arm configuration"],
            ["joint velocities", "7", "encoders", "dynamics / motion"],
            ["gripper pose", "6", "forward kinematics", "where the hand is"],
            ["object pose (rel. to gripper)", "6", "vision system", "what to grasp; generalizes"]
          ],
          note: `This mirrors the FetchPickAndPlace 25-dim observation, which encodes object position/rotation/velocity <i>relative to the gripper</i> exactly so one policy handles all part locations. Relative object pose = object_pose ⊖ gripper_pose. Mapping joint motion to gripper motion uses the arm's Jacobian.`
        },
        symbols: [
          { sym: "state representation", desc: "the observation vector the policy sees each step; must be both informative and measurable on real hardware." },
          { sym: "relative object pose", desc: "object position/orientation expressed in the gripper's frame; lets one learned skill work at any part location." },
          { sym: "Jacobian", desc: "the matrix relating joint velocities to end-effector (gripper) velocity; links joint-space state to task-space motion." }
        ],
        steps: [{
          type: "decide", prompt: "Which state representation should the policy use?",
          options: [
            { label: "Joint angles/velocities, gripper pose, and object pose relative to the gripper", best: true, feedback: "this is informative, compact, and deployable. Joint angles/velocities and gripper pose tell the policy the arm's configuration and motion (all readable from encoders and forward kinematics), and expressing object pose relative to the gripper is the key move — it turns 'reach the part' into one location-independent skill that generalizes across every placement. Every feature is measurable on the real arm, so nothing the policy depends on vanishes at deploy time." },
            { label: "Absolute world coordinates only, with no object info", feedback: "the fatal flaw is the missing object pose — without it the policy literally cannot see the thing it's supposed to pick, so it's grasping blind. And absolute coordinates (even with the object) make the policy memorize behavior per world location instead of learning one relative skill, hurting generalization. You've removed the most important feature and chosen a frame that generalizes poorly." },
            { label: "Raw motor current readings alone", feedback: "motor currents are a weak, indirect signal — they relate to torque and load but barely constrain where the gripper or object actually are in space. The policy can't reconstruct the task state (positions, the object to grasp) from current alone, so it's effectively blind to the geometry of the problem. The state must capture the spatial configuration the task is about." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Choose the RL algorithm",
        narrative: `<p>The arm is driven by <b>continuous joint torques</b>, so the action space is continuous — a real-valued vector, not a small menu of discrete moves. That single fact rules out whole families of RL: you can't tabulate a continuous space, and a stateless bandit can't handle a multi-step sequence. The fit is an <b>actor-critic policy-gradient</b> method (e.g. PPO (Proximal Policy Optimization)): the <i>actor</i> outputs continuous actions directly, the <i>critic</i> estimates value to reduce variance, and a clipped update keeps training stable.</p>`,
        concepts: ["mod-actor-critic", "mod-policy-gradient", "ai-q-learning"],
        insight: `<b>Continuous actions pick the algorithm.</b> Tabular Q-learning needs a finite table of states × actions, but a continuous torque vector has <b>infinitely many actions</b>, so the table can't exist (and discretizing finely explodes combinatorially). A bandit ignores state entirely, yet grasp-and-place is sequential — the right action depends on where you are in the motion. An actor-critic policy gradient handles both: the actor maps state to a continuous action directly, and the critic supplies the <b>advantage</b> $A_t = G_t - V(s_t)$ — how much better an action did than the critic's baseline — so the gradient pushes up actions with $A_t&gt;0$ and down those with $A_t&lt;0$, with far less variance than using raw return. PPO then bounds each step: it forms the probability ratio $r_t = \\pi_{\\text{new}}(a_t\\mid s_t)/\\pi_{\\text{old}}(a_t\\mid s_t)$ and optimizes $\\min(r_t A_t,\\ \\text{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t)$, so a single update can never move the policy more than $\\pm\\epsilon$ (≈0.2) — the clip is what prevents the destabilizing jumps that plague vanilla policy gradients.`,
        data: {
          caption: "RL method vs the continuous, sequential task",
          columns: ["method", "continuous actions?", "uses state/sequence?", "stable?"],
          rows: [
            ["actor-critic PG (PPO)", "yes (actor outputs reals)", "yes", "yes (clipped)"],
            ["tabular Q-learning", "no (table explodes)", "yes", "n/a"],
            ["stateless bandit", "n/a", "no (ignores state)", "n/a"]
          ],
          note: `Actor = policy network mapping state→continuous action; critic estimates $V(s)$ to form the advantage $A_t=G_t-V(s_t)$, which lowers gradient variance. PPO's clipped objective $\\min(r_t A_t,\\ \\text{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t)$ caps each update at $\\pm\\epsilon$ — the key to stable continuous control.`
        },
        symbols: [
          { sym: "continuous action space", desc: "actions are real-valued vectors (joint torques), not a finite set; rules out tabular methods." },
          { sym: "actor-critic", desc: "an actor network that chooses actions plus a critic network that estimates value $V(s)$ to reduce the gradient's variance." },
          { sym: "advantage $A_t$", desc: "$A_t=G_t-V(s_t)$: how much more return an action earned than the critic's baseline; positive advantage pushes the action's probability up, negative pushes it down." },
          { sym: "policy gradient (PPO)", desc: "optimizes the policy by ascending $\\min(r_t A_t,\\ \\text{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t)$ where $r_t=\\pi_{\\text{new}}/\\pi_{\\text{old}}$; the clip bounds each update to $\\pm\\epsilon$ for stability." },
          { sym: "bandit", desc: "a stateless one-shot decision problem; can't model the multi-step, state-dependent structure of control." }
        ],
        steps: [{
          type: "decide", prompt: "Which RL method fits continuous control?",
          options: [
            { label: "An actor-critic policy-gradient method (e.g. PPO) for stable continuous-action learning", best: true, feedback: "this is the workhorse for continuous robot control for three matching reasons: the actor outputs a continuous torque vector directly (no discretization), the critic's value estimate cuts the gradient variance that otherwise makes policy gradients noisy, and PPO's clipped update bounds how far the policy moves per step, which is what keeps training stable on a high-dimensional control problem. Continuous + sequential + needs-stability all point here." },
            { label: "Tabular Q-learning over the raw continuous state", feedback: "tabular Q-learning stores a value for every (state, action) cell, but a continuous state and continuous torque action have infinitely many cells — the table can't be built, and discretizing it finely enough blows up combinatorially. Tables are for small discrete MDPs; they simply don't scale to continuous control, which is why function-approximation methods exist." },
            { label: "A bandit that ignores state entirely", feedback: "a bandit treats each decision as independent and stateless, but grasp-and-place is inherently sequential — whether you should close the gripper depends on whether you've already reached the part. Ignoring state throws away the entire structure of the task, so a bandit can't plan the multi-step motion. Control needs a state-dependent, sequential method." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the policy (RL)",
        narrative: `<p>You optimize the policy by <b>gradient ascent on the clipped PPO objective</b>: collect rollouts, compute each step's return $G_t=\\sum_k \\gamma^k r_{t+k}$ and advantage $A_t=G_t-V(s_t)$, then nudge the actor up on positive-advantage actions and down on negative ones — but only within the clip range $1\\pm\\epsilon$ so no single update destabilizes the policy. You watch three signals together: success rate (the real goal), mean return (the optimized quantity), and the critic's value loss (training health). A healthy run shows success and return climbing together while value loss stays stable and policy entropy <i>anneals</i> (exploration decreasing as the policy commits to a good strategy).</p>`,
        concepts: ["ml-gradient-descent", "mod-actor-critic", "ai-q-learning"],
        insight: `<b>Success and return rise together — that's a well-shaped reward.</b> Success climbs <b>31% → 74% → 89%</b> as mean return climbs <b>4.1 → 12.8 → 15.2</b>, and they track each other, confirming the reward is aligned (more return really means more placements, not more hacking). Return <b>plateaus at step 16M</b>, the signal to stop. Meanwhile entropy annealing means the policy is exploring less and exploiting its learned grasp more, and a <b>stable value loss</b> says the critic is keeping up — no divergence.`,
        data: {
          caption: "PPO training progression",
          columns: ["step", "success", "mean return", "health"],
          rows: [
            ["2M", "31%", "4.1", "early, exploring"],
            ["8M", "74%", "12.8", "improving"],
            ["16M", "89%", "15.2", "return plateaued → stop"],
            ["—", "—", "—", "entropy annealed, value loss stable"]
          ],
          note: `Return $G_t=\\sum_k \\gamma^k r_{t+k}$ is what PPO maximizes; success rate is the true goal. Their tracking confirms alignment. Plateau + stable value loss = converged and healthy.`
        },
        symbols: [
          { sym: "expected return $G_t$", desc: "$G_t=\\sum_k \\gamma^k r_{t+k}$, the discounted cumulative future reward the policy maximizes ($\\gamma$ discount, $r$ reward)." },
          { sym: "mean return", desc: "average $G_t$ over rollouts; the quantity training optimizes, tracked against true success rate." },
          { sym: "value loss", desc: "the critic's prediction error on returns; staying stable indicates healthy, non-diverging training." },
          { sym: "entropy annealing", desc: "the policy's action randomness decreasing over training as it shifts from exploring to exploiting a good strategy." }
        ],
        steps: [{
          type: "run", label: "▶ Train PPO policy in sim",
          result: { log: "training PPO (64 envs, clip eps=0.2, gamma=0.99)...\nper step: G_t = sum gamma^k r ; A_t = G_t - V(s_t)\nupdate = min(r_t*A_t, clip(r_t,0.8,1.2)*A_t)  (ratio r_t = pi_new/pi_old)\nstep 2M   success 31%  mean return  4.1  mean |A_t| 2.3\nstep 8M   success 74%  mean return 12.8  mean |A_t| 0.9\nstep 16M  success 89%  mean return 15.2  (return plateaued, |A_t|->0.2)\npolicy entropy annealed; value loss stable", metrics: [{ k: "sim success", v: "89%" }, { k: "mean return", v: "15.2" }], chart: { type: "line", title: "PPO training: success rate and return rise together (in millions of steps)", xlabel: "step (M)", series: [{ name: "success rate (%)", color: "#7ee787", points: [[2, 31], [8, 74], [16, 89]] }, { name: "mean return", color: "#4ea1ff", points: [[2, 4.1], [8, 12.8], [16, 15.2]] }] } } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate in simulation",
        narrative: `<p>Evaluate on <b>held-out</b> object poses and randomized dynamics the policy never trained on — that's how you tell a robust skill from a memorized one. And don't trust the average: slice success by condition (object friction, bin location), because an average return can look healthy while a specific slice is brittle. The slices you're weak on predict exactly where the real cell will drop parts.</p>`,
        concepts: ["mlx-error-analysis", "ai-policy-value", "mlx-cross-validation"],
        insight: `<b>The average hides a brittle slice.</b> Overall success is a healthy <b>86%</b>, but on <b>low-friction (slippery) objects it collapses to 58%</b>, and far-left bin placements sit at 64%. Slippery parts are common in the real cell, so a 28-point gap there means frequent real-world drops the headline number conceals. Slicing the evaluation is what turns "86%, ship it" into "86% overall but a known slippery-grip failure to fix first" — the difference between a metric and an understanding.`,
        data: {
          caption: "Held-out evaluation, sliced by condition",
          columns: ["slice", "success", "share in real cell", "reading"],
          rows: [
            ["overall", "86%", "—", "looks fine"],
            ["slippery (low-friction)", "58% ⚠", "common", "real failure mode"],
            ["far-left bin", "64%", "occasional", "coverage-related"],
            ["placement force", "gentle (in limit)", "—", "safe, good"]
          ],
          note: `Held-out poses test generalization, not memorization. The slippery slice at 58% is the actionable finding — averages drown out minority conditions that still matter in practice.`
        },
        symbols: [
          { sym: "held-out evaluation", desc: "testing on object poses/dynamics excluded from training to measure true generalization." },
          { sym: "sliced metric", desc: "success rate broken down by condition (friction, bin location) so a weak slice can't hide in the average." },
          { sym: "low-friction / slippery", desc: "the brittle slice (58%); the policy grips too lightly for parts with low surface friction." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate on held-out poses", result: { log: "eval over 5,000 held-out episodes...\noverall success 86%\nslippery (low-friction) objects: success 58%  (weak)\nfar-left bin placements: success 64%\nmean placement force: gentle (within limit)", metrics: [{ k: "success", v: "86%" }, { k: "low-friction", v: "58% ⚠" }], chart: { type: "bars", title: "Success rate by slice (slippery parts are brittle)", labels: ["overall", "slippery", "far-left bin"], values: [86, 58, 64], colors: ["#7ee787", "#ff7b72", "#ffb454"] } } },
          { type: "decide", prompt: "Overall success is 86% but low-friction objects sit at 58%. What does this say?",
            options: [
              { label: "The policy is brittle on slippery objects — a real failure mode the average masks", best: true, feedback: "right — the 86% average is dominated by the easy high-friction parts and drowns out the slippery slice sitting at 58%. Since slippery parts show up often in the real cell, that 28-point gap translates to frequent real-world drops the headline number never reveals. Slicing the metric by condition is what surfaces the actual failure mode, so you can fix the grip before it ships rather than discovering it on the line." },
              { label: "Nothing — 86% overall is all that counts", feedback: "this trusts an average that's actively hiding a problem. The real cell handles slippery parts regularly, and a 58% success there means roughly four in ten of those picks fail — a serious, frequent fault that '86% overall' papers over. An aggregate is never the whole story when the slices differ this much; the weak slice is precisely what evaluation exists to find." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Iterate (reward shaping)",
        narrative: `<p>Error analysis says slippery objects fail because the policy grips too lightly — it was never <i>rewarded</i> for secure grip, and it rarely <i>saw</i> low-friction parts. So you iterate on the two things that cause behavior in RL: the <b>reward</b> (add a grip-security term) and the <b>training distribution</b> (widen friction randomization toward slippery values). The tempting non-fixes — scaling the reward, training longer — change neither cause.</p>`,
        concepts: ["mlx-error-analysis", "ai-mdp", "ai-policy-value"],
        insight: `<b>To get a behavior, you must reward it and sample it.</b> The policy grips lightly because nothing penalized a loose grip and slippery parts were under-represented in training. Adding a <b>grip-security shaping term</b> makes secure grip pay off, and <b>widening friction randomization</b> toward slippery values gives the policy enough slippery episodes to learn from. Contrast the false fixes: <b>multiplying the whole reward by 10 leaves the optimal policy identical</b> (uniform scaling cancels), and 5× more steps on the same distribution just re-optimizes the same un-rewarded behavior.`,
        data: {
          caption: "Why each candidate does or doesn't fix slippery grip",
          columns: ["change", "rewards secure grip?", "samples slippery parts?", "fixes it?"],
          rows: [
            ["grip-security term + wider friction RNG", "yes", "yes", "yes (best)"],
            ["multiply reward ×10", "no (same optimum)", "no", "no"],
            ["train 5× longer, same setup", "no", "no", "no"]
          ],
          note: `RL behavior is shaped by what the reward pays for AND what the training distribution contains. The fix must change at least one; the rejected options change neither. Scaling reward uniformly leaves $\\arg\\max$ unchanged.`
        },
        symbols: [
          { sym: "grip-security shaping term", desc: "an added reward component that pays the policy for a secure (non-slipping) grasp, encouraging firmer grip on slippery parts." },
          { sym: "domain randomization range", desc: "the span of physics parameters sampled in sim; widening it toward low friction supplies the missing slippery episodes." },
          { sym: "reward scale invariance", desc: "multiplying all rewards by a constant doesn't change the optimal policy — so uniform scaling can't fix a behavior gap." }
        ],
        steps: [{
          type: "decide", prompt: "Best way to fix the low-friction failures?",
          options: [
            { label: "Add a grip-security shaping term, widen friction randomization toward slippery values, and retrain", best: true, feedback: "this targets both root causes at once. The grip-security shaping term makes a firm, non-slipping grasp actually pay off, giving the policy a reason to grip slippery parts harder; and widening the friction randomization range puts many more low-friction episodes into training, so the policy gets enough slippery experience to learn from. Change the reward AND the data distribution — the two levers that produce behavior in RL." },
            { label: "Multiply the entire reward by 10", feedback: "uniform scaling is a no-op on the optimal policy: if you multiply every reward by the same constant, the action that was best before is still best, because their ordering is unchanged. So the policy converges to exactly the same light-grip behavior, just with bigger numbers. This doesn't add any new incentive for secure grip — it changes the scale, not the shape, of the objective." },
            { label: "Just run training 5x longer with the same setup", feedback: "more steps only let the policy optimize harder against the same reward and the same distribution — but the reward never rewards secure grip and the distribution barely contains slippery parts, so there's no new behavior to converge toward. You'd burn compute re-finding the policy you already have. Fix the signal and the sampling, not the duration." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy with safety limits",
        narrative: `<p>A learned policy commanding a real arm can hit people or machines, and you can never fully trust a neural net's outputs — so deployment wraps the policy in <b>hard safety limits the policy cannot override</b>. A safety envelope (torque, velocity, workspace bounds) plus a watchdog and e-stop (emergency stop) bound the worst case <i>outside</i> the learned controller. You also ramp speed up gradually after sim-to-real validation, so the inevitable reality gap surfaces at low, recoverable speeds first.</p>`,
        concepts: ["ai-mdp", "mod-actor-critic"],
        insight: `<b>The safety layer sits outside the policy.</b> The real arm hits <b>79% success vs 86% in sim</b> — the expected sim-to-real gap — but <b>0 safety stops</b>, because the torque/velocity/workspace envelope catches any unsafe command before the hardware executes it, no matter what the network outputs. Ramping to 60% speed only <b>after 200 clean picks</b> means a sim-to-real surprise would first appear as a low-speed, recoverable error rather than a high-energy collision. Hard limits make the worst case bounded even when the policy is wrong.`,
        data: {
          caption: "Safety envelope (limits the policy cannot exceed)",
          columns: ["guard", "bounds", "purpose"],
          rows: [
            ["torque limit", "≤ rated joint torque", "prevent damaging force"],
            ["velocity limit", "≤ safe joint speed", "limit collision energy"],
            ["workspace limit", "inside allowed volume", "keep arm away from people"],
            ["watchdog + e-stop", "halt on fault/timeout", "guaranteed safe stop"],
            ["speed ramp", "→ 60% after 200 clean picks", "surface gap at low speed"]
          ],
          note: `These guards are enforced by the controller, not learned — the policy proposes an action, the envelope clips or vetoes it. Sim-to-real gap (86%→79%) is expected; the envelope keeps it from becoming dangerous.`
        },
        symbols: [
          { sym: "safety envelope", desc: "hard torque/velocity/workspace limits enforced outside the policy; the network's actions are clipped to stay inside them." },
          { sym: "watchdog / e-stop", desc: "a monitor that halts the arm to a safe state on fault or timeout; the last-resort guaranteed stop." },
          { sym: "speed ramp", desc: "gradually raising the arm's speed after clean runs, so sim-to-real surprises appear at low, recoverable energy first." }
        ],
        steps: [
          { type: "decide", prompt: "How do you put the policy on the real arm safely?",
            options: [
              { label: "Run it inside torque/velocity/workspace limits with a watchdog and e-stop, ramping speed up gradually after sim-to-real validation", best: true, feedback: "this bounds the worst case independently of the policy. Torque, velocity, and workspace limits enforced by the controller mean that even if the network commands something dangerous, the hardware physically can't execute it; the watchdog and e-stop guarantee a safe halt on any fault. Ramping speed only after clean picks lets the sim-to-real gap reveal itself at low, recoverable energy. You never trust the learned policy alone for safety — you put guaranteed limits around it." },
              { label: "Deploy at full speed with no limits — the policy was safe in sim", feedback: "'safe in sim' doesn't transfer — you measured the gap yourself (86% sim vs 79% real), and an unconstrained learned policy can output torques the simulator never penalized into a real environment with real people and machines. Running at full speed with no envelope means the first sim-to-real surprise becomes a high-energy collision with no backstop. Hardware safety must come from guaranteed limits outside the policy, not from trusting the network." }
            ] },
          { type: "run", label: "▶ Deploy to real arm (limited speed)", result: { log: "loading policy onto real controller...\nsafety envelope: torque/velocity/workspace limits + watchdog armed\nsim-to-real: real success 79% vs 86% sim (gap as expected)\nramping to 60% max speed after 200 clean picks\nlive (limited).", metrics: [{ k: "real success", v: "79%" }, { k: "safety stops", v: "0" }], chart: { type: "bars", title: "Sim vs real success (the sim-to-real gap)", labels: ["sim", "real arm"], values: [86, 79], valueLabels: ["86%", "79%"], colors: ["#4ea1ff", "#ffb454"] } } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps, Machine Learning Operations)",
        narrative: `<p>The physical world degrades the policy even if the model is frozen: gripper pads wear, part suppliers change, lighting shifts. So you monitor <b>outcomes</b> (real success, drop/retry counts), <b>safety</b> (envelope trips), <b>throughput</b> (cycle time), and <b>input drift</b> (new part variants outside the training distribution) — and you auto-log every failure so it can be replayed in sim and retrained. A control policy decays silently unless these signals are watched.</p>`,
        concepts: ["prob-clt", "mlx-error-analysis", "ai-policy-value"],
        insight: `<b>Hardware wear masquerades as a model problem.</b> The drop rate climbed <b>3% → 11% over 9 days</b> — not because the policy changed, but because the <b>gripper pad physically wore down</b>; the fix is a pad swap, not a retrain. Separately, a <b>new part variant outside the training distribution</b> is input drift that <i>does</i> need data: log it, add it to sim, retrain. Safety-limit trips stayed at <b>0</b>, confirming the envelope held throughout. A gradual 3%→11% rise is a clear trend above day-to-day noise, which is why the monitor catches it before it becomes a line stoppage.`,
        data: {
          caption: "This week's robot monitors",
          columns: ["signal", "type", "reading", "fix"],
          rows: [
            ["drop rate", "outcome", "3% → 11% over 9d", "replace worn pad (hardware)"],
            ["new part variant", "input drift", "outside train dist", "log → sim → retrain"],
            ["safety-limit trips", "safety", "0", "envelope holding ✓"],
            ["cycle time", "throughput", "stable", "—"]
          ],
          note: `Two different root causes: a hardware fault (pad wear → mechanical fix) and a data drift (new variant → retrain). Monitoring distinguishes them so you apply the right fix to each.`
        },
        symbols: [
          { sym: "drop rate", desc: "fraction of picks where the part is dropped; the primary outcome health metric for the arm." },
          { sym: "state-distribution drift", desc: "live observations (a new part variant) falling outside the training distribution; needs new data, not a hardware fix." },
          { sym: "safety-limit trip", desc: "an event where the safety envelope vetoed an action; staying at 0 confirms the guards hold and the policy stays in-bounds." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor on the deployed arm?",
            options: [
              { label: "Real success rate, drop/retry counts, safety-limit trips, cycle time, and state-distribution drift — with alerts and auto-logged failures", best: true, feedback: "this covers every layer that can fail independently: outcomes (success and drop rate are the real task health), safety (envelope trips show whether the policy is staying in-bounds), throughput (cycle time catches slowdowns), and input drift (new part variants signal the world has moved off the training distribution). Auto-logging failures feeds them straight back into sim and the next training round. And it lets you tell a hardware fault (worn pad) apart from a data drift (new variant) so you apply the right fix — that's robotics MLOps." },
              { label: "Only the total number of parts attempted", feedback: "attempt count is blind to everything that matters. The arm kept attempting parts at a normal rate this week while its drop rate quietly tripled from 3% to 11% and a new part variant appeared — none of which shows up in 'parts attempted.' You'd miss a real decline and a safety-relevant drift entirely. You have to monitor outcomes and drift, not just activity." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "gripper pad wear detected -> drop rate 3% -> 11% over 9 days\nsafety-limit trips: 0 (envelope holding)\nstate drift: new part variant outside training distribution\naction: replace pad, log new variant, add it to sim and retrain policy", metrics: [{ k: "drop rate", v: "11% ⚠" }, { k: "safety trips", v: "0" }], chart: { type: "line", title: "Drop rate climbing as gripper pad wears (over 9 days)", xlabel: "day", ylabel: "drop rate (%)", series: [{ name: "drop rate %", color: "#ff7b72", points: [[1, 3], [3, 5], [5, 7], [7, 9], [9, 11]] }] } }, note: `Monitoring caught gripper wear and a new part variant — both get fed back into simulation and a retrain, returning to the <b>Data</b> stage. The control loop and the ML loop both keep running.` }
        ]
      }
    ]
  }
});
