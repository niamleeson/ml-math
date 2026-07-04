# Object Detection

> **Source:** Deep Learning — Stanford CS 230 &middot; Topic 20/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 1.6 Object detection

- **Types of models** — There are 3 main types of object recognition algorithms, for which the nature of what is predicted is different. They are described in the table below:

| Image classification | Classification w. localization | Detection |
|---|---|---|
| *[Figure: Image classification. A teddy-bear image is labeled "Teddy bear" without a localization box, illustrating whole-image class prediction.]* | *[Figure: Classification with localization. A teddy-bear image is labeled "Teddy bear" and has a single white bounding box around the bear, illustrating one-object localization.]* | *[Figure: Detection. A teddy-bear image has a white box and label for the teddy bear plus a red box and label for the book, illustrating multiple object detections.]* |
| - Classifies a picture<br>- Predicts probability of object | - Detects an object in a picture<br>- Predicts probability of object and where it is located | - Detects up to several objects in a picture<br>- Predicts probabilities of objects and where they are located |
| Traditional CNN | Simplified YOLO, R-CNN | YOLO, R-CNN |

- **Detection** — In the context of object detection, different methods are used depending on whether we just want to locate the object or detect a more complex shape in the image. The two main ones are summed up in the table below:

| Bounding box detection | Landmark detection |
|---|---|
| - Detects the part of the image where the object is located | - Detects a shape or characteristics of an object (e.g. eyes)<br>- More granular |
| *[Figure: Bounding box detection. A faded teddy-bear image contains a white rectangular box with center $(b_x,b_y)$, height $b_h$, and width $b_w$ labeled, showing rectangular object localization.]* | *[Figure: Landmark detection. A faded teddy-bear image contains several labeled reference points $(l_{1x},l_{1y}), \ldots, (l_{nx},l_{ny})$ on object parts, showing fine-grained shape or characteristic localization.]* |
| Box of center $(b_x,b_y)$, height $b_h$ and width $b_w$ | Reference points $(l_{1x},l_{1y}), \ldots, (l_{nx},l_{ny})$ |

- **Intersection over Union** — Intersection over Union, also known as $\textrm{IoU}$, is a function that quantifies how correctly positioned a predicted bounding box $B_p$ is over the actual bounding box $B_a$. It is defined as:

$$
\boxed{\textrm{IoU}(B_p, B_a) = \frac{B_p \cap B_a}{B_p \cup B_a}}
$$

*[Figure: Intersection over Union examples. Three teddy-bear images compare actual bounding box $B_a$ in white with predicted box $B_p$ in blue; captions show $\textrm{IoU}(B_p,B_a)=0.1$, $0.5$, and $0.9$, illustrating poor, threshold-level, and strong overlap.]*

Remark: we always have $\textrm{IoU} \in [0,1]$. By convention, a predicted bounding box $B_p$ is considered as being reasonably good if $\textrm{IoU}(B_p,B_a) \geqslant 0.5$.

- **Anchor boxes** — Anchor boxing is a technique used to predict overlapping bounding boxes. In practice, the network is allowed to predict more than one box simultaneously, where each box prediction is constrained to have a given set of geometrical properties. For instance, the first prediction can potentially be a rectangular box of a given form, while the second will be another rectangular box of a different geometrical form.

- **Non-max suppression** — The non-max suppression technique aims at removing duplicate overlapping bounding boxes of a same object by selecting the most representative ones. After having removed all boxes having a probability prediction lower than $0.6$, the following steps are repeated while there are boxes remaining:

For a given class,

- Step 1: Pick the box with the largest prediction probability.
- Step 2: Discard any box having an $\textrm{IoU} \geqslant 0.5$ with the previous box.

*[Figure: Non-max suppression. A sequence of teddy-bear panels begins with many predicted white and red bounding boxes, selects the maximum-probability box (score shown near 0.9978), removes overlapping boxes of the same class, and ends with final bounding boxes for "Teddy bear" and "Book." The arrows illustrate duplicate-box pruning.]*

- **YOLO** — You Only Look Once (YOLO) is an object detection algorithm that performs the following steps:

- Step 1: Divide the input image into a $G \times G$ grid.
- Step 2: For each grid cell, run a CNN that predicts $y$ of the following form:

$$
\boxed{y = \big[\underbrace{p_c, b_x, b_y, b_h, b_w, c_1, c_2, \ldots, c_p}_{\textrm{repeated } k \textrm{ times}}, \ldots\big]^T \in \mathbb{R}^{G \times G \times k \times (5+p)}}
$$

where $p_c$ is the probability of detecting an object, $b_x,b_y,b_h,b_w$ are the properties of the detected bouding box, $c_1,\ldots,c_p$ is a one-hot representation of which of the $p$ classes were detected, and $k$ is the number of anchor boxes.

- Step 3: Run the non-max suppression algorithm to remove any potential duplicate overlapping bounding boxes.

*[Figure: YOLO pipeline. The original teddy-bear image is overlaid with a $G \times G$ grid, grid cells produce bounding box predictions with centers and multiple boxes, and non-max suppression yields final labeled boxes for "Teddy bear" and "Book." The diagram illustrates YOLO's single-pass grid-based detection.]*

Remark: when $p_c = 0$, then the network does not detect any object. In that case, the corresponding predictions $b_x, \ldots, c_p$ have to be ignored.

- **R-CNN** — Region with Convolutional Neural Networks (R-CNN) is an object detection algorithm that first segments the image to find potential relevant bounding boxes and then run the detection algorithm to find most probable objects in those bounding boxes.

*[Figure: R-CNN pipeline. The teddy-bear image is first converted into a segmentation proposal view, then candidate bounding boxes are drawn over segmented regions, and non-max suppression produces final boxes labeled "Teddy bear" and "Book." The diagram illustrates proposal-based detection before classification.]*

Remark: although the original algorithm is computationally expensive and slow, newer architectures enabled the algorithm to run faster, such as Fast R-CNN and Faster R-CNN.
