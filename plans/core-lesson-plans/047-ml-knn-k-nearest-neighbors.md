# 047 - k-nearest neighbors

## Metadata

| Field | Value |
|---|---|
| Lesson id | `ml-knn` |
| Module | Machine Learning |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Model page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/ml-knn-k-nearest-neighbors.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain k-nearest neighbors in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "To predict a new point, look at the closest known points."

Prerequisites: `fnd-norm`, `ml-supervised`

## Why this page structure fits

Use a **Model page** because this lesson is mainly about ml models. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Prediction or discovery task**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
2. **Tiny dataset**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
3. **Model assumption**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
4. **Model equation**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
5. **Loss or objective**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
6. **Training procedure**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
7. **Inference procedure**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
8. **Worked training step**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
9. **Evaluation**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
10. **Interpretation**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
11. **Strengths and limitations**: plan this section around `k-nearest neighbors`, using plain English first and notation second.
12. **Practice / mini-lab**: plan this section around `k-nearest neighbors`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 4 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of k-nearest neighbors.
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Compute one prediction by hand, train or update once, interpret the result, then diagnose one failure case. Every practice problem should have a revealable, step-by-step solution.

## Colab notebook plan

Notebook status: **Required**.

Why a notebook helps: Model lessons should include data, fitting, prediction, evaluation, interpretation, and failure cases on multiple datasets.

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
| Basic 1 | Hand-built two-point regression data | Isolate one small part of k-nearest neighbors and print each intermediate value. | scatter plot |
| Basic 2 | Tiny classification table | Isolate one small part of k-nearest neighbors and print each intermediate value. | decision boundary |
| Basic 3 | Synthetic blobs dataset | Isolate one small part of k-nearest neighbors and print each intermediate value. | fit line |
| Basic 4 | Synthetic moons dataset | Isolate one small part of k-nearest neighbors and print each intermediate value. | learning curve |
| Basic 5 | Synthetic circles dataset | Isolate one small part of k-nearest neighbors and print each intermediate value. | feature importance chart |
| Basic 6 | Noisy linear regression set | Isolate one small part of k-nearest neighbors and print each intermediate value. | scatter plot |
| Basic 7 | Polynomial regression set | Isolate one small part of k-nearest neighbors and print each intermediate value. | decision boundary |
| Basic 8 | Sparse bag-of-words toy data | Isolate one small part of k-nearest neighbors and print each intermediate value. | fit line |
| Basic 9 | Imbalanced binary data | Isolate one small part of k-nearest neighbors and print each intermediate value. | learning curve |
| Basic 10 | Clustered 2D points | Isolate one small part of k-nearest neighbors and print each intermediate value. | feature importance chart |
| Easy 1 | Iris dataset | Apply k-nearest neighbors to a small realistic dataset and explain the result. | scatter plot |
| Easy 2 | Wine dataset | Apply k-nearest neighbors to a small realistic dataset and explain the result. | decision boundary |
| Easy 3 | Breast-cancer dataset | Apply k-nearest neighbors to a small realistic dataset and explain the result. | fit line |
| Easy 4 | Diabetes regression dataset | Apply k-nearest neighbors to a small realistic dataset and explain the result. | learning curve |
| Easy 5 | Digits dataset | Apply k-nearest neighbors to a small realistic dataset and explain the result. | feature importance chart |
| Advanced 1 | California housing subset | Stress-test k-nearest neighbors with noise, scale, edge cases, or a comparison. | scatter plot |
| Advanced 2 | 20-newsgroups text subset | Stress-test k-nearest neighbors with noise, scale, edge cases, or a comparison. | decision boundary |
| Advanced 3 | Synthetic high-dimensional sparse data | Stress-test k-nearest neighbors with noise, scale, edge cases, or a comparison. | fit line |
| Advanced 4 | Synthetic outlier-heavy data | Stress-test k-nearest neighbors with noise, scale, edge cases, or a comparison. | learning curve |
| Advanced 5 | Synthetic train/test drift data | Stress-test k-nearest neighbors with noise, scale, edge cases, or a comparison. | feature importance chart |

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
- [ ] The final section connects k-nearest neighbors to ML, deep learning, or AI.
