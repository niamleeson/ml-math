# 056 - ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)

## Metadata

| Field | Value |
|---|---|
| Lesson id | `ml-roc-auc` |
| Module | Machine Learning |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Interpretation page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/ml-roc-auc-roc-receiver-operating-characteristic-curve-auc-area-under-the-curve.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "See how a classifier trades off catches against false alarms."

Prerequisites: `ml-classification-metrics`

## Why this page structure fits

Use a **Interpretation page** because this lesson is mainly about metrics interpretation. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Question the visual answers**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.
2. **Axes and entries**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.
3. **Construct it from data**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.
4. **Read it correctly**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.
5. **Worked interpretation**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.
6. **Common misreads**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.
7. **ML action**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.
8. **Practice**: plan this section around `ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve)`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 4 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve).
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Construct the visual from data, read it, choose an action, and explain one common misread. Every practice problem should have a revealable, step-by-step solution.

## Colab notebook plan

Notebook status: **Required**.

Why a notebook helps: Metrics are visual and decision-oriented, so learners should build confusion matrices, curves, and threshold tables from predictions.

The notebook must run top-to-bottom in Google Colab and contain exactly **20 runnable examples**: **10 basic**, **5 easy**, and **5 advanced**. Each example must use a different dataset or a clearly different synthetic data-generating process.

### Required structure for every notebook example

1. State the goal of the example.
2. Load or generate the dataset.
3. Print a preview of the raw data.
4. Print shapes, columns, or key counts.
5. Run the step-by-step computation.
6. Print important intermediate values.
7. Visualize what changed or what the result means.
8. Interpret the result in plain English.
9. Run a sanity check.
10. Give one small edit for the learner to try.

### Example roster

| Example | Dataset or data-generating process | Walkthrough focus | Visualization / output |
|---|---|---|---|
| Basic 1 | Hand-built predictions table | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | confusion matrix |
| Basic 2 | Binary classifier toy scores | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | ROC curve |
| Basic 3 | Three-class toy labels | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | precision-recall curve |
| Basic 4 | Regression residual toy table | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | residual plot |
| Basic 5 | Imbalanced fraud-style synthetic scores | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | calibration curve |
| Basic 6 | Threshold sweep toy dataset | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | confusion matrix |
| Basic 7 | Noisy probability calibration table | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | ROC curve |
| Basic 8 | Ranking relevance mini list | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | precision-recall curve |
| Basic 9 | Segmented performance mini table | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | residual plot |
| Basic 10 | Cost-sensitive prediction table | Isolate one small part of ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) and print each intermediate value. | calibration curve |
| Easy 1 | Breast-cancer classification dataset | Apply ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) to a small realistic dataset and explain the result. | confusion matrix |
| Easy 2 | Iris multiclass dataset | Apply ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) to a small realistic dataset and explain the result. | ROC curve |
| Easy 3 | Wine multiclass dataset | Apply ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) to a small realistic dataset and explain the result. | precision-recall curve |
| Easy 4 | Digits subset | Apply ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) to a small realistic dataset and explain the result. | residual plot |
| Easy 5 | Diabetes regression dataset | Apply ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) to a small realistic dataset and explain the result. | calibration curve |
| Advanced 1 | California housing regression subset | Stress-test ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) with noise, scale, edge cases, or a comparison. | confusion matrix |
| Advanced 2 | Synthetic imbalanced classification set | Stress-test ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) with noise, scale, edge cases, or a comparison. | ROC curve |
| Advanced 3 | Synthetic multilabel tag set | Stress-test ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) with noise, scale, edge cases, or a comparison. | precision-recall curve |
| Advanced 4 | Synthetic ranking dataset | Stress-test ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) with noise, scale, edge cases, or a comparison. | residual plot |
| Advanced 5 | Time-split synthetic drift dataset | Stress-test ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) with noise, scale, edge cases, or a comparison. | calibration curve |

## Completion checklist

- [ ] Page uses the recommended structure instead of a one-size-fits-all template.
- [ ] Plain-English intuition appears before formal notation.
- [ ] Every symbol is defined before use.
- [ ] Assumptions and failure cases are explicit.
- [ ] At least one worked example uses real numbers.
- [ ] Practice includes step-by-step solutions.
- [ ] The Colab notebook has 10 basic, 5 easy, and 5 advanced runnable examples.
- [ ] Every notebook example uses a different dataset or synthetic process.
- [ ] Visualizations or printed outputs make each step observable.
- [ ] The final section connects ROC (Receiver Operating Characteristic) curve & AUC (Area Under the Curve) to ML, deep learning, or AI.
