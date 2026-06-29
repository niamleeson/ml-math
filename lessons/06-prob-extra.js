/* =====================================================================
   MODULE 6 — PROBABILITY (ADVANCED): four deeper tools.
     - derived distributions (push a random variable through a function)
     - convolution (the distribution of a sum)
     - law of total variance (within-group + between-group)
     - moment generating functions (a function that stores every moment)
   Same lesson style as Module 1: short sentences, every symbol defined,
   a worked example with real numbers, a real-world application, a bespoke
   theme-aware canvas demo, and a real derivation ending in ∎.
   ===================================================================== */
(function () {
const M = "Probability & Statistics";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* shared theme reader for bespoke demos */
function _C() {
  var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
  var g = function (n, d) { try { return (s && (s.getPropertyValue(n) || "").trim()) || d; } catch (e) { return d; } };
  return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
}

/* ---------------------------------------------------------------- */
L({
  id: "probx-derived",
  title: "Derived distributions",
  tagline: "Push a random variable through a function. Here is how its spread of values gets reshaped.",
  prereqs: ["prob-pdf-cdf", "prob-expectation"],
  bigIdea:
    `<p><b>Plain-English picture.</b> Think of probability as a fixed lump of clay laid along a number line. A "distribution" is just how that clay is spread out — thick where values are likely, thin where they are rare.</p>
     <p>You know the distribution of $X$ — that is, you know how the clay sits. You now build a new variable $Y = g(X)$, which means: take each value of $X$ and run it through a function $g$ (a rule like "square it" or "double it"). The question is: how is the clay spread out now, for $Y$?</p>
     <p>Here "$g$" is the function (the reshaping rule) and "$g(X)$" is the result of feeding $X$ into it. The total clay never changes — there is always exactly one unit of probability. The function just moves it around.</p>
     <p>When $g$ <b>stretches</b> a region (pulls nearby values far apart), the same clay covers more line, so it gets spread thin — the density goes down.</p>
     <p>When $g$ <b>squeezes</b> a region (pushes nearby values together), the same clay piles into a smaller space — the density goes up.</p>`,
  buildup:
    `<p>A density $f_X$ is "probability per unit length" on the $x$ axis — the symbol $x$ is just a value $X$ could take. Density is like the <i>thickness</i> of the clay at a point, not the amount: to get an actual probability you multiply thickness by width (the way length times width gives area).</p>
     <p>Now apply $Y = g(X)$. Zoom in on a tiny slice of the line of width $dx$ sitting near a point $x$. (Here "$dx$" just means "a very small width.") That slice carries a tiny amount of probability: thickness times width, $f_X(x)\\,dx$.</p>
     <p>The function maps that slice to a new slice near $y = g(x)$, but the new slice has a <i>different</i> width $dy$. The probability inside it cannot change — it is the same clay — so $f_Y(y)\\,dy = f_X(x)\\,dx$.</p>
     <p>Rearrange and the new thickness is the old thickness times $dx/dy$, the ratio of the two widths. That ratio is the <b>stretch factor</b>: how much $g$ pulls apart or squeezes a tiny slice. And that is exactly how fast $g$ changes near $x$ — its slope.</p>`,
  symbols: [
    { sym: "$X$", desc: "the original (input) random variable, with known density $f_X$." },
    { sym: "$Y = g(X)$", desc: "the new random variable: feed $X$ through the function $g$." },
    { sym: "$g$", desc: "the transforming function (e.g. $g(x) = x^2$)." },
    { sym: "$h = g^{-1}$", desc: "the inverse function: given a value $y$, $h(y)$ is the $x$ that produced it." },
    { sym: "$f_X, f_Y$", desc: "the densities (probability per unit length) of $X$ and $Y$." },
    { sym: "$\\frac{dh}{dy}$", desc: "the slope of the inverse: how much $x$ moves when $y$ moves a little." },
    { sym: "$|\\cdot|$", desc: "absolute value: take the size, drop the sign (a width is never negative)." }
  ],
  formula: `$$ f_Y(y) = f_X\\big(h(y)\\big)\\,\\left|\\frac{dh}{dy}\\right|, \\qquad h = g^{-1} $$`,
  whatItDoes:
    `<p>To find the height of $Y$'s density at $y$: first find which $x$ landed there, $x = h(y)$.</p>
     <p>Read off the old height $f_X(h(y))$ at that point.</p>
     <p>Then rescale by $\\left|\\frac{dh}{dy}\\right|$ — the local stretch/squeeze factor.</p>
     <p>The safe two-step method (works even when $g$ is not one-to-one): write the CDF (Cumulative Distribution Function) $F_Y(y) = P(g(X) \\le y)$, then differentiate to get $f_Y$.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Assume $g$ is increasing and one-to-one, so $h = g^{-1}$ exists.</li>
       <li>Start from the CDF of $Y$: $F_Y(y) = P(Y \\le y) = P(g(X) \\le y)$.</li>
       <li>Since $g$ is increasing, $g(X) \\le y$ exactly when $X \\le h(y)$. So $F_Y(y) = P(X \\le h(y)) = F_X(h(y))$.</li>
       <li>Differentiate both sides in $y$. The chain rule gives $f_Y(y) = f_X(h(y))\\, h'(y)$.</li>
       <li>If instead $g$ is decreasing, $g(X) \\le y$ means $X \\ge h(y)$, giving $F_Y(y) = 1 - F_X(h(y))$ and a derivative $-f_X(h(y))h'(y)$; here $h' &lt; 0$, so the result is positive.</li>
       <li>Both cases collapse into one if we take the absolute value: $f_Y(y) = f_X(h(y))\\,|h'(y)|$. $\\;\\blacksquare$</li>
     </ul>`,
  example:
    `<p>Let $X$ be uniform on $[0,1]$, so $f_X(x) = 1$ for $0 \\le x \\le 1$. Let $Y = X^2$. Find $f_Y$ and plug in real numbers.</p>
     <ul class="steps">
       <li>Invert: $y = x^2$ with $x \\ge 0$ gives $h(y) = \\sqrt{y}$, valid for $0 \\le y \\le 1$.</li>
       <li>Slope of inverse: $\\frac{dh}{dy} = \\frac{1}{2\\sqrt{y}}$.</li>
       <li>Plug in: $f_Y(y) = f_X(\\sqrt{y}) \\cdot \\left|\\frac{1}{2\\sqrt{y}}\\right| = 1 \\cdot \\frac{1}{2\\sqrt{y}} = \\frac{1}{2\\sqrt{y}}$.</li>
       <li>Sanity check it integrates to 1: $\\int_0^1 \\frac{1}{2\\sqrt{y}}\\,dy = [\\sqrt{y}]_0^1 = 1$. Good.</li>
       <li>At $y = 0.04$: $f_Y = \\frac{1}{2\\sqrt{0.04}} = \\frac{1}{2(0.2)} = 2.5$ — squeezed values pile up.</li>
       <li>At $y = 0.64$: $f_Y = \\frac{1}{2\\sqrt{0.64}} = \\frac{1}{2(0.8)} = 0.625$ — stretched values spread thin.</li>
     </ul>
     <table class="extable">
       <caption>The flat input ($f_X = 1$ everywhere) gets reshaped by squaring.</caption>
       <thead><tr><th>$y$</th><th class="num">$f_X$ (before)</th><th class="num">$f_Y(y) = \\frac{1}{2\\sqrt{y}}$ (after)</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$0.04$</td><td class="num">$1$</td><td class="num">$2.5$</td></tr>
         <tr><td class="row-h">$0.25$</td><td class="num">$1$</td><td class="num">$1.0$</td></tr>
         <tr><td class="row-h">$0.64$</td><td class="num">$1$</td><td class="num">$0.625$</td></tr>
       </tbody>
     </table>
     <p>So $f_Y$ blows up near $y = 0$ and thins out near $y = 1$: squaring squashes small values together (probability piles up) and spreads large ones apart.</p>`,
  application:
    `<p>Generating random samples from a target distribution uses this idea in reverse: if $U$ is uniform on $[0,1]$, then $X = F^{-1}(U)$ has CDF $F$ (the "inverse-transform" trick). Reparameterization in variational autoencoders pushes a simple noise variable through a learned $g$ to get a complex one.</p>`,
  whenToUse:
    `<p><b>Reach for the change-of-variables formula whenever you push a known random variable through a deterministic function and need the new density</b> — not just a sample, but the actual probability per unit length. This is the everyday tool behind sampling and likelihood math in modern generative models.</p>
     <p><b>Where it unlocks real ML / AI (Artificial Intelligence) work:</b></p>
     <ul>
       <li><b>Normalizing flows</b> — the whole model is a stack of invertible $g$'s, and training maximizes the exact log-likelihood, which is just $\\log f_X(h(y)) + \\log\\left|\\frac{dh}{dy}\\right|$. The Jacobian (the multi-dimensional version of the slope term) is the entire game.</li>
       <li><b>The reparameterization trick</b> in a VAE (Variational Autoencoder) — sample $\\epsilon$ from a fixed simple density, then map it through $g$ so gradients can flow through the sampler.</li>
       <li><b>Inverse-transform sampling</b> — when you only have a uniform generator and need draws from some target distribution.</li>
     </ul>
     <p><b>Use a different tool when:</b> the transform is not invertible (use the CDF (Cumulative Distribution Function) method and split into monotone pieces), the map is many-to-one or loses dimensions (the density formula breaks — fall back to direct integration), or you only need samples and never the density (just push samples through $g$). In practice, libraries like PyTorch <code>TransformedDistribution</code> or TensorFlow Probability bijectors track the Jacobian for you.</p>`,
  pitfalls:
    `<ul>
       <li><b>Forgetting the Jacobian / slope factor.</b> The single most common error is writing $f_Y(y) = f_X(h(y))$ and dropping the $\\left|\\frac{dh}{dy}\\right|$. Without it the result does not integrate to 1 and your log-likelihood is simply wrong.</li>
       <li><b>Confusing $g$ and $g^{-1}$.</b> You evaluate the old density at $h(y) = g^{-1}(y)$ and differentiate the <i>inverse</i>, not $g$. Mixing these up flips the stretch factor upside down.</li>
       <li><b>Assuming the function is one-to-one when it is not.</b> For $Y = X^2$ over all of $\\mathbb{R}$, two $x$ values map to each $y$; you must add both branches. The one-line formula only covers the monotone case.</li>
       <li><b>Ignoring the support.</b> The new density lives only on the image of the old support. Returning a value outside the valid range of $y$ (or off by the endpoints) is a frequent off-by-one-style bug.</li>
       <li><b>Numerical blow-up where the slope is huge.</b> Near points where $g$ is nearly flat, $\\left|\\frac{dh}{dy}\\right|$ explodes (as at $y=0$ for $Y=X^2$). Work in log-space and clamp, exactly as flow implementations do.</li>
       <li><b>Singular Jacobian in higher dimensions.</b> If the multivariate map collapses a direction, the Jacobian determinant is 0 and the density is undefined — the transform must be a genuine bijection.</li>
     </ul>`,
  demo: function (host) {
    host.innerHTML = "";
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
    var nb = 24;
    var samples = [], counts = new Array(nb).fill(0);
    var pow = 2; // exponent in Y = X^pow

    function add(n) {
      for (var i = 0; i < n; i++) {
        var x = Math.random();          // X uniform on [0,1]
        var y = Math.pow(x, pow);       // Y = X^pow, also in [0,1]
        samples.push(y);
        var b = Math.floor(y * nb); if (b < 0) b = 0; if (b >= nb) b = nb - 1;
        counts[b]++;
      }
      draw();
    }
    function reset() { samples = []; counts = new Array(nb).fill(0); draw(); }

    function draw() {
      var c = _C(); ctx.clearRect(0, 0, 640, 300);
      ctx.font = "12px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      var L0 = 46, R0 = 624, T0 = 16, B0 = 248;
      // axis
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L0, B0); ctx.lineTo(R0, B0); ctx.stroke();
      var bw = (R0 - L0) / nb;
      var mx = 1; for (var i = 0; i < nb; i++) if (counts[i] > mx) mx = counts[i];
      var N = samples.length || 1;
      // histogram bars
      for (var j = 0; j < nb; j++) {
        var h = counts[j] / mx * (B0 - T0);
        ctx.fillStyle = c.accent; ctx.fillRect(L0 + j * bw, B0 - h, bw - 1, h);
      }
      // overlay theoretical density (probability per bin) * N, capped to panel height
      ctx.strokeStyle = c.warn; ctx.lineWidth = 2; ctx.beginPath();
      var started = false;
      for (var s = 0; s <= 120; s++) {
        var y = s / 120;
        var dens;
        if (y <= 0.0001) dens = (pow > 1) ? 6 : (1 / pow); // clamp the spike at 0
        else dens = (1 / pow) * Math.pow(y, (1 / pow) - 1);
        if (dens > 6) dens = 6; // cap so the curve stays on screen
        var expectedPerBin = dens * (1 / nb) * N; // expected count in a bin of width 1/nb
        var hh = expectedPerBin / mx * (B0 - T0);
        if (hh > (B0 - T0)) hh = (B0 - T0);
        var px = L0 + y * (R0 - L0), py = B0 - hh;
        if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // labels
      ctx.fillStyle = c.dim; ctx.fillText("0", L0, B0 + 14); ctx.fillText("1", R0 - 8, B0 + 14);
      // y-axis hint (density / count grows upward)
      ctx.fillStyle = c.dim; ctx.fillText("density →", L0 + 60, B0 + 14);
      // legend, indented well inside the left edge so it is never clipped
      var legX = L0 + 60;
      ctx.fillStyle = c.accent; ctx.fillText("histogram of Y = X^" + pow, legX, T0 + 12);
      ctx.fillStyle = c.warn; ctx.fillText("theoretical f_Y(y)", legX, T0 + 28);
      var mean = 0; for (var k = 0; k < samples.length; k++) mean += samples[k]; mean = samples.length ? mean / samples.length : 0;
      readout.innerHTML = "X is uniform on [0,1] (flat). Y = X<sup>" + pow + "</sup> bunches probability toward 0 because squaring/cubing squashes small values. " +
        "Samples: <b>" + samples.length + "</b>, mean of Y = <b>" + mean.toFixed(3) + "</b> (theory: 1/(" + pow + "+1) = " + (1 / (pow + 1)).toFixed(3) + ").";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    [["Draw 1", 1], ["Draw 200", 200], ["Draw 1000", 1000], ["Reset", 0]].forEach(function (p) {
      var b = document.createElement("button"); b.textContent = p[0];
      b.style.cssText = "margin-right:6px;padding:4px 10px;cursor:pointer;";
      b.addEventListener("click", function () { p[1] ? add(p[1]) : reset(); });
      row.appendChild(b);
    });
    host.appendChild(row);

    function mkSlider(label, min, max, val, step, set) {
      var r = document.createElement("div"); r.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = String(val);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = min; inp.max = max; inp.step = step; inp.value = val;
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); vs.textContent = String(v); set(v); reset(); add(1000); });
      r.appendChild(lab); r.appendChild(inp); host.appendChild(r);
    }
    mkSlider("exponent in Y = X^p", 1, 4, pow, 1, function (v) { pow = Math.round(v); });
    host.appendChild(readout);
    add(1000);
  },
  quiz: {
    q: `Let $X$ be uniform on $[0,1]$ and $Y = 2X$. Find $f_Y(y)$ and its support (the range of $y$).`,
    a: `<p>Inverse: $h(y) = y/2$, slope $\\frac{dh}{dy} = \\frac{1}{2}$. So $f_Y(y) = f_X(y/2)\\cdot\\frac{1}{2} = 1\\cdot\\frac{1}{2} = \\frac{1}{2}$ for $0 \\le y \\le 2$. Stretching by 2 halves the height and doubles the width — area stays 1.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "probx-convolution",
  title: "Distribution of a sum (convolution)",
  tagline: "Add two independent random variables. Their densities blend together by sliding one across the other.",
  prereqs: ["prob-pdf-cdf", "prob-normal"],
  bigIdea:
    `<p><b>Plain-English picture.</b> "Random variable" just means a number you do not know yet — the result of some random thing, like a die roll or a measurement. "Independent" means two of them do not influence each other: knowing one tells you nothing about the other.</p>
     <p>You have two independent random variables, $X$ and $Y$, and you care about their sum $Z = X + Y$. You know how likely each value of $X$ is and how likely each value of $Y$ is. The question: how likely is each possible total $Z$?</p>
     <p>Here is the trick. The sum can hit a target value $z$ in many ways: $X$ could be any value $k$, as long as $Y$ is exactly $z - k$ so the two add up to $z$. (Here $k$ is a stand-in for "whatever $X$ happened to be.")</p>
     <p>So to find the chance of total $z$, list every way to split it, multiply the two chances for each split, and add them all up. That sliding-one-list-across-the-other-and-summing is called <b>convolution</b>.</p>
     <p>It is also why sums of many small independent effects pile up into a bell shape — every middle total can be reached in far more ways than the extremes.</p>`,
  buildup:
    `<p>For two dice, the sum 7 happens as $1{+}6, 2{+}5, 3{+}4, 4{+}3, 5{+}2, 6{+}1$ — six ways.</p>
     <p>The sum 2 happens only as $1{+}1$ — one way. So 7 is far more likely than 2.</p>
     <p>In general, to get $Z = z$, pair every $X = k$ with the matching $Y = z - k$ and add their joint chances.</p>
     <p>Independence lets that joint chance factor into a simple product.</p>`,
  symbols: [
    { sym: "$X, Y$", desc: "two independent random variables you are adding." },
    { sym: "$Z = X + Y$", desc: "their sum — the new random variable of interest." },
    { sym: "$f_X, f_Y, f_Z$", desc: "the densities of $X$, $Y$, and $Z$ (for discrete variables, read these as PMFs (Probability Mass Functions) $p_X$, etc.)." },
    { sym: "$*$", desc: "the convolution operator: '$f_X * f_Y$' means blend the two densities by sliding and summing." },
    { sym: "$\\int$", desc: "an integral: a continuous sum over all values of $x$." },
    { sym: "$x$", desc: "the dummy variable we sum over; the partner value is then $z - x$." }
  ],
  formula: `$$ f_Z(z) = (f_X * f_Y)(z) = \\int_{-\\infty}^{\\infty} f_X(x)\\, f_Y(z - x)\\, dx $$`,
  whatItDoes:
    `<p>Fix the target sum $z$.</p>
     <p>For each possible value $x$ of $X$, the partner must be $z - x$ so the two add to $z$.</p>
     <p>By independence the chance of that pair is $f_X(x)\\,f_Y(z-x)$.</p>
     <p>Integrate (or, for dice, sum) over all $x$ to collect every way to reach $z$.</p>
     <p>Key fact: the sum of two independent Normals is again Normal, with means added and variances added.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Work with the CDF: $F_Z(z) = P(X + Y \\le z)$.</li>
       <li>Condition on $X = x$. Given that, the event $X + Y \\le z$ becomes $Y \\le z - x$.</li>
       <li>By independence, $P(Y \\le z - x \\mid X = x) = F_Y(z - x)$, unaffected by $X$.</li>
       <li>Average over $X$ using its density: $F_Z(z) = \\int_{-\\infty}^{\\infty} f_X(x)\\,F_Y(z - x)\\,dx$.</li>
       <li>Differentiate in $z$. The $z$ only appears inside $F_Y(z-x)$, and $\\frac{d}{dz}F_Y(z-x) = f_Y(z-x)$.</li>
       <li>So $f_Z(z) = \\int_{-\\infty}^{\\infty} f_X(x)\\,f_Y(z - x)\\,dx$ — exactly the convolution. $\\;\\blacksquare$</li>
     </ul>`,
  example:
    `<p>Take two small independent dice, $X$ on faces $\\{1,2,3\\}$ and $Y$ on faces $\\{1,2\\}$, each face uniform. So $p_X = (\\tfrac13,\\tfrac13,\\tfrac13)$ and $p_Y = (\\tfrac12,\\tfrac12)$. Build the whole PMF of $Z = X + Y$ by summing $p_X(x)\\,p_Y(z-x)$ over every $x$ — the convolution.</p>
     <table class="extable">
       <caption>Each target sum $z$ collects every pair $(x, z-x)$ that lands there.</caption>
       <thead><tr><th>$z$</th><th>pairs $(x, z{-}x)$</th><th class="num">$P(Z=z)$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$2$</td><td>$(1,1)$</td><td class="num">$\\tfrac13\\cdot\\tfrac12 = \\tfrac16$</td></tr>
         <tr><td class="row-h">$3$</td><td>$(1,2),(2,1)$</td><td class="num">$2(\\tfrac13\\cdot\\tfrac12) = \\tfrac13$</td></tr>
         <tr><td class="row-h">$4$</td><td>$(2,2),(3,1)$</td><td class="num">$2(\\tfrac13\\cdot\\tfrac12) = \\tfrac13$</td></tr>
         <tr><td class="row-h">$5$</td><td>$(3,2)$</td><td class="num">$\\tfrac13\\cdot\\tfrac12 = \\tfrac16$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Resulting PMF: $p_Z = (\\tfrac16,\\ \\tfrac13,\\ \\tfrac13,\\ \\tfrac16)$ at $z = 2,3,4,5$.</li>
       <li>It sums to $\\tfrac16+\\tfrac13+\\tfrac13+\\tfrac16 = 1$ — a valid distribution; two flat inputs blended into a flat-topped tent.</li>
       <li>Same recipe on two fair 6-sided dice gives $P(Z=5) = 4 \\times \\tfrac{1}{36} = \\tfrac19$ and a triangle peaking at $\\tfrac{6}{36}$ at $z=7$.</li>
       <li>Continuous check: two independent $\\mathcal{N}(0,1)$ Normals sum to $\\mathcal{N}(0,2)$ — means $0{+}0$, variances $1{+}1$.</li>
     </ul>`,
  application:
    `<p>Total latency across independent services is a convolution of per-service latencies. Adding independent noise sources, bootstrap resampling sums, and the spread of a random walk after many steps are all convolutions. The bell-shape pile-up is the Central Limit Theorem at work.</p>`,
  whenToUse:
    `<p><b>Reach for convolution whenever you need the distribution of a sum of independent random variables</b> — not just its mean or variance, but the full shape. Sums show up constantly in ML: pooled latencies, accumulated noise, aggregated counts, and bootstrap totals.</p>
     <p><b>Where it unlocks real ML / AI (Artificial Intelligence) work:</b></p>
     <ul>
       <li><b>Reasoning about additive noise.</b> When you inject independent noise (differential privacy, diffusion model forward steps, data augmentation), the resulting distribution is a convolution. Diffusion's "add Gaussian noise $T$ times" is a chain of convolutions, which is why each step stays Gaussian.</li>
       <li><b>Tail and SLA (Service Level Agreement) estimation.</b> End-to-end latency of independent stages is the convolution of their latencies; you need the convolved tail, not the sum of means, to predict the 99th percentile.</li>
       <li><b>Justifying the Gaussian assumption.</b> Convolution explains why averaging many independent effects gives the bell curve (the Central Limit Theorem), the basis for least-squares and most error bars.</li>
     </ul>
     <p><b>Use a different tool when:</b> the variables are <i>dependent</i> (convolution silently gives the wrong answer — model the joint distribution instead, or use copulas), you only need the mean and variance (just add them — no convolution needed), or you want a sample rather than the density (draw each variable and add). For named families (Normal, Poisson, Gamma) use the closed-form "add the parameters" shortcut; reach for the FFT (Fast Fourier Transform) only when convolving long discrete histograms numerically.</p>`,
  pitfalls:
    `<ul>
       <li><b>The independence assumption is load-bearing.</b> The product $f_X(x)\\,f_Y(z-x)$ only holds when $X$ and $Y$ are independent. Correlated inputs make convolution flat-out wrong — and real-world stages (shared queues, shared load) are often correlated.</li>
       <li><b>Add variances, never standard deviations.</b> For sums it is the variances that add ($\\sigma_Z^2 = \\sigma_X^2 + \\sigma_Y^2$). Adding the standard deviations overstates the spread every time.</li>
       <li><b>Getting the support limits wrong.</b> The integral runs only where both $f_X(x)$ and $f_Y(z-x)$ are nonzero. Convolving two things on $[0,\\infty)$ but integrating over all of $\\mathbb{R}$ is a classic off-by-the-bounds error.</li>
       <li><b>Discrete index bookkeeping.</b> For PMFs (Probability Mass Functions), each output index $z$ needs every pair $(x, z-x)$ that lands there; a wrong loop range drops or double-counts terms.</li>
       <li><b>It is the sum, not the average.</b> The average $\\frac{X+Y}{2}$ is the convolved sum then rescaled — and rescaling re-triggers the change-of-variables Jacobian. Forgetting the rescale halves nothing correctly.</li>
       <li><b>Numerical cost and aliasing.</b> Direct convolution of long histograms is $O(n^2)$; switching to the FFT (Fast Fourier Transform) is faster but wraps around (circular convolution) unless you zero-pad, which silently corrupts the tails.</li>
     </ul>`,
  demo: function (host) {
    host.innerHTML = "";
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
    // Two discrete inputs on faces 1..fA and 1..fB (like dice with adjustable sides), uniform each.
    var fA = 6, fB = 6;

    function pmfUniform(faces) { var p = []; for (var k = 1; k <= faces; k++) p.push({ k: k, p: 1 / faces }); return p; }
    function convolve(a, b) {
      var out = {};
      a.forEach(function (ai) {
        b.forEach(function (bi) {
          var s = ai.k + bi.k;
          out[s] = (out[s] || 0) + ai.p * bi.p;
        });
      });
      var arr = []; Object.keys(out).forEach(function (k) { arr.push({ k: parseInt(k, 10), p: out[k] }); });
      arr.sort(function (x, y) { return x.k - y.k; });
      return arr;
    }

    function draw() {
      var c = _C(); ctx.clearRect(0, 0, 640, 300);
      ctx.font = "12px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "center";
      var z = convolve(pmfUniform(fA), pmfUniform(fB));
      var lo = 2, hi = fA + fB, span = hi - lo;
      var L0 = 40, R0 = 624, T0 = 24, B0 = 250;
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L0, B0); ctx.lineTo(R0, B0); ctx.stroke();
      var maxP = 0; z.forEach(function (d) { if (d.p > maxP) maxP = d.p; });
      var bw = (R0 - L0) / (span + 1);
      z.forEach(function (d) {
        var h = d.p / maxP * (B0 - T0);
        var x = L0 + (d.k - lo) * bw + bw * 0.12;
        ctx.fillStyle = c.purple; ctx.fillRect(x, B0 - h, bw * 0.76, h);
        ctx.fillStyle = c.dim; ctx.fillText(String(d.k), x + bw * 0.38, B0 + 14);
        if (span <= 12) { ctx.fillStyle = c.ink; ctx.font = "10px -apple-system, sans-serif"; ctx.fillText(d.p.toFixed(3), x + bw * 0.38, B0 - h - 4); ctx.font = "12px -apple-system, sans-serif"; }
      });
      ctx.textAlign = "start"; ctx.fillStyle = c.purple;
      ctx.fillText("PMF of Z = A + B  (A on 1.." + fA + ", B on 1.." + fB + ", each uniform)", L0, 16);
      // peak / mean
      var mean = 0; z.forEach(function (d) { mean += d.k * d.p; });
      var peak = z[0]; z.forEach(function (d) { if (d.p > peak.p) peak = d; });
      readout.innerHTML = "Two flat inputs convolve into a tent (then a bell as faces grow). Most likely sum: <b>" + peak.k +
        "</b> with probability <b>" + peak.p.toFixed(3) + "</b>. Mean of Z = <b>" + mean.toFixed(2) +
        "</b> = mean(A)+mean(B) = " + ((fA + 1) / 2).toFixed(2) + " + " + ((fB + 1) / 2).toFixed(2) + ".";
    }

    function mkSlider(label, min, max, val, set) {
      var r = document.createElement("div"); r.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = String(val);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = min; inp.max = max; inp.step = 1; inp.value = val;
      inp.addEventListener("input", function () { var v = Math.round(parseFloat(inp.value)); vs.textContent = String(v); set(v); draw(); });
      r.appendChild(lab); r.appendChild(inp); host.appendChild(r);
    }
    mkSlider("faces on A", 2, 10, fA, function (v) { fA = v; });
    mkSlider("faces on B", 2, 10, fB, function (v) { fB = v; });
    host.appendChild(readout);
    draw();
  },
  quiz: {
    q: `$X \\sim \\mathcal{N}(2, 3)$ and $Y \\sim \\mathcal{N}(5, 4)$ are independent (variances 3 and 4). What is the distribution of $X + Y$?`,
    a: `<p>Sum of independent Normals is Normal, with means added and variances added: $X + Y \\sim \\mathcal{N}(2{+}5,\\; 3{+}4) = \\mathcal{N}(7, 7)$. (Add variances, never standard deviations.)</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "probx-total-variance",
  title: "Law of total variance",
  tagline: "Split a variable's spread into two parts: scatter inside each group, plus scatter between the groups.",
  prereqs: ["prob-variance", "prob-conditional-expectation"],
  bigIdea:
    `<p><b>Plain-English picture.</b> "Variance" is one number that says how spread out a set of values is: small variance means everything clusters near the average, large variance means the values are scattered far and wide. "Mean" is just the average.</p>
     <p>Concrete example: heights of students. Now imagine you sort them into groups by a second label $Y$ — say, by grade level. The total spread of height $X$ across the whole school comes from two separate sources.</p>
     <p><b>Source one (within-group):</b> even inside a single grade, students still differ in height — some tall, some short. That is the wobble <i>inside</i> each group.</p>
     <p><b>Source two (between-group):</b> the grades have different <i>average</i> heights — 12th graders are taller on average than 6th graders. That is how far the group averages sit from one another.</p>
     <p>The law of total variance says the total spread is <b>exactly</b> these two pieces added together — nothing left over, nothing counted twice. It is a clean accounting identity: total spread = average wobble inside groups + spread of the group averages.</p>`,
  buildup:
    `<p>Pick a group $Y$. Inside it, $X$ has a conditional mean $E[X \\mid Y]$ and a conditional variance $\\operatorname{Var}(X \\mid Y)$.</p>
     <p>Average the within-group variances to get the typical scatter inside a group: $E[\\operatorname{Var}(X \\mid Y)]$.</p>
     <p>Separately, the group means themselves vary from group to group: $\\operatorname{Var}(E[X \\mid Y])$.</p>
     <p>Total spread = average internal scatter + spread of the group centers.</p>`,
  symbols: [
    { sym: "$X$", desc: "the variable whose total variance we want." },
    { sym: "$Y$", desc: "the grouping variable (which group an observation falls in)." },
    { sym: "$\\operatorname{Var}(X)$", desc: "the overall variance of $X$ across everything." },
    { sym: "$E[X \\mid Y]$", desc: "the conditional mean: the average of $X$ inside the group picked by $Y$." },
    { sym: "$\\operatorname{Var}(X \\mid Y)$", desc: "the conditional variance: the spread of $X$ inside that group." },
    { sym: "$E[\\operatorname{Var}(X \\mid Y)]$", desc: "the within-group part: average the group variances over all groups." },
    { sym: "$\\operatorname{Var}(E[X \\mid Y])$", desc: "the between-group part: how much the group means differ." }
  ],
  formula: `$$ \\operatorname{Var}(X) = \\underbrace{E\\big[\\operatorname{Var}(X \\mid Y)\\big]}_{\\text{within-group}} + \\underbrace{\\operatorname{Var}\\big(E[X \\mid Y]\\big)}_{\\text{between-group}} $$`,
  whatItDoes:
    `<p>The first term averages each group's internal variance — the "unexplained" wobble left after you know the group.</p>
     <p>The second term measures how far apart the group means sit — the "explained" spread that knowing $Y$ accounts for.</p>
     <p>They add up to the whole variance, with nothing missing and nothing double-counted.</p>
     <p>If knowing $Y$ tells you a lot, the between-group term is large and the within-group term is small.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Recall the variance shortcut: $\\operatorname{Var}(X) = E[X^2] - (E[X])^2$.</li>
       <li>By the tower rule (law of total expectation), $E[X^2] = E\\big[E[X^2 \\mid Y]\\big]$ and $E[X] = E\\big[E[X \\mid Y]\\big]$.</li>
       <li>Inside a group, the same shortcut gives $E[X^2 \\mid Y] = \\operatorname{Var}(X \\mid Y) + (E[X \\mid Y])^2$.</li>
       <li>Take expectations: $E[X^2] = E[\\operatorname{Var}(X \\mid Y)] + E\\big[(E[X \\mid Y])^2\\big]$.</li>
       <li>Subtract $(E[X])^2 = \\big(E[E[X\\mid Y]]\\big)^2$ from both sides.</li>
       <li>The last two terms combine: $E\\big[(E[X\\mid Y])^2\\big] - \\big(E[E[X\\mid Y]]\\big)^2 = \\operatorname{Var}(E[X \\mid Y])$ — the variance of the conditional mean.</li>
       <li>What remains is $\\operatorname{Var}(X) = E[\\operatorname{Var}(X \\mid Y)] + \\operatorname{Var}(E[X \\mid Y])$. $\\;\\blacksquare$</li>
     </ul>`,
  example:
    `<p>Test scores in two equally-sized classes. Pick a random student. Find $\\operatorname{Var}(X)$.</p>
     <table class="extable">
       <caption>Per-class breakdown (each class has probability $\\tfrac12$).</caption>
       <thead><tr><th>class</th><th class="num">$P$</th><th class="num">mean $E[X\\mid Y]$</th><th class="num">variance $\\operatorname{Var}(X\\mid Y)$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">A</td><td class="num">$0.5$</td><td class="num">$70$</td><td class="num">$25$</td></tr>
         <tr><td class="row-h">B</td><td class="num">$0.5$</td><td class="num">$80$</td><td class="num">$25$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Within-group: $E[\\operatorname{Var}(X \\mid Y)] = \\frac{1}{2}(25) + \\frac{1}{2}(25) = 25$.</li>
       <li>Overall mean: $E[X] = \\frac{1}{2}(70) + \\frac{1}{2}(80) = 75$.</li>
       <li>Between-group: $\\operatorname{Var}(E[X \\mid Y]) = \\frac{1}{2}(70-75)^2 + \\frac{1}{2}(80-75)^2 = \\frac{1}{2}(25) + \\frac{1}{2}(25) = 25$.</li>
       <li>Total: $\\operatorname{Var}(X) = 25 + 25 = 50$.</li>
       <li>Check directly: $E[X^2] = \\frac{1}{2}(25 + 70^2) + \\frac{1}{2}(25 + 80^2) = \\frac{1}{2}(4925) + \\frac{1}{2}(6425) = 5675$, and $5675 - 75^2 = 5675 - 5625 = 50$. Matches.</li>
     </ul>`,
  application:
    `<p>This is the bias–variance and ANOVA (Analysis of Variance) backbone. Mixed-effects models split variance into within-subject and between-subject parts. Ensemble methods reduce the within term by averaging; "explained variance" $R^2$ is the between-group share of the total. It also underlies Rao–Blackwell variance reduction in estimators.</p>`,
  whenToUse:
    `<p><b>Reach for the law of total variance whenever you need to decide where a model's uncertainty comes from</b> — the part explained by a grouping or conditioning variable versus the irreducible scatter that remains. It is the bookkeeping identity behind variance decomposition across ML.</p>
     <p><b>Where it unlocks real ML / AI (Artificial Intelligence) work:</b></p>
     <ul>
       <li><b>Splitting predictive uncertainty</b> into <i>aleatoric</i> (the within-group $E[\\operatorname{Var}(X \\mid Y)]$ — noise you cannot remove) and <i>epistemic</i> (the between-group $\\operatorname{Var}(E[X \\mid Y])$ — uncertainty about the model). Bayesian and deep-ensemble uncertainty estimates use exactly this split.</li>
       <li><b>Understanding ensembles and bagging.</b> Averaging many models shrinks the within term, which is why bagging reduces variance; this identity makes that precise.</li>
       <li><b>$R^2$ and ANOVA.</b> "Explained variance" is the between-group share of the total — a direct application that powers feature-importance and experiment analysis.</li>
       <li><b>Rao–Blackwellization</b> — conditioning on a sufficient statistic can only lower variance, a fact that falls straight out of this law.</li>
     </ul>
     <p><b>Use a different tool when:</b> you only have point predictions with no notion of groups or conditioning (there is nothing to decompose), or the quantities are not square-integrable so variances do not exist (use robust spread measures instead). The identity is exact, so there is no "alternative method" — but estimating each term from finite data is where the care goes.</p>`,
  pitfalls:
    `<ul>
       <li><b>Forgetting the within term entirely.</b> People remember "variance of the group means" (between) and drop $E[\\operatorname{Var}(X \\mid Y)]$. The two <i>add</i>; the between part alone undercounts the total spread.</li>
       <li><b>Confusing $\\operatorname{Var}(E[X \\mid Y])$ with $E[\\operatorname{Var}(X \\mid Y)]$.</b> One is the variance of an average, the other the average of a variance — different numbers. Swapping them is the most common algebra slip.</li>
       <li><b>Unequal group sizes.</b> The outer expectation weights each group by its probability, not equally. With imbalanced groups, a plain unweighted average of the per-group variances is wrong.</li>
       <li><b>Estimator bias on small groups.</b> Conditional variances estimated from tiny groups are noisy and biased low (the $n$ vs $n-1$ correction), which inflates the apparent between-group share. Pool or regularize sparse groups.</li>
       <li><b>Reading aleatoric / epistemic backwards.</b> The within term is the irreducible noise; the between term is what conditioning explains. Labeling them the wrong way around inverts your uncertainty story.</li>
       <li><b>Assuming independence you do not have.</b> The law itself needs none, but downstream "just add the variances" shortcuts do — applying them to correlated components double-counts shared variance.</li>
     </ul>`,
  demo: function (host) {
    host.innerHTML = "";
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
    // three equally-likely groups: adjust their means; shared spread slider
    var means = [60, 75, 88];
    var spread = 5; // standard deviation inside each group (within-group sd)

    function draw() {
      var c = _C(); ctx.clearRect(0, 0, 640, 300);
      ctx.font = "12px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      var n = means.length, w = spread * spread; // each group's variance
      var grand = (means[0] + means[1] + means[2]) / n;
      var within = w; // average of equal within-group variances
      var between = 0; for (var i = 0; i < n; i++) between += (means[i] - grand) * (means[i] - grand) / n;
      var total = within + between;

      // LEFT: three group bell curves on a value axis
      var L0 = 30, R0 = 360, axisY = 200, T0 = 30;
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L0, axisY); ctx.lineTo(R0, axisY); ctx.stroke();
      var vmin = 40, vmax = 110;
      function vx(v) { return L0 + (v - vmin) / (vmax - vmin) * (R0 - L0); }
      var cols = [c.accent, c.accent2, c.warn];
      for (var gi = 0; gi < n; gi++) {
        ctx.strokeStyle = cols[gi]; ctx.lineWidth = 2; ctx.beginPath();
        var first = true;
        for (var tt = -3; tt <= 3; tt += 0.1) {
          var v = means[gi] + tt * spread;
          var dens = Math.exp(-0.5 * tt * tt);
          var px = vx(v), py = axisY - dens * 70;
          if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
        }
        ctx.stroke();
        // mean tick
        ctx.strokeStyle = cols[gi]; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(vx(means[gi]), axisY); ctx.lineTo(vx(means[gi]), axisY - 78); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = cols[gi]; ctx.fillText("group " + (gi + 1), vx(means[gi]) - 18, axisY - 84);
      }
      // grand mean
      ctx.strokeStyle = c.purple; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(vx(grand), axisY + 6); ctx.lineTo(vx(grand), T0); ctx.stroke();
      ctx.fillStyle = c.purple; ctx.fillText("grand mean", vx(grand) - 26, Math.max(12, T0 - 6));
      ctx.fillStyle = c.dim; ctx.fillText(String(vmin), L0, axisY + 16); ctx.fillText(String(vmax), R0 - 16, axisY + 16);

      // RIGHT: stacked bar — within (bottom) + between (top) = total
      // leave headroom at the top so the Var(X) title above the bar is never clipped
      var bx = 430, bw = 90, baseY = 250, scale = 210 / Math.max(60, total);
      var hWithin = within * scale, hBetween = between * scale;
      ctx.fillStyle = c.accent2; ctx.fillRect(bx, baseY - hWithin, bw, hWithin);
      ctx.fillStyle = c.purple; ctx.fillRect(bx, baseY - hWithin - hBetween, bw, hBetween);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(bx, baseY - hWithin - hBetween, bw, hWithin + hBetween);
      ctx.fillStyle = c.ink; ctx.textAlign = "center";
      // keep the title fully on-screen: never let it rise above the panel top edge
      var titleY = Math.max(14, baseY - hWithin - hBetween - 8);
      ctx.fillText("Var(X) = " + total.toFixed(1), bx + bw / 2, titleY);
      ctx.fillStyle = c.accent2; ctx.fillText("within " + within.toFixed(1), bx + bw / 2, baseY - hWithin / 2 + 4);
      ctx.fillStyle = c.purple; ctx.fillText("between " + between.toFixed(1), bx + bw / 2, baseY - hWithin - hBetween / 2 + 4);
      ctx.textAlign = "start";

      readout.innerHTML = "Within-group (average internal scatter) = <b>" + within.toFixed(1) +
        "</b>. Between-group (spread of group means) = <b>" + between.toFixed(1) +
        "</b>. They stack to total Var(X) = <b>" + total.toFixed(1) +
        "</b>. Spread the group means apart and the purple (between) part grows; widen each group and the green (within) part grows.";
    }

    function mkSlider(label, min, max, val, step, set) {
      var r = document.createElement("div"); r.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = String(val);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = min; inp.max = max; inp.step = step; inp.value = val;
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); vs.textContent = String(v); set(v); draw(); });
      r.appendChild(lab); r.appendChild(inp); host.appendChild(r);
    }
    mkSlider("group 1 mean", 45, 105, means[0], 1, function (v) { means[0] = v; });
    mkSlider("group 2 mean", 45, 105, means[1], 1, function (v) { means[1] = v; });
    mkSlider("group 3 mean", 45, 105, means[2], 1, function (v) { means[2] = v; });
    mkSlider("within-group spread (sd)", 1, 12, spread, 1, function (v) { spread = v; });
    host.appendChild(readout);
    draw();
  },
  quiz: {
    q: `Two equal-sized groups: group 1 has mean 10, variance 4; group 2 has mean 20, variance 4. What is $\\operatorname{Var}(X)$ for a random member?`,
    a: `<p>Within: $\\frac{1}{2}(4)+\\frac{1}{2}(4)=4$. Grand mean $=15$; between: $\\frac{1}{2}(10-15)^2+\\frac{1}{2}(20-15)^2=\\frac{1}{2}(25)+\\frac{1}{2}(25)=25$. Total $=4+25=29$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "probx-mgf",
  title: "Moment generating functions",
  tagline: "One function that secretly stores every moment of a distribution. Differentiate at zero to read them off.",
  prereqs: ["prob-expectation", "prob-variance"],
  bigIdea:
    `<p><b>Plain-English picture.</b> A "moment" is just the average of a power of $X$. The first moment is the average of $X$ itself, $E[X]$ — the ordinary mean. The second moment is the average of $X^2$, written $E[X^2]$. (Here $E[\\cdot]$ means "expected value", i.e. the long-run average.) Together the moments pin down the shape of a distribution: the first sets where it sits, the second how wide it is, and so on.</p>
     <p>Computing each moment separately is tedious. The <b>moment generating function</b> (MGF) is a clever single function $M_X(t)$ that secretly stores <i>all</i> the moments at once — think of it as a sealed box, and each moment is a different item inside.</p>
     <p>To open the box and read out a moment, you <b>differentiate</b> (take the slope of) $M_X(t)$ and evaluate it at $t = 0$. One derivative gives the first moment (the mean), two derivatives give the second moment, and so on. The knob "$t$" is a helper dummy variable; we only care about behavior right at $t = 0$.</p>
     <p>Bonus superpower: for a sum of independent variables, the MGF is just the <b>product</b> of their MGFs. So a hard "what is the distribution of a sum?" question turns into easy multiplication.</p>`,
  buildup:
    `<p>Take the expected value of $e^{tX}$, treating $t$ as a knob you can turn.</p>
     <p>Expand $e^{tX} = 1 + tX + \\frac{t^2}{2}X^2 + \\dots$ — a power series in $t$ whose coefficients are powers of $X$.</p>
     <p>Averaging turns those into moments $E[X], E[X^2], \\dots$, parked at each power of $t$.</p>
     <p>So the slope and curvature of $M_X$ at $t=0$ literally are the first and second moments.</p>`,
  symbols: [
    { sym: "$X$", desc: "the random variable being described." },
    { sym: "$t$", desc: "a real-number knob (a dummy variable). We mostly care about behavior near $t = 0$." },
    { sym: "$e^{tX}$", desc: "the exponential of $tX$ — the quantity we average." },
    { sym: "$M_X(t)$", desc: "the moment generating function: $M_X(t) = E[e^{tX}]$." },
    { sym: "$M_X'(0)$", desc: "the first derivative (slope) of $M_X$ at $t=0$; it equals $E[X]$." },
    { sym: "$M_X''(0)$", desc: "the second derivative (curvature) at $t=0$; it equals $E[X^2]$." },
    { sym: "$E[X^2]$", desc: "the second moment; variance is then $E[X^2] - (E[X])^2$." }
  ],
  formula: `$$ M_X(t) = E\\!\\left[e^{tX}\\right], \\qquad M_X'(0) = E[X], \\qquad M_X''(0) = E[X^2] $$`,
  whatItDoes:
    `<p>$M_X(t)$ always equals 1 at $t = 0$ (since $e^0 = 1$).</p>
     <p>Its slope at 0 hands you the mean; its curvature at 0 hands you $E[X^2]$.</p>
     <p>Then $\\operatorname{Var}(X) = M_X''(0) - \\big(M_X'(0)\\big)^2$.</p>
     <p>For independent $X$ and $Y$: $M_{X+Y}(t) = M_X(t)\\,M_Y(t)$ — multiply, which makes sums of independent variables easy.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Write the series $e^{tX} = 1 + tX + \\frac{t^2}{2!}X^2 + \\frac{t^3}{3!}X^3 + \\cdots$.</li>
       <li>Take expectations term by term: $M_X(t) = 1 + tE[X] + \\frac{t^2}{2!}E[X^2] + \\frac{t^3}{3!}E[X^3] + \\cdots$.</li>
       <li>Differentiate once: $M_X'(t) = E[X] + tE[X^2] + \\frac{t^2}{2!}E[X^3] + \\cdots$. Set $t=0$: $M_X'(0) = E[X]$.</li>
       <li>Differentiate again: $M_X''(t) = E[X^2] + tE[X^3] + \\cdots$. Set $t=0$: $M_X''(0) = E[X^2]$.</li>
       <li>In general the $n$-th derivative at 0 is the $n$-th moment $E[X^n]$ — the series coefficient $\\frac{t^n}{n!}E[X^n]$ survives only its own derivative.</li>
       <li>For the product rule: if $X$ and $Y$ are independent then $e^{tX}$ and $e^{tY}$ are independent, so $E[e^{t(X+Y)}] = E[e^{tX}]E[e^{tY}] = M_X(t)M_Y(t)$. $\\;\\blacksquare$</li>
     </ul>
     <p><i>Note: replacing $t$ with $it$ gives the characteristic function $\\varphi_X(t)=E[e^{itX}]$, which always exists even when the MGF does not.</i></p>`,
  example:
    `<p>Let $X$ be exponential with rate $\\lambda$, density $f(x) = \\lambda e^{-\\lambda x}$ for $x \\ge 0$. Find its mean and variance via the MGF. To get concrete numbers, also plug in $\\lambda = 2$.</p>
     <ul class="steps">
       <li>$M_X(t) = \\int_0^\\infty e^{tx}\\lambda e^{-\\lambda x}\\,dx = \\lambda \\int_0^\\infty e^{-(\\lambda - t)x}\\,dx = \\frac{\\lambda}{\\lambda - t}$ for $t &lt; \\lambda$.</li>
       <li>First derivative: $M_X'(t) = \\frac{\\lambda}{(\\lambda - t)^2}$, so $M_X'(0) = \\frac{\\lambda}{\\lambda^2} = \\frac{1}{\\lambda} = E[X]$.</li>
       <li>Second derivative: $M_X''(t) = \\frac{2\\lambda}{(\\lambda - t)^3}$, so $M_X''(0) = \\frac{2\\lambda}{\\lambda^3} = \\frac{2}{\\lambda^2} = E[X^2]$.</li>
       <li>Variance: $\\operatorname{Var}(X) = E[X^2] - (E[X])^2 = \\frac{2}{\\lambda^2} - \\frac{1}{\\lambda^2} = \\frac{1}{\\lambda^2}$.</li>
     </ul>
     <table class="extable">
       <caption>Read each moment off a derivative at $t=0$; numbers shown for $\\lambda = 2$.</caption>
       <thead><tr><th>quantity</th><th>formula</th><th class="num">value at $\\lambda=2$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$M_X'(0) = E[X]$</td><td>$\\frac{1}{\\lambda}$</td><td class="num">$0.5$</td></tr>
         <tr><td class="row-h">$M_X''(0) = E[X^2]$</td><td>$\\frac{2}{\\lambda^2}$</td><td class="num">$0.5$</td></tr>
         <tr><td class="row-h">$\\operatorname{Var}(X)$</td><td>$\\frac{1}{\\lambda^2}$</td><td class="num">$0.25$</td></tr>
       </tbody>
     </table>
     <p>Check: $\\operatorname{Var} = E[X^2] - (E[X])^2 = 0.5 - 0.5^2 = 0.25$. Both match the known exponential facts: mean $\\frac{1}{\\lambda}$, variance $\\frac{1}{\\lambda^2}$.</p>`,
  application:
    `<p>MGFs prove that sums of independent Poissons are Poisson and sums of independent Normals are Normal (multiply the MGFs, recognize the form). They power Chernoff bounds — the backbone of concentration inequalities and generalization bounds in learning theory — by bounding $P(X \\ge a) \\le e^{-ta}M_X(t)$.</p>`,
  whenToUse:
    `<p><b>Reach for the moment generating function (MGF) when you need to control the <i>tail</i> of a sum of independent random variables</b> — the probability of a rare large deviation — rather than just its mean. This is the engine behind the concentration inequalities that justify why averages converge and why learned models generalize.</p>
     <p><b>Where it unlocks real ML / AI (Artificial Intelligence) work:</b></p>
     <ul>
       <li><b>Chernoff and Hoeffding bounds.</b> Bounding $P(X \\ge a) \\le e^{-ta}M_X(t)$ and optimizing over $t$ gives exponential tail bounds — the basis of sample-complexity and generalization guarantees in learning theory.</li>
       <li><b>Bandits and PAC (Probably Approximately Correct) analysis.</b> Confidence radii in UCB (Upper Confidence Bound) algorithms and the bounds behind A/B test sizing come straight from MGF / sub-Gaussian arguments.</li>
       <li><b>Proving distributions of sums.</b> Because $M_{X+Y}(t) = M_X(t)\\,M_Y(t)$ for independent variables, MGFs cleanly show sums of independent Normals are Normal, sums of Poissons are Poisson, and so on.</li>
     </ul>
     <p><b>Use a different tool when:</b> the MGF does not exist (heavy-tailed variables like Cauchy or anything without all moments — use the characteristic function $\\varphi_X(t)=E[e^{itX}]$, which always exists), you only need the mean and variance (compute them directly), or the variables are dependent (the product rule fails — use martingale or coupling bounds instead). For named families the MGF has a known closed form you can look up; you rarely derive it from scratch in production.</p>`,
  pitfalls:
    `<ul>
       <li><b>The MGF may not exist.</b> $M_X(t) = E[e^{tX}]$ is only finite on an interval around 0 for light-tailed variables. For heavy tails it diverges for every $t>0$, so any "moment via the MGF" argument is invalid — switch to the characteristic function.</li>
       <li><b>Region of convergence matters.</b> For the exponential, $M_X(t)=\\frac{\\lambda}{\\lambda - t}$ is only valid for $t &lt; \\lambda$; plugging in $t \\ge \\lambda$ gives nonsense. Always carry the range of $t$.</li>
       <li><b>Evaluate derivatives at exactly $t=0$.</b> Moments are $M_X^{(n)}(0)$. Reading the slope at any other $t$ does not give $E[X]$ — a frequent slip when differentiating numerically.</li>
       <li><b>Product rule needs independence.</b> $M_{X+Y}=M_X M_Y$ holds only for independent $X,Y$. Multiplying MGFs of correlated variables silently gives the wrong distribution.</li>
       <li><b>Numerical overflow.</b> $e^{tX}$ explodes for large $tX$, so Monte-Carlo estimates of the MGF have enormous variance and overflow. Work with the cumulant generating function $\\log M_X(t)$ and log-sum-exp tricks.</li>
       <li><b>Loose Chernoff bounds.</b> The bound holds for <i>every</i> $t$ in the valid range, but only the optimized $t$ is tight. Forgetting to minimize over $t$ leaves a uselessly weak tail bound.</li>
     </ul>`,
  demo: function (host) {
    host.innerHTML = "";
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
    // X is exponential with rate lambda: M(t) = lambda/(lambda - t), defined for t < lambda.
    var lam = 1.5;

    function draw() {
      var c = _C(); ctx.clearRect(0, 0, 640, 300);
      ctx.font = "12px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      var L0 = 50, R0 = 620, T0 = 16, B0 = 250;
      // t ranges from -2 up to just below lambda
      var tmin = -2, tmax = Math.min(lam - 0.15, 3);
      if (tmax <= tmin) tmax = tmin + 0.5;
      var Mmax = lam / (lam - tmax); // largest M on screen
      if (!isFinite(Mmax) || Mmax > 12 || Mmax <= 0) Mmax = 12;
      var Mmin = 0;
      function tx(t) { return L0 + (t - tmin) / (tmax - tmin) * (R0 - L0); }
      function my(m) { var mm = Math.max(Mmin, Math.min(Mmax, m)); return B0 - (mm - Mmin) / (Mmax - Mmin) * (B0 - T0); }
      // axes
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L0, B0); ctx.lineTo(R0, B0); ctx.stroke();           // t axis
      ctx.beginPath(); ctx.moveTo(tx(0), T0); ctx.lineTo(tx(0), B0); ctx.stroke();     // t=0 line
      // M(t) curve
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath(); var first = true;
      for (var t = tmin; t <= tmax; t += (tmax - tmin) / 240) {
        var Mv = lam / (lam - t);
        var px = tx(t), py = my(Mv);
        if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // values at 0
      var M0 = 1;                         // lam/(lam-0)=1
      var Mp0 = 1 / lam;                  // mean
      var Mpp0 = 2 / (lam * lam);         // E[X^2]
      var variance = Mpp0 - Mp0 * Mp0;
      // tangent line at t=0 (slope = Mp0), drawn over a small window
      ctx.strokeStyle = c.accent2; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
      var tA = -1.2, tB = 1.2;
      ctx.moveTo(tx(tA), my(M0 + Mp0 * tA)); ctx.lineTo(tx(tB), my(M0 + Mp0 * tB));
      ctx.stroke(); ctx.setLineDash([]);
      // mark the point (0, 1)
      ctx.fillStyle = c.warn; ctx.beginPath(); ctx.arc(tx(0), my(1), 5, 0, 7); ctx.fill();
      ctx.fillStyle = c.warn; ctx.fillText("M(0) = 1", tx(0) + 8, my(1) - 8);
      // asymptote at t = lambda
      ctx.strokeStyle = c.purple; ctx.setLineDash([2, 4]); ctx.lineWidth = 1.5;
      if (lam <= tmax) { ctx.beginPath(); ctx.moveTo(tx(lam), T0); ctx.lineTo(tx(lam), B0); ctx.stroke(); }
      ctx.setLineDash([]);
      ctx.fillStyle = c.purple; ctx.fillText("blows up at t = λ = " + lam.toFixed(2), L0 + 6, T0 + 44);
      // labels
      ctx.fillStyle = c.accent; ctx.fillText("M(t) = λ/(λ − t)", L0 + 6, T0 + 12);
      ctx.fillStyle = c.accent2; ctx.fillText("tangent slope at 0 = E[X]", L0 + 6, T0 + 28);
      ctx.fillStyle = c.dim; ctx.textAlign = "center";
      ctx.fillText("t = 0", tx(0), B0 + 14); ctx.fillText(tmin.toFixed(1), L0, B0 + 14);
      ctx.textAlign = "start";

      readout.innerHTML = "Exponential rate λ = <b>" + lam.toFixed(2) + "</b>. Read moments at t = 0: " +
        "slope M'(0) = E[X] = 1/λ = <b>" + Mp0.toFixed(3) + "</b>, curvature M''(0) = E[X²] = 2/λ² = <b>" + Mpp0.toFixed(3) + "</b>, " +
        "so Var(X) = E[X²] − (E[X])² = <b>" + variance.toFixed(3) + "</b> = 1/λ². The curve shoots to infinity at t = λ.";
    }

    function mkSlider(label, min, max, val, step, set) {
      var r = document.createElement("div"); r.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = String(val);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = min; inp.max = max; inp.step = step; inp.value = val;
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); vs.textContent = v.toFixed(2); set(v); draw(); });
      r.appendChild(lab); r.appendChild(inp); host.appendChild(r);
    }
    mkSlider("rate λ (of the exponential X)", 0.5, 3, lam, 0.05, function (v) { lam = v; });
    host.appendChild(readout);
    draw();
  },
  quiz: {
    q: `If $M_X(t) = e^{2t + 3t^2}$, what are $E[X]$ and $\\operatorname{Var}(X)$? (Hint: differentiate at $t=0$.)`,
    a: `<p>$M_X'(t) = (2 + 6t)e^{2t+3t^2}$, so $M_X'(0) = 2 = E[X]$. $M_X''(t) = \\big(6 + (2+6t)^2\\big)e^{2t+3t^2}$, so $M_X''(0) = 6 + 4 = 10 = E[X^2]$. Then $\\operatorname{Var}(X) = 10 - 2^2 = 6$. (This is the MGF of $\\mathcal{N}(2, 6)$.)</p>`
  }
});

})();
