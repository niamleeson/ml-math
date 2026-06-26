(function () {
  window.LESSONS.push({
    id: "met-model-selection",
    title: "Criteria for choosing between models",
    tagline: "Every selection score is the same idea: reward fitting the data, then subtract a penalty for being complicated.",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: ["mlx-model-selection", "ml-regularization", "ml-bias-variance"],
    whenToUse:
      `<p><b>Model selection is the act of choosing one model from several candidates</b> — say, a linear fit versus a curvy one, or 5 features versus 50. The danger is <b>overfitting</b>: a more complex model <i>always</i> fits the data you already have at least as well, but that extra fit is often just memorizing noise, and it predicts <i>worse</i> on new data. A selection criterion is a single number that lets you compare candidates fairly by charging complexity a "tax".</p>
       <p><b>Which one to reach for:</b></p>
       <ul>
         <li><b>AIC (Akaike Information Criterion)</b> — when your goal is the best <i>predictions</i>. It is generous about keeping parameters, so it can over-select (pick a slightly-too-big model), but it predicts well.</li>
         <li><b>BIC (Bayesian Information Criterion)</b> — when you want the <i>simplest model that is really there</i>. Its penalty grows with sample size, so it prefers sparser models and, if the true model is among your candidates and you have lots of data, it recovers it.</li>
         <li><b>Cross-validation (CV)</b> — when you do not trust the formula's assumptions. It estimates out-of-sample error directly by holding data out. It assumes almost nothing, but costs many refits.</li>
         <li><b>Bayes factor / marginal likelihood</b> — when you are doing fully Bayesian comparison and want "how many times more probable is model A than model B, given the data".</li>
       </ul>
       <p><b>Use the same idea on every candidate, then pick the model with the best score</b> — lowest AIC/BIC, lowest CV loss, or highest evidence. The rest of this lesson defines each criterion and shows they are all "fit reward minus complexity penalty".</p>`,
    application:
      `<p>Model selection shows up the moment you have more than one candidate model — which is almost always.</p>
       <ul>
         <li><b>Choosing how many features or polynomial terms</b> to keep in a regression — AIC/BIC pick the elbow where extra terms stop earning their keep.</li>
         <li><b>Picking the number of clusters, mixture components, or hidden states</b> — BIC is the classic tie-breaker for "how many groups?".</li>
         <li><b>Comparing model families</b> (logistic vs. tree vs. boosting) — cross-validated loss is the assumption-light referee.</li>
         <li><b>Bayesian workflow</b> — WAIC (Widely Applicable Information Criterion) and PSIS-LOO (Pareto-Smoothed Importance Sampling Leave-One-Out) compare models fit by Markov-chain Monte Carlo; Bayes factors give odds between two hypotheses.</li>
         <li><b>Time-series and econometrics</b> — AIC/BIC choose the lag order of an ARIMA (AutoRegressive Integrated Moving Average) model.</li>
       </ul>
       <p>This builds on <a>[mlx-model-selection]</a> (the comparison workflow), <a>[ml-regularization]</a> (penalizing complexity to fight overfitting), and <a>[ml-bias-variance]</a> (why more complexity trades bias for variance).</p>`,
    pitfalls:
      `<ul>
         <li><b>Comparing scores across DIFFERENT datasets or transformed targets.</b> The tell: model A's AIC was computed on raw <code>y</code> and model B's on <code>log(y)</code>, or on different rows. AIC/BIC are only comparable when every candidate is scored on the <i>exact same data</i> with the <i>same likelihood</i>. A log transform changes the units of the likelihood, so the numbers are not on the same scale. Fix: same rows, same target, same likelihood family — or add the Jacobian of the transform back in.</li>
         <li><b>Forgetting that AIC over-fits and BIC under-fits.</b> The tell: you used AIC and shipped a model with a few useless parameters, or used BIC on small data and dropped a parameter that mattered. They disagree <i>by design</i> — AIC targets prediction, BIC targets recovering the true model. Fix: know your goal; when they disagree, prefer AIC for forecasting and BIC for a parsimonious explanation, and consider cross-validation as a tie-breaker.</li>
         <li><b>Mixing likelihood families.</b> The tell: comparing a Gaussian-error model's AIC to a Poisson model's AIC without checking they describe the same response. The log-likelihood must come from the <i>same family</i> for the constant terms to cancel. Fix: only compare models with the same likelihood, or use cross-validated predictive loss instead.</li>
         <li><b>Treating tiny AIC/BIC differences as decisive.</b> The tell: you picked model A because its AIC was 0.4 lower. A rule of thumb: a difference under about 2 is "barely worth mentioning". Fix: prefer the simpler model when scores are within a couple of units, and confirm with cross-validation's standard error.</li>
         <li><b>Using R² (R-squared) to compare models with different numbers of features.</b> The tell: adding a useless feature raised R². Plain R² <i>never decreases</i> when you add a feature, so it cannot detect overfitting. Fix: use <b>adjusted R²</b>, AIC, BIC, or cross-validation.</li>
       </ul>`,
    bigIdea:
      `<p>Every selection criterion in this lesson is built from the same two pieces:</p>
       <p style="text-align:center"><b>score = (how badly the model fits) + (a penalty for how complex the model is)</b></p>
       <p>The first piece rewards a model for explaining the data — usually measured by the <b>log-likelihood</b> (a number that is higher when the model thought the observed data was probable) or by the <b>residual sum of squares</b> (how far predictions miss). The second piece <i>taxes</i> the model for each parameter it uses. Because a more complex model can always drive the fit term down, the penalty is what stops you from picking the most complicated model every time.</p>
       <p>The criteria differ only in <b>how big the penalty is and how it is derived</b>. AIC uses a light, prediction-motivated penalty; BIC uses a heavier, sample-size-aware penalty; cross-validation skips the formula and measures out-of-sample error directly; the Bayes factor integrates over <i>all</i> parameter values so complexity penalizes itself automatically.</p>`,
    buildup:
      `<p>Imagine fitting polynomials of higher and higher degree to a scatter of points. Degree 1 (a line) may underfit. Degree 12 wiggles through every point — perfect on the training data, useless on new data. Somewhere in between is the <b>sweet spot</b>.</p>
       <p>If you only watched the fit term (residual sum of squares, or training error), it would keep dropping forever, telling you to use degree 12. The penalty term rises with degree. Their <b>sum</b> is U-shaped: it falls as the model goes from too-simple to just-right, then rises as the model goes from just-right to too-complex. The bottom of the U is the model you want. The CODEVIZ chart shows exactly this U for AIC and BIC.</p>
       <p>Now meet the whole family. They split into three groups:</p>
       <ul>
         <li><b>Information criteria (penalize a count of parameters):</b> AIC, AICc (small-sample-corrected AIC), BIC, plus Mallows' Cp and adjusted R² for linear regression.</li>
         <li><b>Bayesian / predictive criteria (use the posterior or held-out data):</b> DIC (Deviance Information Criterion), WAIC, the Bayes factor and marginal likelihood, and LOO / PSIS-LOO / ELPD (Expected Log Pointwise Predictive Density).</li>
         <li><b>Direct estimates of out-of-sample loss:</b> plain cross-validated loss and leave-one-out cross-validation (LOO).</li>
       </ul>
       <p>The "Under the hood" section below defines and gives the formula for <i>every</i> name in those lists.</p>`,
    symbols: [
      { sym: "$n$", desc: "the number of data points (rows) used to fit the model." },
      { sym: "$k$", desc: "the number of free parameters in the model — what you are penalizing for. For a degree-$d$ polynomial with Gaussian noise, $k = d+1$ coefficients $+\\,1$ for the error variance." },
      { sym: "$\\hat{L}$", desc: "the maximized likelihood: how probable the model thought the observed data was, at its best-fit parameters. The 'hat' means 'evaluated at the fitted values'." },
      { sym: "$\\ln \\hat{L}$", desc: "the natural log of that likelihood — the maximized <i>log-likelihood</i>. Logs turn products into sums and are easier to work with." },
      { sym: "$\\text{RSS}$", desc: "Residual Sum of Squares: $\\sum_i (y_i - \\hat{y}_i)^2$, the total squared miss between true values $y_i$ and predictions $\\hat{y}_i$. Smaller = better fit." },
      { sym: "$\\hat{\\sigma}^2$", desc: "the estimated noise variance (Greek 'sigma' squared), $=\\text{RSS}/n$ for a least-squares fit — the typical squared error left over." },
      { sym: "$D(\\theta) = -2\\ln p(y\\mid\\theta)$", desc: "the <b>deviance</b>: minus twice the log-likelihood at parameters $\\theta$. Lower deviance = better fit. It is the common 'fit term' inside AIC, BIC, DIC and WAIC." },
      { sym: "$p_{\\text{eff}}$", desc: "the <i>effective</i> number of parameters — for flexible or regularized models the count of 'real' free parameters is less than the raw count; DIC and WAIC estimate it from the data." },
      { sym: "$p(y\\mid M)$", desc: "the <b>marginal likelihood</b> (or <i>evidence</i>) of model $M$: the probability the model assigns to the data after averaging over <i>all</i> its parameter values, weighted by the prior." },
      { sym: "$\\text{BF}_{12}$", desc: "the <b>Bayes factor</b> comparing model 1 to model 2: $p(y\\mid M_1)\\,/\\,p(y\\mid M_2)$, the ratio of their evidences — 'how many times better model 1 explains the data'." }
    ],
    formula: `$$ \\text{AIC} = -2\\ln\\hat{L} + 2k \\qquad \\text{BIC} = -2\\ln\\hat{L} + k\\ln n \\qquad \\text{AICc} = \\text{AIC} + \\frac{2k(k+1)}{n-k-1} $$
$$ \\underbrace{-2\\ln\\hat{L}}_{\\text{fit: lower is better}} \\;+\\; \\underbrace{(\\text{penalty})\\times k}_{\\text{complexity tax}} \\qquad\\qquad \\text{BF}_{12} = \\frac{p(y\\mid M_1)}{p(y\\mid M_2)} = \\frac{\\int p(y\\mid\\theta_1)\\,p(\\theta_1)\\,d\\theta_1}{\\int p(y\\mid\\theta_2)\\,p(\\theta_2)\\,d\\theta_2} $$`,
    whatItDoes:
      `<p>The top row is the whole family in one line: a <b>fit term</b> $-2\\ln\\hat{L}$ (small when the model explains the data) plus a <b>complexity tax</b> proportional to the parameter count $k$. <b>Lower AIC/BIC is better.</b> Here is what each named criterion actually computes — every one is "fit + penalty":</p>
       <ul>
         <li><b>AIC (Akaike Information Criterion):</b> $-2\\ln\\hat{L} + 2k$. The penalty is a flat $2$ per parameter. Motivated by minimizing predictive information loss; aimed at <i>prediction</i>. Tends to keep slightly too many parameters as $n$ grows.</li>
         <li><b>AICc (corrected AIC):</b> AIC plus $\\dfrac{2k(k+1)}{n-k-1}$. The extra term is large when $n$ is small relative to $k$, so it penalizes complexity harder on small data. Use AICc whenever $n/k$ is small (a common rule: $n/k \\lt  40$). As $n\\to\\infty$ the correction vanishes and AICc $\\to$ AIC.</li>
         <li><b>BIC (Bayesian Information Criterion):</b> $-2\\ln\\hat{L} + k\\ln n$. The penalty $\\ln n$ grows with sample size, so for $n \\gt  7$ it is heavier than AIC's $2$. It is an approximation to $-2\\ln$ of the marginal likelihood. <b>Consistent:</b> if the true model is a candidate, BIC selects it as $n\\to\\infty$.</li>
         <li><b>DIC (Deviance Information Criterion):</b> $\\bar{D} + p_{\\text{eff}}$, where $\\bar{D}$ is the average deviance over the posterior and $p_{\\text{eff}}$ is the effective number of parameters. A Bayesian cousin of AIC computed from posterior samples; handy but known to misbehave for some models.</li>
         <li><b>WAIC (Widely Applicable Information Criterion):</b> a fully Bayesian, prediction-focused criterion. It sums the log of each point's posterior predictive density (the fit) and subtracts the posterior <i>variance</i> of that log-density summed over points (the effective-complexity penalty). Works for singular models where AIC/DIC fail.</li>
         <li><b>Mallows' Cp:</b> for linear regression, $C_p = \\dfrac{\\text{RSS}_p}{\\hat{\\sigma}^2_{\\text{full}}} - n + 2p$, where $\\text{RSS}_p$ is the residual sum of squares of a model with $p$ predictors and $\\hat{\\sigma}^2_{\\text{full}}$ is the noise estimate from the full model. A good model has $C_p \\approx p$. It is essentially AIC for Gaussian linear models.</li>
         <li><b>Adjusted R²:</b> $\\bar{R}^2 = 1 - (1-R^2)\\dfrac{n-1}{n-p-1}$. Ordinary $R^2$ never falls when you add a feature; the adjustment divides by remaining degrees of freedom so a useless feature <i>lowers</i> $\\bar{R}^2$. A built-in complexity penalty for linear regression.</li>
         <li><b>Deviance and pseudo-R²:</b> deviance $=-2\\ln\\hat{L}$ generalizes RSS to non-Gaussian models (logistic, Poisson). Since there is no true $R^2$ there, <i>pseudo-R²</i> approximates it. <b>McFadden's:</b> $1 - \\dfrac{\\ln\\hat{L}_{\\text{model}}}{\\ln\\hat{L}_{\\text{null}}}$, comparing the fitted log-likelihood to a null (intercept-only) model. <b>Nagelkerke's:</b> a rescaled version of Cox &amp; Snell's that is forced to reach a maximum of $1$, so it reads more like ordinary $R^2$.</li>
         <li><b>Bayes factor &amp; marginal likelihood (evidence):</b> the marginal likelihood $p(y\\mid M)=\\int p(y\\mid\\theta)\\,p(\\theta)\\,d\\theta$ averages the likelihood over <i>all</i> parameter values weighted by the prior. A complex model spreads its prior thin, so it is automatically penalized — this is the "Bayesian Occam's razor". The Bayes factor $\\text{BF}_{12}$ is the ratio of two evidences; values above $\\sim$3 are "substantial" and above $\\sim$10 "strong" evidence for model 1.</li>
         <li><b>MDL (Minimum Description Length) principle:</b> the best model is the one that lets you <i>compress</i> the data into the fewest total bits — bits to describe the model plus bits to describe the data's deviations from it. "Fit + complexity" reappears as "code length of residuals + code length of the model". For many models MDL coincides with BIC.</li>
         <li><b>LOO / cross-validated loss:</b> hold out each point (or each fold), predict it from the rest, and average the loss. <b>LOO (leave-one-out)</b> holds out one point at a time — nearly unbiased but expensive. <b>ELPD (Expected Log Pointwise Predictive Density)</b> is the Bayesian version: the summed log predictive density of held-out points; higher is better. <b>PSIS-LOO</b> approximates LOO cheaply from a single Bayesian fit using Pareto-Smoothed Importance Sampling, and flags points where the approximation is shaky. <b>Plain cross-validated loss</b> is the same idea with K folds and any loss you like.</li>
       </ul>`,
    derivation:
      `<p><b>Where AIC's "$2k$" comes from (gentle version).</b> Suppose the data really were generated by some true distribution. If you fit your model by maximum likelihood and then ask "how well will this model predict a fresh dataset?", the training log-likelihood is <i>optimistic</i> — it was tuned to this exact data. Akaike showed that, to first order, the optimism equals one unit of likelihood per parameter, i.e. the training $-2\\ln\\hat{L}$ undershoots the true predictive $-2\\ln\\hat{L}$ by about $2k$. So we <b>add $2k$ back</b> to correct it. That is the entire idea: AIC estimates out-of-sample deviance by penalizing each parameter the average amount it inflated the in-sample fit.</p>
       <ul class="steps">
         <li><b>BIC's "$k\\ln n$".</b> Start from the marginal likelihood $p(y\\mid M)=\\int p(y\\mid\\theta)p(\\theta)\\,d\\theta$ and approximate the integral with the Laplace method (a Gaussian bump around the best-fit $\\hat{\\theta}$). The bump's width shrinks like $1/\\sqrt{n}$ per parameter, contributing a $-\\tfrac{k}{2}\\ln n$ term. Multiply by $-2$ and you get $-2\\ln\\hat{L} + k\\ln n$ — BIC. So BIC is "$-2\\ln$ evidence" up to constants, which is why it is heavier for large $n$.</li>
         <li><b>Why AIC over-selects and BIC under-selects.</b> AIC's penalty $2$ is fixed; as $n$ grows the fit term grows like $n$ but the penalty does not, so AIC keeps tolerating extra parameters — it is <i>not</i> consistent but it is efficient for prediction. BIC's penalty $\\ln n\\to\\infty$, so eventually it drops every parameter that is not truly needed — it is <i>consistent</i> but can be too eager to simplify on small data.</li>
         <li><b>Why cross-validation needs no parameter count.</b> Instead of estimating the optimism with a formula, CV measures it: every held-out point is genuinely fresh data, so its loss is an honest sample of out-of-sample error. Leave-one-out CV is, for many models, asymptotically equivalent to AIC — the "$2k$" and "hold each point out" are two routes to the same correction. $\\blacksquare$</li>
       </ul>`,
    example:
      `<p>You fit two models to $n=100$ points. Model A is a line (2 coefficients $+1$ variance, so $k_A=3$); model B adds a quadratic term ($k_B=4$). Maximum log-likelihoods come out $\\ln\\hat{L}_A=-150.0$ and $\\ln\\hat{L}_B=-148.5$ — model B fits a bit better, as a bigger model always will.</p>
       <ul class="steps">
         <li><b>AIC.</b> $\\text{AIC}_A = -2(-150.0) + 2\\cdot3 = 300 + 6 = 306.0$. $\\text{AIC}_B = -2(-148.5) + 2\\cdot4 = 297 + 8 = 305.0$. B wins by $1.0$ — but that is under the "2" rule of thumb, so it is barely worth it.</li>
         <li><b>BIC</b> (penalty $\\ln 100 = 4.605$). $\\text{BIC}_A = 300 + 3\\cdot4.605 = 313.8$. $\\text{BIC}_B = 297 + 4\\cdot4.605 = 315.4$. Now <b>A wins</b> — BIC's heavier tax decides the extra term is not worth it. The two criteria disagree exactly because B's improved fit ($3$ units of $-2\\ln\\hat{L}$) beats AIC's penalty step ($2$) but loses to BIC's penalty step ($4.605$).</li>
         <li><b>AICc</b> for model B: $305.0 + \\dfrac{2\\cdot4\\cdot5}{100-4-1} = 305.0 + \\dfrac{40}{95} = 305.4$. The small-sample correction is tiny here because $n=100$ is comfortably larger than $k=4$; it would matter if $n$ were, say, $20$.</li>
         <li><b>The lesson:</b> the fit term favored the complex model, but the penalty term flipped the decision under BIC. When AIC and BIC disagree on such a thin margin, the honest move is the simpler model A (or a cross-validation check).</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
        warn: g("--warn", "#ffb454"), bad: g("--bad", "#ff7b72"),
        border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
      };
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginBottom = "8px";
      host.appendChild(rd);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 260; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var row = document.createElement("div"); row.style.margin = "10px 0";
      var lab = document.createElement("span"); lab.style.cssText = "color:" + col.dim + ";margin-right:8px;";
      var slider = document.createElement("input");
      slider.type = "range"; slider.min = "0"; slider.max = "9"; slider.value = "1"; slider.step = "1";
      slider.style.width = "260px"; slider.style.verticalAlign = "middle";
      row.appendChild(lab); row.appendChild(slider); host.appendChild(row);

      // Synthetic but illustrative: fit term (RSS-driven -2lnL) falls then flattens;
      // AIC = fit + 2k, BIC = fit + k*ln(n). Penalties make the SUM U-shaped.
      var n = 50;
      // a "fit" curve that drops fast then flattens (diminishing returns of more terms)
      function fitTerm(d) { return 120 * Math.exp(-d * 0.9) + 40; } // arbitrary illustrative units
      function k(d) { return d + 2; }
      function aic(d) { return fitTerm(d) + 2 * k(d); }
      function bic(d) { return fitTerm(d) + k(d) * Math.log(n); }
      var degs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var aicV = degs.map(aic), bicV = degs.map(bic);
      // find minima
      function argmin(a) { var m = 0; for (var i = 1; i < a.length; i++) if (a[i] < a[m]) m = i; return m; }
      var aicMin = argmin(aicV), bicMin = argmin(bicV);

      function draw() {
        var sel = +slider.value;
        ctx.clearRect(0, 0, 640, 260);
        var L = 60, R = 620, T = 20, B = 220;
        var lo = Math.min.apply(null, aicV.concat(bicV)) - 5;
        var hi = Math.max.apply(null, aicV.concat(bicV)) + 5;
        function X(d) { return L + (R - L) * (d / 9); }
        function Y(v) { return B - (B - T) * (v - lo) / (hi - lo); }
        // axes
        ctx.strokeStyle = col.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("polynomial degree (model complexity) →", (L + R) / 2, 250);
        ctx.save(); ctx.translate(18, (T + B) / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText("criterion (lower = better)", 0, 0); ctx.restore();
        for (var d = 0; d <= 9; d++) { ctx.fillText(String(d), X(d), B + 14); }
        // plot a line
        function line(vals, color) {
          ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
          for (var i = 0; i < vals.length; i++) { var x = X(degs[i]), y = Y(vals[i]); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
          ctx.stroke();
          for (var j = 0; j < vals.length; j++) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X(degs[j]), Y(vals[j]), 3, 0, 7); ctx.fill(); }
        }
        line(aicV, col.accent); line(bicV, col.warn);
        // mark minima
        ctx.strokeStyle = col.accent; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(X(aicMin), T); ctx.lineTo(X(aicMin), B); ctx.stroke();
        ctx.strokeStyle = col.warn; ctx.beginPath(); ctx.moveTo(X(bicMin), T); ctx.lineTo(X(bicMin), B); ctx.stroke();
        ctx.setLineDash([]);
        // selected degree marker
        ctx.strokeStyle = col.accent2; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(X(sel), Y(aicV[sel]), 6, 0, 7); ctx.stroke();
        // legend
        ctx.textAlign = "left";
        ctx.fillStyle = col.accent; ctx.fillText("● AIC", R - 150, T + 6);
        ctx.fillStyle = col.warn; ctx.fillText("● BIC", R - 80, T + 6);
        lab.textContent = "degree = " + sel;
        var region = sel < bicMin ? "<b style='color:" + col.bad + "'>too simple (underfit)</b> &mdash; the fit term is still falling fast, so adding a term lowers both scores."
          : (sel > aicMin ? "<b style='color:" + col.bad + "'>too complex (overfit)</b> &mdash; the fit barely improves but the penalty keeps rising, so both scores climb."
            : "<b style='color:" + col.accent2 + "'>near the sweet spot</b> &mdash; the U bottoms out here. AIC bottoms at degree " + aicMin + ", BIC (heavier penalty) at degree " + bicMin + ".");
        rd.innerHTML = "Both curves are U-shaped: fit improves then the complexity tax wins. " + region;
      }
      slider.addEventListener("input", draw);
      draw();
    },
    practice: [
      {
        q: `You fit a model with k = 5 parameters to n = 200 points and get a maximized log-likelihood of -310. Compute its AIC and BIC, and say which criterion penalizes complexity more here.`,
        steps: [
          { do: `Write the fit term: $-2\\ln\\hat{L} = -2(-310) = 620$.`, why: `Both AIC and BIC share this same fit term; only the penalty differs.` },
          { do: `AIC penalty $= 2k = 2\\cdot5 = 10$, so $\\text{AIC} = 620 + 10 = 630$.`, why: `AIC charges a flat 2 per parameter regardless of sample size.` },
          { do: `BIC penalty $= k\\ln n = 5\\cdot\\ln 200 = 5\\cdot5.298 = 26.49$, so $\\text{BIC} = 620 + 26.49 = 646.5$.`, why: `BIC's penalty grows with $\\ln n$; at $n=200$ that is $5.298$ per parameter, far more than AIC's 2.` }
        ],
        answer: `AIC = 630, BIC = 646.5. BIC penalizes complexity much more here because its per-parameter penalty $\\ln 200 = 5.298$ is larger than AIC's flat 2. That is why BIC tends to pick sparser models than AIC, especially as $n$ grows.`
      },
      {
        q: `A logistic regression has fitted log-likelihood -120 and a null (intercept-only) log-likelihood of -200. Compute McFadden's pseudo-R², and explain in one sentence why an ordinary R² does not apply here.`,
        steps: [
          { do: `Recall McFadden's formula: $1 - \\dfrac{\\ln\\hat{L}_{\\text{model}}}{\\ln\\hat{L}_{\\text{null}}}$.`, why: `It compares the fitted model's log-likelihood to a baseline that uses only the overall rate, just as $R^2$ compares to the mean.` },
          { do: `Plug in: $1 - \\dfrac{-120}{-200} = 1 - 0.60 = 0.40$.`, why: `The ratio of log-likelihoods is 0.60, so the model 'explains away' 40% of the null deviance.` },
          { do: `Note that logistic regression predicts probabilities, not a continuous $y$, so there is no residual sum of squares to form an ordinary $R^2$.`, why: `Pseudo-R² stands in for $R^2$ by working on the likelihood scale instead.` }
        ],
        answer: `McFadden's pseudo-R² $= 1 - (-120)/(-200) = 0.40$. Ordinary R² does not apply because the response is binary — there is no residual sum of squares — so we use a likelihood-based pseudo-R² (McFadden's, or Nagelkerke's rescaled-to-1 version) instead. Values of 0.2–0.4 are considered a good fit on McFadden's scale.`
      },
      {
        q: `Two models for the same dataset have marginal likelihoods (evidences) $p(y\\mid M_1) = 4\\times10^{-8}$ and $p(y\\mid M_2) = 1\\times10^{-8}$. Compute the Bayes factor and interpret it. Why is the evidence automatically a complexity penalty?`,
        steps: [
          { do: `Bayes factor $\\text{BF}_{12} = p(y\\mid M_1)/p(y\\mid M_2) = (4\\times10^{-8})/(1\\times10^{-8}) = 4$.`, why: `It is just the ratio of the two evidences — how many times more probable the data is under $M_1$.` },
          { do: `Read the scale: BF $\\approx 4$ is 'substantial' (roughly 3–10) but not 'strong' (10+) evidence for $M_1$.`, why: `Bayes factors are graded on conventional thresholds; 4 means $M_1$ is moderately favored, not decisively.` },
          { do: `Note the evidence integrates the likelihood over ALL parameter values weighted by the prior, so a model with many parameters spreads its prior thin and pays for unused flexibility.`, why: `This 'Bayesian Occam's razor' means evidence already balances fit against complexity — no explicit parameter count is added.` }
        ],
        answer: `$\\text{BF}_{12} = 4/1 = 4$: substantial (but not strong) evidence favoring $M_1$. The marginal likelihood penalizes complexity automatically because it averages the likelihood over the whole prior — a more flexible model dilutes its prior probability across many parameter values, so it is rewarded only if that flexibility genuinely improves the fit. That is the built-in Occam's razor.`
      }
    ]
  });

  window.CODE["met-model-selection"] = {
    lib: "statsmodels",
    runnable: false,
    explain: `<p>Three ways practitioners actually compute selection criteria: from scratch from the log-likelihood (so you see the formula), straight off a fitted <code>statsmodels</code> model via <code>.aic</code> / <code>.bic</code>, and via scikit-learn's cross-validated scoring. The last block notes how <code>arviz</code> gives WAIC and PSIS-LOO for Bayesian models.</p>`,
    code: `import numpy as np
import statsmodels.api as sm
from sklearn.datasets import load_diabetes
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression

X, y = load_diabetes(return_X_y=True)
x = X[:, 8].reshape(-1, 1)      # one feature (s5), the clearest U-shape
n = len(y)

# --- 1. AIC / BIC FROM SCRATCH, from the Gaussian log-likelihood ---------------
def aic_bic_from_scratch(y, yhat, k):
    n = len(y)
    rss = float(np.sum((y - yhat) ** 2))
    # maximized Gaussian log-likelihood with sigma^2 = RSS/n
    ll = -0.5 * n * (np.log(2 * np.pi) + np.log(rss / n) + 1)
    aic = -2 * ll + 2 * k
    bic = -2 * ll + k * np.log(n)
    return aic, bic

for deg in (1, 2, 3, 4, 6):
    Xd = np.hstack([x ** p for p in range(deg + 1)])   # design matrix incl. intercept
    beta, *_ = np.linalg.lstsq(Xd, y, rcond=None)
    yhat = Xd @ beta
    k = (deg + 1) + 1                                   # coefficients + variance param
    aic, bic = aic_bic_from_scratch(y, yhat, k)
    print(f"deg {deg}: from-scratch AIC={aic:.1f}  BIC={bic:.1f}")

# --- 2. statsmodels gives .aic / .bic directly ---------------------------------
Xd = sm.add_constant(np.hstack([x ** p for p in range(1, 4)]))   # cubic
ols = sm.OLS(y, Xd).fit()
print("statsmodels cubic  AIC=%.1f  BIC=%.1f" % (ols.aic, ols.bic))
# For a GLM (e.g. logistic / Poisson) the same .aic / .bic attributes exist,
# and ols.llf is the maximized log-likelihood, ols.deviance the deviance.

# --- 3. scikit-learn: cross-validated loss (assumption-light selection) ---------
for deg in (1, 2, 3, 4, 6):
    pipe = make_pipeline(StandardScaler(),
                         PolynomialFeatures(deg, include_bias=False),
                         LinearRegression())
    # negative MSE so that 'higher is better'; flip the sign to report MSE
    mse = -cross_val_score(pipe, x, y, cv=5,
                           scoring="neg_mean_squared_error").mean()
    print(f"deg {deg}: 5-fold CV MSE = {mse:.0f}")

# --- 4. Bayesian models: WAIC and PSIS-LOO via arviz ---------------------------
# After sampling a model with PyMC / Stan into an InferenceData object 'idata':
#   import arviz as az
#   az.waic(idata)              # WAIC: elpd_waic and effective params p_waic
#   az.loo(idata)              # PSIS-LOO: elpd_loo, p_loo, and Pareto-k diagnostics
#   az.compare({"m1": idata1, "m2": idata2}, ic="loo")   # rank models by ELPD`
  };

  window.CODEVIZ["met-model-selection"] = {
    question: "One feature of load_diabetes, polynomials of growing degree. See the healthy read — AIC/BIC U-curves and the bias-variance split both bottoming at degree 3 — then the cases you actually meet: AIC and BIC disagreeing on which model wins, a validation curve that never turns down (underfit), and one that explodes (severe overfit). Where is the sweet spot, and how do you spot trouble?",
    charts: [
      {
        type: "line",
        title: "Healthy: AIC = 2k - 2lnL and BIC = k ln n - 2lnL both dip to a min at degree 3",
        xlabel: "polynomial degree (model complexity)",
        ylabel: "criterion value (lower = better)",
        series: [
          { name: "AIC (min deg 3)", color: "#4ea1ff", points: [[1, 3675.4], [2, 3676.2], [3, 3663.4], [4, 3665.4], [5, 3667.1], [6, 3669.0], [7, 3670.8], [8, 3671.6]] },
          { name: "BIC (min deg 3)", color: "#ffb454", points: [[1, 3687.7], [2, 3692.6], [3, 3683.9], [4, 3689.9], [5, 3695.7], [6, 3701.8], [7, 3707.6], [8, 3712.5]] }
        ],
        interpret: "X-axis is model complexity (polynomial degree); y-axis is the criterion (lower = better). Each curve = a fit term that drops as the model improves, plus a complexity tax that rises with each parameter. <b>Read the bottom of the U as the model to pick.</b> Both dip to a minimum at degree 3, then climb — before 3 the model is too simple, after 3 the fit barely improves while the tax keeps rising (overfitting). BIC (orange) sits higher and climbs faster because its tax, ln(442) ≈ 6.09 per parameter, is heavier than AIC's flat 2."
      },
      {
        type: "line",
        title: "Healthy: training MSE keeps falling, validation MSE is U-shaped (min deg 3)",
        xlabel: "polynomial degree (model complexity)",
        ylabel: "mean squared error (5-fold CV)",
        series: [
          { name: "training MSE (always drops)", color: "#7ee787", points: [[1, 4028], [2, 4016], [3, 3881], [4, 3880], [5, 3877], [6, 3875], [7, 3870], [8, 3857]] },
          { name: "validation MSE (U: sweet spot deg 3)", color: "#ff7b72", points: [[1, 4061], [2, 4057], [3, 3951], [4, 3957], [5, 3963], [6, 3988], [7, 4393], [8, 5259]] }
        ],
        interpret: "The same story with no formula, using held-out error. Green (training MSE) falls forever — a more complex model always fits the data it has seen. Red (validation MSE, on unseen folds) bottoms out at degree 3 then shoots up. <b>Read the widening gap between green and red as the amount of overfitting.</b> Pick the degree where the red curve is lowest (3): past it the model is memorizing noise. Both the formula (AIC/BIC) and this measurement agree on degree 3."
      },
      {
        type: "bars",
        title: "Healthy: AIC vs BIC across 5 candidates — pick the lowest bar (degree 3 wins both)",
        labels: ["deg 1", "deg 2", "deg 3", "deg 4", "deg 6"],
        series: [
          { name: "AIC", color: "#4ea1ff", points: [[0, 3675.4], [1, 3676.2], [2, 3663.4], [3, 3665.4], [4, 3669.0]] },
          { name: "BIC", color: "#ffb454", points: [[0, 3687.7], [1, 3692.6], [2, 3683.9], [3, 3689.9], [4, 3701.8]] }
        ],
        interpret: "Each pair of bars is one candidate model; blue = AIC, orange = BIC. <b>The rule is simply 'pick the lowest bar'.</b> Degree 3 has the smallest AIC (3663.4) AND the smallest BIC (3683.9), so it wins under both criteria — an easy, unambiguous decision. When the lowest AIC and lowest BIC land on the same model like this, you can ship it with confidence."
      },
      {
        type: "bars",
        title: "What you might see: AIC and BIC DISAGREE — AIC picks deg 4, BIC picks deg 2",
        labels: ["deg 1", "deg 2", "deg 3", "deg 4", "deg 5"],
        series: [
          { name: "AIC (min deg 4)", color: "#4ea1ff", points: [[0, 312.0], [1, 308.0], [2, 306.5], [3, 305.8], [4, 306.2]] },
          { name: "BIC (min deg 2)", color: "#ffb454", points: [[0, 318.5], [1, 314.0], [2, 315.5], [3, 318.0], [4, 322.0]] }
        ],
        interpret: "<b>Illustrative.</b> Here the lowest blue bar (AIC) is at degree 4 but the lowest orange bar (BIC) is at degree 2 — the two criteria <b>point at different models</b>. This happens by design: AIC's light penalty tolerates extra parameters (good for prediction, tends to over-select), while BIC's heavier ln(n) penalty prefers simpler models (good for finding the 'true' model). <b>Recognise it when the two lowest bars don't line up.</b> Resolve it by your goal — AIC for forecasting, BIC for a parsimonious explanation — or break the tie with cross-validation."
      },
      {
        type: "line",
        title: "What you might see: UNDERFIT — validation MSE never turns down, just flattens",
        xlabel: "polynomial degree (model complexity)",
        ylabel: "mean squared error (held-out)",
        series: [
          { name: "training MSE", color: "#7ee787", points: [[1, 5200], [2, 5150], [3, 5120], [4, 5100], [5, 5090], [6, 5085], [7, 5082], [8, 5080]] },
          { name: "validation MSE (no clear dip)", color: "#ff7b72", points: [[1, 5300], [2, 5260], [3, 5240], [4, 5235], [5, 5235], [6, 5238], [7, 5242], [8, 5248]] }
        ],
        interpret: "<b>Illustrative.</b> Both curves stay high and nearly flat, and validation MSE has <b>no clear bottom</b> — it just plateaus and the train/validation gap stays small. <b>Read this as underfitting: none of these models capture the signal, so adding degree barely helps.</b> Unlike the healthy chart, there is no obvious 'sweet spot' degree to pick. The fix is more expressive models or better features, not fiddling with the polynomial degree among options that are all too weak."
      },
      {
        type: "line",
        title: "What you might see: SEVERE OVERFIT — validation MSE explodes past the sweet spot",
        xlabel: "polynomial degree (model complexity)",
        ylabel: "mean squared error (held-out)",
        series: [
          { name: "training MSE (drops to ~0)", color: "#7ee787", points: [[1, 4000], [2, 3700], [3, 3500], [4, 2800], [5, 1600], [6, 700], [7, 150], [8, 20]] },
          { name: "validation MSE (blows up)", color: "#ff7b72", points: [[1, 4100], [2, 3950], [3, 3900], [4, 4600], [5, 7200], [6, 14000], [7, 31000], [8, 78000]] }
        ],
        interpret: "<b>Illustrative.</b> Training MSE (green) drives toward zero — the model memorizes every point — while validation MSE (red) bottoms early (degree 3) then <b>explodes by orders of magnitude</b>. <b>Recognise severe overfitting by the huge, ever-widening gap between the two curves.</b> The high-degree wiggles fit the training noise but predict wildly on new data. Pick the degree at the red minimum and ignore the lower training error; regularization or fewer features would tame the blow-up."
      }
    ],
    caption: "Read each chart by its own caption below it. Real numbers (charts 1–3) from load_diabetes, one feature (s5), n=442: the AIC/BIC U-curves, the bias-variance train-vs-validation split, and the candidate bars all agree that degree 3 is the sweet spot — both criteria = a fit term -2lnL = n ln(RSS/n) plus a complexity tax (2k for AIC, k ln n for BIC). Charts 4–6 are the situations you actually meet, all illustrative: AIC and BIC disagreeing on the winner (light vs heavy penalty), an underfit validation curve that never turns down, and a severe-overfit curve that explodes past the minimum. In every case the rule is the same — pick the model at the bottom of the U, and treat falling training error alone as a warning, not a win.",
    code: `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import KFold

d = load_diabetes()
y = d.target
x = d.data[:, 8]                       # one feature: s5 (clearest dip)
xs = (x - x.mean()) / x.std()          # standardize for a stable polynomial fit
n = len(y)
kf = KFold(n_splits=5, shuffle=True, random_state=0)

aic, bic, train_mse, val_mse = [], [], [], []
for deg in range(1, 9):
    # design matrix of powers 0..deg (Vandermonde), fit by least squares
    Xd = np.vander(xs, deg + 1, increasing=True)
    beta, *_ = np.linalg.lstsq(Xd, y, rcond=None)
    rss = float(np.sum((y - Xd @ beta) ** 2))
    k = (deg + 1) + 1                   # coefficients + 1 variance parameter
    # Gaussian-MLE AIC/BIC straight from RSS:
    #   -2 lnL = n*ln(RSS/n) + const ; the const cancels when comparing degrees
    fit = n * np.log(rss / n)
    aic.append(round(fit + 2 * k, 1))
    bic.append(round(fit + k * np.log(n), 1))

    # train vs validation MSE: bias-variance via 5-fold cross-validation
    tr, va = [], []
    for tri, vai in kf.split(xs):
        Xt = np.vander(xs[tri], deg + 1, increasing=True)
        Xv = np.vander(xs[vai], deg + 1, increasing=True)
        b, *_ = np.linalg.lstsq(Xt, y[tri], rcond=None)
        tr.append(np.mean((y[tri] - Xt @ b) ** 2))
        va.append(np.mean((y[vai] - Xv @ b) ** 2))
    train_mse.append(round(np.mean(tr)))
    val_mse.append(round(np.mean(va)))

print("AIC:", aic)               # [3675.4, 3676.2, 3663.4, ...]; min at degree 3
print("BIC:", bic)               # [3687.7, 3692.6, 3683.9, ...]; min at degree 3
print("train MSE:", train_mse)   # [4028, 4016, 3881, ...] keeps falling
print("val   MSE:", val_mse)     # [4061, 4057, 3951, ...] U-shaped, min at degree 3
print("AIC/BIC min degree:", int(np.argmin(aic)) + 1, int(np.argmin(bic)) + 1)
print("validation min degree:", int(np.argmin(val_mse)) + 1)`
  };
})();
