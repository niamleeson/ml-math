# Sample Lesson Contents by Page Type

This file contains a few draft lesson contents in different styles. These are not the full lesson
library. They are samples to show how different kinds of topics should feel when written out as
actual learner-facing pages.

Use this with:

- `LESSON-PAGE-STRUCTURES.md`
- `plans/core-lesson-plans/README.md`

Core idea: do not force every topic into one template. A definition lesson should feel different
from a formula lesson, an algorithm lesson, a model lesson, and an AI search lesson.

---

## Sample 1 - Concept / definition page

# Random variable and PMF

## What you will be able to do

After this lesson, you can explain what a random variable is, write down its possible values, and
describe its probabilities with a PMF.

## Why this idea exists

Probability starts with outcomes: heads, tails, die rolls, clicks, no-clicks, test scores, wait
times. But machine learning usually needs numbers.

A random variable is the bridge. It turns an uncertain outcome into a number you can compute with.

Example:

- Raw outcome: "the user clicked"
- Number version: `1`
- Raw outcome: "the user did not click"
- Number version: `0`

Now the computer can average, model, and optimize the behavior.

## Tiny example

Roll one fair die.

The raw outcome is one face:

```text
1, 2, 3, 4, 5, or 6
```

Define a random variable:

```text
X = 1 if the die roll is even
X = 0 if the die roll is odd
```

So `X` is not the die itself. `X` is the number we assign after seeing the die.

## Plain-English definition

A **random variable** is a rule that turns each possible outcome into a number.

A **PMF**, or probability mass function, tells you the probability of each value that a discrete
random variable can take.

## Formal definition

Let `Omega` be the sample space.

A random variable is a function:

$$
X: \Omega \to \mathbb{R}
$$

For a discrete random variable, the PMF is:

$$
p_X(x) = P(X = x)
$$

## Every symbol explained

| Symbol | Meaning | Example |
|---|---|---|
| `Omega` | the set of all possible raw outcomes | `{1, 2, 3, 4, 5, 6}` |
| `X` | the random variable, a rule that outputs a number | `X = 1` for even rolls |
| `x` | one possible value of `X` | `0` or `1` |
| `p_X(x)` | probability that `X` equals `x` | `p_X(1) = 1/2` |
| `P(X = x)` | probability of the event where the random variable equals `x` | `P(X = 0)` |

## Worked example

Roll one fair die and define:

```text
X = 1 if the roll is even
X = 0 if the roll is odd
```

Step 1: List the sample space.

```text
Omega = {1, 2, 3, 4, 5, 6}
```

Why: we need every possible raw outcome before assigning numbers.

Step 2: Find the outcomes where `X = 1`.

```text
{2, 4, 6}
```

Why: these are the even rolls.

Step 3: Count them.

```text
3 outcomes
```

Why: probability for a fair die is favorable outcomes divided by total outcomes.

Step 4: Compute the probability.

$$
p_X(1) = P(X = 1) = \frac{3}{6} = \frac{1}{2}
$$

Step 5: Find the outcomes where `X = 0`.

```text
{1, 3, 5}
```

Step 6: Compute the probability.

$$
p_X(0) = P(X = 0) = \frac{3}{6} = \frac{1}{2}
$$

## PMF table

| Value of `X` | Meaning | Probability |
|---:|---|---:|
| `0` | odd roll | `1/2` |
| `1` | even roll | `1/2` |

## Sanity check

The PMF must add up to 1:

$$
p_X(0) + p_X(1) = \frac{1}{2} + \frac{1}{2} = 1
$$

That means we accounted for every possible value of `X`.

## Quick check

Suppose `Y` is the number rolled on the die. What is `p_Y(4)`?

<details>
<summary>Reveal answer</summary>

`Y = 4` happens only when the die lands on 4.

There is 1 favorable outcome out of 6 total outcomes:

$$
p_Y(4) = P(Y = 4) = \frac{1}{6}
$$

</details>

## Where this shows up in ML

A binary label is often a random variable.

For click prediction:

```text
Y = 1 if the user clicks
Y = 0 if the user does not click
```

A model that predicts click probability is trying to estimate:

$$
P(Y = 1 | \text{features})
$$

So random variables are not abstract decoration. They are the language behind labels, predictions,
losses, and uncertainty.

---

## Sample 2 - Formula / theorem page

# Bayes' rule

## The problem this formula solves

Bayes' rule helps you update a belief after seeing evidence.

You start with an initial belief. Then new evidence arrives. Bayes' rule tells you the updated
belief.

Plain English:

```text
updated belief = how compatible the evidence is with the hypothesis x how likely the hypothesis was before
```

## Formula card

Formula:

$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$

Use it when:

- You want `P(A|B)`.
- You know or can estimate `P(B|A)`.
- You know the prior probability `P(A)`.
- You know the total probability of evidence `P(B)`.

Output:

```text
P(A|B) = probability that A is true after observing B
```

## Every symbol explained

| Symbol | Meaning |
|---|---|
| `A` | the hypothesis or event you care about |
| `B` | the evidence you observed |
| `P(A)` | prior probability of `A` before seeing `B` |
| `P(B|A)` | probability of seeing evidence `B` if `A` is true |
| `P(B)` | total probability of seeing evidence `B` |
| `P(A|B)` | updated probability of `A` after seeing `B` |

## Intuition

Bayes' rule asks:

```text
Of all the worlds where the evidence appears, what fraction came from A?
```

The numerator counts the worlds where both things happen:

$$
P(B|A)P(A)
$$

The denominator counts all worlds where the evidence appears:

$$
P(B)
$$

Then the fraction gives the updated probability.

## Worked example

A rare disease affects 1 percent of people. A test is positive 90 percent of the time when someone
has the disease. The test is also positive 5 percent of the time when someone does not have the
disease.

Question: if a person tests positive, what is the probability they have the disease?

Step 1: Define the events.

```text
A = person has the disease
B = test is positive
```

Why: Bayes' rule needs a hypothesis and evidence.

Step 2: Write the known probabilities.

```text
P(A) = 0.01
P(B|A) = 0.90
P(B|not A) = 0.05
P(not A) = 0.99
```

Why: the person either has the disease or does not.

Step 3: Compute the total probability of a positive test.

$$
P(B) = P(B|A)P(A) + P(B|\text{not }A)P(\text{not }A)
$$

Why: a positive test can come from a true positive or a false positive.

Step 4: Substitute the numbers.

$$
P(B) = (0.90)(0.01) + (0.05)(0.99)
$$

Step 5: Multiply each term.

$$
P(B) = 0.009 + 0.0495
$$

Step 6: Add the terms.

$$
P(B) = 0.0585
$$

Step 7: Apply Bayes' rule.

$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$

Step 8: Substitute.

$$
P(A|B) = \frac{(0.90)(0.01)}{0.0585}
$$

Step 9: Compute the numerator.

$$
P(A|B) = \frac{0.009}{0.0585}
$$

Step 10: Divide.

$$
P(A|B) \approx 0.154
$$

## Answer

Even after a positive test, the probability of disease is about 15.4 percent.

## Sanity check

This is less than 90 percent, even though the test is very sensitive.

Why? The disease is rare, so false positives can make up a large share of all positive tests.

## Common mistake

Mistake:

```text
P(A|B) = P(B|A)
```

Why it is tempting: both sentences mention `A` and `B`.

Correct interpretation:

- `P(B|A)` asks: if disease is present, how likely is a positive test?
- `P(A|B)` asks: if the test is positive, how likely is disease?

Those are not the same question.

## ML connection

Naive Bayes classifiers use this same update idea.

For spam detection:

$$
P(\text{spam}|\text{words}) \propto P(\text{words}|\text{spam})P(\text{spam})
$$

The model updates the probability of spam after seeing the words in the email.

---

## Sample 3 - Distribution page

# Bernoulli distribution

## Story generator

Use a Bernoulli random variable when there is exactly one yes/no trial.

Examples:

- Did the user click? yes or no.
- Did the email bounce? yes or no.
- Did the patient recover? yes or no.
- Did the model classify the image correctly? yes or no.

## Support

A Bernoulli random variable can take only two values:

```text
0 or 1
```

We usually read them as:

- `1` means success.
- `0` means failure.

## Parameter

The distribution has one parameter:

```text
p = probability of success
```

So:

```text
P(X = 1) = p
P(X = 0) = 1 - p
```

## PMF

Compact formula:

$$
P(X = x) = p^x(1-p)^{1-x}, \quad x \in \{0, 1\}
$$

## Every symbol explained

| Symbol | Meaning | Example |
|---|---|---|
| `X` | Bernoulli random variable | click or no-click |
| `x` | possible value of `X` | `0` or `1` |
| `p` | probability of success | `0.20` |
| `1 - p` | probability of failure | `0.80` |

## Why the compact formula works

If `x = 1`:

$$
p^x(1-p)^{1-x} = p^1(1-p)^0 = p
$$

If `x = 0`:

$$
p^x(1-p)^{1-x} = p^0(1-p)^1 = 1-p
$$

The formula is just a compact way to handle both cases at once.

## Worked probability

Suppose an ad has a 20 percent click probability.

That means:

```text
p = 0.20
```

Question: what is the probability of no click?

Step 1: Identify the value.

```text
no click means X = 0
```

Step 2: Use the Bernoulli failure probability.

$$
P(X = 0) = 1 - p
$$

Step 3: Substitute.

$$
P(X = 0) = 1 - 0.20
$$

Step 4: Subtract.

$$
P(X = 0) = 0.80
$$

## Mean and variance

For `X ~ Bernoulli(p)`:

$$
E[X] = p
$$

$$
Var(X) = p(1-p)
$$

Plain English:

- The average of many 0/1 trials approaches the success probability.
- Variance is largest near `p = 0.5` and smaller near `p = 0` or `p = 1`.

## Shape intuition

If `p = 0.9`, most values are `1`.

If `p = 0.1`, most values are `0`.

If `p = 0.5`, both values are equally likely.

## ML use case

Binary classification often treats the label as Bernoulli.

For logistic regression:

$$
Y|X=x \sim Bernoulli(p)
$$

where:

$$
p = P(Y = 1|X=x)
$$

The model predicts the Bernoulli parameter.

---

## Sample 4 - Algorithm page

# Gradient descent

## What the algorithm does

Gradient descent is a procedure for making a loss smaller.

It starts with a guess for the parameters. Then it repeatedly moves the parameters in the direction
that most reduces the loss.

Plain English:

```text
Look at the slope.
Move downhill.
Repeat.
```

## Inputs and outputs

Inputs:

- A loss function `J(theta)`.
- An initial parameter value `theta`.
- A learning rate `alpha`.
- A stopping rule.

Output:

- A parameter value with lower loss.

## Core idea

The gradient points uphill. So the negative gradient points downhill.

Update rule:

$$
\theta := \theta - \alpha \nabla J(\theta)
$$

## Every symbol explained

| Symbol | Meaning |
|---|---|
| `theta` | parameter we are changing |
| `J(theta)` | loss or cost at `theta` |
| `nabla J(theta)` | gradient of the loss with respect to `theta` |
| `alpha` | learning rate, or step size |
| `:=` | replace the old value with the new value |

## Pseudocode

```text
choose starting theta
repeat:
    compute gradient at theta
    multiply gradient by learning rate
    subtract that step from theta
    compute the new loss
stop when the loss stops improving enough
```

## Tiny run by hand

Use the loss:

$$
J(\theta) = (\theta - 3)^2
$$

This loss is smallest at `theta = 3`.

The derivative is:

$$
\frac{dJ}{d\theta} = 2(\theta - 3)
$$

Start with:

```text
theta = 0
alpha = 0.1
```

### Step 1

Compute the gradient:

$$
2(0 - 3) = -6
$$

Why: the derivative tells us the slope at the current point.

### Step 2

Compute the update:

$$
\theta := 0 - 0.1(-6)
$$

Why: subtracting a negative slope moves `theta` to the right.

### Step 3

Simplify:

$$
\theta = 0.6
$$

### Step 4

Compute the new loss:

$$
J(0.6) = (0.6 - 3)^2 = 5.76
$$

The starting loss was:

$$
J(0) = (0 - 3)^2 = 9
$$

So the loss went down.

## State tracker table

| Iteration | `theta` | Gradient | Loss |
|---:|---:|---:|---:|
| 0 | 0.000 | -6.000 | 9.000 |
| 1 | 0.600 | -4.800 | 5.760 |
| 2 | 1.080 | -3.840 | 3.686 |
| 3 | 1.464 | -3.072 | 2.359 |

## Why it progresses

When the learning rate is reasonable, each step moves in a direction that locally reduces the loss.

The word "locally" matters. The gradient only tells us what downhill means near the current point.

## Failure modes

| Problem | What it looks like | Fix |
|---|---|---|
| Learning rate too large | loss explodes or jumps around | decrease `alpha` |
| Learning rate too small | loss decreases painfully slowly | increase `alpha` carefully |
| Bad scaling | one feature dominates updates | standardize features |
| Non-convex loss | gets stuck in a poor region | try restarts, better initialization, or better optimizer |

## From math to code

```python
theta = 0.0
alpha = 0.1

for step in range(10):
    gradient = 2 * (theta - 3)
    theta = theta - alpha * gradient
    loss = (theta - 3) ** 2
    print(step, theta, gradient, loss)
```

## Practice

Try one update with:

```text
theta = 5
alpha = 0.2
J(theta) = (theta - 3)^2
```

<details>
<summary>Reveal solution</summary>

Step 1: Compute the gradient.

$$
2(5 - 3) = 4
$$

Step 2: Apply the update.

$$
\theta := 5 - 0.2(4)
$$

Step 3: Multiply.

$$
\theta := 5 - 0.8
$$

Step 4: Subtract.

$$
\theta = 4.2
$$

The parameter moved from 5 toward 3, which is the minimum.

</details>

---

## Sample 5 - Model page

# Logistic regression

## What task this model solves

Logistic regression solves binary classification problems.

Use it when the label has two possible values:

```text
0 or 1
```

Examples:

- spam or not spam
- click or no click
- disease or no disease
- fraud or not fraud

## Tiny dataset

Suppose we want to predict whether a student passes based on study hours.

| Student | Hours studied | Passed |
|---:|---:|---:|
| 1 | 1 | 0 |
| 2 | 2 | 0 |
| 3 | 3 | 1 |
| 4 | 4 | 1 |

## Model assumption

Logistic regression assumes that a linear score can be converted into a probability.

First compute a score:

$$
z = wx + b
$$

Then squash that score into a probability:

$$
\hat{y} = \sigma(z) = \frac{1}{1 + e^{-z}}
$$

## Every symbol explained

| Symbol | Meaning |
|---|---|
| `x` | input feature, such as hours studied |
| `w` | learned weight |
| `b` | learned intercept |
| `z` | raw linear score |
| `sigma` | sigmoid function |
| `hat y` | predicted probability of class 1 |
| `y` | true label, either 0 or 1 |

## Worked prediction

Suppose:

```text
w = 1.2
b = -3
x = 4
```

Question: what is the predicted probability of passing?

Step 1: Compute the linear score.

$$
z = wx + b
$$

Step 2: Substitute.

$$
z = (1.2)(4) - 3
$$

Step 3: Multiply.

$$
z = 4.8 - 3
$$

Step 4: Subtract.

$$
z = 1.8
$$

Step 5: Apply sigmoid.

$$
\hat{y} = \frac{1}{1 + e^{-1.8}}
$$

Step 6: Approximate.

$$
\hat{y} \approx 0.858
$$

## Interpretation

The model predicts about an 85.8 percent chance of passing for a student who studied 4 hours.

If we use a threshold of 0.5, the predicted class is:

```text
1 = pass
```

## Loss or objective

Logistic regression is usually trained with binary cross-entropy:

$$
L(y, \hat{y}) = -y\log(\hat{y}) - (1-y)\log(1-\hat{y})
$$

This loss rewards high probability on the correct class and punishes confident wrong predictions.

## Evaluation

Do not judge logistic regression only by accuracy.

Also inspect:

- confusion matrix
- precision
- recall
- ROC curve
- AUC
- calibration

## Strengths and limitations

Strengths:

- simple
- fast
- interpretable
- gives probabilities
- strong baseline

Limitations:

- linear decision boundary unless features are transformed
- sensitive to feature scaling and outliers
- needs careful threshold choice for imbalanced data

## Mini-lab idea

In Colab, use 20 examples:

- 10 basic synthetic datasets showing sigmoid scores, thresholds, and loss
- 5 easy datasets such as Iris binary, breast cancer, wine, digits subset, and Titanic-style data
- 5 advanced datasets showing imbalance, noisy labels, regularization, calibration, and threshold tuning

Each example should print the dataframe head, shapes, coefficients, predicted probabilities, and a
visual such as a decision boundary, ROC curve, or calibration curve.

---

## Sample 6 - Deep learning component page

# Dropout

## Network problem

Large neural networks can memorize training data.

Dropout is a regularization technique that makes memorization harder by randomly turning off some
neurons during training.

## Component intuition

Imagine a team where the same person always answers every question. The rest of the team gets lazy.

Dropout randomly removes some team members during practice. Now the network cannot rely on one
specific neuron all the time. Many neurons must learn useful signals.

## Forward-pass rule

During training:

$$
\tilde{a} = m \odot a
$$

where `m` is a random mask of zeros and ones.

With inverted dropout, we usually scale by the keep probability:

$$
\tilde{a} = \frac{m \odot a}{p_{keep}}
$$

During inference, dropout is turned off.

## Every symbol explained

| Symbol | Meaning |
|---|---|
| `a` | activation vector before dropout |
| `m` | random mask, same shape as `a` |
| `odot` | elementwise multiplication |
| `p_keep` | probability of keeping a unit active |
| `tilde a` | activation after dropout |

## Tiny tensor example

Suppose:

```text
a = [2, 4, 6, 8]
m = [1, 0, 1, 0]
p_keep = 0.5
```

Step 1: Multiply element by element.

```text
m odot a = [2, 0, 6, 0]
```

Why: the second and fourth activations were dropped.

Step 2: Divide by the keep probability.

```text
[2, 0, 6, 0] / 0.5 = [4, 0, 12, 0]
```

Why: scaling keeps the expected activation size similar during training.

## Training behavior

Dropout adds noise during training.

That noise can reduce overfitting because the network must learn redundant, robust features.

## Implementation notes

- Use dropout only during training.
- Turn it off during inference.
- Put dropout after activations in many feed-forward networks.
- Be careful with batch normalization; the order can matter.
- Very high dropout can cause underfitting.

## Failure modes

| Failure mode | Symptom | Fix |
|---|---|---|
| Dropout too high | training and validation both bad | lower dropout |
| Dropout used at inference | predictions are noisy | switch model to evaluation mode |
| No regularization needed | slower learning with no gain | remove or reduce dropout |

## Visual notebook idea

Show the same small network trained:

1. without dropout
2. with moderate dropout
3. with too much dropout

Plot:

- training loss
- validation loss
- train-validation gap
- decision boundary

The learner should see that dropout is not magic. It is a tool for controlling overfitting.

---

## Sample 7 - AI decision-process page

# A* search

## World setup

A* search finds a low-cost path through a graph.

It uses two pieces of information:

- how much cost we already paid
- a heuristic guess of how far remains

## Goal

Find a path from a start state to a goal state with minimum total cost.

## Rule

A* chooses the next node with the smallest:

$$
f(n) = g(n) + h(n)
$$

## Every symbol explained

| Symbol | Meaning |
|---|---|
| `n` | current node |
| `g(n)` | cost from the start to node `n` |
| `h(n)` | heuristic estimate from node `n` to the goal |
| `f(n)` | estimated total path cost through node `n` |

## Tiny graph

We want to go from `S` to `G`.

```text
S -> A costs 1
S -> B costs 4
A -> G costs 5
B -> G costs 1
```

Heuristic estimates:

```text
h(S) = 4
h(A) = 4
h(B) = 1
h(G) = 0
```

## Trace

Start at `S`.

### Step 1

Expand `S`.

Neighbors:

| Node | `g(n)` | `h(n)` | `f(n)` |
|---|---:|---:|---:|
| A | 1 | 4 | 5 |
| B | 4 | 1 | 5 |

Why: `A` costs 1 so far, and its heuristic is 4. `B` costs 4 so far, and its heuristic is 1.

### Step 2

Choose either `A` or `B` because both have `f = 5`.

Suppose we choose `B`.

### Step 3

Expand `B`.

Path to `G` through `B`:

```text
S -> B -> G
```

Cost:

```text
4 + 1 = 5
```

### Step 4

Compare with path through `A`.

```text
S -> A -> G
```

Cost:

```text
1 + 5 = 6
```

So the path through `B` is better.

## Why the rule works

`g(n)` keeps us honest about cost already paid.

`h(n)` points us toward promising future paths.

If the heuristic never overestimates the true remaining cost, A* is guaranteed to find an optimal
path.

## Failure mode

If `h(n)` overestimates too much, A* can become overconfident and skip the best path.

## Practice

Given:

| Node | `g(n)` | `h(n)` |
|---|---:|---:|
| C | 6 | 2 |
| D | 3 | 7 |
| E | 5 | 1 |

Which node should A* expand next?

<details>
<summary>Reveal answer</summary>

Compute `f(n) = g(n) + h(n)`.

For `C`:

```text
f(C) = 6 + 2 = 8
```

For `D`:

```text
f(D) = 3 + 7 = 10
```

For `E`:

```text
f(E) = 5 + 1 = 6
```

A* expands `E` next because it has the smallest estimated total cost.

</details>

---

## What these samples show

| Sample | Page type | Main teaching move |
|---|---|---|
| Random variable and PMF | Concept / definition | Build a new mental object from a tiny example |
| Bayes' rule | Formula / theorem | Explain the problem, formula, symbols, and mistaken reversal |
| Bernoulli distribution | Distribution | Start from a story, then support, parameter, PMF, and use case |
| Gradient descent | Algorithm | Trace iterations with a state table and failure modes |
| Logistic regression | Model | Combine task, equation, prediction, loss, evaluation, and limits |
| Dropout | Deep learning component | Explain component behavior through a tiny tensor example |
| A* search | AI decision-process | Trace states and explain the guarantee condition |

