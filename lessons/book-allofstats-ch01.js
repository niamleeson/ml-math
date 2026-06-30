/* "All of Statistics" (Larry Wasserman) — Chapter 1: Probability
   Self-registering IIFE fragment. One lesson per key point. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1) Sample spaces, events, and set operations
  B({
    id: "aos-ch1-sample-spaces",
    chapter: "Chapter 1",
    title: "Sample Spaces and Events",
    tagline: "The sample space lists every possible outcome; events are subsets of it, combined with set operations.",
    sections: [
      {
        h: "The book's definitions",
        body: "The book opens by saying probability is a mathematical language for quantifying uncertainty. The starting object is the $\\textbf{sample space}$ $\\Omega$ (capital omega), the set of all possible outcomes of an experiment. A single point $\\omega$ (lowercase omega) inside $\\Omega$ is a $\\textbf{sample outcome}$, also called a realization or an element. Any subset of $\\Omega$ is called an $\\textbf{event}$. So an event is just a collection of outcomes you might care about."
      },
      {
        h: "The book's examples",
        body: "The author gives three examples, ranging from finite to infinite outcome sets.<ul class=\"steps\"><li>Toss a coin twice: $\\Omega = \\{HH, HT, TH, TT\\}$. The event that the first toss is heads is $A = \\{HH, HT\\}$ (the symbol $\\{\\,\\}$ means the set containing those items).</li><li>Measure a physical quantity such as temperature: $\\Omega = \\mathbb{R} = (-\\infty, \\infty)$, the whole real line. The author notes it is usually harmless to make $\\Omega$ larger than strictly needed. The event that the measurement is greater than 10 but at most 23 is the interval $A = (10, 23]$.</li><li>Toss a coin forever: $\\Omega$ is the infinite set of sequences $\\omega = (\\omega_1, \\omega_2, \\ldots)$ with each $\\omega_i \\in \\{H, T\\}$. The event that the first head appears on the third toss is $E = \\{\\omega : \\omega_1 = T, \\omega_2 = T, \\omega_3 = H\\}$.</li></ul>"
      },
      {
        h: "Set operations on events",
        body: "Events are sets, so the author defines the usual set operations. For an event $A$, the $\\textbf{complement}$ is $A^c = \\{\\omega \\in \\Omega : \\omega \\notin A\\}$, read \"not $A$\"; the complement of $\\Omega$ is the empty set $\\emptyset$. The $\\textbf{union}$ $A \\cup B$ collects every $\\omega$ that is in $A$, in $B$, or in both, read \"$A$ or $B$\". The $\\textbf{intersection}$ $A \\cap B$ collects every $\\omega$ in both $A$ and $B$, read \"$A$ and $B$\"; this is sometimes written $AB$ or $(A, B)$. The $\\textbf{set difference}$ is $A - B = \\{\\omega : \\omega \\in A, \\omega \\notin B\\}$. If every element of $A$ lies in $B$, we write $A \\subset B$ (set inclusion). When $A$ is finite, $|A|$ denotes the number of elements in $A$. The book summarizes this notation in a compact terminology table:<table class=\"extable\"><thead><tr><th>symbol</th><th>book terminology</th></tr></thead><tbody><tr><td class=\"row-h\">$\\Omega$</td><td>sample space</td></tr><tr><td class=\"row-h\">$\\omega$</td><td>outcome, point, or element</td></tr><tr><td class=\"row-h\">$A$</td><td>event, a subset of $\\Omega$</td></tr><tr><td class=\"row-h\">$A^c$</td><td>complement: not $A$</td></tr><tr><td class=\"row-h\">$A \\cup B$</td><td>union: $A$ or $B$</td></tr><tr><td class=\"row-h\">$A \\cap B$ or $AB$</td><td>intersection: $A$ and $B$</td></tr><tr><td class=\"row-h\">$A-B$</td><td>set difference: in $A$ but not in $B$</td></tr><tr><td class=\"row-h\">$A \\subset B$</td><td>set inclusion</td></tr><tr><td class=\"row-h\">$\\emptyset$</td><td>null event, always false</td></tr><tr><td class=\"row-h\">$\\Omega$</td><td>true event, always true</td></tr></tbody></table>"
      },
      {
        h: "Disjoint sets, partitions, and indicators",
        body: "Sets $A_1, A_2, \\ldots$ are $\\textbf{disjoint}$ (or mutually exclusive) if $A_i \\cap A_j = \\emptyset$ whenever $i \\neq j$ — no two share an outcome. The author's example: $A_1 = [0, 1)$, $A_2 = [1, 2)$, $A_3 = [2, 3), \\ldots$ are disjoint. A $\\textbf{partition}$ of $\\Omega$ is a sequence of disjoint sets whose union is all of $\\Omega$. The $\\textbf{indicator function}$ of $A$ is $I_A(\\omega) = 1$ if $\\omega \\in A$ and $0$ otherwise — a 1/0 flag for membership. Example 1.4 shows why monotone limits of sets need attention:<ul class=\"steps\"><li>Let $\\Omega=\\mathbb{R}$ and $A_i=[0,1/i)$ for $i=1,2,\\ldots$.</li><li>The union is $\\bigcup_{i=1}^{\\infty} A_i = [0,1)$, because $A_1$ is the largest set.</li><li>The intersection is $\\bigcap_{i=1}^{\\infty} A_i = \\{0\\}$, because every interval includes 0 and the right endpoint shrinks toward 0.</li><li>If instead $A_i=(0,1/i)$, the union is $(0,1)$ but the intersection is $\\emptyset$; the point 0 is no longer included.</li></ul>"
      }
    ],
    takeaways: [
      "$\\Omega$ is the set of all outcomes; an event is any subset of $\\Omega$.",
      "Coin-twice: $\\Omega = \\{HH, HT, TH, TT\\}$; first toss heads is $A = \\{HH, HT\\}$.",
      "Complement $A^c$, union $A \\cup B$ (or), intersection $A \\cap B = AB$ (and), difference $A - B$.",
      "Disjoint events share no outcome; a partition is disjoint events that cover all of $\\Omega$."
    ]
  });

  // 2) Probability axioms and basic properties
  B({
    id: "aos-ch1-axioms",
    chapter: "Chapter 1",
    title: "Probability Axioms",
    tagline: "A probability is a function on events obeying three axioms, from which many properties follow.",
    sections: [
      {
        h: "The three axioms",
        body: "The author assigns a real number $\\mathbb{P}(A)$ to each event $A$, called the probability of $A$; $\\mathbb{P}$ is a $\\textbf{probability distribution}$ or $\\textbf{probability measure}$. To qualify, $\\mathbb{P}$ must satisfy three axioms (Definition 1.5):<ul class=\"steps\"><li>$\\textbf{Axiom 1}$: $\\mathbb{P}(A) \\geq 0$ for every event $A$ — probabilities are never negative.</li><li>$\\textbf{Axiom 2}$: $\\mathbb{P}(\\Omega) = 1$ — the whole sample space has probability one.</li><li>$\\textbf{Axiom 3}$: if $A_1, A_2, \\ldots$ are disjoint, then $\\mathbb{P}\\left(\\bigcup_{i=1}^{\\infty} A_i\\right) = \\sum_{i=1}^{\\infty} \\mathbb{P}(A_i)$ — the probability of a union of non-overlapping events is the sum of their probabilities.</li></ul>The author notes (footnote) that for large sample spaces like the real line one cannot assign a probability to every subset; probabilities are assigned only to a restricted class of sets called a $\\sigma$-field."
      },
      {
        h: "Two interpretations",
        body: "The author describes two common readings of $\\mathbb{P}(A)$. In the $\\textbf{frequency}$ interpretation, $\\mathbb{P}(A)$ is the long-run proportion of times $A$ occurs in repetitions: saying the probability of heads is $1/2$ means the proportion of heads tends to $1/2$ as the number of tosses grows. In the $\\textbf{degree-of-belief}$ interpretation, $\\mathbb{P}(A)$ measures an observer's strength of belief that $A$ is true. Either way the three axioms hold; the difference only starts to matter for statistical inference, where it splits into the frequentist and Bayesian schools."
      },
      {
        h: "Properties derived from the axioms",
        body: "The author lists several properties that follow from the axioms.<table class=\"extable\"><thead><tr><th>property</th><th>statement</th></tr></thead><tbody><tr><td class=\"row-h\">empty event</td><td>$\\mathbb{P}(\\emptyset) = 0$</td></tr><tr><td class=\"row-h\">monotonicity</td><td>$A \\subset B \\implies \\mathbb{P}(A) \\leq \\mathbb{P}(B)$</td></tr><tr><td class=\"row-h\">bounds</td><td>$0 \\leq \\mathbb{P}(A) \\leq 1$</td></tr><tr><td class=\"row-h\">complement</td><td>$\\mathbb{P}(A^c) = 1 - \\mathbb{P}(A)$</td></tr><tr><td class=\"row-h\">disjoint union</td><td>$A \\cap B = \\emptyset \\implies \\mathbb{P}(A \\cup B) = \\mathbb{P}(A) + \\mathbb{P}(B)$</td></tr></tbody></table>"
      },
      {
        h: "Inclusion-exclusion for two events",
        body: "A less obvious property is Lemma 1.6: for any events $A$ and $B$, $\\mathbb{P}(A \\cup B) = \\mathbb{P}(A) + \\mathbb{P}(B) - \\mathbb{P}(AB)$. The author proves it by splitting $A \\cup B$ into the three disjoint pieces $AB^c$, $AB$, and $A^c B$ and applying additivity. Example 1.7 illustrates it with two coin tosses: let $H_1$ be heads on toss 1 and $H_2$ heads on toss 2, with all four outcomes equally likely.<ul class=\"steps\"><li>$\\mathbb{P}(H_1) = \\tfrac{1}{2}$ and $\\mathbb{P}(H_2) = \\tfrac{1}{2}$.</li><li>$\\mathbb{P}(H_1 H_2) = \\tfrac{1}{4}$ (only $HH$).</li><li>$\\mathbb{P}(H_1 \\cup H_2) = \\tfrac{1}{2} + \\tfrac{1}{2} - \\tfrac{1}{4} = \\tfrac{3}{4}$.</li></ul>Subtracting $\\mathbb{P}(AB)$ removes the double-counted overlap. The author also states Theorem 1.8 (continuity): if $A_n \\to A$ then $\\mathbb{P}(A_n) \\to \\mathbb{P}(A)$."
      }
    ],
    takeaways: [
      "Three axioms: $\\mathbb{P}(A) \\geq 0$, $\\mathbb{P}(\\Omega) = 1$, and countable additivity over disjoint events.",
      "Consequences: $\\mathbb{P}(\\emptyset) = 0$, $\\mathbb{P}(A^c) = 1 - \\mathbb{P}(A)$, and $0 \\leq \\mathbb{P}(A) \\leq 1$.",
      "Inclusion-exclusion: $\\mathbb{P}(A \\cup B) = \\mathbb{P}(A) + \\mathbb{P}(B) - \\mathbb{P}(AB)$.",
      "Two-toss check: $\\tfrac{1}{2} + \\tfrac{1}{2} - \\tfrac{1}{4} = \\tfrac{3}{4}$."
    ]
  });

  // 3) Probability on finite sample spaces and counting
  B({
    id: "aos-ch1-finite-counting",
    chapter: "Chapter 1",
    title: "Finite Sample Spaces and Counting",
    tagline: "When outcomes are equally likely, probability is a counting ratio; combinatorics counts the outcomes.",
    sections: [
      {
        h: "The uniform probability distribution",
        body: "Suppose $\\Omega = \\{\\omega_1, \\ldots, \\omega_n\\}$ is finite and each outcome is equally likely. Then $\\mathbb{P}(A) = |A| / |\\Omega|$, where $|A|$ is the number of outcomes in $A$. The author calls this the $\\textbf{uniform probability distribution}$. Computing such probabilities reduces to counting points, which is the job of combinatorial methods."
      },
      {
        h: "The book's dice example",
        body: "Toss a die twice. Then $\\Omega = \\{(i, j) : i, j \\in \\{1, \\ldots, 6\\}\\}$ has $6 \\times 6 = 36$ elements.<ul class=\"steps\"><li>The event \"the sum of the dice is 11\" contains exactly two outcomes: $(5, 6)$ and $(6, 5)$.</li><li>So $\\mathbb{P}(\\text{sum} = 11) = 2 / 36$.</li></ul>This is just $|A| / |\\Omega|$ with $|A| = 2$ and $|\\Omega| = 36$."
      },
      {
        h: "Factorials and combinations",
        body: "The author gives a few counting facts. Given $n$ objects, the number of ways to order them is $n! = n(n-1)(n-2) \\cdots 3 \\cdot 2 \\cdot 1$, with the convention $0! = 1$. The number of distinct ways to choose $k$ objects from $n$ (order ignored) is the binomial coefficient $\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}$, read \"$n$ choose $k$\". Worked example: choosing a committee of 3 from 20 people gives<ul class=\"steps\"><li>$\\binom{20}{3} = \\frac{20!}{3!\\,17!}$.</li><li>Cancel the $17!$: $\\frac{20 \\times 19 \\times 18}{3 \\times 2 \\times 1}$.</li><li>Numerator $= 6840$, denominator $= 6$, so $\\binom{20}{3} = 1140$ possible committees.</li></ul>The author also notes $\\binom{n}{0} = \\binom{n}{n} = 1$ and the symmetry $\\binom{n}{k} = \\binom{n}{n-k}$."
      }
    ],
    takeaways: [
      "Equally likely outcomes: $\\mathbb{P}(A) = |A| / |\\Omega|$, the uniform distribution.",
      "Two dice: $|\\Omega| = 36$, and $\\mathbb{P}(\\text{sum} = 11) = 2/36$.",
      "$n! = n(n-1)\\cdots 1$ with $0! = 1$; $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$.",
      "$\\binom{20}{3} = 1140$ committees of 3 from 20."
    ]
  });

  // 4) Independent events
  B({
    id: "aos-ch1-independence",
    chapter: "Chapter 1",
    title: "Independent Events",
    tagline: "Two events are independent when the probability of both equals the product of their probabilities.",
    sections: [
      {
        h: "The definition",
        body: "The author motivates it by the fair coin: two heads has probability $\\tfrac{1}{2} \\times \\tfrac{1}{2}$ because we treat the tosses as independent — we multiply. Formally (Definition 1.9), two events $A$ and $B$ are $\\textbf{independent}$ if $\\mathbb{P}(AB) = \\mathbb{P}(A)\\,\\mathbb{P}(B)$, written $A \\amalg B$. A whole set of events is independent if, for every finite subset, the probability of the intersection equals the product of the probabilities. If $A$ and $B$ are not independent, the author writes that they are dependent."
      },
      {
        h: "Assumed versus derived independence",
        body: "Independence arises two ways. Sometimes we $\\textbf{assume}$ it: in tossing a coin twice we assume the tosses are independent because the coin has no memory of the first toss. Other times we $\\textbf{derive}$ it by checking that $\\mathbb{P}(AB) = \\mathbb{P}(A)\\mathbb{P}(B)$ actually holds. The author's die example: roll a fair die, let $A = \\{2, 4, 6\\}$ and $B = \\{1, 2, 3, 4\\}$, so $A \\cap B = \\{2, 4\\}$.<ul class=\"steps\"><li>$\\mathbb{P}(A) = 3/6 = 1/2$ and $\\mathbb{P}(B) = 4/6 = 2/3$.</li><li>$\\mathbb{P}(AB) = 2/6 = 1/3$.</li><li>Check: $\\mathbb{P}(A)\\mathbb{P}(B) = \\tfrac{1}{2} \\times \\tfrac{2}{3} = \\tfrac{1}{3} = \\mathbb{P}(AB)$, so $A$ and $B$ are independent — it just turned out that way.</li></ul>"
      },
      {
        h: "Disjoint is not independent",
        body: "The author warns that disjoint events with positive probability are $\\textbf{not}$ independent. If $A$ and $B$ are disjoint and each has positive probability, then $\\mathbb{P}(A)\\mathbb{P}(B) \\gt 0$, yet $\\mathbb{P}(AB) = \\mathbb{P}(\\emptyset) = 0$, so the product rule fails. Except in this special case, you cannot judge independence by looking at a Venn diagram."
      },
      {
        h: "Worked example: at least one head in ten tosses",
        body: "Example 1.10: toss a fair coin 10 times; let $A$ = \"at least one head\". Computing $A$ directly is messy, so the author uses the complement and independence. Let $T_j$ be tails on the $j$-th toss.<ul class=\"steps\"><li>$\\mathbb{P}(A) = 1 - \\mathbb{P}(A^c) = 1 - \\mathbb{P}(\\text{all tails})$.</li><li>$\\mathbb{P}(\\text{all tails}) = \\mathbb{P}(T_1 T_2 \\cdots T_{10}) = \\mathbb{P}(T_1)\\mathbb{P}(T_2)\\cdots\\mathbb{P}(T_{10})$ by independence.</li><li>$= \\left(\\tfrac{1}{2}\\right)^{10} = \\tfrac{1}{1024} \\approx 0.000977$.</li><li>So $\\mathbb{P}(A) = 1 - \\left(\\tfrac{1}{2}\\right)^{10} \\approx 0.999$.</li></ul>"
      },
      {
        h: "Worked example: first basketball success",
        body: "Example 1.11 uses disjoint events and a geometric series. Two players alternate shots; player 1 makes a shot with probability $1/3$ and player 2 with probability $1/4$. Let $E$ be the event that player 1 succeeds before player 2, and let $A_j$ be the event that player 1's first success occurs on his $j$-th attempt.<ul class=\"steps\"><li>The events $A_1,A_2,\\ldots$ are disjoint and $E=\\bigcup_{j=1}^{\\infty}A_j$, so $\\mathbb{P}(E)=\\sum_{j=1}^{\\infty}\\mathbb{P}(A_j)$.</li><li>$\\mathbb{P}(A_1)=1/3$.</li><li>$A_2$ requires player 1 miss, player 2 miss, then player 1 score: $(2/3)(3/4)(1/3)=(1/2)(1/3)$.</li><li>In general, $\\mathbb{P}(A_j)=(1/2)^{j-1}(1/3)$.</li><li>Thus $\\mathbb{P}(E)=\\frac{1}{3}\\sum_{j=1}^{\\infty}(1/2)^{j-1}=\\frac{1}{3}\\cdot\\frac{1}{1-1/2}=\\frac{2}{3}$.</li></ul>"
      }
    ],
    takeaways: [
      "Independence: $\\mathbb{P}(AB) = \\mathbb{P}(A)\\mathbb{P}(B)$.",
      "Independence can be assumed (coin tosses) or derived (the die $A=\\{2,4,6\\}$, $B=\\{1,2,3,4\\}$ check gives $1/3 = 1/3$).",
      "Disjoint events with positive probability are never independent.",
      "At least one head in 10 tosses: $1 - (1/2)^{10} \\approx 0.999$; basketball example sums to $2/3$."
    ]
  });

  // 5) Conditional probability
  B({
    id: "aos-ch1-conditional",
    chapter: "Chapter 1",
    title: "Conditional Probability",
    tagline: "Conditioning on B rescales probabilities to the world where B has happened.",
    sections: [
      {
        h: "The definition",
        body: "Assuming $\\mathbb{P}(B) \\gt 0$, the $\\textbf{conditional probability}$ of $A$ given $B$ is (Definition 1.12) $\\mathbb{P}(A \\mid B) = \\frac{\\mathbb{P}(AB)}{\\mathbb{P}(B)}$. The author says to think of $\\mathbb{P}(A \\mid B)$ as the fraction of times $A$ occurs among those cases in which $B$ occurs. For a fixed $B$ with $\\mathbb{P}(B) \\gt 0$, the map $\\mathbb{P}(\\cdot \\mid B)$ is itself a probability — it satisfies all three axioms (for example $\\mathbb{P}(\\Omega \\mid B) = 1$). But the rules apply to events on the left of the bar: in general $\\mathbb{P}(A \\mid B \\cup C) \\neq \\mathbb{P}(A \\mid B) + \\mathbb{P}(A \\mid C)$."
      },
      {
        h: "The prosecutor's fallacy",
        body: "The author stresses that in general $\\mathbb{P}(A \\mid B) \\neq \\mathbb{P}(B \\mid A)$ — people confuse these constantly. His example: the probability of spots given you have measles is 1, but the probability you have measles given you have spots is not 1. Confusing the two shows up often enough in court that it is called the $\\textbf{prosecutor's fallacy}$."
      },
      {
        h: "Worked example: the medical test",
        body: "Example 1.13: a test for disease $D$ has outcomes $+$ and $-$, with the following joint probabilities.<table class=\"extable\"><thead><tr><th></th><th class=\"num\">$D$</th><th class=\"num\">$D^c$</th></tr></thead><tbody><tr><td class=\"row-h\">$+$</td><td class=\"num\">.009</td><td class=\"num\">.099</td></tr><tr><td class=\"row-h\">$-$</td><td class=\"num\">.001</td><td class=\"num\">.891</td></tr></tbody></table>The test looks accurate when read the natural way, but the answer flips when you ask the question a patient cares about.<ul class=\"steps\"><li>Sensitivity: $\\mathbb{P}(+ \\mid D) = \\frac{.009}{.009 + .001} = \\frac{.009}{.010} = .9$ — sick people test positive 90% of the time.</li><li>Specificity: $\\mathbb{P}(- \\mid D^c) = \\frac{.891}{.891 + .099} = \\frac{.891}{.990} = .9$ — healthy people test negative about 90% of the time.</li><li>But the patient's question: $\\mathbb{P}(D \\mid +) = \\frac{.009}{.009 + .099} = \\frac{.009}{.108} \\approx .08$.</li></ul>So after a positive test the chance of disease is only about 8%, not 90%. The author's lesson: compute the answer numerically; do not trust your intuition."
      },
      {
        h: "The multiplication rule",
        body: "Lemma 1.14 follows from the definition: if $A$ and $B$ are independent then $\\mathbb{P}(A \\mid B) = \\mathbb{P}(A)$ — knowing $B$ does not change the probability of $A$ (another way to read independence). And for any pair of events, $\\mathbb{P}(AB) = \\mathbb{P}(A \\mid B)\\mathbb{P}(B) = \\mathbb{P}(B \\mid A)\\mathbb{P}(A)$. Example 1.15: draw two cards without replacement, $A$ = first is Ace of Clubs, $B$ = second is Queen of Diamonds. Then $\\mathbb{P}(AB) = \\mathbb{P}(A)\\mathbb{P}(B \\mid A) = \\tfrac{1}{52} \\times \\tfrac{1}{51}$ — only 51 cards remain for the second draw."
      }
    ],
    takeaways: [
      "$\\mathbb{P}(A \\mid B) = \\mathbb{P}(AB) / \\mathbb{P}(B)$ when $\\mathbb{P}(B) \\gt 0$.",
      "In general $\\mathbb{P}(A \\mid B) \\neq \\mathbb{P}(B \\mid A)$ — confusing them is the prosecutor's fallacy.",
      "Medical test: 90% sensitive and 90% specific, yet $\\mathbb{P}(D \\mid +) \\approx .08$.",
      "Multiplication rule: $\\mathbb{P}(AB) = \\mathbb{P}(A \\mid B)\\mathbb{P}(B) = \\mathbb{P}(B \\mid A)\\mathbb{P}(A)$."
    ]
  });
  window.CODEVIZ["aos-ch1-conditional"] = {
    charts: [
      {
        type: "bars",
        title: "Medical test: the question changes the answer",
        interpret: "The test is 90% sensitive and 90% specific, yet a positive result means only about an 8% chance of disease, because disease is rare.",
        labels: ["P(+|D)", "P(-|D^c)", "P(D|+)"],
        values: [0.9, 0.9, 0.083],
        colors: ["#7ee787", "#7ee787", "#ffb454"]
      }
    ]
  };

  // 6) Bayes' theorem
  B({
    id: "aos-ch1-bayes",
    chapter: "Chapter 1",
    title: "Bayes Theorem",
    tagline: "Bayes' theorem flips a conditional probability around using a partition and the law of total probability.",
    sections: [
      {
        h: "The law of total probability",
        body: "Bayes' theorem needs a preliminary result. Theorem 1.16 (Law of Total Probability): let $A_1, \\ldots, A_k$ be a partition of $\\Omega$ (disjoint events that cover everything). Then for any event $B$, $\\mathbb{P}(B) = \\sum_{i=1}^{k} \\mathbb{P}(B \\mid A_i)\\mathbb{P}(A_i)$. The author proves it by setting $C_j = B A_j$; these pieces are disjoint and their union is $B$, so $\\mathbb{P}(B) = \\sum_j \\mathbb{P}(C_j) = \\sum_j \\mathbb{P}(B \\mid A_j)\\mathbb{P}(A_j)$. In words, total up the probability of $B$ across each slice of the partition."
      },
      {
        h: "The theorem",
        body: "Theorem 1.17 (Bayes' Theorem): let $A_1, \\ldots, A_k$ be a partition of $\\Omega$ with $\\mathbb{P}(A_i) \\gt 0$ for each $i$. If $\\mathbb{P}(B) \\gt 0$, then for each $i$, $\\mathbb{P}(A_i \\mid B) = \\frac{\\mathbb{P}(B \\mid A_i)\\mathbb{P}(A_i)}{\\sum_j \\mathbb{P}(B \\mid A_j)\\mathbb{P}(A_j)}$. The proof applies the definition of conditional probability twice and then the law of total probability to the denominator. Remark 1.18 names the parts: $\\mathbb{P}(A_i)$ is the $\\textbf{prior probability}$ (before seeing $B$) and $\\mathbb{P}(A_i \\mid B)$ is the $\\textbf{posterior probability}$ (after seeing $B$)."
      },
      {
        h: "Worked example: spam filter",
        body: "Example 1.19: email is split into a partition of three categories — $A_1$ = spam, $A_2$ = low priority, $A_3$ = high priority — with priors $\\mathbb{P}(A_1) = .7$, $\\mathbb{P}(A_2) = .2$, $\\mathbb{P}(A_3) = .1$ (these sum to 1). Let $B$ = the email contains the word \"free\". Past experience gives $\\mathbb{P}(B \\mid A_1) = .9$, $\\mathbb{P}(B \\mid A_2) = .01$, $\\mathbb{P}(B \\mid A_3) = .01$ (these need not sum to 1, since each is conditioned on a different category). An email with \"free\" arrives — how likely is it spam?<ul class=\"steps\"><li>Numerator: $\\mathbb{P}(B \\mid A_1)\\mathbb{P}(A_1) = .9 \\times .7 = .63$.</li><li>Other terms: $\\mathbb{P}(B \\mid A_2)\\mathbb{P}(A_2) = .01 \\times .2 = .002$ and $\\mathbb{P}(B \\mid A_3)\\mathbb{P}(A_3) = .01 \\times .1 = .001$.</li><li>Denominator (law of total probability): $.63 + .002 + .001 = .633$.</li><li>$\\mathbb{P}(A_1 \\mid B) = \\frac{.63}{.633} \\approx .995$.</li></ul>Seeing the word \"free\" lifts the spam probability from a prior of $.7$ to a posterior of about $.995$."
      }
    ],
    takeaways: [
      "Law of total probability: $\\mathbb{P}(B) = \\sum_i \\mathbb{P}(B \\mid A_i)\\mathbb{P}(A_i)$ over a partition.",
      "Bayes: $\\mathbb{P}(A_i \\mid B) = \\frac{\\mathbb{P}(B \\mid A_i)\\mathbb{P}(A_i)}{\\sum_j \\mathbb{P}(B \\mid A_j)\\mathbb{P}(A_j)}$.",
      "$\\mathbb{P}(A_i)$ is the prior; $\\mathbb{P}(A_i \\mid B)$ is the posterior.",
      "Spam example: prior $.7$ rises to posterior $\\approx .995$ once \"free\" is seen."
    ]
  });
  window.CODEVIZ["aos-ch1-bayes"] = {
    charts: [
      {
        type: "bars",
        title: "Spam filter: prior vs. posterior after seeing \"free\"",
        interpret: "Each category's prior probability, and the posterior probability of spam after the word \"free\" appears, which jumps to about .995.",
        labels: ["spam prior", "low-pri prior", "high-pri prior", "spam posterior"],
        values: [0.7, 0.2, 0.1, 0.995],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454"]
      }
    ]
  };
})();
