# Probability: Models, Axioms, Conditioning & Counting
> **Source:** Probability (MIT) · **Category:** Formula/Concept · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 This section is written as a runnable notebook; an `.ipynb` will be generated from it. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up the core idea one tiny step at a time. Each step **prints** the numbers it
> computes and **draws a picture** so you can *see* what is happening. Run the cells in order
> from top to bottom. Nothing here needs the internet or any downloaded data.

### The Big Picture — What You'll Learn

- A **sample space** is just the list of all equally likely outcomes; a **probability** is a count divided by that total.
- **Conditional probability** `P(A|B)` re-scopes to the world where B happened.
- **Bayes' rule** flips a conditional you know into the one you want.

### Step 0 — Set up our tools

We import NumPy (arrays + math) and Matplotlib (pictures), fix a **seed** for reproducibility,
and define a tiny `log()` helper so every printed line is clearly labeled.

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)
plt.rcParams["figure.figsize"] = (6, 4)

def log(label, value):
    print(f"[{label}] {value}")

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Sample space of two dice, and the probability of an event

Roll two fair dice. The **sample space** is all 36 equally likely `(die1, die2)` pairs. The probability of an event is just *how many outcomes are in it* ÷ 36.

```python
import itertools
outcomes = list(itertools.product(range(1, 7), range(1, 7)))   # all 36 equally likely pairs
log("sample space size", len(outcomes))
A = [o for o in outcomes if sum(o) == 7]                       # event A: the dice sum to 7
P_A = len(A) / 36
log("outcomes in A (sum = 7)", A)
log("P(A) = |A| / 36", f"{len(A)}/36 = {round(P_A, 4)}")
assert P_A == 6 / 36

sums = [sum(o) for o in outcomes]
plt.hist(sums, bins=range(2, 14), align="left", rwidth=0.8)
plt.title("distribution of the dice sum"); plt.xlabel("sum"); plt.ylabel("count / 36"); plt.show()
```
▶ What you'll see: 6 winning outcomes → P(sum=7) = 6/36, and a triangular histogram peaking at 7.

### Step 2 — Conditional probability and Bayes' rule

`P(A|B)` asks: *given B happened, how likely is A?* It re-scopes counting to the outcomes inside B. Bayes' rule then flips `P(A|B)` into `P(B|A)`.

```python
B = [o for o in outcomes if o[0] == 1]                          # event B: the first die is 1
AB = [o for o in outcomes if o in A and o in B]                # A and B both happen
P_B = len(B) / 36; P_AB = len(AB) / 36
log("P(B) = first die is 1", f"{len(B)}/36 = {round(P_B,4)}")
log("P(A and B)", f"{len(AB)}/36 = {round(P_AB,4)}")
P_A_given_B = P_AB / P_B                                        # re-scope to the 6 outcomes where B holds
log("P(A|B) = P(A and B) / P(B)", round(P_A_given_B, 4))
P_B_given_A = P_AB / P_A                                        # Bayes flip
log("P(B|A) = P(A and B) / P(A)", round(P_B_given_A, 4))
assert abs(P_A_given_B - 1/6) < 1e-9
```
▶ What you'll see: P(A|B)=1/6 (of the 6 rolls with a leading 1, exactly one sums to 7) and the Bayes flip.

## 1. Overview

Probability begins by choosing a sample space, assigning probabilities that obey the axioms, and then computing event probabilities by conditioning, Bayes' rule, independence, and counting. The same real situation can look easy or impossible depending on whether the sample space has the right granularity. In this lesson, every computation is done by hand so that each final probability can be traced back to a model, an event, and a rule.

## 2. Key Idea

### Probability models and events

- **Sample space**

A sample space $\Omega$ is the set of all possible outcomes. Read it as the universe of mutually exclusive, collectively exhaustive outcomes at the level of detail needed for the problem.

- **Event**

An event is a subset of the sample space. Read $A\subseteq\Omega$ as the collection of outcomes for which the statement "$A$ occurred" is true.

- **Probability law**

A probability law $\mathbb{P}$ assigns probabilities to events. Read $\mathbb{P}(A)$ as the numerical weight assigned to event $A$.

### Axioms and consequences

- **Nonnegativity**

$$
\mathbb{P}(A) \geq 0
$$

Read it as: probabilities cannot be negative.

- **Normalization**

$$
\mathbb{P}(\Omega)=1.
$$

Read it as: the probability that some outcome in the sample space occurs is $1$.

- **Countable additivity**

For every sequence of events $A_1,A_2,\ldots$ such that $A_i \cap A_j = \varnothing$ for $i \neq j$,

$$
\mathbb{P}\left(\bigcup_i A_i\right)=\sum_i \mathbb{P}(A_i).
$$

Read it as: for disjoint alternatives, add their probabilities.

- **Empty event**

$$
\mathbb{P}(\varnothing)=0.
$$

Read it as: an impossible event has probability $0$.

- **Finite additivity for disjoint events**

For any finite collection of disjoint events $A_1,\ldots,A_n$,

$$
\mathbb{P}\left(\bigcup_{i=1}^{n} A_i\right)=\sum_{i=1}^{n}\mathbb{P}(A_i).
$$

Read it as: the finite version of additivity for non-overlapping events.

- **Complement rule**

$$
\mathbb{P}(A)+\mathbb{P}(A^c)=1.
$$

Read it as: either $A$ happens or $A$ does not happen.

- **Upper bound**

$$
\mathbb{P}(A) \leq 1.
$$

Read it as: no event can be more likely than the entire sample space.

- **Monotonicity**

If $A \subset B$, then

$$
\mathbb{P}(A) \leq \mathbb{P}(B).
$$

Read it as: a smaller event cannot have larger probability than an event that contains it.

- **Union rule / inclusion--exclusion for two events**

$$
\mathbb{P}(A \cup B)=\mathbb{P}(A)+\mathbb{P}(B)-\mathbb{P}(A \cap B).
$$

Read it as: add the two events, then subtract the overlap because it was counted twice.

- **Union bound for two events**

$$
\mathbb{P}(A \cup B) \leq \mathbb{P}(A)+\mathbb{P}(B).
$$

Read it as: ignoring overlap can only overcount the union.

- **Discrete uniform law**

Assume $\Omega$ is finite and consists of $n$ equally likely elements. Also, assume that $A \subset \Omega$ with $k$ elements. Then

$$
\mathbb{P}(A)=\frac{k}{n}.
$$

Read it as: under equal likelihood, probability equals favorable outcomes divided by total outcomes.

### Conditioning and Bayes' rule

- **Conditional probability**

Given that event $B$ has occurred and that $\mathbb{P}(B)>0$, the probability that $A$ occurs is

$$
\mathbb{P}(A\mid B) \triangleq \frac{\mathbb{P}(A \cap B)}{\mathbb{P}(B)}.
$$

Read it as: restrict attention to the world where $B$ occurred, then measure the fraction of that world where $A$ also occurred.

- **Conditional nonnegativity**

$$
\mathbb{P}(A\mid B) \geq 0.
$$

Read it as: once $B$ is fixed, conditional probabilities are still probabilities.

- **Conditional normalization**

$$
\mathbb{P}(\Omega\mid B)=1.
$$

Read it as: within the conditioned world $B$, some outcome in $\Omega$ still occurs with certainty.

- **Conditioning on itself**

$$
\mathbb{P}(B\mid B)=1.
$$

Read it as: if $B$ is known to have occurred, then $B$ is certain.

- **Conditional additivity**

If $A \cap C = \varnothing$, then

$$
\mathbb{P}(A \cup C\mid B)=\mathbb{P}(A\mid B)+\mathbb{P}(C\mid B).
$$

Read it as: conditional probability obeys the same additivity rule inside the condition $B$.

- **Multiplication rule**

$$
\mathbb{P}(A_1 \cap A_2 \cap \cdots \cap A_n)=\mathbb{P}(A_1)\mathbb{P}(A_2\mid A_1)\cdots\mathbb{P}(A_n\mid A_1 \cap A_2 \cap \cdots \cap A_{n-1}).
$$

Read it as: probability of a sequence equals the probability of the first event times each next conditional probability given the previous events.

- **Total probability theorem**

Given a partition $\{A_1,A_2,\ldots\}$ of the sample space, meaning that $\bigcup_i A_i = \Omega$ and the events are disjoint, and for every event $B$, we have

$$
\mathbb{P}(B)=\sum_i \mathbb{P}(A_i)\mathbb{P}(B\mid A_i).
$$

Read it as: compute the probability of $B$ by splitting the sample space into cases and averaging the within-case probabilities.

- **Bayes' rule**

Given a partition $\{A_1,A_2,\ldots\}$ of the sample space, meaning that $\bigcup_i A_i = \Omega$ and the events are disjoint, and if $\mathbb{P}(A_i)>0$ for all $i$, then for every event $B$,

$$
\mathbb{P}(A_i\mid B)=\frac{\mathbb{P}(A_i)\mathbb{P}(B\mid A_i)}{\sum_j \mathbb{P}(A_j)\mathbb{P}(B\mid A_j)}.
$$

Read it as: posterior probability equals the prior case probability times the likelihood of the evidence, normalized by the total probability of the evidence.

### Independence

- **Independence of two events**

Two events are independent if occurrence of one provides no information about the other. We say that $A$ and $B$ are independent if

$$
\mathbb{P}(A \cap B)=\mathbb{P}(A)\mathbb{P}(B).
$$

Read it as: the overlap has exactly the size it would have if the events did not influence each other.

- **Equivalent conditional form**

Equivalently, as long as $\mathbb{P}(A)>0$ and $\mathbb{P}(B)>0$,

$$
\mathbb{P}(B\mid A)=\mathbb{P}(B) \qquad \mathbb{P}(A\mid B)=\mathbb{P}(A).
$$

Read it as: learning one independent event happened does not change the probability of the other.

- **Independence of complements**

If $A$ and $B$ are independent, then $A$ and $B^c$ are independent. Similarly for $A^c$ and $B$, or for $A^c$ and $B^c$. Read it as: independence also applies to whether each event fails to occur.

- **Conditional independence**

We say that $A$ and $B$ are independent conditioned on $C$, where $\mathbb{P}(C)>0$, if

$$
\mathbb{P}(A \cap B\mid C)=\mathbb{P}(A\mid C)\mathbb{P}(B\mid C).
$$

Read it as: after restricting to the world where $C$ occurred, $A$ and $B$ have product-form overlap inside that restricted world.

- **Independence of a collection of events**

We say that events $A_1,A_2,\ldots,A_n$ are independent if for every collection of distinct indices $i_1,i_2,\ldots,i_k$,

$$
\mathbb{P}(A_{i_1}\cap \cdots \cap A_{i_k})=\mathbb{P}(A_{i_1})\cdot \mathbb{P}(A_{i_2})\cdots\mathbb{P}(A_{i_k}).
$$

Read it as: every subcollection, not just every pair, must satisfy the product rule.

### Counting

- **Basic counting principle**

For a selection that can be done in $r$ stages, with $n_i$ choices at each stage $i$, the number of possible selections is

$$
n_1\cdot n_2\cdots n_r.
$$

Read it as: multiply the number of choices across sequential stages.

- **Permutations**

The number of permutations, or orderings, of $n$ different elements is

$$
n! = 1\cdot 2\cdot 3\cdots n.
$$

Read it as: there are $n$ choices for the first position, then $n-1$, and so on down to $1$.

- **Combinations**

Given a set of $n$ elements, the number of subsets with exactly $k$ elements is

$$
\binom{n}{k}=\frac{n!}{k!(n-k)!}.
$$

Read it as: count unordered groups of size $k$ by dividing ordered selections by the internal orderings that do not matter.

- **Partitions**

We are given an $n$-element set and nonnegative integers $n_1,n_2,\ldots,n_r$, whose sum is equal to $n$. The number of partitions of the set into $r$ disjoint subsets, with the $i$th subset containing exactly $n_i$ elements, is equal to

$$
\binom{n}{n_1,\ldots,n_r}=\frac{n!}{n_1!n_2!\cdots n_r!}.
$$

Read it as: assign $n$ distinct elements into labeled groups of prescribed sizes, ignoring order within each group.

## 3. Worked Examples

### 🟡 Easy

#### E1. Build a valid finite probability model

**Problem.** Let $\Omega=\{1,2,3,4\}$ with proposed probability masses

$$
\mathbb{P}(\{1\})=0.1,\quad \mathbb{P}(\{2\})=0.2,\quad \mathbb{P}(\{3\})=0.3,\quad \mathbb{P}(\{4\})=0.4.
$$

For $A=\{2,4\}$, check that this is a valid finite probability model, then compute $\mathbb{P}(A)$ and $\mathbb{P}(A^c)$.

**Solution.**

Check nonnegativity for each singleton mass.

$$
0.1\ge 0,\qquad 0.2\ge 0,\qquad 0.3\ge 0,\qquad 0.4\ge 0.
$$

All elementary probabilities are nonnegative, so the nonnegativity axiom is satisfied for the listed outcomes.

Check normalization by adding all singleton probabilities.

$$
\mathbb{P}(\Omega)
=\mathbb{P}(\{1\})+\mathbb{P}(\{2\})+\mathbb{P}(\{3\})+\mathbb{P}(\{4\}).
$$

Substitute the given masses.

$$
\mathbb{P}(\Omega)=0.1+0.2+0.3+0.4.
$$

Add step by step.

$$
0.1+0.2=0.3,
$$

$$
0.3+0.3=0.6,
$$

$$
0.6+0.4=1.0.
$$

Thus

$$
\mathbb{P}(\Omega)=1.
$$

The singleton events $\{1\},\{2\},\{3\},\{4\}$ are disjoint, so probabilities of finite events are computed by additivity.

For $A=\{2,4\}$,

$$
\mathbb{P}(A)=\mathbb{P}(\{2\}\cup\{4\}).
$$

Because $\{2\}\cap\{4\}=\varnothing$,

$$
\mathbb{P}(A)=\mathbb{P}(\{2\})+\mathbb{P}(\{4\}).
$$

Substitute the masses.

$$
\mathbb{P}(A)=0.2+0.4=0.6.
$$

Find the complement of $A$ inside $\Omega$.

$$
A^c=\Omega\setminus A=\{1,2,3,4\}\setminus\{2,4\}=\{1,3\}.
$$

Compute it directly by additivity.

$$
\mathbb{P}(A^c)=\mathbb{P}(\{1\})+\mathbb{P}(\{3\})=0.1+0.3=0.4.
$$

Check with the complement rule.

$$
\mathbb{P}(A)+\mathbb{P}(A^c)=0.6+0.4=1.
$$

Therefore the model is valid, and

$$
\boxed{\mathbb{P}(A)=0.6\quad\text{and}\quad \mathbb{P}(A^c)=0.4.}
$$

#### E2. Two-dice event by uniform counting

**Problem.** Roll two fair dice. Let $A$ be the event "the sum is $7$" and let $B$ be the event "the first die is $4$." Choose an appropriate sample space and compute $\mathbb{P}(A)$, $\mathbb{P}(B)$, and $\mathbb{P}(A\cap B)$.

**Solution.**

Use ordered pairs because the first die and second die are distinguishable.

$$
\Omega=\{(i,j): i\in\{1,2,3,4,5,6\},\ j\in\{1,2,3,4,5,6\}\}.
$$

Count the sample space by the basic counting principle.

$$
|\Omega|=6\cdot 6=36.
$$

Because the dice are fair, all $36$ ordered pairs are equally likely.

List the outcomes in $A$, where the sum is $7$.

$$
A=\{(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)\}.
$$

Count them.

$$
|A|=6.
$$

Use the discrete uniform law.

$$
\mathbb{P}(A)=\frac{|A|}{|\Omega|}=\frac{6}{36}=\frac{1}{6}.
$$

List the outcomes in $B$, where the first die is $4$.

$$
B=\{(4,1),(4,2),(4,3),(4,4),(4,5),(4,6)\}.
$$

Count them.

$$
|B|=6.
$$

Use the discrete uniform law again.

$$
\mathbb{P}(B)=\frac{|B|}{|\Omega|}=\frac{6}{36}=\frac{1}{6}.
$$

Find the intersection $A\cap B$ by requiring both statements to hold.

If the first die is $4$ and the sum is $7$, then the second die must be

$$
7-4=3.
$$

Thus

$$
A\cap B=\{(4,3)\}.
$$

Count the intersection.

$$
|A\cap B|=1.
$$

Compute its probability.

$$
\mathbb{P}(A\cap B)=\frac{|A\cap B|}{|\Omega|}=\frac{1}{36}.
$$

Therefore

$$
\boxed{\mathbb{P}(A)=\frac{1}{6},\quad \mathbb{P}(B)=\frac{1}{6},\quad \mathbb{P}(A\cap B)=\frac{1}{36}.}
$$

#### E3. Inclusion--exclusion for overlapping events

**Problem.** Suppose $\mathbb{P}(A)=0.55$, $\mathbb{P}(B)=0.40$, and $\mathbb{P}(A\cap B)=0.20$. Compute $\mathbb{P}(A\cup B)$ and $\mathbb{P}(A^c\cap B)$.

**Solution.**

Use the union rule to avoid double-counting the overlap.

$$
\mathbb{P}(A \cup B)=\mathbb{P}(A)+\mathbb{P}(B)-\mathbb{P}(A \cap B).
$$

Substitute the given probabilities.

$$
\mathbb{P}(A \cup B)=0.55+0.40-0.20.
$$

Add first.

$$
0.55+0.40=0.95.
$$

Subtract the overlap.

$$
0.95-0.20=0.75.
$$

Thus

$$
\mathbb{P}(A\cup B)=0.75.
$$

Now compute $\mathbb{P}(A^c\cap B)$. This is the part of $B$ that is not in $A$.

Split $B$ into two disjoint pieces:

$$
B=(A\cap B)\cup(A^c\cap B).
$$

The two pieces are disjoint because an outcome cannot be both in $A$ and in $A^c$.

By finite additivity,

$$
\mathbb{P}(B)=\mathbb{P}(A\cap B)+\mathbb{P}(A^c\cap B).
$$

Solve for the unknown piece.

$$
\mathbb{P}(A^c\cap B)=\mathbb{P}(B)-\mathbb{P}(A\cap B).
$$

Substitute the values.

$$
\mathbb{P}(A^c\cap B)=0.40-0.20=0.20.
$$

Therefore

$$
\boxed{\mathbb{P}(A\cup B)=0.75\quad\text{and}\quad \mathbb{P}(A^c\cap B)=0.20.}
$$

#### E4. Conditional probability from a card deck

**Problem.** Draw one card uniformly from a standard $52$-card deck. Let $A$ be the event "the card is an ace" and let $B$ be the event "the card is a spade." Compute $\mathbb{P}(A\mid B)$ and $\mathbb{P}(B\mid A)$, and explain why the denominator changes.

**Solution.**

The sample space is the set of $52$ cards, all equally likely.

There are $4$ aces, so

$$
|A|=4.
$$

There are $13$ spades, so

$$
|B|=13.
$$

There is exactly one card that is both an ace and a spade: the ace of spades. Therefore

$$
|A\cap B|=1.
$$

Convert counts to probabilities under the uniform law.

$$
\mathbb{P}(A)=\frac{4}{52},\qquad \mathbb{P}(B)=\frac{13}{52},\qquad \mathbb{P}(A\cap B)=\frac{1}{52}.
$$

Compute $\mathbb{P}(A\mid B)$ from the definition of conditional probability.

$$
\mathbb{P}(A\mid B)=\frac{\mathbb{P}(A\cap B)}{\mathbb{P}(B)}.
$$

Substitute the probabilities.

$$
\mathbb{P}(A\mid B)=\frac{\frac{1}{52}}{\frac{13}{52}}.
$$

Divide by a fraction by multiplying by its reciprocal.

$$
\mathbb{P}(A\mid B)=\frac{1}{52}\cdot\frac{52}{13}=\frac{1}{13}.
$$

Interpretation: after conditioning on spade, the denominator is the $13$ spades, and only $1$ of them is an ace.

Now compute $\mathbb{P}(B\mid A)$.

$$
\mathbb{P}(B\mid A)=\frac{\mathbb{P}(A\cap B)}{\mathbb{P}(A)}.
$$

Substitute the probabilities.

$$
\mathbb{P}(B\mid A)=\frac{\frac{1}{52}}{\frac{4}{52}}.
$$

Simplify.

$$
\mathbb{P}(B\mid A)=\frac{1}{52}\cdot\frac{52}{4}=\frac{1}{4}.
$$

Interpretation: after conditioning on ace, the denominator is the $4$ aces, and only $1$ of them is a spade.

Thus conditioning changes the denominator from the whole sample space to the event known to have occurred.

$$
\boxed{\mathbb{P}(A\mid B)=\frac{1}{13}\quad\text{and}\quad \mathbb{P}(B\mid A)=\frac{1}{4}.}
$$

#### E5. Basic combinations without replacement

**Problem.** Draw a $5$-card hand uniformly from a standard $52$-card deck. Compute the probability that the hand contains exactly $2$ hearts.

**Solution.**

A $5$-card hand is an unordered subset of $5$ cards from $52$ cards.

Count all possible hands using combinations.

$$
|\Omega|=\binom{52}{5}.
$$

Use the formula

$$
\binom{n}{k}=\frac{n!}{k!(n-k)!}.
$$

Thus

$$
\binom{52}{5}=\frac{52!}{5!47!}.
$$

Cancel $47!$ from the numerator.

$$
\binom{52}{5}=\frac{52\cdot 51\cdot 50\cdot 49\cdot 48}{5\cdot4\cdot3\cdot2\cdot1}.
$$

Compute the denominator.

$$
5\cdot4\cdot3\cdot2\cdot1=120.
$$

Compute the numerator step by step.

$$
52\cdot 51=2652,
$$

$$
2652\cdot 50=132600,
$$

$$
132600\cdot 49=6497400,
$$

$$
6497400\cdot 48=311875200.
$$

Therefore

$$
\binom{52}{5}=\frac{311875200}{120}=2598960.
$$

Now count favorable hands with exactly $2$ hearts.

Choose $2$ hearts from the $13$ hearts:

$$
\binom{13}{2}=\frac{13!}{2!11!}=\frac{13\cdot12}{2\cdot1}=78.
$$

Choose the remaining $3$ cards from the $39$ non-hearts:

$$
\binom{39}{3}=\frac{39!}{3!36!}=\frac{39\cdot38\cdot37}{3\cdot2\cdot1}.
$$

Compute it.

$$
39\cdot38=1482,
$$

$$
1482\cdot37=54834,
$$

$$
3\cdot2\cdot1=6,
$$

$$
\binom{39}{3}=\frac{54834}{6}=9139.
$$

By the basic counting principle, favorable hands are

$$
\binom{13}{2}\binom{39}{3}=78\cdot9139.
$$

Compute the product.

$$
9139\cdot78=9139\cdot(80-2)=731120-18278=712842.
$$

Therefore the probability is

$$
\mathbb{P}(\text{exactly }2\text{ hearts})=\frac{\binom{13}{2}\binom{39}{3}}{\binom{52}{5}}
=\frac{712842}{2598960}.
$$

Reduce the fraction by dividing numerator and denominator by $6$.

$$
\frac{712842}{2598960}=\frac{118807}{433160}.
$$

As a decimal,

$$
\frac{118807}{433160}\approx 0.2743.
$$

Therefore

$$
\boxed{\mathbb{P}(\text{exactly }2\text{ hearts})=\frac{\binom{13}{2}\binom{39}{3}}{\binom{52}{5}}=\frac{118807}{433160}\approx0.2743.}
$$

### 🔴 Advanced

#### A1. Bayes' rule with rare positives

**Problem.** A disease has prevalence $0.01$. A test has sensitivity $0.95$, meaning $\mathbb{P}(+\mid D)=0.95$, and false-positive rate $0.04$, meaning $\mathbb{P}(+\mid D^c)=0.04$. Compute $\mathbb{P}(D\mid +)$.

**Solution.**

Let $D$ be the event that a person has the disease and $D^c$ be the event that a person does not have the disease.

The prevalence gives

$$
\mathbb{P}(D)=0.01.
$$

Use the complement rule to find the probability of no disease.

$$
\mathbb{P}(D^c)=1-\mathbb{P}(D)=1-0.01=0.99.
$$

The test information gives

$$
\mathbb{P}(+\mid D)=0.95,
$$

and

$$
\mathbb{P}(+\mid D^c)=0.04.
$$

The events $D$ and $D^c$ form a partition of the sample space because they are disjoint and exhaustive.

Use the total probability theorem to compute $\mathbb{P}(+)$.

$$
\mathbb{P}(+)=\mathbb{P}(D)\mathbb{P}(+\mid D)+\mathbb{P}(D^c)\mathbb{P}(+\mid D^c).
$$

Substitute all values.

$$
\mathbb{P}(+)=0.01\cdot0.95+0.99\cdot0.04.
$$

Compute the true-positive contribution.

$$
0.01\cdot0.95=0.0095.
$$

Compute the false-positive contribution.

$$
0.99\cdot0.04=0.0396.
$$

Add the two contributions.

$$
\mathbb{P}(+)=0.0095+0.0396=0.0491.
$$

Now apply Bayes' rule.

$$
\mathbb{P}(D\mid +)=\frac{\mathbb{P}(D)\mathbb{P}(+\mid D)}{\mathbb{P}(+)}.
$$

Substitute the numerator and denominator.

$$
\mathbb{P}(D\mid +)=\frac{0.01\cdot0.95}{0.0491}.
$$

Compute the numerator.

$$
0.01\cdot0.95=0.0095.
$$

Therefore

$$
\mathbb{P}(D\mid +)=\frac{0.0095}{0.0491}.
$$

Convert to a fraction by multiplying numerator and denominator by $10000$.

$$
\frac{0.0095}{0.0491}=\frac{95}{491}.
$$

Compute the decimal approximation.

$$
\frac{95}{491}\approx 0.1935.
$$

Even with a sensitive test, the posterior is only about $19.35\%$ because the disease is rare and false positives accumulate among the large nondiseased population.

$$
\boxed{\mathbb{P}(D\mid +)=\frac{95}{491}\approx0.1935.}
$$

#### A2. Sequential conditioning with the multiplication rule

**Problem.** An urn contains $5$ red balls, $3$ blue balls, and $2$ green balls. Three balls are drawn without replacement. Compute the probability of the ordered sequence red $\to$ red $\to$ blue.

**Solution.**

Let $R_1$ be the event that the first draw is red, $R_2$ the event that the second draw is red, and $B_3$ the event that the third draw is blue.

Initially the urn has

$$
5+3+2=10
$$

balls.

Use the multiplication rule.

$$
\mathbb{P}(R_1\cap R_2\cap B_3)=\mathbb{P}(R_1)\mathbb{P}(R_2\mid R_1)\mathbb{P}(B_3\mid R_1\cap R_2).
$$

Compute the first factor. There are $5$ red balls among $10$ total balls.

$$
\mathbb{P}(R_1)=\frac{5}{10}.
$$

After one red ball has been drawn, the urn has $4$ red balls left and $9$ total balls left.

Therefore

$$
\mathbb{P}(R_2\mid R_1)=\frac{4}{9}.
$$

After two red balls have been drawn, the urn has $3$ blue balls left and $8$ total balls left.

Therefore

$$
\mathbb{P}(B_3\mid R_1\cap R_2)=\frac{3}{8}.
$$

Substitute into the multiplication rule.

$$
\mathbb{P}(R_1\cap R_2\cap B_3)=\frac{5}{10}\cdot\frac{4}{9}\cdot\frac{3}{8}.
$$

Simplify the first fraction.

$$
\frac{5}{10}=\frac{1}{2}.
$$

Then

$$
\mathbb{P}(R_1\cap R_2\cap B_3)=\frac{1}{2}\cdot\frac{4}{9}\cdot\frac{3}{8}.
$$

Multiply numerators and denominators.

$$
\frac{1\cdot4\cdot3}{2\cdot9\cdot8}=\frac{12}{144}.
$$

Reduce the fraction.

$$
\frac{12}{144}=\frac{1}{12}.
$$

Thus the probability of this ordered sequence is

$$
\boxed{\mathbb{P}(R_1\cap R_2\cap B_3)=\frac{1}{12}\approx0.0833.}
$$

#### A3. Independence vs conditional independence

**Problem.** Toss two independent fair coins. Let $A$ be the event "the first coin is heads," let $B$ be the event "the second coin is heads," and let $C$ be the event "exactly one coin is heads." Show that $A$ and $B$ are independent unconditionally but not independent conditioned on $C$.

**Solution.**

Use the ordered sample space

$$
\Omega=\{HH,HT,TH,TT\}.
$$

Because the coins are fair and independent, each outcome has probability

$$
\frac{1}{4}.
$$

Write the events explicitly.

$$
A=\{HH,HT\},
$$

because the first coin is heads in $HH$ and $HT$.

$$
B=\{HH,TH\},
$$

because the second coin is heads in $HH$ and $TH$.

$$
C=\{HT,TH\},
$$

because exactly one coin is heads in $HT$ and $TH$.

Compute the unconditional probabilities.

$$
\mathbb{P}(A)=\frac{|A|}{|\Omega|}=\frac{2}{4}=\frac{1}{2},
$$

$$
\mathbb{P}(B)=\frac{|B|}{|\Omega|}=\frac{2}{4}=\frac{1}{2}.
$$

Find the intersection.

$$
A\cap B=\{HH\}.
$$

Therefore

$$
\mathbb{P}(A\cap B)=\frac{1}{4}.
$$

Compare with the product.

$$
\mathbb{P}(A)\mathbb{P}(B)=\frac{1}{2}\cdot\frac{1}{2}=\frac{1}{4}.
$$

Since

$$
\mathbb{P}(A\cap B)=\mathbb{P}(A)\mathbb{P}(B),
$$

$A$ and $B$ are independent unconditionally.

Now condition on $C$. First compute $\mathbb{P}(C)$.

$$
\mathbb{P}(C)=\frac{|C|}{|\Omega|}=\frac{2}{4}=\frac{1}{2}.
$$

Compute $\mathbb{P}(A\mid C)$.

$$
\mathbb{P}(A\mid C)=\frac{\mathbb{P}(A\cap C)}{\mathbb{P}(C)}.
$$

Find $A\cap C$.

$$
A\cap C=\{HH,HT\}\cap\{HT,TH\}=\{HT\}.
$$

Therefore

$$
\mathbb{P}(A\cap C)=\frac{1}{4}.
$$

Substitute.

$$
\mathbb{P}(A\mid C)=\frac{\frac{1}{4}}{\frac{1}{2}}=\frac{1}{4}\cdot\frac{2}{1}=\frac{1}{2}.
$$

Similarly compute $\mathbb{P}(B\mid C)$.

$$
B\cap C=\{HH,TH\}\cap\{HT,TH\}=\{TH\},
$$

so

$$
\mathbb{P}(B\mid C)=\frac{\frac{1}{4}}{\frac{1}{2}}=\frac{1}{2}.
$$

Now compute the conditional intersection probability.

$$
\mathbb{P}(A\cap B\mid C)=\frac{\mathbb{P}(A\cap B\cap C)}{\mathbb{P}(C)}.
$$

But

$$
A\cap B=\{HH\},
$$

and

$$
C=\{HT,TH\}.
$$

Thus

$$
A\cap B\cap C=\{HH\}\cap\{HT,TH\}=\varnothing.
$$

Therefore

$$
\mathbb{P}(A\cap B\cap C)=0.
$$

So

$$
\mathbb{P}(A\cap B\mid C)=\frac{0}{\frac{1}{2}}=0.
$$

Compare with the product of conditional probabilities.

$$
\mathbb{P}(A\mid C)\mathbb{P}(B\mid C)=\frac{1}{2}\cdot\frac{1}{2}=\frac{1}{4}.
$$

Since

$$
\mathbb{P}(A\cap B\mid C)=0\neq\frac{1}{4}=\mathbb{P}(A\mid C)\mathbb{P}(B\mid C),
$$

$A$ and $B$ are not independent conditioned on $C$.

Knowing exactly one head occurred makes the two coin events mutually exclusive inside the conditioned sample space: if the first coin is heads, then the second cannot be heads.

$$
\boxed{A\text{ and }B\text{ are independent, but }A\text{ and }B\text{ are not independent conditioned on }C.}
$$

#### A4. Partitions and total probability

**Problem.** A factory has three production lines. Line $L_1$ produces $50\%$ of items with defect rate $1\%$, line $L_2$ produces $30\%$ of items with defect rate $3\%$, and line $L_3$ produces $20\%$ of items with defect rate $5\%$. Let $D$ be the event that a randomly selected item is defective. Compute $\mathbb{P}(D)$ and the posterior probabilities $\mathbb{P}(L_i\mid D)$ for $i=1,2,3$.

**Solution.**

The production line events $L_1,L_2,L_3$ form a partition: every item comes from exactly one line.

The prior probabilities are

$$
\mathbb{P}(L_1)=0.50,
$$

$$
\mathbb{P}(L_2)=0.30,
$$

$$
\mathbb{P}(L_3)=0.20.
$$

The conditional defect probabilities are

$$
\mathbb{P}(D\mid L_1)=0.01,
$$

$$
\mathbb{P}(D\mid L_2)=0.03,
$$

$$
\mathbb{P}(D\mid L_3)=0.05.
$$

Use the total probability theorem.

$$
\mathbb{P}(D)=\sum_{i=1}^{3}\mathbb{P}(L_i)\mathbb{P}(D\mid L_i).
$$

Write the three terms explicitly.

$$
\mathbb{P}(D)=\mathbb{P}(L_1)\mathbb{P}(D\mid L_1)+\mathbb{P}(L_2)\mathbb{P}(D\mid L_2)+\mathbb{P}(L_3)\mathbb{P}(D\mid L_3).
$$

Substitute values.

$$
\mathbb{P}(D)=0.50\cdot0.01+0.30\cdot0.03+0.20\cdot0.05.
$$

Compute each contribution.

$$
0.50\cdot0.01=0.005,
$$

$$
0.30\cdot0.03=0.009,
$$

$$
0.20\cdot0.05=0.010.
$$

Add the contributions.

$$
\mathbb{P}(D)=0.005+0.009+0.010=0.024.
$$

Now compute posteriors by Bayes' rule.

For line $L_1$,

$$
\mathbb{P}(L_1\mid D)=\frac{\mathbb{P}(L_1)\mathbb{P}(D\mid L_1)}{\mathbb{P}(D)}.
$$

Substitute.

$$
\mathbb{P}(L_1\mid D)=\frac{0.50\cdot0.01}{0.024}=\frac{0.005}{0.024}.
$$

Convert to a fraction.

$$
\frac{0.005}{0.024}=\frac{5}{24}.
$$

For line $L_2$,

$$
\mathbb{P}(L_2\mid D)=\frac{\mathbb{P}(L_2)\mathbb{P}(D\mid L_2)}{\mathbb{P}(D)}.
$$

Substitute.

$$
\mathbb{P}(L_2\mid D)=\frac{0.30\cdot0.03}{0.024}=\frac{0.009}{0.024}.
$$

Convert to a fraction.

$$
\frac{0.009}{0.024}=\frac{9}{24}=\frac{3}{8}.
$$

For line $L_3$,

$$
\mathbb{P}(L_3\mid D)=\frac{\mathbb{P}(L_3)\mathbb{P}(D\mid L_3)}{\mathbb{P}(D)}.
$$

Substitute.

$$
\mathbb{P}(L_3\mid D)=\frac{0.20\cdot0.05}{0.024}=\frac{0.010}{0.024}.
$$

Convert to a fraction.

$$
\frac{0.010}{0.024}=\frac{10}{24}=\frac{5}{12}.
$$

Check that the posterior probabilities sum to $1$.

$$
\frac{5}{24}+\frac{3}{8}+\frac{5}{12}
=\frac{5}{24}+\frac{9}{24}+\frac{10}{24}
=\frac{24}{24}=1.
$$

Thus the overall defect rate is $2.4\%$, and the most likely source of a defective item is line $L_3$ despite its lower production share because it has the largest defect rate.

$$
\boxed{\mathbb{P}(D)=0.024,\quad \mathbb{P}(L_1\mid D)=\frac{5}{24},\quad \mathbb{P}(L_2\mid D)=\frac{3}{8},\quad \mathbb{P}(L_3\mid D)=\frac{5}{12}.}
$$

#### A5. Multinomial counting for grouped assignments

**Problem.** Ten distinct tasks are assigned to teams A, B, and C so that team A receives $4$ tasks, team B receives $3$ tasks, and team C receives $3$ tasks. Alice's task is one of the $10$ distinct tasks. If all assignments with these group sizes are equally likely, compute the probability that Alice's task goes to team A.

**Solution.**

We are partitioning $10$ distinct tasks into three labeled groups of sizes $4,3,3$.

Count all assignments using the partition formula.

$$
\binom{10}{4,3,3}=\frac{10!}{4!3!3!}.
$$

Compute the factorials.

$$
10!=10\cdot9\cdot8\cdot7\cdot6\cdot5\cdot4\cdot3\cdot2\cdot1=3628800,
$$

$$
4!=4\cdot3\cdot2\cdot1=24,
$$

$$
3!=3\cdot2\cdot1=6.
$$

Compute the denominator.

$$
4!3!3!=24\cdot6\cdot6=864.
$$

Therefore

$$
\binom{10}{4,3,3}=\frac{3628800}{864}=4200.
$$

So there are $4200$ equally likely assignments.

Now count favorable assignments where Alice's task is assigned to team A.

If Alice's task is already placed in team A, team A still needs

$$
4-1=3
$$

additional tasks.

There are

$$
10-1=9
$$

remaining tasks to distribute.

Among those $9$ tasks, choose $3$ more for team A, $3$ for team B, and $3$ for team C.

The number of favorable assignments is

$$
\binom{9}{3,3,3}=\frac{9!}{3!3!3!}.
$$

Compute the factorials.

$$
9!=9\cdot8\cdot7\cdot6\cdot5\cdot4\cdot3\cdot2\cdot1=362880,
$$

and

$$
3!3!3!=6\cdot6\cdot6=216.
$$

Thus

$$
\binom{9}{3,3,3}=\frac{362880}{216}=1680.
$$

The desired probability is favorable assignments divided by total assignments.

$$
\mathbb{P}(\text{Alice's task goes to A})=\frac{1680}{4200}.
$$

Reduce the fraction by dividing numerator and denominator by $420$.

$$
\frac{1680}{4200}=\frac{4}{10}=\frac{2}{5}.
$$

As a decimal,

$$
\frac{2}{5}=0.4.
$$

This matches the symmetry check: team A receives $4$ of the $10$ task slots, so any particular task has probability $4/10$ of being assigned to team A.

$$
\boxed{\mathbb{P}(\text{Alice's task goes to A})=\frac{2}{5}=0.4.}
$$
