module.exports = {
  "math-14-01": {
    connectionsProse: "<p>This lesson begins with the smallest units of discrete reasoning: statements that have definite truth values. Students who have seen program conditions, filters, or simple algebraic claims already know the habit of deciding whether a condition holds. Propositional logic gives that habit precise symbols for not, and, or, if-then, and if-and-only-if. It prepares the reader for predicate logic, Boolean algebra, proof methods, database filters, and rule-based ML system checks.</p>",
    motivation: "<p>Propositional logic studies whole statements that are either true or false. Instead of looking inside a sentence, it treats a proposition such as “the score passes the threshold” as one unit and then studies how compound statements behave. This lets a reader reason exactly about combinations like “passes score and passes policy” or “not disabled and eligible.”</p>" +
                "<p>The important point is that logical connectives have fixed meanings. Inclusive OR is true when either side is true, AND requires both sides, and a conditional fails only when a true assumption leads to a false conclusion. Truth tables make those meanings visible by checking every possible assignment, so two formulas are equivalent only when their columns match in every row.</p>",
    definition: "<p>Propositional logic studies propositions and compound formulas through truth values. A central equivalence is $$p\\to q\\equiv\\neg p\\lor q$$.</p>" +
                "<p><b>Assumptions that matter:</b> $p$ and $q$ are propositions with definite truth values, $\\lor$ is inclusive OR, and equivalence means matching truth values in every truth-table row.</p>",
    symbols: [
      { sym: "$p,q$", desc: "propositions" },
      { sym: "$T,F$", desc: "truth values" },
      { sym: "$\\neg$", desc: "not" },
      { sym: "$\\land$", desc: "and" },
      { sym: "$\\lor$", desc: "inclusive or" },
      { sym: "$\\to$", desc: "conditional" },
      { sym: "$\\equiv$", desc: "same truth value in every row" }
    ],
    derivation: [
      { do: "List four assignments", result: "$(T,T),(T,F),(F,T),(F,F)$", why: "two propositions give $2^2=4$ rows" },
      { do: "Evaluate the conditional", result: "$p\\to q$ is $T,F,T,T$", why: "only true antecedent and false consequent breaks a conditional" },
      { do: "Evaluate the negation", result: "$\\neg p$ is $F,F,T,T$", why: "negation flips $p$" },
      { do: "Evaluate the OR formula", result: "$\\neg p\\lor q$ is $T,F,T,T$", why: "OR is true when either side is true" },
      { do: "Compare the columns row by row", result: "$p\\to q\\equiv\\neg p\\lor q$", why: "the columns match in every row" }
    ],
    applications: [
      { title: "Program branches", background: "Boolean flags enumerate branch rows.", numbers: "three Boolean flags give $2^3=8$ possible branch rows." },
      { title: "Database filters", background: "Inclusive OR combines overlapping filters without double-counting.", numbers: "300 rows satisfy $p$, 200 satisfy $q$, 80 satisfy both, so inclusive OR returns $300+200-80=420$." },
      { title: "Circuit gates", background: "Gate outputs follow fixed truth-table meanings.", numbers: "inputs $(1,0)$ give AND output $0$ and OR output $1$." },
      { title: "Rule alerts", background: "Compound alert rules can be evaluated exactly.", numbers: "$T\\land T\\land\\neg F=T$, so the alert fires." },
      { title: "Feature flags", background: "Eligibility and kill-switch logic determines exposure.", numbers: "20 percent of 50,000 eligible users gives $0.20\\cdot50000=10000$ users when the kill switch is false." },
      { title: "ML release rule", background: "A conjunction requires every release condition to pass.", numbers: "if 120 items pass score and 100 of those pass policy, an AND release rule selects 100 items." }
    ]
  },
  "math-14-02": {
    connectionsProse: "<p>This lesson extends propositional logic by allowing statements to depend on objects. A proposition says that a whole sentence is true or false, while a predicate becomes true or false after an object from a domain is supplied. This is the language behind database checks, validation rules, graph properties, and mathematical claims about all examples or at least one example. It also prepares the reader for proof methods, relations, sets, and quantified ML guarantees.</p>",
    motivation: "<p>Predicate logic lets a statement depend on an object from a domain. Instead of saying only “the row is valid,” it can say $P(r)$, meaning row $r$ has the property $P$. Quantifiers then describe how widely the property holds: every row has it, some row has it, or no row has it.</p>" +
                "<p>The load-bearing habit is to separate the domain, the predicate, and the quantifier. An existential claim needs one witness that makes the statement true. A universal claim needs every domain element to pass, so one counterexample is enough to refute it. This exact language prevents vague statements such as “the model works on the data” from hiding which objects and which conditions are being claimed.</p>",
    definition: "<p>Predicate logic studies statements such as $P(x)$ whose truth depends on an object $x$ from a stated domain, together with quantified claims such as $\\forall xP(x)$ and $\\exists xP(x)$.</p>" +
                "<p><b>Assumptions that matter:</b> The domain must be stated, a witness makes an existential claim true, and a single counterexample refutes a universal claim.</p>",
    symbols: [
      { sym: "$P(x)$", desc: "predicate" },
      { sym: "$x$", desc: "domain element" },
      { sym: "$\\forall$", desc: "every" },
      { sym: "$\\exists$", desc: "at least one" },
      { sym: "$\\neg$", desc: "not" },
      { sym: "witness", desc: "an object making an existential claim true" }
    ],
    applications: [
      { title: "Database queries", background: "A nonempty satisfying set proves an existential claim but not a universal one.", numbers: "420 of 10,000 rows satisfy $P(r)$, so $\\exists rP(r)$ is true and $\\forall rP(r)$ is false." },
      { title: "Contracts", background: "A postcondition claim is tested on precondition-satisfying cases.", numbers: "200 precondition-satisfying tests with 199 postcondition passes give 1 observed counterexample." },
      { title: "Data validation", background: "Universal range claims fail when one value lies outside the allowed interval.", numbers: "values $0.2,0.9,1.3$ under $0\\le x\\le1$ give two passes and one counterexample." },
      { title: "Graph properties", background: "A degree condition over all nodes is a universal statement.", numbers: "degrees $2,3,2,1,4$ disprove “every degree is at least 2” by one node." },
      { title: "Fairness statements", background: "Quantified guarantees must name every group under consideration.", numbers: "group rates $0.51,0.50,0.49,0.52$ give one group below 0.50." },
      { title: "Optimization guarantees", background: "A universal tested claim fails on every step where the promised drop is absent.", numbers: "if loss drops on 8 of 10 tested steps, the universal tested claim has 2 failures." }
    ]
  },
  "math-14-03": {
    connectionsProse: "<p>Sets give discrete mathematics a clean language for collections. The reader may already know lists or tables from programming, but sets focus on membership and distinct elements rather than order or repetition. This makes them the natural foundation for logic, relations, functions, inclusion-exclusion, probability events, and feature groups. Later counting lessons rely on set operations to say exactly which outcomes are being counted.</p>",
    motivation: "<p>Sets are collections with distinct elements. They let data reasoning talk cleanly about membership, overlap, exclusion, and Cartesian products. Once a collection is treated as a set, asking whether an element belongs, whether two collections overlap, or how many distinct items remain becomes precise.</p>" +
                "<p>The main value is that set operations match common data tasks. A union merges sources, an intersection finds shared items, a difference removes exclusions, and a complement depends on a stated universe. Because duplicates are not counted as new elements, sets are especially useful for deduplication, coverage, leakage checks, and candidate generation.</p>",
    definition: "<p>A set is a collection of distinct elements. Set operations describe membership, overlap, removal, and complements, while finite cardinality counts distinct elements.</p>" +
                "<p><b>Assumptions that matter:</b> Duplicates do not create new set elements, and complements require a stated universe.</p>",
    symbols: [
      { sym: "$x\\in A$", desc: "membership" },
      { sym: "$A\\cup B$", desc: "union" },
      { sym: "$A\\cap B$", desc: "intersection" },
      { sym: "$A\\setminus B$", desc: "difference" },
      { sym: "$A^c$", desc: "complement relative to a universe" },
      { sym: "$|A|$", desc: "finite cardinality" }
    ],
    applications: [
      { title: "Train/test leakage", background: "The union of train and test ids counts distinct ids after overlap is removed.", numbers: "train 80,000, test 20,000, overlap 50 gives $80000+20000-50=99950$ distinct ids." },
      { title: "Vocabulary coverage", background: "Two token vocabularies combine by union and share by intersection.", numbers: "12,000 and 9,000 token sets with 7,500 overlap have union 13,500." },
      { title: "Recommendation candidates", background: "Candidate sources are deduplicated by set union.", numbers: "sources returning 100 and 80 with 30 overlap give 150 unique candidates." },
      { title: "Access groups", background: "Membership in at least one group is a union.", numbers: "25 and 18 engineers with 5 in both give 38 people in at least one group." },
      { title: "Image labels", background: "Shared labels form an intersection and all distinct labels form a union.", numbers: "$\\{cat,indoor,pet\\}$ and $\\{dog,indoor,pet\\}$ have intersection size 2 and union size 4." },
      { title: "Experiment exclusions", background: "Removing excluded users is a set difference from the universe of users.", numbers: "from 1,000,000 users, excluding 40,000 leaves 960,000 eligible users." }
    ]
  },
  "math-14-04": {
    connectionsProse: "<p>Relations build directly on sets by selecting ordered pairs from a Cartesian product. Once the reader can talk about elements and membership, a relation simply records which pairs are connected. This language supports graph edges, joins, dependency links, similarity links, and ordering rules. It also leads naturally to functions, equivalence classes, partial orders, and lattice structure.</p>",
    motivation: "<p>A relation records which ordered pairs are connected. In a database, the pair might be a user and a course; in a graph, it might be a source node and a target node; in a similarity system, it might be two items that pass a threshold. The relation is the set of pairs that actually hold, not the full list of possible pairs.</p>" +
                "<p>Many important properties are checked by looking for required pairs or missing counterexample pairs. Reflexive means every object relates to itself. Symmetric means a pair must be mirrored in the opposite direction. Transitive means a two-step connection forces the direct shortcut. These definitions are simple, but they are useful because they let finite structures be tested exactly.</p>",
    definition: "<p>A relation is a subset of a Cartesian product, so it records which ordered pairs are connected. Reflexive, symmetric, and transitive properties are definitions checked against required pairs.</p>" +
                "<p><b>Assumptions that matter:</b> The underlying sets must be stated, ordered pairs matter, and missing required pairs create counterexamples to relation properties.</p>",
    symbols: [
      { sym: "$R\\subseteq A\\times B$", desc: "relation" },
      { sym: "$(a,b)\\in R$", desc: "related pair" },
      { sym: "$aRb$", desc: "infix notation" },
      { sym: "reflexive", desc: "every element relates to itself" },
      { sym: "symmetric", desc: "each related pair is mirrored" },
      { sym: "transitive", desc: "two-step related pairs force the direct pair" }
    ],
    applications: [
      { title: "Database joins", background: "A join relation stores the user-course pairs that actually hold.", numbers: "4 users and 3 courses create 12 possible pairs; a relation may store 7 enrollments." },
      { title: "Equivalence classes", background: "A relation can group objects that are equivalent under a rule.", numbers: "modulo 3 on $\\{0,1,2,3,4,5\\}$ creates 3 classes of size 2." },
      { title: "Dependency closure", background: "Reachability adds indirect dependency pairs to direct ones.", numbers: "10 direct dependencies plus 2 transitive-only dependencies give 12 total reachable dependencies." },
      { title: "Similarity graphs", background: "Thresholded similar item pairs form a relation.", numbers: "10,000 scored item pairs with 640 above threshold give density $640/10000=0.064$." },
      { title: "A relation as a matrix", background: "A Boolean matrix can mark whether each ordered pair is present.", numbers: "a 5-by-5 Boolean relation has 25 possible entries." },
      { title: "Non-transitive similarity", background: "High pairwise similarity does not automatically satisfy transitivity.", numbers: "$s(A,B)=0.92$ and $s(B,C)=0.91$ pass a 0.9 threshold, but $s(A,C)=0.84$ fails, so one transitive shortcut is missing." }
    ]
  },
  "math-14-05": {
    connectionsProse: "<p>Functions are special relations, so this lesson follows naturally after sets and relations. A relation may connect one input to many outputs, but a function assigns exactly one output to each input. That restriction is the basis for transition tables, classifiers, hash maps, feature transformations, and deterministic rules. Counting finite functions also previews product-rule reasoning and hypothesis-space sizes.</p>",
    motivation: "<p>A function is a relation with one output for every input. The input side is the domain, and each domain element must be assigned a codomain element. Outputs may be shared unless the function is required to be injective, so many different inputs can map to the same label, bucket, or rounded value.</p>" +
                "<p>For finite sets, counting functions is a repeated-choice problem. Each input independently receives one of the available outputs. Because the same output can be reused, the number of choices does not shrink from one input to the next. Multiplying the same number of choices once per input gives the full count of possible assignments.</p>",
    definition: "<p>A function $f:A\\to B$ assigns exactly one codomain element to each domain element. If $|A|=m$ and $|B|=n$, the number of functions is $$n^m$$.</p>" +
                "<p><b>Assumptions that matter:</b> Every domain element must receive one output, outputs may be reused, and $A$ and $B$ are finite sets.</p>",
    symbols: [
      { sym: "$f:A\\to B$", desc: "function" },
      { sym: "$A$", desc: "domain" },
      { sym: "$B$", desc: "codomain" },
      { sym: "$f(a)$", desc: "output" },
      { sym: "injective", desc: "no shared outputs" },
      { sym: "surjective", desc: "every codomain element hit" },
      { sym: "$n^m$", desc: "all finite functions" }
    ],
    derivation: [
      { do: "List the domain elements", result: "$m$ inputs", why: "each must receive one output" },
      { do: "Choose an output for the first input", result: "$n$ choices", why: "any codomain element is allowed" },
      { do: "Repeat for each remaining input", result: "$n$ choices each time", why: "sharing outputs is allowed" },
      { do: "Multiply the independent choices", result: "$n\\cdot n\\cdots n$", why: "the product rule counts repeated choices" },
      { do: "Count the factors", result: "$n^m$", why: "there are $m$ domain elements" }
    ],
    applications: [
      { title: "Binary classifiers", background: "A classifier on a finite input space is a function into labels.", numbers: "3 binary features give 8 inputs; with 2 labels, possible classifiers on that finite domain total $2^8=256$." },
      { title: "Hashing", background: "An injective hash assignment is impossible when keys outnumber buckets.", numbers: "mapping 1000 keys to 100 buckets cannot be injective because $1000>100$." },
      { title: "Transition tables", background: "A deterministic transition table chooses one next state per state-symbol pair.", numbers: "5 states and 3 symbols require $5\\cdot3=15$ function entries." },
      { title: "Finite label functions", background: "Every example receives one label.", numbers: "4 examples into 3 labels give $3^4=81$ labelings." },
      { title: "Exactly two positives", background: "Binary label functions can be counted by total assignments or by selected positive positions.", numbers: "among 6 binary-labeled examples, all label functions total $2^6=64$, and exactly two positives total $\\binom62=15$." },
      { title: "Rounding feature", background: "A deterministic transform may map different inputs to the same output.", numbers: "ages 21 and 29 both map to 20, giving a valid function that is not injective." }
    ]
  },
  "math-14-06": {
    connectionsProse: "<p>Induction is the first proof method in this section that is designed for infinitely many related claims. It connects naturally to integer-indexed sequences, loops, recursion, and recurrence relations. A reader who can verify one case at a time can now learn how a proof covers all later cases at once. This method supports later lessons on recurrences, counting identities, and algorithm correctness.</p>",
    motivation: "<p>Induction proves infinitely many integer-indexed claims by proving the first case and a reusable next-step. The base case starts the chain at a known index. The inductive step says that whenever one link in the chain is true, the next link must also be true.</p>" +
                "<p>The important subtlety is that the inductive step is proved for an arbitrary index, not for one special number. That makes the step reusable. Once the base case is established, the step carries truth from the base case to the next case, then to the next, and so on. This is why induction is a natural proof language for recursive algorithms and loop invariants.</p>",
    definition: "<p>Proof by induction proves a family of statements $P(n)$ by proving a base case and a reusable step from $P(k)$ to $P(k+1)$.</p>" +
                "<p><b>Assumptions that matter:</b> The starting index must be stated, the base case must be proved, and the inductive step must work for an arbitrary valid $k$.</p>",
    symbols: [
      { sym: "$P(n)$", desc: "statement at index $n$" },
      { sym: "$n_0$", desc: "starting index" },
      { sym: "base case", desc: "proves $P(n_0)$" },
      { sym: "inductive hypothesis", desc: "assumes $P(k)$" },
      { sym: "inductive step", desc: "proves $P(k+1)$" }
    ],
    applications: [
      { title: "Recursive algorithms", background: "A base size and a size-reduction step can cover all positive input sizes.", numbers: "a proof for size 1 plus a size-$n$ to size-$(n-1)$ step covers every positive size." },
      { title: "Loop invariant", background: "Induction over iterations verifies a running quantity.", numbers: "after 5 iterations a sum loop stores $a_1+\\cdots+a_5$." },
      { title: "Binary trees", background: "Induction over height proves the full-tree node count.", numbers: "height 3 full binary tree has $1+2+4+8=15=2^4-1$ nodes." },
      { title: "Doubling systems", background: "Each round follows from the previous count by the same step.", numbers: "starting with 1 task and doubling for 10 rounds gives $2^{10}=1024$." },
      { title: "Dynamic programming", background: "Correct smaller entries plus a valid recurrence justify the next entry.", numbers: "correct entries for lengths 0 through 4 plus a valid recurrence prove length 5 next." },
      { title: "Gradient error recurrence", background: "A repeated multiplicative error update can be verified by induction.", numbers: "$e_{t+1}=0.8e_t$, $e_0=5$ gives $e_4=5(0.8)^4=2.048$." }
    ]
  },
  "math-14-07": {
    connectionsProse: "<p>Contradiction is another general proof method, and it pairs well with logic and quantified statements. The reader has already seen how a claim can be negated and how a single counterexample can disprove a universal statement. This lesson turns that habit into a method for proving impossibility, uniqueness, and forced collisions. It prepares the ground for pigeonhole arguments and lower-bound reasoning.</p>",
    motivation: "<p>Contradiction proves a claim by assuming its denial and following that denial until it violates an accepted fact. The temporary assumption is not believed to be true; it is used to test what would happen if the target claim failed. If the consequences are impossible, the denial must be rejected.</p>" +
                "<p>The method depends on careful negation and a genuine contradiction. It is not enough for the temporary assumption to seem unlikely. The chain must reach something impossible, such as more objects than available slots under a claimed limit, two different values both equal to the same unique value, or a rule and its violation holding together.</p>",
    definition: "<p>Proof by contradiction proves a target claim $P$ by assuming its denial $\\neg P$ and deriving an impossibility.</p>" +
                "<p><b>Assumptions that matter:</b> The denial must be the exact logical negation, each implication from the temporary assumption must be valid, and the final conflict must be a genuine contradiction.</p>",
    symbols: [
      { sym: "$P$", desc: "target claim" },
      { sym: "$\\neg P$", desc: "temporary denial" },
      { sym: "$F$", desc: "false statement or impossibility" },
      { sym: "contradiction examples", desc: "$0=1$ or a reduced fraction with a common factor" }
    ],
    applications: [
      { title: "Compression lower bound", background: "Assuming every byte string compresses would require too many shorter outputs.", numbers: "there are 256 one-byte strings but only $1+2+4+8+16+32+64+128=255$ shorter binary strings, so not every byte string compresses." },
      { title: "Pigeonhole proof", background: "Too many users for too few shards contradicts a one-per-shard assumption.", numbers: "101 users in 100 shards contradict the assumption of at most one user per shard." },
      { title: "Uniqueness", background: "Two alleged different solutions collapse to the same value.", numbers: "if $2x=6$ and $2y=6$, both equal 3, so two different solutions contradict equality." },
      { title: "Hash security", background: "A perfect no-collision claim fails when messages outnumber hashes.", numbers: "17 messages and 16 four-bit hashes force a collision, contradicting perfect collision avoidance." },
      { title: "Data validation", background: "An observed invalid value contradicts a universal validity rule.", numbers: "a row with age $-3$ contradicts a validity rule requiring age at least 0." },
      { title: "Decision lower bound", background: "A binary question cannot distinguish more cases than its answer patterns.", numbers: "one yes-or-no question has only 2 answer patterns, so it cannot distinguish 3 cases." }
    ]
  },
  "math-14-08": {
    connectionsProse: "<p>The sum rule begins the main counting spine of the section. It uses sets and disjoint cases to count outcomes without double-counting. The reader may already add category totals in ordinary data summaries; this lesson explains when that addition is valid. It supports later work on combinations, identities, inclusion-exclusion, probability, and complexity counts.</p>",
    motivation: "<p>The sum rule counts choices split into disjoint cases. The important habit is not the addition itself; it is making cases that cover everything once. If every outcome belongs to exactly one case, then adding the case sizes counts every outcome exactly once.</p>" +
                "<p>This is often the first step in a larger counting problem. Before adding, the cases must be checked for overlap and coverage. If cases overlap, inclusion-exclusion is needed instead. If the problem involves a sequence of choices rather than alternatives among cases, the product rule is the correct tool.</p>",
    definition: "<p>For pairwise disjoint finite sets, the size of the union is the sum of the case sizes: $$|A_1\\cup\\cdots\\cup A_k|=|A_1|+\\cdots+|A_k|$$.</p>" +
                "<p><b>Assumptions that matter:</b> The sets must be finite, pairwise disjoint, and together cover exactly the outcomes being counted.</p>",
    symbols: [
      { sym: "$A_i$", desc: "case set" },
      { sym: "$\\cup$", desc: "union" },
      { sym: "$|A_i|$", desc: "number of outcomes in case $i$" },
      { sym: "pairwise disjoint", desc: "$A_i\\cap A_j=\\varnothing$ for $i\\ne j$" }
    ],
    derivation: [
      { do: "State pairwise disjointness", result: "no element lies in two different $A_i$", why: "overlap would cause double-counting" },
      { do: "Count the first case", result: "$|A_1|$", why: "every element counted belongs to the union" },
      { do: "Add the second case", result: "$|A_1|+|A_2|$", why: "no element duplicates an $A_1$ element because the sets are disjoint" },
      { do: "Continue through all cases", result: "$|A_1|+\\cdots+|A_k|$", why: "each new set adds only new elements" },
      { do: "Recognize the union", result: "$|A_1\\cup\\cdots\\cup A_k|=|A_1|+\\cdots+|A_k|$", why: "the union is exactly all these elements together" }
    ],
    applications: [
      { title: "Search types", background: "Disjoint result types can be added directly.", numbers: "12 documents, 8 images, and 5 videos with no overlap give 25 results." },
      { title: "Dataset splits", background: "Train, validation, and test partitions are designed to be disjoint.", numbers: "70,000 train, 15,000 validation, 15,000 test give 100,000 examples." },
      { title: "Error taxonomy", background: "Primary error categories count once per item when categories are disjoint.", numbers: "18 label, 25 retrieval, and 7 ranking errors give 50 primary errors." },
      { title: "User funnels", background: "Entrants from disjoint sources add to a total entrant count.", numbers: "300 search, 120 ads, and 80 referral entrants give 500 users." },
      { title: "File indexing", background: "File type partitions can be summed when each file has one type.", numbers: "1.2 million HTML, 0.4 million PDFs, and 0.1 million images give 1.7 million files." },
      { title: "Model menu", background: "Alternative model-family choices form disjoint cases.", numbers: "10 linear, 24 tree, and 6 kernel choices give 40 candidates." }
    ]
  },
  "math-14-09": {
    connectionsProse: "<p>The product rule follows the sum rule by counting sequences of choices rather than disjoint alternatives. It connects to Cartesian products from set language and to functions, where each input receives an output. This lesson gives the arithmetic behind search grids, feature crosses, passwords, and state spaces. It also prepares the reader for permutations, binomial expansions, and complexity growth.</p>",
    motivation: "<p>The product rule counts sequential choices. After one choice is made, the next choice is paired with it, and each completed sequence becomes an ordered tuple. The total grows by multiplying because each earlier partial outcome branches into the choices available at the next step.</p>" +
                "<p>This explains both useful design spaces and combinatorial explosion. A small number of options at each stage can produce a large number of total configurations. The product rule is therefore a tool for counting what is possible and for recognizing when an exhaustive search is becoming too large.</p>",
    definition: "<p>If a process has $k$ sequential steps with $n_i$ choices at step $i$, then the number of ordered outcomes is $$n_1n_2\\cdots n_k$$.</p>" +
                "<p><b>Assumptions that matter:</b> Each outcome is an ordered tuple, and the stated number of choices is available for each corresponding partial outcome.</p>",
    symbols: [
      { sym: "$n_i$", desc: "choices at step $i$" },
      { sym: "$k$", desc: "number of steps" },
      { sym: "ordered tuple", desc: "records the sequence" },
      { sym: "$A\\times B$", desc: "Cartesian product with $|A\\times B|=|A||B|$" }
    ],
    derivation: [
      { do: "Count step 1", result: "$n_1$ choices", why: "the first coordinate can be chosen in $n_1$ ways" },
      { do: "Attach step 2 to each first choice", result: "$n_1n_2$ partial outcomes", why: "each first choice branches into $n_2$ choices" },
      { do: "Attach step 3 to each partial outcome", result: "$n_1n_2n_3$ partial outcomes", why: "each existing partial outcome branches again" },
      { do: "Continue through step $k$", result: "$n_1n_2\\cdots n_k$", why: "the same branching argument repeats" },
      { do: "Interpret each completed branch", result: "$n_1n_2\\cdots n_k$ ordered tuples", why: "each full outcome is one ordered tuple" }
    ],
    applications: [
      { title: "Hyperparameter grids", background: "Independent hyperparameter choices multiply into runs.", numbers: "6 learning rates, 4 depths, 3 regularization values give 72 runs." },
      { title: "Password spaces", background: "Each character position contributes one sequential choice.", numbers: "8 lowercase characters give $26^8=208827064576$ strings." },
      { title: "Feature crosses", background: "A crossed bucket records one choice from each categorical feature.", numbers: "20 cities, 5 device types, and 3 tiers give 300 crossed buckets." },
      { title: "Test configurations", background: "Configuration matrices grow by multiplying option counts.", numbers: "7 browsers, 3 locales, 4 screen sizes give 84 configurations." },
      { title: "Architecture search", background: "Architecture dimensions define a product search space.", numbers: "3 depths, 4 widths, 2 activations, 2 optimizers give 48 candidates." },
      { title: "Robot states", background: "A finite state can be a tuple of position, heading, and gripper state.", numbers: "10 positions, 4 headings, 2 gripper states give 80 states." }
    ]
  },
  "math-14-10": {
    connectionsProse: "<p>Permutations specialize the product rule to ordered selections without replacement. The reader has already seen that sequential choices multiply; this lesson adds the condition that each selected object is used only once. That condition makes the number of choices shrink from position to position. The idea is central to rankings, schedules, shuffles, and ordered pipeline choices.</p>",
    motivation: "<p>Permutations count arrangements where position matters. Ranking the same five recommendations in a different order is a different output. A first-place item and a third-place item are not interchangeable when the positions have meaning.</p>" +
                "<p>Because selection is without replacement, each filled position removes one object from the remaining choices. The first position has the full set available, the second has one fewer, and the pattern continues until the requested number of positions is filled. Factorials give a compact way to write that decreasing product.</p>",
    definition: "<p>The number of ordered selections of $r$ objects from $n$ distinct objects without replacement is $$P(n,r)=\\frac{n!}{(n-r)!}$$.</p>" +
                "<p><b>Assumptions that matter:</b> Objects are distinct, order matters, and selection is without replacement.</p>",
    symbols: [
      { sym: "$n$", desc: "distinct objects" },
      { sym: "$r$", desc: "ordered positions" },
      { sym: "$n!$", desc: "product down to 1" },
      { sym: "$P(n,r)$", desc: "ordered selections without replacement" }
    ],
    derivation: [
      { do: "Fill the first ordered position", result: "$n$ choices", why: "any object can be first" },
      { do: "Fill the second position", result: "$n-1$ choices", why: "one object was already used" },
      { do: "Continue until $r$ positions are filled", result: "last position has $n-r+1$ choices", why: "each previous position removes one object" },
      { do: "Multiply by the product rule", result: "$n(n-1)\\cdots(n-r+1)$", why: "ordered positions are sequential choices" },
      { do: "Expand the factorial", result: "$n!=n(n-1)\\cdots(n-r+1)(n-r)!$", why: "the leading decreasing product is part of $n!$" },
      { do: "Divide by the unused tail", result: "$P(n,r)=n!/(n-r)!$", why: "cancelling $(n-r)!$ leaves the decreasing product" }
    ],
    applications: [
      { title: "Ranked search", background: "Top positions are ordered and cannot repeat the same candidate.", numbers: "ordered top 3 from 50 candidates gives $50\\cdot49\\cdot48=117600$." },
      { title: "Survey order", background: "Every ordering of distinct questions is a permutation.", numbers: "6 questions can appear in $6!=720$ orders." },
      { title: "Job scheduling", background: "A schedule orders each distinct job once.", numbers: "8 distinct jobs have $8!=40320$ schedules." },
      { title: "Dataset shuffling", background: "A shuffle is an ordering of all examples.", numbers: "10 examples have $10!=3628800$ possible shuffles." },
      { title: "No-repeat access token", background: "Token characters selected without replacement form an ordered sequence.", numbers: "6 characters from 36 symbols gives $36\\cdot35\\cdot34\\cdot33\\cdot32\\cdot31$ tokens." },
      { title: "Pipeline order", background: "Applying transformations in different orders can produce different pipelines.", numbers: "4 transformations can be ordered in $4!=24$ ways." }
    ]
  },
  "math-14-11": {
    connectionsProse: "<p>Combinations come after permutations because they count selections when order is not part of the outcome. The reader has already seen how ordered selections are counted by multiplying decreasing choices. This lesson removes the internal orderings that should not create new outcomes. It is the counting tool behind subsets, panels, mini-batches, graph edges, and feature selection.</p>",
    motivation: "<p>Combinations count selected groups when internal order does not matter. A mini-batch or feature subset is the same group no matter how it is listed. The outcome is the chosen collection, not a ranking or sequence.</p>" +
                "<p>The standard derivation starts with the easier ordered count. Each unordered group of size $r$ appears once for every possible ordering of its members, so the permutation count counts each group $r!$ times. Dividing by those internal orderings leaves each unordered group counted once.</p>",
    definition: "<p>The number of unordered selections of $r$ objects from $n$ distinct objects is $$\\binom nr=\\dfrac{n!}{r!(n-r)!}$$.</p>" +
                "<p><b>Assumptions that matter:</b> Objects are distinct, order does not matter, and each selected group has exactly $r$ elements.</p>",
    symbols: [
      { sym: "$\\binom nr$", desc: "read “$n$ choose $r$”" },
      { sym: "$n$", desc: "available distinct objects" },
      { sym: "$r$", desc: "selected objects" },
      { sym: "$r!$", desc: "internal orderings removed" }
    ],
    derivation: [
      { do: "First count ordered selections", result: "$P(n,r)=n!/(n-r)!$", why: "permutations are easier because positions matter" },
      { do: "Count internal orders of one selected group", result: "$r!$", why: "the $r$ selected objects can be arranged in $r!$ orders" },
      { do: "Identify overcounting", result: "each unordered group is counted exactly $r!$ times", why: "all internal orderings describe the same group" },
      { do: "Divide the ordered count", result: "$P(n,r)/r!$", why: "division removes duplicate internal orderings" },
      { do: "Substitute the permutation formula", result: "$\\binom nr=P(n,r)/r!=n!/(r!(n-r)!)$", why: "each unordered group remains counted once" }
    ],
    applications: [
      { title: "Feature subset selection", background: "A selected feature set is unordered.", numbers: "choosing 5 from 30 gives $\\binom{30}{5}=142506$ subsets." },
      { title: "Mini-batches", background: "A batch contains examples without internal ranking.", numbers: "choosing 4 examples from 20 gives $\\binom{20}{4}=4845$." },
      { title: "Reviewer panels", background: "A panel is the same group regardless of listing order.", numbers: "choosing 3 from 12 gives 220 panels." },
      { title: "Pairwise comparisons", background: "An unordered pair does not distinguish first from second.", numbers: "100 items have $\\binom{100}{2}=4950$ unordered pairs." },
      { title: "Segment choices", background: "A chosen set of audience segments is unordered.", numbers: "choosing 3 from 9 gives 84 segment sets." },
      { title: "Graph edges", background: "An undirected edge is an unordered pair of vertices.", numbers: "50 vertices have $\\binom{50}{2}=1225$ possible undirected edges." }
    ]
  },
  "math-14-12": {
    connectionsProse: "<p>The binomial theorem links algebraic expansion to combination counting. It depends on the product rule because expanding a product means making a choice from each factor. It also depends on combinations because only the positions of the chosen terms matter for each coefficient. The theorem later supports binomial probability, generating functions, and subset-count identities.</p>",
    motivation: "<p>The binomial theorem explains why combination numbers appear when a two-choice expression is multiplied many times. Each factor chooses one of two terms. After all choices are made, terms with the same number of $y$ choices combine into one coefficient.</p>" +
                "<p>For a fixed power $y^k$, the only question is which $k$ of the $n$ factors supplied $y$. The remaining factors supply $x$. There are $\\binom nk$ ways to choose those positions, so that combination number becomes the coefficient of $x^{n-k}y^k$.</p>",
    definition: "<p>For a nonnegative integer $n$, the binomial theorem expands a repeated two-term product as $$(x+y)^n=\\sum_{k=0}^n\\binom nkx^{n-k}y^k$$.</p>" +
                "<p><b>Assumptions that matter:</b> $x$ and $y$ commute, and $n$ is a nonnegative integer so the product has $n$ factors.</p>",
    symbols: [
      { sym: "$n$", desc: "nonnegative integer" },
      { sym: "$k$", desc: "number of factors contributing $y$" },
      { sym: "$x,y$", desc: "commuting terms" },
      { sym: "$\\binom nk$", desc: "coefficient of $x^{n-k}y^k$" }
    ],
    derivation: [
      { do: "Write the product", result: "$(x+y)^n$ as $n$ factors", why: "each factor contributes one term in an expansion" },
      { do: "Choose from each factor", result: "either $x$ or $y$", why: "expansion distributes over all choices" },
      { do: "Fix the power of $y$", result: "choose exactly $k$ factor positions to supply $y$", why: "a term with $y^k$ has $k$ $y$ choices" },
      { do: "Fill the remaining positions", result: "$n-k$ positions supply $x$", why: "every factor contributes exactly one term" },
      { do: "Count the $y$ positions", result: "$\\binom nk$ choices", why: "only the set of positions matters" },
      { do: "Sum over all possible $k$", result: "$(x+y)^n=\\sum_{k=0}^n\\binom nkx^{n-k}y^k$", why: "$k=0$ through $n$ covers every expansion term" }
    ],
    applications: [
      { title: "Binomial probabilities", background: "Exactly $k$ successes use a binomial coefficient and success/failure probabilities.", numbers: "10 trials, success probability 0.3, exactly 4 successes gives $\\binom{10}{4}(0.3)^4(0.7)^6\\approx0.2001$." },
      { title: "Dropout masks", background: "Kept units are success positions in independent Bernoulli trials.", numbers: "8 units with keep probability 0.75, exactly 6 kept gives $\\binom86(0.75)^6(0.25)^2\\approx0.3115$." },
      { title: "Random features", background: "Independent feature inclusion has binomial counts by selected positions.", numbers: "20 features chosen independently with probability 0.1, exactly 2 chosen gives $\\binom{20}{2}(0.1)^2(0.9)^{18}\\approx0.2852$." },
      { title: "Polynomial coefficient", background: "A coefficient counts the factors that supply $y$.", numbers: "coefficient of $x^7y^3$ in $(x+y)^{10}$ is $\\binom{10}{3}=120$." },
      { title: "Ensemble majority", background: "Majority correctness sums the cases with 3, 4, or 5 correct classifiers.", numbers: "5 classifiers with accuracy 0.8 have majority-correct probability $\\binom53(0.8)^3(0.2)^2+\\binom54(0.8)^4(0.2)+\\binom55(0.8)^5=0.94208$." },
      { title: "Subset count", background: "Setting both terms to 1 sums all binomial coefficients.", numbers: "$\\sum_{k=0}^6\\binom6k=(1+1)^6=64$ subsets." }
    ]
  },
  "math-14-13": {
    connectionsProse: "<p>Combinatorial identities come after the main counting rules because they use those rules to explain algebraic equalities. The reader has seen sums, products, combinations, and binomial coefficients. This lesson shows how two different counting methods can describe the same finite set. That viewpoint is useful in probability, feature counting, subset search, and simplifying formulas.</p>",
    motivation: "<p>A combinatorial identity is often two honest counts of the same finite set. One side may count all objects directly, while the other side splits them into cases and adds those cases. If both descriptions count exactly the same objects once, the algebraic equality follows from counting rather than symbolic manipulation alone.</p>" +
                "<p>Vandermonde's identity is a model example. A committee can be chosen from a combined population all at once, or it can be counted by how many members come from the first group and how many from the second. The case split is disjoint and complete, so summing the case counts must match the direct count.</p>",
    definition: "<p>Combinatorial identities can be proved by counting the same finite set in two ways. Vandermonde's identity is $$\\sum_{k=0}^r\\binom mk\\binom n{r-k}=\\binom{m+n}r$$.</p>" +
                "<p><b>Assumptions that matter:</b> The groups are disjoint, committees have size $r$, and the sum ranges over possible values of $k$ that split the selected committee.</p>",
    symbols: [
      { sym: "$m,n$", desc: "group sizes" },
      { sym: "$r$", desc: "total selected" },
      { sym: "$k$", desc: "selected from the first group" },
      { sym: "$\\sum$", desc: "adds disjoint cases" }
    ],
    derivation: [
      { do: "Split the population", result: "groups of sizes $m$ and $n$", why: "the identity tracks selections from two groups" },
      { do: "Count committees directly", result: "$\\binom{m+n}r$", why: "choose all $r$ members from the combined population at once" },
      { do: "Case-split by first-group members", result: "$k$ members from the first group", why: "each committee has a definite value of $k$" },
      { do: "Count a fixed case", result: "$\\binom mk\\binom n{r-k}$", why: "choose $k$ from the first group and $r-k$ from the second" },
      { do: "Multiply within the fixed case", result: "$\\binom mk\\binom n{r-k}$", why: "the two group choices are made together by the product rule" },
      { do: "Sum over all possible $k$", result: "$\\sum_{k=0}^r\\binom mk\\binom n{r-k}=\\binom{m+n}r$", why: "the cases are disjoint and cover every committee" }
    ],
    applications: [
      { title: "Feature subset search", background: "Every binary feature is either included or excluded.", numbers: "12 binary features produce $2^{12}=4096$ subsets and 4095 nonempty subsets." },
      { title: "Ensembles", background: "An ensemble of fixed size is an unordered model subset.", numbers: "from 8 trained models, exactly 3-model ensembles number $\\binom83=56$." },
      { title: "Audience attributes", background: "Each binary attribute contributes an inclusion pattern.", numbers: "6 binary attributes give $2^6=64$ inclusion patterns." },
      { title: "Polynomial features", background: "Degree-2 monomials with repetition are combinations with repetition.", numbers: "4 inputs and degree 2 monomials with repetition give $\\binom{4+2-1}{2}=10$." },
      { title: "Projection lists", background: "Choosing output columns is an unordered subset count.", numbers: "choosing 4 columns from 20 gives $\\binom{20}{4}=4845$." },
      { title: "Multi-label outputs", background: "A label set includes or excludes each possible label.", numbers: "10 labels give $2^{10}=1024$ label sets and 1023 nonempty label sets." }
    ]
  },
  "math-14-14": {
    connectionsProse: "<p>This lesson builds on sets, unions, intersections, and the counting habit from the sum rule. The sum rule works when cases are disjoint. Inclusion–exclusion handles the next common situation: the cases overlap, so a plain sum counts some objects more than once.</p>" +
                      "<p>This idea shows up whenever data, events, labels, alerts, or retrieval results are merged. A user may be in two audiences, a row may fail two validation rules, and a document may come from two retrievers. Inclusion–exclusion gives the exact union count by adding the easy counts and then repairing the overlap.</p>",
    motivation: "<p>Suppose 55 users use mobile and 40 users use desktop. Adding gives 95 device-usages, not necessarily 95 users, because the users who use both devices appear in both counts. If 20 users use both, those 20 users were counted twice. Subtracting the overlap once leaves each user counted exactly once.</p>" +
                "<p>The same repair pattern extends to three sets. First add the three single-set counts. Then subtract the pairwise overlaps, because each overlapping item has been counted too often. But an item in all three sets has then been added three times and subtracted three times, leaving zero copies. It must be added back once. Inclusion–exclusion is careful bookkeeping: every element in the union ends with coefficient 1.</p>",
    definition: "<p>Inclusion–exclusion counts a union of overlapping finite sets by adding easy counts and repairing overcounts. For two sets, $$|A\\cup B|=|A|+|B|-|A\\cap B|$$. For three sets, $$|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|A\\cap C|-|B\\cap C|+|A\\cap B\\cap C|$$.</p>" +
                "<p><b>Assumptions that matter:</b> The sets are finite, overlaps are counted with intersections, and complements require a stated universe.</p>",
    symbols: [
      { sym: "$A,B,C$", desc: "finite sets" },
      { sym: "$\\cup$", desc: "union, or membership in at least one set" },
      { sym: "$\\cap$", desc: "intersection, or membership in all named sets" },
      { sym: "$|A|$", desc: "the number of elements in $A$" },
      { sym: "complements", desc: "require a stated universe" }
    ],
    derivation: [
      { do: "Split the union into disjoint pieces", result: "$A\\setminus B$, $B\\setminus A$, and $A\\cap B$", why: "every element in $A\\cup B$ belongs to exactly one of these three regions" },
      { do: "Count $A$ by regions", result: "$|A\\setminus B|+|A\\cap B|$", why: "$A$ consists of its outside-$B$ part plus the overlap" },
      { do: "Count $B$ by regions", result: "$|B\\setminus A|+|A\\cap B|$", why: "$B$ has the same kind of split" },
      { do: "Add the single-set counts", result: "$|A|+|B|=|A\\setminus B|+|B\\setminus A|+2|A\\cap B|$", why: "the overlap appears in both sets" },
      { do: "Subtract one overlap", result: "$|A|+|B|-|A\\cap B|=|A\\setminus B|+|B\\setminus A|+|A\\cap B|$", why: "each region is counted once" },
      { do: "Recognize the right-hand side", result: "$|A\\cup B|$", why: "it is the disjoint-region count of the union" },
      { do: "Check an element that lies only in one set", result: "final count 1", why: "it is added once, subtracted zero times, and added back zero times" },
      { do: "Check an element that lies in exactly two sets", result: "final count 1", why: "it is added twice and subtracted once in its pairwise intersection" },
      { do: "Check an element that lies in all three sets", result: "temporary count 0", why: "it is added three times and subtracted three times, once for each pair" },
      { do: "Add the triple intersection once", result: "$3-3+1=1$", why: "the all-three element must be counted once" },
      { do: "Cover all cases", result: "the three-set formula counts every union element once", why: "every union element falls into exactly one of these cases" }
    ],
    applications: [
      { title: "Deduplicating alerts", background: "Overlapping alert sources should count hosts once.", numbers: "CPU alerts hit 40 hosts, memory alerts hit 30 hosts, and 12 hosts hit both; unique alerted hosts are $40+30-12=58$." },
      { title: "Search result blending", background: "Merged retrieval results subtract overlapping documents.", numbers: "Retriever A returns 100 documents, B returns 80, and 25 overlap; the merged result set has $100+80-25=155$ unique documents." },
      { title: "Data quality checks", background: "Rows failing either rule are counted by a union.", numbers: "Rule counts are 300 and 220 with 75 rows failing both; rows failing at least one rule total $300+220-75=445$." },
      { title: "Discrete probability", background: "The same union repair applies to event probabilities.", numbers: "If $P(A)=0.4$, $P(B)=0.3$, and $P(A\\cap B)=0.1$, then $P(A\\cup B)=0.4+0.3-0.1=0.6$." },
      { title: "Cache coverage", background: "At least one cache hit is the union of cache-hit sets.", numbers: "Cache 1 hits 700 requests, cache 2 hits 500, and both hit 250; at least one cache hits $700+500-250=950$ requests." },
      { title: "Multi-label evaluation", background: "Three label sets require pairwise subtraction and triple add-back.", numbers: "Label counts are 45, 35, and 20; pair overlaps are 10, 5, and 4; triple overlap is 2. The union is $45+35+20-(10+5+4)+2=83$ items." }
    ]
  },
  "math-14-15": {
    connectionsProse: "<p>The pigeonhole principle follows naturally from counting objects and boxes. It uses contradiction, the sum rule, and integer ceilings to turn a counting imbalance into a guaranteed collision or load. The reader has already seen examples where too many items cannot fit under a claimed limit. This lesson makes that reasoning exact for hashing, sharding, birthdays, and load balancing.</p>",
    motivation: "<p>Pigeonhole reasoning turns crowding into certainty. If too many objects must fit into too few boxes, some box must hold a repeat or a high load. The conclusion does not identify which box is crowded; it guarantees that at least one such box exists.</p>" +
                "<p>The generalized version gives a load guarantee. If $N$ objects are distributed across $k$ boxes, then the average load is $N/k$. Since a box count must be an integer, some box must reach at least the ceiling of that average. Assuming every box is below that level would make the total capacity too small for all $N$ objects.</p>",
    definition: "<p>If $N$ objects are placed into $k$ boxes, some box has at least $$\\lceil N/k\\rceil$$ objects.</p>" +
                "<p><b>Assumptions that matter:</b> Every object is placed in one of the $k$ boxes, box loads are integers, and $k$ is positive.</p>",
    symbols: [
      { sym: "$N$", desc: "objects" },
      { sym: "$k$", desc: "boxes" },
      { sym: "$\\lceil x\\rceil$", desc: "smallest integer at least $x$" },
      { sym: "crowded box", desc: "a box meeting the guaranteed load" }
    ],
    derivation: [
      { do: "Place objects into boxes", result: "$N$ objects and $k$ boxes", why: "the principle concerns distributing objects among boxes" },
      { do: "Define the guaranteed load", result: "$q=\\lceil N/k\\rceil$", why: "the ceiling is the smallest integer at least the average" },
      { do: "Assume the contrary", result: "every box has at most $q-1$ objects", why: "contradiction tests failure of the guarantee" },
      { do: "Bound total capacity under that assumption", result: "at most $k(q-1)$ objects", why: "there are $k$ boxes each holding at most $q-1$" },
      { do: "Use the ceiling inequality", result: "$k(q-1)<N$", why: "$q-1<N/k$, and multiplying by $k$ preserves the inequality" },
      { do: "Contradict the placement of all objects", result: "some box has at least $q$ objects", why: "capacity below $N$ cannot hold all $N$ objects" }
    ],
    applications: [
      { title: "Hash collisions", background: "Many ids mapped to fewer buckets force a loaded bucket.", numbers: "10,000 ids into 1,024 buckets force a bucket with at least $\\lceil10000/1024\\rceil=10$ ids." },
      { title: "Birthdays", background: "People are objects and possible birthdays are boxes.", numbers: "367 people and 366 possible birthdays force a shared birthday." },
      { title: "Load balancing", background: "A worker must receive at least the ceiling average load.", numbers: "101 tasks on 20 workers force at least 6 tasks on one worker." },
      { title: "Remainders", background: "Remainder classes act as boxes.", numbers: "11 integers force two with the same remainder modulo 10." },
      { title: "Cache sets", background: "Active keys assigned to cache sets force one set to be crowded.", numbers: "250 active keys in 64 cache sets force at least 4 keys in one set." },
      { title: "Sequence buckets", background: "Bucketing sequences by length guarantees one busy length bucket.", numbers: "513 sequences in 32 length buckets force at least 17 sequences in one bucket." }
    ]
  },
  "math-14-16": {
    connectionsProse: "<p>Recurrence relations connect counting to sequences and algorithms. After learning to count static sets of outcomes, the reader now describes a quantity by how it grows from smaller cases. This is the natural language of dynamic programming, recursive algorithms, autoregressive costs, and branching structures. It also prepares the reader for solving linear recurrences and using generating functions.</p>",
    motivation: "<p>A recurrence defines a sequence by giving starting values and a rule for later terms. Instead of writing a direct formula immediately, it says how to compute the next value from earlier values. This mirrors many algorithms that solve a problem by referring to smaller subproblems.</p>" +
                "<p>The key modeling step is to split a size-$n$ object into cases that refer to smaller sizes. For binary strings with no consecutive 1s, the final symbol gives a clean split. Strings ending in 0 reduce to any valid shorter string, while strings ending in 1 must have a preceding 0, reducing to a still shorter valid prefix.</p>",
    definition: "<p>A recurrence relation defines sequence terms from earlier terms. For binary strings with no consecutive 1s, the count satisfies $$a_n=a_{n-1}+a_{n-2}$$.</p>" +
                "<p><b>Assumptions that matter:</b> $a_n$ counts valid length-$n$ strings, cases are split by final symbol, and initial values anchor the recurrence.</p>",
    symbols: [
      { sym: "$a_n$", desc: "sequence term at size $n$" },
      { sym: "initial values", desc: "anchor the recurrence" },
      { sym: "first-order", desc: "uses one previous term" },
      { sym: "second-order", desc: "uses two previous terms" }
    ],
    derivation: [
      { do: "Define the counted quantity", result: "$a_n$ counts valid length-$n$ strings", why: "the recurrence needs a precise sequence" },
      { do: "Split by final symbol", result: "final symbol 0 or 1", why: "these cases are disjoint and cover all valid strings" },
      { do: "Count strings ending in 0", result: "$a_{n-1}$", why: "the first $n-1$ symbols can be any valid string" },
      { do: "Analyze strings ending in 1", result: "the ending must be 01", why: "a previous 1 would create consecutive 1s" },
      { do: "Count the remaining prefix", result: "$a_{n-2}$", why: "the first $n-2$ symbols can be any valid string" },
      { do: "Add the disjoint cases", result: "$a_n=a_{n-1}+a_{n-2}$", why: "ending in 0 and ending in 1 are disjoint and complete" }
    ],
    applications: [
      { title: "DP tables", background: "A recurrence can fill table values from previous values.", numbers: "$D(n)=D(n-1)+n$, $D(0)=0$ gives $D(4)=1+2+3+4=10$." },
      { title: "Fibonacci", background: "A second-order recurrence adds two previous values.", numbers: "$F_5=5$ and $F_6=8$, so $F_7=13$." },
      { title: "Binary tree nodes", background: "Tree height recurrences describe recursive structure size.", numbers: "$N_h=2N_{h-1}+1$, $N_0=1$ gives $N_3=15$." },
      { title: "Batch schedule", background: "Repeated doubling is a first-order recurrence.", numbers: "$b_n=2b_{n-1}$ from 32 gives 256 after 3 doublings." },
      { title: "Queue backlog", background: "Backlog evolves by previous backlog plus arrivals minus service.", numbers: "$q_n=q_{n-1}+12-10$, $q_0=5$ gives $q_4=13$." },
      { title: "Autoregressive cost", background: "A running cost can increase by a fixed amount per step.", numbers: "$c_n=c_{n-1}+64$ from 0 gives 640 after 10 steps." }
    ]
  },
  "math-14-17": {
    connectionsProse: "<p>This lesson follows recurrence relations by asking when a recursive description can be turned into a closed formula. The reader has already seen sequences defined from previous terms. Linear recurrences with constant coefficients have a special structure that can be solved with characteristic roots. The method connects recurrence growth to geometric sequences and later to algorithmic growth rates.</p>",
    motivation: "<p>Solving a recurrence changes step-by-step computation into a formula. For homogeneous linear recurrences, geometric sequences make the recurrence become an algebra equation. This works because shifting a geometric sequence only changes it by powers of the same base.</p>" +
                "<p>The characteristic equation finds the bases that can appear in solutions. Once those bases are known, the general solution is a combination of the corresponding geometric sequences. Initial conditions then choose the constants, turning the family of possible solutions into the one sequence specified by the recurrence.</p>",
    definition: "<p>A homogeneous linear recurrence with constant coefficients can be solved by trying geometric terms. For $$a_n=5a_{n-1}-6a_{n-2},\\quad a_0=2,\\quad a_1=5$$ the solution is $$a_n=2^n+3^n$$.</p>" +
                "<p><b>Assumptions that matter:</b> The recurrence is homogeneous, has constant coefficients, and has initial conditions that determine the constants.</p>",
    symbols: [
      { sym: "$a_n$", desc: "sequence" },
      { sym: "$r$", desc: "characteristic root" },
      { sym: "$A,B$", desc: "constants set by initial conditions" },
      { sym: "homogeneous", desc: "no extra forcing term" }
    ],
    derivation: [
      { do: "Try a geometric solution", result: "$a_n=r^n$", why: "geometric sequences keep the same shape after shifting" },
      { do: "Substitute into the recurrence", result: "$r^n=5r^{n-1}-6r^{n-2}$", why: "the trial solution must satisfy the recurrence" },
      { do: "Divide by the common power", result: "$r^2=5r-6$", why: "dividing by $r^{n-2}$ turns shifts into powers of $r$" },
      { do: "Move all terms to one side", result: "$r^2-5r+6=0$", why: "this is the characteristic equation" },
      { do: "Factor the equation", result: "$(r-2)(r-3)=0$", why: "factoring finds the characteristic roots" },
      { do: "Write the general solution", result: "$a_n=A2^n+B3^n$", why: "distinct roots contribute geometric terms" },
      { do: "Use the first initial condition", result: "$A+B=2$", why: "$a_0=2$" },
      { do: "Use the second initial condition", result: "$2A+3B=5$", why: "$a_1=5$" },
      { do: "Solve the constants", result: "$A=1$, $B=1$", why: "the two linear equations determine the two constants" },
      { do: "State the closed form", result: "$a_n=2^n+3^n$", why: "substituting the constants gives the specified sequence" }
    ],
    applications: [
      { title: "Fibonacci growth", background: "Characteristic roots explain the rounded exponential growth estimate.", numbers: "$F_{20}=6765$, and $\\varphi^{20}/\\sqrt5\\approx6765$ gives the rounded growth estimate." },
      { title: "Algorithm recurrence", background: "Repeated doubling has an explicit power-of-two form.", numbers: "$T_n=2T_{n-1}$, $T_0=1$ gives $T_{30}=2^{30}=1,073,741,824$." },
      { title: "Population model", background: "A first-order multiplicative recurrence grows geometrically.", numbers: "$a_n=3a_{n-1}$ from 100 gives $a_5=100\\cdot3^5=24300$." },
      { title: "Signal filter", background: "A decaying recurrence has a closed geometric form.", numbers: "$y_n=0.5y_{n-1}$, $y_0=1$ gives $y_6=0.015625$." },
      { title: "Momentum memory", background: "Exponential decay describes retained momentum weight.", numbers: "$m_n=0.9m_{n-1}$, $m_0=1$ gives $m_{10}=0.9^{10}\\approx0.349$." },
      { title: "Branching search", background: "Each depth multiplies the number of nodes by the branching factor.", numbers: "$N_d=3N_{d-1}$, $N_0=1$ gives depth 6 count $729$." }
    ]
  },
  "math-14-18": {
    connectionsProse: "<p>Generating functions continue the sequence block by representing counts as coefficients of a formal power series. The reader has seen sequences, recurrences, and binomial coefficients; this lesson packages those counts into algebraic objects. Multiplication of generating functions corresponds to combining choices, so earlier product-rule ideas reappear in coefficient form. This prepares the reader for compact recurrence solving and constrained counting.</p>",
    motivation: "<p>A generating function stores a sequence as coefficients of powers of $x$. The variable records size, and algebra combines counts. The coefficient of $x^n$ is the count for size $n$, so the series is a bookkeeping device rather than an ordinary number to evaluate.</p>" +
                "<p>The geometric series is the basic model. It has one term at every nonnegative size, so every coefficient is 1. Multiplying by $x$ shifts every coefficient up by one power. Subtracting the shifted series cancels all positive powers, leaving a simple algebraic equation for the whole series.</p>",
    definition: "<p>An ordinary generating function stores a sequence as coefficients: $$A(x)=\\sum_{n\\ge0}a_nx^n$$. The basic geometric series satisfies $$1+x+x^2+\\cdots=1/(1-x)$$.</p>" +
                "<p><b>Assumptions that matter:</b> The manipulation is formal power-series bookkeeping, and $[x^n]A(x)$ denotes the coefficient at size $n$.</p>",
    symbols: [
      { sym: "$A(x)=\\sum_{n\\ge0}a_nx^n$", desc: "ordinary generating function" },
      { sym: "$a_n$", desc: "coefficient/count at size $n$" },
      { sym: "$[x^n]A(x)$", desc: "coefficient of $x^n$" }
    ],
    derivation: [
      { do: "Define the series", result: "$S=1+x+x^2+x^3+\\cdots$", why: "the series has one term at every nonnegative size" },
      { do: "Multiply by $x$", result: "$xS=x+x^2+x^3+\\cdots$", why: "multiplication by $x$ shifts each term up one power" },
      { do: "Subtract the shifted series", result: "$S-xS=1$", why: "every positive-power term cancels" },
      { do: "Factor the left side", result: "$(1-x)S=1$", why: "$S-xS$ has common factor $S$" },
      { do: "Solve for the series", result: "$S=1/(1-x)$", why: "divide by $1-x$ formally" },
      { do: "Interpret the coefficients", result: "$[x^n]S=1$", why: "there is one object of every size" }
    ],
    applications: [
      { title: "Convolution", background: "Multiplying generating functions combines choices and adds sizes.", numbers: "$(1+2x)(3+4x)$ has $x$ coefficient $1\\cdot4+2\\cdot3=10$." },
      { title: "Feature budgets", background: "The coefficient of a power counts ways to hit that total budget.", numbers: "$(1+x+x^2)(1+x)$ has coefficient of $x^2$ equal 2." },
      { title: "Dice sums", background: "A coefficient in a product of die polynomials counts sum outcomes.", numbers: "coefficient of $x^7$ in $(x+\\cdots+x^6)^2$ is 6." },
      { title: "Parts 1 and 3", background: "Allowed part sizes are encoded as powers of $x$.", numbers: "coefficient of $x^6$ in $(1+x+x^2+\\cdots)(1+x^3+x^6+\\cdots)$ is 3." },
      { title: "Binomial coefficient", background: "The binomial theorem is a generating-function coefficient statement.", numbers: "in $(1+x)^8$, coefficient of $x^3$ is $\\binom83=56$." },
      { title: "DP compression", background: "A product can compress a small dynamic-programming convolution.", numbers: "$(1+3x+2x^2)(1+x)$ has $x^2$ coefficient $3+2=5$." }
    ]
  },
  "math-14-19": {
    connectionsProse: "<p>Discrete probability uses the counting tools of the section to reason about uncertainty over finite or countable outcomes. Sets become events, unions and complements become event operations, and counts become probabilities when outcomes are equally likely. This lesson connects combinatorics to accuracy estimates, dropout masks, collisions, and token distributions. It also sets up probabilistic uses of inclusion-exclusion and binomial coefficients.</p>",
    motivation: "<p>Discrete probability turns counts or weights over countable outcomes into chances. For equally likely outcomes, probability is favorable count divided by total count. More generally, each outcome has a probability, and event probabilities come from adding the probabilities of outcomes in the event.</p>" +
                "<p>The complement rule is one of the most useful bookkeeping facts. An event and its complement are disjoint and together cover the entire sample space. Since total probability is 1, knowing the chance that the event happens immediately gives the chance that it does not happen.</p>",
    definition: "<p>Discrete probability assigns probabilities to outcomes in a finite or countable sample space and adds outcome probabilities over events. The complement rule is $$P(A^c)=1-P(A)$$.</p>" +
                "<p><b>Assumptions that matter:</b> The event $A$ and complement $A^c$ are disjoint, together cover $\\Omega$, and total probability is $P(\\Omega)=1$.</p>",
    symbols: [
      { sym: "$\\Omega$", desc: "sample space" },
      { sym: "$\\omega$", desc: "outcome" },
      { sym: "$P(\\omega)$", desc: "outcome probability" },
      { sym: "$A$", desc: "event" },
      { sym: "$A^c$", desc: "complement" },
      { sym: "$E[X]$", desc: "expectation" }
    ],
    derivation: [
      { do: "Split the sample space", result: "$A$ and $A^c$", why: "an event and its complement are disjoint" },
      { do: "Use coverage of the sample space", result: "$P(A\\cup A^c)=P(\\Omega)=1$", why: "the event or its complement contains every outcome" },
      { do: "Add probabilities of disjoint events", result: "$P(A\\cup A^c)=P(A)+P(A^c)$", why: "disjoint event probabilities add" },
      { do: "Combine the equations", result: "$P(A)+P(A^c)=1$", why: "both expressions equal the probability of the full sample space" },
      { do: "Subtract $P(A)$", result: "$P(A^c)=1-P(A)$", why: "isolate the complement probability" }
    ],
    applications: [
      { title: "Accuracy estimate", background: "Empirical accuracy is correct outcomes divided by total evaluated outcomes.", numbers: "460 correct of 500 gives $460/500=0.92$." },
      { title: "Mini-batch labels", background: "Expected positives multiply batch size by class probability.", numbers: "class rate 0.2 in batch 64 gives expected positives $64\\cdot0.2=12.8$." },
      { title: "Dropout", background: "Expected kept units multiply units by keep probability.", numbers: "keep probability 0.8 across 100 units gives expected kept units 80." },
      { title: "Hashing", background: "Two independent uniform bucket choices collide when the second matches the first.", numbers: "two independent keys into 1000 buckets collide with probability $1/1000=0.001$." },
      { title: "A/B testing", background: "A conversion-rate estimate is conversions divided by exposed users.", numbers: "52 conversions among 1000 users gives estimate 0.052." },
      { title: "Token distribution", background: "A valid discrete distribution has probabilities summing to one.", numbers: "probabilities 0.50, 0.30, 0.20 sum to 1.00, with top-token chance 0.50." }
    ]
  },
  "math-14-20": {
    connectionsProse: "<p>Posets and lattices extend relation language by studying relations that behave like order. The reader has already seen reflexive and transitive properties, and this lesson adds antisymmetry to make a partial order. Unlike a total order, a partial order allows some pairs to remain incomparable. Lattices then connect ordering to set operations, permissions, constraints, and information flow.</p>",
    motivation: "<p>A partial order allows some pairs to be comparable and others independent. Subset inclusion is the guiding example: one feature set may be contained in another, but two feature sets can also overlap without either containing the other. This is often a better model than forcing every object into a single ranked line.</p>" +
                "<p>A lattice adds meet and join operations, which summarize common lower information and combined upper information. In a subset lattice, meet is intersection because it keeps what both sets share, and join is union because it combines everything from either set. The definitions are about bounds, but in common finite examples they match practical operations on sets, permissions, or constraints.</p>",
    definition: "<p>A poset is a set with a partial order: a relation that is reflexive, antisymmetric, and transitive. A lattice is a poset where each pair has a meet $a\\wedge b$ and a join $a\\vee b$.</p>" +
                "<p><b>Assumptions that matter:</b> The order relation must be stated, some pairs may be incomparable, and in subset lattices meet is intersection while join is union.</p>",
    symbols: [
      { sym: "$\\le$", desc: "partial order" },
      { sym: "reflexive", desc: "each element is below itself" },
      { sym: "antisymmetric", desc: "two-way comparison forces equality" },
      { sym: "transitive", desc: "comparisons compose" },
      { sym: "$a\\wedge b$", desc: "meet" },
      { sym: "$a\\vee b$", desc: "join" },
      { sym: "comparable", desc: "one element is below the other" }
    ],
    applications: [
      { title: "Feature-set lattice", background: "Feature sets ordered by inclusion meet by intersection and join by union.", numbers: "$A=\\{1,2,5\\}$ and $B=\\{2,3\\}$ have meet size 1 and join size 4." },
      { title: "Permissions", background: "Joining roles combines distinct permissions.", numbers: "roles $\\{read,write\\}$ and $\\{read,delete\\}$ join to 3 distinct permissions." },
      { title: "Dataflow facts", background: "A meet keeps facts true along both paths.", numbers: "$\\{x,y\\}$ and $\\{y,z\\}$ meet to $\\{y\\}$, one definitely initialized variable." },
      { title: "Divisibility lattice", background: "Under divisibility, meet and join correspond to gcd and lcm.", numbers: "for 12 and 18, meet is 6 and join is 36." },
      { title: "Version constraints", background: "Joining allowed-version sets combines possibilities.", numbers: "$\\{1.0,1.1\\}$ joined with $\\{1.1,1.2\\}$ gives 3 allowed versions." },
      { title: "Concept hierarchy", background: "A hierarchy can replace specific labels with a shared upper concept.", numbers: "two labels sharing one parent can reduce two labels to one abstraction." }
    ]
  },
  "math-14-21": {
    connectionsProse: "<p>Modular arithmetic follows the counting and structure lessons by focusing on remainders. The reader already knows integer division informally, and this lesson turns the remainder into an equivalence relation on integers. It is essential for hash buckets, clocks, sharding, cyclic features, checksums, and many finite-state systems. The preservation laws show why ordinary addition and multiplication still work after reducing modulo a number.</p>",
    motivation: "<p>Modular arithmetic keeps remainders after division. Numbers that differ by a multiple of the modulus belong to the same residue class, so they behave the same for remainder-based purposes. This is why a clock can treat times separated by a full day as the same hour.</p>" +
                "<p>The main algebraic fact is that congruence is compatible with addition and multiplication. If two numbers have the same remainder as two other numbers, adding the first pair or multiplying the first pair gives a result with the same remainder as doing the operation on the second pair. The derivation proves this by showing the differences remain divisible by the modulus.</p>",
    definition: "<p>Modular congruence means two integers have the same remainder modulo a positive modulus: $a\\equiv b\\pmod m$. Congruence is preserved by addition and multiplication.</p>" +
                "<p><b>Assumptions that matter:</b> The modulus $m$ is positive, and congruence means the difference is divisible by $m$.</p>",
    symbols: [
      { sym: "$a\\equiv b\\pmod m$", desc: "same remainder modulo $m$" },
      { sym: "$m$", desc: "positive modulus" },
      { sym: "$q,r$", desc: "integer quotients" },
      { sym: "residue class", desc: "all integers with one remainder" }
    ],
    derivation: [
      { do: "Assume the first congruence", result: "$a\\equiv b\\pmod m$, so $a-b=qm$", why: "congruence means the difference is a multiple of $m$" },
      { do: "Assume the second congruence", result: "$c\\equiv d\\pmod m$, so $c-d=rm$", why: "the same divisibility definition applies" },
      { do: "Add the differences", result: "$(a+c)-(b+d)=(a-b)+(c-d)=(q+r)m$", why: "sums of multiples of $m$ are multiples of $m$" },
      { do: "Conclude addition preservation", result: "$a+c\\equiv b+d\\pmod m$", why: "$m$ divides the difference" },
      { do: "Rewrite for products", result: "$a=b+qm$ and $c=d+rm$", why: "this expresses each congruent number as a representative plus a multiple of $m$" },
      { do: "Multiply", result: "$ac=(b+qm)(d+rm)=bd+m(br+dq+qrm)$", why: "all extra terms contain a factor of $m$" },
      { do: "Conclude multiplication preservation", result: "$ac\\equiv bd\\pmod m$", why: "$ac-bd$ is divisible by $m$" }
    ],
    applications: [
      { title: "Hash tables", background: "A hash bucket can be selected by a remainder.", numbers: "$h(k)=k\\bmod100$ maps key 12345 to bucket 45." },
      { title: "Checksums", background: "A checksum can reduce a digit sum modulo a base.", numbers: "digits 4, 8, 2 sum to 14; modulo 10 remainder is 4." },
      { title: "Clock time", background: "Clock arithmetic identifies times separated by full cycles.", numbers: "50 hours after Monday 09:00 gives $9+50=59\\equiv11\\pmod{24}$, so Wednesday 11:00." },
      { title: "Cryptography", background: "A modular inverse multiplies to 1 modulo the modulus.", numbers: "modulo 11, $3\\cdot4=12\\equiv1$, so 4 is the inverse of 3." },
      { title: "Sharding", background: "Remainders assign ids to finite shard numbers.", numbers: "user id 987 with 16 shards goes to shard $987\\bmod16=11$." },
      { title: "Cyclic features", background: "Cyclic quantities wrap around by reducing modulo the period.", numbers: "hour 27 maps to $27\\bmod24=3$." }
    ]
  },
  "math-14-22": {
    connectionsProse: "<p>Boolean algebra returns to propositional logic with an algebraic viewpoint. The reader has already worked with truth values, connectives, and truth tables. This lesson treats those connectives as operations that can be simplified while preserving every possible assignment. It connects directly to circuits, search filters, decision rules, binary features, and program conditions.</p>",
    motivation: "<p>Boolean algebra treats true and false values as algebraic objects. Expressions can be rearranged, simplified, or rewritten as long as every truth assignment gives the same final value. This makes logical rules easier to implement and easier to check.</p>" +
                "<p>De Morgan's law is a central example because it explains how negation moves across AND and OR. Saying that not both conditions hold is equivalent to saying at least one condition fails. A truth table proves the law by checking all assignments and confirming that the final columns match exactly.</p>",
    definition: "<p>Boolean algebra studies expressions built from false/true values and logical operations. De Morgan's law states $$\\neg(x\\land y)=\\neg x\\lor\\neg y$$.</p>" +
                "<p><b>Assumptions that matter:</b> Variables take Boolean values $0$ or $1$, and equivalence means identical truth values for all assignments.</p>",
    symbols: [
      { sym: "$0,1$", desc: "false and true" },
      { sym: "$\\land$", desc: "AND" },
      { sym: "$\\lor$", desc: "OR" },
      { sym: "$\\neg$", desc: "NOT" },
      { sym: "$\\oplus$", desc: "XOR" },
      { sym: "equivalence", desc: "identical truth values in all rows" }
    ],
    derivation: [
      { do: "List truth-table rows", result: "$(0,0),(0,1),(1,0),(1,1)$", why: "two Boolean variables have four assignments" },
      { do: "Compute the AND column", result: "$x\\land y$ is $0,0,0,1$", why: "AND is true only when both inputs are true" },
      { do: "Negate the AND column", result: "$\\neg(x\\land y)$ is $1,1,1,0$", why: "NOT flips each Boolean value" },
      { do: "Compute negated inputs", result: "$\\neg x$ is $1,1,0,0$ and $\\neg y$ is $1,0,1,0$", why: "each input column is flipped" },
      { do: "OR the negated-input columns", result: "$1,1,1,0$", why: "OR is true when at least one side is true" },
      { do: "Compare final columns", result: "$\\neg(x\\land y)=\\neg x\\lor\\neg y$", why: "the columns match for all Boolean assignments" }
    ],
    applications: [
      { title: "Feature filters", background: "Boolean identities can remove tautological subexpressions.", numbers: "$age\\_ok\\land(country\\_ok\\lor\\neg country\\_ok)$ simplifies to $age\\_ok$." },
      { title: "Decision trees", background: "A contradictory path cannot cover any rows.", numbers: "a path with $p\\land\\neg p$ covers 0 rows." },
      { title: "Circuits", background: "Equivalent Boolean expressions can reduce gate count.", numbers: "$(x\\land y)\\lor(x\\land\\neg y)$ uses two ANDs and one OR before simplifying to wire $x$." },
      { title: "Search exclusions", background: "De Morgan's law pushes NOT into an OR query.", numbers: "NOT(red OR blue) rewrites to NOT red AND NOT blue." },
      { title: "Access control", background: "Simplifying Boolean rules clarifies the active condition.", numbers: "$(admin\\lor owner)\\land\\neg admin$ simplifies to $owner\\land\\neg admin$." },
      { title: "Binary indicators", background: "Multiplying by true preserves a Boolean indicator.", numbers: "$z=x\\land1$ equals $x$, so storing both adds no information." }
    ]
  },
  "math-14-23": {
    connectionsProse: "<p>This capstone gathers the section's counting habits and applies them to computational growth. The reader has counted functions, subsets, pairs, grids, strings, and recurrence growth. Big-O keeps the same concern with size but focuses on how work scales as the input grows. This is especially important in ML systems, where examples, features, tokens, pairs, and states can all become large.</p>",
    motivation: "<p>Big-O uses counting to describe how work grows with input size. It does not try to preserve every small constant or lower-order term. Instead, it gives an eventual upper bound that captures the dominant growth pattern once the input is large enough.</p>" +
                "<p>For ML systems, counting examples, features, pairs, tokens, subsets, or states often decides whether a method can scale. A linear pass over examples may be practical, while all pairs or all subsets can become too large quickly. The derivation shows how a polynomial with several terms can be bounded by a constant multiple of its dominant term after a chosen threshold.</p>",
    definition: "<p>Big-O gives an eventual upper bound on growth. For example, $$3n^2+10n+5=O(n^2)$$.</p>" +
                "<p><b>Assumptions that matter:</b> Big-O requires constants $C>0$ and $n_0$ such that the bound holds for all $n\\ge n_0$.</p>",
    symbols: [
      { sym: "$f(n)$", desc: "cost function" },
      { sym: "$g(n)$", desc: "comparison growth" },
      { sym: "$C$", desc: "constant multiplier" },
      { sym: "$n_0$", desc: "threshold" },
      { sym: "$O(g(n))$", desc: "eventual upper bound" },
      { sym: "$n,d,L$", desc: "may measure examples, features, or tokens" }
    ],
    derivation: [
      { do: "Start with the definition", result: "need $C>0$ and $n_0$ such that $0\\le3n^2+10n+5\\le Cn^2$ for $n\\ge n_0$", why: "Big-O is an eventual upper bound" },
      { do: "Choose a threshold", result: "$n_0=1$", why: "then $n\\le n^2$ and $1\\le n^2$" },
      { do: "Bound the linear term", result: "$10n\\le10n^2$ for $n\\ge1$", why: "$n\\le n^2$ after the threshold" },
      { do: "Bound the constant term", result: "$5\\le5n^2$ for $n\\ge1$", why: "$1\\le n^2$ after the threshold" },
      { do: "Add the bounds", result: "$3n^2+10n+5\\le3n^2+10n^2+5n^2=18n^2$", why: "each term is bounded by a multiple of $n^2$" },
      { do: "Choose the constant", result: "$C=18$", why: "this proves $3n^2+10n+5=O(n^2)$" }
    ],
    applications: [
      { title: "Linear inference", background: "A dense pass over examples and features scales with their product.", numbers: "1,000,000 examples and 100 features use $100,000,000$ multiply-adds, or $O(nd)$." },
      { title: "Retrieval evaluation", background: "Scoring every query-document pair is a product count.", numbers: "10,000 queries against 50,000 documents gives $5\\times10^8$ scores." },
      { title: "Transformer attention", background: "All token pairs with feature dimension create quadratic sequence growth.", numbers: "$L=4096$, $d=128$ gives $4096^2\\cdot128=2,147,483,648$ score multiply-adds, or $O(L^2d)$." },
      { title: "Grid search", background: "Independent hyperparameter choices multiply into candidate runs.", numbers: "5 learning rates, 4 batch sizes, 6 depths give 120 runs." },
      { title: "Feature subset explosion", background: "Every feature can be included or excluded.", numbers: "30 features give $2^{30}=1,073,741,824$ subsets." },
      { title: "Epoch cost", background: "Total epoch work multiplies examples by per-example operations.", numbers: "200,000 examples at 20,000 operations each cost $4\\times10^9$ operations." }
    ]
  }
};
