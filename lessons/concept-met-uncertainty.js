(function () {
  window.LESSONS.push({
    id: "met-uncertainty",
    title: "Scoring uncertainty & prediction intervals",
    tagline: "A good interval is two things at once: it COVERS the truth as often as promised, and it is as NARROW as possible.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-classification-metrics", "ml-roc-auc", "prob-normal", "prob-estimation", "skill-limitations"],
    whenToUse:
      `<p><b>Reach for these metrics whenever a prediction ships as a RANGE, not a single number.</b> A point forecast ("sales will be 1,000") hides how sure the model is. An interval ("sales will be 900 to 1,100, 90% sure") tells the planner how much buffer to keep. These metrics tell you whether that interval can be trusted.</p>
       <p><b>The one rule that governs everything here:</b> always judge an interval by COVERAGE <i>and</i> WIDTH together, never one alone. A super-wide interval covers everything but says nothing. A razor-thin interval looks confident but misses the truth. The art is narrow <i>and</i> still covering.</p>
       <ul>
         <li><b>Want a 90% interval that really covers 90% of the time?</b> Measure it with <b>PICP (Prediction Interval Coverage Probability)</b> and report the <b>MPIW (Mean Prediction Interval Width)</b> beside it.</li>
         <li><b>Predicting a specific quantile (e.g. the 90th percentile of demand)?</b> Score it with the <b>pinball loss</b> (also called quantile loss).</li>
         <li><b>Want a guarantee that holds for ANY model, with no assumption about the data's shape?</b> Use <b>conformal prediction</b> and report its achieved coverage and average set / interval size.</li>
         <li><b>Predicting a whole probability distribution, not just an interval?</b> Score it with <b>CRPS (Continuous Ranked Probability Score)</b>.</li>
         <li><b>Want a single number that rewards narrow intervals that still cover and punishes ones that miss?</b> Use the <b>Winkler / interval score</b>.</li>
       </ul>`,
    application:
      `<p><b>Forecasting:</b> demand, revenue, and energy-load forecasts almost always ship as intervals so planners can size safety stock and reserves; teams track PICP and MPIW on every horizon. <b>Weather and climate:</b> CRPS is the standard score for probabilistic forecasts (chance of rain, temperature distributions). <b>Healthcare and safety:</b> a length-of-stay or dosage model that emits a conformal interval with a coverage guarantee is far safer than a bare point estimate. <b>Finance:</b> Value-at-Risk and other risk numbers are quantile predictions, scored with pinball loss. <b>Any regression that feeds a human decision:</b> wrapping it in conformal prediction turns "my best guess is 42" into "the truth is in [30, 54] at least 90% of the time."</p>`,
    pitfalls:
      `<ul>
         <li><b>Reporting WIDTH without COVERAGE (or coverage without width).</b> The single most common mistake. "Our intervals are tight (MPIW 12)" is meaningless if they only cover 60% of the time. "We hit 90% coverage" is meaningless if the interval spans the whole range. <b>Fix:</b> always print PICP and MPIW on the same line, for the same intervals.</li>
         <li><b>Measuring coverage on the CALIBRATION set.</b> The data used to <i>build</i> the interval will always look optimistically well-covered. <b>Fix:</b> measure PICP on a fresh test split the interval never touched.</li>
         <li><b>Covering on AVERAGE but not per SEGMENT.</b> An interval can hit 90% overall while covering 99% of easy cases and 70% of hard ones. <b>Fix:</b> compute PICP within each segment (region, time bucket, class) — this is <i>conditional</i> coverage, and it is what users actually feel.</li>
         <li><b>Forgetting the EXCHANGEABILITY assumption for conformal.</b> The conformal guarantee needs calibration and test data to be exchangeable (roughly: drawn from the same distribution). Under distribution shift — a new season, a new population — coverage can silently drop. <b>Fix:</b> re-calibrate on recent data and monitor achieved coverage over time.</li>
         <li><b>Confusing a CONFIDENCE interval with a PREDICTION interval.</b> A confidence interval is about where a <i>parameter</i> (like the mean) lies; a prediction interval is about where the <i>next observation</i> lands. Prediction intervals are wider because they must absorb the noise in a single new draw.</li>
       </ul>`,
    bigIdea:
      `<p>Every metric on this page is answering one of two questions about an interval, and you must answer both:</p>
       <ul>
         <li><b>Does it COVER?</b> If you promise 90%, does the truth really fall inside 90% of the time? That is <b>PICP</b>, and an interval whose coverage matches its promise is called <b>CALIBRATED</b>.</li>
         <li><b>How NARROW is it?</b> Among all intervals that cover correctly, the tighter one is more useful. That is <b>MPIW</b> (and the set size for conformal).</li>
       </ul>
       <p>The scores that combine the two — the <b>pinball loss</b>, the <b>Winkler / interval score</b>, and <b>CRPS</b> — exist so you can optimize and compare with a single number, while still being driven by the coverage-vs-width trade-off underneath.</p>
       <p><b>Conformal prediction</b> is the tool that makes coverage a <i>guarantee</i> rather than a hope: with no assumption about the model or the data's shape, it builds an interval that provably covers at the promised rate.</p>`,
    buildup:
      `<p><b>Calibrated, in one sentence:</b> an interval is calibrated when its real-world hit rate equals its label. A "90% interval" is calibrated if, over many predictions, the truth lands inside about 90% of the time — no more (wastefully wide), no less (falsely confident).</p>
       <p><b>How split conformal builds such an interval.</b> Split your labelled data into <b>train</b>, <b>calibration</b>, and <b>test</b>. Fit a point model on train. On the calibration set, measure how far off the model was on each example — the absolute residual $s_i = |y_i - \\hat y_i|$. These residuals tell you the model's typical error. Take their high quantile $\\hat q$ (e.g. the 90th percentile, with a small finite-sample correction). At serving time the interval is simply <b>prediction $\\pm\\,\\hat q$</b>. Because the calibration residuals and the test residual are exchangeable, this interval covers the truth at the promised rate — that is the whole trick, and it needs no Gaussian assumption.</p>`,
    symbols: [
      { sym: "$y_i$", desc: "the true target value for example $i$ (e.g. the actual sales)." },
      { sym: "$\\hat y_i$", desc: "the model's point prediction for example $i$ (the 'hat' means estimated)." },
      { sym: "$[L_i,\\,U_i]$", desc: "the predicted interval for example $i$: lower bound $L_i$, upper bound $U_i$." },
      { sym: "$\\mathbb{1}[\\cdot]$", desc: "the indicator — it equals 1 when the statement inside the brackets is true, and 0 when false." },
      { sym: "$N$", desc: "the number of test examples we average over." },
      { sym: "$\\alpha$", desc: "the target miscoverage — the error rate you accept (e.g. $\\alpha=0.1$ for a 90% interval). Greek 'alpha'." },
      { sym: "$1-\\alpha$", desc: "the target coverage — the promised hit rate (e.g. 0.90)." },
      { sym: "$\\tau$", desc: "the quantile level you are predicting (e.g. $\\tau=0.9$ for the 90th percentile). Greek 'tau'." },
      { sym: "$q$", desc: "a quantile prediction — the value you claim the truth falls below with probability $\\tau$." },
      { sym: "$s_i$", desc: "the nonconformity score for calibration example $i$; here the absolute residual $|y_i-\\hat y_i|$." },
      { sym: "$\\hat q$", desc: "the conformal quantile — the residual threshold that sets the interval half-width." },
      { sym: "$F$", desc: "the model's full predicted distribution for a target (a curve, used by CRPS)." }
    ],
    formula: `$$
      \\text{PICP} = \\frac{1}{N}\\sum_{i=1}^{N} \\mathbb{1}\\big[L_i \\le y_i \\le U_i\\big],
      \\qquad
      \\text{MPIW} = \\frac{1}{N}\\sum_{i=1}^{N} (U_i - L_i)
      $$
      $$
      \\text{pinball}_\\tau(y,q) = \\begin{cases} \\tau\\,(y-q) & y \\ge q \\\\ (1-\\tau)\\,(q-y) & y < q \\end{cases}
      \\qquad
      \\mathrm{CRPS}(F,y) = \\int_{-\\infty}^{\\infty}\\big(F(t) - \\mathbb{1}[t \\ge y]\\big)^2\\,dt
      $$`,
    whatItDoes:
      `<p><b>PICP (Prediction Interval Coverage Probability)</b> just counts the fraction of test points whose interval actually contained the truth. For a 90% interval you want PICP $\\approx 0.90$. Above means too wide; below means over-confident.</p>
       <p><b>MPIW (Mean Prediction Interval Width)</b> is the average gap $U_i - L_i$. Smaller is better — <i>but only once coverage is on target</i>. Quote it in the target's own units (dollars, days, °C).</p>
       <p><b>Pinball (quantile) loss</b> scores a single quantile prediction $q$ for level $\\tau$. It is <i>asymmetric</i>: if you predict the 90th percentile ($\\tau=0.9$) and fall too low, the penalty is heavy ($\\tau=0.9$); if you overshoot, it is light ($1-\\tau=0.1$). Minimizing it drives $q$ toward the true $\\tau$-quantile, so the right fraction of points land below the line — that is what makes quantile forecasts calibrated.</p>
       <p><b>CRPS (Continuous Ranked Probability Score)</b> scores a <i>whole predicted distribution</i> $F$ against the single observed truth $y$. It measures the squared area between the predicted cumulative curve $F(t)$ and the perfect step that jumps from 0 to 1 at $y$. A sharp, well-placed distribution scores low; a vague or wrong one scores high. In the same units as $y$, and it reduces to MAE (Mean Absolute Error) when the forecast is a single point.</p>
       <p><b>Winkler / interval score</b> (formula in the derivation) gives one number per interval: the width, <i>plus</i> a penalty proportional to how far the truth fell outside when it missed. It rewards narrow intervals that cover and punishes both being-too-wide and missing.</p>
       <p><b>Conformal coverage &amp; average size:</b> conformal prediction outputs an interval (regression) or a label set (classification). Report its achieved coverage (should match $1-\\alpha$) and its average interval width / set size — the conformal twin of PICP and MPIW.</p>`,
    derivation:
      `<p><b>Why pinball loss yields the right quantile.</b></p>
       <ul class="steps">
         <li>Treat $q$ as a knob and ask which value minimizes the <i>expected</i> pinball loss over the true distribution of $y$.</li>
         <li>Differentiate: raising $q$ adds cost $(1-\\tau)$ for every $y$ below $q$ and removes cost $\\tau$ for every $y$ above. Setting the derivative to zero gives $P(y \\le q)\\,(1-\\tau) = P(y > q)\\,\\tau$.</li>
         <li>That simplifies to $P(y \\le q) = \\tau$ — exactly the definition of the $\\tau$-quantile. So minimizing pinball loss pins $q$ to the quantile, which is why the right fraction of outcomes fall below it. $\\blacksquare$</li>
       </ul>
       <p><b>The Winkler / interval score, written out.</b> For a $(1-\\alpha)$ interval $[L,U]$ and truth $y$:</p>
       <p>$$ W_\\alpha(L,U,y) = (U-L) + \\frac{2}{\\alpha}(L-y)\\,\\mathbb{1}[y < L] + \\frac{2}{\\alpha}(y-U)\\,\\mathbb{1}[y > U]. $$</p>
       <ul class="steps">
         <li>The first term $(U-L)$ is just the width — so a wider interval always costs more. This is the pressure toward NARROW.</li>
         <li>The other two terms fire only on a MISS, adding a penalty proportional to how far outside $y$ fell, scaled by $2/\\alpha$. For a 90% interval $\\alpha=0.1$, so a miss is multiplied by $20$ — a heavy fine. This is the pressure toward COVERING.</li>
         <li>The minimizer of the expected interval score is exactly the calibrated $(1-\\alpha)$ interval, so it rewards being narrow <i>and</i> covering at the promised rate — both tensions in one number.</li>
       </ul>
       <p><b>Why split-conformal intervals cover.</b> The calibration residuals $s_1,\\dots,s_n$ and the next test residual $s_{\\text{test}}$ are <b>exchangeable</b> (same distribution, order irrelevant). So $s_{\\text{test}}$ is equally likely to land in any rank among the $n+1$ residuals; taking $\\hat q$ at rank $\\lceil (n+1)(1-\\alpha)\\rceil$ makes $P(s_{\\text{test}} \\le \\hat q) \\ge 1-\\alpha$. The interval $\\hat y \\pm \\hat q$ therefore covers $y$ at least $1-\\alpha$ of the time — distribution-free, finite-sample. $\\blacksquare$</p>`,
    example:
      `<p><b>PICP and MPIW by hand.</b> Five test points, each with a predicted 90% interval and the truth:</p>
       <ul class="steps">
         <li>$[8,12]$ truth $10$ ✓ inside &nbsp; $[5,9]$ truth $7$ ✓ &nbsp; $[20,30]$ truth $33$ ✗ outside &nbsp; $[0,4]$ truth $2$ ✓ &nbsp; $[15,19]$ truth $16$ ✓.</li>
         <li>PICP $= 4/5 = 0.80$. We promised $0.90$ but only covered $0.80$ — these intervals are slightly OVER-confident.</li>
         <li>Widths: $4,4,10,4,4$. MPIW $= (4+4+10+4+4)/5 = 26/5 = 5.2$.</li>
         <li>Reported together: "PICP 0.80 at MPIW 5.2." Coverage is below target, so the fix is to <i>widen</i> the intervals (which will raise MPIW) until PICP reaches 0.90.</li>
       </ul>
       <p><b>Pinball loss, by hand.</b> Predicting the 90th percentile, so $\\tau=0.9$, and the truth turns out to be $y=10$.</p>
       <ul class="steps">
         <li>If you guessed too low, $q=8$: since $y \\ge q$, loss $= \\tau\\,(y-q) = 0.9\\times 2 = 1.8$ — a big penalty for under-shooting a high quantile.</li>
         <li>If you overshot, $q=12$: since $y < q$, loss $= (1-\\tau)(q-y) = 0.1\\times 2 = 0.2$ — a small penalty.</li>
         <li>The asymmetry ($1.8$ vs $0.2$) is the whole point: for a 90th-percentile forecast, being too low is far worse, which pushes the prediction up until only ~10% of outcomes exceed it.</li>
       </ul>
       <p><b>Conformal interval, by hand.</b> Calibration residuals sorted: $[2,3,5,6,9]$, so $n=5$, target $1-\\alpha=0.9$. Rank $=\\lceil (5+1)\\times 0.9\\rceil = \\lceil 5.4\\rceil = 6$, which exceeds $n$, so we take the largest residual: $\\hat q = 9$. A new point predicted at $\\hat y = 40$ gets the interval $[40-9,\\,40+9] = [31,49]$ — guaranteed to cover at least 90% of the time.</p>`,
    demo: function (host) {
      // Interactive: widen/narrow a band of intervals and watch PICP vs MPIW trade off.
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      // Fixed "test set": a true value and a point prediction with some error, per index.
      var N = 24, truth = [], pred = [];
      for (var i = 0; i < N; i++) {
        var base = 50 + 30 * Math.sin(i * 0.6);
        pred.push(base);
        truth.push(base + 18 * Math.sin(i * 1.9) + 10 * Math.cos(i * 0.7)); // structured error
      }
      var half = 14; // interval half-width (the knob)

      var W = 640, H = 300, padL = 36, padR = 14, padT = 14, padB = 36;
      var ymin = 0, ymax = 100;
      function PX(idx) { return padL + idx / (N - 1) * (W - padL - padR); }
      function PY(v) { return (H - padB) - (v - ymin) / (ymax - ymin) * (H - padT - padB); }

      function draw() {
        var c = theme(); ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        var covered = 0;
        for (var i = 0; i < N; i++) {
          var L = pred[i] - half, U = pred[i] + half;
          var inside = truth[i] >= L && truth[i] <= U;
          if (inside) covered++;
          // interval bar
          ctx.strokeStyle = c.accent; ctx.lineWidth = 6; ctx.globalAlpha = 0.35;
          ctx.beginPath(); ctx.moveTo(PX(i), PY(L)); ctx.lineTo(PX(i), PY(U)); ctx.stroke();
          ctx.globalAlpha = 1;
          // truth dot
          ctx.fillStyle = inside ? c.accent : (c.warn || "#d9534f");
          ctx.beginPath(); ctx.arc(PX(i), PY(truth[i]), 3.4, 0, Math.PI * 2); ctx.fill();
        }
        var picp = covered / N, mpiw = 2 * half;
        readout.innerHTML = "Each bar is a prediction interval; each dot is the truth (green = covered, red = missed). " +
          "<b>PICP</b> (coverage) = <b>" + picp.toFixed(2) + "</b> &nbsp;|&nbsp; <b>MPIW</b> (width) = <b>" + mpiw.toFixed(0) + "</b>. " +
          "Target = 0.90. Widen the band &rarr; PICP rises but MPIW grows; narrow it &rarr; tighter but you start missing. " +
          "The goal is the smallest width that still hits 0.90.";
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([readout]);
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lbl = document.createElement("span"); lbl.textContent = "interval half-width: ";
      var sl = document.createElement("input"); sl.type = "range"; sl.min = "2"; sl.max = "40"; sl.value = "14"; sl.style.verticalAlign = "middle";
      sl.addEventListener("input", function () { half = parseInt(sl.value, 10); draw(); });
      row.appendChild(lbl); row.appendChild(sl);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },
    practice: [
      {
        q: `Team A reports "90% intervals, MPIW 6." Team B reports "90% intervals, MPIW 20." Which is better?`,
        steps: [
          { do: `Refuse to compare on WIDTH alone — ask both teams for PICP on a held-out test set.`, why: `Width is only meaningful once you know each model actually covers at the promised rate; a tight interval that misses is worthless.` },
          { do: `Suppose Team A's PICP is 0.72 and Team B's is 0.90.`, why: `Team A's narrow intervals are narrow because they are too small — they cover only 72%, far below the 90% promise (over-confident).` },
          { do: `Pick the one that COVERS first, then prefer narrower among those that do.`, why: `Calibration (coverage matching the promise) is the gate; width is the tie-breaker.` }
        ],
        answer: `<p>You cannot say from width alone. Once you add coverage, Team B wins: it is <b>calibrated</b> (PICP 0.90) while Team A is over-confident (PICP 0.72) and only looks good because its intervals are too narrow. The rule: <b>compare width only among intervals that cover at the target rate.</b> Always quote PICP and MPIW together.</p>`
      },
      {
        q: `You have a fitted regression model and want 90% prediction intervals with a guarantee that doesn't assume Gaussian errors. Outline split conformal and what you'd check.`,
        steps: [
          { do: `Hold out a CALIBRATION split separate from train and test.`, why: `The coverage guarantee needs calibration residuals to be exchangeable with test residuals, so calibration data must be unseen by the fitted model.` },
          { do: `Compute absolute residuals $s_i = |y_i - \\hat y_i|$ on the calibration split.`, why: `These capture the model's typical error magnitude with no distributional assumption.` },
          { do: `Take $\\hat q$ at rank $\\lceil (n+1)(0.9)\\rceil$ of the sorted residuals; set each interval to $\\hat y \\pm \\hat q$.`, why: `The $(n+1)$ correction makes the finite-sample $\\ge 0.9$ coverage exact.` },
          { do: `Measure PICP and MPIW on the untouched TEST set, and also PICP per segment.`, why: `Confirms achieved coverage ≈ 0.90 overall and exposes segments where conditional coverage is weak.` }
        ],
        answer: `<p>Split-conformal regression: fit on train, take absolute residuals on a fresh calibration split, set $\\hat q$ to their $\\lceil (n+1)(1-\\alpha)\\rceil$-th smallest value, and output $\\hat y \\pm \\hat q$. Verify on the held-out test set that <b>PICP ≈ 0.90</b> and report <b>MPIW</b> in the target's units. Also check coverage <i>per segment</i> — exchangeability buys marginal coverage, not automatic conditional coverage. In code, <code>MAPIE</code>'s <code>MapieRegressor</code> automates this.</p>`
      },
      {
        q: `A weather team predicts a full probability distribution for tomorrow's temperature, not just an interval. How do you score it, and how is that different from pinball loss?`,
        steps: [
          { do: `Use CRPS (Continuous Ranked Probability Score) — it scores the whole predicted distribution against the single observed temperature.`, why: `CRPS measures the squared area between the predicted cumulative curve and the perfect step at the truth, rewarding sharp, well-placed distributions.` },
          { do: `Note CRPS is in the same units as temperature and reduces to MAE (Mean Absolute Error) for a point forecast.`, why: `That makes it directly comparable to a deterministic baseline.` },
          { do: `Contrast with pinball loss, which scores ONE quantile at a time.`, why: `Averaging pinball loss over many quantile levels approximates CRPS, but a single pinball value only judges one slice of the distribution.` }
        ],
        answer: `<p>Score the full forecast with <b>CRPS</b>: $\\int (F(t)-\\mathbb{1}[t\\ge y])^2\\,dt$, the squared gap between the predicted cumulative curve $F$ and the step that jumps at the truth $y$. It rewards distributions that are both sharp and correctly centered, lives in temperature units, and collapses to MAE for a point forecast. <b>Pinball loss</b> instead scores a single quantile $\\tau$; averaging pinball over a grid of quantiles approximates CRPS. Use <code>properscoring.crps_ensemble</code> for CRPS.</p>`
      }
    ]
  });

  window.CODE["met-uncertainty"] = {
    lib: "scikit-learn + numpy (notes: MAPIE, properscoring)",
    runnable: false,
    explain: `<p>From-scratch <b>split conformal</b> regression on real data, plus the core uncertainty metrics computed by hand: <b>PICP</b> (coverage), <b>MPIW</b> (width), and the <b>pinball / quantile loss</b>. The closing notes show the production libraries: <code>MAPIE</code> for conformal intervals and <code>properscoring</code> for CRPS.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

X, y = load_diabetes(return_X_y=True)
# train / calibration / test  -- calibration must be UNSEEN by the fitted model
X_tr, X_tmp, y_tr, y_tmp = train_test_split(X, y, test_size=0.4, random_state=0)
X_cal, X_te, y_cal, y_te = train_test_split(X_tmp, y_tmp, test_size=0.5, random_state=0)

model = LinearRegression().fit(X_tr, y_tr)

# ---- SPLIT CONFORMAL: turn a point model into a 90% prediction interval ----
alpha = 0.10                                  # target coverage = 1 - alpha = 0.90
res = np.abs(y_cal - model.predict(X_cal))    # nonconformity scores s_i = |y - yhat|
n = len(res)
k = int(np.ceil((n + 1) * (1 - alpha)))       # finite-sample rank
k = min(k, n)
qhat = np.sort(res)[k - 1]                     # conformal quantile -> interval half-width

pred = model.predict(X_te)
lo, hi = pred - qhat, pred + qhat              # interval = yhat +/- qhat

# ---- PICP (coverage) and MPIW (width): always report TOGETHER ----
def picp(y, lo, hi):
    return float(np.mean((y >= lo) & (y <= hi)))   # fraction of truths inside
def mpiw(lo, hi):
    return float(np.mean(hi - lo))                 # average interval width

print("target coverage :", 1 - alpha)
print("PICP (achieved) :", round(picp(y_te, lo, hi), 3))
print("MPIW (width)    :", round(mpiw(lo, hi), 1))   # in target units

# ---- PINBALL / QUANTILE LOSS for a quantile prediction q at level tau ----
def pinball(y, q, tau):
    d = y - q
    return float(np.mean(np.maximum(tau * d, (tau - 1) * d)))
# example: how good is the conformal upper bound as a 0.95-quantile prediction?
print("pinball@0.95    :", round(pinball(y_te, hi, 0.95), 2))

# -----------------------------------------------------------------------------
# IN PRACTICE, reach for libraries:
#   MAPIE -- distribution-free conformal intervals, coverage guaranteed:
#       from mapie.regression import MapieRegressor
#       mapie = MapieRegressor(model, method="base", cv="prefit").fit(X_cal, y_cal)
#       _, intervals = mapie.predict(X_te, alpha=0.10)   # shape (n, 2, 1): lo, hi
#
#   properscoring -- CRPS (Continuous Ranked Probability Score) for full
#   predictive distributions:
#       import properscoring as ps
#       crps = ps.crps_ensemble(y_te, samples).mean()    # samples: (n, n_draws)
#       # or, for a Gaussian forecast mean mu, std sigma:
#       crps = ps.crps_gaussian(y_te, mu, sigma).mean()`
  };

  window.CODEVIZ["met-uncertainty"] = {
    question: "On real diabetes data, do 80% / 90% / 95% split-conformal intervals actually cover at their promised rates?",
    charts: [
      {
        type: "line",
        title: "Achieved coverage (PICP) vs. target — split conformal on load_diabetes",
        xlabel: "target coverage 1 − α",
        ylabel: "achieved coverage (PICP) on held-out test",
        series: [
          { name: "perfect (achieved = target)", color: "#9aa3ad", points: [[0.80, 0.80], [0.95, 0.95]] },
          { name: "conformal achieved", color: "#4f8ef7", points: [[0.80, 0.888], [0.90, 0.921], [0.95, 0.933]] }
        ]
      }
    ],
    caption: "Split-conformal prediction intervals built from a LinearRegression on load_diabetes, with coverage measured on an untouched test split. Achieved coverage (blue) tracks the target (grey diagonal) closely at all three levels — the intervals are calibrated. Mean interval width (MPIW) grows with the promise: about 154 units at 80%, 197 at 90%, and 226 at 95% (target is disease-progression score) — the price of higher coverage is a wider band.",
    code: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

X, y = load_diabetes(return_X_y=True)        # 442 real patients; target = progression
X_tr, X_tmp, y_tr, y_tmp = train_test_split(X, y, test_size=0.4, random_state=0)
X_cal, X_te, y_cal, y_te = train_test_split(X_tmp, y_tmp, test_size=0.5, random_state=0)

model = LinearRegression().fit(X_tr, y_tr)
res = np.abs(y_cal - model.predict(X_cal))   # calibration residuals
pred = model.predict(X_te)
n = len(res)

for target in [0.80, 0.90, 0.95]:            # the three plotted points
    alpha = 1 - target
    k = min(int(np.ceil((n + 1) * (1 - alpha))), n)
    qhat = np.sort(res)[k - 1]               # conformal half-width
    lo, hi = pred - qhat, pred + qhat
    picp = np.mean((y_te >= lo) & (y_te <= hi))   # achieved coverage (y-axis)
    mpiw = np.mean(hi - lo)                        # reported in the caption
    print(target, "PICP", round(float(picp), 3), "MPIW", round(float(mpiw), 1))
# 0.80 PICP 0.888 MPIW 154.2
# 0.90 PICP 0.921 MPIW 197.1
# 0.95 PICP 0.933 MPIW 226.3`
  };
})();
