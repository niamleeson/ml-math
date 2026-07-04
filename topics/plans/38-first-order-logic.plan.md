# Lesson Plan — 38 First-order Logic

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Formula/Concept |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 40–55 min |
| Source topic file | ../38-first-order-logic.md |

## Part 1 — Overview (plan)
First-order logic extends propositional logic with objects, predicates, variables, and quantifiers so a few
rules can describe many facts. Hook: one quantified rule such as "all parents are ancestors" can replace a
large list of propositional implications.

## Part 2 — Key Idea (plan)
- **Focus (per category = Formula/Concept):** define the semantic pieces of first-order logic and derive how
  substitution, unification, modus ponens, and resolution let quantified rules produce ground conclusions.
- **Core artifacts to present:** models mapping constants to objects and predicates to tuples; universal and
  existential quantifiers $\forall,\exists$; atomic formulas with variables; first-order Horn clause
  $\forall x_1,\ldots,x_n\,(a_1\wedge\cdots\wedge a_k)\to b$; substitution $\theta$ and
  $\operatorname{Subst}(\theta,f)$; most general unifier $\operatorname{Unify}[f,g]$ or Fail; first-order
  modus ponens with $\theta=\operatorname{Unify}(a'_1\wedge\cdots\wedge a'_k,a_1\wedge\cdots\wedge a_k)$;
  first-order resolution with unification; completeness for Horn-clause modus ponens; semi-decidability.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Interpret a model with constants and predicates | Domain $\{alice,bob\}$, constants $A,B$, predicate $Parent$ | Object/predicate table mapping symbols to objects and deciding whether $Parent(A,B)$ is true |
| E2 | Evaluate universal and existential statements | Facts $Student(alice)$, $Student(bob)$, $Likes(alice,Math)$ | Quantifier check table testing $\forall x\,Student(x)\to Likes(x,Math)$ and $\exists x\,Likes(x,Math)$ |
| E3 | Apply a substitution to a formula | $\theta=\{x/alice,\ y/bob\}$ and $Parent(x,y)\to Ancestor(x,y)$ | Before/after formula table computing $\operatorname{Subst}(\theta,f)$ exactly |
| E4 | Find a most general unifier | $Parent(x,bob)$ and $Parent(alice,y)$ | Unification ledger deriving $\theta=\{x/alice,\ y/bob\}$ and checking equality after substitution |
| E5 | One first-order modus ponens step | Rule $\forall x\,Student(x)\to Person(x)$ and fact $Student(alice)$ | Rule/fact/conclusion table: unify premise, substitute conclusion, derive $Person(alice)$ |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Multi-premise Horn inference | Rules $Parent(x,y)\to Ancestor(x,y)$ and $Parent(x,y)\wedge Ancestor(y,z)\to Ancestor(x,z)$ with family facts | Forward-inference derivation tree using repeated unification and substitutions to derive grandparent ancestry |
| A2 | Detect unification failure | $Parent(x,x)$ vs. $Parent(alice,bob)$ and $Knows(x,f(x))$ vs. $Knows(g(y),y)$ | Constraint ledger showing equality constraints, conflicting assignments, and occurs-check intuition |
| A3 | First-order resolution proof | Clauses $Human(socrates)$, $\neg Human(x)\vee Mortal(x)$, and negated query $\neg Mortal(socrates)$ | Resolution chain unifying complementary literals and deriving the empty clause |
| A4 | Standardize variables apart before inference | Two quantified rules both using variable name $x$ | Renaming/substitution table avoiding accidental variable capture before unification |
| A5 | Semi-decidability in a recursive rule set | Rule $Next(x)\to Next(f(x))$ and query not entailed by finite facts | Expanding proof frontier sketch explaining why entailed facts may be found in finite time but non-entailment may not halt |

## Part 4 — Colab Notebook
N/A — 🧮 numeric topic (no notebook).
