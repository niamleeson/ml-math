/* Per-lesson CODE VISUALIZATIONS — 06-prob-extra.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["probx-derived"] = {
  question: "X is flat on [0,1]. Push it through a transform. Where does the probability pile up, and why does the density change height?",
  charts: [
    {
      type: "line",
      title: "Healthy: f_X (flat) reshaped into f_Y(y) = 1/(2*sqrt(y)) for Y = X^2",
      xlabel: "value",
      ylabel: "density (prob per unit length)",
      series: [
        {
          name: "f_X(x) = 1 on [0,1] (input, flat)",
          color: "#9aa7b4",
          points: [[0,1],[0.05,1],[0.1,1],[0.15,1],[0.2,1],[0.25,1],[0.3,1],[0.35,1],[0.4,1],[0.45,1],[0.5,1],[0.55,1],[0.6,1],[0.65,1],[0.7,1],[0.75,1],[0.8,1],[0.85,1],[0.9,1],[0.95,1],[1,1]]
        },
        {
          name: "f_Y(y) = 1/(2*sqrt(y)) (output, capped at 3)",
          color: "#4ea1ff",
          points: [[0.02,3],[0.04,2.5],[0.06,2.0412],[0.08,1.7678],[0.1,1.5811],[0.12,1.4434],[0.14,1.3363],[0.16,1.25],[0.18,1.1785],[0.2,1.118],[0.22,1.066],[0.24,1.0206],[0.26,0.9806],[0.28,0.9449],[0.3,0.9129],[0.32,0.8839],[0.34,0.8575],[0.36,0.8333],[0.38,0.8111],[0.4,0.7906],[0.42,0.7715],[0.44,0.7538],[0.46,0.7372],[0.48,0.7217],[0.5,0.7071],[0.52,0.6934],[0.54,0.6804],[0.56,0.6682],[0.58,0.6565],[0.6,0.6455],[0.62,0.635],[0.64,0.625],[0.66,0.6155],[0.68,0.6063],[0.7,0.5976],[0.72,0.5893],[0.74,0.5812],[0.76,0.5735],[0.78,0.5661],[0.8,0.559],[0.82,0.5522],[0.84,0.5455],[0.86,0.5392],[0.88,0.533],[0.9,0.527],[0.92,0.5213],[0.94,0.5157],[0.96,0.5103],[0.98,0.5051],[1,0.5]]
        }
      ],
      interpret: "The x-axis is the value a variable can take; the y-axis is density, meaning probability packed per unit of length (not probability itself). The grey input is flat at height 1: under a flat line every value is equally likely. The blue output line is tall on the left and low on the right. Tall means probability is crowded together there, so squaring tends to land you near 0; low on the right means the same probability is spread thin, so big values are rare. Both curves still enclose area 1."
    },
    {
      type: "line",
      title: "Jacobian / stretch factor |dh/dy| = 1/(2*sqrt(y)): how the flat height of 1 is rescaled",
      xlabel: "y",
      ylabel: "stretch factor |dh/dy|",
      series: [
        {
          name: "|dh/dy| = 1/(2*sqrt(y)) (h(y)=sqrt(y), capped at 3)",
          color: "#ffb454",
          points: [[0.02,3],[0.04,2.5],[0.06,2.0412],[0.08,1.7678],[0.1,1.5811],[0.12,1.4434],[0.14,1.3363],[0.16,1.25],[0.18,1.1785],[0.2,1.118],[0.22,1.066],[0.24,1.0206],[0.26,0.9806],[0.28,0.9449],[0.3,0.9129],[0.32,0.8839],[0.34,0.8575],[0.36,0.8333],[0.38,0.8111],[0.4,0.7906],[0.42,0.7715],[0.44,0.7538],[0.46,0.7372],[0.48,0.7217],[0.5,0.7071],[0.52,0.6934],[0.54,0.6804],[0.56,0.6682],[0.58,0.6565],[0.6,0.6455],[0.62,0.635],[0.64,0.625],[0.66,0.6155],[0.68,0.6063],[0.7,0.5976],[0.72,0.5893],[0.74,0.5812],[0.76,0.5735],[0.78,0.5661],[0.8,0.559],[0.82,0.5522],[0.84,0.5455],[0.86,0.5392],[0.88,0.533],[0.9,0.527],[0.92,0.5213],[0.94,0.5157],[0.96,0.5103],[0.98,0.5051],[1,0.5]]
        },
        {
          name: "no stretch (factor = 1) reference",
          color: "#9aa7b4",
          points: [[0.02,1],[0.25,1],[0.5,1],[0.75,1],[1,1]]
        }
      ],
      interpret: "The stretch factor is how much the transform squeezes or expands a tiny slice of the input as it lands on the output. The x-axis is the output value y; the y-axis is that factor. Where the orange line sits above the grey line at 1, the transform squeezes the input, so the old height of 1 is multiplied up and density rises. Where it sits below 1, the input is spread out and density falls. Reading the orange curve directly gives the new height because the input was flat at 1."
    },
    {
      type: "line",
      title: "CDF method: F_Y(y) = P(X^2 <= y) = sqrt(y); its slope IS f_Y(y)",
      xlabel: "value",
      ylabel: "cumulative probability",
      series: [
        {
          name: "F_X(x) = x (input CDF, straight line)",
          color: "#9aa7b4",
          points: [[0,0],[0.05,0.05],[0.1,0.1],[0.15,0.15],[0.2,0.2],[0.25,0.25],[0.3,0.3],[0.35,0.35],[0.4,0.4],[0.45,0.45],[0.5,0.5],[0.55,0.55],[0.6,0.6],[0.65,0.65],[0.7,0.7],[0.75,0.75],[0.8,0.8],[0.85,0.85],[0.9,0.9],[0.95,0.95],[1,1]]
        },
        {
          name: "F_Y(y) = sqrt(y) (output CDF, steep near 0)",
          color: "#7ee787",
          points: [[0,0],[0.05,0.2236],[0.1,0.3162],[0.15,0.3873],[0.2,0.4472],[0.25,0.5],[0.3,0.5477],[0.35,0.5916],[0.4,0.6325],[0.45,0.6708],[0.5,0.7071],[0.55,0.7416],[0.6,0.7746],[0.65,0.8062],[0.7,0.8367],[0.75,0.866],[0.8,0.8944],[0.85,0.922],[0.9,0.9487],[0.95,0.9747],[1,1]]
        }
      ],
      interpret: "A cumulative curve answers: how much probability sits at or below this value? It always climbs from 0 to 1. The grey input climbs in a straight diagonal, the signature of a flat distribution. The green output climbs steeply near 0 then flattens, meaning most probability has already accumulated by small values. The steepness of this curve at any point equals the density: steep on the left matches the tall density there, flat on the right matches the thin density. Both routes give the same answer."
    },
    {
      type: "line",
      title: "Variant - expanding transform Y = sqrt(X): density gets SHORTER (illustrative)",
      xlabel: "value",
      ylabel: "density (prob per unit length)",
      series: [
        {
          name: "f_X(x) = 1 on [0,1] (input, flat)",
          color: "#9aa7b4",
          points: [[0,1],[0.1,1],[0.2,1],[0.3,1],[0.4,1],[0.5,1],[0.6,1],[0.7,1],[0.8,1],[0.9,1],[1,1]]
        },
        {
          name: "f_Y(y) = 2y (output, rises with y)",
          color: "#ffb454",
          points: [[0,0],[0.1,0.2],[0.2,0.4],[0.3,0.6],[0.4,0.8],[0.5,1.0],[0.6,1.2],[0.7,1.4],[0.8,1.6],[0.9,1.8],[1,2.0]]
        }
      ],
      interpret: "Illustrative. Not every transform piles probability on the left. Taking a square root stretches the input, so density grows from 0 up to 2 across [0,1]: probability now leans to the RIGHT. The lesson is that the shape follows the transform, not a fixed rule. When you see a tilted output density, ask whether the transform compresses (taller end) or expands (shorter end) that region. Total area is still 1."
    },
    {
      type: "line",
      title: "Variant - non-monotonic Y = X^2 on [-1,1]: density DOUBLES (illustrative)",
      xlabel: "value",
      ylabel: "density (prob per unit length)",
      series: [
        {
          name: "f_X = 0.5 on [-1,1] (input, flat)",
          color: "#9aa7b4",
          points: [[-1,0.5],[-0.5,0.5],[0,0.5],[0.5,0.5],[1,0.5]]
        },
        {
          name: "f_Y(y) = 1/(2*sqrt(y)) on [0,1] (output, two branches summed, capped at 3)",
          color: "#ff7b72",
          points: [[0.03,2.887],[0.05,2.236],[0.1,1.5811],[0.2,1.118],[0.3,0.9129],[0.4,0.7906],[0.5,0.7071],[0.6,0.6455],[0.7,0.5976],[0.8,0.559],[0.9,0.527],[1,0.5]]
        }
      ],
      interpret: "Illustrative. When two different inputs map to the same output, you must ADD their contributions. Here both x = +0.5 and x = -0.5 square to 0.25, so each output value collects probability from two places. The red output looks like the main chart's shape but is built by summing two branches. Recognise this case whenever the transform is not one-to-one (squaring, absolute value, cosine): a single output can have several pre-images and the densities stack."
    }
  ],
  caption: "Pushing a flat variable through a transform reshapes its density by the stretch factor |dh/dy|. The main charts show Y=X^2 piling probability near 0; the variants show the opposite tilt (Y=sqrt(X)) and the non-monotonic case (Y=X^2 on [-1,1]) where two branches add.",
  code: `import numpy as np

# X ~ Uniform(0,1):  f_X(x) = 1 on [0,1],  F_X(x) = x
# Transform Y = g(X) = X^2.  Inverse h(y) = sqrt(y),  h'(y) = 1/(2*sqrt(y))

# Change-of-variables  f_Y(y) = f_X(h(y)) * |h'(y)|
y = np.arange(0.02, 1.0001, 0.02)
fX_at_h = 1.0                      # f_X is 1 everywhere on [0,1]
stretch = 1.0 / (2*np.sqrt(y))     # |dh/dy|, the Jacobian factor
fY = fX_at_h * stretch             # = 1/(2*sqrt(y))
print("f_Y(0.04) =", 1/(2*np.sqrt(0.04)))   # 2.5  -> piles up
print("f_Y(0.64) =", 1/(2*np.sqrt(0.64)))   # 0.625 -> thins out
print("integral 0..1 =", np.sqrt(1)-np.sqrt(0))  # 1.0, valid density

# CDF method  F_Y(y) = P(X^2 <= y) = P(X <= sqrt(y)) = sqrt(y)
yy = np.arange(0, 1.0001, 0.05)
FY = np.sqrt(yy)                   # slope d/dy sqrt(y) = 1/(2*sqrt(y)) = f_Y
`
};

window.CODEVIZ["probx-convolution"] = {
  question: "How does adding two independent random variables blend their distributions into a new shape?",
  charts: [
    {
      type: "bars",
      title: "Discrete convolution: tiny dice X on {1,2,3}, Y on {1,2} -> flat-topped tent",
      labels: ["z=2", "z=3", "z=4", "z=5"],
      values: [0.1667, 0.3333, 0.3333, 0.1667],
      valueLabels: ["1/6", "1/3", "1/3", "1/6"],
      colors: ["#c89bff", "#7ee787", "#7ee787", "#c89bff"],
      xlabel: "sum z = X + Y",
      ylabel: "P(Z = z)",
      interpret: "Each bar is a possible total z and its height is the chance of that total. Convolution means: for each z, list every way X and Y can add up to z, multiply the two probabilities, and sum them. The middle totals (3 and 4) can be made more ways than the edges (2 and 5), so they are taller. The bars sum to 1 because some total must occur. Reading this: a flat top means several totals are tied for most likely."
    },
    {
      type: "bars",
      title: "Two fair 6-sided dice convolve into a triangle, peak P(Z=7) = 6/36 = 0.1667",
      labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      values: [0.0278, 0.0556, 0.0833, 0.1111, 0.1389, 0.1667, 0.1389, 0.1111, 0.0833, 0.0556, 0.0278],
      valueLabels: ["1/36", "2/36", "3/36", "4/36", "5/36", "6/36", "5/36", "4/36", "3/36", "2/36", "1/36"],
      colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      xlabel: "sum z of two dice",
      ylabel: "P(Z = z)",
      interpret: "Same idea, scaled up. The x-axis is the sum of two dice; bar height is its probability. The shape is a clean triangle peaking at 7 (green) because 7 can be rolled six ways while 2 or 12 has only one way each. The straight slopes are the signature of adding two FLAT distributions. Whenever you add two evenly-spread variables, expect this tent shape: the middle fills in and the extremes thin out."
    },
    {
      type: "line",
      title: "Continuous convolution: two N(0,1) sum to N(0,2), variances add (1+1=2), sd grows 1 to sqrt(2)",
      xlabel: "value",
      ylabel: "density f(x)",
      series: [
        {
          name: "input f_X = N(0,1), sd=1",
          color: "#4ea1ff",
          points: [[-5,0],[-4.75,0],[-4.5,0],[-4.25,0],[-4,0.0001],[-3.75,0.0004],[-3.5,0.0009],[-3.25,0.002],[-3,0.0044],[-2.75,0.0091],[-2.5,0.0175],[-2.25,0.0317],[-2,0.054],[-1.75,0.0863],[-1.5,0.1295],[-1.25,0.1826],[-1,0.242],[-0.75,0.3011],[-0.5,0.3521],[-0.25,0.3867],[0,0.3989],[0.25,0.3867],[0.5,0.3521],[0.75,0.3011],[1,0.242],[1.25,0.1826],[1.5,0.1295],[1.75,0.0863],[2,0.054],[2.25,0.0317],[2.5,0.0175],[2.75,0.0091],[3,0.0044],[3.25,0.002],[3.5,0.0009],[3.75,0.0004],[4,0.0001],[4.25,0],[4.5,0],[4.75,0],[5,0]]
        },
        {
          name: "sum f_Z = N(0,2), sd=sqrt(2)",
          color: "#c89bff",
          points: [[-5,0.0005],[-4.75,0.001],[-4.5,0.0018],[-4.25,0.0031],[-4,0.0052],[-3.75,0.0084],[-3.5,0.0132],[-3.25,0.0201],[-3,0.0297],[-2.75,0.0426],[-2.5,0.0591],[-2.25,0.0796],[-2,0.1038],[-1.75,0.1312],[-1.5,0.1607],[-1.25,0.1909],[-1,0.2197],[-0.75,0.2451],[-0.5,0.265],[-0.25,0.2777],[0,0.2821],[0.25,0.2777],[0.5,0.265],[0.75,0.2451],[1,0.2197],[1.25,0.1909],[1.5,0.1607],[1.75,0.1312],[2,0.1038],[2.25,0.0796],[2.5,0.0591],[2.75,0.0426],[3,0.0297],[3.25,0.0201],[3.5,0.0132],[3.75,0.0084],[4,0.0052],[4.25,0.0031],[4.5,0.0018],[4.75,0.001],[5,0.0005]]
        }
      ],
      interpret: "For continuous variables, x-axis is the value and y-axis is density. The blue input bell is one standard normal; the purple sum bell is wider and shorter. Adding independent variables ADDS their variances (1+1=2), so the spread grows from sd 1 to sd sqrt(2) and the peak drops from 0.399 to 0.282. Same total area of 1, just smeared wider. Takeaway: summing makes the result more spread out but still bell-shaped."
    },
    {
      type: "line",
      title: "Variant - many sums tend to a bell (CLT): sum of 5 flat variables (illustrative)",
      xlabel: "value of the sum",
      ylabel: "density (relative)",
      series: [
        {
          name: "single flat variable (input)",
          color: "#9aa7b4",
          points: [[0,1],[0.2,1],[0.4,1],[0.6,1],[0.8,1],[1,1]]
        },
        {
          name: "sum of 5 flat variables (smooth bell)",
          color: "#7ee787",
          points: [[0,0],[0.5,0.02],[1,0.1],[1.5,0.3],[2,0.65],[2.5,0.95],[3,1.0],[3.5,0.95],[4,0.65],[4.5,0.3],[5,0.1],[5.5,0.02],[6,0]]
        }
      ],
      interpret: "Illustrative. Convolving repeatedly has a destination: keep adding independent variables and the result smooths into a bell, no matter the starting shape. The grey input is a flat block; the green sum of five such blocks is already a rounded hump centered on the average total. This is the Central Limit Theorem in picture form. When a real histogram of many summed effects looks bell-shaped, this is why."
    },
    {
      type: "line",
      title: "Variant - skewed sum: adding right-skewed variables stays skewed (illustrative)",
      xlabel: "value of the sum",
      ylabel: "density (relative)",
      series: [
        {
          name: "single skewed variable (input, long right tail)",
          color: "#9aa7b4",
          points: [[0,1.0],[0.5,0.6],[1,0.37],[1.5,0.22],[2,0.14],[2.5,0.08],[3,0.05],[3.5,0.03],[4,0.02]]
        },
        {
          name: "sum of two skewed variables (peak shifts right, tail remains)",
          color: "#ffb454",
          points: [[0,0.0],[0.5,0.3],[1,0.65],[1.5,0.9],[2,1.0],[2.5,0.9],[3,0.72],[3.5,0.55],[4,0.4],[4.5,0.28],[5,0.18],[5.5,0.11],[6,0.06],[6.5,0.03]]
        }
      ],
      interpret: "Illustrative. Adding does not instantly make things symmetric. Two right-skewed variables (grey, with a long tail trailing to the right) sum into a hump (orange) that has moved right and grown a peak, but still leans with a longer right tail. Skew shrinks slowly as you add more terms. If a sum-of-things histogram is lopsided rather than a clean bell, suspect skewed or heavy-tailed inputs and that not enough were averaged."
    }
  ],
  caption: "Convolution slides one distribution across the other and sums matching pairs. The main charts show flat dice blending into a tent and triangle, and two normals widening into one normal; the variants show where convolution heads (a bell, via the CLT) and how a skewed start stays skewed for a while.",
  code: `import numpy as np

# Discrete convolution: p_Z(z) = sum_x p_X(x) p_Y(z-x)
def conv(pa, pb):
    return np.convolve(pa, pb)   # numpy.convolve IS the convolution sum

# tiny dice, X on {1,2,3} uniform, Y on {1,2} uniform
pX = np.array([1/3, 1/3, 1/3])
pY = np.array([1/2, 1/2])
pZ = conv(pX, pY)                # supports z = 2,3,4,5
print(pZ)                        # [0.1667 0.3333 0.3333 0.1667], sums to 1

# two fair 6-sided dice -> triangle
u6 = np.full(6, 1/6)
tri = conv(u6, u6)               # z = 2..12, peak 6/36 = 0.1667 at z=7
print(tri)

# continuous case, two N(0,1) -> N(0,2)
def npdf(x, mu, sig):
    return np.exp(-0.5*((x-mu)/sig)**2) / (sig*np.sqrt(2*np.pi))
x  = np.arange(-5, 5.001, 0.25)
fX = npdf(x, 0.0, 1.0)           # input bell, sd = 1
fZ = npdf(x, 0.0, np.sqrt(2))    # convolved bell: means add, variances add (1+1=2)
print(fX.max(), fZ.max())        # 0.3989 -> 0.2821`
};

window.CODEVIZ["probx-total-variance"] = {
  question: "Where does the spread of X come from: scatter inside each group, or scatter between the group averages?",
  charts: [
    {
      type: "bars",
      title: "Var(X) = E[Var(X|Y)] + Var(E[X|Y]), term by term",
      labels: ["within E[Var(X|Y)]", "between Var(E[X|Y])", "= total Var(X)"],
      values: [26.5, 61.0, 87.5],
      valueLabels: ["26.5", "61.0", "87.5"],
      colors: ["#4ea1ff", "#ffb454", "#7ee787"],
      xlabel: "term",
      ylabel: "variance",
      interpret: "Read this as a budget. The total spread of X (green, 87.5) splits into two non-overlapping pots: the <b>within</b> pot (blue, 26.5) is the average wobble left after you know the group, and the <b>between</b> pot (orange, 61.0) is how much the group averages differ. Blue plus orange equals green exactly, so no spread is counted twice and none goes missing."
    },
    {
      type: "bars",
      title: "Between part: group means 70,80,90 spread around overall mean 77",
      labels: ["A (p=0.5)", "B (p=0.3)", "C (p=0.2)"],
      series: [
        { name: "group mean E[X|Y]", color: "#c89bff", points: [["A (p=0.5)", 70], ["B (p=0.3)", 80], ["C (p=0.2)", 90]] }
      ],
      xlabel: "group Y",
      ylabel: "value of X",
      interpret: "Each bar is one group's average X. The <b>between</b> term measures how far these bars sit from the overall mean 77, weighted by each group's probability. Tall differences here (90 vs 70) mean knowing the group tells you a lot about X, so the between pot is large."
    },
    {
      type: "scatter",
      title: "Within (cloud height) + between (gap of dashed group means)",
      xlabel: "group Y",
      ylabel: "X",
      groups: [
        { name: "A: mean 70, var 25", color: "#4ea1ff", points: [[0.78, 60.0], [0.9, 65.0], [1.0, 70.0], [1.1, 75.0], [1.22, 80.0]] },
        { name: "B: mean 80, var 36", color: "#ff7b72", points: [[1.78, 68.0], [1.9, 74.0], [2.0, 80.0], [2.1, 86.0], [2.22, 92.0]] },
        { name: "C: mean 90, var 16", color: "#7ee787", points: [[2.78, 82.0], [2.9, 86.0], [3.0, 90.0], [3.1, 94.0], [3.22, 98.0]] }
      ],
      lines: [
        { color: "#c89bff", dash: true, points: [[0.7, 77.0], [3.3, 77.0]] }
      ],
      interpret: "This is the full picture. The vertical height of each colored cloud is the <b>within</b> spread (scatter you still have after fixing the group); the vertical gaps between cloud centres and the dashed overall mean are the <b>between</b> spread. Both kinds of vertical scatter together make up the total spread of X."
    },
    {
      type: "scatter",
      title: "Variant (illustrative): all spread is WITHIN, group means nearly equal",
      xlabel: "group Y",
      ylabel: "X",
      groups: [
        { name: "A: mean 78", color: "#4ea1ff", points: [[0.78, 60.0], [0.9, 70.0], [1.0, 78.0], [1.1, 86.0], [1.22, 96.0]] },
        { name: "B: mean 77", color: "#ff7b72", points: [[1.78, 59.0], [1.9, 69.0], [2.0, 77.0], [2.1, 85.0], [2.22, 95.0]] },
        { name: "C: mean 76", color: "#7ee787", points: [[2.78, 58.0], [2.9, 68.0], [3.0, 76.0], [3.1, 84.0], [3.22, 94.0]] }
      ],
      lines: [
        { color: "#c89bff", dash: true, points: [[0.7, 77.0], [3.3, 77.0]] }
      ],
      interpret: "Illustrative case. The clouds are tall but their centres all hug the dashed mean, so the <b>between</b> pot is almost empty and nearly all of Var(X) is <b>within</b>. Recognise it when the group label barely moves the average: knowing Y tells you little, so E[Var(X|Y)] dominates."
    },
    {
      type: "scatter",
      title: "Variant (illustrative): all spread is BETWEEN, groups are tight",
      xlabel: "group Y",
      ylabel: "X",
      groups: [
        { name: "A: mean 65", color: "#4ea1ff", points: [[0.85, 64.0], [0.93, 64.5], [1.0, 65.0], [1.08, 65.5], [1.15, 66.0]] },
        { name: "B: mean 80", color: "#ff7b72", points: [[1.85, 79.0], [1.93, 79.5], [2.0, 80.0], [2.08, 80.5], [2.15, 81.0]] },
        { name: "C: mean 95", color: "#7ee787", points: [[2.85, 94.0], [2.93, 94.5], [3.0, 95.0], [3.08, 95.5], [3.15, 96.0]] }
      ],
      lines: [
        { color: "#c89bff", dash: true, points: [[0.7, 80.0], [3.3, 80.0]] }
      ],
      interpret: "Illustrative mirror image. Each cloud is a tight dot (tiny <b>within</b>), but the centres sit far apart and far from the dashed mean, so almost all of Var(X) is <b>between</b>. Recognise it when the group label almost perfectly predicts X: Var(E[X|Y]) dominates and a regression on Y would explain most of the variance."
    }
  ],
  caption: "Concrete example: three groups A,B,C with weights 0.5,0.3,0.2, means 70,80,90 and variances 25,36,16. The within-group part E[Var(X|Y)] = 0.5(25)+0.3(36)+0.2(16) = 26.5 is the average cloud height; the between-group part Var(E[X|Y]) = 0.5(70-77)^2+0.3(80-77)^2+0.2(90-77)^2 = 61.0 is how far the group means sit from the overall mean 77 (dashed line). They add to the total Var(X)=87.5 with nothing double-counted.",
  code: `import numpy as np
# group weights, conditional means, conditional variances
p   = np.array([0.5, 0.3, 0.2])
mu  = np.array([70.0, 80.0, 90.0])   # E[X|Y]
var = np.array([25.0, 36.0, 16.0])   # Var(X|Y)

within  = (p * var).sum()            # E[Var(X|Y)] = 26.5
EX      = (p * mu).sum()             # overall mean E[X] = 77
between = (p * (mu - EX)**2).sum()   # Var(E[X|Y]) = 61.0
total   = within + between           # Var(X) = 87.5

# direct check via Var(X) = E[X^2] - (E[X])^2
EX2     = (p * (var + mu**2)).sum()  # 6016.5
print(within, between, total, EX2 - EX**2)  # 26.5 61.0 87.5 87.5`
};

window.CODEVIZ["probx-mgf"] = {
  question: "How does one function M_X(t) store every moment, and why does its slope at 0 equal the mean?",
  charts: [
    {
      type: "line",
      title: "MGF M(t) = lambda/(lambda - t), exponential lambda=1.5; slope at t=0 = E[X] = 0.667",
      xlabel: "t",
      ylabel: "M(t) = E[e^(tX)]",
      series: [
        {
          name: "M(t) = 1.5/(1.5 - t)",
          color: "#4ea1ff",
          points: [[-2,0.429],[-1.93,0.437],[-1.86,0.446],[-1.791,0.456],[-1.721,0.466],[-1.651,0.476],[-1.581,0.487],[-1.511,0.498],[-1.442,0.51],[-1.372,0.522],[-1.302,0.535],[-1.232,0.549],[-1.163,0.563],[-1.093,0.579],[-1.023,0.595],[-0.953,0.611],[-0.883,0.629],[-0.814,0.648],[-0.744,0.669],[-0.674,0.69],[-0.604,0.713],[-0.534,0.737],[-0.465,0.764],[-0.395,0.792],[-0.325,0.822],[-0.255,0.855],[-0.185,0.89],[-0.116,0.928],[-0.046,0.97],[0.024,1.016],[0.094,1.067],[0.164,1.122],[0.233,1.184],[0.303,1.253],[0.373,1.331],[0.443,1.419],[0.513,1.519],[0.582,1.635],[0.652,1.769],[0.722,1.928],[0.792,2.118],[0.861,2.349],[0.931,2.637],[1.001,3.006],[1.071,3.495],[1.141,4.174],[1.21,5.18],[1.28,6.825],[1.35,10]]
        },
        {
          name: "tangent at 0: y = 1 + 0.667 t (slope = E[X])",
          color: "#7ee787",
          points: [[-2,-0.333],[1.35,1.9]]
        }
      ],
      interpret: "The x-axis is the dummy knob t; the y-axis is M(t), the average of e^(tX). The blue curve always passes through height 1 at t=0 (because e^0=1). The key trick: the <b>slope of the curve at t=0</b> equals the mean E[X]=0.667 — that is exactly the green tangent line. So you read the mean straight off how steeply the curve leaves the point (0,1)."
    },
    {
      type: "bars",
      title: "Successive derivatives at 0 read off the moments: M^(n)(0) = E[X^n], exponential lambda=1.5",
      labels: ["M(0)=E[1]", "M'(0)=E[X]", "M''(0)=E[X^2]", "M'''(0)=E[X^3]", "M''''(0)=E[X^4]"],
      values: [1, 0.6667, 0.8889, 1.7778, 4.7407],
      valueLabels: ["1", "0.667", "0.889", "1.778", "4.741"],
      colors: ["#9aa7b4", "#7ee787", "#ffb454", "#4ea1ff", "#c89bff"],
      interpret: "Each bar is one derivative of the MGF taken at t=0. The first derivative gives E[X], the second gives E[X^2], and so on — one function spits out every moment by repeated differentiation. From the first two bars you get the variance: Var = E[X^2] - E[X]^2 = 0.889 - 0.667^2 = 0.444."
    },
    {
      type: "line",
      title: "MGF of a sum = product: M_(X+Y)(t) = M_X(t) M_Y(t), two independent exp(1.5)",
      xlabel: "t",
      ylabel: "M(t)",
      series: [
        {
          name: "M_X(t) = M_Y(t) = 1.5/(1.5 - t)",
          color: "#4ea1ff",
          points: [[-2,0.429],[-1.925,0.438],[-1.85,0.448],[-1.775,0.458],[-1.7,0.469],[-1.625,0.48],[-1.55,0.492],[-1.475,0.504],[-1.4,0.517],[-1.325,0.531],[-1.25,0.545],[-1.175,0.561],[-1.1,0.577],[-1.025,0.594],[-0.95,0.612],[-0.875,0.632],[-0.8,0.652],[-0.725,0.674],[-0.65,0.698],[-0.575,0.723],[-0.5,0.75],[-0.425,0.779],[-0.35,0.811],[-0.275,0.845],[-0.2,0.882],[-0.125,0.923],[-0.05,0.968],[0.025,1.017],[0.1,1.071],[0.175,1.132],[0.25,1.2],[0.325,1.277],[0.4,1.364],[0.475,1.463],[0.55,1.579],[0.625,1.714],[0.7,1.875],[0.775,2.069],[0.85,2.308],[0.925,2.609],[1,3]]
        },
        {
          name: "M_(X+Y)(t) = product = (1.5/(1.5 - t))^2",
          color: "#ffb454",
          points: [[-2,0.184],[-1.925,0.192],[-1.85,0.2],[-1.775,0.21],[-1.7,0.22],[-1.625,0.23],[-1.55,0.242],[-1.475,0.254],[-1.4,0.268],[-1.325,0.282],[-1.25,0.298],[-1.175,0.314],[-1.1,0.333],[-1.025,0.353],[-0.95,0.375],[-0.875,0.399],[-0.8,0.425],[-0.725,0.454],[-0.65,0.487],[-0.575,0.523],[-0.5,0.563],[-0.425,0.607],[-0.35,0.657],[-0.275,0.714],[-0.2,0.779],[-0.125,0.852],[-0.05,0.937],[0.025,1.034],[0.1,1.148],[0.175,1.282],[0.25,1.44],[0.325,1.63],[0.4,1.86],[0.475,2.142],[0.55,2.493],[0.625,2.939],[0.7,3.516],[0.775,4.281],[0.85,5.325],[0.925,6.805],[1,9]]
        }
      ],
      interpret: "Blue is the MGF of one variable; orange is the MGF of the sum of two independent copies. The orange curve is just blue <b>multiplied by itself</b> at every t — adding independent variables multiplies their MGFs. That is why MGFs make convolutions easy: a hard sum-of-variables question becomes a simple product."
    },
    {
      type: "line",
      title: "Variant (illustrative): MGF blows up to infinity once t reaches lambda",
      xlabel: "t",
      ylabel: "M(t)",
      series: [
        {
          name: "M(t) = 1.5/(1.5 - t), vertical wall at t=1.5",
          color: "#ff7b72",
          points: [[0,1],[0.3,1.25],[0.6,1.67],[0.9,2.5],[1.1,3.75],[1.25,6],[1.35,10],[1.42,18.75],[1.46,37.5],[1.48,75]]
        }
      ],
      interpret: "Illustrative. For the exponential, M(t) only exists for t below lambda=1.5; as t climbs toward 1.5 the curve shoots to infinity (the denominator hits zero). The lesson: an MGF need not exist for all t — it lives only in a window around 0. If a distribution has heavy tails (like Cauchy) that window can shrink to nothing and the MGF fails to exist at all."
    },
    {
      type: "line",
      title: "Variant (illustrative): two different distributions, same mean, different curvature",
      xlabel: "t",
      ylabel: "M(t)",
      series: [
        {
          name: "low variance: flatter, gentler bend",
          color: "#7ee787",
          points: [[-1,0.67],[-0.75,0.72],[-0.5,0.78],[-0.25,0.88],[0,1],[0.25,1.15],[0.5,1.35],[0.75,1.62],[1,2.0]]
        },
        {
          name: "high variance: steeper bend upward",
          color: "#c89bff",
          points: [[-1,0.55],[-0.75,0.63],[-0.5,0.72],[-0.25,0.84],[0,1],[0.25,1.22],[0.5,1.55],[0.75,2.1],[1,3.1]]
        }
      ],
      interpret: "Illustrative. Both curves pass through (0,1) with the same slope, so they share the same mean. What differs is the <b>curvature</b> at 0 — the second derivative — which sets the variance. The purple curve bends up faster, so it has the larger E[X^2] and the larger variance. Same first derivative, different second derivative: same mean, different spread."
    }
  ],
  caption: "For an exponential with rate lambda=1.5, M(t)=lambda/(lambda-t). The first diagram shows the curve passing through M(0)=1 with its tangent slope at 0 equal to E[X]=0.667. The second reads off successive derivatives at 0 as the moments E[X^n]=n!/lambda^n (0.667, 0.889, ...), giving Var=0.889-0.667^2=0.444. The third shows the product property: adding two independent exp(1.5) multiplies their MGFs, so M_(X+Y)(t)=(1.5/(1.5-t))^2.",
  code: `import numpy as np
lam = 1.5

# Chart 1: MGF curve M(t)=lam/(lam-t) and its tangent at t=0
t = np.linspace(-2, 1.35, 49)
M = lam / (lam - t)
slope0 = 1 / lam                 # M'(0) = E[X]
tangent = 1 + slope0 * t         # line through (0, M(0)=1)

# Chart 2: moments are successive derivatives at 0: M^(n)(0) = E[X^n] = n!/lam^n
import math
moments = [math.factorial(n) / lam**n for n in range(5)]
# -> [1.0, 0.6667, 0.8889, 1.7778, 4.7407]
var = moments[2] - moments[1]**2     # E[X^2] - E[X]^2 = 0.4444

# Chart 3: MGF of a sum of two independent exp(lam) = product of MGFs
t3 = np.linspace(-2, 1.0, 41)
Mx = lam / (lam - t3)
Msum = Mx * Mx                   # M_{X+Y}(t) = M_X(t) M_Y(t) = (lam/(lam-t))**2
print(moments, var)`
};
