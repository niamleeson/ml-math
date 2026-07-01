/* Plan-applied content for Topic 04 (Real analysis).
   Field-level override merged by tools/math-authored.js (sorts last → wins).
   Only plan-derived fields are set here; worked/practice/title/tagline/connections are preserved
   from the base entry. LaTeX uses natural single backslashes and is normalized afterward.
   Source: plans/math/math-part-04-real-analysis.md */
module.exports = {
  "math-04-01": {
    connectionsProse:
      "<p>Proof techniques are the working language of real analysis. The reader already knows how to test examples and compute with formulas, but analysis asks for statements that hold for every allowed object. Direct proof, contrapositive, contradiction, induction, and counterexample each give a reliable way to match reasoning to the shape of a claim. These methods will support the later lessons on limits, completeness, continuity, and convergence.</p>",
    motivation:
      "<p>Checking examples is useful for learning a pattern, but examples alone do not prove a universal statement. A claim about all natural numbers, all tolerances, or all points in an interval needs a reason that covers every case at once. Proof techniques are a small set of reliable forms for building that reason.</p>" +
      "<p>The method should match the statement. Direct proof follows the implication forward, contrapositive proves an equivalent reversed statement, contradiction shows an assumption cannot survive, induction handles step-by-step claims, and a counterexample disproves a universal claim. Real analysis uses these forms constantly because its definitions quantify over every $\\varepsilon>0$, every sufficiently large index, or every point in a domain.</p>",
    definition:
      "<p>Proof techniques are standard reasoning forms for proving or disproving quantified mathematical statements.</p>" +
      "<p><b>Assumptions that matter:</b> match the method to the statement: direct proof, contrapositive, contradiction, induction, or counterexample.</p>",
    symbols: [
      { sym: "$P\\Rightarrow Q$", desc: "assumption $P$ guarantees conclusion $Q$" },
      { sym: "$\\forall$", desc: "every allowed object" },
      { sym: "$\\exists$", desc: "at least one object" },
      { sym: "$\\varepsilon$", desc: "an arbitrary positive error tolerance" }
    ],
    applications: [
      { title: "Direct proof", background: "if $n=2k$, then $n^2=4k^2=2(2k^2)$ is even.", numbers: "if $n=2k$, then $n^2=4k^2=2(2k^2)$ is even." },
      { title: "Contrapositive", background: "proving $n^2$ even implies $n$ even can use $n$ odd $\\Rightarrow n^2$ odd; $3^2=9$ illustrates the odd case.", numbers: "proving $n^2$ even implies $n$ even can use $n$ odd $\\Rightarrow n^2$ odd; $3^2=9$ illustrates the odd case." },
      { title: "Contradiction", background: "assume $\\sqrt2=a/b$ in lowest terms, then both $a,b$ become even.", numbers: "assume $\\sqrt2=a/b$ in lowest terms, then both $a,b$ become even." },
      { title: "Induction", background: "$1+\\cdots+n=n(n+1)/2$ gives $55$ when $n=10$.", numbers: "$1+\\cdots+n=n(n+1)/2$ gives $55$ when $n=10$." },
      { title: "Counterexample", background: "one discontinuity refutes “all monotone functions are continuous”; a step at $0$ suffices.", numbers: "one discontinuity refutes “all monotone functions are continuous”; a step at $0$ suffices." },
      { title: "Epsilon proof planning", background: "to prove $1/n\\to0$ with $\\varepsilon=0.01$, choose $N=101$.", numbers: "to prove $1/n\\to0$ with $\\varepsilon=0.01$, choose $N=101$." }
    ]
  },
  "math-04-02": {
    connectionsProse:
      "<p>The natural, integer, and rational numbers are the first number systems used throughout mathematics. Counting indices, measuring signed offsets, and forming ratios already cover many ordinary computations. Real analysis begins with these familiar sets so the later need for real numbers is clear rather than mysterious. The rational numbers are especially important because they are dense, yet still incomplete.</p>",
    motivation:
      "<p>Counting numbers model repeated steps, integers add signed direction, and rationals express exact ratios. These sets already support many computations, so they are the natural starting point for analysis. Their algebraic closure properties explain why operations such as adding counts or multiplying rational scales stay inside the expected system.</p>" +
      "<p>The important limitation is that rational numbers, although dense, still have gaps. Between any two rationals there is another rational, but some limiting processes point to values such as $\\sqrt2$ that no rational equals. This prepares the need for real numbers, where the gaps needed by limits are filled.</p>",
    definition:
      "<p>The basic number systems are $\\mathbb N$ for counting numbers, $\\mathbb Z$ for integers, and $\\mathbb Q=\\{p/q:q\\ne0\\}$ for rational ratios.</p>" +
      "<p><b>Assumptions that matter:</b> use closure properties for arithmetic inside a system, and use $(a+b)/2$ to see density of rationals between $a<b$.</p>",
    symbols: [
      { sym: "$\\mathbb N$", desc: "counting numbers" },
      { sym: "$\\mathbb Z$", desc: "integers" },
      { sym: "$\\mathbb Q=\\{p/q:q\\ne0\\}$", desc: "rational numbers with nonzero denominator" },
      { sym: "dense", desc: "every interval contains a point of the set" }
    ],
    applications: [
      { title: "Batch counts live in ", background: "Batch counts live in $\\mathbb N$; a batch of $128$ is a natural number.", numbers: "Batch counts live in $\\mathbb N$; a batch of $128$ is a natural number." },
      { title: "Class-label offsets use ; label", background: "Class-label offsets use $\\mathbb Z$; label shift $-3$ is valid.", numbers: "Class-label offsets use $\\mathbb Z$; label shift $-3$ is valid." },
      { title: "Learning rates like are rational", background: "Learning rates like $1/1000$ are rational.", numbers: "Learning rates like $1/1000$ are rational." },
      { title: "Quantized weights with denominator have", background: "Quantized weights with denominator $8$ have values $k/8$; $3/8=0.375$.", numbers: "Quantized weights with denominator $8$ have values $k/8$; $3/8=0.375$." },
      { title: "Between and , the rational", background: "Between $0.7$ and $0.8$, the rational midpoint is $0.75$.", numbers: "Between $0.7$ and $0.8$, the rational midpoint is $0.75$." },
      { title: "Rationals miss , motivating real", background: "Rationals miss $\\sqrt2\\approx1.41421356$, motivating real numbers.", numbers: "Rationals miss $\\sqrt2\\approx1.41421356$, motivating real numbers." }
    ]
  },
  "math-04-03": {
    connectionsProse:
      "<p>The real numbers extend the number systems from counting and ratios to a complete number line. This lesson connects rational approximation with the limits and endpoints that analysis needs. Once the real line is available, sequences can converge to values such as $\\sqrt2$ even when rational arithmetic only approaches them. Completeness of $\\mathbb R$ becomes the foundation for suprema, Cauchy sequences, continuity, and optimization.</p>",
    motivation:
      "<p>Rational approximations can get closer and closer to a target without ever being exactly equal to it. The decimal approximations to $\\sqrt2$ show this clearly: each interval narrows, but rational endpoints alone do not explain why there is a final number being trapped. Real numbers supply that final landing place.</p>" +
      "<p>Calling $\\mathbb R$ a complete ordered field means it has arithmetic, order, and no missing limit points of the kind analysis needs. Completeness allows nested intervals, Cauchy sequences, and least upper bounds to produce real values. Later convergence proofs depend on this guarantee rather than on decimal notation itself.</p>",
    definition:
      "<p>The real numbers $\\mathbb R$ form a complete ordered field: arithmetic and order work as expected, and Cauchy or least-upper-bound gaps are filled.</p>" +
      "<p><b>Assumptions that matter:</b> nested decimal intervals such as $[1,2]$, $[1.4,1.5]$, $[1.41,1.42]$ point to a real limit such as $\\sqrt2$.</p>",
    symbols: [
      { sym: "$\\mathbb R$", desc: "the real line" },
      { sym: "$<$", desc: "the order" },
      { sym: "completeness", desc: "no Cauchy or least-upper-bound gaps remain" },
      { sym: "$\\sqrt2$", desc: "the positive real whose square is $2$" }
    ],
    applications: [
      { title: "A loss value is modeled", background: "A loss value $0.0137$ is modeled as real.", numbers: "A loss value $0.0137$ is modeled as real." },
      { title: "A continuous feature such as", background: "A continuous feature such as age $34.5$ lies in $\\mathbb R$.", numbers: "A continuous feature such as age $34.5$ lies in $\\mathbb R$." },
      { title: "The diagonal of a unit", background: "The diagonal of a unit square has length $\\sqrt2$.", numbers: "The diagonal of a unit square has length $\\sqrt2$." },
      { title: "Decimal bisection traps in an", background: "Decimal bisection traps $\\sqrt2$ in an interval of width $10^{-3}$ after three displayed decimals.", numbers: "Decimal bisection traps $\\sqrt2$ in an interval of width $10^{-3}$ after three displayed decimals." },
      { title: "Optimization assumes a minimizer can", background: "Optimization assumes a minimizer can be a real number such as $w=\\pi/4$.", numbers: "Optimization assumes a minimizer can be a real number such as $w=\\pi/4$." },
      { title: "Probability scores fill , not", background: "Probability scores fill $[0,1]$, not just rational grid points.", numbers: "Probability scores fill $[0,1]$, not just rational grid points." }
    ]
  },
  "math-04-04": {
    connectionsProse:
      "<p>This lesson gives the first precise form of completeness. Earlier number systems let us compare and approximate, but the real numbers also guarantee best possible upper and lower bounds for nonempty bounded sets. Suprema and infima turn the informal idea of an endpoint into a usable mathematical object. The same language will appear in continuity proofs, compactness arguments, and optimization guarantees.</p>",
    motivation:
      "<p>A bounded set may have many upper bounds, but analysis often needs the best one. For an open interval such as $(0,1)$, the endpoint $1$ is not in the set, yet it is still the least ceiling. The supremum records this boundary without requiring membership.</p>" +
      "<p>The epsilon property of the supremum is what makes it useful in proofs. If $\\sup S-\\varepsilon$ were still an upper bound, then the proposed supremum would not be least. Therefore elements of the set must come within every positive distance below the supremum, which turns an endpoint statement into approximating elements.</p>",
    definition:
      "<p>For a nonempty set $S$ bounded above, $\\sup S$ is the least upper bound, and for every $\\varepsilon>0$ some $s\\in S$ satisfies $\\sup S-\\varepsilon<s\\le\\sup S$.</p>" +
      "<p><b>Assumptions that matter:</b> $S$ is nonempty and bounded above; infima follow by applying the same idea to $-S$.</p>",
    symbols: [
      { sym: "$\\sup S$", desc: "the least upper bound" },
      { sym: "$\\inf S$", desc: "the greatest lower bound" },
      { sym: "$\\varepsilon$", desc: "measures closeness to the endpoint" }
    ],
    derivation: [
      { do: "Establish the step", result: "Let $S$ be nonempty and bounded above", why: "this gives at least one ceiling." },
      { do: "Completeness states that the set of ceilings has a least element", result: "called $\\sup S$", why: "the real line has no gap at the best ceiling." },
      { do: "For every $\\varepsilon>0$", result: "$\\sup S-\\varepsilon$ is not an upper bound", why: "otherwise $\\sup S$ would not be least." },
      { do: "Establish the step", result: "Therefore some $s\\in S$ satisfies $\\sup S-\\varepsilon<s\\le\\sup S$", why: "elements of $S$ approach the supremum from below." },
      { do: "Establish the step", result: "The infimum follows by applying the same argument to $-S$", why: "lower bounds become upper bounds after negation." }
    ],
    applications: [
      { title: "For , and although neither", background: "For $S=(0,1)$, $\\sup S=1$ and $\\inf S=0$ although neither is in $S$.", numbers: "For $S=(0,1)$, $\\sup S=1$ and $\\inf S=0$ although neither is in $S$." },
      { title: "Validation loss bounded below by", background: "Validation loss bounded below by $0$ has an infimum.", numbers: "Validation loss bounded below by $0$ has an infimum." },
      { title: "If accuracies are below but", background: "If accuracies are below $0.93$ but reach $0.929$, the supremum can be $0.93$.", numbers: "If accuracies are below $0.93$ but reach $0.929$, the supremum can be $0.93$." },
      { title: "Binary search maintains a supremum-like", background: "Binary search maintains a supremum-like boundary; after $10$ halvings of width $1$, width is $0.0009765625$.", numbers: "Binary search maintains a supremum-like boundary; after $10$ halvings of width $1$, width is $0.0009765625$." },
      { title: "Supremum of a sequence set", background: "The set $\\{1-1/n:n\\ge1\\}$ has supremum $1$.", numbers: "The set $\\{1-1/n:n\\ge1\\}$ has supremum $1$." },
      { title: "Clipped activations in have output", background: "Clipped activations in $[-1,1]$ have output supremum at most $1$.", numbers: "Clipped activations in $[-1,1]$ have output supremum at most $1$." }
    ]
  },
  "math-04-05": {
    connectionsProse:
      "<p>Sequences list objects one at a time, so they provide a natural test for whether a set can be exhausted by counting. The rational numbers can be organized into such a list, but the real numbers in even a small interval cannot. This distinction explains why finite grids and rational approximations do not capture the full real line. The diagonal argument also introduces a proof pattern that uses an assumed list against itself.</p>",
    motivation:
      "<p>A set is countable when its elements can be assigned positions in a list. Finite sets, integers, and rational grid points fit this idea, even when the listing order takes some work. Countability is therefore a way to measure whether a collection can be searched or enumerated in sequence.</p>" +
      "<p>Cantor's diagonal argument shows that real numbers in $(0,1)$ are different. If a supposed list is given, a new decimal can be built to differ from the first entry in the first digit, the second entry in the second digit, and so on. The constructed number belongs to the interval but cannot be anywhere on the list, so no list can be complete.</p>",
    definition:
      "<p>A set is countable if it can be listed by natural-number positions; $(0,1)$ is uncountable by Cantor's diagonal construction.</p>" +
      "<p><b>Assumptions that matter:</b> the supposed list must include every number in the interval, and the new decimal is chosen to differ from the $n$th listed number in digit $n$.</p>",
    symbols: [
      { sym: "Countable", desc: "there is a bijection with $\\mathbb N$ or a subset of it" },
      { sym: "uncountable", desc: "no such listing exists" },
      { sym: "bijection", desc: "one-to-one and onto" }
    ],
    derivation: [
      { do: "Establish the step", result: "Assume every number in $(0,1)$ has been listed as decimals $x_1,x_2,\\ldots$", why: "this is the countability claim." },
      { do: "Establish the step", result: "Build a new decimal $y$ by choosing its $n$th digit different from the $n$th digit of $x_n$", why: "diagonal choice." },
      { do: "Establish the step", result: "Then $y\\ne x_n$ for every $n$ because it differs in digit $n$", why: "no listed entry equals $y$." },
      { do: "Establish the step", result: "But $y\\in(0,1)$", why: "the list missed a real number in the interval." },
      { do: "Establish the step", result: "Therefore $(0,1)$ is uncountable", why: "the original listing assumption is false." }
    ],
    applications: [
      { title: "Integers are countable by listing", background: "Integers are countable by listing $0,1,-1,2,-2,\\ldots$.", numbers: "Integers are countable by listing $0,1,-1,2,-2,\\ldots$." },
      { title: "Rational grid points are countable", background: "Rational grid points are countable, so a finite-precision model searches a countable subset.", numbers: "Rational grid points are countable, so a finite-precision model searches a countable subset." },
      { title: "Real-valued weights form an uncountable", background: "Real-valued weights form an uncountable space.", numbers: "Real-valued weights form an uncountable space." },
      { title: "A vocabulary of tokens is", background: "A vocabulary of $50{,}000$ tokens is finite and countable.", numbers: "A vocabulary of $50{,}000$ tokens is finite and countable." },
      { title: "Binary strings of length number", background: "Binary strings of length $10$ number $2^{10}=1024$.", numbers: "Binary strings of length $10$ number $2^{10}=1024$." },
      { title: "All infinite binary sequences are", background: "All infinite binary sequences are uncountable by the same diagonal argument.", numbers: "All infinite binary sequences are uncountable by the same diagonal argument." }
    ]
  },
  "math-04-06": {
    connectionsProse:
      "<p>Sequences are the basic objects used to describe limiting processes. They appear whenever a value changes by step number: iterations of an algorithm, sample sizes, partial sums, or checkpoints in training. Real analysis studies sequences first because many later ideas reduce to controlling what happens far out in the index. Geometric sequences provide the cleanest model for convergence.</p>",
    motivation:
      "<p>A sequence packages a changing quantity as $a_1,a_2,a_3,\\ldots$. The index can represent time, iteration number, sample size, or position in a construction. This makes sequences the natural first setting for convergence.</p>" +
      "<p>The geometric sequence $r^n$ captures the core behavior of repeated shrinkage. When $|r|<1$, each step multiplies size by a fixed factor below one. Logarithms identify how far out in the sequence we must go to make the term smaller than any chosen tolerance.</p>",
    definition:
      "<p>A sequence is an indexed list $a_1,a_2,a_3,\\ldots$; the geometric sequence $a_n=r^n$ converges to zero when $|r|<1$.</p>" +
      "<p>$$r^n\\to0\\qquad(|r|<1).$$</p>" +
      "<p><b>Assumptions that matter:</b> choose $N$ after the tolerance $\\varepsilon$ is given, and require $0<|r|<1$ for the logarithmic cutoff.</p>",
    symbols: [
      { sym: "$a_n$", desc: "the $n$th term" },
      { sym: "$n\\in\\mathbb N$", desc: "the index" },
      { sym: "$r$", desc: "the common ratio" },
      { sym: "$\\lim a_n$", desc: "the sequence limit" }
    ],
    derivation: [
      { do: "Establish the step", result: "Define $a_n=r^n$ with $|r|<1$", why: "this is the basic geometric sequence." },
      { do: "Given $\\varepsilon>0$", result: "choose $N>\\log(\\varepsilon)/\\log(|r|)$", why: "logarithms solve $|r|^N<\\varepsilon$ because $0<|r|<1$." },
      { do: "For $n\\ge N$", result: "$|a_n|=|r|^n\\le |r|^N<\\varepsilon$", why: "later terms are smaller." },
      { do: "Establish the step", result: "Therefore $r^n\\to0$", why: "the sequence converges to zero." }
    ],
    applications: [
      { title: "Learning-rate decay gives ", background: "Learning-rate decay $0.9^n$ gives $0.9^{10}\\approx0.3487$.", numbers: "Learning-rate decay $0.9^n$ gives $0.9^{10}\\approx0.3487$." },
      { title: "Running error is below after", background: "Running error $1/n$ is below $0.01$ after $n\\ge101$.", numbers: "Running error $1/n$ is below $0.01$ after $n\\ge101$." },
      { title: "Alternating signs form a sequence", background: "Alternating signs $(-1)^n$ form a sequence that does not converge.", numbers: "Alternating signs $(-1)^n$ form a sequence that does not converge." },
      { title: "Momentum decay ", background: "Momentum decay $0.5^8=0.00390625$.", numbers: "Momentum decay $0.5^8=0.00390625$." },
      { title: "Validation checkpoints form a finite", background: "Validation checkpoints form a finite prefix such as $a_1,\\ldots,a_{20}$.", numbers: "Validation checkpoints form a finite prefix such as $a_1,\\ldots,a_{20}$." },
      { title: "Batch mean estimates often behave", background: "Batch mean estimates often behave like a sequence approaching a population mean.", numbers: "Batch mean estimates often behave like a sequence approaching a population mean." }
    ]
  },
  "math-04-07": {
    connectionsProse:
      "<p>Limits of sequences make the phrase “approaches a value” precise. The definition separates early behavior from eventual behavior, which is why it fits iterative processes so well. Once a cutoff index is chosen, every later term must stay within the requested error band. This epsilon-and-$N$ pattern becomes the model for Cauchy sequences, series, and function limits.</p>",
    motivation:
      "<p>The limit definition is designed to ignore finitely many early terms. A sequence may start irregularly, but convergence only asks what happens after a sufficiently late cutoff. For every allowed error band, all later terms must remain inside that band.</p>" +
      "<p>In the proof that $1/n\\to0$, the tolerance $\\varepsilon$ is chosen first. The job is then to find a cutoff $N$ large enough that every reciprocal after that point is below $\\varepsilon$. This order of choices is the main discipline of epsilon proofs.</p>",
    definition:
      "<p>A sequence $a_n$ converges to $L$ when every error tolerance is eventually met.</p>" +
      "<p>$$\\forall\\varepsilon>0\\ \\exists N\\ \\text{such that}\\ n\\ge N\\Rightarrow |a_n-L|<\\varepsilon.$$</p>" +
      "<p><b>Assumptions that matter:</b> $\\varepsilon$ is chosen first, then $N$ must work for every later index.</p>",
    symbols: [
      { sym: "$\\varepsilon$", desc: "the allowed error" },
      { sym: "$N$", desc: "the cutoff index" },
      { sym: "$L$", desc: "the proposed limit" },
      { sym: "$|a_n-L|$", desc: "the distance to the limit" }
    ],
    derivation: [
      { do: "Establish the step", result: "To prove $1/n\\to0$, start with an arbitrary $\\varepsilon>0$", why: "the error tolerance is chosen before $N$." },
      { do: "Establish the step", result: "Choose $N>1/\\varepsilon$", why: "this makes the reciprocal smaller than the tolerance." },
      { do: "If $n\\ge N$", result: "then $|1/n-0|=1/n\\le1/N<\\varepsilon$", why: "every later term is inside the band." },
      { do: "Establish the step", result: "Since the choice works for every $\\varepsilon>0$, $\\lim_{n\\to\\infty}1/n=0$", why: "this is the definition." }
    ],
    applications: [
      { title: "For , choose ", background: "For $1/n<0.001$, choose $N=1001$.", numbers: "For $1/n<0.001$, choose $N=1001$." },
      { title: "For , choose ", background: "For $2/n<0.01$, choose $N=201$.", numbers: "For $2/n<0.01$, choose $N=201$." },
      { title: "The sequence converges to ", background: "The sequence $4+1/n$ converges to $4$; with $\\varepsilon=0.1$, $N=11$ works.", numbers: "The sequence $4+1/n$ converges to $4$; with $\\varepsilon=0.1$, $N=11$ works." },
      { title: "SGD noise averages can be", background: "SGD noise averages can be modeled by $1/\\sqrt n$; to get below $0.05$, need $n>400$.", numbers: "SGD noise averages can be modeled by $1/\\sqrt n$; to get below $0.05$, need $n>400$." },
      { title: "after ", background: "$0.8^n<0.01$ after $n\\ge21$.", numbers: "$0.8^n<0.01$ after $n\\ge21$." },
      { title: "A nonconvergent oscillation stays distance", background: "A nonconvergent oscillation $(-1)^n$ stays distance $2$ between adjacent signs.", numbers: "A nonconvergent oscillation $(-1)^n$ stays distance $2$ between adjacent signs." }
    ]
  },
  "math-04-08": {
    connectionsProse:
      "<p>Subsequences let us inspect selected parts of a sequence without changing their order. They are useful when the full sequence has complicated behavior but some hidden tail pattern is still stable. The basic compatibility result says that a convergent sequence passes its limit to every subsequence. Later compactness arguments will run in the opposite direction by extracting convergent subsequences from bounded data.</p>",
    motivation:
      "<p>Sometimes a sequence contains several behaviors interleaved with one another. A subsequence selects one ordered stream from the original sequence, such as only even terms or only saved checkpoints. The selected indices must keep increasing so that the subsequence still moves forward through the original sequence.</p>" +
      "<p>If the full sequence already converges, every subsequence must inherit the same limit. The reason is simple: selected late indices eventually pass any cutoff that works for the original sequence. This result is later paired with compactness, where one proves convergence by finding a well-behaved subsequence.</p>",
    definition:
      "<p>A subsequence $a_{n_k}$ selects terms from a sequence using increasing indices; every subsequence of a convergent sequence has the same limit.</p>" +
      "<p><b>Assumptions that matter:</b> the index sequence satisfies $n_k\\to\\infty$, so selected indices eventually pass any cutoff for the original sequence.</p>",
    symbols: [
      { sym: "$n_k$", desc: "an increasing sequence of indices" },
      { sym: "$a_{n_k}$", desc: "the selected term" },
      { sym: "$K$", desc: "the subsequence cutoff" }
    ],
    derivation: [
      { do: "Establish the step", result: "Let $a_n\\to L$ and let $a_{n_k}$ be a subsequence with $n_k\\to\\infty$", why: "selected indices still go late." },
      { do: "Given $\\varepsilon>0$", result: "choose $N$ so $n\\ge N$ implies $|a_n-L|<\\varepsilon$", why: "use convergence of the full sequence." },
      { do: "Establish the step", result: "Choose $K$ so $n_k\\ge N$ whenever $k\\ge K$", why: "subsequence indices eventually pass the cutoff." },
      { do: "Establish the step", result: "Then $|a_{n_k}-L|<\\varepsilon$ for $k\\ge K$", why: "the subsequence has the same limit." }
    ],
    applications: [
      { title: "Even terms of are and", background: "Even terms of $(-1)^n$ are $1$ and converge to $1$.", numbers: "Even terms of $(-1)^n$ are $1$ and converge to $1$." },
      { title: "Odd terms of are and", background: "Odd terms of $(-1)^n$ are $-1$ and converge to $-1$.", numbers: "Odd terms of $(-1)^n$ are $-1$ and converge to $-1$." },
      { title: "Checkpoints every epochs form ", background: "Checkpoints every $5$ epochs form $a_5,a_{10},a_{15},\\ldots$.", numbers: "Checkpoints every $5$ epochs form $a_5,a_{10},a_{15},\\ldots$." },
      { title: "If , the subsequence still", background: "If $a_n=1/n$, the subsequence $a_{2k}=1/(2k)$ still converges to $0$.", numbers: "If $a_n=1/n$, the subsequence $a_{2k}=1/(2k)$ still converges to $0$." },
      { title: "A validation curve with two", background: "A validation curve with two subsequential limits signals nonconvergence.", numbers: "A validation curve with two subsequential limits signals nonconvergence." },
      { title: "From epochs, saving every th", background: "From $32$ epochs, saving every $4$th gives $8$ subsequence terms.", numbers: "From $32$ epochs, saving every $4$th gives $8$ subsequence terms." }
    ]
  },
  "math-04-09": {
    connectionsProse:
      "<p>Bolzano-Weierstrass is the first major compactness result for sequences on the real line. It says that boundedness prevents a sequence from avoiding all limiting behavior. Even if the full sequence does not converge, some ordered selection of terms must settle down. The proof links interval bisection, nested control, Cauchy behavior, and completeness.</p>",
    motivation:
      "<p>Boundedness confines a sequence to a finite interval, but it does not force the entire sequence to converge. The sequence $(-1)^n$ stays bounded and still oscillates forever. Bolzano-Weierstrass says that boundedness at least forces some subsequence to converge.</p>" +
      "<p>The proof repeatedly halves an interval that contains infinitely many terms. At each stage, one half must still contain infinitely many terms, so a later sequence term can be chosen inside it. The nested intervals shrink to length zero, making the chosen subsequence Cauchy and then convergent by completeness of $\\mathbb R$.</p>",
    definition:
      "<p>Bolzano-Weierstrass says every bounded real sequence has a convergent subsequence.</p>" +
      "<p><b>Assumptions that matter:</b> boundedness places all terms in a finite closed interval, and completeness of $\\mathbb R$ supplies the subsequential limit.</p>",
    symbols: [
      { sym: "Bounded", desc: "$a_n\\in[a,b]$" },
      { sym: "subsequence", desc: "$a_{n_k}$ with increasing $n_k$" },
      { sym: "nested intervals", desc: "intervals contained in previous ones" }
    ],
    derivation: [
      { do: "Establish the step", result: "Place the bounded sequence inside a closed interval $[a,b]$", why: "boundedness supplies finite walls." },
      { do: "Establish the step", result: "Split the interval in half", why: "at least one half contains infinitely many terms." },
      { do: "Establish the step", result: "Keep that half and choose one sequence term inside it after the previously chosen index", why: "this builds a subsequence." },
      { do: "Establish the step", result: "Repeat the halving", why: "the nested intervals have lengths $(b-a)/2^k$." },
      { do: "Establish the step", result: "The chosen subsequence is Cauchy because later terms lie in the same tiny interval", why: "interval lengths go to zero." },
      { do: "Establish the step", result: "Completeness of $\\mathbb R$ gives a limit", why: "the subsequence converges." }
    ],
    applications: [
      { title: "Any sequence in has a", background: "Any sequence in $[0,1]$ has a convergent subsequence.", numbers: "Any sequence in $[0,1]$ has a convergent subsequence." },
      { title: "For values in , after", background: "For values in $[-1,1]$, after $10$ bisections interval width is $2/2^{10}=0.001953125$.", numbers: "For values in $[-1,1]$, after $10$ bisections interval width is $2/2^{10}=0.001953125$." },
      { title: "Bounded validation losses have subsequential", background: "Bounded validation losses have subsequential limits.", numbers: "Bounded validation losses have subsequential limits." },
      { title: "Embeddings clipped to norm at", background: "Embeddings clipped to norm at most $1$ have convergent coordinate subsequences.", numbers: "Embeddings clipped to norm at most $1$ have convergent coordinate subsequences." },
      { title: "The sequence has subsequences converging", background: "The sequence $(-1)^n$ has subsequences converging to $1$ and $-1$.", numbers: "The sequence $(-1)^n$ has subsequences converging to $1$ and $-1$." },
      { title: "Compactness arguments in ML often", background: "Compactness arguments in ML often start by extracting a convergent subsequence from bounded parameters.", numbers: "Compactness arguments in ML often start by extracting a convergent subsequence from bounded parameters." }
    ]
  },
  "math-04-10": {
    connectionsProse:
      "<p>Cauchy sequences shift attention from distance to an unknown limit to distance among late terms. This is useful because many algorithms can certify that successive or late iterates are close before the exact destination is known. In the real numbers, the completeness of the space turns that internal crowding into actual convergence. The proof uses boundedness, Bolzano-Weierstrass, and the triangle inequality together.</p>",
    motivation:
      "<p>A usual limit proof compares each late term with a known number $L$. A Cauchy proof compares late terms with one another instead. This is especially useful when the eventual limit is hard to name but the tail of the process is visibly settling.</p>" +
      "<p>In $\\mathbb R$, late-term crowding is enough. A Cauchy sequence first becomes bounded, so Bolzano-Weierstrass supplies a convergent subsequence. The Cauchy property then pulls the whole tail close to that subsequential limit, proving that the entire sequence converges.</p>",
    definition:
      "<p>A sequence is Cauchy when late terms are close to one another: for every $\\varepsilon>0$ there is $N$ such that $m,n\\ge N$ implies $|a_m-a_n|<\\varepsilon$.</p>" +
      "<p><b>Assumptions that matter:</b> in $\\mathbb R$, completeness turns the Cauchy property into convergence.</p>",
    symbols: [
      { sym: "Cauchy", desc: "late terms are close to each other" },
      { sym: "$m,n$", desc: "two late indices" },
      { sym: "$L$", desc: "the eventual limit" },
      { sym: "$N$", desc: "the cutoff" }
    ],
    derivation: [
      { do: "Establish the step", result: "Assume $(a_n)$ is Cauchy", why: "late terms are close to each other." },
      { do: "Establish the step", result: "Choose $N_1$ so $m,n\\ge N_1$ implies $|a_m-a_n|<1$", why: "the tail is bounded near $a_{N_1}$." },
      { do: "Establish the step", result: "The finite initial segment plus the bounded tail makes the whole sequence bounded", why: "finitely many early terms have a maximum size." },
      { do: "Establish the step", result: "Bolzano–Weierstrass gives a convergent subsequence $a_{n_k}\\to L$", why: "bounded real sequences have convergent subsequences." },
      { do: "Given $\\varepsilon>0$", result: "choose $N_2$ so $m,n\\ge N_2$ implies $|a_m-a_n|<\\varepsilon/2$", why: "use the Cauchy property." },
      { do: "Establish the step", result: "Choose $k$ with $n_k\\ge N_2$ and $|a_{n_k}-L|<\\varepsilon/2$", why: "use subsequence convergence." },
      { do: "For $n\\ge N_2$", result: "$|a_n-L|\\le |a_n-a_{n_k}|+|a_{n_k}-L|<\\varepsilon$", why: "triangle inequality closes the proof." }
    ],
    applications: [
      { title: "For , gives ", background: "For $a_n=1/n$, $m,n\\ge200$ gives $|a_m-a_n|\\le1/200<0.01$.", numbers: "For $a_n=1/n$, $m,n\\ge200$ gives $|a_m-a_n|\\le1/200<0.01$." },
      { title: "The partial sums of are", background: "The partial sums of $\\sum2^{-n}$ are Cauchy because the tail after $N$ is $2^{-N}$.", numbers: "The partial sums of $\\sum2^{-n}$ are Cauchy because the tail after $N$ is $2^{-N}$." },
      { title: "Floating-point iteration can stop when", background: "Floating-point iteration can stop when all last $5$ iterates differ by less than $10^{-6}$.", numbers: "Floating-point iteration can stop when all last $5$ iterates differ by less than $10^{-6}$." },
      { title: "is not Cauchy because even", background: "$(-1)^n$ is not Cauchy because even and odd late terms differ by $2$.", numbers: "$(-1)^n$ is not Cauchy because even and odd late terms differ by $2$." },
      { title: "A contraction with has tail", background: "A contraction with $q=0.5$ has tail bound $2^{-10}/(1-0.5)=0.001953125$ after $10$ steps.", numbers: "A contraction with $q=0.5$ has tail bound $2^{-10}/(1-0.5)=0.001953125$ after $10$ steps." },
      { title: "Completeness says a Cauchy parameter", background: "Completeness says a Cauchy parameter sequence in $\\mathbb R^d$ has a real limit vector.", numbers: "Completeness says a Cauchy parameter sequence in $\\mathbb R^d$ has a real limit vector." }
    ]
  },
  "math-04-11": {
    connectionsProse:
      "<p>Infinite series are sequences built from running totals. Instead of asking whether individual terms exist, analysis asks whether the partial sums approach a finite value. Geometric series are the central example because their finite sums can be computed exactly and their tails have explicit bounds. Those bounds will reappear in convergence tests and contraction arguments.</p>",
    motivation:
      "<p>An expression with infinitely many additions is understood through finite partial sums. The $N$th partial sum is an ordinary finite number, so convergence of a series is really convergence of the sequence of those sums. This keeps infinite addition within the earlier theory of sequences.</p>" +
      "<p>The geometric series is the model case because its partial sums telescope after multiplying by the ratio. The finite formula shows exactly what remains: a power of $r$. When $|r|<1$, that remaining term tends to zero, leaving the closed form for the infinite sum.</p>",
    definition:
      "<p>An infinite series converges when its partial sums have a finite limit; for $|r|<1$, the geometric series has sum $1/(1-r)$.</p>" +
      "<p>$$\\sum_{n=0}^\\infty r^n=\\frac1{1-r}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the formula follows from finite partial sums before taking the limit.</p>",
    symbols: [
      { sym: "$S_N$", desc: "the $N$th partial sum" },
      { sym: "$r$", desc: "the ratio" },
      { sym: "convergence", desc: "$S_N$ has a finite limit" }
    ],
    derivation: [
      { do: "Establish the step", result: "Define $S_N=\\sum_{n=0}^{N}r^n$", why: "partial sums make the infinite sum finite first." },
      { do: "Multiply by $r$", result: "$rS_N=r+r^2+\\cdots+r^{N+1}$", why: "shift the same terms." },
      { do: "Subtract", result: "$(1-r)S_N=1-r^{N+1}$", why: "all middle terms cancel." },
      { do: "Divide", result: "$S_N=(1-r^{N+1})/(1-r)$", why: "solve the finite identity." },
      { do: "If $|r|<1$", result: "then $r^{N+1}\\to0$", why: "geometric sequences decay." },
      { do: "Establish the step", result: "Therefore $\\sum_{n=0}^\\infty r^n=1/(1-r)$", why: "the partial sums converge." }
    ],
    applications: [
      { title: "Application", background: "$\\sum_{n=0}^\\infty(1/2)^n=2$.", numbers: "$\\sum_{n=0}^\\infty(1/2)^n=2$." },
      { title: "The first terms sum to", background: "The first $10$ terms sum to $1.998046875$.", numbers: "The first $10$ terms sum to $1.998046875$." },
      { title: "The remaining tail after terms", background: "The remaining tail after $10$ terms is $0.001953125$.", numbers: "The remaining tail after $10$ terms is $0.001953125$." },
      { title: "Telescoping ", background: "Telescoping $\\sum_{n=1}^{10}1/(n(n+1))=10/11\\approx0.90909$.", numbers: "Telescoping $\\sum_{n=1}^{10}1/(n(n+1))=10/11\\approx0.90909$." },
      { title: "Discounted reward with and reward", background: "Discounted reward with $\\gamma=0.9$ and reward $1$ has value $10$.", numbers: "Discounted reward with $\\gamma=0.9$ and reward $1$ has value $10$." },
      { title: "A residual series with terms", background: "A residual series with terms $0.1^n$ sums to $1/(1-0.1)=1.111\\ldots$.", numbers: "A residual series with terms $0.1^n$ sums to $1/(1-0.1)=1.111\\ldots$." }
    ]
  },
  "math-04-12": {
    connectionsProse:
      "<p>Convergence tests are tools for deciding whether an infinite series has a finite sum without computing the sum directly. The ratio test compares late terms to a geometric pattern, which is already known to converge when the ratio is below one. This turns a difficult tail into a familiar tail estimate. The same comparison logic supports error bounds in numerical methods and power series.</p>",
    motivation:
      "<p>Most series do not come with a simple closed form for partial sums. Convergence tests solve a different problem: they decide whether the tail is small enough to settle. The ratio test works when late terms shrink at least as fast as a geometric sequence.</p>" +
      "<p>Once the ratio is bounded by $r<1$, every later term is controlled by repeated multiplication by $r$. The tail is then no larger than a geometric tail, which is already known to converge. This proves absolute convergence because the comparison is made with absolute values.</p>",
    definition:
      "<p>The ratio test proves absolute convergence when late term ratios are bounded by a fixed $r<1$.</p>" +
      "<p>$$|a_{n+1}/a_n|\\le r<1.$$</p>" +
      "<p><b>Assumptions that matter:</b> the ratio bound only needs to hold after some cutoff, and comparison is made with absolute values.</p>",
    symbols: [
      { sym: "$a_n$", desc: "the $n$th term" },
      { sym: "$r$", desc: "a comparison ratio below $1$" },
      { sym: "absolute convergence", desc: "$\\sum |a_n|$ converges" }
    ],
    derivation: [
      { do: "Establish the step", result: "Suppose $|a_{n+1}/a_n|\\le r<1$ for all large $n$", why: "this is the ratio-test hypothesis after some cutoff." },
      { do: "Establish the step", result: "Then $|a_{N+k}|\\le |a_N|r^k$", why: "apply the inequality repeatedly." },
      { do: "Establish the step", result: "The tail is bounded by $|a_N|\\sum_{k=0}^\\infty r^k=|a_N|/(1-r)$", why: "compare with a geometric series." },
      { do: "Establish the step", result: "Geometric tails go to zero as the starting index grows", why: "the series is Cauchy." },
      { do: "Establish the step", result: "Therefore the series converges absolutely", why: "absolute convergence follows from the comparison." }
    ],
    applications: [
      { title: "For , the ratio is", background: "For $a_n=2^{-n}$, the ratio is $1/2$, so the series converges.", numbers: "For $a_n=2^{-n}$, the ratio is $1/2$, so the series converges." },
      { title: "For , ratio tends to", background: "For $a_n=n!/n^n$, ratio tends to $1/e<1$.", numbers: "For $a_n=n!/n^n$, ratio tends to $1/e<1$." },
      { title: "For , ratio tends to", background: "For $a_n=1/n$, ratio tends to $1$, so the test is inconclusive.", numbers: "For $a_n=1/n$, ratio tends to $1$, so the test is inconclusive." },
      { title: "Root test on gives root", background: "Root test on $3^{-n}$ gives root limit $1/3$.", numbers: "Root test on $3^{-n}$ gives root limit $1/3$." },
      { title: "Tail of a ratio- series", background: "Tail of a ratio-$1/2$ series after $10$ is at most $0.001953125$ when the next scale is $2^{-10}$.", numbers: "Tail of a ratio-$1/2$ series after $10$ is at most $0.001953125$ when the next scale is $2^{-10}$." },
      { title: "Power-series coefficients with root limit", background: "Power-series coefficients with root limit $3$ give radius $1/3$.", numbers: "Power-series coefficients with root limit $3$ give radius $1/3$." }
    ]
  },
  "math-04-13": {
    connectionsProse:
      "<p>Signed series can converge because positive and negative terms cancel. Absolute convergence separates safe convergence from convergence that depends on a delicate order of cancellation. If the absolute values have a finite sum, every signed tail is automatically controlled. Conditional convergence is weaker and therefore requires more care in rearrangement and accumulation.</p>",
    motivation:
      "<p>Positive and negative terms can cancel, and cancellation can make a series converge even when the magnitudes alone are too large. Absolute convergence removes the signs and asks for a stronger kind of convergence. If that stronger condition holds, the original signed series is safe.</p>" +
      "<p>The triangle inequality is the key estimate. Any signed tail has magnitude no larger than the corresponding tail of absolute values. If the absolute-value series has tails tending to zero, the signed partial sums are Cauchy, and completeness gives convergence.</p>",
    definition:
      "<p>A series is absolutely convergent when $\\sum |a_n|$ converges, and conditionally convergent when $\\sum a_n$ converges but $\\sum |a_n|$ diverges.</p>" +
      "<p><b>Assumptions that matter:</b> the triangle inequality controls signed tails by absolute-value tails.</p>",
    symbols: [
      { sym: "$a_n$", desc: "signed terms" },
      { sym: "$|a_n|$", desc: "removes signs" },
      { sym: "conditional", desc: "$\\sum a_n$ converges but $\\sum|a_n|$ diverges" }
    ],
    derivation: [
      { do: "If $\\sum |a_n|$ converges", result: "then for $m>n$, $|\\sum_{k=n}^m a_k|\\le\\sum_{k=n}^m |a_k|$", why: "triangle inequality." },
      { do: "Establish the step", result: "The absolute-value tail goes to zero", why: "convergence of $\\sum|a_n|$ makes its tails small." },
      { do: "Establish the step", result: "Therefore the original partial sums are Cauchy", why: "every signed tail is small." },
      { do: "Establish the step", result: "In $\\mathbb R$, Cauchy partial sums converge", why: "completeness finishes absolute convergence." },
      { do: "For $\\sum(-1)^{n+1}/n$", result: "alternating monotone terms go to $0$", why: "Leibniz gives convergence." },
      { do: "Establish the step", result: "But $\\sum1/n$ diverges", why: "the convergence is conditional." }
    ],
    applications: [
      { title: "is conditional", background: "$\\sum(-1)^{n+1}/n$ is conditional.", numbers: "$\\sum(-1)^{n+1}/n$ is conditional." },
      { title: "Its first terms sum to", background: "Its first $6$ terms sum to $0.616666\\ldots$.", numbers: "Its first $6$ terms sum to $0.616666\\ldots$." },
      { title: "is absolute because converges", background: "$\\sum(-1)^n/n^2$ is absolute because $\\sum1/n^2$ converges.", numbers: "$\\sum(-1)^n/n^2$ is absolute because $\\sum1/n^2$ converges." },
      { title: "Dropout-style signed corrections need absolute", background: "Dropout-style signed corrections need absolute bounds for order-safe accumulation.", numbers: "Dropout-style signed corrections need absolute bounds for order-safe accumulation." },
      { title: "Alternating-series error after terms is", background: "Alternating-series error after $N$ terms is at most the next term; after $100$ terms it is below $1/101$.", numbers: "Alternating-series error after $N$ terms is at most the next term; after $100$ terms it is below $1/101$." },
      { title: "Rearranging a conditional series can", background: "Rearranging a conditional series can change its sum, so deterministic accumulation order matters.", numbers: "Rearranging a conditional series can change its sum, so deterministic accumulation order matters." }
    ]
  },
  "math-04-14": {
    connectionsProse:
      "<p>Function limits extend the sequence-limit idea from late indices to nearby inputs. The key relationship is between an output tolerance and an input tolerance. An epsilon-delta proof records exactly how close the input must be to force the desired output closeness. This is the language needed for continuity, derivatives, and stability.</p>",
    motivation:
      "<p>For functions, closeness is controlled near an input value rather than far out in an index. The epsilon-delta definition asks for an input radius that guarantees an output tolerance. This makes the idea of approaching a point independent of whether the function is defined at the point itself.</p>" +
      "<p>The proof for $x^2$ at $2$ shows the standard pattern. Factor the output error into a controllable input error and a nearby bounded factor. A preliminary bound such as $|x-2|<1$ keeps the extra factor under control, and the final choice of $\\delta$ satisfies both needs.</p>",
    definition:
      "<p>The function limit $\\lim_{x\\to a}f(x)=L$ means every output tolerance has an input radius that forces $f(x)$ close to $L$ whenever $0<|x-a|<\\delta$.</p>" +
      "<p>$$0<|x-a|<\\delta\\Rightarrow |f(x)-L|<\\varepsilon.$$</p>" +
      "<p><b>Assumptions that matter:</b> $x$ approaches $a$ but need not equal $a$.</p>",
    symbols: [
      { sym: "$\\varepsilon$", desc: "output tolerance" },
      { sym: "$\\delta$", desc: "input tolerance" },
      { sym: "$x\\to a$", desc: "$x$ approaches but need not equal $a$" }
    ],
    derivation: [
      { do: "Establish the step", result: "To prove $\\lim_{x\\to2}x^2=4$, start with $|x^2-4|=|x-2||x+2|$", why: "factor the error." },
      { do: "Establish the step", result: "Require $|x-2|<1$", why: "this keeps $x\\in(1,3)$." },
      { do: "Establish the step", result: "Then $|x+2|<5$", why: "local input control bounds the extra factor." },
      { do: "Establish the step", result: "Choose $\\delta=\\min(1,\\varepsilon/5)$", why: "this handles both requirements." },
      { do: "If $0<|x-2|<\\delta$", result: "then $|x^2-4|<5\\delta\\le\\varepsilon$", why: "the output error is controlled." }
    ],
    applications: [
      { title: "For at with , choose", background: "For $x^2$ at $2$ with $\\varepsilon=0.01$, choose $\\delta=0.002$.", numbers: "For $x^2$ at $2$ with $\\varepsilon=0.01$, choose $\\delta=0.002$." },
      { title: "For at , works", background: "For $3x+1$ at $2$, $\\delta=\\varepsilon/3$ works.", numbers: "For $3x+1$ at $2$, $\\delta=\\varepsilon/3$ works." },
      { title: "Numerical stability of a feature", background: "Numerical stability of a feature transform asks for this input-output control.", numbers: "Numerical stability of a feature transform asks for this input-output control." },
      { title: "Clipping a score near a", background: "Clipping a score near a threshold uses a chosen $\\delta$ margin.", numbers: "Clipping a score near a threshold uses a chosen $\\delta$ margin." },
      { title: "A discontinuous step fails because", background: "A discontinuous step fails because outputs differ by $1$ arbitrarily near $0$.", numbers: "A discontinuous step fails because outputs differ by $1$ arbitrarily near $0$." },
      { title: "For at , , so", background: "For $\\sin x$ at $0$, $|\\sin x|\\le |x|$, so $\\delta=\\varepsilon$ works.", numbers: "For $\\sin x$ at $0$, $|\\sin x|\\le |x|$, so $\\delta=\\varepsilon$ works." }
    ]
  },
  "math-04-15": {
    connectionsProse:
      "<p>Continuity adds the actual value of the function to the limit idea. A function is continuous at a point when nearby inputs have values near the function value at that point. This makes small perturbations predictable and rules out jumps. The proof for $x^2$ follows the same factor-and-bound pattern as the function-limit proof.</p>",
    motivation:
      "<p>Continuity at a point is a limit statement tied to the function's actual value. The input is allowed to move slightly, and the output must remain close to $f(a)$. This turns nearby-input behavior into a local stability guarantee.</p>" +
      "<p>For $x^2$ at $2$, the same algebra used in the limit proof applies. The expression $|x^2-4|$ factors into $|x-2||x+2|$, so the input distance can be made small while $|x+2|$ is bounded locally. The result is a concrete $\\delta$ that proves continuity at the point.</p>",
    definition:
      "<p>A function $f$ is continuous at $a$ when nearby inputs have values near $f(a)$.</p>" +
      "<p>$$|x-a|<\\delta\\Rightarrow |f(x)-f(a)|<\\varepsilon.$$</p>" +
      "<p><b>Assumptions that matter:</b> the function value at $a$ is included, so the limit must match $f(a)$.</p>",
    symbols: [
      { sym: "$f(a)$", desc: "the actual function value" },
      { sym: "continuity at $a$", desc: "limit and value match" },
      { sym: "$\\delta$", desc: "may depend on $a$ and $\\varepsilon$" }
    ],
    derivation: [
      { do: "Establish the step", result: "A function $f$ is continuous at $a$ when for every $\\varepsilon>0$ there is $\\delta>0$ with $|x-a|<\\delta\\Rightarrow |f(x)-f(a)|<\\varepsilon$", why: "this is the definition." },
      { do: "For $f(x)=x^2$ at $a=2$", result: "rewrite $|f(x)-f(2)|=|x-2||x+2|$", why: "reduce to the limit proof." },
      { do: "Establish the step", result: "Keep $|x-2|<1$, so $|x+2|<5$", why: "bound the local factor." },
      { do: "Establish the step", result: "Choose $\\delta=\\min(1,\\varepsilon/5)$", why: "a single input radius works." },
      { do: "Establish the step", result: "Therefore $x^2$ is continuous at $2$", why: "the limit equals the value." }
    ],
    applications: [
      { title: "ReLU is continuous at because", background: "ReLU is continuous at $0$ because both one-sided values approach $0$.", numbers: "ReLU is continuous at $0$ because both one-sided values approach $0$." },
      { title: "A step activation is not", background: "A step activation is not continuous at $0$ because the jump size is $1$.", numbers: "A step activation is not continuous at $0$ because the jump size is $1$." },
      { title: "at uses for ", background: "$x^2$ at $2$ uses $\\delta=0.002$ for $\\varepsilon=0.01$.", numbers: "$x^2$ at $2$ uses $\\delta=0.002$ for $\\varepsilon=0.01$." },
      { title: "Continuous loss curves make small", background: "Continuous loss curves make small parameter perturbations predictable.", numbers: "Continuous loss curves make small parameter perturbations predictable." },
      { title: "Bilinear interpolation changes continuously across", background: "Bilinear interpolation changes continuously across pixels.", numbers: "Bilinear interpolation changes continuously across pixels." },
      { title: "A polynomial feature map is", background: "A polynomial feature map is continuous at every real input.", numbers: "A polynomial feature map is continuous at every real input." }
    ]
  },
  "math-04-16": {
    connectionsProse:
      "<p>Continuous functions on intervals carry local smoothness into global information. The intermediate value theorem says they cannot jump over a value, and the extreme value theorem says they attain maxima and minima on closed bounded intervals. Both results rely on completeness and compactness ideas from earlier lessons. They are basic tools for root finding, optimization, and calibration.</p>",
    motivation:
      "<p>A continuous function on an interval cannot jump from one side of a value to the other without reaching it. That is the content of the intermediate value theorem. It turns the geometric picture of an unbroken graph into a proof using suprema.</p>" +
      "<p>Extreme values require a different global guarantee. On a closed bounded interval, sequences of nearly maximal values have convergent subsequences, and the limit remains in the interval. Continuity carries the function values to the limit, so the supremum is actually attained.</p>",
    definition:
      "<p>The intermediate value theorem says a continuous function on $[a,b]$ reaches every value between $f(a)$ and $f(b)$; the extreme value theorem says it attains maxima and minima on closed bounded intervals.</p>" +
      "<p><b>Assumptions that matter:</b> continuity and the closed bounded interval are essential for the global conclusions.</p>",
    symbols: [
      { sym: "IVT", desc: "the intermediate value theorem" },
      { sym: "EVT", desc: "the extreme value theorem" },
      { sym: "$[a,b]$", desc: "a closed bounded interval" }
    ],
    derivation: [
      { do: "For the intermediate value theorem", result: "take $f(a)<y<f(b)$ and define $S=\\{x\\in[a,b]:f(x)<y\\}$", why: "locate the crossing from below." },
      { do: "Establish the step", result: "Let $c=\\sup S$", why: "completeness supplies the boundary point." },
      { do: "Establish the step", result: "Continuity rules out $f(c)<y$ and $f(c)>y$", why: "either inequality would persist in a small neighborhood and contradict the boundary." },
      { do: "Establish the step", result: "Therefore $f(c)=y$", why: "the function reaches the intermediate value." },
      { do: "Extreme values follow by compactness", result: "every sequence approaching the supremum of $f([a,b])$ has a convergent subsequence whose limit stays in $[a,b]$", why: "continuity carries the value to the limit." }
    ],
    applications: [
      { title: "If validation loss is continuous", background: "If validation loss is continuous and goes from $0.8$ to $0.2$, it equals $0.5$ somewhere.", numbers: "If validation loss is continuous and goes from $0.8$ to $0.2$, it equals $0.5$ somewhere." },
      { title: "A continuous score crossing from", background: "A continuous score crossing from $-1$ to $2$ has a zero.", numbers: "A continuous score crossing from $-1$ to $2$ has a zero." },
      { title: "On , attains maximum at", background: "On $[0,1]$, $x(1-x)$ attains maximum $0.25$ at $0.5$.", numbers: "On $[0,1]$, $x(1-x)$ attains maximum $0.25$ at $0.5$." },
      { title: "Calibration curves use intermediate crossing", background: "Calibration curves use intermediate crossing points.", numbers: "Calibration curves use intermediate crossing points." },
      { title: "A continuous clipped activation on", background: "A continuous clipped activation on $[-3,3]$ has a maximum and minimum.", numbers: "A continuous clipped activation on $[-3,3]$ has a maximum and minimum." },
      { title: "Binary search for a root", background: "Binary search for a root relies on sign change and IVT.", numbers: "Binary search for a root relies on sign change and IVT." }
    ]
  },
  "math-04-17": {
    connectionsProse:
      "<p>Uniform continuity strengthens ordinary continuity by using one input radius across the whole domain. This matters when a local guarantee must be applied globally, such as over an interval, a dataset domain, or a bounded parameter set. Compactness is what allows many local radii to be reduced to finite control. The result is a stable bridge from pointwise behavior to domain-wide behavior.</p>",
    motivation:
      "<p>Ordinary continuity may choose a different $\\delta$ at each point. That is enough for local reasoning but not enough when one tolerance must work over an entire domain. Uniform continuity asks for a single radius that applies everywhere.</p>" +
      "<p>Compactness provides the mechanism. The local neighborhoods supplied by continuity cover the domain, and compactness reduces this cover to finitely many neighborhoods. A finite collection can be controlled by one positive scale, giving a global $\\delta$ for the chosen $\\varepsilon$.</p>",
    definition:
      "<p>Uniform continuity means one input radius works across the whole domain.</p>" +
      "<p>$$d(x,y)<\\delta\\Rightarrow |f(x)-f(y)|<\\varepsilon\\quad\\text{for all }x,y\\in K.$$</p>" +
      "<p><b>Assumptions that matter:</b> compactness lets local continuity radii be reduced to finite global control.</p>",
    symbols: [
      { sym: "Uniform", desc: "one $\\delta$ for the whole domain" },
      { sym: "$K$", desc: "the domain" },
      { sym: "compactness", desc: "supplies finite control" }
    ],
    derivation: [
      { do: "Establish the step", result: "Suppose $f$ is continuous on compact $K$", why: "every point has its own radius for $\\varepsilon/2$." },
      { do: "Establish the step", result: "These local neighborhoods cover $K$", why: "each point is protected by continuity." },
      { do: "Establish the step", result: "Compactness gives a finite subcover", why: "finitely many local radii suffice." },
      { do: "Establish the step", result: "Let $\\delta$ be a Lebesgue-number-scale radius for that finite cover", why: "points within $\\delta$ lie in a common protected neighborhood." },
      { do: "Establish the step", result: "Then $d(x,y)<\\delta$ implies $|f(x)-f(y)|<\\varepsilon$ for all $x,y\\in K$", why: "the same radius works everywhere." }
    ],
    applications: [
      { title: "For a -Lipschitz function, guarantees", background: "For a $3$-Lipschitz function, $\\delta=0.1/3\\approx0.0333$ guarantees output error below $0.1$.", numbers: "For a $3$-Lipschitz function, $\\delta=0.1/3\\approx0.0333$ guarantees output error below $0.1$." },
      { title: "is uniformly continuous on ", background: "$x^2$ is uniformly continuous on $[0,2]$; $\\delta=\\varepsilon/4$ works from $|x+y|\\le4$.", numbers: "$x^2$ is uniformly continuous on $[0,2]$; $\\delta=\\varepsilon/4$ works from $|x+y|\\le4$." },
      { title: "is not uniformly continuous on", background: "$x^2$ is not uniformly continuous on all $\\mathbb R$.", numbers: "$x^2$ is not uniformly continuous on all $\\mathbb R$." },
      { title: "Numerical quadrature uses one mesh", background: "Numerical quadrature uses one mesh width across the interval.", numbers: "Numerical quadrature uses one mesh width across the interval." },
      { title: "A bounded-input neural layer with", background: "A bounded-input neural layer with Lipschitz constant $5$ needs input tolerance $0.002$ for output tolerance $0.01$.", numbers: "A bounded-input neural layer with Lipschitz constant $5$ needs input tolerance $0.002$ for output tolerance $0.01$." },
      { title: "Embedding drift bounded by a", background: "Embedding drift bounded by a uniform Lipschitz constant gives global stability.", numbers: "Embedding drift bounded by a uniform Lipschitz constant gives global stability." }
    ]
  },
  "math-04-18": {
    connectionsProse:
      "<p>The derivative makes local rate of change precise. It begins with slopes of secant lines, which compare two nearby function values, and then takes the limiting slope as the input gap shrinks to zero. This definition connects algebraic calculation with geometric tangent lines. It also prepares the ground for mean-value, Taylor, and optimization results.</p>",
    motivation:
      "<p>A secant slope measures average change over a nonzero input gap. As the gap shrinks, those slopes may approach a stable value. The derivative is that limiting value when it exists.</p>" +
      "<p>For $f(x)=x^2$, the difference quotient simplifies exactly. The term $2a+h$ contains the desired local rate $2a$ plus a leftover $h$ that vanishes in the limit. This calculation illustrates how a derivative extracts the linear part of local change.</p>",
    definition:
      "<p>The derivative at $a$ is the limiting secant slope as the input increment tends to zero.</p>" +
      "<p>$$f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the quotient is formed for $h\\ne0$ before taking the limit.</p>",
    symbols: [
      { sym: "$h$", desc: "the input increment" },
      { sym: "$f'(a)$", desc: "the derivative at $a$" },
      { sym: "the quotient", desc: "defined for $h\\ne0$ before the limit" }
    ],
    derivation: [
      { do: "Establish the step", result: "Start with $f(x)=x^2$ and the difference quotient $\\frac{f(a+h)-f(a)}{h}$", why: "this is the secant slope." },
      { do: "Substitute", result: "$\\frac{(a+h)^2-a^2}{h}$", why: "compute the change in $f$." },
      { do: "Expand", result: "$\\frac{2ah+h^2}{h}=2a+h$", why: "isolate the term that vanishes." },
      { do: "Establish the step", result: "Let $h\\to0$", why: "the quotient tends to $2a$." },
      { do: "Establish the step", result: "Therefore $(x^2)'\\big|_{x=a}=2a$", why: "the derivative is the limiting slope." }
    ],
    applications: [
      { title: "For at , the derivative", background: "For $x^2$ at $3$, the derivative is $6$.", numbers: "For $x^2$ at $3$, the derivative is $6$." },
      { title: "Linear approximation near $3$", background: "$(3.01)^2\\approx9+6(0.01)=9.06$.", numbers: "$(3.01)^2\\approx9+6(0.01)=9.06$." },
      { title: "For at , derivative is", background: "For $e^x$ at $0$, derivative is $1$.", numbers: "For $e^x$ at $0$, derivative is $1$." },
      { title: "Gradient checks compare finite differences", background: "Gradient checks compare finite differences with derivative values.", numbers: "Gradient checks compare finite differences with derivative values." },
      { title: "Velocity is derivative of position", background: "Velocity is derivative of position; $s=t^2$ gives velocity $2t$.", numbers: "Velocity is derivative of position; $s=t^2$ gives velocity $2t$." },
      { title: "A kinked ReLU has left", background: "A kinked ReLU has left derivative $0$ and right derivative $1$ at $0$, so no derivative there.", numbers: "A kinked ReLU has left derivative $0$ and right derivative $1$ at $0$, so no derivative there." }
    ]
  },
  "math-04-19": {
    connectionsProse:
      "<p>The Mean Value Theorem connects average change over an interval with instantaneous change at some interior point. It turns endpoint information into a derivative statement. The proof subtracts the secant line so that Rolle's theorem can find a flat point in the adjusted function. This result is a core reason derivative bounds imply Lipschitz and stability bounds.</p>",
    motivation:
      "<p>Average slope over an interval is easy to compute from endpoints, but it does not directly tell us a local derivative. The Mean Value Theorem supplies the missing link. Under continuity and differentiability assumptions, some interior point realizes that average slope as an instantaneous slope.</p>" +
      "<p>The proof removes the straight-line trend between the endpoints. After subtracting the secant line, the adjusted function has equal values at $a$ and $b$. Rolle's theorem then gives an interior point with zero adjusted derivative, which rearranges to the mean-value conclusion.</p>",
    definition:
      "<p>The Mean Value Theorem says a continuous function on $[a,b]$ that is differentiable inside has an interior point whose derivative equals the average slope.</p>" +
      "<p>$$f'(c)=\\frac{f(b)-f(a)}{b-a}.$$</p>" +
      "<p><b>Assumptions that matter:</b> continuity on the closed interval and differentiability on the open interval are required.</p>",
    symbols: [
      { sym: "$[a,b]$", desc: "the interval" },
      { sym: "$c$", desc: "the guaranteed interior point" },
      { sym: "the secant slope", desc: "average rate of change" }
    ],
    derivation: [
      { do: "For continuous $f$ on $[a,b]$ and differentiable inside", result: "define the secant line $\\ell(x)=f(a)+\\frac{f(b)-f(a)}{b-a}(x-a)$", why: "match endpoints." },
      { do: "Establish the step", result: "Let $g(x)=f(x)-\\ell(x)$", why: "subtract the straight-line trend." },
      { do: "Establish the step", result: "Then $g(a)=g(b)=0$", why: "the adjusted function has equal endpoint values." },
      { do: "Establish the step", result: "Rolle's theorem gives some $c\\in(a,b)$ with $g'(c)=0$", why: "a differentiable function returning to the same height has a flat point." },
      { do: "Establish the step", result: "Thus $f'(c)=\\frac{f(b)-f(a)}{b-a}$", why: "rearrange $g'(c)=0$." }
    ],
    applications: [
      { title: "For on , average slope", background: "For $f(x)=x^2$ on $[1,3]$, average slope is $4$, so $2c=4$ and $c=2$.", numbers: "For $f(x)=x^2$ on $[1,3]$, average slope is $4$, so $2c=4$ and $c=2$." },
      { title: "If over length , output", background: "If $|f'|\\le3$ over length $0.2$, output changes by at most $0.6$.", numbers: "If $|f'|\\le3$ over length $0.2$, output changes by at most $0.6$." },
      { title: "Since , ", background: "Since $|\\cos x|\\le1$, $|\\sin(x)-\\sin(y)|\\le |x-y|$.", numbers: "Since $|\\cos x|\\le1$, $|\\sin(x)-\\sin(y)|\\le |x-y|$." },
      { title: "Lipschitz loss bounds use derivative", background: "Lipschitz loss bounds use derivative suprema.", numbers: "Lipschitz loss bounds use derivative suprema." },
      { title: "If training loss drops over", background: "If training loss drops $0.4$ over $10$ epochs, some epoch has average slope $-0.04$ per epoch.", numbers: "If training loss drops $0.4$ over $10$ epochs, some epoch has average slope $-0.04$ per epoch." },
      { title: "MVT justifies line-search slope estimates", background: "MVT justifies line-search slope estimates.", numbers: "MVT justifies line-search slope estimates." }
    ]
  },
  "math-04-20": {
    connectionsProse:
      "<p>Taylor's theorem turns differentiability into controlled approximation. A Taylor polynomial matches a function and several derivatives at a base point, while the remainder measures what has not been captured. The theorem is useful because it does not only approximate; it gives a boundable error term. That error term is central in numerical analysis, optimization, and local model building.</p>",
    motivation:
      "<p>A polynomial is often easier to compute with than the original function. Taylor's theorem explains when a polynomial built from derivatives at a point is a valid local approximation. Matching more derivatives gives a higher-order approximation.</p>" +
      "<p>The remainder is the essential part of the theorem. It identifies the next derivative as the source of error and places it at some intermediate point. Bounding that derivative turns Taylor's formula into a practical error estimate rather than just a formal expansion.</p>",
    definition:
      "<p>Taylor's theorem approximates $f$ near $a$ by a polynomial and expresses the error through the next derivative.</p>" +
      "<p>$$P_n(x)=\\sum_{k=0}^n f^{(k)}(a)(x-a)^k/k!,\\qquad |R_n(x)|\\le M|x-a|^{n+1}/(n+1)!.$$</p>" +
      "<p><b>Assumptions that matter:</b> the needed derivatives exist, and the next derivative is bounded by $M$ for the error bound.</p>",
    symbols: [
      { sym: "$P_n$", desc: "the Taylor polynomial" },
      { sym: "$R_n$", desc: "the remainder" },
      { sym: "$\\xi$", desc: "an intermediate point" },
      { sym: "$M$", desc: "bounds the next derivative" }
    ],
    derivation: [
      { do: "Expand $f$ at $a$ through degree $n$", result: "$P_n(x)=\\sum_{k=0}^n f^{(k)}(a)(x-a)^k/k!$", why: "match derivatives at $a$." },
      { do: "Establish the step", result: "Define the error $R_n(x)=f(x)-P_n(x)$", why: "separate approximation from remainder." },
      { do: "Establish the step", result: "Repeated Rolle-style reasoning gives $R_n(x)=f^{(n+1)}(\\xi)(x-a)^{n+1}/(n+1)!$ for some $\\xi$ between $a$ and $x$", why: "the unmatched derivative controls the error." },
      { do: "If $|f^{(n+1)}|\\le M$", result: "then $|R_n(x)|\\le M|x-a|^{n+1}/(n+1)!$", why: "turn the existence form into a bound." }
    ],
    applications: [
      { title: "with order- polynomial", background: "$e^1\\approx1+1+1/2+1/6=2.666666\\ldots$ with order-$3$ polynomial.", numbers: "$e^1\\approx1+1+1/2+1/6=2.666666\\ldots$ with order-$3$ polynomial." },
      { title: "The order- remainder for is", background: "The order-$3$ remainder for $e^1$ is at most $e/24\\approx0.11326$.", numbers: "The order-$3$ remainder for $e^1$ is at most $e/24\\approx0.11326$." },
      { title: "For , error is at", background: "For $\\sin x\\approx x$, error is at most $|x|^3/6$.", numbers: "For $\\sin x\\approx x$, error is at most $|x|^3/6$." },
      { title: "Newton methods use a second-order", background: "Newton methods use a second-order Taylor model.", numbers: "Newton methods use a second-order Taylor model." },
      { title: "Trust regions choose radius so", background: "Trust regions choose radius so the remainder stays small.", numbers: "Trust regions choose radius so the remainder stays small." },
      { title: "For at , gives at", background: "For $\\log(1+x)$ at $0$, $x-x^2/2$ gives $0.095$ at $x=0.1$.", numbers: "For $\\log(1+x)$ at $0$, $x-x^2/2$ gives $0.095$ at $x=0.1$." }
    ]
  },
  "math-04-21": {
    connectionsProse:
      "<p>The Riemann integral defines accumulated area through finite partitions. Lower sums and upper sums trap the possible area from below and above. When the trap can be made arbitrarily tight, the function has a single well-defined integral. This viewpoint connects area, averaging, probability mass, and accumulated quantities.</p>",
    motivation:
      "<p>Area under a curve can be approximated by rectangles. Lower rectangles use the smallest value on each subinterval, while upper rectangles use the largest value. The true area, if it exists, must lie between those two sums.</p>" +
      "<p>Riemann integrability means the upper and lower estimates can be forced as close as desired. Refining the partition reduces the uncertainty until there is only one possible accumulated value. This definition is precise enough to support probability densities, averages, and physical accumulation.</p>",
    definition:
      "<p>A bounded function is Riemann integrable when upper and lower sums can be made arbitrarily close.</p>" +
      "<p>$$U(P,f)-L(P,f)<\\varepsilon.$$</p>" +
      "<p><b>Assumptions that matter:</b> partitions are finite, and lower and upper rectangle sums bracket the same accumulated value.</p>",
    symbols: [
      { sym: "$P$", desc: "a partition" },
      { sym: "$\\Delta x_i$", desc: "subinterval width" },
      { sym: "$L$ and $U$", desc: "lower and upper sums" }
    ],
    derivation: [
      { do: "Establish the step", result: "Partition $[a,b]$ into subintervals", why: "replace a continuum with finitely many pieces." },
      { do: "Establish the step", result: "On each piece, take $m_i=\\inf f$ and $M_i=\\sup f$", why: "lower and upper rectangle heights." },
      { do: "Establish the step", result: "Form $L(P,f)=\\sum m_i\\Delta x_i$ and $U(P,f)=\\sum M_i\\Delta x_i$", why: "these bracket the area." },
      { do: "If for every $\\varepsilon>0$ some partition has $U(P,f)-L(P,f)<\\varepsilon$", result: "the lower and upper integrals agree", why: "there is a single area value." },
      { do: "Establish the step", result: "That common value is $\\int_a^b f(x)\\,dx$", why: "the Riemann integral." }
    ],
    applications: [
      { title: "For on , the integral", background: "For $f(x)=x$ on $[0,1]$, the integral is $1/2$.", numbers: "For $f(x)=x$ on $[0,1]$, the integral is $1/2$." },
      { title: "For on , the integral", background: "For $f(x)=x^2$ on $[0,1]$, the integral is $1/3$.", numbers: "For $f(x)=x^2$ on $[0,1]$, the integral is $1/3$." },
      { title: "A uniform partition with intervals", background: "A uniform partition with $1000$ intervals has mesh width $0.001$.", numbers: "A uniform partition with $1000$ intervals has mesh width $0.001$." },
      { title: "If oscillation per interval is", background: "If oscillation per interval is below $0.001$ over total length $2$, upper-lower gap is below $0.002$.", numbers: "If oscillation per interval is below $0.001$ over total length $2$, upper-lower gap is below $0.002$." },
      { title: "Pixel intensities averaged over a", background: "Pixel intensities averaged over a line segment approximate a Riemann integral.", numbers: "Pixel intensities averaged over a line segment approximate a Riemann integral." },
      { title: "Probability density over must integrate", background: "Probability density over $[0,1]$ must integrate to $1$.", numbers: "Probability density over $[0,1]$ must integrate to $1$." }
    ]
  },
  "math-04-22": {
    connectionsProse:
      "<p>The Fundamental Theorem of Calculus links the two main operations of calculus. Integration accumulates values over an interval, while differentiation reads off local rate of change. The theorem says that differentiating accumulated area recovers the original continuous function. It also turns definite integrals into endpoint differences of antiderivatives.</p>",
    motivation:
      "<p>Accumulation and rate of change are inverse ideas in calculus. If $F(x)$ records the area accumulated up to $x$, then increasing $x$ by a small $h$ adds only the area over a short interval. Dividing by $h$ gives the average value of $f$ over that short interval.</p>" +
      "<p>Continuity makes that short-interval average approach the point value $f(x)$. Thus the derivative of the accumulation function is the original integrand. The antiderivative form follows by comparing any function $G$ with derivative $f$ to the accumulation function.</p>",
    definition:
      "<p>The Fundamental Theorem of Calculus says the derivative of accumulated area recovers the integrand, and definite integrals equal antiderivative endpoint differences.</p>" +
      "<p>$$F(x)=\\int_a^x f(t)\\,dt,\\qquad F'(x)=f(x),\\qquad \\int_a^b f=G(b)-G(a).$$</p>" +
      "<p><b>Assumptions that matter:</b> continuity of $f$ makes short-interval averages approach the point value.</p>",
    symbols: [
      { sym: "$F$", desc: "the accumulation function" },
      { sym: "$f$", desc: "the integrand" },
      { sym: "$G$", desc: "any antiderivative" }
    ],
    derivation: [
      { do: "Establish the step", result: "Define $F(x)=\\int_a^x f(t)\\,dt$", why: "accumulated area up to $x$." },
      { do: "Compute the difference quotient", result: "$\\frac{F(x+h)-F(x)}{h}=\\frac1h\\int_x^{x+h}f(t)\\,dt$", why: "subtract adjacent areas." },
      { do: "Establish the step", result: "By continuity, $f(t)$ is close to $f(x)$ when $t$ is close to $x$", why: "the average value over a short interval is close to $f(x)$." },
      { do: "Establish the step", result: "Let $h\\to0$ to get $F'(x)=f(x)$", why: "the local average becomes the point value." },
      { do: "If $G'=f$", result: "then $\\int_a^b f=G(b)-G(a)$", why: "apply the result to $G-G(a)$." }
    ],
    applications: [
      { title: "Application", background: "$\\int_0^1 2x\\,dx=1^2-0^2=1$.", numbers: "$\\int_0^1 2x\\,dx=1^2-0^2=1$." },
      { title: "Accumulated gradient over a path", background: "Accumulated gradient over a path recovers potential change.", numbers: "Accumulated gradient over a path recovers potential change." },
      { title: "Cumulative distribution derivatives recover density", background: "Cumulative distribution derivatives recover density.", numbers: "Cumulative distribution derivatives recover density." },
      { title: "Area under velocity gives displacement", background: "Area under velocity gives displacement; constant velocity $3$ for $4$ seconds gives $12$.", numbers: "Area under velocity gives displacement; constant velocity $3$ for $4$ seconds gives $12$." },
      { title: "Training loss decrease equals integral", background: "Training loss decrease equals integral of its time derivative in continuous-time models.", numbers: "Training loss decrease equals integral of its time derivative in continuous-time models." },
      { title: "Application", background: "$\\int_0^\\pi \\cos x\\,dx=0-0=0$.", numbers: "$\\int_0^\\pi \\cos x\\,dx=0-0=0$." }
    ]
  },
  "math-04-23": {
    connectionsProse:
      "<p>Sequences of functions add a new layer to ordinary sequences. Each index now carries an entire function, so convergence can be checked input by input or over the whole domain at once. The example $f_n(x)=x^n$ shows why those two notions differ. It also prepares the contrast between pointwise and uniform convergence.</p>",
    motivation:
      "<p>A sequence of functions can converge differently at different inputs. For each fixed $x$, the values $f_n(x)$ form an ordinary numeric sequence. Studying all those numeric sequences gives pointwise convergence.</p>" +
      "<p>The example $x^n$ on $[0,1]$ shows the endpoint issue. Every fixed $x<1$ produces geometric decay to zero, while $x=1$ stays equal to one forever. Because points close to one decay very slowly, no uniform cutoff controls the whole interval.</p>",
    definition:
      "<p>A sequence of functions $f_n$ can converge pointwise by fixing $x$ first; for $f_n(x)=x^n$ on $[0,1]$, the limit is $0$ for $x<1$ and $1$ at $x=1$.</p>" +
      "<p><b>Assumptions that matter:</b> endpoint behavior can differ from interior behavior, and pointwise convergence need not be uniform.</p>",
    symbols: [
      { sym: "$f_n$", desc: "the $n$th function" },
      { sym: "pointwise", desc: "fix $x$ first" },
      { sym: "uniform", desc: "control the supremum over $x$" }
    ],
    derivation: [
      { do: "Establish the step", result: "Define $f_n(x)=x^n$ on $[0,1]$", why: "a concrete sequence of functions." },
      { do: "If $0\\le x<1$", result: "then $x^n\\to0$", why: "geometric decay." },
      { do: "If $x=1$", result: "then $x^n=1$ for every $n$", why: "the endpoint stays fixed." },
      { do: "Establish the step", result: "Therefore the pointwise limit is $f(x)=0$ for $x<1$ and $f(1)=1$", why: "limits depend on the input." },
      { do: "Establish the step", result: "The convergence is not uniform because $\\sup_{[0,1]}|f_n-f|$ stays $1$ near the endpoint", why: "no single $N$ controls all $x$." }
    ],
    applications: [
      { title: "for ", background: "$0.5^{10}=0.0009765625$ for $f_{10}(0.5)$.", numbers: "$0.5^{10}=0.0009765625$ for $f_{10}(0.5)$." },
      { title: "At , ", background: "At $x=0.9$, $0.9^{10}\\approx0.3487$.", numbers: "At $x=0.9$, $0.9^{10}\\approx0.3487$." },
      { title: "At , every ", background: "At $x=1$, every $f_n(1)=1$.", numbers: "At $x=1$, every $f_n(1)=1$." },
      { title: "Model families indexed by width", background: "Model families indexed by width form sequences of functions.", numbers: "Model families indexed by width form sequences of functions." },
      { title: "Approximation curves can converge for", background: "Approximation curves can converge for each data point but fail uniformly.", numbers: "Approximation curves can converge for each data point but fail uniformly." },
      { title: "Uniform error is stronger than", background: "Uniform error $\\sup_x|f_n-f|<0.01$ is stronger than test-point error.", numbers: "Uniform error $\\sup_x|f_n-f|<0.01$ is stronger than test-point error." }
    ]
  },
  "math-04-24": {
    connectionsProse:
      "<p>Series of functions combine infinite sums with function behavior across a domain. The main challenge is controlling all inputs while adding infinitely many terms. The Weierstrass M-test solves this by comparing each function term to a numeric majorant. When the numeric majorants have a convergent sum, the function series has a uniform tail bound.</p>",
    motivation:
      "<p>Adding functions term by term creates a sequence of partial-sum functions. To know that the infinite sum behaves well on a domain, the tails must be controlled uniformly in $x$. A pointwise tail estimate is often not enough.</p>" +
      "<p>The M-test supplies a clean sufficient condition. If each $|f_n(x)|$ is bounded by a numeric $M_n$ and the numeric series converges, then every function tail is bounded by the same numeric tail. This makes the partial sums uniformly Cauchy and gives uniform convergence.</p>",
    definition:
      "<p>The Weierstrass M-test proves uniform convergence when $|f_n(x)|\\le M_n$ for all $x$ and $\\sum M_n$ converges.</p>" +
      "<p><b>Assumptions that matter:</b> the same numeric majorant controls every input in the domain.</p>",
    symbols: [
      { sym: "$f_n$", desc: "a function term" },
      { sym: "$M_n$", desc: "a numeric majorant" },
      { sym: "uniform Cauchy", desc: "one cutoff controls all inputs" }
    ],
    derivation: [
      { do: "Establish the step", result: "Suppose $|f_n(x)|\\le M_n$ for every $x$ in the domain", why: "dominate each function by a numeric term." },
      { do: "If $\\sum M_n$ converges", result: "then its tails become small", why: "numeric convergence supplies a tail bound." },
      { do: "For $m>n$", result: "$|\\sum_{k=n}^m f_k(x)|\\le\\sum_{k=n}^m M_k$ for all $x$", why: "triangle inequality works uniformly." },
      { do: "Establish the step", result: "The function partial sums are uniformly Cauchy", why: "the same tail bound works for every $x$." },
      { do: "Establish the step", result: "Therefore $\\sum f_n$ converges uniformly", why: "this is the Weierstrass M-test." }
    ],
    applications: [
      { title: "on is bounded by if", background: "$\\sum x^n/2^n$ on $[0,1]$ is bounded by $\\sum2^{-n}=2$ if starting at $0$.", numbers: "$\\sum x^n/2^n$ on $[0,1]$ is bounded by $\\sum2^{-n}=2$ if starting at $0$." },
      { title: "Tail after terms of a", background: "Tail after $7$ terms of a $1/2$ majorant is $0.015625$.", numbers: "Tail after $7$ terms of a $1/2$ majorant is $0.015625$." },
      { title: "Neural basis expansions use coefficient", background: "Neural basis expansions use coefficient bounds to guarantee convergence.", numbers: "Neural basis expansions use coefficient bounds to guarantee convergence." },
      { title: "Fourier-like approximations need uniform tails", background: "Fourier-like approximations need uniform tails for pointwise plotting guarantees.", numbers: "Fourier-like approximations need uniform tails for pointwise plotting guarantees." },
      { title: "Power series inside have geometric", background: "Power series inside $|x|\\le0.5$ have geometric tail bounds.", numbers: "Power series inside $|x|\\le0.5$ have geometric tail bounds." },
      { title: "If , total bound is", background: "If $M_n=10^{-n}$, total bound is $1/9$ when starting at $n=1$.", numbers: "If $M_n=10^{-n}$, total bound is $1/9$ when starting at $n=1$." }
    ]
  },
  "math-04-25": {
    connectionsProse:
      "<p>Pointwise convergence fixes one input and then studies the resulting numeric sequence. This makes the definition approachable, but it also allows the required cutoff to vary from point to point. Near difficult parts of the domain, the cutoff may become very large. That is why pointwise convergence alone does not preserve many global properties.</p>",
    motivation:
      "<p>Pointwise convergence is the most direct way to define convergence for functions. Fix an input, then apply the familiar sequence-limit definition to the values at that input. The allowed cutoff $N$ may depend on the chosen input.</p>" +
      "<p>For $x^n$ on $[0,1)$, every fixed $x<1$ gives a ratio below one, so the values go to zero. But as $x$ approaches one, that ratio becomes closer to one and the necessary cutoff grows. This dependence on $x$ explains why pointwise convergence can fail to preserve continuity.</p>",
    definition:
      "<p>Pointwise convergence of $f_n$ to $f$ means that for each fixed $x$, the numeric sequence $f_n(x)$ converges to $f(x)$.</p>" +
      "<p><b>Assumptions that matter:</b> the cutoff $N$ may depend on the chosen input $x$.</p>",
    symbols: [
      { sym: "$x$", desc: "fixed before choosing $N$" },
      { sym: "$f_n(x)$", desc: "the value of the $n$th function at that point" },
      { sym: "$f(x)$", desc: "the pointwise limit" }
    ],
    derivation: [
      { do: "For $f_n(x)=x^n$ on $[0,1)$", result: "fix one $x<1$", why: "pointwise convergence starts by freezing the input." },
      { do: "Establish the step", result: "Since $0\\le x<1$, the geometric sequence $x^n$ tends to $0$", why: "the fixed input supplies a ratio below $1$." },
      { do: "Given $\\varepsilon>0$", result: "choose $N>\\log(\\varepsilon)/\\log(x)$ when $x>0$", why: "this makes $x^N<\\varepsilon$." },
      { do: "For $n\\ge N$", result: "$|f_n(x)-0|<\\varepsilon$", why: "convergence holds at that point." },
      { do: "Establish the step", result: "The needed $N$ grows as $x$ approaches $1$", why: "this is why pointwise need not be uniform." }
    ],
    applications: [
      { title: "At , gives ", background: "At $x=0.5$, $n=10$ gives $0.0009765625$.", numbers: "At $x=0.5$, $n=10$ gives $0.0009765625$." },
      { title: "At , reaching below needs", background: "At $x=0.9$, reaching below $0.01$ needs $n\\ge44$.", numbers: "At $x=0.9$, reaching below $0.01$ needs $n\\ge44$." },
      { title: "At , the needed is", background: "At $x=0.99$, the needed $n$ is much larger, about $459$ for $0.01$.", numbers: "At $x=0.99$, the needed $n$ is much larger, about $459$ for $0.01$." },
      { title: "A model can converge on", background: "A model can converge on each fixed example but not uniformly over all inputs.", numbers: "A model can converge on each fixed example but not uniformly over all inputs." },
      { title: "Pointwise confidence estimates do not", background: "Pointwise confidence estimates do not guarantee worst-case confidence.", numbers: "Pointwise confidence estimates do not guarantee worst-case confidence." },
      { title: "The limit of continuous on", background: "The limit of continuous $x^n$ on $[0,1]$ is discontinuous, showing pointwise convergence does not preserve continuity.", numbers: "The limit of continuous $x^n$ on $[0,1]$ is discontinuous, showing pointwise convergence does not preserve continuity." }
    ]
  },
  "math-04-26": {
    connectionsProse:
      "<p>Uniform convergence controls the largest error over the entire domain. Unlike pointwise convergence, it uses one cutoff that works for all inputs. This stronger control is what lets continuity pass from approximating functions to their limit. The proof is a careful triangle-inequality argument using one continuous approximant.</p>",
    motivation:
      "<p>Uniform convergence asks for the same cutoff to work for every input. Equivalently, the supremum of the error over the domain must go to zero. This makes it a worst-case convergence guarantee.</p>" +
      "<p>The preservation of continuity follows by using one approximating function $f_N$. Uniform convergence makes both $f(x)$ and $f(a)$ close to $f_N(x)$ and $f_N(a)$, while continuity of $f_N$ controls the middle difference. The three errors are each kept below $\\varepsilon/3$.</p>",
    definition:
      "<p>Uniform convergence means the worst-case error over the domain goes to zero.</p>" +
      "<p>$$\\sup_x|f_n(x)-f(x)|\\to0.$$</p>" +
      "<p><b>Assumptions that matter:</b> one cutoff controls all inputs, which lets continuity pass to the limit.</p>",
    symbols: [
      { sym: "$\\sup_x|f_n(x)-f(x)|$", desc: "the worst-case error" },
      { sym: "uniform convergence", desc: "that supremum goes to $0$" }
    ],
    derivation: [
      { do: "Establish the step", result: "Suppose $f_n\\to f$ uniformly and each $f_n$ is continuous", why: "start with the preservation theorem." },
      { do: "Given $\\varepsilon>0$", result: "choose $N$ so $|f_N(x)-f(x)|<\\varepsilon/3$ for all $x$", why: "uniform convergence gives global approximation." },
      { do: "Establish the step", result: "By continuity of $f_N$ at $a$, choose $\\delta$ so $|x-a|<\\delta$ implies $|f_N(x)-f_N(a)|<\\varepsilon/3$", why: "one fixed function is continuous." },
      { do: "Establish the step", result: "Use the triangle inequality on $|f(x)-f(a)|$ with three terms", why: "approximate both endpoint values by $f_N$." },
      { do: "Establish the step", result: "The total is below $\\varepsilon$", why: "the limit $f$ is continuous." }
    ],
    applications: [
      { title: "If , every prediction is", background: "If $\\sup|f_n-f|<0.01$, every prediction is within $0.01$.", numbers: "If $\\sup|f_n-f|<0.01$, every prediction is within $0.01$." },
      { title: "on converges uniformly with error", background: "$x^n$ on $[0,0.5]$ converges uniformly with error at most $0.5^n$.", numbers: "$x^n$ on $[0,0.5]$ converges uniformly with error at most $0.5^n$." },
      { title: "At , that uniform error", background: "At $n=10$, that uniform error is $0.0009765625$.", numbers: "At $n=10$, that uniform error is $0.0009765625$." },
      { title: "Uniformly convergent continuous surrogate models", background: "Uniformly convergent continuous surrogate models keep continuity.", numbers: "Uniformly convergent continuous surrogate models keep continuity." },
      { title: "Uniform loss convergence supports generalization", background: "Uniform loss convergence supports generalization bounds.", numbers: "Uniform loss convergence supports generalization bounds." },
      { title: "Uniform convergence of gradients is", background: "Uniform convergence of gradients is a route to stable optimizer behavior.", numbers: "Uniform convergence of gradients is a route to stable optimizer behavior." }
    ]
  },
  "math-04-27": {
    connectionsProse:
      "<p>Power series are infinite polynomial expansions centered at a point. They are easier to control than arbitrary function series because powers separate coefficient growth from distance to the center. The radius of convergence marks the region where the series behaves reliably. Inside that radius, analytic functions can be studied through their coefficients and tails.</p>",
    motivation:
      "<p>Power series behave like infinite polynomials centered at $c$. Each term has a coefficient and a power of the distance $x-c$. This structure lets convergence be decided by comparing coefficient growth with distance from the center.</p>" +
      "<p>The root test isolates exactly that comparison. The $n$th root of the absolute term separates into $\\sqrt[n]{|a_n|}$ and $|x-c|$. The boundary where their product crosses one determines the radius of convergence, while endpoint behavior needs separate analysis.</p>",
    definition:
      "<p>A power series $\\sum a_n(x-c)^n$ has a radius of convergence determined by coefficient growth.</p>" +
      "<p>$$R=1/L,\\qquad L=\\limsup\\sqrt[n]{|a_n|}.$$</p>" +
      "<p><b>Assumptions that matter:</b> convergence inside the radius follows from the root test; endpoints require separate checks.</p>",
    symbols: [
      { sym: "$c$", desc: "the center" },
      { sym: "$a_n$", desc: "coefficients" },
      { sym: "$R$", desc: "the radius of convergence" },
      { sym: "analytic", desc: "equal to a power series locally" }
    ],
    derivation: [
      { do: "Establish the step", result: "Consider $\\sum a_n(x-c)^n$", why: "terms are powers around center $c$." },
      { do: "Apply the root test to absolute values", result: "$\\sqrt[n]{|a_n(x-c)^n|}=\\sqrt[n]{|a_n|}\\,|x-c|$", why: "separate coefficient growth from distance." },
      { do: "Establish the step", result: "Let $L=\\limsup\\sqrt[n]{|a_n|}$", why: "this measures asymptotic coefficient size." },
      { do: "Establish the step", result: "The series converges when $L|x-c|<1$ and diverges when $L|x-c|>1$", why: "root test." },
      { do: "Establish the step", result: "Therefore the radius is $R=1/L$", why: "endpoints need separate checks." }
    ],
    applications: [
      { title: "has radius ", background: "$\\sum x^n$ has radius $1$.", numbers: "$\\sum x^n$ has radius $1$." },
      { title: "has radius ", background: "$\\sum (3x)^n$ has radius $1/3$.", numbers: "$\\sum (3x)^n$ has radius $1/3$." },
      { title: "has infinite radius", background: "$e^x=\\sum x^n/n!$ has infinite radius.", numbers: "$e^x=\\sum x^n/n!$ has infinite radius." },
      { title: "Taylor approximations of activations use", background: "Taylor approximations of activations use power-series truncations.", numbers: "Taylor approximations of activations use power-series truncations." },
      { title: "Inside , geometric tail after", background: "Inside $|x|\\le0.5$, geometric tail after $10$ is at most $0.001953125$.", numbers: "Inside $|x|\\le0.5$, geometric tail after $10$ is at most $0.001953125$." },
      { title: "Analytic kernels can be expanded", background: "Analytic kernels can be expanded into feature maps.", numbers: "Analytic kernels can be expanded into feature maps." }
    ]
  },
  "math-04-28": {
    connectionsProse:
      "<p>Metric spaces keep the idea of distance while removing dependence on coordinates or the real line. Once a distance function satisfies the metric rules, analysis can discuss balls, limits, Cauchy sequences, compactness, and contractions. This abstraction lets the same proofs apply to vectors, functions, strings, distributions, and other objects. The Euclidean metric is the guiding example.</p>",
    motivation:
      "<p>Many spaces have a meaningful notion of distance even when their elements are not real numbers. A metric abstracts the rules that distance must obey. With those rules, balls and convergence can be defined in the same way across many settings.</p>" +
      "<p>The triangle inequality is the most important structural rule. It says that traveling through an intermediate point cannot beat the direct shortest-distance bound. In Euclidean space, Cauchy-Schwarz proves this rule algebraically, showing that the familiar distance fits the metric framework.</p>",
    definition:
      "<p>A metric space is a set $X$ with a distance function $d$ satisfying positivity, symmetry, and the triangle inequality.</p>" +
      "<p>$$d(x,z)\\le d(x,y)+d(y,z).$$</p>" +
      "<p><b>Assumptions that matter:</b> $d(x,y)=0$ only when $x=y$, and open balls use the chosen metric.</p>",
    symbols: [
      { sym: "$X$", desc: "the set" },
      { sym: "$d$", desc: "the distance function" },
      { sym: "open balls", desc: "$B(x,r)=\\{y:d(x,y)<r\\}$" }
    ],
    derivation: [
      { do: "Establish the step", result: "A metric $d$ must satisfy $d(x,y)\\ge0$ and $d(x,y)=0$ only when $x=y$", why: "distance is nonnegative and separates points." },
      { do: "Establish the step", result: "It must satisfy $d(x,y)=d(y,x)$", why: "distance is symmetric." },
      { do: "Establish the step", result: "It must satisfy $d(x,z)\\le d(x,y)+d(y,z)$", why: "going through $y$ cannot be shorter than the shortest direct distance." },
      { do: "For Euclidean distance, the triangle inequality follows from Cauchy-Schwarz", result: "$\\|u+v\\|^2\\le(\\|u\\|+\\|v\\|)^2$", why: "algebra proves the metric rule." }
    ],
    applications: [
      { title: "Euclidean distance between and is", background: "Euclidean distance between $(0,0)$ and $(3,4)$ is $5$.", numbers: "Euclidean distance between $(0,0)$ and $(3,4)$ is $5$." },
      { title: "Cosine distance is used for", background: "Cosine distance is used for embeddings after normalization.", numbers: "Cosine distance is used for embeddings after normalization." },
      { title: "Edit distance between strings is", background: "Edit distance between strings is a metric in NLP.", numbers: "Edit distance between strings is a metric in NLP." },
      { title: "Wasserstein distance compares distributions", background: "Wasserstein distance compares distributions.", numbers: "Wasserstein distance compares distributions." },
      { title: "Nearest-neighbor search only needs a", background: "Nearest-neighbor search only needs a metric-like distance.", numbers: "Nearest-neighbor search only needs a metric-like distance." },
      { title: "In discrete metric, for distinct", background: "In discrete metric, $d(x,y)=1$ for distinct points, so every ball of radius $0.5$ is a singleton.", numbers: "In discrete metric, $d(x,y)=1$ for distinct points, so every ball of radius $0.5$ is a singleton." }
    ]
  },
  "math-04-29": {
    connectionsProse:
      "<p>Open and closed sets describe the local shape of a space. Open sets contain a small ball around each of their points, while closed sets keep the limits of convergent sequences that stay inside. These definitions connect geometry with convergence. They also provide the language used in compactness, constraints, continuity, and stability arguments.</p>",
    motivation:
      "<p>Open sets formalize the idea that each included point has some room to move while staying inside. Closed sets formalize the idea that limits of internal sequences are not lost. These two views are linked through complements.</p>" +
      "<p>The sequence characterization of closed sets is often the most useful in analysis. If a sequence stays in a closed set and converges, the limit cannot fall outside because the open complement would eventually capture the tail. Conversely, if outside points had no protective ball, one could build a sequence from the set converging to that outside point.</p>",
    definition:
      "<p>A set is open when each of its points contains a small ball inside the set, and closed when its complement is open.</p>" +
      "<p><b>Assumptions that matter:</b> in metric spaces, closed sets are exactly the sets that keep limits of convergent sequences from the set.</p>",
    symbols: [
      { sym: "$B(x,r)$", desc: "an open ball" },
      { sym: "$U$", desc: "open" },
      { sym: "$F$", desc: "closed" },
      { sym: "complement", desc: "all points not in the set" }
    ],
    derivation: [
      { do: "Establish the step", result: "A set $U$ is open if every $x\\in U$ has some $r>0$ with $B(x,r)\\subset U$", why: "each point has breathing room." },
      { do: "Establish the step", result: "A set $F$ is closed if its complement is open", why: "outside points have room to stay outside." },
      { do: "If $F$ is closed and $x_n\\in F$ with $x_n\\to x$", result: "then $x\\in F$", why: "otherwise the open complement would contain a ball around $x$ that eventually contains $x_n$, contradiction." },
      { do: "Establish the step", result: "Conversely, if every convergent sequence in $F$ has its limit in $F$, then the complement is open", why: "failure of openness would build a sequence in $F$ converging to an outside point." }
    ],
    applications: [
      { title: "is open in but not", background: "$(0,1)$ is open in $\\mathbb R$ but not closed.", numbers: "$(0,1)$ is open in $\\mathbb R$ but not closed." },
      { title: "is closed but not open", background: "$[0,1]$ is closed but not open in $\\mathbb R$.", numbers: "$[0,1]$ is closed but not open in $\\mathbb R$." },
      { title: "If in , radius stays", background: "If $x=0.4$ in $(0,1)$, radius $0.1$ stays inside.", numbers: "If $x=0.4$ in $(0,1)$, radius $0.1$ stays inside." },
      { title: "A margin set $\\{x", background: "f(x)>0.2\\}$ is open when $f$ is continuous.", numbers: "f(x)>0.2\\}$ is open when $f$ is continuous." },
      { title: "Feasible constraints are closed for", background: "Feasible constraints $g(x)\\le0$ are closed for continuous $g$.", numbers: "Feasible constraints $g(x)\\le0$ are closed for continuous $g$." },
      { title: "If a point is from", background: "If a point is $0.05$ from a decision boundary, a ball of radius $0.025$ stays on the same side.", numbers: "If a point is $0.05$ from a decision boundary, a ball of radius $0.025$ stays on the same side." }
    ]
  },
  "math-04-30": {
    connectionsProse:
      "<p>Compactness is a way to turn infinitely many local facts into finitely many facts. On the real line, closed and bounded sets have this property. Compactness is powerful because it supports subsequence extraction, extreme values, uniform continuity, and finite coverings. It is the final structural idea needed before contraction mapping and convergence guarantees.</p>",
    motivation:
      "<p>Infinite sets can still be manageable when local information has finite control. Compactness records this by requiring every open cover to have a finite subcover. On real intervals, this aligns with the familiar condition of being closed and bounded.</p>" +
      "<p>The proof uses the same nested-interval intuition as Bolzano-Weierstrass. Boundedness lets us extract convergent subsequences, closedness keeps their limits inside, and metric-space equivalences connect sequential compactness with finite subcovers. This is why compact sets support global existence and uniformity results.</p>",
    definition:
      "<p>Compactness means every open cover has a finite subcover; in $\\mathbb R$, closed bounded intervals are compact.</p>" +
      "<p><b>Assumptions that matter:</b> boundedness supplies subsequences, closedness keeps limits inside, and metric compactness gives finite-cover control.</p>",
    symbols: [
      { sym: "Open cover", desc: "open sets whose union contains $K$" },
      { sym: "finite subcover", desc: "finitely many still cover $K$" },
      { sym: "compact", desc: "finite control" }
    ],
    derivation: [
      { do: "Establish the step", result: "In $\\mathbb R$, a compact set is one where every open cover has a finite subcover", why: "infinitely many local neighborhoods reduce to finitely many." },
      { do: "For $[a,b]$", result: "bisect intervals as in Bolzano-Weierstrass to show every sequence has a convergent subsequence", why: "boundedness creates nested intervals." },
      { do: "Establish the step", result: "Closedness keeps the subsequential limit inside the set", why: "no boundary point is missing." },
      { do: "Establish the step", result: "Sequential compactness implies finite-subcover compactness in metric spaces", why: "otherwise one can choose points escaping every finite cover and extract a convergent contradiction." },
      { do: "Establish the step", result: "Therefore closed bounded intervals are compact", why: "this is Heine-Borel in one dimension." }
    ],
    applications: [
      { title: "is compact", background: "$[0,1]$ is compact.", numbers: "$[0,1]$ is compact." },
      { title: "is not compact because the", background: "$(0,1)$ is not compact because the cover $(1/n,1)$ has no finite subcover.", numbers: "$(0,1)$ is not compact because the cover $(1/n,1)$ has no finite subcover." },
      { title: "A continuous loss on compact", background: "A continuous loss on compact parameters attains a minimum.", numbers: "A continuous loss on compact parameters attains a minimum." },
      { title: "A grid with spacing on", background: "A grid with spacing $0.01$ on $[0,1]$ has $101$ points.", numbers: "A grid with spacing $0.01$ on $[0,1]$ has $101$ points." },
      { title: "Clipping weights to creates a", background: "Clipping weights to $[-1,1]^d$ creates a closed bounded box.", numbers: "Clipping weights to $[-1,1]^d$ creates a closed bounded box." },
      { title: "Robustness certificates often cover a", background: "Robustness certificates often cover a compact perturbation ball with finitely many local bounds.", numbers: "Robustness certificates often cover a compact perturbation ball with finitely many local bounds." }
    ]
  },
  "math-04-31": {
    connectionsProse:
      "<p>This lesson brings together several ideas from the section. A metric space gives a way to measure distance, a Cauchy sequence describes terms that crowd together, and completeness says that such a sequence has a point to crowd around. The contraction mapping theorem uses all three ideas in one useful result. The theorem is also a bridge from abstract analysis to algorithms because it gives both a fixed point and a rate of approach.</p>",
    motivation:
      "<p>Many numerical methods are built by turning a hard equation into a repeated update. Instead of solving $x=g(x)$ directly, we start from $x_0$ and compute $x_1=g(x_0)$, $x_2=g(x_1)$, and so on. This process is reliable only when the update pulls points closer together.</p>" +
      "<p>The contraction mapping theorem turns that picture into a proof. The shrinking condition gives a geometric tail bound, so the iterates are Cauchy. Completeness supplies the limit, and the same shrinking inequality forces the limit to be the unique fixed point.</p>",
    definition:
      "<p>In a complete metric space, a contraction $T:X\\to X$ has a unique fixed point and every iteration $T^n x_0$ converges to it.</p>" +
      "<p>$$d(Tx,Ty)\\le q\\,d(x,y),\\qquad 0\\le q<1.$$</p>" +
      "<p><b>Assumptions that matter:</b> $(X,d)$ is complete, $T$ maps $X$ into itself, and the same $q<1$ works for all pairs.</p>",
    symbols: [
      { sym: "$(X,d)$", desc: "the metric space" },
      { sym: "complete", desc: "every Cauchy sequence in $X$ converges to a point of $X$" },
      { sym: "$T$", desc: "the update map" },
      { sym: "$q$", desc: "the contraction factor" },
      { sym: "$x^*$", desc: "the unique fixed point" },
      { sym: "$x_n=T^n x_0$", desc: "the $n$th iterate" }
    ],
    derivation: [
      { do: "Establish the step", result: "Let $x_{n+1}=T(x_n)$", why: "this is the iteration whose limit we want to prove exists." },
      { do: "Apply the contraction repeatedly", result: "$d(x_{n+1},x_n)\\le q^n d(x_1,x_0)$", why: "each new gap is at most $q$ times the previous gap." },
      { do: "For $m>n$, use the triangle inequality", result: "$d(x_m,x_n)\\le \\sum_{k=n}^{m-1}d(x_{k+1},x_k)$", why: "a long jump is bounded by short jumps." },
      { do: "Bound the sum by a geometric tail", result: "$d(x_m,x_n)\\le d(x_1,x_0)\\sum_{k=n}^{m-1}q^k\\le d(x_1,x_0)q^n/(1-q)$", why: "tails vanish because $q<1$." },
      { do: "Given $\\varepsilon>0$", result: "choose $n$ so $d(x_1,x_0)q^n/(1-q)<\\varepsilon$", why: "this proves $(x_n)$ is Cauchy." },
      { do: "Establish the step", result: "Completeness gives a limit $x_n\\to x^*$", why: "Cauchy sequences in $X$ are guaranteed to converge inside $X$." },
      { do: "Establish the step", result: "Use $d(Tx^*,x^*)\\le d(Tx^*,T x_n)+d(x_{n+1},x^*)\\le qd(x^*,x_n)+d(x_{n+1},x^*)\\to0$", why: "the limit is fixed." },
      { do: "If $u$ and $v$ are fixed", result: "then $d(u,v)=d(Tu,Tv)\\le qd(u,v)$", why: "since $q<1$, this forces $d(u,v)=0$, so $u=v$." }
    ],
    applications: [
      { title: "Fixed-point solver", background: "If $q=0.5$ and the initial gap bound is $1$, after $10$ steps the tail bound is $0.5^{10}/(1-0.5)=0.001953125$.", numbers: "If $q=0.5$ and the initial gap bound is $1$, after $10$ steps the tail bound is $0.5^{10}/(1-0.5)=0.001953125$." },
      { title: "Value iteration", background: "With discount $\\gamma=0.9$, the Bellman update is a $0.9$-contraction; after $44$ rounds, $0.9^{44}<0.01$, so the leading error factor is below one percent.", numbers: "With discount $\\gamma=0.9$, the Bellman update is a $0.9$-contraction; after $44$ rounds, $0.9^{44}<0.01$, so the leading error factor is below one percent." },
      { title: "Gradient method near a strong convex optimum", background: "If the local contraction factor is $0.8$, then after $21$ steps the distance factor is $0.8^{21}\\approx0.00922$.", numbers: "If the local contraction factor is $0.8$, then after $21$ steps the distance factor is $0.8^{21}\\approx0.00922$." },
      { title: "Fixed-point layer iteration budget", background: "A tolerance $10^{-3}$ with $q=0.5$ needs $n\\ge10$ because $2^{-10}=0.0009765625$.", numbers: "A tolerance $10^{-3}$ with $q=0.5$ needs $n\\ge10$ because $2^{-10}=0.0009765625$." },
      { title: "Picard iteration for an ODE", background: "On a short interval with Lipschitz constant $L=2$ and length $h=0.2$, the Picard map has factor $Lh=0.4$, so the theorem applies.", numbers: "On a short interval with Lipschitz constant $L=2$ and length $h=0.2$, the Picard map has factor $Lh=0.4$, so the theorem applies." },
      { title: "Denoising iteration", background: "If an update halves the distance between any two images, two starting images initially $12$ units apart are at most $12\\cdot0.5^5=0.375$ apart after five iterations.", numbers: "If an update halves the distance between any two images, two starting images initially $12$ units apart are at most $12\\cdot0.5^5=0.375$ apart after five iterations." }
    ]
  },
  "math-04-32": {
    connectionsProse:
      "<p>This capstone connects the section's convergence language to gradient methods. Sequences describe iterates, metrics measure distance to an optimum, and contraction estimates provide rates. Strong convexity and smoothness supply the analytic assumptions that make a gradient step reliable. The result is a real-analysis explanation of when a common optimization procedure converges geometrically.</p>",
    motivation:
      "<p>Gradient descent produces a sequence, so convergence is an analysis question. The goal is to show not only that the objective improves, but that the iterates move toward a definite minimizer. Strong convexity and smoothness are the assumptions that make this possible.</p>" +
      "<p>Under a safe step size, the gradient update behaves like a contraction toward $x^*$. Each iteration reduces the distance by a factor such as $1-\\eta\\mu$. Repeating the inequality gives a geometric bound, which turns a qualitative convergence claim into an iteration-count estimate.</p>",
    definition:
      "<p>For strongly convex and smooth objectives, a safe gradient step can act like a contraction toward the minimizer.</p>" +
      "<p>$$\\|x_k-x^*\\|\\le(1-\\eta\\mu)^k\\|x_0-x^*\\|.$$</p>" +
      "<p><b>Assumptions that matter:</b> $f$ is $\\mu$-strongly convex and $L$-smooth, with $0<\\eta\\le1/L$.</p>",
    symbols: [
      { sym: "$\\eta$", desc: "learning rate" },
      { sym: "$\\mu$", desc: "strong-convexity curvature" },
      { sym: "$L$", desc: "smoothness" },
      { sym: "$x^*$", desc: "the minimizer" },
      { sym: "$k$", desc: "the iteration count" }
    ],
    derivation: [
      { do: "Establish the step", result: "Assume $f$ is $\\mu$-strongly convex and $L$-smooth", why: "curvature is bounded below by $\\mu$ and above by $L$." },
      { do: "Establish the step", result: "Use the gradient step $x_{k+1}=x_k-\\eta\\nabla f(x_k)$ with $0<\\eta\\le1/L$", why: "the step is small enough for smoothness." },
      { do: "Establish the step", result: "Strong convexity and smoothness imply $\\|x_{k+1}-x^*\\|\\le(1-\\eta\\mu)\\|x_k-x^*\\|$ for the quadratic model and, more generally, a contraction in the appropriate norm", why: "curvature pulls toward the minimizer." },
      { do: "Iterate the inequality", result: "$\\|x_k-x^*\\|\\le(1-\\eta\\mu)^k\\|x_0-x^*\\|$", why: "repeated contraction gives a geometric rate." },
      { do: "Establish the step", result: "Since $(1-\\eta\\mu)^k\\to0$, the iterates converge to $x^*$", why: "geometric decay proves convergence." }
    ],
    applications: [
      { title: "For and , ", background: "For $f(x)=\\tfrac12x^2$ and $\\eta=0.1$, $x_{k+1}=0.9x_k$.", numbers: "For $f(x)=\\tfrac12x^2$ and $\\eta=0.1$, $x_{k+1}=0.9x_k$." },
      { title: "Starting at , after steps", background: "Starting at $10$, after $10$ steps with factor $0.8$, distance is $10\\cdot0.8^{10}=1.073741824$.", numbers: "Starting at $10$, after $10$ steps with factor $0.8$, distance is $10\\cdot0.8^{10}=1.073741824$." },
      { title: "Factor needs steps to get", background: "Factor $0.8$ needs $21$ steps to get below one percent.", numbers: "Factor $0.8$ needs $21$ steps to get below one percent." },
      { title: "If , the safe fixed", background: "If $L=5$, the safe fixed step is $\\eta\\le0.2$.", numbers: "If $L=5$, the safe fixed step is $\\eta\\le0.2$." },
      { title: "If and , rate factor", background: "If $\\mu=1$ and $\\eta=0.1$, rate factor is $0.9$.", numbers: "If $\\mu=1$ and $\\eta=0.1$, rate factor is $0.9$." },
      { title: "Early stopping can be tied", background: "Early stopping can be tied to a tolerance: with factor $0.5$, ten steps reduce error below $0.001$ times a unit initial error.", numbers: "Early stopping can be tied to a tolerance: with factor $0.5$, ten steps reduce error below $0.001$ times a unit initial error." }
    ]
  }
};
