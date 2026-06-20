/* =====================================================================
   MODULE 2 — MACHINE LEARNING (Stanford CS229).
   Style copied from 00-foundations.js (the gold standard):
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Machine Learning (CS229)";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---------------------------------------------------------------- */
L({
  id: "ml-supervised",
  demo: function (host) {
    var P = [{ x: 1, y: 2.1 }, { x: 2, y: 3.9 }, { x: 3, y: 6.2 }, { x: 4, y: 7.8 }, { x: 5, y: 10.1 }];
    Demos.scatter(host, { points: P, init: function (api) {
      var theta = 2, intercept = 0;
      function render() {
        api.draw(function (ctx, col, px, py) {
          ctx.strokeStyle = col.warn; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px(0), py(intercept + theta * 0));
          ctx.lineTo(px(6), py(intercept + theta * 6));
          ctx.stroke();
        });
        var xs = 3, pred = intercept + theta * xs;
        api.readout.innerHTML = "Hypothesis h(x) = θ·x + b with θ = " + theta.toFixed(2) + ", b = " + intercept.toFixed(2) + ". The orange line is the learned rule. Sample prediction: h(" + xs + ") = " + theta.toFixed(2) + "·" + xs + " + " + intercept.toFixed(2) + " = <b>" + pred.toFixed(2) + "</b>. Drag the sliders to fit the dots.";
      }
      api.slider("weight θ", -2, 4, theta, 0.05, function (v) { theta = v; render(); });
      api.slider("intercept b", -4, 4, intercept, 0.05, function (v) { intercept = v; render(); });
      render();
    } });
  },
  title: "Supervised learning setup",
  tagline: "Show the computer examples with answers. It learns to answer new ones.",
  prereqs: ["fnd-vector", "fnd-dot"],
  bigIdea:
    `<p><b>Supervised learning</b> means learning from examples that already have answers.</p>
     <p>You collect many pairs: an input, and its correct output.</p>
     <p>The computer studies the pairs. It builds a rule that maps input to output.</p>
     <p>Then it uses that rule to answer brand-new inputs it has never seen.</p>`,
  buildup:
    `<p>Each example is a pair: an input $x$ (a vector of features) and an output $y$ (the answer).</p>
     <p>The collection of all these pairs is the <b>training set</b>.</p>
     <p>The rule the computer learns is called the <b>hypothesis</b>.</p>`,
  symbols: [
    { sym: "$x^{(i)}$", desc: "the input of the $i$-th example (a vector of features). The little $(i)$ is the example number, not a power." },
    { sym: "$y^{(i)}$", desc: "the correct answer for the $i$-th example." },
    { sym: "$m$", desc: "how many training examples you have." },
    { sym: "$h_\\theta(x)$", desc: "the hypothesis: the rule that turns an input $x$ into a predicted output. The $\\theta$ ('theta') is the set of numbers the rule uses." }
  ],
  formula: `$$ \\text{training set} = \\{(x^{(1)},y^{(1)}),\\, \\dots,\\, (x^{(m)},y^{(m)})\\} \\quad\\Rightarrow\\quad h_\\theta(x) \\approx y $$`,
  whatItDoes:
    `<p>The set lists $m$ example pairs. Each pair is one input and its true answer.</p>
     <p>The goal: build $h_\\theta$ so that $h_\\theta(x^{(i)})$ is close to $y^{(i)}$ for the examples, and also for new inputs.</p>
     <p>If $y$ is a number (like price), it is <b>regression</b>. If $y$ is a category (like spam / not spam), it is <b>classification</b>.</p>`,
  example:
    `<p>You want to predict house price from size. You collect 3 examples:</p>
     <ul class="steps">
       <li>$(x^{(1)}, y^{(1)}) = (1000 \\text{ sq ft},\\ \\$200\\text{k})$.</li>
       <li>$(x^{(2)}, y^{(2)}) = (1500 \\text{ sq ft},\\ \\$300\\text{k})$.</li>
       <li>$(x^{(3)}, y^{(3)}) = (2000 \\text{ sq ft},\\ \\$400\\text{k})$.</li>
       <li>Here $m = 3$. The price is a number, so this is regression.</li>
       <li>A learned rule might be $h_\\theta(x) = 200 \\times x$ (price = 200 per sq ft). For a new 1800 sq ft house it predicts $\\$360$k.</li>
     </ul>`,
  application:
    `<p>Spam filters learn from emails labeled spam / not-spam. Photo apps learn to tag cats from labeled photos. Loan approval learns from past approved / denied applications. Anything with labeled past data can be supervised learning.</p>`,
  quiz: {
    q: `You predict whether an email is spam (yes / no) from its words. Is this regression or classification? What is $y$?`,
    a: `<p>Classification, because the answer is a category, not a number. Here $y$ is "spam" or "not spam" (often written as 1 or 0).</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-loss",
  demo: function (host) {
    Demos.plot(host, {
      xmin: -3, xmax: 3, ymin: 0, ymax: 8,
      curves: [
        { f: function (r) { return 0.5 * r * r; }, label: "squared loss" },
        { f: function (m) { return Math.max(0, 1 - m); }, label: "hinge loss" }
      ],
      drag: { curve: 0, start: 2, label: "residual r = y−z (or margin m)",
        readout: function (r, y) { return "At r = " + r.toFixed(2) + ": squared loss ½r² = <b>" + (0.5 * r * r).toFixed(3) + "</b>, hinge loss max(0,1−r) = <b>" + Math.max(0, 1 - r).toFixed(3) + "</b>. Squared loss grows fast; hinge is 0 once the margin ≥ 1."; } }
    });
  },
  title: "Loss function",
  tagline: "One number that says how wrong a single prediction was.",
  prereqs: ["ml-supervised"],
  bigIdea:
    `<p>A <b>loss function</b> measures how wrong one prediction is.</p>
     <p>It compares the prediction to the true answer.</p>
     <p>Small loss = good prediction. Big loss = bad prediction. Zero loss = perfect.</p>
     <p>Training a model means making this number as small as possible.</p>`,
  buildup:
    `<p>The model guesses a value $z$. The truth is $y$. We need a score for the mistake.</p>
     <p>The most common score for numbers: take the difference, square it, halve it.</p>
     <p>Squaring removes the minus sign and punishes big errors much more than small ones.</p>`,
  symbols: [
    { sym: "$z$", desc: "the model's prediction (also written $h_\\theta(x)$)." },
    { sym: "$y$", desc: "the true answer for this example." },
    { sym: "$L(z, y)$", desc: "the loss: a single number for how wrong $z$ is compared to $y$." },
    { sym: "$(y - z)^2$", desc: "the difference between truth and prediction, squared. Squaring makes it positive and grows fast." }
  ],
  formula: `$$ L(z, y) = \\frac{1}{2}\\,(y - z)^2 \\qquad\\text{(least-squared loss)} $$`,
  whatItDoes:
    `<p>Find the gap $y - z$. Square it so it is always positive. Multiply by $\\tfrac12$ (this makes the calculus tidy later).</p>
     <p>A gap of 2 gives loss $\\tfrac12(2)^2 = 2$. A gap of 4 gives loss $\\tfrac12(4)^2 = 8$. Twice the gap, four times the loss.</p>
     <p>Other tasks use other losses: <b>hinge loss</b> (for SVMs) and <b>cross-entropy loss</b> (for probabilities). Same idea, different formula.</p>`,
  example:
    `<p>True price is $y = \\$300$k. The model predicts $z = \\$280$k.</p>
     <ul class="steps">
       <li>Gap: $y - z = 300 - 280 = 20$.</li>
       <li>Square it: $20^2 = 400$.</li>
       <li>Halve it: $L = \\tfrac12 \\times 400 = 200$.</li>
       <li>If instead $z = \\$300$k (perfect), gap $= 0$, so $L = 0$.</li>
     </ul>`,
  application:
    `<p>Predicting delivery times, stock prices, or temperatures all use squared loss. Image classifiers use cross-entropy loss. Every model needs a loss so it knows what "wrong" means.</p>`,
  quiz: {
    q: `True value $y = 10$, prediction $z = 7$. What is the least-squared loss $\\tfrac12(y-z)^2$?`,
    a: `<p>Gap $= 10 - 7 = 3$. Squared $= 9$. Halved $= \\tfrac12 \\times 9 = 4.5$. So $L = 4.5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-cost",
  demo: function (host) {
    var X = [1, 2, 3], Y = [2, 4, 6];   // best fit at θ = 2
    function J(theta) {
      var s = 0;
      for (var i = 0; i < X.length; i++) { var e = theta * X[i] - Y[i]; s += 0.5 * e * e; }
      return s / X.length;
    }
    Demos.plot(host, {
      xmin: -1, xmax: 5, ymin: 0,
      curves: [{ f: function (t) { return J(t); }, label: "cost J(θ)" }],
      drag: { curve: 0, start: 4, label: "θ",
        readout: function (t, y) { return "J(θ) is a bowl (parabola). At θ = " + t.toFixed(2) + ", cost J = <b>" + y.toFixed(3) + "</b>. The lowest point is the best θ; here data (1,2),(2,4),(3,6) bottoms out at θ = 2 with J = 0. Drag θ to roll down into the valley."; } }
    });
  },
  title: "Cost function",
  tagline: "Add up the loss over every example. That total is what we shrink.",
  prereqs: ["ml-loss"],
  bigIdea:
    `<p>Loss scores one example. <b>Cost</b> scores the whole dataset.</p>
     <p>Just add the loss of every example together.</p>
     <p>The cost depends on the model's numbers $\\theta$. Better $\\theta$ = lower cost.</p>
     <p>Training the model means finding the $\\theta$ that makes the cost smallest.</p>`,
  buildup:
    `<p>You already know how to score one prediction with a loss.</p>
     <p>You have $m$ examples. Score each one. Then sum all the scores.</p>
     <p>That single grand total is the cost $J(\\theta)$.</p>`,
  symbols: [
    { sym: "$J(\\theta)$", desc: "the cost: total error of the model over all examples. The $J$ is just its name." },
    { sym: "$\\theta$", desc: "the model's tunable numbers (the parameters). Changing them changes the cost." },
    { sym: "$\\sum_{i=1}^{m}$", desc: "add up over examples $i$ from 1 to $m$." },
    { sym: "$L(h_\\theta(x^{(i)}), y^{(i)})$", desc: "the loss on example $i$: how wrong the prediction $h_\\theta(x^{(i)})$ is versus the truth $y^{(i)}$." }
  ],
  formula: `$$ J(\\theta) = \\sum_{i=1}^{m} L\\big(h_\\theta(x^{(i)}),\\, y^{(i)}\\big) $$`,
  whatItDoes:
    `<p>Walk through every example. Compute its loss. Keep a running total.</p>
     <p>The result $J(\\theta)$ is one number summarizing how badly the model fits the entire dataset.</p>
     <p>Training is the search for the $\\theta$ that minimizes $J(\\theta)$.</p>`,
  example:
    `<p>Three houses, true prices $y = 300, 250, 400$ (k). Model A predicts $\\hat y = 280, 240, 400$.</p>
     <ul class="steps">
       <li>Per-example loss $\\tfrac12(y-\\hat y)^2$: $\\tfrac12(20)^2 = 200$, &nbsp; $\\tfrac12(10)^2 = 50$, &nbsp; $\\tfrac12(0)^2 = 0$.</li>
       <li>Cost: $J = 200 + 50 + 0 = \\mathbf{250}$. One number for the whole dataset.</li>
       <li>Now model B fixes example 1, predicting $290$: its loss drops to $\\tfrac12(10)^2 = 50$.</li>
       <li>New cost: $J = 50 + 50 + 0 = \\mathbf{150}$. Lowering one example's loss lowered the total $J$ — that is exactly what training searches for.</li>
     </ul>`,
  application:
    `<p>Every trained model has a cost it is trying to minimize. House-price models, recommendation systems, and language models all define a cost over their data, then push it down.</p>`,
  quiz: {
    q: `Two examples have losses $3$ and $5$. What is the cost $J(\\theta)$? If a better $\\theta$ cuts the second loss to $1$, what is the new cost?`,
    a: `<p>$J = 3 + 5 = 8$. After the improvement, $J = 3 + 1 = 4$. Lower cost means a better fit.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-gradient-descent",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    // J(a,b) = a^2 + 4 b^2 : an elliptical bowl, minimum at (0,0). gradient = (2a, 8b)
    var A = 4, B = 5; // curvature
    function J(a, b) { return A * a * a + B * b * b; }
    var lr = 0.1, start = { a: 4.0, b: 3.0 };
    var range = 5.5;
    // animated rolling ball: the path GROWS one step at a time via Step / Run, resets via Reset
    var ball = { a: start.a, b: start.b };
    var trail = [{ a: start.a, b: start.b }];
    var timer = null;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

    function PX(a) { return 30 + (a + range) / (2 * range) * (640 - 60); }
    function PY(b) { return 20 + (range - b) / (2 * range) * (340 - 40); }

    function gdStep() {
      var ga = 2 * A * ball.a, gb = 2 * B * ball.b;
      var na = ball.a - lr * ga, nb = ball.b - lr * gb;
      if (!isFinite(na) || !isFinite(nb)) { na = Math.max(-range * 2, Math.min(range * 2, na || 0)); nb = Math.max(-range * 2, Math.min(range * 2, nb || 0)); }
      na = Math.max(-range * 2, Math.min(range * 2, na));
      nb = Math.max(-range * 2, Math.min(range * 2, nb));
      ball.a = na; ball.b = nb; trail.push({ a: na, b: nb });
      if (trail.length > 200) trail.shift();
    }
    function resetBall() { if (timer) { clearInterval(timer); timer = null; bRun.textContent = "Run"; } ball = { a: start.a, b: start.b }; trail = [{ a: start.a, b: start.b }]; render(); }

    function render() {
      var col = C(); ctx.clearRect(0, 0, 640, 340);
      // contour rings: level sets J = c (ellipses)
      var levels = [0.5, 2, 5, 10, 20, 35, 55];
      ctx.lineWidth = 1;
      for (var li = 0; li < levels.length; li++) {
        var c = levels[li];
        ctx.strokeStyle = col.accent + "55"; ctx.beginPath();
        var first = true;
        for (var th = 0; th <= 64; th++) {
          var ang = th / 64 * Math.PI * 2;
          var a = Math.sqrt(c / A) * Math.cos(ang);
          var b = Math.sqrt(c / B) * Math.sin(ang);
          var X = PX(a), Y = PY(b);
          if (first) { ctx.moveTo(X, Y); first = false; } else ctx.lineTo(X, Y);
        }
        ctx.closePath(); ctx.stroke();
      }
      // minimum marker
      ctx.fillStyle = col.accent2; ctx.beginPath(); ctx.arc(PX(0), PY(0), 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("minimum", PX(0) + 10, PY(0) + 18);
      // descent trail so far (grows with Step / Run)
      ctx.strokeStyle = col.warn; ctx.lineWidth = 2; ctx.beginPath();
      for (var i = 0; i < trail.length; i++) { var X = PX(trail[i].a), Y = PY(trail[i].b); if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
      ctx.stroke();
      for (var k = 0; k < trail.length; k++) {
        var lastDot = (k === trail.length - 1);
        ctx.fillStyle = (k === 0) ? col.purple : (lastDot ? col.warn : col.warn + "99");
        ctx.beginPath(); ctx.arc(PX(trail[k].a), PY(trail[k].b), (k === 0 ? 5 : lastDot ? 6 : 3), 0, Math.PI * 2); ctx.fill();
      }
      // BEFORE label on the start, AFTER on the moving ball
      ctx.fillStyle = col.purple; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("start (before)", PX(start.a) + 8, PY(start.b) - 8);
      var diverged = Math.abs(ball.a) > range || Math.abs(ball.b) > range;
      var steps = trail.length - 1;
      var atMin = Math.abs(ball.a) < 0.05 && Math.abs(ball.b) < 0.05;
      var msg = "The purple dot is the start; the big orange ball is rolling downhill, opposite the gradient, toward the green minimum.";
      if (lr < 0.04) msg = "Learning rate is tiny: steps barely move, descent crawls. Safe but slow.";
      else if (diverged || lr > 0.18) msg = "Learning rate too big: steps overshoot and zig-zag OUTWARD — the ball diverges instead of settling.";
      else if (atMin) msg = "Arrived: the ball reached the green minimum. That is the converged answer (after).";
      else msg = "Good learning rate: the ball spirals smoothly into the minimum.";
      readout.innerHTML = "θ ← θ − α·∇J, with α = <b>" + lr.toFixed(3) + "</b>, step " + steps + ", J = <b>" + J(ball.a, ball.b).toFixed(3) + "</b>. " + msg +
        " Use <b>Step</b> / <b>Run</b> to roll downhill, <b>Reset</b> to return to the start.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var bStep = document.createElement("button"); var bRun = document.createElement("button"); var bReset = document.createElement("button");
    bStep.textContent = "Step ↓"; bRun.textContent = "Run"; bReset.textContent = "Reset";
    [bStep, bRun, bReset].forEach(function (b) { b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;margin:0 8px 0 0;cursor:pointer;font-size:13px"; });
    bStep.addEventListener("click", function () { gdStep(); render(); });
    bRun.addEventListener("click", function () {
      if (timer) { clearInterval(timer); timer = null; bRun.textContent = "Run"; return; }
      bRun.textContent = "Pause";
      timer = setInterval(function () {
        gdStep(); render();
        var done = (Math.abs(ball.a) < 0.02 && Math.abs(ball.b) < 0.02) || trail.length > 120;
        if (done) { clearInterval(timer); timer = null; bRun.textContent = "Run"; }
      }, 110);
    });
    bReset.addEventListener("click", resetBall);
    row.appendChild(bStep); row.appendChild(bRun); row.appendChild(bReset); host.appendChild(row);

    var slRow = document.createElement("div"); slRow.style.margin = "6px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "learning rate α ";
    var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = lr.toFixed(3); lab.appendChild(span);
    var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 0.01; inp.max = 0.26; inp.step = 0.005; inp.value = lr;
    inp.addEventListener("input", function () { lr = parseFloat(inp.value); span.textContent = lr.toFixed(3); resetBall(); });
    slRow.appendChild(lab); slRow.appendChild(inp); host.appendChild(slRow);
    render();
  },
  title: "Gradient descent",
  tagline: "Walk downhill on the cost. Each step, move opposite the slope.",
  prereqs: ["ml-cost", "fnd-gradient"],
  bigIdea:
    `<p>The cost $J(\\theta)$ is like a landscape of hills and valleys.</p>
     <p>We want the lowest point (smallest cost).</p>
     <p>The gradient points uphill. So step the <i>opposite</i> way to go down.</p>
     <p>Take small steps, again and again, until you reach the bottom.</p>`,
  buildup:
    `<p>From the gradient lesson: $\\nabla J(\\theta)$ points in the direction the cost grows fastest.</p>
     <p>To shrink the cost, move against it.</p>
     <p>How big a step? That is the <b>learning rate</b> $\\alpha$.</p>`,
  symbols: [
    { sym: "$\\theta$", desc: "the parameters we are adjusting." },
    { sym: "$\\leftarrow$", desc: "'becomes' — replace the old $\\theta$ with the new value on the right." },
    { sym: "$\\alpha$", desc: "the learning rate: how big each step is (Greek 'alpha'). Small = slow but safe. Big = fast but may overshoot." },
    { sym: "$\\nabla J(\\theta)$", desc: "the gradient of the cost: the uphill direction. The minus sign turns it downhill." }
  ],
  formula: `$$ \\theta \\;\\leftarrow\\; \\theta - \\alpha\\,\\nabla J(\\theta) $$`,
  whatItDoes:
    `<p>Compute the slope (gradient) at where you stand. Multiply it by the step size $\\alpha$. Subtract it from $\\theta$.</p>
     <p>That nudges $\\theta$ downhill a little. Repeat until the cost stops dropping.</p>
     <p><b>SGD</b> (stochastic gradient descent) uses just one example at a time to estimate the slope. Noisier, but much faster on huge datasets.</p>`,
  example:
    `<p>Suppose $J(\\theta) = \\theta^2$, so the slope is $\\nabla J = 2\\theta$. Start at $\\theta = 5$, learning rate $\\alpha = 0.1$.</p>
     <ul class="steps">
       <li>Slope at $\\theta = 5$: $2 \\times 5 = 10$.</li>
       <li>Step: $\\theta \\leftarrow 5 - 0.1 \\times 10 = 5 - 1 = 4$.</li>
       <li>Slope at $\\theta = 4$: $2 \\times 4 = 8$. Step: $4 - 0.1 \\times 8 = 3.2$.</li>
       <li>Next: $3.2 - 0.1 \\times 6.4 = 2.56$. We are sliding toward $\\theta = 0$, the bottom.</li>
     </ul>`,
  application:
    `<p>Gradient descent trains almost everything: linear regression, logistic regression, and every deep neural network. SGD is how giant models learn from billions of examples without choking.</p>`,
  quiz: {
    q: `With $J(\\theta)=\\theta^2$ (slope $2\\theta$), start at $\\theta = 3$ with $\\alpha = 0.5$. What is $\\theta$ after one step?`,
    a: `<p>Slope $= 2 \\times 3 = 6$. Step: $\\theta = 3 - 0.5 \\times 6 = 3 - 3 = 0$. One big step landed right at the minimum.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-linear-regression",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var P = [{ x: 1, y: 2.2 }, { x: 2, y: 3.8 }, { x: 3, y: 6.1 }, { x: 4, y: 7.9 }, { x: 5, y: 9.8 }];
    var X = P.map(function (p) { return p.x; }), Y = P.map(function (p) { return p.y; });

    // closed-form target line: simple-statistics if present, else least squares by hand
    var target;
    if (window.ss && window.ss.linearRegression) {
      var lr = window.ss.linearRegression(P.map(function (p) { return [p.x, p.y]; }));
      target = { m: lr.m, b: lr.b };
    } else {
      var n = X.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
      for (var i = 0; i < n; i++) { sx += X[i]; sy += Y[i]; sxx += X[i] * X[i]; sxy += X[i] * Y[i]; }
      var denom = n * sxx - sx * sx;
      var m = Math.abs(denom) < 1e-9 ? 0 : (n * sxy - sx * sy) / denom;
      target = { m: m, b: (sy - m * sx) / n };
    }

    var lrRate = 0.012;            // gradient-descent step size
    var slope = -1, intercept = 8; // deliberately bad START line (BEFORE)
    var epoch = 0, timer = null;

    function mse(mm, bb) { var s = 0; for (var i = 0; i < X.length; i++) { var e = (mm * X[i] + bb) - Y[i]; s += e * e; } return s / X.length; }
    // one gradient-descent step on MSE. tf.js if present (real autograd), plain JS otherwise.
    function stepGD() {
      if (window.tf) {
        try {
          var res = window.tf.tidy(function () {
            var xs = window.tf.tensor1d(X), ys = window.tf.tensor1d(Y);
            var mT = window.tf.scalar(slope), bT = window.tf.scalar(intercept);
            var grads = window.tf.grads(function (mm, bb) {
              var pred = xs.mul(mm).add(bb);
              return pred.sub(ys).square().mean();
            })([mT, bT]);
            return [grads[0].dataSync()[0], grads[1].dataSync()[0]];
          });
          slope -= lrRate * res[0]; intercept -= lrRate * res[1];
          epoch++; return;
        } catch (e) { /* fall through */ }
      }
      // plain-JS gradient of MSE: dL/dm = 2/n Σ(pred−y)x, dL/db = 2/n Σ(pred−y)
      var n = X.length, gm = 0, gb = 0;
      for (var i = 0; i < n; i++) { var err = (slope * X[i] + intercept) - Y[i]; gm += err * X[i]; gb += err; }
      gm = 2 * gm / n; gb = 2 * gb / n;
      slope -= lrRate * gm; intercept -= lrRate * gb; epoch++;
    }
    function reset() { if (timer) { clearInterval(timer); timer = null; bTrain.textContent = "Train (gradient descent)"; } slope = -1; intercept = 8; epoch = 0; render(); }

    var cv = document.createElement("canvas"); cv.width = 480; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var pad = 36, W = 480, H = 340, lo = 0, hi = 11;
    function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
    function PY(y) { return (H - pad) - (y - lo) / (hi - lo) * (H - 2 * pad); }

    function line(mm, bb, color, dash) {
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(PX(0), PY(bb)); ctx.lineTo(PX(11), PY(mm * 11 + bb)); ctx.stroke(); ctx.setLineDash([]);
    }
    function render() {
      var col = C(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
      // closed-form best fit (faint green dashed target)
      line(target.m, target.b, col.accent2, [5, 4]);
      // residuals from the current descent line
      P.forEach(function (p) {
        var pred = slope * p.x + intercept;
        ctx.strokeStyle = col.dim + "88"; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
        ctx.beginPath(); ctx.moveTo(PX(p.x), PY(p.y)); ctx.lineTo(PX(p.x), PY(pred)); ctx.stroke(); ctx.setLineDash([]);
      });
      // current descent line (orange)
      line(slope, intercept, col.warn, []);
      // data points
      P.forEach(function (p) { ctx.fillStyle = col.accent; ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 5, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = col.accent2; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("closed-form best fit", PX(0) + 6, PY(target.b) - 6);
      var lib = window.tf ? "tf.js autograd" : "plain-JS gradient";
      var src = (window.ss && window.ss.linearRegression) ? "simple-statistics" : "least-squares formula";
      readout.innerHTML = "Orange line ŷ = " + slope.toFixed(2) + "·x + " + intercept.toFixed(2) + ", MSE = <b>" + mse(slope, intercept).toFixed(3) +
        "</b> (epoch " + epoch + ", " + lib + "). Green dashed = closed-form optimum from " + src + " (m = " + target.m.toFixed(2) + ", b = " + target.b.toFixed(2) +
        ", MSE = " + mse(target.m, target.b).toFixed(3) + ").<br><b>Train</b> rolls the bad start line down to the green target; <b>Reset</b> restores the bad line.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var bTrain = document.createElement("button"), bStep = document.createElement("button"), bReset = document.createElement("button");
    bTrain.textContent = "Train (gradient descent)"; bStep.textContent = "Step ×20"; bReset.textContent = "Reset";
    [bTrain, bStep, bReset].forEach(function (b) { b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;margin:0 8px 0 0;cursor:pointer;font-size:13px"; });
    bTrain.addEventListener("click", function () {
      if (timer) { clearInterval(timer); timer = null; bTrain.textContent = "Train (gradient descent)"; return; }
      bTrain.textContent = "Pause";
      timer = setInterval(function () {
        for (var k = 0; k < 4; k++) stepGD();
        render();
        if (epoch > 4000 || mse(slope, intercept) - mse(target.m, target.b) < 1e-4) { clearInterval(timer); timer = null; bTrain.textContent = "Train (gradient descent)"; }
      }, 60);
    });
    bStep.addEventListener("click", function () { for (var k = 0; k < 20; k++) stepGD(); render(); });
    bReset.addEventListener("click", reset);
    row.appendChild(bTrain); row.appendChild(bStep); row.appendChild(bReset); host.appendChild(row);
    render();
  },
  title: "Linear regression",
  tagline: "Fit a straight line through your data. The simplest predictor.",
  prereqs: ["ml-gradient-descent", "fnd-matvec", "fnd-dot"],
  bigIdea:
    `<p><b>Linear regression</b> predicts a number with a straight line (or flat plane in many dimensions).</p>
     <p>The prediction is a dot product of weights and features.</p>
     <p>You can find the best line by gradient descent — or solve it in one shot with a formula.</p>
     <p>That one-shot formula is called the <b>normal equations</b>.</p>`,
  buildup:
    `<p>Each feature gets a weight. Multiply each feature by its weight and add them up. That is the prediction.</p>
     <p>Stack all examples into a matrix $X$. Then all predictions are $X\\theta$ at once.</p>
     <p>The weights $\\theta$ that minimize squared error have an exact closed-form solution.</p>`,
  symbols: [
    { sym: "$h_\\theta(x) = \\theta^\\top x$", desc: "the prediction: dot product of weights $\\theta$ and features $x$." },
    { sym: "$X$", desc: "the data matrix: one row per example, one column per feature." },
    { sym: "$y$", desc: "the column of true answers, one per example." },
    { sym: "$X^\\top$", desc: "$X$ with rows and columns swapped (the transpose)." },
    { sym: "$(X^\\top X)^{-1}$", desc: "the inverse of $X^\\top X$ — the matrix version of 'divide by'." }
  ],
  formula: `$$ h_\\theta(x) = \\theta^\\top x \\qquad\\qquad \\theta = (X^\\top X)^{-1} X^\\top y $$`,
  whatItDoes:
    `<p>The left part says: prediction = weights dotted with features.</p>
     <p>The right part gives the exact best weights in one calculation. No looping needed.</p>
     <p>It works because squared-error cost is a smooth bowl with one bottom, and this formula jumps straight to it.</p>`,
  example:
    `<p>One feature. Data: $(x,y) = (1,2), (2,4), (3,6)$. The perfect line is $y = 2x$, so $\\theta = 2$.</p>
     <ul class="steps">
       <li>Here $X = \\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}$ and $y = \\begin{bmatrix}2\\\\4\\\\6\\end{bmatrix}$.</li>
       <li>$X^\\top X = 1{\\cdot}1 + 2{\\cdot}2 + 3{\\cdot}3 = 14$.</li>
       <li>$X^\\top y = 1{\\cdot}2 + 2{\\cdot}4 + 3{\\cdot}6 = 28$.</li>
       <li>$\\theta = (14)^{-1} \\times 28 = 28 / 14 = 2$. The formula found the line exactly.</li>
       <li>Predict for $x = 5$: $h_\\theta(5) = 2 \\times 5 = 10$.</li>
     </ul>`,
  application:
    `<p>Predicting house prices from size, sales from ad spend, or crop yield from rainfall. Linear regression is the first model to try, and the baseline everything else is compared against.</p>`,
  quiz: {
    q: `Using $\\theta = (X^\\top X)^{-1}X^\\top y$ with $X^\\top X = 10$ and $X^\\top y = 30$, what is $\\theta$?`,
    a: `<p>$\\theta = 30 / 10 = 3$. The best-fit slope is 3.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-likelihood",
  demo: function (host) {
    Demos.plot(host, {
      xmin: 0.001, xmax: 0.999, ymin: 0,
      controls: [
        { key: "h", label: "heads h", min: 0, max: 10, val: 7, step: 1 },
        { key: "n", label: "flips n", min: 1, max: 10, val: 10, step: 1 }
      ],
      curves: [{ f: function (t, s) { var n = Math.max(s.n, s.h); return Math.pow(t, s.h) * Math.pow(1 - t, n - s.h); }, label: "L(θ) = θ^h (1−θ)^(n−h)" }],
      drag: { curve: 0, start: 0.7, label: "θ (heads probability)",
        readout: function (t, y, s) { var n = Math.max(s.n, s.h); return "L(" + t.toFixed(2) + ") = " + y.toExponential(3) + ". With h = " + s.h + " heads in n = " + n + " flips, the maximum is at θ = h/n = <b>" + (n > 0 ? (s.h / n).toFixed(3) : "0") + "</b>."; } }
    });
  },
  title: "Likelihood & maximum likelihood",
  tagline: "Pick the parameters that make your data look most probable.",
  prereqs: ["ml-cost", "prob-bayes"],
  bigIdea:
    `<p>The <b>likelihood</b> asks: given some parameters, how probable is the data we actually saw?</p>
     <p>Different parameters make the data more or less likely.</p>
     <p><b>Maximum likelihood</b> picks the parameters that make the data the most probable.</p>
     <p>It is a principled way to choose a model: trust the settings that best explain what happened.</p>`,
  buildup:
    `<p>Probabilities of independent events multiply. So the likelihood of all the data is a big product.</p>
     <p>Products of many small numbers are awkward. So we take the logarithm, which turns products into sums.</p>
     <p>The log is increasing, so whatever maximizes the likelihood also maximizes the log-likelihood.</p>`,
  symbols: [
    { sym: "$L(\\theta)$", desc: "the likelihood: the probability of the data, viewed as a function of the parameters $\\theta$." },
    { sym: "$\\arg\\max_\\theta$", desc: "'the $\\theta$ that makes the following biggest' (not the biggest value itself, but the $\\theta$ that gives it)." },
    { sym: "$\\theta^{opt}$", desc: "the best (optimal) parameters: the maximum-likelihood choice." },
    { sym: "$\\log$", desc: "the logarithm. It turns a product into a sum and never changes which $\\theta$ is best." }
  ],
  formula: `$$ \\theta^{opt} = \\arg\\max_\\theta\\, L(\\theta) = \\arg\\max_\\theta\\, \\log L(\\theta) $$`,
  whatItDoes:
    `<p>Write the probability of the whole dataset as a function of $\\theta$. That is $L(\\theta)$.</p>
     <p>Take its logarithm to make the math easy (sums, not products).</p>
     <p>Find the $\\theta$ that makes it as large as possible. That $\\theta$ is your model.</p>`,
  example:
    `<p>You flip a coin 10 times and get 7 heads. What heads-probability $\\theta$ best explains this?</p>
     <ul class="steps">
       <li>Likelihood of 7 heads in 10 flips: $L(\\theta) = \\theta^7 (1-\\theta)^3$ (times a constant).</li>
       <li>Try $\\theta = 0.5$: $0.5^7 \\times 0.5^3 = 0.5^{10} \\approx 0.00098$.</li>
       <li>Try $\\theta = 0.7$: $0.7^7 \\times 0.3^3 \\approx 0.0823 \\times 0.027 \\approx 0.00222$.</li>
       <li>$\\theta = 0.7$ gives higher likelihood. In fact the maximum is exactly $\\theta = 7/10 = 0.7$.</li>
     </ul>`,
  application:
    `<p>Maximum likelihood underlies logistic regression, naive Bayes, and the training of language models. It is the standard recipe: define the data's probability, then maximize it.</p>`,
  quiz: {
    q: `You see 3 heads in 4 flips. By maximum likelihood, what is the best estimate of the heads-probability $\\theta$?`,
    a: `<p>$\\theta = 3/4 = 0.75$. The maximum-likelihood estimate for a coin is simply the fraction of heads observed.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-logistic-regression",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    function sig(z) { return 1 / (1 + Math.exp(-z)); }
    // 1-D labeled data: label 0 mostly on the left, label 1 mostly on the right
    var data = [
      { x: -4.5, y: 0 }, { x: -3.6, y: 0 }, { x: -3.0, y: 0 }, { x: -2.2, y: 0 }, { x: -1.6, y: 0 }, { x: -0.8, y: 1 },
      { x: 0.4, y: 0 }, { x: 0.9, y: 1 }, { x: 1.7, y: 1 }, { x: 2.4, y: 1 }, { x: 3.1, y: 1 }, { x: 4.2, y: 1 }
    ];
    var thresh = 0.5; // decision probability threshold; maps to z = logit(p)
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var xmin = -6, xmax = 6, padL = 40, padR = 20, padT = 18, padB = 32, W = 640, H = 320;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(p) { return (H - padB) - p * (H - padT - padB); }

    function render() {
      var col = C(); ctx.clearRect(0, 0, W, H);
      // axes + gridlines at 0 and 1
      ctx.strokeStyle = col.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, PY(0)); ctx.lineTo(W - padR, PY(0)); ctx.moveTo(padL, PY(1)); ctx.lineTo(W - padR, PY(1)); ctx.moveTo(PX(0), PY(0)); ctx.lineTo(PX(0), PY(1)); ctx.stroke();
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("p=1", padL - 6, PY(1) + 4); ctx.fillText("p=0", padL - 6, PY(0) + 4);
      // sigmoid curve
      ctx.strokeStyle = col.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      var first = true;
      for (var i = 0; i <= 240; i++) { var x = xmin + (xmax - xmin) * i / 240; var p = sig(x); if (first) { ctx.moveTo(PX(x), PY(p)); first = false; } else ctx.lineTo(PX(x), PY(p)); }
      ctx.stroke();
      // decision threshold: p = thresh -> z* where sigmoid crosses
      var zStar = Math.log(thresh / (1 - thresh));
      ctx.strokeStyle = col.warn; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(padL, PY(thresh)); ctx.lineTo(W - padR, PY(thresh)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PX(zStar), PY(0)); ctx.lineTo(PX(zStar), PY(1)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = col.warn;
      ctx.textAlign = "left"; ctx.fillText("← decide 0", padL + 6, padT + 10);
      ctx.textAlign = "right"; ctx.fillText("decide 1 →", W - padR - 6, padT + 10);
      // data points at p=0 / p=1 rows (jittered slightly off the line for visibility)
      var correct = 0;
      for (var k = 0; k < data.length; k++) {
        var d = data[k]; var py = d.y === 1 ? PY(0.97) : PY(0.03);
        var pred = (d.x >= zStar) ? 1 : 0;
        var ok = pred === d.y; if (ok) correct++;
        ctx.fillStyle = d.y === 1 ? col.accent2 : col.accent;
        ctx.beginPath(); ctx.arc(PX(d.x), py, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = ok ? col.panel : col.warn; ctx.lineWidth = ok ? 1.5 : 2.5; ctx.stroke();
      }
      ctx.fillStyle = col.dim; ctx.textAlign = "center"; ctx.fillText("score z = θᵀx", W / 2, H - 8);
      readout.innerHTML = "The blue curve squashes the score z into a probability σ(z). Threshold = <b>p = " + thresh.toFixed(2) + "</b> draws the vertical decision line at z = " + zStar.toFixed(2) + ": right of it predict 1, left predict 0. Bottom row = true 0s (blue), top row = true 1s (green); orange rings mark misclassified points. Correct here: <b>" + correct + "/" + data.length + "</b>. Drag the dashed line to move the threshold.";
    }
    function setFromY(clientY) {
      var r = cv.getBoundingClientRect(); var scale = cv.height / r.height;
      var y = (clientY - r.top) * scale;
      var p = (PYinv(y));
      thresh = Math.max(0.05, Math.min(0.95, p)); render();
    }
    function PYinv(y) { return ((H - padB) - y) / (H - padT - padB); }
    var dragging = false;
    cv.addEventListener("mousedown", function () { dragging = true; });
    window.addEventListener("mousemove", function (e) { if (dragging) setFromY(e.clientY); });
    window.addEventListener("mouseup", function () { dragging = false; });
    cv.addEventListener("touchstart", function (e) { dragging = true; if (e.touches[0]) setFromY(e.touches[0].clientY); });
    cv.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) { setFromY(e.touches[0].clientY); e.preventDefault(); } });
    render();
  },
  title: "Logistic regression",
  tagline: "Squash a score into a probability between 0 and 1. Classify by it.",
  prereqs: ["ml-linear-regression", "ml-likelihood"],
  bigIdea:
    `<p>For yes/no questions, we want a probability, not just any number.</p>
     <p>Linear regression can output anything, even $-50$ or $1000$. That is no good for a probability.</p>
     <p>The <b>sigmoid</b> function squashes any number into the range $(0, 1)$.</p>
     <p>Feed the dot-product score through the sigmoid, and you get $P(y=1 \\mid x)$ — the chance the answer is "yes".</p>`,
  buildup:
    `<p>Start with the same linear score $z = \\theta^\\top x$.</p>
     <p>Pass it through the sigmoid $g(z)$. Big positive $z$ gives near 1. Big negative $z$ gives near 0. Zero gives exactly $0.5$.</p>
     <p>Then decide: probability above $0.5$ means predict "yes".</p>`,
  symbols: [
    { sym: "$g(z)$", desc: "the sigmoid (logistic) function: squashes any real number $z$ into $(0,1)$." },
    { sym: "$e$", desc: "Euler's number, about $2.718$. $e^{-z}$ shrinks fast as $z$ grows." },
    { sym: "$z = \\theta^\\top x$", desc: "the linear score: weights dotted with features." },
    { sym: "$P(y=1 \\mid x)$", desc: "the probability that the label is 1 ('yes'), given the input $x$." }
  ],
  formula: `$$ g(z) = \\frac{1}{1 + e^{-z}} \\qquad\\qquad P(y=1 \\mid x) = g(\\theta^\\top x) $$`,
  whatItDoes:
    `<p>Compute the score $z$. Plug it into the sigmoid. Out comes a probability.</p>
     <p>When $z = 0$, $g(0) = \\tfrac{1}{1+1} = 0.5$. When $z$ is large positive, $e^{-z} \\to 0$ so $g \\to 1$. When $z$ is large negative, $g \\to 0$.</p>
     <p>We train $\\theta$ by maximum likelihood (which gives cross-entropy loss).</p>`,
  example:
    `<p>A model has score $z = \\theta^\\top x = 2$ for some email. Is it spam ($y=1$)?</p>
     <ul class="steps">
       <li>Compute $e^{-z} = e^{-2} \\approx 0.135$.</li>
       <li>Sigmoid: $g(2) = \\dfrac{1}{1 + 0.135} = \\dfrac{1}{1.135} \\approx 0.88$.</li>
       <li>So $P(\\text{spam}) \\approx 0.88$. That is above $0.5$, so predict spam.</li>
       <li>If instead $z = -2$, then $g(-2) \\approx 0.12$, so predict not-spam.</li>
     </ul>`,
  application:
    `<p>Spam detection, click-through prediction, disease risk scoring, and credit default — all are yes/no problems solved with logistic regression. It is the workhorse classifier of industry.</p>`,
  quiz: {
    q: `What is the sigmoid output $g(z)$ when $z = 0$? What does it mean?`,
    a: `<p>$g(0) = \\dfrac{1}{1 + e^{0}} = \\dfrac{1}{1 + 1} = 0.5$. The model is perfectly unsure: a 50/50 chance for each class.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-softmax",
  demo: function (host) {
    Demos.calc(host, {
      bars: true,
      inputs: [
        { key: "z1", label: "score z₁", min: -5, max: 5, val: 2, step: 0.1 },
        { key: "z2", label: "score z₂", min: -5, max: 5, val: 1, step: 0.1 },
        { key: "z3", label: "score z₃", min: -5, max: 5, val: 0, step: 0.1 }
      ],
      compute: function (s) {
        var e1 = Math.exp(s.z1), e2 = Math.exp(s.z2), e3 = Math.exp(s.z3);
        var sum = e1 + e2 + e3;
        var p1 = e1 / sum, p2 = e2 / sum, p3 = e3 / sum;
        return {
          text: "Softmax pᵢ = e^zᵢ / Σ e^zⱼ. p₁ = <b>" + p1.toFixed(3) + "</b>, p₂ = <b>" + p2.toFixed(3) + "</b>, p₃ = <b>" + p3.toFixed(3) + "</b>. Sum = " + (p1 + p2 + p3).toFixed(3) + " (always 1).",
          bars: [{ label: "p₁", val: p1 }, { label: "p₂", val: p2 }, { label: "p₃", val: p3 }],
          max: 1
        };
      }
    });
  },
  title: "Softmax (multiclass)",
  tagline: "Turn many scores into probabilities that add up to 1.",
  prereqs: ["ml-logistic-regression"],
  bigIdea:
    `<p>Sigmoid handles two classes. <b>Softmax</b> handles many classes.</p>
     <p>Each class gets its own score. Softmax turns the scores into probabilities.</p>
     <p>The probabilities are all positive and add up to exactly 1.</p>
     <p>The class with the biggest probability is the prediction.</p>`,
  buildup:
    `<p>You have $K$ classes (say cat, dog, bird). Each gets a linear score $\\theta_i^\\top x$.</p>
     <p>To make scores positive, raise $e$ to each one (exponentiate). $\\exp$ is always positive.</p>
     <p>To make them sum to 1, divide each by the total. That sharing is the softmax.</p>`,
  symbols: [
    { sym: "$K$", desc: "the number of classes." },
    { sym: "$\\theta_i^\\top x$", desc: "the linear score for class $i$ (its own weights dotted with the features)." },
    { sym: "$\\exp(s)$", desc: "$e$ to the power $s$, i.e. $e^s$. Always positive; turns any score into a positive number." },
    { sym: "$\\phi_i$", desc: "the output probability for class $i$ (Greek 'phi'). All the $\\phi_i$ add up to 1." }
  ],
  formula: `$$ \\phi_i = \\frac{\\exp(\\theta_i^\\top x)}{\\sum_{j=1}^{K} \\exp(\\theta_j^\\top x)} $$`,
  whatItDoes:
    `<p>Exponentiate each class score to make it positive. Add all of them up to get the total. Divide each by the total.</p>
     <p>The bottom (the sum) is the same for every class, so the outputs share one pie that adds to 1.</p>`,
  example:
    `<p>Three classes with scores $\\theta_1^\\top x = 2$, $\\theta_2^\\top x = 1$, $\\theta_3^\\top x = 0$.</p>
     <ul class="steps">
       <li>Exponentiate: $e^2 \\approx 7.39$, $e^1 \\approx 2.72$, $e^0 = 1$.</li>
       <li>Sum: $7.39 + 2.72 + 1 = 11.11$.</li>
       <li>$\\phi_1 = 7.39 / 11.11 \\approx 0.67$.</li>
       <li>$\\phi_2 = 2.72 / 11.11 \\approx 0.24$. &nbsp; $\\phi_3 = 1 / 11.11 \\approx 0.09$.</li>
       <li>Check: $0.67 + 0.24 + 0.09 = 1.00$. Class 1 wins.</li>
     </ul>`,
  application:
    `<p>Softmax is the final layer of almost every image classifier and language model. Recognizing handwritten digits (10 classes) or the next word (tens of thousands of classes) both end in a softmax.</p>`,
  quiz: {
    q: `Two classes have scores $0$ and $0$. After softmax, what are the two probabilities?`,
    a: `<p>$e^0 = 1$ for both. Sum $= 2$. Each $= 1/2 = 0.5$. Equal scores give equal probabilities.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-glm",
  demo: function (host) {
    Demos.plot(host, {
      xmin: -4, xmax: 4, ymin: 0,
      controls: [{ key: "fam", label: "family: 0 = Bernoulli σ(η), 1 = Poisson e^η", min: 0, max: 1, val: 0, step: 1 }],
      curves: [{
        f: function (eta, s) { return s.fam < 0.5 ? 1 / (1 + Math.exp(-eta)) : Math.exp(eta); },
        label: "mean as function of η"
      }],
      drag: { curve: 0, start: 1, label: "natural parameter η = θᵀx",
        readout: function (eta, mean, s) {
          var name = s.fam < 0.5 ? "Bernoulli: mean = σ(η) = 1/(1+e^−η)" : "Poisson: mean = e^η";
          return name + ". At η = " + eta.toFixed(2) + ", mean = <b>" + mean.toFixed(3) + "</b>. " + (s.fam < 0.5 ? "Bounded in (0,1) → logistic regression." : "Always positive, grows fast → Poisson regression. Slide the family toggle to swap the link.");
        } }
    });
  },
  title: "Generalized linear models",
  tagline: "One framework that unifies linear and logistic regression.",
  prereqs: ["ml-linear-regression", "ml-logistic-regression"],
  bigIdea:
    `<p>Linear and logistic regression feel different. But they share one recipe.</p>
     <p>Both compute a linear score, then connect it to a probability distribution.</p>
     <p>That shared recipe is the <b>generalized linear model</b> (GLM).</p>
     <p>The distributions it uses all belong to one family, called the <b>exponential family</b>.</p>`,
  buildup:
    `<p>Pick a distribution for your output: normal for numbers, Bernoulli (coin flip) for yes/no, Poisson for counts.</p>
     <p>Each of these can be written in one common shape.</p>
     <p>That shape uses a single parameter $\\eta$ ('eta'), which we set to the linear score $\\theta^\\top x$.</p>`,
  symbols: [
    { sym: "$p(y; \\eta)$", desc: "the probability of output $y$, controlled by the natural parameter $\\eta$." },
    { sym: "$\\eta$", desc: "the natural parameter ('eta'). In a GLM we set $\\eta = \\theta^\\top x$, the linear score." },
    { sym: "$T(y)$", desc: "the sufficient statistic: a simple function of $y$ (often just $y$ itself)." },
    { sym: "$b(y)$", desc: "the base measure: a part that depends only on $y$." },
    { sym: "$a(\\eta)$", desc: "the log-partition: a normalizer that makes the probabilities add up to 1." },
    { sym: "$\\phi$", desc: "for a Bernoulli (yes/no) output, the success probability — used in the example ('phi')." }
  ],
  formula: `$$ p(y;\\eta) = b(y)\\,\\exp\\big(\\eta\\,T(y) - a(\\eta)\\big) $$`,
  whatItDoes:
    `<p>This one template covers many distributions. Choosing $b$, $T$, and $a$ picks which one.</p>
     <p>Plug in the normal distribution, and the GLM becomes linear regression. Plug in the Bernoulli, and it becomes logistic regression.</p>
     <p>So you do not memorize two methods. You learn one idea and swap the distribution.</p>`,
  example:
    `<p>Take the Bernoulli (a yes/no coin) with success probability $\\phi$. It hides inside the template.</p>
     <ul class="steps">
       <li>Bernoulli: $p(y;\\phi) = \\phi^y (1-\\phi)^{1-y}$.</li>
       <li>Rewrite it as $\\exp\\!\\big(y \\log\\tfrac{\\phi}{1-\\phi} + \\log(1-\\phi)\\big)$.</li>
       <li>Match the template: $\\eta = \\log\\tfrac{\\phi}{1-\\phi}$. Solving back gives $\\phi = \\dfrac{1}{1+e^{-\\eta}}$.</li>
       <li>That is the sigmoid. So logistic regression falls out of the GLM automatically.</li>
       <li>Check with numbers: if the linear score is $\\eta = \\theta^\\top x = 2$, then $\\phi = \\dfrac{1}{1+e^{-2}} = \\dfrac{1}{1.135} \\approx \\mathbf{0.88}$ — a probability, exactly logistic regression's output.</li>
       <li>Swap Bernoulli for Poisson and the mean becomes $e^{\\eta} = e^{2} \\approx \\mathbf{7.39}$ (a count) — same template, different distribution.</li>
     </ul>`,
  application:
    `<p>GLMs let one library fit many models: counts of website visits (Poisson regression), yes/no churn (logistic), or dollar amounts (linear). Statisticians and data scientists use this single framework daily.</p>`,
  quiz: {
    q: `Which distribution, used in a GLM, gives ordinary linear regression? Which gives logistic regression?`,
    a: `<p>The normal (Gaussian) distribution gives linear regression. The Bernoulli (yes/no) distribution gives logistic regression.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-svm",
  demo: function (host) {
    var P = [
      { x: 1, y: 1.5, c: 0 }, { x: 1.6, y: 0.9, c: 0 }, { x: 1.1, y: 2.4, c: 0 }, { x: 2.2, y: 1.2, c: 0 },
      { x: 5, y: 5.2, c: 1 }, { x: 5.8, y: 4.6, c: 1 }, { x: 4.6, y: 5.8, c: 1 }, { x: 6.0, y: 5.0, c: 1 }
    ];
    Demos.scatter(host, { points: P, init: function (api) {
      var w1 = 1, w2 = 1, b = 6;   // boundary w·x = b
      function render() {
        var norm = Math.sqrt(w1 * w1 + w2 * w2);
        api.draw(function (ctx, col, px, py) {
          // draw line w1*x + w2*y = c  =>  y = (c - w1*x)/w2, sampled across x in [-2, 9]
          function lineAt(c, style, dash) {
            if (Math.abs(w2) < 1e-6) return;
            ctx.strokeStyle = style; ctx.lineWidth = 2; ctx.setLineDash(dash || []);
            ctx.beginPath();
            ctx.moveTo(px(-2), py((c - w1 * (-2)) / w2));
            ctx.lineTo(px(9), py((c - w1 * 9) / w2));
            ctx.stroke(); ctx.setLineDash([]);
          }
          lineAt(b + 1, col.dim, [5, 4]);   // margin +1
          lineAt(b - 1, col.dim, [5, 4]);   // margin -1
          lineAt(b, col.warn, []);          // boundary
        });
        var width = 2 / norm;
        api.readout.innerHTML = "Boundary w·x = b (orange), margins w·x = b ± 1 (dashed). w = (" + w1.toFixed(2) + ", " + w2.toFixed(2) + "), ‖w‖ = " + norm.toFixed(3) + ". Margin width = 2/‖w‖ = <b>" + width.toFixed(3) + "</b>. Smaller ‖w‖ ⇒ wider street. Tune w and b to separate the two classes with the widest gap.";
      }
      api.slider("w₁", -3, 3, w1, 0.05, function (v) { w1 = v; render(); });
      api.slider("w₂", 0.2, 3, w2, 0.05, function (v) { w2 = v; render(); });
      api.slider("bias b", -2, 12, b, 0.1, function (v) { b = v; render(); });
      render();
    } });
  },
  title: "Support vector machines",
  tagline: "Find the widest possible street separating two classes.",
  prereqs: ["ml-logistic-regression", "fnd-norm"],
  bigIdea:
    `<p>A <b>support vector machine</b> (SVM) separates two classes with a line (or plane).</p>
     <p>Many lines can separate the data. The SVM picks the one with the biggest gap on both sides.</p>
     <p>That gap is the <b>margin</b>. Think of the widest street between the two groups.</p>
     <p>A wide margin tends to generalize well to new points.</p>`,
  buildup:
    `<p>A separating line is $w^\\top x - b = 0$. Points on one side are class $+1$, the other side class $-1$.</p>
     <p>The width of the street is $2 / \\lVert w \\rVert$. To widen it, make $\\lVert w \\rVert$ small.</p>
     <p>But every point must still stay on its correct side, beyond the margin. That is the constraint.</p>`,
  symbols: [
    { sym: "$w$", desc: "the weight vector: it sets the direction of the separating line." },
    { sym: "$b$", desc: "the bias: it shifts the line away from the origin." },
    { sym: "$h(x) = \\text{sign}(w^\\top x - b)$", desc: "the prediction: $+1$ if the score is positive, $-1$ if negative." },
    { sym: "$\\lVert w \\rVert^2$", desc: "the squared length of $w$. Smaller length means a wider margin." },
    { sym: "$y^{(i)}$", desc: "the true class of example $i$, either $+1$ or $-1$." }
  ],
  formula: `$$ \\min_{w,b}\\ \\tfrac{1}{2}\\lVert w\\rVert^2 \\quad\\text{s.t.}\\quad y^{(i)}\\,(w^\\top x^{(i)} - b) \\ge 1 \\quad\\text{for all } i $$`,
  whatItDoes:
    `<p>"$\\min \\tfrac12\\lVert w\\rVert^2$" means make the weights small, which makes the street wide.</p>
     <p>"s.t." means "subject to" — the rule that must hold. Each point must be on its correct side, at least one margin-width away.</p>
     <p>The few points sitting right on the margin edge are the <b>support vectors</b>. They alone define the line. When points overlap, the <b>hinge loss</b> allows soft violations.</p>`,
  example:
    `<p>1D toy: class $-1$ at $x = 1$, class $+1$ at $x = 3$. The boundary is $w\\,x - b = 0$.</p>
     <ul class="steps">
       <li>The widest gap puts the boundary halfway, at $x = 2$, so $b = 2w$.</li>
       <li>The constraint $y^{(i)}(w x^{(i)} - b) \\ge 1$ is tightest at the two points. At $x=3$: $w(3) - 2w = w \\ge 1$. The smallest allowed weight is $w = 1$.</li>
       <li>Now compute the margin width: $\\dfrac{2}{\\lVert w\\rVert} = \\dfrac{2}{1} = \\mathbf{2}$ — exactly the gap from $x=1$ to $x=3$. The half-width is $1$.</li>
       <li>Punchline: if we forced a bigger $w = 2$, the street would shrink to $2/2 = 1$. Minimizing $\\lVert w\\rVert$ is literally maximizing the street. Both points sit on the edges, so both are support vectors.</li>
     </ul>`,
  application:
    `<p>SVMs classify text (spam, topic), images, and gene-expression data. They shine when you have many features but only a moderate number of examples — common in medicine and bioinformatics.</p>`,
  quiz: {
    q: `Two classes sit at $x = 0$ (class $-1$) and $x = 4$ (class $+1$). Where does the SVM put the boundary, and what is the margin half-width?`,
    a: `<p>The boundary goes halfway, at $x = 2$. The margin half-width is the distance to each point, which is $2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-kernels",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    // 1-D data on a line, x in [-3,3]. inner class (|x|<1.3) is one color, outer is another.
    // Not separable by a single point on the line. Lift to z = x^2 -> separable by horizontal line.
    var data = [];
    for (var x = -2.8; x <= 2.81; x += 0.4) {
      var c = (Math.abs(x) < 1.3) ? 1 : 0;
      data.push({ x: Math.round(x * 100) / 100, c: c });
    }
    var lifted = false;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var pad = 40, W = 640, H = 320;
    function PX(x) { return pad + (x + 3) / 6 * (W - 2 * pad); }
    var threshZ = 1.69; // x^2 boundary at |x| ~ 1.3

    function render() {
      var col = C(); ctx.clearRect(0, 0, W, H);
      ctx.font = "13px sans-serif";
      if (!lifted) {
        // INPUT SPACE: a number line. show points; no single split works.
        var yLine = H / 2;
        ctx.strokeStyle = col.border; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(PX(-3), yLine); ctx.lineTo(PX(3), yLine); ctx.stroke();
        for (var t = -3; t <= 3; t++) { var X = PX(t); ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(X, yLine - 4); ctx.lineTo(X, yLine + 4); ctx.stroke(); ctx.fillStyle = col.dim; ctx.textAlign = "center"; ctx.fillText(String(t), X, yLine + 22); }
        for (var i = 0; i < data.length; i++) {
          ctx.fillStyle = data[i].c === 1 ? col.accent2 : col.accent;
          ctx.beginPath(); ctx.arc(PX(data[i].x), yLine, 7, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.stroke();
        }
        ctx.fillStyle = col.ink; ctx.textAlign = "center"; ctx.fillText("input space:  feature x on a line", W / 2, 36);
        ctx.fillStyle = col.warn; ctx.fillText("green sits BETWEEN blue — no single point on the line separates them", W / 2, H - 24);
        readout.innerHTML = "On the raw line, the green class (inner) is surrounded by the blue class (outer). No single threshold splits them. Click the button to lift each point to a new feature z = x².";
      } else {
        // FEATURE SPACE: plot (x, z=x^2). a horizontal line separates classes.
        var x0 = pad, x1 = W - 20, y0 = 24, y1 = H - 40;
        function FX(x) { return x0 + (x + 3) / 6 * (x1 - x0); }
        function FY(z) { return y1 - (z / 9) * (y1 - y0); }
        ctx.strokeStyle = col.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
        ctx.fillStyle = col.dim; ctx.textAlign = "center"; ctx.fillText("x", (x0 + x1) / 2, H - 22);
        ctx.save(); ctx.translate(14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("z = x²", 0, 0); ctx.restore();
        // separating line z = threshZ
        ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(x0, FY(threshZ)); ctx.lineTo(x1, FY(threshZ)); ctx.stroke(); ctx.setLineDash([]);
        // the parabola guide
        ctx.strokeStyle = col.dim + "66"; ctx.lineWidth = 1; ctx.beginPath();
        var first = true;
        for (var xx = -3; xx <= 3.01; xx += 0.05) { var Z = xx * xx; if (first) { ctx.moveTo(FX(xx), FY(Z)); first = false; } else ctx.lineTo(FX(xx), FY(Z)); }
        ctx.stroke();
        for (var k = 0; k < data.length; k++) {
          var z = data[k].x * data[k].x;
          ctx.fillStyle = data[k].c === 1 ? col.accent2 : col.accent;
          ctx.beginPath(); ctx.arc(FX(data[k].x), FY(z), 7, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.stroke();
        }
        ctx.fillStyle = col.ink; ctx.textAlign = "center"; ctx.fillText("feature space:  lift to z = x²", W / 2, 18);
        readout.innerHTML = "Lifted to z = x², the green class (low z, near 0) sits BELOW the blue class (high z). A single straight line z = " + threshZ.toFixed(2) + " now separates them. The kernel trick computes dot products in this lifted space without ever building the features by hand.";
      }
    }
    var btn = document.createElement("button"); btn.textContent = "lift to feature space"; btn.style.margin = "6px 0";
    btn.addEventListener("click", function () { lifted = !lifted; btn.textContent = lifted ? "back to input space" : "lift to feature space"; render(); });
    host.appendChild(btn);
    render();
  },
  title: "The kernel trick",
  tagline: "Draw curved boundaries without ever building the curved features.",
  prereqs: ["ml-svm", "fnd-dot"],
  bigIdea:
    `<p>A straight line cannot separate every dataset. Some need curves.</p>
     <p>One fix: map the data into a higher dimension where a straight line works again.</p>
     <p>But that mapping can be huge or infinite. Computing it directly is too expensive.</p>
     <p>The <b>kernel trick</b> computes the dot product in that high space directly, skipping the mapping entirely.</p>`,
  buildup:
    `<p>SVMs only ever need dot products between examples, never the examples alone.</p>
     <p>A <b>kernel</b> $K(x,z)$ gives the dot product of the mapped points $\\phi(x)$ and $\\phi(z)$.</p>
     <p>If we have a cheap formula for $K$, we get the high-dimensional power for free.</p>`,
  symbols: [
    { sym: "$\\phi(x)$", desc: "the feature map: it sends $x$ into a higher-dimensional space (Greek 'phi')." },
    { sym: "$K(x,z)$", desc: "the kernel: the dot product of the mapped points, $\\phi(x)^\\top \\phi(z)$." },
    { sym: "$\\lVert x - z\\rVert^2$", desc: "the squared distance between points $x$ and $z$." },
    { sym: "$\\sigma$", desc: "the width of the Gaussian kernel ('sigma'). Big $\\sigma$ = smooth; small $\\sigma$ = wiggly." }
  ],
  formula: `$$ K(x,z) = \\phi(x)^\\top \\phi(z) \\qquad\\quad K_{\\text{Gauss}}(x,z) = \\exp\\!\\left(-\\frac{\\lVert x - z\\rVert^2}{2\\sigma^2}\\right) $$`,
  whatItDoes:
    `<p>The kernel returns a single similarity number for two points. High = similar, low = far apart.</p>
     <p>The Gaussian kernel gives $1$ when points are identical and fades toward $0$ as they separate.</p>
     <p>Swap dot products for kernels inside an SVM, and the straight boundary becomes a curved one — with no extra features computed.</p>`,
  example:
    `<p>Use the Gaussian kernel with $\\sigma = 1$. Compare two points at distance $0$ and at distance $2$.</p>
     <ul class="steps">
       <li>Same point, $\\lVert x - z\\rVert^2 = 0$: $K = \\exp(0) = 1$. Maximum similarity.</li>
       <li>Distance $2$, so $\\lVert x - z\\rVert^2 = 4$: $K = \\exp(-4 / 2) = \\exp(-2) \\approx 0.135$.</li>
       <li>So nearby points score high, distant points score low.</li>
       <li>This is why the Gaussian kernel acts like a smooth similarity bump.</li>
     </ul>`,
  application:
    `<p>Kernel SVMs handle handwriting, text, and tasks where the boundary is curvy. The same kernel idea also powers Gaussian processes and many similarity-based methods.</p>`,
  quiz: {
    q: `With a Gaussian kernel, what is $K(x,z)$ when $x = z$ (distance 0)? What does that value mean?`,
    a: `<p>$K = \\exp(0) = 1$. A point is maximally similar to itself, so the kernel gives its highest value, 1.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-gda",
  demo: function (host) {
    var P = [
      { x: 2, y: 2.5, c: 0 }, { x: 2.6, y: 1.8, c: 0 }, { x: 1.6, y: 2.2, c: 0 }, { x: 2.2, y: 3.0, c: 0 }, { x: 3.0, y: 2.4, c: 0 },
      { x: 6, y: 6.5, c: 1 }, { x: 6.6, y: 5.8, c: 1 }, { x: 5.6, y: 6.2, c: 1 }, { x: 6.2, y: 7.0, c: 1 }, { x: 7.0, y: 6.4, c: 1 }
    ];
    Demos.scatter(host, { points: P, init: function (api) {
      // class means
      var m0 = { x: 0, y: 0, n: 0 }, m1 = { x: 0, y: 0, n: 0 };
      api.pts.forEach(function (p) { var m = p.c === 0 ? m0 : m1; m.x += p.x; m.y += p.y; m.n++; });
      m0.x /= m0.n; m0.y /= m0.n; m1.x /= m1.n; m1.y /= m1.n;
      // boundary: perpendicular bisector of the segment between means
      var mx = (m0.x + m1.x) / 2, my = (m0.y + m1.y) / 2;
      var dx = m1.x - m0.x, dy = m1.y - m0.y;   // direction between means; boundary normal is (dx,dy)
      api.draw(function (ctx, col, px, py) {
        // draw means
        [m0, m1].forEach(function (m, i) { ctx.fillStyle = api.palette[i]; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px(m.x), py(m.y), 9, 0, 7); ctx.fill(); ctx.stroke(); });
        // boundary line: points (x,y) with dx(x-mx)+dy(y-my)=0 -> draw across a wide t range along the perpendicular direction (-dy,dx)
        ctx.strokeStyle = col.warn; ctx.lineWidth = 2;
        var ax = mx - (-dy) * 5, ay = my - dx * 5, bx = mx + (-dy) * 5, by = my + dx * 5;
        ctx.beginPath(); ctx.moveTo(px(ax), py(ay)); ctx.lineTo(px(bx), py(by)); ctx.stroke();
      });
      api.readout.innerHTML = "Each color is a Gaussian blob. Big dots = class means μ₀, μ₁. The orange line is the linear boundary: the perpendicular bisector between the means. A new point is labeled by whichever mean's bell curve explains it better.";
    } });
  },
  title: "Gaussian discriminant analysis",
  tagline: "Model each class as a bell curve, then flip it with Bayes to classify.",
  prereqs: ["prob-bayes", "prob-normal", "ml-logistic-regression"],
  bigIdea:
    `<p>There are two styles of classifier.</p>
     <p><b>Discriminative</b> models learn the boundary directly (like logistic regression).</p>
     <p><b>Generative</b> models learn what each class looks like, then use Bayes' rule to classify.</p>
     <p><b>Gaussian discriminant analysis</b> (GDA) is generative: it models each class as a bell curve.</p>`,
  buildup:
    `<p>For each class, fit a Gaussian (normal) bell curve to its data: $p(x \\mid y)$.</p>
     <p>Also note how common each class is: $p(y)$.</p>
     <p>Bayes' rule then flips these around to give $p(y \\mid x)$ — the class given the input.</p>`,
  symbols: [
    { sym: "$p(x \\mid y)$", desc: "the bell curve for class $y$: how inputs $x$ are spread within that class." },
    { sym: "$p(y)$", desc: "the prior: how often class $y$ appears overall." },
    { sym: "$p(y \\mid x)$", desc: "what we want: the probability of class $y$ given the input $x$." },
    { sym: "$\\mu$", desc: "the mean ('mu'): the center of a class's bell curve." },
    { sym: "$\\Sigma$", desc: "the covariance ('Sigma'): the shape and spread of the bell curve." }
  ],
  formula: `$$ p(y \\mid x) = \\frac{p(x \\mid y)\\,p(y)}{p(x)} \\qquad\\text{with}\\qquad p(x \\mid y) = \\mathcal{N}(\\mu_y,\\, \\Sigma) $$`,
  whatItDoes:
    `<p>For a new $x$, ask each class: "how well does my bell curve explain this point?" That is $p(x \\mid y)$.</p>
     <p>Weight each by how common the class is, $p(y)$. Bayes' rule combines them into $p(y \\mid x)$.</p>
     <p>The bottom $p(x)$ is the same for every class, so we just pick the class with the largest top.</p>`,
  example:
    `<p>Classify height as adult or child. Both bell curves use spread $\\sigma = 20$ cm. Adults: mean $170$. Children: mean $130$. A person is $135$ cm. Equal priors $p(y) = 0.5$.</p>
     <ul class="steps">
       <li>Child curve at $135$: $p(x \\mid \\text{child}) \\propto e^{-\\frac{(135-130)^2}{2\\cdot 20^2}} = e^{-25/800} = e^{-0.031} \\approx 0.969$.</li>
       <li>Adult curve at $135$: $p(x \\mid \\text{adult}) \\propto e^{-\\frac{(135-170)^2}{2\\cdot 20^2}} = e^{-1225/800} = e^{-1.531} \\approx 0.216$.</li>
       <li>Bayes (equal priors cancel): $p(\\text{child} \\mid x) = \\dfrac{0.969}{0.969 + 0.216} \\approx \\mathbf{0.82}$.</li>
       <li>So $82\\%$ child vs $18\\%$ adult — the nearer mean wins, and Bayes turns the densities into a real probability. Predict child.</li>
     </ul>`,
  application:
    `<p>Generative models like GDA are useful when data is limited, since they make stronger assumptions. They also let you generate fake-but-plausible examples and detect outliers that fit no class well.</p>`,
  quiz: {
    q: `GDA models each class with a bell curve $p(x \\mid y)$. What rule turns these into the class probability $p(y \\mid x)$?`,
    a: `<p>Bayes' rule: $p(y \\mid x) = \\dfrac{p(x \\mid y)\\,p(y)}{p(x)}$. It flips "input given class" into "class given input".</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-naive-bayes",
  demo: function (host) {
    Demos.calc(host, {
      bars: true,
      inputs: [
        { key: "prior", label: "P(spam)", min: 0.01, max: 0.99, val: 0.4, step: 0.01 },
        { key: "ws", label: "P(word|spam)", min: 0.01, max: 0.99, val: 0.8, step: 0.01 },
        { key: "wh", label: "P(word|ham)", min: 0.01, max: 0.99, val: 0.1, step: 0.01 }
      ],
      compute: function (s) {
        var spamScore = s.prior * s.ws;
        var hamScore = (1 - s.prior) * s.wh;
        var total = spamScore + hamScore;
        var pSpam = spamScore / total;
        return {
          text: "Prior × likelihood. Spam: P(spam)·P(word|spam) = " + s.prior.toFixed(2) + " × " + s.ws.toFixed(2) + " = <b>" + spamScore.toFixed(4) + "</b>. Ham: " + (1 - s.prior).toFixed(2) + " × " + s.wh.toFixed(2) + " = <b>" + hamScore.toFixed(4) + "</b>. Normalized P(spam|word) = <b>" + pSpam.toFixed(3) + "</b>.",
          bars: [{ label: "spam score", val: spamScore }, { label: "ham score", val: hamScore }]
        };
      }
    });
  },
  title: "Naive Bayes",
  tagline: "Assume features are independent. Multiply their probabilities. Surprisingly good.",
  prereqs: ["prob-bayes", "ml-gda"],
  bigIdea:
    `<p><b>Naive Bayes</b> is a fast, simple classifier built on Bayes' rule.</p>
     <p>It makes one bold ("naive") assumption: features are independent given the class.</p>
     <p>That lets it multiply each feature's probability instead of modeling them together.</p>
     <p>The assumption is rarely exactly true, yet the classifier works remarkably well, especially for text.</p>`,
  buildup:
    `<p>Modeling all features jointly is hard. The naive assumption breaks it into easy pieces.</p>
     <p>If features are independent given the class, the probability of all of them is the product of each one.</p>
     <p>So $P(x \\mid y)$ becomes a simple multiplication over the features.</p>`,
  symbols: [
    { sym: "$x_i$", desc: "feature $i$ (for text: whether word $i$ appears, or its count)." },
    { sym: "$P(x_i \\mid y)$", desc: "the probability of feature $i$ given the class $y$." },
    { sym: "$\\prod_i$", desc: "multiply over all features $i$ (capital Greek Pi, for Product)." },
    { sym: "$P(x \\mid y)$", desc: "the probability of the whole input given the class, built by multiplying the pieces." }
  ],
  formula: `$$ P(x \\mid y) = \\prod_{i} P(x_i \\mid y) $$`,
  whatItDoes:
    `<p>For a given class, look up each feature's probability. Multiply them all together.</p>
     <p>Combine with the class prior $P(y)$ via Bayes' rule, then pick the class with the highest result.</p>
     <p>Because it is just lookups and multiplies, it trains and predicts very fast.</p>`,
  example:
    `<p>Spam filter. The word "free" appears in $80\\%$ of spam but only $10\\%$ of normal mail.</p>
     <ul class="steps">
       <li>$P(\\text{"free"} \\mid \\text{spam}) = 0.8$. &nbsp; $P(\\text{"free"} \\mid \\text{not spam}) = 0.1$.</li>
       <li>Say "win" also appears: $P(\\text{"win"} \\mid \\text{spam}) = 0.5$, &nbsp; $P(\\text{"win"} \\mid \\text{not spam}) = 0.05$.</li>
       <li>Multiply the features (the naive step): spam $= 0.8 \\times 0.5 = 0.40$, not-spam $= 0.1 \\times 0.05 = 0.005$.</li>
       <li>Now fold in a prior $P(\\text{spam}) = 0.4$: spam score $= 0.4 \\times 0.40 = 0.16$; not-spam score $= 0.6 \\times 0.005 = 0.003$.</li>
       <li>Normalize: $P(\\text{spam} \\mid \\text{words}) = \\dfrac{0.16}{0.16 + 0.003} \\approx \\mathbf{0.98}$. Predict spam — the two independent words multiplied into near-certainty.</li>
     </ul>`,
  application:
    `<p>Naive Bayes is a classic spam filter. It also classifies news articles by topic, flags sentiment, and serves as a fast baseline for any text-classification problem.</p>`,
  quiz: {
    q: `Naive Bayes assumes features are independent given the class. With that, how do you get $P(x \\mid y)$ for two features?`,
    a: `<p>Multiply them: $P(x \\mid y) = P(x_1 \\mid y) \\times P(x_2 \\mid y)$. Independence turns the joint probability into a product.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-trees",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    // two interleaved classes on [0,1]^2. Class label via a curvy true boundary + noise.
    var pts = [];
    var seed = 1234567;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    for (var i = 0; i < 80; i++) {
      var x = rnd(), y = rnd();
      // true region: class 1 if y > 0.5 + 0.28*sin(2*pi*x), with a little label noise
      var boundary = 0.5 + 0.28 * Math.sin(2 * Math.PI * x);
      var c = (y > boundary) ? 1 : 0;
      if (rnd() < 0.08) c = 1 - c; // noise -> lets deep trees overfit
      pts.push({ x: x, y: y, c: c });
    }
    var depth = 3;
    var cv = document.createElement("canvas"); cv.width = 360; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var pad = 24, W = 360, H = 340;
    function PX(x) { return pad + x * (W - 2 * pad); }
    function PY(y) { return (H - pad) - y * (H - 2 * pad); }

    // greedy CART: recursively split a box by best axis-aligned threshold (gini)
    function gini(sub) {
      if (sub.length === 0) return 0;
      var n1 = 0; for (var i = 0; i < sub.length; i++) if (sub[i].c === 1) n1++;
      var p = n1 / sub.length; return 2 * p * (1 - p);
    }
    function majority(sub) {
      var n1 = 0; for (var i = 0; i < sub.length; i++) if (sub[i].c === 1) n1++;
      return (n1 >= sub.length - n1) ? 1 : 0;
    }
    function build(sub, box, d) {
      var node = { box: box, label: majority(sub) };
      if (d <= 0 || sub.length < 3 || gini(sub) < 1e-6) return node;
      var best = null;
      ["x", "y"].forEach(function (ax) {
        var vals = sub.map(function (p) { return p[ax]; }).sort(function (a, b) { return a - b; });
        for (var i = 1; i < vals.length; i++) {
          var thr = (vals[i - 1] + vals[i]) / 2;
          var L = sub.filter(function (p) { return p[ax] <= thr; });
          var R = sub.filter(function (p) { return p[ax] > thr; });
          if (L.length === 0 || R.length === 0) continue;
          var imp = (L.length * gini(L) + R.length * gini(R)) / sub.length;
          if (!best || imp < best.imp) best = { ax: ax, thr: thr, imp: imp, L: L, R: R };
        }
      });
      if (!best) return node;
      var lbox, rbox;
      if (best.ax === "x") { lbox = { x0: box.x0, x1: best.thr, y0: box.y0, y1: box.y1 }; rbox = { x0: best.thr, x1: box.x1, y0: box.y0, y1: box.y1 }; }
      else { lbox = { x0: box.x0, x1: box.x1, y0: box.y0, y1: best.thr }; rbox = { x0: box.x0, x1: box.x1, y0: best.thr, y1: box.y1 }; }
      node.ax = best.ax; node.thr = best.thr;
      node.left = build(best.L, lbox, d - 1);
      node.right = build(best.R, rbox, d - 1);
      return node;
    }
    function leaves(node, acc) {
      if (!node.left) { acc.push(node); return acc; }
      leaves(node.left, acc); leaves(node.right, acc); return acc;
    }
    function predict(node, p) {
      while (node.left) { node = (p[node.ax] <= node.thr) ? node.left : node.right; }
      return node.label;
    }

    function render() {
      var col = C(); ctx.clearRect(0, 0, W, H);
      var root = build(pts, { x0: 0, x1: 1, y0: 0, y1: 1 }, depth);
      var lvs = leaves(root, []);
      // fill leaf regions by predicted class
      for (var i = 0; i < lvs.length; i++) {
        var b = lvs[i].box;
        ctx.fillStyle = (lvs[i].label === 1) ? (col.accent2 + "33") : (col.accent + "33");
        var X0 = PX(b.x0), X1 = PX(b.x1), Y0 = PY(b.y1), Y1 = PY(b.y0);
        ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
        ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.strokeRect(X0, Y0, X1 - X0, Y1 - Y0);
      }
      // points
      for (var k = 0; k < pts.length; k++) {
        ctx.fillStyle = (pts[k].c === 1) ? col.accent2 : col.accent;
        ctx.beginPath(); ctx.arc(PX(pts[k].x), PY(pts[k].y), 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke();
      }
      // training accuracy
      var correct = 0; for (var m = 0; m < pts.length; m++) if (predict(root, pts[m]) === pts[m].c) correct++;
      var acc = correct / pts.length;
      var msg;
      if (depth <= 1) msg = "Depth 1: one split, a coarse boundary. The tree is too simple — it underfits.";
      else if (depth >= 6) msg = "Deep tree: many tiny rectangles carve out single noisy points — that is overfitting. Great on train, poor on new data.";
      else msg = "Moderate depth: the staircase of rectangles tracks the real boundary well.";
      readout.innerHTML = "Tree depth = <b>" + depth + "</b>, " + lvs.length + " leaf regions. Each split is one axis-aligned line; leaves are colored by predicted class. Train accuracy = <b>" + (acc * 100).toFixed(1) + "%</b>. " + msg;
    }

    var row = document.createElement("div"); row.style.margin = "6px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "tree depth ";
    var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = String(depth); lab.appendChild(span);
    var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 1; inp.max = 8; inp.step = 1; inp.value = depth;
    inp.addEventListener("input", function () { depth = parseInt(inp.value, 10); span.textContent = String(depth); render(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    render();
  },
  title: "Decision trees (CART)",
  tagline: "Ask yes/no questions, split the data, repeat. Easy to read.",
  prereqs: ["ml-supervised"],
  bigIdea:
    `<p>A <b>decision tree</b> classifies by asking a sequence of simple questions.</p>
     <p>Each question splits the data into two groups.</p>
     <p>You keep splitting until each group is fairly pure (mostly one class).</p>
     <p>Trees are easy to read: you can follow the path of questions to see exactly why a decision was made.</p>`,
  buildup:
    `<p>At each step, pick the question that best separates the classes.</p>
     <p>"Best" means it makes the resulting groups more pure than before.</p>
     <p>A common purity measure: the Gini impurity, low when a group is mostly one class.</p>`,
  symbols: [
    { sym: "node", desc: "a point in the tree where a question is asked." },
    { sym: "split", desc: "a yes/no question on one feature, like 'is size > 1500?'." },
    { sym: "leaf", desc: "an end node with no more questions; it gives the final prediction." },
    { sym: "$\\text{Gini}$", desc: "an impurity score: $0$ means perfectly pure (all one class), higher means mixed." }
  ],
  formula: `$$ \\text{Gini} = 1 - \\sum_{c} p_c^2 \\qquad (p_c = \\text{fraction of class } c \\text{ in the group}) $$`,
  whatItDoes:
    `<p>For each possible split, measure how pure the two resulting groups are.</p>
     <p>Pick the split that gives the purest groups. Add it to the tree. Repeat on each group.</p>
     <p>Gini is $0$ when a group is all one class, and largest when classes are evenly mixed.</p>`,
  example:
    `<p>10 people: 5 buy, 5 don't. Split on "age > 30?". Above 30: 4 buy, 1 don't. Below: 1 buy, 4 don't.</p>
     <ul class="steps">
       <li>Before split, fractions are $0.5$ and $0.5$. Gini $= 1 - (0.5^2 + 0.5^2) = 1 - 0.5 = 0.5$. Very mixed.</li>
       <li>Above-30 group: fractions $0.8$ and $0.2$. Gini $= 1 - (0.64 + 0.04) = 0.32$. Purer.</li>
       <li>Below-30 group: same by symmetry, Gini $= 0.32$. Also purer.</li>
       <li>Both groups got purer, so "age > 30?" is a good split.</li>
     </ul>`,
  application:
    `<p>Decision trees power credit scoring, medical triage, and customer churn analysis, where people must understand and trust the reasoning. They are also the building block of random forests.</p>`,
  quiz: {
    q: `A group is perfectly pure (all one class). What is its Gini impurity?`,
    a: `<p>With one class, $p_c = 1$, so Gini $= 1 - 1^2 = 0$. Pure groups have Gini 0.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-ensembles",
  demo: function (host) {
    Demos.calc(host, {
      bars: true,
      inputs: [
        { key: "sig2", label: "single-tree variance σ²", min: 0.1, max: 4, val: 2, step: 0.1 },
        { key: "T", label: "number of trees T", min: 1, max: 50, val: 10, step: 1 }
      ],
      compute: function (s) {
        var ens = s.sig2 / s.T;
        return {
          text: "Averaging T independent trees cuts the variance: ensemble variance ≈ σ²/T = " + s.sig2.toFixed(2) + " / " + s.T + " = <b>" + ens.toFixed(4) + "</b>. More trees ⇒ less variance, so the forest is steadier than one tree.",
          bars: [{ label: "single tree σ²", val: s.sig2 }, { label: "ensemble σ²/T", val: ens }],
          max: s.sig2
        };
      }
    });
  },
  title: "Random forests & boosting",
  tagline: "Combine many weak models into one strong one.",
  prereqs: ["ml-trees"],
  bigIdea:
    `<p>One tree is weak and easily fooled by noise.</p>
     <p>An <b>ensemble</b> combines many models and lets them vote.</p>
     <p>The errors of individual models tend to cancel out. The crowd is smarter than any member.</p>
     <p>Two main styles: bagging (random forests) and boosting.</p>`,
  buildup:
    `<p><b>Bagging</b> trains many trees on random subsets of data, then averages their votes. Random forests do this.</p>
     <p><b>Boosting</b> trains trees one after another. Each new tree focuses on the mistakes of the ones before it.</p>
     <p>Both turn weak learners into a strong predictor, but in different ways.</p>`,
  symbols: [
    { sym: "weak learner", desc: "a simple model that is only a little better than guessing (often a small tree)." },
    { sym: "bagging", desc: "train many models on random data subsets, then average or vote." },
    { sym: "boosting", desc: "train models in sequence, each fixing the previous ones' errors." },
    { sym: "$\\hat{y}$", desc: "the ensemble's final prediction ('y-hat'), combining all the models." }
  ],
  formula: `$$ \\hat{y} = \\frac{1}{T}\\sum_{t=1}^{T} h_t(x) \\quad\\text{(bagging)} \\qquad \\hat{y} = \\sum_{t=1}^{T} \\alpha_t\\, h_t(x) \\quad\\text{(boosting)} $$`,
  whatItDoes:
    `<p>Bagging: average $T$ trees equally. Each tree saw different data, so their mistakes differ and cancel.</p>
     <p>Boosting: add trees one at a time, each with a weight $\\alpha_t$. Later trees correct earlier mistakes.</p>
     <p>Adaboost and gradient boosting are the famous boosting methods.</p>`,
  example:
    `<p>Why does averaging help? Each tree's prediction is noisy with variance $\\sigma^2 = 4$. Average $T$ independent trees.</p>
     <ul class="steps">
       <li>One tree: variance $= 4$. The forest of $T$ trees has variance $\\dfrac{\\sigma^2}{T} = \\dfrac{4}{T}$.</li>
       <li>$T = 4$ trees: variance $= 4/4 = \\mathbf{1}$. Already a quarter of one tree's noise.</li>
       <li>$T = 25$ trees: variance $= 4/25 = \\mathbf{0.16}$. The forest is steadier and steadier.</li>
       <li>Concrete vote: three trees predict house prices $8, 10, 12$. The average is $\\dfrac{8+10+12}{3} = \\mathbf{10}$ — their scattered guesses cancel into one stable number.</li>
     </ul>`,
  application:
    `<p>Random forests and gradient boosting (XGBoost, LightGBM) win many real-world contests. They power fraud detection, search ranking, and risk models on tabular data across industry.</p>`,
  quiz: {
    q: `In a random forest, three trees predict 8, 10, and 12 for a house price. What is the forest's prediction (by averaging)?`,
    a: `<p>Average them: $(8 + 10 + 12) / 3 = 30 / 3 = 10$. Bagging averages the members' predictions.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-knn",
  demo: function (host) {
    var P = [
      { x: 2, y: 2, c: 0 }, { x: 3, y: 2.5, c: 0 }, { x: 2.5, y: 3.5, c: 0 }, { x: 3.5, y: 3, c: 0 }, { x: 1.5, y: 3, c: 0 },
      { x: 7, y: 7, c: 1 }, { x: 6, y: 6.5, c: 1 }, { x: 7.5, y: 6, c: 1 }, { x: 6.5, y: 7.5, c: 1 }, { x: 8, y: 7, c: 1 },
      { x: 5, y: 5, c: 1 }, { x: 4.5, y: 4, c: 0 }
    ];
    var query = { x: 5, y: 4.5 };
    Demos.scatter(host, { points: P.concat([{ x: query.x, y: query.y, c: 3 }]), init: function (api) {
      var k = 3;
      function render() {
        // distances from query to the real points (exclude the query marker itself = last)
        var real = api.pts.slice(0, api.pts.length - 1);
        var sorted = real.map(function (p) { return { p: p, d: Math.sqrt((p.x - query.x) * (p.x - query.x) + (p.y - query.y) * (p.y - query.y)) }; });
        sorted.sort(function (a, b) { return a.d - b.d; });
        var kk = Math.min(k, sorted.length);
        var votes0 = 0, votes1 = 0;
        for (var i = 0; i < kk; i++) { if (sorted[i].p.c === 0) votes0++; else votes1++; }
        var pred = votes1 > votes0 ? 1 : 0;
        api.draw(function (ctx, col, px, py) {
          // highlight the k nearest
          for (var i = 0; i < kk; i++) { var pt = sorted[i].p; ctx.strokeStyle = col.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px(pt.x), py(pt.y), 9, 0, 7); ctx.stroke(); }
          // query as a hollow diamond
          ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px(query.x), py(query.y), 7, 0, 7); ctx.stroke();
        });
        api.readout.innerHTML = "Query point (circled center). Of its k = " + kk + " nearest neighbors (ringed): " + votes0 + " class-0 (blue) vs " + votes1 + " class-1 (green). Majority ⇒ predict class <b>" + pred + "</b>.";
      }
      api.slider("k", 1, 11, k, 1, function (v) { k = Math.round(v); render(); });
      render();
    } });
  },
  title: "k-nearest neighbors",
  tagline: "To predict a new point, look at the closest known points.",
  prereqs: ["fnd-norm", "ml-supervised"],
  bigIdea:
    `<p><b>k-nearest neighbors</b> (k-NN) makes no model at all during training. It just stores the data.</p>
     <p>To predict a new point, find the $k$ closest stored points.</p>
     <p>Let them vote (for classes) or average (for numbers).</p>
     <p>The idea: similar inputs usually have similar answers.</p>`,
  buildup:
    `<p>"Closest" means smallest distance. Use the L2 norm of the difference: $\\lVert x - x^{(i)}\\rVert$.</p>
     <p>Pick how many neighbors to consult: that is $k$.</p>
     <p>Small $k$ follows the data closely but is jumpy. Large $k$ is smoother but can blur fine detail.</p>`,
  symbols: [
    { sym: "$k$", desc: "how many nearest neighbors to consult." },
    { sym: "$\\lVert x - x^{(i)}\\rVert$", desc: "the distance between the new point $x$ and stored point $x^{(i)}$." },
    { sym: "vote", desc: "for classification: the most common class among the $k$ neighbors." },
    { sym: "average", desc: "for regression: the mean of the $k$ neighbors' values." }
  ],
  formula: `$$ \\hat{y}(x) = \\text{majority vote (or average) of the } k \\text{ points with smallest } \\lVert x - x^{(i)}\\rVert $$`,
  whatItDoes:
    `<p>Measure the distance from the new point to every stored point. Sort. Keep the $k$ smallest.</p>
     <p>Those are the neighbors. Take their majority class, or their average value.</p>
     <p>Raising $k$ smooths the prediction: more bias, less variance. Lowering $k$ does the reverse.</p>`,
  example:
    `<p>Classify a fruit by weight. Stored: apples at $100, 110, 120$ g; oranges at $150, 160$ g. New fruit: $115$ g. Use $k = 3$.</p>
     <ul class="steps">
       <li>Distances: to $100 \\to 15$, to $110 \\to 5$, to $120 \\to 5$, to $150 \\to 35$, to $160 \\to 45$.</li>
       <li>The 3 closest are $110, 120, 100$ g — all apples.</li>
       <li>Vote: 3 apples, 0 oranges.</li>
       <li>Predict apple.</li>
     </ul>`,
  application:
    `<p>k-NN powers recommendation ("users like you also bought..."), image search by similarity, and quick baselines. It is simple but slow at prediction time, since it scans all stored points.</p>`,
  quiz: {
    q: `If you increase $k$ from 1 to 50, does the prediction get smoother or jumpier? More bias or more variance?`,
    a: `<p>Smoother. Larger $k$ averages over more neighbors, which raises bias but lowers variance.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-bias-variance",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    // noisy data from a smooth true curve; fit polynomials of degree = complexity
    var seed = 42;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function trueF(x) { return 0.6 + 0.9 * Math.sin(1.1 * x); }
    var data = [];
    for (var i = 0; i < 11; i++) { var x = i / 10 * 6 - 0.2; data.push({ x: x, y: trueF(x) + (rnd() - 0.5) * 0.7 }); }
    // polynomial least-squares fit (normal equations, small degrees) via Gaussian elimination
    function polyfit(deg) {
      var N = deg + 1, X = [], Y = [];
      for (var r = 0; r < N; r++) { X.push(new Array(N).fill(0)); Y.push(0); }
      for (var k = 0; k < data.length; k++) {
        var xs = [1]; for (var p = 1; p < 2 * N; p++) xs.push(xs[p - 1] * data[k].x);
        for (var a = 0; a < N; a++) { for (var b = 0; b < N; b++) X[a][b] += xs[a + b]; Y[a] += xs[a] * data[k].y; }
      }
      // solve X c = Y
      for (var col = 0; col < N; col++) {
        var piv = col; for (var r2 = col + 1; r2 < N; r2++) if (Math.abs(X[r2][col]) > Math.abs(X[piv][col])) piv = r2;
        var tmp = X[col]; X[col] = X[piv]; X[piv] = tmp; var ty = Y[col]; Y[col] = Y[piv]; Y[piv] = ty;
        if (Math.abs(X[col][col]) < 1e-9) continue;
        for (var r3 = 0; r3 < N; r3++) { if (r3 === col) continue; var f = X[r3][col] / X[col][col]; for (var c2 = col; c2 < N; c2++) X[r3][c2] -= f * X[col][c2]; Y[r3] -= f * Y[col]; }
      }
      var c = []; for (var d = 0; d < N; d++) c.push(Math.abs(X[d][d]) < 1e-9 ? 0 : Y[d] / X[d][d]);
      return c;
    }
    function evalp(c, x) { var s = 0, xp = 1; for (var i = 0; i < c.length; i++) { s += c[i] * xp; xp *= x; } return s; }
    var degree = 3;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 220; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var uc = document.createElement("canvas"); uc.width = 640; uc.height = 170; uc.style.maxWidth = "100%"; host.appendChild(uc);
    var uctx = uc.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var pad = 30, W = 640;
    function PX(x) { return pad + (x + 0.2) / 6 * (W - 2 * pad); }
    function PY(y) { return (220 - 25) - (y + 1) / 4 * (220 - 50); }

    function bias2(d) { return 1.3 / (d + 0.7); }
    function variance(d) { return 0.05 + 0.022 * d * d; }

    function render() {
      var col = C(); ctx.clearRect(0, 0, W, 220);
      // axes
      ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, PY(-1)); ctx.lineTo(W - pad, PY(-1)); ctx.stroke();
      // true curve
      ctx.strokeStyle = col.dim; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath();
      var first = true;
      for (var x = -0.2; x <= 5.81; x += 0.05) { if (first) { ctx.moveTo(PX(x), PY(trueF(x))); first = false; } else ctx.lineTo(PX(x), PY(trueF(x))); }
      ctx.stroke(); ctx.setLineDash([]);
      // fitted poly of current degree
      var c = polyfit(degree);
      ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5; ctx.beginPath(); first = true;
      for (var xx = -0.2; xx <= 5.81; xx += 0.03) { var yv = evalp(c, xx); yv = Math.max(-1.2, Math.min(3.2, yv)); if (first) { ctx.moveTo(PX(xx), PY(yv)); first = false; } else ctx.lineTo(PX(xx), PY(yv)); }
      ctx.stroke();
      // data points
      for (var k = 0; k < data.length; k++) { ctx.fillStyle = col.accent; ctx.beginPath(); ctx.arc(PX(data[k].x), PY(data[k].y), 4, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left"; ctx.fillText("dashed = true pattern, orange = fitted degree-" + degree + " model", pad, 18);

      // U-curve panel
      uctx.clearRect(0, 0, 640, 170);
      var upad = 36, uy0 = 14, uy1 = 170 - 28;
      function UX(d) { return upad + (d - 1) / 8 * (640 - upad - 16); }
      function UY(v) { return uy1 - v / 2.4 * (uy1 - uy0); }
      uctx.strokeStyle = col.border; uctx.beginPath(); uctx.moveTo(upad, uy1); uctx.lineTo(640 - 16, uy1); uctx.moveTo(upad, uy0); uctx.lineTo(upad, uy1); uctx.stroke();
      function ucurve(fn, color) { uctx.strokeStyle = color; uctx.lineWidth = 2; uctx.beginPath(); var f2 = true; for (var dd = 1; dd <= 9; dd += 0.1) { var Y = UY(fn(dd)); if (f2) { uctx.moveTo(UX(dd), Y); f2 = false; } else uctx.lineTo(UX(dd), Y); } uctx.stroke(); }
      ucurve(bias2, col.accent);
      ucurve(variance, col.accent2);
      ucurve(function (d) { return bias2(d) + variance(d); }, col.warn);
      // marker at current degree
      var tot = bias2(degree) + variance(degree);
      uctx.strokeStyle = col.purple; uctx.setLineDash([4, 3]); uctx.beginPath(); uctx.moveTo(UX(degree), uy0); uctx.lineTo(UX(degree), uy1); uctx.stroke(); uctx.setLineDash([]);
      uctx.fillStyle = col.purple; uctx.beginPath(); uctx.arc(UX(degree), UY(tot), 5, 0, Math.PI * 2); uctx.fill();
      uctx.fillStyle = col.dim; uctx.font = "11px sans-serif"; uctx.textAlign = "left";
      uctx.fillStyle = col.accent; uctx.fillText("bias²", 44, 18); uctx.fillStyle = col.accent2; uctx.fillText("variance", 90, 18); uctx.fillStyle = col.warn; uctx.fillText("total error", 160, 18);
      uctx.fillStyle = col.dim; uctx.textAlign = "center"; uctx.fillText("model complexity (polynomial degree) →", 320, 168);

      var msg;
      if (degree <= 1) msg = "Degree " + degree + ": too simple — the line cannot bend to the curve. High bias, underfitting.";
      else if (degree >= 6) msg = "Degree " + degree + ": too flexible — the curve wiggles through noise. High variance, overfitting.";
      else msg = "Degree " + degree + ": just right — the fit tracks the true pattern without chasing noise. Near the bottom of the U.";
      readout.innerHTML = "bias² = " + bias2(degree).toFixed(3) + ", variance = " + variance(degree).toFixed(3) + ", total = <b>" + tot.toFixed(3) + "</b>. " + msg;
    }
    var row = document.createElement("div"); row.style.margin = "6px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "model complexity (degree) ";
    var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = String(degree); lab.appendChild(span);
    var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 1; inp.max = 9; inp.step = 1; inp.value = degree;
    inp.addEventListener("input", function () { degree = parseInt(inp.value, 10); span.textContent = String(degree); render(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    render();
  },
  title: "Bias-variance tradeoff",
  tagline: "Too simple underfits. Too complex overfits. Aim for the middle.",
  prereqs: ["ml-knn", "ml-linear-regression"],
  bigIdea:
    `<p>Every model has two ways to be wrong.</p>
     <p><b>Bias</b>: the model is too simple and misses the real pattern. This is <b>underfitting</b>.</p>
     <p><b>Variance</b>: the model is too complex and memorizes noise. This is <b>overfitting</b>.</p>
     <p>You cannot kill both at once. The art is balancing them for the lowest test error.</p>`,
  buildup:
    `<p>A simple model (a straight line) has high bias: it cannot bend to the data.</p>
     <p>A very flexible model (a wiggly curve) has high variance: it changes wildly with each new dataset.</p>
     <p>Test error first falls (less bias), then rises (more variance), forming a U shape.</p>`,
  symbols: [
    { sym: "bias", desc: "error from wrong assumptions; the model is too simple (underfit)." },
    { sym: "variance", desc: "error from sensitivity to the training data; the model is too complex (overfit)." },
    { sym: "training error", desc: "error on the data the model learned from." },
    { sym: "test error", desc: "error on new, unseen data. This is what we truly care about." }
  ],
  formula: `$$ \\text{expected test error} \\;=\\; \\text{bias}^2 \\;+\\; \\text{variance} \\;+\\; \\text{noise} $$`,
  whatItDoes:
    `<p>Total error splits into three parts: bias squared, variance, and unavoidable noise.</p>
     <p>Simpler models push bias up and variance down. More complex models do the reverse.</p>
     <p>The best model sits where the bias-plus-variance sum is smallest — the bottom of the U.</p>`,
  example:
    `<p>Fit data with polynomials of growing degree. Total test error $= \\text{bias}^2 + \\text{variance}$ (ignore fixed noise).</p>
     <ul class="steps">
       <li>Degree 1 (line): bias$^2 = 0.90$, variance $= 0.07$. Total $= \\mathbf{0.97}$. High bias — underfit.</li>
       <li>Degree 4: bias$^2 = 0.28$, variance $= 0.40$. Total $= \\mathbf{0.68}$. The lowest sum — just right.</li>
       <li>Degree 8: bias$^2 = 0.15$, variance $= 1.45$. Total $= \\mathbf{1.60}$. High variance — overfit.</li>
       <li>Punchline: as degree rises, bias$^2$ keeps falling but variance climbs faster. The total dips to a minimum at degree 4, then rises — the U-shape.</li>
     </ul>`,
  application:
    `<p>Every model-tuning decision is a bias-variance call: how deep a tree, how many neighbors, how strong the regularization. Watching the gap between training and test error tells you which way to move.</p>`,
  quiz: {
    q: `A model scores nearly $0$ error on training data but high error on test data. Is this high bias or high variance? Under- or over-fitting?`,
    a: `<p>High variance, which is overfitting. The model memorized the training data instead of learning the general pattern.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-learning-theory",
  demo: function (host) {
    Demos.plot(host, {
      xmin: 1, xmax: 500, ymin: 0, ymax: 1.1,
      curves: [{ f: function (m) { return 1 / Math.sqrt(m); }, label: "gap ≈ 1/√m" }],
      drag: { curve: 0, start: 100, label: "sample size m",
        readout: function (m, gap) { return "Generalization gap (true error − training error) decays like 1/√m. At m = " + Math.round(m) + ": gap ≈ 1/√" + Math.round(m) + " = <b>" + gap.toFixed(4) + "</b>. The curve falls steeply at first, then flattens — more data helps, with diminishing returns."; } }
    });
  },
  title: "Learning theory (gentle)",
  tagline: "Why more data and simpler models generalize better.",
  prereqs: ["ml-bias-variance"],
  bigIdea:
    `<p><b>Learning theory</b> asks: when will good training performance carry over to new data?</p>
     <p>Training error is how often you are wrong on data you already saw.</p>
     <p>The danger: a model can score great on training and still flop on new data.</p>
     <p>Theory says: more data and simpler model classes make this gap small.</p>`,
  buildup:
    `<p>Training (empirical) error counts mistakes on the training set.</p>
     <p>The indicator $1\\{h(x^{(i)}) \\ne y^{(i)}\\}$ is $1$ when the prediction is wrong and $0$ when right.</p>
     <p>Average those over all examples to get the training error rate.</p>`,
  symbols: [
    { sym: "$\\hat\\epsilon(h)$", desc: "the training (empirical) error of hypothesis $h$ ('epsilon-hat'): the fraction of training examples it gets wrong." },
    { sym: "$1\\{\\cdot\\}$", desc: "the indicator: $1$ if the statement inside is true, $0$ if false." },
    { sym: "$h(x^{(i)}) \\ne y^{(i)}$", desc: "'the prediction does not equal the true label' — i.e. a mistake." },
    { sym: "VC dimension", desc: "a measure of how flexible a model class is. Higher = more flexible = needs more data." }
  ],
  formula: `$$ \\hat\\epsilon(h) = \\frac{1}{m}\\sum_{i=1}^{m} 1\\{h(x^{(i)}) \\ne y^{(i)}\\} $$`,
  whatItDoes:
    `<p>Go through the training examples. Add $1$ for each mistake, $0$ for each correct answer. Divide by $m$.</p>
     <p>That is the training error rate, between $0$ (perfect) and $1$ (always wrong).</p>
     <p>The theory: with more data ($m$ large) or a simpler class (low VC dimension), training error becomes a trustworthy estimate of true error.</p>`,
  example:
    `<p>A classifier is tested on $5$ training examples. It gets $4$ right and $1$ wrong.</p>
     <ul class="steps">
       <li>Indicators for the 5 examples: $0, 0, 1, 0, 0$ (one mistake).</li>
       <li>Sum: $0 + 0 + 1 + 0 + 0 = 1$.</li>
       <li>Divide by $m = 5$: $\\hat\\epsilon = 1/5 = 0.2$.</li>
       <li>So the training error is $20\\%$. With more data, this number better reflects true performance.</li>
     </ul>`,
  application:
    `<p>Learning theory guides practical choices: collect more data, prefer simpler models, and never trust training accuracy alone. It explains why huge models still need huge datasets to generalize.</p>`,
  quiz: {
    q: `A model gets $3$ wrong out of $20$ training examples. What is its training error $\\hat\\epsilon$?`,
    a: `<p>$\\hat\\epsilon = 3 / 20 = 0.15$, i.e. a $15\\%$ training error.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-kmeans",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var palette = ["#4ea1ff", "#7ee787", "#ffb454"];
    var K = 3, lo = 0, hi = 10;
    // 3 true blobs; deterministic-ish pseudo-random so a fresh seed regenerates points
    var seed = 12345;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    var pts = [], cents = [], step = 0;   // step: 0 start, then alternating assign/update

    function genPoints() {
      pts = [];
      var blobs = [{ x: 2.5, y: 7.5 }, { x: 7.5, y: 7.0 }, { x: 5.0, y: 2.5 }];
      blobs.forEach(function (b) {
        for (var i = 0; i < 9; i++) {
          pts.push({ x: Math.max(lo, Math.min(hi, b.x + (rnd() - 0.5) * 3)),
                     y: Math.max(lo, Math.min(hi, b.y + (rnd() - 0.5) * 3)), c: -1 });
        }
      });
    }
    function genCentroids() {
      cents = [];
      for (var i = 0; i < K; i++) cents.push({ x: lo + rnd() * (hi - lo), y: lo + rnd() * (hi - lo) });
    }
    function reset() { seed = (Date.now() % 100000) + 7; genPoints(); genCentroids(); step = 0; render(); }

    // Euclidean distance — ml-matrix Matrix.sub + norm if present, plain JS fallback
    function dist2(p, c) {
      if (window.mlMatrix) {
        try {
          var d = new window.mlMatrix.Matrix([[p.x, p.y]]).sub(new window.mlMatrix.Matrix([[c.x, c.y]]));
          var n = d.norm();   // Frobenius norm of the difference row
          return n * n;
        } catch (e) { /* fall through */ }
      }
      var dx = p.x - c.x, dy = p.y - c.y; return dx * dx + dy * dy;
    }
    function assign() {
      pts.forEach(function (p) {
        var best = 0, bd = Infinity;
        cents.forEach(function (c, i) { var d = dist2(p, c); if (d < bd) { bd = d; best = i; } });
        p.c = best;
      });
    }
    function update() {
      cents.forEach(function (c, i) {
        // centroid = mean of its assigned points — ml-matrix column means if present
        var rows = [];
        pts.forEach(function (p) { if (p.c === i) rows.push([p.x, p.y]); });
        if (!rows.length) return;
        if (window.mlMatrix) {
          try {
            var m = new window.mlMatrix.Matrix(rows).mean("column");
            c.x = m[0]; c.y = m[1]; return;
          } catch (e) { /* fall through */ }
        }
        var sx = 0, sy = 0; rows.forEach(function (r) { sx += r[0]; sy += r[1]; });
        c.x = sx / rows.length; c.y = sy / rows.length;
      });
    }
    function distortion() {
      var s = 0; pts.forEach(function (p) { if (p.c >= 0) s += dist2(p, cents[p.c]); }); return s;
    }

    var cv = document.createElement("canvas"); cv.width = 480; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var pad = 30, W = 480, H = 360;
    function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
    function PY(y) { return (H - pad) - (y - lo) / (hi - lo) * (H - 2 * pad); }

    function render() {
      var col = C(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
      // points, colored by cluster (gray = unassigned BEFORE first assign)
      pts.forEach(function (p) {
        ctx.fillStyle = p.c >= 0 ? palette[p.c % palette.length] : col.dim;
        ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 5, 0, Math.PI * 2); ctx.fill();
      });
      // centroids (big ringed circles)
      cents.forEach(function (c, i) {
        ctx.fillStyle = palette[i % palette.length]; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(PX(c.x), PY(c.y), 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = col.ink; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("μ" + (i + 1), PX(c.x), PY(c.y) - 14);
      });
      ctx.textAlign = "left";
      var lib = window.mlMatrix ? "ml-matrix (means + distances)" : "plain-JS fallback";
      var phase = step === 0 ? "Start: random centroids, points uncolored."
        : (step % 2 === 1 ? "After Assign: each point took its nearest centroid's color."
                          : "After Update: centroids jumped to their cluster means.");
      readout.innerHTML = "<b>" + phase + "</b> Computing with " + lib + ".<br>" +
        "Click <b>1) Assign points</b> then <b>2) Update centroids</b>, repeating; distortion (total squared distance) only drops. " +
        (step > 0 ? "Distortion = <b>" + distortion().toFixed(2) + "</b>. " : "") +
        "Press <b>Reset</b> for fresh points and random centroids.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var bA = document.createElement("button"), bU = document.createElement("button"), bR = document.createElement("button");
    bA.textContent = "1) Assign points"; bU.textContent = "2) Update centroids"; bR.textContent = "Reset";
    [bA, bU, bR].forEach(function (b) { b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;margin:0 8px 0 0;cursor:pointer;font-size:13px"; });
    bA.addEventListener("click", function () { assign(); step = (step % 2 === 1) ? step : step + 1; render(); });
    bU.addEventListener("click", function () { update(); step = step + 1; render(); });
    bR.addEventListener("click", reset);
    row.appendChild(bA); row.appendChild(bU); row.appendChild(bR); host.appendChild(row);

    genPoints(); genCentroids(); render();
  },
  title: "k-means clustering",
  tagline: "Group unlabeled points into k clusters around moving centers.",
  prereqs: ["fnd-norm", "fnd-vector"],
  bigIdea:
    `<p>Sometimes data has no labels. We want to find natural groups anyway. That is <b>clustering</b>.</p>
     <p><b>k-means</b> finds $k$ groups, each with a center called a <b>centroid</b>.</p>
     <p>Step 1: assign each point to its nearest centroid.</p>
     <p>Step 2: move each centroid to the average of its points. Repeat until nothing moves.</p>`,
  buildup:
    `<p>Pick $k$, the number of clusters. Start with $k$ random centroids.</p>
     <p>"Nearest" uses the L2 distance $\\lVert x^{(i)} - \\mu_j\\rVert$.</p>
     <p>The two steps repeat: assign, then update centers, then assign again.</p>`,
  symbols: [
    { sym: "$k$", desc: "the number of clusters you want." },
    { sym: "$\\mu_j$", desc: "the centroid (center) of cluster $j$ ('mu'). It is the mean of the cluster's points." },
    { sym: "$c^{(i)}$", desc: "the cluster assigned to point $i$ — the index of its nearest centroid." },
    { sym: "$\\arg\\min_j$", desc: "'the cluster index $j$ that makes the following smallest'." }
  ],
  formula: `$$ c^{(i)} = \\arg\\min_{j}\\, \\lVert x^{(i)} - \\mu_j\\rVert^2 \\qquad\\text{then}\\qquad \\mu_j = \\text{mean of points with } c^{(i)} = j $$`,
  whatItDoes:
    `<p>Assignment step: for each point, find the closest centroid and join its cluster.</p>
     <p>Update step: for each cluster, recompute the centroid as the average of its current points.</p>
     <p>Loop these two steps. Each round lowers the total distance; it settles to a stable answer.</p>`,
  example:
    `<p>1D points: $1, 2, 9, 10$. Use $k = 2$. Start centroids at $\\mu_1 = 1$, $\\mu_2 = 10$.</p>
     <ul class="steps">
       <li>Assign: $1, 2$ are closer to $\\mu_1$; $9, 10$ are closer to $\\mu_2$.</li>
       <li>Update $\\mu_1$ = mean$(1, 2) = 1.5$. Update $\\mu_2$ = mean$(9, 10) = 9.5$.</li>
       <li>Reassign: same two groups. Nothing changes.</li>
       <li>Done. Clusters are $\\{1, 2\\}$ and $\\{9, 10\\}$, centered at $1.5$ and $9.5$.</li>
     </ul>`,
  application:
    `<p>k-means segments customers into groups, compresses image colors, and organizes documents by topic, all without labels. It is the go-to first step for exploring unlabeled data.</p>`,
  quiz: {
    q: `A cluster contains the points $4, 6, 8$. After the update step, where does its centroid move?`,
    a: `<p>To their mean: $(4 + 6 + 8) / 3 = 18 / 3 = 6$. The centroid moves to $6$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-em",
  demo: function (host) {
    Demos.calc(host, {
      bars: true,
      inputs: [
        { key: "la", label: "likelihood L_A", min: 0.01, max: 1, val: 0.3, step: 0.01 },
        { key: "lb", label: "likelihood L_B", min: 0.01, max: 1, val: 0.1, step: 0.01 },
        { key: "w", label: "mixing weight w (for A)", min: 0.01, max: 0.99, val: 0.5, step: 0.01 }
      ],
      compute: function (s) {
        var a = s.w * s.la, b = (1 - s.w) * s.lb;
        var total = a + b;
        var rA = a / total, rB = b / total;
        return {
          text: "Responsibility = w·L / Σ (soft assignment). To A: " + s.w.toFixed(2) + "·" + s.la.toFixed(2) + " = " + a.toFixed(4) + "; to B: " + (1 - s.w).toFixed(2) + "·" + s.lb.toFixed(2) + " = " + b.toFixed(4) + ". Normalized: r_A = <b>" + rA.toFixed(3) + "</b>, r_B = <b>" + rB.toFixed(3) + "</b> (sum to 1).",
          bars: [{ label: "r_A", val: rA }, { label: "r_B", val: rB }],
          max: 1
        };
      }
    });
  },
  title: "Expectation-Maximization (gentle)",
  tagline: "Soft clustering when each point partly belongs to several groups.",
  prereqs: ["ml-kmeans", "prob-bayes", "prob-normal"],
  bigIdea:
    `<p>k-means gives each point to exactly one cluster. <b>EM</b> lets a point partly belong to several.</p>
     <p>Each point gets a <b>responsibility</b>: the chance it came from each cluster.</p>
     <p>The cluster labels are hidden, so we guess them and refine, back and forth.</p>
     <p>This is soft clustering, often with a <b>mixture of Gaussians</b> (several bell curves).</p>`,
  buildup:
    `<p>If we knew the labels, fitting bell curves would be easy. If we knew the curves, guessing labels would be easy. We know neither.</p>
     <p><b>E-step</b>: using the current curves, compute each point's responsibility to each cluster.</p>
     <p><b>M-step</b>: using those responsibilities, update each curve's center and spread.</p>`,
  symbols: [
    { sym: "$z$", desc: "the hidden cluster label of a point (which Gaussian it came from)." },
    { sym: "$Q_i(z)$", desc: "the responsibility: the probability point $i$ belongs to cluster $z$, given the current model." },
    { sym: "$P(z \\mid x; \\theta)$", desc: "that same probability, written out: cluster given the point under parameters $\\theta$." },
    { sym: "$\\theta$", desc: "the model parameters: the means, spreads, and mixing weights of the Gaussians." }
  ],
  formula: `$$ \\textbf{E-step: } Q_i(z) = P(z \\mid x^{(i)}; \\theta) \\qquad \\textbf{M-step: } \\text{update } \\theta \\text{ using the } Q_i(z) $$`,
  whatItDoes:
    `<p>E-step: for each point, ask how likely each cluster produced it. These soft memberships are the responsibilities.</p>
     <p>M-step: re-estimate each cluster's center and spread, weighting points by their responsibilities.</p>
     <p>Repeat. The fit improves each round until it stops changing.</p>`,
  example:
    `<p>Two Gaussians. A point sits between them. How does the E-step share it?</p>
     <ul class="steps">
       <li>Cluster A's curve gives the point a density of $0.3$. Cluster B gives $0.1$.</li>
       <li>Total: $0.3 + 0.1 = 0.4$.</li>
       <li>Responsibility to A: $0.3 / 0.4 = 0.75$. To B: $0.1 / 0.4 = 0.25$.</li>
       <li>So the point is $75\\%$ cluster A, $25\\%$ cluster B — a soft, not hard, assignment.</li>
     </ul>`,
  application:
    `<p>EM with mixtures of Gaussians models speaker voices, customer segments with overlap, and fills in missing data. It is the standard tool whenever some labels or variables are hidden.</p>`,
  quiz: {
    q: `In the E-step, a point gets density $0.6$ from cluster A and $0.2$ from cluster B. What is its responsibility to cluster A?`,
    a: `<p>$0.6 / (0.6 + 0.2) = 0.6 / 0.8 = 0.75$. The point is $75\\%$ assigned to cluster A.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-hierarchical",
  demo: function (host) {
    Demos.calc(host, {
      bars: true,
      inputs: [
        { key: "d1", label: "pair distance d₁", min: 0, max: 10, val: 2, step: 0.1 },
        { key: "d2", label: "pair distance d₂", min: 0, max: 10, val: 5, step: 0.1 },
        { key: "d3", label: "pair distance d₃", min: 0, max: 10, val: 8, step: 0.1 }
      ],
      compute: function (s) {
        var single = Math.min(s.d1, s.d2, s.d3);
        var complete = Math.max(s.d1, s.d2, s.d3);
        var avg = (s.d1 + s.d2 + s.d3) / 3;
        return {
          text: "Cluster distance from the cross-pair distances " + s.d1.toFixed(1) + ", " + s.d2.toFixed(1) + ", " + s.d3.toFixed(1) + ": <br>Single = min = <b>" + single.toFixed(2) + "</b>. Complete = max = <b>" + complete.toFixed(2) + "</b>. Average = mean = <b>" + avg.toFixed(2) + "</b>.",
          bars: [{ label: "single (min)", val: single }, { label: "average (mean)", val: avg }, { label: "complete (max)", val: complete }]
        };
      }
    });
  },
  title: "Hierarchical clustering",
  tagline: "Merge the closest groups, over and over, into a tree of clusters.",
  prereqs: ["ml-kmeans", "fnd-norm"],
  bigIdea:
    `<p><b>Hierarchical clustering</b> builds a tree of nested groups.</p>
     <p>The common bottom-up style is called <b>agglomerative</b>.</p>
     <p>Start with every point as its own tiny cluster.</p>
     <p>Repeatedly merge the two closest clusters until just one remains.</p>`,
  buildup:
    `<p>You do not pick $k$ up front. Instead you build the whole tree, then cut it at any level.</p>
     <p>"Closest" needs a rule for distance between groups, called a <b>linkage</b>.</p>
     <p>Common linkages: single (closest pair), complete (farthest pair), average (mean distance), and ward (smallest variance increase).</p>`,
  symbols: [
    { sym: "agglomerative", desc: "bottom-up: start with singletons and merge upward." },
    { sym: "linkage", desc: "the rule for how far apart two clusters are." },
    { sym: "dendrogram", desc: "the tree diagram showing the order and height of merges." },
    { sym: "ward / average / complete", desc: "popular linkage choices; ward merges to keep clusters tight." }
  ],
  formula: `$$ \\text{merge the two clusters } A, B \\text{ with the smallest } d(A, B) \\text{, then repeat} $$`,
  whatItDoes:
    `<p>Compute distances between all current clusters. Find the closest pair. Merge them into one.</p>
     <p>Repeat until everything is in a single cluster. Record each merge to draw the dendrogram.</p>
     <p>Cut the tree at a chosen height to get however many clusters you want.</p>`,
  example:
    `<p>Points $A = 1$, $B = 2$, $C = 9$ on a line. Use single linkage (closest pair).</p>
     <ul class="steps">
       <li>Distances: $A$-$B = 1$, $B$-$C = 7$, $A$-$C = 8$.</li>
       <li>Smallest is $A$-$B = 1$. Merge $A$ and $B$ into one cluster $\\{A, B\\}$.</li>
       <li>Now distance $\\{A,B\\}$-$C$ is $|2 - 9| = 7$ (closest member). Merge them.</li>
       <li>The tree: first $\\{A,B\\}$, then everything. Cut low for 2 clusters, high for 1.</li>
     </ul>`,
  application:
    `<p>Hierarchical clustering groups genes, organizes documents, and builds taxonomies. Its dendrogram is loved in biology because it shows structure at every level of detail.</p>`,
  quiz: {
    q: `In agglomerative clustering, how many clusters do you start with if you have $6$ data points?`,
    a: `<p>$6$. Every point begins as its own cluster, then they merge upward one pair at a time.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-pca",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var P = [
      { x: 1, y: 1.2 }, { x: 2, y: 1.8 }, { x: 3, y: 3.3 }, { x: 4, y: 3.8 },
      { x: 5, y: 5.4 }, { x: 6, y: 5.8 }, { x: 2.5, y: 3.0 }, { x: 4.5, y: 4.2 }
    ];
    var mx = 0, my = 0; P.forEach(function (p) { mx += p.x; my += p.y; }); mx /= P.length; my /= P.length;
    // covariance matrix Sigma = (1/n) X_c^T X_c
    var sxx = 0, sxy = 0, syy = 0;
    P.forEach(function (p) { var dx = p.x - mx, dy = p.y - my; sxx += dx * dx; sxy += dx * dy; syy += dy * dy; });
    var n = P.length; sxx /= n; sxy /= n; syy /= n;

    // eigen-decomposition of the 2x2 covariance — ml-matrix if present, analytic fallback
    var l1, l2, v1x, v1y;
    function analyticEig() {
      var tr = sxx + syy, det = sxx * syy - sxy * sxy;
      var disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
      l1 = tr / 2 + disc; l2 = tr / 2 - disc;
      v1x = sxy; v1y = l1 - sxx; var vl = Math.sqrt(v1x * v1x + v1y * v1y);
      if (vl < 1e-9) { v1x = 1; v1y = 0; vl = 1; }
      v1x /= vl; v1y /= vl;
    }
    var usedLib = false;
    if (window.mlMatrix && window.mlMatrix.EigenvalueDecomposition) {
      try {
        var eig = new window.mlMatrix.EigenvalueDecomposition(new window.mlMatrix.Matrix([[sxx, sxy], [sxy, syy]]));
        var ev = eig.realEigenvalues, V = eig.eigenvectorMatrix;
        // pick the largest eigenvalue as PC1
        var top = ev[0] >= ev[1] ? 0 : 1, bot = 1 - top;
        l1 = ev[top]; l2 = ev[bot];
        v1x = V.get(0, top); v1y = V.get(1, top);
        var vl = Math.sqrt(v1x * v1x + v1y * v1y); if (vl < 1e-9) { v1x = 1; v1y = 0; vl = 1; }
        v1x /= vl; v1y /= vl; usedLib = true;
      } catch (e) { analyticEig(); }
    } else { analyticEig(); }
    var v2x = -v1y, v2y = v1x;        // PC2 orthogonal to PC1
    var varExp = (l1 + l2) > 0 ? l1 / (l1 + l2) : 1;
    var len1 = Math.sqrt(Math.max(l1, 0.0001)) * 2.2, len2 = Math.sqrt(Math.max(l2, 0.0001)) * 2.2;

    var showAfter = false;
    var cv = document.createElement("canvas"); cv.width = 420; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var pad = 36, W = 420, H = 320, lo = -4, hi = 7;
    function PX(x) { return pad + (x - lo) / (hi - lo) * (W - 2 * pad); }
    function PY(y) { return (H - pad) - (y - lo) / (hi - lo) * (H - 2 * pad); }

    function renderBefore(col) {
      // original x/y axes
      ctx.strokeStyle = col.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PX(lo), PY(0)); ctx.lineTo(PX(hi), PY(0)); ctx.moveTo(PX(0), PY(lo)); ctx.lineTo(PX(0), PY(hi)); ctx.stroke();
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("x", PX(hi) - 12, PY(0) - 6); ctx.fillText("y", PX(0) + 6, PY(hi) + 12);
      // PC axes overlaid on the raw cloud
      ctx.strokeStyle = col.warn; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(PX(mx - v1x * len1), PY(my - v1y * len1)); ctx.lineTo(PX(mx + v1x * len1), PY(my + v1y * len1)); ctx.stroke();
      ctx.strokeStyle = col.purple; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(PX(mx - v2x * len2), PY(my - v2y * len2)); ctx.lineTo(PX(mx + v2x * len2), PY(my + v2y * len2)); ctx.stroke();
      P.forEach(function (p) {
        ctx.fillStyle = col.accent; ctx.beginPath(); ctx.arc(PX(p.x), PY(p.y), 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke();
      });
      ctx.fillStyle = col.warn; ctx.textAlign = "right";
      ctx.fillText("PC1", PX(mx + v1x * len1) - 6, PY(my + v1y * len1) - 8);
      ctx.fillStyle = col.purple; ctx.textAlign = "left";
      ctx.fillText("PC2", PX(mx + v2x * len2) + 4, PY(my + v2y * len2));
    }
    function renderAfter(col) {
      // rotated frame: new axes are PC1 (horizontal) and PC2 (vertical), through the mean
      ctx.strokeStyle = col.warn; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(PX(lo), PY(0)); ctx.lineTo(PX(hi), PY(0)); ctx.stroke();
      ctx.strokeStyle = col.purple; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(PX(0), PY(lo)); ctx.lineTo(PX(0), PY(hi)); ctx.stroke();
      ctx.fillStyle = col.warn; ctx.font = "12px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("PC1", PX(hi) - 6, PY(0) - 6);
      ctx.fillStyle = col.purple; ctx.textAlign = "left";
      ctx.fillText("PC2", PX(0) + 6, PY(hi) + 12);
      // project each centered point onto (PC1, PC2) — the rotated coordinates
      P.forEach(function (p) {
        var dx = p.x - mx, dy = p.y - my;
        var c1 = dx * v1x + dy * v1y;   // coordinate along PC1
        var c2 = dx * v2x + dy * v2y;   // coordinate along PC2
        // drop-line to the PC1 axis to show "keep PC1, throw PC2"
        ctx.strokeStyle = col.dim + "88"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(PX(c1), PY(c2)); ctx.lineTo(PX(c1), PY(0)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = col.accent; ctx.beginPath(); ctx.arc(PX(c1), PY(c2), 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(PX(c1), PY(0), 3, 0, Math.PI * 2); ctx.fill();
      });
    }

    function render() {
      var col = C(); ctx.clearRect(0, 0, W, H);
      if (showAfter) renderAfter(col); else renderBefore(col);
      var src = usedLib ? "ml-matrix EigenvalueDecomposition" : "analytic 2×2 eigen-solver";
      var head = showAfter
        ? "<b>AFTER:</b> data rotated onto its principal components. Orange axis = PC1, purple = PC2. Orange dots on the PC1 axis are the 1-D projection — keep PC1, drop PC2."
        : "<b>BEFORE:</b> raw correlated cloud on the original x/y axes, with PC1 (orange) and PC2 (purple) drawn through the mean.";
      readout.innerHTML = head + "<br>Covariance eigenvalues (" + src + "): λ₁ = " + l1.toFixed(2) + ", λ₂ = " + l2.toFixed(2) +
        " → PC1 explains <b>" + (varExp * 100).toFixed(1) + "%</b> of the variance. Toggle to compare.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var bT = document.createElement("button");
    bT.textContent = "Show AFTER (rotate onto PCs)";
    bT.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px";
    bT.addEventListener("click", function () { showAfter = !showAfter; bT.textContent = showAfter ? "Show BEFORE (raw cloud)" : "Show AFTER (rotate onto PCs)"; render(); });
    row.appendChild(bT); host.appendChild(row);
    render();
  },
  title: "Principal component analysis (PCA)",
  tagline: "Find the directions of most spread. Keep them, drop the rest.",
  prereqs: ["fnd-eigen", "fnd-norm"],
  bigIdea:
    `<p>Data with many features is hard to see and slow to process.</p>
     <p><b>PCA</b> finds the few directions where the data spreads out the most.</p>
     <p>These directions are the <b>principal components</b>.</p>
     <p>Project the data onto the top few. You shrink the dimensions while keeping most of the variation.</p>`,
  buildup:
    `<p>First normalize the features so they share a scale.</p>
     <p>Build the <b>covariance matrix</b> $\\Sigma$: it captures how the features vary together.</p>
     <p>Its top eigenvectors are the directions of greatest spread (from the eigen lesson). Keep the top $k$.</p>`,
  symbols: [
    { sym: "$\\Sigma$", desc: "the covariance matrix ('Sigma'): summarizes how features spread and co-vary." },
    { sym: "$x^{(i)} x^{(i)\\top}$", desc: "the outer product of an example with itself; averaging these builds $\\Sigma$." },
    { sym: "eigenvector", desc: "a principal direction; top ones carry the most variance." },
    { sym: "eigenvalue", desc: "how much variance lies along its eigenvector. Bigger = more spread." }
  ],
  formula: `$$ \\Sigma = \\frac{1}{m}\\sum_{i=1}^{m} x^{(i)} x^{(i)\\top} \\qquad\\Rightarrow\\qquad \\text{keep top-}k \\text{ eigenvectors of } \\Sigma $$`,
  whatItDoes:
    `<p>Normalize the data so no feature dominates just because of its units.</p>
     <p>Compute $\\Sigma$ to see how the features vary together.</p>
     <p>Take its top $k$ eigenvectors — the directions of greatest spread — and project the data onto them. Done.</p>`,
  example:
    `<p>Data sits roughly along a diagonal line in 2D. PCA should find that diagonal.</p>
     <ul class="steps">
       <li>The covariance matrix comes out to $\\Sigma = \\begin{bmatrix}2 & 1.8 \\\\ 1.8 & 2\\end{bmatrix}$. For this symmetric $2\\times2$, the eigenvalues are $\\lambda = 2 \\pm 1.8$.</li>
       <li>So $\\lambda_1 = 2 + 1.8 = \\mathbf{3.8}$ along $[1, 1]$ (the diagonal), and $\\lambda_2 = 2 - 1.8 = \\mathbf{0.2}$ along $[1, -1]$.</li>
       <li>Variance captured by PC1: $\\dfrac{\\lambda_1}{\\lambda_1 + \\lambda_2} = \\dfrac{3.8}{4.0} = \\mathbf{95\\%}$. PC2 holds just $5\\%$.</li>
       <li>Punchline: keep only $[1, 1]$ and 2D collapses to 1D, yet $95\\%$ of the spread survives — almost lossless compression.</li>
     </ul>`,
  application:
    `<p>PCA compresses images, speeds up models by cutting features, removes noise, and makes high-dimensional data visualizable in 2D. It is the classic dimensionality-reduction tool.</p>`,
  quiz: {
    q: `PCA keeps the eigenvectors with the largest eigenvalues. What do those eigenvalues represent?`,
    a: `<p>The amount of variance (spread) of the data along each direction. A large eigenvalue means the data spreads a lot that way, so it is worth keeping.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-ica",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    // two independent source waveforms sampled over time
    var N = 160;
    var s1 = [], s2 = [];
    for (var i = 0; i < N; i++) {
      var t = i / N;
      s1.push(Math.sin(2 * Math.PI * 3 * t));                 // smooth sine wave
      s2.push(((t * 7) % 1) < 0.5 ? 1 : -1);                  // square wave
    }
    // mixing coefficients (sliders). A = [[a,b],[c,d]]
    var A = { a: 1.0, b: 0.7, c: 0.4, d: 1.0 };

    // 2x2 inverse — uses ml-matrix if present, else closed-form (fallback for Node harness)
    function invert(M) {
      if (window.mlMatrix) {
        try {
          var inv = window.mlMatrix.inverse(new window.mlMatrix.Matrix(M));
          return [[inv.get(0,0), inv.get(0,1)], [inv.get(1,0), inv.get(1,1)]];
        } catch (e) { /* fall through to plain JS */ }
      }
      var det = M[0][0]*M[1][1] - M[0][1]*M[1][0];
      if (Math.abs(det) < 1e-9) return null;
      return [[ M[1][1]/det, -M[0][1]/det], [-M[1][0]/det, M[0][0]/det]];
    }

    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

    function plot(col, x0, y0, w, h, data, color, label, sub) {
      ctx.strokeStyle = col.border; ctx.lineWidth = 1;
      ctx.strokeRect(x0, y0, w, h);
      ctx.strokeStyle = col.dim; ctx.setLineDash([2,3]);
      ctx.beginPath(); ctx.moveTo(x0, y0 + h/2); ctx.lineTo(x0 + w, y0 + h/2); ctx.stroke(); ctx.setLineDash([]);
      // auto-scale to data
      var mx = 0.0001; for (var k = 0; k < data.length; k++) mx = Math.max(mx, Math.abs(data[k]));
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
      for (var j = 0; j < data.length; j++) {
        var X = x0 + j / (data.length - 1) * w;
        var Y = y0 + h/2 - (data[j] / mx) * (h/2 - 4);
        j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      }
      ctx.stroke();
      ctx.fillStyle = color; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText(label, x0 + 4, y0 - 4);
      if (sub) { ctx.fillStyle = col.dim; ctx.fillText(sub, x0 + 70, y0 - 4); }
    }

    function render() {
      var col = C(); ctx.clearRect(0, 0, 640, 360);
      // mix:  x = A s
      var x1 = [], x2 = [];
      for (var i = 0; i < N; i++) {
        x1.push(A.a * s1[i] + A.b * s2[i]);
        x2.push(A.c * s1[i] + A.d * s2[i]);
      }
      // recover: s_hat = A^-1 x
      var W = invert([[A.a, A.b], [A.c, A.d]]);
      var r1 = [], r2 = [];
      if (W) {
        for (var j = 0; j < N; j++) {
          r1.push(W[0][0] * x1[j] + W[0][1] * x2[j]);
          r2.push(W[1][0] * x1[j] + W[1][1] * x2[j]);
        }
      } else {
        for (var k = 0; k < N; k++) { r1.push(0); r2.push(0); }
      }
      // layout: left column = SOURCES, middle = MIXED (before), right = RECOVERED (after)
      var pw = 180, ph = 120, gap = 30, top1 = 28, top2 = 200;
      ctx.fillStyle = col.ink; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("MIXED (what the 2 mics hear)", 320, 14);
      ctx.fillText("RECOVERED  ŝ = A⁻¹ x  (after)", 320, 186);
      ctx.textAlign = "left";
      // originals (small reference, left)
      plot(col, 20, top1, pw, ph, s1, col.accent, "source s₁", "sine");
      plot(col, 20, top2, pw, ph, s2, col.accent2, "source s₂", "square");
      // mixed (before) middle
      plot(col, 230, top1, pw, ph, x1, col.warn, "mic x₁", "");
      plot(col, 230, top2, pw, ph, x2, col.warn, "mic x₂", "");
      // recovered (after) right
      plot(col, 440, top1, pw, ph, r1, col.purple, "ŝ₁", "");
      plot(col, 440, top2, pw, ph, r2, col.purple, "ŝ₂", "");

      // how well did recovery match a source? (ICA recovers up to scale/sign/order)
      function corr(p, q) {
        var mp = 0, mq = 0, n = p.length;
        for (var a = 0; a < n; a++) { mp += p[a]; mq += q[a]; } mp /= n; mq /= n;
        var sp = 0, sq = 0, sc = 0;
        for (var b = 0; b < n; b++) { var dp = p[b]-mp, dq = q[b]-mq; sp += dp*dp; sq += dq*dq; sc += dp*dq; }
        var den = Math.sqrt(sp * sq);
        return den < 1e-9 ? 0 : Math.abs(sc / den);
      }
      var fit = Math.max(corr(r1, s1), corr(r1, s2));
      var det = A.a*A.d - A.b*A.c;
      var lib = window.mlMatrix ? "ml-matrix" : "plain-JS";
      readout.innerHTML = W
        ? "Mixing A = [[" + A.a.toFixed(2) + ", " + A.b.toFixed(2) + "], [" + A.c.toFixed(2) + ", " + A.d.toFixed(2) + "]], det = " + det.toFixed(3) +
          ". Recovered ŝ = A⁻¹x (inverse via " + lib + "). The purple waves match the clean sources on the left — recovery quality |corr| = <b>" + fit.toFixed(3) + "</b> (1.0 = perfect)."
        : "A is singular (det ≈ 0): the two mics heard the same blend, so the mix can't be undone. Move a slider so det ≠ 0.";
    }

    function mkSlider(label, key, val) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " ";
      var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = val.toFixed(2); lab.appendChild(span);
      var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = -2; inp.max = 2; inp.step = 0.05; inp.value = val;
      inp.addEventListener("input", function () { A[key] = parseFloat(inp.value); span.textContent = A[key].toFixed(2); render(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    mkSlider("mix A₁₁ (s₁→mic1)", "a", A.a);
    mkSlider("mix A₁₂ (s₂→mic1)", "b", A.b);
    mkSlider("mix A₂₁ (s₁→mic2)", "c", A.c);
    mkSlider("mix A₂₂ (s₂→mic2)", "d", A.d);
    render();
  },
  title: "Independent component analysis (ICA)",
  tagline: "Unmix blended signals back into their separate sources.",
  prereqs: ["ml-pca"],
  bigIdea:
    `<p>Imagine two people talking and two microphones. Each mic hears a mix of both voices.</p>
     <p>This is the <b>cocktail party problem</b>. We want the separate voices back.</p>
     <p><b>ICA</b> assumes the original sources are independent and finds a way to unmix them.</p>
     <p>Unlike PCA (which finds spread), ICA finds statistically independent signals.</p>`,
  buildup:
    `<p>The recordings $x$ are a mix of the true sources $s$, blended by an unknown mixing matrix $A$: $x = As$.</p>
     <p>To undo the mixing, we need the inverse, $W = A^{-1}$.</p>
     <p>ICA searches for the $W$ that makes the recovered signals $Wx$ as independent as possible.</p>`,
  symbols: [
    { sym: "$s$", desc: "the original independent sources (the separate voices)." },
    { sym: "$A$", desc: "the unknown mixing matrix: how the sources got blended." },
    { sym: "$x$", desc: "the observed recordings, $x = As$ (what the mics heard)." },
    { sym: "$W = A^{-1}$", desc: "the unmixing matrix: applying it to $x$ recovers the sources." }
  ],
  formula: `$$ x = A\\,s \\qquad\\Rightarrow\\qquad s = W x \\quad\\text{with}\\quad W = A^{-1} $$`,
  whatItDoes:
    `<p>The recordings are a known mix of unknown sources. We do not know $A$ or $s$.</p>
     <p>ICA finds an unmixing matrix $W$ so that the outputs $Wx$ look independent.</p>
     <p>When the outputs are maximally independent, they match the original sources (up to order and scale).</p>`,
  example:
    `<p>Two sources $s = [s_1, s_2]$ get mixed by $A = \\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>Recordings: $x_1 = s_1 + s_2$, $x_2 = s_2$.</li>
       <li>To recover the sources, invert: $W = A^{-1} = \\begin{bmatrix}1 & -1 \\\\ 0 & 1\\end{bmatrix}$.</li>
       <li>Apply $W$: $s_1 = x_1 - x_2$, $s_2 = x_2$. The voices are unmixed.</li>
       <li>ICA's job is to discover this $W$ from the data alone, without being told $A$.</li>
     </ul>`,
  application:
    `<p>ICA separates brain signals in EEG, isolates instruments in audio, and cleans mixed sensor data. Anywhere independent signals get blended together, ICA can pull them apart.</p>`,
  quiz: {
    q: `In ICA, the recordings are $x = As$. If you find the unmixing matrix $W = A^{-1}$, how do you recover the sources $s$?`,
    a: `<p>Multiply the recordings by $W$: $s = Wx$. The inverse undoes the mixing.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-classification-metrics",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    // two gaussian score distributions: negatives centered low, positives centered high
    var N = 100; // per class
    var negMu = 0.35, posMu = 0.65, sd = 0.16;
    function gauss(x, mu) { var z = (x - mu) / sd; return Math.exp(-0.5 * z * z); }
    var thresh = 0.5;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 200; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var matC = document.createElement("canvas"); matC.width = 640; matC.height = 240; matC.style.maxWidth = "100%"; host.appendChild(matC);
    var mctx = matC.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

    function counts() {
      // areas (counts) of each distribution above/below threshold, scaled to N
      var stepN = 400, lo = 0, hi = 1, dx = (hi - lo) / stepN;
      var sumP = 0, sumN = 0; var i, x;
      for (i = 0; i < stepN; i++) { x = lo + (i + 0.5) * dx; sumP += gauss(x, posMu); sumN += gauss(x, negMu); }
      var tp = 0, fn = 0, fp = 0, tn = 0;
      for (i = 0; i < stepN; i++) {
        x = lo + (i + 0.5) * dx;
        var gp = gauss(x, posMu), gn = gauss(x, negMu);
        if (x >= thresh) { tp += gp; fp += gn; } else { fn += gp; tn += gn; }
      }
      tp = Math.round(N * tp / sumP); fn = N - tp;
      tn = Math.round(N * tn / sumN); fp = N - tn;
      return { tp: tp, fn: fn, fp: fp, tn: tn };
    }

    function drawDist() {
      var col = C(); ctx.clearRect(0, 0, 640, 200);
      var W = 640, H = 200, padL = 12, padR = 12, padT = 12, padB = 28;
      var x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
      function PX(x) { return x0 + x * (x1 - x0); }
      var peak = 1.0;
      function PY(v) { return y1 - (v / peak) * (y1 - y0); }
      // axis
      ctx.strokeStyle = col.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      // fill curves
      function curve(mu, color) {
        ctx.beginPath();
        var first = true, i, x;
        for (i = 0; i <= 200; i++) { x = i / 200; var Y = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Y); first = false; } else ctx.lineTo(PX(x), Y); }
        ctx.lineTo(PX(1), y1); ctx.lineTo(PX(0), y1); ctx.closePath();
        ctx.fillStyle = color + "33"; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
        first = true;
        for (i = 0; i <= 200; i++) { x = i / 200; var Yy = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Yy); first = false; } else ctx.lineTo(PX(x), Yy); }
        ctx.stroke();
      }
      curve(negMu, col.accent);   // negatives (blue)
      curve(posMu, col.accent2);  // positives (green)
      // threshold line
      var tx = PX(thresh);
      ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(tx, y0); ctx.lineTo(tx, y1); ctx.stroke();
      // handle
      ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(tx, y0 + 6, 6, 0, Math.PI * 2); ctx.fill();
      // labels
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("negatives", PX(0.05), y0 + 14);
      ctx.textAlign = "right";
      ctx.fillText("positives", PX(0.95), y0 + 14);
      ctx.textAlign = "center";
      ctx.fillStyle = col.warn; ctx.fillText("threshold = " + thresh.toFixed(2) + "  (drag)", tx, y1 + 18);
    }

    function cell(x, y, w, h, label, val, color, sub) {
      var col = C();
      mctx.fillStyle = color + "2a"; mctx.fillRect(x, y, w, h);
      mctx.strokeStyle = color; mctx.lineWidth = 2; mctx.strokeRect(x, y, w, h);
      mctx.textAlign = "center";
      mctx.fillStyle = col.dim; mctx.font = "12px sans-serif";
      mctx.fillText(label, x + w / 2, y + 20);
      mctx.fillStyle = col.ink; mctx.font = "bold 30px sans-serif";
      mctx.fillText(String(val), x + w / 2, y + h / 2 + 14);
      mctx.fillStyle = col.dim; mctx.font = "11px sans-serif";
      mctx.fillText(sub, x + w / 2, y + h - 10);
    }

    function drawMatrix(c) {
      var col = C(); mctx.clearRect(0, 0, 640, 240);
      var gx = 150, gy = 28, cw = 180, ch = 88, gap = 8;
      mctx.fillStyle = col.dim; mctx.font = "12px sans-serif"; mctx.textAlign = "center";
      mctx.fillText("predicted positive", gx + cw / 2, gy - 10);
      mctx.fillText("predicted negative", gx + cw + gap + cw / 2, gy - 10);
      mctx.save(); mctx.translate(gx - 24, gy + ch / 2); mctx.rotate(-Math.PI / 2); mctx.fillText("actual +", 0, 0); mctx.restore();
      mctx.save(); mctx.translate(gx - 24, gy + ch + gap + ch / 2); mctx.rotate(-Math.PI / 2); mctx.fillText("actual −", 0, 0); mctx.restore();
      // top row: actual positive
      cell(gx, gy, cw, ch, "True Positive", c.tp, "#7ee787", "correctly caught");
      cell(gx + cw + gap, gy, cw, ch, "False Negative", c.fn, "#ff6b6b", "missed positives");
      // bottom row: actual negative
      cell(gx, gy + ch + gap, cw, ch, "False Positive", c.fp, "#ff6b6b", "false alarms");
      cell(gx + cw + gap, gy + ch + gap, cw, ch, "True Negative", c.tn, "#7ee787", "correctly cleared");
    }

    function render() {
      var c = counts();
      drawDist(); drawMatrix(c);
      var prec = (c.tp + c.fp) > 0 ? c.tp / (c.tp + c.fp) : 0;
      var rec = (c.tp + c.fn) > 0 ? c.tp / (c.tp + c.fn) : 0;
      var f1 = (prec + rec) > 0 ? 2 * prec * rec / (prec + rec) : 0;
      var tot = c.tp + c.fp + c.fn + c.tn;
      var acc = tot > 0 ? (c.tp + c.tn) / tot : 0;
      readout.innerHTML = "Precision = TP/(TP+FP) = <b>" + prec.toFixed(3) + "</b> &nbsp; Recall = TP/(TP+FN) = <b>" + rec.toFixed(3) + "</b> &nbsp; F1 = <b>" + f1.toFixed(3) + "</b> &nbsp; Accuracy = <b>" + acc.toFixed(3) + "</b>.<br>Slide the threshold right: fewer false alarms (FP down) but more missed (FN up) — precision rises, recall falls.";
    }

    function setFromX(clientX) {
      var r = cv.getBoundingClientRect();
      var scale = cv.width / r.width;
      var x = (clientX - r.left) * scale;
      var t = (x - 12) / (640 - 24);
      thresh = Math.max(0.02, Math.min(0.98, t));
      render();
    }
    var dragging = false;
    cv.addEventListener("mousedown", function (e) { dragging = true; setFromX(e.clientX); });
    window.addEventListener("mousemove", function (e) { if (dragging) setFromX(e.clientX); });
    window.addEventListener("mouseup", function () { dragging = false; });
    cv.addEventListener("touchstart", function (e) { dragging = true; if (e.touches[0]) setFromX(e.touches[0].clientX); });
    cv.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) { setFromX(e.touches[0].clientX); e.preventDefault(); } });
    render();
  },
  title: "Confusion matrix & classification metrics",
  tagline: "Count the right and wrong predictions, then score the classifier.",
  prereqs: ["ml-logistic-regression"],
  bigIdea:
    `<p>Accuracy alone can lie, especially when one class is rare.</p>
     <p>A <b>confusion matrix</b> counts four outcomes: true/false positives and negatives.</p>
     <p>From those counts we build sharper scores: precision, recall, and F1.</p>
     <p>Each answers a different question about what kind of mistakes matter.</p>`,
  buildup:
    `<p>For a yes/no classifier, every prediction is one of four cases.</p>
     <p><b>TP</b>: predicted yes, was yes. <b>FP</b>: predicted yes, was no (false alarm). <b>FN</b>: predicted no, was yes (missed it). <b>TN</b>: predicted no, was no.</p>
     <p>Precision watches false alarms. Recall watches misses. F1 balances both.</p>`,
  symbols: [
    { sym: "TP, TN", desc: "true positives and true negatives: the correct predictions." },
    { sym: "FP", desc: "false positive: predicted yes but it was no (a false alarm)." },
    { sym: "FN", desc: "false negative: predicted no but it was yes (a miss)." },
    { sym: "precision", desc: "of the points you flagged as yes, how many really were yes." },
    { sym: "recall", desc: "of the real yes points, how many you caught." }
  ],
  formula: `$$ \\text{precision} = \\frac{TP}{TP + FP} \\quad\\ \\text{recall} = \\frac{TP}{TP + FN} \\quad\\ \\text{F1} = \\frac{2\\,TP}{2\\,TP + FP + FN} $$`,
  whatItDoes:
    `<p>Precision: of all your "yes" predictions, what fraction were correct. High precision = few false alarms.</p>
     <p>Recall: of all the actual "yes" cases, what fraction you found. High recall = few misses.</p>
     <p>F1 blends the two into one number (their harmonic mean), useful when you want both to be good.</p>`,
  example:
    `<p>A spam filter flags emails. Results: TP $= 80$, FP $= 20$, FN $= 10$, TN $= 90$.</p>
     <ul class="steps">
       <li>Precision: $\\dfrac{80}{80 + 20} = \\dfrac{80}{100} = 0.80$.</li>
       <li>Recall: $\\dfrac{80}{80 + 10} = \\dfrac{80}{90} \\approx 0.89$.</li>
       <li>F1: $\\dfrac{2 \\times 80}{2 \\times 80 + 20 + 10} = \\dfrac{160}{190} \\approx 0.84$.</li>
       <li>So it rarely cries wolf (precision $0.80$) and misses few spam (recall $0.89$).</li>
     </ul>`,
  application:
    `<p>In medical tests, recall matters most (don't miss a sick patient). In spam filtering, precision matters (don't trash real mail). The confusion matrix lets you tune for the cost you care about.</p>`,
  quiz: {
    q: `A classifier has TP $= 30$, FP $= 10$, FN $= 20$. What are its precision and recall?`,
    a: `<p>Precision $= 30 / (30 + 10) = 30/40 = 0.75$. Recall $= 30 / (30 + 20) = 30/50 = 0.60$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-roc-auc",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var negMu = 0.4, posMu = 0.6, sd = 0.15;
    function gauss(x, mu) { var z = (x - mu) / sd; return Math.exp(-0.5 * z * z); }
    // for a threshold t: TPR = P(score>=t | positive), FPR = P(score>=t | negative)
    function rates(t) {
      var stepN = 300, lo = -0.3, hi = 1.3, dx = (hi - lo) / stepN;
      var sumP = 0, sumN = 0, tp = 0, fp = 0, i, x;
      for (i = 0; i < stepN; i++) { x = lo + (i + 0.5) * dx; sumP += gauss(x, posMu); sumN += gauss(x, negMu); }
      for (i = 0; i < stepN; i++) { x = lo + (i + 0.5) * dx; if (x >= t) { tp += gauss(x, posMu); fp += gauss(x, negMu); } }
      return { tpr: sumP > 0 ? tp / sumP : 0, fpr: sumN > 0 ? fp / sumN : 0 };
    }
    // precompute ROC by sweeping threshold high->low so FPR increases
    var roc = [];
    for (var k = 0; k <= 120; k++) { var tt = 1.3 - (k / 120) * 1.6; var r = rates(tt); roc.push({ t: tt, fpr: r.fpr, tpr: r.tpr }); }
    // AUC by trapezoid over fpr
    var auc = 0;
    for (var j = 1; j < roc.length; j++) { auc += (roc[j].fpr - roc[j - 1].fpr) * (roc[j].tpr + roc[j - 1].tpr) / 2; }
    auc = Math.max(0, Math.min(1, auc));

    var thresh = 0.5;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 170; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var rc = document.createElement("canvas"); rc.width = 640; rc.height = 280; rc.style.maxWidth = "100%"; host.appendChild(rc);
    var rctx = rc.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);

    function drawDist() {
      var col = C(); ctx.clearRect(0, 0, 640, 170);
      var W = 640, H = 170, padL = 12, padR = 12, y0 = 12, y1 = H - 26;
      function PX(x) { return padL + x * (W - padL - padR); }
      function PY(v) { return y1 - v * (y1 - y0); }
      ctx.strokeStyle = col.border; ctx.beginPath(); ctx.moveTo(PX(0), y1); ctx.lineTo(PX(1), y1); ctx.stroke();
      function curve(mu, color) {
        ctx.beginPath(); var first = true, i, x;
        for (i = 0; i <= 200; i++) { x = i / 200; var Y = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Y); first = false; } else ctx.lineTo(PX(x), Y); }
        ctx.lineTo(PX(1), y1); ctx.lineTo(PX(0), y1); ctx.closePath(); ctx.fillStyle = color + "33"; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); first = true;
        for (i = 0; i <= 200; i++) { x = i / 200; var Yy = PY(gauss(x, mu)); if (first) { ctx.moveTo(PX(x), Yy); first = false; } else ctx.lineTo(PX(x), Yy); }
        ctx.stroke();
      }
      curve(negMu, col.accent); curve(posMu, col.accent2);
      var tx = PX(thresh);
      ctx.strokeStyle = col.warn; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, y0); ctx.lineTo(tx, y1); ctx.stroke();
      ctx.fillStyle = col.warn; ctx.beginPath(); ctx.arc(tx, y0 + 6, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("negatives", PX(0.02), y0 + 12); ctx.textAlign = "right"; ctx.fillText("positives", PX(0.98), y0 + 12);
      ctx.textAlign = "center"; ctx.fillStyle = col.warn; ctx.fillText("threshold (drag)", tx, y1 + 18);
    }

    function drawROC() {
      var col = C(); rctx.clearRect(0, 0, 640, 280);
      var padL = 50, padR = 20, padT = 16, padB = 36;
      var x0 = padL, x1 = 640 - padR, y0 = padT, y1 = 280 - padB;
      function PX(f) { return x0 + f * (x1 - x0); }
      function PY(t) { return y1 - t * (y1 - y0); }
      // shade AUC under curve
      rctx.beginPath(); rctx.moveTo(PX(0), PY(0));
      for (var i = 0; i < roc.length; i++) rctx.lineTo(PX(roc[i].fpr), PY(roc[i].tpr));
      rctx.lineTo(PX(1), PY(0)); rctx.closePath(); rctx.fillStyle = col.purple + "33"; rctx.fill();
      // diagonal
      rctx.strokeStyle = col.dim; rctx.setLineDash([4, 4]); rctx.lineWidth = 1;
      rctx.beginPath(); rctx.moveTo(PX(0), PY(0)); rctx.lineTo(PX(1), PY(1)); rctx.stroke(); rctx.setLineDash([]);
      // axes
      rctx.strokeStyle = col.border; rctx.lineWidth = 1;
      rctx.beginPath(); rctx.moveTo(x0, y0); rctx.lineTo(x0, y1); rctx.lineTo(x1, y1); rctx.stroke();
      // ROC curve
      rctx.strokeStyle = col.purple; rctx.lineWidth = 2.5; rctx.beginPath();
      for (var k = 0; k < roc.length; k++) { var X = PX(roc[k].fpr), Y = PY(roc[k].tpr); if (k === 0) rctx.moveTo(X, Y); else rctx.lineTo(X, Y); }
      rctx.stroke();
      // current point from threshold
      var cur = rates(thresh);
      var cx = PX(cur.fpr), cy = PY(cur.tpr);
      rctx.strokeStyle = col.warn; rctx.setLineDash([3, 3]); rctx.lineWidth = 1;
      rctx.beginPath(); rctx.moveTo(x0, cy); rctx.lineTo(cx, cy); rctx.lineTo(cx, y1); rctx.stroke(); rctx.setLineDash([]);
      rctx.fillStyle = col.warn; rctx.beginPath(); rctx.arc(cx, cy, 6, 0, Math.PI * 2); rctx.fill();
      // labels
      rctx.fillStyle = col.dim; rctx.font = "12px sans-serif"; rctx.textAlign = "center";
      rctx.fillText("FPR (false positive rate)", (x0 + x1) / 2, 280 - 10);
      rctx.save(); rctx.translate(14, (y0 + y1) / 2); rctx.rotate(-Math.PI / 2); rctx.fillText("TPR (recall)", 0, 0); rctx.restore();
      rctx.fillStyle = col.purple; rctx.font = "bold 13px sans-serif"; rctx.textAlign = "left";
      rctx.fillText("AUC = " + auc.toFixed(3), x0 + 12, y1 - 12);
      return cur;
    }

    function render() {
      drawDist(); var cur = drawROC();
      readout.innerHTML = "At this threshold: FPR = <b>" + cur.fpr.toFixed(3) + "</b>, TPR (recall) = <b>" + cur.tpr.toFixed(3) + "</b>. The orange dot is exactly this threshold's spot on the ROC curve. Drag the threshold left and the dot slides up-right (catch more, but more false alarms). AUC = <b>" + auc.toFixed(3) + "</b> = chance a random positive scores above a random negative (1.0 perfect, 0.5 = diagonal = random).";
    }
    function setFromX(clientX) {
      var r = cv.getBoundingClientRect(); var scale = cv.width / r.width;
      var x = (clientX - r.left) * scale; var t = (x - 12) / (640 - 24);
      thresh = Math.max(0.0, Math.min(1.0, t)); render();
    }
    var dragging = false;
    cv.addEventListener("mousedown", function (e) { dragging = true; setFromX(e.clientX); });
    window.addEventListener("mousemove", function (e) { if (dragging) setFromX(e.clientX); });
    window.addEventListener("mouseup", function () { dragging = false; });
    cv.addEventListener("touchstart", function (e) { dragging = true; if (e.touches[0]) setFromX(e.touches[0].clientX); });
    cv.addEventListener("touchmove", function (e) { if (dragging && e.touches[0]) { setFromX(e.touches[0].clientX); e.preventDefault(); } });
    render();
  },
  title: "ROC curve & AUC",
  tagline: "See how a classifier trades off catches against false alarms.",
  prereqs: ["ml-classification-metrics"],
  bigIdea:
    `<p>A classifier outputs a probability. A <b>threshold</b> turns it into yes/no.</p>
     <p>Move the threshold and the catches and false alarms change together.</p>
     <p>The <b>ROC curve</b> plots this tradeoff across all thresholds.</p>
     <p><b>AUC</b> is the area under that curve: a single score for overall quality.</p>`,
  buildup:
    `<p>The <b>true positive rate</b> (TPR, same as recall) is the fraction of real yes cases you catch.</p>
     <p>The <b>false positive rate</b> (FPR) is the fraction of real no cases you wrongly flag.</p>
     <p>The ROC curve plots TPR (up) against FPR (right) as the threshold slides from strict to loose.</p>`,
  symbols: [
    { sym: "threshold", desc: "the probability cutoff for saying 'yes'. Lower it to catch more (but more false alarms)." },
    { sym: "TPR", desc: "true positive rate $= \\dfrac{TP}{TP + FN}$, the same as recall (the y-axis)." },
    { sym: "FPR", desc: "false positive rate $= \\dfrac{FP}{FP + TN}$, the false-alarm rate (the x-axis)." },
    { sym: "AUC", desc: "area under the ROC curve, from $0$ to $1$. Higher is better." }
  ],
  formula: `$$ \\text{ROC: plot } \\text{TPR} = \\frac{TP}{TP+FN} \\ \\text{vs}\\ \\text{FPR} = \\frac{FP}{FP+TN}\\ \\text{as the threshold varies} $$`,
  whatItDoes:
    `<p>At a strict threshold, few alarms: low TPR, low FPR (bottom-left). At a loose threshold, many alarms: high TPR, high FPR (top-right).</p>
     <p>The curve traces all the in-between tradeoffs. A curve hugging the top-left corner is excellent.</p>
     <p>AUC sums it up: $1.0$ is perfect, $0.5$ is random guessing, below $0.5$ is worse than a coin flip.</p>`,
  example:
    `<p>Tiny dataset. Two positives score $0.9, 0.6$; two negatives score $0.7, 0.3$. AUC = fraction of positive–negative pairs the model ranks correctly.</p>
     <ul class="steps">
       <li>There are $2 \\times 2 = 4$ pairs. Check each (positive should outrank negative):</li>
       <li>$0.9 &gt; 0.7$ ✓, &nbsp; $0.9 &gt; 0.3$ ✓, &nbsp; $0.6 &lt; 0.7$ ✗, &nbsp; $0.6 &gt; 0.3$ ✓.</li>
       <li>Correct pairs: $3$ of $4$, so AUC $= 3/4 = \\mathbf{0.75}$.</li>
       <li>Punchline: AUC $= 0.75$ literally means a random positive outranks a random negative $75\\%$ of the time — no threshold needed. ($1.0$ = perfect, $0.5$ = coin flip.)</li>
     </ul>`,
  application:
    `<p>AUC compares classifiers without fixing a threshold first, which is handy when the right cutoff depends on business cost. It is standard in credit scoring, ad targeting, and medical diagnostics.</p>`,
  quiz: {
    q: `A classifier has an AUC of $0.5$. How good is it?`,
    a: `<p>No better than random guessing. An AUC of $0.5$ is the diagonal line; the model cannot tell the classes apart.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-regression-metrics",
  demo: function (host) {
    var P = [{ x: 1, y: 2.3 }, { x: 2, y: 3.6 }, { x: 3, y: 6.4 }, { x: 4, y: 7.2 }, { x: 5, y: 9.6 }];
    Demos.scatter(host, { points: P, init: function (api) {
      var slope = 1.8, intercept = 0.5;
      var ybar = 0; api.pts.forEach(function (p) { ybar += p.y; }); ybar /= api.pts.length;
      function render() {
        api.draw(function (ctx, col, px, py) {
          // residual segments: vertical from each point to the line
          ctx.strokeStyle = col.dim; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
          api.pts.forEach(function (p) {
            var pred = intercept + slope * p.x;
            ctx.beginPath(); ctx.moveTo(px(p.x), py(p.y)); ctx.lineTo(px(p.x), py(pred)); ctx.stroke();
          });
          ctx.setLineDash([]);
          // the fitted line
          ctx.strokeStyle = col.warn; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(px(0), py(intercept)); ctx.lineTo(px(6), py(intercept + slope * 6)); ctx.stroke();
        });
        var ssres = 0, sstot = 0;
        api.pts.forEach(function (p) {
          var pred = intercept + slope * p.x;
          ssres += (p.y - pred) * (p.y - pred);
          sstot += (p.y - ybar) * (p.y - ybar);
        });
        var r2 = 1 - ssres / sstot;
        var rmse = Math.sqrt(ssres / api.pts.length);
        api.readout.innerHTML = "Dashed segments are the residuals (y − ŷ). ŷ = " + slope.toFixed(2) + "·x + " + intercept.toFixed(2) + ". SS_res = " + ssres.toFixed(2) + ", SS_tot = " + sstot.toFixed(2) + ". R² = 1 − SS_res/SS_tot = <b>" + r2.toFixed(3) + "</b>, RMSE = √(SS_res/m) = <b>" + rmse.toFixed(3) + "</b>. Move the sliders to shrink the residuals.";
      }
      api.slider("slope", -1, 4, slope, 0.05, function (v) { slope = v; render(); });
      api.slider("intercept", -4, 4, intercept, 0.05, function (v) { intercept = v; render(); });
      render();
    } });
  },
  title: "Regression metrics (R² and RMSE)",
  tagline: "How well does the line fit? Compare its errors to a baseline.",
  prereqs: ["ml-linear-regression", "ml-loss"],
  bigIdea:
    `<p>For number predictions, we need scores for "how good is the fit".</p>
     <p><b>RMSE</b> is the typical size of the errors, in the same units as $y$.</p>
     <p><b>R²</b> compares your model to a dumb baseline (always predict the average).</p>
     <p>R² near $1$ means a great fit. Near $0$ means no better than guessing the mean.</p>`,
  buildup:
    `<p>$SS_{res}$ ("residual") adds up the squared errors of your model.</p>
     <p>$SS_{tot}$ ("total") adds up the squared distances from the mean — the baseline's errors.</p>
     <p>R² is $1$ minus their ratio: the fraction of the spread your model explains.</p>`,
  symbols: [
    { sym: "$SS_{res}$", desc: "sum of squared residuals: $\\sum (y^{(i)} - \\hat{y}^{(i)})^2$, your model's total squared error." },
    { sym: "$SS_{tot}$", desc: "total sum of squares: $\\sum (y^{(i)} - \\bar{y})^2$, error of always predicting the mean $\\bar{y}$." },
    { sym: "$R^2$", desc: "the fraction of variance the model explains. $1$ = perfect, $0$ = no better than the mean." },
    { sym: "RMSE", desc: "root mean squared error: $\\sqrt{\\tfrac{1}{m} SS_{res}}$, the typical error size in $y$'s units." }
  ],
  formula: `$$ R^2 = 1 - \\frac{SS_{res}}{SS_{tot}} \\qquad\\qquad \\text{RMSE} = \\sqrt{\\frac{1}{m}\\sum_{i=1}^{m}(y^{(i)} - \\hat{y}^{(i)})^2} $$`,
  whatItDoes:
    `<p>$SS_{res}$ measures your model's mistakes. $SS_{tot}$ measures the baseline's mistakes.</p>
     <p>If your model is much better, the ratio is small and R² is near $1$. If it is no better, R² is near $0$.</p>
     <p>RMSE just reports the typical error in plain units, so a house-price RMSE of $\\$20$k is easy to read.</p>`,
  example:
    `<p>True values $y = 1, 2, 3$ (mean $\\bar{y} = 2$). Predictions $\\hat{y} = 1.1, 1.9, 3.0$.</p>
     <ul class="steps">
       <li>$SS_{res} = (1 - 1.1)^2 + (2 - 1.9)^2 + (3 - 3.0)^2 = 0.01 + 0.01 + 0 = 0.02$.</li>
       <li>$SS_{tot} = (1 - 2)^2 + (2 - 2)^2 + (3 - 2)^2 = 1 + 0 + 1 = 2$.</li>
       <li>$R^2 = 1 - 0.02 / 2 = 1 - 0.01 = 0.99$. Excellent fit.</li>
       <li>RMSE $= \\sqrt{0.02 / 3} \\approx \\sqrt{0.0067} \\approx 0.08$. Errors are tiny.</li>
     </ul>`,
  application:
    `<p>R² and RMSE report how well a model predicts sales, prices, or demand. RMSE in real units tells stakeholders the typical miss; R² tells them how much better than guessing the average it is.</p>`,
  quiz: {
    q: `A model has $SS_{res} = 10$ and $SS_{tot} = 50$. What is its $R^2$?`,
    a: `<p>$R^2 = 1 - 10/50 = 1 - 0.2 = 0.8$. The model explains $80\\%$ of the variation.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ml-regularization",
  demo: function (host) {
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    // unconstrained least-squares optimum (the "true" min), contours are ellipses around it
    var w = { a: 2.6, b: 1.8 };           // OLS solution
    var sa = 1.0, sb = 2.2, rot = -0.5;   // ellipse shape (correlated features)
    // budget radius t shrinks as lambda grows
    var lam = 1.0;
    var range = 4;
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px"; host.appendChild(readout);
    var cx = 320, cy = 170, scale = (640 - 60) / (2 * range);
    function PX(a) { return cx + a * scale; }
    function PY(b) { return cy - b * scale; }
    var co = Math.cos(rot), si = Math.sin(rot);
    function lossAt(a, b) {
      var da = a - w.a, db = b - w.b;
      var u = co * da + si * db, v = -si * da + co * db;
      return (u * u) / (sa * sa) + (v * v) / (sb * sb);
    }
    function budget() { return 2.6 / (1 + 0.6 * lam); } // shrinks with lambda

    // find the point on a ball (L1 diamond or L2 circle) of radius t that minimizes loss
    function bestOnBall(t, norm) {
      var best = null;
      for (var i = 0; i < 720; i++) {
        var ang = i / 720 * Math.PI * 2;
        var a, b;
        if (norm === 2) { a = t * Math.cos(ang); b = t * Math.sin(ang); }
        else { // L1: parametrize diamond perimeter |a|+|b| = t
          var s = i / 720; var seg = Math.floor(s * 4); var f = s * 4 - seg;
          var corners = [[t, 0], [0, t], [-t, 0], [0, -t]];
          var p0 = corners[seg], p1 = corners[(seg + 1) % 4];
          a = p0[0] + (p1[0] - p0[0]) * f; b = p0[1] + (p1[1] - p0[1]) * f;
        }
        var l = lossAt(a, b);
        if (!best || l < best.l) best = { a: a, b: b, l: l };
      }
      return best;
    }

    function render() {
      var col = C(); ctx.clearRect(0, 0, 640, 340);
      // axes
      ctx.strokeStyle = col.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PX(-range), PY(0)); ctx.lineTo(PX(range), PY(0)); ctx.moveTo(PX(0), PY(-range)); ctx.lineTo(PX(0), PY(range)); ctx.stroke();
      ctx.fillStyle = col.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("θ₁", PX(range) - 16, PY(0) - 6); ctx.fillText("θ₂", PX(0) + 6, PY(range) + 12);
      // loss contours (ellipses) around OLS optimum
      var levels = [0.3, 0.9, 1.8, 3.0, 4.5];
      for (var li = 0; li < levels.length; li++) {
        var L = Math.sqrt(levels[li]);
        ctx.strokeStyle = col.dim + "66"; ctx.lineWidth = 1; ctx.beginPath();
        var first = true;
        for (var th = 0; th <= 80; th++) {
          var ang = th / 80 * Math.PI * 2;
          var u = sa * L * Math.cos(ang), v = sb * L * Math.sin(ang);
          var da = co * u - si * v, db = si * u + co * v;
          var X = PX(w.a + da), Y = PY(w.b + db);
          if (first) { ctx.moveTo(X, Y); first = false; } else ctx.lineTo(X, Y);
        }
        ctx.closePath(); ctx.stroke();
      }
      // OLS optimum
      ctx.fillStyle = col.dim; ctx.beginPath(); ctx.arc(PX(w.a), PY(w.b), 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText("OLS min", PX(w.a) + 8, PY(w.b) - 6);
      var t = budget();
      // L2 ball (circle) - blue
      ctx.strokeStyle = col.accent; ctx.lineWidth = 2; ctx.beginPath();
      ctx.arc(PX(0), PY(0), t * scale, 0, Math.PI * 2); ctx.stroke();
      // L1 ball (diamond) - green
      ctx.strokeStyle = col.accent2; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(PX(t), PY(0)); ctx.lineTo(PX(0), PY(t)); ctx.lineTo(PX(-t), PY(0)); ctx.lineTo(PX(0), PY(-t)); ctx.closePath(); ctx.stroke();
      // solutions where contour first touches each ball
      var s2 = bestOnBall(t, 2), s1 = bestOnBall(t, 1);
      ctx.fillStyle = col.accent; ctx.beginPath(); ctx.arc(PX(s2.a), PY(s2.b), 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col.accent2; ctx.beginPath(); ctx.arc(PX(s1.a), PY(s1.b), 6, 0, Math.PI * 2); ctx.fill();
      // legend
      ctx.textAlign = "left"; ctx.fillStyle = col.accent; ctx.fillText("L2 ball (circle) → Ridge", 12, 22);
      ctx.fillStyle = col.accent2; ctx.fillText("L1 ball (diamond) → Lasso", 12, 40);
      var sparse = Math.abs(s1.a) < 0.12 || Math.abs(s1.b) < 0.12;
      readout.innerHTML = "λ = <b>" + lam.toFixed(2) + "</b> sets the budget radius t = <b>" + t.toFixed(2) + "</b>. The solution is where the loss ellipses first touch the ball. L2 (Ridge) θ = (" + s2.a.toFixed(2) + ", " + s2.b.toFixed(2) + "). L1 (Lasso) θ = (" + s1.a.toFixed(2) + ", " + s1.b.toFixed(2) + ")" + (sparse ? " — it landed on a <b>corner</b>, zeroing a weight (sparsity)." : ".") + " Bigger λ shrinks both balls toward the origin.";
    }

    var row = document.createElement("div"); row.style.margin = "6px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "strength λ ";
    var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = lam.toFixed(2); lab.appendChild(span);
    var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 0; inp.max = 5; inp.step = 0.05; inp.value = lam;
    inp.addEventListener("input", function () { lam = parseFloat(inp.value); span.textContent = lam.toFixed(2); render(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    render();
  },
  title: "Regularization & cross-validation",
  tagline: "Penalize big weights to fight overfitting. Use folds to tune the penalty.",
  prereqs: ["ml-bias-variance", "fnd-norm", "ml-linear-regression"],
  bigIdea:
    `<p>Overfitting often shows up as huge, wild weights.</p>
     <p><b>Regularization</b> adds a penalty for big weights to the cost.</p>
     <p>The model must now balance fitting the data against keeping weights small. This curbs overfitting.</p>
     <p>The penalty strength $\\lambda$ is tuned with <b>cross-validation</b>.</p>`,
  buildup:
    `<p>Add a term $\\lambda \\lVert \\theta \\rVert$ to the cost. Bigger weights cost more.</p>
     <p><b>Ridge</b> (L2) uses the squared norm; it shrinks weights smoothly toward zero.</p>
     <p><b>LASSO</b> (L1) uses the absolute norm; it pushes some weights exactly to zero, dropping features. <b>Elastic Net</b> mixes both.</p>`,
  symbols: [
    { sym: "$\\lambda$", desc: "the regularization strength ('lambda'). Bigger = simpler model, more shrinkage." },
    { sym: "$\\lVert \\theta \\rVert_2^2$", desc: "squared L2 norm of the weights (Ridge): $\\sum \\theta_j^2$." },
    { sym: "$\\lVert \\theta \\rVert_1$", desc: "L1 norm of the weights (LASSO): $\\sum |\\theta_j|$; it zeros out weak features." },
    { sym: "k-fold CV", desc: "split data into $k$ parts; train on $k-1$, test on the rest; rotate and average." }
  ],
  formula: `$$ J(\\theta) = \\underbrace{\\sum_{i=1}^{m} L(h_\\theta(x^{(i)}), y^{(i)})}_{\\text{fit the data}} \\;+\\; \\underbrace{\\lambda\\,\\lVert \\theta \\rVert}_{\\text{keep weights small}} $$`,
  whatItDoes:
    `<p>The first term rewards fitting the data. The second term punishes large weights.</p>
     <p>A bigger $\\lambda$ leans toward simpler models (more bias, less variance); a smaller $\\lambda$ leans toward fitting (less bias, more variance).</p>
     <p>To pick $\\lambda$, use k-fold cross-validation: try several values, see which generalizes best on held-out folds.</p>`,
  example:
    `<p>Watch a weight shrink. Ridge picks $\\theta$ to minimize $J = (\\theta - 4)^2 + \\lambda\\,\\theta^2$, where plain least-squares wants $\\theta = 4$.</p>
     <ul class="steps">
       <li>Set the derivative to zero: $2(\\theta - 4) + 2\\lambda\\theta = 0$, giving the shrunk weight $\\theta = \\dfrac{4}{1 + \\lambda}$.</li>
       <li>$\\lambda = 0$ (no penalty): $\\theta = 4/1 = \\mathbf{4}$. The original big weight.</li>
       <li>$\\lambda = 1$: $\\theta = 4/2 = \\mathbf{2}$. &nbsp; $\\lambda = 3$: $\\theta = 4/4 = \\mathbf{1}$. The coefficient shrinks toward $0$ as $\\lambda$ grows — that is regularization, in numbers.</li>
       <li>Which $\\lambda$? Use 5-fold cross-validation: average test error comes out $\\lambda{=}0.1 \\to 0.30$, $\\lambda{=}1 \\to 0.22$, $\\lambda{=}10 \\to 0.28$. Pick $\\lambda = 1$, the lowest.</li>
     </ul>`,
  application:
    `<p>Ridge stabilizes models with many correlated features. LASSO does automatic feature selection by zeroing out useless ones. Cross-validation is the universal way to tune any knob (penalty, tree depth, $k$) honestly.</p>`,
  quiz: {
    q: `You want a model that automatically drops useless features by setting their weights to exactly zero. Should you use Ridge (L2) or LASSO (L1)?`,
    a: `<p>LASSO (L1). Its absolute-value penalty pushes weak weights all the way to zero, removing those features. Ridge only shrinks them toward zero but rarely hits exactly zero.</p>`
  }
});

})();
