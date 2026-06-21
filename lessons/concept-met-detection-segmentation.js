/* =====================================================================
   Metrics & Evaluation (BEGINNER) — Detection & Segmentation metrics.
   Self-contained: pushes one lesson into window.LESSONS, plus a
   window.CODE entry and a window.CODEVIZ entry keyed by the lesson id.
   Style: short sentences, every symbol defined in plain English,
   small concrete number examples. Math in $...$ with doubled backslashes.
   ===================================================================== */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODE = window.CODE || {};
  window.CODEVIZ = window.CODEVIZ || {};

  var ID = "met-detection-segmentation";

  window.LESSONS.push({
    id: ID,
    title: "Metrics for object detection & segmentation",
    tagline: "Score boxes, masks, and tracks by how much they overlap the truth.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["dl-object-detection"],

    whenToUse:
      `<p><b>Use these whenever a model points at <i>where</i> something is</b>, not just whether it is present. The metric you pick follows the task.</p>
       <ul>
         <li><b>Object detection (boxes).</b> Use <b>IoU (Intersection over Union)</b> to decide if a box is correct, then <b>AP (Average Precision)</b> per class and <b>mAP (mean Average Precision)</b> across classes. The modern default is <b>COCO mAP@[.5:.95]</b> (averaged over many IoU cutoffs).</li>
         <li><b>Semantic segmentation (per-pixel class).</b> Use <b>mIoU (mean Intersection over Union)</b> across classes; quote <b>pixel accuracy</b> only as a rough companion.</li>
         <li><b>Binary / medical masks.</b> Use the <b>Dice coefficient</b> (the same number as <b>F1</b> for masks); pair it with IoU.</li>
         <li><b>Panoptic segmentation (things + stuff together).</b> Use <b>PQ (Panoptic Quality)</b>.</li>
         <li><b>Thin shapes / edges.</b> Add <b>Boundary IoU</b> so good edges are rewarded.</li>
         <li><b>Pose / keypoints.</b> Use <b>PCK (Percentage of Correct Keypoints)</b>.</li>
         <li><b>Tracking over video.</b> Use <b>MOTA, MOTP</b>, and the newer <b>HOTA</b>.</li>
       </ul>
       <p><b>Which IoU threshold?</b> $0.5$ is lenient (a roughly-right box passes). $0.75$ is strict (it must hug the object). Averaging from $0.5$ to $0.95$ rewards tight localization.</p>`,

    application:
      `<p>These metrics drive almost every vision leaderboard and shipping check.</p>
       <ul>
         <li><b>Self-driving cars</b> score pedestrian and car detectors with mAP, and lane/road masks with mIoU.</li>
         <li><b>Medical imaging</b> reports Dice for tumor and organ masks, because small structures need overlap (not pixel accuracy).</li>
         <li><b>Photo and AR apps</b> use PQ for full-scene parsing and PCK for body-pose tracking.</li>
         <li><b>Sports and surveillance video</b> rank multi-object trackers with MOTA and HOTA.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>A single IoU threshold hides localization quality.</b> At IoU $\\ge 0.5$ a sloppy box and a perfect box both "pass". Report <b>COCO mAP@[.5:.95]</b> so tight boxes are rewarded.</li>
         <li><b>Class imbalance in detection.</b> Most boxes a detector proposes are background. Accuracy is meaningless here; AP, built from the precision–recall curve, is the honest score.</li>
         <li><b>Dice vs IoU disagree on small objects.</b> Dice is always larger than IoU for the same masks, and the gap is widest for tiny shapes. Missing a few pixels of a small tumor crushes IoU more than Dice — never compare a Dice number to an IoU number.</li>
         <li><b>mIoU dominated by the background class.</b> If you average IoU over all classes and one class is the huge background, a model can score high while failing rare classes. Report per-class IoU, and consider excluding or down-weighting background.</li>
         <li><b>Pixel accuracy flatters imbalance.</b> If $95\\%$ of pixels are "sky", calling everything sky gives $0.95$ pixel accuracy yet zero useful segmentation. Lead with mIoU or Dice.</li>
         <li><b>Wrong matching rules.</b> Each ground-truth object should match at most one prediction; extra overlapping boxes are false positives. Forgetting this inflates recall.</li>
       </ul>`,

    bigIdea:
      `<p>Every metric here starts from one idea: <b>how much does the prediction overlap the truth?</b></p>
       <p>For a box or a mask, measure the area they <b>share</b>, then divide by the area they <b>cover together</b>. That ratio is <b>IoU (Intersection over Union)</b>, also called the <b>Jaccard index</b>.</p>
       <p>Picture two rectangles drawn over the same object. The part where they sit on top of each other is the <i>intersection</i>. The full footprint of both together is the <i>union</i>. IoU is overlap $\\div$ union: $1.0$ for a perfect match, $0$ when they never touch.</p>`,

    buildup:
      `<p>Start with one box. <b>IoU</b> tells you if it is right. Pick a cutoff, say IoU $\\ge 0.5$, and now each box is a hit or a miss.</p>
       <p>Hits and misses give <b>precision</b> (of the boxes you drew, how many were correct) and <b>recall</b> (of the real objects, how many you found). Sweep the model's confidence from high to low and you trace a <b>precision–recall curve</b>.</p>
       <p>The area under that curve is <b>AP (Average Precision)</b> for one class. Average AP over all classes and you get <b>mAP (mean Average Precision)</b>. Average mAP over many IoU cutoffs ($0.5, 0.55, \\ldots, 0.95$) and you get <b>COCO mAP@[.5:.95]</b>.</p>
       <p>For masks the same overlap idea becomes <b>Dice</b> (twice the shared area over the total area, identical to F1) and, averaged over classes, <b>mIoU</b>.</p>`,

    symbols: [
      { sym: "$A$", desc: "the area (or pixel set) of the prediction — a box or a mask." },
      { sym: "$B$", desc: "the area (or pixel set) of the ground-truth object." },
      { sym: "$A \\cap B$", desc: "the intersection: the area the two share (overlap)." },
      { sym: "$A \\cup B$", desc: "the union: the area they cover together." },
      { sym: "$|\\cdot|$", desc: "size — square pixels for a box, count of pixels for a mask." },
      { sym: "$\\tau$ (tau)", desc: "the IoU threshold; a prediction counts as correct when IoU $\\ge \\tau$ (e.g. $0.5$)." },
      { sym: "TP, FP, FN", desc: "true positives (correct boxes), false positives (extra boxes), false negatives (missed objects)." },
      { sym: "AP, mAP", desc: "Average Precision for one class; mean Average Precision averaged over classes." }
    ],

    formula:
      `$$ \\text{IoU} = \\frac{|A \\cap B|}{|A \\cup B|} \\qquad \\text{Dice} = \\frac{2\\,|A \\cap B|}{|A| + |B|} = \\text{F1} $$
       $$ \\text{mAP} = \\frac{1}{C}\\sum_{c=1}^{C} \\text{AP}_c \\qquad \\text{PQ} = \\underbrace{\\frac{\\sum_{(p,g)\\in TP}\\text{IoU}(p,g)}{|TP|}}_{\\text{SQ: how tight}} \\times \\underbrace{\\frac{|TP|}{|TP| + \\tfrac12|FP| + \\tfrac12|FN|}}_{\\text{RQ: how complete}} $$`,

    whatItDoes:
      `<p><b>IoU</b> is overlap $\\div$ union: $1.0$ means the boxes are identical, $0$ means they never touch.</p>
       <p><b>Dice</b> counts the shared area twice and divides by the total area of both shapes; it equals the <b>F1</b> score when the shapes are pixel masks. Dice is always at least as large as IoU.</p>
       <p><b>AP</b> is the area under one class's precision–recall curve; <b>mAP</b> averages AP over the $C$ classes. <b>COCO mAP@[.5:.95]</b> also averages over IoU cutoffs $0.5,0.55,\\ldots,0.95$, so loose boxes can no longer hide.</p>
       <p><b>PQ (Panoptic Quality)</b> splits into <b>SQ (Segmentation Quality</b>, the average IoU of matched segments) times <b>RQ (Recognition Quality</b>, an F1 over whole segments) — one number for "how tight" and "how complete".</p>`,

    derivation:
      `<p><b>Why overlap ÷ union?</b> Union is in the denominator so the score is punished from <i>both</i> sides. If your box is too big, the union grows and IoU drops. If it is too small, the intersection shrinks and IoU drops. Only a box that matches in size <i>and</i> position scores near $1.0$.</p>
       <p><b>Why Dice and IoU relate.</b> Write $i = |A\\cap B|$, $u = |A\\cup B|$, and note $|A| + |B| = u + i$ (the overlap is counted twice). Then $\\text{IoU} = i/u$ and $\\text{Dice} = 2i/(u+i)$. A little algebra gives $\\text{Dice} = \\dfrac{2\\,\\text{IoU}}{1 + \\text{IoU}}$, so Dice is always $\\ge$ IoU and the two carry the same ranking.</p>
       <p><b>Why AP, not accuracy.</b> A detector emits far more background than objects, so accuracy is dominated by easy negatives. The precision–recall curve ignores true negatives entirely, and its area (AP) summarizes the whole confidence sweep into one honest number.</p>
       <p><b>Other family members in brief.</b> <b>Boundary IoU</b> computes IoU only on a thin band along each mask's edge, so good edges are rewarded. <b>PCK</b> calls a predicted keypoint correct if it lands within a tolerance (e.g. a fraction of the body size) of the true joint. <b>MOTA</b> $= 1 - \\dfrac{\\text{misses} + \\text{false positives} + \\text{ID switches}}{\\text{ground-truth boxes}}$ (detection errors over time); <b>MOTP</b> is the average IoU/distance of matched boxes (localization quality); <b>HOTA</b> geometrically averages detection and association accuracy for a single balanced tracking score.</p>`,

    example:
      `<p>Take one real handwritten "0" from the <code>load_digits</code> dataset (an $8\\times 8$ image). The ink pixels span columns $1$–$6$ and rows $0$–$7$, so the <b>true box</b> is $A=(x_0,y_0,x_1,y_1)=(1,0,7,8)$, an area of $6\\times 8 = 48$ square pixels.</p>
       <ul class="steps">
         <li><b>Perfect box</b> $B=(1,0,7,8)$. Intersection $=48$, union $=48$. IoU $=48/48 = 1.0$.</li>
         <li><b>Shifted box</b> $B=(2,1,8,9)$, also $48$ pixels but moved by $(1,1)$. Overlap $=5\\times 7 = 35$. Union $=48+48-35 = 61$. IoU $=35/61 \\approx 0.574$.</li>
         <li><b>Loose box</b> with a $1$-pixel margin, $B=(0,-1,8,9)$, area $8\\times 10 = 80$. Overlap $=48$ (the true box sits inside). Union $=80$. IoU $=48/80 = 0.6$.</li>
       </ul>
       <p>Now a tiny <b>mask</b> example. Prediction $A$ covers $3$ pixels, truth $B$ covers $3$ pixels, and they share $2$. Then IoU $= 2/(3+3-2) = 2/4 = 0.5$, while Dice $= 2\\times 2/(3+3) = 4/6 \\approx 0.667$ — Dice reads higher on the very same masks.</p>`,

    demo: function (host) {
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340") };
      }
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

      // true box in data coords (x0,y0,x1,y1); the digit-0 box from load_digits
      var truth = { x0: 1, y0: 0, x1: 7, y1: 8 };
      var dx = 0, dy = 0; // drag offset of the prediction box

      // map an 8x8-ish grid into the canvas
      var W = 640, H = 300, padL = 30, padT = 20, cell = 30;
      function PX(x) { return padL + x * cell; }
      function PY(y) { return padT + y * cell; }

      function iou(p) {
        var ix0 = Math.max(truth.x0, p.x0), iy0 = Math.max(truth.y0, p.y0);
        var ix1 = Math.min(truth.x1, p.x1), iy1 = Math.min(truth.y1, p.y1);
        var iw = Math.max(0, ix1 - ix0), ih = Math.max(0, iy1 - iy0);
        var inter = iw * ih;
        var at = (truth.x1 - truth.x0) * (truth.y1 - truth.y0);
        var ap = (p.x1 - p.x0) * (p.y1 - p.y0);
        var uni = at + ap - inter;
        return uni > 0 ? inter / uni : 0;
      }

      function draw() {
        var c = C(); ctx.clearRect(0, 0, W, H);
        // light grid
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        for (var gx = 0; gx <= 9; gx++) { ctx.beginPath(); ctx.moveTo(PX(gx), PY(0)); ctx.lineTo(PX(gx), PY(9)); ctx.stroke(); }
        for (var gy = 0; gy <= 9; gy++) { ctx.beginPath(); ctx.moveTo(PX(0), PY(gy)); ctx.lineTo(PX(9), PY(gy)); ctx.stroke(); }
        var pred = { x0: truth.x0 + dx, y0: truth.y0 + dy, x1: truth.x1 + dx, y1: truth.y1 + dy };
        // intersection fill
        var ix0 = Math.max(truth.x0, pred.x0), iy0 = Math.max(truth.y0, pred.y0);
        var ix1 = Math.min(truth.x1, pred.x1), iy1 = Math.min(truth.y1, pred.y1);
        if (ix1 > ix0 && iy1 > iy0) {
          ctx.fillStyle = c.warn + "55";
          ctx.fillRect(PX(ix0), PY(iy0), (ix1 - ix0) * cell, (iy1 - iy0) * cell);
        }
        // truth box (green)
        ctx.strokeStyle = c.accent2; ctx.lineWidth = 3;
        ctx.strokeRect(PX(truth.x0), PY(truth.y0), (truth.x1 - truth.x0) * cell, (truth.y1 - truth.y0) * cell);
        // prediction box (blue)
        ctx.strokeStyle = c.accent; ctx.lineWidth = 3;
        ctx.strokeRect(PX(pred.x0), PY(pred.y0), (pred.x1 - pred.x0) * cell, (pred.y1 - pred.y0) * cell);
        // labels
        ctx.fillStyle = c.accent2; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("truth", PX(truth.x0) + 4, PY(truth.y0) + 14);
        ctx.fillStyle = c.accent;
        ctx.fillText("prediction (drag)", PX(pred.x0) + 4, PY(pred.y1) - 6);
        var v = iou(pred);
        readout.innerHTML = "IoU = overlap &divide; union = <b>" + v.toFixed(3) + "</b>. " +
          (v >= 0.999 ? "Perfect match." : "Drag the blue box back onto the green truth to push IoU toward 1.0.");
      }

      function setFrom(clientX, clientY) {
        var r = cv.getBoundingClientRect();
        var sx = cv.width / r.width, sy = cv.height / r.height;
        var mx = (clientX - r.left) * sx, my = (clientY - r.top) * sy;
        // center the prediction box on the cursor, snapped to the grid
        var cx = Math.round((mx - padL) / cell - (truth.x1 - truth.x0) / 2);
        var cy = Math.round((my - padT) / cell - (truth.y1 - truth.y0) / 2);
        dx = Math.max(-1, Math.min(2, cx - truth.x0));
        dy = Math.max(-1, Math.min(1, cy - truth.y0));
        draw();
      }
      var dragging = false;
      cv.addEventListener("mousedown", function (e) { dragging = true; setFrom(e.clientX, e.clientY); });
      window.addEventListener("mousemove", function (e) { if (dragging) setFrom(e.clientX, e.clientY); });
      window.addEventListener("mouseup", function () { dragging = false; });
      cv.addEventListener("touchstart", function (e) { dragging = true; if (e.touches[0]) setFrom(e.touches[0].clientX, e.touches[0].clientY); });
      cv.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) { setFrom(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); } });
      draw();
    },

    practice: [
      {
        q: `A predicted box and the true box each cover $48$ square pixels and overlap in $35$. What is their IoU?`,
        steps: [
          { do: `Union $= |A| + |B| - |A\\cap B| = 48 + 48 - 35 = 61$.`, why: `Subtract the shared area once so it is not double counted.` },
          { do: `IoU $= 35 / 61$.`, why: `Overlap divided by union.` }
        ],
        answer: `IoU $= 35/61 \\approx 0.574$. With a $\\tau = 0.5$ threshold it counts as a hit; with $\\tau = 0.75$ it would be a miss.`
      },
      {
        q: `Two masks each cover $3$ pixels and share $2$. Compute IoU and Dice, and say which is larger.`,
        steps: [
          { do: `IoU $= 2 / (3 + 3 - 2) = 2/4$.`, why: `Shared pixels over the union of pixels.` },
          { do: `Dice $= 2\\times 2 / (3 + 3) = 4/6$.`, why: `Twice the shared pixels over the total of both masks.` }
        ],
        answer: `IoU $= 0.5$, Dice $\\approx 0.667$. Dice is larger — it always exceeds IoU for the same masks, so never compare the two numbers directly.`
      },
      {
        q: `A detector scores IoU $\\ge 0.5$ on every box but barely overlaps when the cutoff rises to $0.75$. Which single metric exposes this, and why?`,
        steps: [
          { do: `Pick a metric that averages over IoU cutoffs.`, why: `A single $\\tau = 0.5$ threshold treats a sloppy box and a perfect box the same.` },
          { do: `Report <b>COCO mAP@[.5:.95]</b>.`, why: `Averaging AP over $\\tau = 0.5,0.55,\\ldots,0.95$ rewards tight localization and drops on loose boxes.` }
        ],
        answer: `COCO mAP@[.5:.95]. It averages mAP across ten IoU thresholds, so loose-but-passing boxes can no longer hide behind a single lenient cutoff.`
      }
    ]
  });

  window.CODE[ID] = {
    lib: "torchmetrics",
    runnable: false,
    explain: `<p>From-scratch <code>IoU</code> and <code>Dice</code> in <code>NumPy</code> so the math is explicit, then the real production calls: <code>torchmetrics.detection.MeanAveragePrecision</code> for detection mAP and the <code>torchmetrics</code> segmentation metrics (Dice / mean-IoU) you would log in training.</p>`,
    code: `import numpy as np

# ---- from-scratch IoU for two boxes (x0, y0, x1, y1) ----
def box_iou(a, b):
    ix0, iy0 = max(a[0], b[0]), max(a[1], b[1])
    ix1, iy1 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix1 - ix0) * max(0, iy1 - iy0)
    area_a = (a[2] - a[0]) * (a[3] - a[1])
    area_b = (b[2] - b[0]) * (b[3] - b[1])
    union = area_a + area_b - inter
    return inter / union if union > 0 else 0.0

print("box IoU:", round(box_iou((1, 0, 7, 8), (2, 1, 8, 9)), 3))  # ~0.574

# ---- from-scratch IoU + Dice for two binary masks ----
def mask_iou(p, g):
    inter = np.logical_and(p, g).sum()
    union = np.logical_or(p, g).sum()
    return inter / union if union else 0.0

def dice(p, g):                      # Dice == F1 for masks
    inter = np.logical_and(p, g).sum()
    denom = p.sum() + g.sum()
    return 2 * inter / denom if denom else 0.0

pred = np.array([[1, 1, 0], [1, 0, 0]], dtype=bool)
gt   = np.array([[1, 1, 1], [0, 0, 0]], dtype=bool)
print("mask IoU:", mask_iou(pred, gt), "Dice:", round(dice(pred, gt), 3))  # 0.5, 0.667

# ---- real detection mAP with torchmetrics (COCO mAP@[.5:.95]) ----
import torch
from torchmetrics.detection import MeanAveragePrecision

preds = [dict(
    boxes=torch.tensor([[10., 10., 50., 50.]]),
    scores=torch.tensor([0.9]),
    labels=torch.tensor([0]),
)]
target = [dict(
    boxes=torch.tensor([[12., 12., 52., 52.]]),
    labels=torch.tensor([0]),
)]
metric = MeanAveragePrecision(iou_type="bbox")   # also "segm" for masks
metric.update(preds, target)
res = metric.compute()
print("COCO mAP@[.5:.95]:", res["map"].item())
print("mAP@.50:", res["map_50"].item(), " mAP@.75:", res["map_75"].item())

# ---- real segmentation metrics with torchmetrics ----
from torchmetrics.segmentation import MeanIoU, DiceScore
miou = MeanIoU(num_classes=2)        # mIoU over classes (background + object)
ds = DiceScore(num_classes=2)        # Dice / F1 for masks
pred_t = torch.tensor([[[1, 1, 0], [1, 0, 0]]])
gt_t   = torch.tensor([[[1, 1, 1], [0, 0, 0]]])
print("mIoU:", miou(pred_t, gt_t).item())
print("Dice:", ds(pred_t, gt_t).item())
# Panoptic Quality (PQ) lives in torchmetrics.detection.PanopticQuality.`
  };

  window.CODEVIZ[ID] = {
    question: "Take one real handwritten 0 from load_digits, box its ink, and score candidate boxes by IoU — how fast does overlap fall as a box shifts or loosens?",
    charts: [
      {
        type: "bars",
        title: "IoU of candidate boxes against the true digit-0 box",
        xlabel: "candidate box",
        ylabel: "IoU (overlap / union)",
        labels: ["perfect", "loose +1 margin", "shift +1px", "too small", "big shift +3px"],
        values: [1.0, 0.6, 0.574, 0.5, 0.231],
        colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#ffb454", "#ff7b72"]
      }
    ],
    caption: "Real IoU on one load_digits '0': the perfect box scores 1.0, a 1-pixel-loose box 0.6, a 1-pixel shift 0.574, a too-tight box 0.5, and a 3-pixel shift only 0.231 — overlap collapses quickly once a box stops hugging the ink.",
    code: `import numpy as np
from sklearn.datasets import load_digits

# one real 8x8 handwritten "0"
img = load_digits().images[0]
ink = img > 4                       # ink pixels
ys, xs = np.where(ink)
# true box from the ink extent, as (x0, y0, x1, y1)
true_box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)   # (1, 0, 7, 8)

def iou(a, b):
    ix0, iy0 = max(a[0], b[0]), max(a[1], b[1])
    ix1, iy1 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, ix1 - ix0) * max(0, iy1 - iy0)
    union = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter / union if union else 0.0

x0, y0, x1, y1 = true_box
candidates = {
    "perfect":         true_box,
    "loose +1 margin": (x0-1, y0-1, x1+1, y1+1),
    "shift +1px":      (x0+1, y0+1, x1+1, y1+1),
    "too small":       (x0+1, y0+1, x1-1, y1-1),
    "big shift +3px":  (x0+3, y0+2, x1+3, y1+2),
}
for name, box in candidates.items():
    print(name, round(iou(true_box, box), 3))
# perfect 1.0 | loose +1 margin 0.6 | shift +1px 0.574 | too small 0.5 | big shift +3px 0.231`
  };
})();
