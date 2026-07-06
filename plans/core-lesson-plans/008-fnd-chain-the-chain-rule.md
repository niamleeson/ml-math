# 008 - The chain rule

## Metadata

| Field | Value |
|---|---|
| Lesson id | `fnd-chain` |
| Module | Foundations: Math you need first |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Formula / theorem page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/fnd-chain-the-chain-rule.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain The chain rule in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "Derivative of a function inside a function: multiply the slopes. This IS backprop (backpropagation)."

Prerequisites: `fnd-derivative`

## Why this page structure fits

Use a **Formula / theorem page** because this lesson is mainly about calculus optimization. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **The problem this formula solves**: plan this section around `The chain rule`, using plain English first and notation second.
2. **Formula card**: plan this section around `The chain rule`, using plain English first and notation second.
3. **Every symbol explained**: plan this section around `The chain rule`, using plain English first and notation second.
4. **When the formula applies**: plan this section around `The chain rule`, using plain English first and notation second.
5. **Intuition before algebra**: plan this section around `The chain rule`, using plain English first and notation second.
6. **Build-up or mini-derivation**: plan this section around `The chain rule`, using plain English first and notation second.
7. **Worked numerical example**: plan this section around `The chain rule`, using plain English first and notation second.
8. **Sanity checks**: plan this section around `The chain rule`, using plain English first and notation second.
9. **Common misreads**: plan this section around `The chain rule`, using plain English first and notation second.
10. **ML / AI connection**: plan this section around `The chain rule`, using plain English first and notation second.
11. **Practice ladder**: plan this section around `The chain rule`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 3 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of The chain rule.
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Mix recognition, computation, interpretation, and one transfer problem with full step-by-step solutions. Every practice problem should have a revealable, step-by-step solution.

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
| Basic 1 | One-dimensional quadratic values | Isolate one small part of The chain rule and print each intermediate value. | function curve |
| Basic 2 | Noisy line synthetic regression | Isolate one small part of The chain rule and print each intermediate value. | tangent line |
| Basic 3 | Two-parameter bowl surface | Isolate one small part of The chain rule and print each intermediate value. | gradient arrows |
| Basic 4 | Tiny logistic-loss table | Isolate one small part of The chain rule and print each intermediate value. | loss curve |
| Basic 5 | Absolute-value loss samples | Isolate one small part of The chain rule and print each intermediate value. | parameter path plot |
| Basic 6 | Polynomial curve samples | Isolate one small part of The chain rule and print each intermediate value. | function curve |
| Basic 7 | Learning-rate toy sequence | Isolate one small part of The chain rule and print each intermediate value. | tangent line |
| Basic 8 | Mini batch of three examples | Isolate one small part of The chain rule and print each intermediate value. | gradient arrows |
| Basic 9 | Non-convex sine-plus-quadratic curve | Isolate one small part of The chain rule and print each intermediate value. | loss curve |
| Basic 10 | Finite-difference check grid | Isolate one small part of The chain rule and print each intermediate value. | parameter path plot |
| Easy 1 | Diabetes regression dataset | Apply The chain rule to a small realistic dataset and explain the result. | function curve |
| Easy 2 | California housing subset | Apply The chain rule to a small realistic dataset and explain the result. | tangent line |
| Easy 3 | Breast-cancer logistic dataset | Apply The chain rule to a small realistic dataset and explain the result. | gradient arrows |
| Easy 4 | Iris binary subset | Apply The chain rule to a small realistic dataset and explain the result. | loss curve |
| Easy 5 | Synthetic moons classification | Apply The chain rule to a small realistic dataset and explain the result. | parameter path plot |
| Advanced 1 | High-noise regression synthetic set | Stress-test The chain rule with noise, scale, edge cases, or a comparison. | function curve |
| Advanced 2 | Ill-conditioned linear system dataset | Stress-test The chain rule with noise, scale, edge cases, or a comparison. | tangent line |
| Advanced 3 | Imbalanced classification synthetic set | Stress-test The chain rule with noise, scale, edge cases, or a comparison. | gradient arrows |
| Advanced 4 | Regularized polynomial regression set | Stress-test The chain rule with noise, scale, edge cases, or a comparison. | loss curve |
| Advanced 5 | Mini neural-network XOR dataset | Stress-test The chain rule with noise, scale, edge cases, or a comparison. | parameter path plot |

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
- [ ] The final section connects The chain rule to ML, deep learning, or AI.
