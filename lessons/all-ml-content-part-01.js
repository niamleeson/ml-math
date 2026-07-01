/* All ML — authored content for Part 1: Statistical Learning Theory (1.1–1.11).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 1.1 Empirical Risk Minimization ---------------- */
window.ALLML_CONTENT["1.1"] = {
  tagline: "We can't measure the true error, so we minimize the error we can see: the average loss on the training sample.",
  context: String.raw`
    <p>This is the first stone in the whole tower of learning theory, and it rests on things you already know.</p>
    <ul>
      <li><b>Loss functions</b> (0-1 loss for classification, squared loss for regression) give us a number for "how wrong" a single prediction is. Empirical risk is just their average.</li>
      <li><b>Expectation</b> from probability is the true target: the error we actually care about is an expected loss over the whole population, which we cannot see.</li>
      <li><b>A hypothesis class</b> $H$ (the set of models we allow) is the menu we choose from.</li>
    </ul>
    <p>Where it leads: ERM is the algorithm every later lesson analyzes. The moment we minimize training error we open the door to <b>overfitting</b>, which forces the bias-complexity tradeoff (1.2); the question "how much data makes ERM safe?" becomes PAC learning (1.3); and the tool that proves ERM works is uniform convergence (1.11).</p>`,
  intuition: String.raw`
    <p>We want the model with the smallest <b>true risk</b> $R(h)=\mathbb{E}_{(x,y)}[\text{loss}(h(x),y)]$ — the expected loss on data we have never seen. The trouble is fatal on its face: we do not know the distribution, so we cannot compute $R(h)$ for any model.</p>
    <p>The naive and only sensible fix: replace the expectation we cannot compute with the average we can. Collect a sample and minimize the <b>empirical risk</b>, the average loss on that sample. That single substitution — population expectation becomes sample average — is Empirical Risk Minimization.</p>
    <p>The pain hiding here, and the reason the rest of Part 1 exists: minimizing training error is not the same as minimizing true error. A model rich enough can memorize the sample, driving training error to zero while true error stays large. The design decision to notice is why we average the loss at all: for a <b>fixed</b> model the sample average is an unbiased estimate of true risk (the law of large numbers), but the instant we <b>choose</b> the model by looking at the same data, that guarantee cracks.</p>`,
  mathematics: String.raw`
    <p>True risk and its empirical stand-in, for a sample $S=\{(x_i,y_i)\}_{i=1}^m$:</p>
    <div class="formula-box">$$R(h)=\mathbb{E}[\ell(h(x),y)], \qquad R_S(h)=\frac{1}{m}\sum_{i=1}^{m}\ell(h(x_i),y_i)$$</div>
    <p>ERM returns $\hat h=\arg\min_{h\in H} R_S(h)$ — the model with the least training error.</p>

    <p><b>Classification with 0-1 loss.</b> Take five points $x=\{1,2,3,4,5\}$ with labels $y=\{0,0,1,1,1\}$, and threshold rules $h_t(x)=1$ if $x>t$. Count the mistakes:</p>
    <ol class="work">
      <li>$t=1.5$: predictions $\{0,1,1,1,1\}$, wrong on $x{=}2$ only $\Rightarrow R_S=1/5=0.20$</li>
      <li>$t=2.5$: predictions $\{0,0,1,1,1\}$, wrong on none $\Rightarrow R_S=0/5=0.00$</li>
      <li>$t=3.5$: predictions $\{0,0,0,1,1\}$, wrong on $x{=}3$ only $\Rightarrow R_S=1/5=0.20$</li>
    </ol>
    <p>ERM scans the class and returns $t=2.5$, the rule with the lowest count. Notice what the empirical risk did: it turned "which rule is best" into a number we can actually compute and minimize.</p>

    <p><b>Regression with squared loss.</b> Fit a single constant $c$ to targets $\{2,4,6\}$; the empirical risk is the mean squared error:</p>
    <ol class="work">
      <li>$c=3$: $\tfrac{1}{3}\big((3{-}2)^2+(3{-}4)^2+(3{-}6)^2\big)=\tfrac{1}{3}(1+1+9)=3.667$</li>
      <li>$c=4$: $\tfrac{1}{3}(4+0+4)=2.667$</li>
      <li>$c=5$: $\tfrac{1}{3}(9+1+1)=3.667$</li>
    </ol>
    <p>The minimum sits at $c=4$, which is exactly the mean of the targets, and the risk there, $2.667$, is exactly their variance. That is a general and reassuring fact: under squared loss the empirical-risk minimizer is the sample mean, so ERM recovers the estimator you would have written down by instinct.</p>

    <p><b>Empirical is only an estimate.</b> For a fixed $h$, $\mathbb{E}[R_S(h)]=R(h)$ — the training error is an unbiased guess of the truth. But $\min_{h}R_S(h)$ is biased <b>downward</b>: by choosing the model that looks best on this particular sample, we cherry-pick favorable noise. On the separable data above ERM reached $R_S=0$, yet if labels carried 10% noise the best achievable true risk (the Bayes risk) would be $0.10$ — no model, however chosen, can beat that floor. The gap between a training zero and that floor is the whole story of overfitting.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Zero training error is a warning, not a trophy.</b> A class rich enough to memorize drives $R_S$ to $0$ while $R$ stays high — the mechanism is the downward bias of $\min_h R_S$, quantified later by uniform convergence (1.11).</li>
      <li><b>Touching test data during ERM.</b> If any test point leaks into the sample you minimize on, $R_S$ stops estimating $R$ and the guarantee evaporates.</li>
      <li><b>Assuming the minimizer is unique.</b> Several models can tie on training error (as $t=1.5$ and $t=3.5$ tie above); ERM alone does not say which to prefer.</li>
      <li><b>Forgetting the Bayes floor.</b> When labels are noisy, even the true-best model has nonzero risk; chasing $R_S$ below that floor is chasing noise.</li>
    </ul>`
};

/* ---------------- 1.2 The bias–complexity tradeoff ---------------- */
window.ALLML_CONTENT["1.2"] = {
  tagline: "Total error splits in two: how good the best model in your class could be, and how well finite data lets you find it.",
  context: String.raw`
    <p>This lesson is the learning-theory face of a friend you have already met.</p>
    <ul>
      <li><b>ERM (1.1)</b> showed that a richer class can fit the sample better — this lesson prices what that richness costs.</li>
      <li><b>The bias-variance tradeoff (3.3)</b> is the same idea in estimator language; here we recast it as approximation versus estimation error.</li>
    </ul>
    <p>Where it leads: the balance we describe is exactly what Structural Risk Minimization (1.7) and regularization (1.8) automate, and the "how rich is my class" term becomes VC dimension (1.4) and Rademacher complexity (1.5).</p>`,
  intuition: String.raw`
    <p>When our learned model $\hat h$ underperforms the best-possible predictor, the shortfall has two distinct sources, and confusing them is the classic mistake.</p>
    <p>The first is <b>approximation error</b>: even the very best model inside our class $H$ may be unable to express the truth. A straight line cannot bend to a curve no matter how much data you throw at it. The second is <b>estimation error</b>: finite data means we cannot reliably identify that best-in-class model; the sample points us slightly wrong.</p>
    <p>Here is the tension. Enlarging $H$ shrinks approximation error — a bigger menu contains better dishes. But it <b>grows</b> estimation error — more candidates means more ways for a finite sample to fool us into the wrong one. You cannot drive both to zero at a fixed sample size. The design lesson that overturns beginners' intuition: the goal is not the most expressive class, it is the class whose two errors <b>balance</b> for the data you actually have.</p>`,
  mathematics: String.raw`
    <p>Write $R^\star$ for the Bayes risk (the unbeatable floor), $h^\star=\arg\min_{h\in H}R(h)$ for the best model in the class, and $\hat h$ for what ERM returns. The excess risk decomposes exactly:</p>
    <div class="formula-box">$$R(\hat h)-R^\star=\underbrace{\big(R(h^\star)-R^\star\big)}_{\text{approximation}}+\underbrace{\big(R(\hat h)-R(h^\star)\big)}_{\text{estimation}}$$</div>
    <p>The first term depends only on how expressive $H$ is; the second on how much data you have. A useful model for the estimation term is $\sqrt{\text{complexity}/2m}$, which grows with class size and shrinks with sample size $m$.</p>

    <p><b>Watch the two terms trade at a fixed sample size</b> $m=100$. As we widen the class, approximation error falls but the estimation term climbs:</p>
    <ol class="work">
      <li>small class, complexity $10$: approx $=0.20$, est $=\sqrt{10/200}=0.224$, total $\approx 0.424$</li>
      <li>medium class, complexity $100$: approx $=0.08$, est $=\sqrt{100/200}=0.707$, total $\approx 0.787$</li>
      <li>large class, complexity $1000$: approx $=0.02$, est $=\sqrt{1000/200}=2.236$, total $\approx 2.256$</li>
    </ol>
    <p>Read the totals, not the columns: approximation keeps improving ($0.20\to0.08\to0.02$), yet the total error gets <b>worse</b> because estimation error races ahead. At $m=100$ the smallest class wins. This is the whole warning of the lesson in three lines — expressiveness you cannot afford with your data is a liability, not an asset.</p>

    <p><b>More data changes the verdict.</b> The estimation term scales like $1/\sqrt{m}$, so quadrupling the sample halves it. The medium class's estimation error of $0.707$ at $m=100$ would fall to $\sqrt{100/(2\cdot1600)}=0.177$ at $m=1600$ — now its small approximation error of $0.08$ makes it the better choice. The right class is a moving target that grows with your data.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Believing a bigger model is always better.</b> It only lowers approximation error; if data is scarce the estimation term dominates and total error rises, exactly as the $m=100$ table shows.</li>
      <li><b>Ignoring $m$ when choosing complexity.</b> The optimal class size grows with the sample; a class that overfits at $m=100$ may be ideal at $m=10{,}000$.</li>
      <li><b>Confusing approximation error with the Bayes floor.</b> Approximation error is your class's limitation and is fixable by enlarging $H$; the Bayes risk $R^\star$ is irreducible noise and is not.</li>
    </ul>`
};

/* ---------------- 1.3 PAC learning ---------------- */
window.ALLML_CONTENT["1.3"] = {
  tagline: "Probably Approximately Correct: with enough samples, ERM is within epsilon of the best, with probability at least one minus delta.",
  context: String.raw`
    <p>This lesson turns the worry of 1.1 into a guarantee with a number attached.</p>
    <ul>
      <li><b>ERM (1.1)</b> gave us the algorithm; PAC tells us when to trust it.</li>
      <li><b>The bias-complexity tradeoff (1.2)</b> named estimation error; PAC bounds it explicitly as a function of sample size.</li>
      <li><b>Probability</b> supplies the two knobs: accuracy $\varepsilon$ and confidence $\delta$.</li>
    </ul>
    <p>Where it leads: the formula here works only for a <b>finite</b> class; making it work for infinite classes (thresholds, linear models) forces VC dimension (1.4), and the inequality itself is proved by uniform convergence (1.11).</p>`,
  intuition: String.raw`
    <p>"Approximately correct" means the model's true error is within $\varepsilon$ of the best possible. "Probably" means this holds with probability at least $1-\delta$ over the random sample. The founding question of the field: how many examples $m$ do we need to promise both?</p>
    <p>The pain PAC removes is the pit-of-uncertainty in 1.1 — you minimized training error, but was your sample big enough to mean anything? Without a bound you are guessing. PAC replaces the guess with a sample-complexity formula.</p>
    <p>The design decision worth savoring appears in the formula's shape: the dependence on the class size $|H|$ is <b>logarithmic</b>. Doubling the number of hypotheses barely moves the required sample size. Expressiveness, it turns out, is cheap; it is accuracy $\varepsilon$ that is expensive.</p>`,
  mathematics: String.raw`
    <p>For a finite class in the realizable case (some $h\in H$ has zero true error), ERM is PAC with sample complexity:</p>
    <div class="formula-box">$$m \;\ge\; \frac{1}{\varepsilon}\Big(\ln|H|+\ln\tfrac{1}{\delta}\Big)$$</div>

    <p><b>Plug in real numbers.</b> Take $|H|=100$, accuracy $\varepsilon=0.1$, confidence $\delta=0.05$:</p>
    <ol class="work">
      <li>$\ln|H|=\ln 100=4.605$</li>
      <li>$\ln(1/\delta)=\ln 20=2.996$</li>
      <li>sum $=7.601$, divide by $\varepsilon=0.1$: $m\ge 76.0 \Rightarrow 77$ examples</li>
    </ol>
    <p>So 77 labeled points buy you a model within $0.1$ of optimal, 95% of the time. Now turn each knob one at a time to feel its price.</p>
    <ol class="work">
      <li>tighten accuracy to $\varepsilon=0.05$ (everything else fixed): $7.601/0.05=152.0\Rightarrow 153$ — halving $\varepsilon$ doubled $m$</li>
      <li>enlarge the class a hundredfold to $|H|=10{,}000$: $(\ln 10^4+\ln 20)/0.1=122.1\Rightarrow 123$ — a $100\times$ bigger class needs only ~46 more points</li>
      <li>demand more confidence, $\delta=0.01$: $(\ln 100+\ln 100)/0.1=92.1\Rightarrow 93$</li>
    </ol>
    <p>The contrast in steps 1 and 2 is the punchline: accuracy sits <b>outside</b> as $1/\varepsilon$ and dominates, while class size sits <b>inside a logarithm</b> and barely matters.</p>

    <p><b>Just how flat is the log dependence?</b> Hold $\varepsilon=0.1$ and watch $\ln|H|/\varepsilon$ as the class doubles:</p>
    <ol class="work">
      <li>$|H|=50\to 39.1$, $\;100\to 46.1$, $\;200\to 53.0$, $\;400\to 59.9$</li>
      <li>each doubling adds exactly $\ln 2/\varepsilon=0.693/0.1=6.93$ samples</li>
    </ol>
    <p>You can double your hypothesis budget again and again for a flat ~7 extra examples each time. This is why expressive model families are viable at all.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using the realizable formula in the agnostic case.</b> When no model is perfect, the dependence worsens to $1/\varepsilon^2$, not $1/\varepsilon$ — the sample counts above become far larger.</li>
      <li><b>Applying it to infinite classes.</b> $\ln|H|$ is meaningless when $|H|=\infty$; you must switch to VC dimension (1.4).</li>
      <li><b>Reading the bound as tight.</b> It is an upper bound on the samples that suffice; real problems often learn from far fewer.</li>
    </ul>`
};

/* ---------------- 1.4 VC dimension ---------------- */
window.ALLML_CONTENT["1.4"] = {
  tagline: "The largest set of points a class can label in every possible way: the right notion of size when the class is infinite.",
  context: String.raw`
    <p>This lesson rescues PAC learning from a dead end.</p>
    <ul>
      <li><b>PAC (1.3)</b> priced learning with $\ln|H|$, which is useless for the infinite classes we actually use — a threshold rule has infinitely many settings.</li>
      <li><b>Shattering</b> builds directly on the idea of a labeling (dichotomy) from classification.</li>
    </ul>
    <p>Where it leads: VC dimension becomes the complexity term in the generalization bounds of 1.6 and the ladder rungs of SRM (1.7); Rademacher complexity (1.5) is its data-dependent cousin.</p>`,
  intuition: String.raw`
    <p>Counting hypotheses fails for infinite classes, yet those classes plainly still learn. So cardinality is the wrong ruler. We need a measure of a class's <b>effective</b> richness, and shattering provides it.</p>
    <p>A class <b>shatters</b> a set of points if, for every possible assignment of labels to them, some hypothesis in the class realizes it. The <b>VC dimension</b> is the size of the largest set the class can shatter. It answers "how many points can this class label completely arbitrarily?" — the true expressive capacity, whether the class has a hundred members or infinitely many.</p>
    <p>The design decision is to measure richness by <b>behavior on data</b> rather than by counting, and the payoff is enormous: a class with infinite cardinality but finite VC dimension is still PAC-learnable, with the sample complexity you would hope for.</p>`,
  mathematics: String.raw`
    <p>A class shatters $m$ points if it realizes all $2^m$ labelings of them; the VC dimension $d$ is the largest such $m$.</p>

    <p><b>Thresholds on the line</b>, $h_t(x)=\mathbf{1}[x>t]$. One point can be labeled both ways (put $t$ above or below it), so $d\ge 1$. But two points $a\lt b$ cannot get the pattern "$a$ positive, $b$ negative": any threshold that makes $a$ positive also makes the larger $b$ positive. One labeling is unreachable, so thresholds fail to shatter 2 points and $d=1$.</p>

    <p><b>Intervals</b> $h_{[a,b]}(x)=\mathbf{1}[a\le x\le b]$. Two points $a\lt b$ are shattered — all four labelings are reachable:</p>
    <ol class="work">
      <li>$\{\}$: an interval covering neither</li>
      <li>$\{a\}$: a small interval around $a$</li>
      <li>$\{b\}$: a small interval around $b$</li>
      <li>$\{a,b\}$: an interval covering both</li>
    </ol>
    <p>So $d\ge 2$. Three points $a\lt b\lt c$ break it: the labeling "$a$ and $c$ positive, $b$ negative" needs a single interval that includes the two ends but excludes the middle, which is impossible. Hence intervals have $d=2$.</p>
    <p>The pattern continues: <b>half-planes in the plane</b> have $d=3$ (three points in general position are shattered; no four can be), and <b>axis-aligned rectangles</b> have $d=4$.</p>

    <p><b>Why finite VC tames an infinite class</b> — Sauer's lemma. A class of VC dimension $d$ can produce at most $\sum_{i=0}^{d}\binom{m}{i}$ labelings of $m$ points, which is <b>polynomial</b> in $m$, not the exponential $2^m$ a truly arbitrary labeler would need:</p>
    <ol class="work">
      <li>$d=2$, $m=5$: at most $\binom{5}{0}{+}\binom{5}{1}{+}\binom{5}{2}=1{+}5{+}10=16$, versus $2^5=32$</li>
      <li>$d=3$, $m=10$: at most $1{+}10{+}45{+}120=176$, versus $2^{10}=1024$</li>
    </ol>
    <p>Past the VC dimension the class simply cannot keep up with all labelings — its count grows like $m^d$ while arbitrary labeling grows like $2^m$. That polynomial ceiling is exactly what makes the generalization bounds in 1.6 finite, and the resulting sample complexity is $O\big((d+\ln\tfrac1\delta)/\varepsilon\big)$, with $d$ stepping into the role $\ln|H|$ played for finite classes.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Equating VC dimension with parameter count.</b> They often differ; a one-parameter class like $\{\mathbf{1}[\sin(\omega x)>0]\}$ has <b>infinite</b> VC dimension and cannot be PAC-learned.</li>
      <li><b>Reading high VC as "powerful and good".</b> High VC means the class can shatter more, which is precisely the capacity to overfit; it raises the estimation term in 1.2.</li>
      <li><b>Forgetting general position.</b> Shattering claims (half-planes shatter 3 points) assume the points are not degenerate — three collinear points may not be shattered.</li>
    </ul>`
};

/* ---------------- 1.5 Rademacher complexity ---------------- */
window.ALLML_CONTENT["1.5"] = {
  tagline: "How well a class can fit pure random noise: a data-dependent measure of richness that often beats VC dimension.",
  context: String.raw`
    <p>This lesson sharpens the ruler from 1.4.</p>
    <ul>
      <li><b>VC dimension (1.4)</b> is worst-case and distribution-free — the same number no matter what your data looks like. Rademacher complexity adapts to the actual sample, and is usually tighter.</li>
      <li><b>Expectation over random signs</b> is the one new probabilistic ingredient.</li>
    </ul>
    <p>Where it leads: it plugs straight into the generalization bounds of 1.6, giving data-dependent guarantees; the same noise-fitting idea underlies modern margin and neural-network bounds.</p>`,
  intuition: String.raw`
    <p>Here is a wonderfully direct test of "is my class too rich?": try to fit <b>pure random noise</b>. Replace the real labels with coin flips $\sigma_i\in\{-1,+1\}$ and ask how well the best hypothesis in the class can correlate with them. A class that can chase random labels is a class that can memorize, and memorization is overfitting.</p>
    <p>The pain this addresses is VC's bluntness: VC dimension is a single worst-case number that ignores your particular data distribution, so its bounds can be loose. Rademacher complexity is computed <b>on your sample</b>, so it tightens automatically when the data is benign.</p>
    <p>The design decision — measure richness by noise-fitting ability — turns "complexity" from an abstract combinatorial quantity into something you can, in principle, estimate by running the learner against shuffled labels.</p>`,
  mathematics: String.raw`
    <p>The empirical Rademacher complexity of a class $F$ on a sample of $m$ points averages, over random sign vectors $\sigma$, the best correlation any function achieves:</p>
    <div class="formula-box">$$\hat{\mathfrak{R}}_S(F)=\mathbb{E}_{\sigma}\Big[\sup_{f\in F}\frac{1}{m}\sum_{i=1}^{m}\sigma_i f(x_i)\Big]$$</div>

    <p><b>A single fixed function fits nothing.</b> If $F$ holds just one function, the sup disappears and we average $\tfrac1m\sigma\cdot f$ over random signs. Since $\mathbb{E}[\sigma_i]=0$, this expectation is exactly $0$ — a lone function cannot correlate with noise, so its complexity is zero. Good: a class with nothing to choose should register as maximally simple.</p>

    <p><b>A tiny two-function class.</b> Let $F=\{f_1,f_2\}$ on three points, with outputs $f_1=[1,1,1]$ and $f_2=[1,-1,1]$. For each of the $2^3=8$ sign vectors we take the better of the two correlations, then average. For instance at $\sigma=[1,-1,1]$, function $f_2$ scores $\tfrac13(1{+}1{+}1)=1.000$. Averaging the per-$\sigma$ maxima over all eight vectors gives:</p>
    <ol class="work">
      <li>$\hat{\mathfrak{R}}_S(F)=0.3333$</li>
    </ol>
    <p>So this class sits a third of the way up the scale.</p>

    <p><b>Where does that sit?</b> The scale runs from $0$ to $1$:</p>
    <ol class="work">
      <li>a single function: $\hat{\mathfrak{R}}=0$ (cannot fit noise at all)</li>
      <li>a class rich enough to realize <b>every</b> sign pattern: it matches each $\sigma$ exactly, scoring $1$ every time, so $\hat{\mathfrak{R}}=1$ (fits any noise)</li>
      <li>our two-function class: $\hat{\mathfrak{R}}=1/3$, partway between</li>
    </ol>
    <p>Read the number as "fraction of random noise the class can chase." That is why it bounds generalization: complexity feeds the guarantee $R(h)\le R_S(h)+2\,\hat{\mathfrak{R}}_S(F)+\sqrt{\ln(1/\delta)/2m}$, so a class that fits noise well earns a larger, more cautious penalty.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating it as a fixed constant.</b> Unlike VC dimension it is <b>data-dependent</b> — recompute it for each sample; a bound from one dataset need not transfer.</li>
      <li><b>Underestimating the supremum.</b> The sup is over the whole class; for large classes it is hard to compute and easy to lower-bound by accident, producing an over-optimistic (invalid) bound.</li>
      <li><b>Confusing empirical with expected Rademacher.</b> The empirical version is on your sample; the population version averages over draws of the sample too, and only the latter appears in some bounds.</li>
    </ul>`
};

/* ---------------- 1.6 Generalization bounds ---------------- */
window.ALLML_CONTENT["1.6"] = {
  tagline: "A high-probability ceiling on the gap between the training error you measured and the true error you care about.",
  context: String.raw`
    <p>This lesson is where the earlier pieces become a usable inequality.</p>
    <ul>
      <li><b>ERM (1.1)</b> produced a training error; a bound tells you how far the truth might be from it.</li>
      <li><b>PAC (1.3), VC (1.4), Rademacher (1.5)</b> each supply the "complexity" term that goes into the ceiling.</li>
    </ul>
    <p>Where it leads: reading the bound as "empirical risk plus penalty" is precisely the objective that SRM (1.7) and regularization (1.8) minimize.</p>`,
  intuition: String.raw`
    <p>Training error is a measurement you can make; true error is the quantity you actually want; a generalization bound is the bridge, stated as an inequality that holds with high probability: true risk is at most training risk plus a complexity penalty.</p>
    <p>The pain it treats is that training error, on its own, lies — it is biased optimistically because you chose the model to make it small. The bound quantifies exactly how much to distrust it, and the distrust shrinks as data grows, like $1/\sqrt{m}$.</p>
    <p>The design decision that makes the bound trustworthy: it must hold <b>simultaneously for every hypothesis</b> in the class, not just for one you fixed in advance, because ERM's choice depends on the data. Buying that uniform guarantee is what the complexity term pays for.</p>`,
  mathematics: String.raw`
    <p>For a finite class, with probability at least $1-\delta$, every $h\in H$ satisfies:</p>
    <div class="formula-box">$$R(h)\;\le\;R_S(h)+\sqrt{\frac{\ln|H|+\ln(1/\delta)}{2m}}$$</div>

    <p><b>Compute the penalty</b> for $|H|=100$, $\delta=0.05$, $m=100$:</p>
    <ol class="work">
      <li>numerator: $\ln 100+\ln 20=4.605+2.996=7.601$</li>
      <li>divide by $2m=200$: $7.601/200=0.0380$</li>
      <li>square root: $\sqrt{0.0380}=0.1949$</li>
    </ol>
    <p>So at 100 samples the true error could exceed the training error by nearly $0.195$ — a wide, honest admission that 100 points buy little certainty.</p>

    <p><b>Watch the penalty shrink like $1/\sqrt{m}$</b> as data grows, everything else fixed:</p>
    <ol class="work">
      <li>$m=100$: penalty $=0.1949$</li>
      <li>$m=1000$: penalty $=0.0616$</li>
      <li>$m=10{,}000$: penalty $=0.0195$</li>
    </ol>
    <p>Tenfold more data tightens the gap about $3.16\times$ each step — the signature of $1/\sqrt{m}$. Concretely, to <b>halve</b> a gap you need roughly <b>four times</b> the data: at $m=400$ the penalty is $0.0975$, half of the $0.195$ at $m=100$.</p>

    <p><b>Confidence is nearly free.</b> Because $\delta$ enters through a logarithm, demanding much higher confidence costs almost nothing. At $m=500$, $|H|=100$:</p>
    <ol class="work">
      <li>$\delta=0.10$: penalty $=0.0831$</li>
      <li>$\delta=0.05$: penalty $=0.0872$</li>
      <li>$\delta=0.01$: penalty $=0.0960$</li>
    </ol>
    <p>Going from 90% to 99% confidence widened the ceiling by barely more than $0.01$. The expensive resource is data ($\varepsilon$), not certainty ($\delta$).</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Vacuous bounds.</b> For small $m$ or huge $|H|$ the penalty can exceed $1$, making the ceiling "$R\le 1$" — technically true and totally useless.</li>
      <li><b>Mistaking the bound for the truth.</b> It is an upper bound; the real gap is usually much smaller, so a loose bound does not mean your model is bad.</li>
      <li><b>Using the finite-$H$ form for infinite classes.</b> Replace $\ln|H|$ with a VC or Rademacher term, or the bound is undefined.</li>
    </ul>`
};

/* ---------------- 1.7 Structural Risk Minimization ---------------- */
window.ALLML_CONTENT["1.7"] = {
  tagline: "Do not fix the model class in advance: search a ladder of nested classes, minimizing training error plus a complexity penalty.",
  context: String.raw`
    <p>This lesson operationalizes the balance struck in 1.2.</p>
    <ul>
      <li><b>The bias-complexity tradeoff (1.2)</b> said an optimal complexity exists; SRM finds it automatically.</li>
      <li><b>Generalization bounds (1.6)</b> supply the penalty that each rung of the ladder pays.</li>
    </ul>
    <p>Where it leads: replacing the discrete ladder with a continuous knob is regularization (1.8); the penalty idea reappears in model selection criteria like AIC and BIC (3.41).</p>`,
  intuition: String.raw`
    <p>ERM inside a single fixed class cannot adapt its complexity — you had to guess the class beforehand, and 1.2 showed how costly a wrong guess is. Structural Risk Minimization removes the guess.</p>
    <p>Arrange your hypotheses as a nested ladder $H_1\subset H_2\subset H_3\subset\cdots$ of increasing richness. Each rung carries a complexity penalty from the generalization bound, larger for richer rungs. SRM picks the model minimizing <b>training error plus penalty</b>, letting the data decide how high to climb.</p>
    <p>The design decision is to make complexity a first-class term in the objective rather than a hyperparameter you set by hand. Lower rungs have high training error but small penalty; higher rungs have low training error but large penalty; the winner is whoever minimizes the sum, which is a proxy for true risk.</p>`,
  mathematics: String.raw`
    <p>For each class $H_k$ on the ladder, bound the true risk by training error plus that class's penalty, then minimize over rungs:</p>
    <div class="formula-box">$$\hat k=\arg\min_{k}\;\Big[\,R_S(\hat h_k)+\sqrt{\tfrac{\ln|H_k|+\ln(1/\delta)}{2m}}\,\Big]$$</div>

    <p><b>Walk up a four-rung ladder</b> at $m=200$, $\delta=0.05$. Training error falls as the class grows, but the penalty rises — watch the sum:</p>
    <ol class="work">
      <li>rung 1, $|H|=2$: emp $0.30$, penalty $\sqrt{(\ln 2+\ln 20)/400}=0.096$, bound $=0.396$</li>
      <li>rung 2, $|H|=16$: emp $0.15$, penalty $0.120$, bound $=0.270$</li>
      <li>rung 3, $|H|=256$: emp $0.07$, penalty $0.146$, bound $=0.216$</li>
      <li>rung 4, $|H|=65{,}536$: emp $0.05$, penalty $0.188$, bound $=0.238$</li>
    </ol>
    <p>The minimum bound is at <b>rung 3</b> ($0.216$), not rung 4. Rung 4 has the lowest training error ($0.05$) and would win a naive ERM contest, but its larger penalty pushes its bound back up. SRM deliberately stops one rung short of the best training fit — that is overfitting-avoidance made mechanical.</p>

    <p><b>Read the shape of the sum.</b> The empirical term is monotonically decreasing ($0.30\to0.05$) and the penalty monotonically increasing ($0.096\to0.188$); their sum is U-shaped, and SRM lands at the bottom of the U. That U is the bias-complexity tradeoff of 1.2, now drawn in numbers you can minimize.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>A penalty that misjudges complexity.</b> If the penalty understates true richness, SRM still overfits (climbs too high); if it overstates, SRM underfits (stops too low).</li>
      <li><b>An arbitrary ladder.</b> The nesting order encodes your prior about which models are "simpler"; a bad ordering hands SRM the wrong choices.</li>
      <li><b>Reading the winning bound as the true error.</b> The bound is a conservative proxy; the selected model's actual risk is typically lower than its bound.</li>
    </ul>`
};

/* ---------------- 1.8 Regularization theory ---------------- */
window.ALLML_CONTENT["1.8"] = {
  tagline: "Add a penalty on complexity to the training objective: the smooth, continuous cousin of Structural Risk Minimization.",
  context: String.raw`
    <p>This lesson turns the discrete ladder of 1.7 into a continuous dial.</p>
    <ul>
      <li><b>SRM (1.7)</b> chose among nested classes; regularization replaces that discrete choice with a continuous penalty strength $\lambda$.</li>
      <li><b>The bias-complexity tradeoff (1.2)</b> is what $\lambda$ slides you along.</li>
    </ul>
    <p>Where it leads: the concrete estimators are ridge (3.8) and lasso (3.9); the same penalty reappears as weight decay in deep nets (6.13), and the reason regularized fits generalize is made rigorous by algorithmic stability (1.9).</p>`,
  intuition: String.raw`
    <p>SRM's ladder is clunky: you must construct nested classes and jump between them. Regularization smooths this into a single continuous knob. Instead of choosing a class, minimize training error plus $\lambda$ times a complexity measure of the model — typically the squared norm of its weights.</p>
    <p>The pain removed is the discreteness: a continuous $\lambda$ lets you tune complexity as finely as you like and optimize the whole objective with calculus. Small $\lambda$ trusts the data (low bias, high variance); large $\lambda$ trusts simplicity (high bias, low variance).</p>
    <p>The design decision is the Lagrangian view: penalizing $\lambda\|w\|^2$ is equivalent to constraining $\|w\|^2$ to a budget, and $\lambda$ is the exchange rate between fitting the data and staying simple.</p>`,
  mathematics: String.raw`
    <p>Ridge regression adds an $\ell_2$ penalty to least squares, which has the closed form:</p>
    <div class="formula-box">$$\hat w=\arg\min_w \|Xw-y\|^2+\lambda\|w\|^2=(X^\top X+\lambda I)^{-1}X^\top y$$</div>

    <p><b>Turn the knob on tiny data.</b> With $X$ rows $[1,1],[1,2],[1,3]$ (an intercept and one feature) and $y=[1,2,2]$, solve for a few $\lambda$:</p>
    <ol class="work">
      <li>$\lambda=0$ (plain least squares): $\hat w=[0.667,\,0.500]$, $\|\hat w\|^2=0.694$</li>
      <li>$\lambda=1$: $\hat w=[0.375,\,0.583]$, $\|\hat w\|^2=0.481$</li>
      <li>$\lambda=10$: $\hat w=[0.196,\,0.409]$, $\|\hat w\|^2=0.206$</li>
      <li>$\lambda=100$: $\|\hat w\|^2=0.011$</li>
    </ol>
    <p>Follow the last column: the squared norm falls steadily, $0.694\to0.481\to0.206\to0.011$, as $\lambda$ climbs. The penalty is doing exactly what it promises — pulling the weights toward zero, trading a little training fit for a lot of simplicity.</p>

    <p><b>The two ends of the dial are the two failure modes of 1.2.</b> As $\lambda\to 0$ the solution is unconstrained least squares: lowest bias, highest variance — it can overfit. As $\lambda\to\infty$ the weights are crushed toward $\hat w=0$: a constant predictor with maximal bias and near-zero variance. Every useful model lives between these poles, and choosing $\lambda$ (by cross-validation, 3.36) is choosing your spot on the bias-complexity curve. That $\|\hat w\|^2$ collapses to $0.011$ at $\lambda=100$ is the norm being squeezed almost flat — a whisper away from the trivial model.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Penalizing the intercept.</b> Shrinking the bias term toward zero drags predictions toward the origin for no good reason; exclude the intercept from the penalty.</li>
      <li><b>Skipping feature scaling.</b> An $\ell_2$ penalty punishes large-scale features less; standardize first or the penalty is applied unevenly.</li>
      <li><b>Setting $\lambda$ by hand.</b> The right strength depends on data and must be tuned; too large underfits (as the $\lambda=100$ collapse hints), too small overfits.</li>
    </ul>`
};

/* ---------------- 1.9 Algorithmic stability ---------------- */
window.ALLML_CONTENT["1.9"] = {
  tagline: "If removing one training point barely changes the model, the model generalizes: stability implies generalization.",
  context: String.raw`
    <p>This lesson offers a second, independent route to the guarantees of 1.6.</p>
    <ul>
      <li><b>Generalization bounds (1.6)</b> bounded the whole hypothesis class; stability instead bounds the <b>algorithm</b>, which can succeed where class-based bounds are vacuous.</li>
      <li><b>Regularization (1.8)</b> is the classic source of stability — a penalty makes the solution insensitive to any single point.</li>
    </ul>
    <p>Where it leads: stability explains why heavily overparameterized models (huge or infinite VC) still generalize, a puzzle VC and Rademacher cannot resolve, and underlies analyses of SGD (3.19).</p>`,
  intuition: String.raw`
    <p>VC and Rademacher bound generalization by measuring the richness of the whole hypothesis class. But some algorithms generalize beautifully inside classes so rich that class-based bounds say nothing. Stability changes the object of study: instead of the class, analyze the <b>learning map</b> itself.</p>
    <p>The idea is intuitive. If you can delete any single training example and the learned model — and its predictions — barely budge, then the model was not clinging to individual points; it captured something that generalizes. A learner that swings wildly when one point is removed has memorized, and memorization does not transfer.</p>
    <p>The design decision is to bound sensitivity rather than capacity, and the headline theorem is that <b>uniform stability</b> $\beta$ (the most any single example can change the loss) directly bounds the generalization gap.</p>`,
  mathematics: String.raw`
    <p>An algorithm is uniformly $\beta$-stable if replacing one of the $m$ training points changes its loss on any example by at most $\beta$. The generalization gap is then controlled by $\beta$ (roughly, gap $\lesssim \beta$ plus a $1/\sqrt{m}$ term).</p>

    <p><b>Measure sensitivity by leave-one-out.</b> Take the mean estimator on $\{2,4,6,8,10\}$; its fit is the sample mean, $6.0$. Now drop each point in turn and refit:</p>
    <ol class="work">
      <li>drop $2$: mean of $\{4,6,8,10\}=7.0$</li>
      <li>drop $4$: $6.5$; drop $6$: $6.0$; drop $8$: $5.5$; drop $10$: $5.0$</li>
      <li>largest change from the full fit $6.0$ is $|7.0-6.0|=1.0$</li>
    </ol>
    <p>That maximum swing of $1.0$ is the estimator's sensitivity on this sample — a direct, computable stand-in for $\beta$.</p>

    <p><b>Stability improves with data, like $1/m$.</b> The sample mean shifts by at most $\text{(range)}/m$ when one point is swapped, so:</p>
    <ol class="work">
      <li>$m=5$: sensitivity on the order of $1/5=0.20$</li>
      <li>$m=50$: on the order of $1/50=0.02$</li>
    </ol>
    <p>Ten times the data makes the learner ten times more stable, and the generalization gap tightens in step. This is the same $1/\sqrt{m}$-flavored comfort as 1.6, arrived at from a completely different direction — no hypothesis class was counted anywhere.</p>

    <p><b>Regularization buys stability.</b> Regularized ERM is uniformly stable with $\beta$ shrinking as the penalty $\lambda$ grows (schematically $\beta\propto 1/(\lambda m)$). This is the rigorous reason the ridge fits of 1.8 generalize: a larger $\lambda$ both simplifies the model and desensitizes it to any single point.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Assuming every algorithm is stable.</b> 1-nearest-neighbor is not uniformly stable — one point can flip a whole neighborhood — so this route says nothing about it.</li>
      <li><b>A stable but useless learner.</b> A constant predictor is perfectly stable and generalizes trivially, yet learns nothing; stability bounds the gap, not the quality of the fit.</li>
      <li><b>Computing $\beta$ exactly.</b> True uniform stability is a worst-case over all one-point changes and is usually hard to pin down; leave-one-out gives an empirical feel, not the constant itself.</li>
    </ul>`
};

/* ---------------- 1.10 The No Free Lunch theorem ---------------- */
window.ALLML_CONTENT["1.10"] = {
  tagline: "Averaged over all possible problems, every learning algorithm is exactly as good as random guessing: no universal learner exists.",
  context: String.raw`
    <p>This lesson draws the outer boundary of what learning can promise.</p>
    <ul>
      <li><b>The bias-complexity tradeoff (1.2)</b> hinted that a class must be chosen; No Free Lunch proves choice is unavoidable.</li>
      <li><b>Uniform priors</b> over target functions are the one assumption that drives the result.</li>
    </ul>
    <p>Where it leads: it justifies why inductive bias (the assumptions baked into a model class) is not optional but essential — every later method earns its keep by encoding good assumptions.</p>`,
  intuition: String.raw`
    <p>It is tempting to hunt for the single best learning algorithm. The No Free Lunch theorem says the hunt is doomed: if every possible target function is equally likely, then averaged across all of them, no algorithm outperforms any other — including one that guesses at random.</p>
    <p>The pain it inflicts is a healthy one. It removes the fantasy of a universal learner and replaces it with a precise obligation: superiority on some problems is always paid back, exactly, by inferiority on others. There is no method that is good everywhere.</p>
    <p>The design decision it forces is the most important idea in applied machine learning: you must assume something about your problem. The "free lunch" of good generalization is bought with <b>inductive bias</b> — smoothness, sparsity, locality, whatever fits your domain. Learning works in practice because real problems are <b>not</b> uniformly random; they have structure, and good models encode it.</p>`,
  mathematics: String.raw`
    <p>Consider prediction on points the learner has never seen, with every labeling of those points equally likely. Averaged over all target functions, off-training-set accuracy is exactly chance.</p>

    <p><b>Enumerate a tiny universe.</b> Three unseen points, so $2^3=8$ equally-likely target labelings. Fix any learner — say it always predicts $[0,0,0]$ — and average its off-training error across all eight targets:</p>
    <ol class="work">
      <li>against $[0,0,0]$: $0/3$ wrong; against $[1,1,1]$: $3/3$ wrong; and the six in between average out</li>
      <li>mean off-training error over all $8$ targets $=0.500$</li>
    </ol>
    <p>Exactly one half — pure chance. The learner's confident guesses help on the targets that happen to match and hurt equally on their mirror images.</p>

    <p><b>A cleverer learner ties too.</b> Swap in a different rule, say $[1,0,1]$, and repeat the average:</p>
    <ol class="work">
      <li>mean off-training error over all $8$ targets $=0.500$</li>
    </ol>
    <p>Identical. This is the theorem in miniature: any advantage the second learner gains on some labelings is refunded, to the last decimal, on others. Over the uniform ensemble of problems the two are indistinguishable, and neither beats a coin.</p>

    <p><b>What this does and does not say.</b> It does not say learning is hopeless. It says learning is impossible <b>without assumptions</b>. Real datasets are a vanishingly small, highly structured slice of the $2^{(\text{all inputs})}$ possible target functions; a model that assumes the right structure escapes the average and does genuinely better. The theorem is a mandate to choose your assumptions well, not a counsel of despair.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Quoting it to claim "all models are equal" on a real task.</b> The equality holds only under a uniform prior over <b>all</b> problems; on a specific structured dataset, models are emphatically not equal.</li>
      <li><b>Concluding assumptions are a weakness.</b> Inductive bias is the very thing that lets a model beat chance; the goal is good assumptions, not none.</li>
      <li><b>Forgetting it is about off-training error.</b> The result concerns unseen points under a uniform target prior, not fit to the training set.</li>
    </ul>`
};

/* ---------------- 1.11 Uniform convergence ---------------- */
window.ALLML_CONTENT["1.11"] = {
  tagline: "The engine under every bound: training error converges to true error simultaneously for all hypotheses in the class.",
  context: String.raw`
    <p>This lesson exposes the machinery that has been running quietly beneath the whole of Part 1.</p>
    <ul>
      <li><b>ERM (1.1)</b> works only because training error tracks true error; uniform convergence is the theorem that guarantees it.</li>
      <li><b>Hoeffding's inequality</b> (a concentration bound, 0.32) handles one hypothesis; the <b>union bound</b> extends it to all of them.</li>
    </ul>
    <p>Where it leads: it is the proof engine behind PAC (1.3), VC (1.4), and the generalization bounds of 1.6 — every one of those is a uniform-convergence statement in disguise.</p>`,
  intuition: String.raw`
    <p>For a <b>single fixed</b> hypothesis, the story is easy: training error is an average of independent bounded terms, so by Hoeffding it concentrates tightly around the true error. If we had committed to one model before seeing data, we would be done.</p>
    <p>But ERM does not commit in advance — it <b>chooses</b> the model that looks best on the sample, so the chosen hypothesis depends on the very data we are using to judge it. A guarantee for one fixed model is not enough; we need training error to be close to true error <b>for every hypothesis at once</b>, so that whichever one ERM lands on is covered. That simultaneous closeness is uniform convergence.</p>
    <p>The design decision is how to pay for "all at once": bound the probability that <b>any</b> hypothesis fails by summing the per-hypothesis failure probabilities — the union bound — which introduces a factor of $|H|$ (or, for infinite classes, the polynomial growth function from 1.4).</p>`,
  mathematics: String.raw`
    <p>For one hypothesis with loss in $[0,1]$, Hoeffding bounds the chance its empirical and true risks differ by more than $\varepsilon$:</p>
    <div class="formula-box">$$\Pr\big(|R_S(h)-R(h)|>\varepsilon\big)\le 2e^{-2m\varepsilon^2}$$</div>
    <p>The union bound over a finite class multiplies by $|H|$:</p>
    <div class="formula-box">$$\Pr\Big(\sup_{h\in H}|R_S(h)-R(h)|>\varepsilon\Big)\le |H|\,\cdot 2e^{-2m\varepsilon^2}$$</div>

    <p><b>One hypothesis first.</b> At $m=500$, $\varepsilon=0.1$:</p>
    <ol class="work">
      <li>exponent: $-2m\varepsilon^2=-2(500)(0.01)=-10$</li>
      <li>$2e^{-10}=0.00009$ — a single model's error is essentially pinned to its true value</li>
    </ol>
    <p><b>Now all of them.</b> With $|H|=100$, pay the union-bound factor:</p>
    <ol class="work">
      <li>$100\times 0.00009=0.0091$</li>
    </ol>
    <p>Still under 1% — so at $m=500$, training error is within $0.1$ of true error for every one of the hundred hypotheses simultaneously, and ERM's choice is safe.</p>

    <p><b>The bound is vacuous until you have enough data.</b> Hold $|H|=100$, $\varepsilon=0.1$ and lower $m$:</p>
    <ol class="work">
      <li>$m=100,\,150,\,230$: the right side is $\ge 1$ — a true but empty statement</li>
      <li>$m=300$: it finally drops to $0.496$</li>
    </ol>
    <p>Below a threshold the union bound promises nothing; the class is too rich for the data. Solving for the $m$ that reaches a target $\delta=0.05$ gives $m\ge(\ln 100+\ln(2/0.05))/(2\cdot0.1^2)=414.7$, so $415$ samples — the sample size that makes the whole class trustworthy at once.</p>

    <p><b>Why this is the engine.</b> Rearranging the union-bound inequality to solve for $\varepsilon$ at confidence $1-\delta$ reproduces the $\sqrt{(\ln|H|+\ln(1/\delta))/2m}$ penalty of 1.6 exactly. Every generalization bound in Part 1 is this one theorem, read from a different angle; for infinite classes you swap $|H|$ for the growth function and $\ln|H|$ becomes the VC term.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>The union bound is loose for large classes.</b> Summing $|H|$ failure probabilities double-counts overlapping events; for big or infinite $H$ use the growth function or VC dimension instead, or the bound goes vacuous (as the small-$m$ rows show).</li>
      <li><b>Forgetting the bounded-loss requirement.</b> Hoeffding needs the loss confined to an interval (here $[0,1]$); unbounded losses need different concentration tools.</li>
      <li><b>Dropping the i.i.d. assumption.</b> The whole argument assumes independent samples from a fixed distribution; correlated or shifting data breaks the concentration step.</li>
    </ul>`
};
