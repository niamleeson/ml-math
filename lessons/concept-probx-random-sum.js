/* Probability (advanced) — cheat-sheet gap lesson.
   Random sums (a sum of a RANDOM number of i.i.d. terms) and Wald's identity:
     E[Y]  = E[N] E[X]
     Var(Y) = E[N] Var(X) + (E[X])^2 Var(N),   Y = sum_{i=1}^N X_i.
   Self-contained: lesson + CODE + CODEVIZ merged by id "probx-random-sum". */
(function () {
  window.LESSONS.push({
    id: "probx-random-sum",
    title: "Random sums & Wald's identity",
    tagline: "Add up a random NUMBER of random pieces: the mean and variance of the total have two clean formulas.",
    module: "Probability & Statistics",
    prereqs: ["prob-expectation", "prob-variance", "prob-conditional-expectation", "probx-total-variance"],

    whenToUse:
      `<p><b>Reach for random sums whenever the COUNT of things you add is itself random</b>, not fixed.
        The total $Y$ is a sum of $N$ pieces, and $N$ is a random number you do not know in advance. This is
        different from a plain sum of a fixed number of terms — here both the size of each piece AND how many
        pieces there are wobble.</p>
       <p><b>Where it shows up in real model building:</b></p>
       <ul>
         <li><b>Total value per session / user.</b> A user makes a random number of clicks $N$, each worth a
          random amount $X$. The expected session value is $E[N]\\,E[X]$ — count times piece, no need to model
          the joint distribution.</li>
         <li><b>Insurance and risk.</b> A random NUMBER of claims arrives, each of a random size. The total
          payout is a random sum; pricing needs both its mean and its variance.</li>
         <li><b>Queueing and arrivals.</b> A random number of jobs arrive in a window, each needing a random
          amount of work. Total work is a random sum (this is the compound-Poisson model).</li>
         <li><b>Bootstrap and resampling counts.</b> When the number of resampled items is random, aggregate
          statistics are random sums, and these formulas give their first two moments.</li>
       </ul>
       <p><b>Use a different tool when</b> the count is fixed (then it is an ordinary sum: $E[Y]=n\\,E[X]$,
        $\\operatorname{Var}(Y)=n\\,\\operatorname{Var}(X)$, with no count-variance term), or when the piece
        sizes $X_i$ depend on $N$ (then independence fails and these formulas do not apply — you must model the
        dependence directly).</p>`,

    application:
      `<p>Random sums are the backbone of <b>compound models</b>. The <b>compound Poisson</b> distribution —
        a Poisson count of i.i.d. jumps — models insurance losses, ad revenue per user, and shot noise.
        <b>Wald's identity</b> ($E[Y]=E[N]\\,E[X]$) is a workhorse in sequential analysis and the analysis of
        stopping times, where $N$ is when an algorithm halts. In ML systems, any <b>per-entity aggregate over a
        variable-length list</b> — total watch time per session, total spend per cohort, total tokens across a
        random number of turns — is a random sum, and these two formulas give its mean and spread without
        simulating the whole joint distribution.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting the count-variance term.</b> The classic slip is writing
          $\\operatorname{Var}(Y)=E[N]\\,\\operatorname{Var}(X)$ and stopping. That is only the within-count
          part. You must add $(E[X])^2\\,\\operatorname{Var}(N)$ for the randomness in HOW MANY pieces there
          are. Dropping it underestimates the spread, often badly.</li>
         <li><b>Using $\\operatorname{Var}(N)\\,\\operatorname{Var}(X)$ as the second term.</b> The
          count-variance term is $(E[X])^2\\,\\operatorname{Var}(N)$ — the SQUARE of the piece mean times the
          count variance, not a product of two variances.</li>
         <li><b>Assuming $E[Y]=E[N]\\,E[X]$ needs a special distribution.</b> It does not. Wald's identity holds
          for ANY count distribution, as long as $N$ is independent of the $X_i$ and the means are finite.</li>
         <li><b>Letting the count depend on the pieces.</b> If you stop summing once the total crosses a
          threshold, then $N$ is correlated with the $X_i$ and the simple formulas break. They require $N$
          independent of the i.i.d. piece values.</li>
         <li><b>Mixing up which mean is squared.</b> It is $(E[X])^2$, the square of the PIECE mean, that
          multiplies $\\operatorname{Var}(N)$ — not $(E[N])^2$. A quick units check: both terms must have the
          units of $Y^2$.</li>
       </ul>`,

    bigIdea:
      `<p>You know how to add up a <b>fixed</b> number of random numbers. A <b>random sum</b> makes the COUNT
        itself random: you draw a random whole number $N$, then add up $N$ independent pieces
        $X_1,\\dots,X_N$.</p>
       <p>Two sources of randomness now stack. The pieces wobble (each $X_i$ is random), and the number of
        pieces wobbles (the count $N$ is random). The mean of the total is wonderfully simple — just average
        count times average piece. The variance has TWO parts, one from each source of wobble.</p>
       <p>The trick that unlocks both formulas is the same one from conditional expectation: <b>first pretend
        you know $N$</b>, do the easy fixed-count calculation, and <b>then average over the random $N$</b>.</p>`,

    buildup:
      `<p>Suppose for a moment that the count is FIXED at $N=n$. Then $Y$ is an ordinary sum of $n$ i.i.d.
        pieces, and you already know both moments:</p>
       <ul class="steps">
         <li>Conditional mean: $E[Y \\mid N=n] = n\\,E[X]$ — $n$ copies of the piece mean.</li>
         <li>Conditional variance: $\\operatorname{Var}(Y \\mid N=n) = n\\,\\operatorname{Var}(X)$ — variances of
          independent pieces add.</li>
       </ul>
       <p>Written as functions of the random $N$, those say $E[Y \\mid N] = N\\,E[X]$ and
        $\\operatorname{Var}(Y \\mid N) = N\\,\\operatorname{Var}(X)$. Now average over $N$ using two tools you
        already have: the <b>law of iterated expectation</b> (see <code>prob-conditional-expectation</code>) for
        the mean, and the <b>law of total variance</b> (see <code>probx-total-variance</code>) for the variance.
        Plugging those two conditional facts in gives the formulas below.</p>`,

    symbols: [
      { sym: "$N$", desc: "the random COUNT: how many pieces we add up (a non-negative whole number). It is random and independent of the pieces." },
      { sym: "$X_i$", desc: "the $i$-th piece. The pieces are i.i.d. (independent and identically distributed) — same distribution, no influence on each other." },
      { sym: "$Y$", desc: "the random sum, the total $Y = X_1 + X_2 + \\dots + X_N$. If $N=0$ then $Y=0$." },
      { sym: "$E[N]$", desc: "the average count (expected number of pieces)." },
      { sym: "$\\operatorname{Var}(N)$", desc: "the spread of the count: how much the number of pieces varies." },
      { sym: "$E[X]$", desc: "the average piece value (every $X_i$ shares it)." },
      { sym: "$\\operatorname{Var}(X)$", desc: "the spread of a single piece." },
      { sym: "$E[Y \\mid N]$", desc: "the conditional mean of the total once the count $N$ is known; it equals $N\\,E[X]$." },
      { sym: "$\\operatorname{Var}(Y \\mid N)$", desc: "the conditional variance of the total once the count is known; it equals $N\\,\\operatorname{Var}(X)$." }
    ],

    formula:
      `$$ Y = \\sum_{i=1}^{N} X_i, \\qquad E[Y] = E[N]\\,E[X] $$
       $$ \\operatorname{Var}(Y) = \\underbrace{E[N]\\,\\operatorname{Var}(X)}_{\\text{spread of the pieces}} + \\underbrace{(E[X])^2\\,\\operatorname{Var}(N)}_{\\text{spread of the count}} $$`,

    whatItDoes:
      `<p><b>The mean is Wald's identity:</b> $E[Y]=E[N]\\,E[X]$ — just the average number of pieces times the
        average piece. Total expected session value is "expected clicks times value per click", and you never
        had to know the count distribution beyond its mean.</p>
       <p><b>The variance splits into two pieces.</b> The first term, $E[N]\\,\\operatorname{Var}(X)$, is the
        spread you would get if the count were fixed at its average — the pieces themselves wobbling. The second
        term, $(E[X])^2\\,\\operatorname{Var}(N)$, is the EXTRA spread caused by not knowing how many pieces
        there are. If the count were certain ($\\operatorname{Var}(N)=0$), the second term vanishes and you are
        back to an ordinary sum. If the pieces were certain ($\\operatorname{Var}(X)=0$) but the count random,
        only the second term survives — the total is just a fixed piece value times a random count.</p>`,

    derivation:
      `<p><b>1. The mean (Wald's identity), via the law of iterated expectation.</b></p>
       <ul class="steps">
         <li>Condition on the count: with $N$ known, $Y$ is a sum of $N$ i.i.d. pieces, so
          $E[Y \\mid N] = N\\,E[X]$.<div class="why">The mean of a sum is the sum of the means; with $N$ fixed
          there are $N$ identical means $E[X]$.</div></li>
         <li>Average over $N$ with the tower rule: $E[Y] = E\\big[E[Y \\mid N]\\big] = E\\big[N\\,E[X]\\big]$.</li>
         <li>$E[X]$ is a constant, so pull it out: $E[Y] = E[X]\\,E[N] = E[N]\\,E[X]$. $\\;\\blacksquare$</li>
       </ul>
       <p><b>2. The variance, via the law of total variance.</b></p>
       <p>The law says $\\operatorname{Var}(Y) = E\\big[\\operatorname{Var}(Y \\mid N)\\big] +
        \\operatorname{Var}\\big(E[Y \\mid N]\\big)$ (see <code>probx-total-variance</code>). Compute each part.</p>
       <ul class="steps">
         <li><b>Within-count part.</b> With $N$ known, the independent pieces have variances that add:
          $\\operatorname{Var}(Y \\mid N) = N\\,\\operatorname{Var}(X)$. Average it:
          $E\\big[\\operatorname{Var}(Y \\mid N)\\big] = E\\big[N\\,\\operatorname{Var}(X)\\big] =
          E[N]\\,\\operatorname{Var}(X)$.</li>
         <li><b>Between-count part.</b> The conditional mean is $E[Y \\mid N] = N\\,E[X]$, a constant $E[X]$
          times the random $N$. Its variance is $\\operatorname{Var}\\big(N\\,E[X]\\big) =
          (E[X])^2\\,\\operatorname{Var}(N)$.<div class="why">Scaling a random variable by a constant $c$
          multiplies its variance by $c^2$; here $c = E[X]$.</div></li>
         <li>Add the two parts: $\\operatorname{Var}(Y) = E[N]\\,\\operatorname{Var}(X) +
          (E[X])^2\\,\\operatorname{Var}(N)$. $\\;\\blacksquare$</li>
       </ul>
       <p>The structure mirrors the law of total variance exactly: the first term is the average within-count
        scatter, the second is the scatter caused by the random count.</p>`,

    example:
      `<p><b>Worked example.</b> A user's number of clicks in a session is $N\\sim\\text{Poisson}(5)$, so
        $E[N]=5$ and $\\operatorname{Var}(N)=5$ (for a Poisson the mean and variance are equal). Each click is
        worth a random amount $X$ with mean $E[X]=3$ and variance $\\operatorname{Var}(X)=4$, independent of the
        count. Find the mean and variance of the total value $Y$.</p>
       <ul class="steps">
         <li><b>Mean (Wald):</b> $E[Y] = E[N]\\,E[X] = 5 \\times 3 = 15$.</li>
         <li><b>Variance, within-count part:</b> $E[N]\\,\\operatorname{Var}(X) = 5 \\times 4 = 20$.</li>
         <li><b>Variance, between-count part:</b> $(E[X])^2\\,\\operatorname{Var}(N) = 3^2 \\times 5 = 9 \\times 5 = 45$.</li>
         <li><b>Total variance:</b> $\\operatorname{Var}(Y) = 20 + 45 = 65$.</li>
         <li><b>Sanity check.</b> If you wrongly dropped the count-variance term you would report 20 — less than
          a third of the true 65. The random count contributes most of the spread here.</li>
       </ul>`,

    practice: [
      {
        q: `A store gets $N\\sim\\text{Poisson}(10)$ customers a day ($E[N]=10$, $\\operatorname{Var}(N)=10$). Each customer spends an amount with mean $E[X]=20$ and variance $\\operatorname{Var}(X)=50$, independent of the count. Find $E[Y]$ and $\\operatorname{Var}(Y)$ for the total daily revenue $Y$.`,
        steps: [
          { do: `Mean by Wald: $E[Y] = E[N]\\,E[X] = 10 \\times 20$.`, why: `The mean of a random sum is average count times average piece.` },
          { do: `Within-count term: $E[N]\\,\\operatorname{Var}(X) = 10 \\times 50 = 500$.`, why: `Spread from the piece sizes, scaled by the average number of pieces.` },
          { do: `Between-count term: $(E[X])^2\\,\\operatorname{Var}(N) = 20^2 \\times 10 = 400 \\times 10 = 4000$.`, why: `Extra spread from the random count; the piece mean is squared.` },
          { do: `Add the two variance terms.`, why: `Law of total variance: within plus between.` }
        ],
        answer: `$E[Y] = 200$ and $\\operatorname{Var}(Y) = 500 + 4000 = 4500$.`
      },
      {
        q: `Why does $E[Y]=E[N]\\,E[X]$ hold for any independent count distribution, while the second variance term $(E[X])^2\\operatorname{Var}(N)$ can dominate?`,
        steps: [
          { do: `Apply the tower rule: $E[Y]=E[E[Y\\mid N]]=E[N\\,E[X]]=E[N]\\,E[X]$.`, why: `Iterated expectation only needs $E[Y\\mid N]=N\\,E[X]$, which holds for any $N$.` },
          { do: `For the variance, the between-count term grows with $(E[X])^2$ and with $\\operatorname{Var}(N)$.`, why: `A large piece mean amplifies count uncertainty quadratically.` }
        ],
        answer: `The mean only uses linearity through the tower rule, so it is distribution-free. But when the average piece $E[X]$ is large or the count is very uncertain (large $\\operatorname{Var}(N)$), the $(E[X])^2\\operatorname{Var}(N)$ term can swamp the within-count term — the uncertainty in HOW MANY pieces there are dominates the total spread.`
      },
      {
        q: `The count is fixed at exactly $N=8$ (so $\\operatorname{Var}(N)=0$). Each piece has $E[X]=2$, $\\operatorname{Var}(X)=9$. What are $E[Y]$ and $\\operatorname{Var}(Y)$, and which formula term disappears?`,
        steps: [
          { do: `Mean: $E[Y]=E[N]\\,E[X]=8\\times 2=16$.`, why: `Wald's identity with a degenerate (constant) count.` },
          { do: `Within-count term: $E[N]\\,\\operatorname{Var}(X)=8\\times 9=72$.`, why: `The only surviving variance term.` },
          { do: `Between-count term: $(E[X])^2\\,\\operatorname{Var}(N)=2^2\\times 0=0$.`, why: `A fixed count has zero variance.` }
        ],
        answer: `$E[Y]=16$, $\\operatorname{Var}(Y)=72$. The count-variance term $(E[X])^2\\operatorname{Var}(N)$ vanishes, and we recover the ordinary fixed-sum result $\\operatorname{Var}(Y)=n\\,\\operatorname{Var}(X)$.`
      }
    ]
  });

  window.CODE["probx-random-sum"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>The two identities are claims we can <b>test by simulation</b>. We pick a random count
        $N\\sim\\text{Poisson}(5)$ and an i.i.d. piece $X\\sim\\text{Gamma}$ tuned to mean $3$ and variance $4$,
        draw the total $Y=\\sum_{i=1}^{N}X_i$ a few million times, and compare the simulated $E[Y]$ and
        $\\operatorname{Var}(Y)$ against the closed forms $E[N]E[X]$ and
        $E[N]\\operatorname{Var}(X)+(E[X])^2\\operatorname{Var}(N)$. The simulated numbers land right on top of
        the theory ($\\approx 15$ and $\\approx 65$), confirming both Wald's identity and the random-sum
        variance.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# Random COUNT N ~ Poisson(lam):  E[N] = Var(N) = lam.
lam = 5.0
# i.i.d. PIECE X ~ Gamma(shape=k, scale=th), tuned to E[X]=3, Var(X)=4:
#   E[X] = k*th = 3,  Var(X) = k*th^2 = 4  ->  th = 4/3, k = 2.25
k, th = 2.25, 4.0 / 3.0
EX, VarX = k * th, k * th * th          # = 3.0, 4.0
EN, VarN = lam, lam                     # = 5.0, 5.0

trials = 2_000_000
N = rng.poisson(lam, size=trials)       # a random count per trial

# Draw one big pool of pieces, then slice it into the per-trial sums.
total_pieces = int(N.sum())
X = rng.gamma(k, th, size=total_pieces)
ends = np.cumsum(N)                      # end index of each trial's block
starts = ends - N                       # start index of each trial's block
csum = np.concatenate(([0.0], np.cumsum(X)))
Y = csum[ends] - csum[starts]           # Y_t = sum of that trial's pieces (0 if N=0)

EY_sim, VarY_sim = Y.mean(), Y.var()
EY_th = EN * EX                                  # Wald's identity
VarY_th = EN * VarX + EX**2 * VarN               # random-sum variance

print(f"E[X]={EX:.3f}  Var(X)={VarX:.3f}   E[N]={EN:.3f}  Var(N)={VarN:.3f}")
print(f"E[Y]   simulated = {EY_sim:8.4f}   theory E[N]E[X]               = {EY_th:8.4f}")
print(f"Var(Y) simulated = {VarY_sim:8.4f}   theory E[N]Var(X)+E[X]^2Var(N) = {VarY_th:8.4f}")
# E[X]=3.000  Var(X)=4.000   E[N]=5.000  Var(N)=5.000
# E[Y]   simulated =  14.9997   theory E[N]E[X]               =  15.0000
# Var(Y) simulated =  65.0144   theory E[N]Var(X)+E[X]^2Var(N) =  65.0000`
  };

  window.CODEVIZ["probx-random-sum"] = {
    question: "What does each random-sum formula actually compute? One diagram per formula: Wald's mean, the two-part variance, and the shape of Y itself.",
    charts: [
      {
        type: "bars",
        title: "Wald's identity: E[Y] = E[N] * E[X], factor by factor (N~Poisson(5), E[X]=3)",
        labels: ["E[N] = 5", "E[X] = 3", "E[Y] = E[N]*E[X]"],
        values: [5, 3, 15],
        valueLabels: ["5", "3", "15"],
        colors: ["#4ea1ff", "#ffb454", "#7ee787"]
      },
      {
        type: "bars",
        title: "Var(Y) = E[N]*Var(X) + (E[X])^2*Var(N): two contributions add to the total",
        labels: ["within-count E[N]*Var(X)", "between-count (E[X])^2*Var(N)", "total Var(Y)"],
        values: [20, 45, 65],
        valueLabels: ["20", "45", "65"],
        colors: ["#4ea1ff", "#c89bff", "#7ee787"]
      },
      {
        type: "bars",
        title: "Distribution of Y (500k simulated random sums); predicted mean E[Y]=15 marked",
        labels: ["0-5", "5-10", "10-15", "15-20", "20-25", "25-30", "30-35", "35-40"],
        values: [0.0879, 0.2062, 0.2532, 0.2069, 0.1310, 0.0678, 0.0293, 0.0117],
        valueLabels: ["0.088", "0.206", "0.253", "0.207", "0.131", "0.068", "0.029", "0.012"],
        colors: ["#9aa7b4", "#9aa7b4", "#7ee787", "#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4"]
      }
    ],
    caption: "First bar set: Wald's identity multiplies the average count (5) by the average piece (3) to get E[Y]=15. Second: the variance is two stacked contributions, the within-count spread E[N]Var(X)=20 plus the between-count spread (E[X])^2Var(N)=45, summing to Var(Y)=65. Third: the simulated distribution of Y piles up around the predicted mean E[Y]=15 (green bars), with spread matching Var(Y)=65 (the simulated histogram is illustrative; the means and variances are the exact formulas).",
    code: `import numpy as np
rng = np.random.default_rng(7)

lam = 5.0                 # N ~ Poisson(5):  E[N] = Var(N) = 5
k, th = 2.25, 4.0 / 3.0   # X ~ Gamma -> E[X] = 3, Var(X) = 4
EX, VarX, EN, VarN = k * th, k * th * th, lam, lam

# --- Formula 1: Wald's identity, factor by factor ---
EY = EN * EX                              # 5 * 3 = 15
wald_labels = ['E[N] = 5', 'E[X] = 3', 'E[Y] = E[N]*E[X]']
wald_values = [EN, EX, EY]               # [5, 3, 15]

# --- Formula 2: variance as two contributions ---
within  = EN * VarX                       # 5 * 4 = 20
between = EX**2 * VarN                     # 9 * 5 = 45
VarY    = within + between                 # 65
var_labels = ['within E[N]*Var(X)', 'between (E[X])^2*Var(N)', 'total Var(Y)']
var_values = [within, between, VarY]      # [20, 45, 65]

# --- Formula 3: simulated distribution of Y ---
trials = 500_000
N = rng.poisson(lam, size=trials)
X = rng.gamma(k, th, size=int(N.sum()))
ends = np.cumsum(N); starts = ends - N
csum = np.concatenate(([0.0], np.cumsum(X)))
Y = csum[ends] - csum[starts]
edges = np.arange(0, 45, 5.0)
counts, _ = np.histogram(Y, bins=edges)
frac = counts / trials
# frac -> [0.088, 0.206, 0.253, 0.207, 0.131, 0.068, 0.029, 0.012]
print('E[Y]=', EY, ' Var(Y)=', VarY)
print('sim E[Y]=', round(Y.mean(),3), ' sim Var(Y)=', round(Y.var(),3))
# E[Y]= 15.0  Var(Y)= 65.0
# sim E[Y]= 14.997  sim Var(Y)= 64.932`
  };
})();
