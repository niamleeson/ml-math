# Object Detection
> **Source:** CS 230 · **Category:** Method/Model · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an `.ipynb` will be generated.

## ✍️ Toy Examples

These object-detection toys trace the geometry and post-processing mechanics with tiny boxes. Each block prints the intermediate coordinates, areas, scores, decisions, and one visualization before the larger worked example begins.

### ✍️ Toy 1 · Bounding-box conversion, area, and clipping

Corner boxes are convenient for drawing and overlap; center-size boxes are convenient for model outputs. Clipping keeps predicted boxes inside image bounds.

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

t1_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t1_box_xyxy = np.array([1.0, 2.0, 5.0, 6.0])  # -> [x1, y1, x2, y2]
t1_center_x = (t1_box_xyxy[0] + t1_box_xyxy[2]) / 2.0  # -> 3.0
t1_center_y = (t1_box_xyxy[1] + t1_box_xyxy[3]) / 2.0  # -> 4.0
t1_width = t1_box_xyxy[2] - t1_box_xyxy[0]  # -> 4.0
t1_height = t1_box_xyxy[3] - t1_box_xyxy[1]  # -> 4.0
t1_box_center = np.array([t1_center_x, t1_center_y, t1_width, t1_height])  # -> [3.0, 4.0, 4.0, 4.0]
t1_box_back = np.array([t1_center_x - t1_width / 2.0, t1_center_y - t1_height / 2.0, t1_center_x + t1_width / 2.0, t1_center_y + t1_height / 2.0])  # -> [1.0, 2.0, 5.0, 6.0]
t1_area = t1_width * t1_height  # -> 16.0
t1_raw_box = np.array([-1.0, 1.0, 7.0, 5.0])  # -> box spills outside a 6x6 image
t1_bounds = np.array([0.0, 0.0, 6.0, 6.0])  # -> image bounds
t1_clipped = np.array([max(t1_bounds[0], t1_raw_box[0]), max(t1_bounds[1], t1_raw_box[1]), min(t1_bounds[2], t1_raw_box[2]), min(t1_bounds[3], t1_raw_box[3])])  # -> [0.0, 1.0, 6.0, 5.0]
t1_clipped_width = t1_clipped[2] - t1_clipped[0]  # -> 6.0
t1_clipped_height = t1_clipped[3] - t1_clipped[1]  # -> 4.0
t1_clipped_area = t1_clipped_width * t1_clipped_height  # -> 24.0
print("rng seed:", 0)
print("corner box:", t1_box_xyxy.tolist())
print("center x, y:", [t1_center_x, t1_center_y])
print("width, height:", [t1_width, t1_height])
print("center-size box:", t1_box_center.tolist())
print("round trip back to corners:", t1_box_back.tolist())
print("area:", float(t1_area))
print("raw spilling box:", t1_raw_box.tolist())
print("image bounds:", t1_bounds.tolist())
print("clipped box:", t1_clipped.tolist())
print("clipped area:", float(t1_clipped_area))
assert np.allclose(t1_box_back, t1_box_xyxy)
assert t1_area == 16.0 and t1_clipped_area == 24.0

t1_fig, t1_ax = plt.subplots(figsize=(5, 4))
t1_ax.set_xlim(0, 7)
t1_ax.set_ylim(7, 0)
t1_ax.grid(True, alpha=0.3)
t1_ax.add_patch(Rectangle((t1_box_xyxy[0], t1_box_xyxy[1]), t1_width, t1_height, fill=False, edgecolor="tab:blue", linewidth=2, label="original"))
t1_ax.add_patch(Rectangle((t1_clipped[0], t1_clipped[1]), t1_clipped_width, t1_clipped_height, fill=False, edgecolor="tab:orange", linewidth=2, label="clipped"))
t1_ax.scatter([t1_center_x], [t1_center_y], color="tab:red", label="center")
t1_ax.set_title("Box formats and clipping")
t1_ax.legend()
plt.show()
```
▶ What you'll see: the original box round-trips through center-size form, and the orange clipped box stays inside the 6×6 image bounds.

### ✍️ Toy 2 · IoU from intersection and union

Intersection over Union is the overlap area divided by the total area covered by either box.

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

t2_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t2_box_a = np.array([1.0, 1.0, 5.0, 4.0])  # -> target-like box
t2_box_b = np.array([3.0, 2.0, 6.0, 5.0])  # -> predicted-like box
t2_left = max(t2_box_a[0], t2_box_b[0])  # -> 3.0
t2_top = max(t2_box_a[1], t2_box_b[1])  # -> 2.0
t2_right = min(t2_box_a[2], t2_box_b[2])  # -> 5.0
t2_bottom = min(t2_box_a[3], t2_box_b[3])  # -> 4.0
t2_intersection = np.array([t2_left, t2_top, t2_right, t2_bottom])  # -> [3.0, 2.0, 5.0, 4.0]
t2_inter_width = max(0.0, t2_right - t2_left)  # -> 2.0
t2_inter_height = max(0.0, t2_bottom - t2_top)  # -> 2.0
t2_inter_area = t2_inter_width * t2_inter_height  # -> 4.0
t2_area_a = (t2_box_a[2] - t2_box_a[0]) * (t2_box_a[3] - t2_box_a[1])  # -> 12.0
t2_area_b = (t2_box_b[2] - t2_box_b[0]) * (t2_box_b[3] - t2_box_b[1])  # -> 9.0
t2_union_area = t2_area_a + t2_area_b - t2_inter_area  # -> 17.0
t2_iou = t2_inter_area / t2_union_area  # -> 0.23529411764705882
print("rng seed:", 0)
print("box A:", t2_box_a.tolist())
print("box B:", t2_box_b.tolist())
print("intersection box:", t2_intersection.tolist())
print("intersection width, height:", [t2_inter_width, t2_inter_height])
print("intersection area:", float(t2_inter_area))
print("area A:", float(t2_area_a))
print("area B:", float(t2_area_b))
print("union area:", float(t2_union_area))
print("IoU:", round(float(t2_iou), 3))
assert t2_inter_area == 4.0 and t2_union_area == 17.0
assert np.isclose(t2_iou, 4.0 / 17.0)

t2_fig, t2_ax = plt.subplots(figsize=(5, 4))
t2_ax.set_xlim(0, 7)
t2_ax.set_ylim(6, 0)
t2_ax.grid(True, alpha=0.3)
t2_ax.add_patch(Rectangle((t2_box_a[0], t2_box_a[1]), t2_box_a[2] - t2_box_a[0], t2_box_a[3] - t2_box_a[1], fill=False, edgecolor="tab:blue", linewidth=2, label="A"))
t2_ax.add_patch(Rectangle((t2_box_b[0], t2_box_b[1]), t2_box_b[2] - t2_box_b[0], t2_box_b[3] - t2_box_b[1], fill=False, edgecolor="tab:orange", linewidth=2, label="B"))
t2_ax.add_patch(Rectangle((t2_intersection[0], t2_intersection[1]), t2_inter_width, t2_inter_height, facecolor="limegreen", alpha=0.35, label="intersection"))
t2_ax.set_title(f"IoU = {t2_iou:.3f}")
t2_ax.legend()
plt.show()
```
▶ What you'll see: two boxes with a green 2×2 overlap; the printed ratio is 4 / 17 = 0.235.

### ✍️ Toy 3 · Anchor-box matching by IoU

Anchors are preset shapes at a grid cell. Matching chooses the anchor with the largest IoU to the target object.

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

t3_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t3_cell_center = np.array([4.0, 4.0])  # -> one grid-cell center
t3_anchor_sizes = np.array([[2.0, 2.0], [4.0, 2.0], [2.0, 4.0]])  # -> square, wide, tall anchors
t3_anchor_names = np.array(["square", "wide", "tall"])  # -> names for printing
t3_anchor_boxes = np.array([[t3_cell_center[0] - t3_size[0] / 2.0, t3_cell_center[1] - t3_size[1] / 2.0, t3_cell_center[0] + t3_size[0] / 2.0, t3_cell_center[1] + t3_size[1] / 2.0] for t3_size in t3_anchor_sizes])  # -> [[3,3,5,5], [2,3,6,5], [3,2,5,6]]
t3_target = np.array([3.0, 2.0, 5.0, 6.0])  # -> tall target object
t3_inter_left = np.maximum(t3_anchor_boxes[:, 0], t3_target[0])  # -> [3.0, 3.0, 3.0]
t3_inter_top = np.maximum(t3_anchor_boxes[:, 1], t3_target[1])  # -> [3.0, 3.0, 2.0]
t3_inter_right = np.minimum(t3_anchor_boxes[:, 2], t3_target[2])  # -> [5.0, 5.0, 5.0]
t3_inter_bottom = np.minimum(t3_anchor_boxes[:, 3], t3_target[3])  # -> [5.0, 5.0, 6.0]
t3_inter_area = np.maximum(0.0, t3_inter_right - t3_inter_left) * np.maximum(0.0, t3_inter_bottom - t3_inter_top)  # -> [4.0, 4.0, 8.0]
t3_anchor_area = t3_anchor_sizes[:, 0] * t3_anchor_sizes[:, 1]  # -> [4.0, 8.0, 8.0]
t3_target_area = (t3_target[2] - t3_target[0]) * (t3_target[3] - t3_target[1])  # -> 8.0
t3_union_area = t3_anchor_area + t3_target_area - t3_inter_area  # -> [8.0, 12.0, 8.0]
t3_ious = t3_inter_area / t3_union_area  # -> [0.5, 0.3333333333, 1.0]
t3_best = int(np.argmax(t3_ious))  # -> 2
print("rng seed:", 0)
print("cell center:", t3_cell_center.tolist())
print("anchor boxes:", t3_anchor_boxes.tolist())
print("target box:", t3_target.tolist())
print("intersection areas:", t3_inter_area.tolist())
print("anchor areas:", t3_anchor_area.tolist())
print("union areas:", t3_union_area.tolist())
print("anchor IoUs:", dict(zip(t3_anchor_names.tolist(), np.round(t3_ious, 3).tolist())))
print("best anchor:", str(t3_anchor_names[t3_best]))
assert np.allclose(t3_ious, [0.5, 1.0 / 3.0, 1.0])
assert t3_best == 2

t3_fig, t3_ax = plt.subplots(figsize=(5, 4))
t3_ax.set_xlim(1, 7)
t3_ax.set_ylim(7, 1)
t3_ax.grid(True, alpha=0.3)
t3_colors = ["tab:blue", "tab:orange", "tab:green"]
for t3_i, t3_box in enumerate(t3_anchor_boxes):
    t3_ax.add_patch(Rectangle((t3_box[0], t3_box[1]), t3_box[2] - t3_box[0], t3_box[3] - t3_box[1], fill=False, edgecolor=t3_colors[t3_i], linewidth=2, label=t3_anchor_names[t3_i]))
t3_ax.add_patch(Rectangle((t3_target[0], t3_target[1]), t3_target[2] - t3_target[0], t3_target[3] - t3_target[1], fill=False, edgecolor="black", linestyle="--", linewidth=2, label="target"))
t3_ax.scatter([t3_cell_center[0]], [t3_cell_center[1]], color="black", zorder=3)
t3_ax.set_title("Tall anchor wins by IoU")
t3_ax.legend()
plt.show()
```
▶ What you'll see: square, wide, and tall anchors share a center; the tall anchor exactly matches the target with IoU 1.0.

### ✍️ Toy 4 · Bounding-box regression targets

Box regression predicts offsets from an anchor, then decodes those offsets back into a target box.

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

t4_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t4_anchor_center = np.array([4.0, 4.0])  # -> anchor center (cx, cy)
t4_anchor_size = np.array([2.0, 4.0])  # -> anchor width and height
t4_anchor_box = np.array([3.0, 2.0, 5.0, 6.0])  # -> anchor corners
t4_target_box = np.array([3.5, 1.5, 6.5, 5.5])  # -> desired target corners
t4_target_center = np.array([(t4_target_box[0] + t4_target_box[2]) / 2.0, (t4_target_box[1] + t4_target_box[3]) / 2.0])  # -> [5.0, 3.5]
t4_target_size = np.array([t4_target_box[2] - t4_target_box[0], t4_target_box[3] - t4_target_box[1]])  # -> [3.0, 4.0]
t4_tx = (t4_target_center[0] - t4_anchor_center[0]) / t4_anchor_size[0]  # -> 0.5
t4_ty = (t4_target_center[1] - t4_anchor_center[1]) / t4_anchor_size[1]  # -> -0.125
t4_tw = np.log(t4_target_size[0] / t4_anchor_size[0])  # -> 0.4054651081081644
t4_th = np.log(t4_target_size[1] / t4_anchor_size[1])  # -> 0.0
t4_targets = np.array([t4_tx, t4_ty, t4_tw, t4_th])  # -> [0.5, -0.125, 0.4055, 0.0]
t4_decoded_center = np.array([t4_tx * t4_anchor_size[0] + t4_anchor_center[0], t4_ty * t4_anchor_size[1] + t4_anchor_center[1]])  # -> [5.0, 3.5]
t4_decoded_size = np.exp(np.array([t4_tw, t4_th])) * t4_anchor_size  # -> [3.0, 4.0]
t4_decoded_box = np.array([t4_decoded_center[0] - t4_decoded_size[0] / 2.0, t4_decoded_center[1] - t4_decoded_size[1] / 2.0, t4_decoded_center[0] + t4_decoded_size[0] / 2.0, t4_decoded_center[1] + t4_decoded_size[1] / 2.0])  # -> [3.5, 1.5, 6.5, 5.5]
print("rng seed:", 0)
print("anchor center:", t4_anchor_center.tolist())
print("anchor size:", t4_anchor_size.tolist())
print("target center:", t4_target_center.tolist())
print("target size:", t4_target_size.tolist())
print("regression targets [tx, ty, tw, th]:", np.round(t4_targets, 4).tolist())
print("decoded center:", t4_decoded_center.tolist())
print("decoded size:", np.round(t4_decoded_size, 4).tolist())
print("decoded box:", np.round(t4_decoded_box, 4).tolist())
assert np.allclose(np.round(t4_targets, 4), [0.5, -0.125, 0.4055, 0.0])
assert np.allclose(t4_decoded_box, t4_target_box)

t4_fig, t4_ax = plt.subplots(figsize=(5, 4))
t4_ax.set_xlim(2, 8)
t4_ax.set_ylim(7, 1)
t4_ax.grid(True, alpha=0.3)
t4_ax.add_patch(Rectangle((t4_anchor_box[0], t4_anchor_box[1]), t4_anchor_size[0], t4_anchor_size[1], fill=False, edgecolor="tab:blue", linewidth=2, label="anchor"))
t4_ax.add_patch(Rectangle((t4_target_box[0], t4_target_box[1]), t4_target_size[0], t4_target_size[1], fill=False, edgecolor="tab:orange", linewidth=2, label="target / decoded"))
t4_ax.arrow(t4_anchor_center[0], t4_anchor_center[1], t4_target_center[0] - t4_anchor_center[0], t4_target_center[1] - t4_anchor_center[1], head_width=0.12, color="black", length_includes_head=True)
t4_ax.set_title("Regression targets move and resize an anchor")
t4_ax.legend()
plt.show()
```
▶ What you'll see: the printed offsets decode exactly back to the orange target box.

### ✍️ Toy 5 · YOLO decode, confidence, and filtering

A YOLO-style prediction decodes grid-relative centers, multiplies objectness by class probability, and drops low-confidence boxes.

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

t5_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t5_grid_shape = np.array([2, 2])  # -> 2 rows by 2 columns
t5_cell_size = np.array([4.0, 4.0])  # -> each cell is 4 by 4 units
t5_cell_row_col = np.array([0, 1])  # -> row 0, column 1
t5_cell_origin = np.array([t5_cell_row_col[1] * t5_cell_size[0], t5_cell_row_col[0] * t5_cell_size[1]])  # -> [4.0, 0.0]
t5_local_centers = np.array([[0.25, 0.50], [0.30, 0.55]])  # -> centers as fractions inside the cell
t5_centers = t5_cell_origin + t5_local_centers * t5_cell_size  # -> [[5.0, 2.0], [5.2, 2.2]]
t5_sizes = np.array([[2.0, 2.0], [2.4, 2.0]])  # -> predicted widths and heights
t5_boxes = np.array([[t5_center[0] - t5_size[0] / 2.0, t5_center[1] - t5_size[1] / 2.0, t5_center[0] + t5_size[0] / 2.0, t5_center[1] + t5_size[1] / 2.0] for t5_center, t5_size in zip(t5_centers, t5_sizes)])  # -> decoded boxes
t5_objectness = np.array([0.90, 0.40])  # -> objectness scores
t5_classes = np.array(["cat", "dog"])  # -> class vocabulary
t5_class_probs = np.array([[0.20, 0.80], [0.30, 0.70]])  # -> class probabilities per anchor
t5_best_class = np.argmax(t5_class_probs, axis=1)  # -> [1, 1]
t5_best_prob = t5_class_probs[np.arange(len(t5_objectness)), t5_best_class]  # -> [0.8, 0.7]
t5_confidence = t5_objectness * t5_best_prob  # -> [0.72, 0.28]
t5_threshold = 0.50  # -> confidence cutoff
t5_keep_mask = t5_confidence >= t5_threshold  # -> [True, False]
t5_kept_boxes = t5_boxes[t5_keep_mask]  # -> one kept box
t5_kept_labels = t5_classes[t5_best_class[t5_keep_mask]]  # -> ['dog']
t5_kept_scores = t5_confidence[t5_keep_mask]  # -> [0.72]
print("rng seed:", 0)
print("cell origin:", t5_cell_origin.tolist())
print("local centers:", t5_local_centers.tolist())
print("decoded centers:", np.round(t5_centers, 2).tolist())
print("decoded boxes:", np.round(t5_boxes, 2).tolist())
print("objectness:", t5_objectness.tolist())
print("best class probs:", t5_best_prob.tolist())
print("confidence = objectness * class prob:", t5_confidence.tolist())
print("keep mask:", t5_keep_mask.tolist())
print("kept labels and scores:", list(zip(t5_kept_labels.tolist(), np.round(t5_kept_scores, 2).tolist())))
assert np.allclose(t5_confidence, [0.72, 0.28])
assert t5_keep_mask.tolist() == [True, False]

t5_fig, t5_ax = plt.subplots(figsize=(5, 4))
t5_ax.set_xlim(0, t5_grid_shape[1] * t5_cell_size[0])
t5_ax.set_ylim(t5_grid_shape[0] * t5_cell_size[1], 0)
t5_ax.grid(True, alpha=0.3)
for t5_x in np.arange(0, t5_grid_shape[1] * t5_cell_size[0] + 0.1, t5_cell_size[0]):
    t5_ax.axvline(t5_x, color="black", linewidth=0.8, alpha=0.4)
for t5_y in np.arange(0, t5_grid_shape[0] * t5_cell_size[1] + 0.1, t5_cell_size[1]):
    t5_ax.axhline(t5_y, color="black", linewidth=0.8, alpha=0.4)
for t5_i, t5_box in enumerate(t5_boxes):
    t5_color = "tab:green" if t5_keep_mask[t5_i] else "gray"
    t5_ax.add_patch(Rectangle((t5_box[0], t5_box[1]), t5_box[2] - t5_box[0], t5_box[3] - t5_box[1], fill=False, edgecolor=t5_color, linewidth=2))
    t5_ax.text(t5_box[0], t5_box[1] - 0.1, f"{t5_classes[t5_best_class[t5_i]]} {t5_confidence[t5_i]:.2f}", color=t5_color)
t5_ax.scatter(t5_centers[:, 0], t5_centers[:, 1], color="tab:orange", zorder=3)
t5_ax.set_title("YOLO decode and confidence filtering")
plt.show()
```
▶ What you'll see: two decoded anchor boxes in one grid cell, but only the dog box with confidence 0.72 survives the 0.50 cutoff.

### ✍️ Toy 6 · Class-aware non-max suppression

NMS keeps high-scoring boxes and suppresses lower-scoring same-class duplicates; overlapping boxes of different classes can remain.

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

t6_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t6_boxes = np.array([[1.0, 1.0, 4.0, 4.0], [1.5, 1.5, 4.5, 4.5], [6.0, 1.0, 8.0, 3.0], [1.2, 1.2, 4.2, 4.2]])  # -> four candidate boxes
t6_scores = np.array([0.90, 0.80, 0.70, 0.85])  # -> confidence scores
t6_labels = np.array(["dog", "dog", "dog", "cat"])  # -> class labels
t6_threshold = 0.50  # -> suppress same-class IoU above this value
t6_label_order = np.array(["dog", "cat"])  # -> deterministic class order
t6_keep = []  # -> selected indices will be appended here
t6_suppressed = []  # -> suppressed indices will be appended here
print("rng seed:", 0)
print("boxes:", t6_boxes.tolist())
print("scores:", t6_scores.tolist())
print("labels:", t6_labels.tolist())
for t6_label in t6_label_order:
    t6_class_indices = np.where(t6_labels == t6_label)[0]  # -> candidate indices for this class
    t6_order = t6_class_indices[np.argsort(t6_scores[t6_class_indices])[::-1]]  # -> descending-score order
    print("class", str(t6_label), "score order", t6_order.tolist())
    while len(t6_order) > 0:
        t6_current = int(t6_order[0])  # -> highest-score remaining box
        t6_keep.append(t6_current)
        t6_rest = t6_order[1:]  # -> lower-score boxes to compare
        t6_survivors = []
        for t6_candidate in t6_rest:
            t6_left = max(t6_boxes[t6_current, 0], t6_boxes[t6_candidate, 0])  # -> intersection left
            t6_top = max(t6_boxes[t6_current, 1], t6_boxes[t6_candidate, 1])  # -> intersection top
            t6_right = min(t6_boxes[t6_current, 2], t6_boxes[t6_candidate, 2])  # -> intersection right
            t6_bottom = min(t6_boxes[t6_current, 3], t6_boxes[t6_candidate, 3])  # -> intersection bottom
            t6_inter_area = max(0.0, t6_right - t6_left) * max(0.0, t6_bottom - t6_top)  # -> overlap area
            t6_area_current = (t6_boxes[t6_current, 2] - t6_boxes[t6_current, 0]) * (t6_boxes[t6_current, 3] - t6_boxes[t6_current, 1])  # -> current area
            t6_area_candidate = (t6_boxes[t6_candidate, 2] - t6_boxes[t6_candidate, 0]) * (t6_boxes[t6_candidate, 3] - t6_boxes[t6_candidate, 1])  # -> candidate area
            t6_iou = t6_inter_area / (t6_area_current + t6_area_candidate - t6_inter_area)  # -> IoU for NMS decision
            print("compare", t6_current, "vs", int(t6_candidate), "IoU", round(float(t6_iou), 3))
            if t6_iou > t6_threshold:
                t6_suppressed.append(int(t6_candidate))
            else:
                t6_survivors.append(int(t6_candidate))
        t6_order = np.array(t6_survivors, dtype=int)
t6_keep = np.array(t6_keep, dtype=int)  # -> [0, 2, 3]
t6_suppressed = np.array(t6_suppressed, dtype=int)  # -> [1]
print("kept indices:", t6_keep.tolist())
print("suppressed indices:", t6_suppressed.tolist())
assert set(t6_keep.tolist()) == {0, 2, 3}
assert t6_suppressed.tolist() == [1]

t6_fig, t6_axes = plt.subplots(1, 2, figsize=(8, 3.8), sharex=True, sharey=True)
for t6_ax, t6_title, t6_indices in zip(t6_axes, ["before NMS", "after NMS"], [np.arange(len(t6_boxes)), t6_keep]):
    t6_ax.set_xlim(0, 9)
    t6_ax.set_ylim(5, 0)
    t6_ax.grid(True, alpha=0.3)
    t6_ax.set_title(t6_title)
    for t6_i in t6_indices:
        t6_box = t6_boxes[t6_i]
        t6_color = "tab:orange" if t6_labels[t6_i] == "dog" else "tab:purple"
        t6_ax.add_patch(Rectangle((t6_box[0], t6_box[1]), t6_box[2] - t6_box[0], t6_box[3] - t6_box[1], fill=False, edgecolor=t6_color, linewidth=2))
        t6_ax.text(t6_box[0], t6_box[1] - 0.1, f"{t6_i}:{t6_labels[t6_i]} {t6_scores[t6_i]:.2f}", color=t6_color)
t6_fig.tight_layout()
plt.show()
```
▶ What you'll see: dog box 1 is suppressed as a duplicate of dog box 0, but the overlapping cat box remains because NMS is class-aware.

### ✍️ Toy 7 · Precision and recall at an IoU threshold

Detector evaluation sorts predictions by confidence, matches each to an unused ground-truth box of the same class, and counts TP/FP/FN.

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

t7_rng = np.random.default_rng(0)  # -> reproducible generator seeded with 0
t7_gt_boxes = np.array([[1.0, 1.0, 3.0, 3.0], [5.0, 1.0, 7.0, 3.0], [1.0, 5.0, 3.0, 7.0]])  # -> three ground-truth boxes
t7_gt_labels = np.array(["dog", "cat", "dog"])  # -> ground-truth classes
t7_pred_boxes = np.array([[1.0, 1.0, 3.0, 3.0], [1.2, 5.2, 3.2, 7.2], [5.5, 1.0, 7.5, 3.0], [8.0, 8.0, 9.0, 9.0]])  # -> four predictions
t7_pred_labels = np.array(["dog", "dog", "cat", "dog"])  # -> predicted classes
t7_pred_scores = np.array([0.90, 0.80, 0.70, 0.60])  # -> confidence scores
t7_iou_threshold = 0.50  # -> match threshold
t7_iou_matrix = np.zeros((len(t7_pred_boxes), len(t7_gt_boxes)))  # -> pairwise IoU table
for t7_i in range(len(t7_pred_boxes)):
    for t7_j in range(len(t7_gt_boxes)):
        t7_left = max(t7_pred_boxes[t7_i, 0], t7_gt_boxes[t7_j, 0])  # -> intersection left
        t7_top = max(t7_pred_boxes[t7_i, 1], t7_gt_boxes[t7_j, 1])  # -> intersection top
        t7_right = min(t7_pred_boxes[t7_i, 2], t7_gt_boxes[t7_j, 2])  # -> intersection right
        t7_bottom = min(t7_pred_boxes[t7_i, 3], t7_gt_boxes[t7_j, 3])  # -> intersection bottom
        t7_inter_area = max(0.0, t7_right - t7_left) * max(0.0, t7_bottom - t7_top)  # -> overlap area
        t7_pred_area = (t7_pred_boxes[t7_i, 2] - t7_pred_boxes[t7_i, 0]) * (t7_pred_boxes[t7_i, 3] - t7_pred_boxes[t7_i, 1])  # -> prediction area
        t7_gt_area = (t7_gt_boxes[t7_j, 2] - t7_gt_boxes[t7_j, 0]) * (t7_gt_boxes[t7_j, 3] - t7_gt_boxes[t7_j, 1])  # -> ground-truth area
        t7_union_area = t7_pred_area + t7_gt_area - t7_inter_area  # -> union area
        t7_iou_matrix[t7_i, t7_j] = 0.0 if t7_union_area == 0.0 else t7_inter_area / t7_union_area  # -> pairwise IoU
print("rng seed:", 0)
print("IoU matrix pred x gt:", np.round(t7_iou_matrix, 3).tolist())
t7_order = np.argsort(t7_pred_scores)[::-1]  # -> [0, 1, 2, 3]
t7_matched_gt = set()  # -> matched ground-truth indices
t7_tp = 0  # -> true positives
t7_fp = 0  # -> false positives
for t7_pred_idx in t7_order:
    t7_same_class = t7_gt_labels == t7_pred_labels[t7_pred_idx]  # -> same-class ground truths
    t7_available = np.array([t7_gt_idx not in t7_matched_gt for t7_gt_idx in range(len(t7_gt_boxes))])  # -> unused ground truths
    t7_candidate_mask = t7_same_class & t7_available  # -> valid match candidates
    t7_candidate_ious = np.where(t7_candidate_mask, t7_iou_matrix[t7_pred_idx], -1.0)  # -> invalid matches get -1
    t7_best_gt = int(np.argmax(t7_candidate_ious))  # -> best available same-class gt
    t7_best_iou = t7_candidate_ious[t7_best_gt]  # -> best IoU for this prediction
    if t7_best_iou >= t7_iou_threshold:
        t7_tp += 1
        t7_matched_gt.add(t7_best_gt)
        print("prediction", int(t7_pred_idx), "matched gt", t7_best_gt, "IoU", round(float(t7_best_iou), 3))
    else:
        t7_fp += 1
        print("prediction", int(t7_pred_idx), "is FP with best IoU", round(float(t7_best_iou), 3))
t7_fn = len(t7_gt_boxes) - len(t7_matched_gt)  # -> 0
t7_precision = t7_tp / (t7_tp + t7_fp)  # -> 0.75
t7_recall = t7_tp / (t7_tp + t7_fn)  # -> 1.0
print("TP, FP, FN:", [t7_tp, t7_fp, t7_fn])
print("precision:", round(float(t7_precision), 3))
print("recall:", round(float(t7_recall), 3))
assert (t7_tp, t7_fp, t7_fn) == (3, 1, 0)
assert np.isclose(t7_precision, 0.75) and np.isclose(t7_recall, 1.0)

t7_fig, t7_axes = plt.subplots(1, 2, figsize=(8, 3.8), sharex=True, sharey=True)
for t7_ax, t7_title, t7_boxes, t7_labels in zip(t7_axes, ["ground truth", "predictions"], [t7_gt_boxes, t7_pred_boxes], [t7_gt_labels, t7_pred_labels]):
    t7_ax.set_xlim(0, 10)
    t7_ax.set_ylim(10, 0)
    t7_ax.grid(True, alpha=0.3)
    t7_ax.set_title(t7_title)
    for t7_i, t7_box in enumerate(t7_boxes):
        t7_color = "tab:orange" if t7_labels[t7_i] == "dog" else "tab:purple"
        t7_ax.add_patch(Rectangle((t7_box[0], t7_box[1]), t7_box[2] - t7_box[0], t7_box[3] - t7_box[1], fill=False, edgecolor=t7_color, linewidth=2))
        t7_ax.text(t7_box[0], t7_box[1] - 0.1, str(t7_labels[t7_i]), color=t7_color)
t7_fig.suptitle(f"precision={t7_precision:.2f}, recall={t7_recall:.2f}")
t7_fig.tight_layout()
plt.show()
```
▶ What you'll see: three predictions match ground truth at IoU ≥ 0.50, one prediction is a false positive, so precision is 0.75 and recall is 1.0.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

In plain terms, here is what the steps below will show you:

- **Bounding-box representations** convert cleanly between corners and center-size values.
- **IoU** measures localization quality as intersection area divided by union area.
- **Anchor boxes** give one cell multiple shape priors and select the best prior by IoU.
- **Non-max suppression** removes high-overlap same-class duplicates while keeping different classes separate.
- A **YOLO-style pipeline** decodes a grid/anchor tensor into final scored boxes with thresholding and NMS.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and detector-style mini-pipelines.

**What we will build, step by step:**
1. **Bounding-box representation** — convert between corner boxes and center-size boxes.
2. **Intersection over Union** — compute overlap quality from intersection and union areas.
3. **Anchor boxes** — compare preset shapes at one grid cell to a target object.
4. **Non-max suppression** — keep high-scoring boxes and remove duplicate same-class overlaps.
5. **YOLO-style detection pipeline** — decode grid/anchor predictions into final detections.

### Step 0 — Set up our tools

We import NumPy for box arithmetic and Matplotlib for rectangle drawings. We fix a random
**seed** for reproducibility, then define tiny helpers for box area, IoU, and format conversion
so each later step can print the same geometric quantities it draws.

```python
import numpy as np                                      # NumPy: box arrays, scores, and class probabilities.
import matplotlib.pyplot as plt                         # Matplotlib: draw boxes, grids, and overlap regions.
from matplotlib.patches import Rectangle                # Rectangle patches: visualize bounding boxes directly.

np.random.seed(0)                                        # Fix the seed so every run prints the SAME numbers.
plt.rcParams["figure.figsize"] = (7, 4)                  # Use a comfortable default plot size.


def log(label, value):                                   # A tiny logger so each printed line explains itself.
    print(f"[{label}] {value}")                          # Format is: [what this is] the value.


def center_to_xyxy_demo(box_demo):                       # Convert (cx, cy, w, h) into (x1, y1, x2, y2).
    cx_demo, cy_demo, w_demo, h_demo = np.asarray(box_demo, dtype=float)  # Unpack center-size values.
    return np.array([cx_demo - w_demo / 2.0, cy_demo - h_demo / 2.0, cx_demo + w_demo / 2.0, cy_demo + h_demo / 2.0])  # Return corners.


def xyxy_to_center_demo(box_demo):                       # Convert (x1, y1, x2, y2) into (cx, cy, w, h).
    x1_demo, y1_demo, x2_demo, y2_demo = np.asarray(box_demo, dtype=float)  # Unpack corner values.
    return np.array([(x1_demo + x2_demo) / 2.0, (y1_demo + y2_demo) / 2.0, x2_demo - x1_demo, y2_demo - y1_demo])  # Return center-size.


def area_demo(box_demo):                                 # Compute area for a corner-format box.
    x1_demo, y1_demo, x2_demo, y2_demo = np.asarray(box_demo, dtype=float)  # Unpack corners.
    width_demo = max(0.0, x2_demo - x1_demo)              # Clip width at zero for non-overlap or invalid boxes.
    height_demo = max(0.0, y2_demo - y1_demo)             # Clip height at zero for non-overlap or invalid boxes.
    return width_demo * height_demo                       # Return rectangle area.


def iou_demo(box_a_demo, box_b_demo):                     # Compute Intersection over Union for two boxes.
    left_demo = max(box_a_demo[0], box_b_demo[0])          # Intersection left edge is the larger left coordinate.
    top_demo = max(box_a_demo[1], box_b_demo[1])           # Intersection top edge is the larger top coordinate.
    right_demo = min(box_a_demo[2], box_b_demo[2])         # Intersection right edge is the smaller right coordinate.
    bottom_demo = min(box_a_demo[3], box_b_demo[3])        # Intersection bottom edge is the smaller bottom coordinate.
    inter_demo = np.array([left_demo, top_demo, right_demo, bottom_demo])  # Store the overlap rectangle.
    inter_area_demo = area_demo(inter_demo)                # Measure overlap area.
    union_demo = area_demo(box_a_demo) + area_demo(box_b_demo) - inter_area_demo  # Compute union area.
    return (0.0 if union_demo == 0.0 else inter_area_demo / union_demo), inter_demo, inter_area_demo, union_demo  # Return all pieces.

log("setup", "box helpers ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup.
```
▶ What you'll see: one line confirming the detection helpers are ready.

### Step 1 — Bounding-box representation: corners and center-size are the same rectangle

A detector can describe one object box by corners $(x_1,y_1,x_2,y_2)$ or by center, width, and
height $(b_x,b_y,b_w,b_h)$. Corners are handy for drawing and overlap; center-size is handy when
neural nets predict offsets around grid cells and anchors.

```python
box_xyxy_demo = np.array([2.0, 1.5, 7.0, 5.5])          # Define one box as left, top, right, bottom.
box_center_demo = xyxy_to_center_demo(box_xyxy_demo)    # Convert corners to center x, center y, width, height.
box_back_demo = center_to_xyxy_demo(box_center_demo)    # Convert center-size back to corners.
log("corner box", box_xyxy_demo.tolist())               # Print drawable corner coordinates.
log("center-size box", box_center_demo.tolist())        # Print detector-style center-size values.
log("round trip matches?", bool(np.allclose(box_xyxy_demo, box_back_demo)))  # Verify conversion preserved the box.

fig_box_demo, ax_box_demo = plt.subplots(figsize=(6, 4)) # Create a coordinate-grid figure.
ax_box_demo.set_xlim(0, 10)                              # Show a ten-unit image width.
ax_box_demo.set_ylim(0, 7)                               # Show a seven-unit image height.
ax_box_demo.invert_yaxis()                               # Match image coordinates where y increases downward.
ax_box_demo.grid(True, alpha=0.3)                        # Draw a light grid for reading coordinates.
ax_box_demo.add_patch(Rectangle((box_xyxy_demo[0], box_xyxy_demo[1]), box_center_demo[2], box_center_demo[3], fill=False, edgecolor="tab:blue", linewidth=2))  # Draw the box.
ax_box_demo.scatter([box_center_demo[0]], [box_center_demo[1]], color="tab:red", zorder=3)  # Mark the center point.
ax_box_demo.text(box_center_demo[0] + 0.15, box_center_demo[1], "center", color="tab:red")  # Label the center.
ax_box_demo.set_title("Bounding-box corners and center-size form")   # Title the plot.
ax_box_demo.set_xlabel("x coordinate")                              # Label the horizontal coordinate.
ax_box_demo.set_ylabel("y coordinate")                              # Label the vertical coordinate.
plt.show()                                                          # Render the box visualization.
```
▶ What you'll see: one rectangle with a red center marker; the printed center-size values reconstruct the same corners.

### Step 2 — Intersection over Union: overlap divided by total covered area

IoU measures localization quality. We first find the overlap rectangle, clip impossible overlap
widths/heights at zero through `area_demo()`, then divide intersection area by union area so the
score always lives between 0 and 1.

```python
box_a_demo = np.array([1.0, 1.0, 6.0, 5.0])             # Define a target-like box.
box_b_demo = np.array([4.0, 3.0, 9.0, 6.5])             # Define a prediction-like box with partial overlap.
iou_value_demo, inter_box_demo, inter_area_demo, union_area_demo = iou_demo(box_a_demo, box_b_demo)  # Compute IoU and all pieces.
log("intersection box", np.round(inter_box_demo, 2).tolist())  # Print overlap corners.
log("area A", area_demo(box_a_demo))                           # Print first box area.
log("area B", area_demo(box_b_demo))                           # Print second box area.
log("intersection area", inter_area_demo)                      # Print overlap numerator.
log("union area", union_area_demo)                             # Print IoU denominator.
log("IoU", round(float(iou_value_demo), 3))                    # Print final overlap score.

fig_iou_demo, ax_iou_demo = plt.subplots(figsize=(6.5, 4.5))    # Create an IoU geometry figure.
ax_iou_demo.set_xlim(0, 10)                                     # Show the toy image width.
ax_iou_demo.set_ylim(0, 8)                                      # Show the toy image height.
ax_iou_demo.invert_yaxis()                                      # Match image-style coordinates.
ax_iou_demo.grid(True, alpha=0.3)                               # Draw a coordinate grid.
ax_iou_demo.add_patch(Rectangle((box_a_demo[0], box_a_demo[1]), box_a_demo[2] - box_a_demo[0], box_a_demo[3] - box_a_demo[1], fill=False, edgecolor="tab:blue", linewidth=2, label="A"))  # Draw box A.
ax_iou_demo.add_patch(Rectangle((box_b_demo[0], box_b_demo[1]), box_b_demo[2] - box_b_demo[0], box_b_demo[3] - box_b_demo[1], fill=False, edgecolor="tab:orange", linewidth=2, label="B"))  # Draw box B.
ax_iou_demo.add_patch(Rectangle((inter_box_demo[0], inter_box_demo[1]), inter_box_demo[2] - inter_box_demo[0], inter_box_demo[3] - inter_box_demo[1], facecolor="limegreen", alpha=0.35, edgecolor="none", label="overlap"))  # Shade intersection.
ax_iou_demo.set_title(f"Intersection over Union = {iou_value_demo:.3f}")  # Title with IoU score.
ax_iou_demo.set_xlabel("x coordinate")                              # Label the x-axis.
ax_iou_demo.set_ylabel("y coordinate")                              # Label the y-axis.
ax_iou_demo.legend(loc="lower right")                              # Show box labels.
plt.show()                                                          # Render the IoU plot.
```
▶ What you'll see: two boxes with a green overlap region, plus printed numerator and denominator for IoU.

### Step 3 — Anchor boxes: preset shapes at one grid cell

Anchors give each grid cell several default shapes. The model predicts offsets and scale changes
from these defaults, so a tall object can start from a tall anchor and a wide object can start
from a wide anchor.

```python
cell_center_demo = np.array([5.0, 4.0])                              # Choose one grid-cell center.
anchor_sizes_demo = np.array([[2.0, 2.0], [4.0, 1.6], [1.4, 4.0]])    # Define square, wide, and tall anchors.
anchor_names_demo = np.array(["square", "wide", "tall"])            # Name each anchor shape.
anchor_boxes_demo = np.array([center_to_xyxy_demo([cell_center_demo[0], cell_center_demo[1], size_demo[0], size_demo[1]]) for size_demo in anchor_sizes_demo])  # Convert anchors to corners.
target_anchor_demo = np.array([3.6, 2.1, 6.6, 5.7])                  # Define a nearby target object.
anchor_ious_demo = np.array([iou_demo(anchor_demo, target_anchor_demo)[0] for anchor_demo in anchor_boxes_demo])  # Compare each anchor to target.
best_anchor_demo = int(np.argmax(anchor_ious_demo))                  # Select the anchor with highest IoU.
target_center_demo = xyxy_to_center_demo(target_anchor_demo)         # Convert target to center-size form.
offset_demo = target_center_demo[:2] - cell_center_demo              # Compute center offset from the grid cell.
scale_demo = target_center_demo[2:] / anchor_sizes_demo[best_anchor_demo]  # Compute size scale relative to best anchor.
log("anchor IoUs", dict(zip(anchor_names_demo.tolist(), np.round(anchor_ious_demo, 3).tolist())))  # Print anchor matching scores.
log("best anchor", str(anchor_names_demo[best_anchor_demo]))         # Print selected anchor shape.
log("target center offset", np.round(offset_demo, 2).tolist())       # Print residual center prediction.
log("target size / best anchor size", np.round(scale_demo, 2).tolist())  # Print residual scale prediction.

fig_anchor_demo, ax_anchor_demo = plt.subplots(figsize=(6.5, 5))      # Create an anchor geometry figure.
ax_anchor_demo.set_xlim(0, 10)                                       # Show image width.
ax_anchor_demo.set_ylim(0, 8)                                        # Show image height.
ax_anchor_demo.invert_yaxis()                                        # Match image-coordinate orientation.
ax_anchor_demo.grid(True, alpha=0.3)                                 # Draw coordinate grid.
colors_anchor_demo = ["tab:blue", "tab:orange", "tab:green"]        # Choose one color per anchor.
for idx_anchor_demo, anchor_demo in enumerate(anchor_boxes_demo):     # Draw each preset anchor.
    ax_anchor_demo.add_patch(Rectangle((anchor_demo[0], anchor_demo[1]), anchor_demo[2] - anchor_demo[0], anchor_demo[3] - anchor_demo[1], fill=False, edgecolor=colors_anchor_demo[idx_anchor_demo], linewidth=2, label=anchor_names_demo[idx_anchor_demo]))  # Draw anchor.
ax_anchor_demo.add_patch(Rectangle((target_anchor_demo[0], target_anchor_demo[1]), target_anchor_demo[2] - target_anchor_demo[0], target_anchor_demo[3] - target_anchor_demo[1], fill=False, edgecolor="black", linestyle="--", linewidth=2, label="target"))  # Draw target.
ax_anchor_demo.scatter([cell_center_demo[0]], [cell_center_demo[1]], color="black", zorder=3)  # Mark shared anchor center.
ax_anchor_demo.set_title("Anchor boxes compare preset shapes")        # Title the anchor plot.
ax_anchor_demo.set_xlabel("x coordinate")                            # Label the x-axis.
ax_anchor_demo.set_ylabel("y coordinate")                            # Label the y-axis.
ax_anchor_demo.legend(loc="lower right")                             # Show anchor names.
plt.show()                                                            # Render anchor comparison.
```
▶ What you'll see: square, wide, and tall anchors share one center; the target matches one preset best and needs only an offset/scale correction.

### Step 4 — Non-max suppression: keep the best box and remove duplicates

Raw detectors often output several boxes around the same object. NMS sorts by score, keeps the
best remaining box, and suppresses lower-scoring **same-class** boxes whose IoU with it is above
a threshold.

```python
boxes_nms_demo = np.array([[1.0, 1.0, 5.0, 4.5], [1.3, 1.2, 5.2, 4.6], [6.4, 1.3, 9.2, 4.2], [1.2, 1.1, 5.1, 4.4]])  # Define duplicate and separate candidates.
scores_nms_demo = np.array([0.92, 0.84, 0.76, 0.67])                # Assign detector confidence scores.
labels_nms_demo = np.array(["dog", "dog", "dog", "cat"])          # Make one overlapping box a different class.
threshold_nms_demo = 0.45                                           # Suppress same-class boxes above this IoU.
keep_nms_demo = []                                                  # Store kept candidate indices.
suppressed_nms_demo = []                                            # Store suppressed candidate indices.
for label_nms_demo in np.unique(labels_nms_demo):                   # Run NMS independently per class.
    class_idx_demo = np.where(labels_nms_demo == label_nms_demo)[0]  # Select candidates of this class.
    order_nms_demo = class_idx_demo[np.argsort(scores_nms_demo[class_idx_demo])[::-1]]  # Sort by descending score.
    while len(order_nms_demo) > 0:                                  # Process until no candidates remain.
        current_nms_demo = int(order_nms_demo[0])                   # Pick highest-score remaining box.
        keep_nms_demo.append(current_nms_demo)                      # Keep it as a representative detection.
        rest_nms_demo = order_nms_demo[1:]                          # Compare only lower-score boxes.
        survivors_nms_demo = []                                     # Store boxes not suppressed by current.
        for candidate_nms_demo in rest_nms_demo:                    # Inspect each lower-score same-class candidate.
            overlap_nms_demo = iou_demo(boxes_nms_demo[current_nms_demo], boxes_nms_demo[candidate_nms_demo])[0]  # Compute IoU.
            log(f"compare {current_nms_demo} vs {int(candidate_nms_demo)}", round(float(overlap_nms_demo), 3))  # Print NMS decision input.
            if overlap_nms_demo > threshold_nms_demo:               # Suppress if overlap is too high.
                suppressed_nms_demo.append(int(candidate_nms_demo)) # Record suppressed duplicate.
            else:                                                   # Otherwise keep candidate alive.
                survivors_nms_demo.append(candidate_nms_demo)       # Preserve for a later NMS round.
        order_nms_demo = np.array(survivors_nms_demo, dtype=int)    # Continue with unsuppressed boxes.
keep_nms_demo = np.array(keep_nms_demo, dtype=int)                  # Convert kept list to an array.
log("kept after NMS", keep_nms_demo.tolist())                       # Print final kept indices.
log("suppressed duplicates", suppressed_nms_demo)                   # Print suppressed indices.

fig_nms_demo, axes_nms_demo = plt.subplots(1, 2, figsize=(10, 4), sharex=True, sharey=True)  # Create before/after panels.
for ax_nms_demo, title_nms_demo, idxs_nms_demo in zip(axes_nms_demo, ["before NMS", "after NMS"], [np.arange(len(boxes_nms_demo)), keep_nms_demo]):  # Fill panels.
    ax_nms_demo.set_xlim(0, 10)                                      # Show image width.
    ax_nms_demo.set_ylim(0, 6)                                       # Show image height.
    ax_nms_demo.invert_yaxis()                                       # Match image coordinates.
    ax_nms_demo.grid(True, alpha=0.3)                                # Draw a coordinate grid.
    ax_nms_demo.set_title(title_nms_demo)                            # Title panel state.
    for idx_nms_demo in idxs_nms_demo:                               # Draw selected candidate boxes.
        box_nms_demo = boxes_nms_demo[idx_nms_demo]                  # Select one box.
        color_nms_demo = "tab:red" if idx_nms_demo in keep_nms_demo else "gray"  # Highlight kept boxes.
        ax_nms_demo.add_patch(Rectangle((box_nms_demo[0], box_nms_demo[1]), box_nms_demo[2] - box_nms_demo[0], box_nms_demo[3] - box_nms_demo[1], fill=False, edgecolor=color_nms_demo, linewidth=2))  # Draw the box.
        ax_nms_demo.text(box_nms_demo[0], box_nms_demo[1] - 0.1, f"{idx_nms_demo}: {labels_nms_demo[idx_nms_demo]} {scores_nms_demo[idx_nms_demo]:.2f}", color=color_nms_demo)  # Label box.
plt.show()                                                           # Render NMS before/after.
```
▶ What you'll see: duplicate dog boxes collapse to the highest-scoring dog, while the overlapping cat is kept because NMS is class-aware.

### Step 5 — YOLO-style detection pipeline: decode, score, filter, and suppress

A YOLO-style detector emits a dense tensor shaped like $G 	imes G 	imes k 	imes (5+p)$.
Each grid-cell/anchor prediction contains objectness, box coordinates, and class probabilities;
post-processing decodes boxes, multiplies objectness by class probability, thresholds, then runs NMS.

```python
grid_shape_demo = np.array([2, 2])                                  # Use a tiny 2-by-2 grid.
anchors_yolo_demo = 2                                                # Use two anchor slots per grid cell.
classes_yolo_demo = np.array(["cat", "dog"])                       # Define two possible object classes.
tensor_shape_demo = (grid_shape_demo[0], grid_shape_demo[1], anchors_yolo_demo, 5 + len(classes_yolo_demo))  # Compute YOLO output shape.
cell_size_demo = np.array([5.0, 4.0])                                # Set each cell width and height.
cell_row_col_demo = np.array([1, 0])                                 # Choose one responsible cell as row, column.
cell_origin_demo = np.array([cell_row_col_demo[1] * cell_size_demo[0], cell_row_col_demo[0] * cell_size_demo[1]])  # Convert cell index to image origin.
local_centers_demo = np.array([[0.52, 0.46], [0.55, 0.50]])          # Predict centers as fractions inside the cell.
sizes_yolo_demo = np.array([[2.5, 2.0], [2.8, 2.1]])                # Predict width and height per anchor.
objectness_demo = np.array([0.91, 0.74])                             # Predict objectness per anchor.
class_probs_demo = np.array([[0.12, 0.88], [0.18, 0.82]])            # Predict class probabilities [cat, dog].
centers_yolo_demo = cell_origin_demo + local_centers_demo * cell_size_demo  # Decode centers to image coordinates.
boxes_yolo_demo = np.array([center_to_xyxy_demo([center_demo[0], center_demo[1], size_demo[0], size_demo[1]]) for center_demo, size_demo in zip(centers_yolo_demo, sizes_yolo_demo)])  # Decode corner boxes.
best_class_demo = np.argmax(class_probs_demo, axis=1)                # Select highest-probability class per anchor.
confidence_demo = objectness_demo * class_probs_demo[np.arange(len(objectness_demo)), best_class_demo]  # Combine objectness and class probability.
mask_yolo_demo = confidence_demo >= 0.50                             # Keep predictions above confidence threshold.
filtered_boxes_demo = boxes_yolo_demo[mask_yolo_demo]                # Keep confident boxes.
filtered_scores_demo = confidence_demo[mask_yolo_demo]               # Keep confident scores.
filtered_labels_demo = classes_yolo_demo[best_class_demo[mask_yolo_demo]]  # Keep predicted labels.
order_yolo_demo = np.argsort(filtered_scores_demo)[::-1]             # Sort survivors by confidence.
keep_yolo_demo = []                                                  # Store final detection indices after NMS.
for idx_yolo_demo in order_yolo_demo:                                # Greedily process filtered boxes.
    duplicate_demo = False                                           # Track whether current box overlaps a kept same-class box.
    for kept_yolo_demo in keep_yolo_demo:                            # Compare against already-kept boxes.
        same_class_demo = filtered_labels_demo[idx_yolo_demo] == filtered_labels_demo[kept_yolo_demo]  # Check class match.
        overlap_yolo_demo = iou_demo(filtered_boxes_demo[idx_yolo_demo], filtered_boxes_demo[kept_yolo_demo])[0]  # Compute IoU.
        duplicate_demo = duplicate_demo or (same_class_demo and overlap_yolo_demo > 0.45)  # Mark duplicate if same class and high overlap.
        log(f"YOLO compare {int(idx_yolo_demo)} vs {int(kept_yolo_demo)}", round(float(overlap_yolo_demo), 3))  # Print comparison IoU.
    if not duplicate_demo:                                           # Keep boxes that are not duplicates.
        keep_yolo_demo.append(int(idx_yolo_demo))                    # Add the final detection.
log("YOLO tensor shape", tensor_shape_demo)                         # Print dense output tensor shape.
log("decoded boxes", np.round(boxes_yolo_demo, 2).tolist())         # Print decoded corner boxes.
log("confidence scores", np.round(confidence_demo, 3).tolist())     # Print objectness times class probability.
log("final detections", list(zip(filtered_labels_demo[keep_yolo_demo].tolist(), np.round(filtered_scores_demo[keep_yolo_demo], 3).tolist())))  # Print final label-score pairs.

fig_yolo_demo, ax_yolo_demo = plt.subplots(figsize=(7, 5))           # Create YOLO pipeline figure.
ax_yolo_demo.set_xlim(0, grid_shape_demo[1] * cell_size_demo[0])     # Set image width from grid.
ax_yolo_demo.set_ylim(0, grid_shape_demo[0] * cell_size_demo[1])     # Set image height from grid.
ax_yolo_demo.invert_yaxis()                                          # Match image-coordinate orientation.
ax_yolo_demo.grid(True, alpha=0.35)                                  # Draw a light coordinate grid.
for col_yolo_demo in range(grid_shape_demo[1] + 1):                  # Draw vertical grid lines.
    ax_yolo_demo.axvline(col_yolo_demo * cell_size_demo[0], color="black", linewidth=0.8, alpha=0.4)  # Add one vertical boundary.
for row_yolo_demo in range(grid_shape_demo[0] + 1):                  # Draw horizontal grid lines.
    ax_yolo_demo.axhline(row_yolo_demo * cell_size_demo[1], color="black", linewidth=0.8, alpha=0.4)  # Add one horizontal boundary.
ax_yolo_demo.scatter(centers_yolo_demo[:, 0], centers_yolo_demo[:, 1], color="tab:orange", zorder=3, label="raw centers")  # Show raw centers.
for final_pos_demo in keep_yolo_demo:                                # Draw each final detection.
    box_final_demo = filtered_boxes_demo[final_pos_demo]             # Select final box coordinates.
    ax_yolo_demo.add_patch(Rectangle((box_final_demo[0], box_final_demo[1]), box_final_demo[2] - box_final_demo[0], box_final_demo[3] - box_final_demo[1], fill=False, edgecolor="tab:purple", linewidth=2))  # Draw final box.
    ax_yolo_demo.text(box_final_demo[0], box_final_demo[1] - 0.15, f"{filtered_labels_demo[final_pos_demo]} {filtered_scores_demo[final_pos_demo]:.2f}", color="tab:purple")  # Label final detection.
ax_yolo_demo.set_title("YOLO-style decode → score → filter → NMS")  # Title the pipeline plot.
ax_yolo_demo.set_xlabel("x coordinate")                              # Label x-axis.
ax_yolo_demo.set_ylabel("y coordinate")                              # Label y-axis.
ax_yolo_demo.legend(loc="lower right")                              # Explain center markers.
plt.show()                                                           # Render the YOLO-style output.
```
▶ What you'll see: two raw anchor centers in one grid cell, confidence scores, and one final duplicate-suppressed dog detection.

---

## 1. Overview

Object detection extends image classification from one whole-image label to a structured prediction: a variable-size set of objects, each with a class label, confidence score, and bounding box. This lesson builds every core post-processing idea with NumPy only: box coordinates, Intersection over Union (IoU), anchor boxes, confidence filtering, YOLO-style grid targets, and non-max suppression (NMS).

**One-line intuition:** classification says *what* is in the image; detection says *what, where, and how sure* for every visible object.

## 2. Key Idea

### Bounding-box representation

A detector usually represents a rectangular object either by corners

$$
B=(x_{\min},y_{\min},x_{\max},y_{\max})
$$

or by center, width, and height

$$
B=(b_x,b_y,b_w,b_h).
$$

Corner format is convenient for overlap calculations; center format is convenient for neural-network outputs and anchor-box offsets.

### Intersection over Union

For a predicted box $B_p$ and an annotated/actual box $B_a$, Intersection over Union measures localization quality:

$$
\operatorname{IoU}(B_p,B_a)=\frac{|B_p\cap B_a|}{|B_p\cup B_a|}.
$$

The value is always between 0 and 1. A common acceptance threshold is $\operatorname{IoU}\ge 0.5$, though stricter benchmarks evaluate many thresholds.

### Anchor boxes

Anchor boxes let one grid cell predict objects with different shapes. A tall anchor may match a person, a wide anchor may match a car, and a square anchor may match a sign. The detector learns offsets from each anchor rather than inventing every box shape from scratch.

### Non-max suppression

Raw detectors often produce many boxes around the same object. NMS removes duplicate same-class boxes while keeping the highest-confidence representative.

```text
For each class independently:
  Remove boxes whose confidence is below a chosen threshold.
  While boxes remain:
    Pick the remaining box with maximum confidence.
    Keep it as a final detection.
    Suppress lower-confidence boxes of the same class with IoU above the NMS threshold.
Return all kept boxes from all classes.
```

### YOLO-style detection pipeline

YOLO divides an image into a $G\times G$ grid. Each grid cell and anchor predicts

$$
y=[p_c,b_x,b_y,b_h,b_w,c_1,\ldots,c_p]
$$

so the full output tensor has shape

$$
G\times G\times k\times(5+p),
$$

where $k$ is the number of anchors, $p_c$ is objectness, $(b_x,b_y,b_h,b_w)$ describes the box, and $c_1,\ldots,c_p$ encode class probabilities. In practice, a detector predicts boxes, scores them, filters by confidence, and runs NMS to produce the final set.

## 3. Hands-on Notebook

### Setup

Run this first. The notebook is CPU-only and intentionally avoids pretrained models, downloads, and internet access.

```python
import numpy as np  # use NumPy for all box arithmetic, IoU calculations, anchors, and synthetic detections.
import matplotlib.pyplot as plt  # use Matplotlib so every geometric step can be inspected visually.
import matplotlib.patches as patches  # use rectangle patches to draw bounding boxes and shaded overlaps.
try:  # try to import interactive widgets for the final live experiment.
    from ipywidgets import interact, FloatSlider  # expose Colab sliders for confidence and IoU thresholds.
except ModuleNotFoundError:  # keep the notebook runnable even when ipywidgets is unavailable.
    class FloatSlider:  # create a small fallback object with the same value attribute used below.
        def __init__(self, value=0.5, min=0.0, max=1.0, step=0.05, description=""):  # accept the widget-style arguments used later.
            self.value = value  # store the default value so the fallback interaction can call once.
    def interact(function, **controls):  # define a fallback interact that evaluates the function once.
        values = {name: control.value for name, control in controls.items()}  # collect each fallback control's default value.
        return function(**values)  # run the live function once so the cell still produces a plot.
np.random.seed(230)  # seed global NumPy randomness for reproducible synthetic scenes and scores.
RNG = np.random.default_rng(230)  # create a modern random generator for controlled jitter and noise.
plt.style.use("seaborn-v0_8-whitegrid")  # use a light grid style so box coordinates are easy to read.
CLASS_COLORS = {"dog": "tab:orange", "cat": "tab:purple", "car": "tab:blue", "person": "tab:green", "sign": "tab:red", "ball": "gold", "shelf": "tab:brown", "bird": "tab:cyan", "bike": "tab:pink"}  # map labels to stable colors.
IMAGE_H = 10.0  # use a normalized ten-unit image height throughout the notebook.
IMAGE_W = 14.0  # use a normalized fourteen-unit image width throughout the notebook.


def make_canvas(width=IMAGE_W, height=IMAGE_H, kind="plain"):  # create a simple offline image-like array for drawing boxes.
    y = np.linspace(0.0, 1.0, int(height * 40))[:, None]  # create a vertical gradient coordinate for image texture.
    x = np.linspace(0.0, 1.0, int(width * 40))[None, :]  # create a horizontal gradient coordinate for image texture.
    canvas = np.zeros((int(height * 40), int(width * 40), 3))  # allocate an RGB image array with deterministic size.
    canvas[..., 0] = 0.78 + 0.12 * x  # fill the red channel with a gentle horizontal gradient.
    canvas[..., 1] = 0.82 + 0.10 * y  # fill the green channel with a gentle vertical gradient.
    canvas[..., 2] = 0.88 - 0.08 * x + 0.04 * y  # fill the blue channel so the background is not blank.
    if kind == "road":  # add a road stripe when the scene needs a street-like background.
        canvas[int(height * 24):, :, :] *= np.array([0.72, 0.72, 0.72])  # darken the lower part to suggest pavement.
    if kind == "shelf":  # add shelf bands when the scene needs crowded small objects.
        canvas[120:140, :, :] = np.array([0.55, 0.36, 0.22])  # draw one horizontal shelf divider.
        canvas[260:280, :, :] = np.array([0.55, 0.36, 0.22])  # draw another horizontal shelf divider.
    return np.clip(canvas, 0.0, 1.0)  # return valid RGB values for imshow.


def xyxy_to_center(box):  # convert one corner-format box to center-width-height format.
    x1, y1, x2, y2 = np.asarray(box, dtype=float)  # unpack numeric corners as floats for stable arithmetic.
    return np.array([(x1 + x2) / 2.0, (y1 + y2) / 2.0, x2 - x1, y2 - y1])  # compute center x, center y, width, and height.


def center_to_xyxy(box):  # convert one center-format box to corner format.
    bx, by, bw, bh = np.asarray(box, dtype=float)  # unpack center, width, and height as floats.
    return np.array([bx - bw / 2.0, by - bh / 2.0, bx + bw / 2.0, by + bh / 2.0])  # recover xmin, ymin, xmax, and ymax.


def box_area(box):  # compute the area of one corner-format box.
    x1, y1, x2, y2 = np.asarray(box, dtype=float)  # unpack the two corners of the rectangle.
    width = max(0.0, x2 - x1)  # clamp width at zero so invalid or non-overlapping intervals do not produce negative area.
    height = max(0.0, y2 - y1)  # clamp height at zero for the same geometric reason.
    return width * height  # multiply width and height to get rectangular area.


def intersection_box(box_a, box_b):  # compute the overlap rectangle between two boxes.
    a = np.asarray(box_a, dtype=float)  # convert the first box to a float array.
    b = np.asarray(box_b, dtype=float)  # convert the second box to a float array.
    x1 = max(a[0], b[0])  # the intersection starts at the larger left edge.
    y1 = max(a[1], b[1])  # the intersection starts at the larger top edge.
    x2 = min(a[2], b[2])  # the intersection ends at the smaller right edge.
    y2 = min(a[3], b[3])  # the intersection ends at the smaller bottom edge.
    return np.array([x1, y1, x2, y2])  # return the candidate intersection rectangle.


def iou(box_a, box_b):  # compute Intersection over Union from scratch using only NumPy and scalar arithmetic.
    inter = intersection_box(box_a, box_b)  # find the overlap rectangle first.
    inter_area = box_area(inter)  # measure the overlap area.
    area_a = box_area(box_a)  # measure the first box area.
    area_b = box_area(box_b)  # measure the second box area.
    union_area = area_a + area_b - inter_area  # add both areas and subtract the double-counted intersection.
    return 0.0 if union_area == 0.0 else inter_area / union_area  # protect against degenerate zero-area boxes.


def pairwise_iou(boxes_a, boxes_b):  # compute an IoU matrix for two lists of boxes.
    result = np.zeros((len(boxes_a), len(boxes_b)))  # allocate one IoU value for each pair.
    for i, box_a in enumerate(boxes_a):  # loop over predicted or candidate boxes.
        for j, box_b in enumerate(boxes_b):  # loop over target or anchor boxes.
            result[i, j] = iou(box_a, box_b)  # fill the pairwise overlap score.
    return result  # return the dense IoU matrix.


def nms(boxes, scores, labels, conf_threshold=0.30, iou_threshold=0.50):  # implement class-aware non-max suppression from scratch.
    boxes = np.asarray(boxes, dtype=float)  # ensure boxes support NumPy indexing.
    scores = np.asarray(scores, dtype=float)  # ensure scores support NumPy sorting.
    labels = np.asarray(labels)  # ensure labels support Boolean masks.
    keep = []  # store selected original box indices.
    suppressed = []  # store suppressed original box indices for visualization.
    for label in np.unique(labels):  # run NMS independently per class because different classes may overlap legitimately.
        class_indices = np.where((labels == label) & (scores >= conf_threshold))[0]  # filter by class and confidence threshold.
        order = class_indices[np.argsort(scores[class_indices])[::-1]]  # sort remaining boxes by descending confidence.
        while len(order) > 0:  # keep selecting boxes until no candidates remain for this class.
            current = order[0]  # choose the highest-scoring remaining box.
            keep.append(current)  # record it as a final detection.
            rest = order[1:]  # compare the selected box only with lower-scoring candidates.
            overlaps = np.array([iou(boxes[current], boxes[r]) for r in rest])  # compute IoU against every lower-scoring candidate.
            to_suppress = rest[overlaps >= iou_threshold]  # identify same-class boxes that overlap too much.
            suppressed.extend(list(to_suppress))  # record suppressed boxes so we can gray them later.
            order = rest[overlaps < iou_threshold]  # continue only with boxes not suppressed by the selected box.
    return np.array(keep, dtype=int), np.array(suppressed, dtype=int)  # return selected and suppressed original indices.


def draw_boxes(ax, boxes, labels=None, scores=None, colors=None, linewidth=2.0, alpha=1.0, linestyle="-", text=True):  # draw a list of boxes on an axes.
    labels = ["box"] * len(boxes) if labels is None else list(labels)  # create generic labels when none are supplied.
    scores = [None] * len(boxes) if scores is None else list(scores)  # create empty scores when none are supplied.
    colors = [CLASS_COLORS.get(label, "black") for label in labels] if colors is None else list(colors)  # choose label-based colors by default.
    for box, label, score, color in zip(boxes, labels, scores, colors):  # draw each detection one by one.
        x1, y1, x2, y2 = np.asarray(box, dtype=float)  # unpack the corner-format box.
        rect = patches.Rectangle((x1, y1), x2 - x1, y2 - y1, fill=False, edgecolor=color, linewidth=linewidth, alpha=alpha, linestyle=linestyle)  # create a visible rectangle patch.
        ax.add_patch(rect)  # add the rectangle to the current axes.
        if text:  # add a label when requested.
            suffix = "" if score is None else f" {score:.2f}"  # format score text only when a score exists.
            ax.text(x1, max(0.15, y1 - 0.15), f"{label}{suffix}", color=color, fontsize=9, weight="bold")  # annotate the upper-left corner.
    return ax  # return axes for further annotation.


def show_scene(boxes=None, labels=None, scores=None, title="", image=None, grid=False, ax=None):  # display an image-like canvas with optional boxes.
    ax = plt.gca() if ax is None else ax  # use the current axes when no axes object is supplied.
    image = make_canvas() if image is None else image  # use a default canvas when no image is passed.
    ax.imshow(image, extent=[0, IMAGE_W, IMAGE_H, 0])  # show the canvas in the same coordinate system as the boxes.
    if grid:  # optionally overlay coordinate grid lines.
        ax.set_xticks(np.arange(0, IMAGE_W + 1, 1))  # create one vertical grid tick per unit.
        ax.set_yticks(np.arange(0, IMAGE_H + 1, 1))  # create one horizontal grid tick per unit.
        ax.grid(color="white", linewidth=0.8, alpha=0.65)  # draw a visible but non-dominant grid.
    if boxes is not None:  # optionally draw boxes after the background.
        draw_boxes(ax, boxes, labels=labels, scores=scores)  # add detection rectangles and labels.
    ax.set_xlim(0, IMAGE_W)  # keep x coordinates within the normalized image width.
    ax.set_ylim(IMAGE_H, 0)  # invert y so image coordinates increase downward like pixels.
    ax.set_title(title)  # title the visualization with the current lesson step.
    ax.set_xlabel("x coordinate")  # label the horizontal coordinate axis.
    ax.set_ylabel("y coordinate")  # label the vertical coordinate axis.
    return ax  # return axes for callers that add more geometry.
```

### Data — swappable sources

The same detector utilities can run on a blank synthetic grid, a street-like scene, a sports scene, or a crowded shelf that intentionally breaks simple NMS settings.

```python
DATA_SOURCE = "street"  # choose one source: "synthetic", "street", "sports", or "crowded_shelf".


def load_detection_scene(source="street"):  # return a deterministic image and ground-truth boxes for the selected scene.
    if source == "synthetic":  # use a blank geometry board for coordinate-first examples.
        image = make_canvas(kind="plain")  # create a plain offline canvas.
        boxes = np.array([[1.0, 1.0, 4.0, 3.0], [8.0, 5.0, 11.0, 8.0]])  # define two simple labeled boxes.
        labels = np.array(["cat", "dog"])  # attach class labels to the simple boxes.
    elif source == "dog_grass":  # use a COCO-style dog-on-grass scene without requiring an external image download.
        image = make_canvas(kind="plain")  # create a green-blue offline canvas that stands in for a simple natural image.
        image[..., 0] *= 0.78  # reduce red so the background feels more grass-like.
        image[..., 1] *= 1.05  # increase green so the dog example visually differs from street scenes.
        boxes = np.array([[4.1, 3.1, 9.4, 7.7]])  # define one dog bounding box with clear corners.
        labels = np.array(["dog"])  # label the single object as a dog.
    elif source == "street":  # use a street-like scene for car, person, sign, and bike examples.
        image = make_canvas(kind="road")  # create a road-like offline canvas.
        boxes = np.array([[1.0, 5.8, 5.2, 8.8], [7.8, 1.2, 9.3, 6.3], [10.5, 2.0, 12.0, 3.5], [4.8, 6.0, 8.4, 8.7]])  # create car, person, sign, and bike boxes.
        labels = np.array(["car", "person", "sign", "bike"])  # label the street objects.
    elif source == "sports":  # use a sports-like scene for YOLO grid assignment.
        image = make_canvas(kind="plain")  # create a plain field-like canvas.
        boxes = np.array([[4.6, 1.2, 6.2, 7.8], [9.2, 5.0, 10.1, 5.9]])  # create one tall player and one small ball.
        labels = np.array(["person", "ball"])  # label the sports objects.
    elif source == "crowded_shelf":  # use a crowded scene to expose small-object and overlap failures.
        image = make_canvas(kind="shelf")  # create shelf bands on the canvas.
        boxes = np.array([[1.0, 1.0, 1.8, 2.0], [2.0, 1.1, 2.8, 2.0], [3.0, 1.0, 3.8, 2.0], [4.0, 1.1, 4.8, 2.0], [5.0, 1.0, 5.8, 2.0], [6.0, 5.1, 7.2, 6.6], [7.0, 5.0, 8.2, 6.6], [8.0, 5.2, 9.2, 6.6]])  # define many small nearby items.
        labels = np.array(["shelf", "shelf", "shelf", "shelf", "shelf", "shelf", "shelf", "shelf"])  # give all items the same class for hard NMS.
    else:  # reject unsupported scene names early.
        raise ValueError("DATA_SOURCE must be synthetic, street, sports, or crowded_shelf")  # provide the valid options.
    return image, boxes, labels  # return the scene bundle.

scene_image, gt_boxes, gt_labels = load_detection_scene(DATA_SOURCE)  # load the selected scene for the first exploration.
print(f"Loaded {DATA_SOURCE} with {len(gt_boxes)} annotated boxes.")  # report how many objects the scene contains.
print(np.column_stack([gt_labels, np.round(gt_boxes, 2).astype(str)]))  # print labels and coordinates as a compact table.
```

```python
plt.figure(figsize=(8, 5))  # create a readable scene figure.
show_scene(gt_boxes, gt_labels, title=f"Ground-truth boxes for DATA_SOURCE='{DATA_SOURCE}'", image=scene_image, grid=True)  # draw annotations over the selected scene.
plt.show()  # render the annotated scene.
```

▶ What you'll see: a simple image-like canvas with coordinate axes and labeled ground-truth boxes. The `crowded_shelf` option contains many small, close objects where duplicate suppression can become too aggressive.


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the object-detection ideas from scratch with only NumPy + Matplotlib. The data are tiny and inline, every variable uses a `_w` suffix to avoid colliding with later notebook examples, and each code cell prints or draws an inspectable intermediate result. The goal is to make every geometric step visible before any larger helper functions or model-style examples appear.

```python
import numpy as np  # use NumPy because boxes, scores, and class probabilities are small numeric arrays.
import matplotlib.pyplot as plt  # use Matplotlib because detection geometry is easiest to verify visually.
from matplotlib.patches import Rectangle  # use Rectangle patches to draw predicted and target boxes directly.
np.random.seed(230)  # seed randomness so every tiny score table and plot remains reproducible.
```

#### 1. Bounding-box representation: corners and center-size describe the same rectangle

A bounding box says *where* an object is. Corner form $(x_1,y_1,x_2,y_2)$ is direct for drawing and overlap math, while center-size form $(c_x,c_y,w,h)$ is direct for predicting offsets around grid cells and anchors. We use both because detection models usually predict center/size adjustments, then convert to corners for visualization and IoU.

```python
box_xyxy_w = np.array([2.0, 1.5, 7.0, 5.5])  # define one box as left, top, right, and bottom corners.
cx_w = (box_xyxy_w[0] + box_xyxy_w[2]) / 2.0  # average x corners to find the horizontal center.
cy_w = (box_xyxy_w[1] + box_xyxy_w[3]) / 2.0  # average y corners to find the vertical center.
width_w = box_xyxy_w[2] - box_xyxy_w[0]  # subtract left from right to get box width.
height_w = box_xyxy_w[3] - box_xyxy_w[1]  # subtract top from bottom to get box height.
box_cxcywh_w = np.array([cx_w, cy_w, width_w, height_w])  # store the equivalent center-size representation.
print("corner form (x1, y1, x2, y2):", box_xyxy_w)  # inspect the coordinate form used for clipping and drawing.
print("center-size form (cx, cy, w, h):", box_cxcywh_w)  # inspect the coordinate form often predicted by detectors.
```

```python
back_x1_w = box_cxcywh_w[0] - box_cxcywh_w[2] / 2.0  # move half a width left from the center.
back_y1_w = box_cxcywh_w[1] - box_cxcywh_w[3] / 2.0  # move half a height up from the center.
back_x2_w = box_cxcywh_w[0] + box_cxcywh_w[2] / 2.0  # move half a width right from the center.
back_y2_w = box_cxcywh_w[1] + box_cxcywh_w[3] / 2.0  # move half a height down from the center.
box_roundtrip_w = np.array([back_x1_w, back_y1_w, back_x2_w, back_y2_w])  # rebuild the corner-format box from center-size values.
print("converted back to corners:", box_roundtrip_w)  # verify the conversion recovers the original rectangle.
print("same as original:", np.allclose(box_xyxy_w, box_roundtrip_w))  # check equality with floating-point tolerance.
```

```python
fig_w, ax_w = plt.subplots(figsize=(6, 4))  # create one axes object so the rectangle can be inspected.
ax_w.set_title("1: Bounding-box representation")  # title the figure with the subsection number and concept.
ax_w.set_xlim(0, 10)  # show a ten-unit image width.
ax_w.set_ylim(0, 7)  # show a seven-unit image height.
ax_w.invert_yaxis()  # match image coordinates where larger y values are lower on the canvas.
ax_w.grid(True, alpha=0.3)  # add a light grid so coordinates can be read off the plot.
rect_w = Rectangle((box_xyxy_w[0], box_xyxy_w[1]), width_w, height_w, fill=False, edgecolor="tab:blue", linewidth=2)  # create the visible box patch from corner plus size values.
ax_w.add_patch(rect_w)  # draw the rectangle on the axes.
ax_w.scatter([cx_w], [cy_w], color="tab:red", zorder=3)  # mark the center because anchors predict offsets from centers.
ax_w.text(cx_w + 0.15, cy_w, "center", color="tab:red")  # label the center point for interpretation.
ax_w.set_xlabel("x coordinate")  # label the horizontal image coordinate.
ax_w.set_ylabel("y coordinate")  # label the vertical image coordinate.
plt.show()  # render the box and its center.
```

▶ What you'll see: a single rectangle with a red center point. The corners define the drawn extent, while the center and size summarize the same geometry compactly.

The conversion is just averaging and differencing: $c_x=\frac{x_1+x_2}{2}$, $c_y=\frac{y_1+y_2}{2}$, $w=x_2-x_1$, and $h=y_2-y_1$. Center/size form is convenient for anchors because a model can predict small shifts and scale changes around a preset shape instead of predicting every absolute corner independently.

*Why it's done this way: corner coordinates make exact geometry easy, while center/size coordinates make anchor-relative prediction stable and local.*

#### 2. Intersection over Union: overlap divided by total covered area

Intersection over Union (IoU) measures *how well* a predicted box overlaps a target box. We clip the intersection width and height at zero so non-overlapping boxes never produce negative area. Then we divide intersection area by union area so the score is normalized between $0$ and $1$ regardless of the absolute box sizes.

$$
\operatorname{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|}
$$

```python
box_a_w = np.array([1.0, 1.0, 6.0, 5.0])  # define a target-like box in corner format.
box_b_w = np.array([4.0, 3.0, 9.0, 6.5])  # define a predicted-like box that partially overlaps the target.
left_w = max(box_a_w[0], box_b_w[0])  # choose the larger left edge for the intersection.
top_w = max(box_a_w[1], box_b_w[1])  # choose the larger top edge for the intersection.
right_w = min(box_a_w[2], box_b_w[2])  # choose the smaller right edge for the intersection.
bottom_w = min(box_a_w[3], box_b_w[3])  # choose the smaller bottom edge for the intersection.
inter_width_w = max(0.0, right_w - left_w)  # clip the overlap width at zero.
inter_height_w = max(0.0, bottom_w - top_w)  # clip the overlap height at zero.
inter_area_w = inter_width_w * inter_height_w  # multiply clipped width and height to get intersection area.
print("intersection corners:", np.array([left_w, top_w, right_w, bottom_w]))  # inspect the clipped overlap rectangle.
print("intersection size and area:", inter_width_w, inter_height_w, inter_area_w)  # inspect the overlap dimensions and area.
```

```python
area_a_w = (box_a_w[2] - box_a_w[0]) * (box_a_w[3] - box_a_w[1])  # compute target box area.
area_b_w = (box_b_w[2] - box_b_w[0]) * (box_b_w[3] - box_b_w[1])  # compute predicted box area.
union_area_w = area_a_w + area_b_w - inter_area_w  # add areas and subtract the overlap counted twice.
iou_w = inter_area_w / union_area_w  # divide overlap by union to get normalized localization quality.
print("area A:", area_a_w)  # inspect the first box area.
print("area B:", area_b_w)  # inspect the second box area.
print("union area:", union_area_w)  # inspect the denominator of IoU.
print("IoU:", round(iou_w, 3))  # inspect the final overlap score.
```

```python
fig_w, ax_w = plt.subplots(figsize=(6.5, 4.5))  # create a figure for the two boxes and their overlap.
ax_w.set_title("2: Intersection over Union")  # title the figure with the subsection number and concept.
ax_w.set_xlim(0, 10)  # show the full toy image width.
ax_w.set_ylim(0, 8)  # show the full toy image height.
ax_w.invert_yaxis()  # use image-style y coordinates.
ax_w.grid(True, alpha=0.3)  # add a grid for coordinate inspection.
ax_w.add_patch(Rectangle((box_a_w[0], box_a_w[1]), box_a_w[2] - box_a_w[0], box_a_w[3] - box_a_w[1], fill=False, edgecolor="tab:blue", linewidth=2, label="box A"))  # draw the first box.
ax_w.add_patch(Rectangle((box_b_w[0], box_b_w[1]), box_b_w[2] - box_b_w[0], box_b_w[3] - box_b_w[1], fill=False, edgecolor="tab:orange", linewidth=2, label="box B"))  # draw the second box.
ax_w.add_patch(Rectangle((left_w, top_w), inter_width_w, inter_height_w, facecolor="tab:green", alpha=0.35, edgecolor="tab:green", label="overlap"))  # shade the intersection area.
ax_w.legend(loc="lower right")  # show which outline belongs to which box.
ax_w.set_xlabel("x coordinate")  # label the horizontal coordinate.
ax_w.set_ylabel("y coordinate")  # label the vertical coordinate.
plt.show()  # render the IoU geometry.
```

▶ What you'll see: two rectangles and a shaded green overlap. The printed values show exactly how the numerator and denominator of IoU are built.

The union formula $|A\cup B|=|A|+|B|-|A\cap B|$ subtracts the overlap once because it was counted in both individual areas. IoU measures overlap quality independent of box size because both the intersection and union scale together when the same geometry is enlarged.

*Why it's done this way: IoU turns raw pixel or coordinate overlap into a comparable $0$-to-$1$ quality score for small and large objects alike.*

#### 3. Anchor boxes: preset shapes at one grid cell

Anchor boxes are predefined shapes centered at a grid location. Instead of predicting an absolute box from nothing, a detector predicts offsets such as "move this anchor slightly right" or "make this anchor taller." This approach gives each grid cell several shape hypotheses, which helps one cell handle square, wide, and tall objects.

```python
grid_cell_center_w = np.array([5.0, 4.0])  # choose the center of one grid cell in image coordinates.
anchor_sizes_w = np.array([[2.0, 2.0], [4.0, 1.6], [1.4, 4.0]])  # define square, wide, and tall anchor widths and heights.
anchor_names_w = ["square", "wide", "tall"]  # name each preset shape for readable output.
anchor_boxes_w = []  # prepare a list that will hold corner-format anchor boxes.
for size_w in anchor_sizes_w:  # loop over each preset width-height pair.
    x1_w = grid_cell_center_w[0] - size_w[0] / 2.0  # convert anchor width to a left corner.
    y1_w = grid_cell_center_w[1] - size_w[1] / 2.0  # convert anchor height to a top corner.
    x2_w = grid_cell_center_w[0] + size_w[0] / 2.0  # convert anchor width to a right corner.
    y2_w = grid_cell_center_w[1] + size_w[1] / 2.0  # convert anchor height to a bottom corner.
    anchor_boxes_w.append([x1_w, y1_w, x2_w, y2_w])  # store the corner-format anchor for later drawing.
anchor_boxes_w = np.array(anchor_boxes_w)  # convert the list to an array for compact printing and indexing.
print("grid cell center:", grid_cell_center_w)  # inspect the shared center of all anchors.
print("anchor boxes as corners:\n", np.round(anchor_boxes_w, 2))  # inspect the resulting preset boxes.
```

```python
target_box_w = np.array([3.6, 2.1, 6.6, 5.7])  # define a target object near the same cell.
target_center_w = np.array([(target_box_w[0] + target_box_w[2]) / 2.0, (target_box_w[1] + target_box_w[3]) / 2.0])  # compute the target center.
target_size_w = np.array([target_box_w[2] - target_box_w[0], target_box_w[3] - target_box_w[1]])  # compute the target width and height.
anchor_offset_w = target_center_w - grid_cell_center_w  # compute the center shift a model would learn.
anchor_scale_w = target_size_w / anchor_sizes_w[2]  # compare the target size with the tall anchor size.
print("target center shift from cell:", np.round(anchor_offset_w, 2))  # inspect the offset instead of absolute target corners.
print("target size divided by tall anchor size:", np.round(anchor_scale_w, 2))  # inspect a simple scale adjustment relative to one anchor.
```

```python
fig_w, ax_w = plt.subplots(figsize=(6.5, 5))  # create a figure for anchors at one cell.
ax_w.set_title("3: Anchor boxes at one grid cell")  # title the figure with the subsection number and concept.
ax_w.set_xlim(0, 10)  # show the toy image width.
ax_w.set_ylim(0, 8)  # show the toy image height.
ax_w.invert_yaxis()  # match image-coordinate orientation.
ax_w.grid(True, alpha=0.3)  # add a light coordinate grid.
colors_w = ["tab:blue", "tab:orange", "tab:green"]  # choose one color per anchor shape.
for idx_w, anchor_w in enumerate(anchor_boxes_w):  # draw each preset anchor at the same grid center.
    ax_w.add_patch(Rectangle((anchor_w[0], anchor_w[1]), anchor_w[2] - anchor_w[0], anchor_w[3] - anchor_w[1], fill=False, edgecolor=colors_w[idx_w], linewidth=2, label=anchor_names_w[idx_w]))  # add the anchor rectangle.
ax_w.add_patch(Rectangle((target_box_w[0], target_box_w[1]), target_box_w[2] - target_box_w[0], target_box_w[3] - target_box_w[1], fill=False, edgecolor="black", linewidth=2, linestyle="--", label="target"))  # draw a nearby target box for comparison.
ax_w.scatter([grid_cell_center_w[0]], [grid_cell_center_w[1]], color="black", zorder=3)  # mark the cell center shared by anchors.
ax_w.legend(loc="lower right")  # show the anchor shape names.
ax_w.set_xlabel("x coordinate")  # label the horizontal coordinate.
ax_w.set_ylabel("y coordinate")  # label the vertical coordinate.
plt.show()  # render anchors and target.
```

▶ What you'll see: three differently shaped boxes centered on the same grid point, plus a dashed target box nearby. The tall anchor is already close in shape, so the predicted correction can be small.

Predefined anchors turn box prediction into a residual problem: learn offsets and scale changes from a useful default. That is usually easier than forcing the network to learn every possible object shape from the same unconstrained output.

*Why it's done this way: anchors provide multiple shape priors at each location, so the detector specializes each prediction head around a nearby default box.*

#### 4. Non-max suppression: keep the best box and remove duplicate overlaps

Raw detectors often produce several high-scoring boxes around the same object. Non-max suppression (NMS) sorts boxes by score, keeps the strongest remaining box, and suppresses lower-scoring boxes whose IoU with it is above a threshold. The process is greedy, but it is simple, fast, and effective for removing duplicate detections.

```python
nms_boxes_w = np.array([[1.0, 1.0, 5.0, 4.5], [1.4, 1.2, 5.2, 4.6], [6.4, 1.3, 9.2, 4.2], [1.1, 1.5, 4.8, 4.2]])  # define three overlapping boxes and one separate box.
nms_scores_w = np.array([0.92, 0.84, 0.76, 0.67])  # assign detector confidence scores to the boxes.
nms_order_w = np.argsort(-nms_scores_w)  # sort indexes from highest score to lowest score.
print("boxes sorted by score:", nms_order_w)  # inspect the greedy processing order.
print("sorted scores:", nms_scores_w[nms_order_w])  # inspect the confidence values in that order.
```

```python
def nms_iou_w(box_one_w, box_two_w):  # define a tiny IoU helper used only in this walkthrough.
    ix1_w = max(box_one_w[0], box_two_w[0])  # choose the left edge of the overlap.
    iy1_w = max(box_one_w[1], box_two_w[1])  # choose the top edge of the overlap.
    ix2_w = min(box_one_w[2], box_two_w[2])  # choose the right edge of the overlap.
    iy2_w = min(box_one_w[3], box_two_w[3])  # choose the bottom edge of the overlap.
    iw_w = max(0.0, ix2_w - ix1_w)  # clip overlap width at zero.
    ih_w = max(0.0, iy2_w - iy1_w)  # clip overlap height at zero.
    inter_w = iw_w * ih_w  # compute the intersection area.
    area_one_w = (box_one_w[2] - box_one_w[0]) * (box_one_w[3] - box_one_w[1])  # compute the first box area.
    area_two_w = (box_two_w[2] - box_two_w[0]) * (box_two_w[3] - box_two_w[1])  # compute the second box area.
    return inter_w / (area_one_w + area_two_w - inter_w)  # return intersection divided by union.
nms_threshold_w = 0.45  # set the overlap threshold above which lower-scoring boxes are treated as duplicates.
keep_w = []  # collect kept box indexes.
remaining_w = list(nms_order_w)  # start with all boxes sorted by descending score.
while remaining_w:  # keep looping until every candidate is kept or suppressed.
    current_w = remaining_w.pop(0)  # take the highest-scoring remaining box.
    keep_w.append(current_w)  # keep that box as the representative detection.
    survivors_w = []  # collect lower-scoring boxes that are not duplicates of the kept box.
    for candidate_w in remaining_w:  # compare each remaining box against the current kept box.
        overlap_w = nms_iou_w(nms_boxes_w[current_w], nms_boxes_w[candidate_w])  # compute IoU with the current kept box.
        print("compare kept", current_w, "to candidate", candidate_w, "IoU=", round(overlap_w, 3))  # inspect each suppression decision.
        if overlap_w <= nms_threshold_w:  # keep the candidate only if overlap is not too high.
            survivors_w.append(candidate_w)  # preserve this candidate for later greedy steps.
    remaining_w = survivors_w  # continue with only unsuppressed boxes.
print("kept indexes after NMS:", keep_w)  # inspect the final selected detections.
```

```python
fig_w, axes_w = plt.subplots(1, 2, figsize=(10, 4), sharex=True, sharey=True)  # create side-by-side before and after views.
for ax_w, title_w, indexes_w in zip(axes_w, ["before NMS", "after NMS"], [range(len(nms_boxes_w)), keep_w]):  # loop over the two panels.
    ax_w.set_title("4: Non-max suppression — " + title_w)  # title each panel with the subsection number and state.
    ax_w.set_xlim(0, 10)  # show the toy image width.
    ax_w.set_ylim(0, 6)  # show the toy image height.
    ax_w.invert_yaxis()  # match image-coordinate orientation.
    ax_w.grid(True, alpha=0.3)  # add a light grid for reading coordinates.
    for idx_w in indexes_w:  # draw either all boxes or just the kept boxes.
        box_w = nms_boxes_w[idx_w]  # select the current box.
        color_w = "tab:red" if idx_w in keep_w else "gray"  # highlight boxes kept by NMS.
        ax_w.add_patch(Rectangle((box_w[0], box_w[1]), box_w[2] - box_w[0], box_w[3] - box_w[1], fill=False, edgecolor=color_w, linewidth=2))  # draw the candidate or kept box.
        ax_w.text(box_w[0], box_w[1] - 0.1, f"{idx_w}: {nms_scores_w[idx_w]:.2f}", color=color_w)  # annotate the index and score.
    ax_w.set_xlabel("x coordinate")  # label the horizontal coordinate.
axes_w[0].set_ylabel("y coordinate")  # label the vertical coordinate on the left panel.
plt.show()  # render the before-and-after NMS comparison.
```

▶ What you'll see: the left panel contains duplicate boxes clustered around one object, while the right panel keeps the highest-scoring representative and the separate object.

NMS removes duplicates because boxes with high IoU are usually alternative predictions for the same object. Running it per class avoids suppressing a dog box just because a person box overlaps it.

*Why it's done this way: NMS converts many redundant local guesses into a smaller final set by trusting the highest score within each overlap group.*

#### 5. YOLO-style detection pipeline: one pass from grid-cell prediction to final boxes

A YOLO-style detector divides the image into a grid and predicts boxes, objectness, and class probabilities in one forward pass. In this tiny numeric example, one grid cell emits two anchor predictions. We convert center-size predictions to corners, multiply objectness by class probability for confidence, threshold weak predictions, and run NMS on the survivors.

```python
grid_shape_w = np.array([2, 2])  # define a tiny two-by-two grid for the conceptual image.
cell_size_w = np.array([5.0, 4.0])  # make each cell five units wide and four units high.
cell_index_w = np.array([1, 0])  # choose row 1 and column 0 as the cell responsible for a visible object.
cell_origin_w = np.array([cell_index_w[1] * cell_size_w[0], cell_index_w[0] * cell_size_w[1]])  # convert the grid cell index to an image-coordinate origin.
local_centers_w = np.array([[0.52, 0.46], [0.55, 0.50]])  # predict two center locations as fractions inside the cell.
pred_sizes_w = np.array([[2.5, 2.0], [2.8, 2.1]])  # predict two absolute width-height pairs for two anchors.
objectness_w = np.array([0.91, 0.74])  # predict whether each anchor contains an object.
class_probs_w = np.array([[0.12, 0.88], [0.18, 0.82]])  # predict class probabilities for [cat, dog].
centers_image_w = cell_origin_w + local_centers_w * cell_size_w  # convert local grid predictions to image-coordinate centers.
print("cell origin:", cell_origin_w)  # inspect where the chosen grid cell starts.
print("predicted centers in image coordinates:\n", np.round(centers_image_w, 2))  # inspect the decoded center points.
```

```python
pipeline_boxes_w = np.column_stack([centers_image_w[:, 0] - pred_sizes_w[:, 0] / 2.0, centers_image_w[:, 1] - pred_sizes_w[:, 1] / 2.0, centers_image_w[:, 0] + pred_sizes_w[:, 0] / 2.0, centers_image_w[:, 1] + pred_sizes_w[:, 1] / 2.0])  # decode center-size predictions into corner boxes.
class_names_w = np.array(["cat", "dog"])  # define the class-name lookup for the two class probabilities.
best_class_w = np.argmax(class_probs_w, axis=1)  # choose the most likely class for each anchor prediction.
confidence_w = objectness_w * class_probs_w[np.arange(len(objectness_w)), best_class_w]  # combine objectness and class probability into final confidence.
mask_w = confidence_w >= 0.50  # filter out predictions below the confidence threshold.
filtered_boxes_w = pipeline_boxes_w[mask_w]  # keep only boxes with enough confidence.
filtered_scores_w = confidence_w[mask_w]  # keep the matching confidence scores.
filtered_classes_w = class_names_w[best_class_w[mask_w]]  # keep the matching class names.
print("decoded boxes:\n", np.round(pipeline_boxes_w, 2))  # inspect decoded corner boxes.
print("confidence scores:", np.round(confidence_w, 3))  # inspect objectness times class probability.
print("kept after confidence threshold:", filtered_classes_w)  # inspect which labels survive filtering.
```

```python
yolo_order_w = np.argsort(-filtered_scores_w)  # sort filtered predictions by descending confidence.
yolo_keep_w = []  # collect kept filtered indexes after NMS.
yolo_remaining_w = list(yolo_order_w)  # initialize the greedy NMS queue.
while yolo_remaining_w:  # process candidates until none remain.
    current_w = yolo_remaining_w.pop(0)  # choose the highest-confidence remaining prediction.
    yolo_keep_w.append(current_w)  # keep it as a final detection.
    next_remaining_w = []  # collect candidates not suppressed by the current detection.
    for candidate_w in yolo_remaining_w:  # compare same-class lower-confidence predictions.
        same_class_w = filtered_classes_w[candidate_w] == filtered_classes_w[current_w]  # suppress only duplicate predictions of the same class.
        overlap_w = nms_iou_w(filtered_boxes_w[current_w], filtered_boxes_w[candidate_w])  # compute overlap with the kept detection.
        print("YOLO NMS compare", current_w, candidate_w, "same class", same_class_w, "IoU", round(overlap_w, 3))  # inspect the duplicate decision.
        if (not same_class_w) or overlap_w <= 0.45:  # preserve different classes or low-overlap same-class boxes.
            next_remaining_w.append(candidate_w)  # keep this candidate for possible later selection.
    yolo_remaining_w = next_remaining_w  # replace the queue with unsuppressed candidates.
final_boxes_w = filtered_boxes_w[yolo_keep_w]  # select final box coordinates.
final_scores_w = filtered_scores_w[yolo_keep_w]  # select final confidence scores.
final_classes_w = filtered_classes_w[yolo_keep_w]  # select final class labels.
print("final detections:", list(zip(final_classes_w, np.round(final_scores_w, 3))))  # inspect final labels and confidences.
```

```python
fig_w, ax_w = plt.subplots(figsize=(7, 5))  # create a figure for the YOLO-style final output.
ax_w.set_title("5: YOLO-style detection pipeline")  # title the figure with the subsection number and concept.
ax_w.set_xlim(0, grid_shape_w[1] * cell_size_w[0])  # set width from the number of grid columns.
ax_w.set_ylim(0, grid_shape_w[0] * cell_size_w[1])  # set height from the number of grid rows.
ax_w.invert_yaxis()  # match image-coordinate orientation.
ax_w.grid(True, alpha=0.35)  # show grid lines for the conceptual detector layout.
for col_w in range(grid_shape_w[1] + 1):  # draw vertical grid-cell boundaries.
    ax_w.axvline(col_w * cell_size_w[0], color="black", linewidth=0.8, alpha=0.4)  # add one vertical boundary line.
for row_w in range(grid_shape_w[0] + 1):  # draw horizontal grid-cell boundaries.
    ax_w.axhline(row_w * cell_size_w[1], color="black", linewidth=0.8, alpha=0.4)  # add one horizontal boundary line.
for idx_w, box_w in enumerate(final_boxes_w):  # draw each final detection after thresholding and NMS.
    ax_w.add_patch(Rectangle((box_w[0], box_w[1]), box_w[2] - box_w[0], box_w[3] - box_w[1], fill=False, edgecolor="tab:purple", linewidth=2))  # draw the final detected box.
    ax_w.text(box_w[0], box_w[1] - 0.15, f"{final_classes_w[idx_w]} {final_scores_w[idx_w]:.2f}", color="tab:purple")  # label the final class and score.
ax_w.scatter(centers_image_w[:, 0], centers_image_w[:, 1], color="tab:orange", zorder=3, label="raw centers")  # show raw predicted centers before NMS.
ax_w.legend(loc="lower right")  # identify the raw center markers.
ax_w.set_xlabel("x coordinate")  # label the horizontal coordinate.
ax_w.set_ylabel("y coordinate")  # label the vertical coordinate.
plt.show()  # render the final pipeline output.
```

▶ What you'll see: a small grid, two raw anchor centers in one cell, and the final high-confidence detection after duplicate suppression.

The single-pass grid idea is that every cell predicts a fixed number of candidate boxes and scores at once, so detection becomes one dense tensor calculation followed by filtering and NMS. Confidence is commonly read as objectness $\times$ class probability because a box should score high only when it both contains an object and assigns that object to a likely class.

*Why it's done this way: YOLO-style detection makes localization and classification a single dense prediction problem, then uses thresholding and NMS to turn the grid tensor into final boxes.*

### 🟢 Basics (warm-up)

#### B1. Draw one bounding box on a blank grid

**Goal.** Build the most atomic detection primitive: a rectangle with coordinates $(x_{\min},y_{\min},x_{\max},y_{\max})$. We will draw toy box $(1,1,4,3)$ in two steps: create the coordinates, then render the rectangle.

```python
box_b1 = np.array([[1.0, 1.0, 4.0, 3.0]])  # store one toy bounding box in corner format.
label_b1 = np.array(["cat"])  # attach a simple class label so the rectangle represents a detection.
center_b1 = xyxy_to_center(box_b1[0])  # convert to center format to connect corners with model outputs.
print("corner format (xmin, ymin, xmax, ymax):", box_b1[0])  # show the coordinate representation used for drawing.
print("center format (bx, by, bw, bh):", np.round(center_b1, 2))  # show the equivalent representation often predicted by detectors.
```

```python
plt.figure(figsize=(6, 4))  # create a compact coordinate-grid figure.
show_scene(box_b1, label_b1, title="B1: one bounding box on a blank coordinate grid", image=make_canvas(kind="plain"), grid=True)  # draw the single rectangle.
plt.scatter(center_b1[0], center_b1[1], s=80, color="black", marker="x", label="box center")  # mark the box center so center format is visible.
plt.legend(loc="upper right")  # show which mark is the center.
plt.show()  # render the coordinate-grid example.
```

▶ What you'll see: one rectangle spanning $x=1$ to $4$ and $y=1$ to $3$, with a center marker at $(2.5,2)$.

#### B2. Compute IoU for two tiny boxes

**Goal.** Compute IoU for two $2\times2$ boxes that overlap by one unit square, then shade the intersection and union geometry.

```python
box_a_b2 = np.array([1.0, 1.0, 3.0, 3.0])  # define the first 2-by-2 box.
box_b_b2 = np.array([2.0, 2.0, 4.0, 4.0])  # define the second 2-by-2 box shifted down and right.
inter_b2 = intersection_box(box_a_b2, box_b_b2)  # compute the overlapping rectangle.
area_a_b2 = box_area(box_a_b2)  # compute area of the first box.
area_b_b2 = box_area(box_b_b2)  # compute area of the second box.
inter_area_b2 = box_area(inter_b2)  # compute the overlap area.
union_area_b2 = area_a_b2 + area_b_b2 - inter_area_b2  # compute the union by subtracting the double-counted overlap.
iou_b2 = iou(box_a_b2, box_b_b2)  # compute the final IoU value.
print(f"area A={area_a_b2:.1f}, area B={area_b_b2:.1f}, intersection={inter_area_b2:.1f}, union={union_area_b2:.1f}")  # display the arithmetic pieces.
print(f"IoU = {inter_area_b2:.1f} / {union_area_b2:.1f} = {iou_b2:.3f}")  # display the ratio explicitly.
```

```python
plt.figure(figsize=(5, 5))  # create a square figure so unit cells look square.
ax = show_scene(None, title="B2: IoU geometry for two tiny boxes", image=make_canvas(kind="plain"), grid=True)  # draw a gridded background.
draw_boxes(ax, [box_a_b2], labels=["A"], colors=["tab:blue"], linewidth=3.0)  # draw the first box in blue.
draw_boxes(ax, [box_b_b2], labels=["B"], colors=["tab:orange"], linewidth=3.0)  # draw the second box in orange.
ax.add_patch(patches.Rectangle((inter_b2[0], inter_b2[1]), inter_b2[2] - inter_b2[0], inter_b2[3] - inter_b2[1], facecolor="limegreen", alpha=0.35, edgecolor="none"))  # shade the intersection region.
ax.text(4.4, 2.0, f"IoU={iou_b2:.3f}", fontsize=12, weight="bold")  # annotate the calculated IoU.
plt.show()  # render the IoU diagram.
```

▶ What you'll see: two overlapping boxes with a green $1\times1$ intersection; the union area is $7$, so IoU is about $0.143$.

#### B3. Filter detections by confidence threshold

**Goal.** Practice the first post-processing step: keep high-confidence detections and drop low-confidence ones.

```python
detections_b3 = np.array([["dog", "0.92"], ["cat", "0.41"], ["car", "0.73"]], dtype=object)  # create three toy label-score rows.
threshold_b3 = 0.60  # choose the confidence cutoff used by this warm-up.
scores_b3 = detections_b3[:, 1].astype(float)  # convert score strings to floats so comparisons are numeric.
keep_mask_b3 = scores_b3 >= threshold_b3  # mark detections whose confidence passes the cutoff.
print("threshold:", threshold_b3)  # print the cutoff before the keep/drop table.
for row, keep in zip(detections_b3, keep_mask_b3):  # inspect each toy detection separately.
    decision = "KEEP" if keep else "DROP"  # translate the Boolean mask into a readable decision.
    print(f"{decision:4s} label={row[0]:>3s} score={float(row[1]):.2f}")  # print one row of the filtering result.
```


#### B4. Compute one box area

**Goal.** Measure the area of one corner-format box before comparing boxes.

```python
box_b4 = np.array([2.0, 1.0, 6.0, 4.0])  # Define one box as xmin, ymin, xmax, ymax.
area_b4 = box_area(box_b4)  # Compute width times height with the reusable helper.
print(f"area = {area_b4:.1f}")  # Print the scalar area.
```

The width is $6-2=4$ and the height is $4-1=3$, so the area is

$$
\boxed{4\cdot3=12}.
$$

#### B5. Compute intersection area of two boxes

**Goal.** Find only the overlapping rectangle and measure its area.

```python
box_a_b5 = np.array([1.0, 1.0, 5.0, 4.0])  # Define the first box.
box_b_b5 = np.array([3.0, 2.0, 6.0, 5.0])  # Define the second box.
inter_b5 = intersection_box(box_a_b5, box_b_b5)  # Compute the intersection rectangle.
area_b5 = box_area(inter_b5)  # Measure the intersection area.
print("intersection box:", inter_b5)  # Print the overlap coordinates.
print(f"intersection area = {area_b5:.1f}")  # Print the overlap area.
```

The overlap spans $x=3$ to $5$ and $y=2$ to $4$, so

$$
\boxed{|A\cap B|=(5-3)(4-2)=4}.
$$

#### B6. Convert center coordinates to corners

**Goal.** Convert one detector-style $(b_x,b_y,b_w,b_h)$ box into drawable corners.

```python
center_b6 = np.array([5.0, 4.0, 2.0, 6.0])  # Store center x, center y, width, and height.
xyxy_b6 = center_to_xyxy(center_b6)  # Convert to xmin, ymin, xmax, ymax.
print("corner box:", xyxy_b6)  # Print the drawable box coordinates.
```

The corners are

$$
x_{\min}=5-1=4,\quad y_{\min}=4-3=1,
$$

$$
x_{\max}=5+1=6,\quad y_{\max}=4+3=7.
$$

$$
\boxed{(4,1,6,7)}
$$

#### B7. Sort boxes by score

**Goal.** Order candidate detections from most confident to least confident.

```python
scores_b7 = np.array([0.42, 0.91, 0.73])  # Store three confidence scores.
labels_b7 = np.array(["cat", "dog", "car"])  # Store the matching labels.
order_b7 = np.argsort(scores_b7)[::-1]  # Sort indices by descending score.
for idx in order_b7:  # Print detections in NMS selection order.
    print(f"{labels_b7[idx]}: {scores_b7[idx]:.2f}")  # Show label and score.
```

The descending order is

$$
0.91>0.73>0.42,
$$

so the first selected candidate would be the dog box.

#### B8. Decide overlap by an IoU threshold

**Goal.** Turn a numeric IoU into a yes/no overlap decision.

```python
iou_b8 = 0.62  # Store one precomputed overlap score.
threshold_b8 = 0.50  # Store the overlap threshold.
overlap_b8 = iou_b8 >= threshold_b8  # Compare IoU against the threshold.
print(f"IoU={iou_b8:.2f}, threshold={threshold_b8:.2f}, overlap? {overlap_b8}")  # Print the Boolean decision.
```

Since

$$
0.62\ge0.50,
$$

this pair is considered overlapping at the chosen threshold.

$$
\boxed{\text{overlap = yes}}
$$

#### B9. Clip a box to image bounds

**Goal.** Keep a predicted box inside a $14\times10$ image.

```python
box_b9 = np.array([-1.0, 2.0, 15.0, 12.0])  # Define a box that spills outside the image bounds.
clipped_b9 = box_b9.copy()  # Copy before clipping so the original remains visible.
clipped_b9[[0, 2]] = np.clip(clipped_b9[[0, 2]], 0.0, IMAGE_W)  # Clip x coordinates into [0, IMAGE_W].
clipped_b9[[1, 3]] = np.clip(clipped_b9[[1, 3]], 0.0, IMAGE_H)  # Clip y coordinates into [0, IMAGE_H].
print("before:", box_b9)  # Print the out-of-bounds box.
print("after: ", clipped_b9)  # Print the valid image-bounded box.
```

The clipped box is

$$
\boxed{(0,2,14,10)}.
$$

#### B10. Count boxes above a threshold

**Goal.** Count how many candidate detections survive a confidence cutoff.

```python
scores_b10 = np.array([0.95, 0.20, 0.61, 0.49])  # Store four candidate confidence scores.
threshold_b10 = 0.50  # Choose the cutoff.
count_b10 = np.sum(scores_b10 >= threshold_b10)  # Count scores that pass the cutoff.
print(f"boxes above {threshold_b10:.2f}: {count_b10}")  # Print the survivor count.
```

The scores above threshold are $0.95$ and $0.61$, so

$$
\boxed{2\text{ boxes pass the threshold}.}
$$

### 🟡 Easy Examples

#### E1. Draw one bounding box on an image

**Goal.** Move from a blank grid to a COCO-style dog-on-grass image: draw one labeled box, annotate corners, and display center-width-height values.

```python
image_e1, boxes_e1_all, labels_e1_all = load_detection_scene("dog_grass")  # load an offline dog-on-grass scene inspired by a COCO-style sample.
box_e1 = boxes_e1_all[[0]]  # select the dog box as a single-object localization example.
label_e1 = labels_e1_all[[0]]  # select the matching dog label.
center_e1 = xyxy_to_center(box_e1[0])  # compute the center-format box used by many detectors.
print("selected object:", label_e1[0])  # print which object is being localized.
print("corners:", np.round(box_e1[0], 2))  # print corner coordinates for drawing.
print("center/width/height:", np.round(center_e1, 2))  # print detector-style coordinates.
```

```python
plt.figure(figsize=(8, 5))  # create a scene-sized figure.
ax = show_scene(box_e1, label_e1, title="E1: one localized dog on a COCO-style image", image=image_e1, grid=False)  # draw the selected dog box.
ax.scatter(center_e1[0], center_e1[1], s=80, color="black", marker="x")  # mark the center of the box.
ax.text(box_e1[0, 0], box_e1[0, 3] + 0.35, f"(xmin,ymin)=({box_e1[0,0]:.1f},{box_e1[0,1]:.1f})", color="black", fontsize=8)  # annotate the top-left corner numerically.
ax.text(box_e1[0, 2] - 2.2, box_e1[0, 3] + 0.70, f"(xmax,ymax)=({box_e1[0,2]:.1f},{box_e1[0,3]:.1f})", color="black", fontsize=8)  # annotate the bottom-right corner numerically.
plt.show()  # render the localized object.
```

▶ What you'll see: a grass-like image with one dog box, its center marker, and corner coordinate annotations.

#### E2. Compute and visualize IoU

**Goal.** Compare a prediction against a ground-truth sign box, shade the intersection, and decide whether the prediction passes an IoU threshold.

```python
image_e2, boxes_e2, labels_e2 = load_detection_scene("street")  # load the same street scene.
gt_e2 = boxes_e2[2]  # choose the ground-truth sign box.
pred_e2 = np.array([10.0, 1.6, 12.4, 3.7])  # create a plausible predicted sign box with imperfect alignment.
inter_e2 = intersection_box(gt_e2, pred_e2)  # compute the overlap rectangle.
iou_e2 = iou(gt_e2, pred_e2)  # compute the prediction quality score.
passes_e2 = iou_e2 >= 0.50  # apply the common IoU-at-0.5 acceptance rule.
print("ground truth sign:", gt_e2)  # print the target coordinates.
print("predicted sign:", pred_e2)  # print the prediction coordinates.
print(f"IoU={iou_e2:.3f}; accepted at 0.50? {passes_e2}")  # print the metric and decision.
```

```python
plt.figure(figsize=(8, 5))  # create a scene-sized figure.
ax = show_scene(None, title="E2: predicted-vs-actual IoU", image=image_e2, grid=False)  # draw the background without boxes first.
draw_boxes(ax, [gt_e2], labels=["actual sign"], colors=["tab:green"], linewidth=3.0)  # draw the ground-truth box in green.
draw_boxes(ax, [pred_e2], labels=["pred sign"], colors=["tab:red"], linewidth=3.0, linestyle="--")  # draw the predicted box in dashed red.
ax.add_patch(patches.Rectangle((inter_e2[0], inter_e2[1]), inter_e2[2] - inter_e2[0], inter_e2[3] - inter_e2[1], facecolor="yellow", alpha=0.35, edgecolor="none"))  # shade the intersection region.
ax.text(0.4, 0.7, f"IoU = {iou_e2:.3f}", fontsize=13, weight="bold", color="black")  # annotate the result directly on the image.
plt.show()  # render the IoU comparison.
```

▶ What you'll see: green and dashed-red sign boxes with their yellow overlap; the printed IoU determines whether this localization counts as correct.

#### E3. Classification vs localization vs detection

**Goal.** Contrast three output formats: one image label, one label plus one box, and many labels plus many boxes.

```python
image_e3_single, boxes_e3_single, labels_e3_single = load_detection_scene("synthetic")  # load a simple single-cat toy scene.
image_e3_street, boxes_e3, labels_e3 = load_detection_scene("street")  # load a multi-object street scene for detection.
classification_output_e3 = {"image_label": "cat", "confidence": 0.97}  # define whole-image classification output for the single-cat image.
localization_output_e3 = {"label": labels_e3_single[0], "score": 0.94, "box": boxes_e3_single[0]}  # define single-cat localization output with one box.
detection_scores_e3 = np.array([0.94, 0.88, 0.80, 0.76])  # define one confidence score per street-scene detected object.
print("classification output:", classification_output_e3)  # show the one-label output.
print("localization output:", localization_output_e3)  # show one label plus one box.
print("detection output rows:")  # introduce the multi-object output table.
for label, score, box in zip(labels_e3, detection_scores_e3, boxes_e3):  # loop over each detection row.
    print(f"  label={label:>6s} score={score:.2f} box={np.round(box, 1)}")  # print class, confidence, and coordinates.
```

```python
fig, axes = plt.subplots(1, 3, figsize=(15, 4.5))  # create side-by-side panels for the three tasks.
show_scene(None, title="Image classification\nsingle cat image → 1 label", image=image_e3_single, ax=axes[0])  # show no boxes for classification.
axes[0].text(0.6, 1.0, "cat: 0.97", fontsize=11, weight="bold")  # write the whole-image class label.
show_scene([localization_output_e3["box"]], [localization_output_e3["label"]], [localization_output_e3["score"]], title="Classification + localization\ncat + 1 box", image=image_e3_single, ax=axes[1])  # show one cat box.
show_scene(boxes_e3, labels_e3, detection_scores_e3, title="Detection\nstreet scene → many boxes", image=image_e3_street, ax=axes[2])  # show all street-scene object boxes.
plt.tight_layout()  # prevent panel titles and labels from overlapping.
plt.show()  # render the comparison.
```

▶ What you'll see: classification has no rectangle, localization has one rectangle, and detection has a structured list of multiple rectangles.

#### E4. Convert box formats

**Goal.** Convert boxes between corner format and center format, then verify the conversion is lossless.

```python
boxes_e4_xyxy = np.array([[1.0, 5.8, 5.2, 8.8], [7.8, 1.2, 9.3, 6.3], [10.5, 2.0, 12.0, 3.5]])  # define three corner-format boxes.
boxes_e4_center = np.array([xyxy_to_center(box) for box in boxes_e4_xyxy])  # convert every box to center-width-height format.
boxes_e4_roundtrip = np.array([center_to_xyxy(box) for box in boxes_e4_center])  # convert back to corner format.
print("xyxy boxes:\n", np.round(boxes_e4_xyxy, 2))  # print original corner-format boxes.
print("center boxes:\n", np.round(boxes_e4_center, 2))  # print converted center-format boxes.
print("round-trip exact?", np.allclose(boxes_e4_xyxy, boxes_e4_roundtrip))  # verify no information was lost.
```

```python
plt.figure(figsize=(8, 5))  # create a coordinate diagram figure.
ax = show_scene(boxes_e4_xyxy, labels=["car", "person", "sign"], title="E4: corner boxes with center markers", image=make_canvas(kind="road"), grid=True)  # draw the corner-format boxes.
ax.scatter(boxes_e4_center[:, 0], boxes_e4_center[:, 1], s=90, color="black", marker="x", label="(bx, by)")  # overlay the center points from center format.
for center in boxes_e4_center:  # annotate width and height near each center.
    ax.text(center[0] + 0.1, center[1], f"w={center[2]:.1f}\nh={center[3]:.1f}", fontsize=8, color="black")  # write width and height values.
ax.legend(loc="upper right")  # show the center-marker label.
plt.show()  # render the format-conversion diagram.
```

▶ What you'll see: each drawn rectangle has a black center marker and printed width/height values, illustrating both formats at once.

#### E5. Run a pretrained detector on a simple image

**Goal.** Reproduce the interface of a pretrained detector on a simple bicycle-containing image without downloading a model: a frozen, deterministic detector emits class labels, confidence scores, and boxes, then confidence filtering keeps final predictions.

```python
image_e5, gt_e5, labels_gt_e5 = load_detection_scene("street")  # load a simple image-like scene.
raw_boxes_e5 = gt_e5 + RNG.normal(0.0, 0.22, size=gt_e5.shape)  # simulate model box regression noise around true boxes.
raw_boxes_e5 = np.clip(raw_boxes_e5, [0.0, 0.0, 0.1, 0.1], [IMAGE_W - 0.1, IMAGE_H - 0.1, IMAGE_W, IMAGE_H])  # keep simulated predictions inside the image.
raw_labels_e5 = labels_gt_e5.copy()  # use the same classes a pretrained detector would predict for the visible objects.
raw_scores_e5 = np.array([0.93, 0.86, 0.64, 0.58])  # attach plausible detector confidence scores.
conf_e5 = 0.60  # choose a deployment confidence threshold.
keep_e5 = raw_scores_e5 >= conf_e5  # keep only confident predictions.
print("frozen detector predictions after confidence filtering:")  # introduce the output table.
for label, score, box, keep in zip(raw_labels_e5, raw_scores_e5, raw_boxes_e5, keep_e5):  # inspect every raw prediction.
    print(f"{'KEEP' if keep else 'DROP'} label={label:>6s} score={score:.2f} box={np.round(box, 2)}")  # print the keep/drop decision.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(13, 4.8))  # create before/after detector panels.
show_scene(raw_boxes_e5, raw_labels_e5, raw_scores_e5, title="E5: raw frozen-detector outputs", image=image_e5, ax=axes[0])  # show all raw predictions.
show_scene(raw_boxes_e5[keep_e5], raw_labels_e5[keep_e5], raw_scores_e5[keep_e5], title=f"E5: kept predictions at confidence ≥ {conf_e5:.2f}", image=image_e5, ax=axes[1])  # show only kept predictions.
plt.tight_layout()  # keep panel titles readable.
plt.show()  # render the simulated detector output.
```

▶ What you'll see: the raw detector panel includes all predicted boxes; the filtered panel drops the lowest-confidence object and keeps class labels, boxes, and scores.

### 🔴 Advanced Examples

#### A1. Non-max suppression from scratch

**Goal.** Implement and visualize NMS on duplicate boxes around the same objects. We will show raw boxes, the highest-score selection, suppressed boxes, and the final result.

```python
image_a1, gt_a1, labels_gt_a1 = load_detection_scene("street")  # load a multi-object scene.
boxes_a1 = np.vstack([gt_a1[0] + [0.0, 0.0, 0.0, 0.0], gt_a1[0] + [0.25, -0.10, 0.15, 0.20], gt_a1[0] + [-0.20, 0.15, -0.05, 0.05], gt_a1[1] + [0.0, 0.0, 0.0, 0.0], gt_a1[1] + [0.15, 0.20, 0.25, 0.10], gt_a1[2] + [0.0, 0.0, 0.0, 0.0], gt_a1[3] + [0.0, 0.0, 0.0, 0.0]])  # create duplicate predictions around several objects.
labels_a1 = np.array(["car", "car", "car", "person", "person", "sign", "bike"])  # assign classes so NMS can be class-aware.
scores_a1 = np.array([0.95, 0.88, 0.71, 0.91, 0.73, 0.66, 0.52])  # assign confidence scores that determine selection order.
keep_a1, suppressed_a1 = nms(boxes_a1, scores_a1, labels_a1, conf_threshold=0.50, iou_threshold=0.50)  # run the from-scratch NMS implementation.
print("kept indices:", keep_a1)  # print the final selected detections.
print("suppressed indices:", suppressed_a1)  # print the duplicate detections removed by IoU.
```

```python
plt.figure(figsize=(8, 5))  # create a process figure for the first selected box.
ax = show_scene(None, title="A1 step: first NMS selection and same-class suppressions", image=image_a1)  # draw the background first.
draw_boxes(ax, boxes_a1, labels_a1, scores_a1, colors=["gray"] * len(boxes_a1), linewidth=1.0, alpha=0.45)  # draw all raw boxes lightly.
first_a1 = keep_a1[0]  # identify the first selected high-confidence box.
related_a1 = [idx for idx in suppressed_a1 if labels_a1[idx] == labels_a1[first_a1]]  # find boxes suppressed by the first selected class.
draw_boxes(ax, [boxes_a1[first_a1]], [labels_a1[first_a1]], [scores_a1[first_a1]], colors=["limegreen"], linewidth=3.0)  # highlight the selected max-score box.
draw_boxes(ax, boxes_a1[related_a1], labels_a1[related_a1], scores_a1[related_a1], colors=["red"] * len(related_a1), linewidth=2.0, linestyle="--")  # mark suppressed same-class duplicates.
plt.show()  # render the selection step.
```

▶ What you'll see: all candidate boxes in gray, the chosen highest-score car in green, and overlapping car duplicates in dashed red.

```python
fig, axes = plt.subplots(1, 2, figsize=(13, 4.8))  # create before/after panels.
show_scene(boxes_a1, labels_a1, scores_a1, title="A1: before NMS", image=image_a1, ax=axes[0])  # show all duplicate raw predictions.
show_scene(boxes_a1[keep_a1], labels_a1[keep_a1], scores_a1[keep_a1], title="A1: after class-aware NMS", image=image_a1, ax=axes[1])  # show only boxes kept by NMS.
plt.tight_layout()  # keep panels from overlapping.
plt.show()  # render the NMS before/after visualization.
```

▶ What you'll see: duplicate boxes disappear after NMS while one representative per visible object remains.

#### A2. Anchor boxes and aspect ratios

**Goal.** Place tall, wide, and square anchors on grid cells, compute IoU with each object, and choose the best anchor shape.

```python
image_a2, objects_a2, labels_a2 = load_detection_scene("street")  # load objects with different aspect ratios.
anchors_wh_a2 = np.array([[1.2, 4.2], [4.0, 1.8], [1.8, 1.8]])  # define tall-person, wide-car, and square-sign anchor shapes.
anchor_names_a2 = np.array(["tall", "wide", "square"])  # name each anchor by its aspect ratio.
centers_a2 = np.array([xyxy_to_center(box)[:2] for box in objects_a2])  # place anchors at each object's center for matching.
anchor_boxes_a2 = np.array([[*center_to_xyxy([cx, cy, w, h])] for cx, cy in centers_a2 for w, h in anchors_wh_a2])  # build every object-centered anchor candidate.
object_repeated_a2 = np.repeat(np.arange(len(objects_a2)), len(anchors_wh_a2))  # remember which object each anchor candidate is centered on.
anchor_repeated_a2 = np.tile(np.arange(len(anchors_wh_a2)), len(objects_a2))  # remember which anchor shape each candidate uses.
iou_matrix_a2 = np.array([iou(anchor, objects_a2[obj_idx]) for anchor, obj_idx in zip(anchor_boxes_a2, object_repeated_a2)])  # compute candidate-to-object IoUs.
best_local_a2 = []  # store the best anchor candidate for each object.
for obj_idx in range(len(objects_a2)):  # examine one object at a time.
    mask = object_repeated_a2 == obj_idx  # select anchors centered on this object.
    best = np.where(mask)[0][np.argmax(iou_matrix_a2[mask])]  # choose the anchor with maximum IoU for this object.
    best_local_a2.append(best)  # record the selected candidate index.
    print(f"object={labels_a2[obj_idx]:>6s} best_anchor={anchor_names_a2[anchor_repeated_a2[best]]:>6s} IoU={iou_matrix_a2[best]:.3f}")  # print the best anchor match.
best_local_a2 = np.array(best_local_a2)  # convert the selected candidate list to an array for indexing.
```

```python
plt.figure(figsize=(8, 5))  # create an anchor-matching figure.
ax = show_scene(objects_a2, labels_a2, title="A2: best anchor shape per object", image=image_a2, grid=True)  # draw true object boxes.
draw_boxes(ax, anchor_boxes_a2[best_local_a2], labels=anchor_names_a2[anchor_repeated_a2[best_local_a2]], colors=["black"] * len(best_local_a2), linewidth=2.0, linestyle="--")  # overlay selected anchors in dashed black.
plt.show()  # render the anchor assignment.
```

▶ What you'll see: a dashed tall anchor best matches the person, a wide anchor best matches the car/bike, and a square anchor best matches the sign.

#### A3. YOLO grid assignment

**Goal.** Encode which grid cell is responsible for each object and which anchor slot stores its target vector.

```python
image_a3, boxes_a3, labels_a3 = load_detection_scene("sports")  # load a player-and-ball scene.
G_a3 = 4  # choose a 4-by-4 YOLO grid for a small visual example.
cell_w_a3 = IMAGE_W / G_a3  # compute each grid cell's width.
cell_h_a3 = IMAGE_H / G_a3  # compute each grid cell's height.
class_names_a3 = np.array(["person", "ball"])  # define the two-class vocabulary for target encoding.
anchors_wh_a3 = np.array([[1.3, 5.2], [0.9, 0.9]])  # define one tall player anchor and one small ball anchor.
target_a3 = np.zeros((G_a3, G_a3, len(anchors_wh_a3), 5 + len(class_names_a3)))  # allocate YOLO target tensor with objectness, box, and class slots.
assignments_a3 = []  # collect human-readable assignment records.
for box, label in zip(boxes_a3, labels_a3):  # encode one ground-truth object at a time.
    cx, cy, bw, bh = xyxy_to_center(box)  # convert the target box to center-width-height format.
    col = min(G_a3 - 1, int(cx // cell_w_a3))  # map center x to a responsible grid column.
    row = min(G_a3 - 1, int(cy // cell_h_a3))  # map center y to a responsible grid row.
    object_anchor_boxes = np.array([center_to_xyxy([cx, cy, aw, ah]) for aw, ah in anchors_wh_a3])  # place each anchor shape at the object's center.
    best_anchor = int(np.argmax([iou(anchor, box) for anchor in object_anchor_boxes]))  # choose the anchor with highest IoU to the object.
    class_index = int(np.where(class_names_a3 == label)[0][0])  # find the one-hot class slot for the label.
    target_a3[row, col, best_anchor, 0] = 1.0  # set objectness to one for the responsible cell-anchor pair.
    target_a3[row, col, best_anchor, 1:5] = np.array([cx / IMAGE_W, cy / IMAGE_H, bw / IMAGE_W, bh / IMAGE_H])  # store normalized box coordinates.
    target_a3[row, col, best_anchor, 5 + class_index] = 1.0  # store the one-hot class target.
    assignments_a3.append((label, row, col, best_anchor, target_a3[row, col, best_anchor].copy()))  # keep the assignment details for printing.
for label, row, col, anchor, vector in assignments_a3:  # print every encoded object.
    print(f"label={label:>6s} cell=(row {row}, col {col}) anchor={anchor} target={np.round(vector, 3)}")  # show cell, anchor slot, and target vector.
print("target tensor shape:", target_a3.shape)  # confirm the YOLO tensor dimensions.
```

```python
plt.figure(figsize=(8, 5))  # create a YOLO-grid figure.
ax = show_scene(boxes_a3, labels_a3, title="A3: YOLO grid cells responsible for object centers", image=image_a3, grid=False)  # draw sports objects.
for g in range(1, G_a3):  # draw internal vertical grid lines.
    ax.axvline(g * cell_w_a3, color="white", linewidth=1.5)  # add one vertical grid boundary.
for g in range(1, G_a3):  # draw internal horizontal grid lines.
    ax.axhline(g * cell_h_a3, color="white", linewidth=1.5)  # add one horizontal grid boundary.
for label, row, col, anchor, vector in assignments_a3:  # annotate each responsible cell.
    ax.text(col * cell_w_a3 + 0.15, row * cell_h_a3 + 0.35, f"{label}\nanchor {anchor}", color="black", fontsize=10, weight="bold")  # write assignment text inside the responsible cell.
plt.show()  # render the YOLO assignment diagram.
```

▶ What you'll see: a $4\times4$ grid over the scene; the player and ball are assigned to the cells containing their centers and to different anchor slots.

#### A4. Failure case: small/overlapping objects

**Goal.** Diagnose a detection failure on small, crowded objects: confidence filtering can miss small objects, and NMS can merge neighbors when the IoU threshold is too low.

```python
image_a4, gt_a4, labels_a4 = load_detection_scene("crowded_shelf")  # load the intentionally difficult crowded shelf.
noise_a4 = RNG.normal(0.0, 0.10, size=gt_a4.shape)  # create small localization noise for each shelf item.
pred_boxes_a4 = gt_a4 + noise_a4  # simulate raw predictions near each true object.
extra_duplicate_a4 = gt_a4[[5, 6]] + np.array([[0.25, 0.00, 0.25, 0.00], [-0.25, 0.00, -0.25, 0.00]])  # add duplicates between overlapping lower-shelf objects.
pred_boxes_a4 = np.vstack([pred_boxes_a4, extra_duplicate_a4])  # combine ordinary predictions and duplicates.
pred_labels_a4 = np.array(["shelf"] * len(pred_boxes_a4))  # use one class so all boxes compete in NMS.
pred_scores_a4 = np.array([0.42, 0.48, 0.51, 0.46, 0.39, 0.73, 0.69, 0.66, 0.62, 0.60])  # assign lower scores to tiny top-row items.
keep_loose_a4, suppressed_loose_a4 = nms(pred_boxes_a4, pred_scores_a4, pred_labels_a4, conf_threshold=0.45, iou_threshold=0.30)  # run aggressive NMS that may merge neighbors.
keep_strict_a4, suppressed_strict_a4 = nms(pred_boxes_a4, pred_scores_a4, pred_labels_a4, conf_threshold=0.35, iou_threshold=0.70)  # run a more permissive setting for crowded objects.
print("aggressive setting keeps", len(keep_loose_a4), "boxes:", keep_loose_a4)  # report aggressive NMS count.
print("crowd-friendly setting keeps", len(keep_strict_a4), "boxes:", keep_strict_a4)  # report more permissive NMS count.
```

```python
fig, axes = plt.subplots(1, 3, figsize=(16, 4.8))  # create raw and two-threshold panels.
show_scene(pred_boxes_a4, pred_labels_a4, pred_scores_a4, title="A4: raw crowded predictions", image=image_a4, ax=axes[0])  # show all raw predictions.
show_scene(pred_boxes_a4[keep_loose_a4], pred_labels_a4[keep_loose_a4], pred_scores_a4[keep_loose_a4], title="A4: aggressive NMS\nconf≥0.45, IoU<0.30", image=image_a4, ax=axes[1])  # show boxes kept by aggressive settings.
show_scene(pred_boxes_a4[keep_strict_a4], pred_labels_a4[keep_strict_a4], pred_scores_a4[keep_strict_a4], title="A4: crowd-friendly NMS\nconf≥0.35, IoU<0.70", image=image_a4, ax=axes[2])  # show boxes kept by crowd-friendly settings.
plt.tight_layout()  # keep panel titles readable.
plt.show()  # render the failure-case comparison.
```

▶ What you'll see: aggressive confidence and IoU thresholds miss several tiny objects and suppress close neighbors; relaxed settings recover more shelf items but may keep extra duplicates.

#### A5. End-to-end detector evaluation mini-pipeline

**Goal.** Evaluate a tiny detector by matching predictions to ground truth with IoU, then report true positives, false positives, false negatives, precision, and recall.

```python
image_a5, gt_boxes_a5, gt_labels_a5 = load_detection_scene("street")  # load a small annotated evaluation scene.
pred_boxes_a5 = np.vstack([gt_boxes_a5[0] + [0.10, -0.10, 0.15, 0.05], gt_boxes_a5[1] + [0.20, 0.10, 0.15, -0.05], gt_boxes_a5[2] + [1.20, 0.40, 1.40, 0.20], [0.4, 0.5, 2.0, 2.2], gt_boxes_a5[3] + [0.10, 0.10, 0.00, 0.20]])  # create good, bad, and spurious predictions.
pred_labels_a5 = np.array(["car", "person", "sign", "cat", "bike"])  # include one wrong-class false positive.
pred_scores_a5 = np.array([0.94, 0.90, 0.72, 0.55, 0.50])  # assign detector confidence scores.
match_iou_a5 = 0.50  # choose the IoU threshold for true-positive matching.
order_a5 = np.argsort(pred_scores_a5)[::-1]  # evaluate higher-confidence predictions first.
matched_gt_a5 = np.zeros(len(gt_boxes_a5), dtype=bool)  # track which ground-truth boxes have already been claimed.
rows_a5 = []  # store one evaluation row per prediction.
for pred_idx in order_a5:  # process predictions in confidence order.
    same_class = np.where(gt_labels_a5 == pred_labels_a5[pred_idx])[0]  # only match predictions to ground truth of the same class.
    ious = np.array([iou(pred_boxes_a5[pred_idx], gt_boxes_a5[j]) for j in same_class])  # compute IoU to every same-class ground truth.
    best_pos = int(np.argmax(ious)) if len(ious) > 0 else -1  # identify the best same-class match if one exists.
    best_gt = same_class[best_pos] if len(ious) > 0 else -1  # recover the original ground-truth index.
    best_iou = float(ious[best_pos]) if len(ious) > 0 else 0.0  # recover the best IoU value.
    is_tp = (best_gt >= 0) and (best_iou >= match_iou_a5) and (not matched_gt_a5[best_gt])  # require correct class, sufficient IoU, and no previous match.
    if is_tp:  # update the matched state when the prediction is a true positive.
        matched_gt_a5[best_gt] = True  # mark this ground-truth object as claimed.
    rows_a5.append((pred_idx, pred_labels_a5[pred_idx], pred_scores_a5[pred_idx], best_iou, "TP" if is_tp else "FP"))  # store the evaluation decision.
tp_a5 = sum(row[-1] == "TP" for row in rows_a5)  # count true positives.
fp_a5 = sum(row[-1] == "FP" for row in rows_a5)  # count false positives.
fn_a5 = int(np.sum(~matched_gt_a5))  # count unmatched ground-truth objects.
precision_a5 = tp_a5 / (tp_a5 + fp_a5) if (tp_a5 + fp_a5) > 0 else 0.0  # compute precision safely.
recall_a5 = tp_a5 / (tp_a5 + fn_a5) if (tp_a5 + fn_a5) > 0 else 0.0  # compute recall safely.
print("idx label  score bestIoU decision")  # print a compact prediction table header.
for row in rows_a5:  # print each prediction's matching result.
    print(f"{row[0]:>3d} {row[1]:>6s} {row[2]:>5.2f} {row[3]:>7.3f} {row[4]:>8s}")  # show index, label, score, IoU, and TP/FP.
print(f"TP={tp_a5}, FP={fp_a5}, FN={fn_a5}, precision={precision_a5:.3f}, recall={recall_a5:.3f}")  # print final detection metrics.
```

```python
fig, axes = plt.subplots(1, 2, figsize=(13, 4.8))  # create ground-truth and prediction panels.
show_scene(gt_boxes_a5, gt_labels_a5, title="A5: ground truth", image=image_a5, ax=axes[0])  # show annotated objects.
show_scene(pred_boxes_a5, pred_labels_a5, pred_scores_a5, title=f"A5: predictions\nprecision={precision_a5:.2f}, recall={recall_a5:.2f}", image=image_a5, ax=axes[1])  # show detector predictions with scores.
plt.tight_layout()  # keep labels and titles readable.
plt.show()  # render the evaluation summary.
```

▶ What you'll see: predictions that overlap correct same-class ground truth become true positives; shifted boxes, wrong classes, and missing ground-truth objects become false positives or false negatives.

### Interactive Experiment

Use the sliders to change confidence filtering and NMS IoU threshold on the same duplicate predictions from A1. Lower confidence keeps more boxes; lower IoU threshold suppresses more boxes.

```python
def interactive_nms(confidence_threshold=0.50, iou_threshold=0.50):  # define the live NMS function controlled by sliders.
    keep_live, suppressed_live = nms(boxes_a1, scores_a1, labels_a1, conf_threshold=confidence_threshold, iou_threshold=iou_threshold)  # recompute NMS for the current thresholds.
    plt.figure(figsize=(8, 5))  # create a fresh figure for each slider update.
    ax = show_scene(None, title=f"Live NMS: conf≥{confidence_threshold:.2f}, suppress IoU≥{iou_threshold:.2f}", image=image_a1)  # draw the street background.
    passed_live = np.where(scores_a1 >= confidence_threshold)[0]  # identify boxes that pass confidence before NMS.
    draw_boxes(ax, boxes_a1[passed_live], labels_a1[passed_live], scores_a1[passed_live], colors=["lightgray"] * len(passed_live), linewidth=1.0, alpha=0.70)  # draw confidence-passing candidates lightly.
    draw_boxes(ax, boxes_a1[keep_live], labels_a1[keep_live], scores_a1[keep_live], linewidth=3.0)  # draw final kept boxes in class colors.
    ax.text(0.4, 0.7, f"kept={len(keep_live)}  suppressed={len(suppressed_live)}", fontsize=12, weight="bold")  # summarize the current post-processing result.
    plt.show()  # render the live result.
    print("kept indices:", keep_live)  # print selected indices so the visual result has a numeric trace.
    print("suppressed indices:", suppressed_live)  # print suppressed indices for debugging threshold changes.

interact(interactive_nms, confidence_threshold=FloatSlider(value=0.50, min=0.0, max=1.0, step=0.05, description="confidence"), iou_threshold=FloatSlider(value=0.50, min=0.05, max=0.95, step=0.05, description="IoU"))  # attach sliders to the live NMS visualizer.
```

▶ What you'll see: moving the confidence slider changes which candidate boxes enter NMS, while moving the IoU slider changes how aggressively overlapping same-class boxes are suppressed.
