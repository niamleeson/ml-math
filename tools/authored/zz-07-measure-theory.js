module.exports = {
  "math-07-01": {
    connectionsProse: "<p>This opening lesson connects familiar ideas about length, area, probability, and averages to the common structure that supports them. Earlier mathematics already treats intervals as having length and events as having probability; measure theory explains what these assignments have in common. The lesson sets up the triple $(X,\\mathcal F,\\mu)$, which will appear throughout the section. It also prepares the probability interpretation used later for expected loss and random variables.</p>",
    motivation: "<p>Length and probability are often first learned through examples: intervals have lengths, finite outcomes have probabilities, and averages add weighted values. Those examples work well until limits, infinitely many events, continuous outcomes, or functions with complicated value sets enter the picture. A common language is needed so the same rules continue to apply without rebuilding the theory each time.</p>" +
                "<p>Measure theory supplies that language. The set $X$ contains the points or outcomes, $\\mathcal F$ says which subsets are measurable, and $\\mu$ assigns size to those subsets. Probability is the special case where the total size is $1$, and expected loss is an integral with respect to that probability measure. This lesson is explain-only because its job is orientation: it names the structure that the rest of the section will make precise.</p>",
    definition: "<p>Measure theory studies a space of points or outcomes, a collection of measurable subsets, and a size assignment:</p>" +
                "<p>$$(X,\\mathcal F,\\mu)$$</p>" +
                "<p><b>Assumptions that matter:</b> $\\mathcal F$ is the event language of measurable subsets, $\\mu$ assigns size to those subsets, and probability is the special case with total mass $1$.</p>",
    symbols: [
      { sym: "$X$", desc: "the underlying set of outcomes or points" },
      { sym: "$\\mathcal F$", desc: "the collection of measurable subsets" },
      { sym: "$\\mu$", desc: "assigns size" },
      { sym: "$P$", desc: "the special case of a probability measure with total mass $1$" }
    ],
    applications: [
      { title: "Expected loss language", background: "Loss $L\\in\\{1,4,10\\}$ with probabilities $(0.2,0.5,0.3)$ gives an integral expression for average loss.", numbers: "$\\int L\\,dP=5.2$." },
      { title: "Continuous probability", background: "A uniform point on $[0,2]$ assigns probability by normalized length.", numbers: "$P([0.5,1.5])=(1.5-0.5)/2=0.5$." },
      { title: "Dataset slices", background: "An empirical measure on $1000$ rows gives mass to row events by counting proportions.", numbers: "A $73$-row event mass is $0.073$." },
      { title: "Null exceptions", background: "Changing a model on a probability-zero set does not affect an expected loss integral.", numbers: "The change in expected loss is $0$." },
      { title: "Risk constraints", background: "If bad outcomes have mass $0.04$, the indicator of that bad event has the same risk mass.", numbers: "An indicator-risk integral is $0.04$." },
      { title: "Limit arguments", background: "If event masses $0.3,0.03,0.003$ shrink geometrically, countable addition gives the total tail mass.", numbers: "The tail total is $0.333\\ldots$ by countable addition." }
    ]
  },
  "math-07-02": {
    connectionsProse: "<p>This lesson follows naturally from the need to say which sets are legitimate events. Once a set is observable, its complement should also be observable, and countable combinations of observable events should remain observable. Sigma-algebras give exactly that stable collection. This stability is what lets probability, integration, and limiting events use the same event language.</p>",
    motivation: "<p>Events are not useful if the collection of legal events falls apart under ordinary logical operations. If an event can be observed, then the event that it does not happen should also be observable. If events can be observed one after another, then the event that at least one of them happens should still be legal. Countable unions are included because many limiting events are built from infinitely many stages.</p>" +
                "<p>The complement and countable-union axioms are enough to recover countable intersections through De Morgan's law. This matters because intersections express persistent conditions such as all checks failing or every constraint holding. A sigma-algebra is therefore not just a list of allowed sets; it is a stable event language for probability and integration.</p>",
    definition: "<p>A sigma-algebra $\\mathcal F$ on $X$ is a collection of subsets that contains the whole space, is closed under complements, and is closed under countable unions.</p>" +
                "<p><b>Assumptions that matter:</b> The operations are taken inside the same whole space $X$, and countable closure is included so limiting events remain measurable.</p>",
    symbols: [
      { sym: "$X$", desc: "the whole space" },
      { sym: "$\\mathcal F$", desc: "the sigma-algebra" },
      { sym: "$A^c=X\\setminus A$", desc: "the complement" },
      { sym: "$\\bigcup$", desc: "combines events" },
      { sym: "$\\bigcap$", desc: "keeps points common to all events" }
    ],
    derivation: [
      { do: "Start with events $A_1,A_2,\\ldots\\in\\mathcal F$.", result: "$A_1,A_2,\\ldots\\in\\mathcal F$", why: "These are the sets whose intersection we want to use." },
      { do: "Take complements $A_n^c\\in\\mathcal F$ for every $n$.", result: "$A_n^c\\in\\mathcal F$", why: "This uses closure under complement." },
      { do: "Form the countable union $\\bigcup_{n=1}^\\infty A_n^c\\in\\mathcal F$.", result: "$\\bigcup_{n=1}^\\infty A_n^c\\in\\mathcal F$", why: "This uses closure under countable union." },
      { do: "Take its complement $\\left(\\bigcup_n A_n^c\\right)^c\\in\\mathcal F$.", result: "$(\\bigcup_n A_n^c)^c\\in\\mathcal F$", why: "This uses closure under complement again." },
      { do: "Apply De Morgan's law to get $\\bigcap_n A_n$.", result: "$\\bigcap_n A_n\\in\\mathcal F$", why: "This shows countable intersections are measurable too." }
    ],
    applications: [
      { title: "Coarse logging", background: "For $X=\\{1,2,3,4\\}$, a grouped sigma-algebra has a small number of legal events.", numbers: "$\\{\\varnothing,X,\\{1,2\\},\\{3,4\\}\\}$ has $4$ legal events." },
      { title: "Feature binning", background: "Bins $B_1,B_2,B_3$ generate events by unions of bins.", numbers: "They generate at most $2^3=8$ unions of bins." },
      { title: "Privacy views", background: "If only age groups are measurable, a single user's row is not isolated as its own event.", numbers: "A single user's row has mass hidden inside its group." },
      { title: "A/B tests", background: "If treatment event $T$ is measurable, the control event is available automatically.", numbers: "$T^c$ is automatically measurable." },
      { title: "Monitoring", background: "Events $A_n=$ \"latency exceeds threshold on day $n$\" can be combined across days.", numbers: "$\\bigcup_n A_n$ is a measurable ever-exceeded event." },
      { title: "Alert persistence", background: "Intersections express conditions that keep holding across checks.", numbers: "$\\bigcap_n A_n$ is measurable, so \"all checks failed\" is a legal event." }
    ]
  },
  "math-07-03": {
    connectionsProse: "<p>This lesson separates observability from size. A measurable space records the raw set and the collection of subsets that are allowed to be discussed as events, before any probability or length is assigned. That distinction is useful because the same underlying set can support different levels of information. Later lessons add measures and functions on top of this measurable structure.</p>",
    motivation: "<p>Before assigning probabilities or lengths, we must decide what can be observed. On a finite set, full observation may allow every subset; in a coarsened logging system, only groups of points may be visible. Both cases can have the same raw set $X$, but they support different measurable events.</p>" +
                "<p>A measurable space records this decision as the pair $(X,\\mathcal F)$. It has no numerical sizes yet, so there is no probability or integral at this stage. The point is to make the event structure explicit, because later a measure can only assign sizes to sets that are in $\\mathcal F$.</p>",
    definition: "<p>A measurable space is a set together with a sigma-algebra of subsets that are allowed to be measured:</p>" +
                "<p>$$(X,\\mathcal F)$$</p>" +
                "<p><b>Assumptions that matter:</b> $\\mathcal F$ must be a sigma-algebra on $X$; no numerical measure has been assigned yet.</p>",
    symbols: [
      { sym: "$(X,\\mathcal F)$", desc: "the measurable space" },
      { sym: "$X$", desc: "the raw set" },
      { sym: "$\\mathcal F$", desc: "a sigma-algebra" },
      { sym: "members of $\\mathcal F$", desc: "measurable sets" },
      { sym: "$\\mathcal P(X)$", desc: "the full power set" }
    ],
    applications: [
      { title: "Full observation", background: "If $X=\\{1,2,3\\}$ and $\\mathcal F=\\mathcal P(X)$, every subset is observable.", numbers: "All $2^3=8$ subsets are measurable." },
      { title: "Coarsened telemetry", background: "If $\\mathcal F=\\{\\varnothing,X,\\{1,2\\},\\{3\\}\\}$, observation is restricted to grouped events.", numbers: "Only $4$ subsets are measurable." },
      { title: "Label spaces", background: "A three-class label with full sigma-algebra allows every class event.", numbers: "It has $8$ possible label events." },
      { title: "Borel data", background: "Real-valued scores use $(\\mathbb R,\\mathcal B(\\mathbb R))$.", numbers: "Intervals like $(-\\infty,0.7]$ are measurable." },
      { title: "Product observations", background: "Two binary features with full observation create four raw pairs.", numbers: "They have $2^4=16$ measurable subsets of four pairs." },
      { title: "Random-variable target", background: "A score map is admissible only when value events pull back to legal events.", numbers: "Preimages of Borel score sets are in $\\mathcal F$." }
    ]
  },
  "math-07-04": {
    connectionsProse: "<p>This lesson adds numerical size to the measurable sets from the previous lessons. A measure can be length, area, counting size, probability, or a weighted data mass, depending on the context. The important common rule is countable additivity on disjoint pieces. From that rule come the everyday facts that larger sets have at least as much size and that non-overlapping pieces add.</p>",
    motivation: "<p>Once legal sets have been chosen, the next step is to assign them sizes. Counting measure counts elements, Lebesgue measure gives length or area, and probability measures assign masses that sum to one. These examples are different in interpretation, but they share nonnegativity and additivity over disjoint measurable pieces.</p>" +
                "<p>Countable additivity is the load-bearing rule. It says that if a set is assembled from non-overlapping measurable pieces, its size is the sum of their sizes. From that rule, monotonicity follows by splitting a larger set into a smaller set plus the leftover part. This is why measures behave consistently when sets are nested or decomposed.</p>",
    definition: "<p>A measure $\\mu$ assigns a nonnegative extended-real size to measurable sets and is countably additive on disjoint measurable pieces:</p>" +
                "<p>$$\\mu\\left(\\bigcup_{n=1}^\\infty A_n\\right)=\\sum_{n=1}^\\infty\\mu(A_n)$$</p>" +
                "<p><b>Assumptions that matter:</b> The sets $A_n$ are measurable and pairwise disjoint, and values may lie in $[0,\\infty]$.</p>",
    symbols: [
      { sym: "$\\mu$", desc: "the measure" },
      { sym: "$\\varnothing$", desc: "the empty set" },
      { sym: "$A_n$", desc: "disjoint measurable sets" },
      { sym: "$[0,\\infty]$", desc: "allows infinite size" }
    ],
    derivation: [
      { do: "Let $A\\subseteq B$ with both sets measurable.", result: "$A\\subseteq B$", why: "This sets up monotonicity." },
      { do: "Split $B$ as $A\\cup(B\\setminus A)$ disjointly.", result: "$B=A\\cup(B\\setminus A)$", why: "This separates the part already in $A$ from the rest." },
      { do: "Apply finite additivity from countable additivity.", result: "$\\mu(B)=\\mu(A)+\\mu(B\\setminus A)$", why: "Disjoint pieces add." },
      { do: "Use nonnegativity $\\mu(B\\setminus A)\\ge0$.", result: "$\\mu(B\\setminus A)\\ge0$", why: "Measures cannot subtract size." },
      { do: "Conclude $\\mu(A)\\le\\mu(B)$.", result: "$\\mu(A)\\le\\mu(B)$", why: "Larger measurable sets have at least as much measure." },
      { do: "If $\\mu(A)<\\infty$, rearrange.", result: "$\\mu(B\\setminus A)=\\mu(B)-\\mu(A)$", why: "This is the subtraction rule when the smaller size is finite." }
    ],
    applications: [
      { title: "Counting measure", background: "Counting measure assigns size by counting elements.", numbers: "$\\mu(\\{a,b,c\\})=3$." },
      { title: "Empirical distribution", background: "$200$ selected rows out of $1000$ define an empirical event.", numbers: "They have empirical mass $0.2$." },
      { title: "Probability model", background: "Disjoint events with masses $0.1,0.25,0.4$ add by measure additivity.", numbers: "Their union mass is $0.75$." },
      { title: "Weighted sampling", background: "Weights $2,5,3$ on three rows give a weighted measure.", numbers: "The total measure is $10$." },
      { title: "Geometric area", background: "Two disjoint rectangles of areas $6$ and $4$ add without overlap.", numbers: "Their union area is $10$." },
      { title: "Dirac measure", background: "$\\delta_x(A)=1$ if $x\\in A$ and $0$ otherwise.", numbers: "A set containing $x$ has size $1$." }
    ]
  },
  "math-07-05": {
    connectionsProse: "<p>This lesson explains how Lebesgue measure begins before measurability is imposed. Outer measure assigns a candidate size to every subset of the real line by covering it with intervals. This gives a universal upper estimate even for sets that may not behave well under cutting and recombining. The subadditivity derivation is the basic reason these outside estimates control unions.</p>",
    motivation: "<p>Some subsets of the real line are too irregular to handle by simply declaring their length directly. Outer measure starts from something concrete: cover the set by intervals and add the interval lengths. The best possible total cover length gives an outside estimate for the set's size.</p>" +
                "<p>This construction does not yet say that every set is measurable. Instead, it gives a size-like upper bound for every set and then identifies which sets interact correctly with cutting and recombining. Countable subadditivity is the essential first property: a union can be covered by covering each part, so the outside size of the union cannot exceed the sum of the outside sizes.</p>",
    definition: "<p>Lebesgue outer measure assigns every subset $E\\subseteq\\mathbb R$ the infimum of total interval lengths over countable interval covers:</p>" +
                "<p>$$m^*(E)=\\inf\\left\\{\\sum_n |I_n|:E\\subseteq\\bigcup_n I_n\\right\\}$$</p>" +
                "<p><b>Assumptions that matter:</b> The cover is countable, the $I_n$ are intervals, and outer measure is defined before restricting to measurable sets.</p>",
    symbols: [
      { sym: "$m^*$", desc: "outer measure" },
      { sym: "$E$", desc: "any subset of $\\mathbb R$" },
      { sym: "$I_n$", desc: "open intervals" },
      { sym: "$|I_n|$", desc: "interval length" },
      { sym: "$\\inf$", desc: "the greatest lower bound over all covers" }
    ],
    derivation: [
      { do: "For each set $E_j$ and each tolerance $\\varepsilon 2^{-j}$, choose interval covers $E_j\\subseteq\\bigcup_k I_{jk}$ with $\\sum_k |I_{jk}|\\le m^*(E_j)+\\varepsilon2^{-j}$.", result: "$E_j\\subseteq\\bigcup_k I_{jk}$ and $\\sum_k |I_{jk}|\\le m^*(E_j)+\\varepsilon2^{-j}$", why: "This uses the infimum definition with a small allowance." },
      { do: "Combine all chosen intervals.", result: "$\\bigcup_{j,k} I_{jk}$ covers $\\bigcup_j E_j$", why: "Their union covers $\\bigcup_j E_j$ because each $E_j$ is covered." },
      { do: "Compute the total length of the combined cover.", result: "$\\sum_j\\sum_k |I_{jk}|$", why: "This is the cost of that particular countable cover." },
      { do: "Bound it by substituting the near-optimal bounds.", result: "$\\sum_j m^*(E_j)+\\varepsilon\\sum_j2^{-j}$", why: "This substitutes the near-optimal bounds." },
      { do: "Use $\\sum_j2^{-j}=1$.", result: "cover cost at most $\\sum_jm^*(E_j)+\\varepsilon$", why: "The tolerance allowances add to $\\varepsilon$." },
      { do: "Take the infimum over all covers and let $\\varepsilon\\downarrow0$.", result: "$m^*(\\bigcup_jE_j)\\le\\sum_jm^*(E_j)$", why: "This gives countable subadditivity." }
    ],
    applications: [
      { title: "Union bounds", background: "Events with outer-size bounds $0.02,0.03,0.01$ have a union controlled by subadditivity.", numbers: "The union size is at most $0.06$." },
      { title: "Anomaly windows", background: "Intervals of lengths $0.1,0.05,0.02$ cover a suspicious score set.", numbers: "Its outer measure is at most $0.17$." },
      { title: "Sparse events", background: "Countably many points can be covered with intervals totaling any $\\varepsilon>0$.", numbers: "They have outer measure $0$." },
      { title: "Confidence sets", background: "Two covered regions of lengths $1.2$ and $0.8$ combine by adding cover lengths.", numbers: "They give a combined outer bound $2.0$." },
      { title: "Approximate geometry", background: "A fractal-like set covered by $4^n$ intervals of length $3^{-2n}$ has a shrinking cover bound.", numbers: "The bound is $(4/9)^n\\to0$." },
      { title: "Score thresholds", background: "If all bad scores lie in intervals totaling $0.04$, the outside estimate controls their size.", numbers: "Their Lebesgue outer measure is no more than $0.04$." }
    ]
  },
  "math-07-06": {
    connectionsProse: "<p>This lesson turns the outer-measure construction into the familiar length used on measurable subsets of the real line. Lebesgue measure agrees with interval length, treats endpoints as having no length, and supports countable additivity. It is the measure behind continuous probability densities and ordinary integration over real-valued data. The key point here is that changing finitely many points does not change length.</p>",
    motivation: "<p>Ordinary length should give $b-a$ for an interval from $a$ to $b$, and it should not care whether endpoints are included. Lebesgue measure preserves that intuition while extending length to a much richer collection of sets. This extension is what makes continuous probability and integration over real variables rigorous.</p>" +
                "<p>The reason endpoints do not matter is that a single point can be covered by intervals with arbitrarily small total length. Its measure is therefore zero. Once singletons have measure zero, adding or removing finitely many endpoints changes no interval length. This same idea later supports almost-everywhere equality and null edits to functions.</p>",
    definition: "<p>Lebesgue measure $m$ is the countably additive measure on Lebesgue measurable subsets of $\\mathbb R$ that agrees with interval length:</p>" +
                "<p>$$m([a,b])=b-a$$</p>" +
                "<p><b>Assumptions that matter:</b> The set must be Lebesgue measurable, and endpoints or finitely many points have measure zero.</p>",
    symbols: [
      { sym: "$m$", desc: "Lebesgue measure" },
      { sym: "$m^*$", desc: "outer measure" },
      { sym: "$[a,b]$ and $(a,b)$", desc: "intervals" },
      { sym: "$b-a$", desc: "their length" },
      { sym: "almost everywhere", desc: "except on a set of measure zero" }
    ],
    derivation: [
      { do: "Cover the singleton $\\{a\\}$ by the open interval $(a-\\varepsilon/2,a+\\varepsilon/2)$.", result: "length $\\varepsilon$", why: "This interval has length $\\varepsilon$." },
      { do: "Since the cover cost can be made as small as any $\\varepsilon>0$, use nonnegativity.", result: "$m^*(\\{a\\})=0$", why: "Outer measure is nonnegative, so the only possible value is $0$." },
      { do: "Use that Lebesgue measure agrees with outer measure on measurable singletons.", result: "$m(\\{a\\})=0$", why: "Singletons are Lebesgue measurable." },
      { do: "Write $[a,b]=(a,b)\\cup\\{a\\}\\cup\\{b\\}$ disjointly.", result: "$[a,b]=(a,b)\\cup\\{a\\}\\cup\\{b\\}$", why: "This separates the open interval from endpoints." },
      { do: "Add the measures.", result: "$m([a,b])=m((a,b))+0+0=b-a$", why: "Endpoints add no length." }
    ],
    applications: [
      { title: "Uniform probability", background: "On $[0,2]$, uniform probability is normalized Lebesgue length.", numbers: "$P([0.5,1.5])=m([0.5,1.5])/2=0.5$." },
      { title: "Continuous features", background: "Under any bounded density, a singleton score has zero Lebesgue length.", numbers: "$P(X=0.7)=0$." },
      { title: "Image masks", background: "A normalized rectangle $[0,0.2]\\times[0,0.5]$ has area from side lengths.", numbers: "Its area is $0.1$." },
      { title: "Histograms", background: "Five bins of width $0.2$ cover $[0,1]$.", numbers: "Their total length is $1$." },
      { title: "Translation invariance", background: "Shifting $[1,4]$ to $[6,9]$ preserves Lebesgue length.", numbers: "The length stays $3$." },
      { title: "Null edits", background: "Changing a predictor at one real-valued score changes only a measure-zero set.", numbers: "The change in a Lebesgue integral is $0$." }
    ]
  },
  "math-07-07": {
    connectionsProse: "<p>This lesson connects measurable sets with functions. In probability, a random variable is useful only when statements about its values correspond to events whose probabilities can be assigned. Measurable functions guarantee this by requiring preimages of observable value-sets to be measurable. That condition is also what makes losses, indicators, and model scores compatible with integration.</p>",
    motivation: "<p>A function on a measure space becomes useful for probability or integration only when value-based statements are measurable. For a score $s$, the statement $s\\le0.7$ must correspond to an event in the original space. For a loss $L$, the regions where the loss falls in a given range must be measurable before an expected loss can be defined.</p>" +
                "<p>Measurability is exactly this preimage condition. It looks backward from value sets to the original space and requires those preimages to be legal events. Indicators show the simplest case: the indicator of a set is measurable precisely when the set itself is measurable. Composition then shows that measurable pipelines remain measurable.</p>",
    definition: "<p>A function $f:(X,\\mathcal F)\\to(Y,\\mathcal G)$ is measurable when every measurable value-set pulls back to a measurable event:</p>" +
                "<p>$$B\\in\\mathcal G\\quad\\Rightarrow\\quad f^{-1}(B)\\in\\mathcal F$$</p>" +
                "<p><b>Assumptions that matter:</b> The domain and codomain are measurable spaces, and for real-valued functions the value sigma-algebra is usually $\\mathcal B(\\mathbb R)$.</p>",
    symbols: [
      { sym: "$f:(X,\\mathcal F)\\to(Y,\\mathcal G)$", desc: "a function between measurable spaces" },
      { sym: "$f^{-1}(B)$", desc: "the preimage of $B$" },
      { sym: "$\\mathcal B(\\mathbb R)$", desc: "the Borel sigma-algebra" },
      { sym: "$1_A$", desc: "an indicator" }
    ],
    derivation: [
      { do: "Let $1_A:X\\to\\{0,1\\}$ be the indicator of $A$.", result: "$1_A:X\\to\\{0,1\\}$", why: "This function records whether $x$ is in $A$." },
      { do: "Compute the preimage of $\\{1\\}$.", result: "$1_A^{-1}(\\{1\\})=A$", why: "A value-set is measurable precisely when the event is measurable." },
      { do: "Compute the preimage of $\\{0\\}$.", result: "$1_A^{-1}(\\{0\\})=A^c$", why: "Sigma-algebras include complements." },
      { do: "Conclude the indicator criterion.", result: "$1_A$ is measurable exactly when $A\\in\\mathcal F$", why: "Indicator measurability matches event measurability." },
      { do: "If $f:X\\to Y$ and $g:Y\\to Z$ are measurable, compute a composed preimage.", result: "$(g\\circ f)^{-1}(C)=f^{-1}(g^{-1}(C))$", why: "This is the preimage rule for composition." },
      { do: "Use measurability of $g$ and then $f$.", result: "$g\\circ f$ is measurable", why: "Since $g^{-1}(C)$ is measurable in $Y$ and $f$ pulls measurable sets back to $X$, $g\\circ f$ is measurable." }
    ],
    applications: [
      { title: "Random variables", background: "If $X$ is measurable, value thresholds pull back to events.", numbers: "$\\{X\\le0.7\\}$ is an event whose probability can be computed." },
      { title: "Loss functions", background: "If $L$ is measurable, the loss is compatible with integration.", numbers: "Expected loss $\\int L\\,dP$ is defined." },
      { title: "Classifiers", background: "A threshold classifier is an indicator of a measurable score event.", numbers: "$1_{\\{s\\ge0.8\\}}$ is measurable when the score $s$ is measurable." },
      { title: "Feature thresholds", background: "If a score threshold has probability $0.18$, that probability belongs to the preimage event.", numbers: "$P(s\\le0.3)=0.18$." },
      { title: "Calibration curves", background: "Calibration bins are score preimages of value intervals.", numbers: "Bins like $s^{-1}([0.6,0.7])$ are measurable score events." },
      { title: "Pipelines", background: "If a feature map and a model score are measurable, applying them in sequence preserves measurability.", numbers: "Their composition is measurable." }
    ]
  },
  "math-07-08": {
    connectionsProse: "<p>This lesson builds the integral that the rest of the probability track uses. The previous lessons supplied measurable sets, measures, and measurable functions; the Lebesgue integral combines them by adding function values over measured regions. It starts from simple functions because their value regions are clear and disjoint. From there, nonnegative and signed functions are handled by approximation and decomposition.</p>",
    motivation: "<p>The Riemann integral often imagines slicing the input axis into intervals. The Lebesgue integral instead begins with the values a function takes and the measurable regions where it takes them. For a simple function, each value-region contributes height times measure, exactly like a rectangle but with measurable sets in place of ordinary intervals.</p>" +
                "<p>General nonnegative functions are handled by approximating from below with simple functions. Taking the supremum over all such lower approximations captures the full area without depending on a particular partition. Signed functions are then split into positive and negative parts, with the usual warning that $\\infty-\\infty$ is not defined. This construction is why expectations, densities, indicators, and limits share one integral.</p>",
    definition: "<p>For a nonnegative simple function $s=\\sum_{k=1}^n a_k1_{A_k}$ on disjoint measurable sets, the Lebesgue integral is</p>" +
                "<p>$$\\int s\\,d\\mu=\\sum_{k=1}^n a_k\\mu(A_k)$$</p>" +
                "<p><b>Assumptions that matter:</b> The value-regions $A_k$ are measurable and disjoint; nonnegative functions use suprema of simple lower approximations, and signed functions use positive and negative parts when the result is not $\\infty-\\infty$.</p>",
    symbols: [
      { sym: "$s$", desc: "a simple function" },
      { sym: "$a_k$", desc: "its values" },
      { sym: "$A_k$", desc: "measurable value-regions" },
      { sym: "$1_{A_k}$", desc: "an indicator" },
      { sym: "$\\mu(A_k)$", desc: "the size of a value-region" },
      { sym: "$f^+$ and $f^-$", desc: "positive and negative parts" }
    ],
    derivation: [
      { do: "Start with a nonnegative simple function $s=\\sum_{k=1}^n a_k1_{A_k}$ on disjoint measurable sets $A_k$.", result: "$s=\\sum_{k=1}^n a_k1_{A_k}$", why: "This means $s$ has value $a_k$ on $A_k$." },
      { do: "The contribution from $A_k$ is height times size.", result: "$a_k\\mu(A_k)$", why: "This is the rectangle rule generalized to measurable sets." },
      { do: "Add the disjoint contributions.", result: "$\\int s\\,d\\mu=\\sum_{k=1}^n a_k\\mu(A_k)$", why: "Disjoint value-regions do not overlap." },
      { do: "For a nonnegative measurable $f$, choose simple functions $0\\le s\\le f$.", result: "$0\\le s\\le f$", why: "They approximate $f$ from below." },
      { do: "Take the supremum of their integrals.", result: "$\\int f\\,d\\mu=\\sup_{0\\le s\\le f}\\int s\\,d\\mu$", why: "This captures all lower approximations." },
      { do: "For signed $f$, write $f=f^+-f^-$.", result: "$\\int f\\,d\\mu=\\int f^+\\,d\\mu-\\int f^-\\,d\\mu$", why: "This is defined when it is not the undefined form $\\infty-\\infty$." }
    ],
    applications: [
      { title: "Expected loss", background: "$L\\in\\{1,4,10\\}$ with probabilities $(0.2,0.5,0.3)$ gives a simple-function integral.", numbers: "$\\int L\\,dP=5.2$." },
      { title: "Empirical risk", background: "Four losses $(1,0.5,2,1.5)$ under equal mass form an empirical integral.", numbers: "They give $1.25$." },
      { title: "Density integration", background: "The density $f(x)=3x^2$ on $[0,1]$ has total probability mass.", numbers: "It integrates to $1$." },
      { title: "Weighted metric", background: "A score equal to $2$ on mass $0.3$ and $5$ on mass $0.7$ adds height times mass.", numbers: "Its integral is $4.1$." },
      { title: "Image intensity", background: "Intensity $0.2$ on area $0.25$ and $0.8$ on area $0.75$ gives a weighted area total.", numbers: "The total is $0.65$." },
      { title: "Regularization moment", background: "Under probabilities $(0.2,0.5,0.3)$, $\\int |X|\\,dP$ for values $(1,-2,3)$ averages absolute values.", numbers: "It is $2.1$." }
    ]
  },
  "math-07-09": {
    connectionsProse: "<p>This lesson gives the first major rule for passing from approximations to a limiting integral. Many useful functions are built as increasing limits of simpler ones, such as growing truncations, expanding events, or refined lower approximations. Monotone convergence says that when the approximations only increase, the integrals increase to the integral of the limit. That makes approximation a reliable way to define and compute integrals.</p>",
    motivation: "<p>Many measurable functions are reached through increasing approximations. A truncated loss grows as the truncation level rises, an expanding union of events grows as more events are included, and lower step functions improve as a partition is refined. In each case, previously counted mass is never removed.</p>" +
                "<p>Monotone convergence says that this one-sided growth is enough to make integrals converge to the integral of the pointwise limit. The proof idea is that every simple block lying below the limit is eventually almost captured by the increasing sequence. Because the integral of the limit is defined through simple lower approximations, capturing all such blocks forces equality.</p>",
    definition: "<p>The monotone convergence theorem says that for nonnegative measurable functions increasing pointwise to $f$, the integrals increase to the integral of the limit:</p>" +
                "<p>$$0\\le f_1\\le f_2\\le\\cdots,\\ f_n\\uparrow f\\quad\\Rightarrow\\quad \\lim_n\\int f_n\\,d\\mu=\\int f\\,d\\mu$$</p>" +
                "<p><b>Assumptions that matter:</b> The functions are nonnegative and measurable, and convergence is pointwise increasing.</p>",
    symbols: [
      { sym: "$f_n\\uparrow f$", desc: "increasing pointwise convergence" },
      { sym: "$\\lim_n\\int f_n$", desc: "may be infinite" },
      { sym: "$s$", desc: "a simple lower approximation" },
      { sym: "$c$", desc: "a scaling factor below $1$" }
    ],
    derivation: [
      { do: "Assume $0\\le f_1\\le f_2\\le\\cdots$ and $f_n\\uparrow f$ pointwise.", result: "$0\\le f_1\\le f_2\\le\\cdots$ and $f_n\\uparrow f$", why: "This means every point's value climbs to its limit." },
      { do: "Since $f_n\\le f$, apply monotonicity of the integral.", result: "$\\int f_n\\,d\\mu\\le\\int f\\,d\\mu$", why: "The limit of the integrals cannot exceed the target integral." },
      { do: "Let $s$ be any simple function with $0\\le s\\le f$.", result: "$0\\le s\\le f$", why: "This tests whether the increasing approximations reach every lower simple block." },
      { do: "For $0<c<1$, consider the sets where $f_n\\ge cs$.", result: "the sets where $f_n\\ge cs$ increase to the support of $s$", why: "Pointwise convergence makes each positive block eventually covered." },
      { do: "Use countable additivity to compare integrals.", result: "$\\int f_n\\,d\\mu$ is eventually at least nearly $c\\int s\\,d\\mu$", why: "The increasing functions capture nearly all of the simple lower area." },
      { do: "Let $c\\uparrow1$ and take the supremum over simple $s\\le f$.", result: "$\\lim_n\\int f_n\\,d\\mu\\ge\\int f\\,d\\mu$", why: "This completes equality." }
    ],
    applications: [
      { title: "Truncated expected loss", background: "$L_n=\\min(L,n)$ increases to $L$, so stabilized integrals reveal the expected loss.", numbers: "If integrals are $1.8,2.4,2.7$, the expected loss limit is $2.7$ when the sequence stabilizes." },
      { title: "Histogram refinement", background: "Lower step approximations can only rise as they improve.", numbers: "$0.5,0.75,0.875$ climb toward area $1$." },
      { title: "Counting infinite events", background: "Indicators of expanding finite unions increase to the full countable union.", numbers: "$1_{\\cup_{i=1}^nA_i}\\uparrow1_{\\cup_iA_i}$, so probabilities converge upward." },
      { title: "Series as integrals", background: "Partial sums of nonnegative terms form an increasing sequence.", numbers: "$0.5+0.25+0.125$ increase to $1$." },
      { title: "Reliability over time", background: "Events \"failure by day $n$\" grow as the time horizon grows.", numbers: "Masses $0.1,0.18,0.25$ increase toward eventual failure probability." },
      { title: "Data filters", background: "Expanding eligible sets add more measured data and never remove previous mass.", numbers: "Masses $0.4,0.6,0.7$ give integrals that increase with the set." }
    ]
  },
  "math-07-10": {
    connectionsProse: "<p>This lesson introduces a limit theorem that works even when a sequence is not monotone. Fatou's lemma looks at the eventual lower value of a nonnegative sequence and compares its integral with the eventual lower behavior of the integrals. It is weaker than equality, but it is very robust. This makes it a basic tool for proving convergence results and protecting lower bounds.</p>",
    motivation: "<p>Sequences of functions often do not increase neatly. They may oscillate, have moving spikes, or settle only in an eventual lower sense. Fatou's lemma handles this rougher situation by focusing on the liminf, the value that remains after ignoring early behavior and looking at the lower envelope of the tails.</p>" +
                "<p>The lemma does not promise equality. It gives a safe inequality for nonnegative functions: the integral of the eventual lower pointwise value is no larger than the eventual lower integral. The proof turns the tail infima into an increasing sequence and then applies monotone convergence. This is why Fatou's lemma is a bridge from MCT to more flexible convergence theorems.</p>",
    definition: "<p>Fatou's lemma gives a lower-bound inequality for nonnegative measurable functions:</p>" +
                "<p>$$\\int\\liminf_{n\\to\\infty} f_n\\,d\\mu\\le\\liminf_{n\\to\\infty}\\int f_n\\,d\\mu$$</p>" +
                "<p><b>Assumptions that matter:</b> The functions $f_n$ are nonnegative and measurable; no monotone convergence of the original sequence is required.</p>",
    symbols: [
      { sym: "$\\liminf f_n$", desc: "the eventual lower pointwise value" },
      { sym: "$g_k$", desc: "the tail infimum" },
      { sym: "nonnegative measurable functions", desc: "the functions to which Fatou applies" },
      { sym: "$\\le$", desc: "the inequality direction that makes Fatou a lower-bound theorem" }
    ],
    derivation: [
      { do: "Define $g_k(x)=\\inf_{n\\ge k} f_n(x)$.", result: "$g_k(x)=\\inf_{n\\ge k} f_n(x)$", why: "This is the lower envelope of the tail starting at $k$." },
      { do: "Observe $g_k\\le g_{k+1}$.", result: "$g_k\\le g_{k+1}$", why: "Dropping the first term from a tail can only raise its infimum." },
      { do: "Identify the increasing limit of $g_k$.", result: "$g_k\\uparrow\\liminf_{n\\to\\infty}f_n$", why: "This is the definition of pointwise liminf." },
      { do: "Apply MCT.", result: "$\\int\\liminf f_n\\,d\\mu=\\lim_k\\int g_k\\,d\\mu$", why: "The lower envelopes increase." },
      { do: "Since $g_k\\le f_n$ for every $n\\ge k$, compare integrals.", result: "$\\int g_k\\,d\\mu\\le\\inf_{n\\ge k}\\int f_n\\,d\\mu$", why: "Integrals preserve order." },
      { do: "Let $k\\to\\infty$.", result: "$\\int\\liminf f_n\\,d\\mu\\le\\liminf_n\\int f_n\\,d\\mu$", why: "This is Fatou's inequality." }
    ],
    applications: [
      { title: "Lower-bound risk", background: "If eventual pointwise losses have an integral, Fatou prevents limiting training risks from falling below it.", numbers: "If eventual pointwise losses have integral $1.7$, then liminf training risks cannot be below $1.7$." },
      { title: "Escaping spikes", background: "Functions $f_n=n1_{[0,1/n]}$ keep mass while moving into thinner intervals.", numbers: "They have integrals $1$ but pointwise liminf $0$, so Fatou gives $0\\le1$." },
      { title: "Eventual events", background: "Indicators turn Fatou's lemma into a probability inequality for eventual occurrence.", numbers: "$P(\\liminf A_n)\\le\\liminf P(A_n)$." },
      { title: "Optimization limits", background: "If validation losses have liminf integrals, a candidate limit is controlled by the lower-bound direction.", numbers: "The liminf integrals are $0.42$." },
      { title: "Risk certificates", background: "Lower envelopes with increasing areas protect mass in the limit.", numbers: "Areas $0.3,0.35,0.37$ yield at least $0.37$ in the limit." },
      { title: "Series envelopes", background: "Tail infimum functions protect against undercounting nonnegative mass.", numbers: "Tail infimum functions protect against undercounting nonnegative mass." }
    ]
  },
  "math-07-11": {
    connectionsProse: "<p>This lesson gives one of the most useful conditions for exchanging limits and integrals. Pointwise convergence alone can miss moving spikes of mass, so a shared integrable bound is needed. Dominated convergence supplies that bound and turns pointwise convergence into convergence of integrals. It is the formal justification behind many limits of expected losses, gradients, and numerical approximations.</p>",
    motivation: "<p>A pointwise limit can be misleading for integrals if mass escapes into thinner and taller spikes. The functions may converge to zero at every fixed point while their integrals stay away from zero. To rule out this behavior, all functions in the sequence need to be controlled by one integrable envelope.</p>" +
                "<p>Dominated convergence uses that envelope to make limits and integrals commute. The dominating function keeps positive and negative parts uniformly integrable, while Fatou's lemma supplies the two inequalities that trap the limiting integral. In applications, the domination condition often appears as bounded losses, bounded gradients, or an integrable tail bound.</p>",
    definition: "<p>The dominated convergence theorem says that pointwise convergence plus one integrable dominating function lets limits pass through integrals:</p>" +
                "<p>$$f_n\\to f\\ \\text{a.e.},\\ |f_n|\\le g,\\ \\int |g|\\,d\\mu<\\infty\\quad\\Rightarrow\\quad \\int f_n\\,d\\mu\\to\\int f\\,d\\mu$$</p>" +
                "<p><b>Assumptions that matter:</b> The functions are measurable, convergence holds almost everywhere, and the same integrable $g$ dominates every $|f_n|$.</p>",
    symbols: [
      { sym: "$g$", desc: "the dominating integrable function" },
      { sym: "almost everywhere", desc: "outside a measure-zero set" },
      { sym: "$\\liminf$ and $\\limsup$", desc: "bracket possible integral limits" },
      { sym: "integrable", desc: "means $\\int |g|\\,d\\mu<\\infty$" }
    ],
    derivation: [
      { do: "Assume $f_n\\to f$ almost everywhere and $|f_n|\\le g$ with $g$ integrable.", result: "$f_n\\to f$ a.e. and $|f_n|\\le g$", why: "This gives pointwise convergence plus a shared integrable ceiling." },
      { do: "Pass the bound to the limit.", result: "$|f|\\le g$ almost everywhere", why: "Pointwise limits preserve the bound outside a null set." },
      { do: "Apply Fatou's lemma to the nonnegative functions $g+f_n$.", result: "$g+f_n\\ge0$", why: "They are nonnegative because $f_n\\ge-g$." },
      { do: "Use Fatou's inequality.", result: "$\\int(g+f)\\,d\\mu\\le\\liminf_n\\int(g+f_n)\\,d\\mu$", why: "This is the lower inequality." },
      { do: "Cancel $\\int g\\,d\\mu<\\infty$.", result: "$\\int f\\,d\\mu\\le\\liminf_n\\int f_n\\,d\\mu$", why: "The dominating integral is finite." },
      { do: "Apply the same argument to $g-f_n$.", result: "$\\limsup_n\\int f_n\\,d\\mu\\le\\int f\\,d\\mu$", why: "This is equivalent to the liminf inequality for negatives." },
      { do: "Combine liminf and limsup inequalities.", result: "$\\int f_n\\,d\\mu\\to\\int f\\,d\\mu$", why: "The possible integral limits are trapped at the same value." }
    ],
    applications: [
      { title: "Model limits", background: "If losses $f_n\\to f$ and all are bounded by $10$, dominated convergence applies on a probability space.", numbers: "Validation risk limits pass through expectation on a probability space." },
      { title: "Bounded payoffs", background: "Monte Carlo payoffs in $[-2,2]$ share a constant dominating function.", numbers: "$g=2$ has integral $2$." },
      { title: "Truncated tails", background: "$f_n=x1_{x\\le n}$ under density $e^{-x}$ is dominated by $x$.", numbers: "The integral of $x$ under that density is $1$." },
      { title: "Quadrature refinement", background: "Bounded integrands under a constant envelope allow grid limits to match the integral.", numbers: "$g=1$." },
      { title: "Expected gradients", background: "If coordinate gradients satisfy $|G_n|\\le5$ and converge, their expectations converge too.", numbers: "The common bound is $5$." },
      { title: "Spike warning", background: "$f_n=n1_{[0,1/n]}$ has pointwise limit $0$ but no integrable shared bound.", numbers: "Its integral is $1$, so DCT does not apply." }
    ]
  },
  "math-07-12": {
    connectionsProse: "<p>This lesson organizes measurable functions by average size. The $L^p$ norm uses the Lebesgue integral to measure magnitude after taking powers, which makes it suitable for errors, signals, moments, and energies. The earlier integral machinery ensures these quantities are defined on general measure spaces, not only finite vectors. The scaling derivation shows why the formula behaves like a norm.</p>",
    motivation: "<p>After defining integration, it becomes possible to measure the size of functions themselves. The $L^1$ norm measures average absolute magnitude, $L^2$ measures energy or root-mean-square size on a probability space, and higher $p$ values penalize large deviations more strongly. These are function-space versions of familiar vector norms.</p>" +
                "<p>The formula first removes signs, raises magnitudes to the $p$th power, integrates, and then takes the $p$th root. The root restores the original units of the function. Scaling behaves as expected because constants factor out of the integral as $|c|^p$ before the root is taken. The triangle inequality is deeper, but the derivation here shows why the expression has the right homogeneity.</p>",
    definition: "<p>For $p\\ge1$, the $L^p$ norm of a measurable function is</p>" +
                "<p>$$\\lVert f\\rVert_p=\\left(\\int |f|^p\\,d\\mu\\right)^{1/p}$$</p>" +
                "<p><b>Assumptions that matter:</b> Functions are identified up to almost-everywhere equality, and $f$ belongs to $L^p(X,\\mu)$ when this norm is finite.</p>",
    symbols: [
      { sym: "$L^p(X,\\mu)$", desc: "the space of measurable functions with finite $p$-norm" },
      { sym: "$p\\ge1$", desc: "the exponent range for norms" },
      { sym: "almost-everywhere equality", desc: "the equality used for functions in $L^p$" },
      { sym: "$\\lVert f\\rVert_p$", desc: "the norm" },
      { sym: "$L^2$", desc: "has inner product $\\int fh\\,d\\mu$" }
    ],
    derivation: [
      { do: "Start with a measurable function $f$ and remove signs with $|f|$.", result: "$|f|$", why: "To measure its magnitude, signs should not cancel." },
      { do: "Raise to the $p$th power.", result: "$|f|^p$", why: "This emphasizes large values according to $p$." },
      { do: "Integrate the powered magnitude.", result: "$\\int |f|^p\\,d\\mu$", why: "This averages the powered magnitude over the measure space." },
      { do: "Take the $p$th root.", result: "$\\lVert f\\rVert_p=(\\int|f|^p\\,d\\mu)^{1/p}$", why: "This returns the units to those of $f$." },
      { do: "For scaling, compute the norm of $cf$.", result: "$\\lVert cf\\rVert_p=(\\int |c|^p|f|^p\\,d\\mu)^{1/p}$", why: "Constants factor out of the integral." },
      { do: "Take the root.", result: "$\\lVert cf\\rVert_p=|c|\\lVert f\\rVert_p$", why: "This is one norm axiom; Minkowski supplies the triangle inequality for $p\\ge1$." }
    ],
    applications: [
      { title: "Mean absolute error", background: "Values $(1,2,3)$ with probabilities $(0.2,0.5,0.3)$ give an $L^1$ size.", numbers: "$\\lVert X\\rVert_1=2.1$." },
      { title: "RMS error", background: "The same values give an $L^2$ size through the square moment.", numbers: "$\\lVert X\\rVert_2=\\sqrt{4.9}=2.214$." },
      { title: "Fourth-moment penalty", background: "The $L^4$ norm penalizes the larger value more strongly.", numbers: "$\\lVert X\\rVert_4=(0.2+8+24.3)^{1/4}=2.388$." },
      { title: "Signal energy", background: "Values $1,-1$ on equal halves have constant squared magnitude.", numbers: "The $L^2$ norm is $1$." },
      { title: "Image difference", background: "Error $0.2$ on area $0.25$ and $0.8$ on area $0.75$ gives a spatial $L^2$ norm.", numbers: "The $L^2$ norm is $\\sqrt{0.49}=0.7$." },
      { title: "Moment control", background: "On a probability space, an $L^2$ norm controls the second moment.", numbers: "If $\\lVert X\\rVert_2=3$, then $\\mathbb E[X^2]=9$." }
    ]
  },
  "math-07-13": {
    connectionsProse: "<p>This lesson extends measure from one space to pairs of spaces. Product measure is the measure-theoretic version of rectangle area and independent joint probability. It lets a size on $X$ and a size on $Y$ combine into a size on pairs $(x,y)$. This construction is the foundation for joint distributions, grids, images, and data-by-time spaces.</p>",
    motivation: "<p>Many problems involve pairs: two random variables, an image coordinate, a data point and a time step, or a parameter and a simulation seed. If each coordinate has its own measure, the product space needs a measure on pairs. Rectangles are the basic sets where the answer is forced: size should be the product of the coordinate sizes.</p>" +
                "<p>Product measure extends this rectangle rule to the sigma-algebra generated by measurable rectangles. For probability spaces, the same construction expresses independence when rectangle probabilities multiply. Sigma-finiteness is the regularity condition that makes this extension unique and well behaved. Once product measure exists, joint distributions and iterated integrals have a rigorous base.</p>",
    definition: "<p>The product measure $\\mu\\times\\nu$ is the measure on the product sigma-algebra that agrees with the rectangle rule:</p>" +
                "<p>$$(\\mu\\times\\nu)(A\\times B)=\\mu(A)\\nu(B)$$</p>" +
                "<p><b>Assumptions that matter:</b> The rectangles are measurable, the product sigma-algebra is $\\mathcal A\\otimes\\mathcal B$, and sigma-finiteness gives a unique well-behaved extension.</p>",
    symbols: [
      { sym: "$(X,\\mathcal A,\\mu)$ and $(Y,\\mathcal B,\\nu)$", desc: "measure spaces" },
      { sym: "$\\mathcal A\\otimes\\mathcal B$", desc: "the product sigma-algebra" },
      { sym: "$\\mu\\times\\nu$", desc: "the product measure" },
      { sym: "$A\\times B$", desc: "a rectangle of pairs" }
    ],
    derivation: [
      { do: "Start with measurable rectangles $A\\times B$.", result: "$A\\times B$", why: "These are the basic observable sets in a product space." },
      { do: "Define the product measure on rectangles.", result: "$(\\mu\\times\\nu)(A\\times B)=\\mu(A)\\nu(B)$", why: "This matches ordinary rectangle area." },
      { do: "Generate $\\mathcal A\\otimes\\mathcal B$ from countable operations on rectangles.", result: "$\\mathcal A\\otimes\\mathcal B$", why: "This creates all product measurable sets." },
      { do: "For disjoint finite rectangles $R_i=A_i\\times B_i$, add their product measures.", result: "$\\sum_i(\\mu\\times\\nu)(R_i)$", why: "Countable additivity extends the rectangle rule." },
      { do: "For independent probability spaces, apply the rectangle rule to the joint law.", result: "$P_{X,Y}(A\\times B)=P_X(A)P_Y(B)$", why: "This is independence expressed as product measure." },
      { do: "Use sigma-finiteness.", result: "a unique product measure", why: "Sigma-finiteness ensures this rectangle rule determines a unique product measure and prevents ambiguous extensions." }
    ],
    applications: [
      { title: "Joint feature grids", background: "$P(X\\in A)=0.4$ and $P(Y\\in B)=0.25$ under independence multiply on rectangles.", numbers: "$P(A\\times B)=0.1$." },
      { title: "Image area", background: "A rectangle with width $0.2$ and height $0.5$ has product area.", numbers: "Its product measure is $0.1$." },
      { title: "Independent choices", background: "Two fair coins have independent coordinate masses for HH.", numbers: "$0.5\\cdot0.5=0.25$." },
      { title: "Batch-time axes", background: "$100$ examples and $20$ time steps form a counting product space.", numbers: "The counting product size is $2000$." },
      { title: "Simulation design", background: "A $5\\times4$ parameter grid combines two finite axes.", numbers: "It has $20$ product cells." },
      { title: "Continuous-discrete mixture", background: "Interval length $0.3$ and class probability $0.2$ multiply in a mixed product space.", numbers: "The joint mass is $0.06$." }
    ]
  },
  "math-07-14": {
    connectionsProse: "<p>This lesson explains when an integral over pairs can be computed one coordinate at a time. Product measures make the joint space precise, and Fubini's theorem gives the rule for iterated integration when the hypotheses are met. The theorem supports the everyday practice of summing by rows then columns, averaging over data then randomness, or reversing those orders. Its proof begins with rectangle indicators because their product structure is transparent.</p>",
    motivation: "<p>Computing a joint integral directly can be difficult, but many joint spaces have a coordinate structure. For rectangles, integrating first in $y$ and then in $x$ clearly gives the same value as multiplying the two coordinate measures. Fubini's theorem says this agreement extends far beyond rectangle indicators when the right integrability conditions hold.</p>" +
                "<p>The theorem has two closely related forms. Tonelli's theorem handles nonnegative functions and allows the value $\\infty$; Fubini's theorem handles signed functions when the absolute integral is finite. Together they justify changing the order of summation or integration in product spaces. This is why row-first and column-first computations agree when the hypotheses are satisfied.</p>",
    definition: "<p>Fubini's theorem states that an absolutely integrable function on a product measure space can be integrated one coordinate at a time:</p>" +
                "<p>$$\\int_{X\\times Y} f\\,d(\\mu\\times\\nu)=\\int_X\\int_Y f(x,y)\\,d\\nu(y)\\,d\\mu(x)$$</p>" +
                "<p><b>Assumptions that matter:</b> Tonelli applies to nonnegative functions, while signed functions require absolute integrability; the product spaces are taken with product measure.</p>",
    symbols: [
      { sym: "$\\int_X\\int_Y f(x,y)\\,d\\nu(y)\\,d\\mu(x)$", desc: "an iterated integral" },
      { sym: "$\\mu\\times\\nu$", desc: "the product measure" },
      { sym: "sigma-finite spaces", desc: "avoid pathologies" },
      { sym: "absolute integrability", desc: "means $\\int |f|<\\infty$" }
    ],
    derivation: [
      { do: "Let $f=c\\,1_{A\\times B}$.", result: "$f=c\\,1_{A\\times B}$", why: "This is the simplest function on a product space." },
      { do: "Compute the product integral.", result: "$\\int f\\,d(\\mu\\times\\nu)=c\\mu(A)\\nu(B)$", why: "This uses the product rectangle rule." },
      { do: "Integrate in $y$ first.", result: "$\\int_Y c1_A(x)1_B(y)\\,d\\nu(y)=c1_A(x)\\nu(B)$", why: "For fixed $x$, only the $B$ part is averaged over $Y$." },
      { do: "Integrate the result over $x$.", result: "$\\int_X c1_A(x)\\nu(B)\\,d\\mu(x)=c\\mu(A)\\nu(B)$", why: "This matches the product integral." },
      { do: "Add finitely many such rectangle indicators by linearity.", result: "simple functions follow", why: "Linearity extends the rectangle calculation." },
      { do: "Use monotone convergence for nonnegative functions and absolute integrability for signed functions.", result: "Tonelli and Fubini in their full forms", why: "This extends from simple functions to the theorem's full hypotheses." }
    ],
    applications: [
      { title: "Marginalizing joint densities", background: "The joint density $xy$ on the unit square can be integrated in either order.", numbers: "$\\int_0^1\\int_0^1 xy\\,dy\\,dx=1/4$." },
      { title: "Expected loss over data and dropout", background: "Average losses $1,3$ over two data points and $0.5,1.5$ over two masks can be averaged by either coordinate first.", numbers: "The total mean is $1.5$." },
      { title: "Image brightness", background: "Summing rows then columns of a $2\\times2$ image $\\begin{bmatrix}1&2\\3&4\\end{bmatrix}$ gives the same total either way.", numbers: "The total is $10$." },
      { title: "Database aggregation", background: "Group sums $7$ and $5$ can be aggregated independent of grouping order.", numbers: "They total $12$." },
      { title: "Attention summaries", background: "A $3\\times4$ attention table can be summed row-first or column-first.", numbers: "It has $12$ weights whose total is unchanged." },
      { title: "Simulation averages", background: "$5$ seeds and $10$ examples form a product averaging problem.", numbers: "They give $50$ losses averaged in either order." }
    ]
  },
  "math-07-15": {
    connectionsProse: "<p>This lesson identifies probability as a special case of measure theory. The sample space is the whole measurable space, events are measurable sets, and probability is a measure whose total mass is one. Familiar probability rules are therefore not separate assumptions; they follow from additivity. This viewpoint prepares the later lessons on random variables, distributions, and expectations.</p>",
    motivation: "<p>Probability rules become simpler when probability is viewed as measure with total mass one. The whole sample space has measure $1$, an event is a measurable set, and a probability is the measure of that set. Complement and union formulas are then consequences of splitting sets into disjoint pieces.</p>" +
                "<p>This perspective explains why the same additivity rules apply to finite experiments, continuous distributions, and empirical datasets. It also prepares the integral view of expectation: once probability is a measure, averaging a random variable is integration with respect to that measure. The derivation here recovers familiar probability identities from the measure axioms.</p>",
    definition: "<p>A probability space is a measure space whose total mass is one:</p>" +
                "<p>$$(\\Omega,\\mathcal F,P),\\qquad P(\\Omega)=1$$</p>" +
                "<p><b>Assumptions that matter:</b> Events are members of $\\mathcal F$, and $P$ is a countably additive measure on those events.</p>",
    symbols: [
      { sym: "$\\Omega$", desc: "the sample space" },
      { sym: "$\\mathcal F$", desc: "the event sigma-algebra" },
      { sym: "$P$", desc: "a measure with $P(\\Omega)=1$" },
      { sym: "$A^c$", desc: "the complement" },
      { sym: "$A\\cap B$", desc: "the overlap" }
    ],
    derivation: [
      { do: "Start with a probability space $(\\Omega,\\mathcal F,P)$ and event $A$.", result: "$P(\\Omega)=1$", why: "This means $P(\\Omega)=1$." },
      { do: "Split $\\Omega=A\\cup A^c$ disjointly.", result: "$\\Omega=A\\cup A^c$", why: "Every outcome is either in $A$ or not." },
      { do: "Apply additivity.", result: "$1=P(\\Omega)=P(A)+P(A^c)$", why: "Disjoint event probabilities add." },
      { do: "Rearrange.", result: "$P(A^c)=1-P(A)$", why: "This is the complement rule." },
      { do: "For two events, split $A\\cup B$ into disjoint pieces $A$ and $B\\setminus A$.", result: "$A\\cup B=A\\cup(B\\setminus A)$", why: "This avoids double-counting the overlap." },
      { do: "Add and rewrite $P(B\\setminus A)=P(B)-P(A\\cap B)$.", result: "$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$", why: "This gives the union formula." }
    ],
    applications: [
      { title: "Dataset proportions", background: "$73$ positives in $1000$ examples define an empirical probability.", numbers: "The empirical probability is $0.073$." },
      { title: "A/B tests", background: "If treatment and control partition the sample space, complements give the control probability.", numbers: "If $P(T)=0.5$, then $P(T^c)=0.5$." },
      { title: "Union events", background: "If $P(A)=0.3$, $P(B)=0.4$, and $P(A\\cap B)=0.12$, inclusion-exclusion gives the union probability.", numbers: "$P(A\\cup B)=0.58$." },
      { title: "Confusion matrices", background: "A false-positive event with $40$ of $1000$ rows has empirical probability.", numbers: "The probability is $0.04$." },
      { title: "Independent services", background: "Failures with probabilities $0.01$ and $0.02$ multiply under independence.", numbers: "The joint probability is $0.0002$." },
      { title: "Rare continuous events", background: "In continuous probability, point events and interval events can behave differently.", numbers: "A point event can have probability $0$ while an interval event has positive probability." }
    ]
  },
  "math-07-16": {
    connectionsProse: "<p>This lesson gives the measure-theoretic definition of a random variable. A random variable is a measurable map from outcomes to a value space, so value conditions pull back to events. Its distribution is the measure created by pushing the original probability measure through that map. This is how a model score, label, feature transform, or loss obtains its own probability law.</p>",
    motivation: "<p>In elementary probability, a random variable is often described as a numerical outcome of an experiment. Measure theory makes that precise by treating it as a measurable function from the outcome space to the value space. The measurability condition ensures that value questions such as $X\\le t$ are genuine events.</p>" +
                "<p>The distribution of $X$ is obtained by pushing the original probability measure forward through $X$. Instead of measuring values directly, we measure the outcomes that map into a value set. This definition works for discrete, continuous, and mixed random variables in the same way. It also explains why transformations of random variables create new distributions.</p>",
    definition: "<p>A random variable is a measurable map from the outcome space to a value space, and its distribution is the pushforward measure</p>" +
                "<p>$$P_X(B)=P(X^{-1}(B))$$</p>" +
                "<p><b>Assumptions that matter:</b> $X$ is measurable, $B$ is a Borel set of values, and $P_X$ measures outcomes by pulling value-sets back to events in $\\Omega$.</p>",
    symbols: [
      { sym: "$X$", desc: "a random variable" },
      { sym: "$P_X$", desc: "its distribution or law" },
      { sym: "$B$", desc: "a Borel set of values" },
      { sym: "$X^{-1}(B)=\\{\\omega:X(\\omega)\\in B\\}$", desc: "a preimage event" },
      { sym: "pushforward", desc: "moving the measure through $X$" }
    ],
    derivation: [
      { do: "Let $X:\\Omega\\to\\mathbb R$ be measurable.", result: "$X:\\Omega\\to\\mathbb R$", why: "This ensures value conditions pull back to events." },
      { do: "For a Borel set $B\\subseteq\\mathbb R$, define $P_X(B)=P(X^{-1}(B))$.", result: "$P_X(B)=P(X^{-1}(B))$", why: "This measures the outcomes whose values land in $B$." },
      { do: "Check the empty set.", result: "$P_X(\\varnothing)=P(X^{-1}(\\varnothing))=P(\\varnothing)=0$", why: "The distribution has zero empty mass." },
      { do: "For disjoint Borel sets $B_i$, take preimages.", result: "$X^{-1}(B_i)$ are disjoint", why: "A single outcome cannot land in two disjoint value sets." },
      { do: "Use preimage union preservation.", result: "$X^{-1}(\\bigcup_iB_i)=\\bigcup_iX^{-1}(B_i)$", why: "This transfers countable unions back to outcomes." },
      { do: "Apply countable additivity of $P$.", result: "$P_X(\\bigcup_iB_i)=\\sum_iP_X(B_i)$", why: "Thus $P_X$ is a probability measure." }
    ],
    applications: [
      { title: "Model scores", background: "If $P(\\omega:s(\\omega)>0.8)=0.12$, the score distribution assigns that mass to high score values.", numbers: "$P_s((0.8,1])=0.12$." },
      { title: "Label indicators", background: "$Y=1_A$ pushes event mass onto the value $1$.", numbers: "$P_Y(\\{1\\})=P(A)$." },
      { title: "Feature transforms", background: "If $Z=2X+1$ and $P(X\\le3)=0.7$, the transformed threshold corresponds to the same event.", numbers: "$P(Z\\le7)=0.7$." },
      { title: "Simulation", background: "Mapping random seeds to outputs turns seed measure into output distribution.", numbers: "Mapping random seeds to outputs turns seed measure into output distribution." },
      { title: "Ranking buckets", background: "A bucket map with bucket masses $0.2,0.5,0.3$ defines a discrete pushforward law.", numbers: "The bucket masses are $0.2,0.5,0.3$." },
      { title: "Loss as random variable", background: "$L(h(X),Y)$ has a distribution induced by the underlying data-generating probability.", numbers: "Its mean is risk." }
    ]
  },
  "math-07-17": {
    connectionsProse: "<p>This lesson connects the integral built in `math-07-08` with the average used throughout probability and machine learning. Earlier lessons made two pieces precise. A random variable is a measurable function, and the Lebesgue integral adds a measurable function over a measure space. When the measure is a probability measure, that integral is expectation.</p>" +
                      "<p>This viewpoint is more than a change in notation. It makes discrete averages, continuous averages, indicator probabilities, expected losses, and moments all part of one definition. It also explains why convergence theorems matter in probability: they are the rules that allow limits to pass through expectations when a model, estimator, or approximation improves.</p>",
    motivation: "<p>An ordinary average adds observed values and divides by how many observations there are. A probability average does the same thing, except the weights come from probability mass instead of from a fixed list. If $X$ takes values $0,1,3$ with probabilities $0.2,0.5,0.3$, the average is $0\\cdot0.2+1\\cdot0.5+3\\cdot0.3=1.4$.</p>" +
                "<p>The Lebesgue integral writes that same calculation without separating the discrete and continuous cases. The random variable $X$ is a measurable function on the outcome space $\\Omega$, and the probability measure $P$ supplies the weights. The expectation is $$\\mathbb E[X]=\\int_\\Omega X\\,dP.$$ For an indicator function this gives $\\mathbb E[\\mathbf 1_A]=P(A)$; for a loss function it gives the risk $\\mathbb E[L]=\\int L\\,dP$; for a density it gives the familiar integral $\\int x f(x)\\,dx$.</p>" +
                "<p>This is the foundation of expected loss in machine learning. Training objectives often replace the true probability measure by an empirical one, but the object being approximated is still an integral. The same definition also supports Jensen's inequality, moment bounds, and change-of-measure formulas later in the probability track.</p>",
    definition: "<p>When the Lebesgue integral is defined, expectation is integration with respect to the probability measure:</p>" +
                "<p>$$\\mathbb E[X]=\\int_\\Omega X\\,dP$$</p>" +
                "<p><b>Assumptions that matter:</b> For signed $X$, require $\\mathbb E[X^+]<\\infty$ or $\\mathbb E[X^-]<\\infty$ so the expression is not $\\infty-\\infty$.</p>",
    symbols: [
      { sym: "$\\Omega$", desc: "the outcome space" },
      { sym: "$\\mathcal F$", desc: "the event sigma-algebra" },
      { sym: "$P$", desc: "the probability measure" },
      { sym: "$X$", desc: "a measurable real-valued function" },
      { sym: "$X^+=\\max(X,0)$ and $X^-=\\max(-X,0)$", desc: "positive and negative parts" },
      { sym: "$\\mathbf 1_A$", desc: "the indicator of event $A$" },
      { sym: "$\\varphi$", desc: "a convex function" },
      { sym: "$m$", desc: "the mean" }
    ],
    derivation: [
      { do: "Write a simple random variable as $X=\\sum_{k=1}^n x_k\\mathbf 1_{A_k}$, where the disjoint events $A_k$ are the value regions $\\{\\omega:X(\\omega)=x_k\\}$.", result: "$X=\\sum_{k=1}^n x_k\\mathbf 1_{A_k}$", why: "This partitions the outcomes by the value of $X$." },
      { do: "Integrate the simple function.", result: "$\\int X\\,dP=\\sum_{k=1}^n x_k P(A_k)$", why: "This is the Lebesgue integral rule for simple functions." },
      { do: "Read $P(A_k)$ as $P(X=x_k)$.", result: "$P(A_k)=P(X=x_k)$", why: "This changes the same weights from event notation to distribution notation." },
      { do: "Conclude the finite-valued expectation formula.", result: "$\\mathbb E[X]=\\sum_{k=1}^n x_kP(X=x_k)$", why: "This recovers the familiar weighted average from the integral definition." },
      { do: "For an indicator, set $X=\\mathbf 1_A=1\\cdot\\mathbf 1_A+0\\cdot\\mathbf 1_{A^c}$.", result: "$X=\\mathbf 1_A=1\\cdot\\mathbf 1_A+0\\cdot\\mathbf 1_{A^c}$", why: "This is the simplest two-value simple function." },
      { do: "Integrate the indicator.", result: "$\\mathbb E[\\mathbf 1_A]=1\\cdot P(A)+0\\cdot P(A^c)=P(A)$", why: "This shows probabilities are special expectations." },
      { do: "For a convex function $\\varphi$, draw a supporting line at the mean $m=\\mathbb E[X]$.", result: "$\\varphi(x)\\ge \\varphi(m)+a(x-m)$", why: "This is the defining geometric property of convexity." },
      { do: "Take expectations of both sides.", result: "$\\mathbb E[\\varphi(X)]\\ge\\varphi(m)+a(\\mathbb E[X]-m)=\\varphi(m)$", why: "This gives Jensen's inequality $\\varphi(\\mathbb E[X])\\le\\mathbb E[\\varphi(X)]$." }
    ],
    applications: [
      { title: "Expected loss", background: "If losses $L\\in\\{1,4,10\\}$ occur with probabilities $(0.2,0.5,0.3)$, expectation averages them by probability mass.", numbers: "$\\mathbb E[L]=1(0.2)+4(0.5)+10(0.3)=5.2$." },
      { title: "Empirical risk", background: "The empirical measure on four losses $(1.0,0.5,2.0,1.5)$ gives the sample average as an integral.", numbers: "$\\int L\\,dP_n=(1.0+0.5+2.0+1.5)/4=1.25$." },
      { title: "Indicator metric", background: "If a classifier violates a latency budget on event $A$ with $P(A)=0.07$, the indicator expectation is the event probability.", numbers: "$\\mathbb E[\\mathbf 1_A]=0.07$." },
      { title: "Mean squared error", background: "If errors are $1,2,3$ with probabilities $(0.2,0.5,0.3)$, squared error is another expected value.", numbers: "$\\mathbb E[E^2]=0.2(1)^2+0.5(2)^2+0.3(3)^2=4.9$." },
      { title: "A/B experiment lift", background: "If treatment lift is $-1,0,3$ with probabilities $(0.2,0.5,0.3)$, expectation gives average lift.", numbers: "The expected lift is $-0.2+0+0.9=0.7$." },
      { title: "Jensen for risk", background: "With $X\\in\\{0,1,3\\}$ and probabilities $(0.2,0.5,0.3)$, convexity of squaring gives Jensen's inequality.", numbers: "$(\\mathbb E[X])^2=1.4^2=1.96\\le\\mathbb E[X^2]=3.2$." }
    ]
  },
  "math-07-18": {
    connectionsProse: "<p>This lesson connects measures through densities. When one measure gives zero mass to every set that a reference measure considers null, the Radon--Nikodym theorem represents the target measure by integrating a derivative against the reference measure. This is the rigorous form of a density ratio. It is central in likelihood ratios, importance sampling, and distribution-shift reweighting.</p>",
    motivation: "<p>Sometimes two measures live on the same measurable space and one is used as a reference for the other. If the target measure never assigns positive mass to a reference-null set, then the target can be described by a density relative to the reference. This condition is called absolute continuity.</p>" +
                "<p>The Radon--Nikodym derivative is that relative density. On a finite space it is simply the ratio of masses on each atom, and integrating the ratio against the reference measure reconstructs the target measure. The theorem says that the same representation holds in much broader sigma-finite settings. This is the measure-theoretic basis for likelihood ratios and change of measure.</p>",
    definition: "<p>If $\\nu\\ll\\mu$ on a sigma-finite measure space, the Radon--Nikodym theorem gives a nonnegative measurable derivative $h=d\\nu/d\\mu$ such that</p>" +
                "<p>$$\\nu(A)=\\int_A h\\,d\\mu$$</p>" +
                "<p><b>Assumptions that matter:</b> Absolute continuity $\\nu\\ll\\mu$ is required, and the derivative is unique up to $\\mu$-almost everywhere equality.</p>",
    symbols: [
      { sym: "$\\nu\\ll\\mu$", desc: "absolute continuity" },
      { sym: "$h=d\\nu/d\\mu$", desc: "the Radon--Nikodym derivative" },
      { sym: "$\\mu$", desc: "the reference measure" },
      { sym: "$\\nu$", desc: "the target measure" },
      { sym: "sigma-finite", desc: "the space is a countable union of finite-measure pieces" }
    ],
    derivation: [
      { do: "Assume $\\nu(A)=\\int_A h\\,d\\mu$ for a nonnegative measurable $h$.", result: "$\\nu(A)=\\int_A h\\,d\\mu$", why: "This is the density representation." },
      { do: "If $\\mu(A)=0$, integrate over $A$.", result: "$\\int_A h\\,d\\mu=0$", why: "Integrating over a null set gives zero." },
      { do: "Therefore $\\nu(A)=0$.", result: "$\\nu(A)=0$", why: "This proves absolute continuity $\\nu\\ll\\mu$ is necessary." },
      { do: "On a finite space with $\\mu_i>0$, define $h_i=\\nu_i/\\mu_i$.", result: "$h_i=\\nu_i/\\mu_i$", why: "This is the only possible density value on atom $i$." },
      { do: "For any set $A$, compute the integral.", result: "$\\int_A h\\,d\\mu=\\sum_{i\\in A}h_i\\mu_i=\\sum_{i\\in A}\\nu_i=\\nu(A)$", why: "The density reconstructs the measure." },
      { do: "Apply the theorem on sigma-finite measure spaces.", result: "$h=d\\nu/d\\mu$ unique up to $\\mu$-almost everywhere equality", why: "The same reconstruction holds beyond finite spaces." }
    ],
    applications: [
      { title: "Likelihood ratios", background: "If $P=(0.2,0.5,0.3)$ and $Q=(0.1,0.6,0.3)$, the derivative is a componentwise ratio.", numbers: "$dP/dQ=(2,0.833,1)$." },
      { title: "Importance sampling", background: "Under $Q=(0.5,0.5)$ and $P=(0.2,0.8)$, importance weights are density ratios.", numbers: "The weights are $(0.4,1.6)$." },
      { title: "Dataset reweighting", background: "Source mass $0.4$ and target mass $0.6$ in a bin produce a reweighting factor.", numbers: "The ratio is $1.5$." },
      { title: "Continuous density", background: "If $dP/dm=2$ on $[0,0.5]$ and $0$ elsewhere, interval probability is density times length.", numbers: "$P([0,0.25])=0.5$." },
      { title: "Change of measure", background: "For $h=2$ on mass $0.25$ and $0.5$ on mass $0.5$, integrating the density reconstructs target mass.", numbers: "$\\nu(A)=0.75$." },
      { title: "Singular warning", background: "If $Q(A)=0$ but $P(A)=0.1$, absolute continuity fails on that event.", numbers: "$dP/dQ$ does not exist as an ordinary finite density on that event." }
    ]
  },
  "math-07-19": {
    connectionsProse: "<p>This lesson specializes the Radon--Nikodym idea to ordinary continuous distributions. A density with respect to Lebesgue measure tells how probability accumulates over intervals. The density is not the probability of a single point; points have zero Lebesgue length under ordinary densities. Interval probabilities, cumulative distribution functions, and likelihood calculations all come from integrating the density.</p>",
    motivation: "<p>A continuous density is best understood as a rate of probability accumulation, not as point probability. To find the probability of an interval, integrate the density over that interval. To find the cumulative distribution function, integrate the density from the left up to the threshold.</p>" +
                "<p>This view matches the Radon--Nikodym theorem with Lebesgue measure as the reference measure. If $f=dP/dm$, then $P(A)=\\int_A f(x)\\,dx$ for Borel sets $A$. When the CDF is differentiable, the density is its derivative. Single points have zero probability under ordinary densities because they have zero Lebesgue measure.</p>",
    definition: "<p>A density $f=dP/dm$ represents a probability measure $P$ relative to Lebesgue measure $m$ by</p>" +
                "<p>$$P(A)=\\int_A f(x)\\,dx$$</p>" +
                "<p><b>Assumptions that matter:</b> The set $A$ is Borel, $f\\ge0$, and $\\int_\\mathbb R f(x)\\,dx=1$ for a probability density.</p>",
    symbols: [
      { sym: "$f=dP/dm$", desc: "the density" },
      { sym: "$m$", desc: "Lebesgue measure" },
      { sym: "$F$", desc: "the cumulative distribution function" },
      { sym: "$dx$", desc: "integration with respect to Lebesgue measure" },
      { sym: "$A$", desc: "a Borel set" }
    ],
    derivation: [
      { do: "Suppose $P(A)=\\int_A f(x)\\,dx$ for every Borel set $A$.", result: "$P(A)=\\int_A f(x)\\,dx$", why: "This defines a probability measure by a density." },
      { do: "Set $A=(-\\infty,t]$.", result: "$F(t)=P(X\\le t)=\\int_{-\\infty}^t f(x)\\,dx$", why: "The CDF is accumulated density." },
      { do: "If $f\\ge0$ and $\\int_\\mathbb R f(x)\\,dx=1$, compute total mass.", result: "$P(\\mathbb R)=1$", why: "This is total probability." },
      { do: "For an interval $(a,b]$, subtract CDF values.", result: "$P(a<X\\le b)=F(b)-F(a)=\\int_a^b f(x)\\,dx$", why: "This gives interval probabilities." },
      { do: "When $F$ is differentiable at $t$, apply the fundamental theorem of calculus.", result: "$F'(t)=f(t)$", why: "Density is the derivative of accumulated probability." },
      { do: "Integrate over a point.", result: "$\\int_{\\{t\\}}f(x)\\,dx=0$", why: "Probability comes from intervals, not single points." }
    ],
    applications: [
      { title: "Uniform score", background: "Density $1/2$ on $[0,2]$ gives interval probabilities by area.", numbers: "$P(0.5\\le X\\le1.5)=0.5$." },
      { title: "Triangular density", background: "$f(x)=2x$ on $[0,1]$ accumulates probability quadratically.", numbers: "$F(0.5)=0.25$." },
      { title: "Likelihood", background: "Observations $0.2,0.4$ under $f(x)=2x$ have likelihood from multiplying density values.", numbers: "$0.4\\cdot0.8=0.32$." },
      { title: "Histogram normalization", background: "Bin count $30$ out of $100$ in width $0.2$ estimates density by mass divided by width.", numbers: "$0.30/0.2=1.5$." },
      { title: "Generative models", background: "A normalizing flow with base density $0.2$ and Jacobian factor $3$ multiplies those factors.", numbers: "The density is $0.6$." },
      { title: "Anomaly thresholds", background: "If $P(X>t)=0.01$, the upper tail probability is a density integral.", numbers: "The upper tail interval has density integral $0.01$." }
    ]
  },
  "math-07-20": {
    connectionsProse: "<p>This capstone lesson gathers the section into the probability language used later in the track. The earlier lessons introduced measurable spaces, measures, measurable maps, integrals, product measures, and Radon--Nikodym derivatives. Together they explain probability spaces, random variables, distributions, expectations, densities, and joint laws. The same chain also supports expected loss and risk in machine learning.</p>",
    motivation: "<p>The section's separate constructions now fit into one probability framework. A probability model begins with $(\\Omega,\\mathcal F,P)$, where $P$ is a measure on events. Random variables are measurable maps out of that space, and their distributions are pushforward measures. Expectations are Lebesgue integrals of measurable functions.</p>" +
                "<p>Densities and likelihood ratios are Radon--Nikodym derivatives, while product measures describe joint spaces and support iterated averaging. This synthesis matters because later probability and machine-learning arguments often move among these forms without changing the underlying object. Expected loss, empirical risk, distribution shift, and moment control all use this same measure-theoretic chain.</p>",
    definition: "<p>Measure-theoretic probability starts from a probability space, sends measurable maps to pushforward distributions, and computes averages as Lebesgue integrals:</p>" +
                "<p>$$(\\Omega,\\mathcal F,P),\\quad P_X(B)=P(X^{-1}(B)),\\quad \\mathbb E[g(X)]=\\int g(X)\\,dP$$</p>" +
                "<p><b>Assumptions that matter:</b> $P$ is a measure on events, random variables are measurable maps, densities are Radon--Nikodym derivatives, and product measures govern joint spaces.</p>",
    symbols: [
      { sym: "$(\\Omega,\\mathcal F,P)$", desc: "the probability space" },
      { sym: "$X:\\Omega\\to S$", desc: "a random variable" },
      { sym: "$P_X$", desc: "the pushforward distribution" },
      { sym: "$\\mathbb E[g(X)]$", desc: "an integral" },
      { sym: "$dP/dQ$", desc: "a density ratio" },
      { sym: "$P\\times Q$", desc: "a product measure" }
    ],
    applications: [
      { title: "Empirical risk", background: "$R_n(h)=\\int L(h(x),y)\\,dP_n$ equals the average loss.", numbers: "It is $1.25$ for four losses $(1,0.5,2,1.5)$." },
      { title: "Expected population risk", background: "Replacing $P_n$ by $P$ gives the target quantity optimized in learning theory.", numbers: "Replacing $P_n$ by $P$ gives the target quantity optimized in learning theory." },
      { title: "Distribution shift", background: "If $dP_{target}/dP_{train}=1.5$ in a bin, losses in that bin are reweighted.", numbers: "They receive $1.5\\times$ weight." },
      { title: "Joint modeling", background: "Product measures combine independent masses for joint events.", numbers: "$P(X\\in A,Y\\in B)=0.1$ from masses $0.4$ and $0.25$ under independence." },
      { title: "Threshold metrics", background: "An FPR is an expectation of an indicator.", numbers: "$40/1000=0.04$." },
      { title: "Moment control", background: "$\\lVert X\\rVert_2=2.214$ means the square moment is fixed for the checked discrete example.", numbers: "$\\mathbb E[X^2]=4.9$." }
    ]
  }
};
