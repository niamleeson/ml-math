module.exports = {
  "math-16-01": {
    connectionsProse: "<p>This lesson begins with the simplest kind of formal statement: a sentence that is either true or false. It builds on ordinary yes-or-no reasoning, but makes the rules precise enough that every case can be checked. Truth tables are the bridge from informal logic to later work with equivalence, normal forms, proof systems, and SAT solvers. The main habit is finite exhaustion: when there are only finitely many truth assignments, a careful table can settle the question completely.</p>",
    motivation: "<p>Propositional logic studies how the truth of a compound statement depends on the truth of its atomic parts. The atoms, such as $P$ and $Q$, are not opened up internally; each is treated only as true or false. Connectives such as and, or, not, and implication then combine those truth values according to fixed rules.</p>" +
                "<p>A truth table is the finite checklist that evaluates every possible assignment once. If a formula uses $n$ independent atomic propositions, each atom contributes two choices, so the table has $2^n$ rows. This makes truth tables useful for proving tautologies, finding counterexamples, and checking Boolean conditions in programs or circuits.</p>",
    definition: "<p>Propositional logic treats each atomic proposition as having one of two truth values, and a truth table evaluates a compound formula under every assignment.</p>" +
                "<p>For $n$ independent atoms, the truth table has $$2^n$$ rows.</p>" +
                "<p><b>Assumptions that matter:</b> atomic propositions are independent truth choices unless a formula states a relationship; truth values are exactly $T$ and $F$; implication uses the standard truth-table convention in which a false antecedent makes $A\\to B$ true.</p>",
    symbols: [
      { sym: "$P,Q$", desc: "atomic propositions" },
      { sym: "$\\land$", desc: "and" },
      { sym: "$\\lor$", desc: "inclusive or" },
      { sym: "$\\neg$", desc: "not" },
      { sym: "$\\to$", desc: "implication" },
      { sym: "$2^n$", desc: "row count for $n$ atoms" }
    ],
    derivation: [
      { do: "One atomic proposition has two possible truth values, $T$ and $F$.", result: "$2$ choices", why: "the system is two-valued" },
      { do: "For two independent propositions, pair each value of $P$ with two values of $Q$.", result: "$2\\cdot2=4$ rows", why: "multiplication counts independent choices" },
      { do: "For $n$ atomic propositions, repeat the same choice $n$ times.", result: "$2^n$ rows", why: "each atom contributes a factor of $2$" },
      { do: "For $(P\\land Q)\\to P$, list the four rows for $P,Q$.", result: "$2^2=4$ cases", why: "this exhausts all assignments" },
      { do: "Evaluate $P\\land Q$.", result: "true only when $P=T,Q=T$", why: "conjunction requires both parts" },
      { do: "Check the demanding row.", result: "$P$ is true when $P\\land Q$ is true", why: "the conclusion holds in the only true-antecedent case" },
      { do: "Check the other three rows.", result: "$P\\land Q$ is false", why: "a false antecedent makes $A\\to B$ true in propositional logic" },
      { do: "Combine the row checks.", result: "$(P\\land Q)\\to P$ is a tautology", why: "every row evaluates to true" }
    ],
    applications: [
      { title: "Feature flags", background: "$A\\land B$ is true in", numbers: "$1$ of $4$ two-flag rows." },
      { title: "Database filter", background: "$P=T,Q=F$ makes", numbers: "$P\\land Q=F$." },
      { title: "Circuit gate", background: "inputs $1,0$ give", numbers: "AND $0$ and OR $1$." },
      { title: "Unit checks", background: "$C=T,L=F$ makes", numbers: "$C\\land L=F$." },
      { title: "Safety filter", background: "$S\\land\\neg E$ with $S=T,E=F$ gives", numbers: "$T$." },
      { title: "Search predicate", background: "$(T\\lor A)\\land Y$ with $T=F,A=T,Y=T$ evaluates to", numbers: "$T$." }
    ]
  },

  "math-16-02": {
    connectionsProse: "<p>This lesson uses truth tables from the previous lesson to compare whole formulas rather than single rows. Once a formula can be evaluated under every truth assignment, two formulas can be checked for having the same behavior in all cases. Logical equivalence is the rule that makes algebra-like simplification possible in logic. It prepares the ground for normal forms, query rewrites, compiler simplification, and proof transformations.</p>",
    motivation: "<p>Logical equivalence permits a formula to be replaced by another formula with the same truth value in every row. The formulas may look different, but if their truth tables agree everywhere, no logical context can distinguish them. This is the logic version of simplifying an expression without changing its value.</p>" +
                "<p>The most useful equivalences are small reusable patterns. Rewriting $P\\to Q$ as $\\neg P\\lor Q$ removes implication and exposes the one failure case directly. De Morgan's laws move negation across and/or structure, which is why they appear in database filters, set complements, and program conditions.</p>",
    definition: "<p>Two formulas are logically equivalent when they have the same truth value under every truth assignment.</p>" +
                "<p>$$A\\equiv B \\quad\\text{means } A \\text{ and } B \\text{ have the same truth value in every row.}$$</p>" +
                "<p><b>Assumptions that matter:</b> equivalence is semantic agreement across all truth assignments; replacing a formula by an equivalent one preserves truth in any larger propositional formula; implication and negation use the standard two-valued truth rules.</p>",
    symbols: [
      { sym: "$A\\equiv B$", desc: "same truth table" },
      { sym: "$A\\leftrightarrow B$", desc: "biconditional" },
      { sym: "tautology", desc: "a formula true in every row" },
      { sym: "$\\neg,\\land,\\lor,\\to$", desc: "truth connectives" }
    ],
    derivation: [
      { do: "Build the four rows for $P,Q$.", result: "$2^2=4$ cases", why: "two atoms require four assignments" },
      { do: "Evaluate $P\\to Q$.", result: "false only when $P=T$ and $Q=F$", why: "implication fails only when a true promise has a false result" },
      { do: "Evaluate $\\neg P\\lor Q$.", result: "false only when $\\neg P=F$ and $Q=F$", why: "an or is false only when both disjuncts are false" },
      { do: "Translate $\\neg P=F$.", result: "$P=T$", why: "negation reverses truth" },
      { do: "Compare false rows.", result: "$\\neg P\\lor Q$ is false exactly when $P=T,Q=F$", why: "this is the same single row as $P\\to Q$" },
      { do: "Combine the row comparison.", result: "$P\\to Q\\equiv\\neg P\\lor Q$", why: "the formulas agree on the false row and are true on the other three rows" },
      { do: "Evaluate $\\neg(P\\land Q)$.", result: "true exactly when not both $P$ and $Q$ are true", why: "it rejects only the $T,T$ row" },
      { do: "Evaluate $\\neg P\\lor\\neg Q$.", result: "true exactly when at least one of $P,Q$ is false", why: "it also rejects only the $T,T$ row" },
      { do: "Compare the De Morgan rows.", result: "$\\neg(P\\land Q)\\equiv\\neg P\\lor\\neg Q$", why: "both formulas have the same truth value in every row" }
    ],
    applications: [
      { title: "Compiler simplification", background: "$(P\\land T)\\lor F\\equiv P$, so", numbers: "one flag replaces three connectives." },
      { title: "Query rewrite", background: "$\\neg(A\\land B)$ becomes", numbers: "$\\neg A\\lor\\neg B$." },
      { title: "Exhaustive Boolean tests", background: "two flags require", numbers: "$4$ rows." },
      { title: "Set complement", background: "universe size $20$ and $|A\\cap B|=6$ gives complement size", numbers: "$14$." },
      { title: "Safety rule", background: "$\\neg(O\\land H)$ allows", numbers: "$3$ of $4$ rows." },
      { title: "Validation failure", background: "failure of $R\\to C$ is", numbers: "$R\\land\\neg C$." }
    ]
  },

  "math-16-03": {
    connectionsProse: "<p>This lesson builds directly on logical equivalence. If equivalent formulas can replace each other, then a formula can be reshaped without changing the truth conditions it represents. Normal forms are standard target shapes for that reshaping. They are especially important in automated reasoning because tools such as SAT solvers work best when formulas arrive in a predictable structure.</p>",
    motivation: "<p>Normal forms put logical formulas into a standard shape. CNF is an and of clauses, where each clause is an or of literals. DNF is an or of cases, where each case is an and of literals that describes one way for the formula to be true.</p>" +
                "<p>The standard shape matters because it separates meaning from presentation. A policy, circuit, or rule may be written in a convenient human form, but a solver often needs clauses. Rewriting with equivalences lets us keep the same truth table while turning the formula into a form that an algorithm can process systematically.</p>",
    definition: "<p>CNF is an and of clauses, each clause being an or of literals. DNF is an or of terms, each term being an and of literals.</p>" +
                "<p>$$\\text{CNF}=(\\ell_{11}\\lor\\cdots\\lor\\ell_{1k})\\land\\cdots\\land(\\ell_{m1}\\lor\\cdots\\lor\\ell_{mr}).$$</p>" +
                "<p>$$\\text{DNF}=(\\ell_{11}\\land\\cdots\\land\\ell_{1k})\\lor\\cdots\\lor(\\ell_{m1}\\land\\cdots\\land\\ell_{mr}).$$</p>" +
                "<p><b>Assumptions that matter:</b> normal-form conversion preserves truth by using logical equivalences; a literal is not simplified further except by removing double negations when present; clause counts and literal occurrences describe the written converted formula.</p>",
    symbols: [
      { sym: "Literal", desc: "an atom or negated atom" },
      { sym: "clause", desc: "or of literals" },
      { sym: "CNF", desc: "and of clauses" },
      { sym: "DNF", desc: "or of and-terms" },
      { sym: "$P,Q,R$", desc: "atoms" }
    ],
    derivation: [
      { do: "Start with $P\\to(Q\\land R)$.", result: "$P\\to(Q\\land R)$", why: "this is the original formula" },
      { do: "Replace implication.", result: "$P\\to X\\equiv\\neg P\\lor X$", why: "use the equivalence from `math-16-02`" },
      { do: "Substitute $X=Q\\land R$.", result: "$\\neg P\\lor(Q\\land R)$", why: "the implication is gone" },
      { do: "Distribute or over and.", result: "$A\\lor(B\\land C)\\equiv(A\\lor B)\\land(A\\lor C)$", why: "this creates clauses" },
      { do: "Use $A=\\neg P$, $B=Q$, $C=R$.", result: "$(\\neg P\\lor Q)\\land(\\neg P\\lor R)$", why: "the distributed formula has two clauses" },
      { do: "Identify the shape.", result: "an and of clauses", why: "each parenthesized part is a clause, so this is CNF" },
      { do: "Check the size.", result: "$2$ clauses and $4$ literal occurrences", why: "each clause contains two literals" }
    ],
    applications: [
      { title: "SAT input", background: "$(P\\lor Q)\\land(\\neg P\\lor R)$ has", numbers: "$2$ clauses and $4$ literal occurrences." },
      { title: "Rule audit", background: "a $5$-clause CNF fails when", numbers: "clause $3$ is false." },
      { title: "Truth-table synthesis", background: "a three-atom function true on $2$ rows gives", numbers: "$2$ DNF terms of $3$ literals each." },
      { title: "Circuit design", background: "a DNF with $3$ two-literal terms uses", numbers: "$3$ AND gates feeding one OR gate." },
      { title: "Access policy", background: "$Admin\\lor(Employee\\land MFA)$ accepts employee-with-MFA even when", numbers: "admin is false." },
      { title: "Feature-cross explanation", background: "a two-case DNF has exactly", numbers: "$2$ sufficient rule paths." }
    ]
  },

  "math-16-04": {
    connectionsProse: "<p>This lesson extends propositional logic by opening up the atoms. Instead of treating a statement as a sealed symbol like $P$, predicate logic lets the statement mention objects, properties, and relationships. That extra structure is needed for mathematics, databases, graphs, type systems, and program specifications. Later lessons on quantifiers and semantics depend on this language.</p>",
    motivation: "<p>Predicate logic opens atomic statements so they can mention objects, properties, and relationships. A predicate such as $P(x)$ can be true for some objects and false for others, while a relation such as $R(x,y)$ can describe a connection between two objects. The truth of the statement now depends not only on the formula, but also on which objects the variables name.</p>" +
                "<p>This is the language needed for claims about users, graph nodes, array indices, types, and mathematical structures. It lets a formula say that a user has a field, one node points to another, or one index is less than another. The lesson is explanation-first because the main goal is to learn the syntax and how to evaluate concrete examples in a chosen domain.</p>",
    definition: "<p>Predicate logic extends propositional logic with predicates, relations, variables, and a domain of objects over which formulas are interpreted.</p>" +
                "<p><b>Assumptions that matter:</b> a predicate is interpreted over a specified domain; free variables need an assignment before a formula has a truth value; bound variables receive their meaning from the quantifier that controls them.</p>",
    symbols: [
      { sym: "$P(x)$", desc: "predicate with one input" },
      { sym: "$R(x,y)$", desc: "relation with two inputs" },
      { sym: "domain $D$", desc: "set of objects" },
      { sym: "free variable", desc: "a variable not bound by a quantifier" },
      { sym: "bound variable", desc: "a variable controlled by $\\forall$ or $\\exists$" }
    ],
    applications: [
      { title: "Knowledge graph", background: "$R(Alice,Company)=T$ and $R(Bob,Company)=F$ distinguish", numbers: "$2$ objects." },
      { title: "Database table", background: "`Enrolled(student, course)` with $1{,}200$ rows stores", numbers: "$1{,}200$ true pairs." },
      { title: "Sorted array spec", background: "length $n$ uses predicates over index pairs", numbers: "$0\\le i<j<n$." },
      { title: "Type system", background: "two facts, $HasField(User,email)$ and $HasField(User,age)$, justify", numbers: "two safe field accesses." },
      { title: "Fairness constraint", background: "$4$ groups require", numbers: "$4$ checks of $e_g\\le0.05$." },
      { title: "Graph edge relation", background: "$5$ nodes give", numbers: "$5\\cdot5=25$ possible directed edge facts." }
    ]
  },

  "math-16-05": {
    connectionsProse: "<p>This lesson builds on predicate logic by adding the words that control variables. Predicates can say that an object has a property; quantifiers say whether all objects have it or at least one object has it. This is the step from evaluating individual facts to stating general conditions. It supports invariants, database existence checks, optimization witnesses, and mathematical proof patterns.</p>",
    motivation: "<p>Quantifiers make the words every and some precise. A universal statement $\\forall x$ must survive every allowed value of $x$, so one counterexample is enough to make it false. An existential statement $\\exists x$ needs at least one successful value, called a witness.</p>" +
                "<p>Quantifier order is part of the meaning. In $\\forall x\\exists y$, the choice of $y$ may depend on the earlier value of $x$. In $\\exists y\\forall x$, one shared $y$ must work for all $x$. The same predicate can therefore express very different claims when the quantifiers are rearranged.</p>",
    definition: "<p>The universal quantifier $\\forall$ requires every object in the domain to satisfy the formula, while the existential quantifier $\\exists$ requires at least one witness.</p>" +
                "<p><b>Assumptions that matter:</b> quantifiers range only over the stated domain; a universal statement fails if any domain element fails; an existential statement succeeds when a valid witness is found; later existential witnesses may depend on earlier universal choices.</p>",
    symbols: [
      { sym: "$\\forall$", desc: "for every" },
      { sym: "$\\exists$", desc: "there exists" },
      { sym: "$D$", desc: "domain" },
      { sym: "witness", desc: "a concrete object proving an existential statement" },
      { sym: "bound variable", desc: "a variable governed by a quantifier" }
    ],
    derivation: [
      { do: "For $\\forall x\\exists y\\,R(x,y)$, test each $x\\in D$.", result: "all $x$ values must be checked", why: "universal quantification requires every domain value" },
      { do: "Set $x=1$.", result: "choose $y=2$", why: "$1<2$ is true" },
      { do: "Set $x=2$.", result: "choose $y=3$", why: "$2<3$ is true" },
      { do: "Set $x=3$.", result: "no $y\\in\\{1,2,3\\}$ satisfies $3<y$", why: "the largest element has no larger witness" },
      { do: "Conclude for $\\forall x\\exists y\\,R(x,y)$.", result: "false", why: "one failed universal case is enough" },
      { do: "For $\\exists y\\forall x\\,R(x,y)$, look for one shared $y$.", result: "one candidate must work for all $x$", why: "the existential comes before the universal" },
      { do: "Test shared values.", result: "$y=1$ fails at $x=1$, $y=2$ fails at $x=2$, and $y=3$ fails at $x=3$", why: "$x<y$ is false when $x=y$" },
      { do: "Conclude for $\\exists y\\forall x\\,R(x,y)$.", result: "false", why: "no single element is larger than every element of $D$" },
      { do: "Compare the two statements.", result: "quantifier order changes meaning", why: "witnesses may depend on earlier variables only when the existential comes later" }
    ],
    applications: [
      { title: "Invariant checking", background: "$6$ reachable states all safe supports", numbers: "$\\forall s\\,Safe(s)$." },
      { title: "SQL EXISTS", background: "order $104$ with $3$ line items makes", numbers: "$\\exists r\\,LineItem(r,104)$ true." },
      { title: "Fairness audit", background: "across $5$ groups, one gap $0.08>0.05$ proves", numbers: "$\\exists g\\,Violation(g)$." },
      { title: "Optimization", background: "losses $[3,1,4]$ give", numbers: "index $2$ as a minimizer witness." },
      { title: "API contract", background: "$100$ returned ids require", numbers: "$100$ positivity checks for a universal promise." },
      { title: "Reachability", background: "$4$ nodes require", numbers: "$4\\cdot4=16$ ordered-pair checks for all-pairs reachability." }
    ]
  },

  "math-16-06": {
    connectionsProse: "<p>This lesson follows predicate logic and quantifiers by explaining what makes their formulas true. Syntax tells us which strings are well formed, but semantics supplies the world where those strings are evaluated. The same formula can be true in one structure and false in another. This distinction is central for model checking, databases, knowledge bases, and proof theory.</p>",
    motivation: "<p>Formal semantics supplies the world in which a formula is true or false. It fixes the domain, the meanings of names and relations, and the recursive truth rules for compound formulas. A structure tells us what objects exist and which atomic facts hold among them.</p>" +
                "<p>Once the atomic facts are interpreted, larger formulas are evaluated by their logical shape. Negation flips truth, conjunction requires both parts, and quantifiers inspect the domain. The notation $\\mathcal M\\models\\varphi$ records that the structure $\\mathcal M$ satisfies the formula $\\varphi$.</p>",
    definition: "<p>Formal semantics defines satisfaction by interpreting formulas inside a structure with a domain, meanings for symbols, and truth rules for logical connectives and quantifiers.</p>" +
                "<p>$$\\mathcal M\\models\\varphi$$</p>" +
                "<p><b>Assumptions that matter:</b> a formula with free variables needs an assignment; quantifiers range over the model's domain; semantic consequence means every model satisfying the premises also satisfies the conclusion.</p>",
    symbols: [
      { sym: "$\\mathcal M$", desc: "structure/model" },
      { sym: "$D$", desc: "domain" },
      { sym: "$\\models$", desc: "satisfies" },
      { sym: "assignment", desc: "a choice of values for free variables" },
      { sym: "$\\Gamma\\models\\varphi$", desc: "semantic consequence" }
    ],
    applications: [
      { title: "Model checking", background: "$8$ states require", numbers: "$8$ checks for $\\forall s\\,Safe(s)$." },
      { title: "Database semantics", background: "a relation with $5{,}000$ tuples makes exactly", numbers: "those $5{,}000$ atomic facts true." },
      { title: "Knowledge-base reasoning", background: "two true premises $Parent(A,B)$ and $Parent(A,B)\\to Ancestor(A,B)$ force", numbers: "the conclusion in every model." },
      { title: "Graph triangle", background: "$6$ nodes give", numbers: "$6^3=216$ ordered triples to check naively." },
      { title: "Heap predicate", background: "$20$ allocated addresses give", numbers: "$20$ possible objects for $Alloc(x)$." },
      { title: "ML constraint slice", background: "$300$ examples require", numbers: "$300$ score checks for $\\forall x\\,Score(x)\\le0.9$." }
    ]
  },

  "math-16-07": {
    connectionsProse: "<p>This lesson moves from truth in models to proof on the page. Earlier lessons showed how formulas are evaluated; natural deduction shows how conclusions are derived by justified steps. The rules are designed to resemble ordinary mathematical reasoning while remaining formal enough to check. This makes the lesson a bridge to proof assistants, type systems, and soundness.</p>",
    motivation: "<p>Natural deduction treats proof as a sequence of small justified moves. Each line is either an assumption or follows from earlier lines by an introduction or elimination rule. The proof is not only the final conclusion; it is the checked path that shows why the conclusion follows.</p>" +
                "<p>Temporary assumptions are especially important. To prove an implication, one may assume the antecedent, derive the consequent, and then discharge the assumption. This captures the familiar pattern of proving “if $A$, then $B$” while keeping track of which assumptions are still active.</p>",
    definition: "<p>Natural deduction is a proof system in which conclusions are derived line by line from premises, temporary assumptions, and introduction or elimination rules.</p>" +
                "<p><b>Assumptions that matter:</b> each proof line must be a premise, a temporary assumption, or justified by a rule; discharged assumptions are no longer available outside their subproof; rule names matter because they make the derivation checkable.</p>",
    symbols: [
      { sym: "$\\vdash$", desc: "derivable" },
      { sym: "assumption", desc: "an active line available in a subproof" },
      { sym: "discharge", desc: "closing a temporary assumption" },
      { sym: "$\\land$-elimination", desc: "extracts one conjunct" },
      { sym: "modus ponens", desc: "uses $A$ and $A\\to B$ to infer $B$" }
    ],
    applications: [
      { title: "Proof assistant", background: "a $40$-line proof is accepted only if", numbers: "all $40$ justifications type-check." },
      { title: "Program verification", background: "$P$ and $P\\to Q$ give", numbers: "$Q$ in one modus ponens step." },
      { title: "Type checking", background: "values of types $A$ and $B$ construct", numbers: "one pair of type $A\\land B$." },
      { title: "Security policy", background: "$Admin(u)$ and $Admin(u)\\to CanDeploy(u)$ derive", numbers: "$CanDeploy(u)$." },
      { title: "Proof writing", background: "proving $3$ implications starts and discharges", numbers: "$3$ assumptions." },
      { title: "Automated proving", background: "$12$ intermediate formulas require", numbers: "$12$ rule or premise justifications." }
    ]
  },

  "math-16-08": {
    connectionsProse: "<p>This lesson connects the proof rules from natural deduction with the semantic truth relation from formal semantics. Proof and truth are different kinds of objects: one is syntactic and checkable line by line, while the other ranges over models. Soundness and completeness explain when those two notions line up. They are foundational for theorem provers, proof assistants, and logic-based verification.</p>",
    motivation: "<p>Soundness and completeness connect proofs with truth. Soundness says derivations do not prove semantic falsehoods: if something can be proved from premises, then it is true in every model of those premises. This is the safety guarantee for a proof system.</p>" +
                "<p>Completeness points in the other direction. It says that, for first-order logic, every semantic consequence has a formal proof in a complete proof system. The theorem is deep, but the practical message is clear: proofs are not merely a subset of reasoning chosen for convenience; for first-order validity, the proof system can in principle reach every semantic consequence.</p>",
    definition: "<p>Soundness means formal provability implies semantic consequence, and completeness means semantic consequence implies formal provability for the logic and proof system in question.</p>" +
                "<p>$$\\Gamma\\vdash\\varphi \\Rightarrow \\Gamma\\models\\varphi,\\qquad \\Gamma\\models\\varphi \\Rightarrow \\Gamma\\vdash\\varphi.$$</p>" +
                "<p><b>Assumptions that matter:</b> the soundness argument assumes the inference rules before the current step preserve truth; completeness is stated for first-order logic and a proof system strong enough for that logic; semantic consequence ranges over all models of the premises.</p>",
    symbols: [
      { sym: "$\\Gamma$", desc: "set of premises" },
      { sym: "$\\vdash$", desc: "provability" },
      { sym: "$\\models$", desc: "semantic consequence" },
      { sym: "sound", desc: "$\\vdash$ implies $\\models$" },
      { sym: "complete", desc: "$\\models$ implies $\\vdash$ for the logic" }
    ],
    derivation: [
      { do: "Assume $\\Gamma\\vdash A$ and $\\Gamma\\vdash A\\to B$.", result: "two syntactic derivations from the premises", why: "modus ponens will use these two proved lines" },
      { do: "Apply soundness of already-derived lines to $A$.", result: "every model of $\\Gamma$ satisfies $A$", why: "derivable $A$ is semantically forced" },
      { do: "Apply soundness of already-derived lines to $A\\to B$.", result: "the same models satisfy $A\\to B$", why: "the implication is also semantically forced" },
      { do: "Combine the semantic facts.", result: "$A$ is true and $A\\to B$ is true in any model of $\\Gamma$", why: "both facts hold in the same arbitrary model" },
      { do: "Use the truth table for implication.", result: "$B$ is true", why: "a true implication with true antecedent has true consequent" },
      { do: "Generalize to all models of $\\Gamma$.", result: "$\\Gamma\\models B$", why: "every model of the premises satisfies $B$" },
      { do: "Check the full proof system rule by rule.", result: "soundness of the proof system", why: "each rule must preserve truth" },
      { do: "State completeness for first-order logic.", result: "if $\\Gamma\\models\\varphi$, then $\\Gamma\\vdash\\varphi$ in a complete proof system", why: "this is a theorem, not a short proof" }
    ],
    applications: [
      { title: "Theorem prover", background: "$12$ inference rules require", numbers: "$12$ soundness checks." },
      { title: "SAT solver", background: "$20$ variables give", numbers: "$2^{20}=1{,}048{,}576$ brute-force assignments." },
      { title: "Type soundness", background: "$1{,}000$ well-typed expressions are promised not to violate", numbers: "the type model at runtime." },
      { title: "Counterexample trace", background: "a length-$7$ trace gives", numbers: "$7$ concrete states." },
      { title: "Foundation theorem", background: "$30$ axioms may semantically entail a formula, and completeness promises", numbers: "a finite proof using finitely many." },
      { title: "ML constraints", background: "$10$ Boolean constraints over $8$ flags have", numbers: "$2^8=256$ assignments for complete finite search." }
    ]
  },

  "math-16-09": {
    connectionsProse: "<p>This lesson begins the set-theory half of the section. The earlier logic lessons supplied a language for statements and proofs; set theory supplies a language for collections. Sets appear whenever we talk about datasets, feature subsets, graph neighborhoods, domains, and spaces of possibilities. The vocabulary here supports later lessons on ZFC, relations, cardinality, and infinite sets.</p>",
    motivation: "<p>Naive set theory gives the working vocabulary of membership, subset, union, intersection, difference, and power set. A set is treated as a collection of distinct elements, and the basic operations describe how collections overlap or combine. This language is useful because many mathematical and data objects are collections.</p>" +
                "<p>The word naive signals that the vocabulary is introduced in its everyday working form before adding axiomatic guardrails. Most finite set computations are safe and intuitive. The important warning is that unrestricted comprehension, the idea that every property determines a set, leads to paradoxes and must later be replaced by controlled set-building principles.</p>",
    definition: "<p>Naive set theory is the working language of collections, using membership, subsets, unions, intersections, differences, and power sets before adding axiomatic restrictions.</p>" +
                "<p>$$\\mathcal P(A)=\\{S:S\\subseteq A\\}$$</p>" +
                "<p><b>Assumptions that matter:</b> sets ignore repeated listings and order; subset means every element of the first set is in the second; power sets contain subsets as elements; unrestricted set formation is not allowed in axiomatic set theory.</p>",
    symbols: [
      { sym: "$x\\in A$", desc: "membership" },
      { sym: "$A\\subseteq B$", desc: "subset" },
      { sym: "$A\\cup B$", desc: "union" },
      { sym: "$A\\cap B$", desc: "intersection" },
      { sym: "$A\\setminus B$", desc: "difference" },
      { sym: "$\\mathcal P(A)$", desc: "power set" }
    ],
    applications: [
      { title: "Dataset splits", background: "train $8{,}000$, validation $1{,}000$, and intersection", numbers: "$0$ means no leakage." },
      { title: "Feature subset", background: "choosing $12$ of $50$ features means", numbers: "$|S|=12$ and $S\\subseteq F$." },
      { title: "Search merge", background: "$40+30-10=60$ documents in a union with overlap", numbers: "$10$." },
      { title: "Common neighbors", background: "$\\{1,2,5\\}\\cap\\{2,3,5\\}=\\{2,5\\}$, count", numbers: "$2$." },
      { title: "Access control", background: "$\\{read,write\\}\\subseteq\\{read,write,admin\\}$ is", numbers: "true." },
      { title: "Power-set search", background: "$20$ candidate features give", numbers: "$2^{20}=1{,}048{,}576$ subsets." }
    ]
  },

  "math-16-10": {
    connectionsProse: "<p>This lesson follows naive set vocabulary by explaining why formal guardrails are needed. Everyday set operations are powerful, but unrestricted set-building produces contradictions. ZFC keeps the useful constructions while stating exactly which set-building moves are allowed. It provides the background foundation for later work with products, powersets, cardinality, ordinals, and choice.</p>",
    motivation: "<p>ZFC gives set theory guardrails. It keeps the everyday constructions mathematicians need while blocking unrestricted set-building that leads to paradoxes. Instead of allowing any property to form a set from nothing, axioms such as Separation carve subsets out of sets that already exist.</p>" +
                "<p>The axioms are not proved inside the lesson because they are starting rules for the theory. Their role is to make ordinary constructions precise: Extensionality says sets with the same elements are the same set, Power Set forms all subsets, Replacement maps sets through definable functions, Infinity supplies an infinite set, Foundation controls membership chains, and Choice handles selections from collections of nonempty sets.</p>",
    definition: "<p>ZFC is an axiomatic foundation for set theory that keeps ordinary set constructions while replacing unrestricted comprehension with controlled axioms.</p>" +
                "<p><b>Assumptions that matter:</b> ZFC is treated as a formal axiom system; its axioms license constructions rather than follow from earlier finite set computations; finite examples illustrate the axioms but do not replace the axioms themselves.</p>",
    symbols: [
      { sym: "$\\in$", desc: "membership" },
      { sym: "Extensionality", desc: "same elements imply same set" },
      { sym: "Separation", desc: "carves subsets from an existing set" },
      { sym: "Replacement", desc: "maps a set through a definable function" },
      { sym: "ZFC", desc: "Zermelo-Fraenkel set theory with Choice" }
    ],
    applications: [
      { title: "Natural numbers", background: "$2=\\{0,1\\}$ has exactly", numbers: "$2$ elements in the standard set construction." },
      { title: "Power set", background: "$12$ candidate features give", numbers: "$2^{12}=4{,}096$ subsets." },
      { title: "Products", background: "$|A|=3,|B|=5$ gives", numbers: "$|A\\times B|=15$." },
      { title: "Finite choice", background: "set sizes $2,3,5,7$ give", numbers: "$210$ explicit choice functions." },
      { title: "Data filtering", background: "$230$ rows with loss $>1.5$ are a subset of", numbers: "$10{,}000$ source rows." },
      { title: "Function graph", background: "a function $f:A\\to B$ can be represented as", numbers: "a set of ordered pairs with one pair for each element of $A$." }
    ]
  },

  "math-16-11": {
    connectionsProse: "<p>This lesson uses sets and products to describe structured connections. Once $A\\times B$ is available, a relation can be viewed as a selected subset of ordered pairs. Some relations behave like comparisons, and those become orderings. This prepares for dependency graphs, subset lattices, database relations, and the product-counting ideas used in cardinality.</p>",
    motivation: "<p>A relation selects ordered pairs. Saying $aRb$ means that the pair $(a,b)$ belongs to the relation $R$. The relation may represent equality, divisibility, dependency, graph adjacency, database membership, or many other structured facts.</p>" +
                "<p>A partial order is a relation that behaves like a comparison while allowing some pairs to remain incomparable. Reflexivity says every element compares with itself, antisymmetry prevents two different elements from being mutually below each other, and transitivity lets comparisons chain. Divisibility is a good example because $2$ and $3$ are both below $6$, but neither divides the other.</p>",
    definition: "<p>A relation from $A$ to $B$ is a subset of the Cartesian product $A\\times B$; a partial order is a relation that is reflexive, antisymmetric, and transitive.</p>" +
                "<p>$$R\\subseteq A\\times B, \\qquad aRb \\text{ means } (a,b)\\in R.$$</p>" +
                "<p><b>Assumptions that matter:</b> ordered pairs remember coordinate order; a partial order must satisfy reflexivity, antisymmetry, and transitivity on the stated set; incomparability is allowed in a partial order but not in a total order.</p>",
    symbols: [
      { sym: "$R\\subseteq A\\times B$", desc: "relation" },
      { sym: "$(a,b)$", desc: "ordered pair" },
      { sym: "$aRb$", desc: "shorthand for membership in $R$" },
      { sym: "$\\preceq$", desc: "partial order" },
      { sym: "reflexive, antisymmetric, transitive, total order", desc: "order properties" }
    ],
    derivation: [
      { do: "Define $a\\preceq b$ to mean $a$ divides $b$.", result: "a divisibility relation on $A=\\{1,2,3,6\\}$", why: "this fixes the relation" },
      { do: "Check reflexivity.", result: "each $a$ divides itself because $a=1\\cdot a$", why: "every element relates to itself" },
      { do: "Set up antisymmetry.", result: "if $a$ divides $b$ and $b$ divides $a$, then $b=ka$ and $a=\\ell b$", why: "both numbers are positive in this set" },
      { do: "Substitute to get $a=\\ell k a$.", result: "$1=\\ell k$", why: "divide by $a>0$" },
      { do: "Use positivity of $\\ell,k$.", result: "$\\ell=k=1$, so $a=b$", why: "positive integers multiply to $1$ only in this case" },
      { do: "Set up transitivity.", result: "if $a$ divides $b$ and $b$ divides $c$, then $b=ka$ and $c=\\ell b$", why: "write both divisibility facts" },
      { do: "Substitute $b=ka$ into $c=\\ell b$.", result: "$c=\\ell k a$", why: "so $a$ divides $c$" },
      { do: "Combine the three properties.", result: "divisibility on $A$ is a partial order", why: "reflexive, antisymmetric, and transitive all hold" },
      { do: "List unequal comparable pairs.", result: "$(1,2),(1,3),(1,6),(2,6),(3,6)$", why: "these are the divisibility pairs with different entries" }
    ],
    applications: [
      { title: "Dependency graph", background: "$A\\preceq C$ and $C\\preceq D$ force", numbers: "$A\\preceq D$." },
      { title: "Feature subsets", background: "$\\{age\\}\\subseteq\\{age,clicks\\}$ but", numbers: "$\\{age\\}$ and $\\{clicks\\}$ are incomparable." },
      { title: "Database relation", background: "two rows make", numbers: "a relation of size $2$." },
      { title: "Ranking with ties", background: "A and B both at $0.91$ outrank C at $0.85$, giving", numbers: "$2$ strict comparisons against C." },
      { title: "Static analysis facts", background: "$\\{x>0,y=2\\}$ carries", numbers: "one more fact than $\\{x>0\\}$." },
      { title: "Lattice operations", background: "for $A=\\{1,2\\}$ and $B=\\{2,3\\}$, meet is $\\{2\\}$ and", numbers: "join is $\\{1,2,3\\}$." }
    ]
  },

  "math-16-12": {
    connectionsProse: "<p>This lesson builds on the set vocabulary from the previous lessons: elements, subsets, unions, products, and functions. A finite set can be counted by listing its elements, but the deeper idea is that counting is a kind of matching. When a set has three elements, it can be matched perfectly with the counting set $\\{1,2,3\\}$.</p>" +
                      "<p>That matching idea is the reason cardinality works for both finite and infinite sets. It will let us count product spaces such as labels crossed with devices, compare different data domains, and prepare for the next lesson's surprise that the natural numbers and even numbers have the same size while the real numbers are larger than any list.</p>",
    motivation: "<p>Cardinality is the mathematical word for size, but it is not only a way to attach a number to a small set. The important move is pairing. Two sets have the same size when every element of the first set can be paired with exactly one element of the second, with nothing left over on either side.</p>" +
                "<p>For finite sets, this agrees with ordinary counting. If $A=\\{red,blue,green\\}$ and $B=\\{10,20,30\\}$, the function $red\\mapsto10$, $blue\\mapsto20$, $green\\mapsto30$ is a bijection, so the two sets have the same cardinality. The elements have different meanings, but cardinality ignores the meanings and counts the perfect pairing.</p>" +
                "<p>Products are the first place this becomes especially useful. If $A$ has $m$ choices and $B$ has $n$ choices, then an element of $A\\times B$ is made by choosing one item from $A$ and one item from $B$. For every first choice there are $n$ second choices, and there are $m$ first choices. That is why the product has $mn$ ordered pairs.</p>",
    definition: "<p>Two sets have the same cardinality when there is a bijection between them, and finite product cardinality counts independent first and second choices.</p>" +
                "<p>$$|A|=|B| \\quad\\text{means there is a bijection } f:A\\to B.$$</p>" +
                "<p>$$|A\\times B|=|A|\\,|B|=mn \\quad\\text{when } |A|=m \\text{ and } |B|=n.$$</p>" +
                "<p><b>Assumptions that matter:</b> sets ignore order and duplicate listing; a bijection must cover every target exactly once; the formula $|A\\cup B|=|A|+|B|$ only holds for disjoint sets; and cardinality compares size, not the meaning or value of the elements.</p>",
    symbols: [
      { sym: "$|A|$", desc: "the cardinality, or size, of set $A$" },
      { sym: "$f:A\\to B$", desc: "a function from elements of $A$ to elements of $B$" },
      { sym: "bijection", desc: "one-to-one and onto" },
      { sym: "$A\\times B$", desc: "the set of ordered pairs $(a,b)$ with $a\\in A$ and $b\\in B$" },
      { sym: "$m,n$", desc: "finite cardinalities" },
      { sym: "$\\mathbb N$", desc: "the positive counting numbers in this lesson" },
      { sym: "$E$", desc: "the set of positive even integers" }
    ],
    derivation: [
      { do: "Let $A=\\{a_1,\\ldots,a_m\\}$.", result: "each element of finite set $A$ is listed exactly once", why: "this gives $m$ first-coordinate choices" },
      { do: "Let $B=\\{b_1,\\ldots,b_n\\}$.", result: "each element of finite set $B$ is listed exactly once", why: "this gives $n$ second-coordinate choices" },
      { do: "Fix the first element $a_i$.", result: "$(a_i,b_1),\\ldots,(a_i,b_n)$", why: "the second coordinate can be any of the $n$ elements of $B$" },
      { do: "Count pairs with first coordinate $a_i$.", result: "$n$ ordered pairs", why: "the first coordinate is held constant while the second coordinate varies" },
      { do: "Count possible first coordinates.", result: "$m$ choices $a_i$", why: "the list for $A$ has $m$ entries" },
      { do: "Check overlap of the $m$ groups.", result: "the groups do not overlap", why: "a pair with first coordinate $a_i$ cannot also have first coordinate $a_j$ when $i\\ne j$" },
      { do: "Add the disjoint group sizes.", result: "$n+n+\\cdots+n$ with $m$ copies equals $mn$", why: "this counts every ordered pair once" },
      { do: "State the product rule.", result: "$|A\\times B|=mn$", why: "ordered pairs are counted by first choices and second choices" },
      { do: "Define $f:\\mathbb N\\to E$ by $f(k)=2k$, where $E=\\{2,4,6,\\ldots\\}$.", result: "every natural number is paired with one even number", why: "this is the candidate bijection" },
      { do: "Check one-to-one.", result: "$2k=2\\ell$ implies $k=\\ell$", why: "no two natural numbers land on the same even number" },
      { do: "Check onto.", result: "every positive even number has the form $2k$ for some $k\\in\\mathbb N$", why: "no even number is missed" },
      { do: "Conclude the countability example.", result: "$|\\mathbb N|=|E|$", why: "an infinite proper subset can have the same cardinality as the whole set" }
    ],
    applications: [
      { title: "Dataset union", background: "If training has $12{,}000$ rows and validation has $3{,}000$ disjoint rows, the union has", numbers: "$15{,}000$ rows because disjoint cardinalities add." },
      { title: "Embedding table size", background: "A tokenizer with ids $0$ through $49{,}999$ has $50{,}000$ tokens; with dimension $768$, the embedding table has", numbers: "$50{,}000\\cdot768=38{,}400{,}000$ weights." },
      { title: "One-hot labels", background: "With $7$ classes, there are", numbers: "$7$ valid one-hot target vectors of length $7$, not $2^7$, because the valid set requires exactly one coordinate to be $1$." },
      { title: "Feature crosses", background: "Crossing $100$ countries with $20$ device types gives", numbers: "$100\\cdot20=2{,}000$ possible categorical pairs by the product rule." },
      { title: "Hash buckets", background: "Mapping $10{,}000$ keys into $1{,}000$ buckets gives average load", numbers: "$10{,}000/1{,}000=10$ keys per bucket." },
      { title: "Leakage audit", background: "If train has $8{,}000$ users, test has $2{,}500$, and overlap is $300$, then the distinct users across both are", numbers: "$8{,}000+2{,}500-300=10{,}200$." }
    ]
  },

  "math-16-13": {
    connectionsProse: "<p>This lesson continues the cardinality idea from finite sets into the infinite case. The previous lesson showed that size can be compared by bijection, not only by ordinary counting. Infinite sets make that matching idea essential. The lesson also prepares for computability, where programs are listable but many mathematical objects are not.</p>",
    motivation: "<p>Infinite sets are compared by listings and bijections, not by visual sparseness. The positive even numbers look like only part of the natural numbers, but the function $n\\mapsto2n$ pairs every natural number with exactly one even number. That is why the evens are countably infinite.</p>" +
                "<p>Some infinite sets can be listed, while the real numbers in an interval cannot. Cantor's diagonal argument shows that any proposed list of real numbers in $(0,1)$ misses a number built to differ from the first row in the first digit, the second row in the second digit, and so on. The construction turns “not on this list” into a precise contradiction.</p>",
    definition: "<p>An infinite set is countably infinite when it can be listed in a sequence indexed by $\\mathbb N$; an uncountable set has no complete list.</p>" +
                "<p>$$\\aleph_0=|\\mathbb N|,\\qquad |(0,1)|=2^{\\aleph_0}.$$</p>" +
                "<p><b>Assumptions that matter:</b> a listing must include every element exactly somewhere in the sequence; decimal representations are chosen without trailing repeating $9$s to avoid duplicate names; diagonalization proves uncountability by contradiction.</p>",
    symbols: [
      { sym: "Countably infinite", desc: "listable as $a_1,a_2,\\ldots$" },
      { sym: "$\\aleph_0=|\\mathbb N|$", desc: "cardinality of the natural numbers" },
      { sym: "uncountable", desc: "no such list exists" },
      { sym: "$2^{\\aleph_0}$", desc: "cardinality of infinite binary sequences/reals" }
    ],
    derivation: [
      { do: "Define $f:\\mathbb N\\to E$ by $f(n)=2n$.", result: "every natural number names one positive even number", why: "this is the proposed bijection" },
      { do: "Check one-to-one.", result: "if $f(n)=f(m)$, then $2n=2m$, so $n=m$", why: "no two inputs have the same output" },
      { do: "Check onto.", result: "if $e\\in E$, then $e=2n$ for some $n\\in\\mathbb N$", why: "every positive even number is reached" },
      { do: "Conclude for evens.", result: "$E$ is countably infinite", why: "it has a bijection with $\\mathbb N$" },
      { do: "For reals, suppose for contradiction that $(0,1)$ has a complete list $r_1,r_2,r_3,\\ldots$.", result: "assume countability", why: "diagonalization starts from a proposed complete list" },
      { do: "Write each $r_i$ in decimal form, choosing expansions that do not end in repeating $9$s.", result: "one decimal name for each listed real", why: "this avoids duplicate decimal names" },
      { do: "Build a new decimal $d=0.d_1d_2d_3\\ldots$ where $d_i$ differs from the $i$th digit of $r_i$ and is never $9$.", result: "$d\\in(0,1)$", why: "this makes $d$ a valid decimal number" },
      { do: "Compare $d$ with each row.", result: "$d$ differs from $r_i$ in digit $i$ for every $i$", why: "$d$ is not equal to any row in the list" },
      { do: "Contradict completeness of the list.", result: "$(0,1)$ is uncountable", why: "the constructed real is missing from any proposed list" }
    ],
    applications: [
      { title: "Program strings", background: "$80^5=3{,}276{,}800{,}000$ strings of length $5$, and listing by length makes", numbers: "all finite programs countable." },
      { title: "Uncomputable functions", background: "programs have size $\\aleph_0$, while binary functions on $\\mathbb N$ have size", numbers: "$2^{\\aleph_0}$." },
      { title: "Rational grid", background: "with $|p|,|q|\\le10$ and $q\\ne0$, there are", numbers: "$21\\cdot20=420$ signed pairs before reduction." },
      { title: "Dense rationals", background: "$315/1000=0.315$ lies between", numbers: "$0.31$ and $0.32$." },
      { title: "Float approximation", background: "32-bit floats have at most", numbers: "$2^{32}=4{,}294{,}967{,}296$ patterns, unlike uncountably many reals in $[0,1]$." },
      { title: "Search spaces", background: "finite binary strings are countable, but infinite binary sequences have size", numbers: "$2^{\\aleph_0}$." }
    ]
  },

  "math-16-14": {
    connectionsProse: "<p>This lesson follows cardinality by separating size from position. Cardinality asks how many elements a set has, while ordinal thinking asks how elements are arranged in a well-ordered process. That distinction matters for recursion, induction, staged constructions, and termination arguments. The finite examples are familiar, and the first infinite ordinal shows why order type contains more information than size alone.</p>",
    motivation: "<p>Ordinals describe positions in well-ordered processes. They record order type, including successor stages and limit stages, rather than only size. A successor stage comes immediately after a previous stage, while a limit stage gathers everything before it without having a single immediate predecessor.</p>" +
                "<p>In finite settings, ordinals behave like ordinary counting positions. In infinite settings, order sensitivity becomes visible: adding one item before a countable sequence is not the same as adding one item after it. This is why ordinal language is useful for transfinite induction and for describing processes that unfold by stages.</p>",
    definition: "<p>Ordinals describe well-ordered order types, recording successor and limit stages rather than only cardinal size.</p>" +
                "<p><b>Assumptions that matter:</b> ordinals describe well-ordered order types; finite examples illustrate the ideas but do not prove the general theory; ordinal addition is order-sensitive.</p>",
    symbols: [
      { sym: "Well-order", desc: "every nonempty subset has a least element" },
      { sym: "$\\omega$", desc: "first infinite ordinal" },
      { sym: "$\\alpha+1$", desc: "successor" },
      { sym: "limit ordinal", desc: "an ordinal with no immediate predecessor" },
      { sym: "transfinite induction", desc: "proves by ruling out least counterexamples" }
    ],
    applications: [
      { title: "Termination measure", background: "starting at $5$ and decreasing by at least $1$ gives at most", numbers: "$5$ loop iterations." },
      { title: "Tree recursion", background: "height $3$ tree evaluates leaves at stage", numbers: "$0$ through root at stage $3$." },
      { title: "Priority construction", background: "three requirements have type $3$; countably many have type", numbers: "$\\omega$." },
      { title: "Training schedule shape", background: "$10$ epochs plus averaging pass has finite order type", numbers: "$11$." },
      { title: "Search-tree recursion", background: "height $4$ recursive calls move to heights at most", numbers: "$3,2,1,0$." },
      { title: "Order sensitivity", background: "$1+\\omega=\\omega$ but", numbers: "$\\omega+1$ has a last element." }
    ]
  },

  "math-16-15": {
    connectionsProse: "<p>This lesson continues the ZFC story by focusing on the axiom named in ZFC's final letter. Earlier set operations built new sets directly; choice concerns selecting representatives from many nonempty sets. Finite selection is usually straightforward, but infinite selection can require an axiom rather than an explicit rule. The idea connects to products, bases, well-orderings, and Zorn's lemma.</p>",
    motivation: "<p>Choice says that one element can be selected from each nonempty set in a collection, even when the collection is infinite and no explicit selection rule is given. A choice function takes a set $S$ from the collection and returns one element $c(S)\\in S$. For a finite collection, the choices can be made one by one.</p>" +
                "<p>The separate axiom matters when the collection is infinite and no uniform rule is available. Many ordinary finite examples look harmless, but the general principle has powerful consequences throughout mathematics. Equivalent forms such as Zorn's lemma and the well-ordering theorem are often used because they fit different proof situations.</p>",
    definition: "<p>The axiom of choice says that every collection of nonempty sets has a choice function selecting one representative from each set.</p>" +
                "<p>$$c(S)\\in S \\quad\\text{for each } S\\in\\mathcal F.$$</p>" +
                "<p><b>Assumptions that matter:</b> every set in the collection is nonempty; finite choice can be demonstrated by explicit selections; the full axiom of choice concerns arbitrary collections and is accepted as an axiom rather than derived here.</p>",
    symbols: [
      { sym: "$\\mathcal F$", desc: "collection of nonempty sets" },
      { sym: "$c$", desc: "choice function" },
      { sym: "$c(S)\\in S$", desc: "selected representative" },
      { sym: "Zorn's lemma", desc: "an equivalent form of choice" },
      { sym: "well-ordering theorem", desc: "an equivalent form of choice" }
    ],
    applications: [
      { title: "Finite product", background: "$A=\\{1,2\\}$ and $B=\\{x,y,z\\}$ give", numbers: "$2\\cdot3=6$ pairs." },
      { title: "Representatives", background: "classes of sizes $2,1,3$ produce", numbers: "$3$ chosen representatives." },
      { title: "Vector-space basis", background: "$\\mathbb R^3$ has an explicit basis of", numbers: "$3$ vectors." },
      { title: "Hyperparameter grid", background: "$3$ learning rates, $4$ depths, and $2$ batch sizes give", numbers: "$24$ configurations." },
      { title: "Infinite representatives", background: "choosing from $\\aleph_0$ nonempty sets yields", numbers: "$\\aleph_0$ selected elements, not necessarily an algorithm." },
      { title: "Finite well-ordering", background: "$5$ distinct records can be totally ordered in", numbers: "$5!=120$ ways." }
    ]
  },

  "math-16-16": {
    connectionsProse: "<p>This lesson moves from logic and set foundations to formal computation. Earlier lessons made statements, proofs, and infinite sizes precise; Turing machines make algorithms precise. The model is deliberately simple, so that questions about what can be computed do not depend on a particular programming language. It leads directly into decidability and the limits of algorithmic verification.</p>",
    motivation: "<p>A Turing machine is a minimal model of algorithmic work: finite control reads one symbol, writes one symbol, moves one cell, and repeats. The tape supplies memory, the state records the machine's current situation, and the transition rule determines the next step. Its simplicity makes computability precise.</p>" +
                "<p>The point is not that real computers look like this in detail. The point is that finite programs can be encoded as strings, and Turing machines capture the step-by-step behavior of algorithms. A simple unary scan already shows the pattern: one symbol is processed per move until the machine reaches the blank cell and halts.</p>",
    definition: "<p>A Turing machine is a formal algorithm model with finite states, tape symbols, a read/write head, and transition rules that update the state, write a symbol, and move left or right.</p>" +
                "<p>$$(q,s)\\mapsto(q',t,R/L)$$</p>" +
                "<p><b>Assumptions that matter:</b> the input is finite and followed by blanks; each transition reads the current symbol and performs one write/move/update action; halting occurs only when a halt rule or halt state is reached.</p>",
    symbols: [
      { sym: "$q$", desc: "state" },
      { sym: "$s,t$", desc: "tape symbols" },
      { sym: "$(q,s)\\mapsto(q',t,R/L)$", desc: "transition rule" },
      { sym: "halt state", desc: "state where computation stops" },
      { sym: "computable function", desc: "a function computed by a Turing machine" },
      { sym: "finite string encoding", desc: "a finite code for programs and inputs" }
    ],
    derivation: [
      { do: "The input is $111$ followed by blanks.", result: "three nonblank unary symbols", why: "the machine has three symbols to scan" },
      { do: "Start with the head on the first $1$.", result: "the first cell is selected", why: "this is the first cell to scan" },
      { do: "On the first $1$, the machine moves right once.", result: "one input symbol has been consumed", why: "one move processes one symbol" },
      { do: "On the second $1$, it moves right again.", result: "two input symbols have been consumed", why: "the same transition repeats" },
      { do: "On the third $1$, it moves right a third time.", result: "all three input symbols have been consumed", why: "the head has passed the last $1$" },
      { do: "Read the next cell.", result: "the head now reads the first blank cell", why: "this is the first place with no input symbol" },
      { do: "Apply the halt rule on blank.", result: "the machine halts after $3$ right moves", why: "the blank triggers stopping" },
      { do: "Generalize to $1^n$.", result: "scanning to the first blank takes $n$ right moves", why: "there is one move per symbol" }
    ],
    applications: [
      { title: "Universal simulation", background: "$5$ simulated steps at $20$ internal steps each gives about", numbers: "$100$ steps." },
      { title: "Program encoding", background: "a $1{,}200$-character file over $128$ characters is one of at most", numbers: "$128^{1200}$ strings." },
      { title: "Classifier as recognizer", background: "$230$ positives among $1{,}000$ halted outputs gives rate", numbers: "$0.23$." },
      { title: "Image input", background: "a $28\\times28$ one-byte grayscale image has", numbers: "$784$ bytes or $6{,}272$ bits." },
      { title: "Most functions uncomputable", background: "countably many programs cannot cover", numbers: "$2^{\\aleph_0}$ binary functions on $\\mathbb N$." },
      { title: "Timeout budget", background: "$60$ seconds at $0.002$ seconds per step allows", numbers: "$30{,}000$ steps." }
    ]
  },

  "math-16-17": {
    connectionsProse: "<p>This lesson builds on Turing machines by asking which yes-or-no problems algorithms can always settle. A machine model gives precise meaning to halting, accepting, rejecting, and running forever. Decidability is the strongest form of algorithmic solvability for such problems. The halting problem then shows that some natural questions about programs cannot have perfect always-halting solvers.</p>",
    motivation: "<p>A decidable problem has an algorithm that always halts with a correct yes or no. Recognizable problems may halt on yes instances and run forever on no instances. The difference matters because a timeout or nontermination is not the same thing as a mathematical no.</p>" +
                "<p>Simple languages can be decidable for straightforward reasons. Even-length binary strings only require tracking parity as the input is scanned. The halting problem is different because it asks for a universal predictor of program behavior, and the diagonal argument constructs a program that contradicts any proposed perfect predictor.</p>",
    definition: "<p>A decision problem is decidable when there is an algorithm that halts on every input and answers yes or no correctly.</p>" +
                "<p><b>Assumptions that matter:</b> inputs are finite strings; a decider must halt on every input; the halting-problem proof is by contradiction using a machine applied to its own code.</p>",
    symbols: [
      { sym: "$L$", desc: "decision problem/language" },
      { sym: "decider", desc: "halts on all inputs" },
      { sym: "recognizer", desc: "may loop on no instances" },
      { sym: "$H(M,x)$", desc: "hypothetical halting decider" },
      { sym: "reduction", desc: "transfers undecidability" }
    ],
    derivation: [
      { do: "For even length, scan the input once while toggling a parity bit.", result: "the bit records even or odd length so far", why: "each symbol changes parity" },
      { do: "Start in the even state.", result: "length $0$ is even", why: "no symbols have been read yet" },
      { do: "Read each symbol.", result: "even switches to odd and odd switches to even", why: "adding one symbol flips parity" },
      { do: "Reach the end of input.", result: "halt and accept exactly in the even state", why: "the finite input has been fully scanned" },
      { do: "Conclude for even-length binary strings.", result: "decidable language", why: "the machine always stops after reading the finite input" },
      { do: "For the halting problem, assume a decider $H(M,x)$ exists.", result: "$H$ always halts and correctly reports whether $M$ halts on $x$", why: "this is the contradiction assumption" },
      { do: "Build a machine $D(M)$ that runs $H(M,M)$.", result: "it asks whether $M$ halts on its own code", why: "self-application sets up diagonalization" },
      { do: "Make $D$ do the opposite.", result: "if $H(M,M)$ says halts, $D(M)$ loops forever; if it says does not halt, $D(M)$ halts", why: "$D$ contradicts the predicted behavior" },
      { do: "Run $D$ on its own code $D$.", result: "ask whether $D(D)$ halts", why: "the diagonal case applies the construction to itself" },
      { do: "Compare both possible answers.", result: "if $H(D,D)$ says halts, then $D(D)$ loops; if it says does not halt, then $D(D)$ halts", why: "both contradict correctness" },
      { do: "Reject the assumption.", result: "no always-halting decider for the halting problem exists", why: "the assumed $H$ cannot be correct" }
    ],
    applications: [
      { title: "Static analysis", background: "$120$ flags among $10{,}000$ functions is", numbers: "$1.2\\%$ for human review, but not perfect decidability." },
      { title: "Type checking", background: "$500$ files at $0.04$ seconds each take about", numbers: "$20$ seconds if the checker always halts." },
      { title: "Linear verification", background: "$f(x)=2x-1$ on $[1,3]$ has minimum", numbers: "$f(1)=1>0$." },
      { title: "DFA membership", background: "a $4$-state DFA reads length $100$ using exactly", numbers: "$100$ transitions." },
      { title: "Timeout", background: "a $30$-second timeout may return", numbers: "unknown, not a mathematical no." },
      { title: "Security reduction", background: "one special reachability line could encode halting, so arbitrary exploit reachability cannot have", numbers: "a perfect decider." }
    ]
  },

  "math-16-18": {
    connectionsProse: "<p>This lesson continues the theme of formal limits, now for proof systems rather than algorithms alone. Soundness and completeness showed a strong match between first-order proof and semantic consequence, while computability showed limits on decision procedures. Gödel's theorem explains a different boundary: sufficiently strong arithmetic theories cannot prove every arithmetic truth about themselves. The lesson connects syntax, coding, proof checking, and self-reference.</p>",
    motivation: "<p>Gödel's theorem shows a limit of formal systems strong enough for arithmetic. If the system is consistent and effectively axiomatized, some arithmetic truth is not provable inside it. The key move is to encode syntax as numbers so that arithmetic can talk about formulas and proofs.</p>" +
                "<p>Once proofs have numerical codes, a carefully constructed sentence can refer to its own provability. The resulting sentence $G$ says, in effect, that $G$ is not provable in the system. If the system proves it, consistency is threatened; if the system proves its negation under the usual strengthened hypotheses, another contradiction appears. The conclusion is incompleteness, not unreliability of all mathematics.</p>",
    definition: "<p>Gödel's incompleteness theorem says that any consistent, effectively axiomatized formal system strong enough for arithmetic is incomplete: some arithmetic truth is not provable inside the system.</p>" +
                "<p><b>Assumptions that matter:</b> the system is consistent, effectively axiomatized, and strong enough to represent enough arithmetic about proof codes; the proof here is a skeleton, not the full technical construction of arithmetized syntax.</p>",
    symbols: [
      { sym: "Consistent", desc: "no statement and its negation are both provable" },
      { sym: "effectively axiomatized", desc: "proofs can be mechanically checked" },
      { sym: "Gödel number", desc: "encodes syntax as arithmetic" },
      { sym: "$G$", desc: "the self-referential sentence" }
    ],
    derivation: [
      { do: "Encode symbols, formulas, and proofs as natural numbers.", result: "Gödel numbering", why: "syntax becomes arithmetic data" },
      { do: "Use the fact that proofs are finite strings.", result: "the relation “number $p$ codes a proof of formula $g$” can be represented arithmetically in strong enough systems", why: "arithmetic can talk about proof codes" },
      { do: "Use self-reference to construct a sentence $G$.", result: "$G$ says “$G$ is not provable in this system”", why: "the sentence refers to its own Gödel number" },
      { do: "Suppose the system proves $G$.", result: "it proves a sentence asserting its own unprovability", why: "under consistency/soundness this cannot happen" },
      { do: "Suppose the system proves $\\neg G$.", result: "it proves that $G$ is provable, while no actual proof of $G$ exists in the consistent case", why: "this creates the other failure under the usual strengthened hypotheses" },
      { do: "Conclude the theorem skeleton.", result: "a consistent, effectively axiomatized system strong enough for arithmetic is incomplete", why: "it cannot prove every arithmetic truth" },
      { do: "For the toy code, assign $A=2$, $\\to=5$, $B=3$.", result: "symbol codes $2,5,3$", why: "these are the symbol codes" },
      { do: "Encode $A\\to B$.", result: "$2\\cdot10^2+5\\cdot10+3=253$", why: "each digit position stores one symbol code" },
      { do: "Decode $253$.", result: "digits $2,5,3$ recover $A\\to B$", why: "reading the stored codes reverses the toy encoding" }
    ],
    applications: [
      { title: "Proof assistant", background: "$200$ lines at $0.003$ seconds per kernel check take about", numbers: "$0.6$ seconds." },
      { title: "Proof search", background: "$10^6$ nodes per second for $30$ seconds checks", numbers: "$3\\cdot10^7$ nodes." },
      { title: "Stronger theory", background: "adding one axiom to $S_1$ gives $S_2$, where", numbers: "every $S_1$ proof still works." },
      { title: "Linear arithmetic", background: "$2x+3\\le7$ gives", numbers: "$x\\le2$ directly, unlike arbitrary program behavior." },
      { title: "Toy encoding", background: "$253$ represents", numbers: "a three-symbol formula under the toy scheme." },
      { title: "AI benchmark", background: "if a prover solves $470$ of $500$ claims, the remaining", numbers: "$30$ are unresolved by that run, not automatically false." }
    ]
  },

  "math-16-19": {
    connectionsProse: "<p>This capstone lesson brings the section's themes back to machine learning and AI systems. Logic supplies rules and constraints, set theory supplies structured spaces of possible outputs, and computability reminds us that reasoning procedures have limits. Neural models supply learned scores, while symbolic components can impose validity or add structured penalties. The lesson shows how these pieces can work together in a small, checkable calculation.</p>",
    motivation: "<p>Neuro-symbolic AI combines learned numerical scores with explicit symbolic structure: rules, graphs, programs, constraints, and proofs. The useful pattern is division of labor, where a neural model proposes and symbolic reasoning filters, verifies, or regularizes. Scores express preference, while constraints express what is allowed.</p>" +
                "<p>Hard constraints and soft rule losses play different roles. A hard constraint removes invalid outputs before selection, so a high-scoring invalid pair cannot be chosen. A soft rule penalty changes the training objective by adding a weighted cost for violations, which encourages but does not guarantee valid behavior.</p>",
    definition: "<p>Neuro-symbolic AI combines neural scores with symbolic constraints or rule losses so that learned preferences can be filtered, verified, or regularized by explicit structure.</p>" +
                "<p>$$L(\\theta)=L_{data}(\\theta)+\\lambda L_{rule}(\\theta)$$</p>" +
                "<p><b>Assumptions that matter:</b> neural scores are treated as fixed for the constrained-choice example; hard constraints remove infeasible candidates before selection; the soft-rule loss is added with nonnegative weight $\\lambda$.</p>",
    symbols: [
      { sym: "$s_i$ or $P(i)$", desc: "neural score for candidate $i$" },
      { sym: "$C$", desc: "constraint set" },
      { sym: "$L_{data}$", desc: "prediction loss" },
      { sym: "$L_{rule}$", desc: "rule-violation loss" },
      { sym: "$\\lambda\\ge0$", desc: "rule weight" },
      { sym: "feasible output", desc: "an output satisfying all hard symbolic constraints" }
    ],
    derivation: [
      { do: "List label probabilities.", result: "$P(A)=0.50$, $P(B)=0.30$, and $P(C)=0.20$", why: "these are the neural scores" },
      { do: "Require two labels.", result: "candidate pairs $\\{A,B\\}$, $\\{A,C\\}$, and $\\{B,C\\}$", why: "all two-label subsets are considered" },
      { do: "Apply the symbolic rule forbidding $A$ and $B$ together.", result: "remove pair $\\{A,B\\}$ even though its score is $0.80$", why: "hard constraints remove invalid outputs before selection" },
      { do: "Score the remaining valid pairs by adding probabilities.", result: "$\\{A,C\\}$ has $0.50+0.20=0.70$ and $\\{B,C\\}$ has $0.30+0.20=0.50$", why: "only feasible pairs are compared" },
      { do: "Choose the best feasible pair.", result: "$\\{A,C\\}$", why: "it is the highest-scoring valid pair" },
      { do: "Define the soft-rule objective.", result: "$L(\\theta)=L_{data}(\\theta)+\\lambda L_{rule}(\\theta)$", why: "the rule violation is weighted before being added" },
      { do: "Plug in $L_{data}=1.2$, $L_{rule}=0.3$, and $\\lambda=0.5$.", result: "$1.2+0.5\\cdot0.3=1.35$", why: "the rule penalty raises the loss by $0.15$" },
      { do: "Compare hard constraints and soft penalties.", result: "hard constraints guarantee validity only if the solver finds a valid output; soft penalties encourage validity but do not guarantee it", why: "constraints and losses play different roles" }
    ],
    applications: [
      { title: "Constrained classification", background: "scores $0.7,0.6,0.2$ with top-two conflict select", numbers: "$0.7+0.2=0.9$ instead of invalid $1.3$." },
      { title: "Knowledge-graph retrieval", background: "if scores $0.91,0.88,0.80$ and a graph filter removes the first, selected top score becomes", numbers: "$0.88$." },
      { title: "Rule-regularized training", background: "$L_{data}=1.2$, $L_{rule}=0.3$, $\\lambda=0.5$ gives total", numbers: "$1.35$." },
      { title: "Program synthesis", background: "$20$ candidates with $17$ rejected leaves", numbers: "$3/20=15\\%$ for deeper checking." },
      { title: "Formal verification around a model", background: "$f(x)=2x-1$ on $[0.8,1.0]$ has minimum $0.6$, so", numbers: "$f(x)>0$ holds." },
      { title: "Planning with learned heuristic", background: "branching factor $5$ at depth $4$ gives $625$ paths; keeping $2$ actions per state gives", numbers: "$16$ paths." }
    ]
  }
};
