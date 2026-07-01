module.exports = {
  "math-16-01": {
    id: "math-16-01",
    title: "Propositional logic and truth tables",
    tagline: "Propositional logic turns everyday claims into small statements whose truth can be checked with care.",
    connections: {
      buildsOn: ["sets of symbols", "functions", "basic proof language"],
      leadsTo: ["Logical equivalence", "Normal forms", "Predicate (first-order) logic"],
      usedWith: ["Boolean algebra", "sets", "proofs", "relations"]
    },
    motivation:
      "<p>You already reason with statements: if the model converged and the validation loss fell, then we trust this run. The sentence has parts, and the truth of the whole depends on the truth of those parts.</p>" +
      "<p><b>Propositional logic</b> gives that reasoning a clean little laboratory. We replace meaningful claims by letters such as $P$ and $Q$, connect them with words like and, or, not, and if-then, and then check every possible case in a truth table.</p>",
    definition:
      "<p>A <b>proposition</b> is a statement that is either true or false. If $P$ and $Q$ are propositions, then $P\\land Q$ means both are true, $P\\lor Q$ means at least one is true, $\\neg P$ means $P$ is false, and $P\\to Q$ means either $P$ is false or $Q$ is true.</p>" +
      "<p>A <b>truth table</b> lists all assignments of truth values to the atomic propositions and computes the value of a compound formula one connective at a time. With $n$ distinct atomic propositions, there are $2^n$ rows because each proposition has two possible truth values.</p>" +
      "<p><b>Assumptions that matter:</b> every atomic proposition has exactly one truth value in a row; $\\lor$ is inclusive unless explicitly stated otherwise; $P\\to Q$ is false only when $P$ is true and $Q$ is false; and propositional logic studies truth form, not the internal meaning of each atomic sentence.</p>",
    worked: {
      problem: "Build the truth table for $(P\\land Q)\\to P$ and decide whether it is always true.",
      skills: ["truth tables", "conjunction", "implication"],
      strategy: "The formula has two atoms — list four rows, compute the conjunction, then compute the implication.",
      steps: [
        { do: "Count the atomic propositions", result: "$P,Q$ give $2^2=4$ rows", why: "each atom can be true or false" },
        { do: "List the rows", result: "$(T,T),(T,F),(F,T),(F,F)$", why: "these exhaust all assignments" },
        { do: "Compute $P\\land Q$", result: "$T,F,F,F$", why: "conjunction is true only when both parts are true" },
        { do: "Compare $(P\\land Q)$ to $P$", result: "$T\\to T$, $F\\to T$, $F\\to F$, $F\\to F$", why: "use the conjunction as the antecedent" },
        { do: "Evaluate the implications", result: "$T,T,T,T$", why: "an implication is false only in the $T\\to F$ case" }
      ],
      verify: "If both $P$ and $Q$ are true, then $P$ is certainly true; in every other row the premise is false, so the implication is true.",
      answer: "$(P\\land Q)\\to P$ is true in all four rows, so it is a tautology.",
      connects: "Truth tables make a logical pattern visible by checking every possible world of truth values."
    },
    practice: [
      { problem: "Build the truth column for $\\neg P\\lor Q$ over rows $(T,T),(T,F),(F,T),(F,F)$.", steps: [
        { do: "Negate $P$ in each row", result: "$F,F,T,T$", why: "not reverses the truth value of $P$" },
        { do: "Keep the $Q$ column", result: "$T,F,T,F$", why: "$Q$ is the second atom" },
        { do: "Apply $\\lor$ row by row", result: "$T,F,T,T$", why: "inclusive or is true when at least one input is true" },
        { do: "Identify the only false row", result: "$P=T,Q=F$", why: "both $\\neg P$ and $Q$ are false there" }
      ], answer: "The truth column is $T,F,T,T$." },
      { problem: "Evaluate $P\\to(Q\\lor R)$ for $P=T$, $Q=F$, and $R=F$.", steps: [
        { do: "Compute the disjunction", result: "$Q\\lor R=F\\lor F=F$", why: "neither part is true" },
        { do: "Substitute into the implication", result: "$P\\to(Q\\lor R)=T\\to F$", why: "$P$ is true and the consequent is false" },
        { do: "Evaluate the implication", result: "$F$", why: "true antecedent with false consequent is the only false implication case" },
        { do: "State the failure condition", result: "the promise made by $P$ is not met", why: "the consequent did not happen" }
      ], answer: "$P\\to(Q\\lor R)$ is false for this assignment." },
      { problem: "How many truth-table rows are needed for $(P\\lor Q)\\land(\\neg R\\lor S)$?", steps: [
        { do: "List the distinct atoms", result: "$P,Q,R,S$", why: "row count depends on distinct atomic propositions" },
        { do: "Count the atoms", result: "$n=4$", why: "there are four independent truth choices" },
        { do: "Use the row formula", result: "$2^n=2^4$", why: "each atom has two values" },
        { do: "Compute the power", result: "$16$", why: "$2\\cdot2\\cdot2\\cdot2=16$" }
      ], answer: "The table needs $16$ rows." },
      { problem: "Show from one row that $P\\lor Q$ is not the same connective as exclusive or.", steps: [
        { do: "Choose the row $P=T,Q=T$", result: "$P\\lor Q=T$", why: "inclusive or allows both parts true" },
        { do: "Evaluate exclusive or on the same row", result: "$P$ xor $Q=F$", why: "exclusive or means exactly one part is true" },
        { do: "Compare the outputs", result: "$T\\ne F$", why: "one differing row is enough to separate connectives" },
        { do: "State the conclusion", result: "inclusive or and exclusive or are different", why: "their truth tables disagree" }
      ], answer: "They differ on the row $P=T,Q=T$." },
      { problem: "A rule says: if data pass validation $V$, then deploy $D$. Evaluate $V\\to D$ for $(V,D)=(T,T),(T,F),(F,T),(F,F)$.", steps: [
        { do: "Write the implication column rule", result: "false only for $T\\to F$", why: "a true condition with no deployment violates the rule" },
        { do: "Evaluate $(T,T)$", result: "$T$", why: "validation passed and deployment happened" },
        { do: "Evaluate $(T,F)$", result: "$F$", why: "validation passed but deployment did not happen" },
        { do: "Evaluate $(F,T)$ and $(F,F)$", result: "$T,T$", why: "a false antecedent does not violate the conditional" },
        { do: "List the column", result: "$T,F,T,T$", why: "combine the four rows in order" }
      ], answer: "The implication column is $T,F,T,T$." }
    ],
    applications: [
      { title: "Boolean feature flags", background: "Software systems use Boolean flags to turn behavior on and off. Propositional connectives describe exactly when a feature is active.", numbers: "If $A$ means experiment enabled and $B$ means user eligible, then $A\\land B$ is true only in $1$ of the $4$ two-flag rows." },
      { title: "Database filters", background: "Query languages combine conditions using and, or, and not. A truth table prevents surprises when filters get nested.", numbers: "For age match $P=T$ and region match $Q=F$, the filter $P\\land Q$ rejects because $T\\land F=F$." },
      { title: "Circuit gates", background: "Digital circuits implement logic physically. AND, OR, and NOT gates are propositional connectives in hardware clothing.", numbers: "An AND gate with inputs $1$ and $0$ outputs $0$; an OR gate with the same inputs outputs $1$." },
      { title: "Unit-test conditions", background: "Tests often assert that several conditions hold together. Logic helps separate necessary checks from optional ones.", numbers: "If correctness $C=T$ and latency $L=F$, then passing both checks $C\\land L$ is false." },
      { title: "Rule-based classification", background: "Before large neural models, many classifiers were explicit logical rules. They still appear in safety filters and validation layers.", numbers: "A sample is accepted if $S\\land\\neg E$; with score pass $S=T$ and error flag $E=F$, the result is $T\\land T=T$." },
      { title: "Search predicates", background: "Information retrieval systems combine keyword and metadata predicates. Propositional logic gives the exact meaning of a search expression.", numbers: "For title match $T=F$, author match $A=T$, and year match $Y=T$, $(T\\lor A)\\land Y=(F\\lor T)\\land T=T$." }
    ],
    applicationsClose: "From circuits to filters to deployment rules, truth tables give patient clarity about every possible case.",
    takeaways: [
      "A proposition is a statement with truth value true or false.",
      "$\\land$, $\\lor$, $\\neg$, and $\\to$ build compound propositions from smaller ones.",
      "A formula with $n$ atoms has $2^n$ truth-table rows.",
      "Implication is false only when the antecedent is true and the consequent is false."
    ]
  },

  "math-16-02": {
    id: "math-16-02",
    title: "Logical equivalence",
    tagline: "Logical equivalence says two formulas may look different while carrying the same truth in every case.",
    connections: {
      buildsOn: ["Propositional logic and truth tables", "truth tables", "Boolean connectives"],
      leadsTo: ["Normal forms", "Natural deduction", "Soundness and completeness"],
      usedWith: ["Boolean algebra", "set identities", "proofs", "rewriting rules"]
    },
    motivation:
      "<p>You already simplify algebra by replacing $x+x$ with $2x$. Logic has the same gift: replace a complicated statement with a simpler one that is true in exactly the same situations.</p>" +
      "<p><b>Logical equivalence</b> is the permission slip for that replacement. It lets you simplify conditions, prove identities, and recognize that a conditional is just a disguised disjunction.</p>",
    definition:
      "<p>Formulas $A$ and $B$ are <b>logically equivalent</b>, written $A\\equiv B$, when they have the same truth value under every assignment of truth values to their atomic propositions. Equivalently, the biconditional $A\\leftrightarrow B$ is a tautology.</p>" +
      "<p>One central equivalence is $P\\to Q\\equiv\\neg P\\lor Q$. To see it, both formulas are false only when $P=T$ and $Q=F$; in the other three rows both are true. De Morgan's laws are another pair: $\\neg(P\\land Q)\\equiv\\neg P\\lor\\neg Q$ and $\\neg(P\\lor Q)\\equiv\\neg P\\land\\neg Q$.</p>" +
      "<p><b>Assumptions that matter:</b> equivalence requires agreement in every row, not just in examples; rewriting preserves truth but may change readability; and the symbol $\\equiv$ here means same truth table, not numerical equality.</p>",
    worked: {
      problem: "Use a truth table to show $P\\to Q\\equiv\\neg P\\lor Q$.",
      skills: ["truth tables", "implication", "equivalence"],
      strategy: "Compute both columns on the same four rows and compare them row by row.",
      steps: [
        { do: "List the rows for $P,Q$", result: "$(T,T),(T,F),(F,T),(F,F)$", why: "two atoms give four assignments" },
        { do: "Evaluate $P\\to Q$", result: "$T,F,T,T$", why: "only $T\\to F$ is false" },
        { do: "Evaluate $\\neg P$", result: "$F,F,T,T$", why: "negation reverses $P$" },
        { do: "Evaluate $\\neg P\\lor Q$", result: "$T,F,T,T$", why: "or is true if either column is true" },
        { do: "Compare the two formula columns", result: "$T,F,T,T$ equals $T,F,T,T$", why: "matching every row proves equivalence" }
      ],
      verify: "The one dangerous row for an implication, $P=T,Q=F$, is also the only row where $\\neg P\\lor Q$ is false.",
      answer: "$P\\to Q$ and $\\neg P\\lor Q$ are logically equivalent.",
      connects: "Equivalence turns conditionals into forms that are often easier to combine and simplify."
    },
    practice: [
      { problem: "Show $\\neg(P\\land Q)\\equiv\\neg P\\lor\\neg Q$ by comparing the four rows.", steps: [
        { do: "Compute $P\\land Q$", result: "$T,F,F,F$", why: "and is true only when both are true" },
        { do: "Negate that column", result: "$F,T,T,T$", why: "this is $\\neg(P\\land Q)$" },
        { do: "Compute $\\neg P$ and $\\neg Q$", result: "$\\neg P=F,F,T,T$ and $\\neg Q=F,T,F,T$", why: "negate each atom separately" },
        { do: "Compute $\\neg P\\lor\\neg Q$", result: "$F,T,T,T$", why: "at least one negated atom is true except the first row" },
        { do: "Compare", result: "the columns match", why: "matching all rows proves equivalence" }
      ], answer: "$\\neg(P\\land Q)\\equiv\\neg P\\lor\\neg Q$." },
      { problem: "Simplify $\\neg\\neg(P\\lor Q)$ using equivalence laws.", steps: [
        { do: "Identify the outer operation", result: "double negation", why: "the formula begins with $\\neg\\neg$" },
        { do: "Apply double-negation law", result: "$P\\lor Q$", why: "negating twice returns the original truth value" },
        { do: "Check one row", result: "if $P=F,Q=T$, both formulas are $T$", why: "the simplified formula agrees in a sample case" },
        { do: "State the equivalence", result: "$\\neg\\neg(P\\lor Q)\\equiv P\\lor Q$", why: "the law applies to any subformula" }
      ], answer: "$P\\lor Q$." },
      { problem: "Rewrite $\\neg(P\\to Q)$ without an implication.", steps: [
        { do: "Replace the implication", result: "$\\neg(\\neg P\\lor Q)$", why: "$P\\to Q\\equiv\\neg P\\lor Q$" },
        { do: "Apply De Morgan's law", result: "$\\neg\\neg P\\land\\neg Q$", why: "negation of an or becomes and of negations" },
        { do: "Remove double negation", result: "$P\\land\\neg Q$", why: "$\\neg\\neg P\\equiv P$" },
        { do: "Interpret the result", result: "$P$ true and $Q$ false", why: "that is exactly when an implication fails" }
      ], answer: "$\\neg(P\\to Q)\\equiv P\\land\\neg Q$." },
      { problem: "Use equivalences to simplify $(P\\land T)\\lor(P\\land F)$, where $T$ is always true and $F$ is always false.", steps: [
        { do: "Simplify $P\\land T$", result: "$P$", why: "and with truth leaves the formula unchanged" },
        { do: "Simplify $P\\land F$", result: "$F$", why: "and with false is always false" },
        { do: "Substitute the results", result: "$P\\lor F$", why: "replace equivalent subformulas" },
        { do: "Simplify the disjunction", result: "$P$", why: "or with false leaves the formula unchanged" }
      ], answer: "The formula is equivalent to $P$." },
      { problem: "A filter is not both stale and approved: $\\neg(S\\land A)$. Rewrite it as an equivalent operational rule.", steps: [
        { do: "Apply De Morgan's law", result: "$\\neg S\\lor\\neg A$", why: "not both means at least one condition fails" },
        { do: "Interpret $\\neg S$", result: "not stale", why: "negating stale gives fresh enough" },
        { do: "Interpret $\\neg A$", result: "not approved", why: "negating approved gives approval absent" },
        { do: "Write the operational reading", result: "fresh enough or not approved", why: "the equivalent rule has the same truth table" }
      ], answer: "$\\neg(S\\land A)\\equiv\\neg S\\lor\\neg A$: either the item is not stale or it is not approved." }
    ],
    applications: [
      { title: "Compiler optimization", background: "Compilers simplify Boolean expressions so generated code does less work while preserving behavior.", numbers: "The condition $(P\\land T)\\lor F$ reduces to $P$; evaluating one flag instead of three connectives saves operations." },
      { title: "Query rewriting", background: "Database engines rewrite filters into equivalent forms that use indexes more effectively.", numbers: "$\\neg(A\\land B)$ becomes $\\neg A\\lor\\neg B$; if $A$ is indexed, rows with $A=F$ can be found directly." },
      { title: "Testing conditionals", background: "Equivalent formulas should pass exactly the same test cases. Truth tables give complete tests for small Boolean logic.", numbers: "For $P,Q$, the equivalence $P\\to Q\\equiv\\neg P\\lor Q$ requires only $4$ exhaustive rows." },
      { title: "Set identities", background: "Logic and set theory mirror each other: and becomes intersection, or becomes union, not becomes complement.", numbers: "If universe has $20$ items, $|A\\cap B|=6$, then $|\\overline{A\\cap B}|=14$, matching not both." },
      { title: "Safety rules", background: "Safety systems often describe forbidden states. Equivalent rewrites can turn a prohibition into an allowed-state checklist.", numbers: "Not overload and heat, $\\neg(O\\land H)$, allows $3$ of the $4$ rows and forbids only $O=T,H=T$." },
      { title: "ML data validation", background: "Feature pipelines use logical checks for missingness, range, and schema status. Equivalent forms make alerts clearer.", numbers: "Failure of $R\\to C$ is $R\\land\\neg C$: required field present $R=T$ but conversion success $C=F$." }
    ],
    applicationsClose: "Equivalence is the algebra of truth: change the shape of a statement without changing its cases.",
    takeaways: [
      "Two formulas are equivalent when their truth-table columns match in every row.",
      "$P\\to Q$ is equivalent to $\\neg P\\lor Q$.",
      "De Morgan's laws move negation through and and or by switching the connective.",
      "Equivalence supports safe simplification in proofs, code, filters, and rules."
    ]
  },

  "math-16-03": {
    id: "math-16-03",
    title: "Normal forms",
    tagline: "Normal forms give logical formulas a standard shape so they can be compared, stored, and solved.",
    connections: {
      buildsOn: ["Logical equivalence", "Propositional logic and truth tables", "Boolean algebra"],
      leadsTo: ["Predicate (first-order) logic", "Natural deduction", "Soundness and completeness"],
      usedWith: ["distributive laws", "Boolean algebra", "sets", "proofs"]
    },
    motivation:
      "<p>You know how fractions are easier to compare after they share a denominator. Logic has a similar need: formulas can look wildly different while saying the same thing.</p>" +
      "<p><b>Normal forms</b> put formulas into predictable shapes. Conjunctive normal form is friendly to satisfiability solvers; disjunctive normal form reads directly from truth-table rows where the formula is true.</p>",
    definition:
      "<p>A <b>literal</b> is an atom such as $P$ or its negation $\\neg P$. A <b>clause</b> is an or of literals. A formula is in <b>conjunctive normal form</b> (CNF) if it is an and of clauses, such as $(P\\lor Q)\\land(\\neg P\\lor R)$. A formula is in <b>disjunctive normal form</b> (DNF) if it is an or of terms, where each term is an and of literals.</p>" +
      "<p>Every finite propositional truth table can be written in DNF by making one term for each true row. For a row $P=T,Q=F,R=T$, the term is $P\\land\\neg Q\\land R$. CNF can be built dually from false rows or obtained by equivalence rewrites.</p>" +
      "<p><b>Assumptions that matter:</b> normal forms may grow much larger than the original formula; equivalent normal forms need not be unique unless a stricter canonical rule is imposed; and distribution laws such as $A\\lor(B\\land C)\\equiv(A\\lor B)\\land(A\\lor C)$ preserve truth.</p>",
    worked: {
      problem: "Convert $P\\to(Q\\land R)$ to CNF.",
      skills: ["implication removal", "distribution", "CNF"],
      strategy: "Remove the implication, then distribute the or over the and.",
      steps: [
        { do: "Replace the implication", result: "$\\neg P\\lor(Q\\land R)$", why: "$P\\to X\\equiv\\neg P\\lor X$" },
        { do: "Name the distribution pattern", result: "$A\\lor(B\\land C)$", why: "here $A=\\neg P$, $B=Q$, and $C=R$" },
        { do: "Distribute the or", result: "$(\\neg P\\lor Q)\\land(\\neg P\\lor R)$", why: "or over and creates an and of clauses" },
        { do: "Check each clause", result: "$\\neg P\\lor Q$ and $\\neg P\\lor R$", why: "each clause is an or of literals" },
        { do: "State the form", result: "CNF", why: "the full formula is an and of clauses" }
      ],
      verify: "If $P$ is false, both clauses are true; if $P$ is true, the clauses require both $Q$ and $R$, matching the original implication.",
      answer: "A CNF form is $(\\neg P\\lor Q)\\land(\\neg P\\lor R)$.",
      connects: "CNF exposes a formula as simultaneous clauses, the shape many solvers expect."
    },
    practice: [
      { problem: "Put $\\neg(P\\lor Q)$ into CNF.", steps: [
        { do: "Apply De Morgan's law", result: "$\\neg P\\land\\neg Q$", why: "not of an or becomes and of nots" },
        { do: "View each literal as a clause", result: "$(\\neg P)\\land(\\neg Q)$", why: "a one-literal clause is allowed" },
        { do: "Check the connective between clauses", result: "$\\land$", why: "CNF is an and of clauses" },
        { do: "State the CNF", result: "$\\neg P\\land\\neg Q$", why: "the formula already has CNF shape" }
      ], answer: "$\\neg P\\land\\neg Q$." },
      { problem: "Convert $(P\\land Q)\\lor R$ to CNF.", steps: [
        { do: "Identify the distribution pattern", result: "$(A\\land B)\\lor C$", why: "take $A=P$, $B=Q$, and $C=R$" },
        { do: "Distribute $\\lor R$ over the conjunction", result: "$(P\\lor R)\\land(Q\\lor R)$", why: "or distributes over and" },
        { do: "Check the first clause", result: "$P\\lor R$", why: "it is an or of literals" },
        { do: "Check the second clause", result: "$Q\\lor R$", why: "it is also an or of literals" }
      ], answer: "$(P\\lor R)\\land(Q\\lor R)$." },
      { problem: "Write a DNF term for the row $P=F,Q=T,R=F$.", steps: [
        { do: "Encode $P=F$", result: "$\\neg P$", why: "a false atom becomes its negated literal" },
        { do: "Encode $Q=T$", result: "$Q$", why: "a true atom appears unnegated" },
        { do: "Encode $R=F$", result: "$\\neg R$", why: "false becomes negated" },
        { do: "Join the literals", result: "$\\neg P\\land Q\\land\\neg R$", why: "one DNF row-term requires all row conditions at once" }
      ], answer: "$\\neg P\\land Q\\land\\neg R$." },
      { problem: "A formula is true exactly on rows $(P,Q)=(T,F)$ and $(F,T)$. Write a DNF.", steps: [
        { do: "Write the term for $(T,F)$", result: "$P\\land\\neg Q$", why: "match $P$ true and $Q$ false" },
        { do: "Write the term for $(F,T)$", result: "$\\neg P\\land Q$", why: "match $P$ false and $Q$ true" },
        { do: "Join true-row terms with or", result: "$(P\\land\\neg Q)\\lor(\\neg P\\land Q)$", why: "DNF is an or of satisfying cases" },
        { do: "Recognize the pattern", result: "exclusive or", why: "exactly one of $P,Q$ is true" }
      ], answer: "$(P\\land\\neg Q)\\lor(\\neg P\\land Q)$." },
      { problem: "Convert $\\neg(P\\to Q)\\lor R$ into DNF.", steps: [
        { do: "Rewrite the negated implication", result: "$(P\\land\\neg Q)\\lor R$", why: "$\\neg(P\\to Q)\\equiv P\\land\\neg Q$" },
        { do: "Identify the first term", result: "$P\\land\\neg Q$", why: "it is an and of literals" },
        { do: "Identify the second term", result: "$R$", why: "a single literal is a valid DNF term" },
        { do: "Check the top connective", result: "$\\lor$", why: "DNF is an or of terms" },
        { do: "State the DNF", result: "$(P\\land\\neg Q)\\lor R$", why: "the formula now has DNF shape" }
      ], answer: "$(P\\land\\neg Q)\\lor R$." }
    ],
    applications: [
      { title: "SAT solvers", background: "Modern satisfiability solvers usually consume CNF because clauses can be propagated efficiently.", numbers: "The CNF $(P\\lor Q)\\land(\\neg P\\lor R)$ has $2$ clauses and $4$ literal occurrences." },
      { title: "Rule engines", background: "Business and validation rules are easier to audit when written as separate required clauses.", numbers: "A rule with $5$ clauses fails as soon as one clause is false; if clause $3$ fails, the full CNF is false." },
      { title: "Truth-table synthesis", background: "DNF lets engineers build a formula directly from observed true cases.", numbers: "For $3$ atoms, a function true on $2$ rows gets a DNF with $2$ row-terms, each with $3$ literals." },
      { title: "Hardware design", background: "Sum-of-products and product-of-sums forms are DNF and CNF under older circuit-design names.", numbers: "A DNF with $3$ terms of $2$ literals can be implemented by $3$ AND gates feeding $1$ OR gate." },
      { title: "Access-control policies", background: "Policies often combine alternative ways to qualify. DNF expresses allowed cases directly.", numbers: "$(Admin)\\lor(Employee\\land MFA)$ allows user $u$ with Employee true and MFA true even when Admin false." },
      { title: "Feature-cross explanations", background: "Interpretable models sometimes present decision rules as logical cases. Normal forms make those cases explicit.", numbers: "A two-case DNF such as $(x>5\\land y<2)\\lor(x>8\\land z=1)$ has exactly $2$ sufficient rule paths." }
    ],
    applicationsClose: "Normal forms are not just tidiness; they turn truth into a standard interface for solvers, circuits, and rule systems.",
    takeaways: [
      "CNF is an and of clauses; each clause is an or of literals.",
      "DNF is an or of terms; each term is an and of literals.",
      "Truth-table true rows give DNF directly.",
      "Normal forms preserve truth but can make formulas larger."
    ]
  },

  "math-16-04": {
    id: "math-16-04",
    title: "Predicate (first-order) logic",
    tagline: "Predicate logic opens propositions so we can talk about objects, properties, and relationships.",
    connections: {
      buildsOn: ["Propositional logic and truth tables", "Quantifiers", "sets"],
      leadsTo: ["Quantifiers", "Formal semantics", "Natural deduction"],
      usedWith: ["relations", "functions", "sets", "proofs"]
    },
    motivation:
      "<p>Propositional logic treats a sentence like one sealed box. That is useful, but many mathematical claims need to look inside: every vector has a norm, some parameter minimizes the loss, one node points to another.</p>" +
      "<p><b>Predicate logic</b> gives us objects and predicates. It lets statements vary with an input, so we can express properties of one object and relationships among several objects.</p>",
    definition:
      "<p>A <b>predicate</b> is a statement-form with variables, such as $Even(x)$ or $Less(x,y)$. Once the variables receive objects from a <b>domain</b>, the predicate becomes true or false. A <b>term</b> names an object, and a <b>formula</b> combines predicates with logical connectives and quantifiers.</p>" +
      "<p>First-order logic quantifies over objects in the domain, not over predicates or sets of predicates. For example, $\\forall x\\, P(x)$ says every object has property $P$, while $\\exists x\\, P(x)$ says at least one object has property $P$.</p>" +
      "<p><b>Assumptions that matter:</b> the domain must be fixed before truth can be evaluated; predicate symbols get meanings from an interpretation; variables may be free or bound by quantifiers; and changing the domain can change the truth of the same written formula.</p>",
    worked: {
      problem: "Let the domain be $D=\\{1,2,3,4\\}$ and let $E(x)$ mean '$x$ is even'. Evaluate $\\forall x\\,E(x)$ and $\\exists x\\,E(x)$.",
      skills: ["domains", "predicates", "quantifiers"],
      strategy: "Turn the predicate into a truth value for each object, then read the universal and existential claims.",
      steps: [
        { do: "List the domain elements", result: "$1,2,3,4$", why: "quantifiers range over exactly these objects" },
        { do: "Evaluate $E(1)$", result: "$F$", why: "$1$ is not even" },
        { do: "Evaluate $E(2),E(3),E(4)$", result: "$T,F,T$", why: "$2$ and $4$ are even, $3$ is not" },
        { do: "Evaluate the universal statement", result: "$\\forall x\\,E(x)$ is false", why: "$1$ is a counterexample" },
        { do: "Evaluate the existential statement", result: "$\\exists x\\,E(x)$ is true", why: "$2$ is a witness" }
      ],
      verify: "One counterexample defeats the universal claim, and one witness proves the existential claim.",
      answer: "$\\forall x\\,E(x)$ is false; $\\exists x\\,E(x)$ is true.",
      connects: "Predicate logic turns one sentence form into many truth checks over a domain."
    },
    practice: [
      { problem: "With domain $\\{0,1,2\\}$, let $P(x)$ mean $x^2=x$. Evaluate $P(0)$, $P(1)$, and $P(2)$.", steps: [
        { do: "Substitute $x=0$", result: "$0^2=0$", why: "check the predicate at the first object" },
        { do: "Evaluate $P(0)$", result: "$T$", why: "$0=0$" },
        { do: "Substitute $x=1$", result: "$1^2=1$", why: "check the second object" },
        { do: "Evaluate $P(1)$", result: "$T$", why: "$1=1$" },
        { do: "Substitute $x=2$", result: "$2^2=4\\ne2$", why: "check the final object" }
      ], answer: "$P(0)$ and $P(1)$ are true; $P(2)$ is false." },
      { problem: "Let $L(x,y)$ mean $x<y$ on domain $\\{1,2,3\\}$. Is $L(1,3)\\land L(3,1)$ true?", steps: [
        { do: "Evaluate $L(1,3)$", result: "$T$", why: "$1<3$" },
        { do: "Evaluate $L(3,1)$", result: "$F$", why: "$3<1$ is false" },
        { do: "Form the conjunction", result: "$T\\land F$", why: "both predicates must be true" },
        { do: "Evaluate the conjunction", result: "$F$", why: "and is false when one part is false" }
      ], answer: "The statement is false." },
      { problem: "In domain $\\{a,b,c\\}$, suppose $R(a,b)$ and $R(b,c)$ are true and all other $R$ pairs are false. Evaluate $\\exists y\\,R(a,y)$.", steps: [
        { do: "List possible witnesses", result: "$y=a,b,c$", why: "the existential quantifier ranges over the domain" },
        { do: "Check $R(a,a)$", result: "$F$", why: "only $R(a,b)$ and $R(b,c)$ are true" },
        { do: "Check $R(a,b)$", result: "$T$", why: "this pair is listed as true" },
        { do: "Stop after a witness", result: "$\\exists y\\,R(a,y)$ is true", why: "one true instance proves an existential" }
      ], answer: "$\\exists y\\,R(a,y)$ is true, witnessed by $y=b$." },
      { problem: "Identify the free and bound variables in $P(x)\\land\\exists y\\,R(x,y)$.", steps: [
        { do: "Inspect $P(x)$", result: "$x$ appears free", why: "no quantifier binds this occurrence" },
        { do: "Inspect $\\exists y$", result: "$y$ is bound in $R(x,y)$", why: "the quantifier controls occurrences of $y$ in its scope" },
        { do: "Inspect $x$ inside $R(x,y)$", result: "$x$ is free", why: "there is no $\\forall x$ or $\\exists x$ binding it" },
        { do: "List the variables", result: "free: $x$; bound: $y$", why: "combine the occurrences" }
      ], answer: "$x$ is free and $y$ is bound." },
      { problem: "Translate: every training example has some label. Use $Example(x)$, $Label(y)$, and $HasLabel(x,y)$.", steps: [
        { do: "Name the domain objects", result: "examples and labels", why: "first-order variables range over objects" },
        { do: "Start with every example", result: "$\\forall x(Example(x)\\to\\cdots)$", why: "only objects that are examples need the promise" },
        { do: "Add existence of a label", result: "$\\exists y(Label(y)\\land\\cdots)$", why: "some object must be a label" },
        { do: "Relate the example and label", result: "$HasLabel(x,y)$", why: "the predicate connects the two objects" },
        { do: "Combine the formula", result: "$\\forall x(Example(x)\\to\\exists y(Label(y)\\land HasLabel(x,y)))$", why: "this matches the English sentence" }
      ], answer: "$\\forall x(Example(x)\\to\\exists y(Label(y)\\land HasLabel(x,y)))$." }
    ],
    applications: [
      { title: "Knowledge graphs", background: "Knowledge graphs store objects and relations, exactly the ingredients predicate logic names.", numbers: "If $R(Alice,Company)$ is true and $R(Bob,Company)$ is false, the predicate distinguishes $2$ people with one relation." },
      { title: "Database schemas", background: "Relational databases are close cousins of first-order logic: tables are predicates and rows are satisfying tuples.", numbers: "A table Enrolled(student, course) with $1200$ rows represents $1200$ true ordered pairs." },
      { title: "Program specifications", background: "Formal methods describe what code should do using predicates over program states.", numbers: "A sortedness predicate can state $\\forall i\\forall j((0\\le i<j<n)\\to A_i\\le A_j)$ for an array of length $n$." },
      { title: "Type systems", background: "Type checkers reason about objects and properties such as has-field or subtype-of.", numbers: "If $HasField(User,email)$ is true and $HasField(User,age)$ is true, two predicate facts support two safe accesses." },
      { title: "ML fairness constraints", background: "Fairness requirements often quantify over groups or individuals, making predicate logic a natural language for them.", numbers: "A constraint might require $\\forall g$ in $4$ groups, error rate $e_g\\le0.05$; all $4$ checks must pass." },
      { title: "Graph algorithms", background: "Graphs are sets of nodes with an edge relation. Predicate logic describes paths, adjacency, and reachability approximations.", numbers: "If a graph has $5$ nodes, an edge predicate has $5\\cdot5=25$ possible ordered pairs to mark true or false." }
    ],
    applicationsClose: "Predicate logic is the doorway from whole-sentence truth to structured reasoning about objects and relationships.",
    takeaways: [
      "A predicate becomes true or false after its variables receive objects from a domain.",
      "First-order logic quantifies over objects, not over predicates themselves.",
      "The same formula can change truth value when the domain or interpretation changes.",
      "Free variables are not controlled by a quantifier; bound variables are."
    ]
  },

  "math-16-05": {
    id: "math-16-05",
    title: "Quantifiers",
    tagline: "Quantifiers are the careful words every and some, made precise enough for proofs and programs.",
    connections: {
      buildsOn: ["Predicate (first-order) logic", "sets", "logical equivalence"],
      leadsTo: ["Formal semantics", "Natural deduction", "Soundness and completeness"],
      usedWith: ["proofs", "relations", "functions", "set inclusion"]
    },
    motivation:
      "<p>Mathematics often turns on small words: every, some, none, exactly. A theorem can be true or false because one of those words was placed in the wrong order.</p>" +
      "<p><b>Quantifiers</b> let us say how widely a predicate is meant to hold. They also teach a deep habit: to prove every, choose an arbitrary object; to prove some, produce a witness.</p>",
    definition:
      "<p>The universal quantifier $\\forall x\\,P(x)$ means $P(x)$ is true for every object $x$ in the domain. The existential quantifier $\\exists x\\,P(x)$ means at least one object $x$ in the domain makes $P(x)$ true.</p>" +
      "<p>Negation switches quantifiers: $\\neg\\forall x\\,P(x)\\equiv\\exists x\\,\\neg P(x)$ and $\\neg\\exists x\\,P(x)\\equiv\\forall x\\,\\neg P(x)$. Quantifier order matters: $\\forall x\\exists y\\,R(x,y)$ says every $x$ gets possibly its own $y$, while $\\exists y\\forall x\\,R(x,y)$ says one shared $y$ works for all $x$.</p>" +
      "<p><b>Assumptions that matter:</b> the domain is part of the meaning; an empty domain can make universal statements vacuously true and existential statements false; and changing quantifier order can change the truth of a sentence.</p>",
    worked: {
      problem: "On domain $D=\\{1,2,3\\}$ with $R(x,y)$ meaning $x<y$, evaluate $\\forall x\\exists y\\,R(x,y)$ and $\\exists y\\forall x\\,R(x,y)$.",
      skills: ["quantifier order", "witnesses", "counterexamples"],
      strategy: "For the first sentence, each $x$ may choose its own $y$; for the second, one $y$ must work for every $x$.",
      steps: [
        { do: "Test $x=1$ for $\\forall x\\exists y$", result: "choose $y=2$", why: "$1<2$" },
        { do: "Test $x=2$", result: "choose $y=3$", why: "$2<3$" },
        { do: "Test $x=3$", result: "no $y\\in D$ has $3<y$", why: "$3$ is the largest element" },
        { do: "Conclude the first sentence", result: "$\\forall x\\exists y\\,x<y$ is false", why: "$x=3$ is a counterexample" },
        { do: "Test a shared $y$ for the second sentence", result: "no $y$ is greater than $3$", why: "it would need $3<y$" },
        { do: "Conclude the second sentence", result: "$\\exists y\\forall x\\,x<y$ is false", why: "no single domain element is above every $x$" }
      ],
      verify: "Both fail because the finite domain has a maximum element, but they fail for slightly different structural reasons.",
      answer: "Both statements are false on $\\{1,2,3\\}$.",
      connects: "Quantifier order tells you whether witnesses may vary or must be shared."
    },
    practice: [
      { problem: "Negate $\\forall x(P(x)\\to Q(x))$.", steps: [
        { do: "Move negation through the universal", result: "$\\exists x\\,\\neg(P(x)\\to Q(x))$", why: "not every means there exists a counterexample" },
        { do: "Negate the implication", result: "$\\exists x(P(x)\\land\\neg Q(x))$", why: "an implication fails when premise true and conclusion false" },
        { do: "Interpret the result", result: "some $x$ has $P$ but not $Q$", why: "that is exactly a counterexample" },
        { do: "State the final negation", result: "$\\exists x(P(x)\\land\\neg Q(x))$", why: "no implication remains" }
      ], answer: "$\\exists x(P(x)\\land\\neg Q(x))$." },
      { problem: "On domain $\\{2,4,6\\}$, evaluate $\\forall x\\,Even(x)$.", steps: [
        { do: "Check $x=2$", result: "$Even(2)=T$", why: "$2$ is divisible by $2$" },
        { do: "Check $x=4$", result: "$Even(4)=T$", why: "$4$ is divisible by $2$" },
        { do: "Check $x=6$", result: "$Even(6)=T$", why: "$6$ is divisible by $2$" },
        { do: "Apply the universal quantifier", result: "$T$", why: "all domain elements passed" }
      ], answer: "$\\forall x\\,Even(x)$ is true on this domain." },
      { problem: "On domain $\\{1,3,5\\}$, evaluate $\\exists x(x^2=9)$.", steps: [
        { do: "Test $x=1$", result: "$1^2=1$", why: "not equal to $9$" },
        { do: "Test $x=3$", result: "$3^2=9$", why: "this matches the predicate" },
        { do: "Use the witness", result: "$x=3$", why: "one witness proves existence" },
        { do: "State the truth value", result: "$T$", why: "the existential condition is satisfied" }
      ], answer: "The statement is true, witnessed by $x=3$." },
      { problem: "Explain why $\\exists y\\forall x(x\\le y)$ is true on $\\{1,2,3\\}$ but false on the positive integers.", steps: [
        { do: "Choose $y=3$ in $\\{1,2,3\\}$", result: "$1\\le3$, $2\\le3$, $3\\le3$", why: "$3$ is a maximum element" },
        { do: "Conclude finite-domain truth", result: "true", why: "one shared $y$ works for all $x$" },
        { do: "Consider any positive integer $y$", result: "$y+1$ is also positive", why: "the positive integers have no maximum" },
        { do: "Find the counterexample", result: "$y+1\\le y$ is false", why: "the proposed shared upper bound fails" },
        { do: "Conclude infinite-domain truth", result: "false", why: "no witness $y$ works for all positive integers" }
      ], answer: "It is true on $\\{1,2,3\\}$ with witness $3$, but false on the positive integers." },
      { problem: "Translate: every batch has at least one invalid record, using $Batch(b)$, $Record(r)$, $In(r,b)$, and $Invalid(r)$.", steps: [
        { do: "Start with every batch", result: "$\\forall b(Batch(b)\\to\\cdots)$", why: "only batches are constrained" },
        { do: "Add at least one record", result: "$\\exists r(Record(r)\\land\\cdots)$", why: "existence gives a witness record" },
        { do: "Place the record in the batch", result: "$In(r,b)$", why: "the witness must belong to that batch" },
        { do: "Require invalidity", result: "$Invalid(r)$", why: "the record must be invalid" },
        { do: "Combine the predicates", result: "$\\forall b(Batch(b)\\to\\exists r(Record(r)\\land In(r,b)\\land Invalid(r)))$", why: "this matches the English" }
      ], answer: "$\\forall b(Batch(b)\\to\\exists r(Record(r)\\land In(r,b)\\land Invalid(r)))$." }
    ],
    applications: [
      { title: "Invariant checking", background: "Program invariants usually say every reachable state satisfies a property.", numbers: "If a loop visits $6$ states and all $6$ have $balance\\ge0$, the finite check supports $\\forall s\\,Safe(s)$." },
      { title: "Database existence queries", background: "SQL EXISTS is a direct computational form of the existential quantifier.", numbers: "If order $104$ has $3$ line items, then $\\exists r\\,LineItem(r,104)$ is true after the first matching row." },
      { title: "Fairness audits", background: "Audits often require a condition for every group and search for any violating group.", numbers: "Across $5$ groups, if group $4$ has gap $0.08>0.05$, then $\\exists g\\,Violation(g)$ is true." },
      { title: "Optimization statements", background: "Existence and universality describe minimizers precisely.", numbers: "A minimizer $w^\\ast$ satisfies $\\forall w\\,L(w^\\ast)\\le L(w)$; if losses are $[3,1,4]$, index $2$ is a witness." },
      { title: "API contracts", background: "Specifications use quantifiers for promises over all inputs or some returned object.", numbers: "If an endpoint promises every returned id is positive, $100$ returned ids require $100$ positivity checks." },
      { title: "Graph reachability", background: "Connectivity says every node can reach every other node, a nested universal condition.", numbers: "For $4$ nodes, directed all-pairs reachability has $4\\cdot4=16$ ordered pairs to verify." }
    ],
    applicationsClose: "Quantifiers are small symbols with large force: they decide whether we need one witness, every case, or one witness shared by every case.",
    takeaways: [
      "$\\forall$ means every object in the domain; $\\exists$ means at least one object in the domain.",
      "Negating a quantifier switches $\\forall$ and $\\exists$ and negates the predicate.",
      "Quantifier order matters because witnesses may be shared or depend on earlier variables.",
      "Domains are part of meaning, not a side detail."
    ]
  },

  "math-16-06": {
    id: "math-16-06",
    title: "Formal semantics",
    tagline: "Formal semantics explains exactly what must be true in a structure for a formula to be true.",
    connections: {
      buildsOn: ["Predicate (first-order) logic", "Quantifiers", "Logical equivalence"],
      leadsTo: ["Natural deduction", "Soundness and completeness", "The ZFC axioms"],
      usedWith: ["models", "relations", "functions", "set membership"]
    },
    motivation:
      "<p>Symbols alone do not know what they mean. The formula $R(a,b)$ could talk about less-than, friendship, an edge in a graph, or a database row.</p>" +
      "<p><b>Formal semantics</b> supplies the missing world. It says what the domain is, what each name denotes, which tuples make each relation true, and then how the truth of a whole formula is computed.</p>",
    definition:
      "<p>A <b>structure</b> or <b>model</b> $\\mathcal M$ for a first-order language consists of a nonempty domain $D$ plus interpretations of constants, function symbols, and relation symbols. We write $\\mathcal M\\models\\varphi$ when formula $\\varphi$ is true in $\\mathcal M$.</p>" +
      "<p>Truth is defined recursively: atomic formulas are checked by the interpretation; $\\neg$, $\\land$, and $\\lor$ use truth-function rules; $\\forall x\\,\\varphi$ is true when $\\varphi$ is true for every object assigned to $x$; and $\\exists x\\,\\varphi$ is true when some object assigned to $x$ makes $\\varphi$ true.</p>" +
      "<p><b>Assumptions that matter:</b> domains are usually required nonempty in standard first-order semantics; free variables need an assignment before truth is evaluated; sentences have no free variables; and semantic consequence $\\Gamma\\models\\varphi$ means every model of all formulas in $\\Gamma$ is also a model of $\\varphi$.</p>",
    worked: {
      problem: "Let $D=\\{1,2,3\\}$, interpret $c$ as $2$, and interpret $L(x,y)$ as $x<y$. Decide whether $\\mathcal M\\models\\exists x\\,L(c,x)$.",
      skills: ["structures", "interpretations", "existential truth"],
      strategy: "Replace symbols by their meanings in the structure, then search for a witness in the domain.",
      steps: [
        { do: "Interpret the constant", result: "$c^{\\mathcal M}=2$", why: "the structure assigns $c$ to object $2$" },
        { do: "Rewrite the predicate instance", result: "$L(c,x)$ means $2<x$", why: "$L$ is interpreted as less-than" },
        { do: "List possible witnesses", result: "$x=1,2,3$", why: "the domain contains exactly these objects" },
        { do: "Test $x=1$ and $x=2$", result: "$2<1$ is false and $2<2$ is false", why: "neither is greater than $2$" },
        { do: "Test $x=3$", result: "$2<3$ is true", why: "$3$ is a witness" }
      ],
      verify: "The existential statement needs one domain object, and $3$ supplies it.",
      answer: "$\\mathcal M\\models\\exists x\\,L(c,x)$ is true.",
      connects: "Semantics ties the syntax $L(c,x)$ to an actual relation on actual domain objects."
    },
    practice: [
      { problem: "With $D=\\{0,1\\}$ and $P^\\mathcal M=\\{1\\}$, decide $\\mathcal M\\models P(0)\\lor P(1)$.", steps: [
        { do: "Interpret $P(0)$", result: "$F$", why: "$0\\notin P^\\mathcal M$" },
        { do: "Interpret $P(1)$", result: "$T$", why: "$1\\in P^\\mathcal M$" },
        { do: "Apply $\\lor$", result: "$F\\lor T=T$", why: "or needs at least one true part" },
        { do: "State satisfaction", result: "$\\mathcal M\\models P(0)\\lor P(1)$", why: "the sentence is true in the structure" }
      ], answer: "The sentence is true in $\\mathcal M$." },
      { problem: "Let $D=\\{a,b\\}$ and $R^\\mathcal M=\\{(a,a),(a,b)\\}$. Is $\\forall y\\,R(a,y)$ true?", steps: [
        { do: "List $y$ values", result: "$a,b$", why: "universal truth checks every domain object" },
        { do: "Check $R(a,a)$", result: "$T$", why: "$(a,a)$ is in the relation" },
        { do: "Check $R(a,b)$", result: "$T$", why: "$(a,b)$ is in the relation" },
        { do: "Apply the universal quantifier", result: "$T$", why: "all instances are true" }
      ], answer: "$\\forall y\\,R(a,y)$ is true in this structure." },
      { problem: "Using the same relation $R^\\mathcal M=\\{(a,a),(a,b)\\}$, is $\\forall x\\exists y\\,R(x,y)$ true?", steps: [
        { do: "Check $x=a$", result: "choose $y=a$", why: "$R(a,a)$ is true" },
        { do: "Check $x=b$", result: "no pair $(b,y)$ is in $R^\\mathcal M$", why: "the relation has no first coordinate $b$" },
        { do: "Find the counterexample", result: "$x=b$", why: "universal statements fail from one bad object" },
        { do: "State satisfaction", result: "$\\mathcal M\\not\\models\\forall x\\exists y\\,R(x,y)$", why: "not every $x$ has an outgoing related object" }
      ], answer: "The sentence is false." },
      { problem: "If every model of $\\Gamma$ makes $A$ true, and every model of $\\Gamma$ makes $A\\to B$ true, show $\\Gamma\\models B$.", steps: [
        { do: "Choose an arbitrary model of $\\Gamma$", result: "$\\mathcal M\\models\\Gamma$", why: "semantic consequence is about all such models" },
        { do: "Use the first assumption", result: "$\\mathcal M\\models A$", why: "every model of $\\Gamma$ satisfies $A$" },
        { do: "Use the second assumption", result: "$\\mathcal M\\models A\\to B$", why: "every model of $\\Gamma$ satisfies the implication" },
        { do: "Apply implication truth", result: "$\\mathcal M\\models B$", why: "$A$ true and $A\\to B$ true force $B$ true" },
        { do: "Generalize over models", result: "$\\Gamma\\models B$", why: "the chosen model was arbitrary" }
      ], answer: "$\\Gamma\\models B$." },
      { problem: "In a graph structure with nodes $\\{1,2,3\\}$ and edges $(1,2),(2,3)$, evaluate $\\exists x\\exists y\\,Edge(x,y)\\land Edge(y,3)$.", steps: [
        { do: "Look for a second edge ending at $3$", result: "$Edge(2,3)$", why: "the relation includes $(2,3)$" },
        { do: "Set $y=2$", result: "$Edge(y,3)$ is true", why: "$y=2$ makes the second predicate true" },
        { do: "Find an incoming edge to $y=2$", result: "$Edge(1,2)$", why: "the relation includes $(1,2)$" },
        { do: "Set $x=1$", result: "$Edge(x,y)$ is true", why: "$x=1,y=2$ fits the first predicate" },
        { do: "Combine the witnesses", result: "$x=1,y=2$", why: "both conjuncts are true together" }
      ], answer: "The sentence is true, witnessed by $x=1$ and $y=2$." }
    ],
    applications: [
      { title: "Model checking", background: "Model checking evaluates formal sentences against finite transition systems. It is semantics made executable.", numbers: "A system with $8$ states can check $\\forall s\\,Safe(s)$ by inspecting $8$ state assignments." },
      { title: "Database query meaning", background: "A database instance is a finite structure; a query is a formula evaluated in that structure.", numbers: "If relation Purchase has $5000$ tuples, an atomic predicate Purchase(u,i) is true exactly for those $5000$ stored pairs." },
      { title: "Knowledge-base reasoning", background: "Automated reasoners ask which facts are true in every model of a knowledge base.", numbers: "If $10$ rules imply $Parent(A,B)\\to Ancestor(A,B)$ and $Parent(A,B)$, then every model satisfying both makes Ancestor true." },
      { title: "Graph properties", background: "Graphs become structures with an edge relation, so logical sentences can define local graph patterns.", numbers: "A triangle sentence checks triples; a graph with $6$ nodes has $6^3=216$ ordered triples to consider naively." },
      { title: "Program states", background: "Formal specifications interpret variables over states and heaps. Satisfaction says a state meets the specification.", numbers: "If a heap has $20$ allocated addresses, a predicate Alloc(x) is checked over those $20$ objects." },
      { title: "ML constraint verification", background: "Constrained ML systems sometimes verify that all examples in a slice satisfy a postcondition.", numbers: "For $300$ examples in a slice, $\\forall x\\,Score(x)\\le0.9$ requires $300$ semantic checks of the score predicate." }
    ],
    applicationsClose: "Formal semantics is the truth contract: syntax says what is written, and a structure says what it means.",
    takeaways: [
      "A structure gives a domain plus meanings for constants, functions, and relations.",
      "$\\mathcal M\\models\\varphi$ means $\\varphi$ is true in structure $\\mathcal M$.",
      "Quantifier truth is evaluated by ranging over objects in the domain.",
      "Semantic consequence means truth in every model of the premises."
    ]
  },

  "math-16-07": {
    id: "math-16-07",
    title: "Natural deduction",
    tagline: "Natural deduction models proof as a sequence of small justified moves from assumptions to conclusion.",
    connections: {
      buildsOn: ["Propositional logic and truth tables", "Logical equivalence", "Quantifiers"],
      leadsTo: ["Soundness and completeness", "Formal semantics", "The ZFC axioms"],
      usedWith: ["proofs", "implication", "conjunction", "quantifiers"]
    },
    motivation:
      "<p>A truth table proves a propositional claim by exhaustion, but mathematicians often prove by reasoning locally: assume this, combine that, discharge an assumption, conclude an implication.</p>" +
      "<p><b>Natural deduction</b> formalizes those local moves. Each rule is tiny enough to trust, and a proof is a chain of such trustworthy steps.</p>",
    definition:
      "<p>A natural-deduction proof derives a conclusion from assumptions using introduction and elimination rules for connectives and quantifiers. For example, from $A\\land B$ we may infer $A$ by conjunction elimination; from $A$ and $B$ we may infer $A\\land B$ by conjunction introduction; from $A$ and $A\\to B$ we may infer $B$ by implication elimination, also called modus ponens.</p>" +
      "<p>To prove $A\\to B$, one temporarily assumes $A$, derives $B$, and then discharges the assumption to conclude the implication. To prove $\\forall x\\,P(x)$, one argues for an arbitrary object $x$ with no special assumptions about it.</p>" +
      "<p><b>Assumptions that matter:</b> every line must be justified by a rule or an active assumption; discharged assumptions cannot be used after their subproof closes; and universal introduction requires the chosen object to be arbitrary, not special.</p>",
    worked: {
      problem: "Give a natural-deduction proof of $(P\\land Q)\\to P$.",
      skills: ["conditional proof", "conjunction elimination", "assumption discharge"],
      strategy: "To prove an implication, assume the antecedent and derive the consequent.",
      steps: [
        { do: "Assume the antecedent", result: "$P\\land Q$", why: "conditional proof begins by assuming what comes before $\\to$" },
        { do: "Apply conjunction elimination", result: "$P$", why: "from $P\\land Q$, either conjunct may be extracted" },
        { do: "Close the subproof", result: "$P$ was derived from assumption $P\\land Q$", why: "the consequent has been reached" },
        { do: "Introduce the implication", result: "$(P\\land Q)\\to P$", why: "discharge the temporary assumption" }
      ],
      verify: "The only assumption used inside the subproof was the antecedent, and it was properly discharged when the implication was introduced.",
      answer: "Assume $P\\land Q$; infer $P$; therefore $(P\\land Q)\\to P$.",
      connects: "Natural deduction proves the tautology by a local rule rather than by checking all truth-table rows."
    },
    practice: [
      { problem: "Derive $Q\\land P$ from assumptions $P$ and $Q$.", steps: [
        { do: "List the first assumption", result: "$P$", why: "given premise" },
        { do: "List the second assumption", result: "$Q$", why: "given premise" },
        { do: "Choose the desired order", result: "$Q$ then $P$", why: "the target conjunction is $Q\\land P$" },
        { do: "Apply conjunction introduction", result: "$Q\\land P$", why: "from two established formulas, we may conjoin them in either order" }
      ], answer: "$Q\\land P$ follows from $P$ and $Q$." },
      { problem: "From $P\\to Q$ and $P$, derive $Q$.", steps: [
        { do: "Write the implication premise", result: "$P\\to Q$", why: "given" },
        { do: "Write the antecedent premise", result: "$P$", why: "given" },
        { do: "Apply implication elimination", result: "$Q$", why: "modus ponens uses $A$ and $A\\to B$ to infer $B$" },
        { do: "State the derivation", result: "$Q$", why: "the consequent follows" }
      ], answer: "$Q$." },
      { problem: "Prove $P\\to(P\\lor Q)$.", steps: [
        { do: "Assume $P$", result: "$P$", why: "conditional proof for an implication" },
        { do: "Apply disjunction introduction", result: "$P\\lor Q$", why: "if $P$ is known, then $P$ or anything is true" },
        { do: "Close the subproof", result: "$P\\lor Q$ follows from $P$", why: "the consequent has been derived" },
        { do: "Introduce the implication", result: "$P\\to(P\\lor Q)$", why: "discharge the assumption $P$" }
      ], answer: "$P\\to(P\\lor Q)$." },
      { problem: "From $P\\land(Q\\land R)$, derive $R\\land P$.", steps: [
        { do: "Use conjunction elimination on the outer conjunction", result: "$P$", why: "extract the left conjunct" },
        { do: "Use conjunction elimination again", result: "$Q\\land R$", why: "extract the right conjunct" },
        { do: "Extract $R$", result: "$R$", why: "conjunction elimination on $Q\\land R$" },
        { do: "Conjoin in target order", result: "$R\\land P$", why: "conjunction introduction combines established formulas" }
      ], answer: "$R\\land P$." },
      { problem: "From $\\forall x(P(x)\\to Q(x))$ and $P(a)$, derive $Q(a)$.", steps: [
        { do: "Instantiate the universal premise at $a$", result: "$P(a)\\to Q(a)$", why: "universal elimination permits any named object" },
        { do: "Use the premise $P(a)$", result: "$P(a)$", why: "given" },
        { do: "Apply implication elimination", result: "$Q(a)$", why: "$P(a)$ and $P(a)\\to Q(a)$ yield $Q(a)$" },
        { do: "State the conclusion", result: "$Q(a)$", why: "the desired instance follows" }
      ], answer: "$Q(a)$." }
    ],
    applications: [
      { title: "Proof assistants", background: "Systems such as Lean, Coq, and Isabelle check proofs by verifying small inference steps, much like natural deduction.", numbers: "A proof with $40$ lines is accepted only if all $40$ justifications type-check." },
      { title: "Program verification", background: "Verification tools derive postconditions from preconditions and code rules.", numbers: "If precondition $P$ and rule $P\\to Q$ are established, one modus ponens step yields postcondition $Q$." },
      { title: "Type checking", background: "The Curry-Howard correspondence links proofs and programs: implication resembles function type, conjunction resembles product type.", numbers: "A pair of values of types $A$ and $B$ constructs one value of type $A\\land B$ by conjunction introduction." },
      { title: "Security policy reasoning", background: "Access decisions often combine credentials and implications from policy rules.", numbers: "Given $Admin(u)$ and $Admin(u)\\to CanDeploy(u)$, one inference derives $CanDeploy(u)$." },
      { title: "Mathematical proof writing", background: "Ordinary proofs become clearer when each move corresponds to a rule.", numbers: "To prove $3$ separate implications, you start $3$ subproofs and discharge $3$ assumptions." },
      { title: "Automated theorem proving", background: "Even when provers use different internals, natural-deduction rules explain why derived conclusions are legitimate.", numbers: "A search that derives $12$ intermediate formulas must justify each by a sound rule or premise." }
    ],
    applicationsClose: "Natural deduction teaches proof as disciplined motion: assume carefully, infer locally, and close assumptions honestly.",
    takeaways: [
      "Natural deduction uses introduction and elimination rules for logical symbols.",
      "Implication introduction proves $A\\to B$ by assuming $A$ and deriving $B$.",
      "Implication elimination is modus ponens: from $A$ and $A\\to B$, infer $B$.",
      "Every proof line needs a rule, premise, or active assumption."
    ]
  },

  "math-16-08": {
    id: "math-16-08",
    title: "Soundness and completeness",
    tagline: "Soundness and completeness connect what proofs can derive with what semantics says must be true.",
    connections: {
      buildsOn: ["Natural deduction", "Formal semantics", "Logical equivalence"],
      leadsTo: ["Naive set theory", "The ZFC axioms", "model theory"],
      usedWith: ["proof systems", "models", "semantic consequence", "formal theories"]
    },
    motivation:
      "<p>Proof and truth are two different viewpoints. A proof is syntactic: lines of symbols justified by rules. Truth is semantic: what holds in every model.</p>" +
      "<p><b>Soundness</b> and <b>completeness</b> are the bridge. Soundness says proofs never lie. Completeness says, for first-order logic, every semantic consequence has a proof.</p>",
    definition:
      "<p>Write $\\Gamma\\vdash\\varphi$ when formula $\\varphi$ is derivable from premises $\\Gamma$ in a proof system. Write $\\Gamma\\models\\varphi$ when every model that satisfies all formulas in $\\Gamma$ also satisfies $\\varphi$.</p>" +
      "<p>A proof system is <b>sound</b> if $\\Gamma\\vdash\\varphi$ always implies $\\Gamma\\models\\varphi$. It is <b>complete</b> if $\\Gamma\\models\\varphi$ always implies $\\Gamma\\vdash\\varphi$. For standard first-order logic, Gödel's completeness theorem says there are proof systems that are both sound and complete.</p>" +
      "<p><b>Assumptions that matter:</b> completeness here is about first-order logical consequence, not about every mathematical theory deciding every sentence; Gödel's incompleteness theorems are different results about sufficiently strong arithmetic theories; and soundness depends on every inference rule preserving truth.</p>",
    worked: {
      problem: "Suppose a proof system has modus ponens, and $\\Gamma\\vdash A$ and $\\Gamma\\vdash A\\to B$. Use soundness to show $\\Gamma\\models B$.",
      skills: ["derivability", "semantic consequence", "soundness"],
      strategy: "Soundness turns each derivation into semantic truth, then semantics of implication gives the conclusion.",
      steps: [
        { do: "Use soundness on $\\Gamma\\vdash A$", result: "$\\Gamma\\models A$", why: "derivable statements are true in every model of the premises" },
        { do: "Use soundness on $\\Gamma\\vdash A\\to B$", result: "$\\Gamma\\models A\\to B$", why: "the implication is also true in every model of $\\Gamma$" },
        { do: "Choose an arbitrary model", result: "$\\mathcal M\\models\\Gamma$", why: "semantic consequence checks all models of the premises" },
        { do: "Apply the two semantic facts", result: "$\\mathcal M\\models A$ and $\\mathcal M\\models A\\to B$", why: "the model satisfies everything entailed by $\\Gamma$" },
        { do: "Use implication truth", result: "$\\mathcal M\\models B$", why: "true antecedent and true implication force the consequent" },
        { do: "Generalize", result: "$\\Gamma\\models B$", why: "the model of $\\Gamma$ was arbitrary" }
      ],
      verify: "No special model was chosen, so the argument applies to every model satisfying $\\Gamma$.",
      answer: "$\\Gamma\\models B$.",
      connects: "Soundness guarantees that formal proof steps preserve semantic truth."
    },
    practice: [
      { problem: "Classify the claim: if $\\Gamma\\vdash\\varphi$, then $\\Gamma\\models\\varphi$.", steps: [
        { do: "Identify the left side", result: "$\\Gamma\\vdash\\varphi$", why: "this is syntactic derivability" },
        { do: "Identify the right side", result: "$\\Gamma\\models\\varphi$", why: "this is semantic consequence" },
        { do: "Read the direction", result: "proof implies truth in all models", why: "derivability comes first" },
        { do: "Name the property", result: "soundness", why: "sound systems do not prove semantically invalid conclusions" }
      ], answer: "This is soundness." },
      { problem: "Classify the claim: if $\\Gamma\\models\\varphi$, then $\\Gamma\\vdash\\varphi$.", steps: [
        { do: "Identify semantic consequence", result: "$\\Gamma\\models\\varphi$", why: "truth in every model is assumed" },
        { do: "Identify derivability", result: "$\\Gamma\\vdash\\varphi$", why: "a formal proof is concluded" },
        { do: "Read the direction", result: "truth in all models implies proof", why: "semantics comes first" },
        { do: "Name the property", result: "completeness", why: "complete systems can prove every logical consequence" }
      ], answer: "This is completeness." },
      { problem: "A proof system proves $P\\land\\neg P$ from no premises. Explain why it is not sound for ordinary semantics.", steps: [
        { do: "State the derivation", result: "$\\vdash P\\land\\neg P$", why: "the system proves the contradiction without premises" },
        { do: "Check a valuation", result: "if $P=T$, then $\\neg P=F$", why: "a proposition and its negation cannot both be true" },
        { do: "Check the other valuation", result: "if $P=F$, then $P$ is false", why: "the conjunction still fails" },
        { do: "State semantic status", result: "$\\not\\models P\\land\\neg P$", why: "no valuation makes it true" },
        { do: "Conclude", result: "not sound", why: "it proves something not semantically valid" }
      ], answer: "The system is not sound." },
      { problem: "Assume a first-order proof system is complete. If no model of $\\Gamma\\cup\\{\\neg\\varphi\\}$ exists, what can be derived from $\\Gamma$?", steps: [
        { do: "Interpret no countermodel", result: "every model of $\\Gamma$ satisfies $\\varphi$", why: "a model of $\\Gamma$ with $\\neg\\varphi$ would be a counterexample" },
        { do: "Write semantic consequence", result: "$\\Gamma\\models\\varphi$", why: "all models of $\\Gamma$ make $\\varphi$ true" },
        { do: "Use completeness", result: "$\\Gamma\\vdash\\varphi$", why: "semantic consequence has a formal proof" },
        { do: "State the derivation", result: "$\\varphi$ is derivable from $\\Gamma$", why: "that is what $\\vdash$ records" }
      ], answer: "$\\Gamma\\vdash\\varphi$." },
      { problem: "A solver searches for a model of $A\\land\\neg B$ and reports none. If the search is complete for finite Boolean formulas, what equivalence-style conclusion follows?", steps: [
        { do: "Interpret the failed search", result: "$A\\land\\neg B$ is unsatisfiable", why: "no truth assignment makes it true" },
        { do: "Convert unsatisfiability", result: "no row has $A=T$ and $B=F$", why: "that is the only way $A\\to B$ fails" },
        { do: "State semantic consequence", result: "$A\\models B$", why: "every assignment satisfying $A$ also satisfies $B$" },
        { do: "Use completeness of the Boolean procedure", result: "a proof or certificate can establish $A\\to B$", why: "complete search did not miss a counterexample" }
      ], answer: "$A$ semantically entails $B$, equivalently $A\\to B$ is valid." }
    ],
    applications: [
      { title: "Theorem provers", background: "A theorem prover is trusted only if its proof kernel is sound; otherwise it could certify false theorems.", numbers: "If a kernel has $12$ inference rules, soundness requires all $12$ rules preserve truth." },
      { title: "SAT solvers", background: "SAT solvers return satisfying assignments or unsatisfiability certificates. Completeness means they eventually find an answer for finite Boolean formulas.", numbers: "A formula on $20$ variables has $2^{20}=1,048,576$ possible assignments in the brute-force space." },
      { title: "Type systems", background: "Type soundness says well-typed programs do not get stuck in certain bad ways. It is a programming-language cousin of logical soundness.", numbers: "If $1000$ compiled expressions are well-typed, soundness promises each obeys the type rules at runtime under the model." },
      { title: "Model checking certificates", background: "Verification tools distinguish proof certificates from semantic counterexamples.", numbers: "A counterexample trace of length $7$ demonstrates failure by giving $7$ concrete states, not merely a failed proof." },
      { title: "Mathematical foundations", background: "Completeness for first-order logic explains why semantic consequence and formal derivability match at the level of pure logic.", numbers: "If $\\Gamma$ has $30$ axioms and semantically entails $\\varphi$, completeness says some finite proof uses only finitely many of those axioms." },
      { title: "ML constraint solvers", background: "Constraint solvers used in ML pipelines rely on sound encodings and complete search within a chosen fragment.", numbers: "For $10$ Boolean constraints over $8$ flags, a complete solver can rule out all $2^8=256$ assignments if unsatisfiable." }
    ],
    applicationsClose: "Soundness protects us from false proofs; completeness reassures us that semantic truth is not beyond proof's reach in first-order logic.",
    takeaways: [
      "$\\Gamma\\vdash\\varphi$ means derivable by proof rules; $\\Gamma\\models\\varphi$ means true in every model of $\\Gamma$.",
      "Soundness is proof implies semantic consequence.",
      "Completeness is semantic consequence implies proof.",
      "First-order completeness is different from Gödel's incompleteness theorems for strong arithmetic theories."
    ]
  },

  "math-16-09": {
    id: "math-16-09",
    title: "Naive set theory",
    tagline: "Naive set theory gives us the everyday language of membership, subsets, unions, and intersections.",
    connections: {
      buildsOn: ["Predicate (first-order) logic", "Quantifiers", "Logical equivalence"],
      leadsTo: ["The ZFC axioms", "relations", "functions"],
      usedWith: ["logic", "functions", "relations", "cardinality"]
    },
    motivation:
      "<p>Sets are the containers mathematics reaches for constantly: a dataset, a domain, the selected features, the possible labels, the neighbors of a node.</p>" +
      "<p><b>Naive set theory</b> gives the working vocabulary. We learn membership, subset, union, intersection, difference, and power set, while also noticing why unrestricted set-building can be dangerous.</p>",
    definition:
      "<p>A <b>set</b> is a collection of distinct objects called elements. We write $x\\in A$ when $x$ is an element of $A$, and $A\\subseteq B$ when every element of $A$ is also an element of $B$. The union $A\\cup B$ contains elements in $A$ or $B$; the intersection $A\\cap B$ contains elements in both; and the difference $A\\setminus B$ contains elements in $A$ but not in $B$.</p>" +
      "<p>The power set $\\mathcal P(A)$ is the set of all subsets of $A$. If $A$ has $n$ elements, then $\\mathcal P(A)$ has $2^n$ elements because each element is either included or not included in a subset.</p>" +
      "<p><b>Assumptions that matter:</b> sets do not count duplicates or order; subset inclusion is about every element, not size alone; naive comprehension must be restricted to avoid paradoxes such as Russell's set of all sets that do not contain themselves.</p>",
    worked: {
      problem: "Let $A=\\{1,2,3\\}$ and $B=\\{3,4\\}$. Compute $A\\cup B$, $A\\cap B$, $A\\setminus B$, and $\\mathcal P(B)$.",
      skills: ["union", "intersection", "difference", "power set"],
      strategy: "Check membership element by element, then list all subsets of the smaller set.",
      steps: [
        { do: "List elements appearing in either set", result: "$1,2,3,4$", why: "union keeps anything in $A$ or $B$" },
        { do: "Write the union", result: "$A\\cup B=\\{1,2,3,4\\}$", why: "duplicates such as $3$ appear once" },
        { do: "Find common elements", result: "$3$", why: "intersection keeps elements in both sets" },
        { do: "Write the intersection", result: "$A\\cap B=\\{3\\}$", why: "$3$ is the only shared element" },
        { do: "Remove elements of $B$ from $A$", result: "$A\\setminus B=\\{1,2\\}$", why: "$3$ is removed because it is in $B$" },
        { do: "List subsets of $B$", result: "$\\mathcal P(B)=\\{\\varnothing,\\{3\\},\\{4\\},\\{3,4\\}\\}$", why: "a two-element set has $2^2=4$ subsets" }
      ],
      verify: "The union has no duplicate $3$, and the power set count $4$ matches $2^{|B|}=2^2$.",
      answer: "$A\\cup B=\\{1,2,3,4\\}$, $A\\cap B=\\{3\\}$, $A\\setminus B=\\{1,2\\}$, and $\\mathcal P(B)=\\{\\varnothing,\\{3\\},\\{4\\},\\{3,4\\}\\}$.",
      connects: "Set operations are logical connectives applied to membership."
    },
    practice: [
      { problem: "For $C=\\{a,b,c\\}$ and $D=\\{b,c,d\\}$, compute $C\\cap D$ and $C\\cup D$.", steps: [
        { do: "Find shared elements", result: "$b,c$", why: "both appear in $C$ and $D$" },
        { do: "Write the intersection", result: "$C\\cap D=\\{b,c\\}$", why: "intersection keeps shared elements" },
        { do: "List all elements appearing at least once", result: "$a,b,c,d$", why: "union keeps elements from either set" },
        { do: "Write the union", result: "$C\\cup D=\\{a,b,c,d\\}$", why: "duplicates are written once" }
      ], answer: "$C\\cap D=\\{b,c\\}$ and $C\\cup D=\\{a,b,c,d\\}$." },
      { problem: "Decide whether $\\{1,3\\}\\subseteq\\{1,2,3,4\\}$.", steps: [
        { do: "Check element $1$", result: "$1\\in\\{1,2,3,4\\}$", why: "first element is contained" },
        { do: "Check element $3$", result: "$3\\in\\{1,2,3,4\\}$", why: "second element is contained" },
        { do: "Apply subset definition", result: "true", why: "every element of the first set is in the second" },
        { do: "State inclusion", result: "$\\{1,3\\}\\subseteq\\{1,2,3,4\\}$", why: "the definition is satisfied" }
      ], answer: "Yes, it is a subset." },
      { problem: "List $\\mathcal P(\\{x,y,z\\})$ and count its elements.", steps: [
        { do: "List the empty subset", result: "$\\varnothing$", why: "every set has the empty subset" },
        { do: "List one-element subsets", result: "$\\{x\\},\\{y\\},\\{z\\}$", why: "choose one of three elements" },
        { do: "List two-element subsets", result: "$\\{x,y\\},\\{x,z\\},\\{y,z\\}$", why: "choose two of three elements" },
        { do: "List the full subset", result: "$\\{x,y,z\\}$", why: "a set is a subset of itself" },
        { do: "Count the subsets", result: "$8$", why: "$2^3=8$" }
      ], answer: "$\\mathcal P(\\{x,y,z\\})=\\{\\varnothing,\\{x\\},\\{y\\},\\{z\\},\\{x,y\\},\\{x,z\\},\\{y,z\\},\\{x,y,z\\}\\}$, with $8$ elements." },
      { problem: "Prove by element reasoning that $A\\cap B\\subseteq A$.", steps: [
        { do: "Choose an arbitrary element", result: "let $x\\in A\\cap B$", why: "subset proofs start with an arbitrary element of the left set" },
        { do: "Unpack intersection", result: "$x\\in A$ and $x\\in B$", why: "membership in an intersection means membership in both" },
        { do: "Keep the needed part", result: "$x\\in A$", why: "the target set is $A$" },
        { do: "Generalize", result: "$A\\cap B\\subseteq A$", why: "the arbitrary element of $A\\cap B$ was shown to be in $A$" }
      ], answer: "$A\\cap B\\subseteq A$." },
      { problem: "A dataset has label set $Y=\\{cat,dog,bird\\}$ and predicted labels $P=\\{cat,dog,fox\\}$. Compute missing true labels and out-of-vocabulary predictions.", steps: [
        { do: "Compute true labels not predicted", result: "$Y\\setminus P=\\{bird\\}$", why: "$bird$ is in $Y$ but not in $P$" },
        { do: "Compute predictions not in the label set", result: "$P\\setminus Y=\\{fox\\}$", why: "$fox$ is predicted but not allowed by $Y$" },
        { do: "Compute shared labels", result: "$Y\\cap P=\\{cat,dog\\}$", why: "these appear in both sets" },
        { do: "Count shared labels", result: "$2$", why: "there are two common elements" }
      ], answer: "Missing true label: $\\{bird\\}$; out-of-vocabulary prediction: $\\{fox\\}$; shared labels: $\\{cat,dog\\}$." }
    ],
    applications: [
      { title: "Dataset splits", background: "Training, validation, and test splits are sets of examples. Clean experiments require disjointness.", numbers: "If train has $8000$ ids, validation $1000$, and intersection size $0$, then no validation id leaks into training." },
      { title: "Feature selection", background: "Selected features form a subset of all available features. Subset language makes feature pipelines auditable.", numbers: "Choosing $12$ features from $50$ means $S\\subseteq F$ with $|S|=12$ and $|F|=50$." },
      { title: "Search result merging", background: "Information retrieval combines result sets from multiple queries using union and intersection.", numbers: "If query A returns $40$ docs, query B returns $30$, and $10$ overlap, then $|A\\cup B|=40+30-10=60$." },
      { title: "Graph neighborhoods", background: "A node's neighbors form a set. Common-neighbor methods use intersections.", numbers: "If $N(u)=\\{1,2,5\\}$ and $N(v)=\\{2,3,5\\}$, then common neighbors are $\\{2,5\\}$, count $2$." },
      { title: "Access control", background: "Permissions are naturally sets. A user can act when required permissions are a subset of held permissions.", numbers: "If required $R=\\{read,write\\}$ and held $H=\\{read,write,admin\\}$, then $R\\subseteq H$ is true." },
      { title: "Power sets in model search", background: "Trying every feature subset means searching a power set, which grows exponentially.", numbers: "For $20$ candidate features, there are $2^{20}=1,048,576$ possible subsets." }
    ],
    applicationsClose: "Sets give mathematics and computing a common language for membership, selection, overlap, and possibility.",
    takeaways: [
      "$x\\in A$ means membership; $A\\subseteq B$ means every element of $A$ is in $B$.",
      "Union corresponds to or; intersection corresponds to and; complement or difference corresponds to not.",
      "A set ignores order and duplicates.",
      "A set with $n$ elements has $2^n$ subsets."
    ]
  },

  "math-16-10": {
    id: "math-16-10",
    title: "The ZFC axioms",
    tagline: "ZFC is a careful foundation for sets, strong enough for ordinary mathematics and cautious enough to avoid naive paradoxes.",
    connections: {
      buildsOn: ["Naive set theory", "Formal semantics", "Quantifiers"],
      leadsTo: ["relations", "functions", "cardinality", "measure theory"],
      usedWith: ["logic", "proofs", "set operations", "mathematical foundations"]
    },
    motivation:
      "<p>Naive set theory is wonderfully useful until it lets us form dangerous collections such as the set of all sets that do not contain themselves. That paradox tells us the rules need guardrails.</p>" +
      "<p><b>ZFC</b>, Zermelo-Fraenkel set theory with Choice, gives those guardrails. It does not try to define sets by intuition alone; it states axioms that control which sets exist and how they behave.</p>",
    definition:
      "<p>ZFC is a first-order theory whose only non-logical relation is membership $\\in$. Its axioms include Extensionality, Empty Set, Pairing, Union, Power Set, Infinity, Separation, Replacement, Foundation, and Choice. Together they support ordinary constructions of numbers, functions, products, sequences, and spaces.</p>" +
      "<p>Extensionality says sets with the same elements are equal: $\\forall A\\forall B(\\forall x(x\\in A\\leftrightarrow x\\in B)\\to A=B)$. Separation says we may carve a subset from an already existing set using a property, rather than forming an unrestricted set of all objects satisfying that property. That restriction is one way ZFC avoids Russell's paradox.</p>" +
      "<p><b>Assumptions that matter:</b> ZFC is not a single axiom but a theory; Separation and Replacement are axiom schemas with one instance for each formula; Choice is independent of the other ZF axioms if ZF is consistent; and ZFC is a foundation, not a daily requirement for every calculation.</p>",
    worked: {
      problem: "Use Extensionality to show $\\{1,2,2\\}=\\{2,1\\}$ as sets.",
      skills: ["extensionality", "membership", "set equality"],
      strategy: "Sets are equal when they have the same members, not when their listings look identical.",
      steps: [
        { do: "List the members of the first display", result: "$1$ and $2$", why: "duplicates do not create new elements" },
        { do: "List the members of the second display", result: "$2$ and $1$", why: "order does not matter for membership" },
        { do: "Check membership left to right", result: "every element of $\\{1,2,2\\}$ is in $\\{2,1\\}$", why: "$1$ and $2$ both appear" },
        { do: "Check membership right to left", result: "every element of $\\{2,1\\}$ is in $\\{1,2,2\\}$", why: "$2$ and $1$ both appear" },
        { do: "Apply Extensionality", result: "$\\{1,2,2\\}=\\{2,1\\}$", why: "same elements imply same set" }
      ],
      verify: "Any membership question has the same answer for both displays: $1$ yes, $2$ yes, any other object no.",
      answer: "They are the same set by Extensionality.",
      connects: "ZFC begins by making set equality depend only on membership."
    },
    practice: [
      { problem: "Which ZFC axiom justifies forming $\\{a,b\\}$ from objects $a$ and $b$?", steps: [
        { do: "Identify the desired set", result: "$\\{a,b\\}$", why: "it contains exactly the two specified objects" },
        { do: "Recall Pairing", result: "for any $a,b$ there exists a set containing exactly $a$ and $b$", why: "this is the axiom's purpose" },
        { do: "Match the construction", result: "Pairing applies", why: "the target is an unordered pair" },
        { do: "State the axiom", result: "Pairing", why: "it creates the two-element set" }
      ], answer: "The Pairing axiom." },
      { problem: "If $A=\\{\\{1\\},\\{2,3\\}\\}$, what set does the Union axiom support forming as $\\bigcup A$?", steps: [
        { do: "List members of members of $A$", result: "$1,2,3$", why: "union collects elements from each set inside $A$" },
        { do: "Collect them into one set", result: "$\\{1,2,3\\}$", why: "duplicates would be ignored if present" },
        { do: "Name the construction", result: "$\\bigcup A=\\{1,2,3\\}$", why: "Union flattens one level of membership" },
        { do: "State the supporting axiom", result: "Union axiom", why: "it guarantees this collected set exists" }
      ], answer: "$\\bigcup A=\\{1,2,3\\}$, supported by the Union axiom." },
      { problem: "Use Separation to form the even elements of $S=\\{1,2,3,4,5,6\\}$.", steps: [
        { do: "Start with the existing set", result: "$S=\\{1,2,3,4,5,6\\}$", why: "Separation carves subsets from an existing set" },
        { do: "Apply the property", result: "$x$ is even", why: "the formula decides which elements remain" },
        { do: "Select satisfying elements", result: "$2,4,6$", why: "these are divisible by $2$" },
        { do: "Write the subset", result: "$\\{x\\in S:x$ is even$\\}=\\{2,4,6\\}$", why: "only elements already in $S$ are collected" }
      ], answer: "$\\{2,4,6\\}$." },
      { problem: "Explain why unrestricted comprehension differs from Separation for the property $x\\notin x$.", steps: [
        { do: "State unrestricted comprehension", result: "form $R=\\{x:x\\notin x\\}$", why: "it collects from all objects without a prior bounding set" },
        { do: "Ask whether $R\\in R$", result: "$R\\in R\\leftrightarrow R\\notin R$", why: "substitute $R$ into its own defining property" },
        { do: "Recognize the contradiction", result: "impossible", why: "a statement cannot be equivalent to its negation in this way" },
        { do: "State Separation's restriction", result: "$\\{x\\in A:x\\notin x\\}$", why: "the subset must come from an already existing set $A$" },
        { do: "Conclude the difference", result: "Separation avoids the unrestricted paradox", why: "it does not create a universal collection of all such $x$" }
      ], answer: "Unrestricted comprehension creates Russell's paradox; Separation only forms bounded subsets of existing sets." },
      { problem: "A feature universe $F$ has $4$ features. Which axiom guarantees the set of all feature subsets, and how many subsets are there?", steps: [
        { do: "Name the desired object", result: "$\\mathcal P(F)$", why: "the power set contains all subsets" },
        { do: "Identify the axiom", result: "Power Set", why: "it guarantees $\\mathcal P(F)$ exists" },
        { do: "Use the subset count", result: "$2^{|F|}=2^4$", why: "each feature is included or excluded" },
        { do: "Compute the count", result: "$16$", why: "$2\\cdot2\\cdot2\\cdot2=16$" }
      ], answer: "The Power Set axiom guarantees $\\mathcal P(F)$, and it has $16$ subsets." }
    ],
    applications: [
      { title: "Foundations of number systems", background: "In standard foundations, natural numbers are built from sets, often starting with $0=\\varnothing$ and $1=\\{\\varnothing\\}$.", numbers: "Then $2=\\{0,1\\}=\\{\\varnothing,\\{\\varnothing\\}\\}$ has exactly $2$ elements." },
      { title: "Power sets and feature search", background: "The Power Set axiom supports the mathematical object containing all subsets, which mirrors exhaustive feature selection.", numbers: "For $12$ candidate features, $|\\mathcal P(F)|=2^{12}=4096$ possible subsets." },
      { title: "Cartesian products as sets", background: "Ordered pairs and products can be constructed from sets, giving relations and functions a foundation.", numbers: "If $|A|=3$ and $|B|=5$, then $|A\\times B|=15$ ordered pairs." },
      { title: "Choice in product selections", background: "The Axiom of Choice says we can select one element from each set in a family, even for infinite families where no explicit rule is given.", numbers: "For $4$ nonempty finite sets with sizes $2,3,5,7$, there are $2\\cdot3\\cdot5\\cdot7=210$ explicit choice functions." },
      { title: "Schemas in data systems", background: "Separation resembles filtering an existing dataset rather than inventing an unrestricted collection.", numbers: "From $10,000$ rows, filtering rows with loss $>1.5$ might produce $230$ rows, a subset of the original table." },
      { title: "Mathematical libraries", background: "Proof assistants need foundations so definitions of sets, functions, and numbers behave consistently.", numbers: "A library theorem about functions $f:A\\to B$ relies on $A$, $B$, and the graph of $f$ being legitimate sets." }
    ],
    applicationsClose: "ZFC is the quiet foundation under ordinary set language: it lets us build boldly, but not recklessly.",
    takeaways: [
      "ZFC is a first-order axiom system for sets with membership as the basic relation.",
      "Extensionality says sets are equal exactly when they have the same elements.",
      "Separation forms subsets of existing sets, avoiding unrestricted comprehension.",
      "Power Set, Union, Pairing, Infinity, Replacement, Foundation, and Choice support the usual mathematical universe."
    ]
  }
};
