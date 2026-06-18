/* =====================================================================
   MODULE 1 — PROBABILITY & STATISTICS: how to reason about uncertainty.
   Same lesson style as the foundations gold standard:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Probability & Statistics";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---------------------------------------------------------------- */
L({
  id: "prob-sample-space",
  title: "Sample space & events",
  tagline: "List everything that could happen. That list is where all probability lives.",
  bigIdea:
    `<p>Before you can talk about chance, you must list what <i>could</i> happen.</p>
     <p>The <b>sample space</b> is that complete list of possible outcomes.</p>
     <p>An <b>event</b> is just a chunk of that list — a group of outcomes you care about.</p>
     <p>Everything in probability is built on these two simple ideas.</p>`,
  buildup:
    `<p>Flip a coin. The only things that can happen are heads or tails.</p>
     <p>Write them down: $\\{H, T\\}$. That full set of possibilities is the sample space.</p>
     <p>An event is a question you ask about it, like "did we get heads?"</p>`,
  symbols: [
    { sym: "$\\Omega$", desc: "the sample space: the set of ALL possible outcomes. It is a capital Greek 'omega'." },
    { sym: "$\\{\\,\\}$", desc: "curly braces mean 'a set', i.e. a collection of things listed inside." },
    { sym: "$A$", desc: "an event: a subset of $\\Omega$ (some of the outcomes, not always all)." },
    { sym: "$\\subseteq$", desc: "'is a subset of'. $A \\subseteq \\Omega$ means every outcome in $A$ is also in $\\Omega$." },
    { sym: "$\\omega$", desc: "a single outcome (lower-case omega), one item inside $\\Omega$." }
  ],
  formula: `$$ \\Omega = \\{\\,\\omega_1, \\omega_2, \\dots\\,\\} \\qquad A \\subseteq \\Omega $$`,
  whatItDoes:
    `<p>The left side says: $\\Omega$ is the set holding every outcome $\\omega$.</p>
     <p>The right side says: an event $A$ is some of those outcomes grouped together.</p>
     <p>If the outcome that actually happens is inside $A$, we say "the event $A$ occurred".</p>`,
  example:
    `<p>Roll one fair six-sided die.</p>
     <ul class="steps">
       <li>Sample space: $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$. Six possible outcomes.</li>
       <li>Event "even number": $A = \\{2, 4, 6\\}$. A subset of $\\Omega$.</li>
       <li>Event "roll more than 4": $B = \\{5, 6\\}$. Another subset.</li>
       <li>If you roll a 4, event $A$ happened (4 is inside $A$) but $B$ did not (4 is not in $B$).</li>
     </ul>`,
  application:
    `<p>A spam filter's sample space is every email it could see. The event "this email is spam" is a subset. Defining the sample space clearly is the first step in any model that handles uncertainty.</p>`,
  quiz: {
    q: `Toss two coins. Write the sample space $\\Omega$. Then write the event $A$ = "exactly one head".`,
    a: `<p>$\\Omega = \\{HH, HT, TH, TT\\}$ (four outcomes). $A = \\{HT, TH\\}$ — the two outcomes with exactly one head.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-axioms",
  title: "Probability axioms",
  tagline: "Three simple rules that every probability must obey. No more, no less.",
  prereqs: ["prob-sample-space"],
  bigIdea:
    `<p>A probability is a number between 0 and 1 attached to an event.</p>
     <p>0 means "never happens". 1 means "always happens".</p>
     <p>For these numbers to make sense, they must follow three plain rules.</p>
     <p>Every formula in probability is built on top of these rules.</p>`,
  buildup:
    `<p>You have a sample space $\\Omega$ and events inside it.</p>
     <p>You want to assign each event a chance. But you cannot assign chances randomly — they have to be consistent.</p>
     <p>These three rules (axioms) keep them consistent.</p>`,
  symbols: [
    { sym: "$P(A)$", desc: "the probability of event $A$: a number from 0 to 1." },
    { sym: "$\\ge$", desc: "'greater than or equal to'. So $P(A) \\ge 0$ means the chance is never negative." },
    { sym: "$P(\\Omega)$", desc: "the probability that SOME outcome happens. It must be 1 (something always happens)." },
    { sym: "$A \\cup B$", desc: "'A union B': the event that A OR B (or both) happens. The cup $\\cup$ means 'or'." },
    { sym: "$A^c$", desc: "the complement of $A$: the event that $A$ does NOT happen. The little 'c' means 'complement'." },
    { sym: "disjoint", desc: "two events are disjoint if they cannot both happen at once (no shared outcomes)." }
  ],
  formula: `$$ P(A) \\ge 0 \\qquad P(\\Omega) = 1 \\qquad P(A \\cup B) = P(A) + P(B)\\;\\text{ if disjoint} $$`,
  whatItDoes:
    `<p>Rule 1 (nonnegativity): a chance is never below 0.</p>
     <p>Rule 2 (normalization): the chance that anything at all happens is exactly 1.</p>
     <p>Rule 3 (additivity): if two events can't overlap, the chance of "one or the other" is just their chances added.</p>
     <p>A handy result follows: $P(A^c) = 1 - P(A)$. The chance it doesn't happen is 1 minus the chance it does.</p>`,
  example:
    `<p>Roll a fair die. Each face has probability $\\frac{1}{6}$.</p>
     <ul class="steps">
       <li>Event $A = \\{1,2\\}$ and event $B = \\{5,6\\}$. They share no faces, so they are disjoint.</li>
       <li>$P(A) = \\frac{2}{6}$ and $P(B) = \\frac{2}{6}$.</li>
       <li>By additivity: $P(A \\cup B) = \\frac{2}{6} + \\frac{2}{6} = \\frac{4}{6} = \\frac{2}{3}$.</li>
       <li>Complement check: $P(\\text{not } A) = 1 - \\frac{2}{6} = \\frac{4}{6}$. Faces $\\{3,4,5,6\\}$ — yes, four of them.</li>
     </ul>`,
  application:
    `<p>When a classifier outputs probabilities over many classes (cat, dog, bird), those numbers must each be $\\ge 0$ and sum to 1. That is the normalization axiom in action. The 'softmax' function exists to enforce it.</p>`,
  quiz: {
    q: `If $P(\\text{rain}) = 0.3$, what is $P(\\text{no rain})$?`,
    a: `<p>Use the complement rule: $P(\\text{no rain}) = 1 - 0.3 = 0.7$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-conditional",
  title: "Conditional probability",
  tagline: "Once you learn something is true, the odds of everything else change. This measures by how much.",
  prereqs: ["prob-axioms"],
  bigIdea:
    `<p>New information changes the odds.</p>
     <p>Conditional probability answers: "given that $B$ already happened, how likely is $A$ now?"</p>
     <p>The trick: shrink your whole world down to just $B$. Forget everything outside $B$.</p>
     <p>Then ask what fraction of that smaller world is also $A$.</p>`,
  buildup:
    `<p>Normally $A$'s chance is measured against the full sample space $\\Omega$.</p>
     <p>But if you know $B$ happened, $\\Omega$ is no longer the playing field. $B$ is.</p>
     <p>So you re-measure $A$ inside $B$ only.</p>`,
  symbols: [
    { sym: "$P(A \\mid B)$", desc: "the probability of $A$ GIVEN that $B$ happened. The bar '$\\mid$' means 'given'." },
    { sym: "$A \\cap B$", desc: "'A intersect B': the event that A AND B both happen. The cap $\\cap$ means 'and'." },
    { sym: "$P(A \\cap B)$", desc: "the probability that both $A$ and $B$ happen." },
    { sym: "$P(B)$", desc: "the probability of $B$ (must be more than 0, or 'given B' makes no sense)." }
  ],
  formula: `$$ P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} $$`,
  whatItDoes:
    `<p>The bottom $P(B)$ is your new, smaller world.</p>
     <p>The top $P(A \\cap B)$ is the part of that world where $A$ is also true.</p>
     <p>Dividing gives the fraction of $B$ that is also $A$ — exactly the chance of $A$ inside $B$.</p>`,
  example:
    `<p>Roll a fair die. Let $A$ = "rolled a 2", and $B$ = "rolled an even number" $= \\{2,4,6\\}$. Someone tells you the roll was even. Now, how likely is a 2?</p>
     <ul class="steps">
       <li>$P(B) = \\frac{3}{6} = \\frac{1}{2}$ (three even faces).</li>
       <li>$A \\cap B$ = "rolled a 2 AND it's even" = just $\\{2\\}$, so $P(A \\cap B) = \\frac{1}{6}$.</li>
       <li>$P(A \\mid B) = \\frac{1/6}{1/2} = \\frac{1}{6} \\times \\frac{2}{1} = \\frac{2}{6} = \\frac{1}{3}$.</li>
       <li>Makes sense: once you know it's even, there are only 3 faces left, and 2 is one of them.</li>
     </ul>`,
  application:
    `<p>Recommendation systems ask "given that you watched this movie, how likely are you to watch that one?" Conditioning on what a user already did is the core of personalization.</p>`,
  quiz: {
    q: `A die came up greater than 3 (so it's in $\\{4,5,6\\}$). What is the probability it's a 6?`,
    a: `<p>The new world is $\\{4,5,6\\}$, three equally likely faces. $P(6 \\mid >3) = \\frac{1/6}{3/6} = \\frac{1}{3}$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-bayes",
  title: "Bayes' rule",
  tagline: "Flip a conditional probability around. The secret weapon for tests and beliefs.",
  prereqs: ["prob-conditional"],
  bigIdea:
    `<p>Sometimes you know $P(B \\mid A)$ but really want $P(A \\mid B)$.</p>
     <p>Bayes' rule flips one into the other.</p>
     <p>It is how you update a belief after seeing evidence.</p>
     <p>The big lesson: the starting rate (how common $A$ is to begin with) matters a LOT.</p>`,
  buildup:
    `<p>A medical test tells you $P(\\text{test positive} \\mid \\text{sick})$ — how often a sick person tests positive.</p>
     <p>But you actually want $P(\\text{sick} \\mid \\text{test positive})$ — given a positive test, are you sick?</p>
     <p>Those are different numbers. Bayes' rule connects them.</p>`,
  symbols: [
    { sym: "$P(A \\mid B)$", desc: "what we want: chance of $A$ given evidence $B$ (the 'posterior')." },
    { sym: "$P(B \\mid A)$", desc: "what we usually know: chance of evidence $B$ if $A$ is true (the 'likelihood')." },
    { sym: "$P(A)$", desc: "the base rate: how common $A$ is before any evidence (the 'prior')." },
    { sym: "$P(B)$", desc: "the total chance of seeing evidence $B$, any way it could happen." }
  ],
  formula: `$$ P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)} $$`,
  whatItDoes:
    `<p>Start with your prior belief $P(A)$.</p>
     <p>Multiply by how well the evidence fits, $P(B \\mid A)$.</p>
     <p>Divide by how likely the evidence was overall, $P(B)$.</p>
     <p>Out comes your updated belief $P(A \\mid B)$.</p>`,
  example:
    `<p>A disease affects 1 in 1000 people. A test is 99% accurate (it catches sick people 99% of the time, and gives a false alarm just 1% of the time for healthy people). You test positive. Are you sick?</p>
     <ul class="steps">
       <li>Prior: $P(\\text{sick}) = 0.001$. So $P(\\text{healthy}) = 0.999$.</li>
       <li>Likelihood: $P(+ \\mid \\text{sick}) = 0.99$. False alarm: $P(+ \\mid \\text{healthy}) = 0.01$.</li>
       <li>Total chance of a positive test: $P(+) = 0.99 \\times 0.001 + 0.01 \\times 0.999 = 0.00099 + 0.00999 = 0.01098$.</li>
       <li>Bayes: $P(\\text{sick} \\mid +) = \\frac{0.99 \\times 0.001}{0.01098} = \\frac{0.00099}{0.01098} \\approx 0.09$.</li>
       <li>Only about <b>9%</b>! Even with a "99% accurate" test, a positive usually means you're healthy — because the disease is so rare to begin with.</li>
     </ul>`,
  application:
    `<p>Bayes' rule powers spam filters (given these words, is it spam?), medical diagnosis, and Bayesian machine learning. The lesson about base rates is one of the most important ideas in all of statistics.</p>`,
  quiz: {
    q: `Why was a positive test only 9% likely to mean illness, despite the test being 99% accurate?`,
    a: `<p>Because the disease is rare (1 in 1000). Healthy people vastly outnumber sick people, so even a tiny 1% false-alarm rate produces many more false positives than true positives. The base rate dominates.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-total-prob",
  title: "Total probability theorem",
  tagline: "Split a hard question into easy cases, then weigh and add them up.",
  prereqs: ["prob-conditional"],
  bigIdea:
    `<p>Sometimes the chance of $B$ is hard to find directly.</p>
     <p>But if you split the world into separate cases, $B$ is easy inside each case.</p>
     <p>So compute $B$'s chance case by case, weight each by how likely that case is, and add.</p>
     <p>This is "divide and conquer" for probability.</p>`,
  buildup:
    `<p>Suppose the world splits cleanly into pieces $A_1, A_2, \\dots$ that don't overlap and cover everything. That is called a <b>partition</b>.</p>
     <p>Example: every person is either an adult or a child — two pieces that cover everyone with no overlap.</p>
     <p>Inside each piece, $B$'s chance is simpler to reason about.</p>`,
  symbols: [
    { sym: "$A_i$", desc: "the $i$-th case in the partition (the pieces the world is split into)." },
    { sym: "partition", desc: "a set of non-overlapping cases $A_1, A_2, \\dots$ that together cover all of $\\Omega$." },
    { sym: "$P(A_i)$", desc: "how likely case $A_i$ is — its weight." },
    { sym: "$P(B \\mid A_i)$", desc: "the chance of $B$ inside case $A_i$." },
    { sym: "$\\sum_i$", desc: "'add up over all cases $i$'. The $\\Sigma$ is a capital Greek S, for Sum." }
  ],
  formula: `$$ P(B) = \\sum_i P(A_i)\\, P(B \\mid A_i) $$`,
  whatItDoes:
    `<p>For each case $A_i$: multiply how likely that case is, $P(A_i)$, by the chance of $B$ inside it, $P(B \\mid A_i)$.</p>
     <p>Add all those products together.</p>
     <p>The cases cover everything with no overlap, so nothing is missed and nothing is double-counted.</p>`,
  example:
    `<p>Two factories make light bulbs. Factory 1 makes 60% of them, with a 2% defect rate. Factory 2 makes 40%, with a 5% defect rate. Pick a random bulb. What's the chance it's defective?</p>
     <ul class="steps">
       <li>Cases: $A_1$ = from factory 1 ($P = 0.6$), $A_2$ = from factory 2 ($P = 0.4$).</li>
       <li>Defect chance per case: $P(D \\mid A_1) = 0.02$, $P(D \\mid A_2) = 0.05$.</li>
       <li>Factory 1 contribution: $0.6 \\times 0.02 = 0.012$.</li>
       <li>Factory 2 contribution: $0.4 \\times 0.05 = 0.020$.</li>
       <li>Add: $P(D) = 0.012 + 0.020 = 0.032$, i.e. a 3.2% defect rate overall.</li>
     </ul>`,
  application:
    `<p>This theorem is the denominator $P(B)$ inside Bayes' rule. Any time a model averages over hidden cases (which topic generated this word? which cluster is this point in?), total probability is doing the work.</p>`,
  quiz: {
    q: `A bag has 70% red apples (10% bruised) and 30% green apples (20% bruised). What is the overall chance an apple is bruised?`,
    a: `<p>$0.7 \\times 0.10 + 0.3 \\times 0.20 = 0.07 + 0.06 = 0.13$, or 13%.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-independence",
  title: "Independence",
  tagline: "When one event tells you nothing about another, they're independent — and the math gets easy.",
  prereqs: ["prob-conditional"],
  bigIdea:
    `<p>Two events are <b>independent</b> when knowing one tells you nothing about the other.</p>
     <p>A coin flip doesn't care what the last flip did. Those flips are independent.</p>
     <p>When events are independent, the chance of both is just their chances multiplied.</p>
     <p>This 'multiply' rule makes huge calculations possible.</p>`,
  buildup:
    `<p>Conditional probability $P(A \\mid B)$ asks how $B$ changes $A$'s odds.</p>
     <p>What if $B$ changes nothing? Then $P(A \\mid B) = P(A)$.</p>
     <p>Plug that into the conditional formula and the 'and' probability simplifies beautifully.</p>`,
  symbols: [
    { sym: "$A, B$", desc: "two events." },
    { sym: "$P(A \\cap B)$", desc: "the chance that both $A$ and $B$ happen." },
    { sym: "$P(A)\\,P(B)$", desc: "the two individual chances multiplied together." },
    { sym: "iff", desc: "'if and only if' — the rule on the left is true exactly when the rule on the right is." }
  ],
  formula: `$$ A, B \\text{ independent} \\iff P(A \\cap B) = P(A)\\,P(B) \\iff P(A \\mid B) = P(A) $$`,
  whatItDoes:
    `<p>The middle test: if the chance of both equals the product of the two chances, the events are independent.</p>
     <p>The right test says the same thing differently: knowing $B$ leaves $A$'s probability unchanged.</p>
     <p>Warning: independent is NOT the same as disjoint. Disjoint events can't co-occur, so they actually depend on each other a lot.</p>`,
  example:
    `<p>Flip a fair coin twice. Let $A$ = "first flip heads", $B$ = "second flip heads".</p>
     <ul class="steps">
       <li>$P(A) = \\frac{1}{2}$ and $P(B) = \\frac{1}{2}$.</li>
       <li>The product is $\\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$.</li>
       <li>Check directly: outcomes are $\\{HH, HT, TH, TT\\}$, and "both heads" is just $HH$, so $P(A \\cap B) = \\frac{1}{4}$.</li>
       <li>They match, so the flips are independent. The first flip says nothing about the second.</li>
     </ul>`,
  application:
    `<p>The 'Naive Bayes' spam classifier assumes every word appears independently. That assumption is not quite true, but it lets the model just multiply many small probabilities together — and it works shockingly well.</p>`,
  quiz: {
    q: `$P(A) = 0.5$, $P(B) = 0.4$, and $P(A \\cap B) = 0.2$. Are $A$ and $B$ independent?`,
    a: `<p>Check: $P(A)P(B) = 0.5 \\times 0.4 = 0.2$, which equals $P(A \\cap B) = 0.2$. Yes, they are independent.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-counting",
  title: "Counting: permutations & combinations",
  tagline: "To find a probability, you often just have to count carefully. Order is the key question.",
  prereqs: ["prob-axioms"],
  bigIdea:
    `<p>Many probabilities are just "favorable count divided by total count".</p>
     <p>So you need to count how many ways something can happen.</p>
     <p>The key question: does order matter?</p>
     <p>If order matters, use permutations. If it doesn't, use combinations.</p>`,
  buildup:
    `<p>To arrange $r$ items out of $n$, the first slot has $n$ choices, the next $n-1$, and so on.</p>
     <p>That product is a permutation — order matters (gold, silver, bronze are different).</p>
     <p>If order does NOT matter (just 'which 3 people', not their ranks), you've over-counted. Divide out the orderings to get a combination.</p>`,
  symbols: [
    { sym: "$n$", desc: "the total number of items to choose from." },
    { sym: "$r$", desc: "how many you pick." },
    { sym: "$n!$", desc: "'n factorial': $n \\times (n-1) \\times \\dots \\times 2 \\times 1$. So $4! = 4\\times3\\times2\\times1 = 24$. Also, $0! = 1$." },
    { sym: "$\\binom{n}{r}$", desc: "'n choose r': the number of ways to pick $r$ items when order does NOT matter." }
  ],
  formula: `$$ \\text{order matters: } \\frac{n!}{(n-r)!} \\qquad\\quad \\text{order doesn't: } \\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!} $$`,
  whatItDoes:
    `<p>The permutation $\\frac{n!}{(n-r)!}$ counts ordered arrangements of $r$ items.</p>
     <p>The combination $\\binom{n}{r}$ takes that and divides by $r!$, the number of ways to reorder $r$ chosen items, since those reorderings are all the 'same' pick.</p>`,
  example:
    `<p>A class of 5 students. (a) How many ways to line up 3 of them for a photo (order matters)? (b) How many ways to pick 3 for a team (order doesn't)?</p>
     <ul class="steps">
       <li>Permutations: $\\frac{5!}{(5-3)!} = \\frac{5!}{2!} = \\frac{120}{2} = 60$ ordered line-ups.</li>
       <li>Combinations: $\\binom{5}{3} = \\frac{5!}{3!\\,2!} = \\frac{120}{6 \\times 2} = \\frac{120}{12} = 10$ teams.</li>
       <li>Notice $60$ is $10 \\times 6$: each team of 3 can be lined up in $3! = 6$ orders.</li>
     </ul>`,
  application:
    `<p>Combinations appear inside the binomial distribution (next lessons), in counting possible feature subsets, and in calculating the odds of card hands or lottery wins. Counting correctly is the foundation of discrete probability.</p>`,
  quiz: {
    q: `How many ways can you choose 2 toppings from 4 available (order doesn't matter)?`,
    a: `<p>$\\binom{4}{2} = \\frac{4!}{2!\\,2!} = \\frac{24}{2 \\times 2} = \\frac{24}{4} = 6$ ways.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-random-variable",
  title: "Random variable & PMF",
  tagline: "Turn messy outcomes into numbers, then list how likely each number is.",
  prereqs: ["prob-axioms"],
  bigIdea:
    `<p>Outcomes like "heads" or "defective" are hard to do math with.</p>
     <p>A <b>random variable</b> turns each outcome into a number.</p>
     <p>The <b>PMF</b> (probability mass function) then lists how likely each number is.</p>
     <p>Now you can add, average, and compute — because everything is numbers.</p>`,
  buildup:
    `<p>Say you flip 3 coins. The outcome is messy: $HTH$, $TTH$, and so on.</p>
     <p>Define a random variable $X$ = "number of heads". Now every outcome becomes 0, 1, 2, or 3.</p>
     <p>The PMF tells you the chance of each of those numbers.</p>`,
  symbols: [
    { sym: "$X$", desc: "a random variable: a rule that assigns a number to each outcome. Capital letter." },
    { sym: "$x$", desc: "a particular value that $X$ can take (lower-case)." },
    { sym: "$p_X(x)$", desc: "the PMF: the probability that $X$ equals the value $x$." },
    { sym: "$P(X = x)$", desc: "another way to write 'the probability that $X$ equals $x$'." },
    { sym: "$\\sum_x$", desc: "'add up over every value $x$ that $X$ can take'." }
  ],
  formula: `$$ p_X(x) = P(X = x) \\qquad \\sum_x p_X(x) = 1 $$`,
  whatItDoes:
    `<p>The left part defines the PMF: plug in a value $x$, get the chance $X$ lands on it.</p>
     <p>The right part is the normalization rule: $X$ must take SOME value, so all the chances add to 1.</p>`,
  example:
    `<p>Flip 2 fair coins. Let $X$ = number of heads. Outcomes: $\\{HH, HT, TH, TT\\}$, each with chance $\\frac{1}{4}$.</p>
     <ul class="steps">
       <li>$X = 0$ (no heads): only $TT$, so $p_X(0) = \\frac{1}{4}$.</li>
       <li>$X = 1$ (one head): $HT$ or $TH$, so $p_X(1) = \\frac{2}{4} = \\frac{1}{2}$.</li>
       <li>$X = 2$ (two heads): only $HH$, so $p_X(2) = \\frac{1}{4}$.</li>
       <li>Check they add to 1: $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{4} = 1$. ✔</li>
     </ul>`,
  application:
    `<p>A model's output 'how many clicks will this ad get?' is a random variable. Its PMF is the model's prediction. Random variables are how we attach numbers and probabilities to real-world uncertainty.</p>`,
  quiz: {
    q: `Roll a fair die, $X$ = the face shown. What is $p_X(3)$, and do all six values' probabilities add to 1?`,
    a: `<p>$p_X(3) = \\frac{1}{6}$. Each of the six faces has probability $\\frac{1}{6}$, and $6 \\times \\frac{1}{6} = 1$. ✔</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-expectation",
  title: "Expectation (the mean)",
  tagline: "The long-run average value. Weight each outcome by its chance, then add.",
  prereqs: ["prob-random-variable"],
  bigIdea:
    `<p>The <b>expectation</b> is the average value you'd get if you repeated the experiment forever.</p>
     <p>It is a weighted average: each value counts in proportion to how likely it is.</p>
     <p>It is the single number that best summarizes 'what to expect'.</p>
     <p>Almost every model is trained to make its expected error small.</p>`,
  buildup:
    `<p>A plain average treats every value equally. But some values are more likely than others.</p>
     <p>So weight each value by its probability before adding.</p>
     <p>Rare big values count less; common values count more. That weighted sum is the expectation.</p>`,
  symbols: [
    { sym: "$E[X]$", desc: "the expectation (mean) of $X$. 'E' for Expected value." },
    { sym: "$\\mu$", desc: "another name for the mean (Greek 'mu'). $\\mu = E[X]$." },
    { sym: "$x$", desc: "a value $X$ can take." },
    { sym: "$p_X(x)$", desc: "the probability that $X$ equals $x$ (the PMF)." },
    { sym: "$aX + b$", desc: "a rescaled variable: multiply $X$ by a constant $a$ and add a constant $b$." }
  ],
  formula: `$$ E[X] = \\sum_x x\\, p_X(x) \\qquad E[aX + b] = a\\,E[X] + b $$`,
  whatItDoes:
    `<p>For each value $x$: multiply it by its chance $p_X(x)$, then add up all those products.</p>
     <p>The second formula (linearity) says: scaling and shifting $X$ scales and shifts its mean the same way. Very handy.</p>`,
  example:
    `<p>A game: roll a fair die, win that many dollars. What's your expected winning?</p>
     <ul class="steps">
       <li>Each face $1$ through $6$ has probability $\\frac{1}{6}$.</li>
       <li>$E[X] = 1\\cdot\\frac{1}{6} + 2\\cdot\\frac{1}{6} + 3\\cdot\\frac{1}{6} + 4\\cdot\\frac{1}{6} + 5\\cdot\\frac{1}{6} + 6\\cdot\\frac{1}{6}$.</li>
       <li>$= \\frac{1+2+3+4+5+6}{6} = \\frac{21}{6} = 3.5$.</li>
       <li>So on average you win \\$3.50 per roll — even though 3.5 is never an actual roll.</li>
       <li>Linearity: if the prize doubles and adds \\$1, expected winning is $2 \\times 3.5 + 1 = \\$8$.</li>
     </ul>`,
  application:
    `<p>'Expected loss' is the quantity nearly every ML model minimizes during training. Expected value also drives decision-making: an A/B test picks the option with the higher expected payoff.</p>`,
  quiz: {
    q: `A coin pays \\$10 for heads, \\$0 for tails, each with chance $\\frac{1}{2}$. What is $E[X]$?`,
    a: `<p>$E[X] = 10 \\times \\frac{1}{2} + 0 \\times \\frac{1}{2} = 5$. The expected payout is \\$5.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-variance",
  title: "Variance & standard deviation",
  tagline: "The mean tells you the center. Variance tells you the spread.",
  prereqs: ["prob-expectation"],
  bigIdea:
    `<p>Two things can have the same average but feel totally different.</p>
     <p>One is steady; the other swings wildly. The <b>variance</b> measures that swing.</p>
     <p>It is the expected squared distance from the mean.</p>
     <p>The <b>standard deviation</b> is its square root — spread in the original units.</p>`,
  buildup:
    `<p>You know the mean $\\mu$ is the center.</p>
     <p>For each value, measure how far it is from $\\mu$. Square that distance (so big gaps count extra and signs don't cancel).</p>
     <p>Average those squared distances. That average is the variance.</p>`,
  symbols: [
    { sym: "$\\mu$", desc: "the mean of $X$, i.e. $E[X]$ (Greek 'mu')." },
    { sym: "$\\operatorname{Var}(X)$", desc: "the variance of $X$: the average squared distance from the mean." },
    { sym: "$(X - \\mu)^2$", desc: "the squared distance of $X$ from its mean." },
    { sym: "$E[X^2]$", desc: "the mean of $X$ squared (square first, then average)." },
    { sym: "$\\sigma$", desc: "the standard deviation (Greek 'sigma'): the square root of the variance." },
    { sym: "$\\sqrt{\\;}$", desc: "the square root: undoes the squaring, putting spread back in original units." }
  ],
  formula: `$$ \\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2 \\qquad \\sigma = \\sqrt{\\operatorname{Var}(X)} $$`,
  whatItDoes:
    `<p>The first form: average the squared distances from the mean.</p>
     <p>The second form is a shortcut: 'mean of the square' minus 'square of the mean'. It gives the same answer with less work.</p>
     <p>Take the square root to get $\\sigma$, the spread measured in the same units as $X$.</p>
     <p><b>Variance and standard deviation carry the same information — the only difference is units.</b> Squaring the distances also squares the units. If $X$ is in dollars, the variance comes out in <i>dollars squared</i> — which is not a real-world thing (1 <i>what</i>?). The square root undoes that, so $\\sigma$ is back in plain dollars: a typical distance from the mean.</p>
     <p>So use <b>variance</b> when you are doing the math — it behaves nicely in formulas (variances of independent things simply add). Report <b>standard deviation</b> to a human, because it is a real, feelable distance in the data's own units. The notation even says it: variance is $\\sigma^2$, standard deviation is $\\sigma$ — one is literally the square of the other.</p>`,
  example:
    `<p>Let $X$ be a fair coin worth \\$0 (tails) or \\$2 (heads), each chance $\\frac{1}{2}$.</p>
     <ul class="steps">
       <li>Mean: $E[X] = 0 \\times \\frac{1}{2} + 2 \\times \\frac{1}{2} = 1$. So $\\mu = 1$.</li>
       <li>$E[X^2] = 0^2 \\times \\frac{1}{2} + 2^2 \\times \\frac{1}{2} = 0 + 2 = 2$.</li>
       <li>$\\operatorname{Var}(X) = E[X^2] - (E[X])^2 = 2 - 1^2 = 2 - 1 = 1$.</li>
       <li>Standard deviation: $\\sigma = \\sqrt{1} = 1$. Values sit about \\$1 away from the \\$1 mean — which matches \\$0 and \\$2.</li>
     </ul>`,
  application:
    `<p>In finance, variance is risk. In ML, high variance in a model's predictions signals overfitting. The bias-variance tradeoff — a central idea in machine learning — is named after this exact quantity.</p>`,
  quiz: {
    q: `A variable is always exactly 7 (no randomness). What is its variance?`,
    a: `<p>0. It never moves away from its mean of 7, so the average squared distance is 0. No spread.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-bernoulli-binomial",
  title: "Bernoulli & Binomial",
  tagline: "One yes/no trial, then many of them. The building blocks of counting successes.",
  prereqs: ["prob-expectation", "prob-counting", "prob-random-variable"],
  bigIdea:
    `<p>A <b>Bernoulli</b> trial is a single yes/no event: success or failure.</p>
     <p>One coin flip. One ad shown: clicked or not.</p>
     <p>A <b>Binomial</b> is many independent Bernoulli trials added up.</p>
     <p>It answers: 'out of $n$ tries, how many successes?'</p>`,
  buildup:
    `<p>Call success probability $p$. A Bernoulli variable is 1 with chance $p$, and 0 with chance $1-p$.</p>
     <p>Now do $n$ of these independently and count the successes.</p>
     <p>To land exactly $k$ successes you need $k$ wins and $n-k$ losses, and there are $\\binom{n}{k}$ ways to arrange which trials won.</p>`,
  symbols: [
    { sym: "$p$", desc: "the probability of success on one trial (between 0 and 1)." },
    { sym: "$1 - p$", desc: "the probability of failure on one trial." },
    { sym: "$n$", desc: "the number of trials." },
    { sym: "$k$", desc: "the number of successes we ask about." },
    { sym: "$\\binom{n}{k}$", desc: "'n choose k': the number of ways to pick which $k$ of the $n$ trials succeeded." },
    { sym: "$p^k$", desc: "$p$ multiplied by itself $k$ times: the chance of $k$ specific successes." }
  ],
  formula: `$$ \\text{Bernoulli: } E[X] = p,\\;\\; \\operatorname{Var}(X) = p(1-p) \\qquad \\text{Binomial: } P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k},\\;\\; E[X] = np $$`,
  whatItDoes:
    `<p>For the Binomial: $p^k (1-p)^{n-k}$ is the chance of one specific pattern with $k$ wins, and $\\binom{n}{k}$ counts all the patterns with exactly $k$ wins.</p>
     <p>Multiply them to get the total chance of exactly $k$ successes.</p>
     <p>The mean $np$ is intuitive: $n$ trials each contributing $p$ on average.</p>`,
  example:
    `<p>Flip a fair coin ($p = 0.5$) 3 times. What's the chance of exactly 2 heads?</p>
     <ul class="steps">
       <li>$n = 3$, $k = 2$, $p = 0.5$.</li>
       <li>Count the patterns: $\\binom{3}{2} = 3$ ways (HHT, HTH, THH).</li>
       <li>Each pattern's chance: $p^2 (1-p)^1 = 0.5^2 \\times 0.5^1 = 0.25 \\times 0.5 = 0.125$.</li>
       <li>Multiply: $P(X=2) = 3 \\times 0.125 = 0.375$, i.e. 37.5%.</li>
       <li>Mean number of heads: $np = 3 \\times 0.5 = 1.5$.</li>
     </ul>`,
  application:
    `<p>Click-through rates, conversion counts, and A/B test outcomes are all Binomial: $n$ visitors, each clicking with probability $p$. Logistic regression models the Bernoulli success probability $p$ for each example.</p>`,
  quiz: {
    q: `An archer hits the target with probability $0.8$ on each shot. In 5 shots, what is the expected number of hits?`,
    a: `<p>$E[X] = np = 5 \\times 0.8 = 4$ hits on average.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-geometric-poisson",
  title: "Geometric & Poisson",
  tagline: "How long until the first success? And how many rare events in a window?",
  prereqs: ["prob-bernoulli-binomial"],
  bigIdea:
    `<p>The <b>Geometric</b> distribution counts trials until the first success.</p>
     <p>'How many times must I roll before I get a six?'</p>
     <p>The <b>Poisson</b> distribution counts rare events in a fixed window.</p>
     <p>'How many emails will arrive this hour?'</p>`,
  buildup:
    `<p>For Geometric: to get the first success on trial $k$, you must fail $k-1$ times, then succeed once. Failures multiply, then one success.</p>
     <p>For Poisson: imagine many tiny independent chances over a window, with $\\lambda$ events expected on average. The formula below pops out.</p>`,
  symbols: [
    { sym: "$p$", desc: "the success probability on each trial (Geometric)." },
    { sym: "$k$", desc: "the trial number of the first success (Geometric), or the count of events (Poisson)." },
    { sym: "$\\lambda$", desc: "the average number of events expected in the window (Poisson). Greek 'lambda'." },
    { sym: "$e$", desc: "Euler's number, about $2.718$. A fixed constant that shows up in growth and decay." },
    { sym: "$k!$", desc: "'k factorial': $k \\times (k-1) \\times \\dots \\times 1$." }
  ],
  formula: `$$ \\text{Geometric: } P(X = k) = (1-p)^{k-1} p,\\;\\; E[X] = \\frac{1}{p} \\qquad \\text{Poisson: } P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!},\\;\\; E[X] = \\lambda $$`,
  whatItDoes:
    `<p>Geometric: $(1-p)^{k-1}$ is the chance of failing the first $k-1$ times, and $p$ is the success on trial $k$. Mean $\\frac{1}{p}$: rarer success means longer wait.</p>
     <p>Poisson: with average rate $\\lambda$, this gives the chance of seeing exactly $k$ events. Its mean is simply $\\lambda$.</p>`,
  example:
    `<p>(a) Roll a die until the first six ($p = \\frac{1}{6}$). Chance the first six comes on roll 3? (b) A call center gets $\\lambda = 2$ calls per minute. Chance of exactly 0 calls in a minute?</p>
     <ul class="steps">
       <li>Geometric: $P(X=3) = (1-\\frac{1}{6})^{2} \\times \\frac{1}{6} = (\\frac{5}{6})^2 \\times \\frac{1}{6} = \\frac{25}{36} \\times \\frac{1}{6} \\approx 0.116$.</li>
       <li>Expected wait for a six: $\\frac{1}{p} = \\frac{1}{1/6} = 6$ rolls.</li>
       <li>Poisson: $P(X=0) = \\frac{\\lambda^0 e^{-\\lambda}}{0!} = \\frac{1 \\times e^{-2}}{1} = e^{-2} \\approx 0.135$.</li>
       <li>So about a 13.5% chance of a quiet minute with no calls.</li>
     </ul>`,
  application:
    `<p>Poisson models website hits, server requests, and rare defects. Geometric models 'tries until conversion'. Both appear in queueing systems and in modeling counts of rare events in data.</p>`,
  quiz: {
    q: `A Poisson process averages $\\lambda = 3$ events per hour. What is the expected number of events in an hour?`,
    a: `<p>For a Poisson distribution, $E[X] = \\lambda = 3$ events.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-pdf-cdf",
  title: "Continuous variables: PDF & CDF",
  tagline: "When outcomes are smooth (like height), probability becomes area under a curve.",
  prereqs: ["prob-random-variable", "fnd-derivative"],
  bigIdea:
    `<p>Some quantities are continuous: height, weight, time. They can be any value in a range.</p>
     <p>There are infinitely many exact values, so any single one has probability 0.</p>
     <p>Instead, probability becomes <b>area under a curve</b> over a range.</p>
     <p>The curve is the PDF; the running total of area is the CDF.</p>`,
  buildup:
    `<p>For discrete variables, the PMF gave the chance of each exact value.</p>
     <p>For continuous variables, we use a <b>density</b> curve $f_X$ instead. Height of the curve is not probability — area is.</p>
     <p>'Area under a curve' is computed by an integral, written $\\int$. Total area must be 1.</p>`,
  symbols: [
    { sym: "$f_X(x)$", desc: "the PDF (probability density function): the height of the curve at value $x$." },
    { sym: "$\\int$", desc: "an integral: it adds up area under a curve (the smooth version of a sum $\\sum$)." },
    { sym: "$F_X(x)$", desc: "the CDF (cumulative distribution function): total probability up to and including $x$." },
    { sym: "$P(X \\le x)$", desc: "the probability that $X$ is at most $x$." },
    { sym: "$-\\infty$", desc: "'negative infinity': start counting area from the far left, before any value." }
  ],
  formula: `$$ \\int_{-\\infty}^{\\infty} f_X(x)\\, dx = 1 \\qquad F_X(x) = P(X \\le x) = \\int_{-\\infty}^{x} f_X(t)\\, dt $$`,
  whatItDoes:
    `<p>The first equation: the total area under the whole density curve is exactly 1 (probabilities must sum to 1).</p>
     <p>The CDF $F_X(x)$ accumulates area from the far left up to $x$. So it climbs from 0 to 1 as $x$ increases.</p>
     <p>The chance $X$ lands between $a$ and $b$ is the area in that slice, $F_X(b) - F_X(a)$.</p>`,
  example:
    `<p>Let $X$ be uniform on $[0, 2]$: the density is a flat line at height $\\frac{1}{2}$ over that range.</p>
     <ul class="steps">
       <li>Total area: width $\\times$ height $= 2 \\times \\frac{1}{2} = 1$. ✔ It's a valid PDF.</li>
       <li>Chance $X \\le 1$: area from 0 to 1 is $1 \\times \\frac{1}{2} = \\frac{1}{2}$. So $F_X(1) = 0.5$.</li>
       <li>Chance $X$ between 0.5 and 1.5: width $1 \\times \\frac{1}{2} = \\frac{1}{2}$.</li>
       <li>Chance $X$ equals exactly 1: a line has zero width, so the area — and the probability — is 0.</li>
     </ul>`,
  application:
    `<p>Continuous densities model sensor readings, prices, and neural-network outputs. When a model reports 'the probability the value is below this threshold', it is reading off a CDF.</p>`,
  quiz: {
    q: `For the uniform density on $[0,2]$ at height $\\frac{1}{2}$, what is the probability that $X$ is between 1 and 2?`,
    a: `<p>Area $=$ width $\\times$ height $= 1 \\times \\frac{1}{2} = \\frac{1}{2}$. A 50% chance.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-uniform-exponential",
  title: "Uniform & Exponential",
  tagline: "Perfectly flat odds, and the math of waiting times.",
  prereqs: ["prob-pdf-cdf"],
  bigIdea:
    `<p>The <b>Uniform</b> distribution is perfectly flat: every value in a range is equally likely.</p>
     <p>The <b>Exponential</b> distribution models waiting time until the next event.</p>
     <p>'How long until the next bus?' is exponential.</p>
     <p>It is <b>memoryless</b>: having waited already doesn't change how much longer you'll wait.</p>`,
  buildup:
    `<p>Uniform: if nothing favors any value, the density is a constant. Over $[a,b]$ that height must be $\\frac{1}{b-a}$ so the area is 1.</p>
     <p>Exponential: events happen at a steady rate $\\lambda$. The wait until the next one decays — short waits are common, long waits rare.</p>`,
  symbols: [
    { sym: "$a, b$", desc: "the low and high ends of the Uniform range." },
    { sym: "$f(x)$", desc: "the PDF: the height of the density curve at $x$." },
    { sym: "$\\frac{1}{b-a}$", desc: "the constant height of the Uniform density (1 over the width of the range)." },
    { sym: "$\\lambda$", desc: "the rate of the Exponential: events per unit time (Greek 'lambda')." },
    { sym: "$e^{-\\lambda x}$", desc: "a decaying curve: starts high and drops as $x$ grows. $e \\approx 2.718$." }
  ],
  formula: `$$ \\text{Uniform: } f(x) = \\frac{1}{b-a},\\;\\; E[X] = \\frac{a+b}{2} \\qquad \\text{Exponential: } f(x) = \\lambda e^{-\\lambda x},\\;\\; E[X] = \\frac{1}{\\lambda} $$`,
  whatItDoes:
    `<p>Uniform: a flat curve of height $\\frac{1}{b-a}$. Its mean $\\frac{a+b}{2}$ is just the midpoint of the range.</p>
     <p>Exponential: a curve that decays. Mean wait $\\frac{1}{\\lambda}$ — a faster rate $\\lambda$ means a shorter wait.</p>`,
  example:
    `<p>(a) A bus is equally likely to arrive any minute in $[0, 10]$. (b) Calls arrive at rate $\\lambda = \\frac{1}{5}$ per minute (one every 5 minutes on average).</p>
     <ul class="steps">
       <li>Uniform mean wait: $\\frac{a+b}{2} = \\frac{0 + 10}{2} = 5$ minutes.</li>
       <li>Uniform density height: $\\frac{1}{b-a} = \\frac{1}{10}$ over the range.</li>
       <li>Exponential mean wait: $\\frac{1}{\\lambda} = \\frac{1}{1/5} = 5$ minutes until the next call.</li>
       <li>Memoryless: if you've already waited 3 minutes, the expected remaining wait is still 5 minutes. The clock 'forgets'.</li>
     </ul>`,
  application:
    `<p>Uniform is used to initialize neural-network weights and to generate random samples. Exponential models time-between-events: server request gaps, equipment failures, customer arrivals.</p>`,
  quiz: {
    q: `A Uniform random variable runs over $[2, 8]$. What is its mean?`,
    a: `<p>$E[X] = \\frac{a+b}{2} = \\frac{2+8}{2} = \\frac{10}{2} = 5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-normal",
  title: "Normal (Gaussian) distribution",
  tagline: "The famous bell curve. Nature's default shape, and it's everywhere.",
  prereqs: ["prob-pdf-cdf", "prob-variance"],
  bigIdea:
    `<p>The <b>Normal</b> distribution is the classic bell-shaped curve.</p>
     <p>Most values cluster near the middle; extremes are rare on both sides.</p>
     <p>It shows up everywhere: heights, test scores, measurement errors.</p>
     <p>It is described by just two numbers: the center $\\mu$ and the spread $\\sigma$.</p>`,
  buildup:
    `<p>You know the mean $\\mu$ sets the center and $\\sigma$ sets the spread.</p>
     <p>The Normal curve is tallest at $\\mu$ and falls off symmetrically on each side.</p>
     <p>The formula looks scary, but it just encodes 'peak at $\\mu$, width set by $\\sigma$'.</p>`,
  symbols: [
    { sym: "$\\mathcal{N}(\\mu, \\sigma^2)$", desc: "a Normal distribution with mean $\\mu$ and variance $\\sigma^2$." },
    { sym: "$\\mu$", desc: "the mean: where the bell is centered (Greek 'mu')." },
    { sym: "$\\sigma$", desc: "the standard deviation: how wide the bell is (Greek 'sigma')." },
    { sym: "$\\sigma^2$", desc: "the variance: $\\sigma$ squared." },
    { sym: "$\\pi$", desc: "pi, about $3.14159$ — yes, the circle constant shows up here too." },
    { sym: "$e$", desc: "Euler's number, about $2.718$. The $e^{-(\\dots)}$ makes the tails fall off fast." }
  ],
  formula: `$$ f(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\, e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2} $$`,
  whatItDoes:
    `<p>The $\\frac{x - \\mu}{\\sigma}$ part measures 'how many standard deviations is $x$ from the center?'</p>
     <p>Squaring it and putting it in $e^{-(\\dots)}$ makes the curve drop quickly as you move away from $\\mu$.</p>
     <p>The front fraction $\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}$ just scales the curve so its total area is 1.</p>`,
  example:
    `<p>Adult heights are roughly Normal with $\\mu = 170$ cm and $\\sigma = 10$ cm. Use the <b>68-95-99.7 rule</b>.</p>
     <ul class="steps">
       <li>About 68% of values fall within 1 $\\sigma$: between $170 - 10 = 160$ and $170 + 10 = 180$ cm.</li>
       <li>About 95% fall within 2 $\\sigma$: between $170 - 20 = 150$ and $170 + 20 = 190$ cm.</li>
       <li>About 99.7% fall within 3 $\\sigma$: between $140$ and $200$ cm.</li>
       <li>So a height of 200 cm is about 3 $\\sigma$ out — very rare (top ~0.15%).</li>
     </ul>`,
  application:
    `<p>The Normal is the default assumption for noise and errors in countless models. Linear regression assumes Normal residuals. Many neural-network weights are initialized from a Normal. It is the most important distribution in all of ML.</p>`,
  quiz: {
    q: `Test scores are Normal with $\\mu = 500$, $\\sigma = 100$. Roughly what percent of scores fall between 400 and 600?`,
    a: `<p>That's $\\mu \\pm 1\\sigma$ (one standard deviation each way). By the 68-95-99.7 rule, about <b>68%</b> of scores fall there.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-joint-marginal",
  title: "Joint & marginal distributions",
  tagline: "Two variables at once. Sum out one to get the other back.",
  prereqs: ["prob-random-variable"],
  bigIdea:
    `<p>Often two things vary together: height and weight, ad shown and click.</p>
     <p>A <b>joint distribution</b> gives the chance of every combination of the two.</p>
     <p>Think of it as a table: rows for one variable, columns for the other.</p>
     <p>A <b>marginal</b> distribution recovers one variable alone by summing out the other.</p>`,
  buildup:
    `<p>One variable had a PMF $p_X(x)$. Two variables have a joint PMF $p_{X,Y}(x, y)$ — a chance for each pair.</p>
     <p>To get $X$ by itself, you don't care about $Y$. So add up over all values of $Y$.</p>
     <p>Summing over a variable 'integrates it out' — the answer sits in the margin of the table, hence 'marginal'.</p>`,
  symbols: [
    { sym: "$p_{X,Y}(x, y)$", desc: "the joint PMF: the chance that $X = x$ AND $Y = y$ together." },
    { sym: "$p_X(x)$", desc: "the marginal PMF of $X$ alone: the chance $X = x$, ignoring $Y$." },
    { sym: "$\\sum_y$", desc: "'add up over every value $y$ of $Y$'." },
    { sym: "$x, y$", desc: "particular values of the two variables $X$ and $Y$." }
  ],
  formula: `$$ p_X(x) = \\sum_y p_{X,Y}(x, y) \\qquad \\Big(\\text{continuous: } f_X(x) = \\int f_{X,Y}(x, y)\\, dy\\Big) $$`,
  whatItDoes:
    `<p>To find the marginal of $X$ at value $x$: fix $x$, then add the joint probabilities across all $y$.</p>
     <p>You're collapsing the table down one direction. $Y$ disappears; $X$ remains.</p>
     <p>For continuous variables, replace the sum $\\sum$ with an integral $\\int$.</p>`,
  example:
    `<p>Joint table for weather ($Y$ = Sunny/Rainy) and your mood ($X$ = Happy/Sad):</p>
     <ul class="steps">
       <li>$P(\\text{Happy, Sunny}) = 0.4$, $P(\\text{Happy, Rainy}) = 0.1$.</li>
       <li>$P(\\text{Sad, Sunny}) = 0.2$, $P(\\text{Sad, Rainy}) = 0.3$. (These four add to 1.)</li>
       <li>Marginal of mood = Happy: sum over weather $= 0.4 + 0.1 = 0.5$.</li>
       <li>Marginal of mood = Sad: $0.2 + 0.3 = 0.5$.</li>
       <li>Marginal of weather = Sunny: $0.4 + 0.2 = 0.6$. So it's sunny 60% of the time.</li>
     </ul>`,
  application:
    `<p>Joint distributions describe how features relate. Probabilistic graphical models and Bayesian networks are built entirely from joint and marginal distributions. Marginalizing out hidden variables is a core inference step.</p>`,
  quiz: {
    q: `From the table above, what is the marginal probability that the weather is Rainy?`,
    a: `<p>Sum the Rainy column: $P(\\text{Happy, Rainy}) + P(\\text{Sad, Rainy}) = 0.1 + 0.3 = 0.4$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-covariance-correlation",
  title: "Covariance & correlation",
  tagline: "Do two variables move together? These numbers tell you, and by how much.",
  prereqs: ["prob-joint-marginal", "prob-variance"],
  bigIdea:
    `<p>When one variable goes up, does the other tend to go up too?</p>
     <p><b>Covariance</b> answers that: positive means they rise together, negative means one rises as the other falls.</p>
     <p>But covariance's size depends on units, so it's hard to read.</p>
     <p><b>Correlation</b> rescales it to a clean range from $-1$ to $+1$.</p>`,
  buildup:
    `<p>Variance measured how one variable spreads. Covariance extends that to two variables moving together.</p>
     <p>If $X$ and $Y$ tend to be big at the same time, the product $XY$ is big on average — bigger than $E[X]E[Y]$.</p>
     <p>To compare across different scales, divide by both standard deviations. That gives correlation.</p>`,
  symbols: [
    { sym: "$\\operatorname{Cov}(X, Y)$", desc: "covariance: how $X$ and $Y$ move together." },
    { sym: "$E[XY]$", desc: "the mean of the product $X$ times $Y$." },
    { sym: "$E[X]\\,E[Y]$", desc: "the product of the two separate means." },
    { sym: "$\\rho$", desc: "correlation (Greek 'rho'): covariance rescaled to lie in $[-1, 1]$." },
    { sym: "$\\sigma_X, \\sigma_Y$", desc: "the standard deviations of $X$ and $Y$." }
  ],
  formula: `$$ \\operatorname{Cov}(X, Y) = E[XY] - E[X]\\,E[Y] \\qquad \\rho = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X\\,\\sigma_Y} \\in [-1, 1] $$`,
  whatItDoes:
    `<p>Covariance: 'mean of the product' minus 'product of the means'. If they move together, this is positive; if oppositely, negative; if unrelated, near 0.</p>
     <p>Correlation divides covariance by both spreads, giving a unit-free number. $+1$ = perfect straight-line up, $-1$ = perfect straight-line down, $0$ = no linear link.</p>`,
  example:
    `<p>Two variables with $E[X] = 2$, $E[Y] = 3$, $E[XY] = 8$, $\\sigma_X = 1$, $\\sigma_Y = 2$.</p>
     <ul class="steps">
       <li>Covariance: $E[XY] - E[X]E[Y] = 8 - (2 \\times 3) = 8 - 6 = 2$. Positive — they move together.</li>
       <li>Correlation: $\\rho = \\frac{\\operatorname{Cov}}{\\sigma_X \\sigma_Y} = \\frac{2}{1 \\times 2} = \\frac{2}{2} = 1$.</li>
       <li>$\\rho = 1$ means a perfect positive linear relationship.</li>
     </ul>`,
  application:
    `<p>Correlation finds related features in data. Highly correlated features are often redundant, so dropping one speeds up models. PCA works directly on the covariance matrix to find the main directions of variation.</p>`,
  quiz: {
    q: `If $\\operatorname{Cov}(X, Y) = 0$, what does that say about their correlation $\\rho$?`,
    a: `<p>$\\rho = \\frac{0}{\\sigma_X \\sigma_Y} = 0$. There's no linear relationship between $X$ and $Y$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-conditional-expectation",
  title: "Conditional expectation",
  tagline: "The average of one variable once you know the other. Averages can be done in stages.",
  prereqs: ["prob-expectation", "prob-joint-marginal"],
  bigIdea:
    `<p>The expectation gave the overall average of $X$.</p>
     <p><b>Conditional expectation</b> $E[X \\mid Y]$ is the average of $X$ once you know $Y$.</p>
     <p>It is a 'group-by' average: pick a group (a value of $Y$), then average $X$ inside it.</p>
     <p>A neat law says: averaging those group-averages gets you back the overall average.</p>`,
  buildup:
    `<p>Different groups have different averages. Tall parents tend to have taller kids.</p>
     <p>So $E[\\text{child height} \\mid \\text{tall parents}]$ differs from the overall average.</p>
     <p>If you weight each group's average by how common the group is and add, you recover the grand average. That's the <b>law of iterated expectations</b>.</p>`,
  symbols: [
    { sym: "$E[X \\mid Y]$", desc: "the average of $X$ given the value of $Y$. It depends on $Y$, so it's itself a random thing." },
    { sym: "$E[X]$", desc: "the overall (unconditional) average of $X$." },
    { sym: "$E[E[X \\mid Y]]$", desc: "the average (over $Y$) of the group-by-group averages." },
    { sym: "$Y$", desc: "the variable you condition on (the grouping variable)." }
  ],
  formula: `$$ E\\big[E[X \\mid Y]\\big] = E[X] $$`,
  whatItDoes:
    `<p>Inside: $E[X \\mid Y]$ gives one average per group of $Y$.</p>
     <p>Outside: average those group-averages, weighting each by how likely that group is.</p>
     <p>The result is the plain overall average $E[X]$. You can compute a mean in two stages and still land in the same place.</p>`,
  example:
    `<p>A factory's items come from two machines. Machine A (60% of items) makes items averaging 10 grams. Machine B (40%) averages 20 grams. What's the overall average weight?</p>
     <ul class="steps">
       <li>Group averages: $E[X \\mid A] = 10$, $E[X \\mid B] = 20$.</li>
       <li>Group sizes: $P(A) = 0.6$, $P(B) = 0.4$.</li>
       <li>Weight and add: $E[X] = 0.6 \\times 10 + 0.4 \\times 20 = 6 + 8 = 14$ grams.</li>
       <li>So the overall mean is 14 grams — exactly the law of iterated expectations in action.</li>
     </ul>`,
  application:
    `<p>A regression model literally predicts $E[Y \\mid X]$ — the average output given the inputs. Conditional expectation is the formal target of nearly all supervised learning.</p>`,
  quiz: {
    q: `Class A (half the students) averages 80 on a test; class B (the other half) averages 90. What is the overall average?`,
    a: `<p>$E[X] = 0.5 \\times 80 + 0.5 \\times 90 = 40 + 45 = 85$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-inequalities",
  title: "Markov & Chebyshev inequalities",
  tagline: "Bound the chance of extremes using only the mean and variance. No full distribution needed.",
  prereqs: ["prob-expectation", "prob-variance"],
  bigIdea:
    `<p>Sometimes you don't know the full distribution — just its mean, maybe its variance.</p>
     <p>These inequalities still let you bound how often extreme values happen.</p>
     <p><b>Markov</b> uses just the mean. <b>Chebyshev</b> uses the mean and variance for a tighter bound.</p>
     <p>They guarantee 'big surprises can't be too common'.</p>`,
  buildup:
    `<p>If a positive variable has a small mean, it can't often be huge — there's not enough 'average' to go around. That's Markov.</p>
     <p>If the variance (spread) is small, values can't stray far from the mean very often. That's Chebyshev.</p>
     <p>Both give upper bounds: 'at most this probability', without assuming any particular curve.</p>`,
  symbols: [
    { sym: "$X \\ge 0$", desc: "for Markov, $X$ must be nonnegative (no negative values)." },
    { sym: "$a$", desc: "a threshold: we ask how often $X$ reaches at least $a$." },
    { sym: "$E[X]$", desc: "the mean of $X$." },
    { sym: "$\\mu$", desc: "the mean (Greek 'mu'), same as $E[X]$." },
    { sym: "$\\epsilon$", desc: "a distance from the mean (Greek 'epsilon'): how far is 'far'?" },
    { sym: "$\\sigma^2$", desc: "the variance of $X$." }
  ],
  formula: `$$ \\text{Markov: } P(X \\ge a) \\le \\frac{E[X]}{a} \\qquad \\text{Chebyshev: } P(|X - \\mu| \\ge \\epsilon) \\le \\frac{\\sigma^2}{\\epsilon^2} $$`,
  whatItDoes:
    `<p>Markov: the chance $X$ reaches $a$ or more is at most the mean divided by $a$. A bigger threshold $a$ means a smaller bound.</p>
     <p>Chebyshev: the chance $X$ is at least $\\epsilon$ away from its mean is at most $\\frac{\\sigma^2}{\\epsilon^2}$. Less variance, or a bigger gap $\\epsilon$, means a smaller bound.</p>`,
  example:
    `<p>(a) Markov: scores average $E[X] = 50$ (and are nonnegative). Bound the chance of scoring 100 or more. (b) Chebyshev: mean $\\mu = 50$, variance $\\sigma^2 = 100$ (so $\\sigma = 10$). Bound the chance of being 30+ points from the mean.</p>
     <ul class="steps">
       <li>Markov: $P(X \\ge 100) \\le \\frac{E[X]}{a} = \\frac{50}{100} = 0.5$. At most 50%.</li>
       <li>Chebyshev: $P(|X - 50| \\ge 30) \\le \\frac{\\sigma^2}{\\epsilon^2} = \\frac{100}{30^2} = \\frac{100}{900} \\approx 0.11$.</li>
       <li>So at most ~11% of scores are more than 30 points from the mean — and we never assumed any specific distribution.</li>
     </ul>`,
  application:
    `<p>These bounds underpin the Law of Large Numbers (next lesson) and many guarantees in machine-learning theory. They give worst-case safety nets when you can't or won't assume a distribution's exact shape.</p>`,
  quiz: {
    q: `A nonnegative variable has mean 4. By Markov, what is the most that $P(X \\ge 8)$ can be?`,
    a: `<p>$P(X \\ge 8) \\le \\frac{E[X]}{a} = \\frac{4}{8} = 0.5$. At most 50%.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-lln",
  title: "Law of Large Numbers",
  tagline: "Average enough samples and you home in on the true mean. Why averages are trustworthy.",
  prereqs: ["prob-expectation", "prob-inequalities"],
  bigIdea:
    `<p>One sample is noisy. But average many samples and the noise cancels out.</p>
     <p>The <b>Law of Large Numbers</b> says: as you collect more data, the sample average closes in on the true mean.</p>
     <p>It is why polls, casinos, and experiments work.</p>
     <p>More data means a more reliable average.</p>`,
  buildup:
    `<p>Flip a fair coin 10 times: you might get 7 heads (70%), far from 50%.</p>
     <p>Flip it 10,000 times and you'll be very close to 50%.</p>
     <p>The sample average $\\overline{X}$ stops bouncing around and settles toward the true mean $\\mu$.</p>`,
  symbols: [
    { sym: "$X_1, \\dots, X_n$", desc: "$n$ independent samples from the same distribution." },
    { sym: "$\\overline{X}$", desc: "the sample average: add the $n$ samples and divide by $n$. The bar means 'average'." },
    { sym: "$\\mu$", desc: "the true mean of the distribution we're sampling (Greek 'mu')." },
    { sym: "$n$", desc: "the number of samples." },
    { sym: "$\\to$", desc: "'approaches' or 'goes to' as $n$ grows large." }
  ],
  formula: `$$ \\overline{X} = \\frac{1}{n}\\sum_{i=1}^{n} X_i \\;\\longrightarrow\\; \\mu \\quad \\text{as } n \\to \\infty $$`,
  whatItDoes:
    `<p>$\\overline{X}$ is the average of your samples so far.</p>
     <p>As the sample count $n$ grows toward infinity, that average converges to the true mean $\\mu$.</p>
     <p>The gap between your estimate and the truth shrinks the more data you gather.</p>`,
  example:
    `<p>Roll a fair die (true mean $\\mu = 3.5$) and track the running average.</p>
     <ul class="steps">
       <li>After 5 rolls: maybe $[6, 2, 5, 1, 4]$, average $= \\frac{18}{5} = 3.6$. Close-ish.</li>
       <li>After 50 rolls: the running average might be $3.42$. Closer.</li>
       <li>After 5000 rolls: the average is very close to $3.5$, the true mean.</li>
       <li>The estimate tightens around $3.5$ as $n$ grows — exactly what the law promises.</li>
     </ul>`,
  application:
    `<p>Stochastic gradient descent relies on this: a gradient from a small batch is a noisy estimate of the true gradient, but averaging over many steps points the right way. Monte Carlo simulation and A/B testing also depend on the Law of Large Numbers.</p>`,
  quiz: {
    q: `You flip a fair coin (true heads rate 0.5). After 100,000 flips, roughly what fraction will be heads, and why?`,
    a: `<p>Very close to 0.5. By the Law of Large Numbers, the sample fraction converges to the true probability as the number of flips grows large.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-clt",
  title: "Central Limit Theorem",
  tagline: "Add up many independent things and the total looks Normal — no matter where they came from.",
  prereqs: ["prob-lln", "prob-normal"],
  bigIdea:
    `<p>Here's the magic: average many independent random things, and the average looks like a bell curve.</p>
     <p>This happens even if each thing came from a weird, non-bell-shaped distribution.</p>
     <p>That is the <b>Central Limit Theorem</b>.</p>
     <p>It explains why the Normal distribution shows up absolutely everywhere.</p>`,
  buildup:
    `<p>The Law of Large Numbers told you the average $\\overline{X}$ converges to $\\mu$.</p>
     <p>The CLT goes further: it describes the <i>shape</i> of $\\overline{X}$'s wobble around $\\mu$.</p>
     <p>That shape is Normal, centered at $\\mu$, with a spread that shrinks as $n$ grows.</p>`,
  symbols: [
    { sym: "$\\overline{X}$", desc: "the sample average of $n$ independent samples." },
    { sym: "$\\mu$", desc: "the true mean of each sample (Greek 'mu')." },
    { sym: "$\\sigma^2$", desc: "the variance of one sample." },
    { sym: "$\\sigma^2/n$", desc: "the variance of the AVERAGE — it shrinks as you take more samples." },
    { sym: "$\\approx$", desc: "'is approximately'." },
    { sym: "$\\mathcal{N}(\\mu, \\sigma^2/n)$", desc: "a Normal distribution centered at $\\mu$ with variance $\\sigma^2/n$." }
  ],
  formula: `$$ \\overline{X} \\;\\approx\\; \\mathcal{N}\\!\\left(\\mu,\\; \\frac{\\sigma^2}{n}\\right) \\quad \\text{for large } n $$`,
  whatItDoes:
    `<p>For a large sample size $n$, the sample average $\\overline{X}$ follows a Normal distribution.</p>
     <p>It is centered at the true mean $\\mu$, just like the Law of Large Numbers said.</p>
     <p>Its variance is $\\frac{\\sigma^2}{n}$: more samples means a tighter, narrower bell around $\\mu$.</p>`,
  example:
    `<p>Roll a die. One roll is Uniform (flat, not bell-shaped) with $\\mu = 3.5$ and $\\sigma^2 \\approx 2.92$. Now average $n = 30$ rolls.</p>
     <ul class="steps">
       <li>The average $\\overline{X}$ is centered at $\\mu = 3.5$.</li>
       <li>Its variance is $\\frac{\\sigma^2}{n} = \\frac{2.92}{30} \\approx 0.097$, so its spread $\\sigma_{\\overline{X}} = \\sqrt{0.097} \\approx 0.31$.</li>
       <li>Repeat 'average 30 rolls' many times and plot the averages: they form a bell curve, even though one roll is flat.</li>
       <li>That bell is $\\mathcal{N}(3.5,\\, 0.097)$ — the CLT predicted its center and width.</li>
     </ul>`,
  application:
    `<p>The CLT is why confidence intervals and hypothesis tests use the Normal distribution. A/B tests, polling margins of error, and quality control all lean on it. It's the reason measurement noise is so often assumed Normal.</p>`,
  quiz: {
    q: `Samples have mean $\\mu = 10$ and variance $\\sigma^2 = 16$. For an average of $n = 4$ samples, what is the variance of $\\overline{X}$?`,
    a: `<p>$\\frac{\\sigma^2}{n} = \\frac{16}{4} = 4$. (So the average's standard deviation is $\\sqrt{4} = 2$, half of the single-sample $\\sigma = 4$.)</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-estimation",
  title: "Parameter estimation",
  tagline: "Guess a distribution's hidden numbers from data. And know when your guess is fair.",
  prereqs: ["prob-expectation", "prob-variance", "prob-lln"],
  bigIdea:
    `<p>The real world doesn't hand you a distribution's true mean or variance.</p>
     <p>You only have data. So you <b>estimate</b> those hidden numbers from samples.</p>
     <p>A good estimate is <b>unbiased</b>: on average, it hits the true value, not consistently too high or low.</p>
     <p>This is the bridge from probability to real statistics.</p>`,
  buildup:
    `<p>Call the true hidden number $\\theta$ (could be a mean, a rate, anything). Your guess from data is $\\hat\\theta$, said 'theta-hat'.</p>
     <p>The <b>bias</b> is how far off your guess is on average: $E[\\hat\\theta] - \\theta$. Zero bias is ideal.</p>
     <p>The sample mean estimates the true mean. The sample variance estimates the true variance — but it needs a sneaky fix.</p>`,
  symbols: [
    { sym: "$\\theta$", desc: "the true, unknown parameter (Greek 'theta'). What we want to know." },
    { sym: "$\\hat\\theta$", desc: "the estimator: our data-based guess of $\\theta$. The 'hat' means 'estimate of'." },
    { sym: "bias", desc: "$E[\\hat\\theta] - \\theta$: how far the guess is off on average. 0 = unbiased." },
    { sym: "$\\overline{X}$", desc: "the sample mean: average of the data. Estimates the true mean." },
    { sym: "$s^2$", desc: "the sample variance: our estimate of the true variance." },
    { sym: "$n - 1$", desc: "the divisor in $s^2$ (NOT $n$). This correction makes the estimate unbiased." }
  ],
  formula: `$$ \\overline{X} = \\frac{1}{n}\\sum_{i=1}^{n} X_i \\qquad s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}\\big(X_i - \\overline{X}\\big)^2 \\qquad \\text{bias} = E[\\hat\\theta] - \\theta $$`,
  whatItDoes:
    `<p>$\\overline{X}$ averages your data to estimate the true mean. It's unbiased.</p>
     <p>$s^2$ averages the squared distances from $\\overline{X}$ to estimate the variance — but divides by $n - 1$, not $n$.</p>
     <p>Why $n-1$? The data looks a little too close to its OWN average $\\overline{X}$, which slightly underestimates the true spread. Dividing by the smaller $n-1$ corrects exactly for that, making $s^2$ unbiased.</p>`,
  example:
    `<p>Data: $\\{2, 4, 6\\}$. Estimate the mean and variance.</p>
     <ul class="steps">
       <li>Sample mean: $\\overline{X} = \\frac{2 + 4 + 6}{3} = \\frac{12}{3} = 4$.</li>
       <li>Squared distances from 4: $(2-4)^2 = 4$, $(4-4)^2 = 0$, $(6-4)^2 = 4$. Sum $= 8$.</li>
       <li>Sample variance (divide by $n - 1 = 2$): $s^2 = \\frac{8}{2} = 4$.</li>
       <li>If we had wrongly divided by $n = 3$, we'd get $\\frac{8}{3} \\approx 2.67$ — too small. The $n-1$ fix corrects this downward bias.</li>
     </ul>`,
  application:
    `<p>Every statistic computed from a dataset is an estimator: a model's accuracy, a feature's average, an A/B test's lift. Understanding bias keeps you from being fooled by your own measurements. Maximum likelihood estimation generalizes this idea to fit entire models.</p>`,
  quiz: {
    q: `For the data $\\{1, 3\\}$, compute the sample mean and the sample variance $s^2$ (using $n-1$).`,
    a: `<p>Mean $= \\frac{1+3}{2} = 2$. Squared distances: $(1-2)^2 = 1$ and $(3-2)^2 = 1$, sum $= 2$. Divide by $n-1 = 1$: $s^2 = \\frac{2}{1} = 2$.</p>`
  }
});

})();
