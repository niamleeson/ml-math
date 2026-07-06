# 051 - Expectation-Maximization (gentle)

## Metadata

| Field | Value |
|---|---|
| Lesson id | `ml-em` |
| Module | Machine Learning |
| Source lesson file | Core cheatsheet lesson catalog |
| Recommended page structure | Algorithm page |
| Notebook companion | Required |
| Planned notebook path | `notebooks/core/ml-em-expectation-maximization-gentle.ipynb` |

## Lesson goal

After this lesson, the learner should be able to explain Expectation-Maximization (gentle) in plain English, work through a small numerical example, recognize when the idea applies, and connect it to a concrete ML, deep learning, or AI use case.

Current lesson hook: "Soft clustering when each point partly belongs to several groups."

Prerequisites: `ml-kmeans`, `prob-bayes`, `prob-normal`

## Why this page structure fits

Use a **Algorithm page** because this lesson is mainly about probability statistics. The page should not force a generic template; it should teach the object, formula, procedure, model, or decision process in the format that makes the core idea easiest to use.

## Lesson page plan

1. **Task statement**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
2. **Inputs and outputs**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
3. **Core idea**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
4. **Pseudocode**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
5. **Tiny run by hand**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
6. **State tracker table**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
7. **Why it progresses**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
8. **Complexity and cost**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
9. **Hyperparameters and choices**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
10. **Failure modes**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
11. **From math to code**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.
12. **Practice**: plan this section around `Expectation-Maximization (gentle)`, using plain English first and notation second.

## Formula, symbols, and assumptions plan

- Formula focus: Use the existing lesson formula as the starting formula card.
- Symbol plan: Start from the 4 existing symbol explanations, then add shapes, assumptions, and example values.
- Assumptions plan: list when the idea applies, what can go wrong, and the smallest counterexample.
- Sanity check plan: include at least one range, shape, sign, probability, special-case, or units check.

## Worked walkthrough plan

- Start with the smallest example that still shows the point of Expectation-Maximization (gentle).
- Separate **given**, **need**, and **strategy** before doing any math.
- Use one operation per step and print or show the result of each step.
- Add a short **why this step is legal** note after every transformation.
- End with a plain-English interpretation and a sanity check.

## Practice plan

Trace one tiny example, debug one incorrect trace, compare two settings, then solve one transfer problem. Every practice problem should have a revealable, step-by-step solution.

## Colab notebook plan

Notebook status: **Required**.

Why a notebook helps: Randomness, distributions, estimation, and uncertainty need simulation, tables, histograms, and repeated sampling to feel concrete.

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
| Basic 1 | Coin-flip simulation table | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | bar chart |
| Basic 2 | Single-die outcome table | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | histogram |
| Basic 3 | Two-dice sum table | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | PMF/CDF plot |
| Basic 4 | Colored-urn draw table | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | sampling distribution |
| Basic 5 | Deck-of-cards mini population | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | posterior update chart |
| Basic 6 | Bernoulli ad-click synthetic data | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | bar chart |
| Basic 7 | Binomial batch-conversion data | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | histogram |
| Basic 8 | Poisson call-count data | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | PMF/CDF plot |
| Basic 9 | Exponential wait-time data | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | sampling distribution |
| Basic 10 | Gaussian measurement data | Isolate one small part of Expectation-Maximization (gentle) and print each intermediate value. | posterior update chart |
| Easy 1 | Iris class-frequency dataset | Apply Expectation-Maximization (gentle) to a small realistic dataset and explain the result. | bar chart |
| Easy 2 | Tips-style bill dataset | Apply Expectation-Maximization (gentle) to a small realistic dataset and explain the result. | histogram |
| Easy 3 | Penguins body-measurement dataset | Apply Expectation-Maximization (gentle) to a small realistic dataset and explain the result. | PMF/CDF plot |
| Easy 4 | Flights delay-count dataset | Apply Expectation-Maximization (gentle) to a small realistic dataset and explain the result. | sampling distribution |
| Easy 5 | Titanic survival table | Apply Expectation-Maximization (gentle) to a small realistic dataset and explain the result. | posterior update chart |
| Advanced 1 | Bootstrap sample from diabetes data | Stress-test Expectation-Maximization (gentle) with noise, scale, edge cases, or a comparison. | bar chart |
| Advanced 2 | Heavy-tailed synthetic income data | Stress-test Expectation-Maximization (gentle) with noise, scale, edge cases, or a comparison. | histogram |
| Advanced 3 | Mixture-of-Gaussians synthetic data | Stress-test Expectation-Maximization (gentle) with noise, scale, edge cases, or a comparison. | PMF/CDF plot |
| Advanced 4 | Correlated bivariate normal data | Stress-test Expectation-Maximization (gentle) with noise, scale, edge cases, or a comparison. | sampling distribution |
| Advanced 5 | Hidden-state weather sequence | Stress-test Expectation-Maximization (gentle) with noise, scale, edge cases, or a comparison. | posterior update chart |

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
- [ ] The final section connects Expectation-Maximization (gentle) to ML, deep learning, or AI.
