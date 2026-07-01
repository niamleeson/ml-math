module.exports = {
  "math-17-01": {
    connectionsProse:
      "<p>This opening lesson gives probability its basic vocabulary. Before calculating any chance, the model has to say which outcomes are possible and which outcomes count for the event of interest. That language connects directly to set operations, probability axioms, and random variables. A clear sample space also keeps later formulas from being applied to the wrong universe of outcomes.</p>",
    motivation:
      "<p>In ordinary counting problems, it is tempting to begin with a number such as one half or one sixth. Probability is safer when it begins one step earlier, by naming the experiment and listing or describing the outcomes that could occur. The sample space is that full collection, and an event is a selected part of it.</p>" +
      "<p>This distinction matters because the same real situation can be modeled at different levels of detail. A coin flipped twice may have four ordered outcomes, while a simpler model may only record the number of heads. Once the outcome space is chosen, events become subsets, and probability rules can operate on those subsets consistently.</p>",
    definition:
      "<p><b>Sample spaces and events</b> states the lesson's probability object or rule.</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\Omega$", desc: "is the sample space" },
      { sym: "$\\omega$", desc: "is one outcome" },
      { sym: "$A\\subseteq\\Omega$", desc: "is an event" },
      { sym: "$|A|$", desc: "counts outcomes in a finite event" }
    ],
    applications: [
      { title: "Coin twice", background: "Use this setting to read the lesson's probability idea.", numbers: "$\\Omega=\\{HH,HT,TH,TT\\}$ and event at least one head has $3$ outcomes." },
      { title: "Die roll", background: "Use this setting to read the lesson's probability idea.", numbers: "even event $\\{2,4,6\\}$ has $3$ of $6$ outcomes." },
      { title: "Classifier", background: "Use this setting to read the lesson's probability idea.", numbers: "correctness space $\\{TP,FP,TN,FN\\}$ has $4$ outcomes." },
      { title: "Card suit", background: "Use this setting to read the lesson's probability idea.", numbers: "hearts event has $13$ outcomes in a $52$-card deck." },
      { title: "Two bits", background: "Use this setting to read the lesson's probability idea.", numbers: "exactly one 1 is $\\{01,10\\}$, so $2$ outcomes." },
      { title: "Ad click", background: "Use this setting to read the lesson's probability idea.", numbers: "$\\Omega=\\{0,1\\}$ and click event has $1$ outcome." }
    ]
  },
  "math-17-02": {
    connectionsProse:
      "<p>This lesson continues the sample-space language from the previous lesson. Once events are subsets of a sample space, the usual set operations become probability operations. Union, intersection, complement, and difference describe common phrases such as “at least one,” “both,” “not,” and “without.” These operations are used constantly in conditional probability, Bayes theorem, and distribution calculations.</p>",
    motivation:
      "<p>Many probability statements combine simpler events. A die roll might be even, high, both even and high, or even but not high. Set notation gives a compact way to say each of those cases without inventing new rules for every example.</p>" +
      "<p>The load-bearing idea is membership. To understand a combined event, check which outcomes belong to it. This keeps logical statements precise before any probabilities are assigned, and it prevents double counting when events overlap.</p>",
    definition:
      "<p><b>Set operations on events</b> states the lesson's probability object or rule.</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$A\\cup B$", desc: "means $A$ or $B$" },
      { sym: "$A\\cap B$", desc: "means both" },
      { sym: "$A^c$", desc: "means not $A$" },
      { sym: "$A\\setminus B$", desc: "means in $A$ but not in $B$" }
    ],
    applications: [
      { title: "Die roll", background: "Use this setting to read the lesson's probability idea.", numbers: "$A=\\{2,4,6\\}$, $B=\\{4,5,6\\}$, so $A\\cup B=\\{2,4,5,6\\}$ has $4$ outcomes." },
      { title: "Intersection", background: "Use this setting to read the lesson's probability idea.", numbers: "same $A,B$ give $A\\cap B=\\{4,6\\}$ with $2$ outcomes." },
      { title: "Complement", background: "Use this setting to read the lesson's probability idea.", numbers: "not even is $\\{1,3,5\\}$ with $3$ outcomes." },
      { title: "Difference", background: "Use this setting to read the lesson's probability idea.", numbers: "even but not high is $\\{2\\}$ with $1$ outcome." },
      { title: "Classifier errors", background: "Use this setting to read the lesson's probability idea.", numbers: "false positives or false negatives are $2$ error types." },
      { title: "Two dice", background: "Use this setting to read the lesson's probability idea.", numbers: "sum 7 has $6$ ordered outcomes." }
    ]
  },
  "math-17-03": {
    connectionsProse:
      "<p>After sample spaces and events are named, probability needs rules that make all assignments consistent. The axioms are deliberately small: probabilities are nonnegative, the whole sample space has mass one, and disjoint pieces add. From those rules, useful facts such as complements, impossible events, and monotonicity follow. These facts support every later calculation in the section.</p>",
    motivation:
      "<p>A probability model should behave like a careful accounting system. It should never assign negative mass, it should put total mass one on all possible outcomes, and it should add masses without overlap when events cannot happen together. These requirements are enough to rule out many inconsistent assignments.</p>" +
      "<p>The main intuition is conservation of probability mass. If an event and its complement split the whole sample space, their probabilities must add to one. If one event sits inside another, the larger event must have at least as much probability because it contains all the smaller event’s mass and possibly more.</p>",
    definition:
      "<p><b>Axioms of probability</b> states the lesson's probability object or rule. $$P(A^c)=1-P(A)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$P(A)$", desc: "is probability of event $A$" },
      { sym: "$\\varnothing$", desc: "is impossible event" },
      { sym: "disjoint means intersection is empty", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "Split $\\Omega=A\\cup A^c$ with disjoint pieces because every outcome is either in $A$ or not.", result: "Split $\\Omega=A\\cup A^c$ with disjoint pieces because every outcome is either in $A$ or not.", why: "this is the next justified step in the plan's derivation" },
      { do: "Apply additivity", result: "$P(\\Omega)=P(A)+P(A^c)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use normalization $P(\\Omega)=1$", result: "$P(A^c)=1-P(A)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Put $A=\\Omega$", result: "$P(\\varnothing)=1-P(\\Omega)=0$.", why: "this is the next justified step in the plan's derivation" },
      { do: "If $A\\subseteq B$, write $B=A\\cup(B\\setminus A)$ disjointly,", result: "$P(B)=P(A)+P(B\\setminus A)\\ge P(A)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Reliability", background: "Use this setting to read the lesson's probability idea.", numbers: "if failure probability is $0.02$, success is $0.98$." },
      { title: "Email filter", background: "Use this setting to read the lesson's probability idea.", numbers: "if spam probability is $0.15$, non-spam is $0.85$." },
      { title: "Disjoint dice events", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(1\\text{ or }6)=1/6+1/6=1/3$." },
      { title: "Impossible overlap", background: "Use this setting to read the lesson's probability idea.", numbers: "heads and tails on one flip has probability $0$." },
      { title: "Nested events", background: "Use this setting to read the lesson's probability idea.", numbers: "rolling 6 is within rolling even, so $1/6\\le1/2$." },
      { title: "Mass check", background: "Use this setting to read the lesson's probability idea.", numbers: "probabilities $0.2,0.5,0.3$ sum to $1$." }
    ]
  },
  "math-17-04": {
    connectionsProse:
      "<p>This lesson applies the probability axioms to finite equally likely models. When every outcome has the same probability, the problem becomes counting favorable outcomes and total outcomes. That connects sample spaces with combinatorics, especially combinations. Later discrete distributions use the same counting logic inside their probability mass functions.</p>",
    motivation:
      "<p>Listing outcomes is possible for two dice or a few coin flips, but it quickly becomes impractical for cards, lotteries, and large samples. When outcomes are equally likely, counting replaces listing. The probability of an event is the fraction of equally likely outcomes that fall inside it.</p>" +
      "<p>The important modeling step is deciding what counts as one outcome. Ordered selections and unordered selections are different sample spaces. Combinations appear when order is irrelevant, because each unordered group has many ordered descriptions that must be divided out.</p>",
    definition:
      "<p><b>Combinatorial probability</b> states the lesson's probability object or rule. $$P(A)=\\frac{|A|}{|\\Omega|},\\qquad \\binom nk=\\frac{n!}{k!(n-k)!}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$|A|$", desc: "is the favorable count" },
      { sym: "$|\\Omega|$", desc: "is the total count" },
      { sym: "$\\binom nk$", desc: "counts $k$-subsets" }
    ],
    derivation: [
      { do: "For equally likely outcomes, each outcome in finite $\\Omega$ has mass $1/|\\Omega|$.", result: "For equally likely outcomes, each outcome in finite $\\Omega$ has mass $1/|\\Omega|$.", why: "this is the next justified step in the plan's derivation" },
      { do: "An event $A$ contains $|A|$ such outcomes.", result: "An event $A$ contains $|A|$ such outcomes.", why: "this is the next justified step in the plan's derivation" },
      { do: "Add the equal masses", result: "$P(A)=\\sum_{\\omega\\in A}1/|\\Omega|=|A|/|\\Omega|$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For combinations, choose $k$ unordered items", result: "dividing ordered selections $n(n-1)\\cdots(n-k+1)$ by $k!$, giving $\\binom nk=\\frac{n!}{k!(n-k)!}$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Poker pair event", background: "Use this setting to read the lesson's probability idea.", numbers: "choose 2 aces from 4 gives $\\binom42=6$ pairs." },
      { title: "Batch sample", background: "Use this setting to read the lesson's probability idea.", numbers: "choose 3 from 10 gives $\\binom{10}{3}=120$." },
      { title: "Lottery", background: "Use this setting to read the lesson's probability idea.", numbers: "one 6-number ticket from 49 has chance $1/\\binom{49}{6}=1/13{,}983{,}816$." },
      { title: "Defective selection", background: "Use this setting to read the lesson's probability idea.", numbers: "choose 2 defectives from 5 and 1 good from 15 gives $\\binom52\\binom{15}1=150$ samples." },
      { title: "Two dice sum 7", background: "Use this setting to read the lesson's probability idea.", numbers: "$6/36=1/6$." },
      { title: "Coin strings", background: "Use this setting to read the lesson's probability idea.", numbers: "exactly 3 heads in 5 flips has $\\binom53=10$ strings." }
    ]
  },
  "math-17-05": {
    connectionsProse:
      "<p>Conditional probability is the first formal update rule in the section. It builds on events, intersections, and probability mass. Once information says that event B occurred, probabilities are measured only inside B. This idea becomes the basis for independence, Bayes theorem, conditional distributions, and conditional expectation.</p>",
    motivation:
      "<p>New information changes which outcomes are still possible. If B is known, outcomes outside B no longer participate in the calculation. The event A can only occur through the overlap A cap B, so that overlap is compared with the probability mass of B.</p>" +
      "<p>The renormalization is the essential step. The old whole sample space had mass one, but the restricted world B has mass P(B). Dividing by P(B) makes the remaining world have total mass one again, so ordinary probability reasoning can continue inside the condition.</p>",
    definition:
      "<p><b>Conditional probability</b> states the lesson's probability object or rule. $$P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$P(A\\mid B)$", desc: "means probability of $A$ given $B$" },
      { sym: "require $P(B)>0$", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "Restrict attention to $B$, whose probability mass is $P(B)$.", result: "Restrict attention to $B$, whose probability mass is $P(B)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Inside that restricted world, $A$ occurs exactly on $A\\cap B$.", result: "Inside that restricted world, $A$ occurs exactly on $A\\cap B$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Renormalize the overlap by the available mass", result: "$P(A\\mid B)=P(A\\cap B)/P(B)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Multiply both sides by $P(B)$", result: "$P(A\\cap B)=P(A\\mid B)P(B)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Cards", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(\\text{ace}\\mid\\text{spade})=1/13$." },
      { title: "Die", background: "Use this setting to read the lesson's probability idea.", numbers: "given even, probability greater than 3 is $2/3$." },
      { title: "Medical test base group", background: "Use this setting to read the lesson's probability idea.", numbers: "if positives are $0.0293$ and true-positive overlap is $0.0095$, disease given positive is $0.3242$." },
      { title: "Website", background: "Use this setting to read the lesson's probability idea.", numbers: "$40$ buyers among $200$ visitors gives $0.20$." },
      { title: "Confusion matrix", background: "Use this setting to read the lesson's probability idea.", numbers: "precision $TP/(TP+FP)=80/(80+20)=0.80$." },
      { title: "Weather", background: "Use this setting to read the lesson's probability idea.", numbers: "rain among cloudy days $18/60=0.30$." }
    ]
  },
  "math-17-06": {
    connectionsProse:
      "<p>Independence uses conditional probability to express absence of probabilistic influence. If learning B does not change the probability of A, the events are independent. The same idea also has a product form, which is often easier to compute. This product rule later extends to independent random variables, sums, and limit theorems.</p>",
    motivation:
      "<p>Some pieces of information matter and others do not. Knowing that a die roll is even changes the chance that it is six, but knowing the result of a separate coin flip does not. Independence gives a precise test for that second situation.</p>" +
      "<p>The product formula says that the overlap of independent events has exactly the mass expected from multiplying their separate masses. This is not a rule to assume automatically. It is a modeling claim that must match the experiment or data-generating process.</p>",
    definition:
      "<p><b>Independence</b> states the lesson's probability object or rule. $$A\\perp B\\quad\\Longleftrightarrow\\quad P(A\\cap B)=P(A)P(B)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$A\\perp B$", desc: "denotes independence" },
      { sym: "$P(A)P(B)$", desc: "is the product mass expected with no influence" }
    ],
    derivation: [
      { do: "Start from the condition $P(A\\mid B)=P(A)$ for $P(B)>0$.", result: "Start from the condition $P(A\\mid B)=P(A)$ for $P(B)>0$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Substitute conditional probability", result: "$P(A\\cap B)/P(B)=P(A)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Multiply by $P(B)$", result: "$P(A\\cap B)=P(A)P(B)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Conversely, if the product rule holds and $P(B)>0$, divide", result: "$P(B)$ to recover $P(A\\mid B)=P(A)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Two coins", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(HH)=1/2\\cdot1/2=1/4$." },
      { title: "Die and coin", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(6\\text{ and }H)=1/6\\cdot1/2=1/12$." },
      { title: "System failures", background: "Use this setting to read the lesson's probability idea.", numbers: "two independent $0.01$ failures both occur with probability $0.0001$." },
      { title: "Dropout masks", background: "Use this setting to read the lesson's probability idea.", numbers: "two units kept with $0.8^2=0.64$." },
      { title: "Not independent", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(\\text{even}\\cap\\text{6})=1/6\\ne(1/2)(1/6)$." },
      { title: "A/B exposure and weekday", background: "Use this setting to read the lesson's probability idea.", numbers: "if $0.4$ exposed and $5/7$ weekdays, joint is $2/7\\approx0.2857$ under independence." }
    ]
  },
  "math-17-07": {
    connectionsProse:
      "<p>The law of total probability organizes calculations by cases. It uses disjoint events that cover the sample space, together with conditional probability inside each case. This is the denominator machinery behind Bayes theorem. It is also a common way to combine segment-level rates into an overall rate.</p>",
    motivation:
      "<p>Many events can happen through several routes. A positive test can come from diseased and non-diseased groups, a click can come from mobile and desktop users, and a delay can come from different shipping methods. Total probability says to compute within each route and then average using the route frequencies.</p>" +
      "<p>The key requirement is that the cases form a partition. They must not overlap, and together they must cover the world being modeled. With that structure in place, each piece of A is counted once, and the weighted sum gives the full probability of A.</p>",
    definition:
      "<p><b>The law of total probability</b> states the lesson's probability object or rule. $$P(A)=\\sum_i P(A\\mid B_i)P(B_i)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$B_i$", desc: "are cases or strata" },
      { sym: "$P(B_i)$", desc: "are case weights" }
    ],
    derivation: [
      { do: "Let $B_1,\\dots,B_k$ be disjoint and cover $\\Omega$.", result: "Let $B_1,\\dots,B_k$ be disjoint and cover $\\Omega$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Split $A$ into disjoint pieces", result: "$A=(A\\cap B_1)\\cup\\cdots\\cup(A\\cap B_k)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Add disjoint probabilities", result: "$P(A)=\\sum_iP(A\\cap B_i)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use conditional probability on each piece", result: "$P(A\\cap B_i)=P(A\\mid B_i)P(B_i)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Substitute", result: "$P(A)=\\sum_iP(A\\mid B_i)P(B_i)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Diagnostic positives", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.01\\cdot0.95+0.99\\cdot0.02=0.0293$." },
      { title: "Ad click", background: "Use this setting to read the lesson's probability idea.", numbers: "mobile $0.7$ at $0.04$ and desktop $0.3$ at $0.02$ gives $0.034$." },
      { title: "Shipping delay", background: "Use this setting to read the lesson's probability idea.", numbers: "air $0.6$ at $0.05$, ground $0.4$ at $0.12$ gives $0.078$." },
      { title: "Model error by segment", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.5\\cdot0.08+0.5\\cdot0.12=0.10$." },
      { title: "Factory defect", background: "Use this setting to read the lesson's probability idea.", numbers: "lines $0.3,0.7$ with rates $0.01,0.03$ give $0.024$." },
      { title: "Rain by season", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.25(0.4+0.2+0.1+0.3)=0.25$." }
    ]
  },
  "math-17-08": {
    connectionsProse:
      "<p>Bayes theorem combines conditional probability with total probability. It is used when the available information is naturally stated in the forward direction, such as signal given state, but the needed answer is the reverse direction, such as state given signal. The theorem separates prior belief, likelihood, and evidence. This structure reappears in diagnostics, spam filtering, classification, and Bayesian modeling.</p>",
    motivation:
      "<p>A test result or signal is often easier to model from each possible cause than the other way around. For example, it may be known how often a test is positive among sick people and among healthy people. The question after observing a positive result is different: how much of the positive group actually comes from the sick population.</p>" +
      "<p>Bayes theorem answers by comparing the mass of the target overlap with the total mass of the evidence. The numerator is the joint mass of the cause and signal. The denominator includes every way the signal can happen, which is why base rates matter so strongly in rare-event problems.</p>",
    definition:
      "<p><b>Bayes theorem</b> states the lesson's probability object or rule. $$P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$P(A)$", desc: "prior" },
      { sym: "$P(B\\mid A)$", desc: "likelihood" },
      { sym: "$P(A\\mid B)$", desc: "posterior" },
      { sym: "$P(B)$", desc: "evidence" }
    ],
    derivation: [
      { do: "Write the same overlap two ways", result: "$P(A\\cap B)=P(A\\mid B)P(B)$ and $P(A\\cap B)=P(B\\mid A)P(A)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Set the right-hand sides equal.", result: "Set the right-hand sides equal.", why: "this is the next justified step in the plan's derivation" },
      { do: "Divide by $P(B)$", result: "$P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "If $B$ can happen through cases $A$ and $A^c$, expand $P(B)$", result: "total probability.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Medical test", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.0095/0.0293=0.3242$ disease given positive." },
      { title: "Spam filter", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.2\\cdot0.9/(0.2\\cdot0.9+0.8\\cdot0.1)=0.6923$." },
      { title: "Fraud alert", background: "Use this setting to read the lesson's probability idea.", numbers: "prior $0.01$, hit $0.8$, false alert $0.05$ gives $0.1391$." },
      { title: "Rare bug", background: "Use this setting to read the lesson's probability idea.", numbers: "prior $0.02$, detector $0.9$, false $0.1$ gives $0.1552$." },
      { title: "Weather radar", background: "Use this setting to read the lesson's probability idea.", numbers: "prior rain $0.3$, radar hit $0.8$, false $0.2$ gives $0.6316$." },
      { title: "A/B winner", background: "Use this setting to read the lesson's probability idea.", numbers: "prior $0.5$, signal likelihoods $0.7,0.3$ gives posterior $0.7$." }
    ]
  },
  "math-17-09": {
    connectionsProse:
      "<p>This lesson moves from events to random variables. A random variable turns outcomes into numbers, so probability can describe quantities such as counts, labels, and scores. Discrete random variables use probability masses on countable values. They prepare the ground for expectation, variance, Bernoulli, binomial, Poisson, and geometric models.</p>",
    motivation:
      "<p>Events answer yes-or-no questions about outcomes, but many models need a numeric summary. In two coin flips, the outcome might be HT, while the random variable records the number of heads as 1. The probability model then shifts from raw outcomes to the values the variable can take.</p>" +
      "<p>For a discrete random variable, probability sits on individual values. The mass function records how much probability each value receives, and the masses must sum to one. This makes it possible to compute averages, spreads, and distribution-specific probabilities from a compact table or formula.</p>",
    definition:
      "<p><b>Discrete random variables</b> states the lesson's probability object or rule. $$p_X(x)=P(X=x),\\qquad \\sum_x p_X(x)=1$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$X$", desc: "is the random variable" },
      { sym: "$x$", desc: "is a possible value" },
      { sym: "$p_X(x)=P(X=x)$", desc: "is the mass function" }
    ],
    applications: [
      { title: "Coin heads in 2 flips", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(X=0,1,2)=(1/4,1/2,1/4)$." },
      { title: "Support count", background: "Use this setting to read the lesson's probability idea.", numbers: "a die-valued $X$ has $6$ possible values." },
      { title: "Click count", background: "Use this setting to read the lesson's probability idea.", numbers: "in 3 impressions can be $0,1,2,3$." },
      { title: "Classifier error", background: "Use this setting to read the lesson's probability idea.", numbers: "$X\\in\\{0,1\\}$ has two values." },
      { title: "Queue length", background: "Use this setting to read the lesson's probability idea.", numbers: "might be $0,1,2,\\dots$." },
      { title: "Mass check", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.2+0.5+0.3=1$." }
    ]
  },
  "math-17-10": {
    connectionsProse:
      "<p>Continuous random variables extend probability from counts to measurements. Instead of putting mass on individual values, they assign probability to intervals. This shift is essential for wait times, heights, latencies, noise, and real-valued model outputs. The next lesson makes the interval-area idea precise through density functions.</p>",
    motivation:
      "<p>A measurement such as time or height can vary on a continuum. In such models, the chance of landing on one exact value is usually zero, not because the value is impossible, but because probability is spread across infinitely many nearby values. Meaningful probabilities come from ranges.</p>" +
      "<p>The central idea is area rather than point mass. To ask about a continuous variable, one usually asks whether it falls below a threshold, above a threshold, or inside an interval. Densities and CDFs are tools for computing those interval probabilities.</p>",
    definition:
      "<p><b>Continuous random variables</b> states the lesson's probability object or rule. $$P(a\\le X\\le b)\\text{ is interval probability, while usually }P(X=x)=0$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$X$", desc: "is continuous" },
      { sym: "$P(a\\le X\\le b)$", desc: "is interval probability" },
      { sym: "$f_X$", desc: "is density when it exists" }
    ],
    applications: [
      { title: "Uniform wait 0 to 10", background: "Use this setting to read the lesson's probability idea.", numbers: "wait between 2 and 5 has probability $3/10=0.3$." },
      { title: "Exact wait", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(X=4)=0$ for a continuous wait." },
      { title: "Height interval", background: "Use this setting to read the lesson's probability idea.", numbers: "170--180 cm is an interval event." },
      { title: "Latency below 100 ms", background: "Use this setting to read the lesson's probability idea.", numbers: "is $P(X<100)$." },
      { title: "Sensor noise", background: "Use this setting to read the lesson's probability idea.", numbers: "uses intervals such as $[-0.1,0.1]$." },
      { title: "Revenue lift", background: "Use this setting to read the lesson's probability idea.", numbers: "can be positive with probability $P(X>0)$." }
    ]
  },
  "math-17-11": {
    connectionsProse:
      "<p>Density functions make continuous probability calculable. They connect the interval language of continuous variables with integration from calculus. A density can be high or low locally, but probability is obtained only after multiplying by width and adding area. This lesson supports CDFs, Gaussian models, transformations, and continuous joint distributions.</p>",
    motivation:
      "<p>For continuous variables, a point has no probability mass, so the height of a curve cannot be read as a probability by itself. Instead, the height describes probability per unit of horizontal distance. A narrow bin gets probability approximately equal to height times width.</p>" +
      "<p>Integration is the limiting version of adding many small bins. As the bins become thinner, the approximate sum of rectangle areas becomes the exact area under the density. The total area must be one because the variable has to land somewhere on its support.</p>",
    definition:
      "<p><b>Probability density functions</b> states the lesson's probability object or rule. $$P(a\\le X\\le b)=\\int_a^b f_X(x)\\,dx$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$f_X(x)$", desc: "is density" },
      { sym: "$dx$", desc: "is a small width" },
      { sym: "the integral is area", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "Require total probability $1$,", result: "$\\int_{-\\infty}^{\\infty}f_X(x)\\,dx=1$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Probability in a small interval $[x,x+\\Delta x]$ is approximately $f_X(x)\\Delta x$.", result: "Probability in a small interval $[x,x+\\Delta x]$ is approximately $f_X(x)\\Delta x$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Add small interval probabilities across $[a,b]$.", result: "Add small interval probabilities across $[a,b]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Take the limit as interval widths shrink", result: "$P(a\\le X\\le b)=\\int_a^b f_X(x)\\,dx$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Uniform density", background: "Use this setting to read the lesson's probability idea.", numbers: "on $[2,6]$ is $1/4$, so $P(3\\le X\\le5)=2/4=0.5$." },
      { title: "Triangular density", background: "Use this setting to read the lesson's probability idea.", numbers: "$f(x)=2x$ on $[0,1]$ integrates to $1$." },
      { title: "Small bin", background: "Use this setting to read the lesson's probability idea.", numbers: "density $0.2$ over width $0.5$ gives approximate mass $0.1$." },
      { title: "Normal within one sd", background: "Use this setting to read the lesson's probability idea.", numbers: "has area $0.6827$." },
      { title: "Exponential rate 0.5", background: "Use this setting to read the lesson's probability idea.", numbers: "has density at $2$ equal $0.5e^{-1}=0.1839$." },
      { title: "Area check", background: "Use this setting to read the lesson's probability idea.", numbers: "rectangle height $0.25$ width $4$ has area $1$." }
    ]
  },
  "math-17-12": {
    connectionsProse:
      "<p>The cumulative distribution function gives a single function that summarizes a distribution. It applies to discrete, continuous, and mixed cases, so it is more general than a density. By subtracting CDF values, interval probabilities become easy to express. Percentiles, medians, tail probabilities, and quantiles all use this function.</p>",
    motivation:
      "<p>Instead of asking for the probability at a value or inside a small bin, the CDF asks for all probability accumulated up to a threshold. As the threshold moves to the right, the accumulated mass can only increase. This creates a stable way to describe the distribution as a whole.</p>" +
      "<p>The subtraction rule is the practical payoff. Probability between two thresholds is the mass accumulated by the upper threshold minus the mass already accumulated by the lower threshold. When a density exists, the CDF is the accumulated area under that density.</p>",
    definition:
      "<p><b>Cumulative distribution functions</b> states the lesson's probability object or rule. $$F(x)=P(X\\le x),\\qquad P(a<X\\le b)=F(b)-F(a)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$F$", desc: "is CDF" },
      { sym: "$f$", desc: "is density" },
      { sym: "$a,b$", desc: "are interval endpoints" }
    ],
    derivation: [
      { do: "Define $F(x)=P(X\\le x)$.", result: "Define $F(x)=P(X\\le x)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For $a<b$, split $\\{X\\le b\\}$ into disjoint events $\\{X\\le a\\}$ and $\\{a<X\\le b\\}$.", result: "For $a<b$, split $\\{X\\le b\\}$ into disjoint events $\\{X\\le a\\}$ and $\\{a<X\\le b\\}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Add probabilities", result: "$F(b)=F(a)+P(a<X\\le b)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Rearrange", result: "$P(a<X\\le b)=F(b)-F(a)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "If a density exists, accumulated area", result: "$F(x)=\\int_{-\\infty}^x f(t)\\,dt$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Interval from CDF", background: "Use this setting to read the lesson's probability idea.", numbers: "$F(8)=0.7$, $F(3)=0.2$ gives $0.5$." },
      { title: "Median", background: "Use this setting to read the lesson's probability idea.", numbers: "$F(m)=0.5$." },
      { title: "95th percentile", background: "Use this setting to read the lesson's probability idea.", numbers: "$F(q)=0.95$." },
      { title: "Uniform [0,10]", background: "Use this setting to read the lesson's probability idea.", numbers: "$F(4)=0.4$." },
      { title: "Tail", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(X>7)=1-F(7)$." },
      { title: "Discrete CDF", background: "Use this setting to read the lesson's probability idea.", numbers: "masses $0.2,0.5,0.3$ give $F(1)=0.7$." }
    ]
  },
  "math-17-13": {
    connectionsProse:
      "<p>Expectation is the central average used throughout probability. It turns a distribution into its long-run center by weighting values according to their probabilities. This idea links random variables to variance, moments, conditional expectation, inequalities, and limit theorems. Many later formulas are built by applying expectation to transformed variables.</p>",
    motivation:
      "<p>An ordinary average gives equal weight to each observed value in a dataset. A probability-weighted average gives more influence to values that occur more often. If an experiment were repeated many times, the empirical average would be pulled toward this weighted center.</p>" +
      "<p>For discrete variables, the expectation is a weighted sum. For continuous variables, the same idea becomes an integral because probability is spread through density. In both cases, expectation is not necessarily the most likely value; it is the balance point of the distribution.</p>",
    definition:
      "<p><b>Expectation</b> states the lesson's probability object or rule. $$\\mathbb E[X]=\\sum_i x_i p_i,\\qquad \\mathbb E[X]=\\int x f(x)\\,dx$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\mathbb E[X]$", desc: "is expectation" },
      { sym: "$p_i=P(X=x_i)$", desc: "notation from the plan" },
      { sym: "$f(x)$", desc: "is density" }
    ],
    derivation: [
      { do: "In $n$ repetitions, value $x_i$ appears about $np_i$ times.", result: "In $n$ repetitions, value $x_i$ appears about $np_i$ times.", why: "this is the next justified step in the plan's derivation" },
      { do: "The sample average is approximately $\\frac{1}{n}\\sum_i (np_i)x_i$.", result: "The sample average is approximately $\\frac{1}{n}\\sum_i (np_i)x_i$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Cancel $n$", result: "$\\sum_i x_ip_i$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For a continuous variable, replace the sum of small bins", result: "$\\int x f(x)\\,dx$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Three-point distribution", background: "Use this setting to read the lesson's probability idea.", numbers: "values $0,1,2$ with masses $0.2,0.5,0.3$ give mean $1.1$." },
      { title: "Dice", background: "Use this setting to read the lesson's probability idea.", numbers: "$(1+2+3+4+5+6)/6=3.5$." },
      { title: "Ad revenue", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.04\\cdot2=0.08$ dollars expected per impression." },
      { title: "Insurance", background: "Use this setting to read the lesson's probability idea.", numbers: "$0.01\\cdot1000=10$ expected payout." },
      { title: "Bernoulli", background: "Use this setting to read the lesson's probability idea.", numbers: "$E[X]=p$, so $p=0.3$ gives $0.3$." },
      { title: "Uniform [2,6]", background: "Use this setting to read the lesson's probability idea.", numbers: "mean $(2+6)/2=4$." }
    ]
  },
  "math-17-14": {
    connectionsProse:
      "<p>Variance builds on expectation by measuring spread around the mean. It is the average squared deviation, so it uses expectation after centering the variable. The identity involving E[X squared] makes variance easier to compute in many distributions. Variance later controls Chebyshev bounds, sample averages, Gaussian scale, and the Central Limit Theorem.</p>",
    motivation:
      "<p>A mean alone does not say how variable the outcomes are. Two distributions can have the same center while one is tightly concentrated and the other is widely spread. Variance measures this spread by looking at distances from the mean.</p>" +
      "<p>Squaring deviations has two roles. It prevents positive and negative deviations from canceling, and it gives larger deviations more weight. The algebraic identity for variance is useful because raw second moments are often easier to compute than centered squared deviations directly.</p>",
    definition:
      "<p><b>Variance</b> states the lesson's probability object or rule. $$\\operatorname{Var}(X)=\\mathbb E[(X-\\mu)^2]=\\mathbb E[X^2]-\\mu^2$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\mu=\\mathbb E[X]$", desc: "notation from the plan" },
      { sym: "$\\sigma^2=\\operatorname{Var}(X)$", desc: "notation from the plan" },
      { sym: "$\\sigma$", desc: "is standard deviation" }
    ],
    derivation: [
      { do: "Start with $\\operatorname{Var}(X)=\\mathbb E[(X-\\mu)^2]$.", result: "Start with $\\operatorname{Var}(X)=\\mathbb E[(X-\\mu)^2]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Expand the square", result: "$(X-\\mu)^2=X^2-2\\mu X+\\mu^2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Take expectation term", result: "term.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use $\\mathbb E[X]=\\mu$ and $\\mathbb E[\\mu^2]=\\mu^2$.", result: "Use $\\mathbb E[X]=\\mu$ and $\\mathbb E[\\mu^2]=\\mu^2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Get $\\operatorname{Var}(X)=\\mathbb E[X^2]-2\\mu^2+\\mu^2=\\mathbb E[X^2]-\\mu^2$.", result: "Get $\\operatorname{Var}(X)=\\mathbb E[X^2]-2\\mu^2+\\mu^2=\\mathbb E[X^2]-\\mu^2$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Three-point distribution", background: "Use this setting to read the lesson's probability idea.", numbers: "above has $E[X^2]=1.7$, mean $1.1$, variance $0.49$." },
      { title: "Bernoulli $p=0.3$", background: "Use this setting to read the lesson's probability idea.", numbers: "has variance $0.21$." },
      { title: "Die", background: "Use this setting to read the lesson's probability idea.", numbers: "has variance $35/12=2.9167$." },
      { title: "Uniform [2,6]", background: "Use this setting to read the lesson's probability idea.", numbers: "variance is $16/12=1.3333$." },
      { title: "Batch average", background: "Use this setting to read the lesson's probability idea.", numbers: "of variance $9$ with $n=36$ has variance $0.25$." },
      { title: "Standard deviation", background: "Use this setting to read the lesson's probability idea.", numbers: "for variance $2.25$ is $1.5$." }
    ]
  },
  "math-17-15": {
    connectionsProse:
      "<p>Moments generalize expectation and variance into a family of summaries. The first raw moment gives the mean, the second raw moment helps compute variance, and central moments describe shape around the mean. This language prepares for moment generating functions and distribution comparisons. It also gives a compact way to discuss skew and tail behavior.</p>",
    motivation:
      "<p>A distribution has more structure than just its center and spread. Powers of the random variable emphasize different parts of the distribution. Low powers describe basic location and scale, while higher powers become sensitive to asymmetry and extreme values.</p>" +
      "<p>Raw moments measure powers from zero, while central moments measure powers after subtracting the mean. That centering is what makes central moments describe shape rather than location. The second central moment is variance, and higher central moments help describe skewness and tail weight.</p>",
    definition:
      "<p><b>Moments</b> states the lesson's probability object or rule. $$m_k=\\mathbb E[X^k],\\qquad \\mu_k=\\mathbb E[(X-\\mathbb E[X])^k]$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$m_k$", desc: "raw moment" },
      { sym: "$\\mu_k$", desc: "central moment" },
      { sym: "$k$", desc: "is the power" }
    ],
    derivation: [
      { do: "Define raw moment $m_k=\\mathbb E[X^k]$.", result: "Define raw moment $m_k=\\mathbb E[X^k]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For $k=1$, $m_1=\\mathbb E[X]$ is the mean.", result: "For $k=1$, $m_1=\\mathbb E[X]$ is the mean.", why: "this is the next justified step in the plan's derivation" },
      { do: "For $k=2$, combine with the variance identity", result: "$\\operatorname{Var}(X)=m_2-m_1^2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Define central moment $\\mu_k=\\mathbb E[(X-\\mathbb E[X])^k]$ to measure shape around the mean.", result: "Define central moment $\\mu_k=\\mathbb E[(X-\\mathbb E[X])^k]$ to measure shape around the mean.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Three-point distribution", background: "Use this setting to read the lesson's probability idea.", numbers: "has $m_1=1.1$ and $m_2=1.7$." },
      { title: "Bernoulli $p=0.3$", background: "Use this setting to read the lesson's probability idea.", numbers: "has every raw moment $m_k=0.3$ for $k\\ge1$." },
      { title: "Standard normal", background: "Use this setting to read the lesson's probability idea.", numbers: "has $m_2=1$ and $m_4=3$." },
      { title: "Uniform [0,1]", background: "Use this setting to read the lesson's probability idea.", numbers: "has $m_2=1/3$." },
      { title: "Exponential rate 0.5", background: "Use this setting to read the lesson's probability idea.", numbers: "has mean $2$ and second raw moment $8$." },
      { title: "Skew direction", background: "Use this setting to read the lesson's probability idea.", numbers: "values $0,0,3$ have positive third central moment." }
    ]
  },
  "math-17-16": {
    connectionsProse:
      "<p>Moment generating functions package many moment calculations into one function. They use expectation applied to an exponential transform, then recover moments by differentiating at zero. This connects power-series algebra with probability summaries. MGFs are also useful for sums of independent variables and for recognizing named distributions.</p>",
    motivation:
      "<p>Computing moments one at a time can become repetitive. The exponential series contains every power of X, so taking its expectation stores all raw moments as coefficients in one function. Differentiation at zero selects the desired coefficient.</p>" +
      "<p>The other major advantage appears with independent sums. Exponentials turn sums into products, and independence lets expectations of products factor. This makes the MGF of a sum especially simple when the summands are independent.</p>",
    definition:
      "<p><b>Moment generating functions</b> states the lesson's probability object or rule. $$M_X(t)=\\mathbb E[e^{tX}],\\qquad M_X^{(k)}(0)=\\mathbb E[X^k]$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$M_X(t)$", desc: "is the MGF" },
      { sym: "$t$", desc: "is an auxiliary variable" },
      { sym: "$M_X^{(k)}(0)$", desc: "is the $k$th derivative at zero" }
    ],
    derivation: [
      { do: "Define $M_X(t)=\\mathbb E[e^{tX}]$.", result: "Define $M_X(t)=\\mathbb E[e^{tX}]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Expand $e^{tX}=1+tX+t^2X^2/2!+\\cdots$.", result: "Expand $e^{tX}=1+tX+t^2X^2/2!+\\cdots$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Take expectation term by term", result: "$M_X(t)=1+t\\mathbb E[X]+t^2\\mathbb E[X^2]/2!+\\cdots$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Differentiate $k$ times and set $t=0$; all terms vanish except $\\mathbb E[X^k]$.", result: "Differentiate $k$ times and set $t=0$; all terms vanish except $\\mathbb E[X^k]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For independent sums, $M_{X+Y}(t)=E[e^{tX}e^{tY}]=M_X(t)M_Y(t)$.", result: "For independent sums, $M_{X+Y}(t)=E[e^{tX}e^{tY}]=M_X(t)M_Y(t)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Bernoulli", background: "Use this setting to read the lesson's probability idea.", numbers: "$M(t)=1-p+pe^t$, so $M'(0)=p$." },
      { title: "Poisson", background: "Use this setting to read the lesson's probability idea.", numbers: "$M(t)=\\exp(\\lambda(e^t-1))$, so mean $\\lambda$." },
      { title: "Normal", background: "Use this setting to read the lesson's probability idea.", numbers: "$M(t)=\\exp(\\mu t+\\sigma^2t^2/2)$." },
      { title: "Sum of two Poisson(2)", background: "Use this setting to read the lesson's probability idea.", numbers: "has MGF of Poisson(4)." },
      { title: "Exponential rate 0.5", background: "Use this setting to read the lesson's probability idea.", numbers: "has $M(t)=0.5/(0.5-t)$ for $t<0.5$." },
      { title: "Moment check", background: "Use this setting to read the lesson's probability idea.", numbers: "$M''(0)-M'(0)^2$ gives variance." }
    ]
  },
  "math-17-17": {
    connectionsProse:
      "<p>The Bernoulli distribution is the simplest nontrivial random-variable model. It records one trial with two outcomes, usually coded as 1 for success and 0 for failure. Because many counts are sums of yes-or-no trials, Bernoulli variables are building blocks for the binomial distribution and sample proportions. They also appear in classification, clicks, labels, and dropout masks.</p>",
    motivation:
      "<p>Many random situations reduce to one binary outcome. A user clicks or does not click, a component fails or does not fail, and a label is correct or incorrect. Coding success as 1 and failure as 0 turns the event into a numeric random variable.</p>" +
      "<p>The coding makes the mean especially interpretable. Since the variable is 1 exactly on success, its expected value is the success probability. The variance is largest near p=0.5 and smaller near 0 or 1, reflecting that nearly certain outcomes have less variability.</p>",
    definition:
      "<p><b>The Bernoulli distribution</b> states the lesson's probability object or rule. $$P(X=1)=p,\\quad P(X=0)=1-p,\\quad E[X]=p,\\quad \\operatorname{Var}(X)=p(1-p)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$p$", desc: "is success probability" },
      { sym: "$X\\in\\{0,1\\}$", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "Let $X=1$ for success and $X=0$ for failure.", result: "Let $X=1$ for success and $X=0$ for failure.", why: "this is the next justified step in the plan's derivation" },
      { do: "Assign $P(X=1)=p$ and $P(X=0)=1-p$", result: "masses sum to $1$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Compute mean", result: "$E[X]=1\\cdot p+0\\cdot(1-p)=p$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Since $X^2=X$, $E[X^2]=p$.", result: "Since $X^2=X$, $E[X^2]=p$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use variance identity", result: "$p-p^2=p(1-p)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "CTR click", background: "Use this setting to read the lesson's probability idea.", numbers: "with $p=0.04$ has mean $0.04$." },
      { title: "Conversion", background: "Use this setting to read the lesson's probability idea.", numbers: "with $p=0.1$ has variance $0.09$." },
      { title: "Fair coin", background: "Use this setting to read the lesson's probability idea.", numbers: "has mean $0.5$." },
      { title: "Dropout keep", background: "Use this setting to read the lesson's probability idea.", numbers: "with $p=0.8$ has variance $0.16$." },
      { title: "Label error", background: "Use this setting to read the lesson's probability idea.", numbers: "with $p=0.03$ has expected error $0.03$." },
      { title: "Two independent successes", background: "Use this setting to read the lesson's probability idea.", numbers: "at $p=0.3$ both occur with $0.09$." }
    ]
  },
  "math-17-18": {
    connectionsProse:
      "<p>The binomial distribution extends Bernoulli trials from one trial to a fixed number of independent trials. It counts how many successes occur, not which exact sequence occurred. The formula combines sequence probabilities with combinatorial counts. This distribution supports click counts, defect counts, coin experiments, and many normal-approximation examples later in the section.</p>",
    motivation:
      "<p>A single Bernoulli trial says whether one success occurred. In many applications, the natural question is how many successes appear across n repeated trials. Each exact sequence with k successes has the same probability when trials are independent with the same success chance.</p>" +
      "<p>The binomial coefficient counts where the successes could be placed. Multiplying the probability of one such sequence by the number of such sequences gives the mass at k. The mean and variance then come from viewing the count as a sum of independent Bernoulli variables.</p>",
    definition:
      "<p><b>The binomial distribution</b> states the lesson's probability object or rule. $$P(X=k)=\\binom nk p^k(1-p)^{n-k}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$n$", desc: "trials" },
      { sym: "$k$", desc: "successes" },
      { sym: "$p$", desc: "success probability" }
    ],
    derivation: [
      { do: "A particular sequence with $k$ successes and $n-k$ failures has probability $p^k(1-p)^{n-k}$.", result: "A particular sequence with $k$ successes and $n-k$ failures has probability $p^k(1-p)^{n-k}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The $k$ success positions can be chosen in $\\binom nk$ ways.", result: "The $k$ success positions can be chosen in $\\binom nk$ ways.", why: "this is the next justified step in the plan's derivation" },
      { do: "Add equal-probability sequences", result: "$P(X=k)=\\binom nk p^k(1-p)^{n-k}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Sum Bernoulli means", result: "$E[X]=np$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Sum independent Bernoulli variances", result: "$\\operatorname{Var}(X)=np(1-p)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "10 impressions, CTR 0.3", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(X=3)=0.2668$." },
      { title: "Mean clicks", background: "Use this setting to read the lesson's probability idea.", numbers: "$10\\cdot0.3=3$." },
      { title: "Variance", background: "Use this setting to read the lesson's probability idea.", numbers: "$10\\cdot0.3\\cdot0.7=2.1$." },
      { title: "At least one success in 5 at $p=0.2$", background: "Use this setting to read the lesson's probability idea.", numbers: "$1-0.8^5=0.6723$." },
      { title: "Fair coins", background: "Use this setting to read the lesson's probability idea.", numbers: "exactly 5 heads in 10 has $\\binom{10}5/2^{10}=0.2461$." },
      { title: "Batch defects", background: "Use this setting to read the lesson's probability idea.", numbers: "$n=100,p=0.01$ gives expected defects $1$." }
    ]
  },
  "math-17-19": {
    connectionsProse:
      "<p>The Poisson distribution models counts in a fixed interval when events occur at a constant average rate. It can be derived as the limit of many tiny Bernoulli opportunities. This makes it useful for rare events, arrivals, defects, and calls. It also connects to the exponential distribution, which models the waiting time between such events.</p>",
    motivation:
      "<p>Some counts do not have a natural fixed number of trials. Calls arrive during a minute, defects appear along a production run, and requests hit a server over time. The Poisson model describes the count when events occur independently and the average rate is stable.</p>" +
      "<p>The limiting construction divides the interval into many small pieces. Each piece has a tiny chance of one event, and the expected total count stays at lambda. As the pieces become smaller, the binomial count approaches the Poisson mass formula.</p>",
    definition:
      "<p><b>The Poisson distribution</b> states the lesson's probability object or rule. $$P(X=k)=e^{-\\lambda}\\lambda^k/k!$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\lambda$", desc: "is expected count" },
      { sym: "$k$", desc: "is observed count" }
    ],
    derivation: [
      { do: "Start with a binomial count over $n$ tiny subintervals with success probability $p=\\lambda/n$.", result: "Start with a binomial count over $n$ tiny subintervals with success probability $p=\\lambda/n$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The mass is $\\binom nk(\\lambda/n)^k(1-\\lambda/n)^{n-k}$.", result: "The mass is $\\binom nk(\\lambda/n)^k(1-\\lambda/n)^{n-k}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "As $n\\to\\infty$, $\\binom nk(\\lambda/n)^k\\to\\lambda^k/k!$.", result: "As $n\\to\\infty$, $\\binom nk(\\lambda/n)^k\\to\\lambda^k/k!$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The no-event factor $(1-\\lambda/n)^n\\to e^{-\\lambda}$.", result: "The no-event factor $(1-\\lambda/n)^n\\to e^{-\\lambda}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The remaining finite correction tends to $1$.", result: "The remaining finite correction tends to $1$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Therefore $P(X=k)=e^{-\\lambda}\\lambda^k/k!$; mean and variance are both $\\lambda$", result: "the MGF.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Calls per minute", background: "Use this setting to read the lesson's probability idea.", numbers: "with $\\lambda=4$: $P(2)=0.1465$." },
      { title: "Expected calls", background: "Use this setting to read the lesson's probability idea.", numbers: "is $4$." },
      { title: "Variance", background: "Use this setting to read the lesson's probability idea.", numbers: "is $4$." },
      { title: "Zero events", background: "Use this setting to read the lesson's probability idea.", numbers: "at $\\lambda=3$ has probability $e^{-3}=0.0498$." },
      { title: "Two independent streams", background: "Use this setting to read the lesson's probability idea.", numbers: "with rates 2 and 5 combine to rate 7." },
      { title: "Rare defects", background: "Use this setting to read the lesson's probability idea.", numbers: "with $\\lambda=1$ gives $P(0)=0.3679$." }
    ]
  },
  "math-17-20": {
    connectionsProse:
      "<p>The geometric distribution changes the focus from how many successes occur to how long it takes to see the first one. It is built from independent Bernoulli trials with the same success probability. The model is useful for retries, first clicks, first heads, and waiting for a rare event. It also introduces a simple discrete waiting-time pattern.</p>",
    motivation:
      "<p>Waiting for a first success has a special structure. To succeed for the first time on trial k, every earlier trial must fail and the kth trial must succeed. There is only one pattern of success and failure for that event.</p>" +
      "<p>Independence turns that pattern into a product of probabilities. The longer the wait, the more failure factors are multiplied before the final success factor. The mean wait 1/p reflects the basic scale: smaller success probabilities create longer expected waits.</p>",
    definition:
      "<p><b>The geometric distribution</b> states the lesson's probability object or rule. $$P(X=k)=(1-p)^{k-1}p$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$p$", desc: "success probability" },
      { sym: "$k$", desc: "trial number of first success" }
    ],
    derivation: [
      { do: "To have first success on trial $k$, the first $k-1$ trials must fail.", result: "To have first success on trial $k$, the first $k-1$ trials must fail.", why: "this is the next justified step in the plan's derivation" },
      { do: "The failure probability for those trials is $(1-p)^{k-1}$.", result: "The failure probability for those trials is $(1-p)^{k-1}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The $k$th trial succeeds with probability $p$.", result: "The $k$th trial succeeds with probability $p$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Independence", result: "$P(X=k)=(1-p)^{k-1}p$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Summing the power series", result: "$E[X]=1/p$ and $\\operatorname{Var}(X)=(1-p)/p^2$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "First click", background: "Use this setting to read the lesson's probability idea.", numbers: "at CTR $0.2$ on trial 4: $0.8^3\\cdot0.2=0.1024$." },
      { title: "Expected trials", background: "Use this setting to read the lesson's probability idea.", numbers: "for $p=0.2$ is $5$." },
      { title: "Variance", background: "Use this setting to read the lesson's probability idea.", numbers: "for $p=0.2$ is $20$." },
      { title: "First head", background: "Use this setting to read the lesson's probability idea.", numbers: "on trial 3 has $0.5^3=0.125$." },
      { title: "No success in 5", background: "Use this setting to read the lesson's probability idea.", numbers: "at $p=0.1$ has $0.9^5=0.5905$." },
      { title: "Median wait rough check", background: "Use this setting to read the lesson's probability idea.", numbers: "for $p=0.5$: $P(X\\le1)=0.5$." }
    ]
  },
  "math-17-21": {
    connectionsProse:
      "<p>The uniform distribution is the simplest model of equal likelihood over a range. In the continuous case, equal-length intervals receive equal probability. This provides a clean example of density, CDF, mean, variance, and quantiles. It also appears as a reference model for random initialization and simulation.</p>",
    motivation:
      "<p>When no location inside an interval is favored, a constant density is the natural continuous model. Since probability is area, equal lengths get equal areas under a flat density. The density height is determined entirely by the requirement that total area equals one.</p>" +
      "<p>The mean sits at the midpoint by symmetry. The variance depends only on the length of the interval, because shifting the interval changes location but not spread. These features make the uniform distribution a useful baseline for understanding more shaped distributions.</p>",
    definition:
      "<p><b>The uniform distribution</b> states the lesson's probability object or rule. $$f(x)=\\frac1{b-a}\\text{ on }[a,b]$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$a,b$", desc: "endpoints" },
      { sym: "$c$", desc: "density" },
      { sym: "$r,s$", desc: "interval endpoints" }
    ],
    derivation: [
      { do: "On $[a,b]$, a constant density must be $c$.", result: "On $[a,b]$, a constant density must be $c$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Total area is $c(b-a)=1$,", result: "$c=1/(b-a)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Interval probability is length times density", result: "$P(r\\le X\\le s)=(s-r)/(b-a)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Symmetry", result: "mean $(a+b)/2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Integrating $(x-\\mu)^2/(b-a)$", result: "variance $(b-a)^2/12$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Wait from 2 to 6", background: "Use this setting to read the lesson's probability idea.", numbers: "has mean $4$." },
      { title: "Variance", background: "Use this setting to read the lesson's probability idea.", numbers: "on $[2,6]$ is $1.3333$." },
      { title: "Between 3 and 5", background: "Use this setting to read the lesson's probability idea.", numbers: "on $[2,6]$ has probability $0.5$." },
      { title: "Random initialization", background: "Use this setting to read the lesson's probability idea.", numbers: "on $[-1,1]$ has density $0.5$." },
      { title: "Die as discrete uniform", background: "Use this setting to read the lesson's probability idea.", numbers: "has mean $3.5$." },
      { title: "Quantile", background: "Use this setting to read the lesson's probability idea.", numbers: "on $[0,10]$: 90th percentile is $9$." }
    ]
  },
  "math-17-22": {
    connectionsProse:
      "<p>The exponential distribution is the waiting-time partner of the Poisson distribution. If Poisson counts describe how many events arrive by a time, the exponential distribution describes the time until the next arrival. Its CDF and density come directly from the probability of no event occurring yet. The model is central in queues, reliability, and continuous-time processes.</p>",
    motivation:
      "<p>A waiting time exceeds t exactly when no event has arrived by time t. In a constant-rate Poisson process, the probability of zero arrivals over that interval is easy to compute. That survival probability determines the exponential distribution.</p>" +
      "<p>Differentiating the CDF turns accumulated probability into a density. The rate lambda controls the time scale: larger rates make shorter waits more likely. The memoryless property reflects the constant-rate assumption, where waiting additional time does not depend on how long one has already waited.</p>",
    definition:
      "<p><b>The exponential distribution</b> states the lesson's probability object or rule. $$F(t)=1-e^{-\\lambda t},\\qquad f(t)=\\lambda e^{-\\lambda t}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$T$", desc: "waiting time" },
      { sym: "$\\lambda$", desc: "rate" },
      { sym: "$f$", desc: "density" },
      { sym: "$F$", desc: "CDF" }
    ],
    derivation: [
      { do: "If events arrive at rate $\\lambda$, no event", result: "time $t$ has Poisson probability $e^{-\\lambda t}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Thus $P(T>t)=e^{-\\lambda t}$.", result: "Thus $P(T>t)=e^{-\\lambda t}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The CDF is $F(t)=1-e^{-\\lambda t}$ for $t\\ge0$.", result: "The CDF is $F(t)=1-e^{-\\lambda t}$ for $t\\ge0$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Differentiate the CDF", result: "density $f(t)=\\lambda e^{-\\lambda t}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Integrating $t f(t)$", result: "mean $1/\\lambda$; integrating $t^2f(t)$ gives variance $1/\\lambda^2$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Rate 0.5", background: "Use this setting to read the lesson's probability idea.", numbers: "has mean wait $2$." },
      { title: "Variance", background: "Use this setting to read the lesson's probability idea.", numbers: "at rate $0.5$ is $4$." },
      { title: "Wait over 6", background: "Use this setting to read the lesson's probability idea.", numbers: "has probability $e^{-3}=0.0498$." },
      { title: "CDF at 2", background: "Use this setting to read the lesson's probability idea.", numbers: "for rate $0.5$ is $1-e^{-1}=0.6321$." },
      { title: "Memoryless wait", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(T>7\\mid T>5)=P(T>2)=e^{-1}=0.3679$." },
      { title: "Median wait", background: "Use this setting to read the lesson's probability idea.", numbers: "at rate $0.5$ is $\\ln2/0.5=1.3863$." }
    ]
  },
  "math-17-23": {
    connectionsProse:
      "<p>The Gaussian distribution is the main bell-shaped continuous model in probability. It is determined by a mean for location and a standard deviation for scale. Standardization converts any Gaussian with positive scale into the standard normal. This distribution is later justified by the Central Limit Theorem and extended by the multivariate Gaussian.</p>",
    motivation:
      "<p>The standard normal gives a reference density centered at zero with variance one. Many real-valued models use a shifted and scaled version of that reference shape. Subtracting the mean recenters the variable, and dividing by the standard deviation expresses distance in standard-deviation units.</p>" +
      "<p>The density transformation accounts for the horizontal stretch caused by sigma. Wider distributions have lower peak density because the total area must remain one. This is why the same bell shape can represent many centers and scales while preserving total probability.</p>",
    definition:
      "<p><b>The Gaussian distribution</b> states the lesson's probability object or rule. $$f_X(x)=\\frac1{\\sigma\\sqrt{2\\pi}}\\exp[-(x-\\mu)^2/(2\\sigma^2)]$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\mu$", desc: "mean" },
      { sym: "$\\sigma$", desc: "standard deviation" },
      { sym: "$z$", desc: "standardized value" }
    ],
    derivation: [
      { do: "Begin with the standard normal density $\\phi(z)=\\frac1{\\sqrt{2\\pi}}e^{-z^2/2}$.", result: "Begin with the standard normal density $\\phi(z)=\\frac1{\\sqrt{2\\pi}}e^{-z^2/2}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Standardize $X$", result: "$Z=(X-\\mu)/\\sigma$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Solve for $x=\\mu+\\sigma z$,", result: "$dz=dx/\\sigma$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Substitute into density area", result: "$f_X(x)dx=\\phi((x-\\mu)/\\sigma)\\,dx/\\sigma$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Therefore $f_X(x)=\\frac1{\\sigma\\sqrt{2\\pi}}\\exp[-(x-\\mu)^2/(2\\sigma^2)]$.", result: "Therefore $f_X(x)=\\frac1{\\sigma\\sqrt{2\\pi}}\\exp[-(x-\\mu)^2/(2\\sigma^2)]$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Exam score", background: "Use this setting to read the lesson's probability idea.", numbers: "$70\\pm10$: $P(60<X<80)=0.6827$." },
      { title: "Tail", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(Z>2)=0.0228$." },
      { title: "Standardize", background: "Use this setting to read the lesson's probability idea.", numbers: "$x=85$, $\\mu=70$, $\\sigma=10$ gives $z=1.5$." },
      { title: "95% band", background: "Use this setting to read the lesson's probability idea.", numbers: "is about $\\mu\\pm1.96\\sigma$." },
      { title: "Density at mean", background: "Use this setting to read the lesson's probability idea.", numbers: "with $\\sigma=10$ is $1/(10\\sqrt{2\\pi})=0.0399$." },
      { title: "Sum of normals", background: "Use this setting to read the lesson's probability idea.", numbers: "means $2+3=5$, variances $4+9=13$." }
    ]
  },
  "math-17-24": {
    connectionsProse:
      "<p>The Beta and Gamma distributions are flexible continuous families for constrained positive quantities. Beta variables live on the probability interval from 0 to 1, while Gamma variables live on the positive line. Their parameters control shape, center, and spread. They are common in Bayesian modeling, waiting-time models, rates, and uncertainty over probabilities.</p>",
    motivation:
      "<p>Some quantities have natural boundaries. A probability cannot be below 0 or above 1, and a waiting time or rate cannot be negative. The Beta and Gamma families build those constraints into the density while still allowing many different shapes.</p>" +
      "<p>Normalization is the main technical issue. The density shape is written first up to proportionality, and then a special-function constant makes the total area equal one. Once normalized, the parameters give simple mean and variance formulas that make the families practical to use.</p>",
    definition:
      "<p><b>The Beta and Gamma distributions</b> states the lesson's probability object or rule. $$f_{\\mathrm{Beta}}(x)=\\frac{x^{\\alpha-1}(1-x)^{\\beta-1}}{B(\\alpha,\\beta)},\\qquad f_{\\mathrm{Gamma}}(x)=\\frac{x^{k-1}e^{-x/\\theta}}{\\Gamma(k)\\theta^k}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\alpha,\\beta$", desc: "are Beta shape parameters" },
      { sym: "$k,\\theta$", desc: "are Gamma shape and scale" },
      { sym: "$\\Gamma$", desc: "is the gamma function" }
    ],
    derivation: [
      { do: "For Beta, use density proportional to $x^{\\alpha-1}(1-x)^{\\beta-1}$ on $[0,1]$.", result: "For Beta, use density proportional to $x^{\\alpha-1}(1-x)^{\\beta-1}$ on $[0,1]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Normalize", result: "$B(\\alpha,\\beta)=\\frac{\\Gamma(\\alpha)\\Gamma(\\beta)}{\\Gamma(\\alpha+\\beta)}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Integrating $x f(x)$", result: "mean $\\alpha/(\\alpha+\\beta)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For Gamma, normalize $x^{k-1}e^{-x/\\theta}$ on $x>0$", result: "$\\Gamma(k)\\theta^k$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Its mean is $k\\theta$ and variance is $k\\theta^2$.", result: "Its mean is $k\\theta$ and variance is $k\\theta^2$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Beta(2,5)", background: "Use this setting to read the lesson's probability idea.", numbers: "mean is $2/7=0.2857$." },
      { title: "Beta(2,5)", background: "Use this setting to read the lesson's probability idea.", numbers: "variance is $10/(49\\cdot8)=0.0255$." },
      { title: "Uniform prior", background: "Use this setting to read the lesson's probability idea.", numbers: "is Beta(1,1)." },
      { title: "After 3 successes and 7 failures", background: "Use this setting to read the lesson's probability idea.", numbers: "with Beta(1,1), posterior is Beta(4,8)." },
      { title: "Gamma(3,2)", background: "Use this setting to read the lesson's probability idea.", numbers: "mean is $6$." },
      { title: "Gamma(3,2)", background: "Use this setting to read the lesson's probability idea.", numbers: "variance is $12$." }
    ]
  },
  "math-17-25": {
    connectionsProse:
      "<p>Joint distributions move from one random variable to several variables considered together. They preserve co-occurrence information that separate marginal distributions would lose. This is the starting point for marginals, conditional distributions, independence of random variables, covariance, and correlation. It also supports multivariate models such as the multivariate Gaussian.</p>",
    motivation:
      "<p>Two variables can each have simple individual behavior while still being related to each other. A joint distribution records the probability of pairs or regions, so it can answer questions about variables happening together. Without the joint distribution, dependence information is missing.</p>" +
      "<p>For discrete variables, the joint distribution is a table of masses that sum to one. For continuous variables, it is a density over a region, and probabilities come from integrating over that region. In both cases, the joint object is the full probability model for the variables together.</p>",
    definition:
      "<p><b>Joint distributions</b> states the lesson's probability object or rule. $$P((X,Y)\\in R)=\\iint_R f_{X,Y}(x,y)\\,dx\\,dy$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$p_{X,Y}$", desc: "joint pmf" },
      { sym: "$f_{X,Y}$", desc: "joint density" },
      { sym: "$R$", desc: "a region in the plane" }
    ],
    derivation: [
      { do: "For discrete variables, assign mass $p_{X,Y}(x,y)=P(X=x,Y=y)$.", result: "For discrete variables, assign mass $p_{X,Y}(x,y)=P(X=x,Y=y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "All joint masses must be nonnegative and sum to $1$.", result: "All joint masses must be nonnegative and sum to $1$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The probability of a rectangle is the sum over pairs inside it.", result: "The probability of a rectangle is the sum over pairs inside it.", why: "this is the next justified step in the plan's derivation" },
      { do: "For continuous variables, replace sums by double integrals", result: "$P((X,Y)\\in R)=\\iint_R f_{X,Y}(x,y)\\,dx\\,dy$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Joint table", background: "Use this setting to read the lesson's probability idea.", numbers: "$[[0.1,0.4],[0.2,0.3]]$ sums to $1$." },
      { title: "Event $X=1,Y=2$", background: "Use this setting to read the lesson's probability idea.", numbers: "in that table has mass $0.3$." },
      { title: "$X+Y>1$", background: "Use this setting to read the lesson's probability idea.", numbers: "for $X\\in\\{0,1\\},Y\\in\\{0,2\\}$ has mass $0.4+0.3=0.7$." },
      { title: "Bivariate density over unit square", background: "Use this setting to read the lesson's probability idea.", numbers: "$f=1$ has total mass $1$." },
      { title: "Rectangle half-square", background: "Use this setting to read the lesson's probability idea.", numbers: "area $0.5$ has probability $0.5$." },
      { title: "Two labels", background: "Use this setting to read the lesson's probability idea.", numbers: "with 3 classes each have $9$ joint cells." }
    ]
  },
  "math-17-26": {
    connectionsProse:
      "<p>Marginal distributions extract one variable from a joint distribution. They answer how X behaves by itself after the other variables are ignored. The operation is summing in the discrete case and integrating in the continuous case. Marginals are needed for conditional distributions, independence tests, and covariance calculations.</p>",
    motivation:
      "<p>A joint table or density contains more information than is sometimes needed. If the current question only concerns X, all possibilities for Y should be included rather than fixed. Marginalization adds up the joint probabilities across the variable being removed.</p>" +
      "<p>The name marginal comes from table margins, where row and column sums sit at the edges of a joint table. The same idea works in continuous models by integration. The resulting distribution is a valid distribution because it collects all joint mass associated with each value of the variable kept.</p>",
    definition:
      "<p><b>Marginal distributions</b> states the lesson's probability object or rule. $$p_X(x)=\\sum_y p_{X,Y}(x,y),\\qquad f_X(x)=\\int f_{X,Y}(x,y)\\,dy$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$p_X$", desc: "are marginals" },
      { sym: "$f_X$", desc: "are marginals" },
      { sym: "$y$", desc: "is the variable removed" }
    ],
    derivation: [
      { do: "The event $X=x$ is the disjoint union over all possible $Y=y$", result: "$(X=x,Y=y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Add those disjoint masses", result: "$p_X(x)=\\sum_y p_{X,Y}(x,y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For continuous variables, add by integration", result: "$f_X(x)=\\int f_{X,Y}(x,y)\\,dy$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The resulting marginal sums or integrates to $1$ because the joint does.", result: "The resulting marginal sums or integrates to $1$ because the joint does.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Joint table", background: "Use this setting to read the lesson's probability idea.", numbers: "row sums give $P(X=0)=0.5$, $P(X=1)=0.5$." },
      { title: "Column sums", background: "Use this setting to read the lesson's probability idea.", numbers: "give $P(Y=0)=0.3$, $P(Y=2)=0.7$." },
      { title: "Continuous square", background: "Use this setting to read the lesson's probability idea.", numbers: "marginal of uniform unit square is $1$ on $[0,1]$." },
      { title: "Customer segment", background: "Use this setting to read the lesson's probability idea.", numbers: "marginal sums campaign responses across devices." },
      { title: "Image pixels", background: "Use this setting to read the lesson's probability idea.", numbers: "marginal color distribution sums over positions." },
      { title: "Joint labels", background: "Use this setting to read the lesson's probability idea.", numbers: "3 by 4 table marginal has 3 row probabilities." }
    ]
  },
  "math-17-27": {
    connectionsProse:
      "<p>Conditional distributions combine joint and marginal distributions. They give the full distribution of one variable after another variable has been observed. This extends conditional probability from single events to all values of a random variable. It is used in Bayesian classifiers, regression, Gaussian conditioning, and conditional expectation.</p>",
    motivation:
      "<p>Knowing Y=y changes the relevant part of the joint distribution. Only the slice of the joint model at that value of Y remains, and it must be renormalized so probabilities over X sum to one. That normalized slice is the conditional distribution.</p>" +
      "<p>The formula mirrors ordinary conditional probability. The numerator is the joint mass or density for the specific pair, and the denominator is the total marginal mass or density of the condition. This denominator is what makes the conditional distribution a proper distribution over X.</p>",
    definition:
      "<p><b>Conditional distributions</b> states the lesson's probability object or rule. $$p_{X\\mid Y}(x\\mid y)=\\frac{p_{X,Y}(x,y)}{p_Y(y)}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$p_{X\\mid Y}$", desc: "conditional pmf" },
      { sym: "$f_{X\\mid Y}$", desc: "conditional density" },
      { sym: "$p_Y(y)$", desc: "normalizing marginal" }
    ],
    derivation: [
      { do: "Start with conditional probability for events", result: "$P(X=x\\mid Y=y)=P(X=x,Y=y)/P(Y=y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Replace the numerator with joint mass $p_{X,Y}(x,y)$.", result: "Replace the numerator with joint mass $p_{X,Y}(x,y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Replace denominator with marginal $p_Y(y)$.", result: "Replace denominator with marginal $p_Y(y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Get $p_{X\\mid Y}(x\\mid y)=p_{X,Y}(x,y)/p_Y(y)$.", result: "Get $p_{X\\mid Y}(x\\mid y)=p_{X,Y}(x,y)/p_Y(y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For densities, use the same ratio $f_{X\\mid Y}=f_{X,Y}/f_Y$ where $f_Y(y)>0$.", result: "For densities, use the same ratio $f_{X\\mid Y}=f_{X,Y}/f_Y$ where $f_Y(y)>0$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Joint table", background: "Use this setting to read the lesson's probability idea.", numbers: "gives $P(X=1\\mid Y=2)=0.3/0.7=0.4286$." },
      { title: "Given $Y=0$", background: "Use this setting to read the lesson's probability idea.", numbers: ", $P(X=0\\mid Y=0)=0.1/0.3=0.3333$." },
      { title: "Bayes classifier", background: "Use this setting to read the lesson's probability idea.", numbers: "uses $P(\\text{class}\\mid\\text{features})$." },
      { title: "Recommendation", background: "Use this setting to read the lesson's probability idea.", numbers: "uses item distribution conditional on user segment." },
      { title: "Conditional Gaussian", background: "Use this setting to read the lesson's probability idea.", numbers: "narrows uncertainty after an observation." },
      { title: "Confusion matrix recall", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(\\hat Y=1\\mid Y=1)=TP/(TP+FN)$." }
    ]
  },
  "math-17-28": {
    connectionsProse:
      "<p>Independence of random variables extends independence of events to full distributions. Instead of one event leaving another event unchanged, every value of one variable leaves the distribution of the other unchanged. The joint distribution then factors into the product of marginals. This factorization simplifies sums, MGFs, convolution, and limit theorems.</p>",
    motivation:
      "<p>Random variables can be unrelated in a stronger sense than merely having zero covariance. If X and Y are independent, observing Y gives no distributional information about X. Every conditional distribution of X is the same as its marginal distribution.</p>" +
      "<p>The product form is the practical test. In a joint table, each cell must equal the row marginal times the column marginal. In a density, the joint surface must factor into one function of x times one function of y. When this fails, the variables carry dependence information.</p>",
    definition:
      "<p><b>Independence of random variables</b> states the lesson's probability object or rule. $$p_{X,Y}(x,y)=p_X(x)p_Y(y)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$X\\perp Y$", desc: "means independent" },
      { sym: "$p_X,p_Y$", desc: "are marginals" }
    ],
    derivation: [
      { do: "Independence means $P(X=x\\mid Y=y)=P(X=x)$ for all relevant $x,y$.", result: "Independence means $P(X=x\\mid Y=y)=P(X=x)$ for all relevant $x,y$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Substitute the conditional formula $p_{X,Y}(x,y)/p_Y(y)=p_X(x)$.", result: "Substitute the conditional formula $p_{X,Y}(x,y)/p_Y(y)=p_X(x)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Multiply by $p_Y(y)$", result: "$p_{X,Y}(x,y)=p_X(x)p_Y(y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The density version uses the same factorization with $f$.", result: "The density version uses the same factorization with $f$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Two fair dice", background: "Use this setting to read the lesson's probability idea.", numbers: "$P(2,5)=1/36=(1/6)(1/6)$." },
      { title: "Joint table check", background: "Use this setting to read the lesson's probability idea.", numbers: "if marginals are $0.5,0.5$ and $0.3,0.7$, independent cell $(1,2)$ would be $0.35$, not $0.3$." },
      { title: "Feature independence", background: "Use this setting to read the lesson's probability idea.", numbers: "in Naive Bayes multiplies likelihoods." },
      { title: "Independent normals", background: "Use this setting to read the lesson's probability idea.", numbers: "have diagonal covariance matrix." },
      { title: "Independent Bernoulli $0.2,0.3$", background: "Use this setting to read the lesson's probability idea.", numbers: "both succeed with $0.06$." },
      { title: "A product density", background: "Use this setting to read the lesson's probability idea.", numbers: "$2x\\cdot3y^2$ on unit square factors into marginals." }
    ]
  },
  "math-17-29": {
    connectionsProse:
      "<p>Covariance is the first numeric summary of how two variables move together. It uses centered variables, so it measures joint deviations from their means. Positive, negative, and zero covariance describe different kinds of linear co-movement. This lesson prepares for correlation, covariance matrices, and the multivariate Gaussian.</p>",
    motivation:
      "<p>To compare movement, each variable is first measured relative to its own mean. When both centered values are usually positive together or negative together, their product tends to be positive. When one is often above its mean while the other is below, the product tends to be negative.</p>" +
      "<p>Averaging those centered products gives covariance. Its sign is easy to interpret, but its units depend on the units of both variables. That is why the next lesson rescales covariance into correlation for comparisons across different measurement scales.</p>",
    definition:
      "<p><b>Covariance</b> states the lesson's probability object or rule. $$\\operatorname{Cov}(X,Y)=E[(X-\\mu_X)(Y-\\mu_Y)]=E[XY]-\\mu_X\\mu_Y$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\mu_X,\\mu_Y$", desc: "are means" },
      { sym: "$E[XY]$", desc: "is expected product" }
    ],
    derivation: [
      { do: "Define covariance as $\\operatorname{Cov}(X,Y)=E[(X-\\mu_X)(Y-\\mu_Y)]$.", result: "Define covariance as $\\operatorname{Cov}(X,Y)=E[(X-\\mu_X)(Y-\\mu_Y)]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Expand the product", result: "$XY-X\\mu_Y-Y\\mu_X+\\mu_X\\mu_Y$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Take expectation term", result: "term.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use $E[X]=\\mu_X$ and $E[Y]=\\mu_Y$.", result: "Use $E[X]=\\mu_X$ and $E[Y]=\\mu_Y$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Get $\\operatorname{Cov}(X,Y)=E[XY]-\\mu_X\\mu_Y$.", result: "Get $\\operatorname{Cov}(X,Y)=E[XY]-\\mu_X\\mu_Y$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Joint table", background: "Use this setting to read the lesson's probability idea.", numbers: "example has $E[X]=0.5$, $E[Y]=1.4$, $E[XY]=0.6$, covariance $-0.1$." },
      { title: "Independent variables", background: "Use this setting to read the lesson's probability idea.", numbers: "have covariance $0$." },
      { title: "Portfolio", background: "Use this setting to read the lesson's probability idea.", numbers: "variance uses $2\\operatorname{Cov}(X,Y)$." },
      { title: "Feature redundancy", background: "Use this setting to read the lesson's probability idea.", numbers: "positive covariance flags similar movement." },
      { title: "Centered vectors", background: "Use this setting to read the lesson's probability idea.", numbers: "average product of centered columns is sample covariance." },
      { title: "Scale effect", background: "Use this setting to read the lesson's probability idea.", numbers: "$\\operatorname{Cov}(2X,Y)=2\\operatorname{Cov}(X,Y)$." }
    ]
  },
  "math-17-30": {
    connectionsProse:
      "<p>Correlation turns covariance into a unitless measure of linear association. It standardizes both variables before measuring their average product. The result always lies between negative one and one, making comparisons easier across different units. Correlation is used in feature screening, portfolio analysis, and covariance-matrix interpretation.</p>",
    motivation:
      "<p>Covariance changes when variables are rescaled, so its magnitude is hard to compare across contexts. Dividing by the two standard deviations removes the units. The result measures association after both variables have been put on standard-deviation scale.</p>" +
      "<p>The bound between negative one and one comes from Cauchy-Schwarz applied to the standardized variables. Values near one or negative one indicate strong linear alignment, while zero means no linear association. Zero correlation alone does not rule out nonlinear dependence.</p>",
    definition:
      "<p><b>Correlation</b> states the lesson's probability object or rule. $$\\rho=\\frac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\sigma_Y}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\rho$", desc: "correlation" },
      { sym: "$\\sigma_X,\\sigma_Y$", desc: "standard deviations" }
    ],
    derivation: [
      { do: "Standardize variables", result: "$Z_X=(X-\\mu_X)/\\sigma_X$ and $Z_Y=(Y-\\mu_Y)/\\sigma_Y$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Take covariance of standardized variables.", result: "Take covariance of standardized variables.", why: "this is the next justified step in the plan's derivation" },
      { do: "Constants factor out, giving $E[Z_XZ_Y]=\\operatorname{Cov}(X,Y)/(\\sigma_X\\sigma_Y)$.", result: "Constants factor out, giving $E[Z_XZ_Y]=\\operatorname{Cov}(X,Y)/(\\sigma_X\\sigma_Y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Cauchy-Schwarz", result: "$|E[Z_XZ_Y]|\\le\\sqrt{E[Z_X^2]E[Z_Y^2]}=1$, so correlation is between $-1$ and $1$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Covariance $6$, sds $2$ and $3$", background: "Use this setting to read the lesson's probability idea.", numbers: "gives $\\rho=1$." },
      { title: "Covariance $-1$, sds $2$ and $4$", background: "Use this setting to read the lesson's probability idea.", numbers: "gives $\\rho=-0.125$." },
      { title: "Feature screening", background: "Use this setting to read the lesson's probability idea.", numbers: "uses $|\\rho|>0.9$ for near-duplicates." },
      { title: "Zero correlation", background: "Use this setting to read the lesson's probability idea.", numbers: "means no linear association, not full independence." },
      { title: "Portfolio pairs", background: "Use this setting to read the lesson's probability idea.", numbers: "with $\\rho=-0.5$ diversify more than $\\rho=0.8$." },
      { title: "Units vanish", background: "Use this setting to read the lesson's probability idea.", numbers: "when centimeters are converted to meters." }
    ]
  },
  "math-17-31": {
    connectionsProse:
      "<p>Transformations create new random variables from old ones. They are used when shifting, scaling, standardizing, logging, squaring, or otherwise re-expressing a quantity. For densities, probability must be preserved while the horizontal scale changes. This is the basis of change-of-variables calculations in continuous probability.</p>",
    motivation:
      "<p>If Y is defined as a function of X, probabilities for Y must come from the corresponding probabilities for X. A shift moves the distribution, a scale stretches it, and nonlinear transformations can bend or fold the support. The distribution changes even though the underlying probability mass is conserved.</p>" +
      "<p>For a one-to-one differentiable transformation, matching small intervals have the same probability. If the transformation stretches the horizontal axis, the density height must shrink, and if it compresses the axis, the density height must grow. The Jacobian factor records that stretch.</p>",
    definition:
      "<p><b>Transformations of random variables</b> states the lesson's probability object or rule. $$f_Y(y)=f_X(g^{-1}(y))\\left|\\frac{d}{dy}g^{-1}(y)\\right|$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$g$", desc: "transformation" },
      { sym: "$g^{-1}$", desc: "inverse" },
      { sym: "Jacobian is the stretch factor", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "Let $Y=g(X)$ with one-to-one differentiable $g$.", result: "Let $Y=g(X)$ with one-to-one differentiable $g$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Equal probabilities in matching small intervals", result: "$f_Y(y)dy=f_X(x)dx$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Since $x=g^{-1}(y)$, divide by $dy$", result: "$f_Y(y)=f_X(g^{-1}(y))\\left|\\frac{d}{dy}g^{-1}(y)\\right|$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The absolute derivative is the Jacobian scale factor.", result: "The absolute derivative is the Jacobian scale factor.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Scale", background: "Use this setting to read the lesson's probability idea.", numbers: "$Y=2X$ for uniform $[0,1]$ gives uniform $[0,2]$ with density $0.5$." },
      { title: "Shift", background: "Use this setting to read the lesson's probability idea.", numbers: "$Y=X+3$ shifts mean by $3$." },
      { title: "Square", background: "Use this setting to read the lesson's probability idea.", numbers: "$Y=X^2$ needs two preimages except at $0$." },
      { title: "Log transform", background: "Use this setting to read the lesson's probability idea.", numbers: "if $Y=e^X$, density includes $1/y$." },
      { title: "Standardization", background: "Use this setting to read the lesson's probability idea.", numbers: "$Z=(X-\\mu)/\\sigma$ gives unitless values." },
      { title: "Variance scaling", background: "Use this setting to read the lesson's probability idea.", numbers: "$\\operatorname{Var}(2X+1)=4\\operatorname{Var}(X)$." }
    ]
  },
  "math-17-32": {
    connectionsProse:
      "<p>Sums of random variables combine probability distributions. A target sum can be produced by many pairs of component values, so all matching pairs must be accounted for. Convolution is the operation that performs this accounting. It appears in dice sums, noise addition, delivery times, Poisson rates, and normal sums.</p>",
    motivation:
      "<p>When Z equals X plus Y, the event Z=z is not usually a single event in the joint space. It includes every combination where X takes one value and Y supplies the remaining amount. For dice, a sum of seven comes from several ordered pairs.</p>" +
      "<p>Convolution adds the probability of each matching pair. Independence simplifies the joint probability into a product of marginal probabilities. In continuous models, the same idea becomes an integral over all ways to split the total z into x and z minus x.</p>",
    definition:
      "<p><b>Sums of random variables and convolution</b> states the lesson's probability object or rule. $$p_Z(z)=\\sum_x p_X(x)p_Y(z-x),\\qquad f_Z(z)=\\int f_X(x)f_Y(z-x)\\,dx$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$Z=X+Y$", desc: "notation from the plan" },
      { sym: "convolution is the sum/integral over matching pairs", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "For discrete $Z=X+Y$, event $Z=z$ is the disjoint union over $x$ of $X=x$ and $Y=z-x$.", result: "For discrete $Z=X+Y$, event $Z=z$ is the disjoint union over $x$ of $X=x$ and $Y=z-x$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Add the joint probabilities.", result: "Add the joint probabilities.", why: "this is the next justified step in the plan's derivation" },
      { do: "If $X,Y$ are independent, joint mass factors.", result: "If $X,Y$ are independent, joint mass factors.", why: "this is the next justified step in the plan's derivation" },
      { do: "Therefore $p_Z(z)=\\sum_xp_X(x)p_Y(z-x)$.", result: "Therefore $p_Z(z)=\\sum_xp_X(x)p_Y(z-x)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "For densities, replace the sum", result: "$f_Z(z)=\\int f_X(x)f_Y(z-x)\\,dx$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Two dice sum 7", background: "Use this setting to read the lesson's probability idea.", numbers: "$6/36=1/6$." },
      { title: "Two fair coins heads count", background: "Use this setting to read the lesson's probability idea.", numbers: "has masses $1/4,1/2,1/4$." },
      { title: "Poisson rates 2 and 5", background: "Use this setting to read the lesson's probability idea.", numbers: "sum to Poisson rate $7$." },
      { title: "Independent normals", background: "Use this setting to read the lesson's probability idea.", numbers: "add variances: $4+9=13$." },
      { title: "Delivery time", background: "Use this setting to read the lesson's probability idea.", numbers: "as packing plus shipping uses convolution." },
      { title: "Ensemble error", background: "Use this setting to read the lesson's probability idea.", numbers: "sums independent noise variances." }
    ]
  },
  "math-17-33": {
    connectionsProse:
      "<p>Conditional expectation summarizes a conditional distribution by its average. It combines the conditional-distribution idea with expectation. When the condition is random, the conditional expectation is itself a random variable that changes with the observed information. This leads directly to the law of total expectation and to prediction as conditional averaging.</p>",
    motivation:
      "<p>After observing information such as a segment, feature bin, or class, the distribution of X may change. Conditional expectation gives the center of that updated distribution. It is the best single average to use within that condition.</p>" +
      "<p>The law of total expectation says that averaging conditional averages over the cases returns the overall average. This is a consistency rule: first average within each group, then weight by group frequency. It is the expectation counterpart of the law of total probability.</p>",
    definition:
      "<p><b>Conditional expectation</b> states the lesson's probability object or rule. $$E[X\\mid Y=y]=\\sum_x x p_{X\\mid Y}(x\\mid y)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$E[X\\mid Y]$", desc: "is the conditional mean as a function of $Y$" }
    ],
    derivation: [
      { do: "For a fixed condition $Y=y$, use the conditional distribution of $X$.", result: "For a fixed condition $Y=y$, use the conditional distribution of $X$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Average with those conditional probabilities", result: "$E[X\\mid Y=y]=\\sum_xx p_{X\\mid Y}(x\\mid y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "To derive total expectation, average these conditional means over $Y$", result: "$E[E[X\\mid Y]]=\\sum_y E[X\\mid Y=y]P(Y=y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Substitute the conditional sum and simplify to $\\sum_xxP(X=x)=E[X]$.", result: "Substitute the conditional sum and simplify to $\\sum_xxP(X=x)=E[X]$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Segment revenue", background: "Use this setting to read the lesson's probability idea.", numbers: "mobile mean $5$ with weight $0.6$, desktop mean $8$ with weight $0.4$ gives overall $6.2$." },
      { title: "Risk score", background: "Use this setting to read the lesson's probability idea.", numbers: "averages labels within a feature bin." },
      { title: "Joint table", background: "Use this setting to read the lesson's probability idea.", numbers: "gives $E[X\\mid Y=2]=0.3/0.7=0.4286$." },
      { title: "Dice given even", background: "Use this setting to read the lesson's probability idea.", numbers: "has mean $(2+4+6)/3=4$." },
      { title: "Forecast calibration", background: "Use this setting to read the lesson's probability idea.", numbers: "checks average outcome at predicted $0.7$." },
      { title: "Queue time", background: "Use this setting to read the lesson's probability idea.", numbers: "conditioned on priority class creates class-specific averages." }
    ]
  },
  "math-17-34": {
    connectionsProse:
      "<p>Markov’s inequality is a broad tail bound for nonnegative random variables. It uses only the mean and does not require a distributional shape. Because it assumes so little, the bound can be loose, but it is widely applicable. It also serves as the main ingredient for Chebyshev’s inequality.</p>",
    motivation:
      "<p>For a nonnegative variable to be very large with high probability, its mean must also be large. Markov’s inequality formalizes that basic constraint. If the mean is small, the probability of exceeding a much larger threshold cannot be too high.</p>" +
      "<p>The proof isolates the contribution to the expectation from the tail event. On the event X is at least a, each outcome contributes at least a to the average. That forces the mean to be at least a times the tail probability, which gives the bound after division.</p>",
    definition:
      "<p><b>Markov's inequality</b> states the lesson's probability object or rule. $$P(X\\ge a)\\le \\frac{E[X]}{a}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$a$", desc: "threshold" },
      { sym: "$E[X]$", desc: "mean" },
      { sym: "require $X\\ge0$", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "Assume $X\\ge0$.", result: "Assume $X\\ge0$.", why: "this is the next justified step in the plan's derivation" },
      { do: "On event $X\\ge a$, the value of $X$ is at least $a$.", result: "On event $X\\ge a$, the value of $X$ is at least $a$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Therefore $E[X]$ is at least the contribution from that event", result: "$E[X]\\ge aP(X\\ge a)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Divide by $a>0$", result: "$P(X\\ge a)\\le E[X]/a$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Runtime", background: "Use this setting to read the lesson's probability idea.", numbers: "mean 100 ms: $P(X\\ge500)\\le0.2$." },
      { title: "Loss", background: "Use this setting to read the lesson's probability idea.", numbers: "mean 0.4: $P(L\\ge2)\\le0.2$." },
      { title: "Queue length", background: "Use this setting to read the lesson's probability idea.", numbers: "mean 3: $P(Q\\ge10)\\le0.3$." },
      { title: "Spend", background: "Use this setting to read the lesson's probability idea.", numbers: "mean $50$: $P(S\\ge200)\\le0.25$." },
      { title: "Gradient norm squared", background: "Use this setting to read the lesson's probability idea.", numbers: "mean 0.01: $P(\\|g\\|^2\\ge0.1)\\le0.1$." },
      { title: "Nonnegative error", background: "Use this setting to read the lesson's probability idea.", numbers: "mean 0.02: $P(E\\ge0.1)\\le0.2$." }
    ]
  },
  "math-17-35": {
    connectionsProse:
      "<p>Chebyshev’s inequality strengthens the basic tail-bound idea by using variance. It applies to deviations from the mean and does not assume normality or any particular distribution shape. The result explains how smaller variance forces more concentration around the mean. It is also the key proof tool for the Law of Large Numbers in this section.</p>",
    motivation:
      "<p>Variance measures the average squared distance from the mean. If many outcomes were far from the mean, that average squared distance would have to be large. Chebyshev’s inequality turns this observation into a bound on the probability of a large deviation.</p>" +
      "<p>The proof applies Markov’s inequality to the nonnegative squared deviation. The event of being at least a away from the mean is exactly the event that the squared deviation is at least a squared. This converts a variance statement into a probability tail bound.</p>",
    definition:
      "<p><b>Chebyshev's inequality</b> states the lesson's probability object or rule. $$P(|X-\\mu|\\ge a)\\le \\frac{\\sigma^2}{a^2}$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\mu$", desc: "mean" },
      { sym: "$\\sigma^2$", desc: "variance" },
      { sym: "$a$", desc: "distance from mean" }
    ],
    derivation: [
      { do: "Let $Y=(X-\\mu)^2$, which is nonnegative.", result: "Let $Y=(X-\\mu)^2$, which is nonnegative.", why: "this is the next justified step in the plan's derivation" },
      { do: "Event $|X-\\mu|\\ge a$ is the same as $Y\\ge a^2$.", result: "Event $|X-\\mu|\\ge a$ is the same as $Y\\ge a^2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Apply Markov", result: "$P(Y\\ge a^2)\\le E[Y]/a^2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use $E[Y]=\\operatorname{Var}(X)=\\sigma^2$.", result: "Use $E[Y]=\\operatorname{Var}(X)=\\sigma^2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Get $P(|X-\\mu|\\ge a)\\le\\sigma^2/a^2$.", result: "Get $P(|X-\\mu|\\ge a)\\le\\sigma^2/a^2$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Mean 100, sd 15, distance 30", background: "Use this setting to read the lesson's probability idea.", numbers: "bound $225/900=0.25$." },
      { title: "Within 2 sd", background: "Use this setting to read the lesson's probability idea.", numbers: "has probability at least $0.75$." },
      { title: "Within 3 sd", background: "Use this setting to read the lesson's probability idea.", numbers: "at least $0.8889$." },
      { title: "Estimator sd 0.05", background: "Use this setting to read the lesson's probability idea.", numbers: "error over $0.2$ bounded by $0.0625$." },
      { title: "Queue mean 10, sd 4", background: "Use this setting to read the lesson's probability idea.", numbers: "outside 8 units bounded by $0.25$." },
      { title: "Model metric sd 0.01", background: "Use this setting to read the lesson's probability idea.", numbers: "deviation over $0.05$ bounded by $0.04$." }
    ]
  },
  "math-17-36": {
    connectionsProse:
      "<p>Jensen’s inequality connects probability with convexity. It compares applying a function after averaging with averaging after applying the function. This is important whenever nonlinear losses, utilities, penalties, or transformations appear. It also explains common inequalities involving squares, absolute values, logarithms, and square roots.</p>",
    motivation:
      "<p>Linear functions commute with averaging, but curved functions generally do not. For a convex function, the graph lies below the chord between two points. That geometry implies that applying the function to an average is no larger than averaging the function values.</p>" +
      "<p>The probability version treats the weights in a convex combination as probabilities. A random variable is an average over its possible values, and the inequality compares two orders of operation. Concave functions reverse the direction, which is why logarithms and square roots behave differently from squares.</p>",
    definition:
      "<p><b>Jensen's inequality</b> states the lesson's probability object or rule. $$f(E[X])\\le E[f(X)]$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$f$", desc: "convex" },
      { sym: "$\\lambda$", desc: "weight" },
      { sym: "$E$", desc: "expectation" }
    ],
    derivation: [
      { do: "For two points, convexity says $f(\\lambda x+(1-\\lambda)y)\\le\\lambda f(x)+(1-\\lambda)f(y)$.", result: "For two points, convexity says $f(\\lambda x+(1-\\lambda)y)\\le\\lambda f(x)+(1-\\lambda)f(y)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Interpret $\\lambda$ and $1-\\lambda$ as probabilities of a two-valued random variable.", result: "Interpret $\\lambda$ and $1-\\lambda$ as probabilities of a two-valued random variable.", why: "this is the next justified step in the plan's derivation" },
      { do: "Then the left side is $f(E[X])$ and the right side is $E[f(X)]$.", result: "Then the left side is $f(E[X])$ and the right side is $E[f(X)]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Approximate a general distribution by finite weighted points and take limits", result: "$f(E[X])\\le E[f(X)]$ for convex $f$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Square loss", background: "Use this setting to read the lesson's probability idea.", numbers: "$E[X^2]\\ge(E[X])^2$." },
      { title: "Log utility", background: "Use this setting to read the lesson's probability idea.", numbers: "is concave, so $E[\\log X]\\le\\log E[X]$." },
      { title: "Sqrt concavity", background: "Use this setting to read the lesson's probability idea.", numbers: "average of $\\sqrt1$ and $\\sqrt9$ is $2$, while $\\sqrt5=2.2361$." },
      { title: "Risk penalty", background: "Use this setting to read the lesson's probability idea.", numbers: "variance appears because squared average error is below average squared error." },
      { title: "ELBO style", background: "Use this setting to read the lesson's probability idea.", numbers: "concavity of log moves expectation inside as an upper direction." },
      { title: "Absolute value", background: "Use this setting to read the lesson's probability idea.", numbers: "$E|X|\\ge|E[X]|$." }
    ]
  },
  "math-17-37": {
    connectionsProse:
      "<p>The Law of Large Numbers turns expectation into an observable long-run average. It uses independence, variance, and Chebyshev’s inequality to show that sample averages stabilize near the true mean. This result justifies estimating population means with repeated samples. It also sets up the Central Limit Theorem, which describes the remaining fluctuation around the mean.</p>",
    motivation:
      "<p>Each observation contains noise, but averaging independent observations reduces that noise. The mean of the average remains the true mean, while the variance of the average shrinks by a factor of n. This is the mathematical reason repeated measurements become more stable.</p>" +
      "<p>Chebyshev’s inequality converts the shrinking variance into a probability statement. For any fixed tolerance, the probability that the sample average misses the mean by at least that tolerance goes to zero. The theorem says convergence happens in probability, not that every finite sample equals the mean.</p>",
    definition:
      "<p><b>The Law of Large Numbers</b> states the lesson's probability object or rule. $$P(|\\bar X_n-\\mu|\\ge\\epsilon)\\le\\frac{\\sigma^2}{n\\epsilon^2}\\to0$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\bar X_n$", desc: "sample average" },
      { sym: "$\\epsilon$", desc: "tolerance" },
      { sym: "$n$", desc: "sample size" }
    ],
    derivation: [
      { do: "Let $\\bar X_n=(X_1+\\cdots+X_n)/n$ with independent variables of mean $\\mu$ and variance $\\sigma^2$.", result: "Let $\\bar X_n=(X_1+\\cdots+X_n)/n$ with independent variables of mean $\\mu$ and variance $\\sigma^2$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Linearity", result: "$E[\\bar X_n]=\\mu$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Independence", result: "$\\operatorname{Var}(\\bar X_n)=\\frac{1}{n^2}n\\sigma^2=\\sigma^2/n$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Apply Chebyshev", result: "$P(|\\bar X_n-\\mu|\\ge\\epsilon)\\le\\sigma^2/(n\\epsilon^2)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "As $n\\to\\infty$, the bound goes to $0$, proving convergence in probability.", result: "As $n\\to\\infty$, the bound goes to $0$, proving convergence in probability.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Coin flips", background: "Use this setting to read the lesson's probability idea.", numbers: "with $p=0.5$, $n=10000$, sd of sample proportion is $0.005$." },
      { title: "Ratings", background: "Use this setting to read the lesson's probability idea.", numbers: "variance 4, $n=400$, average variance $0.01$." },
      { title: "Monte Carlo", background: "Use this setting to read the lesson's probability idea.", numbers: "variance 9, $n=900$, standard error $0.1$." },
      { title: "A/B metric", background: "Use this setting to read the lesson's probability idea.", numbers: "more users shrink noise like $1/\\sqrt n$." },
      { title: "Manufacturing", background: "Use this setting to read the lesson's probability idea.", numbers: "average fill weight stabilizes across batches." },
      { title: "Dice average", background: "Use this setting to read the lesson's probability idea.", numbers: "converges to $3.5$." }
    ]
  },
  "math-17-38": {
    connectionsProse:
      "<p>This lesson gathers several tools from the section into one result. Expectation gives the long-run center of a random quantity, variance measures its spread, and independence lets the variation in separate samples combine in a controlled way. The Law of Large Numbers says that sample averages settle near the mean. The Central Limit Theorem adds the shape of the remaining error: after the average is centered and scaled by its standard error, its distribution becomes approximately normal.</p><p>This is why normal curves appear in measurement error, polling, A/B tests, stochastic optimization, and confidence intervals even when the original data are not normal. The theorem is not saying that every dataset is normal. It says that sums and averages of many independent small contributions have a normal limiting shape after the correct centering and scaling.</p>",
    motivation:
      "<p>Suppose individual observations have mean $\\mu$ and standard deviation $\\sigma$. The sample average $\\bar X_n$ still has mean $\\mu$, but its standard deviation is smaller: $\\sigma/\\sqrt n$. That explains the scale. If the sample size is multiplied by $4$, the typical error in the average is cut in half.</p>" +
      "<p>The deeper point is the shape. A single observation may be skewed, discrete, or bounded, but a sum of many independent observations is built by repeatedly averaging independent noise. After centering by $\\mu$ and scaling by $\\sigma/\\sqrt n$, the linear part of the distribution has been removed and the variance has been normalized to $1$. The terms beyond variance become less important as $n$ grows. What remains is the standard normal shape.</p>" +
      "<p>The practical reading is direct. For $n$ large enough and no single observation dominating the sum, probabilities about $\\bar X_n$ can be estimated with a normal $z$-score. If $\\mu=100$, $\\sigma=15$, and $n=36$, then $\\mathrm{sd}(\\bar X_n)=15/6=2.5$, so $\\bar X_n=105$ is two standard errors above the mean and $P(\\bar X_n>105)\\approx P(Z>2)=0.0228$.</p>",
    definition:
      "<p><b>The Central Limit Theorem</b> states the lesson's probability object or rule. $$\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\Rightarrow \\mathcal N(0,1)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$X_i$", desc: "are the original observations" },
      { sym: "$\\mu$", desc: "is their mean" },
      { sym: "$\\sigma$", desc: "is their standard deviation" },
      { sym: "$\\bar X_n$", desc: "is the sample average" },
      { sym: "$\\Rightarrow$", desc: "means convergence in distribution" },
      { sym: "$\\varphi_X(t)$", desc: "is the characteristic function" },
      { sym: "$t$", desc: "is a frequency argument" },
      { sym: "$o(s^2)$", desc: "means a remainder that is small compared with $s^2$" }
    ],
    derivation: [
      { do: "Define standardized variables $Y_i=(X_i-\\mu)/\\sigma$,", result: "each $Y_i$ has mean $0$ and variance $1$; this removes location and scale before taking a limit.", why: "this is the next justified step in the plan's derivation" },
      { do: "Rewrite the normalized average as $Z_n=\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}=\\frac{1}{\\sqrt n}\\sum_{i=1}^n Y_i$; this puts the whole problem into the form of a standardized sum.", result: "Rewrite the normalized average as $Z_n=\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}=\\frac{1}{\\sqrt n}\\sum_{i=1}^n Y_i$; this puts the whole problem into the form of a standardized sum.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use the characteristic function $\\varphi_X(t)=\\mathbb E[e^{itX}]$; for independent variables, the characteristic function of a sum is the product of the factors.", result: "Use the characteristic function $\\varphi_X(t)=\\mathbb E[e^{itX}]$; for independent variables, the characteristic function of a sum is the product of the factors.", why: "this is the next justified step in the plan's derivation" },
      { do: "Apply that product rule to $Z_n$", result: "$\\varphi_{Z_n}(t)=\\prod_{i=1}^n\\varphi_Y(t/\\sqrt n)=[\\varphi_Y(t/\\sqrt n)]^n$; the factor $t/\\sqrt n$ appears because each $Y_i$ is scaled by $1/\\sqrt n$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Expand one factor near $0$", result: "$\\varphi_Y(s)=1+s\\varphi_Y'(0)+\\frac{s^2}{2}\\varphi_Y''(0)+o(s^2)$; Taylor expansion captures the small argument $s=t/\\sqrt n$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Substitute the standardized moments", result: "$\\varphi_Y(0)=1$, $\\varphi_Y'(0)=i\\mathbb E[Y]=0$, and $\\varphi_Y''(0)=-\\mathbb E[Y^2]=-1$; mean $0$ removes the linear term and variance $1$ fixes the quadratic term.", why: "this is the next justified step in the plan's derivation" },
      { do: "Therefore $\\varphi_Y(s)=1-\\frac{s^2}{2}+o(s^2)$; all higher details are smaller than $s^2$ near zero.", result: "Therefore $\\varphi_Y(s)=1-\\frac{s^2}{2}+o(s^2)$; all higher details are smaller than $s^2$ near zero.", why: "this is the next justified step in the plan's derivation" },
      { do: "Put $s=t/\\sqrt n$", result: "$\\varphi_Y(t/\\sqrt n)=1-\\frac{t^2}{2n}+o(1/n)$; the error shrinks on the same scale as $1/n$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Raise to the $n$th power", result: "$\\varphi_{Z_n}(t)=\\left(1-\\frac{t^2}{2n}+o(1/n)\\right)^n$; this is the accumulated effect of $n$ small factors.", why: "this is the next justified step in the plan's derivation" },
      { do: "Use $(1+a/n)^n\\to e^a$ with $a=-t^2/2$", result: "$\\varphi_{Z_n}(t)\\to e^{-t^2/2}$; this is the limiting characteristic function.", why: "this is the next justified step in the plan's derivation" },
      { do: "Recognize $e^{-t^2/2}$ as the characteristic function of $\\mathcal N(0,1)$; since characteristic functions determine distributions, $Z_n\\Rightarrow\\mathcal N(0,1)$.", result: "Recognize $e^{-t^2/2}$ as the characteristic function of $\\mathcal N(0,1)$; since characteristic functions determine distributions, $Z_n\\Rightarrow\\mathcal N(0,1)$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Average score monitoring.", background: "Use this setting to read the lesson's probability idea.", numbers: "With $\\mu=100$, $\\sigma=15$, $n=36$, $P(\\bar X>105)=P(Z>2)=0.0228$." },
      { title: "A/B lift estimate.", background: "Use this setting to read the lesson's probability idea.", numbers: "If per-user lift has $\\sigma=20$ and $n=400$, the standard error is $20/20=1$, so a measured lift of $2.5$ is $z=2.5$ and has one-sided tail $0.0062$." },
      { title: "Polling proportion.", background: "Use this setting to read the lesson's probability idea.", numbers: "For $p=0.52$, $n=1600$, $\\mathrm{se}=\\sqrt{0.52\\cdot0.48/1600}=0.0125$, so $0.50$ is about $1.60$ standard errors below $0.52$." },
      { title: "Batch loss average.", background: "Use this setting to read the lesson's probability idea.", numbers: "If example losses have $\\sigma=3$ and batch size $64$, the average loss has standard error $3/8=0.375$." },
      { title: "Manufacturing fill weights.", background: "Use this setting to read the lesson's probability idea.", numbers: "With $\\mu=500$ g, $\\sigma=12$ g, $n=36$, the sample-mean standard error is $2$ g, so $\\bar X<496$ is about $P(Z<-2)=0.0228$." },
      { title: "Monte Carlo mean.", background: "Use this setting to read the lesson's probability idea.", numbers: "If simulated payoff variance is $25$, then $10{,}000$ draws give standard error $5/100=0.05$." }
    ]
  },
  "math-17-39": {
    connectionsProse:
      "<p>Hoeffding’s inequality is a concentration bound for averages of independent bounded variables. It uses more information than Chebyshev’s inequality, because boundedness limits how much any one observation can move the average. In return, it gives an exponential tail bound. This is useful for bounded losses, validation accuracy, click rates, and Monte Carlo estimates.</p>",
    motivation:
      "<p>When each observation is trapped inside a fixed interval, large deviations of the average require many observations to lean in the same direction. Independence makes that coordinated movement increasingly unlikely as n grows. Hoeffding’s inequality quantifies this decay.</p>" +
      "<p>The proof strategy uses exponential moments rather than only variance. Center the variables, bound each centered MGF using the range, multiply the bounds by independence, and apply Chernoff’s method. Optimizing the exponential bound gives a probability that shrinks like an exponential in n epsilon squared.</p>",
    definition:
      "<p><b>Hoeffding's inequality</b> states the lesson's probability object or rule. $$P(\\bar X-E\\bar X\\ge\\epsilon)\\le\\exp(-2n\\epsilon^2/(b-a)^2)$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$[a,b]$", desc: "bounded range" },
      { sym: "$\\epsilon$", desc: "deviation" },
      { sym: "$n$", desc: "sample size" }
    ],
    derivation: [
      { do: "Let independent $X_i\\in[a_i,b_i]$ and $\\bar X$ be their average.", result: "Let independent $X_i\\in[a_i,b_i]$ and $\\bar X$ be their average.", why: "this is the next justified step in the plan's derivation" },
      { do: "Center each variable", result: "its mean so the average deviation is a sum of bounded centered terms.", why: "this is the next justified step in the plan's derivation" },
      { do: "Hoeffding's lemma bounds the MGF of each centered term", result: "an exponential quadratic in its range.", why: "this is the next justified step in the plan's derivation" },
      { do: "Multiply MGFs using independence.", result: "Multiply MGFs using independence.", why: "this is the next justified step in the plan's derivation" },
      { do: "Apply Chernoff's method $P(S\\ge t)\\le e^{-\\lambda t}E[e^{\\lambda S}]$.", result: "Apply Chernoff's method $P(S\\ge t)\\le e^{-\\lambda t}E[e^{\\lambda S}]$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Optimize over $\\lambda$", result: "$P(\\bar X-E\\bar X\\ge\\epsilon)\\le\\exp(-2n\\epsilon^2/(b-a)^2)$ for common range $[a,b]$; double it for two-sided deviation.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "Coin average", background: "Use this setting to read the lesson's probability idea.", numbers: "$n=100$, $\\epsilon=0.1$ gives two-sided bound $0.2707$." },
      { title: "Ratings in [1,5]", background: "Use this setting to read the lesson's probability idea.", numbers: "range 4 changes denominator to 16." },
      { title: "Bounded loss [0,1]", background: "Use this setting to read the lesson's probability idea.", numbers: "with $n=1000$, $\\epsilon=0.05$ gives bound $0.0135$." },
      { title: "A/B click rate", background: "Use this setting to read the lesson's probability idea.", numbers: "uses bounded Bernoulli outcomes." },
      { title: "Monte Carlo bounded payoff", background: "Use this setting to read the lesson's probability idea.", numbers: "certifies sample error." },
      { title: "Validation accuracy", background: "Use this setting to read the lesson's probability idea.", numbers: "$n=10{,}000$, $\\epsilon=0.01$ bound is $2e^{-2}=0.2707$." }
    ]
  },
  "math-17-40": {
    connectionsProse:
      "<p>The multivariate Gaussian extends the normal distribution from one real-valued variable to a random vector. The mean becomes a vector, and variance becomes a covariance matrix. This matrix controls scale, correlation, and the directions of spread. The lesson connects Gaussian density, transformations, covariance, correlation, and Mahalanobis distance.</p>",
    motivation:
      "<p>A vector-valued measurement often has components that vary together. Modeling each coordinate separately loses information about correlation and joint spread. The multivariate Gaussian keeps that information through the covariance matrix.</p>" +
      "<p>The construction starts from independent standard normal coordinates and applies a linear transformation. The transformation shifts the center to the mean vector and reshapes the spherical standard normal into an ellipsoid determined by Sigma. The density must include both the quadratic Mahalanobis distance and the determinant factor that accounts for volume scaling.</p>",
    definition:
      "<p><b>The multivariate Gaussian</b> states the lesson's probability object or rule. $$f(x)=\\frac{1}{(2\\pi)^{d/2}|\\Sigma|^{1/2}}\\exp[-\\frac12(x-\\mu)^T\\Sigma^{-1}(x-\\mu)]$$</p>" +
      "<p><b>Assumptions that matter:</b> apply the support, partition, conditioning, independence, boundedness, finite-moment, or positive-scale conditions stated in the plan before using the displayed rule.</p>",
    symbols: [
      { sym: "$\\mu$", desc: "mean vector" },
      { sym: "$\\Sigma$", desc: "covariance matrix" },
      { sym: "$|\\Sigma|$", desc: "determinant" },
      { sym: "quadratic form is squared Mahalanobis distance", desc: "notation from the plan" }
    ],
    derivation: [
      { do: "Start with $Z\\sim\\mathcal N(0,I_d)$ having density $(2\\pi)^{-d/2}\\exp(-z^Tz/2)$.", result: "Start with $Z\\sim\\mathcal N(0,I_d)$ having density $(2\\pi)^{-d/2}\\exp(-z^Tz/2)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Build $X=\\mu+LZ$ where $LL^T=\\Sigma$.", result: "Build $X=\\mu+LZ$ where $LL^T=\\Sigma$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Solve $z=L^{-1}(x-\\mu)$,", result: "$z^Tz=(x-\\mu)^T\\Sigma^{-1}(x-\\mu)$.", why: "this is the next justified step in the plan's derivation" },
      { do: "The change of variables contributes $|\\det L|^{-1}=|\\Sigma|^{-1/2}$.", result: "The change of variables contributes $|\\det L|^{-1}=|\\Sigma|^{-1/2}$.", why: "this is the next justified step in the plan's derivation" },
      { do: "Therefore $f(x)=\\frac{1}{(2\\pi)^{d/2}|\\Sigma|^{1/2}}\\exp[-\\frac12(x-\\mu)^T\\Sigma^{-1}(x-\\mu)]$.", result: "Therefore $f(x)=\\frac{1}{(2\\pi)^{d/2}|\\Sigma|^{1/2}}\\exp[-\\frac12(x-\\mu)^T\\Sigma^{-1}(x-\\mu)]$.", why: "this is the next justified step in the plan's derivation" }
    ],
    applications: [
      { title: "2-D covariance", background: "Use this setting to read the lesson's probability idea.", numbers: "$\\begin{bmatrix}4&1\\1&9\\end{bmatrix}$ has determinant $35$." },
      { title: "At the mean", background: "Use this setting to read the lesson's probability idea.", numbers: ", density is $1/(2\\pi\\sqrt{35})=0.0269$." },
      { title: "For $x=(2,3),\\mu=0$", background: "Use this setting to read the lesson's probability idea.", numbers: ", quadratic form is $12/7=1.7143$." },
      { title: "Independent coordinates", background: "Use this setting to read the lesson's probability idea.", numbers: "make $\\Sigma$ diagonal." },
      { title: "Correlation", background: "Use this setting to read the lesson's probability idea.", numbers: "from covariance 1 and sds 2,3 is $1/6=0.1667$." },
      { title: "Mahalanobis radius", background: "Use this setting to read the lesson's probability idea.", numbers: "$r^2=5.99$ gives the common 95% ellipse in 2-D." }
    ]
  }
};
