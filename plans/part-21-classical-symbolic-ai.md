# Part 21 — Classical / Symbolic AI

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F16 (Algorithmic-Instance).

### 21.1 — Propositional logic   [notebook: 21.1-propositional-logic.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Feature-flag eligibility — evaluate `premium AND not blocked -> show_feature`; lesson cites a 3-variable compound implication with 8 assignments and 1 failing row.
2. Access-control policy review — prove `has_badge AND manager_approved -> enter_lab`; illustrative 3 propositions give $2^3=8$ worlds to inspect.
3. Circuit/alert logic — encode `sensor_A OR sensor_B` and `NOT maintenance`; illustrative 2 sensors have 4 Boolean settings.
4. Contract/compliance rules — material implication captures promises; lesson's $P\to Q$ truth table has exactly 1 false row out of 4.
5. Unit-test condition coverage — replace one believed path with all models; lesson's `{P,P->Q}` KB has 1 satisfying model and entails `Q`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `truth_table_entails(kb, query)` and verify the lesson's `{P, P->Q}` over `(P,Q)` leaves exactly 1 KB model with `Q=1`.
- Datasets D1–D5: problem instances of rising size/complexity — D1 tiny 2-variable KB / logic problem (verify by hand) · D2 3-variable implication chain · D3 +conflicting rule and missing parentheses variant · D4 6-variable policy KB · D5 hardest 10-variable policy with deep implication chain and one countermodel candidate.
- Metric: entailment correctness across all rungs, with #assignments scanned and #models surviving.
- Closing viz: (a) truth-table / proof-world panels (b) assignments-scanned and correctness-vs-size curve.
- Pitfall on D5: reproduce confusing implication with causation and checking only the believed world, then fix by scanning every KB model and showing the counterfactual rows.
- Notes: delete dead template helpers; CPU-only, pure Python; all numeric checks cite lesson truth-table counts or are marked illustrative.

### 21.2 — First-order logic   [notebook: 21.2-first-order-logic.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Knowledge-graph rules — one `Bird(x)->Wings(x)` rule covers many entities; lesson verifies 3 objects (Tweety, Opus, Fido).
2. Family-relation inference — `Parent(x,y) AND Parent(y,z)->Grandparent(x,z)`; lesson derives 1 grandparent fact via Bob as the shared middle object.
3. Database integrity checks — universal constraints scan table rows; illustrative 100-row employee table means 100 quantified checks.
4. Security role policies — `Admin(x)->CanDeploy(x)` avoids copying per-user propositions; illustrative 12 admins generate 12 derived permissions.
5. Entity resolution rules — existential witnesses explain why a match exists; lesson's `Bird AND Flies` vector has 1 witness.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `fol_forward_chain(domain, predicates, rules)` with unification; verify lesson numbers: 3 objects make `forall Bird->Wings` true and Tweety is the 1 existential witness.
- Datasets D1–D5: problem instances of rising size/complexity — D1 3-object bird KB (verify by hand) · D2 6-object taxonomy with parent facts · D3 +domain drift and variable/constant confusions · D4 20-object organization KB · D5 hardest 50-object family/security KB with a 4-hop relational chain.
- Metric: inference correctness and #ground-rule matches across all rungs.
- Closing viz: (a) predicate-table / inference-chain panels (b) correct-derived-facts and match-count-vs-domain-size curve.
- Pitfall on D5: reproduce domain drift and assuming existence from a universal rule, then fix by freezing the domain and requiring explicit existential witnesses.
- Notes: delete dead template helpers; CPU-only, pure Python; no external theorem prover.

### 21.3 — Knowledge representation & reasoning   [notebook: 21.3-knowledge-representation.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Product taxonomy inheritance — store a property once at a parent node; lesson's `Tweety->Penguin->Bird` path yields `{wings, swims}` = 2 inherited properties.
2. Medical triage explanations — facts need paths, not just labels; illustrative 3-rule chain can cite all 3 fired rules.
3. Enterprise data catalogs — represent entities and relations so constraints are visible; illustrative 5 entity types create a 5-node schema graph.
4. Customer-support diagnosis — defaults plus overrides keep exceptions explicit; lesson scores bird-flies `+1` and penguin-not-flies `-1`, net `0` blocked default.
5. Policy engines — explanation paths audit why access is allowed; illustrative 4-edge path gives 4 cited reasons.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `inherit_properties(graph, defaults)` and verify lesson's Tweety path returns 2 properties plus a `+1-1=0` blocked flying default.
- Datasets D1–D5: problem instances of rising size/complexity — D1 Tweety/Penguin/Bird KB (verify by hand) · D2 deeper animal taxonomy · D3 +conflicting defaults/overrides · D4 product-support taxonomy with relation edges · D5 hardest enterprise policy graph with multiple inheritance and competing overrides.
- Metric: inference correctness / #explanation steps across all rungs.
- Closing viz: (a) semantic-network and explanation-path panels (b) correctness and path-length-vs-graph-size curve.
- Pitfall on D5: reproduce choosing a representation that hides the constraint, then fix by making defaults, overrides, and explanation edges explicit.
- Notes: delete dead template helpers; CPU-only, pure Python; representation choices must be shown as data structures.

### 21.4 — Description logics & ontologies   [notebook: 21.4-description-logics.ipynb]   (family: F16, gap)

**Lesson — Real World Applications (5):**
1. Biomedical ontology classification — subclass queries rely on set containment; lesson has `Professor={Ada,Cy}` contained in `Person={Ada,Bo,Cy}`.
2. Data-quality validation — disjointness catches impossible dual types; lesson's `Cat cap Dog={Milo}` violates required size 0 with actual size 1.
3. Semantic search expansion — querying people should include professors; lesson infers 2 professor members are also people.
4. Access vocabulary governance — roles are relations; lesson's `hasChild` pairs include 2 parent-child facts.
5. University directory reasoning — existential role queries find parents of doctors; lesson's `exists hasChild.Doctor` returns `{Ann}` = 1 individual.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `classify_ontology(concepts, roles, axioms)` and verify lesson set operations: 2 professors subset 3 people, 1 student-employee overlap, 1 disjointness violation.
- Datasets D1–D5: problem instances of rising size/complexity — D1 tiny Professor/Person ontology (verify by hand) · D2 subclass chain and existential role · D3 +disjointness conflicts · D4 small university ontology · D5 hardest product/medical ontology with deep subclassing and role restrictions.
- Metric: satisfiability / classification correctness and #axiom checks across all rungs.
- Closing viz: (a) ontology hierarchy / inconsistency panels (b) checks-or-violations-vs-ontology-size curve.
- Pitfall on D5: reproduce confusing a surviving candidate with a proved answer, then fix by checking every subsumption, role, and disjointness axiom.
- Notes: delete dead template helpers; CPU-only, pure Python; gap note: lesson is flagged gap, so implementation should preserve lesson numbers and may need fuller applications prose later.

### 21.5 — Semantic web & RDF   [notebook: 21.5-semantic-web-rdf.ipynb]   (family: F16, gap)

**Lesson — Real World Applications (5):**
1. Enterprise knowledge graphs — every fact is a triple; lesson says 2 Ada facts give 2 graph edges.
2. Linked open data joins — SPARQL-style pattern matching binds variables; lesson's `?x worksAt Uni` returns 2 bindings.
3. Metadata catalogs — type triples are uniform with relation triples; lesson's 2 Professor triples infer 2 Person triples under subclassing.
4. Semantic search filters — join `Professor` and `worksAt Uni`; lesson keeps Ada and Cy, again 2 bindings.
5. Cross-system integration — RDF avoids custom pairwise schemas; illustrative 3 systems can share one triple format instead of 3 pairwise translators.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `rdf_match_and_infer(triples, patterns, subclass)` and verify lesson counts: 2 edges for Ada, 2 professor bindings, 2 inferred person triples, 2 joined results.
- Datasets D1–D5: problem instances of rising size/complexity — D1 Ada/Cy/Uni RDF graph (verify by hand) · D2 more type and worksAt triples · D3 +duplicate/conflicting vocab aliases · D4 small catalog graph · D5 hardest linked-data graph with chained subclass inference and multi-pattern joins.
- Metric: query-answer correctness and #triples scanned/joined across all rungs.
- Closing viz: (a) RDF graph / query-binding panels (b) answer-count and scans-vs-triple-count curve.
- Pitfall on D5: reproduce choosing a representation that hides the constraint via opaque strings, then fix with explicit triples, type triples, and subclass edges.
- Notes: delete dead template helpers; CPU-only, pure Python; gap note: lesson is flagged gap, so keep examples grounded in its triple/count arithmetic.

### 21.6 — Rule-based & expert systems   [notebook: 21.6-rule-based-expert-systems.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Clinical triage rules — fever and cough trigger flu; lesson fact count grows `2->3->4->5` through rule firing.
2. Fraud-review policy — facts trigger inspectable decisions; illustrative 4 fired rules give a 4-step audit trail.
3. Customer-support routing — symptoms map to actions; illustrative 3 input facts can trigger 2 recommendations.
4. Industrial alarms — rule priorities separate knowledge from engine; illustrative 5 sensor facts tested against 8 rules.
5. Credit/policy eligibility — certainty factors combine evidence; lesson computes `min(0.8,0.7)*0.9=0.63`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `forward_chain(facts, rules, certainty=None)` and verify lesson fixed point: facts grow 2 to 5 and certainty factor equals 0.63.
- Datasets D1–D5: problem instances of rising size/complexity — D1 fever/cough mini expert system (verify by hand) · D2 more symptoms/actions · D3 +conflicting rules and priorities · D4 support-ticket rule base · D5 hardest policy engine with long firing chain and certainty factors.
- Metric: inference correctness / #rules fired / fixed-point fact count across all rungs.
- Closing viz: (a) fired-rule trace panels (b) fired-rules and correctness-vs-rulebase-size curve.
- Pitfall on D5: reproduce ignoring explanation paths, then fix by recording every antecedent, consequent, and certainty calculation in the trace.
- Notes: delete dead template helpers; CPU-only, pure Python; no external rule-engine dependency.

### 21.7 — Answer-set programming   [notebook: 21.7-answer-set-programming.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Shift scheduling — choose AM or PM but not both; lesson's `{a,b}` has 4 possible subsets and 2 stable choices after the choice rule.
2. Product configuration — generate valid worlds then reject constraint violations; illustrative 5 binary options imply 32 candidate worlds before constraints.
3. Route/planning constraints — each chosen atom must be supported; lesson rejects `{see}` when `light` is absent.
4. Assignment optimization — choose cheapest stable model; lesson compares costs 2 and 1, so `{b}` wins.
5. Data-cleaning repair sets — negation-as-failure permits choices only when blockers are not derivable; illustrative 3 repairs produce up to 8 subsets.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `stable_models(atoms, rules, constraints, costs)` by enumerating supported worlds; verify lesson: 4 subsets, 2 stable choices, `{b}` wins cost 1 over 2.
- Datasets D1–D5: problem instances of rising size/complexity — D1 two-atom choice program (verify by hand) · D2 small scheduling choices · D3 +negation-as-failure conflicts/defaults · D4 configuration instance · D5 hardest combinatorial schedule with optimization and support checks.
- Metric: stable-model correctness / #candidate worlds / best cost across all rungs.
- Closing viz: (a) answer-set / support-tree panels (b) candidates-pruned and best-cost-vs-size curve.
- Pitfall on D5: reproduce confusing a surviving candidate with a proved answer, then fix by enforcing support plus every constraint before accepting a world.
- Notes: delete dead template helpers; CPU-only, pure Python; enumerate small instances only.

### 21.8 — SAT solvers   [notebook: 21.8-sat-solvers.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Hardware verification — Boolean requirements become clauses; lesson's 3-variable formula has `2^3=8` assignments.
2. Package dependency solving — clauses encode incompatible versions; illustrative 6 packages create 64 binary install choices before pruning.
3. Test-case generation — SAT finds satisfying feature combinations; lesson's example has exactly 4 satisfying assignments.
4. Planning encodings — action/time choices are Boolean; illustrative 3 actions over 4 time steps yield 12 Boolean variables.
5. Configuration checking — unit clauses force decisions; lesson's `(A)` forces `A=1`, then `(not A or C)` becomes unit `(C)`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `dpll(cnf)` with unit propagation and pure literals; verify lesson formula `(A or B) and (not A or C)` has 8 assignments and 4 satisfying assignments.
- Datasets D1–D5: problem instances of rising size/complexity — D1 3-variable CNF (verify by hand) · D2 implication-chain CNF · D3 +conflicting unit clauses/default choices · D4 package-config CNF · D5 hardest 20-variable scheduling CNF with deep propagation and backtracking.
- Metric: satisfiability correctness / #nodes visited / #forced assignments across all rungs.
- Closing viz: (a) DPLL search-tree panels (b) nodes-visited-vs-variable-count curve.
- Pitfall on D5: reproduce choosing a representation that hides the constraint, then fix by converting requirements to explicit CNF clauses and showing propagation.
- Notes: delete dead template helpers; CPU-only, pure Python; no external SAT solver.

### 21.9 — SMT solvers   [notebook: 21.9-smt-solvers.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Symbolic execution — path flags plus inequalities must agree; lesson accepts `[2,5]` because it is nonempty.
2. Program verification — impossible branches are rejected; lesson's `x>=4` and `x<=1` interval is empty because `4>1`.
3. Configuration with numeric limits — Boolean feature choices meet arithmetic budgets; illustrative 4 features have 16 Boolean choices plus budget checks.
4. Scheduling with time windows — interval feasibility checks candidate assignments; illustrative 3 tasks each with 2 windows yield 8 Boolean combinations.
5. Safety invariants — theory implication prunes flags; lesson says every `x` in `[2,5]` also satisfies `x<=6`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `mini_smt(boolean_formula, interval_atoms)` that enumerates Boolean atoms then checks interval feasibility; verify lesson: `P and Q` has 1 satisfying Boolean row out of 4 and `[2,5]` is feasible.
- Datasets D1–D5: problem instances of rising size/complexity — D1 two-atom interval SMT (verify by hand) · D2 several nonempty intervals · D3 +conflicting intervals/default branches · D4 program-path constraints · D5 hardest configuration with chained Boolean implications and arithmetic infeasibility.
- Metric: satisfiability correctness / #Boolean candidates / #theory rejections across all rungs.
- Closing viz: (a) Boolean-assignment plus interval panels (b) accepted-vs-rejected-candidates-vs-size curve.
- Pitfall on D5: reproduce confusing a surviving Boolean candidate with a proved answer, then fix by requiring the theory solver to validate every chosen atom set.
- Notes: delete dead template helpers; CPU-only, pure Python; avoid external Z3 dependency in the notebook plan.

### 21.10 — Automated theorem proving   [notebook: 21.10-automated-theorem-proving.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Formal verification — prove safety by contradiction; lesson derives the empty clause with 0 literals.
2. Proof assistants/checkers — each resolution step is auditable; lesson trace clause sizes can read `3->2->1->0`.
3. Legal/compliance reasoning — rules and negated goals expose contradictions; illustrative 5 clauses produce a 5-step proof trail.
4. Math knowledge bases — resolution cancels complementary literals; lesson resolves `(P or Q)` with `(not P or R)` to `(Q or R)`.
5. Security protocol analysis — derive forbidden states from clauses; lesson rewrites `P->Q` as `not P or Q` before proof.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `resolution_prove(clauses, goal)`; verify lesson proof: `(P)`, `(not P or Q)`, negated goal `(not Q)` derive empty clause and sizes `3->2->1->0`.
- Datasets D1–D5: problem instances of rising size/complexity — D1 tiny `P->Q` proof (verify by hand) · D2 3-rule Horn proof · D3 +irrelevant clauses and conflicting branch · D4 protocol-style proof KB · D5 hardest deep proof chain with many resolvents and tautology pruning.
- Metric: proof correctness / #resolution steps / empty-clause reached across all rungs.
- Closing viz: (a) proof-DAG / clause panels (b) resolution-steps-vs-clause-count curve.
- Pitfall on D5: reproduce ignoring explanation paths, then fix by storing parent clauses for every resolvent and rendering the proof DAG.
- Notes: delete dead template helpers; CPU-only, pure Python; bounded proof search to stay run-all-safe.

### 21.11 — Case-based reasoning   [notebook: 21.11-case-based-reasoning.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Customer-support incident reuse — retrieve similar old incidents; lesson query `(2.2,2.0)` is distance 0.2 from case `(2,2)`.
2. Medical precedent support — nearest cases explain recommendations; illustrative 5 patient features make a 5-dimensional similarity calculation.
3. Legal analogical reasoning — precedent ranking depends on metric weights; lesson weights `(3,1)` change distance to 0.346 while keeping the same nearest case.
4. Equipment maintenance — adapt an old repair to a new measurement; lesson adapts old solution 10 by slope 2 and feature change 1 to get 12.
5. Recommendation memory — revise and retain corrected cases; lesson revision error is `|12-11.5|=0.5`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `retrieve_adapt_revise_retain(cases, query, weights)` and verify lesson distances 0.2 and 0.346, adapted value 12, error 0.5.
- Datasets D1–D5: problem instances of rising size/complexity — D1 three 2D cases (verify by hand) · D2 10 clean cases · D3 +metric-weight conflict/outlier cases · D4 support-ticket case library · D5 hardest sparse/noisy case base needing adaptation and revision.
- Metric: retrieval correctness / adaptation absolute error / #cases searched across all rungs.
- Closing viz: (a) case-neighborhood / retrieval-rank panels (b) error-or-search-cost-vs-casebase-size curve.
- Pitfall on D5: reproduce choosing a representation that hides the constraint via poor features, then fix by exposing weighted features and showing the explanation case.
- Notes: delete dead template helpers; CPU-only, pure Python; brute-force retrieval is fine for teaching sizes.

### 21.12 — Fuzzy logic   [notebook: 21.12-fuzzy-logic.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. HVAC controllers — warm/cold boundaries are gradual; lesson's smooth controller `5+2*tanh(e)` stays about 3.07 to 6.93 for `e in [-2,2]`.
2. Risk scoring — partial rule firing avoids brittle cutoffs; lesson clips a consequent at rule strength 0.6.
3. Camera/autofocus control — combine focus and motion degrees; lesson fuzzy AND of 0.7 and 0.4 equals 0.4.
4. Search ranking labels — graded relevance combines weak matches; lesson fuzzy OR of 0.7 and 0.4 equals 0.7.
5. Appliance/vehicle control — defuzzify overlapping recommendations; lesson symmetric triangular output centered at 6 has centroid 6.00.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `fuzzy_controller(memberships, rules, defuzzify)` and verify lesson operations: min(0.7,0.4)=0.4, max=0.7, clipping at 0.6, centroid 6.00.
- Datasets D1–D5: problem instances of rising size/complexity — D1 two-membership toy rule (verify by hand) · D2 3 temperature rules · D3 +overlapping/conflicting memberships · D4 HVAC control examples · D5 hardest multi-input controller with noisy boundary cases.
- Metric: rule-output correctness / defuzzified action error / #rules fired across all rungs.
- Closing viz: (a) membership-function and rule-activation panels (b) action-smoothness/error-vs-input-complexity curve.
- Pitfall on D5: reproduce confusing fuzzy membership with probability, then fix by labeling degrees as compatibility and contrasting with frequency/probability language.
- Notes: delete dead template helpers; CPU-only, pure Python; plot simple membership curves with matplotlib only.

### 21.13 — Constraint satisfaction problems   [notebook: 21.13-constraint-satisfaction-problems.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Exam timetabling — variables are exams, domains are slots, constraints prevent conflicts; lesson triangle map has 3 variables and 3 inequality constraints.
2. Map coloring — adjacent regions differ; lesson with 3 colors has `3^3=27` assignments and 6 valid all-different colorings.
3. Product configuration — finite domains plus compatibility constraints; illustrative 5 variables with 3 values each give 243 raw assignments.
4. Staff scheduling — early pruning avoids doomed complete schedules; lesson backtracking visits 16 nodes instead of blind full-assignment checking.
5. Resource allocation — forward checking shrinks neighbor domains; lesson assigning `A=R` shrinks `B` and `C` from 3 colors to 2 each.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `backtracking_csp(variables, domains, constraints, forward_check=True)` and verify lesson triangle: 27 raw assignments, 6 valid colorings, 16 visited nodes, neighbor domains shrink 3 to 2.
- Datasets D1–D5: problem instances of rising size/complexity — D1 triangle map coloring (verify by hand) · D2 4-region map · D3 +conflicts/default variable ordering · D4 small timetable · D5 hardest larger scheduling/configuration instance with deep backtracking.
- Metric: satisfiability correctness / #nodes visited / #domain prunes across all rungs.
- Closing viz: (a) constraint-graph / search-tree panels (b) nodes-visited-or-prunes-vs-instance-size curve.
- Pitfall on D5: reproduce confusing a surviving candidate with a proved answer, then fix by checking every constraint and showing forward-check domains at each step.
- Notes: delete dead template helpers; CPU-only, pure Python; keep D5 bounded so exhaustive validation still runs quickly.
