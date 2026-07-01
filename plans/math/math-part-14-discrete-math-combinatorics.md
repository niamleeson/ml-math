# Math · Part 14 — Discrete math / combinatorics  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the shared
> exposition principles: warm voice, complete step-by-step derivations, case-by-case judgment, and named
> symbols. Numbers below were verified with `python3` using `math.comb`, `math.perm`, factorials, modular
> arithmetic, and direct recurrence/probability checks: 122 numeric checks passed.

**Section:** Discrete math / combinatorics · **Lessons:** 23 · **Breadcrumb:** `Mathematics · Discrete & Foundations` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared whole-section app block) | 0 / 23 |
| Templated / thin motivation | 0 / 23 |
| Key formula not in display form | 14 / 23 |
| Unclosed-`$` LaTeX bug | 0 / 23 |
| Derivations to author or deepen | 17 / 23 |
| Explain-only concept lessons | 6 / 23 |

**The core change:** keep the existing section's good application discipline, but deepen every lesson into an
implementation-ready plan. Counting lessons get complete derivations of their formulas. Conceptual lessons do
not receive artificial proofs; they get clearer explanatory prose, symbol glosses, and six concept-specific
applications with checked numbers. `math-14-14` stays the quality anchor and becomes the full-prose model entry.

---

## Priority & systemic issues

- **No whole-section §5 boilerplate.** The current lessons already use topic-specific applications; preserve that strength while sharpening each app so its number is re-derived from the lesson's own concept.
- **Formula display and derivation depth.** Promote the central formulas for logic equivalence, function counts, sum/product rules, permutations, combinations, binomial coefficients, inclusion-exclusion, pigeonhole, recurrences, generating functions, probability, modular arithmetic, Boolean algebra, and Big-O.
- **ML counting through-line.** Repeatedly connect the arithmetic to hypothesis-space sizes, combinatorial features, search grids, pairwise evaluation, collision/load guarantees, discrete probability, and complexity growth.
- **LaTeX bugs.** None found in the current `math-14` dump under the brief's rule: no unclosed `$`, and no broken matrix row separators.

---

## Model entry (full prose)

**`math-14-14` — Inclusion–exclusion  — full-depth model entry**

**Connections (§1).**
> This lesson builds on sets, unions, intersections, and the counting habit from the sum rule. The sum rule works when cases are disjoint. Inclusion–exclusion handles the next common situation: the cases overlap, so a plain sum counts some objects more than once.
>
> This idea shows up whenever data, events, labels, alerts, or retrieval results are merged. A user may be in two audiences, a row may fail two validation rules, and a document may come from two retrievers. Inclusion–exclusion gives the exact union count by adding the easy counts and then repairing the overlap.

**Motivation & Intuition (§2).**
> Suppose 55 users use mobile and 40 users use desktop. Adding gives 95 device-usages, not necessarily 95 users, because the users who use both devices appear in both counts. If 20 users use both, those 20 users were counted twice. Subtracting the overlap once leaves each user counted exactly once.
>
> The same repair pattern extends to three sets. First add the three single-set counts. Then subtract the pairwise overlaps, because each overlapping item has been counted too often. But an item in all three sets has then been added three times and subtracted three times, leaving zero copies. It must be added back once. Inclusion–exclusion is careful bookkeeping: every element in the union ends with coefficient 1.

**Definition & Assumptions (§3).** Display the two-set formula
$$
|A\cup B|=|A|+|B|-|A\cap B|.
$$
Then derive it completely:
1. Split the union into disjoint pieces: $A\setminus B$, $B\setminus A$, and $A\cap B$, because every element in $A\cup B$ belongs to exactly one of these three regions.
2. Count $A$ as $|A\setminus B|+|A\cap B|$, because $A$ consists of its outside-$B$ part plus the overlap.
3. Count $B$ as $|B\setminus A|+|A\cap B|$, because $B$ has the same kind of split.
4. Add the single-set counts: $|A|+|B|=|A\setminus B|+|B\setminus A|+2|A\cap B|$, because the overlap appears in both sets.
5. Subtract one overlap: $|A|+|B|-|A\cap B|=|A\setminus B|+|B\setminus A|+|A\cap B|$, so each region is counted once.
6. Recognize the right-hand side as $|A\cup B|$, because it is the disjoint-region count of the union.

Display the three-set formula
$$
|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|A\cap C|-|B\cap C|+|A\cap B\cap C|.
$$
Derive the triple-overlap correction:
1. Take an element that lies only in one set; it is added once, subtracted zero times, and added back zero times, so its final count is 1.
2. Take an element that lies in exactly two sets; it is added twice and subtracted once in its pairwise intersection, so its final count is 1.
3. Take an element that lies in all three sets; it is added three times and subtracted three times, once for each pair.
4. Add the triple intersection once; the all-three element now has count $3-3+1=1$.
5. Since every union element falls into exactly one of these cases, the formula counts every union element once.

**Worked count.** In 100 users, let $M$ be mobile users and $D$ be desktop users with $|M|=55$, $|D|=40$, and $|M\cap D|=20$.
1. Write the target $|M\cup D|$, because at least one device means union.
2. Substitute into the formula: $|M\cup D|=55+40-20$.
3. Add single counts: $55+40=95$.
4. Subtract the duplicate overlap: $95-20=75$.
5. Interpret: 75 users use at least one of mobile or desktop.

**Symbols.** $A,B,C$ are finite sets; $\cup$ means union, or membership in at least one set; $\cap$ means intersection, or membership in all named sets; $|A|$ means the number of elements in $A$; complements require a stated universe.

**Real-World Applications (§5).**
1. **Deduplicating alerts.** CPU alerts hit 40 hosts, memory alerts hit 30 hosts, and 12 hosts hit both; unique alerted hosts are $40+30-12=58$.
2. **Search result blending.** Retriever A returns 100 documents, B returns 80, and 25 overlap; the merged result set has $100+80-25=155$ unique documents.
3. **Data quality checks.** Rule counts are 300 and 220 with 75 rows failing both; rows failing at least one rule total $300+220-75=445$.
4. **Discrete probability.** If $P(A)=0.4$, $P(B)=0.3$, and $P(A\cap B)=0.1$, then $P(A\cup B)=0.4+0.3-0.1=0.6$.
5. **Cache coverage.** Cache 1 hits 700 requests, cache 2 hits 500, and both hit 250; at least one cache hits $700+500-250=950$ requests.
6. **Multi-label evaluation.** Label counts are 45, 35, and 20; pair overlaps are 10, 5, and 4; triple overlap is 2. The union is $45+35+20-(10+5+4)+2=83$ items.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for the lesson in render order. The labels are plan shorthand only. In the app, they become plain prose with display formulas, complete derivations where appropriate, every symbol glossed, and six applications whose numbers were verified.

### `math-14-01` — Propositional logic  · AUTHOR derivation

**Connections (§1).**
> This lesson begins with the smallest units of discrete reasoning: statements that have definite truth values. Students who have seen program conditions, filters, or simple algebraic claims already know the habit of deciding whether a condition holds. Propositional logic gives that habit precise symbols for not, and, or, if-then, and if-and-only-if. It prepares the reader for predicate logic, Boolean algebra, proof methods, database filters, and rule-based ML system checks.

**Motivation & Intuition (§2).**
> Propositional logic studies whole statements that are either true or false. Instead of looking inside a sentence, it treats a proposition such as “the score passes the threshold” as one unit and then studies how compound statements behave. This lets a reader reason exactly about combinations like “passes score and passes policy” or “not disabled and eligible.”
>
> The important point is that logical connectives have fixed meanings. Inclusive OR is true when either side is true, AND requires both sides, and a conditional fails only when a true assumption leads to a false conclusion. Truth tables make those meanings visible by checking every possible assignment, so two formulas are equivalent only when their columns match in every row.

**Definition & Assumptions (§3).** Prove $p\to q\equiv\neg p\lor q$ by truth table: 1. List four assignments $(T,T),(T,F),(F,T),(F,F)$ because two propositions give $2^2=4$ rows. 2. Evaluate $p\to q$ as $T,F,T,T$ because only true antecedent and false consequent breaks a conditional. 3. Evaluate $\neg p$ as $F,F,T,T$ because negation flips $p$. 4. Evaluate $\neg p\lor q$ as $T,F,T,T$ because OR is true when either side is true. 5. Compare columns row by row; they match, so the formulas are equivalent.

**Symbols.** $p,q$ propositions; $T,F$ truth values; $\neg$ not; $\land$ and; $\lor$ inclusive or; $\to$ conditional; $\equiv$ same truth value in every row.

**Real-World Applications (§5).**
1. **Program branches:** three Boolean flags give $2^3=8$ possible branch rows.
2. **Database filters:** 300 rows satisfy $p$, 200 satisfy $q$, 80 satisfy both, so inclusive OR returns $300+200-80=420$.
3. **Circuit gates:** inputs $(1,0)$ give AND output $0$ and OR output $1$.
4. **Rule alerts:** $T\land T\land\neg F=T$, so the alert fires.
5. **Feature flags:** 20 percent of 50,000 eligible users gives $0.20\cdot50000=10000$ users when the kill switch is false.
6. **ML release rule:** if 120 items pass score and 100 of those pass policy, an AND release rule selects 100 items.

### `math-14-02` — Predicate logic  · explain-only

**Connections (§1).**
> This lesson extends propositional logic by allowing statements to depend on objects. A proposition says that a whole sentence is true or false, while a predicate becomes true or false after an object from a domain is supplied. This is the language behind database checks, validation rules, graph properties, and mathematical claims about all examples or at least one example. It also prepares the reader for proof methods, relations, sets, and quantified ML guarantees.

**Motivation & Intuition (§2).**
> Predicate logic lets a statement depend on an object from a domain. Instead of saying only “the row is valid,” it can say $P(r)$, meaning row $r$ has the property $P$. Quantifiers then describe how widely the property holds: every row has it, some row has it, or no row has it.
>
> The load-bearing habit is to separate the domain, the predicate, and the quantifier. An existential claim needs one witness that makes the statement true. A universal claim needs every domain element to pass, so one counterexample is enough to refute it. This exact language prevents vague statements such as “the model works on the data” from hiding which objects and which conditions are being claimed.

**Definition & Assumptions (§3).** Explain-only: this is a language-and-meaning lesson. The key work is defining domains, predicates, witnesses, and counterexamples rather than deriving a numerical formula.

**Symbols.** $P(x)$ predicate; $x$ domain element; $\forall$ every; $\exists$ at least one; $\neg$ not; a witness is an object making an existential claim true.

**Real-World Applications (§5).**
1. **Database queries:** 420 of 10,000 rows satisfy $P(r)$, so $\exists rP(r)$ is true and $\forall rP(r)$ is false.
2. **Contracts:** 200 precondition-satisfying tests with 199 postcondition passes give 1 observed counterexample.
3. **Data validation:** values $0.2,0.9,1.3$ under $0\le x\le1$ give two passes and one counterexample.
4. **Graph properties:** degrees $2,3,2,1,4$ disprove “every degree is at least 2” by one node.
5. **Fairness statements:** group rates $0.51,0.50,0.49,0.52$ give one group below 0.50.
6. **Optimization guarantees:** if loss drops on 8 of 10 tested steps, the universal tested claim has 2 failures.

### `math-14-03` — Sets  · explain-only

**Connections (§1).**
> Sets give discrete mathematics a clean language for collections. The reader may already know lists or tables from programming, but sets focus on membership and distinct elements rather than order or repetition. This makes them the natural foundation for logic, relations, functions, inclusion-exclusion, probability events, and feature groups. Later counting lessons rely on set operations to say exactly which outcomes are being counted.

**Motivation & Intuition (§2).**
> Sets are collections with distinct elements. They let data reasoning talk cleanly about membership, overlap, exclusion, and Cartesian products. Once a collection is treated as a set, asking whether an element belongs, whether two collections overlap, or how many distinct items remain becomes precise.
>
> The main value is that set operations match common data tasks. A union merges sources, an intersection finds shared items, a difference removes exclusions, and a complement depends on a stated universe. Because duplicates are not counted as new elements, sets are especially useful for deduplication, coverage, leakage checks, and candidate generation.

**Definition & Assumptions (§3).** Explain-only: the lesson introduces operations and meanings. The inclusion-exclusion formula is derived fully in `math-14-14`, so this lesson should explain membership and set operations without forcing a proof.

**Symbols.** $x\in A$ membership; $A\cup B$ union; $A\cap B$ intersection; $A\setminus B$ difference; $A^c$ complement relative to a universe; $|A|$ finite cardinality.

**Real-World Applications (§5).**
1. **Train/test leakage:** train 80,000, test 20,000, overlap 50 gives $80000+20000-50=99950$ distinct ids.
2. **Vocabulary coverage:** 12,000 and 9,000 token sets with 7,500 overlap have union 13,500.
3. **Recommendation candidates:** sources returning 100 and 80 with 30 overlap give 150 unique candidates.
4. **Access groups:** 25 and 18 engineers with 5 in both give 38 people in at least one group.
5. **Image labels:** $\{cat,indoor,pet\}$ and $\{dog,indoor,pet\}$ have intersection size 2 and union size 4.
6. **Experiment exclusions:** from 1,000,000 users, excluding 40,000 leaves 960,000 eligible users.

### `math-14-04` — Relations  · explain-only

**Connections (§1).**
> Relations build directly on sets by selecting ordered pairs from a Cartesian product. Once the reader can talk about elements and membership, a relation simply records which pairs are connected. This language supports graph edges, joins, dependency links, similarity links, and ordering rules. It also leads naturally to functions, equivalence classes, partial orders, and lattice structure.

**Motivation & Intuition (§2).**
> A relation records which ordered pairs are connected. In a database, the pair might be a user and a course; in a graph, it might be a source node and a target node; in a similarity system, it might be two items that pass a threshold. The relation is the set of pairs that actually hold, not the full list of possible pairs.
>
> Many important properties are checked by looking for required pairs or missing counterexample pairs. Reflexive means every object relates to itself. Symmetric means a pair must be mirrored in the opposite direction. Transitive means a two-step connection forces the direct shortcut. These definitions are simple, but they are useful because they let finite structures be tested exactly.

**Definition & Assumptions (§3).** Explain-only: reflexive, symmetric, and transitive are definitions checked against pairs. The lesson should focus on how to test the definitions and how missing pairs create counterexamples.

**Symbols.** $R\subseteq A\times B$ relation; $(a,b)\in R$ related pair; $aRb$ infix notation; reflexive, symmetric, and transitive are quantified pair properties.

**Real-World Applications (§5).**
1. **Database joins:** 4 users and 3 courses create 12 possible pairs; a relation may store 7 enrollments.
2. **Equivalence classes:** modulo 3 on $\{0,1,2,3,4,5\}$ creates 3 classes of size 2.
3. **Dependency closure:** 10 direct dependencies plus 2 transitive-only dependencies give 12 total reachable dependencies.
4. **Similarity graphs:** 10,000 scored item pairs with 640 above threshold give density $640/10000=0.064$.
5. **A relation as a matrix:** a 5-by-5 Boolean relation has 25 possible entries.
6. **Non-transitive similarity:** $s(A,B)=0.92$ and $s(B,C)=0.91$ pass a 0.9 threshold, but $s(A,C)=0.84$ fails, so one transitive shortcut is missing.

### `math-14-05` — Functions  · deepen derivation

**Connections (§1).**
> Functions are special relations, so this lesson follows naturally after sets and relations. A relation may connect one input to many outputs, but a function assigns exactly one output to each input. That restriction is the basis for transition tables, classifiers, hash maps, feature transformations, and deterministic rules. Counting finite functions also previews product-rule reasoning and hypothesis-space sizes.

**Motivation & Intuition (§2).**
> A function is a relation with one output for every input. The input side is the domain, and each domain element must be assigned a codomain element. Outputs may be shared unless the function is required to be injective, so many different inputs can map to the same label, bucket, or rounded value.
>
> For finite sets, counting functions is a repeated-choice problem. Each input independently receives one of the available outputs. Because the same output can be reused, the number of choices does not shrink from one input to the next. Multiplying the same number of choices once per input gives the full count of possible assignments.

**Definition & Assumptions (§3).** Derive the count of functions $A\to B$ when $|A|=m$ and $|B|=n$: 1. List the $m$ domain elements because each must receive one output. 2. For the first input, choose any of $n$ codomain elements. 3. Repeat for each remaining input, still with $n$ choices because sharing outputs is allowed. 4. Multiply the independent choices: $n\cdot n\cdots n$. 5. There are $m$ factors, so the count is $n^m$.

**Symbols.** $f:A\to B$ function; $A$ domain; $B$ codomain; $f(a)$ output; injective no shared outputs; surjective every codomain element hit; $n^m$ all finite functions.

**Real-World Applications (§5).**
1. **Binary classifiers:** 3 binary features give 8 inputs; with 2 labels, possible classifiers on that finite domain total $2^8=256$.
2. **Hashing:** mapping 1000 keys to 100 buckets cannot be injective because $1000>100$.
3. **Transition tables:** 5 states and 3 symbols require $5\cdot3=15$ function entries.
4. **Finite label functions:** 4 examples into 3 labels give $3^4=81$ labelings.
5. **Exactly two positives:** among 6 binary-labeled examples, all label functions total $2^6=64$, and exactly two positives total $\binom62=15$.
6. **Rounding feature:** ages 21 and 29 both map to 20, giving a valid function that is not injective.

### `math-14-06` — Proof by induction  · explain-only

**Connections (§1).**
> Induction is the first proof method in this section that is designed for infinitely many related claims. It connects naturally to integer-indexed sequences, loops, recursion, and recurrence relations. A reader who can verify one case at a time can now learn how a proof covers all later cases at once. This method supports later lessons on recurrences, counting identities, and algorithm correctness.

**Motivation & Intuition (§2).**
> Induction proves infinitely many integer-indexed claims by proving the first case and a reusable next-step. The base case starts the chain at a known index. The inductive step says that whenever one link in the chain is true, the next link must also be true.
>
> The important subtlety is that the inductive step is proved for an arbitrary index, not for one special number. That makes the step reusable. Once the base case is established, the step carries truth from the base case to the next case, then to the next, and so on. This is why induction is a natural proof language for recursive algorithms and loop invariants.

**Definition & Assumptions (§3).** Explain-only: induction is a proof schema, not a formula. The lesson should explain why the base case starts the chain and why an arbitrary inductive step can be reused for every later integer.

**Symbols.** $P(n)$ statement at index $n$; $n_0$ starting index; base case proves $P(n_0)$; inductive hypothesis assumes $P(k)$; inductive step proves $P(k+1)$.

**Real-World Applications (§5).**
1. **Recursive algorithms:** a proof for size 1 plus a size-$n$ to size-$(n-1)$ step covers every positive size.
2. **Loop invariant:** after 5 iterations a sum loop stores $a_1+\cdots+a_5$.
3. **Binary trees:** height 3 full binary tree has $1+2+4+8=15=2^4-1$ nodes.
4. **Doubling systems:** starting with 1 task and doubling for 10 rounds gives $2^{10}=1024$.
5. **Dynamic programming:** correct entries for lengths 0 through 4 plus a valid recurrence prove length 5 next.
6. **Gradient error recurrence:** $e_{t+1}=0.8e_t$, $e_0=5$ gives $e_4=5(0.8)^4=2.048$.

### `math-14-07` — Proof by contradiction  · explain-only

**Connections (§1).**
> Contradiction is another general proof method, and it pairs well with logic and quantified statements. The reader has already seen how a claim can be negated and how a single counterexample can disprove a universal statement. This lesson turns that habit into a method for proving impossibility, uniqueness, and forced collisions. It prepares the ground for pigeonhole arguments and lower-bound reasoning.

**Motivation & Intuition (§2).**
> Contradiction proves a claim by assuming its denial and following that denial until it violates an accepted fact. The temporary assumption is not believed to be true; it is used to test what would happen if the target claim failed. If the consequences are impossible, the denial must be rejected.
>
> The method depends on careful negation and a genuine contradiction. It is not enough for the temporary assumption to seem unlikely. The chain must reach something impossible, such as more objects than available slots under a claimed limit, two different values both equal to the same unique value, or a rule and its violation holding together.

**Definition & Assumptions (§3).** Explain-only: this is a proof method. The app should emphasize exact negation, a valid chain from the temporary assumption, and a genuine contradiction.

**Symbols.** $P$ target claim; $\neg P$ temporary denial; $F$ false statement or impossibility; contradiction examples include $0=1$ or a reduced fraction with a common factor.

**Real-World Applications (§5).**
1. **Compression lower bound:** there are 256 one-byte strings but only $1+2+4+8+16+32+64+128=255$ shorter binary strings, so not every byte string compresses.
2. **Pigeonhole proof:** 101 users in 100 shards contradict the assumption of at most one user per shard.
3. **Uniqueness:** if $2x=6$ and $2y=6$, both equal 3, so two different solutions contradict equality.
4. **Hash security:** 17 messages and 16 four-bit hashes force a collision, contradicting perfect collision avoidance.
5. **Data validation:** a row with age $-3$ contradicts a validity rule requiring age at least 0.
6. **Decision lower bound:** one yes-or-no question has only 2 answer patterns, so it cannot distinguish 3 cases.

### `math-14-08` — The sum rule  · deepen derivation

**Connections (§1).**
> The sum rule begins the main counting spine of the section. It uses sets and disjoint cases to count outcomes without double-counting. The reader may already add category totals in ordinary data summaries; this lesson explains when that addition is valid. It supports later work on combinations, identities, inclusion-exclusion, probability, and complexity counts.

**Motivation & Intuition (§2).**
> The sum rule counts choices split into disjoint cases. The important habit is not the addition itself; it is making cases that cover everything once. If every outcome belongs to exactly one case, then adding the case sizes counts every outcome exactly once.
>
> This is often the first step in a larger counting problem. Before adding, the cases must be checked for overlap and coverage. If cases overlap, inclusion-exclusion is needed instead. If the problem involves a sequence of choices rather than alternatives among cases, the product rule is the correct tool.

**Definition & Assumptions (§3).** Derive $|A_1\cup\cdots\cup A_k|=|A_1|+\cdots+|A_k|$ for pairwise disjoint finite sets: 1. Pairwise disjoint means no element lies in two different $A_i$. 2. Count $A_1$; every element counted belongs to the union. 3. Add $A_2$; no element duplicates an $A_1$ element because the sets are disjoint. 4. Continue through $A_k$; each new set adds only new elements. 5. The union is exactly all these elements together, so the union size is the sum of sizes.

**Symbols.** $A_i$ case set; $\cup$ union; $|A_i|$ number of outcomes in case $i$; pairwise disjoint means $A_i\cap A_j=\varnothing$ for $i\ne j$.

**Real-World Applications (§5).**
1. **Search types:** 12 documents, 8 images, and 5 videos with no overlap give 25 results.
2. **Dataset splits:** 70,000 train, 15,000 validation, 15,000 test give 100,000 examples.
3. **Error taxonomy:** 18 label, 25 retrieval, and 7 ranking errors give 50 primary errors.
4. **User funnels:** 300 search, 120 ads, and 80 referral entrants give 500 users.
5. **File indexing:** 1.2 million HTML, 0.4 million PDFs, and 0.1 million images give 1.7 million files.
6. **Model menu:** 10 linear, 24 tree, and 6 kernel choices give 40 candidates.

### `math-14-09` — The product rule  · deepen derivation

**Connections (§1).**
> The product rule follows the sum rule by counting sequences of choices rather than disjoint alternatives. It connects to Cartesian products from set language and to functions, where each input receives an output. This lesson gives the arithmetic behind search grids, feature crosses, passwords, and state spaces. It also prepares the reader for permutations, binomial expansions, and complexity growth.

**Motivation & Intuition (§2).**
> The product rule counts sequential choices. After one choice is made, the next choice is paired with it, and each completed sequence becomes an ordered tuple. The total grows by multiplying because each earlier partial outcome branches into the choices available at the next step.
>
> This explains both useful design spaces and combinatorial explosion. A small number of options at each stage can produce a large number of total configurations. The product rule is therefore a tool for counting what is possible and for recognizing when an exhaustive search is becoming too large.

**Definition & Assumptions (§3).** Derive $n_1n_2\cdots n_k$: 1. For step 1, there are $n_1$ choices. 2. For each first choice, step 2 has $n_2$ choices, making $n_1n_2$ partial outcomes. 3. For each partial outcome, step 3 has $n_3$ choices, making $n_1n_2n_3$. 4. Continue through step $k$. 5. Each full outcome is one ordered tuple, so the total is $n_1n_2\cdots n_k$.

**Symbols.** $n_i$ choices at step $i$; $k$ number of steps; ordered tuple records the sequence; $A\times B$ Cartesian product with $|A\times B|=|A||B|$.

**Real-World Applications (§5).**
1. **Hyperparameter grids:** 6 learning rates, 4 depths, 3 regularization values give 72 runs.
2. **Password spaces:** 8 lowercase characters give $26^8=208827064576$ strings.
3. **Feature crosses:** 20 cities, 5 device types, and 3 tiers give 300 crossed buckets.
4. **Test configurations:** 7 browsers, 3 locales, 4 screen sizes give 84 configurations.
5. **Architecture search:** 3 depths, 4 widths, 2 activations, 2 optimizers give 48 candidates.
6. **Robot states:** 10 positions, 4 headings, 2 gripper states give 80 states.

### `math-14-10` — Permutations  · deepen derivation

**Connections (§1).**
> Permutations specialize the product rule to ordered selections without replacement. The reader has already seen that sequential choices multiply; this lesson adds the condition that each selected object is used only once. That condition makes the number of choices shrink from position to position. The idea is central to rankings, schedules, shuffles, and ordered pipeline choices.

**Motivation & Intuition (§2).**
> Permutations count arrangements where position matters. Ranking the same five recommendations in a different order is a different output. A first-place item and a third-place item are not interchangeable when the positions have meaning.
>
> Because selection is without replacement, each filled position removes one object from the remaining choices. The first position has the full set available, the second has one fewer, and the pattern continues until the requested number of positions is filled. Factorials give a compact way to write that decreasing product.

**Definition & Assumptions (§3).** Derive $P(n,r)=n!/(n-r)!$: 1. Fill the first ordered position with any of $n$ objects. 2. Fill the second with $n-1$ choices because one object was used. 3. Continue until $r$ positions are filled; the last position has $n-r+1$ choices. 4. Multiply by the product rule: $n(n-1)\cdots(n-r+1)$. 5. Write $n!=n(n-1)\cdots(n-r+1)(n-r)!$. 6. Divide by $(n-r)!$ to get $P(n,r)=n!/(n-r)!$.

**Symbols.** $n$ distinct objects; $r$ ordered positions; $n!$ product down to 1; $P(n,r)$ ordered selections without replacement.

**Real-World Applications (§5).**
1. **Ranked search:** ordered top 3 from 50 candidates gives $50\cdot49\cdot48=117600$.
2. **Survey order:** 6 questions can appear in $6!=720$ orders.
3. **Job scheduling:** 8 distinct jobs have $8!=40320$ schedules.
4. **Dataset shuffling:** 10 examples have $10!=3628800$ possible shuffles.
5. **No-repeat access token:** 6 characters from 36 symbols gives $36\cdot35\cdot34\cdot33\cdot32\cdot31$ tokens.
6. **Pipeline order:** 4 transformations can be ordered in $4!=24$ ways.

### `math-14-11` — Combinations  · AUTHOR derivation

**Connections (§1).**
> Combinations come after permutations because they count selections when order is not part of the outcome. The reader has already seen how ordered selections are counted by multiplying decreasing choices. This lesson removes the internal orderings that should not create new outcomes. It is the counting tool behind subsets, panels, mini-batches, graph edges, and feature selection.

**Motivation & Intuition (§2).**
> Combinations count selected groups when internal order does not matter. A mini-batch or feature subset is the same group no matter how it is listed. The outcome is the chosen collection, not a ranking or sequence.
>
> The standard derivation starts with the easier ordered count. Each unordered group of size $r$ appears once for every possible ordering of its members, so the permutation count counts each group $r!$ times. Dividing by those internal orderings leaves each unordered group counted once.

**Definition & Assumptions (§3).** Derive $\binom nr=\dfrac{n!}{r!(n-r)!}$: 1. First count ordered selections of $r$ objects: $P(n,r)=n!/(n-r)!$. 2. Notice that a single unordered group of $r$ selected objects can be arranged in $r!$ orders. 3. Therefore the ordered count counts each unordered group exactly $r!$ times. 4. Divide the ordered count by $r!$. 5. The result is $\binom nr=P(n,r)/r!=n!/(r!(n-r)!)$.

**Symbols.** $\binom nr$ read “$n$ choose $r$”; $n$ available distinct objects; $r$ selected objects; $r!$ internal orderings removed.

**Real-World Applications (§5).**
1. **Feature subset selection:** choosing 5 from 30 gives $\binom{30}{5}=142506$ subsets.
2. **Mini-batches:** choosing 4 examples from 20 gives $\binom{20}{4}=4845$.
3. **Reviewer panels:** choosing 3 from 12 gives 220 panels.
4. **Pairwise comparisons:** 100 items have $\binom{100}{2}=4950$ unordered pairs.
5. **Segment choices:** choosing 3 from 9 gives 84 segment sets.
6. **Graph edges:** 50 vertices have $\binom{50}{2}=1225$ possible undirected edges.

### `math-14-12` — The binomial theorem  · deepen derivation

**Connections (§1).**
> The binomial theorem links algebraic expansion to combination counting. It depends on the product rule because expanding a product means making a choice from each factor. It also depends on combinations because only the positions of the chosen terms matter for each coefficient. The theorem later supports binomial probability, generating functions, and subset-count identities.

**Motivation & Intuition (§2).**
> The binomial theorem explains why combination numbers appear when a two-choice expression is multiplied many times. Each factor chooses one of two terms. After all choices are made, terms with the same number of $y$ choices combine into one coefficient.
>
> For a fixed power $y^k$, the only question is which $k$ of the $n$ factors supplied $y$. The remaining factors supply $x$. There are $\binom nk$ ways to choose those positions, so that combination number becomes the coefficient of $x^{n-k}y^k$.

**Definition & Assumptions (§3).** Derive $(x+y)^n=\sum_{k=0}^n\binom nkx^{n-k}y^k$: 1. Write $(x+y)^n$ as $n$ factors. 2. Expanding means choosing either $x$ or $y$ from each factor. 3. To get a term with $y^k$, choose exactly $k$ of the $n$ factor positions to supply $y$. 4. The remaining $n-k$ positions supply $x$. 5. There are $\binom nk$ choices of the $y$ positions. 6. Sum over $k=0$ through $n$ to cover every possible number of $y$ choices.

**Symbols.** $n$ nonnegative integer; $k$ number of factors contributing $y$; $x,y$ commuting terms; $\binom nk$ coefficient of $x^{n-k}y^k$.

**Real-World Applications (§5).**
1. **Binomial probabilities:** 10 trials, success probability 0.3, exactly 4 successes gives $\binom{10}{4}(0.3)^4(0.7)^6\approx0.2001$.
2. **Dropout masks:** 8 units with keep probability 0.75, exactly 6 kept gives $\binom86(0.75)^6(0.25)^2\approx0.3115$.
3. **Random features:** 20 features chosen independently with probability 0.1, exactly 2 chosen gives $\binom{20}{2}(0.1)^2(0.9)^{18}\approx0.2852$.
4. **Polynomial coefficient:** coefficient of $x^7y^3$ in $(x+y)^{10}$ is $\binom{10}{3}=120$.
5. **Ensemble majority:** 5 classifiers with accuracy 0.8 have majority-correct probability $\binom53(0.8)^3(0.2)^2+\binom54(0.8)^4(0.2)+\binom55(0.8)^5=0.94208$.
6. **Subset count:** $\sum_{k=0}^6\binom6k=(1+1)^6=64$ subsets.

### `math-14-13` — Combinatorial identities  · AUTHOR derivation

**Connections (§1).**
> Combinatorial identities come after the main counting rules because they use those rules to explain algebraic equalities. The reader has seen sums, products, combinations, and binomial coefficients. This lesson shows how two different counting methods can describe the same finite set. That viewpoint is useful in probability, feature counting, subset search, and simplifying formulas.

**Motivation & Intuition (§2).**
> A combinatorial identity is often two honest counts of the same finite set. One side may count all objects directly, while the other side splits them into cases and adds those cases. If both descriptions count exactly the same objects once, the algebraic equality follows from counting rather than symbolic manipulation alone.
>
> Vandermonde's identity is a model example. A committee can be chosen from a combined population all at once, or it can be counted by how many members come from the first group and how many from the second. The case split is disjoint and complete, so summing the case counts must match the direct count.

**Definition & Assumptions (§3).** Derive Vandermonde's identity $\sum_{k=0}^r\binom mk\binom n{r-k}=\binom{m+n}r$: 1. Split a population into groups of sizes $m$ and $n$. 2. Count committees of size $r$ all at once: $\binom{m+n}r$. 3. Count the same committees by how many $k$ members come from the first group. 4. For a fixed $k$, choose $\binom mk$ from the first group and $\binom n{r-k}$ from the second. 5. Multiply those two counts by the product rule. 6. Sum over all possible $k$; the cases are disjoint and cover every committee.

**Symbols.** $m,n$ group sizes; $r$ total selected; $k$ selected from the first group; $\sum$ adds disjoint cases.

**Real-World Applications (§5).**
1. **Feature subset search:** 12 binary features produce $2^{12}=4096$ subsets and 4095 nonempty subsets.
2. **Ensembles:** from 8 trained models, exactly 3-model ensembles number $\binom83=56$.
3. **Audience attributes:** 6 binary attributes give $2^6=64$ inclusion patterns.
4. **Polynomial features:** 4 inputs and degree 2 monomials with repetition give $\binom{4+2-1}{2}=10$.
5. **Projection lists:** choosing 4 columns from 20 gives $\binom{20}{4}=4845$.
6. **Multi-label outputs:** 10 labels give $2^{10}=1024$ label sets and 1023 nonempty label sets.

### `math-14-14` — Inclusion–exclusion  · full prose model entry

**Connections (§1).**
> This lesson builds on sets, unions, intersections, and the counting habit from the sum rule. The sum rule works when cases are disjoint. Inclusion–exclusion handles the next common situation: the cases overlap, so a plain sum counts some objects more than once.
>
> This idea shows up whenever data, events, labels, alerts, or retrieval results are merged. A user may be in two audiences, a row may fail two validation rules, and a document may come from two retrievers. Inclusion–exclusion gives the exact union count by adding the easy counts and then repairing the overlap.

**Motivation & Intuition (§2).**
> Suppose 55 users use mobile and 40 users use desktop. Adding gives 95 device-usages, not necessarily 95 users, because the users who use both devices appear in both counts. If 20 users use both, those 20 users were counted twice. Subtracting the overlap once leaves each user counted exactly once.
>
> The same repair pattern extends to three sets. First add the three single-set counts. Then subtract the pairwise overlaps, because each overlapping item has been counted too often. But an item in all three sets has then been added three times and subtracted three times, leaving zero copies. It must be added back once. Inclusion–exclusion is careful bookkeeping: every element in the union ends with coefficient 1.

**Definition & Assumptions (§3).** Display the two-set formula
$$
|A\cup B|=|A|+|B|-|A\cap B|.
$$
Then derive it completely:
1. Split the union into disjoint pieces: $A\setminus B$, $B\setminus A$, and $A\cap B$, because every element in $A\cup B$ belongs to exactly one of these three regions.
2. Count $A$ as $|A\setminus B|+|A\cap B|$, because $A$ consists of its outside-$B$ part plus the overlap.
3. Count $B$ as $|B\setminus A|+|A\cap B|$, because $B$ has the same kind of split.
4. Add the single-set counts: $|A|+|B|=|A\setminus B|+|B\setminus A|+2|A\cap B|$, because the overlap appears in both sets.
5. Subtract one overlap: $|A|+|B|-|A\cap B|=|A\setminus B|+|B\setminus A|+|A\cap B|$, so each region is counted once.
6. Recognize the right-hand side as $|A\cup B|$, because it is the disjoint-region count of the union.

Display the three-set formula
$$
|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|A\cap C|-|B\cap C|+|A\cap B\cap C|.
$$
Derive the triple-overlap correction:
1. Take an element that lies only in one set; it is added once, subtracted zero times, and added back zero times, so its final count is 1.
2. Take an element that lies in exactly two sets; it is added twice and subtracted once in its pairwise intersection, so its final count is 1.
3. Take an element that lies in all three sets; it is added three times and subtracted three times, once for each pair.
4. Add the triple intersection once; the all-three element now has count $3-3+1=1$.
5. Since every union element falls into exactly one of these cases, the formula counts every union element once.

**Worked count.** In 100 users, let $M$ be mobile users and $D$ be desktop users with $|M|=55$, $|D|=40$, and $|M\cap D|=20$.
1. Write the target $|M\cup D|$, because at least one device means union.
2. Substitute into the formula: $|M\cup D|=55+40-20$.
3. Add single counts: $55+40=95$.
4. Subtract the duplicate overlap: $95-20=75$.
5. Interpret: 75 users use at least one of mobile or desktop.

**Symbols.** $A,B,C$ are finite sets; $\cup$ means union, or membership in at least one set; $\cap$ means intersection, or membership in all named sets; $|A|$ means the number of elements in $A$; complements require a stated universe.

**Real-World Applications (§5).**
1. **Deduplicating alerts.** CPU alerts hit 40 hosts, memory alerts hit 30 hosts, and 12 hosts hit both; unique alerted hosts are $40+30-12=58$.
2. **Search result blending.** Retriever A returns 100 documents, B returns 80, and 25 overlap; the merged result set has $100+80-25=155$ unique documents.
3. **Data quality checks.** Rule counts are 300 and 220 with 75 rows failing both; rows failing at least one rule total $300+220-75=445$.
4. **Discrete probability.** If $P(A)=0.4$, $P(B)=0.3$, and $P(A\cap B)=0.1$, then $P(A\cup B)=0.4+0.3-0.1=0.6$.
5. **Cache coverage.** Cache 1 hits 700 requests, cache 2 hits 500, and both hit 250; at least one cache hits $700+500-250=950$ requests.
6. **Multi-label evaluation.** Label counts are 45, 35, and 20; pair overlaps are 10, 5, and 4; triple overlap is 2. The union is $45+35+20-(10+5+4)+2=83$ items.

### `math-14-15` — The pigeonhole principle  · deepen derivation

**Connections (§1).**
> The pigeonhole principle follows naturally from counting objects and boxes. It uses contradiction, the sum rule, and integer ceilings to turn a counting imbalance into a guaranteed collision or load. The reader has already seen examples where too many items cannot fit under a claimed limit. This lesson makes that reasoning exact for hashing, sharding, birthdays, and load balancing.

**Motivation & Intuition (§2).**
> Pigeonhole reasoning turns crowding into certainty. If too many objects must fit into too few boxes, some box must hold a repeat or a high load. The conclusion does not identify which box is crowded; it guarantees that at least one such box exists.
>
> The generalized version gives a load guarantee. If $N$ objects are distributed across $k$ boxes, then the average load is $N/k$. Since a box count must be an integer, some box must reach at least the ceiling of that average. Assuming every box is below that level would make the total capacity too small for all $N$ objects.

**Definition & Assumptions (§3).** Derive the generalized guarantee $\lceil N/k\rceil$: 1. Suppose $N$ objects are placed into $k$ boxes. 2. Let $q=\lceil N/k\rceil$. 3. Assume for contradiction every box has at most $q-1$ objects. 4. Then all boxes together hold at most $k(q-1)$ objects. 5. Since $q-1<N/k$, multiplying by $k$ gives $k(q-1)<N$. 6. That contradicts placing all $N$ objects, so some box has at least $q$ objects.

**Symbols.** $N$ objects; $k$ boxes; $\lceil x\rceil$ smallest integer at least $x$; crowded box means a box meeting the guaranteed load.

**Real-World Applications (§5).**
1. **Hash collisions:** 10,000 ids into 1,024 buckets force a bucket with at least $\lceil10000/1024\rceil=10$ ids.
2. **Birthdays:** 367 people and 366 possible birthdays force a shared birthday.
3. **Load balancing:** 101 tasks on 20 workers force at least 6 tasks on one worker.
4. **Remainders:** 11 integers force two with the same remainder modulo 10.
5. **Cache sets:** 250 active keys in 64 cache sets force at least 4 keys in one set.
6. **Sequence buckets:** 513 sequences in 32 length buckets force at least 17 sequences in one bucket.

### `math-14-16` — Recurrence relations  · deepen derivation

**Connections (§1).**
> Recurrence relations connect counting to sequences and algorithms. After learning to count static sets of outcomes, the reader now describes a quantity by how it grows from smaller cases. This is the natural language of dynamic programming, recursive algorithms, autoregressive costs, and branching structures. It also prepares the reader for solving linear recurrences and using generating functions.

**Motivation & Intuition (§2).**
> A recurrence defines a sequence by giving starting values and a rule for later terms. Instead of writing a direct formula immediately, it says how to compute the next value from earlier values. This mirrors many algorithms that solve a problem by referring to smaller subproblems.
>
> The key modeling step is to split a size-$n$ object into cases that refer to smaller sizes. For binary strings with no consecutive 1s, the final symbol gives a clean split. Strings ending in 0 reduce to any valid shorter string, while strings ending in 1 must have a preceding 0, reducing to a still shorter valid prefix.

**Definition & Assumptions (§3).** Derive $a_n=a_{n-1}+a_{n-2}$ for binary strings with no consecutive 1s: 1. Let $a_n$ count valid length-$n$ strings. 2. Split valid strings by their final symbol, 0 or 1. 3. If a string ends in 0, the first $n-1$ symbols can be any valid string, giving $a_{n-1}$. 4. If it ends in 1, the previous symbol must be 0, so the ending is 01. 5. The first $n-2$ symbols can then be any valid string, giving $a_{n-2}$. 6. Add the disjoint cases: $a_n=a_{n-1}+a_{n-2}$.

**Symbols.** $a_n$ sequence term at size $n$; initial values anchor the recurrence; first-order uses one previous term; second-order uses two.

**Real-World Applications (§5).**
1. **DP tables:** $D(n)=D(n-1)+n$, $D(0)=0$ gives $D(4)=1+2+3+4=10$.
2. **Fibonacci:** $F_5=5$ and $F_6=8$, so $F_7=13$.
3. **Binary tree nodes:** $N_h=2N_{h-1}+1$, $N_0=1$ gives $N_3=15$.
4. **Batch schedule:** $b_n=2b_{n-1}$ from 32 gives 256 after 3 doublings.
5. **Queue backlog:** $q_n=q_{n-1}+12-10$, $q_0=5$ gives $q_4=13$.
6. **Autoregressive cost:** $c_n=c_{n-1}+64$ from 0 gives 640 after 10 steps.

### `math-14-17` — Solving linear recurrences  · AUTHOR derivation

**Connections (§1).**
> This lesson follows recurrence relations by asking when a recursive description can be turned into a closed formula. The reader has already seen sequences defined from previous terms. Linear recurrences with constant coefficients have a special structure that can be solved with characteristic roots. The method connects recurrence growth to geometric sequences and later to algorithmic growth rates.

**Motivation & Intuition (§2).**
> Solving a recurrence changes step-by-step computation into a formula. For homogeneous linear recurrences, geometric sequences make the recurrence become an algebra equation. This works because shifting a geometric sequence only changes it by powers of the same base.
>
> The characteristic equation finds the bases that can appear in solutions. Once those bases are known, the general solution is a combination of the corresponding geometric sequences. Initial conditions then choose the constants, turning the family of possible solutions into the one sequence specified by the recurrence.

**Definition & Assumptions (§3).** Solve $a_n=5a_{n-1}-6a_{n-2}$, $a_0=2$, $a_1=5$: 1. Try $a_n=r^n$ because geometric sequences keep the same shape after shifting. 2. Substitute: $r^n=5r^{n-1}-6r^{n-2}$. 3. Divide by $r^{n-2}$ to get $r^2=5r-6$. 4. Move all terms: $r^2-5r+6=0$. 5. Factor: $(r-2)(r-3)=0$, so roots are 2 and 3. 6. Write $a_n=A2^n+B3^n$. 7. Use $a_0=2$: $A+B=2$. 8. Use $a_1=5$: $2A+3B=5$. 9. Solve to get $A=1$, $B=1$. 10. State $a_n=2^n+3^n$.

**Symbols.** $a_n$ sequence; $r$ characteristic root; $A,B$ constants set by initial conditions; homogeneous means no extra forcing term.

**Real-World Applications (§5).**
1. **Fibonacci growth:** $F_{20}=6765$, and $\varphi^{20}/\sqrt5\approx6765$ gives the rounded growth estimate.
2. **Algorithm recurrence:** $T_n=2T_{n-1}$, $T_0=1$ gives $T_{30}=2^{30}=1,073,741,824$.
3. **Population model:** $a_n=3a_{n-1}$ from 100 gives $a_5=100\cdot3^5=24300$.
4. **Signal filter:** $y_n=0.5y_{n-1}$, $y_0=1$ gives $y_6=0.015625$.
5. **Momentum memory:** $m_n=0.9m_{n-1}$, $m_0=1$ gives $m_{10}=0.9^{10}\approx0.349$.
6. **Branching search:** $N_d=3N_{d-1}$, $N_0=1$ gives depth 6 count $729$.

### `math-14-18` — Generating functions  · deepen derivation

**Connections (§1).**
> Generating functions continue the sequence block by representing counts as coefficients of a formal power series. The reader has seen sequences, recurrences, and binomial coefficients; this lesson packages those counts into algebraic objects. Multiplication of generating functions corresponds to combining choices, so earlier product-rule ideas reappear in coefficient form. This prepares the reader for compact recurrence solving and constrained counting.

**Motivation & Intuition (§2).**
> A generating function stores a sequence as coefficients of powers of $x$. The variable records size, and algebra combines counts. The coefficient of $x^n$ is the count for size $n$, so the series is a bookkeeping device rather than an ordinary number to evaluate.
>
> The geometric series is the basic model. It has one term at every nonnegative size, so every coefficient is 1. Multiplying by $x$ shifts every coefficient up by one power. Subtracting the shifted series cancels all positive powers, leaving a simple algebraic equation for the whole series.

**Definition & Assumptions (§3).** Derive $1+x+x^2+\cdots=1/(1-x)$ formally: 1. Let $S=1+x+x^2+x^3+\cdots$. 2. Multiply by $x$: $xS=x+x^2+x^3+\cdots$. 3. Subtract: $S-xS=1$ because every positive-power term cancels. 4. Factor the left side: $(1-x)S=1$. 5. Solve: $S=1/(1-x)$. 6. Interpret $[x^n]S=1$ because there is one object of every size.

**Symbols.** $A(x)=\sum_{n\ge0}a_nx^n$ ordinary generating function; $a_n$ coefficient/count at size $n$; $[x^n]A(x)$ coefficient of $x^n$.

**Real-World Applications (§5).**
1. **Convolution:** $(1+2x)(3+4x)$ has $x$ coefficient $1\cdot4+2\cdot3=10$.
2. **Feature budgets:** $(1+x+x^2)(1+x)$ has coefficient of $x^2$ equal 2.
3. **Dice sums:** coefficient of $x^7$ in $(x+\cdots+x^6)^2$ is 6.
4. **Parts 1 and 3:** coefficient of $x^6$ in $(1+x+x^2+\cdots)(1+x^3+x^6+\cdots)$ is 3.
5. **Binomial coefficient:** in $(1+x)^8$, coefficient of $x^3$ is $\binom83=56$.
6. **DP compression:** $(1+3x+2x^2)(1+x)$ has $x^2$ coefficient $3+2=5$.

### `math-14-19` — Discrete probability  · deepen derivation

**Connections (§1).**
> Discrete probability uses the counting tools of the section to reason about uncertainty over finite or countable outcomes. Sets become events, unions and complements become event operations, and counts become probabilities when outcomes are equally likely. This lesson connects combinatorics to accuracy estimates, dropout masks, collisions, and token distributions. It also sets up probabilistic uses of inclusion-exclusion and binomial coefficients.

**Motivation & Intuition (§2).**
> Discrete probability turns counts or weights over countable outcomes into chances. For equally likely outcomes, probability is favorable count divided by total count. More generally, each outcome has a probability, and event probabilities come from adding the probabilities of outcomes in the event.
>
> The complement rule is one of the most useful bookkeeping facts. An event and its complement are disjoint and together cover the entire sample space. Since total probability is 1, knowing the chance that the event happens immediately gives the chance that it does not happen.

**Definition & Assumptions (§3).** Derive the complement rule $P(A^c)=1-P(A)$: 1. The sample space splits into disjoint sets $A$ and $A^c$. 2. Since they cover all outcomes, $P(A\cup A^c)=P(\Omega)=1$. 3. Because they are disjoint, add probabilities: $P(A\cup A^c)=P(A)+P(A^c)$. 4. Combine the two equations: $P(A)+P(A^c)=1$. 5. Subtract $P(A)$ to get $P(A^c)=1-P(A)$.

**Symbols.** $\Omega$ sample space; $\omega$ outcome; $P(\omega)$ outcome probability; $A$ event; $A^c$ complement; $E[X]$ expectation.

**Real-World Applications (§5).**
1. **Accuracy estimate:** 460 correct of 500 gives $460/500=0.92$.
2. **Mini-batch labels:** class rate 0.2 in batch 64 gives expected positives $64\cdot0.2=12.8$.
3. **Dropout:** keep probability 0.8 across 100 units gives expected kept units 80.
4. **Hashing:** two independent keys into 1000 buckets collide with probability $1/1000=0.001$.
5. **A/B testing:** 52 conversions among 1000 users gives estimate 0.052.
6. **Token distribution:** probabilities 0.50, 0.30, 0.20 sum to 1.00, with top-token chance 0.50.

### `math-14-20` — Posets and lattices  · explain-only

**Connections (§1).**
> Posets and lattices extend relation language by studying relations that behave like order. The reader has already seen reflexive and transitive properties, and this lesson adds antisymmetry to make a partial order. Unlike a total order, a partial order allows some pairs to remain incomparable. Lattices then connect ordering to set operations, permissions, constraints, and information flow.

**Motivation & Intuition (§2).**
> A partial order allows some pairs to be comparable and others independent. Subset inclusion is the guiding example: one feature set may be contained in another, but two feature sets can also overlap without either containing the other. This is often a better model than forcing every object into a single ranked line.
>
> A lattice adds meet and join operations, which summarize common lower information and combined upper information. In a subset lattice, meet is intersection because it keeps what both sets share, and join is union because it combines everything from either set. The definitions are about bounds, but in common finite examples they match practical operations on sets, permissions, or constraints.

**Definition & Assumptions (§3).** Explain-only: poset and lattice properties are definitions to check against a chosen order. For subset lattices, the lesson should explain why meet is intersection and join is union through lower-bound and upper-bound language.

**Symbols.** $\le$ partial order; reflexive, antisymmetric, transitive; $a\wedge b$ meet; $a\vee b$ join; comparable means one element is below the other.

**Real-World Applications (§5).**
1. **Feature-set lattice:** $A=\{1,2,5\}$ and $B=\{2,3\}$ have meet size 1 and join size 4.
2. **Permissions:** roles $\{read,write\}$ and $\{read,delete\}$ join to 3 distinct permissions.
3. **Dataflow facts:** $\{x,y\}$ and $\{y,z\}$ meet to $\{y\}$, one definitely initialized variable.
4. **Divisibility lattice:** for 12 and 18, meet is 6 and join is 36.
5. **Version constraints:** $\{1.0,1.1\}$ joined with $\{1.1,1.2\}$ gives 3 allowed versions.
6. **Concept hierarchy:** two labels sharing one parent can reduce two labels to one abstraction.

### `math-14-21` — Modular arithmetic  · AUTHOR derivation

**Connections (§1).**
> Modular arithmetic follows the counting and structure lessons by focusing on remainders. The reader already knows integer division informally, and this lesson turns the remainder into an equivalence relation on integers. It is essential for hash buckets, clocks, sharding, cyclic features, checksums, and many finite-state systems. The preservation laws show why ordinary addition and multiplication still work after reducing modulo a number.

**Motivation & Intuition (§2).**
> Modular arithmetic keeps remainders after division. Numbers that differ by a multiple of the modulus belong to the same residue class, so they behave the same for remainder-based purposes. This is why a clock can treat times separated by a full day as the same hour.
>
> The main algebraic fact is that congruence is compatible with addition and multiplication. If two numbers have the same remainder as two other numbers, adding the first pair or multiplying the first pair gives a result with the same remainder as doing the operation on the second pair. The derivation proves this by showing the differences remain divisible by the modulus.

**Definition & Assumptions (§3).** Derive preservation of addition and multiplication: 1. Assume $a\equiv b\pmod m$, so $a-b=qm$ for some integer $q$. 2. Assume $c\equiv d\pmod m$, so $c-d=rm$ for some integer $r$. 3. Add differences: $(a+c)-(b+d)=(a-b)+(c-d)=(q+r)m$. 4. Since $m$ divides the difference, $a+c\equiv b+d\pmod m$. 5. For products, write $a=b+qm$ and $c=d+rm$. 6. Multiply: $ac=(b+qm)(d+rm)=bd+m(br+dq+qrm)$. 7. Thus $ac-bd$ is divisible by $m$, so $ac\equiv bd\pmod m$.

**Symbols.** $a\equiv b\pmod m$ same remainder modulo $m$; $m$ positive modulus; $q,r$ integer quotients; residue class all integers with one remainder.

**Real-World Applications (§5).**
1. **Hash tables:** $h(k)=k\bmod100$ maps key 12345 to bucket 45.
2. **Checksums:** digits 4, 8, 2 sum to 14; modulo 10 remainder is 4.
3. **Clock time:** 50 hours after Monday 09:00 gives $9+50=59\equiv11\pmod{24}$, so Wednesday 11:00.
4. **Cryptography:** modulo 11, $3\cdot4=12\equiv1$, so 4 is the inverse of 3.
5. **Sharding:** user id 987 with 16 shards goes to shard $987\bmod16=11$.
6. **Cyclic features:** hour 27 maps to $27\bmod24=3$.

### `math-14-22` — Boolean algebra  · AUTHOR derivation

**Connections (§1).**
> Boolean algebra returns to propositional logic with an algebraic viewpoint. The reader has already worked with truth values, connectives, and truth tables. This lesson treats those connectives as operations that can be simplified while preserving every possible assignment. It connects directly to circuits, search filters, decision rules, binary features, and program conditions.

**Motivation & Intuition (§2).**
> Boolean algebra treats true and false values as algebraic objects. Expressions can be rearranged, simplified, or rewritten as long as every truth assignment gives the same final value. This makes logical rules easier to implement and easier to check.
>
> De Morgan's law is a central example because it explains how negation moves across AND and OR. Saying that not both conditions hold is equivalent to saying at least one condition fails. A truth table proves the law by checking all assignments and confirming that the final columns match exactly.

**Definition & Assumptions (§3).** Derive De Morgan's law $\neg(x\land y)=\neg x\lor\neg y$ by truth table: 1. List rows $(0,0),(0,1),(1,0),(1,1)$. 2. Compute $x\land y$ as $0,0,0,1$. 3. Negate it to get $\neg(x\land y)$ as $1,1,1,0$. 4. Compute $\neg x$ as $1,1,0,0$ and $\neg y$ as $1,0,1,0$. 5. OR those columns to get $1,1,1,0$. 6. The two final columns match, so the law holds for all Boolean assignments.

**Symbols.** $0,1$ false and true; $\land$ AND; $\lor$ OR; $\neg$ NOT; $\oplus$ XOR; equivalence means identical truth values in all rows.

**Real-World Applications (§5).**
1. **Feature filters:** $age\_ok\land(country\_ok\lor\neg country\_ok)$ simplifies to $age\_ok$.
2. **Decision trees:** a path with $p\land\neg p$ covers 0 rows.
3. **Circuits:** $(x\land y)\lor(x\land\neg y)$ uses two ANDs and one OR before simplifying to wire $x$.
4. **Search exclusions:** NOT(red OR blue) rewrites to NOT red AND NOT blue.
5. **Access control:** $(admin\lor owner)\land\neg admin$ simplifies to $owner\land\neg admin$.
6. **Binary indicators:** $z=x\land1$ equals $x$, so storing both adds no information.

### `math-14-23` — Counting, complexity, and Big-O  · CS capstone · deepen derivation

**Connections (§1).**
> This capstone gathers the section's counting habits and applies them to computational growth. The reader has counted functions, subsets, pairs, grids, strings, and recurrence growth. Big-O keeps the same concern with size but focuses on how work scales as the input grows. This is especially important in ML systems, where examples, features, tokens, pairs, and states can all become large.

**Motivation & Intuition (§2).**
> Big-O uses counting to describe how work grows with input size. It does not try to preserve every small constant or lower-order term. Instead, it gives an eventual upper bound that captures the dominant growth pattern once the input is large enough.
>
> For ML systems, counting examples, features, pairs, tokens, subsets, or states often decides whether a method can scale. A linear pass over examples may be practical, while all pairs or all subsets can become too large quickly. The derivation shows how a polynomial with several terms can be bounded by a constant multiple of its dominant term after a chosen threshold.

**Definition & Assumptions (§3).** Derive $3n^2+10n+5=O(n^2)$: 1. Start with the definition: need $C>0$ and $n_0$ such that $0\le3n^2+10n+5\le Cn^2$ for $n\ge n_0$. 2. Choose $n_0=1$ because then $n\le n^2$ and $1\le n^2$. 3. Bound $10n\le10n^2$ for $n\ge1$. 4. Bound $5\le5n^2$ for $n\ge1$. 5. Add bounds: $3n^2+10n+5\le3n^2+10n^2+5n^2=18n^2$. 6. Choose $C=18$, proving $3n^2+10n+5=O(n^2)$.

**Symbols.** $f(n)$ cost function; $g(n)$ comparison growth; $C$ constant multiplier; $n_0$ threshold; $O(g(n))$ eventual upper bound; $n,d,L$ may measure examples, features, or tokens.

**Real-World Applications (§5).**
1. **Linear inference:** 1,000,000 examples and 100 features use $100,000,000$ multiply-adds, or $O(nd)$.
2. **Retrieval evaluation:** 10,000 queries against 50,000 documents gives $5\times10^8$ scores.
3. **Transformer attention:** $L=4096$, $d=128$ gives $4096^2\cdot128=2,147,483,648$ score multiply-adds, or $O(L^2d)$.
4. **Grid search:** 5 learning rates, 4 batch sizes, 6 depths give 120 runs.
5. **Feature subset explosion:** 30 features give $2^{30}=1,073,741,824$ subsets.
6. **Epoch cost:** 200,000 examples at 20,000 operations each cost $4\times10^9$ operations.

---

## Build order

1. **Counting spine first:** `math-14-08` through `math-14-15`, because sum/product, permutations, combinations, binomial theorem, identities, inclusion-exclusion, and pigeonhole share the same case-counting discipline.
2. **Recurrence and series block:** `math-14-16` through `math-14-18`, because recurrence definitions, characteristic-equation solutions, and generating functions form one sequence of ideas.
3. **Discrete probability and structures:** `math-14-19` through `math-14-22`, keeping probability, posets, modular arithmetic, and Boolean algebra tightly tied to finite counts and exact definitions.
4. **Foundations polish:** `math-14-01` through `math-14-07`, preserving conceptual explain-only lessons while adding stronger symbol glosses and verified application numbers.
5. **Capstone last:** `math-14-23`, after every counting tool is in place, so Big-O reads as the CS and ML scale summary of the whole section.
