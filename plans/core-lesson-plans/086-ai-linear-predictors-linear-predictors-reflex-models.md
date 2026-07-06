# 086 - Linear predictors (reflex models)

## Metadata

| Field | Value |
|---|---|
| Lesson id | `ai-linear-predictors` |
| Module | Artificial Intelligence |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Model page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/ai-linear-predictors-linear-predictors-reflex-models.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain Linear predictors (reflex models) in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "Turn an input into numbers, take a dot product, read off a yes/no answer."

Prerequisites: `fnd-dot`

## Why this page structure fits

Use a **Model page** because this lesson is mainly about ai decision. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Prediction or discovery task**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
2. **Tiny dataset**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
3. **Model assumption**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
4. **Model equation**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
5. **Loss or objective**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
6. **Training procedure**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
7. **Inference procedure**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
8. **Worked training step**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
9. **Evaluation**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
10. **Interpretation**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
11. **Strengths and limitations**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.
12. **Practice / mini-lab**: plan this section around `Linear predictors (reflex models)`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 8 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of Linear predictors (reflex models).
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Compute one prediction by hand, train or update once, interpret the result, then diagnose one failure case. Every practice problem should have a revealable, step-by-step solution.

## Colab notebook plan

Notebook status: **Required**.

Why a notebook helps: Search, planning, games, and reinforcement learning are best learned by tracing states, frontiers, values, policies, and updates over time.

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
| Basic 1 | Three-node graph | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | state graph |
| Basic 2 | Small weighted graph | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | frontier table |
| Basic 3 | Tiny grid maze | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | value grid |
| Basic 4 | Toy road-map graph | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | policy arrows |
| Basic 5 | Mini game tree | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | game tree trace |
| Basic 6 | Two-state MDP | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | state graph |
| Basic 7 | Three-state weather MDP | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | frontier table |
| Basic 8 | Gridworld rewards table | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | value grid |
| Basic 9 | Tiny CSP map-coloring graph | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | policy arrows |
| Basic 10 | Small Bayes-net table | Isolate one small part of Linear predictors (reflex models) and print each intermediate value. | game tree trace |
| Easy 1 | Larger random gridworld | Apply Linear predictors (reflex models) to a small realistic dataset and explain the result. | state graph |
| Easy 2 | Weighted maze with obstacles | Apply Linear predictors (reflex models) to a small realistic dataset and explain the result. | frontier table |
| Easy 3 | Synthetic delivery-route graph | Apply Linear predictors (reflex models) to a small realistic dataset and explain the result. | value grid |
| Easy 4 | Tic-tac-toe state subset | Apply Linear predictors (reflex models) to a small realistic dataset and explain the result. | policy arrows |
| Easy 5 | FrozenLake-like grid | Apply Linear predictors (reflex models) to a small realistic dataset and explain the result. | game tree trace |
| Advanced 1 | Noisy transition MDP | Stress-test Linear predictors (reflex models) with noise, scale, edge cases, or a comparison. | state graph |
| Advanced 2 | Sparse-reward gridworld | Stress-test Linear predictors (reflex models) with noise, scale, edge cases, or a comparison. | frontier table |
| Advanced 3 | Constraint scheduling toy data | Stress-test Linear predictors (reflex models) with noise, scale, edge cases, or a comparison. | value grid |
| Advanced 4 | Hidden-state sequence toy data | Stress-test Linear predictors (reflex models) with noise, scale, edge cases, or a comparison. | policy arrows |
| Advanced 5 | Logic knowledge-base examples | Stress-test Linear predictors (reflex models) with noise, scale, edge cases, or a comparison. | game tree trace |

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
- [ ] The final section connects Linear predictors (reflex models) to ML, deep learning, or AI.
