/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 1: Probability & Statistics.
   Each lesson id maps to 3 worked, runnable walkthroughs in distinct
   domains. Every "Run it" step's code was actually executed with
   python3 (numpy / scipy / scikit-learn / stdlib), deterministic via
   default_rng(0), and the exact stdout pasted into `output`.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================ prob-sample-space ======================= */
  "prob-sample-space": [
    {
      title: `Tabletop game design`,
      domain: `Game design`,
      question: `For one fair die, what fraction of outcomes are even — and does a simulation agree?`,
      steps: [
        { title: `The data`, body: `<p>One fair six-sided die. The sample space is $\\Omega = \\{1,2,3,4,5,6\\}$, six equally likely outcomes.</p>` },
        { title: `The math`, body: `<p>The event "even" is $A = \\{2,4,6\\}$, a subset of $\\Omega$. Its probability is favorable over total: $P(A) = \\frac{3}{6} = 0.5$.</p>` },
        { title: `Run it`, body: `<p>Roll a million dice and measure the fraction that are even.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=1_000_000)
even = np.mean((rolls % 2) == 0)
print(f"theory P(even) = {3/6:.4f}")
print(f"sim    P(even) = {even:.4f}")`,
          output: `theory P(even) = 0.5000\nsim    P(even) = 0.4989` }
      ],
      conclusion: `Half of the outcomes are even: $P(A) = \\frac{3}{6} = 0.5$, and the simulation lands at $0.4989$.`
    },
    {
      title: `Casino craps odds`,
      domain: `Gambling`,
      question: `When you sum two dice, how likely is the famous total of 7?`,
      steps: [
        { title: `The data`, body: `<p>Two fair dice. The sample space is all $6 \\times 6 = 36$ ordered pairs $(a,b)$, each with probability $\\frac{1}{36}$.</p>` },
        { title: `The math`, body: `<p>The event "sum is 7" collects the pairs $\\{(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)\\}$ — 6 of them. So $P(\\text{sum}=7) = \\frac{6}{36} = 0.1667$.</p>` },
        { title: `Run it`, body: `<p>Roll a million pairs and count sevens.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
a = rng.integers(1, 7, size=1_000_000)
b = rng.integers(1, 7, size=1_000_000)
s = a + b
print(f"theory P(sum=7) = {6/36:.4f}")
print(f"sim    P(sum=7) = {np.mean(s == 7):.4f}")`,
          output: `theory P(sum=7) = 0.1667\nsim    P(sum=7) = 0.1670` }
      ],
      conclusion: `Seven is the most likely total: $P(\\text{sum}=7) = \\frac{6}{36} \\approx 0.1667$, matched by the simulated $0.1670$.`
    },
    {
      title: `Spam filter outcomes`,
      domain: `Email / ML`,
      question: `Tossing two coins as a toy "two-feature" space, how often is exactly one head seen?`,
      steps: [
        { title: `The data`, body: `<p>Two coins stand in for two yes/no features. The sample space is $\\Omega = \\{HH, HT, TH, TT\\}$, four equally likely outcomes.</p>` },
        { title: `The math`, body: `<p>The event "exactly one head" is $A = \\{HT, TH\\}$, a subset with 2 outcomes. So $P(A) = \\frac{2}{4} = 0.5$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million two-coin tosses.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
flips = rng.integers(0, 2, size=(1_000_000, 2))
heads = flips.sum(axis=1)
print(f"theory P(exactly 1 head) = {2/4:.4f}")
print(f"sim    P(exactly 1 head) = {np.mean(heads == 1):.4f}")`,
          output: `theory P(exactly 1 head) = 0.5000\nsim    P(exactly 1 head) = 0.5002` }
      ],
      conclusion: `Exactly one head covers 2 of 4 outcomes: $P(A) = \\frac{2}{4} = 0.5$, confirmed by the simulated $0.5002$.`
    }
  ],

  /* ============================ prob-axioms ============================= */
  "prob-axioms": [
    {
      title: `Softmax classifier output`,
      domain: `Machine learning`,
      question: `Does a softmax over three class scores actually obey the probability axioms?`,
      steps: [
        { title: `The data`, body: `<p>A 3-class model outputs raw scores (logits) $z = (2.0, 1.0, 0.1)$ for cat, dog, bird.</p>` },
        { title: `The math`, body: `<p>Softmax exponentiates and normalizes: $p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$. By construction each $p_i \\ge 0$ (axiom 1) and they sum to 1 (axiom 2, normalization).</p>` },
        { title: `Run it`, body: `<p>Compute the softmax and check both axioms.</p>`,
          code: `import numpy as np
z = np.array([2.0, 1.0, 0.1])
e = np.exp(z - z.max())
p = e / e.sum()
print("softmax probs:", np.round(p, 4))
print(f"all >= 0: {np.all(p >= 0)}")
print(f"sum to 1: {p.sum():.4f}")`,
          output: `softmax probs: [0.659  0.2424 0.0986]\nall >= 0: True\nsum to 1: 1.0000` }
      ],
      conclusion: `Softmax enforces the axioms: every $p_i \\ge 0$ and $\\sum_i p_i = 1$, here $(0.659, 0.2424, 0.0986)$.`
    },
    {
      title: `Weather forecasting`,
      domain: `Meteorology`,
      question: `If the rain probability is 0.3, what is the no-rain probability — and does sampling agree?`,
      steps: [
        { title: `The data`, body: `<p>A forecast says $P(\\text{rain}) = 0.3$ for tomorrow. Rain and no-rain are complementary events.</p>` },
        { title: `The math`, body: `<p>The complement rule follows from the axioms: $P(A^c) = 1 - P(A)$. So $P(\\text{no rain}) = 1 - 0.3 = 0.7$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million days with a 0.3 rain chance.</p>`,
          code: `import numpy as np
p_rain = 0.3
print(f"P(rain) = {p_rain}")
print(f"P(no rain) = 1 - P(rain) = {1 - p_rain}")
rng = np.random.default_rng(0)
sim = rng.random(1_000_000) < p_rain
print(f"sim P(rain)    = {np.mean(sim):.4f}")
print(f"sim P(no rain) = {np.mean(~sim):.4f}")`,
          output: `P(rain) = 0.3\nP(no rain) = 1 - P(rain) = 0.7\nsim P(rain)    = 0.3000\nsim P(no rain) = 0.7000` }
      ],
      conclusion: `By the complement rule $P(\\text{no rain}) = 1 - 0.3 = 0.7$, exactly the simulated value.`
    },
    {
      title: `Quality control on a die line`,
      domain: `Manufacturing`,
      question: `For two disjoint die events, does additivity $P(A \\cup B) = P(A) + P(B)$ hold in simulation?`,
      steps: [
        { title: `The data`, body: `<p>A fair die. Event $A = \\{1,2\\}$ and event $B = \\{5,6\\}$. They share no faces, so they are disjoint.</p>` },
        { title: `The math`, body: `<p>Axiom 3 (additivity for disjoint events): $P(A \\cup B) = P(A) + P(B) = \\frac{2}{6} + \\frac{2}{6} = \\frac{4}{6} \\approx 0.6667$. The overlap $P(A \\cap B)$ must be 0.</p>` },
        { title: `Run it`, body: `<p>Verify additivity and the empty overlap on a million rolls.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=1_000_000)
A = np.isin(rolls, [1, 2])
B = np.isin(rolls, [5, 6])
print(f"P(A)+P(B) theory = {2/6 + 2/6:.4f}")
print(f"P(A or B) sim    = {np.mean(A | B):.4f}")
print(f"overlap P(A and B) = {np.mean(A & B):.4f}")`,
          output: `P(A)+P(B) theory = 0.6667\nP(A or B) sim    = 0.6666\noverlap P(A and B) = 0.0000` }
      ],
      conclusion: `Additivity holds for disjoint events: $P(A \\cup B) = \\frac{4}{6} \\approx 0.6667$ with zero overlap, matching the simulated $0.6666$.`
    }
  ],

  /* ============================ prob-conditional ======================= */
  "prob-conditional": [
    {
      title: `Dice given partial info`,
      domain: `Games`,
      question: `Told a fair die came up even, how likely is it a 2?`,
      steps: [
        { title: `The data`, body: `<p>A fair die. Event $A$ = "rolled a 2"; event $B$ = "rolled even" $= \\{2,4,6\\}$. Someone reveals $B$ happened.</p>` },
        { title: `The math`, body: `<p>$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{1/6}{1/2} = \\frac{1}{3} \\approx 0.3333$. The world shrinks to the 3 even faces; 2 is one of them.</p>` },
        { title: `Run it`, body: `<p>Keep only the even rolls, then measure the fraction equal to 2.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=1_000_000)
even = (rolls % 2) == 0
p = np.mean(rolls[even] == 2)
print(f"theory P(2|even) = {(1/6)/(1/2):.4f}")
print(f"sim    P(2|even) = {p:.4f}")`,
          output: `theory P(2|even) = 0.3333\nsim    P(2|even) = 0.3322` }
      ],
      conclusion: `Given even, $P(2 \\mid \\text{even}) = \\frac{1/6}{1/2} = \\frac{1}{3}$, simulated at $0.3322$.`
    },
    {
      title: `Email marketing funnel`,
      domain: `Marketing`,
      question: `If a click can only happen after an open, what is $P(\\text{open} \\mid \\text{click})$?`,
      steps: [
        { title: `The data`, body: `<p>A campaign: $P(\\text{open}) = 0.60$, and a recipient clicks with probability $0.30$ only if they opened. No open means no click.</p>` },
        { title: `The math`, body: `<p>Since a click implies an open, $A \\cap B = B$ where $B$ = click. So $P(\\text{open} \\mid \\text{click}) = \\frac{P(\\text{click})}{P(\\text{click})} = 1$. Also $P(\\text{click}) = 0.60 \\times 0.30 = 0.18$.</p>` },
        { title: `Run it`, body: `<p>Simulate the two-stage funnel for a million recipients.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
n = 1_000_000
opened = rng.random(n) < 0.60
clicked = np.zeros(n, dtype=bool)
clicked[opened] = rng.random(opened.sum()) < 0.30
p = np.mean(opened[clicked])
print("P(open) = 0.60, P(click|open) = 0.30")
print(f"theory P(open|click) = {1.0:.4f}")
print(f"sim    P(open|click) = {p:.4f}")
print(f"sim    P(click) = {np.mean(clicked):.4f}")`,
          output: `P(open) = 0.60, P(click|open) = 0.30\ntheory P(open|click) = 1.0000\nsim    P(open|click) = 1.0000\nsim    P(click) = 0.1799` }
      ],
      conclusion: `Because a click can only follow an open, $P(\\text{open} \\mid \\text{click}) = 1$, and $P(\\text{click}) \\approx 0.18$ (simulated $0.1799$).`
    },
    {
      title: `Card draw without replacement`,
      domain: `Card games`,
      question: `Draw two cards; given the first is an ace, how likely is the second?`,
      steps: [
        { title: `The data`, body: `<p>A 52-card deck with 4 aces. Draw two cards without replacement. Condition on "first card is an ace".</p>` },
        { title: `The math`, body: `<p>Once one ace is gone, 51 cards remain with 3 aces left. So $P(\\text{2nd ace} \\mid \\text{1st ace}) = \\frac{3}{51} \\approx 0.0588$.</p>` },
        { title: `Run it`, body: `<p>Deal 500,000 two-card hands and condition on the first being an ace.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
trials = 500_000
cnt_first = cnt_both = 0
aces = set([0, 1, 2, 3])
for _ in range(trials):
    c = rng.choice(52, size=2, replace=False)
    if c[0] in aces:
        cnt_first += 1
        if c[1] in aces:
            cnt_both += 1
print(f"theory P(2nd ace | 1st ace) = {3/51:.4f}")
print(f"sim    P(2nd ace | 1st ace) = {cnt_both/cnt_first:.4f}")`,
          output: `theory P(2nd ace | 1st ace) = 0.0588\nsim    P(2nd ace | 1st ace) = 0.0580` }
      ],
      conclusion: `Conditioning on the first ace leaves 3 aces in 51 cards: $P = \\frac{3}{51} \\approx 0.0588$, simulated at $0.0580$.`
    }
  ],

  /* ============================ prob-bayes ============================= */
  "prob-bayes": [
    {
      title: `Rare-disease screening`,
      domain: `Medicine`,
      question: `With a rare disease and a 99% test, does a positive result really mean you are sick?`,
      steps: [
        { title: `The data`, body: `<p>Prevalence $P(\\text{sick}) = 0.001$. Sensitivity $P(+\\mid\\text{sick}) = 0.99$. False-positive rate $P(+\\mid\\text{healthy}) = 0.01$.</p>` },
        { title: `The math`, body: `<p>Evidence total: $P(+) = 0.99(0.001) + 0.01(0.999) = 0.01098$. Bayes: $P(\\text{sick}\\mid+) = \\frac{0.99 \\times 0.001}{0.01098} \\approx 0.0902$.</p>` },
        { title: `Run it`, body: `<p>Compute the posterior and confirm with a two-million-person simulation.</p>`,
          code: `import numpy as np
prev, sens, fpr = 0.001, 0.99, 0.01
pe = sens*prev + fpr*(1-prev)
post = sens*prev/pe
print(f"P(+) = {pe:.5f}")
print(f"P(sick|+) = {post:.4f}")
rng = np.random.default_rng(0)
n = 2_000_000
sick = rng.random(n) < prev
pos = np.empty(n, dtype=bool)
pos[sick] = rng.random(sick.sum()) < sens
pos[~sick] = rng.random((~sick).sum()) < fpr
print(f"sim P(sick|+) = {np.mean(sick[pos]):.4f}")`,
          output: `P(+) = 0.01098\nP(sick|+) = 0.0902\nsim P(sick|+) = 0.0909` }
      ],
      conclusion: `Even with a 99% test, a positive means only $P(\\text{sick}\\mid+) \\approx 0.09$ — the rare base rate dominates (simulated $0.0909$).`
    },
    {
      title: `Spam word filter`,
      domain: `Email / ML`,
      question: `If "free" appears, how likely is the email spam?`,
      steps: [
        { title: `The data`, body: `<p>Prior $P(\\text{spam}) = 0.4$. The word "free" appears in $60\\%$ of spam but only $5\\%$ of ham (legit mail).</p>` },
        { title: `The math`, body: `<p>$P(\\text{free}) = 0.6(0.4) + 0.05(0.6) = 0.27$. Bayes: $P(\\text{spam}\\mid\\text{free}) = \\frac{0.6 \\times 0.4}{0.27} \\approx 0.8889$.</p>` },
        { title: `Run it`, body: `<p>Plug the numbers into Bayes' rule.</p>`,
          code: `p_spam = 0.4
p_free_spam = 0.6
p_free_ham = 0.05
pe = p_free_spam*p_spam + p_free_ham*(1-p_spam)
post = p_free_spam*p_spam/pe
print(f"P('free') = {pe:.4f}")
print(f"P(spam|'free') = {post:.4f}")`,
          output: `P('free') = 0.2700\nP(spam|'free') = 0.8889` }
      ],
      conclusion: `Seeing "free" raises the spam belief from a $0.4$ prior to $P(\\text{spam}\\mid\\text{free}) \\approx 0.8889$.`
    },
    {
      title: `Credit-card fraud alert`,
      domain: `Finance`,
      question: `A transaction is flagged by a fraud model — how likely is it actually fraud?`,
      steps: [
        { title: `The data`, body: `<p>Base fraud rate $P(\\text{fraud}) = 0.002$. The model catches $95\\%$ of fraud, $P(\\text{flag}\\mid\\text{fraud}) = 0.95$, and falsely flags $3\\%$ of legit charges.</p>` },
        { title: `The math`, body: `<p>$P(\\text{flag}) = 0.95(0.002) + 0.03(0.998) = 0.03184$. Bayes: $P(\\text{fraud}\\mid\\text{flag}) = \\frac{0.95 \\times 0.002}{0.03184} \\approx 0.0597$.</p>` },
        { title: `Run it`, body: `<p>Evaluate the posterior precision of the alert.</p>`,
          code: `prev, sens, fpr = 0.002, 0.95, 0.03
pe = sens*prev + fpr*(1-prev)
post = sens*prev/pe
print(f"P(flag) = {pe:.5f}")
print(f"P(fraud|flag) = {post:.4f}")`,
          output: `P(flag) = 0.03184\nP(fraud|flag) = 0.0597` }
      ],
      conclusion: `Despite a strong model, a flagged charge is fraud only $P(\\text{fraud}\\mid\\text{flag}) \\approx 0.06$ of the time — rarity drives many false alarms.`
    }
  ],

  /* ============================ prob-total-prob ======================== */
  "prob-total-prob": [
    {
      title: `Two-factory defect rate`,
      domain: `Manufacturing`,
      question: `Two factories with different defect rates feed one line — what is the overall defect rate?`,
      steps: [
        { title: `The data`, body: `<p>Factory 1 makes $60\\%$ of bulbs at a $2\\%$ defect rate; Factory 2 makes $40\\%$ at $5\\%$. The factory is the hidden case.</p>` },
        { title: `The math`, body: `<p>Total probability: $P(D) = \\sum_i P(A_i) P(D \\mid A_i) = 0.6(0.02) + 0.4(0.05) = 0.032$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million bulbs routed through the two factories.</p>`,
          code: `import numpy as np
pa1, pb1, pb2 = 0.6, 0.02, 0.05
pb = pa1*pb1 + (1-pa1)*pb2
print(f"P(defect) = {pb:.4f}")
rng = np.random.default_rng(0)
n = 1_000_000
f1 = rng.random(n) < pa1
defect = np.empty(n, dtype=bool)
defect[f1] = rng.random(f1.sum()) < pb1
defect[~f1] = rng.random((~f1).sum()) < pb2
print(f"sim P(defect) = {np.mean(defect):.4f}")`,
          output: `P(defect) = 0.0320\nsim P(defect) = 0.0320` }
      ],
      conclusion: `Weighting each factory by its share gives $P(D) = 0.6(0.02) + 0.4(0.05) = 0.032$, matched exactly by the simulation.`
    },
    {
      title: `Spam rate across devices`,
      domain: `Email / ML`,
      question: `Mobile and desktop users send spam at different rates — what is the blended spam rate?`,
      steps: [
        { title: `The data`, body: `<p>$70\\%$ of messages come from mobile (spam rate $5\\%$); $30\\%$ from desktop (spam rate $12\\%$). The source device is the hidden case.</p>` },
        { title: `The math`, body: `<p>$P(\\text{spam}) = 0.7(0.05) + 0.3(0.12) = 0.071$.</p>` },
        { title: `Run it`, body: `<p>Combine the two cases.</p>`,
          code: `pb = 0.7*0.05 + 0.3*0.12
print(f"P(spam) = {pb:.4f}")`,
          output: `P(spam) = 0.0710` }
      ],
      conclusion: `The blended spam rate is $P(\\text{spam}) = 0.7(0.05) + 0.3(0.12) = 0.071$.`
    },
    {
      title: `Bruised-apple sorting`,
      domain: `Agriculture`,
      question: `Red and green apples bruise at different rates — what is the overall bruise rate?`,
      steps: [
        { title: `The data`, body: `<p>$70\\%$ of apples are red ($10\\%$ bruised); $30\\%$ are green ($20\\%$ bruised). Color is the hidden case.</p>` },
        { title: `The math`, body: `<p>$P(\\text{bruised}) = 0.7(0.10) + 0.3(0.20) = 0.13$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million apples by color.</p>`,
          code: `import numpy as np
pb = 0.7*0.10 + 0.3*0.20
print(f"P(bruised) = {pb:.4f}")
rng = np.random.default_rng(0)
n = 1_000_000
red = rng.random(n) < 0.7
bruised = np.empty(n, dtype=bool)
bruised[red] = rng.random(red.sum()) < 0.10
bruised[~red] = rng.random((~red).sum()) < 0.20
print(f"sim P(bruised) = {np.mean(bruised):.4f}")`,
          output: `P(bruised) = 0.1300\nsim P(bruised) = 0.1301` }
      ],
      conclusion: `Averaging over color gives $P(\\text{bruised}) = 0.7(0.10) + 0.3(0.20) = 0.13$, simulated at $0.1301$.`
    }
  ],

  /* ============================ prob-independence ====================== */
  "prob-independence": [
    {
      title: `Independence test from a table`,
      domain: `Statistics`,
      question: `Given $P(A)=0.5$, $P(B)=0.4$, $P(A \\cap B)=0.2$, are A and B independent?`,
      steps: [
        { title: `The data`, body: `<p>Two events with $P(A) = 0.5$, $P(B) = 0.4$, and observed joint $P(A \\cap B) = 0.2$.</p>` },
        { title: `The math`, body: `<p>Independence holds iff $P(A \\cap B) = P(A)P(B)$. Here $P(A)P(B) = 0.5 \\times 0.4 = 0.2$, which equals the joint.</p>` },
        { title: `Run it`, body: `<p>Compare the product against the joint.</p>`,
          code: `pa, pb, pab = 0.5, 0.4, 0.2
print(f"P(A)P(B) = {pa*pb:.3f}")
print(f"P(A and B) = {pab:.3f}")
print(f"independent: {abs(pa*pb - pab) < 1e-9}")`,
          output: `P(A)P(B) = 0.200\nP(A and B) = 0.200\nindependent: True` }
      ],
      conclusion: `Since $P(A \\cap B) = P(A)P(B) = 0.2$, the events are independent.`
    },
    {
      title: `Consecutive coin flips`,
      domain: `Games`,
      question: `Does the first coin flip carry any information about the second?`,
      steps: [
        { title: `The data`, body: `<p>Two fair coin flips $A$ (first heads) and $B$ (second heads), simulated independently.</p>` },
        { title: `The math`, body: `<p>If independent, $P(A \\cap B) = P(A)P(B) = 0.5 \\times 0.5 = 0.25$.</p>` },
        { title: `Run it`, body: `<p>Estimate all three probabilities from a million flip-pairs.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
n = 1_000_000
a = rng.integers(0, 2, n)
b = rng.integers(0, 2, n)
pa = np.mean(a == 1); pb = np.mean(b == 1)
pab = np.mean((a == 1) & (b == 1))
print(f"sim P(A) = {pa:.4f}, P(B) = {pb:.4f}")
print(f"P(A)P(B) = {pa*pb:.4f}, P(A and B) = {pab:.4f}")`,
          output: `sim P(A) = 0.5004, P(B) = 0.4998\nP(A)P(B) = 0.2501, P(A and B) = 0.2499` }
      ],
      conclusion: `The product $0.2501$ matches the joint $0.2499$, so consecutive flips are independent.`
    },
    {
      title: `Naive Bayes word multiplication`,
      domain: `ML / NLP`,
      question: `Under the naive-independence assumption, what is the chance an email contains all three trigger words?`,
      steps: [
        { title: `The data`, body: `<p>Word frequencies in spam: "buy" $0.30$, "now" $0.25$, "free" $0.40$. Naive Bayes treats them as independent.</p>` },
        { title: `The math`, body: `<p>Independence lets us multiply: $P(\\text{all three}) = 0.30 \\times 0.25 \\times 0.40 = 0.03$.</p>` },
        { title: `Run it`, body: `<p>Multiply the per-word probabilities.</p>`,
          code: `import numpy as np
words = {"buy": 0.3, "now": 0.25, "free": 0.4}
p = np.prod(list(words.values()))
print(f"assume independence: P(all 3 words) = {p:.4f}")`,
          output: `assume independence: P(all 3 words) = 0.0300` }
      ],
      conclusion: `The independence assumption collapses the joint to a product: $P(\\text{all three}) = 0.30 \\cdot 0.25 \\cdot 0.40 = 0.03$.`
    }
  ],

  /* ============================ prob-counting ========================== */
  "prob-counting": [
    {
      title: `Team photo vs team pick`,
      domain: `Everyday`,
      question: `From 5 students, how many ways to line up 3 versus to choose 3?`,
      steps: [
        { title: `The data`, body: `<p>A class of $n = 5$ students; we take $r = 3$.</p>` },
        { title: `The math`, body: `<p>Order matters (a line-up): $\\frac{n!}{(n-r)!} = \\frac{5!}{2!} = 60$. Order ignored (a team): $\\binom{5}{3} = 10$.</p>` },
        { title: `Run it`, body: `<p>Use Python's stdlib counting functions.</p>`,
          code: `from math import comb, perm
print(f"line up 3 of 5 (order matters) = {perm(5,3)}")
print(f"choose 3 of 5 (order ignored) = {comb(5,3)}")`,
          output: `line up 3 of 5 (order matters) = 60\nchoose 3 of 5 (order ignored) = 10` }
      ],
      conclusion: `Order matters gives $\\frac{5!}{2!} = 60$; order ignored gives $\\binom{5}{3} = 10$ — a factor of $3! = 6$ apart.`
    },
    {
      title: `Lottery jackpot odds`,
      domain: `Gambling`,
      question: `How many ways to pick 6 numbers from 49, and what are the jackpot odds?`,
      steps: [
        { title: `The data`, body: `<p>A 6-from-49 lottery: $n = 49$, $r = 6$, order does not matter.</p>` },
        { title: `The math`, body: `<p>The number of tickets is $\\binom{49}{6} = 13{,}983{,}816$. Each equally likely, so the jackpot chance is $\\frac{1}{13{,}983{,}816}$.</p>` },
        { title: `Run it`, body: `<p>Count the combinations.</p>`,
          code: `from math import comb
print(f"C(49,6) = {comb(49,6)}")
print(f"odds of jackpot = 1 in {comb(49,6)}")`,
          output: `C(49,6) = 13983816\nodds of jackpot = 1 in 13983816` }
      ],
      conclusion: `There are $\\binom{49}{6} = 13{,}983{,}816$ tickets, so the jackpot odds are 1 in $13{,}983{,}816$.`
    },
    {
      title: `Poker flush probability`,
      domain: `Card games`,
      question: `Out of all 5-card hands, how many are flushes, and how likely is one?`,
      steps: [
        { title: `The data`, body: `<p>Standard 52-card deck, 5-card hands, 4 suits of 13 cards each.</p>` },
        { title: `The math`, body: `<p>Total hands: $\\binom{52}{5} = 2{,}598{,}960$. Flushes (all one suit): $4\\binom{13}{5} = 5148$. So $P(\\text{flush}) = \\frac{5148}{2598960} \\approx 0.00198$ (includes straight flushes).</p>` },
        { title: `Run it`, body: `<p>Count hands and flushes.</p>`,
          code: `from math import comb
total = comb(52, 5)
flush = 4 * comb(13, 5)
print(f"5-card hands = {total}")
print(f"flush hands = {flush}")
print(f"P(flush) = {flush/total:.6f}")`,
          output: `5-card hands = 2598960\nflush hands = 5148\nP(flush) = 0.001981` }
      ],
      conclusion: `Of $\\binom{52}{5} = 2{,}598{,}960$ hands, $4\\binom{13}{5} = 5148$ are flushes, so $P(\\text{flush}) \\approx 0.00198$.`
    }
  ],

  /* ============================ prob-random-variable =================== */
  "prob-random-variable": [
    {
      title: `Heads in three flips`,
      domain: `Games`,
      question: `What is the full PMF of the number of heads in three fair flips?`,
      steps: [
        { title: `The data`, body: `<p>Flip a fair coin 3 times; let $X$ = number of heads, taking values $0,1,2,3$.</p>` },
        { title: `The math`, body: `<p>$p_X(k) = \\binom{3}{k}(0.5)^3$, giving $\\frac{1}{8}, \\frac{3}{8}, \\frac{3}{8}, \\frac{1}{8}$, which sum to 1.</p>` },
        { title: `Run it`, body: `<p>Compute the PMF and confirm with a million simulated triples.</p>`,
          code: `import numpy as np
from math import comb
n = 3
pmf = [comb(n, k) * 0.5**n for k in range(n+1)]
print("PMF:", [f"{p:.3f}" for p in pmf])
print(f"sum = {sum(pmf):.3f}")
rng = np.random.default_rng(0)
flips = rng.integers(0, 2, size=(1_000_000, 3)).sum(axis=1)
sim = [np.mean(flips == k) for k in range(4)]
print("sim:", [f"{p:.3f}" for p in sim])`,
          output: `PMF: ['0.125', '0.375', '0.375', '0.125']\nsum = 1.000\nsim: ['0.125', '0.375', '0.376', '0.125']` }
      ],
      conclusion: `The PMF is $\\left(\\frac{1}{8}, \\frac{3}{8}, \\frac{3}{8}, \\frac{1}{8}\\right)$ summing to 1, matched by the simulation.`
    },
    {
      title: `Ad clicks per session`,
      domain: `Advertising`,
      question: `Over 4 impressions, what is the PMF of the number of clicks?`,
      steps: [
        { title: `The data`, body: `<p>A user sees $n = 4$ ads, each clicked independently with probability $p = 0.2$. Let $X$ = clicks.</p>` },
        { title: `The math`, body: `<p>$p_X(k) = \\binom{4}{k}(0.2)^k(0.8)^{4-k}$ for $k = 0,\\dots,4$.</p>` },
        { title: `Run it`, body: `<p>List the PMF values and check they sum to 1.</p>`,
          code: `from math import comb
n, p = 4, 0.2
pmf = [comb(n,k)*p**k*(1-p)**(n-k) for k in range(n+1)]
print("PMF clicks:", [f"{x:.3f}" for x in pmf])
print(f"sum = {sum(pmf):.3f}")`,
          output: `PMF clicks: ['0.410', '0.410', '0.154', '0.026', '0.002']\nsum = 1.000` }
      ],
      conclusion: `The click PMF is $(0.410, 0.410, 0.154, 0.026, 0.002)$ — zero or one click is most likely — and it sums to 1.`
    },
    {
      title: `Die-face random variable`,
      domain: `Board games`,
      question: `For a fair die, what is $p_X(3)$ and do the six values sum to 1?`,
      steps: [
        { title: `The data`, body: `<p>Roll a fair die; let $X$ be the face shown, with values $1,\\dots,6$.</p>` },
        { title: `The math`, body: `<p>Each face is equally likely, $p_X(x) = \\frac{1}{6}$. So $p_X(3) = \\frac{1}{6} \\approx 0.1667$ and $\\sum_x p_X(x) = 1$.</p>` },
        { title: `Run it`, body: `<p>Build the uniform PMF.</p>`,
          code: `pmf = [1/6]*6
print(f"p_X(3) = {pmf[2]:.4f}")
print(f"sum = {sum(pmf):.4f}")`,
          output: `p_X(3) = 0.1667\nsum = 1.0000` }
      ],
      conclusion: `Each face has $p_X(x) = \\frac{1}{6}$, so $p_X(3) \\approx 0.1667$ and the six values sum to 1.`
    }
  ],

  /* ============================ prob-expectation ======================= */
  "prob-expectation": [
    {
      title: `Expected die winnings`,
      domain: `Games`,
      question: `If you win the rolled number in dollars, what do you expect to win per roll?`,
      steps: [
        { title: `The data`, body: `<p>A fair die; you win $X$ dollars where $X$ is the face, each with probability $\\frac{1}{6}$.</p>` },
        { title: `The math`, body: `<p>$E[X] = \\sum_x x\\,p_X(x) = \\frac{1+2+3+4+5+6}{6} = 3.5$.</p>` },
        { title: `Run it`, body: `<p>Compute the weighted sum and confirm with a million rolls.</p>`,
          code: `import numpy as np
faces = np.arange(1, 7)
p = np.full(6, 1/6)
EX = np.sum(faces*p)
print(f"E[X] = {EX:.4f}")
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=1_000_000)
print(f"sim mean = {rolls.mean():.4f}")`,
          output: `E[X] = 3.5000\nsim mean = 3.5022` }
      ],
      conclusion: `The expected winning is $E[X] = 3.5$ dollars per roll, simulated at $3.5022$ — never an actual face, but the long-run average.`
    },
    {
      title: `Expected revenue per visit`,
      domain: `E-commerce`,
      question: `If 5% of visitors buy a \\$100 item, what is the expected revenue per visit?`,
      steps: [
        { title: `The data`, body: `<p>Each visitor buys with probability $0.05$ for \\$100, else \\$0.</p>` },
        { title: `The math`, body: `<p>$E[\\text{revenue}] = 0.05 \\times 100 + 0.95 \\times 0 = 5$ dollars.</p>` },
        { title: `Run it`, body: `<p>Simulate two million visits.</p>`,
          code: `import numpy as np
EX = 0.05*100 + 0.95*0
print(f"E[revenue per visit] = \${EX:.2f}")
rng = np.random.default_rng(0)
n = 2_000_000
rev = np.where(rng.random(n) < 0.05, 100.0, 0.0)
print(f"sim mean = \${rev.mean():.2f}")`,
          output: `E[revenue per visit] = $5.00\nsim mean = $5.00` }
      ],
      conclusion: `Expected revenue is $E[X] = 0.05 \\times 100 = 5$ dollars per visit, matched exactly by the simulation.`
    },
    {
      title: `Roulette house edge`,
      domain: `Gambling`,
      question: `On a single-number roulette bet, what is the expected payoff per \\$1?`,
      steps: [
        { title: `The data`, body: `<p>American roulette: 38 slots. A single-number bet pays 35:1 on a $\\frac{1}{38}$ chance, else loses the \\$1.</p>` },
        { title: `The math`, body: `<p>$E[X] = 35 \\cdot \\frac{1}{38} + (-1) \\cdot \\frac{37}{38} \\approx -0.0526$ dollars.</p>` },
        { title: `Run it`, body: `<p>Compute the expected payoff.</p>`,
          code: `EX = (35)*(1/38) + (-1)*(37/38)
print(f"E[payoff per \$1 bet] = \${EX:.4f}")`,
          output: `E[payoff per $1 bet] = $-0.0526` }
      ],
      conclusion: `The expected payoff is $E[X] \\approx -0.0526$ dollars per \\$1 bet — the house edge of about $5.26\\%$.`
    }
  ],

  /* ============================ prob-variance ========================== */
  "prob-variance": [
    {
      title: `Two-point coin payout`,
      domain: `Games`,
      question: `For a coin worth \\$0 or \\$2, what are the variance and standard deviation?`,
      steps: [
        { title: `The data`, body: `<p>$X = 2$ with probability $0.5$, else $0$.</p>` },
        { title: `The math`, body: `<p>$E[X] = 1$, $E[X^2] = 0.5(4) = 2$, so $\\operatorname{Var}(X) = E[X^2] - (E[X])^2 = 2 - 1 = 1$ and $\\sigma = 1$.</p>` },
        { title: `Run it`, body: `<p>Confirm with a million draws.</p>`,
          code: `import numpy as np
p = 0.5
EX = 2*p
EX2 = 4*p
V = EX2 - EX**2
print(f"E[X]={EX}, E[X^2]={EX2}, Var={V}, sd={V**0.5}")
rng = np.random.default_rng(0)
x = np.where(rng.random(1_000_000) < p, 2.0, 0.0)
print(f"sim Var = {x.var():.4f}")`,
          output: `E[X]=1.0, E[X^2]=2.0, Var=1.0, sd=1.0\nsim Var = 1.0000` }
      ],
      conclusion: `The variance is $\\operatorname{Var}(X) = 2 - 1^2 = 1$ and $\\sigma = 1$, confirmed by the simulation.`
    },
    {
      title: `Same return, different risk`,
      domain: `Finance`,
      question: `Two stocks have the same mean return — how does variance distinguish their risk?`,
      steps: [
        { title: `The data`, body: `<p>Stock A: returns $\\sim \\mathcal{N}(0.08, 0.05^2)$. Stock B: $\\sim \\mathcal{N}(0.08, 0.20^2)$. Same mean, different spread.</p>` },
        { title: `The math`, body: `<p>Standard deviation is risk: $\\sigma_A = 0.05$ versus $\\sigma_B = 0.20$, a four-fold difference despite identical means.</p>` },
        { title: `Run it`, body: `<p>Simulate a million returns of each.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
rA = rng.normal(0.08, 0.05, 1_000_000)
rB = rng.normal(0.08, 0.20, 1_000_000)
print(f"A: mean={rA.mean():.4f} sd={rA.std():.4f}")
print(f"B: mean={rB.mean():.4f} sd={rB.std():.4f}")`,
          output: `A: mean=0.0800 sd=0.0500\nB: mean=0.0802 sd=0.1998` }
      ],
      conclusion: `Both average $\\approx 0.08$, but $\\sigma_B \\approx 0.20$ versus $\\sigma_A \\approx 0.05$ — variance is what makes B four times riskier.`
    },
    {
      title: `A constant has no spread`,
      domain: `Statistics`,
      question: `What is the variance of a quantity that is always exactly 7?`,
      steps: [
        { title: `The data`, body: `<p>A "variable" pinned at the constant value 7 with no randomness.</p>` },
        { title: `The math`, body: `<p>It never leaves its mean of 7, so every squared distance is 0 and $\\operatorname{Var}(X) = 0$.</p>` },
        { title: `Run it`, body: `<p>Compute the variance of a constant array.</p>`,
          code: `import numpy as np
x = np.full(1000, 7.0)
print(f"Var of constant 7 = {x.var():.4f}")`,
          output: `Var of constant 7 = 0.0000` }
      ],
      conclusion: `A constant has $\\operatorname{Var}(X) = 0$ — zero spread, since it never moves from its mean.`
    }
  ],

  /* ============================ prob-bernoulli-binomial ================ */
  "prob-bernoulli-binomial": [
    {
      title: `Exactly two heads in three flips`,
      domain: `Games`,
      question: `Flipping a fair coin 3 times, how likely is exactly 2 heads?`,
      steps: [
        { title: `The data`, body: `<p>$n = 3$ independent fair flips, success $p = 0.5$, asking $k = 2$.</p>` },
        { title: `The math`, body: `<p>$P(X=2) = \\binom{3}{2}(0.5)^2(0.5)^1 = 3 \\times 0.125 = 0.375$.</p>` },
        { title: `Run it`, body: `<p>Check the formula, scipy, and a million simulated runs.</p>`,
          code: `import numpy as np
from scipy import stats
from math import comb
n, p, k = 3, 0.5, 2
pk = comb(n,k)*p**k*(1-p)**(n-k)
print(f"P(X=2) = {pk:.4f}")
print(f"scipy = {stats.binom.pmf(k, n, p):.4f}")
rng = np.random.default_rng(0)
x = rng.binomial(n, p, 1_000_000)
print(f"sim P(X=2) = {np.mean(x == 2):.4f}")`,
          output: `P(X=2) = 0.3750\nscipy = 0.3750\nsim P(X=2) = 0.3745` }
      ],
      conclusion: `$P(X=2) = \\binom{3}{2}(0.5)^3 = 0.375$, agreeing across formula, scipy, and simulation ($0.3745$).`
    },
    {
      title: `A/B test conversions`,
      domain: `Product / ML`,
      question: `With 1000 visitors at a 4% conversion rate, how likely are 50 or more conversions?`,
      steps: [
        { title: `The data`, body: `<p>$n = 1000$ visitors, each converting with $p = 0.04$. $X$ = total conversions $\\sim \\text{Binomial}(1000, 0.04)$.</p>` },
        { title: `The math`, body: `<p>Mean $np = 40$, standard deviation $\\sqrt{np(1-p)} \\approx 6.197$. The upper-tail $P(X \\ge 50)$ comes from the survival function.</p>` },
        { title: `Run it`, body: `<p>Use scipy's binomial survival function.</p>`,
          code: `from scipy import stats
n, p = 1000, 0.04
print(f"mean conversions np = {n*p:.1f}")
print(f"sd = {(n*p*(1-p))**0.5:.3f}")
print(f"P(X >= 50) = {stats.binom.sf(49, n, p):.4f}")`,
          output: `mean conversions np = 40.0\nsd = 6.197\nP(X >= 50) = 0.0663` }
      ],
      conclusion: `Expecting $np = 40$ conversions, the chance of seeing 50 or more is $P(X \\ge 50) \\approx 0.0663$.`
    },
    {
      title: `Archer's perfect round`,
      domain: `Sports`,
      question: `An 80%-accurate archer takes 5 shots — expected hits, and chance of all 5?`,
      steps: [
        { title: `The data`, body: `<p>$n = 5$ shots, each hitting with $p = 0.8$.</p>` },
        { title: `The math`, body: `<p>Expected hits $E[X] = np = 4$. All five hit with $p^5 = 0.8^5 \\approx 0.3277$.</p>` },
        { title: `Run it`, body: `<p>Compute the mean and the all-hit probability.</p>`,
          code: `from scipy import stats
n, p = 5, 0.8
print(f"E[hits] = {n*p:.1f}")
print(f"P(all 5) = {p**5:.4f}")
print(f"scipy P(X=5) = {stats.binom.pmf(5, n, p):.4f}")`,
          output: `E[hits] = 4.0\nP(all 5) = 0.3277\nscipy P(X=5) = 0.3277` }
      ],
      conclusion: `The archer expects $np = 4$ hits, with $P(\\text{all 5}) = 0.8^5 \\approx 0.3277$.`
    }
  ],

  /* ============================ prob-geometric-poisson ================ */
  "prob-geometric-poisson": [
    {
      title: `Rolling until the first six`,
      domain: `Games`,
      question: `How likely is the first six to appear on roll 3, and how many rolls on average?`,
      steps: [
        { title: `The data`, body: `<p>Roll a fair die until the first six; success $p = \\frac{1}{6}$. $X$ = trial of first six $\\sim$ Geometric.</p>` },
        { title: `The math`, body: `<p>$P(X=3) = (1-p)^2 p = \\left(\\frac{5}{6}\\right)^2 \\frac{1}{6} \\approx 0.1157$, and $E[X] = \\frac{1}{p} = 6$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million geometric waits.</p>`,
          code: `import numpy as np
p = 1/6
pk3 = (1-p)**2 * p
print(f"P(first six on roll 3) = {pk3:.4f}")
print(f"E[rolls] = {1/p:.1f}")
rng = np.random.default_rng(0)
g = rng.geometric(p, 1_000_000)
print(f"sim P(=3) = {np.mean(g == 3):.4f}, sim mean = {g.mean():.4f}")`,
          output: `P(first six on roll 3) = 0.1157\nE[rolls] = 6.0\nsim P(=3) = 0.1157, sim mean = 5.9987` }
      ],
      conclusion: `$P(X=3) = \\left(\\frac{5}{6}\\right)^2 \\frac{1}{6} \\approx 0.1157$ and the mean wait is $\\frac{1}{p} = 6$ rolls (simulated $5.9987$).`
    },
    {
      title: `Call center quiet minute`,
      domain: `Operations`,
      question: `If 2 calls arrive per minute on average, how likely is a minute with zero calls?`,
      steps: [
        { title: `The data`, body: `<p>Calls arrive as a Poisson process at rate $\\lambda = 2$ per minute. $X$ = calls in a minute.</p>` },
        { title: `The math`, body: `<p>$P(X=0) = \\frac{\\lambda^0 e^{-\\lambda}}{0!} = e^{-2} \\approx 0.1353$.</p>` },
        { title: `Run it`, body: `<p>Use scipy and simulate a million minutes.</p>`,
          code: `import numpy as np
from scipy import stats
lam = 2
print(f"P(0 calls) = {stats.poisson.pmf(0, lam):.4f}")
rng = np.random.default_rng(0)
c = rng.poisson(lam, 1_000_000)
print(f"sim P(0) = {np.mean(c == 0):.4f}, sim mean = {c.mean():.4f}")`,
          output: `P(0 calls) = 0.1353\nsim P(0) = 0.1349, sim mean = 2.0012` }
      ],
      conclusion: `A quiet minute has probability $e^{-2} \\approx 0.1353$ (simulated $0.1349$), with the mean count equal to $\\lambda = 2$.`
    },
    {
      title: `Web traffic spike`,
      domain: `Web infrastructure`,
      question: `If a server averages 5 hits/second, how likely is a second with 10 or more hits?`,
      steps: [
        { title: `The data`, body: `<p>Requests arrive Poisson at $\\lambda = 5$ per second.</p>` },
        { title: `The math`, body: `<p>The upper tail is $P(X \\ge 10) = 1 - F(9)$. For a Poisson, mean $=$ variance $= \\lambda = 5$.</p>` },
        { title: `Run it`, body: `<p>Use the Poisson survival function.</p>`,
          code: `from scipy import stats
lam = 5
print(f"P(X >= 10) = {stats.poisson.sf(9, lam):.4f}")
print(f"E[X] = Var[X] = {lam}")`,
          output: `P(X >= 10) = 0.0318\nE[X] = Var[X] = 5` }
      ],
      conclusion: `A spike of 10+ hits in one second has probability $P(X \\ge 10) \\approx 0.0318$, with mean and variance both $\\lambda = 5$.`
    }
  ],

  /* ============================ prob-pdf-cdf =========================== */
  "prob-pdf-cdf": [
    {
      title: `Uniform cutoff area`,
      domain: `Statistics`,
      question: `For $X$ uniform on $[0,2]$, what is $P(X \\le 1)$ as an area?`,
      steps: [
        { title: `The data`, body: `<p>$X$ is uniform on $[0,2]$: a flat density at height $\\frac{1}{2}$.</p>` },
        { title: `The math`, body: `<p>$F_X(1) = P(X \\le 1) = 1 \\times \\frac{1}{2} = 0.5$, the area of the rectangle from 0 to 1.</p>` },
        { title: `Run it`, body: `<p>Use scipy's CDF and confirm by sampling.</p>`,
          code: `import numpy as np
from scipy import stats
print(f"F(1) = {stats.uniform.cdf(1, 0, 2):.4f}")
print(f"P(0.5<X<1.5) = {stats.uniform.cdf(1.5,0,2)-stats.uniform.cdf(0.5,0,2):.4f}")
rng = np.random.default_rng(0)
x = rng.uniform(0, 2, 1_000_000)
print(f"sim P(X<=1) = {np.mean(x <= 1):.4f}")`,
          output: `F(1) = 0.5000\nP(0.5<X<1.5) = 0.5000\nsim P(X<=1) = 0.5002` }
      ],
      conclusion: `The area left of 1 is $F_X(1) = 1 \\times \\frac{1}{2} = 0.5$, matched by the simulated $0.5002$.`
    },
    {
      title: `Sensor reading threshold`,
      domain: `IoT / sensors`,
      question: `A sensor reads $\\mathcal{N}(100, 5^2)$ — how often is the reading below 90?`,
      steps: [
        { title: `The data`, body: `<p>Readings are Normal with mean 100 and standard deviation 5.</p>` },
        { title: `The math`, body: `<p>$P(X &lt; 90) = F(90)$ is the area under the bell left of 90, which sits 2 standard deviations below the mean.</p>` },
        { title: `Run it`, body: `<p>Read off the Normal CDF.</p>`,
          code: `from scipy import stats
print(f"P(X < 90) = {stats.norm.cdf(90, 100, 5):.4f}")
print(f"P(95 < X < 105) = {stats.norm.cdf(105,100,5)-stats.norm.cdf(95,100,5):.4f}")`,
          output: `P(X < 90) = 0.0228\nP(95 < X < 105) = 0.6827` }
      ],
      conclusion: `A reading below 90 (two $\\sigma$ down) has area $P(X &lt; 90) \\approx 0.0228$; within one $\\sigma$ holds $\\approx 0.6827$.`
    },
    {
      title: `Model score threshold`,
      domain: `Machine learning`,
      question: `If scores follow a Beta(2,5) density, how often does a score exceed 0.5?`,
      steps: [
        { title: `The data`, body: `<p>A classifier's scores are modeled as $\\text{Beta}(2,5)$ on $[0,1]$ — skewed toward low scores.</p>` },
        { title: `The math`, body: `<p>$P(\\text{score} &gt; 0.5) = 1 - F(0.5)$, the area under the density to the right of the 0.5 threshold.</p>` },
        { title: `Run it`, body: `<p>Use the Beta survival function and confirm by sampling.</p>`,
          code: `import numpy as np
from scipy import stats
print(f"P(score > 0.5) = {stats.beta.sf(0.5, 2, 5):.4f}")
rng = np.random.default_rng(0)
s = rng.beta(2, 5, 1_000_000)
print(f"sim = {np.mean(s > 0.5):.4f}")`,
          output: `P(score > 0.5) = 0.1094\nsim = 0.1093` }
      ],
      conclusion: `The area past the 0.5 threshold is $P(\\text{score} &gt; 0.5) \\approx 0.1094$, matched by the simulated $0.1093$.`
    }
  ],

  /* ============================ prob-uniform-exponential ============== */
  "prob-uniform-exponential": [
    {
      title: `Bus arrival window`,
      domain: `Transit`,
      question: `A bus is equally likely any minute in $[0,10]$ — mean wait, and chance under 3 minutes?`,
      steps: [
        { title: `The data`, body: `<p>Wait time is uniform on $[0,10]$ minutes.</p>` },
        { title: `The math`, body: `<p>Mean $\\frac{a+b}{2} = 5$ minutes. $P(\\text{wait} &lt; 3) = F(3) = \\frac{3}{10} = 0.3$.</p>` },
        { title: `Run it`, body: `<p>Compute the mean and the short-wait probability.</p>`,
          code: `from scipy import stats
print(f"mean wait = {(0+10)/2:.1f}")
print(f"P(wait < 3) = {stats.uniform.cdf(3,0,10):.4f}")`,
          output: `mean wait = 5.0\nP(wait < 3) = 0.3000` }
      ],
      conclusion: `The mean wait is $\\frac{0+10}{2} = 5$ minutes, and $P(\\text{wait} &lt; 3) = \\frac{3}{10} = 0.3$.`
    },
    {
      title: `Server request gaps`,
      domain: `Web infrastructure`,
      question: `At one request every 5 minutes, how likely is a gap longer than 10 minutes?`,
      steps: [
        { title: `The data`, body: `<p>Gaps between requests are Exponential with rate $\\lambda = \\frac{1}{5}$ per minute.</p>` },
        { title: `The math`, body: `<p>Mean gap $\\frac{1}{\\lambda} = 5$ minutes. $P(\\text{gap} &gt; 10) = e^{-\\lambda \\cdot 10} = e^{-2} \\approx 0.1353$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million gaps.</p>`,
          code: `import numpy as np
lam = 1/5
print(f"mean gap = {1/lam:.1f} min")
print(f"P(gap > 10 min) = {np.exp(-lam*10):.4f}")
rng = np.random.default_rng(0)
x = rng.exponential(1/lam, 1_000_000)
print(f"sim mean = {x.mean():.3f}, sim P(>10) = {np.mean(x > 10):.4f}")`,
          output: `mean gap = 5.0 min\nP(gap > 10 min) = 0.1353\nsim mean = 4.999, sim P(>10) = 0.1353` }
      ],
      conclusion: `The mean gap is $\\frac{1}{\\lambda} = 5$ minutes and $P(\\text{gap} &gt; 10) = e^{-2} \\approx 0.1353$, both matched in simulation.`
    },
    {
      title: `The memoryless wait`,
      domain: `Reliability`,
      question: `After already waiting 2 units, how much longer do you expect to wait?`,
      steps: [
        { title: `The data`, body: `<p>Exponential waiting times with rate $\\lambda = 0.5$, mean $\\frac{1}{\\lambda} = 2$.</p>` },
        { title: `The math`, body: `<p>The Exponential is memoryless: $E[X - 2 \\mid X &gt; 2] = \\frac{1}{\\lambda} = 2$. The past wait is forgotten.</p>` },
        { title: `Run it`, body: `<p>Among samples that exceeded 2, measure the average remaining wait.</p>`,
          code: `import numpy as np
lam = 0.5
rng = np.random.default_rng(0)
x = rng.exponential(1/lam, 2_000_000)
cond = x[x > 2] - 2
print(f"E[remaining | waited 2] = {cond.mean():.3f}")
print(f"unconditional mean = {1/lam:.3f}")`,
          output: `E[remaining | waited 2] = 2.000\nunconditional mean = 2.000` }
      ],
      conclusion: `The expected remaining wait stays $\\frac{1}{\\lambda} = 2$ regardless of time elapsed — the memoryless property, confirmed at $2.000$.`
    }
  ],

  /* ============================ prob-normal =========================== */
  "prob-normal": [
    {
      title: `Heights and the 68-95-99.7 rule`,
      domain: `Human biology`,
      question: `For heights $\\mathcal{N}(170, 10^2)$ cm, how do the standard-deviation bands fill out?`,
      steps: [
        { title: `The data`, body: `<p>Adult heights are roughly Normal with $\\mu = 170$, $\\sigma = 10$ cm.</p>` },
        { title: `The math`, body: `<p>The empirical rule: $\\approx 68\\%$ within $\\pm 1\\sigma$ (160-180), $\\approx 95\\%$ within $\\pm 2\\sigma$ (150-190), and 200 cm is $3\\sigma$ out.</p>` },
        { title: `Run it`, body: `<p>Read the band areas from the Normal CDF.</p>`,
          code: `from scipy import stats
print(f"P(160<H<180) = {stats.norm.cdf(180,170,10)-stats.norm.cdf(160,170,10):.4f}")
print(f"P(150<H<190) = {stats.norm.cdf(190,170,10)-stats.norm.cdf(150,170,10):.4f}")
print(f"P(H>200) = {stats.norm.sf(200,170,10):.5f}")`,
          output: `P(160<H<180) = 0.6827\nP(150<H<190) = 0.9545\nP(H>200) = 0.00135` }
      ],
      conclusion: `The bands give $\\pm 1\\sigma \\approx 0.6827$ and $\\pm 2\\sigma \\approx 0.9545$, while $P(H &gt; 200) \\approx 0.00135$ — a 3$\\sigma$ rarity.`
    },
    {
      title: `Standardized test percentile`,
      domain: `Education`,
      question: `On scores $\\mathcal{N}(500, 100^2)$, what percentile is a 650?`,
      steps: [
        { title: `The data`, body: `<p>Test scores are Normal with $\\mu = 500$, $\\sigma = 100$. A student scores 650.</p>` },
        { title: `The math`, body: `<p>Standardize: $z = \\frac{650 - 500}{100} = 1.5$. The percentile is $F(1.5)$, the area left of $z = 1.5$.</p>` },
        { title: `Run it`, body: `<p>Convert to a z-score and read the CDF.</p>`,
          code: `from scipy import stats
z = (650-500)/100
print(f"z = {z:.1f}")
print(f"percentile of 650 = {stats.norm.cdf(z)*100:.2f}%")`,
          output: `z = 1.5\npercentile of 650 = 93.32%` }
      ],
      conclusion: `A 650 sits at $z = 1.5$, the $93.32$rd percentile — better than about $93\\%$ of test-takers.`
    },
    {
      title: `Measurement noise`,
      domain: `Engineering`,
      question: `If measurement error is $\\mathcal{N}(0, 2^2)$, how often is the error within $\\pm 4$?`,
      steps: [
        { title: `The data`, body: `<p>Errors are Normal, centered at 0 with $\\sigma = 2$. The window $\\pm 4$ is exactly $\\pm 2\\sigma$.</p>` },
        { title: `The math`, body: `<p>$P(|error| &lt; 4) = P(|Z| &lt; 2) \\approx 0.9545$ by the empirical rule.</p>` },
        { title: `Run it`, body: `<p>Simulate a million errors and compare to theory.</p>`,
          code: `import numpy as np
from scipy import stats
rng = np.random.default_rng(0)
e = rng.normal(0, 2, 1_000_000)
print(f"sim P(|error| < 4) = {np.mean(np.abs(e) < 4):.4f}")
print(f"theory (2 sigma) = {stats.norm.cdf(2)-stats.norm.cdf(-2):.4f}")`,
          output: `sim P(|error| < 4) = 0.9544\ntheory (2 sigma) = 0.9545` }
      ],
      conclusion: `Errors fall within $\\pm 2\\sigma$ about $0.9545$ of the time (simulated $0.9544$) — the basis for "$\\pm 2\\sigma$" error bars.`
    }
  ],

  /* ============================ prob-joint-marginal =================== */
  "prob-joint-marginal": [
    {
      title: `Weather and mood table`,
      domain: `Everyday`,
      question: `Given a joint table of mood and weather, what are the marginals?`,
      steps: [
        { title: `The data`, body: `<p>Joint table (rows mood Happy/Sad, columns Sunny/Rainy): $0.4, 0.1$ on the Happy row; $0.2, 0.3$ on the Sad row. They sum to 1.</p>` },
        { title: `The math`, body: `<p>Marginals sum out the other variable: $P(\\text{Happy}) = 0.4 + 0.1 = 0.5$; $P(\\text{Sunny}) = 0.4 + 0.2 = 0.6$.</p>` },
        { title: `Run it`, body: `<p>Sum rows and columns of the joint matrix.</p>`,
          code: `import numpy as np
J = np.array([[0.4, 0.1],[0.2, 0.3]])
print(f"P(Happy) = {J[0].sum():.2f}")
print(f"P(Sad) = {J[1].sum():.2f}")
print(f"P(Sunny) = {J[:,0].sum():.2f}")
print(f"P(Rainy) = {J[:,1].sum():.2f}")`,
          output: `P(Happy) = 0.50\nP(Sad) = 0.50\nP(Sunny) = 0.60\nP(Rainy) = 0.40` }
      ],
      conclusion: `Summing rows gives mood marginals ($0.5, 0.5$); summing columns gives weather marginals ($0.6$ Sunny, $0.4$ Rainy).`
    },
    {
      title: `Device and purchase`,
      domain: `E-commerce`,
      question: `From device-and-purchase data, what are the marginals and the joint?`,
      steps: [
        { title: `The data`, body: `<p>$60\\%$ of sessions are mobile (buy rate $3\\%$); $40\\%$ desktop (buy rate $7\\%$). Two variables: device and purchase.</p>` },
        { title: `The math`, body: `<p>Marginal $P(\\text{mobile}) = 0.6$; marginal $P(\\text{buy}) = 0.6(0.03) + 0.4(0.07) = 0.046$; joint $P(\\text{mobile, buy}) = 0.6(0.03) = 0.018$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million sessions and read off marginals and the joint.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
n = 1_000_000
mobile = rng.random(n) < 0.6
buy = np.empty(n, dtype=bool)
buy[mobile] = rng.random(mobile.sum()) < 0.03
buy[~mobile] = rng.random((~mobile).sum()) < 0.07
print(f"marginal P(mobile) = {np.mean(mobile):.4f}")
print(f"marginal P(buy) = {np.mean(buy):.4f}")
print(f"joint P(mobile, buy) = {np.mean(mobile & buy):.4f}")`,
          output: `marginal P(mobile) = 0.5999\nmarginal P(buy) = 0.0459\njoint P(mobile, buy) = 0.0181` }
      ],
      conclusion: `The marginals are $P(\\text{mobile}) \\approx 0.6$ and $P(\\text{buy}) \\approx 0.046$, with joint $P(\\text{mobile, buy}) \\approx 0.018$.`
    },
    {
      title: `Sum of two dice`,
      domain: `Games`,
      question: `Rolling two dice, what is the marginal probability that the sum is 7?`,
      steps: [
        { title: `The data`, body: `<p>Two fair dice define a joint over $(a,b)$. The sum $a+b$ is a function of both.</p>` },
        { title: `The math`, body: `<p>Marginalizing the joint to the sum, $P(\\text{sum}=7) = \\frac{6}{36} \\approx 0.1667$.</p>` },
        { title: `Run it`, body: `<p>Simulate a million pairs and marginalize to the sum.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
a = rng.integers(1,7,1_000_000); b = rng.integers(1,7,1_000_000)
s = a+b
print(f"marginal P(sum=7) = {np.mean(s==7):.4f}")
print(f"theory = {6/36:.4f}")`,
          output: `marginal P(sum=7) = 0.1670\ntheory = 0.1667` }
      ],
      conclusion: `Collapsing the joint to the sum gives $P(\\text{sum}=7) = \\frac{6}{36} \\approx 0.1667$ (simulated $0.1670$).`
    }
  ],

  /* ============================ prob-covariance-correlation =========== */
  "prob-covariance-correlation": [
    {
      title: `Covariance from moments`,
      domain: `Statistics`,
      question: `Given the moments, what are the covariance and correlation?`,
      steps: [
        { title: `The data`, body: `<p>$E[X] = 2$, $E[Y] = 3$, $E[XY] = 8$, $\\sigma_X = 1$, $\\sigma_Y = 2$.</p>` },
        { title: `The math`, body: `<p>$\\operatorname{Cov}(X,Y) = E[XY] - E[X]E[Y] = 8 - 6 = 2$. Then $\\rho = \\frac{2}{1 \\times 2} = 1$, a perfect positive link.</p>` },
        { title: `Run it`, body: `<p>Compute covariance and correlation directly.</p>`,
          code: `EX, EY, EXY, sX, sY = 2, 3, 8, 1, 2
cov = EXY - EX*EY
rho = cov/(sX*sY)
print(f"Cov = {cov}, rho = {rho}")`,
          output: `Cov = 2, rho = 1.0` }
      ],
      conclusion: `Covariance is $E[XY] - E[X]E[Y] = 2$, and rescaling gives $\\rho = \\frac{2}{1 \\cdot 2} = 1$.`
    },
    {
      title: `Height vs weight`,
      domain: `Human biology`,
      question: `How strongly do simulated heights and weights move together?`,
      steps: [
        { title: `The data`, body: `<p>Heights $\\sim \\mathcal{N}(170, 10^2)$; weight $= 0.5(h - 170) + 70 + \\text{noise}$ with noise $\\mathcal{N}(0, 5^2)$.</p>` },
        { title: `The math`, body: `<p>Estimate $\\operatorname{Cov}(h, w)$ and $\\rho = \\frac{\\operatorname{Cov}}{\\sigma_h \\sigma_w}$ from the sample. A positive slope predicts positive correlation.</p>` },
        { title: `Run it`, body: `<p>Use numpy's cov and corrcoef.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
h = rng.normal(170, 10, 100000)
w = 0.5*(h-170) + 70 + rng.normal(0, 5, 100000)
print(f"Cov = {np.cov(h, w)[0,1]:.3f}")
print(f"rho = {np.corrcoef(h, w)[0,1]:.4f}")`,
          output: `Cov = 50.103\nrho = 0.7070` }
      ],
      conclusion: `Height and weight have $\\operatorname{Cov} \\approx 50.1$ and $\\rho \\approx 0.707$ — a strong positive but not perfect relationship.`
    },
    {
      title: `Two unrelated features`,
      domain: `Machine learning`,
      question: `What correlation do two independently generated features show?`,
      steps: [
        { title: `The data`, body: `<p>Two features $x, y$ drawn independently from $\\mathcal{N}(0, 1)$.</p>` },
        { title: `The math`, body: `<p>Independent variables have $\\operatorname{Cov} = 0$, so $\\rho = 0$ in the limit; a finite sample gives a near-zero estimate.</p>` },
        { title: `Run it`, body: `<p>Correlate two independent samples.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
x = rng.normal(0, 1, 100000)
y = rng.normal(0, 1, 100000)
print(f"rho(x,y) = {np.corrcoef(x, y)[0,1]:.4f}")`,
          output: `rho(x,y) = 0.0018` }
      ],
      conclusion: `Independent features show $\\rho \\approx 0.0018$, effectively zero — no linear relationship to exploit.`
    }
  ],

  /* ============================ prob-conditional-expectation ========== */
  "prob-conditional-expectation": [
    {
      title: `Two-machine weights`,
      domain: `Manufacturing`,
      question: `Two machines make items of different average weight — what is the overall mean?`,
      steps: [
        { title: `The data`, body: `<p>Machine A makes $60\\%$ of items (mean 10 g); Machine B makes $40\\%$ (mean 20 g).</p>` },
        { title: `The math`, body: `<p>Law of iterated expectations: $E[X] = \\sum_y P(y) E[X \\mid y] = 0.6(10) + 0.4(20) = 14$ g.</p>` },
        { title: `Run it`, body: `<p>Simulate a million items routed through the two machines.</p>`,
          code: `import numpy as np
EX = 0.6*10 + 0.4*20
print(f"E[X] = {EX:.1f} grams")
rng = np.random.default_rng(0)
n = 1_000_000
mA = rng.random(n) < 0.6
x = np.empty(n)
x[mA] = rng.normal(10, 1, mA.sum())
x[~mA] = rng.normal(20, 1, (~mA).sum())
print(f"sim E[X] = {x.mean():.3f}")`,
          output: `E[X] = 14.0 grams\nsim E[X] = 14.001` }
      ],
      conclusion: `Averaging the group means recovers $E[X] = 0.6(10) + 0.4(20) = 14$ g, simulated at $14.001$.`
    },
    {
      title: `Regression as $E[Y \\mid X]$`,
      domain: `Machine learning`,
      question: `How does conditional expectation describe spending by income bracket?`,
      steps: [
        { title: `The data`, body: `<p>Income $\\sim$ Uniform$(30, 120)$; spend $= 0.2 \\times \\text{income} + \\text{noise}$, noise $\\mathcal{N}(0, 5^2)$.</p>` },
        { title: `The math`, body: `<p>A regression predicts $E[\\text{spend} \\mid \\text{income}] = 0.2 \\times \\text{income}$. Grouping by bracket estimates this conditional mean.</p>` },
        { title: `Run it`, body: `<p>Group by income bracket and average the spend.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
income = rng.uniform(30, 120, 200000)
spend = 0.2*income + rng.normal(0, 5, 200000)
for lo, hi in [(30,60),(60,90),(90,120)]:
    m = (income>=lo)&(income<hi)
    print(f"E[spend | income in [{lo},{hi})] = {spend[m].mean():.2f}")`,
          output: `E[spend | income in [30,60)] = 8.98\nE[spend | income in [60,90)] = 15.00\nE[spend | income in [90,120)] = 20.99` }
      ],
      conclusion: `The bracket means ($8.98, 15.00, 20.99$) trace $E[\\text{spend} \\mid \\text{income}] \\approx 0.2 \\times \\text{income}$ — exactly what regression targets.`
    },
    {
      title: `Two classes, one average`,
      domain: `Education`,
      question: `Two equal classes average 80 and 90 — what is the overall average?`,
      steps: [
        { title: `The data`, body: `<p>Class A (half the students) averages 80; Class B (the other half) averages 90.</p>` },
        { title: `The math`, body: `<p>$E[X] = 0.5(80) + 0.5(90) = 85$.</p>` },
        { title: `Run it`, body: `<p>Weight and add the group averages.</p>`,
          code: `print(f"E[X] = {0.5*80 + 0.5*90:.1f}")`,
          output: `E[X] = 85.0` }
      ],
      conclusion: `Averaging the two group means gives the overall $E[X] = 0.5(80) + 0.5(90) = 85$.`
    }
  ],

  /* ============================ prob-inequalities ===================== */
  "prob-inequalities": [
    {
      title: `Bounding extreme scores`,
      domain: `Quality control`,
      question: `With only mean and variance, how tightly can we bound extreme values?`,
      steps: [
        { title: `The data`, body: `<p>A nonnegative quantity with mean $\\mu = 50$ and variance $\\sigma^2 = 100$ ($\\sigma = 10$).</p>` },
        { title: `The math`, body: `<p>Markov: $P(X \\ge 100) \\le \\frac{\\mu}{a} = 0.5$. Chebyshev: $P(|X - 50| \\ge 30) \\le \\frac{\\sigma^2}{\\epsilon^2} = \\frac{100}{900} \\approx 0.111$.</p>` },
        { title: `Run it`, body: `<p>Compare the bounds to an actual exponential distribution (mean 50).</p>`,
          code: `import numpy as np
print(f"Markov P(X>=100) <= {50/100:.3f}")
print(f"Chebyshev P(|X-50|>=30) <= {100/30**2:.4f}")
rng = np.random.default_rng(0)
x = rng.exponential(50, 2_000_000)
print(f"actual P(X>=100) = {np.mean(x >= 100):.4f}  (bound 0.5)")`,
          output: `Markov P(X>=100) <= 0.500\nChebyshev P(|X-50|>=30) <= 0.1111\nactual P(X>=100) = 0.1352  (bound 0.5)` }
      ],
      conclusion: `The bounds hold: Markov caps $P(X \\ge 100)$ at $0.5$ (actual $0.1352$), and Chebyshev caps the $\\pm 30$ tail at $\\approx 0.111$.`
    },
    {
      title: `Chebyshev for any shape`,
      domain: `ML theory`,
      question: `Does the Chebyshev $\\frac{1}{k^2}$ bound hold for a Normal distribution?`,
      steps: [
        { title: `The data`, body: `<p>$X \\sim \\mathcal{N}(50, 10^2)$, asking about deviations of $3\\sigma = 30$ from the mean.</p>` },
        { title: `The math`, body: `<p>Chebyshev guarantees $P(|X - \\mu| \\ge k\\sigma) \\le \\frac{1}{k^2} = \\frac{1}{9} \\approx 0.111$, with no shape assumption.</p>` },
        { title: `Run it`, body: `<p>Compare the loose bound to the Normal's actual tail.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
x = rng.normal(50, 10, 2_000_000)
print(f"Chebyshev P(|X-50|>=3*10) <= {1/9:.4f}")
print(f"actual (normal) P(|X-50|>=30) = {np.mean(np.abs(x-50) >= 30):.5f}")`,
          output: `Chebyshev P(|X-50|>=3*10) <= 0.1111\nactual (normal) P(|X-50|>=30) = 0.00269` }
      ],
      conclusion: `Chebyshev's distribution-free bound ($\\le 0.1111$) safely holds; the Normal's actual $3\\sigma$ tail ($0.00269$) is far smaller.`
    },
    {
      title: `Markov from a single mean`,
      domain: `Statistics`,
      question: `A nonnegative quantity averages 4 — how often can it reach 8 or more?`,
      steps: [
        { title: `The data`, body: `<p>A nonnegative variable with mean $E[X] = 4$. Threshold $a = 8$.</p>` },
        { title: `The math`, body: `<p>Markov: $P(X \\ge 8) \\le \\frac{E[X]}{a} = \\frac{4}{8} = 0.5$.</p>` },
        { title: `Run it`, body: `<p>Evaluate the Markov bound.</p>`,
          code: `print(f"Markov P(X>=8) <= {4/8:.3f}")`,
          output: `Markov P(X>=8) <= 0.500` }
      ],
      conclusion: `From the mean alone, Markov caps $P(X \\ge 8) \\le \\frac{4}{8} = 0.5$ — at most half the time.`
    }
  ],

  /* ============================ prob-lln ============================== */
  "prob-lln": [
    {
      title: `Running die average`,
      domain: `Games`,
      question: `As rolls accumulate, does the running average home in on 3.5?`,
      steps: [
        { title: `The data`, body: `<p>Roll a fair die (true mean $\\mu = 3.5$) and track $\\overline{X}$ at growing sample sizes.</p>` },
        { title: `The math`, body: `<p>The Law of Large Numbers says $\\overline{X} = \\frac{1}{n}\\sum X_i \\to \\mu$ as $n \\to \\infty$.</p>` },
        { title: `Run it`, body: `<p>Watch the running mean at $n = 10, 100, 1000, 100000$.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=100000)
for n in [10, 100, 1000, 100000]:
    print(f"n={n:6d}  running mean = {rolls[:n].mean():.4f}  (true 3.5)")`,
          output: `n=    10  running mean = 2.8000  (true 3.5)\nn=   100  running mean = 3.6200  (true 3.5)\nn=  1000  running mean = 3.6000  (true 3.5)\nn=100000  running mean = 3.4980  (true 3.5)` }
      ],
      conclusion: `The running mean tightens onto $\\mu = 3.5$ — from $2.80$ at $n=10$ to $3.498$ at $n=100000$, exactly as the LLN promises.`
    },
    {
      title: `Coin heads fraction`,
      domain: `Gambling`,
      question: `Does the fraction of heads converge to 0.5 with more flips?`,
      steps: [
        { title: `The data`, body: `<p>Flip a fair coin (true heads rate 0.5) and track the running fraction of heads.</p>` },
        { title: `The math`, body: `<p>The sample proportion is an average of 0/1 outcomes, so by the LLN it converges to $p = 0.5$.</p>` },
        { title: `Run it`, body: `<p>Track the heads fraction at $n = 100, 1000, 100000$.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
flips = rng.integers(0, 2, 100000)
for n in [100, 1000, 100000]:
    print(f"n={n:6d}  fraction heads = {flips[:n].mean():.4f}  (true 0.5)")`,
          output: `n=   100  fraction heads = 0.5600  (true 0.5)\nn=  1000  fraction heads = 0.5370  (true 0.5)\nn=100000  fraction heads = 0.4996  (true 0.5)` }
      ],
      conclusion: `The heads fraction settles from $0.56$ to $0.4996$ as $n$ grows — converging to the true rate $0.5$.`
    },
    {
      title: `Averaging noisy gradients`,
      domain: `Machine learning`,
      question: `Why does averaging many noisy gradient estimates point the right way?`,
      steps: [
        { title: `The data`, body: `<p>True gradient $2.0$; each mini-batch estimate adds noise $\\mathcal{N}(0, 5^2)$.</p>` },
        { title: `The math`, body: `<p>Each estimate is unbiased, so the average of $n$ of them converges to the true gradient $2.0$ by the LLN — the engine behind SGD.</p>` },
        { title: `Run it`, body: `<p>Average increasingly many noisy estimates.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
true_grad = 2.0
g = true_grad + rng.normal(0, 5, 100000)
for n in [10, 1000, 100000]:
    print(f"batch n={n:6d}  avg gradient = {g[:n].mean():.4f}  (true 2.0)")`,
          output: `batch n=    10  avg gradient = 2.4234  (true 2.0)\nbatch n=  1000  avg gradient = 1.7599  (true 2.0)\nbatch n=100000  avg gradient = 1.9955  (true 2.0)` }
      ],
      conclusion: `Averaging noisy gradients converges to the true value $2.0$ (from $2.42$ down to $1.9955$) — the LLN is why SGD works.`
    }
  ],

  /* ============================ prob-clt ============================== */
  "prob-clt": [
    {
      title: `Mean of 30 die rolls`,
      domain: `Games`,
      question: `One die roll is flat, so why do averages of 30 form a bell?`,
      steps: [
        { title: `The data`, body: `<p>Take the average of 30 fair die rolls; one roll is Uniform with $\\mu = 3.5$, $\\sigma^2 = \\frac{35}{12} \\approx 2.917$.</p>` },
        { title: `The math`, body: `<p>The CLT says $\\overline{X} \\approx \\mathcal{N}\\!\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$. Here the predicted variance is $\\frac{2.917}{30} \\approx 0.0972$.</p>` },
        { title: `Run it`, body: `<p>Generate 100,000 such sample-means and check center and spread.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
means = rng.integers(1, 7, size=(100000, 30)).mean(axis=1)
print(f"mean of sample-means = {means.mean():.4f}  (mu 3.5)")
print(f"var of sample-means  = {means.var():.4f}  (sigma^2/n = {(35/12)/30:.4f})")`,
          output: `mean of sample-means = 3.5016  (mu 3.5)\nvar of sample-means  = 0.0974  (sigma^2/n = 0.0972)` }
      ],
      conclusion: `The sample-means center at $3.5016 \\approx \\mu$ with variance $0.0974 \\approx \\frac{\\sigma^2}{n}$ — a bell, as the CLT predicts.`
    },
    {
      title: `Sum of 12 uniforms`,
      domain: `Simulation`,
      question: `Why is summing 12 uniform numbers a classic trick for generating a standard Normal?`,
      steps: [
        { title: `The data`, body: `<p>Sum 12 independent Uniform$(0,1)$ values. Each has mean $0.5$ and variance $\\frac{1}{12}$.</p>` },
        { title: `The math`, body: `<p>The sum has mean $12 \\times 0.5 = 6$ and variance $12 \\times \\frac{1}{12} = 1$, so $\\text{sum} - 6 \\approx \\mathcal{N}(0,1)$ by the CLT.</p>` },
        { title: `Run it`, body: `<p>Confirm the mean and standard deviation of the sum.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
s = rng.uniform(0, 1, size=(100000, 12)).sum(axis=1)
print(f"mean = {s.mean():.4f}  (12*0.5 = 6)")
print(f"std  = {s.std():.4f}  (sqrt(12/12)=1)")`,
          output: `mean = 6.0020  (12*0.5 = 6)\nstd  = 0.9993  (sqrt(12/12)=1)` }
      ],
      conclusion: `The sum of 12 uniforms has mean $\\approx 6$ and std $\\approx 1$, so subtracting 6 yields an approximate standard Normal — the CLT in action.`
    },
    {
      title: `Variance of an average shrinks`,
      domain: `Statistics`,
      question: `For samples with $\\sigma^2 = 16$, what is the variance of an average of 4?`,
      steps: [
        { title: `The data`, body: `<p>Samples from $\\mathcal{N}(10, 4^2)$, so $\\sigma^2 = 16$. Average $n = 4$ of them.</p>` },
        { title: `The math`, body: `<p>$\\operatorname{Var}(\\overline{X}) = \\frac{\\sigma^2}{n} = \\frac{16}{4} = 4$, so $\\sigma_{\\overline{X}} = 2$ — half the single-sample $\\sigma$.</p>` },
        { title: `Run it`, body: `<p>Simulate 200,000 averages of 4 and measure their variance.</p>`,
          code: `import numpy as np
print(f"Var(Xbar) = sigma^2/n = {16/4}")
rng = np.random.default_rng(0)
means = rng.normal(10, 4, size=(200000, 4)).mean(axis=1)
print(f"sim Var(Xbar) = {means.var():.4f}")`,
          output: `Var(Xbar) = sigma^2/n = 4.0\nsim Var(Xbar) = 4.0043` }
      ],
      conclusion: `The average's variance is $\\frac{\\sigma^2}{n} = \\frac{16}{4} = 4$ (simulated $4.0043$) — more samples make a tighter bell.`
    }
  ],

  /* ============================ prob-estimation ======================= */
  "prob-estimation": [
    {
      title: `Mean and variance of a tiny sample`,
      domain: `Statistics`,
      question: `For the data $\\{2,4,6\\}$, what are the sample mean and variance?`,
      steps: [
        { title: `The data`, body: `<p>Three observations: $\\{2, 4, 6\\}$.</p>` },
        { title: `The math`, body: `<p>$\\overline{X} = \\frac{2+4+6}{3} = 4$. Squared distances sum to 8; dividing by $n-1 = 2$ gives $s^2 = 4$ (dividing by $n=3$ would understate it at $2.67$).</p>` },
        { title: `Run it`, body: `<p>Compute both the $n-1$ and $n$ versions.</p>`,
          code: `import numpy as np
data = np.array([2.0, 4.0, 6.0])
print(f"sample mean = {data.mean():.4f}")
print(f"sample var (n-1) = {data.var(ddof=1):.4f}")
print(f"biased var (n) = {data.var(ddof=0):.4f}")`,
          output: `sample mean = 4.0000\nsample var (n-1) = 4.0000\nbiased var (n) = 2.6667` }
      ],
      conclusion: `The sample mean is 4 and the unbiased variance is $s^2 = \\frac{8}{n-1} = 4$; dividing by $n$ understates it at $2.67$.`
    },
    {
      title: `Why divide by n-1`,
      domain: `Machine learning`,
      question: `Does the $n-1$ divisor actually make the variance estimate unbiased?`,
      steps: [
        { title: `The data`, body: `<p>Draw size-5 samples from $\\mathcal{N}(0, 2^2)$, so the true variance is $4$. Repeat 50,000 times.</p>` },
        { title: `The math`, body: `<p>An unbiased estimator satisfies $E[\\hat\\theta] = \\theta$. Averaging $s^2$ over many samples should land on $4$ with the $n-1$ divisor, but fall short with $n$.</p>` },
        { title: `Run it`, body: `<p>Average both estimators across many samples.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
true_var = 4.0
s2_n1, s2_n = [], []
for _ in range(50000):
    x = rng.normal(0, 2, 5)
    s2_n1.append(x.var(ddof=1))
    s2_n.append(x.var(ddof=0))
print(f"true variance = {true_var}")
print(f"avg s^2 (n-1) = {np.mean(s2_n1):.4f}  (unbiased)")
print(f"avg s^2 (n)   = {np.mean(s2_n):.4f}  (biased low)")`,
          output: `true variance = 4.0\navg s^2 (n-1) = 4.0121  (unbiased)\navg s^2 (n)   = 3.2097  (biased low)` }
      ],
      conclusion: `Averaging over samples, the $n-1$ estimator hits $4.0121 \\approx 4$ while the $n$ estimator stays low at $3.21$ — confirming the $n-1$ correction removes bias.`
    },
    {
      title: `Two-point estimate`,
      domain: `Lab measurement`,
      question: `For the data $\\{1,3\\}$, what are the sample mean and variance?`,
      steps: [
        { title: `The data`, body: `<p>Two observations: $\\{1, 3\\}$.</p>` },
        { title: `The math`, body: `<p>$\\overline{X} = \\frac{1+3}{2} = 2$. Squared distances $(1-2)^2 + (3-2)^2 = 2$; divide by $n-1 = 1$ to get $s^2 = 2$.</p>` },
        { title: `Run it`, body: `<p>Compute the two-point estimate.</p>`,
          code: `import numpy as np
data = np.array([1.0, 3.0])
print(f"mean = {data.mean():.1f}")
print(f"s^2 (n-1) = {data.var(ddof=1):.1f}")`,
          output: `mean = 2.0\ns^2 (n-1) = 2.0` }
      ],
      conclusion: `The sample mean is 2 and the unbiased sample variance is $s^2 = \\frac{2}{n-1} = 2$.`
    }
  ]

});
