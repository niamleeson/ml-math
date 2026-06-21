/* =====================================================================
   METRICS & EVALUATION LESSON — "Metrics for predicting numbers (regression)"
   BEGINNER audience. Self-contained: registers the lesson, its CODE, CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "met-regression",
    title: "Metrics for predicting numbers (regression)",
    tagline: "Your model guesses a number. These scores say how far off it usually is.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["ml-regression-metrics"],

    whenToUse:
      `<p><b>Reach for these whenever your model outputs a number</b> — a price, a temperature, a sales figure, a wait time — and you want to say "how wrong is it, typically?" The whole family answers that one question, but each member answers it in a slightly different way, so pick by what you care about.</p>
       <ul>
         <li><b>MAE (Mean Absolute Error)</b> — when you want the plain, typical miss in real units and you do <i>not</i> want a few weird points to dominate the score. MAE is the friendly default.</li>
         <li><b>RMSE (Root Mean Squared Error)</b> over MAE — when a big miss is much worse than several small ones. RMSE punishes large errors harder, so use it when outliers really hurt (a power grid, a budget).</li>
         <li><b>MAPE (Mean Absolute Percentage Error) / WAPE (Weighted Absolute Percentage Error)</b> — when a "10% off" error matters more than "$10 off", and your targets stay well away from zero. WAPE is the safer relative metric.</li>
         <li><b>MASE (Mean Absolute Scaled Error)</b> — when you compare forecasts across series on different scales. It divides your error by a naive forecast's error, giving a single unit-free number where below $1$ beats the naive baseline.</li>
         <li><b>R² (R-squared, the coefficient of determination) / explained variance</b> — when you want a unit-free "how much of the spread did we explain" number to compare models or report to stakeholders.</li>
         <li><b>Median absolute error</b> — when a handful of corrupt rows are in your test set and you want a typical error that ignores them entirely.</li>
         <li><b>Huber / quantile (pinball) / log-cosh</b> — when you are choosing a robust or asymmetric <i>training loss</i>, not just a report card.</li>
       </ul>
       <p>In practice you report two or three together — almost always MAE or RMSE in real units, plus R² for context.</p>`,

    application:
      `<p>These scores are the report card of every "predict a number" system. <b>Demand and sales forecasting</b> teams live on MAPE, WAPE, and MASE because they compare many products on different scales. <b>House-price, insurance, and cost models</b> quote RMSE and MAE in dollars so a stakeholder feels the typical miss. <b>Energy and weather</b> models watch RMSE because one huge error can blow a grid or a flight schedule. <b>Scientific fits</b> report R² and explained variance to say how much of the variation the model captures. <b>Robust pipelines</b> train with Huber or quantile loss so a few bad rows or a need for prediction intervals don't wreck the fit.</p>`,

    bigIdea:
      `<p>Every regression score starts from one number: the <b>residual</b>, the gap between truth and guess, $e_i = y_i - \\hat{y}_i$. Here $y_i$ is the true value for example $i$, $\\hat{y}_i$ (read "y-hat") is the model's prediction, and a residual of $+3$ means the truth was $3$ above the guess.</p>
       <p>A whole test set gives you a <i>pile</i> of residuals. A metric is just a recipe for boiling that pile down to one summary number. The recipes differ in how they treat a big error versus a small one, and whether they care about absolute size ($\\$5$) or relative size ($5\\%$).</p>
       <p><b>The two big design choices:</b> (1) take the <b>absolute</b> value of each error, or <b>square</b> it — squaring makes big misses count far more; (2) measure error in <b>raw units</b> or as a <b>percentage</b> of the truth — percentages break when the truth is near zero.</p>`,

    buildup:
      `<p>Let us define every member of the family. Throughout, $m$ is the number of examples, $y_i$ the truth, $\\hat{y}_i$ the prediction, $\\bar{y}$ the average of the truths, and $|x|$ means "the size of $x$, ignoring its sign" (so $|-4| = 4$).</p>
       <p><b>The error-size family (raw units):</b></p>
       <ul>
         <li><b>MAE (Mean Absolute Error)</b> $=\\frac1m\\sum_i |y_i-\\hat{y}_i|$. Average size of the miss, in the target's own units. Treats every error fairly: a miss of $10$ counts exactly ten times a miss of $1$.</li>
         <li><b>MSE (Mean Squared Error)</b> $=\\frac1m\\sum_i (y_i-\\hat{y}_i)^2$. Average of the <i>squared</i> errors. Squaring means a miss of $10$ counts $100$× a miss of $1$ — big errors dominate. Its units are the target <i>squared</i>, which is hard to read.</li>
         <li><b>RMSE (Root Mean Squared Error)</b> $=\\sqrt{\\text{MSE}}$. The square root puts MSE back into the target's units, so it is readable like MAE but still punishes big misses hard. RMSE is always $\\ge$ MAE; the gap between them grows when errors are uneven.</li>
         <li><b>RMSLE (Root Mean Squared Log Error)</b> $=\\sqrt{\\frac1m\\sum_i(\\log(1+y_i)-\\log(1+\\hat{y}_i))^2}$. Take the logarithm (the "how many times bigger" scale) before squaring. This makes the error <i>relative</i>: being off by a factor of $2$ costs the same whether the truth is $10$ or $10{,}000$, and it punishes under-prediction more than over-prediction.</li>
         <li><b>Median absolute error</b> $=\\text{median}_i\\,|y_i-\\hat{y}_i|$. The <i>middle</i> error rather than the average — half the errors are smaller, half larger. Completely ignores a few huge outliers, so it is the most robust "typical miss".</li>
         <li><b>Max error</b> $=\\max_i |y_i-\\hat{y}_i|$. The single worst miss. A worst-case guarantee: "we were never off by more than this".</li>
       </ul>
       <p><b>The percentage / scaled family (unit-free):</b></p>
       <ul>
         <li><b>MAPE (Mean Absolute Percentage Error)</b> $=\\frac1m\\sum_i\\left|\\frac{y_i-\\hat{y}_i}{y_i}\\right|$. The average error <i>as a fraction of the truth</i>. Reads as "we're off by 12% on average". <b>It divides by $y_i$, so it explodes when a truth is near zero.</b></li>
         <li><b>sMAPE (symmetric MAPE)</b> $=\\frac1m\\sum_i\\frac{|y_i-\\hat{y}_i|}{(|y_i|+|\\hat{y}_i|)/2}$. Divides by the average of truth and guess instead, so over- and under-prediction are treated more evenly and it is bounded — but it still misbehaves near zero.</li>
         <li><b>WAPE (Weighted Absolute Percentage Error)</b> $=\\frac{\\sum_i|y_i-\\hat{y}_i|}{\\sum_i|y_i|}$. Total error divided by total truth — one percentage for the whole set. Because it never divides by an individual $y_i$, it survives zeros and is the practitioner's favourite relative metric.</li>
         <li><b>MASE (Mean Absolute Scaled Error)</b> $=\\frac{\\text{MAE of your model}}{\\text{MAE of a naive forecast}}$. Divides your average miss by the miss of a dumb baseline (for time series, "predict yesterday's value"). MASE $\\lt  1$ means you beat the baseline; $=1$ means you tied it. Unit-free, so you can average it across products on wildly different scales.</li>
       </ul>
       <p><b>The "fraction explained" family:</b></p>
       <ul>
         <li><b>R² (coefficient of determination)</b> $=1-\\frac{\\sum_i(y_i-\\hat{y}_i)^2}{\\sum_i(y_i-\\bar{y})^2}$. Compares your squared error to the squared error of the dumbest model that always guesses the mean $\\bar{y}$. $R^2=1$ is perfect, $0$ is "no better than the mean", and <b>negative is worse than the mean</b>.</li>
         <li><b>Adjusted R²</b> $=1-(1-R^2)\\frac{m-1}{m-p-1}$, where $p$ is the number of input features. Plain R² never goes down when you add a feature, even a useless one; adjusted R² adds a penalty for each feature so junk predictors can lower it.</li>
         <li><b>Explained variance</b> $=1-\\frac{\\operatorname{Var}(y-\\hat{y})}{\\operatorname{Var}(y)}$, where $\\operatorname{Var}$ ("variance") measures spread. Almost identical to R², but it ignores any constant bias (a model always $5$ too high still scores well). If R² and explained variance differ, your model has a systematic offset.</li>
       </ul>
       <p><b>The robust / asymmetric losses</b> (used to <i>train</i> models, and also as report metrics):</p>
       <ul>
         <li><b>Huber loss</b>: squared error for small residuals, but switches to absolute (linear) error once a residual passes a cutoff $\\delta$ ("delta"). It is smooth like MSE near zero yet outlier-resistant like MAE in the tails — the best of both.</li>
         <li><b>Quantile / pinball loss</b>: weights over- and under-prediction <i>differently</i> by a chosen quantile $\\tau$ ("tau", between $0$ and $1$). Setting $\\tau=0.9$ trains a model whose prediction is exceeded only $10\\%$ of the time — that is how you get prediction intervals and risk-aware forecasts.</li>
         <li><b>Log-cosh loss</b> $=\\sum_i\\log(\\cosh(y_i-\\hat{y}_i))$ (where $\\cosh$ is the hyperbolic cosine). A smooth approximation to MAE: it behaves like squared error for tiny errors and like absolute error for large ones, with derivatives that are always nice for optimization.</li>
       </ul>
       <p><b>Agreement and bias:</b></p>
       <ul>
         <li><b>CCC (Concordance Correlation Coefficient)</b>: measures how well predictions both <i>track</i> the truth (correlation) <i>and</i> sit on the perfect $y=\\hat{y}$ line (no shift, no scale change). Plain correlation is fooled by a model that is always double the truth; CCC is not.</li>
         <li><b>Mean bias</b> $=\\frac1m\\sum_i(\\hat{y}_i-y_i)$. The <i>signed</i> average error. Unlike all the others it keeps the sign, so it tells you whether the model systematically over-predicts (positive) or under-predicts (negative). The error metrics tell you <i>how big</i>; bias tells you <i>which way</i>.</li>
       </ul>`,

    symbols: [
      { sym: "$y_i$", desc: "the true value for example $i$ (what actually happened)." },
      { sym: "$\\hat{y}_i$", desc: "the model's prediction for example $i$ (read \"y-hat\")." },
      { sym: "$e_i = y_i - \\hat{y}_i$", desc: "the residual: the gap between truth and guess for one example." },
      { sym: "$m$", desc: "the number of examples in the test set." },
      { sym: "$\\bar{y}$", desc: "the average of the true values — the baseline that R² compares against." },
      { sym: "$|x|$", desc: "the absolute value: the size of $x$ ignoring its sign, so $|-4| = 4$." },
      { sym: "$p$", desc: "the number of input features, used in the adjusted-R² penalty." },
      { sym: "$\\delta$", desc: "Huber's cutoff: residuals smaller than $\\delta$ are squared, larger ones are treated linearly." },
      { sym: "$\\tau$", desc: "the quantile for pinball loss (between $0$ and $1$); it tilts the penalty toward over- or under-prediction." }
    ],

    formula: `$$ \\text{MAE}=\\frac1m\\sum_i |y_i-\\hat{y}_i| \\qquad \\text{RMSE}=\\sqrt{\\frac1m\\sum_i (y_i-\\hat{y}_i)^2} \\qquad R^2 = 1-\\frac{\\sum_i (y_i-\\hat{y}_i)^2}{\\sum_i (y_i-\\bar{y})^2} $$`,

    whatItDoes:
      `<p><b>MAE</b> adds up the sizes of all the misses and averages them: the plain typical error, in the target's units, treating every mistake fairly.</p>
       <p><b>RMSE</b> squares each error before averaging (so a few big misses count much more), then takes the square root to return to readable units. RMSE $\\ge$ MAE always; a big gap between them is a red flag that a handful of errors dominate.</p>
       <p><b>R²</b> divides your model's total squared error by the squared error of always guessing the mean. Subtracting from $1$ gives the <i>fraction of the spread your model explains</i>: $1$ is perfect, $0$ is no better than the mean, negative means worse than the mean.</p>`,

    derivation:
      `<p><b>Why squaring vs absolute value changes the answer.</b></p>
       <ul class="steps">
         <li>Take two residuals, $1$ and $10$. Absolute error scores them $1$ and $10$ — the big one is ten times worse, in proportion to its size.</li>
         <li>Squared error scores them $1$ and $100$ — the big one is a hundred times worse. So <b>squaring (MSE, RMSE) makes outliers dominate</b>, while <b>absolute (MAE, median) treats errors in proportion</b>. That is the single most important difference in the whole family.</li>
         <li>This is also why the value that minimizes MSE is the <b>mean</b> of the targets, while the value that minimizes MAE is the <b>median</b> — and the median ignores extremes, which is exactly why median absolute error is so robust.</li>
       </ul>
       <p><b>Why percentage errors break near zero.</b></p>
       <ul class="steps">
         <li>MAPE divides each error by $y_i$. If a truth is $y_i = 0.01$ and you miss by $0.5$, that single term is $|0.5/0.01| = 50$, i.e. $5000\\%$ — one tiny-truth row can swamp the whole average.</li>
         <li>If any $y_i = 0$ exactly, you divide by zero and MAPE is undefined. <b>Fix:</b> use WAPE (divide by the <i>total</i> truth, never an individual one) or MASE (divide by a baseline's error), both of which survive zeros.</li>
       </ul>
       <p><b>Why R² can go negative.</b> $R^2 = 1 - \\frac{\\text{your squared error}}{\\text{mean's squared error}}$. On the training set your fitted model is at least as good as the mean, so the ratio is $\\le 1$ and $R^2 \\ge 0$. But on held-out data a bad model can have <i>more</i> squared error than the mean — then the ratio exceeds $1$ and $R^2 \\lt  0$. That is not a bug; it is a loud warning that the model is worse than guessing the average.</p>`,

    example:
      `<p>Five truths $y = 10, 20, 30, 40, 50$ (mean $\\bar{y} = 30$). Predictions $\\hat{y} = 12, 18, 33, 35, 90$ — good on the first four, badly off on the last.</p>
       <ul class="steps">
         <li>Residuals $y-\\hat{y} = -2, +2, -3, +5, -40$. The last one is a clear outlier.</li>
         <li><b>MAE</b> $= \\frac{2+2+3+5+40}{5} = \\frac{52}{5} = 10.4$. The typical miss, with the outlier counted in proportion.</li>
         <li><b>MSE</b> $= \\frac{4+4+9+25+1600}{5} = \\frac{1642}{5} = 328.4$. The $-40$ residual ($1600$ after squaring) is $97\\%$ of the total — squaring let one point dominate.</li>
         <li><b>RMSE</b> $= \\sqrt{328.4} \\approx 18.1$. Far above MAE ($10.4$): the gap screams "one big error is driving this".</li>
         <li><b>Median absolute error</b> $= \\text{median}(2,2,3,5,40) = 3$. The robust version barely notices the outlier.</li>
         <li><b>Max error</b> $= 40$. The worst single miss.</li>
         <li><b>Mean bias</b> $= \\frac1m\\sum(\\hat{y}-y) = \\frac{(2-2+3-5+40)}{5} = \\frac{38}{5} = 7.6$. Positive, so the model <i>over-predicts</i> on average — driven by that last point.</li>
         <li><b>R²:</b> $SS_{res} = 1642$, $SS_{tot} = (10\\!-\\!30)^2+\\dots+(50\\!-\\!30)^2 = 1000$. $R^2 = 1 - 1642/1000 = -0.642$ — <b>negative</b>, meaning this model does worse than just guessing the mean, thanks to the one wild miss.</li>
       </ul>
       <p>One outlier pulled RMSE, MSE, and R² to alarm; MAE and especially the median stayed calm. That contrast is the whole point of reporting more than one metric.</p>`,

    demo: function (host) {
      var c = (function () {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      })();
      // five fixed residuals; an outlier slider grows the last error
      var base = [-2, 2, -3, 5];
      var outlier = -40;
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      function metrics() {
        var e = base.concat([outlier]);
        var n = e.length, sumAbs = 0, sumSq = 0, sumSigned = 0, mx = 0;
        for (var i = 0; i < n; i++) { var a = Math.abs(e[i]); sumAbs += a; sumSq += e[i] * e[i]; sumSigned += -e[i]; if (a > mx) mx = a; }
        var abs = e.map(function (v) { return Math.abs(v); }).sort(function (a, b) { return a - b; });
        var med = abs[Math.floor(n / 2)];
        return { mae: sumAbs / n, mse: sumSq / n, rmse: Math.sqrt(sumSq / n), med: med, max: mx, bias: sumSigned / n };
      }

      function draw() {
        var W = 640, H = 300, padL = 40, padB = 40, padT = 16;
        ctx.clearRect(0, 0, W, H);
        var e = base.concat([outlier]);
        var maxAbs = 0; e.forEach(function (v) { maxAbs = Math.max(maxAbs, Math.abs(v)); });
        var midY = padT + (H - padT - padB) / 2;
        var barW = (W - padL - 16) / e.length;
        // zero line
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(W - 16, midY); ctx.stroke();
        ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "right"; ctx.fillText("residual 0", padL - 4, midY + 3);
        // bars = residuals
        for (var i = 0; i < e.length; i++) {
          var x = padL + i * barW + barW * 0.2;
          var h = (Math.abs(e[i]) / maxAbs) * ((H - padT - padB) / 2);
          ctx.fillStyle = (i === e.length - 1) ? c.warn : c.accent;
          if (e[i] >= 0) ctx.fillRect(x, midY - h, barW * 0.6, h);
          else ctx.fillRect(x, midY, barW * 0.6, h);
          ctx.fillStyle = c.dim; ctx.textAlign = "center";
          var labY = (e[i] >= 0) ? (midY - h - 4) : (midY + h + 14);
          ctx.fillText("e=" + e[i].toFixed(0), x + barW * 0.3, labY);
        }
        var m = metrics();
        readout.innerHTML = "Five residuals $e_i = y_i-\\hat{y}_i$; the orange bar is the outlier. " +
          "<b>MAE</b> = " + m.mae.toFixed(2) + " &nbsp; <b>RMSE</b> = " + m.rmse.toFixed(2) +
          " &nbsp; <b>median|e|</b> = " + m.med.toFixed(2) + " &nbsp; <b>max</b> = " + m.max.toFixed(2) +
          " &nbsp; <b>mean bias</b> = " + m.bias.toFixed(2) + ". " +
          "Drag the outlier: RMSE and max shoot up while MAE rises slowly and the median barely moves — that gap is how you spot outlier-driven error.";
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([readout]);
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "outlier residual (the 5th error): ";
      var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = outlier; lab.appendChild(span);
      var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = -80; inp.max = 5; inp.step = 1; inp.value = outlier;
      inp.addEventListener("input", function () { outlier = parseInt(inp.value, 10); span.textContent = outlier; draw(); });
      row.appendChild(lab); row.appendChild(inp);
      host.appendChild(row); host.appendChild(readout);
      draw();
    },

    practice: [
      {
        q: `Two house-price models are tested. Model A has MAE $\\$18$k and RMSE $\\$22$k. Model B has MAE $\\$16$k and RMSE $\\$41$k. Which would you trust more for a typical house, and what does the RMSE–MAE gap tell you about Model B?`,
        steps: [
          { do: `Compare MAE first.`, why: `MAE is the typical miss in dollars. Model B's is lower ($\\$16$k vs $\\$18$k), so on a normal house B is slightly better on average.` },
          { do: `Look at the gap between RMSE and MAE.`, why: `RMSE is always $\\ge$ MAE; a large gap means a few huge errors are inflating RMSE. A's gap is small ($\\$4$k); B's is huge ($\\$25$k).` },
          { do: `Decide based on what you fear.`, why: `B's big RMSE–MAE gap says it occasionally misses a house by a fortune. If a single catastrophic miss is unacceptable, prefer A despite its higher average.` }
        ],
        answer: `<p>For a <i>typical</i> house, Model B is marginally better (lower MAE). But B's RMSE ($\\$41$k) towers over its MAE ($\\$16$k), revealing a handful of catastrophic misses that A doesn't have (A's RMSE and MAE are close). If big errors are costly — and in pricing they usually are — trust <b>Model A</b>. Always report MAE <i>and</i> RMSE: the gap between them is the outlier signal.</p>`
      },
      {
        q: `A demand forecaster reports MAPE = 8% on most products but a single new product (true demand often $0$ or $1$ unit) shows MAPE = 4000%, dragging the company average up. What's going wrong, and which metric should they switch to?`,
        steps: [
          { do: `Recall MAPE's formula.`, why: `MAPE divides each error by the true value $y_i$. When $y_i$ is near zero, even a tiny absolute error becomes an enormous percentage.` },
          { do: `Spot the near-zero targets.`, why: `The new product's demand sits at $0$–$1$ unit; an error of $2$ units is $200\\%$ there, and a true $0$ makes MAPE divide by zero entirely.` },
          { do: `Pick a zero-safe relative metric.`, why: `WAPE divides total error by total demand (never an individual $y_i$), and MASE divides by a naive baseline's error — both survive zeros and small values.` }
        ],
        answer: `<p>MAPE is <b>breaking near zero</b>: dividing by the new product's tiny demand turns small absolute errors into thousands of percent. The metric is misleading, not the model. Switch to <b>WAPE</b> (total error ÷ total demand — one stable percentage for the whole catalog) or <b>MASE</b> (error scaled by a naive forecast), both of which handle zeros and let you compare products on different scales.</p>`
      },
      {
        q: `On a held-out test set, your regressor scores $R^2 = -0.15$. A teammate says "negative R² must be a bug — it's a probability, it can't go below zero." Are they right?`,
        steps: [
          { do: `Recall what R² actually compares.`, why: `$R^2 = 1 - \\frac{\\text{your squared error}}{\\text{error of always guessing the mean}}$. It is not a probability; it can be any value $\\le 1$.` },
          { do: `Reason about the negative case.`, why: `If your model's squared error exceeds the mean-baseline's error, the ratio is above $1$, so $R^2$ drops below $0$. On unseen data this is entirely possible.` },
          { do: `Interpret the warning.`, why: `$R^2 = -0.15$ means the model predicts the test set <i>worse</i> than just outputting the average — a sign of overfitting, leakage, or distribution shift.` }
        ],
        answer: `<p>The teammate is wrong. $R^2$ is <b>not a probability</b> and legitimately goes negative on held-out data: it just means your model has more squared error than the dumb "always predict the mean" baseline. $R^2 = -0.15$ is a real, useful warning that the model is worse than guessing the average — investigate overfitting, leakage, or a shifted test distribution, not a code bug.</p>`
      }
    ]
  });

  window.CODE["met-regression"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The real <code>scikit-learn</code> regression-metric API on a fitted model, plus the robust/asymmetric training losses. Every function takes <code>(y_true, y_pred)</code> and is meant to run on a held-out test set, in the target's own units.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge, HuberRegressor, QuantileRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, root_mean_squared_error,
    mean_absolute_percentage_error, r2_score, median_absolute_error,
    max_error, mean_pinball_loss, mean_tweedie_deviance)

X, y = load_diabetes(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.33, random_state=0)

model = make_pipeline(StandardScaler(), Ridge(alpha=1.0)).fit(X_tr, y_tr)
pred = model.predict(X_te)

# --- error-size family (real units) ---
print("MAE  :", mean_absolute_error(y_te, pred))            # average |miss|, robust-ish
print("MSE  :", mean_squared_error(y_te, pred))             # squared -> outliers dominate
print("RMSE :", root_mean_squared_error(y_te, pred))        # back in target units (sklearn>=1.4)
print("medAE:", median_absolute_error(y_te, pred))          # middle error, ignores outliers
print("maxE :", max_error(y_te, pred))                      # worst single miss

# --- percentage / relative family (break near zero!) ---
print("MAPE :", mean_absolute_percentage_error(y_te, pred)) # fraction; blows up if y~0
# WAPE: total error / total truth -- zero-safe, compute by hand
wape = np.abs(y_te - pred).sum() / np.abs(y_te).sum()
print("WAPE :", wape)
# sMAPE: symmetric version, also by hand
smape = (np.abs(y_te - pred) / ((np.abs(y_te) + np.abs(pred)) / 2)).mean()
print("sMAPE:", smape)

# --- fraction-explained family ---
print("R2       :", r2_score(y_te, pred))                   # can be NEGATIVE on test data
n, p = X_te.shape
adj_r2 = 1 - (1 - r2_score(y_te, pred)) * (n - 1) / (n - p - 1)
print("adj. R2  :", adj_r2)                                 # penalizes extra features

# --- mean bias: signed average error (which way are we off?) ---
print("mean bias:", np.mean(pred - y_te))                   # + = over-predict

# --- robust / asymmetric LOSSES used to TRAIN models ---
# Huber: squared near 0, linear in the tails -> outlier-resistant fit
huber = make_pipeline(StandardScaler(),
                      HuberRegressor()).fit(X_tr, y_tr)
# Quantile (pinball) loss: predict the 0.9 quantile for an upper bound
q90 = make_pipeline(StandardScaler(),
                    QuantileRegressor(quantile=0.9, alpha=0.0,
                                      solver="highs")).fit(X_tr, y_tr)
print("pinball@0.9:", mean_pinball_loss(y_te, q90.predict(X_te), alpha=0.9))
# RMSLE / log-cosh: not first-class metrics; RMSLE = RMSE of log1p targets
rmsle = root_mean_squared_error(np.log1p(np.maximum(y_te, 0)),
                                np.log1p(np.maximum(pred, 0)))
print("RMSLE:", rmsle)`
  };

  window.CODEVIZ["met-regression"] = {
    question: "On the real diabetes dataset, how close do a Ridge model's predictions land to the actual disease-progression values?",
    charts: [
      {
        type: "scatter",
        title: "Predicted vs actual disease progression (diabetes test set, with the perfect y=x line)",
        xlabel: "actual progression",
        ylabel: "predicted progression",
        groups: [
          {
            name: "test patients",
            color: "#4ea1ff",
            points: [[42.0, 129.6], [49.0, 127.2], [49.0, 89.6], [51.0, 83.4], [53.0, 82.0], [57.0, 45.3], [61.0, 118.2], [64.0, 117.2], [68.0, 202.7], [68.0, 113.9], [71.0, 115.8], [74.0, 90.2], [77.0, 77.4], [84.0, 123.1], [85.0, 150.6], [88.0, 107.2], [90.0, 143.7], [93.0, 83.5], [95.0, 146.6], [97.0, 110.4], [99.0, 235.5], [102.0, 110.4], [103.0, 146.3], [104.0, 78.0], [109.0, 171.4], [110.0, 165.9], [113.0, 151.8], [121.0, 169.6], [127.0, 164.4], [128.0, 65.6], [128.0, 98.9], [131.0, 162.2], [132.0, 261.7], [135.0, 121.4], [136.0, 158.3], [137.0, 96.9], [141.0, 148.0], [142.0, 149.6], [145.0, 128.4], [151.0, 162.8], [156.0, 162.3], [160.0, 114.5], [163.0, 217.3], [168.0, 142.4], [170.0, 134.3], [174.0, 167.7], [175.0, 182.5], [179.0, 111.5], [180.0, 220.7], [182.0, 138.6], [183.0, 109.1], [191.0, 188.3], [195.0, 236.7], [197.0, 207.6], [198.0, 183.5]]
          }
        ],
        lines: [
          { name: "perfect prediction (y = x)", color: "#ffb454", points: [[42, 42], [321, 321]] }
        ]
      }
    ],
    caption: "Ridge regression on the 442-patient diabetes data. Points hug the orange y=x line loosely: MAE = 44.96 (the typical miss), RMSE = 56.09 (bigger, so a few large errors weigh in), and R² = 0.403 (the model explains ~40% of the spread — far from perfect but well above the mean baseline).",
    code: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import (mean_absolute_error,
    root_mean_squared_error, r2_score)

X, y = load_diabetes(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.33, random_state=0)

model = make_pipeline(StandardScaler(), Ridge(alpha=1.0)).fit(X_tr, y_tr)
pred = model.predict(X_te)

print("MAE :", round(mean_absolute_error(y_te, pred), 2))   # 44.96
print("RMSE:", round(root_mean_squared_error(y_te, pred), 2)) # 56.09
print("R2  :", round(r2_score(y_te, pred), 3))              # 0.403

# scatter of predicted vs actual; the y=x line is perfect prediction
order = np.argsort(y_te)
sel = order[::max(1, len(order)//55)][:55]
pts = np.column_stack([y_te[sel], pred[sel]])
print("plotted (actual, predicted) points:", np.round(pts, 1).tolist())
print("y=x line spans:", [float(y_te.min()), float(max(y_te.max(), pred.max()))])`
  };
})();
