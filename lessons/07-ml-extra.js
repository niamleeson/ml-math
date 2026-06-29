/* =====================================================================
   MODULE 7 — MACHINE LEARNING — MORE.
   Extra CS229-flavored lessons: Newton's method, locally weighted
   regression, cross-validation, model selection, clustering quality,
   and error analysis.
   Style copied from 02-ml.js / 00-foundations.js:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real derivation ending in ∎
     - a real-world application
     - a bespoke, theme-aware demo that renders on load
   ===================================================================== */
(function () {
const M = "Machine Learning — more";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* shared little helpers for the bespoke demos -------------------------- */
function THEME() {
  var s = getComputedStyle(document.documentElement);
  var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
  return {
    ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
    accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
    warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
    border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
  };
}
function makeSlider(host, label, min, max, val, step, onChange) {
  var row = document.createElement("div"); row.style.margin = "6px 0";
  var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " ";
  var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = (+val).toFixed(2); lab.appendChild(span);
  var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = min; inp.max = max; inp.step = step; inp.value = val;
  inp.addEventListener("input", function () { var v = parseFloat(inp.value); span.textContent = v.toFixed(2); onChange(v); });
  row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
  return inp;
}

/* ============================ 1. NEWTON ============================== */
L({
  id: "mlx-newton",
  demo: function (host) {
    // Minimize a clean convex bowl with an offset minimum at x = 2.
    var a = 0.6;                                         // curvature factor
    function f(x) { return a * (x - 2) * (x - 2) + 1; }  // min at x = 2, f = 1
    function fp(x) { return 2 * a * (x - 2); }           // first derivative
    function fpp(x) { return 2 * a; }                    // second derivative (constant)
    var startX = -3.5, lr = 0.08;

    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

    var xmin = -5, xmax = 7, padL = 36, padR = 18, padT = 16, padB = 28, W = 640, H = 340;
    var ymin = 0, ymax = f(xmin);
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function newtonSteps() {
      var pts = [startX], x = startX;
      for (var i = 0; i < 8; i++) {
        var g2 = fpp(x); if (Math.abs(g2) < 1e-9) break;
        x = x - fp(x) / g2;
        pts.push(x);
        if (Math.abs(fp(x)) < 1e-6) break;
      }
      return pts;
    }
    function gdSteps() {
      var pts = [startX], x = startX;
      for (var i = 0; i < 40; i++) {
        x = x - lr * fp(x);
        if (!isFinite(x)) break;
        pts.push(x);
        if (Math.abs(fp(x)) < 1e-4) break;
      }
      return pts;
    }

    function render() {
      var c = THEME(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      var first = true;
      for (var i = 0; i <= 240; i++) { var x = xmin + (xmax - xmin) * i / 240; var y = f(x); if (first) { ctx.moveTo(PX(x), PY(y)); first = false; } else ctx.lineTo(PX(x), PY(y)); }
      ctx.stroke();
      ctx.fillStyle = c.accent2; ctx.beginPath(); ctx.arc(PX(2), PY(1), 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("minimum", PX(2), PY(1) + 20);

      var gd = gdSteps();
      ctx.strokeStyle = c.warn + "88"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (var k = 0; k < gd.length; k++) { var X = PX(gd[k]), Y = PY(f(gd[k])); if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
      ctx.stroke();
      for (var k2 = 0; k2 < gd.length; k2++) { ctx.fillStyle = c.warn; ctx.beginPath(); ctx.arc(PX(gd[k2]), PY(f(gd[k2])), 2.5, 0, Math.PI * 2); ctx.fill(); }

      var nt = newtonSteps();
      for (var s = 0; s < nt.length - 1; s++) {
        var x0 = nt[s];
        var fx0 = f(x0), g1 = fp(x0), g2 = fpp(x0);
        ctx.strokeStyle = c.purple + "66"; ctx.lineWidth = 1; ctx.beginPath(); var pf = true;
        for (var i2 = 0; i2 <= 80; i2++) {
          var x = xmin + (xmax - xmin) * i2 / 80;
          var q = fx0 + g1 * (x - x0) + 0.5 * g2 * (x - x0) * (x - x0);
          if (q < ymin) q = ymin; if (q > ymax) q = ymax;
          if (pf) { ctx.moveTo(PX(x), PY(q)); pf = false; } else ctx.lineTo(PX(x), PY(q));
        }
        ctx.stroke();
      }
      ctx.strokeStyle = c.purple; ctx.lineWidth = 2; ctx.beginPath();
      for (var n = 0; n < nt.length; n++) { var X2 = PX(nt[n]), Y2 = PY(f(nt[n])); if (n === 0) ctx.moveTo(X2, Y2); else ctx.lineTo(X2, Y2); }
      ctx.stroke();
      for (var n2 = 0; n2 < nt.length; n2++) { ctx.fillStyle = (n2 === 0) ? c.ink : c.purple; ctx.beginPath(); ctx.arc(PX(nt[n2]), PY(f(nt[n2])), 4, 0, Math.PI * 2); ctx.fill(); }

      readout.innerHTML = "Purple = Newton: each step jumps to the bottom of the local tangent parabola. It reaches the min in <b>" + (nt.length - 1) + "</b> step(s). Faint orange = gradient descent with α = " + lr.toFixed(2) + ": it took <b>" + (gd.length - 1) + "</b> tiny steps for the same min. Newton uses curvature f''(x), so it converges fast. Drag the start and α sliders.";
    }

    makeSlider(host, "start x₀", -5, 6, startX, 0.1, function (v) { startX = v; render(); });
    makeSlider(host, "gradient α", 0.02, 0.45, lr, 0.01, function (v) { lr = v; render(); });
    render();
  },
  title: "Newton's method",
  tagline: "Use curvature, not just slope. Jump to the bottom of a parabola each step.",
  prereqs: ["ml-gradient-descent", "fnd-gradient"],
  bigIdea:
    `<p><b>Analogy: rolling a ball into a valley in the dark.</b> Gradient descent feels only the <b>slope</b> under its feet — "downhill is that way" — and shuffles a small, cautious step that direction. It has no idea how far the valley floor is, so it repeats the shuffle hundreds of times.</p>
     <p><b>Newton's method</b> also feels the <b>curvature</b>: how quickly the slope is changing. A gentle curve means the bottom is far away (take a big step); a sharp curve means the bottom is close (take a small step). Curvature turns "which way" into "which way AND how far."</p>
     <p>So Newton does something bolder: it pretends the cost near you is a perfect bowl (a parabola), works out exactly where that bowl's bottom is, and <b>jumps straight there</b>. For a real bowl that is one leap. For a smooth cost it is a handful of leaps. That is why it is so much faster than the shuffling of gradient descent.</p>`,
  buildup:
    `<p>Near any point, a smooth cost looks like a parabola (a bowl).</p>
     <p>A parabola is fixed by its slope and its curvature at one point.</p>
     <p>The slope is the gradient $\\nabla J$. The curvature is the second-derivative matrix, the <b>Hessian</b> $H$.</p>
     <p>Jump to where that parabola is flat — that is the Newton step.</p>`,
  symbols: [
    { sym: "$\\theta$", desc: "the parameters we are tuning." },
    { sym: "$\\nabla J(\\theta)$", desc: "the gradient: the slope of the cost (which way is uphill)." },
    { sym: "$H$", desc: "the Hessian: the matrix of second derivatives. It measures curvature — how fast the slope changes." },
    { sym: "$H^{-1}$", desc: "the inverse of the Hessian — the matrix version of 'divide by the curvature'." },
    { sym: "$\\leftarrow$", desc: "'becomes' — replace the old $\\theta$ with the value on the right." }
  ],
  formula: `$$ \\theta \\;\\leftarrow\\; \\theta - H^{-1}\\,\\nabla J(\\theta) $$`,
  whatItDoes:
    `<p>Compute the slope $\\nabla J$ and the curvature $H$ where you stand.</p>
     <p>Divide the slope by the curvature (that is $H^{-1}\\nabla J$). Subtract it from $\\theta$.</p>
     <p>For a true parabola this lands exactly at the bottom in <b>one</b> step. For smooth costs it converges <b>quadratically</b>: the number of correct digits roughly doubles each step.</p>
     <p>The cost: $H$ is big (parameters $\\times$ parameters) and inverting it is expensive. That is why huge models still prefer plain gradient descent.</p>`,
  derivation:
    `<p>Approximate the cost near the current point $\\theta_0$ with its second-order Taylor expansion:</p>
     $$ J(\\theta) \\approx J(\\theta_0) + \\nabla J(\\theta_0)^\\top (\\theta - \\theta_0) + \\tfrac12 (\\theta - \\theta_0)^\\top H (\\theta - \\theta_0). $$
     <p>This is a parabola in $\\theta$. To find its bottom, set the derivative with respect to $\\theta$ to zero:</p>
     $$ \\nabla J(\\theta_0) + H (\\theta - \\theta_0) = 0. $$
     <p>Solve for $\\theta$. Move the gradient to the other side and multiply by $H^{-1}$:</p>
     $$ \\theta - \\theta_0 = - H^{-1} \\nabla J(\\theta_0) \\quad\\Longrightarrow\\quad \\theta = \\theta_0 - H^{-1}\\nabla J(\\theta_0). $$
     <p>That is exactly the Newton update. If $J$ really is a parabola, $H$ is constant and one step is exact. $\\blacksquare$</p>`,
  example:
    `<p>Minimize the 1-D cost $J(\\theta) = 3\\theta^2 - 12\\theta + 7$. Slope $J'(\\theta) = 6\\theta - 12$, curvature $J''(\\theta) = 6$. Start at $\\theta_0 = 5$.</p>
     <ul class="steps">
       <li>Slope at the start: $J'(5) = 6\\cdot 5 - 12 = 30 - 12 = 18$.</li>
       <li>Curvature: $J''(5) = 6$ (constant for a parabola).</li>
       <li>Newton step: $\\theta = 5 - \\dfrac{J'(5)}{J''(5)} = 5 - \\dfrac{18}{6} = 5 - 3 = 2$.</li>
       <li>Check: $J'(2) = 6\\cdot 2 - 12 = 12 - 12 = 0$. Slope is zero — at the minimum after <b>one</b> step.</li>
     </ul>
     <p>Now race it against gradient descent ($\\theta \\leftarrow \\theta - \\alpha J'(\\theta)$, $\\alpha = 0.1$) from the same start. Each GD step closes only $1 - \\alpha J'' = 1 - 0.6 = 0.4$ of the remaining gap to $\\theta = 2$:</p>
     <table class="extable">
       <caption>Newton (1 step, exact) vs gradient descent ($\\alpha = 0.1$)</caption>
       <thead><tr><th>step</th><th class="num">Newton $\\theta$</th><th class="num">GD $\\theta$</th><th class="num">GD slope $J'$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">0</td><td class="num">5.000</td><td class="num">5.000</td><td class="num">18.00</td></tr>
         <tr><td class="row-h">1</td><td class="num">2.000</td><td class="num">3.200</td><td class="num">7.20</td></tr>
         <tr><td class="row-h">2</td><td class="num">2.000</td><td class="num">2.480</td><td class="num">2.88</td></tr>
         <tr><td class="row-h">3</td><td class="num">2.000</td><td class="num">2.192</td><td class="num">1.15</td></tr>
         <tr><td class="row-h">4</td><td class="num">2.000</td><td class="num">2.077</td><td class="num">0.46</td></tr>
         <tr><td class="row-h">5</td><td class="num">2.000</td><td class="num">2.031</td><td class="num">0.18</td></tr>
       </tbody>
     </table>
     <p>Newton lands exactly at $2$ in one step; GD is still drifting in after five.</p>`,
  application:
    `<p>Newton's method (and Hessian-aware cousins like L-BFGS) trains logistic regression and small GLMs (Generalized Linear Models) in a handful of iterations. Statistics packages use it for maximum-likelihood fits. It also powers the "trust region" optimizers behind many scientific solvers, where fast, accurate convergence matters more than the cost of the Hessian.</p>`,
  whenToUse:
    `<p><b>Reach for Newton's method when the parameter count is small (roughly tens to low hundreds) and the cost is smooth and near-convex</b> — logistic regression, GLMs (Generalized Linear Models), maximum-likelihood fits. You want very few iterations and high accuracy, and you can afford to form or solve with the Hessian (the matrix of second derivatives).</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Plain gradient descent</b> — when curvature varies a lot and tuning a learning rate is painful; Newton's curvature step removes that knob and converges in a handful of steps.</li>
       <li><b>Hand-tuned momentum / Adam</b> — when the problem is small enough that an exact second-order step is cheap and you want machine-precision answers.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The model is large (deep nets, millions of parameters) — the Hessian is too big to store or invert; use SGD (Stochastic Gradient Descent), Adam, or a quasi-Newton method like <b>L-BFGS</b> that only approximates curvature.</li>
       <li>The cost is non-convex or noisy — Newton can step toward saddle points or diverge; prefer a trust-region or damped variant.</li>
     </ul>
     <p><b>In practice:</b> <code>scipy.optimize.minimize</code> with <code>method="Newton-CG"</code> or <code>"L-BFGS-B"</code>; statsmodels uses it (IRLS) for GLM fits.</p>`,
  pitfalls:
    `<ul>
       <li><b>The Hessian is expensive.</b> It is parameters $\\times$ parameters in size, and inverting it costs about $O(p^3)$. For large models this is the whole reason to fall back to gradient methods or L-BFGS.</li>
       <li><b>A non-positive-definite Hessian breaks the step.</b> Away from a minimum the curvature can point the wrong way, so the "Newton step" heads uphill or toward a saddle. Add damping (a $\\lambda I$ ridge) or use a trust region to stay safe.</li>
       <li><b>No global convergence guarantee.</b> Pure Newton can overshoot and diverge if you start far from the optimum. Use a <b>line search</b> or step-size backtracking so each step actually lowers the cost.</li>
       <li><b>Near-singular Hessian is numerically unstable.</b> When two parameters are nearly redundant the matrix is ill-conditioned and $H^{-1}$ blows up. Regularize, or solve the linear system instead of explicitly inverting.</li>
       <li><b>Don't form $H^{-1}$ explicitly.</b> Solve $H\\,\\Delta = -\\nabla J$ with a linear solver (Cholesky or conjugate gradient). It is faster and far more stable than computing the inverse.</li>
       <li><b>It needs second derivatives.</b> If the loss is only piecewise-smooth or has kinks (e.g. L1 (absolute-value) penalties), the Hessian is undefined where it matters; use a subgradient or proximal method instead.</li>
     </ul>`,
  quiz: {
    q: `For $J(\\theta) = 2\\theta^2 - 8\\theta + 5$ (slope $4\\theta - 8$, curvature $4$), start at $\\theta_0 = 10$. What is $\\theta$ after one Newton step?`,
    a: `<p>Slope $= 4\\cdot 10 - 8 = 32$. Curvature $= 4$. Step $= 10 - 32/4 = 10 - 8 = 2$. And $J'(2) = 0$, so it lands exactly at the minimum in one step.</p>`
  }
});

/* ====================== 2. LOCALLY WEIGHTED REG ===================== */
L({
  id: "mlx-lwr",
  demo: function (host) {
    var data = [];
    for (var i = 0; i < 28; i++) {
      var x = i / 27 * 10 - 5;                       // x in [-5,5]
      var noise = Math.sin(i * 12.9898) * 0.18;      // deterministic pseudo-noise
      var y = Math.sin(x) + 0.25 * x + noise;
      data.push({ x: x, y: y });
    }
    var tau = 0.9;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var xmin = -5.5, xmax = 5.5, ymin = -2.2, ymax = 2.6, padL = 34, padR = 16, padT = 14, padB = 26, W = 640, H = 340;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function predict(xq) {
      var Sw = 0, Swx = 0, Swy = 0, Swxx = 0, Swxy = 0;
      for (var i = 0; i < data.length; i++) {
        var dx = data[i].x - xq;
        var w = Math.exp(-(dx * dx) / (2 * tau * tau));
        Sw += w; Swx += w * data[i].x; Swy += w * data[i].y;
        Swxx += w * data[i].x * data[i].x; Swxy += w * data[i].x * data[i].y;
      }
      var det = Sw * Swxx - Swx * Swx;
      if (Math.abs(det) < 1e-9) return Swy / (Sw || 1);   // fall back to weighted mean
      var b = (Swxx * Swy - Swx * Swxy) / det;            // intercept
      var m = (Sw * Swxy - Swx * Swy) / det;              // slope
      return m * xq + b;
    }

    function render() {
      var c = THEME(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(PX(xmin), PY(0)); ctx.lineTo(PX(xmax), PY(0)); ctx.stroke();
      ctx.strokeStyle = c.warn; ctx.lineWidth = 2.5; ctx.beginPath(); var first = true;
      for (var i = 0; i <= 200; i++) {
        var x = xmin + (xmax - xmin) * i / 200;
        var y = predict(x);
        if (!isFinite(y)) continue;
        y = Math.max(ymin, Math.min(ymax, y));
        if (first) { ctx.moveTo(PX(x), PY(y)); first = false; } else ctx.lineTo(PX(x), PY(y));
      }
      ctx.stroke();
      for (var k = 0; k < data.length; k++) { ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(PX(data[k].x), PY(data[k].y), 3.5, 0, Math.PI * 2); ctx.fill(); }
      var mood = tau < 0.45 ? "tiny τ: the curve chases every point — wiggly, it overfits noise." :
                 tau > 2.2 ? "large τ: the weights are nearly flat, so the fit is almost one straight line — it underfits." :
                 "good τ: the curve follows the real shape of the data smoothly.";
      readout.innerHTML = "Bandwidth τ = <b>" + tau.toFixed(2) + "</b>. At each x we fit a line, weighting nearby points by exp(−(xᵢ−x)²/2τ²). " + mood + " Drag τ.";
    }
    makeSlider(host, "bandwidth τ", 0.2, 3.5, tau, 0.05, function (v) { tau = v; render(); });
    render();
  },
  title: "Locally weighted regression (LWR)",
  tagline: "Fit a fresh line at every query point, trusting nearby data most.",
  prereqs: ["ml-linear-regression"],
  bigIdea:
    `<p><b>Analogy: asking the neighbors, not the whole town.</b> Plain linear regression fits <b>one</b> straight line through <i>all</i> the data — like guessing a house's price from the average of every house in the country. That single line cannot bend, so it misses any curvy pattern.</p>
     <p><b>Locally weighted regression (LWR)</b> instead asks: "what are the houses right next to this one selling for?" For each point you want a prediction at, it fits a <b>fresh little line</b> using mostly the <b>nearby</b> training points and all but ignoring the far-away ones.</p>
     <p>The trick is a smooth "nearness" dial: a point sitting right on your query counts fully; a point far away counts almost nothing; points in between fade gradually. Fit a line under those weights, read off the prediction, then slide to the next query and refit.</p>
     <p>Stitch all those local straight lines together and they trace a single <b>smooth curve that bends with the data</b> — no need to guess the right equation in advance.</p>`,
  buildup:
    `<p>To predict at a query point $x$, give each training point a <b>weight</b>.</p>
     <p>Points close to $x$ get weight near 1. Points far away get weight near 0.</p>
     <p>A bell-shaped (Gaussian) weight does this. Its width is set by the <b>bandwidth</b> $\\tau$.</p>
     <p>Then do ordinary least squares — but with those weights. This is <b>weighted</b> least squares.</p>`,
  symbols: [
    { sym: "$x$", desc: "the query point: the input where we want a prediction right now." },
    { sym: "$x^{(i)}$", desc: "the input of the $i$-th training example." },
    { sym: "$w^{(i)}$", desc: "the weight given to training example $i$ for this query. Near 1 if close to $x$, near 0 if far." },
    { sym: "$\\tau$", desc: "the bandwidth ('tau'): how wide the bell is. Small $\\tau$ = only very close points count (wiggly). Large $\\tau$ = many points count (smooth)." },
    { sym: "$\\exp$", desc: "the exponential $e^{(\\cdot)}$. Here it makes the bell shape: largest at the center, fading to 0 outward." }
  ],
  formula: `$$ w^{(i)} = \\exp\\!\\left(-\\frac{(x^{(i)} - x)^2}{2\\,\\tau^2}\\right) \\qquad \\theta = \\arg\\min_\\theta \\sum_i w^{(i)}\\big(y^{(i)} - \\theta^\\top x^{(i)}\\big)^2 $$`,
  whatItDoes:
    `<p>For each query $x$: compute every point's distance to $x$, turn it into a bell-shaped weight $w^{(i)}$, then fit a weighted line.</p>
     <p>The squared distance $(x^{(i)} - x)^2$ in the exponent makes the weight fall off fast. The $\\tau^2$ controls how fast.</p>
     <p>It is a <b>non-parametric</b> method: it keeps all the training data and refits on demand, instead of learning one fixed set of weights.</p>`,
  derivation:
    `<p>Weighted least squares minimizes $J(\\theta) = \\sum_i w^{(i)}(y^{(i)} - \\theta^\\top x^{(i)})^2$. Write $W = \\operatorname{diag}(w^{(1)}, \\dots, w^{(m)})$, a diagonal matrix of the weights. Then</p>
     $$ J(\\theta) = (y - X\\theta)^\\top W (y - X\\theta). $$
     <p>Expand and take the gradient with respect to $\\theta$:</p>
     $$ \\nabla_\\theta J = -2 X^\\top W (y - X\\theta). $$
     <p>Set it to zero. The $-2$ drops, and distributing $X^\\top W$ gives</p>
     $$ X^\\top W y - X^\\top W X\\theta = 0 \\quad\\Longrightarrow\\quad X^\\top W X\\,\\theta = X^\\top W y. $$
     <p>Solve for $\\theta$ by multiplying by the inverse of $X^\\top W X$:</p>
     $$ \\theta = (X^\\top W X)^{-1} X^\\top W y. $$
     <p>This is the normal equations with weights inserted. Setting all $w^{(i)} = 1$ ($W = I$) recovers ordinary linear regression. $\\blacksquare$</p>`,
  example:
    `<p>Predict at query $x = 2$ with bandwidth $\\tau = 1$. Three training points, with the far one ($x^{(3)} = 6$, $y^{(3)} = 20$) an outlier. Each weight is $w^{(i)} = \\exp\\!\\big(-(x^{(i)}-2)^2 / 2\\big)$:</p>
     <table class="extable">
       <caption>Weights fall off fast with distance from the query $x = 2$</caption>
       <thead><tr><th>$x^{(i)}$</th><th class="num">dist $|x^{(i)}-2|$</th><th class="num">weight $w^{(i)}$</th><th class="num">$y^{(i)}$</th><th class="num">$w^{(i)} y^{(i)}$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">2</td><td class="num">0</td><td class="num">1.0000</td><td class="num">5</td><td class="num">5.000</td></tr>
         <tr><td class="row-h">3</td><td class="num">1</td><td class="num">0.6065</td><td class="num">6</td><td class="num">3.639</td></tr>
         <tr><td class="row-h">6</td><td class="num">4</td><td class="num">0.0003</td><td class="num">20</td><td class="num">0.006</td></tr>
         <tr><td class="row-h">sum</td><td class="num"></td><td class="num">1.6068</td><td class="num"></td><td class="num">8.645</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Closest point gets the full vote: $w^{(1)} = \\exp(0) = 1.0000$.</li>
       <li>One unit away: $w^{(2)} = \\exp(-\\tfrac12) \\approx 0.6065$.</li>
       <li>Four units away: $w^{(3)} = \\exp(-8) \\approx 0.0003$ — basically ignored.</li>
       <li>Weighted average prediction: $\\hat y = \\dfrac{\\sum_i w^{(i)} y^{(i)}}{\\sum_i w^{(i)}} = \\dfrac{8.645}{1.6068} \\approx 5.38$.</li>
       <li>It sits between the two nearby targets ($5$ and $6$); the wild far point at $20$ moved it by under $0.01$ — exactly the point of local weighting.</li>
       <li>Shrink $\\tau$ to $0.5$ and even point 2 fades: $w^{(2)} = \\exp(-2) \\approx 0.135$. The fit gets very local and wiggly.</li>
     </ul>`,
  application:
    `<p>LWR (a.k.a. LOESS / LOWESS) is the go-to smoother for scatterplots in statistics. Robotics and control use locally weighted methods to model nonlinear dynamics on the fly. Anywhere the relationship bends in ways a single line cannot capture — and you have enough data to refit locally — LWR shines.</p>`,
  whenToUse:
    `<p><b>Reach for LWR (Locally Weighted Regression) when you have one or a few input dimensions, plenty of training data, and a curvy relationship that a single global line can't capture</b> — smoothing a noisy scatterplot, modeling a nonlinear sensor curve, or any exploratory fit where you don't want to commit to a fixed functional form.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Plain linear regression</b> — when the true curve bends; LWR follows the bends without you specifying them.</li>
       <li><b>Fitting a high-degree polynomial</b> — when you'd rather not hunt for the right degree; LWR adapts locally and won't wiggle wildly at the edges the way a global polynomial does.</li>
       <li><b>Splines / a GAM (Generalized Additive Model)</b> — when you want the simplest possible local smoother and don't need a single closed-form equation to ship.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You have many input features — distances become meaningless in high dimensions (the curse of dimensionality); use a parametric model or trees.</li>
       <li>Predictions must be fast or the model must be small — LWR is <b>non-parametric</b>: it stores all the data and refits per query.</li>
       <li>Data is sparse — local neighborhoods empty out and the local fit becomes unstable.</li>
     </ul>
     <p><b>In practice:</b> <code>statsmodels.nonparametric.lowess</code> in Python, or <code>loess()</code> in R.</p>`,
  pitfalls:
    `<ul>
       <li><b>The bandwidth $\\tau$ is everything.</b> Too small and the curve chases noise (overfit, wiggly); too large and it flattens into one straight line (underfit). Pick $\\tau$ by CV (Cross-Validation), not by eye.</li>
       <li><b>It refits at every query.</b> Each prediction solves a fresh weighted least-squares problem over all points, so serving is slow and memory grows with the data. Pre-index neighbors or downsample for production.</li>
       <li><b>Curse of dimensionality.</b> With more than a handful of features, "nearby" points are all roughly equidistant, the Gaussian weights flatten, and LWR degenerates. Reduce dimensions first or use a different model.</li>
       <li><b>Empty or sparse neighborhoods.</b> Where data is thin, $X^\\top W X$ becomes near-singular and the local line swings wildly. Widen $\\tau$ adaptively or fall back to the weighted mean in sparse regions.</li>
       <li><b>Scale your features first.</b> The distance in the weight $\\exp(-(x^{(i)}-x)^2/2\\tau^2)$ is dominated by whichever feature has the largest units. Standardize inputs so one axis doesn't drown out the rest.</li>
       <li><b>Bad extrapolation at the edges.</b> Past the range of the data, weights come only from one side and the local line tilts unreliably. Don't trust LWR predictions outside the training range.</li>
     </ul>`,
  quiz: {
    q: `With bandwidth $\\tau = 2$, what weight does a training point exactly at the query (distance $0$) get? What about one at distance $4$?`,
    a: `<p>Distance $0$: $w = \\exp(0) = 1$. Distance $4$: $w = \\exp\\!\\big(-\\tfrac{16}{2\\cdot 4}\\big) = \\exp(-2) \\approx 0.135$. Closer points always weigh more.</p>`
  }
});

/* ===================== 3. k-FOLD CROSS-VALIDATION =================== */
L({
  id: "mlx-cross-validation",
  demo: function (host) {
    var k = 5;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var baseErr = [0.31, 0.27, 0.34, 0.29, 0.30, 0.28, 0.33, 0.26];   // fixed per-fold errors

    function render() {
      var c = THEME(); ctx.clearRect(0, 0, 640, 340);
      var panels = Math.min(k, 5);
      var rowH = (340 - 30) / panels;
      var foldErr = baseErr.slice(0, k);
      var sum = 0; for (var e = 0; e < foldErr.length; e++) sum += foldErr[e];
      var avg = sum / foldErr.length;

      ctx.font = "12px sans-serif";
      for (var p = 0; p < panels; p++) {
        var y0 = 8 + p * rowH;
        var barH = rowH - 12;
        var barW = (640 - 130) / k;
        for (var j = 0; j < k; j++) {
          var x0 = 16 + j * barW;
          var held = (j === p);
          ctx.fillStyle = held ? c.warn : c.accent + "55";
          ctx.fillRect(x0, y0, barW - 3, barH);
          ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(x0, y0, barW - 3, barH);
          ctx.fillStyle = held ? c.panel : c.dim; ctx.textAlign = "center";
          ctx.fillText(held ? "VAL" : "train", x0 + (barW - 3) / 2, y0 + barH / 2 + 4);
        }
        ctx.fillStyle = c.ink; ctx.textAlign = "left";
        ctx.fillText("round " + (p + 1) + ":  err = " + foldErr[p].toFixed(2), 16 + k * barW + 6, y0 + barH / 2 + 4);
      }
      ctx.fillStyle = c.accent2; ctx.textAlign = "left"; ctx.font = "13px sans-serif";
      ctx.fillText("CV error = average of " + k + " folds = " + avg.toFixed(3), 16, 340 - 8);
      readout.innerHTML = "k = <b>" + k + "</b> folds. In each round one fold is held out for VALidation (orange) and the model trains on the other " + (k - 1) + " (blue). Every point is validated exactly once. The cross-validation error is the average of the " + k + " held-out errors = <b>" + avg.toFixed(3) + "</b>. Drag k.";
    }
    makeSlider(host, "folds k", 2, 8, k, 1, function (v) { k = Math.round(v); render(); });
    render();
  },
  title: "k-fold cross-validation",
  tagline: "Reuse all your data: take turns holding out each slice to test on.",
  prereqs: ["ml-bias-variance", "ml-regression-metrics"],
  bigIdea:
    `<p><b>Analogy: a fair exam, not a re-test of the homework.</b> If you grade a student on the exact questions they studied, you measure memory, not understanding. A model is the same: testing it on the rows it trained on only measures memorization, so you <b>must</b> score it on fresh, unseen data.</p>
     <p>The obvious fix — set aside one chunk as a "test" — has two problems when data is scarce: you waste those rows (the model never learns from them), and the score depends on the luck of which rows landed in the test chunk.</p>
     <p><b>k-fold cross-validation</b> solves both. Cut the data into $k$ equal slices, called <b>folds</b>. Then run $k$ separate "exams": each time, one fold is the held-out test and the other $k-1$ folds are the study material. Rotate so every fold gets one turn as the test.</p>
     <p>Now <b>every row gets used for training (in $k-1$ of the rounds) and tested exactly once</b>, so nothing is wasted. Average the $k$ scores and the luck of any single split cancels out, giving one stable, trustworthy number.</p>`,
  buildup:
    `<p>Cut the data into $k$ folds of roughly equal size.</p>
     <p>Run $k$ rounds. In round $j$, hold out fold $j$ for validation and train on the rest.</p>
     <p>Each round gives one validation error. Every example is validated exactly once.</p>
     <p>The final score is the average of all $k$ validation errors.</p>`,
  symbols: [
    { sym: "$k$", desc: "the number of folds (slices). Common choices are 5 or 10." },
    { sym: "$\\text{Err}_j$", desc: "the validation error measured in round $j$, when fold $j$ is held out." },
    { sym: "$\\text{CV}$", desc: "the cross-validation error: the average of the $k$ round errors." },
    { sym: "$\\frac{1}{k}\\sum_{j=1}^{k}$", desc: "add the $k$ round errors and divide by $k$ — i.e. take their average." }
  ],
  formula: `$$ \\text{CV} = \\frac{1}{k} \\sum_{j=1}^{k} \\text{Err}_j $$`,
  whatItDoes:
    `<p>It turns a small, fixed dataset into $k$ separate honest tests, then averages them.</p>
     <p>Averaging cuts the noise of a single split, so you can trust the score and compare models fairly.</p>
     <p>Special case: $k = m$ (one example per fold) is <b>leave-one-out</b> cross-validation. Most accurate, but you must train $m$ times.</p>`,
  derivation:
    `<p>Why does averaging help? Treat each round's error $\\text{Err}_j$ as a noisy measurement of the true generalization error $\\mu$, each with variance $\\sigma^2$.</p>
     <p>The average is $\\text{CV} = \\tfrac{1}{k}\\sum_j \\text{Err}_j$. Its expected value is still $\\mu$ (it is unbiased):</p>
     $$ \\mathbb{E}[\\text{CV}] = \\frac{1}{k}\\sum_{j=1}^{k} \\mathbb{E}[\\text{Err}_j] = \\frac{1}{k}\\cdot k\\,\\mu = \\mu. $$
     <p>If the rounds were independent, the variance of the average would shrink:</p>
     $$ \\operatorname{Var}(\\text{CV}) = \\frac{1}{k^2}\\sum_{j=1}^{k}\\operatorname{Var}(\\text{Err}_j) = \\frac{\\sigma^2}{k}. $$
     <p>So more folds means a steadier estimate. (In practice the folds share training data, so they are correlated and the variance falls a bit slower than $\\sigma^2/k$ — but the direction holds.) $\\blacksquare$</p>`,
  example:
    `<p>You have 100 examples and choose $k = 5$ folds (20 each). Each round holds out one fold for validation and trains on the other 4. The five held-out errors:</p>
     <table class="extable">
       <caption>One held-out error per round; the CV score is their average</caption>
       <thead><tr><th>round $j$</th><th class="num">held-out fold</th><th class="num">$\\text{Err}_j$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">1</td><td class="num">1</td><td class="num">0.30</td></tr>
         <tr><td class="row-h">2</td><td class="num">2</td><td class="num">0.26</td></tr>
         <tr><td class="row-h">3</td><td class="num">3</td><td class="num">0.34</td></tr>
         <tr><td class="row-h">4</td><td class="num">4</td><td class="num">0.28</td></tr>
         <tr><td class="row-h">5</td><td class="num">5</td><td class="num">0.32</td></tr>
         <tr><td class="row-h">sum</td><td class="num"></td><td class="num">1.50</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Add the five round errors: $0.30 + 0.26 + 0.34 + 0.28 + 0.32 = 1.50$.</li>
       <li>Divide by $k = 5$: $\\text{CV} = \\dfrac{1}{k}\\sum_{j=1}^{5}\\text{Err}_j = \\dfrac{1.50}{5} = 0.30$. That $0.30$ is your trusted error estimate.</li>
       <li><b>Why average?</b> A single split could have landed on fold 3 alone and reported $0.34$ (too pessimistic), or fold 2 alone at $0.26$ (too rosy) — a spread of $0.08$. Averaging all five cancels that luck and centers on $0.30$.</li>
     </ul>`,
  application:
    `<p>Cross-validation is the standard way to pick hyperparameters (regularization strength, tree depth, $k$ in k-NN (k-Nearest Neighbors)) and to compare models on limited data. Kaggle competitions and scientific ML (Machine Learning) papers report CV (Cross-Validation) scores because a single split can be misleadingly lucky or unlucky.</p>`,
  whenToUse:
    `<p><b>Reach for k-fold CV (Cross-Validation) whenever your dataset is small-to-moderate and you need an honest, low-variance estimate of generalization</b> — to tune hyperparameters, to compare candidate models, or to report a trustworthy score. It is the default evaluation protocol when you can't afford to waste data on a single fixed test split.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A single train/test split</b> — when data is limited; one split gives a noisy score and a lucky or unlucky test set can mislead you. CV averages over $k$ splits.</li>
       <li><b>Leave-one-out CV</b> — when $m$ is large; leave-one-out trains $m$ times and is costly, while $k = 5$ or $10$ gives nearly the same estimate far cheaper.</li>
     </ul>
     <p><b>Pick a different approach when:</b></p>
     <ul>
       <li>The data is huge — a single large held-out set is already stable and far cheaper than refitting $k$ times.</li>
       <li>The data is a time series — random folds peek into the future; use forward-chaining (rolling-origin) splits instead.</li>
       <li>Rows are grouped (same user, same patient) — use grouped CV so the same group never appears in both train and validation.</li>
     </ul>
     <p><b>In practice:</b> scikit-learn's <code>cross_val_score</code>, <code>StratifiedKFold</code> (for imbalanced labels), <code>GroupKFold</code>, and <code>TimeSeriesSplit</code>.</p>`,
  pitfalls:
    `<ul>
       <li><b>Leakage from preprocessing.</b> Fitting a scaler, imputer, or feature selector on the full data <i>before</i> splitting leaks test information and inflates the score. Wrap every transform in a <code>Pipeline</code> so it refits inside each fold.</li>
       <li><b>Random folds on time series.</b> Shuffling lets the model train on future rows and test on past ones — an optimistic fantasy. Use time-ordered splits.</li>
       <li><b>Ignoring groups.</b> If the same user or device lands in both train and validation, the model "cheats" by memorizing the group. Split by group, not by row.</li>
       <li><b>Forgetting stratification.</b> With imbalanced classes, plain folds can leave a fold with almost no positives, wrecking the estimate. Use stratified folds to keep class ratios steady.</li>
       <li><b>Selection bias from tuning.</b> The CV score of the <i>best</i> hyperparameter setting is optimistic because you picked the luckiest one. Use <b>nested CV</b> (an outer loop for honest scoring, an inner loop for tuning) when you need an unbiased number.</li>
       <li><b>Correlated folds.</b> Folds share training data, so the variance shrinks slower than $\\sigma^2/k$ — don't treat the $k$ scores as fully independent when computing confidence intervals.</li>
     </ul>`,
  quiz: {
    q: `With $k = 4$ folds, the round errors are $0.20, 0.24, 0.22, 0.26$. What is the cross-validation error?`,
    a: `<p>$\\text{CV} = \\dfrac{0.20 + 0.24 + 0.22 + 0.26}{4} = \\dfrac{0.92}{4} = 0.23$.</p>`
  }
});

/* ====================== 4. MODEL SELECTION ========================== */
L({
  id: "mlx-model-selection",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var kmin = 1, kmax = 12, padL = 40, padR = 18, padT = 16, padB = 30, W = 640, H = 340;
    function fit(k) { return 30 * Math.exp(-0.35 * k) + 4; }   // -2 ln L proxy, decreasing
    function pen(k, mult) { return mult * k; }                 // AIC: 2k
    var penMult = 2;
    var ymax = 40;
    function PX(k) { return padL + (k - kmin) / (kmax - kmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - y / ymax * (H - padT - padB); }

    function render() {
      var c = THEME(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(padL, PY(0)); ctx.lineTo(W - padR, PY(0)); ctx.moveTo(padL, PY(0)); ctx.lineTo(padL, padT); ctx.stroke();
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("model complexity k (number of parameters) →", W / 2, H - 8);

      function curve(fn, color, dash) {
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash || []); ctx.beginPath(); var first = true;
        for (var k = kmin; k <= kmax; k += 0.1) { var y = Math.min(ymax, fn(k)); if (first) { ctx.moveTo(PX(k), PY(y)); first = false; } else ctx.lineTo(PX(k), PY(y)); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      curve(function (k) { return fit(k); }, c.accent, [5, 4]);                 // misfit falls
      curve(function (k) { return pen(k, penMult); }, c.purple, [5, 4]);        // penalty rises
      curve(function (k) { return fit(k) + pen(k, penMult); }, c.warn, []);     // total

      // find the minimum of the actual plotted total curve (same fine sampling as the
      // drawn curve, step 0.1), so the marker sits exactly on the curve's minimum
      var bestK = kmin, bestV = Infinity;
      for (var ki = kmin; ki <= kmax + 1e-9; ki += 0.1) { var v = fit(ki) + pen(ki, penMult); if (v < bestV) { bestV = v; bestK = ki; } }
      var bestKi = Math.round(bestK); // nearest whole number of parameters, for the readout
      ctx.fillStyle = c.accent2; ctx.beginPath(); ctx.arc(PX(bestK), PY(Math.min(ymax, bestV)), 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c.ink; ctx.textAlign = "left";
      ctx.fillText("misfit −2 lnL (falls)", PX(kmax) - 150, PY(fit(kmax)) - 8);
      ctx.fillText("penalty " + penMult + "k (rises)", 60, PY(pen(2, penMult)) - 6);
      ctx.fillText("AIC total (min ★)", PX(bestK) + 8, PY(Math.min(ymax, bestV)) - 8);

      readout.innerHTML = "Dashed blue = misfit (−2 ln L) keeps falling as you add parameters. Dashed purple = penalty " + penMult + "·k keeps rising. Solid orange = their sum (AIC). The sum dips then climbs: the best model is at the minimum, k ≈ <b>" + bestKi + "</b>. Slide the penalty multiplier (2 = AIC, ln n = BIC).";
    }
    makeSlider(host, "penalty per param", 1, 5, penMult, 0.5, function (v) { penMult = v; render(); });
    render();
  },
  title: "Model selection criteria",
  tagline: "Reward fit, punish complexity. The best model balances the two.",
  prereqs: ["ml-bias-variance", "ml-regression-metrics"],
  bigIdea:
    `<p><b>Analogy: hiring the smallest team that gets the job done.</b> Give a model more parameters and it will <i>always</i> fit the <b>training</b> data better — just as adding more people to a project will never make the to-do list look worse. But extra parameters, like extra hires, can simply "memorize" quirks (noise) instead of doing real work, and they cost you in overfitting.</p>
     <p>So we want a score that <b>rewards good fit</b> but <b>charges a fee for every extra parameter</b> — only keep a parameter if it earns more than it costs.</p>
     <p><b>Model selection criteria</b> like AIC (Akaike Information Criterion) and BIC (Bayesian Information Criterion) do exactly this: a "how badly it fits" term plus a "how complex it is" penalty.</p>
     <p>Compute the score for each candidate model and keep the one with the best (lowest) total. That winner sits at the sweet spot — complex enough to capture the real pattern, simple enough not to chase noise.</p>`,
  buildup:
    `<p>Measure fit with the <b>log-likelihood</b> $\\ln L$: how probable the data is under the model. Higher is better.</p>
     <p>Measure complexity by counting parameters $k$. More parameters = more flexibility = more risk of overfitting.</p>
     <p>Combine them: a small misfit term ($-2\\ln L$) plus a penalty that grows with $k$.</p>
     <p>Different criteria just weight the penalty differently.</p>`,
  symbols: [
    { sym: "$k$", desc: "the number of parameters (free knobs) in the model. Bigger model = bigger $k$." },
    { sym: "$L$", desc: "the maximized likelihood: the probability of the data at the best-fit parameters. $\\ln L$ is its logarithm." },
    { sym: "$n$", desc: "the number of data points." },
    { sym: "$\\text{AIC}$", desc: "Akaike Information Criterion: $2k - 2\\ln L$. Lower is better." },
    { sym: "$\\text{BIC}$", desc: "Bayesian Information Criterion: $k\\ln n - 2\\ln L$. Penalizes parameters more harshly when $n$ is large." },
    { sym: "$\\bar{R}^2$", desc: "adjusted $R^2$: $R^2$ corrected for the number of predictors, so adding a useless feature does not inflate it." }
  ],
  formula: `$$ \\text{AIC} = 2k - 2\\ln L \\qquad \\text{BIC} = k\\ln n - 2\\ln L \\qquad C_p = \\frac{\\text{RSS}}{\\hat\\sigma^2} - n + 2k $$`,
  whatItDoes:
    `<p>Each criterion is <b>misfit + penalty</b>. The misfit $-2\\ln L$ shrinks as the model fits better. The penalty grows with $k$.</p>
     <p>AIC adds $2$ per parameter. BIC adds $\\ln n$ per parameter — harsher once you have many data points, so BIC prefers simpler models.</p>
     <p>Adjusted $R^2$ and Mallow's $C_p$ are the same idea for regression: reward variance explained, charge for each predictor.</p>
     <p>You compute the score for each candidate model and keep the smallest (for $C_p$, the one closest to $k$).</p>`,
  derivation:
    `<p>Adjusted $R^2$ shows the penalty mechanism cleanly. Ordinary $R^2 = 1 - \\dfrac{\\text{RSS}}{\\text{TSS}}$, where RSS is the residual sum of squares and TSS the total sum of squares. RSS never increases when you add a predictor, so plain $R^2$ never decreases — it cannot warn you about overfitting.</p>
     <p>Fix this by dividing each sum of squares by its <b>degrees of freedom</b> instead of by raw counts. With $n$ data points and $k$ predictors:</p>
     $$ \\bar{R}^2 = 1 - \\frac{\\text{RSS}/(n - k - 1)}{\\text{TSS}/(n - 1)}. $$
     <p>Adding a predictor lowers RSS but also lowers the divisor $n - k - 1$. If the new predictor barely helps, the divisor effect wins and $\\bar{R}^2$ <b>drops</b>.</p>
     <p>Rearranging, $\\bar{R}^2 = 1 - (1 - R^2)\\dfrac{n-1}{n-k-1}$. The factor $\\dfrac{n-1}{n-k-1} &gt; 1$ grows with $k$ — that is the built-in complexity penalty. $\\blacksquare$</p>`,
  example:
    `<p>Two models for the same $n = 100$ data points. Model B fits a touch better but uses far more parameters. Score both with AIC $= 2k - 2\\ln L$ and BIC $= k\\ln n - 2\\ln L$ (here $\\ln n = \\ln 100 \\approx 4.6$).</p>
     <table class="extable">
       <caption>Misfit $-2\\ln L$ plus a complexity penalty — lower total wins</caption>
       <thead><tr><th>model</th><th class="num">$k$</th><th class="num">$\\ln L$</th><th class="num">$-2\\ln L$</th><th class="num">AIC</th><th class="num">BIC</th></tr></thead>
       <tbody>
         <tr><td class="row-h">A</td><td class="num">3</td><td class="num">-120</td><td class="num">240</td><td class="num">246.0</td><td class="num">253.8</td></tr>
         <tr><td class="row-h">B</td><td class="num">8</td><td class="num">-116</td><td class="num">232</td><td class="num">248.0</td><td class="num">268.8</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>AIC(A) $= 2(3) - 2(-120) = 6 + 240 = 246$.</li>
       <li>AIC(B) $= 2(8) - 2(-116) = 16 + 232 = 248$. A wins (lower AIC).</li>
       <li>BIC(A) $= 3(4.6) + 240 = 13.8 + 240 = 253.8$.</li>
       <li>BIC(B) $= 8(4.6) + 232 = 36.8 + 232 = 268.8$.</li>
       <li>BIC punishes B's five extra parameters even harder ($+23$ vs AIC's $+2$). Both criteria prefer the simpler Model A.</li>
     </ul>`,
  application:
    `<p>AIC and BIC pick the order of time-series models (how many lags in ARIMA (AutoRegressive Integrated Moving Average)), choose the number of components in a mixture model, and select which features enter a regression. Whenever "more parameters" is tempting but risky, these criteria give an automatic, principled cutoff.</p>`,
  whenToUse:
    `<p><b>Reach for an information criterion (AIC (Akaike Information Criterion), BIC (Bayesian Information Criterion)) when you are choosing among a handful of nested, likelihood-based models and want a single number that balances fit against complexity</b> — how many lags in a time-series model, how many components in a mixture, which subset of predictors to keep. It is fast: one fit per candidate, no resampling.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Plain $R^2$ or training likelihood</b> — those always favor the bigger model and can't warn you about overfitting; the penalty term in AIC/BIC can.</li>
       <li><b>Cross-validation</b> — when refitting many times is too slow, or when you have a clean likelihood; AIC is asymptotically close to leave-one-out CV (Cross-Validation) at a fraction of the cost.</li>
       <li><b>BIC vs AIC:</b> use <b>BIC</b> when you believe one true model exists and want the simplest one (it penalizes harder as $n$ grows); use <b>AIC</b> when you care about predictive accuracy.</li>
     </ul>
     <p><b>Pick a different approach when:</b></p>
     <ul>
       <li>The models aren't likelihood-based (random forests, neural nets) — there's no clean $\\ln L$; use cross-validation instead.</li>
       <li>You only care about held-out predictive error on plenty of data — measure it directly on a validation set.</li>
     </ul>
     <p><b>In practice:</b> <code>statsmodels</code> reports AIC/BIC on every fitted model; <code>pmdarima.auto_arima</code> uses them to pick model order.</p>`,
  pitfalls:
    `<ul>
       <li><b>Only comparable on the same data.</b> AIC and BIC are valid only across models fit to the <i>identical</i> dataset and response. Drop a row for a missing value in one model and the scores are no longer comparable.</li>
       <li><b>Absolute value is meaningless.</b> Only <i>differences</i> matter. An AIC of $246$ means nothing alone; $\\Delta\\text{AIC} &lt; 2$ between two models means they are essentially tied.</li>
       <li><b>Count every estimated parameter.</b> The variance $\\sigma^2$, dispersion terms, and any tuned hyperparameter all add to $k$. Undercount and you systematically favor complex models.</li>
       <li><b>AIC over-selects on large $n$.</b> Its penalty doesn't grow with sample size, so on big data it tends to keep too many parameters; switch to BIC if you want consistency.</li>
       <li><b>Small samples need the correction.</b> When $n$ is not much larger than $k$, use <b>AICc</b> (the small-sample-corrected AIC) — plain AIC badly under-penalizes here.</li>
       <li><b>Garbage likelihood, garbage criterion.</b> These assume the model's likelihood is correctly specified. If the error distribution is wrong (e.g. heavy tails treated as Gaussian), the score is misleading — check residuals first.</li>
     </ul>`,
  quiz: {
    q: `A model has $k = 5$ parameters and log-likelihood $\\ln L = -50$. What is its AIC?`,
    a: `<p>$\\text{AIC} = 2k - 2\\ln L = 2(5) - 2(-50) = 10 + 100 = 110$. Lower AIC across candidates is better.</p>`
  }
});

/* =================== 5. CLUSTERING QUALITY (SILHOUETTE) ============= */
L({
  id: "mlx-clustering-metrics",
  demo: function (host) {
    var pts = [];
    function blob(cx, cy, n, seed) {
      for (var i = 0; i < n; i++) {
        var t = (i + 1) * (seed + 1);
        var dx = (Math.sin(t * 1.3) + Math.sin(t * 0.7)) * 0.55;
        var dy = (Math.cos(t * 1.1) + Math.sin(t * 1.9)) * 0.55;
        pts.push({ x: cx + dx, y: cy + dy });
      }
    }
    blob(2, 2, 9, 1); blob(7, 3, 9, 2); blob(4.5, 7, 9, 3);   // 3 true blobs
    var k = 3;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var xmin = 0, xmax = 9.5, ymin = 0, ymax = 9.5, padL = 30, padR = 16, padT = 14, padB = 24, W = 640, H = 340;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }
    function dist(a, b) { return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)); }

    function kmeans(K) {
      var cs = [];
      for (var i = 0; i < K; i++) { var idx = Math.floor(i * (pts.length - 1) / Math.max(1, K - 1)); if (K === 1) idx = 0; cs.push({ x: pts[idx].x, y: pts[idx].y }); }
      var assign = new Array(pts.length).fill(0);
      for (var iter = 0; iter < 12; iter++) {
        for (var p = 0; p < pts.length; p++) {
          var best = 0, bd = Infinity;
          for (var c2 = 0; c2 < K; c2++) { var d = dist(pts[p], cs[c2]); if (d < bd) { bd = d; best = c2; } }
          assign[p] = best;
        }
        var sx = new Array(K).fill(0), sy = new Array(K).fill(0), cnt = new Array(K).fill(0);
        for (var p2 = 0; p2 < pts.length; p2++) { sx[assign[p2]] += pts[p2].x; sy[assign[p2]] += pts[p2].y; cnt[assign[p2]]++; }
        for (var c3 = 0; c3 < K; c3++) if (cnt[c3] > 0) { cs[c3] = { x: sx[c3] / cnt[c3], y: sy[c3] / cnt[c3] }; }
      }
      return assign;
    }
    function silhouette(assign, K) {
      var s = new Array(pts.length).fill(0);
      for (var i = 0; i < pts.length; i++) {
        var sa = 0, na = 0;
        for (var j = 0; j < pts.length; j++) if (j !== i && assign[j] === assign[i]) { sa += dist(pts[i], pts[j]); na++; }
        var a = na > 0 ? sa / na : 0;
        var b = Infinity;
        for (var c = 0; c < K; c++) if (c !== assign[i]) {
          var sb = 0, nb = 0;
          for (var j2 = 0; j2 < pts.length; j2++) if (assign[j2] === c) { sb += dist(pts[i], pts[j2]); nb++; }
          if (nb > 0) b = Math.min(b, sb / nb);
        }
        if (!isFinite(b)) b = a;
        var denom = Math.max(a, b);
        s[i] = denom > 1e-9 ? (b - a) / denom : 0;
      }
      return s;
    }

    function render() {
      var c = THEME(); ctx.clearRect(0, 0, W, H);
      var assign = kmeans(k);
      var s = silhouette(assign, k);
      var avg = 0; for (var i = 0; i < s.length; i++) avg += s[i]; avg /= s.length;
      // color each point by its silhouette value relative to this clustering's
      // own spread, so the high/low contrast is always visible (not all one color):
      // well-clustered (top third) green, middle blue, border/low (bottom third) orange,
      // and any negative (likely misassigned) red.
      var smin = Infinity, smax = -Infinity;
      for (var q = 0; q < s.length; q++) { if (s[q] < smin) smin = s[q]; if (s[q] > smax) smax = s[q]; }
      var span = (smax - smin) > 1e-6 ? (smax - smin) : 1;
      for (var p = 0; p < pts.length; p++) {
        var sv = Math.max(-1, Math.min(1, s[p]));
        var rel = (sv - smin) / span;               // 0 = lowest s here, 1 = highest s here
        var col;
        if (sv < 0) col = c.warn;                    // negative: flagged (orange/red family)
        else if (rel >= 0.66) col = c.accent2;       // high silhouette: green
        else if (rel >= 0.33) col = c.accent;        // middling: blue
        else col = c.warn;                           // low / near-0 / border: orange
        var r = 4 + 3 * rel;
        // all points are filled dots (no hollow rings)
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(PX(pts[p].x), PY(pts[p].y), r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.fillStyle = c.ink; ctx.font = "13px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("k = " + k + "   avg silhouette = " + avg.toFixed(3), 14, 22);
      readout.innerHTML = "Points clustered into k = <b>" + k + "</b> groups, then colored by silhouette s = (b−a)/max(a,b). Green = high s (deep inside a tight, well-separated cluster). Orange = low or negative s (on a border, maybe in the wrong cluster). Average silhouette = <b>" + avg.toFixed(3) + "</b>. The three real blobs make k = 3 score highest. Drag k.";
    }
    makeSlider(host, "clusters k", 2, 6, k, 1, function (v) { k = Math.round(v); render(); });
    render();
  },
  title: "Clustering quality (silhouette)",
  tagline: "Score each point: tight inside its cluster, far from the next one.",
  prereqs: ["ml-kmeans"],
  bigIdea:
    `<p><b>Analogy: are you with your real friends, or stuck at the wrong table?</b> Clustering groups data with no answer key, so how do you know the groups are any good? Picture each data point as a person at a party who has been assigned to a table. A good seating has everyone close to their own tablemates and clearly apart from the next table over.</p>
     <p>The <b>silhouette</b> turns that gut feeling into a number by asking each point two questions: am I <b>close to my own cluster</b> (do I belong at this table?), and am I <b>far from the nearest other cluster</b> (is the next table comfortably away?).</p>
     <p>A point deep inside a tight, well-separated cluster scores near $+1$ ("definitely my table"). A point on the boundary between two clusters scores near $0$ ("could go either way"). A point that is actually closer to a neighboring cluster scores <b>negative</b> ("I'm at the wrong table") — a red flag that it may be misassigned.</p>
     <p>Average everyone's score to grade the whole seating, and to choose the best number of clusters $k$: try several values and keep the $k$ whose average silhouette is highest.</p>`,
  buildup:
    `<p>For one point, compute $a$: its average distance to the other points <b>in its own cluster</b>. Small $a$ = it fits in tightly.</p>
     <p>Then compute $b$: its average distance to the points of the <b>nearest other</b> cluster. Large $b$ = it is well separated.</p>
     <p>We want small $a$ and large $b$. Combine them into a single number between $-1$ and $+1$.</p>`,
  symbols: [
    { sym: "$a$", desc: "the point's mean distance to the other members of its own cluster (intra-cluster). Smaller is better." },
    { sym: "$b$", desc: "the point's mean distance to the members of the nearest neighboring cluster (inter-cluster). Larger is better." },
    { sym: "$\\max(a,b)$", desc: "the larger of $a$ and $b$ — divides the gap so the score stays between $-1$ and $1$." },
    { sym: "$s$", desc: "the silhouette of the point: $+1$ excellent, $0$ on a boundary, $-1$ probably misassigned." }
  ],
  formula: `$$ s = \\frac{b - a}{\\max(a,\\,b)} $$`,
  whatItDoes:
    `<p>Take the separation $b$ minus the tightness $a$. Divide by whichever is bigger so the score is normalized.</p>
     <p>If $a$ is tiny and $b$ is large (great clustering), $s \\approx b / b = 1$. If $a \\approx b$ (ambiguous), $s \\approx 0$. If $a &gt; b$ (closer to a neighbor than its own group), $s &lt; 0$.</p>
     <p>Average $s$ over all points to get the clustering's overall quality. Sweep $k$ and pick the $k$ with the highest average silhouette.</p>`,
  derivation:
    `<p>Why is $s$ guaranteed to lie in $[-1, 1]$? Both $a \\ge 0$ and $b \\ge 0$. Split into two cases.</p>
     <p><b>Case $a \\le b$:</b> then $\\max(a,b) = b$, so</p>
     $$ s = \\frac{b - a}{b} = 1 - \\frac{a}{b}. $$
     <p>Since $0 \\le a \\le b$, the ratio $a/b \\in [0,1]$, hence $s \\in [0, 1]$.</p>
     <p><b>Case $a &gt; b$:</b> then $\\max(a,b) = a$, so</p>
     $$ s = \\frac{b - a}{a} = \\frac{b}{a} - 1. $$
     <p>Since $0 \\le b &lt; a$, the ratio $b/a \\in [0,1)$, hence $s \\in [-1, 0)$.</p>
     <p>Together the two cases cover all values, so $s \\in [-1, 1]$ always. The boundary $a = b$ gives $s = 0$. $\\blacksquare$</p>`,
  example:
    `<p>Take one point in cluster Red. Its $a$ is the mean distance to other Red points (tightness); its $b$ is the mean distance to the nearest other cluster, Blue (separation). Compare a deep-inside point against a borderline one with $s = \\dfrac{b-a}{\\max(a,b)}$:</p>
     <table class="extable">
       <caption>Same formula, two points: confident core vs near-border</caption>
       <thead><tr><th>point</th><th class="num">$a$ (own)</th><th class="num">$b$ (nearest)</th><th class="num">$\\max(a,b)$</th><th class="num">$s$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">deep inside Red</td><td class="num">1.0</td><td class="num">4.0</td><td class="num">4.0</td><td class="num">0.75</td></tr>
         <tr><td class="row-h">near the border</td><td class="num">3.5</td><td class="num">4.0</td><td class="num">4.0</td><td class="num">0.125</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Deep point: $\\max(1.0, 4.0) = 4.0$, so $s = \\dfrac{4.0 - 1.0}{4.0} = \\dfrac{3.0}{4.0} = 0.75$ — a strong, confident assignment.</li>
       <li>Border point: $\\max(3.5, 4.0) = 4.0$, so $s = \\dfrac{4.0 - 3.5}{4.0} = \\dfrac{0.5}{4.0} = 0.125$ — barely inside, near a boundary.</li>
       <li>Both stay in $[-1, 1]$; the larger gap $b - a$ relative to $\\max(a,b)$ means a cleaner cluster fit.</li>
     </ul>`,
  application:
    `<p>The average silhouette is the standard way to choose how many clusters to use when you have no labels: customer segments, document topics, gene-expression groups. Run k-means for $k = 2, 3, 4, \\dots$ and keep the $k$ whose average silhouette peaks. It also flags individual points that may be misclustered (negative $s$).</p>`,
  whenToUse:
    `<p><b>Reach for the silhouette score when you've clustered unlabeled data and need to judge the result or choose the number of clusters $k$</b> — there's no ground truth to compare against, so you grade the geometry itself: tight inside each cluster, far from the next one. Sweep $k$, plot the average silhouette, and keep the peak.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>The elbow method (inertia)</b> — the elbow is often ambiguous and subjective; the silhouette gives a single number per point and an interpretable scale from $-1$ to $+1$.</li>
       <li><b>Eyeballing a scatterplot</b> — when you have more than two dimensions and can't just look.</li>
       <li><b>The Davies–Bouldin or Calinski–Harabasz index</b> — when you also want per-point diagnostics (which specific points are poorly assigned), not just a global score.</li>
     </ul>
     <p><b>Pick a different measure when:</b></p>
     <ul>
       <li>You actually have labels — use an external metric like the ARI (Adjusted Rand Index) or NMI (Normalized Mutual Information) instead.</li>
       <li>Clusters are non-convex or density-based (DBSCAN-style) — the silhouette assumes roughly convex, distance-based blobs and will undervalue stringy or nested shapes.</li>
       <li>The dataset is very large — the $O(n^2)$ pairwise distances get expensive; sample points or use a cheaper index.</li>
     </ul>
     <p><b>In practice:</b> scikit-learn's <code>silhouette_score</code> and <code>silhouette_samples</code>.</p>`,
  pitfalls:
    `<ul>
       <li><b>It assumes convex, roughly equal-size blobs.</b> On crescent or nested clusters the silhouette can rank a wrong $k$ as best. Don't use it to validate density-based clustering.</li>
       <li><b>Distance metric and scaling dominate.</b> The score is built from distances, so an unscaled large-magnitude feature controls the result. Standardize features and pick the metric deliberately before scoring.</li>
       <li><b>$O(n^2)$ cost.</b> Computing every pairwise distance is quadratic in the number of points and blows up on large datasets. Subsample or use an approximate variant.</li>
       <li><b>$k$ must equal the trained $k$.</b> Score each clustering with the same number of clusters it was built with; comparing a silhouette computed at one $k$ against a model trained at another is meaningless.</li>
       <li><b>Average hides structure.</b> A decent mean can mask one terrible cluster. Inspect the per-point silhouette plot, not just the single average.</li>
       <li><b>Undefined for singletons.</b> A cluster with one point has no intra-cluster distance $a$, so its silhouette is conventionally set to $0$ — watch for this skewing the average when clusters are tiny.</li>
     </ul>`,
  quiz: {
    q: `A point has intra-cluster distance $a = 2$ and nearest-other-cluster distance $b = 6$. What is its silhouette $s$?`,
    a: `<p>$\\max(a,b) = 6$. $s = \\dfrac{6 - 2}{6} = \\dfrac{4}{6} \\approx 0.67$. Comfortably positive — a good assignment.</p>`
  }
});

/* ==================== 6. ERROR / ABLATIVE ANALYSIS ================== */
L({
  id: "mlx-error-analysis",
  demo: function (host) {
    var comps = [
      { name: "preprocess", gain: 1 },     // small headroom
      { name: "detector", gain: 8 },       // big headroom -> focus here
      { name: "features", gain: 3 },
      { name: "classifier", gain: 2 }
    ];
    var base = 72;                          // baseline accuracy %
    var mode = 0;                           // 0 = error analysis (gains), 1 = ablative (losses)
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

    function render() {
      var c = THEME(); ctx.clearRect(0, 0, 640, 340);
      var n = comps.length;
      var marginL = 110, marginR = 90, top = 34, rowH = (340 - top - 24) / n;
      var totalGain = 0; for (var i = 0; i < n; i++) totalGain += comps[i].gain;
      var maxBar = 640 - marginL - marginR;
      var perfect = base + totalGain;
      var maxG = 0; for (var g = 0; g < n; g++) if (comps[g].gain > maxG) maxG = comps[g].gain;
      var biggestName = comps[0].name; for (var b2 = 0; b2 < n; b2++) if (comps[b2].gain === maxG) biggestName = comps[b2].name;

      ctx.font = "12px sans-serif";
      for (var k = 0; k < n; k++) {
        var y0 = top + k * rowH;
        var barH = rowH - 12;
        var frac = comps[k].gain / totalGain;
        var w = frac * maxBar;
        var biggest = comps[k].gain === maxG;
        ctx.fillStyle = biggest ? c.warn : c.accent + "88";
        ctx.fillRect(marginL, y0, Math.max(2, w), barH);
        ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(marginL, y0, Math.max(2, w), barH);
        ctx.fillStyle = c.ink; ctx.textAlign = "right"; ctx.fillText(comps[k].name, marginL - 8, y0 + barH / 2 + 4);
        ctx.fillStyle = c.dim; ctx.textAlign = "left";
        var label = (mode === 0 ? "+" : "−") + comps[k].gain + "% acc";
        ctx.fillText(label, marginL + Math.max(2, w) + 6, y0 + barH / 2 + 4);
      }
      ctx.fillStyle = c.accent2; ctx.textAlign = "left"; ctx.font = "13px sans-serif";
      if (mode === 0) ctx.fillText("baseline " + base + "%  →  all-perfect ceiling " + perfect + "%", 16, 22);
      else ctx.fillText("full system " + perfect + "%  →  remove a piece, accuracy drops", 16, 22);

      if (mode === 0) {
        readout.innerHTML = "<b>Error analysis.</b> Bar = how much accuracy each stage could add if it were made <b>perfect</b> (an oracle). The <b>detector</b> bar is largest (+8%), so fixing it gives the biggest win — work on it first, not on tiny gains elsewhere. Toggle to ablative.";
      } else {
        readout.innerHTML = "<b>Ablative analysis.</b> Start from the full system and <b>remove</b> one component at a time. Bar = accuracy lost when that piece is gone. The <b>" + biggestName + "</b> drops accuracy the most, so it contributes the most. Toggle back to error analysis.";
      }
    }
    var btn = document.createElement("button"); btn.textContent = "toggle: error ↔ ablative"; btn.className = "btn"; btn.style.margin = "6px 0";
    btn.addEventListener("click", function () { mode = 1 - mode; render(); });
    host.appendChild(btn);
    render();
  },
  title: "Error analysis & ablative analysis",
  tagline: "Find which part of your system to fix — and which part actually earns its keep.",
  prereqs: ["ml-bias-variance"],
  bigIdea:
    `<p><b>Analogy: finding the weak link in an assembly line.</b> Real ML systems are <b>pipelines</b> — several components in a row, like stations on an assembly line (preprocess → detect → classify …). A mistake at any station gets passed downstream, so the final product can be flawed even if most stations are fine. When the whole line underperforms, which station do you fix? Guessing can waste weeks polishing a station that was never the problem.</p>
     <p><b>Error analysis (ceiling analysis)</b> answers it by experiment: temporarily make <b>one</b> station <b>perfect</b> — feed it the correct answer from your labels (an "oracle") — and measure how much the final accuracy jumps. The station whose perfection helps most is your bottleneck; fix it first.</p>
     <p><b>Ablative analysis</b> is the mirror image: start from the full working line and <b>switch off one station</b> at a time, then see how much accuracy you lose. A big drop means that station was pulling its weight; a tiny drop means it is barely helping and could be cut.</p>
     <p>Two opposite questions, two tools: error analysis tells you <i>what to improve</i>, ablative analysis tells you <i>what is actually earning its keep</i>.</p>`,
  buildup:
    `<p>Both methods change <b>one</b> component at a time and re-measure the whole system. That isolates each part's effect.</p>
     <p><b>What does "make a component perfect" actually mean?</b> A perfect component makes <b>zero mistakes</b> — for every input it outputs exactly the right answer. You can't build such a thing, so you <b>fake it on your dev set</b>: for each example you hand that stage its <b>ground-truth</b> output (read straight from your labels) instead of whatever the component actually computed, and let the rest of the pipeline run on that flawless input. The overall accuracy you then measure is the <b>ceiling</b> you'd hit if that stage were flawless.</p>
     <p>Concretely: to "perfect" a face <b>detector</b>, you paste in the correct face boxes for every test image; to "perfect" an <b>OCR</b> (Optical Character Recognition) stage, you feed in the true text; to "perfect" a <b>retriever</b>, you hand the generator the actually-relevant document. Nothing is trained — you are just simulating "what if this one part never erred?"</p>
     <p>Making the <b>whole system</b> perfect means every stage gets its ground-truth output, so the final answer is always correct — that is $100\\%$ accuracy, the absolute ceiling. Error analysis asks: <i>which single stage, made perfect, closes the most of the gap up toward that $100\\%$?</i> (Equivalently: replace stages one-by-one from the front of the pipeline and watch accuracy climb toward 100% — the step with the biggest jump is the bottleneck. This is Andrew Ng's "ceiling analysis".)</p>
     <p>Error analysis compares against the <b>perfect</b> system (ground-truth output for one stage). It tells you the <b>upside</b> of improving that part.</p>
     <p>Ablative analysis is the opposite comparison — against a <b>baseline</b> (delete or simplify a component). It tells you how much a part is currently <b>contributing</b>.</p>`,
  symbols: [
    { sym: "$\\text{acc}$", desc: "the overall accuracy of the full system (fraction correct)." },
    { sym: "$\\text{acc}^{\\star}_c$", desc: "accuracy when component $c$ is replaced by a perfect oracle, everything else unchanged." },
    { sym: "$\\Delta_c = \\text{acc}^{\\star}_c - \\text{acc}$", desc: "the error-analysis gain from perfecting component $c$. Large $\\Delta_c$ = fix this component first." },
    { sym: "$\\nabla_c = \\text{acc} - \\text{acc}^{-c}$", desc: "the ablative drop: accuracy lost when component $c$ is removed ($\\text{acc}^{-c}$). Large drop = this component is pulling its weight." }
  ],
  formula: `$$ \\Delta_c = \\text{acc}^{\\star}_c - \\text{acc} \\qquad\\qquad \\nabla_c = \\text{acc} - \\text{acc}^{-c} $$`,
  whatItDoes:
    `<p><b>Error analysis:</b> walk down the pipeline. For each component, feed in the <b>correct</b> output for that stage and run the rest as usual. The accuracy gain $\\Delta_c$ is that stage's headroom. Pour your effort into the largest $\\Delta_c$.</p>
     <p><b>Ablative analysis:</b> start from the full system and switch off one feature/component at a time. The accuracy drop $\\nabla_c$ shows what each piece is worth. Tiny drop = the component is barely helping (consider cutting it).</p>
     <p>Together they answer two different questions: <i>what should I improve?</i> (error analysis) and <i>what is actually helping?</i> (ablative analysis).</p>`,
  derivation:
    `<p>Why does perfecting the component with the largest $\\Delta_c$ give the biggest possible win? Suppose perfecting components is "additive enough" that fixing component $c$ raises overall accuracy by about its headroom $\\Delta_c$ (each oracle only ever helps, so $\\Delta_c \\ge 0$).</p>
     <p>The whole pipeline can be no better than the all-oracle ceiling. Telescoping the gains from the baseline up to the perfect system:</p>
     $$ \\text{acc}^{\\text{perfect}} - \\text{acc} \\;\\le\\; \\sum_{c} \\Delta_c. $$
     <p>You have a fixed budget — you can deeply fix only a few components. To maximize the realized gain $\\sum_{c \\in S} \\Delta_c$ over a chosen subset $S$ of fixed size, sort the headrooms $\\Delta_{(1)} \\ge \\Delta_{(2)} \\ge \\dots$ in decreasing order. Picking the top $t$ then dominates any other choice of $t$ components term by term:</p>
     $$ \\sum_{c \\in \\text{top-}t} \\Delta_c \\;\\ge\\; \\sum_{c \\in S} \\Delta_c \\quad \\text{for every } S \\text{ with } |S| = t. $$
     <p>So ranking by $\\Delta_c$ and fixing from the top is the effort-optimal order. $\\blacksquare$</p>`,
  example:
    `<p>A face-recognition pipeline scores $\\text{acc} = 72\\%$ overall. Error analysis replaces each stage with a ground-truth oracle in turn, leaving the rest unchanged, and records the gain $\\Delta_c = \\text{acc}^{\\star}_c - \\text{acc}$:</p>
     <table class="extable">
       <caption>Per-stage headroom: which stage, made perfect, helps most</caption>
       <thead><tr><th>stage $c$</th><th class="num">$\\text{acc}$</th><th class="num">$\\text{acc}^{\\star}_c$</th><th class="num">$\\Delta_c$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">preprocessing</td><td class="num">72%</td><td class="num">73%</td><td class="num">+1%</td></tr>
         <tr><td class="row-h">face detector</td><td class="num">72%</td><td class="num">80%</td><td class="num">+8%</td></tr>
         <tr><td class="row-h">features</td><td class="num">72%</td><td class="num">75%</td><td class="num">+3%</td></tr>
         <tr><td class="row-h">classifier</td><td class="num">72%</td><td class="num">74%</td><td class="num">+2%</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Each $\\Delta_c = \\text{acc}^{\\star}_c - 72\\%$: detector $80 - 72 = 8$, features $75 - 72 = 3$, classifier $74 - 72 = 2$, preprocessing $73 - 72 = 1$.</li>
       <li>The <b>detector</b> has by far the largest headroom ($\\Delta = 8\\%$). Fix it first — perfecting preprocessing could earn at most $1\\%$.</li>
       <li>Ablative check: removing the classifier drops accuracy $72\\% \\to 60\\%$, so $\\nabla = 72 - 60 = 12\\%$ — confirming it is essential to keep.</li>
     </ul>`,
  application:
    `<p>Andrew Ng's CS229 popularized this for vision pipelines, but the idea drives any multi-stage ML (Machine Learning) system: speech recognition (acoustic vs. language model), recommendation (candidate generation vs. ranking), and modern RAG (Retrieval-Augmented Generation) stacks (retriever vs. generator). Before optimizing blindly, run error analysis to find the bottleneck and ablative analysis to prune dead weight.</p>`,
  whenToUse:
    `<p><b>Reach for error analysis (ceiling analysis) the moment a multi-stage pipeline underperforms and you have to decide where to spend your effort</b> — retriever vs. generator in RAG (Retrieval-Augmented Generation), detector vs. classifier in vision, acoustic vs. language model in speech. It replaces guesswork with a ranked list of headroom, so you fix the real bottleneck first. Reach for <b>ablative analysis</b> when you instead need to know which components actually earn their keep and which to prune.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Staring at the aggregate metric</b> — one accuracy number can't tell you <i>which stage</i> is dragging it down; ceiling analysis can.</li>
       <li><b>Tuning every component a little</b> — when you have limited time; ranking by headroom concentrates effort where it pays off.</li>
       <li><b>Pure hyperparameter search</b> — when the problem is structural (a weak stage), not a knob; no amount of tuning a downstream stage fixes a broken upstream one.</li>
     </ul>
     <p><b>Pick a different approach when:</b></p>
     <ul>
       <li>The system is a single end-to-end model with no separable stages — there's nothing to perfect or ablate independently; do per-slice error analysis on the data instead.</li>
       <li>You lack ground-truth outputs for intermediate stages — you can't build the oracle that ceiling analysis needs.</li>
     </ul>
     <p><b>In practice:</b> it's a manual experiment harness on your dev set — feed each stage its labels in turn and re-score; no special library required.</p>`,
  pitfalls:
    `<ul>
       <li><b>Stages aren't truly additive.</b> The single-stage gains $\\Delta_c$ rarely sum to the full gap because components interact. Treat the ranking as a guide, not a precise budget, and re-measure after each real fix.</li>
       <li><b>You need correct intermediate labels.</b> "Perfecting" a stage means injecting its ground-truth output. If those labels are noisy or unavailable, the ceiling is wrong and the ranking misleads.</li>
       <li><b>Run it on the dev set, not the test set.</b> Repeatedly probing components against the test set leaks information and inflates your final number. Keep a clean held-out test set untouched.</li>
       <li><b>Headroom is not delivered gain.</b> A big $\\Delta_c$ is the <i>ceiling</i> if the stage became flawless — real improvements capture only a fraction. Don't promise the full $\\Delta$.</li>
       <li><b>Noise can masquerade as signal.</b> On a small dev set a $1$–$2\\%$ gap may be sampling noise. Use enough examples (or confidence intervals) before declaring a winner.</li>
       <li><b>Ablation order and correlation mislead.</b> Removing one of two redundant components shows almost no drop, tempting you to cut a part that's actually important together with its twin. Check pairs, not just singles.</li>
     </ul>`,
  quiz: {
    q: `Error analysis on a 70%-accurate pipeline: perfecting the OCR stage lifts it to 85%, perfecting the parser lifts it to 73%. Which stage should you work on, and what is its $\\Delta$?`,
    a: `<p>The OCR stage: $\\Delta = 85\\% - 70\\% = 15\\%$, far more than the parser's $\\Delta = 73\\% - 70\\% = 3\\%$. Spend your effort on OCR.</p>`
  }
});

})();
