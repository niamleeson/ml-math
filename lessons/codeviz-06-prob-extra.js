/* =====================================================================
   CODEVIZ SECTION — Module 6 (Probability, advanced).
   One window.CODEVIZ entry per lesson in 06-prob-extra.js.
   Charts are built from REAL numbers produced by running the lesson's
   Python (numpy/scipy) code: formula vs Monte-Carlo, every value verified.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "probx-derived": {
    question: "Does the change-of-variables formula f_Y(y) = 1/(2 sqrt(y)) match a simulated histogram of Y = X^2?",
    charts: [
      {
        type: "line",
        title: "Derived density of Y = X^2 from X uniform on 0..1: formula vs simulation",
        xlabel: "y",
        ylabel: "density f_Y(y)",
        series: [
          {
            name: "formula 1/(2 sqrt(y))",
            color: "#ffb454",
            points: [
              { x: 0.065, y: 2.000 }, { x: 0.125, y: 1.429 }, { x: 0.205, y: 1.111 },
              { x: 0.305, y: 0.909 }, { x: 0.425, y: 0.769 }, { x: 0.565, y: 0.667 },
              { x: 0.725, y: 0.588 }
            ]
          },
          {
            name: "Monte-Carlo histogram",
            color: "#4ea1ff",
            points: [
              { x: 0.065, y: 1.999 }, { x: 0.125, y: 1.422 }, { x: 0.205, y: 1.113 },
              { x: 0.305, y: 0.910 }, { x: 0.425, y: 0.769 }, { x: 0.565, y: 0.667 },
              { x: 0.725, y: 0.588 }
            ]
          }
        ]
      },
      {
        type: "bars",
        title: "Density height at sample y values (formula): squaring piles probability near 0",
        labels: ["0.04", "0.09", "0.16", "0.25", "0.36", "0.49", "0.64", "0.81"],
        values: [2.500, 1.667, 1.250, 1.000, 0.833, 0.714, 0.625, 0.556],
        valueLabels: ["2.50", "1.67", "1.25", "1.00", "0.83", "0.71", "0.62", "0.56"],
        colors: ["#7ee787"]
      }
    ],
    caption: "The simulated histogram lands right on the formula curve, blowing up near y=0 and thinning near y=1, with E[Y] = 0.333.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# X ~ Uniform[0,1], Y = X^2.  Formula density: f_Y(y) = 1/(2 sqrt(y)).
rng = np.random.default_rng(0)
y_sim = rng.random(2_000_000) ** 2

# Chart 1: formula curve vs Monte-Carlo histogram heights at bin centers.
centers = np.array([0.065, 0.125, 0.205, 0.305, 0.425, 0.565, 0.725])
formula = 1.0 / (2.0 * np.sqrt(centers))
edges = np.array([0.04, 0.09, 0.16, 0.25, 0.36, 0.49, 0.64, 0.81])
mc, _ = np.histogram(y_sim, bins=edges, density=True)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.plot(centers, formula, '-o', color='#ffb454', label='formula 1/(2 sqrt(y))')
ax1.plot(centers, mc, '-o', color='#4ea1ff', label='Monte-Carlo histogram')
ax1.set_xlabel('y'); ax1.set_ylabel('density f_Y(y)'); ax1.legend()
ax1.set_title('Derived density of Y = X^2: formula vs simulation')

# Chart 2: formula density height at sample y values (squaring piles mass near 0).
ys = np.array([0.04, 0.09, 0.16, 0.25, 0.36, 0.49, 0.64, 0.81])
heights = 1.0 / (2.0 * np.sqrt(ys))
ax2.bar([str(v) for v in ys], heights, color='#7ee787')
ax2.set_title('Density height at sample y values (formula)')
plt.tight_layout(); plt.show()`
  },

  "probx-convolution": {
    question: "What PMF do you get from convolving two flat distributions, and does it match simulation?",
    charts: [
      {
        type: "bars",
        title: "Tent PMF of Z = A + B: A on 1..3, B on 1..2, each uniform (sums 2..5)",
        labels: ["2", "3", "4", "5"],
        values: [0.1667, 0.3333, 0.3333, 0.1667],
        valueLabels: ["0.167", "0.333", "0.333", "0.167"],
        colors: ["#c89bff"]
      },
      {
        type: "bars",
        title: "Two fair 6-sided dice: convolution PMF peaks at sum 7 (triangle)",
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        values: [0.0278, 0.0556, 0.0833, 0.1111, 0.1389, 0.1667, 0.1389, 0.1111, 0.0833, 0.0556, 0.0278],
        valueLabels: ["0.028", "0.056", "0.083", "0.111", "0.139", "0.167", "0.139", "0.111", "0.083", "0.056", "0.028"],
        colors: ["#4ea1ff"]
      }
    ],
    caption: "Convolving two flat inputs gives a flat-topped tent; two flat dice give a triangle peaking at 7 with probability 0.167, matching Monte-Carlo to four decimals.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# PMF of a sum = convolution of the input PMFs.
# Chart 1: A on {1,2,3}, B on {1,2}, each uniform -> tent PMF over sums 2..5.
a = np.full(3, 1/3)                  # P(A) on 1..3
b = np.full(2, 1/2)                  # P(B) on 1..2
tent = np.convolve(a, b)            # index 0 -> sum 2
tent_sums = np.arange(2, 6)

# Chart 2: two fair dice, faces uniform on 1..6 -> triangle PMF peaking at 7.
face = np.full(6, 1/6)
dice = np.convolve(face, face)     # index 0 -> sum 2
dice_sums = np.arange(2, 13)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.bar([str(s) for s in tent_sums], tent, color='#c89bff')
ax1.set_title('Tent PMF of Z = A + B (sums 2..5)')
ax2.bar([str(s) for s in dice_sums], dice, color='#4ea1ff')
ax2.set_title('Two fair dice: convolution PMF peaks at 7')
plt.tight_layout(); plt.show()`
  },

  "probx-total-variance": {
    question: "Does within-group plus between-group variance add up to the total variance of the mixture?",
    charts: [
      {
        type: "bars",
        title: "Variance decomposition: within + between = total (two classes, means 70 and 80)",
        labels: ["within E[Var(X|Y)]", "between Var(E[X|Y])", "formula total", "Monte-Carlo Var(X)"],
        values: [25.0, 25.0, 50.0, 49.91],
        valueLabels: ["25.0", "25.0", "50.0", "49.9"],
        colors: ["#7ee787", "#c89bff", "#ffb454", "#4ea1ff"]
      }
    ],
    caption: "Within-group scatter (25) plus between-group scatter of the class means (25) sum to the total variance 50, confirmed by the raw simulated variance 49.9.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# Law of total variance: Var(X) = E[Var(X|Y)] + Var(E[X|Y]).
# Two equal classes, means 70/80, shared within-group variance 25.
rng = np.random.default_rng(0)
means = np.array([70.0, 80.0]); within_var = 25.0
n = 1_000_000
grp = rng.integers(0, 2, n)
x = rng.normal(means[grp], np.sqrt(within_var))

within = within_var                         # E[Var(X|Y)]
between = np.mean((means - means.mean()) ** 2)   # Var(E[X|Y]), equal weights
total = within + between                    # formula total
mc = x.var()                                # raw simulated variance

labels = ['within E[Var(X|Y)]', 'between Var(E[X|Y])', 'formula total', 'Monte-Carlo Var(X)']
vals = [within, between, total, mc]
colors = ['#7ee787', '#c89bff', '#ffb454', '#4ea1ff']
plt.figure(figsize=(8, 4))
plt.bar(labels, vals, color=colors)
plt.title('Variance decomposition: within + between = total')
plt.xticks(rotation=20, ha='right')
plt.tight_layout(); plt.show()`
  },

  "probx-mgf": {
    question: "Can you read the mean and E[X^2] off the MGF M(t) = lambda/(lambda - t) by differentiating at t = 0?",
    charts: [
      {
        type: "line",
        title: "MGF of Exponential rate 1.5: M(t) = lambda/(lambda - t), blows up at t = 1.5",
        xlabel: "t",
        ylabel: "M(t)",
        series: [
          {
            name: "M(t)",
            color: "#4ea1ff",
            points: [
              { x: -2.0, y: 0.4286 }, { x: -1.5, y: 0.5000 }, { x: -1.0, y: 0.6000 },
              { x: -0.5, y: 0.7500 }, { x: 0.0, y: 1.0000 }, { x: 0.5, y: 1.5000 },
              { x: 1.0, y: 3.0000 }, { x: 1.25, y: 6.0000 }
            ]
          }
        ]
      },
      {
        type: "bars",
        title: "Moments of Exponential(1.5): MGF derivatives vs exact vs Monte-Carlo",
        labels: ["E[X] MGF", "E[X] exact", "E[X^2] MGF", "E[X^2] exact", "Var MGF", "Var MC"],
        values: [0.6667, 0.6667, 0.8889, 0.8889, 0.4444, 0.4440],
        valueLabels: ["0.667", "0.667", "0.889", "0.889", "0.444", "0.444"],
        colors: ["#4ea1ff", "#7ee787", "#4ea1ff", "#7ee787", "#ffb454", "#c89bff"]
      }
    ],
    caption: "The slope of M(t) at t=0 gives E[X]=0.667 and the curvature gives E[X^2]=0.889, so Var=0.444, all matching the exact 1/lambda and 1/lambda^2 and the simulated sample.",
    code:
`import numpy as np
import matplotlib.pyplot as plt

# MGF of Exponential(rate=lam): M(t) = lam/(lam - t), valid for t < lam.
lam = 1.5
M = lambda t: lam / (lam - t)

# Chart 1: the MGF curve; it blows up as t -> lam = 1.5.
t = np.array([-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.25])
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.plot(t, M(t), '-o', color='#4ea1ff', label='M(t)')
ax1.set_xlabel('t'); ax1.set_ylabel('M(t)'); ax1.legend()
ax1.set_title('MGF of Exponential rate 1.5: blows up at t = 1.5')

# Chart 2: read moments off M by finite-difference derivatives at t=0.
h = 1e-4
m1 = (M(h) - M(-h)) / (2 * h)              # M'(0)  = E[X]
m2 = (M(h) - 2 * M(0) + M(-h)) / (h * h)   # M''(0) = E[X^2]
var_mgf = m2 - m1 ** 2
rng = np.random.default_rng(0)
xs = rng.exponential(1 / lam, 2_000_000)   # Monte-Carlo sample
labels = ['E[X] MGF', 'E[X] exact', 'E[X^2] MGF', 'E[X^2] exact', 'Var MGF', 'Var MC']
vals = [m1, 1 / lam, m2, 2 / lam ** 2, var_mgf, xs.var()]
colors = ['#4ea1ff', '#7ee787', '#4ea1ff', '#7ee787', '#ffb454', '#c89bff']
ax2.bar(labels, vals, color=colors)
ax2.set_title('Moments of Exponential(1.5): MGF vs exact vs MC')
ax2.tick_params(axis='x', rotation=30)
plt.tight_layout(); plt.show()`
  }

});
