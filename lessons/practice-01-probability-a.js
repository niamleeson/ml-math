/* =====================================================================
   PRACTICE PROBLEMS — MODULE 1 (Probability), set A.
   Covers 11 lesson ids. Exactly 10 problems each, easy -> hard.
   Same formulas/notation as lessons/01-probability.js.
   ===================================================================== */
(function () {
Object.assign(window.PRACTICE, {

  /* ---------------- prob-sample-space ---------------- */
  "prob-sample-space": [
    { q:`<p>Flip one coin. Write the sample space $\\Omega$. How many outcomes does it have?</p>`,
      steps:[
        {do:`List the outcomes: $\\Omega = \\{H, T\\}$.`, why:`These are the only two things that can happen.`},
        {do:`Count them: $2$ outcomes.`, why:`The sample space is the full list of possible outcomes.`}
      ],
      answer:`$\\Omega = \\{H, T\\}$, $2$ outcomes` },

    { q:`<p>Roll one fair die. Write the event $A$ = "roll an even number".</p>`,
      steps:[
        {do:`Sample space: $\\Omega = \\{1,2,3,4,5,6\\}$.`, why:`A die has six faces.`},
        {do:`Keep only even faces: $A = \\{2,4,6\\}$.`, why:`An event is the subset of outcomes you care about.`}
      ],
      answer:`$A = \\{2,4,6\\}$` },

    { q:`<p>Toss two coins. Write the sample space $\\Omega$.</p>`,
      steps:[
        {do:`Pair each first result with each second result.`, why:`Each toss is independent, so list all combinations.`},
        {do:`$\\Omega = \\{HH, HT, TH, TT\\}$.`, why:`Two choices times two choices give four outcomes.`}
      ],
      answer:`$\\Omega = \\{HH, HT, TH, TT\\}$` },

    { q:`<p>Roll a die. Let $A$ = "roll more than 4". Write $A$ as a subset of $\\Omega$.</p>`,
      steps:[
        {do:`Faces bigger than 4 are $5$ and $6$.`, why:`"More than 4" means 5 or 6, not 4 itself.`},
        {do:`$A = \\{5, 6\\} \\subseteq \\Omega$.`, why:`Every outcome in $A$ is also in $\\Omega$.`}
      ],
      answer:`$A = \\{5, 6\\}$` },

    { q:`<p>Toss two coins. Write the event $A$ = "exactly one head".</p>`,
      steps:[
        {do:`Sample space: $\\Omega = \\{HH, HT, TH, TT\\}$.`, why:`Four equally likely outcomes.`},
        {do:`Keep outcomes with one head: $A = \\{HT, TH\\}$.`, why:`$HH$ has two heads, $TT$ has none.`}
      ],
      answer:`$A = \\{HT, TH\\}$` },

    { q:`<p>Roll a die. Let $A = \\{2,4,6\\}$ (even). If you roll a 4, did event $A$ occur?</p>`,
      steps:[
        {do:`Check if 4 is inside $A$: $4 \\in \\{2,4,6\\}$.`, why:`An event occurs when the actual outcome is in it.`},
        {do:`Yes, 4 is in $A$, so $A$ occurred.`, why:`4 is one of the even faces.`}
      ],
      answer:`Yes, $A$ occurred` },

    { q:`<p>How many outcomes are in the sample space for tossing three coins?</p>`,
      steps:[
        {do:`Each coin has 2 outcomes: $2 \\times 2 \\times 2$.`, why:`Multiply choices for independent tosses.`},
        {do:`$= 8$ outcomes.`, why:`$\\Omega = \\{HHH, HHT, \\dots, TTT\\}$ has 8 items.`}
      ],
      answer:`$8$ outcomes` },

    { q:`<p>Roll two dice. How many outcomes are in the sample space $\\Omega$?</p>`,
      steps:[
        {do:`First die: 6 faces. Second die: 6 faces.`, why:`Each die is one independent roll.`},
        {do:`$6 \\times 6 = 36$ ordered pairs.`, why:`Pair every first-die face with every second-die face.`}
      ],
      answer:`$36$ outcomes` },

    { q:`<p>Roll two dice. Write the event $A$ = "the sum is 4".</p>`,
      steps:[
        {do:`Find pairs that add to 4.`, why:`List ordered pairs $(d_1, d_2)$ with $d_1 + d_2 = 4$.`},
        {do:`$A = \\{(1,3), (2,2), (3,1)\\}$.`, why:`These three ordered pairs sum to 4.`}
      ],
      answer:`$A = \\{(1,3),(2,2),(3,1)\\}$` },

    { q:`<p>Draw a card from a 52-card deck. Let $A$ = "a heart" and $B$ = "a face card (J, Q, K)". How many outcomes are in $A$? In $B$?</p>`,
      steps:[
        {do:`Hearts: one per rank, $13$ cards.`, why:`Each suit has 13 ranks.`},
        {do:`Face cards: J, Q, K in each of 4 suits $= 3 \\times 4 = 12$.`, why:`Three face ranks, four suits.`}
      ],
      answer:`$A$ has $13$, $B$ has $12$` }
  ],

  /* ---------------- prob-axioms ---------------- */
  "prob-axioms": [
    { q:`<p>If $P(\\text{rain}) = 0.3$, what is $P(\\text{no rain})$?</p>`,
      steps:[
        {do:`Use the complement rule: $P(A^c) = 1 - P(A)$.`, why:`Either it rains or it doesn't; chances add to 1.`},
        {do:`$1 - 0.3 = 0.7$.`, why:`Subtract the chance of rain from 1.`}
      ],
      answer:`$P(\\text{no rain}) = 0.7$` },

    { q:`<p>Can a probability ever be $-0.2$? Why or why not?</p>`,
      steps:[
        {do:`Axiom 1 says $P(A) \\ge 0$.`, why:`A chance is never below 0.`},
        {do:`So $-0.2$ is impossible.`, why:`It breaks the nonnegativity axiom.`}
      ],
      answer:`No, since $P(A) \\ge 0$` },

    { q:`<p>Roll a die. Let $A = \\{1,2\\}$ and $B = \\{5,6\\}$. Find $P(A \\cup B)$.</p>`,
      steps:[
        {do:`$A$ and $B$ share no faces, so they are disjoint.`, why:`No outcome is in both events.`},
        {do:`$P(A) = \\frac{2}{6}$, $P(B) = \\frac{2}{6}$.`, why:`Each face has probability $\\frac{1}{6}$.`},
        {do:`$P(A \\cup B) = \\frac{2}{6} + \\frac{2}{6} = \\frac{4}{6} = \\frac{2}{3}$.`, why:`For disjoint events, add the probabilities.`}
      ],
      answer:`$P(A \\cup B) = \\frac{2}{3}$` },

    { q:`<p>A spinner lands on red with chance $0.5$ and blue with chance $0.3$. What is the chance it lands on neither (some other color)?</p>`,
      steps:[
        {do:`Red and blue together: $0.5 + 0.3 = 0.8$.`, why:`Red and blue are disjoint, so add them.`},
        {do:`$P(\\text{other}) = 1 - 0.8 = 0.2$.`, why:`All chances must sum to 1.`}
      ],
      answer:`$0.2$` },

    { q:`<p>The chances for a die game are $P(\\text{win}) = 0.4$ and $P(\\text{draw}) = 0.25$. What is $P(\\text{lose})$?</p>`,
      steps:[
        {do:`Win and draw: $0.4 + 0.25 = 0.65$.`, why:`These outcomes are disjoint, so add.`},
        {do:`$P(\\text{lose}) = 1 - 0.65 = 0.35$.`, why:`Win, draw, lose cover everything and sum to 1.`}
      ],
      answer:`$P(\\text{lose}) = 0.35$` },

    { q:`<p>A jar has marbles colored red, green, or blue. $P(\\text{red}) = 0.45$ and $P(\\text{green}) = 0.30$. Find $P(\\text{blue})$.</p>`,
      steps:[
        {do:`Red and green: $0.45 + 0.30 = 0.75$.`, why:`Colors are disjoint events.`},
        {do:`$P(\\text{blue}) = 1 - 0.75 = 0.25$.`, why:`The three colors are the whole sample space.`}
      ],
      answer:`$P(\\text{blue}) = 0.25$` },

    { q:`<p>Is it valid for a sample space with outcomes $a, b, c$ to have probabilities $0.5, 0.3, 0.3$?</p>`,
      steps:[
        {do:`Add them: $0.5 + 0.3 + 0.3 = 1.1$.`, why:`Axiom 2 says $P(\\Omega) = 1$.`},
        {do:`$1.1 \\ne 1$, so it is not valid.`, why:`The total chance must equal exactly 1.`}
      ],
      answer:`No, they sum to $1.1$` },

    { q:`<p>Draw a card from 52. Let $A$ = "a spade" and $B$ = "a heart". Find $P(A \\cup B)$.</p>`,
      steps:[
        {do:`A card can't be both, so $A$ and $B$ are disjoint.`, why:`A card has only one suit.`},
        {do:`$P(A) = \\frac{13}{52}$, $P(B) = \\frac{13}{52}$.`, why:`13 cards per suit out of 52.`},
        {do:`$P(A \\cup B) = \\frac{13}{52} + \\frac{13}{52} = \\frac{26}{52} = \\frac{1}{2}$.`, why:`Add disjoint probabilities.`}
      ],
      answer:`$P(A \\cup B) = \\frac{1}{2}$` },

    { q:`<p>Roll a die. Let $A = \\{1,2,3\\}$ and $B = \\{3,4\\}$. These overlap. Find $P(A \\cup B)$ using $P(A) + P(B) - P(A \\cap B)$.</p>`,
      steps:[
        {do:`$P(A) = \\frac{3}{6}$, $P(B) = \\frac{2}{6}$.`, why:`Count faces in each event.`},
        {do:`Overlap $A \\cap B = \\{3\\}$, so $P(A \\cap B) = \\frac{1}{6}$.`, why:`Face 3 is in both events.`},
        {do:`$P(A \\cup B) = \\frac{3}{6} + \\frac{2}{6} - \\frac{1}{6} = \\frac{4}{6} = \\frac{2}{3}$.`, why:`Subtract the overlap so it isn't counted twice.`}
      ],
      answer:`$P(A \\cup B) = \\frac{2}{3}$` },

    { q:`<p>A classifier outputs scores $2, 3, 5$ for three classes. Turn them into valid probabilities by dividing by the total (normalizing).</p>`,
      steps:[
        {do:`Total: $2 + 3 + 5 = 10$.`, why:`Probabilities must sum to 1, so divide by the total.`},
        {do:`$\\frac{2}{10} = 0.2$, $\\frac{3}{10} = 0.3$, $\\frac{5}{10} = 0.5$.`, why:`Each score divided by the total.`},
        {do:`Check: $0.2 + 0.3 + 0.5 = 1$.`, why:`Normalization axiom is satisfied.`}
      ],
      answer:`$0.2, 0.3, 0.5$` }
  ],

  /* ---------------- prob-conditional ---------------- */
  "prob-conditional": [
    { q:`<p>A die came up greater than 3 (in $\\{4,5,6\\}$). What is $P(6 \\mid &gt;3)$?</p>`,
      steps:[
        {do:`New world is $\\{4,5,6\\}$: $P(&gt;3) = \\frac{3}{6}$.`, why:`Conditioning shrinks the sample space to $B$.`},
        {do:`Overlap "6 and $&gt;3$" is $\\{6\\}$: $P = \\frac{1}{6}$.`, why:`6 is the only favorable face still possible.`},
        {do:`$P(6 \\mid &gt;3) = \\frac{1/6}{3/6} = \\frac{1}{3}$.`, why:`Divide the overlap by the new world's chance.`}
      ],
      answer:`$P(6 \\mid &gt;3) = \\frac{1}{3}$` },

    { q:`<p>Roll a die. Let $A$ = "rolled a 2" and $B$ = "even". Find $P(A \\mid B)$.</p>`,
      steps:[
        {do:`$B = \\{2,4,6\\}$, so $P(B) = \\frac{3}{6} = \\frac{1}{2}$.`, why:`Three even faces.`},
        {do:`$A \\cap B = \\{2\\}$, so $P(A \\cap B) = \\frac{1}{6}$.`, why:`Only 2 is both a 2 and even.`},
        {do:`$P(A \\mid B) = \\frac{1/6}{1/2} = \\frac{1}{3}$.`, why:`Divide the joint chance by $P(B)$.`}
      ],
      answer:`$P(A \\mid B) = \\frac{1}{3}$` },

    { q:`<p>In a class, $P(\\text{likes math and science}) = 0.2$ and $P(\\text{likes science}) = 0.5$. Find $P(\\text{math} \\mid \\text{science})$.</p>`,
      steps:[
        {do:`Use $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$.`, why:`We condition on liking science.`},
        {do:`$\\frac{0.2}{0.5} = 0.4$.`, why:`Divide the joint chance by the chance of science.`}
      ],
      answer:`$0.4$` },

    { q:`<p>Draw a card from 52. Given it is a face card (J, Q, K), what is the chance it is a king?</p>`,
      steps:[
        {do:`Face cards: $12$ total. Kings: $4$.`, why:`The new world is the 12 face cards.`},
        {do:`$P(\\text{king} \\mid \\text{face}) = \\frac{4}{12} = \\frac{1}{3}$.`, why:`Favorable over the shrunk world.`}
      ],
      answer:`$\\frac{1}{3}$` },

    { q:`<p>Two coins are tossed. Given that at least one is heads, what is the chance both are heads?</p>`,
      steps:[
        {do:`$\\Omega = \\{HH, HT, TH, TT\\}$. "At least one head" = $\\{HH, HT, TH\\}$.`, why:`Drop $TT$; condition on the rest.`},
        {do:`Both heads is $\\{HH\\}$: 1 outcome out of 3.`, why:`Only $HH$ is favorable in the new world.`},
        {do:`$P = \\frac{1}{3}$.`, why:`Equally likely outcomes, favorable over total.`}
      ],
      answer:`$\\frac{1}{3}$` },

    { q:`<p>$P(A \\cap B) = 0.15$ and $P(B) = 0.6$. Find $P(A \\mid B)$.</p>`,
      steps:[
        {do:`Apply the formula: $\\frac{P(A \\cap B)}{P(B)} = \\frac{0.15}{0.6}$.`, why:`Definition of conditional probability.`},
        {do:`$\\frac{0.15}{0.6} = 0.25$.`, why:`Divide to find the fraction of $B$ that is also $A$.`}
      ],
      answer:`$P(A \\mid B) = 0.25$` },

    { q:`<p>Roll two dice. Given the sum is 6, what is the chance the first die is a 2?</p>`,
      steps:[
        {do:`Sum 6: $\\{(1,5),(2,4),(3,3),(4,2),(5,1)\\}$, that is 5 outcomes.`, why:`These are the ways to total 6.`},
        {do:`First die is 2: only $(2,4)$, so 1 outcome.`, why:`Favorable case inside the new world.`},
        {do:`$P = \\frac{1}{5}$.`, why:`Favorable over the 5 equally likely outcomes.`}
      ],
      answer:`$\\frac{1}{5}$` },

    { q:`<p>Of all customers, $30\\%$ buy coffee, and $12\\%$ buy both coffee and a muffin. Given a customer buys coffee, what is the chance they buy a muffin?</p>`,
      steps:[
        {do:`$P(\\text{coffee}) = 0.30$, $P(\\text{both}) = 0.12$.`, why:`Set up the conditional.`},
        {do:`$P(\\text{muffin} \\mid \\text{coffee}) = \\frac{0.12}{0.30} = 0.4$.`, why:`Joint over the condition.`}
      ],
      answer:`$0.4$` },

    { q:`<p>A box has 5 red and 3 blue balls. Draw two without replacement. What is $P(\\text{2nd red} \\mid \\text{1st red})$?</p>`,
      steps:[
        {do:`After one red is gone: $4$ red left, $7$ balls left.`, why:`The first red ball changes the box.`},
        {do:`$P(\\text{2nd red} \\mid \\text{1st red}) = \\frac{4}{7}$.`, why:`Favorable reds over remaining total.`}
      ],
      answer:`$\\frac{4}{7}$` },

    { q:`<p>A box has 5 red and 3 blue balls. Draw two without replacement. Find $P(\\text{both red})$ using the chain rule $P(A \\cap B) = P(A)\\,P(B \\mid A)$.</p>`,
      steps:[
        {do:`$P(\\text{1st red}) = \\frac{5}{8}$.`, why:`5 red out of 8 balls.`},
        {do:`$P(\\text{2nd red} \\mid \\text{1st red}) = \\frac{4}{7}$.`, why:`One red removed, 7 balls left.`},
        {do:`$P(\\text{both red}) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$.`, why:`Multiply along the chain.`}
      ],
      answer:`$P(\\text{both red}) = \\frac{5}{14}$` }
  ],

  /* ---------------- prob-bayes ---------------- */
  "prob-bayes": [
    { q:`<p>$P(B \\mid A) = 0.8$, $P(A) = 0.25$, $P(B) = 0.4$. Find $P(A \\mid B)$.</p>`,
      steps:[
        {do:`Bayes: $P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)}$.`, why:`Flip the conditional using the rule.`},
        {do:`$= \\frac{0.8 \\times 0.25}{0.4} = \\frac{0.2}{0.4} = 0.5$.`, why:`Plug in and divide.`}
      ],
      answer:`$P(A \\mid B) = 0.5$` },

    { q:`<p>A disease affects $1\\%$ of people. A test catches sick people $90\\%$ of the time and false-alarms $20\\%$ of the time. You test positive. First find $P(+)$.</p>`,
      steps:[
        {do:`$P(\\text{sick}) = 0.01$, $P(\\text{healthy}) = 0.99$.`, why:`Prior and its complement.`},
        {do:`$P(+) = 0.90 \\times 0.01 + 0.20 \\times 0.99$.`, why:`Total probability over sick and healthy.`},
        {do:`$= 0.009 + 0.198 = 0.207$.`, why:`Add the two ways to test positive.`}
      ],
      answer:`$P(+) = 0.207$` },

    { q:`<p>Continue: disease $1\\%$, sensitivity $90\\%$, false alarm $20\\%$, and $P(+) = 0.207$. Find $P(\\text{sick} \\mid +)$.</p>`,
      steps:[
        {do:`Bayes: $\\frac{P(+ \\mid \\text{sick})\\,P(\\text{sick})}{P(+)}$.`, why:`We want sick given positive.`},
        {do:`$= \\frac{0.90 \\times 0.01}{0.207} = \\frac{0.009}{0.207} \\approx 0.043$.`, why:`Plug in the numbers.`},
        {do:`So about $4.3\\%$.`, why:`The rare base rate keeps the posterior low.`}
      ],
      answer:`$P(\\text{sick} \\mid +) \\approx 0.043$` },

    { q:`<p>$2\\%$ of emails are spam. The word "free" appears in $60\\%$ of spam and $5\\%$ of non-spam. An email has "free". Find $P(\\text{spam} \\mid \\text{free})$.</p>`,
      steps:[
        {do:`$P(\\text{free}) = 0.60 \\times 0.02 + 0.05 \\times 0.98 = 0.012 + 0.049 = 0.061$.`, why:`Total probability of seeing "free".`},
        {do:`$P(\\text{spam} \\mid \\text{free}) = \\frac{0.60 \\times 0.02}{0.061} = \\frac{0.012}{0.061} \\approx 0.197$.`, why:`Bayes' rule with the spam prior.`}
      ],
      answer:`$\\approx 0.197$` },

    { q:`<p>A factory: machine A makes $70\\%$ of parts ($2\\%$ defective), machine B makes $30\\%$ ($6\\%$ defective). A part is defective. Find $P(B \\mid \\text{defective})$.</p>`,
      steps:[
        {do:`$P(\\text{def}) = 0.70 \\times 0.02 + 0.30 \\times 0.06 = 0.014 + 0.018 = 0.032$.`, why:`Total chance a part is defective.`},
        {do:`$P(B \\mid \\text{def}) = \\frac{0.30 \\times 0.06}{0.032} = \\frac{0.018}{0.032} = 0.5625$.`, why:`Bayes' rule for machine B.`}
      ],
      answer:`$0.5625$` },

    { q:`<p>Two bags: bag 1 has 2 red, 3 blue; bag 2 has 4 red, 1 blue. Pick a bag at random, draw red. Find $P(\\text{bag 1} \\mid \\text{red})$.</p>`,
      steps:[
        {do:`$P(\\text{red} \\mid \\text{bag 1}) = \\frac{2}{5}$, $P(\\text{red} \\mid \\text{bag 2}) = \\frac{4}{5}$.`, why:`Red fraction in each bag.`},
        {do:`$P(\\text{red}) = \\frac{1}{2}\\cdot\\frac{2}{5} + \\frac{1}{2}\\cdot\\frac{4}{5} = \\frac{2}{10} + \\frac{4}{10} = \\frac{6}{10}$.`, why:`Each bag chosen with chance $\\frac{1}{2}$.`},
        {do:`$P(\\text{bag 1} \\mid \\text{red}) = \\frac{(1/2)(2/5)}{6/10} = \\frac{2/10}{6/10} = \\frac{2}{6} = \\frac{1}{3}$.`, why:`Bayes' rule.`}
      ],
      answer:`$\\frac{1}{3}$` },

    { q:`<p>$1\\%$ of products are fakes. A scanner flags $95\\%$ of fakes and $3\\%$ of real ones. An item is flagged. Find $P(\\text{fake} \\mid \\text{flag})$.</p>`,
      steps:[
        {do:`$P(\\text{flag}) = 0.95 \\times 0.01 + 0.03 \\times 0.99 = 0.0095 + 0.0297 = 0.0392$.`, why:`Total chance of a flag.`},
        {do:`$P(\\text{fake} \\mid \\text{flag}) = \\frac{0.0095}{0.0392} \\approx 0.242$.`, why:`Bayes' rule with the fake prior.`}
      ],
      answer:`$\\approx 0.242$` },

    { q:`<p>A test is $99\\%$ accurate both ways. The disease affects $1$ in $1000$. You test positive. Find $P(\\text{sick} \\mid +)$.</p>`,
      steps:[
        {do:`$P(\\text{sick}) = 0.001$, $P(\\text{healthy}) = 0.999$.`, why:`Prior from the base rate.`},
        {do:`$P(+) = 0.99 \\times 0.001 + 0.01 \\times 0.999 = 0.00099 + 0.00999 = 0.01098$.`, why:`Total chance of a positive test.`},
        {do:`$P(\\text{sick} \\mid +) = \\frac{0.00099}{0.01098} \\approx 0.09$.`, why:`Bayes' rule; the rare base rate dominates.`}
      ],
      answer:`$\\approx 0.09$` },

    { q:`<p>Why can a "99% accurate" test give only a $9\\%$ chance of illness after a positive result?</p>`,
      steps:[
        {do:`Healthy people ($99.9\\%$) vastly outnumber sick people ($0.1\\%$).`, why:`The base rate of illness is tiny.`},
        {do:`A $1\\%$ false-alarm rate on so many healthy people makes many false positives.`, why:`False positives swamp true positives.`}
      ],
      answer:`The low base rate dominates` },

    { q:`<p>A spam filter: $40\\%$ spam prior. A link appears in $70\\%$ of spam and $10\\%$ of non-spam. An email has a link. Find $P(\\text{spam} \\mid \\text{link})$.</p>`,
      steps:[
        {do:`$P(\\text{link}) = 0.70 \\times 0.40 + 0.10 \\times 0.60 = 0.28 + 0.06 = 0.34$.`, why:`Total probability of a link.`},
        {do:`$P(\\text{spam} \\mid \\text{link}) = \\frac{0.28}{0.34} \\approx 0.824$.`, why:`Bayes' rule with the spam prior.`}
      ],
      answer:`$\\approx 0.824$` }
  ],

  /* ---------------- prob-total-prob ---------------- */
  "prob-total-prob": [
    { q:`<p>A bag has $70\\%$ red apples ($10\\%$ bruised) and $30\\%$ green apples ($20\\%$ bruised). Find the overall chance an apple is bruised.</p>`,
      steps:[
        {do:`Red part: $0.70 \\times 0.10 = 0.07$.`, why:`Weight the bruise chance by how common red is.`},
        {do:`Green part: $0.30 \\times 0.20 = 0.06$.`, why:`Same for green apples.`},
        {do:`$P(\\text{bruised}) = 0.07 + 0.06 = 0.13$.`, why:`Add over the two cases.`}
      ],
      answer:`$0.13$` },

    { q:`<p>Factory 1 makes $60\\%$ of bulbs ($2\\%$ defective); factory 2 makes $40\\%$ ($5\\%$ defective). Find $P(\\text{defective})$.</p>`,
      steps:[
        {do:`Factory 1: $0.60 \\times 0.02 = 0.012$.`, why:`Weight defect rate by the factory's share.`},
        {do:`Factory 2: $0.40 \\times 0.05 = 0.020$.`, why:`Same for factory 2.`},
        {do:`$P(D) = 0.012 + 0.020 = 0.032$.`, why:`Add the contributions.`}
      ],
      answer:`$P(D) = 0.032$` },

    { q:`<p>A coin is fair ($\\frac{1}{2}$) or two-headed ($\\frac{1}{2}$), chosen at random. Find $P(\\text{heads})$.</p>`,
      steps:[
        {do:`Fair coin: $\\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$.`, why:`Weight heads by how likely the fair coin is.`},
        {do:`Two-headed: $\\frac{1}{2} \\times 1 = \\frac{1}{2}$.`, why:`A two-headed coin always shows heads.`},
        {do:`$P(H) = \\frac{1}{4} + \\frac{1}{2} = \\frac{3}{4}$.`, why:`Add over the two coin types.`}
      ],
      answer:`$P(H) = \\frac{3}{4}$` },

    { q:`<p>$60\\%$ of students study ($90\\%$ pass) and $40\\%$ don't ($40\\%$ pass). Find $P(\\text{pass})$.</p>`,
      steps:[
        {do:`Studied: $0.60 \\times 0.90 = 0.54$.`, why:`Weight pass rate by share who studied.`},
        {do:`Not studied: $0.40 \\times 0.40 = 0.16$.`, why:`Same for non-studiers.`},
        {do:`$P(\\text{pass}) = 0.54 + 0.16 = 0.70$.`, why:`Add over both cases.`}
      ],
      answer:`$P(\\text{pass}) = 0.70$` },

    { q:`<p>Three machines make $50\\%$, $30\\%$, $20\\%$ of parts with defect rates $1\\%$, $2\\%$, $4\\%$. Find $P(\\text{defective})$.</p>`,
      steps:[
        {do:`$0.50 \\times 0.01 = 0.005$.`, why:`Machine 1 contribution.`},
        {do:`$0.30 \\times 0.02 = 0.006$ and $0.20 \\times 0.04 = 0.008$.`, why:`Machines 2 and 3.`},
        {do:`$P(D) = 0.005 + 0.006 + 0.008 = 0.019$.`, why:`Sum over all three cases.`}
      ],
      answer:`$P(D) = 0.019$` },

    { q:`<p>Bag 1 ($P=0.5$) has 3 red of 5; bag 2 ($P=0.5$) has 1 red of 4. Pick a bag, draw a ball. Find $P(\\text{red})$.</p>`,
      steps:[
        {do:`Bag 1: $0.5 \\times \\frac{3}{5} = 0.5 \\times 0.6 = 0.3$.`, why:`Weight by the chance of picking bag 1.`},
        {do:`Bag 2: $0.5 \\times \\frac{1}{4} = 0.5 \\times 0.25 = 0.125$.`, why:`Same for bag 2.`},
        {do:`$P(\\text{red}) = 0.3 + 0.125 = 0.425$.`, why:`Add over the two bags.`}
      ],
      answer:`$P(\\text{red}) = 0.425$` },

    { q:`<p>A day is sunny ($P = 0.7$, late chance $0.1$) or rainy ($P = 0.3$, late chance $0.5$). Find $P(\\text{late})$.</p>`,
      steps:[
        {do:`Sunny: $0.7 \\times 0.1 = 0.07$.`, why:`Weight late chance by sunny days.`},
        {do:`Rainy: $0.3 \\times 0.5 = 0.15$.`, why:`Same for rainy days.`},
        {do:`$P(\\text{late}) = 0.07 + 0.15 = 0.22$.`, why:`Add over the two weather cases.`}
      ],
      answer:`$P(\\text{late}) = 0.22$` },

    { q:`<p>An email is spam ($P = 0.3$, has link $0.8$) or not ($P = 0.7$, has link $0.2$). Find $P(\\text{link})$.</p>`,
      steps:[
        {do:`Spam: $0.3 \\times 0.8 = 0.24$.`, why:`Weight link chance by spam share.`},
        {do:`Not spam: $0.7 \\times 0.2 = 0.14$.`, why:`Same for non-spam.`},
        {do:`$P(\\text{link}) = 0.24 + 0.14 = 0.38$.`, why:`Add over both classes.`}
      ],
      answer:`$P(\\text{link}) = 0.38$` },

    { q:`<p>A driver is experienced ($P = 0.8$, crash $1\\%$) or new ($P = 0.2$, crash $5\\%$). Find $P(\\text{crash})$.</p>`,
      steps:[
        {do:`Experienced: $0.8 \\times 0.01 = 0.008$.`, why:`Weight crash rate by experienced share.`},
        {do:`New: $0.2 \\times 0.05 = 0.010$.`, why:`Same for new drivers.`},
        {do:`$P(\\text{crash}) = 0.008 + 0.010 = 0.018$.`, why:`Add over both driver types.`}
      ],
      answer:`$P(\\text{crash}) = 0.018$` },

    { q:`<p>Urn A ($P = 0.6$) has $\\frac{1}{3}$ white; urn B ($P = 0.4$) has $\\frac{3}{4}$ white. Pick an urn, draw a ball. Find $P(\\text{white})$.</p>`,
      steps:[
        {do:`Urn A: $0.6 \\times \\frac{1}{3} = 0.2$.`, why:`Weight white chance by urn A's probability.`},
        {do:`Urn B: $0.4 \\times \\frac{3}{4} = 0.3$.`, why:`Same for urn B.`},
        {do:`$P(\\text{white}) = 0.2 + 0.3 = 0.5$.`, why:`Add over both urns.`}
      ],
      answer:`$P(\\text{white}) = 0.5$` }
  ],

  /* ---------------- prob-independence ---------------- */
  "prob-independence": [
    { q:`<p>$P(A) = 0.5$, $P(B) = 0.4$, $P(A \\cap B) = 0.2$. Are $A$ and $B$ independent?</p>`,
      steps:[
        {do:`Product: $P(A)\\,P(B) = 0.5 \\times 0.4 = 0.2$.`, why:`Independence test: does the product equal the joint?`},
        {do:`$0.2 = P(A \\cap B)$, so yes.`, why:`The joint equals the product.`}
      ],
      answer:`Yes, independent` },

    { q:`<p>Flip a fair coin twice. Let $A$ = "1st heads", $B$ = "2nd heads". Find $P(A \\cap B)$.</p>`,
      steps:[
        {do:`$P(A) = \\frac{1}{2}$, $P(B) = \\frac{1}{2}$.`, why:`Each flip is fair.`},
        {do:`Flips are independent: $P(A \\cap B) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$.`, why:`Multiply for independent events.`}
      ],
      answer:`$P(A \\cap B) = \\frac{1}{4}$` },

    { q:`<p>A spinner lands red with chance $0.3$ each spin. Spins are independent. Find $P(\\text{red then red})$.</p>`,
      steps:[
        {do:`Each spin: $P(\\text{red}) = 0.3$.`, why:`Spins don't affect each other.`},
        {do:`$0.3 \\times 0.3 = 0.09$.`, why:`Multiply independent probabilities.`}
      ],
      answer:`$0.09$` },

    { q:`<p>$P(A) = 0.6$, $P(B) = 0.5$, $P(A \\cap B) = 0.36$. Are they independent?</p>`,
      steps:[
        {do:`Product: $0.6 \\times 0.5 = 0.30$.`, why:`Compare product to joint.`},
        {do:`$0.30 \\ne 0.36$, so no.`, why:`The joint exceeds the product, so they are dependent.`}
      ],
      answer:`No, not independent` },

    { q:`<p>A machine has two independent parts. Part 1 works with chance $0.9$, part 2 with chance $0.8$. Find $P(\\text{both work})$.</p>`,
      steps:[
        {do:`Parts are independent: multiply.`, why:`One part's state says nothing about the other.`},
        {do:`$0.9 \\times 0.8 = 0.72$.`, why:`Joint chance for independent events.`}
      ],
      answer:`$0.72$` },

    { q:`<p>Two independent components each fail with chance $0.1$. Find the chance both fail.</p>`,
      steps:[
        {do:`Each fails with chance $0.1$.`, why:`Failures are independent.`},
        {do:`$0.1 \\times 0.1 = 0.01$.`, why:`Multiply for the joint.`}
      ],
      answer:`$0.01$` },

    { q:`<p>An archer hits with chance $0.8$ per shot, shots independent. Find $P(\\text{hit, hit, hit})$ over 3 shots.</p>`,
      steps:[
        {do:`Each hit: $0.8$.`, why:`Shots don't influence each other.`},
        {do:`$0.8 \\times 0.8 \\times 0.8 = 0.512$.`, why:`Multiply across independent shots.`}
      ],
      answer:`$0.512$` },

    { q:`<p>$P(\\text{red light}) = 0.4$ at each of two independent intersections. Find the chance you hit at least one red.</p>`,
      steps:[
        {do:`$P(\\text{no red}) = 0.6 \\times 0.6 = 0.36$.`, why:`Both green, independent, so multiply.`},
        {do:`$P(\\text{at least one red}) = 1 - 0.36 = 0.64$.`, why:`Complement of "no red".`}
      ],
      answer:`$0.64$` },

    { q:`<p>Roll a die. Let $A$ = "even" $= \\{2,4,6\\}$ and $B$ = "greater than 4" $= \\{5,6\\}$. Are they independent?</p>`,
      steps:[
        {do:`$P(A) = \\frac{3}{6} = \\frac{1}{2}$, $P(B) = \\frac{2}{6} = \\frac{1}{3}$.`, why:`Count faces in each event.`},
        {do:`$A \\cap B = \\{6\\}$, so $P(A \\cap B) = \\frac{1}{6}$.`, why:`Only 6 is even and greater than 4.`},
        {do:`Product: $\\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6} = P(A \\cap B)$, so yes.`, why:`Joint equals product, so independent.`}
      ],
      answer:`Yes, independent` },

    { q:`<p>A network needs both links up to connect. Links are independent and each is up with chance $0.95$. Find $P(\\text{connected})$.</p>`,
      steps:[
        {do:`Both up: $0.95 \\times 0.95$.`, why:`Independent links, so multiply.`},
        {do:`$= 0.9025$.`, why:`Joint chance both links work.`}
      ],
      answer:`$0.9025$` }
  ],

  /* ---------------- prob-counting ---------------- */
  "prob-counting": [
    { q:`<p>How many ways can you choose 2 toppings from 4 (order doesn't matter)?</p>`,
      steps:[
        {do:`Use $\\binom{n}{r}$ with $n=4$, $r=2$.`, why:`Order doesn't matter, so use combinations.`},
        {do:`$\\binom{4}{2} = \\frac{4!}{2!\\,2!} = \\frac{24}{4} = 6$.`, why:`Plug into the combination formula.`}
      ],
      answer:`$6$ ways` },

    { q:`<p>How many ways can 4 people line up in a row?</p>`,
      steps:[
        {do:`First slot: 4 choices, then 3, then 2, then 1.`, why:`Each pick removes one person.`},
        {do:`$4! = 4 \\times 3 \\times 2 \\times 1 = 24$.`, why:`Order matters; this is a full permutation.`}
      ],
      answer:`$24$ ways` },

    { q:`<p>From 5 students, how many ways to line up 3 for a photo (order matters)?</p>`,
      steps:[
        {do:`Permutation: $\\frac{n!}{(n-r)!}$ with $n=5$, $r=3$.`, why:`Order matters, so use permutations.`},
        {do:`$\\frac{5!}{2!} = \\frac{120}{2} = 60$.`, why:`Compute the ordered arrangements.`}
      ],
      answer:`$60$ ways` },

    { q:`<p>From 5 students, how many ways to pick 3 for a team (order doesn't matter)?</p>`,
      steps:[
        {do:`Combination: $\\binom{5}{3} = \\frac{5!}{3!\\,2!}$.`, why:`A team has no internal order.`},
        {do:`$= \\frac{120}{6 \\times 2} = \\frac{120}{12} = 10$.`, why:`Compute the count.`}
      ],
      answer:`$10$ teams` },

    { q:`<p>How many ways to choose 2 cards from a 52-card deck (order doesn't matter)?</p>`,
      steps:[
        {do:`$\\binom{52}{2} = \\frac{52 \\times 51}{2}$.`, why:`Only the top two factors survive after canceling.`},
        {do:`$= \\frac{2652}{2} = 1326$.`, why:`Divide by $2!$ for the two orders.`}
      ],
      answer:`$1326$ ways` },

    { q:`<p>A lock has 3 dials, each 0-9, digits can repeat. How many codes?</p>`,
      steps:[
        {do:`Each dial: 10 choices, independent.`, why:`Repeats allowed, so 10 each time.`},
        {do:`$10 \\times 10 \\times 10 = 1000$.`, why:`Multiply choices for each dial.`}
      ],
      answer:`$1000$ codes` },

    { q:`<p>Roll two dice. What is $P(\\text{sum} = 7)$? Use favorable over total counts.</p>`,
      steps:[
        {do:`Total outcomes: $6 \\times 6 = 36$.`, why:`Each die has 6 faces.`},
        {do:`Sum 7: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$, that is 6.`, why:`Count ordered pairs summing to 7.`},
        {do:`$P = \\frac{6}{36} = \\frac{1}{6}$.`, why:`Favorable over total.`}
      ],
      answer:`$\\frac{1}{6}$` },

    { q:`<p>A team of 3 is chosen from 4 men and 3 women. How many teams have exactly 2 men and 1 woman?</p>`,
      steps:[
        {do:`Choose 2 men: $\\binom{4}{2} = 6$.`, why:`Pick 2 of the 4 men, order irrelevant.`},
        {do:`Choose 1 woman: $\\binom{3}{1} = 3$.`, why:`Pick 1 of the 3 women.`},
        {do:`Multiply: $6 \\times 3 = 18$.`, why:`Combine independent choices.`}
      ],
      answer:`$18$ teams` },

    { q:`<p>A 5-card hand is dealt from 52 cards. What is the chance all 5 are spades? Use $\\frac{\\binom{13}{5}}{\\binom{52}{5}}$.</p>`,
      steps:[
        {do:`Favorable: $\\binom{13}{5} = 1287$.`, why:`Choose 5 of the 13 spades.`},
        {do:`Total: $\\binom{52}{5} = 2598960$.`, why:`Choose any 5 of 52 cards.`},
        {do:`$P = \\frac{1287}{2598960} \\approx 0.000495$.`, why:`Favorable over total.`}
      ],
      answer:`$\\approx 0.000495$` },

    { q:`<p>A committee of 2 is picked from 6 people. What is the chance a specific person, Alice, is on it?</p>`,
      steps:[
        {do:`Total committees: $\\binom{6}{2} = 15$.`, why:`Choose any 2 of 6.`},
        {do:`Committees with Alice: pick 1 more from 5, $\\binom{5}{1} = 5$.`, why:`Alice is fixed; choose her partner.`},
        {do:`$P = \\frac{5}{15} = \\frac{1}{3}$.`, why:`Favorable over total.`}
      ],
      answer:`$\\frac{1}{3}$` }
  ],

  /* ---------------- prob-random-variable ---------------- */
  "prob-random-variable": [
    { q:`<p>Roll a fair die, $X$ = the face shown. What is $p_X(3)$?</p>`,
      steps:[
        {do:`Each face is equally likely.`, why:`A fair die has 6 outcomes.`},
        {do:`$p_X(3) = \\frac{1}{6}$.`, why:`One favorable value out of six.`}
      ],
      answer:`$p_X(3) = \\frac{1}{6}$` },

    { q:`<p>Flip 2 fair coins. Let $X$ = number of heads. Find $p_X(1)$.</p>`,
      steps:[
        {do:`$\\Omega = \\{HH, HT, TH, TT\\}$, each $\\frac{1}{4}$.`, why:`Four equally likely outcomes.`},
        {do:`One head: $HT$ or $TH$, so $p_X(1) = \\frac{2}{4} = \\frac{1}{2}$.`, why:`Two outcomes give exactly one head.`}
      ],
      answer:`$p_X(1) = \\frac{1}{2}$` },

    { q:`<p>For 2 coin flips with $X$ = heads, the PMF is $p_X(0) = \\frac{1}{4}$, $p_X(1) = \\frac{1}{2}$, $p_X(2) = \\frac{1}{4}$. Check it sums to 1.</p>`,
      steps:[
        {do:`Add: $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{4}$.`, why:`A valid PMF must sum to 1.`},
        {do:`$= \\frac{1}{4} + \\frac{2}{4} + \\frac{1}{4} = \\frac{4}{4} = 1$.`, why:`The total chance is 1, so it is valid.`}
      ],
      answer:`Sum $= 1$, valid` },

    { q:`<p>A PMF has $p_X(1) = 0.2$, $p_X(2) = 0.5$, $p_X(3) = c$. Find $c$.</p>`,
      steps:[
        {do:`All values sum to 1: $0.2 + 0.5 + c = 1$.`, why:`Normalization rule for a PMF.`},
        {do:`$c = 1 - 0.7 = 0.3$.`, why:`Solve for the missing probability.`}
      ],
      answer:`$c = 0.3$` },

    { q:`<p>Roll a die, $X$ = face. Find $P(X \\le 2)$.</p>`,
      steps:[
        {do:`$X \\le 2$ means $X = 1$ or $X = 2$.`, why:`Add the chances of each value.`},
        {do:`$\\frac{1}{6} + \\frac{1}{6} = \\frac{2}{6} = \\frac{1}{3}$.`, why:`Two favorable faces out of six.`}
      ],
      answer:`$P(X \\le 2) = \\frac{1}{3}$` },

    { q:`<p>Flip 3 fair coins, $X$ = number of heads. Find $p_X(0)$.</p>`,
      steps:[
        {do:`Total outcomes: $2^3 = 8$.`, why:`Each coin has 2 outcomes.`},
        {do:`Zero heads: only $TTT$, so $p_X(0) = \\frac{1}{8}$.`, why:`One favorable outcome out of 8.`}
      ],
      answer:`$p_X(0) = \\frac{1}{8}$` },

    { q:`<p>Flip 3 fair coins, $X$ = number of heads. Find $p_X(2)$.</p>`,
      steps:[
        {do:`Total outcomes: $8$.`, why:`$2^3$ outcomes.`},
        {do:`Two heads: $HHT, HTH, THH$, so 3 outcomes.`, why:`Count outcomes with exactly two heads.`},
        {do:`$p_X(2) = \\frac{3}{8}$.`, why:`Favorable over total.`}
      ],
      answer:`$p_X(2) = \\frac{3}{8}$` },

    { q:`<p>Roll two dice, $X$ = the sum. Find $p_X(5)$.</p>`,
      steps:[
        {do:`Total outcomes: $36$.`, why:`$6 \\times 6$ ordered pairs.`},
        {do:`Sum 5: $(1,4),(2,3),(3,2),(4,1)$, that is 4.`, why:`Count pairs that add to 5.`},
        {do:`$p_X(5) = \\frac{4}{36} = \\frac{1}{9}$.`, why:`Favorable over total.`}
      ],
      answer:`$p_X(5) = \\frac{1}{9}$` },

    { q:`<p>A spinner gives $X = 1$ with chance $0.5$, $X = 2$ with chance $0.3$, $X = 5$ with chance $0.2$. Find $P(X \\ge 2)$.</p>`,
      steps:[
        {do:`$X \\ge 2$ means $X = 2$ or $X = 5$.`, why:`Add the chances of those values.`},
        {do:`$0.3 + 0.2 = 0.5$.`, why:`Sum the favorable probabilities.`}
      ],
      answer:`$P(X \\ge 2) = 0.5$` },

    { q:`<p>A PMF: $p_X(0) = 0.4$, $p_X(1) = 0.4$, $p_X(2) = 0.2$. Find $P(X \\ge 1)$ using the complement.</p>`,
      steps:[
        {do:`$P(X \\ge 1) = 1 - P(X = 0)$.`, why:`Everything except $X = 0$.`},
        {do:`$= 1 - 0.4 = 0.6$.`, why:`Subtract the only excluded value.`}
      ],
      answer:`$P(X \\ge 1) = 0.6$` }
  ],

  /* ---------------- prob-expectation ---------------- */
  "prob-expectation": [
    { q:`<p>A coin pays \\$10 for heads, \\$0 for tails, each with chance $\\frac{1}{2}$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X] = 10 \\times \\frac{1}{2} + 0 \\times \\frac{1}{2}$.`, why:`Weight each value by its chance.`},
        {do:`$= 5 + 0 = 5$.`, why:`Add the weighted values.`}
      ],
      answer:`$E[X] = 5$` },

    { q:`<p>Roll a fair die, win that many dollars. Find $E[X]$.</p>`,
      steps:[
        {do:`Each face $1$ to $6$ has chance $\\frac{1}{6}$.`, why:`Fair die.`},
        {do:`$E[X] = \\frac{1+2+3+4+5+6}{6} = \\frac{21}{6} = 3.5$.`, why:`Sum the values times their equal chance.`}
      ],
      answer:`$E[X] = 3.5$` },

    { q:`<p>$X = 2$ with chance $0.3$ and $X = 5$ with chance $0.7$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X] = 2 \\times 0.3 + 5 \\times 0.7$.`, why:`Weighted average over values.`},
        {do:`$= 0.6 + 3.5 = 4.1$.`, why:`Add the weighted parts.`}
      ],
      answer:`$E[X] = 4.1$` },

    { q:`<p>A lottery ticket wins \\$100 with chance $0.01$, else \\$0. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X] = 100 \\times 0.01 + 0 \\times 0.99$.`, why:`Weight each payout by its chance.`},
        {do:`$= 1 + 0 = 1$.`, why:`The expected payout is \\$1.`}
      ],
      answer:`$E[X] = 1$` },

    { q:`<p>If the die game ($E[X] = 3.5$) doubles the prize and adds \\$1, find $E[2X + 1]$.</p>`,
      steps:[
        {do:`Linearity: $E[aX + b] = a\\,E[X] + b$.`, why:`Scaling and shifting carry through.`},
        {do:`$2 \\times 3.5 + 1 = 7 + 1 = 8$.`, why:`Plug in $a = 2$, $b = 1$.`}
      ],
      answer:`$E[2X + 1] = 8$` },

    { q:`<p>A game costs \\$2 to play and pays \\$5 with chance $0.3$, else \\$0. Find the expected net gain.</p>`,
      steps:[
        {do:`Expected payout: $5 \\times 0.3 + 0 \\times 0.7 = 1.5$.`, why:`Weighted average of winnings.`},
        {do:`Subtract the \\$2 cost: $1.5 - 2 = -0.5$.`, why:`Net gain is payout minus cost.`}
      ],
      answer:`$-\\$0.50$` },

    { q:`<p>A raffle: $X = 50$ with chance $0.02$, $X = 10$ with chance $0.1$, else $X = 0$. Find $E[X]$.</p>`,
      steps:[
        {do:`$50 \\times 0.02 = 1$ and $10 \\times 0.1 = 1$.`, why:`Weight each prize by its chance.`},
        {do:`$E[X] = 1 + 1 + 0 = 2$.`, why:`The \\$0 outcome adds nothing.`}
      ],
      answer:`$E[X] = 2$` },

    { q:`<p>Roll two dice, $X$ = sum. Use $E[X] = E[D_1] + E[D_2]$ with each die's mean $3.5$.</p>`,
      steps:[
        {do:`Each die has mean $3.5$.`, why:`Mean of one fair die.`},
        {do:`$E[X] = 3.5 + 3.5 = 7$.`, why:`Expectation adds across the two dice.`}
      ],
      answer:`$E[X] = 7$` },

    { q:`<p>A salesperson makes \\$200 per sale and averages $0.4$ sales per call. Find expected earnings per call.</p>`,
      steps:[
        {do:`$E[\\text{sales}] = 0.4$ per call.`, why:`Given average.`},
        {do:`$200 \\times 0.4 = 80$.`, why:`Scale earnings by expected sales.`}
      ],
      answer:`\\$80 per call` },

    { q:`<p>A weighted die: $P(6) = 0.5$, and $1$ to $5$ each $0.1$. Find $E[X]$.</p>`,
      steps:[
        {do:`Faces 1-5: $(1+2+3+4+5) \\times 0.1 = 15 \\times 0.1 = 1.5$.`, why:`Each of those has chance $0.1$.`},
        {do:`Face 6: $6 \\times 0.5 = 3$.`, why:`The heavy face contributes most.`},
        {do:`$E[X] = 1.5 + 3 = 4.5$.`, why:`Add all weighted values.`}
      ],
      answer:`$E[X] = 4.5$` }
  ],

  /* ---------------- prob-variance ---------------- */
  "prob-variance": [
    { q:`<p>A variable is always exactly 7 (no randomness). What is its variance?</p>`,
      steps:[
        {do:`The value never moves from its mean of 7.`, why:`No spread means no squared distance.`},
        {do:`$\\operatorname{Var}(X) = 0$.`, why:`Average squared distance from the mean is 0.`}
      ],
      answer:`$\\operatorname{Var}(X) = 0$` },

    { q:`<p>A fair coin pays \\$0 (tails) or \\$2 (heads), each $\\frac{1}{2}$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`Mean: $E[X] = 0 \\times \\frac{1}{2} + 2 \\times \\frac{1}{2} = 1$.`, why:`Weighted average.`},
        {do:`$E[X^2] = 0^2 \\times \\frac{1}{2} + 2^2 \\times \\frac{1}{2} = 2$.`, why:`Square first, then average.`},
        {do:`$\\operatorname{Var}(X) = 2 - 1^2 = 1$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 1$` },

    { q:`<p>For the coin with $\\operatorname{Var}(X) = 1$, find the standard deviation $\\sigma$.</p>`,
      steps:[
        {do:`$\\sigma = \\sqrt{\\operatorname{Var}(X)} = \\sqrt{1}$.`, why:`Standard deviation is the square root of variance.`},
        {do:`$= 1$.`, why:`Spread in the original units.`}
      ],
      answer:`$\\sigma = 1$` },

    { q:`<p>$X = 1$ with chance $0.5$ and $X = 3$ with chance $0.5$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`Mean: $E[X] = 1 \\times 0.5 + 3 \\times 0.5 = 2$.`, why:`Weighted average.`},
        {do:`$E[X^2] = 1 \\times 0.5 + 9 \\times 0.5 = 5$.`, why:`Average of the squares.`},
        {do:`$\\operatorname{Var}(X) = 5 - 2^2 = 1$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 1$` },

    { q:`<p>A fair die has $E[X] = 3.5$ and $E[X^2] = \\frac{91}{6}$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`$E[X^2] = \\frac{91}{6} \\approx 15.167$.`, why:`Given average of the squares.`},
        {do:`$(E[X])^2 = 3.5^2 = 12.25$.`, why:`Square the mean.`},
        {do:`$\\operatorname{Var}(X) = 15.167 - 12.25 \\approx 2.917$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) \\approx 2.917$` },

    { q:`<p>$X = 0$ with chance $0.8$ and $X = 10$ with chance $0.2$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`Mean: $E[X] = 0 \\times 0.8 + 10 \\times 0.2 = 2$.`, why:`Weighted average.`},
        {do:`$E[X^2] = 0 \\times 0.8 + 100 \\times 0.2 = 20$.`, why:`Average the squares.`},
        {do:`$\\operatorname{Var}(X) = 20 - 2^2 = 16$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 16$` },

    { q:`<p>From the previous problem $\\operatorname{Var}(X) = 16$. Find $\\sigma$.</p>`,
      steps:[
        {do:`$\\sigma = \\sqrt{16}$.`, why:`Square root of variance.`},
        {do:`$= 4$.`, why:`Spread in original units.`}
      ],
      answer:`$\\sigma = 4$` },

    { q:`<p>A Bernoulli with $p = 0.3$: $X = 1$ with chance $0.3$, else $0$. Find $\\operatorname{Var}(X)$ using $p(1-p)$.</p>`,
      steps:[
        {do:`$p = 0.3$, so $1 - p = 0.7$.`, why:`Success and failure chances.`},
        {do:`$\\operatorname{Var}(X) = 0.3 \\times 0.7 = 0.21$.`, why:`Bernoulli variance formula.`}
      ],
      answer:`$\\operatorname{Var}(X) = 0.21$` },

    { q:`<p>If $\\operatorname{Var}(X) = 4$, find $\\operatorname{Var}(3X)$. (Hint: variance scales by the square.)</p>`,
      steps:[
        {do:`$\\operatorname{Var}(aX) = a^2 \\operatorname{Var}(X)$.`, why:`Constants come out squared.`},
        {do:`$3^2 \\times 4 = 9 \\times 4 = 36$.`, why:`Apply $a = 3$.`}
      ],
      answer:`$\\operatorname{Var}(3X) = 36$` },

    { q:`<p>A die game: $X = 2$ ($p=0.25$), $X = 4$ ($p=0.5$), $X = 6$ ($p=0.25$). Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`Mean: $2(0.25) + 4(0.5) + 6(0.25) = 0.5 + 2 + 1.5 = 4$.`, why:`Weighted average.`},
        {do:`$E[X^2] = 4(0.25) + 16(0.5) + 36(0.25) = 1 + 8 + 9 = 18$.`, why:`Average the squares.`},
        {do:`$\\operatorname{Var}(X) = 18 - 4^2 = 18 - 16 = 2$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 2$` }
  ],

  /* ---------------- prob-bernoulli-binomial ---------------- */
  "prob-bernoulli-binomial": [
    { q:`<p>An archer hits with chance $0.8$ per shot. In 5 shots, find the expected number of hits.</p>`,
      steps:[
        {do:`Binomial mean: $E[X] = np$.`, why:`Each of $n$ trials contributes $p$ on average.`},
        {do:`$5 \\times 0.8 = 4$.`, why:`Plug in $n = 5$, $p = 0.8$.`}
      ],
      answer:`$E[X] = 4$ hits` },

    { q:`<p>Flip a fair coin ($p = 0.5$) 3 times. Find $P(X = 2)$ heads.</p>`,
      steps:[
        {do:`$\\binom{3}{2} = 3$ patterns (HHT, HTH, THH).`, why:`Count arrangements of 2 heads.`},
        {do:`Each pattern: $0.5^2 \\times 0.5^1 = 0.125$.`, why:`$p^k (1-p)^{n-k}$ for one pattern.`},
        {do:`$P(X = 2) = 3 \\times 0.125 = 0.375$.`, why:`Multiply count by pattern chance.`}
      ],
      answer:`$P(X = 2) = 0.375$` },

    { q:`<p>A Bernoulli trial has $p = 0.6$. Find its mean and variance.</p>`,
      steps:[
        {do:`Mean: $E[X] = p = 0.6$.`, why:`Bernoulli mean is $p$.`},
        {do:`Variance: $p(1-p) = 0.6 \\times 0.4 = 0.24$.`, why:`Bernoulli variance formula.`}
      ],
      answer:`$E[X] = 0.6$, $\\operatorname{Var}(X) = 0.24$` },

    { q:`<p>A part is defective with chance $p = 0.1$. In 4 parts, find $P(\\text{exactly 1 defective})$.</p>`,
      steps:[
        {do:`$\\binom{4}{1} = 4$ ways to choose which part is defective.`, why:`Count positions for the defect.`},
        {do:`Each: $0.1^1 \\times 0.9^3 = 0.1 \\times 0.729 = 0.0729$.`, why:`$p^k (1-p)^{n-k}$.`},
        {do:`$P = 4 \\times 0.0729 = 0.2916$.`, why:`Multiply count by pattern chance.`}
      ],
      answer:`$P \\approx 0.2916$` },

    { q:`<p>Flip a fair coin 4 times. Find $P(X = 0)$ heads.</p>`,
      steps:[
        {do:`$\\binom{4}{0} = 1$ way (all tails).`, why:`Only one pattern has zero heads.`},
        {do:`$0.5^0 \\times 0.5^4 = 1 \\times 0.0625 = 0.0625$.`, why:`$p^k (1-p)^{n-k}$.`},
        {do:`$P(X = 0) = 0.0625$.`, why:`Count times pattern chance.`}
      ],
      answer:`$P(X = 0) = 0.0625$` },

    { q:`<p>A free throw shooter makes $p = 0.7$. In 3 shots, find $P(\\text{all 3 made})$.</p>`,
      steps:[
        {do:`$\\binom{3}{3} = 1$ way.`, why:`Only one pattern is all makes.`},
        {do:`$0.7^3 = 0.343$.`, why:`$p^k (1-p)^{n-k}$ with $k = n = 3$.`},
        {do:`$P = 1 \\times 0.343 = 0.343$.`, why:`Count times pattern chance.`}
      ],
      answer:`$P = 0.343$` },

    { q:`<p>A quiz has 6 true/false questions guessed at random ($p = 0.5$). Find the expected number correct.</p>`,
      steps:[
        {do:`Binomial mean: $np$.`, why:`6 independent guesses.`},
        {do:`$6 \\times 0.5 = 3$.`, why:`Plug in $n = 6$, $p = 0.5$.`}
      ],
      answer:`$E[X] = 3$ correct` },

    { q:`<p>An ad is clicked with chance $p = 0.2$. Shown to 10 people, find the expected clicks and the variance ($np(1-p)$).</p>`,
      steps:[
        {do:`Mean: $np = 10 \\times 0.2 = 2$.`, why:`Each viewer clicks with chance $0.2$.`},
        {do:`Variance: $np(1-p) = 10 \\times 0.2 \\times 0.8 = 1.6$.`, why:`Binomial variance formula.`}
      ],
      answer:`$E[X] = 2$, $\\operatorname{Var}(X) = 1.6$` },

    { q:`<p>Flip a fair coin 4 times. Find $P(X \\ge 1)$ head using the complement.</p>`,
      steps:[
        {do:`$P(X = 0) = 0.5^4 = 0.0625$.`, why:`All tails is the only zero-head pattern.`},
        {do:`$P(X \\ge 1) = 1 - 0.0625 = 0.9375$.`, why:`Complement of "no heads".`}
      ],
      answer:`$P(X \\ge 1) = 0.9375$` },

    { q:`<p>A machine produces defects with chance $p = 0.2$. In 5 parts, find $P(\\text{exactly 2 defective})$.</p>`,
      steps:[
        {do:`$\\binom{5}{2} = 10$ ways to place 2 defects.`, why:`Count which 2 of 5 are defective.`},
        {do:`Each: $0.2^2 \\times 0.8^3 = 0.04 \\times 0.512 = 0.02048$.`, why:`$p^k (1-p)^{n-k}$.`},
        {do:`$P = 10 \\times 0.02048 = 0.2048$.`, why:`Multiply count by pattern chance.`}
      ],
      answer:`$P = 0.2048$` }
  ]

});
})();
