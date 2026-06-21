/* Per-lesson CODE VISUALIZATIONS for Module 1 — Probability & Statistics.
   Merged into window.CODEVIZ by lesson id. Each entry visualizes what that
   lesson's code (code-01-probability.js) actually computes. All numbers below
   were produced by RUNNING that code with numpy/scipy (formula and/or
   Monte-Carlo), so charts match the lesson output.
   chartSpec types: bars | line | scatter | heatmap. */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "prob-sample-space": {
    question: "When you roll two fair dice, how likely is each possible sum?",
    charts: [{
      type: "bars",
      title: "PMF of the sum of two fair dice (36 outcomes)",
      labels: ["2","3","4","5","6","7","8","9","10","11","12"],
      values: [0.0278,0.0556,0.0833,0.1111,0.1389,0.1667,0.1389,0.1111,0.0833,0.0556,0.0278],
      valueLabels: ["1/36","2/36","3/36","4/36","5/36","6/36","5/36","4/36","3/36","2/36","1/36"],
      colors: ["#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#7ee787","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff"]
    }],
    caption: "Counting favorable outcomes over 36 total gives a triangular distribution peaking at the sum 7 (P = 6/36 = 0.167, green).",
    code: `import numpy as np
import matplotlib.pyplot as plt
from itertools import product

# Enumerate all 36 ordered outcomes and tally each sum.
omega = list(product(range(1, 7), repeat=2))
sums = np.array([a + b for a, b in omega])
vals = np.arange(2, 13)
pmf = np.array([np.mean(sums == s) for s in vals])

colors = ['#7ee787' if s == 7 else '#4ea1ff' for s in vals]
plt.bar([str(s) for s in vals], pmf, color=colors)
plt.title('PMF of the sum of two fair dice (36 outcomes)')
plt.xlabel('sum')
plt.ylabel('probability')
plt.show()`
  },

  "prob-axioms": {
    question: "Do the three axioms hold for disjoint die events A={1,2} and B={5,6}?",
    charts: [{
      type: "bars",
      title: "Additivity: P(A)+P(B) equals P(A or B)",
      labels: ["P(A)","P(B)","P(A)+P(B)","P(A or B)","P(not A)"],
      values: [0.3333,0.3333,0.6667,0.6667,0.6667],
      valueLabels: ["0.333","0.333","0.667","0.667","0.667"],
      colors: ["#4ea1ff","#7ee787","#c89bff","#c89bff","#ffb454"]
    }],
    caption: "For disjoint events the added chances (0.333+0.333) match P(A or B)=0.667, and the complement rule gives P(not A)=1-0.333=0.667.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Fair die; disjoint events A={1,2}, B={5,6}.
faces = np.arange(1, 7)
p = np.full(6, 1 / 6)
A = np.isin(faces, [1, 2])
B = np.isin(faces, [5, 6])
pA, pB = p[A].sum(), p[B].sum()
vals = [pA, pB, pA + pB, p[A | B].sum(), p[~A].sum()]

labels = ['P(A)', 'P(B)', 'P(A)+P(B)', 'P(A or B)', 'P(not A)']
colors = ['#4ea1ff', '#7ee787', '#c89bff', '#c89bff', '#ffb454']
plt.bar(labels, vals, color=colors)
plt.title('Additivity: P(A)+P(B) equals P(A or B)')
plt.ylabel('probability')
plt.show()`
  },

  "prob-conditional": {
    question: "Given the die shows an even number, how likely is it a 2?",
    charts: [{
      type: "bars",
      title: "P(A|B) = P(A and B) / P(B) for a fair die",
      labels: ["P(B even)","P(A and B)","P(A | B)"],
      values: [0.5,0.1667,0.3333],
      valueLabels: ["1/2","1/6","1/3"],
      colors: ["#7ee787","#c89bff","#4ea1ff"]
    }],
    caption: "Shrinking the world to the three even faces, the chance of a 2 is (1/6)/(1/2) = 1/3 = 0.333.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# A = "rolled a 2", B = "rolled an even number".
faces = np.arange(1, 7)
A = faces == 2
B = np.isin(faces, [2, 4, 6])
pB = np.mean(B)
pAB = np.mean(A & B)
vals = [pB, pAB, pAB / pB]

labels = ['P(B even)', 'P(A and B)', 'P(A | B)']
colors = ['#7ee787', '#c89bff', '#4ea1ff']
plt.bar(labels, vals, color=colors)
plt.title('P(A|B) = P(A and B) / P(B) for a fair die')
plt.ylabel('probability')
plt.show()`
  },

  "prob-bayes": {
    question: "After a positive test, how does belief shift from prior to posterior?",
    charts: [{
      type: "bars",
      title: "Prior P(sick) vs posterior P(sick | +)  [99% test, 1-in-1000 disease]",
      labels: ["prior P(sick)","posterior P(sick | +)"],
      values: [0.001,0.0902],
      valueLabels: ["0.001","0.090"],
      colors: ["#9aa7b4","#ff7b72"]
    }],
    caption: "Bayes' rule lifts belief from 0.001 to only 0.090: even a 99% test leaves a positive most likely healthy because the disease is rare.",
    code: `import matplotlib.pyplot as plt

# Rare disease, 99% sensitive test, 1% false positive rate.
prior = 0.001
sens = 0.99
fpr = 0.01

# Bayes' rule: posterior P(sick | +).
p_pos = sens * prior + fpr * (1 - prior)
post = sens * prior / p_pos
vals = [prior, post]

labels = ['prior P(sick)', 'posterior P(sick | +)']
colors = ['#9aa7b4', '#ff7b72']
plt.bar(labels, vals, color=colors)
plt.title('Prior P(sick) vs posterior P(sick | +)')
plt.ylabel('probability')
plt.show()`
  },

  "prob-total-prob": {
    question: "What is the overall defect rate when two factories contribute?",
    charts: [{
      type: "bars",
      title: "Total probability: weighted defect contributions sum to P(defect)",
      labels: ["case 1: P(A1)P(D|A1)","case 2: P(A2)P(D|A2)","total P(defect)"],
      values: [0.012,0.020,0.032],
      valueLabels: ["0.012","0.020","0.032"],
      colors: ["#4ea1ff","#7ee787","#c89bff"]
    }],
    caption: "Each factory's weight times its defect rate (0.012 and 0.020) adds to the overall P(defect) = 0.032.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Two factories: shares and per-factory defect rates.
pA = np.array([0.6, 0.4])
pD_given = np.array([0.02, 0.05])

# Total probability: weighted defect contributions.
contrib = pA * pD_given
vals = [contrib[0], contrib[1], contrib.sum()]

labels = ['case 1: P(A1)P(D|A1)', 'case 2: P(A2)P(D|A2)', 'total P(defect)']
colors = ['#4ea1ff', '#7ee787', '#c89bff']
plt.bar(labels, vals, color=colors)
plt.title('Total probability: weighted defect contributions sum to P(defect)')
plt.ylabel('probability')
plt.show()`
  },

  "prob-independence": {
    question: "Are two coin flips independent? Compare P(A)P(B) with P(A and B).",
    charts: [{
      type: "bars",
      title: "Independence test: product vs actual joint probability",
      labels: ["P(A)","P(B)","P(A)P(B)","P(A and B)"],
      values: [0.5,0.5,0.25,0.25],
      valueLabels: ["0.50","0.50","0.25","0.25"],
      colors: ["#4ea1ff","#7ee787","#c89bff","#ffb454"]
    }],
    caption: "P(A)P(B) = 0.25 equals the actual P(A and B) = 0.25, so the two flips are independent.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Theoretical fair-coin probabilities for two flips.
pA = 0.5
pB = 0.5
vals = [pA, pB, pA * pB, 0.25]   # last is true joint P(A and B)

labels = ['P(A)', 'P(B)', 'P(A)P(B)', 'P(A and B)']
colors = ['#4ea1ff', '#7ee787', '#c89bff', '#ffb454']
plt.bar(labels, vals, color=colors)
plt.title('Independence test: product vs actual joint probability')
plt.ylabel('probability')
plt.show()`
  },

  "prob-counting": {
    question: "Picking 3 from 5: how many ordered arrangements vs unordered picks?",
    charts: [{
      type: "bars",
      title: "Permutations vs combinations (n=5, r=3)",
      labels: ["P(5,3) ordered","C(5,3) unordered","r! = 3!"],
      values: [60,10,6],
      valueLabels: ["60","10","6"],
      colors: ["#4ea1ff","#7ee787","#ffb454"]
    }],
    caption: "Order gives 60 arrangements; ignoring order divides by 3!=6 to leave 10 distinct picks.",
    code: `import matplotlib.pyplot as plt
from scipy.special import perm, comb
from math import factorial

# Pick r from n: ordered (permutations) vs unordered (combinations).
n, r = 5, 3
vals = [int(perm(n, r)), int(comb(n, r)), factorial(r)]

labels = ['P(5,3) ordered', 'C(5,3) unordered', 'r! = 3!']
colors = ['#4ea1ff', '#7ee787', '#ffb454']
plt.bar(labels, vals, color=colors)
plt.title('Permutations vs combinations (n=5, r=3)')
plt.ylabel('count')
plt.show()`
  },

  "prob-random-variable": {
    question: "What is the distribution of heads in 3 fair flips?",
    charts: [{
      type: "bars",
      title: "PMF of X = heads in 3 flips  ~ Binomial(3, 0.5)",
      labels: ["0","1","2","3"],
      values: [0.125,0.375,0.375,0.125],
      valueLabels: ["1/8","3/8","3/8","1/8"],
      colors: ["#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff"]
    }],
    caption: "The four probabilities 1/8, 3/8, 3/8, 1/8 sum to 1, exactly as scipy's binom.pmf returns.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import binom

# X = heads in 3 fair flips ~ Binomial(3, 0.5).
n, p = 3, 0.5
k = np.arange(0, n + 1)
pmf = binom.pmf(k, n, p)

plt.bar([str(j) for j in k], pmf, color='#4ea1ff')
plt.title('PMF of X = heads in 3 flips  ~ Binomial(3, 0.5)')
plt.xlabel('heads')
plt.ylabel('probability')
plt.show()`
  },

  "prob-expectation": {
    question: "Where does the probability-weighted average of a die land?",
    charts: [{
      type: "bars",
      title: "Fair die PMF with the mean E[X] = 3.5 marked",
      labels: ["1","2","3","4","5","6"],
      values: [0.1667,0.1667,0.1667,0.1667,0.1667,0.1667],
      valueLabels: ["1/6","1/6","1/6","mean 3.5","1/6","1/6"],
      colors: ["#4ea1ff","#4ea1ff","#4ea1ff","#ffb454","#4ea1ff","#4ea1ff"]
    }],
    caption: "Every face has probability 1/6, and the weighted average E[X] = 3.5 sits between faces 3 and 4 (amber).",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Fair die PMF and its mean E[X] = sum x * p(x).
x = np.arange(1, 7)
p = np.full(6, 1 / 6)
EX = np.sum(x * p)

plt.bar([str(v) for v in x], p, color='#4ea1ff')
plt.axvline(EX - 1, color='#ffb454', linewidth=2)  # bar index for mean 3.5
plt.title('Fair die PMF with the mean E[X] = 3.5 marked')
plt.xlabel('face')
plt.ylabel('probability')
plt.show()`
  },

  "prob-variance": {
    question: "How far do die faces sit from the mean, and what is the variance?",
    charts: [{
      type: "bars",
      title: "Squared deviations (x-3.5)^2 per face; Var(X) is their average",
      labels: ["1","2","3","4","5","6"],
      values: [6.25,2.25,0.25,0.25,2.25,6.25],
      valueLabels: ["6.25","2.25","0.25","0.25","2.25","6.25"],
      colors: ["#c89bff","#c89bff","#c89bff","#c89bff","#c89bff","#c89bff"]
    }],
    caption: "Averaging these squared deviations with weight 1/6 gives Var(X) = 2.917 and std = 1.708.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Squared deviations of each die face from the mean 3.5.
x = np.arange(1, 7)
p = np.full(6, 1 / 6)
mu = np.sum(x * p)
sq_dev = (x - mu) ** 2

plt.bar([str(v) for v in x], sq_dev, color='#c89bff')
plt.title('Squared deviations (x-3.5)^2 per face; Var(X) is their average')
plt.xlabel('face')
plt.ylabel('(x - mu)^2')
plt.show()`
  },

  "prob-bernoulli-binomial": {
    question: "What does a Binomial(10, 0.3) distribution look like?",
    charts: [{
      type: "bars",
      title: "PMF of Binomial(n=10, p=0.3); mean n*p = 3 marked",
      labels: ["0","1","2","3","4","5","6","7","8","9","10"],
      values: [0.0282,0.1211,0.2335,0.2668,0.2001,0.1029,0.0368,0.0090,0.0014,0.0001,0.0000],
      valueLabels: ["0.028","0.121","0.234","mean=3","0.200","0.103","0.037","0.009","0.001","0.000","0.000"],
      colors: ["#4ea1ff","#4ea1ff","#4ea1ff","#ffb454","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff"]
    }],
    caption: "The PMF peaks near the mean n*p = 3 (amber) with variance n*p*(1-p) = 2.1, matching scipy's binom.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import binom

# Binomial(n=10, p=0.3); highlight the mean bar at k = n*p = 3.
n, p = 10, 0.3
k = np.arange(0, n + 1)
pmf = binom.pmf(k, n, p)

mean = int(n * p)
colors = ['#ffb454' if j == mean else '#4ea1ff' for j in k]
plt.bar([str(j) for j in k], pmf, color=colors)
plt.title('PMF of Binomial(n=10, p=0.3); mean n*p = 3 marked')
plt.xlabel('successes')
plt.ylabel('probability')
plt.show()`
  },

  "prob-geometric-poisson": {
    question: "How do the geometric and Poisson PMFs compare in shape?",
    charts: [
      {
        type: "bars",
        title: "Geometric(p=0.25): trial of first success (mean 1/p = 4)",
        labels: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"],
        values: [0.25,0.1875,0.1406,0.1055,0.0791,0.0593,0.0445,0.0334,0.025,0.0188,0.0141,0.0106,0.0079,0.0059,0.0045],
        colors: ["#7ee787"]
      },
      {
        type: "bars",
        title: "Poisson(lambda=4): events per window (mean = var = 4)",
        labels: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"],
        values: [0.0183,0.0733,0.1465,0.1954,0.1954,0.1563,0.1042,0.0595,0.0298,0.0132,0.0053,0.0019,0.0006,0.0002,0.0001,0.0000],
        colors: ["#4ea1ff"]
      }
    ],
    caption: "Geometric decays monotonically from its peak at trial 1; Poisson(4) is humped around its mean of 4.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import geom, poisson

# Geometric(0.25): trial of first success. Poisson(4): events per window.
gk = np.arange(1, 16)
g_pmf = geom.pmf(gk, 0.25)
pk = np.arange(0, 16)
p_pmf = poisson.pmf(pk, 4.0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.bar([str(v) for v in gk], g_pmf, color='#7ee787')
ax1.set_title('Geometric(p=0.25): trial of first success (mean 1/p = 4)')
ax2.bar([str(v) for v in pk], p_pmf, color='#4ea1ff')
ax2.set_title('Poisson(lambda=4): events per window (mean = var = 4)')
plt.show()`
  },

  "prob-pdf-cdf": {
    question: "How does the standard normal PDF relate to its CDF?",
    charts: [{
      type: "line",
      title: "Standard normal: PDF f(x) and CDF F(x) = P(X <= x)",
      xlabel: "x",
      ylabel: "density / probability",
      series: [
        { name: "PDF f(x)", color: "#4ea1ff", points: [[-4,0.0001],[-3.6,0.0006],[-3.2,0.0024],[-2.8,0.0079],[-2.4,0.0224],[-2,0.054],[-1.6,0.1109],[-1.2,0.1942],[-0.8,0.2897],[-0.4,0.3683],[0,0.3989],[0.4,0.3683],[0.8,0.2897],[1.2,0.1942],[1.6,0.1109],[2,0.054],[2.4,0.0224],[2.8,0.0079],[3.2,0.0024],[3.6,0.0006],[4,0.0001]] },
        { name: "CDF F(x)", color: "#ffb454", points: [[-4,0],[-3.6,0.0002],[-3.2,0.0007],[-2.8,0.0026],[-2.4,0.0082],[-2,0.0228],[-1.6,0.0548],[-1.2,0.1151],[-0.8,0.2119],[-0.4,0.3446],[0,0.5],[0.4,0.6554],[0.8,0.7881],[1.2,0.8849],[1.6,0.9452],[2,0.9772],[2.4,0.9918],[2.8,0.9974],[3.2,0.9993],[3.6,0.9998],[4,1]] }
      ]
    }],
    caption: "The CDF accumulates area under the PDF: F(0)=0.5 by symmetry, and P(-1<X<1)=F(1)-F(-1)=0.683.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# Standard normal PDF f(x) and CDF F(x) on a grid.
x = np.linspace(-4, 4, 200)
pdf = norm.pdf(x)
cdf = norm.cdf(x)

plt.plot(x, pdf, color='#4ea1ff', label='PDF f(x)')
plt.plot(x, cdf, color='#ffb454', label='CDF F(x)')
plt.title('Standard normal: PDF f(x) and CDF F(x) = P(X <= x)')
plt.xlabel('x')
plt.ylabel('density / probability')
plt.legend()
plt.show()`
  },

  "prob-uniform-exponential": {
    question: "How do the flat uniform PDF and the decaying exponential PDF differ?",
    charts: [{
      type: "line",
      title: "Uniform(0,10) PDF (flat) vs Exponential(rate 0.5) PDF (decay)",
      xlabel: "x",
      ylabel: "density",
      series: [
        { name: "Uniform(0,10)", color: "#7ee787", points: [[0,0.1],[1,0.1],[2,0.1],[3,0.1],[4,0.1],[5,0.1],[6,0.1],[7,0.1],[8,0.1],[9,0.1],[10,0.1],[10,0],[11,0],[12,0]] },
        { name: "Exponential(0.5)", color: "#4ea1ff", points: [[0,0.5],[0.5,0.3894],[1,0.3033],[1.5,0.2362],[2,0.1839],[2.5,0.1433],[3,0.1116],[3.5,0.0869],[4,0.0677],[4.5,0.0527],[5,0.041],[6,0.032],[7,0.0151],[8,0.0092],[9,0.0056],[10,0.0034],[11,0.002],[12,0.0012]] }
      ]
    }],
    caption: "Uniform is flat at 1/10 over [0,10] (mean 5); exponential starts at the rate 0.5 and decays, mean 1/lambda = 2.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import uniform, expon

# Uniform(0,10) PDF (flat) vs Exponential(rate 0.5) PDF (decay).
xu = np.linspace(0, 12, 200)
u_pdf = uniform(loc=0, scale=10).pdf(xu)
xe = np.linspace(0, 12, 200)
e_pdf = expon(scale=1 / 0.5).pdf(xe)

plt.plot(xu, u_pdf, color='#7ee787', label='Uniform(0,10)')
plt.plot(xe, e_pdf, color='#4ea1ff', label='Exponential(0.5)')
plt.title('Uniform(0,10) PDF (flat) vs Exponential(rate 0.5) PDF (decay)')
plt.xlabel('x')
plt.ylabel('density')
plt.legend()
plt.show()`
  },

  "prob-normal": {
    question: "Does the 68-95-99.7 rule hold for Normal(100, 15)?",
    charts: [
      {
        type: "line",
        title: "Normal(mu=100, sigma=15) PDF",
        xlabel: "x",
        ylabel: "density",
        series: [
          { name: "PDF", color: "#4ea1ff", points: [[40,0.000009],[50,0.000103],[55,0.000295],[60,0.00076],[65,0.001748],[70,0.003599],[75,0.006632],[80,0.010934],[85,0.016131],[90,0.021297],[95,0.025159],[100,0.026596],[105,0.025159],[110,0.021297],[115,0.016131],[120,0.010934],[125,0.006632],[130,0.003599],[135,0.001748],[140,0.00076],[145,0.000295],[150,0.000103],[160,0.000009]] }
        ]
      },
      {
        type: "bars",
        title: "68-95-99.7 rule: probability within k standard deviations",
        labels: ["within 1 sigma","within 2 sigma","within 3 sigma"],
        values: [0.6827,0.9545,0.9973],
        valueLabels: ["0.683","0.954","0.997"],
        colors: ["#7ee787","#ffb454","#c89bff"]
      }
    ],
    caption: "The bell curve centers at 100, and integrating it confirms the 68-95-99.7 rule (0.683 / 0.954 / 0.997).",
    code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# Normal(100, 15) PDF, and the within-k-sigma probabilities.
mu, sigma = 100, 15
d = norm(loc=mu, scale=sigma)
x = np.linspace(40, 160, 200)
within = [d.cdf(mu + k * sigma) - d.cdf(mu - k * sigma) for k in (1, 2, 3)]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.plot(x, d.pdf(x), color='#4ea1ff')
ax1.set_title('Normal(mu=100, sigma=15) PDF')
ax2.bar(['within 1 sigma', 'within 2 sigma', 'within 3 sigma'], within,
        color=['#7ee787', '#ffb454', '#c89bff'])
ax2.set_title('68-95-99.7 rule: probability within k standard deviations')
plt.show()`
  },

  "prob-joint-marginal": {
    question: "How do marginals fall out of a joint distribution table?",
    charts: [{
      type: "heatmap",
      title: "Joint PMF P(X, Y); row sums = P(X), column sums = P(Y)",
      rows: ["X=0  (sum 0.3)","X=1  (sum 0.7)"],
      cols: ["Y=0 (0.3)","Y=1 (0.4)","Y=2 (0.3)"],
      matrix: [[0.10,0.15,0.05],[0.20,0.25,0.25]],
      showVals: true
    }],
    caption: "Summing a row gives the X marginal (0.3, 0.7); summing a column gives the Y marginal (0.3, 0.4, 0.3).",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Joint PMF table: rows = X in {0,1}, cols = Y in {0,1,2}.
joint = np.array([[0.10, 0.15, 0.05],
                  [0.20, 0.25, 0.25]])

fig, ax = plt.subplots()
im = ax.imshow(joint, cmap='viridis')
for i in range(joint.shape[0]):
    for j in range(joint.shape[1]):
        ax.text(j, i, joint[i, j], ha='center', va='center', color='w')
ax.set_xticks(range(3), ['Y=0 (0.3)', 'Y=1 (0.4)', 'Y=2 (0.3)'])
ax.set_yticks(range(2), ['X=0  (sum 0.3)', 'X=1  (sum 0.7)'])
ax.set_title('Joint PMF P(X, Y); row sums = P(X), column sums = P(Y)')
fig.colorbar(im)
plt.show()`
  },

  "prob-covariance-correlation": {
    question: "What do positive, negative, and zero correlation look like?",
    charts: [{
      type: "scatter",
      title: "Three samples: positive (r=0.91), negative, and zero correlation",
      xlabel: "X",
      ylabel: "Y",
      groups: [
        { name: "Y = 2X + noise  (r=0.91)", color: "#7ee787", points: [[0.126,1.455],[-0.132,0.373],[0.64,1.839],[0.105,-3.562],[-0.536,-0.811],[0.362,0.698],[1.304,2.461],[0.947,1.264],[-0.704,-1.352],[-1.265,-2.119],[-0.623,-1.51],[-2.325,-3.42],[-1.246,-1.462],[-0.544,-1.893],[0.412,-0.097],[1.043,2.76],[1.366,2.176],[-0.665,-2.433],[0.903,2.764],[-0.743,-1.069],[-0.922,-2.219],[-1.01,-1.725],[0.541,0.852],[-0.654,-0.987],[0.784,2.757],[1.493,1.283],[-1.259,-3.557],[1.514,3.264],[1.346,4.155],[0.781,1.841],[1.458,2.725],[1.96,3.901],[1.802,5.294],[1.315,3.252],[-1.208,-0.39],[0.656,0.433],[-1.288,-1.102],[0.696,1.611],[-1.184,-1.523],[-1.17,-0.341]] },
        { name: "Y = -2X + noise  (r<0)", color: "#ff7b72", points: [[0.126,-1.408],[-0.132,-1.101],[0.64,-1.512],[0.105,2.068],[-0.536,1.349],[0.362,0.04],[1.304,-2.395],[0.947,-1.111],[-0.704,0.064],[-1.265,2.1],[-0.623,1.508],[-2.325,4.458],[-1.246,2.233],[-0.544,-1.333],[0.412,-0.348],[1.043,-0.528],[1.366,-2.636],[-0.665,2.224],[0.903,-2.499],[-0.743,1.518],[-0.922,0.596],[-1.01,0.599],[0.541,-0.72],[-0.654,3.041],[0.784,-0.338],[1.493,-3.051],[-1.259,1.972],[1.514,-2.713],[1.346,-3.298],[0.781,-2.136],[1.458,-2.811],[1.96,-5.184],[1.802,-3.711],[1.315,-1.18],[-1.208,1.875],[0.656,-0.767],[-1.288,3.553],[0.696,-0.112],[-1.184,1.692],[-1.17,0.274]] },
        { name: "Y independent of X  (r~0)", color: "#9aa7b4", points: [[0.126,-0.701],[-0.132,1.338],[0.64,0.582],[0.105,-1.752],[-0.536,1.041],[0.362,-1.075],[1.304,-0.178],[0.947,0.668],[-0.704,-0.3],[-1.265,1.119],[-0.623,0.761],[-2.325,-0.472],[-1.246,-0.575],[-0.544,0.8],[0.412,-0.921],[1.043,0.175],[1.366,-0.612],[-0.665,-1.215],[0.903,-1.13],[-0.743,0.287],[-0.922,-0.028],[-1.01,-1.146],[0.541,-0.184],[-0.654,-1.037],[0.784,-0.165],[1.493,-1.383],[-1.259,0.669],[1.514,2.487],[1.346,0.459],[0.781,-1.043],[1.458,-0.271],[1.96,-1.555],[1.802,-0.378],[1.315,0.507],[-1.208,0.589],[0.656,-1.032],[-1.288,0.299],[0.696,1.156],[-1.184,1.755],[-1.17,-0.701]] }
      ]
    }],
    caption: "Y = 2X + noise rises with X (r = 0.91, Cov = 2.12); flipping the sign gives a downward cloud; independent Y shows no tilt (r ~ 0).",
    code: `import numpy as np
import matplotlib.pyplot as plt

# One shared X; three Y's: positive, negative, and zero correlation.
rng = np.random.default_rng(0)
X = rng.normal(0, 1, size=40)
Y_pos = 2 * X + rng.normal(0, 1, size=40)
Y_neg = -2 * X + rng.normal(0, 1, size=40)
Y_zero = rng.normal(0, 1, size=40)

plt.scatter(X, Y_pos, color='#7ee787', label='Y = 2X + noise  (r=0.91)')
plt.scatter(X, Y_neg, color='#ff7b72', label='Y = -2X + noise  (r<0)')
plt.scatter(X, Y_zero, color='#9aa7b4', label='Y independent of X  (r~0)')
plt.title('Three samples: positive (r=0.91), negative, and zero correlation')
plt.xlabel('X')
plt.ylabel('Y')
plt.legend()
plt.show()`
  },

  "prob-conditional-expectation": {
    question: "Does the law of total expectation recover E[Y] from group means?",
    charts: [{
      type: "bars",
      title: "E[Y | X=g] per group vs overall E[Y]",
      labels: ["E[Y|X=0]","E[Y|X=1]","E[Y|X=2]","overall E[Y]"],
      values: [1.0,4.004,9.0,4.6716],
      valueLabels: ["1.00","4.00","9.00","4.67"],
      colors: ["#4ea1ff","#4ea1ff","#4ea1ff","#ffb454"]
    }],
    caption: "The group means 1, 4, 9 match their targets, and weighting them by P(X=g) reproduces the overall E[Y] = 4.67.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Group label X in {0,1,2}; Y mean depends on the group (1, 4, 9).
rng = np.random.default_rng(0)
n = 1_000_000
X = rng.integers(0, 3, size=n)
means = np.array([1.0, 4.0, 9.0])
Y = means[X] + rng.normal(0, 1, size=n)

condE = [Y[X == g].mean() for g in range(3)]
overall = Y.mean()
vals = condE + [overall]

labels = ['E[Y|X=0]', 'E[Y|X=1]', 'E[Y|X=2]', 'overall E[Y]']
colors = ['#4ea1ff', '#4ea1ff', '#4ea1ff', '#ffb454']
plt.bar(labels, vals, color=colors)
plt.title('E[Y | X=g] per group vs overall E[Y]')
plt.ylabel('expected value')
plt.show()`
  },

  "prob-inequalities": {
    question: "How loose are the Markov and Chebyshev tail bounds?",
    charts: [{
      type: "bars",
      title: "Tail bounds vs the true tail for Exponential(mean 1)",
      labels: ["Markov bound","true P(X>=4)","Chebyshev bound","true P(|X-mu|>=3s)"],
      values: [0.25,0.0183,0.1111,0.0183],
      valueLabels: ["0.250","0.018","0.111","0.018"],
      colors: ["#ffb454","#7ee787","#ffb454","#7ee787"]
    }],
    caption: "Both bounds (amber: 0.25 and 0.111) sit safely above the true tail probability of 0.018 (green) — valid but loose.",
    code: `import matplotlib.pyplot as plt
from scipy.stats import expon

# Exponential(mean 1): Markov and Chebyshev bounds vs the true tails.
mu = 1.0
d = expon(scale=1.0)
markov = mu / 4.0                 # P(X >= 4) <= mu / a
true_tail = float(d.sf(4.0))
cheby = 1 / 3.0 ** 2              # P(|X-mu| >= 3 sigma) <= 1/k^2
true_cheby = float(d.sf(mu + 3.0))   # sigma = 1, lower side empty

vals = [markov, true_tail, cheby, true_cheby]
labels = ['Markov bound', 'true P(X>=4)', 'Chebyshev bound', 'true P(|X-mu|>=3s)']
colors = ['#ffb454', '#7ee787', '#ffb454', '#7ee787']
plt.bar(labels, vals, color=colors)
plt.title('Tail bounds vs the true tail for Exponential(mean 1)')
plt.ylabel('probability')
plt.show()`
  },

  "prob-lln": {
    question: "Does the running average of die rolls converge to 3.5?",
    charts: [{
      type: "line",
      title: "Law of large numbers: running average of die rolls converges to 3.5",
      xlabel: "sample size n (log scale labels)",
      ylabel: "running average",
      series: [
        { name: "running average", color: "#4ea1ff", points: [[1,2.8],[2,3.7333],[3,3.62],[4,3.66],[5,3.6],[6,3.5667],[7,3.5045],[8,3.4968],[9,3.498],[10,3.5],[11,3.5022]] },
        { name: "true mean 3.5", color: "#ff7b72", points: [[1,3.5],[11,3.5]] }
      ]
    }],
    caption: "As n grows (10 up to 1,000,000 along the x-axis), the average tightens onto the true mean 3.5 (red line).",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Running average of die rolls at growing sample sizes.
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=1_000_000).astype(float)
ns = np.array([10, 30, 100, 300, 1000, 3000, 10000, 30000,
               100000, 300000, 1_000_000])
avgs = np.array([rolls[:n].mean() for n in ns])

plt.plot(ns, avgs, color='#4ea1ff', marker='o', label='running average')
plt.axhline(3.5, color='#ff7b72', label='true mean 3.5')
plt.xscale('log')
plt.title('Law of large numbers: running average of die rolls converges to 3.5')
plt.xlabel('sample size n (log scale labels)')
plt.ylabel('running average')
plt.legend()
plt.show()`
  },

  "prob-clt": {
    question: "How does the central limit theorem shape the distribution of sample means?",
    charts: [
      {
        type: "bars",
        title: "Sampling distribution of the mean of 30 Uniform(0,1) draws",
        labels: ["0.34","0.36","0.38","0.40","0.42","0.43","0.45","0.46","0.48","0.49","0.51","0.52","0.54","0.55","0.57","0.58","0.60","0.62","0.63","0.65"],
        values: [0.021,0.074,0.158,0.358,0.785,1.313,2.19,3.316,4.521,5.943,6.971,7.465,7.417,6.796,5.659,4.431,3.158,2.054,1.223,0.677],
        colors: ["#7ee787"]
      },
      {
        type: "line",
        title: "Spread of the sample mean shrinks as 1/sqrt(n)",
        xlabel: "samples per average n",
        ylabel: "std of sample mean",
        series: [
          { name: "std = sqrt((1/12)/n)", color: "#4ea1ff", points: [[1,0.2887],[2,0.2041],[5,0.1291],[10,0.0913],[20,0.0645],[30,0.0527],[50,0.0408],[100,0.0289]] }
        ]
      }
    ],
    caption: "Averaging 30 uniform draws yields a bell centered at 0.5; the second chart shows the mean's std narrowing as 1/sqrt(n) toward 0 (0.0527 at n=30).",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Sampling distribution of the mean of 30 Uniform(0,1) draws.
rng = np.random.default_rng(0)
data = rng.uniform(0, 1, size=(200000, 30))
means = data.mean(axis=1)

# Std of the sample mean shrinks as 1/sqrt(n).
ns = np.array([1, 2, 5, 10, 20, 30, 50, 100])
sds = np.sqrt((1 / 12) / ns)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.hist(means, bins=40, density=True, color='#7ee787')
ax1.set_title('Sampling distribution of the mean of 30 Uniform(0,1) draws')
ax2.plot(ns, sds, color='#4ea1ff', marker='o')
ax2.set_title('Spread of the sample mean shrinks as 1/sqrt(n)')
ax2.set_xlabel('samples per average n')
ax2.set_ylabel('std of sample mean')
plt.show()`
  },

  "prob-estimation": {
    question: "Do sample estimators recover a normal's true mean and variance?",
    charts: [{
      type: "bars",
      title: "Estimates vs truth for Normal(mu=5, sigma^2=4), n=2000",
      labels: ["mu_hat","true mu","var (ddof=0)","var (ddof=1)","true var"],
      values: [4.9439,5.0,4.0016,4.0036,4.0],
      valueLabels: ["4.944","5.000","4.002","4.004","4.000"],
      colors: ["#4ea1ff","#7ee787","#c89bff","#c89bff","#7ee787"]
    }],
    caption: "The sample mean (4.944) and the n-1 corrected variance (4.004) land on their true values (5 and 4), matching scipy's norm.fit.",
    code: `import numpy as np
import matplotlib.pyplot as plt

# Estimate mu and variance from a Normal(5, sigma^2=4) sample.
rng = np.random.default_rng(0)
x = rng.normal(5.0, 2.0, size=2000)

mu_hat = x.mean()
var0 = x.var(ddof=0)
var1 = x.var(ddof=1)
vals = [mu_hat, 5.0, var0, var1, 4.0]

labels = ['mu_hat', 'true mu', 'var (ddof=0)', 'var (ddof=1)', 'true var']
colors = ['#4ea1ff', '#7ee787', '#c89bff', '#c89bff', '#7ee787']
plt.bar(labels, vals, color=colors)
plt.title('Estimates vs truth for Normal(mu=5, sigma^2=4), n=2000')
plt.ylabel('value')
plt.show()`
  }

});
