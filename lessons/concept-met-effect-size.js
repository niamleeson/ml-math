/* =====================================================================
   METRICS & EVALUATION — BEGINNER lesson.
   "Effect sizes — how BIG is the difference, not just whether it's
   significant." A p-value says IF an effect exists; an effect size says
   HOW MUCH it matters. Covers Cohen's d, Hedges' g, Glass's delta,
   Pearson r / r-squared, eta-squared / partial eta-squared / omega-squared,
   odds ratio, risk ratio, risk difference, NNT, Cliff's delta,
   rank-biserial, and Cramer's V / phi.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-effect-size",
    title: "Effect sizes — how big, not just whether",
    tagline: "A p-value tells you IF a difference is real; an effect size tells you HOW BIG it is and whether it matters.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["met-foundations", "prob-variance"],

    whenToUse:
      `<p><b>Report an effect size next to every p-value — always.</b> A p-value (the probability of seeing data this extreme if there were truly no difference) answers only one question: "could this be luck?" It says nothing about <i>how big</i> the difference is. An <b>effect size</b> is the number that answers "how much?". With a big enough sample, even a difference too tiny to care about comes out "statistically significant" — so the effect size is what tells you whether the result <i>matters</i>.</p>
       <p><b>Pick the effect size from the kind of comparison:</b></p>
       <ul>
         <li><b>Difference of two means</b> (e.g. average score of group A vs group B): a <b>standardized mean difference</b> — <b>Cohen's d</b>, <b>Hedges' g</b> (a small-sample correction of d), or <b>Glass's &Delta;</b> (delta; uses one group's spread when a control group is the natural yardstick).</li>
         <li><b>Strength of a linear relationship</b> between two numbers: <b>Pearson r</b>, and <b>r&sup2;</b> = the fraction of variation explained.</li>
         <li><b>How much a grouping explains</b> in an ANOVA (Analysis Of Variance — comparing means across several groups): <b>eta&sup2;</b> (eta-squared), <b>partial eta&sup2;</b>, or the less-biased <b>omega&sup2;</b> (omega-squared) — all "fraction of variance explained".</li>
         <li><b>A binary (yes/no) outcome</b> — disease, click, churn: <b>odds ratio</b>, <b>risk ratio</b> (relative risk), <b>risk difference</b>, and <b>Number Needed to Treat (NNT)</b> for medicine/epidemiology.</li>
         <li><b>Two groups, but the data are skewed or not bell-shaped</b>: the nonparametric <b>Cliff's delta</b> or the <b>rank-biserial correlation</b> (built on ranks, not raw values).</li>
         <li><b>Two categorical variables</b> in a table (e.g. region vs product chosen): <b>phi</b> (for a 2&times;2 table) and <b>Cramer's V</b> (for any size table).</li>
       </ul>
       <p><b>Avoid leaning on the benchmarks</b> (the small / medium / large labels below) as if they were laws — they are rough defaults, and "large" in one field is "trivial" in another. Always sanity-check against what the number means in the real units of your problem.</p>`,

    application:
      `<p>Effect sizes are everywhere a difference has to be judged. An <b>A/B test</b> team reports the risk difference and risk ratio on conversion — "the new checkout lifts purchase rate from 4.0% to 4.4%" — not just "p &lt; 0.05". A <b>medical trial</b> reports the odds ratio plus NNT: "you must treat 25 patients to prevent one heart attack." A <b>psychology or UX study</b> reports Cohen's d on a survey score. A <b>feature-selection</b> step in machine learning ranks inputs by how strongly each separates the classes — which is exactly Cohen's d between the two groups. In every case the p-value is the gatekeeper ("is it real?") and the effect size is the verdict ("is it worth acting on?").</p>`,

    pitfalls:
      `<ul>
         <li><b>Confusing "significant" with "important".</b> Tell: a result is reported as "p &lt; 0.001" and treated as a big deal, but no effect size is given. With a huge sample, a meaningless gap (a 0.01% lift) is "highly significant". <b>Fix:</b> always read the effect size; if it is tiny, the finding is real but unimportant.</li>
         <li><b>Cohen's d inflated by a tiny within-group spread.</b> Tell: d is enormous, yet the raw means barely differ. Because d divides by the pooled standard deviation, a very small spread makes any gap look huge. <b>Fix:</b> also look at the raw difference in real units, and check the standard deviation is not unusually small.</li>
         <li><b>Reading an odds ratio as a risk ratio when the outcome is common.</b> Tell: someone says "twice as likely" from an odds ratio of 2 while 40% of people have the outcome. Odds and risk only agree when the outcome is rare; for common outcomes the odds ratio is much further from 1 than the risk ratio. <b>Fix:</b> report the risk ratio (or risk difference) when you mean "how much more likely".</li>
         <li><b>Treating the small / medium / large benchmarks as universal truth.</b> Tell: a d of 0.2 is dismissed as "small / unimportant" with no thought to context. In a cheap large-scale intervention a "small" effect can be hugely valuable; in a costly drug a "medium" effect may not justify side effects. <b>Fix:</b> interpret the size against the cost and stakes of <i>your</i> decision, not a generic table.</li>
       </ul>`,

    bigIdea:
      `<p>An <b>effect size</b> is a number that measures <i>how big</i> a difference or a relationship is — on a scale you can compare across studies. It is the answer to "how much?", separate from "is it real?".</p>
       <p>The cleanest example is <b>Cohen's d</b>. Two groups have means that differ. How big is that gap? Measuring it in raw units (dollars, milliseconds) is hard to compare across problems. So we measure the gap <i>in units of the typical spread</i> — we divide the difference of the means by the standard deviation (a measure of how spread out the values are; see the Variance lesson). A d of 1 means the groups are one whole standard deviation apart: a clearly visible separation. A d of 0.1 means they overlap almost completely.</p>
       <p><b>Why this is not the p-value.</b> A p-value mixes the size of the effect with the size of the sample. Collect ten times more data and the same true effect gets a smaller p-value — significance grows just from sample size. The effect size does <i>not</i>: it estimates the real magnitude, and adding data only makes that estimate more precise, not bigger. So with huge samples, almost everything becomes "significant", and the effect size is the only thing left that tells you whether the difference is worth caring about.</p>
       <p><b>Cohen's rough benchmarks</b> (for d): about <b>0.2 = small</b>, <b>0.5 = medium</b>, <b>0.8 = large</b>. For a correlation r: about <b>0.1 = small</b>, <b>0.3 = medium</b>, <b>0.5 = large</b>. These are starting points, not rules.</p>`,

    buildup:
      `<p>Effect sizes come in families, one per kind of comparison. Here is each metric in your brief, defined.</p>
       <p><b>1) Standardized mean differences</b> (two groups of numbers):</p>
       <ul>
         <li><b>Cohen's d</b> — the gap between the two means, divided by the <i>pooled</i> standard deviation (the two groups' spreads combined). "How many standard deviations apart are the groups?"</li>
         <li><b>Hedges' g</b> — Cohen's d times a small correction factor that removes a slight upward bias when samples are small. For large samples g and d are nearly identical.</li>
         <li><b>Glass's &Delta;</b> (delta) — the same gap, but divided by <i>only the control group's</i> standard deviation. Used when one group is a clean baseline and the treatment might itself change the spread, so the control's spread is the fairer yardstick.</li>
       </ul>
       <p><b>2) Variance explained</b> (how much of the variation one thing accounts for):</p>
       <ul>
         <li><b>Pearson r</b> — the correlation: a number from $-1$ to $+1$ for how tightly two quantities move together in a straight line.</li>
         <li><b>r&sup2;</b> (r-squared) — r multiplied by itself: the fraction (0 to 1) of one variable's variation that the other explains. r = 0.5 means r&sup2; = 0.25, i.e. 25% explained.</li>
         <li><b>eta&sup2;</b> (eta-squared) — the ANOVA cousin of r&sup2;: the fraction of total variation explained by the grouping (which group you are in). It is between-group variation over total variation.</li>
         <li><b>partial eta&sup2;</b> — the same idea but for one factor after setting aside the variation explained by the other factors. Common in software output (e.g. SPSS).</li>
         <li><b>omega&sup2;</b> (omega-squared) — a less-biased version of eta&sup2;. Eta&sup2; tends to overstate the effect on small samples; omega&sup2; subtracts off the expected chance inflation, so it is the more honest estimate.</li>
       </ul>
       <p><b>3) Binary outcomes</b> (yes/no), read off a 2&times;2 table of counts (exposed vs not, by event vs no event):</p>
       <ul>
         <li><b>Risk</b> = the probability of the event in a group (events &divide; group size). The plain everyday "chance".</li>
         <li><b>Risk ratio</b> (relative risk, RR) — risk in the exposed group &divide; risk in the unexposed group. "Twice as likely" means RR = 2.</li>
         <li><b>Risk difference</b> (RD) — risk in exposed <i>minus</i> risk in unexposed. The change in absolute percentage points.</li>
         <li><b>Odds ratio</b> (OR) — the <i>odds</i> (event &divide; non-event) in one group divided by the odds in the other. Odds are not the same as risk; OR &asymp; RR only when the event is rare.</li>
         <li><b>Number Needed to Treat</b> (NNT) — $1 \\div$ risk difference. "How many people must get the treatment to prevent one bad outcome." Smaller NNT = more powerful treatment.</li>
       </ul>
       <p><b>4) Nonparametric</b> (skewed or non-bell-shaped data, where means and standard deviations are unreliable):</p>
       <ul>
         <li><b>Cliff's delta</b> — pick a random value from each group; delta = (probability group A's value is larger) $-$ (probability B's is larger). Ranges $-1$ to $+1$; $0$ = complete overlap. It uses only ordering, so outliers cannot distort it.</li>
         <li><b>Rank-biserial correlation</b> — the same overlap idea expressed as a correlation, the effect size that pairs with the Mann–Whitney U test (a rank-based two-group test).</li>
       </ul>
       <p><b>5) Categorical association</b> (two category variables in a table):</p>
       <ul>
         <li><b>phi</b> — for a 2&times;2 table, the correlation between two yes/no variables; $0$ = unrelated, $1$ = perfectly linked.</li>
         <li><b>Cramer's V</b> — generalizes phi to tables of any size; always between $0$ and $1$. Both are built from the chi-squared statistic (a measure of how far a table is from "no association").</li>
       </ul>`,

    symbols: [
      { sym: "$\\bar{x}_1, \\bar{x}_2$", desc: "the two group means (averages) being compared." },
      { sym: "$s_p$", desc: "the pooled standard deviation — the two groups' spreads combined into one typical spread. Standard deviation = how far values sit from their mean on average." },
      { sym: "$s_c$", desc: "the standard deviation of the control (baseline) group only — the denominator for Glass's delta." },
      { sym: "$n_1, n_2$", desc: "the sizes (number of data points) of group 1 and group 2." },
      { sym: "$d$", desc: "Cohen's d: the mean gap measured in pooled standard deviations." },
      { sym: "$g$", desc: "Hedges' g: Cohen's d with a small-sample bias correction multiplied in." },
      { sym: "$r$", desc: "Pearson correlation, from $-1$ to $+1$; $r^2$ is the fraction of variance explained." },
      { sym: "$\\eta^2,\\ \\omega^2$", desc: "eta-squared and omega-squared: fraction of variance a grouping explains (omega-squared is the less-biased version)." },
      { sym: "$a,b,c,d$", desc: "the four counts of a 2x2 table: a = exposed-with-event, b = exposed-no-event, c = unexposed-with-event, d = unexposed-no-event." },
      { sym: "RR, OR", desc: "risk ratio (relative risk) and odds ratio for a binary outcome." },
      { sym: "RD, NNT", desc: "risk difference (in percentage points) and Number Needed to Treat = $1 \\div$ RD." },
      { sym: "$\\delta$", desc: "Cliff's delta: P(A's value larger) minus P(B's value larger), a rank-based overlap measure from $-1$ to $+1$." },
      { sym: "$V$", desc: "Cramer's V: strength of association between two categorical variables, $0$ to $1$." }
    ],

    formula: `$$ d=\\frac{\\bar{x}_1-\\bar{x}_2}{s_p},\\quad s_p=\\sqrt{\\frac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}},\\qquad g=d\\left(1-\\frac{3}{4(n_1+n_2)-9}\\right) $$
$$ \\text{RR}=\\frac{a/(a+b)}{c/(c+d)},\\quad \\text{OR}=\\frac{a\\,d}{b\\,c},\\quad \\text{RD}=\\frac{a}{a+b}-\\frac{c}{c+d},\\quad \\text{NNT}=\\frac{1}{\\text{RD}},\\qquad V=\\sqrt{\\frac{\\chi^2/n}{\\min(r-1,\\,k-1)}} $$`,

    whatItDoes:
      `<p><b>Top line — comparing two means.</b> <b>Cohen's d</b> takes the difference of the two means and divides by $s_p$, the pooled standard deviation, so the answer is in "standard-deviation units" you can compare across any problem. The middle formula shows $s_p$: a sample-size-weighted blend of the two groups' variances ($s_1^2, s_2^2$). <b>Hedges' g</b> is just d shrunk by a factor a hair below 1 — it matters only for small samples, where d runs slightly too large. (Glass's &Delta; is the same as d but with $s_c$, the control group's standard deviation, in the denominator instead of $s_p$.)</p>
       <p><b>Bottom line — binary outcomes.</b> From the four counts of a 2&times;2 table, <b>RR</b> compares the two groups' <i>risks</i> (event rate) as a ratio, <b>OR</b> compares their <i>odds</i> (event-to-non-event) as a ratio — the famous cross-product $ad/bc$ — and <b>RD</b> is the plain difference in risk. <b>NNT</b> inverts RD into "treat this many to help one." <b>Cramer's V</b> rescales the chi-squared statistic by the sample size $n$ and the table's smaller dimension so it always lands between 0 and 1, no matter how big the table.</p>
       <p>The thread through all of them: each turns "a difference exists" into "a difference <i>this large</i>", on a scale that does not balloon just because you collected more data.</p>`,

    derivation:
      `<p><b>Why dividing by the standard deviation makes the size comparable.</b></p>
       <ul class="steps">
         <li>A raw gap like "$\\bar{x}_1-\\bar{x}_2 = 12$ points" is meaningless on its own — 12 points is huge if scores usually vary by 3, and trivial if they vary by 200.</li>
         <li>So we measure the gap relative to the natural spread of the data: divide by the standard deviation. Now the unit is "spreads", which compares across tests, scales, and fields. That ratio is <b>Cohen's d</b>.</li>
         <li>Which spread? Pooling both groups ($s_p$) gives one shared yardstick when neither group is special. Using only the control's spread ($s_c$) gives <b>Glass's &Delta;</b>, fair when the treatment itself might widen or shrink the spread.</li>
         <li>On small samples, the pooled standard deviation slightly underestimates the true spread, which makes d slightly too big. <b>Hedges' g</b> multiplies by a correction just under 1 to undo that bias; as $n$ grows the factor $\\to 1$ and g $=$ d.</li>
       </ul>
       <p><b>Why p shrinks with sample size but the effect size does not.</b> The standard error of a mean difference scales like $1/\\sqrt{n}$ — more data, less wobble. A test statistic is roughly (effect size) $\\times \\sqrt{n}$, so for any non-zero true effect, piling on data pushes the statistic up and the p-value down toward 0. The effect size $d$ has no $\\sqrt{n}$ in it: it estimates the real magnitude, and extra data only sharpens that estimate. <i>That</i> is why a p-value alone cannot tell you whether something matters — and why you must report an effect size beside it. $\\blacksquare$</p>`,

    example:
      `<p><b>Means (Cohen's d).</b> A reading program is tested. The treatment group scores a mean of $\\bar{x}_1=78$, the control $\\bar{x}_2=72$, and suppose the pooled standard deviation is $s_p=12$.</p>
       <ul class="steps">
         <li>$d=\\dfrac{\\bar{x}_1-\\bar{x}_2}{s_p}=\\dfrac{78-72}{12}=\\dfrac{6}{12}=0.5$. The groups are half a standard deviation apart — a <b>medium</b> effect by Cohen's benchmark.</li>
         <li>If instead the spread were tiny, $s_p=2$, the same 6-point gap gives $d=\\dfrac{6}{2}=3$ — a giant-looking effect from a small denominator. That is the "tiny within-group variance inflates d" pitfall: always glance at the raw 6 points too.</li>
       </ul>
       <p><b>Binary outcome (risk vs odds).</b> Of 50 exposed people, 40 got the event and 10 did not; of 50 unexposed, 20 got the event and 30 did not. Lay the four counts out as the 2&times;2 table the formulas read from, $a=40,\\,b=10,\\,c=20,\\,d=30$:</p>
       <table class="extable">
         <caption>The 2&times;2 contingency table of counts.</caption>
         <thead><tr><th></th><th class="num">event</th><th class="num">no event</th><th class="num">row total</th></tr></thead>
         <tbody>
           <tr><td class="row-h">exposed</td><td class="num">$a=40$</td><td class="num">$b=10$</td><td class="num">50</td></tr>
           <tr><td class="row-h">unexposed</td><td class="num">$c=20$</td><td class="num">$d=30$</td><td class="num">50</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li>Risk (exposed) $=\\dfrac{a}{a+b}=\\dfrac{40}{50}=0.80$; risk (unexposed) $=\\dfrac{c}{c+d}=\\dfrac{20}{50}=0.40$.</li>
         <li><b>Risk ratio</b> RR $=0.80/0.40=2.0$ — the exposed are twice as likely to have the event.</li>
         <li><b>Risk difference</b> RD $=0.80-0.40=0.40$ — a 40-percentage-point jump. <b>NNT</b> $=1/0.40=2.5$.</li>
         <li><b>Odds ratio</b> OR $=\\dfrac{a\\,d}{b\\,c}=\\dfrac{40\\times 30}{10\\times 20}=\\dfrac{1200}{200}=6.0$.</li>
       </ul>
       <p>Lined up side by side, OR $=6$ sits far from RR $=2$ — because the event is <i>common</i> here (40%–80%), the odds ratio badly overstates "how many times more likely". Reporting OR as if it were RR is the classic mistake:</p>
       <table class="extable">
         <caption>Four effect sizes from the same 2&times;2 table.</caption>
         <thead><tr><th>measure</th><th class="num">formula</th><th class="num">value</th></tr></thead>
         <tbody>
           <tr><td class="row-h">Risk ratio (RR)</td><td class="num">$0.80/0.40$</td><td class="num">2.0</td></tr>
           <tr><td class="row-h">Risk difference (RD)</td><td class="num">$0.80-0.40$</td><td class="num">0.40</td></tr>
           <tr><td class="row-h">NNT</td><td class="num">$1/0.40$</td><td class="num">2.5</td></tr>
           <tr><td class="row-h">Odds ratio (OR)</td><td class="num">$(40\\cdot30)/(10\\cdot20)$</td><td class="num">6.0</td></tr>
         </tbody>
       </table>`,

    demo: function (host) {
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, dft) { return (s.getPropertyValue(n) || dft).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // Two bell curves a distance d*sd apart; user drags to set d.
      var sd = 0.16, mid = 0.5, dEff = 1.0, nPer = 200;
      function gauss(x, mu) { var z = (x - mu) / sd; return Math.exp(-0.5 * z * z); }
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 190; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

      function mus() { var half = dEff * sd / 2; return [mid - half, mid + half]; }
      function overlapAndP() {
        // overlap of the two equal Gaussians and a toy two-sample p-value proxy.
        var m = mus(), step = 600, dx = 1 / step, ov = 0, i, x;
        for (i = 0; i < step; i++) { x = (i + 0.5) * dx; ov += Math.min(gauss(x, m[0]), gauss(x, m[1])) * dx; }
        var norm = sd * Math.sqrt(2 * Math.PI);
        var overlap = ov / norm; // fraction shared
        // t ~ d * sqrt(n/2) for equal n per group; p two-sided via normal approx
        var t = dEff * Math.sqrt(nPer / 2);
        var p = 2 * (1 - normCdf(Math.abs(t)));
        return { overlap: overlap, p: p, t: t };
      }
      function normCdf(z) { // Abramowitz-Stegun approximation
        var b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429, p = 0.2316419, c = 0.39894228;
        if (z < 0) return 1 - normCdf(-z);
        var tt = 1 / (1 + p * z);
        return 1 - c * Math.exp(-z * z / 2) * tt * (b1 + tt * (b2 + tt * (b3 + tt * (b4 + tt * b5))));
      }
      function draw() {
        var col = C(); ctx.clearRect(0, 0, 640, 190);
        var W = 640, H = 190, padL = 12, padR = 12, y0 = 14, y1 = H - 30;
        function PX(x) { return padL + x * (W - padL - padR); }
        function PY(v) { return y1 - v * (y1 - y0); }
        ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(PX(0), y1); ctx.lineTo(PX(1), y1); ctx.stroke();
        var m = mus();
        function curve(mu, color) {
          ctx.beginPath(); var first = true, i, x;
          for (i = 0; i <= 240; i++) { x = i / 240; var Y = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Y); first = false; } else ctx.lineTo(PX(x), Y); }
          ctx.lineTo(PX(1), y1); ctx.lineTo(PX(0), y1); ctx.closePath(); ctx.fillStyle = color + "30"; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); first = true;
          for (i = 0; i <= 240; i++) { x = i / 240; var Yy = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Yy); first = false; } else ctx.lineTo(PX(x), Yy); }
          ctx.stroke();
        }
        curve(m[0], col.accent); curve(m[1], col.accent2);
        // tick at each mean
        ctx.strokeStyle = col.dim; ctx.lineWidth = 1;
        [m[0], m[1]].forEach(function (mu) { ctx.beginPath(); ctx.moveTo(PX(mu), y1); ctx.lineTo(PX(mu), y1 + 5); ctx.stroke(); });
        ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("control", PX(m[0]), y1 + 18); ctx.fillText("treatment", PX(m[1]), y1 + 18);
      }
      function render() {
        draw(); var r = overlapAndP(), col = C();
        var label = dEff < 0.2 ? "negligible" : dEff < 0.35 ? "small" : dEff < 0.65 ? "small–medium" : dEff < 0.9 ? "medium–large" : "large";
        readout.innerHTML = "Cohen's d = <b>" + dEff.toFixed(2) + "</b> (" + label + "). The two bell curves are " + dEff.toFixed(2) + " standard deviations apart, sharing about <b>" + Math.round(r.overlap * 100) + "%</b> of their area. With n = " + nPer + " per group the p-value is <b>" + (r.p < 1e-6 ? "&lt; 1e-6" : r.p.toExponential(1)) + "</b>. Drag left/right to change d: shrink the effect and the curves merge, yet with this many samples the p-value can stay tiny — significance is not size.";
      }
      function setFromX(clientX) {
        var rect = cv.getBoundingClientRect(), scale = cv.width / rect.width;
        var x = (clientX - rect.left) * scale, frac = (x - 12) / (640 - 24);
        dEff = Math.max(0.0, Math.min(2.0, frac * 2.0)); render();
      }
      var dragging = false;
      cv.addEventListener("mousedown", function (e) { dragging = true; setFromX(e.clientX); });
      window.addEventListener("mousemove", function (e) { if (dragging) setFromX(e.clientX); });
      window.addEventListener("mouseup", function () { dragging = false; });
      cv.addEventListener("touchstart", function (e) { dragging = true; if (e.touches[0]) setFromX(e.touches[0].clientX); });
      cv.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) { setFromX(e.touches[0].clientX); e.preventDefault(); } });
      render();
    },

    practice: [
      {
        q: `A teammate reports: "The new onboarding flow significantly increased signups (p &lt; 0.001) across 4 million users." Why is the p-value alone not enough to decide whether to ship it, and what should you ask for?`,
        steps: [
          { do: `Separate "real" from "big".`, why: `A p-value answers only whether the difference is likely real, not how large it is.` },
          { do: `Account for the huge sample.`, why: `With 4 million users, even a microscopic lift (say signups from 10.00% to 10.02%) will be "highly significant" because the test statistic grows with the square root of the sample size.` },
          { do: `Ask for the effect size in real units.`, why: `Request the risk difference (percentage-point lift) and risk ratio, plus a confidence interval, so you can weigh the actual gain against the cost of shipping.` }
        ],
        answer: `<p>"p &lt; 0.001" only says the increase is almost certainly not luck — it says nothing about <b>how big</b> it is, and with 4 million users essentially any non-zero effect clears that bar. Ask for the <b>effect size</b>: the <b>risk difference</b> (the absolute percentage-point lift in signup rate) and the <b>risk ratio</b>, with a confidence interval. If the lift is 0.02 points, it is real but probably not worth the engineering cost; if it is 3 points, ship it.</p>`
      },
      {
        q: `Two groups have means 78 and 72. In study A the pooled standard deviation is 12; in study B it is 3. Compute Cohen's d for each and explain why the much larger d in study B can be misleading.`,
        steps: [
          { do: `Apply Cohen's d.`, why: `d = (mean1 − mean2) / pooled standard deviation. The numerator (the raw gap) is the same 6 in both studies.` },
          { do: `Plug in each spread.`, why: `Study A: 6 / 12 = 0.5. Study B: 6 / 3 = 2.0. Same gap, very different d, purely because the denominator changed.` },
          { do: `Interpret the inflation.`, why: `A tiny within-group spread makes any gap look like many standard deviations, so d balloons even though the real-world difference (6 points) is identical.` }
        ],
        answer: `<p>Study A: $d = 6/12 = 0.5$ (medium). Study B: $d = 6/3 = 2.0$ (very large). The <b>raw difference is the same 6 points</b> in both — only the spread changed. Because Cohen's d divides by the pooled standard deviation, a very small within-group variance inflates d, making study B look dramatically stronger when the actual gap is identical. The fix is to always report the raw difference in real units alongside d, and to be suspicious of a giant d paired with an unusually tiny standard deviation.</p>`
      },
      {
        q: `A 2×2 table: of 50 exposed, 40 had the event; of 50 unexposed, 20 had the event. Compute the risk ratio, risk difference, NNT, and odds ratio. Why would reporting the odds ratio as "the exposed are 6× as likely" be wrong here?`,
        steps: [
          { do: `Get the two risks.`, why: `Risk = events / group size. Exposed: 40/50 = 0.80. Unexposed: 20/50 = 0.40.` },
          { do: `Form RR, RD, NNT.`, why: `RR = 0.80/0.40 = 2.0. RD = 0.80 − 0.40 = 0.40. NNT = 1/0.40 = 2.5.` },
          { do: `Form the odds ratio.`, why: `OR = (a·d)/(b·c) = (40·30)/(10·20) = 1200/200 = 6.0, using odds (event/non-event), not risk.` }
        ],
        answer: `<p>Risks are 0.80 (exposed) and 0.40 (unexposed). <b>RR = 2.0</b> (twice as likely), <b>RD = 0.40</b> (a 40-point absolute jump), <b>NNT = 2.5</b>, and <b>OR = (40·30)/(10·20) = 6.0</b>. Saying "6× as likely" misreads the odds ratio as a risk ratio: "how many times more likely" is the <b>risk</b> ratio, which is 2, not 6. Odds and risk only line up when the event is rare; here the event is common (40–80%), so the odds ratio sits much further from 1 than the risk ratio. Report RR (or RD) when you mean likelihood.</p>`
      }
    ]
  });

  window.CODE["met-effect-size"] = {
    lib: "scipy / pingouin",
    runnable: false,
    explain: `<p>Effect sizes are short formulas, so they are easy to write from scratch — here are Cohen's d, Hedges' g, Cliff's delta, and the odds ratio / risk ratio from a 2&times;2 table in plain NumPy. The <code>pingouin</code> library wraps all of these (<code>pingouin.compute_effsize</code>, <code>pingouin.compute_effsize_from_t</code>) and reports effect sizes <i>alongside</i> p-values in its <code>ttest</code>, <code>anova</code>, and <code>mwu</code> outputs — so reach for it when you want the test and its effect size in one call.</p>`,
    code: `import numpy as np
from scipy import stats

# ---- 1) standardized mean differences (two groups of numbers) ----
def cohens_d(a, b):
    a, b = np.asarray(a), np.asarray(b)
    n1, n2 = len(a), len(b)
    # pooled standard deviation (the two groups' spreads combined)
    sp = np.sqrt(((n1 - 1) * a.var(ddof=1) + (n2 - 1) * b.var(ddof=1)) / (n1 + n2 - 2))
    return (a.mean() - b.mean()) / sp

def hedges_g(a, b):
    # Cohen's d times a small-sample bias correction (~1 for large n)
    n = len(a) + len(b)
    return cohens_d(a, b) * (1 - 3 / (4 * n - 9))

def glass_delta(treat, control):
    # divide by the CONTROL group's spread only
    return (np.mean(treat) - np.mean(control)) / np.std(control, ddof=1)

# ---- 2) Cliff's delta (nonparametric: ordering only, robust to outliers)
def cliffs_delta(a, b):
    a, b = np.asarray(a), np.asarray(b)
    gt = sum((x > b).sum() for x in a)   # times an a beats a b
    lt = sum((x < b).sum() for x in a)   # times an a loses to a b
    return (gt - lt) / (len(a) * len(b))

# ---- 3) binary outcome: odds ratio & risk ratio from a 2x2 table ----
#   a = exposed+event, b = exposed+noevent, c = unexposed+event, d = unexposed+noevent
def two_by_two(a, b, c, d):
    risk_exp = a / (a + b)
    risk_unexp = c / (c + d)
    rr = risk_exp / risk_unexp                 # risk ratio (relative risk)
    rd = risk_exp - risk_unexp                 # risk difference
    nnt = 1 / rd                               # Number Needed to Treat
    odds_ratio = (a * d) / (b * c)             # odds ratio (cross-product)
    return dict(rr=rr, rd=rd, nnt=nnt, odds_ratio=odds_ratio)

# scipy also gives the odds ratio + its exact test directly:
res = stats.fisher_exact([[40, 10], [20, 30]])   # (odds_ratio, p_value)
print("scipy odds ratio:", round(res[0], 3), " p:", round(res[1], 4))

print(two_by_two(40, 10, 20, 30))
# -> rr=2.0, rd=0.40, nnt=2.5, odds_ratio=6.0

# ---- pingouin: test + effect size + benchmark label in one call ----
# import pingouin as pg
# pg.ttest(group1, group2)          # returns t, p-val, AND 'cohen-d'
# pg.compute_effsize(g1, g2, eftype='hedges')   # also 'cohen', 'glass', 'r'
# pg.anova(data=df, dv='score', between='group')  # returns p AND 'np2' (partial eta^2)`
  };

  window.CODEVIZ["met-effect-size"] = {
    question: "What does each effect size actually measure — and what do the misleading cases look like? See Cohen's d as the separation between two groups, plus the failure modes you will actually meet: a giant d from a tiny spread, a near-zero effect that is still 'significant', and an odds ratio that overstates the risk.",
    charts: [
      {
        type: "line",
        title: "Healthy read: Cohen's d = separation of two groups (d = 0.5 overlap vs d = 1.5 clear gap)",
        xlabel: "score",
        ylabel: "relative frequency",
        series: [
          { name: "control (mean 72)", color: "#4ea1ff", points: [[42, 0.044], [48, 0.135], [54, 0.325], [60, 0.607], [66, 0.882], [72, 1.00], [78, 0.882], [84, 0.607], [90, 0.325], [96, 0.135], [102, 0.044]] },
          { name: "treatment, d=0.5 (mean 78)", color: "#7ee787", points: [[48, 0.044], [54, 0.135], [60, 0.325], [66, 0.607], [72, 0.882], [78, 1.00], [84, 0.882], [90, 0.607], [96, 0.325], [102, 0.135], [108, 0.044]] },
          { name: "treatment, d=1.5 (mean 90)", color: "#ffb454", points: [[60, 0.044], [66, 0.135], [72, 0.325], [78, 0.607], [84, 0.882], [90, 1.00], [96, 0.882], [102, 0.607], [108, 0.325], [114, 0.135], [120, 0.044]] }
        ],
        interpret: "The x-axis is the score; each curve is one group's spread of values, scaled to the same peak height so you compare shapes. <b>Cohen's d is literally how far apart the peaks sit, measured in standard deviations.</b> Blue (control) and green (d = 0.5) overlap heavily — a medium effect you could miss by eye. Orange (d = 1.5) pulls clearly clear of blue — a large, obvious separation. <b>Read it as: more horizontal gap between peaks = bigger d = a difference that matters more.</b>"
      },
      {
        type: "bars",
        title: "Recipe: d = (mean1 - mean2) / pooled SD = 6 / 12 = 0.5",
        xlabel: "term",
        ylabel: "value (score units; d is unitless)",
        labels: ["mean1 = 78", "mean2 = 72", "diff = 6", "pooled SD = 12", "d = 0.5"],
        values: [78, 72, 6, 12, 0.5],
        valueLabels: ["78", "72", "6", "12", "0.50"],
        colors: ["#9aa7b4", "#9aa7b4", "#4ea1ff", "#c89bff", "#7ee787"],
        interpret: "Each bar is one term of the formula. The two grey bars are the group means; the blue bar is their <b>raw gap</b> (6 points); the purple bar is the <b>pooled standard deviation</b> (the typical spread, 12); the green bar is d = gap ÷ spread = 6/12 = <b>0.50</b>. Read it left to right: d takes a raw difference and rescales it by the spread, turning '6 points' into 'half a standard deviation' so you can compare it across any problem."
      },
      {
        type: "bars",
        title: "Tiny-spread TRAP: same 6-point gap, but SD = 2 inflates d from 0.5 to 3.0",
        xlabel: "term",
        ylabel: "value (score units; d is unitless)",
        labels: ["diff = 6", "SD = 12 -> d=0.5", "SD = 2 -> d=3.0"],
        values: [6, 0.5, 3.0],
        valueLabels: ["6", "0.50", "3.00"],
        colors: ["#9aa7b4", "#7ee787", "#ff7b72"],
        interpret: "<b>Illustrative.</b> The raw gap is the same 6 points in both studies (grey). But d divides by the spread: with a normal spread of 12 you get d = 0.5 (green, medium); with an unusually tiny spread of 2 the <i>same</i> gap balloons to d = 3.0 (red, 'huge'). <b>Recognise it when d is enormous but the raw means barely differ.</b> The fix: always look at the raw difference in real units, and be suspicious of a giant d paired with a tiny standard deviation."
      },
      {
        type: "bars",
        title: "Significant but TINY: huge n makes a trivial 0.05-point gap p < 0.001",
        xlabel: "what you see",
        ylabel: "value",
        labels: ["effect size d", "p-value (x1000)", "n per group (x10000)"],
        values: [0.02, 0.4, 200],
        valueLabels: ["d = 0.02", "p < 0.001", "n = 2,000,000"],
        colors: ["#ff7b72", "#9aa7b4", "#9aa7b4"],
        interpret: "<b>Illustrative.</b> A result can be 'highly significant' and still trivially small. Here a negligible effect (d = 0.02, red) clears p < 0.001 only because the sample is enormous (2 million per group). <b>The tell: a tiny effect-size bar next to a tiny p-value.</b> A p-value mixes effect size with sample size, so with huge n almost everything is 'significant'. Read the effect size, not the p-value, to decide if the difference is worth acting on — here it is not."
      },
      {
        type: "bars",
        title: "Odds ratio vs risk ratio on the SAME 2x2 table: OR = 6.0 but RR = 2.0",
        xlabel: "measure",
        ylabel: "value (ratio, or rate)",
        labels: ["risk exposed 0.80", "risk unexposed 0.40", "risk ratio = 2.0", "odds ratio = 6.0"],
        values: [0.80, 0.40, 2.0, 6.0],
        valueLabels: ["0.80", "0.40", "2.0", "6.0"],
        colors: ["#9aa7b4", "#9aa7b4", "#4ea1ff", "#ff7b72"],
        interpret: "Two grey bars are the event rates in each group (0.80 vs 0.40). The blue bar is the <b>risk ratio</b> = 0.80/0.40 = 2.0 — the honest 'twice as likely'. The red bar is the <b>odds ratio</b> = 6.0 on the very same table. <b>Read the gap between blue and red as the trap:</b> because this event is common (40–80%), the odds ratio sits far above the risk ratio. Reporting OR = 6 as 'six times as likely' would be wrong — say RR = 2 when you mean likelihood."
      },
      {
        type: "scatter",
        title: "Correlation r as an effect size: r = 0.92, so r^2 = 0.85 (85% of variance explained)",
        xlabel: "study hours",
        ylabel: "exam score",
        groups: [
          { name: "students (n=14)", color: "#4ea1ff", points: [[1, 55], [2, 52], [2, 61], [3, 58], [4, 72], [4, 64], [5, 70], [6, 68], [7, 82], [8, 85], [3, 60], [5, 75], [6, 71], [2, 57]] }
        ],
        lines: [
          { color: "#ffb454", dash: false, points: [[1, 52.6], [8, 83.3]] }
        ],
        interpret: "Each blue dot is one student: x = hours studied, y = exam score. The orange line is the fitted trend. <b>r measures how tightly the dots hug a straight line</b> — here r = 0.92, so r² = 0.85, meaning the line explains 85% of the score variation. <b>Read tight clustering around the line as a strong effect (r near 1); a diffuse cloud means r near 0.</b> The points rise together left-to-right, so r is positive."
      },
      {
        type: "scatter",
        title: "What r MISSES: a perfect U-shape gives r ~ 0 even though the link is total",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "data (strong but curved)", color: "#ff7b72", points: [[-3, 9], [-2.4, 5.8], [-1.8, 3.2], [-1.2, 1.5], [-0.6, 0.4], [0, 0], [0.6, 0.4], [1.2, 1.5], [1.8, 3.2], [2.4, 5.8], [3, 9]] }
        ],
        lines: [
          { color: "#9aa7b4", dash: true, points: [[-3, 3.5], [3, 3.5]] }
        ],
        interpret: "<b>Illustrative.</b> y is perfectly determined by x (a U-shape, y = x²), yet Pearson r is near <b>0</b> and the best-fit line (grey dashes) is flat. <b>Recognise it when a scatter has an obvious curved pattern but r reports 'no relationship'.</b> r and r² only capture <i>straight-line</i> association, so they completely miss curves. The fix: always plot the data before trusting an r near zero — a low r means 'no linear trend', not 'no relationship'."
      }
    ],
    caption: "Read each chart by its own caption below it. The healthy reads (Cohen's d as peak separation; the term-by-term recipe; the odds-vs-risk bars; r as line-hugging) show what the metrics mean on real numbers. The three variant charts are the traps you will actually meet: a tiny within-group spread inflating d, a trivially small effect still hitting p < 0.001 on a huge sample, and Pearson r reading ~0 on a perfect but curved relationship. All main-chart numbers are computed in the code below, not invented; the trap charts are labelled illustrative.",
    code: `import numpy as np

# ---- 1) Cohen's d = (mean1 - mean2) / pooled SD ----
mean1, mean2, sp = 78.0, 72.0, 12.0
d = (mean1 - mean2) / sp
print("Cohen's d =", d)                 # 0.5  (medium)
# d=0.5 means the bell curves are half an SD apart; d=1.5 -> 1.5 SDs apart

# ---- 2) eta-squared (variance explained) for 3 groups ----
g1 = np.array([72, 75, 78, 81, 74])     # teaching method A  (mean 76)
g2 = np.array([80, 83, 79, 85, 78])     # method B           (mean 81)
g3 = np.array([88, 91, 86, 90, 85])     # method C           (mean 88)
allv = np.concatenate([g1, g2, g3]); grand = allv.mean()
groups = [g1, g2, g3]
ss_between = sum(len(g) * (g.mean() - grand) ** 2 for g in groups)
ss_within  = sum(((g - g.mean()) ** 2).sum() for g in groups)
ss_total   = ((allv - grand) ** 2).sum()
eta2 = ss_between / ss_total
k, N = 3, len(allv)
ms_within = ss_within / (N - k)
omega2 = (ss_between - (k - 1) * ms_within) / (ss_total + ms_within)
print("SS_between, within, total:", round(ss_between,1), round(ss_within,1), round(ss_total,1))
print("eta^2 =", round(eta2, 3), " omega^2 =", round(omega2, 3))  # 0.768, 0.715

# ---- 3) odds ratio vs risk ratio from a 2x2 table ----
a, b, c, d2 = 40, 10, 20, 30            # exposed +/-,  unexposed +/-
risk_exp, risk_unexp = a / (a + b), c / (c + d2)   # 0.80, 0.40
rr = risk_exp / risk_unexp             # risk ratio  = 2.0
od = (a * d2) / (b * c)                # odds ratio  = 6.0
print("risk ratio =", rr, " odds ratio =", od)     # 2.0, 6.0

# ---- 4) correlation r as an effect size ----
hours = np.array([1,2,2,3,4,4,5,6,7,8,3,5,6,2])
score = np.array([55,52,61,58,72,64,70,68,82,85,60,75,71,57])
r = np.corrcoef(hours, score)[0, 1]
print("r =", round(r, 3), " r^2 =", round(r**2, 3))  # 0.923, 0.852
# r^2 = 0.85 -> the straight-line fit explains 85% of the score variance`
  };
})();
