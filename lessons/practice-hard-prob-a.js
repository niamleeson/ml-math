/* =====================================================================
   PRACTICE PROBLEMS — MODULE 1 (Probability), HARDER set.
   Appended on top of practice-01-probability-a.js via add().
   Same formulas/notation as lessons/01-probability.js.
   Increasing difficulty: multi-stage Bayes, combined events,
   counting with partitions, binomial tails, variance of transforms.
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ---------------- prob-sample-space ---------------- */
  add("prob-sample-space", [
    { q:`<p>Roll two dice. Write the event $A$ = "the two faces differ by exactly 2". How many outcomes does it have?</p>`,
      steps:[
        {do:`List ordered pairs with $|d_1 - d_2| = 2$: $(1,3),(2,4),(3,5),(4,6)$ and their reverses $(3,1),(4,2),(5,3),(6,4)$.`, why:`Each unordered gap-2 pair appears in two orders.`},
        {do:`Count them: $4 + 4 = 8$ outcomes.`, why:`Four base pairs, each in two orders.`}
      ],
      answer:`$8$ outcomes` },

    { q:`<p>Three coins are tossed. Write the event $A$ = "more heads than tails". How many outcomes?</p>`,
      steps:[
        {do:`$\\Omega$ has $2^3 = 8$ outcomes. "More heads than tails" needs 2 or 3 heads.`, why:`With 3 coins, a majority of heads means at least 2.`},
        {do:`Two heads: $HHT, HTH, THH$ (3). Three heads: $HHH$ (1). Total $4$.`, why:`Count outcomes with 2 heads, then 3 heads.`}
      ],
      answer:`$4$ outcomes` },

    { q:`<p>Draw one card from 52. Let $A$ = "a heart", $B$ = "a face card (J,Q,K)". How many outcomes are in $A \\cap B$, and how many in $A \\cup B$?</p>`,
      steps:[
        {do:`$A$ has $13$, $B$ has $12$. Overlap $A \\cap B$ = heart face cards $= 3$.`, why:`Three face ranks in the heart suit.`},
        {do:`$|A \\cup B| = |A| + |B| - |A \\cap B| = 13 + 12 - 3 = 22$.`, why:`Inclusion-exclusion avoids double-counting the overlap.`}
      ],
      answer:`$|A \\cap B| = 3$, $|A \\cup B| = 22$` },

    { q:`<p>Roll two dice. Let $A$ = "sum is 8" and $B$ = "first die is even". List $A \\cap B$.</p>`,
      steps:[
        {do:`Sum 8: $(2,6),(3,5),(4,4),(5,3),(6,2)$.`, why:`All ordered pairs adding to 8.`},
        {do:`Keep those with an even first die: $(2,6),(4,4),(6,2)$.`, why:`First coordinate must be 2, 4, or 6.`}
      ],
      answer:`$A \\cap B = \\{(2,6),(4,4),(6,2)\\}$` },

    { q:`<p>A bit string of length 4 is generated (each position 0 or 1). Write the event $A$ = "the string reads the same forwards and backwards" (a palindrome). How many outcomes?</p>`,
      steps:[
        {do:`$\\Omega$ has $2^4 = 16$ strings. A length-4 palindrome needs position 1 = position 4 and position 2 = position 3.`, why:`Reversing must give the same string.`},
        {do:`Free choices are positions 1 and 2: $2 \\times 2 = 4$ palindromes (the last two mirror them).`, why:`Once the first half is fixed, the second half is forced.`}
      ],
      answer:`$4$ palindromes` },

    { q:`<p>Roll three dice. How many outcomes are in the event $A$ = "all three faces are different"?</p>`,
      steps:[
        {do:`Total $\\Omega = 6^3 = 216$. For all different: first die 6 choices, second $5$, third $4$.`, why:`Each later die must avoid the earlier faces.`},
        {do:`$6 \\times 5 \\times 4 = 120$ outcomes.`, why:`Multiply the shrinking choices.`}
      ],
      answer:`$120$ outcomes` }
  ]);

  /* ---------------- prob-axioms ---------------- */
  add("prob-axioms", [
    { q:`<p>$P(A) = 0.6$, $P(B) = 0.5$, $P(A \\cup B) = 0.8$. Find $P(A \\cap B)$.</p>`,
      steps:[
        {do:`Inclusion-exclusion: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.`, why:`The overlap is counted once too often, so subtract it.`},
        {do:`$0.8 = 0.6 + 0.5 - P(A \\cap B) = 1.1 - P(A \\cap B)$.`, why:`Plug in the known values.`},
        {do:`$P(A \\cap B) = 1.1 - 0.8 = 0.3$.`, why:`Solve for the overlap.`}
      ],
      answer:`$P(A \\cap B) = 0.3$` },

    { q:`<p>$P(A) = 0.7$ and $P(B) = 0.6$. What is the smallest possible value of $P(A \\cap B)$?</p>`,
      steps:[
        {do:`$P(A \\cup B) \\le 1$, and $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.`, why:`No probability can exceed 1.`},
        {do:`$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) \\ge 0.7 + 0.6 - 1 = 0.3$.`, why:`The overlap is smallest when the union is as large as possible.`}
      ],
      answer:`$P(A \\cap B) \\ge 0.3$` },

    { q:`<p>$P(A) = 0.5$, $P(B) = 0.4$, and $A, B$ are disjoint. Find $P(A^c \\cap B^c)$ (neither happens).</p>`,
      steps:[
        {do:`Disjoint, so $P(A \\cup B) = 0.5 + 0.4 = 0.9$.`, why:`No overlap means probabilities add directly.`},
        {do:`"Neither" is the complement of "at least one": $P(A^c \\cap B^c) = 1 - P(A \\cup B)$.`, why:`De Morgan: not-A and not-B equals not (A or B).`},
        {do:`$= 1 - 0.9 = 0.1$.`, why:`Subtract from 1.`}
      ],
      answer:`$0.1$` },

    { q:`<p>In a group, $P(\\text{coffee}) = 0.6$, $P(\\text{tea}) = 0.4$, $P(\\text{both}) = 0.2$. Find $P(\\text{exactly one of the two})$.</p>`,
      steps:[
        {do:`$P(\\text{at least one}) = 0.6 + 0.4 - 0.2 = 0.8$.`, why:`Inclusion-exclusion for the union.`},
        {do:`Exactly one = at least one minus both: $0.8 - 0.2 = 0.6$.`, why:`Remove the "both" part, which is counted in "at least one".`}
      ],
      answer:`$0.6$` },

    { q:`<p>Three events $A, B, C$ are pairwise disjoint with $P(A) = 0.2$, $P(B) = 0.3$, $P(C) = 0.4$. Find $P((A \\cup B \\cup C)^c)$.</p>`,
      steps:[
        {do:`Disjoint, so $P(A \\cup B \\cup C) = 0.2 + 0.3 + 0.4 = 0.9$.`, why:`Additivity extends to several disjoint events.`},
        {do:`Complement: $1 - 0.9 = 0.1$.`, why:`The chance none of the three happen.`}
      ],
      answer:`$0.1$` },

    { q:`<p>Draw one card from 52. Let $A$ = "a king" and $B$ = "a heart". Find $P(A \\cup B)$.</p>`,
      steps:[
        {do:`$P(A) = \\frac{4}{52}$, $P(B) = \\frac{13}{52}$.`, why:`Four kings, thirteen hearts.`},
        {do:`Overlap = king of hearts: $P(A \\cap B) = \\frac{1}{52}$.`, why:`One card is both a king and a heart.`},
        {do:`$P(A \\cup B) = \\frac{4}{52} + \\frac{13}{52} - \\frac{1}{52} = \\frac{16}{52} = \\frac{4}{13}$.`, why:`Inclusion-exclusion.`}
      ],
      answer:`$P(A \\cup B) = \\frac{4}{13}$` }
  ]);

  /* ---------------- prob-conditional ---------------- */
  add("prob-conditional", [
    { q:`<p>A box has 5 red and 3 blue balls. Draw three without replacement. Find $P(\\text{all three red})$ using the chain rule.</p>`,
      steps:[
        {do:`$P(\\text{1st red}) = \\frac{5}{8}$.`, why:`5 red of 8 balls.`},
        {do:`$P(\\text{2nd red} \\mid \\text{1st}) = \\frac{4}{7}$, $P(\\text{3rd red} \\mid \\text{first two}) = \\frac{3}{6}$.`, why:`Each red removed shrinks the counts.`},
        {do:`$\\frac{5}{8} \\times \\frac{4}{7} \\times \\frac{3}{6} = \\frac{60}{336} = \\frac{5}{28}$.`, why:`Multiply along the chain.`}
      ],
      answer:`$P(\\text{all red}) = \\frac{5}{28}$` },

    { q:`<p>Roll two dice. Given the sum is even, what is the chance the sum is 8?</p>`,
      steps:[
        {do:`Even sums occur on $18$ of the $36$ outcomes ($3\\cdot3$ even+even plus $3\\cdot3$ odd+odd).`, why:`Even+even or odd+odd gives an even sum.`},
        {do:`Sum 8: $(2,6),(3,5),(4,4),(5,3),(6,2)$, that is 5 outcomes (all have even sum).`, why:`Count ordered pairs totaling 8.`},
        {do:`$P(8 \\mid \\text{even}) = \\frac{5}{18}$.`, why:`Favorable over the conditioned world.`}
      ],
      answer:`$\\frac{5}{18}$` },

    { q:`<p>A family has two children, at least one of whom is a boy (each child is a boy or girl with chance $\\frac{1}{2}$, independently). Find $P(\\text{both boys} \\mid \\text{at least one boy})$.</p>`,
      steps:[
        {do:`$\\Omega = \\{BB, BG, GB, GG\\}$ each $\\frac{1}{4}$. "At least one boy" = $\\{BB, BG, GB\\}$.`, why:`Drop $GG$; condition on the other three.`},
        {do:`Both boys is $\\{BB\\}$: 1 of the 3 equally likely outcomes.`, why:`Only $BB$ is favorable in the new world.`},
        {do:`$P = \\frac{1/4}{3/4} = \\frac{1}{3}$.`, why:`Joint over the condition.`}
      ],
      answer:`$\\frac{1}{3}$` },

    { q:`<p>$P(A) = 0.5$, $P(B) = 0.4$, $P(A \\cup B) = 0.7$. Find $P(A \\mid B)$.</p>`,
      steps:[
        {do:`$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 0.5 + 0.4 - 0.7 = 0.2$.`, why:`Inclusion-exclusion gives the overlap.`},
        {do:`$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0.2}{0.4} = 0.5$.`, why:`Definition of conditional probability.`}
      ],
      answer:`$P(A \\mid B) = 0.5$` },

    { q:`<p>A deck of 52 is dealt two cards without replacement. Given the first card is a heart, find $P(\\text{second is a heart})$.</p>`,
      steps:[
        {do:`One heart is gone: $12$ hearts remain among $51$ cards.`, why:`Removing the first heart changes both counts.`},
        {do:`$P(\\text{2nd heart} \\mid \\text{1st heart}) = \\frac{12}{51} = \\frac{4}{17}$.`, why:`Favorable hearts over remaining cards.`}
      ],
      answer:`$\\frac{4}{17}$` },

    { q:`<p>$40\\%$ of users are premium. Among premium users, $80\\%$ open the app daily; among free users, $30\\%$ do. Given a user opens the app daily, find $P(\\text{premium} \\mid \\text{daily})$.</p>`,
      steps:[
        {do:`$P(\\text{daily}) = 0.4 \\times 0.8 + 0.6 \\times 0.3 = 0.32 + 0.18 = 0.50$.`, why:`Total probability over premium and free.`},
        {do:`$P(\\text{premium} \\mid \\text{daily}) = \\frac{0.4 \\times 0.8}{0.50} = \\frac{0.32}{0.50} = 0.64$.`, why:`Conditional via the joint over the total.`}
      ],
      answer:`$0.64$` }
  ]);

  /* ---------------- prob-bayes ---------------- */
  add("prob-bayes", [
    { q:`<p>A disease affects $0.5\\%$ of people. A test has sensitivity $98\\%$ and false-positive rate $4\\%$. A person tests positive, then takes a SECOND independent test that is also positive. Find $P(\\text{sick} \\mid ++)$.</p>`,
      steps:[
        {do:`After test 1: $P(\\text{sick} \\mid +) = \\frac{0.98 \\times 0.005}{0.98 \\times 0.005 + 0.04 \\times 0.995} = \\frac{0.0049}{0.0049 + 0.0398} = \\frac{0.0049}{0.0447} \\approx 0.1096$.`, why:`Bayes once; this posterior becomes the new prior.`},
        {do:`Updated prior $\\approx 0.1096$, so $P(\\text{healthy}) \\approx 0.8904$.`, why:`Carry the first result forward.`},
        {do:`After test 2: $\\frac{0.98 \\times 0.1096}{0.98 \\times 0.1096 + 0.04 \\times 0.8904} = \\frac{0.1074}{0.1074 + 0.0356} = \\frac{0.1074}{0.1430} \\approx 0.751$.`, why:`Apply Bayes again with the updated prior.`}
      ],
      answer:`$P(\\text{sick} \\mid ++) \\approx 0.751$` },

    { q:`<p>Three machines A, B, C make $50\\%$, $30\\%$, $20\\%$ of items, with defect rates $1\\%$, $3\\%$, $5\\%$. An item is defective. Find $P(C \\mid \\text{defective})$.</p>`,
      steps:[
        {do:`$P(\\text{def}) = 0.5(0.01) + 0.3(0.03) + 0.2(0.05) = 0.005 + 0.009 + 0.010 = 0.024$.`, why:`Total probability over the three machines.`},
        {do:`$P(C \\mid \\text{def}) = \\frac{0.2 \\times 0.05}{0.024} = \\frac{0.010}{0.024} \\approx 0.417$.`, why:`Bayes' rule for machine C.`}
      ],
      answer:`$\\approx 0.417$` },

    { q:`<p>A bag is chosen at random: bag 1 (prob $\\frac{1}{2}$) has 3 red, 2 blue; bag 2 (prob $\\frac{1}{2}$) has 1 red, 4 blue. You draw two balls WITHOUT replacement from the chosen bag and both are red. Find $P(\\text{bag 1} \\mid \\text{two red})$.</p>`,
      steps:[
        {do:`$P(\\text{2 red} \\mid \\text{bag 1}) = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20} = 0.3$.`, why:`Chain rule inside bag 1.`},
        {do:`$P(\\text{2 red} \\mid \\text{bag 2}) = \\frac{1}{5} \\times \\frac{0}{4} = 0$.`, why:`Bag 2 has only one red, so two reds is impossible.`},
        {do:`$P(\\text{bag 1} \\mid \\text{2 red}) = \\frac{0.5 \\times 0.3}{0.5 \\times 0.3 + 0.5 \\times 0} = \\frac{0.15}{0.15} = 1$.`, why:`Only bag 1 can produce two reds, so it must be bag 1.`}
      ],
      answer:`$P(\\text{bag 1} \\mid \\text{2 red}) = 1$` },

    { q:`<p>Spam is $30\\%$ of email. The word "win" appears in $50\\%$ of spam and $5\\%$ of non-spam; "free" appears (independently given the class) in $40\\%$ of spam and $10\\%$ of non-spam. An email contains BOTH words. Find $P(\\text{spam} \\mid \\text{win, free})$.</p>`,
      steps:[
        {do:`Spam path: $0.30 \\times 0.50 \\times 0.40 = 0.060$.`, why:`Prior times the two likelihoods (conditionally independent).`},
        {do:`Non-spam path: $0.70 \\times 0.05 \\times 0.10 = 0.0035$.`, why:`Same for the non-spam class.`},
        {do:`$P(\\text{spam} \\mid \\text{both}) = \\frac{0.060}{0.060 + 0.0035} = \\frac{0.060}{0.0635} \\approx 0.945$.`, why:`Bayes: spam path over total evidence.`}
      ],
      answer:`$\\approx 0.945$` },

    { q:`<p>A test for a condition present in $10\\%$ of patients has sensitivity $95\\%$ and specificity $90\\%$ (so false-positive rate $10\\%$). Among patients who test NEGATIVE, what fraction are actually sick?</p>`,
      steps:[
        {do:`$P(-) = P(- \\mid \\text{sick})P(\\text{sick}) + P(- \\mid \\text{well})P(\\text{well}) = 0.05(0.10) + 0.90(0.90) = 0.005 + 0.810 = 0.815$.`, why:`Total probability of a negative test.`},
        {do:`$P(\\text{sick} \\mid -) = \\frac{0.05 \\times 0.10}{0.815} = \\frac{0.005}{0.815} \\approx 0.0061$.`, why:`Bayes' rule with the "miss" likelihood $P(- \\mid \\text{sick}) = 0.05$.`}
      ],
      answer:`$\\approx 0.0061$ (about $0.61\\%$)` },

    { q:`<p>A coin is fair with prior $\\frac{1}{2}$ or two-headed with prior $\\frac{1}{2}$. You flip the chosen coin 3 times and get 3 heads. Find $P(\\text{two-headed} \\mid HHH)$.</p>`,
      steps:[
        {do:`$P(HHH \\mid \\text{fair}) = (\\frac{1}{2})^3 = \\frac{1}{8}$, $P(HHH \\mid \\text{two-headed}) = 1$.`, why:`A two-headed coin always shows heads.`},
        {do:`$P(HHH) = \\frac{1}{2}\\cdot\\frac{1}{8} + \\frac{1}{2}\\cdot 1 = \\frac{1}{16} + \\frac{8}{16} = \\frac{9}{16}$.`, why:`Total probability of three heads.`},
        {do:`$P(\\text{two-headed} \\mid HHH) = \\frac{(1/2)(1)}{9/16} = \\frac{8/16}{9/16} = \\frac{8}{9}$.`, why:`Bayes' rule; the all-heads streak strongly favors the two-headed coin.`}
      ],
      answer:`$\\frac{8}{9}$` },

    { q:`<p>Continue the two-coin problem: prior $\\frac{1}{2}$ each (fair vs two-headed). After observing $HHH$ the posterior on two-headed is $\\frac{8}{9}$. Now you flip once more and get a TAIL. Find the updated $P(\\text{two-headed} \\mid HHHT)$.</p>`,
      steps:[
        {do:`A tail is impossible for a two-headed coin: $P(T \\mid \\text{two-headed}) = 0$.`, why:`Two-headed coins never show tails.`},
        {do:`The two-headed numerator becomes $\\frac{8}{9}\\times 0 = 0$, while fair gives $\\frac{1}{9}\\times\\frac{1}{2} &gt; 0$.`, why:`Bayes update with the new tail evidence.`},
        {do:`$P(\\text{two-headed} \\mid HHHT) = 0$.`, why:`A single tail rules out the two-headed coin entirely.`}
      ],
      answer:`$0$` }
  ]);

  /* ---------------- prob-total-prob ---------------- */
  add("prob-total-prob", [
    { q:`<p>An urn has 4 red and 6 blue balls. Draw two without replacement. Find $P(\\text{2nd is red})$ by conditioning on the first draw.</p>`,
      steps:[
        {do:`If 1st red ($P = \\frac{4}{10}$): $P(\\text{2nd red}) = \\frac{3}{9}$.`, why:`One red removed.`},
        {do:`If 1st blue ($P = \\frac{6}{10}$): $P(\\text{2nd red}) = \\frac{4}{9}$.`, why:`Reds untouched, total down by one.`},
        {do:`$P(\\text{2nd red}) = \\frac{4}{10}\\cdot\\frac{3}{9} + \\frac{6}{10}\\cdot\\frac{4}{9} = \\frac{12}{90} + \\frac{24}{90} = \\frac{36}{90} = \\frac{2}{5}$.`, why:`Total probability; it equals the first-draw chance, as symmetry predicts.`}
      ],
      answer:`$P(\\text{2nd red}) = \\frac{2}{5}$` },

    { q:`<p>Four suppliers ship $40\\%$, $30\\%$, $20\\%$, $10\\%$ of parts with defect rates $1\\%$, $2\\%$, $3\\%$, $8\\%$. Find the overall defect rate.</p>`,
      steps:[
        {do:`$0.40(0.01) + 0.30(0.02) = 0.004 + 0.006 = 0.010$.`, why:`First two suppliers.`},
        {do:`$0.20(0.03) + 0.10(0.08) = 0.006 + 0.008 = 0.014$.`, why:`Last two suppliers.`},
        {do:`$P(\\text{defect}) = 0.010 + 0.014 = 0.024$.`, why:`Sum over all four cases.`}
      ],
      answer:`$0.024$` },

    { q:`<p>A two-step process: with prob $0.6$ you take path X (success rate $0.9$); with prob $0.4$ path Y (success rate $0.5$). Find the overall chance of success.</p>`,
      steps:[
        {do:`Path X: $0.6 \\times 0.9 = 0.54$.`, why:`Weight success by path probability.`},
        {do:`Path Y: $0.4 \\times 0.5 = 0.20$.`, why:`Same for path Y.`},
        {do:`$P(\\text{success}) = 0.54 + 0.20 = 0.74$.`, why:`Total probability over the two paths.`}
      ],
      answer:`$0.74$` },

    { q:`<p>A gambler rolls once. He uses a fair die ($P = 0.5$) or a loaded die ($P = 0.5$) where $P(6) = 0.4$. Find $P(\\text{roll a 6})$.</p>`,
      steps:[
        {do:`Fair die: $0.5 \\times \\frac{1}{6} = \\frac{1}{12} \\approx 0.0833$.`, why:`Fair die has $P(6) = \\frac{1}{6}$.`},
        {do:`Loaded die: $0.5 \\times 0.4 = 0.20$.`, why:`Loaded die contribution.`},
        {do:`$P(6) = 0.0833 + 0.20 = 0.2833$.`, why:`Total probability over the two dice.`}
      ],
      answer:`$P(6) \\approx 0.2833$` },

    { q:`<p>Messages arrive as type A ($50\\%$), B ($30\\%$), C ($20\\%$). They are urgent with rates $10\\%$, $40\\%$, $70\\%$. Find $P(\\text{urgent})$.</p>`,
      steps:[
        {do:`$0.50(0.10) + 0.30(0.40) = 0.05 + 0.12 = 0.17$.`, why:`Types A and B contributions.`},
        {do:`$0.20(0.70) = 0.14$.`, why:`Type C contribution.`},
        {do:`$P(\\text{urgent}) = 0.17 + 0.14 = 0.31$.`, why:`Total probability over the three types.`}
      ],
      answer:`$P(\\text{urgent}) = 0.31$` },

    { q:`<p>A frog starts on a lily pad. With prob $0.5$ it stays (2 flies expected nearby) and with prob $0.5$ it jumps to another pad (5 flies expected). What is the expected number of flies it can reach? (Use $E[F] = \\sum_i P(\\text{pad}_i)\\,E[F \\mid \\text{pad}_i]$.)</p>`,
      steps:[
        {do:`Stay: $0.5 \\times 2 = 1$.`, why:`Weight the conditional expectation by the case probability.`},
        {do:`Jump: $0.5 \\times 5 = 2.5$.`, why:`Same for the jump case.`},
        {do:`$E[F] = 1 + 2.5 = 3.5$ flies.`, why:`Total expectation over the two cases.`}
      ],
      answer:`$E[F] = 3.5$ flies` }
  ]);

  /* ---------------- prob-independence ---------------- */
  add("prob-independence", [
    { q:`<p>A system has 3 independent components, each working with chance $0.9$. It works only if ALL three work. Find $P(\\text{system works})$.</p>`,
      steps:[
        {do:`Independent, so multiply: $0.9 \\times 0.9 \\times 0.9$.`, why:`Each component's state is independent of the others.`},
        {do:`$= 0.9^3 = 0.729$.`, why:`Joint chance all three work.`}
      ],
      answer:`$0.729$` },

    { q:`<p>A system works if AT LEAST ONE of 3 independent backups works; each works with chance $0.7$. Find $P(\\text{system works})$.</p>`,
      steps:[
        {do:`$P(\\text{all fail}) = 0.3^3 = 0.027$.`, why:`Each fails with chance $0.3$, independently.`},
        {do:`$P(\\text{at least one works}) = 1 - 0.027 = 0.973$.`, why:`Complement of "all fail".`}
      ],
      answer:`$0.973$` },

    { q:`<p>$A$ and $B$ are independent with $P(A) = 0.4$, $P(B) = 0.5$. Find $P(A \\cup B)$.</p>`,
      steps:[
        {do:`Independent: $P(A \\cap B) = 0.4 \\times 0.5 = 0.20$.`, why:`Multiply for independent events.`},
        {do:`$P(A \\cup B) = 0.4 + 0.5 - 0.20 = 0.70$.`, why:`Inclusion-exclusion.`}
      ],
      answer:`$P(A \\cup B) = 0.70$` },

    { q:`<p>$A$ and $B$ are independent with $P(A) = 0.6$, $P(B) = 0.3$. Find $P(A \\cap B^c)$ (A but not B).</p>`,
      steps:[
        {do:`If $A, B$ independent, so are $A, B^c$.`, why:`Knowing $A$ still says nothing about whether $B$ failed.`},
        {do:`$P(A \\cap B^c) = P(A)\\,P(B^c) = 0.6 \\times 0.7 = 0.42$.`, why:`$P(B^c) = 1 - 0.3 = 0.7$.`}
      ],
      answer:`$0.42$` },

    { q:`<p>A factory line has 4 independent stations, each passing a unit with chance $0.95$. A unit ships only if all stations pass. What is the chance a unit is rejected somewhere?</p>`,
      steps:[
        {do:`$P(\\text{all pass}) = 0.95^4 = 0.81450625$.`, why:`Independent stations, so multiply.`},
        {do:`$P(\\text{rejected}) = 1 - 0.8145 \\approx 0.1855$.`, why:`Complement of "all pass".`}
      ],
      answer:`$\\approx 0.1855$` },

    { q:`<p>Two fair coins; let $A$ = "1st heads", $B$ = "2nd heads", $C$ = "the two flips match". Check whether $C$ is independent of $A$, and whether $A, B, C$ are mutually independent.</p>`,
      steps:[
        {do:`$P(C) = P(\\{HH, TT\\}) = \\frac{2}{4} = \\frac{1}{2}$, $P(A) = \\frac{1}{2}$. $A \\cap C = \\{HH\\}$, so $P(A \\cap C) = \\frac{1}{4} = P(A)P(C)$.`, why:`Pairwise: $A$ and $C$ are independent.`},
        {do:`But $A \\cap B \\cap C = \\{HH\\}$, $P = \\frac{1}{4}$, while $P(A)P(B)P(C) = \\frac{1}{8}$.`, why:`The triple joint differs from the product.`},
        {do:`$\\frac{1}{4} \\ne \\frac{1}{8}$, so $A, B, C$ are NOT mutually independent.`, why:`Pairwise independence does not imply mutual independence.`}
      ],
      answer:`Pairwise independent, not mutually independent` }
  ]);

  /* ---------------- prob-counting ---------------- */
  add("prob-counting", [
    { q:`<p>How many distinct arrangements of the letters in MISSISSIPPI? (Letters: M(1), I(4), S(4), P(2), 11 total.)</p>`,
      steps:[
        {do:`Total permutations of 11 letters would be $11!$, but identical letters repeat.`, why:`Divide out the orderings of identical letters.`},
        {do:`$\\frac{11!}{1!\\,4!\\,4!\\,2!} = \\frac{39916800}{1 \\times 24 \\times 24 \\times 2} = \\frac{39916800}{1152} = 34650$.`, why:`Multinomial count.`}
      ],
      answer:`$34650$ arrangements` },

    { q:`<p>From 5 men and 4 women, a committee of 4 must have exactly 2 men and 2 women. How many committees?</p>`,
      steps:[
        {do:`Choose 2 men: $\\binom{5}{2} = 10$.`, why:`Unordered pick of men.`},
        {do:`Choose 2 women: $\\binom{4}{2} = 6$.`, why:`Unordered pick of women.`},
        {do:`Multiply: $10 \\times 6 = 60$.`, why:`Independent choices combine by multiplication.`}
      ],
      answer:`$60$ committees` },

    { q:`<p>A 5-card poker hand is dealt from 52. Find $P(\\text{exactly one pair})$ — two cards of one rank, the other three of three different ranks (no extra pair, no trips).</p>`,
      steps:[
        {do:`Pick the pair's rank $\\binom{13}{1} = 13$ and its two suits $\\binom{4}{2} = 6$: $13 \\times 6 = 78$.`, why:`Choose which rank pairs and which two suits.`},
        {do:`Pick 3 other distinct ranks $\\binom{12}{3} = 220$, each one suit $4^3 = 64$: favorable $= 78 \\times 220 \\times 64 = 1098240$.`, why:`Three side cards from different ranks, any suit.`},
        {do:`$P = \\frac{1098240}{\\binom{52}{5}} = \\frac{1098240}{2598960} \\approx 0.4226$.`, why:`Favorable over all 5-card hands.`}
      ],
      answer:`$\\approx 0.4226$` },

    { q:`<p>10 distinct books are split into a group of 3 and a group of 7. How many ways? Then how many ways to split 9 books into three labelled groups of 3?</p>`,
      steps:[
        {do:`$\\binom{10}{3} = 120$ (the other 7 are determined).`, why:`Choosing the group of 3 fixes the group of 7.`},
        {do:`Three labelled groups of 3 from 9: $\\binom{9}{3}\\binom{6}{3}\\binom{3}{3} = 84 \\times 20 \\times 1 = 1680$.`, why:`Choose each labelled group in turn.`}
      ],
      answer:`$120$; then $1680$` },

    { q:`<p>A 5-card hand from 52. Find $P(\\text{a flush})$ — all 5 cards the same suit (including straight flushes).</p>`,
      steps:[
        {do:`Choose the suit $\\binom{4}{1} = 4$, then 5 of its 13 cards $\\binom{13}{5} = 1287$: $4 \\times 1287 = 5148$.`, why:`Pick a suit, then any 5 of its cards.`},
        {do:`$P = \\frac{5148}{2598960} \\approx 0.00198$.`, why:`Favorable over $\\binom{52}{5}$.`}
      ],
      answer:`$\\approx 0.00198$` },

    { q:`<p>How many 4-digit codes (digits 0-9) are strictly increasing left to right (e.g. 1357)?</p>`,
      steps:[
        {do:`A strictly increasing sequence is determined by WHICH 4 digits are used; their order is forced.`, why:`Each set of 4 distinct digits has exactly one increasing arrangement.`},
        {do:`$\\binom{10}{4} = 210$.`, why:`Choose 4 of the 10 digits, order automatic.`}
      ],
      answer:`$210$ codes` }
  ]);

  /* ---------------- prob-random-variable ---------------- */
  add("prob-random-variable", [
    { q:`<p>Roll two dice, $X$ = the larger of the two faces (the maximum). Find $p_X(6)$.</p>`,
      steps:[
        {do:`$P(\\max = 6) = P(\\max \\le 6) - P(\\max \\le 5) = 1 - (\\frac{5}{6})^2$.`, why:`$\\max \\le 5$ means both dice are $\\le 5$.`},
        {do:`$= 1 - \\frac{25}{36} = \\frac{11}{36}$.`, why:`Difference of the cumulative chances.`}
      ],
      answer:`$p_X(6) = \\frac{11}{36}$` },

    { q:`<p>Roll two dice, $X$ = the minimum face. Find $p_X(2)$.</p>`,
      steps:[
        {do:`$P(\\min \\ge 2) = (\\frac{5}{6})^2 = \\frac{25}{36}$, $P(\\min \\ge 3) = (\\frac{4}{6})^2 = \\frac{16}{36}$.`, why:`$\\min \\ge k$ means both dice are $\\ge k$.`},
        {do:`$p_X(2) = P(\\min \\ge 2) - P(\\min \\ge 3) = \\frac{25}{36} - \\frac{16}{36} = \\frac{9}{36} = \\frac{1}{4}$.`, why:`Exactly 2 means at least 2 but not at least 3.`}
      ],
      answer:`$p_X(2) = \\frac{1}{4}$` },

    { q:`<p>A PMF is $p_X(k) = c\\,k$ for $k = 1, 2, 3, 4$. Find $c$, then $P(X \\ge 3)$.</p>`,
      steps:[
        {do:`Sum to 1: $c(1 + 2 + 3 + 4) = 10c = 1$, so $c = 0.1$.`, why:`Normalization rule.`},
        {do:`$P(X \\ge 3) = p_X(3) + p_X(4) = 0.1(3) + 0.1(4) = 0.3 + 0.4 = 0.7$.`, why:`Add the top two values.`}
      ],
      answer:`$c = 0.1$, $P(X \\ge 3) = 0.7$` },

    { q:`<p>Draw 2 balls without replacement from 3 red and 2 blue. Let $X$ = number of red drawn. Find the full PMF.</p>`,
      steps:[
        {do:`$p_X(0) = \\frac{\\binom{3}{0}\\binom{2}{2}}{\\binom{5}{2}} = \\frac{1}{10}$.`, why:`Both blue: hypergeometric count.`},
        {do:`$p_X(1) = \\frac{\\binom{3}{1}\\binom{2}{1}}{10} = \\frac{6}{10}$, $p_X(2) = \\frac{\\binom{3}{2}\\binom{2}{0}}{10} = \\frac{3}{10}$.`, why:`One red one blue, then two red.`},
        {do:`Check: $\\frac{1}{10} + \\frac{6}{10} + \\frac{3}{10} = 1$.`, why:`A valid PMF sums to 1.`}
      ],
      answer:`$p_X(0)=\\frac{1}{10}, p_X(1)=\\frac{6}{10}, p_X(2)=\\frac{3}{10}$` },

    { q:`<p>Flip a fair coin until the first head; let $X$ = number of flips. Find $P(X \\le 3)$.</p>`,
      steps:[
        {do:`$p_X(k) = (\\frac{1}{2})^{k-1}\\frac{1}{2} = (\\frac{1}{2})^k$.`, why:`$k-1$ tails then a head.`},
        {do:`$P(X \\le 3) = \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$.`, why:`Sum the first three values.`}
      ],
      answer:`$P(X \\le 3) = \\frac{7}{8}$` }
  ]);

  /* ---------------- prob-expectation ---------------- */
  add("prob-expectation", [
    { q:`<p>Roll two dice; let $M$ = the larger face. Its PMF is $p(k) = \\frac{2k-1}{36}$ for $k = 1,\\dots,6$. Find $E[M]$.</p>`,
      steps:[
        {do:`$E[M] = \\sum_{k=1}^{6} k\\,\\frac{2k-1}{36} = \\frac{1(1)+2(3)+3(5)+4(7)+5(9)+6(11)}{36}$.`, why:`Weight each max value by its PMF.`},
        {do:`$= \\frac{1+6+15+28+45+66}{36} = \\frac{161}{36} \\approx 4.472$.`, why:`Sum and divide.`}
      ],
      answer:`$E[M] = \\frac{161}{36} \\approx 4.472$` },

    { q:`<p>A game: roll a die; if it shows 6 you win \\$12, otherwise you lose \\$2. Find the expected net gain.</p>`,
      steps:[
        {do:`$P(6) = \\frac{1}{6}$, $P(\\text{not }6) = \\frac{5}{6}$.`, why:`Fair die.`},
        {do:`$E[\\text{gain}] = 12 \\times \\frac{1}{6} + (-2) \\times \\frac{5}{6} = 2 - \\frac{10}{6} = 2 - 1.667 = 0.333$.`, why:`Weighted average of the two payoffs.`}
      ],
      answer:`$E[\\text{gain}] \\approx \\$0.33$` },

    { q:`<p>Draw 3 cards from a deck. Let $X$ = number of aces. Use linearity of indicators $X = I_1 + I_2 + I_3$, where each card is an ace with chance $\\frac{4}{52}$. Find $E[X]$.</p>`,
      steps:[
        {do:`Each card is an ace with probability $\\frac{4}{52} = \\frac{1}{13}$, so $E[I_j] = \\frac{1}{13}$.`, why:`By symmetry every position is equally likely to be an ace.`},
        {do:`$E[X] = 3 \\times \\frac{1}{13} = \\frac{3}{13} \\approx 0.231$.`, why:`Linearity holds even though draws are dependent.`}
      ],
      answer:`$E[X] = \\frac{3}{13} \\approx 0.231$` },

    { q:`<p>10 people randomly take back one of the 10 hats (a random permutation). Let $X$ = number who get their OWN hat. Find $E[X]$.</p>`,
      steps:[
        {do:`Person $j$ gets their own hat with probability $\\frac{1}{10}$, so $E[I_j] = \\frac{1}{10}$.`, why:`Each hat is equally likely to land on each person.`},
        {do:`$E[X] = 10 \\times \\frac{1}{10} = 1$.`, why:`Linearity of expectation; the expected number of matches is always 1.`}
      ],
      answer:`$E[X] = 1$` },

    { q:`<p>$X$ takes values $-2, 0, 3$ with chances $0.3, 0.5, 0.2$. Find $E[X]$ and $E[X^2]$.</p>`,
      steps:[
        {do:`$E[X] = -2(0.3) + 0(0.5) + 3(0.2) = -0.6 + 0 + 0.6 = 0$.`, why:`Weighted average of the values.`},
        {do:`$E[X^2] = 4(0.3) + 0(0.5) + 9(0.2) = 1.2 + 1.8 = 3.0$.`, why:`Square first, then average.`}
      ],
      answer:`$E[X] = 0$, $E[X^2] = 3.0$` },

    { q:`<p>A factory's daily profit is \\$500 with chance $0.7$, \\$0 with chance $0.2$, and a \\$300 loss with chance $0.1$. Over 30 days, find the expected total profit.</p>`,
      steps:[
        {do:`Daily $E = 500(0.7) + 0(0.2) + (-300)(0.1) = 350 + 0 - 30 = 320$.`, why:`Expected profit per day.`},
        {do:`Over 30 days: $30 \\times 320 = 9600$.`, why:`Expectation scales with the number of days.`}
      ],
      answer:`$\\$9600$` }
  ]);

  /* ---------------- prob-variance ---------------- */
  add("prob-variance", [
    { q:`<p>$X$ takes values $-1, 0, 2$ with chances $0.5, 0.2, 0.3$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`$E[X] = -1(0.5) + 0(0.2) + 2(0.3) = -0.5 + 0.6 = 0.1$.`, why:`Weighted mean.`},
        {do:`$E[X^2] = 1(0.5) + 0(0.2) + 4(0.3) = 0.5 + 1.2 = 1.7$.`, why:`Average the squares.`},
        {do:`$\\operatorname{Var}(X) = 1.7 - 0.1^2 = 1.7 - 0.01 = 1.69$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 1.69$` },

    { q:`<p>$\\operatorname{Var}(X) = 5$. Find $\\operatorname{Var}(2X - 3)$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)$; the shift $b$ does not affect spread.`, why:`Adding a constant moves the center, not the spread.`},
        {do:`$2^2 \\times 5 = 4 \\times 5 = 20$.`, why:`Apply $a = 2$.`}
      ],
      answer:`$\\operatorname{Var}(2X - 3) = 20$` },

    { q:`<p>$X$ and $Y$ are independent with $\\operatorname{Var}(X) = 3$, $\\operatorname{Var}(Y) = 4$. Find $\\operatorname{Var}(X + Y)$ and $\\operatorname{Var}(X - Y)$.</p>`,
      steps:[
        {do:`For independent variables, variances add: $\\operatorname{Var}(X + Y) = 3 + 4 = 7$.`, why:`No covariance term when independent.`},
        {do:`$\\operatorname{Var}(X - Y) = \\operatorname{Var}(X) + (-1)^2\\operatorname{Var}(Y) = 3 + 4 = 7$.`, why:`The $-1$ gets squared, so subtraction also adds variances.`}
      ],
      answer:`Both equal $7$` },

    { q:`<p>A Binomial with $n = 20$, $p = 0.3$. Find its mean and variance.</p>`,
      steps:[
        {do:`Mean: $np = 20 \\times 0.3 = 6$.`, why:`Binomial mean.`},
        {do:`Variance: $np(1-p) = 20 \\times 0.3 \\times 0.7 = 4.2$.`, why:`Binomial variance.`}
      ],
      answer:`$E[X] = 6$, $\\operatorname{Var}(X) = 4.2$` },

    { q:`<p>Roll a fair die, $X$ = face. Find $\\operatorname{Var}(X)$ exactly, then $\\operatorname{Var}(10X)$.</p>`,
      steps:[
        {do:`$E[X] = 3.5$, $E[X^2] = \\frac{1+4+9+16+25+36}{6} = \\frac{91}{6}$.`, why:`Average the squared faces.`},
        {do:`$\\operatorname{Var}(X) = \\frac{91}{6} - \\frac{49}{4} = \\frac{182 - 147}{12} = \\frac{35}{12} \\approx 2.917$.`, why:`$E[X^2] - (E[X])^2$ over a common denominator.`},
        {do:`$\\operatorname{Var}(10X) = 100 \\times \\frac{35}{12} = \\frac{3500}{12} \\approx 291.7$.`, why:`Constants come out squared.`}
      ],
      answer:`$\\operatorname{Var}(X) = \\frac{35}{12}$, $\\operatorname{Var}(10X) \\approx 291.7$` },

    { q:`<p>The average of $n = 4$ independent rolls of a fair die is $\\bar{X} = \\frac{X_1 + X_2 + X_3 + X_4}{4}$. Using $\\operatorname{Var}(X_i) = \\frac{35}{12}$, find $\\operatorname{Var}(\\bar{X})$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(\\bar{X}) = \\frac{1}{4^2}\\operatorname{Var}(X_1 + \\dots + X_4) = \\frac{1}{16}(4 \\times \\frac{35}{12})$.`, why:`The $\\frac{1}{4}$ factor squares; independent variances add.`},
        {do:`$= \\frac{1}{16} \\times \\frac{140}{12} = \\frac{140}{192} = \\frac{35}{48} \\approx 0.729$.`, why:`Averaging shrinks variance by $\\frac{1}{n}$: $\\frac{35/12}{4}$.`}
      ],
      answer:`$\\operatorname{Var}(\\bar{X}) = \\frac{35}{48} \\approx 0.729$` }
  ]);

  /* ---------------- prob-bernoulli-binomial ---------------- */
  add("prob-bernoulli-binomial", [
    { q:`<p>A machine produces defects with $p = 0.1$. In 10 parts, find $P(\\text{at least one defective})$.</p>`,
      steps:[
        {do:`$P(X = 0) = \\binom{10}{0}0.1^0 0.9^{10} = 0.9^{10} \\approx 0.3487$.`, why:`All ten good.`},
        {do:`$P(X \\ge 1) = 1 - 0.3487 = 0.6513$.`, why:`Complement of "no defects".`}
      ],
      answer:`$\\approx 0.6513$` },

    { q:`<p>A free-throw shooter makes $p = 0.8$. In 6 shots, find $P(X \\ge 5)$ (at least 5 made).</p>`,
      steps:[
        {do:`$P(X = 5) = \\binom{6}{5}0.8^5 0.2^1 = 6 \\times 0.32768 \\times 0.2 = 0.393216$.`, why:`Exactly five makes.`},
        {do:`$P(X = 6) = 0.8^6 = 0.262144$.`, why:`All six made.`},
        {do:`$P(X \\ge 5) = 0.393216 + 0.262144 = 0.65536$.`, why:`Add the tail probabilities.`}
      ],
      answer:`$\\approx 0.6554$` },

    { q:`<p>An email link is clicked with $p = 0.05$ per recipient, $n = 40$ recipients. Find $P(\\text{exactly 3 clicks})$.</p>`,
      steps:[
        {do:`$\\binom{40}{3} = \\frac{40 \\times 39 \\times 38}{6} = 9880$.`, why:`Choose which 3 of 40 click.`},
        {do:`$0.05^3 \\times 0.95^{37} = 0.000125 \\times 0.1499 \\approx 1.874\\times 10^{-5}$.`, why:`One pattern's chance.`},
        {do:`$P = 9880 \\times 1.874\\times 10^{-5} \\approx 0.1851$.`, why:`Count times pattern chance.`}
      ],
      answer:`$\\approx 0.1851$` },

    { q:`<p>A quiz has 8 true/false questions guessed at random ($p = 0.5$). Find $P(X \\ge 6)$ (6 or more correct).</p>`,
      steps:[
        {do:`$P(X=6) = \\binom{8}{6}0.5^8 = \\frac{28}{256}$, $P(X=7) = \\binom{8}{7}0.5^8 = \\frac{8}{256}$, $P(X=8) = \\frac{1}{256}$.`, why:`Each pattern has chance $0.5^8 = \\frac{1}{256}$.`},
        {do:`$P(X \\ge 6) = \\frac{28 + 8 + 1}{256} = \\frac{37}{256} \\approx 0.1445$.`, why:`Sum the upper tail.`}
      ],
      answer:`$\\approx 0.1445$` },

    { q:`<p>A loaded coin has $P(H) = 0.6$. Flipped 5 times, find $P(X = 3)$ heads, then the mean and variance.</p>`,
      steps:[
        {do:`$P(X = 3) = \\binom{5}{3}0.6^3 0.4^2 = 10 \\times 0.216 \\times 0.16 = 0.3456$.`, why:`Binomial PMF.`},
        {do:`Mean $np = 5 \\times 0.6 = 3$; variance $np(1-p) = 5 \\times 0.6 \\times 0.4 = 1.2$.`, why:`Binomial mean and variance.`}
      ],
      answer:`$P(X=3) = 0.3456$, $E[X]=3$, $\\operatorname{Var}=1.2$` },

    { q:`<p>Two independent shooters each take 3 shots; A hits with $p = 0.7$, B with $p = 0.4$. Find the probability both make exactly 2 hits.</p>`,
      steps:[
        {do:`$P(A = 2) = \\binom{3}{2}0.7^2 0.3 = 3 \\times 0.49 \\times 0.3 = 0.441$.`, why:`Binomial for A.`},
        {do:`$P(B = 2) = \\binom{3}{2}0.4^2 0.6 = 3 \\times 0.16 \\times 0.6 = 0.288$.`, why:`Binomial for B.`},
        {do:`Independent: $P(\\text{both} = 2) = 0.441 \\times 0.288 \\approx 0.127$.`, why:`Multiply the two independent events.`}
      ],
      answer:`$\\approx 0.127$` }
  ]);

})();
