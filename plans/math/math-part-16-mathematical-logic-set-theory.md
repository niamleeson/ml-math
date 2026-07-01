# Math · Part 16 — Mathematical logic & set theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles: warm teacher's voice, complete step-by-step derivations, case-by-case derivation
> choice, and every important symbol named in plain English. This plan rewrites the scaffold into concrete
> per-lesson authoring guidance. Numeric examples were checked with `python3` from this workspace: truth-table
> counts $2^n$, product cardinalities, power-set counts, finite search sizes, simple loss totals, and finite
> verification counts.

**Section:** Mathematical logic & set theory · **Lessons:** 19 · **Breadcrumb:** `Mathematics · Discrete & Foundations` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 19 |
| Templated / thin motivation (stock opener or ≤45 words) | 0 / 19 |
| Key formula not in display form | 6 / 19 |
| Unclosed-`$` LaTeX bug | 0 / 19 |
| Derivation to author / deepen / explain-only | 12 derivation/proof · 7 explain-only |

**The core change:** keep the strong lesson-specific applications, but deepen the lessons so each definitional
concept is explained plainly and each genuine theorem, identity, counting rule, or computability limit is proved
step by step. The section should connect logic and set theory to SAT solving, program verification, type systems,
decidability limits, and neuro-symbolic AI without turning applications into generic CS name-dropping.

---

## Priority & systemic issues

- There is **no whole-section §5 boilerplate block**. Preserve the concept-specific flavor and ensure every lesson
  has exactly six applications with a re-derivable number or concrete instance.
- Promote the six central formulas/statements to display form: logical equivalence, CNF/DNF conversion laws, ZFC
  extensionality/separation examples, relations as subsets of products, cardinality/product cardinality, and
  infinite-set diagonalization.
- Do not force proofs for pure foundation vocabulary. `math-16-09` (naive set theory), `math-16-10` (ZFC),
  `math-16-14` (ordinals), and `math-16-15` (choice) are explanation-first lessons. They can include finite
  worked examples, but not fake derivations.
- Add genuine short proofs where the concept has a reproducible argument: truth-table row counts, conditional and
  De Morgan equivalences, CNF conversion, quantifier negation/order, modus ponens soundness, relation/order checks,
  finite product cardinality, countability by bijection, Cantor diagonalization, halting undecidability, and the
  neuro-symbolic constrained-choice/loss calculation.
- LaTeX bug scan: **0 genuine odd-`$` or matrix-row bugs found** in the current dump. Keep the existing math syntax
  balanced while expanding.

---

## Model entry (full prose)

### `math-16-12` — Cardinality — **full-depth model entry (this is the bar)**

**Connections (§1).** *(Plain textbook voice: what the reader already knows, and where this fits. Prose, not a bullet list.)*
> This lesson builds on the set vocabulary from the previous lessons: elements, subsets, unions, products, and
> functions. A finite set can be counted by listing its elements, but the deeper idea is that counting is a kind
> of matching. When a set has three elements, it can be matched perfectly with the counting set
> $\{1,2,3\}$.
>
> That matching idea is the reason cardinality works for both finite and infinite sets. It will let us count
> product spaces such as labels crossed with devices, compare different data domains, and prepare for the next
> lesson's surprise that the natural numbers and even numbers have the same size while the real numbers are
> larger than any list.

**Motivation & Intuition (§2).** *(Plain, clear explanation of the concept itself.)*
> Cardinality is the mathematical word for size, but it is not only a way to attach a number to a small set. The
> important move is pairing. Two sets have the same size when every element of the first set can be paired with
> exactly one element of the second, with nothing left over on either side.
>
> For finite sets, this agrees with ordinary counting. If $A=\{red,blue,green\}$ and
> $B=\{10,20,30\}$, the function $red\mapsto10$, $blue\mapsto20$, $green\mapsto30$ is a bijection, so the two
> sets have the same cardinality. The elements have different meanings, but cardinality ignores the meanings and
> counts the perfect pairing.
>
> Products are the first place this becomes especially useful. If $A$ has $m$ choices and $B$ has $n$ choices,
> then an element of $A\times B$ is made by choosing one item from $A$ and one item from $B$. For every first
> choice there are $n$ second choices, and there are $m$ first choices. That is why the product has $mn$ ordered
> pairs.

**Definition & Assumptions (§3).** Display the core definitions and product rule:

$$
|A|=|B| \quad\text{means there is a bijection } f:A\to B.
$$

$$
|A\times B|=|A|\,|B|=mn \quad\text{when } |A|=m \text{ and } |B|=n.
$$

**Derive (complete).** Prove the finite product rule and include a countability example.
1. Let $A=\{a_1,\ldots,a_m\}$ — this lists each element of the finite set $A$ exactly once.
2. Let $B=\{b_1,\ldots,b_n\}$ — this lists each element of the finite set $B$ exactly once.
3. For the fixed first element $a_i$, the possible pairs are $(a_i,b_1),\ldots,(a_i,b_n)$ — the second coordinate can be any of the $n$ elements of $B$.
4. Thus each fixed $a_i$ contributes $n$ ordered pairs — the first coordinate is held constant while the second coordinate varies.
5. There are $m$ possible first coordinates $a_i$ — the list for $A$ has $m$ entries.
6. The $m$ groups do not overlap — a pair with first coordinate $a_i$ cannot also have first coordinate $a_j$ when $i\ne j$.
7. Add the disjoint group sizes: $n+n+\cdots+n$ with $m$ copies equals $mn$ — this counts every ordered pair once.
8. Therefore $|A\times B|=mn$ — the product rule follows from listing first choices and second choices.
9. For countability, define $f:\mathbb N\to E$ by $f(k)=2k$, where $E=\{2,4,6,\ldots\}$ — every natural number is paired with one even number.
10. The function is one-to-one because $2k=2\ell$ implies $k=\ell$ — no two natural numbers land on the same even number.
11. The function is onto because every positive even number has the form $2k$ for some $k\in\mathbb N$ — no even number is missed.
12. Hence $|\mathbb N|=|E|$ — an infinite proper subset can have the same cardinality as the whole set.

**Symbols.** $|A|$ is the cardinality, or size, of set $A$; $f:A\to B$ is a function from elements of $A$ to
 elements of $B$; a **bijection** is one-to-one and onto; $A\times B$ is the set of ordered pairs $(a,b)$ with
 $a\in A$ and $b\in B$; $m,n$ are finite cardinalities; $\mathbb N$ is the positive counting numbers in this
 lesson; $E$ is the set of positive even integers.

**Assumptions.** Sets ignore order and duplicate listing; a bijection must cover every target exactly once; the
formula $|A\cup B|=|A|+|B|$ only holds for disjoint sets; and cardinality compares size, not the meaning or value
of the elements.

**Real-World Applications (§5).**
1. **Dataset union.** If training has $12{,}000$ rows and validation has $3{,}000$ disjoint rows, the union has $15{,}000$ rows because disjoint cardinalities add.
2. **Embedding table size.** A tokenizer with ids $0$ through $49{,}999$ has $50{,}000$ tokens; with dimension $768$, the embedding table has $50{,}000\cdot768=38{,}400{,}000$ weights.
3. **One-hot labels.** With $7$ classes, there are $7$ valid one-hot target vectors of length $7$, not $2^7$, because the valid set requires exactly one coordinate to be $1$.
4. **Feature crosses.** Crossing $100$ countries with $20$ device types gives $100\cdot20=2{,}000$ possible categorical pairs by the product rule.
5. **Hash buckets.** Mapping $10{,}000$ keys into $1{,}000$ buckets gives average load $10{,}000/1{,}000=10$ keys per bucket.
6. **Leakage audit.** If train has $8{,}000$ users, test has $2{,}500$, and overlap is $300$, then the distinct users across both are $8{,}000+2{,}500-300=10{,}200$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson, in render order. The labels
(Intuition / Derive / Symbols / Apps) are plan shorthand; the lesson should render them as flowing prose and
structured definition cards. Every application list must have exactly six entries, each tied to that lesson's
own concept and number.

### `math-16-01` — Propositional logic and truth tables · AUTHOR derivation

**Connections (§1).**
> This lesson begins with the simplest kind of formal statement: a sentence that is either true or false. It builds on ordinary yes-or-no reasoning, but makes the rules precise enough that every case can be checked. Truth tables are the bridge from informal logic to later work with equivalence, normal forms, proof systems, and SAT solvers. The main habit is finite exhaustion: when there are only finitely many truth assignments, a careful table can settle the question completely.

**Motivation & Intuition (§2).**
> Propositional logic studies how the truth of a compound statement depends on the truth of its atomic parts. The atoms, such as $P$ and $Q$, are not opened up internally; each is treated only as true or false. Connectives such as and, or, not, and implication then combine those truth values according to fixed rules.
>
> A truth table is the finite checklist that evaluates every possible assignment once. If a formula uses $n$ independent atomic propositions, each atom contributes two choices, so the table has $2^n$ rows. This makes truth tables useful for proving tautologies, finding counterexamples, and checking Boolean conditions in programs or circuits.

**Definition & Assumptions (§3).**

**Derive (complete).** Prove the row count and the tautology $(P\land Q)\to P$.
1. One atomic proposition has two possible truth values, $T$ and $F$ — the system is two-valued.
2. For two independent propositions, each value of $P$ can be paired with two values of $Q$ — multiplication gives $2\cdot2=4$ rows.
3. For $n$ atomic propositions, repeat the same choice $n$ times — the table has $2^n$ rows.
4. For $(P\land Q)\to P$, list the four rows for $P,Q$ — this exhausts all cases.
5. $P\land Q$ is true only in the row $P=T,Q=T$ — conjunction requires both parts.
6. In that row, the conclusion $P$ is also true — so the implication is true in its only demanding case.
7. In the other three rows, $P\land Q$ is false — a false antecedent makes $A\to B$ true in propositional logic.
8. Therefore every row is true — $(P\land Q)\to P$ is a tautology.

**Symbols.** $P,Q$ atomic propositions; $\land$ means and; $\lor$ inclusive or; $\neg$ not; $\to$ implication; $2^n$ row count for $n$ atoms.

**Assumptions.** Atomic propositions are independent truth choices unless a formula states a relationship; truth values are exactly $T$ and $F$; implication uses the standard truth-table convention in which a false antecedent makes $A\to B$ true.

**Real-World Applications (§5).**
1. **Feature flags:** $A\land B$ is true in $1$ of $4$ two-flag rows.
2. **Database filter:** $P=T,Q=F$ makes $P\land Q=F$.
3. **Circuit gate:** inputs $1,0$ give AND $0$ and OR $1$.
4. **Unit checks:** $C=T,L=F$ makes $C\land L=F$.
5. **Safety filter:** $S\land\neg E$ with $S=T,E=F$ gives $T$.
6. **Search predicate:** $(T\lor A)\land Y$ with $T=F,A=T,Y=T$ evaluates to $T$.

### `math-16-02` — Logical equivalence · AUTHOR derivation

**Connections (§1).**
> This lesson uses truth tables from the previous lesson to compare whole formulas rather than single rows. Once a formula can be evaluated under every truth assignment, two formulas can be checked for having the same behavior in all cases. Logical equivalence is the rule that makes algebra-like simplification possible in logic. It prepares the ground for normal forms, query rewrites, compiler simplification, and proof transformations.

**Motivation & Intuition (§2).**
> Logical equivalence permits a formula to be replaced by another formula with the same truth value in every row. The formulas may look different, but if their truth tables agree everywhere, no logical context can distinguish them. This is the logic version of simplifying an expression without changing its value.
>
> The most useful equivalences are small reusable patterns. Rewriting $P\to Q$ as $\neg P\lor Q$ removes implication and exposes the one failure case directly. De Morgan's laws move negation across and/or structure, which is why they appear in database filters, set complements, and program conditions.

**Definition & Assumptions (§3).** Display the core equivalence idea:

$$
A\equiv B \quad\text{means } A \text{ and } B \text{ have the same truth value in every row.}
$$

**Derive (complete).** Prove the conditional rewrite and De Morgan's first law.
1. Build the four rows for $P,Q$ — two atoms require $2^2=4$ cases.
2. $P\to Q$ is false only when $P=T$ and $Q=F$ — implication fails only when a true promise has a false result.
3. $\neg P\lor Q$ is false only when $\neg P=F$ and $Q=F$ — an or is false only when both disjuncts are false.
4. $\neg P=F$ means $P=T$ — negation reverses truth.
5. Thus $\neg P\lor Q$ is false exactly when $P=T,Q=F$ — the same single row as $P\to Q$.
6. Since the formulas agree on the false row and are true on the other three rows, $P\to Q\equiv\neg P\lor Q$.
7. For De Morgan, $\neg(P\land Q)$ is true exactly when not both $P$ and $Q$ are true — it rejects only the $T,T$ row.
8. $\neg P\lor\neg Q$ is true exactly when at least one of $P,Q$ is false — it also rejects only the $T,T$ row.
9. Therefore $\neg(P\land Q)\equiv\neg P\lor\neg Q$.

**Symbols.** $A\equiv B$ means same truth table; $A\leftrightarrow B$ biconditional; tautology means true in every row; $\neg,\land,\lor,\to$ are truth connectives.

**Assumptions.** Equivalence is semantic agreement across all truth assignments; replacing a formula by an equivalent one preserves truth in any larger propositional formula; implication and negation use the standard two-valued truth rules.

**Real-World Applications (§5).**
1. **Compiler simplification:** $(P\land T)\lor F\equiv P$, so one flag replaces three connectives.
2. **Query rewrite:** $\neg(A\land B)$ becomes $\neg A\lor\neg B$.
3. **Exhaustive Boolean tests:** two flags require $4$ rows.
4. **Set complement:** universe size $20$ and $|A\cap B|=6$ gives complement size $14$.
5. **Safety rule:** $\neg(O\land H)$ allows $3$ of $4$ rows.
6. **Validation failure:** failure of $R\to C$ is $R\land\neg C$.

### `math-16-03` — Normal forms · AUTHOR derivation

**Connections (§1).**
> This lesson builds directly on logical equivalence. If equivalent formulas can replace each other, then a formula can be reshaped without changing the truth conditions it represents. Normal forms are standard target shapes for that reshaping. They are especially important in automated reasoning because tools such as SAT solvers work best when formulas arrive in a predictable structure.

**Motivation & Intuition (§2).**
> Normal forms put logical formulas into a standard shape. CNF is an and of clauses, where each clause is an or of literals. DNF is an or of cases, where each case is an and of literals that describes one way for the formula to be true.
>
> The standard shape matters because it separates meaning from presentation. A policy, circuit, or rule may be written in a convenient human form, but a solver often needs clauses. Rewriting with equivalences lets us keep the same truth table while turning the formula into a form that an algorithm can process systematically.

**Definition & Assumptions (§3).** Display the normal-form shapes:

$$
\text{CNF}=(\ell_{11}\lor\cdots\lor\ell_{1k})\land\cdots\land(\ell_{m1}\lor\cdots\lor\ell_{mr}).
$$

$$
\text{DNF}=(\ell_{11}\land\cdots\land\ell_{1k})\lor\cdots\lor(\ell_{m1}\land\cdots\land\ell_{mr}).
$$

**Derive (complete).** Convert $P\to(Q\land R)$ to CNF.
1. Start with $P\to(Q\land R)$ — this is the original formula.
2. Replace implication: $P\to X\equiv\neg P\lor X$ — use the equivalence from `math-16-02`.
3. Substitute $X=Q\land R$: $\neg P\lor(Q\land R)$ — the implication is gone.
4. Distribute or over and: $A\lor(B\land C)\equiv(A\lor B)\land(A\lor C)$ — this creates clauses.
5. Use $A=\neg P$, $B=Q$, $C=R$ to get $(\neg P\lor Q)\land(\neg P\lor R)$.
6. Each parenthesized part is a clause, and the full formula is an and of clauses — this is CNF.
7. Check size: the CNF has $2$ clauses and $4$ literal occurrences — each clause contains two literals.

**Symbols.** Literal means atom or negated atom; clause means or of literals; CNF means and of clauses; DNF means or of and-terms; $P,Q,R$ atoms.

**Assumptions.** Normal-form conversion preserves truth by using logical equivalences; a literal is not simplified further except by removing double negations when present; clause counts and literal occurrences describe the written converted formula.

**Real-World Applications (§5).**
1. **SAT input:** $(P\lor Q)\land(\neg P\lor R)$ has $2$ clauses and $4$ literal occurrences.
2. **Rule audit:** a $5$-clause CNF fails when clause $3$ is false.
3. **Truth-table synthesis:** a three-atom function true on $2$ rows gives $2$ DNF terms of $3$ literals each.
4. **Circuit design:** a DNF with $3$ two-literal terms uses $3$ AND gates feeding one OR gate.
5. **Access policy:** $Admin\lor(Employee\land MFA)$ accepts employee-with-MFA even when admin is false.
6. **Feature-cross explanation:** a two-case DNF has exactly $2$ sufficient rule paths.

### `math-16-04` — Predicate (first-order) logic · explain-only

**Connections (§1).**
> This lesson extends propositional logic by opening up the atoms. Instead of treating a statement as a sealed symbol like $P$, predicate logic lets the statement mention objects, properties, and relationships. That extra structure is needed for mathematics, databases, graphs, type systems, and program specifications. Later lessons on quantifiers and semantics depend on this language.

**Motivation & Intuition (§2).**
> Predicate logic opens atomic statements so they can mention objects, properties, and relationships. A predicate such as $P(x)$ can be true for some objects and false for others, while a relation such as $R(x,y)$ can describe a connection between two objects. The truth of the statement now depends not only on the formula, but also on which objects the variables name.
>
> This is the language needed for claims about users, graph nodes, array indices, types, and mathematical structures. It lets a formula say that a user has a field, one node points to another, or one index is less than another. The lesson is explanation-first because the main goal is to learn the syntax and how to evaluate concrete examples in a chosen domain.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — this lesson introduces the syntax of predicates, terms, variables, and domains; the worked task should evaluate examples rather than prove a theorem.

**Symbols.** $P(x)$ predicate with one input; $R(x,y)$ relation with two inputs; domain $D$ set of objects; free variable not bound by a quantifier; bound variable controlled by $\forall$ or $\exists$.

**Assumptions.** A predicate is interpreted over a specified domain; free variables need an assignment before a formula has a truth value; bound variables receive their meaning from the quantifier that controls them.

**Real-World Applications (§5).**
1. **Knowledge graph:** $R(Alice,Company)=T$ and $R(Bob,Company)=F$ distinguish $2$ objects.
2. **Database table:** `Enrolled(student, course)` with $1{,}200$ rows stores $1{,}200$ true pairs.
3. **Sorted array spec:** length $n$ uses predicates over index pairs $0\le i<j<n$.
4. **Type system:** two facts, $HasField(User,email)$ and $HasField(User,age)$, justify two safe field accesses.
5. **Fairness constraint:** $4$ groups require $4$ checks of $e_g\le0.05$.
6. **Graph edge relation:** $5$ nodes give $5\cdot5=25$ possible directed edge facts.

### `math-16-05` — Quantifiers · AUTHOR derivation

**Connections (§1).**
> This lesson builds on predicate logic by adding the words that control variables. Predicates can say that an object has a property; quantifiers say whether all objects have it or at least one object has it. This is the step from evaluating individual facts to stating general conditions. It supports invariants, database existence checks, optimization witnesses, and mathematical proof patterns.

**Motivation & Intuition (§2).**
> Quantifiers make the words every and some precise. A universal statement $\forall x$ must survive every allowed value of $x$, so one counterexample is enough to make it false. An existential statement $\exists x$ needs at least one successful value, called a witness.
>
> Quantifier order is part of the meaning. In $\forall x\exists y$, the choice of $y$ may depend on the earlier value of $x$. In $\exists y\forall x$, one shared $y$ must work for all $x$. The same predicate can therefore express very different claims when the quantifiers are rearranged.

**Definition & Assumptions (§3).**

**Derive (complete).** Evaluate quantifier order on $D=\{1,2,3\}$ with $R(x,y)$ meaning $x<y$.
1. For $\forall x\exists y\,R(x,y)$, test each $x\in D$ — universal quantification requires all $x$ values.
2. For $x=1$, choose $y=2$ — $1<2$ is true.
3. For $x=2$, choose $y=3$ — $2<3$ is true.
4. For $x=3$, no $y\in\{1,2,3\}$ satisfies $3<y$ — the largest element has no larger witness.
5. Therefore $\forall x\exists y\,R(x,y)$ is false — one failed universal case is enough.
6. For $\exists y\forall x\,R(x,y)$, look for one shared $y$ — existential comes before the universal.
7. If $y=1$, $x=1$ already fails because $1<1$ is false; similarly $y=2$ fails at $x=2$ and $y=3$ fails at $x=3$.
8. Therefore $\exists y\forall x\,R(x,y)$ is false — no single element is larger than every element of $D$.
9. This example shows quantifier order changes meaning — witnesses may depend on earlier variables only when the existential comes later.

**Symbols.** $\forall$ means for every; $\exists$ means there exists; $D$ domain; witness means a concrete object proving an existential statement; bound variable is governed by a quantifier.

**Assumptions.** Quantifiers range only over the stated domain; a universal statement fails if any domain element fails; an existential statement succeeds when a valid witness is found; later existential witnesses may depend on earlier universal choices.

**Real-World Applications (§5).**
1. **Invariant checking:** $6$ reachable states all safe supports $\forall s\,Safe(s)$.
2. **SQL EXISTS:** order $104$ with $3$ line items makes $\exists r\,LineItem(r,104)$ true.
3. **Fairness audit:** across $5$ groups, one gap $0.08>0.05$ proves $\exists g\,Violation(g)$.
4. **Optimization:** losses $[3,1,4]$ give index $2$ as a minimizer witness.
5. **API contract:** $100$ returned ids require $100$ positivity checks for a universal promise.
6. **Reachability:** $4$ nodes require $4\cdot4=16$ ordered-pair checks for all-pairs reachability.

### `math-16-06` — Formal semantics · explain-only

**Connections (§1).**
> This lesson follows predicate logic and quantifiers by explaining what makes their formulas true. Syntax tells us which strings are well formed, but semantics supplies the world where those strings are evaluated. The same formula can be true in one structure and false in another. This distinction is central for model checking, databases, knowledge bases, and proof theory.

**Motivation & Intuition (§2).**
> Formal semantics supplies the world in which a formula is true or false. It fixes the domain, the meanings of names and relations, and the recursive truth rules for compound formulas. A structure tells us what objects exist and which atomic facts hold among them.
>
> Once the atomic facts are interpreted, larger formulas are evaluated by their logical shape. Negation flips truth, conjunction requires both parts, and quantifiers inspect the domain. The notation $\mathcal M\models\varphi$ records that the structure $\mathcal M$ satisfies the formula $\varphi$.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — the lesson defines satisfaction $\mathcal M\models\varphi$ recursively; author the worked example as a careful evaluation in a finite structure.

**Symbols.** $\mathcal M$ structure/model; $D$ domain; $\models$ satisfies; assignment gives values to free variables; $\Gamma\models\varphi$ semantic consequence.

**Assumptions.** A formula with free variables needs an assignment; quantifiers range over the model's domain; semantic consequence means every model satisfying the premises also satisfies the conclusion.

**Real-World Applications (§5).**
1. **Model checking:** $8$ states require $8$ checks for $\forall s\,Safe(s)$.
2. **Database semantics:** a relation with $5{,}000$ tuples makes exactly those $5{,}000$ atomic facts true.
3. **Knowledge-base reasoning:** two true premises $Parent(A,B)$ and $Parent(A,B)\to Ancestor(A,B)$ force the conclusion in every model.
4. **Graph triangle:** $6$ nodes give $6^3=216$ ordered triples to check naively.
5. **Heap predicate:** $20$ allocated addresses give $20$ possible objects for $Alloc(x)$.
6. **ML constraint slice:** $300$ examples require $300$ score checks for $\forall x\,Score(x)\le0.9$.

### `math-16-07` — Natural deduction · explain-only

**Connections (§1).**
> This lesson moves from truth in models to proof on the page. Earlier lessons showed how formulas are evaluated; natural deduction shows how conclusions are derived by justified steps. The rules are designed to resemble ordinary mathematical reasoning while remaining formal enough to check. This makes the lesson a bridge to proof assistants, type systems, and soundness.

**Motivation & Intuition (§2).**
> Natural deduction treats proof as a sequence of small justified moves. Each line is either an assumption or follows from earlier lines by an introduction or elimination rule. The proof is not only the final conclusion; it is the checked path that shows why the conclusion follows.
>
> Temporary assumptions are especially important. To prove an implication, one may assume the antecedent, derive the consequent, and then discharge the assumption. This captures the familiar pattern of proving “if $A$, then $B$” while keeping track of which assumptions are still active.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — the lesson introduces a proof system; include the proof of $(P\land Q)\to P$ as a worked proof object rather than a derived formula.

**Symbols.** $\vdash$ derivable; assumption active line available in a subproof; discharge closes a temporary assumption; $\land$-elimination extracts one conjunct; modus ponens uses $A$ and $A\to B$ to infer $B$.

**Assumptions.** Each proof line must be a premise, a temporary assumption, or justified by a rule; discharged assumptions are no longer available outside their subproof; rule names matter because they make the derivation checkable.

**Real-World Applications (§5).**
1. **Proof assistant:** a $40$-line proof is accepted only if all $40$ justifications type-check.
2. **Program verification:** $P$ and $P\to Q$ give $Q$ in one modus ponens step.
3. **Type checking:** values of types $A$ and $B$ construct one pair of type $A\land B$.
4. **Security policy:** $Admin(u)$ and $Admin(u)\to CanDeploy(u)$ derive $CanDeploy(u)$.
5. **Proof writing:** proving $3$ implications starts and discharges $3$ assumptions.
6. **Automated proving:** $12$ intermediate formulas require $12$ rule or premise justifications.

### `math-16-08` — Soundness and completeness · AUTHOR derivation

**Connections (§1).**
> This lesson connects the proof rules from natural deduction with the semantic truth relation from formal semantics. Proof and truth are different kinds of objects: one is syntactic and checkable line by line, while the other ranges over models. Soundness and completeness explain when those two notions line up. They are foundational for theorem provers, proof assistants, and logic-based verification.

**Motivation & Intuition (§2).**
> Soundness and completeness connect proofs with truth. Soundness says derivations do not prove semantic falsehoods: if something can be proved from premises, then it is true in every model of those premises. This is the safety guarantee for a proof system.
>
> Completeness points in the other direction. It says that, for first-order logic, every semantic consequence has a formal proof in a complete proof system. The theorem is deep, but the practical message is clear: proofs are not merely a subset of reasoning chosen for convenience; for first-order validity, the proof system can in principle reach every semantic consequence.

**Definition & Assumptions (§3).**

**Derive (complete).** Prove the soundness of modus ponens and state the completeness direction clearly.
1. Assume $\Gamma\vdash A$ and $\Gamma\vdash A\to B$ — these are syntactic derivations from the premises.
2. By soundness of already-derived lines, every model of $\Gamma$ satisfies $A$ — derivable $A$ is semantically forced.
3. The same models satisfy $A\to B$ — the implication is also semantically forced.
4. In any such model, $A$ is true and $A\to B$ is true — combine the two semantic facts.
5. A true implication with true antecedent has true consequent — this is the truth table for $\to$.
6. Therefore every model of $\Gamma$ satisfies $B$, so $\Gamma\models B$ — modus ponens preserves truth.
7. Soundness of a full proof system follows by checking every inference rule this way — each rule must preserve truth.
8. Completeness is the converse statement for first-order logic: if $\Gamma\models\varphi$, then $\Gamma\vdash\varphi$ in a complete proof system — state it as a theorem, not a short proof.

**Symbols.** $\Gamma$ set of premises; $\vdash$ provability; $\models$ semantic consequence; sound means $\vdash$ implies $\models$; complete means $\models$ implies $\vdash$ for the logic.

**Assumptions.** The soundness argument assumes the inference rules before the current step preserve truth; completeness is stated for first-order logic and a proof system strong enough for that logic; semantic consequence ranges over all models of the premises.

**Real-World Applications (§5).**
1. **Theorem prover:** $12$ inference rules require $12$ soundness checks.
2. **SAT solver:** $20$ variables give $2^{20}=1{,}048{,}576$ brute-force assignments.
3. **Type soundness:** $1{,}000$ well-typed expressions are promised not to violate the type model at runtime.
4. **Counterexample trace:** a length-$7$ trace gives $7$ concrete states.
5. **Foundation theorem:** $30$ axioms may semantically entail a formula, and completeness promises a finite proof using finitely many.
6. **ML constraints:** $10$ Boolean constraints over $8$ flags have $2^8=256$ assignments for complete finite search.

### `math-16-09` — Naive set theory · explain-only

**Connections (§1).**
> This lesson begins the set-theory half of the section. The earlier logic lessons supplied a language for statements and proofs; set theory supplies a language for collections. Sets appear whenever we talk about datasets, feature subsets, graph neighborhoods, domains, and spaces of possibilities. The vocabulary here supports later lessons on ZFC, relations, cardinality, and infinite sets.

**Motivation & Intuition (§2).**
> Naive set theory gives the working vocabulary of membership, subset, union, intersection, difference, and power set. A set is treated as a collection of distinct elements, and the basic operations describe how collections overlap or combine. This language is useful because many mathematical and data objects are collections.
>
> The word naive signals that the vocabulary is introduced in its everyday working form before adding axiomatic guardrails. Most finite set computations are safe and intuitive. The important warning is that unrestricted comprehension, the idea that every property determines a set, leads to paradoxes and must later be replaced by controlled set-building principles.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — this lesson is foundational vocabulary; include finite computations and the warning that unrestricted comprehension causes paradoxes.

**Symbols.** $x\in A$ membership; $A\subseteq B$ subset; $A\cup B$ union; $A\cap B$ intersection; $A\setminus B$ difference; $\mathcal P(A)$ power set.

**Assumptions.** Sets ignore repeated listings and order; subset means every element of the first set is in the second; power sets contain subsets as elements; unrestricted set formation is not allowed in axiomatic set theory.

**Real-World Applications (§5).**
1. **Dataset splits:** train $8{,}000$, validation $1{,}000$, and intersection $0$ means no leakage.
2. **Feature subset:** choosing $12$ of $50$ features means $|S|=12$ and $S\subseteq F$.
3. **Search merge:** $40+30-10=60$ documents in a union with overlap $10$.
4. **Common neighbors:** $\{1,2,5\}\cap\{2,3,5\}=\{2,5\}$, count $2$.
5. **Access control:** $\{read,write\}\subseteq\{read,write,admin\}$ is true.
6. **Power-set search:** $20$ candidate features give $2^{20}=1{,}048{,}576$ subsets.

### `math-16-10` — The ZFC axioms · explain-only

**Connections (§1).**
> This lesson follows naive set vocabulary by explaining why formal guardrails are needed. Everyday set operations are powerful, but unrestricted set-building produces contradictions. ZFC keeps the useful constructions while stating exactly which set-building moves are allowed. It provides the background foundation for later work with products, powersets, cardinality, ordinals, and choice.

**Motivation & Intuition (§2).**
> ZFC gives set theory guardrails. It keeps the everyday constructions mathematicians need while blocking unrestricted set-building that leads to paradoxes. Instead of allowing any property to form a set from nothing, axioms such as Separation carve subsets out of sets that already exist.
>
> The axioms are not proved inside the lesson because they are starting rules for the theory. Their role is to make ordinary constructions precise: Extensionality says sets with the same elements are the same set, Power Set forms all subsets, Replacement maps sets through definable functions, Infinity supplies an infinite set, Foundation controls membership chains, and Choice handles selections from collections of nonempty sets.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — ZFC is an axiom system, not a theorem to prove inside the lesson; explain Extensionality, Separation, Replacement, Power Set, Infinity, Foundation, and Choice through concrete finite examples.

**Symbols.** $\in$ membership; Extensionality says same elements imply same set; Separation carves subsets from an existing set; Replacement maps a set through a definable function; ZFC means Zermelo-Fraenkel set theory with Choice.

**Assumptions.** ZFC is treated as a formal axiom system; its axioms license constructions rather than follow from earlier finite set computations; finite examples illustrate the axioms but do not replace the axioms themselves.

**Real-World Applications (§5).**
1. **Natural numbers:** $2=\{0,1\}$ has exactly $2$ elements in the standard set construction.
2. **Power set:** $12$ candidate features give $2^{12}=4{,}096$ subsets.
3. **Products:** $|A|=3,|B|=5$ gives $|A\times B|=15$.
4. **Finite choice:** set sizes $2,3,5,7$ give $210$ explicit choice functions.
5. **Data filtering:** $230$ rows with loss $>1.5$ are a subset of $10{,}000$ source rows.
6. **Function graph:** a function $f:A\to B$ can be represented as a set of ordered pairs with one pair for each element of $A$.

### `math-16-11` — Relations and orderings · deepen derivation

**Connections (§1).**
> This lesson uses sets and products to describe structured connections. Once $A\times B$ is available, a relation can be viewed as a selected subset of ordered pairs. Some relations behave like comparisons, and those become orderings. This prepares for dependency graphs, subset lattices, database relations, and the product-counting ideas used in cardinality.

**Motivation & Intuition (§2).**
> A relation selects ordered pairs. Saying $aRb$ means that the pair $(a,b)$ belongs to the relation $R$. The relation may represent equality, divisibility, dependency, graph adjacency, database membership, or many other structured facts.
>
> A partial order is a relation that behaves like a comparison while allowing some pairs to remain incomparable. Reflexivity says every element compares with itself, antisymmetry prevents two different elements from being mutually below each other, and transitivity lets comparisons chain. Divisibility is a good example because $2$ and $3$ are both below $6$, but neither divides the other.

**Definition & Assumptions (§3).** Display the relation viewpoint:

$$
R\subseteq A\times B, \qquad aRb \text{ means } (a,b)\in R.
$$

**Derive (complete).** Check divisibility on $A=\{1,2,3,6\}$ as a partial order.
1. Define $a\preceq b$ to mean $a$ divides $b$ — this fixes the relation.
2. Reflexive: each $a$ divides itself because $a=1\cdot a$ — every element relates to itself.
3. Antisymmetric: if $a$ divides $b$ and $b$ divides $a$, then $b=ka$ and $a=\ell b$ for positive integers $k,\ell$ — both numbers are positive in this set.
4. Substitute to get $a=\ell k a$ — divide by $a>0$ to get $1=\ell k$.
5. Since $\ell,k$ are positive integers, $\ell=k=1$ — so $a=b$.
6. Transitive: if $a$ divides $b$ and $b$ divides $c$, then $b=ka$ and $c=\ell b$ — write both divisibility facts.
7. Substitute $b=ka$ into $c=\ell b$ to get $c=\ell k a$ — so $a$ divides $c$.
8. Therefore divisibility on $A$ is a partial order.
9. Unequal comparable pairs are $(1,2),(1,3),(1,6),(2,6),(3,6)$ — these are the divisibility pairs with different entries.

**Symbols.** $R\subseteq A\times B$ relation; $(a,b)$ ordered pair; $aRb$ shorthand for membership in $R$; $\preceq$ partial order; reflexive, antisymmetric, transitive, total order.

**Assumptions.** Ordered pairs remember coordinate order; a partial order must satisfy reflexivity, antisymmetry, and transitivity on the stated set; incomparability is allowed in a partial order but not in a total order.

**Real-World Applications (§5).**
1. **Dependency graph:** $A\preceq C$ and $C\preceq D$ force $A\preceq D$.
2. **Feature subsets:** $\{age\}\subseteq\{age,clicks\}$ but $\{age\}$ and $\{clicks\}$ are incomparable.
3. **Database relation:** two rows make a relation of size $2$.
4. **Ranking with ties:** A and B both at $0.91$ outrank C at $0.85$, giving $2$ strict comparisons against C.
5. **Static analysis facts:** $\{x>0,y=2\}$ carries one more fact than $\{x>0\}$.
6. **Lattice operations:** for $A=\{1,2\}$ and $B=\{2,3\}$, meet is $\{2\}$ and join is $\{1,2,3\}$.

### `math-16-12` — Cardinality — **full-depth model entry (this is the bar)**

**Connections (§1).** *(Plain textbook voice: what the reader already knows, and where this fits. Prose, not a bullet list.)*
> This lesson builds on the set vocabulary from the previous lessons: elements, subsets, unions, products, and
> functions. A finite set can be counted by listing its elements, but the deeper idea is that counting is a kind
> of matching. When a set has three elements, it can be matched perfectly with the counting set
> $\{1,2,3\}$.
>
> That matching idea is the reason cardinality works for both finite and infinite sets. It will let us count
> product spaces such as labels crossed with devices, compare different data domains, and prepare for the next
> lesson's surprise that the natural numbers and even numbers have the same size while the real numbers are
> larger than any list.

**Motivation & Intuition (§2).** *(Plain, clear explanation of the concept itself.)*
> Cardinality is the mathematical word for size, but it is not only a way to attach a number to a small set. The
> important move is pairing. Two sets have the same size when every element of the first set can be paired with
> exactly one element of the second, with nothing left over on either side.
>
> For finite sets, this agrees with ordinary counting. If $A=\{red,blue,green\}$ and
> $B=\{10,20,30\}$, the function $red\mapsto10$, $blue\mapsto20$, $green\mapsto30$ is a bijection, so the two
> sets have the same cardinality. The elements have different meanings, but cardinality ignores the meanings and
> counts the perfect pairing.
>
> Products are the first place this becomes especially useful. If $A$ has $m$ choices and $B$ has $n$ choices,
> then an element of $A\times B$ is made by choosing one item from $A$ and one item from $B$. For every first
> choice there are $n$ second choices, and there are $m$ first choices. That is why the product has $mn$ ordered
> pairs.

**Definition & Assumptions (§3).** Display the core definitions and product rule:

$$
|A|=|B| \quad\text{means there is a bijection } f:A\to B.
$$

$$
|A\times B|=|A|\,|B|=mn \quad\text{when } |A|=m \text{ and } |B|=n.
$$

**Derive (complete).** Prove the finite product rule and include a countability example.
1. Let $A=\{a_1,\ldots,a_m\}$ — this lists each element of the finite set $A$ exactly once.
2. Let $B=\{b_1,\ldots,b_n\}$ — this lists each element of the finite set $B$ exactly once.
3. For the fixed first element $a_i$, the possible pairs are $(a_i,b_1),\ldots,(a_i,b_n)$ — the second coordinate can be any of the $n$ elements of $B$.
4. Thus each fixed $a_i$ contributes $n$ ordered pairs — the first coordinate is held constant while the second coordinate varies.
5. There are $m$ possible first coordinates $a_i$ — the list for $A$ has $m$ entries.
6. The $m$ groups do not overlap — a pair with first coordinate $a_i$ cannot also have first coordinate $a_j$ when $i\ne j$.
7. Add the disjoint group sizes: $n+n+\cdots+n$ with $m$ copies equals $mn$ — this counts every ordered pair once.
8. Therefore $|A\times B|=mn$ — the product rule follows from listing first choices and second choices.
9. For countability, define $f:\mathbb N\to E$ by $f(k)=2k$, where $E=\{2,4,6,\ldots\}$ — every natural number is paired with one even number.
10. The function is one-to-one because $2k=2\ell$ implies $k=\ell$ — no two natural numbers land on the same even number.
11. The function is onto because every positive even number has the form $2k$ for some $k\in\mathbb N$ — no even number is missed.
12. Hence $|\mathbb N|=|E|$ — an infinite proper subset can have the same cardinality as the whole set.

**Symbols.** $|A|$ is the cardinality, or size, of set $A$; $f:A\to B$ is a function from elements of $A$ to
 elements of $B$; a **bijection** is one-to-one and onto; $A\times B$ is the set of ordered pairs $(a,b)$ with
 $a\in A$ and $b\in B$; $m,n$ are finite cardinalities; $\mathbb N$ is the positive counting numbers in this
 lesson; $E$ is the set of positive even integers.

**Assumptions.** Sets ignore order and duplicate listing; a bijection must cover every target exactly once; the
formula $|A\cup B|=|A|+|B|$ only holds for disjoint sets; and cardinality compares size, not the meaning or value
of the elements.

**Real-World Applications (§5).**
1. **Dataset union.** If training has $12{,}000$ rows and validation has $3{,}000$ disjoint rows, the union has $15{,}000$ rows because disjoint cardinalities add.
2. **Embedding table size.** A tokenizer with ids $0$ through $49{,}999$ has $50{,}000$ tokens; with dimension $768$, the embedding table has $50{,}000\cdot768=38{,}400{,}000$ weights.
3. **One-hot labels.** With $7$ classes, there are $7$ valid one-hot target vectors of length $7$, not $2^7$, because the valid set requires exactly one coordinate to be $1$.
4. **Feature crosses.** Crossing $100$ countries with $20$ device types gives $100\cdot20=2{,}000$ possible categorical pairs by the product rule.
5. **Hash buckets.** Mapping $10{,}000$ keys into $1{,}000$ buckets gives average load $10{,}000/1{,}000=10$ keys per bucket.
6. **Leakage audit.** If train has $8{,}000$ users, test has $2{,}500$, and overlap is $300$, then the distinct users across both are $8{,}000+2{,}500-300=10{,}200$.

### `math-16-13` — Infinite sets · deepen derivation

**Connections (§1).**
> This lesson continues the cardinality idea from finite sets into the infinite case. The previous lesson showed that size can be compared by bijection, not only by ordinary counting. Infinite sets make that matching idea essential. The lesson also prepares for computability, where programs are listable but many mathematical objects are not.

**Motivation & Intuition (§2).**
> Infinite sets are compared by listings and bijections, not by visual sparseness. The positive even numbers look like only part of the natural numbers, but the function $n\mapsto2n$ pairs every natural number with exactly one even number. That is why the evens are countably infinite.
>
> Some infinite sets can be listed, while the real numbers in an interval cannot. Cantor's diagonal argument shows that any proposed list of real numbers in $(0,1)$ misses a number built to differ from the first row in the first digit, the second row in the second digit, and so on. The construction turns “not on this list” into a precise contradiction.

**Definition & Assumptions (§3).**

**Derive (complete).** Prove evens are countable and sketch Cantor diagonalization for $(0,1)$.
1. Define $f:\mathbb N\to E$ by $f(n)=2n$ — every natural number names one positive even number.
2. If $f(n)=f(m)$, then $2n=2m$, so $n=m$ — the function is one-to-one.
3. If $e\in E$, then $e=2n$ for some $n\in\mathbb N$ — the function is onto.
4. Therefore $E$ is countably infinite — it has a bijection with $\mathbb N$.
5. For reals, suppose for contradiction that $(0,1)$ has a complete list $r_1,r_2,r_3,\ldots$ — assume countability.
6. Write each $r_i$ in decimal form, choosing expansions that do not end in repeating $9$s — this avoids duplicate decimal names.
7. Build a new decimal $d=0.d_1d_2d_3\ldots$ where $d_i$ differs from the $i$th digit of $r_i$ and is never $9$ — this makes $d$ a valid number in $(0,1)$.
8. The number $d$ differs from $r_i$ in digit $i$ for every $i$ — so $d$ is not equal to any row in the list.
9. This contradicts the list being complete — therefore $(0,1)$ is uncountable.

**Symbols.** Countably infinite means listable as $a_1,a_2,\ldots$; $\aleph_0=|\mathbb N|$; uncountable means no such list exists; $2^{\aleph_0}$ is the cardinality of infinite binary sequences/reals.

**Assumptions.** A listing must include every element exactly somewhere in the sequence; decimal representations are chosen without trailing repeating $9$s to avoid duplicate names; diagonalization proves uncountability by contradiction.

**Real-World Applications (§5).**
1. **Program strings:** $80^5=3{,}276{,}800{,}000$ strings of length $5$, and listing by length makes all finite programs countable.
2. **Uncomputable functions:** programs have size $\aleph_0$, while binary functions on $\mathbb N$ have size $2^{\aleph_0}$.
3. **Rational grid:** with $|p|,|q|\le10$ and $q\ne0$, there are $21\cdot20=420$ signed pairs before reduction.
4. **Dense rationals:** $315/1000=0.315$ lies between $0.31$ and $0.32$.
5. **Float approximation:** 32-bit floats have at most $2^{32}=4{,}294{,}967{,}296$ patterns, unlike uncountably many reals in $[0,1]$.
6. **Search spaces:** finite binary strings are countable, but infinite binary sequences have size $2^{\aleph_0}$.

### `math-16-14` — Ordinals · explain-only

**Connections (§1).**
> This lesson follows cardinality by separating size from position. Cardinality asks how many elements a set has, while ordinal thinking asks how elements are arranged in a well-ordered process. That distinction matters for recursion, induction, staged constructions, and termination arguments. The finite examples are familiar, and the first infinite ordinal shows why order type contains more information than size alone.

**Motivation & Intuition (§2).**
> Ordinals describe positions in well-ordered processes. They record order type, including successor stages and limit stages, rather than only size. A successor stage comes immediately after a previous stage, while a limit stage gathers everything before it without having a single immediate predecessor.
>
> In finite settings, ordinals behave like ordinary counting positions. In infinite settings, order sensitivity becomes visible: adding one item before a countable sequence is not the same as adding one item after it. This is why ordinal language is useful for transfinite induction and for describing processes that unfold by stages.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — ordinals are foundation vocabulary; author finite and first-infinite examples that show order sensitivity without pretending to prove ordinal theory.

**Symbols.** Well-order means every nonempty subset has a least element; $\omega$ first infinite ordinal; $\alpha+1$ successor; limit ordinal has no immediate predecessor; transfinite induction proves by ruling out least counterexamples.

**Assumptions.** Ordinals describe well-ordered order types; finite examples illustrate the ideas but do not prove the general theory; ordinal addition is order-sensitive.

**Real-World Applications (§5).**
1. **Termination measure:** starting at $5$ and decreasing by at least $1$ gives at most $5$ loop iterations.
2. **Tree recursion:** height $3$ tree evaluates leaves at stage $0$ through root at stage $3$.
3. **Priority construction:** three requirements have type $3$; countably many have type $\omega$.
4. **Training schedule shape:** $10$ epochs plus averaging pass has finite order type $11$.
5. **Search-tree recursion:** height $4$ recursive calls move to heights at most $3,2,1,0$.
6. **Order sensitivity:** $1+\omega=\omega$ but $\omega+1$ has a last element.

### `math-16-15` — The axiom of choice · explain-only

**Connections (§1).**
> This lesson continues the ZFC story by focusing on the axiom named in ZFC's final letter. Earlier set operations built new sets directly; choice concerns selecting representatives from many nonempty sets. Finite selection is usually straightforward, but infinite selection can require an axiom rather than an explicit rule. The idea connects to products, bases, well-orderings, and Zorn's lemma.

**Motivation & Intuition (§2).**
> Choice says that one element can be selected from each nonempty set in a collection, even when the collection is infinite and no explicit selection rule is given. A choice function takes a set $S$ from the collection and returns one element $c(S)\in S$. For a finite collection, the choices can be made one by one.
>
> The separate axiom matters when the collection is infinite and no uniform rule is available. Many ordinary finite examples look harmless, but the general principle has powerful consequences throughout mathematics. Equivalent forms such as Zorn's lemma and the well-ordering theorem are often used because they fit different proof situations.

**Definition & Assumptions (§3).**

**Derive (complete).** explain-only — this is an axiom and a family of equivalent principles; demonstrate finite choice functions and explain why infinite choice is a separate principle.

**Symbols.** $\mathcal F$ collection of nonempty sets; $c$ choice function; $c(S)\in S$ selected representative; Zorn's lemma and well-ordering theorem equivalent forms.

**Assumptions.** Every set in the collection is nonempty; finite choice can be demonstrated by explicit selections; the full axiom of choice concerns arbitrary collections and is accepted as an axiom rather than derived here.

**Real-World Applications (§5).**
1. **Finite product:** $A=\{1,2\}$ and $B=\{x,y,z\}$ give $2\cdot3=6$ pairs.
2. **Representatives:** classes of sizes $2,1,3$ produce $3$ chosen representatives.
3. **Vector-space basis:** $\mathbb R^3$ has an explicit basis of $3$ vectors.
4. **Hyperparameter grid:** $3$ learning rates, $4$ depths, and $2$ batch sizes give $24$ configurations.
5. **Infinite representatives:** choosing from $\aleph_0$ nonempty sets yields $\aleph_0$ selected elements, not necessarily an algorithm.
6. **Finite well-ordering:** $5$ distinct records can be totally ordered in $5!=120$ ways.

### `math-16-16` — Turing machines and computability · AUTHOR derivation

**Connections (§1).**
> This lesson moves from logic and set foundations to formal computation. Earlier lessons made statements, proofs, and infinite sizes precise; Turing machines make algorithms precise. The model is deliberately simple, so that questions about what can be computed do not depend on a particular programming language. It leads directly into decidability and the limits of algorithmic verification.

**Motivation & Intuition (§2).**
> A Turing machine is a minimal model of algorithmic work: finite control reads one symbol, writes one symbol, moves one cell, and repeats. The tape supplies memory, the state records the machine's current situation, and the transition rule determines the next step. Its simplicity makes computability precise.
>
> The point is not that real computers look like this in detail. The point is that finite programs can be encoded as strings, and Turing machines capture the step-by-step behavior of algorithms. A simple unary scan already shows the pattern: one symbol is processed per move until the machine reaches the blank cell and halts.

**Definition & Assumptions (§3).**

**Derive (complete).** Work the unary scan and connect to finite encodings.
1. The input is $111$ followed by blanks — there are three nonblank unary symbols.
2. Start with the head on the first $1$ — this is the first cell to scan.
3. On the first $1$, the machine moves right once — one input symbol has been consumed.
4. On the second $1$, it moves right again — two input symbols have been consumed.
5. On the third $1$, it moves right a third time — all three input symbols have been consumed.
6. The head now reads the first blank cell — this is the first place with no input symbol.
7. The halt rule applies on blank — the machine halts after $3$ right moves.
8. More generally, scanning unary input $1^n$ to the first blank takes $n$ right moves — one move per symbol.

**Symbols.** $q$ state; $s,t$ tape symbols; transition rule $(q,s)\mapsto(q',t,R/L)$; halt state; computable function; finite string encoding.

**Assumptions.** The input is finite and followed by blanks; each transition reads the current symbol and performs one write/move/update action; halting occurs only when a halt rule or halt state is reached.

**Real-World Applications (§5).**
1. **Universal simulation:** $5$ simulated steps at $20$ internal steps each gives about $100$ steps.
2. **Program encoding:** a $1{,}200$-character file over $128$ characters is one of at most $128^{1200}$ strings.
3. **Classifier as recognizer:** $230$ positives among $1{,}000$ halted outputs gives rate $0.23$.
4. **Image input:** a $28\times28$ one-byte grayscale image has $784$ bytes or $6{,}272$ bits.
5. **Most functions uncomputable:** countably many programs cannot cover $2^{\aleph_0}$ binary functions on $\mathbb N$.
6. **Timeout budget:** $60$ seconds at $0.002$ seconds per step allows $30{,}000$ steps.

### `math-16-17` — Decidability · AUTHOR derivation

**Connections (§1).**
> This lesson builds on Turing machines by asking which yes-or-no problems algorithms can always settle. A machine model gives precise meaning to halting, accepting, rejecting, and running forever. Decidability is the strongest form of algorithmic solvability for such problems. The halting problem then shows that some natural questions about programs cannot have perfect always-halting solvers.

**Motivation & Intuition (§2).**
> A decidable problem has an algorithm that always halts with a correct yes or no. Recognizable problems may halt on yes instances and run forever on no instances. The difference matters because a timeout or nontermination is not the same thing as a mathematical no.
>
> Simple languages can be decidable for straightforward reasons. Even-length binary strings only require tracking parity as the input is scanned. The halting problem is different because it asks for a universal predictor of program behavior, and the diagonal argument constructs a program that contradicts any proposed perfect predictor.

**Definition & Assumptions (§3).**

**Derive (complete).** Prove even-length binary strings are decidable, then sketch halting-problem undecidability.
1. For even length, scan the input once while toggling a parity bit — the bit records whether the number of symbols seen is even or odd.
2. Start in the even state — length $0$ is even.
3. Each read symbol switches even to odd or odd to even — adding one symbol flips parity.
4. When the end of input is reached, halt and accept exactly in the even state — the machine always stops after reading the finite input.
5. Therefore even-length binary strings form a decidable language.
6. For the halting problem, assume a decider $H(M,x)$ exists — it always halts and correctly reports whether $M$ halts on $x$.
7. Build a machine $D(M)$ that runs $H(M,M)$ — it asks whether $M$ halts on its own code.
8. If $H(M,M)$ says halts, make $D(M)$ loop forever; if it says does not halt, make $D(M)$ halt — $D$ does the opposite.
9. Run $D$ on its own code $D$ — this asks whether $D(D)$ halts.
10. If $H(D,D)$ says halts, then $D(D)$ loops; if it says does not halt, then $D(D)$ halts — both contradict correctness.
11. Therefore no always-halting decider for the halting problem exists.

**Symbols.** Decision problem/language $L$; decider halts on all inputs; recognizer may loop on no instances; $H(M,x)$ hypothetical halting decider; reduction transfers undecidability.

**Assumptions.** Inputs are finite strings; a decider must halt on every input; the halting-problem proof is by contradiction using a machine applied to its own code.

**Real-World Applications (§5).**
1. **Static analysis:** $120$ flags among $10{,}000$ functions is $1.2\%$ for human review, but not perfect decidability.
2. **Type checking:** $500$ files at $0.04$ seconds each take about $20$ seconds if the checker always halts.
3. **Linear verification:** $f(x)=2x-1$ on $[1,3]$ has minimum $f(1)=1>0$.
4. **DFA membership:** a $4$-state DFA reads length $100$ using exactly $100$ transitions.
5. **Timeout:** a $30$-second timeout may return unknown, not a mathematical no.
6. **Security reduction:** one special reachability line could encode halting, so arbitrary exploit reachability cannot have a perfect decider.

### `math-16-18` — Gödel's incompleteness theorems · AUTHOR derivation

**Connections (§1).**
> This lesson continues the theme of formal limits, now for proof systems rather than algorithms alone. Soundness and completeness showed a strong match between first-order proof and semantic consequence, while computability showed limits on decision procedures. Gödel's theorem explains a different boundary: sufficiently strong arithmetic theories cannot prove every arithmetic truth about themselves. The lesson connects syntax, coding, proof checking, and self-reference.

**Motivation & Intuition (§2).**
> Gödel's theorem shows a limit of formal systems strong enough for arithmetic. If the system is consistent and effectively axiomatized, some arithmetic truth is not provable inside it. The key move is to encode syntax as numbers so that arithmetic can talk about formulas and proofs.
>
> Once proofs have numerical codes, a carefully constructed sentence can refer to its own provability. The resulting sentence $G$ says, in effect, that $G$ is not provable in the system. If the system proves it, consistency is threatened; if the system proves its negation under the usual strengthened hypotheses, another contradiction appears. The conclusion is incompleteness, not unreliability of all mathematics.

**Definition & Assumptions (§3).**

**Derive (complete).** Give the proof skeleton and the toy coding exercise.
1. Encode symbols, formulas, and proofs as natural numbers — this is Gödel numbering.
2. Because proofs are finite strings, the relation “number $p$ codes a proof of formula $g$” can be represented arithmetically in strong enough systems — arithmetic can talk about proof codes.
3. Use self-reference to construct a sentence $G$ that says “$G$ is not provable in this system” — the sentence refers to its own Gödel number.
4. If the system proves $G$, then it proves a sentence asserting its own unprovability — under consistency/soundness this cannot happen.
5. If the system proves $\neg G$, then it proves that $G$ is provable, while no actual proof of $G$ exists in the consistent case — this creates the other failure under the usual strengthened hypotheses.
6. Therefore a consistent, effectively axiomatized system strong enough for arithmetic is incomplete — it cannot prove every arithmetic truth.
7. For the toy code, assign $A=2$, $\to=5$, $B=3$ — these are the symbol codes.
8. Encode $A\to B$ as $2\cdot10^2+5\cdot10+3=253$ — each digit position stores one symbol code.
9. Decode $253$ by reading digits $2,5,3$ — recover $A\to B$.

**Symbols.** Consistent means no statement and its negation are both provable; effectively axiomatized means proofs can be mechanically checked; Gödel number encodes syntax as arithmetic; $G$ is the self-referential sentence.

**Assumptions.** The system is consistent, effectively axiomatized, and strong enough to represent enough arithmetic about proof codes; the proof here is a skeleton, not the full technical construction of arithmetized syntax.

**Real-World Applications (§5).**
1. **Proof assistant:** $200$ lines at $0.003$ seconds per kernel check take about $0.6$ seconds.
2. **Proof search:** $10^6$ nodes per second for $30$ seconds checks $3\cdot10^7$ nodes.
3. **Stronger theory:** adding one axiom to $S_1$ gives $S_2$, where every $S_1$ proof still works.
4. **Linear arithmetic:** $2x+3\le7$ gives $x\le2$ directly, unlike arbitrary program behavior.
5. **Toy encoding:** $253$ represents a three-symbol formula under the toy scheme.
6. **AI benchmark:** if a prover solves $470$ of $500$ claims, the remaining $30$ are unresolved by that run, not automatically false.

### `math-16-19` — Neuro-symbolic AI · AUTHOR derivation · ML/CS capstone

**Connections (§1).**
> This capstone lesson brings the section's themes back to machine learning and AI systems. Logic supplies rules and constraints, set theory supplies structured spaces of possible outputs, and computability reminds us that reasoning procedures have limits. Neural models supply learned scores, while symbolic components can impose validity or add structured penalties. The lesson shows how these pieces can work together in a small, checkable calculation.

**Motivation & Intuition (§2).**
> Neuro-symbolic AI combines learned numerical scores with explicit symbolic structure: rules, graphs, programs, constraints, and proofs. The useful pattern is division of labor, where a neural model proposes and symbolic reasoning filters, verifies, or regularizes. Scores express preference, while constraints express what is allowed.
>
> Hard constraints and soft rule losses play different roles. A hard constraint removes invalid outputs before selection, so a high-scoring invalid pair cannot be chosen. A soft rule penalty changes the training objective by adding a weighted cost for violations, which encourages but does not guarantee valid behavior.

**Definition & Assumptions (§3).**

**Derive (complete).** Work the constrained label choice and the soft-rule loss.
1. Labels have probabilities $P(A)=0.50$, $P(B)=0.30$, and $P(C)=0.20$ — these are the neural scores.
2. The system must choose two labels — the candidate pairs are $\{A,B\}$, $\{A,C\}$, and $\{B,C\}$.
3. The symbolic rule forbids choosing $A$ and $B$ together — remove pair $\{A,B\}$ even though its score is $0.80$.
4. Score the remaining valid pairs by adding probabilities: $\{A,C\}$ has $0.50+0.20=0.70$ and $\{B,C\}$ has $0.30+0.20=0.50$.
5. Choose $\{A,C\}$ — it is the highest-scoring valid pair.
6. For soft rules, define total loss $L(\theta)=L_{data}(\theta)+\lambda L_{rule}(\theta)$ — the rule violation is weighted before being added.
7. With $L_{data}=1.2$, $L_{rule}=0.3$, and $\lambda=0.5$, compute $1.2+0.5\cdot0.3=1.35$ — the rule penalty raises the loss by $0.15$.
8. Hard constraints guarantee validity only if the solver finds a valid output; soft penalties encourage validity but do not guarantee it — state this distinction explicitly.

**Symbols.** $s_i$ or $P(i)$ neural score for candidate $i$; $C$ constraint set; $L_{data}$ prediction loss; $L_{rule}$ rule-violation loss; $\lambda\ge0$ rule weight; feasible output satisfies all hard symbolic constraints.

**Assumptions.** Neural scores are treated as fixed for the constrained-choice example; hard constraints remove infeasible candidates before selection; the soft-rule loss is added with nonnegative weight $\lambda$.

**Real-World Applications (§5).**
1. **Constrained classification:** scores $0.7,0.6,0.2$ with top-two conflict select $0.7+0.2=0.9$ instead of invalid $1.3$.
2. **Knowledge-graph retrieval:** if scores $0.91,0.88,0.80$ and a graph filter removes the first, selected top score becomes $0.88$.
3. **Rule-regularized training:** $L_{data}=1.2$, $L_{rule}=0.3$, $\lambda=0.5$ gives total $1.35$.
4. **Program synthesis:** $20$ candidates with $17$ rejected leaves $3/20=15\%$ for deeper checking.
5. **Formal verification around a model:** $f(x)=2x-1$ on $[0.8,1.0]$ has minimum $0.6$, so $f(x)>0$ holds.
6. **Planning with learned heuristic:** branching factor $5$ at depth $4$ gives $625$ paths; keeping $2$ actions per state gives $16$ paths.

---

## Build order

1. **Model first:** author `math-16-12` in full prose, including the bijection definition, $|A\times B|=mn$, and the countability example. This sets the section's voice and proof depth.
2. **Core logic proofs:** author `math-16-01` through `math-16-03`, then `math-16-05` and `math-16-08`, because these establish the truth-table, equivalence, CNF, quantifier, and proof/semantics habits used later.
3. **Set foundations:** author `math-16-09` through `math-16-15` case-by-case: explain-only for set vocabulary, ZFC, ordinals, and choice; complete proofs for relations, cardinality, and infinite sets.
4. **Computability limits:** author `math-16-16` and `math-16-17` together so Turing-machine mechanics lead directly into decidability and the halting-problem diagonal proof.
5. **Meta-limits and capstone:** author `math-16-18` and `math-16-19` last, connecting formal limits to proof search, verification, and neuro-symbolic AI.
6. **Final pass:** enforce exactly six applications per lesson, promote the six key statements to display math, verify all numeric claims again with `python3`, and rerun the odd-`$`/matrix-row LaTeX scan.
