# Ideal Lesson Page Structures

This is the reusable planning reference for building lessons from the All AI Cheatsheet content.
It is intentionally renderer-agnostic: design the best learning page first, then build whatever
renderer or content schema supports it later.

The core rule: every page should teach one clear thing the learner can do afterward. The page
shape should change based on the kind of content being taught.

---

## Universal lesson rules

Use these on every page, regardless of lesson type.

1. Start with the learner's goal in plain English.
2. Explain why the idea exists before showing formal notation.
3. Define every symbol before asking the learner to use it.
4. Put assumptions next to the formula, not buried at the end.
5. Use one small numerical example before any abstract generalization.
6. Show one operation per step in derivations and worked examples.
7. Include a sanity check: units, shape, probability range, sign, limit behavior, or an easy special case.
8. End with practice that matches the page type.
9. Connect the idea to ML, deep learning, or AI only after the learner understands the math.
10. Prefer "try, then reveal" solutions so pages stay readable but still complete.
11. Add a runnable Google Colab notebook whenever computation, data, simulation, or visualization
    would make the lesson clearer.

Every formula should eventually answer:

- What problem does this solve?
- When am I allowed to use it?
- What does every symbol mean?
- What are the assumptions?
- How do I compute it with real numbers?
- How do I know the answer is reasonable?
- Where does it show up in ML, deep learning, or AI?

---

## Page structure chooser

| Content type | Best page structure | Typical examples |
|---|---|---|
| New vocabulary or object | Concept / definition page | event, random variable, vector, matrix, loss, policy |
| Standalone formula or theorem | Formula / theorem page | Bayes' rule, expectation, variance, chain rule |
| Result that needs justification | Derivation / proof page | normal equation, logistic gradient, backprop equation |
| Skill the learner must perform | Worked problem page | compute a gradient, marginalize a joint PMF, multiply matrices |
| Repeated procedure | Algorithm page | gradient descent, k-means, BFS, value iteration |
| ML method | Model page | linear regression, logistic regression, SVM, PCA |
| Probability family | Distribution page | Bernoulli, Binomial, Gaussian, Poisson |
| Geometric math object | Linear algebra page | dot product, eigenvectors, SVD, norms |
| Change or optimization idea | Calculus / optimization page | derivative, gradient, Jacobian, Hessian |
| Data uncertainty method | Statistics / estimation page | MLE, confidence interval, hypothesis test |
| Neural network component | Deep learning component page | activation, convolution, attention, dropout |
| Search, planning, or RL concept | AI decision-process page | A*, minimax, MDP, Bellman equation, Q-learning |
| Choosing between tools | Comparison page | precision vs recall, L1 vs L2, generative vs discriminative |
| Reading a chart or metric | Interpretation page | ROC, confusion matrix, decision boundary |
| Hands-on implementation | Coding lab page | implement softmax, train linear regression, run k-means |
| Runnable computational practice | Colab companion notebook | simulations, model training, metric visualizations |
| Mixed review | Review / capstone page | probability review, ML pipeline project, AI planning task |

---

## Google Colab notebook companion plan

Some lessons should have a full runnable notebook in addition to the reading page. The notebook is
not just extra practice: it is the hands-on version of the lesson where learners see data, code,
intermediate values, plots, and model behavior.

### When a notebook is required

Create a notebook when the lesson includes any of these:

- Repeated numeric computation.
- Simulation or randomness.
- Matrix, vector, tensor, or shape manipulation.
- Optimization steps.
- Model training or evaluation.
- Dataset exploration.
- Metrics, curves, or visual interpretation.
- Algorithms that can be traced over iterations.
- Deep learning components that are easier to understand through tensors.
- AI search, planning, or reinforcement learning examples that benefit from step-by-step traces.

Notebook companions are usually required for:

- Worked problem pages.
- Algorithm pages.
- Model pages.
- Distribution pages.
- Linear algebra pages with matrix operations.
- Calculus / optimization pages.
- Statistics / estimation pages.
- Deep learning component pages.
- AI decision-process pages.
- Interpretation pages.
- Coding lab pages.
- Review / capstone pages.

Notebook companions are usually optional or unnecessary for:

- Pure vocabulary pages.
- Very short concept pages with no meaningful computation.
- Comparison pages where the main task is verbal judgment.
- Historical or orientation pages.

### Notebook requirement

Every notebook should contain exactly 20 runnable examples:

| Tier | Count | Purpose |
|---|---:|---|
| Basic | 10 | Isolate the core idea with tiny, beginner-friendly examples |
| Easy | 5 | Apply the idea to small realistic datasets with light interpretation |
| Advanced | 5 | Combine ideas, handle messier data, or expose edge cases |

Each of the 20 examples should use a different dataset. If a public dataset is not appropriate,
use a different synthetic data-generating process with a clear story, fixed random seed, and printed
sample rows. Do not reuse the same dataset with only minor column changes.

### Notebook file conventions

- Store notebooks under `notebooks/`.
- Name them with the lesson id and slug: `notebooks/<lesson-id>-<slug>.ipynb`.
- Start each notebook with an "Open in Colab" badge when published.
- The notebook must run top-to-bottom in a fresh Colab runtime.
- Use only public, no-auth datasets.
- Prefer built-in or stable sources: `sklearn.datasets`, seaborn sample datasets, small raw GitHub
  CSV files, UCI-style CSV URLs, or clearly generated synthetic data.
- Set random seeds for every generated or randomized example.
- Keep install cells minimal. If a package is not essential, do not use it.

### Notebook page flow

1. **Title and lesson link**: name the lesson the notebook belongs to.
2. **What you will build or observe**: concrete notebook outcome.
3. **How to use this notebook**: run cells in order, inspect outputs, modify values.
4. **Setup cell**: imports, plotting style, random seed, helper functions.
5. **Concept refresher**: the formula, algorithm, or object in plain English.
6. **Dataset roster**: list the 20 datasets and what each one teaches.
7. **10 basic runnable examples**.
8. **5 easy runnable examples**.
9. **5 advanced runnable examples**.
10. **Wrap-up table**: what each example demonstrated.
11. **Optional challenges**: small modifications for learners who want more.

### Required structure for every runnable example

Each example should follow the same learning rhythm even when the content changes:

1. **Goal**: what this example will show.
2. **Dataset**: where the data comes from and what each row means.
3. **Preview**: print a few rows or values before doing math.
4. **Shape check**: print array, matrix, tensor, or dataframe shapes when relevant.
5. **Step-by-step code**: short cells with comments that match the math.
6. **Intermediate output**: print the important values after each major step.
7. **Visualization**: chart, scatter plot, heatmap, histogram, line plot, confusion matrix,
   decision boundary, training curve, graph trace, or dataframe display.
8. **Interpretation**: plain-English explanation of what the output means.
9. **Sanity check**: probability range, dimensions, monotonic behavior, loss direction, or known
   special case.
10. **Try changing this**: one small parameter or input the learner can edit.

### Tier definitions

#### Basic examples

Basic examples should be small, transparent, and close to hand computation.

- Use tiny arrays, tiny dataframes, or simple generated data.
- Print almost every intermediate value.
- Prefer one concept per example.
- Use simple charts: scatter plots, bar charts, line charts, histograms, or small heatmaps.
- Avoid clever abstractions. The learner should see what is happening.

#### Easy examples

Easy examples should feel like real ML practice without being overwhelming.

- Use small public datasets.
- Include simple preprocessing when it teaches something important.
- Show before / after comparisons.
- Use train/test splits only when relevant.
- Include interpretation of coefficients, metrics, clusters, components, probabilities, or curves.

#### Advanced examples

Advanced examples should stretch the learner without becoming a production project.

- Combine two or more ideas from the lesson path.
- Include noisier data, class imbalance, overfitting, regularization, convergence behavior, or
  algorithm tradeoffs when relevant.
- Compare at least two settings, models, hyperparameters, or assumptions.
- Include a visualization that reveals behavior that raw numbers hide.
- End with a short "what this teaches" note.

### Visualization expectations by topic

| Topic type | Useful notebook visuals |
|---|---|
| Probability distributions | histograms, PMF bars, PDF curves, CDF curves, simulation convergence |
| Conditional probability and Bayes | probability trees, stacked bars, posterior updates |
| Statistics and estimation | sampling distributions, confidence intervals, bootstrap histograms |
| Linear algebra | vector arrows, transformation grids, heatmaps, eigendirection plots |
| Calculus and optimization | function curves, tangent lines, gradient fields, loss surfaces |
| Regression and classification | fitted lines, decision boundaries, residual plots, metric curves |
| Clustering and PCA | cluster scatter plots, centroid movement, explained variance plots |
| Deep learning | tensor shape prints, activation curves, filter outputs, attention heatmaps |
| Search and planning | graph traversal order, frontier tables, path-cost plots |
| Reinforcement learning | value grids, policy arrows, reward curves, Q-table updates |
| Evaluation metrics | confusion matrices, ROC curves, precision-recall curves, calibration plots |

### Notebook quality checklist

Before a notebook is complete, confirm:

- It runs top-to-bottom in a fresh Colab runtime.
- It has exactly 10 basic, 5 easy, and 5 advanced examples.
- All 20 examples use different datasets or clearly different synthetic data-generating processes.
- Every example has a goal, dataset explanation, preview, runnable code, output, visualization,
  interpretation, sanity check, and edit prompt.
- Outputs are visible and useful: prints, dataframes, charts, graphs, or tables.
- The notebook teaches the lesson concept directly; it is not a random coding exercise.
- The learner can understand the code without already being an expert programmer.
- Any randomness is seeded.
- Any external dataset URL is stable and public.
- The final wrap-up connects the notebook back to the lesson page.

---

## 1. Concept / definition page

Use this when the learner mainly needs a new mental object.

Examples: sample space, event, random variable, feature vector, parameter, hypothesis, policy,
state, action, reward, tensor.

### Ideal page flow

1. **Plain-English goal**: "After this page, you can recognize and describe a random variable."
2. **Why this idea exists**: the real problem this concept helps name.
3. **Tiny world example**: a coin, die, 2-row dataset, 2-state game, or 2D point.
4. **Informal definition**: one sentence with no notation.
5. **Formal definition**: notation introduced slowly.
6. **Symbol decoder**: every symbol, set, function, index, and condition.
7. **Examples and non-examples**: show what qualifies and what does not.
8. **Boundary cases**: empty set, impossible event, deterministic value, zero vector, terminal state.
9. **Use-it checkpoint**: learner classifies or labels a small example.
10. **Where it fits**: how later formulas will use this object.
11. **Practice**: short recognition and construction tasks.

### Practice style

- 5 to 8 quick tasks.
- Mix "identify", "create your own", and "fix the mistaken example".
- Full solutions should explain the deciding feature, not just the answer.

---

## 2. Formula / theorem page

Use this when the central thing is a formula the learner must understand and apply.

Examples: Bayes' rule, total probability, expectation, variance, covariance, entropy, chain rule,
gradient update, softmax, Bellman equation.

### Ideal page flow

1. **Problem first**: the question the formula answers.
2. **Formula card**:
   - formula name
   - formula
   - when to use it
   - assumptions
   - output meaning
3. **Symbol decoder**: each symbol in plain English.
4. **Intuition before algebra**: what the formula is doing conceptually.
5. **Build-up or mini-derivation**: enough to make the formula feel earned.
6. **First plug-in example**: real numbers, one substitution per line.
7. **Reverse example**: solve for a missing quantity or interpret the result.
8. **Sanity checks**: range, sign, sum-to-one, shape, limiting case, or known simple case.
9. **Common misreads**: assumptions, swapped conditionals, wrong denominator, shape mismatch.
10. **ML / AI connection**: where the formula appears in a model, loss, metric, or decision rule.
11. **Practice ladder**: easy plug-in, medium interpretation, hard mixed problem.

### Practice style

- 6 to 10 problems.
- At least one problem should ask "Can you use this formula here? Why or why not?"
- At least one problem should connect to a small ML or AI scenario.

---

## 3. Derivation / proof page

Use this when the learner should see where a formula comes from.

Examples: deriving linear regression normal equations, logistic regression gradient, backprop,
MLE for a distribution, variance identity, bias-variance decomposition.

### Ideal page flow

1. **Destination first**: show the final result and say why it matters.
2. **Roadmap**: 3 to 5 high-level moves before the detailed algebra.
3. **Starting assumptions**: dimensions, differentiability, independence, convexity, distributional assumptions.
4. **Needed tools refresh**: only the rules used in this derivation.
5. **Line-by-line derivation**:
   - one algebra or calculus operation per line
   - each line says why the move is legal
   - no skipped simplifications
6. **Meaning of the final formula**: explain what each term contributes.
7. **Numerical verification**: plug in small numbers to confirm the formula behaves correctly.
8. **Optional code verification**: compare analytic result to finite differences or brute force.
9. **Failure conditions**: when the derivation would not apply.
10. **Practice**: partial derivations and "fill the missing step" problems.

### Practice style

- 3 to 6 deeper problems.
- Prefer fewer problems with complete walkthroughs.
- Include one "debug this derivation" exercise.

---

## 4. Worked problem page

Use this when the main goal is procedural fluency.

Examples: compute a posterior, find a gradient, multiply matrices, compute a confusion matrix,
evaluate a policy, run one step of value iteration.

### Ideal page flow

1. **Problem statement**: clear inputs and requested output.
2. **Given / need table**: separate known facts from the target.
3. **Strategy choice**: why this method fits the problem.
4. **Step-by-step walkthrough**:
   - one operation per step
   - result after each operation
   - short reason for the step
5. **Checkpoint pauses**: small questions before major steps.
6. **Sanity check**: confirm the answer is plausible.
7. **Final answer**: plain statement, including units or interpretation.
8. **Alternate path**: if useful, show a shorter or more general method.
9. **Practice variants**: same structure with changed numbers, then changed context.

### Practice style

- 4 to 8 problems.
- First problem mirrors the example.
- Last problem changes the surface story so the learner must transfer the method.

---

## 5. Algorithm page

Use this when the lesson teaches a repeatable procedure.

Examples: gradient descent, stochastic gradient descent, k-means, EM, BFS, DFS, A*, minimax,
value iteration, policy iteration.

### Ideal page flow

1. **Task statement**: what the algorithm tries to accomplish.
2. **Inputs and outputs**: data, parameters, hyperparameters, stopping condition.
3. **Core idea in one paragraph**: the algorithm's main loop in plain English.
4. **Pseudocode**: short, readable, and aligned with the later example.
5. **Tiny run by hand**: 2 to 5 iterations on a toy example.
6. **State tracker table**: show how variables change each iteration.
7. **Why it improves or progresses**: objective decrease, frontier expansion, policy improvement, etc.
8. **Complexity and cost**: time, memory, data needs, or compute bottleneck.
9. **Hyperparameters and choices**: learning rate, k, depth limit, heuristic, discount factor.
10. **Failure modes**: non-convergence, local minima, bad initialization, inadmissible heuristic.
11. **From math to code**: implementation notes and shape expectations.
12. **Practice**: trace, modify, debug, and apply.

### Practice style

- 1 hand-tracing exercise.
- 1 debugging exercise.
- 1 "what changes if..." exercise.
- 1 small coding or pseudocode exercise when appropriate.

---

## 6. Model page

Use this for a complete machine learning method.

Examples: linear regression, logistic regression, naive Bayes, SVM, decision trees, random forests,
PCA, clustering models.

### Ideal page flow

1. **Prediction or discovery task**: what kind of problem the model solves.
2. **Tiny dataset**: small enough to inspect by eye.
3. **Model assumption**: the shape of relationship the model believes in.
4. **Model equation**: prediction function with symbol decoder.
5. **Loss or objective**: what "good" means mathematically.
6. **Training procedure**: how parameters are found.
7. **Inference procedure**: how the trained model predicts or transforms new data.
8. **Worked training step**: one update, split, projection, or probability calculation by hand.
9. **Evaluation**: metric that matches the task.
10. **Interpretation**: what parameters, coefficients, splits, or components mean.
11. **Strengths and limitations**: when to use it and when not to.
12. **Practice / mini-lab**: train or evaluate on a tiny dataset.

### Practice style

- Include both math and interpretation.
- Ask the learner to compute at least one prediction by hand.
- Include one question about model fit, assumptions, or failure cases.

---

## 7. Probability distribution page

Use this for a named random variable family.

Examples: Bernoulli, Binomial, Geometric, Poisson, Uniform, Gaussian, Exponential, Multinomial.

### Ideal page flow

1. **Story generator**: the real-world random experiment that creates this distribution.
2. **Support**: possible values the random variable can take.
3. **Parameters**: what knobs control the distribution.
4. **PMF or PDF**: formula with symbol decoder.
5. **CDF if important**: when cumulative probability is more useful than point probability.
6. **Mean and variance**: formulas plus intuitive meaning.
7. **Shape intuition**: what changes when parameters change.
8. **Worked probability**: compute a probability using real numbers.
9. **Estimation**: how parameters are estimated from data, if relevant.
10. **Relationships**: how it connects to other distributions.
11. **ML use cases**: likelihoods, generative models, noise assumptions, counts, classifiers.
12. **Practice**: identify, compute, compare, and estimate.

### Practice style

- 5 to 8 problems.
- Include one "which distribution fits this story?" problem.
- Include one parameter-change interpretation problem.

---

## 8. Linear algebra page

Use this for vectors, matrices, transformations, and geometry.

Examples: dot product, matrix multiplication, inverse, determinant, rank, eigenvectors, eigenvalues,
norms, projections, SVD.

### Ideal page flow

1. **Geometric intuition first**: points, arrows, stretching, rotation, projection, compression.
2. **Shape and dimensions**: what sizes are legal.
3. **Formal definition**: operation or object with notation.
4. **Symbol and shape decoder**: dimensions next to symbols.
5. **Numeric computation**: small 2D or 2-by-2 example.
6. **Visual or verbal interpretation**: what changed geometrically.
7. **ML connection**: features, embeddings, layers, PCA, attention, optimization.
8. **Shape mistakes**: illegal multiplication, transposes, row/column confusion.
9. **Sanity checks**: dimensions, identity cases, zero vector, symmetry, sign.
10. **Practice**: compute, check dimensions, interpret.

### Practice style

- Include dimension-checking problems.
- Include one "explain the geometry" problem.
- Include one ML-shaped example using features, weights, or embeddings.

---

## 9. Calculus / optimization page

Use this for change, slopes, gradients, and finding best values.

Examples: derivative, partial derivative, gradient, Jacobian, Hessian, chain rule, Taylor expansion,
convexity, constrained optimization.

### Ideal page flow

1. **Change question**: what changes when an input changes?
2. **Local picture**: slope, tangent, direction, curvature, or sensitivity.
3. **Formal definition**: derivative or optimization condition.
4. **Symbol decoder**: scalar, vector, matrix, function, parameter.
5. **Compute by hand**: small function with one operation per step.
6. **Interpret the result**: sign, magnitude, direction, curvature.
7. **Optimization move**: how the derivative guides a better choice.
8. **ML connection**: loss minimization, backprop, regularization, training dynamics.
9. **Sanity checks**: zero gradient at optimum, finite difference check, shape check.
10. **Practice**: differentiate, interpret, and take an optimization step.

### Practice style

- Include one pure computation.
- Include one interpretation question.
- Include one gradient-descent-style update.

---

## 10. Statistics / estimation page

Use this for learning from samples and measuring uncertainty.

Examples: estimator, bias, variance, MLE, MAP, confidence interval, hypothesis test, p-value,
bootstrap, covariance, correlation.

### Ideal page flow

1. **Uncertainty question**: what we want to know but cannot observe directly.
2. **Data-generating setup**: population, sample, parameter, statistic.
3. **Estimator or test statistic**: formula with symbol decoder.
4. **Assumptions**: independence, sample size, distribution, random sampling.
5. **Worked sample data**: compute from a small dataset.
6. **Interpretation in plain English**: what the number means and does not mean.
7. **Sampling variability**: how the answer would change across samples.
8. **Common misinterpretations**: confidence, p-values, correlation, causation.
9. **ML connection**: evaluation, generalization, parameter estimates, uncertainty.
10. **Practice**: compute, interpret, and critique.

### Practice style

- Include one computation from raw data.
- Include one interpretation question.
- Include one "spot the invalid conclusion" question.

---

## 11. Deep learning component page

Use this for a neural-network building block.

Examples: activation function, softmax, convolution, pooling, batch normalization, dropout,
embedding, attention, transformer block, cross-entropy loss.

### Ideal page flow

1. **Network problem**: what issue this component solves.
2. **Component intuition**: what role it plays in the network.
3. **Forward pass formula**: inputs, outputs, and parameters.
4. **Shape tracker**: tensor dimensions before and after.
5. **Tiny tensor example**: compute with small numbers.
6. **Backward-pass intuition**: what gradients must flow through it.
7. **Training behavior**: stability, saturation, regularization, expressiveness, or compute cost.
8. **Implementation notes**: batching, broadcasting, numerical stability.
9. **Failure modes**: vanishing gradients, overfitting, exploding values, masking mistakes.
10. **Practice**: compute forward pass, check shapes, reason about training behavior.

### Practice style

- Include at least one shape question.
- Include one numeric forward-pass question.
- Include one conceptual training-behavior question.

---

## 12. AI decision-process page

Use this for search, planning, games, Markov decision processes, and reinforcement learning.

Examples: BFS, DFS, uniform-cost search, A*, minimax, alpha-beta pruning, MDP, policy, value
function, Bellman equation, Q-learning.

### Ideal page flow

1. **World setup**: states, actions, transitions, costs, rewards, or opponents.
2. **Goal**: path, plan, policy, value, or decision.
3. **Rule or equation**: search rule, backup equation, or update formula.
4. **Symbol decoder**: state, action, reward, transition, discount, heuristic, value.
5. **Tiny run**: trace a graph, game tree, or MDP for one or two steps.
6. **Decision table**: compare available choices.
7. **Why the rule works**: optimality, admissibility, dynamic programming, exploration.
8. **Complexity and tradeoffs**: time, memory, optimality, completeness.
9. **Failure modes**: bad heuristic, sparse reward, loops, horizon issues, exploration gaps.
10. **Practice**: trace, choose, update, and explain.

### Practice style

- Include one hand trace.
- Include one "which action is chosen?" problem.
- Include one question about guarantees or failure conditions.

---

## 13. Comparison page

Use this when the learner must choose between related ideas.

Examples: precision vs recall, L1 vs L2 regularization, MSE vs cross-entropy, generative vs
discriminative, bagging vs boosting, BFS vs DFS, value iteration vs policy iteration.

### Ideal page flow

1. **Decision question**: "Which one should I use, and why?"
2. **Shared foundation**: what the compared ideas have in common.
3. **Side-by-side table**: purpose, formula, assumptions, strengths, weaknesses.
4. **Decision rules**: practical rules of thumb.
5. **Worked scenarios**: choose the right option for 3 concrete cases.
6. **Tradeoff explanation**: what you gain and what you give up.
7. **Common bad choices**: tempting but wrong pairings.
8. **Practice**: choose, justify, and critique.

### Practice style

- Scenario-based questions are better than pure computation.
- Answers must explain the choice, not just name it.

---

## 14. Interpretation page

Use this when the learner must read a graph, table, curve, or metric.

Examples: confusion matrix, ROC curve, precision-recall curve, calibration plot, loss curve,
decision boundary, residual plot, attention map.

### Ideal page flow

1. **Question the visual answers**: what decision this chart supports.
2. **Axes and entries**: define every row, column, axis, color, and scale.
3. **Construct it from data**: build a tiny version by hand.
4. **Read it correctly**: what patterns mean.
5. **Worked interpretation**: make a decision from the chart.
6. **Common misreads**: threshold confusion, class imbalance, correlation, overfitting signals.
7. **ML action**: what to change based on the visual.
8. **Practice**: calculate, read, decide.

### Practice style

- Include one construction problem.
- Include one interpretation problem.
- Include one "what would you do next?" problem.

---

## 15. Coding lab page

Use this when the best way to learn is to build or simulate.

Examples: implement gradient descent, compute softmax safely, train logistic regression, run k-means,
simulate a Markov chain, implement value iteration.

### Ideal page flow

1. **Lab goal**: what the learner will build.
2. **Prerequisites**: math ideas and coding tools needed.
3. **Starter data**: tiny dataset or environment.
4. **Expected output**: what success looks like.
5. **Step 1: implement the smallest piece**.
6. **Step 2: test with a hand-computable case**.
7. **Step 3: scale to a slightly larger case**.
8. **Inspect and explain results**: connect output back to math.
9. **Debug checklist**: shape, NaN, sign, off-by-one, normalization, random seed.
10. **Extensions**: optional improvements or experiments.
11. **Reflection**: what changed when a parameter changed?

### Practice style

- Code should be short and inspectable.
- Every lab needs a hand-computable test case.
- Avoid hiding the math inside library calls until after the learner implements the core idea.
- If the coding lab is a full lesson rather than a tiny demo, it should have a Colab notebook with
  10 basic, 5 easy, and 5 advanced runnable examples.

---

## 16. Review / capstone page

Use this to combine several ideas after a section.

Examples: probability review, linear algebra for ML review, end-to-end linear classifier, small RL
planning task, neural-network training walkthrough.

### Ideal page flow

1. **Concept map**: the ideas being connected.
2. **Readiness warmup**: 3 to 5 quick prerequisite checks.
3. **Integrated problem**: one realistic task that requires multiple tools.
4. **Tool-choice narration**: explain why each formula or concept is used.
5. **Full walkthrough**: solve the integrated problem step by step.
6. **Transfer challenge**: similar task with a new surface story.
7. **Self-assessment**: what the learner should now be able to do.
8. **Next bridge**: what this prepares them for.

### Practice style

- Fewer but richer problems.
- Require the learner to choose methods, not just execute named steps.
- Include one cumulative challenge with a complete solution.

---

## Reusable page blocks

These blocks can be inserted into any page type when useful.

### Formula card

- Name
- Formula
- Reads as
- Use when
- Assumptions
- Output
- One-line intuition

### Symbol decoder

| Symbol | Meaning | Shape / type | Example value |
|---|---|---|---|
| `x` | input feature vector | vector | `[2, 5, 1]` |
| `w` | learned weights | vector | `[0.4, -1.2, 0.7]` |
| `y` | target label | scalar | `1` |

### Assumption box

- What must be true?
- Why is it needed?
- What breaks if it is false?
- How can the learner recognize the assumption in a problem?

### Shape tracker

Use for linear algebra, deep learning, and vectorized ML.

| Quantity | Shape | Meaning |
|---|---:|---|
| `X` | `n x d` | `n` examples, `d` features |
| `w` | `d x 1` | one weight per feature |
| `Xw` | `n x 1` | one prediction per example |

### One-step derivation row

| Step | Operation | Result | Why this is allowed |
|---:|---|---|---|
| 1 | Substitute the definition of the loss | `...` | We need the expression in terms of the parameter |

### Sanity check block

Use at least one:

- Probability is between 0 and 1.
- Probabilities sum or integrate to 1.
- Matrix dimensions match.
- Gradient has the same shape as the parameter.
- Loss is nonnegative.
- Special case matches intuition.
- Larger input causes the expected direction of change.

### Misconception block

Use only for high-risk ideas.

- Mistake
- Why it is tempting
- Correct interpretation
- Tiny counterexample

### Try / reveal block

Use for practice solutions.

- Problem
- Try first prompt
- Revealable step-by-step solution
- Final answer
- What this problem was testing

---

## Suggested mapping for the cheatsheet topics

| Cheatsheet area | Primary structures to use |
|---|---|
| Probability axioms and events | Concept page, formula page |
| Counting | Worked problem page, formula page |
| Conditional probability and Bayes | Formula / theorem page, worked problem page |
| Discrete and continuous random variables | Concept page, distribution page |
| Expectation, variance, covariance | Formula page, derivation page |
| Common distributions | Distribution page |
| Estimation and hypothesis testing | Statistics / estimation page |
| Vectors, matrices, eigenvalues, SVD | Linear algebra page |
| Derivatives, gradients, optimization | Calculus / optimization page |
| Regression and classification | Model page |
| Loss functions and regularization | Formula page, comparison page |
| Clustering and dimensionality reduction | Model page, algorithm page |
| Neural-network layers and activations | Deep learning component page |
| Backpropagation | Derivation page, algorithm page |
| CNNs, RNNs, attention, transformers | Deep learning component page, coding lab page |
| Search algorithms | AI decision-process page, algorithm page |
| Game playing | AI decision-process page |
| MDPs and reinforcement learning | AI decision-process page, formula page |
| Model metrics and evaluation | Interpretation page, comparison page |

---

## Notebook priority by cheatsheet area

| Cheatsheet area | Notebook priority | Why |
|---|---|---|
| Probability axioms and events | Optional | Best learned first through small conceptual examples |
| Counting | Optional | Useful for simulations, but many lessons are hand-computation first |
| Conditional probability and Bayes | High | Posterior updates are clearer with tables and plots |
| Discrete and continuous random variables | High | Simulation makes PMF, PDF, CDF, expectation, and variance visible |
| Common distributions | High | Each distribution benefits from sampling and parameter-change visuals |
| Estimation and hypothesis testing | High | Sampling variability and p-values need simulation to become intuitive |
| Vectors, matrices, eigenvalues, SVD | High | Shapes, transformations, projections, and decompositions need visuals |
| Derivatives, gradients, optimization | High | Learners should see slopes, gradients, and loss curves move |
| Regression and classification | Required | Model lessons should include data, training, prediction, and evaluation |
| Loss functions and regularization | High | Curves and parameter comparisons make tradeoffs visible |
| Clustering and dimensionality reduction | Required | Learners need scatter plots, centroids, projections, and explained variance |
| Neural-network layers and activations | High | Tensor shapes, activations, and forward passes need runnable examples |
| Backpropagation | Required | Gradients need step-by-step numeric and code verification |
| CNNs, RNNs, attention, transformers | Required | These are hard to understand without tensor, filter, sequence, and attention visuals |
| Search algorithms | High | Graph traces and frontier tables make algorithm behavior visible |
| Game playing | High | Tree traces and value backups should be runnable |
| MDPs and reinforcement learning | Required | Value updates, policies, and rewards need iteration traces |
| Model metrics and evaluation | Required | Confusion matrices, ROC, PR curves, and calibration are visual topics |

---

## Recommended lesson length by type

| Page type | Best length | Reason |
|---|---:|---|
| Concept / definition | 8 to 12 minutes | Focus on recognition and language |
| Formula / theorem | 12 to 18 minutes | Needs intuition, assumptions, and worked use |
| Derivation / proof | 18 to 30 minutes | Needs slower line-by-line reasoning |
| Worked problem | 10 to 20 minutes | Practice-focused and concrete |
| Algorithm | 20 to 35 minutes | Needs trace, pseudocode, and failure modes |
| Model | 25 to 40 minutes | Combines task, formula, training, evaluation |
| Distribution | 15 to 25 minutes | Needs story, formula, moments, use cases |
| Coding lab | 30 to 60 minutes | Learner needs time to implement and debug |
| Colab companion notebook | 60 to 120 minutes | Learner explores 20 runnable examples with datasets and visuals |
| Review / capstone | 30 to 60 minutes | Integrates multiple prior lessons |

---

## Ideal page skeletons

Use these as starting templates, not as fixed renderer contracts.

### Short concept skeleton

```md
# Lesson title

## What you will be able to do

## Why this idea exists

## Tiny example

## Plain-English definition

## Formal definition

## Every symbol explained

## Examples and non-examples

## Quick check

## Where this shows up later

## Practice
```

### Formula skeleton

```md
# Lesson title

## The problem this formula solves

## Formula card

## Every symbol explained

## When the formula applies

## Intuition

## Build-up or derivation

## Worked example

## Sanity check

## Common mistakes

## ML / AI connection

## Practice
```

### Algorithm skeleton

```md
# Lesson title

## What the algorithm does

## Inputs and outputs

## Core idea

## Pseudocode

## Trace a tiny example

## Why the algorithm makes progress

## Complexity and tradeoffs

## Failure modes

## Implementation notes

## Practice
```

### Model skeleton

```md
# Lesson title

## What task this model solves

## Tiny dataset

## Model assumption

## Prediction formula

## Loss or objective

## Training

## Inference

## Worked example

## Evaluation

## Interpretation

## Strengths and limitations

## Practice or mini-lab
```

### Coding lab skeleton

```md
# Lesson title

## Lab goal

## What you need before starting

## Starter data

## Step 1: build the smallest piece

## Step 2: test against a hand-computable case

## Step 3: run the full example

## Inspect the output

## Debug checklist

## Extensions

## Reflection
```

### Colab companion skeleton

```md
# Notebook title

## Linked lesson

## What you will build or observe

## How to use this notebook

## Setup

## Concept refresher

## Dataset roster

## Basic examples 1-10

For each example:

### Goal

### Dataset

### Preview

### Step-by-step code

### Intermediate output

### Visualization

### Interpretation

### Sanity check

### Try changing this

## Easy examples 1-5

Use the same per-example structure.

## Advanced examples 1-5

Use the same per-example structure.

## Wrap-up table

## Optional challenges
```

---

## Authoring checklist

Before a lesson page is considered complete, confirm:

- The page uses the structure that matches the content type.
- The learner goal is observable: compute, explain, identify, derive, implement, compare, or debug.
- Every symbol is defined before use.
- Every formula includes assumptions and a worked numerical example.
- Every derivation has one operation per step.
- Every algorithm has inputs, outputs, pseudocode, and a hand trace.
- Every model has task, equation, objective, training, inference, evaluation, and limitations.
- Every deep learning page tracks tensor shapes.
- Every statistics page separates parameter, statistic, estimator, and sample.
- Every AI planning or RL page defines state, action, transition, reward/cost, and objective.
- Practice problems match the lesson type and include step-by-step solutions.
- The final connection to ML, deep learning, or AI is concrete, not just a name-drop.
- If a lesson benefits from computation, data, simulation, or visualization, it has a Colab
  companion plan.
- Every Colab notebook has 10 basic, 5 easy, and 5 advanced runnable examples.
- Every Colab example uses a different dataset or clearly different synthetic data-generating
  process.
- Every Colab example includes step-by-step walkthroughs, visible outputs, visualizations,
  interpretation, and a sanity check.
