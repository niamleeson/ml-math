/* =====================================================================
   PRACTICE PROBLEMS — MODULE 1 (Probability), HARDER set #2.
   Appended on top of practice-hard-prob-a.js via add().
   Same formulas/notation as lessons/01-probability.js.
   Goal: bring each id to ~20+ harder problems total.
   All problems here are DISTINCT from practice-01 and practice-hard.
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ---------------- prob-sample-space ---------------- */
  add("prob-sample-space", [
    { q:`<p>Roll two dice. Let $A$ = "the product of the two faces is even". How many outcomes are in $A$?</p>`,
      steps:[
        {do:`The product is ODD only when both faces are odd. Odd faces are $\\{1,3,5\\}$: $3 \\times 3 = 9$ outcomes.`, why:`Even times anything is even, so the only even-free case is odd times odd.`},
        {do:`$|A| = 36 - 9 = 27$.`, why:`Total outcomes minus the all-odd outcomes.`}
      ],
      answer:`$27$ outcomes` },

    { q:`<p>Toss four coins. Let $A$ = "exactly two heads". How many outcomes are in $A$?</p>`,
      steps:[
        {do:`$\\Omega$ has $2^4 = 16$ outcomes. Choose which 2 of the 4 positions are heads: $\\binom{4}{2}$.`, why:`Each choice of head-positions is one outcome.`},
        {do:`$\\binom{4}{2} = 6$.`, why:`There are 6 ways to place two heads among four slots.`}
      ],
      answer:`$6$ outcomes` },

    { q:`<p>Roll two dice. Let $A$ = "sum is a multiple of 3". How many outcomes are in $A$?</p>`,
      steps:[
        {do:`Sums that are multiples of 3 are $3, 6, 9, 12$. Count ordered pairs: sum 3 has 2, sum 6 has 5, sum 9 has 4, sum 12 has 1.`, why:`Ways to make each sum: $6 - |s-7|$ for $s\\le7$, symmetric above.`},
        {do:`$2 + 5 + 4 + 1 = 12$ outcomes.`, why:`Add the counts for each qualifying sum.`}
      ],
      answer:`$12$ outcomes` },

    { q:`<p>Three distinct books are placed on a shelf in a random order. Let $A$ = "book 1 is to the left of book 2". How many of the $3! = 6$ arrangements are in $A$?</p>`,
      steps:[
        {do:`By symmetry, book 1 is left of book 2 in exactly half of all orderings.`, why:`For every arrangement, swapping books 1 and 2 flips the relation, pairing them up.`},
        {do:`$\\frac{6}{2} = 3$ arrangements.`, why:`Half of the six orderings.`}
      ],
      answer:`$3$ arrangements` },

    { q:`<p>A bit string of length 5 is generated. Let $A$ = "the string has at least one 1". How many outcomes are in $A$?</p>`,
      steps:[
        {do:`$\\Omega$ has $2^5 = 32$ strings. The only string with NO 1 is $00000$.`, why:`"At least one 1" is the complement of "all zeros".`},
        {do:`$|A| = 32 - 1 = 31$.`, why:`Remove the single all-zero string.`}
      ],
      answer:`$31$ outcomes` },

    { q:`<p>Roll three dice. Let $A$ = "the three faces are all the same". How many outcomes are in $A$?</p>`,
      steps:[
        {do:`Total $\\Omega = 6^3 = 216$. For all the same, choose the common face value: 6 ways.`, why:`Once a face is fixed, all three dice show it — one outcome per face.`},
        {do:`$|A| = 6$.`, why:`$(1,1,1),(2,2,2),\\dots,(6,6,6)$.`}
      ],
      answer:`$6$ outcomes` },

    { q:`<p>Draw one card from 52. Let $A$ = "a red card", $B$ = "a number card 2 through 10". How many outcomes in $A \\cap B$?</p>`,
      steps:[
        {do:`Red suits (hearts, diamonds) are $2$ suits. Number cards 2-10 are $9$ ranks.`, why:`Count red number cards by suit times rank.`},
        {do:`$2 \\times 9 = 18$.`, why:`Two red suits, nine number ranks each.`}
      ],
      answer:`$18$ outcomes` },

    { q:`<p>Roll two dice. Let $A$ = "the larger of the two faces is exactly 4". How many outcomes are in $A$?</p>`,
      steps:[
        {do:`Both faces $\\le 4$: $4^2 = 16$ outcomes. Both faces $\\le 3$: $3^2 = 9$ outcomes.`, why:`Max is exactly 4 means max $\\le 4$ but not max $\\le 3$.`},
        {do:`$16 - 9 = 7$ outcomes.`, why:`Subtract to isolate "max exactly 4".`}
      ],
      answer:`$7$ outcomes` },

    { q:`<p>Five people sit in a row of five chairs at random. Let $A$ = "Anna and Ben sit next to each other". How many of the $5! = 120$ seatings are in $A$?</p>`,
      steps:[
        {do:`Glue Anna and Ben into one block: $4!$ ways to arrange 4 objects $= 24$.`, why:`Treating the pair as a single unit.`},
        {do:`The block can be Anna-Ben or Ben-Anna: $24 \\times 2 = 48$.`, why:`Two internal orders of the pair.`}
      ],
      answer:`$48$ seatings` },

    { q:`<p>Roll two dice. Let $A$ = "both faces are prime" (prime faces are $\\{2,3,5\\}$). How many outcomes in $A$?</p>`,
      steps:[
        {do:`Each die independently shows a prime in 3 of 6 ways.`, why:`Primes among $1$-$6$ are 2, 3, 5.`},
        {do:`$3 \\times 3 = 9$ outcomes.`, why:`Independent choices multiply.`}
      ],
      answer:`$9$ outcomes` },

    { q:`<p>A 6-character string uses letters from $\\{A, B\\}$. Let $E$ = "the string contains the substring $AA$ somewhere". Use the complement to count strings NOT in $E$ (no two adjacent $A$'s).</p>`,
      steps:[
        {do:`Strings of length $n$ with no two adjacent $A$'s number the Fibonacci value $F_{n+2}$. For $n=6$ that is $F_8 = 21$.`, why:`Each position appends $B$, or $A$ after a $B$ — the Fibonacci recurrence.`},
        {do:`Total strings $2^6 = 64$, so $|E| = 64 - 21 = 43$.`, why:`Complement: total minus the no-$AA$ strings.`}
      ],
      answer:`$43$ outcomes (21 have no $AA$)` },

    { q:`<p>Roll two dice. Let $A$ = "the two faces differ by at most 1" (equal or adjacent). How many outcomes are in $A$?</p>`,
      steps:[
        {do:`Equal faces: $(1,1),\\dots,(6,6)$ give 6 outcomes.`, why:`Six ways to match.`},
        {do:`Differ by exactly 1: pairs $(k,k+1)$ for $k=1..5$ and their reverses $= 5 + 5 = 10$.`, why:`Five adjacent pairs, each in two orders.`},
        {do:`$6 + 10 = 16$ outcomes.`, why:`Add the equal and adjacent counts.`}
      ],
      answer:`$16$ outcomes` },

    { q:`<p>From the digits $\\{1,2,3,4,5\\}$ a 3-digit number is formed with no repeated digit. Let $A$ = "the number is even". How many such numbers are in $A$?</p>`,
      steps:[
        {do:`Even means the last digit is 2 or 4: 2 choices.`, why:`Only those digits make the number even.`},
        {do:`Then fill the first two slots from the remaining 4 digits: $4 \\times 3 = 12$. Total $2 \\times 12 = 24$.`, why:`Order matters for the leading digits.`}
      ],
      answer:`$24$ numbers` },

    { q:`<p>Toss a coin until it shows heads or until 3 tosses have happened, whichever comes first. Write the sample space $\\Omega$ and count its outcomes.</p>`,
      steps:[
        {do:`Stop at first head: $H$ (toss 1), $TH$ (toss 2), $TTH$ (toss 3), and $TTT$ (three tails, no head).`, why:`The process halts on a head or after 3 tosses.`},
        {do:`$\\Omega = \\{H, TH, TTH, TTT\\}$, so $4$ outcomes.`, why:`List every stopping sequence.`}
      ],
      answer:`$\\Omega = \\{H, TH, TTH, TTT\\}$, $4$ outcomes` }
  ]);

  /* ---------------- prob-axioms ---------------- */
  add("prob-axioms", [
    { q:`<p>$P(A) = 0.5$, $P(B) = 0.6$, $P(A \\cap B) = 0.2$. Find $P(A^c \\cap B^c)$.</p>`,
      steps:[
        {do:`$P(A \\cup B) = 0.5 + 0.6 - 0.2 = 0.9$.`, why:`Inclusion-exclusion.`},
        {do:`$P(A^c \\cap B^c) = 1 - P(A \\cup B) = 1 - 0.9 = 0.1$.`, why:`De Morgan: neither equals not the union.`}
      ],
      answer:`$0.1$` },

    { q:`<p>$P(A) = 0.4$, $P(B) = 0.5$. What is the LARGEST possible value of $P(A \\cap B)$?</p>`,
      steps:[
        {do:`$P(A \\cap B) \\le \\min(P(A), P(B))$.`, why:`The overlap cannot exceed either event.`},
        {do:`$\\min(0.4, 0.5) = 0.4$.`, why:`Achieved when $A \\subseteq B$.`}
      ],
      answer:`$0.4$` },

    { q:`<p>$P(A \\cup B) = 0.9$, $P(A) = 0.5$, $P(A \\cap B) = 0.3$. Find $P(B)$.</p>`,
      steps:[
        {do:`$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.`, why:`Inclusion-exclusion.`},
        {do:`$0.9 = 0.5 + P(B) - 0.3$, so $P(B) = 0.9 - 0.2 = 0.7$.`, why:`Solve for $P(B)$.`}
      ],
      answer:`$P(B) = 0.7$` },

    { q:`<p>$P(A) = 0.7$. Find $P(A \\cap B) + P(A \\cap B^c)$ for any event $B$.</p>`,
      steps:[
        {do:`$A$ splits into the part inside $B$ and the part outside $B$: $A = (A \\cap B) \\cup (A \\cap B^c)$, disjoint.`, why:`Every outcome of $A$ is either in $B$ or not.`},
        {do:`So the sum equals $P(A) = 0.7$.`, why:`Disjoint pieces of $A$ add back to $A$.`}
      ],
      answer:`$0.7$` },

    { q:`<p>$P(\\text{exactly one of }A, B) = 0.5$ and $P(A \\cap B) = 0.2$. Find $P(A \\cup B)$.</p>`,
      steps:[
        {do:`$P(A \\cup B) = P(\\text{exactly one}) + P(\\text{both})$.`, why:`The union is "exactly one" plus "both", which are disjoint.`},
        {do:`$= 0.5 + 0.2 = 0.7$.`, why:`Add the two disjoint pieces.`}
      ],
      answer:`$P(A \\cup B) = 0.7$` },

    { q:`<p>Three events have $P(A)=0.5$, $P(B)=0.4$, $P(C)=0.3$, with $P(A\\cap B)=0.2$, $P(A\\cap C)=0.1$, $P(B\\cap C)=0.1$, $P(A\\cap B\\cap C)=0.05$. Find $P(A \\cup B \\cup C)$.</p>`,
      steps:[
        {do:`Singles: $0.5 + 0.4 + 0.3 = 1.2$. Pairs: $0.2 + 0.1 + 0.1 = 0.4$.`, why:`Inclusion-exclusion for three events: add singles, subtract pairs, add triple.`},
        {do:`$1.2 - 0.4 + 0.05 = 0.85$.`, why:`Combine the three layers.`}
      ],
      answer:`$0.85$` },

    { q:`<p>$P(A) = 0.6$ and $P(B) = 0.7$. Show $A$ and $B$ cannot be disjoint.</p>`,
      steps:[
        {do:`If disjoint, $P(A \\cup B) = 0.6 + 0.7 = 1.3$.`, why:`Additivity for disjoint events.`},
        {do:`But $1.3 &gt; 1$ violates $P(\\Omega) = 1$, so they must overlap.`, why:`No probability can exceed 1.`}
      ],
      answer:`Impossible to be disjoint (would give $1.3 &gt; 1$)` },

    { q:`<p>A loaded die has $P(k) \\propto k$ for $k = 1, \\dots, 6$ (face $k$ has weight $k$). Find $P(\\text{roll} \\ge 5)$.</p>`,
      steps:[
        {do:`Total weight $1+2+3+4+5+6 = 21$, so $P(k) = \\frac{k}{21}$.`, why:`Normalize so probabilities sum to 1.`},
        {do:`$P(\\ge 5) = P(5) + P(6) = \\frac{5}{21} + \\frac{6}{21} = \\frac{11}{21}$.`, why:`Add the two top faces.`}
      ],
      answer:`$\\frac{11}{21}$` },

    { q:`<p>$P(A) = 0.8$, $P(B) = 0.5$. Find the smallest possible $P(A \\cap B)$.</p>`,
      steps:[
        {do:`$P(A \\cap B) \\ge P(A) + P(B) - 1$.`, why:`Since $P(A \\cup B) \\le 1$.`},
        {do:`$0.8 + 0.5 - 1 = 0.3$.`, why:`The overlap is forced to be at least this much.`}
      ],
      answer:`$0.3$` },

    { q:`<p>Outcomes $a, b, c, d$ have probabilities $0.1, 0.2, x, 2x$. Find $x$, then $P(\\{c, d\\})$.</p>`,
      steps:[
        {do:`Sum to 1: $0.1 + 0.2 + x + 2x = 1$, so $3x = 0.7$, $x = \\frac{0.7}{3} \\approx 0.2333$.`, why:`Normalization axiom.`},
        {do:`$P(\\{c,d\\}) = x + 2x = 3x = 0.7$.`, why:`The two remaining outcomes hold all leftover probability.`}
      ],
      answer:`$x \\approx 0.233$, $P(\\{c,d\\}) = 0.7$` },

    { q:`<p>$P(A^c) = 0.3$ and $P(B^c) = 0.4$. Find $P(A)$ and $P(B)$, then explain why $P(A \\cup B) \\ge 0.7$.</p>`,
      steps:[
        {do:`$P(A) = 1 - 0.3 = 0.7$, $P(B) = 1 - 0.4 = 0.6$.`, why:`Complement rule.`},
        {do:`$P(A \\cup B) \\ge P(A) = 0.7$.`, why:`The union always contains $A$, so it is at least as likely.`}
      ],
      answer:`$P(A)=0.7$, $P(B)=0.6$, $P(A\\cup B)\\ge 0.7$` },

    { q:`<p>A jar's marble is red, green, or blue with $P(\\text{red}) = 2\\,P(\\text{green})$ and $P(\\text{blue}) = P(\\text{green})$. Find each probability.</p>`,
      steps:[
        {do:`Let $P(\\text{green}) = g$. Then red $= 2g$, blue $= g$, and $2g + g + g = 4g = 1$.`, why:`The three colors partition the sample space.`},
        {do:`$g = 0.25$, so red $= 0.5$, green $= 0.25$, blue $= 0.25$.`, why:`Solve and back-substitute.`}
      ],
      answer:`red $0.5$, green $0.25$, blue $0.25$` },

    { q:`<p>$A$ and $B$ are stated disjoint with $P(A) = 0.45$, $P(B) = 0.55$. Is $\\{A, B\\}$ a valid partition of $\\Omega$?</p>`,
      steps:[
        {do:`A partition needs disjoint pieces summing to 1: $0.45 + 0.55 = 1.0$.`, why:`Normalization requires the pieces to total 1.`},
        {do:`Since they are disjoint and sum to 1, yes — $\\{A, B\\}$ is a valid partition.`, why:`Both conditions hold.`}
      ],
      answer:`Yes, valid partition (sum $= 1$)` }
  ]);

  /* ---------------- prob-conditional ---------------- */
  add("prob-conditional", [
    { q:`<p>An urn has 4 red, 3 green, 2 blue balls. Draw three without replacement. Find $P(\\text{red, then green, then blue})$ in that order.</p>`,
      steps:[
        {do:`$P(\\text{1st red}) = \\frac{4}{9}$.`, why:`4 red of 9 balls.`},
        {do:`$P(\\text{green} \\mid \\text{red}) = \\frac{3}{8}$, $P(\\text{blue} \\mid \\text{red, green}) = \\frac{2}{7}$.`, why:`Each draw removes one ball.`},
        {do:`$\\frac{4}{9} \\times \\frac{3}{8} \\times \\frac{2}{7} = \\frac{24}{504} = \\frac{1}{21}$.`, why:`Chain rule.`}
      ],
      answer:`$\\frac{1}{21}$` },

    { q:`<p>Roll two dice. Given that the first die is larger than the second, find $P(\\text{the first die is a 6})$.</p>`,
      steps:[
        {do:`"First larger" has $\\binom{6}{2} = 15$ ordered outcomes (one per unordered distinct pair).`, why:`Of the 30 unequal pairs, exactly half have the first larger.`},
        {do:`First is 6 and larger: second $\\in \\{1,2,3,4,5\\}$, that is 5 outcomes.`, why:`Six beats all smaller faces.`},
        {do:`$P = \\frac{5}{15} = \\frac{1}{3}$.`, why:`Favorable over the conditioned world.`}
      ],
      answer:`$\\frac{1}{3}$` },

    { q:`<p>A family has 3 children, each a boy or girl with chance $\\frac{1}{2}$. Given at least 2 are girls, find $P(\\text{all 3 are girls})$.</p>`,
      steps:[
        {do:`At least 2 girls: exactly 2 ($\\binom{3}{2}=3$) plus exactly 3 ($1$) $= 4$ of the 8 outcomes.`, why:`Count the conditioned world.`},
        {do:`All girls is 1 outcome: $P = \\frac{1}{4}$.`, why:`Favorable over the 4 equally likely outcomes.`}
      ],
      answer:`$\\frac{1}{4}$` },

    { q:`<p>Cards are dealt one at a time from 52. Find $P(\\text{first two are both aces})$.</p>`,
      steps:[
        {do:`$P(\\text{1st ace}) = \\frac{4}{52} = \\frac{1}{13}$.`, why:`Four aces of 52.`},
        {do:`$P(\\text{2nd ace} \\mid \\text{1st ace}) = \\frac{3}{51} = \\frac{1}{17}$.`, why:`Three aces left of 51 cards.`},
        {do:`$\\frac{1}{13} \\times \\frac{1}{17} = \\frac{1}{221}$.`, why:`Chain rule.`}
      ],
      answer:`$\\frac{1}{221}$` },

    { q:`<p>$P(A \\mid B) = 0.6$, $P(B) = 0.5$, $P(A) = 0.4$. Find $P(B \\mid A)$.</p>`,
      steps:[
        {do:`$P(A \\cap B) = P(A \\mid B)\\,P(B) = 0.6 \\times 0.5 = 0.3$.`, why:`Multiply to get the joint.`},
        {do:`$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{0.3}{0.4} = 0.75$.`, why:`Definition of conditional probability.`}
      ],
      answer:`$P(B \\mid A) = 0.75$` },

    { q:`<p>In a deck, given the drawn card is a face card (J, Q, K) OR an ace (16 cards total), find $P(\\text{it is an ace})$.</p>`,
      steps:[
        {do:`The conditioned world has $12 + 4 = 16$ cards.`, why:`12 face cards plus 4 aces.`},
        {do:`$P(\\text{ace} \\mid \\text{face or ace}) = \\frac{4}{16} = \\frac{1}{4}$.`, why:`Four aces over the 16-card world.`}
      ],
      answer:`$\\frac{1}{4}$` },

    { q:`<p>Two dice are rolled. Given the sum is at least 10, find $P(\\text{a double was rolled})$ (both faces equal).</p>`,
      steps:[
        {do:`Sum $\\ge 10$: sum 10 (3 ways), sum 11 (2), sum 12 (1) $= 6$ outcomes.`, why:`Count ordered pairs.`},
        {do:`Doubles among them: $(5,5)$ and $(6,6)$, that is 2.`, why:`Equal faces summing to $\\ge 10$.`},
        {do:`$P = \\frac{2}{6} = \\frac{1}{3}$.`, why:`Favorable over the conditioned world.`}
      ],
      answer:`$\\frac{1}{3}$` },

    { q:`<p>$60\\%$ of a store's shoppers are members. $70\\%$ of members and $20\\%$ of non-members make a purchase. Given a shopper made a purchase, find $P(\\text{member} \\mid \\text{purchase})$.</p>`,
      steps:[
        {do:`$P(\\text{purchase}) = 0.6(0.7) + 0.4(0.2) = 0.42 + 0.08 = 0.50$.`, why:`Total probability.`},
        {do:`$P(\\text{member} \\mid \\text{purchase}) = \\frac{0.42}{0.50} = 0.84$.`, why:`Joint over the total.`}
      ],
      answer:`$0.84$` },

    { q:`<p>Draw 2 cards without replacement from 52. Find $P(\\text{both red})$.</p>`,
      steps:[
        {do:`$P(\\text{1st red}) = \\frac{26}{52} = \\frac{1}{2}$.`, why:`26 red cards.`},
        {do:`$P(\\text{2nd red} \\mid \\text{1st red}) = \\frac{25}{51}$.`, why:`One red gone.`},
        {do:`$\\frac{1}{2} \\times \\frac{25}{51} = \\frac{25}{102}$.`, why:`Chain rule.`}
      ],
      answer:`$\\frac{25}{102}$` },

    { q:`<p>A box has 6 fair coins and 1 two-headed coin. You pick one coin and flip it; it lands heads. Find $P(\\text{you picked the two-headed coin} \\mid \\text{heads})$.</p>`,
      steps:[
        {do:`$P(H) = \\frac{6}{7}\\cdot\\frac{1}{2} + \\frac{1}{7}\\cdot 1 = \\frac{3}{7} + \\frac{1}{7} = \\frac{4}{7}$.`, why:`Total probability over the coin types.`},
        {do:`$P(\\text{2-headed} \\mid H) = \\frac{(1/7)(1)}{4/7} = \\frac{1/7}{4/7} = \\frac{1}{4}$.`, why:`Joint over the total.`}
      ],
      answer:`$\\frac{1}{4}$` },

    { q:`<p>Roll two dice. Given that at least one die shows a 6, find $P(\\text{the sum is 9})$.</p>`,
      steps:[
        {do:`"At least one 6" has $11$ outcomes ($6 + 6 - 1$ for the shared $(6,6)$).`, why:`Six with first 6, six with second 6, minus the double-counted $(6,6)$.`},
        {do:`Sum 9 with a 6: $(3,6)$ and $(6,3)$, that is 2.`, why:`Only these total 9 and include a 6.`},
        {do:`$P = \\frac{2}{11}$.`, why:`Favorable over the conditioned world.`}
      ],
      answer:`$\\frac{2}{11}$` },

    { q:`<p>A test bank has 20 questions; you studied 15. The exam draws 3 at random. Find $P(\\text{you studied all 3})$.</p>`,
      steps:[
        {do:`$P(\\text{1st studied}) = \\frac{15}{20}$.`, why:`15 of 20 are studied.`},
        {do:`Then $\\frac{14}{19}$ and $\\frac{13}{18}$ for the next two.`, why:`Each studied question removed shrinks the counts.`},
        {do:`$\\frac{15}{20}\\cdot\\frac{14}{19}\\cdot\\frac{13}{18} = \\frac{2730}{6840} \\approx 0.399$.`, why:`Chain rule.`}
      ],
      answer:`$\\approx 0.399$` },

    { q:`<p>$P(A \\mid B) = 0.3$ and $P(A \\mid B^c) = 0.6$, with $P(B) = 0.4$. Find $P(A)$, then $P(B \\mid A)$.</p>`,
      steps:[
        {do:`$P(A) = 0.3(0.4) + 0.6(0.6) = 0.12 + 0.36 = 0.48$.`, why:`Total probability over $B$ and $B^c$.`},
        {do:`$P(B \\mid A) = \\frac{P(A \\mid B)P(B)}{P(A)} = \\frac{0.12}{0.48} = 0.25$.`, why:`Bayes' rule.`}
      ],
      answer:`$P(A) = 0.48$, $P(B \\mid A) = 0.25$` },

    { q:`<p>Three cards are drawn without replacement from 52. Find $P(\\text{no hearts among the three})$.</p>`,
      steps:[
        {do:`$P(\\text{1st non-heart}) = \\frac{39}{52}$.`, why:`39 non-hearts of 52.`},
        {do:`Then $\\frac{38}{51}$ and $\\frac{37}{50}$.`, why:`Each non-heart removed.`},
        {do:`$\\frac{39}{52}\\cdot\\frac{38}{51}\\cdot\\frac{37}{50} = \\frac{54834}{132600} \\approx 0.4135$.`, why:`Chain rule.`}
      ],
      answer:`$\\approx 0.4135$` }
  ]);

  /* ---------------- prob-bayes ---------------- */
  add("prob-bayes", [
    { q:`<p>Three boxes: box 1 has 2 gold, 8 silver coins; box 2 has 5 gold, 5 silver; box 3 has 9 gold, 1 silver. A box is picked uniformly and a coin drawn is gold. Find $P(\\text{box 3} \\mid \\text{gold})$.</p>`,
      steps:[
        {do:`Gold rates: $0.2, 0.5, 0.9$; each box prob $\\frac{1}{3}$. $P(\\text{gold}) = \\frac{1}{3}(0.2 + 0.5 + 0.9) = \\frac{1.6}{3}$.`, why:`Total probability over the three boxes.`},
        {do:`$P(\\text{box 3} \\mid \\text{gold}) = \\frac{(1/3)(0.9)}{1.6/3} = \\frac{0.9}{1.6} = 0.5625$.`, why:`Bayes; the equal priors cancel.`}
      ],
      answer:`$0.5625$` },

    { q:`<p>A disease has prevalence $2\\%$. A test gives a positive on $95\\%$ of sick and $5\\%$ of healthy people. Among those who test NEGATIVE, what fraction is healthy?</p>`,
      steps:[
        {do:`$P(-) = 0.05(0.02) + 0.95(0.98) = 0.001 + 0.931 = 0.932$.`, why:`Total probability of a negative test.`},
        {do:`$P(\\text{healthy} \\mid -) = \\frac{0.95 \\times 0.98}{0.932} = \\frac{0.931}{0.932} \\approx 0.9989$.`, why:`Bayes; a negative is very reassuring.`}
      ],
      answer:`$\\approx 0.9989$` },

    { q:`<p>Spam is $40\\%$ of email. A spam email contains a suspicious link $80\\%$ of the time; legitimate email, $10\\%$. An email has NO link. Find $P(\\text{spam} \\mid \\text{no link})$.</p>`,
      steps:[
        {do:`$P(\\text{no link} \\mid \\text{spam}) = 0.2$, $P(\\text{no link} \\mid \\text{legit}) = 0.9$.`, why:`Complements of the link rates.`},
        {do:`$P(\\text{no link}) = 0.4(0.2) + 0.6(0.9) = 0.08 + 0.54 = 0.62$.`, why:`Total probability.`},
        {do:`$P(\\text{spam} \\mid \\text{no link}) = \\frac{0.08}{0.62} \\approx 0.129$.`, why:`Bayes' rule.`}
      ],
      answer:`$\\approx 0.129$` },

    { q:`<p>A coin is fair (prior $0.8$) or biased with $P(H) = 0.75$ (prior $0.2$). You flip twice and get two heads. Find $P(\\text{biased} \\mid HH)$.</p>`,
      steps:[
        {do:`$P(HH \\mid \\text{fair}) = 0.25$, $P(HH \\mid \\text{biased}) = 0.75^2 = 0.5625$.`, why:`Two independent heads.`},
        {do:`$P(HH) = 0.8(0.25) + 0.2(0.5625) = 0.2 + 0.1125 = 0.3125$.`, why:`Total probability.`},
        {do:`$P(\\text{biased} \\mid HH) = \\frac{0.1125}{0.3125} = 0.36$.`, why:`Bayes' rule.`}
      ],
      answer:`$0.36$` },

    { q:`<p>$1\\%$ of transactions are fraud. A model flags $90\\%$ of fraud and $2\\%$ of legitimate transactions. A flagged transaction is then flagged AGAIN by an independent second model with the same rates. Find $P(\\text{fraud} \\mid \\text{both flag})$.</p>`,
      steps:[
        {do:`Fraud path: $0.01 \\times 0.90 \\times 0.90 = 0.0081$.`, why:`Prior times two independent flag likelihoods.`},
        {do:`Legit path: $0.99 \\times 0.02 \\times 0.02 = 0.000396$.`, why:`Same for legitimate transactions.`},
        {do:`$P(\\text{fraud} \\mid \\text{both}) = \\frac{0.0081}{0.0081 + 0.000396} = \\frac{0.0081}{0.008496} \\approx 0.953$.`, why:`Bayes over the total evidence.`}
      ],
      answer:`$\\approx 0.953$` },

    { q:`<p>A monitor is in normal state ($80\\%$) or fault state ($20\\%$). It emits an alarm with chance $5\\%$ when normal and $60\\%$ when faulty. An alarm sounds. Find $P(\\text{fault} \\mid \\text{alarm})$.</p>`,
      steps:[
        {do:`$P(\\text{alarm}) = 0.8(0.05) + 0.2(0.60) = 0.04 + 0.12 = 0.16$.`, why:`Total probability of an alarm.`},
        {do:`$P(\\text{fault} \\mid \\text{alarm}) = \\frac{0.12}{0.16} = 0.75$.`, why:`Bayes' rule.`}
      ],
      answer:`$0.75$` },

    { q:`<p>Two factories: A ($60\\%$, defect $3\\%$) and B ($40\\%$, defect $7\\%$). Two items are picked from the SAME randomly chosen factory and BOTH are defective (defects independent given factory). Find $P(\\text{A} \\mid \\text{both defective})$.</p>`,
      steps:[
        {do:`A path: $0.6 \\times 0.03^2 = 0.6 \\times 0.0009 = 0.00054$.`, why:`Prior times two independent defects.`},
        {do:`B path: $0.4 \\times 0.07^2 = 0.4 \\times 0.0049 = 0.00196$.`, why:`Same for B.`},
        {do:`$P(\\text{A} \\mid \\text{both}) = \\frac{0.00054}{0.00054 + 0.00196} = \\frac{0.00054}{0.0025} = 0.216$.`, why:`Bayes; the high defect rate points to B.`}
      ],
      answer:`$0.216$` },

    { q:`<p>A weather app says rain on $70\\%$ of days that actually rain and $20\\%$ of dry days. Historically $30\\%$ of days are rainy. The app predicts rain. Find $P(\\text{actually rains} \\mid \\text{predicts rain})$.</p>`,
      steps:[
        {do:`$P(\\text{predict rain}) = 0.3(0.7) + 0.7(0.2) = 0.21 + 0.14 = 0.35$.`, why:`Total probability.`},
        {do:`$P(\\text{rain} \\mid \\text{predict}) = \\frac{0.21}{0.35} = 0.6$.`, why:`Bayes' rule.`}
      ],
      answer:`$0.6$` },

    { q:`<p>A die is fair (prior $\\frac{1}{2}$) or loaded with $P(6) = \\frac{1}{2}$ (prior $\\frac{1}{2}$). You roll twice and get two sixes. Find $P(\\text{loaded} \\mid \\text{two sixes})$.</p>`,
      steps:[
        {do:`$P(66 \\mid \\text{fair}) = (\\frac{1}{6})^2 = \\frac{1}{36}$, $P(66 \\mid \\text{loaded}) = (\\frac{1}{2})^2 = \\frac{1}{4}$.`, why:`Two independent sixes.`},
        {do:`$P(66) = \\frac{1}{2}\\cdot\\frac{1}{36} + \\frac{1}{2}\\cdot\\frac{1}{4} = \\frac{1}{72} + \\frac{9}{72} = \\frac{10}{72}$.`, why:`Total probability.`},
        {do:`$P(\\text{loaded} \\mid 66) = \\frac{9/72}{10/72} = \\frac{9}{10}$.`, why:`Bayes' rule.`}
      ],
      answer:`$\\frac{9}{10}$` },

    { q:`<p>$5\\%$ of widgets are from a faulty batch. Faulty widgets fail a stress test $80\\%$ of the time; good ones fail $2\\%$. A widget PASSES the test. Find $P(\\text{faulty} \\mid \\text{pass})$.</p>`,
      steps:[
        {do:`$P(\\text{pass} \\mid \\text{faulty}) = 0.2$, $P(\\text{pass} \\mid \\text{good}) = 0.98$.`, why:`Complements of the fail rates.`},
        {do:`$P(\\text{pass}) = 0.05(0.2) + 0.95(0.98) = 0.01 + 0.931 = 0.941$.`, why:`Total probability.`},
        {do:`$P(\\text{faulty} \\mid \\text{pass}) = \\frac{0.01}{0.941} \\approx 0.0106$.`, why:`Bayes' rule.`}
      ],
      answer:`$\\approx 0.0106$` },

    { q:`<p>A patient belongs to risk group low ($50\\%$), medium ($35\\%$), or high ($15\\%$), with event rates $2\\%$, $10\\%$, $40\\%$. The event occurred. Find $P(\\text{high} \\mid \\text{event})$.</p>`,
      steps:[
        {do:`$P(\\text{event}) = 0.5(0.02) + 0.35(0.10) + 0.15(0.40) = 0.01 + 0.035 + 0.06 = 0.105$.`, why:`Total probability over three groups.`},
        {do:`$P(\\text{high} \\mid \\text{event}) = \\frac{0.06}{0.105} \\approx 0.571$.`, why:`Bayes' rule for the high group.`}
      ],
      answer:`$\\approx 0.571$` },

    { q:`<p>A jar is type X (prior $\\frac{1}{3}$, $P(\\text{red ball}) = 0.2$) or type Y (prior $\\frac{2}{3}$, $P(\\text{red ball}) = 0.5$). You draw WITH replacement and get red, red. Find $P(\\text{Y} \\mid \\text{red, red})$.</p>`,
      steps:[
        {do:`X path: $\\frac{1}{3}\\times 0.2^2 = \\frac{1}{3}\\times 0.04 \\approx 0.0133$.`, why:`Prior times two independent reds.`},
        {do:`Y path: $\\frac{2}{3}\\times 0.5^2 = \\frac{2}{3}\\times 0.25 \\approx 0.1667$.`, why:`Same for Y.`},
        {do:`$P(\\text{Y} \\mid RR) = \\frac{0.1667}{0.1667 + 0.0133} = \\frac{0.1667}{0.18} \\approx 0.926$.`, why:`Bayes' rule.`}
      ],
      answer:`$\\approx 0.926$` },

    { q:`<p>A signal is "1" (prior $0.6$) or "0" (prior $0.4$). A noisy channel flips bits with probability $0.1$. You receive a "1". Find $P(\\text{sent 1} \\mid \\text{received 1})$.</p>`,
      steps:[
        {do:`$P(\\text{rec 1} \\mid \\text{sent 1}) = 0.9$, $P(\\text{rec 1} \\mid \\text{sent 0}) = 0.1$.`, why:`Correct with $0.9$, flipped with $0.1$.`},
        {do:`$P(\\text{rec 1}) = 0.6(0.9) + 0.4(0.1) = 0.54 + 0.04 = 0.58$.`, why:`Total probability.`},
        {do:`$P(\\text{sent 1} \\mid \\text{rec 1}) = \\frac{0.54}{0.58} \\approx 0.931$.`, why:`Bayes' rule.`}
      ],
      answer:`$\\approx 0.931$` },

    { q:`<p>Continue the two-coin problem (fair prior $\\frac{1}{2}$, two-headed prior $\\frac{1}{2}$). After $HH$ the posterior on two-headed is $\\frac{4}{5}$. You flip once more and get another head. Find the updated $P(\\text{two-headed} \\mid HHH)$.</p>`,
      steps:[
        {do:`Use posterior $\\frac{4}{5}$ (two-headed), $\\frac{1}{5}$ (fair) as the new prior. $P(H \\mid \\text{fair}) = \\frac{1}{2}$, $P(H \\mid \\text{2-headed}) = 1$.`, why:`Sequential Bayes carries the posterior forward.`},
        {do:`$P(H) = \\frac{1}{5}\\cdot\\frac{1}{2} + \\frac{4}{5}\\cdot 1 = \\frac{1}{10} + \\frac{8}{10} = \\frac{9}{10}$.`, why:`Total probability of the new head.`},
        {do:`$P(\\text{2-headed} \\mid HHH) = \\frac{4/5}{9/10} = \\frac{8/10}{9/10} = \\frac{8}{9}$.`, why:`Bayes' rule; matches a one-shot update from the start.`}
      ],
      answer:`$\\frac{8}{9}$` }
  ]);

  /* ---------------- prob-total-prob ---------------- */
  add("prob-total-prob", [
    { q:`<p>An urn has 5 red and 5 blue. Draw three without replacement. Find $P(\\text{3rd ball is red})$.</p>`,
      steps:[
        {do:`By symmetry, every position is equally likely to be any specific ball, so $P(\\text{3rd red}) = P(\\text{1st red})$.`, why:`Exchangeability: order does not change a single position's marginal.`},
        {do:`$P(\\text{1st red}) = \\frac{5}{10} = \\frac{1}{2}$.`, why:`Five red of ten.`}
      ],
      answer:`$\\frac{1}{2}$` },

    { q:`<p>A player rolls a die. If it shows 6, they win immediately; otherwise they flip a coin and win on heads. Find $P(\\text{win})$.</p>`,
      steps:[
        {do:`Roll 6 ($P = \\frac{1}{6}$): win for sure, contribute $\\frac{1}{6}\\times 1 = \\frac{1}{6}$.`, why:`Weight the win by the case probability.`},
        {do:`Not 6 ($P = \\frac{5}{6}$): win on heads, $\\frac{5}{6}\\times\\frac{1}{2} = \\frac{5}{12}$.`, why:`Coin flip in the other case.`},
        {do:`$P(\\text{win}) = \\frac{2}{12} + \\frac{5}{12} = \\frac{7}{12}$.`, why:`Total probability.`}
      ],
      answer:`$\\frac{7}{12}$` },

    { q:`<p>Customers are new ($30\\%$), returning ($50\\%$), or VIP ($20\\%$) with purchase rates $0.1$, $0.3$, $0.6$. Find the overall purchase rate.</p>`,
      steps:[
        {do:`$0.30(0.1) + 0.50(0.3) = 0.03 + 0.15 = 0.18$.`, why:`New and returning contributions.`},
        {do:`$0.20(0.6) = 0.12$.`, why:`VIP contribution.`},
        {do:`$P(\\text{purchase}) = 0.18 + 0.12 = 0.30$.`, why:`Total probability over the three types.`}
      ],
      answer:`$0.30$` },

    { q:`<p>A signal passes through 2 relays. Relay 1 forwards correctly with prob $0.9$; if it fails ($0.1$) the signal is lost. If relay 1 succeeds, relay 2 forwards correctly with prob $0.8$. Find $P(\\text{signal arrives})$.</p>`,
      steps:[
        {do:`Both must work: $P = 0.9 \\times 0.8$.`, why:`Sequential success, conditioning on relay 1 working.`},
        {do:`$= 0.72$.`, why:`The lost-at-relay-1 branch contributes 0.`}
      ],
      answer:`$0.72$` },

    { q:`<p>A box is chosen: box 1 ($P = 0.4$) has 2 red of 6; box 2 ($P = 0.6$) has 5 red of 8. Find $P(\\text{red})$.</p>`,
      steps:[
        {do:`Box 1: $0.4 \\times \\frac{2}{6} = 0.4 \\times 0.3333 = 0.1333$.`, why:`Weight by box probability.`},
        {do:`Box 2: $0.6 \\times \\frac{5}{8} = 0.6 \\times 0.625 = 0.375$.`, why:`Same for box 2.`},
        {do:`$P(\\text{red}) = 0.1333 + 0.375 \\approx 0.508$.`, why:`Total probability.`}
      ],
      answer:`$\\approx 0.508$` },

    { q:`<p>A gambler plays one of three games chosen with probs $0.2$, $0.3$, $0.5$ and win rates $0.7$, $0.4$, $0.2$. Find the overall win probability.</p>`,
      steps:[
        {do:`$0.2(0.7) + 0.3(0.4) = 0.14 + 0.12 = 0.26$.`, why:`First two games.`},
        {do:`$0.5(0.2) = 0.10$.`, why:`Third game.`},
        {do:`$P(\\text{win}) = 0.26 + 0.10 = 0.36$.`, why:`Total probability.`}
      ],
      answer:`$0.36$` },

    { q:`<p>An email server routes through path 1 ($60\\%$, delivery rate $0.99$) or path 2 ($40\\%$, delivery rate $0.95$). Find the chance an email is delivered.</p>`,
      steps:[
        {do:`Path 1: $0.6 \\times 0.99 = 0.594$.`, why:`Weight by path probability.`},
        {do:`Path 2: $0.4 \\times 0.95 = 0.380$.`, why:`Same for path 2.`},
        {do:`$P(\\text{delivered}) = 0.594 + 0.380 = 0.974$.`, why:`Total probability.`}
      ],
      answer:`$0.974$` },

    { q:`<p>A two-stage test: stage 1 passes $80\\%$ of applicants. Those who pass go to stage 2, which passes $50\\%$. Find $P(\\text{an applicant passes both stages})$.</p>`,
      steps:[
        {do:`$P(\\text{both}) = P(\\text{stage 1})\\,P(\\text{stage 2} \\mid \\text{stage 1}) = 0.8 \\times 0.5$.`, why:`Conditioning on reaching stage 2.`},
        {do:`$= 0.40$.`, why:`Only applicants who pass stage 1 reach stage 2.`}
      ],
      answer:`$0.40$` },

    { q:`<p>A coin's bias $p$ is $0.3$, $0.5$, or $0.8$ with equal prior probability $\\frac{1}{3}$. You flip once. Find $P(\\text{heads})$.</p>`,
      steps:[
        {do:`$P(H) = \\frac{1}{3}(0.3 + 0.5 + 0.8)$.`, why:`Total probability; the average of the biases.`},
        {do:`$= \\frac{1}{3}(1.6) \\approx 0.533$.`, why:`Average bias.`}
      ],
      answer:`$\\approx 0.533$` },

    { q:`<p>A machine has three modes: idle ($P = 0.5$, $E[\\text{output}] = 0$), normal ($P = 0.4$, $E = 10$), boosted ($P = 0.1$, $E = 25$). Find the expected output $E[\\text{output}]$.</p>`,
      steps:[
        {do:`$0.5(0) + 0.4(10) = 0 + 4 = 4$.`, why:`Idle and normal contributions.`},
        {do:`$0.1(25) = 2.5$.`, why:`Boosted contribution.`},
        {do:`$E[\\text{output}] = 4 + 2.5 = 6.5$.`, why:`Total expectation over the modes.`}
      ],
      answer:`$E[\\text{output}] = 6.5$` },

    { q:`<p>A drug works on $90\\%$ of patients with gene G and $30\\%$ without. $25\\%$ of patients carry gene G. Find $P(\\text{drug works})$ for a random patient.</p>`,
      steps:[
        {do:`Gene G: $0.25 \\times 0.90 = 0.225$.`, why:`Weight by carrier rate.`},
        {do:`No gene G: $0.75 \\times 0.30 = 0.225$.`, why:`Same for non-carriers.`},
        {do:`$P(\\text{works}) = 0.225 + 0.225 = 0.45$.`, why:`Total probability.`}
      ],
      answer:`$0.45$` },

    { q:`<p>A factory runs shift A ($P = 0.5$, defect $1\\%$), shift B ($P = 0.3$, defect $2\\%$), shift C ($P = 0.2$, defect $5\\%$). Find the single-item defect rate.</p>`,
      steps:[
        {do:`$0.5(0.01) + 0.3(0.02) = 0.005 + 0.006 = 0.011$.`, why:`Shifts A and B.`},
        {do:`$0.2(0.05) = 0.010$.`, why:`Shift C.`},
        {do:`$P(\\text{defect}) = 0.011 + 0.010 = 0.021$.`, why:`Total probability over the shifts.`}
      ],
      answer:`$0.021$` },

    { q:`<p>An urn has 3 red and 7 blue. Draw two without replacement. Find $P(\\text{exactly one red})$ by conditioning on the first draw.</p>`,
      steps:[
        {do:`1st red ($\\frac{3}{10}$) then blue ($\\frac{7}{9}$): $\\frac{3}{10}\\cdot\\frac{7}{9} = \\frac{21}{90}$.`, why:`Red then blue.`},
        {do:`1st blue ($\\frac{7}{10}$) then red ($\\frac{3}{9}$): $\\frac{7}{10}\\cdot\\frac{3}{9} = \\frac{21}{90}$.`, why:`Blue then red.`},
        {do:`$P = \\frac{21}{90} + \\frac{21}{90} = \\frac{42}{90} = \\frac{7}{15}$.`, why:`Total probability over the two orders.`}
      ],
      answer:`$\\frac{7}{15}$` },

    { q:`<p>A network path uses router R1 ($P = 0.7$, latency-OK rate $0.95$) or R2 ($P = 0.3$, latency-OK rate $0.6$). Find $P(\\text{latency OK})$.</p>`,
      steps:[
        {do:`R1: $0.7 \\times 0.95 = 0.665$.`, why:`Weight by router usage.`},
        {do:`R2: $0.3 \\times 0.6 = 0.18$.`, why:`Same for R2.`},
        {do:`$P(\\text{OK}) = 0.665 + 0.18 = 0.845$.`, why:`Total probability.`}
      ],
      answer:`$0.845$` }
  ]);

  /* ---------------- prob-independence ---------------- */
  add("prob-independence", [
    { q:`<p>5 independent sensors each detect an event with probability $0.6$. Find $P(\\text{all 5 detect it})$.</p>`,
      steps:[
        {do:`Independent, so multiply: $0.6^5$.`, why:`Each sensor's detection is independent.`},
        {do:`$0.6^5 = 0.07776$.`, why:`Joint chance all five fire.`}
      ],
      answer:`$\\approx 0.0778$` },

    { q:`<p>A system has 4 independent backups, each working with probability $0.6$. Find $P(\\text{none work})$ and $P(\\text{exactly one works})$.</p>`,
      steps:[
        {do:`$P(\\text{none}) = 0.4^4 = 0.0256$.`, why:`Each fails with $0.4$, independently.`},
        {do:`$P(\\text{exactly one}) = \\binom{4}{1}(0.6)(0.4)^3 = 4 \\times 0.6 \\times 0.064 = 0.1536$.`, why:`One works, three fail; 4 placements.`}
      ],
      answer:`$P(\\text{none}) = 0.0256$, $P(\\text{one}) = 0.1536$` },

    { q:`<p>Continue: with 4 independent backups each working at $0.6$, find $P(\\text{at least 2 work})$.</p>`,
      steps:[
        {do:`$P(\\text{0 or 1 work}) = 0.0256 + 0.1536 = 0.1792$.`, why:`Sum the two low-count cases.`},
        {do:`$P(\\ge 2) = 1 - 0.1792 = 0.8208$.`, why:`Complement.`}
      ],
      answer:`$\\approx 0.8208$` },

    { q:`<p>$A$, $B$, $C$ are mutually independent with $P(A) = 0.5$, $P(B) = 0.4$, $P(C) = 0.3$. Find $P(A \\cup B \\cup C)$.</p>`,
      steps:[
        {do:`$P(\\text{none}) = (1-0.5)(1-0.4)(1-0.3) = 0.5 \\times 0.6 \\times 0.7 = 0.21$.`, why:`For independent events, complements multiply.`},
        {do:`$P(A \\cup B \\cup C) = 1 - 0.21 = 0.79$.`, why:`Complement of "none occur".`}
      ],
      answer:`$0.79$` },

    { q:`<p>$A$ and $B$ are independent with $P(A) = 0.3$, $P(B) = 0.6$. Find $P(A^c \\cap B^c)$.</p>`,
      steps:[
        {do:`Independence carries to complements: $P(A^c) = 0.7$, $P(B^c) = 0.4$.`, why:`$A^c$ and $B^c$ are also independent.`},
        {do:`$P(A^c \\cap B^c) = 0.7 \\times 0.4 = 0.28$.`, why:`Multiply the independent complements.`}
      ],
      answer:`$0.28$` },

    { q:`<p>A circuit works if (component 1 OR component 2) AND component 3 all hold. Each works independently with probability $0.8$. Find $P(\\text{circuit works})$.</p>`,
      steps:[
        {do:`$P(\\text{1 or 2}) = 1 - 0.2^2 = 1 - 0.04 = 0.96$.`, why:`Parallel pair: fails only if both fail.`},
        {do:`$P(\\text{works}) = 0.96 \\times 0.8 = 0.768$.`, why:`Series with component 3, independent.`}
      ],
      answer:`$0.768$` },

    { q:`<p>Flip a fair coin 6 times independently. Find $P(\\text{first 3 are heads and last 3 are tails})$, i.e. exactly $HHHTTT$.</p>`,
      steps:[
        {do:`Each flip is independent with probability $\\frac{1}{2}$.`, why:`Fair coin, independent flips.`},
        {do:`$P(HHHTTT) = (\\frac{1}{2})^6 = \\frac{1}{64}$.`, why:`One specific sequence of six.`}
      ],
      answer:`$\\frac{1}{64}$` },

    { q:`<p>Draw a card from 52. Let $A$ = "a spade" and $B$ = "a king". Are $A$ and $B$ independent?</p>`,
      steps:[
        {do:`$P(A) = \\frac{13}{52} = \\frac{1}{4}$, $P(B) = \\frac{4}{52} = \\frac{1}{13}$, $P(A \\cap B) = \\frac{1}{52}$ (king of spades).`, why:`One card is both.`},
        {do:`$P(A)P(B) = \\frac{1}{4}\\cdot\\frac{1}{13} = \\frac{1}{52} = P(A \\cap B)$, so independent.`, why:`Joint equals the product.`}
      ],
      answer:`Yes, independent` },

    { q:`<p>Three independent components each fail with probability $0.2$. Find $P(\\text{exactly one fails})$.</p>`,
      steps:[
        {do:`One specific component fails, the other two work: $0.2 \\times 0.8 \\times 0.8 = 0.128$.`, why:`Independent failures.`},
        {do:`Three choices of which one fails: $3 \\times 0.128 = 0.384$.`, why:`Sum over the disjoint placements.`}
      ],
      answer:`$0.384$` },

    { q:`<p>A password requires 4 independent checks, each passed with probability $0.9$. Find $P(\\text{all pass})$ and $P(\\text{at least one fails})$.</p>`,
      steps:[
        {do:`$P(\\text{all pass}) = 0.9^4 = 0.6561$.`, why:`Independent checks multiply.`},
        {do:`$P(\\text{at least one fails}) = 1 - 0.6561 = 0.3439$.`, why:`Complement.`}
      ],
      answer:`$0.6561$; $0.3439$` },

    { q:`<p>Two events: $P(A) = 0.5$, $P(B) = 0.5$, $P(A \\cup B) = 0.75$. Are $A$ and $B$ independent?</p>`,
      steps:[
        {do:`$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = 0.5 + 0.5 - 0.75 = 0.25$.`, why:`Inclusion-exclusion.`},
        {do:`$P(A)P(B) = 0.5 \\times 0.5 = 0.25 = P(A \\cap B)$, so independent.`, why:`Joint matches the product.`}
      ],
      answer:`Yes, independent` },

    { q:`<p>A relay network: two parallel branches, each branch is two components in series. All four components are independent and work with probability $0.9$. Find $P(\\text{network works})$ (works if at least one full branch works).</p>`,
      steps:[
        {do:`One branch works if both its components work: $0.9 \\times 0.9 = 0.81$.`, why:`Series within a branch.`},
        {do:`Network fails only if both branches fail: $P(\\text{works}) = 1 - (1 - 0.81)^2 = 1 - 0.19^2 = 1 - 0.0361$.`, why:`Parallel branches.`},
        {do:`$= 0.9639$.`, why:`Complement of both branches failing.`}
      ],
      answer:`$\\approx 0.9639$` },

    { q:`<p>$P(A) = 0.6$, $P(B) = 0.5$. If $A$ and $B$ are independent, find $P(\\text{exactly one of }A, B\\text{ occurs})$.</p>`,
      steps:[
        {do:`$P(A \\cap B^c) = 0.6 \\times 0.5 = 0.30$ and $P(A^c \\cap B) = 0.4 \\times 0.5 = 0.20$.`, why:`Independence carries to complements.`},
        {do:`Exactly one $= 0.30 + 0.20 = 0.50$.`, why:`The two disjoint "only one" cases.`}
      ],
      answer:`$0.50$` },

    { q:`<p>An archer hits with probability $0.7$ per shot, independently. Find $P(\\text{first miss occurs on shot 3})$ (hit, hit, miss).</p>`,
      steps:[
        {do:`Hit, hit, then miss: $0.7 \\times 0.7 \\times 0.3$.`, why:`Independent shots in sequence.`},
        {do:`$= 0.49 \\times 0.3 = 0.147$.`, why:`Multiply across the three shots.`}
      ],
      answer:`$0.147$` }
  ]);

  /* ---------------- prob-counting ---------------- */
  add("prob-counting", [
    { q:`<p>How many distinct arrangements of the letters in BANANA? (B(1), A(3), N(2), 6 letters.)</p>`,
      steps:[
        {do:`$\\frac{6!}{1!\\,3!\\,2!} = \\frac{720}{1 \\times 6 \\times 2} = \\frac{720}{12}$.`, why:`Divide out the orderings of identical letters.`},
        {do:`$= 60$.`, why:`Multinomial count.`}
      ],
      answer:`$60$ arrangements` },

    { q:`<p>From 7 people, how many ways to choose a president, a vice-president, and a treasurer (distinct roles, no person holds two)?</p>`,
      steps:[
        {do:`Order matters (roles differ): $\\frac{7!}{(7-3)!} = 7 \\times 6 \\times 5$.`, why:`Permutation of 3 from 7.`},
        {do:`$= 210$.`, why:`Three ordered slots.`}
      ],
      answer:`$210$ ways` },

    { q:`<p>A 5-card hand from 52. Find $P(\\text{a full house})$ — three of one rank and two of another.</p>`,
      steps:[
        {do:`Rank for the triple $\\binom{13}{1} = 13$ and its suits $\\binom{4}{3} = 4$. Rank for the pair $\\binom{12}{1} = 12$ and its suits $\\binom{4}{2} = 6$.`, why:`Choose the two ranks (ordered, since triple $\\ne$ pair) and the suits.`},
        {do:`Favorable $= 13 \\times 4 \\times 12 \\times 6 = 3744$.`, why:`Multiply the choices.`},
        {do:`$P = \\frac{3744}{2598960} \\approx 0.00144$.`, why:`Over all 5-card hands.`}
      ],
      answer:`$\\approx 0.00144$` },

    { q:`<p>How many 5-letter "words" (any letter sequence) use only the letters $A, B, C$ with NO two adjacent letters equal?</p>`,
      steps:[
        {do:`First letter: 3 choices. Each later letter: 2 choices (any but the previous).`, why:`Avoid repeating the adjacent letter.`},
        {do:`$3 \\times 2^4 = 3 \\times 16 = 48$.`, why:`Multiply the per-slot choices.`}
      ],
      answer:`$48$ words` },

    { q:`<p>In how many ways can 8 identical candies be distributed among 3 children (a child may get 0)? Use stars and bars.</p>`,
      steps:[
        {do:`Stars and bars: $\\binom{n + k - 1}{k - 1}$ with $n = 8$ candies, $k = 3$ children.`, why:`Place 2 dividers among 8 stars.`},
        {do:`$\\binom{8 + 2}{2} = \\binom{10}{2} = 45$.`, why:`Compute the combination.`}
      ],
      answer:`$45$ ways` },

    { q:`<p>How many 4-digit PINs (digits 0-9, repeats allowed) have all four digits DIFFERENT?</p>`,
      steps:[
        {do:`First digit 10 choices, then 9, 8, 7 (each must differ).`, why:`Each position avoids prior digits.`},
        {do:`$10 \\times 9 \\times 8 \\times 7 = 5040$.`, why:`Multiply the shrinking choices.`}
      ],
      answer:`$5040$ PINs` },

    { q:`<p>From a standard deck, how many 5-card hands contain exactly 2 kings?</p>`,
      steps:[
        {do:`Choose 2 of 4 kings $\\binom{4}{2} = 6$.`, why:`Pick which kings appear.`},
        {do:`Choose 3 non-kings from the other 48 cards $\\binom{48}{3} = 17296$.`, why:`The remaining cards must not be kings.`},
        {do:`$6 \\times 17296 = 103776$ hands.`, why:`Multiply the independent choices.`}
      ],
      answer:`$103776$ hands` },

    { q:`<p>How many ways can 6 people be seated around a ROUND table (rotations counted as the same)?</p>`,
      steps:[
        {do:`Fix one person to remove rotational symmetry, then arrange the other 5.`, why:`Circular permutations of $n$ number $(n-1)!$.`},
        {do:`$(6-1)! = 5! = 120$.`, why:`Arrange the remaining five.`}
      ],
      answer:`$120$ ways` },

    { q:`<p>A 5-card hand from 52. Find $P(\\text{exactly 3 hearts})$.</p>`,
      steps:[
        {do:`Choose 3 of 13 hearts $\\binom{13}{3} = 286$, and 2 of the 39 non-hearts $\\binom{39}{2} = 741$.`, why:`Split the hand by suit.`},
        {do:`Favorable $= 286 \\times 741 = 211926$.`, why:`Multiply the two choices.`},
        {do:`$P = \\frac{211926}{2598960} \\approx 0.0815$.`, why:`Over all 5-card hands.`}
      ],
      answer:`$\\approx 0.0815$` },

    { q:`<p>How many ways to arrange 3 red, 2 green, and 4 blue identical flags in a row (9 flags total)?</p>`,
      steps:[
        {do:`Multinomial: $\\frac{9!}{3!\\,2!\\,4!}$.`, why:`Divide out same-color orderings.`},
        {do:`$= \\frac{362880}{6 \\times 2 \\times 24} = \\frac{362880}{288} = 1260$.`, why:`Compute the count.`}
      ],
      answer:`$1260$ arrangements` },

    { q:`<p>How many subsets does a set of 7 elements have, and how many of those have exactly 3 elements?</p>`,
      steps:[
        {do:`Total subsets: $2^7 = 128$ (each element in or out).`, why:`Two choices per element.`},
        {do:`Three-element subsets: $\\binom{7}{3} = 35$.`, why:`Choose which 3 elements are included.`}
      ],
      answer:`$128$ subsets; $35$ of size 3` },

    { q:`<p>10 runners race. How many possible podiums (gold, silver, bronze, all distinct)?</p>`,
      steps:[
        {do:`Order matters: $\\frac{10!}{7!} = 10 \\times 9 \\times 8$.`, why:`Permutation of 3 from 10.`},
        {do:`$= 720$.`, why:`Three ranked positions.`}
      ],
      answer:`$720$ podiums` },

    { q:`<p>How many 3-digit numbers (100-999) have all distinct digits?</p>`,
      steps:[
        {do:`First digit: 9 choices (1-9, not 0). Second: 9 choices (0-9 except the first). Third: 8 choices.`, why:`Leading digit can't be 0; each later digit must differ.`},
        {do:`$9 \\times 9 \\times 8 = 648$.`, why:`Multiply the choices.`}
      ],
      answer:`$648$ numbers` },

    { q:`<p>A pizza shop has 8 toppings. How many pizzas can be made using any subset of toppings (including a plain pizza with none)?</p>`,
      steps:[
        {do:`Each topping is independently on or off: $2^8$.`, why:`Two states per topping.`},
        {do:`$= 256$ pizzas.`, why:`Includes the empty (plain) topping set.`}
      ],
      answer:`$256$ pizzas` }
  ]);

  /* ---------------- prob-random-variable ---------------- */
  add("prob-random-variable", [
    { q:`<p>Roll two dice; $X$ = absolute difference of the two faces. Find $p_X(0)$ and $p_X(5)$.</p>`,
      steps:[
        {do:`Difference 0 means equal faces: $(1,1),\\dots,(6,6)$, that is 6 outcomes. $p_X(0) = \\frac{6}{36} = \\frac{1}{6}$.`, why:`Six doubles.`},
        {do:`Difference 5 means $(1,6)$ or $(6,1)$: $p_X(5) = \\frac{2}{36} = \\frac{1}{18}$.`, why:`Only these two pairs differ by 5.`}
      ],
      answer:`$p_X(0) = \\frac{1}{6}$, $p_X(5) = \\frac{1}{18}$` },

    { q:`<p>A PMF is $p_X(k) = \\frac{c}{2^k}$ for $k = 1, 2, 3, \\dots$ Find $c$.</p>`,
      steps:[
        {do:`Sum to 1: $c\\sum_{k=1}^{\\infty}\\frac{1}{2^k} = c \\times 1 = 1$.`, why:`The geometric series $\\frac{1}{2} + \\frac{1}{4} + \\dots = 1$.`},
        {do:`$c = 1$.`, why:`The series already sums to 1.`}
      ],
      answer:`$c = 1$` },

    { q:`<p>Draw 3 balls without replacement from 4 red and 6 blue. Let $X$ = number of red. Find $p_X(2)$.</p>`,
      steps:[
        {do:`$p_X(2) = \\frac{\\binom{4}{2}\\binom{6}{1}}{\\binom{10}{3}}$.`, why:`Hypergeometric: choose 2 red, 1 blue.`},
        {do:`$= \\frac{6 \\times 6}{120} = \\frac{36}{120} = 0.3$.`, why:`Compute the counts.`}
      ],
      answer:`$p_X(2) = 0.3$` },

    { q:`<p>Roll a die repeatedly. Let $X$ = number of rolls to get the first 6. Find $P(X = 3)$.</p>`,
      steps:[
        {do:`Fail twice then succeed: $(\\frac{5}{6})^2 \\times \\frac{1}{6}$.`, why:`Geometric PMF.`},
        {do:`$= \\frac{25}{36} \\times \\frac{1}{6} = \\frac{25}{216} \\approx 0.1157$.`, why:`Multiply the failure and success chances.`}
      ],
      answer:`$\\approx 0.1157$` },

    { q:`<p>Roll three dice; $X$ = the maximum face. Find $p_X(6)$.</p>`,
      steps:[
        {do:`$P(\\max \\le 6) = 1$, $P(\\max \\le 5) = (\\frac{5}{6})^3 = \\frac{125}{216}$.`, why:`Max $\\le 5$ means all three $\\le 5$.`},
        {do:`$p_X(6) = 1 - \\frac{125}{216} = \\frac{91}{216} \\approx 0.421$.`, why:`Exactly 6 means max $\\le 6$ but not $\\le 5$.`}
      ],
      answer:`$p_X(6) = \\frac{91}{216}$` },

    { q:`<p>A PMF: $p_X(k) = c(4 - k)$ for $k = 0, 1, 2, 3$. Find $c$, then $E[X]$.</p>`,
      steps:[
        {do:`Weights $4, 3, 2, 1$ sum to $10$, so $c = 0.1$. PMF: $0.4, 0.3, 0.2, 0.1$.`, why:`Normalize.`},
        {do:`$E[X] = 0(0.4) + 1(0.3) + 2(0.2) + 3(0.1) = 0.3 + 0.4 + 0.3 = 1.0$.`, why:`Weighted average.`}
      ],
      answer:`$c = 0.1$, $E[X] = 1.0$` },

    { q:`<p>Flip a fair coin 4 times; $X$ = number of heads. Find $P(X = 2)$ and $P(X \\ge 3)$.</p>`,
      steps:[
        {do:`$P(X=2) = \\binom{4}{2}(\\frac{1}{2})^4 = \\frac{6}{16} = \\frac{3}{8}$.`, why:`Binomial PMF.`},
        {do:`$P(X \\ge 3) = \\frac{\\binom{4}{3} + \\binom{4}{4}}{16} = \\frac{4 + 1}{16} = \\frac{5}{16}$.`, why:`Add the top tail.`}
      ],
      answer:`$P(X=2) = \\frac{3}{8}$, $P(X \\ge 3) = \\frac{5}{16}$` },

    { q:`<p>Two fair dice; $X$ = sum. Find $P(X \\text{ is even})$.</p>`,
      steps:[
        {do:`Even sum needs both even or both odd: $3 \\times 3 + 3 \\times 3 = 18$ outcomes.`, why:`Even+even or odd+odd.`},
        {do:`$P = \\frac{18}{36} = \\frac{1}{2}$.`, why:`Favorable over total.`}
      ],
      answer:`$\\frac{1}{2}$` },

    { q:`<p>A spinner gives $X \\in \\{1, 2, 3, 4\\}$ with $p_X(k) \\propto k^2$. Find the PMF.</p>`,
      steps:[
        {do:`Weights $1, 4, 9, 16$ sum to $30$.`, why:`$k^2$ for each value.`},
        {do:`$p_X = \\frac{1}{30}, \\frac{4}{30}, \\frac{9}{30}, \\frac{16}{30}$.`, why:`Divide each weight by the total.`}
      ],
      answer:`$\\frac{1}{30}, \\frac{4}{30}, \\frac{9}{30}, \\frac{16}{30}$` },

    { q:`<p>Roll two dice; $X$ = the minimum face. Find $P(X \\ge 4)$.</p>`,
      steps:[
        {do:`$\\min \\ge 4$ means both faces $\\in \\{4,5,6\\}$: $3^2 = 9$ outcomes.`, why:`Both dice at least 4.`},
        {do:`$P(X \\ge 4) = \\frac{9}{36} = \\frac{1}{4}$.`, why:`Favorable over total.`}
      ],
      answer:`$P(X \\ge 4) = \\frac{1}{4}$` },

    { q:`<p>Draw cards one at a time without replacement from 52 until the first ace. Let $X$ = number of cards drawn. Find $P(X = 1)$.</p>`,
      steps:[
        {do:`$X = 1$ means the very first card is an ace.`, why:`The first draw succeeds.`},
        {do:`$P(X = 1) = \\frac{4}{52} = \\frac{1}{13}$.`, why:`Four aces of 52.`}
      ],
      answer:`$P(X = 1) = \\frac{1}{13}$` },

    { q:`<p>A discrete $X$ has CDF $F(0) = 0.2$, $F(1) = 0.5$, $F(2) = 0.9$, $F(3) = 1$. Find the PMF.</p>`,
      steps:[
        {do:`$p_X(k) = F(k) - F(k-1)$.`, why:`The PMF is the jump in the CDF at each value.`},
        {do:`$p_X(0)=0.2$, $p_X(1)=0.3$, $p_X(2)=0.4$, $p_X(3)=0.1$.`, why:`Successive differences.`}
      ],
      answer:`$0.2, 0.3, 0.4, 0.1$` },

    { q:`<p>Three fair coins; $X$ = number of heads. Find $P(X = 1 \\mid X \\le 1)$.</p>`,
      steps:[
        {do:`$p_X(0) = \\frac{1}{8}$, $p_X(1) = \\frac{3}{8}$, so $P(X \\le 1) = \\frac{4}{8} = \\frac{1}{2}$.`, why:`Add the two low counts.`},
        {do:`$P(X=1 \\mid X \\le 1) = \\frac{3/8}{4/8} = \\frac{3}{4}$.`, why:`Conditional within the restricted range.`}
      ],
      answer:`$\\frac{3}{4}$` },

    { q:`<p>$X$ = number of heads in 2 flips of a coin with $P(H) = 0.6$. Find the full PMF.</p>`,
      steps:[
        {do:`$p_X(0) = 0.4^2 = 0.16$, $p_X(2) = 0.6^2 = 0.36$.`, why:`Both tails or both heads.`},
        {do:`$p_X(1) = 2(0.6)(0.4) = 0.48$. Check: $0.16 + 0.48 + 0.36 = 1$.`, why:`One head in two ordered placements.`}
      ],
      answer:`$0.16, 0.48, 0.36$` }
  ]);

  /* ---------------- prob-expectation ---------------- */
  add("prob-expectation", [
    { q:`<p>A lottery ticket costs \\$3. It pays \\$100 with chance $0.01$, \\$10 with chance $0.05$, else \\$0. Find the expected NET gain per ticket.</p>`,
      steps:[
        {do:`Expected payout: $100(0.01) + 10(0.05) + 0 = 1 + 0.5 = 1.5$.`, why:`Weighted average of prizes.`},
        {do:`Net: $1.5 - 3 = -1.5$.`, why:`Subtract the ticket cost.`}
      ],
      answer:`$-\\$1.50$` },

    { q:`<p>Roll two dice; let $S$ = sum. Find $E[S^2]$ given $E[S] = 7$ and $\\operatorname{Var}(S) = \\frac{35}{6}$.</p>`,
      steps:[
        {do:`$E[S] = 7$ (each die averages 3.5).`, why:`Linearity over the two dice.`},
        {do:`$E[S^2] = \\operatorname{Var}(S) + (E[S])^2 = \\frac{35}{6} + 49 = \\frac{35 + 294}{6} = \\frac{329}{6} \\approx 54.83$.`, why:`Rearrange the variance formula.`}
      ],
      answer:`$E[S^2] = \\frac{329}{6}$` },

    { q:`<p>Draw 5 cards from 52. Let $X$ = number of hearts. Use indicators to find $E[X]$.</p>`,
      steps:[
        {do:`Each card is a heart with probability $\\frac{13}{52} = \\frac{1}{4}$, so $E[I_j] = \\frac{1}{4}$.`, why:`Symmetry across positions.`},
        {do:`$E[X] = 5 \\times \\frac{1}{4} = 1.25$.`, why:`Linearity of expectation.`}
      ],
      answer:`$E[X] = 1.25$` },

    { q:`<p>A coupon collector buys cereal boxes, each with one of 3 equally likely toys. Find the expected number of boxes to collect ALL 3 distinct toys.</p>`,
      steps:[
        {do:`Box 1: 1 box for the first new toy. Then expected waits $\\frac{3}{2}$ and $\\frac{3}{1}$ for the next two new toys.`, why:`Geometric waits; chance of a NEW toy is $\\frac{2}{3}$ then $\\frac{1}{3}$.`},
        {do:`$E = 1 + \\frac{3}{2} + 3 = 5.5$.`, why:`Sum the expected waits.`}
      ],
      answer:`$5.5$ boxes` },

    { q:`<p>$X$ takes values $-3, 1, 4$ with chances $0.2, 0.5, 0.3$. Find $E[X]$ and $E[2X - 1]$.</p>`,
      steps:[
        {do:`$E[X] = -3(0.2) + 1(0.5) + 4(0.3) = -0.6 + 0.5 + 1.2 = 1.1$.`, why:`Weighted average.`},
        {do:`$E[2X - 1] = 2(1.1) - 1 = 1.2$.`, why:`Linearity of expectation.`}
      ],
      answer:`$E[X] = 1.1$, $E[2X-1] = 1.2$` },

    { q:`<p>A game pays the value rolled on a die, but if you roll a 1 you pay \\$4 (a $-4$ payoff). Find the expected payoff.</p>`,
      steps:[
        {do:`Faces 2-6 pay their value: $(2+3+4+5+6)\\times\\frac{1}{6} = 20 \\times \\frac{1}{6} = \\frac{20}{6}$.`, why:`Each face has chance $\\frac{1}{6}$.`},
        {do:`Face 1 pays $-4$: $-4 \\times \\frac{1}{6} = -\\frac{4}{6}$. Total $\\frac{20 - 4}{6} = \\frac{16}{6} \\approx 2.67$.`, why:`Add the negative payoff.`}
      ],
      answer:`$\\approx \\$2.67$` },

    { q:`<p>$n = 8$ people randomly receive their 8 hats back (a random permutation). Let $X$ = number of correct matches. Find $E[X]$.</p>`,
      steps:[
        {do:`Each person matches with probability $\\frac{1}{8}$.`, why:`Symmetry of the random permutation.`},
        {do:`$E[X] = 8 \\times \\frac{1}{8} = 1$.`, why:`Linearity; expected matches is always 1.`}
      ],
      answer:`$E[X] = 1$` },

    { q:`<p>A Geometric variable counts trials until the first success with $p = 0.25$. Find $E[X]$.</p>`,
      steps:[
        {do:`$E[X] = \\frac{1}{p}$.`, why:`Mean of the Geometric distribution.`},
        {do:`$= \\frac{1}{0.25} = 4$.`, why:`Rarer success means longer wait.`}
      ],
      answer:`$E[X] = 4$` },

    { q:`<p>A binomial $X \\sim \\text{Bin}(12, 0.25)$. Find $E[X]$ and $E[3X + 2]$.</p>`,
      steps:[
        {do:`$E[X] = np = 12 \\times 0.25 = 3$.`, why:`Binomial mean.`},
        {do:`$E[3X + 2] = 3(3) + 2 = 11$.`, why:`Linearity of expectation.`}
      ],
      answer:`$E[X] = 3$, $E[3X+2] = 11$` },

    { q:`<p>An insurance policy pays \\$5000 with chance $0.02$ and \\$500 with chance $0.1$, else \\$0. The premium is \\$200. Find the insurer's expected profit per policy.</p>`,
      steps:[
        {do:`Expected payout: $5000(0.02) + 500(0.1) = 100 + 50 = 150$.`, why:`Weighted average of claims.`},
        {do:`Profit: premium minus payout $= 200 - 150 = 50$.`, why:`Insurer keeps the premium and pays claims.`}
      ],
      answer:`$\\$50$` },

    { q:`<p>$X$ = number of heads in 3 flips of a fair coin. Find $E[X^2]$. (Use $p_X = \\frac{1}{8}, \\frac{3}{8}, \\frac{3}{8}, \\frac{1}{8}$ for $k = 0,1,2,3$.)</p>`,
      steps:[
        {do:`$E[X^2] = 0^2\\frac{1}{8} + 1^2\\frac{3}{8} + 2^2\\frac{3}{8} + 3^2\\frac{1}{8}$.`, why:`Square each value, weight by PMF.`},
        {do:`$= \\frac{0 + 3 + 12 + 9}{8} = \\frac{24}{8} = 3$.`, why:`Sum and divide.`}
      ],
      answer:`$E[X^2] = 3$` },

    { q:`<p>A weighted spinner pays $X = 1, 2, 5, 10$ with probabilities $0.4, 0.3, 0.2, 0.1$. Find $E[X]$.</p>`,
      steps:[
        {do:`$1(0.4) + 2(0.3) = 0.4 + 0.6 = 1.0$.`, why:`First two values.`},
        {do:`$5(0.2) + 10(0.1) = 1.0 + 1.0 = 2.0$. Total $E[X] = 3.0$.`, why:`Add all weighted values.`}
      ],
      answer:`$E[X] = 3.0$` },

    { q:`<p>Roll a die. If even, you win the face value; if odd, you win nothing. Find the expected winnings.</p>`,
      steps:[
        {do:`Even faces 2, 4, 6 each pay their value with chance $\\frac{1}{6}$: $(2+4+6)\\frac{1}{6} = \\frac{12}{6} = 2$.`, why:`Only even faces pay.`},
        {do:`Odd faces pay 0. $E[\\text{win}] = 2$.`, why:`Odd contributions are zero.`}
      ],
      answer:`$E[\\text{win}] = 2$` },

    { q:`<p>You flip a coin (head with $p = 0.5$) until the first tail; you win \\$1 for each head before that tail. Find the expected number of heads before the first tail.</p>`,
      steps:[
        {do:`Number of heads before the first tail is Geometric-shifted: $E = \\frac{p}{1-p} = \\frac{0.5}{0.5}$.`, why:`Expected failures before the first success, with success $= $ tail.`},
        {do:`$= 1$.`, why:`On average one head precedes the first tail.`}
      ],
      answer:`$E = 1$` }
  ]);

  /* ---------------- prob-variance ---------------- */
  add("prob-variance", [
    { q:`<p>$X$ takes values $0, 1, 2, 3$ each with probability $\\frac{1}{4}$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`$E[X] = \\frac{0+1+2+3}{4} = 1.5$.`, why:`Uniform mean.`},
        {do:`$E[X^2] = \\frac{0+1+4+9}{4} = \\frac{14}{4} = 3.5$.`, why:`Average the squares.`},
        {do:`$\\operatorname{Var}(X) = 3.5 - 1.5^2 = 3.5 - 2.25 = 1.25$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 1.25$` },

    { q:`<p>$\\operatorname{Var}(X) = 9$. Find $\\operatorname{Var}(-3X + 5)$ and the standard deviation of $-3X + 5$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(aX + b) = a^2\\operatorname{Var}(X) = (-3)^2 \\times 9 = 81$.`, why:`The shift drops; the scale squares.`},
        {do:`$\\sigma = \\sqrt{81} = 9$.`, why:`Standard deviation is the square root.`}
      ],
      answer:`$\\operatorname{Var} = 81$, $\\sigma = 9$` },

    { q:`<p>$X, Y, Z$ are independent, each with variance $2$. Find $\\operatorname{Var}(X + Y + Z)$ and $\\operatorname{Var}(2X - Y)$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(X+Y+Z) = 2 + 2 + 2 = 6$.`, why:`Independent variances add.`},
        {do:`$\\operatorname{Var}(2X - Y) = 4(2) + 1(2) = 8 + 2 = 10$.`, why:`Coefficients square; no covariance term.`}
      ],
      answer:`$6$ and $10$` },

    { q:`<p>A Bernoulli variable has $p = 0.3$. Find its variance, and the variance of the sum of 50 independent such trials.</p>`,
      steps:[
        {do:`Bernoulli variance: $p(1-p) = 0.3 \\times 0.7 = 0.21$.`, why:`Bernoulli variance formula.`},
        {do:`Sum of 50: $50 \\times 0.21 = 10.5$ (this is the Binomial variance $np(1-p)$).`, why:`Independent variances add.`}
      ],
      answer:`$0.21$; sum $= 10.5$` },

    { q:`<p>$X$ takes values $10, 20, 30$ with probabilities $0.5, 0.3, 0.2$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`$E[X] = 10(0.5) + 20(0.3) + 30(0.2) = 5 + 6 + 6 = 17$.`, why:`Weighted mean.`},
        {do:`$E[X^2] = 100(0.5) + 400(0.3) + 900(0.2) = 50 + 120 + 180 = 350$.`, why:`Average the squares.`},
        {do:`$\\operatorname{Var}(X) = 350 - 17^2 = 350 - 289 = 61$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 61$` },

    { q:`<p>The average of $n = 9$ independent measurements each with variance $\\sigma^2 = 18$. Find $\\operatorname{Var}(\\bar{X})$ and $\\operatorname{SD}(\\bar{X})$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n} = \\frac{18}{9} = 2$.`, why:`Averaging divides variance by $n$.`},
        {do:`$\\operatorname{SD}(\\bar{X}) = \\sqrt{2} \\approx 1.414$.`, why:`Square root of the variance.`}
      ],
      answer:`$\\operatorname{Var} = 2$, $\\operatorname{SD} \\approx 1.414$` },

    { q:`<p>A fair coin pays \\$3 on heads, \\$0 on tails. Find $\\operatorname{Var}(X)$, then the variance of the total of 4 independent plays.</p>`,
      steps:[
        {do:`$E[X] = 1.5$, $E[X^2] = 9(0.5) = 4.5$, so $\\operatorname{Var}(X) = 4.5 - 2.25 = 2.25$.`, why:`Variance of one play.`},
        {do:`Total of 4 independent plays: $4 \\times 2.25 = 9$.`, why:`Independent variances add.`}
      ],
      answer:`$2.25$; total $= 9$` },

    { q:`<p>$X$ has $E[X] = 4$ and $E[X^2] = 25$. Find $\\operatorname{Var}(X)$ and $\\operatorname{Var}(0.5X)$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(X) = 25 - 16 = 9$.`, why:`$E[X^2] - (E[X])^2$.`},
        {do:`$\\operatorname{Var}(0.5X) = 0.25 \\times 9 = 2.25$.`, why:`Constant squares out.`}
      ],
      answer:`$9$; $2.25$` },

    { q:`<p>A Binomial $X \\sim \\text{Bin}(100, 0.5)$. Find its standard deviation.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(X) = np(1-p) = 100 \\times 0.5 \\times 0.5 = 25$.`, why:`Binomial variance.`},
        {do:`$\\sigma = \\sqrt{25} = 5$.`, why:`Square root.`}
      ],
      answer:`$\\sigma = 5$` },

    { q:`<p>$X$ and $Y$ are independent with $\\operatorname{Var}(X) = 4$, $\\operatorname{Var}(Y) = 9$. Find $\\operatorname{Var}(3X + 2Y)$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(3X) = 9 \\times 4 = 36$, $\\operatorname{Var}(2Y) = 4 \\times 9 = 36$.`, why:`Each coefficient squares.`},
        {do:`Independent, so add: $36 + 36 = 72$.`, why:`No covariance term.`}
      ],
      answer:`$\\operatorname{Var}(3X + 2Y) = 72$` },

    { q:`<p>A die shows 1 with probability $0.7$ and 6 with probability $0.3$. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`$E[X] = 1(0.7) + 6(0.3) = 0.7 + 1.8 = 2.5$.`, why:`Weighted mean.`},
        {do:`$E[X^2] = 1(0.7) + 36(0.3) = 0.7 + 10.8 = 11.5$.`, why:`Average the squares.`},
        {do:`$\\operatorname{Var}(X) = 11.5 - 2.5^2 = 11.5 - 6.25 = 5.25$.`, why:`$E[X^2] - (E[X])^2$.`}
      ],
      answer:`$\\operatorname{Var}(X) = 5.25$` },

    { q:`<p>Two independent dice are rolled; $S$ = sum. Each die has variance $\\frac{35}{12}$. Find $\\operatorname{Var}(S)$.</p>`,
      steps:[
        {do:`Independent variances add: $\\operatorname{Var}(S) = \\frac{35}{12} + \\frac{35}{12}$.`, why:`Sum of two independent dice.`},
        {do:`$= \\frac{70}{12} = \\frac{35}{6} \\approx 5.833$.`, why:`Combine the fractions.`}
      ],
      answer:`$\\operatorname{Var}(S) = \\frac{35}{6}$` },

    { q:`<p>$X$ is uniform on $\\{1, 2, \\dots, 10\\}$. Use $\\operatorname{Var} = \\frac{n^2 - 1}{12}$ for a discrete uniform on $n$ values. Find $\\operatorname{Var}(X)$.</p>`,
      steps:[
        {do:`$n = 10$, so $\\operatorname{Var}(X) = \\frac{10^2 - 1}{12} = \\frac{99}{12}$.`, why:`Discrete-uniform variance formula.`},
        {do:`$= 8.25$.`, why:`Simplify the fraction.`}
      ],
      answer:`$\\operatorname{Var}(X) = 8.25$` },

    { q:`<p>$X$ has variance $5$ and $Y$ has variance $3$, with covariance $\\operatorname{Cov}(X,Y) = 2$. Find $\\operatorname{Var}(X + Y)$.</p>`,
      steps:[
        {do:`$\\operatorname{Var}(X+Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X,Y)$.`, why:`General variance-of-sum formula (here they are correlated).`},
        {do:`$= 5 + 3 + 2(2) = 12$.`, why:`Add the covariance term since they are not independent.`}
      ],
      answer:`$\\operatorname{Var}(X+Y) = 12$` }
  ]);

  /* ---------------- prob-bernoulli-binomial ---------------- */
  add("prob-bernoulli-binomial", [
    { q:`<p>A coin with $P(H) = 0.4$ is flipped 5 times. Find $P(\\text{exactly 2 heads})$.</p>`,
      steps:[
        {do:`$P(X = 2) = \\binom{5}{2}(0.4)^2(0.6)^3 = 10 \\times 0.16 \\times 0.216$.`, why:`Binomial PMF.`},
        {do:`$= 10 \\times 0.03456 = 0.3456$.`, why:`Multiply count times pattern chance.`}
      ],
      answer:`$0.3456$` },

    { q:`<p>A machine has defect rate $p = 0.05$. In a batch of 20, find $P(\\text{at most 1 defective})$.</p>`,
      steps:[
        {do:`$P(X = 0) = 0.95^{20} \\approx 0.3585$.`, why:`No defects.`},
        {do:`$P(X = 1) = \\binom{20}{1}(0.05)(0.95)^{19} = 20 \\times 0.05 \\times 0.3774 \\approx 0.3774$.`, why:`Exactly one defect.`},
        {do:`$P(X \\le 1) \\approx 0.3585 + 0.3774 = 0.7359$.`, why:`Add the two cases.`}
      ],
      answer:`$\\approx 0.736$` },

    { q:`<p>A basketball player makes $p = 0.6$. In 10 shots, find the mean and standard deviation of the number made.</p>`,
      steps:[
        {do:`Mean $np = 10 \\times 0.6 = 6$.`, why:`Binomial mean.`},
        {do:`Variance $np(1-p) = 10 \\times 0.6 \\times 0.4 = 2.4$; $\\sigma = \\sqrt{2.4} \\approx 1.549$.`, why:`Binomial variance and its root.`}
      ],
      answer:`mean $6$, $\\sigma \\approx 1.549$` },

    { q:`<p>A fair coin is flipped 4 times. Find $P(X = 2 \\mid X \\ge 1)$ where $X$ is the number of heads.</p>`,
      steps:[
        {do:`$P(X = 2) = \\binom{4}{2}(0.5)^4 = \\frac{6}{16} = 0.375$.`, why:`Binomial PMF.`},
        {do:`$P(X \\ge 1) = 1 - (0.5)^4 = 1 - 0.0625 = 0.9375$.`, why:`Complement of zero heads.`},
        {do:`$P(X=2 \\mid X \\ge 1) = \\frac{0.375}{0.9375} = 0.4$.`, why:`Conditional probability.`}
      ],
      answer:`$0.4$` },

    { q:`<p>A quality test passes each unit with $p = 0.9$. In 5 units, find $P(\\text{all 5 pass})$ and $P(\\text{at least 4 pass})$.</p>`,
      steps:[
        {do:`$P(X = 5) = 0.9^5 = 0.59049$.`, why:`All five pass.`},
        {do:`$P(X = 4) = \\binom{5}{4}(0.9)^4(0.1) = 5 \\times 0.6561 \\times 0.1 = 0.32805$.`, why:`Exactly four pass.`},
        {do:`$P(X \\ge 4) = 0.59049 + 0.32805 = 0.91854$.`, why:`Add the top two cases.`}
      ],
      answer:`$0.59049$; $\\approx 0.9185$` },

    { q:`<p>A die is rolled 6 times. Find $P(\\text{exactly two 6's})$ (treat rolling a 6 as success, $p = \\frac{1}{6}$).</p>`,
      steps:[
        {do:`$P(X = 2) = \\binom{6}{2}(\\frac{1}{6})^2(\\frac{5}{6})^4$.`, why:`Binomial PMF.`},
        {do:`$= 15 \\times \\frac{1}{36} \\times \\frac{625}{1296} = 15 \\times \\frac{625}{46656} \\approx 0.2009$.`, why:`Compute the product.`}
      ],
      answer:`$\\approx 0.2009$` },

    { q:`<p>A survey asks 8 people, each saying "yes" with probability $0.3$ independently. Find $P(X \\le 1)$ (at most one yes).</p>`,
      steps:[
        {do:`$P(X = 0) = 0.7^8 \\approx 0.05765$.`, why:`No yes responses.`},
        {do:`$P(X = 1) = \\binom{8}{1}(0.3)(0.7)^7 = 8 \\times 0.3 \\times 0.08235 \\approx 0.1977$.`, why:`Exactly one yes.`},
        {do:`$P(X \\le 1) \\approx 0.05765 + 0.1977 = 0.2554$.`, why:`Add the two cases.`}
      ],
      answer:`$\\approx 0.2554$` },

    { q:`<p>Find the most likely number of heads (the mode) in 7 flips of a coin with $P(H) = 0.7$. Compare $P(X=4)$ and $P(X=5)$.</p>`,
      steps:[
        {do:`$P(X=5) = \\binom{7}{5}(0.7)^5(0.3)^2 = 21 \\times 0.16807 \\times 0.09 \\approx 0.3177$.`, why:`Five heads.`},
        {do:`$P(X=4) = \\binom{7}{4}(0.7)^4(0.3)^3 = 35 \\times 0.2401 \\times 0.027 \\approx 0.2269$.`, why:`Four heads.`},
        {do:`$P(X=5) &gt; P(X=4)$; the mode is around $\\lfloor (n+1)p \\rfloor = \\lfloor 5.6 \\rfloor = 5$.`, why:`The peak sits near $np = 4.9$, rounding to 5.`}
      ],
      answer:`Mode $= 5$ ($P \\approx 0.318$)` },

    { q:`<p>Two independent coins, A ($P(H) = 0.5$) flipped 4 times and B ($P(H) = 0.3$) flipped 4 times. Find $P(\\text{A gets exactly 2 heads and B gets exactly 1 head})$.</p>`,
      steps:[
        {do:`$P(A = 2) = \\binom{4}{2}(0.5)^4 = 6 \\times 0.0625 = 0.375$.`, why:`Binomial for A.`},
        {do:`$P(B = 1) = \\binom{4}{1}(0.3)(0.7)^3 = 4 \\times 0.3 \\times 0.343 = 0.4116$.`, why:`Binomial for B.`},
        {do:`Independent: $0.375 \\times 0.4116 \\approx 0.1544$.`, why:`Multiply the two independent events.`}
      ],
      answer:`$\\approx 0.1544$` },

    { q:`<p>A widget passes inspection with $p = 0.8$. How many widgets, $n$, are needed so that $P(\\text{at least one fails}) \\ge 0.5$? (Find the smallest such $n$.)</p>`,
      steps:[
        {do:`$P(\\text{at least one fails}) = 1 - 0.8^n \\ge 0.5$ means $0.8^n \\le 0.5$.`, why:`Complement: all pass has probability $0.8^n$.`},
        {do:`$n \\ge \\frac{\\ln 0.5}{\\ln 0.8} = \\frac{-0.693}{-0.223} \\approx 3.1$, so $n = 4$.`, why:`Round up to the next integer.`}
      ],
      answer:`$n = 4$` },

    { q:`<p>A loaded coin has $P(H) = 0.6$, flipped 3 times. Find $P(\\text{first head on the 2nd flip})$ — tail then head, ignoring the 3rd flip.</p>`,
      steps:[
        {do:`First two flips must be $TH$: $P(T)P(H) = 0.4 \\times 0.6$.`, why:`The 3rd flip is unconstrained, so it doesn't matter.`},
        {do:`$= 0.24$.`, why:`Independent flips.`}
      ],
      answer:`$0.24$` },

    { q:`<p>$X \\sim \\text{Bin}(5, 0.5)$. Find $P(X \\text{ is even})$ (0, 2, or 4 heads).</p>`,
      steps:[
        {do:`$P(X=0) = \\frac{1}{32}$, $P(X=2) = \\frac{10}{32}$, $P(X=4) = \\frac{5}{32}$.`, why:`$\\binom{5}{k}/32$ for each even $k$.`},
        {do:`$P(\\text{even}) = \\frac{1 + 10 + 5}{32} = \\frac{16}{32} = \\frac{1}{2}$.`, why:`Add the even-count probabilities.`}
      ],
      answer:`$\\frac{1}{2}$` },

    { q:`<p>An ad converts with $p = 0.02$ per view. Out of 100 views, find $P(\\text{no conversions})$ and the expected number of conversions.</p>`,
      steps:[
        {do:`$P(X = 0) = (0.98)^{100} \\approx 0.1326$.`, why:`No conversions across all views.`},
        {do:`$E[X] = np = 100 \\times 0.02 = 2$.`, why:`Binomial mean.`}
      ],
      answer:`$P(0) \\approx 0.133$; $E[X] = 2$` },

    { q:`<p>A test has 10 multiple-choice questions, each with 4 options, guessed at random ($p = 0.25$). Find $P(\\text{at least 3 correct})$ using the complement.</p>`,
      steps:[
        {do:`$P(X=0) = 0.75^{10} \\approx 0.0563$, $P(X=1) = \\binom{10}{1}(0.25)(0.75)^9 \\approx 0.1877$.`, why:`Zero and one correct.`},
        {do:`$P(X=2) = \\binom{10}{2}(0.25)^2(0.75)^8 = 45 \\times 0.0625 \\times 0.1001 \\approx 0.2816$.`, why:`Exactly two correct.`},
        {do:`$P(X \\ge 3) = 1 - (0.0563 + 0.1877 + 0.2816) = 1 - 0.5256 \\approx 0.4744$.`, why:`Complement of 0, 1, 2 correct.`}
      ],
      answer:`$\\approx 0.4744$` }
  ]);

})();
