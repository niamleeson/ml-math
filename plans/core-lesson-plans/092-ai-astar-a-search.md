# 092 - A* search

## Metadata

| Field | Value |
|---|---|
| Lesson id | `ai-astar` |
| Module | Artificial Intelligence |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Algorithm page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/ai-astar-a-search.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain A* search in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "Uniform cost search with a hint. Aim toward the goal and reach it much faster."

Prerequisites: `ai-graph-search`

## Why this page structure fits

Use a **Algorithm page** because this lesson is mainly about ai decision. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Task statement**: plan this section around `A* search`, using plain English first and notation second.
2. **Inputs and outputs**: plan this section around `A* search`, using plain English first and notation second.
3. **Core idea**: plan this section around `A* search`, using plain English first and notation second.
4. **Pseudocode**: plan this section around `A* search`, using plain English first and notation second.
5. **Tiny run by hand**: plan this section around `A* search`, using plain English first and notation second.
6. **State tracker table**: plan this section around `A* search`, using plain English first and notation second.
7. **Why it progresses**: plan this section around `A* search`, using plain English first and notation second.
8. **Complexity and cost**: plan this section around `A* search`, using plain English first and notation second.
9. **Hyperparameters and choices**: plan this section around `A* search`, using plain English first and notation second.
10. **Failure modes**: plan this section around `A* search`, using plain English first and notation second.
11. **From math to code**: plan this section around `A* search`, using plain English first and notation second.
12. **Practice**: plan this section around `A* search`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 6 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of A* search.
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Trace one tiny example, debug one incorrect trace, compare two settings, then solve one transfer problem. Every practice problem should have a revealable, step-by-step solution.

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
| Basic 1 | Three-node graph | Isolate one small part of A* search and print each intermediate value. | state graph |
| Basic 2 | Small weighted graph | Isolate one small part of A* search and print each intermediate value. | frontier table |
| Basic 3 | Tiny grid maze | Isolate one small part of A* search and print each intermediate value. | value grid |
| Basic 4 | Toy road-map graph | Isolate one small part of A* search and print each intermediate value. | policy arrows |
| Basic 5 | Mini game tree | Isolate one small part of A* search and print each intermediate value. | game tree trace |
| Basic 6 | Two-state MDP | Isolate one small part of A* search and print each intermediate value. | state graph |
| Basic 7 | Three-state weather MDP | Isolate one small part of A* search and print each intermediate value. | frontier table |
| Basic 8 | Gridworld rewards table | Isolate one small part of A* search and print each intermediate value. | value grid |
| Basic 9 | Tiny CSP map-coloring graph | Isolate one small part of A* search and print each intermediate value. | policy arrows |
| Basic 10 | Small Bayes-net table | Isolate one small part of A* search and print each intermediate value. | game tree trace |
| Easy 1 | Larger random gridworld | Apply A* search to a small realistic dataset and explain the result. | state graph |
| Easy 2 | Weighted maze with obstacles | Apply A* search to a small realistic dataset and explain the result. | frontier table |
| Easy 3 | Synthetic delivery-route graph | Apply A* search to a small realistic dataset and explain the result. | value grid |
| Easy 4 | Tic-tac-toe state subset | Apply A* search to a small realistic dataset and explain the result. | policy arrows |
| Easy 5 | FrozenLake-like grid | Apply A* search to a small realistic dataset and explain the result. | game tree trace |
| Advanced 1 | Noisy transition MDP | Stress-test A* search with noise, scale, edge cases, or a comparison. | state graph |
| Advanced 2 | Sparse-reward gridworld | Stress-test A* search with noise, scale, edge cases, or a comparison. | frontier table |
| Advanced 3 | Constraint scheduling toy data | Stress-test A* search with noise, scale, edge cases, or a comparison. | value grid |
| Advanced 4 | Hidden-state sequence toy data | Stress-test A* search with noise, scale, edge cases, or a comparison. | policy arrows |
| Advanced 5 | Logic knowledge-base examples | Stress-test A* search with noise, scale, edge cases, or a comparison. | game tree trace |

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
- [ ] The final section connects A* search to ML, deep learning, or AI.
