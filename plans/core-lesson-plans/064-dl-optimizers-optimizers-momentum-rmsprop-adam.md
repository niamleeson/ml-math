# 064 - Optimizers: Momentum, RMSprop, Adam

## Metadata

| Field | Value |
|---|---|
| Lesson id | `dl-optimizers` |
| Module | Deep Learning |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Algorithm page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/dl-optimizers-optimizers-momentum-rmsprop-adam.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain Optimizers: Momentum, RMSprop, Adam in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "Smarter ways to step downhill so training is faster and steadier."

Prerequisites: `dl-backprop`

## Why this page structure fits

Use a **Algorithm page** because this lesson is mainly about calculus optimization. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Task statement**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
2. **Inputs and outputs**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
3. **Core idea**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
4. **Pseudocode**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
5. **Tiny run by hand**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
6. **State tracker table**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
7. **Why it progresses**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
8. **Complexity and cost**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
9. **Hyperparameters and choices**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
10. **Failure modes**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
11. **From math to code**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.
12. **Practice**: plan this section around `Optimizers: Momentum, RMSprop, Adam`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 4 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of Optimizers: Momentum, RMSprop, Adam.
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Trace one tiny example, debug one incorrect trace, compare two settings, then solve one transfer problem. Every practice problem should have a revealable, step-by-step solution.

## Colab notebook plan

Notebook status: **Required**.

Why a notebook helps: Change, gradients, updates, and convergence are easier to understand when learners can inspect intermediate values and watch curves move.

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
| Basic 1 | One-dimensional quadratic values | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | function curve |
| Basic 2 | Noisy line synthetic regression | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | tangent line |
| Basic 3 | Two-parameter bowl surface | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | gradient arrows |
| Basic 4 | Tiny logistic-loss table | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | loss curve |
| Basic 5 | Absolute-value loss samples | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | parameter path plot |
| Basic 6 | Polynomial curve samples | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | function curve |
| Basic 7 | Learning-rate toy sequence | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | tangent line |
| Basic 8 | Mini batch of three examples | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | gradient arrows |
| Basic 9 | Non-convex sine-plus-quadratic curve | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | loss curve |
| Basic 10 | Finite-difference check grid | Isolate one small part of Optimizers: Momentum, RMSprop, Adam and print each intermediate value. | parameter path plot |
| Easy 1 | Diabetes regression dataset | Apply Optimizers: Momentum, RMSprop, Adam to a small realistic dataset and explain the result. | function curve |
| Easy 2 | California housing subset | Apply Optimizers: Momentum, RMSprop, Adam to a small realistic dataset and explain the result. | tangent line |
| Easy 3 | Breast-cancer logistic dataset | Apply Optimizers: Momentum, RMSprop, Adam to a small realistic dataset and explain the result. | gradient arrows |
| Easy 4 | Iris binary subset | Apply Optimizers: Momentum, RMSprop, Adam to a small realistic dataset and explain the result. | loss curve |
| Easy 5 | Synthetic moons classification | Apply Optimizers: Momentum, RMSprop, Adam to a small realistic dataset and explain the result. | parameter path plot |
| Advanced 1 | High-noise regression synthetic set | Stress-test Optimizers: Momentum, RMSprop, Adam with noise, scale, edge cases, or a comparison. | function curve |
| Advanced 2 | Ill-conditioned linear system dataset | Stress-test Optimizers: Momentum, RMSprop, Adam with noise, scale, edge cases, or a comparison. | tangent line |
| Advanced 3 | Imbalanced classification synthetic set | Stress-test Optimizers: Momentum, RMSprop, Adam with noise, scale, edge cases, or a comparison. | gradient arrows |
| Advanced 4 | Regularized polynomial regression set | Stress-test Optimizers: Momentum, RMSprop, Adam with noise, scale, edge cases, or a comparison. | loss curve |
| Advanced 5 | Mini neural-network XOR dataset | Stress-test Optimizers: Momentum, RMSprop, Adam with noise, scale, edge cases, or a comparison. | parameter path plot |

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
- [ ] The final section connects Optimizers: Momentum, RMSprop, Adam to ML, deep learning, or AI.
