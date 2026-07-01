module.exports = {
  "math-16-11": {
    id: "math-16-11",
    title: "Relations and orderings",
    tagline: "A relation says which pairs are allowed; an ordering says how objects can be compared without losing structure.",
    connections: {
      buildsOn: ["sets", "ordered pairs", "logical predicates"],
      leadsTo: ["Cardinality", "Ordinals", "The axiom of choice"],
      usedWith: ["equivalence relations", "partial orders", "graphs", "lattices"]
    },
    motivation:
      "<p>You already compare things every day: $3<7$, one folder sits inside another, and two strings may have the same length. Each comparison selects some ordered pairs and rejects others.</p>" +
      "<p>A <b>relation</b> lets us study that selection directly. When the relation is reflexive, antisymmetric, and transitive, it becomes a <b>partial order</b>: a disciplined way to say some objects are below others, even when not every pair is comparable.</p>",
    definition:
      "<p>A <b>binary relation</b> $R$ from a set $A$ to a set $B$ is a subset $R\\subseteq A\\times B$. We write $aRb$ when $(a,b)\\in R$. A relation on $A$ is a subset of $A\\times A$.</p>" +
      "<p>A relation $\\preceq$ on $A$ is a <b>partial order</b> when it is reflexive, meaning $a\\preceq a$ for every $a\\in A$; antisymmetric, meaning $a\\preceq b$ and $b\\preceq a$ force $a=b$; and transitive, meaning $a\\preceq b$ and $b\\preceq c$ force $a\\preceq c$. The transitive rule is derived by chaining allowed comparisons: if the first comparison puts $a$ no later than $b$ and the second puts $b$ no later than $c$, then the same ordering path puts $a$ no later than $c$.</p>" +
      "<p><b>Assumptions that matter:</b> the underlying set must be fixed; ordered pairs keep direction; a total order adds comparability for every pair; and equality is the only allowed two-way comparison in a partial order.</p>",
    worked: {
      problem: "On $A=\\{1,2,3,6\\}$, let $a\\preceq b$ mean $a$ divides $b$. Decide whether $\\preceq$ is a partial order and list the comparable pairs with unequal entries.",
      skills: ["relations", "divisibility", "partial orders"],
      strategy: "Divisibility is directional — check the three order properties, then list only pairs where the first divides the second.",
      steps: [
        { do: "Check reflexivity", result: "$a\\mid a$ for each $a\\in A$", why: "every integer divides itself" },
        { do: "Check antisymmetry", result: "$a\\mid b$ and $b\\mid a$ imply $a=b$ in $A$", why: "positive integers cannot strictly divide each other both ways" },
        { do: "Check transitivity", result: "$a\\mid b$ and $b\\mid c$ imply $a\\mid c$", why: "multiplication factors chain" },
        { do: "List pairs from $1$", result: "$(1,2),(1,3),(1,6)$", why: "1 divides every element" },
        { do: "List pairs from $2$", result: "$(2,6)$", why: "2 divides 6 but not 3" },
        { do: "List pairs from $3$", result: "$(3,6)$", why: "3 divides 6 but not 2" }
      ],
      verify: "The elements $2$ and $3$ are not comparable, so this is not a total order; partial orders allow that.",
      answer: "Divisibility on $A$ is a partial order. The unequal comparable pairs are $(1,2),(1,3),(1,6),(2,6),(3,6)$.",
      connects: "A partial order keeps enough comparison to reason by chains without requiring every pair to be ranked."
    },
    practice: [
      { problem: "Let $R$ on $\\{1,2,3\\}$ be $\\{(1,1),(2,2),(3,3),(1,2),(2,3),(1,3)\\}$. Check whether $R$ is a partial order.", steps: [
        { do: "Check reflexive pairs", result: "$(1,1),(2,2),(3,3)$ are present", why: "each element relates to itself" },
        { do: "Look for two-way unequal pairs", result: "none", why: "$(2,1),(3,2),(3,1)$ are absent" },
        { do: "Check the main chain", result: "$(1,2)$ and $(2,3)$ give $(1,3)$", why: "transitivity requires the shortcut" },
        { do: "Check remaining chains", result: "only identity chains remain", why: "identity pairs do not create new unequal requirements" },
        { do: "Conclude", result: "partial order", why: "reflexive, antisymmetric, and transitive all hold" }
      ], answer: "$R$ is a partial order." },
      { problem: "On $\\{a,b,c\\}$, the relation has only $(a,a),(b,b),(c,c),(a,b),(b,a)$. Which partial-order property fails?", steps: [
        { do: "Check reflexivity", result: "all three diagonal pairs are present", why: "each element relates to itself" },
        { do: "Find a two-way unequal relation", result: "$aRb$ and $bRa$", why: "both directed pairs appear" },
        { do: "Compare the elements", result: "$a\\ne b$", why: "they are different symbols" },
        { do: "Apply antisymmetry", result: "antisymmetry fails", why: "two-way related unequal elements are not allowed" },
        { do: "Name the outcome", result: "not a partial order", why: "one required property fails" }
      ], answer: "Antisymmetry fails, so the relation is not a partial order." },
      { problem: "Let $\\subseteq$ order the set $\\{\\emptyset,\\{1\\},\\{2\\},\\{1,2\\}\\}$. List all unequal comparable pairs.", steps: [
        { do: "Start with $\\emptyset$", result: "$\\emptyset\\subseteq\\{1\\}$, $\\emptyset\\subseteq\\{2\\}$, $\\emptyset\\subseteq\\{1,2\\}$", why: "the empty set is contained in every set" },
        { do: "Compare $\\{1\\}$ upward", result: "$\\{1\\}\\subseteq\\{1,2\\}$", why: "every element of $\\{1\\}$ lies in $\\{1,2\\}$" },
        { do: "Compare $\\{2\\}$ upward", result: "$\\{2\\}\\subseteq\\{1,2\\}$", why: "every element of $\\{2\\}$ lies in $\\{1,2\\}$" },
        { do: "Compare singletons", result: "$\\{1\\}$ and $\\{2\\}$ are incomparable", why: "neither contains the other's element" },
        { do: "Count unequal comparable pairs", result: "$5$", why: "three from $\\emptyset$ and two singleton-to-top pairs" }
      ], answer: "The unequal comparable pairs are $(\\emptyset,\\{1\\})$, $(\\emptyset,\\{2\\})$, $(\\emptyset,\\{1,2\\})$, $(\\{1\\},\\{1,2\\})$, and $(\\{2\\},\\{1,2\\})$." },
      { problem: "For tasks $A,B,C,D$, dependencies are $A\\preceq C$, $B\\preceq C$, and $C\\preceq D$, plus reflexive pairs. Add the missing transitive dependency.", steps: [
        { do: "Read the first chain", result: "$A\\preceq C\\preceq D$", why: "A must happen before C and C before D" },
        { do: "Apply transitivity to the first chain", result: "$A\\preceq D$", why: "dependencies chain forward" },
        { do: "Read the second chain", result: "$B\\preceq C\\preceq D$", why: "B also feeds C" },
        { do: "Apply transitivity to the second chain", result: "$B\\preceq D$", why: "D depends indirectly on B" },
        { do: "List new unequal dependencies", result: "$A\\preceq D$ and $B\\preceq D$", why: "both are forced by transitivity" }
      ], answer: "The missing transitive dependencies are $A\\preceq D$ and $B\\preceq D$." },
      { problem: "A model registry orders versions by inclusion of supported features. Version $v_1$ has $\\{x\\}$, $v_2$ has $\\{x,y\\}$, and $v_3$ has $\\{y\\}$. Which versions are incomparable?", steps: [
        { do: "Compare $v_1$ and $v_2$", result: "$\\{x\\}\\subseteq\\{x,y\\}$", why: "$v_2$ contains all features of $v_1$" },
        { do: "Compare $v_3$ and $v_2$", result: "$\\{y\\}\\subseteq\\{x,y\\}$", why: "$v_2$ contains all features of $v_3$" },
        { do: "Compare $v_1$ to $v_3$", result: "$\\{x\\}\\nsubseteq\\{y\\}$", why: "feature $x$ is missing from $v_3$" },
        { do: "Compare $v_3$ to $v_1$", result: "$\\{y\\}\\nsubseteq\\{x\\}$", why: "feature $y$ is missing from $v_1$" },
        { do: "State incomparability", result: "$v_1$ and $v_3$", why: "neither feature set contains the other" }
      ], answer: "$v_1$ and $v_3$ are incomparable; both are below $v_2$." }
    ],
    applications: [
      { title: "Dependency graphs", background: "Build systems and course plans use partial orders because some items must precede others while unrelated items can be done in either order.", numbers: "If $A\\preceq C$ and $C\\preceq D$, transitivity forces $A\\preceq D$. With tasks $A,B,C,D$ and edges $A\\to C$, $B\\to C$, $C\\to D$, two valid starts are $A$ and $B$." },
      { title: "Subset ordering for feature sets", background: "Feature engineering often compares models by which features they use. Inclusion is a natural partial order, not a total ranking.", numbers: "$\\{age\\}\\subseteq\\{age,clicks\\}$, but $\\{age\\}$ and $\\{clicks\\}$ are incomparable because each misses the other's feature." },
      { title: "Database relations", background: "Relational databases took their name from mathematical relations: a table is a finite set of tuples satisfying a schema.", numbers: "A two-column relation with rows $(101,0.8)$ and $(102,0.4)$ has size $2$ and is a subset of $Users\\times Scores$." },
      { title: "Ranking with ties", background: "Search and recommendation systems sometimes need preorders or partial orders when exact total ranking is unjustified.", numbers: "If item A score is $0.91$, B is $0.91$, and C is $0.85$, A and B tie while both outrank C; the strict comparison count against C is $2$." },
      { title: "Program states ordered by information", background: "Static analysis orders program facts by precision. More facts mean a state is higher in an information order.", numbers: "$\\{x>0\\}\\subseteq\\{x>0,y=2\\}$, so the second abstract state carries one additional fact." },
      { title: "Lattices in optimization constraints", background: "Many constraint systems combine information with meet and join operations. Partial orders give the scaffold.", numbers: "For sets $A=\\{1,2\\}$ and $B=\\{2,3\\}$, meet under inclusion is $A\\cap B=\\{2\\}$ and join is $A\\cup B=\\{1,2,3\\}$." }
    ],
    applicationsClose: "Relations are the quiet grammar behind tables, dependencies, feature sets, and ordered information.",
    takeaways: [
      "A binary relation is a subset of a Cartesian product.",
      "A partial order is reflexive, antisymmetric, and transitive.",
      "Partial orders allow incomparable elements; total orders do not.",
      "Dependency, subset, and information orderings all use the same relational idea."
    ]
  },

  "math-16-12": {
    id: "math-16-12",
    title: "Cardinality",
    tagline: "Cardinality counts size by pairing, so two sets can be equally large even when their elements look different.",
    connections: {
      buildsOn: ["sets", "functions", "Relations and orderings"],
      leadsTo: ["Infinite sets", "The axiom of choice", "Ordinals"],
      usedWith: ["bijections", "injections", "surjections", "equivalence relations"]
    },
    motivation:
      "<p>You can count a small set by saying $1,2,3$. But a deeper idea is hiding there: counting pairs each object with exactly one counting number.</p>" +
      "<p><b>Cardinality</b> makes that pairing idea official. Two sets have the same size when there is a bijection between them. This is the right language for finite data columns and, soon, for surprising infinite comparisons.</p>",
    definition:
      "<p>The <b>cardinality</b> of a finite set $A$, written $|A|$, is the number of elements in $A$. For arbitrary sets, $A$ and $B$ have the same cardinality, written $|A|=|B|$, when there exists a bijection $f:A\\to B$.</p>" +
      "<p>A function is a bijection when it is one-to-one and onto. The finite product rule follows by pairing choices: if $|A|=m$ and $|B|=n$, then each of the $m$ choices for the first coordinate can be paired with $n$ choices for the second coordinate, giving $|A\\times B|=mn$.</p>" +
      "<p><b>Assumptions that matter:</b> sets do not count duplicates; bijections must cover every target exactly once; $|A\\cup B|=|A|+|B|$ only when $A$ and $B$ are disjoint; and cardinality compares size, not numerical value or meaning of elements.</p>",
    worked: {
      problem: "Let $A=\\{red,blue,green\\}$ and $B=\\{10,20,30,40\\}$. Find $|A|$, $|B|$, $|A\\times B|$, and $|A\\cup B|$ assuming the sets are disjoint.",
      skills: ["finite cardinality", "Cartesian products", "disjoint unions"],
      strategy: "Count each set first, then use the product and disjoint-union rules.",
      steps: [
        { do: "Count elements of $A$", result: "$|A|=3$", why: "there are three color names" },
        { do: "Count elements of $B$", result: "$|B|=4$", why: "there are four numbers" },
        { do: "Apply the product rule", result: "$|A\\times B|=3\\cdot4$", why: "each element of $A$ pairs with each element of $B$" },
        { do: "Multiply", result: "$|A\\times B|=12$", why: "three groups of four pairs" },
        { do: "Apply the disjoint-union rule", result: "$|A\\cup B|=3+4$", why: "no element is counted twice" },
        { do: "Add", result: "$|A\\cup B|=7$", why: "combine the disjoint counts" }
      ],
      verify: "Listing the pairs gives red with four numbers, blue with four numbers, and green with four numbers, for $12$ total.",
      answer: "$|A|=3$, $|B|=4$, $|A\\times B|=12$, and $|A\\cup B|=7$.",
      connects: "Finite cardinality is ordinary counting, organized so bijections and products stay visible."
    },
    practice: [
      { problem: "If $S=\\{1,1,2,3,3,3\\}$ is interpreted as a set, find $|S|$.", steps: [
        { do: "Remove repeated entries", result: "$S=\\{1,2,3\\}$", why: "sets do not count duplicates" },
        { do: "List the distinct elements", result: "$1,2,3$", why: "cardinality counts distinct members" },
        { do: "Count the list", result: "$3$", why: "there are three distinct entries" },
        { do: "Write cardinality notation", result: "$|S|=3$", why: "absolute bars denote set size here" },
        { do: "Check against the original display", result: "six written items but three set elements", why: "multiplicity is ignored" }
      ], answer: "$|S|=3$." },
      { problem: "Let $A=\\{0,1\\}$ and $B=\\{a,b,c\\}$. Compute $|A\\times B|$ and list the pairs.", steps: [
        { do: "Count $A$", result: "$|A|=2$", why: "two binary values" },
        { do: "Count $B$", result: "$|B|=3$", why: "three letters" },
        { do: "Multiply counts", result: "$2\\cdot3=6$", why: "Cartesian products choose one from each set" },
        { do: "List pairs with first coordinate $0$", result: "$(0,a),(0,b),(0,c)$", why: "pair 0 with every element of $B$" },
        { do: "List pairs with first coordinate $1$", result: "$(1,a),(1,b),(1,c)$", why: "pair 1 with every element of $B$" }
      ], answer: "$|A\\times B|=6$ with pairs $(0,a),(0,b),(0,c),(1,a),(1,b),(1,c)$." },
      { problem: "Sets $A$ and $B$ have $|A|=8$, $|B|=5$, and $|A\\cap B|=2$. Find $|A\\cup B|$.", steps: [
        { do: "Start with inclusion-exclusion", result: "$|A\\cup B|=|A|+|B|-|A\\cap B|$", why: "the overlap is counted twice in the sum" },
        { do: "Substitute counts", result: "$8+5-2$", why: "use the given cardinalities" },
        { do: "Add the first two counts", result: "$13-2$", why: "$8+5=13$" },
        { do: "Subtract the overlap", result: "$11$", why: "remove the duplicate counting" },
        { do: "Check bounds", result: "$11$ is between $8$ and $13$", why: "a union is at least as large as each set and at most the sum" }
      ], answer: "$|A\\cup B|=11$." },
      { problem: "How many binary strings of length $4$ are there?", steps: [
        { do: "Count choices for position 1", result: "$2$", why: "each bit is 0 or 1" },
        { do: "Count choices for position 2", result: "$2$", why: "the second bit is independent" },
        { do: "Count choices for position 3", result: "$2$", why: "same two choices" },
        { do: "Count choices for position 4", result: "$2$", why: "same two choices" },
        { do: "Multiply choices", result: "$2^4=16$", why: "independent positions use the product rule" }
      ], answer: "There are $16$ binary strings of length $4$." },
      { problem: "A classifier has $3$ labels and each label can be assigned one of $4$ confidence bins. How many label-bin pairs exist, and how many probability vectors over labels have exactly one chosen label?", steps: [
        { do: "Count labels", result: "$3$", why: "there are three classes" },
        { do: "Count bins", result: "$4$", why: "each label can use four bins" },
        { do: "Compute label-bin pairs", result: "$3\\cdot4=12$", why: "choose one label and one bin" },
        { do: "Count one-hot label choices", result: "$3$", why: "a one-hot vector chooses exactly one label" },
        { do: "Connect the two counts", result: "$12$ pairs and $3$ one-hot choices", why: "binning adds an independent choice" }
      ], answer: "There are $12$ label-bin pairs and $3$ one-hot label choices." }
    ],
    applications: [
      { title: "Dataset size", background: "Every ML project begins by knowing what is in the dataset. Cardinality distinguishes rows, labels, users, and examples.", numbers: "If a training set has $12000$ rows and a validation set has $3000$ disjoint rows, the union has $15000$ rows." },
      { title: "Vocabulary size", background: "Language models map tokens to integer ids. The number of distinct tokens is a cardinality.", numbers: "A tokenizer with ids $0$ through $49999$ has vocabulary size $50000$. An embedding table with dimension $768$ has $50000\\cdot768=38400000$ weights." },
      { title: "One-hot encodings", background: "Classification targets often use one-hot vectors, where each class gets one coordinate.", numbers: "For $7$ classes, there are $7$ valid one-hot vectors of length $7$, not $2^7$, because exactly one coordinate is $1$." },
      { title: "Feature crosses", background: "Recommendation systems often cross categorical features. Cardinality tells you how many possible crossed features exist.", numbers: "Crossing $100$ countries with $20$ device types gives $100\\cdot20=2000$ possible pairs." },
      { title: "Hash buckets", background: "Hashing compresses a large set of keys into a fixed set of buckets, trading cardinality for collisions.", numbers: "Mapping $10000$ keys into $1000$ buckets gives average load $10000/1000=10$ keys per bucket." },
      { title: "Train-test overlap checks", background: "Data leakage often appears as overlap between sets. Inclusion-exclusion makes the count explicit.", numbers: "If train has $8000$ users, test has $2500$, and overlap is $300$, the distinct users across both are $8000+2500-300=10200$." }
    ],
    applicationsClose: "Cardinality is counting with structure: it tells you what is distinct, what is paired, and what has been counted twice.",
    takeaways: [
      "Two sets have the same cardinality when a bijection pairs them exactly.",
      "For finite sets, Cartesian products multiply cardinalities.",
      "Unions add only when sets are disjoint; otherwise subtract the overlap.",
      "Dataset sizes, vocabularies, feature crosses, and leakage checks are cardinality questions."
    ]
  },

  "math-16-13": {
    id: "math-16-13",
    title: "Infinite sets",
    tagline: "Infinite sets can be counted by patterns, and some infinities are larger than others.",
    connections: {
      buildsOn: ["Cardinality", "bijections", "sets of numbers"],
      leadsTo: ["Ordinals", "The axiom of choice", "Gödel's incompleteness theorems"],
      usedWith: ["sequences", "diagonal arguments", "power sets", "countability"]
    },
    motivation:
      "<p>You already know the counting numbers never end. The first surprise is that the even numbers also never end and, in a precise sense, there are just as many evens as counting numbers.</p>" +
      "<p>The second surprise is deeper: the real numbers cannot be listed in a sequence at all. Infinite sets teach us to compare size by bijections and to respect the difference between countable and uncountable worlds.</p>",
    definition:
      "<p>A set is <b>countably infinite</b> if its elements can be listed as $a_1,a_2,a_3,\\ldots$, equivalently if it has the same cardinality as $\\mathbb{N}$. The cardinality of $\\mathbb{N}$ is written $\\aleph_0$. A set is <b>uncountable</b> if no such listing exists.</p>" +
      "<p>Cantor's diagonal idea shows that $(0,1)$ is uncountable. If someone listed decimals $r_1,r_2,r_3,\\ldots$, we could build a new decimal by changing the $n$th digit of $r_n$. The new number differs from row $n$ in digit $n$, so it is missing from the list. Therefore no list was complete.</p>" +
      "<p><b>Assumptions that matter:</b> countable means finite or countably infinite depending on context, but here we name countably infinite when needed; decimal expansions should avoid ambiguous tails like $0.4999\\ldots=0.5000\\ldots$; and a bijection, not intuition about sparseness, decides equal infinite size.</p>",
    worked: {
      problem: "Show that the positive even integers $E=\\{2,4,6,\\ldots\\}$ are countably infinite by giving a bijection from $\\mathbb{N}=\\{1,2,3,\\ldots\\}$.",
      skills: ["bijections", "countability", "infinite sets"],
      strategy: "Pair the $n$th counting number with the $n$th even number and prove no misses or duplicates.",
      steps: [
        { do: "Define the function", result: "$f(n)=2n$", why: "multiplying by 2 sends counting numbers to positive evens" },
        { do: "Check the target", result: "$f(n)\\in E$", why: "$2n$ is a positive even integer" },
        { do: "Check one-to-one", result: "$2m=2n$ implies $m=n$", why: "divide both sides by 2" },
        { do: "Check onto", result: "for $e\\in E$, $e=2n$ for some $n\\in\\mathbb{N}$", why: "every positive even number has half in $\\mathbb{N}$" },
        { do: "Name the conclusion", result: "$|E|=|\\mathbb{N}|=\\aleph_0$", why: "a bijection gives equal cardinality" }
      ],
      verify: "The first few pairs are $1\\mapsto2$, $2\\mapsto4$, $3\\mapsto6$, so every even appears exactly once.",
      answer: "$f(n)=2n$ is a bijection, so the positive even integers are countably infinite.",
      connects: "Infinite size is measured by pairing, not by whether one set looks like a sparse subset."
    },
    practice: [
      { problem: "Show that the integers $\\mathbb{Z}$ are countably infinite by listing them in a sequence.", steps: [
        { do: "Start the list", result: "$0,1,-1,2,-2,3,-3,\\ldots$", why: "alternate positive and negative values" },
        { do: "Check every nonnegative integer", result: "$k$ appears after $-(k-1)$ for $k\\ge1$", why: "the positives are listed in increasing order" },
        { do: "Check every negative integer", result: "$-k$ appears after $k$", why: "each negative is paired with its positive magnitude" },
        { do: "Check no duplicates", result: "each integer appears once", why: "each magnitude and sign has one position" },
        { do: "Conclude countability", result: "$\\mathbb{Z}$ is countably infinite", why: "the list is indexed by $\\mathbb{N}$" }
      ], answer: "$\\mathbb{Z}$ is countably infinite, for example by the list $0,1,-1,2,-2,\\ldots$." },
      { problem: "Use a grid idea to explain why $\\mathbb{N}\\times\\mathbb{N}$ is countably infinite.", steps: [
        { do: "Arrange pairs by sum", result: "group $(a,b)$ by $a+b$", why: "each diagonal has finitely many pairs" },
        { do: "List sum $2$", result: "$(1,1)$", why: "smallest positive pair" },
        { do: "List sum $3$", result: "$(1,2),(2,1)$", why: "two pairs have sum 3" },
        { do: "List sum $4$", result: "$(1,3),(2,2),(3,1)$", why: "move along the next diagonal" },
        { do: "Continue diagonally", result: "every pair eventually appears", why: "a pair with sum $s$ appears on diagonal $s$" }
      ], answer: "$\\mathbb{N}\\times\\mathbb{N}$ is countably infinite by diagonal listing." },
      { problem: "Show that the finite binary strings are countable.", steps: [
        { do: "Group strings by length", result: "length $0,1,2,3,\\ldots$", why: "each string has one finite length" },
        { do: "Count length $n$ strings", result: "$2^n$", why: "each of $n$ positions has two choices" },
        { do: "List length $0$", result: "the empty string", why: "start with the only string of length zero" },
        { do: "List each later length lexicographically", result: "a finite block for every $n$", why: "finite blocks can be placed one after another" },
        { do: "Conclude", result: "countable", why: "a countable union of finite blocks indexed by $\\mathbb{N}$ is countable" }
      ], answer: "The set of finite binary strings is countable." },
      { problem: "If $A$ is countably infinite, explain why $A\\cup\\{x\\}$ is countably infinite when $x\\notin A$.", steps: [
        { do: "List $A$", result: "$a_1,a_2,a_3,\\ldots$", why: "$A$ is countably infinite" },
        { do: "Place the new element first", result: "$x,a_1,a_2,a_3,\\ldots$", why: "we need to include $x$ exactly once" },
        { do: "Check all old elements", result: "$a_n$ appears in position $n+1$", why: "the old list is shifted" },
        { do: "Check the new element", result: "$x$ appears in position $1$", why: "it was inserted at the front" },
        { do: "Conclude", result: "$A\\cup\\{x\\}$ is countably infinite", why: "the new set has a complete sequence listing" }
      ], answer: "$A\\cup\\{x\\}$ is countably infinite." },
      { problem: "A program enumerates all finite Python source strings. Explain why this does not enumerate all functions $\\mathbb{N}\\to\\{0,1\\}$.", steps: [
        { do: "Classify source strings", result: "finite strings are countable", why: "they can be listed by length" },
        { do: "Classify binary-valued functions", result: "functions $\\mathbb{N}\\to\\{0,1\\}$ correspond to infinite binary sequences", why: "each input gets a bit" },
        { do: "Apply diagonal reasoning", result: "infinite binary sequences are uncountable", why: "change the $n$th bit of the $n$th sequence" },
        { do: "Compare sizes", result: "countable source strings cannot cover uncountable functions", why: "no surjection exists from a countable set onto an uncountable set" },
        { do: "Interpret", result: "some functions are not programmable", why: "there are more functions than finite programs" }
      ], answer: "All finite programs are countable, but all binary functions on $\\mathbb{N}$ are uncountable, so not every such function is computable." }
    ],
    applications: [
      { title: "Countable programs", background: "Computability theory begins with the fact that programs are finite strings over a finite alphabet.", numbers: "With $80$ possible characters, there are $80^5=3276800000$ strings of length $5$, finite for each length; listing by length makes all programs countable." },
      { title: "Uncomputable functions", background: "There are more functions than programs. This is the size reason behind many limits of computation.", numbers: "Binary functions on $\\mathbb{N}$ have cardinality $2^{\\aleph_0}$, while finite programs have cardinality $\\aleph_0$; the latter cannot cover the former." },
      { title: "Rational grids in optimization", background: "Algorithms often search rational parameter grids because rationals are countable and can be enumerated.", numbers: "Pairs $(p,q)$ with $q\\ne0$ can be listed by increasing $|p|+|q|$; for bound $|p|,|q|\\le10$, there are $21\\cdot20=420$ signed pairs before reducing fractions." },
      { title: "Dense countable sets", background: "A countable set can still sit everywhere in an interval. Rationals are dense even though they are countable.", numbers: "Between $0.31$ and $0.32$, the rational $315/1000=0.315$ appears; every small interval contains infinitely many rationals." },
      { title: "Real-valued features", background: "Continuous features are often modeled as real numbers, an uncountable space. Computers store approximations, not all reals.", numbers: "A 32-bit float has at most $2^{32}\\approx4.29$ billion bit patterns, finite, while real numbers in $[0,1]$ are uncountable." },
      { title: "Search spaces", background: "Countability tells us whether exhaustive enumeration is even conceptually possible.", numbers: "All finite binary strings can be enumerated; all infinite binary sequences cannot. The first has size $\\aleph_0$, the second has size $2^{\\aleph_0}$." }
    ],
    applicationsClose: "Infinite sets ask you to count by listing and diagonalizing, revealing which worlds can be enumerated and which cannot.",
    takeaways: [
      "A countably infinite set can be put in a sequence indexed by $\\mathbb{N}$.",
      "$\\mathbb{N}$, the evens, the integers, and finite strings are countably infinite.",
      "Cantor's diagonal argument shows some sets, such as real numbers in an interval, are uncountable.",
      "There are countably many programs but uncountably many functions from $\\mathbb{N}$ to $\\{0,1\\}$."
    ]
  },

  "math-16-14": {
    id: "math-16-14",
    title: "Ordinals",
    tagline: "Ordinals count positions in well-ordered processes, including what comes after all finite stages.",
    connections: {
      buildsOn: ["Relations and orderings", "Infinite sets", "induction"],
      leadsTo: ["The axiom of choice", "Gödel's incompleteness theorems", "well-founded recursion"],
      usedWith: ["well-orders", "transfinite induction", "successor operations", "order types"]
    },
    motivation:
      "<p>Counting size is not the same as counting position. The sets $\\mathbb{N}$ and the even numbers have the same cardinality, but a process with stages $0,1,2,\\ldots$ also has a meaningful next stage after all finite stages.</p>" +
      "<p><b>Ordinals</b> name order types of well-ordered sets. They let mathematics speak carefully about first, next, limit stage, and induction beyond the finite.</p>",
    definition:
      "<p>A <b>well-order</b> is a total order in which every nonempty subset has a least element. An <b>ordinal</b> represents the order type of a well-ordered set. Finite ordinals are $0,1,2,\\ldots$; the first infinite ordinal is $\\omega$, the order type of $0<1<2<\\cdots$.</p>" +
      "<p>Each successor ordinal $\\alpha+1$ adds one new last position after all positions in $\\alpha$. A limit ordinal, such as $\\omega$, is not obtained by adding one element to an immediate predecessor. Transfinite induction works because every nonempty set of counterexamples would have a least counterexample; proving the property from all earlier stages rules that out.</p>" +
      "<p><b>Assumptions that matter:</b> ordinal addition tracks order and is not generally commutative; $\\omega+1$ means all natural-number positions followed by one last point; and ordinals compare order type, not just cardinality.</p>",
    worked: {
      problem: "Compare the order types $1+\\omega$ and $\\omega+1$ using simple ordered lists.",
      skills: ["ordinal addition", "well-orders", "order type"],
      strategy: "Ordinal addition means place one ordered block after another — write the blocks and look for a last element.",
      steps: [
        { do: "Write $1+\\omega$ as blocks", result: "one point followed by $0,1,2,\\ldots$", why: "the $\\omega$ block comes after the single point" },
        { do: "Relabel the first few positions", result: "$\\star,0,1,2,\\ldots$ behaves like $0,1,2,3,\\ldots$", why: "there is still no last element and every tail is finite-shifted" },
        { do: "Identify the order type", result: "$1+\\omega=\\omega$", why: "a single extra first point can be absorbed into an infinite sequence" },
        { do: "Write $\\omega+1$ as blocks", result: "$0,1,2,\\ldots,\\star$", why: "the single point comes after all natural positions" },
        { do: "Look for a last element", result: "$\\star$ is last", why: "every natural position comes before it" },
        { do: "Compare", result: "$\\omega+1\\ne\\omega$", why: "$\\omega$ has no last element but $\\omega+1$ does" }
      ],
      verify: "The two orders have the same cardinality $\\aleph_0$, but one has a final element and the other does not.",
      answer: "$1+\\omega=\\omega$, while $\\omega+1$ is different from $\\omega$.",
      connects: "Ordinals preserve order structure, so infinite arithmetic can differ from cardinal arithmetic."
    },
    practice: [
      { problem: "Explain why $\\omega$ has no largest element.", steps: [
        { do: "Take an arbitrary element", result: "$n\\in\\mathbb{N}$", why: "elements of $\\omega$ are finite positions" },
        { do: "Construct a later element", result: "$n+1$", why: "successor exists for every natural number" },
        { do: "Compare", result: "$n<n+1$", why: "ordinary natural order" },
        { do: "Reject maximality", result: "$n$ is not largest", why: "a larger element was found" },
        { do: "Generalize", result: "$\\omega$ has no largest element", why: "$n$ was arbitrary" }
      ], answer: "$\\omega$ has no largest element." },
      { problem: "Does $\\omega+1$ have a largest element?", steps: [
        { do: "Write the order", result: "$0,1,2,\\ldots,\\star$", why: "$\\omega+1$ appends one point after all naturals" },
        { do: "Compare natural positions to $\\star$", result: "$n<\\star$ for every $n\\in\\omega$", why: "the appended block comes last" },
        { do: "Compare $\\star$ to itself", result: "$\\star\\le\\star$", why: "orders are reflexive" },
        { do: "Identify the largest element", result: "$\\star$", why: "no element is above it" },
        { do: "Conclude", result: "$\\omega+1$ has a largest element", why: "the appended point is final" }
      ], answer: "Yes. The new appended point is the largest element." },
      { problem: "Show why $2+\\omega=\\omega$ by relabeling.", steps: [
        { do: "Write the order", result: "$a,b,0,1,2,\\ldots$", why: "two points followed by an infinite sequence" },
        { do: "Relabel $a$", result: "$a\\mapsto0$", why: "send the first position to the first natural" },
        { do: "Relabel $b$", result: "$b\\mapsto1$", why: "send the second position to the second natural" },
        { do: "Relabel old $k$", result: "$k\\mapsto k+2$", why: "shift the infinite tail forward" },
        { do: "Check order preservation", result: "$a<b<0<1<\\cdots$ maps to $0<1<2<3<\\cdots$", why: "all comparisons keep direction" }
      ], answer: "$2+\\omega$ has order type $\\omega$." },
      { problem: "Why is $\\omega+2$ not equal to $\\omega+1$ as an order type?", steps: [
        { do: "Write $\\omega+1$", result: "$0,1,2,\\ldots,a$", why: "one appended point" },
        { do: "Write $\\omega+2$", result: "$0,1,2,\\ldots,a,b$", why: "two appended points" },
        { do: "Find final segment of $\\omega+1$", result: "one point after the infinite part", why: "only $a$ comes after all naturals" },
        { do: "Find final segment of $\\omega+2$", result: "two ordered points after the infinite part", why: "$a<b$ both come after all naturals" },
        { do: "Compare final segments", result: "different order types", why: "one last block has size 1 and the other has size 2" }
      ], answer: "$\\omega+2\\ne\\omega+1$ because their finite tails after the infinite part differ." },
      { problem: "A training procedure runs epochs $0,1,2,\\ldots$ and then performs one final averaging step. What ordinal describes the order of stages?", steps: [
        { do: "Identify ordinary epochs", result: "$0,1,2,\\ldots$", why: "these have order type $\\omega$" },
        { do: "Identify final averaging", result: "one stage after all epochs", why: "it happens after every finite epoch" },
        { do: "Append the final stage", result: "$\\omega+1$", why: "ordinal addition places the extra step at the end" },
        { do: "Check it is not $1+\\omega$", result: "the extra step is last, not first", why: "order of blocks matters" },
        { do: "State the order type", result: "$\\omega+1$", why: "infinite sequence plus final point" }
      ], answer: "The stage order has type $\\omega+1$." }
    ],
    applications: [
      { title: "Termination arguments", background: "Program verification often proves that a measure decreases in a well-order. This prevents infinite descent.", numbers: "If a loop measure starts at $5$ and decreases by at least $1$ each iteration, it can run at most $5$ iterations before reaching $0$." },
      { title: "Well-founded recursion", background: "Definitions over syntax trees or proof trees use earlier pieces to define later ones. Ordinals generalize this pattern.", numbers: "A tree of height $3$ can define leaves at stage $0$, parents at stage $1$, grandparents at stage $2$, and root at stage $3$." },
      { title: "Priority constructions", background: "Logic uses transfinite stages to satisfy infinitely many requirements in order. Ordinals keep the bookkeeping honest.", numbers: "Requirements $R_0,R_1,R_2$ handled in order have finite priority type $3$; countably many requirements have type $\\omega$." },
      { title: "Training schedules with a final pass", background: "Although real training is finite, ordinal language clarifies schedule shape: repeated stages plus special terminal stages.", numbers: "$10$ epochs plus one averaging pass has finite order type $11$; an idealized all-finite-epochs process plus one pass has type $\\omega+1$." },
      { title: "Search trees", background: "Algorithms on trees often rely on height as a well-founded measure. Every recursive call must move to a smaller height.", numbers: "A node at height $4$ can make recursive calls at heights at most $3$, then $2$, then $1$, then $0$." },
      { title: "Ordinal arithmetic as order-sensitive", background: "Ordinals warn us that order matters even when cardinality does not. This is useful whenever stages cannot be rearranged freely.", numbers: "$1+\\omega=\\omega$ but $\\omega+1$ has a last element, so changing block order changes the result." }
    ],
    applicationsClose: "Ordinals are not bigger counting numbers; they are the language of ordered stages, successors, and limits.",
    takeaways: [
      "Ordinals represent order types of well-ordered sets.",
      "$\\omega$ is the first infinite ordinal and has no largest element.",
      "Ordinal addition is order-sensitive: $1+\\omega$ and $\\omega+1$ behave differently.",
      "Transfinite induction works because every nonempty counterexample set has a least element."
    ]
  },

  "math-16-15": {
    id: "math-16-15",
    title: "The axiom of choice",
    tagline: "Choice says that from every nonempty set in a collection, one selection can be made at once.",
    connections: {
      buildsOn: ["sets", "functions", "Relations and orderings", "Ordinals"],
      leadsTo: ["Gödel's incompleteness theorems", "basis theorems", "advanced set theory"],
      usedWith: ["Cartesian products", "well-ordering", "Zorn's lemma", "maximal elements"]
    },
    motivation:
      "<p>If you have three nonempty boxes, choosing one item from each is easy. If you have infinitely many boxes and no rule for choosing from them, the same sentence becomes a serious mathematical principle.</p>" +
      "<p>The <b>axiom of choice</b> says such simultaneous selections exist. It feels obvious in finite settings, powerful in infinite settings, and it quietly supports many theorems used across algebra, analysis, and foundations.</p>",
    definition:
      "<p>Given a collection $\\mathcal{F}$ of nonempty sets, a <b>choice function</b> is a function $c$ with domain $\\mathcal{F}$ such that $c(S)\\in S$ for every $S\\in\\mathcal{F}$. The <b>axiom of choice</b> states that every collection of nonempty sets has a choice function.</p>" +
      "<p>For a finite collection, we can build $c$ one set at a time. The axiom matters because an infinite collection may lack a definable selection rule. Equivalent forms include the well-ordering theorem and Zorn's lemma; the equivalence comes from using choices to build ordered selections, and using well-orders to choose least elements.</p>" +
      "<p><b>Assumptions that matter:</b> every set in the collection must be nonempty; the axiom asserts existence, not a computable rule; finite choice does not require the full axiom; and accepting choice can produce nonconstructive objects.</p>",
    worked: {
      problem: "Let $\\mathcal{F}=\\{\\{2,5\\},\\{1,4,9\\},\\{7\\}\\}$. Define a choice function by selecting the least number from each set.",
      skills: ["choice functions", "finite sets", "functions"],
      strategy: "Because each set contains numbers, the least-element rule gives an explicit choice.",
      steps: [
        { do: "Name the first set", result: "$S_1=\\{2,5\\}$", why: "choice functions take sets as inputs" },
        { do: "Choose from $S_1$", result: "$c(S_1)=2$", why: "2 is the least element" },
        { do: "Name the second set", result: "$S_2=\\{1,4,9\\}$", why: "move to the next input set" },
        { do: "Choose from $S_2$", result: "$c(S_2)=1$", why: "1 is the least element" },
        { do: "Name the third set", result: "$S_3=\\{7\\}$", why: "singleton sets have only one possible choice" },
        { do: "Choose from $S_3$", result: "$c(S_3)=7$", why: "7 is the only element" }
      ],
      verify: "Each selected value lies inside its input set, which is exactly the condition $c(S)\\in S$.",
      answer: "One choice function is $c(\\{2,5\\})=2$, $c(\\{1,4,9\\})=1$, and $c(\\{7\\})=7$.",
      connects: "The axiom of choice generalizes this simple finite selection to arbitrary collections of nonempty sets."
    },
    practice: [
      { problem: "For $\\mathcal{G}=\\{\\{a,b\\},\\{b,c\\}\\}$, give two different choice functions.", steps: [
        { do: "Name the sets", result: "$G_1=\\{a,b\\}$ and $G_2=\\{b,c\\}$", why: "the function inputs are sets" },
        { do: "Define the first function on $G_1$", result: "$c_1(G_1)=a$", why: "$a\\in G_1$" },
        { do: "Define the first function on $G_2$", result: "$c_1(G_2)=b$", why: "$b\\in G_2$" },
        { do: "Define a second function on $G_1$", result: "$c_2(G_1)=b$", why: "$b\\in G_1$" },
        { do: "Define a second function on $G_2$", result: "$c_2(G_2)=c$", why: "$c\\in G_2$" }
      ], answer: "For example, $c_1(G_1)=a,c_1(G_2)=b$ and $c_2(G_1)=b,c_2(G_2)=c$." },
      { problem: "Why does the collection $\\{\\{1\\},\\emptyset\\}$ have no choice function?", steps: [
        { do: "Inspect the first set", result: "$\\{1\\}$ is nonempty", why: "a choice from it would be 1" },
        { do: "Inspect the second set", result: "$\\emptyset$ has no elements", why: "there is nothing to select" },
        { do: "Apply the choice-function condition", result: "$c(\\emptyset)\\in\\emptyset$ would be required", why: "the domain includes $\\emptyset$" },
        { do: "Recognize impossibility", result: "no such value exists", why: "the empty set contains no elements" },
        { do: "Conclude", result: "no choice function", why: "one input set is empty" }
      ], answer: "There is no choice function because one member of the collection is empty." },
      { problem: "For intervals $I_n=(n,n+1)$ for $n=1,2,3$, use the midpoint rule to choose one point from each.", steps: [
        { do: "Write the rule", result: "$c(I_n)=n+\\dfrac12$", why: "the midpoint lies halfway between endpoints" },
        { do: "Evaluate $I_1$", result: "$c(I_1)=1.5$", why: "$1+1/2=1.5$" },
        { do: "Evaluate $I_2$", result: "$c(I_2)=2.5$", why: "$2+1/2=2.5$" },
        { do: "Evaluate $I_3$", result: "$c(I_3)=3.5$", why: "$3+1/2=3.5$" },
        { do: "Check membership", result: "$1.5\\in(1,2)$, $2.5\\in(2,3)$, $3.5\\in(3,4)$", why: "each midpoint is inside its interval" }
      ], answer: "The midpoint choices are $1.5$, $2.5$, and $3.5$." },
      { problem: "Explain how a well-order on each set would give a choice function.", steps: [
        { do: "Take a nonempty set $S$", result: "$S\\in\\mathcal{F}$", why: "choice is made one member set at a time" },
        { do: "Use its well-order", result: "$S$ has a least element", why: "every nonempty subset of a well-ordered set has a least element" },
        { do: "Define the choice", result: "$c(S)=\\min S$", why: "the least element belongs to $S$" },
        { do: "Repeat for every $S$", result: "$c$ is defined on $\\mathcal{F}$", why: "each set has its own least element" },
        { do: "Check the condition", result: "$c(S)\\in S$", why: "least elements are still elements" }
      ], answer: "Choosing the least element under each well-order defines a choice function." },
      { problem: "A hyperparameter sweep has nonempty candidate sets $L=\\{0.01,0.1\\}$, $D=\\{128,256,512\\}$, and $B=\\{32\\}$. Choose one configuration and verify it is in the product.", steps: [
        { do: "Choose from $L$", result: "$0.1\\in L$", why: "pick a learning rate" },
        { do: "Choose from $D$", result: "$256\\in D$", why: "pick a hidden dimension" },
        { do: "Choose from $B$", result: "$32\\in B$", why: "the batch set is a singleton" },
        { do: "Form the tuple", result: "$(0.1,256,32)$", why: "a configuration chooses one value from each set" },
        { do: "Check product membership", result: "$(0.1,256,32)\\in L\\times D\\times B$", why: "each coordinate came from the matching set" }
      ], answer: "One valid configuration is $(0.1,256,32)$." }
    ],
    applications: [
      { title: "Cartesian products", background: "Choice functions are exactly what make arbitrary products of nonempty sets nonempty. Finite products are familiar; infinite products need the axiom in general.", numbers: "For $A=\\{1,2\\}$ and $B=\\{x,y,z\\}$, $A\\times B$ has $2\\cdot3=6$ elements, and $(1,x)$ is one chosen tuple." },
      { title: "Choosing representatives", background: "Equivalence classes often need one representative each. Choice guarantees a representative set when there is no canonical rule.", numbers: "If classes are $\\{a,b\\}$, $\\{c\\}$, and $\\{d,e,f\\}$, selecting $a,c,e$ gives $3$ representatives." },
      { title: "Bases of vector spaces", background: "A standard theorem says every vector space has a basis. For arbitrary spaces this relies on choice, often through Zorn's lemma.", numbers: "In $\\mathbb{R}^3$, the explicit basis has $3$ vectors, such as $(1,0,0),(0,1,0),(0,0,1)$; infinite-dimensional cases need stronger existence tools." },
      { title: "Model selection grids", background: "Practical ML usually has finite candidate sets, so no deep axiom is needed. Still, the structure is a choice from each coordinate set.", numbers: "Learning rates $3$, depths $4$, and batch sizes $2$ produce $3\\cdot4\\cdot2=24$ configurations." },
      { title: "Nonconstructive existence", background: "Some theorems prove an object exists without showing how to compute it. Choice is a major source of such results.", numbers: "A proof may assert one element from each of $\\aleph_0$ nonempty sets; it gives $\\aleph_0$ selected elements but not necessarily an algorithm to list them." },
      { title: "Well-ordering data domains", background: "The well-ordering theorem, equivalent to choice, says every set can be well-ordered. This is foundational rather than operational for real-valued domains.", numbers: "A finite domain with $5$ records can be well-ordered by id in $5! =120$ possible total orders if all ids are distinct." }
    ],
    applicationsClose: "Choice turns many separate nonempty promises into one global selecting function, powerful precisely when no explicit rule is available.",
    takeaways: [
      "A choice function selects one element from each set in a collection of nonempty sets.",
      "The axiom of choice asserts such a function exists for every collection of nonempty sets.",
      "Finite choice is constructive; infinite choice may not provide a rule.",
      "Well-ordering and Zorn's lemma are equivalent forms used throughout higher mathematics."
    ]
  },

  "math-16-16": {
    id: "math-16-16",
    title: "Turing machines and computability",
    tagline: "A Turing machine is a stripped-down model of algorithmic work: read, write, move, and change state.",
    connections: {
      buildsOn: ["Infinite sets", "functions", "logical rules"],
      leadsTo: ["Decidability", "Gödel's incompleteness theorems", "complexity theory"],
      usedWith: ["finite automata", "recursive functions", "formal languages", "countability"]
    },
    motivation:
      "<p>You already know what an algorithm feels like: follow a finite recipe, one step at a time. Turing's insight was that we can model this with almost comical simplicity.</p>" +
      "<p>A <b>Turing machine</b> has finite control and an unbounded tape. That small model is powerful enough to capture the ordinary notion of computability, and precise enough to prove that some tasks cannot be computed.</p>",
    definition:
      "<p>A Turing machine has a finite set of states, a tape alphabet, a head that reads and writes one tape cell, and transition rules. A rule has the form: in state $q$ reading symbol $s$, write symbol $t$, move left or right, and enter state $q'$. The machine halts if it reaches a designated halt state or has no applicable rule.</p>" +
      "<p>A function is <b>computable</b> if some Turing machine, given an encoded input, halts with the encoded output. The model is convincing because any finite mechanical procedure can be broken into reading a bounded symbol, updating finite memory, writing a bounded symbol, and moving to a neighboring work location.</p>" +
      "<p><b>Assumptions that matter:</b> inputs and outputs are finite strings; the tape is unbounded but only finitely many cells are nonblank at any finite time; transition rules are finite; and computable means halts with the right output on every input in the function's domain.</p>",
    worked: {
      problem: "A machine scans right over a unary input $111$ and halts on the first blank. How many moves right does it make, and where does it halt?",
      skills: ["machine traces", "unary encoding", "halting"],
      strategy: "Trace one tape cell per step: each $1$ causes one right move; the blank causes halt.",
      steps: [
        { do: "Start at the first cell", result: "head reads the first $1$", why: "the input begins under the head" },
        { do: "Move over the first $1$", result: "right moves $=1$", why: "the scan rule advances on $1$" },
        { do: "Move over the second $1$", result: "right moves $=2$", why: "the same rule applies again" },
        { do: "Move over the third $1$", result: "right moves $=3$", why: "the last input symbol is still $1$" },
        { do: "Read the next cell", result: "blank symbol", why: "the finite input has ended" },
        { do: "Apply halt rule", result: "halt just after the third $1$", why: "the blank marks the end of the unary string" }
      ],
      verify: "A unary string of length $3$ has exactly three $1$ symbols, so three right moves before the blank is exactly right.",
      answer: "It makes $3$ right moves and halts on the blank cell immediately after the input.",
      connects: "Turing-machine computation is just local rule-following, but repeated local steps produce global behavior."
    },
    practice: [
      { problem: "A unary increment machine moves right over all $1$s in $11$, writes one $1$ on the first blank, and halts. What is the final tape segment?", steps: [
        { do: "Read the first $1$", result: "move right", why: "the scan rule skips existing marks" },
        { do: "Read the second $1$", result: "move right", why: "the same rule still applies" },
        { do: "Read the blank", result: "write $1$", why: "the blank is where the new unary unit goes" },
        { do: "Halt", result: "no more moves", why: "the increment is complete" },
        { do: "Read the output", result: "$111$", why: "two old $1$s plus one new $1$" }
      ], answer: "The final tape segment is $111$." },
      { problem: "A binary string recognizer accepts strings ending in $1$. For input $1010$, what last symbol is seen and should it accept?", steps: [
        { do: "Scan the first symbol", result: "$1$", why: "start at the left" },
        { do: "Scan the second symbol", result: "$0$", why: "move right one cell" },
        { do: "Scan the third symbol", result: "$1$", why: "continue to the end" },
        { do: "Scan the fourth symbol", result: "$0$", why: "this is the last input symbol" },
        { do: "Apply the rule", result: "reject", why: "the string ends in $0$, not $1$" }
      ], answer: "The last symbol is $0$, so the recognizer rejects." },
      { problem: "Encode the pair $(2,3)$ in unary as $11\\#111$. How many nonblank symbols are on the tape?", steps: [
        { do: "Count first unary block", result: "$2$ symbols", why: "$2$ is encoded as $11$" },
        { do: "Count separator", result: "$1$ symbol", why: "$\\#$ separates the two numbers" },
        { do: "Count second unary block", result: "$3$ symbols", why: "$3$ is encoded as $111$" },
        { do: "Add counts", result: "$2+1+3=6$", why: "all are nonblank tape symbols" },
        { do: "State the tape content", result: "$11\\#111$", why: "the encoded pair has six nonblank cells" }
      ], answer: "There are $6$ nonblank symbols." },
      { problem: "Why are there only countably many Turing machines?", steps: [
        { do: "Describe a machine", result: "finite transition table", why: "a machine has finitely many rules" },
        { do: "Encode the table", result: "finite string over a finite alphabet", why: "states and symbols can be named by text" },
        { do: "Classify finite strings", result: "countable", why: "finite strings can be listed by length" },
        { do: "Map machines to strings", result: "machines form a subset of finite strings", why: "not every string is valid, but every machine has an encoding" },
        { do: "Conclude", result: "countably many Turing machines", why: "a subset of a countable set is countable" }
      ], answer: "There are countably many Turing machines." },
      { problem: "A computable classifier reads a finite feature string and halts with $0$ or $1$. For inputs $x_1,x_2,x_3$, it outputs $1,0,1$. What function values have been computed on this sample?", steps: [
        { do: "Name the classifier", result: "$f$", why: "a halting machine computes a function on inputs" },
        { do: "Record the first output", result: "$f(x_1)=1$", why: "the machine halts with 1" },
        { do: "Record the second output", result: "$f(x_2)=0$", why: "the machine halts with 0" },
        { do: "Record the third output", result: "$f(x_3)=1$", why: "the machine halts with 1" },
        { do: "State sample behavior", result: "positive, negative, positive", why: "binary outputs can be read as class labels" }
      ], answer: "$f(x_1)=1$, $f(x_2)=0$, and $f(x_3)=1$." }
    ],
    applications: [
      { title: "Universal computation", background: "A universal Turing machine reads an encoded machine and input, then simulates that machine. This is the ancestor of stored-program computers.", numbers: "If a simulated machine takes $5$ steps and the universal simulator uses $20$ internal steps per simulated step, the simulation takes about $100$ steps." },
      { title: "Program encodings", background: "Compilers and interpreters rely on the fact that programs are data: finite strings that can be parsed, transformed, and executed.", numbers: "A source file with $1200$ characters over an ASCII-like alphabet is one finite string; there are at most $128^{1200}$ strings of that length." },
      { title: "Recognizers and classifiers", background: "A recognizer accepts or rejects strings. A binary classifier is similar in spirit: it maps encoded examples to labels.", numbers: "On $1000$ inputs, if a classifier halts with $1$ on $230$, its positive rate is $230/1000=0.23$." },
      { title: "Feature pipelines as computations", background: "Data preprocessing can be modeled as computation on finite encodings, even when the source data represents images, text, or logs.", numbers: "A $28\\times28$ grayscale image with one byte per pixel has $784$ bytes, or $6272$ bits, as a finite input string." },
      { title: "Limits of automation", background: "Because machines are countable but functions on strings are far more numerous, some input-output behaviors cannot be computed by any program.", numbers: "There are countably many programs but uncountably many binary functions on $\\mathbb{N}$, so most such functions have no program." },
      { title: "Halting as a practical concern", background: "Real systems use timeouts because some computations may not finish quickly, or at all. Turing machines make this distinction exact.", numbers: "If a job budget is $60$ seconds and each step takes $0.002$ seconds, the budget allows $30000$ steps before timeout." }
    ],
    applicationsClose: "Turing machines turn the word algorithm into a mathematical object: finite rules acting on finite encodings, one local step at a time.",
    takeaways: [
      "A Turing machine reads, writes, moves, and changes state according to a finite transition table.",
      "A function is computable when some machine halts with the correct output for each input.",
      "There are only countably many machines because each has a finite encoding.",
      "The model is simple enough for proofs and powerful enough to represent ordinary algorithms."
    ]
  },

  "math-16-17": {
    id: "math-16-17",
    title: "Decidability",
    tagline: "A decidable problem has an algorithm that always halts with yes or no.",
    connections: {
      buildsOn: ["Turing machines and computability", "logic", "Infinite sets"],
      leadsTo: ["Gödel's incompleteness theorems", "complexity theory", "formal verification"],
      usedWith: ["reductions", "languages", "proof by contradiction", "recursive sets"]
    },
    motivation:
      "<p>Some questions are easy to answer for one case: this string has even length, this graph has three nodes, this program printed a line in your test run. Decidability asks for more: can one algorithm answer every case and always stop?</p>" +
      "<p>This distinction matters because computation is not just about speed. For some problems, no perfect always-halting yes-or-no algorithm exists at all.</p>",
    definition:
      "<p>A decision problem is a set $L$ of finite strings, called a language. It is <b>decidable</b> if there is a Turing machine that halts on every input and accepts exactly the strings in $L$. It is <b>recognizable</b> if a machine accepts strings in $L$ and may run forever on strings not in $L$.</p>" +
      "<p>The halting problem is undecidable: there is no algorithm $H(M,x)$ that always halts and correctly says whether machine $M$ halts on input $x$. The diagonal proof assumes such $H$ exists, builds a machine that does the opposite on its own code, and reaches a contradiction.</p>" +
      "<p><b>Assumptions that matter:</b> inputs are finite encodings; decidable means halt on both yes and no cases; recognizable permits non-halting on no cases; and reductions transfer undecidability from one problem to another.</p>",
    worked: {
      problem: "Decide whether the even-length binary-string language is decidable, and describe an always-halting decider.",
      skills: ["languages", "deciders", "finite strings"],
      strategy: "Use a two-state parity machine that flips state for each symbol and halts at the end.",
      steps: [
        { do: "Start in the even state", result: "state $E$", why: "the empty prefix has length 0, which is even" },
        { do: "Read a symbol", result: "switch parity state", why: "adding one symbol changes even to odd or odd to even" },
        { do: "Continue to the blank", result: "all symbols are processed", why: "the input is finite" },
        { do: "Halt in state $E$", result: "accept", why: "the total length is even" },
        { do: "Halt in state $O$", result: "reject", why: "the total length is odd" }
      ],
      verify: "For input $1010$, the states go $E,O,E,O,E$, so length $4$ is accepted; for $101$, the final state is $O$.",
      answer: "$L$ is decidable by a parity-tracking machine that always scans to the finite end and halts.",
      connects: "Decidability requires not just a correct answer, but a guaranteed halt for every input."
    },
    practice: [
      { problem: "Is the language of binary strings containing at least one $1$ decidable? Give a decider idea.", steps: [
        { do: "Start scanning", result: "read symbols left to right", why: "the input is finite" },
        { do: "If a $1$ appears", result: "accept", why: "the condition has been met" },
        { do: "If a $0$ appears", result: "continue", why: "a later symbol might be $1$" },
        { do: "If the blank appears before any $1$", result: "reject", why: "the whole string has been checked" },
        { do: "Assess halting", result: "always halts", why: "finite input has a last cell" }
      ], answer: "Yes. Scan until a $1$ is found or the input ends." },
      { problem: "A recognizer accepts when it finds substring $101$ but loops forever otherwise. Is it a decider for strings containing $101$?", steps: [
        { do: "Check yes cases", result: "accepts strings containing $101$", why: "the recognizer finds the substring" },
        { do: "Check no cases", result: "may loop forever", why: "the problem statement says so" },
        { do: "Recall decider requirement", result: "halt on every input", why: "decidable means yes and no both stop" },
        { do: "Compare behavior", result: "fails on no cases", why: "looping is not rejection" },
        { do: "Conclude", result: "not a decider", why: "it is only a recognizer as described" }
      ], answer: "No. It recognizes the language but is not a decider because it may not halt on no inputs." },
      { problem: "If problem $A$ is undecidable and $A$ reduces to problem $B$, what can you conclude about $B$?", steps: [
        { do: "State the reduction", result: "$A\\le B$", why: "an algorithm for $B$ would solve $A$ through translation" },
        { do: "Assume $B$ decidable", result: "there is a decider for $B$", why: "use contradiction" },
        { do: "Translate an $A$ instance", result: "produce a $B$ instance", why: "the reduction is computable" },
        { do: "Run the $B$ decider", result: "decide the translated instance", why: "the assumed decider halts" },
        { do: "Contradict undecidability of $A$", result: "$B$ cannot be decidable", why: "otherwise $A$ would be decidable" }
      ], answer: "$B$ is undecidable." },
      { problem: "Explain why the set of all finite strings over $\\{0,1\\}$ is decidable.", steps: [
        { do: "Read the input alphabet", result: "$\\{0,1\\}$", why: "valid symbols are known" },
        { do: "Scan each symbol", result: "verify it is $0$ or $1$", why: "membership only depends on symbols" },
        { do: "Reach the end", result: "accept", why: "every finite binary input belongs to $\\{0,1\\}^*$" },
        { do: "Handle invalid encodings", result: "reject if another symbol appears", why: "it is not a binary string" },
        { do: "Assess halting", result: "always halts", why: "the input has finite length" }
      ], answer: "It is decidable by scanning the finite input and checking all symbols are binary." },
      { problem: "An ML safety checker claims it can decide whether any Python model will ever output NaN on any input. Why should this claim make you suspicious?", steps: [
        { do: "Identify the quantified behavior", result: "any program on any input", why: "the claim ranges over arbitrary Python models" },
        { do: "Connect to program behavior", result: "predicting future execution", why: "NaN occurrence is a semantic property of runs" },
        { do: "Recall undecidability pattern", result: "nontrivial program properties are generally undecidable", why: "halting-style reductions apply" },
        { do: "Separate testing from deciding", result: "tests can find examples but not prove all cases automatically", why: "finite tests cover finite behavior" },
        { do: "State the concern", result: "the universal always-correct decider likely cannot exist", why: "it would solve an undecidable class of questions" }
      ], answer: "The claim is suspicious because a universal, always-halting checker for such nontrivial program behavior would run into undecidability." }
    ],
    applications: [
      { title: "Static analysis", background: "Static analyzers answer questions about code without running all possible executions. Decidability explains why tools use approximations.", numbers: "If an analyzer checks $10000$ functions and flags $120$, a human may inspect $120/10000=1.2\\%$ of functions, but the tool may still have false positives or negatives." },
      { title: "Type checking", background: "Many programming languages design type systems so type checking is decidable. Expressiveness is balanced against guaranteed termination.", numbers: "A compiler that type-checks $500$ files and spends $0.04$ seconds per file takes about $20$ seconds, assuming the procedure always halts." },
      { title: "Model verification", background: "Verification asks whether a model satisfies a property for all inputs in a region. Exact decidability depends on the model class and arithmetic.", numbers: "For a linear classifier $f(x)=2x-1$, checking $f(x)>0$ on $[1,3]$ reduces to the endpoint minimum $f(1)=1>0$." },
      { title: "Regular languages", background: "Finite automata decide regular languages, giving a clean island where membership is always decidable.", numbers: "A DFA with $4$ states reading a string of length $100$ takes exactly $100$ transitions, then accepts or rejects." },
      { title: "Timeouts are not deciders", background: "Engineering systems often impose time limits. This gives practical answers, not mathematical decidability.", numbers: "A verifier with a $30$ second timeout may return unknown after $30$ seconds; unknown is not the same as a proven no." },
      { title: "Reductions in security", background: "Security properties of arbitrary programs often inherit undecidability from halting-like questions.", numbers: "If exploit reachability for arbitrary programs were decidable, a reduction could encode halting into reachability with one special line, contradicting undecidability." }
    ],
    applicationsClose: "Decidability is the boundary between questions an algorithm can always settle and questions where computation itself refuses a universal judge.",
    takeaways: [
      "A decidable language has a machine that halts on every input and answers correctly.",
      "Recognizable languages may halt only on yes instances.",
      "The halting problem is undecidable by diagonal contradiction.",
      "Reductions transfer undecidability from one problem to another."
    ]
  },

  "math-16-18": {
    id: "math-16-18",
    title: "Gödel's incompleteness theorems",
    tagline: "Any sufficiently strong consistent formal system has true arithmetic statements it cannot prove.",
    connections: {
      buildsOn: ["Decidability", "Turing machines and computability", "formal proof", "Infinite sets"],
      leadsTo: ["Neuro-symbolic AI", "proof theory", "model theory"],
      usedWith: ["formal systems", "arithmetization", "self-reference", "consistency"]
    },
    motivation:
      "<p>It is natural to hope that mathematics could be captured by one perfect rulebook: every true arithmetic statement would eventually have a proof, and no false statement would sneak in.</p>" +
      "<p>Gödel showed that this hope has a precise limit. Once a formal system is strong enough to express ordinary arithmetic and is consistent, there are arithmetic truths it cannot prove from its own rules.</p>",
    definition:
      "<p>A formal system is <b>consistent</b> if it does not prove both a statement and its negation. It is <b>complete</b> for arithmetic if every true arithmetic sentence is provable. Gödel's first incompleteness theorem says that any consistent, effectively axiomatized formal system strong enough for arithmetic is incomplete.</p>" +
      "<p>The proof encodes formulas and proofs as natural numbers, called Gödel numbering. This lets arithmetic talk about provability. A carefully built sentence $G$ says, in effect, $G$ is not provable in this system. If the system proved $G$, it would prove a falsehood about its own provability; if it proved $\\neg G$, it would also fail under suitable soundness assumptions. So, when consistent, $G$ is true but unprovable.</p>" +
      "<p><b>Assumptions that matter:</b> the system must be effectively axiomatized, strong enough to represent basic arithmetic, and consistent; incompleteness is about formal provability, not human insight; and the second theorem says such a system cannot prove its own consistency in the standard internal way.</p>",
    worked: {
      problem: "A toy Gödel numbering assigns symbol codes $A=2$, $B=3$, and $\\to=5$. Encode the string $A\\to B$ as $2\\cdot10^2+5\\cdot10+3$, then decode $253$.",
      skills: ["encoding", "formal syntax", "arithmetization"],
      strategy: "Treat syntax as numbers: encode each symbol in a digit position, then reverse the positions to decode.",
      steps: [
        { do: "Place the code for $A$", result: "$2\\cdot10^2=200$", why: "$A$ is the hundreds digit" },
        { do: "Place the code for $\\to$", result: "$5\\cdot10=50$", why: "the arrow symbol is the tens digit" },
        { do: "Place the code for $B$", result: "$3$", why: "$B$ is the ones digit" },
        { do: "Add the parts", result: "$200+50+3=253$", why: "combine the positional encoding" },
        { do: "Decode $253$", result: "$2,5,3$", why: "read hundreds, tens, and ones digits" },
        { do: "Translate symbols", result: "$A\\to B$", why: "$2$ means $A$, $5$ means $\\to$, and $3$ means $B$" }
      ],
      verify: "Encoding then decoding returns the same three-symbol string, which is the basic promise of arithmetizing syntax.",
      answer: "The code is $253$, and decoding $253$ gives $A\\to B$.",
      connects: "Gödel's proof begins by making formal statements and proofs into arithmetic objects."
    },
    practice: [
      { problem: "Using the same codes $A=2$, $B=3$, $\\to=5$, encode $B\\to A$.", steps: [
        { do: "Place the code for $B$", result: "$3\\cdot10^2=300$", why: "$B$ is first" },
        { do: "Place the code for $\\to$", result: "$5\\cdot10=50$", why: "the arrow is second" },
        { do: "Place the code for $A$", result: "$2$", why: "$A$ is third" },
        { do: "Add the parts", result: "$300+50+2=352$", why: "positional codes combine by addition" },
        { do: "Check by decoding", result: "$3,5,2$ means $B\\to A$", why: "each digit maps back to its symbol" }
      ], answer: "$B\\to A$ encodes as $352$." },
      { problem: "If a formal system proves both $P$ and $\\neg P$, which property fails?", steps: [
        { do: "State the two proofs", result: "$P$ is provable and $\\neg P$ is provable", why: "both statements are derivable" },
        { do: "Recall consistency", result: "no statement and its negation are both provable", why: "that is the definition" },
        { do: "Compare", result: "the definition is violated", why: "the system proves a contradiction" },
        { do: "Name the failed property", result: "consistency", why: "contradictory provability is inconsistency" },
        { do: "Conclude", result: "the system is inconsistent", why: "one counterexample is enough" }
      ], answer: "Consistency fails." },
      { problem: "A proof checker can verify any proposed proof in finite time. Why does that make the system effectively axiomatized in spirit?", steps: [
        { do: "Take a proposed proof", result: "finite string", why: "formal proofs are finite objects" },
        { do: "Run the checker", result: "accept or reject", why: "verification halts in finite time" },
        { do: "List possible strings", result: "all finite strings can be enumerated", why: "sort by length then lexicographic order" },
        { do: "Filter valid proofs", result: "accepted strings form an enumerable set", why: "the checker identifies them" },
        { do: "Connect to axiomatization", result: "proofs are mechanically recognizable", why: "effective means rule-governed and computable" }
      ], answer: "Because valid proofs can be mechanically checked and enumerated from finite strings." },
      { problem: "Why does incompleteness not say every unproved statement is true?", steps: [
        { do: "Recall the theorem", result: "some true statement is unprovable", why: "in a suitable consistent system" },
        { do: "Read the quantifier", result: "some, not all", why: "existence is not universality" },
        { do: "Consider false statements", result: "many false statements are also unprovable", why: "a sound system should not prove falsehoods" },
        { do: "Consider independent statements", result: "truth may depend on interpretation or stronger axioms", why: "formal systems can be extended" },
        { do: "State the correction", result: "unproved does not imply true", why: "provability and truth are distinct concepts" }
      ], answer: "Incompleteness says at least one true arithmetic sentence is unprovable; it does not make every unproved sentence true." },
      { problem: "A theorem prover proves $850$ of $1000$ benchmark statements and refutes $50$. How many remain unsettled by the prover, and what does that number mean?", steps: [
        { do: "Add settled cases", result: "$850+50=900$", why: "proved and refuted cases are both settled" },
        { do: "Subtract from total", result: "$1000-900=100$", why: "the rest have no prover result" },
        { do: "Interpret unsettled", result: "$100$ statements", why: "the prover did not prove or refute them" },
        { do: "Avoid overclaiming", result: "not necessarily independent", why: "resource limits or missing strategies may explain failure" },
        { do: "Connect to foundations", result: "provability depends on system and search", why: "unsettled by one prover is not the same as absolutely unprovable" }
      ], answer: "$100$ remain unsettled by that prover; this is an empirical prover result, not by itself a Gödel independence proof." }
    ],
    applications: [
      { title: "Proof assistants", background: "Systems like Lean, Coq, and Isabelle check formal proofs. Gödel reminds us that any strong consistent foundation has limits.", numbers: "If a proof script has $200$ lines and the kernel checks each line in $0.003$ seconds, kernel checking takes about $0.6$ seconds." },
      { title: "Automated theorem proving", background: "Theorem provers search for proofs in formal systems. Incompleteness separates search failure from mathematical impossibility.", numbers: "A prover that explores $10^6$ nodes per second for $30$ seconds checks $3\\cdot10^7$ nodes, still finite within an infinite proof space." },
      { title: "Consistency strength", background: "Stronger systems can prove statements weaker systems cannot, but they bring stronger assumptions.", numbers: "If system $S_2$ adds one axiom to $S_1$, then every proof in $S_1$ remains available in $S_2$, while $S_2$ may prove additional statements." },
      { title: "Program verification limits", background: "Verification relies on formal systems and decision procedures. Some properties are decidable in restricted fragments and undecidable in full generality.", numbers: "Linear arithmetic constraints like $2x+3\\le7$ give $x\\le2$ directly, while arbitrary program behavior can encode halting." },
      { title: "Self-reference in systems", background: "Gödel's construction is a disciplined form of self-reference, not a paradoxical slogan. It encodes statements about proofs as arithmetic.", numbers: "A simple code $253$ can represent a three-symbol formula in the toy scheme; real Gödel numbering scales this to every formula and proof." },
      { title: "AI reasoning benchmarks", background: "Neuro-symbolic systems may search for formal proofs. Gödel's theorem warns that no fixed strong consistent system proves every arithmetic truth.", numbers: "If a benchmark has $500$ arithmetic claims and the prover solves $470$, the remaining $30$ may be hard, outside heuristics, or outside the chosen axioms; the count alone does not decide which." }
    ],
    applicationsClose: "Gödel's theorems teach a careful humility: formal proof is powerful, mechanizable, and inherently limited in strong arithmetic systems.",
    takeaways: [
      "Consistency means no statement and its negation are both provable.",
      "Gödel numbering encodes syntax and proof as arithmetic.",
      "Any consistent, effective, sufficiently strong arithmetic system is incomplete.",
      "Unprovable in a system does not mean meaningless, false, or unimportant."
    ]
  },

  "math-16-19": {
    id: "math-16-19",
    title: "Neuro-symbolic AI",
    tagline: "Neuro-symbolic AI combines learned pattern recognition with explicit rules, proofs, constraints, and structured knowledge.",
    connections: {
      buildsOn: ["Relations and orderings", "Decidability", "Gödel's incompleteness theorems"],
      leadsTo: ["probabilistic logic", "program synthesis", "formal verification for ML"],
      usedWith: ["graphs", "logic", "optimization", "probability"]
    },
    motivation:
      "<p>You already know two different strengths. Neural networks are good at messy perception: images, text, speech, embeddings. Symbolic systems are good at crisp structure: rules, constraints, proofs, plans.</p>" +
      "<p><b>Neuro-symbolic AI</b> tries to make these strengths cooperate. A model may propose candidates, while logic filters them; a knowledge graph may guide retrieval; a differentiable loss may penalize rule violations. The goal is not magic, but useful division of labor.</p>",
    definition:
      "<p>A neuro-symbolic system combines learned numerical components with symbolic representations such as predicates, rules, programs, graphs, or constraints. A typical pattern is: neural model produces scores $s_i$; symbolic knowledge imposes allowed structures $C$; the final output maximizes score while satisfying constraints, or trains with a penalty for violations.</p>" +
      "<p>One common constrained objective is $\\min_\\theta L_{data}(\\theta)+\\lambda L_{rule}(\\theta)$, where $L_{data}$ measures prediction error, $L_{rule}$ measures rule violation, and $\\lambda\\ge0$ controls how much the rule matters. This follows ordinary optimization: adding a weighted penalty changes the surface so rule-breaking predictions become more expensive.</p>" +
      "<p><b>Assumptions that matter:</b> symbolic rules must be encoded precisely; hard constraints may make search expensive or undecidable in rich languages; soft penalties do not guarantee perfect satisfaction; and the neural score is only as reliable as its data and representation.</p>",
    worked: {
      problem: "A classifier scores three labels with probabilities $P(A)=0.50$, $P(B)=0.30$, and $P(C)=0.20$. A symbolic rule says $A$ and $B$ cannot both be selected, and the system must select two labels. Choose the highest-probability valid pair.",
      skills: ["constraints", "ranking", "neuro-symbolic inference"],
      strategy: "Enumerate the two-label pairs, remove the rule-violating pair, then compare the neural scores that remain.",
      steps: [
        { do: "List all two-label pairs", result: "$\\{A,B\\}$, $\\{A,C\\}$, $\\{B,C\\}$", why: "three labels produce three pairs" },
        { do: "Apply the symbolic rule", result: "$\\{A,B\\}$ is invalid", why: "A and B cannot be selected together" },
        { do: "Score $\\{A,C\\}$", result: "$0.50+0.20=0.70$", why: "use summed probabilities as the pair score" },
        { do: "Score $\\{B,C\\}$", result: "$0.30+0.20=0.50$", why: "sum the two selected probabilities" },
        { do: "Compare valid scores", result: "$0.70>0.50$", why: "$\\{A,C\\}$ has the larger valid score" },
        { do: "Choose the output", result: "$\\{A,C\\}$", why: "it is valid and highest-scoring" }
      ],
      verify: "The pair $\\{A,C\\}$ satisfies the rule because it does not contain both $A$ and $B$, and no other valid pair has a higher score.",
      answer: "Select $\\{A,C\\}$.",
      connects: "The neural component ranks possibilities; the symbolic component removes impossible structures before the final decision."
    },
    practice: [
      { problem: "A rule penalty uses $L=L_{data}+\\lambda L_{rule}$. If $L_{data}=0.42$, $L_{rule}=0.10$, and $\\lambda=3$, compute $L$.", steps: [
        { do: "Write the objective", result: "$L=0.42+3\\cdot0.10$", why: "substitute the data loss, rule loss, and weight" },
        { do: "Multiply the penalty", result: "$3\\cdot0.10=0.30$", why: "the rule violation is weighted" },
        { do: "Add losses", result: "$0.42+0.30=0.72$", why: "total loss is data plus weighted rule loss" },
        { do: "Interpret the penalty share", result: "$0.30/0.72\\approx0.417$", why: "about 41.7 percent of total loss comes from the weighted rule term" },
        { do: "State the total", result: "$L=0.72$", why: "the arithmetic is complete" }
      ], answer: "The total loss is $0.72$." },
      { problem: "A knowledge graph has edges $A\\to B$, $B\\to C$, and $A\\to D$. If a rule allows paths of length at most $2$ from $A$, which nodes are reachable?", steps: [
        { do: "List length-1 neighbors", result: "$B$ and $D$", why: "these are direct outgoing edges from $A$" },
        { do: "Extend from $B$", result: "$C$", why: "$B\\to C$ gives a length-2 path from $A$" },
        { do: "Extend from $D$", result: "no new node", why: "no outgoing edge from $D$ is given" },
        { do: "Combine reachable nodes", result: "$\\{B,C,D\\}$", why: "include length 1 and length 2 destinations" },
        { do: "Check the bound", result: "all paths have length $1$ or $2$", why: "the rule excludes longer paths only" }
      ], answer: "The reachable nodes are $B$, $C$, and $D$." },
      { problem: "A neural retriever returns scores doc1 $0.82$, doc2 $0.78$, doc3 $0.74$. A symbolic filter requires source year $\\ge2020$; years are 2019, 2022, and 2021. Which document is selected?", steps: [
        { do: "Check doc1", result: "invalid", why: "year $2019<2020$" },
        { do: "Check doc2", result: "valid", why: "year $2022\\ge2020$" },
        { do: "Check doc3", result: "valid", why: "year $2021\\ge2020$" },
        { do: "Compare valid scores", result: "$0.78>0.74$", why: "doc2 outranks doc3 after filtering" },
        { do: "Select", result: "doc2", why: "highest score among valid documents" }
      ], answer: "doc2 is selected." },
      { problem: "A soft rule says probabilities for mutually exclusive labels $X$ and $Y$ should not both be high, with violation $\\max(0,p_X+p_Y-1)$. Compute the violation for $p_X=0.65$ and $p_Y=0.50$.", steps: [
        { do: "Add probabilities", result: "$p_X+p_Y=0.65+0.50=1.15$", why: "the rule checks their combined mass" },
        { do: "Subtract the limit", result: "$1.15-1=0.15$", why: "excess above 1 is violation" },
        { do: "Apply the maximum", result: "$\\max(0,0.15)=0.15$", why: "positive excess remains" },
        { do: "Interpret", result: "rule is violated by $0.15$", why: "both labels are too high together" },
        { do: "Compare to no violation", result: "$0.15>0$", why: "zero would mean the rule is satisfied" }
      ], answer: "The violation is $0.15$." },
      { problem: "A model proposes actions with scores: approve $0.60$, review $0.55$, reject $0.40$. A rule says if risk score is $0.9$, approve is forbidden. For risk $0.9$, choose the allowed action.", steps: [
        { do: "Read the risk", result: "$0.9$", why: "the rule condition is triggered" },
        { do: "Remove approve", result: "approve is invalid", why: "the symbolic rule forbids it at risk $0.9$" },
        { do: "List remaining actions", result: "review and reject", why: "these are still allowed" },
        { do: "Compare remaining scores", result: "$0.55>0.40$", why: "review has the higher neural score" },
        { do: "Choose action", result: "review", why: "best allowed action wins" }
      ], answer: "Choose review." }
    ],
    applications: [
      { title: "Constrained classification", background: "Many business labels obey rules: two labels may be mutually exclusive, or one label may require another. Neural scores can be projected onto valid outputs.", numbers: "If labels have scores $0.7,0.6,0.2$ and the top two conflict, selecting the best valid pair may use $0.7+0.2=0.9$ instead of invalid $1.3$." },
      { title: "Knowledge-graph retrieval", background: "Retrieval systems use embeddings for semantic similarity and graphs for explicit relationships such as author, topic, or citation.", numbers: "If embedding top scores are $0.91,0.88,0.80$ and a graph filter removes the first, the selected top score becomes $0.88$." },
      { title: "Rule-regularized training", background: "Soft logic constraints can be added to loss functions when rules are usually right but data may be noisy.", numbers: "With $L_{data}=1.2$, $L_{rule}=0.3$, and $\\lambda=0.5$, total loss is $1.2+0.5\\cdot0.3=1.35$." },
      { title: "Program synthesis with neural proposals", background: "A neural model can suggest candidate programs, while a symbolic executor tests them against examples.", numbers: "If $20$ candidates are proposed and symbolic tests reject $17$, only $3/20=15\\%$ remain for deeper checking." },
      { title: "Formal verification of neural decisions", background: "For restricted networks and input regions, solvers can prove that outputs obey a property. This is symbolic reasoning around learned functions.", numbers: "For $f(x)=2x-1$ on $x\\in[0.8,1.0]$, the minimum is $0.6$, so the property $f(x)>0$ holds on the interval." },
      { title: "Planning with learned heuristics", background: "Classical planners use symbolic state transitions. Learned heuristics can rank which actions to try first.", numbers: "If a planner has branching factor $5$ for depth $4$, blind search may inspect $5^4=625$ paths; a good heuristic that keeps $2$ actions per state reduces this to $2^4=16$ paths." },
      { title: "Explainable recommendations", background: "A recommender can combine vector similarity with symbolic reasons from a taxonomy or graph, making outputs easier to audit.", numbers: "If item similarity is $0.76$ and a rule bonus for same category is $0.10$, a combined score $0.86$ can outrank an item at $0.82$ without the rule bonus." }
    ],
    applicationsClose: "Neuro-symbolic AI works best when numbers and rules each do what they are good at: learning patterns, enforcing structure, and making decisions easier to inspect.",
    takeaways: [
      "Neuro-symbolic systems combine learned scores with explicit rules, graphs, programs, or constraints.",
      "Hard constraints filter or search only valid outputs; soft constraints add rule-violation penalties to the loss.",
      "Symbolic reasoning can improve validity and interpretability, but rich rules can be computationally hard.",
      "The practical pattern is cooperation: neural models propose, symbolic structure checks, guides, or explains."
    ]
  }
};
