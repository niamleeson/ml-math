/* Per-lesson CODE VISUALIZATIONS — 01-probability.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["prob-sample-space"] = {
  question: "What is a sample space, what is an event inside it, and how do outcomes turn into probabilities?",
  charts: [
    {
      type: "bars",
      title: "Omega = {1,...,6} and event A is a subset: A = even = {2,4,6}",
      labels: ["1", "2", "3", "4", "5", "6"],
      values: [1, 1, 1, 1, 1, 1],
      valueLabels: ["", "in A", "", "in A", "", "in A"],
      colors: ["#9aa7b4", "#7ee787", "#9aa7b4", "#7ee787", "#9aa7b4", "#7ee787"],
      xlabel: "outcome (one die face)",
      ylabel: "in sample space",
      interpret: "Each bar is one possible outcome, so the six bars together are the whole sample space Omega (every way one die can land). The green bars are the ones inside the event A = even = {2,4,6}; the grey bars are outcomes not in A. Read it as: an <b>event is just a chosen subset</b> of the outcomes, here the three even faces picked out of six."
    },
    {
      type: "bars",
      title: "Equally likely: P(event) = (size of event) / (size of Omega), with |Omega| = 6",
      labels: ["P(Omega)=6/6", "P(even)=3/6", "P(>4)=2/6", "P({2})=1/6"],
      values: [1.0, 0.5, 0.3333, 0.1667],
      valueLabels: ["1.000", "0.500", "0.333", "0.167"],
      colors: ["#c89bff", "#7ee787", "#4ea1ff", "#ffb454"],
      xlabel: "event A (subset of Omega)",
      ylabel: "probability",
      interpret: "Bar height is the probability of each event, found by counting: divide how many outcomes are in the event by the six outcomes in Omega. The whole space is 6/6 = 1 (purple, certain); a smaller event has a shorter bar all the way down to a single outcome at 1/6 (orange). Read it as: <b>more outcomes in the event means a taller bar means more probable</b>, and a bar can never go above 1."
    },
    {
      type: "bars",
      title: "Bigger sample space: two dice, P(sum=s) = (6 - |s-7|) / 36, peak at 7",
      labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      values: [0.0278, 0.0556, 0.0833, 0.1111, 0.1389, 0.1667, 0.1389, 0.1111, 0.0833, 0.0556, 0.0278],
      valueLabels: ["1/36", "2/36", "3/36", "4/36", "5/36", "6/36", "5/36", "4/36", "3/36", "2/36", "1/36"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      xlabel: "sum of two dice (an outcome)",
      ylabel: "probability",
      interpret: "Now an outcome is the total of two dice, and the bar height is how probable each total is. The shape is a triangle peaking at 7 (green) because there are more ways to make 7 (six pairs) than to make 2 or 12 (one pair each). Read it as: <b>even when outcomes are not equally likely, every bar still sums to exactly 1</b> across the whole space."
    },
    {
      type: "bars",
      title: "Variant - loaded die (illustrative): outcomes unequal but probabilities still sum to 1",
      labels: ["1", "2", "3", "4", "5", "6", "sum"],
      values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 1.0],
      valueLabels: ["0.10", "0.10", "0.10", "0.10", "0.10", "0.50", "1.000"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#ff7b72", "#7ee787"],
      xlabel: "die face (outcome)",
      ylabel: "probability",
      interpret: "Illustrative, not a fair die. Same six-outcome sample space, but the equally-likely shortcut P=|A|/|Omega| no longer applies: face 6 is weighted to 0.5 (red) while the rest share the remaining mass. Read it as: <b>the sample space stays the same; only the per-outcome weights change</b>. The green total bar confirms they still add to 1, which is the one rule that never bends."
    },
    {
      type: "bars",
      title: "Variant - overlapping events A and B (illustrative): why you cannot just add",
      labels: ["P(A)=even", "P(B)=>3", "P(A)+P(B)", "P(A or B) actual"],
      values: [0.5, 0.5, 1.0, 0.6667],
      valueLabels: ["3/6", "3/6", "1.000 (wrong)", "4/6 = 0.667"],
      colors: ["#4ea1ff", "#ffb454", "#ff7b72", "#7ee787"],
      xlabel: "event",
      ylabel: "probability",
      interpret: "Illustrative pitfall. A = even = {2,4,6} and B = greater-than-3 = {4,5,6} share the faces 4 and 6, so naively adding the two bars gives 1.0 (red) which double-counts the overlap. The true P(A or B) counts the union {2,4,5,6} = 4/6 (green). Read it as: <b>events can overlap inside the sample space</b>, so adding probabilities only works when the subsets are disjoint."
    }
  ],
  caption: "Charts 1-3 build the idea: the sample space Omega is the full set of outcomes, an event is a subset of it (green), and probability comes from how much of the space the event covers - exactly |A|/|Omega| when outcomes are equally likely, generalising to any weights that sum to 1. The two variant charts show what you will also meet in practice: a loaded die where outcomes are unequal (only the all-bars-sum-to-1 rule survives), and overlapping events where you cannot simply add probabilities without double-counting the shared outcomes.",
  code: `import numpy as np

# Chart 1: one die. Sample space Omega and the event A = even = {2,4,6}
omega = [1, 2, 3, 4, 5, 6]
A = {2, 4, 6}                       # an event is a SUBSET of Omega
in_A = [f in A for f in omega]      # which faces are in the event

# Chart 2: equally-likely probability  P(event) = |event| / |Omega|
n = len(omega)                      # |Omega| = 6
p_omega = n / n                     # 1.000
p_even  = len(A) / n                # 3/6 = 0.500
p_gt4   = len({5, 6}) / n           # 2/6 = 0.333
p_two   = len({2}) / n              # 1/6 = 0.167

# Chart 3: two dice. P(sum = s) = (6 - |s - 7|) / 36 over s = 2..12
sums = list(range(2, 13))
pmf = [(6 - abs(s - 7)) / 36 for s in sums]
assert abs(sum(pmf) - 1.0) < 1e-9   # probabilities sum to 1
print(round(p_even, 3), round(p_two, 3), [round(p, 4) for p in pmf])`
};

window.CODEVIZ["prob-axioms"] = {
  question: "What do the three probability axioms (and the complement and additivity rules) actually look like with real numbers?",
  charts: [
    {
      type: "bars",
      title: "Axiom 1 nonnegativity and Axiom 2 normalization: a valid distribution",
      labels: ["P(face 1)", "P(face 2)", "P(face 3)", "P(face 4)", "P(face 5)", "P(face 6)", "P(Omega) sum"],
      values: [0.1667, 0.1667, 0.1667, 0.1667, 0.1667, 0.1667, 1.0],
      valueLabels: ["0.167", "0.167", "0.167", "0.167", "0.167", "0.167", "1.000"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"],
      interpret: "Each blue bar is one face's probability; the green bar is their total. Axiom 1 (nonnegativity) shows as <b>no bar dipping below zero</b>, and Axiom 2 (normalization) shows as the green sum landing on exactly 1.000. Read it as: a distribution is valid only when every bar is at or above 0 and they add up to 1."
    },
    {
      type: "bars",
      title: "Axiom 3 additivity: P(A or B) = P(A) + P(B) when disjoint, term by term",
      labels: ["P(A)={1,2}", "P(B)={5,6}", "P(A)+P(B)", "P(A or B) direct"],
      values: [0.3333, 0.3333, 0.6667, 0.6667],
      valueLabels: ["2/6=0.333", "2/6=0.333", "0.667", "4/6=0.667"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#c89bff"],
      interpret: "The first two bars are the separate event probabilities; the orange bar adds them and the purple bar counts P(A or B) straight from the union. Because A={1,2} and B={5,6} share no faces (disjoint), <b>the orange and purple bars match exactly</b>. Read it as: for non-overlapping events you may simply add their probabilities."
    },
    {
      type: "bars",
      title: "Complement rule: P(A) + P(not A) = 1, with A={1,2}",
      labels: ["P(A)={1,2}", "P(not A)={3,4,5,6}", "P(A)+P(not A)"],
      values: [0.3333, 0.6667, 1.0],
      valueLabels: ["2/6=0.333", "4/6=0.667", "1.000"],
      colors: ["#4ea1ff", "#ff7b72", "#7ee787"],
      interpret: "The blue bar is the event A and the red bar is everything else (its complement, the faces not in A). Stacked, they account for the whole space, so <b>the two always total 1.000</b> (green). Read it as: the chance of A and the chance of not-A are mirror images, which is why P(not A) = 1 - P(A) is a handy shortcut."
    },
    {
      type: "bars",
      title: "Variant - INVALID distributions (illustrative): each breaks one axiom",
      labels: ["neg P (breaks ax.1)", "sum=1.2 (breaks ax.2)", "sum=0.7 (breaks ax.2)", "valid (sum=1)"],
      values: [-0.2, 1.2, 0.7, 1.0],
      valueLabels: ["-0.20", "1.20", "0.70", "1.000"],
      colors: ["#ff7b72", "#ffb454", "#ffb454", "#7ee787"],
      interpret: "Illustrative bad distributions. The red bar drops below zero, breaking Axiom 1 (a probability can never be negative). The two orange bars are total masses that miss 1 - one overshoots (1.2) and one falls short (0.7), each breaking Axiom 2. Only the green bar (sum = 1) is legal. Read it as: <b>a bar below the axis or a total that is not 1 means the numbers are not a valid probability distribution</b>."
    },
    {
      type: "bars",
      title: "Variant - overlapping events (illustrative): plain addition over-counts",
      labels: ["P(A)=even", "P(B)=>3", "P(A)+P(B)", "P(A or B) actual"],
      values: [0.5, 0.5, 1.0, 0.6667],
      valueLabels: ["3/6", "3/6", "1.00 (wrong)", "4/6=0.667"],
      colors: ["#4ea1ff", "#7ee787", "#ff7b72", "#c89bff"],
      interpret: "Illustrative. A=even={2,4,6} and B=greater-than-3={4,5,6} share faces 4 and 6, so they are NOT disjoint. Adding the bars gives 1.0 (red), but the true union {2,4,5,6} is only 4/6 (purple). Read it as: <b>Axiom 3's plain addition applies only to disjoint events</b>; when events overlap you must subtract the shared part, P(A or B) = P(A) + P(B) - P(A and B)."
    }
  ],
  caption: "Charts 1-3 are the fair-die example showing each rule holding: nonnegativity (no bar below 0) plus normalization (faces sum to 1), additivity for disjoint events (added bars equal the direct union), and the complement rule (A and not-A total 1). The two variant charts show the failure side a practitioner must spot: distributions that violate an axiom (a negative bar, or a total that is not 1), and overlapping events where naive addition over-counts the shared outcomes.",
  code: `import numpy as np

# Fair six-sided die: each face has probability 1/6
faces = np.arange(1, 7)
p_face = np.full(6, 1/6)

# Axiom 1 (nonnegativity): every p >= 0 ; Axiom 2 (normalization): they sum to 1
chart1_values = list(np.round(p_face, 4)) + [round(float(p_face.sum()), 4)]
print("chart1:", chart1_values)            # [0.1667 x6, 1.0]

# Axiom 3 (additivity) for disjoint events A={1,2}, B={5,6}
A = {1, 2}; B = {5, 6}
pA = sum(1/6 for f in faces if f in A)      # 2/6
pB = sum(1/6 for f in faces if f in B)      # 2/6
pA_plus_pB = pA + pB                         # 0.667
pA_or_B = sum(1/6 for f in faces if (f in A) or (f in B))  # direct count, 4/6
print("chart2:", [round(pA,4), round(pB,4), round(pA_plus_pB,4), round(pA_or_B,4)])

# Complement rule: P(not A) = 1 - P(A)
p_notA = 1 - pA                              # 4/6
print("chart3:", [round(pA,4), round(p_notA,4), round(pA + p_notA, 4)])`
};

window.CODEVIZ["prob-conditional"] = {
  question: "Given the die came up even, how likely is it a 2? Conditioning shrinks the world to B.",
  charts: [
    {
      type: "bars",
      title: "P(A|B) = P(A and B) / P(B), term by term (die: A=rolled a 2, B=even)",
      labels: ["P(A and B)", "P(B)", "P(A|B) = ratio", "P(A) unconditional"],
      values: [0.16667, 0.5, 0.33333, 0.16667],
      valueLabels: ["1/6 = 0.167", "3/6 = 0.500", "0.167/0.500 = 0.333", "1/6 = 0.167"],
      colors: ["#c89bff", "#7ee787", "#4ea1ff", "#9aa7b4"],
      interpret: "Read this as a fraction made of two bars. The purple bar is the overlap P(A and B): the chance of landing in BOTH the event A (a 2) and the given world B (even). The green bar P(B) is the size of the world you now live in. Dividing purple by green gives the blue bar P(A|B)=0.333. Compare it to the grey unconditional P(A)=0.167: knowing 'even' DOUBLED the chance of a 2, because half the faces were ruled out."
    },
    {
      type: "heatmap",
      title: "World shrinks to B: each die face's probability, full Omega vs given B={2,4,6}",
      rows: ["full Omega (any face)", "given B = even"],
      cols: ["1", "2", "3", "4", "5", "6"],
      matrix: [
        [0.16667, 0.16667, 0.16667, 0.16667, 0.16667, 0.16667],
        [0, 0.33333, 0, 0.33333, 0, 0.33333]
      ],
      showVals: true,
      interpret: "Each cell is the probability of that die face. The top row is the original world: all six faces equally likely at 1/6. The bottom row is AFTER conditioning on 'even': the odd faces (1,3,5) drop to 0 because they are now impossible, and the survivors (2,4,6) each rise from 1/6 to 1/3 so the row still sums to 1. The cell for face 2 reads 0.333 - exactly P(A|B). Conditioning = delete the rows that can't happen, then re-share the probability among what's left."
    },
    {
      type: "heatmap",
      title: "Independence case: conditioning on B leaves P(A) UNCHANGED (A=red card, B=face card)",
      rows: ["full deck", "given B = face card"],
      cols: ["red", "black"],
      matrix: [
        [0.5, 0.5],
        [0.5, 0.5]
      ],
      showVals: true,
      interpret: "Illustrative shapes. Here A = 'card is red' and B = 'card is a face card' in a standard deck. The top row shows red and black are each 0.5 overall. The bottom row conditions on 'face card' - yet the split is STILL 0.5 / 0.5. When the row doesn't change after conditioning, A and B are INDEPENDENT: P(A|B) = P(A). Knowing B told you nothing new about A. This is the flat, no-news case - contrast it with the die chart where the numbers moved."
    },
    {
      type: "heatmap",
      title: "Strong dependence: conditioning on B nearly guarantees A (B subset of A)",
      rows: ["full population", "given B = has a fever"],
      cols: ["sick", "healthy"],
      matrix: [
        [0.1, 0.9],
        [0.95, 0.05]
      ],
      showVals: true,
      interpret: "Illustrative shapes. A = 'person is sick', B = 'person has a fever'. Overall (top row) only 0.1 are sick. But CONDITIONED on having a fever (bottom row), the sick share jumps to 0.95. A big swing toward one cell means B is strong evidence for A: P(A|B) is far above P(A). The more lopsided the bottom row, the more informative B is. When B almost forces A like this, the bottom row collapses onto a single column."
    }
  ],
  caption: "Chart 1 reads the conditional formula as a fraction: overlap P(A and B) over the given world P(B). Chart 2 shows conditioning as deleting impossible rows and re-sharing probability. Charts 3 and 4 are the two extremes you'll meet: independence (the row doesn't move, P(A|B)=P(A)) and strong dependence (the row collapses, P(A|B) far from P(A)).",
  code: `import numpy as np
# Fair die. A = "rolled a 2", B = "rolled an even number" = {2,4,6}
faces = np.arange(1, 7)
p_full = np.full(6, 1/6)                 # unconditional, each face 1/6

B = np.isin(faces, [2, 4, 6])            # the given event
P_B = p_full[B].sum()                    # 3/6 = 0.5
P_A_and_B = p_full[(faces == 2) & B].sum()  # face 2 is even -> 1/6
P_A_given_B = P_A_and_B / P_B            # (1/6)/(1/2) = 1/3
P_A = p_full[faces == 2].sum()           # unconditional P(A) = 1/6

# Chart 1: the formula term by term
bars = [P_A_and_B, P_B, P_A_given_B, P_A]
# -> [0.16667, 0.5, 0.33333, 0.16667]

# Chart 2: renormalize the world to B
p_given_B = np.where(B, p_full / P_B, 0.0)  # only 2,4,6 survive, each 1/3
# row0 = p_full (each 1/6), row1 = p_given_B (2,4,6 -> 1/3, rest 0)
print(P_A_given_B, p_given_B[1])         # 0.3333..., 0.3333...
`
};

window.CODEVIZ["prob-bayes"] = {
  question: "A 99%-accurate test comes back positive for a 1-in-1000 disease. Are you sick?",
  charts: [
    {
      type: "bars",
      title: "Bayes: P(sick|+) = [ P(+|sick) P(sick) ] / P(+), term by term",
      labels: [
        "P(+|sick) P(sick)  (numerator)",
        "P(+|healthy) P(healthy)",
        "P(+)  (denominator = sum)"
      ],
      values: [0.00099, 0.00999, 0.01098],
      valueLabels: ["0.00099", "0.00999", "0.01098"],
      colors: ["#7ee787", "#ffb454", "#c89bff"],
      interpret: "The denominator P(+) is the TOTAL chance of a positive test, and it splits into two ways a positive can happen. The green bar is the good positives (truly sick AND testing positive). The orange bar is the false alarms (healthy but testing positive). The purple bar is their sum = P(+). Notice the orange false-alarm bar is about 10x taller than the green true-positive bar: even a rare disease produces far more false alarms than real cases, because there are so many healthy people to test."
    },
    {
      type: "bars",
      title: "Prior P(sick)=0.001 updates to posterior P(sick|+)=0.090 after a positive",
      labels: ["prior P(sick)", "posterior P(sick|+)"],
      values: [0.001, 0.0902],
      valueLabels: ["0.001  (0.1%)", "0.090  (9.0%)"],
      colors: ["#9aa7b4", "#4ea1ff"],
      interpret: "Bayes' rule is a BELIEF UPDATE. The grey bar is what you believed before the test: 0.1% chance sick (the prior). The blue bar is after seeing a positive: 9.0% (the posterior). The positive test multiplied your belief by ~90x - a big jump - yet you are still much more likely healthy than sick. A strong test on a rare condition moves you a lot but rarely all the way to certain."
    },
    {
      type: "heatmap",
      title: "True state x test result, per 100,000 people (P+ heavy with false alarms)",
      rows: ["sick", "healthy"],
      cols: ["test +", "test -"],
      matrix: [
        [99, 1],
        [999, 98901]
      ],
      showVals: true,
      interpret: "This is the same math as raw head-counts, which is easier to trust. Of 100,000 people, only 100 are sick; the test catches 99 of them (top-left). But among the 99,900 healthy people, 1% still test positive = 999 false alarms (bottom-left). So the 'test +' column holds 99 real + 999 false = 1,098 positives, and only 99/1098 = 9.0% are truly sick. Read DOWN the 'test +' column to see why a positive isn't alarming: it's dominated by false alarms."
    },
    {
      type: "heatmap",
      title: "Common disease (prior 30%): a positive now means likely sick",
      rows: ["sick", "healthy"],
      cols: ["test +", "test -"],
      matrix: [
        [29700, 300],
        [700, 69300]
      ],
      showVals: true,
      interpret: "Illustrative: SAME 99%-accurate test, but now 30% of people are sick (a common condition). Of 100,000 people, 30,000 are sick and 29,700 test positive; only 700 of the 70,000 healthy give false alarms. The 'test +' column is now 29,700 real vs 700 false, so P(sick|+) = 29700/30400 = 98%. The lesson: the SAME test gives a wildly different answer depending on the prior (base rate). When the disease is common, a positive is convincing; when rare, it isn't."
    },
    {
      type: "heatmap",
      title: "Weak test (50% false-positive rate): a positive barely updates anything",
      rows: ["sick", "healthy"],
      cols: ["test +", "test -"],
      matrix: [
        [99, 1],
        [49950, 49950]
      ],
      showVals: true,
      interpret: "Illustrative: rare disease again (100 sick per 100,000), but the test is nearly useless - healthy people test positive HALF the time. Now the 'test +' column holds 99 real positives drowning in 49,950 false ones, so P(sick|+) = 99/50049 = 0.2%, barely above the 0.1% prior. When a test fires almost as often for healthy people as sick ones, a positive carries almost no information and the posterior hardly moves off the prior. Compare to chart 3 where the test was sharp."
    }
  ],
  caption: "Charts 1-3 are the textbook case: a 99% test on a 1-in-1000 disease yields only a 9% posterior, because false alarms swamp the rare true positives. Charts 4 and 5 vary the two levers: raising the base rate (a common disease) makes a positive convincing, while a high false-positive rate makes a positive nearly worthless. Same Bayes formula, very different conclusions.",
  code: `import numpy as np

# Bayes inputs from the lesson example
p_sick    = 0.001          # prior P(sick)
p_healthy = 1 - p_sick     # 0.999
sens      = 0.99           # P(+ | sick)
fpr       = 0.01           # P(+ | healthy)

# --- term-by-term numerator / denominator (chart 1) ---
num    = sens * p_sick                 # 0.00099
fa     = fpr  * p_healthy              # 0.00999  (false-alarm mass)
p_pos  = num + fa                      # 0.01098  = P(+), law of total prob

# --- prior -> posterior (chart 2) ---
posterior = num / p_pos               # ~0.0902
print(p_sick, posterior)              # 0.001 -> 0.0902

# --- confusion of true-state x test-result, per 100k people (chart 3) ---
N  = 100000
sick    = N * p_sick                  # 100
healthy = N * p_healthy               # 99900
tp = sick    * sens                   # 99
fn = sick    - tp                     # 1
fp = healthy * fpr                    # 999
tn = healthy - fp                     # 98901
matrix = np.array([[tp, fn],
                   [fp, tn]])
print(matrix)
print(tp / (tp + fp))                 # 0.0902 = P(sick | +)
`
};

window.CODEVIZ["prob-total-prob"] = {
  question: "How does splitting into cases add up to the chance of B? Read the bars as weighted contributions that stack to the total.",
  charts: [
    {
      type: "bars",
      title: "P(D) = sum of P(A_i)P(D|A_i), term by term (two-factory bulb example)",
      labels: [
        "case 1: P(A1)P(D|A1) = 0.6 x 0.02",
        "case 2: P(A2)P(D|A2) = 0.4 x 0.05",
        "total P(D)"
      ],
      values: [0.012, 0.020, 0.032],
      valueLabels: ["0.012", "0.020", "0.032"],
      colors: ["#4ea1ff", "#7ee787", "#c89bff"],
      xlabel: "case contribution vs total",
      ylabel: "probability",
      interpret: "Each colored bar is one case's <b>weight</b> P(A_i) times B's chance <b>inside</b> that case, P(D|A_i). Read left to right: the blue (0.012) and green (0.020) contributions stack to the purple total P(D) = 0.032. The total bar always equals the sum of the case bars exactly, because the two factories partition every bulb with no overlap and no gaps."
    },
    {
      type: "bars",
      title: "More cases, same rule: three suppliers partition the bulbs, contributions still add up",
      labels: [
        "P(A1)P(D|A1) = 0.5 x 0.01",
        "P(A2)P(D|A2) = 0.3 x 0.04",
        "P(A3)P(D|A3) = 0.2 x 0.10",
        "total P(D)"
      ],
      values: [0.005, 0.012, 0.020, 0.037],
      valueLabels: ["0.005", "0.012", "0.020", "0.037"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#c89bff"],
      xlabel: "case contribution vs total",
      ylabel: "probability",
      interpret: "The rule scales to any number of cases: with three suppliers (weights 0.5, 0.3, 0.2 that sum to 1) you simply add one bar per case. Notice supplier 3 is small (20% of output) yet contributes the most defects (0.020) because its rate is high (10%) - a <b>small slice with a high inner rate can dominate the total</b>. The purple total still equals the sum of all case bars."
    },
    {
      type: "heatmap",
      title: "Why the sum works: 1000 bulbs split by factory x defect (illustrative counts)",
      rows: ["factory A1 (600)", "factory A2 (400)"],
      cols: ["defective", "good"],
      matrix: [
        [12, 588],
        [20, 380]
      ],
      showVals: true,
      interpret: "Same example as a head-count over 1000 bulbs. Each row is one factory (a case); the rows never overlap and together cover all 1000 bulbs - that is what 'partition' means. The defective column holds 12 + 20 = 32 bulbs, i.e. P(D) = 32/1000 = 0.032, matching the bar total. <b>Summing case contributions is just counting the defective cells row by row.</b>"
    },
    {
      type: "bars",
      title: "Misuse: cases overlap (not a partition) so the naive sum overcounts",
      labels: [
        "case 1 contribution",
        "case 2 contribution (overlaps case 1)",
        "naive sum (too big)",
        "true P(D)"
      ],
      values: [0.024, 0.020, 0.044, 0.034],
      valueLabels: ["0.024", "0.020", "0.044 X", "0.034"],
      colors: ["#9aa7b4", "#9aa7b4", "#ff7b72", "#7ee787"],
      xlabel: "contribution vs sum vs truth",
      ylabel: "probability",
      interpret: "Illustrative failure mode. If your cases <b>overlap</b> (some bulbs counted in both), the naive sum (red, 0.044) overshoots the true P(D) (green, 0.034) because the shared bulbs are double-counted. Recognise it when your case contributions sum past the directly measured total - the fix is to choose cases that truly partition the space (mutually exclusive, covering everything), so the law of total probability applies."
    }
  ],
  caption: "Chart 1 is the canonical two-case sum. Chart 2 shows it scales to more cases and that a small-but-risky case can dominate. The heatmap shows the partition as a head-count. The last chart is the classic mistake: overlapping cases double-count and the sum overshoots.",
  code: `# Law of total probability: P(B) = sum_i P(A_i) * P(B|A_i)
# Two factories partition all bulbs (weights sum to 1).
import numpy as np

P_A   = np.array([0.60, 0.40])   # P(A1), P(A2): factory output shares
P_B_A = np.array([0.02, 0.05])   # P(D|A1), P(D|A2): per-factory defect rates

contrib = P_A * P_B_A            # term-by-term contributions
P_B = contrib.sum()              # total probability of a defect

assert abs(P_A.sum() - 1.0) < 1e-9   # weights must partition the space
print(contrib)                   # [0.012 0.020]
print(P_B)                       # 0.032  -> 3.2% defect rate`
};

window.CODEVIZ["prob-independence"] = {
  question: "When are two events independent? See it two ways: the product rule P(A and B) = P(A)P(B), and a point cloud that is round when independent but tilted when dependent.",
  charts: [
    {
      type: "bars",
      title: "Independence test: P(A and B) vs P(A)P(B), independent vs dependent",
      labels: [
        "indep: P(A)P(B)",
        "indep: P(A and B)",
        "dependent: P(A)P(D)",
        "dependent: P(A and D)"
      ],
      values: [0.25, 0.25, 0.375, 0.5],
      valueLabels: ["0.250", "0.250", "0.375", "0.500"],
      colors: ["#9aa7b4", "#7ee787", "#9aa7b4", "#ff7b72"],
      xlabel: "predicted product (grey) vs actual joint",
      ylabel: "probability",
      interpret: "Each grey bar is the <b>predicted</b> product P(A)P(B); the colored bar beside it is the <b>actual</b> joint P(A and B). When the pair is independent (left two) the bars are equal height, so the prediction holds. When dependent (right two) the actual (red, 0.5) overshoots the product (grey, 0.375), so they disagree. <b>Equal heights = independent; any gap = dependent.</b>"
    },
    {
      type: "scatter",
      title: "Independent cloud is round (corr about 0); dependent cloud is tilted (corr about 0.91)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "independent (round)",
          color: "#7ee787",
          points: [[0.4,-1.71],[-0.72,0.79],[0.66,1.43],[1.28,-0.1],[1.73,1.29],[0.07,0.79],[1.08,0.41],[0.27,1.71],[0.1,0.1],[0.42,1.57],[0.78,0.47],[-0.96,1.4],[0.21,1.64],[-3.07,0.68],[1.08,-1.45],[-0.44,-1.11],[-0.04,-0.29],[-1.86,0.81],[0.5,0.67],[-2.55,-1.03],[0.08,-0.59],[1.62,0.15],[0.81,1.15],[-2.76,-0.08],[-1.95,-1.42],[0.04,-1.18],[1.2,0.58],[0.46,1.37],[-0.69,1.41],[-0.21,0.44],[0.44,-0.92],[-0.03,0.73],[0.22,0.53],[-0.29,-1.27],[0.29,-1.26],[-0.78,-0.81],[1.16,-0.57],[1.48,-0.64],[-1.97,2.62],[-1.11,0.42],[-0.97,1.3],[-1.23,-0.29],[-1.09,-0.85],[-2.39,0.54],[1.45,-0.49],[-0.04,0.86],[0.07,-1.71],[-0.3,0.53],[-0.13,-0.23],[-0.98,2.62],[-0.38,-0.4],[-0.93,-0.66],[-0.76,-0.18],[1.09,-0.16],[-1.67,0.54],[0.31,-1.03],[-0.36,0.06],[1.23,1.42],[0.37,-0.09],[-0.23,-0.89]]
        },
        {
          name: "dependent (tilted)",
          color: "#ff7b72",
          points: [[-0.35,-0.65],[0.1,-0.05],[1.07,-0.11],[0.17,0.35],[1.15,0.68],[-1.31,-1.6],[0.59,0.14],[-0.27,-0.51],[-0.14,0.1],[-0.43,-0.65],[-0.6,-0.91],[0.11,0.39],[1.81,1.19],[1.14,1.11],[0.27,-0.83],[0.16,0.05],[0.92,0.66],[-0.39,0.52],[-0.38,-0.63],[1.16,0.57],[1.26,0.32],[1.15,1.16],[-0.8,-1.6],[0.76,0.96],[-0.83,-0.46],[-0.76,-0.93],[1.91,1.27],[-0.32,-0.34],[-1.3,-1.04],[1.17,0.06],[0.6,0.18],[-2.88,-2.44],[-0.09,-0.2],[-0.32,-0.98],[0.36,0.3],[-0.08,-0.31],[1.23,1.15],[1.72,1.22],[-0.66,-0.54],[0.59,0.08],[1.77,1.01],[-1.27,-1.57],[-0.68,-0.12],[0.31,0.25],[-2.28,-1.85],[-0.74,-1.26],[-1.07,-0.73],[1.25,1.28],[-0.22,0],[-0.42,0.07],[-0.18,-0.31],[0.73,1.42],[-0.23,-0.54],[-1.71,-1.17],[-0.31,0.37],[2.35,2.31],[-1.84,-2.17],[1.87,1.7],[-0.21,-0.6],[-0.84,-1.1]]
        }
      ],
      lines: [
        { color: "#ff7b72", dash: true, points: [[-3,-2.55],[3,2.55]] }
      ],
      interpret: "Each dot is one (X, Y) draw. The green cloud is <b>round / shapeless</b> (sample corr about -0.05): knowing X tells you nothing about Y, the signature of independence. The red cloud <b>stretches along the dashed line</b> (corr about 0.91): high X goes with high Y, so they move together and are dependent. <b>Round = independent; tilted = correlated and therefore dependent.</b>"
    },
    {
      type: "scatter",
      title: "Variant: negative dependence - cloud tilts the OTHER way (corr about -0.9)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "negatively dependent (down-tilt)",
          color: "#ffb454",
          points: [[-2.4,2.1],[-1.9,1.7],[-1.6,1.8],[-1.3,1.2],[-1.1,1.0],[-0.9,1.3],[-0.7,0.6],[-0.5,0.9],[-0.4,0.2],[-0.2,0.5],[-0.1,0.0],[0.1,-0.3],[0.2,0.1],[0.4,-0.5],[0.5,-0.2],[0.7,-0.9],[0.8,-0.6],[1.0,-1.1],[1.2,-0.8],[1.3,-1.4],[1.5,-1.2],[1.7,-1.7],[1.9,-1.5],[2.1,-2.0],[2.4,-2.2],[-2.0,1.4],[-0.6,0.4],[0.0,-0.1],[0.6,-0.4],[1.1,-1.3]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: true, points: [[-2.5,2.2],[2.5,-2.2]] }
      ],
      interpret: "Illustrative. Dependence is not always positive: here high X goes with <b>low</b> Y, so the cloud tilts <b>downward</b> (corr about -0.9). It is still tilted, still dependent - the product rule P(A and B) = P(A)P(B) would fail just as it does for positive tilt. <b>Any consistent tilt, up or down, means the variables are not independent.</b>"
    },
    {
      type: "scatter",
      title: "Trap: dependent but UNCORRELATED - corr about 0 yet a clear shape (Y about X^2)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "Y = X^2 + noise (corr about 0)",
          color: "#c89bff",
          points: [[-2.0,4.1],[-1.8,3.1],[-1.6,2.7],[-1.4,1.8],[-1.2,1.5],[-1.0,1.1],[-0.8,0.5],[-0.6,0.4],[-0.4,0.1],[-0.2,0.2],[0.0,-0.1],[0.2,0.0],[0.4,0.3],[0.6,0.5],[0.8,0.6],[1.0,0.9],[1.2,1.6],[1.4,1.9],[1.6,2.4],[1.8,3.4],[2.0,3.9],[-1.5,2.3],[-0.5,0.3],[0.5,0.2],[1.5,2.1],[-1.0,1.2],[1.0,1.0],[0.0,0.1],[-2.0,3.8],[2.0,4.2]]
        }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[-2,0.9],[2,0.9]] }
      ],
      interpret: "Illustrative and important. This U-shaped cloud has near-<b>zero correlation</b> (the flat grey best-fit line) yet X and Y are clearly <b>dependent</b> - Y is large when X is far from 0. Correlation only measures <b>straight-line</b> association, so corr about 0 does NOT prove independence. <b>The product rule, not the correlation, is the true test of independence.</b>"
    }
  ],
  caption: "Bar chart: equal grey/colored heights mean independent, a gap means dependent. Scatter 1: a round cloud is independent, a tilted one is correlated and dependent. The orange variant shows negative dependence tilts the cloud the other way. The purple variant is the key trap - a curved relationship has corr about 0 yet is still dependent, so only the product rule settles independence.",
  code: `import numpy as np

# --- Bars: P(A and B) vs P(A)P(B), from the two-coin-flip example ---
# Omega = {HH, HT, TH, TT}, each outcome probability 1/4.
# A = first flip heads = {HH, HT};  B = second flip heads = {HH, TH}
# D = at least one head = {HH, HT, TH}
pA, pB, pD = 0.5, 0.5, 0.75
pAB = 1/4                 # A and B = {HH}
pAD = 2/4                 # A and D = {HH, HT}
print("indep  product", pA*pB, "actual", pAB)   # 0.25 vs 0.25  -> equal
print("depend product", pA*pD, "actual", pAD)   # 0.375 vs 0.5  -> differ

# --- Scatter clouds (illustrative, fixed seed so numbers are reproducible) ---
def lcg(seed):
    s = [seed & 0xffffffff]
    def nxt():
        s[0] = (1103515245*s[0] + 12345) & 0xffffffff
        return s[0]/4294967296
    return nxt
def gauss(rng):
    u = max(1e-9, rng()); v = rng()
    return (-2*np.log(u))**0.5 * np.cos(2*np.pi*v)

r1 = lcg(7)
indep = [(round(gauss(r1),2), round(gauss(r1),2)) for _ in range(60)]   # X, Y unrelated -> round

r2 = lcg(13)
dep = []
for _ in range(60):
    x = gauss(r2); y = 0.85*x + 0.45*gauss(r2)                          # Y tracks X -> tilted
    dep.append((round(x,2), round(y,2)))

print("indep corr", round(np.corrcoef(*zip(*indep))[0,1], 3))           # ~ -0.05
print("dep   corr", round(np.corrcoef(*zip(*dep))[0,1], 3))             # ~  0.91`
};

window.CODEVIZ["prob-counting"] = {
  question: "How fast do ordered arrangements (permutations) outrun unordered picks (combinations) as you choose more items?",
  charts: [
    {
      type: "line",
      title: "Permutations n!/(n-r)! vs Combinations C(n,r), n=8, sweeping r",
      xlabel: "r (how many you pick from n=8)",
      ylabel: "number of ways",
      series: [
        {
          name: "permutations P(8,r) = 8!/(8-r)!",
          color: "#4ea1ff",
          points: [[0, 1], [1, 8], [2, 56], [3, 336], [4, 1680], [5, 6720], [6, 20160], [7, 40320], [8, 40320]]
        },
        {
          name: "combinations C(8,r) = 8!/(r!(8-r)!)",
          color: "#7ee787",
          points: [[0, 1], [1, 8], [2, 28], [3, 56], [4, 70], [5, 56], [6, 28], [7, 8], [8, 1]]
        }
      ],
      interpret: "The x-axis is r, how many of the 8 items you pick; the y-axis is how many ways. The blue permutation line shoots up far faster than the green combination line, and the gap is exactly the factor r! you divide out when order stops mattering. <b>Read it as: counting ordered line-ups grows explosively, while counting unordered groups stays modest.</b>"
    },
    {
      type: "bars",
      title: "Combinations C(8,r): symmetric and capped, peaks at the middle r=4",
      labels: ["r=0", "r=1", "r=2", "r=3", "r=4", "r=5", "r=6", "r=7", "r=8"],
      values: [1, 8, 28, 56, 70, 56, 28, 8, 1],
      valueLabels: ["1", "8", "28", "56", "70", "56", "28", "8", "1"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Each bar is C(8,r), the number of unordered groups of size r. The heights are a mirror image left-to-right (C(8,r)=C(8,8-r)) and peak in the middle at r=4 (70 ways, green). <b>Read it as: picking 4 of 8 gives the most distinct groups, and picking r is the same as leaving out 8-r.</b>"
    },
    {
      type: "bars",
      title: "C(5,3) = P(5,3) / 3!: dividing by 3!=6 collapses 60 ordered line-ups into 10 teams",
      labels: ["P(5,3) ordered = 5!/2!", "divide by 3! = 6", "C(5,3) teams = P/3!"],
      values: [60, 6, 10],
      valueLabels: ["60", "/ 6", "10"],
      colors: ["#4ea1ff", "#ffb454", "#7ee787"],
      interpret: "This is the lesson's 5-students example, term by term: 60 ordered line-ups (blue) divided by the 3!=6 orderings of every team (orange) leaves 10 distinct teams (green). <b>Read it as: combinations are just permutations with the within-group orderings cancelled out.</b>"
    },
    {
      type: "line",
      title: "VARIANT (illustrative): factorial growth n! dwarfs polynomial counting",
      xlabel: "n (number of items)",
      ylabel: "count (log-like scale, illustrative)",
      series: [
        { name: "n! (all orderings)", color: "#ff7b72", points: [[1, 1], [2, 2], [3, 6], [4, 24], [5, 120], [6, 720], [7, 5040], [8, 40320]] },
        { name: "n^2 (pairs, for contrast)", color: "#9aa7b4", points: [[1, 1], [2, 4], [3, 9], [4, 16], [5, 25], [6, 36], [7, 49], [8, 64]] }
      ],
      interpret: "Illustrative. The x-axis is the number of items n; the red line is n! (every possible ordering) and the grey line is n^2 (just pairs). By n=8 the red curve is already 40320 versus 64. <b>Recognise this when a brute-force 'try every arrangement' plan is proposed: factorial growth makes it impossible past small n, which is why we count instead of enumerate.</b>"
    },
    {
      type: "bars",
      title: "VARIANT (illustrative): permutations with repetition n^r have no symmetry, just keep climbing",
      labels: ["r=1", "r=2", "r=3", "r=4", "r=5"],
      values: [4, 16, 64, 256, 1024],
      valueLabels: ["4", "16", "64", "256", "1024"],
      colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"],
      interpret: "Illustrative, with n=4 choices each slot. When repetition is allowed (e.g. a 4-symbol PIN of length r), the count is n^r, here 4^r. Unlike C(n,r) there is no peak and no symmetry; the bars just keep multiplying by n. <b>Recognise this case when items can repeat (passwords, dice rolls): the answer is n^r, not a factorial ratio.</b>"
    }
  ],
  caption: "The line chart contrasts permutations P(8,r) (blue) with combinations C(8,r) (green); the bar chart shows C(8,r) is symmetric and peaks at r=4; the third chart makes the link concrete (60 ordered line-ups / 3! = 10 teams). The last two variants show factorial growth versus polynomial counting, and counting with repetition (n^r), so you can recognise which counting rule a problem actually needs.",
  code: `import math

def P(n, r):  # permutations: ordered arrangements
    return math.factorial(n) // math.factorial(n - r)

def C(n, r):  # combinations: unordered picks
    return math.factorial(n) // (math.factorial(r) * math.factorial(n - r))

n = 8
perms = [P(n, r) for r in range(n + 1)]   # 1,8,56,336,1680,6720,20160,40320,40320
combs = [C(n, r) for r in range(n + 1)]   # 1,8,28,56,70,56,28,8,1

# the collapse identity for the lesson's 5-students example
p53 = P(5, 3)            # 60 ordered line-ups
fact3 = math.factorial(3)  # 6 orderings per team
c53 = p53 // fact3       # 10 teams  == C(5,3)
assert c53 == C(5, 3)
print(perms, combs, p53, fact3, c53)`
};

window.CODEVIZ["prob-random-variable"] = {
  question: "X = number of heads in 2 fair coin flips. What does its PMF look like, why do the bars add to exactly 1, and what other PMF shapes might you meet?",
  charts: [
    {
      type: "bars",
      title: "PMF p_X(x) = P(X = x), and the bars sum to 1",
      labels: ["x=0 (TT)", "x=1 (HT,TH)", "x=2 (HH)", "sum p_X(x)"],
      values: [0.25, 0.5, 0.25, 1.0],
      valueLabels: ["1/4", "1/2", "1/4", "1"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"],
      interpret: "Each blue bar is the probability that X (the count of heads) equals that value: 1/4, 1/2, 1/4. The green bar adds them and lands exactly on 1. <b>Read it as: a PMF lists the chance of every value a discrete variable can take, and those chances must total 1 because some value always happens.</b>"
    },
    {
      type: "line",
      title: "Cumulative sum of the PMF climbs to 1 (the CDF)",
      xlabel: "value x",
      ylabel: "running total of p_X up to x",
      series: [
        {
          name: "cumulative sum F(x)",
          color: "#c89bff",
          points: [[0, 0.25], [1, 0.75], [2, 1.0]]
        },
        {
          name: "target total = 1",
          color: "#7ee787",
          points: [[0, 1.0], [2, 1.0]]
        }
      ],
      interpret: "The x-axis is the value x; the purple line is the running total of probability up to and including x (the CDF). It only ever climbs and reaches the green target of 1 at the largest value. <b>Read it as: the CDF is the PMF added up left-to-right; it answers P(X is at most x) and must end at 1.</b>"
    },
    {
      type: "bars",
      title: "VARIANT (illustrative): skewed PMF (rare-event count) piles mass on small values",
      labels: ["x=0", "x=1", "x=2", "x=3", "x=4", "x=5"],
      values: [0.55, 0.27, 0.12, 0.04, 0.015, 0.005],
      valueLabels: ["0.55", "0.27", "0.12", "0.04", "0.015", "0.005"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"],
      interpret: "Illustrative (a rare-event count, like daily defects). The bars still sum to 1, but the mass is lopsided toward 0 with a long thin tail to the right. <b>Recognise this skewed shape when most outcomes are small but occasional large ones occur; the most likely value (the mode, here 0) sits well below the average.</b>"
    },
    {
      type: "bars",
      title: "VARIANT (illustrative): bimodal PMF has two separate peaks",
      labels: ["x=0", "x=1", "x=2", "x=3", "x=4", "x=5", "x=6"],
      values: [0.05, 0.25, 0.18, 0.04, 0.18, 0.25, 0.05],
      valueLabels: ["0.05", "0.25", "0.18", "0.04", "0.18", "0.25", "0.05"],
      colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"],
      interpret: "Illustrative. These probabilities sum to 1 but show two humps with a dip between them, often a sign the data mixes two sub-populations. <b>Recognise a bimodal PMF when there are two likely regions: the single 'average' value falls in the unlikely valley between the peaks, so the mean alone describes the variable poorly.</b>"
    }
  ],
  caption: "The first chart is the PMF of X = heads in two fair flips (1/4, 1/2, 1/4, summing to 1); the second accumulates it into the CDF that climbs to 1. The two variants show other PMF shapes you meet for discrete variables: a right-skewed rare-event count, and a bimodal distribution with two peaks. In every case the bars still sum to 1, but the shape changes where the typical value sits.",
  code: `import numpy as np
from math import comb

# X = number of heads in n=2 fair coin flips -> Binomial(n=2, p=0.5)
n, p = 2, 0.5
xs = np.arange(n + 1)                 # 0, 1, 2
pmf = np.array([comb(n, k) * p**k * (1 - p)**(n - k) for k in xs])
print("pmf:", pmf)                    # [0.25 0.5  0.25]
print("sum p_X(x):", pmf.sum())       # 1.0  (normalization)

cdf = np.cumsum(pmf)                  # running total
print("cumulative sum:", cdf)         # [0.25 0.75 1.0] -> reaches 1
`
};

window.CODEVIZ["prob-expectation"] = {
  question: "How does weighting each die face by its probability produce the mean 3.5, and what happens to that balance point when the distribution is lopsided?",
  charts: [
    {
      type: "bars",
      title: "E[X] = sum of x*p(x): each face's contribution, fair die, mean 3.5",
      labels: ["x=1", "x=2", "x=3", "x=4", "x=5", "x=6"],
      values: [0.1667, 0.3333, 0.5, 0.6667, 0.8333, 1.0],
      valueLabels: ["1/6", "2/6", "3/6", "4/6", "5/6", "6/6"],
      colors: ["#4ea1ff", "#4ea1ff", "#7ee787", "#7ee787", "#c89bff", "#c89bff"],
      xlabel: "die face x",
      ylabel: "contribution x*p(x)",
      interpret: "Each bar is one face's contribution to the mean: its value <b>x</b> times its probability <b>p(x) = 1/6</b>. Read the heights left to right and add them: 1/6 + 2/6 + ... + 6/6 = 21/6 = <b>3.5</b>. The mean is not the tallest bar; it is the <b>balance point</b> of all six contributions, and for a symmetric fair die it sits exactly in the middle at 3.5."
    },
    {
      type: "bars",
      title: "Linearity E[aX+b] = a*E[X] + b, term by term (a=2, b=1)",
      labels: ["E[X]", "a*E[X] = 2*3.5", "+ b = +1", "E[2X+1]"],
      values: [3.5, 7.0, 1.0, 8.0],
      valueLabels: ["3.5", "7.0", "1.0", "8.0"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#c89bff"],
      xlabel: "term in the identity",
      ylabel: "value",
      interpret: "This reads as an equation laid out in bars. Start from <b>E[X]=3.5</b> (blue), scale it by a=2 to get <b>7.0</b> (green), add the shift b=1 (orange), and the result <b>E[2X+1]=8.0</b> (purple) equals 7+1. Takeaway: a linear transform of X moves its mean in the exact same linear way, so you never have to re-average from scratch."
    },
    {
      type: "bars",
      title: "Skewed variant: a long right tail drags the mean above the most-likely value",
      labels: ["x=1", "x=2", "x=3", "x=4", "x=5", "mean E[X]=2.6"],
      values: [0.5, 0.2, 0.1, 0.1, 0.1, 0.0],
      valueLabels: ["p=0.50", "p=0.20", "p=0.10", "p=0.10", "p=0.10", "2.6"],
      colors: ["#ffb454", "#ffb454", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#ff7b72"],
      xlabel: "value x (probabilities shown, illustrative)",
      ylabel: "probability p(x)",
      interpret: "<b>Illustrative</b> right-skewed distribution: most mass sits at x=1 (the mode), but a thin tail stretches out to x=5. Computing the weighted sum gives E[X] = 1(0.5)+2(0.2)+3(0.1)+4(0.1)+5(0.1) = <b>2.6</b> (red bar) -- well to the right of the most-likely value 1. Recognise this whenever the mean and the peak disagree: a few large values pull the balance point toward the tail, which is exactly why averages can mislead on skewed data like incomes or wait times."
    },
    {
      type: "line",
      title: "Sample mean converges to E[X]=3.5 as you average more die rolls (law of large numbers)",
      xlabel: "number of rolls averaged (n)",
      ylabel: "running sample mean",
      series: [
        { name: "running sample mean", color: "#4ea1ff", points: [[1, 5.0], [2, 3.5], [5, 4.2], [10, 3.9], [20, 3.25], [50, 3.62], [100, 3.44], [200, 3.53], [500, 3.49], [1000, 3.5]] },
        { name: "true mean E[X] = 3.5", color: "#7ee787", points: [[1, 3.5], [1000, 3.5]] }
      ],
      interpret: "<b>Illustrative</b> simulation: the blue line is the average of the first n die rolls, recomputed as n grows along the x-axis. Early on (small n) it swings wildly -- a single lucky 6 can throw it off -- but as n increases the noise averages out and the line settles onto the green <b>E[X]=3.5</b> target. This is the bridge between the formula and reality: expectation is the long-run average you actually observe, so don't trust a sample mean from only a handful of trials."
    }
  ],
  caption: "Chart 1: expectation is a weighted sum -- each face contributes x*p(x)=x/6 and the six add to 21/6=3.5, the balance point. Chart 2: linearity rescales that mean directly, E[2X+1]=2(3.5)+1=8. Chart 3: a right-skewed distribution drags the mean (2.6) above its most-likely value (1). Chart 4: averaging more rolls makes the noisy sample mean converge onto the true E[X]=3.5.",
  code: `import numpy as np

# Fair die: X takes 1..6 each with probability 1/6
x = np.arange(1, 7)
p = np.full(6, 1/6)

# E[X] = sum of x * p(x): per-face contributions
contrib = x * p                 # [1/6, 2/6, ..., 6/6]
EX = contrib.sum()              # 21/6 = 3.5
print("contributions x*p(x):", contrib)
print("E[X] =", EX)             # 3.5

# Linearity: E[aX + b] = a*E[X] + b, with a=2, b=1
a, b = 2, 1
EaXb   = a * EX + b             # 8.0
direct = ((a*x + b) * p).sum()  # also 8.0
print("E[2X+1] =", EaXb, " direct =", direct)`
};

window.CODEVIZ["prob-variance"] = {
  question: "Same average, different spread -- how does variance turn distance-from-the-mean into one number, and what do extreme spreads look like?",
  charts: [
    {
      type: "bars",
      title: "Var(X) = E[(X-mu)^2]: weighted squared deviations add up to the variance",
      labels: ["x=1", "x=2", "x=3", "x=4", "x=5", "Var(X) total"],
      values: [0.2, 0.2, 0, 0.2, 0.2, 0.8],
      valueLabels: ["0.20", "0.20", "0", "0.20", "0.20", "0.80"],
      colors: ["#4ea1ff", "#4ea1ff", "#9aa7b4", "#4ea1ff", "#4ea1ff", "#7ee787"],
      xlabel: "value x",
      ylabel: "contribution p(x)*(x-mu)^2",
      interpret: "Each blue bar is one value's contribution to the variance: its probability times its <b>squared</b> distance from the mean mu=3. The value at the mean (x=3) contributes nothing (grey, distance 0), while values farther out contribute more because the distance is squared. Adding the contributions gives the green total <b>Var=0.8</b>. Read it as: variance is the average squared distance from the centre."
    },
    {
      type: "bars",
      title: "Var(X) = E[X^2] - (E[X])^2, term by term (coin worth 0 or 2, mu=1)",
      labels: ["E[X^2]", "(E[X])^2", "Var(X)"],
      values: [2, 1, 1],
      valueLabels: ["2.00", "1.00", "1.00"],
      colors: ["#4ea1ff", "#ffb454", "#7ee787"],
      xlabel: "term in the shortcut",
      ylabel: "value",
      interpret: "The same variance via the algebra shortcut: take the mean of the squares <b>E[X^2]=2</b> (blue) and subtract the square of the mean <b>(E[X])^2=1</b> (orange) to land on <b>Var=1</b> (green). This is the form you actually compute in code -- one pass for E[X], one for E[X^2] -- and it must always come out non-negative; a negative result means an arithmetic slip."
    },
    {
      type: "bars",
      title: "Low variance vs high variance: same mean 3, different spread",
      labels: ["x=1", "x=2", "x=3", "x=4", "x=5"],
      series: [
        { name: "low spread (Var=0.8)", color: "#7ee787", points: [[1, 0.05], [2, 0.20], [3, 0.50], [4, 0.20], [5, 0.05]] },
        { name: "high spread (Var=2.6)", color: "#ff7b72", points: [[1, 0.30], [2, 0.10], [3, 0.20], [4, 0.10], [5, 0.30]] }
      ],
      xlabel: "value x",
      ylabel: "probability p(x)",
      interpret: "Two distributions with the <b>same mean (3)</b> but different shapes. The green one piles mass near the centre, so values rarely stray far -- low variance (0.8). The red one pushes mass out to the edges (1 and 5), so values are routinely far from the mean -- high variance (2.6). The mean tells you where the centre is; variance tells you how tightly the outcomes cluster around it."
    },
    {
      type: "bars",
      title: "sigma = sqrt(Var): standard deviation puts spread back in original units",
      labels: ["low: Var", "low: sigma", "high: Var", "high: sigma"],
      values: [0.8, 0.894, 2.6, 1.612],
      valueLabels: ["0.80", "0.894", "2.60", "1.612"],
      colors: ["#7ee787", "#4ea1ff", "#ff7b72", "#ffb454"],
      xlabel: "quantity",
      ylabel: "value",
      interpret: "Variance is in <b>squared</b> units, which is hard to interpret; taking the square root gives the standard deviation <b>sigma</b>, back in the data's own units. Note the pairs: low spread has Var=0.8 -> sigma=0.894, high spread has Var=2.6 -> sigma=1.612. So sigma is the typical distance an outcome lands from the mean -- a more readable summary of spread than the variance itself."
    },
    {
      type: "bars",
      title: "Heavy-outlier variant: one far value inflates the variance because deviations are squared",
      labels: ["x=3", "x=3", "x=3", "x=3", "x=20 (outlier)", "Var ~ 57.8"],
      values: [0.0, 0.0, 0.0, 0.0, 57.8, 57.8],
      valueLabels: ["~0", "~0", "~0", "~0", "57.8", "57.8"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#ff7b72", "#ffb454"],
      xlabel: "value x (contribution p*(x-mu)^2)",
      ylabel: "contribution to variance",
      interpret: "<b>Illustrative</b>: four points sit at 3 and one lands at 20, so mu=6.4. The four near-mean points contribute almost nothing, but the lone outlier's squared distance (20-6.4)^2 = 185, weighted by 1/5, dominates the total (red bar). Because variance squares distances, a <b>single</b> extreme value can balloon it. Spot this when one bar towers over the rest -- it is a sign your spread is driven by an outlier, not the bulk of the data, and a robust measure (like IQR) may describe the data better."
    },
    {
      type: "bars",
      title: "Near-zero variance variant: an almost-constant variable barely spreads at all",
      labels: ["x=2.99", "x=3.00", "x=3.01", "Var ~ 0.00007"],
      values: [0.000033, 0.0, 0.000033, 0.00007],
      valueLabels: ["~0.00003", "0", "~0.00003", "~0.00007"],
      colors: ["#4ea1ff", "#9aa7b4", "#4ea1ff", "#7ee787"],
      xlabel: "value x (contribution p*(x-mu)^2)",
      ylabel: "contribution to variance",
      interpret: "<b>Illustrative</b>: all the mass clusters within +/-0.01 of mu=3, so every squared deviation is tiny and they sum to a near-zero total (green). A variance at or near 0 means the variable is essentially <b>constant</b> -- it almost always takes the same value. In ML this is the signature of a dead or useless feature: if a column barely varies it carries almost no information, and standardising it (dividing by sigma ~ 0) will blow up numerically."
    }
  ],
  caption: "Charts 1-2: variance is the mean squared distance from mu, computed either directly (0.8) or via the shortcut E[X^2]-(E[X])^2 (=1 for the coin). Chart 3: equal means can hide very different spreads. Chart 4: sigma=sqrt(Var) reports that spread in original units. Chart 5: a single heavy outlier inflates variance because deviations are squared. Chart 6: a near-constant variable has variance ~0 -- the hallmark of an uninformative feature.",
  code: `import numpy as np

# A 5-point variable, mean 3, in two flavors
x = np.array([1, 2, 3, 4, 5])
p_low  = np.array([0.05, 0.20, 0.50, 0.20, 0.05])
p_high = np.array([0.30, 0.10, 0.20, 0.10, 0.30])

def stats(x, p):
    EX  = (x * p).sum()
    EX2 = (x**2 * p).sum()
    var = EX2 - EX**2
    return EX, EX2, var, np.sqrt(var)

# Chart 1: weighted squared deviations for the low-spread variable
mu = (x * p_low).sum()                 # 3.0
contrib = p_low * (x - mu)**2          # [0.2, 0.2, 0, 0.2, 0.2]
var_low = contrib.sum()                # 0.8  == E[(X-mu)^2]

# Chart 2: coin worth 0 or 2, each 1/2  ->  E[X^2]-(E[X])^2
xc, pc = np.array([0, 2]), np.array([0.5, 0.5])
var_coin = (xc**2 * pc).sum() - (xc * pc).sum()**2   # 2 - 1 = 1

# Charts 3 & 4: compare spreads and report sigma = sqrt(Var)
_, _, vlo, slo = stats(x, p_low)        # Var=0.8,  sigma=0.894
_, _, vhi, shi = stats(x, p_high)       # Var=2.6,  sigma=1.612
print(var_low, var_coin, vlo, slo, vhi, shi)`
};

window.CODEVIZ["prob-bernoulli-binomial"] = {
  question: "One yes/no trial, then n of them: what does the count of successes look like, and how does its shape change?",
  charts: [
    {
      type: "bars",
      title: "Bernoulli pmf, p=0.3: P(0)=1-p, P(1)=p  (E[X]=p, Var=p(1-p)=0.21)",
      labels: ["X=0 (failure)", "X=1 (success)"],
      values: [0.7, 0.3],
      valueLabels: ["0.70 = 1-p", "0.30 = p"],
      colors: ["#9aa7b4", "#7ee787"],
      interpret: "Two bars, one for each outcome of a single yes/no trial: x-axis is the outcome, y-axis is its probability. The success bar (green) has height p=0.30 and the failure bar (grey) has height 1-p=0.70, and the two must add to 1. <b>Read it as:</b> the taller bar is the more likely outcome, and the gap between the bars tells you how lopsided the coin is."
    },
    {
      type: "bars",
      title: "Binomial pmf P(k)=C(n,k)p^k(1-p)^(n-k), n=10: p=0.2 (mean np=2) vs p=0.5 (mean np=5)",
      labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      series: [
        {
          name: "p=0.2  (mean np=2)",
          color: "#ffb454",
          points: [
            [0, 0.1074], [1, 0.2684], [2, 0.3020], [3, 0.2013], [4, 0.0881],
            [5, 0.0264], [6, 0.0055], [7, 0.0008], [8, 0.0001], [9, 0.0000], [10, 0.0000]
          ]
        },
        {
          name: "p=0.5  (mean np=5)",
          color: "#4ea1ff",
          points: [
            [0, 0.0010], [1, 0.0098], [2, 0.0439], [3, 0.1172], [4, 0.2051],
            [5, 0.2461], [6, 0.2051], [7, 0.1172], [8, 0.0439], [9, 0.0098], [10, 0.0010]
          ]
        }
      ],
      interpret: "Each cluster of bars is a full Binomial pmf for n=10 trials: x-axis is k, the number of successes; y-axis is how likely exactly that many. <b>Read it as:</b> the hump sits over the mean np, so the orange p=0.2 cloud centers at k=2 and the blue p=0.5 cloud centers at k=5. A low p pushes the mass left and makes it lopsided; p=0.5 makes it symmetric. The bars in each colour sum to 1."
    },
    {
      type: "line",
      title: "Bernoulli variance Var=p(1-p): largest at p=0.5 (0.25), zero at p=0 and p=1",
      xlabel: "p (success probability)",
      ylabel: "Var(X) = p(1-p)",
      series: [
        {
          name: "p(1-p)",
          color: "#c89bff",
          points: [
            [0, 0], [0.05, 0.0475], [0.1, 0.09], [0.15, 0.1275], [0.2, 0.16],
            [0.25, 0.1875], [0.3, 0.21], [0.35, 0.2275], [0.4, 0.24], [0.45, 0.2475],
            [0.5, 0.25], [0.55, 0.2475], [0.6, 0.24], [0.65, 0.2275], [0.7, 0.21],
            [0.75, 0.1875], [0.8, 0.16], [0.85, 0.1275], [0.9, 0.09], [0.95, 0.0475], [1, 0]
          ]
        }
      ],
      interpret: "X-axis is the success probability p; y-axis is the Bernoulli variance p(1-p), i.e. how unpredictable one trial is. <b>Read it as:</b> the curve is an upside-down arch peaking at 0.25 when p=0.5 (a fair coin is the hardest to guess) and dropping to 0 at p=0 or p=1, where the outcome is certain so there is nothing to vary."
    },
    {
      type: "bars",
      title: "VARIANT - Binomial as n grows (p=0.5): n=4 vs n=20, the bell sharpens and shifts",
      labels: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20"],
      series: [
        { name: "n=4 (mean 2)", color: "#7ee787", points: [[0, 0.0625], [2, 0.375], [4, 0.0625], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0], [16, 0], [18, 0], [20, 0]] },
        { name: "n=20 (mean 10)", color: "#4ea1ff", points: [[0, 0], [2, 0.0002], [4, 0.0046], [6, 0.0370], [8, 0.1201], [10, 0.1762], [12, 0.1201], [14, 0.0370], [16, 0.0046], [18, 0.0002], [20, 0]] }
      ],
      interpret: "Illustrative: same fair-coin p=0.5 but two trial counts. <b>Read it as:</b> more trials slide the peak right (mean np grows from 2 to 10) and the spread widens in absolute terms, yet the shape becomes a smoother, more symmetric bell - this is the Binomial approaching a Normal as n grows. If you ever see a count distribution that looks bell-shaped, a large-n Binomial is a common cause."
    },
    {
      type: "bars",
      title: "VARIANT - Skewed Binomial, n=10, p=0.9: piled at the top (rare failures)",
      labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      values: [0, 0, 0, 0.0001, 0.0011, 0.0085, 0.0446, 0.1722, 0.3874, 0.3487, 0.1216],
      valueLabels: ["0", "0", "0", "0.000", "0.001", "0.009", "0.045", "0.172", "0.387", "0.349", "0.122"],
      colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ffb454", "#7ee787", "#7ee787", "#ffb454"],
      interpret: "High success rate p=0.9, so the mass piles against the right edge near k=9 (mean np=9). <b>Read it as:</b> when p is close to 1 the pmf is left-skewed - a long thin tail toward low counts and almost no probability of few successes. The mirror image (long right tail) happens when p is near 0. A lopsided count histogram bunched at one end is the signature of an extreme p."
    }
  ],
  caption: "The healthy trio: Bernoulli pmf for one trial, the Binomial pmf for n=10 at two success rates (each peaking near its mean np), and the variance curve p(1-p) peaking at the fair coin. The two variants show what else you meet: as n grows the Binomial sharpens into a bell, and an extreme p (here 0.9) produces a skewed pmf piled against one edge.",
  code: `import numpy as np
from math import comb

# --- Bernoulli pmf (chart 1) ---
p = 0.3
bern = [1 - p, p]                      # [0.70, 0.30]
print(bern, "E=", p, "Var=", round(p*(1-p), 2))   # 0.21

# --- Binomial pmf P(k)=C(n,k) p^k (1-p)^(n-k) (chart 2) ---
def binom_pmf(n, p):
    return [comb(n, k) * p**k * (1-p)**(n-k) for k in range(n+1)]

n = 10
for pp in (0.2, 0.5):
    pmf = binom_pmf(n, pp)
    print("p=", pp, "mean np=", n*pp, "var np(1-p)=", n*pp*(1-pp))
    print([round(v, 4) for v in pmf])
# p=0.2 -> mean 2.0; p=0.5 -> mean 5.0 (symmetric)

# --- Bernoulli variance curve p(1-p) (chart 3) ---
ps  = np.linspace(0, 1, 21)
var = ps * (1 - ps)
print(list(zip(ps.round(2), var.round(4))))      # peak 0.25 at p=0.5
`
};

window.CODEVIZ["prob-geometric-poisson"] = {
  question: "What do the Geometric and Poisson PMFs actually look like, where does the mean land, and how do their shapes shift?",
  charts: [
    {
      type: "bars",
      title: "Geometric PMF: P(k) = (1-p)^(k-1) p, p = 1/6, mean 1/p = 6",
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      values: [0.16667, 0.13889, 0.11574, 0.09645, 0.08038, 0.06698, 0.05582, 0.04651, 0.03876, 0.0323],
      valueLabels: ["0.167", "0.139", "0.116", "0.096", "0.080", "0.067", "0.056", "0.047", "0.039", "0.032"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      xlabel: "k = trial of first six",
      ylabel: "P(X = k)",
      interpret: "X-axis is k, the trial on which the FIRST success happens; y-axis is its probability. <b>Read it as:</b> the tallest bar is always k=1 and every bar is a fixed fraction (1-p)=5/6 of the one before, so the heights decay smoothly and never rise again. The green bar at k=6 marks the mean wait 1/p=6, but note the most likely single outcome (k=1) is well left of that mean - the long right tail drags the average up."
    },
    {
      type: "bars",
      title: "Poisson PMF: P(k) = e^(-lam) lam^k / k!  (lam=2 means 2, lam=5 means 5)",
      labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      series: [
        { name: "lam = 2 (mean 2)", color: "#ffb454", points: [[0, 0.13534], [1, 0.27067], [2, 0.27067], [3, 0.18045], [4, 0.09022], [5, 0.03609], [6, 0.01203], [7, 0.00344], [8, 0.00086], [9, 0.00019], [10, 0.00004], [11, 0.00001], [12, 0]] },
        { name: "lam = 5 (mean 5)", color: "#c89bff", points: [[0, 0.00674], [1, 0.03369], [2, 0.08422], [3, 0.14037], [4, 0.17547], [5, 0.17547], [6, 0.14622], [7, 0.10444], [8, 0.06528], [9, 0.03627], [10, 0.01813], [11, 0.00824], [12, 0.00343]] }
      ],
      xlabel: "k = number of events in the window",
      ylabel: "P(X = k)",
      interpret: "X-axis is k, the count of events in a fixed window; y-axis is its probability. <b>Read it as:</b> unlike the Geometric, the Poisson has a hump that sits near its mean lam. The orange lam=2 cloud peaks at k=1-2; raising the rate to lam=5 (purple) shifts the peak right and spreads it out, because for the Poisson the mean and the variance are both lam."
    },
    {
      type: "bars",
      title: "VARIANT - Geometric with a high success rate p=0.6: collapses onto k=1",
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      values: [0.6, 0.24, 0.096, 0.0384, 0.01536, 0.006144, 0.0024576, 0.000983, 0.000393, 0.000157],
      valueLabels: ["0.600", "0.240", "0.096", "0.038", "0.015", "0.006", "0.002", "0.001", "0.000", "0.000"],
      colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      interpret: "Illustrative: same Geometric shape but an easy success p=0.6, so the decay factor (1-p)=0.4 is steep. <b>Read it as:</b> almost all the mass sits on k=1 and the bars vanish within a few trials - the mean wait is only 1/p about 1.67. A high p makes a Geometric drop off a cliff; a low p (like 1/6 above) makes it decay slowly with a long tail. The shape is always strictly decreasing."
    },
    {
      type: "line",
      title: "VARIANT - Poisson mean = variance = lam: spread grows with the rate",
      xlabel: "lam (mean event rate)",
      ylabel: "value",
      series: [
        { name: "mean = lam", color: "#7ee787", points: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8]] },
        { name: "std dev = sqrt(lam)", color: "#ffb454", points: [[1, 1], [2, 1.41], [3, 1.73], [4, 2], [5, 2.24], [6, 2.45], [7, 2.65], [8, 2.83]] }
      ],
      interpret: "X-axis is the rate lam; the green line is the Poisson mean (equal to lam) and the orange line is its standard deviation, sqrt(lam). <b>Read it as:</b> the mean climbs in a straight line but the spread grows only as the square root, so as lam rises the distribution gets relatively tighter around its mean (the bump in chart 2 looks more bell-like and symmetric at large lam). The two lines crossing at lam=1 is where mean and std are equal."
    },
    {
      type: "bars",
      title: "VARIANT - Geometric vs Poisson side by side at k: decaying vs humped",
      labels: ["0", "1", "2", "3", "4", "5", "6", "7"],
      series: [
        { name: "Geometric p=1/3 (decaying)", color: "#4ea1ff", points: [[0, 0], [1, 0.3333], [2, 0.2222], [3, 0.1481], [4, 0.0988], [5, 0.0658], [6, 0.0439], [7, 0.0293]] },
        { name: "Poisson lam=3 (humped)", color: "#c89bff", points: [[0, 0.0498], [1, 0.1494], [2, 0.2240], [3, 0.2240], [4, 0.1680], [5, 0.1008], [6, 0.0504], [7, 0.0216]] }
      ],
      interpret: "Illustrative contrast on the same axis: x is the value k, y is probability. <b>Read it as:</b> the Geometric (blue) is highest at its smallest value and only ever falls - it answers \"how long until the first success.\" The Poisson (purple) rises to a hump near its mean then falls - it answers \"how many events occurred.\" Spotting whether a count histogram is monotonically decaying or has an interior peak is the quickest way to tell which model fits."
    }
  ],
  caption: "The healthy pair: the Geometric PMF decaying by (1-p) each step with mean 1/p=6, and two Poisson PMFs humped near their mean lam. The variants show the rest: a high-p Geometric collapsing onto k=1, the Poisson's mean-equals-variance scaling (spread grows as sqrt(lam)), and a direct decaying-vs-humped comparison so you can tell the two shapes apart.",
  code: `import numpy as np
from math import factorial, exp

# Geometric: P(k) = (1-p)^(k-1) * p, p = 1/6, mean = 1/p = 6
p = 1/6
k_geom = np.arange(1, 11)
P_geom = (1 - p)**(k_geom - 1) * p
print("Geometric:", np.round(P_geom, 5))   # 0.16667 ... 0.0323
print("mean 1/p =", 1/p)                    # 6.0

# Poisson: P(k) = e^(-lam) * lam^k / k!, mean = lam
def pois(lam, k):
    return exp(-lam) * lam**k / factorial(k)

for lam in (2, 5):
    P = [round(pois(lam, k), 5) for k in range(13)]
    print("Poisson lam=", lam, P, " mean=", lam)
`
};

window.CODEVIZ["prob-pdf-cdf"] = {
  question: "If height is the curve, where does probability live? Pick a concrete density and watch area become the CDF — then learn to read other density shapes you'll meet.",
  charts: [
    {
      type: "line",
      title: "PDF f(x) = x/2 on [0,2] (triangular density): height is density, not probability",
      xlabel: "x",
      ylabel: "f(x) = density",
      series: [
        { name: "PDF f(x) = x/2", color: "#4ea1ff", points: [[0,0],[0.1,0.05],[0.2,0.1],[0.3,0.15],[0.4,0.2],[0.5,0.25],[0.6,0.3],[0.7,0.35],[0.8,0.4],[0.9,0.45],[1,0.5],[1.1,0.55],[1.2,0.6],[1.3,0.65],[1.4,0.7],[1.5,0.75],[1.6,0.8],[1.7,0.85],[1.8,0.9],[1.9,0.95],[2,1]] }
      ],
      interpret: "<b>Read the height as density, not probability.</b> The y-axis is f(x); a single x has probability zero, so the curve can exceed 1 (here it reaches 1.0 at x=2) without breaking any rule. What must equal 1 is the <b>total area</b> under the line. Tall regions (right side) are where outcomes pile up; flat-low regions (left, near 0) are rare. To get a real probability you read an <b>interval's area</b>, never a point's height."
    },
    {
      type: "line",
      title: "CDF F(x) = integral of f from 0 to x = x^2/4: climbs 0 to 1 as area accumulates",
      xlabel: "x",
      ylabel: "value",
      series: [
        { name: "CDF F(x) = x^2/4", color: "#7ee787", points: [[0,0],[0.1,0.0025],[0.2,0.01],[0.3,0.0225],[0.4,0.04],[0.5,0.0625],[0.6,0.09],[0.7,0.1225],[0.8,0.16],[0.9,0.2025],[1,0.25],[1.1,0.3025],[1.2,0.36],[1.3,0.4225],[1.4,0.49],[1.5,0.5625],[1.6,0.64],[1.7,0.7225],[1.8,0.81],[1.9,0.9025],[2,1]] },
        { name: "PDF f(x) = x/2 (for reference)", color: "#4ea1ff", points: [[0,0],[0.2,0.1],[0.4,0.2],[0.6,0.3],[0.8,0.4],[1,0.5],[1.2,0.6],[1.4,0.7],[1.6,0.8],[1.8,0.9],[2,1]] }
      ],
      interpret: "<b>The green CDF is the running total of area under the blue PDF.</b> Read F(x) as P(X less than or equal to x): it starts at 0, never goes down, and ends at 1 (all probability accounted for). It rises <b>fastest where the PDF is tallest</b> (the right side here), so a steep CDF means a dense region. To answer 'chance below x?' read the green curve's height directly at x."
    },
    {
      type: "line",
      title: "P(0.5<=X<=1.5) = F(1.5) - F(0.5) = 0.5625 - 0.0625 = 0.5 = area of the shaded slice",
      xlabel: "x",
      ylabel: "f(x)",
      series: [
        { name: "PDF f(x) = x/2", color: "#9aa7b4", points: [[0,0],[0.1,0.05],[0.2,0.1],[0.3,0.15],[0.4,0.2],[0.5,0.25],[0.6,0.3],[0.7,0.35],[0.8,0.4],[0.9,0.45],[1,0.5],[1.1,0.55],[1.2,0.6],[1.3,0.65],[1.4,0.7],[1.5,0.75],[1.6,0.8],[1.7,0.85],[1.8,0.9],[1.9,0.95],[2,1]] },
        { name: "shaded slice a=0.5 to b=1.5 (area = 0.5)", color: "#ffb454", points: [[0.5,0],[0.5,0.25],[0.6,0.3],[0.7,0.35],[0.8,0.4],[0.9,0.45],[1,0.5],[1.1,0.55],[1.2,0.6],[1.3,0.65],[1.4,0.7],[1.5,0.75],[1.5,0]] }
      ],
      interpret: "<b>Probability of an interval = area of the shaded slab = a difference of two CDF heights.</b> The orange region between a=0.5 and b=1.5 has area exactly F(1.5)-F(0.5)=0.5625-0.0625=0.5, so there is a 50% chance X lands in that range. The trick to read off any interval: never integrate by hand — just subtract the CDF at the two ends."
    },
    {
      type: "line",
      title: "f(x) = F'(x): the slope of the CDF equals the PDF (numeric slope lands on x/2)",
      xlabel: "x",
      ylabel: "value",
      series: [
        { name: "PDF f(x) = x/2 (exact)", color: "#4ea1ff", points: [[0,0],[0.2,0.1],[0.4,0.2],[0.6,0.3],[0.8,0.4],[1,0.5],[1.2,0.6],[1.4,0.7],[1.6,0.8],[1.8,0.9],[2,1]] },
        { name: "slope of CDF (F(x+h)-F(x-h))/2h", color: "#c89bff", points: [[0.2,0.1],[0.4,0.2],[0.6,0.3],[0.8,0.4],[1,0.5],[1.2,0.6],[1.4,0.7],[1.6,0.8],[1.8,0.9]] }
      ],
      interpret: "<b>PDF and CDF are two views of one object: the PDF is the slope of the CDF.</b> The purple dots are the measured slope of the green CDF and they land right on the blue line f(x)=x/2. So a steep stretch of CDF shows up as a tall PDF, and a flat stretch shows up as near-zero density. Reading either chart, you can reconstruct the other."
    },
    {
      type: "line",
      title: "Variant — Uniform density: flat PDF gives a straight-line (ramp) CDF",
      xlabel: "x",
      ylabel: "value",
      series: [
        { name: "PDF f(x) = 0.5 (flat)", color: "#4ea1ff", points: [[0,0],[0,0.5],[0.5,0.5],[1,0.5],[1.5,0.5],[2,0.5],[2,0]] },
        { name: "CDF F(x) = x/2 (straight ramp)", color: "#7ee787", points: [[0,0],[0.5,0.25],[1,0.5],[1.5,0.75],[2,1]] }
      ],
      interpret: "<b>Illustrative shape to recognise.</b> When the PDF is a flat plateau (every value equally likely), the CDF is a <b>straight diagonal ramp</b> — equal area added per step. Spotting a perfectly linear CDF tells you the density is uniform with no peak. Contrast with the triangular case above, whose curving CDF reveals a sloped (non-uniform) density."
    },
    {
      type: "line",
      title: "Variant — Heavy right tail (e.g. wait times): PDF spikes then decays, CDF shoots up early",
      xlabel: "x",
      ylabel: "value",
      series: [
        { name: "PDF (decaying tail)", color: "#ffb454", points: [[0,1.0],[0.25,0.78],[0.5,0.61],[0.75,0.47],[1,0.37],[1.5,0.22],[2,0.14],[2.5,0.082],[3,0.05],[4,0.018]] },
        { name: "CDF (rises fast, levels off)", color: "#c89bff", points: [[0,0],[0.25,0.22],[0.5,0.39],[0.75,0.53],[1,0.63],[1.5,0.78],[2,0.86],[2.5,0.92],[3,0.95],[4,0.98]] }
      ],
      interpret: "<b>Illustrative shape to recognise.</b> A density that is <b>tallest at the left and decays toward a long thin tail</b> means small values are common and large values rare-but-possible. Its CDF <b>climbs steeply near 0</b> (most mass arrives early) then flattens as it crawls to 1. If you see a CDF that nearly reaches 1 quickly but never quite gets there, suspect a heavy-tailed density like this."
    }
  ],
  caption: "We pick a concrete triangular density f(x)=x/2 on [0,2]. Charts 1 to 4 are the core: the PDF (area integrates to 1), its CDF x^2/4 climbing 0 to 1, an interval's probability as a shaded area = F(1.5)-F(0.5)=0.5, and f(x)=F'(x). The last two are variants you'll meet: a flat Uniform density (ramp CDF) and a heavy-tailed wait-time density (steep-then-flat CDF).",
  code: `import numpy as np

# concrete continuous density: triangular on [0,2], f(x)=x/2
def f(x): return np.where((x>=0)&(x<=2), x/2.0, 0.0)
def F(x): return np.clip(x*x/4.0, 0, 1)   # CDF = integral of f from 0 to x

xs = np.linspace(0, 2, 21)

# chart 1: PDF height = x/2
pdf = f(xs)

# chart 2: CDF = accumulated area; total area integrates to 1
cdf = F(xs)
print("total area =", np.trapz(f(np.linspace(0,2,2001)), np.linspace(0,2,2001)))  # 1.0

# chart 3: P(a<=X<=b) = F(b) - F(a) = area under f on [a,b]
a, b = 0.5, 1.5
print(F(b) - F(a))                         # 0.5625 - 0.0625 = 0.5

# chart 4: f(x) = F'(x); central finite difference of the CDF matches x/2
h = 1e-4
slope = (F(xs+h) - F(xs-h)) / (2*h)
print(np.allclose(slope[1:-1], f(xs)[1:-1], atol=1e-3))  # True
`
};

window.CODEVIZ["prob-uniform-exponential"] = {
  question: "What do a flat Uniform density and a decaying Exponential wait look like, where are their means, why does waiting change nothing (memorylessness) — and what variants might you see?",
  charts: [
    {
      type: "line",
      title: "Uniform pdf f(x) = 1/(b-a) = 1/10 = 0.1 on [0,10], mean (a+b)/2 = 5",
      xlabel: "x (minutes)",
      ylabel: "density f(x)",
      series: [
        { name: "f(x) = 1/(b-a) = 0.1", color: "#7ee787", points: [[-1, 0], [0, 0.1], [1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1], [5, 0.1], [6, 0.1], [7, 0.1], [8, 0.1], [9, 0.1], [10, 0.1], [11, 0], [12, 0]] },
        { name: "mean = (a+b)/2 = 5", color: "#ffb454", points: [[5, 0], [5, 0.1]] }
      ],
      interpret: "<b>Flat means every value in the range is equally likely.</b> The density sits at height 1/(b-a)=0.1 over [0,10] and is zero outside, so the rectangle's area is 0.1 x 10 = 1. Because it is symmetric, the mean (orange line) is the midpoint (a+b)/2 = 5. Read any sub-interval's probability as its width x 0.1 — e.g. [2,4] has chance 0.2."
    },
    {
      type: "line",
      title: "Exponential pdf f(x) = lambda*e^(-lambda x), lambda=0.2, mean 1/lambda = 5",
      xlabel: "x (minutes)",
      ylabel: "density f(x)",
      series: [
        { name: "f(x) = 0.2*e^(-0.2x)", color: "#4ea1ff", points: [[0, 0.2], [1, 0.1637], [2, 0.1341], [3, 0.1098], [4, 0.0899], [5, 0.0736], [6, 0.0602], [7, 0.0493], [8, 0.0404], [9, 0.0331], [10, 0.0271], [12, 0.0181], [14, 0.0122], [16, 0.0082], [18, 0.0055], [20, 0.0037], [24, 0.0016], [30, 0.0005]] },
        { name: "mean = 1/lambda = 5", color: "#ffb454", points: [[5, 0], [5, 0.0736]] }
      ],
      interpret: "<b>Tallest at x=0 and always decaying: short waits are common, long waits rare.</b> The curve starts at f(0)=lambda=0.2 and shrinks by a constant factor each minute. The mean wait (orange) is 1/lambda = 5, and notice it sits to the <b>right</b> of where most mass is — the long tail drags the average up past the bulk. Unlike the Uniform, density is never flat; it is monotonically falling."
    },
    {
      type: "line",
      title: "Exponential CDF F(x) = 1 - e^(-lambda x), lambda=0.2, F(mean)=1-1/e=0.632",
      xlabel: "x (minutes)",
      ylabel: "P(X <= x)",
      series: [
        { name: "F(x) = 1 - e^(-0.2x)", color: "#c89bff", points: [[0, 0], [1, 0.1813], [2, 0.3297], [3, 0.4512], [4, 0.5507], [5, 0.6321], [6, 0.6988], [7, 0.7534], [8, 0.7981], [10, 0.8647], [12, 0.9093], [14, 0.9392], [16, 0.9592], [18, 0.9727], [20, 0.9817], [24, 0.9918], [30, 0.9975]] },
        { name: "limit = 1", color: "#9aa7b4", points: [[0, 1], [30, 1]] },
        { name: "mean = 5 -> F = 0.632", color: "#ffb454", points: [[5, 0], [5, 0.6321]] }
      ],
      interpret: "<b>Read F(x) as the chance the wait is done by minute x.</b> It rises fastest early (where the PDF is tallest) and crawls toward 1 without ever reaching it. At the mean x=5, F=1-e^(-1)=0.632, so about <b>63% of waits finish within one mean wait</b> — a handy rule for any exponential. The grey line at 1 is the ceiling all CDFs approach."
    },
    {
      type: "bars",
      title: "Memoryless: P(X>5) = P(X>8 | X>3) = e^(-1) = 0.368 (lambda=0.2)",
      labels: ["P(X>5) fresh", "P(X>8)", "P(X>3)", "P(X>8|X>3)=P(X>8)/P(X>3)"],
      values: [0.3679, 0.2019, 0.5488, 0.3679],
      valueLabels: ["0.368", "0.202", "0.549", "0.368"],
      colors: ["#7ee787", "#9aa7b4", "#9aa7b4", "#7ee787"],
      interpret: "<b>The two green bars are equal — that is the whole point.</b> A fresh wait of 5 more minutes has chance P(X>5)=e^(-1)=0.368. Having already waited 3 minutes, the chance of 5 more is P(X>8|X>3)=0.202/0.549=0.368 — identical. <b>The past 3 minutes bought you nothing</b>; the exponential forgets how long you've waited. The two grey bars are just the raw survival numbers being divided."
    },
    {
      type: "bars",
      title: "Variant — NOT memoryless (e.g. component aging): conditional risk rises with time waited",
      labels: ["P(X>5) fresh", "P(X>10 | X>5)", "P(X>15 | X>10)"],
      values: [0.78, 0.55, 0.30],
      valueLabels: ["~0.78", "~0.55", "~0.30"],
      colors: ["#7ee787", "#ffb454", "#ff7b72"],
      interpret: "<b>Illustrative — how to recognise a distribution that does have memory.</b> For an aging part (a Weibull-style lifetime), the chance of surviving another 5 units <b>shrinks</b> the longer it has already run: 0.78 then 0.55 then 0.30. Falling green-to-red bars mean 'older = more likely to fail soon'. If you ever compute these conditional survivals and they are NOT all equal, the process is not exponential."
    },
    {
      type: "line",
      title: "Variant — lambda controls the decay: bigger lambda = faster events, shorter mean",
      xlabel: "x (minutes)",
      ylabel: "density f(x)",
      series: [
        { name: "lambda=0.2 (mean 5, slow)", color: "#4ea1ff", points: [[0,0.2],[1,0.164],[2,0.134],[4,0.090],[6,0.060],[8,0.040],[10,0.027],[14,0.012],[20,0.004]] },
        { name: "lambda=0.5 (mean 2, fast)", color: "#ff7b72", points: [[0,0.5],[1,0.303],[2,0.184],[4,0.068],[6,0.025],[8,0.009],[10,0.003],[14,0.0005],[20,0.00002]] }
      ],
      interpret: "<b>Illustrative — same shape, different rate.</b> Raising lambda lifts the starting height f(0)=lambda and makes the curve plunge faster, pulling the mean 1/lambda inward (red mean 2 vs blue mean 5). A steeper exponential means events arrive sooner and long waits are even rarer. Reading two exponentials together: the one that starts higher always has the shorter average wait."
    }
  ],
  caption: "Charts 1 to 4 are the core: the flat Uniform pdf (height 0.1, mean at midpoint 5), the decaying Exponential pdf (starts at lambda=0.2, mean 5), its CDF 1-e^(-0.2x) hitting 0.632 at the mean, and memorylessness shown numerically (both greens = e^(-1)=0.368). The last two are variants: an aging (non-memoryless) lifetime whose conditional survival falls over time, and how lambda sets the decay rate and mean.",
  code: `import numpy as np

# (1) Uniform(a=0, b=10): flat pdf = 1/(b-a), mean = (a+b)/2
a, b = 0, 10
uni_h = 1.0 / (b - a)            # 0.1
uni_mean = (a + b) / 2           # 5.0
print("uniform height:", uni_h, " mean:", uni_mean, " area:", uni_h * (b - a))

# (2) Exponential(lambda=0.2): pdf = lam*e^(-lam x), mean = 1/lam
lam = 0.2
x = np.arange(0, 31)
exp_pdf = lam * np.exp(-lam * x)         # starts at lam=0.2, decays
exp_mean = 1.0 / lam                     # 5.0
print("exp pdf[:6]:", np.round(exp_pdf[:6], 4), " mean:", exp_mean)

# (3) Exponential CDF = 1 - e^(-lam x); value at the mean
exp_cdf = 1 - np.exp(-lam * x)
print("F(mean) = 1 - e^-1 =", round(1 - np.exp(-1), 4))   # 0.6321

# (4) Memorylessness: survival P(X>t) = e^(-lam t)
surv = lambda t: np.exp(-lam * t)
fresh = surv(5)                          # P(X>5)
cond  = surv(8) / surv(3)                # P(X>8 | X>3)
print("P(X>5) =", round(fresh, 4))       # 0.3679
print("P(X>8|X>3) =", round(cond, 4))    # 0.3679  -> identical (memoryless)
`
};

window.CODEVIZ["prob-normal"] = {
  question: "What does the bell curve actually look like, where does the 68-95-99.7 rule come from, and how do you spot data that ISN'T normal?",
  charts: [
    {
      type: "line",
      title: "Normal PDF: f(x) = 1/(sigma*sqrt(2*pi)) * e^(-1/2*((x-mu)/sigma)^2), mu=170",
      xlabel: "height x (cm)",
      ylabel: "density f(x)",
      series: [
        {
          name: "sigma=10 (tight)",
          color: "#4ea1ff",
          points: [[125,0.000002],[126.14,0.000003],[127.28,0.000004],[128.42,0.000007],[129.56,0.000011],[130.7,0.000018],[131.84,0.000027],[132.97,0.000042],[134.11,0.000064],[135.25,0.000095],[136.39,0.000141],[137.53,0.000205],[138.67,0.000295],[139.81,0.000419],[140.95,0.000587],[142.09,0.000811],[143.23,0.001108],[144.37,0.001493],[145.51,0.001987],[146.65,0.002609],[147.78,0.003383],[148.92,0.004329],[150.06,0.005468],[151.2,0.006818],[152.34,0.008391],[153.48,0.010194],[154.62,0.012226],[155.76,0.014473],[156.9,0.016912],[158.04,0.019507],[159.18,0.022211],[160.32,0.024963],[161.46,0.027694],[162.59,0.030328],[163.73,0.032784],[164.87,0.034982],[166.01,0.036846],[167.15,0.038309],[168.29,0.039316],[169.43,0.03983],[170.57,0.03983],[171.71,0.039316],[172.85,0.038309],[173.99,0.036846],[175.13,0.034982],[176.27,0.032784],[177.41,0.030328],[178.54,0.027694],[179.68,0.024963],[180.82,0.022211],[181.96,0.019507],[183.1,0.016912],[184.24,0.014473],[185.38,0.012226],[186.52,0.010194],[187.66,0.008391],[188.8,0.006818],[189.94,0.005468],[191.08,0.004329],[192.22,0.003383],[193.35,0.002609],[194.49,0.001987],[195.63,0.001493],[196.77,0.001108],[197.91,0.000811],[199.05,0.000587],[200.19,0.000419],[201.33,0.000295],[202.47,0.000205],[203.61,0.000141],[204.75,0.000095],[205.89,0.000064],[207.03,0.000042],[208.16,0.000027],[209.3,0.000018],[210.44,0.000011],[211.58,0.000007],[212.72,0.000004],[213.86,0.000003],[215,0.000002]]
        },
        {
          name: "sigma=15 (wider, shorter)",
          color: "#ffb454",
          points: [[125,0.000295],[126.14,0.00037],[127.28,0.000461],[128.42,0.00057],[129.56,0.000702],[130.7,0.000859],[131.84,0.001045],[132.97,0.001264],[134.11,0.00152],[135.25,0.001818],[136.39,0.002162],[137.53,0.002555],[138.67,0.003003],[139.81,0.003509],[140.95,0.004077],[142.09,0.004709],[143.23,0.005409],[144.37,0.006176],[145.51,0.007012],[146.65,0.007915],[147.78,0.008882],[148.92,0.009911],[150.06,0.010996],[151.2,0.012128],[152.34,0.013301],[153.48,0.014503],[154.62,0.015723],[155.76,0.016947],[156.9,0.018162],[158.04,0.019352],[159.18,0.020501],[160.32,0.021593],[161.46,0.022613],[162.59,0.023545],[163.73,0.024374],[164.87,0.025087],[166.01,0.025673],[167.15,0.026121],[168.29,0.026424],[169.43,0.026577],[170.57,0.026577],[171.71,0.026424],[172.85,0.026121],[173.99,0.025673],[175.13,0.025087],[176.27,0.024374],[177.41,0.023545],[178.54,0.022613],[179.68,0.021593],[180.82,0.020501],[181.96,0.019352],[183.1,0.018162],[184.24,0.016947],[185.38,0.015723],[186.52,0.014503],[187.66,0.013301],[188.8,0.012128],[189.94,0.010996],[191.08,0.009911],[192.22,0.008882],[193.35,0.007915],[194.49,0.007012],[195.63,0.006176],[196.77,0.005409],[197.91,0.004709],[199.05,0.004077],[200.19,0.003509],[201.33,0.003003],[202.47,0.002555],[203.61,0.002162],[204.75,0.001818],[205.89,0.00152],[207.03,0.001264],[208.16,0.001045],[209.3,0.000859],[210.44,0.000702],[211.58,0.00057],[212.72,0.000461],[213.86,0.00037],[215,0.000295]]
        }
      ],
      interpret: "The x-axis is the value (here a height in cm) and the y-axis is <b>density</b> -- a height on the curve, not a probability. Read the bell shape: it peaks at the mean mu=170 and falls off symmetrically on both sides. Compare the two curves: a smaller sigma (blue) gives a tall, narrow bell; a larger sigma (orange) spreads the same total area of 1 into a wider, shorter bell. Conclude: mu sets where the peak sits, sigma sets how wide and short it is."
    },
    {
      type: "bars",
      title: "68-95-99.7 rule: probability mass within k*sigma of mu (mu=170, sigma=10)",
      labels: ["within +/-1 sigma (160-180)", "within +/-2 sigma (150-190)", "within +/-3 sigma (140-200)"],
      values: [0.68269, 0.95450, 0.99730],
      valueLabels: ["0.683", "0.954", "0.997"],
      colors: ["#7ee787", "#ffb454", "#c89bff"],
      interpret: "Each bar is the <b>area</b> under the bell within a window of mu plus-or-minus k standard deviations -- that area is the probability of landing in that window. Read it as: about 68% of values fall within 1 sigma of the mean, about 95% within 2 sigma, about 99.7% within 3 sigma. Conclude: anything beyond 3 sigma is very rare (under 0.3%), which is why a 3-sigma event counts as a strong outlier."
    },
    {
      type: "line",
      title: "VARIANT -- Right-skewed (illustrative): long tail to the right, mean dragged past the peak",
      xlabel: "value x",
      ylabel: "density f(x)",
      series: [
        {
          name: "right-skewed density",
          color: "#ff7b72",
          points: [[0,0.0],[0.5,0.18],[1,0.34],[1.5,0.40],[2,0.36],[2.5,0.29],[3,0.22],[3.5,0.16],[4,0.115],[4.5,0.083],[5,0.06],[5.5,0.043],[6,0.031],[6.5,0.022],[7,0.016],[7.5,0.011],[8,0.008],[8.5,0.006],[9,0.004],[9.5,0.003],[10,0.002]]
        }
      ],
      interpret: "Illustrative shape. The bump leans left and a long thin tail stretches to the right -- this is <b>right (positive) skew</b>, common for incomes, wait times, or counts. Read it: the peak (most-common value) sits to the LEFT of the mean, because the long right tail drags the average up. Conclude: the 68-95-99.7 rule does NOT hold here; a normal model would under-predict big values, so consider a log transform or a skewed distribution."
    },
    {
      type: "line",
      title: "VARIANT -- Heavy tails (illustrative): same peak as normal but fatter ends, more outliers",
      xlabel: "value x",
      ylabel: "density f(x)",
      series: [
        {
          name: "normal (reference)",
          color: "#4ea1ff",
          points: [[-5,0.0001],[-4,0.0001],[-3,0.0044],[-2,0.054],[-1.5,0.13],[-1,0.242],[-0.5,0.352],[0,0.399],[0.5,0.352],[1,0.242],[1.5,0.13],[2,0.054],[3,0.0044],[4,0.0001],[5,0.0001]]
        },
        {
          name: "heavy-tailed",
          color: "#ff7b72",
          points: [[-5,0.012],[-4,0.018],[-3,0.031],[-2,0.064],[-1.5,0.10],[-1,0.16],[-0.5,0.24],[0,0.30],[0.5,0.24],[1,0.16],[1.5,0.10],[2,0.064],[3,0.031],[4,0.018],[5,0.012]]
        }
      ],
      interpret: "Illustrative. Both curves peak in the middle, but the red one is <b>lower at the center and noticeably thicker at the far edges</b> -- heavy (fat) tails. Read the ends: at x = plus-or-minus 4 the red density is far above the blue, so extreme values are much more likely than a normal would say. Conclude: under heavy tails, '3-sigma' events stop being rare; this is the classic trap behind underestimated financial or failure risk."
    },
    {
      type: "line",
      title: "VARIANT -- Bimodal (illustrative): two peaks, so a single bell is the wrong model",
      xlabel: "value x",
      ylabel: "density f(x)",
      series: [
        {
          name: "bimodal density (two subgroups)",
          color: "#c89bff",
          points: [[140,0.0],[145,0.006],[150,0.022],[155,0.040],[158,0.046],[160,0.044],[163,0.030],[166,0.018],[169,0.014],[172,0.018],[175,0.030],[178,0.044],[180,0.046],[183,0.040],[186,0.024],[190,0.008],[195,0.0]]
        }
      ],
      interpret: "Illustrative. There are <b>two separate humps</b> instead of one -- a sign the data is really a mix of two subgroups (for example two populations pooled together). Read it: the dip in the middle is NOT the typical value; the typical values are the two peaks. Conclude: reporting one mean and sigma would describe a point almost no one occupies; split the data by the hidden group before modeling each as normal."
    }
  ],
  caption: "Chart 1 is the normal PDF, evaluated at 80 heights from 125 to 215 cm: mu sets the peak location and sigma sets the width. Chart 2 turns area under that bell into the 68-95-99.7 rule. The last three are shapes you actually meet when a 'normal' assumption is wrong -- right skew (long tail drags the mean), heavy tails (extreme outliers far more likely than a bell predicts), and bimodality (two hidden subgroups). Each variant is illustrative but qualitatively honest.",
  code: `import numpy as np
mu, sigma = 170.0, 10.0
def pdf(x, mu, sg):
    return 1.0/(sg*np.sqrt(2*np.pi)) * np.exp(-0.5*((x-mu)/sg)**2)

# Chart 1: evaluate the PDF at 80 x points, for sigma=10 and sigma=15
x = np.linspace(125, 215, 80)
curve_tight = pdf(x, mu, 10.0)   # peak ~0.0398 at x=mu
curve_wide  = pdf(x, mu, 15.0)   # peak ~0.0266 -> wider, shorter

# Chart 2: cumulative mass within k*sigma via numeric integration (Simpson)
def mass_within(k, sg):
    xs = np.linspace(mu-k*sg, mu+k*sg, 2001)
    ys = pdf(xs, mu, sg)
    h = xs[1]-xs[0]
    return h/3 * (ys[0] + ys[-1] + 4*ys[1:-1:2].sum() + 2*ys[2:-2:2].sum())

masses = [mass_within(k, 10.0) for k in (1, 2, 3)]
print(masses)  # ~[0.68269, 0.95450, 0.99730]`
};

window.CODEVIZ["prob-joint-marginal"] = {
  question: "Mood and weather vary together. How do you pull one variable back out of the joint table -- and how do you tell from the table whether they're independent?",
  charts: [
    {
      type: "heatmap",
      title: "Joint PMF p(x,y): the 2x2 table, four cells add to 1",
      rows: ["Happy", "Sad"],
      cols: ["Sunny", "Rainy"],
      matrix: [
        [0.4, 0.1],
        [0.2, 0.3]
      ],
      showVals: true,
      interpret: "Each cell is the probability of one (mood, weather) combination, so this whole grid is the <b>joint</b> distribution. Read a single cell: p(Happy, Sunny)=0.40 means 40% of days are both happy and sunny. Check validity by adding all four cells -- they sum to 1. Conclude: the joint table holds the full picture; the marginals and conditionals below are all derived from it."
    },
    {
      type: "bars",
      title: "Marginal p_X(x) = sum over y p(x,y): collapse each row to its sum",
      labels: ["p_X(Happy) = 0.4 + 0.1", "p_X(Sad) = 0.2 + 0.3"],
      values: [0.5, 0.5],
      valueLabels: ["0.50", "0.50"],
      colors: ["#4ea1ff", "#4ea1ff"],
      interpret: "To get the <b>marginal</b> of mood, sum across the weather you no longer care about -- add each row of the joint table. Read it: Happy = 0.4+0.1 = 0.5, Sad = 0.2+0.3 = 0.5, so mood is a 50/50 split once weather is ignored. Conclude: 'marginalizing' just means summing out the other variable; the bars still sum to 1 because you redistributed, not lost, probability."
    },
    {
      type: "bars",
      title: "Conditional p(x|Sunny) = p(x,Sunny) / p_Y(Sunny), Sunny column rescaled to sum 1",
      labels: ["p(Happy,Sunny)=0.4", "p(Sad,Sunny)=0.2", "p(Happy|Sunny)=0.4/0.6", "p(Sad|Sunny)=0.2/0.6"],
      values: [0.4, 0.2, 0.6667, 0.3333],
      valueLabels: ["0.40 joint", "0.20 joint", "0.667 cond", "0.333 cond"],
      colors: ["#9aa7b4", "#9aa7b4", "#ffb454", "#ffb454"],
      interpret: "Conditioning on Sunny means 'keep only the Sunny column, then rescale it to sum to 1'. The grey bars are the raw joint cells in that column (0.4 and 0.2, total 0.6); dividing each by 0.6 gives the orange <b>conditional</b> bars 0.667 and 0.333. Read it: given it's sunny, you're happy two-thirds of the time. Conclude: conditioning re-normalizes one slice of the joint into its own valid distribution."
    },
    {
      type: "heatmap",
      title: "VARIANT -- Independent joint: every cell = row marginal * column marginal",
      rows: ["Happy (0.5)", "Sad (0.5)"],
      cols: ["Sunny (0.6)", "Rainy (0.4)"],
      matrix: [
        [0.30, 0.20],
        [0.30, 0.20]
      ],
      showVals: true,
      interpret: "Here mood marginals are 0.5/0.5 and weather marginals 0.6/0.4, and <b>every cell exactly equals the product of its row and column marginal</b> (e.g. 0.5*0.6 = 0.30). Read it: the two rows are identical proportions and so are the columns -- knowing the weather tells you nothing new about mood. Conclude: when the joint factors as p(x,y) = p_X(x) p_Y(y), the variables are <b>independent</b>, and every conditional equals its marginal."
    },
    {
      type: "heatmap",
      title: "VARIANT -- Strong dependence: mass piled on the diagonal (illustrative)",
      rows: ["Happy", "Sad"],
      cols: ["Sunny", "Rainy"],
      matrix: [
        [0.45, 0.05],
        [0.05, 0.45]
      ],
      showVals: true,
      interpret: "Illustrative. Almost all mass sits on the diagonal (Happy-Sunny and Sad-Rainy), with tiny off-diagonal cells. The marginals are still 0.5/0.5 and 0.5/0.5, yet 0.45 is far from the independent product 0.5*0.5 = 0.25. Read it: weather is highly informative -- p(Happy|Sunny) = 0.45/0.50 = 0.90, nothing like the marginal 0.5. Conclude: the bigger the gap between a cell and (row marginal * column marginal), the stronger the dependence."
    }
  ],
  caption: "The heatmap is the joint PMF p(x,y); its four cells sum to 1. Summing each row gives the marginal p_X(x) (chart 2): Happy 0.5, Sad 0.5. Chart 3 fixes Sunny and rescales that column by its total 0.6 to get the conditional p(x|Sunny) = 0.667, 0.333. The two variant tables show the extremes you compare against: an independent joint, where every cell is exactly the product of its marginals (weather tells you nothing), and a strongly dependent joint, where mass concentrates on the diagonal and conditionals swing far from the marginals.",
  code: `import numpy as np

# Joint PMF p(x,y) from the lesson example
#            Sunny  Rainy
# Happy       0.4    0.1
# Sad         0.2    0.3
joint = np.array([[0.4, 0.1],
                  [0.2, 0.3]])
print(joint.sum())                 # 1.0  -> valid PMF (chart 1)

# Marginal p_X(x) = sum over y of p(x,y): sum each row (chart 2)
p_X = joint.sum(axis=1)            # [0.5, 0.5]
print(p_X)                         # Happy=0.4+0.1, Sad=0.2+0.3

# Marginal of Y = sum each column (used as the conditioning denominator)
p_Y = joint.sum(axis=0)            # [0.6, 0.4]  Sunny, Rainy
print(p_Y)

# Conditional p(x | Y=Sunny) = p(x,Sunny) / p_Y(Sunny) (chart 3)
sunny = joint[:, 0]               # [0.4, 0.2]  raw joint cells (grey)
cond_given_sunny = sunny / p_Y[0] # [0.6667, 0.3333]  rescaled (orange)
print(cond_given_sunny, cond_given_sunny.sum())   # sums to 1.0

# Independence check: compare joint vs outer product of marginals
indep = np.outer(p_X, p_Y)        # what the joint WOULD be if independent
print(indep)                      # [[0.30 0.20][0.30 0.20]]
print(np.allclose(joint, indep))  # False here -> mood and weather are dependent
`
};

window.CODEVIZ["prob-covariance-correlation"] = {
  question: "Do two variables move together? Watch Cov split into 'mean of the product' minus 'product of the means', then learn to read rho = +0.9, 0, and -0.9 as point clouds — and spot the two clouds that fool the number.",
  charts: [
    {
      type: "bars",
      title: "Cov(X,Y) = E[XY] - E[X]E[Y], term by term (5 paired observations)",
      labels: ["E[XY]", "E[X]E[Y]", "Cov(X,Y)"],
      values: [15, 12, 3],
      valueLabels: ["15.00", "12.00", "3.00"],
      colors: ["#4ea1ff", "#ffb454", "#7ee787"],
      xlabel: "term of the identity",
      ylabel: "value",
      interpret: "<b>Read each bar as one piece of the covariance recipe.</b> Blue is E[XY], the average of X times Y computed pair by pair (15). Orange is E[X]E[Y], the two means multiplied after the fact (3 times 4 = 12). Green is what is left over, Cov = 15 - 12 = 3. A positive leftover means the product runs hotter than the means alone predict, so X and Y tend to be big together and small together."
    },
    {
      type: "scatter",
      title: "rho = +0.90: cloud rises along the fitted line (Cov=0.84, sigmaX=0.94, sigmaY=0.99)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "rho about +0.90 (rise together)",
          color: "#7ee787",
          points: [[-1.09,-0.79],[-0.55,-0.11],[-0.87,-0.69],[-0.77,-1.42],[-0.34,-0.56],[-0.22,-0.58],[-0.01,-0.42],[0.89,0.51],[0.87,0.55],[1.72,1.07],[0.74,0.05],[-0.94,-1.02],[0.47,-0.14],[0.02,0.24],[1.56,0.89],[2.37,2.66],[0.4,0.02],[2.1,1.89],[-0.35,-0.38],[-0.09,-0.81],[-0.4,-0.42],[1.2,0.69],[-0.51,0.66],[0.19,-0.28],[1.09,0.48],[-1.05,-1.3],[0.14,-0.39],[2.63,3.5],[0.09,-0.04],[0.6,1.12],[-0.21,-0.45],[0.01,0.27],[-0.29,-0.5],[-0.18,-0.12],[-0.22,0.3],[-1.27,-1.23],[1.77,1.9],[0.42,0.46],[0.34,0.44],[0.57,0.19],[-0.22,-0.33],[1.31,0.89],[-0.54,0.15],[0.84,1.15],[-0.88,-1.03]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: true, points: [[-1.27,-1.29],[2.63,2.42]] }
      ],
      interpret: "<b>Strong positive correlation.</b> Each dot is one paired observation; X runs left-to-right, Y bottom-to-top. The dots hug the upward orange fit line tightly, so knowing X tells you a lot about Y. rho near +0.9 means the relationship is both upward-sloping (positive) and tight (close to the line). The remaining scatter around the line is the part of Y that X does not explain."
    },
    {
      type: "scatter",
      title: "rho = 0.00: round cloud, fitted line is flat (Cov=0.00, no linear link)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "rho about 0.00 (no linear link)",
          color: "#9aa7b4",
          points: [[0.32,-0.35],[1.48,-0.87],[0.32,-1.29],[1.49,0.61],[0.33,-0.48],[0.35,-0.57],[-0.6,0.49],[2.06,-0.4],[-0.14,0.3],[-0.57,1.51],[0.43,0.41],[0.59,0.28],[-0.76,-0.71],[0.14,1.76],[0.21,0.51],[0.44,0.51],[0.97,0.41],[1.17,-1.49],[-0.24,1.31],[0.67,-0.35],[-0.28,0.86],[-0.28,-0.31],[-1.1,-0.09],[1.04,0.25],[-1.77,-0.79],[0.82,1.33],[-1.05,1.08],[0.37,-2.21],[0.1,0.85],[0.04,0.03],[-1.48,-0.8],[-0.53,0.36],[-0.74,-1.35],[0.46,0.09],[-0.54,-0.21],[-0.37,0.47],[1.41,-1.32],[0.78,0.63],[0.74,0.22],[-2.7,-1.8],[0.78,0.26],[0.57,-1.2],[-0.86,1.11],[0.15,0.04],[-1.12,1.16]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: true, points: [[-2.7,0.01],[2.06,0.01]] }
      ],
      interpret: "<b>No linear link.</b> The cloud is roughly round with no tilt, and the orange fit line is flat. rho near 0 and Cov near 0 mean that, on average, Y neither rises nor falls as X grows. Knowing X tells you almost nothing about Y here. (Caution: rho = 0 only rules out a straight-line trend — the next chart shows a cloud with rho = 0 that is anything but unrelated.)"
    },
    {
      type: "scatter",
      title: "rho = -0.90: cloud falls along the fitted line (Cov=-1.06, sigmaX=1.03, sigmaY=1.14)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "rho about -0.90 (move oppositely)",
          color: "#ff7b72",
          points: [[0.96,-1.16],[0.07,0.03],[0.87,-1.8],[-0.24,0.06],[-0.32,0.6],[0.22,0.66],[1.26,-0.96],[-1.29,1.26],[1.69,-1.78],[0.76,-0.64],[-0.41,-0.42],[0.47,-0.87],[0.04,0.16],[-1.78,2.23],[-0.9,0.65],[-2.07,2.24],[-1.8,1.02],[-2.19,2.77],[-0.59,0.43],[0.91,-1.18],[0.48,-0.48],[0.37,-0.23],[-0.26,0.3],[1.36,-2.57],[-1.13,0.93],[-0.82,-0.17],[0.49,-0.43],[-1.05,0.46],[0.37,-0.3],[0.45,-0.19],[0.89,-0.06],[0.52,-0.9],[-0.17,-0.36],[-0.63,1.27],[0.55,-1.28],[1.92,-1.96],[0.07,-0.32],[-1.8,1.44],[0.18,-0.71],[-1.08,1.0],[1.57,-1.25],[1.63,-1.23],[0.03,1.01],[0.59,-0.3],[-0.54,0.94]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: true, points: [[-2.19,2.12],[1.92,-1.96]] }
      ],
      interpret: "<b>Strong negative correlation.</b> The dots fall as you move right, tracking the downward orange fit line, so big X goes with small Y. rho near -0.9 means tight and opposite: same strength as the +0.9 case, just mirrored. Cov is negative because high-X points pull the product term below the product of the means."
    },
    {
      type: "scatter",
      title: "VARIANT - U-shape with rho = 0: strong relationship the number misses (illustrative)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "Y = X^2 (perfectly dependent, yet rho ~ 0)",
          color: "#c89bff",
          points: [[-2.0,4.0],[-1.7,2.89],[-1.5,2.25],[-1.2,1.44],[-1.0,1.0],[-0.8,0.64],[-0.6,0.36],[-0.4,0.16],[-0.2,0.04],[0.0,0.0],[0.2,0.04],[0.4,0.16],[0.6,0.36],[0.8,0.64],[1.0,1.0],[1.2,1.44],[1.5,2.25],[1.7,2.89],[2.0,4.0]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: true, points: [[-2.0,1.49],[2.0,1.49]] }
      ],
      interpret: "<b>Illustrative trap: rho = 0 does NOT mean unrelated.</b> Here Y is exactly X squared, so Y is fully determined by X, yet the upward half and downward half cancel and the orange fit line is flat (rho near 0). How to recognise it: a clear non-straight pattern (a U, an arc, a wave) paired with a near-zero correlation. Lesson: correlation only measures the STRAIGHT-LINE part of a relationship; always look at the scatter before trusting rho = 0."
    },
    {
      type: "scatter",
      title: "VARIANT - one outlier fakes rho ~ +0.8 from an uncorrelated blob (illustrative)",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        {
          name: "uncorrelated blob",
          color: "#9aa7b4",
          points: [[-0.4,0.3],[0.2,-0.5],[-0.6,0.1],[0.5,0.4],[-0.2,-0.3],[0.3,0.2],[-0.5,-0.2],[0.1,0.5],[0.4,-0.4],[-0.3,0.0],[0.0,0.3],[0.6,-0.2],[-0.1,-0.4],[0.2,0.1],[-0.4,-0.1]]
        },
        {
          name: "single far outlier",
          color: "#ff7b72",
          points: [[8.0,8.5]]
        }
      ],
      lines: [
        { color: "#ffb454", dash: true, points: [[-0.6,-0.4],[8.0,7.6]] }
      ],
      interpret: "<b>Illustrative trap: one point drives the whole correlation.</b> The grey blob on the left has no real trend, but the lone red point far out at (8, 8.5) yanks the orange fit line up and pushes rho to about +0.8. How to recognise it: a high correlation that visibly rests on one or two extreme points instead of a body of dots following the line. Lesson: rho is not robust — re-check it with the outlier removed before believing the relationship."
    }
  ],
  caption: "Chart 1 splits the covariance identity for 5 paired points: E[XY]=15 minus E[X]E[Y]=12 leaves Cov=3, so they move together. Charts 2-4 show rho = Cov/(sigmaX*sigmaY) at about +0.9 (tight upward cloud), 0 (round, flat line), and -0.9 (tight downward cloud); every printed rho, Cov and sigma is exact for the plotted points. Charts 5-6 are illustrative traps: a U-shape with rho=0 that is fully dependent, and a single outlier that fakes a strong correlation from noise.",
  code: `import numpy as np

# --- Chart 1: Cov = E[XY] - E[X]E[Y], from 5 equally-likely paired points ---
X = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
Y = np.array([2.0, 1.0, 5.0, 4.0, 8.0])
EX, EY, EXY = X.mean(), Y.mean(), (X*Y).mean()   # 3, 4, 15
cov = EXY - EX*EY                                # 15 - 12 = 3
print("E[XY]", EXY, "E[X]E[Y]", EX*EY, "Cov", cov)

# --- Charts 2-4: scatter clouds at rho ~ +0.9, 0, -0.9 (fixed seed, reproducible) ---
def lcg(seed):
    s = [seed & 0xffffffff]
    def nxt():
        s[0] = (1103515245*s[0] + 12345) & 0xffffffff
        return s[0]/4294967296
    return nxt
def gauss(rng):
    u = max(1e-9, rng()); v = rng()
    return (-2*np.log(u))**0.5 * np.cos(2*np.pi*v)

def make(seed, r, n=45):
    rng = lcg(seed); xs = []; ys = []
    for _ in range(n):
        x = gauss(rng); e = gauss(rng)
        y = r*x + (1 - r*r)**0.5 * e     # this y has correlation ~ r with x
        xs.append(round(x, 2)); ys.append(round(y, 2))
    return np.array(xs), np.array(ys)

for name, seed, r in [("pos", 223, 0.9), ("zero", 50, 0.0), ("neg", 32, -0.9)]:
    xs, ys = make(seed, r)
    cov = ((xs - xs.mean())*(ys - ys.mean())).mean()
    rho = cov / (xs.std()*ys.std())              # = np.corrcoef(xs, ys)[0,1]
    print(name, "rho", round(rho, 3), "Cov", round(cov, 3))

# --- Chart 5: rho ~ 0 yet fully dependent (Y = X^2) ---
xs = np.linspace(-2, 2, 19); ys = xs**2
print("U-shape rho", round(np.corrcoef(xs, ys)[0,1], 3))   # ~ 0, but Y depends on X!`
};

window.CODEVIZ["prob-conditional-expectation"] = {
  question: "From a fixed joint table of (X, Y), what is the average of X inside each Y-group, and do those group-averages weight back up to the overall mean E[X]? Then: what do the bars look like when Y is useless, and when Y is decisive?",
  charts: [
    {
      type: "bars",
      title: "E[X|Y=y]: the conditional mean of X for each y (group-by average)",
      labels: ["E[X|Y=1]", "E[X|Y=2]", "E[X|Y=3]", "E[X] overall"],
      values: [0.75, 1.1667, 1.5, 1.25],
      valueLabels: ["0.750", "1.167", "1.500", "1.250"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#4ea1ff"],
      xlabel: "which group / overall",
      ylabel: "average of X",
      interpret: "<b>Each grey bar is the average of X inside one Y-group.</b> Filter to Y=1 and X averages 0.75; filter to Y=2 it is 1.167; filter to Y=3 it is 1.50. The blue bar is the overall mean E[X]=1.25, ignoring Y. Because the grey bars climb as Y goes 1 to 3, knowing Y shifts your best guess of X up or down from the blue baseline — that shift IS the information Y carries about X."
    },
    {
      type: "bars",
      title: "Tower property: E[X] = sum over y of E[X|y]*P(y), term by term",
      labels: ["E[X|1]*P(1)", "E[X|2]*P(2)", "E[X|3]*P(3)", "sum = E[X]"],
      values: [0.15, 0.35, 0.75, 1.25],
      valueLabels: ["0.150", "0.350", "0.750", "1.250"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#7ee787"],
      xlabel: "weighted group contribution",
      ylabel: "contribution to E[X]",
      interpret: "<b>The conditional means weight back up to the overall mean.</b> Each orange bar is one group's mean times how likely that group is: E[X|Y=y] times P(Y=y), with P(Y)=0.2, 0.3, 0.5. Adding the orange bars (0.15+0.35+0.75) gives the green bar 1.25, which equals E[X]. This is the law of iterated expectations E[E[X|Y]]=E[X]: averaging the group-averages, weighted by group size, recovers the grand average."
    },
    {
      type: "scatter",
      title: "Conditional mean as a curve: E[X|Y] is the regression of X on Y (illustrative)",
      xlabel: "Y (the group we condition on)",
      ylabel: "X",
      groups: [
        {
          name: "raw (Y, X) observations",
          color: "#9aa7b4",
          points: [[1,0.0],[1,1.0],[1,2.0],[1,0.0],[2,0.0],[2,1.0],[2,2.0],[2,1.0],[2,2.0],[2,1.0],[3,0.0],[3,2.0],[3,2.0],[3,1.0],[3,2.0],[3,2.0]]
        },
        {
          name: "E[X|Y=y] (group means)",
          color: "#4ea1ff",
          points: [[1,0.75],[2,1.1667],[3,1.5]]
        }
      ],
      lines: [
        { color: "#4ea1ff", dash: false, points: [[1,0.75],[2,1.1667],[3,1.5]] }
      ],
      interpret: "<b>The blue line connects the same three group-means, now as a function of Y.</b> Grey dots are raw (Y, X) pairs scattered within each Y column; the blue dots/line sit at the average X of each column. Reading right, the line trends up, which is exactly why E[X|Y] is informative here. This is illustrative, but the three blue heights (0.75, 1.167, 1.50) are the real conditional means from the joint table."
    },
    {
      type: "bars",
      title: "VARIANT - Y is uninformative: all conditional means equal E[X] (illustrative)",
      labels: ["E[X|Y=1]", "E[X|Y=2]", "E[X|Y=3]", "E[X] overall"],
      values: [1.25, 1.25, 1.25, 1.25],
      valueLabels: ["1.250", "1.250", "1.250", "1.250"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#4ea1ff"],
      xlabel: "which group / overall",
      ylabel: "average of X",
      interpret: "<b>Flat bars mean Y tells you nothing about X.</b> When every group-average equals the blue overall mean, conditioning on Y does not move your guess: E[X|Y=y]=E[X] for all y. How to recognise it: the grey bars are level with each other and with blue. This is the signature of X and Y being mean-independent (it always holds when they are statistically independent). The tower property still works, but trivially."
    },
    {
      type: "bars",
      title: "VARIANT - Y is decisive: conditional means spread far apart (illustrative)",
      labels: ["E[X|Y=1]", "E[X|Y=2]", "E[X|Y=3]", "E[X] overall"],
      values: [0.1, 1.25, 2.4, 1.25],
      valueLabels: ["0.100", "1.250", "2.400", "1.250"],
      colors: ["#7ee787", "#9aa7b4", "#ff7b72", "#4ea1ff"],
      xlabel: "which group / overall",
      ylabel: "average of X",
      interpret: "<b>Widely-spread bars mean Y is highly informative about X.</b> Here the group-averages swing from 0.1 (Y=1) up to 2.4 (Y=3), far from the blue overall mean of 1.25. How to recognise it: tall and short grey bars straddling the blue line. The further the conditional means sit from E[X], the more variance in X that Y explains — the strong-dependence end of the same spectrum the flat-bars chart shows the weak end of."
    }
  ],
  caption: "Chart 1: grey bars are the average of X within each Y-group (0.75, 1.167, 1.500); blue is the overall mean E[X]=1.25. Chart 2: weighting each group-mean by P(Y=y)=0.2, 0.3, 0.5 gives the orange terms that sum (green) exactly to 1.25 - the law of iterated expectations. Chart 3 plots those same group-means as the regression curve E[X|Y]. Charts 4-5 are illustrative contrasts: flat bars when Y is uninformative, far-spread bars when Y is decisive.",
  code: `import numpy as np

# Concrete joint table P(X=x, Y=y); X in {0,1,2}, Y in {1,2,3}.
# Rows = y, columns = x. Sums to 1.
X = np.array([0, 1, 2])
joint = np.array([
    [0.10, 0.05, 0.05],   # P(Y=1, X=*)  -> P(Y=1)=0.20
    [0.05, 0.15, 0.10],   # P(Y=2, X=*)  -> P(Y=2)=0.30
    [0.05, 0.15, 0.30],   # P(Y=3, X=*)  -> P(Y=3)=0.50
])
assert abs(joint.sum() - 1.0) < 1e-9

# Marginal P(Y=y) = row sums.
pY = joint.sum(axis=1)                      # [0.20, 0.30, 0.50]

# Conditional mean E[X|Y=y] = sum_x x*P(X=x,Y=y) / P(Y=y).
E_X_given_y = (joint * X).sum(axis=1) / pY  # [0.75, 1.1667, 1.50]

# Tower / law of total expectation: weight each by P(Y=y).
terms = E_X_given_y * pY                     # [0.15, 0.35, 0.75]
EX_tower = terms.sum()                       # 1.25

# Cross-check against the direct mean E[X] = sum_x x*P(X=x).
pX = joint.sum(axis=0)                        # marginal of X
EX_direct = (X * pX).sum()                    # 1.25
assert abs(EX_tower - EX_direct) < 1e-9

print(E_X_given_y, terms, EX_tower)`
};

window.CODEVIZ["prob-inequalities"] = {
  question: "How far above the true tail does each inequality's bound sit — and what does the gap tell you?",
  charts: [
    {
      type: "line",
      title: "Markov bound vs true tail (Exponential, mean 50)",
      xlabel: "a (threshold)",
      ylabel: "probability",
      series: [
        {
          name: "Markov bound E[X]/a",
          color: "#4ea1ff",
          points: [[10,1.0000],[15,1.0000],[20,1.0000],[25,1.0000],[30,1.0000],[35,1.0000],[40,1.0000],[45,1.0000],[50,1.0000],[55,0.9091],[60,0.8333],[65,0.7692],[70,0.7143],[75,0.6667],[80,0.6250],[85,0.5882],[90,0.5556],[95,0.5263],[100,0.5000],[105,0.4762],[110,0.4545],[115,0.4348],[120,0.4167],[125,0.4000],[130,0.3846],[135,0.3704],[140,0.3571],[145,0.3448],[150,0.3333],[155,0.3226],[160,0.3125],[165,0.3030],[170,0.2941],[175,0.2857],[180,0.2778],[185,0.2703],[190,0.2632],[195,0.2564],[200,0.2500]]
        },
        {
          name: "true tail P(X>=a) = exp(-a/50)",
          color: "#7ee787",
          points: [[10,0.8187],[15,0.7408],[20,0.6703],[25,0.6065],[30,0.5488],[35,0.4966],[40,0.4493],[45,0.4066],[50,0.3679],[55,0.3329],[60,0.3012],[65,0.2725],[70,0.2466],[75,0.2231],[80,0.2019],[85,0.1827],[90,0.1653],[95,0.1496],[100,0.1353],[105,0.1225],[110,0.1108],[115,0.1003],[120,0.0907],[125,0.0821],[130,0.0743],[135,0.0672],[140,0.0608],[145,0.0550],[150,0.0498],[155,0.0450],[160,0.0408],[165,0.0369],[170,0.0334],[175,0.0302],[180,0.0273],[185,0.0247],[190,0.0224],[195,0.0202],[200,0.0183]]
        }
      ],
      interpret: "The x-axis is the threshold a; the y-axis is probability. Blue is the Markov promise P(X>=a) <= mean/a; green is the actual tail for this Exponential. <b>Blue always sits on or above green</b> — that is what 'a valid upper bound' looks like. Notice the bound never exceeds 1 (it is capped) and the two curves spread apart as a grows: the guarantee is real but increasingly loose."
    },
    {
      type: "line",
      title: "Chebyshev bound vs true tail (Normal, mu=50 sigma=10)",
      xlabel: "k (how many sigma away)",
      ylabel: "probability",
      series: [
        {
          name: "Chebyshev bound 1/k^2",
          color: "#4ea1ff",
          points: [[0.5,1.0000],[0.6,1.0000],[0.7,1.0000],[0.8,1.0000],[0.9,1.0000],[1,1.0000],[1.1,0.8264],[1.2,0.6944],[1.3,0.5917],[1.4,0.5102],[1.5,0.4444],[1.6,0.3906],[1.7,0.3460],[1.8,0.3086],[1.9,0.2770],[2,0.2500],[2.1,0.2268],[2.2,0.2066],[2.3,0.1890],[2.4,0.1736],[2.5,0.1600],[2.6,0.1479],[2.7,0.1372],[2.8,0.1276],[2.9,0.1189],[3,0.1111],[3.1,0.1041],[3.2,0.0977],[3.3,0.0918],[3.4,0.0865],[3.5,0.0816],[3.6,0.0772],[3.7,0.0730],[3.8,0.0693],[3.9,0.0657],[4,0.0625]]
        },
        {
          name: "true tail 2(1-Phi(k))",
          color: "#7ee787",
          points: [[0.5,0.6171],[0.6,0.5485],[0.7,0.4839],[0.8,0.4237],[0.9,0.3681],[1,0.3173],[1.1,0.2713],[1.2,0.2301],[1.3,0.1936],[1.4,0.1615],[1.5,0.1336],[1.6,0.1096],[1.7,0.0891],[1.8,0.0719],[1.9,0.0574],[2,0.0455],[2.1,0.0357],[2.2,0.0278],[2.3,0.0214],[2.4,0.0164],[2.5,0.0124],[2.6,0.0093],[2.7,0.0069],[2.8,0.0051],[2.9,0.0037],[3,0.0027],[3.1,0.0019],[3.2,0.0014],[3.3,0.0010],[3.4,0.0007],[3.5,0.0005],[3.6,0.0003],[3.7,0.0002],[3.8,0.0001],[3.9,0.0001],[4,0.0001]]
        }
      ],
      interpret: "Here x is distance from the mean measured in sigmas; y is probability. Blue is Chebyshev's promise 1/k^2; green is the real Normal two-sided tail. At k=2 Chebyshev says 'at most 25%' but the truth is only 4.5% — <b>the bound is loose by roughly 5x</b>. The lesson: Chebyshev works for ANY distribution with finite variance, so it pays for that generality by being far above the true tail."
    },
    {
      type: "bars",
      title: "Markov on a SIGNED variable: bound is meaningless",
      labels: ["true P(X>=a)", "naive 'Markov' E[X]/a", "valid bound"],
      values: [0.30, 0.05, 1.0],
      valueLabels: ["0.30", "0.05 (WRONG)", "1.00"],
      colors: ["#7ee787", "#ff7b72", "#9aa7b4"],
      interpret: "Illustrative. Markov requires X >= 0. If you apply it to a variable that can go negative, the mean can be tiny (or negative) even though the upper tail is large — so the 'bound' (red) comes out BELOW the true probability (green) and is not a bound at all. Recognise this failure when your computed bound is smaller than an event you can already see happening: check the non-negativity assumption first."
    },
    {
      type: "line",
      title: "Chebyshev is TIGHT only at the worst-case (three-point) distribution",
      xlabel: "k (how many sigma away)",
      ylabel: "probability",
      series: [
        {
          name: "Chebyshev bound 1/k^2",
          color: "#4ea1ff",
          points: [[1,1.0],[1.5,0.444],[2,0.25],[2.5,0.16],[3,0.111],[3.5,0.0816],[4,0.0625]]
        },
        {
          name: "true tail of worst-case dist",
          color: "#ffb454",
          points: [[1,1.0],[1.5,0.444],[2,0.25],[2.5,0.16],[3,0.111],[3.5,0.0816],[4,0.0625]]
        }
      ],
      interpret: "Illustrative. There exists a distribution (mass at mu and at mu +/- k*sigma) that puts EXACTLY 1/k^2 of its probability k sigmas out, so orange lands right on top of blue. This is why the bound cannot be improved in general: the gap you saw against a Normal is not slack you can recover without extra assumptions. When someone says Chebyshev is 'tight', they mean tight for this adversarial case, not for your nice data."
    }
  ],
  caption: "Blue lines are the inequality's promised upper bound; the green/orange comparison shows how much room sits between the guarantee and reality. Charts 1-2 are the healthy case (bound above true tail). Charts 3-4 are the cases practitioners trip on: Markov misused on a signed variable (no longer a bound), and the worst-case distribution where Chebyshev is exactly tight.",
  code: `import numpy as np
from scipy.stats import norm

# Markov: nonnegative X, here Exponential with mean mu=50.
mu = 50.0
a = np.arange(10, 201, 5)
markov_bound = np.minimum(1.0, mu / a)        # P(X>=a) <= E[X]/a
markov_tail  = np.exp(-a / mu)                 # exact Exponential tail P(X>=a)

# Chebyshev: X ~ Normal(mu=50, sigma=10); deviation measured in k sigmas.
k = np.arange(0.5, 4.0001, 0.1)
cheb_bound = np.minimum(1.0, 1.0 / k**2)       # P(|X-mu|>=k*sigma) <= 1/k^2
cheb_tail  = 2 * (1 - norm.cdf(k))             # exact Normal two-sided tail

# In both cases bound >= tail everywhere:
assert np.all(markov_bound + 1e-9 >= markov_tail)
assert np.all(cheb_bound + 1e-9 >= cheb_tail)`
};

window.CODEVIZ["prob-lln"] = {
  question: "As you collect more die rolls, how fast does the running average lock onto the true mean 3.5 — and what do the failure cases look like?",
  charts: [
    {
      type: "line",
      title: "LLN: running average converges to mu = 3.5",
      xlabel: "n (number of rolls, log-spaced)",
      ylabel: "running average X-bar_n",
      series: [
        {
          name: "true mean mu = 3.5 (dashed target)",
          color: "#9aa7b4",
          dash: true,
          points: [[1, 3.5], [2, 3.5], [3, 3.5], [5, 3.5], [8, 3.5], [12, 3.5], [20, 3.5], [35, 3.5], [60, 3.5], [100, 3.5], [170, 3.5], [280, 3.5], [450, 3.5], [700, 3.5], [1000, 3.5]]
        },
        {
          name: "mu + sigma/sqrt(n) (typical-error band)",
          color: "#ffb454",
          points: [[1, 5.2078], [2, 4.7076], [3, 4.486], [5, 4.2638], [8, 4.1038], [12, 3.993], [20, 3.8819], [35, 3.7887], [60, 3.7205], [100, 3.6708], [170, 3.631], [280, 3.6021], [450, 3.5805], [700, 3.5645], [1000, 3.554]]
        },
        {
          name: "mu - sigma/sqrt(n) (typical-error band)",
          color: "#ffb454",
          points: [[1, 1.7922], [2, 2.2924], [3, 2.514], [5, 2.7362], [8, 2.8962], [12, 3.007], [20, 3.1181], [35, 3.2113], [60, 3.2795], [100, 3.3292], [170, 3.369], [280, 3.3979], [450, 3.4195], [700, 3.4355], [1000, 3.446]]
        },
        {
          name: "running average X-bar_n (illustrative)",
          color: "#4ea1ff",
          points: [[1, 3.4576], [2, 2.6776], [3, 2.6897], [5, 3.8042], [8, 3.4764], [12, 3.7025], [20, 3.821], [35, 3.6737], [60, 3.4486], [100, 3.3666], [170, 3.3918], [280, 3.5171], [450, 3.4379], [700, 3.4602], [1000, 3.4728]]
        }
      ],
      interpret: "X-axis is sample count n (log-spaced); y-axis is the running average. The blue curve wobbles wildly at small n then <b>tightens onto the grey dashed true mean 3.5</b>. The orange funnel is the typical-error band mu +/- sigma/sqrt(n): it narrows as n grows, and the blue curve stays inside it. The takeaway: convergence is real but slow — the band shrinks like 1/sqrt(n), so quartering the error needs 4x the data."
    },
    {
      type: "line",
      title: "Why it converges: Var(X-bar_n) = sigma^2 / n -> 0",
      xlabel: "n (number of samples)",
      ylabel: "Var(X-bar_n) = sigma^2 / n",
      series: [
        {
          name: "Var(X-bar_n) = sigma^2 / n (exact)",
          color: "#7ee787",
          points: [[1, 2.9167], [2, 1.4583], [3, 0.9722], [5, 0.5833], [8, 0.3646], [13, 0.2244], [21, 0.1389], [34, 0.0858], [55, 0.053], [89, 0.0328], [144, 0.0203], [233, 0.0125], [377, 0.0077], [610, 0.0048], [1000, 0.0029]]
        }
      ],
      interpret: "The engine behind chart 1. The variance of the sample mean is exactly sigma^2/n, here starting at 2.9167 (a fair die's variance is 35/12) and falling toward 0. Each time n DOUBLES the value HALVES — that steep early drop then long flat tail is the signature of 1/n decay. Zero-variance limit means the average eventually has no spread left: it equals mu."
    },
    {
      type: "line",
      title: "Failure: Cauchy distribution — the average never settles",
      xlabel: "n (number of samples)",
      ylabel: "running average",
      series: [
        {
          name: "true 'mean' (does not exist)",
          color: "#9aa7b4",
          dash: true,
          points: [[1,0],[10,0],[100,0],[1000,0],[10000,0]]
        },
        {
          name: "running average (illustrative)",
          color: "#ff7b72",
          points: [[1,0.8],[5,-1.4],[20,2.1],[60,-0.3],[150,4.9],[400,-2.2],[900,1.1],[2500,-6.8],[6000,3.4],[10000,-1.9]]
        }
      ],
      interpret: "Illustrative. The LLN needs a finite mean. For a heavy-tailed Cauchy there is no mean to converge to, so the red running average keeps lurching with big jumps no matter how large n gets — adding more data does NOT calm it down. Recognise this when your sample mean refuses to stabilise and occasionally leaps after a single extreme value: the assumption of a finite mean (or finite variance) has failed."
    },
    {
      type: "line",
      title: "Slow case: correlated samples converge far slower",
      xlabel: "n (number of samples, log-spaced)",
      ylabel: "running average",
      series: [
        {
          name: "true mean mu = 3.5 (dashed)",
          color: "#9aa7b4",
          dash: true,
          points: [[1,3.5],[10,3.5],[100,3.5],[1000,3.5],[10000,3.5]]
        },
        {
          name: "independent rolls (illustrative)",
          color: "#7ee787",
          points: [[1,3.9],[10,3.62],[100,3.55],[1000,3.51],[10000,3.502]]
        },
        {
          name: "strongly correlated rolls (illustrative)",
          color: "#ffb454",
          points: [[1,3.9],[10,4.3],[100,4.05],[1000,3.78],[10000,3.6]]
        }
      ],
      interpret: "Illustrative. The LLN still holds for correlated draws (with finite mean), but the rate slows. Green (independent) hugs the dashed mean by n=100; orange (correlated) is still drifting at n=10000 because each new sample carries little fresh information. Recognise this when convergence looks 'sticky' and far slower than 1/sqrt(n) would predict — your samples are not as independent as you assumed, so your effective sample size is smaller than n."
    }
  ],
  caption: "Chart 1 is the healthy LLN: the running average converges into a shrinking sigma/sqrt(n) band around 3.5. Chart 2 is the exact reason — Var(X-bar) = sigma^2/n falls to 0. Charts 3-4 are the cases that break or slow it: a Cauchy with no finite mean (never converges) and correlated samples (converges, but much slower than the independent ideal).",
  code: `import numpy as np

# Fair die: true mean and variance of ONE roll
mu = 3.5
sig2 = 35/12            # = 2.9166...  variance of a single fair-die roll
sigma = np.sqrt(sig2)

# Chart 1 -- LLN: running average toward mu, inside the sigma/sqrt(n) band.
# The running-average curve is an ILLUSTRATIVE deterministic sequence whose
# wobble decays at the exact sigma/sqrt(n) rate; the band itself is exact.
ns = np.array([1,2,3,5,8,12,20,35,60,100,170,280,450,700,1000])
env = sigma/np.sqrt(ns)                 # exact typical-error envelope
xbar = mu + env*np.cos(ns*0.9 + 0.7)*0.85   # illustrative running average
upper, lower = mu + env, mu - env
print(np.round(xbar,4))
print(np.round(upper,4)); print(np.round(lower,4))

# Chart 2 -- EXACT variance of the sample mean: Var(Xbar_n) = sigma^2 / n
nv = np.array([1,2,3,5,8,13,21,34,55,89,144,233,377,610,1000])
var_xbar = sig2 / nv
print(np.round(var_xbar,4))             # 2.9167, 1.4583, ... -> 0`
};

window.CODEVIZ["prob-clt"] = {
  question: "One die roll is flat (uniform). Why does the AVERAGE of many rolls turn into a bell - and when does that fail?",
  charts: [
    {
      type: "line",
      title: "Healthy CLT: density of the mean of n die rolls, n = 1,2,5,30",
      xlabel: "sample mean Xbar (die mean mu = 3.5)",
      ylabel: "probability density",
      series: [
        {
          name: "n=1 (one roll, flat/uniform)",
          color: "#9aa7b4",
          points: [[1,0.167],[2,0.167],[3,0.167],[4,0.167],[5,0.167],[6,0.167]]
        },
        {
          name: "n=2 (triangle, peak forming)",
          color: "#ffb454",
          points: [[1,0.056],[1.5,0.111],[2,0.167],[2.5,0.222],[3,0.278],[3.5,0.333],[4,0.278],[4.5,0.222],[5,0.167],[5.5,0.111],[6,0.056]]
        },
        {
          name: "n=5 (almost a bell)",
          color: "#7ee787",
          points: [[1,0.001],[1.4,0.01],[1.8,0.045],[2,0.081],[2.2,0.132],[2.4,0.196],[2.6,0.27],[2.8,0.347],[3,0.419],[3.2,0.473],[3.4,0.502],[3.6,0.502],[3.8,0.473],[4,0.419],[4.2,0.347],[4.4,0.27],[4.6,0.196],[4.8,0.132],[5,0.081],[5.2,0.045],[5.6,0.01],[6,0.001]]
        },
        {
          name: "n=30 (tall narrow bell)",
          color: "#4ea1ff",
          points: [[2.333,0.001],[2.467,0.005],[2.6,0.019],[2.733,0.062],[2.867,0.164],[3,0.357],[3.133,0.645],[3.267,0.967],[3.4,1.21],[3.467,1.266],[3.533,1.266],[3.6,1.21],[3.733,0.967],[3.867,0.645],[4,0.357],[4.133,0.164],[4.267,0.062],[4.4,0.019],[4.533,0.005],[4.667,0.001]]
        }
      ],
      interpret: "<b>The ideal case.</b> The x-axis is the average of n rolls; the y-axis is how densely probability piles up at each average. The single roll (grey) is flat - every face equally likely. As you average more rolls each curve gets taller and narrower and more bell-shaped, all centred on the true mean 3.5. <b>Read it as:</b> averaging cancels out the spread, and the leftover shape is always the same Normal bell - that is the CLT. Numbers are exact (convolved die PMF)."
    },
    {
      type: "line",
      title: "Standardized (Xbar - mu) / (sigma/sqrt(n)) converges to N(0,1)",
      xlabel: "z = (Xbar - 3.5) / (sigma/sqrt(n))",
      ylabel: "probability density",
      series: [
        {
          name: "limiting Normal N(0,1) pdf (exact)",
          color: "#c89bff",
          points: [[-4,0.0001],[-3.5,0.0009],[-3,0.0044],[-2.5,0.0175],[-2.25,0.0317],[-2,0.054],[-1.75,0.0863],[-1.5,0.1295],[-1.25,0.1826],[-1,0.242],[-0.75,0.3011],[-0.5,0.3521],[-0.25,0.3867],[0,0.3989],[0.25,0.3867],[0.5,0.3521],[0.75,0.3011],[1,0.242],[1.25,0.1826],[1.5,0.1295],[1.75,0.0863],[2,0.054],[2.25,0.0317],[2.5,0.0175],[3,0.0044],[3.5,0.0009],[4,0.0001]]
        },
        {
          name: "standardized mean of n=30 rolls (exact)",
          color: "#4ea1ff",
          points: [[-3.13,0.002],[-2.88,0.008],[-2.38,0.019],[-2.13,0.053],[-1.88,0.06],[-1.63,0.088],[-1.38,0.197],[-1.13,0.183],[-0.88,0.226],[-0.63,0.415],[-0.38,0.317],[-0.13,0.335],[0.13,0.504],[0.38,0.317],[0.63,0.415],[0.88,0.226],[1.13,0.183],[1.38,0.197],[1.63,0.088],[1.88,0.06],[2.13,0.053],[2.38,0.019],[2.88,0.008],[3.13,0.002]]
        }
      ],
      interpret: "<b>The same bell, rescaled to a universal yardstick.</b> Subtracting the mean and dividing by the standard error sigma/sqrt(n) re-centres every distribution at 0 with width 1. The blue n=30 curve lies almost exactly on top of the purple standard Normal N(0,1). <b>Conclude:</b> once standardized, the mean of any decent distribution looks like the SAME bell - this is what lets you build confidence intervals and z-scores. The slight jaggedness is only because die averages are discrete."
    },
    {
      type: "line",
      title: "Standard error SE = sigma/sqrt(n) shrinks as n grows (sigma=1.708)",
      xlabel: "sample size n",
      ylabel: "standard error SE = sigma/sqrt(n)",
      series: [
        {
          name: "SE = sigma/sqrt(n)  (exact)",
          color: "#7ee787",
          points: [[1,1.7078],[2,1.2076],[5,0.7638],[10,0.5401],[20,0.3819],[30,0.3118],[50,0.2415],[100,0.1708]]
        }
      ],
      interpret: "<b>Why the bell narrows.</b> The x-axis is sample size n; the y-axis is the standard error - how wide the mean's bell is. It falls fast at first then flattens, following 1/sqrt(n). <b>Read it as:</b> to halve your uncertainty you need 4x the data (going from n=25 to n=100). <b>Conclude:</b> more data always helps, but with diminishing returns - this curve is exactly why averaging tames noise."
    },
    {
      type: "line",
      title: "Variant - skewed source (lottery payout): needs a big n before the bell appears",
      xlabel: "sample mean Xbar",
      ylabel: "probability density (illustrative)",
      series: [
        {
          name: "n=1 (heavily right-skewed source)",
          color: "#ff7b72",
          points: [[0,0.9],[0.5,0.55],[1,0.32],[1.5,0.18],[2,0.1],[2.5,0.055],[3,0.03],[3.5,0.016],[4,0.009],[5,0.003]]
        },
        {
          name: "n=5 (still lopsided, long right tail)",
          color: "#ffb454",
          points: [[0,0.15],[0.3,0.45],[0.6,0.62],[0.9,0.58],[1.2,0.45],[1.5,0.32],[1.8,0.22],[2.1,0.14],[2.4,0.09],[2.7,0.055],[3,0.032],[3.5,0.012],[4,0.004]]
        },
        {
          name: "n=50 (finally symmetric bell)",
          color: "#7ee787",
          points: [[0.5,0.02],[0.65,0.1],[0.8,0.35],[0.9,0.72],[1,1.05],[1.1,1.2],[1.2,1.05],[1.3,0.72],[1.4,0.35],[1.55,0.1],[1.7,0.02]]
        }
      ],
      interpret: "<b>Illustrative - CLT still works, but slowly.</b> When the source is strongly skewed (e.g. payouts that are usually near 0 with rare big wins), small-n averages (red, orange) keep a long right tail and a peak left of the mean. Only by n=50 (green) does the bell become symmetric. <b>Recognise it by:</b> a lopsided mean-distribution at modest n. <b>Lesson:</b> n=30 is a rule of thumb, not a law - the heavier the skew, the bigger the n you need."
    },
    {
      type: "line",
      title: "Variant - CLT fails: heavy-tailed (Cauchy-like) source never settles to a bell",
      xlabel: "sample mean Xbar",
      ylabel: "probability density (illustrative)",
      series: [
        {
          name: "n=1 (heavy tails, no finite variance)",
          color: "#ff7b72",
          points: [[-6,0.012],[-4,0.024],[-3,0.038],[-2,0.064],[-1,0.118],[0,0.16],[1,0.118],[2,0.064],[3,0.038],[4,0.024],[6,0.012]]
        },
        {
          name: "n=30 (same width - NOT narrower)",
          color: "#c89bff",
          points: [[-6,0.012],[-4,0.024],[-3,0.038],[-2,0.064],[-1,0.118],[0,0.16],[1,0.118],[2,0.064],[3,0.038],[4,0.024],[6,0.012]]
        }
      ],
      interpret: "<b>Illustrative failure case.</b> If the source has infinite variance (Cauchy / power-law tails), averaging does NOT shrink the spread: the n=30 curve (purple) sits right on top of the n=1 curve (red) - same heavy tails, no bell. <b>Recognise it by:</b> the mean-distribution refuses to narrow as n grows, and a few extreme outliers swing the average wildly. <b>Lesson:</b> the CLT needs a finite variance; without it, sample means are not trustworthy no matter how much data you collect."
    }
  ],
  caption: "The healthy charts (1-3) use exact die arithmetic: the mean's distribution becomes a Normal bell N(mu, sigma^2/n) whose width sigma/sqrt(n) shrinks like 1/sqrt(n). The variants show the realistic caveats - a skewed source needs a much larger n, and a heavy-tailed (infinite-variance) source breaks the CLT entirely.",
  code: `import numpy as np
from itertools import product

# Fair die: uniform on {1..6}. Exact moments.
mu    = 3.5
var1  = 35/12          # variance of one die ~ 2.9167
sigma = var1**0.5      # ~ 1.7078

# Exact PMF of the SUM of n dice via repeated convolution (no random sampling).
die = np.ones(6) / 6
def sum_pmf(n):
    p = die.copy()
    for _ in range(n - 1):
        p = np.convolve(p, die)
    sums = np.arange(n, 6*n + 1)        # support of the sum
    return sums, p

# --- chart 1: exact density of the sample MEAN = sum/n ---
for n in (1, 2, 5, 30):
    sums, p = sum_pmf(n)
    means = sums / n
    dens  = p * n                       # spacing between means is 1/n, so density = P * n

# --- chart 2: standardize -> compare to N(0,1) ---
def std_normal(z):
    return np.exp(-z*z/2) / np.sqrt(2*np.pi)
sums, p = sum_pmf(30)
se   = sigma / np.sqrt(30)              # standard error of the mean
z    = (sums/30 - mu) / se
zdens = p * 30 * se                     # convert mean-density to z-density (chain rule)
print(std_normal(0))                    # 0.3989 = peak of N(0,1)

# --- chart 3: standard error shrinks like 1/sqrt(n) ---
for n in (1, 2, 5, 10, 20, 30, 50, 100):
    print(n, sigma / np.sqrt(n))        # 1.708, 1.208, ... 0.171
`
};

window.CODEVIZ["prob-estimation"] = {
  question: "What hidden numbers do the data point to, is our guess fair, and what does a BAD estimator look like?",
  charts: [
    {
      type: "line",
      title: "Consistent: sample mean Xbar = (1/n) sum Xi converges to the true mean 3.5",
      xlabel: "n (number of die rolls)",
      ylabel: "running sample mean Xbar",
      series: [
        {
          name: "running Xbar (illustrative rolls)",
          color: "#4ea1ff",
          points: [[1,4],[2,3],[3,3.333],[5,4.2],[8,4.25],[12,4.333],[20,4.2],[30,3.967],[50,3.78],[80,3.575],[120,3.65],[200,3.545],[350,3.6],[500,3.506]]
        },
        {
          name: "true mean = 3.5",
          color: "#9aa7b4",
          points: [[1,3.5],[500,3.5]]
        }
      ],
      interpret: "<b>A good (consistent) estimator.</b> The x-axis is how many rolls you have averaged; the blue line is your running guess of the mean; the grey line is the hidden truth 3.5. Early on the guess jumps around wildly (tiny samples are noisy) but it homes in on the grey line as n grows. <b>Conclude:</b> with enough data the sample mean nails the true mean - that settling-down is what 'consistent' means."
    },
    {
      type: "bars",
      title: "Sample variance s2 = (1/(n-1)) sum (Xi - Xbar)^2 on data {2,4,6}",
      labels: ["(2-4)^2", "(4-4)^2", "(6-4)^2", "sum of sq", "s2 = sum/(n-1=2)", "wrong: sum/(n=3)"],
      values: [4, 0, 4, 8, 4, 2.667],
      valueLabels: ["4", "0", "4", "8", "4.0", "2.67"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#c89bff", "#7ee787", "#ff7b72"],
      interpret: "<b>Building the variance term by term.</b> Each blue bar is one point's squared distance from the sample mean (4.0). They sum to 8 (purple). Dividing by n-1=2 gives the unbiased estimate 4.0 (green); dividing by the naive n=3 gives a too-small 2.67 (red). <b>Read it as:</b> the green/red gap is the famous (n-1) correction - dividing by n systematically undershoots because the points hug their own average."
    },
    {
      type: "bars",
      title: "Bias = E[theta-hat] - theta: 1/n underestimates the true variance 2.917",
      labels: ["n=2", "n=3", "n=5", "n=10", "n=30"],
      series: [
        { name: "E[ 1/n estimate ] (biased, too small)", color: "#ff7b72", points: [[0,1.458],[1,1.944],[2,2.333],[3,2.625],[4,2.819]] },
        { name: "E[ s2 with 1/(n-1) ] = 2.917 (unbiased)", color: "#7ee787", points: [[0,2.917],[1,2.917],[2,2.917],[3,2.917],[4,2.917]] }
      ],
      interpret: "<b>Unbiased vs biased, on average.</b> Each pair compares the expected value of two variance estimators against the truth 2.917. The green (1/(n-1)) bars sit exactly on the truth for every n - no bias. The red (1/n) bars sit below, and the gap is the bias E[theta-hat] - theta. <b>Conclude:</b> the red estimator is biased low but the gap shrinks as n grows; the green one is fair at any sample size."
    },
    {
      type: "line",
      title: "MLE: log-likelihood for coin p (7 heads in 10) peaks at p-hat = 0.70",
      xlabel: "p (assumed heads probability)",
      ylabel: "log-likelihood log L(p)",
      series: [
        {
          name: "log L(p) = 7 log p + 3 log(1-p)",
          color: "#ffb454",
          points: [[0.025,-25.898],[0.05,-21.124],[0.075,-18.366],[0.1,-16.434],[0.125,-14.957],[0.15,-13.767],[0.175,-12.778],[0.2,-11.935],[0.225,-11.206],[0.25,-10.567],[0.275,-10.002],[0.3,-9.498],[0.325,-9.047],[0.35,-8.641],[0.375,-8.276],[0.4,-7.947],[0.425,-7.65],[0.45,-7.383],[0.475,-7.144],[0.5,-6.931],[0.525,-6.744],[0.55,-6.58],[0.575,-6.441],[0.6,-6.325],[0.625,-6.233],[0.65,-6.165],[0.675,-6.123],[0.7,-6.109],[0.725,-6.124],[0.75,-6.173],[0.775,-6.259],[0.8,-6.39],[0.825,-6.576],[0.85,-6.829],[0.875,-7.173],[0.9,-7.645],[0.925,-8.317],[0.95,-9.346],[0.975,-11.244]]
        },
        {
          name: "peak at p-hat = k/n = 0.70",
          color: "#7ee787",
          points: [[0.7,-26],[0.7,-6.109]]
        }
      ],
      interpret: "<b>Maximum likelihood as a hill-climb.</b> The x-axis sweeps every candidate value of the coin's heads-probability p; the y-axis is how well that p explains the data (7 heads in 10) - higher is better. The orange curve peaks at the green line, p-hat=0.70. <b>Conclude:</b> the MLE just picks the p that makes your observed data most probable, and here that is exactly k/n = 7/10. The sharper the peak, the more confident the estimate."
    },
    {
      type: "line",
      title: "Variant - inconsistent estimator: a biased rule that never reaches the truth",
      xlabel: "n (number of rolls)",
      ylabel: "running estimate of the mean",
      series: [
        {
          name: "true mean = 3.5",
          color: "#9aa7b4",
          points: [[1,3.5],[500,3.5]]
        },
        {
          name: "bad rule: average of only the first 3 rolls",
          color: "#ff7b72",
          points: [[1,4.0],[2,3.5],[3,3.0],[10,3.0],[30,3.0],[100,3.0],[300,3.0],[500,3.0]]
        }
      ],
      interpret: "<b>Illustrative - what 'inconsistent' looks like.</b> This estimator throws away all but the first 3 rolls, so once n>3 it freezes at whatever those 3 happened to give (3.0 here) and never approaches the truth 3.5, no matter how much more data arrives. <b>Recognise it by:</b> a flat line that does NOT converge to grey. <b>Lesson:</b> more data only helps if the estimator actually uses it - consistency is not automatic."
    },
    {
      type: "line",
      title: "Variant - flat / non-identifiable likelihood: MLE peak is undefined",
      xlabel: "p (assumed parameter)",
      ylabel: "log-likelihood log L(p)",
      series: [
        {
          name: "well-peaked (lots of data) - clear MLE",
          color: "#7ee787",
          points: [[0.1,-20],[0.2,-13],[0.3,-8.5],[0.4,-6.2],[0.5,-5.4],[0.6,-6.2],[0.7,-8.5],[0.8,-13],[0.9,-20]]
        },
        {
          name: "nearly flat (too little / uninformative data)",
          color: "#ff7b72",
          points: [[0.1,-6.0],[0.2,-5.7],[0.3,-5.5],[0.4,-5.45],[0.5,-5.4],[0.6,-5.45],[0.7,-5.5],[0.8,-5.7],[0.9,-6.0]]
        }
      ],
      interpret: "<b>Illustrative - when the data cannot pin the parameter down.</b> The green curve has a sharp peak so the MLE is obvious and confident. The red curve is nearly flat: many values of p explain the data almost equally well, so the peak is shallow and the estimate is unstable (a tiny data change moves it a lot). <b>Recognise it by:</b> a near-horizontal log-likelihood. <b>Lesson:</b> a wide/flat likelihood means high uncertainty - collect more or more-informative data."
    }
  ],
  caption: "Charts 1-4 are the healthy story: a consistent sample mean (chart 1), the (n-1) variance correction built term by term (chart 2), the bias of the 1/n estimator (chart 3), and an MLE peak at p-hat=k/n (chart 4). The variants show failure modes - an inconsistent estimator that ignores most of the data and never converges, and a flat likelihood where the data cannot identify the parameter.",
  code: `import numpy as np

# --- Chart 1: sample mean Xbar = (1/n) sum Xi converges to true mean 3.5 ---
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=500)          # fair die
running_mean = np.cumsum(rolls) / np.arange(1, 501)
true_mean = np.mean([1,2,3,4,5,6])            # 3.5

# --- Chart 2: sample variance s2 = sum(Xi - Xbar)^2 / (n-1), data {2,4,6} ---
d = np.array([2.0, 4.0, 6.0]); n = len(d)
xbar = d.mean()                               # 4.0
sq = (d - xbar) ** 2                          # [4, 0, 4]
ss = sq.sum()                                 # 8
s2  = ss / (n - 1)                            # 4.0  (unbiased)
s2_wrong = ss / n                             # 2.667 (biased, too small)

# --- Chart 3: bias = E[theta-hat] - theta for the 1/n variance estimator ---
sigma2 = np.var([1,2,3,4,5,6])                # 35/12 = 2.9167 (true die variance)
ns = np.array([2,3,5,10,30])
E_biased = (ns - 1) / ns * sigma2             # E[1/n estimate], always < sigma2
bias = E_biased - sigma2                       # negative -> underestimate
E_unbiased = np.full_like(ns, sigma2, float)  # 1/(n-1) form: E = sigma2 exactly

# --- Chart 4: MLE log-likelihood for coin, k=7 heads in N=10 flips ---
k, N = 7, 10
p = np.linspace(0.025, 0.975, 39)
logL = k*np.log(p) + (N - k)*np.log(1 - p)
p_hat = k / N                                 # 0.70 -> exactly where logL peaks
`
};
