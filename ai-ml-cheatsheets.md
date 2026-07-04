> **All AI / ML / DL Cheat Sheets** — a transcribed, LaTeX-rendered reference compiled from *"All Cheat Sheets: Machine Learning, Deep Learning, Artificial Intelligence"* (compiled by Nikhil Yadav). Sources: MIT 6.431x (Probability) and Stanford **CS 229 / CS 230 / CS 221** by Afshine & Shervine Amidi. Math is written in LaTeX (`$...$` inline, `$$...$$` display). Original figures, diagrams, and plots are described in italics as `*[Figure: ...]*`. Table-of-contents pages were intentionally omitted.

## Table of Contents

- [Probability — the Science of Uncertainty and Data](#probability--the-science-of-uncertainty-and-data)
  - [PROBABILITY](#probability)
    - [Probability models and axioms](#probability-models-and-axioms)
    - [Conditioning and Bayes' rule](#conditioning-and-bayes-rule)
    - [Independence](#independence)
    - [Counting](#counting)
  - [Discrete random variables](#discrete-random-variables)
    - [Probability mass function and expectation](#probability-mass-function-and-expectation)
    - [Variance, conditioning on an event, multiple r.v.](#variance-conditioning-on-an-event-multiple-rv)
    - [Conditioning on a random variable, independence](#conditioning-on-a-random-variable-independence)
  - [Continuous random variables](#continuous-random-variables)
    - [PDF, Expectation, Variance, CDF](#pdf-expectation-variance-cdf)
    - [Conditioning on an event, and multiple continuous r.v.](#conditioning-on-an-event-and-multiple-continuous-rv)
    - [Conditioning on a random variable, independence, Bayes' rule](#conditioning-on-a-random-variable-independence-bayes-rule)
    - [Derived distributions](#derived-distributions)
    - [Sums of independent r.v., covariance and correlation](#sums-of-independent-rv-covariance-and-correlation)
    - [Conditional expectation and variance, sum of random number of r.v.](#conditional-expectation-and-variance-sum-of-random-number-of-rv)
  - [Convergence of random variables](#convergence-of-random-variables)
    - [Inequalities, convergence, and the Weak Law of Large Numbers](#inequalities-convergence-and-the-weak-law-of-large-numbers)
    - [The Central Limit Theorem](#the-central-limit-theorem)
- [Machine Learning — Super VIP Cheatsheet (Stanford CS 229)](#machine-learning--super-vip-cheatsheet-stanford-cs-229)
  - [1 Supervised Learning](#1-supervised-learning)
    - [1.1 Introduction to Supervised Learning](#11-introduction-to-supervised-learning)
    - [1.2 Notations and general concepts](#12-notations-and-general-concepts)
    - [1.3 Linear models](#13-linear-models)
      - [1.3.1 Linear regression](#131-linear-regression)
      - [1.3.2 Classification and logistic regression](#132-classification-and-logistic-regression)
      - [1.3.3 Generalized Linear Models](#133-generalized-linear-models)
    - [1.4 Support Vector Machines](#14-support-vector-machines)
    - [1.5 Generative Learning](#15-generative-learning)
      - [1.5.1 Gaussian Discriminant Analysis](#151-gaussian-discriminant-analysis)
      - [1.5.2 Naive Bayes](#152-naive-bayes)
    - [1.6 Tree-based and ensemble methods](#16-tree-based-and-ensemble-methods)
    - [1.7 Other non-parametric approaches](#17-other-non-parametric-approaches)
    - [1.8 Learning Theory](#18-learning-theory)
  - [2 Unsupervised Learning](#2-unsupervised-learning)
    - [2.1 Introduction to Unsupervised Learning](#21-introduction-to-unsupervised-learning)
    - [2.2 Clustering](#22-clustering)
      - [2.2.1 Expectation-Maximization](#221-expectation-maximization)
      - [2.2.2 k-means clustering](#222-k-means-clustering)
      - [2.2.3 Hierarchical clustering](#223-hierarchical-clustering)
      - [2.2.4 Clustering assessment metrics](#224-clustering-assessment-metrics)
    - [2.3 Dimension reduction](#23-dimension-reduction)
      - [2.3.1 Principal component analysis](#231-principal-component-analysis)
      - [2.3.2 Independent component analysis](#232-independent-component-analysis)
  - [3 Deep Learning](#3-deep-learning)
    - [3.1 Neural Networks](#31-neural-networks)
    - [3.2 Convolutional Neural Networks](#32-convolutional-neural-networks)
    - [3.3 Recurrent Neural Networks](#33-recurrent-neural-networks)
    - [3.4 Reinforcement Learning and Control](#34-reinforcement-learning-and-control)
  - [4 Machine Learning Tips and Tricks](#4-machine-learning-tips-and-tricks)
    - [4.1 Metrics](#41-metrics)
      - [4.1.1 Classification](#411-classification)
      - [4.1.2 Regression](#412-regression)
    - [4.2 Model selection](#42-model-selection)
    - [4.3 Diagnostics](#43-diagnostics)
  - [5 Refreshers](#5-refreshers)
    - [5.1 Probabilities and Statistics](#51-probabilities-and-statistics)
      - [5.1.1 Introduction to Probability and Combinatorics](#511-introduction-to-probability-and-combinatorics)
      - [5.1.2 Conditional Probability](#512-conditional-probability)
      - [5.1.3 Random Variables](#513-random-variables)
      - [5.1.4 Jointly Distributed Random Variables](#514-jointly-distributed-random-variables)
      - [5.1.5 Parameter estimation](#515-parameter-estimation)
    - [5.2 Linear Algebra and Calculus](#52-linear-algebra-and-calculus)
      - [5.2.1 General notations](#521-general-notations)
      - [5.2.2 Matrix operations](#522-matrix-operations)
      - [5.2.3 Matrix properties](#523-matrix-properties)
      - [5.2.4 Matrix calculus](#524-matrix-calculus)
- [Deep Learning — Super VIP Cheatsheet (Stanford CS 230)](#deep-learning--super-vip-cheatsheet-stanford-cs-230)
  - [1 Convolutional Neural Networks](#1-convolutional-neural-networks)
    - [1.1 Overview](#11-overview)
    - [1.2 Types of layer](#12-types-of-layer)
    - [1.3 Filter hyperparameters](#13-filter-hyperparameters)
    - [1.4 Tuning hyperparameters](#14-tuning-hyperparameters)
    - [1.5 Commonly used activation functions](#15-commonly-used-activation-functions)
    - [1.6 Object detection](#16-object-detection)
      - [1.6.1 Face verification and recognition](#161-face-verification-and-recognition)
      - [1.6.2 Neural style transfer](#162-neural-style-transfer)
      - [1.6.3 Architectures using computational tricks](#163-architectures-using-computational-tricks)
  - [2 Recurrent Neural Networks](#2-recurrent-neural-networks)
    - [2.1 Overview](#21-overview)
    - [2.2 Handling long term dependencies](#22-handling-long-term-dependencies)
    - [2.3 Learning word representation](#23-learning-word-representation)
      - [2.3.1 Motivation and notations](#231-motivation-and-notations)
      - [2.3.2 Word embeddings](#232-word-embeddings)
    - [2.4 Comparing words](#24-comparing-words)
    - [2.5 Language model](#25-language-model)
    - [2.6 Machine translation](#26-machine-translation)
    - [2.7 Attention](#27-attention)
  - [3 Deep Learning Tips and Tricks](#3-deep-learning-tips-and-tricks)
    - [3.1 Data processing](#31-data-processing)
    - [3.2 Training a neural network](#32-training-a-neural-network)
      - [3.2.1 Definitions](#321-definitions)
      - [3.2.2 Finding optimal weights](#322-finding-optimal-weights)
    - [3.3 Parameter tuning](#33-parameter-tuning)
      - [3.3.1 Weights initialization](#331-weights-initialization)
      - [3.3.2 Optimizing convergence](#332-optimizing-convergence)
    - [3.4 Regularization](#34-regularization)
    - [3.5 Good practices](#35-good-practices)
- [Artificial Intelligence — Super VIP Cheatsheet (Stanford CS 221)](#artificial-intelligence--super-vip-cheatsheet-stanford-cs-221)
  - [1 Reflex-based models](#1-reflex-based-models)
    - [1.1 Linear predictors](#11-linear-predictors)
      - [1.1.1 Classification](#111-classification)
      - [1.1.2 Regression](#112-regression)
    - [1.2 Loss minimization](#12-loss-minimization)
    - [1.3 Non-linear predictors](#13-non-linear-predictors)
    - [1.4 Stochastic gradient descent](#14-stochastic-gradient-descent)
    - [1.5 Fine-tuning models](#15-fine-tuning-models)
    - [1.6 Unsupervised Learning](#16-unsupervised-learning)
      - [1.6.1 k-means](#161-k-means)
      - [1.6.2 Principal Component Analysis](#162-principal-component-analysis)
  - [2 States-based models](#2-states-based-models)
    - [2.1 Search optimization](#21-search-optimization)
      - [2.1.1 Tree search](#211-tree-search)
      - [2.1.2 Graph search](#212-graph-search)
      - [2.1.3 Learning costs](#213-learning-costs)
      - [2.1.4 A* search](#214-a-search)
      - [2.1.5 Relaxation](#215-relaxation)
    - [2.2 Markov decision processes](#22-markov-decision-processes)
      - [2.2.1 Notations](#221-notations)
      - [2.2.2 Applications](#222-applications)
      - [2.2.3 When unknown transitions and rewards](#223-when-unknown-transitions-and-rewards)
    - [2.3 Game playing](#23-game-playing)
      - [2.3.1 Speeding up minimax](#231-speeding-up-minimax)
      - [2.3.2 Simultaneous games](#232-simultaneous-games)
      - [2.3.3 Non-zero-sum games](#233-non-zero-sum-games)
  - [3 Variables-based models](#3-variables-based-models)
    - [3.1 Constraint satisfaction problems](#31-constraint-satisfaction-problems)
      - [3.1.1 Factor graphs](#311-factor-graphs)
      - [3.1.2 Dynamic ordering](#312-dynamic-ordering)
      - [3.1.3 Approximate methods](#313-approximate-methods)
      - [3.1.4 Factor graph transformations](#314-factor-graph-transformations)
    - [3.2 Bayesian networks](#32-bayesian-networks)
      - [3.2.1 Introduction](#321-introduction)
      - [3.2.2 Probabilistic programs](#322-probabilistic-programs)
      - [3.2.3 Inference](#323-inference)
  - [4 Logic-based models](#4-logic-based-models)
    - [4.1 Basics](#41-basics)
    - [4.2 Knowledge base](#42-knowledge-base)
    - [4.3 Propositional logic](#43-propositional-logic)
    - [4.4 First-order logic](#44-first-order-logic)

---

# Probability — the Science of Uncertainty and Data
*by Fabián Kozynski*

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

## Discrete random variables

### Probability mass function and expectation

**Definition (Random variable).** A random variable $X$ is a function of the sample space $\Omega$ into the real numbers (or $\mathbb{R}^n$). Its range can be discrete or continuous.

**Definition (Probability mass function (PMF)).** The probability law of a discrete random variable $X$ is called its PMF. It is defined as

$$
p_X(x)=\mathbb{P}(X=x)=\mathbb{P}(\{\omega \in \Omega:X(\omega)=x\}).
$$

**Properties.**

$$
p_X(x)\geq 0,\ \forall x.
$$

$$
\sum_x p_X(x)=1.
$$

**Example (Bernoulli random variable).** A Bernoulli random variable $X$ with parameter $0 \leq p \leq 1$ ($X\sim \operatorname{Ber}(p)$) takes the following values:

$$
X=\begin{cases}
1 & \text{w.p. } p,\\
0 & \text{w.p. } 1-p.
\end{cases}
$$

An indicator random variable of an event ($I_A=1$ if $A$ occurs) is an example of a Bernoulli random variable.

**Example (Discrete uniform random variable).** A Discrete uniform random variable $X$ between $a$ and $b$ with $a \leq b$ ($X\sim \operatorname{Unif}_{a,b}()$) takes any of the values in $\{a,a+1,\ldots,b\}$ with probability $\frac{1}{b-a+1}$.

**Example (Binomial random variable).** A Binomial random variable $X$ with parameters $n$ (natural number) and $0 \leq p \leq 1$ ($X\sim \operatorname{Bin}(n,p)$) takes values in the set $\{0,1,\ldots,n\}$ with probabilities $p_X(i)=\binom{n}{i}p^i(1-p)^{n-i}$.

It represents the number of successes in $n$ independent trials where each trial has a probability of success $p$. Therefore, it can also be seen as the sum of $n$ independent Bernoulli random variables, each with parameter $p$.

**Example (Geometric random variable).** A Geometric random variable $X$ with parameter $0 \leq p \leq 1$ ($X\sim \operatorname{Geo}(p)$) takes values in the set $\{1,2,\ldots\}$ with probabilities $p_X(i)=(1-p)^{i-1}p$.

It represents the number of independent trials until (and including) the first success, when the probability of success in each trial is $p$.

**Definition (Expectation/mean of a random variable).** The expectation of a discrete random variable is defined as

$$
\mathbb{E}[X]\triangleq \sum_x xp_X(x),
$$

assuming $\sum_x |x|p_X(x)<\infty$.

**Properties (Properties of expectation).**

- If $X\geq 0$ then $\mathbb{E}[X]\geq 0$.
- If $a\leq X\leq b$ then $a\leq \mathbb{E}[X]\leq b$.
- If $X=c$ then $\mathbb{E}[X]=c$.

**Example Expected value of know r.v.**

- If $X\sim \operatorname{Ber}(p)$ then $\mathbb{E}[X]=p$.
- If $X=I_A$ then $\mathbb{E}[X]=\mathbb{P}(A)$.
- If $X\sim \operatorname{Uni}[a,b]$ then $\mathbb{E}[X]=\frac{a+b}{2}$.
- If $X\sim \operatorname{Bin}(n,p)$ then $\mathbb{E}[X]=np$.
- If $X\sim \operatorname{Geo}(p)$ then $\mathbb{E}[X]=\frac{1}{p}$.

**Theorem (Expected value rule).** Given a random variable $X$ and a function $g:\mathbb{R}\to\mathbb{R}$, we construct the random variable $Y=g(X)$. Then

$$
\sum_y yp_Y(y)=\mathbb{E}[Y]=\mathbb{E}[g(X)]=\sum_x g(x)p_X(x).
$$

**Remark (PMF of $Y=g(X)$).** The PMF of $Y=g(X)$ is

$$
p_Y(y)=\sum_{\{x:g(x)=y\}}p_X(x).
$$

**Remark.** In general $g(\mathbb{E}[X])\neq \mathbb{E}[g(X)]$. They are equal if $g(x)=ax+b$.

### Variance, conditioning on an event, multiple r.v.

**Definition (Variance of a random variable).** Given a random variable $X$ with $\mu=\mathbb{E}[X]$, its variance is a measure of the spread of the random variable and is defined as

$$
\operatorname{Var}(X)\triangleq \mathbb{E}[(X-\mu)^2]=\sum_x (x-\mu)^2p_X(x).
$$

**Definition (Standard deviation).**

$$
\sigma_X=\sqrt{\operatorname{Var}(X)}.
$$

**Properties (Properties of the variance).**

- $\operatorname{Var}(aX)=a^2\operatorname{Var}(X)$, for all $a\in\mathbb{R}$.
- $\operatorname{Var}(X+b)=\operatorname{Var}(X)$, for all $b\in\mathbb{R}$.
- $\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)$.
- $\operatorname{Var}(X)=\mathbb{E}[X^2]-(\mathbb{E}[X])^2$.

**Example (Variance of known r.v.).**

- If $X\sim \operatorname{Ber}(p)$, then $\operatorname{Var}(X)=p(1-p)$.
- If $X\sim \operatorname{Uni}[a,b]$, then $\operatorname{Var}(X)=\frac{(b-a)(b-a+2)}{12}$.
- If $X\sim \operatorname{Bin}(n,p)$, then $\operatorname{Var}(X)=np(1-p)$.
- If $X\sim \operatorname{Geo}(p)$, then $\operatorname{Var}(X)=\frac{1-p}{p^2}$.

**Proposition (Conditional PMF and expectation, given an event).** Given the event $A$, with $\mathbb{P}(A)>0$, we have the following

$$
p_{X\mid A}(x)=\mathbb{P}(X=x\mid A).
$$

If $A$ is a subset of the range of $X$, then:

$$
p_{X\mid A}(x) \triangleq p_{X\mid X\in A}(x)=\begin{cases}
\frac{1}{\mathbb{P}(A)}p_X(x), & \text{if } x\in A,\\
0, & \text{otherwise.}
\end{cases}
$$

- $\sum_x p_{X\mid A}(x)=1$.
- $\mathbb{E}[X\mid A]=\sum_x xp_{X\mid A}(x)$.
- $\mathbb{E}[g(X)\mid A]=\sum_x g(x)p_{X\mid A}(x)$.

**Proposition (Total expectation rule).** Given a partition of disjoint events $A_1,\ldots,A_n$ such that $\sum_i \mathbb{P}(A_i)=1$, and $\mathbb{P}(A_i)>0$,

$$
\mathbb{E}[X]=\mathbb{P}(A_1)\mathbb{E}[X\mid A_1]+\cdots+\mathbb{P}(A_n)\mathbb{E}[X\mid A_n].
$$

**Definition (Memorylessness of the geometric random variable).** When we condition a geometric random variable $X$ on the event $X>n$ we have memorylessness, meaning that the “remaining time” $X-n$, given that $X>n$, is also geometric with the same parameter. Formally,

$$
p_{X-n\mid X>n}(i)=p_X(i).
$$

**Definition (Joint PMF).** The joint PMF of random variables $X_1,X_2,\ldots,X_n$ is

$$
p_{X_1,X_2,\ldots,X_n}(x_1,\ldots,x_n)=\mathbb{P}(X_1=x_1,\ldots,X_n=x_n).
$$

**Properties (Properties of joint PMF).**

- $\sum_{x_1}\sum_{x_2}\cdots\sum_{x_n}p_{X_1,\ldots,X_n}(x_1,\ldots,x_n)=1$.
- $p_{X_1}(x_1)=\sum_{x_2}\cdots\sum_{x_n}p_{X_1,\ldots,X_n}(x_1,x_2,\ldots,x_n)$.
- $p_{X_2,\ldots,X_n}(x_2,\ldots,x_n)=\sum_{x_1}p_{X_1,X_2,\ldots,X_n}(x_1,x_2,\ldots,x_n)$.

**Definition (Functions of multiple r.v.).** If $Z=g(X_1,\ldots,X_n)$, where $g:\mathbb{R}^n\to\mathbb{R}$, then $p_Z(z)=\mathbb{P}(g(X_1,\ldots,X_n)=z)$.

**Proposition (Expected value rule for multiple r.v.).** Given $g:\mathbb{R}^n\to\mathbb{R}$,

$$
\mathbb{E}[g(X_1,\ldots,X_n)]=\sum_{x_1,\ldots,x_n}g(x_1,\ldots,x_n)p_{X_1,\ldots,X_n}(x_1,\ldots,x_n).
$$

**Properties (Linearity of expectations).**

- $\mathbb{E}[aX+b]=a\mathbb{E}[X]+b$.
- $\mathbb{E}[X_1+\cdots+X_n]=\mathbb{E}[X_1]+\cdots+\mathbb{E}[X_n]$.

### Conditioning on a random variable, independence

**Definition (Conditional PMF given another random variable).** Given discrete random variables $X,Y$ and $y$ such that $p_Y(y)>0$ we define

$$
p_{X\mid Y}(x\mid y)=\frac{p_{X,Y}(x,y)}{p_Y(y)}.
$$

**Proposition (Multiplication rule).** Given discrete random variables $X,Y$, and whenever the conditional probabilities are defined,

$$
p_{X,Y}(x,y)=p_X(x)p_{Y\mid X}(y\mid x)=p_Y(y)p_{X\mid Y}(x\mid y).
$$

**Definition (Conditional expectation).** Given discrete random variables $X,Y$ and $y$ such that $p_Y(y)>0$ we define

$$
\mathbb{E}[X\mid Y=y]=\sum_x xp_{X\mid Y}(x\mid y).
$$

Additionally we have

$$
\mathbb{E}[g(X)\mid Y=y]=\sum_x g(x)p_{X\mid Y}(x\mid y).
$$

**Theorem (Total probability and expectation theorems).** If $p_Y(y)>0$, then

$$
p_X(x)=\sum_y p_Y(y)p_{X\mid Y}(x\mid y),
$$

$$
\mathbb{E}[X]=\sum_y p_Y(y)\mathbb{E}[X\mid Y=y].
$$

**Definition (Independence of a random variable and an event).** A discrete random variable $X$ and an event $A$ are independent if $\mathbb{P}(X=x \text{ and } A)=p_X(x)\mathbb{P}(A)$, for all $x$.

**Definition (Independence of two random variables).** Two discrete random variables $X$ and $Y$ are independent if $p_{X,Y}(x,y)=p_X(x)p_Y(y)$ for all $x,y$.

**Remark (Independence of a collection of random variables).** A collection $X_1,X_2,\ldots,X_n$ of random variables are independent if

$$
p_{X_1,\ldots,X_n}(x_1,\ldots,x_n)=p_{X_1}(x_1)\cdots p_{X_n}(x_n),\ \forall x_1,\ldots,x_n.
$$

**Remark (Independence and expectation).** In general, $\mathbb{E}[g(X,Y)]\neq g(\mathbb{E}[X],\mathbb{E}[Y])$. An exception is for linear functions: $\mathbb{E}[aX+bY]=a\mathbb{E}[X]+b\mathbb{E}[Y]$.

**Proposition (Expectation of product of independent r.v.).** If $X$ and $Y$ are discrete independent random variables,

$$
\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y].
$$

**Remark.** If $X$ and $Y$ are independent, $\mathbb{E}[g(X)h(Y)]=\mathbb{E}[g(X)]\mathbb{E}[h(Y)]$.

**Proposition (Variance of sum of independent random variables).** If $X$ and $Y$ are discrete independent random variables,

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y).
$$

## Continuous random variables

### PDF, Expectation, Variance, CDF

**Definition (Probability density function (PDF)).** A probability density function of a r.v. $X$ is a non-negative real valued function $f_X$ that satisfies the following

- $\int_{-\infty}^{\infty} f_X(x)dx=1$.
- $\mathbb{P}(a\leq X\leq b)=\int_a^b f_X(x)dx$ for some random variable $X$.

**Definition (Continuous random variable).** A random variable $X$ is continuous if its probability law can be described by a PDF $f_X$.

**Remark.** Continuous random variables satisfy:

- For small $\delta>0$, $\mathbb{P}(a\leq X\leq a+\delta)\approx f_X(a)\delta$.
- $\mathbb{P}(X=a)=0$, $\forall a\in\mathbb{R}$.

**Definition (Expectation of a continuous random variable).** The expectation of a continuous random variable is

$$
\mathbb{E}[X]\triangleq \int_{-\infty}^{\infty}xf_X(x)dx.
$$

assuming $\int_{-\infty}^{\infty}|x|f_X(x)dx<\infty$.

**Properties (Properties of expectation).**

- If $X\geq 0$ then $\mathbb{E}[X]\geq 0$.
- If $a\leq X\leq b$ then $a\leq \mathbb{E}[X]\leq b$.
- $\mathbb{E}[g(X)]=\int_{-\infty}^{\infty}g(x)f_X(x)dx$.
- $\mathbb{E}[aX+b]=a\mathbb{E}[X]+b$.

**Definition (Variance of a continuous random variable).** Given a continuous random variable $X$ with $\mu=\mathbb{E}[X]$, its variance is

$$
\operatorname{Var}(X)=\mathbb{E}[(X-\mu)^2]=\int_{-\infty}^{\infty}(x-\mu)^2f_X(x)dx.
$$

It has the same properties as the variance of a discrete random variable.

**Example (Uniform continuous random variable).** A Uniform continuous random variable $X$ between $a$ and $b$, with $a<b$, ($X\sim \operatorname{Uni}(a,b)$) has PDF

$$
f_X(x)=\begin{cases}
\frac{1}{b-a}, & \text{if } a\leq x\leq b,\\
0, & \text{otherwise.}
\end{cases}
$$

We have $\mathbb{E}[X]=\frac{a+b}{2}$ and $\operatorname{Var}(X)=\frac{(b-a)^2}{12}$.

**Example (Exponential random variable).** An Exponential random variable $X$ with parameter $\lambda>0$ ($X\sim \operatorname{Exp}(\lambda)$) has PDF

$$
f_X(x)=\begin{cases}
\lambda e^{-\lambda x}, & \text{if } x\geq 0,\\
0, & \text{otherwise.}
\end{cases}
$$

We have $\mathbb{E}[X]=\frac{1}{\lambda}$ and $\operatorname{Var}(X)=\frac{1}{\lambda^2}$.

**Definition (Cumulative Distribution Function (CDF)).** The CDF of a random variable $X$ is $F_X(x)=\mathbb{P}(X\leq x)$. In particular, for a continuous random variable, we have

$$
F_X(x)=\int_{-\infty}^{x}f_X(t)dt,
$$

$$
f_X(x)=\frac{dF_X(x)}{dx}.
$$

**Properties (Properties of CDF).**

- If $y\geq x$, then $F_X(y)\geq F_X(x)$.
- $\lim_{x\to -\infty}F_X(x)=0$.
- $\lim_{x\to \infty}F_X(x)=1$.

**Definition (Normal/Gaussian random variable).** A Normal random variable $X$ with mean $\mu$ and variance $\sigma^2>0$ ($X\sim \mathcal{N}(\mu,\sigma^2)$) has PDF

$$
f_X(x)=\frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2\sigma^2}(x-\mu)^2}.
$$

We have $\mathbb{E}[X]=\mu$ and $\operatorname{Var}(X)=\sigma^2$.

**Remark (Standard Normal).** The standard Normal is $\mathcal{N}(0,1)$.

**Proposition (Linearity of Gaussians).** Given $X\sim \mathcal{N}(\mu,\sigma^2)$, and if $a\neq 0$, then $aX+b\sim \mathcal{N}(a\mu+b,a^2\sigma^2)$.

Using this $Y=\frac{X-\mu}{\sigma}$ is a standard gaussian.

### Conditioning on an event, and multiple continuous r.v.

**Definition (Conditional PDF given an event).** Given a continuous random variable $X$ and event $A$ with $\mathbb{P}(A)>0$, we define the conditional PDF as the function that satisfies

$$
\mathbb{P}(X\in B\mid A)=\int_B f_{X\mid A}(x)dx.
$$

**Definition (Conditional PDF given $X\in A$).** Given a continuous random variable $X$ and an $A\subset \mathbb{R}$, with $\mathbb{P}(A)>0$:

$$
f_{X\mid X\in A}(x)=\begin{cases}
\frac{1}{\mathbb{P}(A)}f_X(x), & x\in A,\\
0, & x\notin A.
\end{cases}
$$

**Definition (Conditional expectation).** Given a continuous random variable $X$ and an event $A$, with $\mathbb{P}(A)>0$:

$$
\mathbb{E}[X\mid A]=\int_{-\infty}^{\infty}xf_{X\mid A}(x)dx.
$$

**Definition (Memorylessness of the exponential random variable).** When we condition an exponential random variable $X$ on the event $X>t$ we have memorylessness, meaning that the “remaining time” $X-t$ given that $X>t$ is also geometric with the same parameter i.e.,

$$
\mathbb{P}(X-t>s\mid X>t)=\mathbb{P}(X>s).
$$

**Theorem (Total probability and expectation theorems).** Given a partition of the space into disjoint events $A_1,A_2,\ldots,A_n$ such that $\sum_i\mathbb{P}(A_i)=1$ we have the following:

$$
F_X(x)=\mathbb{P}(A_1)F_{X\mid A_1}(x)+\cdots+\mathbb{P}(A_n)F_{X\mid A_n}(x),
$$

$$
f_X(x)=\mathbb{P}(A_1)f_{X\mid A_1}(x)+\cdots+\mathbb{P}(A_n)f_{X\mid A_n}(x),
$$

$$
\mathbb{E}[X]=\mathbb{P}(A_1)\mathbb{E}[X\mid A_1]+\cdots+\mathbb{P}(A_n)\mathbb{E}[X\mid A_n].
$$

**Definition (Jointly continuous random variables).** A pair (collection) of random variables is jointly continuous if there exists a joint PDF $f_{X,Y}$ that describes them, that is, for every set $B\subset \mathbb{R}^n$

$$
\mathbb{P}((X,Y)\in B)=\iint_B f_{X,Y}(x,y)dxdy.
$$

**Properties (Properties of joint PDFs).**

- $f_X(x)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)dy$.
- $F_{X,Y}(x,y)=\mathbb{P}(X\leq x,Y\leq y)=\int_{-\infty}^{x}\left[\int_{-\infty}^{y}f_{X,Y}(u,v)dv\right]du$.
- $f_{X,Y}(x,y)=\frac{\partial^2 F_{X,Y}(x,y)}{\partial x\partial y}$.

**Example (Uniform joint PDF on a set $S$).** Let $S\subset \mathbb{R}^2$ with area $s>0$, then the random variable $(X,Y)$ is uniform over $S$ if it has PDF

$$
f_{X,Y}(x,y)=\begin{cases}
\frac{1}{s}, & (x,y)\in S,\\
0, & (x,y)\notin S.
\end{cases}
$$

### Conditioning on a random variable, independence, Bayes' rule

**Definition (Conditional PDF given another random variable).** Given jointly continuous random variables $X,Y$ and a value $y$ such that $f_Y(y)>0$, we define the conditional PDF as

$$
f_{X\mid Y}(x\mid y)\triangleq \frac{f_{X,Y}(x,y)}{f_Y(y)}.
$$

Additionally we define $\mathbb{P}(X\in A\mid Y=y)\int_A f_{X\mid Y}(x\mid y)dx$.

**Proposition (Multiplication rule).** Given jointly continuous random variables $X,Y$, and $y$ such that $f_Y(y)>0$ we define

$$
f_{X,Y}(x,y)=f_X(x)f_{Y\mid X}(y\mid x)=f_Y(y)f_{X\mid Y}(x\mid y).
$$

**Definition (Conditional expectation).** Given jointly continuous random variables $X,Y$, and $y$ such that $f_Y(y)>0$, we define the conditional expected value as

$$
\mathbb{E}[X\mid Y=y]=\int_{-\infty}^{\infty}xf_{X\mid Y}(x\mid y)dx.
$$

Additionally we have

$$
\mathbb{E}[g(X)\mid Y=y]=\int_{-\infty}^{\infty}g(x)f_{X\mid Y}(x\mid y)dx.
$$

**Theorem (Total probability and total expectation theorems).**

$$
f_X(x)=\int_{-\infty}^{\infty}f_Y(y)f_{X\mid Y}(x\mid y)dy,
$$

$$
\mathbb{E}[X]=\int_{-\infty}^{\infty}f_Y(y)\mathbb{E}[X\mid Y=y]dy.
$$

**Definition (Independence).** Jointly continuous random variables $X,Y$ are independent if $f_{X,Y}(x,y)=f_X(x)f_Y(y)$ for all $x,y$.

**Proposition (Expectation of product of independent r.v.).** If $X$ and $Y$ are independent continuous random variables,

$$
\mathbb{E}[XY]=\mathbb{E}[X]\mathbb{E}[Y].
$$

**Remark.** If $X$ and $Y$ are independent, $\mathbb{E}[g(X)h(Y)]=\mathbb{E}[g(X)]\mathbb{E}[h(Y)]$.

**Proposition (Variance of sum of independent random variables).** If $X$ and $Y$ are independent continuous random variables,

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y).
$$

**Proposition (Bayes' rule summary).**

- For $X,Y$ discrete: $p_{X\mid Y}(x\mid y)=\frac{p_X(x)p_{Y\mid X}(y\mid x)}{p_Y(y)}$.
- For $X,Y$ continuous: $f_{X\mid Y}(x\mid y)=\frac{f_X(x)f_{Y\mid X}(y\mid x)}{f_Y(y)}$.
- For $X$ discrete, $Y$ continuous: $p_{X\mid Y}(x\mid y)=\frac{p_X(x)f_{Y\mid X}(y\mid x)}{f_Y(y)}$.
- For $X$ continuous, $Y$ discrete: $f_{X\mid Y}(x\mid y)=\frac{f_X(x)p_{Y\mid X}(y\mid x)}{p_Y(y)}$.

### Derived distributions

**Proposition (Discrete case).** Given a discrete random variable $X$ and a function $g$, the r.v. $Y=g(X)$ has PMF

$$
p_Y(y)=\sum_{x:g(x)=y}p_X(x).
$$

**Remark (Linear function of discrete random variable).** If $g(x)=ax+b$, then $p_Y(y)=p_X\left(\frac{y-b}{a}\right)$.

**Proposition (Linear function of continuous r.v.).** Given a continuous random variable $X$ and $Y=aX+b$, with $a\neq 0$, we have

$$
f_Y(y)=\frac{1}{|a|}f_X\left(\frac{y-b}{a}\right).
$$

**Corollary (Linear function of normal r.v.).** If $X\sim \mathcal{N}(\mu,\sigma^2)$ and $Y=aX+b$, with $a\neq 0$, then $Y\sim \mathcal{N}(a\mu+b,a^2\sigma^2)$.

**Example (General function of a continuous r.v.).** If $X$ is a continuous random variable and $g$ is any function, to obtain the pdf of $Y=g(X)$ we follow the two-step procedure:

1. Find the CDF of $Y$: $F_Y(y)=\mathbb{P}(Y\leq y)=\mathbb{P}(g(X)\leq y)$.
2. Differentiate the CDF of $Y$ to obtain the PDF: $f_Y(y)=\frac{dF_Y(y)}{dy}$.

**Proposition (General formula for monotonic function).** Let $X$ be a continuous random variable and $g$ a function that is monotonic wherever $f_X(x)>0$. The PDF of $Y=g(X)$ is given by

$$
f_Y(y)=f_X(h(y))\left|\frac{dh(y)}{dy}\right|,
$$

where $h=g^{-1}$ in the interval where $g$ is monotonic.

### Sums of independent r.v., covariance and correlation

**Proposition (Discrete case).** Let $X,Y$ be discrete independent random variables and $Z=X+Y$, then the PMF of $Z$ is

$$
p_Z(z)=\sum_x p_X(x)p_Y(z-x).
$$

**Proposition (Continuous case).** Let $X,Y$ be continuous independent random variables and $Z=X+Y$, then the PDF of $Z$ is

$$
f_Z(z)=\int_{-\infty}^{\infty}f_X(x)f_Y(z-x)dx.
$$

**Proposition (Sum of independent normal r.v.).** Let $X\sim \mathcal{N}(\mu_X,\sigma_X^2)$ and $Y\sim \mathcal{N}(\mu_Y,\sigma_Y^2)$ independent. Then

$$
Z=X+Y\sim \mathcal{N}(\mu_X+\mu_Y,\sigma_X^2+\sigma_Y^2).
$$

**Definition (Covariance).** We define the covariance of random variables $X,Y$ as

$$
\operatorname{Cov}(X,Y) \triangleq \mathbb{E}[(X-\mathbb{E}[X])(Y-\mathbb{E}[Y])].
$$

**Properties (Properties of covariance).**

- If $X,Y$ are independent, then $\operatorname{Cov}(X,Y)=0$.
- $\operatorname{Cov}(X,X)=\operatorname{Var}(X)$.
- $\operatorname{Cov}(aX+b,Y)=a\operatorname{Cov}(X,Y)$.
- $\operatorname{Cov}(X,Y+Z)=\operatorname{Cov}(X,Y)+\operatorname{Cov}(X,Z)$.
- $\operatorname{Cov}(X,Y)=\mathbb{E}[XY]-\mathbb{E}[X]\mathbb{E}[Y]$.

**Proposition (Variance of a sum of r.v.).**

$$
\operatorname{Var}(X_1+\cdots+X_n)=\sum_i\operatorname{Var}(X_i)+\sum_{i\neq j}\operatorname{Cov}(X_i,X_j).
$$

**Definition (Correlation coefficient).** We define the correlation coefficient of random variables $X,Y$, with $\sigma_X,\sigma_Y>0$, as

$$
\rho(X,Y)\triangleq \frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}.
$$

**Properties (Properties of the correlation coefficient).**

- $-1\leq \rho \leq 1$.
- If $X,Y$ are independent, then $\rho=0$.
- $|\rho|=1$ if and only if $X-\mathbb{E}[X]=c(Y-\mathbb{E}[Y])$.
- $\rho(aX+b,Y)=\operatorname{sign}(a)\rho(X,Y)$.

### Conditional expectation and variance, sum of random number of r.v.

**Definition (Conditional expectation as a random variable).** Given random variables $X,Y$ the conditional expectation $\mathbb{E}[X\mid Y]$ is the random variable that takes the value $\mathbb{E}[X\mid Y=y]$ whenever $Y=y$.

**Theorem (Law of iterated expectations).**

$$
\mathbb{E}[\mathbb{E}[X\mid Y]]=\mathbb{E}[X].
$$

**Definition (Conditional variance as a random variable).** Given random variables $X,Y$ the conditional variance $\operatorname{Var}(X\mid Y)$ is the random variable that takes the value $\operatorname{Var}(X\mid Y=y)$ whenever $Y=y$.

**Theorem (Law of total variance).**

$$
\operatorname{Var}(X)=\mathbb{E}[\operatorname{Var}(X\mid Y)]+\operatorname{Var}(\mathbb{E}[X\mid Y]).
$$

**Proposition (Sum of a random number of independent r.v.).** Let $N$ be a nonnegative integer random variable. Let $X,X_1,X_2,\ldots,X_N$ be i.i.d. random variables. Let $Y=\sum_{i=1}^{N}X_i$. Then

$$
\mathbb{E}[Y]=\mathbb{E}[N]\mathbb{E}[X],
$$

$$
\operatorname{Var}(Y)=\mathbb{E}[N]\operatorname{Var}(X)+(\mathbb{E}[X])^2\operatorname{Var}(N).
$$

## Convergence of random variables

### Inequalities, convergence, and the Weak Law of Large Numbers

**Theorem (Markov inequality).** Given a random variable $X\geq 0$ and, for every $a>0$ we have

$$
\mathbb{P}(X\geq a)\leq \frac{\mathbb{E}[X]}{a}.
$$

**Theorem (Chebyshev inequality).** Given a random variable $X$ with $\mathbb{E}[X]=\mu$ and $\operatorname{Var}(X)=\sigma^2$, for every $c>0$ we have

$$
\mathbb{P}(|X-\mu|\geq c)\leq \frac{\sigma^2}{c^2}.
$$

**Theorem (Weak Law of Large Number (WLLN)).** Given a sequence of i.i.d. random variables $\{X_1,X_2,\ldots\}$ with $\mathbb{E}[X_i]=\mu$ and $\operatorname{Var}(X_i)=\sigma^2$, we define

$$
M_n=\frac{1}{n}\sum_{i=1}^{n}X_i,
$$

for every $\epsilon>0$ we have

$$
\lim_{n\to\infty}\mathbb{P}(|M_n-\mu|\geq \epsilon)=0.
$$

**Definition (Convergence in probability).** A sequence of random variables $\{Y_i\}$ converges in probability to the random variable $Y$ if

$$
\lim_{n\to\infty}\mathbb{P}(|Y_i-Y|\geq \epsilon)=0,
$$

for every $\epsilon>0$.

**Properties (Properties of convergence in probability).** If $X_n\to a$ and $Y_n\to b$ in probability, then

- $X_n+Y_n\to a+b$.
- If $g$ is a continuous function, then $g(X_n)\to g(a)$.
- $\mathbb{E}[X_n]$ does not always converge to $a$.

### The Central Limit Theorem

**Theorem (Central Limit Theorem (CLT)).** Given a sequence of independent random variables $\{X_1,X_2,\ldots\}$ with $\mathbb{E}[X_i]=\mu$ and $\operatorname{Var}(X_i)=\sigma^2$, we define

$$
Z_n=\frac{1}{\sigma\sqrt{n}}\sum_{i=1}^{n}(X_i-\mu).
$$

Then, for every $z$, we have

$$
\lim_{n\to\infty}\mathbb{P}(Z_n\leq z)=\mathbb{P}(Z\leq z),
$$

where $Z\sim \mathcal{N}(0,1)$.

**Corollary (Normal approximation of a binomial).** Let $X\sim \operatorname{Bin}(n,p)$ with $n$ large. Then $S_n$ can be approximated by $Z\sim \mathcal{N}(np,np(1-p))$.

**Remark (De Moivre-Laplace 1/2 approximation).** Let $X\sim \operatorname{Bin}$, then $\mathbb{P}(X=i)=\mathbb{P}\left(i-\frac{1}{2}\leq X\leq i+\frac{1}{2}\right)$ and we can use the CLT to approximate the PMF of $X$.


---

# Machine Learning — Super VIP Cheatsheet (Stanford CS 229)

*Afshine Amidi and Shervine Amidi*

## 1 Supervised Learning

### 1.1 Introduction to Supervised Learning

Given a set of data points $\{x^{(1)},\ldots,x^{(m)}\}$ associated to a set of outcomes $\{y^{(1)},\ldots,y^{(m)}\}$, we want to build a classifier that learns how to predict $y$ from $x$.

- **Type of prediction** — The different types of predictive models are summed up in the table below:

|  | Regression | Classifier |
|---|---|---|
| **Outcome** | Continuous | Class |
| **Examples** | Linear regression | Logistic regression, SVM, Naive Bayes |

- **Type of model** — The different models are summed up in the table below:

|  | Discriminative model | Generative model |
|---|---|---|
| **Goal** | Directly estimate $P(y\mid x)$ | Estimate $P(x\mid y)$ to deduce $P(y\mid x)$ |
| **What’s learned** | Decision boundary | Probability distributions of the data |
| **Illustration** | *A two-class scatter plot with blue and red points separated by a dashed linear decision boundary; illustrates learning a boundary directly.* | *A two-class scatter plot with blue and red probability-density contour regions; illustrates learning class-conditional distributions.* |
| **Examples** | Regressions, SVMs | GDA, Naive Bayes |

### 1.2 Notations and general concepts

- **Hypothesis** — The hypothesis is noted $h_\theta$ and is the model that we choose. For a given input data $x^{(i)}$, the model prediction output is $h_\theta(x^{(i)})$.

- **Loss function** — A loss function is a function $L:(z,y)\in\mathbb{R}\times Y\longmapsto L(z,y)\in\mathbb{R}$ that takes as inputs the predicted value $z$ corresponding to the real data value $y$ and outputs how different they are. The common loss functions are summed up in the table below:

| Least squared | Logistic | Hinge | Cross-entropy |
|---|---|---|---|
| $\frac{1}{2}(y-z)^2$ | $\log(1+\exp(-yz))$ | $\max(0,1-yz)$ | $-\left[y\log(z)+(1-y)\log(1-z)\right]$ |
| *U-shaped quadratic curve with minimum at $z=y\in\mathbb{R}$; illustrates squared error.* | *Two smooth logistic-loss curves for $y=-1$ and $y=1$ decreasing as the margin $yz$ grows; illustrates logistic loss.* | *Two piecewise-linear hinge-loss curves for $y=-1$ and $y=1$ with zero loss after margin 1; illustrates SVM hinge loss.* | *Two cross-entropy curves for binary labels $y=0$ and $y=1$ over prediction $z\in[0,1]$; illustrates penalty for confident wrong probabilities.* |
| Linear regression | Logistic regression | SVM | Neural Network |

- **Cost function** — The cost function $J$ is commonly used to assess the performance of a model, and is defined with the loss function $L$ as follows:

$$
J(\theta)=\sum_{i=1}^{m}L\left(h_\theta\left(x^{(i)}\right),y^{(i)}\right)
$$

- **Gradient descent** — By noting $\alpha\in\mathbb{R}$ the learning rate, the update rule for gradient descent is expressed with the learning rate and the cost function $J$ as follows:

$$
\theta \leftarrow \theta-\alpha\nabla J(\theta)
$$

*[Figure: Contour plot of a cost function with parameter point $\theta$ moving in the direction $-\alpha\nabla J(\theta)$ toward the center minimum; illustrates iterative gradient descent updates.]*

Remark: Stochastic gradient descent (SGD) is updating the parameter based on each training example, and batch gradient descent is on a batch of training examples.

- **Likelihood** — The likelihood of a model $L(\theta)$ given parameters $\theta$ is used to find the optimal parameters $\theta$ through maximizing the likelihood. In practice, we use the log-likelihood $\ell(\theta)=\log(L(\theta))$ which is easier to optimize. We have:

$$
\theta^{\mathrm{opt}}=\operatorname*{argmax}_{\theta} L(\theta)
$$

- **Newton’s algorithm** — The Newton’s algorithm is a numerical method that finds $\theta$ such that $\ell'(\theta)=0$. Its update rule is as follows:

$$
\theta \leftarrow \theta-\frac{\ell'(\theta)}{\ell''(\theta)}
$$

Remark: the multidimensional generalization, also known as the Newton-Raphson method, has the following update rule:

$$
\theta \leftarrow \theta-\left(\nabla_\theta^2\ell(\theta)\right)^{-1}\nabla_\theta\ell(\theta)
$$

### 1.3 Linear models

#### 1.3.1 Linear regression

We assume here that $y\mid x;\theta\sim\mathcal{N}(\mu,\sigma^2)$.

- **Normal equations** — By noting $X$ the matrix design, the value of $\theta$ that minimizes the cost function is a closed-form solution such that:

$$
\theta=(X^TX)^{-1}X^Ty
$$

- **LMS algorithm** — By noting $\alpha$ the learning rate, the update rule of the Least Mean Squares (LMS) algorithm for a training set of $m$ data points, which is also known as the Widrow-Hoff learning rule, is as follows:

$$
\forall j,\quad \theta_j\leftarrow\theta_j+\alpha\sum_{i=1}^{m}\left[y^{(i)}-h_\theta\left(x^{(i)}\right)\right]x_j^{(i)}
$$

Remark: the update rule is a particular case of the gradient ascent.

- **LWR** — Locally Weighted Regression, also known as LWR, is a variant of linear regression that weights each training example in its cost function by $w^{(i)}(x)$, which is defined with parameter $\tau\in\mathbb{R}$ as:

$$
w^{(i)}(x)=\exp\left(-\frac{\left(x^{(i)}-x\right)^2}{2\tau^2}\right)
$$

#### 1.3.2 Classification and logistic regression

- **Sigmoid function** — The sigmoid function $g$, also known as the logistic function, is defined as follows:

$$
\forall z\in\mathbb{R},\quad g(z)=\frac{1}{1+e^{-z}}\in]0,1[
$$

- **Logistic regression** — We assume here that $y\mid x;\theta\sim\operatorname{Bernoulli}(\phi)$. We have the following form:

$$
\phi=p(y=1\mid x;\theta)=\frac{1}{1+\exp(-\theta^Tx)}=g(\theta^Tx)
$$

Remark: there is no closed form solution for the case of logistic regressions.

- **Softmax regression** — A softmax regression, also called a multiclass logistic regression, is used to generalize logistic regression when there are more than 2 outcome classes. By convention, we set $\theta_K=0$, which makes the Bernoulli parameter $\phi_i$ of each class $i$ equal to:

$$
\phi_i=\frac{\exp(\theta_i^Tx)}{\sum_{j=1}^{K}\exp(\theta_j^Tx)}
$$

#### 1.3.3 Generalized Linear Models

- **Exponential family** — A class of distributions is said to be in the exponential family if it can be written in terms of a natural parameter, also called the canonical parameter or link function, $\eta$, a sufficient statistic $T(y)$ and a log-partition function $a(\eta)$ as follows:

$$
p(y;\eta)=b(y)\exp(\eta T(y)-a(\eta))
$$

Remark: we will often have $T(y)=y$. Also, $\exp(-a(\eta))$ can be seen as a normalization parameter that will make sure that the probabilities sum to one.

Here are the most common exponential distributions summed up in the following table:

| Distribution | $\eta$ | $T(y)$ | $a(\eta)$ | $b(y)$ |
|---|---|---|---|---|
| Bernoulli | $\log\left(\frac{\phi}{1-\phi}\right)$ | $y$ | $\log(1+\exp(\eta))$ | $1$ |
| Gaussian | $\mu$ | $y$ | $\frac{\eta^2}{2}$ | $\frac{1}{\sqrt{2\pi}}\exp\left(-\frac{y^2}{2}\right)$ |
| Poisson | $\log(\lambda)$ | $y$ | $e^\eta$ | $\frac{1}{y!}$ |
| Geometric | $\log(1-\phi)$ | $y$ | $\log\left(\frac{e^\eta}{1-e^\eta}\right)$ | $1$ |

- **Assumptions of GLMs** — Generalized Linear Models (GLM) aim at predicting a random variable $y$ as a function of $x\in\mathbb{R}^{n+1}$ and rely on the following 3 assumptions:

$$
(1)\quad y\mid x;\theta\sim\operatorname{ExpFamily}(\eta)
$$

$$
(2)\quad h_\theta(x)=\mathbb{E}[y\mid x;\theta]
$$

$$
(3)\quad \eta=\theta^Tx
$$

Remark: ordinary least squares and logistic regression are special cases of generalized linear models.

### 1.4 Support Vector Machines

The goal of support vector machines is to find the line that maximizes the minimum distance to the line.

- **Optimal margin classifier** — The optimal margin classifier $h$ is such that:

$$
h(x)=\operatorname{sign}(w^Tx-b)
$$

where $(w,b)\in\mathbb{R}^n\times\mathbb{R}$ is the solution of the following optimization problem:

$$
\min \frac{1}{2}\|w\|^2\quad\text{such that}\quad y^{(i)}(w^Tx^{(i)}-b)\geq 1
$$

*[Figure: SVM scatter plot with blue and red points separated by the line $w^Tx-b=0$, parallel margin lines $w^Tx-b=1$ and $w^Tx-b=-1$, circled support vectors on the margins, margin width $2/\|w\|$, and arrows labeling support vectors; illustrates maximum-margin classification.]*

Remark: the line is defined as $w^Tx-b=0$.

- **Hinge loss** — The hinge loss is used in the setting of SVMs and is defined as follows:

$$
L(z,y)=[1-yz]_+=\max(0,1-yz)
$$

- **Kernel** — Given a feature mapping $\phi$, we define the kernel $K$ to be defined as:

$$
K(x,z)=\phi(x)^T\phi(z)
$$

In practice, the kernel $K$ defined by $K(x,z)=\exp\left(-\frac{\|x-z\|^2}{2\sigma^2}\right)$ is called the Gaussian kernel and is commonly used.

*[Figure: Three-panel SVM kernel illustration: a non-linearly separable ring-shaped data set, its separation after use of a kernel mapping $\phi$, and the resulting circular decision boundary in the original space; illustrates the kernel trick.]*

Remark: we say that we use the “kernel trick” to compute the cost function using the kernel because we actually don’t need to know the explicit mapping $\phi$, which is often very complicated. Instead, only the values $K(x,z)$ are needed.

- **Lagrangian** — We define the Lagrangian $\mathcal{L}(w,b)$ as follows:

$$
\mathcal{L}(w,b)=f(w)+\sum_{i=1}^{l}\beta_i h_i(w)
$$

Remark: the coefficients $\beta_i$ are called the Lagrange multipliers.

### 1.5 Generative Learning

A generative model first tries to learn how the data is generated by estimating $P(x\mid y)$, which we can then use to estimate $P(y\mid x)$ by using Bayes’ rule.

#### 1.5.1 Gaussian Discriminant Analysis

- **Setting** — The Gaussian Discriminant Analysis assumes that $y$ and $x\mid y=0$ and $x\mid y=1$ are such that:

$$
y\sim\operatorname{Bernoulli}(\phi)
$$

$$
x\mid y=0\sim\mathcal{N}(\mu_0,\Sigma)\quad\text{and}\quad x\mid y=1\sim\mathcal{N}(\mu_1,\Sigma)
$$

- **Estimation** — The following table sums up the estimates that we find when maximizing the likelihood:

| $\widehat{\phi}$ | $\widehat{\mu}_j\quad(j=0,1)$ | $\widehat{\Sigma}$ |
|---|---|---|
| $\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{\{y^{(i)}=1\}}$ | $\frac{\sum_{i=1}^{m}\mathbf{1}_{\{y^{(i)}=j\}}x^{(i)}}{\sum_{i=1}^{m}\mathbf{1}_{\{y^{(i)}=j\}}}$ | $\frac{1}{m}\sum_{i=1}^{m}\left(x^{(i)}-\mu_{y^{(i)}}\right)\left(x^{(i)}-\mu_{y^{(i)}}\right)^T$ |

#### 1.5.2 Naive Bayes

- **Assumption** — The Naive Bayes model supposes that the features of each data point are all independent:

$$
P(x\mid y)=P(x_1,x_2,\ldots\mid y)=P(x_1\mid y)P(x_2\mid y)\ldots=\prod_{i=1}^{n}P(x_i\mid y)
$$

- **Solutions** — Maximizing the log-likelihood gives the following solutions, with $k\in\{0,1\}$, $l\in[\![1,L]\!]$:

$$
P(y=k)=\frac{1}{m}\times \#\{j\mid y^{(j)}=k\}\quad\text{and}\quad P(x_i=l\mid y=k)=\frac{\#\{j\mid y^{(j)}=k\text{ and }x_i^{(j)}=l\}}{\#\{j\mid y^{(j)}=k\}}
$$

Remark: Naive Bayes is widely used for text classification and spam detection.

### 1.6 Tree-based and ensemble methods

These methods can be used for both regression and classification problems.

- **CART** — Classification and Regression Trees (CART), commonly known as decision trees, can be represented as binary trees. They have the advantage to be very interpretable.

- **Random forest** — It is a tree-based technique that uses a high number of decision trees built out of randomly selected sets of features. Contrary to the simple decision tree, it is highly uninterpretable but its generally good performance makes it a popular algorithm.

Remark: random forests are a type of ensemble methods.

- **Boosting** — The idea of boosting methods is to combine several weak learners to form a stronger one. The main ones are summed up in the table below:

| Adaptive boosting | Gradient boosting |
|---|---|
| - High weights are put on errors to improve at the next boosting step<br>- Known as Adaboost | - Weak learners trained on remaining errors |

### 1.7 Other non-parametric approaches

- **$k$-nearest neighbors** — The $k$-nearest neighbors algorithm, commonly known as $k$-NN, is a non-parametric approach where the response of a data point is determined by the nature of its $k$ neighbors from the training set. It can be used in both classification and regression settings.

Remark: The higher the parameter $k$, the higher the bias, and the lower the parameter $k$, the higher the variance.

*[Figure: Three $k$-nearest-neighbors classification panels with blue and red points and colored decision regions for $k=1$, $k=3$, and $k=11$; illustrates increasingly smoother decision boundaries as $k$ increases.]*

### 1.8 Learning Theory

- **Union bound** — Let $A_1,\ldots,A_k$ be $k$ events. We have:

$$
P(A_1\cup\ldots\cup A_k)\leq P(A_1)+\ldots+P(A_k)
$$

*[Figure: Venn-style event illustration showing overlapping sets $A_1\cup A_2\cup A_3$ and separate shaded sets labeled $A_1$, $A_2$, and $A_3$; illustrates that the probability of a union is upper bounded by the sum of individual probabilities.]*

- **Hoeffding inequality** — Let $Z_1,\ldots,Z_m$ be $m$ iid variables drawn from a Bernoulli distribution of parameter $\phi$. Let $\widehat{\phi}$ be their sample mean and $\gamma>0$ fixed. We have:

$$
P\left(|\phi-\widehat{\phi}|>\gamma\right)\leq 2\exp(-2\gamma^2m)
$$

Remark: this inequality is also known as the Chernoff bound.

- **Training error** — For a given classifier $h$, we define the training error $\widehat{\epsilon}(h)$, also known as the empirical risk or empirical error, to be as follows:

$$
\widehat{\epsilon}(h)=\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}
$$

- **Probably Approximately Correct (PAC)** — PAC is a framework under which numerous results on learning theory were proved, and has the following set of assumptions:

  - the training and testing sets follow the same distribution
  - the training examples are drawn independently

- **Shattering** — Given a set $S=\{x^{(1)},\ldots,x^{(d)}\}$, and a set of classifiers $\mathcal{H}$, we say that $\mathcal{H}$ shatters $S$ if for any set of labels $\{y^{(1)},\ldots,y^{(d)}\}$, we have:

$$
\exists h\in\mathcal{H},\quad \forall i\in[\![1,d]\!],\quad h(x^{(i)})=y^{(i)}
$$

- **Upper bound theorem** — Let $\mathcal{H}$ be a finite hypothesis class such that $|\mathcal{H}|=k$ and let $\delta$ and the sample size $m$ be fixed. Then, with probability of at least $1-\delta$, we have:

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+2\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}
$$

- **VC dimension** — The Vapnik-Chervonenkis (VC) dimension of a given infinite hypothesis class $\mathcal{H}$, noted $\mathrm{VC}(\mathcal{H})$ is the size of the largest set that is shattered by $\mathcal{H}$.

Remark: the VC dimension of $\mathcal{H}=\{$set of linear classifiers in 2 dimensions$\}$ is 3.

*[Figure: Sequence of small two-dimensional point configurations with blue and red labels separated by lines, demonstrating that linear classifiers in two dimensions can shatter three points but not all labelings of four points; illustrates VC dimension.]*

- **Theorem (Vapnik)** — Let $\mathcal{H}$ be given, with $\mathrm{VC}(\mathcal{H})=d$ and $m$ the number of training examples. With probability at least $1-\delta$, we have:

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+O\left(\sqrt{\frac{d}{m}\log\left(\frac{m}{d}\right)+\frac{1}{m}\log\left(\frac{1}{\delta}\right)}\right)
$$

## 2 Unsupervised Learning

### 2.1 Introduction to Unsupervised Learning

- **Motivation** — The goal of unsupervised learning is to find hidden patterns in unlabeled data $\{x^{(1)},\ldots,x^{(m)}\}$.

- **Jensen’s inequality** — Let $f$ be a convex function and $X$ a random variable. We have the following inequality:

$$
\mathbb{E}[f(X)]\geq f(\mathbb{E}[X])
$$

### 2.2 Clustering

#### 2.2.1 Expectation-Maximization

- **Latent variables** — Latent variables are hidden/unobserved variables that make estimation problems difficult, and are often denoted $z$. Here are the most common settings where there are latent variables:

| Setting | Latent variable $z$ | $x\mid z$ | Comments |
|---|---|---|---|
| Mixture of $k$ Gaussians | $\operatorname{Multinomial}(\phi)$ | $\mathcal{N}(\mu_j,\Sigma_j)$ | $\mu_j\in\mathbb{R}^n,\ \phi\in\mathbb{R}^k$ |
| Factor analysis | $\mathcal{N}(0,I)$ | $\mathcal{N}(\mu+\Lambda z,\psi)$ | $\mu_j\in\mathbb{R}^n$ |

- **Algorithm** — The Expectation-Maximization (EM) algorithm gives an efficient method at estimating the parameter $\theta$ through maximum likelihood estimation by repeatedly constructing a lower-bound on the likelihood (E-step) and optimizing that lower bound (M-step) as follows:

  - E-step: Evaluate the posterior probability $Q_i(z^{(i)})$ that each data point $x^{(i)}$ came from a particular cluster $z^{(i)}$ as follows:

$$
Q_i(z^{(i)})=P(z^{(i)}\mid x^{(i)};\theta)
$$

  - M-step: Use the posterior probabilities $Q_i(z^{(i)})$ as cluster specific weights on data points $x^{(i)}$ to separately re-estimate each cluster model as follows:

$$
\theta_i=\operatorname*{argmax}_{\theta}\sum_i\int_{z^{(i)}}Q_i(z^{(i)})\log\left(\frac{P(x^{(i)},z^{(i)};\theta)}{Q_i(z^{(i)})}\right)dz^{(i)}
$$

*[Figure: Expectation-Maximization diagram showing Gaussian initialization with three colored Gaussian clusters, an expectation step assigning soft cluster regions, a maximization step updating Gaussian contours and centers, and convergence; illustrates alternating E-step and M-step refinement.]*

#### 2.2.2 $k$-means clustering

We note $c^{(i)}$ the cluster of data point $i$ and $\mu_j$ the center of cluster $j$.

- **Algorithm** — After randomly initializing the cluster centroids $\mu_1,\mu_2,\ldots,\mu_k\in\mathbb{R}^n$, the $k$-means algorithm repeats the following step until convergence:

$$
c^{(i)}=\operatorname*{argmin}_{j}\left\|x^{(i)}-\mu_j\right\|^2\quad\text{and}\quad \mu_j=\frac{\sum_{i=1}^{m}\mathbf{1}_{\{c^{(i)}=j\}}x^{(i)}}{\sum_{i=1}^{m}\mathbf{1}_{\{c^{(i)}=j\}}}
$$

*[Figure: $k$-means diagram with means initialization, cluster assignment Voronoi regions, means update, and convergence for three clusters; illustrates iterative assignment and centroid update until stable clusters.]*

- **Distortion function** — In order to see if the algorithm converges, we look at the distortion function defined as follows:

$$
J(c,\mu)=\sum_{i=1}^{m}\left\|x^{(i)}-\mu_{c^{(i)}}\right\|^2
$$

#### 2.2.3 Hierarchical clustering

- **Algorithm** — It is a clustering algorithm with an agglomerative hierarchical approach that build nested clusters in a successive manner.

- **Types** — There are different sorts of hierarchical clustering algorithms that aims at optimizing different objective functions, which is summed up in the table below:

| Ward linkage | Average linkage | Complete linkage |
|---|---|---|
| Minimize within cluster distance | Minimize average distance between cluster pairs | Minimize maximum distance of between cluster pairs |

#### 2.2.4 Clustering assessment metrics

In an unsupervised learning setting, it is often hard to assess the performance of a model since we don’t have the ground truth labels as was the case in the supervised learning setting.

- **Silhouette coefficient** — By noting $a$ and $b$ the mean distance between a sample and all other points in the same class, and between a sample and all other points in the next nearest cluster, the silhouette coefficient $s$ for a single sample is defined as follows:

$$
s=\frac{b-a}{\max(a,b)}
$$


- **Calinski-Harabasz index** — By noting $k$ the number of clusters, $B_k$ and $W_k$ the between and within-clustering dispersion matrices respectively defined as

$$
B_k = \sum_{j=1}^{k} n_{c^{(i)}}(\mu_{c^{(i)}}-\mu)(\mu_{c^{(i)}}-\mu)^T, \qquad W_k = \sum_{i=1}^{m}(x^{(i)}-\mu_{c^{(i)}})(x^{(i)}-\mu_{c^{(i)}})^T
$$

the Calinski-Harabasz index $s(k)$ indicates how well a clustering model defines its clusters, such that the higher the score, the more dense and well separated the clusters are. It is defined as follows:

$$
s(k) = \frac{\operatorname{Tr}(B_k)}{\operatorname{Tr}(W_k)} \times \frac{N-k}{k-1}
$$

### 2.3 Dimension reduction

#### 2.3.1 Principal component analysis

It is a dimension reduction technique that finds the variance maximizing directions onto which to project the data.

- **Eigenvalue, eigenvector** — Given a matrix $A \in \mathbb{R}^{n \times n}$, $\lambda$ is said to be an eigenvalue of $A$ if there exists a vector $z \in \mathbb{R}^n \backslash \{0\}$, called eigenvector, such that we have:

$$
Az = \lambda z
$$

- **Spectral theorem** — Let $A \in \mathbb{R}^{n \times n}$. If $A$ is symmetric, then $A$ is diagonalizable by a real orthogonal matrix $U \in \mathbb{R}^{n \times n}$. By noting $\Lambda = \operatorname{diag}(\lambda_1,...,\lambda_n)$, we have:

$$
\exists \Lambda \text{ diagonal,} \qquad A = U\Lambda U^T
$$

*Remark: the eigenvector associated with the largest eigenvalue is called principal eigenvector of matrix $A$.*

- **Algorithm** — The Principal Component Analysis (PCA) procedure is a dimension reduction technique that projects the data on $k$ dimensions by maximizing the variance of the data as follows:

  - Step 1: Normalize the data to have a mean of 0 and standard deviation of 1.

$$
x_j^{(i)} \leftarrow \frac{x_j^{(i)}-\mu_j}{\sigma_j} \qquad \text{where} \qquad \mu_j = \frac{1}{m}\sum_{i=1}^{m}x_j^{(i)} \qquad \text{and} \qquad \sigma_j^2 = \frac{1}{m}\sum_{i=1}^{m}(x_j^{(i)}-\mu_j)^2
$$

  - Step 2: Compute $\Sigma = \frac{1}{m}\sum_{i=1}^{m}x^{(i)}x^{(i)T} \in \mathbb{R}^{n \times n}$, which is symmetric with real eigenvalues.
  - Step 3: Compute $u_1,...,u_k \in \mathbb{R}^n$ the $k$ orthogonal principal eigenvectors of $\Sigma$, i.e. the orthogonal eigenvectors of the $k$ largest eigenvalues.
  - Step 4: Project the data on $\operatorname{span}_\mathbb{R}(u_1,...,u_k)$. This procedure maximizes the variance among all $k$-dimensional spaces.

*[Figure: Three-panel PCA illustration. The first panel shows scattered data in feature space with axes $X_1$ and $X_2$; the second shows the same cloud with two candidate principal component directions drawn through it; the third shows the data represented in principal-components space with orthogonal axes $PC_1$ and $PC_2$, demonstrating projection onto directions of maximum variance.]*

#### 2.3.2 Independent component analysis

It is a technique meant to find the underlying generating sources.

- **Assumptions** — We assume that our data $x$ has been generated by the $n$-dimensional source vector $s = (s_1,...,s_n)$, where $s_i$ are independent random variables, via a mixing and non-singular matrix $A$ as follows:

$$
x = As
$$

The goal is to find the unmixing matrix $W = A^{-1}$ by an update rule.

- **Bell and Sejnowski ICA algorithm** — This algorithm finds the unmixing matrix $W$ by following the steps below:

  - Write the probability of $x = As = W^{-1}s$ as:

$$
p(x) = \prod_{i=1}^{n} p_s(w_i^T x) \cdot |W|
$$

  - Write the log likelihood given our training data $\{x^{(i)}, i \in \llbracket 1,m \rrbracket\}$ and by noting $g$ the sigmoid function as:

$$
l(W) = \sum_{i=1}^{m}\left(\sum_{j=1}^{n}\log\left(g'(w_j^T x^{(i)})\right)+\log |W|\right)
$$

Therefore, the stochastic gradient ascent learning rule is such that for each training example $x^{(i)}$, we update $W$ as follows:

$$
W \leftarrow W + \alpha\left(\left(\begin{bmatrix}1-2g(w_1^T x^{(i)})\\1-2g(w_2^T x^{(i)})\\\vdots\\1-2g(w_n^T x^{(i)})\end{bmatrix}\right)x^{(i)T} + (W^T)^{-1}\right)
$$

## 3 Deep Learning

### 3.1 Neural Networks

Neural networks are a class of models that are built with layers. Commonly used types of neural networks include convolutional and recurrent neural networks.

- **Architecture** — The vocabulary around neural networks architectures is described in the figure below:

*[Figure: Feed-forward neural network architecture diagram. Green input-layer units connect densely to blue hidden layer 1 units, then through additional hidden layers up to hidden layer $k$, and finally to red output-layer units; labels identify input layer, hidden layer 1, hidden layer $k$, and output layer.]*

By noting $i$ the $i^{th}$ layer of the network and $j$ the $j^{th}$ hidden unit of the layer, we have:

$$
z_j^{[i]} = w_j^{[i]T}x + b_j^{[i]}
$$

where we note $w$, $b$, $z$ the weight, bias and output respectively.

- **Activation function** — Activation functions are used at the end of a hidden unit to introduce non-linear complexities to the model. Here are the most common ones:

| Sigmoid | Tanh | ReLU | Leaky ReLU |
|---|---|---|---|
| $g(z)=\frac{1}{1+e^{-z}}$ | $g(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}$ | $g(z)=\max(0,z)$ | $g(z)=\max(\epsilon z,z)$ with $\epsilon \ll 1$ |
| *Sigmoid curve rising from near 0 to near 1, crossing $g(0)=\frac{1}{2}$, with $x$-axis labels about $-4,0,4$ and $y$ label 1.* | *Tanh S-curve rising from $-1$ to 1, crossing the origin, with $x$-axis labels about $-4,0,4$.* | *ReLU graph flat at 0 for negative inputs and increasing linearly for positive inputs, with axis label 1.* | *Leaky ReLU graph with small positive slope for negative inputs and slope 1 for positive inputs, with axis label 1.* |

- **Cross-entropy loss** — In the context of neural networks, the cross-entropy loss $L(z,y)$ is commonly used and is defined as follows:

$$
L(z,y) = -\left[y\log(z) + (1-y)\log(1-z)\right]
$$

- **Learning rate** — The learning rate, often noted $\eta$, indicates at which pace the weights get updated. This can be fixed or adaptively changed. The current most popular method is called Adam, which is a method that adapts the learning rate.

- **Backpropagation** — Backpropagation is a method to update the weights in the neural network by taking into account the actual output and the desired output. The derivative with respect to weight $w$ is computed using chain rule and is of the following form:

$$
\frac{\partial L(z,y)}{\partial w} = \frac{\partial L(z,y)}{\partial a} \times \frac{\partial a}{\partial z} \times \frac{\partial z}{\partial w}
$$

As a result, the weight is updated as follows:

$$
w \leftarrow w - \eta\frac{\partial L(z,y)}{\partial w}
$$

- **Updating weights** — In a neural network, weights are updated as follows:

  - Step 1: Take a batch of training data.
  - Step 2: Perform forward propagation to obtain the corresponding loss.
  - Step 3: Backpropagate the loss to get the gradients.
  - Step 4: Use the gradients to update the weights of the network.

- **Dropout** — Dropout is a technique meant at preventing overfitting the training data by dropping out units in a neural network. In practice, neurons are either dropped with probability $p$ or kept with probability $1-p$.

### 3.2 Convolutional Neural Networks

- **Convolutional layer requirement** — By noting $W$ the input volume size, $F$ the size of the convolutional layer neurons, $P$ the amount of zero padding, then the number of neurons $N$ that fit in a given volume is such that:

$$
N = \frac{W-F+2P}{S}+1
$$

- **Batch normalization** — It is a step of hyperparameter $\gamma,\beta$ that normalizes the batch $\{x_i\}$. By noting $\mu_B,\sigma_B^2$ the mean and variance of that we want to correct to the batch, it is done as follows:

$$
x_i \leftarrow \gamma\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}+\beta
$$

It is usually done after a fully connected/convolutional layer and before a non-linearity layer and aims at allowing higher learning rates and reducing the strong dependence on initialization.

### 3.3 Recurrent Neural Networks

- **Types of gates** — Here are the different types of gates that we encounter in a typical recurrent neural network:

| Input gate | Forget gate | Output gate | Gate |
|---|---|---|---|
| Write to cell or not? | Erase a cell or not? | Reveal a cell or not? | How much writing? |

- **LSTM** — A long short-term memory (LSTM) network is a type of RNN model that avoids the vanishing gradient problem by adding ’forget’ gates.

### 3.4 Reinforcement Learning and Control

The goal of reinforcement learning is for an agent to learn how to evolve in an environment.

- **Markov decision processes** — A Markov decision process (MDP) is a 5-tuple $(S,A,\{P_{sa}\},\gamma,R)$ where:

  - $S$ is the set of states
  - $A$ is the set of actions
  - $\{P_{sa}\}$ are the state transition probabilities for $s \in S$ and $a \in A$
  - $\gamma \in [0,1[$ is the discount factor
  - $R:S \times A \longrightarrow \mathbb{R}$ or $R:S \longrightarrow \mathbb{R}$ is the reward function that the algorithm wants to maximize

- **Policy** — A policy $\pi$ is a function $\pi:S \longrightarrow A$ that maps states to actions.

*Remark: we say that we execute a given policy $\pi$ if given a state $s$ we take the action $a=\pi(s)$.*

- **Value function** — For a given policy $\pi$ and a given state $s$, we define the value function $V^\pi$ as follows:

$$
V^\pi(s) = E\left[R(s_0)+\gamma R(s_1)+\gamma^2R(s_2)+...\mid s_0=s,\pi\right]
$$

- **Bellman equation** — The optimal Bellman equations characterizes the value function $V^{\pi^*}$ of the optimal policy $\pi^*$:

$$
V^{\pi^*}(s)=R(s)+\max_{a \in A}\gamma\sum_{s' \in S}P_{sa}(s')V^{\pi^*}(s')
$$

*Remark: we note that the optimal policy $\pi^*$ for a given state $s$ is such that:*

$$
\pi^*(s)=\operatorname*{argmax}_{a \in A}\sum_{s' \in S}P_{sa}(s')V^*(s')
$$

- **Value iteration algorithm** — The value iteration algorithm is in two steps:

  - We initialize the value:

$$
V_0(s)=0
$$

  - We iterate the value based on the values before:

$$
V_{i+1}(s)=R(s)+\max_{a \in A}\left[\sum_{s' \in S}\gamma P_{sa}(s')V_i(s')\right]
$$

- **Maximum likelihood estimate** — The maximum likelihood estimates for the state transition probabilities are as follows:

$$
P_{sa}(s') = \frac{\#\text{times took action }a\text{ in state }s\text{ and got to }s'}{\#\text{times took action }a\text{ in state }s}
$$

- **Q-learning** — $Q$-learning is a model-free estimation of $Q$, which is done as follows:

$$
Q(s,a) \leftarrow Q(s,a)+\alpha\left[R(s,a,s')+\gamma\max_{a'}Q(s',a')-Q(s,a)\right]
$$

## 4 Machine Learning Tips and Tricks

### 4.1 Metrics

Given a set of data points $\{x^{(1)},...,x^{(m)}\}$, where each $x^{(i)}$ has $n$ features, associated to a set of outcomes $\{y^{(1)},...,y^{(m)}\}$, we want to assess a given classifier that learns how to predict $y$ from $x$.

#### 4.1.1 Classification

In a context of a binary classification, here are the main metrics that are important to track to assess the performance of the model.

- **Confusion matrix** — The confusion matrix is used to have a more complete picture when assessing the performance of a model. It is defined as follows:

*[Figure: Confusion matrix for binary classification. Columns are predicted class $+$ and $-$, rows are actual class $+$ and $-$; cells show TP True Positives in green, FN False Negatives Type II error in red, FP False Positives Type I error in red, and TN True Negatives in green.]*

- **Main metrics** — The following metrics are commonly used to assess the performance of classification models:

| Metric | Formula | Interpretation |
|---|---|---|
| Accuracy | $\frac{\textrm{TP}+\textrm{TN}}{\textrm{TP}+\textrm{TN}+\textrm{FP}+\textrm{FN}}$ | Overall performance of model |
| Precision | $\frac{\textrm{TP}}{\textrm{TP}+\textrm{FP}}$ | How accurate the positive predictions are |
| Recall Sensitivity | $\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}$ | Coverage of actual positive sample |
| Specificity | $\frac{\textrm{TN}}{\textrm{TN}+\textrm{FP}}$ | Coverage of actual negative sample |
| F1 score | $\frac{2\textrm{TP}}{2\textrm{TP}+\textrm{FP}+\textrm{FN}}$ | Hybrid metric useful for unbalanced classes |

- **ROC** — The receiver operating curve, also noted ROC, is the plot of TPR versus FPR by varying the threshold. These metrics are are summed up in the table below:

| Metric | Formula | Equivalent |
|---|---|---|
| True Positive Rate TPR | $\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}$ | Recall, sensitivity |
| False Positive Rate FPR | $\frac{\textrm{FP}}{\textrm{TN}+\textrm{FP}}$ | 1-specificity |

- **AUC** — The area under the receiving operating curve, also noted AUC or AUROC, is the area below the ROC as shown in the following figure:

*[Figure: AUC and ROC illustration. Left plot has TPR on the vertical axis and FPR on the horizontal axis, both from 0 to 1, with a curved ROC boundary and shaded blue AUC region under it; right plot shows overlapping red Actual negative and green Actual positive score distributions separated by a vertical threshold, with bottom arrows for Predicted negative and Predicted positive regions.]*

#### 4.1.2 Regression

- **Basic metrics** — Given a regression model $f$, the following metrics are commonly used to assess the performance of the model:

| Total sum of squares | Explained sum of squares | Residual sum of squares |
|---|---|---|
| $\textrm{SS}_{\textrm{tot}}=\sum_{i=1}^{m}(y_i-\overline{y})^2$ | $\textrm{SS}_{\textrm{reg}}=\sum_{i=1}^{m}(f(x_i)-\overline{y})^2$ | $\textrm{SS}_{\textrm{res}}=\sum_{i=1}^{m}(y_i-f(x_i))^2$ |

- **Coefficient of determination** — The coefficient of determination, often noted $R^2$ or $r^2$, provides a measure of how well the observed outcomes are replicated by the model and is defined as follows:

$$
R^2 = 1 - \frac{\textrm{SS}_{\textrm{res}}}{\textrm{SS}_{\textrm{tot}}}
$$

- **Main metrics** — The following metrics are commonly used to assess the performance of regression models, by taking into account the number of variables $n$ that they take into consideration:

| Mallow’s Cp | AIC | BIC | Adjusted $R^2$ |
|---|---|---|---|
| $\frac{\textrm{SS}_{\textrm{res}}+2(n+1)\widehat{\sigma}^2}{m}$ | $2\left[(n+2)-\log(L)\right]$ | $\log(m)(n+2)-2\log(L)$ | $1-\frac{(1-R^2)(m-1)}{m-n-1}$ |

where $L$ is the likelihood and $\widehat{\sigma}^2$ is an estimate of the variance associated with each response.

### 4.2 Model selection

- **Vocabulary** — When selecting a model, we distinguish 3 different parts of the data that we have as follows:

| Training set | Validation set | Testing set |
|---|---|---|
| - Model is trained<br>- Usually 80% of the dataset | - Model is assessed<br>- Usually 20% of the dataset<br>- Also called hold-out or development set | - Model gives predictions<br>- Unseen data |

Once the model has been chosen, it is trained on the entire dataset and tested on the unseen test set. These are represented in the figure below:

*[Figure: Dataset split diagram. A horizontal bar labeled Dataset is divided into a large red Train segment and a smaller green Validation segment; a separate blue bar labeled Unseen data is labeled Test, emphasizing that the final test set is held out.]*

- **Cross-validation** — Cross-validation, also noted CV, is a method that is used to select a model that does not rely too much on the initial training set. The different types are summed up in the table below:

| $k$-fold | Leave-$p$-out |
|---|---|
| - Training on $k-1$ folds and assessment on the remaining one<br>- Generally $k=5$ or $10$ | - Training on $n-p$ observations and assessment on the $p$ remaining ones<br>- Case $p=1$ is called leave-one-out |

The most commonly used method is called $k$-fold cross-validation and splits the training data into $k$ folds to validate the model on one fold while training the model on the $k-1$ other folds, all of this $k$ times. The error is then averaged over the $k$ folds and is named cross-validation error.

*[Figure: $k$-fold cross-validation schematic. Rows labeled fold 1, 2, ..., $k$ show a long dataset bar where the green validation block moves across the red training data; validation errors are $\epsilon_1, \epsilon_2, ..., \epsilon_k$, and the cross-validation error is $(\epsilon_1+...+\epsilon_k)/k$.]*

- **Regularization** — The regularization procedure aims at avoiding the model to overfit the data and thus deals with high variance issues. The following table sums up the different types of commonly used regularization techniques:

| LASSO | Ridge | Elastic Net |
|---|---|---|
| - Shrinks coefficients to 0<br>- Good for variable selection | Makes coefficients smaller | Tradeoff between variable selection and small coefficients |
| *Constraint geometry shows red elliptical loss contours touching a blue diamond $\|\theta\|_1 \leq 1$, with solution $\theta^*$ on an axis.* | *Constraint geometry shows red elliptical loss contours touching a blue circle $\|\theta\|_2 \leq 1$, with solution $\theta^*$ on the boundary.* | *Constraint geometry shows red elliptical loss contours touching a blue intermediate elastic-net ball labeled $(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2 \leq 1$, with solution $\theta^*$.* |
| $... + \lambda\|\theta\|_1$<br>$\lambda \in \mathbb{R}$ | $... + \lambda\|\theta\|_2^2$<br>$\lambda \in \mathbb{R}$ | $... + \lambda\left[(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2\right]$<br>$\lambda \in \mathbb{R},\quad \alpha \in [0,1]$ |

- **Model selection** — Train model on training set, then evaluate on the development set, then pick best performance model on the development set, and retrain all of that model on the whole training set.

### 4.3 Diagnostics

- **Bias** — The bias of a model is the difference between the expected prediction and the correct model that we try to predict for given data points.

- **Variance** — The variance of a model is the variability of the model prediction for given data points.

- **Bias/variance tradeoff** — The simpler the model, the higher the bias, and the more complex the model, the higher the variance.

|  | Underfitting | Just right | Overfitting |
|---|---|---|---|
| Symptoms | - High training error<br>- Training error close to test error<br>- High bias | - Training error slightly lower than test error | - Low training error<br>- Training error much lower than test error<br>- High variance |
| Regression | *Scatterplot with U-shaped data and an underfit straight decreasing line, illustrating high bias.* | *Scatterplot with U-shaped data and a smooth quadratic curve fitting the trend well.* | *Scatterplot with U-shaped data and an overly wiggly curve passing through noise, illustrating high variance.* |


|  |  |  |  |
|---|---|---|---|
| Classification | *[Figure: Classification plot with blue and red points separated by an overly simple straight decision boundary, illustrating underfitting/high bias.]* | *[Figure: Classification plot with blue and red points separated by a smooth curved decision boundary, illustrating an appropriate fit.]* | *[Figure: Classification plot with blue and red points separated by a highly jagged decision boundary that follows individual points, illustrating overfitting/high variance.]* |
| Deep learning | *[Figure: Error-versus-epochs plot where training and validation curves both decrease and level off close together, indicating that training longer and increasing complexity may help.]* | *[Figure: Error-versus-epochs plot where training and validation curves both decrease, with validation error higher than training error but still improving, indicating a reasonable training process.]* | *[Figure: Error-versus-epochs plot where training error keeps decreasing while validation error levels off much higher, indicating overfitting and the need for regularization or more data.]* |
| Remedies | - Complexify model<br>- Add more features<br>- Train longer |  | - Regularize<br>- Get more data |

- **Error analysis** — Error analysis is analyzing the root cause of the difference in performance between the current and the perfect models.

- **Ablative analysis** — Ablative analysis is analyzing the root cause of the difference in performance between the current and the baseline models.

## 5 Refreshers

### 5.1 Probabilities and Statistics

#### 5.1.1 Introduction to Probability and Combinatorics

- **Sample space** — The set of all possible outcomes of an experiment is known as the sample space of the experiment and is denoted by $S$.

- **Event** — Any subset $E$ of the sample space is known as an event. That is, an event is a set consisting of possible outcomes of the experiment. If the outcome of the experiment is contained in $E$, then we say that $E$ has occurred.

- **Axioms of probability** — For each event $E$, we denote $P(E)$ as the probability of event $E$ occurring. By noting $E_1,...,E_n$ mutually exclusive events, we have the 3 following axioms:

$$
(1)\quad 0 \leq P(E) \leq 1 \qquad (2)\quad P(S)=1 \qquad (3)\quad P\left(\bigcup_{i=1}^n E_i\right)=\sum_{i=1}^n P(E_i)
$$

- **Permutation** — A permutation is an arrangement of $r$ objects from a pool of $n$ objects, in a given order. The number of such arrangements is given by $P(n,r)$, defined as:

$$
P(n,r)=\frac{n!}{(n-r)!}
$$

- **Combination** — A combination is an arrangement of $r$ objects from a pool of $n$ objects, where the order does not matter. The number of such arrangements is given by $C(n,r)$, defined as:

$$
C(n,r)=\frac{P(n,r)}{r!}=\frac{n!}{r!(n-r)!}
$$

_Remark: we note that for $0 \leq r \leq n$, we have $P(n,r) \geq C(n,r)$._

#### 5.1.2 Conditional Probability

- **Bayes' rule** — For events $A$ and $B$ such that $P(B)>0$, we have:

$$
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
$$

_Remark: we have $P(A\cap B)=P(A)P(B|A)=P(A|B)P(B)$._

- **Partition** — Let $\{A_i, i\in [\![1,n]\!]\}$ be such that for all $i$, $A_i\neq \varnothing$. We say that $\{A_i\}$ is a partition if we have:

$$
\forall i\neq j,\ A_i\cap A_j=\varnothing \qquad \textrm{and}\qquad \bigcup_{i=1}^n A_i=S
$$

_Remark: for any event $B$ in the sample space, we have $P(B)=\sum_{i=1}^n P(B|A_i)P(A_i)$._

- **Extended form of Bayes' rule** — Let $\{A_i, i\in [\![1,n]\!]\}$ be a partition of the sample space. We have:

$$
P(A_k|B)=\frac{P(B|A_k)P(A_k)}{\sum_{i=1}^n P(B|A_i)P(A_i)}
$$

- **Independence** — Two events $A$ and $B$ are independent if and only if we have:

$$
P(A\cap B)=P(A)P(B)
$$

#### 5.1.3 Random Variables

- **Random variable** — A random variable, often noted $X$, is a function that maps every element in a sample space to a real line.

- **Cumulative distribution function (CDF)** — The cumulative distribution function $F$, which is monotonically non-decreasing and is such that $\lim_{x\to -\infty}F(x)=0$ and $\lim_{x\to +\infty}F(x)=1$, is defined as:

$$
F(x)=P(X\leq x)
$$

_Remark: we have $P(a<X\leq B)=F(b)-F(a)$._

- **Probability density function (PDF)** — The probability density function $f$ is the probability that $X$ takes on values between two adjacent realizations of the random variable.

- **Relationships involving the PDF and CDF** — Here are the important properties to know in the discrete (D) and the continuous (C) cases.

| Case | CDF $F$ | PDF $f$ | Properties of PDF |
|---|---|---|---|
| (D) | $F(x)=\sum_{x_i\leq x}P(X=x_i)$ | $f(x_j)=P(X=x_j)$ | $0\leq f(x_j)\leq 1$ and $\sum_j f(x_j)=1$ |
| (C) | $F(x)=\int_{-\infty}^x f(y)dy$ | $f(x)=\frac{dF}{dx}$ | $f(x)\geq 0$ and $\int_{-\infty}^{+\infty} f(x)dx=1$ |

- **Variance** — The variance of a random variable, often noted $\operatorname{Var}(X)$ or $\sigma^2$, is a measure of the spread of its distribution function. It is determined as follows:

$$
\operatorname{Var}(X)=E[(X-E[X])^2]=E[X^2]-E[X]^2
$$

- **Standard deviation** — The standard deviation of a random variable, often noted $\sigma$, is a measure of the spread of its distribution function which is compatible with the units of the actual random variable. It is determined as follows:

$$
\sigma=\sqrt{\operatorname{Var}(X)}
$$

- **Expectation and Moments of the Distribution** — Here are the expressions of the expected value $E[X]$, generalized expected value $E[g(X)]$, $k^{th}$ moment $E[X^k]$ and characteristic function $\psi(\omega)$ for the discrete and continuous cases:

| Case | $E[X]$ | $E[g(X)]$ | $E[X^k]$ | $\psi(\omega)$ |
|---|---|---|---|---|
| (D) | $\sum_{i=1}^n x_i f(x_i)$ | $\sum_{i=1}^n g(x_i)f(x_i)$ | $\sum_{i=1}^n x_i^k f(x_i)$ | $\sum_{i=1}^n f(x_i)e^{i\omega x_i}$ |
| (C) | $\int_{-\infty}^{+\infty} x f(x)dx$ | $\int_{-\infty}^{+\infty} g(x)f(x)dx$ | $\int_{-\infty}^{+\infty} x^k f(x)dx$ | $\int_{-\infty}^{+\infty} f(x)e^{i\omega x}dx$ |

_Remark: we have $e^{i\omega x}=\cos(\omega x)+i\sin(\omega x)$._

- **Revisiting the $k^{th}$ moment** — The $k^{th}$ moment can also be computed with the characteristic function as follows:

$$
E[X^k]=\frac{1}{i^k}\left[\frac{\partial^k\psi}{\partial \omega^k}\right]_{\omega=0}
$$

- **Transformation of random variables** — Let the variables $X$ and $Y$ be linked by some function. By noting $f_X$ and $f_Y$ the distribution function of $X$ and $Y$ respectively, we have:

$$
f_Y(y)=f_X(x)\left|\frac{dx}{dy}\right|
$$

- **Leibniz integral rule** — Let $g$ be a function of $x$ and potentially $c$, and $a,b$ boundaries that may depend on $c$. We have:

$$
\frac{\partial}{\partial c}\left(\int_a^b g(x)dx\right)=\frac{\partial b}{\partial c}\cdot g(b)-\frac{\partial a}{\partial c}\cdot g(a)+\int_a^b \frac{\partial g}{\partial c}(x)dx
$$

- **Chebyshev's inequality** — Let $X$ be a random variable with expected value $\mu$ and standard deviation $\sigma$. For $k,\sigma>0$, we have the following inequality:

$$
P(|X-\mu|\geq k\sigma)\leq \frac{1}{k^2}
$$

#### 5.1.4 Jointly Distributed Random Variables

- **Conditional density** — The conditional density of $X$ with respect to $Y$, often noted $f_{X|Y}$, is defined as follows:

$$
f_{X|Y}(x)=\frac{f_{XY}(x,y)}{f_Y(y)}
$$

- **Independence** — Two random variables $X$ and $Y$ are said to be independent if we have:

$$
f_{XY}(x,y)=f_X(x)f_Y(y)
$$

- **Marginal density and cumulative distribution** — From the joint density probability function $f_{XY}$, we have:

| Case | Marginal density | Cumulative function |
|---|---|---|
| (D) | $f_X(x_i)=\sum_j f_{XY}(x_i,y_j)$ | $F_{XY}(x,y)=\sum_{x_i\leq x}\sum_{y_j\leq y} f_{XY}(x_i,y_j)$ |
| (C) | $f_X(x)=\int_{-\infty}^{+\infty} f_{XY}(x,y)dy$ | $F_{XY}(x,y)=\int_{-\infty}^x \int_{-\infty}^y f_{XY}(x',y')dx'dy'$ |

- **Distribution of a sum of independent random variables** — Let $Y=X_1+...+X_n$ with $X_1,...,X_n$ independent. We have:

$$
\psi_Y(\omega)=\prod_{k=1}^n \psi_{X_k}(\omega)
$$

- **Covariance** — We define the covariance of two random variables $X$ and $Y$, that we note $\sigma^2_{XY}$ or more commonly $\operatorname{Cov}(X,Y)$, as follows:

$$
\operatorname{Cov}(X,Y)\triangleq \sigma^2_{XY}=E[(X-\mu_X)(Y-\mu_Y)]=E[XY]-\mu_X\mu_Y
$$

- **Correlation** — By noting $\sigma_X,\sigma_Y$ the standard deviations of $X$ and $Y$, we define the correlation between the random variables $X$ and $Y$, noted $\rho_{XY}$, as follows:

$$
\rho_{XY}=\frac{\sigma^2_{XY}}{\sigma_X\sigma_Y}
$$

_Remarks: For any $X,Y$, we have $\rho_{XY}\in [-1,1]$. If $X$ and $Y$ are independent, then $\rho_{XY}=0$._

- **Main distributions** — Here are the main distributions to have in mind:

| Type | Distribution | PDF | $\psi(\omega)$ | $E[X]$ | $\operatorname{Var}(X)$ |
|---|---|---|---|---|---|
| (D) | $X\sim \mathcal{B}(n,p)$<br>Binomial | $P(X=x)=\binom{n}{x}p^xq^{n-x}$<br>$x\in [\![0,n]\!]$ | $(pe^{i\omega}+q)^n$ | $np$ | $npq$ |
| (D) | $X\sim \operatorname{Po}(\mu)$<br>Poisson | $P(X=x)=\frac{\mu^x}{x!}e^{-\mu}$<br>$x\in \mathbb{N}$ | $e^{\mu(e^{i\omega}-1)}$ | $\mu$ | $\mu$ |
| (C) | $X\sim \mathcal{U}(a,b)$<br>Uniform | $f(x)=\frac{1}{b-a}$<br>$x\in [a,b]$ | $\frac{e^{i\omega b}-e^{i\omega a}}{(b-a)i\omega}$ | $\frac{a+b}{2}$ | $\frac{(b-a)^2}{12}$ |
| (C) | $X\sim \mathcal{N}(\mu,\sigma)$<br>Gaussian | $f(x)=\frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$<br>$x\in \mathbb{R}$ | $e^{i\omega\mu-\frac{1}{2}\omega^2\sigma^2}$ | $\mu$ | $\sigma^2$ |
| (C) | $X\sim \operatorname{Exp}(\lambda)$<br>Exponential | $f(x)=\lambda e^{-\lambda x}$<br>$x\in \mathbb{R}_+$ | $\frac{1}{1-\frac{i\omega}{\lambda}}$ | $\frac{1}{\lambda}$ | $\frac{1}{\lambda^2}$ |

#### 5.1.5 Parameter estimation

- **Random sample** — A random sample is a collection of $n$ random variables $X_1,...,X_n$ that are independent and identically distributed with $X$.

- **Estimator** — An estimator $\hat{\theta}$ is a function of the data that is used to infer the value of an unknown parameter $\theta$ in a statistical model.

- **Bias** — The bias of an estimator $\hat{\theta}$ is defined as being the difference between the expected value of the distribution of $\hat{\theta}$ and the true value, i.e.:

$$
\operatorname{Bias}(\hat{\theta})=E[\hat{\theta}]-\theta
$$

_Remark: an estimator is said to be unbiased when we have $E[\hat{\theta}]=\theta$._

- **Sample mean and variance** — The sample mean and the sample variance of a random sample are used to estimate the true mean $\mu$ and the true variance $\sigma^2$ of a distribution, are noted $\overline{X}$ and $s^2$ respectively, and are such that:

$$
\overline{X}=\frac{1}{n}\sum_{i=1}^n X_i \qquad \textrm{and}\qquad s^2=\hat{\sigma}^2=\frac{1}{n-1}\sum_{i=1}^n (X_i-\overline{X})^2
$$

- **Central Limit Theorem** — Let us have a random sample $X_1,...,X_n$ following a given distribution with mean $\mu$ and variance $\sigma^2$, then we have:

$$
\overline{X}\underset{n\to +\infty}{\sim}\mathcal{N}\left(\mu,\frac{\sigma}{\sqrt{n}}\right)
$$

### 5.2 Linear Algebra and Calculus

#### 5.2.1 General notations

- **Vector** — We note $x\in \mathbb{R}^n$ a vector with $n$ entries, where $x_i\in \mathbb{R}$ is the $i^{th}$ entry:

$$
x=\begin{pmatrix}x_1\\x_2\\\vdots\\x_n\end{pmatrix}\in \mathbb{R}^n
$$

- **Matrix** — We note $A\in \mathbb{R}^{m\times n}$ a matrix with $m$ rows and $n$ columns, where $A_{i,j}\in \mathbb{R}$ is the entry located in the $i^{th}$ row and $j^{th}$ column:

$$
A=\begin{pmatrix}
A_{1,1} & \cdots & A_{1,n}\\
\vdots & & \vdots\\
A_{m,1} & \cdots & A_{m,n}
\end{pmatrix}\in \mathbb{R}^{m\times n}
$$

_Remark: the vector $x$ defined above can be viewed as a $n\times 1$ matrix and is more particularly called a column-vector._

- **Identity matrix** — The identity matrix $I\in \mathbb{R}^{n\times n}$ is a square matrix with ones in its diagonal and zero everywhere else:

$$
I=\begin{pmatrix}
1 & 0 & \cdots & 0\\
0 & \ddots & \ddots & \vdots\\
\vdots & \ddots & \ddots & 0\\
0 & \cdots & 0 & 1
\end{pmatrix}
$$

_Remark: for all matrices $A\in \mathbb{R}^{n\times n}$, we have $A\times I=I\times A=A$._

- **Diagonal matrix** — A diagonal matrix $D\in \mathbb{R}^{n\times n}$ is a square matrix with nonzero values in its diagonal and zero everywhere else:

$$
D=\begin{pmatrix}
d_1 & 0 & \cdots & 0\\
0 & \ddots & \ddots & \vdots\\
\vdots & \ddots & \ddots & 0\\
0 & \cdots & 0 & d_n
\end{pmatrix}
$$

_Remark: we also note $D$ as $diag(d_1,...,d_n)$._

#### 5.2.2 Matrix operations

- **Vector-vector multiplication** — There are two types of vector-vector products:

  - inner product: for $x,y\in \mathbb{R}^n$, we have:

$$
x^T y=\sum_{i=1}^n x_i y_i\in \mathbb{R}
$$

  - outer product: for $x\in \mathbb{R}^m$, $y\in \mathbb{R}^n$, we have:

$$
xy^T=\begin{pmatrix}
x_1y_1 & \cdots & x_1y_n\\
\vdots & & \vdots\\
x_my_1 & \cdots & x_my_n
\end{pmatrix}\in \mathbb{R}^{m\times n}
$$

- **Matrix-vector multiplication** — The product of matrix $A\in \mathbb{R}^{m\times n}$ and vector $x\in \mathbb{R}^n$ is a vector of size $\mathbb{R}^m$, such that:

$$
Ax=\begin{pmatrix}a_{r,1}^T x\\\vdots\\a_{r,m}^T x\end{pmatrix}=\sum_{i=1}^n a_{c,i}x_i\in \mathbb{R}^m
$$

where $a_{r,i}^T$ are the vector rows and $a_{c,j}$ are the vector columns of $A$, and $x_i$ are the entries of $x$.

- **Matrix-matrix multiplication** — The product of matrices $A\in \mathbb{R}^{m\times n}$ and $B\in \mathbb{R}^{n\times p}$ is a matrix of size $\mathbb{R}^{n\times p}$, such that:

$$
AB=\begin{pmatrix}
a_{r,1}^T b_{c,1} & \cdots & a_{r,1}^T b_{c,p}\\
\vdots & & \vdots\\
a_{r,m}^T b_{c,1} & \cdots & a_{r,m}^T b_{c,p}
\end{pmatrix}=\sum_{i=1}^n a_{c,i}b_{r,i}^T\in \mathbb{R}^{n\times p}
$$

where $a_{r,i}^T,b_{r,i}^T$ are the vector rows and $a_{c,j},b_{c,j}$ are the vector columns of $A$ and $B$ respectively.

- **Transpose** — The transpose of a matrix $A\in \mathbb{R}^{m\times n}$, noted $A^T$, is such that its entries are flipped:

$$
\forall i,j,\qquad A^T_{i,j}=A_{j,i}
$$

_Remark: for matrices $A,B$, we have $(AB)^T=B^TA^T$._

- **Inverse** — The inverse of an invertible square matrix $A$ is noted $A^{-1}$ and is the only matrix such that:

$$
AA^{-1}=A^{-1}A=I
$$

_Remark: not all square matrices are invertible. Also, for matrices $A,B$, we have $(AB)^{-1}=B^{-1}A^{-1}$._

- **Trace** — The trace of a square matrix $A$, noted $\operatorname{tr}(A)$, is the sum of its diagonal entries:

$$
\operatorname{tr}(A)=\sum_{i=1}^n A_{i,i}
$$

_Remark: for matrices $A,B$, we have $\operatorname{tr}(A^T)=\operatorname{tr}(A)$ and $\operatorname{tr}(AB)=\operatorname{tr}(BA)$._

- **Determinant** — The determinant of a square matrix $A\in \mathbb{R}^{n\times n}$, noted $|A|$ or $\det(A)$ is expressed recursively in terms of $A_{\backslash i,\backslash j}$, which is the matrix $A$ without its $i^{th}$ row and $j^{th}$ column, as follows:

$$
\det(A)=|A|=\sum_{j=1}^n (-1)^{i+j}A_{i,j}|A_{\backslash i,\backslash j}|
$$

_Remark: $A$ is invertible if and only if $|A|\neq 0$. Also, $|AB|=|A||B|$ and $|A^T|=|A|$._

#### 5.2.3 Matrix properties

- **Symmetric decomposition** — A given matrix $A$ can be expressed in terms of its symmetric and antisymmetric parts as follows:

$$
A=\underbrace{\frac{A+A^T}{2}}_{\textrm{Symmetric}}+\underbrace{\frac{A-A^T}{2}}_{\textrm{Antisymmetric}}
$$

- **Norm** — A norm is a function $N:V\longrightarrow [0,+\infty[$ where $V$ is a vector space, and such that for all $x,y\in V$, we have:

  - $N(x+y)\leq N(x)+N(y)$
  - $N(ax)=|a|N(x)$ for $a$ scalar
  - if $N(x)=0$, then $x=0$

For $x\in V$, the most commonly used norms are summed up in the table below:

| Norm | Notation | Definition | Use case |
|---|---|---|---|
| Manhattan, $L^1$ | $\lVert x\rVert_1$ | $\sum_{i=1}^n |x_i|$ | LASSO regularization |
| Euclidean, $L^2$ | $\lVert x\rVert_2$ | $\sqrt{\sum_{i=1}^n x_i^2}$ | Ridge regularization |
| $p$-norm, $L^p$ | $\lVert x\rVert_p$ | $\left(\sum_{i=1}^n x_i^p\right)^{\frac{1}{p}}$ | Hölder inequality |
| Infinity, $L^\infty$ | $\lVert x\rVert_\infty$ | $\max_i |x_i|$ | Uniform convergence |

- **Linearly dependence** — A set of vectors is said to be linearly dependent if one of the vectors in the set can be defined as a linear combination of the others.

_Remark: if no vector can be written this way, then the vectors are said to be linearly independent._

- **Matrix rank** — The rank of a given matrix $A$ is noted $\operatorname{rank}(A)$ and is the dimension of the vector space generated by its columns. This is equivalent to the maximum number of linearly independent columns of $A$.

- **Positive semi-definite matrix** — A matrix $A\in \mathbb{R}^{n\times n}$ is positive semi-definite (PSD) and is noted $A\succeq 0$ if we have:

$$
A=A^T \qquad \textrm{and}\qquad \forall x\in \mathbb{R}^n,\quad x^TAx\geq 0
$$

_Remark: similarly, a matrix $A$ is said to be positive definite, and is noted $A\succ 0$, if it is a PSD matrix which satisfies for all non-zero vector $x$, $x^TAx>0$._

- **Eigenvalue, eigenvector** — Given a matrix $A\in \mathbb{R}^{n\times n}$, $\lambda$ is said to be an eigenvalue of $A$ if there exists a vector $z\in \mathbb{R}^n\backslash \{0\}$, called eigenvector, such that we have:

$$
Az=\lambda z
$$

- **Spectral theorem** — Let $A\in \mathbb{R}^{n\times n}$. If $A$ is symmetric, then $A$ is diagonalizable by a real orthogonal matrix $U\in \mathbb{R}^{n\times n}$. By noting $\Lambda=\operatorname{diag}(\lambda_1,...,\lambda_n)$, we have:

$$
\exists \Lambda \textrm{ diagonal},\quad A=U\Lambda U^T
$$

- **Singular-value decomposition** — For a given matrix $A$ of dimensions $m\times n$, the singular-value decomposition (SVD) is a factorization technique that guarantees the existence of $U$ $m\times m$ unitary, $\Sigma$ $m\times n$ diagonal and $V$ $n\times n$ unitary matrices, such that:

$$
A=U\Sigma V^T
$$

#### 5.2.4 Matrix calculus

- **Gradient** — Let $f:\mathbb{R}^{m\times n}\to \mathbb{R}$ be a function and $A\in \mathbb{R}^{m\times n}$ be a matrix. The gradient of $f$ with respect to $A$ is a $m\times n$ matrix, noted $\nabla_A f(A)$, such that:

$$
(\nabla_A f(A))_{i,j}=\frac{\partial f(A)}{\partial A_{i,j}}
$$

_Remark: the gradient of $f$ is only defined when $f$ is a function that returns a scalar._

- **Hessian** — Let $f:\mathbb{R}^n\to \mathbb{R}$ be a function and $x\in \mathbb{R}^n$ be a vector. The hessian of $f$ with respect to $x$ is a $n\times n$ symmetric matrix, noted $\nabla_x^2 f(x)$, such that:

$$
(\nabla_x^2 f(x))_{i,j}=\frac{\partial^2 f(x)}{\partial x_i\partial x_j}
$$

_Remark: the hessian of $f$ is only defined when $f$ is a function that returns a scalar._

- **Gradient operations** — For matrices $A,B,C$, the following gradient properties are worth having in mind:

$$
\nabla_A\operatorname{tr}(AB)=B^T
$$

$$
\nabla_{A^T}f(A)=(\nabla_A f(A))^T
$$

$$
\nabla_A\operatorname{tr}(ABA^TC)=CAB+C^TAB^T
$$

$$
\nabla_A |A|=|A|(A^{-1})^T
$$


---

# Deep Learning — Super VIP Cheatsheet (Stanford CS 230)

*Afshine Amidi and Shervine Amidi*

## 1 Convolutional Neural Networks

### 1.1 Overview

- **Architecture of a traditional CNN** — Convolutional neural networks, also known as CNNs, are a specific type of neural networks that are generally composed of the following layers:

*[Figure: Architecture of a traditional CNN. A teddy-bear input image passes through stacked convolution feature maps labeled "Convolutions," then smaller stacked maps labeled "Pooling," then a dense neural network labeled "Fully Connected." Connection lines show local receptive fields early and full connections at the end, illustrating the standard CNN pipeline from image to features to prediction.]*

The convolution layer and the pooling layer can be fine-tuned with respect to hyperparameters that are described in the next sections.

### 1.2 Types of layer

- **Convolutional layer (CONV)** — The convolution layer (CONV) uses filters that perform convolution operations as it is scanning the input $I$ with respect to its dimensions. Its hyperparameters include the filter size $F$ and stride $S$. The resulting output $O$ is called _feature map_ or _activation map_.

*[Figure: Convolution layer. A square filter window slides over a red-tinted input grid; dotted projection lines show the filter patch being combined to produce one blue output activation cell, and repeated scanning creates a purple output feature map. The figure illustrates local convolution and feature-map construction.]*

Remark: the convolution step can be generalized to the 1D and 3D cases as well.

- **Pooling (POOL)** — The pooling layer (POOL) is a downsampling operation, typically applied after a convolution layer, which does some spatial invariance. In particular, max and average pooling are special kinds of pooling where the maximum and average value is taken, respectively.

| Type | Max pooling | Average pooling |
|---|---|---|
| **Purpose** | Each pooling operation selects the maximum value of the current view | Each pooling operation averages the values of the current view |
| **Illustration** | *[Figure: Max pooling. A highlighted moving window over a feature-map grid labeled "max" produces a smaller output grid by retaining the maximum value in each viewed region.]* | *[Figure: Average pooling. A highlighted moving window over a feature-map grid labeled "avg" produces a smaller output grid by averaging each viewed region.]* |
| **Comments** | - Preserves detected features<br>- Most commonly used | - Downsamples feature map<br>- Used in LeNet |

- **Fully Connected (FC)** — The fully connected layer (FC) operates on a flattened input where each input is connected to all neurons. If present, FC layers are usually found towards the end of CNN architectures and can be used to optimize objectives such as class scores.

*[Figure: Fully connected layer. A small feature map is flattened into a vertical vector, then every vector entry is connected by dense edges to hidden neurons and output neurons, showing how CNN features feed a traditional multilayer neural network.]*

### 1.3 Filter hyperparameters

The convolution layer contains filters for which it is important to know the meaning behind its hyperparameters.

- **Dimensions of a filter** — A filter of size $F \times F$ applied to an input containing $C$ channels is a $F \times F \times C$ volume that performs convolutions on an input of size $I \times I \times C$ and produces an output feature map (also called activation map) of size $O \times O \times 1$.

*[Figure: Dimensions of filters. Two blue cuboid filters labeled Filter 1 and Filter 2 have spatial dimensions $F$ by $F$ and depth $C$, emphasizing that each filter spans all input channels.]*

Remark: the application of $K$ filters of size $F \times F$ results in an output feature map of size $O \times O \times K$.

- **Stride** — For a convolutional or a pooling operation, the stride $S$ denotes the number of pixels by which the window moves after each operation.

*[Figure: Stride. One-dimensional grid diagrams show a blue window moving horizontally by a labeled step $S$, illustrating that stride is the displacement between consecutive convolution or pooling windows.]*

- **Zero-padding** — Zero-padding denotes the process of adding $P$ zeroes to each side of the boundaries of the input. This value can either be manually specified or automatically set through one of the three modes detailed below:

| Mode | Valid | Same | Full |
|---|---|---|---|
| **Value** | $P = 0$ | $P_{\text{start}} = \left\lfloor \frac{S\left\lceil \frac{I}{S} \right\rceil - I + F - S}{2} \right\rfloor$<br>$P_{\text{end}} = \left\lceil \frac{S\left\lceil \frac{I}{S} \right\rceil - I + F - S}{2} \right\rceil$ | $P_{\text{start}} \in \llbracket 0, F - 1 \rrbracket$<br><br>$P_{\text{end}} = F - 1$ |
| **Illustration** | *[Figure: Valid padding. The filter is applied only inside the original input grid; no gray padded cells surround the input.]* | *[Figure: Same padding. Gray padded cells are added around the input so the feature-map size is mathematically convenient, with output length $\left\lceil I/S \right\rceil$.]* | *[Figure: Full padding. A larger gray padded border surrounds the input so filter placements can reach the input boundaries end-to-end.]* |
| **Purpose** | - No padding<br>- Drops last convolution if dimensions do not match | - Padding such that feature map size has size $\left\lceil \frac{I}{S} \right\rceil$<br>- Output size is mathematically convenient<br>- Also called 'half' padding | - Maximum padding such that end convolutions are applied on the limits of the input<br>- Filter 'sees' the input end-to-end |

### 1.4 Tuning hyperparameters

- **Parameter compatibility in convolution layer** — By noting $I$ the length of the input volume size, $F$ the length of the filter, $P$ the amount of zero padding, $S$ the stride, then the output size $O$ of the feature map along that dimension is given by:

$$
\boxed{O = \frac{I - F + P_{\text{start}} + P_{\text{end}}}{S} + 1}
$$

*[Figure: Parameter compatibility. A gridded teddy-bear input has labeled length $I$, padding labels $P_{\text{start}}$ and $P_{\text{end}}$, a square filter labeled $F \times F$, and an output grid labeled $O \times O$, illustrating how input size, filter size, padding, and stride determine the output dimension.]*

Remark: often times, $P_{\text{start}} = P_{\text{end}} \triangleq P$, in which case we can replace $P_{\text{start}} + P_{\text{end}}$ by $2P$ in the formula above.

- **Understanding the complexity of the model** — In order to assess the complexity of a model, it is often useful to determine the number of parameters that its architecture will have. In a given layer of a convolutional neural network, it is done as follows:

|  | CONV | POOL | FC |
|---|---|---|---|
| **Illustration** | *[Figure: CONV complexity illustration. A filter of size $F \times F$ spanning $C$ channels is repeated for $K$ filters.]* | *[Figure: POOL complexity illustration. A pooling window of size $F \times F$ applies a max operation without learned weights.]* | *[Figure: FC complexity illustration. $N_{\text{in}}$ input neurons are densely connected to $N_{\text{out}}$ output neurons.]* |
| **Input size** | $I \times I \times C$ | $I \times I \times C$ | $N_{\text{in}}$ |
| **Output size** | $O \times O \times K$ | $O \times O \times C$ | $N_{\text{out}}$ |
| **Number of parameters** | $(F \times F \times C + 1) \cdot K$ | $0$ | $(N_{\text{in}} + 1) \times N_{\text{out}}$ |
| **Remarks** | - One bias parameter per filter<br>- In most cases, $S < F$<br>- A common choice for $K$ is $2C$ | - Pooling operation done channel-wise<br>- In most cases, $S = F$ | - Input is flattened<br>- One bias parameter per neuron<br>- The number of FC neurons is free of structural constraints |

- **Receptive field** — The receptive field at layer $k$ is the area denoted $R_k \times R_k$ of the input that each pixel of the $k$-th activation map can 'see'. By calling $F_j$ the filter size of layer $j$ and $S_i$ the stride value of layer $i$ and with the convention $S_0 = 1$, the receptive field at layer $k$ can be computed with the formula:

$$
\boxed{R_k = 1 + \sum_{j=1}^{k} (F_j - 1) \prod_{i=0}^{j-1} S_i}
$$

In the example below, we have $F_1 = F_2 = 3$ and $S_1 = S_2 = 1$, which gives $R_2 = 1 + 2 \cdot 1 + 2 \cdot 1 = 5$.

*[Figure: Receptive field. A red input grid maps through two convolutional layers to purple and blue feature maps; dotted lines trace back from one later activation to a larger input patch, illustrating how stacked filters enlarge the area of the original input visible to a deep-layer pixel.]*

### 1.5 Commonly used activation functions

- **Rectified Linear Unit** — The rectified linear unit layer (ReLU) is an activation function $g$ that is used on all elements of the volume. It aims at introducing non-linearities to the network. Its variants are summarized in the table below:

| ReLU | Leaky ReLU | ELU |
|---|---|---|
| $g(z) = \max(0, z)$ | $g(z) = \max(\epsilon z, z)$<br>with $\epsilon \ll 1$ | $g(z) = \max(\alpha(e^z - 1), z)$<br>with $\alpha \ll 1$ |
| *[Figure: ReLU plot. Axes show zero output for negative $z$ and a straight line of slope 1 for positive $z$.]* | *[Figure: Leaky ReLU plot. Axes show a small positive slope for negative $z$ and slope 1 for positive $z$, avoiding a flat negative side.]* | *[Figure: ELU plot. Axes show an exponential negative branch saturating near $-\alpha$ and a linear positive branch.]* |
| - Non-linearity complexities biologically interpretable | - Addresses dying ReLU issue for negative values | - Differentiable everywhere |

- **Softmax** — The softmax step can be seen as a generalized logistic function that takes as input a vector of scores $x \in \mathbb{R}^n$ and outputs a vector of output probability $p \in \mathbb{R}^n$ through a softmax function at the end of the architecture. It is defined as follows:

$$
\boxed{p = \begin{pmatrix} p_1 \\ \vdots \\ p_n \end{pmatrix}} \quad \textrm{where} \quad \boxed{p_i = \frac{e^{x_i}}{\displaystyle\sum_{j=1}^{n} e^{x_j}}}
$$

### 1.6 Object detection

- **Types of models** — There are 3 main types of object recognition algorithms, for which the nature of what is predicted is different. They are described in the table below:

| Image classification | Classification w. localization | Detection |
|---|---|---|
| *[Figure: Image classification. A teddy-bear image is labeled "Teddy bear" without a localization box, illustrating whole-image class prediction.]* | *[Figure: Classification with localization. A teddy-bear image is labeled "Teddy bear" and has a single white bounding box around the bear, illustrating one-object localization.]* | *[Figure: Detection. A teddy-bear image has a white box and label for the teddy bear plus a red box and label for the book, illustrating multiple object detections.]* |
| - Classifies a picture<br>- Predicts probability of object | - Detects an object in a picture<br>- Predicts probability of object and where it is located | - Detects up to several objects in a picture<br>- Predicts probabilities of objects and where they are located |
| Traditional CNN | Simplified YOLO, R-CNN | YOLO, R-CNN |

- **Detection** — In the context of object detection, different methods are used depending on whether we just want to locate the object or detect a more complex shape in the image. The two main ones are summed up in the table below:

| Bounding box detection | Landmark detection |
|---|---|
| - Detects the part of the image where the object is located | - Detects a shape or characteristics of an object (e.g. eyes)<br>- More granular |
| *[Figure: Bounding box detection. A faded teddy-bear image contains a white rectangular box with center $(b_x,b_y)$, height $b_h$, and width $b_w$ labeled, showing rectangular object localization.]* | *[Figure: Landmark detection. A faded teddy-bear image contains several labeled reference points $(l_{1x},l_{1y}), \ldots, (l_{nx},l_{ny})$ on object parts, showing fine-grained shape or characteristic localization.]* |
| Box of center $(b_x,b_y)$, height $b_h$ and width $b_w$ | Reference points $(l_{1x},l_{1y}), \ldots, (l_{nx},l_{ny})$ |

- **Intersection over Union** — Intersection over Union, also known as $\textrm{IoU}$, is a function that quantifies how correctly positioned a predicted bounding box $B_p$ is over the actual bounding box $B_a$. It is defined as:

$$
\boxed{\textrm{IoU}(B_p, B_a) = \frac{B_p \cap B_a}{B_p \cup B_a}}
$$

*[Figure: Intersection over Union examples. Three teddy-bear images compare actual bounding box $B_a$ in white with predicted box $B_p$ in blue; captions show $\textrm{IoU}(B_p,B_a)=0.1$, $0.5$, and $0.9$, illustrating poor, threshold-level, and strong overlap.]*

Remark: we always have $\textrm{IoU} \in [0,1]$. By convention, a predicted bounding box $B_p$ is considered as being reasonably good if $\textrm{IoU}(B_p,B_a) \geqslant 0.5$.

- **Anchor boxes** — Anchor boxing is a technique used to predict overlapping bounding boxes. In practice, the network is allowed to predict more than one box simultaneously, where each box prediction is constrained to have a given set of geometrical properties. For instance, the first prediction can potentially be a rectangular box of a given form, while the second will be another rectangular box of a different geometrical form.

- **Non-max suppression** — The non-max suppression technique aims at removing duplicate overlapping bounding boxes of a same object by selecting the most representative ones. After having removed all boxes having a probability prediction lower than $0.6$, the following steps are repeated while there are boxes remaining:

For a given class,

- Step 1: Pick the box with the largest prediction probability.
- Step 2: Discard any box having an $\textrm{IoU} \geqslant 0.5$ with the previous box.

*[Figure: Non-max suppression. A sequence of teddy-bear panels begins with many predicted white and red bounding boxes, selects the maximum-probability box (score shown near 0.9978), removes overlapping boxes of the same class, and ends with final bounding boxes for "Teddy bear" and "Book." The arrows illustrate duplicate-box pruning.]*

- **YOLO** — You Only Look Once (YOLO) is an object detection algorithm that performs the following steps:

- Step 1: Divide the input image into a $G \times G$ grid.
- Step 2: For each grid cell, run a CNN that predicts $y$ of the following form:

$$
\boxed{y = \big[\underbrace{p_c, b_x, b_y, b_h, b_w, c_1, c_2, \ldots, c_p}_{\textrm{repeated } k \textrm{ times}}, \ldots\big]^T \in \mathbb{R}^{G \times G \times k \times (5+p)}}
$$

where $p_c$ is the probability of detecting an object, $b_x,b_y,b_h,b_w$ are the properties of the detected bouding box, $c_1,\ldots,c_p$ is a one-hot representation of which of the $p$ classes were detected, and $k$ is the number of anchor boxes.

- Step 3: Run the non-max suppression algorithm to remove any potential duplicate overlapping bounding boxes.

*[Figure: YOLO pipeline. The original teddy-bear image is overlaid with a $G \times G$ grid, grid cells produce bounding box predictions with centers and multiple boxes, and non-max suppression yields final labeled boxes for "Teddy bear" and "Book." The diagram illustrates YOLO's single-pass grid-based detection.]*

Remark: when $p_c = 0$, then the network does not detect any object. In that case, the corresponding predictions $b_x, \ldots, c_p$ have to be ignored.

- **R-CNN** — Region with Convolutional Neural Networks (R-CNN) is an object detection algorithm that first segments the image to find potential relevant bounding boxes and then run the detection algorithm to find most probable objects in those bounding boxes.

*[Figure: R-CNN pipeline. The teddy-bear image is first converted into a segmentation proposal view, then candidate bounding boxes are drawn over segmented regions, and non-max suppression produces final boxes labeled "Teddy bear" and "Book." The diagram illustrates proposal-based detection before classification.]*

Remark: although the original algorithm is computationally expensive and slow, newer architectures enabled the algorithm to run faster, such as Fast R-CNN and Faster R-CNN.


#### 1.6.1 Face verification and recognition

- **Types of models** — Two main types of model are summed up in table below:

| Face verification | Face recognition |
|---|---|
| - Is this the correct person?<br>- One-to-one lookup | - Is this one of the $K$ persons in the database?<br>- One-to-many lookup |
| *[Figure: Face verification illustration showing a query teddy-bear image compared with a reference teddy-bear image, marked with a green check when the identities match, and a query white-bear image compared with a different teddy-bear reference, marked with a red cross when they do not match; the purpose is to show a one-to-one identity check.]* | *[Figure: Face recognition illustration showing one query teddy-bear image connected to a database containing multiple candidate images; one path is highlighted in green to the matching teddy bear while other gray paths go to nonmatching teddy bears, a white bear, and a red-nosed toy, illustrating one-to-many lookup among $K$ people.]* |

- **One Shot Learning** — One Shot Learning is a face verification algorithm that uses a limited training set to learn a similarity function that quantifies how different two given images are. The similarity function applied to two images is often noted $d(\textrm{image 1}, \textrm{image 2})$.

- **Siamese Network** — Siamese Networks aim at learning how to encode images to then quantify how different two images are. For a given input image $x^{(i)}$, the encoded output is often noted as $f(x^{(i)})$.

*[Figure: Siamese-network-style embedding illustration for face images, where input images are mapped through the same neural network encoder into representation vectors so that distances between embeddings can be compared; the pedagogical purpose is to show that similarity is computed after encoding, not directly from pixels.]*

- **Triplet loss** — The triplet loss $\ell$ is a loss function computed on the embedding representation of a triplet of images $A$ (anchor), $P$ (positive) and $N$ (negative). The anchor and the positive example belong to a same class, while the negative example to another one. By calling $\alpha\in\mathbb{R}^+$ the margin parameter, this loss is defined as follows:

$$
\boxed{\ell(A,P,N)=\max\left(d(A,P)-d(A,N)+\alpha,0\right)}
$$

*[Figure: Two concentric-distance triplet-loss diagrams. In the first, anchor $A$ is near positive example $P$ and far from negative example $N$ by at least margin $\alpha$, so the label underneath is $\ell(A,P,N)=0$. In the second, $N$ lies too close to $A$ relative to $P$ and the margin, so the label underneath is $\ell(A,P,N)>0$; the purpose is to visualize when the margin constraint is satisfied or violated.]*

#### 1.6.2 Neural style transfer

- **Motivation** — The goal of neural style transfer is to generate an image $G$ based on a given content $C$ and a given style $S$.

*[Figure: Neural style transfer input-output diagram with a teddy bear reading a book labeled Content $C$, a Van Gogh-like Starry Night image labeled Style $S$, and a generated teddy-bear image painted in the same swirling blue-yellow style labeled Generated image $G$; the plus sign and equals sign show that the generated image combines content and style.]*

- **Activation** — In a given layer $l$, the activation is noted $a^{[l]}$ and is of dimensions $n_H\times n_w\times n_c$.

- **Content cost function** — The content cost function $J_{\textrm{content}}(C,G)$ is used to determine how the generated image $G$ differs from the original content image $C$. It is defined as follows:

$$
\boxed{J_{\textrm{content}}(C,G)=\frac{1}{2}\left\|a^{[l](C)}-a^{[l](G)}\right\|^2}
$$

- **Style matrix** — The style matrix $G^{[l]}$ of a given layer $l$ is a Gram matrix where each of its elements $G_{kk'}^{[l]}$ quantifies how correlated the channels $k$ and $k'$ are. It is defined with respect to activations $a^{[l]}$ as follows:

$$
\boxed{G_{kk'}^{[l]}=\sum_{i=1}^{n_H^{[l]}}\sum_{j=1}^{n_w^{[l]}}a_{ijk}^{[l]}a_{ijk'}^{[l]}}
$$

_Remark: the style matrix for the style image and the generated image are noted $G^{[l]}(S)$ and $G^{[l]}(G)$ respectively._

- **Style cost function** — The style cost function $J_{\textrm{style}}(S,G)$ is used to determine how the generated image $G$ differs from the style $S$. It is defined as follows:

$$
\boxed{J_{\textrm{style}}^{[l]}(S,G)=\frac{1}{(2n_Hn_wn_c)^2}\left\|G^{[l](S)}-G^{[l](G)}\right\|_F^2=\frac{1}{(2n_Hn_wn_c)^2}\sum_{k,k'=1}^{n_c}\left(G_{kk'}^{[l](S)}-G_{kk'}^{[l](G)}\right)^2}
$$

- **Overall cost function** — The overall cost function is defined as being a combination of the content and style cost functions, weighted by parameters $\alpha,\beta$, as follows:

$$
\boxed{J(G)=\alpha J_{\textrm{content}}(C,G)+\beta J_{\textrm{style}}(S,G)}
$$

_Remark: a higher value of $\alpha$ will make the model care more about the content while a higher value of $\beta$ will make it care more about the style._

#### 1.6.3 Architectures using computational tricks

- **Generative Adversarial Network** — Generative adversarial networks, also known as GANs, are composed of a generative and a discriminative model, where the generative model aims at generating the most truthful output that will be fed into the discriminative which aims at differentiating the generated and true image.

*[Figure: GAN pipeline diagram. A training set is sent through a “Real-world image” block to produce a real teddy-bear image, while random noise is sent through a “Generator” block to produce a generated teddy-bear image; both images enter a “Discriminator” block whose output is a vertical real/fake decision panel with a green circle labeled Real and a red circle labeled Fake. The purpose is to show adversarial competition between generation and discrimination.]*

_Remark: use cases using variants of GANs include text to image, music generation and synthesis._

- **ResNet** — The Residual Network architecture (also called ResNet) uses residual blocks with a high number of layers meant to decrease the training error. The residual block has the following characterizing equation:

$$
\boxed{a^{[l+2]}=g\left(a^{[l]}+z^{[l+2]}\right)}
$$

*[Figure: Residual block diagram showing a main sequence of layers from activation $a^{[l]}$ to $z^{[l+2]}$ and a skip connection carrying $a^{[l]}$ forward to be added before applying activation $g$, illustrating how identity shortcuts help gradients and features flow through deep networks.]*

- **Inception Network** — This architecture uses inception modules and aims at giving a try at different convolutions in order to increase its performance. In particular, it uses the $1\times1$ convolution trick to lower the burden of computation.

*[Figure: Inception module illustration with multiple parallel branches applying different operations such as $1\times1$, $3\times3$, and $5\times5$ convolutions and pooling, then concatenating their outputs; the purpose is to show feature diversification while $1\times1$ convolutions reduce computation.]*

* * *

## 2 Recurrent Neural Networks

### 2.1 Overview

- **Architecture of a traditional RNN** — Recurrent neural networks, also known as RNNs, are a class of neural networks that allow previous outputs to be used as inputs while having hidden states. They are typically as follows:

*[Figure: Traditional RNN architecture diagram in two equivalent views. The unrolled view shows a sequence beginning with $a^{<0>}$ and inputs $x^{<1>}$, $x^{<2>}$, $\ldots$, $x^{<t>}$, $x^{<t+1>}$ feeding blue recurrent cells; each cell outputs $y^{<1>}$, $y^{<2>}$, $\ldots$, $y^{<t>}$, $y^{<t+1>}$, and passes activations $a^{<1>}$, $a^{<2>}$, $\ldots$ forward. The cell view shows $a^{<t-1>}$ and $x^{<t>}$ combined through shared weights $W_{aa}$ and $W_{ax}$ with bias $b_a$, nonlinearity $g_1$, then mapped through $W_{ya}$, bias $b_y$, and $g_2$ to $y^{<t>}$; the purpose is to connect the compact equations to the computational graph.]*

For each timestep $t$, the activation $a^{<t>}$ and the output $y^{<t>}$ are expressed as follows:

$$
\boxed{a^{<t>}=g_1\left(W_{aa}a^{<t-1>}+W_{ax}x^{<t>}+b_a\right)}\quad\textrm{and}\quad\boxed{y^{<t>}=g_2\left(W_{ya}a^{<t>}+b_y\right)}
$$

where $W_{ax}, W_{aa}, W_{ya}, b_a, b_y$ are coefficients that are shared temporally and $g_1,g_2$ activation functions.

The pros and cons of a typical RNN architecture are summed up in the table below:

| Advantages | Drawbacks |
|---|---|
| - Possibility of processing input of any length<br>- Model size not increasing with size of input<br>- Computation takes into account historical information<br>- Weights are shared across time | - Computation being slow<br>- Difficulty of accessing information from a long time ago<br>- Cannot consider any future input for the current state |

- **Applications of RNNs** — RNN models are mostly used in the fields of natural language processing and speech recognition. The different applications are summed up in the table below:

| Type of RNN | Illustration | Example |
|---|---|---|
| One-to-one<br>$T_x=T_y=1$ | *[Figure: One-to-one RNN diagram with a single input $x$ and initial activation $a^{<0>}$ feeding one blue cell that outputs $\hat{y}$; it represents a traditional neural network with one input and one output.]* | Traditional neural network |
| One-to-many<br>$T_x=1,T_y>1$ | *[Figure: One-to-many RNN diagram with one input $x$ and initial activation $a^{<0>}$ feeding a chain of recurrent cells that emit $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<T_y>}$; feedback arrows indicate outputs or hidden states drive later generation.]* | Music generation |
| Many-to-one<br>$T_x>1,T_y=1$ | *[Figure: Many-to-one RNN diagram with sequence inputs $x^{<1>}$, $x^{<2>}$, $\ldots$, $x^{<T_x>}$ passing through recurrent cells from $a^{<0>}$ and producing a single final output $\hat{y}$.]* | Sentiment classification |
| Many-to-many<br>$T_x=T_y$ | *[Figure: Synchronous many-to-many RNN diagram with each input $x^{<1>}$, $x^{<2>}$, $\ldots$, $x^{<T_x>}$ aligned to an output $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<T_y>}$ at the same time step.]* | Name entity recognition |
| Many-to-many<br>$T_x\neq T_y$ | *[Figure: Encoder-decoder many-to-many RNN diagram with an input sequence processed first, followed by an output sequence generated later; input and output lengths differ, and a dashed separation indicates transition from encoding to decoding.]* | Machine translation |

- **Loss function** — In the case of a recurrent neural network, the loss function $\mathcal{L}$ of all time steps is defined based on the loss at every time step as follows:

$$
\boxed{\mathcal{L}(\widehat{y},y)=\sum_{t=1}^{T_y}\mathcal{L}\left(\widehat{y}^{<t>},y^{<t>}\right)}
$$

- **Backpropagation through time** — Backpropagation is done at each point in time. At timestep $T$, the derivative of the loss $\mathcal{L}$ with respect to weight matrix $W$ is expressed as follows:

$$
\boxed{\frac{\partial \mathcal{L}^{(T)}}{\partial W}=\sum_{t=1}^{T}\left.\frac{\partial \mathcal{L}^{(T)}}{\partial W}\right|_{(t)}}
$$

### 2.2 Handling long term dependencies

- **Commonly used activation functions** — The most common activation functions used in RNN modules are described below:

| Sigmoid | Tanh | RELU |
|---|---|---|
| $g(z)=\dfrac{1}{1+e^{-z}}$ | $g(z)=\dfrac{e^z-e^{-z}}{e^z+e^{-z}}$ | $g(z)=\max(0,z)$ |
| *[Figure: Sigmoid curve rising smoothly from near 0 to near 1, passing through $\frac{1}{2}$ at $z=0$, with horizontal scale roughly from $-4$ to $4$; it illustrates bounded gate activations.]* | *[Figure: Hyperbolic tangent curve rising from near $-1$ to near $1$ and crossing 0 at the origin, with horizontal scale roughly from $-4$ to $4$; it illustrates centered hidden-state activation.]* | *[Figure: ReLU plot equal to 0 for negative $z$ and a straight increasing line for positive $z$, with axes marked near 0 and 1; it illustrates rectified activation.]* |

- **Vanishing/exploding gradient** — The vanishing and exploding gradient phenomena are often encountered in the context of RNNs. The reason why they happen is that it is difficult to capture long term dependencies because of multiplicative gradient that can be exponentially decreasing/increasing with respect to the number of layers.

- **Gradient clipping** — It is a technique used to cope with the exploding gradient problem sometimes encountered when performing backpropagation. By capping the maximum value for the gradient, this phenomenon is controlled in practice.

*[Figure: Gradient clipping graph with horizontal axis $\|\nabla\mathcal{L}\|$ and vertical axis $\|\nabla\mathcal{L}\|_{\textrm{clipped}}$. The blue line increases linearly from 0 until threshold $C$ and then becomes flat at height $C$, illustrating that gradients larger than the cap are clipped.]*

- **Types of gates** — In order to remedy the vanishing gradient problem, specific gates are used in some types of RNNs and usually have a well-defined purpose. They are usually noted $\Gamma$ and are equal to:

$$
\boxed{\Gamma=\sigma\left(Wx^{<t>}+Ua^{<t-1>}+b\right)}
$$

where $W,U,b$ are coefficients specific to the gate and $\sigma$ is the sigmoid function. The main ones are summed up in the table below:

| Type of gate | Role | Used in |
|---|---|---|
| Update gate $\Gamma_u$ | How much past should matter now? | GRU, LSTM |
| Relevance gate $\Gamma_r$ | Drop previous information? | GRU, LSTM |
| Forget gate $\Gamma_f$ | Erase a cell or not? | LSTM |
| Output gate $\Gamma_o$ | How much to reveal of a cell? | LSTM |

- **GRU/LSTM** — Gated Recurrent Unit (GRU) and Long Short-Term Memory units (LSTM) deal with the vanishing gradient problem encountered by traditional RNNs, with LSTM being a generalization of GRU. Below is a table summing up the characterizing equations of each architecture:

|  | Gated Recurrent Unit (GRU) | Long Short-Term Memory (LSTM) |
|---|---|---|
| $\widetilde{c}^{<t>}$ | $\tanh\left(W_c[\Gamma_r * a^{<t-1>},x^{<t>}]+b_c\right)$ | $\tanh\left(W_c[\Gamma_r * a^{<t-1>},x^{<t>}]+b_c\right)$ |
| $c^{<t>}$ | $\Gamma_u * \widetilde{c}^{<t>}+(1-\Gamma_u)*c^{<t-1>}$ | $\Gamma_u * \widetilde{c}^{<t>}+\Gamma_f*c^{<t-1>}$ |
| $a^{<t>}$ | $c^{<t>}$ | $\Gamma_o*c^{<t>}$ |
| Dependencies | *[Figure: GRU cell dependency diagram showing previous cell/state $c^{<t-1>}$ and previous activation $a^{<t-1>}$ entering a blue recurrent block, current input $x^{<t>}$ entering from below, relevance gate $\Gamma_r$ and update gate $\Gamma_u$ controlling candidate $\widetilde{c}^{<t>}$ and the flow to $c^{<t>}$ and $a^{<t>}$.]* | *[Figure: LSTM cell dependency diagram showing separate memory $c^{<t-1>}\to c^{<t>}$ across the top, previous activation $a^{<t-1>}\to a^{<t>}$ across the lower path, current input $x^{<t>}$ from below, and gates $\Gamma_f$, $\Gamma_u$, $\Gamma_r$, and $\Gamma_o$ controlling forgetting, updating, candidate creation, and output exposure.]* |

_Remark: the sign $*$ denotes the element-wise multiplication between two vectors._

- **Variants of RNNs** — The table below sums up the other commonly used RNN architectures:

| Bidirectional (BRNN) | Deep (DRNN) |
|---|---|
| *[Figure: Bidirectional RNN illustration with forward hidden states moving left-to-right from $x^{<1>}$ to $x^{<T>}$ and backward hidden states moving right-to-left from an initial backward activation, both contributing upward to outputs $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<T>}$; the purpose is to use past and future context.]* | *[Figure: Deep RNN illustration with multiple stacked recurrent layers indexed by activations such as $a^{[1]<0>}$, $a^{[2]<0>}$, $a^{[k]<0>}$; each time step has vertical connections between layers and horizontal recurrent connections across time, producing outputs $\hat{y}^{<1>}$, $\hat{y}^{<2>}$, $\ldots$, $\hat{y}^{<t>}$; the purpose is to add depth to temporal modeling.]* |

### 2.3 Learning word representation

In this section, we note $V$ the vocabulary and $|V|$ its size.

#### 2.3.1 Motivation and notations

- **Representation techniques** — The two main ways of representing words are summed up in the table below:

| 1-hot representation | Word embedding |
|---|---|
| *[Figure: 1-hot representation axes for words such as “teddy bear,” “soft,” and “book,” with each word lying on a separate orthogonal axis; the purpose is to show that words are isolated basis vectors with no notion of similarity.]* | *[Figure: Word embedding coordinate space with arrows for “teddy bear,” “soft,” and “book,” where teddy bear and soft point in more similar directions than book; the purpose is to show distributed vectors that capture semantic similarity.]* |
| - Noted $o_w$<br>- Naive approach, no similarity information | - Noted $e_w$<br>- Takes into account words similarity |

- **Embedding matrix** — For a given word $w$, the embedding matrix $E$ is a matrix that maps its 1-hot representation $o_w$ to its embedding $e_w$ as follows:

$$
\boxed{e_w=Eo_w}
$$

_Remark: learning the embedding matrix can be done using target/context likelihood models._

#### 2.3.2 Word embeddings

- **Word2vec** — Word2vec is a framework aimed at learning word embeddings by estimating the likelihood that a given word is surrounded by other words. Popular models include skip-gram, negative sampling and CBOW.

*[Figure: Word2vec training illustration. A proxy task sentence fragment shows context words “A cute” and “is reading” around target “teddy bear”; a neural network is trained to predict or use the target from surrounding words, then an intermediate high-level representation is extracted and used to compute word embeddings, with examples mapping “teddy bear” near “soft” and “Persian poetry” near “art.”]*

- **Skip-gram** — The skip-gram word2vec model is a supervised learning task that learns word embeddings by assessing the likelihood of any given target word $t$ happening with a context word $c$. By noting $\theta_t$ a parameter associated with $t$, the probability $P(t|c)$ is given by:

$$
\boxed{P(t|c)=\frac{\exp\left(\theta_t^Te_c\right)}{\displaystyle\sum_{j=1}^{|V|}\exp\left(\theta_j^Te_c\right)}}
$$

_Remark: summing over the whole vocabulary in the denominator of the softmax part makes this model computationally expensive. CBOW is another word2vec model using the surrounding words to predict a given word._

- **Negative sampling** — It is a set of binary classifiers using logistic regressions that aim at assessing how a given context and a given target words are likely to appear simultaneously, with the models being trained on sets of $k$ negative examples and 1 positive example. Given a context word $c$ and a target word $t$, the prediction is expressed by:

$$
\boxed{P(y=1|c,t)=\sigma\left(\theta_t^Te_c\right)}
$$

_Remark: this method is less computationally expensive than the skip-gram model._

- **GloVe** — The GloVe model, short for global vectors for word representation, is a word embedding technique that uses a co-occurence matrix $X$ where each $X_{i,j}$ denotes the number of times that a target $i$ occurred with a context $j$. Its cost function $J$ is as follows:

$$
\boxed{J(\theta)=\frac{1}{2}\sum_{i,j=1}^{|V|}f(X_{ij})\left(\theta_i^Te_j+b_i+b_j'-\log(X_{ij})\right)^2}
$$

where $f$ is a weighting function such that $X_{i,j}=0\Longrightarrow f(X_{i,j})=0$.

Given the symmetry that $e$ and $\theta$ play in this model, the final word embedding $e_w^{(\textrm{final})}$ is given by:

$$
\boxed{e_w^{(\textrm{final})}=\frac{e_w+\theta_w}{2}}
$$

_Remark: the individual components of the learned word embeddings are not necessarily interpretable._

### 2.4 Comparing words

- **Cosine similarity** — The cosine similarity between words $w_1$ and $w_2$ is expressed as follows:

$$
\boxed{\textrm{similarity}=\frac{w_1\cdot w_2}{\|w_1\|\textrm{ }\|w_2\|}=\cos(\theta)}
$$

_Remark: $\theta$ is the angle between words $w_1$ and $w_2$._

*[Figure: Cosine-similarity vector diagram showing two blue arrows $w_1$ and $w_2$ emanating from a common point with angle $\theta$ between them; the purpose is to illustrate that smaller angles imply larger similarity.]*

- **$t$-SNE** — $t$-SNE ($t$-distributed Stochastic Neighbor Embedding) is a technique aimed at reducing high-dimensional embeddings into a lower dimensional space. In practice, it is commonly used to visualize word vectors in the 2D space.

*[Figure: Two-dimensional $t$-SNE scatterplot of word vectors with labeled points. Related words cluster together, such as “teddy bear,” “soft,” “hug,” “kind,” “cute,” and “adorable,” while another cluster includes literature and culture terms such as “literature,” “Shahnameh,” “poem,” “poetry,” “reading,” “book,” “art,” and “knowledge”; the purpose is to visualize semantic neighborhoods after dimensionality reduction.]*

### 2.5 Language model

- **Overview** — A language model aims at estimating the probability of a sentence $P(y)$.

- **$n$-gram model** — This model is a naive approach aiming at quantifying the probability that an expression appears in a corpus by counting its number of appearance in the training data.

- **Perplexity** — Language models are commonly assessed using the perplexity metric, also known as PP, which can be interpreted as the inverse probability of the dataset normalized by the number of words $T$. The perplexity is such that the lower, the better and is defined as follows:

$$
\boxed{\textrm{PP}=\prod_{t=1}^{T}\left(\frac{1}{\sum_{j=1}^{|V|}y_j^{(t)}\cdot \widehat{y}_j^{(t)}}\right)^{\frac{1}{T}}}
$$

_Remark: PP is commonly used in t-SNE._

### 2.6 Machine translation

- **Overview** — A machine translation model is similar to a language model except it has an encoder network placed before. For this reason, it is sometimes referred as a conditional language model. The goal is to find a sentence $y$ such that:

$$
\boxed{y=\underset{y^{<1>},...,y^{<T_y>}}{\textrm{arg max}}\;P\left(y^{<1>},...,y^{<T_y>}|x\right)}
$$

- **Beam search** — It is a heuristic search algorithm used in machine translation and speech recognition to find the likeliest sentence $y$ given an input $x$.

  - Step 1: Find top $B$ likely words $y^{<1>}$
  - Step 2: Compute conditional probabilities $y^{<k>}|x,y^{<1>},...,y^{<k-1>}$
  - Step 3: Keep top $B$ combinations $x,y^{<1>},...,y^{<k>}$

*[Figure: Beam search decoding diagram. An encoder processes the final input state $x^{<T_x>}$, the decoder first finds the top $B$ likely first words $y^{<1>}$, then repeatedly computes conditional probabilities for $y^{<k>}|x,y^{<1>},...,y^{<k-1>}$, keeps the top $B$ partial combinations $x,y^{<1>},...,y^{<k>}$, and continues until an end-of-sentence token $y^{<T_y>}=\langle\textrm{EOS}\rangle$ stops the process; dashed boxes mark repeated beam-expansion stages.]*


Remark: if the beam width is set to 1, then this is equivalent to a naive greedy search.

- **Beam width** — The beam width $B$ is a parameter for beam search. Large values of $B$ yield to better result but with slower performance and increased memory. Small values of $B$ lead to worse results but is less computationally intensive. A standard value for $B$ is around 10.

- **Length normalization** — In order to improve numerical stability, beam search is usually applied the following normalized objective, often called the normalized log-likelihood objective, defined as:

$$
\textrm{Objective} = \frac{1}{T_y^\alpha}\sum_{t=1}^{T_y}\log\left[p\left(y^{<t>}\mid x,y^{<1>},...,y^{<t-1>}\right)\right]
$$

Remark: the parameter $\alpha$ can be seen as a softener, and its value is usually between 0.5 and 1.

- **Error analysis** — When obtaining a predicted translation $\hat{y}$ that is bad, one can wonder why we did not get a good translation $y^*$ by performing the following error analysis:

| Case | $P(y^*\mid x) > P(\hat{y}\mid x)$ | $P(y^*\mid x) \leq P(\hat{y}\mid x)$ |
|---|---|---|
| **Root cause** | Beam search faulty | RNN faulty |
| **Remedies** | Increase beam width | - Try different architecture<br>- Regularize<br>- Get more data |

- **Bleu score** — The bilingual evaluation understudy (bleu) score quantifies how good a machine translation is by computing a similarity score based on $n$-gram precision. It is defined as follows:

$$
\textrm{bleu score} = \exp\left(\frac{1}{n}\sum_{k=1}^{n}p_k\right)
$$

where $p_n$ is the bleu score on $n$-gram only defined as follows:

$$
p_n = \frac{\sum_{\textrm{n-gram}\in\hat{y}}\textrm{count}_{\textrm{clip}}(\textrm{n-gram})}{\sum_{\textrm{n-gram}\in\hat{y}}\textrm{count}(\textrm{n-gram})}
$$

Remark: a brevity penalty may be applied to short predicted translations to prevent an artificially inflated bleu score.

### 2.7 Attention

- **Attention model** — This model allows an RNN to pay attention to specific parts of the input that is considered as being important, which improves the performance of the resulting model in practice. By noting $\alpha^{<t,t'>}$ the amount of attention that the output $y^{<t>}$ should pay to activation $a^{<t'>}$ and $c^{<t>}$ the context at time $t$, we have:

$$
c^{<t>} = \sum_{t'}\alpha^{<t,t'>}a^{<t'>} \quad \textrm{with} \quad \sum_{t'}\alpha^{<t,t'>}=1
$$

Remark: the attention scores are commonly used in image captioning and machine translation.

*[Figure: Two teddy-bear image-captioning examples illustrate visual attention. In the left image, a bright attention spot is centered on the teddy bear's face while the caption reads “A cute teddy bear is reading Persian literature,” with “A cute teddy bear” emphasized; in the right image, the attention spot is on the open book while the same caption emphasizes “reading Persian literature.” The purpose is to show that an attention model focuses on different image regions for different generated words.]*

- **Attention weight** — The amount of attention that the output $y^{<t>}$ should pay to the activation $a^{<t'>}$ is given by $\alpha^{<t,t'>}$ computed as follows:

$$
\alpha^{<t,t'>} = \frac{\exp(e^{<t,t'>})}{\sum_{t''=1}^{T_x}\exp(e^{<t,t''>})}
$$

Remark: computation complexity is quadratic with respect to $T_x$.

* * *

## 3 Deep Learning Tips and Tricks

### 3.1 Data processing

- **Data augmentation** — Deep learning models usually need a lot of data to be properly trained. It is often useful to get more data from the existing ones using data augmentation techniques. The main ones are summed up in the table below. More precisely, given the following input image, here are the techniques that we can apply:

| Original | Flip | Rotation | Random crop |
|---|---|---|---|
| *Teddy bear reading an open book, unchanged.* | *Same teddy-bear image flipped horizontally while preserving semantics.* | *Same teddy-bear image rotated by a slight angle, tilting the horizon.* | *Random close crop focusing on one part of the teddy-bear image.* |
| - Image without<br><br>any modification | - Flipped with respect<br>to an axis for which<br>the meaning of the<br>image is preserved | - Rotation with<br>a slight angle<br>- Simulates incorrect<br>horizon calibration | - Random focus<br>on one part of<br>the image<br>- Several random<br>crops can be<br>done in a row |

| Color shift | Noise addition | Information loss | Contrast change |
|---|---|---|---|
| *Teddy-bear image with RGB color nuances shifted to a warmer reddish tone.* | *Teddy-bear image with visible noise/grain added and lower quality appearance.* | *Teddy-bear image with black rectangles masking parts of the image.* | *Teddy-bear image with luminosity and contrast increased.* |
| - Nuances of RGB<br>is slightly changed<br>- Captures noise<br>that can occur<br>with light exposure | - Addition of noise<br>- More tolerance to<br>quality variation of<br>inputs | - Parts of image<br>ignored<br>- Mimics potential<br>loss of parts of image | - Luminosity changes<br>- Controls difference<br>in exposition due<br>to time of day |

- **Batch normalization** — It is a step of hyperparameter $\gamma,\beta$ that normalizes the batch $\{x_i\}$. By noting $\mu_B,\sigma_B^2$ the mean and variance of that we want to correct to the batch, it is done as follows:

$$
x_i \leftarrow \gamma\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}+\beta
$$

It is usually done after a fully connected/convolutional layer and before a non-linearity layer and aims at allowing higher learning rates and reducing the strong dependence on initialization.

### 3.2 Training a neural network

#### 3.2.1 Definitions

- **Epoch** — In the context of training a model, epoch is a term used to refer to one iteration where the model sees the whole training set to update its weights.

- **Mini-batch gradient descent** — During the training phase, updating weights is usually not based on the whole training set at once due to computation complexities or one data point due to noise issues. Instead, the update step is done on mini-batches, where the number of data points in a batch is a hyperparameter that we can tune.

- **Loss function** — In order to quantify how a given model performs, the loss function $L$ is usually used to evaluate to what extent the actual outputs $y$ are correctly predicted by the model outputs $z$.

- **Cross-entropy loss** — In the context of binary classification in neural networks, the cross-entropy loss $L(z,y)$ is commonly used and is defined as follows:

$$
L(z,y)=-\left[y\log(z)+(1-y)\log(1-z)\right]
$$

#### 3.2.2 Finding optimal weights

- **Backpropagation** — Backpropagation is a method to update the weights in the neural network by taking into account the actual output and the desired output. The derivative with respect to each weight $w$ is computed using the chain rule.

$$
\frac{\partial L}{\partial f(x)}\cdot\frac{\partial f(x)}{\partial x}
$$

*[Figure: Backpropagation chain-rule diagram with a central function node $f$, green forward arrow from input $x$ to output $f(x)$, and red backward arrow carrying gradients. The labels show $\frac{\partial L}{\partial f(x)}$ at the output side and $\frac{\partial L}{\partial f(x)}\cdot\frac{\partial f(x)}{\partial x}$ at the input side, illustrating how gradients are propagated backward through a function.]*

Using this method, each weight is updated with the rule:

$$
w \leftarrow w - \alpha\frac{\partial L(z,y)}{\partial w}
$$

- **Updating weights** — In a neural network, weights are updated as follows:

  - Step 1: Take a batch of training data and perform forward propagation to compute the loss.
  - Step 2: Backpropagate the loss to get the gradient of the loss with respect to each weight.
  - Step 3: Use the gradients to update the weights of the network.

*[Figure: Three-step neural-network training diagram. Step 1 shows forward propagation with a green arrow through layered neurons from inputs to outputs; Step 2 shows backpropagation with a red arrow flowing backward from outputs to inputs; Step 3 shows the weights update on the same network with a circular update arrow, summarizing the training loop.]*

### 3.3 Parameter tuning

#### 3.3.1 Weights initialization

- **Xavier initialization** — Instead of initializing the weights in a purely random manner, Xavier initialization enables to have initial weights that take into account characteristics that are unique to the architecture.

- **Transfer learning** — Training a deep learning model requires a lot of data and more importantly a lot of time. It is often useful to take advantage of pre-trained weights on huge datasets that took days/weeks to train, and leverage it towards our use case. Depending on how much data we have at hand, here are the different ways to leverage this:

| Training size | Illustration | Explanation |
|---|---|---|
| Small | *Neural network in which almost all hidden layers are frozen/greyed, and only the final softmax/output connections are highlighted for training.* | Freezes all layers,<br>trains weights on softmax |
| Medium | *Neural network in which most early layers are frozen/greyed, while the last layers and output softmax are highlighted for training.* | Freezes most layers,<br>trains weights on last<br>layers and softmax |
| Large | *Neural network in which all layers and the output softmax are highlighted for training, initialized from pre-trained weights.* | Trains weights on layers<br>and softmax by initializing<br>weights on pre-trained ones |

#### 3.3.2 Optimizing convergence

- **Learning rate** — The learning rate, often noted $\alpha$ or sometimes $\eta$, indicates at which pace the weights get updated. It can be fixed or adaptively changed. The current most popular method is called Adam, which is a method that adapts the learning rate.

- **Adaptive learning rates** — Letting the learning rate vary when training a model can reduce the training time and improve the numerical optimal solution. While Adam optimizer is the most commonly used technique, others can also be useful. They are summed up in the table below:

| Method | Explanation | Update of $w$ | Update of $b$ |
|---|---|---|---|
| Momentum | - Dampens oscillations<br>- Improvement to SGD<br>- 2 parameters to tune | $w-\alpha v_{dw}$ | $b-\alpha v_{db}$ |
| RMSprop | - Root Mean Square propagation<br>- Speeds up learning algorithm<br>by controlling oscillations | $w-\alpha\frac{dw}{\sqrt{s_{dw}}}$ | $b\leftarrow b-\alpha\frac{db}{\sqrt{s_{db}}}$ |
| Adam | - Adaptive Moment estimation<br>- Most popular method<br>- 4 parameters to tune | $w-\alpha\frac{v_{dw}}{\sqrt{s_{dw}}+\epsilon}$ | $b\leftarrow b-\alpha\frac{v_{db}}{\sqrt{s_{db}}+\epsilon}$ |

Remark: other methods include Adadelta, Adagrad and SGD.

### 3.4 Regularization

- **Dropout** — Dropout is a technique used in neural networks to prevent overfitting the training data by dropping out neurons with probability $p>0$. It forces the model to avoid relying too much on particular sets of features.

*[Figure: Dropout neural-network diagram showing several layers of neurons, with some neurons greyed out/removed and others active. Connections pass only through active neurons to the output, illustrating random neuron dropout as a regularization method.]*

Remark: most deep learning frameworks parametrize dropout through the 'keep' parameter $1-p$.

- **Weight regularization** — In order to make sure that the weights are not too large and that the model is not overfitting the training set, regularization techniques are usually performed on the model weights. The main ones are summed up in the table below:

| LASSO | Ridge | Elastic Net |
|---|---|---|
| - Shrinks coefficients to 0<br>- Good for variable selection | Makes coefficients smaller | Tradeoff between variable<br>selection and small coefficients |
| *Contour plot with diamond-shaped $L_1$ constraint $\lVert\theta\rVert_1\leq 1$, red ellipses centered at $\theta^*$, and the optimum at a diamond corner to promote sparsity.* | *Contour plot with circular $L_2$ constraint $\lVert\theta\rVert_2^2\leq 1$, red ellipses centered at $\theta^*$, and the optimum on the circle to shrink coefficients.* | *Contour plot with elastic-net constraint $(1-\alpha)\lVert\theta\rVert_1+\alpha\lVert\theta\rVert_2^2\leq 1$, red ellipses centered at $\theta^*$, and the optimum on the combined constraint region.* |
| $...+\lambda\lVert\theta\rVert_1$<br>$\lambda\in\mathbb{R}$ | $...+\lambda\lVert\theta\rVert_2^2$<br>$\lambda\in\mathbb{R}$ | $...+\lambda\left[(1-\alpha)\lVert\theta\rVert_1+\alpha\lVert\theta\rVert_2^2\right]$<br>$\lambda\in\mathbb{R}, \alpha\in[0,1]$ |

- **Early stopping** — This regularization technique stops the training process as soon as the validation loss reaches a plateau or starts to increase.

*[Figure: Early stopping plot with y-axis labeled Error and x-axis labeled Epochs. Red Training error decreases monotonically, while blue Validation error decreases then rises; a black X and dashed vertical line mark the early stopping point near the validation minimum/plateau. The purpose is to stop training before validation error worsens.]*

### 3.5 Good practices

- **Overfitting small batch** — When debugging a model, it is often useful to make quick tests to see if there is any major issue with the architecture of the model itself. In particular, in order to make sure that the model can be properly trained, a mini-batch is passed inside the network to see if it can overfit on it. If it cannot, it means that the model is either too complex or not complex enough to even overfit on a small batch, let alone a normal-sized training set.

- **Gradient checking** — Gradient checking is a method used during the implementation of the backward pass of a neural network. It compares the value of the analytical gradient to the numerical gradient at given points and plays the role of a sanity-check for correctness.

|  | Numerical gradient | Analytical gradient |
|---|---|---|
| **Formula** | $\frac{df}{dx}(x)\approx\frac{f(x+h)-f(x-h)}{2h}$ | $\frac{df}{dx}(x)=f'(x)$ |
| **Comments** | - Expensive; loss has to be<br>computed two times per dimension<br>- Used to verify correctness<br>of analytical implementation<br>- Trade-off in choosing $h$<br>not too small (numerical instability)<br>nor too large (poor gradient approx.) | - 'Exact' result<br><br>- Direct computation<br><br>- Used in the final implementation |

* * *


---

# Artificial Intelligence — Super VIP Cheatsheet (Stanford CS 221)

*Afshine Amidi and Shervine Amidi*

## 1 Reflex-based models

### 1.1 Linear predictors

In this section, we will go through reflex-based models that can improve with experience, by going through samples that have input-output pairs.

- **Feature vector** — The feature vector of an input $x$ is noted $\phi(x)$ and is such that:

$$
\phi(x)=\begin{bmatrix}
\phi_1(x)\\
\vdots\\
\phi_d(x)
\end{bmatrix}\in\mathbb{R}^d
$$

- **Score** — The score $s(x,w)$ of an example $(\phi(x),y)\in\mathbb{R}^d\times\mathbb{R}$ associated to a linear model of weights $w\in\mathbb{R}^d$ is given by the inner product:

$$
s(x,w)=w\cdot\phi(x)
$$

#### 1.1.1 Classification

- **Linear classifier** — Given a weight vector $w\in\mathbb{R}^d$ and a feature vector $\phi(x)\in\mathbb{R}^d$, the binary linear classifier $f_w$ is given by:

$$
f_w(x)=\operatorname{sign}(s(x,w))=
\begin{cases}
+1 & \text{if } w\cdot\phi(x)>0\\
-1 & \text{if } w\cdot\phi(x)<0\\
? & \text{if } w\cdot\phi(x)=0
\end{cases}
$$

*[Figure: A two-class scatter plot with blue points on the upper-left side and red points on the lower-right side separated by a diagonal decision boundary. The line is labeled $w\cdot\phi(x)=0$, with the blue side labeled $w\cdot\phi(x)>0$ and the red side labeled $w\cdot\phi(x)<0$, illustrating how a linear classifier separates classes.]*

- **Margin** — The margin $m(x,y,w)\in\mathbb{R}$ of an example $(\phi(x),y)\in\mathbb{R}^d\times\{-1,+1\}$ associated to a linear model of weights $w\in\mathbb{R}^d$ quantifies the confidence of the prediction: larger values are better. It is given by:

$$
m(x,y,w)=s(x,w)\times y
$$

#### 1.1.2 Regression

- **Linear regression** — Given a weight vector $w\in\mathbb{R}^d$ and a feature vector $\phi(x)\in\mathbb{R}^d$, the output of a linear regression of weights $w$ denoted as $f_w$ is given by:

$$
f_w(x)=s(x,w)
$$

- **Residual** — The residual $\operatorname{res}(x,y,w)\in\mathbb{R}$ is defined as being the amount by which the prediction $f_w(x)$ overshoots the target $y$:

$$
\operatorname{res}(x,y,w)=f_w(x)-y
$$

### 1.2 Loss minimization

- **Loss function** — A loss function $\operatorname{Loss}(x,y,w)$ quantifies how unhappy we are with the weights $w$ of the model in the prediction task of output $y$ from input $x$. It is a quantity we want to minimize during the training process.

- **Classification case** — The classification of a sample $x$ of true label $y\in\{-1,+1\}$ with a linear model of weights $w$ can be done with the predictor $f_w(x)\triangleq\operatorname{sign}(s(x,w))$. In this situation, a metric of interest quantifying the quality of the classification is given by the margin $m(x,y,w)$, and can be used with the following loss functions:

| Name | Zero-one loss | Hinge loss | Logistic loss |
|---|---|---|---|
| $\operatorname{Loss}(x,y,w)$ | $\mathbf{1}_{\{m(x,y,w)\leq 0\}}$ | $\max(1-m(x,y,w),0)$ | $\log(1+e^{-m(x,y,w)})$ |
| Illustration | *Plot of $\operatorname{Loss}_{0/1}$ versus $m(x,y,w)$: a step function equal to 1 for nonpositive margin and 0 after margin 0, with marks at 0 and 1.* | *Plot of $\operatorname{Loss}_{\text{hinge}}$ versus $m(x,y,w)$: a red line decreasing linearly to 0 at margin 1, then staying at 0; marks at 0 and 1 show the margin threshold.* | *Plot of $\operatorname{Loss}_{\text{logistic}}$ versus $m(x,y,w)$: an orange smooth decreasing convex curve approaching 0 as the margin grows; marks at 0 and 1 show reference margins.* |

- **Regression case** — The prediction of a sample $x$ of true label $y\in\mathbb{R}$ with a linear model of weights $w$ can be done with the predictor $f_w(x)\triangleq s(x,w)$. In this situation, a metric of interest quantifying the quality of the regression is given by the margin $\operatorname{res}(x,y,w)$ and can be used with the following loss functions:

| Name | Squared loss | Absolute deviation loss |
|---|---|---|
| $\operatorname{Loss}(x,y,w)$ | $(\operatorname{res}(x,y,w))^2$ | $|\operatorname{res}(x,y,w)|$ |
| Illustration | *Plot of $\operatorname{Loss}_{\text{squared}}$ versus $\operatorname{res}(x,y,w)$: a blue parabola with minimum 0 at residual 0.* | *Plot of $\operatorname{Loss}_{\text{absolute}}$ versus $\operatorname{res}(x,y,w)$: a pink V-shaped curve with minimum 0 at residual 0.* |

- **Loss minimization framework** — In order to train a model, we want to minimize the training loss is defined as follows:

$$
\operatorname{TrainLoss}(w)=\frac{1}{|\mathcal{D}_{\text{train}}|}\sum_{(x,y)\in\mathcal{D}_{\text{train}}}\operatorname{Loss}(x,y,w)
$$

### 1.3 Non-linear predictors

- **$k$-nearest neighbors** — The $k$-nearest neighbors algorithm, commonly known as $k$-NN, is a non-parametric approach where the response of a data point is determined by the nature of its $k$ neighbors from the training set. It can be used in both classification and regression settings.

*[Figure: Three side-by-side two-dimensional classification examples for $k$-NN with blue and red training points. The background decision regions are colored blue/red. Panels labeled $k=1$, $k=3$, and $k=11$ show that small $k$ produces a highly flexible boundary while larger $k$ produces a smoother, higher-bias boundary.]*

*Remark: the higher the parameter $k$, the higher the bias, and the lower the parameter $k$, the higher the variance.*

- **Neural networks** — Neural networks are a class of models that are built with layers. Commonly used types of neural networks include convolutional and recurrent neural networks. The vocabulary around neural networks architectures is described in the figure below:

*[Figure: A feed-forward neural network diagram with an input layer of green nodes, hidden layer 1 and subsequent hidden layers of blue nodes, an ellipsis indicating more layers up to hidden layer $k$, and an output layer of red nodes. Fully connected arrows run between consecutive layers, illustrating layered neural network architecture vocabulary.]*

By noting $i$ the $i^{\text{th}}$ layer of the network and $j$ the $j^{\text{th}}$ hidden unit of the layer, we have:

$$
z_j^{(i)}=w_j^{(i)T}x+b_j^{(i)}
$$

where we note $w,b,x,z$ the weight, bias, input and non-activated output of the neuron respectively.

### 1.4 Stochastic gradient descent

- **Gradient descent** — By noting $\eta\in\mathbb{R}$ the learning rate (also called step size), the update rule for gradient descent is expressed with the learning rate and the loss function $\operatorname{Loss}(x,y,w)$ as follows:

$$
w\leftarrow w-\eta\nabla_w\operatorname{Loss}(x,y,w)
$$

*[Figure: A blue contour plot of a loss surface with nested ellipses around a minimum. An arrow from an initial point $w$ points downhill in the direction $-\nabla_w\operatorname{Loss}(x,y,w)$, and the update rule $w\leftarrow w-\eta\nabla_w\operatorname{Loss}(x,y,w)$ is shown above to illustrate gradient descent.]*

- **Stochastic updates** — Stochastic gradient descent (SGD) updates the parameters of the model one training example $(\phi(x),y)\in\mathcal{D}_{\text{train}}$ at a time. This method leads to sometimes noisy, but fast updates.

- **Batch updates** — Batch gradient descent (BGD) updates the parameters of the model one batch of examples (e.g. the entire training set) at a time. This method computes stable update directions, at a greater computational cost.

### 1.5 Fine-tuning models

- **Hypothesis class** — A hypothesis class $\mathcal{F}$ is the set of possible predictors with a fixed $\phi(x)$ and varying $w$:

$$
\mathcal{F}=\{f_w:w\in\mathbb{R}^d\}
$$

- **Logistic function** — The logistic function $\sigma$, also called the sigmoid function, is defined as:

$$
\forall z\in]-\infty,+\infty[,\quad \sigma(z)=\frac{1}{1+e^{-z}}
$$

*Remark: we have $\sigma'(z)=\sigma(z)(1-\sigma(z))$.*

- **Backpropagation** — The forward pass is done through $f_i$, which is the value for the subexpression rooted at $i$, while the backward pass is done through $g_i=\frac{\partial\operatorname{out}}{\partial f_i}$ and represents how $f_i$ influences the output.

*[Figure: A computation graph fragment with an input $x$ feeding into node $f_i$, then to $f_i(x)$, with a forward green arrow. A backward pink arrow is labeled $g_i(x)=\frac{\partial\operatorname{out}}{\partial f_i(x)}$ and a local derivative is labeled $\frac{\partial f_i(x)}{\partial x}$, illustrating forward values and backward gradients in backpropagation.]*

- **Approximation and estimation error** — The approximation error $\operatorname{Err}_{\text{approx}}$ represents how far the entire hypothesis class $\mathcal{F}$ is from the target predictor $g^*$, while the estimation error $\operatorname{Err}_{\text{est}}$ quantifies how good the predictor $f$ is with respect to the best predictor $f^*$ of the hypothesis class $\mathcal{F}$.

*[Figure: A nested-set diagram with a large oval $\Omega$ containing the hypothesis class region $\mathcal{F}$; inside $\mathcal{F}$ are $f^*$ and an estimated predictor $f$, while the target $g^*$ lies outside $\mathcal{F}$. The gap from $g^*$ to $f^*$ is labeled $\operatorname{Err}_{\text{approx}}$, and the gap from $f^*$ to $f$ is labeled $\operatorname{Err}_{\text{est}}$, illustrating approximation versus estimation error.]*

- **Regularization** — The regularization procedure aims at avoiding the model to overfit the data and thus deals with high variance issues. The following table sums up the different types of commonly used regularization techniques:

| LASSO | Ridge | Elastic Net |
|---|---|---|
| - Shrinks coefficients to 0<br>- Good for variable selection | Makes coefficients smaller | Tradeoff between variable selection and small coefficients |
| *Constraint diagram with elliptical contours of $\theta$ and a blue diamond $\ell_1$ ball labeled $\|\theta\|_1\leq 1$; the diamond corners encourage sparse coefficients.* | *Constraint diagram with elliptical contours of $\theta$ and a blue circular $\ell_2$ ball labeled $\|\theta\|_2\leq 1$; the circle shrinks coefficients smoothly.* | *Constraint diagram with elliptical contours of $\theta$ and a combined blue elastic-net constraint labeled $(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2\leq 1$, combining sparsity and shrinkage.* |
| $\ldots +\lambda\|\theta\|_1$<br>$\lambda\in\mathbb{R}$ | $\ldots +\lambda\|\theta\|_2^2$<br>$\lambda\in\mathbb{R}$ | $\ldots +\lambda\left[(1-\alpha)\|\theta\|_1+\alpha\|\theta\|_2^2\right]$<br>$\lambda\in\mathbb{R},\ \alpha\in[0,1]$ |

- **Hyperparameters** — Hyperparameters are the properties of the learning algorithm, and include features, regularization parameter $\lambda$, number of iterations $T$, step size $\eta$, etc.

- **Sets vocabulary** — When selecting a model, we distinguish 3 different parts of the data that we have as follows:

| Training set | Validation set | Testing set |
|---|---|---|
| - Model is trained<br>- Usually 80 of the dataset | - Model is assessed<br>- Usually 20 of the dataset<br>- Also called hold-out | - Model gives predictions<br>- Unseen data<br>- or development set |

Once the model has been chosen, it is trained on the entire dataset and tested on the unseen test set. These are represented in the figure below:

*[Figure: A horizontal split diagram. Under “Dataset,” a long rounded bar shows a large red training segment and a smaller green validation segment. To the right, under “Unseen data,” a separate blue rounded bar is labeled Test. This illustrates training/validation/test data partitions.]*

### 1.6 Unsupervised Learning

The class of unsupervised learning methods aims at discovering the structure of the data, which may have of rich latent structures.

#### 1.6.1 $k$-means

- **Clustering** — Given a training set of input points $\mathcal{D}_{\text{train}}$, the goal of a clustering algorithm is to assign each point $\phi(x_i)$ to a cluster $z_i\in\{1,...,k\}$.

- **Objective function** — The loss function for one of the main clustering algorithms, $k$-means, is given by:

$$
\operatorname{Loss}_{k\text{-means}}(x,\mu)=\sum_{i=1}^m\|\phi(x_i)-\mu_{z_i}\|^2
$$

- **Algorithm** — After randomly initializing the cluster centroids $\mu_1,\mu_2,...,\mu_k\in\mathbb{R}^n$, the $k$-means algorithm repeats the following step until convergence:

$$
z_i=\operatorname*{argmin}_j\|\phi(x_i)-\mu_j\|^2
\quad\text{and}\quad
\mu_j=\frac{\sum_{i=1}^m\mathbf{1}_{\{z_i=j\}}\phi(x_i)}{\sum_{i=1}^m\mathbf{1}_{\{z_i=j\}}}
$$

*[Figure: A four-stage $k$-means illustration. The first panel shows scattered points and initial means marked by colored plus signs (“Means initialization”); the second panel shows colored Voronoi-like cluster assignments (“Cluster assignment”); the third panel shows centroids moving to cluster centers (“Means update”); the final panel shows stable colored clusters and means (“Convergence”).]*

#### 1.6.2 Principal Component Analysis

- **Eigenvalue, eigenvector** — Given a matrix $A\in\mathbb{R}^{n\times n}$, $\lambda$ is said to be an eigenvalue of $A$ if there exists a vector $z\in\mathbb{R}^n\setminus\{0\}$, called eigenvector, such that we have:

$$
Az=\lambda z
$$

- **Spectral theorem** — Let $A\in\mathbb{R}^{n\times n}$. If $A$ is symmetric, then $A$ is diagonalizable by a real orthogonal matrix $U\in\mathbb{R}^{n\times n}$. By noting $\Lambda=\operatorname{diag}(\lambda_1,...,\lambda_n)$, we have:

$$
\exists\Lambda\text{ diagonal},\quad A=U\Lambda U^T
$$

*Remark: the eigenvector associated with the largest eigenvalue is called principal eigenvector of matrix $A$.*

- **Algorithm** — The Principal Component Analysis (PCA) procedure is a dimension reduction technique that projects the data on $k$ dimensions by maximizing the variance of the data as follows:

- Step 1: Normalize the data to have a mean of 0 and standard deviation of 1.

$$
x_j^{(i)}\leftarrow\frac{x_j^{(i)}-\mu_j}{\sigma_j}
\quad\text{where}\quad
\mu_j=\frac{1}{m}\sum_{i=1}^m x_j^{(i)}
\quad\text{and}\quad
\sigma_j^2=\frac{1}{m}\sum_{i=1}^m\left(x_j^{(i)}-\mu_j\right)^2
$$

- Step 2: Compute $\Sigma=\frac{1}{m}\sum_{i=1}^m x^{(i)}x^{(i)T}\in\mathbb{R}^{n\times n}$, which is symmetric with real eigenvalues.

- Step 3: Compute $u_1,...,u_k\in\mathbb{R}^n$ the $k$ orthogonal principal eigenvectors of $\Sigma$, i.e. the orthogonal eigenvectors of the $k$ largest eigenvalues.

- Step 4: Project the data on $\operatorname{span}(u_1,...,u_k)$. This procedure maximizes the variance among all $k$-dimensional spaces.

*[Figure: A three-panel PCA diagram. The first panel shows two-dimensional data in feature space with axes $X_1$ and $X_2$; the second panel overlays principal component directions on the data; the third panel shows the data in principal component space with axes $PC_1$ and $PC_2$, illustrating projection onto directions of maximum variance.]*

## 2 States-based models

### 2.1 Search optimization

In this section, we assume that by accomplishing action $a$ from state $s$, we deterministically arrive in state $\operatorname{Succ}(s,a)$. The goal here is to determine a sequence of actions $(a_1,a_2,a_3,a_4,...)$ that starts from an initial state and leads to an end state. In order to solve this kind of problem, our objective will be to find the minimum cost path by using states-based models.

#### 2.1.1 Tree search

This category of states-based algorithms explores all possible states and actions. It is quite memory efficient, and is suitable for huge state spaces but the runtime can become exponential in the worst cases.

*[Figure: Five small tree diagrams comparing valid and invalid tree structures. The invalid examples are labeled Self-loop, More than a parent, Cycle, and More than a root with red X marks; the valid example is labeled Valid tree with a green check mark. The figure teaches the constraints that define a valid tree.]*

- **Search problem** — A search problem is defined with:

  - a starting state $s_{\text{start}}$
  - possible actions $\operatorname{Actions}(s)$ from state $s$
  - action cost $\operatorname{Cost}(s,a)$ from state $s$ with action $a$
  - successor $\operatorname{Succ}(s,a)$ of state $s$ after action $a$
  - whether an end state was reached $\operatorname{IsEnd}(s)$

*[Figure: A branching transition diagram from a state $s$ to successors $\operatorname{Succ}(s,a_1)$, $\operatorname{Succ}(s,a_2)$, and $\operatorname{Succ}(s,a_3)$ along arrows labeled $\operatorname{Cost}(s,a_1)$, $\operatorname{Cost}(s,a_2)$, and $\operatorname{Cost}(s,a_3)$, showing the components of a search problem.]*

The objective is to find a path that minimizes the cost.

- **Backtracking search** — Backtracking search is a naive recursive algorithm that tries all possibilities to find the minimum cost path. Here, action costs can be either positive or negative.

- **Breadth-first search (BFS)** — Breadth-first search is a graph search algorithm that does a level-by-level traversal. We can implement it iteratively with the help of a queue that stores at each step future nodes to be visited. For this algorithm, we can assume action costs to be equal to a constant $c\geq0$.

*[Figure: A rooted tree with green nodes numbered in breadth-first visitation order: 1 at the root, then 2, 3, 4 on the next level, then 5, 6, 7, and finally 8, 9, 10 below node 7. Arrows show the tree edges, illustrating BFS level-order traversal.]*

- **Depth-first search (DFS)** — Depth-first search is a search algorithm that traverses a graph by following each path as deep as it can. We can implement it recursively, or iteratively with the help of a stack that stores at each step future nodes to be visited. For this algorithm, action costs are assumed to be equal to 0.

*[Figure: A rooted tree with green nodes numbered in depth-first visitation order: root 1, right child 2, middle subtree 3 then 4 then leaves 5, 6, 7, then 8, and left subtree 9 then 10. Arrows show edges, illustrating DFS traversal down paths before backtracking.]*

- **Iterative deepening** — The iterative deepening trick is a modification of the depth-first search algorithm so that it stops after reaching a certain depth, which guarantees optimality when all action costs are equal. Here, we assume that action costs are equal to a constant $c\geq0$.

- **Tree search algorithms summary** — By noting $b$ the number of actions per state, $d$ the solution depth, and $D$ the maximum depth, we have:

| Algorithm | Action costs | Space | Time |
|---|---|---|---|
| Backtracking search | any | $O(D)$ | $O(b^D)$ |
| Breadth-first search | $c\geq0$ | $O(b^d)$ | $O(b^d)$ |
| Depth-first search | 0 | $O(D)$ | $O(b^D)$ |
| DFS-Iterative deepening | $c\geq0$ | $O(d)$ | $O(b^d)$ |

#### 2.1.2 Graph search

This category of states-based algorithms aims at constructing optimal paths, enabling exponential savings. In this section, we will focus on dynamic programming and uniform cost search.

- **Graph** — A graph is comprised of a set of vertices $V$ (also called nodes) as well as a set of edges $E$ (also called links).

*[Figure: An undirected graph with vertices $V_1$ through $V_8$ and edges labeled $E_1$ through $E_{10}$. It shows nodes connected by multiple links, illustrating graph terminology for vertices and edges.]*

*Remark: a graph is said to be acyclic when there is no cycle.*

- **State** — A state is a summary of all past actions sufficient to choose future actions optimally.

- **Dynamic programming** — Dynamic programming (DP) is a backtracking search algorithm with memoization (i.e. partial results are saved) whose goal is to find a minimum cost path from state $s_{\text{start}}$ to an end state $s_{\text{end}}$. It can potentially have exponential savings compared to traditional graph search algorithms, and has the property to only work for acyclic graphs. For any given state $s$, the future cost is computed as follows:

$$
\operatorname{FutureCost}(s)=
\begin{cases}
0 & \text{if }\operatorname{IsEnd}(s)\\
\displaystyle\min_{a\in\operatorname{Actions}(s)}\left[\operatorname{Cost}(s,a)+\operatorname{FutureCost}(\operatorname{Succ}(s,a))\right] & \text{otherwise}
\end{cases}
$$

*[Figure: A grid path-planning diagram with $s_{\text{start}}$ at the upper-left and $s_{\text{end}}$ at the lower-right. Colored cells and arrows show future-cost directions, emphasizing a bottom-to-top dynamic programming computation where future costs guide choices toward the end state.]*

*Remark: the figure above illustrates a bottom-to-top approach whereas the formula provides the intuition of a top-to-bottom problem resolution.*

- **Types of states** — The table below presents the terminology when it comes to states in the context of uniform cost search:


| State | Explanation |
|---|---|
| Explored $\mathcal{E}$ | States for which the optimal path has already been found |
| Frontier $\mathcal{F}$ | States seen for which we are still figuring out how to get there with the cheapest cost |
| Unexplored $\mathcal{U}$ | States not seen yet |

- **Uniform cost search** — Uniform cost search (UCS) is a search algorithm that aims at finding the shortest path from a state $s_{\text{start}}$ to an end state $s_{\text{end}}$. It explores states $s$ in increasing order of $\operatorname{PastCost}(s)$ and relies on the fact that all action costs are non-negative.

*[Figure: Directed weighted graph for uniform cost search. The start state $s_{\text{start}}$ connects to $A$ with cost 10; $A$ connects to $B$ with cost 10 and to $C$ with cost 30; $B$ connects to $E$ with cost 20; $E$ connects to $F$ with cost 20; $F$ connects to $s_{\text{end}}$ with cost 20. Faded alternative edges include $B$ to $D$ cost 100, $D$ to $C$ cost 20, $D$ to $F$ cost 10, $C$ to $s_{\text{end}}$ cost 20, and $C$ to $D$ cost 10. The figure illustrates UCS expanding cheapest past-cost paths and ignoring more expensive alternatives.]*

_Remark 1: the UCS algorithm is logically equivalent to Dijkstra's algorithm._

_Remark 2: the algorithm would not work for a problem with negative action costs, and adding a positive constant to make them non-negative would not solve the problem since this would end up being a different problem._

- **Correctness theorem** — When a state $s$ is popped from the frontier $\mathcal{F}$ and moved to explored set $\mathcal{E}$, its priority is equal to $\operatorname{PastCost}(s)$ which is the minimum cost from $s_{\text{start}}$ to $s$.

- **Graph search algorithms summary** — By noting $N$ the number of total states, $n$ of which are explored before the end state $s_{\text{end}}$, we have:

| Algorithm | Acyclicity | Costs | Time/space |
|---|---|---|---|
| Dynamic programming | yes | any | $O(N)$ |
| Uniform cost search | no | $c \geq 0$ | $O(n\log(n))$ |

_Remark: the complexity countdown supposes the number of possible actions per state to be constant._

#### 2.1.3 Learning costs

Suppose we are not given the values of $\operatorname{Cost}(s,a)$, we want to estimate these quantities from a training set of minimizing-cost-path sequence of actions $(a_1,a_2,...,a_k)$.

- **Structured perceptron** — The structured perceptron is an algorithm aiming at iteratively learning the cost of each state-action pair. At each step, it:

  - decreases the estimated cost of each state-action of the true minimizing path $y$ given by the training data,
  - increases the estimated cost of each state-action of the current predicted path $y'$ inferred from the learned weights.

_Remark: there are several versions of the algorithm, one of which simplifies the problem to only learning the cost of each action $a$, and the other parametrizes $\operatorname{Cost}(s,a)$ to a feature vector of learnable weights._

#### 2.1.4 A* search

- **Heuristic function** — A heuristic is a function $h$ over states $s$, where each $h(s)$ aims at estimating $\operatorname{FutureCost}(s)$, the cost of the path from $s$ to $s_{\text{end}}$.

*[Figure: Three-node path $s_{\text{start}} \to s \to s_{\text{end}}$. The left segment is labeled $\operatorname{PastCost}(s)$, and a dotted estimate from $s$ to $s_{\text{end}}$ is labeled $h(s) \approx \operatorname{FutureCost}(s)$, illustrating how A* combines known and heuristic costs.]*

- **Algorithm** — A* is a search algorithm that aims at finding the shortest path from a state $s$ to an end state $s_{\text{end}}$. It explores states $s$ in increasing order of $\operatorname{PastCost}(s)+h(s)$. It is equivalent to a uniform cost search with edge costs $\operatorname{Cost}'(s,a)$ given by:

$$
\operatorname{Cost}'(s,a)=\operatorname{Cost}(s,a)+h(\operatorname{Succ}(s,a))-h(s)
$$

_Remark: this algorithm can be seen as a biased version of UCS exploring states estimated to be closer to the end state._

- **Consistency** — A heuristic $h$ is said to be consistent if it satisfies the two following properties:

  - For all states $s$ and actions $a$,

$$
h(s)\leq \operatorname{Cost}(s,a)+h(\operatorname{Succ}(s,a))
$$

*[Figure: Consistency triangle with state $s$, successor $\operatorname{Succ}(s,a)$, and $s_{\text{end}}$. Solid edge from $s$ to successor is labeled $\operatorname{Cost}(s,a)$; dotted heuristic edges are labeled $h(s)$ from $s$ to end and $h(\operatorname{Succ}(s,a))$ from successor to end. The figure shows the triangle-inequality-like condition for a consistent heuristic.]*

  - The end state verifies the following:

$$
h(s_{\text{end}})=0
$$

*[Figure: Single end node $s_{\text{end}}$ with a dotted self-loop labeled $h(s_{\text{end}})=0$, emphasizing that the heuristic has zero estimated future cost at the goal.]*

- **Correctness** — If $h$ is consistent, then A* returns the minimum cost path.

- **Admissibility** — A heuristic $h$ is said to be admissible if we have:

$$
h(s)\leq \operatorname{FutureCost}(s)
$$

- **Theorem** — Let $h(s)$ be a given heuristic. We have:

$$
h(s)\text{ consistent}\Longrightarrow h(s)\text{ admissible}
$$

- **Efficiency** — A* explores all states $s$ satisfying the following equation:

$$
\operatorname{PastCost}(s)\leq \operatorname{PastCost}(s_{\text{end}})-h(s)
$$

*[Figure: A* efficiency diagram with $s_{\text{start}}$, intermediate state $s$, and $s_{\text{end}}$. A solid path from start to $s$ is labeled $\operatorname{PastCost}(s)$; a solid direct path from start to end is labeled $\operatorname{PastCost}(s_{\text{end}})$; and a dotted edge from $s$ to end is labeled $h(s)$. It illustrates that larger heuristic values reduce the set of states A* explores.]*

_Remark: larger values of $h(s)$ is better as this equation shows it will restrict the set of states $s$ going to be explored._

#### 2.1.5 Relaxation

It is a framework for producing consistent heuristics. The idea is to find closed-form reduced costs by removing constraints and use them as heuristics.

- **Relaxed search problem** — The relaxation of search problem $P$ with costs $\operatorname{Cost}$ is noted $P_{\text{rel}}$ with costs $\operatorname{Cost}_{\text{rel}}$, and satisfies the identity:

$$
\operatorname{Cost}_{\text{rel}}(s,a)\leq \operatorname{Cost}(s,a)
$$

- **Relaxed heuristic** — Given a relaxed search problem $P_{\text{rel}}$, we define the relaxed heuristic $h(s)=\operatorname{FutureCost}_{\text{rel}}(s)$ as the minimum cost path from $s$ to an end state in the graph of costs $\operatorname{Cost}_{\text{rel}}(s,a)$.

- **Consistency of relaxed heuristics** — Let $P_{\text{rel}}$ be a given relaxed problem. By theorem, we have:

$$
h(s)=\operatorname{FutureCost}_{\text{rel}}(s)\Longrightarrow h(s)\text{ consistent}
$$

- **Tradeoff when choosing heuristic** — We have to balance two aspects in choosing a heuristic:

  - Computational efficiency: $h(s)=\operatorname{FutureCost}_{\text{rel}}(s)$ must be easy to compute. It has to produce a closed form, easier search and independent subproblems.
  - Good enough approximation: the heuristic $h(s)$ should be close to $\operatorname{FutureCost}(s)$ and we have thus to not remove too many constraints.

- **Max heuristic** — Let $h_1(s),h_2(s)$ be two heuristics. We have the following property:

$$
h_1(s),h_2(s)\text{ consistent}\Longrightarrow h(s)=\max\{h_1(s),h_2(s)\}\text{ consistent}
$$

### 2.2 Markov decision processes

In this section, we assume that performing action $a$ from state $s$ can lead to several states $s'_1,s'_2,...$ in a probabilistic manner. In order to find our way between an initial state and an end state, our objective will be to find the maximum value policy by using Markov decision processes that help us cope with randomness and uncertainty.

#### 2.2.1 Notations

- **Definition** — The objective of a Markov decision process is to maximize rewards. It is defined with:

  - a starting state $s_{\text{start}}$
  - possible actions $\operatorname{Actions}(s)$ from state $s$
  - transition probabilities $T(s,a,s')$ from $s$ to $s'$ with action $a$
  - rewards $\operatorname{Reward}(s,a,s')$ from $s$ to $s'$ with action $a$
  - whether an end state was reached $\operatorname{IsEnd}(s)$
  - a discount factor $0\leq \gamma\leq 1$

*[Figure: MDP transition diagram. State $s$ takes action $a$ to a red decision/chance node $(s,a)$, then transitions to $s_1$, $s_2$, or $s_3$ along edges labeled $T(s,a,s_i):\operatorname{Reward}(s,a,s_i)$. The figure illustrates stochastic outcomes after choosing an action.]*

- **Transition probabilities** — The transition probability $T(s,a,s')$ specifies the probability of going to state $s'$ after action $a$ is taken in state $s$. Each $s'\mapsto T(s,a,s')$ is a probability distribution, which means that:

$$
\forall s,a,\quad \sum_{s'\in\operatorname{States}}T(s,a,s')=1
$$

- **Policy** — A policy $\pi$ is a function that maps each state $s$ to an action $a$, i.e.:

$$
\pi:s\mapsto a
$$

- **Utility** — The utility of a path $(s_0,...,s_k)$ is the discounted sum of the rewards on that path. In other words,

$$
u(s_0,...,s_k)=\sum_{i=1}^{k}\gamma^{i-1}r_i
$$

*[Figure: Reward chain for utility. States $s_0,s_1,s_2,s_3,s_4$ are connected in sequence with rewards $r_1$, $r_2$, $r_3$, and $r_4$ on the first four transitions, with discounted terms indicated as $r_1$, $\gamma r_2$, $\gamma^2 r_3$, and $\gamma^3 r_4$. The figure illustrates the case $k=4$.]*

_Remark: the figure above is an illustration of the case $k=4$._

- **Q-value** — The Q-value of a policy $\pi$ by taking action $a$ from state $s$, also noted $Q_{\pi}(s,a)$, is the expected utility of taking action $a$ from state $s$ and then following policy $\pi$. It is defined as follows:

$$
Q_{\pi}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\pi}(s')\right]
$$

- **Value of a policy** — The value of a policy $\pi$ from state $s$, also noted $V_{\pi}(s)$, is the expected utility by following policy $\pi$ from state $s$ over random paths. It is defined as follows:

$$
V_{\pi}(s)=Q_{\pi}(s,\pi(s))
$$

_Remark: $V_{\pi}(s)$ is equal to $0$ if $s$ is an end state._

#### 2.2.2 Applications

- **Policy evaluation** — Given a policy $\pi$, policy evaluation is an iterative algorithm that computes $V_{\pi}$. It is done as follows:

  - Initialization: for all states $s$, we have

$$
V_{\pi}^{(0)}(s)\leftarrow 0
$$

  - Iteration: for $t$ from $1$ to $T_{\text{PE}}$, we have

$$
\forall s,\quad V_{\pi}^{(t)}(s)\leftarrow Q_{\pi}^{(t-1)}(s,\pi(s))
$$

with

$$
Q_{\pi}^{(t-1)}(s,\pi(s))=\sum_{s'\in\operatorname{States}}T(s,\pi(s),s')\left[\operatorname{Reward}(s,\pi(s),s')+\gamma V_{\pi}^{(t-1)}(s')\right]
$$

_Remark: by noting $S$ the number of states, $A$ the number of actions per state, $S'$ the number of successors and $T$ the number of iterations, then the time complexity is of $O(T_{\text{PE}}SS')$._

- **Optimal Q-value** — The optimal Q-value $Q_{\text{opt}}(s,a)$ of state $s$ with action $a$ is defined to be the maximum Q-value attained by any policy starting. It is computed as follows:

$$
Q_{\text{opt}}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}(s')\right]
$$

- **Optimal value** — The optimal value $V_{\text{opt}}(s)$ of state $s$ is defined as being the maximum value attained by any policy. It is computed as follows:

$$
V_{\text{opt}}(s)=\max_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a)
$$

- **Optimal policy** — The optimal policy $\pi_{\text{opt}}$ is defined as being the policy that leads to the optimal values. It is defined by:

$$
\forall s,\quad \pi_{\text{opt}}(s)=\operatorname*{argmax}_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a)
$$

- **Value iteration** — Value iteration is an algorithm that finds the optimal value $V_{\text{opt}}$ as well as the optimal policy $\pi_{\text{opt}}$. It is done as follows:

  - Initialization: for all states $s$, we have

$$
V_{\text{opt}}^{(0)}(s)\leftarrow 0
$$

  - Iteration: for $t$ from $1$ to $T_{\text{VI}}$, we have

$$
\forall s,\quad V_{\text{opt}}^{(t)}(s)\leftarrow \max_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}^{(t-1)}(s,a)
$$

with

$$
Q_{\text{opt}}^{(t-1)}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}^{(t-1)}(s')\right]
$$

_Remark: if we have either $\gamma<1$ or the MDP graph being acyclic, then the value iteration algorithm is guaranteed to converge to the correct answer._

#### 2.2.3 When unknown transitions and rewards

Now, let's assume that the transition probabilities and the rewards are unknown.

- **Model-based Monte Carlo** — The model-based Monte Carlo method aims at estimating $T(s,a,s')$ and $\operatorname{Reward}(s,a,s')$ using Monte Carlo simulation with:

$$
\widehat{T}(s,a,s')=\frac{\#\text{ times }(s,a,s')\text{ occurs}}{\#\text{ times }(s,a)\text{ occurs}}
$$

and

$$
\widehat{\operatorname{Reward}}(s,a,s')=r\text{ in }(s,a,r,s')
$$

These estimations will be then used to deduce Q-values, including $Q_{\pi}$ and $Q_{\text{opt}}$.

_Remark: model-based Monte Carlo is said to be off-policy, because the estimation does not depend on the exact policy._

- **Model-free Monte Carlo** — The model-free Monte Carlo method aims at directly estimating $Q_{\pi}$, as follows:

$$
\widehat{Q}_{\pi}(s,a)=\text{average of }u_t\text{ where }s_{t-1}=s,\ a_t=a
$$

where $u_t$ denotes the utility starting at step $t$ of a given episode.

_Remark: model-free Monte Carlo is said to be on-policy, because the estimated value is dependent on the policy $\pi$ used to generate the data._

- **Equivalent formulation** — By introducing the constant $\eta=\frac{1}{1+\#\{\text{updates to }(s,a)\}}$ and for each $(s,a,u)$ of the training set, the update rule of model-free Monte Carlo has a convex combination formulation:

$$
\widehat{Q}_{\pi}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\pi}(s,a)+\eta u
$$

as well as a stochastic gradient formulation:

$$
\widehat{Q}_{\pi}(s,a)\leftarrow\widehat{Q}_{\pi}(s,a)-\eta\left(\widehat{Q}_{\pi}(s,a)-u\right)
$$

- **SARSA** — State-action-reward-state-action (SARSA) is a bootstrapping method estimating $Q_{\pi}$ by using both raw data and estimates as part of the update rule. For each $(s,a,r,s',a')$, we have:

$$
\widehat{Q}_{\pi}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\pi}(s,a)+\eta\left[r+\gamma\widehat{Q}_{\pi}(s',a')\right]
$$

_Remark: the SARSA estimate is updated on the fly as opposed to the model-free Monte Carlo one where the estimate can only be updated at the end of the episode._

- **Q-learning** — Q-learning is an off-policy algorithm that produces an estimate for $Q_{\text{opt}}$. On each $(s,a,r,s',a')$, we have:

$$
\widehat{Q}_{\text{opt}}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\text{opt}}(s,a)+\eta\left[r+\gamma\max_{a'\in\operatorname{Actions}(s')}\widehat{Q}_{\text{opt}}(s',a')\right]
$$

- **Epsilon-greedy** — The epsilon-greedy policy is an algorithm that balances exploration with probability $\epsilon$ and exploitation with probability $1-\epsilon$. For a given state $s$, the policy $\pi_{\text{act}}$ is computed as follows:

$$
\pi_{\text{act}}(s)=
\begin{cases}
\operatorname*{argmax}_{a\in\operatorname{Actions}}\widehat{Q}_{\text{opt}}(s,a) & \text{with proba }1-\epsilon\\
\text{random from }\operatorname{Actions}(s) & \text{with proba }\epsilon
\end{cases}
$$

### 2.3 Game playing

In games (e.g. chess, backgammon, Go), other agents are present and need to be taken into account when constructing our policy.

- **Game tree** — A game tree is a tree that describes the possibilities of a game. In particular, each node is a decision point for a player and each root-to-leaf path is a possible outcome of the game.

- **Two-player zero-sum game** — It is a game where each state is fully observed and such that players take turns. It is defined with:

  - a starting state $s_{\text{start}}$
  - possible actions $\operatorname{Actions}(s)$ from state $s$
  - successors $\operatorname{Succ}(s,a)$ from states $s$ with actions $a$
  - whether an end state was reached $\operatorname{IsEnd}(s)$
  - the agent's utility $\operatorname{Utility}(s)$ at end state $s$
  - the player $\operatorname{Player}(s)$ who controls state $s$

_Remark: we will assume that the utility of the agent has the opposite sign of the one of the opponent._

- **Types of policies** — There are two types of policies:

  - Deterministic policies, noted $\pi_p(s)$, which are actions that player $p$ takes in state $s$.
  - Stochastic policies, noted $\pi_p(s,a)\in[0,1]$, which are probabilities that player $p$ takes action $a$ in state $s$.

- **Expectimax** — For a given state $s$, the expectimax value $V_{\text{expectimax}}(s)$ is the maximum expected utility of any agent policy when playing with respect to a fixed and known opponent policy $\pi_{\text{opp}}$. It is computed as follows:

$$
V_{\text{expectimax}}(s)=
\begin{cases}
\operatorname{Utility}(s) & \operatorname{IsEnd}(s)\\
\max_{a\in\operatorname{Actions}(s)}V_{\text{expectimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{agent}\\
\sum_{a\in\operatorname{Actions}(s)}\pi_{\text{opp}}(s,a)V_{\text{expectimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{opp}
\end{cases}
$$

_Remark: expectimax is the analog of value iteration for MDPs._

*[Figure: Expectimax game tree with alternating triangle and circle nodes. The red root triangle has value 5; blue chance/opponent circles have values 4 and 5; lower red agent triangles have values 3, 5, 1, and 9; leaves are utilities 1, 3, 5, -1, -2, 1, 3, and 9. Red highlighted branches indicate selected maximizing choices, while blue edges indicate expected/opponent branches. The purpose is to show expectimax propagation of utilities through a game tree.]*

- **Minimax** — The goal of minimax policies is to find an optimal policy against an adversary by assuming the worst case, i.e. that the opponent is doing everything to minimize the agent's utility. It is done as follows:

$$
V_{\text{minimax}}(s)=
\begin{cases}
\operatorname{Utility}(s) & \operatorname{IsEnd}(s)\\
\max_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{agent}\\
\min_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{opp}
\end{cases}
$$

_Remark: we can extract $\pi_{\max}$ and $\pi_{\min}$ from the minimax value $V_{\text{minimax}}$._

*[Figure: Minimax game tree. The root red maximizing triangle has value 3 and selects the left child; blue minimizing triangles have values 3 and 1; red maximizing nodes below have values 3, 5, 1, and 9; leaves are utilities 1, 3, 5, -1, -2, 1, 3, and 9. Red edges show max choices and blue/black edges show min choices, illustrating bottom-up minimax value propagation.]*

- **Minimax properties** — By noting $V$ the value function, there are 3 properties around minimax to have in mind:

  - Property 1: if the agent were to change its policy to any $\pi_{\text{agent}}$, then the agent would be no better off.

$$
\forall \pi_{\text{agent}},\quad V(\pi_{\max},\pi_{\min})\geq V(\pi_{\text{agent}},\pi_{\min})
$$

  - Property 2: if the opponent changes its policy from $\pi_{\min}$ to $\pi_{\text{opp}}$, then he will be no better off.

$$
\forall \pi_{\text{opp}},\quad V(\pi_{\max},\pi_{\min})\leq V(\pi_{\max},\pi_{\text{opp}})
$$

  - Property 3: if the opponent is known to be not playing the adversarial policy, then the minimax policy might not be optimal for the agent.

$$
\forall \pi,\quad V(\pi_{\max},\pi)\leq V(\pi_{\text{expectimax}},\pi)
$$

In the end, we have the following relationship:

$$
V(\pi_{\text{expectimax}},\pi_{\min})\leq V(\pi_{\max},\pi_{\min})\leq V(\pi_{\max},\pi)\leq V(\pi_{\text{expectimax}},\pi)
$$

#### 2.3.1 Speeding up minimax

- **Evaluation function** — An evaluation function is a domain-specific and approximate estimate of the value $V_{\text{minimax}}(s)$. It is noted $\operatorname{Eval}(s)$.

_Remark: $\operatorname{FutureCost}(s)$ is an analogy for search problems._

- **Alpha-beta pruning** — Alpha-beta pruning is a domain-general exact method optimizing the minimax algorithm by avoiding the unnecessary exploration of parts of the game tree. To do so, each player keeps track of the best value they can hope for (stored in $\alpha$ for the maximizing player and in $\beta$ for the minimizing player). At a given step, the condition $\beta<\alpha$ means that the optimal path is not going to be in the current branch as the earlier player had a better option at their disposal.

*[Figure: Alpha-beta pruning example. A minimax tree has root value 3; the left subtree establishes a value of 3, and in the right subtree a branch is faded/pruned once the minimizing node value is $\leq 1$ and cannot improve the maximizing player's existing $\alpha=3$. Red highlighted edges show explored optimal choices; faded nodes show skipped exploration.]*

- **TD learning** — Temporal difference (TD) learning is used when we don't know the transitions/rewards. The value is based on exploration policy. To be able to use it, we need to know rules of the game $\operatorname{Succ}(s,a)$. For each $(s,a,r,s')$, the update is done as follows:

$$
w\leftarrow w-\eta\left[V(s,w)-\left(r+\gamma V(s',w)\right)\right]\nabla_wV(s,w)
$$

#### 2.3.2 Simultaneous games

This is the contrary of turn-based games, where there is no ordering on the player's moves.

- **Single-move simultaneous game** — Let there be two players $A$ and $B$, with given possible actions. We note $V(a,b)$ to be $A$'s utility if $A$ chooses action $a$, $B$ chooses action $b$. $V$ is called the payoff matrix.

- **Strategies** — There are two main types of strategies:

  - A pure strategy is a single action:

$$
a\in\operatorname{Actions}
$$

  - A mixed strategy is a probability distribution over actions:

$$
\forall a\in\operatorname{Actions},\quad 0\leq \pi(a)\leq 1
$$

- **Game evaluation** — The value of the game $V(\pi_A,\pi_B)$ when player $A$ follows $\pi_A$ and player $B$ follows $\pi_B$ is such that:

$$
V(\pi_A,\pi_B)=\sum_{a,b}\pi_A(a)\pi_B(b)V(a,b)
$$

- **Minimax theorem** — By noting $\pi_A,\pi_B$ ranging over mixed strategies, for every simultaneous two-player zero-sum game with a finite number of actions, we have:

$$
\max_{\pi_A}\min_{\pi_B}V(\pi_A,\pi_B)=\min_{\pi_B}\max_{\pi_A}V(\pi_A,\pi_B)
$$


#### 2.3.3 Non-zero-sum games

- **Payoff matrix** — We define $V_p(\pi_A,\pi_B)$ to be the utility for player $p$.

- **Nash equilibrium** — A Nash equilibrium is $(\pi_A^*,\pi_B^*)$ such that no player has an incentive to change its strategy. We have:

$$
\forall \pi_A,\ V_A(\pi_A^*,\pi_B^*) \geq V_A(\pi_A,\pi_B^*)
\quad \text{and} \quad
\forall \pi_B,\ V_B(\pi_A^*,\pi_B^*) \geq V_B(\pi_A^*,\pi_B)
$$

_Remark: in any finite-player game with finite number of actions, there exists at least one Nash equilibrium._

## 3 Variables-based models

### 3.1 Constraint satisfaction problems

In this section, our objective is to find maximum weight assignments of variables-based models. One advantage compared to states-based models is that these algorithms are more convenient to encode problem-specific constraints.

#### 3.1.1 Factor graphs

- **Definition** — A factor graph, also referred to as a Markov random field, is a set of variables $X=(X_1,...,X_n)$ where $X_i \in \operatorname{Domain}_i$ and $m$ factors $f_1,...,f_m$ with each $f_j(X) \geq 0$.

*[Figure: Factor graph with three variable nodes $X_1$, $X_2$, and $X_3$, each labeled with its domain. Unary factor $f_1$ is attached to $X_1$, binary factor $f_2$ connects $X_1$ and $X_2$, binary factor $f_3$ connects $X_2$ and $X_3$, and unary factor $f_4$ is attached to $X_3$, illustrating how factors constrain subsets of variables.]*

- **Scope and arity** — The scope of a factor $f_j$ is the set of variables it depends on. The size of this set is called the arity.

_Remark: factors of arity 1 and 2 are called unary and binary respectively._

- **Assignment weight** — Each assignment $x=(x_1,...,x_n)$ yields a weight $\operatorname{Weight}(x)$ defined as being the product of all factors $f_j$ applied to that assignment. Its expression is given by:

$$
\operatorname{Weight}(x)=\prod_{j=1}^{m} f_j(x)
$$

- **Constraint satisfaction problem** — A constraint satisfaction problem (CSP) is a factor graph where all factors are binary; we call them to be constraints:

$$
\forall j \in [1,m],\quad f_j(x) \in \{0,1\}
$$

Here, the constraint $j$ with assignment $x$ is said to be satisfied if and only if $f_j(x)=1$.

- **Consistent assignment** — An assignment $x$ of a CSP is said to be consistent if and only if $\operatorname{Weight}(x)=1$, i.e. all constraints are satisfied.

*[Figure: CSP factor graph with Boolean domains $\{0,1\}$ for $X_1$, $X_2$, and $X_3$. Unary constraints $[x_1=1]$ and $[x_3>0]$ attach to $X_1$ and $X_3$, while binary constraints $x_1 \vee x_2$ and $x_2 \wedge x_3$ connect adjacent variables, showing how a CSP uses 0/1-valued factors.]*

#### 3.1.2 Dynamic ordering

- **Dependent factors** — The set of dependent factors of variable $X_i$ with partial assignment $x$ is called $D(x,X_i)$, and denotes the set of factors that link $X_i$ to already assigned variables.

- **Backtracking search** — Backtracking search is an algorithm used to find maximum weight assignments of a factor graph. At each step, it chooses an unassigned variable and explores its values by recursion. Dynamic ordering (i.e. choice of variables and values) and lookahead (i.e. early elimination of inconsistent options) can be used to explore the graph more efficiently, although the worst-case runtime stays exponential: $O(|\operatorname{Domain}|^n)$.

- **Forward checking** — It is a one-step lookahead heuristic that preemptively removes inconsistent values from the domains of neighboring variables. It has the following characteristics:

  - After assigning a variable $X_i$, it eliminates inconsistent values from the domains of all its neighbors.
  - If any of these domains becomes empty, we stop the local backtracking search.
  - If we un-assign a variable $X_i$, we have to restore the domain of its neighbors.

- **Most constrained variable** — It is a variable-level ordering heuristic that selects the next unassigned variable that has the fewest consistent values. This has the effect of making inconsistent assignments to fail earlier in the search, which enables more efficient pruning.

- **Least constrained value** — It is a value-level ordering heuristic that assigns the next value that yields the highest number of consistent values of neighboring variables. Intuitively, this procedure chooses first the values that are most likely to work.

_Remark: in practice, this heuristic is useful when all factors are constraints._

*[Figure: Map-coloring example on a map of France with neighboring regions colored in three possible colors and small color-domain boxes inside several regions. It illustrates the 3-color problem solved with backtracking search, most constrained variable exploration, least constrained value ordering, and forward checking at each step.]*

The example above is an illustration of the 3-color problem with backtracking search coupled with most constrained variable exploration and least constrained value heuristic, as well as forward checking at each step.

- **Arc consistency** — We say that arc consistency of variable $X_i$ with respect to $X_k$ is enforced when for each $x_i \in \operatorname{Domain}_i$:

  - unary factors of $X_i$ are non-zero,
  - there exists at least one $x_k \in \operatorname{Domain}_k$ such that any factor between $X_i$ and $X_k$ is non-zero.

- **AC-3** — The AC-3 algorithm is a multi-step lookahead heuristic that applies forward checking to all relevant variables. After a given assignment, it performs forward checking and then successively enforces arc consistency with respect to the neighbors of variables for which the domain change during the process.

_Remark: AC-3 can be implemented both iteratively and recursively._

#### 3.1.3 Approximate methods

- **Beam search** — Beam search is an approximate algorithm that extends partial assignments on $n$ variables of branching factor $b=|\operatorname{Domain}|$ by exploring the $K$ top paths at each step. The beam size $K \in \{1,...,b^n\}$ controls the tradeoff between efficiency and accuracy. This algorithm has a time complexity of $O(n \cdot Kb\log(Kb))$.

The example below illustrates a possible beam search of parameters $K=2$, $b=3$ and $n=5$.

*[Figure: Beam-search tree for variables $X_1$ through $X_5$ with branching factor 3. At each depth only the top $K=2$ partial assignments are highlighted in green while other candidate branches fade out, demonstrating pruning by beam size and the selected path values along edges labeled $x_1$ through $x_5$.]*

_Remark: $K=1$ corresponds to greedy search whereas $K \to +\infty$ is equivalent to BFS tree search._

- **Iterated conditional modes** — Iterated conditional modes (ICM) is an iterative approximate algorithm that modifies the assignment of a factor graph one variable at a time until convergence. At step $i$, we assign to $X_i$ the value $v$ that maximizes the product of all factors connected to that variable.

_Remark: ICM may get stuck in local minima._

- **Gibbs sampling** — Gibbs sampling is an iterative approximate method that modifies the assignment of a factor graph one variable at a time until convergence. At step $i$:

  - we assign to each element $u \in \operatorname{Domain}_i$ a weight $w(u)$ that is the product of all factors connected to that variable,
  - we sample $v$ from the probability distribution induced by $w$ and assign it to $X_i$.

_Remark: Gibbs sampling can be seen as the probabilistic counterpart of ICM. It has the advantage to be able to escape local minima in most cases._

#### 3.1.4 Factor graph transformations

- **Independence** — Let $A,B$ be a partitioning of the variables $X$. We say that $A$ and $B$ are independent if there are no edges between $A$ and $B$ and we write:

$$
A,B \text{ independent} \Longleftrightarrow A \perp B
$$

_Remark: independence is the key property that allows us to solve subproblems in parallel._

- **Conditional independence** — We say that $A$ and $B$ are conditionally independent given $C$ if conditioning on $C$ produces a graph in which $A$ and $B$ are independent. In this case, it is written:

$$
A \text{ and } B \text{ cond. indep. given } C \Longleftrightarrow A \perp B \mid C
$$

- **Conditioning** — Conditioning is a transformation aiming at making variables independent that breaks up a factor graph into smaller pieces that can be solved in parallel and can use backtracking. In order to condition on a variable $X_i=v$, we do as follows:

  - Consider all factors $f_1,...,f_k$ that depend on $X_i$
  - Remove $X_i$ and $f_1,...,f_k$
  - Add $g_j(x)$ for $j \in \{1,...,k\}$ defined as:

$$
g_j(x)=f_j(x \cup \{X_i:v\})
$$

- **Markov blanket** — Let $A \subseteq X$ be a subset of variables. We define $\operatorname{MarkovBlanket}(A)$ to be the neighbors of $A$ that are not in $A$.

- **Proposition** — Let $C=\operatorname{MarkovBlanket}(A)$ and $B=X\backslash(A\cup C)$. Then we have:

$$
A \perp B \mid C
$$

*[Figure: Factor graph with red nodes forming set $A$, gray nodes forming its Markov blanket $C$ around it, and blue nodes forming the remaining set $B$. A boxed statement $A \perp B \mid C$ shows that conditioning on the blanket separates $A$ from all non-neighboring variables.]*

- **Elimination** — Elimination is a factor graph transformation that removes $X_i$ from the graph and solves a small subproblem conditioned on its Markov blanket as follows:

  - Consider all factors $f_{i,1},...,f_{i,k}$ that depend on $X_i$
  - Remove $X_i$ and $f_{i,1},...,f_{i,k}$
  - Add $f_{\textrm{new},i}(x)$ defined as:

$$
f_{\textrm{new},i}(x)=\max_{x_i}\prod_{\ell=1}^{k} f_{i,\ell}(x)
$$

- **Treewidth** — The treewidth of a factor graph is the maximum arity of any factor created by variable elimination with the best variable ordering. In the maximum arity, variable eliminated with the best variable ordering:

$$
\operatorname{Treewidth}=\min_{\text{orderings } i\in\{1,...,n\}}\max_j \operatorname{arity}(f_{\textrm{new},j})
$$

The example below illustrates the case of a factor graph of treewidth 3.

*[Figure: Grid-shaped factor graph with variables $X_1$ through $X_{12}$ arranged in three rows and four columns. Square factors connect horizontally and vertically adjacent variables, illustrating a graph whose optimal elimination ordering has treewidth 3.]*

_Remark: finding the best variable ordering is a NP-hard problem._

### 3.2 Bayesian networks

In this section, our goal will be to compute conditional probabilities. What is the probability of a query given evidence?

#### 3.2.1 Introduction

- **Explaining away** — Suppose causes $C_1$ and $C_2$ influence an effect $E$. Conditioning on the effect $E$ and on one of the causes (say $C_1$) changes the probability of the other cause (say $C_2$). In this case, we say that $C_1$ has explained away $C_2$.

- **Directed acyclic graph** — A directed acyclic graph (DAG) is a finite directed graph with no directed cycles.

- **Bayesian network** — A Bayesian network is a directed acyclic graph (DAG) that specifies a joint distribution over random variables $X=(X_1,...,X_n)$ as a product of local conditional distributions, one for each node:

$$
P(X_1=x_1,...,X_n=x_n)=\prod_{i=1}^{n}p(x_i\mid x_{\operatorname{Parents}(i)})
$$

_Remark: Bayesian networks are factor graphs imbued with the language of probability._

*[Figure: A Bayesian network with directed edges among variables such as $X_1$, $X_2$, $X_3$, $X_4$, $X_5$, and isolated $X_6$, shown converting into a factor graph whose factors are local conditional probability tables $p(x_i\mid x_{\operatorname{Parents}(i)})$. The figure demonstrates how DAG structure becomes factor-graph factors.]*

- **Locally normalized** — For each $x_{\operatorname{Parents}(i)}$, all factors are local conditional distributions. Hence they have to satisfy:

$$
\sum_{x_i}p(x_i\mid x_{\operatorname{Parents}(i)})=1
$$

As a result, sub-Bayesian networks and conditional distributions are consistent.

_Remark: local conditional distributions are the true conditional distributions._

- **Marginalization** — The marginalization of a leaf node yields a Bayesian network without that node.

#### 3.2.2 Probabilistic programs

- **Concept** — A probabilistic program randomizes variables assignment. That way, we can write down complex Bayesian networks that generate assignments without us having to explicitly specify associated probabilities.

_Remark: examples of probabilistic programs include Hidden Markov model (HMM), factorial HMM, naive Bayes, latent Dirichlet allocation, diseases and symptoms and stochastic block models._

- **Summary** — The table below summarizes the common probabilistic programs as well as their applications:

| Program | Algorithm | Illustration | Example |
|---|---|---|---|
| Markov Model | $X_i \sim p(X_i\mid X_{i-1})$ | *Chain $X_1 \to X_2 \to X_3 \to \cdots \to X_n$.* | Language modeling |
| Hidden Markov Model (HMM) | $H_t \sim p(H_t\mid H_{t-1})$<br>$E_t \sim p(E_t\mid H_t)$ | *Hidden states $H_1 \to H_2 \to H_3 \to \cdots \to H_T$ in a top row, observed emissions $E_1,E_2,E_3,\ldots,E_T$ in a bottom row, and vertical arrows $H_t \to E_t$.* | Object tracking |
| Factorial HMM | $H_t^o \sim \alpha(a,b)\ p(H_t^o\mid H_{t-1}^o)$<br>$E_t \sim p(E_t\mid H_t^a,H_t^b)$ | *Two parallel hidden Markov chains $H_t^1$ and $H_t^2$ with emissions $E_t$ between them, modeling multiple hidden objects jointly.* | Multiple object tracking |
| Naive Bayes | $Y \sim p(Y)$<br>$W_i \sim p(W_i\mid Y)$ | *Class node $Y$ points to observed word nodes $W_1,W_2,W_3,\ldots,W_L$.* | Document classification |
| Latent Dirichlet Allocation (LDA) | $\alpha \in \mathbb{R}^K$ distribution<br>$Z_i \sim p(Z_i\mid \alpha)$<br>$W_i \sim p(W_i\mid Z_i)$ | *Topic-proportion node $\alpha$ points to topic nodes $Z_1,Z_2,Z_3,\ldots,Z_L$, each topic node points to a word node $W_i$.* | Topic modeling |

#### 3.2.3 Inference

- **General probabilistic inference strategy** — The strategy to compute the probability $P(Q\mid E=e)$ of query $Q$ given evidence $E=e$ is as follows:

  - Step 1: Remove variables that are not ancestors of the query $Q$ or the evidence $E$ by marginalization
  - Step 2: Convert Bayesian network to factor graph
  - Step 3: Condition on the evidence $E=e$
  - Step 4: Remove nodes disconnected from the query $Q$ by marginalization
  - Step 5: Run probabilistic inference algorithm (manual, variable elimination, Gibbs sampling, particle filtering)

- **Forward-backward algorithm** — This algorithm computes the exact value of $P(H_i=h_k\mid E=e)$ (smoothing query) for any $k \in \{1,...,L\}$ in the case of an HMM of size $L$. To do so, we proceed in 3 steps:

  - Step 1: for $i \in \{1,...,L\}$, compute $F_i(h_i)=\sum_{h_{i-1}}F_{i-1}(h_{i-1})p(h_i\mid h_{i-1})p(e_i\mid h_i)$
  - Step 2: for $i \in \{L,...,1\}$, compute $B_i(h_i)=\sum_{h_{i+1}}B_{i+1}(h_{i+1})p(h_{i+1}\mid h_i)p(e_{i+1}\mid h_{i+1})$
  - Step 3: for $i \in \{1,...,L\}$, compute $S_i(h_i)=\frac{F_i(h_i)B_i(h_i)}{\sum_{h_i}F_i(h_i)B_i(h_i)}$


with the convention $F_0 = B_{L+1} = 1$. From this procedure and these notations, we get that

$$
P(H = h_k \mid E = e) = S_k(h_k)
$$

*Remark: this algorithm interprets each assignment to be a path where each edge $h_{i-1} \to h_i$ is of weight $p(h_i \mid h_{i-1})p(e_i \mid h_i)$.*

- **Gibbs sampling** — This algorithm is an iterative approximate method that uses a small set of assignments (particles) to represent a large probability distribution. From a random assignment $x$, Gibbs sampling performs the following steps for $i \in \{1,...,n\}$ until convergence:

  - For all $u \in \operatorname{Domain}_i$, compute the weight $w(u)$ of assignment $x$ where $X_i = u$
  - Sample $v$ from the probability distribution induced by $w$: $v \sim P(X_i = v \mid X_{-i} = x_{-i})$
  - Set $X_i = v$

*Remark: $X_{-i}$ denotes $X \setminus \{X_i\}$ and $x_{-i}$ represents the corresponding assignment.*

- **Particle filtering** — This algorithm approximates the posterior density of state variables given the evidence of observation variables by keeping track of $K$ particles at a time. Starting from a set of particles $C$ of size $K$, we run the following 3 steps iteratively:

  - Step 1: proposal - For each old particle $x_{t-1} \in C$, sample $x$ from the transition probability distribution $p(x \mid x_{t-1})$ and add $x$ to a set $C'$.
  - Step 2: weighting - Weigh each $x$ of the set $C'$ by $w(x) = p(e_t \mid x)$, where $e_t$ is the evidence observed at time $t$.
  - Step 3: resampling - Sample $K$ elements from the set $C'$ using the probability distribution induced by $w$ and store them in $C$: these are the current particles $x_t$.

*Remark: a more expensive version of this algorithm also keeps track of past particles in the proposal step.*

- **Maximum likelihood** — If we don't know the local conditional distributions, we can learn them using maximum likelihood.

$$
\max_\theta \prod_{x \in \mathcal{D}_{\textrm{train}}} p(X = x; \theta)
$$

- **Laplace smoothing** — For each distribution $d$ and partial assignment $(x_{\operatorname{Parents}(i)}, x_i)$, add $\lambda$ to $\operatorname{count}_d(x_{\operatorname{Parents}(i)}, x_i)$, then normalize to get probability estimates.

- **Algorithm** — The Expectation-Maximization (EM) algorithm gives an efficient method at estimating the parameter $\theta$ through maximum likelihood estimation by repeatedly constructing a lower-bound on the likelihood (E-step) and optimizing that lower bound (M-step) as follows:

  - E-step: Evaluate the posterior probability $q(h)$ that each data point $e$ came from a particular cluster $h$ as follows:

$$
q(h) = P(H = h \mid E = e; \theta)
$$

  - M-step: Use the posterior probabilities $q(h)$ as cluster specific weights on data points $e$ to determine $\theta$ through maximum likelihood.

## 4 Logic-based models

### 4.1 Basics

- **Syntax of propositional logic** — By noting $f,g$ formulas, and $\neg, \wedge, \vee, \to, \leftrightarrow$ connectives, we can write the following logical expressions:

| Name | Symbol | Meaning | Illustration |
|---|---|---|---|
| Affirmation | $f$ | $f$ | *A rectangular universe containing a single oval labeled $f$; the interior of $f$ is shaded, illustrating that $f$ is true.* |
| Negation | $\neg f$ | not $f$ | *A rectangular universe with an oval labeled $f$ left unshaded while the region outside $f$ is shaded, illustrating not $f$.* |
| Conjunction | $f \wedge g$ | $f$ and $g$ | *Two overlapping ovals labeled $f$ and $g$ with only their intersection shaded, illustrating both $f$ and $g$.* |
| Disjunction | $f \vee g$ | $f$ or $g$ | *Two overlapping ovals labeled $f$ and $g$ with both ovals shaded, including their overlap, illustrating $f$ or $g$.* |
| Implication | $f \to g$ | if $f$ then $g$ | *Two overlapping ovals labeled $f$ and $g$ where everything except the $f$-only region is shaded, illustrating that $f$ implies $g$.* |
| Biconditional | $f \leftrightarrow g$ | $f$, that is to say $g$ | *Two overlapping ovals labeled $f$ and $g$ where the overlap and the outside region are shaded while the non-overlapping parts are not, illustrating equivalence.* |

*Remark: formulas can be built up recursively out of these connectives.*

- **Model** — A model $w$ denotes an assignment of binary weights to propositional symbols.

*Example: the set of truth values $w = \{A:0,B:1,C:0\}$ is one possible model to the propositional symbols $A$, $B$ and $C$.*

- **Interpretation function** — The interpretation function $\mathcal{I}(f,w)$ outputs whether model $w$ satisfies formula $f$:

$$
\mathcal{I}(f,w) \in \{0,1\}
$$

- **Set of models** — $\mathcal{M}(f)$ denotes the set of models $w$ that satisfy formula $f$. Mathematically speaking, we define it as follows:

$$
\forall w \in \mathcal{M}(f),\quad \mathcal{I}(f,w) = 1
$$

### 4.2 Knowledge base

- **Definition** — The knowledge base KB is the conjunction of all formulas that have been considered so far. The set of models of the knowledge base is the intersection of the set of models that satisfy each formula. In other words:

$$
\mathcal{M}(\textrm{KB}) = \bigcap_{f \in \textrm{KB}} \mathcal{M}(f)
$$

*[Figure: Three overlapping sets labeled $\mathcal{M}(f_1)$, $\mathcal{M}(f_2)$, and $\mathcal{M}(f_3)$; their common intersection is highlighted and labeled $\mathcal{M}(\textrm{KB})$, illustrating that a knowledge base's models are exactly the models satisfying all formulas in the KB.]*

- **Probabilistic interpretation** — The probability that query $f$ is evaluated to 1 can be seen as the proportion of models $w$ of the knowledge base KB that satisfy $f$, i.e.:

$$
P(f \mid \textrm{KB}) = \frac{\sum_{w \in \mathcal{M}(\textrm{KB}) \cap \mathcal{M}(f)} P(W = w)}{\sum_{w \in \mathcal{M}(\textrm{KB})} P(W = w)}
$$

- **Satisfiability** — The knowledge base KB is said to be satisfiable if at least one model $w$ satisfies all its constraints. In other words:

$$
\textrm{KB satisfiable} \Longleftrightarrow \mathcal{M}(\textrm{KB}) \neq \varnothing
$$

*Remark: $\mathcal{M}(\textrm{KB})$ denotes the set of models compatible with all the constraints of the knowledge base.*

- **Relation between formulas and knowledge base** — We define the following properties between the knowledge base KB and a new formula $f$:

| Name | Mathematical formulation | Illustration | Notes |
|---|---|---|---|
| KB entails $f$ | $\mathcal{M}(\textrm{KB}) \cap \mathcal{M}(f) = \mathcal{M}(\textrm{KB})$ | *An oval $\mathcal{M}(f)$ fully contains a smaller oval $\mathcal{M}(\textrm{KB})$.* | - $f$ does not bring any new information<br>- Also written $\textrm{KB} \models f$ |
| KB contradicts $f$ | $\mathcal{M}(\textrm{KB}) \cap \mathcal{M}(f) = \varnothing$ | *Two separate non-overlapping ovals labeled $\mathcal{M}(f)$ and $\mathcal{M}(\textrm{KB})$.* | - No model satisfies the constraints after adding $f$<br>- Equivalent to $\textrm{KB} \models \neg f$ |
| $f$ contingent to KB | $\mathcal{M}(\textrm{KB}) \cap \mathcal{M}(f) \neq \varnothing$ and $\mathcal{M}(\textrm{KB}) \cap \mathcal{M}(f) \neq \mathcal{M}(\textrm{KB})$ | *Two overlapping ovals labeled $\mathcal{M}(f)$ and $\mathcal{M}(\textrm{KB})$ where neither fully contains the other.* | - $f$ does not contradict KB<br>- $f$ adds a non-trivial amount of information to KB |

- **Model checking** — A model checking algorithm takes as input a knowledge base KB and outputs whether it is satisfiable or not.

*Remark: popular model checking algorithms include DPLL and WalkSat.*

- **Inference rule** — An inference rule of premises $f_1,...,f_k$ and conclusion $g$ is written:

$$
\frac{f_1,...,f_k}{g}
$$

- **Forward inference algorithm** — From a set of inference rules Rules, this algorithm goes through all possible $f_1,...,f_k$ and adds $g$ to the knowledge base KB if a matching rule exists. This process is repeated until no more additions can be made to KB.

- **Derivation** — We say that KB derives $f$ (written $\textrm{KB} \vdash f$) with rules Rules if $f$ already is in KB or gets added during the forward inference algorithm using the set of rules Rules.

- **Properties of inference rules** — A set of inference rules Rules can have the following properties:

| Name | Mathematical formulation | Notes |
|---|---|---|
| Soundness | $\{f : \textrm{KB} \vdash f\} \subseteq \{f : \textrm{KB} \models f\}$ | - Inferred formulas are entailed by KB<br>- Can be checked one rule at a time<br>- *"Nothing but the truth"* |
| Completeness | $\{f : \textrm{KB} \vdash f\} \supseteq \{f : \textrm{KB} \models f\}$ | - Formulas entailing KB are either already in the knowledge base or inferred from it<br>- *"The whole truth"* |

### 4.3 Propositional logic

In this section, we will go through logic-based models that use logical formulas and inference rules. The idea here is to balance expressivity and computational efficiency.

- **Horn clause** — By noting $p_1,...,p_k$ and $q$ propositional symbols, a Horn clause has the form:

$$
(p_1 \wedge ... \wedge p_k) \to q
$$

*Remark: when $q = false$, it is called a 'goal clause', otherwise we denote it as a 'definite clause'.*

- **Modus ponens inference rule** — For propositional symbols $f_1,...,f_k$ and $p$, the modus ponens rule is written:

$$
\frac{f_1,...,f_k;\quad (f_1 \wedge ... \wedge f_k) \to p}{p}
$$

*Remark: it takes linear time to apply this rule, as each application generate a clause that contains a single propositional symbol.*

- **Completeness** — Modus ponens is complete with respect to Horn clauses if we suppose that KB contains only Horn clauses and $p$ is an entailed propositional symbol. Applying modus ponens will then derive $p$.

- **Conjunctive normal form** — A conjunctive normal form (CNF) formula is a conjunction of clauses, where each clause is a disjunction of atomic formulas.

*Remark: in other words, CNFs are $\wedge$ of $\vee$.*

- **Equivalent representation** — Every formula in propositional logic can be written into an equivalent CNF formula. The table below presents general conversion properties:

| Rule name | Initial | Converted |
|---|---|---|
| Eliminate $\leftrightarrow$ | $f \leftrightarrow g$ | $(f \to g) \wedge (g \to f)$ |
| Eliminate $\to$ | $f \to g$ | $\neg f \vee g$ |
| Eliminate $\neg\neg$ | $\neg\neg f$ | $f$ |
| Distribute $\neg$ over $\wedge$ | $\neg(f \wedge g)$ | $\neg f \vee \neg g$ |
| Distribute $\neg$ over $\vee$ | $\neg(f \vee g)$ | $\neg f \wedge \neg g$ |
| Distribute $\vee$ over $\wedge$ | $f \vee (g \wedge h)$ | $(f \vee g) \wedge (f \vee h)$ |

- **Resolution inference rule** — For propositional symbols $f_1,...,f_n$, and $g_1,...,g_m$ as well as $p$, the resolution rule is written:

$$
\frac{f_1 \vee ... \vee f_n \vee p,\quad \neg p \vee g_1 \vee ... \vee g_m}{f_1 \vee ... \vee f_n \vee g_1 \vee ... \vee g_m}
$$

*Remark: it can take exponential time to apply this rule, as each application generates a clause that has a subset of the propositional symbols.*

- **Resolution-based inference** — The resolution-based inference algorithm follows the following steps:

  - Step 1: Convert all formulas into CNF
  - Step 2: Repeatedly apply resolution rule
  - Step 3: Return unsatisfiable if and only if False is derived

### 4.4 First-order logic

The idea here is that variables yield compact knowledge representations.

- **Model** — A model $w$ in first-order logic maps:

  - constant symbols to objects
  - predicate symbols to tuple of objects

- **Horn clause** — By noting $x_1,...,x_n$ variables and $a_1,...,a_k,b$ atomic formulas, the first-order logic version of a horn clause has the form:

$$
\forall x_1,...,x_n,\quad (a_1 \wedge ... \wedge a_k) \to b
$$

- **Substitution** — A substitution $\theta$ maps variables to terms and $\operatorname{Subst}(\theta,f)$ denotes the result of substitution $\theta$ on $f$.

- **Unification** — Unification takes two formulas $f$ and $g$ and returns the most general substitution $\theta$ that makes them equal:

$$
\operatorname{Unify}[f,g] = \theta\quad \textrm{s.t.}\quad \operatorname{Subst}[\theta,f] = \operatorname{Subst}[\theta,g]
$$

*Note: $\operatorname{Unify}[f,g]$ returns Fail if no such $\theta$ exists.*

- **Modus ponens** — By noting $x_1,...,x_n$ variables, $a_1,...,a_k$ and $a'_1,...,a'_k$ atomic formulas and by calling $\theta = \operatorname{Unify}(a'_1 \wedge ... \wedge a'_k, a_1 \wedge ... \wedge a_k)$ the first-order logic version of modus ponens can be written:

$$
\frac{a'_1,...,a'_k\quad \forall x_1,...,x_n\,(a_1 \wedge ... \wedge a_k) \to b}{\operatorname{Subst}[\theta,b]}
$$

- **Completeness** — Modus ponens is complete for first-order logic with only Horn clauses.

- **Resolution rule** — By noting $f_1,...,f_n$, $g_1,...,g_m$, $p,q$ formulas and by calling $\theta = \operatorname{Unify}(p,q)$, the first-order logic version of the resolution rule can be written:

$$
\frac{f_1 \vee ... \vee f_n \vee p,\quad \neg q \vee g_1 \vee ... \vee g_m}{\operatorname{Subst}[\theta, f_1 \vee ... \vee f_n \vee g_1 \vee ... \vee g_m]}
$$

- **Semi-decidability** — First-order logic, even restricted to only Horn clauses, is semi-decidable.

  - if $\textrm{KB} \models f$, forward inference on complete inference rules will prove $f$ in finite time
  - if $\textrm{KB} \not\models f$, no algorithm can show this in finite time
