# Lesson Plan — 20 Object Detection

| Field | Value |
|---|---|
| Source | CS 230 |
| Content category | Method/Model |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 45–70 min |
| Source topic file | ../20-object-detection.md |

## Part 1 — Overview (plan)
Object detection extends image classification by predicting both what objects are present and where they are. Hook: "classification answers one label; detection returns a structured set of boxes, classes, and confidence scores."

## Part 2 — Key Idea (plan)
- **Focus (per category = Method/Model):** step-by-step detection pipeline and model outputs: localization, multiple-object detection, IoU evaluation, anchor boxes, non-max suppression, and YOLO/R-CNN contrast.
- **Core artifacts to present:** bounding-box parameterization $(b_x,b_y,b_h,b_w)$; landmark vs box detection; IoU $\operatorname{IoU}(B_p,B_a)=|B_p\cap B_a|/|B_p\cup B_a|$; acceptance threshold such as IoU $\ge0.5$; anchor boxes for multiple aspect ratios; NMS steps (filter by confidence, choose max, suppress same-class boxes with IoU threshold); YOLO grid output $G\times G\times k\times(5+p)$ with $[p_c,b_x,b_y,b_h,b_w,c_1,\ldots,c_p]$; R-CNN as proposal-then-classify.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Draw one bounding box on an image | COCO sample: dog on grass | result: image with labeled $(b_x,b_y,b_w,b_h)$ and corner coordinates | ~4 |
| E2 | Compute and visualize IoU | two hand-coded boxes over a traffic-sign image | process: intersection rectangle shaded; result: IoU annotation | ~5 |
| E3 | Classification vs localization vs detection | three images: single cat, cat with box, street scene | side-by-side output formats and labels | ~4 |
| E4 | Convert box formats | generated boxes in `(x_min,y_min,x_max,y_max)` and center format | coordinate diagram before/after conversion | ~4 |
| E5 | Run a pretrained detector on a simple image | pretrained YOLO/Faster R-CNN on bicycle image | result: final boxes, class labels, confidence scores | ~6 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Non-max suppression from scratch | crowded street image with synthetic duplicate boxes | process: selected max box, suppressed boxes grayed; result: NMS before/after | ~8 |
| A2 | Anchor boxes and aspect ratios | synthetic grid image with tall person, wide car, square sign | process: anchors over grid cells; result: best anchor per object by IoU | ~7 |
| A3 | YOLO grid assignment | sports image with ball and player | process: $G\times G$ grid overlay, responsible cells, tensor slots; result: encoded target sketch | ~8 |
| A4 | Failure case: small/overlapping objects | crowded retail shelf or flock-of-birds image | process: raw predictions; result: missed small objects and duplicate/merged boxes diagnosed with IoU/NMS thresholds | ~8 |
| A5 | End-to-end detector evaluation mini-pipeline | small annotated open image set or COCO validation samples | process: load→predict→match by IoU→score; result: precision/recall table and example false positives/false negatives | ~10 |

## Part 4 — Colab Notebook
- **Notebook file:** notebooks/20-object-detection.ipynb
- **Est. cell count:** ~78 (💻 topic → all 10 examples coded with granular box/IoU/NMS visualizations)
- **Key libraries:** numpy, matplotlib, PIL/opencv-python, torch/torchvision or ultralytics, pandas, ipywidgets.
- **Runtime:** CPU for small examples; GPU optional for faster pretrained detector inference.
- **Failure/edge dataset included:** crowded shelf/birds in A4 — exposes missed small objects, overlapping boxes, and NMS threshold sensitivity.
- **Signature visualizations:** bounding boxes with labels; shaded intersection/union IoU diagrams; NMS before/after; YOLO grid with anchor assignments.

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** distinguish classification/localization/detection; compute IoU for two boxes; convert box coordinate formats; interpret confidence and class labels; state the NMS algorithm.
- **🔴 Hard (5) — themes:** choose IoU and confidence thresholds for an application; explain anchor boxes for overlapping objects; encode a YOLO target tensor cell; debug NMS suppressing a true neighboring object; classify false positives/false negatives from detector outputs.
