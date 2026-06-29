/* =====================================================================
   METRICS & EVALUATION — BEGINNER lesson.
   "Statistical tests — is this difference real?" p-values, null
   hypotheses, and the whole family of hypothesis tests, explained gently.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-hypothesis-tests",
    title: "Statistical tests — is this difference real?",
    tagline: "A p-value tells you how surprised to be if nothing was really going on. Small p, real effect (probably).",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["prob-clt", "prob-estimation", "prob-normal", "met-foundations"],

    whenToUse:
      `<p><b>Reach for a hypothesis test whenever you must decide if a difference is real or just luck.</b> Model B beat model A by 0.4% accuracy — is that a true improvement or noise from the particular test set? Two groups of users click at different rates — is the gap signal or chance? A test gives you a principled answer instead of a gut feeling.</p>
       <p><b>Pick the test from the kind of data and the question:</b></p>
       <ul>
         <li><b>Compare the average of two groups, numbers, roughly bell-shaped:</b> a <b>t-test</b> (use <b>Welch's t-test</b> if the two groups have different spreads — the safe default). Same items measured twice (before/after)? A <b>paired t-test</b>.</li>
         <li><b>Compare three or more group averages at once:</b> <b>ANOVA (Analysis of Variance)</b> via the <b>F-test</b>.</li>
         <li><b>Numbers but not bell-shaped, or small samples, or ranks:</b> the <i>nonparametric</i> cousins — <b>Mann–Whitney U</b> (two groups), <b>Wilcoxon signed-rank</b> (paired), <b>Kruskal–Wallis</b> (3+ groups), <b>Friedman</b> (3+ paired).</li>
         <li><b>Counts in categories:</b> <b>chi-square test of independence</b> (are two category variables related?), <b>chi-square goodness-of-fit</b> (do counts match an expected shape?), <b>Fisher's exact test</b> (tiny counts), the <b>G-test</b> (a likelihood-based stand-in for chi-square).</li>
         <li><b>Compare two classifiers on the very same examples:</b> <b>McNemar's test</b> — built exactly for this.</li>
         <li><b>Check an assumption</b> before another test: normality (<b>Shapiro–Wilk</b>, <b>Kolmogorov–Smirnov</b>, <b>Anderson–Darling</b>, <b>Jarque–Bera</b>), equal spread (<b>Levene</b>, <b>Bartlett</b>).</li>
         <li><b>Time-series checks:</b> leftover pattern in residuals (<b>Durbin–Watson</b>, <b>Ljung–Box</b>), changing noise size (<b>Breusch–Pagan</b>, <b>White</b>), a wandering mean (<b>ADF (Augmented Dickey–Fuller)</b>, <b>KPSS (Kwiatkowski–Phillips–Schmidt–Shin)</b>).</li>
         <li><b>When you trust no formula's assumptions:</b> a <b>permutation test</b> or a <b>bootstrap confidence interval</b> — let the data build its own "what if nothing was going on" picture.</li>
       </ul>
       <p><b>Avoid a test when</b> the "difference" is too small to matter in the real world — with a huge sample, even a meaningless gap will come out "statistically significant." Significance is not importance.</p>`,

    application:
      `<p>Hypothesis tests are the referee of every A/B test, every "did the new model actually help?" debate, and every dataset sanity check. A growth team runs a t-test (or its proportion cousin) to call a button-color experiment. An ML engineer runs <b>McNemar's test</b> to claim model B truly beats model A on the same held-out set, not just by lucky sampling. A data scientist runs <b>Shapiro–Wilk</b> and <b>Levene</b> before trusting a t-test, an <b>ADF test</b> before forecasting a time series, and a <b>Ljung–Box test</b> on a model's residuals to check nothing predictable was left on the table. Behind almost every metric comparison you report, a test is deciding whether the gap is worth believing.</p>`,

    pitfalls:
      `<ul>
         <li><b>p-hacking and multiple comparisons.</b> Tell: you ran twenty tests and proudly report the one with p &lt; 0.05. If nothing is real, 1 in 20 tests still "passes" by chance — so testing many things guarantees false winners. Fix: correct for the number of tests with <b>Bonferroni</b> (multiply each p-value by the number of tests, or equivalently shrink the cutoff to 0.05/number) or, gentler, control the <b>FDR (False Discovery Rate)</b> with Benjamini–Hochberg.</li>
         <li><b>Statistical significance ≠ practical significance.</b> Tell: p = 0.001 but the effect is a 0.05% lift no one will notice. A tiny p only says the effect is probably nonzero, not that it is big. Fix: always report an <b>effect size</b> and a <b>confidence interval</b> alongside the p-value, and ask "is this gap big enough to act on?"</li>
         <li><b>Huge samples make trivial effects "significant."</b> Tell: with ten million rows, every difference is p &lt; 0.05. Fix: with big data, judge by effect size and interval width, not the p-value.</li>
         <li><b>Assuming normality without checking.</b> Tell: you ran a t-test on heavily skewed or heavy-tailed data. Fix: check with <b>Shapiro–Wilk</b> / a histogram; if it fails, use a nonparametric test (<b>Mann–Whitney U</b>, <b>Wilcoxon</b>) or a <b>permutation test</b>.</li>
         <li><b>Using an unpaired test on paired data.</b> Tell: you compared two models with an ordinary two-sample t-test even though both ran on the same examples. That throws away the pairing and weakens the test. Fix: use the <b>paired</b> t-test, <b>Wilcoxon signed-rank</b>, or <b>McNemar's test</b> — they compare item by item.</li>
       </ul>`,

    bigIdea:
      `<p>A <b>hypothesis test</b> answers one question: <i>could this result have happened just by chance?</i></p>
       <p>You start by playing devil's advocate. You assume the boring explanation is true — that there is <b>no</b> real effect. This boring assumption is called the <b>null hypothesis</b>, written $H_0$ (read "H-naught"). For a t-test it means "the two groups have the same true average."</p>
       <p>Then you ask: <i>if the null were true, how often would I see a result at least this extreme, just from random luck?</i> That probability is the <b>p-value</b>.</p>
       <ul>
         <li>A <b>small</b> p-value (say p &lt; 0.05) means "this would be a weird fluke if nothing were going on" — so you doubt the boring story and call the effect <b>real</b> (statistically significant).</li>
         <li>A <b>large</b> p-value means "eh, this happens by chance often enough" — so you do <b>not</b> have evidence of an effect. (Note: that is "no evidence," not "proof of no effect.")</li>
       </ul>
       <p>The cutoff you compare against — usually 0.05 — is the <b>significance level</b>, written $\\alpha$ (alpha). It is the false-alarm rate you are willing to accept: with $\\alpha = 0.05$, even when nothing is real you will wrongly cry "effect!" 5% of the time.</p>
       <p>Every test in this lesson is the same recipe with a different ruler. You compute a <b>test statistic</b> — one number summarizing "how far is my data from the boring null?" — then look up how unlikely that number is under $H_0$ to get the p-value. The tests differ only in <i>which</i> statistic fits <i>which</i> data.</p>`,

    buildup:
      `<p><b>Two ways to be wrong.</b> A test makes a yes/no call, so there are two mistakes:</p>
       <ul>
         <li><b>Type I error</b> — a <b>false alarm</b>: you declare an effect when there is none. Its rate is exactly $\\alpha$, the significance level you chose.</li>
         <li><b>Type II error</b> — a <b>miss</b>: there really is an effect but your test fails to detect it. Its rate is written $\\beta$ (beta). <b>Power</b> $= 1 - \\beta$ is the chance of catching a real effect; more data and bigger effects mean more power.</li>
       </ul>
       <p>This is the exact same false-alarm-versus-miss trade as a classifier's FP and FN — here the "positive" call is "there is an effect."</p>
       <p><b>The whole family — what each test is, and when to use it.</b></p>
       <p><i>Comparing averages (parametric — assumes roughly bell-shaped data):</i></p>
       <ul>
         <li><b>One-sample t-test</b> — is one group's average different from a fixed number? Use when you have one sample and a target value.</li>
         <li><b>Two-sample t-test</b> — do two independent groups have different averages? Use for two separate groups, similar spreads.</li>
         <li><b>Welch's t-test</b> — the two-sample t-test that does <i>not</i> assume equal spread. Use this as the safe default for two groups.</li>
         <li><b>Paired t-test</b> — do the averages differ when the <i>same</i> items are measured twice? Use for before/after, or two methods on the same items.</li>
         <li><b>ANOVA / F-test</b> — do three or more group averages differ? The <b>F-statistic</b> is (spread between groups) ÷ (spread within groups). Use for 3+ groups at once instead of many t-tests.</li>
       </ul>
       <p><i>Nonparametric (no bell-curve assumption — work on ranks; use for skewed data, small samples, or outliers):</i></p>
       <ul>
         <li><b>Mann–Whitney U</b> — the rank-based stand-in for the two-sample t-test (two independent groups).</li>
         <li><b>Wilcoxon signed-rank</b> — the rank-based stand-in for the paired t-test (same items, two conditions).</li>
         <li><b>Kruskal–Wallis</b> — the rank-based stand-in for ANOVA (3+ independent groups).</li>
         <li><b>Friedman</b> — the rank-based stand-in for repeated-measures ANOVA (3+ conditions on the same items — e.g. several models across the same datasets).</li>
       </ul>
       <p><i>Counts and categories:</i></p>
       <ul>
         <li><b>Chi-square test of independence</b> — are two category variables related (e.g. country × did-they-buy)? Use on a contingency table of counts.</li>
         <li><b>Chi-square goodness-of-fit</b> — do observed counts match an expected distribution (e.g. is a die fair)?</li>
         <li><b>Fisher's exact test</b> — the exact version for <b>small</b> counts, where chi-square's approximation is shaky (any expected cell below ~5).</li>
         <li><b>G-test</b> — a likelihood-ratio version of chi-square; same use, often preferred for sparse tables.</li>
         <li><b>McNemar's test</b> — for a <b>paired</b> 2×2 table: compares two classifiers on the <i>same</i> examples by looking only at the cases where they disagree. The standard test for "is model B really better than model A?"</li>
       </ul>
       <p><i>Assumption checks — run these before a parametric test:</i></p>
       <ul>
         <li><b>Normality (is it bell-shaped?):</b> <b>Shapiro–Wilk</b> (best for small/medium samples), <b>Kolmogorov–Smirnov</b> (compares your data's shape to a reference curve), <b>Anderson–Darling</b> (like K–S but more sensitive in the tails), <b>Jarque–Bera</b> (checks skew and tail-heaviness, common in econometrics). For all four, $H_0$ is "the data <i>is</i> normal," so a <b>small</b> p means "<b>not</b> normal."</li>
         <li><b>Equal spread (homogeneity of variance):</b> <b>Levene</b> (robust, the safe default) and <b>Bartlett</b> (more powerful but assumes normality). Use before a plain two-sample t-test or ANOVA.</li>
       </ul>
       <p><i>Time-series / regression diagnostics:</i></p>
       <ul>
         <li><b>Autocorrelation (do residuals repeat a pattern over time?):</b> <b>Durbin–Watson</b> (one-step correlation; ≈2 is clean) and <b>Ljung–Box</b> (checks many lags at once — the go-to for model residuals).</li>
         <li><b>Heteroscedasticity (does the noise size change across the data?):</b> <b>Breusch–Pagan</b> and <b>White</b> (White also catches nonlinear patterns).</li>
         <li><b>Stationarity (is the series' mean/variance steady, not drifting?):</b> <b>ADF (Augmented Dickey–Fuller)</b> — here $H_0$ is "non-stationary," so small p = stationary (good) — and <b>KPSS</b> — here $H_0$ is "stationary," so small p = non-stationary. Run both; they cross-check.</li>
       </ul>
       <p><i>Distribution-free workhorses (build the null from the data itself):</i></p>
       <ul>
         <li><b>Permutation test</b> — shuffle the group labels thousands of times to see how big a gap chance alone produces, then place your real gap in that picture. Works for almost any statistic with almost no assumptions.</li>
         <li><b>Bootstrap confidence interval</b> — resample your data (with replacement) many times, recompute the statistic each time, and read off the middle 95% as the interval. Gives an interval when no clean formula exists.</li>
       </ul>
       <p><i>The general engines behind many tests:</i></p>
       <ul>
         <li><b>Likelihood-ratio test</b> — compare how well a small model and a bigger model explain the data; the ratio of their likelihoods becomes a chi-square statistic. The G-test and many model comparisons are special cases.</li>
         <li><b>Wald test</b> — is an estimated parameter far from zero, measured in standard errors? (The "is this regression coefficient significant?" test.)</li>
         <li><b>Score (Lagrange-multiplier) test</b> — checks the slope of the likelihood at the null, so it needs to fit only the smaller model. These three (likelihood-ratio, Wald, score) usually agree and are the foundation under most named tests.</li>
       </ul>`,

    symbols: [
      { sym: "$H_0$", desc: "the null hypothesis — the boring claim of 'no effect / no difference' that you try to disprove." },
      { sym: "$H_1$", desc: "the alternative hypothesis — 'there IS an effect.' What you suspect is true." },
      { sym: "$p$", desc: "the p-value — the chance of a result at least this extreme IF the null were true. Small p ⇒ doubt the null." },
      { sym: "$\\alpha$", desc: "the significance level (e.g. 0.05) — the p-value cutoff, and your accepted false-alarm rate." },
      { sym: "$\\beta$", desc: "the Type II error (miss) rate; power $= 1-\\beta$ is the chance of catching a real effect." },
      { sym: "$t$", desc: "the t-statistic: how many standard errors the observed difference sits away from zero." },
      { sym: "$\\bar{x}$", desc: "the sample mean (average) of a group of measurements." },
      { sym: "$s$", desc: "the sample standard deviation — the typical spread of the measurements around their mean." },
      { sym: "$n$", desc: "the sample size — how many data points are in a group." }
    ],

    formula: `$$ t = \\frac{\\bar{x}_A - \\bar{x}_B}{\\sqrt{\\dfrac{s_A^2}{n_A} + \\dfrac{s_B^2}{n_B}}}, \\qquad p = \\Pr\\big(\\,|T| \\ge |t| \\,\\big|\\, H_0\\,\\big) $$`,

    whatItDoes:
      `<p>The left formula is <b>Welch's two-sample t-statistic</b>, the everyday "are these two averages different?" test. The top, $\\bar{x}_A - \\bar{x}_B$, is the <b>observed gap</b> between the two group averages. The bottom is the <b>standard error</b> of that gap — how much the gap would wobble just from random sampling, built from each group's spread $s$ and size $n$. So $t$ is simply <i>gap ÷ noise</i>: how many "noise units" the real gap stands above zero. A big $|t|$ means the gap is large compared to the random wobble.</p>
       <p>The right formula turns that statistic into the <b>p-value</b>: under the null (no real difference), the statistic $T$ follows a known curve (here a t-distribution); the p-value is the probability of landing at least as far out as your observed $|t|$. Far out ⇒ tiny p ⇒ "this would be a fluke if nothing were going on" ⇒ call the effect real.</p>
       <p>Every other test swaps in a different statistic (F for ANOVA, chi-square for category counts, U for Mann–Whitney) and a different reference curve, but the final step is always the same: <b>how unlikely is this number under the null?</b></p>`,

    derivation:
      `<p><b>Why "gap over noise" is the right ruler.</b></p>
       <ul class="steps">
         <li>You measure a gap between two group averages. But two groups <i>always</i> differ a little, even when drawn from the identical population — pure sampling luck. So a raw gap means nothing until you compare it to how big a gap chance alone tends to produce.</li>
         <li>The <b>Central Limit Theorem</b> (see the prerequisite) tells you each sample average $\\bar{x}$ wobbles around the true mean with a spread of $s/\\sqrt{n}$ — the standard error. Bigger samples wobble less.</li>
         <li>The gap $\\bar{x}_A - \\bar{x}_B$ therefore has standard error $\\sqrt{s_A^2/n_A + s_B^2/n_B}$ (variances add). Dividing the gap by this standard error gives $t$: the gap measured in units of its own random wobble.</li>
         <li>Under $H_0$ (no true difference), this $t$ follows a known t-distribution centered at 0. Most of its mass sits near 0; large $|t|$ values are rare. The <b>p-value</b> is the fraction of that curve beyond your observed $|t|$ — exactly "how often would chance fake a gap this big?"</li>
         <li>You decide: if $p \\lt  \\alpha$, the gap is too big to blame on chance, so reject $H_0$ and call the effect real. Otherwise, you keep $H_0$ — not because it is proven, but because you lack evidence against it.</li>
       </ul>
       <p><b>Why the nonparametric tests exist.</b> The t-test's reference curve is only exact when the data is roughly normal. When it is not, you replace the values by their <b>ranks</b> (Mann–Whitney, Wilcoxon, Kruskal–Wallis) or <b>shuffle the labels</b> to build the null curve directly (permutation test). The decision rule — compare a statistic to its under-the-null distribution — never changes. $\\blacksquare$</p>`,

    example:
      `<p>Two model variants are each evaluated; their accuracy on five random test splits is:</p>
       <table class="extable">
         <caption>Accuracy of each model on the same five test splits</caption>
         <thead><tr><th>split</th><th class="num">1</th><th class="num">2</th><th class="num">3</th><th class="num">4</th><th class="num">5</th><th class="num">mean $\\bar{x}$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">Model A</td><td class="num">0.90</td><td class="num">0.91</td><td class="num">0.89</td><td class="num">0.92</td><td class="num">0.88</td><td class="num">0.900</td></tr>
           <tr><td class="row-h">Model B</td><td class="num">0.93</td><td class="num">0.94</td><td class="num">0.92</td><td class="num">0.95</td><td class="num">0.91</td><td class="num">0.930</td></tr>
         </tbody>
       </table>
       <p>Now run the Welch t-statistic step by step:</p>
       <ul class="steps">
         <li>Means: $\\bar{x}_A=(0.90+0.91+0.89+0.92+0.88)/5=4.50/5=0.900$ and $\\bar{x}_B=4.65/5=0.930$.</li>
         <li>Observed gap: $\\bar{x}_B-\\bar{x}_A=0.930-0.900=0.030$ (B looks 3 points better).</li>
         <li>Each group's variance is $s^2=0.001/4=0.00025$ (A's deviations $0,0.01,-0.01,0.02,-0.02$ square to $0.001$; B is identical), so $s\\approx0.0158$ and $n=5$ each.</li>
         <li>Standard error $=\\sqrt{\\dfrac{0.00025}{5}+\\dfrac{0.00025}{5}}=\\sqrt{0.00005+0.00005}=\\sqrt{0.0001}=0.0100$.</li>
         <li>So $t=\\dfrac{0.030}{0.0100}=\\mathbf{3.0}$. The gap is about 3 standard errors above zero.</li>
         <li>For these small samples a $|t|\\approx3.0$ (with $\\approx 8$ degrees of freedom) gives a p-value around $0.017$ — below $\\alpha=0.05$. <b>Verdict:</b> the gap is bigger than sampling noise comfortably explains, so we call B's improvement real.</li>
         <li><b>But notice the catch:</b> these five splits reuse the same test data, so the runs are really <i>paired</i>. A paired t-test (or, for per-example correct/wrong labels, <b>McNemar's test</b>) would use the pairing and is the more honest choice here.</li>
       </ul>`,

    demo: function (host) {
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), bad: g("--bad", "#ff7b72"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // A permutation test demo: two small groups, observed mean gap, vs the
      // null distribution of gaps from shuffling labels. The user sets the gap.
      var trueGap = 0.6;             // separation between the two group centers
      var nPerm = 600;
      function randn() { var u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 200; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
      var btn = document.createElement("button"); btn.textContent = "↻ new sample / reshuffle"; btn.style.marginTop = "6px"; host.appendChild(btn);

      function build() {
        var nA = 12, nB = 12, A = [], B = [], i;
        for (i = 0; i < nA; i++) A.push(randn());
        for (i = 0; i < nB; i++) B.push(randn() + trueGap);
        var pooled = A.concat(B);
        function mean(a) { var t = 0, k; for (k = 0; k < a.length; k++) t += a[k]; return t / a.length; }
        var obs = mean(B) - mean(A);
        var gaps = [], j, k, idx, tmp;
        for (j = 0; j < nPerm; j++) {
          // shuffle a copy
          var arr = pooled.slice();
          for (k = arr.length - 1; k > 0; k--) { idx = Math.floor(Math.random() * (k + 1)); tmp = arr[k]; arr[k] = arr[idx]; arr[idx] = tmp; }
          var a2 = arr.slice(0, nA), b2 = arr.slice(nA);
          gaps.push(mean(b2) - mean(a2));
        }
        var extreme = 0; for (j = 0; j < gaps.length; j++) if (Math.abs(gaps[j]) >= Math.abs(obs)) extreme++;
        var p = (extreme + 1) / (gaps.length + 1);
        return { gaps: gaps, obs: obs, p: p };
      }
      var state = build();

      function draw() {
        var col = C(); ctx.clearRect(0, 0, 640, 200);
        var W = 640, H = 200, padL = 12, padR = 12, y0 = 14, y1 = H - 30;
        var g = state.gaps, i, lo = -1.4, hi = 1.4;
        function PX(x) { return padL + (x - lo) / (hi - lo) * (W - padL - padR); }
        // histogram of the null gaps
        var bins = 41, counts = new Array(bins).fill(0), bw = (hi - lo) / bins, mx = 0, b;
        for (i = 0; i < g.length; i++) { b = Math.floor((g[i] - lo) / bw); if (b >= 0 && b < bins) counts[b]++; }
        for (i = 0; i < bins; i++) if (counts[i] > mx) mx = counts[i];
        ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(PX(lo), y1); ctx.lineTo(PX(hi), y1); ctx.stroke();
        for (i = 0; i < bins; i++) {
          if (counts[i] === 0) continue;
          var x = lo + (i + 0.5) * bw, h = counts[i] / mx * (y1 - y0);
          var far = Math.abs(x) >= Math.abs(state.obs);
          ctx.fillStyle = (far ? col.bad : col.accent) + "cc";
          ctx.fillRect(PX(lo + i * bw) + 1, y1 - h, (W - padL - padR) / bins - 1.5, h);
        }
        var ox = PX(state.obs);
        ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ox, y0); ctx.lineTo(ox, y1); ctx.stroke();
        ctx.fillStyle = col.warn; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("observed gap = " + state.obs.toFixed(2), ox, y1 + 16);
        ctx.fillStyle = col.dim; ctx.textAlign = "left"; ctx.fillText("gaps chance produces when labels are shuffled (null)", PX(lo) + 4, y0 + 4);
      }
      function render() {
        draw();
        readout.innerHTML = "The blue bars are the gaps random label-shuffles produce when there is <i>no</i> real difference — the null. The orange line is the gap we actually saw. The red bars are shuffles at least as extreme as ours. p-value = (red + 1) / (total + 1) = <b>" + state.p.toFixed(3) + "</b>. " + (state.p < 0.05 ? "Our gap sits out in the tail — chance rarely fakes one this big, so we call it <b>real</b>." : "Our gap is buried in the middle — chance fakes gaps like this often, so we have <b>no</b> evidence of a real effect.");
      }
      btn.addEventListener("click", function () { state = build(); render(); });
      render();
    },

    practice: [
      {
        q: `You compare model A and model B on the same 2,000-image test set. You want to claim B is genuinely better, not lucky. Which test should you use, and why not a plain two-sample t-test?`,
        steps: [
          { do: `Notice the data is paired.`, why: `Both models are scored on the exact same images, so each image gives a matched pair of correct/wrong outcomes — the runs are not independent.` },
          { do: `Rule out the unpaired t-test.`, why: `A two-sample t-test treats the two runs as separate groups and ignores the pairing, throwing away information and weakening the test.` },
          { do: `Pick the paired test for classifiers.`, why: `McNemar's test looks only at the images where the two models disagree (one right, one wrong) and tests whether those disagreements favor B.` }
        ],
        answer: `<p>Use <b>McNemar's test</b>. Because both models are scored on the <i>same</i> examples, the data is <b>paired</b>: each image is a matched outcome for A and B. McNemar's focuses on the discordant pairs — the cases where exactly one model is right — and asks whether they lean toward B more than chance allows. A plain two-sample t-test would treat the runs as independent groups, discard the pairing, and give a weaker, less honest answer.</p>`
      },
      {
        q: `A teammate runs t-tests on 40 features to see which differ between two customer groups, and reports the 3 features with p &lt; 0.05 as "significant findings." What is wrong, and how do you fix it?`,
        steps: [
          { do: `Count the expected false alarms.`, why: `With α = 0.05 and 40 tests, even if NO feature truly differs you expect about 40 × 0.05 = 2 features to cross p &lt; 0.05 purely by chance.` },
          { do: `Name the problem.`, why: `This is the multiple-comparisons problem (a form of p-hacking when you cherry-pick the winners): testing many things inflates the chance of a false positive somewhere.` },
          { do: `Apply a correction.`, why: `Bonferroni shrinks the cutoff to 0.05/40 = 0.00125 (very strict); Benjamini–Hochberg controls the false discovery rate (FDR) for a gentler, more powerful correction.` }
        ],
        answer: `<p>The flaw is <b>multiple comparisons</b>: across 40 independent tests at α = 0.05 you expect roughly 2 features to look "significant" by pure chance, so 3 hits is barely above noise. Fix it with a <b>multiple-comparison correction</b> — <b>Bonferroni</b> (compare each p to 0.05/40 ≈ 0.00125) for a strict guarantee, or <b>Benjamini–Hochberg FDR</b> for a less conservative control of the false-discovery rate. Report only the features that survive the correction.</p>`
      },
      {
        q: `You have two groups of reaction times that are strongly right-skewed (a few very slow responses). You also have a giant sample (n = 500,000 per group) and a t-test returns p = 0.0003. Name two separate concerns.`,
        steps: [
          { do: `Check the t-test's assumption.`, why: `The t-test assumes roughly normal data; strong skew with heavy tails can make its p-value untrustworthy, especially the way outliers pull the mean.` },
          { do: `Pick a robust alternative.`, why: `A nonparametric test (Mann–Whitney U) or a permutation test makes no normality assumption and is safer on skewed data.` },
          { do: `Question the giant sample.`, why: `With n = 500,000, even a difference far too small to matter will be "statistically significant" — a tiny p says nothing about whether the effect is large.` }
        ],
        answer: `<p>Two concerns. <b>(1) Assumption:</b> the data is strongly skewed, so the t-test's normality assumption is shaky — switch to a <b>Mann–Whitney U</b> or a <b>permutation test</b>, which need no bell-curve assumption. <b>(2) Practical significance:</b> with half a million points per group, even a meaningless difference comes out p &lt; 0.05, so the tiny p is not evidence the effect <i>matters</i>. Report the <b>effect size and a confidence interval</b> and ask whether the gap is big enough to act on.</p>`
      }
    ]
  });

  window.CODE["met-hypothesis-tests"] = {
    lib: "scipy / statsmodels",
    runnable: false,
    explain: `<p>The practitioner's toolbox: <code>scipy.stats</code> for the classic tests (t-test, Mann–Whitney U, Wilcoxon, ANOVA's <code>f_oneway</code>, Kruskal–Wallis, chi-square, Shapiro–Wilk, Levene) and <code>statsmodels</code> for the model-comparison and time-series diagnostics (McNemar, Ljung–Box, Breusch–Pagan, the ADF stationarity test). The pattern is always: pick the function that matches your data, read the returned <code>statistic</code> and <code>pvalue</code>, then compare the p-value to your significance level α.</p>`,
    code: `import numpy as np
from scipy import stats
from statsmodels.stats.contingency_tables import mcnemar
from statsmodels.stats.diagnostic import acorr_ljungbox, het_breuschpagan
from statsmodels.tsa.stattools import adfuller

rng = np.random.default_rng(0)
A = rng.normal(0.0, 1.0, size=40)        # group A
B = rng.normal(0.6, 1.2, size=40)        # group B (shifted, wider spread)

# ---- compare two group averages ----------------------------------------
print("Welch t-test :", stats.ttest_ind(A, B, equal_var=False))   # unequal spread -> Welch
print("paired t-test:", stats.ttest_rel(A, B))                    # same items measured twice
print("Mann-Whitney :", stats.mannwhitneyu(A, B))                 # nonparametric (no normality)
print("Wilcoxon     :", stats.wilcoxon(A, B))                     # nonparametric paired

# ---- three or more groups ----------------------------------------------
C = rng.normal(0.3, 1.0, size=40)
print("ANOVA F-test :", stats.f_oneway(A, B, C))                  # parametric, 3+ groups
print("Kruskal-Wall :", stats.kruskal(A, B, C))                   # nonparametric, 3+ groups

# ---- counts in categories ----------------------------------------------
table = np.array([[30, 10], [18, 22]])                            # 2x2 contingency table
print("chi-square   :", stats.chi2_contingency(table)[:2])        # statistic, p-value
print("Fisher exact :", stats.fisher_exact(table))               # exact, for small counts

# ---- assumption checks --------------------------------------------------
print("Shapiro-Wilk :", stats.shapiro(A))                        # H0: data is normal
print("Levene       :", stats.levene(A, B))                      # H0: equal variances

# ---- compare two classifiers on the SAME examples (paired) -------------
# off-diagonal = cases where the two models disagree
disagree = np.array([[0, 13],     # [both wrong, A right & B wrong]
                     [27, 0]])    # [A wrong & B right, both right]
print("McNemar      :", mcnemar(disagree, exact=True))           # H0: models equally good

# ---- regression / time-series diagnostics ------------------------------
resid = rng.normal(0, 1, size=120)
print("Ljung-Box    :\\n", acorr_ljungbox(resid, lags=[10]))      # H0: no autocorrelation
x = np.column_stack([np.ones(120), np.arange(120)])
print("Breusch-Pagan:", het_breuschpagan(resid, x)[:2])          # H0: constant variance
print("ADF (statn.) :", adfuller(np.cumsum(resid))[:2])          # H0: non-stationary (small p = stationary)`
  };

  window.CODEVIZ["met-hypothesis-tests"] = {
    question: "Walk the whole recipe on the lesson's worked example: model A {0.90,0.91,0.89,0.92,0.88} vs model B {0.93,0.94,0.92,0.95,0.91}. We build the test statistic t, read the p-value off the null curve as a tail area, compare it to alpha, and weigh the two ways to be wrong (Type I/II, power). Then: two outcomes you must also recognise — a fat p that is NOT proof of no effect, and a tiny p on a huge sample that is statistically significant but practically meaningless.",
    charts: [
      {
        type: "bars",
        title: "Step 1 — test statistic  t = gap / standard error  =  0.030 / 0.010  =  3.0",
        xlabel: "term",
        ylabel: "value",
        labels: ["gap (xB - xA)", "standard error", "t = gap / SE"],
        values: [0.030, 0.010, 3.0],
        valueLabels: ["0.030", "0.010", "3.0"],
        colors: ["#4ea1ff", "#9aa7b4", "#7ee787"],
        interpret: "<b>Build the one number that summarises the data.</b> Each bar is a term in t = gap / standard error. The blue <b>gap</b> (0.030) is how much B's average beats A's; the grey <b>standard error</b> (0.010) is how much that gap would wobble from sampling luck alone. The green bar is their ratio, <b>t = 3.0</b>: the observed gap stands 3 noise-units above zero. Read it as 'how many standard errors of separation' — bigger |t| means the gap is harder to dismiss as chance."
      },
      {
        type: "line",
        title: "Step 2 — p-value = shaded tail area beyond |t|=3.0 under the null t-curve (df=8) = 0.017",
        xlabel: "t-statistic (standard errors from 0)",
        ylabel: "probability density under H0",
        series: [
          { name: "null t-distribution (H0 true)", color: "#4ea1ff", points: [[-5,0.00066],[-4.8,0.00087],[-4.6,0.00115],[-4.4,0.00153],[-4.2,0.00205],[-4,0.00276],[-3.8,0.00373],[-3.6,0.00507],[-3.4,0.00692],[-3.2,0.00948],[-3,0.01301],[-2.8,0.01788],[-2.6,0.02457],[-2.4,0.03369],[-2.2,0.046],[-2,0.06237],[-1.8,0.08372],[-1.6,0.11086],[-1.4,0.14425],[-1.2,0.18361],[-1,0.22761],[-0.8,0.27351],[-0.6,0.31721],[-0.4,0.35373],[-0.2,0.37812],[0,0.3867],[0.2,0.37812],[0.4,0.35373],[0.6,0.31721],[0.8,0.27351],[1,0.22761],[1.2,0.18361],[1.4,0.14425],[1.6,0.11086],[1.8,0.08372],[2,0.06237],[2.2,0.046],[2.4,0.03369],[2.6,0.02457],[2.8,0.01788],[3,0.01301],[3.2,0.00948],[3.4,0.00692],[3.6,0.00507],[3.8,0.00373],[4,0.00276],[4.2,0.00205],[4.4,0.00153],[4.6,0.00115],[4.8,0.00087],[5,0.00066]] },
          { name: "p-value tail (|t| >= 3.0)", color: "#ffb454", points: [[-5,0.00066],[-4.8,0.00087],[-4.6,0.00115],[-4.4,0.00153],[-4.2,0.00205],[-4,0.00276],[-3.8,0.00373],[-3.6,0.00507],[-3.4,0.00692],[-3.2,0.00948],[-3,0.01301],[-2.8,0],[-2.6,0],[-2.4,0],[-2.2,0],[-2,0],[-1.8,0],[-1.6,0],[-1.4,0],[-1.2,0],[-1,0],[-0.8,0],[-0.6,0],[-0.4,0],[-0.2,0],[0,0],[0.2,0],[0.4,0],[0.6,0],[0.8,0],[1,0],[1.2,0],[1.4,0],[1.6,0],[1.8,0],[2,0],[2.2,0],[2.4,0],[2.6,0],[2.8,0],[3,0.01301],[3.2,0.00948],[3.4,0.00692],[3.6,0.00507],[3.8,0.00373],[4,0.00276],[4.2,0.00205],[4.4,0.00153],[4.6,0.00115],[4.8,0.00087],[5,0.00066]] }
        ],
        interpret: "<b>Turn the statistic into a probability.</b> The blue bell is where t would land if H0 (no real difference) were true — most weight near 0, thin tails far out. The orange area is the p-value: the chance of a |t| at least as extreme as our 3.0, counted on BOTH tails (two-sided). It integrates to <b>p = 0.017</b>, so under 'nothing is going on' a gap this big shows up only about 1.7% of the time. Smaller tail area = more surprising = stronger evidence against H0."
      },
      {
        type: "line",
        title: "Step 3 — significance threshold: reject H0 when |t| lands in the alpha=0.05 region (|t| > 2.306)",
        xlabel: "t-statistic (standard errors from 0)",
        ylabel: "probability density under H0",
        series: [
          { name: "null t-distribution (H0 true)", color: "#4ea1ff", points: [[-5,0.00066],[-4.8,0.00087],[-4.6,0.00115],[-4.4,0.00153],[-4.2,0.00205],[-4,0.00276],[-3.8,0.00373],[-3.6,0.00507],[-3.4,0.00692],[-3.2,0.00948],[-3,0.01301],[-2.8,0.01788],[-2.6,0.02457],[-2.4,0.03369],[-2.2,0.046],[-2,0.06237],[-1.8,0.08372],[-1.6,0.11086],[-1.4,0.14425],[-1.2,0.18361],[-1,0.22761],[-0.8,0.27351],[-0.6,0.31721],[-0.4,0.35373],[-0.2,0.37812],[0,0.3867],[0.2,0.37812],[0.4,0.35373],[0.6,0.31721],[0.8,0.27351],[1,0.22761],[1.2,0.18361],[1.4,0.14425],[1.6,0.11086],[1.8,0.08372],[2,0.06237],[2.2,0.046],[2.4,0.03369],[2.6,0.02457],[2.8,0.01788],[3,0.01301],[3.2,0.00948],[3.4,0.00692],[3.6,0.00507],[3.8,0.00373],[4,0.00276],[4.2,0.00205],[4.4,0.00153],[4.6,0.00115],[4.8,0.00087],[5,0.00066]] },
          { name: "rejection region (area = alpha = 0.05)", color: "#ff7b72", points: [[-5,0.00066],[-4.8,0.00087],[-4.6,0.00115],[-4.4,0.00153],[-4.2,0.00205],[-4,0.00276],[-3.8,0.00373],[-3.6,0.00507],[-3.4,0.00692],[-3.2,0.00948],[-3,0.01301],[-2.8,0.01788],[-2.6,0.02457],[-2.4,0.03369],[-2.306,0.0413],[-2.2,0],[-2,0],[-1.8,0],[-1.6,0],[-1.4,0],[-1.2,0],[-1,0],[-0.8,0],[-0.6,0],[-0.4,0],[-0.2,0],[0,0],[0.2,0],[0.4,0],[0.6,0],[0.8,0],[1,0],[1.2,0],[1.4,0],[1.6,0],[1.8,0],[2,0],[2.2,0],[2.306,0.0413],[2.4,0.03369],[2.6,0.02457],[2.8,0.01788],[3,0.01301],[3.2,0.00948],[3.4,0.00692],[3.6,0.00507],[3.8,0.00373],[4,0.00276],[4.2,0.00205],[4.4,0.00153],[4.6,0.00115],[4.8,0.00087],[5,0.00066]] }
        ],
        interpret: "<b>Where the line in the sand sits.</b> Same null bell, now with the red rejection region — the most extreme 5% of the curve, split across both tails. The cutoff is <b>|t| > 2.306</b> (for df=8); any observed t past that vertical edge is 'too rare to blame on luck' at alpha=0.05. Our t=3.0 lands inside the red zone. The red area is exactly alpha, the false-alarm rate you accept BEFORE seeing data."
      },
      {
        type: "bars",
        title: "Step 4 — the decision: p-value vs alpha threshold  ->  p=0.017 < 0.05  ->  reject H0",
        xlabel: "quantity",
        ylabel: "probability",
        labels: ["p-value (observed)", "alpha (cutoff)"],
        values: [0.017, 0.05],
        valueLabels: ["0.017  REJECT H0", "0.05  threshold"],
        colors: ["#7ee787", "#9aa7b4"],
        interpret: "<b>The call, in one comparison.</b> Green is the observed p-value (0.017), grey is the alpha cutoff (0.05). The rule is simply: p below alpha means reject H0. Here the green bar is shorter than the grey, so <b>p < alpha</b> and we declare B's improvement real (statistically significant). If green had risen above grey, we would keep H0 — the next chart shows exactly that case."
      },
      {
        type: "bars",
        title: "What you might also see #1 — fat p: gap = 0.008, t = 0.8, p = 0.45 -> DO NOT reject H0",
        xlabel: "quantity",
        ylabel: "probability",
        labels: ["p-value (observed)", "alpha (cutoff)"],
        values: [0.45, 0.05],
        valueLabels: ["0.45  keep H0", "0.05  threshold"],
        colors: ["#ff7b72", "#9aa7b4"],
        interpret: "<b>The 'no evidence' outcome — and what it does NOT mean.</b> Suppose B beat A by only 0.008 with the same noise, giving t about 0.8 and <b>p = 0.45</b> (illustrative). The red p-bar towers over the grey alpha cutoff, so p > alpha: chance fakes a gap this size almost half the time, and we <b>fail to reject H0</b>. Crucial reading: this is 'no evidence of a difference', NOT 'proof the models are equal' — a small or underpowered study lands here even when a real effect exists. Don't claim the models are identical; say you couldn't detect a difference."
      },
      {
        type: "bars",
        title: "What you might also see #2 — huge n: tiny 0.05% lift, p=0.0001 SIGNIFICANT but trivial",
        xlabel: "quantity (two scales)",
        ylabel: "value",
        labels: ["effect size (% lift)", "p-value", "alpha cutoff"],
        values: [0.05, 0.0001, 0.05],
        valueLabels: ["0.05% lift (tiny)", "0.0001 sig.", "0.05"],
        colors: ["#ffb454", "#7ee787", "#9aa7b4"],
        interpret: "<b>Significant is not the same as important.</b> With millions of rows the standard error shrinks to almost nothing, so even a microscopic <b>0.05% lift</b> (orange) produces a tiny <b>p = 0.0001</b> (green, far below the grey 0.05 cutoff) and 'passes'. Reading: a small p only says the effect is probably nonzero, never that it is big enough to act on. Recognise this trap by a giant sample plus a trivial effect size. Fix: always report the effect size and a confidence interval, and ask 'is this gap worth shipping?' — here, no."
      },
      {
        type: "line",
        title: "Step 5 — two ways to be wrong: Type I (alpha, false alarm) vs Type II (beta, miss); power = 1 - beta = 0.75",
        xlabel: "t-statistic",
        ylabel: "probability density",
        series: [
          { name: "H0 true: red right tail = alpha/2 (Type I)", color: "#4ea1ff", points: [[-5,0.00066],[-4.5,0.00132],[-4,0.00276],[-3.5,0.00592],[-3,0.01301],[-2.5,0.02878],[-2.306,0.0413],[-2,0.06237],[-1.5,0.12677],[-1,0.22761],[-0.5,0.33669],[0,0.3867],[0.5,0.33669],[1,0.22761],[1.5,0.12677],[2,0.06237],[2.306,0.0413],[2.5,0.02878],[3,0.01301],[3.5,0.00592],[4,0.00276],[4.5,0.00132],[5,0.00066]] },
          { name: "H1 true (real effect, mean t=3): left part < 2.306 = beta (Type II miss)", color: "#c89bff", points: [[-5,0],[-4.5,0],[-4,0],[-3.5,0],[-3,0],[-2.5,0],[-2.306,0],[-2,0.00001],[-1.5,0.00003],[-1,0.00017],[-0.5,0.00063],[0,0.0043],[0.5,0.01399],[1,0.06049],[1.5,0.12374],[2,0.24201],[2.306,0.28],[2.5,0.29855],[3,0.31059],[3.5,0.27817],[4,0.20534],[4.5,0.15756],[5,0.1]] }
        ],
        interpret: "<b>The cost of each mistake.</b> Two worlds overlap. Blue is H0 (no effect): its tail past the 2.306 cutoff is the <b>Type I</b> false-alarm rate alpha — crying 'effect!' when there is none. Purple is H1 (a real effect, centred near t=3): the slice of it still falling LEFT of 2.306 is the <b>Type II</b> miss rate beta = 0.25 — failing to catch a true effect. The rest of purple, to the right, is the <b>power = 1 - beta = 0.75</b>. More data or a bigger effect slides the purple curve rightward, shrinking beta and raising power. All numbers computed: t=3.0, df=8, p=0.01707, t_crit=2.306, power=0.748."
      }
    ],
    caption: "The five-step recipe end to end on the worked example (B beats A by 3 accuracy points), plus two outcomes you must also recognise. Steps 1-4: build t=3.0, read the p-value as the 0.017 tail area, mark the alpha=0.05 rejection region (|t|>2.306), and make the call p<alpha -> reject H0. The two 'what you might also see' bars are the everyday traps: a fat p=0.45 where you FAIL to reject and must say 'no evidence' rather than 'no effect', and a huge-sample p=0.0001 on a trivial 0.05% lift that is statistically significant yet not worth shipping. Step 5 weighs the two errors: Type I (alpha) under H0 vs Type II (beta=0.25) under a real effect, leaving power=0.75. Numbers are computed, not invented.",
    code: `import numpy as np
from scipy import stats

A = np.array([0.90, 0.91, 0.89, 0.92, 0.88])   # model A accuracy on 5 splits
B = np.array([0.93, 0.94, 0.92, 0.95, 0.91])   # model B accuracy on 5 splits

# ---- 1. test statistic  t = gap / standard error -----------------------
gap = B.mean() - A.mean()                       # 0.030
sA, sB, n = A.std(ddof=1), B.std(ddof=1), len(A)
se  = np.sqrt(sA**2/n + sB**2/n)                # 0.010
t   = gap / se                                  # 3.0
df  = 8.0                                        # Welch df for this data
print("gap =", round(gap,3), " SE =", round(se,3), " t =", round(t,1))

# ---- 2. p-value = two-sided tail area beyond |t| under the null --------
p = 2 * stats.t.sf(abs(t), df)                  # 0.01707
print("p-value =", round(p, 5))

# ---- 3. significance threshold: rejection region |t| > t_crit ----------
alpha  = 0.05
t_crit = stats.t.ppf(1 - alpha/2, df)           # 2.306
print("t_crit =", round(t_crit, 3), " reject H0:", p < alpha)

# ---- 5. power = 1 - beta, assuming the true effect equals what we saw --
# under H1 the statistic is noncentral-t with noncentrality = t = 3.0
beta  = stats.nct.cdf(t_crit, df, t) - stats.nct.cdf(-t_crit, df, t)
print("Type II (beta) =", round(beta,3), " power =", round(1 - beta, 3))`
  };
})();
