/* Per-lesson CODE VISUALIZATIONS for Module 1 — Probability & Statistics.
   Merged into window.CODEVIZ by lesson id. Each lesson carries one diagram PER key
   formula it teaches, so the reader sees what each formula means (its shape / its
   inputs -> output / its mechanism). All numbers are computed from the formulas.
   chartSpec types: bars | line | scatter | heatmap. */
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
      ylabel: "in sample space"
    },
    {
      type: "bars",
      title: "Equally likely: P(event) = (size of event) / (size of Omega), with |Omega| = 6",
      labels: ["P(Omega)=6/6", "P(even)=3/6", "P(>4)=2/6", "P({2})=1/6"],
      values: [1.0, 0.5, 0.3333, 0.1667],
      valueLabels: ["1.000", "0.500", "0.333", "0.167"],
      colors: ["#c89bff", "#7ee787", "#4ea1ff", "#ffb454"],
      xlabel: "event A (subset of Omega)",
      ylabel: "probability"
    },
    {
      type: "bars",
      title: "Bigger sample space: two dice, P(sum=s) = (6 - |s-7|) / 36, peak at 7",
      labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      values: [0.0278, 0.0556, 0.0833, 0.1111, 0.1389, 0.1667, 0.1389, 0.1111, 0.0833, 0.0556, 0.0278],
      valueLabels: ["1/36", "2/36", "3/36", "4/36", "5/36", "6/36", "5/36", "4/36", "3/36", "2/36", "1/36"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      xlabel: "sum of two dice (an outcome)",
      ylabel: "probability"
    }
  ],
  caption: "Chart 1 shows the sample space Omega as the full list of six die faces, with the event A = even = {2,4,6} recolored green to show an event is just a subset. Chart 2 turns counting into probability via the equally-likely shortcut P(A) = |A|/|Omega|: the whole space is 6/6 = 1, even is 3/6 = 0.5, more-than-4 is 2/6, and the single outcome {2} is 1/6. Chart 3 scales the same idea up to a 36-outcome space (two dice), where the sum's probability (6-|s-7|)/36 peaks at 7 (green), and all eleven bars sum to 1.",
  code: `import numpy as np

# Chart 1: one die. Sample space Omega and the event A = even = {2,4,6}
omega = [1, 2, 3, 4, 5, 6]
A = {2, 4, 6}                       # an event is a SUBSET of Omega
membership = [1 for _ in omega]     # every face lives in Omega
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
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"]
    },
    {
      type: "bars",
      title: "Axiom 3 additivity: P(A or B) = P(A) + P(B) when disjoint, term by term",
      labels: ["P(A)={1,2}", "P(B)={5,6}", "P(A)+P(B)", "P(A or B) direct"],
      values: [0.3333, 0.3333, 0.6667, 0.6667],
      valueLabels: ["2/6=0.333", "2/6=0.333", "0.667", "4/6=0.667"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#c89bff"]
    },
    {
      type: "bars",
      title: "Complement rule: P(A) + P(not A) = 1, with A={1,2}",
      labels: ["P(A)={1,2}", "P(not A)={3,4,5,6}", "P(A)+P(not A)"],
      values: [0.3333, 0.6667, 1.0],
      valueLabels: ["2/6=0.333", "4/6=0.667", "1.000"],
      colors: ["#4ea1ff", "#ff7b72", "#7ee787"]
    }
  ],
  caption: "Each diagram is the fair-die example from the lesson. Chart 1 shows nonnegativity (every bar is at or above 0) and normalization (the six face probabilities sum to exactly 1). Chart 2 breaks additivity into its terms so you see P(A)+P(B) equal the direct P(A or B) for the disjoint events A={1,2}, B={5,6}. Chart 3 shows the complement rule P(A)+P(not A)=1.",
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
      colors: ["#c89bff", "#7ee787", "#4ea1ff", "#9aa7b4"]
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
      showVals: true
    }
  ],
  caption: "Top: the conditional formula as a balance. Dividing the overlap P(A and B)=1/6 (purple) by the given world P(B)=1/2 (green) gives P(A|B)=1/3 (blue) - which is double the unconditional P(A)=1/6 (grey), because learning 'even' rules out half the faces. Bottom: conditioning on B keeps only faces 2,4,6 and renormalizes each from 1/6 to 1/3 so they sum to 1 again; face 2 carries probability 1/3, matching P(A|B).",
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
      colors: ["#7ee787", "#ffb454", "#c89bff"]
    },
    {
      type: "bars",
      title: "Prior P(sick)=0.001 updates to posterior P(sick|+)=0.090 after a positive",
      labels: ["prior P(sick)", "posterior P(sick|+)"],
      values: [0.001, 0.0902],
      valueLabels: ["0.001  (0.1%)", "0.090  (9.0%)"],
      colors: ["#9aa7b4", "#4ea1ff"]
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
      showVals: true
    }
  ],
  caption: "Bar 1 splits the denominator P(+) into the two ways a positive arises: only 0.00099 of it comes from truly sick people, while 0.00999 comes from false alarms among the healthy. Dividing the green numerator by the purple total nudges the prior of 0.1% up to a posterior of just 9.0% (bar 2). The heatmap shows why: per 100,000 people the test flags 99 true positives but 999 false ones, so 99/(99+999) = 9.0% of positives are real.",
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
  question: "How does splitting into cases add up to the chance of B?",
  charts: [
    {
      type: "bars",
      title: "P(B) = sum of P(A_i)P(B|A_i), term by term (defective bulb example)",
      labels: [
        "case 1: P(A1)P(D|A1) = 0.6 x 0.02",
        "case 2: P(A2)P(D|A2) = 0.4 x 0.05",
        "total P(D)"
      ],
      values: [0.012, 0.020, 0.032],
      valueLabels: ["0.012", "0.020", "0.032"],
      colors: ["#4ea1ff", "#7ee787", "#c89bff"]
    }
  ],
  caption: "Each case bar is its weight P(A_i) times B's chance inside that case, P(B|A_i). The blue (0.012) and green (0.020) contributions stack to the purple total P(D) = 0.032 (a 3.2% defect rate). Because the factories partition every bulb with no overlap, summing the two cases recovers the overall chance of B.",
  code: `# Law of total probability: P(B) = sum_i P(A_i) * P(B|A_i)
# Two factories partition all bulbs (weights sum to 1).
import numpy as np

P_A   = np.array([0.60, 0.40])   # P(A1), P(A2): factory output shares
P_B_A = np.array([0.02, 0.05])   # P(D|A1), P(D|A2): per-factory defect rates

contrib = P_A * P_B_A            # term-by-term contributions
P_B = contrib.sum()              # total probability of a defect

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
      ylabel: "probability"
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
      ]
    }
  ],
  caption: "Bar chart: for the independent pair (first-flip-heads A, second-flip-heads B) the actual P(A and B)=0.25 exactly matches the predicted product P(A)P(B)=0.25, so the green and grey bars are equal. For the dependent pair (A vs D='at least one head') the actual P(A and D)=0.5 overshoots the product P(A)P(D)=0.375, so the bars disagree. Scatter: when X and Y are independent the cloud is round (no tilt, sample corr about -0.05); when dependent the cloud stretches along the dashed line (sample corr about 0.91). Independence holds exactly when the joint equals the product.",
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
      ]
    },
    {
      type: "bars",
      title: "Combinations C(8,r): symmetric and capped, peaks at the middle r=4",
      labels: ["r=0", "r=1", "r=2", "r=3", "r=4", "r=5", "r=6", "r=7", "r=8"],
      values: [1, 8, 28, 56, 70, 56, 28, 8, 1],
      valueLabels: ["1", "8", "28", "56", "70", "56", "28", "8", "1"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"]
    },
    {
      type: "bars",
      title: "C(5,3) = P(5,3) / 3!: dividing by 3!=6 collapses 60 ordered line-ups into 10 teams",
      labels: ["P(5,3) ordered = 5!/2!", "divide by 3! = 6", "C(5,3) teams = P/3!"],
      values: [60, 6, 10],
      valueLabels: ["60", "/ 6", "10"],
      colors: ["#4ea1ff", "#ffb454", "#7ee787"]
    }
  ],
  caption: "The line chart shows permutations P(8,r)=8!/(8-r)! (blue) exploding while combinations C(8,r)=8!/(r!(8-r)!) (green) stay far smaller, because dividing by r! cancels the orderings. The middle bars show C(8,r) is symmetric and peaks at r=4 (70 ways). The last chart makes the link concrete with the lesson's 5-students example: the 60 ordered line-ups divided by 3!=6 collapse to exactly 10 teams.",
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
  question: "X = number of heads in 2 fair coin flips. What does its PMF look like, and why do the bars add to exactly 1?",
  charts: [
    {
      type: "bars",
      title: "PMF p_X(x) = P(X = x), and the bars sum to 1",
      labels: ["x=0 (TT)", "x=1 (HT,TH)", "x=2 (HH)", "sum p_X(x)"],
      values: [0.25, 0.5, 0.25, 1.0],
      valueLabels: ["1/4", "1/2", "1/4", "1"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"]
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
      ]
    }
  ],
  caption: "Top: the PMF p_X(x) = P(X=x) for X = heads in two fair flips is 1/4, 1/2, 1/4 (blue); adding them gives the green bar of height 1, the normalization rule. Bottom: the same probabilities accumulated left to right (purple) reach the green target line of 1 at the largest value, since X must land on some value.",
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
  question: "How does weighting each die face by its probability produce the mean 3.5 — and why does rescaling shift it predictably?",
  charts: [
    {
      type: "bars",
      title: "E[X] = sum of x*p(x): each face's contribution, mean 3.5 as balance point",
      labels: ["x=1", "x=2", "x=3", "x=4", "x=5", "x=6"],
      values: [0.1667, 0.3333, 0.5, 0.6667, 0.8333, 1.0],
      valueLabels: ["1/6", "2/6", "3/6", "4/6", "5/6", "6/6"],
      colors: ["#4ea1ff", "#4ea1ff", "#7ee787", "#7ee787", "#c89bff", "#c89bff"],
      hlines: [{ y: 0.5833, color: "#ffb454", dash: true, label: "balance: mean/6 = 3.5/6" }],
      note: "Each bar is x*p(x) = x*(1/6). Adding the six bars gives 21/6 = 3.5. The dashed line marks where the contributions balance around the mean."
    },
    {
      type: "bars",
      title: "Linearity E[aX+b] = a*E[X] + b, term by term (a=2, b=1)",
      labels: ["E[X]", "a*E[X] = 2*3.5", "+ b = +1", "E[2X+1]"],
      values: [3.5, 7.0, 1.0, 8.0],
      valueLabels: ["3.5", "7.0", "1.0", "8.0"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454", "#c89bff"],
      note: "Scale the mean by a, then shift by b: 2*3.5 + 1 = 8. The final purple bar (left side of the identity) equals 7 + 1 (the right side)."
    }
  ],
  caption: "Left: expectation is a weighted sum — each die face x contributes x*p(x)=x/6, and the six contributions add to 21/6 = 3.5 (the dashed line marks the balance point/mean). Right: linearity rescales that mean directly, E[2X+1] = 2*(3.5) + 1 = 8, shown as the scale term plus the shift term equaling the result.",
  code: `import numpy as np

# Fair die: X takes 1..6 each with probability 1/6
x = np.arange(1, 7)
p = np.full(6, 1/6)

# E[X] = sum of x * p(x): per-face contributions
contrib = x * p                 # [1/6, 2/6, ..., 6/6]
EX = contrib.sum()              # 21/6 = 3.5
print("contributions x*p(x):", contrib)   # 0.1667 ... 1.0
print("E[X] =", EX)                         # 3.5

# Linearity: E[aX + b] = a*E[X] + b, with a=2, b=1
a, b = 2, 1
scaled = a * EX                 # 7.0
EaXb   = a * EX + b             # 8.0
# verify directly against E[(aX+b)] computed from the pmf
direct = ((a*x + b) * p).sum()  # also 8.0
print("a*E[X] =", scaled, " E[2X+1] =", EaXb, " direct =", direct)`
};

window.CODEVIZ["prob-variance"] = {
  question: "Same average, different spread — how does variance turn distance-from-the-mean into one number?",
  charts: [
    {
      type: "bars",
      title: "Var(X) = E[(X-mu)^2]: weighted squared deviations add up to the variance",
      labels: ["x=1", "x=2", "x=3", "x=4", "x=5", "Var(X) total"],
      values: [0.2, 0.2, 0, 0.2, 0.2, 0.8],
      valueLabels: ["0.20", "0.20", "0", "0.20", "0.20", "0.80"],
      colors: ["#4ea1ff", "#4ea1ff", "#9aa7b4", "#4ea1ff", "#4ea1ff", "#7ee787"]
    },
    {
      type: "bars",
      title: "Var(X) = E[X^2] - (E[X])^2, term by term (coin worth 0 or 2, mu=1)",
      labels: ["E[X^2]", "(E[X])^2", "Var(X)"],
      values: [2, 1, 1],
      valueLabels: ["2.00", "1.00", "1.00"],
      colors: ["#4ea1ff", "#ffb454", "#7ee787"]
    },
    {
      type: "bars",
      title: "Low variance vs high variance: same mean 3, different spread",
      labels: ["x=1", "x=2", "x=3", "x=4", "x=5"],
      series: [
        { name: "low spread (Var=0.8)", color: "#7ee787", points: [[1, 0.05], [2, 0.20], [3, 0.50], [4, 0.20], [5, 0.05]] },
        { name: "high spread (Var=2.6)", color: "#ff7b72", points: [[1, 0.30], [2, 0.10], [3, 0.20], [4, 0.10], [5, 0.30]] }
      ]
    },
    {
      type: "bars",
      title: "sigma = sqrt(Var): standard deviation puts spread back in original units",
      labels: ["low: Var", "low: sigma", "high: Var", "high: sigma"],
      values: [0.8, 0.894, 2.6, 1.612],
      valueLabels: ["0.80", "0.894", "2.60", "1.612"],
      colors: ["#7ee787", "#4ea1ff", "#ff7b72", "#ffb454"]
    }
  ],
  caption: "Variance is the mean of the squared distances from mu: each value contributes p*(x-mu)^2 and these sum to Var (chart 1). The shortcut E[X^2]-(E[X])^2 = 2-1 = 1 gives the same answer (chart 2). Two distributions can share a mean yet differ in spread (chart 3), and the standard deviation sigma = sqrt(Var) reports that spread in the data's own units (chart 4).",
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
EXc  = (xc * pc).sum()                  # 1
EX2c = (xc**2 * pc).sum()              # 2
var_coin = EX2c - EXc**2                # 2 - 1 = 1

# Charts 3 & 4: compare spreads and report sigma = sqrt(Var)
_, _, vlo, slo = stats(x, p_low)        # Var=0.8,  sigma=0.894
_, _, vhi, shi = stats(x, p_high)       # Var=2.6,  sigma=1.612
print(var_low, var_coin, vlo, slo, vhi, shi)`
};

window.CODEVIZ["prob-bernoulli-binomial"] = {
  question: "One yes/no trial, then n of them: what does the count of successes look like?",
  charts: [
    {
      type: "bars",
      title: "Bernoulli pmf, p=0.3: P(0)=1-p, P(1)=p  (E[X]=p, Var=p(1-p)=0.21)",
      labels: ["X=0 (failure)", "X=1 (success)"],
      values: [0.7, 0.3],
      valueLabels: ["0.70 = 1-p", "0.30 = p"],
      colors: ["#9aa7b4", "#7ee787"]
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
      ]
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
      ]
    }
  ],
  caption: "Chart 1 is the Bernoulli pmf for one trial: two bars of height 1-p and p (E[X]=p=0.30, Var=p(1-p)=0.21). Chart 2 plots the Binomial pmf P(k)=C(n,k)p^k(1-p)^(n-k) for n=10 at two success rates; each peaks near its mean np, so the orange p=0.2 cloud centers at k=2 and the blue p=0.5 cloud is symmetric and centers at k=5. Chart 3 traces the Bernoulli variance p(1-p): it is maximal at the fair coin p=0.5 (0.25) and vanishes at p=0 or p=1, where the outcome never changes.",
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
  question: "What do the Geometric and Poisson PMFs actually look like, and where does the mean land?",
  charts: [
    {
      type: "bars",
      title: "Geometric PMF: P(k) = (1-p)^(k-1) p, p = 1/6, mean 1/p = 6",
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      values: [0.16667, 0.13889, 0.11574, 0.09645, 0.08038, 0.06698, 0.05582, 0.04651, 0.03876, 0.0323],
      valueLabels: ["0.167", "0.139", "0.116", "0.096", "0.080", "0.067", "0.056", "0.047", "0.039", "0.032"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      xlabel: "k = trial of first six",
      ylabel: "P(X = k)"
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
      ylabel: "P(X = k)"
    }
  ],
  caption: "Top: the Geometric PMF decays geometrically by a factor (1-p)=5/6 each step; the green bar marks the mean wait 1/p = 6 rolls for a six. Bottom: two Poisson PMFs share the same e^(-lam) lam^k / k! shape but peak near their mean lam, so raising lam from 2 to 5 shifts and spreads the mass to the right (mean = variance = lam).",
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
  question: "If height is the curve, where does probability live? Pick a concrete density and watch area become the CDF.",
  charts: [
    {
      type: "line",
      title: "PDF f(x) = x/2 on [0,2] (triangular density): height is density, not probability",
      xlabel: "x",
      ylabel: "f(x) = density",
      series: [
        { name: "PDF f(x) = x/2", color: "#4ea1ff", points: [[0,0],[0.1,0.05],[0.2,0.1],[0.3,0.15],[0.4,0.2],[0.5,0.25],[0.6,0.3],[0.7,0.35],[0.8,0.4],[0.9,0.45],[1,0.5],[1.1,0.55],[1.2,0.6],[1.3,0.65],[1.4,0.7],[1.5,0.75],[1.6,0.8],[1.7,0.85],[1.8,0.9],[1.9,0.95],[2,1]] }
      ]
    },
    {
      type: "line",
      title: "CDF F(x) = integral of f from 0 to x = x^2/4: climbs 0 to 1 as area accumulates",
      xlabel: "x",
      ylabel: "value",
      series: [
        { name: "CDF F(x) = x^2/4", color: "#7ee787", points: [[0,0],[0.1,0.0025],[0.2,0.01],[0.3,0.0225],[0.4,0.04],[0.5,0.0625],[0.6,0.09],[0.7,0.1225],[0.8,0.16],[0.9,0.2025],[1,0.25],[1.1,0.3025],[1.2,0.36],[1.3,0.4225],[1.4,0.49],[1.5,0.5625],[1.6,0.64],[1.7,0.7225],[1.8,0.81],[1.9,0.9025],[2,1]] },
        { name: "PDF f(x) = x/2 (for reference)", color: "#4ea1ff", points: [[0,0],[0.2,0.1],[0.4,0.2],[0.6,0.3],[0.8,0.4],[1,0.5],[1.2,0.6],[1.4,0.7],[1.6,0.8],[1.8,0.9],[2,1]] }
      ]
    },
    {
      type: "line",
      title: "P(0.5<=X<=1.5) = F(1.5) - F(0.5) = 0.5625 - 0.0625 = 0.5 = area of the shaded slice",
      xlabel: "x",
      ylabel: "f(x)",
      series: [
        { name: "PDF f(x) = x/2", color: "#9aa7b4", points: [[0,0],[0.1,0.05],[0.2,0.1],[0.3,0.15],[0.4,0.2],[0.5,0.25],[0.6,0.3],[0.7,0.35],[0.8,0.4],[0.9,0.45],[1,0.5],[1.1,0.55],[1.2,0.6],[1.3,0.65],[1.4,0.7],[1.5,0.75],[1.6,0.8],[1.7,0.85],[1.8,0.9],[1.9,0.95],[2,1]] },
        { name: "shaded slice a=0.5 to b=1.5 (area = 0.5)", color: "#ffb454", points: [[0.5,0],[0.5,0.25],[0.6,0.3],[0.7,0.35],[0.8,0.4],[0.9,0.45],[1,0.5],[1.1,0.55],[1.2,0.6],[1.3,0.65],[1.4,0.7],[1.5,0.75],[1.5,0]] }
      ]
    },
    {
      type: "line",
      title: "f(x) = F'(x): the slope of the CDF equals the PDF (numeric slope lands on x/2)",
      xlabel: "x",
      ylabel: "value",
      series: [
        { name: "PDF f(x) = x/2 (exact)", color: "#4ea1ff", points: [[0,0],[0.2,0.1],[0.4,0.2],[0.6,0.3],[0.8,0.4],[1,0.5],[1.2,0.6],[1.4,0.7],[1.6,0.8],[1.8,0.9],[2,1]] },
        { name: "slope of CDF (F(x+h)-F(x-h))/2h", color: "#c89bff", points: [[0.2,0.1],[0.4,0.2],[0.6,0.3],[0.8,0.4],[1,0.5],[1.2,0.6],[1.4,0.7],[1.6,0.8],[1.8,0.9]] }
      ]
    }
  ],
  caption: "We pick a concrete triangular density f(x)=x/2 on [0,2]. Chart 1 is the PDF (its area integrates to 1). Chart 2 integrates it: the CDF F(x)=x^2/4 climbs from 0 to 1, fastest where f is tallest. Chart 3 shades the slice from 0.5 to 1.5 whose area is exactly F(1.5)-F(0.5)=0.5. Chart 4 differentiates back: the numeric slope of the CDF lands on the PDF, confirming f(x)=F'(x).",
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
  question: "What do a perfectly flat Uniform density and a decaying Exponential wait actually look like, where are their means, and why does waiting already change nothing (memorylessness)?",
  charts: [
    {
      type: "line",
      title: "Uniform pdf f(x) = 1/(b-a) = 1/10 = 0.1 on [0,10], mean (a+b)/2 = 5",
      xlabel: "x (minutes)",
      ylabel: "density f(x)",
      series: [
        {
          name: "f(x) = 1/(b-a) = 0.1",
          color: "#7ee787",
          points: [[-1, 0], [0, 0.1], [1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1], [5, 0.1], [6, 0.1], [7, 0.1], [8, 0.1], [9, 0.1], [10, 0.1], [11, 0], [12, 0]]
        },
        {
          name: "mean = (a+b)/2 = 5",
          color: "#ffb454",
          points: [[5, 0], [5, 0.1]]
        }
      ],
      note: "Flat at height 1/(b-a)=1/10=0.1 over [0,10], zero outside. The area is 0.1*10 = 1. The orange line marks the mean (a+b)/2 = 5, the midpoint of the range."
    },
    {
      type: "line",
      title: "Exponential pdf f(x) = lambda*e^(-lambda x), lambda=0.2, mean 1/lambda = 5",
      xlabel: "x (minutes)",
      ylabel: "density f(x)",
      series: [
        {
          name: "f(x) = 0.2*e^(-0.2x)",
          color: "#4ea1ff",
          points: [[0, 0.2], [1, 0.1637], [2, 0.1341], [3, 0.1098], [4, 0.0899], [5, 0.0736], [6, 0.0602], [7, 0.0493], [8, 0.0404], [9, 0.0331], [10, 0.0271], [12, 0.0181], [14, 0.0122], [16, 0.0082], [18, 0.0055], [20, 0.0037], [24, 0.0016], [30, 0.0005]]
        },
        {
          name: "mean = 1/lambda = 5",
          color: "#ffb454",
          points: [[5, 0], [5, 0.0736]]
        }
      ],
      note: "Starts at f(0) = lambda = 0.2 and decays: short waits common, long waits rare. The orange line marks the mean wait 1/lambda = 1/0.2 = 5 minutes."
    },
    {
      type: "line",
      title: "Exponential CDF F(x) = 1 - e^(-lambda x), lambda=0.2, F(mean)=1-1/e=0.632",
      xlabel: "x (minutes)",
      ylabel: "P(X <= x)",
      series: [
        {
          name: "F(x) = 1 - e^(-0.2x)",
          color: "#c89bff",
          points: [[0, 0], [1, 0.1813], [2, 0.3297], [3, 0.4512], [4, 0.5507], [5, 0.6321], [6, 0.6988], [7, 0.7534], [8, 0.7981], [10, 0.8647], [12, 0.9093], [14, 0.9392], [16, 0.9592], [18, 0.9727], [20, 0.9817], [24, 0.9918], [30, 0.9975]]
        },
        {
          name: "limit = 1",
          color: "#9aa7b4",
          points: [[0, 1], [30, 1]]
        },
        {
          name: "mean = 5 -> F = 0.632",
          color: "#ffb454",
          points: [[5, 0], [5, 0.6321]]
        }
      ],
      note: "F(x)=1-e^(-lambda x) climbs from 0 toward 1. At the mean x=5, F = 1 - e^(-1) = 0.632, so about 63% of waits finish within one mean wait."
    },
    {
      type: "bars",
      title: "Memoryless: P(X>5) = P(X>8 | X>3) = e^(-1) = 0.368 (lambda=0.2)",
      labels: ["P(X>5) fresh", "P(X>8)", "P(X>3)", "P(X>8|X>3)=P(X>8)/P(X>3)"],
      values: [0.3679, 0.2019, 0.5488, 0.3679],
      valueLabels: ["0.368", "0.202", "0.549", "0.368"],
      colors: ["#7ee787", "#9aa7b4", "#9aa7b4", "#7ee787"],
      note: "Survival is P(X>t)=e^(-lambda t). A fresh wait of 5 more: P(X>5)=e^(-1)=0.368 (green). Already waited 3, want 5 more: P(X>8|X>3)=P(X>8)/P(X>3)=0.202/0.549=0.368 (green). The two greens match exactly -> the 3 minutes already spent change nothing."
    }
  ],
  caption: "Chart 1: the Uniform pdf is flat at 1/(b-a)=0.1 with mean at the midpoint 5. Chart 2: the Exponential pdf 0.2*e^(-0.2x) decays from 0.2 with mean wait 1/lambda=5. Chart 3: its CDF 1-e^(-0.2x) rises toward 1, hitting 0.632 at the mean. Chart 4: memorylessness shown in numbers - P(X>5) and P(X>8|X>3) are both exactly e^(-1)=0.368.",
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
  question: "What does the bell curve actually look like, and where does the 68-95-99.7 rule come from?",
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
      ]
    },
    {
      type: "bars",
      title: "68-95-99.7 rule: probability mass within k*sigma of mu (mu=170, sigma=10)",
      labels: ["within +/-1 sigma (160-180)", "within +/-2 sigma (150-190)", "within +/-3 sigma (140-200)"],
      values: [0.68269, 0.95450, 0.99730],
      valueLabels: ["0.683", "0.954", "0.997"],
      colors: ["#7ee787", "#ffb454", "#c89bff"]
    }
  ],
  caption: "Left: the PDF formula evaluated at 80 heights from 125 to 215 cm. The blue sigma=10 curve is tall and narrow (peak 0.0398 at mu=170); raising sigma to 15 spreads the same unit of area wider and shorter (peak 0.0266) - sigma controls the width. Right: integrating that same PDF over mu +/- k*sigma gives the cumulative mass, which lands on the famous 0.683 / 0.954 / 0.997 of the 68-95-99.7 rule.",
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
  question: "Mood and weather vary together. How do you pull one variable back out of the joint table?",
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
      showVals: true
    },
    {
      type: "bars",
      title: "Marginal p_X(x) = sum over y p(x,y): collapse each row to its sum",
      labels: ["p_X(Happy) = 0.4 + 0.1", "p_X(Sad) = 0.2 + 0.3"],
      values: [0.5, 0.5],
      valueLabels: ["0.50", "0.50"],
      colors: ["#4ea1ff", "#4ea1ff"]
    },
    {
      type: "bars",
      title: "Conditional p(x|Sunny) = p(x,Sunny) / p_Y(Sunny), Sunny column rescaled to sum 1",
      labels: ["p(Happy,Sunny)=0.4", "p(Sad,Sunny)=0.2", "p(Happy|Sunny)=0.4/0.6", "p(Sad|Sunny)=0.2/0.6"],
      values: [0.4, 0.2, 0.6667, 0.3333],
      valueLabels: ["0.40 joint", "0.20 joint", "0.667 cond", "0.333 cond"],
      colors: ["#9aa7b4", "#9aa7b4", "#ffb454", "#ffb454"]
    }
  ],
  caption: "The heatmap is the joint PMF p(x,y); its four cells sum to 1. Summing each row collapses the table along the weather axis to give the marginal p_X(x) (chart 2): row Happy gives 0.4+0.1=0.5, row Sad gives 0.2+0.3=0.5. Chart 3 fixes y=Sunny: the grey bars are the raw joint cells in that column (0.4 and 0.2), and dividing each by the column total p_Y(Sunny)=0.6 rescales them to the orange conditional p(x|Sunny) = 0.667 and 0.333, which now sums to 1.",
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
`
};

window.CODEVIZ["prob-covariance-correlation"] = {
  question: "Do two variables move together? Watch Cov split into 'mean of the product' minus 'product of the means', then see what rho = +0.9, 0, and -0.9 actually look like as point clouds.",
  charts: [
    {
      type: "bars",
      title: "Cov(X,Y) = E[XY] - E[X]E[Y], term by term (5 paired observations)",
      labels: ["E[XY]", "E[X]E[Y]", "Cov(X,Y)"],
      values: [15, 12, 3],
      valueLabels: ["15.00", "12.00", "3.00"],
      colors: ["#4ea1ff", "#ffb454", "#7ee787"],
      xlabel: "term of the identity",
      ylabel: "value"
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
      ]
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
      ]
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
      ]
    }
  ],
  caption: "Chart 1 splits the covariance identity for 5 paired points: the mean of the product E[XY]=15 minus the product of the means E[X]E[Y]=3*4=12 leaves Cov=3 (positive, so they move together). Charts 2-4 show the correlation rho = Cov/(sigmaX*sigmaY) for three point clouds: at rho about +0.90 the points rise tightly along the orange least-squares line, at rho about 0 the cloud is round and the line is flat, and at rho about -0.90 the points fall along the line. The clouds are illustrative random draws, but every rho, Cov, and sigma printed is the exact value computed from the plotted points.",
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
    print(name, "rho", round(rho, 3), "Cov", round(cov, 3),
          "sigmaX", round(xs.std(), 3), "sigmaY", round(ys.std(), 3))
# pos rho 0.9  | zero rho -0.0 | neg rho -0.9`
};

window.CODEVIZ["prob-conditional-expectation"] = {
  question: "From a fixed joint table of (X, Y), what is the average of X inside each Y-group, and do those group-averages weight back up to the overall mean E[X]?",
  charts: [
    {
      type: "bars",
      title: "E[X|Y=y]: the conditional mean of X for each y (group-by average)",
      labels: ["E[X|Y=1]", "E[X|Y=2]", "E[X|Y=3]", "E[X] overall"],
      values: [0.75, 1.1667, 1.5, 1.25],
      valueLabels: ["0.750", "1.167", "1.500", "1.250"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#4ea1ff"]
    },
    {
      type: "bars",
      title: "Tower property: E[X] = sum over y of E[X|y]*P(y), term by term",
      labels: ["E[X|1]*P(1)", "E[X|2]*P(2)", "E[X|3]*P(3)", "sum = E[X]"],
      values: [0.15, 0.35, 0.75, 1.25],
      valueLabels: ["0.150", "0.350", "0.750", "1.250"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#7ee787"]
    }
  ],
  caption: "Left: each grey bar is the average of X computed only within one value of Y (0.75, 1.167, 1.500); the blue bar is the overall mean E[X]=1.25. Right: weighting each conditional mean E[X|Y=y] by its group probability P(Y=y)=0.2, 0.3, 0.5 gives the orange terms 0.15+0.35+0.75, which sum (green) exactly to E[X]=1.25 — the law of iterated expectations E[E[X|Y]]=E[X].",
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
  question: "How far above the true tail does each inequality's bound sit?",
  charts: [
    {
      type: "line",
      title: "Markov: P(X>=a) <= E[X]/a, mean=50 (Exponential with mean 50)",
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
      ]
    },
    {
      type: "line",
      title: "Chebyshev: P(|X-mu|>=k sigma) <= 1/k^2 (Normal, mu=50 sigma=10)",
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
      ]
    }
  ],
  caption: "Each blue line is the inequality's promised upper bound; each green line is the actual tail probability for a concrete distribution (Exponential mean 50 for Markov, Normal mu=50 sigma=10 for Chebyshev). The bound always sits on or above the true tail, and the gap widens further out — the inequalities are guarantees, not tight estimates.",
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
  question: "As you collect more die rolls, how fast does the running average lock onto the true mean 3.5 — and how fast does its spread shrink?",
  charts: [
    {
      type: "line",
      title: "LLN: running average X-bar_n converges to mu = 3.5 as n grows",
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
      ]
    },
    {
      type: "line",
      title: "Var(X-bar_n) = sigma^2 / n shrinks toward 0  (sigma^2 = 35/12 = 2.9167)",
      xlabel: "n (number of samples)",
      ylabel: "Var(X-bar_n) = sigma^2 / n",
      series: [
        {
          name: "Var(X-bar_n) = sigma^2 / n (exact)",
          color: "#7ee787",
          points: [[1, 2.9167], [2, 1.4583], [3, 0.9722], [5, 0.5833], [8, 0.3646], [13, 0.2244], [21, 0.1389], [34, 0.0858], [55, 0.053], [89, 0.0328], [144, 0.0203], [233, 0.0125], [377, 0.0077], [610, 0.0048], [1000, 0.0029]]
        }
      ]
    }
  ],
  caption: "Top: the Law of Large Numbers. The blue running average X-bar_n = (1/n) sum X_i wobbles a lot at small n, then locks onto the dashed true mean mu = 3.5; the orange band mu +/- sigma/sqrt(n) is the typical-error envelope it stays inside (the running-mean curve is an illustrative deterministic sequence, but the band is the exact sigma/sqrt(n) rate). Bottom: why it converges — the variance of the sample mean is exactly Var(X-bar_n) = sigma^2/n, so with sigma^2 = 35/12 for a fair die it falls from 2.9167 at n=1 toward 0, halving every time n doubles.",
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
  question: "One die roll is flat (uniform). Why does the AVERAGE of many rolls turn into a bell?",
  charts: [
    {
      type: "line",
      title: "Xbar approx N(mu, sigma^2/n): density of the mean of n die rolls, n = 1,2,5,30",
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
      ]
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
      ]
    },
    {
      type: "line",
      title: "Standard error of the mean SE = sigma/sqrt(n) shrinks as n grows (sigma=1.708)",
      xlabel: "sample size n",
      ylabel: "standard error SE = sigma/sqrt(n)",
      series: [
        {
          name: "SE = sigma/sqrt(n)  (exact)",
          color: "#7ee787",
          points: [[1,1.7078],[2,1.2076],[5,0.7638],[10,0.5401],[20,0.3819],[30,0.3118],[50,0.2415],[100,0.1708]]
        }
      ]
    }
  ],
  caption: "Chart 1 plots the EXACT distribution of the sample mean of n fair die rolls (computed by convolving the die's PMF, not random sampling): one roll is flat, but by n=30 the mean is a tight bell centered at mu=3.5 - that bell is N(mu, sigma^2/n). Chart 2 standardizes the mean by subtracting mu and dividing by the standard error sigma/sqrt(n); the exact n=30 curve (blue) sits right under the limiting standard Normal N(0,1) (purple) - that is the CLT. Chart 3 shows the standard error sigma/sqrt(n) collapsing toward 0 like 1/sqrt(n), which is why the bell narrows as n grows. Every value is exact arithmetic; the n=30 blue curve in chart 2 is slightly jagged only because the mean of dice is discrete.",
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
    # (means, dens) is the exact curve plotted; n=1 flat -> n=30 tall bell

# --- chart 2: standardize -> compare to N(0,1) ---
def std_normal(z):
    return np.exp(-z*z/2) / np.sqrt(2*np.pi)
sums, p = sum_pmf(30)
se   = sigma / np.sqrt(30)              # standard error of the mean
z    = (sums/30 - mu) / se
zdens = p * 30 * se                     # convert mean-density to z-density (chain rule)
zline = np.linspace(-4, 4, 33)
print(std_normal(0))                    # 0.3989 = peak of N(0,1)

# --- chart 3: standard error shrinks like 1/sqrt(n) ---
for n in (1, 2, 5, 10, 20, 30, 50, 100):
    print(n, sigma / np.sqrt(n))        # 1.708, 1.208, ... 0.171
`
};

window.CODEVIZ["prob-estimation"] = {
  question: "What hidden numbers do the data point to, and is our guess fair?",
  charts: [
    {
      type: "line",
      title: "Sample mean Xbar = (1/n) sum Xi converges to the true mean 3.5",
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
      ]
    },
    {
      type: "bars",
      title: "Sample variance s2 = (1/(n-1)) sum (Xi - Xbar)^2 on data {2,4,6}",
      labels: ["(2-4)^2", "(4-4)^2", "(6-4)^2", "sum of sq", "s2 = sum/(n-1=2)", "wrong: sum/(n=3)"],
      values: [4, 0, 4, 8, 4, 2.667],
      valueLabels: ["4", "0", "4", "8", "4.0", "2.67"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#c89bff", "#7ee787", "#ff7b72"]
    },
    {
      type: "bars",
      title: "Bias = E[theta-hat] - theta: 1/n underestimates the true variance 2.917",
      labels: ["n=2", "n=3", "n=5", "n=10", "n=30"],
      series: [
        { name: "E[ 1/n estimate ] (biased, too small)", color: "#ff7b72", points: [[0,1.458],[1,1.944],[2,2.333],[3,2.625],[4,2.819]] },
        { name: "E[ s2 with 1/(n-1) ] = 2.917 (unbiased)", color: "#7ee787", points: [[0,2.917],[1,2.917],[2,2.917],[3,2.917],[4,2.917]] }
      ]
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
      ]
    }
  ],
  caption: "Chart 1 plots the sample-mean estimator Xbar: a running average of die rolls settling onto the true mean 3.5 (the law-of-large-numbers convergence behind an unbiased estimate). Chart 2 builds s2 term by term on {2,4,6} (squared distances 4,0,4 sum to 8) and shows the 1/(n-1) divisor gives 4.0 while the naive 1/n gives a too-small 2.67. Chart 3 makes the bias = E[theta-hat] - theta concrete: the 1/n variance estimate sits below the true 2.917 for every n while the 1/(n-1) form is dead-on. Chart 4 illustrates MLE: the coin log-likelihood for 7 heads in 10 peaks exactly at p-hat = 0.70.",
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
