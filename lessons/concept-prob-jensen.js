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
    question: "For a convex function the average overshoots f(E[X]); for a concave one it undershoots. How big is the gap, and which way does it point?",
    charts: [
      {
        type: "bars",
        title: "E[f(X)] vs f(E[X]):  convex e^x overshoots (gap up), concave log undershoots (gap down)",
        xlabel: "quantity",
        ylabel: "value",
        labels: ["e^x: E[f(X)]", "e^x: f(E[X])", "log: E[f(X)]", "log: f(E[X])"],
        values: [1.6482, 0.9991, 1.0141, 1.1010],
        valueLabels: ["1.648", "0.999", "1.014", "1.101"],
        colors: ["#7ee787", "#4ea1ff", "#ff7b72", "#4ea1ff"]
      }
    ],
    caption: "Real numpy run (100,000 samples, seed 0). CONVEX f(x)=e^x with X~Normal(0,1): E[f(X)]=1.648 sits ABOVE f(E[X])=0.999, a +0.649 gap (green over blue) — exactly Jensen's E[f(X)] >= f(E[X]). CONCAVE f(x)=log x with X~Uniform(1,5): E[f(X)]=1.014 sits BELOW f(E[X])=1.101, a -0.087 gap (red under blue) — the inequality flips to E[f(X)] <= f(E[X]). Curving up lifts the average; curving down drops it.",
    code: `import numpy as np

rng = np.random.default_rng(0)
N = 100_000

# CONVEX f(x) = e^x, X ~ Normal(0, 1):  E[f(X)] >= f(E[X])
X = rng.normal(0.0, 1.0, N)
conv_Ef = np.mean(np.exp(X))     # 1.6482
conv_fE = np.exp(np.mean(X))     # 0.9991  (mean(X) ~ 0, so e^0 ~ 1)

# CONCAVE f(x) = log x, X ~ Uniform(1, 5):  E[f(X)] <= f(E[X])
Xp = rng.uniform(1.0, 5.0, N)
conc_Ef = np.mean(np.log(Xp))    # 1.0141
conc_fE = np.log(np.mean(Xp))    # 1.1010

print(round(conv_Ef, 4), round(conv_fE, 4))   # 1.6482 0.9991  -> gap +0.6491
print(round(conc_Ef, 4), round(conc_fE, 4))   # 1.0141 1.101   -> gap -0.0869`
  };
})();
