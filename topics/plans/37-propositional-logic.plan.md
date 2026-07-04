# Lesson Plan — 37 Propositional Logic

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Formula/Concept |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 40–55 min |
| Source topic file | ../37-propositional-logic.md |

## Part 1 — Overview (plan)
Propositional logic turns statements into formulas whose truth can be checked across binary models.
Hook: an AI agent can answer questions by proving what every model of its knowledge base must satisfy.

## Part 2 — Key Idea (plan)
- **Focus (per category = Formula/Concept):** state the core syntax and semantics of propositional formulas,
  then derive how knowledge bases support satisfiability, entailment, contradiction, and rule-based inference.
- **Core artifacts to present:** connectives $\neg,\wedge,\vee,\to,\leftrightarrow$ and their truth-table meanings;
  model $w$ and interpretation $\mathcal{I}(f,w)$; model set $\mathcal{M}(f)$; KB model intersection
  $\mathcal{M}(\textrm{KB})=\bigcap_{f\in\textrm{KB}}\mathcal{M}(f)$; satisfiability
  $\mathcal{M}(\textrm{KB})\neq\varnothing$; entailment/contradiction/contingency by set inclusion or disjointness;
  inference rule notation; soundness and completeness; Horn clauses; modus ponens; CNF conversion rules;
  resolution rule and refutation by deriving False.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Evaluate a compound formula in one model | Model $w=\{A:1,B:0,C:1\}$ and formula $(A\wedge \neg B)\to C$ | Recursive interpretation $\mathcal{I}(f,w)$ with a truth-value trace table |
| E2 | Build a truth table for implication and biconditional | Two symbols $P,Q$ with $P\to Q$ and $P\leftrightarrow Q$ | Complete 4-row truth table and why implication is false only when $P$ true and $Q$ false |
| E3 | List models of a small formula | Formula $(A\vee B)\wedge \neg(A\wedge B)$ | Enumerating $\mathcal{M}(f)$ in a model-set table and recognizing exclusive-or behavior |
| E4 | Check KB satisfiability by enumeration | KB $=\{A\to B,\ A,\ \neg C\}$ over $A,B,C$ | Filtering a truth table by intersecting model sets until at least one model remains |
| E5 | Apply Horn-clause modus ponens | Facts $Rain$, $Rain\to Wet$, $(Wet\wedge Cold)\to Slippery$, and fact $Cold$ | Forward-inference ledger deriving one symbol at a time until closure |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Entailment, contradiction, or contingency? | KB $=\{A\vee B,\ A\to C,\ B\to C\}$ and queries $C$, $\neg C$, $A$ | Model-set comparison table deciding $\textrm{KB}\models f$, $\textrm{KB}\models\neg f$, or neither |
| A2 | Convert a nested formula to CNF | Formula $(A\leftrightarrow B)\to (C\vee \neg D)$ | Step-by-step rewrite table eliminating $\leftrightarrow,\to$, pushing negations, and distributing $\vee$ over $\wedge$ |
| A3 | Resolution refutation proof | Clauses $(A\vee B)$, $(\neg A\vee C)$, $(\neg B\vee C)$, $\neg C$ | Clause-derivation tree repeatedly resolving complementary literals to derive False |
| A4 | Prove an entailment using contradiction | KB $=\{P\to Q,\ Q\to R,\ P\}$ and query $R$ | Add $\neg R$, convert to CNF clauses, and use a refutation chain to show unsatisfiable |
| A5 | Compare Horn inference with general resolution | Horn KB plus a non-Horn clause $(A\vee B)$ and query $D$ | Two-column derivation log showing where linear-time modus ponens applies and where resolution is required |

## Part 4 — Colab Notebook
N/A — 🧮 numeric topic (no notebook).

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** evaluate a formula under one model; fill a truth table for a connective; list models satisfying a two-symbol formula; test satisfiability of a tiny KB; apply one or two modus-ponens steps to Horn clauses.
- **🔴 Hard (5) — themes:** classify a query as entailed/contradicted/contingent; convert a formula with $\leftrightarrow$ and nested negations to CNF; write a resolution proof; prove entailment by adding the negated query; analyze whether a rule set is sound and complete for the given KB class.
