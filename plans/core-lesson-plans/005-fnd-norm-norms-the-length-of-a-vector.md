# 005 - Norms (the length of a vector)

## Metadata

| Field | Value |
|---|---|
| Lesson id | `fnd-norm` |
| Module | Foundations: Math you need first |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Linear algebra page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/fnd-norm-norms-the-length-of-a-vector.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain Norms (the length of a vector) in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "How big is a vector? Norms measure that. They power 'distance' and regularization."

Prerequisites: `fnd-vector`, `fnd-dot`

## Why this page structure fits

Use a **Linear algebra page** because this lesson is mainly about linear algebra. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Geometric intuition first**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
2. **Shape and dimensions**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
3. **Formal definition**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
4. **Symbol and shape decoder**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
5. **Numeric computation**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
6. **Visual interpretation**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
7. **ML connection**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
8. **Shape mistakes**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
9. **Sanity checks**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.
10. **Practice**: plan this section around `Norms (the length of a vector)`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 4 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of Norms (the length of a vector).
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Check dimensions, compute a small numeric example, interpret the geometry, and apply it to features or embeddings. Every practice problem should have a revealable, step-by-step solution.

## Colab notebook plan

Notebook status: **Required**.

Why a notebook helps: Shapes, matrix operations, transformations, and geometry become clearer when learners can print arrays and visualize vectors, grids, heatmaps, and projections.

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
| Basic 1 | Hand-built 2D points table | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | vector arrow plot |
| Basic 2 | Tiny house-feature vectors | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | matrix heatmap |
| Basic 3 | Three-document term-count matrix | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | transformation grid |
| Basic 4 | 2x2 image patch matrix | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | projection plot |
| Basic 5 | Mini movie-rating matrix | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | eigenvector overlay |
| Basic 6 | Toy word-embedding table | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | vector arrow plot |
| Basic 7 | Synthetic 2D covariance cloud | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | matrix heatmap |
| Basic 8 | One-hot category matrix | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | transformation grid |
| Basic 9 | Sensor readings matrix | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | projection plot |
| Basic 10 | Tiny graph adjacency matrix | Isolate one small part of Norms (the length of a vector) and print each intermediate value. | eigenvector overlay |
| Easy 1 | Iris feature matrix | Apply Norms (the length of a vector) to a small realistic dataset and explain the result. | vector arrow plot |
| Easy 2 | Digits 8x8 image vectors | Apply Norms (the length of a vector) to a small realistic dataset and explain the result. | matrix heatmap |
| Easy 3 | Wine chemistry matrix | Apply Norms (the length of a vector) to a small realistic dataset and explain the result. | transformation grid |
| Easy 4 | Breast-cancer feature matrix | Apply Norms (the length of a vector) to a small realistic dataset and explain the result. | projection plot |
| Easy 5 | Diabetes regression feature matrix | Apply Norms (the length of a vector) to a small realistic dataset and explain the result. | eigenvector overlay |
| Advanced 1 | California housing numeric matrix | Stress-test Norms (the length of a vector) with noise, scale, edge cases, or a comparison. | vector arrow plot |
| Advanced 2 | Olivetti faces pixel matrix subset | Stress-test Norms (the length of a vector) with noise, scale, edge cases, or a comparison. | matrix heatmap |
| Advanced 3 | 20-newsgroups TF-IDF subset | Stress-test Norms (the length of a vector) with noise, scale, edge cases, or a comparison. | transformation grid |
| Advanced 4 | Synthetic correlated 50D matrix | Stress-test Norms (the length of a vector) with noise, scale, edge cases, or a comparison. | projection plot |
| Advanced 5 | User-item sparse ratings matrix | Stress-test Norms (the length of a vector) with noise, scale, edge cases, or a comparison. | eigenvector overlay |

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
- [ ] The final section connects Norms (the length of a vector) to ML, deep learning, or AI.
