/* Probability & Statistics — "Jensen's inequality".
   Self-contained: lesson + CODE + CODEVIZ merged by id "prob-jensen". */
(function () {
  window.LESSONS.push({
    id: "prob-jensen",
    title: "Jensen's inequality",
    tagline: "Average a curved-up function and you get more than the function of the average.",
    module: "Probability & Statistics",
    prereqs: ["prob-expectation", "prob-variance", "ml-em"],

    whenToUse:
      `<p><b>Reach for Jensen's inequality whenever you push a random quantity through a curved (non-straight) function and need to know which way the average bends</b> &mdash; it tells you the direction of the gap between "average first, then apply the function" and "apply the function first, then average". It is the workhorse that proves a long list of ML (Machine Learning) bounds are true.</p>
       <p><b>Reach for it over:</b></p>
       <ul>
         <li><b>Assuming you can swap an average and a function</b> &mdash; when the function curves, $E[f(X)] \\ne f(E[X])$, and Jensen says which side is bigger. This is the rigorous version of "don't push a function through the mean".</li>
         <li><b>Computing the exact value</b> &mdash; when you only need a guaranteed one-sided bound (a floor or a ceiling), not the precise number; Jensen hands you the bound for free.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>The function is a straight line (linear) &mdash; then $E[f(X)] = f(E[X])$ exactly, no inequality needed (this is linearity of expectation).</li>
         <li>You need how <i>big</i> the gap is, not just its sign &mdash; estimate $E[f(X)]$ directly by sampling, or use a second-order (Taylor) approximation.</li>
       </ul>`,

    application:
      `<p>Jensen quietly underlies several core ML results:</p>
       <ul>
         <li><b>The EM (Expectation-Maximization) algorithm.</b> Its evidence lower bound (ELBO) &mdash; the quantity EM actually maximizes &mdash; is built by applying Jensen to the log of an expectation. Because $\\log$ curves down (concave), $\\log E[\\cdot] \\ge E[\\log \\cdot]$ gives a guaranteed floor under the true log-likelihood. See the linked <code>ml-em</code> lesson.</li>
         <li><b>Variational inference.</b> The same $\\log E \\ge E \\log$ step produces the variational lower bound used to train models you cannot integrate exactly (variational autoencoders, Bayesian neural nets).</li>
         <li><b>Maximization bias in Q-learning.</b> The $\\max$ of noisy value estimates is a convex function, so $E[\\max] \\ge \\max E$. The agent systematically over-estimates action values &mdash; the exact bug that Double Q-learning fixes.</li>
         <li><b>Why log-loss and KL divergence are never negative.</b> Both reduce to a Jensen step on the concave $\\log$, which is why these losses sit at zero only for a perfect match and are positive otherwise.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Getting the direction backwards.</b> Convex (curves up, like $x^2$) gives $E[f(X)] \\ge f(E[X])$; concave (curves down, like $\\log$) flips it to $\\le$. Sketch the curve and check which way it bows before quoting the bound.</li>
         <li><b>Assuming $E[f(X)] = f(E[X])$.</b> This holds only for a straight-line $f$. For any curved $f$ it is wrong, and Jensen tells you it is wrong in a predictable direction.</li>
         <li><b>Forgetting the equality case.</b> The bound is tight (an equation) only when $f$ is linear on the values $X$ actually takes, or when $X$ is a constant (zero spread). More spread in $X$ means a bigger gap.</li>
         <li><b>Mixing up convex and concave.</b> A function can be convex on one stretch and concave on another (e.g. a sigmoid). Jensen needs the function to curve the same way across the whole range $X$ visits.</li>
         <li><b>Plugging the mean into a non-linear metric.</b> Averaging inputs and then applying a curved score is not the same as averaging the scores. Report $E[f(X)]$, not $f(E[X])$, when $f$ is your loss or metric.</li>
       </ul>`,

    bigIdea:
      `<p>A function is <b>convex</b> if its graph curves <i>up</i> &mdash; it lies <i>below</i> every straight line drawn between two of its points (a <b>chord</b>), and <i>above</i> every tangent line that just touches it. Think of the bowl shape of $f(x) = x^2$.</p>
       <p>A function is <b>concave</b> if it curves the other way (down) &mdash; the upside-down bowl. The $\\log$ function is the standard example.</p>
       <p>Jensen's inequality is one plain sentence: <b>the average of a convex function is at least the function of the average.</b> Curving up, the bumps reach higher than the dip pulls down, so averaging lands you above the smooth point in the middle.</p>
       <p>For a concave function the whole picture flips, and "at least" becomes "at most".</p>`,

    buildup:
      `<p>Picture two points on a curve that bends upward, and the straight chord joining them.</p>
       <p>Because the curve sags <i>below</i> that chord, the midpoint of the chord sits <i>above</i> the curve. The chord's midpoint is the average of the two function values, $\\tfrac{1}{2}f(x_1) + \\tfrac{1}{2}f(x_2)$. The point on the curve below it is the function of the average, $f(\\tfrac{1}{2}x_1 + \\tfrac{1}{2}x_2)$.</p>
       <p>So for two equally likely points: $\\tfrac{1}{2}f(x_1) + \\tfrac{1}{2}f(x_2) \\ge f(\\tfrac{1}{2}x_1 + \\tfrac{1}{2}x_2)$. That is Jensen for the simplest random variable.</p>
       <p>Replace the two points with any random variable $X$ and the two-point average with a full expectation, and the same inequality holds.</p>`,

    symbols: [
      { sym: "$f$", desc: "the function we apply. <b>Convex</b> if it curves up (lies below its chords, above its tangents); <b>concave</b> if it curves down." },
      { sym: "$X$", desc: "a random variable &mdash; an uncertain numeric quantity with a distribution." },
      { sym: "$E[\\cdot]$", desc: "the expectation (long-run average): weight each value by its probability and add. $E[X]$ is the mean of $X$; $E[f(X)]$ is the mean of the transformed values." },
      { sym: "$\\ge$", desc: "'greater than or equal to'. The whole statement is an inequality, not an equation, unless $f$ is a straight line." },
      { sym: "chord", desc: "the straight line segment joining two points on the curve. A convex curve stays below its chords." },
      { sym: "tangent", desc: "a straight line that just grazes the curve at one point. A convex curve stays above its tangents." }
    ],

    formula: `$$ \\underbrace{E[f(X)] \\ge f(E[X])}_{f \\text{ convex}} \\qquad\\qquad \\underbrace{E[f(X)] \\le f(E[X])}_{f \\text{ concave}} $$`,

    whatItDoes:
      `<p>The left form: for a convex $f$, applying $f$ to every outcome and then averaging gives at least as much as averaging the outcomes first and then applying $f$ once.</p>
       <p>The right form: for a concave $f$, the inequality reverses.</p>
       <p>Equality holds (the two sides are equal) exactly when $f$ is linear over the values $X$ can take, or when $X$ is a constant so there is nothing to average. Otherwise the gap is strictly positive, and it grows as $X$ spreads out.</p>`,

    derivation:
      `<p><b>One clean line via the tangent.</b> A convex $f$ lies above each of its tangent lines. Draw the tangent at the mean $\\mu = E[X]$:</p>
       <p>$$ f(x) \\ge f(\\mu) + f'(\\mu)\\,(x - \\mu) \\quad \\text{for every } x. $$</p>
       <p>This is just "the curve never dips below its own tangent". Now take the expectation of both sides &mdash; expectation preserves $\\ge$ because it is a weighted average of non-negative gaps:</p>
       <p>$$ E[f(X)] \\ge f(\\mu) + f'(\\mu)\\,\\big(E[X] - \\mu\\big). $$</p>
       <p>But $E[X] - \\mu = 0$ by definition of $\\mu$, so the last term vanishes and we are left with $E[f(X)] \\ge f(\\mu) = f(E[X])$. For a concave $f$ the curve lies <i>below</i> its tangents, every inequality flips, and you get $\\le$.</p>
       <p><b>Why variance is non-negative falls right out.</b> Take $f(x) = x^2$, which is convex. Jensen gives $E[X^2] \\ge (E[X])^2$. The difference $E[X^2] - (E[X])^2$ is exactly the variance &mdash; so Jensen says variance $\\ge 0$, with equality only when $X$ is constant.</p>`,

    example:
      `<p>A tiny two-point case. Let $X$ equal $1$ or $9$, each with probability $\\tfrac{1}{2}$, and take the convex $f(x) = x^2$.</p>
       <ul class="steps">
         <li><b>Average first, then square</b> &nbsp;($f(E[X])$): $E[X] = \\tfrac{1+9}{2} = 5$, so $f(E[X]) = 5^2 = 25$.</li>
         <li><b>Square first, then average</b> &nbsp;($E[f(X)]$): $E[X^2] = \\tfrac{1^2 + 9^2}{2} = \\tfrac{1 + 81}{2} = 41$.</li>
         <li><b>Compare:</b> $E[f(X)] = 41 \\ge 25 = f(E[X])$. Jensen holds, as it must for a convex $f$.</li>
         <li><b>The gap is the variance.</b> $41 - 25 = 16$, and indeed $\\operatorname{Var}(X) = E[X^2] - (E[X])^2 = 41 - 25 = 16$ (the values sit $\\pm 4$ from the mean, so $4^2 = 16$). The Jensen gap and the variance are the same number here.</li>
       </ul>`,

    practice: [
      {
        q: `Let $X$ be $2$ or $4$ each with probability $\\tfrac{1}{2}$, and $f(x) = x^2$. Compute $E[f(X)]$ and $f(E[X])$, confirm Jensen, and identify the gap.`,
        steps: [
          { do: `Mean: $E[X] = \\tfrac{2+4}{2} = 3$, so $f(E[X]) = 3^2 = 9$.`, why: `"Average first, then square" is the right-hand side of the convex bound.` },
          { do: `Transformed mean: $E[X^2] = \\tfrac{2^2 + 4^2}{2} = \\tfrac{4 + 16}{2} = 10$.`, why: `"Square first, then average" is the left-hand side.` },
          { do: `Compare: $10 \\ge 9$, so Jensen holds.`, why: `$x^2$ is convex, so $E[f(X)] \\ge f(E[X])$ is guaranteed.` }
        ],
        answer: `<p>$E[f(X)] = 10$, $f(E[X]) = 9$, gap $= 1$, which equals $\\operatorname{Var}(X) = (\\pm 1)^2 = 1$.</p>`
      },
      {
        q: `For a concave function such as $f(x) = \\log x$, which way does Jensen point, and what does that say about $E[\\log X]$ versus $\\log E[X]$?`,
        steps: [
          { do: `$\\log$ curves downward, so it is concave.`, why: `Concave means the curve lies below its chords and the inequality reverses.` },
          { do: `Apply the concave form $E[f(X)] \\le f(E[X])$.`, why: `Concave flips the convex $\\ge$ into $\\le$.` }
        ],
        answer: `<p>$E[\\log X] \\le \\log E[X]$. Averaging logs gives at most the log of the average. This is the exact step that makes the EM lower bound (ELBO) and the KL divergence behave, and it is why $\\log E[\\cdot] \\ge E[\\log \\cdot]$.</p>`
      }
    ]
  });

  window.CODE["prob-jensen"] = {
    lib: "NumPy",
    runnable: false,
    explain: `<p>Sample a random variable $X$, then compare "transform then average" ($E[f(X)]$) with
      "average then transform" ($f(E[X])$). For the convex $f(x) = e^x$ Jensen guarantees
      $E[f(X)] \\ge f(E[X])$; we print the gap and watch it shrink toward $0$ as we squeeze the spread
      of $X$ (smaller standard deviation &rarr; smaller gap, exactly $0$ when $X$ is constant). Then we
      swap in the concave $f(x) = \\log x$ and the inequality flips. numpy is preinstalled in Colab.</p>`,
    code: `import numpy as np

rng = np.random.default_rng(0)
N = 100_000

def jensen_gap(f, X, name):
    Ef = np.mean(f(X))      # E[f(X)] : transform every sample, then average
    fE = f(np.mean(X))      # f(E[X]) : average first, then transform once
    print(f"{name:24s}  E[f(X)]={Ef:8.4f}   f(E[X])={fE:8.4f}   gap={Ef - fE:+.4f}")
    return Ef - fE

# --- CONVEX f(x) = e^x : Jensen says E[f(X)] >= f(E[X]), so gap >= 0 ---
print("convex f(x) = exp(x),  X ~ Normal(0, sigma):  gap should be >= 0 and shrink with sigma")
for sigma in [1.0, 0.5, 0.25, 0.0]:
    X = rng.normal(0.0, sigma, N) if sigma > 0 else np.zeros(N)
    jensen_gap(np.exp, X, f"  std(X) = {sigma:.2f}")

# --- CONCAVE f(x) = log x : the inequality FLIPS, so gap <= 0 ---
print("\\nconcave f(x) = log(x),  X ~ Uniform(1, 5):  gap should be <= 0")
Xpos = rng.uniform(1.0, 5.0, N)
jensen_gap(np.log, Xpos, "  uniform(1, 5)")

# convex f(x) = exp(x),  X ~ Normal(0, sigma):  gap should be >= 0 and shrink with sigma
#   std(X) = 1.00            E[f(X)]=  1.6482   f(E[X])=  0.9991   gap=+0.6491
#   std(X) = 0.50            E[f(X)]=  1.1344   f(E[X])=  1.0006   gap=+0.1338
#   std(X) = 0.25            E[f(X)]=  1.0320   f(E[X])=  1.0002   gap=+0.0318
#   std(X) = 0.00            E[f(X)]=  1.0000   f(E[X])=  1.0000   gap=+0.0000
#
# concave f(x) = log(x),  X ~ Uniform(1, 5):  gap should be <= 0
#   uniform(1, 5)            E[f(X)]=  1.0141   f(E[X])=  1.1010   gap=-0.0869`
  };

  window.CODEVIZ["prob-jensen"] = {
    question: "The chord between two points on a convex curve lies ABOVE the curve. That gap IS Jensen's inequality. Which way does it point for convex vs concave f?",
    charts: [
      {
        type: "line",
        title: "Jensen for convex e^x: chord (E[f(X)]) sits ABOVE the curve (f(E[X])) at x=E[X]=0.5",
        xlabel: "x",
        ylabel: "f(x) = e^x",
        series: [
          {
            name: "f(x) = e^x (convex curve)",
            color: "#4ea1ff",
            points: [[-1.0,0.3679],[-0.9,0.4066],[-0.8,0.4493],[-0.7,0.4966],[-0.6,0.5488],[-0.5,0.6065],[-0.4,0.6703],[-0.3,0.7408],[-0.2,0.8187],[-0.1,0.9048],[0.0,1.0],[0.1,1.1052],[0.2,1.2214],[0.3,1.3499],[0.4,1.4918],[0.5,1.6487],[0.6,1.8221],[0.7,2.0138],[0.8,2.2255],[0.9,2.4596],[1.0,2.7183],[1.1,3.0042],[1.2,3.3201],[1.3,3.6693],[1.4,4.0552],[1.5,4.4817],[1.6,4.953],[1.7,5.4739],[1.8,6.0496],[1.9,6.6859],[2.0,7.3891]]
          },
          {
            name: "chord from (x1, f(x1)) to (x2, f(x2))",
            color: "#ffb454",
            points: [[-1.0,0.3679],[2.0,7.3891]]
          },
          {
            name: "E[f(X)] = 3.879 (point on chord at x=0.5)",
            color: "#ff7b72",
            points: [[0.5,3.8785]]
          },
          {
            name: "f(E[X]) = 1.649 (point on curve at x=0.5)",
            color: "#7ee787",
            points: [[0.5,1.6487]]
          }
        ],
        interpret: "x is the input, y is f(x)=e^x; the blue curve bows UP (convex). The orange chord joins the two outcomes x1=-1 and x2=2 and stays ABOVE the curve between them. At x=E[X]=0.5 the chord height is E[f(X)]=3.879 (red dot) and the curve height is f(E[X])=1.649 (green dot). <b>Read it as:</b> red sitting above green is the whole inequality — for a convex f, averaging-then-mapping (chord) overshoots mapping-then-averaging (curve). The vertical red-to-green distance IS the Jensen gap (+2.230)."
      },
      {
        type: "line",
        title: "Concave log x: chord lies BELOW the curve — Jensen flips to E[f(X)] <= f(E[X])",
        xlabel: "x",
        ylabel: "f(x) = log x",
        series: [
          { name: "f(x) = log x (concave curve)", color: "#4ea1ff",
            points: [[1.0,0.0],[1.4,0.3365],[1.8,0.5878],[2.2,0.7885],[2.6,0.9555],[3.0,1.0986],[3.4,1.2238],[3.8,1.3350],[4.2,1.4351],[4.6,1.5261],[5.0,1.6094]] },
          { name: "chord from (1, log1) to (5, log5)", color: "#ffb454",
            points: [[1.0,0.0],[5.0,1.6094]] },
          { name: "E[f(X)] = 0.805 (chord at x=E[X]=3)", color: "#ff7b72", points: [[3.0,0.8047]] },
          { name: "f(E[X]) = 1.099 (curve at x=3)", color: "#7ee787", points: [[3.0,1.0986]] }
        ],
        interpret: "Same setup, concave f(x)=log x with two-point X=1 or 5 so E[X]=3. Now the curve bows DOWN, so the orange chord sits BELOW it. The chord height E[f(X)]=0.805 (red) is now UNDER the curve height f(E[X])=1.099 (green). <b>Read it as:</b> red below green = the flipped inequality E[f(X)] ≤ f(E[X]) for concave f — this is the log E ≥ E log step behind the EM/ELBO bound. (Two-point illustrative case; gap -0.294.)"
      },
      {
        type: "bars",
        title: "E[f(X)] vs f(E[X]):  convex e^x overshoots (gap up), concave log undershoots (gap down)",
        xlabel: "quantity",
        ylabel: "value",
        labels: ["e^x: E[f(X)]", "e^x: f(E[X])", "log: E[f(X)]", "log: f(E[X])"],
        values: [3.8785, 1.6487, 1.0141, 1.1010],
        valueLabels: ["3.879", "1.649", "1.014", "1.101"],
        colors: ["#7ee787", "#4ea1ff", "#ff7b72", "#4ea1ff"],
        interpret: "Each pair compares the two sides of Jensen for one f. For convex e^x the E[f(X)] bar (green) towers over f(E[X]) (blue) — gap up. For concave log the E[f(X)] bar (red) sits just BELOW f(E[X]) (blue) — gap down, and small because Uniform(1,5) has modest spread. <b>Read it as:</b> which colored bar beats blue tells you the inequality direction; convex → E[f(X)] wins, concave → f(E[X]) wins. (e^x pair is the two-point case; log pair is sampled, seed 0.)"
      },
      {
        type: "bars",
        title: "Equality case: as X's spread shrinks the gap collapses to 0 (convex e^x)",
        xlabel: "std(X)",
        ylabel: "Jensen gap  E[f(X)] - f(E[X])",
        labels: ["1.00", "0.50", "0.25", "0.00 (constant X)"],
        values: [0.6491, 0.1338, 0.0318, 0.0000],
        valueLabels: ["+0.649", "+0.134", "+0.032", "0.000"],
        colors: ["#7ee787", "#7ee787", "#ffb454", "#9aa7b4"],
        interpret: "Here y is the Jensen gap itself for convex e^x, as we squeeze the spread of X (Normal with shrinking std). The gap stays ≥ 0 (Jensen never breaks for convex f) but shrinks as X concentrates, and hits exactly 0 when X is constant (grey bar) — nothing to average, so both sides agree. <b>Read it as:</b> more spread = bigger gap; zero spread = equality. (Real numbers, seed 0.)"
      },
      {
        type: "line",
        title: "Pitfall: sigmoid is convex then concave — Jensen needs ONE curvature over X's range",
        xlabel: "x",
        ylabel: "f(x) = 1/(1+e^-x)  (sigmoid)",
        series: [
          { name: "sigmoid (convex for x<0, concave for x>0)", color: "#c89bff",
            points: [[-6,0.0025],[-5,0.0067],[-4,0.018],[-3,0.0474],[-2,0.1192],[-1,0.2689],[0,0.5],[1,0.7311],[2,0.8808],[3,0.9526],[4,0.982],[5,0.9933],[6,0.9975]] }
        ],
        interpret: "The sigmoid curves UP on the left (x<0) and DOWN on the right (x>0), with the inflection at x=0. Jensen needs f to bow the SAME way across every value X can take; if X straddles 0 here, neither the convex (≥) nor the concave (≤) bound is guaranteed. <b>Read it as:</b> an S-shape (or any curve that switches bend) is a red flag — restrict to one side, or split the expectation, before quoting a Jensen direction. (Illustrative.)"
      }
    ],
    caption: "Five views, each with its own interpret. Chart 1: the canonical convex chord-above-curve picture (e^x, two-point X=-1 or 2, E[X]=0.5, gap +2.230). Chart 2: the concave mirror image (log x, two-point X=1 or 5, chord below curve, gap -0.294). Chart 3: both directions as bars. Chart 4: the equality/variant case — the gap shrinks to 0 as X's spread vanishes (real, seed 0). Chart 5: the sigmoid pitfall — a curve that changes curvature, where no single Jensen direction holds.",
    code: `import numpy as np

# --- CONVEX f(x) = e^x : the canonical Jensen chord-above-curve picture ---
# Two-point X: x1 = -1 or x2 = 2, each with prob 1/2, so E[X] = 0.5
x1, x2 = -1.0, 2.0
f = np.exp
EX = 0.5 * (x1 + x2)              # 0.5  = E[X]
Ef = 0.5 * (f(x1) + f(x2))        # 3.8785 = E[f(X)] = chord height at x = E[X]
fE = f(EX)                        # 1.6487 = f(E[X]) = curve height at x = E[X]
print(round(Ef, 4), round(fE, 4), round(Ef - fE, 4))   # 3.8785 1.6487 2.2297  (gap > 0)

# curve samples e^x on [-1, 2] (the blue line)
xs = np.linspace(-1.0, 2.0, 31)
curve = [[round(float(x), 4), round(float(np.exp(x)), 4)] for x in xs]

# --- CONCAVE f(x) = log x : inequality flips, E[f(X)] <= f(E[X]) ---
rng = np.random.default_rng(0)
Xp = rng.uniform(1.0, 5.0, 100_000)
conc_Ef = np.mean(np.log(Xp))    # 1.0141
conc_fE = np.log(np.mean(Xp))    # 1.1010
print(round(conc_Ef, 4), round(conc_fE, 4))   # 1.0141 1.101  -> gap -0.0869`
  };
})();
