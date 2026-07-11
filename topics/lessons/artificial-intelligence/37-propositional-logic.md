# Propositional Logic
> **Source:** CS 221 · **Category:** Formula/Concept · **Type:** 🧮 Numeric · [↑ Full reference](../../ai-ml-cheatsheets.md)

## 1. Overview

Propositional logic turns statements such as “it is raining,” “the ground is wet,” and “the alarm sounds” into formulas that are either true or false in each possible world. An AI agent can store facts and rules in a knowledge base, then answer a query by checking whether every model compatible with the knowledge base also satisfies that query.

**Intuition.** Logic-based inference is model filtering: keep only the worlds that satisfy what we know, then ask what must be true in all remaining worlds.

## 2. Key Idea

### Syntax: formulas and connectives

A propositional formula is built recursively from propositional symbols such as $A,B,C$ using logical connectives.

| Name | Symbol | Formula shape | One-line reading |
|---|---|---|---|
| Affirmation | $f$ | $f$ | $f$ itself is asserted. |
| Negation | $\neg f$ | not $f$ | $\neg f$ is true exactly when $f$ is false. |
| Conjunction | $f \wedge g$ | $f$ and $g$ | $f \wedge g$ is true exactly when both parts are true. |
| Disjunction | $f \vee g$ | $f$ or $g$ | $f \vee g$ is true when at least one part is true. |
| Implication | $f \to g$ | if $f$ then $g$ | $f \to g$ is false only when $f$ is true and $g$ is false. |
| Biconditional | $f \leftrightarrow g$ | $f$, that is to say $g$ | $f \leftrightarrow g$ is true when $f$ and $g$ have the same truth value. |

The two-symbol truth tables for implication and biconditional are:

| $f$ | $g$ | $\neg f$ | $f\to g \equiv \neg f\vee g$ | $f\leftrightarrow g$ |
|---:|---:|---:|---:|---:|
| $0$ | $0$ | $1$ | $1$ | $1$ |
| $0$ | $1$ | $1$ | $1$ | $0$ |
| $1$ | $0$ | $0$ | $0$ | $0$ |
| $1$ | $1$ | $0$ | $1$ | $1$ |

### Semantics: models and interpretation

A **model** $w$ denotes an assignment of binary weights to propositional symbols.

$$
w=\{A:0,B:1,C:0\}
$$

is one possible model for the symbols $A,B,C$. Read a model as one possible world.

The **interpretation function** $\mathcal{I}(f,w)$ outputs whether model $w$ satisfies formula $f$:

$$
\mathcal{I}(f,w)\in\{0,1\}.
$$

Read $\mathcal{I}(f,w)=1$ as “formula $f$ is true in world $w$.”

The **set of models** $\mathcal{M}(f)$ denotes the set of models $w$ that satisfy formula $f$:

$$
\forall w\in\mathcal{M}(f),\quad \mathcal{I}(f,w)=1.
$$

Read $\mathcal{M}(f)$ as all worlds where $f$ is true.

### Knowledge bases, satisfiability, and entailment

The **knowledge base** $\textrm{KB}$ is the conjunction of all formulas that have been considered so far. The set of models of the knowledge base is the intersection of the set of models that satisfy each formula:

$$
\mathcal{M}(\textrm{KB})=\bigcap_{f\in\textrm{KB}}\mathcal{M}(f).
$$

Read a knowledge base as the collection of constraints the agent currently believes.

A knowledge base is **satisfiable** if at least one model $w$ satisfies all its constraints:

$$
\textrm{KB satisfiable}\Longleftrightarrow \mathcal{M}(\textrm{KB})\neq\varnothing.
$$

Read satisfiability as “there is at least one possible world left.”

A knowledge base **entails** a formula $f$ when every model of the knowledge base is also a model of $f$:

$$
\textrm{KB}\models f
\Longleftrightarrow
\mathcal{M}(\textrm{KB})\cap\mathcal{M}(f)=\mathcal{M}(\textrm{KB}).
$$

Read entailment as “$f$ brings no new information because it was already forced by KB.”

A knowledge base **contradicts** a formula $f$ when no model satisfies both the knowledge base and $f$:

$$
\mathcal{M}(\textrm{KB})\cap\mathcal{M}(f)=\varnothing.
$$

Read contradiction as “adding $f$ eliminates every remaining world”; equivalently, $\textrm{KB}\models\neg f$.

A formula $f$ is **contingent to KB** when some but not all KB models satisfy it:

$$
\mathcal{M}(\textrm{KB})\cap\mathcal{M}(f)\neq\varnothing
\quad\textrm{and}\quad
\mathcal{M}(\textrm{KB})\cap\mathcal{M}(f)\neq\mathcal{M}(\textrm{KB}).
$$

Read contingency as “$f$ is compatible with KB but not already forced.”

### Inference rules, derivation, soundness, and completeness

An **inference rule** with premises $f_1,\ldots,f_k$ and conclusion $g$ is written

$$
\frac{f_1,\ldots,f_k}{g}.
$$

Read it as “if all premises above the line are available, add the conclusion below the line.”

A **forward inference algorithm** goes through all possible premises $f_1,\ldots,f_k$ and adds $g$ to the knowledge base if a matching rule exists; this repeats until no more additions can be made.

Read forward inference as “keep firing rules until the fact set stops growing.”

A knowledge base **derives** $f$, written $\textrm{KB}\vdash f$, if $f$ already is in KB or gets added during forward inference using the chosen rules.

Read derivation as “the proof procedure can produce $f$.”

A set of inference rules is **sound** when every derived formula is genuinely entailed:

$$
\{f:\textrm{KB}\vdash f\}\subseteq\{f:\textrm{KB}\models f\}.
$$

Read soundness as “nothing but the truth.”

A set of inference rules is **complete** when every entailed formula can be derived:

$$
\{f:\textrm{KB}\vdash f\}\supseteq\{f:\textrm{KB}\models f\}.
$$

Read completeness as “the whole truth.”

### Horn clauses and modus ponens

A **Horn clause** has the form

$$
(p_1\wedge\cdots\wedge p_k)\to q,
$$

where $p_1,\ldots,p_k$ and $q$ are propositional symbols. Read a Horn clause as “if all body symbols are true, then the head symbol is true.” When $q=false$, it is a goal clause; otherwise it is a definite clause.

The **modus ponens inference rule** for propositional symbols $f_1,\ldots,f_k$ and $p$ is

$$
\frac{f_1,\ldots,f_k;\quad (f_1\wedge\cdots\wedge f_k)\to p}{p}.
$$

Read modus ponens as “facts matching a Horn body license the Horn head.” It takes linear time to apply because each application generates a clause containing a single propositional symbol.

For a KB containing only Horn clauses, **modus ponens is complete with respect to Horn clauses**: if an entailed propositional symbol $p$ follows from that Horn KB, repeated modus ponens will derive $p$.

### CNF and resolution

A **conjunctive normal form** (CNF) formula is a conjunction of clauses, where each clause is a disjunction of atomic formulas. Read CNF as “AND of ORs.”

Every propositional formula can be written as an equivalent CNF formula using rules such as:

| Rule name | Initial | Converted | One-line reading |
|---|---|---|---|
| Eliminate $\leftrightarrow$ | $f\leftrightarrow g$ | $(f\to g)\wedge(g\to f)$ | Equivalence means both implications. |
| Eliminate $\to$ | $f\to g$ | $\neg f\vee g$ | An implication fails only at $f=1,g=0$. |
| Eliminate $\neg\neg$ | $\neg\neg f$ | $f$ | Double negation cancels. |
| Distribute $\neg$ over $\wedge$ | $\neg(f\wedge g)$ | $\neg f\vee\neg g$ | Not both means at least one not. |
| Distribute $\neg$ over $\vee$ | $\neg(f\vee g)$ | $\neg f\wedge\neg g$ | Not either means neither. |
| Distribute $\vee$ over $\wedge$ | $f\vee(g\wedge h)$ | $(f\vee g)\wedge(f\vee h)$ | Push OR inward to obtain AND of ORs. |

The **resolution inference rule** is

$$
\frac{f_1\vee\cdots\vee f_n\vee p,\quad \neg p\vee g_1\vee\cdots\vee g_m}{f_1\vee\cdots\vee f_n\vee g_1\vee\cdots\vee g_m}.
$$

Read resolution as “two clauses containing complementary literals $p$ and $\neg p$ let us keep everything except that contradictory pair.”

A **resolution-based inference** algorithm converts formulas into CNF, repeatedly applies resolution, and returns unsatisfiable if and only if False is derived.

Read resolution refutation as “to prove $\textrm{KB}\models q$, add $\neg q$ and derive a contradiction.” Resolution is sound and complete for propositional logic, but it can take exponential time because each application can generate a clause containing a subset of propositional symbols.

## 3. Worked Examples

### 🟡 Easy

#### E1. Evaluate a compound formula in one model

**Problem.** Let

$$
w=\{A:1,B:0,C:1\}
$$

and

$$
f=(A\wedge\neg B)\to C.
$$

Compute $\mathcal{I}(f,w)$ by recursively evaluating the formula.

**Solution.**

Start with the propositional symbols in the model.

| Symbol | Value in $w$ | Reason |
|---|---:|---|
| $A$ | $1$ | Given by $w$. |
| $B$ | $0$ | Given by $w$. |
| $C$ | $1$ | Given by $w$. |

Evaluate the negation.

$$
\mathcal{I}(\neg B,w)=1
$$

because $\mathcal{I}(B,w)=0$.

Evaluate the conjunction.

$$
\mathcal{I}(A\wedge\neg B,w)
=\mathcal{I}(A,w)\wedge\mathcal{I}(\neg B,w)
=1\wedge1=1.
$$

Now evaluate the implication.

$$
\mathcal{I}((A\wedge\neg B)\to C,w)
=\mathcal{I}(A\wedge\neg B,w)\to\mathcal{I}(C,w)
=1\to1=1.
$$

A complete truth-value trace is:

| Step | Subformula | Value | Explanation |
|---:|---|---:|---|
| 1 | $A$ | $1$ | Directly from $w$. |
| 2 | $B$ | $0$ | Directly from $w$. |
| 3 | $C$ | $1$ | Directly from $w$. |
| 4 | $\neg B$ | $1$ | Negating $0$ gives $1$. |
| 5 | $A\wedge\neg B$ | $1$ | $1\wedge1=1$. |
| 6 | $(A\wedge\neg B)\to C$ | $1$ | $1\to1=1$. |

Therefore the model satisfies the formula.

$$
\boxed{\mathcal{I}((A\wedge\neg B)\to C,w)=1.}
$$

#### E2. Build a truth table for implication and biconditional

**Problem.** For propositional symbols $P,Q$, build the complete truth table for $P\to Q$ and $P\leftrightarrow Q$. Explain why implication is false only when $P$ is true and $Q$ is false.

**Solution.**

List all $2^2=4$ models over $P,Q$.

| Model | $P$ | $Q$ |
|---:|---:|---:|
| $w_1$ | $0$ | $0$ |
| $w_2$ | $0$ | $1$ |
| $w_3$ | $1$ | $0$ |
| $w_4$ | $1$ | $1$ |

Use

$$
P\to Q\equiv \neg P\vee Q.
$$

So first compute $\neg P$, then $\neg P\vee Q$.

| Model | $P$ | $Q$ | $\neg P$ | $P\to Q$ | Reason for implication |
|---:|---:|---:|---:|---:|---|
| $w_1$ | $0$ | $0$ | $1$ | $1$ | $\neg P\vee Q=1\vee0=1$. |
| $w_2$ | $0$ | $1$ | $1$ | $1$ | $\neg P\vee Q=1\vee1=1$. |
| $w_3$ | $1$ | $0$ | $0$ | $0$ | $\neg P\vee Q=0\vee0=0$. |
| $w_4$ | $1$ | $1$ | $0$ | $1$ | $\neg P\vee Q=0\vee1=1$. |

A biconditional is true exactly when the two sides agree.

$$
P\leftrightarrow Q\equiv (P\to Q)\wedge(Q\to P).
$$

Compute both directions.

| Model | $P$ | $Q$ | $P\to Q$ | $Q\to P$ | $P\leftrightarrow Q$ |
|---:|---:|---:|---:|---:|---:|
| $w_1$ | $0$ | $0$ | $1$ | $1$ | $1\wedge1=1$ |
| $w_2$ | $0$ | $1$ | $1$ | $0$ | $1\wedge0=0$ |
| $w_3$ | $1$ | $0$ | $0$ | $1$ | $0\wedge1=0$ |
| $w_4$ | $1$ | $1$ | $1$ | $1$ | $1\wedge1=1$ |

The implication $P\to Q$ claims that whenever $P$ holds, $Q$ also holds. The only violation is therefore the model with $P=1$ and $Q=0$.

$$
\boxed{P\to Q\textrm{ is false only at }(P,Q)=(1,0),\quad P\leftrightarrow Q\textrm{ is true at }(0,0)\textrm{ and }(1,1).}
$$

#### E3. List models of a small formula

**Problem.** Let

$$
f=(A\vee B)\wedge\neg(A\wedge B).
$$

Enumerate $\mathcal{M}(f)$ over symbols $A,B$ and identify the behavior of the formula.

**Solution.**

There are $2^2=4$ models over $A,B$. For each model, compute the two main components $A\vee B$ and $\neg(A\wedge B)$.

| Model | $A$ | $B$ | $A\vee B$ | $A\wedge B$ | $\neg(A\wedge B)$ | $f=(A\vee B)\wedge\neg(A\wedge B)$ |
|---:|---:|---:|---:|---:|---:|---:|
| $w_1$ | $0$ | $0$ | $0$ | $0$ | $1$ | $0\wedge1=0$ |
| $w_2$ | $0$ | $1$ | $1$ | $0$ | $1$ | $1\wedge1=1$ |
| $w_3$ | $1$ | $0$ | $1$ | $0$ | $1$ | $1\wedge1=1$ |
| $w_4$ | $1$ | $1$ | $1$ | $1$ | $0$ | $1\wedge0=0$ |

The satisfying models are exactly the rows where the final column is $1$.

$$
\mathcal{M}(f)=\bigl\{\{A:0,B:1\},\{A:1,B:0\}\bigr\}.
$$

The formula requires at least one of $A,B$ to be true, but not both. That is the exclusive-or pattern.

$$
\boxed{(A\vee B)\wedge\neg(A\wedge B)\textrm{ is true exactly when one of }A,B\textrm{ is true.}}
$$

#### E4. Check KB satisfiability by enumeration

**Problem.** Let

$$
\textrm{KB}=\{A\to B,\ A,\ \neg C\}
$$

over symbols $A,B,C$. Determine whether KB is satisfiable by enumerating models.

**Solution.**

The set of models of the knowledge base is

$$
\mathcal{M}(\textrm{KB})
=\mathcal{M}(A\to B)\cap\mathcal{M}(A)\cap\mathcal{M}(\neg C).
$$

List all $2^3=8$ models and evaluate each formula.

| Model | $A$ | $B$ | $C$ | $A\to B$ | $A$ | $\neg C$ | Satisfies all KB formulas? |
|---:|---:|---:|---:|---:|---:|---:|---:|
| $w_1$ | $0$ | $0$ | $0$ | $1$ | $0$ | $1$ | $0$ |
| $w_2$ | $0$ | $0$ | $1$ | $1$ | $0$ | $0$ | $0$ |
| $w_3$ | $0$ | $1$ | $0$ | $1$ | $0$ | $1$ | $0$ |
| $w_4$ | $0$ | $1$ | $1$ | $1$ | $0$ | $0$ | $0$ |
| $w_5$ | $1$ | $0$ | $0$ | $0$ | $1$ | $1$ | $0$ |
| $w_6$ | $1$ | $0$ | $1$ | $0$ | $1$ | $0$ | $0$ |
| $w_7$ | $1$ | $1$ | $0$ | $1$ | $1$ | $1$ | $1$ |
| $w_8$ | $1$ | $1$ | $1$ | $1$ | $1$ | $0$ | $0$ |

Only $w_7$ survives the intersection.

$$
\mathcal{M}(\textrm{KB})=\bigl\{\{A:1,B:1,C:0\}\bigr\}.
$$

Since the model set is not empty,

$$
\mathcal{M}(\textrm{KB})\neq\varnothing.
$$

Therefore KB is satisfiable.

$$
\boxed{\textrm{KB is satisfiable, with unique model }A=1,B=1,C=0.}
$$

#### E5. Apply Horn-clause modus ponens

**Problem.** Let the knowledge base contain the facts and Horn clauses

$$
Rain,
\qquad
Cold,
\qquad
Rain\to Wet,
\qquad
(Wet\wedge Cold)\to Slippery.
$$

Use modus ponens to derive all propositional symbols obtainable by forward inference.

**Solution.**

First identify the facts and rules.

| Item | Type | Reading |
|---|---|---|
| $Rain$ | Fact | It is raining. |
| $Cold$ | Fact | It is cold. |
| $Rain\to Wet$ | Horn clause | If it rains, then it is wet. |
| $(Wet\wedge Cold)\to Slippery$ | Horn clause | If it is wet and cold, then it is slippery. |

Start the forward-inference ledger with the facts already in KB.

| Step | Known facts before step | Rule checked | Are all premises known? | New fact added |
|---:|---|---|---|---|
| 0 | $\{Rain,Cold\}$ | — | — | — |
| 1 | $\{Rain,Cold\}$ | $Rain\to Wet$ | Yes, $Rain$ is known. | $Wet$ |
| 2 | $\{Rain,Cold,Wet\}$ | $(Wet\wedge Cold)\to Slippery$ | Yes, both $Wet$ and $Cold$ are known. | $Slippery$ |
| 3 | $\{Rain,Cold,Wet,Slippery\}$ | All rules | No unused rule can add a new symbol. | None |

Write each modus ponens application explicitly.

First,

$$
\frac{Rain;\quad Rain\to Wet}{Wet}.
$$

So $Wet$ is derived.

Second,

$$
\frac{Wet,Cold;\quad (Wet\wedge Cold)\to Slippery}{Slippery}.
$$

So $Slippery$ is derived.

At closure, the knowledge base contains

$$
\{Rain,Cold,Wet,Slippery,Rain\to Wet,(Wet\wedge Cold)\to Slippery\}.
$$

The newly derived propositional symbols are $Wet$ and $Slippery$.

$$
\boxed{\textrm{KB}\vdash Wet\textrm{ and }\textrm{KB}\vdash Slippery.}
$$

### 🔴 Advanced

#### A1. Entailment, contradiction, or contingency?

**Problem.** Let

$$
\textrm{KB}=\{A\vee B,\ A\to C,\ B\to C\}
$$

over symbols $A,B,C$. Classify the queries $C$, $\neg C$, and $A$ as entailed, contradicted, or contingent with respect to KB.

**Solution.**

A query $f$ is entailed when

$$
\mathcal{M}(\textrm{KB})\cap\mathcal{M}(f)=\mathcal{M}(\textrm{KB}).
$$

It is contradicted when

$$
\mathcal{M}(\textrm{KB})\cap\mathcal{M}(f)=\varnothing.
$$

It is contingent when the intersection is nonempty but smaller than $\mathcal{M}(\textrm{KB})$.

Evaluate the KB on all $2^3=8$ models.

| Model | $A$ | $B$ | $C$ | $A\vee B$ | $A\to C$ | $B\to C$ | In $\mathcal{M}(\textrm{KB})$? |
|---:|---:|---:|---:|---:|---:|---:|---:|
| $w_1$ | $0$ | $0$ | $0$ | $0$ | $1$ | $1$ | $0$ |
| $w_2$ | $0$ | $0$ | $1$ | $0$ | $1$ | $1$ | $0$ |
| $w_3$ | $0$ | $1$ | $0$ | $1$ | $1$ | $0$ | $0$ |
| $w_4$ | $0$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $w_5$ | $1$ | $0$ | $0$ | $1$ | $0$ | $1$ | $0$ |
| $w_6$ | $1$ | $0$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $w_7$ | $1$ | $1$ | $0$ | $1$ | $0$ | $0$ | $0$ |
| $w_8$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |

Thus

$$
\mathcal{M}(\textrm{KB})=\{w_4,w_6,w_8\}.
$$

Now compare each query against those KB models.

| Query $f$ | Values on $w_4,w_6,w_8$ | $\mathcal{M}(\textrm{KB})\cap\mathcal{M}(f)$ | Classification | Reason |
|---|---|---|---|---|
| $C$ | $1,1,1$ | $\{w_4,w_6,w_8\}$ | Entailed | Every KB model has $C=1$. |
| $\neg C$ | $0,0,0$ | $\varnothing$ | Contradicted | No KB model has $C=0$. |
| $A$ | $0,1,1$ | $\{w_6,w_8\}$ | Contingent | Some but not all KB models have $A=1$. |

Therefore

$$
\textrm{KB}\models C,
\qquad
\textrm{KB}\models\neg(\neg C),
\qquad
\textrm{KB}\not\models A.
$$

Because $A$ is true in some but not all KB models, KB neither entails $A$ nor contradicts $A$.

$$
\boxed{C\textrm{ is entailed, }\neg C\textrm{ is contradicted, and }A\textrm{ is contingent.}}
$$

#### A2. Convert a nested formula to CNF

**Problem.** Convert

$$
F=(A\leftrightarrow B)\to(C\vee\neg D)
$$

to conjunctive normal form.

**Solution.**

We convert by eliminating $\leftrightarrow$, eliminating $\to$, pushing negations inward, and distributing $\vee$ over $\wedge$.

Start with the formula.

$$
F=(A\leftrightarrow B)\to(C\vee\neg D).
$$

Eliminate the outer implication using $X\to Y\equiv\neg X\vee Y$.

$$
F\equiv\neg(A\leftrightarrow B)\vee(C\vee\neg D).
$$

Eliminate the biconditional using

$$
A\leftrightarrow B\equiv(A\to B)\wedge(B\to A).
$$

So

$$
F\equiv\neg\bigl((A\to B)\wedge(B\to A)\bigr)\vee(C\vee\neg D).
$$

Eliminate the remaining implications.

$$
A\to B\equiv\neg A\vee B,
\qquad
B\to A\equiv\neg B\vee A.
$$

Thus

$$
F\equiv\neg\bigl((\neg A\vee B)\wedge(\neg B\vee A)\bigr)\vee C\vee\neg D.
$$

Push the negation inward using De Morgan's law.

$$
\neg\bigl((\neg A\vee B)\wedge(\neg B\vee A)\bigr)
\equiv
\neg(\neg A\vee B)\vee\neg(\neg B\vee A).
$$

Push negation through each disjunction.

$$
\neg(\neg A\vee B)\equiv A\wedge\neg B,
\qquad
\neg(\neg B\vee A)\equiv B\wedge\neg A.
$$

Therefore

$$
F\equiv(A\wedge\neg B)\vee(B\wedge\neg A)\vee C\vee\neg D.
$$

Let

$$
R=C\vee\neg D.
$$

Then

$$
F\equiv(A\wedge\neg B)\vee(B\wedge\neg A)\vee R.
$$

Distribute the first conjunction through the rest. Since

$$
(X\wedge Y)\vee Z\equiv(X\vee Z)\wedge(Y\vee Z),
$$

with $X=A$, $Y=\neg B$, and $Z=(B\wedge\neg A)\vee R$, we get

$$
F\equiv\bigl(A\vee(B\wedge\neg A)\vee R\bigr)
\wedge
\bigl(\neg B\vee(B\wedge\neg A)\vee R\bigr).
$$

Distribute inside each clause candidate.

For the first part:

$$
A\vee(B\wedge\neg A)\vee R
\equiv
(A\vee B\vee R)\wedge(A\vee\neg A\vee R).
$$

The clause $A\vee\neg A\vee R$ is a tautology, so it can be dropped from a conjunction.

The first part contributes

$$
A\vee B\vee C\vee\neg D.
$$

For the second part:

$$
\neg B\vee(B\wedge\neg A)\vee R
\equiv
(\neg B\vee B\vee R)\wedge(\neg B\vee\neg A\vee R).
$$

The clause $\neg B\vee B\vee R$ is a tautology, so it can be dropped.

The second part contributes

$$
\neg A\vee\neg B\vee C\vee\neg D.
$$

A rewrite table summarizes the derivation.

| Step | Formula | Rule |
|---:|---|---|
| 1 | $(A\leftrightarrow B)\to(C\vee\neg D)$ | Original. |
| 2 | $\neg(A\leftrightarrow B)\vee C\vee\neg D$ | Eliminate outer $\to$. |
| 3 | $\neg((\neg A\vee B)\wedge(\neg B\vee A))\vee C\vee\neg D$ | Eliminate $\leftrightarrow$ and inner $\to$. |
| 4 | $(A\wedge\neg B)\vee(B\wedge\neg A)\vee C\vee\neg D$ | Push negations inward. |
| 5 | $(A\vee B\vee C\vee\neg D)\wedge(\neg A\vee\neg B\vee C\vee\neg D)$ | Distribute and drop tautological clauses. |

So the CNF is

$$
\boxed{(A\vee B\vee C\vee\neg D)\wedge(\neg A\vee\neg B\vee C\vee\neg D).}
$$

#### A3. Resolution refutation proof

**Problem.** Given the clauses

$$
(A\vee B),
\qquad
(\neg A\vee C),
\qquad
(\neg B\vee C),
\qquad
\neg C,
$$

use resolution to derive False.

**Solution.**

Number the clauses.

| Clause number | Clause |
|---:|---|
| 1 | $A\vee B$ |
| 2 | $\neg A\vee C$ |
| 3 | $\neg B\vee C$ |
| 4 | $\neg C$ |

The resolution rule removes complementary literals. Resolve clause 2 with clause 4 on $C$.

$$
\frac{\neg A\vee C,\quad \neg C}{\neg A}.
$$

Add the derived clause.

| Clause number | Clause | Derived from |
|---:|---|---|
| 5 | $\neg A$ | Clauses 2 and 4, resolving $C$ with $\neg C$. |

Resolve clause 1 with clause 5 on $A$.

$$
\frac{A\vee B,\quad \neg A}{B}.
$$

Add the derived clause.

| Clause number | Clause | Derived from |
|---:|---|---|
| 6 | $B$ | Clauses 1 and 5, resolving $A$ with $\neg A$. |

Resolve clause 3 with clause 6 on $B$.

$$
\frac{\neg B\vee C,\quad B}{C}.
$$

Add the derived clause.

| Clause number | Clause | Derived from |
|---:|---|---|
| 7 | $C$ | Clauses 3 and 6, resolving $\neg B$ with $B$. |

Finally resolve clause 7 with clause 4 on $C$.

$$
\frac{C,\quad\neg C}{False}.
$$

The full derivation ledger is:

| Step | Parent clauses | Complementary pair | Resolvent |
|---:|---|---|---|
| 1 | $(\neg A\vee C)$ and $(\neg C)$ | $C,\neg C$ | $\neg A$ |
| 2 | $(A\vee B)$ and $(\neg A)$ | $A,\neg A$ | $B$ |
| 3 | $(\neg B\vee C)$ and $(B)$ | $\neg B,B$ | $C$ |
| 4 | $(C)$ and $(\neg C)$ | $C,\neg C$ | $False$ |

Since False is derived, the original clause set is unsatisfiable.

$$
\boxed{(A\vee B)\wedge(\neg A\vee C)\wedge(\neg B\vee C)\wedge\neg C\textrm{ is unsatisfiable.}}
$$

#### A4. Prove an entailment using contradiction

**Problem.** Let

$$
\textrm{KB}=\{P\to Q,\ Q\to R,\ P\}
$$

and let the query be $R$. Prove $\textrm{KB}\models R$ by adding $\neg R$, converting to CNF, and deriving False by resolution.

**Solution.**

To prove entailment by contradiction, check whether

$$
\textrm{KB}\cup\{\neg R\}
$$

is unsatisfiable. If adding $\neg R$ leads to False, then every model of KB must satisfy $R$.

Convert each formula to CNF.

| Formula | CNF clause | Rule |
|---|---|---|
| $P\to Q$ | $\neg P\vee Q$ | Eliminate implication. |
| $Q\to R$ | $\neg Q\vee R$ | Eliminate implication. |
| $P$ | $P$ | Already a unit clause. |
| $\neg R$ | $\neg R$ | Added negated query. |

Number the clauses.

| Clause number | Clause |
|---:|---|
| 1 | $\neg P\vee Q$ |
| 2 | $\neg Q\vee R$ |
| 3 | $P$ |
| 4 | $\neg R$ |

Resolve clause 1 with clause 3 on $P$.

$$
\frac{\neg P\vee Q,\quad P}{Q}.
$$

So add:

| Clause number | Clause | Derived from |
|---:|---|---|
| 5 | $Q$ | Clauses 1 and 3. |

Resolve clause 2 with clause 5 on $Q$.

$$
\frac{\neg Q\vee R,\quad Q}{R}.
$$

So add:

| Clause number | Clause | Derived from |
|---:|---|---|
| 6 | $R$ | Clauses 2 and 5. |

Resolve clause 6 with clause 4 on $R$.

$$
\frac{R,\quad\neg R}{False}.
$$

The refutation chain is:

| Step | Clauses used | Resolvent | Meaning |
|---:|---|---|---|
| 1 | $(\neg P\vee Q)$ and $P$ | $Q$ | From $P$ and $P\to Q$, infer $Q$. |
| 2 | $(\neg Q\vee R)$ and $Q$ | $R$ | From $Q$ and $Q\to R$, infer $R$. |
| 3 | $R$ and $\neg R$ | $False$ | The negated query contradicts what KB forces. |

Because $\textrm{KB}\cup\{\neg R\}$ is unsatisfiable,

$$
\textrm{KB}\models R.
$$

$$
\boxed{\{P\to Q,Q\to R,P\}\models R.}
$$

#### A5. Compare Horn inference with general resolution

**Problem.** Consider the knowledge base

$$
\textrm{KB}=\{A\vee B,\ A\to C,\ B\to C,\ C\to D\}
$$

and query $D$. The clause $A\vee B$ is not a Horn clause of the definite form $(p_1\wedge\cdots\wedge p_k)\to q$. Compare what Horn-clause modus ponens can do with what general resolution can do.

**Solution.**

First classify the formulas.

| Formula | Equivalent view | Horn definite clause? | Reason |
|---|---|---:|---|
| $A\vee B$ | A disjunction of two positive literals | No | It does not have a single positive head forced by known premises. |
| $A\to C$ | $A$ implies $C$ | Yes | It has body $A$ and head $C$. |
| $B\to C$ | $B$ implies $C$ | Yes | It has body $B$ and head $C$. |
| $C\to D$ | $C$ implies $D$ | Yes | It has body $C$ and head $D$. |

Horn forward inference starts with known atomic facts. Here, there are no initial atomic facts such as $A$ or $B$.

| Horn step | Known atomic facts | Horn rule checked | Can modus ponens fire? | New fact |
|---:|---|---|---|---|
| 0 | $\varnothing$ | — | — | — |
| 1 | $\varnothing$ | $A\to C$ | No, $A$ is not known. | None |
| 2 | $\varnothing$ | $B\to C$ | No, $B$ is not known. | None |
| 3 | $\varnothing$ | $C\to D$ | No, $C$ is not known. | None |

Therefore pure Horn modus ponens alone derives no atomic symbol from this KB.

$$
\textrm{KB}\not\vdash_{\textrm{modus ponens}}D.
$$

Now use general resolution to prove that $D$ is nevertheless entailed. Add the negated query $\neg D$ and convert all formulas to clauses.

| Source | Clause |
|---|---|
| $A\vee B$ | $A\vee B$ |
| $A\to C$ | $\neg A\vee C$ |
| $B\to C$ | $\neg B\vee C$ |
| $C\to D$ | $\neg C\vee D$ |
| Negated query | $\neg D$ |

Number the clauses.

| Clause number | Clause |
|---:|---|
| 1 | $A\vee B$ |
| 2 | $\neg A\vee C$ |
| 3 | $\neg B\vee C$ |
| 4 | $\neg C\vee D$ |
| 5 | $\neg D$ |

Resolve clause 4 with clause 5 on $D$.

$$
\frac{\neg C\vee D,\quad \neg D}{\neg C}.
$$

Add clause 6:

$$
6.\quad \neg C.
$$

Resolve clause 2 with clause 6 on $C$.

$$
\frac{\neg A\vee C,\quad\neg C}{\neg A}.
$$

Add clause 7:

$$
7.\quad \neg A.
$$

Resolve clause 1 with clause 7 on $A$.

$$
\frac{A\vee B,\quad\neg A}{B}.
$$

Add clause 8:

$$
8.\quad B.
$$

Resolve clause 3 with clause 8 on $B$.

$$
\frac{\neg B\vee C,\quad B}{C}.
$$

Add clause 9:

$$
9.\quad C.
$$

Resolve clause 9 with clause 6 on $C$.

$$
\frac{C,\quad\neg C}{False}.
$$

The two-column comparison is:

| Goal | Horn-clause modus ponens | General resolution |
|---|---|---|
| Use $A\vee B$ | Cannot turn it into either fact $A$ or fact $B$. | Can combine it with $\neg A$ or $\neg B$ in a proof. |
| Derive $C$ | Cannot start because neither $A$ nor $B$ is known as a fact. | Derives $C$ indirectly during the refutation. |
| Derive $D$ | Cannot derive $D$ because $C$ is not known. | Proves $D$ by showing $\textrm{KB}\cup\{\neg D\}$ is unsatisfiable. |
| Completeness guarantee | Complete for Horn KBs and entailed propositional symbols. | Sound and complete for general propositional logic. |

Thus, even though the Horn rules are useful, the non-Horn clause $A\vee B$ requires general resolution to complete the proof of $D$.

$$
\boxed{\textrm{Horn modus ponens stalls, but resolution proves }\textrm{KB}\models D.}
$$
