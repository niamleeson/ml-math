# 050 - k-means clustering

## Metadata

| Field | Value |
|---|---|
| Lesson id | `ml-kmeans` |
| Module | Machine Learning |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Algorithm page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/ml-kmeans-k-means-clustering.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain k-means clustering in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "Group unlabeled points into k clusters around moving centers."

Prerequisites: `fnd-norm`, `fnd-vector`

## Why this page structure fits

Use a **Algorithm page** because this lesson is mainly about ml models. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Task statement**: plan this section around `k-means clustering`, using plain English first and notation second.
2. **Inputs and outputs**: plan this section around `k-means clustering`, using plain English first and notation second.
3. **Core idea**: plan this section around `k-means clustering`, using plain English first and notation second.
4. **Pseudocode**: plan this section around `k-means clustering`, using plain English first and notation second.
5. **Tiny run by hand**: plan this section around `k-means clustering`, using plain English first and notation second.
6. **State tracker table**: plan this section around `k-means clustering`, using plain English first and notation second.
7. **Why it progresses**: plan this section around `k-means clustering`, using plain English first and notation second.
8. **Complexity and cost**: plan this section around `k-means clustering`, using plain English first and notation second.
9. **Hyperparameters and choices**: plan this section around `k-means clustering`, using plain English first and notation second.
10. **Failure modes**: plan this section around `k-means clustering`, using plain English first and notation second.
11. **From math to code**: plan this section around `k-means clustering`, using plain English first and notation second.
12. **Practice**: plan this section around `k-means clustering`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 4 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of k-means clustering.
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Trace one tiny example, debug one incorrect trace, compare two settings, then solve one transfer problem. Every practice problem should have a revealable, step-by-step solution.

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
| Basic 1 | Hand-built two-point regression data | Isolate one small part of k-means clustering and print each intermediate value. | scatter plot |
| Basic 2 | Tiny classification table | Isolate one small part of k-means clustering and print each intermediate value. | decision boundary |
| Basic 3 | Synthetic blobs dataset | Isolate one small part of k-means clustering and print each intermediate value. | fit line |
| Basic 4 | Synthetic moons dataset | Isolate one small part of k-means clustering and print each intermediate value. | learning curve |
| Basic 5 | Synthetic circles dataset | Isolate one small part of k-means clustering and print each intermediate value. | feature importance chart |
| Basic 6 | Noisy linear regression set | Isolate one small part of k-means clustering and print each intermediate value. | scatter plot |
| Basic 7 | Polynomial regression set | Isolate one small part of k-means clustering and print each intermediate value. | decision boundary |
| Basic 8 | Sparse bag-of-words toy data | Isolate one small part of k-means clustering and print each intermediate value. | fit line |
| Basic 9 | Imbalanced binary data | Isolate one small part of k-means clustering and print each intermediate value. | learning curve |
| Basic 10 | Clustered 2D points | Isolate one small part of k-means clustering and print each intermediate value. | feature importance chart |
| Easy 1 | Iris dataset | Apply k-means clustering to a small realistic dataset and explain the result. | scatter plot |
| Easy 2 | Wine dataset | Apply k-means clustering to a small realistic dataset and explain the result. | decision boundary |
| Easy 3 | Breast-cancer dataset | Apply k-means clustering to a small realistic dataset and explain the result. | fit line |
| Easy 4 | Diabetes regression dataset | Apply k-means clustering to a small realistic dataset and explain the result. | learning curve |
| Easy 5 | Digits dataset | Apply k-means clustering to a small realistic dataset and explain the result. | feature importance chart |
| Advanced 1 | California housing subset | Stress-test k-means clustering with noise, scale, edge cases, or a comparison. | scatter plot |
| Advanced 2 | 20-newsgroups text subset | Stress-test k-means clustering with noise, scale, edge cases, or a comparison. | decision boundary |
| Advanced 3 | Synthetic high-dimensional sparse data | Stress-test k-means clustering with noise, scale, edge cases, or a comparison. | fit line |
| Advanced 4 | Synthetic outlier-heavy data | Stress-test k-means clustering with noise, scale, edge cases, or a comparison. | learning curve |
| Advanced 5 | Synthetic train/test drift data | Stress-test k-means clustering with noise, scale, edge cases, or a comparison. | feature importance chart |

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
- [ ] The final section connects k-means clustering to ML, deep learning, or AI.
