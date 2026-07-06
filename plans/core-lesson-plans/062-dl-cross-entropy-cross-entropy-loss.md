# 062 - Cross-entropy loss

## Metadata

| Field | Value |
|---|---|
| Lesson id | `dl-cross-entropy` |
| Module | Deep Learning |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Formula / theorem page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/dl-cross-entropy-cross-entropy-loss.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain Cross-entropy loss in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "Measures how wrong a yes/no prediction is. Confident and wrong hurts the most."

Prerequisites: `dl-forward-prop`, `ml-loss`, `ml-logistic-regression`

## Why this page structure fits

Use a **Formula / theorem page** because this lesson is mainly about deep learning. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **The problem this formula solves**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
2. **Formula card**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
3. **Every symbol explained**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
4. **When the formula applies**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
5. **Intuition before algebra**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
6. **Build-up or mini-derivation**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
7. **Worked numerical example**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
8. **Sanity checks**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
9. **Common misreads**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
10. **ML / AI connection**: plan this section around `Cross-entropy loss`, using plain English first and notation second.
11. **Practice ladder**: plan this section around `Cross-entropy loss`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 4 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of Cross-entropy loss.
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Mix recognition, computation, interpretation, and one transfer problem with full step-by-step solutions. Every practice problem should have a revealable, step-by-step solution.

## Colab notebook plan

Notebook status: **Required**.

Why a notebook helps: Tensor shapes, forward passes, gradients, activations, and training behavior are much easier to learn from runnable cells and visuals.

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
| Basic 1 | Single-neuron toy table | Isolate one small part of Cross-entropy loss and print each intermediate value. | tensor shape printout |
| Basic 2 | XOR dataset | Isolate one small part of Cross-entropy loss and print each intermediate value. | activation curve |
| Basic 3 | Two-spirals synthetic data | Isolate one small part of Cross-entropy loss and print each intermediate value. | training curve |
| Basic 4 | Tiny 4x4 image patches | Isolate one small part of Cross-entropy loss and print each intermediate value. | filter/output heatmap |
| Basic 5 | Tiny token-sequence dataset | Isolate one small part of Cross-entropy loss and print each intermediate value. | attention heatmap |
| Basic 6 | Mini embedding lookup table | Isolate one small part of Cross-entropy loss and print each intermediate value. | tensor shape printout |
| Basic 7 | Synthetic sine sequence | Isolate one small part of Cross-entropy loss and print each intermediate value. | activation curve |
| Basic 8 | Noisy classification blobs | Isolate one small part of Cross-entropy loss and print each intermediate value. | training curve |
| Basic 9 | Tiny convolution input grid | Isolate one small part of Cross-entropy loss and print each intermediate value. | filter/output heatmap |
| Basic 10 | Toy attention key-query-value table | Isolate one small part of Cross-entropy loss and print each intermediate value. | attention heatmap |
| Easy 1 | Digits 8x8 dataset | Apply Cross-entropy loss to a small realistic dataset and explain the result. | tensor shape printout |
| Easy 2 | Fashion-MNIST sample | Apply Cross-entropy loss to a small realistic dataset and explain the result. | activation curve |
| Easy 3 | MNIST sample | Apply Cross-entropy loss to a small realistic dataset and explain the result. | training curve |
| Easy 4 | CIFAR-10 sample | Apply Cross-entropy loss to a small realistic dataset and explain the result. | filter/output heatmap |
| Easy 5 | IMDB sentiment sample | Apply Cross-entropy loss to a small realistic dataset and explain the result. | attention heatmap |
| Advanced 1 | Reuters topic sample | Stress-test Cross-entropy loss with noise, scale, edge cases, or a comparison. | tensor shape printout |
| Advanced 2 | Synthetic long-sequence memory task | Stress-test Cross-entropy loss with noise, scale, edge cases, or a comparison. | activation curve |
| Advanced 3 | Synthetic noisy-label image task | Stress-test Cross-entropy loss with noise, scale, edge cases, or a comparison. | training curve |
| Advanced 4 | Synthetic class-imbalance task | Stress-test Cross-entropy loss with noise, scale, edge cases, or a comparison. | filter/output heatmap |
| Advanced 5 | Synthetic augmentation comparison set | Stress-test Cross-entropy loss with noise, scale, edge cases, or a comparison. | attention heatmap |

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
- [ ] The final section connects Cross-entropy loss to ML, deep learning, or AI.
