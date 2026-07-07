# Object Detection
> **Source:** CS 230 · **Category:** Method/Model · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an `.ipynb` will be generated.

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
