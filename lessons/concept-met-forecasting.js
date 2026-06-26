/* =====================================================================
   METRICS & EVALUATION LESSON — "Metrics for time-series forecasting"
   BEGINNER audience. Self-contained: registers the lesson, CODE, CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-forecasting",
    title: "Metrics for time-series forecasting",
    tagline: "Score a forecast by how far it misses over time — and make sure it beats just repeating the last value.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-regression-metrics", "mod-timeseries"],

    whenToUse:
      `<p><b>Use these metrics whenever your model predicts a number at future time steps</b> — next month's sales, tomorrow's demand, next hour's electricity load. A forecast is judged not on one prediction but on a whole stretch of future points, so you measure the typical size of the miss across that stretch.</p>
       <p><b>Which metric to reach for:</b></p>
       <ul>
         <li><b>MASE (Mean Absolute Scaled Error) or RMSSE (Root Mean Squared Scaled Error)</b> when you want a <i>scale-free</i> score you can average across many different series — a forecast for a product selling 5 units a day and one selling 5,000 belong on the same ruler only after scaling. MASE and RMSSE divide your error by the error of a dumb baseline, so a value below 1 means "better than the baseline".</li>
         <li><b>MAE (Mean Absolute Error) or RMSE (Root Mean Squared Error)</b> for a single series in its own units. Use RMSE when big misses hurt much more than small ones; MAE when every unit of error costs the same.</li>
         <li><b>MAPE / sMAPE / WAPE</b> when stakeholders want a percentage ("we were off by 6%"). Avoid MAPE if any actual value is near zero (see pitfalls).</li>
         <li><b>Pinball (quantile) loss and CRPS (Continuous Ranked Probability Score)</b> when the model outputs a whole <i>distribution</i> or several quantiles, not one number — you score how good the uncertainty is, not just the middle.</li>
         <li><b>Winkler / interval score and coverage</b> when you ship a prediction interval ("between 90 and 110") and need to check it is both narrow and right the promised fraction of the time.</li>
       </ul>
       <p><b>Two rules that override everything:</b> always compare to the <b>naive (last-value) baseline</b> — a forecast that loses to "just repeat yesterday" is worthless — and always split your data <b>by time</b> (train on the past, test on the future), never randomly.</p>`,

    application:
      `<p>These metrics run the world's planning systems. <b>Retail and supply chain</b> forecast demand per product per store and rank methods by MASE / RMSSE across thousands of series (this is exactly how the famous <b>M5 competition</b> scored entrants, using RMSSE). <b>Energy</b> forecasts load and prices and grades the prediction intervals with pinball loss and coverage, because being honest about uncertainty decides how much spare capacity to hold. <b>Finance and capacity planning</b> compare every model against the naive random-walk baseline with Theil's U. <b>Cloud and ops</b> teams forecast traffic and alert when residual diagnostics (Ljung-Box, Durbin-Watson) show the model is still missing a pattern.</p>`,

    pitfalls:
      `<ul>
         <li><b>MAPE blowing up near zero.</b> Tell: an actual value is 0 or tiny, so dividing the error by it gives a huge or infinite percentage that dominates the average. Fix: use <b>WAPE</b> (divide total error by total actual) or <b>MASE</b> (scale by a baseline error), which never divide by a single near-zero point.</li>
         <li><b>Random splits that leak the future.</b> Tell: you used <code>train_test_split(shuffle=True)</code> on a time series, so the model trained on points <i>after</i> the ones it is tested on. That is impossible in real life and inflates the score. Fix: split by time — earliest data trains, latest data tests — and validate with rolling / expanding windows.</li>
         <li><b>Not comparing to the naive baseline.</b> Tell: a report shows "RMSE = 12" with nothing to compare it to. Twelve is meaningless until you know the naive last-value forecast scores. Fix: always report MASE / RMSSE (baseline-relative) or Theil's U, so a number below 1 proves you beat the baseline.</li>
         <li><b>Ignoring autocorrelated residuals.</b> Tell: the residuals (actual minus forecast) still trend or wiggle in a pattern — the model left structure on the table. Fix: run the <b>Ljung-Box test</b> (a small p-value means leftover autocorrelation) and the <b>Durbin-Watson statistic</b> (far from 2 means correlated residuals); if they flag, the model is missing a trend or season.</li>
         <li><b>sMAPE's hidden asymmetry.</b> Tell: sMAPE looks symmetric but still treats over- and under-forecasts differently and is undefined when actual and forecast are both zero. Use it knowingly, and prefer MASE for cross-series comparison.</li>
       </ul>`,

    bigIdea:
      `<p>A forecast produces a number $\\hat y_t$ for each future time $t$; the truth turns out to be $y_t$. The <b>error</b> at time $t$ is $e_t = y_t - \\hat y_t$ (positive means we under-forecast). Every metric here is just a different honest way to summarize the whole sequence of errors $e_1, e_2, \\dots, e_h$ into one number.</p>
       <p>The single most important idea: <b>a number is only meaningful relative to a baseline.</b> The baseline for forecasting is the <b>naive forecast</b> — "tomorrow equals today" (last value), or for seasonal data "this month equals the same month last year". If your fancy model cannot beat that, it has learned nothing. Scaled metrics (MASE, RMSSE, Theil's U) bake the baseline right into the score, so below 1 = better than naive, above 1 = worse.</p>`,

    buildup:
      `<p>Start with the raw error $e_t = y_t - \\hat y_t$. We cannot just average the $e_t$ — positive and negative misses would cancel and hide a bad forecast. So we make every error positive first, two classic ways:</p>
       <ul>
         <li><b>Absolute value</b> $|e_t|$ — treats a miss of +5 and -5 the same; averaging gives <b>MAE</b>.</li>
         <li><b>Square</b> $e_t^2$ — punishes big misses extra; averaging then square-rooting gives <b>RMSE</b>.</li>
       </ul>
       <p>To compare <i>across series of different sizes</i>, convert to a percentage (divide by the actual, giving MAPE/sMAPE/WAPE) or to a scaled error (divide by a baseline's error, giving MASE/RMSSE). Each metric below is one of these choices.</p>
       <p><b>The seasonal-naive baseline error</b> is the engine of scaling. For a series with season length $m$ (12 for monthly data), the in-sample naive error is the average absolute one-season-back change, $\\frac{1}{n-m}\\sum_{t=m+1}^{n} |y_t - y_{t-m}|$. MASE divides your test MAE by this; RMSSE divides your test RMSE by the squared version.</p>`,

    symbols: [
      { sym: "$y_t$", desc: "the true (actual) value at time step $t$." },
      { sym: "$\\hat y_t$", desc: "the model's forecast for time step $t$." },
      { sym: "$e_t = y_t - \\hat y_t$", desc: "the forecast error at $t$. Positive means the model under-forecast." },
      { sym: "$h$", desc: "the forecast horizon — how many future steps you are scoring (e.g. 12 for a year of monthly forecasts)." },
      { sym: "$n$", desc: "the number of points in the training history (used to compute the baseline scale)." },
      { sym: "$m$", desc: "the season length — number of steps in one cycle (12 for monthly, 7 for daily-with-weekly pattern)." },
      { sym: "$q$", desc: "a quantile level between 0 and 1 (e.g. 0.9 = the 90th-percentile forecast). Used in pinball loss." },
      { sym: "$\\hat y_t^{(q)}$", desc: "the model's $q$-quantile forecast for time $t$ — the value it claims the truth will fall below with probability $q$." },
      { sym: "$F_t$", desc: "the full predicted cumulative distribution (CDF) at time $t$ — used by CRPS." },
      { sym: "$[\\ell_t, u_t]$", desc: "a prediction interval at time $t$: lower bound $\\ell_t$, upper bound $u_t$." },
      { sym: "$\\alpha$", desc: "the interval's miss rate; a $(1-\\alpha)$ interval should contain the truth $(1-\\alpha)$ of the time (e.g. $\\alpha=0.1$ for a 90% interval)." }
    ],

    formula: `$$ \\text{MAE}=\\frac1h\\sum_{t=1}^{h}|e_t|, \\quad \\text{RMSE}=\\sqrt{\\frac1h\\sum_{t=1}^{h} e_t^2}, \\quad \\text{MASE}=\\frac{\\text{MAE}}{\\frac{1}{n-m}\\sum_{t=m+1}^{n}|y_t-y_{t-m}|} $$
$$ \\text{MAPE}=\\frac{100}{h}\\sum_{t=1}^{h}\\frac{|e_t|}{|y_t|}, \\quad \\text{sMAPE}=\\frac{100}{h}\\sum_{t=1}^{h}\\frac{|e_t|}{(|y_t|+|\\hat y_t|)/2}, \\quad \\text{WAPE}=\\frac{\\sum_t |e_t|}{\\sum_t |y_t|}\\times100 $$
$$ \\text{Pinball}_q(y,\\hat y^{(q)})=\\begin{cases} q\\,(y-\\hat y^{(q)}) & y\\ge \\hat y^{(q)}\\\\ (1-q)(\\hat y^{(q)}-y) & y<\\hat y^{(q)} \\end{cases}, \\qquad U=\\frac{\\sqrt{\\sum e_t^2}}{\\sqrt{\\sum (y_t-y_{t}^{\\text{naive}})^2}} $$`,

    whatItDoes:
      `<p><b>Point-forecast metrics (one number per step).</b></p>
       <ul>
         <li><b>MAE (Mean Absolute Error):</b> the average size of the miss, in the data's own units. Simple and robust to outliers.</li>
         <li><b>RMSE (Root Mean Squared Error):</b> like MAE but squares first, so a few large misses dominate. Use when big errors are especially costly.</li>
         <li><b>MAPE (Mean Absolute Percentage Error):</b> the average miss as a percent of the actual. Intuitive ("off by 6%") but explodes when an actual is near zero.</li>
         <li><b>sMAPE (symmetric MAPE):</b> divides by the average of actual and forecast instead of just the actual, capping the blow-up and bounding the score (still imperfectly symmetric).</li>
         <li><b>WAPE (Weighted Absolute Percentage Error):</b> total error divided by total actual. One pooled percentage that never divides by a single tiny point — the practical fix for MAPE.</li>
         <li><b>MASE (Mean Absolute Scaled Error):</b> your MAE divided by the in-sample MAE of the seasonal-naive forecast. <b>Below 1 = you beat the naive baseline; above 1 = worse.</b> Scale-free, so it averages across series.</li>
         <li><b>RMSSE (Root Mean Squared Scaled Error):</b> the squared-error cousin of MASE and the official <b>M5 competition</b> metric. Same "below 1 beats naive" reading, but penalizes large misses more.</li>
         <li><b>Theil's U:</b> your RMSE divided by the naive forecast's RMSE. Below 1 beats naive; equals 1 ties it; above 1 loses.</li>
       </ul>
       <p><b>Probabilistic-forecast metrics (the model outputs uncertainty).</b></p>
       <ul>
         <li><b>Pinball / quantile loss:</b> scores a single quantile forecast $\\hat y^{(q)}$. It penalizes under-prediction by $q$ and over-prediction by $(1-q)$, so for a high quantile (q=0.9) missing low hurts more — that is what forces the forecast up to the right percentile.</li>
         <li><b>CRPS (Continuous Ranked Probability Score):</b> scores the <i>whole</i> predicted distribution against the single truth that occurred. It is the integral of the squared gap between the predicted CDF and the step function that jumps at the true value. Lower is better; for a point forecast CRPS reduces to MAE, and it is the average of pinball loss over all quantiles.</li>
         <li><b>Winkler / interval score:</b> scores a prediction interval. It charges the interval's width plus a penalty (scaled by $2/\\alpha$) whenever the truth falls outside — rewarding intervals that are narrow yet still contain the truth.</li>
         <li><b>Coverage:</b> the fraction of times the truth landed inside the interval. A 90% interval should cover ~90%; far below means over-confident, far above means too wide.</li>
       </ul>
       <p><b>Residual diagnostics (is the model still missing a pattern?).</b></p>
       <ul>
         <li><b>Ljung-Box test:</b> tests whether the residuals still have autocorrelation (leftover pattern). A small p-value (e.g. p &lt; 0.05) says "yes, structure remains" — the model is incomplete.</li>
         <li><b>Durbin-Watson statistic:</b> a number between 0 and 4 measuring residual autocorrelation. About <b>2</b> means none; near <b>0</b> means strong positive autocorrelation; near <b>4</b> means negative. You want it close to 2.</li>
       </ul>`,

    derivation:
      `<p><b>Why MASE measures "beat the baseline".</b></p>
       <ul class="steps">
         <li>Pick the dumbest sensible forecast: the seasonal-naive one, $\\hat y_t = y_{t-m}$ ("same as one season ago"). On the training history its average absolute one-step error is the <i>scale</i> $s=\\frac{1}{n-m}\\sum_{t=m+1}^{n}|y_t-y_{t-m}|$.</li>
         <li>This $s$ is one unit of "how hard is this series to forecast at all" — a volatile series has a big $s$, a smooth one a small $s$.</li>
         <li>MASE divides your test MAE by $s$. So MASE is "how many baseline-errors big is my typical miss". $\\text{MASE}=1$ exactly ties the naive forecast; $\\text{MASE}=0.5$ means half the baseline error (twice as good); $\\text{MASE}=2$ means twice as bad. $\\blacksquare$</li>
         <li>Because $s$ is in the same units as your error, the ratio is unitless — that is what lets you average MASE across a $5$-unit product and a $5{,}000$-unit product. RMSSE is identical but with squared errors under a square root.</li>
       </ul>
       <p><b>Why pinball loss pins down a quantile.</b></p>
       <ul class="steps">
         <li>For the $q$-quantile we want the forecast where a fraction $q$ of outcomes fall below. Pinball loss charges $q\\cdot(\\text{under-shoot})$ and $(1-q)\\cdot(\\text{over-shoot})$.</li>
         <li>The expected loss is minimized exactly when the forecast equals the true $q$-quantile (set the derivative of expected loss to zero: $-q\\,P(y>\\hat y) + (1-q)\\,P(y\\le\\hat y)=0$ gives $P(y\\le\\hat y)=q$). So minimizing pinball loss <i>is</i> estimating that quantile. $\\blacksquare$</li>
         <li><b>CRPS</b> averages pinball loss over every quantile $q\\in(0,1)$, which is the same as integrating the squared CDF gap — that is why CRPS scores the whole distribution, and why a perfect point forecast's CRPS equals its MAE.</li>
       </ul>`,

    example:
      `<p>Three months of demand. Actuals $y=[100,\\;120,\\;90]$; your model forecasts $\\hat y=[110,\\;115,\\;95]$. Errors $e=y-\\hat y=[-10,\\;5,\\;-5]$.</p>
       <ul class="steps">
         <li><b>MAE</b> $=\\frac{|{-}10|+|5|+|{-}5|}{3}=\\frac{20}{3}\\approx 6.67$ units.</li>
         <li><b>RMSE</b> $=\\sqrt{\\frac{100+25+25}{3}}=\\sqrt{50}\\approx 7.07$ — slightly above MAE because the $-10$ miss is squared.</li>
         <li><b>MAPE</b> $=\\frac{100}{3}\\big(\\frac{10}{100}+\\frac{5}{120}+\\frac{5}{90}\\big)\\approx \\frac{100}{3}(0.10+0.042+0.056)\\approx 6.6\\%$.</li>
         <li><b>WAPE</b> $=\\frac{10+5+5}{100+120+90}\\times100=\\frac{20}{310}\\times100\\approx 6.5\\%$ — one pooled percentage.</li>
         <li><b>MASE:</b> suppose the seasonal-naive baseline's in-sample MAE is $s=10$. Then $\\text{MASE}=\\frac{6.67}{10}=0.67$ — below 1, so the model beats naive by a third. <b>That is the headline number.</b></li>
         <li><b>Pinball at $q=0.9$</b> for the first point: the model's 90% quantile is, say, $\\hat y^{(0.9)}=118$ while the truth is $100 \\lt 118$, so loss $=(1-0.9)(118-100)=0.1\\times18=1.8$. Over-shooting a high quantile is cheap; under-shooting it would cost $0.9\\times$ the gap.</li>
       </ul>
       <p>Notice MAE, RMSE, MAPE, WAPE all land near 6.5-7 here, but only <b>MASE = 0.67</b> tells you whether that is any good — and it is, because it beats the baseline.</p>`,

    demo: function (host) {
      var c = (function () {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340") };
      })();
      var cv = document.createElement("canvas"); cv.width = 660; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      // 12 held-out months: actual, seasonal-naive baseline, and a model forecast.
      var actual = [195.5, 199.1, 209.2, 202.7, 205.6, 209.4, 204.7, 192.8, 175.5, 178.6, 184.4, 206.0];
      var snaive = [168.0, 185.4, 187.1, 178.9, 187.0, 186.1, 185.9, 169.4, 152.8, 147.8, 164.7, 188.6];
      var model0 = [187.1, 204.5, 206.2, 198.0, 206.1, 205.2, 205.0, 188.5, 171.9, 166.9, 183.8, 207.7];
      var scale = 21.756; // in-sample seasonal-naive MAE (the MASE denominator)
      var blend = 1.0;    // 1 = the fitted model, 0 = the naive baseline

      function metrics(fc) {
        var sumAbs = 0, sumSq = 0;
        for (var i = 0; i < actual.length; i++) { var e = actual[i] - fc[i]; sumAbs += Math.abs(e); sumSq += e * e; }
        var mae = sumAbs / actual.length, rmse = Math.sqrt(sumSq / actual.length);
        return { mae: mae, rmse: rmse, mase: mae / scale };
      }

      var W = 660, H = 340, padL = 46, padR = 12, padT = 16, padB = 34;
      function PX(i) { return padL + (i / (actual.length - 1)) * (W - padL - padR); }
      var lo = 130, hi = 225;
      function PY(v) { return (H - padB) - ((v - lo) / (hi - lo)) * (H - padT - padB); }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        var fc = []; for (var i = 0; i < actual.length; i++) fc.push(blend * model0[i] + (1 - blend) * snaive[i]);
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("future month (held out by time)", (padL + W - padR) / 2, H - 8);
        ctx.save(); ctx.translate(13, (padT + H - padB) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("value", 0, 0); ctx.restore();
        // error bars from forecast to actual
        ctx.strokeStyle = c.dim; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        for (i = 0; i < actual.length; i++) { ctx.beginPath(); ctx.moveTo(PX(i), PY(actual[i])); ctx.lineTo(PX(i), PY(fc[i])); ctx.stroke(); }
        ctx.setLineDash([]);
        function line(arr, col, w) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (var k = 0; k < arr.length; k++) { var X = PX(k), Y = PY(arr[k]); if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke(); for (k = 0; k < arr.length; k++) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(PX(k), PY(arr[k]), 2.6, 0, Math.PI * 2); ctx.fill(); } }
        line(actual, c.accent2, 2.5);
        line(fc, c.accent, 2.5);
        // legend
        ctx.textAlign = "left"; ctx.font = "11px sans-serif";
        ctx.fillStyle = c.accent2; ctx.fillText("actual", padL + 6, padT + 12);
        ctx.fillStyle = c.accent; ctx.fillText("forecast", padL + 60, padT + 12);
        var m = metrics(fc), mn = metrics(snaive);
        var verdict = m.mase < 1 ? "BEATS the naive baseline" : "LOSES to the naive baseline";
        readout.innerHTML = "Forecast: <b>MAE " + m.mae.toFixed(2) + "</b>, RMSE " + m.rmse.toFixed(2) + ", <b>MASE " + m.mase.toFixed(3) + "</b> (" + verdict + ", below 1 = better). Naive baseline MASE is " + mn.mase.toFixed(3) + " by definition ~1. Dashed segments are the errors |y − ŷ|. Slide toward the naive baseline and watch MASE climb to 1.";
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "blend: 0 = naive baseline … 1 = fitted model ";
      var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = blend.toFixed(2); lab.appendChild(span);
      var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 0; inp.max = 1; inp.step = 0.05; inp.value = blend;
      inp.addEventListener("input", function () { blend = parseFloat(inp.value); span.textContent = blend.toFixed(2); draw(); });
      row.appendChild(lab); row.appendChild(inp);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },

    practice: [
      {
        q: `You forecast next year's monthly sales for 500 different products at once and want a single leaderboard. Some products sell ~10 units a month, others ~10,000. A colleague suggests averaging each product's RMSE. Why is that a bad idea, and what should you use instead?`,
        steps: [
          { do: `See the units problem.`, why: `RMSE is in the series' own units, so a 10,000-unit product can have an RMSE of 800 while a 10-unit product's RMSE is 3. Averaging them lets the big sellers dominate the leaderboard regardless of forecast skill.` },
          { do: `Switch to a scale-free metric.`, why: `MASE and RMSSE divide each series' error by that series' own naive-baseline error, producing a unitless number where 1 = ties the baseline. Now every product is on the same ruler.` },
          { do: `Read the value.`, why: `Average MASE (or RMSSE) below 1 means the model beats naive across the portfolio; above 1 means it doesn't. The M5 competition ranked exactly this way with RMSSE.` }
        ],
        answer: `<p>Averaging RMSE across series of wildly different magnitudes lets the high-volume products swamp the score, so the leaderboard measures size, not skill. Use <b>MASE</b> or <b>RMSSE</b>: each divides a series' error by its own seasonal-naive baseline error, giving a unitless score where below 1 beats naive. Average that across the 500 products for a fair leaderboard — this is the M5 approach.</p>`
      },
      {
        q: `A demand model reports MAPE = 4% and everyone is thrilled — until you notice several weeks had actual demand of 0 (stockouts). What's wrong, and how should you re-score?`,
        steps: [
          { do: `Find the divide-by-near-zero.`, why: `MAPE divides each error by the actual $|y_t|$. When $y_t=0$ the term is infinite (or undefined); when it is tiny, the term explodes and a single point can dominate or quietly get dropped, making the headline 4% untrustworthy.` },
          { do: `Pick a robust percentage.`, why: `WAPE divides total error by total actual, so individual zeros don't blow up — and it stays defined as long as the totals aren't all zero.` },
          { do: `Or go baseline-relative.`, why: `MASE scales by the seasonal-naive in-sample error, which also never divides by a single near-zero point and additionally tells you whether you beat the baseline.` }
        ],
        answer: `<p>MAPE divides by each actual value, so the zero-demand weeks make terms blow up or be silently dropped — the 4% is meaningless. Re-score with <b>WAPE</b> (total error ÷ total actual, robust to zeros) or <b>MASE</b> (scaled by the naive baseline error). Both avoid dividing by a single near-zero point, and MASE also answers the question that matters: did the model beat just-repeat-last-season?</p>`
      },
      {
        q: `Your forecast's point accuracy (RMSE) is good, but the residuals (actual minus forecast) clearly drift up and down in a slow wave over time. A Durbin-Watson statistic comes back at 0.4 and a Ljung-Box test gives p = 0.001. What do these tell you, and what should you do?`,
        steps: [
          { do: `Interpret Durbin-Watson.`, why: `Durbin-Watson runs 0 to 4, with ~2 meaning no residual autocorrelation. 0.4 is near 0, signalling strong positive autocorrelation — consecutive residuals are similar, so the model is systematically missing a moving pattern.` },
          { do: `Interpret Ljung-Box.`, why: `Ljung-Box tests whether residual autocorrelation is jointly zero; p = 0.001 (p &lt; 0.05) rejects that — there is leftover structure the model failed to capture.` },
          { do: `Fix the model, not the metric.`, why: `Autocorrelated residuals mean an un-modeled trend or seasonality. Add a seasonal term, a trend, or lagged features (or move to a model like SARIMA) until the residuals look like uncorrelated noise (Durbin-Watson near 2, Ljung-Box p large).` }
        ],
        answer: `<p>Both diagnostics say the residuals still contain a pattern: Durbin-Watson of 0.4 (far below 2) flags strong positive autocorrelation, and Ljung-Box p = 0.001 rejects "no autocorrelation". Good RMSE is hiding an un-modeled trend/season. Don't ship it — add the missing seasonal or trend component (e.g. move to SARIMA or add lagged features) until the residuals are uncorrelated noise (Durbin-Watson ≈ 2, Ljung-Box p large).</p>`
      }
    ]
  });

  window.CODE["met-forecasting"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Point-forecast metrics come straight from <code>sklearn.metrics</code> (MAE, RMSE, MAPE). <b>MASE</b> and <b>pinball/quantile loss</b> are written from scratch so the scaling and quantile penalty are explicit. Residual diagnostics use <code>statsmodels</code> (Ljung-Box, Durbin-Watson); proper probabilistic scoring (CRPS) uses <code>properscoring</code> / <code>scoringrules</code>. Always split by time, never randomly.</p>`,
    code: `import numpy as np
from sklearn.metrics import (mean_absolute_error,
                             mean_squared_error,
                             mean_absolute_percentage_error)

# --- a real-shaped monthly series: trend + yearly season + noise ---
rng = np.random.default_rng(7)
t = np.arange(60)
y = (100 + 1.8*t
     + 18*np.sin(2*np.pi*(t % 12)/12) + 8*np.cos(2*np.pi*(t % 12)/6)
     + rng.normal(0, 4, 60)).round(1)

# SPLIT BY TIME, never randomly: last 12 months are the test horizon
m = 12
train, test = y[:48], y[48:]

# seasonal-naive baseline forecast: same month one year earlier
naive_fc = train[-m:]
# a simple model: shift last season up by the fitted trend over a year
slope = np.polyfit(np.arange(48), train, 1)[0]
model_fc = (naive_fc + slope * m).round(1)

# --- point-forecast metrics via sklearn.metrics ---
mae  = mean_absolute_error(test, model_fc)
rmse = np.sqrt(mean_squared_error(test, model_fc))
mape = mean_absolute_percentage_error(test, model_fc) * 100        # %
# sMAPE and WAPE are simple to write out:
smape = np.mean(np.abs(test-model_fc)/((np.abs(test)+np.abs(model_fc))/2)) * 100
wape  = np.sum(np.abs(test-model_fc)) / np.sum(np.abs(test)) * 100

# --- MASE from scratch: divide MAE by the in-sample seasonal-naive MAE ---
def mase(y_train, y_true, y_pred, season):
    scale = np.mean(np.abs(y_train[season:] - y_train[:-season]))  # baseline error
    return mean_absolute_error(y_true, y_pred) / scale
# RMSSE is the same idea with squared errors under a root:
def rmsse(y_train, y_true, y_pred, season):
    scale = np.mean((y_train[season:] - y_train[:-season])**2)
    return np.sqrt(np.mean((y_true - y_pred)**2) / scale)

print(f"MAE  {mae:.2f}  RMSE {rmse:.2f}  MAPE {mape:.2f}%  sMAPE {smape:.2f}%  WAPE {wape:.2f}%")
print(f"MASE  model={mase(train,test,model_fc,m):.3f}   "      # < 1 beats naive
      f"naive={mase(train,test,naive_fc,m):.3f}")              # ~ 1 by definition
print(f"RMSSE model={rmsse(train,test,model_fc,m):.3f}")       # the M5 metric

# --- pinball / quantile loss from scratch (here for the median, q=0.5) ---
def pinball_loss(y_true, y_pred_q, q):
    d = y_true - y_pred_q
    return np.mean(np.maximum(q*d, (q-1)*d))
print(f"pinball(q=0.5)={pinball_loss(test, model_fc, 0.5):.3f}")
# sklearn also ships this directly:
from sklearn.metrics import mean_pinball_loss
print(f"sklearn pinball(q=0.9)={mean_pinball_loss(test, model_fc, alpha=0.9):.3f}")

# --- residual diagnostics with statsmodels ---
# from statsmodels.stats.diagnostic import acorr_ljungbox
# from statsmodels.stats.stattools import durbin_watson
# resid = test - model_fc
# print(acorr_ljungbox(resid, lags=[6]))   # small p-value => leftover autocorrelation
# print(durbin_watson(resid))              # ~2 = no autocorrelation, ~0 = positive

# --- probabilistic scoring (CRPS) with properscoring / scoringrules ---
# import properscoring as ps
# crps = ps.crps_ensemble(observation=test, forecasts=sample_paths).mean()
# (scoringrules.crps_normal(mu, sigma, y) for a parametric forecast)
`
  };

  window.CODEVIZ["met-forecasting"] = {
    question: "On a real-shaped monthly series split by time: how do MAE, sMAPE, MASE and interval coverage each score this forecast, and what do the WARNING shapes (MAPE blow-up, autocorrelated residuals, a model that loses to naive) look like?",
    charts: [
      {
        type: "line",
        title: "Healthy: forecast tracks actual, beats the naive baseline",
        xlabel: "future month index",
        ylabel: "value",
        series: [
          { name: "actual", color: "#7ee787", points: [[49, 195.5], [50, 199.1], [51, 209.2], [52, 202.7], [53, 205.6], [54, 209.4], [55, 204.7], [56, 192.8], [57, 175.5], [58, 178.6], [59, 184.4], [60, 206.0]] },
          { name: "model forecast", color: "#4ea1ff", points: [[49, 187.1], [50, 204.5], [51, 206.2], [52, 198.0], [53, 206.1], [54, 205.2], [55, 205.0], [56, 188.5], [57, 171.9], [58, 166.9], [59, 183.8], [60, 207.7]] },
          { name: "naive baseline", color: "#9aa7b4", points: [[49, 168.0], [50, 185.4], [51, 187.1], [52, 178.9], [53, 187.0], [54, 186.1], [55, 185.9], [56, 169.4], [57, 152.8], [58, 147.8], [59, 164.7], [60, 188.6]] }
        ],
        interpret: "X is the held-out month, Y is the value. The blue forecast hugs the green actual line, while the grey naive baseline ('repeat last year') sits well below it because it cannot see the year of growth. <b>Read it like this:</b> the vertical gap between blue and green is the error you pay; the gap between grey and green is the error the baseline pays. Blue's gap is much smaller, so the model is adding real skill — that is what MASE below 1 will confirm numerically."
      },
      {
        type: "bars",
        title: "MAE = average of the 12 per-month |error| bars (mean = 4.03)",
        labels: ["m49", "m50", "m51", "m52", "m53", "m54", "m55", "m56", "m57", "m58", "m59", "m60", "MAE"],
        values: [8.4, 5.4, 3.0, 4.7, 0.5, 4.2, 0.3, 4.3, 3.6, 11.7, 0.6, 1.7, 4.03],
        valueLabels: ["8.4", "5.4", "3.0", "4.7", "0.5", "4.2", "0.3", "4.3", "3.6", "11.7", "0.6", "1.7", "4.03"],
        colors: ["#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#9aa7b4", "#4ea1ff"],
        interpret: "Each grey bar is one month's absolute miss |actual − forecast|; the blue bar on the right is their average, the MAE. <b>Read it like this:</b> MAE literally is the height you'd get by levelling all the grey bars flat. Month 58 (11.7) towers over the rest — that single big miss is what would pull RMSE above MAE, because RMSE squares each bar before averaging. Watch for one giant bar dominating: it tells you the average is being driven by a few bad months, not a steady small error."
      },
      {
        type: "bars",
        title: "MASE = MAE / MAE_naive: your error measured in baseline-error units",
        labels: ["MAE model", "MAE naive (=scale)", "MASE = ratio"],
        values: [4.03, 21.82, 0.185],
        valueLabels: ["4.03", "21.82", "0.185"],
        colors: ["#4ea1ff", "#9aa7b4", "#7ee787"],
        interpret: "Left blue bar = the model's MAE (4.03). Middle grey bar = the naive baseline's MAE (21.82), which becomes the ruler. Right green bar = their ratio, MASE = 0.185. <b>Read it like this:</b> MASE asks 'how many baseline-errors big is my typical miss?' 0.185 means the model's error is about one-fifth of the baseline's — below 1 beats naive, above 1 loses. Because it is a ratio of two same-unit quantities it is unitless, so you can average it across a 5-unit product and a 5,000-unit product on one leaderboard."
      },
      {
        type: "bars",
        title: "All metrics agree: model (blue) beats naive (grey); lower is better",
        labels: ["MAE", "RMSE", "sMAPE %", "MASE"],
        series: [
          { name: "model", color: "#4ea1ff", points: [[0, 4.03], [1, 5.17], [2, 2.13], [3, 0.185]] },
          { name: "naive", color: "#9aa7b4", points: [[0, 21.82], [1, 22.25], [2, 11.88], [3, 1.003]] }
        ],
        interpret: "Four metrics side by side, blue model vs grey naive; in each pair lower is better. <b>Read it like this:</b> the blue bar is shorter in every group, so the verdict does not depend on which metric you happen to report. Note MASE-naive is ~1.00 by definition (the baseline scores 1 against itself), which is the anchor that makes the model's 0.185 meaningful. When metrics disagree it usually means a few large misses (RMSE up but MAE calm) or a near-zero actual (percentage metrics misbehave); here they line up, a sign of a clean result."
      },
      {
        type: "line",
        title: "90% interval coverage: 10 of 12 actuals inside the band (83%)",
        xlabel: "future month index",
        ylabel: "value",
        series: [
          { name: "actual", color: "#7ee787", points: [[49, 195.5], [50, 199.1], [51, 209.2], [52, 202.7], [53, 205.6], [54, 209.4], [55, 204.7], [56, 192.8], [57, 175.5], [58, 178.6], [59, 184.4], [60, 206.0]] },
          { name: "upper bound", color: "#ffb454", points: [[49, 194.7], [50, 212.1], [51, 213.8], [52, 205.6], [53, 213.7], [54, 212.8], [55, 212.6], [56, 196.1], [57, 179.5], [58, 174.5], [59, 191.4], [60, 215.3]] },
          { name: "lower bound", color: "#ffb454", points: [[49, 179.5], [50, 196.9], [51, 198.6], [52, 190.4], [53, 198.5], [54, 197.6], [55, 197.4], [56, 180.9], [57, 164.3], [58, 159.3], [59, 176.2], [60, 200.1]] }
        ],
        interpret: "The two orange lines are the lower and upper bounds of a nominal 90% prediction interval; green is the actual. <b>Read it like this:</b> count how many green points fall between the orange lines — here 10 of 12 (83%). A 90% interval should catch about 90%, so 83% is slightly over-confident (the band is a touch too narrow). The escapees are months 49 and 58, exactly the big-miss months from chart 2. Coverage near but below target means widen the band a little; far below means the model badly understates its own uncertainty."
      },
      {
        type: "bars",
        title: "What you might also see — MAPE blows up when an actual is near zero",
        labels: ["m1 y=80", "m2 y=60", "m3 y=2 (stockout)", "m4 y=95", "MAPE avg"],
        values: [6.3, 8.3, 400.0, 5.3, 105.0],
        valueLabels: ["6.3%", "8.3%", "400%!", "5.3%", "105%!"],
        colors: ["#9aa7b4", "#9aa7b4", "#ff7b72", "#9aa7b4", "#ff7b72"],
        interpret: "Illustrative. Per-point MAPE is |error| / |actual|; three normal months sit near 5–8%, but month 3 had an actual of only 2 (a stockout), so an 8-unit miss reads as 400%. <b>Read it like this:</b> a single near-zero actual hijacks the average — the headline MAPE jumps to 105% even though the forecast is fine elsewhere. The tell is one monstrous percentage bar next to small ones. Fix by switching to WAPE (total error ÷ total actual) or MASE, neither of which divides by a single tiny point."
      },
      {
        type: "scatter",
        title: "What you might also see — autocorrelated residuals (a slow wave, not noise)",
        xlabel: "month index",
        ylabel: "residual (actual − forecast)",
        groups: [
          { name: "residuals (drift in a wave)", color: "#ffb454",
            points: [[1, 1.2], [2, 3.0], [3, 4.1], [4, 4.6], [5, 3.9], [6, 2.2], [7, -0.2], [8, -2.6], [9, -4.0], [10, -4.5], [11, -3.7], [12, -1.8], [13, 0.6], [14, 2.8], [15, 4.0], [16, 4.5], [17, 3.6], [18, 1.6]] }
        ],
        lines: [ { color: "#9aa7b4", dash: true, points: [[1, 0], [18, 0]] } ],
        interpret: "Illustrative. Y is the residual (actual − forecast) at each month; the grey dashed line is zero, where healthy residuals should scatter randomly. <b>Read it like this:</b> instead of random dots these swing in a slow up-and-down wave, staying positive for a run then negative for a run. That is leftover structure the model failed to capture (an un-modelled trend or season). Durbin-Watson would come back near 0 (far from the healthy 2) and Ljung-Box would give a tiny p-value — both flag 'pattern remains'. The fix is a better model (add seasonality / trend), not a different metric."
      },
      {
        type: "bars",
        title: "What you might also see — a model that LOSES to naive (MASE > 1)",
        labels: ["MAE model", "MAE naive (=scale)", "MASE = ratio"],
        values: [27.0, 21.82, 1.24],
        valueLabels: ["27.0", "21.82", "1.24"],
        colors: ["#ff7b72", "#9aa7b4", "#ff7b72"],
        interpret: "Illustrative — the same MASE chart but for a worse model. The blue-position bar (now red, 27.0) is TALLER than the grey baseline (21.82), so the ratio is 1.24, above 1. <b>Read it like this:</b> MASE above 1 means your model's typical miss is bigger than just repeating last season — it has learned nothing useful and you should ship the naive forecast instead. This is the single most important sanity check: a glossy report quoting 'RMSE = 27' looks fine in isolation but is worthless once you see naive scores better. Always anchor to the baseline."
      }
    ],
    caption: "Split BY TIME (train months 1-48, test 49-60). Charts 1-5 are the healthy result; each chart's own interpretation explains how to read it. Charts 6-8 are 'what you might also see': the MAPE blow-up near a zero actual, residuals that wave instead of scatter (autocorrelation the diagnostics catch), and a model whose MASE climbs above 1 — i.e. it loses to naive. The healthy numbers are computed below; the warning charts are illustrative but qualitatively honest.",
    code: `import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error

# the 12 held-out months: actual, model forecast, seasonal-naive baseline
actual = np.array([195.5,199.1,209.2,202.7,205.6,209.4,
                   204.7,192.8,175.5,178.6,184.4,206.0])
model  = np.array([187.1,204.5,206.2,198.0,206.1,205.2,
                   205.0,188.5,171.9,166.9,183.8,207.7])
naive  = np.array([168.0,185.4,187.1,178.9,187.0,186.1,
                   185.9,169.4,152.8,147.8,164.7,188.6])

def mae(a,f):  return mean_absolute_error(a,f)
def rmse(a,f): return np.sqrt(mean_squared_error(a,f))
def smape(a,f):return 100*np.mean(np.abs(a-f)/((np.abs(a)+np.abs(f))/2))

# MAE is literally the mean of the per-month absolute errors (chart 2)
print("per-month |err|:", np.abs(actual-model).round(1).tolist())
print("MAE model:", round(mae(actual,model),3))      # 4.03

# MASE = MAE / MAE_naive: the naive baseline's error is the scale (chart 3)
scale = mae(actual,naive)                              # 21.82 = MASE denominator
print("MAE naive (scale):", round(scale,3))
print("MASE model:", round(mae(actual,model)/scale,3))# 0.185 -> beats naive
print("MASE naive:", round(mae(actual,naive)/scale,3))# 1.0 by definition

# all error metrics, model vs naive (chart 4)
for name,f in [("model",model),("naive",naive)]:
    print(name, "MAE",round(mae(actual,f),2),
          "RMSE",round(rmse(actual,f),2),
          "sMAPE",round(smape(actual,f),2),
          "MASE",round(mae(actual,f)/scale,3))

# 90% prediction interval coverage (chart 5)
sigma = (actual-model).std(ddof=1)                    # residual std = 4.59
hw = 1.645*sigma                                       # 90% half-width
lower, upper = model-hw, model+hw
inside = (actual>=lower) & (actual<=upper)
print("coverage:", int(inside.sum()), "/", len(actual),
      "=", round(100*inside.mean(),1), "%")            # 10/12 = 83.3%`
  };
})();
