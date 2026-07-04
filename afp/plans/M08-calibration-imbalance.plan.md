# Module Plan — M8 · Calibration & class imbalance

| Field | Value |
|---|---|
| Domain | Domain 1 · Core: Ranking & Evaluation |
| Skip if you can already… | calibrate a sparse-slice model and explain why raw scores mislead |
| Maps to (projects) | all |
| Primary structure(s) | S6 Applied Engineering / Pitfall |
| Example type | ⚑ Both |
| Sub-lessons | 3 |
| Notebooks | 3 |

## Module hub (the "complete list")
Good rank order is not the same as a good probability. This module teaches how to measure and fix
miscalibration, how class imbalance changes training behavior, and how sparse slices plus delayed
feedback can make apparently good global numbers unsafe for serving.

- M8.1 · Calibration (definition, ECE, Platt vs isotonic; why it feeds pCTR×bid)
- M8.2 · Class imbalance (weights/focal/resampling)
- M8.3 · Calibrating sparse slices & delayed feedback

## Questions this module answers (→ which sub-lesson teaches the answer)
- What does "calibrated probability" mean? → M8.1
- How do you measure calibration with a reliability diagram and ECE? → M8.1
- Why can a model rank well but be uncalibrated, and why does that break pCTR×bid? → M8.1
- When should you use Platt/sigmoid scaling vs isotonic calibration? → M8.1
- How do you handle class imbalance with weighting, focal loss, or resampling? → M8.2
- How do you calibrate sparse slices without overfitting tiny groups? → M8.3
- What is delayed feedback bias and how does it affect calibration/labels? → M8.3

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Calibration definition
- Reliability diagram
- ECE **ƒ**
- Ranking≠calibrated
- Platt/sigmoid scaling **ƒ**
- Isotonic
- Class imbalance
- Class weighting
- Focal loss **ƒ**
- Resampling
- Sparse-slice calibration/shrinkage
- Delayed feedback

## Sub-lessons

### M8.1 · Calibration (definition, ECE, Platt vs isotonic; why it feeds pCTR×bid)  —  [S6 Applied: miscalibrated→fix→numbers, ⚑]
- **Makes answerable:** what calibrated probability means; measuring reliability diagram/ECE; ranking-good ≠ calibrated and why it breaks pCTR×bid; Platt vs isotonic.
- **You'll be able to say:** "A score is calibrated if examples scored 0.2 happen about 20% of the time. A reliability diagram compares predicted vs observed rates by bin, and ECE summarizes the bin gaps. A monotonic transform can preserve ranking AUC while ruining probability scale; pCTR×bid needs probability scale, so use Platt when a sigmoid-shaped correction is enough and isotonic when you need a flexible monotone correction with enough calibration data."
- **Concepts:** calibration definition, reliability diagram, ECE **ƒ**, ranking≠calibrated, Platt/sigmoid scaling **ƒ**, isotonic.
- **Key Idea focus:** correct pipeline + the failure it prevents — evaluate probability scale, not just rank order, before multiplying by bid/value.
- **Worked-example shape:** naive → break → fix → scale: raw overconfident scores rank well but have poor ECE; apply Platt/isotonic; recompute pCTR×bid decisions.
- **Notebook:** Yes — generate monotonic but overconfident pCTR scores; calibration curve, ECE, Platt, isotonic; signature viz = before/after reliability diagram; genuine assert/metric = `assert` ECE decreases after calibration while AUC changes little. Break case = too-small calibration set where isotonic stair-steps/overfits.
- **Real numbers to cite:** score bin around 0.20 with observed CTR 0.08 has a 12-point calibration gap; with bid $10, raw pCTR×bid says $2.00 while calibrated says $0.80.

### M8.2 · Class imbalance (weights/focal/resampling)  —  [S6 Applied, ⚑]
- **Makes answerable:** imbalance handling; class weighting; focal loss; resampling and their tradeoffs.
- **You'll be able to say:** "Rare positives can make accuracy meaningless and gradients dominated by negatives. Class weights rebalance the loss, focal loss downweights easy examples, and resampling changes the training distribution; each can improve learning, but probability outputs may need recalibration because training priors were changed."
- **Concepts:** class imbalance, class weighting, focal loss **ƒ**, resampling, calibration after imbalance handling.
- **Key Idea focus:** correct pipeline + the failure it prevents — learn rare positive signal without mistaking resampled scores for real probabilities.
- **Worked-example shape:** naive majority model → break on recall/PR → fix with weights/focal/resampling → scale by recalibrating or adjusting priors.
- **Notebook:** Yes — imbalanced click dataset; compare unweighted, class-weighted, focal-loss-style, and resampled training; signature viz = PR curve plus calibration curve; genuine assert/metric = `assert` rare-positive recall or PR-AUC improves and calibration is rechecked. Break case = oversampling positives without calibration, causing inflated pCTR.
- **Real numbers to cite:** at 1% positives, a 99% accurate always-negative model has zero recall; oversampling positives to 50/50 changes the training prior by 50×.

### M8.3 · Calibrating sparse slices & delayed feedback  —  [S6 Applied, ⚑]
- **Makes answerable:** sparse-slice calibration; shrinkage; delayed feedback bias.
- **You'll be able to say:** "Global calibration can hide bad slices. For sparse segments, estimate slice calibration with shrinkage toward the global curve so tiny groups do not overfit noise. Delayed feedback means some positives have not arrived yet; treating them as negatives biases probabilities downward, especially in fresh cohorts, so labels need attribution windows, censoring rules, or delay modeling."
- **Concepts:** sparse-slice calibration/shrinkage, reliability diagram, ECE **ƒ**, delayed feedback, class imbalance.
- **Key Idea focus:** correct pipeline + the failure it prevents — per-slice measurement, shrinkage for sparse groups, and label timing discipline.
- **Worked-example shape:** naive global calibration → break on small slice → fix with shrinkage → scale to delayed-label windows.
- **Notebook:** Yes — synthetic slices with different base rates and small sample counts; delayed conversions/clicks; signature viz = per-slice reliability bars with confidence/shrinkage; genuine assert/metric = `assert` shrinkage reduces noisy slice ECE or logloss vs unshrunk estimate on holdout. Break case = calibrating a 20-example slice independently.
- **Real numbers to cite:** a slice with 2 clicks in 20 examples has observed CTR 10% but a wide interval; shrink toward a 5% global rate rather than setting a hard 10% correction.

## Coverage check
All 7 module questions map to a sub-lesson: calibration meaning, reliability/ECE, ranking vs probability, Platt/isotonic → M8.1; imbalance methods → M8.2; sparse-slice calibration and delayed feedback → M8.3. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Problem | Prefer | Watch out |
|---|---|---|
| Smooth global miscalibration | Platt/sigmoid scaling | Too rigid if calibration curve is non-sigmoid. |
| Flexible monotone calibration with enough data | Isotonic | Overfits small calibration sets. |
| Rare positives with weak recall | Class weights or focal loss | Recalibrate if probability scale matters. |
| Extreme imbalance and simple baseline | Resampling | Training prior no longer equals serving prior. |
| Tiny segment calibration | Shrinkage/hierarchical calibration | Independent slice curves are noisy. |
| Fresh labels not fully observed | Delay/censoring model | Naively marking pending positives as negatives biases pCTR down. |

## Resources (from the guide)
- scikit-learn — probability calibration (Platt & isotonic with reliability curves)
- imbalanced-learn (resampling & class-weighting)

## SOTA papers (from the guide)
- On Calibration of Modern Neural Networks (Guo et al., 2017)
- Focal Loss for Dense Object Detection (Lin et al., 2017)
- Modeling Delayed Feedback in Display Advertising (Chapelle, 2014)

## Notes / caveats
- Calibration math is genuine for ECE and Platt scaling; keep sparse-slice shrinkage intuitive unless the lesson introduces a real shrinkage estimator.
- Tie pCTR×bid examples back to M7 without duplicating the entire ranking module.
