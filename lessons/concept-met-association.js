/* =====================================================================
   METRICS & EVALUATION LESSON (BEGINNER)
   met-association — Measuring how two variables relate
   (correlation & association). Self-contained: registers the lesson,
   its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-association",
    title: "Measuring how two variables relate (correlation & association)",
    tagline: "How strongly do two things move together — and which number to trust for which kind of relationship.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["prob-covariance-correlation", "prob-normal"],

    whenToUse:
      `<p><b>Reach for an association measure whenever you ask "do these two columns move together?"</b> — feature versus target before modeling, two features that might be redundant, a treatment versus an outcome. But the <i>right</i> number depends on the kind of relationship and the kind of data, so match the tool to the question:</p>
       <ul>
         <li><b>Pearson correlation $r$</b> — two <b>continuous</b> columns and you only care about a <b>straight-line</b> (linear) trend. The default, but blind to curves.</li>
         <li><b>Spearman's $\\rho$ (rho) or Kendall's $\\tau$ (tau)</b> — the relationship is <b>monotonic</b> (always rising or always falling) but maybe curved, or the data is <b>ordinal</b> (ranked: small/medium/large), or has outliers. They work on <b>ranks</b>, so curves and outliers don't fool them.</li>
         <li><b>Point-biserial</b> — one column is <b>binary</b> (0/1) and the other is continuous (e.g. "clicked?" vs "time on page").</li>
         <li><b>Phi coefficient $\\phi$, Cramér's V, Tschuprow's T</b> — <b>both</b> columns are <b>categorical</b> (color, country, plan type). Phi is for 2×2; Cramér's V and Tschuprow's T generalize to bigger tables.</li>
         <li><b>Mutual Information (MI), Maximal Information Coefficient (MIC), distance correlation</b> — you suspect a <b>nonlinear</b> or weird dependence that $r$ would miss. These catch any kind of relationship, linear or not.</li>
         <li><b>Partial &amp; semi-partial correlation</b> — you want the link between two variables <b>after removing the effect of a third</b> (a confounder).</li>
         <li><b>Intraclass Correlation Coefficient (ICC)</b> — measurements grouped into clusters (raters, hospitals, repeated readings); how much agreement / reliability is there within a group.</li>
         <li><b>Variance Inflation Factor (VIF)</b> — a diagnostic, not a pairwise score: it flags <b>multicollinearity</b> (a feature explained by the <i>other</i> features together) before fitting a regression.</li>
       </ul>
       <p><b>The golden rule:</b> a number near zero from $r$ means "no <i>straight-line</i> trend", <b>not</b> "no relationship". And any non-zero number means "they move together", <b>not</b> "one causes the other". Correlation is not causation.</p>`,

    application:
      `<p>Association measures are everywhere in the first hour of a project. <b>Feature selection / EDA:</b> rank each feature by its correlation or MI with the target to see what might matter. <b>De-duplication:</b> a correlation heatmap of all features reveals near-twins so you can drop one. <b>Regression diagnostics:</b> VIF tells you which predictors are tangled together and will make your coefficients unstable. <b>A/B and observational analysis:</b> partial correlation strips out a confounder so a spurious link doesn't fool you. <b>Measurement / annotation:</b> ICC scores how much two human raters (or two repeated lab readings) actually agree. <b>Survey and product data:</b> Spearman and Cramér's V handle the ordinal ("rate 1–5") and categorical columns that Pearson can't touch.</p>`,

    pitfalls:
      `<ul>
         <li><b>Pearson misses everything that isn't a straight line.</b> Tell: $r\\approx 0$ on a clearly U-shaped or curved scatter. A parabola $y=x^2$ over a symmetric range has Pearson $r\\approx 0$ yet a perfect relationship. <i>Fix:</i> always plot the scatter; add Spearman, distance correlation, or MI to catch curves.</li>
         <li><b>Anscombe's quartet — the same $r$, four totally different stories.</b> Four tiny datasets share the same mean, variance, and $r=0.816$, yet one is a clean line, one a curve, one a line dragged by a single outlier, and one is held up by one point. <i>Fix:</i> never report a correlation without looking at the picture.</li>
         <li><b>One outlier can fake (or hide) a correlation.</b> A single extreme point can drag $r$ from 0 to 0.9 or back. <i>Fix:</i> use rank-based Spearman/Kendall, which are robust to outliers, and check how $r$ changes if you drop the suspect point.</li>
         <li><b>Correlation is not causation.</b> Ice-cream sales correlate with drownings (both driven by summer heat — a <i>confounder</i>). <i>Fix:</i> use partial correlation to remove the confounder, and reserve causal claims for experiments or proper causal methods.</li>
         <li><b>High VIF makes regression coefficients unstable.</b> Tell: huge standard errors and coefficients that flip sign when you add or drop a feature. A VIF above ~5–10 means a predictor is largely explained by the others. <i>Fix:</i> drop or combine the redundant features, or use regularization (ridge).</li>
         <li><b>Mutual Information is hard to estimate from small samples.</b> MI and MIC need enough data to fill the bins / neighborhoods; on a few dozen rows they report spurious dependence. <i>Fix:</i> prefer simpler measures on small data, and treat MI estimates as noisy.</li>
         <li><b>Cramér's V is biased upward on sparse tables.</b> With many categories and few counts per cell it reads high by chance. <i>Fix:</i> use the bias-corrected version, or Tschuprow's T which normalizes differently across table shapes.</li>
       </ul>`,

    bigIdea:
      `<p>Two columns are <b>associated</b> if knowing one tells you something about the other. "How much?" is a single number, usually scaled so that <b>0 = no relationship</b> and <b>±1 = a perfect one</b> (sign tells you the direction for the signed measures).</p>
       <p>The catch: there are many <i>kinds</i> of "move together". A <b>straight-line</b> trend, a <b>curved-but-always-rising</b> trend, a <b>category-to-category</b> link, an <b>any-shape</b> dependence. No single number captures all of them, so you have a small toolbox and pick by the data type and the shape you expect.</p>
       <p>The most famous tool, <b>Pearson's $r$</b>, only sees <i>straight lines</i>. That is the one mental model to fix first: a Pearson $r$ of zero rules out a line, not a relationship.</p>`,

    buildup:
      `<p>Start from <b>covariance</b>: do $X$ and $Y$ tend to be above their averages at the same time? Covariance is positive if yes, negative if opposite, but its size depends on the units (dollars vs cents change the number).</p>
       <p><b>Pearson's $r$</b> fixes the units problem by dividing covariance by both standard deviations — now it always sits in $[-1, 1]$. It measures the <i>straight-line</i> fit only.</p>
       <p>To see <b>curves</b>, replace the raw values with their <b>ranks</b> (1st smallest, 2nd smallest, …) and run the same formula: that's <b>Spearman's $\\rho$</b>. Ranks turn any always-rising curve into a perfect straight line, so $\\rho=1$ for any monotonic relationship. <b>Kendall's $\\tau$</b> counts agreeing vs disagreeing pairs instead — same monotonic idea, more robust on small samples.</p>
       <p>For <b>categories</b> there is no "above average", so we measure association through a <b>contingency table</b> and a chi-square statistic ($\\chi^2$): <b>Cramér's V</b> rescales $\\chi^2$ into $[0,1]$. For <b>any-shape</b> dependence we measure how much one variable <i>reduces uncertainty</i> about the other: that's <b>Mutual Information</b>.</p>`,

    symbols: [
      { sym: "$X, Y$", desc: "the two columns (variables) whose relationship we measure." },
      { sym: "$n$", desc: "the number of paired observations (rows)." },
      { sym: "$\\bar X, \\bar Y$", desc: "the sample means (averages) of $X$ and $Y$." },
      { sym: "$s_X, s_Y$", desc: "the sample standard deviations — how spread out each column is." },
      { sym: "$\\operatorname{cov}(X,Y)$", desc: "covariance: the average of $(X-\\bar X)(Y-\\bar Y)$; positive when they rise together." },
      { sym: "$r$", desc: "Pearson correlation: covariance divided by both standard deviations; the strength of a straight-line trend, in $[-1,1]$." },
      { sym: "$\\rho$", desc: "Spearman's rho: Pearson's $r$ computed on the ranks; strength of any monotonic (always-rising or always-falling) trend." },
      { sym: "$d_i$", desc: "the difference in ranks of $X_i$ and $Y_i$, used by Spearman's shortcut formula." },
      { sym: "$\\tau$", desc: "Kendall's tau: (concordant minus discordant pairs) over total pairs; another rank/monotonic measure." },
      { sym: "$\\chi^2$", desc: "the chi-square statistic from a contingency table; how far observed category counts are from 'no association'." },
      { sym: "$\\phi$", desc: "phi coefficient: correlation for two binary (0/1) variables, $\\phi=\\sqrt{\\chi^2/n}$ on a 2×2 table." },
      { sym: "$V$", desc: "Cramér's V: $\\chi^2$ rescaled to $[0,1]$ for tables of any size; categorical-vs-categorical association." },
      { sym: "$k, m$", desc: "the number of categories (rows, columns) of the two categorical variables." },
      { sym: "$I(X;Y)$", desc: "Mutual Information: how many bits of uncertainty about $Y$ are removed by knowing $X$ (0 = independent); catches nonlinear links." }
    ],

    formula: `$$ r=\\frac{\\operatorname{cov}(X,Y)}{s_X\\, s_Y}=\\frac{\\sum_i (X_i-\\bar X)(Y_i-\\bar Y)}{\\sqrt{\\sum_i (X_i-\\bar X)^2}\\,\\sqrt{\\sum_i (Y_i-\\bar Y)^2}} $$
$$ \\rho = r_{\\text{on ranks}} = 1-\\frac{6\\sum_i d_i^2}{n(n^2-1)}, \\qquad \\tau=\\frac{(\\#\\text{concordant})-(\\#\\text{discordant})}{\\binom{n}{2}} $$
$$ \\phi=\\sqrt{\\tfrac{\\chi^2}{n}}, \\qquad V=\\sqrt{\\frac{\\chi^2}{n\\,\\min(k-1,\\,m-1)}}, \\qquad I(X;Y)=\\sum_{x,y} p(x,y)\\,\\log\\frac{p(x,y)}{p(x)\\,p(y)} $$`,

    whatItDoes:
      `<p><b>Pearson $r$</b> (top line) takes covariance — the average co-movement of $X$ and $Y$ around their means — and divides out both spreads so the result is unit-free and lands in $[-1,1]$. It is exactly how well a <i>straight line</i> fits the cloud: $+1$ perfect up-line, $-1$ perfect down-line, $0$ no line.</p>
       <p><b>Spearman $\\rho$ and Kendall $\\tau$</b> (middle line) ask the same "do they move together?" but about <i>order</i>, not exact values. $\\rho$ is just Pearson run on the ranks (the shortcut formula uses $d_i$, the rank gaps). $\\tau$ counts pairs: for two rows, if both $X$ and $Y$ agree on which is bigger that pair is <b>concordant</b> (+1), otherwise <b>discordant</b> (−1). Both equal $+1$ for <i>any</i> always-rising curve, so they see relationships $r$ misses.</p>
       <p><b>Categorical &amp; nonlinear</b> (bottom line). For categories there are no means, so we count cells in a contingency table and measure the chi-square distance $\\chi^2$ from independence. <b>$\\phi$</b> rescales it for a 2×2 table; <b>Cramér's V</b> for any table (divide by $n$ and the smaller dimension so it lands in $[0,1]$); <b>Tschuprow's T</b> is the same idea but divides by $\\sqrt{(k-1)(m-1)}$, which behaves better when the table isn't square. <b>Mutual Information $I(X;Y)$</b> measures, in bits, how much knowing $X$ shrinks your uncertainty about $Y$ — it is $0$ exactly when they are independent and grows with <i>any</i> kind of dependence.</p>
       <p><b>The rest of the toolbox, in words.</b> <b>Point-biserial</b> is literally Pearson $r$ with one variable coded 0/1 — the correlation between a yes/no flag and a number. <b>Distance correlation</b> compares the pattern of pairwise <i>distances</i> in $X$ to those in $Y$; it is $0$ <i>only</i> when $X$ and $Y$ are truly independent, so unlike $r$ it detects nonlinear dependence too. The <b>MIC (Maximal Information Coefficient)</b> searches over grids to find the binning that maximizes a normalized mutual information, giving one $[0,1]$ score for relationships of many shapes. <b>Partial correlation</b> is the correlation of $X$ and $Y$ <i>after</i> regressing a third variable $Z$ out of both (removing the confounder from each); <b>semi-partial</b> removes $Z$ from only one side. <b>ICC (Intraclass Correlation Coefficient)</b> compares the variance <i>between</i> groups to the total variance — high ICC means measurements within a group (e.g. two raters on the same item) agree. <b>VIF</b> for feature $j$ is $1/(1-R_j^2)$, where $R_j^2$ is how well the <i>other</i> features predict feature $j$ in a regression; a big VIF means that feature is redundant (multicollinear).</p>`,

    derivation:
      `<p><b>Why Pearson $r$ measures a straight line.</b></p>
       <ul class="steps">
         <li>Center both columns: $u_i=X_i-\\bar X$, $v_i=Y_i-\\bar Y$. Now the question is whether $u$ and $v$ point the same way.</li>
         <li>Their dot product $\\sum_i u_i v_i$ is positive when large $u$ pairs with large $v$ (co-movement). That is covariance (up to a constant).</li>
         <li>By the Cauchy–Schwarz inequality, $|\\sum u_i v_i| \\le \\sqrt{\\sum u_i^2}\\sqrt{\\sum v_i^2}$, with equality <i>only</i> when $v_i = c\\,u_i$ for a constant $c$ — i.e. when $Y$ is an exact linear function of $X$.</li>
         <li>So dividing the dot product by those two lengths gives a ratio in $[-1,1]$ that hits $\\pm 1$ exactly for a perfect straight line. That ratio <i>is</i> $r$. This is why $r$ is fundamentally a <b>linear</b> measure — equality in Cauchy–Schwarz is a linear condition.</li>
       </ul>
       <p><b>Why Spearman sees curves.</b> Replace each value by its rank. Any always-rising curve (say $Y=X^3$) maps the $i$-th smallest $X$ to the $i$-th smallest $Y$, so the <i>ranks</i> line up perfectly even though the raw values don't. Pearson on those ranks is then exactly $+1$. Curves become lines once you look at order. $\\blacksquare$</p>
       <p><b>Why Cramér's V lands in $[0,1]$.</b> For a contingency table, $\\chi^2$ can grow with $n$ and the table size, so it has no natural ceiling. The largest possible $\\chi^2$ is $n\\cdot\\min(k-1, m-1)$ (perfect association in a $k\\times m$ table). Dividing by that maximum and taking the square root forces $V$ into $[0,1]$, where $1$ means each row category determines the column category.</p>`,

    example:
      `<p><b>The whole point in five numbers.</b> Take $X=[1,2,3,4,5]$ and $Y=[1,4,9,16,25]$ — that is $Y=X^2$, a perfect (but curved) relationship that is also always rising.</p>
       <ul class="steps">
         <li><b>Pearson $r$.</b> Center and apply the formula. Because the curve bends, the straight-line fit is good but not perfect: $r\\approx 0.981$. Close to 1, yet it has already <i>lost</i> information — it can't tell this from a slightly noisy line.</li>
         <li><b>Spearman $\\rho$.</b> Rank both: $X$ ranks are $[1,2,3,4,5]$ and $Y$ ranks are also $[1,2,3,4,5]$ (since $Y$ rises with $X$). The rank gaps are all $d_i=0$, so $\\rho = 1-\\frac{6\\cdot 0}{5(25-1)} = 1$. <b>Perfect.</b></li>
         <li><b>Kendall $\\tau$.</b> Every one of the $\\binom{5}{2}=10$ pairs is concordant (both rise together), none discordant, so $\\tau = \\frac{10-0}{10} = 1$. Also perfect.</li>
         <li><b>The lesson:</b> the relationship is exact and monotonic, yet Pearson reports $0.981$ while Spearman and Kendall report $1.0$. For a curved-but-rising relationship, the rank measures are the honest ones — Pearson only ever sees the straight-line shadow.</li>
       </ul>
       <p><b>A categorical mini-example (Cramér's V).</b> Suppose a 2×2 table of {weather: sunny/rainy} vs {umbrella: yes/no} gives $\\chi^2 = 20$ on $n=100$ people. Then $\\phi = V = \\sqrt{20/100} = \\sqrt{0.2} \\approx 0.45$ — a moderate association between weather and carrying an umbrella, with no means or straight lines involved at all.</p>`,

    demo: function (host) {
      var c = (function () {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      })();
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 380; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      // shapes: each returns {x:[], y:[]} on roughly [-1,1] range
      var shapes = {
        line: function (xs) { return xs.map(function (x) { return 0.85 * x; }); },
        curveU: function (xs) { return xs.map(function (x) { return 1.4 * x * x - 0.7; }); },
        monoCurve: function (xs) { return xs.map(function (x) { return Math.sign(x) * Math.pow(Math.abs(x), 0.4) * 0.9; }); },
        cloud: function (xs) { return xs.map(function () { return 0; }); }
      };

      var N = 60;
      var baseX = [];
      (function () { var seed = 7; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; } for (var i = 0; i < N; i++) baseX.push(2 * rnd() - 1); })();

      function buildData(kind) {
        var seed = 99; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
        var xs = baseX.slice();
        var ys;
        if (kind === "cloud") { ys = xs.map(function () { return 2 * rnd() - 1; }); }
        else { ys = shapes[kind](xs).map(function (v) { return v + 0.12 * (2 * rnd() - 1); }); }
        return { x: xs, y: ys };
      }

      function pearson(x, y) {
        var n = x.length, mx = 0, my = 0; for (var i = 0; i < n; i++) { mx += x[i]; my += y[i]; } mx /= n; my /= n;
        var sxy = 0, sxx = 0, syy = 0;
        for (var j = 0; j < n; j++) { var dx = x[j] - mx, dy = y[j] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
        if (sxx === 0 || syy === 0) return 0;
        return sxy / Math.sqrt(sxx * syy);
      }
      function ranks(a) {
        var idx = a.map(function (v, i) { return [v, i]; }); idx.sort(function (p, q) { return p[0] - q[0]; });
        var r = new Array(a.length); for (var i = 0; i < idx.length; i++) r[idx[i][1]] = i + 1; return r;
      }
      function spearman(x, y) { return pearson(ranks(x), ranks(y)); }

      var kind = "curveU";
      var W = 640, H = 380, padL = 40, padR = 16, padT = 16, padB = 30;
      function PX(x) { return padL + (x + 1.2) / 2.4 * (W - padL - padR); }
      function PY(y) { return (H - padB) - (y + 1.6) / 3.2 * (H - padT - padB); }

      function draw() {
        var d = buildData(kind);
        var r = pearson(d.x, d.y), rho = spearman(d.x, d.y);
        ctx.clearRect(0, 0, W, H);
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, PY(0)); ctx.lineTo(W - padR, PY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PX(0), padT); ctx.lineTo(PX(0), H - padB); ctx.stroke();
        // points
        ctx.fillStyle = c.accent;
        for (var i = 0; i < d.x.length; i++) { ctx.beginPath(); ctx.arc(PX(d.x[i]), PY(d.y[i]), 3, 0, Math.PI * 2); ctx.fill(); }
        readout.innerHTML = "Same scatter, two verdicts. <b>Pearson r = " + r.toFixed(2) + "</b> (straight-line strength) vs <b>Spearman ρ = " + rho.toFixed(2) + "</b> (monotonic / rank strength). On the U-shape and the random cloud, r is near 0. On the rising curve, r is below ρ — Pearson misses the curve that the rank measure catches.";
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      function mkBtn(label, k) { var b = document.createElement("button"); b.style.cssText = "padding:5px 10px;margin-right:6px;border-radius:6px;border:1px solid " + c.border + ";background:" + c.panel + ";color:" + c.ink + ";cursor:pointer;"; b.textContent = label; b.addEventListener("click", function () { kind = k; draw(); }); return b; }
      row.appendChild(mkBtn("straight line", "line"));
      row.appendChild(mkBtn("U-shape (curve)", "curveU"));
      row.appendChild(mkBtn("rising curve", "monoCurve"));
      row.appendChild(mkBtn("random cloud", "cloud"));
      host.appendChild(row); host.appendChild(readout);
      draw();
    },

    practice: [
      {
        q: `You plot feature X against the target Y and the scatter is a clear smile-shaped (U) curve, but <code>scipy.stats.pearsonr</code> returns r ≈ 0.02. A teammate concludes "X is useless, drop it." Are they right?`,
        steps: [
          { do: `Recall what Pearson r measures.`, why: `r is the strength of a <i>straight-line</i> trend only. A symmetric U-shape has no net linear slope, so r ≈ 0 even though the relationship is strong.` },
          { do: `Reach for a measure that sees curves.`, why: `Distance correlation or Mutual Information (MI) detect any-shape dependence; Spearman catches monotonic ones (but a U is not monotonic, so even Spearman would be low here).` },
          { do: `Confirm visually.`, why: `The scatter already shows the structure — this is exactly the Anscombe's-quartet lesson: never trust r without the picture.` }
        ],
        answer: `<p>No. Pearson $r\\approx 0$ only rules out a <b>straight-line</b> trend, not a relationship. The U-shape is a real (nonlinear) dependence that $r$ is structurally blind to. Keep the feature: confirm with <b>distance correlation</b> or <b>Mutual Information</b> (both pick up the U), and consider a nonlinear model or a squared term. Spearman would also be low here because a U is not monotonic, which is itself the clue that the link is curved, not absent.</p>`
      },
      {
        q: `In a regression you find that two predictors, "height in cm" and "height in inches" (someone added both), each have a sensible correlation with the target, but the fitted coefficients are huge, opposite in sign, and flip when you refit. Which diagnostic catches this and what's the fix?`,
        steps: [
          { do: `Name the problem.`, why: `The two columns are near-perfect linear copies of each other — extreme multicollinearity. Pairwise correlation between them is ~1.` },
          { do: `Compute VIF.`, why: `The Variance Inflation Factor for each is $1/(1-R_j^2)$ with $R_j^2\\approx 1$, so VIF explodes (→ very large), flagging the redundancy that pairwise correlation alone might understate across many features.` },
          { do: `Remove the redundancy.`, why: `Drop one column (or combine them), or use ridge regression, to stabilize the coefficients.` }
        ],
        answer: `<p><b>VIF (Variance Inflation Factor)</b> catches it: with one feature almost perfectly predicted by the other, $R_j^2\\to 1$ and $\\text{VIF}=1/(1-R_j^2)\\to\\infty$ (well past the ~5–10 warning line). High multicollinearity inflates the coefficient standard errors, which is why the estimates are huge, sign-flipping, and unstable. <b>Fix:</b> drop one of the duplicate columns (or merge them), or apply ridge regularization. VIF is the right tool because it measures a feature against <i>all</i> the others jointly, not just one pair at a time.</p>`
      },
      {
        q: `A report claims "cities with more firefighters have more fire damage, so firefighters cause damage." Both columns are continuous and Pearson r = 0.8. What measure would you compute to challenge the causal claim, and what is the likely real story?`,
        steps: [
          { do: `Separate correlation from causation.`, why: `A strong $r$ only says the two move together; it says nothing about cause. A lurking third variable (confounder) can drive both.` },
          { do: `Identify the confounder.`, why: `City <b>size</b> drives both: bigger cities have more firefighters AND more (and bigger) fires.` },
          { do: `Use partial correlation.`, why: `Partial correlation of firefighters and damage <i>controlling for city size</i> removes the confounder's effect from both; if the link collapses toward 0, firefighters weren't the driver.` }
        ],
        answer: `<p>Compute the <b>partial correlation</b> between firefighters and damage while <b>controlling for city size</b> (regress city size out of both columns, then correlate the residuals). The original $r=0.8$ is almost certainly <b>confounded</b>: larger cities have both more firefighters and more fire damage. After removing city size, the partial correlation should drop sharply toward 0, showing the firefighter–damage link was spurious. This is the textbook "correlation is not causation" trap, and partial correlation is the tool that exposes the lurking variable.</p>`
      }
    ]
  });

  window.CODE["met-association"] = {
    lib: "scipy / scikit-learn / statsmodels",
    runnable: false,
    explain: `<p>The real practitioner toolbox: <code>scipy.stats</code> for Pearson / Spearman / Kendall / point-biserial, <code>pandas.crosstab</code> + <code>scipy.stats.chi2_contingency</code> for Cramér's V (categorical), <code>sklearn.feature_selection.mutual_info_*</code> for Mutual Information, and <code>statsmodels</code> for the Variance Inflation Factor (multicollinearity).</p>`,
    code: `import numpy as np
import pandas as pd
from scipy import stats
from sklearn.datasets import load_wine
from sklearn.feature_selection import mutual_info_classif
from statsmodels.stats.outliers_influence import variance_inflation_factor

wine = load_wine(as_frame=True)
df = wine.frame                      # 13 continuous features + 'target' (3 classes)

# --- 1) Pearson (linear), Spearman & Kendall (monotonic/rank) ---
x = df["alcohol"].values
y = df["proline"].values
print("Pearson  r:", stats.pearsonr(x, y))      # straight-line strength
print("Spearman p:", stats.spearmanr(x, y))     # monotonic strength (on ranks)
print("Kendall  t:", stats.kendalltau(x, y))    # concordant vs discordant pairs

# --- 2) point-biserial: a binary flag vs a continuous column ---
is_class0 = (df["target"] == 0).astype(int).values
print("point-biserial:", stats.pointbiserialr(is_class0, df["flavanoids"].values))

# --- 3) Mutual Information of every feature with the target (nonlinear-aware) ---
X = wine.data.values
mi = mutual_info_classif(X, wine.target.values, random_state=0)
mi = pd.Series(mi, index=wine.feature_names).sort_values(ascending=False)
print("\\nMutual information with target:\\n", mi.round(3).head(6))

# --- 4) Cramer's V for two CATEGORICAL columns (bin features into categories) ---
def cramers_v(a, b):
    table = pd.crosstab(a, b)
    chi2 = stats.chi2_contingency(table)[0]
    n = table.values.sum()
    k, m = table.shape
    return np.sqrt(chi2 / (n * (min(k, m) - 1)))      # in [0, 1]

alc_bin = pd.qcut(df["alcohol"], 3, labels=["low", "mid", "high"])
print("\\nCramer's V (alcohol-bin vs wine class):",
      round(cramers_v(alc_bin, df["target"]), 3))

# --- 5) Variance Inflation Factor: diagnose multicollinearity before regression ---
feats = df[["alcohol", "flavanoids", "color_intensity", "hue",
            "od280/od315_of_diluted_wines", "proline"]].copy()
feats["const"] = 1.0                                  # statsmodels needs an intercept
vif = pd.Series(
    [variance_inflation_factor(feats.values, i) for i in range(feats.shape[1] - 1)],
    index=feats.columns[:-1])
print("\\nVIF (>5-10 => multicollinear):\\n", vif.round(2))

# scikit-learn / scipy also offer: distance correlation via dcor,
# MIC via the 'minepy' package, and partial correlation via 'pingouin'.`
  };

  window.CODEVIZ["met-association"] = {
    question: "Each association measure sees a DIFFERENT kind of 'move together' — and the SAME number can hide very different scatters. How does Pearson r read a clean cloud, when does it agree with Spearman, and what failure shapes (a U it misses, one outlier faking r, a fan of changing spread) must you eyeball before trusting any single number?",
    charts: [
      {
        type: "scatter",
        title: "Healthy case — Pearson r = cov/(sX sY): a NOISY LINE, r = 0.98 (line fits the cloud)",
        xlabel: "X",
        ylabel: "Y",
        groups: [
          { name: "data (8 points)", color: "#7ee787", points: [[1, 2], [2, 2.5], [3, 4], [4, 3.8], [5, 5.5], [6, 6], [7, 6.5], [8, 8]] }
        ],
        lines: [
          { name: "least-squares fit", color: "#ffb454", points: [[1, 1.88], [8, 7.69]] }
        ],
        interpret: "<b>The ideal Pearson scatter.</b> The horizontal axis is X, the vertical is Y, each dot is one row. The dots rise together along the orange least-squares line, so Pearson <b>r = 0.98</b> — close to the +1 ceiling. Here r is trustworthy because the shape really IS a straight line: the number and the picture agree. This is the case every other chart below is a warning against assuming."
      },
      {
        type: "scatter",
        title: "Monotonic curve — Pearson vs Spearman on Y = X^2 (rising): r = 0.98 but rho = tau = 1.00",
        xlabel: "X",
        ylabel: "Y",
        groups: [
          { name: "Y = X^2", color: "#4ea1ff", points: [[1, 1], [2, 4], [3, 9], [4, 16], [5, 25]] }
        ],
        lines: [
          { name: "best straight line", color: "#ffb454", dash: true, points: [[1, -1], [5, 23]] }
        ],
        interpret: "<b>When the rank measure is the honest one.</b> The dots bend upward — a perfect always-rising curve, not a line. Pearson still reads <b>r = 0.98</b> (it forces the dashed straight line through a curve and so loses a little), but because the order of X matches the order of Y exactly, <b>Spearman rho = Kendall tau = 1.00</b>. Read it as: r below rho is the fingerprint of a curve. Trust the rank number here."
      },
      {
        type: "scatter",
        title: "What you might also see #1 — U-shape: r = 0.00 AND rho = 0.00, yet a perfect link",
        xlabel: "X",
        ylabel: "Y",
        groups: [
          { name: "Y = X^2 (U)", color: "#ff7b72", points: [[-3, 9], [-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4], [3, 9]] }
        ],
        lines: [
          { name: "fitted line (flat)", color: "#ffb454", points: [[-3, 4], [3, 4]] }
        ],
        interpret: "<b>Failure mode: the relationship r is structurally blind to.</b> The dots form a clear smile (U), so Y is fully determined by X — yet the falling-then-rising shape has no net slope, so the fitted line is flat and <b>r = 0.00</b>. Spearman is also 0.00 because a U is not monotonic. Recognise it by: a strong visible shape but near-zero r AND rho together. Conclusion: r near 0 rules out a LINE, never a relationship — reach for Mutual Information or distance correlation, which both light up here."
      },
      {
        type: "scatter",
        title: "What you might also see #2 — ONE outlier fakes r: cloud has r=0.0, add 1 point -> r=0.82",
        xlabel: "X",
        ylabel: "Y",
        groups: [
          { name: "random cloud (r approx 0)", color: "#9aa7b4", points: [[1, 5], [1.5, 4.5], [2, 5.3], [2.2, 4.7], [1.8, 5.1], [2.5, 4.6], [1.3, 5.2], [2.1, 4.9]] },
          { name: "single outlier", color: "#ff7b72", points: [[9, 12]] }
        ],
        lines: [
          { name: "fit dragged by the outlier", color: "#ffb454", dash: true, points: [[1, 4.2], [9, 11.4]] }
        ],
        interpret: "<b>Failure mode: a single point inventing a correlation.</b> The grey blob on the left has no trend on its own (Pearson r about 0). Add the one red point far to the upper-right and Pearson jumps to <b>r = 0.82</b> — the dashed line is chasing that lone leverage point, not the blob. Illustrative numbers, but the effect is real and exactly the Anscombe trap. Spot it by: most of the data is a structureless cluster with one extreme point doing all the work. Fix: use rank-based Spearman/Kendall (robust to outliers) and re-check r with the suspect point dropped."
      },
      {
        type: "scatter",
        title: "What you might also see #3 — heteroscedastic FAN: r=0.9 but the link is unreliable, not constant",
        xlabel: "X",
        ylabel: "Y",
        groups: [
          { name: "spread grows with X", color: "#ffb454", points: [[1, 1.1], [1, 0.9], [2, 2.3], [2, 1.7], [3, 3.6], [3, 2.4], [4, 5.2], [4, 2.8], [5, 7.1], [5, 2.9], [6, 9.0], [6, 3.0]] }
        ],
        lines: [
          { name: "least-squares fit", color: "#4ea1ff", points: [[1, 0.5], [6, 6.5]] }
        ],
        interpret: "<b>Failure mode: a single r hiding changing spread.</b> The dots fan out — tight on the left, widely scattered on the right. Pearson still reports a high <b>r approx 0.9</b> because the cloud trends up overall, but the relationship is far noisier at large X than the one number admits (illustrative shape). Recognise it by: a triangular/funnel cloud. Conclusion: r summarises average straight-line strength only; it cannot tell you the link is dependable for small X and loose for large X — always look, and consider modelling the variance too."
      },
      {
        type: "heatmap",
        title: "Pearson correlation matrix of 6 load_wine features (real computed r values)",
        rows: ["alcohol", "flavanoids", "color_int", "hue", "od280", "proline"],
        cols: ["alcohol", "flavanoids", "color_int", "hue", "od280", "proline"],
        matrix: [
          [1.00, 0.24, 0.55, -0.07, 0.07, 0.64],
          [0.24, 1.00, -0.17, 0.54, 0.79, 0.49],
          [0.55, -0.17, 1.00, -0.52, -0.43, 0.32],
          [-0.07, 0.54, -0.52, 1.00, 0.57, 0.24],
          [0.07, 0.79, -0.43, 0.57, 1.00, 0.31],
          [0.64, 0.49, 0.32, 0.24, 0.31, 1.00]
        ],
        showVals: true,
        interpret: "<b>Reading a correlation matrix for de-duplication.</b> Each cell is the Pearson r between the row feature and the column feature; the diagonal is always 1.00 (a feature with itself). Bright warm cells = strong positive r, dark/cool = strong negative. flavanoids vs od280 (<b>r = 0.79</b>) are near-twins — candidates to drop one before modelling. color_int vs hue (<b>r = -0.52</b>) move oppositely. alcohol vs hue (<b>r = -0.07</b>) only rules out a straight line, not a curved link. Scan the off-diagonal for high-magnitude cells to find redundant features."
      },
      {
        type: "bars",
        title: "Categorical association — chi-square on weather x umbrella: 4 cells each add 4.0 -> chi2 = 16, Cramer's V = 0.40",
        xlabel: "contingency cell (observed O, expected E)",
        ylabel: "(O - E)^2 / E",
        labels: ["sunny,yes O35 E25", "sunny,no O15 E25", "rainy,yes O15 E25", "rainy,no O35 E25", "TOTAL chi2"],
        values: [4.0, 4.0, 4.0, 4.0, 16.0],
        valueLabels: ["4.0", "4.0", "4.0", "4.0", "16.0"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"],
        interpret: "<b>How association works with no means or lines.</b> For two categorical columns there is no 'above average', so we count people in each cell of the 2x2 table and compare observed O to the count E expected if weather and umbrella were independent (here E = 25 everywhere). Each blue bar is one cell's mismatch (O-E)^2/E = (35-25)^2/25 = 4.0; the green TOTAL bar sums them to <b>chi2 = 16</b>. Rescaling, Cramer's V = sqrt(16/(100*1)) = <b>0.40</b> — a moderate weather-umbrella link on a 0-to-1 scale. Bigger bars mean cells further from independence."
      },
      {
        type: "bars",
        title: "Any-shape dependence — mutual information of each wine feature with the wine-class target",
        xlabel: "feature",
        ylabel: "mutual information (bits)",
        labels: ["flavanoids", "proline", "color_int", "od280", "alcohol", "hue", "phenols", "proantho"],
        values: [0.666, 0.567, 0.552, 0.506, 0.473, 0.446, 0.404, 0.296],
        valueLabels: ["0.67", "0.57", "0.55", "0.51", "0.47", "0.45", "0.40", "0.30"],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"],
        interpret: "<b>Ranking features when the shape is unknown.</b> Each bar is the mutual information (in bits) between one wine feature and the class target — how much knowing the feature shrinks your uncertainty about the class, for a relationship of ANY shape (linear or curved). Taller = more informative. flavanoids (<b>0.67</b>) and proline (<b>0.57</b>) lead, so they are the strongest candidates to keep. Unlike Pearson r this never goes negative (no direction) and would still flag a U-shaped feature that r scores 0."
      }
    ],
    caption: "Chart set: one healthy case plus three 'what you might also see' failure shapes, then the categorical and any-shape tools. The first scatter (green) is the trustworthy case — a real line, r=0.98. The second shows r below rho is the fingerprint of a curve. The three red/orange variants are the traps: a U-shape r=rho=0 cannot see, a single outlier dragging r from 0 to 0.82, and a heteroscedastic fan where one high r hides changing spread — all reasons to PLOT before trusting a number (the Anscombe lesson). The heatmap reads off near-twin features for de-duplication; the chi-square bars build Cramer's V=0.40 for categories; the MI bars rank features by any-shape dependence.",
    code: `import numpy as np
from scipy import stats
from sklearn.datasets import load_wine
from sklearn.feature_selection import mutual_info_classif

# --- scatter 1: Pearson r on a noisy line ---
x = np.array([1, 2, 3, 4, 5, 6, 7, 8])
y = np.array([2, 2.5, 4, 3.8, 5.5, 6, 6.5, 8])
print("noisy line  r =", round(stats.pearsonr(x, y)[0], 2))   # 0.98
m, b = np.polyfit(x, y, 1)                                     # least-squares line

# --- scatter 2 & 3: Pearson vs Spearman on a curve ---
xc = np.array([1, 2, 3, 4, 5]); yc = xc ** 2                   # rising curve
print("Y=X^2  r =", round(stats.pearsonr(xc, yc)[0], 3),       # 0.981
      " rho =", round(stats.spearmanr(xc, yc)[0], 2),          # 1.00
      " tau =", round(stats.kendalltau(xc, yc)[0], 2))         # 1.00
xu = np.array([-3, -2, -1, 0, 1, 2, 3]); yu = xu ** 2          # symmetric U
print("U-shape  r =", round(stats.pearsonr(xu, yu)[0], 2),     # 0.00
      " rho =", round(stats.spearmanr(xu, yu)[0], 2))          # 0.00

# --- bars: chi-square + Cramer's V on a 2x2 contingency table ---
table = np.array([[35, 15],     # sunny: umbrella yes / no
                  [15, 35]])    # rainy: umbrella yes / no
chi2, p, dof, exp = stats.chi2_contingency(table, correction=False)
n = table.sum(); k, mm = table.shape
terms = (table - exp) ** 2 / exp                              # each cell = 4.0
print("expected =", exp.tolist(), " per-cell (O-E)^2/E =", terms.round(1).tolist())
print("chi2 =", round(chi2, 1),                               # 16.0
      " Cramer's V =", round(np.sqrt(chi2 / (n * (min(k, mm) - 1))), 2))  # 0.40

# --- heatmap + MI bars on real wine data ---
wine = load_wine(); names = wine.feature_names
pick = ["alcohol", "flavanoids", "color_intensity", "hue",
        "od280/od315_of_diluted_wines", "proline"]
corr = np.corrcoef(wine.data[:, [names.index(p) for p in pick]].T)   # 6x6, diag 1.0
print(np.round(corr, 2))
mi = mutual_info_classif(wine.data, wine.target, random_state=0)
for i in np.argsort(mi)[::-1][:8]:
    print(f"{names[i]:>30s}  MI = {mi[i]:.3f}")`
  };
})();
