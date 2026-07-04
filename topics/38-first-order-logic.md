# First-order Logic

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 38/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

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
