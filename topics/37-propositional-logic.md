# Propositional Logic

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 37/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

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
