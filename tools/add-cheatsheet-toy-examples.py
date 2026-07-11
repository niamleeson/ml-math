#!/usr/bin/env python3
"""One-off patch: insert a `## 0. Step-by-Step Worked Example` toy example into the AI
Cheat Sheet lessons that lack one, and mark them runnable (Type 🧮 Numeric -> 💻 Colab).

Each toy example follows the house standard: tiny data, step-by-step, print logging, a
visualization per idea, a break case where natural, and an assert. Idempotent: skips a
file that already has the section. After running, regenerate the notebook + in-app build:
  node tools/gen-cheatsheet-notebooks.js && node tools/build-cheatsheet.js
Run: python3 tools/add-cheatsheet-toy-examples.py
"""
import os, re

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "topics", "lessons")

INTRO = """## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up the core idea one tiny step at a time. Each step **prints** the numbers it
> computes and **draws a picture** so you can *see* what is happening. Run the cells in order
> from top to bottom. Nothing here needs the internet or any downloaded data.

"""

SETUP = """### Step 0 — Set up our tools

We import NumPy (arrays + math) and Matplotlib (pictures), fix a **seed** for reproducibility,
and define a tiny `log()` helper so every printed line is clearly labeled.

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)
plt.rcParams["figure.figsize"] = (6, 4)

def log(label, value):
    print(f"[{label}] {value}")

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")
```
▶ What you'll see: one line confirming the tools are ready.

"""

# Each entry: (relative md path, big-picture bullets, [ (prose, code, whatyou) ... ])
LESSONS = {}

LESSONS["probability/01-probability-foundations.md"] = (
"- A **sample space** is just the list of all equally likely outcomes; a **probability** is a count divided by that total.\n"
"- **Conditional probability** `P(A|B)` re-scopes to the world where B happened.\n"
"- **Bayes' rule** flips a conditional you know into the one you want.",
[
("### Step 1 — Sample space of two dice, and the probability of an event\n\nRoll two fair dice. The **sample space** is all 36 equally likely `(die1, die2)` pairs. The probability of an event is just *how many outcomes are in it* ÷ 36.",
"""import itertools
outcomes = list(itertools.product(range(1, 7), range(1, 7)))   # all 36 equally likely pairs
log("sample space size", len(outcomes))
A = [o for o in outcomes if sum(o) == 7]                       # event A: the dice sum to 7
P_A = len(A) / 36
log("outcomes in A (sum = 7)", A)
log("P(A) = |A| / 36", f"{len(A)}/36 = {round(P_A, 4)}")
assert P_A == 6 / 36

sums = [sum(o) for o in outcomes]
plt.hist(sums, bins=range(2, 14), align="left", rwidth=0.8)
plt.title("distribution of the dice sum"); plt.xlabel("sum"); plt.ylabel("count / 36"); plt.show()""",
"▶ What you'll see: 6 winning outcomes → P(sum=7) = 6/36, and a triangular histogram peaking at 7."),

("### Step 2 — Conditional probability and Bayes' rule\n\n`P(A|B)` asks: *given B happened, how likely is A?* It re-scopes counting to the outcomes inside B. Bayes' rule then flips `P(A|B)` into `P(B|A)`.",
"""B = [o for o in outcomes if o[0] == 1]                          # event B: the first die is 1
AB = [o for o in outcomes if o in A and o in B]                # A and B both happen
P_B = len(B) / 36; P_AB = len(AB) / 36
log("P(B) = first die is 1", f"{len(B)}/36 = {round(P_B,4)}")
log("P(A and B)", f"{len(AB)}/36 = {round(P_AB,4)}")
P_A_given_B = P_AB / P_B                                        # re-scope to the 6 outcomes where B holds
log("P(A|B) = P(A and B) / P(B)", round(P_A_given_B, 4))
P_B_given_A = P_AB / P_A                                        # Bayes flip
log("P(B|A) = P(A and B) / P(A)", round(P_B_given_A, 4))
assert abs(P_A_given_B - 1/6) < 1e-9""",
"▶ What you'll see: P(A|B)=1/6 (of the 6 rolls with a leading 1, exactly one sums to 7) and the Bayes flip."),
])

LESSONS["probability/02-discrete-random-variables.md"] = (
"- A **PMF** lists the probability of each value; the probabilities sum to 1.\n"
"- **Expectation** `E[X]` is the probability-weighted average; **variance** measures spread.\n"
"- The **binomial** counts successes in n independent trials.",
[
("### Step 1 — PMF, expectation, and variance of a fair die\n\nLet `X` be a fair die. Its **PMF** is 1/6 on each face. `E[X]` is the weighted average of the values; `Var[X]` is the weighted average of squared distances from the mean.",
"""x = np.arange(1, 7); pmf = np.ones(6) / 6                      # values 1..6, each with probability 1/6
log("PMF sums to", pmf.sum())
E_X = (x * pmf).sum()                                          # weighted average
log("E[X] = sum(x * p)", E_X)
Var_X = (((x - E_X) ** 2) * pmf).sum()                         # weighted average of squared deviations
log("Var[X] = sum((x-E)^2 * p)", round(Var_X, 4))
assert E_X == 3.5

plt.bar(x, pmf); plt.title("PMF of a fair die"); plt.xlabel("value"); plt.ylabel("probability"); plt.show()""",
"▶ What you'll see: E[X]=3.5, Var[X]≈2.917, and a flat bar chart (each face equally likely)."),

("### Step 2 — The binomial distribution (successes in n trials)\n\nFlip a fair coin `n=3` times and count heads. The probability of exactly `k` heads uses the binomial formula `C(n,k) p^k (1-p)^{n-k}`.",
"""import math
n, p = 3, 0.5; ks = np.arange(n + 1)
binom = np.array([math.comb(n, k) * p**k * (1-p)**(n-k) for k in ks])  # PMF over 0..n heads
for k, pk in zip(ks, binom):
    log(f"P(X={k} heads)", round(pk, 3))
log("E[X] = n*p", n * p)
assert abs(binom.sum() - 1) < 1e-9

plt.bar(ks, binom); plt.title("Binomial(n=3, p=0.5)"); plt.xlabel("# heads"); plt.ylabel("probability"); plt.show()""",
"▶ What you'll see: the PMF [0.125, 0.375, 0.375, 0.125] summing to 1, and E[X]=1.5."),
])

LESSONS["probability/03-continuous-random-variables.md"] = (
"- For a **continuous** variable, probability is an **area under the density (PDF)**, not a count.\n"
"- The **CDF** accumulates that area; `P(a<X<b) = F(b) − F(a)`.\n"
"- Sampling many draws and taking a fraction *approximates* that area.",
[
("### Step 1 — Uniform density: probability is an area\n\nFor `U ~ Uniform(0,1)`, the density is a flat line at height 1 on [0,1]. So `P(0.2 < U < 0.5)` is just the **area** of that strip: width × height.",
"""a, b = 0.2, 0.5
P = (b - a) * 1.0                                              # area of the rectangle under the flat density
log("P(0.2 < U < 0.5) = width * height", f"({b}-{a}) * 1 = {P}")
assert abs(P - 0.3) < 1e-9

grid = np.linspace(-0.2, 1.2, 400); dens = ((grid >= 0) & (grid <= 1)).astype(float)
plt.plot(grid, dens); plt.fill_between(grid, dens, where=(grid >= a) & (grid <= b), alpha=0.4)
plt.title("Uniform(0,1): shaded area = P(0.2<U<0.5)"); plt.xlabel("u"); plt.ylabel("density"); plt.show()""",
"▶ What you'll see: a flat density with a shaded strip whose area is 0.3."),

("### Step 2 — Normal density, CDF, and checking area by sampling\n\nThe standard normal `Z ~ N(0,1)` is the bell curve. We estimate `P(-1 < Z < 1)` two ways: by **sampling** many draws and taking the fraction inside, and by reading it off the picture (~0.68).",
"""z = np.random.normal(0, 1, 100_000)                           # 100k draws from the bell curve
emp = np.mean((z > -1) & (z < 1))                             # fraction landing in (-1, 1)
log("P(-1 < Z < 1) by sampling", round(emp, 3))
assert abs(emp - 0.68) < 0.02

grid = np.linspace(-4, 4, 400)
pdf = np.exp(-grid**2 / 2) / np.sqrt(2 * np.pi)
plt.hist(z, bins=60, density=True, alpha=0.4, label="samples")
plt.plot(grid, pdf, label="true PDF"); plt.axvline(-1, ls="--"); plt.axvline(1, ls="--")
plt.title("Normal(0,1): histogram vs PDF, dashed = ±1"); plt.legend(); plt.show()""",
"▶ What you'll see: the sample fraction ≈ 0.68 and the histogram matching the bell-curve PDF."),
])

LESSONS["machine-learning/05-supervised-learning-intro.md"] = (
"- Supervised learning **fits** a function to `(input, target)` pairs.\n"
"- What matters is **test** error (unseen data), not training error.\n"
"- An over-flexible model can fit the training data perfectly yet fail on test data (**overfitting**).",
[
("### Step 1 — Fit a line, then measure train vs test error\n\nWe have 8 points on a noisy line. We **fit on the first 6** (train) and **check on the last 2** (test). The score is mean squared error — low on both means the model generalizes.",
"""xs = np.array([0, 1, 2, 3, 4, 5, 6, 7.]); ys = 2*xs + 1 + np.random.normal(0, 1, 8)
x_tr, y_tr, x_te, y_te = xs[:6], ys[:6], xs[6:], ys[6:]
w = np.polyfit(x_tr, y_tr, 1)                                  # fit a straight line on TRAIN only
mse_tr = np.mean((np.polyval(w, x_tr) - y_tr) ** 2)
mse_te = np.mean((np.polyval(w, x_te) - y_te) ** 2)
log("fitted line (slope, intercept)", np.round(w, 2).tolist())
log("train MSE", round(mse_tr, 3)); log("test MSE", round(mse_te, 3))

grid = np.linspace(0, 7, 100)
plt.scatter(x_tr, y_tr, label="train"); plt.scatter(x_te, y_te, color="red", label="test")
plt.plot(grid, np.polyval(w, grid), color="black"); plt.title("Step 1 — line fit"); plt.legend(); plt.show()""",
"▶ What you'll see: a line close to the true `2x+1`, with train and test MSE both small."),

("### Step 2 — Break case: an over-flexible model overfits\n\nNow fit a wiggly **degree-5** curve to the same 6 training points. It bends to hit them almost perfectly (train error ≈ 0) but goes wild off-data, so **test error explodes**. That gap is overfitting.",
"""w5 = np.polyfit(x_tr, y_tr, 5)                                 # far too flexible for 6 points
mse_tr5 = np.mean((np.polyval(w5, x_tr) - y_tr) ** 2)
mse_te5 = np.mean((np.polyval(w5, x_te) - y_te) ** 2)
log("degree-5 train MSE (tiny!)", round(mse_tr5, 4))
log("degree-5 test MSE (huge!)", round(mse_te5, 2))
assert mse_tr5 < mse_tr                                        # it fits TRAIN better...
assert mse_te5 > mse_te                                        # ...but generalizes far worse

grid = np.linspace(0, 7, 200)
plt.scatter(x_tr, y_tr, label="train"); plt.scatter(x_te, y_te, color="red", label="test")
plt.plot(grid, np.polyval(w5, grid), color="purple"); plt.ylim(y_tr.min()-3, y_tr.max()+3)
plt.title("Step 2 — degree-5 curve OVERFITS"); plt.legend(); plt.show()""",
"▶ What you'll see: near-zero train error but a much larger test error — the model memorized noise."),
])

LESSONS["machine-learning/10-learning-theory.md"] = (
"- Model error splits into **bias** (too simple) and **variance** (too flexible).\n"
"- As complexity rises, train error keeps falling but **test error is U-shaped**.\n"
"- The best model is at the bottom of that U — not the one with the lowest train error.",
[
("### Step 1 — The bias–variance U-curve by hand\n\nWe fit polynomials of increasing **degree** (complexity) to noisy data and track train vs test error. Watch train error fall forever while test error first drops (less bias) then shoots up (more variance).",
"""x = np.linspace(0, 1, 20); y = np.sin(2*np.pi*x) + np.random.normal(0, 0.2, 20)
tr_i, te_i = np.arange(14), np.arange(14, 20)                  # train on first 14, test on last 6
degrees = range(1, 9); train_err, test_err = [], []
for d in degrees:
    c = np.polyfit(x[tr_i], y[tr_i], d)                       # fit at this complexity
    train_err.append(np.mean((np.polyval(c, x[tr_i]) - y[tr_i]) ** 2))
    test_err.append(np.mean((np.polyval(c, x[te_i]) - y[te_i]) ** 2))
    log(f"degree {d}", f"train={train_err[-1]:.3f}  test={test_err[-1]:.3f}")
assert train_err[-1] < train_err[0]                           # complexity always lowers TRAIN error

plt.plot(list(degrees), train_err, "-o", label="train")
plt.plot(list(degrees), test_err, "-o", label="test"); plt.yscale("log")
plt.title("bias–variance: train falls, test is U-shaped"); plt.xlabel("polynomial degree (complexity)")
plt.ylabel("MSE (log)"); plt.legend(); plt.show()""",
"▶ What you'll see: train error sliding down monotonically while test error bottoms out early then blows up."),
])

LESSONS["machine-learning/16-refresher-probability-statistics.md"] = (
"- **Mean** is the center; **variance/standard deviation** measure spread.\n"
"- **Covariance** measures how two variables move together; **correlation** rescales it to −1…1.\n"
"- Every one of these is a short sum you can compute by hand.",
[
("### Step 1 — Mean, variance, standard deviation\n\nFor a tiny sample, the **mean** is the average, the **variance** is the average squared distance from the mean, and the **standard deviation** is its square root (back in the original units).",
"""a = np.array([2, 4, 6, 8, 10.])
mean_a = a.mean()
var_a = np.mean((a - mean_a) ** 2)
std_a = np.sqrt(var_a)
log("mean", mean_a); log("variance = avg of (x-mean)^2", var_a); log("std = sqrt(variance)", round(std_a, 3))
assert mean_a == 6.0

plt.bar(range(len(a)), a); plt.axhline(mean_a, color="red", ls="--", label="mean")
plt.title("values with their mean"); plt.legend(); plt.show()""",
"▶ What you'll see: mean 6, variance 8, std ≈ 2.83, and bars with the mean line."),

("### Step 2 — Covariance and correlation between two variables\n\n**Covariance** is the average product of the two variables' deviations from their means; **correlation** divides that by both standard deviations so it lands in −1…1.",
"""b = np.array([1, 3, 2, 5, 4.])
cov = np.mean((a - a.mean()) * (b - b.mean()))                 # do they deviate together?
corr = cov / (a.std() * b.std())                              # rescaled to -1..1
log("covariance", round(cov, 3)); log("correlation", round(corr, 3))
assert abs(corr - np.corrcoef(a, b)[0, 1]) < 1e-9

plt.scatter(a, b); plt.title(f"scatter (correlation = {corr:.2f})"); plt.xlabel("a"); plt.ylabel("b"); plt.show()""",
"▶ What you'll see: a positive covariance and a correlation of 0.8 with an upward-trending scatter."),
])

LESSONS["machine-learning/17-refresher-linear-algebra-calculus.md"] = (
"- A **dot product** and **norm** summarize vectors; a **matrix** transforms them.\n"
"- The **gradient** points uphill; gradient descent steps the opposite way.\n"
"- All of it reduces to small, checkable arithmetic.",
[
("### Step 1 — Vectors and a matrix transform\n\nThe **dot product** multiplies matching components and adds; the **norm** is the Pythagorean length; a **matrix times a vector** produces a new vector (each output = a row dotted with the vector).",
"""v = np.array([3, 4]); M = np.array([[1, 2], [3, 4]])
log("dot(v, v)", int(np.dot(v, v)))
log("norm(v) = sqrt(dot(v,v))", round(np.linalg.norm(v), 3))
Mv = M @ v
log("M v (each row dotted with v)", Mv.tolist())
assert round(np.linalg.norm(v), 3) == 5.0""",
"▶ What you'll see: dot 25, norm 5.0, and `M v = [11, 25]`."),

("### Step 2 — Gradient and one descent step\n\nFor `f(x,y) = x² + y²`, the **gradient** is `[2x, 2y]` — it points uphill. **Gradient descent** takes a small step in the *opposite* direction to go downhill toward the minimum at the origin.",
"""grad = lambda p: 2 * np.array(p, float)                       # gradient of x^2 + y^2
p = np.array([3.0, 4.0]); log("gradient at (3,4)", grad(p).tolist())
assert (grad(p) == [6, 8]).all()
lr = 0.1; p_new = p - lr * grad(p)                            # step downhill
log("after one step p - 0.1*grad", np.round(p_new, 2).tolist())

xs = np.linspace(-4, 4, 40); ys = np.linspace(-4, 4, 40); XX, YY = np.meshgrid(xs, ys)
plt.contour(XX, YY, XX**2 + YY**2, levels=12)
plt.annotate("", xy=p_new, xytext=p, arrowprops=dict(arrowstyle="->", color="red"))
plt.title("gradient descent step on x^2+y^2"); plt.scatter([0], [0], marker="*", s=200); plt.show()""",
"▶ What you'll see: gradient [6, 8], a step to [2.4, 3.2], and an arrow moving toward the center."),
])

LESSONS["artificial-intelligence/37-propositional-logic.md"] = (
"- A **truth table** lists every combination of true/false for the variables.\n"
"- A formula is a **tautology** if it is true in *every* row.\n"
"- **Modus ponens** — from `A` and `A→B`, conclude `B` — is one such always-true pattern.",
[
("### Step 1 — Build a truth table and check a tautology\n\nWe enumerate all truth assignments for `A, B` and evaluate the implication `A→B` (false only when A is true and B is false), then the full modus-ponens formula `(A ∧ (A→B)) → B`. If it's true in every row, it's a **tautology**.",
"""import itertools
rows = []
for A, B in itertools.product([False, True], repeat=2):       # all 4 assignments
    A_implies_B = (not A) or B                                # A -> B
    formula = (not (A and A_implies_B)) or B                  # (A ∧ (A→B)) -> B
    rows.append((A, B, A_implies_B, formula))
    log(f"A={A}, B={B}", f"A→B={A_implies_B}, formula={formula}")
is_tautology = all(r[3] for r in rows)
log("tautology? (true in every row)", is_tautology)
assert is_tautology

grid = np.array([[int(r[0]), int(r[1]), int(r[2]), int(r[3])] for r in rows])
plt.imshow(grid, cmap="Greys", aspect="auto")
plt.xticks(range(4), ["A", "B", "A→B", "formula"]); plt.yticks(range(4), [f"row {i}" for i in range(4)])
plt.title("truth table (white=False, black=True)"); plt.show()""",
"▶ What you'll see: all 4 rows of the last column are True → the formula is a tautology."),
])

LESSONS["artificial-intelligence/38-first-order-logic.md"] = (
"- **Predicates** are properties that are true or false of each object in a **domain**.\n"
"- **∀x P(x)** (\"for all\") is true only if P holds for *every* object.\n"
"- **∃x P(x)** (\"there exists\") is true if P holds for *at least one* object.",
[
("### Step 1 — Evaluate quantifiers over a tiny domain\n\nTake the domain `{1,2,3,4}` and the predicate `Even(x)`. We check which objects satisfy it, then evaluate the two quantifiers by hand: **∀** needs *all* to satisfy, **∃** needs *at least one*.",
"""domain = [1, 2, 3, 4]
Even = lambda n: n % 2 == 0
satisfy = [d for d in domain if Even(d)]                       # objects for which the predicate is true
log("domain", domain); log("Even(x) holds for", satisfy)
for_all = all(Even(d) for d in domain)                        # ∀x Even(x)
exists  = any(Even(d) for d in domain)                        # ∃x Even(x)
log("∀x Even(x)  (needs ALL)", for_all)
log("∃x Even(x)  (needs ONE)", exists)
assert exists and not for_all

truth = [int(Even(d)) for d in domain]
plt.bar([str(d) for d in domain], truth); plt.ylim(0, 1.2)
plt.title("Even(x) over the domain (1 = true)"); plt.xlabel("object x"); plt.ylabel("Even(x)"); plt.show()""",
"▶ What you'll see: Even holds for {2,4}, so ∃x is True but ∀x is False."),
])


def build_section(bigpicture, steps):
    parts = [INTRO, "### The Big Picture — What You'll Learn\n\n", bigpicture, "\n\n", SETUP]
    for prose, codeblk, whatyou in steps:
        parts.append(prose + "\n\n```python\n" + codeblk.strip("\n") + "\n```\n" + whatyou + "\n\n")
    return "".join(parts)


def patch(rel, bigpicture, steps):
    path = os.path.join(SRC, rel)
    text = open(path, encoding="utf-8").read()
    if "## 0. Step-by-Step Worked Example" in text:
        print("skip (already has one):", rel); return False
    # 1) mark runnable: Type 🧮 Numeric -> 💻 Colab and add the notebook badge
    text = text.replace("**Type:** 🧮 Numeric", "**Type:** 💻 Colab", 1)
    badge = ("> 📓 This section is written as a runnable notebook; an `.ipynb` will be generated "
             "from it. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)\n")
    # insert the badge right after the "> **Source:** ..." line, and the section before "## 1."
    lines = text.split("\n")
    for i, ln in enumerate(lines):
        if ln.startswith("> **Source:**") and (i + 1 >= len(lines) or not lines[i + 1].startswith("> 📓")):
            lines.insert(i + 1, badge.rstrip("\n")); break
    text = "\n".join(lines)
    section = build_section(bigpicture, steps)
    text = text.replace("## 1. Overview", section + "## 1. Overview", 1)
    open(path, "w", encoding="utf-8").write(text)
    print("patched:", rel); return True


if __name__ == "__main__":
    n = 0
    for rel, (bp, steps) in LESSONS.items():
        if patch(rel, bp, steps):
            n += 1
    print(f"\npatched {n} lessons")
