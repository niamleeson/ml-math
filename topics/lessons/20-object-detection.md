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
