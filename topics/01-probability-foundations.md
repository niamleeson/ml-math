# Probability: Models, Axioms, Conditioning & Counting

> **Source:** Probability (MIT 6.431x) &middot; Topic 1/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## PROBABILITY

### Probability models and axioms

**Definition (Sample space).** A sample space $\Omega$ is the set of all possible outcomes. The set's elements must be mutually exclusive, collectively exhaustive and at the right granularity.

**Definition (Event).** An event is a subset of the sample space. Probability is assigned to events.

**Definition (Probability axioms).** A probability law $\mathbb{P}$ assigns probabilities to events and satisfies the following axioms:

**Nonnegativity** $\mathbb{P}(A) \geq 0$ for all events $A$.

**Normalization** $\mathbb{P}(\Omega)=1$.

**(Countable) additivity** For every sequence of events $A_1,A_2,\ldots$ such that $A_i \cap A_j = \varnothing$ for $i \neq j$,

$$
\mathbb{P}\left(\bigcup_i A_i\right)=\sum_i \mathbb{P}(A_i).
$$

**Corollaries (Consequences of the axioms).**

- $\mathbb{P}(\varnothing)=0$.
- For any finite collection of disjoint events $A_1,\ldots,A_n$,

$$
\mathbb{P}\left(\bigcup_{i=1}^{n} A_i\right)=\sum_{i=1}^{n}\mathbb{P}(A_i).
$$

- $\mathbb{P}(A)+\mathbb{P}(A^c)=1$.
- $\mathbb{P}(A) \leq 1$.
- If $A \subset B$, then $\mathbb{P}(A) \leq \mathbb{P}(B)$.
- $\mathbb{P}(A \cup B)=\mathbb{P}(A)+\mathbb{P}(B)-\mathbb{P}(A \cap B)$.
- $\mathbb{P}(A \cup B) \leq \mathbb{P}(A)+\mathbb{P}(B)$.

**Example (Discrete uniform law).** Assume $\Omega$ is finite and consists of $n$ equally likely elements. Also, assume that $A \subset \Omega$ with $k$ elements. Then $\mathbb{P}(A)=\frac{k}{n}$.

### Conditioning and Bayes' rule

**Definition (Conditional probability).** Given that event $B$ has occurred and that $\mathbb{P}(B)>0$, the probability that $A$ occurs is

$$
\mathbb{P}(A\mid B) \triangleq \frac{\mathbb{P}(A \cap B)}{\mathbb{P}(B)}.
$$

**Remark (Conditional probabilities properties).** They are the same as ordinary probabilities. Assuming $\mathbb{P}(B)>0$:

- $\mathbb{P}(A\mid B) \geq 0$.
- $\mathbb{P}(\Omega\mid B)=1$.
- $\mathbb{P}(B\mid B)=1$.
- If $A \cap C = \varnothing$, $\mathbb{P}(A \cup C\mid B)=\mathbb{P}(A\mid B)+\mathbb{P}(C\mid B)$.

**Proposition (Multiplication rule).**

$$
\mathbb{P}(A_1 \cap A_2 \cap \cdots \cap A_n)=\mathbb{P}(A_1)\mathbb{P}(A_2\mid A_1)\cdots\mathbb{P}(A_n\mid A_1 \cap A_2 \cap \cdots \cap A_{n-1}).
$$

**Theorem (Total probability theorem).** Given a partition $\{A_1,A_2,\ldots\}$ of the sample space, meaning that $\bigcup_i A_i = \Omega$ and the events are disjoint, and for every event $B$, we have

$$
\mathbb{P}(B)=\sum_i \mathbb{P}(A_i)\mathbb{P}(B\mid A_i).
$$

**Theorem (Bayes' rule).** Given a partition $\{A_1,A_2,\ldots\}$ of the sample space, meaning that $\bigcup_i A_i = \Omega$ and the events are disjoint, and if $\mathbb{P}(A_i)>0$ for all $i$, then for every event $B$, the conditional probabilities $\mathbb{P}(A_i\mid B)$ can be obtained from the conditional probabilities $\mathbb{P}(B\mid A_i)$ and the initial probabilities $\mathbb{P}(A_i)$ as follows:

$$
\mathbb{P}(A_i\mid B)=\frac{\mathbb{P}(A_i)\mathbb{P}(B\mid A_i)}{\sum_j \mathbb{P}(A_j)\mathbb{P}(B\mid A_j)}.
$$

### Independence

**Definition (Independence of events).** Two events are independent if occurrence of one provides no information about the other. We say that $A$ and $B$ are independent if

$$
\mathbb{P}(A \cap B)=\mathbb{P}(A)\mathbb{P}(B).
$$

Equivalently, as long as $\mathbb{P}(A)>0$ and $\mathbb{P}(B)>0$,

$$
\mathbb{P}(B\mid A)=\mathbb{P}(B) \qquad \mathbb{P}(A\mid B)=\mathbb{P}(A).
$$

**Remarks.**

- The definition of independence is symmetric with respect to $A$ and $B$.
- The product definition applies even if $\mathbb{P}(A)=0$ or $\mathbb{P}(B)=0$.

**Corollary.** If $A$ and $B$ are independent, then $A$ and $B^c$ are independent. Similarly for $A^c$ and $B$, or for $A^c$ and $B^c$.

**Definition (Conditional independence).** We say that $A$ and $B$ are independent conditioned on $C$, where $\mathbb{P}(C)>0$, if

$$
\mathbb{P}(A \cap B\mid C)=\mathbb{P}(A\mid C)\mathbb{P}(B\mid C).
$$

**Definition (Independence of a collection of events).** We say that events $A_1,A_2,\ldots,A_n$ are independent if for every collection of distinct indices $i_1,i_2,\ldots,i_k$, we have

$$
\mathbb{P}(A_{i_1}\cap \cdots \cap A_{i_k})=\mathbb{P}(A_{i_1})\cdot \mathbb{P}(A_{i_2})\cdots\mathbb{P}(A_{i_k}).
$$

### Counting

This section deals with finite sets with uniform probability law. In this case, to calculate $\mathbb{P}(A)$, we need to count the number of elements in $A$ and in $\Omega$.

**Remark (Basic counting principle).** For a selection that can be done in $r$ stages, with $n_i$ choices at each stage $i$, the number of possible selections is $n_1\cdot n_2\cdots n_r$.

**Definition (Permutations).** The number of permutations (orderings) of $n$ different elements is

$$
n! = 1\cdot 2\cdot 3\cdots n.
$$

**Definition (Combinations).** Given a set of $n$ elements, the number of subsets with exactly $k$ elements is

$$
\binom{n}{k}=\frac{n!}{k!(n-k)!}.
$$

**Definition (Partitions).** We are given an $n$-element set and nonnegative integers $n_1,n_2,\ldots,n_r$, whose sum is equal to $n$. The number of partitions of the set into $r$ disjoint subsets, with the $i$th subset containing exactly $n_i$ elements, is equal to

$$
\binom{n}{n_1,\ldots,n_r}=\frac{n!}{n_1!n_2!\cdots n_r!}.
$$

**Remark.** This is the same as counting how to assign $n$ distinct elements to $r$ people, giving each person $i$ exactly $n_i$ elements.
