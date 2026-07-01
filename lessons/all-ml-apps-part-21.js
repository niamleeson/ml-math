/* All ML — Part 21 applications (5 each). Loaded after content-part-21.js, before all-ml-register.js. */

/* ---- _apps-part21-A.js ---- */
(window.ALLML_CONTENT["21.1"] = window.ALLML_CONTENT["21.1"] || {}).applications = [
  { title: "Feature-flag eligibility", background: "<p>Product teams encode launch rules as Boolean policies so every possible eligibility case can be audited before rollout.</p>", numbers: "<p>For illustrative propositions premium, not blocked, and show_feature, the lesson compound implication has $2^3=8$ assignments and exactly $1$ failing row: the two conditions hold but the feature is false.</p>" },
  { title: "Access-control policy review", background: "<p>Security reviewers translate badge and approval rules into formulas to find counterexamples before a lab or service is exposed.</p>", numbers: "<p>The illustrative rule has_badge AND manager_approved $\rightarrow$ enter_lab uses $3$ propositions, so a full review inspects $2^3=8$ worlds rather than one believed access path.</p>" },
  { title: "Circuit and alert logic", background: "<p>Digital circuits and alerting systems combine sensor states with gates such as OR, AND, and NOT.</p>", numbers: "<p>With $2$ sensor propositions there are $2^2=4$ Boolean settings; adding NOT maintenance turns the alert into a filtered subset of those worlds.</p>" },
  { title: "Contract and compliance promises", background: "<p>Implication is useful for promises because it isolates the made-and-broken case instead of implying causation.</p>", numbers: "<p>The lesson table for $P\rightarrow Q\equiv \neg P\lor Q$ has $4$ rows and exactly $1$ false row, where $P=1$ and $Q=0$.</p>" },
  { title: "Unit-test condition coverage", background: "<p>Logic-based tests replace a single happy path with all models of the assumptions.</p>", numbers: "<p>For $KB=\{P,P\rightarrow Q\}$ over $(P,Q)$, the lesson shows $4$ assignments, $1$ satisfying KB model, and that model has $Q=1$.</p>" }
];

(window.ALLML_CONTENT["21.2"] = window.ALLML_CONTENT["21.2"] || {}).applications = [
  { title: "Knowledge-graph rules", background: "<p>Reusable first-order rules avoid copying one propositional statement per entity in a graph.</p>", numbers: "<p>The lesson rule $\forall x\,Bird(x)\rightarrow Wings(x)$ is checked on $3$ objects: Tweety, Opus, and Fido, and all $3$ implication rows are true.</p>" },
  { title: "Family-relation inference", background: "<p>Relational rules infer new facts by matching shared variables across pairs.</p>", numbers: "<p>From Parent(Ann,Bob) and Parent(Bob,Cal), the grandparent rule has $1$ shared middle object, Bob, and derives $1$ Grandparent(Ann,Cal) fact.</p>" },
  { title: "Database integrity checks", background: "<p>Universal constraints over rows are first-order statements evaluated against a chosen domain.</p>", numbers: "<p>In an illustrative employee table with $100$ rows, a universal role constraint requires $100$ quantified checks, one for each row in the fixed domain.</p>" },
  { title: "Security role policies", background: "<p>Role policies use predicates such as Admin(x) to derive permissions without hand-writing each user case.</p>", numbers: "<p>With an illustrative $12$ explicit admins and the rule Admin(x) $\rightarrow$ CanDeploy(x), forward chaining can derive $12$ deploy-permission facts.</p>" },
  { title: "Entity-resolution witnesses", background: "<p>Existential statements are valuable because they name the matched object that makes a claim true.</p>", numbers: "<p>The lesson vector for $Bird(x)\land Flies(x)$ over Tweety, Opus, and Fido is $[1,0,0]$, so there is exactly $1$ witness: Tweety.</p>" }
];

(window.ALLML_CONTENT["21.3"] = window.ALLML_CONTENT["21.3"] || {}).applications = [
  { title: "Product taxonomy inheritance", background: "<p>Taxonomies store reusable properties at parent nodes so children inherit them with an explanation path.</p>", numbers: "<p>The lesson path Tweety $\rightarrow$ Penguin $\rightarrow$ Bird unions $\{wings\}$ and $\{swims\}$, yielding exactly $2$ inherited properties.</p>" },
  { title: "Medical triage explanations", background: "<p>Symbolic triage systems need the chain of rules, not only the final label, so clinicians can audit the conclusion.</p>", numbers: "<p>An illustrative $3$-rule chain can cite all $3$ fired rules as explanation steps from symptoms to recommendation.</p>" },
  { title: "Enterprise data catalogs", background: "<p>Catalog graphs make entity types and relations visible so downstream rules can inspect them.</p>", numbers: "<p>An illustrative schema with $5$ entity types creates a $5$-node representation that can expose missing or incompatible edges.</p>" },
  { title: "Customer-support diagnosis", background: "<p>Defaults plus overrides make exceptions explicit instead of burying them in a final category.</p>", numbers: "<p>The lesson default score gives bird-flies $+1$ and penguin-not-flies $-1$, so $+1-1=0$ and the flying default is blocked.</p>" },
  { title: "Policy-engine audit trails", background: "<p>Access systems benefit from paths that show why a user is allowed or denied.</p>", numbers: "<p>An illustrative $4$-edge policy path gives $4$ cited reasons, which is more auditable than a single opaque allow label.</p>" }
];

(window.ALLML_CONTENT["21.4"] = window.ALLML_CONTENT["21.4"] || {}).applications = [
  { title: "Biomedical ontology classification", background: "<p>Ontology reasoners classify individuals by set containment so search and validation share the same vocabulary.</p>", numbers: "<p>The lesson has Professor $=\{Ada,Cy\}$ and Person $=\{Ada,Bo,Cy\}$, so $2$ professor members are contained in a $3$-person concept.</p>" },
  { title: "Data-quality validation", background: "<p>Disjointness axioms catch impossible dual labels in curated datasets.</p>", numbers: "<p>The lesson computes Cat $\cap$ Dog $=\{Milo\}$, so the required disjoint size $0$ is violated by actual size $1$.</p>" },
  { title: "Semantic search expansion", background: "<p>Subsumption lets a broader query include members of narrower concepts.</p>", numbers: "<p>Because Professor $\sqsubseteq$ Person, the $2$ professor members Ada and Cy are also inferred as person results.</p>" },
  { title: "Access vocabulary governance", background: "<p>Roles represent relationships such as parent-child or member-resource links rather than flat tags.</p>", numbers: "<p>The lesson hasChild role includes $2$ pairs: (Ann,Cal) and (Bob,Dan), giving $2$ inspectable role facts.</p>" },
  { title: "University directory reasoning", background: "<p>Existential role restrictions answer questions such as who has a child in a target concept.</p>", numbers: "<p>With Doctor $=\{Cal\}$ and hasChild containing (Ann,Cal), the lesson computes $\exists hasChild.Doctor=\{Ann\}$, exactly $1$ individual.</p>" }
];

(window.ALLML_CONTENT["21.5"] = window.ALLML_CONTENT["21.5"] || {}).applications = [
  { title: "Enterprise knowledge graphs", background: "<p>RDF stores every fact as the same subject-predicate-object shape so tools can share graph data.</p>", numbers: "<p>The lesson records $2$ Ada facts, so Ada contributes exactly $2$ graph edges.</p>" },
  { title: "Linked open data joins", background: "<p>SPARQL-style pattern matching binds variables across triples from different sources.</p>", numbers: "<p>The lesson pattern ?x worksAt Uni returns $2$ bindings: Ada and Cy.</p>" },
  { title: "Metadata catalogs", background: "<p>Type triples and relation triples use one uniform format, making inference easy to layer on top.</p>", numbers: "<p>The lesson has $2$ Professor type triples; with Professor $\sqsubseteq$ Person, it infers $2$ Person type triples.</p>" },
  { title: "Semantic search filters", background: "<p>Multi-pattern queries filter graph results by both type and relationship.</p>", numbers: "<p>Joining Professor with worksAt Uni keeps Ada and Cy, so the lesson joined result count is again $2$.</p>" },
  { title: "Cross-system integration", background: "<p>A shared triple model reduces custom translators between systems that need to exchange metadata.</p>", numbers: "<p>Illustratively, $3$ systems can use one triple format instead of $\binom{3}{2}=3$ pairwise translators.</p>" }
];

(window.ALLML_CONTENT["21.6"] = window.ALLML_CONTENT["21.6"] || {}).applications = [
  { title: "Clinical triage rules", background: "<p>Expert systems keep the diagnosis chain inspectable by firing explicit rules from symptoms.</p>", numbers: "<p>The lesson starts with $2$ facts, fever and cough, then adds flu, rest, and hydrate, so the fact count grows $2\rightarrow3\rightarrow4\rightarrow5$.</p>" },
  { title: "Fraud-review policy", background: "<p>Fraud systems use rules because investigators need the exact audit path behind a decision.</p>", numbers: "<p>An illustrative review with $4$ fired rules can provide a $4$-step explanation trail instead of an opaque risk label.</p>" },
  { title: "Customer-support routing", background: "<p>Support routers map observed symptoms to teams and recommendations through transparent if-then rules.</p>", numbers: "<p>With an illustrative $3$ input facts, a small router can trigger $2$ recommendations when both rule antecedents are subsets of the fact set.</p>" },
  { title: "Industrial alarms", background: "<p>Factories separate sensor facts from the rule engine so priorities and exceptions are maintainable.</p>", numbers: "<p>An illustrative alarm board with $5$ sensor facts tested against $8$ rules performs $8$ antecedent checks per forward-chaining pass.</p>" },
  { title: "Credit and policy eligibility", background: "<p>Certainty factors attach approximate confidence to otherwise symbolic rules.</p>", numbers: "<p>The lesson computes $min(0.8,0.7)\times0.9=0.7\times0.9=0.63$ for the derived diagnosis.</p>" }
];

(window.ALLML_CONTENT["21.7"] = window.ALLML_CONTENT["21.7"] || {}).applications = [
  { title: "Shift scheduling", background: "<p>ASP describes valid schedules as possible worlds, then keeps the worlds satisfying choice and exclusion constraints.</p>", numbers: "<p>The lesson atoms $\{a,b\}$ produce $4$ possible subsets, and the choice rule keeps $2$ stable choices: $\{a\}$ and $\{b\}$.</p>" },
  { title: "Product configuration", background: "<p>Configurators generate candidate option sets and reject combinations that violate constraints.</p>", numbers: "<p>With an illustrative $5$ binary options, the generator starts from $2^5=32$ candidate worlds before pruning invalid configurations.</p>" },
  { title: "Route and planning constraints", background: "<p>Stable models require support, so selected atoms must be justified by rules whose bodies hold.</p>", numbers: "<p>The lesson rejects $\{see\}$ when light is absent, because the selected atom has $0$ valid supporting rule bodies.</p>" },
  { title: "Assignment optimization", background: "<p>ASP can choose among stable worlds using costs after logical validity is established.</p>", numbers: "<p>The lesson compares costs $cost(\{a\})=2$ and $cost(\{b\})=1$, so $\{b\}$ wins by $1$ cost unit.</p>" },
  { title: "Data-cleaning repair sets", background: "<p>Negation-as-failure lets repair candidates be selected only when blockers are not derivable.</p>", numbers: "<p>With an illustrative $3$ possible repairs, a repair-set program may examine up to $2^3=8$ subsets before constraints prune them.</p>" }
];

/* ---- _apps-part21-B.js ---- */
(window.ALLML_CONTENT["21.8"] = window.ALLML_CONTENT["21.8"] || {}).applications = [
  { title: "Hardware verification", background: "<p>Boolean requirements from circuit blocks become CNF clauses so a solver can find a counterexample or prove none exists.</p>", numbers: "<p>The lesson formula has 3 Boolean variables, so brute force inspects $2^3=8$ assignments; exactly 4 satisfy $(A\\lor B)\\land(\\neg A\\lor C)$.</p>" },
  { title: "Package dependency solving", background: "<p>Installers encode required packages, alternatives, and incompatible versions as clauses before searching configurations.</p>", numbers: "<p>Illustratively, 6 binary package choices create $2^6=64$ raw install worlds before unit clauses and conflicts prune them.</p>" },
  { title: "Test-case generation", background: "<p>SAT can generate feature combinations that hit a desired branch while respecting impossible combinations.</p>", numbers: "<p>For the lesson CNF, the satisfying-test pool is 4 rows out of 8, so half the naive assignments are valid test cases.</p>" },
  { title: "Planning encodings", background: "<p>Classical planning often turns action-at-time decisions into Boolean variables and action constraints into clauses.</p>", numbers: "<p>Illustratively, 3 actions over 4 time steps produce $3\\times4=12$ Boolean decision variables before constraints are added.</p>" },
  { title: "Configuration checking", background: "<p>Product configurators expose forced decisions as unit clauses so propagation explains why an option becomes mandatory.</p>", numbers: "<p>The unit clause $(A)$ forces $A=1$; substituting it turns $(\\neg A\\lor C)$ into unit $(C)$, so $C=1$ is forced too.</p>" }
];

(window.ALLML_CONTENT["21.9"] = window.ALLML_CONTENT["21.9"] || {}).applications = [
  { title: "Symbolic execution", background: "<p>Program paths mix Boolean branch choices with numeric path conditions, so SMT checks both at once.</p>", numbers: "<p>The lesson accepts $x\\ge2$ and $x\\le5$ because they define the nonempty interval $[2,5]$.</p>" },
  { title: "Program verification", background: "<p>Verification tools use SMT to reject impossible branches and prove simple safety properties over arithmetic states.</p>", numbers: "<p>The branch $x\\ge4$ and $x\\le1$ is infeasible because the lower bound 4 is greater than the upper bound 1.</p>" },
  { title: "Configuration with numeric limits", background: "<p>Feature flags may be Boolean, but budgets, capacities, and limits are numeric theory constraints.</p>", numbers: "<p>Illustratively, 4 features give $2^4=16$ Boolean choices, and each surviving choice still needs budget feasibility checking.</p>" },
  { title: "Scheduling with time windows", background: "<p>SMT can combine Boolean choices of windows with interval constraints for start and end times.</p>", numbers: "<p>Illustratively, 3 tasks with 2 window choices each yield $2^3=8$ Boolean combinations before interval checks.</p>" },
  { title: "Safety invariants", background: "<p>The theory solver can infer that one numeric condition implies another, reducing needless Boolean search.</p>", numbers: "<p>Every $x$ in $[2,5]$ satisfies $x\\le6$, so the atom $x\\le6$ is theory-implied by the lesson interval.</p>" }
];

(window.ALLML_CONTENT["21.10"] = window.ALLML_CONTENT["21.10"] || {}).applications = [
  { title: "Formal verification", background: "<p>Resolution proves a safety goal by adding the negated goal and deriving contradiction.</p>", numbers: "<p>The lesson proof ends with the empty clause, which has 0 literals, so the negated goal is impossible.</p>" },
  { title: "Proof assistants and checkers", background: "<p>Each resolution step is a small certificate that can be audited independently.</p>", numbers: "<p>The tiny lesson trace records active sizes $3\\to2\\to1\\to0$, ending at the empty clause.</p>" },
  { title: "Legal and compliance reasoning", background: "<p>Rules and a denied conclusion can expose exactly which assumptions create a contradiction.</p>", numbers: "<p>Illustratively, 5 clauses can produce a 5-step proof trail, with every derived clause storing its two parents.</p>" },
  { title: "Math knowledge bases", background: "<p>Resolution cancels complementary literals to derive new facts from stored clauses.</p>", numbers: "<p>The lesson resolves $(P\\lor Q)$ with $(\\neg P\\lor R)$ and cancels $P$, yielding $(Q\\lor R)$.</p>" },
  { title: "Security protocol analysis", background: "<p>Protocol invariants can be encoded as clauses, then forbidden states are tested by contradiction.</p>", numbers: "<p>The rule $P\\to Q$ is rewritten as $\\neg P\\lor Q$ before proving $Q$ from $(P)$ and the negated goal $(\\neg Q)$.</p>" }
];

(window.ALLML_CONTENT["21.11"] = window.ALLML_CONTENT["21.11"] || {}).applications = [
  { title: "Customer-support incident reuse", background: "<p>Support systems retrieve a similar prior ticket, explain the match, and adapt the old fix.</p>", numbers: "<p>For query $(2.2,2.0)$ and case $(2,2)$, distance is $\\sqrt{0.2^2+0^2}=0.2$.</p>" },
  { title: "Medical precedent support", background: "<p>Clinicians can inspect nearest historical cases rather than accepting an opaque label.</p>", numbers: "<p>Illustratively, 5 patient features create a 5-dimensional distance sum $\\sum_{j=1}^5 w_j(x_j-q_j)^2$.</p>" },
  { title: "Legal analogical reasoning", background: "<p>Legal precedent ranking depends on which factual dimensions receive more weight.</p>", numbers: "<p>With lesson weights $(3,1)$, the same nearest case has distance $\\sqrt{3\\cdot0.2^2}=0.346$.</p>" },
  { title: "Equipment maintenance", background: "<p>A repair plan can be adapted by how much the new measurement differs from the old case.</p>", numbers: "<p>The lesson adapts old solution 10 with slope 2 and feature change 1, giving $10+2\\cdot1=12$.</p>" },
  { title: "Recommendation memory", background: "<p>After feedback, the corrected case is retained so future retrieval improves near the weak region.</p>", numbers: "<p>If the actual value is 11.5, the revision error is $|12-11.5|=0.5$.</p>" }
];

(window.ALLML_CONTENT["21.12"] = window.ALLML_CONTENT["21.12"] || {}).applications = [
  { title: "HVAC controllers", background: "<p>Fuzzy controllers avoid brittle warm versus cold thresholds by using graded memberships.</p>", numbers: "<p>The lesson smooth controller $5+2\\tanh(e)$ stays about 3.07 to 6.93 for $e\\in[-2,2]$.</p>" },
  { title: "Risk scoring", background: "<p>Partial rule firing lets a risk label contribute without becoming an all-or-nothing decision.</p>", numbers: "<p>A rule strength of 0.6 clips its consequent so the maximum output membership is 0.6.</p>" },
  { title: "Camera autofocus control", background: "<p>Focus and motion labels can combine smoothly when measurements are ambiguous.</p>", numbers: "<p>The lesson fuzzy AND of 0.7 and 0.4 is $\\min(0.7,0.4)=0.4$.</p>" },
  { title: "Search ranking labels", background: "<p>Graded labels such as relevant or recent can combine without forcing a crisp cutoff.</p>", numbers: "<p>The lesson fuzzy OR of 0.7 and 0.4 is $\\max(0.7,0.4)=0.7$.</p>" },
  { title: "Appliance and vehicle control", background: "<p>Multiple fuzzy recommendations are defuzzified into one actuator command.</p>", numbers: "<p>A symmetric triangular output centered at 6 has centroid 6.00, so the crisp action is 6.00.</p>" }
];

(window.ALLML_CONTENT["21.13"] = window.ALLML_CONTENT["21.13"] || {}).applications = [
  { title: "Exam timetabling", background: "<p>Exams are variables, time slots are domains, and shared-student conflicts become inequality constraints.</p>", numbers: "<p>The lesson triangle map has 3 variables and 3 inequality constraints, one per edge.</p>" },
  { title: "Map coloring", background: "<p>Adjacent regions must receive different colors, making the constraint graph visible.</p>", numbers: "<p>With 3 colors and 3 variables there are $3^3=27$ assignments, and all-different leaves $3\\times2\\times1=6$ valid colorings.</p>" },
  { title: "Product configuration", background: "<p>Finite option domains and compatibility rules make configuration a CSP rather than a flat checklist.</p>", numbers: "<p>Illustratively, 5 variables with 3 values each create $3^5=243$ raw assignments before constraints prune them.</p>" },
  { title: "Staff scheduling", background: "<p>Backtracking rejects doomed partial schedules before completing every employee assignment.</p>", numbers: "<p>The lesson backtracking run visits 16 nodes, far less than blind checking every full partial expansion.</p>" },
  { title: "Resource allocation", background: "<p>Forward checking shrinks neighbor domains as soon as a resource choice is made.</p>", numbers: "<p>Assigning $A=R$ shrinks neighbors $B$ and $C$ from 3 colors to 2 each.</p>" }
];

