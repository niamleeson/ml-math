module.exports = {
  "math-14-01": {
    id: "math-14-01",
    title: "Propositional logic",
    tagline: "Propositional logic teaches you to reason with whole statements before the statements become complicated.",
    connections: {
      buildsOn: ["truth values", "basic algebraic substitution", "careful reading of conditions"],
      leadsTo: ["Predicate logic", "Proof by contradiction", "Boolean algebra"],
      usedWith: ["truth tables", "sets", "relations", "proof methods"]
    },
    motivation:
      "<p>You already make logical decisions every day: if it is raining and you have to walk, take an umbrella. The words if, and, or, and not carry structure that can be studied without knowing anything about weather.</p>" +
      "<p><b>Propositional logic</b> keeps the statements simple and studies how their truth values combine. That small discipline pays off later when code branches, proofs, database filters, and ML rules all need conditions that mean exactly what we think they mean.</p>",
    definition:
      "<p>A <b>proposition</b> is a statement that is either true or false. If $p$ and $q$ are propositions, then $\\neg p$ means not $p$, $p\\land q$ means both are true, $p\\lor q$ means at least one is true, $p\\to q$ means if $p$ then $q$, and $p\\leftrightarrow q$ means they have the same truth value.</p>" +
      "<p>The conditional $p\\to q$ is false only when $p$ is true and $q$ is false. One way to see the equivalence $p\\to q\\equiv \\neg p\\lor q$ is to check the four rows: only the row $p=T,q=F$ makes both expressions false; all other rows are true.</p>" +
      "<p><b>Assumptions that matter:</b> each proposition has exactly one truth value in the situation being analyzed; $\\lor$ is inclusive or unless stated otherwise; and logical equivalence means two formulas have the same truth value in every possible assignment.</p>",
    worked: {
      problem: "Build the truth table for $(p\\to q)\\land p$ and decide whether it logically implies $q$.",
      skills: ["truth tables", "conditionals", "logical implication"],
      strategy: "The expression has nested logic, so evaluate the conditional first, then the conjunction, then compare with $q$.",
      steps: [
        { do: "List all truth assignments", result: "$(T,T),(T,F),(F,T),(F,F)$", why: "two propositions give $2^2=4$ rows" },
        { do: "Evaluate $p\\to q$ on the rows", result: "$T,F,T,T$", why: "a conditional is false only for $p=T,q=F$" },
        { do: "Combine with $p$ using $\\land$", result: "$(p\\to q)\\land p$ has values $T,F,F,F$", why: "and is true only when both parts are true" },
        { do: "Compare the true rows to $q$", result: "the only true row has $q=T$", why: "logical implication checks rows where the premise is true" },
        { do: "State the implication", result: "$(p\\to q)\\land p\\Rightarrow q$", why: "there is no row with true premise and false conclusion" }
      ],
      verify: "This is modus ponens: if the rule holds and the condition happens, the conclusion must happen.",
      answer: "Yes. $(p\\to q)\\land p$ logically implies $q$.",
      connects: "Truth tables turn informal if-then reasoning into row-by-row arithmetic with truth values."
    },
    practice: [
      { problem: "Make the truth table for $p\\land \\neg q$.", steps: [
        { do: "List assignments", result: "$(T,T),(T,F),(F,T),(F,F)$", why: "there are two propositions" },
        { do: "Compute $\\neg q$", result: "$F,T,F,T$", why: "negation flips $q$" },
        { do: "Apply $\\land$ with $p$", result: "$F,T,F,F$", why: "both $p$ and $\\neg q$ must be true" },
        { do: "Identify the true row", result: "$p=T,q=F$", why: "that is the only row with values $T$ and $T$ before and" },
        { do: "State the meaning", result: "true exactly when $p$ is true and $q$ is false", why: "the formula accepts one case" }
      ], answer: "$p\\land\\neg q$ has truth values $F,T,F,F$ in the listed row order." },
      { problem: "Show that $\\neg(p\\land q)$ and $\\neg p\\lor\\neg q$ agree by truth table.", steps: [
        { do: "List values of $p\\land q$", result: "$T,F,F,F$", why: "and needs both propositions true" },
        { do: "Negate that column", result: "$F,T,T,T$", why: "this gives $\\neg(p\\land q)$" },
        { do: "List $\\neg p$", result: "$F,F,T,T$", why: "flip the $p$ column" },
        { do: "List $\\neg q$", result: "$F,T,F,T$", why: "flip the $q$ column" },
        { do: "Compute $\\neg p\\lor\\neg q$", result: "$F,T,T,T$", why: "or is true if at least one negation is true" }
      ], answer: "They are logically equivalent; both columns are $F,T,T,T$." },
      { problem: "Evaluate $(p\\lor q)\\to r$ when $p=F$, $q=T$, and $r=F$.", steps: [
        { do: "Evaluate the disjunction", result: "$p\\lor q=T$", why: "one of $p,q$ is true" },
        { do: "Substitute into the conditional", result: "$(p\\lor q)\\to r$ becomes $T\\to F$", why: "the antecedent is true and $r$ is false" },
        { do: "Apply the conditional rule", result: "$F$", why: "true antecedent with false consequent is the one false case" },
        { do: "Check against English", result: "the promised result did not happen", why: "the condition was met" },
        { do: "State the value", result: "false", why: "the formula fails under this assignment" }
      ], answer: "The proposition is false." },
      { problem: "Decide whether $p\\to q$ and $q\\to p$ are equivalent.", steps: [
        { do: "Choose a test row", result: "$p=T,q=F$", why: "one counterexample is enough to disprove equivalence" },
        { do: "Evaluate $p\\to q$", result: "$T\\to F=F$", why: "this is the false conditional case" },
        { do: "Evaluate $q\\to p$", result: "$F\\to T=T$", why: "a false antecedent makes the conditional true" },
        { do: "Compare the values", result: "$F\\ne T$", why: "equivalent formulas must agree on every row" },
        { do: "State the conclusion", result: "not equivalent", why: "the converse is not the same as the original conditional" }
      ], answer: "$p\\to q$ and $q\\to p$ are not logically equivalent." },
      { problem: "A model rule says deploy if validation passes and not flagged: $d=v\\land\\neg f$. Evaluate $d$ for $(v,f)=(T,F),(T,T),(F,F)$.", steps: [
        { do: "Evaluate the first case", result: "$T\\land\\neg F=T\\land T=T$", why: "validation passes and there is no flag" },
        { do: "Evaluate the second case", result: "$T\\land\\neg T=T\\land F=F$", why: "the flag blocks deployment" },
        { do: "Evaluate the third case", result: "$F\\land\\neg F=F\\land T=F$", why: "failed validation blocks deployment" },
        { do: "List the outputs", result: "$T,F,F$", why: "only the first case deploys" },
        { do: "Interpret", result: "both safety conditions are required", why: "and is strict" }
      ], answer: "The deployment decisions are deploy, do not deploy, do not deploy." }
    ],
    applications: [
      { title: "Program branches", background: "Programming languages inherited Boolean logic from mathematical logic. Every if statement evaluates a proposition before choosing a path.", numbers: "If $p$ is user authenticated and $q$ is quota remaining, then $p\\land q$ is true for $(T,T)$ and false for $(T,F),(F,T),(F,F)$." },
      { title: "Database filters", background: "Query systems use logical connectives to filter rows. A small mistake in and versus or can change many results.", numbers: "For 1000 rows, suppose 300 satisfy $p$, 200 satisfy $q$, and 80 satisfy both. The inclusive-or count is $300+200-80=420$." },
      { title: "Circuit gates", background: "Digital circuits implement logic physically. AND, OR, and NOT gates are propositions made out of voltage levels.", numbers: "An AND gate with inputs $1$ and $0$ outputs $0$; an OR gate on the same inputs outputs $1$." },
      { title: "Rule-based alerts", background: "Monitoring systems combine conditions to avoid noisy pages. Logic states exactly when an alert should fire.", numbers: "If error rate high is $T$, traffic high is $T$, and maintenance is $F$, then $T\\land T\\land\\neg F=T$." },
      { title: "Feature flags", background: "Large systems often enable features only when several safety propositions hold. Logic keeps rollout criteria auditable.", numbers: "If eligible users are 20 percent of 50,000 users and kill switch is false, then about $0.20\\cdot50000=10000$ users can see the feature." },
      { title: "ML decision rules", background: "Even learned systems often end with logical gates, such as thresholds and policy checks. The learned score is numeric, but the release rule is Boolean.", numbers: "If score above $0.8$ is $T$ for 120 items and policy pass is $T$ for 100 of those, an AND rule selects 100 items." }
    ],
    applicationsClose: "Propositional logic is the small grammar behind precise decisions in proofs, programs, circuits, and deployed models.",
    takeaways: [
      "A proposition has one truth value: true or false.",
      "$\\neg$, $\\land$, $\\lor$, $\\to$, and $\\leftrightarrow$ combine propositions in defined ways.",
      "$p\\to q$ is false only when $p$ is true and $q$ is false.",
      "Truth tables prove equivalence and implication by checking every assignment."
    ]
  },

  "math-14-02": {
    id: "math-14-02",
    title: "Predicate logic",
    tagline: "Predicate logic lets a statement speak about many objects without losing precision.",
    connections: {
      buildsOn: ["Propositional logic", "sets", "variables"],
      leadsTo: ["Sets", "Relations", "Proof by contradiction"],
      usedWith: ["quantifiers", "proof methods", "relations", "functions"]
    },
    motivation:
      "<p>Propositional logic treats a sentence as one block. But mathematics often needs a sentence with a variable: $x$ is even, $n$ is prime, user $u$ clicked item $i$. The truth depends on which object you plug in.</p>" +
      "<p><b>Predicate logic</b> adds variables and quantifiers, so we can say all, some, or none with care. This is the language of definitions, database queries, correctness statements, and many ML data conditions.</p>",
    definition:
      "<p>A <b>predicate</b> $P(x)$ is a statement whose truth depends on the object $x$ from a specified <b>domain</b>. The universal statement $\\forall x\\,P(x)$ means $P(x)$ is true for every $x$ in the domain. The existential statement $\\exists x\\,P(x)$ means at least one domain element makes $P(x)$ true.</p>" +
      "<p>Negation swaps the quantifier and negates the predicate: $\\neg\\forall x\\,P(x)\\equiv\\exists x\\,\\neg P(x)$ and $\\neg\\exists x\\,P(x)\\equiv\\forall x\\,\\neg P(x)$. This follows because one counterexample disproves an all-statement, while disproving existence means every possible example fails.</p>" +
      "<p><b>Assumptions that matter:</b> the domain must be stated or understood; the order of mixed quantifiers matters; and a witness for $\\exists$ is one concrete object that makes the predicate true.</p>",
    worked: {
      problem: "Let the domain be $\\{1,2,3,4\\}$ and let $P(x)$ mean $x^2<10$. Evaluate $\\forall x\\,P(x)$ and $\\exists x\\,\\neg P(x)$.",
      skills: ["domains", "universal quantifiers", "existential quantifiers"],
      strategy: "A finite domain can be checked directly: test every object, then look for a counterexample.",
      steps: [
        { do: "Evaluate $P(1)$", result: "$1^2=1<10$, so $P(1)$ is true", why: "substitute the first domain element" },
        { do: "Evaluate $P(2)$", result: "$2^2=4<10$, so $P(2)$ is true", why: "substitute the second element" },
        { do: "Evaluate $P(3)$", result: "$3^2=9<10$, so $P(3)$ is true", why: "substitute the third element" },
        { do: "Evaluate $P(4)$", result: "$4^2=16\\not<10$, so $P(4)$ is false", why: "one element breaks the predicate" },
        { do: "Decide the universal statement", result: "$\\forall x\\,P(x)$ is false", why: "universal claims need every element true" },
        { do: "Decide the existential negation", result: "$\\exists x\\,\\neg P(x)$ is true", why: "$x=4$ is a witness" }
      ],
      verify: "The two answers agree with the negation rule: the universal statement is false exactly because a counterexample exists.",
      answer: "$\\forall x\\,P(x)$ is false, and $\\exists x\\,\\neg P(x)$ is true with witness $x=4$.",
      connects: "Predicate logic turns counterexamples and witnesses into precise mathematical objects."
    },
    practice: [
      { problem: "On domain $\\{2,4,6\\}$, let $E(x)$ mean $x$ is even. Evaluate $\\forall x\\,E(x)$.", steps: [
        { do: "Check $x=2$", result: "$E(2)$ is true", why: "2 is divisible by 2" },
        { do: "Check $x=4$", result: "$E(4)$ is true", why: "4 is divisible by 2" },
        { do: "Check $x=6$", result: "$E(6)$ is true", why: "6 is divisible by 2" },
        { do: "Apply the universal quantifier", result: "$\\forall x\\,E(x)$ is true", why: "every domain element passed" },
        { do: "Name the domain dependence", result: "true on $\\{2,4,6\\}$", why: "a different domain could change the truth" }
      ], answer: "$\\forall x\\,E(x)$ is true on the given domain." },
      { problem: "Negate the statement $\\forall n\\in\\mathbb{Z},\\ n^2\\ge n$.", steps: [
        { do: "Identify the quantifier", result: "$\\forall n$", why: "the statement claims all integers" },
        { do: "Swap the quantifier", result: "$\\exists n$", why: "negating an all-statement asks for a counterexample" },
        { do: "Negate the predicate", result: "$n^2<n$", why: "the opposite of $n^2\\ge n$ is $n^2<n$" },
        { do: "Keep the domain", result: "$n\\in\\mathbb{Z}$", why: "negation does not change where $n$ lives" },
        { do: "Write the full negation", result: "$\\exists n\\in\\mathbb{Z}$ such that $n^2<n$", why: "one integer would disprove the original" }
      ], answer: "$\\exists n\\in\\mathbb{Z}$ such that $n^2<n$." },
      { problem: "Let $R(x,y)$ mean $x<y$ on domain $\\{1,2,3\\}$. Is $\\forall x\\,\\exists y\\,R(x,y)$ true?", steps: [
        { do: "Test $x=1$", result: "choose $y=2$", why: "$1<2$" },
        { do: "Test $x=2$", result: "choose $y=3$", why: "$2<3$" },
        { do: "Test $x=3$", result: "no $y$ in the domain has $3<y$", why: "3 is the largest element" },
        { do: "Apply the universal quantifier", result: "false", why: "every $x$ needed a witness" },
        { do: "Name the counterexample", result: "$x=3$", why: "it has no larger domain element" }
      ], answer: "The statement is false; $x=3$ is a counterexample." },
      { problem: "Compare $\\forall x\\,\\exists y\\,(x<y)$ and $\\exists y\\,\\forall x\\,(x<y)$ on domain $\\{1,2\\}$.", steps: [
        { do: "Evaluate the first for $x=1$", result: "choose $y=2$", why: "$1<2$" },
        { do: "Evaluate the first for $x=2$", result: "no witness", why: "neither 1 nor 2 is greater than 2" },
        { do: "State the first truth value", result: "false", why: "$x=2$ fails" },
        { do: "Test the second with $y=1$", result: "fails for $x=1$", why: "$1<1$ is false" },
        { do: "Test the second with $y=2$", result: "fails for $x=2$", why: "$2<2$ is false" }
      ], answer: "Both are false on $\\{1,2\\}$, but they fail for different quantifier reasons." },
      { problem: "A dataset rule says $\\forall$ rows $r$, if $r$ is in training then $r$ has a label. In 500 training rows, 497 have labels. Is the rule true?", steps: [
        { do: "State the predicate", result: "$T(r)\\to L(r)$", why: "training rows should imply labels" },
        { do: "Count failures", result: "$500-497=3$", why: "three training rows lack labels" },
        { do: "Identify counterexamples", result: "three rows have $T(r)=T$ and $L(r)=F$", why: "that is the false conditional case" },
        { do: "Evaluate the universal claim", result: "false", why: "one counterexample would be enough" },
        { do: "Interpret", result: "the dataset violates the rule", why: "all training rows were required to have labels" }
      ], answer: "No. The universal data-quality rule is false because 3 training rows have no label." }
    ],
    applications: [
      { title: "Database queries", background: "Predicate logic is the mathematical ancestor of query languages. A WHERE clause is a predicate evaluated on each row.", numbers: "If 10,000 rows are checked and 420 satisfy $P(r)$, then $\\exists r\\,P(r)$ is true and $\\forall r\\,P(r)$ is false unless 420 equals 10,000." },
      { title: "Type and contract checking", background: "Software contracts often say every input satisfying a precondition produces an output satisfying a postcondition.", numbers: "If 200 tests satisfy the precondition and 199 satisfy the postcondition, the universal tested claim has 1 observed counterexample." },
      { title: "Data validation", background: "ML pipelines use predicates to state schema rules before training. This prevents silent garbage from entering a model.", numbers: "For predicate $0\\le x\\le1$, values $0.2,0.9,1.3$ give two passes and one counterexample." },
      { title: "Graph properties", background: "Relations on nodes are described with quantifiers. Connectivity and reachability both use there exists a path language.", numbers: "In a 5-node graph, the claim every node has degree at least 2 requires checking 5 degrees; degrees $2,3,2,1,4$ disprove it." },
      { title: "Fairness statements", background: "Fairness constraints often quantify over groups or individuals. The domain must be explicit to avoid vague promises.", numbers: "If 4 groups have selection rates $0.51,0.50,0.49,0.52$, the predicate rate at least $0.50$ fails for one group." },
      { title: "Optimization guarantees", background: "Mathematical ML uses quantified claims such as every gradient step decreases loss under assumptions. The assumptions define the domain.", numbers: "If $L$ drops on 8 of 10 tested steps, that supports but does not prove $\\forall t, L_{t+1}<L_t$; two failures refute it for those steps." }
    ],
    applicationsClose: "Predicate logic is how mathematics says every, some, and none without leaving the domain or witness ambiguous.",
    takeaways: [
      "A predicate becomes true or false only after its variables receive domain values.",
      "$\\forall$ means every domain element; $\\exists$ means at least one witness.",
      "Negating a quantified statement swaps $\\forall$ with $\\exists$ and negates the predicate.",
      "The order of mixed quantifiers can change the meaning."
    ]
  },

  "math-14-03": {
    id: "math-14-03",
    title: "Sets",
    tagline: "Sets give mathematics a clean way to talk about collections, membership, overlap, and choice.",
    connections: {
      buildsOn: ["Predicate logic", "Propositional logic", "counting finite objects"],
      leadsTo: ["Relations", "Functions", "The sum rule"],
      usedWith: ["logic", "Venn diagrams", "cardinality", "Cartesian products"]
    },
    motivation:
      "<p>You already sort things into collections: clicked users, training examples, even numbers, tokens in a vocabulary. A set is the simplest careful version of that idea.</p>" +
      "<p>Once collections have names, we can ask what belongs, what overlaps, what is excluded, and how many possibilities remain. That is the start of both discrete math and practical data reasoning.</p>",
    definition:
      "<p>A <b>set</b> is a collection of distinct objects called elements. We write $x\\in A$ when $x$ is in $A$. The union $A\\cup B$ contains elements in $A$ or $B$; the intersection $A\\cap B$ contains elements in both; the difference $A\\setminus B$ contains elements in $A$ but not $B$.</p>" +
      "<p>For finite sets, the inclusion-exclusion rule $|A\\cup B|=|A|+|B|-|A\\cap B|$ prevents double-counting. Adding $|A|$ and $|B|$ counts the overlap twice, so subtracting the intersection once leaves each element counted exactly once.</p>" +
      "<p><b>Assumptions that matter:</b> sets do not count duplicates; the universe determines complements; $\\subseteq$ allows equality; and cardinality $|A|$ means the number of distinct elements in a finite set.</p>",
    worked: {
      problem: "Let $A=\\{1,2,3,5\\}$ and $B=\\{3,4,5,6\\}$. Find $A\\cup B$, $A\\cap B$, $A\\setminus B$, and $|A\\cup B|$.",
      skills: ["membership", "union", "intersection", "cardinality"],
      strategy: "List distinct elements carefully, then count the union without double-counting the overlap.",
      steps: [
        { do: "List elements in either set", result: "$A\\cup B=\\{1,2,3,4,5,6\\}$", why: "union keeps every distinct element that appears" },
        { do: "List elements in both sets", result: "$A\\cap B=\\{3,5\\}$", why: "intersection keeps common elements" },
        { do: "List elements in $A$ not in $B$", result: "$A\\setminus B=\\{1,2\\}$", why: "remove the common elements from $A$" },
        { do: "Count the union directly", result: "$|A\\cup B|=6$", why: "there are six distinct elements" },
        { do: "Check by inclusion-exclusion", result: "$4+4-2=6$", why: "the overlap $\\{3,5\\}$ was counted twice before subtraction" }
      ],
      verify: "Every element from both original sets appears once in the union, and only 3 and 5 are shared.",
      answer: "$A\\cup B=\\{1,2,3,4,5,6\\}$, $A\\cap B=\\{3,5\\}$, $A\\setminus B=\\{1,2\\}$, and $|A\\cup B|=6$.",
      connects: "Set operations are logical operations applied to membership."
    },
    practice: [
      { problem: "For $C=\\{a,b,c\\}$ and $D=\\{b,c,d,e\\}$, find $C\\cap D$ and $C\\cup D$.", steps: [
        { do: "Compare elements", result: "$b$ and $c$ appear in both", why: "intersection requires shared membership" },
        { do: "Write the intersection", result: "$C\\cap D=\\{b,c\\}$", why: "only common elements remain" },
        { do: "Collect all elements", result: "$a,b,c,d,e$", why: "union includes either set" },
        { do: "Remove duplicates", result: "$C\\cup D=\\{a,b,c,d,e\\}$", why: "sets list distinct elements" },
        { do: "Count if needed", result: "$|C\\cup D|=5$", why: "there are five distinct elements" }
      ], answer: "$C\\cap D=\\{b,c\\}$ and $C\\cup D=\\{a,b,c,d,e\\}$." },
      { problem: "If $|A|=40$, $|B|=25$, and $|A\\cap B|=10$, find $|A\\cup B|$.", steps: [
        { do: "Write inclusion-exclusion", result: "$|A\\cup B|=|A|+|B|-|A\\cap B|$", why: "overlap is counted twice in the sum" },
        { do: "Substitute the counts", result: "$40+25-10$", why: "use the given cardinalities" },
        { do: "Add the first two counts", result: "$65-10$", why: "$40+25=65$" },
        { do: "Subtract the overlap", result: "$55$", why: "remove one duplicate count of the intersection" },
        { do: "Check bounds", result: "$55\\le65$", why: "the union cannot exceed the raw sum" }
      ], answer: "$|A\\cup B|=55$." },
      { problem: "Let the universe be $U=\\{1,2,3,4,5,6\\}$ and $A=\\{2,4,6\\}$. Find $A^c$.", steps: [
        { do: "State the universe", result: "$U=\\{1,2,3,4,5,6\\}$", why: "complement depends on the universe" },
        { do: "Remove elements of $A$", result: "remove $2,4,6$", why: "the complement contains what is not in $A$" },
        { do: "List remaining elements", result: "$1,3,5$", why: "these are in $U$ but not in $A$" },
        { do: "Write the complement", result: "$A^c=\\{1,3,5\\}$", why: "set notation records the result" },
        { do: "Check the partition", result: "$A\\cup A^c=U$", why: "every universe element is either in $A$ or not" }
      ], answer: "$A^c=\\{1,3,5\\}$." },
      { problem: "Find $A\\times B$ for $A=\\{0,1\\}$ and $B=\\{x,y,z\\}$, and count it.", steps: [
        { do: "Pair $0$ with every element of $B$", result: "$(0,x),(0,y),(0,z)$", why: "Cartesian product uses ordered pairs" },
        { do: "Pair $1$ with every element of $B$", result: "$(1,x),(1,y),(1,z)$", why: "repeat for the second element of $A$" },
        { do: "List the product", result: "$A\\times B=\\{(0,x),(0,y),(0,z),(1,x),(1,y),(1,z)\\}$", why: "include all ordered pairs" },
        { do: "Count using multiplication", result: "$2\\cdot3=6$", why: "each of 2 first choices has 3 second choices" },
        { do: "Notice order", result: "$(0,x)$ is not the same type of choice as $(x,0)$", why: "Cartesian pairs are ordered" }
      ], answer: "$A\\times B$ has the six listed ordered pairs." },
      { problem: "In a dataset of 1000 users, 300 clicked, 180 purchased, and 75 did both. How many clicked or purchased?", steps: [
        { do: "Define the sets", result: "$C=$ clicked users, $P=$ purchased users", why: "translate the words into sets" },
        { do: "Write the desired count", result: "$|C\\cup P|$", why: "clicked or purchased is a union" },
        { do: "Use inclusion-exclusion", result: "$|C\\cup P|=300+180-75$", why: "subtract users counted in both groups" },
        { do: "Add and subtract", result: "$405$", why: "$480-75=405$" },
        { do: "Interpret", result: "405 users", why: "each user is counted once in the union" }
      ], answer: "405 users clicked or purchased." }
    ],
    applications: [
      { title: "Training and validation splits", background: "ML workflows separate examples into sets so evaluation is honest. Overlap between train and test can leak information.", numbers: "If train has 80,000 ids, test has 20,000 ids, and overlap is 50 ids, then the distinct total is $80000+20000-50=99950$." },
      { title: "Vocabulary sets", background: "Natural language systems track sets of tokens. Comparing vocabularies reveals coverage and missing words.", numbers: "If vocabulary A has 12,000 tokens, B has 9,000, and overlap has 7,500, the union has $12000+9000-7500=13500$ tokens." },
      { title: "Recommendation candidates", background: "A recommender may union candidates from several retrieval systems before ranking them.", numbers: "If source A returns 100 items, source B returns 80, and 30 overlap, the union has $100+80-30=150$ items." },
      { title: "Access-control groups", background: "Security policies often grant permissions by membership in groups. Sets make the policy auditable.", numbers: "If 25 engineers are in group A and 18 in group B with 5 in both, then 38 distinct people are in at least one group." },
      { title: "Image labels", background: "Multilabel datasets attach a set of labels to each example. Intersection measures shared concepts.", numbers: "For labels $\\{cat,indoor,pet\\}$ and $\\{dog,indoor,pet\\}$, intersection size is 2 and union size is 4." },
      { title: "A/B experiment audiences", background: "Experiment platforms reason about sets of eligible users, excluded users, and assigned users.", numbers: "From 1,000,000 users, excluding a set of 40,000 leaves $960000$ eligible users if the exclusion set is fully inside the universe." }
    ],
    applicationsClose: "Sets are the quiet bookkeeping behind membership, overlap, exclusion, and finite counting.",
    takeaways: [
      "Sets contain distinct elements; duplicates do not change membership.",
      "Union means in either set; intersection means in both; difference means in the first but not the second.",
      "For finite sets, $|A\\cup B|=|A|+|B|-|A\\cap B|$.",
      "Complements require a universe, and Cartesian products create ordered pairs."
    ]
  },

  "math-14-04": {
    id: "math-14-04",
    title: "Relations",
    tagline: "A relation records which objects are connected to which other objects.",
    connections: {
      buildsOn: ["Sets", "Predicate logic", "Cartesian products"],
      leadsTo: ["Functions", "equivalence relations", "graphs"],
      usedWith: ["ordered pairs", "sets", "matrices", "directed graphs"]
    },
    motivation:
      "<p>Many ideas are not single-object properties. User follows user, number divides number, point is near point, item is similar to item. Each sentence relates two objects.</p>" +
      "<p>A <b>relation</b> is the mathematical container for those pairwise connections. Once we name the pairs, we can test patterns like reflexive, symmetric, and transitive, which later become graph structure, equivalence classes, and database joins.</p>",
    definition:
      "<p>A <b>binary relation</b> from set $A$ to set $B$ is a subset $R\\subseteq A\\times B$. If $(a,b)\\in R$, we may write $aRb$. When $R$ is on one set $A$, it is a subset of $A\\times A$.</p>" +
      "<p>For a relation on $A$, <b>reflexive</b> means every $a\\in A$ has $(a,a)\\in R$; <b>symmetric</b> means $(a,b)\\in R$ implies $(b,a)\\in R$; <b>transitive</b> means $(a,b)$ and $(b,c)$ imply $(a,c)$. These definitions are just quantified statements over ordered pairs.</p>" +
      "<p><b>Assumptions that matter:</b> ordered pairs remember order; properties such as symmetry are checked relative to the chosen set; and absence of a pair is meaningful information.</p>",
    worked: {
      problem: "On $A=\\{1,2,3\\}$, let $R=\\{(1,1),(2,2),(3,3),(1,2),(2,1)\\}$. Decide whether $R$ is reflexive, symmetric, and transitive.",
      skills: ["relation properties", "ordered pairs", "counterexamples"],
      strategy: "Check each property from its definition and look for missing required pairs.",
      steps: [
        { do: "Check diagonal pairs", result: "$(1,1),(2,2),(3,3)$ are all present", why: "reflexivity needs every element related to itself" },
        { do: "State reflexivity", result: "reflexive", why: "all required diagonal pairs appear" },
        { do: "Check non-diagonal pair $(1,2)$", result: "$(2,1)$ is present", why: "symmetry requires the reverse pair" },
        { do: "Check non-diagonal pair $(2,1)$", result: "$(1,2)$ is present", why: "the reverse condition works both ways" },
        { do: "State symmetry", result: "symmetric", why: "every listed pair has its reverse" },
        { do: "Test a transitive chain", result: "$(2,1)$ and $(1,2)$ require $(2,2)$", why: "the middle element matches" },
        { do: "Check all new requirements", result: "required pairs are already present", why: "chains involving diagonal pairs add nothing new" }
      ],
      verify: "The relation connects 1 and 2 as a small two-way cluster, while 3 only relates to itself, so all three properties are plausible.",
      answer: "$R$ is reflexive, symmetric, and transitive.",
      connects: "Relation properties are quantified logic applied to ordered pairs."
    },
    practice: [
      { problem: "Let $A=\\{a,b\\}$ and $R=\\{(a,a),(a,b)\\}$. Is $R$ reflexive?", steps: [
        { do: "List required diagonal pairs", result: "$(a,a)$ and $(b,b)$", why: "reflexivity needs one for each element" },
        { do: "Check $(a,a)$", result: "present", why: "it is listed in $R$" },
        { do: "Check $(b,b)$", result: "missing", why: "it is not listed" },
        { do: "Apply the definition", result: "not reflexive", why: "one missing diagonal pair is enough" },
        { do: "Name the counterexample", result: "$b$", why: "$b$ is not related to itself" }
      ], answer: "No. $R$ is not reflexive because $(b,b)$ is missing." },
      { problem: "For $R=\\{(1,2),(2,1),(2,3)\\}$ on $\\{1,2,3\\}$, is $R$ symmetric?", steps: [
        { do: "Check $(1,2)$", result: "$(2,1)$ is present", why: "the reverse exists" },
        { do: "Check $(2,1)$", result: "$(1,2)$ is present", why: "the reverse exists" },
        { do: "Check $(2,3)$", result: "$(3,2)$ is missing", why: "symmetry requires every reverse" },
        { do: "Apply the definition", result: "not symmetric", why: "one listed pair lacks its reverse" },
        { do: "State the counterexample", result: "$(2,3)$", why: "it points one way only" }
      ], answer: "No. $(2,3)$ is in $R$ but $(3,2)$ is not." },
      { problem: "Let $R$ be the divides relation on $\\{1,2,4\\}$: $aRb$ means $a$ divides $b$. List $R$.", steps: [
        { do: "Find pairs starting with 1", result: "$(1,1),(1,2),(1,4)$", why: "1 divides every integer" },
        { do: "Find pairs starting with 2", result: "$(2,2),(2,4)$", why: "2 divides 2 and 4" },
        { do: "Find pairs starting with 4", result: "$(4,4)$", why: "4 divides itself in the set" },
        { do: "Combine the pairs", result: "$R=\\{(1,1),(1,2),(1,4),(2,2),(2,4),(4,4)\\}$", why: "relations are sets of ordered pairs" },
        { do: "Count the relation", result: "$|R|=6$", why: "six ordered pairs are listed" }
      ], answer: "$R=\\{(1,1),(1,2),(1,4),(2,2),(2,4),(4,4)\\}$." },
      { problem: "On $\\{1,2,3\\}$, $R=\\{(1,2),(2,3),(1,3)\\}$. Is $R$ transitive?", steps: [
        { do: "Find a chain", result: "$(1,2)$ and $(2,3)$", why: "the second coordinate of the first matches the first of the second" },
        { do: "Find the required shortcut", result: "$(1,3)$", why: "transitivity requires connecting start to finish" },
        { do: "Check whether it is present", result: "present", why: "$(1,3)$ is listed" },
        { do: "Look for other chains", result: "none with matching middle that create new requirements", why: "no pair starts with 3" },
        { do: "State transitivity", result: "transitive", why: "all chain requirements are met" }
      ], answer: "Yes. The only nontrivial chain requires $(1,3)$, which is present." },
      { problem: "A similarity relation links items if cosine similarity is at least $0.9$. For similarities $s(A,B)=0.92$, $s(B,C)=0.91$, and $s(A,C)=0.84$, is the relation transitive on these three items?", steps: [
        { do: "Convert similarities to pairs", result: "$A R B$ and $B R C$ are true", why: "$0.92$ and $0.91$ exceed $0.9$" },
        { do: "Check the shortcut", result: "$A R C$ is false", why: "$0.84<0.9$" },
        { do: "Apply transitivity", result: "transitivity fails", why: "$A R B$ and $B R C$ would require $A R C$" },
        { do: "Name the counterexample", result: "$A,B,C$", why: "they form a broken chain" },
        { do: "Interpret", result: "high similarity is not automatically transitive", why: "near-to-near need not be near" }
      ], answer: "No. The threshold similarity relation is not transitive in this example." }
    ],
    applications: [
      { title: "Social graphs", background: "Follow and friendship data are relations on users. Directed follow is not necessarily symmetric; friendship usually is designed to be symmetric.", numbers: "If user 1 follows 2 and 2 follows 3, transitivity would require 1 follows 3, which many social graphs do not require." },
      { title: "Database joins", background: "A join table stores related pairs such as user enrolled in course. It is literally a finite relation.", numbers: "With 4 users and 3 courses, the Cartesian product has 12 possible pairs; a relation might store only 7 actual enrollments." },
      { title: "Equivalence classes", background: "Relations that are reflexive, symmetric, and transitive group objects into classes. This is how equality-like behavior is generalized.", numbers: "Modulo 3 on $\\{0,1,2,3,4,5\\}$ creates classes $\\{0,3\\}$, $\\{1,4\\}$, and $\\{2,5\\}$." },
      { title: "Partial orders", background: "Relations like subset and divides organize objects without requiring every pair to be comparable.", numbers: "For sets $\\{1\\}$, $\\{1,2\\}$, and $\\{2\\}$, the first is subset of the second, but $\\{1\\}$ and $\\{2\\}$ are not comparable." },
      { title: "Recommendation similarity", background: "Item-item similarity graphs are relations after thresholding scores. Graph algorithms then explore neighborhoods.", numbers: "If 10,000 item pairs are scored and 640 exceed threshold $0.85$, the relation contains 640 ordered or unordered links depending on design." },
      { title: "Program dependencies", background: "Build systems use depends-on relations. Transitive closure tells which files must rebuild after a change.", numbers: "If A depends on B and B depends on C, then C is in A's transitive dependency chain even if A does not directly mention C." }
    ],
    applicationsClose: "Relations are pair bookkeeping; their properties explain patterns in graphs, data, order, and similarity.",
    takeaways: [
      "A binary relation from $A$ to $B$ is a subset of $A\\times B$.",
      "Reflexive means every element relates to itself.",
      "Symmetric means every pair comes with its reverse.",
      "Transitive means every two-step chain has the corresponding shortcut."
    ]
  },

  "math-14-05": {
    id: "math-14-05",
    title: "Functions",
    tagline: "In discrete math, a function is a relation with one output chosen for every allowed input.",
    connections: {
      buildsOn: ["Relations", "Sets", "Predicate logic"],
      leadsTo: ["Proof by induction", "counting functions", "permutations"],
      usedWith: ["sets", "relations", "composition", "cardinality"]
    },
    motivation:
      "<p>You met functions as formulas and graphs. Discrete math widens the picture: a function can map usernames to ids, states to next states, or feature vectors to labels. No formula is required.</p>" +
      "<p>The essential promise is still the same: each input in the domain gets exactly one output. That promise is what makes lookup, composition, inversion, and counting possible.</p>",
    definition:
      "<p>A <b>function</b> $f:A\\to B$ assigns every element $a\\in A$ exactly one element $f(a)\\in B$. As a relation, it is a subset of $A\\times B$ where each $a\\in A$ appears as the first coordinate in exactly one ordered pair.</p>" +
      "<p>The function is <b>injective</b> if different inputs have different outputs; <b>surjective</b> if every element of $B$ is hit by at least one input; and <b>bijective</b> if both hold. For finite sets with $|A|=m$ and $|B|=n$, the number of all functions $A\\to B$ is $n^m$ because each of $m$ inputs has $n$ independent output choices.</p>" +
      "<p><b>Assumptions that matter:</b> the codomain $B$ is part of the function data; every domain element must be assigned; and a many-to-one assignment may still be a function even though it is not injective.</p>",
    worked: {
      problem: "Let $A=\\{1,2,3\\}$ and $B=\\{a,b,c\\}$. The relation $R=\\{(1,a),(2,a),(3,c)\\}$ is from $A$ to $B$. Is it a function? Is it injective or surjective?",
      skills: ["function test", "injective", "surjective"],
      strategy: "First check the one-output rule for every input, then inspect repeated outputs and missed codomain values.",
      steps: [
        { do: "List first coordinates", result: "$1,2,3$", why: "every domain element must appear" },
        { do: "Check uniqueness of outputs", result: "each input appears once", why: "a function gives exactly one output per input" },
        { do: "State function status", result: "function", why: "the one-output rule holds" },
        { do: "Check repeated outputs", result: "$1$ and $2$ both map to $a$", why: "injectivity forbids different inputs sharing an output" },
        { do: "State injectivity", result: "not injective", why: "two inputs share $a$" },
        { do: "Check codomain coverage", result: "$b$ is not hit", why: "surjectivity requires every codomain element" },
        { do: "State surjectivity", result: "not surjective", why: "one codomain element has no preimage" }
      ],
      verify: "The relation can be a perfectly valid function while still failing both one-to-one and onto tests.",
      answer: "$R$ is a function, but it is neither injective nor surjective.",
      connects: "Functions are special relations; injective and surjective describe how outputs are used."
    },
    practice: [
      { problem: "Is $R=\\{(1,a),(1,b),(2,c)\\}$ a function from $\\{1,2\\}$ to $\\{a,b,c\\}$?", steps: [
        { do: "List pairs with first coordinate 1", result: "$(1,a)$ and $(1,b)$", why: "input 1 appears twice" },
        { do: "Compare outputs for input 1", result: "$a\\ne b$", why: "the same input gets two outputs" },
        { do: "Apply the function rule", result: "not a function", why: "exactly one output per input is required" },
        { do: "Check input 2", result: "$(2,c)$ is fine", why: "one correct input does not repair another" },
        { do: "State the failure", result: "input 1 violates uniqueness", why: "that is enough to fail" }
      ], answer: "No. Input 1 is assigned to both $a$ and $b$." },
      { problem: "For $f:\\{1,2,3\\}\\to\\{x,y,z\\}$ with $f(1)=x$, $f(2)=y$, $f(3)=z$, decide injective and surjective.", steps: [
        { do: "List outputs", result: "$x,y,z$", why: "read off each function value" },
        { do: "Check repeats", result: "no output repeats", why: "each input has a different output" },
        { do: "State injectivity", result: "injective", why: "different inputs have different outputs" },
        { do: "Check codomain coverage", result: "all of $x,y,z$ are hit", why: "every codomain element appears" },
        { do: "State surjectivity", result: "surjective", why: "nothing in the codomain is missed" }
      ], answer: "$f$ is both injective and surjective, so it is bijective." },
      { problem: "How many functions are there from a 4-element set to a 3-element set?", steps: [
        { do: "Identify domain size", result: "$m=4$", why: "there are four inputs" },
        { do: "Identify codomain size", result: "$n=3$", why: "each input has three output choices" },
        { do: "Use the counting formula", result: "$n^m=3^4$", why: "choices are independent for each input" },
        { do: "Compute the power", result: "$3^4=81$", why: "$3\\cdot3\\cdot3\\cdot3=81$" },
        { do: "Interpret", result: "81 functions", why: "every assignment pattern counts" }
      ], answer: "There are $81$ functions." },
      { problem: "If $f:A\\to B$ is injective and $|A|=5$, what is the smallest possible $|B|$?", steps: [
        { do: "Recall injectivity", result: "different inputs need different outputs", why: "no sharing is allowed" },
        { do: "Count needed outputs", result: "5 distinct outputs", why: "there are 5 inputs" },
        { do: "Compare with codomain size", result: "$|B|\\ge5$", why: "the codomain must contain all used outputs" },
        { do: "Find the smallest size", result: "$5$", why: "five outputs are enough for five inputs" },
        { do: "Give an example", result: "map each input to a different element", why: "this shows the bound can be achieved" }
      ], answer: "The smallest possible codomain size is $5$." },
      { problem: "A classifier maps 6 examples to labels $\\{0,1\\}$. How many label functions are possible, and how many have exactly two positives?", steps: [
        { do: "Count all label functions", result: "$2^6=64$", why: "each example independently gets label 0 or 1" },
        { do: "Translate exactly two positives", result: "choose 2 of the 6 examples", why: "the chosen examples receive label 1" },
        { do: "Use combinations", result: "$\\binom{6}{2}$", why: "order of chosen positive examples does not matter" },
        { do: "Compute", result: "$\\binom{6}{2}=15$", why: "$6\\cdot5/2=15$" },
        { do: "Interpret", result: "15 special label functions", why: "each chosen pair determines one labeling" }
      ], answer: "There are 64 label functions total, and 15 have exactly two positives." }
    ],
    applications: [
      { title: "Hash functions", background: "Hashing maps keys to buckets for fast lookup. Collisions mean the function is usually not injective.", numbers: "Mapping 1000 keys into 100 buckets cannot be injective because $1000>100$; at least one bucket receives multiple keys." },
      { title: "Classification models", background: "A classifier is a function from features to labels. The same label can be assigned to many examples.", numbers: "For 3 binary features there are $2^3=8$ possible inputs; with 2 labels, there are $2^8=256$ possible classifiers on that finite input set." },
      { title: "Embeddings", background: "An embedding function maps tokens or items into vectors. It need not be injective, though collisions can lose information.", numbers: "A vocabulary of 50,000 tokens mapped to 768-dimensional vectors assigns one vector per token, so 50,000 function values are stored or learned." },
      { title: "Database primary keys", background: "A primary-key lookup maps each key to one row. If keys are unique, the key-to-row map is injective into stored rows.", numbers: "If 20,000 keys return 20,000 distinct rows, no two keys share a row in that table." },
      { title: "State transitions", background: "Deterministic automata use transition functions: current state and input symbol determine exactly one next state.", numbers: "With 5 states and 3 input symbols, the transition table has $5\\cdot3=15$ entries." },
      { title: "Feature preprocessing", background: "Normalization maps raw feature values to transformed values. It may be invertible or may collapse information.", numbers: "Rounding ages to decades maps ages 21 and 29 both to 20, so the map is a function but not injective." }
    ],
    applicationsClose: "The function promise, exactly one output per input, underlies lookup tables, models, transitions, and finite counting.",
    takeaways: [
      "A function $f:A\\to B$ assigns every input in $A$ exactly one output in $B$.",
      "Injective means no two inputs share an output; surjective means every codomain element is hit.",
      "A finite set of size $m$ mapping to a set of size $n$ has $n^m$ possible functions.",
      "Every function is a relation, but not every relation is a function."
    ]
  },

  "math-14-06": {
    id: "math-14-06",
    title: "Proof by induction",
    tagline: "Induction proves an infinite line of claims by securing the first step and the step from one to the next.",
    connections: {
      buildsOn: ["Predicate logic", "Functions", "integer sequences"],
      leadsTo: ["Proof by contradiction", "recurrences", "The binomial theorem"],
      usedWith: ["sequences", "recursion", "summations", "divisibility"]
    },
    motivation:
      "<p>Some claims come in an infinite row: one for $n=1$, one for $n=2$, one for $n=3$, and so on. Checking ten cases can build confidence, but it cannot check forever.</p>" +
      "<p><b>Proof by induction</b> is the domino method. Prove the first domino falls, then prove any falling domino knocks down the next one. Together, those two facts carry the claim through all positive integers.</p>",
    definition:
      "<p>To prove a statement $P(n)$ for all integers $n\\ge n_0$, induction has two parts. The <b>base case</b> proves $P(n_0)$. The <b>inductive step</b> assumes $P(k)$ for an arbitrary $k\\ge n_0$ and proves $P(k+1)$.</p>" +
      "<p>The logic works because the base case gives $P(n_0)$; the step then gives $P(n_0+1)$; applying the step again gives $P(n_0+2)$; and so on. The arbitrary $k$ is what makes one step reusable infinitely many times.</p>" +
      "<p><b>Assumptions that matter:</b> induction applies to well-ordered integer domains such as $n\\ge n_0$; the inductive hypothesis is assumed only for the chosen $k$ during the step; and the base case must match the claimed starting value.</p>",
    worked: {
      problem: "Prove by induction that $1+2+\\cdots+n=\\dfrac{n(n+1)}{2}$ for all $n\\ge1$.",
      skills: ["base case", "inductive hypothesis", "summation formulas"],
      strategy: "Assume the formula for $k$, then add the next term $k+1$ and simplify to the same formula with $k+1$.",
      steps: [
        { do: "Check the base case $n=1$", result: "$1=\\dfrac{1(2)}{2}=1$", why: "the formula starts correctly" },
        { do: "State the inductive hypothesis", result: "$1+2+\\cdots+k=\\dfrac{k(k+1)}{2}$", why: "assume the claim for an arbitrary $k\\ge1$" },
        { do: "Add the next term", result: "$1+2+\\cdots+k+(k+1)=\\dfrac{k(k+1)}{2}+(k+1)$", why: "use the hypothesis for the first $k$ terms" },
        { do: "Factor $k+1$", result: "$(k+1)(\\dfrac{k}{2}+1)$", why: "both terms contain $k+1$" },
        { do: "Combine inside the parentheses", result: "$(k+1)\\dfrac{k+2}{2}$", why: "$k/2+1=(k+2)/2$" },
        { do: "Rewrite in target form", result: "$\\dfrac{(k+1)(k+2)}{2}$", why: "this is the formula with $n=k+1$" }
      ],
      verify: "The base case starts the chain, and the step proves the exact next formula, not just something similar.",
      answer: "By induction, $1+2+\\cdots+n=\\dfrac{n(n+1)}{2}$ for every $n\\ge1$.",
      connects: "Induction turns a finite algebraic step into an infinite proof."
    },
    practice: [
      { problem: "Prove $1+3+5+\\cdots+(2n-1)=n^2$ for all $n\\ge1$.", steps: [
        { do: "Check $n=1$", result: "$1=1^2$", why: "base case holds" },
        { do: "Assume the formula for $k$", result: "$1+3+\\cdots+(2k-1)=k^2$", why: "inductive hypothesis" },
        { do: "Add the next odd number", result: "$k^2+(2(k+1)-1)$", why: "the next term after $2k-1$ is $2k+1$" },
        { do: "Simplify", result: "$k^2+2k+1$", why: "expand the next term" },
        { do: "Factor", result: "$(k+1)^2$", why: "this is the target for $k+1$" }
      ], answer: "The identity holds for all $n\\ge1$ by induction." },
      { problem: "Prove $2^n\\ge n+1$ for all $n\\ge0$.", steps: [
        { do: "Check $n=0$", result: "$2^0=1\\ge1$", why: "base case holds" },
        { do: "Assume for $k$", result: "$2^k\\ge k+1$", why: "inductive hypothesis" },
        { do: "Multiply by 2", result: "$2^{k+1}\\ge2(k+1)$", why: "multiplying by positive 2 preserves inequality" },
        { do: "Compare with the target", result: "$2(k+1)=2k+2\\ge k+2$", why: "$k\\ge0$" },
        { do: "Conclude the next case", result: "$2^{k+1}\\ge(k+1)+1$", why: "chain the inequalities" }
      ], answer: "$2^n\\ge n+1$ for every integer $n\\ge0$." },
      { problem: "Prove $3$ divides $4^n-1$ for all $n\\ge1$.", steps: [
        { do: "Check $n=1$", result: "$4^1-1=3$", why: "3 divides 3" },
        { do: "Assume divisibility for $k$", result: "$4^k-1=3m$ for some integer $m$", why: "definition of divisible" },
        { do: "Rewrite the next expression", result: "$4^{k+1}-1=4\\cdot4^k-1$", why: "separate one factor of 4" },
        { do: "Add and subtract 4", result: "$4(4^k-1)+3$", why: "this exposes the inductive hypothesis" },
        { do: "Use the hypothesis", result: "$4(3m)+3=3(4m+1)$", why: "factor out 3" }
      ], answer: "Since $4^{k+1}-1$ is divisible by 3, the result holds for all $n\\ge1$." },
      { problem: "Prove $1^2+2^2+\\cdots+n^2=\\dfrac{n(n+1)(2n+1)}{6}$ for all $n\\ge1$.", steps: [
        { do: "Check $n=1$", result: "$1=\\dfrac{1\\cdot2\\cdot3}{6}$", why: "base case holds" },
        { do: "Assume for $k$", result: "$\\sum_{i=1}^k i^2=\\dfrac{k(k+1)(2k+1)}{6}$", why: "inductive hypothesis" },
        { do: "Add $(k+1)^2$", result: "$\\dfrac{k(k+1)(2k+1)}{6}+(k+1)^2$", why: "move to the next sum" },
        { do: "Factor $k+1$", result: "$(k+1)\\left(\\dfrac{k(2k+1)}{6}+k+1\\right)$", why: "both terms contain $k+1$" },
        { do: "Combine the bracket", result: "$(k+1)\\dfrac{2k^2+7k+6}{6}$", why: "put terms over denominator 6" },
        { do: "Factor the numerator", result: "$\\dfrac{(k+1)(k+2)(2k+3)}{6}$", why: "$2k^2+7k+6=(k+2)(2k+3)$" }
      ], answer: "The square-sum formula holds for all $n\\ge1$." },
      { problem: "A recursive training job doubles checkpoints each round: $c_0=1$, $c_{n+1}=2c_n$. Prove $c_n=2^n$.", steps: [
        { do: "Check $n=0$", result: "$c_0=1=2^0$", why: "base case matches the formula" },
        { do: "Assume $c_k=2^k$", result: "inductive hypothesis", why: "assume the formula at round $k$" },
        { do: "Use the recurrence", result: "$c_{k+1}=2c_k$", why: "given update rule" },
        { do: "Substitute the hypothesis", result: "$c_{k+1}=2\\cdot2^k$", why: "replace $c_k$" },
        { do: "Combine powers", result: "$c_{k+1}=2^{k+1}$", why: "multiplying by 2 increases the exponent by 1" }
      ], answer: "$c_n=2^n$ for every $n\\ge0$." }
    ],
    applications: [
      { title: "Recursive algorithms", background: "Induction is the natural proof method for recursive code because the code calls itself on smaller inputs.", numbers: "If a recursive function handles size 1 and reduces size $n$ to $n-1$, induction proves correctness for sizes 1 through 1000 and beyond." },
      { title: "Loop invariants", background: "A loop invariant is induction in programming clothing: true before the loop, preserved by one iteration.", numbers: "If a sum loop starts at 0 and adds $a_i$ on iteration $i$, after 5 iterations it holds $a_1+\\cdots+a_5$." },
      { title: "Binary tree sizes", background: "Data structures often have recursive shape. Induction proves node-count formulas.", numbers: "A full binary tree of height 3 has $1+2+4+8=15=2^4-1$ nodes." },
      { title: "Geometric growth in systems", background: "Repeated doubling appears in search, memory, and parallel branching. Induction confirms the exact count.", numbers: "Starting with 1 task and doubling for 10 rounds gives $2^{10}=1024$ tasks." },
      { title: "Dynamic programming correctness", background: "DP fills solutions for increasing subproblem sizes. Induction proves each filled entry is correct after smaller entries are correct.", numbers: "If entries for lengths 0 through 4 are correct and the recurrence uses only shorter lengths, it proves length 5 next." },
      { title: "Gradient-step recurrences", background: "Simple optimization recurrences can be unrolled and proved by induction.", numbers: "If error satisfies $e_{t+1}=0.8e_t$ with $e_0=5$, induction gives $e_4=5(0.8)^4=2.048$." }
    ],
    applicationsClose: "Induction is the proof engine for anything built one integer step, recursive call, or iteration at a time.",
    takeaways: [
      "Induction needs a base case and an inductive step.",
      "The inductive hypothesis assumes $P(k)$ only to prove $P(k+1)$.",
      "The base case must match the first value in the claim.",
      "Recursion, loops, summations, and recurrences are natural induction settings."
    ]
  },

  "math-14-07": {
    id: "math-14-07",
    title: "Proof by contradiction",
    tagline: "Contradiction proves a claim by showing that denying it breaks something already known.",
    connections: {
      buildsOn: ["Propositional logic", "Predicate logic", "Proof by induction"],
      leadsTo: ["irrationality proofs", "existence proofs", "graph arguments"],
      usedWith: ["negation", "quantifiers", "divisibility", "sets"]
    },
    motivation:
      "<p>Sometimes a direct proof feels like pushing a door from the wrong side. Instead, assume the claim is false and follow that assumption honestly. If it forces an impossibility, the false assumption must be the part that failed.</p>" +
      "<p><b>Proof by contradiction</b> is especially useful for impossibility, uniqueness, irrationality, and no-counterexample statements. It rewards careful negation and calm bookkeeping.</p>",
    definition:
      "<p>To prove a statement $P$ by contradiction, assume $\\neg P$ and derive a contradiction such as $Q\\land\\neg Q$, $0=1$, or violation of a known theorem. Since $\\neg P$ cannot be true, conclude $P$.</p>" +
      "<p>The logical backbone is that $\\neg P\\to F$ is equivalent to $P$, where $F$ is a false statement. In words: if denying $P$ inevitably leads to falsehood, then $P$ must be true.</p>" +
      "<p><b>Assumptions that matter:</b> the negation must be exact; the contradiction must follow from the assumption and accepted facts; and contradiction proves truth in ordinary two-valued logic where every proposition is true or false.</p>",
    worked: {
      problem: "Prove that $\\sqrt2$ is irrational.",
      skills: ["contradiction", "parity", "divisibility"],
      strategy: "Assume $\\sqrt2$ is a reduced fraction, then show both numerator and denominator must be even.",
      steps: [
        { do: "Assume the opposite", result: "$\\sqrt2=\\dfrac{a}{b}$ with integers $a,b$ in lowest terms", why: "rational numbers can be written as reduced fractions" },
        { do: "Square both sides", result: "$2=\\dfrac{a^2}{b^2}$", why: "remove the square root" },
        { do: "Multiply by $b^2$", result: "$a^2=2b^2$", why: "clear the denominator" },
        { do: "Infer parity of $a$", result: "$a$ is even", why: "$a^2$ is even, so $a$ must be even" },
        { do: "Write $a=2k$", result: "$4k^2=2b^2$", why: "substitute the even form" },
        { do: "Divide by 2", result: "$b^2=2k^2$", why: "simplify the equation" },
        { do: "Infer parity of $b$", result: "$b$ is even", why: "$b^2$ is even" },
        { do: "State the contradiction", result: "$a$ and $b$ are both even", why: "a reduced fraction cannot have a common factor 2" }
      ],
      verify: "Every step followed from the rational assumption, and the final result contradicts lowest terms.",
      answer: "$\\sqrt2$ is irrational.",
      connects: "Contradiction is powerful when the false alternative has rigid structure."
    },
    practice: [
      { problem: "Prove there is no smallest positive real number.", steps: [
        { do: "Assume the opposite", result: "there is a smallest positive real number $s$", why: "start contradiction" },
        { do: "Construct a smaller candidate", result: "$s/2$", why: "halving a positive number stays positive" },
        { do: "Compare", result: "$0<s/2<s$", why: "division by 2 preserves positivity and makes it smaller" },
        { do: "Find the contradiction", result: "$s$ is not smallest", why: "$s/2$ is a smaller positive real" },
        { do: "Conclude", result: "no smallest positive real exists", why: "the opposite assumption failed" }
      ], answer: "There is no smallest positive real number." },
      { problem: "Prove that if $n^2$ is odd, then $n$ is odd.", steps: [
        { do: "Assume the opposite of the conclusion", result: "$n$ is even", why: "contradiction starts by denying what we want" },
        { do: "Write the even form", result: "$n=2k$", why: "definition of even" },
        { do: "Square", result: "$n^2=4k^2$", why: "substitute and square" },
        { do: "Factor out 2", result: "$n^2=2(2k^2)$", why: "show divisibility by 2" },
        { do: "Contradict the premise", result: "$n^2$ is even", why: "the problem says $n^2$ is odd" }
      ], answer: "Therefore $n$ must be odd." },
      { problem: "Prove that no integer is both even and odd.", steps: [
        { do: "Assume both properties", result: "$n=2a$ and $n=2b+1$", why: "definitions of even and odd" },
        { do: "Set the forms equal", result: "$2a=2b+1$", why: "both equal $n$" },
        { do: "Rearrange", result: "$2(a-b)=1$", why: "subtract $2b$" },
        { do: "Inspect parity", result: "left side is even, right side is odd", why: "a multiple of 2 cannot equal 1" },
        { do: "State the contradiction", result: "even equals odd", why: "impossible for integers" }
      ], answer: "No integer can be both even and odd." },
      { problem: "Prove that if $a+b$ is odd, then at least one of $a,b$ is odd.", steps: [
        { do: "Assume the opposite", result: "$a$ and $b$ are both not odd", why: "negating at least one odd means both are even" },
        { do: "Write even forms", result: "$a=2m$ and $b=2n$", why: "definition of even" },
        { do: "Add", result: "$a+b=2m+2n$", why: "substitute the forms" },
        { do: "Factor", result: "$a+b=2(m+n)$", why: "show the sum is even" },
        { do: "Contradict the premise", result: "$a+b$ is even", why: "the premise says it is odd" }
      ], answer: "At least one of $a,b$ must be odd." },
      { problem: "A classifier must assign each of 11 items to one of 10 buckets. Prove some bucket gets at least two items.", steps: [
        { do: "Assume the opposite", result: "every bucket gets at most one item", why: "deny the claim" },
        { do: "Count maximum items under that assumption", result: "$10\\cdot1=10$", why: "10 buckets with at most one each hold at most 10 items" },
        { do: "Compare with actual items", result: "$11>10$", why: "there are 11 assigned items" },
        { do: "State the contradiction", result: "11 items fit into at most 10 slots", why: "impossible under the assumption" },
        { do: "Conclude", result: "some bucket has at least two items", why: "the opposite assumption failed" }
      ], answer: "At least one bucket contains two or more items." }
    ],
    applications: [
      { title: "Impossibility proofs", background: "Computer science often needs to prove something cannot exist, such as a perfect compressor for all files. Contradiction is a natural tool.", numbers: "There are $2^8=256$ one-byte strings but only $1+2+4+8+16+32+64+128=255$ strings shorter than 8 bits, so not every byte can compress." },
      { title: "Pigeonhole reasoning", background: "Pigeonhole arguments are often contradiction proofs: assume no container is crowded, then total capacity is too small.", numbers: "101 users assigned to 100 shards force one shard to have at least 2 users." },
      { title: "Uniqueness of solutions", background: "To prove a solution is unique, assume two different solutions and show they must be equal. The contradiction is the word different.", numbers: "If $2x=6$ and $2y=6$, then $x=3$ and $y=3$, so two solutions are actually the same." },
      { title: "Security reasoning", background: "Proofs of protocol flaws often assume an attacker cannot do something, then construct a case that violates the assumption.", numbers: "If 2 distinct messages produce the same 4-bit hash among 17 messages, collision resistance at that size is contradicted because only 16 hashes exist." },
      { title: "Data validation", background: "Contradiction helps detect impossible records created by inconsistent constraints.", numbers: "If age must be at least 0 and a row has age $-3$, assuming the row is valid gives $-3\\ge0$, a contradiction." },
      { title: "Optimization lower bounds", background: "Some lower bounds show that a faster algorithm would imply an impossible distinction among too many inputs.", numbers: "If an algorithm with one yes-or-no question tried to distinguish 3 cases, it has only $2$ possible answer patterns, so two cases collide." }
    ],
    applicationsClose: "Contradiction is disciplined refusal: when the denial collapses, the original claim stands.",
    takeaways: [
      "To prove $P$ by contradiction, assume $\\neg P$ and derive an impossibility.",
      "The negation must be exact, especially with quantifiers.",
      "Contradiction is useful for impossibility, irrationality, uniqueness, and pigeonhole claims.",
      "The contradiction must follow from accepted facts and the temporary assumption."
    ]
  },

  "math-14-08": {
    id: "math-14-08",
    title: "The sum rule",
    tagline: "The sum rule counts choices from separate cases by adding their counts.",
    connections: {
      buildsOn: ["Sets", "Propositional logic", "cardinality"],
      leadsTo: ["The product rule", "Permutations", "Combinations"],
      usedWith: ["unions", "casework", "inclusion-exclusion", "partitions"]
    },
    motivation:
      "<p>Counting becomes easier when choices split into cases: choose a red item or a blue item, take a bus or a train, select a model from family A or family B. If the cases do not overlap, adding is exactly right.</p>" +
      "<p>The <b>sum rule</b> is the counting version of union for disjoint sets. It teaches a habit that matters everywhere in combinatorics: first define the cases so nothing is missed and nothing is counted twice.</p>",
    definition:
      "<p>If a task can be done in one of $m$ ways or in one of $n$ other ways, and no way belongs to both cases, then the task can be done in $m+n$ ways. More generally, if finite sets $A_1,\\ldots,A_k$ are pairwise disjoint, then $|A_1\\cup\\cdots\\cup A_k|=|A_1|+\\cdots+|A_k|$.</p>" +
      "<p>The rule follows because disjoint cases have no shared elements. Placing the cases side by side does not create duplicates, so counting each case separately and adding counts each outcome exactly once.</p>" +
      "<p><b>Assumptions that matter:</b> the cases must be disjoint for the plain sum rule; if cases overlap, use inclusion-exclusion; and the cases together must cover exactly the outcomes you want to count.</p>",
    worked: {
      problem: "A menu offers 4 soups, 6 salads, and 5 sandwiches. If you choose exactly one item from exactly one category, how many choices are there?",
      skills: ["casework", "disjoint sets", "addition"],
      strategy: "The categories are mutually exclusive because one item is chosen from one category, so add the case counts.",
      steps: [
        { do: "Name the cases", result: "soup, salad, sandwich", why: "the choice belongs to exactly one category" },
        { do: "Record the counts", result: "$4,6,5$", why: "these are the numbers of choices in each case" },
        { do: "Check disjointness", result: "no chosen item is in two categories", why: "the problem separates the menu categories" },
        { do: "Apply the sum rule", result: "$4+6+5$", why: "disjoint case counts add" },
        { do: "Compute", result: "$15$", why: "sum the choices" }
      ],
      verify: "Choosing one category first and one item inside it gives a list with no duplicates across categories.",
      answer: "There are 15 possible one-item choices.",
      connects: "The sum rule is disjoint union counting in everyday clothing."
    },
    practice: [
      { problem: "A student can attend 3 morning sessions or 4 afternoon sessions, but not both. How many session choices are possible?", steps: [
        { do: "Identify the cases", result: "morning or afternoon", why: "the choice is made from one time block" },
        { do: "Record morning choices", result: "$3$", why: "given count" },
        { do: "Record afternoon choices", result: "$4$", why: "given count" },
        { do: "Check disjointness", result: "a session is not both morning and afternoon", why: "the time blocks do not overlap" },
        { do: "Add", result: "$3+4=7$", why: "sum rule" }
      ], answer: "There are 7 possible choices." },
      { problem: "How many integers from 1 to 30 are divisible by 2 or by 5, if 3 numbers are divisible by both?", steps: [
        { do: "Count multiples of 2", result: "$15$", why: "half of the numbers 1 through 30 are even" },
        { do: "Count multiples of 5", result: "$6$", why: "$5,10,15,20,25,30$" },
        { do: "Notice overlap", result: "$3$", why: "10, 20, and 30 are counted in both groups" },
        { do: "Use inclusion-exclusion", result: "$15+6-3$", why: "plain sum rule would double-count overlap" },
        { do: "Compute", result: "$18$", why: "$21-3=18$" }
      ], answer: "18 integers are divisible by 2 or 5." },
      { problem: "A password recovery method is either email, SMS, or backup code: 2 email addresses, 1 phone, and 8 codes. How many methods?", steps: [
        { do: "List cases", result: "email, SMS, backup code", why: "the user chooses one method type" },
        { do: "Count email methods", result: "$2$", why: "two addresses" },
        { do: "Count SMS methods", result: "$1$", why: "one phone" },
        { do: "Count backup-code methods", result: "$8$", why: "eight codes" },
        { do: "Add disjoint cases", result: "$2+1+8=11$", why: "each method has one type" }
      ], answer: "There are 11 recovery methods." },
      { problem: "A dataset has 120 image examples, 80 text examples, and 50 audio examples, with no example in two modalities. How many examples total?", steps: [
        { do: "Identify disjoint sets", result: "images, text, audio", why: "no example has two modalities" },
        { do: "Write the union count", result: "$|I\\cup T\\cup A|$", why: "total examples are in any modality" },
        { do: "Apply the sum rule", result: "$120+80+50$", why: "the sets are disjoint" },
        { do: "Add first two counts", result: "$200+50$", why: "$120+80=200$" },
        { do: "Compute total", result: "$250$", why: "finish the sum" }
      ], answer: "There are 250 examples total." },
      { problem: "A model family choice is one of 5 linear models, 7 tree models, or 4 neural models. Two neural models are also counted in the tree list by mistake. How many distinct models are listed?", steps: [
        { do: "Add the raw counts", result: "$5+7+4=16$", why: "start with the listed cases" },
        { do: "Identify overlap", result: "$2$", why: "two models appear in both tree and neural lists" },
        { do: "Subtract the duplicate count", result: "$16-2$", why: "overlapping items were counted twice" },
        { do: "Compute", result: "$14$", why: "distinct models count once" },
        { do: "Interpret", result: "14 unique model choices", why: "the corrected count is a union count" }
      ], answer: "There are 14 distinct model choices." }
    ],
    applications: [
      { title: "Case-based counting", background: "Combinatorics often starts by partitioning a hard count into simpler cases. The sum rule is the arithmetic of that partition.", numbers: "If a search result is from 12 documents, 8 images, or 5 videos with no overlap, total results are $12+8+5=25$." },
      { title: "Dataset composition", background: "ML teams report totals by disjoint splits or modalities. The sum rule keeps these summaries transparent.", numbers: "Train 70,000, validation 15,000, and test 15,000 examples sum to 100,000 examples." },
      { title: "Error taxonomies", background: "Model errors are often assigned to one primary category so teams can count causes without double-counting.", numbers: "If 18 errors are labeling issues, 25 are retrieval issues, and 7 are ranking issues, disjoint categories give 50 errors." },
      { title: "User funnels", background: "A funnel can split users into mutually exclusive paths. Adding path counts gives the total population covered.", numbers: "If 300 users enter by search, 120 by ads, and 80 by referral with no duplicated attribution, total entrants are 500." },
      { title: "File-type indexing", background: "Search systems often shard by type. If shards are disjoint, total indexed files are a sum.", numbers: "1.2 million HTML files plus 0.4 million PDFs plus 0.1 million images gives 1.7 million files." },
      { title: "Model selection menus", background: "AutoML systems may offer families of candidate models. Counting candidates by family uses the sum rule when families are distinct.", numbers: "10 linear choices, 24 tree choices, and 6 kernel choices give 40 candidates." }
    ],
    applicationsClose: "The sum rule is simple because its discipline comes before the arithmetic: make clean cases, then add.",
    takeaways: [
      "Use the sum rule when outcomes split into disjoint cases.",
      "Pairwise disjoint finite sets satisfy $|A_1\\cup\\cdots\\cup A_k|=|A_1|+\\cdots+|A_k|$.",
      "If cases overlap, subtract overlap with inclusion-exclusion instead of using the plain sum rule.",
      "Good counting starts by defining cases that cover exactly the desired outcomes."
    ]
  },

  "math-14-09": {
    id: "math-14-09",
    title: "The product rule",
    tagline: "The product rule counts step-by-step choices by multiplying the number of options at each step.",
    connections: {
      buildsOn: ["The sum rule", "Sets", "Functions"],
      leadsTo: ["Permutations", "Combinations", "The binomial theorem"],
      usedWith: ["Cartesian products", "decision trees", "independent choices", "counting functions"]
    },
    motivation:
      "<p>Some choices happen in sequence: choose a shirt then pants, a username then a password, a model then a learning rate. Each first choice opens a set of second choices.</p>" +
      "<p>The <b>product rule</b> says to multiply when choices are chained and the number of options at each step is known. It is the counting heart of Cartesian products, search spaces, and combinatorial explosions.</p>",
    definition:
      "<p>If a task has $m$ choices for step 1 and, after each such choice, $n$ choices for step 2, then the two-step task has $mn$ outcomes. More generally, $k$ sequential steps with $n_1,n_2,\\ldots,n_k$ choices have $n_1n_2\\cdots n_k$ outcomes.</p>" +
      "<p>The rule follows by arranging outcomes in rows: each of the $m$ first choices has $n$ partners, so there are $n$ outcomes in each row and $m$ rows total. This is the size rule for Cartesian products: $|A\\times B|=|A||B|$.</p>" +
      "<p><b>Assumptions that matter:</b> the choice counts must apply at the relevant step; if later counts depend on earlier choices, split into cases or multiply the conditional counts along each branch; and outcomes are ordered by the sequence of choices.</p>",
    worked: {
      problem: "A login code has 2 uppercase letters followed by 3 digits. Repetition is allowed. How many codes are possible?",
      skills: ["sequential choices", "repetition", "multiplication"],
      strategy: "Each position is a step; because repetition is allowed, every letter position has 26 choices and every digit position has 10 choices.",
      steps: [
        { do: "Count choices for the first letter", result: "$26$", why: "there are 26 uppercase letters" },
        { do: "Count choices for the second letter", result: "$26$", why: "repetition is allowed" },
        { do: "Count choices for each digit", result: "$10,10,10$", why: "digits 0 through 9 are allowed at each position" },
        { do: "Apply the product rule", result: "$26\\cdot26\\cdot10\\cdot10\\cdot10$", why: "the positions are sequential choices" },
        { do: "Compute", result: "$676000$", why: "$26^2=676$ and $10^3=1000$" }
      ],
      verify: "The code length and order matter: AB123 and BA123 are different outcomes.",
      answer: "There are 676,000 possible codes.",
      connects: "The product rule counts ordered sequences of choices."
    },
    practice: [
      { problem: "How many outfits can be made from 4 shirts and 3 pants?", steps: [
        { do: "Choose a shirt", result: "$4$ choices", why: "first step" },
        { do: "Choose pants", result: "$3$ choices", why: "second step" },
        { do: "Apply product rule", result: "$4\\cdot3$", why: "each shirt pairs with each pair of pants" },
        { do: "Compute", result: "$12$", why: "multiply the choices" },
        { do: "Interpret", result: "12 outfits", why: "an outfit is an ordered pair of category choices" }
      ], answer: "There are 12 outfits." },
      { problem: "How many binary strings of length 5 are there?", steps: [
        { do: "Count choices per position", result: "$2$", why: "each bit is 0 or 1" },
        { do: "Count positions", result: "$5$", why: "the string length is 5" },
        { do: "Apply product rule", result: "$2^5$", why: "five independent binary choices" },
        { do: "Compute", result: "$32$", why: "$2\\cdot2\\cdot2\\cdot2\\cdot2=32$" },
        { do: "Interpret", result: "32 strings", why: "order of bits matters" }
      ], answer: "There are 32 binary strings of length 5." },
      { problem: "A route has 3 choices for the first leg and 5 choices for the second leg. How many two-leg routes?", steps: [
        { do: "Count first-leg choices", result: "$3$", why: "given" },
        { do: "Count second-leg choices", result: "$5$", why: "given for each first leg" },
        { do: "Multiply", result: "$3\\cdot5$", why: "each first leg can pair with each second leg" },
        { do: "Compute", result: "$15$", why: "product rule" },
        { do: "Interpret", result: "15 routes", why: "a route records both legs" }
      ], answer: "There are 15 two-leg routes." },
      { problem: "How many functions are there from a 3-element set to a 4-element set?", steps: [
        { do: "Identify inputs", result: "$3$", why: "the domain has three elements" },
        { do: "Count output choices per input", result: "$4$", why: "each input maps to one of four codomain elements" },
        { do: "Apply product rule", result: "$4\\cdot4\\cdot4$", why: "one choice for each input" },
        { do: "Write as a power", result: "$4^3$", why: "same count repeated three times" },
        { do: "Compute", result: "$64$", why: "$4^3=64$" }
      ], answer: "There are 64 functions." },
      { problem: "A hyperparameter grid has 4 learning rates, 3 batch sizes, 5 depths, and 2 optimizers. How many runs are in the full grid?", steps: [
        { do: "List the step counts", result: "$4,3,5,2$", why: "one choice from each hyperparameter" },
        { do: "Multiply learning rates and batch sizes", result: "$4\\cdot3=12$", why: "first two independent choices" },
        { do: "Include depths", result: "$12\\cdot5=60$", why: "each partial setting has five depths" },
        { do: "Include optimizers", result: "$60\\cdot2=120$", why: "each setting has two optimizer choices" },
        { do: "Interpret", result: "120 runs", why: "each run is one tuple of hyperparameters" }
      ], answer: "The full grid contains 120 runs." }
    ],
    applications: [
      { title: "Hyperparameter grids", background: "Grid search tries every combination of selected hyperparameter values. Product-rule growth is why grids become expensive quickly.", numbers: "6 learning rates, 4 depths, and 3 regularization values create $6\\cdot4\\cdot3=72$ runs." },
      { title: "Password spaces", background: "Security estimates often count possible strings. More positions multiply the search space.", numbers: "An 8-character lowercase password has $26^8=208827064576$ possibilities." },
      { title: "Feature crosses", background: "Categorical feature crosses combine categories from multiple fields. The number of crossed buckets multiplies.", numbers: "20 cities crossed with 5 device types and 3 membership tiers gives $20\\cdot5\\cdot3=300$ buckets." },
      { title: "Cartesian product datasets", background: "Testing sometimes generates all pairs or tuples of parameter settings. The product rule predicts test count.", numbers: "7 browsers, 3 locales, and 4 screen sizes make $7\\cdot3\\cdot4=84$ configurations." },
      { title: "Neural architecture choices", background: "Architecture search can choose layer count, width, activation, and optimizer. Each independent menu multiplies the candidates.", numbers: "3 depths, 4 widths, 2 activations, and 2 optimizers give $3\\cdot4\\cdot2\\cdot2=48$ candidates." },
      { title: "State spaces", background: "Discrete systems have states described by several variables. Total states are often a Cartesian product.", numbers: "A robot with 10 positions, 4 headings, and 2 gripper states has $10\\cdot4\\cdot2=80$ states." }
    ],
    applicationsClose: "The product rule explains both elegant counting and painful explosion: every independent step multiplies the space.",
    takeaways: [
      "Use the product rule for sequential choices.",
      "For sets, $|A\\times B|=|A||B|$.",
      "Repeated equal choices give powers, such as $n^k$.",
      "If later choice counts depend on earlier choices, count each branch carefully."
    ]
  },

  "math-14-10": {
    id: "math-14-10",
    title: "Permutations",
    tagline: "Permutations count arrangements where order matters.",
    connections: {
      buildsOn: ["The product rule", "Functions", "sets"],
      leadsTo: ["Combinations", "The binomial theorem", "probability over rankings"],
      usedWith: ["factorials", "ordered samples", "bijections", "ranking"]
    },
    motivation:
      "<p>Choosing Alice, Bo, and Chen for a committee is different from ranking them first, second, and third. Same people, different order question.</p>" +
      "<p><b>Permutations</b> count arrangements. They appear whenever order, position, ranking, schedule, or sequence matters, and they grow quickly because each position leaves fewer remaining choices.</p>",
    definition:
      "<p>A <b>permutation</b> of $n$ distinct objects is an ordering of all $n$ objects. The number is $n!=n(n-1)(n-2)\\cdots1$. The number of ordered selections of $r$ objects from $n$ distinct objects without replacement is $P(n,r)=\\dfrac{n!}{(n-r)!}$.</p>" +
      "<p>The formula comes from the product rule. The first position has $n$ choices, the second has $n-1$, and so on until $r$ positions are filled. Multiplying gives $n(n-1)\\cdots(n-r+1)$, which equals $n!/(n-r)!$.</p>" +
      "<p><b>Assumptions that matter:</b> the objects are distinct unless stated otherwise; order matters; and without replacement means an object cannot be used twice in the same arrangement.</p>",
    worked: {
      problem: "How many ways can gold, silver, and bronze medals be awarded among 8 runners, assuming no ties?",
      skills: ["ordered selections", "factorials", "product rule"],
      strategy: "Medal positions are ordered and no runner can receive two medals, so multiply decreasing choices.",
      steps: [
        { do: "Count gold choices", result: "$8$", why: "any runner can win gold" },
        { do: "Count silver choices after gold", result: "$7$", why: "the gold winner is no longer available" },
        { do: "Count bronze choices after two medals", result: "$6$", why: "two runners have already been chosen" },
        { do: "Apply the product rule", result: "$8\\cdot7\\cdot6$", why: "medal positions are sequential ordered choices" },
        { do: "Compute", result: "$336$", why: "$56\\cdot6=336$" },
        { do: "Write in permutation notation", result: "$P(8,3)=\\dfrac{8!}{5!}=336$", why: "ordered selection of 3 from 8" }
      ],
      verify: "Changing gold and silver winners changes the outcome, so order really matters.",
      answer: "There are 336 possible medal outcomes.",
      connects: "Permutations are product-rule counts with shrinking choices."
    },
    practice: [
      { problem: "How many ways can 5 distinct books be arranged on a shelf?", steps: [
        { do: "Count first position choices", result: "$5$", why: "any book can go first" },
        { do: "Count second position choices", result: "$4$", why: "one book has been used" },
        { do: "Continue the pattern", result: "$5\\cdot4\\cdot3\\cdot2\\cdot1$", why: "choices shrink by one each time" },
        { do: "Write as factorial", result: "$5!$", why: "all distinct objects are arranged" },
        { do: "Compute", result: "$120$", why: "$5!=120$" }
      ], answer: "There are 120 arrangements." },
      { problem: "How many 4-letter codes can be made from 10 distinct letters without repetition?", steps: [
        { do: "Count first letter choices", result: "$10$", why: "any letter can start" },
        { do: "Count second choices", result: "$9$", why: "no repetition" },
        { do: "Count third choices", result: "$8$", why: "two letters used" },
        { do: "Count fourth choices", result: "$7$", why: "three letters used" },
        { do: "Multiply", result: "$10\\cdot9\\cdot8\\cdot7=5040$", why: "ordered positions matter" }
      ], answer: "There are 5040 codes." },
      { problem: "Compute $P(7,3)$.", steps: [
        { do: "Write the formula", result: "$P(7,3)=\\dfrac{7!}{(7-3)!}$", why: "ordered selection of 3 from 7" },
        { do: "Simplify the denominator", result: "$\\dfrac{7!}{4!}$", why: "$7-3=4$" },
        { do: "Cancel $4!$", result: "$7\\cdot6\\cdot5$", why: "$7!=7\\cdot6\\cdot5\\cdot4!$" },
        { do: "Multiply", result: "$42\\cdot5=210$", why: "$7\\cdot6=42$" },
        { do: "Interpret", result: "210 ordered selections", why: "order matters" }
      ], answer: "$P(7,3)=210$." },
      { problem: "How many ways can 6 people line up if Alex must be first?", steps: [
        { do: "Fix Alex's position", result: "1 choice", why: "Alex must be first" },
        { do: "Count remaining people", result: "$5$", why: "six total minus Alex" },
        { do: "Arrange remaining people", result: "$5!$", why: "five distinct people fill five positions" },
        { do: "Compute", result: "$120$", why: "$5!=120$" },
        { do: "Include fixed choice", result: "$1\\cdot120=120$", why: "the fixed position does not multiply the count" }
      ], answer: "There are 120 lineups." },
      { problem: "A recommender displays an ordered top-5 list from 20 candidates with no repeats. How many possible lists?", steps: [
        { do: "Recognize ordered selection", result: "$P(20,5)$", why: "rank positions 1 through 5 matter" },
        { do: "Expand the product", result: "$20\\cdot19\\cdot18\\cdot17\\cdot16$", why: "choices shrink after each displayed item" },
        { do: "Multiply first two factors", result: "$380\\cdot18\\cdot17\\cdot16$", why: "$20\\cdot19=380$" },
        { do: "Continue multiplying", result: "$6840\\cdot17\\cdot16$", why: "$380\\cdot18=6840$" },
        { do: "Finish", result: "$1860480$", why: "$6840\\cdot17\\cdot16=1860480$" }
      ], answer: "There are 1,860,480 possible ordered top-5 lists." }
    ],
    applications: [
      { title: "Ranked search results", background: "Search and recommendation systems care about order because users see rank 1 before rank 2. Permutations count possible rankings.", numbers: "Choosing an ordered top 3 from 50 candidates gives $50\\cdot49\\cdot48=117600$ rankings." },
      { title: "Experiment ordering", background: "When tasks are shown in sequence, order can affect behavior. Permutations count possible presentation orders.", numbers: "Six survey questions can appear in $6!=720$ orders." },
      { title: "Scheduling jobs", background: "Schedulers arrange distinct jobs on a machine. Even small job sets create many possible schedules.", numbers: "Eight jobs have $8!=40320$ possible full orders." },
      { title: "Random shuffling", background: "Shuffling datasets before training samples one permutation of the examples. This can reduce ordering artifacts.", numbers: "A mini dataset of 10 examples has $10!=3628800$ possible shuffles." },
      { title: "Access-token characters without repetition", background: "Some code systems forbid repeated symbols. Ordered positions make permutations relevant.", numbers: "A 6-character code from 36 symbols without repetition has $36\\cdot35\\cdot34\\cdot33\\cdot32\\cdot31$ possibilities." },
      { title: "Feature ordering in pipelines", background: "Some preprocessing pipelines apply transformations in order, and different orders can produce different outputs.", numbers: "Four distinct transformations can be ordered in $4!=24$ ways." }
    ],
    applicationsClose: "Whenever position changes identity, permutations give the count.",
    takeaways: [
      "Permutations count ordered arrangements of distinct objects.",
      "All $n$ objects can be arranged in $n!$ ways.",
      "Ordered selections without replacement use $P(n,r)=n!/(n-r)!$.",
      "The formula comes from the product rule with shrinking choices."
    ]
  },

  "math-14-11": {
    id: "math-14-11",
    title: "Combinations",
    tagline: "Combinations count selections where the group matters but the order does not.",
    connections: {
      buildsOn: ["Permutations", "The product rule", "sets"],
      leadsTo: ["The binomial theorem", "probability", "sampling"],
      usedWith: ["factorials", "subsets", "binomial coefficients", "counting events"]
    },
    motivation:
      "<p>If you pick three features for a model, the set {age, country, device} is the same choice no matter which one you wrote first. That is not a permutation question anymore.</p>" +
      "<p><b>Combinations</b> count unordered selections. They are the mathematics of committees, subsets, mini-batches, feature choices, and the binomial coefficients that appear throughout probability and ML.</p>",
    definition:
      "<p>The number of ways to choose $r$ objects from $n$ distinct objects without regard to order is $\\binom{n}{r}=\\dfrac{n!}{r!(n-r)!}$. This is read $n$ choose $r$.</p>" +
      "<p>The formula starts with ordered selections $P(n,r)=n!/(n-r)!$. Each unordered group of $r$ objects can be internally ordered in $r!$ ways, so the ordered count overcounts each group by $r!$. Dividing by $r!$ gives $\\binom{n}{r}$.</p>" +
      "<p><b>Assumptions that matter:</b> objects are distinct unless stated otherwise; order does not matter inside the selected group; and $0\\le r\\le n$ for the standard finite formula.</p>",
    worked: {
      problem: "How many 3-person committees can be chosen from 8 people?",
      skills: ["unordered selection", "binomial coefficients", "factorials"],
      strategy: "A committee has no first, second, or third position, so divide the ordered selection count by the internal orderings.",
      steps: [
        { do: "Write the combination", result: "$\\binom{8}{3}$", why: "choose 3 people from 8 without order" },
        { do: "Use the formula", result: "$\\binom{8}{3}=\\dfrac{8!}{3!5!}$", why: "$n=8$ and $r=3$" },
        { do: "Cancel $5!$", result: "$\\dfrac{8\\cdot7\\cdot6}{3!}$", why: "$8!=8\\cdot7\\cdot6\\cdot5!$" },
        { do: "Compute the denominator", result: "$3!=6$", why: "three selected people can be ordered six ways" },
        { do: "Divide", result: "$\\dfrac{8\\cdot7\\cdot6}{6}=56$", why: "remove internal order" }
      ],
      verify: "If Alice, Bo, and Chen are chosen, all six orderings name the same committee, so division by 6 is necessary.",
      answer: "There are 56 committees.",
      connects: "Combinations are permutations with order intentionally forgotten."
    },
    practice: [
      { problem: "Compute $\\binom{5}{2}$.", steps: [
        { do: "Write the formula", result: "$\\binom{5}{2}=\\dfrac{5!}{2!3!}$", why: "choose 2 from 5" },
        { do: "Cancel $3!$", result: "$\\dfrac{5\\cdot4}{2!}$", why: "$5!=5\\cdot4\\cdot3!$" },
        { do: "Compute $2!$", result: "$2$", why: "two selected items have two orders" },
        { do: "Divide", result: "$20/2=10$", why: "remove order" },
        { do: "Interpret", result: "10 pairs", why: "each pair is unordered" }
      ], answer: "$\\binom{5}{2}=10$." },
      { problem: "How many ways can 4 features be chosen from 10 candidate features?", steps: [
        { do: "Identify unordered choice", result: "$\\binom{10}{4}$", why: "the selected feature set has no order" },
        { do: "Use the formula", result: "$\\dfrac{10!}{4!6!}$", why: "$n=10,r=4$" },
        { do: "Cancel $6!$", result: "$\\dfrac{10\\cdot9\\cdot8\\cdot7}{4!}$", why: "keep four factors" },
        { do: "Compute denominator", result: "$4!=24$", why: "four selected features can be ordered 24 ways" },
        { do: "Divide", result: "$5040/24=210$", why: "unordered feature subsets" }
      ], answer: "There are 210 possible 4-feature subsets." },
      { problem: "Show that $\\binom{6}{2}=\\binom{6}{4}$.", steps: [
        { do: "Compute $\\binom{6}{2}$", result: "$\\dfrac{6\\cdot5}{2}=15$", why: "choose 2 objects" },
        { do: "Write $\\binom{6}{4}$", result: "$\\dfrac{6!}{4!2!}$", why: "choose 4 objects" },
        { do: "Cancel $4!$", result: "$\\dfrac{6\\cdot5}{2}$", why: "same remaining factors" },
        { do: "Compute", result: "$15$", why: "same arithmetic" },
        { do: "Interpret", result: "choosing 2 to include equals choosing 4 to exclude", why: "each choice determines the complement" }
      ], answer: "Both values are 15." },
      { problem: "How many 5-card hands can be dealt from a 52-card deck?", steps: [
        { do: "Recognize unordered hand", result: "$\\binom{52}{5}$", why: "card order in the hand does not matter" },
        { do: "Use the formula", result: "$\\dfrac{52\\cdot51\\cdot50\\cdot49\\cdot48}{5!}$", why: "cancel $47!$" },
        { do: "Compute the denominator", result: "$5!=120$", why: "five cards have 120 orders" },
        { do: "Compute numerator", result: "$311875200$", why: "multiply the five factors" },
        { do: "Divide", result: "$2598960$", why: "remove ordering" }
      ], answer: "There are 2,598,960 five-card hands." },
      { problem: "A mini-batch chooses 32 examples from 1000 without order. Express the count and explain why it is not $P(1000,32)$.", steps: [
        { do: "Identify the selected object", result: "a set of 32 examples", why: "training batch order is not part of the batch identity" },
        { do: "Write the count", result: "$\\binom{1000}{32}$", why: "choose 32 from 1000" },
        { do: "Compare to permutations", result: "$P(1000,32)$ counts ordered lists", why: "it treats the same batch in many orders as different" },
        { do: "Find the overcount factor", result: "$32!$", why: "each chosen batch can be ordered in $32!$ ways" },
        { do: "Relate the counts", result: "$\\binom{1000}{32}=P(1000,32)/32!$", why: "divide out internal order" }
      ], answer: "The count is $\\binom{1000}{32}$, not $P(1000,32)$, because order inside the mini-batch does not matter." }
    ],
    applications: [
      { title: "Feature subset selection", background: "Model builders may search over subsets of features. Combinations count possible subsets when order is irrelevant.", numbers: "Choosing 5 features from 30 gives $\\binom{30}{5}=142506$ subsets." },
      { title: "Mini-batch sampling", background: "A mini-batch is usually treated as a set or multiset of examples. Without replacement and without order, combinations apply.", numbers: "Choosing 4 examples from 20 gives $\\binom{20}{4}=4845$ batches." },
      { title: "Committee and reviewer assignment", background: "Selecting reviewers or committee members is unordered unless roles are assigned afterward.", numbers: "Choosing 3 reviewers from 12 candidates gives $\\binom{12}{3}=220$ panels." },
      { title: "Pairwise comparisons", background: "Many algorithms compare all unordered pairs of items. The count is a combination.", numbers: "100 items have $\\binom{100}{2}=4950$ unordered pairs." },
      { title: "A/B test segment choices", background: "Experiment designers may choose subsets of segments for targeting. The order of chosen segments is irrelevant.", numbers: "Choosing 3 segments from 9 gives $\\binom{9}{3}=84$ segment sets." },
      { title: "Graph edges", background: "An undirected simple graph has possible edges equal to unordered pairs of vertices.", numbers: "A graph with 50 vertices has $\\binom{50}{2}=1225$ possible undirected edges." }
    ],
    applicationsClose: "Combinations count chosen groups after removing all the orderings that do not change the group.",
    takeaways: [
      "Combinations count unordered selections.",
      "$\\binom{n}{r}=\\dfrac{n!}{r!(n-r)!}$.",
      "The division by $r!$ removes the internal orderings of the selected group.",
      "$\\binom{n}{r}=\\binom{n}{n-r}$ because choosing a group also chooses its complement."
    ]
  },

  "math-14-12": {
    id: "math-14-12",
    title: "The binomial theorem",
    tagline: "The binomial theorem explains why combinations appear when a two-choice expression is multiplied many times.",
    connections: {
      buildsOn: ["Combinations", "Permutations", "Proof by induction"],
      leadsTo: ["binomial distributions", "Taylor expansions", "probability generating functions"],
      usedWith: ["combinations", "summations", "polynomials", "probability"]
    },
    motivation:
      "<p>You know how to expand $(x+y)^2$: it becomes $x^2+2xy+y^2$. The coefficient 2 appears because $xy$ can happen in two orders: choose $x$ then $y$, or $y$ then $x$.</p>" +
      "<p>The <b>binomial theorem</b> generalizes that story. In $(x+y)^n$, each factor offers a choice of $x$ or $y$, and combinations count how many ways lead to the same power pattern.</p>",
    definition:
      "<p>For every integer $n\\ge0$, $$ (x+y)^n=\\sum_{k=0}^{n}\\binom{n}{k}x^{n-k}y^k. $$ Here $k$ is the number of factors contributing $y$, so $n-k$ factors contribute $x$.</p>" +
      "<p>Why the coefficient is $\\binom{n}{k}$: expanding $(x+y)^n$ means choosing one term from each of $n$ factors. To produce $x^{n-k}y^k$, choose exactly which $k$ of the $n$ factors supply $y$. There are $\\binom{n}{k}$ such choices.</p>" +
      "<p><b>Assumptions that matter:</b> $n$ is a nonnegative integer in this finite form; $x$ and $y$ commute under multiplication; and each term's coefficient counts choices of factor positions, not new algebraic variables.</p>",
    worked: {
      problem: "Expand $(2a-b)^4$.",
      skills: ["binomial coefficients", "powers", "signs"],
      strategy: "Treat the binomial as $x+y$ with $x=2a$ and $y=-b$, then apply coefficients $1,4,6,4,1$.",
      steps: [
        { do: "Identify $x$ and $y$", result: "$x=2a$, $y=-b$", why: "write the expression in binomial form" },
        { do: "Write the theorem for $n=4$", result: "$x^4+4x^3y+6x^2y^2+4xy^3+y^4$", why: "row 4 coefficients are $1,4,6,4,1$" },
        { do: "Substitute $x=2a,y=-b$", result: "$(2a)^4+4(2a)^3(-b)+6(2a)^2(-b)^2+4(2a)(-b)^3+(-b)^4$", why: "replace each binomial part" },
        { do: "Simplify the first term", result: "$16a^4$", why: "$(2a)^4=16a^4$" },
        { do: "Simplify the second term", result: "$-32a^3b$", why: "$4\\cdot8a^3\\cdot(-b)=-32a^3b$" },
        { do: "Simplify the third term", result: "$24a^2b^2$", why: "$6\\cdot4a^2\\cdot b^2=24a^2b^2$" },
        { do: "Simplify the fourth term", result: "$-8ab^3$", why: "$4\\cdot2a\\cdot(-b^3)=-8ab^3$" },
        { do: "Simplify the fifth term", result: "$b^4$", why: "the fourth power removes the sign" }
      ],
      verify: "The signs alternate because $-b$ has odd powers in the second and fourth terms.",
      answer: "$(2a-b)^4=16a^4-32a^3b+24a^2b^2-8ab^3+b^4$.",
      connects: "Every coefficient counts which factors supplied the second term of the binomial."
    },
    practice: [
      { problem: "Expand $(x+y)^3$.", steps: [
        { do: "List coefficients for $n=3$", result: "$1,3,3,1$", why: "$\\binom30,\\binom31,\\binom32,\\binom33$" },
        { do: "Write the power pattern", result: "$x^3,x^2y,xy^2,y^3$", why: "powers of $x$ decrease while powers of $y$ increase" },
        { do: "Attach coefficients", result: "$x^3+3x^2y+3xy^2+y^3$", why: "apply the binomial theorem" },
        { do: "Check total degree", result: "each term has degree 3", why: "the original expression is cubed" },
        { do: "Interpret the middle coefficient", result: "$3$ choices", why: "choose which one of three factors supplies $y$" }
      ], answer: "$(x+y)^3=x^3+3x^2y+3xy^2+y^3$." },
      { problem: "Find the coefficient of $x^3y^2$ in $(x+y)^5$.", steps: [
        { do: "Match the term form", result: "$x^{5-k}y^k$", why: "binomial theorem pattern" },
        { do: "Set the $y$ exponent", result: "$k=2$", why: "the term has $y^2$" },
        { do: "Check the $x$ exponent", result: "$5-k=3$", why: "consistent with $x^3$" },
        { do: "Write the coefficient", result: "$\\binom52$", why: "choose which 2 factors supply $y$" },
        { do: "Compute", result: "$10$", why: "$5\\cdot4/2=10$" }
      ], answer: "The coefficient is 10." },
      { problem: "Expand $(1+t)^4$.", steps: [
        { do: "Use row 4 coefficients", result: "$1,4,6,4,1$", why: "binomial coefficients for $n=4$" },
        { do: "Write the power pattern", result: "$1,t,t^2,t^3,t^4$", why: "powers of 1 stay 1" },
        { do: "Attach coefficients", result: "$1+4t+6t^2+4t^3+t^4$", why: "apply the theorem" },
        { do: "Check by setting $t=1$", result: "$1+4+6+4+1=16$", why: "$(1+1)^4=16$" },
        { do: "Interpret", result: "coefficients sum to $2^4$", why: "each factor offers two choices" }
      ], answer: "$(1+t)^4=1+4t+6t^2+4t^3+t^4$." },
      { problem: "Find the coefficient of $a^2b^3$ in $(3a+2b)^5$.", steps: [
        { do: "Match $b$ exponent", result: "$k=3$", why: "the term has $b^3$" },
        { do: "Write the general term", result: "$\\binom53(3a)^{2}(2b)^3$", why: "$5-k=2$" },
        { do: "Compute the binomial coefficient", result: "$\\binom53=10$", why: "choose 3 factors for $2b$" },
        { do: "Compute scalar powers", result: "$3^2\\cdot2^3=9\\cdot8=72$", why: "separate coefficients from variables" },
        { do: "Multiply scalars", result: "$10\\cdot72=720$", why: "combine coefficient contributions" }
      ], answer: "The coefficient of $a^2b^3$ is 720." },
      { problem: "Use the binomial theorem to compute the probability of exactly 2 heads in 5 fair coin flips.", steps: [
        { do: "Count successful head positions", result: "$\\binom52$", why: "choose which 2 of 5 flips are heads" },
        { do: "Compute the count", result: "$10$", why: "$\\binom52=10$" },
        { do: "Compute probability of one exact pattern", result: "$(1/2)^5=1/32$", why: "five independent fair flips" },
        { do: "Multiply count by pattern probability", result: "$10/32$", why: "there are 10 disjoint successful patterns" },
        { do: "Simplify", result: "$5/16=0.3125$", why: "divide numerator and denominator by 2" }
      ], answer: "The probability is $5/16$, or $0.3125$." }
    ],
    applications: [
      { title: "Binomial probabilities", background: "The binomial distribution counts successes in independent yes-or-no trials. Its probabilities come directly from the binomial theorem.", numbers: "For 10 trials with success probability $0.3$, exactly 4 successes has probability $\\binom{10}{4}(0.3)^4(0.7)^6\\approx0.2001$." },
      { title: "Dropout masks", background: "Neural-network dropout randomly keeps or drops units. Counting how many units are kept is a binomial question.", numbers: "With 8 units and keep probability $0.75$, exactly 6 kept has probability $\\binom86(0.75)^6(0.25)^2\\approx0.3115$." },
      { title: "Feature subset probabilities", background: "Random feature selection chooses each feature independently in some methods. The number selected follows binomial coefficients.", numbers: "If 20 features are each chosen with probability $0.1$, exactly 2 chosen has probability $\\binom{20}{2}(0.1)^2(0.9)^{18}\\approx0.2852$." },
      { title: "Polynomial expansion", background: "Algebra systems and symbolic ML methods expand powers of sums. The theorem supplies coefficients without repeated multiplication.", numbers: "The coefficient of $x^7y^3$ in $(x+y)^{10}$ is $\\binom{10}{3}=120$." },
      { title: "Ensemble voting", background: "A majority vote among independent classifiers can be analyzed with binomial probabilities when each classifier has the same accuracy.", numbers: "For 5 classifiers each correct with probability $0.8$, majority correctness is $\\binom53(0.8)^3(0.2)^2+\\binom54(0.8)^4(0.2)+\\binom55(0.8)^5=0.94208$." },
      { title: "Counting subsets", background: "Setting $x=y=1$ in the binomial theorem proves that the total number of subsets of an $n$-element set is $2^n$.", numbers: "For $n=6$, $\\sum_{k=0}^6\\binom6k=(1+1)^6=64$ subsets." }
    ],
    applicationsClose: "The binomial theorem is the bridge from two choices per factor to coefficients, probabilities, subsets, and polynomial structure.",
    takeaways: [
      "$(x+y)^n=\\sum_{k=0}^n\\binom{n}{k}x^{n-k}y^k$ for nonnegative integer $n$.",
      "The coefficient $\\binom{n}{k}$ counts which $k$ factors contribute the $y$ term.",
      "Binomial coefficients power subset counts and binomial probabilities.",
      "Signs and scalar coefficients must be carried through the powers carefully."
    ]
  }
};
