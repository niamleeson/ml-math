/* =====================================================================
   DERIVATIONS / PROOFS / INTUITION for the Probability & Statistics module.
   Same style as the foundations gold standard.
   Each value is HTML. It answers: WHERE does the formula come from?
   WHY is it true? What is the INTUITION? Show steps, keep sentences short.
   ===================================================================== */
(function () {
Object.assign(window.DERIVATIONS, {

/* ---------------------------------------------------------------- */
"prob-sample-space":
  `<p><b>Why list every outcome first?</b> The sample space is a definition, not a theorem. But the choice is forced on us by one honest need: before you can measure chance, you must agree on what <i>could</i> happen.</p>
   <p><b>Why a set?</b> A set has no repeats and no order. That is exactly right for "the things that can happen". "Heads" is listed once. Whether you write $\\{H,T\\}$ or $\\{T,H\\}$ makes no difference.</p>
   <p><b>Where events come from.</b> Once $\\Omega$ (the full list of outcomes) exists, an event is any sub-list you care about. Why subsets and not something fancier?</p>
   <ul class="steps">
     <li>A real question — "did we get an even number?" — is answered by pointing at some outcomes: $\\{2,4,6\\}$.</li>
     <li>So every yes/no question about the experiment <i>is</i> a subset of $\\Omega$. The question and the subset are the same object.</li>
     <li>That is why all of probability is built on sets: a probability is a number we glue onto each subset.</li>
   </ul>
   <p><b>Intuition.</b> Picture $\\Omega$ as a board with one sticker per outcome. An event is a circle you draw around some stickers. Nothing here is computed yet — we are just laying down the board that everything else will sit on.</p>`,

/* ---------------------------------------------------------------- */
"prob-axioms":
  `<p>The three axioms are the <b>minimum rules</b> that make "chance" behave the way we expect. Watch how much they already force. We will prove the complement rule $P(A^c)=1-P(A)$ from them — using only normalization and additivity.</p>
   <p><b>Setup.</b> $A^c$ means "$A$ does not happen". Two facts about it:</p>
   <ul class="steps">
     <li>$A$ and $A^c$ are <b>disjoint</b>: an outcome cannot be both inside $A$ and outside $A$. They share nothing.</li>
     <li>Together they are <b>everything</b>: every outcome is either in $A$ or not. So $A \\cup A^c = \\Omega$.</li>
   </ul>
   <p><b>The proof.</b></p>
   <ul class="steps">
     <li>By additivity (Rule 3), since $A$ and $A^c$ are disjoint: $P(A \\cup A^c) = P(A) + P(A^c)$.</li>
     <li>But $A \\cup A^c = \\Omega$, and by normalization (Rule 2), $P(\\Omega) = 1$.</li>
     <li>So $P(A) + P(A^c) = 1$.</li>
     <li>Subtract $P(A)$ from both sides: $P(A^c) = 1 - P(A)$. ∎</li>
   </ul>
   <p><b>Intuition.</b> The whole pie has area 1. Slice $A$ off. What's left over <i>must</i> be the rest of the pie, $1 - P(A)$. There is nowhere else for the probability to go. The axioms just make that picture exact.</p>
   <p><b>Bonus.</b> Set $A = \\Omega$, so $A^c$ is the empty event. Then $P(\\text{empty}) = 1 - 1 = 0$. The chance of "no outcome at all" is zero — another free gift from the same rules.</p>`,

/* ---------------------------------------------------------------- */
"prob-conditional":
  `<p>The formula $P(A \\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$ is a <b>definition</b>, but it is the <i>only</i> definition that respects one idea: "given $B$" means we now live inside $B$.</p>
   <p><b>Why divide by $P(B)$?</b> Building the formula step by step.</p>
   <ul class="steps">
     <li>You learned $B$ happened. So throw away every outcome outside $B$. Your new world is just $B$.</li>
     <li>Inside that new world, the only way $A$ can happen is the overlap $A \\cap B$ (the part of $A$ that is also in $B$).</li>
     <li>But $P(A\\cap B)$ is measured against the <i>old</i> full world. Your new world is smaller — it has total weight $P(B)$, not 1.</li>
     <li>To turn it back into an honest probability (one that sums to 1 over the new world), rescale: divide by $P(B)$. That gives $\\dfrac{P(A\\cap B)}{P(B)}$.</li>
   </ul>
   <p><b>Check it is honest.</b> Put $A = B$. Then $A \\cap B = B$, and $P(B\\mid B)=\\dfrac{P(B)}{P(B)}=1$. Given $B$, the event $B$ is now certain. Good.</p>
   <p><b>The multiplication rule falls right out.</b> Multiply both sides by $P(B)$:</p>
   <div class="formula-box">$$ P(A \\cap B) = P(B)\\,P(A \\mid B) $$</div>
   <p>Read it as a recipe: "both happen" = "$B$ happens" times "then $A$ happens given $B$". Two stages, multiplied.</p>
   <p><b>Intuition.</b> Conditioning is zooming in. You crop the photo down to $B$, then ask what fraction of that crop is also $A$.</p>`,

/* ---------------------------------------------------------------- */
"prob-bayes":
  `<p>Bayes' rule is not a new law. It is two lines of algebra on top of conditional probability. Let us <b>derive it</b>.</p>
   <p><b>Start from one fact written two ways.</b> The overlap $A \\cap B$ is the same event no matter which side you condition on. So the multiplication rule gives it two names:</p>
   <ul class="steps">
     <li>Condition on $A$: $\\;P(A \\cap B) = P(A)\\,P(B \\mid A)$.</li>
     <li>Condition on $B$: $\\;P(A \\cap B) = P(B)\\,P(A \\mid B)$.</li>
     <li>Both equal $P(A\\cap B)$, so they equal each other: $P(B)\\,P(A \\mid B) = P(A)\\,P(B \\mid A)$.</li>
     <li>Divide both sides by $P(B)$: $\\;P(A \\mid B) = \\dfrac{P(B \\mid A)\\,P(A)}{P(B)}$. ∎</li>
   </ul>
   <p>That is the whole derivation. Bayes' rule is just "the overlap doesn't care which way you slice it".</p>
   <p><b>Intuition — flipping the condition.</b> You know $P(B \\mid A)$ (how often evidence shows up when $A$ is true) but you want $P(A \\mid B)$ (how likely $A$ is now that you see the evidence). Bayes turns the arrow around.</p>
   <p><b>Why the base rate dominates.</b> Look at the $P(A)$ sitting in the numerator. If $A$ is rare ($P(A)$ tiny), the whole answer is pulled toward small — no matter how good the evidence is. A super-accurate test for a one-in-a-million disease still gives mostly false alarms, because the prior $P(A)$ scales everything. The base rate is a multiplier you can never ignore.</p>`,

/* ---------------------------------------------------------------- */
"prob-total-prob":
  `<p>Total probability is just additivity plus the multiplication rule, used together. Here is the <b>derivation</b>.</p>
   <p><b>Setup.</b> The cases $A_1, A_2, \\dots$ form a <b>partition</b>: they don't overlap, and together they cover all of $\\Omega$.</p>
   <ul class="steps">
     <li>Take any event $B$. Split it by which case it falls in. Each piece is $B \\cap A_i$ — "$B$ happened, and we were in case $i$".</li>
     <li>These pieces don't overlap (because the $A_i$ don't overlap), and together they rebuild all of $B$ (because the $A_i$ cover everything). So $B = (B\\cap A_1) \\cup (B\\cap A_2) \\cup \\cdots$.</li>
     <li>The pieces are disjoint, so additivity lets us add their chances: $P(B) = \\sum_i P(B \\cap A_i)$.</li>
     <li>Now rewrite each piece with the multiplication rule: $P(B \\cap A_i) = P(A_i)\\,P(B \\mid A_i)$.</li>
     <li>Substitute: $\\;P(B) = \\sum_i P(A_i)\\,P(B \\mid A_i)$. ∎</li>
   </ul>
   <p><b>Intuition.</b> Cut $B$ into slices, one per case. Weigh each slice. Add the weights. Because the cases tile the whole space with no gaps and no overlaps, you count every bit of $B$ exactly once.</p>
   <p><b>Where you've already met it.</b> This sum is exactly the denominator $P(B)$ inside Bayes' rule. "How likely is the evidence overall?" is answered by averaging the evidence's chance across every case, weighted by how common each case is.</p>`,

/* ---------------------------------------------------------------- */
"prob-independence":
  `<p>Independence has two faces — $P(A\\mid B)=P(A)$ and $P(A\\cap B)=P(A)P(B)$ — and they say the <b>same thing</b>. Let us show each forces the other.</p>
   <p><b>From "knowing $B$ changes nothing" to "multiply".</b></p>
   <ul class="steps">
     <li>Assume $P(A \\mid B) = P(A)$. (Learning $B$ leaves $A$'s odds untouched.)</li>
     <li>The definition of conditional probability says $P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}$.</li>
     <li>Set them equal: $\\dfrac{P(A \\cap B)}{P(B)} = P(A)$.</li>
     <li>Multiply both sides by $P(B)$: $\\;P(A \\cap B) = P(A)\\,P(B)$. ∎</li>
   </ul>
   <p><b>And back again.</b> Start from $P(A \\cap B) = P(A)P(B)$, divide both sides by $P(B)$, and the left side becomes $P(A \\mid B)$, the right side $P(A)$. So $P(A \\mid B) = P(A)$. The two statements imply each other — they are one idea.</p>
   <p><b>Intuition.</b> "Multiply" is what "tells you nothing" looks like in arithmetic. If $B$ doesn't shrink or grow $A$'s share, then $A$ keeps the same fraction inside $B$ as outside it, and the joint chance is just one fraction times the other.</p>
   <p><b>Watch out: independent is not disjoint.</b> Disjoint events <i>can't</i> co-occur, so $P(A\\cap B)=0$ — knowing $B$ happened makes $A$ <i>impossible</i>. That is the strongest possible dependence, the opposite of independence.</p>`,

/* ---------------------------------------------------------------- */
"prob-counting":
  `<p>We will <b>derive both formulas</b> from one rule: when you make choices in stages, multiply the number of options at each stage.</p>
   <p><b>Step 1 — permutations (order matters).</b> Arrange $r$ items out of $n$ in a row.</p>
   <ul class="steps">
     <li>First slot: $n$ choices. Second slot: $n-1$ left. Third: $n-2$. And so on, for $r$ slots.</li>
     <li>Multiply: $n \\times (n-1) \\times \\cdots \\times (n-r+1)$.</li>
     <li>That product is a chunk off the top of $n!$. Writing it cleanly: $\\dfrac{n!}{(n-r)!}$, because the $(n-r)!$ in the bottom cancels the tail we didn't use.</li>
   </ul>
   <p><b>Step 2 — combinations (order doesn't matter).</b> Now we only want <i>which</i> $r$ items, not their order.</p>
   <ul class="steps">
     <li>Every unordered group of $r$ items was counted many times above — once for each way to order those $r$ items.</li>
     <li>How many orderings does one group have? Exactly $r!$ (arrange $r$ things among themselves).</li>
     <li>So the ordered count over-counts each group by a factor of $r!$. Divide it out: $\\binom{n}{r} = \\dfrac{1}{r!}\\cdot\\dfrac{n!}{(n-r)!} = \\dfrac{n!}{r!\\,(n-r)!}$. ∎</li>
   </ul>
   <p><b>Intuition.</b> Permutations count line-ups; combinations count teams. One team of 3 hides $3!=6$ different line-ups. So divide the line-up count by 6 to get the team count.</p>
   <p><b>Sanity check.</b> $\\binom{n}{0}=\\dfrac{n!}{0!\\,n!}=1$ (one way to pick nothing) and $\\binom{n}{n}=1$ (one way to pick all). The $0!=1$ convention is exactly what makes these come out right.</p>`,

/* ---------------------------------------------------------------- */
"prob-random-variable":
  `<p>A random variable is a definition, but a natural one: it is a <b>relabeling</b> of outcomes by numbers, so that arithmetic becomes possible.</p>
   <p><b>Why we need it.</b> You cannot average "heads" and "tails". You can average $1$ and $0$. So we attach a number to each outcome and do math on the numbers.</p>
   <p><b>Where the PMF comes from.</b> Each value $x$ collects all the outcomes that map to it. The chance of $X=x$ is just the total chance of those outcomes — nothing new, only regrouped.</p>
   <p><b>Proof that a PMF must sum to 1.</b></p>
   <ul class="steps">
     <li>Every outcome $\\omega$ gets sent to exactly one value $x = X(\\omega)$. No outcome is skipped; none lands on two values.</li>
     <li>So grouping outcomes by their value $x$ slices the whole sample space into non-overlapping piles that cover everything — a partition.</li>
     <li>Adding the chances of all those piles is the same as adding the chances of all outcomes: $\\sum_x p_X(x) = P(\\Omega)$.</li>
     <li>By the normalization axiom, $P(\\Omega)=1$. So $\\sum_x p_X(x) = 1$. ∎</li>
   </ul>
   <p><b>Intuition.</b> The PMF is the old probability poured into new buckets labeled by numbers. You only rearranged the water; the total is still one full unit.</p>`,

/* ---------------------------------------------------------------- */
"prob-expectation":
  `<p>The expectation $E[X]=\\sum_x x\\,p_X(x)$ is a <b>weighted average</b>. Let us see why this is the natural "center", then prove the linearity rule.</p>
   <p><b>Why weight by probability?</b> Imagine repeating the experiment $N$ times. Value $x$ shows up about $N\\,p_X(x)$ times. The ordinary average of all $N$ results is the sum of every result divided by $N$:</p>
   <ul class="steps">
     <li>Sum of results $\\approx \\sum_x x \\cdot (N\\,p_X(x))$ (value $x$, counted its many times).</li>
     <li>Divide by $N$: average $\\approx \\sum_x x\\,p_X(x)$. The $N$ cancels.</li>
     <li>That is exactly $E[X]$. So the expectation is the long-run plain average — the formula was forced by what "average" means.</li>
   </ul>
   <p><b>Proof of linearity, $E[aX+b]=aE[X]+b$.</b> Here $a$ and $b$ are fixed numbers.</p>
   <ul class="steps">
     <li>By definition, $E[aX+b] = \\sum_x (ax+b)\\,p_X(x)$.</li>
     <li>Split the sum: $= \\sum_x a x\\,p_X(x) + \\sum_x b\\,p_X(x)$.</li>
     <li>Pull out the constants: $= a\\sum_x x\\,p_X(x) + b\\sum_x p_X(x)$.</li>
     <li>The first sum is $E[X]$; the second sum is $1$ (PMF totals to 1). So $E[aX+b]=a\\,E[X]+b$. ∎</li>
   </ul>
   <p><b>Intuition.</b> Stretching every value by $a$ stretches the center by $a$. Sliding every value up by $b$ slides the center up by $b$. The average moves exactly like the data.</p>`,

/* ---------------------------------------------------------------- */
"prob-variance":
  `<p>Variance is $E[(X-\\mu)^2]$ by definition — the average squared distance from the mean. The handy shortcut $E[X^2]-(E[X])^2$ is a <b>theorem</b>. Let us prove it.</p>
   <p><b>Derivation.</b> Write $\\mu = E[X]$ (a fixed number, not random).</p>
   <ul class="steps">
     <li>Start: $\\operatorname{Var}(X) = E[(X-\\mu)^2]$.</li>
     <li>Expand the square inside: $(X-\\mu)^2 = X^2 - 2\\mu X + \\mu^2$.</li>
     <li>Take the expectation of each piece (expectation of a sum is the sum of expectations): $E[X^2] - 2\\mu\\,E[X] + \\mu^2$.</li>
     <li>But $E[X]=\\mu$, so the middle term is $-2\\mu\\cdot\\mu = -2\\mu^2$, and the last is $+\\mu^2$.</li>
     <li>Combine: $E[X^2] - 2\\mu^2 + \\mu^2 = E[X^2] - \\mu^2 = E[X^2] - (E[X])^2$. ∎</li>
   </ul>
   <p><b>Why square the distance?</b> Squaring kills the sign, so distances above and below the mean don't cancel. It also punishes big gaps extra hard. And it is smooth, which calculus likes.</p>
   <p><b>Why take the square root for $\\sigma$?</b> Squaring changed the units to "value squared". The square root puts spread back into the same units as $X$, so $\\sigma$ is readable.</p>
   <p><b>Intuition.</b> "Average of the square" minus "square of the average". If a variable never moves, those two are equal and the variance is 0. The more it spreads, the more the average-of-squares pulls ahead of the square-of-the-average — and that gap is the variance.</p>`,

/* ---------------------------------------------------------------- */
"prob-bernoulli-binomial":
  `<p>Two things to <b>derive</b>: the Binomial PMF, and its mean $E[X]=np$ (the slick way, as a sum of Bernoullis).</p>
   <p><b>Deriving the PMF $P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}$.</b></p>
   <ul class="steps">
     <li>Fix one specific pattern of $n$ trials with exactly $k$ successes, e.g. WIN, WIN, LOSS, ... The trials are independent, so multiply their chances.</li>
     <li>Each of the $k$ wins contributes $p$; each of the $n-k$ losses contributes $1-p$. One pattern's chance: $p^k(1-p)^{n-k}$.</li>
     <li>Every pattern with $k$ wins has the <i>same</i> chance (same count of $p$'s and $(1-p)$'s). So we just need to count the patterns.</li>
     <li>Counting "which $k$ of the $n$ trials won" is $\\binom{n}{k}$. Multiply count by per-pattern chance: $\\binom{n}{k}p^k(1-p)^{n-k}$. ∎</li>
   </ul>
   <p><b>Deriving the mean $E[X]=np$.</b> The clean trick: a Binomial is a sum of $n$ Bernoullis.</p>
   <ul class="steps">
     <li>Let $X_i = 1$ if trial $i$ succeeds, else $0$. Then total successes $X = X_1 + X_2 + \\cdots + X_n$.</li>
     <li>One Bernoulli's mean: $E[X_i] = 1\\cdot p + 0\\cdot(1-p) = p$.</li>
     <li>Expectation of a sum is the sum of expectations (always true, even without independence): $E[X] = \\sum_{i=1}^{n} E[X_i] = \\underbrace{p + p + \\cdots + p}_{n\\text{ terms}} = np$. ∎</li>
   </ul>
   <p><b>Intuition.</b> $n$ trials, each adding $p$ to the expected tally. So you expect $np$ successes. No heavy algebra needed once you see it as adding up little 0/1 pieces.</p>`,

/* ---------------------------------------------------------------- */
"prob-geometric-poisson":
  `<p><b>Deriving the Geometric PMF $P(X=k)=(1-p)^{k-1}p$.</b> "First success on trial $k$" means a very specific story:</p>
   <ul class="steps">
     <li>Trials $1$ through $k-1$ must all be <i>failures</i>. Each fails with chance $1-p$, and trials are independent, so multiply: $(1-p)^{k-1}$.</li>
     <li>Trial $k$ must be the <i>success</i>: chance $p$.</li>
     <li>One story, so multiply the two parts: $(1-p)^{k-1}\\,p$. ∎</li>
   </ul>
   <p><b>Deriving the Geometric mean $E[X]=1/p$.</b> Use a one-line self-reference (first-step reasoning):</p>
   <ul class="steps">
     <li>Take one trial. With chance $p$ you succeed immediately: the wait is $1$.</li>
     <li>With chance $1-p$ you fail, having burned $1$ trial — and then you're starting over, with the same expected wait $E[X]$ still ahead. So that branch costs $1 + E[X]$.</li>
     <li>Average the branches: $E[X] = p\\cdot 1 + (1-p)\\,(1 + E[X])$.</li>
     <li>Expand: $E[X] = 1 + (1-p)E[X]$. Move terms: $E[X] - (1-p)E[X] = 1$, so $p\\,E[X] = 1$, giving $E[X] = \\dfrac{1}{p}$. ∎</li>
   </ul>
   <p>Rarer success (small $p$) means a longer wait — and $1/p$ says exactly that.</p>
   <p><b>Poisson as the limit of the Binomial.</b> Picture a window split into $n$ tiny time-slivers, each either holding one rare event or not.</p>
   <ul class="steps">
     <li>Let each sliver succeed with tiny chance $p$, tuned so the expected count stays fixed: $np = \\lambda$, i.e. $p = \\lambda/n$.</li>
     <li>The count of events is Binomial$(n,p)$. Now let $n\\to\\infty$ (slivers get infinitely fine) while $\\lambda$ stays put.</li>
     <li>Write the Binomial PMF — it already has three multiplied parts: $\\binom{n}{k}$ (ways to choose which slivers fire) $\\times\\, p^k$ (the $k$ successes) $\\times\\,(1-p)^{n-k}$ (the $n-k$ non-events).</li>
     <li>Substitute $p=\\lambda/n$: $\\;\\binom{n}{k}\\Big(\\dfrac{\\lambda}{n}\\Big)^{k}\\Big(1-\\dfrac{\\lambda}{n}\\Big)^{n-k}$.</li>
     <li>Split the middle power with the rule $\\big(\\tfrac{a}{b}\\big)^k=\\tfrac{a^k}{b^k}$ (e.g. $(3/5)^2=9/25$): so $\\Big(\\dfrac{\\lambda}{n}\\Big)^k=\\dfrac{\\lambda^k}{n^k}$. The $\\lambda^k$ separates off, leaving an $n^k$ in the denominator.</li>
     <li>Reorder the factors (multiplication can be rearranged freely) and slide that $1/n^k$ next to $\\binom{n}{k}$. Now the formula is three clean groups:
         $\\;\\underbrace{\\dfrac{\\binom{n}{k}}{n^k}}_{\\text{piece 1}}\\;\\cdot\\;\\underbrace{\\lambda^k}_{\\text{piece 2}}\\;\\cdot\\;\\underbrace{\\Big(1-\\dfrac{\\lambda}{n}\\Big)^{n-k}}_{\\text{piece 3}}$. So the "pieces" are just the one Binomial formula, regrouped — nothing new was invented.</li>
     <li>We split it this exact way on purpose: each group has a clean limit as $n\\to\\infty$ (the next three steps).</li>
     <li><b>Piece 1 $\\to \\frac{1}{k!}$.</b> Write $\\dfrac{\\binom{n}{k}}{n^k}=\\dfrac{n(n-1)\\cdots(n-k+1)}{k!\\,n^k}$. The top is $k$ factors, each $\\approx n$ when $n$ is huge, so the top $\\approx n^k$ and cancels the $n^k$ below — leaving $\\dfrac{1}{k!}$.</li>
     <li><b>Piece 2 $=\\lambda^k$.</b> It carries through unchanged.</li>
     <li><b>Piece 3 $\\to e^{-\\lambda}$.</b> Use the famous limit $\\big(1+\\tfrac{x}{n}\\big)^n\\to e^{x}$ with $x=-\\lambda$: so $\\big(1-\\tfrac{\\lambda}{n}\\big)^n\\to e^{-\\lambda}$ (and the leftover $\\big(1-\\tfrac{\\lambda}{n}\\big)^{-k}\\to 1$, since $\\lambda/n\\to 0$).</li>
     <li>Multiply the three limits: $\\dfrac{1}{k!}\\cdot\\lambda^k\\cdot e^{-\\lambda}=\\dfrac{\\lambda^k e^{-\\lambda}}{k!}$ — the Poisson PMF. ∎</li>
   </ul>
   <p>Reading the result: $\\lambda^k$ asks for $k$ events, $e^{-\\lambda}$ is the "and nothing else happened" factor, and $\\div\\,k!$ removes the orderings of the $k$ identical events (the same $r!$ idea from combinations).</p>
   <p><b>Why $e$ shows up here.</b> $e\\approx 2.718$ is not chosen — it is forced. It is the number you always get from multiplying many tiny factors, defined by the limit $\\big(1+\\tfrac{x}{n}\\big)^n\\to e^{x}$.</p>
   <ul class="steps">
     <li>One tiny slot is <i>empty</i> (no event) with chance $1-\\tfrac{\\lambda}{n}$.</li>
     <li>The $n$ slots are independent, so the chance <i>all</i> of them are empty is the product $\\big(1-\\tfrac{\\lambda}{n}\\big)^n$.</li>
     <li>That is exactly the limit form with $x=-\\lambda$, so it collapses to $e^{-\\lambda}$ — the chance of seeing zero events.</li>
   </ul>
   <p>It is the same math as compound interest: $\\$1$ at $100\\%$ interest compounded $n$ times is $\\big(1+\\tfrac{1}{n}\\big)^n$ — once gives $\\$2$, monthly gives $\\$2.61$, infinitely often marches to $\\$2.718=e$. Pile up infinitely many tiny multiplications and $e$ is what they always converge to.</p>
   <p><b>Intuition.</b> Poisson is "Binomial with so many trials, each so unlikely, that you stop tracking trials and just track the average rate $\\lambda$". Its mean is therefore $\\lambda$, inherited straight from $np$.</p>`,

/* ---------------------------------------------------------------- */
"prob-pdf-cdf":
  `<p>The PDF and CDF are definitions, but each rule on the slide is <b>forced</b>. Let us see why.</p>
   <p><b>Why a single exact value has probability 0.</b> A continuous variable has infinitely many possible values. If even one had a positive chance $c$, then enough of them would add past 1 and break the normalization axiom. The only consistent choice is that each exact point carries chance 0 — and probability lives in <i>ranges</i> (areas) instead.</p>
   <p><b>Why total area must be 1.</b> "Some value happens" is certain. The area under the whole density is the chance of landing somewhere. Certainty is probability 1, so $\\int_{-\\infty}^{\\infty} f_X(x)\\,dx = 1$. This is just the normalization axiom written with an integral instead of a sum.</p>
   <p><b>Why the CDF is built as a running area.</b></p>
   <ul class="steps">
     <li>$F_X(x)$ is defined as $P(X \\le x)$ — the chance of landing at or below $x$.</li>
     <li>"At or below $x$" is the whole region to the left of $x$. Its probability is the area there: $\\int_{-\\infty}^{x} f_X(t)\\,dt$.</li>
     <li>As $x$ slides right, you sweep in more area, so $F_X$ only ever climbs — from $0$ at the far left to $1$ at the far right.</li>
   </ul>
   <p><b>The slice rule follows.</b> The chance $X$ lands in $[a,b]$ is the area over that slice. Take the area up to $b$ and subtract the area up to $a$: $P(a \\le X \\le b) = F_X(b) - F_X(a)$.</p>
   <p><b>Intuition.</b> The PDF is how the probability is <i>spread</i> (thick where the curve is tall). The CDF is the total poured in so far as you fill from the left. Density is the rate; the CDF is the running total. They are derivative and integral of each other.</p>`,

/* ---------------------------------------------------------------- */
"prob-uniform-exponential":
  `<p><b>Deriving the Uniform.</b> "Every value in $[a,b]$ equally likely" means the density is a flat constant, call it $h$.</p>
   <ul class="steps">
     <li>The area under a flat line is width times height: $(b-a)\\,h$.</li>
     <li>Total area must be 1, so $(b-a)\\,h = 1$, giving $h = \\dfrac{1}{b-a}$. That is the only height that works. ∎</li>
     <li>The mean is the balance point of a flat slab — its middle: $E[X] = \\dfrac{a+b}{2}$.</li>
   </ul>
   <p><b>Deriving the Exponential shape.</b> Events arrive at a steady rate $\\lambda$ with no memory. "No memory" forces the form.</p>
   <ul class="steps">
     <li>Let $S(t) = P(\\text{wait} > t)$ be the chance you're still waiting after time $t$.</li>
     <li>Memorylessness: having already waited $s$, the chance of waiting $t$ more is the same as a fresh start. So $S(s+t) = S(s)\\,S(t)$.</li>
     <li>The only smooth function with "add inputs $\\Rightarrow$ multiply outputs" is an exponential: $S(t) = e^{-\\lambda t}$ (it starts at $S(0)=1$ and decays).</li>
     <li>The density is how fast that survival drops: $f(t) = \\lambda e^{-\\lambda t}$. Short waits are common, long waits rare. ∎</li>
   </ul>
   <p><b>Why mean $=1/\\lambda$.</b> If events come at rate $\\lambda$ per unit time (say $\\lambda$ per minute), the average gap between them is $1/\\lambda$ minutes. Faster rate, shorter wait.</p>
   <p><b>Intuition for memoryless.</b> The exponential "forgets" how long you've waited. A bus that arrives memorylessly is just as far away after you've stood there 10 minutes as when you arrived. Only the exponential does this.</p>`,

/* ---------------------------------------------------------------- */
"prob-normal":
  `<p>We won't compute the famous Gaussian integral, but every piece of the formula has a reason. Let us read it part by part, then explain the bell and the 68-95-99.7 rule.</p>
   <p><b>Reading $f(x) = \\dfrac{1}{\\sqrt{2\\pi}\\,\\sigma}\\, e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$ piece by piece.</b></p>
   <ul class="steps">
     <li>$\\dfrac{x-\\mu}{\\sigma}$ — the distance from the center $\\mu$, measured in standard-deviation units. Call it the "z-score". It is $0$ at the peak.</li>
     <li>Square it: $\\left(\\frac{x-\\mu}{\\sigma}\\right)^2$. Now both sides of $\\mu$ behave the same — that is why the bell is <b>symmetric</b>.</li>
     <li>Put a minus and an $e$ in front: $e^{-\\frac{1}{2}(\\dots)}$. As you move away from $\\mu$, the exponent grows negative <i>fast</i>, so the height crashes toward 0. That fast fall-off is why extreme values are rare and the tails are thin.</li>
     <li>The front factor $\\dfrac{1}{\\sqrt{2\\pi}\\,\\sigma}$ is just a scaler chosen so the total area is exactly 1. (Pinning that constant is the one part that needs the Gaussian integral — take it on faith.)</li>
   </ul>
   <p><b>Why the bell shape.</b> Tallest at the center because the exponent is 0 there ($e^0=1$). Symmetric because only the squared distance matters. Thin tails because $e^{-x^2/2}$ shrinks faster than any straight or polynomial drop. That is the whole silhouette.</p>
   <p><b>Why the mean is $\\mu$ and the variance is $\\sigma^2$.</b> The two parameters in the formula are not <i>named</i> mean and spread by decree — they really come out that way.</p>
   <ul class="steps">
     <li>Mean: $E[X]=\\int x\\,f(x)\\,dx$ averages $x$ weighted by the curve. But the curve is perfectly symmetric about $\\mu$ (only $(x-\\mu)^2$ appears, so $x=\\mu+d$ and $x=\\mu-d$ have equal height). Every bit of weight at $\\mu+d$ is matched by equal weight at $\\mu-d$; the two pull on the average equally and opposite, so they balance at $\\mu$. Hence $E[X]=\\mu$. ∎</li>
     <li>Variance: substitute $z=\\dfrac{x-\\mu}{\\sigma}$, so $x-\\mu=\\sigma z$. Then $\\operatorname{Var}(X)=E[(x-\\mu)^2]=\\sigma^2\\,E[z^2]$, pulling the constant $\\sigma^2$ out. The leftover $E[z^2]$ is the variance of the <i>standard</i> bell ($\\mu=0,\\sigma=1$), which is exactly $1$ (a known fact, the same Gaussian-integral computation we took on faith). So $\\operatorname{Var}(X)=\\sigma^2\\cdot 1=\\sigma^2$. ∎</li>
   </ul>
   <p>So the symbol $\\sigma$ in the formula is genuinely the standard deviation, and $\\mu$ genuinely the mean — the labels are earned, not assumed.</p>
   <p><b>The 68-95-99.7 rule is area.</b> Probability is area under this curve. Integrate from $\\mu-\\sigma$ to $\\mu+\\sigma$ and you capture about $68\\%$ of the area; out to $2\\sigma$, about $95\\%$; out to $3\\sigma$, about $99.7\\%$. These are fixed areas of the standard bell — the same for every Normal once you measure distance in $\\sigma$ units.</p>
   <p><b>Why it's everywhere (CLT preview).</b> Add up many small independent random nudges and the total's shape is forced toward this bell — regardless of where each nudge came from. That universality (the Central Limit Theorem) is why the Normal is the default for noise and errors.</p>`,

/* ---------------------------------------------------------------- */
"prob-joint-marginal":
  `<p>The marginal rule "sum out the other variable" is a <b>theorem</b>, not a guess. Here is why it's true.</p>
   <p><b>Derivation of $p_X(x) = \\sum_y p_{X,Y}(x,y)$.</b></p>
   <ul class="steps">
     <li>Fix a value $x$. The event "$X = x$" doesn't care what $Y$ is — $Y$ can be anything.</li>
     <li>Split "$X = x$" by the value of $Y$: it happens as "$X=x$ and $Y=y_1$", OR "$X=x$ and $Y=y_2$", OR ... one piece per value of $Y$.</li>
     <li>These pieces are disjoint (different $y$'s can't both happen at once) and cover every way $X=x$ can occur.</li>
     <li>By additivity, add their chances: $P(X=x) = \\sum_y P(X=x,\\,Y=y) = \\sum_y p_{X,Y}(x,y)$. ∎</li>
   </ul>
   <p><b>Why it's called "marginal".</b> Write the joint table with $X$ across rows, $Y$ down columns. Sum each row and the totals land in the <i>margin</i> of the table. Those margin numbers are the distribution of $X$ alone — hence "marginal".</p>
   <p><b>Intuition.</b> To learn about $X$ while ignoring $Y$, gather up every column and pile them onto $X$. You're not throwing probability away — you're collapsing the table in one direction. $Y$ disappears; its weight gets folded into $X$.</p>
   <p><b>Continuous version.</b> Same idea, but "add over all $y$" becomes "integrate over all $y$": $f_X(x) = \\int f_{X,Y}(x,y)\\,dy$. Sum and integral are the discrete and smooth versions of the same collapsing move.</p>`,

/* ---------------------------------------------------------------- */
"prob-covariance-correlation":
  `<p>Two things: <b>derive</b> the covariance shortcut, and explain why correlation is trapped in $[-1,1]$.</p>
   <p><b>Deriving $\\operatorname{Cov}(X,Y) = E[XY] - E[X]E[Y]$.</b> Covariance is defined as $E[(X-\\mu_X)(Y-\\mu_Y)]$, where $\\mu_X=E[X]$ and $\\mu_Y=E[Y]$ are fixed numbers.</p>
   <ul class="steps">
     <li>Multiply out the bracket: $(X-\\mu_X)(Y-\\mu_Y) = XY - \\mu_X Y - \\mu_Y X + \\mu_X\\mu_Y$.</li>
     <li>Take the expectation of each piece (expectation splits across sums): $E[XY] - \\mu_X E[Y] - \\mu_Y E[X] + \\mu_X\\mu_Y$.</li>
     <li>Now $E[Y]=\\mu_Y$ and $E[X]=\\mu_X$, so the middle two are $-\\mu_X\\mu_Y - \\mu_Y\\mu_X = -2\\mu_X\\mu_Y$, and the last is $+\\mu_X\\mu_Y$.</li>
     <li>Combine: $E[XY] - 2\\mu_X\\mu_Y + \\mu_X\\mu_Y = E[XY] - \\mu_X\\mu_Y = E[XY] - E[X]E[Y]$. ∎</li>
   </ul>
   <p>(Notice this is the exact same expand-and-collapse trick as the variance shortcut. In fact $\\operatorname{Cov}(X,X)=E[X^2]-(E[X])^2=\\operatorname{Var}(X)$.)</p>
   <p><b>Why $\\rho = \\dfrac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\sigma_Y}$ lives in $[-1,1]$.</b> This is the <b>Cauchy–Schwarz</b> bound. The intuition without heavy algebra:</p>
   <ul class="steps">
     <li>Think of the centered variables $X-\\mu_X$ and $Y-\\mu_Y$ as "vectors". Covariance acts like their dot product; $\\sigma_X$ and $\\sigma_Y$ act like their lengths.</li>
     <li>For real vectors, a dot product can never beat the product of the lengths: $|\\text{dot}| \\le \\text{length}\\times\\text{length}$. That is Cauchy–Schwarz.</li>
     <li>So $|\\operatorname{Cov}(X,Y)| \\le \\sigma_X\\sigma_Y$. Divide both sides by $\\sigma_X\\sigma_Y$: $|\\rho| \\le 1$. ∎</li>
     <li>Equality ($\\rho = \\pm 1$) happens only when the two vectors point the same or opposite way — i.e. $Y$ is an exact straight-line function of $X$.</li>
   </ul>
   <p><b>Intuition.</b> Dividing by both spreads strips out the units, so $\\rho$ measures only <i>direction of agreement</i>: $+1$ perfectly up-together, $-1$ perfectly opposite, $0$ no straight-line link. The lengths can never let the agreement exceed perfect, which is why it caps at $1$.</p>`,

/* ---------------------------------------------------------------- */
"prob-conditional-expectation":
  `<p>The law of iterated expectations, $E\\big[E[X\\mid Y]\\big]=E[X]$, looks abstract but is just total probability for averages. Let us <b>derive</b> it.</p>
   <p><b>Setup.</b> $E[X\\mid Y{=}y]$ is the average of $X$ inside the group where $Y=y$. The outer $E[\\cdot]$ averages those group-averages, weighting group $y$ by how common it is, $P(Y{=}y)$.</p>
   <p><b>Derivation (discrete case).</b></p>
   <ul class="steps">
     <li>Outer average: $E\\big[E[X\\mid Y]\\big] = \\sum_y P(Y{=}y)\\,E[X\\mid Y{=}y]$.</li>
     <li>Write each group-average out: $E[X\\mid Y{=}y] = \\sum_x x\\,P(X{=}x\\mid Y{=}y)$.</li>
     <li>Substitute and pull the weight inside: $\\sum_y \\sum_x x\\,P(Y{=}y)\\,P(X{=}x\\mid Y{=}y)$.</li>
     <li>By the multiplication rule, $P(Y{=}y)\\,P(X{=}x\\mid Y{=}y) = P(X{=}x,\\,Y{=}y)$.</li>
     <li>So it's $\\sum_x x \\sum_y P(X{=}x,\\,Y{=}y) = \\sum_x x\\,P(X{=}x) = E[X]$. (The inner sum over $y$ is the marginal — total probability again.) ∎</li>
   </ul>
   <p><b>Intuition.</b> Average each group, then average the groups (weighted by size). That two-stage average lands on the same grand average as doing it all at once — because every data point gets the same total weight either way. It is "total probability" wearing an averaging hat.</p>
   <p><b>Why ML cares.</b> A regression literally targets $E[Y\\mid X]$, the best guess of the output given the inputs. This law says those per-input guesses, averaged over all inputs, reproduce the overall average $E[Y]$ — a consistency every good predictor must satisfy.</p>`,

/* ---------------------------------------------------------------- */
"prob-inequalities":
  `<p>Both inequalities are <b>provable</b> from the definition of expectation. Markov first; Chebyshev falls out of Markov in one move.</p>
   <p><b>Proving Markov: $P(X \\ge a) \\le \\dfrac{E[X]}{a}$ for $X \\ge 0$ and $a > 0$.</b></p>
   <ul class="steps">
     <li>$E[X] = \\sum_x x\\,p_X(x)$, and since $X\\ge 0$ every term is $\\ge 0$. Dropping terms only shrinks the total.</li>
     <li>Keep only the values $x \\ge a$: $\\;E[X] \\ge \\sum_{x \\ge a} x\\,p_X(x)$.</li>
     <li>In that kept piece every $x$ is at least $a$, so replace each $x$ by the smaller $a$: $\\;\\sum_{x \\ge a} x\\,p_X(x) \\ge a\\sum_{x \\ge a} p_X(x)$.</li>
     <li>The remaining sum is exactly $P(X \\ge a)$. So $E[X] \\ge a\\,P(X \\ge a)$.</li>
     <li>Divide by $a$: $\\;P(X \\ge a) \\le \\dfrac{E[X]}{a}$. ∎</li>
   </ul>
   <p><b>Deriving Chebyshev from Markov.</b> Apply Markov to a cleverly chosen nonnegative variable.</p>
   <ul class="steps">
     <li>Let $D = (X-\\mu)^2$. It is nonnegative (a square), so Markov applies to it.</li>
     <li>Note "$|X-\\mu| \\ge \\epsilon$" is the same event as "$(X-\\mu)^2 \\ge \\epsilon^2$" (squaring both sides, both positive).</li>
     <li>Markov on $D$ with threshold $\\epsilon^2$: $\\;P(D \\ge \\epsilon^2) \\le \\dfrac{E[D]}{\\epsilon^2}$.</li>
     <li>But $E[D] = E[(X-\\mu)^2] = \\operatorname{Var}(X) = \\sigma^2$. Substitute: $\\;P(|X-\\mu| \\ge \\epsilon) \\le \\dfrac{\\sigma^2}{\\epsilon^2}$. ∎</li>
   </ul>
   <p><b>Intuition.</b> Markov: a nonnegative thing with a small average can't often be huge — there isn't enough "average" to fund many big values. Chebyshev: feed the squared distance into Markov, and you bound how often a variable strays far from its mean using only its variance.</p>`,

/* ---------------------------------------------------------------- */
"prob-lln":
  `<p>The Law of Large Numbers is not magic — Chebyshev <b>proves</b> a version of it in a few lines. The key is that the sample mean's variance shrinks like $\\sigma^2/n$.</p>
   <p><b>Step 1 — the sample mean's mean and variance.</b> Let $\\overline{X} = \\frac{1}{n}\\sum_{i=1}^n X_i$, with each $X_i$ independent, mean $\\mu$, variance $\\sigma^2$.</p>
   <ul class="steps">
     <li>Mean: by linearity, $E[\\overline{X}] = \\frac{1}{n}\\sum E[X_i] = \\frac{1}{n}(n\\mu) = \\mu$. The average is centered on the truth.</li>
     <li>Variance: for independent variables, variances add, and a constant factor $\\frac{1}{n}$ pulls out squared. So $\\operatorname{Var}(\\overline{X}) = \\frac{1}{n^2}\\sum \\operatorname{Var}(X_i) = \\frac{1}{n^2}(n\\sigma^2) = \\dfrac{\\sigma^2}{n}$.</li>
   </ul>
   <p><b>Step 2 — apply Chebyshev to $\\overline{X}$.</b></p>
   <ul class="steps">
     <li>Chebyshev: $P(|\\overline{X} - \\mu| \\ge \\epsilon) \\le \\dfrac{\\operatorname{Var}(\\overline{X})}{\\epsilon^2} = \\dfrac{\\sigma^2}{n\\,\\epsilon^2}$.</li>
     <li>Now let $n \\to \\infty$. The right side $\\dfrac{\\sigma^2}{n\\epsilon^2} \\to 0$ for any fixed gap $\\epsilon$.</li>
     <li>So the chance that $\\overline{X}$ is even $\\epsilon$ away from $\\mu$ goes to 0. The average is squeezed onto $\\mu$. ∎</li>
   </ul>
   <p><b>Intuition.</b> Each new sample's noise is independent. Independent noise partly cancels when you add it up. The variance of the average shrinks like $1/n$, so the bell around $\\mu$ keeps getting narrower until $\\overline{X}$ has nowhere to be but right at $\\mu$.</p>`,

/* ---------------------------------------------------------------- */
"prob-clt":
  `<p>The CLT says the sample average $\\overline{X}$ is approximately $\\mathcal{N}(\\mu,\\,\\sigma^2/n)$. We won't prove the bell shape (that needs heavy machinery), but we <b>can derive the center and the width</b>, and give the intuition for the shape.</p>
   <p><b>Deriving the center and the variance $\\sigma^2/n$.</b> Same two facts the LLN used.</p>
   <ul class="steps">
     <li>Center: $E[\\overline{X}] = \\frac{1}{n}\\sum E[X_i] = \\frac{1}{n}(n\\mu) = \\mu$. The bell sits on the true mean.</li>
     <li>Width: independent variances add, and the $\\frac{1}{n}$ comes out squared, so $\\operatorname{Var}(\\overline{X}) = \\frac{1}{n^2}(n\\sigma^2) = \\dfrac{\\sigma^2}{n}$.</li>
     <li>So the spread is $\\sigma_{\\overline{X}} = \\dfrac{\\sigma}{\\sqrt{n}}$: quadruple the data, halve the wobble. ∎</li>
   </ul>
   <p><b>Why the shape becomes Normal.</b> The deep part — but the picture is graspable:</p>
   <ul class="steps">
     <li>A sum of many <i>small, independent</i> contributions is a tug-of-war. Each sample pulls the total a little up or down.</li>
     <li>For the total to land far out, almost all the little tugs must agree in the same direction — that's very unlikely, so extremes are rare (thin tails).</li>
     <li>Middling totals can happen in a huge number of ways (some up, some down, mostly cancelling) — so the middle is fat. Fat middle, thin symmetric tails — that is the bell.</li>
     <li>Crucially, this happens no matter what each $X_i$ looked like (flat, skewed, lumpy). The individual shapes wash out. Only $\\mu$ and $\\sigma$ survive.</li>
   </ul>
   <p><b>Intuition.</b> Many small independent wiggles average into a bell. The LLN told you <i>where</i> $\\overline{X}$ lands ($\\mu$); the CLT tells you the <i>shape and width</i> of its wobble — Normal, narrowing like $1/\\sqrt{n}$.</p>`,

/* ---------------------------------------------------------------- */
"prob-estimation":
  `<p>The interesting part here is the $n-1$ in the sample variance — <b>Bessel's correction</b>. Let us see exactly why dividing by $n$ would be wrong, and why $n-1$ fixes it.</p>
   <p><b>Why the sample mean is unbiased (quick).</b> $E[\\overline{X}] = \\frac{1}{n}\\sum E[X_i] = \\frac{1}{n}(n\\mu) = \\mu$. On average it hits $\\mu$. No correction needed.</p>
   <p><b>The trap in the sample variance.</b> The true variance measures spread around the <i>true</i> mean $\\mu$. But you don't know $\\mu$ — you use $\\overline{X}$ instead.</p>
   <ul class="steps">
     <li>$\\overline{X}$ is computed <i>from the same data</i>. So it sits right in the middle of your sample — it hugs the data points.</li>
     <li>The data is always at least as close to its own center $\\overline{X}$ as to the fixed true $\\mu$. (Pulling the center to fit the data makes the squared distances as small as possible.)</li>
     <li>So $\\sum (X_i - \\overline{X})^2$ is <i>systematically smaller</i> than $\\sum (X_i - \\mu)^2$ would be. Dividing by $n$ then <b>underestimates</b> the true variance, every time. That's a bias.</li>
   </ul>
   <p><b>Why $n-1$ is the exact fix.</b></p>
   <ul class="steps">
     <li>Fitting the mean from the data "uses up" one piece of information — one <b>degree of freedom</b>. Once you know $\\overline{X}$ and $n-1$ of the points, the last point is forced (the deviations must sum to zero).</li>
     <li>So only $n-1$ of the squared deviations are truly free to vary. The honest average divides by that count, $n-1$, not $n$.</li>
     <li>The algebra works out exactly: $E\\!\\left[\\dfrac{1}{n-1}\\sum (X_i-\\overline{X})^2\\right] = \\sigma^2$. Dividing by $n-1$ makes $s^2$ unbiased. ∎</li>
   </ul>
   <p><b>Intuition.</b> Measuring spread from the sample's own center cheats slightly — the center was chosen to sit as close to the points as possible. That makes deviations look too small. Dividing by the smaller $n-1$ instead of $n$ nudges the estimate back up by exactly the right amount.</p>`

});
})();
