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
        narrative: `<p>A retailer wants cameras to spot empty shelves. Each frame can hold many products, so you must <i>locate</i> every item, not just label the whole image. Decide what task this really is.</p>`,
        concepts: ["dl-object-detection", "ml-classification-metrics"],
        steps: [{
          type: "decide", prompt: "Whole-image classification or object detection?",
          options: [
            { label: "Image classification — one label per frame", feedback: "a frame has dozens of products at once. One label can't tell you which slot is empty or where each item sits." },
            { label: "Object detection — a box + class for every product", best: true, feedback: "detection gives a bounding box and class per item, so you can count stock and find gaps. Evaluate it with IoU and mAP later." },
            { label: "Pixel regression of brightness", feedback: "that's not a recognition task at all; it ignores the actual goal of finding products." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labeled images",
        narrative: `<p>Detection needs <i>boxed</i> labels, which are expensive. You pull store footage and send it for annotation.</p>`,
        concepts: ["ml-supervised", "dl-object-detection"],
        steps: [
          { type: "decide", prompt: "How do you get reliable box labels?",
            options: [
              { label: "Have trained annotators draw boxes, with a second pass for quality review", best: true, feedback: "human boxes with double-review give clean ground truth. Slow, but detection lives or dies on label quality." },
              { label: "Auto-label with an off-the-shelf detector and ship it", feedback: "you'd inherit that model's mistakes and blind spots, then train on its errors." },
              { label: "Use the whole image as one big box", feedback: "that destroys all location info — the model can't learn where individual products are." }
            ] },
          { type: "run", label: "▶ Pull & annotate frames", prompt: "Sample frames across stores, lighting, and times of day.",
            result: { log: "sampled 24,000 frames from 38 stores\nannotated boxes: 511,402  (avg 21.3 per frame)\nclasses: 60 product types\nflagged 4.2% frames as blurry -> sent to re-shoot", metrics: [{ k: "frames", v: "24k" }, { k: "boxes", v: "511k" }, { k: "classes", v: "60" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & clean",
        narrative: `<p>Look before you train. Detection datasets hide class imbalance and tiny-object problems.</p>`,
        concepts: ["mlx-error-analysis", "ml-classification-metrics"],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "class counts: top class 41,800 boxes, rarest class 190\nbox sizes: 23% of boxes are &lt;32px (small objects)\nlighting: 3 stores are very dark (under-exposed)\nduplicate frames found: 1,108 (same camera, 1s apart)", metrics: [{ k: "imbalance", v: "220:1" }, { k: "tiny boxes", v: "23%" }] } },
          { type: "decide", prompt: "23% of objects are smaller than 32px. What does that imply?",
            options: [
              { label: "Ignore it — small and large objects train the same", feedback: "small objects are the hardest case; pooling discards their detail. They need attention or they'll dominate your misses." },
              { label: "Keep input resolution high and add multi-scale features so small items survive downsampling", best: true, feedback: "right — tiny objects vanish after aggressive downsampling. Higher resolution and a feature pyramid preserve them." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Augment the data",
        narrative: `<p>Cameras see varied lighting, angles, and occlusion. Augmentation is how a CNN learns to ignore those nuisances instead of memorizing them.</p>`,
        concepts: ["dl-data-augmentation", "dl-conv"],
        steps: [{
          type: "decide", prompt: "Which augmentations fit shelf detection?",
          options: [
            { label: "Random brightness/contrast, horizontal flip, small crops and scale jitter", best: true, feedback: "these mimic real lighting and camera variation while keeping boxes valid. The model learns the product, not the lighting." },
            { label: "Vertical flips and 180° rotations", feedback: "upside-down shelves never occur in stores; you'd teach the model an impossible world and waste capacity." },
            { label: "No augmentation — the dataset is big enough", feedback: "even 24k frames won't cover every lighting/angle. Augmentation is the cheapest way to improve robustness." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick an architecture",
        narrative: `<p>It must run on in-store edge hardware at several frames per second. Choose a backbone with that constraint in mind.</p>`,
        concepts: ["dl-conv", "dl-object-detection", "mod-vit"],
        steps: [{
          type: "decide", prompt: "Choose a first detector.",
          options: [
            { label: "A single-stage CNN detector (YOLO-style) sized for edge inference", best: true, feedback: "single-stage detectors are fast and accurate enough for real-time edge use, and they predict boxes in one pass. Great starting point." },
            { label: "A huge Vision Transformer at full resolution", feedback: "accurate but far too heavy for an in-store camera. It would miss the real-time budget by a wide margin." },
            { label: "A two-stage detector tuned purely for max mAP", feedback: "higher accuracy but slower; on edge hardware it can't hit the frame rate. Maybe later if accuracy stalls." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the detector",
        narrative: `<p>Train the CNN with batch-norm for stable convergence and a detection loss that scores both box location and class. Watch validation mAP, not just training loss.</p>`,
        concepts: ["ml-gradient-descent", "dl-batchnorm", "dl-cross-entropy"],
        steps: [{
          type: "run", label: "▶ Train detector (50 epochs)",
          result: { log: "training single-stage detector...\nepoch 10  train loss 3.91  val mAP@0.5 0.512\nepoch 30  train loss 2.18  val mAP@0.5 0.671\nepoch 50  train loss 1.74  val mAP@0.5 0.708  (val plateaued, early stop armed)\nbest checkpoint: epoch 47", metrics: [{ k: "val mAP@0.5", v: "0.708" }, { k: "epochs", v: "47" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate with mAP & IoU",
        narrative: `<p>A box is "correct" only if it overlaps the truth enough. <b>IoU</b> (intersection over union) sets that bar, and <b>mAP</b> averages precision across classes and thresholds.</p>`,
        concepts: ["dl-object-detection", "ml-classification-metrics", "ml-roc-auc"],
        steps: [
          { type: "run", label: "▶ Evaluate on holdout stores", result: { log: "holdout: 6 unseen stores, 4,900 frames\nmAP@0.5      0.701\nmAP@0.5:0.95 0.448\nper-class: small/rare items recall 0.39 (weak)\nlatency on edge: 38 ms/frame (~26 fps)", metrics: [{ k: "mAP@0.5", v: "0.701" }, { k: "small recall", v: "0.39 ⚠" }, { k: "fps", v: "26" }] } },
          { type: "decide", prompt: "mAP looks fine but small/rare items have recall 0.39. What does that tell you?",
            options: [
              { label: "The headline mAP hides a real failure mode on small and rare classes", best: true, feedback: "exactly — an average can look healthy while a whole slice fails. Those misses are the empty-shelf cases that matter most." },
              { label: "Nothing — average mAP is the only number that matters", feedback: "the business cares about empty shelves, which are often small/rare items. A good average can mask the cases you most need." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Recall on small items is the bottleneck. You do error analysis on the misses to choose the right fix instead of guessing.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "dl-data-augmentation"],
        steps: [{
          type: "decide", prompt: "Best way to lift small-object recall?",
          options: [
            { label: "Increase input resolution, add a feature pyramid, and oversample frames with small/rare items", best: true, feedback: "this targets the actual failure: detail lost to downsampling plus too few rare examples. Direct fix from error analysis." },
            { label: "Just train for 200 more epochs", feedback: "training loss already plateaued; more epochs overfit without adding the missing detail or examples." },
            { label: "Lower the confidence threshold for every class", feedback: "that floods the output with false boxes everywhere to rescue a few; precision collapses. Fix the features, not the threshold." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy to edge cameras",
        narrative: `<p>The model must run on hundreds of in-store cameras with limited compute. How do you ship it?</p>`,
        concepts: ["dl-conv-hyperparams", "dl-object-detection"],
        steps: [
          { type: "decide", prompt: "How should the detector run in stores?",
            options: [
              { label: "Quantize the model and run it on-device per camera, rolling out to a few stores first", best: true, feedback: "on-device inference avoids streaming video to the cloud and keeps latency low; a staged rollout catches surprises before all stores get it." },
              { label: "Stream every camera's full video to a central GPU cluster", feedback: "that's huge bandwidth and cost, plus a single point of failure for hundreds of stores." }
            ] },
          { type: "run", label: "▶ Quantize & canary 5 stores", result: { log: "quantizing to int8...\nmAP@0.5 after quantization: 0.694 (-0.007, acceptable)\ncanary 5 stores: 27 fps, 0 crashes over 48h\npromoting to 40 stores...\nlive.", metrics: [{ k: "mAP after int8", v: "0.694" }, { k: "stores live", v: "40" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Stores re-light displays, repackage products, and add new SKUs. A frozen detector slowly drifts out of date.</p>`,
        concepts: ["prob-clt", "mlx-error-analysis", "ml-classification-metrics"],
        steps: [
          { type: "decide", prompt: "What should you watch in production?",
            options: [
              { label: "Detection-count drift per shelf, confidence distribution, latency/fps, and spot-audited precision from staff checks", best: true, feedback: "track inputs (scene drift), outputs (confidence shift), outcomes (audited precision), and health (fps). Alert on movement. That's MLOps." },
              { label: "Nothing — it passed evaluation in the lab", feedback: "stores change constantly; new packaging alone can tank a class. An unmonitored detector decays silently." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "store #19: avg detections/shelf dropped 31% (new shelf lighting installed)\nconfidence mean drifted -0.05 on 4 SKUs (repackaged)\nfps healthy: 26 avg\naction: collect fresh frames from changed stores, re-annotate, retrain", metrics: [{ k: "drifted SKUs", v: "4 ⚠" }, { k: "store #19", v: "-31%" }] }, note: `Monitoring caught new packaging and lighting drift, which triggers fresh labels and a retrain — back to the <b>Data</b> stage. That loop is the job.` }
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
        narrative: `<p>Disease is rare in the screened population (~$4\\%$ positive). A missed case can harm a patient; a false alarm wastes a scan and scares someone. Decide what "good" means before modeling.</p>`,
        concepts: ["ml-classification-metrics", "prob-bayes"],
        steps: [{
          type: "decide", prompt: "Which objective fits a rare, high-stakes diagnosis?",
          options: [
            { label: "Maximize accuracy", feedback: "calling everyone healthy is already ~96% accurate and catches zero disease. Accuracy is meaningless under this imbalance." },
            { label: "Target high sensitivity (catch sick patients) at an acceptable specificity, as a decision-support flag — not an autonomous diagnosis", best: true, feedback: "in screening, missing disease is the costly error. You hold sensitivity high while keeping false alarms tolerable, and keep a clinician in the loop." },
            { label: "Minimize mean-squared error on the pixels", feedback: "that's an image-reconstruction loss, unrelated to whether a patient has pneumonia." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather labeled scans",
        narrative: `<p>You collect X-rays from several hospitals. Labels and scanners differ across sites, which matters more than it looks.</p>`,
        concepts: ["ml-supervised", "dl-data-augmentation"],
        steps: [
          { type: "decide", prompt: "How do you label disease status?",
            options: [
              { label: "Use radiologist reports confirmed against follow-up outcomes, with multiple readers on hard cases", best: true, feedback: "expert reads plus outcome confirmation give trustworthy labels, and multi-reader consensus tames the cases doctors disagree on." },
              { label: "Use whatever keyword appears in the free-text report", feedback: "report phrasing is noisy and inconsistent across hospitals; you'd train on label noise, not disease." },
              { label: "Assume any scan from the pulmonology ward is positive", feedback: "ward location is not diagnosis; plenty of those patients are healthy, poisoning your labels." }
            ] },
          { type: "run", label: "▶ Pull multi-hospital scans", prompt: "Pull labeled X-rays across 5 hospitals.",
            result: { log: "loaded 61,200 chest X-rays from 5 hospitals\npositives (pneumonia): 2,510  (4.1%)\nscanner vendors: 3 distinct\nhospital E uses a different exposure protocol (brighter images)", metrics: [{ k: "scans", v: "61.2k" }, { k: "positive rate", v: "4.1%" }, { k: "hospitals", v: "5" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore & spot leakage",
        narrative: `<p>Medical datasets are full of shortcuts. A model can "cheat" by reading the scanner, not the lung.</p>`,
        concepts: ["mlx-error-analysis", "prob-variance"],
        steps: [
          { type: "run", label: "▶ Profile the dataset", result: { log: "class balance: 23.4:1 (neg:pos)\nhospital E: 71% of all positives come from this one site\nfound burned-in text marker correlated with label\nimage brightness differs by hospital (vendor protocol)", metrics: [{ k: "imbalance", v: "23:1" }, { k: "site skew", v: "hospital E" }] } },
          { type: "decide", prompt: "Most positives come from hospital E, whose scans look different. What's the risk?",
            options: [
              { label: "None — more positives from anywhere is good", feedback: "the model can learn 'this scanner = sick' instead of the disease, then collapse at every other hospital. That's spurious correlation, a shortcut." },
              { label: "The model may learn the hospital/scanner signature as a proxy for disease — a shortcut that won't transfer", best: true, feedback: "exactly. Strip burned-in markers, normalize brightness across vendors, and validate per-hospital so a scanner shortcut can't masquerade as skill." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Augment & normalize",
        narrative: `<p>Labeled scans are scarce and site-dependent. Careful augmentation and normalization expand the data <i>and</i> reduce the scanner shortcut.</p>`,
        concepts: ["dl-data-augmentation", "dl-conv", "ml-regularization"],
        steps: [{
          type: "decide", prompt: "Which preprocessing fits chest X-rays?",
          options: [
            { label: "Normalize intensity per vendor, small rotations/shifts, mild contrast jitter — and strip burned-in markers", best: true, feedback: "this evens out scanner differences and grows the data while keeping anatomy realistic, and it kills the marker shortcut." },
            { label: "Aggressive color shifts and random label smoothing of the boxes", feedback: "X-rays are grayscale and there are no boxes here; this adds noise unrelated to the real variation." },
            { label: "No normalization — let the model handle vendor differences", feedback: "then the model keys on vendor brightness, exactly the spurious signal you want to remove." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Pick a model & handle imbalance",
        narrative: `<p>Image input, rare positives, and a need for calibrated probabilities. Choose a model and a way to fight the $23{:}1$ imbalance.</p>`,
        concepts: ["dl-conv", "ml-logistic-regression", "ml-classification-metrics"],
        steps: [{
          type: "decide", prompt: "Choose the model and imbalance strategy.",
          options: [
            { label: "A CNN with class-weighted loss, then calibrate its probabilities", best: true, feedback: "a CNN reads the image, class weights counter the 23:1 imbalance, and calibration makes the output a trustworthy probability for clinicians." },
            { label: "A CNN trained on the raw imbalance with no reweighting", feedback: "it will just predict 'healthy' almost always — high accuracy, near-zero sensitivity. The rare class needs help." },
            { label: "Naive Bayes on raw pixels", feedback: "pixels are highly dependent, so the independence assumption is badly violated and it can't read radiographic patterns." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train & calibrate",
        narrative: `<p>Train with class weighting and regularization. A confident-but-wrong model is dangerous in medicine, so you also <b>calibrate</b> so a "0.8" really means ~80% risk.</p>`,
        concepts: ["ml-gradient-descent", "ml-regularization", "ml-classification-metrics"],
        steps: [{
          type: "run", label: "▶ Train CNN (class-weighted) + calibrate",
          result: { log: "training class-weighted CNN...\nepoch 12  val AUC 0.918  sensitivity@90%spec 0.79\nepoch 24  val AUC 0.941  sensitivity@90%spec 0.86  (early stop)\ncalibrating (temperature scaling)...\nECE 0.142 -> 0.038  (better calibrated)", metrics: [{ k: "val AUC", v: "0.941" }, { k: "ECE", v: "0.038" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate per hospital",
        narrative: `<p>You ship an operating point, not an AUC. Check sensitivity and specificity at the chosen threshold — and check it <i>per hospital</i> to expose distribution shift.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "prob-bayes"],
        steps: [
          { type: "run", label: "▶ Evaluate on held-out hospitals", result: { log: "overall @ threshold t*: sensitivity 0.91, specificity 0.88\nper-hospital sensitivity: A 0.92, B 0.90, C 0.91, D 0.89\nhospital F (NEW, unseen scanner): sensitivity 0.71  ALERT\npositive predictive value at 4% prevalence: 0.24", metrics: [{ k: "sensitivity", v: "0.91" }, { k: "specificity", v: "0.88" }, { k: "hosp F sens", v: "0.71 ⚠" }] } },
          { type: "decide", prompt: "Sensitivity is 0.91 everywhere except 0.71 at unseen hospital F. What now?",
            options: [
              { label: "Distribution shift — don't deploy to F until it's validated/recalibrated on F's data", best: true, feedback: "F's scanner is out-of-distribution, so your metrics don't hold there. Gating deployment per site is the safe, regulatory-minded move." },
              { label: "Ship to F anyway — the overall number is great", feedback: "the overall average hides a 20-point sensitivity drop at F; deploying there would miss real patients. Validate per site first." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Hospital F lags because its scanner protocol is unlike training data. Pick the fix that addresses the real cause.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "mlx-cross-validation"],
        steps: [{
          type: "decide", prompt: "How do you close the gap at hospital F?",
          options: [
            { label: "Collect and label F's scans, add them to training, and re-validate with per-hospital cross-validation", best: true, feedback: "the gap is missing distribution, not model capacity. Adding F's data and validating per site is the principled fix." },
            { label: "Increase the decision threshold globally", feedback: "raising the threshold lowers sensitivity everywhere — the opposite of what F needs and harmful at the other sites." },
            { label: "Make the network much deeper", feedback: "more capacity won't help when F's distribution was never in the training set. This is a data-coverage gap." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy as decision support",
        narrative: `<p>This is regulated, high-stakes software. It assists a radiologist; it does not replace one. Deployment must reflect that.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc"],
        steps: [
          { type: "decide", prompt: "How should the model be deployed?",
            options: [
              { label: "As a flag that surfaces suspected cases for radiologist review, with an audit log and a documented operating point", best: true, feedback: "human-in-the-loop, traceable, and reversible — the responsible and regulator-acceptable way to deploy clinical ML." },
              { label: "As an autonomous system that finalizes diagnoses with no clinician review", feedback: "unsafe and not approvable: no recourse on errors, and it removes the accountable expert. Medicine keeps a human in the loop." }
            ] },
          { type: "run", label: "▶ Roll out to 4 validated hospitals", result: { log: "deploying decision-support flag (hospitals A-D, F excluded pending data)...\nshadow mode 2 weeks: agreement with radiologists 93%\nflagged 14 cases radiologists initially overlooked (later confirmed)\nenabling assistive mode with audit logging...\nlive at 4 sites.", metrics: [{ k: "shadow agreement", v: "93%" }, { k: "sites live", v: "4" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Scanners get upgraded, patient mix shifts seasonally, and calibration drifts. In medicine, silent decay is a safety issue.</p>`,
        concepts: ["prob-clt", "ml-classification-metrics", "mlx-error-analysis"],
        steps: [
          { type: "decide", prompt: "What do you monitor for a clinical model?",
            options: [
              { label: "Per-hospital sensitivity/specificity as outcomes confirm, input image-stat drift, calibration (ECE), and flag rate — with alerts and human review", best: true, feedback: "track outcomes, inputs, calibration, and volume per site. Alert and route to clinicians on any move. Safety-grade MLOps." },
              { label: "Just total scans processed per day", feedback: "throughput says nothing about whether the model still catches disease. You'd miss a sensitivity collapse entirely." }
            ] },
          { type: "run", label: "▶ Check this month's monitors", result: { log: "hospital B upgraded scanner firmware -> image brightness shifted\ncalibration ECE: 0.038 -> 0.094 (drift)\nsensitivity (last 30d, confirmed cases): 0.91 -> 0.85  ALERT\naction: open review, recalibrate on recent B scans, schedule retrain", metrics: [{ k: "sensitivity", v: "0.85 ⚠" }, { k: "ECE", v: "0.094 ⚠" }] }, note: `Monitoring caught a scanner upgrade that broke calibration and sensitivity — triggering recalibration and a retrain, back to the <b>Data</b> stage. The loop never really ends.` }
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
        narrative: `<p>The shuttle must perceive the road, predict other agents, and plan a safe path. Safety dominates everything: a rare catastrophic miss outweighs millions of smooth miles.</p>`,
        concepts: ["dl-object-detection", "ai-mdp"],
        steps: [{
          type: "decide", prompt: "What should the top-line objective be?",
          options: [
            { label: "Minimize average trip time across all rides", feedback: "optimizing average comfort/speed can quietly trade away safety in rare events — exactly the events that matter most." },
            { label: "Maximize safety on the long tail (rare, dangerous situations) while keeping rides smooth — with a fail-safe fallback", best: true, feedback: "autonomy is judged on its worst cases. You optimize for the tail and guarantee a safe fallback when the system is unsure." },
            { label: "Maximize detection mAP only", feedback: "perception accuracy is necessary but not sufficient; a perfect detector still needs safe planning and a fail-safe." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Gather driving data",
        narrative: `<p>You log real drives across sensors — camera, LiDAR, radar. The rare scary moments are worth far more than routine highway miles.</p>`,
        concepts: ["ml-supervised", "dl-object-detection"],
        steps: [
          { type: "decide", prompt: "How should you build the dataset?",
            options: [
              { label: "Log many miles, then actively mine and label disengagements, near-misses, and odd scenes (the long tail)", best: true, feedback: "uniform sampling drowns you in boring highway frames. Mining hard cases concentrates labels where the system actually fails." },
              { label: "Only keep clean, sunny highway driving", feedback: "you'd train a model that's never seen rain, night, or jaywalkers — the exact situations that cause crashes." },
              { label: "Label every single frame equally", feedback: "astronomically expensive and mostly redundant; 99% of frames teach nothing new." }
            ] },
          { type: "run", label: "▶ Mine & label hard cases", prompt: "Mine disengagements and rare scenes from the fleet logs.",
            result: { log: "fleet logs: 2.1M miles\nmined events: 41,300 (disengagements, near-misses, anomalies)\nlabeled 3D boxes + tracks: 1.9M objects\nscene tags: night 18%, rain 11%, construction 6%, occluded peds 9%", metrics: [{ k: "miles", v: "2.1M" }, { k: "hard events", v: "41.3k" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Explore the long tail",
        narrative: `<p>Survey where perception currently struggles. The distribution of failures, not the average, drives the roadmap.</p>`,
        concepts: ["mlx-error-analysis", "ai-hmm"],
        steps: [
          { type: "run", label: "▶ Profile failure modes", result: { log: "detection recall by scene: day 0.96, night 0.81, heavy rain 0.74\npartially-occluded pedestrians: recall 0.69 (worst slice)\nradar-camera disagreements: 3.1% of frames\nrare classes (e.g. road debris): very few labels", metrics: [{ k: "rain recall", v: "0.74" }, { k: "occluded ped", v: "0.69 ⚠" }] } },
          { type: "decide", prompt: "Occluded-pedestrian recall is 0.69, the worst slice. How serious is that?",
            options: [
              { label: "Top priority — a missed pedestrian is a safety-critical failure even if it's rare", best: true, feedback: "in autonomy, the cost of the error, not its frequency, sets priority. Occluded peds are exactly the long-tail risk to attack first." },
              { label: "Minor — it's a small fraction of frames", feedback: "frequency is the wrong lens. A single missed pedestrian is catastrophic; rarity does not make it acceptable." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Fuse the sensors",
        narrative: `<p>No single sensor is enough: cameras see semantics, LiDAR sees geometry, radar sees velocity in rain. Sensor fusion combines their strengths.</p>`,
        concepts: ["ai-hmm", "dl-object-detection", "ai-mdp"],
        steps: [{
          type: "decide", prompt: "How should you combine camera, LiDAR, and radar?",
          options: [
            { label: "Fuse all three so each covers the others' blind spots, and track objects over time with a state estimator", best: true, feedback: "fusion plus temporal tracking gives robust, redundant perception — radar holds up in rain where the camera fails, and tracking smooths noisy detections." },
            { label: "Use only the camera; it's the richest sensor", feedback: "cameras fail at night and in heavy rain and can't measure range directly. Redundancy is a safety requirement, not a luxury." },
            { label: "Average the three sensors' pixel values", feedback: "they live in different modalities and frames; naive averaging is meaningless. Fusion must respect each sensor's geometry." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Perception + planning",
        narrative: `<p>Perception detects and tracks agents; planning chooses safe actions over time. Frame the driving decision as a sequence of choices, not a one-shot label.</p>`,
        concepts: ["dl-conv", "ai-mdp", "mod-actor-critic"],
        steps: [{
          type: "decide", prompt: "How should the planning layer be framed?",
          options: [
            { label: "As a sequential decision process (states, actions, costs) with a learned policy, validated against rule-based safety checks", best: true, feedback: "driving is sequential — each action changes the next state. A policy over an MDP fits, with hard safety rules as a guardrail." },
            { label: "A single classifier that outputs 'left/right/brake' from one frame", feedback: "ignores dynamics, future agents, and consequences; safe driving needs to reason over time, not per frame." },
            { label: "Pure open-loop replay of human trajectories", feedback: "it can't react to new situations or agents it didn't see in the log. Driving must close the loop." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train in simulation",
        narrative: `<p>You can't safely collect crashes on real roads, so you train and stress-test the policy in <b>simulation</b> first, replaying mined hard scenes and synthetic edge cases.</p>`,
        concepts: ["ml-gradient-descent", "mod-actor-critic", "ai-mdp"],
        steps: [{
          type: "run", label: "▶ Train policy in sim (hard-case scenarios)",
          result: { log: "training planning policy in simulation...\nscenarios: 1.2M (incl. mined long-tail + synthetic edge cases)\niter 200k  collision rate 2.1/1k mi  comfort 0.71\niter 600k  collision rate 0.4/1k mi  comfort 0.83\niter 900k  collision rate 0.18/1k mi comfort 0.85 (converged)", metrics: [{ k: "sim collisions/1k mi", v: "0.18" }, { k: "comfort", v: "0.85" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate & sim-to-real",
        narrative: `<p>Sim numbers flatter you. The real test is whether the policy survives the <i>sim-to-real gap</i> on held-out hard scenarios and closed-course trials.</p>`,
        concepts: ["mlx-error-analysis", "ai-mdp", "mlx-cross-validation"],
        steps: [
          { type: "run", label: "▶ Evaluate on held-out + closed course", result: { log: "held-out sim scenarios: collision rate 0.31/1k mi\nclosed-course (real): 0 collisions in 1,400 mi, 3 cautious over-brakes\nsim-to-real gap: real perception recall 4-6% below sim\nfail-safe (minimal-risk stop) triggered correctly in 12/12 fault injections", metrics: [{ k: "held-out collisions", v: "0.31/1k" }, { k: "fail-safe", v: "12/12" }] } },
          { type: "decide", prompt: "Real perception recall is 4-6% below sim. What's the responsible read?",
            options: [
              { label: "The sim-to-real gap is real, so sim metrics are an upper bound — keep the fail-safe and expand real testing before scaling", best: true, feedback: "right — sim is optimistic. You trust real-world and closed-course numbers more, lean on the fail-safe, and scale cautiously." },
              { label: "Sim passed, so it's ready for unsupervised public roads everywhere", feedback: "the gap means real performance is worse than sim; jumping straight to broad deployment ignores the long tail you can't yet measure." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Diagnose & iterate",
        narrative: `<p>Occluded-pedestrian recall is still the limiting failure. Choose the fix that targets the real gap, not a knob.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "ai-mdp"],
        steps: [{
          type: "decide", prompt: "Best way to reduce the occluded-pedestrian risk?",
          options: [
            { label: "Mine more occluded-ped scenes, add synthetic occlusion in sim, strengthen radar fusion, and keep a conservative fallback near crosswalks", best: true, feedback: "this attacks the actual cause — too few hard examples and weak occluded-object handling — while a conservative policy bounds the residual risk." },
            { label: "Lower the detection confidence threshold for everything", feedback: "you'd get a storm of false positives fleet-wide, causing phantom braking. Fix perception coverage instead of flooding outputs." },
            { label: "Drive faster to collect miles quicker", feedback: "speed doesn't add the missing occluded-ped examples and raises risk. This is a data and fusion gap." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy with a safety driver",
        narrative: `<p>You don't flip a switch to full autonomy. Deployment is a staged, supervised expansion with a guaranteed fail-safe.</p>`,
        concepts: ["ai-mdp", "dl-object-detection"],
        steps: [
          { type: "decide", prompt: "How should the shuttle go live?",
            options: [
              { label: "Geofenced low-speed route with a safety operator, a minimal-risk-condition fail-safe, and gradual ODD expansion as evidence accrues", best: true, feedback: "constrain the operating domain, keep a human backup and a guaranteed safe stop, and expand only as data justifies it. That's how autonomy ships." },
              { label: "Full city-wide driverless launch on day one", feedback: "the long tail isn't proven out; launching everywhere with no safety net courts exactly the catastrophic events you optimized against." }
            ] },
          { type: "run", label: "▶ Launch geofenced route (safety operator)", result: { log: "enabling shuttle on 6-mile geofenced loop, max 25 mph...\nsafety operator present, fail-safe armed\nweek 1: 0 collisions, 5 operator takeovers (all precautionary), 2 minimal-risk stops\nexpanding hours to include dusk...\nlive (supervised).", metrics: [{ k: "collisions", v: "0" }, { k: "takeovers", v: "5" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Roads change — construction, new signage, seasonal weather. Every takeover and near-miss is a signal that feeds the next training cycle.</p>`,
        concepts: ["prob-clt", "mlx-error-analysis", "ai-hmm"],
        steps: [
          { type: "decide", prompt: "What should the fleet monitor in production?",
            options: [
              { label: "Disengagement/takeover rate, fail-safe triggers, perception recall on incoming scenes, sensor-disagreement and drift — with every event auto-mined for retraining", best: true, feedback: "track safety events, perception health, and input drift; auto-mine every disengagement back into the dataset. Safety MLOps is a closed loop." },
              { label: "Only average ride comfort score", feedback: "comfort says nothing about whether a near-miss just happened. You'd miss the safety-critical signals entirely." }
            ] },
          { type: "run", label: "▶ Review this week's safety monitors", result: { log: "new construction zone on route -> takeovers up 4x there\nsensor disagreement (radar vs camera) rose to 5.8% in fog\nfail-safe triggered 9x (all correct, all near the construction)\naction: mine construction scenes, retrain perception+planner, re-validate in sim", metrics: [{ k: "takeover spike", v: "4x ⚠" }, { k: "fail-safe", v: "9 (ok)" }] }, note: `Monitoring caught a new construction zone driving up takeovers — those scenes get mined and fed back to retraining, returning to the <b>Data</b> stage. The safety loop is the product.` }
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
        narrative: `<p>You frame control as a Markov decision process: at each step the arm observes a state, takes an action, and earns a reward. Everything the robot learns flows from how you shape that reward.</p>`,
        concepts: ["ai-mdp", "ai-policy-value"],
        steps: [{
          type: "decide", prompt: "Which reward best encodes 'pick and place reliably'?",
          options: [
            { label: "A reward for a successful, gentle placement, with small penalties for time, jerk, and dropped parts", best: true, feedback: "rewarding the true goal (successful placement) plus shaping terms for smoothness and speed gives a learnable, well-behaved signal." },
            { label: "+1 only at the exact final placement, zero everywhere else", feedback: "a reward this sparse is nearly impossible to discover by exploration; the arm flails and never sees a +1." },
            { label: "Reward raw motor velocity", feedback: "that rewards thrashing the joints, not completing the task — the arm learns to move fast and accomplish nothing." }
          ]
        }]
      },
      {
        phase: "Data", icon: "🗄️", title: "Collect / simulate experience",
        narrative: `<p>An RL policy learns from experience. Crashing a real arm thousands of times is slow and expensive, so you generate experience in a physics simulator first.</p>`,
        concepts: ["ai-mdp", "ai-q-learning"],
        steps: [
          { type: "decide", prompt: "Where should the policy gather its early experience?",
            options: [
              { label: "In a fast physics simulator with randomized object poses and dynamics", best: true, feedback: "sim gives millions of cheap, safe trials and lets you randomize physics so the policy doesn't overfit one exact setup. Reality comes later." },
              { label: "On the real arm from the very first random action", feedback: "early RL actions are essentially random — on real hardware that means collisions and broken parts before any learning." },
              { label: "From a single recorded human demo, replayed forever", feedback: "one trajectory can't cover the states the policy will visit; it can't recover from anything off that path." }
            ] },
          { type: "run", label: "▶ Spin up sim & collect rollouts", prompt: "Launch parallel simulators with domain randomization.",
            result: { log: "launching 64 parallel sim envs...\ndomain randomization: friction, mass, lighting, object pose\ncollected 5.0M transitions in 22 min\nsuccess under random policy: 1.8%", metrics: [{ k: "transitions", v: "5.0M" }, { k: "sim envs", v: "64" }, { k: "random success", v: "1.8%" }] } }
        ]
      },
      {
        phase: "Explore", icon: "🔍", title: "Inspect the state space",
        narrative: `<p>Look at the states the arm actually visits and how reward accrues. Reward bugs and unreachable states show up here, before you waste a long training run.</p>`,
        concepts: ["ai-mdp", "mlx-error-analysis"],
        steps: [
          { type: "run", label: "▶ Profile rollouts", result: { log: "state coverage: gripper rarely reaches far-left bin (2% of episodes)\nreward histogram: spike at -0.5 (time penalty dominates early)\ndetected reward exploit: arm hovers near goal to farm shaping reward\nepisode length: hits max-steps cap 61% of the time", metrics: [{ k: "reward hacks", v: "1 found" }, { k: "timeouts", v: "61%" }] } },
          { type: "decide", prompt: "The arm 'hovers near the goal' to farm shaping reward without placing. What is this?",
            options: [
              { label: "Reward hacking — the shaping term is exploitable and must be fixed", best: true, feedback: "classic reward hacking: the policy maximizes the proxy, not the goal. Tighten the shaping so reward only flows on real progress." },
              { label: "Good behavior — it's getting reward", feedback: "it's gaming the proxy while never placing a part. High reward, zero task success means your reward is misspecified." }
            ] }
        ]
      },
      {
        phase: "Features", icon: "🧬", title: "Design the state features",
        narrative: `<p>The policy is only as good as what it can observe. Choose a state representation that's informative <i>and</i> available on the real robot.</p>`,
        concepts: ["ai-mdp", "ai-policy-value", "la-jacobian"],
        steps: [{
          type: "decide", prompt: "Which state representation should the policy use?",
          options: [
            { label: "Joint angles/velocities, gripper pose, and object pose relative to the gripper", best: true, feedback: "compact, physically meaningful, and measurable on the real arm. Relative object pose makes the policy generalize across placements." },
            { label: "Absolute world coordinates only, with no object info", feedback: "without the object's pose the policy can't know what to grasp; it's blind to the very thing it must pick." },
            { label: "Raw motor current readings alone", feedback: "current barely constrains where the gripper or object are; the policy can't infer the task state from it." }
          ]
        }]
      },
      {
        phase: "Model", icon: "🧠", title: "Choose the RL algorithm",
        narrative: `<p>Continuous joint torques mean a continuous action space. Pick a learning method suited to that, with stable updates.</p>`,
        concepts: ["mod-actor-critic", "mod-policy-gradient", "ai-q-learning"],
        steps: [{
          type: "decide", prompt: "Which RL method fits continuous control?",
          options: [
            { label: "An actor-critic policy-gradient method (e.g. PPO) for stable continuous-action learning", best: true, feedback: "actor-critic with a clipped policy-gradient update is the workhorse for continuous robot control — stable and sample-reasonable." },
            { label: "Tabular Q-learning over the raw continuous state", feedback: "you can't tabulate a continuous space; it explodes. Tables are for small discrete problems." },
            { label: "A bandit that ignores state entirely", feedback: "control is sequential and state-dependent; a stateless bandit can't plan a multi-step grasp-and-place." }
          ]
        }]
      },
      {
        phase: "Train", icon: "⚙️", title: "Train the policy (RL)",
        narrative: `<p>Optimize the policy by gradient ascent on expected return. Watch the success rate climb as the value estimate stabilizes.</p>`,
        concepts: ["ml-gradient-descent", "mod-actor-critic", "ai-q-learning"],
        steps: [{
          type: "run", label: "▶ Train PPO policy in sim",
          result: { log: "training PPO (64 envs)...\nstep 2M   success 31%  mean return  4.1\nstep 8M   success 74%  mean return 12.8\nstep 16M  success 89%  mean return 15.2  (return plateaued)\npolicy entropy annealed; value loss stable", metrics: [{ k: "sim success", v: "89%" }, { k: "mean return", v: "15.2" }] } }
        ]
      },
      {
        phase: "Evaluate", icon: "📊", title: "Evaluate in simulation",
        narrative: `<p>Evaluate on held-out object poses and randomized dynamics the policy didn't train on. Average return hides brittle corners.</p>`,
        concepts: ["mlx-error-analysis", "ai-policy-value", "mlx-cross-validation"],
        steps: [
          { type: "run", label: "▶ Evaluate on held-out poses", result: { log: "eval over 5,000 held-out episodes...\noverall success 86%\nslippery (low-friction) objects: success 58%  (weak)\nfar-left bin placements: success 64%\nmean placement force: gentle (within limit)", metrics: [{ k: "success", v: "86%" }, { k: "low-friction", v: "58% ⚠" }] } },
          { type: "decide", prompt: "Overall success is 86% but low-friction objects sit at 58%. What does this say?",
            options: [
              { label: "The policy is brittle on slippery objects — a real failure mode the average masks", best: true, feedback: "a strong average can hide a weak slice. Slippery parts are common in the real cell, so this gap matters." },
              { label: "Nothing — 86% overall is all that counts", feedback: "the cell handles slippery parts often; 58% there means frequent real-world drops. Averages hide failure slices." }
            ] }
        ]
      },
      {
        phase: "Iterate", icon: "🔁", title: "Iterate (reward shaping)",
        narrative: `<p>Slippery objects fail because the policy grips too lightly. You iterate on the reward and the training distribution — the core RL loop.</p>`,
        concepts: ["mlx-error-analysis", "ai-mdp", "ai-policy-value"],
        steps: [{
          type: "decide", prompt: "Best way to fix the low-friction failures?",
          options: [
            { label: "Add a grip-security shaping term, widen friction randomization toward slippery values, and retrain", best: true, feedback: "reward shaping plus broader domain randomization directly target the cause — the policy learns to grip slippery parts securely." },
            { label: "Multiply the entire reward by 10", feedback: "scaling reward uniformly changes nothing about the optimal policy; the slippery-grip behavior still isn't encouraged." },
            { label: "Just run training 5x longer with the same setup", feedback: "more steps on the same distribution won't teach a behavior the reward never rewards. Fix the signal, not the duration." }
          ]
        }]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy with safety limits",
        narrative: `<p>A learned policy moving a real arm can hit people or machines. Deployment wraps the policy in hard safety limits the policy cannot override.</p>`,
        concepts: ["ai-mdp", "mod-actor-critic"],
        steps: [
          { type: "decide", prompt: "How do you put the policy on the real arm safely?",
            options: [
              { label: "Run it inside torque/velocity/workspace limits with a watchdog and e-stop, ramping speed up gradually after sim-to-real validation", best: true, feedback: "hard limits, a watchdog, and an e-stop bound the worst case; ramping speed lets you catch sim-to-real surprises before they're dangerous." },
              { label: "Deploy at full speed with no limits — the policy was safe in sim", feedback: "sim isn't reality; an unconstrained learned policy can command unsafe torques. Hardware needs guaranteed limits outside the policy." }
            ] },
          { type: "run", label: "▶ Deploy to real arm (limited speed)", result: { log: "loading policy onto real controller...\nsafety envelope: torque/velocity/workspace limits + watchdog armed\nsim-to-real: real success 79% vs 86% sim (gap as expected)\nramping to 60% max speed after 200 clean picks\nlive (limited).", metrics: [{ k: "real success", v: "79%" }, { k: "safety stops", v: "0" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor & maintain (MLOps)",
        narrative: `<p>Grippers wear, parts change, lighting shifts. A control policy degrades silently unless you watch its real success and safety events.</p>`,
        concepts: ["prob-clt", "mlx-error-analysis", "ai-policy-value"],
        steps: [
          { type: "decide", prompt: "What should you monitor on the deployed arm?",
            options: [
              { label: "Real success rate, drop/retry counts, safety-limit trips, cycle time, and state-distribution drift — with alerts and auto-logged failures", best: true, feedback: "track task outcomes, safety trips, throughput, and input drift; log every failure to feed the next training round. That's robotics MLOps." },
              { label: "Only the total number of parts attempted", feedback: "attempt count says nothing about whether the picks succeed or whether safety limits are firing. You'd miss a real decline." }
            ] },
          { type: "run", label: "▶ Check this week's monitors", result: { log: "gripper pad wear detected -> drop rate 3% -> 11% over 9 days\nsafety-limit trips: 0 (envelope holding)\nstate drift: new part variant outside training distribution\naction: replace pad, log new variant, add it to sim and retrain policy", metrics: [{ k: "drop rate", v: "11% ⚠" }, { k: "safety trips", v: "0" }] }, note: `Monitoring caught gripper wear and a new part variant — both get fed back into simulation and a retrain, returning to the <b>Data</b> stage. The control loop and the ML loop both keep running.` }
        ]
      }
    ]
  }
});
