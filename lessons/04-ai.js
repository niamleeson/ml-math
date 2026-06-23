/* =====================================================================
   MODULE 4 — ARTIFICIAL INTELLIGENCE (Stanford CS221).
   Reflex models, search, MDPs, games, CSPs, Bayes nets, and logic.
   Same lesson style as the foundations module:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers or a tiny scenario
     - a real-world application
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Artificial Intelligence (CS221)";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---- shared helpers for bespoke AI canvas demos ---- */
function C() {
  var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
  var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
  return {
    ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"),
    accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
    border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
  };
}
function mkCanvas(host, w, h) {
  var cv = document.createElement("canvas"); cv.width = w; cv.height = h; host.appendChild(cv);
  return { cv: cv, ctx: cv.getContext("2d") };
}
function mkBtn(host, label, cb) {
  var b = document.createElement("button"); b.textContent = label;
  b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin:0 8px 0 0";
  b.addEventListener("click", cb); host.appendChild(b); return b;
}
function mkRow(host) { var d = document.createElement("div"); d.style.margin = "8px 0"; host.appendChild(d); return d; }
function mkOut(host) { var d = document.createElement("div"); d.className = "out"; d.style.cssText = "margin-top:8px;font-size:14px;line-height:1.6"; host.appendChild(d); return d; }

/* ---- canonical 4x4 gridworld for MDP / value-iteration / RL lessons ----
   The classic Russell-Norvig grid: goal +1, pit -1, a wall, deterministic moves
   along the greedy action. One "Iterate" runs one value-iteration sweep:
   V(s) <- max_a [ R(s') + gamma * V(s') ]. Arrows show the greedy policy. */
function gridworldDemo(host, opts) {
  opts = opts || {};
  host.innerHTML = "";
  var ROWS = 3, COLS = 4;
  var GOAL = { r: 0, c: 3 }, PIT = { r: 1, c: 3 }, WALL = { r: 1, c: 1 };
  var gamma = (opts.gamma != null) ? opts.gamma : 0.9;
  var R_STEP = -0.04;
  var acts = [[-1, 0], [1, 0], [0, -1], [0, 1]];   // up, down, left, right
  var arrows = ["↑", "↓", "←", "→"];
  function isWall(r, c) { return r === WALL.r && c === WALL.c; }
  function isTerminal(r, c) { return (r === GOAL.r && c === GOAL.c) || (r === PIT.r && c === PIT.c); }
  function inBounds(r, c) { return r >= 0 && r < ROWS && c >= 0 && c < COLS && !isWall(r, c); }
  var V, policy, sweep;
  function reset() {
    V = []; policy = [];
    for (var r = 0; r < ROWS; r++) {
      V[r] = []; policy[r] = [];
      for (var c = 0; c < COLS; c++) {
        if (r === GOAL.r && c === GOAL.c) V[r][c] = 1;
        else if (r === PIT.r && c === PIT.c) V[r][c] = -1;
        else V[r][c] = 0;
        policy[r][c] = -1;
      }
    }
    sweep = 0; draw();
  }
  function qOf(r, c, a) {
    // deterministic move; bumping a wall/edge keeps you in place
    var nr = r + acts[a][0], nc = c + acts[a][1];
    if (!inBounds(nr, nc)) { nr = r; nc = c; }
    return R_STEP + gamma * V[nr][nc];
  }
  function iterate() {
    var nV = [], nP = [];
    for (var r = 0; r < ROWS; r++) {
      nV[r] = []; nP[r] = [];
      for (var c = 0; c < COLS; c++) {
        if (isWall(r, c)) { nV[r][c] = 0; nP[r][c] = -1; continue; }
        if (isTerminal(r, c)) { nV[r][c] = V[r][c]; nP[r][c] = -1; continue; }
        var best = -Infinity, bestA = 0;
        for (var a = 0; a < 4; a++) { var q = qOf(r, c, a); if (q > best) { best = q; bestA = a; } }
        nV[r][c] = best; nP[r][c] = bestA;
      }
    }
    V = nV; policy = nP; sweep++; draw();
  }
  var W = 520, H = 400, cz = 110, ox = 30, oy = 20;
  var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
  var out = mkOut(host);
  function heat(v, t) {
    // map value in [-1,1] to a colour: green positive, red negative
    var x = Math.max(-1, Math.min(1, v));
    if (x >= 0) return "rgba(126,231,135," + (0.12 + 0.55 * x).toFixed(3) + ")";
    return "rgba(255,123,114," + (0.12 + 0.55 * (-x)).toFixed(3) + ")";
  }
  function draw() {
    var t = C(); ctx.clearRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
      var x = ox + c * cz, y = oy + r * cz;
      if (isWall(r, c)) { ctx.fillStyle = t.border; ctx.fillRect(x, y, cz - 2, cz - 2); continue; }
      ctx.fillStyle = heat(V[r][c], t); ctx.fillRect(x, y, cz - 2, cz - 2);
      ctx.strokeStyle = t.border; ctx.lineWidth = 1; ctx.strokeRect(x, y, cz - 2, cz - 2);
      var cx = x + (cz - 2) / 2, cy = y + (cz - 2) / 2;
      var goal = (r === GOAL.r && c === GOAL.c), pit = (r === PIT.r && c === PIT.c);
      // value number
      ctx.fillStyle = t.ink; ctx.font = "bold 18px sans-serif";
      ctx.fillText(V[r][c].toFixed(2), cx, cy - 14);
      if (goal) { ctx.fillStyle = t.accent2; ctx.font = "bold 14px sans-serif"; ctx.fillText("GOAL +1", cx, cy + 18); }
      else if (pit) { ctx.fillStyle = "#ff7b72"; ctx.font = "bold 14px sans-serif"; ctx.fillText("PIT −1", cx, cy + 18); }
      else if (policy[r][c] >= 0) { ctx.fillStyle = t.accent; ctx.font = "bold 28px sans-serif"; ctx.fillText(arrows[policy[r][c]], cx, cy + 20); }
    }
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    var label = opts.label || ("Value iteration sweep <b>" + sweep + "</b>. Each cell shows V(s); blue arrow = greedy action argmax<sub>a</sub> Q(s,a).");
    out.innerHTML = label.replace("{n}", sweep) +
      "<br>One sweep: V(s) ← max<sub>a</sub> [ R + γ·V(s′) ], with γ = " + gamma + ", step reward " + R_STEP + ". " +
      "<span style=\"color:" + t.accent2 + "\">Green = high value</span>, <span style=\"color:#ff7b72\">red = low</span>.";
  }
  var row = mkRow(host);
  mkBtn(row, opts.stepLabel || "Iterate (one sweep)", iterate);
  mkBtn(row, "Reset", reset);
  host.insertBefore(c0.cv, host.children[0]);
  host.insertBefore(out, host.children[1]);
  reset();
  return { iterate: iterate, reset: reset };
}

/* ---------------------------------------------------------------- */
L({
  id: "ai-linear-predictors",
  demo: function (host) {
    Demos.scatter(host, {
      points: [
        { x: 1, y: 1, c: 4 }, { x: 1.5, y: 2, c: 4 }, { x: 2, y: 1.2, c: 4 }, { x: 1.2, y: 2.5, c: 4 },
        { x: 4, y: 4, c: 1 }, { x: 4.5, y: 3, c: 1 }, { x: 3.5, y: 4.5, c: 1 }, { x: 5, y: 3.5, c: 1 }
      ],
      init: function (api) {
        var w1 = 1, w2 = 1, b = -6;
        function redraw() {
          api.draw(function (ctx, c, px, py) {
            // line w1*x + w2*y + b = 0  ->  y = -(w1*x + b)/w2
            ctx.strokeStyle = c.ink; ctx.lineWidth = 2;
            ctx.beginPath();
            var x0 = 0, x1 = 6;
            if (Math.abs(w2) > 1e-6) {
              ctx.moveTo(px(x0), py(-(w1 * x0 + b) / w2));
              ctx.lineTo(px(x1), py(-(w1 * x1 + b) / w2));
            } else {
              var xv = -b / w1; ctx.moveTo(px(xv), py(0)); ctx.lineTo(px(xv), py(6));
            }
            ctx.stroke();
          });
          var correct = 0, total = api.pts.length, minMargin = Infinity;
          api.pts.forEach(function (p) {
            var score = w1 * p.x + w2 * p.y + b;
            var label = (p.c === 1) ? 1 : -1;
            var margin = score * label;
            if (margin > 0) correct++;
            if (margin < minMargin) minMargin = margin;
          });
          api.readout.innerHTML = "weights w = [" + w1.toFixed(2) + ", " + w2.toFixed(2) + "], bias = " + b.toFixed(2) +
            ".<br>classify by sign(w·x + b). correct: <b>" + correct + " / " + total +
            "</b>. smallest margin = <b>" + minMargin.toFixed(2) + "</b> (negative means a misclassified point).";
        }
        api.slider("w1 (weight on x)", -3, 3, w1, 0.1, function (v) { w1 = v; redraw(); });
        api.slider("w2 (weight on y)", -3, 3, w2, 0.1, function (v) { w2 = v; redraw(); });
        api.slider("bias", -10, 4, b, 0.5, function (v) { b = v; redraw(); });
        redraw();
      }
    });
  },
  title: "Linear predictors (reflex models)",
  tagline: "Turn an input into numbers, take a dot product, read off a yes/no answer.",
  prereqs: ["fnd-dot"],
  bigIdea:
    `<p>A <b>reflex model</b> looks at an input and instantly gives an answer. No planning, no thinking ahead.</p>
     <p>First we turn the input into a list of numbers. That list is the <b>feature vector</b>.</p>
     <p>Then we take a dot product with a weight vector. That gives a single <b>score</b>.</p>
     <p>The sign of the score is the answer: positive means "yes", negative means "no".</p>`,
  buildup:
    `<p>A computer cannot read an email. It can only do math on numbers.</p>
     <p>So we describe the email with numbers: how many times "free" appears, how many links, and so on.</p>
     <p>That description is $\\phi(x)$. The weights $w$ say how much each number matters.</p>`,
  symbols: [
    { sym: "$x$", desc: "the raw input (an email, an image, a house)." },
    { sym: "$\\phi(x)$", desc: "the feature vector: the input turned into a list of numbers. $\\phi$ is the Greek letter 'phi'." },
    { sym: "$w$", desc: "the weight vector: how important each feature is. Learned from data." },
    { sym: "$w\\cdot\\phi(x)$", desc: "the dot product of weights and features. Multiply matching entries, add them up." },
    { sym: "$s(x,w)$", desc: "the score: the single number $w\\cdot\\phi(x)$." },
    { sym: "$\\text{sign}(s)$", desc: "gives $+1$ if $s&gt;0$, and $-1$ if $s&lt;0$. The final yes/no answer." },
    { sym: "$y$", desc: "the true label, either $+1$ (yes) or $-1$ (no)." },
    { sym: "$m(x,y,w)$", desc: "the margin: the score times the true label. Tells us how confident and correct we are." }
  ],
  formula: `$$ s(x,w) = w\\cdot\\phi(x) \\qquad f_w(x) = \\text{sign}(s(x,w)) \\qquad m(x,y,w) = s(x,w)\\cdot y $$`,
  whatItDoes:
    `<p>The score $s$ adds up the evidence. Each feature is multiplied by its weight, then summed.</p>
     <p>$f_w(x)$ just reads the sign of that score to decide yes or no.</p>
     <p>The margin $m$ checks our work. If the score and the true label agree in sign, $m$ is positive. A big positive margin means "correct and confident". A negative margin means we got it wrong.</p>`,
  example:
    `<p>Spam filter. Two features: number of times "free" appears, and number of links.</p>
     <p>An email has $\\phi(x) = [2, 3]$. The learned weights are $w = [1.5, 0.5]$.</p>
     <ul class="steps">
       <li>Score: $s = 1.5\\times2 + 0.5\\times3 = 3 + 1.5 = 4.5$.</li>
       <li>Sign of $4.5$ is positive, so $f_w(x) = +1$. We call it spam.</li>
       <li>Say the email really is spam, so $y = +1$. Margin: $m = 4.5\\times(+1) = 4.5$.</li>
       <li>The margin is big and positive. Correct and confident.</li>
     </ul>`,
  application:
    `<p>Spam filters, simple image classifiers, and credit-approval systems all start as linear predictors. They are fast and easy to understand. The dot product is the same one from the foundations module.</p>`,
  whenToUse:
    `<p><b>Reach for a linear predictor first</b> when the input is already a flat vector of meaningful numbers and you need a fast, transparent yes/no or score. It is the right baseline before anything fancier.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A deep network</b> — when data is scarce, latency must be tiny, or you must explain every decision (each weight reads as "how much this feature matters").</li>
       <li><b>A decision tree</b> — when the boundary is roughly a straight line and you want a smooth, calibratable score rather than hard splits.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The classes are not linearly separable — add features, a kernel, or move to a tree-based model or a neural network.</li>
       <li>The input is raw pixels, audio, or text — let a CNN (Convolutional Neural Network) or transformer learn the features first.</li>
     </ul>
     <p><b>In practice</b> reach for <code>scikit-learn</code>'s <code>LogisticRegression</code> or <code>SGDClassifier</code> as the workhorse implementation.</p>`,
  pitfalls:
    `<ul>
       <li><b>Garbage features, garbage model.</b> A linear predictor can only weight the features you give it. If the signal needs an interaction or a nonlinearity, it will never find it — engineer the feature explicitly.</li>
       <li><b>Unscaled features distort the weights.</b> A feature measured in thousands swamps one measured in fractions. Standardize $\\phi(x)$ so each feature has comparable scale before training.</li>
       <li><b>Sign convention bites.</b> The label must be $+1$ / $-1$ (or $0$ / $1$) consistently between training and serving. A flipped label silently inverts every prediction.</li>
       <li><b>The score is not a probability.</b> $w\\cdot\\phi(x)$ is an unbounded number; do not read it as a confidence without a squashing function and calibration.</li>
       <li><b>A separating line is not a confident one.</b> Many weight vectors classify the training set perfectly but generalize differently — a tiny margin means a fragile boundary.</li>
       <li><b>Correlated features make weights unstable.</b> Two near-duplicate features split the weight unpredictably; the individual numbers stop being interpretable. Drop duplicates or add regularization.</li>
     </ul>`,
  quiz: {
    q: `Features $\\phi(x)=[1, 4]$, weights $w=[3, -1]$. Compute the score and the prediction $f_w(x)$.`,
    a: `<p>Score $= 3\\times1 + (-1)\\times4 = 3 - 4 = -1$. The sign is negative, so $f_w(x) = -1$ (the "no" class).</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-loss-minimization",
  demo: function (host) {
    Demos.plot(host, {
      xmin: -2, xmax: 3, ymin: 0, ymax: 4,
      curves: [
        { f: function (m) { return m < 0 ? 1 : 0; }, label: "zero-one" },
        { f: function (m) { return Math.max(0, 1 - m); }, label: "hinge" },
        { f: function (m) { var d = m - 1; return d * d; }, label: "squared" }
      ],
      drag: {
        label: "margin m", start: 0.3, curve: 1,
        readout: function (m) {
          var zo = m < 0 ? 1 : 0, hinge = Math.max(0, 1 - m), sq = (m - 1) * (m - 1);
          return "at margin m = <b>" + m.toFixed(2) + "</b>: zero-one = <b>" + zo +
            "</b>, hinge max(0,1−m) = <b>" + hinge.toFixed(2) +
            "</b>, squared (m−1)² = <b>" + sq.toFixed(2) + "</b>. (larger m = more correct + confident.)";
        }
      }
    });
  },
  title: "Loss minimization",
  tagline: "Measure how wrong the model is. Then pick weights that make that number smallest.",
  prereqs: ["ai-linear-predictors", "ml-loss"],
  bigIdea:
    `<p>A <b>loss</b> is a number that says how wrong one prediction is. Small loss is good. Big loss is bad.</p>
     <p>The <b>training loss</b> is the average loss over all examples.</p>
     <p>Training means: find the weights $w$ that make the training loss as small as possible.</p>`,
  buildup:
    `<p>We need a way to grade the model. For one example, a loss function gives a penalty.</p>
     <p>Different jobs use different loss functions. Some are harsh on mistakes, some are gentle.</p>
     <p>The margin $m$ from the last lesson drives many of them: a big positive margin means low loss.</p>`,
  symbols: [
    { sym: "$D$", desc: "the dataset: all the $(x,y)$ training examples." },
    { sym: "$|D|$", desc: "the number of examples in the dataset." },
    { sym: "$\\text{Loss}(x,y,w)$", desc: "the penalty for one example, given the weights $w$." },
    { sym: "$\\text{TrainLoss}(w)$", desc: "the average loss over the whole dataset." },
    { sym: "$\\frac{1}{|D|}\\sum$", desc: "add up the loss over all examples, then divide by the count to get the average." },
    { sym: "$m$", desc: "the margin (score times true label) from the previous lesson." },
    { sym: "$\\max(1-m,0)$", desc: "the hinge loss: pick the larger of $1-m$ and $0$." }
  ],
  formula: `$$ \\text{TrainLoss}(w) = \\frac{1}{|D|}\\sum_{(x,y)\\in D} \\text{Loss}(x,y,w) $$`,
  whatItDoes:
    `<p>The formula averages the per-example losses. Lower is better.</p>
     <p>Common loss functions:</p>
     <ul class="steps">
       <li><b>Zero-one loss</b>: $1$ if the prediction is wrong, $0$ if right. Simple, but it has no useful slope.</li>
       <li><b>Hinge loss</b> $\\max(1-m, 0)$: zero once the margin passes $1$, otherwise it grows. Used by support vector machines.</li>
       <li><b>Logistic loss</b>: a smooth curve that always rewards a bigger margin a little more.</li>
       <li><b>Squared loss</b> $(\\text{prediction}-y)^2$: for predicting numbers, punishes big errors hard.</li>
     </ul>`,
  example:
    `<p>One example with true label $y = +1$ and score $s = 0.3$, so the margin is $m = 0.3$.</p>
     <ul class="steps">
       <li>Zero-one loss: the sign of $0.3$ is $+1$, which matches $y$. So loss $= 0$. Looks fine.</li>
       <li>Hinge loss: $\\max(1 - 0.3,\\, 0) = \\max(0.7, 0) = 0.7$. Not zero.</li>
       <li>Hinge complains because the margin is small. It wants the answer correct AND confident (margin past $1$).</li>
     </ul>`,
  application:
    `<p>Every trained model minimizes some loss. Spam filters and classifiers often use hinge or logistic loss. House-price predictors use squared loss. Choosing the loss shapes what "good" means.</p>`,
  whenToUse:
    `<p><b>You always pick a loss</b> — the question is <i>which</i> one. Match the loss to the prediction task and to what mistakes cost you.</p>
     <p><b>Choose by task:</b></p>
     <ul>
       <li><b>Hinge loss</b> — for a hard-margin classifier (the support vector machine) when you care about a clean decision boundary, not probabilities.</li>
       <li><b>Logistic (log) loss</b> — when you need calibrated probabilities, not just a label; it is the default for classification.</li>
       <li><b>Squared loss</b> — for regression (predicting a number), when large errors should be punished hard.</li>
       <li><b>Absolute / Huber loss</b> — for regression with outliers, when squared loss would let a few bad points dominate.</li>
     </ul>
     <p><b>Avoid zero-one loss as a training target</b> — it has no useful slope, so gradient descent cannot move on it. Use it only to <i>report</i> accuracy.</p>`,
  pitfalls:
    `<ul>
       <li><b>Optimizing the wrong objective.</b> Minimizing squared loss does not maximize accuracy or AUC (Area Under the Curve). Pick the loss whose minimum matches the metric you will be judged on.</li>
       <li><b>Squared loss chases outliers.</b> One mislabeled point with a huge error can dominate the whole sum. Switch to Huber or absolute loss when the data is noisy.</li>
       <li><b>Class imbalance silently dominates.</b> The average loss is swamped by the majority class. Reweight per-class or resample so the rare class still moves the gradient.</li>
       <li><b>Zero-one loss has no gradient.</b> It is flat almost everywhere, so it cannot be trained directly — that is the whole reason surrogate losses (hinge, logistic) exist.</li>
       <li><b>Training loss is not test loss.</b> Driving training loss to zero usually means overfitting. Watch a held-out validation loss and stop when it stops falling.</li>
       <li><b>Forgetting regularization.</b> Raw training-loss minimization can blow weights up. Add an $L_2$ ($\\lambda\\lVert w\\rVert^2$) penalty to keep the solution stable.</li>
     </ul>`,
  quiz: {
    q: `True label $y=+1$, score $s=2$ (so margin $m=2$). What is the hinge loss $\\max(1-m,0)$?`,
    a: `<p>$\\max(1-2,\\,0) = \\max(-1,\\,0) = 0$. The margin is past $1$, so hinge is happy: zero loss.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-sgd",
  demo: function (host) {
    Demos.descent(host, {
      f: function (x) { return x * x; },
      df: function (x) { return 2 * x; },
      xmin: -4, xmax: 4, start: 3, lr: 0.2
    });
  },
  title: "Stochastic gradient descent (SGD)",
  tagline: "Don't wait for the whole dataset. Step downhill after each single example.",
  prereqs: ["ai-loss-minimization", "ml-gradient-descent"],
  bigIdea:
    `<p>Gradient descent shrinks the loss by stepping downhill. But the full gradient uses every example. Slow.</p>
     <p><b>Stochastic gradient descent</b> takes a step after looking at just one example.</p>
     <p>Each step is a bit noisy, but you take many more of them. Overall it learns much faster.</p>`,
  buildup:
    `<p>From the foundations module: the gradient points uphill. To lower the loss, step the opposite way.</p>
     <p>The word "stochastic" just means "random". We pick one random example at a time.</p>
     <p>The gradient of that one example's loss is a cheap, rough guess of the true downhill direction.</p>`,
  symbols: [
    { sym: "$w$", desc: "the weight vector we are training." },
    { sym: "$\\leftarrow$", desc: "the update arrow: 'replace the left side with the right side'." },
    { sym: "$\\eta$", desc: "the learning rate (Greek 'eta'): how big each step is. Small and careful, or large and bold." },
    { sym: "$\\nabla_w \\text{Loss}(x,y,w)$", desc: "the gradient of one example's loss, with respect to the weights. Points uphill." },
    { sym: "$-\\eta\\nabla_w$", desc: "a small step in the downhill direction (note the minus sign)." }
  ],
  formula: `$$ w \\leftarrow w - \\eta\\,\\nabla_w \\text{Loss}(x,y,w) $$`,
  whatItDoes:
    `<p>For each example, compute its loss gradient. Then nudge the weights a little against that gradient.</p>
     <p>The minus sign means "go downhill". The learning rate $\\eta$ controls how far.</p>
     <p>Too big a step and you overshoot. Too small and learning crawls.</p>`,
  example:
    `<p>One weight $w = 4$. For the current example the loss gradient is $\\nabla_w = 2$. Learning rate $\\eta = 0.5$.</p>
     <ul class="steps">
       <li>The gradient is $+2$: uphill is to the right, so loss drops if we move left.</li>
       <li>Update: $w \\leftarrow 4 - 0.5\\times2 = 4 - 1 = 3$.</li>
       <li>The weight moved from $4$ to $3$, downhill. Next example gives the next nudge.</li>
     </ul>
     <p>Thousands of tiny nudges like this drive the loss down.</p>`,
  application:
    `<p>SGD trains almost every modern model, including giant neural networks. Looking at one example (or a small batch) at a time is what makes training huge datasets possible.</p>`,
  whenToUse:
    `<p><b>Reach for SGD whenever the dataset is too big to process all at once</b>, or whenever the model is differentiable and trained by gradient descent — which is almost every neural network. It trades exactness for speed and scales to millions of examples.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Full-batch gradient descent</b> — when computing the gradient over the whole dataset each step is too slow; SGD takes many cheap, noisy steps instead.</li>
       <li><b>Closed-form solutions</b> (the normal equations) — when the problem is huge or has no closed form; SGD needs only one example's gradient at a time.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The dataset is small and the problem is convex with a closed form — solve it directly for an exact answer.</li>
       <li>You want fewer, smoother steps — use mini-batch SGD or an adaptive optimizer like Adam, the practical default for deep learning.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Learning rate is everything.</b> Too large and the loss diverges to infinity; too small and training crawls. Start with a small value, watch the loss, and use a schedule that decays $\\eta$ over time.</li>
       <li><b>Unshuffled data biases the path.</b> If examples arrive sorted by label, each step pulls one way. Shuffle every epoch so the noise averages out.</li>
       <li><b>Pure single-example SGD is noisy.</b> The gradient of one point is a rough estimate. Use mini-batches (32–512) for a steadier descent and better hardware use.</li>
       <li><b>Unscaled features stall it.</b> Wildly different feature scales make a stretched loss surface that zig-zags. Standardize inputs first.</li>
       <li><b>No convergence guarantee with a fixed rate.</b> A constant $\\eta$ bounces around the minimum forever. Decay it, or use momentum / Adam to settle.</li>
       <li><b>Non-reproducible runs.</b> The random order changes the result. Fix the seed when you need to compare experiments.</li>
     </ul>`,
  quiz: {
    q: `$w=10$, gradient $\\nabla_w=4$, learning rate $\\eta=0.25$. What is the new $w$?`,
    a: `<p>$w \\leftarrow 10 - 0.25\\times4 = 10 - 1 = 9$. The weight steps down from $10$ to $9$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-search-problem",
  demo: function (host) {
    // A small graph. Step through BFS to watch the frontier grow and nodes get visited in order.
    host.innerHTML = "";
    var W = 640, H = 360;
    var nodes = {
      S: { x: 90, y: 180, name: "S" }, A: { x: 230, y: 90, name: "A" }, B: { x: 230, y: 270, name: "B" },
      C: { x: 380, y: 60, name: "C" }, D: { x: 380, y: 190, name: "D" }, E: { x: 380, y: 310, name: "E" },
      G: { x: 540, y: 180, name: "G" }
    };
    var adj = { S: ["A", "B"], A: ["C", "D"], B: ["D", "E"], C: ["G"], D: ["G"], E: ["G"], G: [] };
    var edges = [];
    for (var u in adj) adj[u].forEach(function (v) { edges.push([u, v]); });
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var order, visited, frontier, done;
    function reset() {
      order = {}; visited = {}; frontier = ["S"]; done = false;
      order.S = 0; draw();
    }
    function step() {
      if (done || frontier.length === 0) { done = true; draw(); return; }
      var u = frontier.shift();   // BFS: pop the front of the queue
      visited[u] = true;
      adj[u].forEach(function (v) {
        if (order[v] === undefined) { order[v] = Object.keys(order).length; frontier.push(v); }
      });
      if (frontier.length === 0) done = true;
      draw();
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 2; ctx.strokeStyle = t.border;
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      for (var k in nodes) {
        var n = nodes[k], fill = t.panel, ring = t.border, lab = n.name;
        if (visited[k]) { fill = t.accent2; ring = t.accent2; }
        else if (frontier.indexOf(k) >= 0) { fill = t.warn; ring = t.warn; }
        ctx.beginPath(); ctx.fillStyle = fill; ctx.strokeStyle = ring; ctx.lineWidth = 2.5;
        ctx.arc(n.x, n.y, 22, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = (visited[k] || frontier.indexOf(k) >= 0) ? "#0d1117" : t.ink;
        ctx.font = "bold 15px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(lab, n.x, n.y);
        if (order[k] !== undefined) {
          ctx.fillStyle = t.accent; ctx.font = "bold 12px sans-serif";
          ctx.fillText("#" + (order[k] + 1), n.x, n.y - 32);
        }
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "BFS from <b>S</b> to goal <b>G</b>. <span style=\"color:" + t.warn + "\">Orange = frontier (queue)</span>, " +
        "<span style=\"color:" + t.accent2 + "\">green = visited</span>. Small <b>#n</b> is the order each node was discovered.<br>" +
        "frontier queue: [" + frontier.join(", ") + "]" + (done ? " &nbsp;<b>(search complete)</b>" : "");
    }
    var row = mkRow(host);
    mkBtn(row, "Step (BFS)", step);
    mkBtn(row, "Reset", reset);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "Search problems",
  tagline: "Start somewhere, take actions that cost something, reach a goal as cheaply as possible.",
  bigIdea:
    `<p>Some problems need planning, not a reflex. You must take a sequence of actions to reach a goal.</p>
     <p>A <b>search problem</b> is a clean way to describe these. Think of finding a path through a maze.</p>
     <p>The goal is the <i>cheapest</i> path from start to a goal, where each action has a cost.</p>`,
  buildup:
    `<p>Picture a maze. You stand in one cell. You can step in some directions. Each step costs something.</p>
     <p>To describe any such problem, we list five pieces. Together they define every move you can make.</p>`,
  symbols: [
    { sym: "$s$", desc: "a state: a snapshot of the situation (which maze cell you are in)." },
    { sym: "$\\text{Start}$", desc: "the starting state." },
    { sym: "$\\text{Actions}(s)$", desc: "the list of moves allowed from state $s$." },
    { sym: "$\\text{Cost}(s,a)$", desc: "the cost of doing action $a$ in state $s$ (always $\\ge 0$)." },
    { sym: "$\\text{Succ}(s,a)$", desc: "the successor: the new state you land in after action $a$. 'Succ' = successor." },
    { sym: "$\\text{IsEnd}(s)$", desc: "true if $s$ is a goal state, false otherwise." }
  ],
  formula: `$$ \\text{Start},\\quad \\text{Actions}(s),\\quad \\text{Cost}(s,a),\\quad \\text{Succ}(s,a),\\quad \\text{IsEnd}(s) $$`,
  whatItDoes:
    `<p>These five pieces fully describe the world of the problem.</p>
     <p>A <b>path</b> is a chain of actions from Start. Each one lands you in a new state via Succ.</p>
     <p>The path's total cost is the sum of all its action costs. We want the path with the smallest total that ends where $\\text{IsEnd}$ is true.</p>`,
  example:
    `<p>Start at $A$, goal is $D$. Two routes exist, and we want the cheapest total cost.</p>
     <ul class="steps">
       <li>Direct: $\\text{Cost}(A,\\text{slow}) = 5$, $\\text{Succ}(A,\\text{slow}) = D$. One step, total $= 5$.</li>
       <li>Detour: $A \\to B$ costs $1$, $B \\to D$ costs $1$. Total $= 1 + 1 = 2$.</li>
       <li>$\\text{IsEnd}(D)$ is true on both. We compare totals: $\\min(5, 2) = 2$.</li>
       <li>The detour wins even though it takes more steps, because its <i>total cost</i> is lower. Fewest steps is not the same as cheapest.</li>
     </ul>
     <p>A search algorithm's job is exactly this: out of all paths to a goal, return the one with the smallest summed cost.</p>`,
  application:
    `<p>GPS (Global Positioning System) routing, puzzle solvers, robot path planning, and even compiling a program all become search problems. Define the five pieces, and a search algorithm finds the best plan.</p>`,
  whenToUse:
    `<p><b>Frame a problem as search when you need a sequence of actions to a goal, the world is deterministic and known, and you can write down states and moves.</b> If a single reflex decision will not do, but you do have a clear model of how actions change the world, search is the right lens.</p>
     <p><b>Choose search over:</b></p>
     <ul>
       <li><b>A reflex / learned model</b> — when the answer is a multi-step plan, not a one-shot label, and you can specify the rules exactly.</li>
       <li><b>Hand-coded rules</b> — when the space of situations is too large to enumerate by hand but follows a clean transition model.</li>
     </ul>
     <p><b>Pick a different framework when:</b></p>
     <ul>
       <li>Actions are unreliable (you might slip) — use a Markov Decision Process (MDP) instead.</li>
       <li>You do not know the rules and must learn from data — use reinforcement learning or a learned model.</li>
       <li>There is an adversary — use game-tree search (minimax).</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The state space explodes.</b> Naively listing all states is hopeless for real problems (a chessboard, a road network). Define states compactly and rely on graph search to avoid revisiting them.</li>
       <li><b>A bloated state encoding.</b> Putting irrelevant detail in the state multiplies the search tree. Keep the state the minimal snapshot that the transitions actually need.</li>
       <li><b>Confusing fewest steps with cheapest path.</b> The shortest action count is not the lowest total cost. If costs vary, optimize total $\\text{Cost}$, not hop count.</li>
       <li><b>Negative or zero action costs.</b> Most search algorithms assume $\\text{Cost}(s,a) \\ge 0$. A negative edge breaks uniform-cost search and A* outright.</li>
       <li><b>Forgetting to detect goals or cycles.</b> A wrong $\\text{IsEnd}$ test, or no visited-set, sends the search looping forever.</li>
       <li><b>Modeling a stochastic world as deterministic.</b> If actions sometimes fail, a search plan is brittle — you need an MDP that plans with the odds.</li>
     </ul>`,
  quiz: {
    q: `In the $A-B-C$ line, if $\\text{Cost}(B,\\text{right})$ were $5$ instead of $1$, what is the cost of the path from $A$ to $C$?`,
    a: `<p>$\\text{Cost}(A,\\text{right}) + \\text{Cost}(B,\\text{right}) = 1 + 5 = 6$. The total path cost is $6$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-tree-search",
  demo: function (host) {
    // A binary tree of 7 nodes. Step reveals visit order; toggle BFS (queue) vs DFS (stack).
    host.innerHTML = "";
    var W = 640, H = 320;
    var nodes = {
      n1: { x: 320, y: 50, name: "1" },
      n2: { x: 180, y: 150, name: "2" }, n3: { x: 460, y: 150, name: "3" },
      n4: { x: 100, y: 260, name: "4" }, n5: { x: 260, y: 260, name: "5" },
      n6: { x: 380, y: 260, name: "6" }, n7: { x: 540, y: 260, name: "7" }
    };
    var children = { n1: ["n2", "n3"], n2: ["n4", "n5"], n3: ["n6", "n7"], n4: [], n5: [], n6: [], n7: [] };
    var edges = [["n1", "n2"], ["n1", "n3"], ["n2", "n4"], ["n2", "n5"], ["n3", "n6"], ["n3", "n7"]];
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var mode = "BFS", order, frontier, done;
    function reset() { order = {}; frontier = ["n1"]; done = false; draw(); }
    function step() {
      if (done || frontier.length === 0) { done = true; draw(); return; }
      var u = (mode === "BFS") ? frontier.shift() : frontier.pop();   // queue vs stack
      order[u] = Object.keys(order).length;
      var kids = children[u].slice();
      if (mode === "DFS") kids.reverse();   // so left child is explored first off the stack
      kids.forEach(function (v) { if (order[v] === undefined && frontier.indexOf(v) < 0) frontier.push(v); });
      if (frontier.length === 0) done = true;
      draw();
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 2; ctx.strokeStyle = t.border;
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      for (var k in nodes) {
        var n = nodes[k], fill = t.panel, ring = t.border;
        if (order[k] !== undefined) { fill = t.accent2; ring = t.accent2; }
        else if (frontier.indexOf(k) >= 0) { fill = t.warn; ring = t.warn; }
        ctx.beginPath(); ctx.fillStyle = fill; ctx.strokeStyle = ring; ctx.lineWidth = 2.5;
        ctx.arc(n.x, n.y, 21, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = (order[k] !== undefined || frontier.indexOf(k) >= 0) ? "#0d1117" : t.ink;
        ctx.font = "bold 15px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(n.name, n.x, n.y);
        if (order[k] !== undefined) {
          ctx.fillStyle = t.accent; ctx.font = "bold 12px sans-serif";
          ctx.fillText("visit " + (order[k] + 1), n.x, n.y - 30);
        }
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "<b>" + mode + "</b> exploring the tree. " +
        "<span style=\"color:" + t.warn + "\">Orange = frontier</span> (" + (mode === "BFS" ? "a queue, take from front" : "a stack, take from top") + "), " +
        "<span style=\"color:" + t.accent2 + "\">green = visited</span>.<br>frontier: [" + frontier.join(", ").replace(/n/g, "") + "]" +
        (done ? " &nbsp;<b>(done)</b>" : "");
    }
    var row = mkRow(host);
    mkBtn(row, "Step", step);
    mkBtn(row, "BFS / DFS", function () { mode = (mode === "BFS") ? "DFS" : "BFS"; reset(); });
    mkBtn(row, "Reset", reset);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "Tree search: BFS (Breadth-First Search), DFS (Depth-First Search), iterative deepening",
  tagline: "Explore possibilities one by one. Go wide, go deep, or do a clever mix.",
  prereqs: ["ai-search-problem"],
  bigIdea:
    `<p>To find a path, we explore states one at a time. The states branch out like a tree.</p>
     <p><b>Breadth-first search (BFS)</b> explores level by level: all nearby states first.</p>
     <p><b>Depth-first search (DFS)</b> dives down one branch as far as it goes, then backs up.</p>
     <p><b>Iterative deepening</b> mixes both: DFS, but with a depth limit that grows step by step.</p>`,
  buildup:
    `<p>From the start state, each action leads to a child state. Each child has its own children. That is a tree.</p>
     <p>The <b>branching factor</b> $b$ is how many children each state has. The <b>depth</b> $d$ is how many steps to the goal.</p>
     <p>We measure an algorithm by its time (states visited) and its space (states held in memory).</p>`,
  symbols: [
    { sym: "$b$", desc: "the branching factor: how many actions (children) each state has." },
    { sym: "$d$", desc: "the depth: how many actions deep the goal is." },
    { sym: "$\\mathcal{O}(b^d)$", desc: "'on the order of $b^d$'. $\\mathcal{O}$ ('big-O') describes how fast cost grows as $d$ grows." },
    { sym: "$b^d$", desc: "$b$ multiplied by itself $d$ times. Grows explosively." }
  ],
  formula: `$$ \\text{time} = \\mathcal{O}(b^d) \\qquad \\text{BFS space} = \\mathcal{O}(b^d) \\qquad \\text{DFS space} = \\mathcal{O}(d) $$`,
  whatItDoes:
    `<p>BFS finds the shallowest goal first, but must remember a whole level: that costs $\\mathcal{O}(b^d)$ memory.</p>
     <p>DFS only remembers the current path, so its memory is tiny, $\\mathcal{O}(d)$. But it can wander down a wrong deep branch.</p>
     <p>Iterative deepening runs DFS with a depth cap of $1$, then $2$, then $3$, and so on. It gets BFS's shallow-goal guarantee with DFS's small memory.</p>`,
  example:
    `<p>A tree with branching factor $b = 2$ and the goal at depth $d = 3$.</p>
     <ul class="steps">
       <li>Number of states at the bottom level: about $2^3 = 8$.</li>
       <li>BFS visits level 1 (2 states), then level 2 (4 states), then level 3 (8 states), finding the goal as soon as it reaches depth $3$.</li>
       <li>DFS might dive straight down one branch first. If the goal is on another branch, it backtracks.</li>
       <li>BFS must hold a full level in memory ($\\mathcal{O}(b^d)$). DFS holds just the path of length $3$ ($\\mathcal{O}(d)$).</li>
     </ul>`,
  application:
    `<p>Puzzle solvers, web crawlers, and game engines all use tree search. The $b^d$ blowup is why we need smarter methods (next lessons) for big problems.</p>`,
  whenToUse:
    `<p><b>Pick the traversal that matches your memory budget and what you need to guarantee.</b> All three explore the same tree; they differ in order, memory, and optimality.</p>
     <p><b>Which one:</b></p>
     <ul>
       <li><b>BFS (Breadth-First Search)</b> — when you need the shallowest goal and all action costs are equal; it finds the fewest-step solution but holds a whole level in memory.</li>
       <li><b>DFS (Depth-First Search)</b> — when memory is tight and any goal will do; it uses only $\\mathcal{O}(d)$ memory but can dive down a wrong branch.</li>
       <li><b>Iterative deepening</b> — when you want BFS's shallowest-goal guarantee with DFS's tiny memory; the default for big trees with unknown depth.</li>
     </ul>
     <p><b>Move beyond plain tree search when:</b></p>
     <ul>
       <li>Action costs vary — use uniform-cost search.</li>
       <li>You have a heuristic toward the goal — use A* to explore far fewer nodes.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>BFS memory blows up.</b> Holding a full frontier costs $\\mathcal{O}(b^d)$ — gigabytes for modest $b$ and $d$. Prefer iterative deepening when the tree is deep.</li>
       <li><b>DFS can loop forever.</b> On a graph with cycles, or an infinitely deep branch, DFS never returns. Add a visited-set or a depth limit.</li>
       <li><b>BFS / DFS ignore cost.</b> Equal-step does not mean equal-cost. If actions have different costs, the shallowest path can be the most expensive — use uniform-cost search.</li>
       <li><b>Re-expanding the same state.</b> In a graph, the same state reappears on many paths. Without a closed set you redo exponential work — switch to graph search.</li>
       <li><b>Iterative deepening looks wasteful but is not.</b> Re-searching shallow levels repeatedly only adds a constant factor, because the bottom level dominates the count. Do not "optimize" it away with a memory-hungry BFS.</li>
       <li><b>Wrong child ordering in DFS.</b> Push children in the order that puts the likely goal first off the stack, or DFS wanders the worst branch first.</li>
     </ul>`,
  quiz: {
    q: `Branching factor $b=3$, goal depth $d=2$. Roughly how many states are at the deepest level, $b^d$?`,
    a: `<p>$b^d = 3^2 = 9$. There are about $9$ states at depth $2$. The count grows fast as $d$ rises.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-graph-search",
  demo: function (host) {
    // Uniform cost search on a small weighted graph. Each Step pops the cheapest
    // frontier node and relaxes its neighbours, updating each node's best-known cost.
    host.innerHTML = "";
    var W = 640, H = 360;
    var nodes = {
      S: { x: 80, y: 180 }, A: { x: 240, y: 80 }, B: { x: 240, y: 280 },
      C: { x: 420, y: 80 }, D: { x: 420, y: 280 }, G: { x: 560, y: 180 }
    };
    var edges = [
      ["S", "A", 1], ["S", "B", 4], ["A", "C", 2], ["A", "B", 2],
      ["B", "D", 1], ["C", "G", 3], ["D", "G", 2], ["C", "D", 1]
    ];
    var nbr = {};
    for (var k0 in nodes) nbr[k0] = [];
    edges.forEach(function (e) { nbr[e[0]].push([e[1], e[2]]); nbr[e[1]].push([e[0], e[2]]); });
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var dist, settled, frontier, last, done;
    function reset() {
      dist = {}; settled = {}; frontier = {}; last = null; done = false;
      for (var k in nodes) dist[k] = Infinity;
      dist.S = 0; frontier.S = true; draw("Start: S has cost 0 on the frontier.");
    }
    function step() {
      if (done) { draw("Search complete."); return; }
      // pop cheapest unsettled frontier node
      var best = null, bc = Infinity;
      for (var k in frontier) { if (!settled[k] && dist[k] < bc) { bc = dist[k]; best = k; } }
      if (best === null) { done = true; draw("Frontier empty. Done."); return; }
      settled[best] = true; delete frontier[best]; last = best;
      var msg = "Popped cheapest frontier node <b>" + best + "</b> (cost " + dist[best] + "). ";
      if (best === "G") { done = true; msg += "It is the goal: shortest cost to G = <b>" + dist.G + "</b>."; draw(msg); return; }
      var relaxed = [];
      nbr[best].forEach(function (e) {
        var v = e[0], w = e[1];
        if (settled[v]) return;
        var nd = dist[best] + w;
        if (nd < dist[v]) { dist[v] = nd; frontier[v] = true; relaxed.push(v + "=" + nd); }
      });
      msg += relaxed.length ? ("Updated neighbours: " + relaxed.join(", ") + ".") : "No cheaper neighbours.";
      draw(msg);
    }
    function draw(msg) {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 2; ctx.strokeStyle = t.border; ctx.font = "12px sans-serif";
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        ctx.beginPath(); ctx.strokeStyle = t.border; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.fillStyle = t.dim; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(e[2]), (a.x + b.x) / 2, (a.y + b.y) / 2 - 8);
      });
      for (var k in nodes) {
        var n = nodes[k], fill = t.panel, ring = t.border;
        if (settled[k]) { fill = t.accent2; ring = t.accent2; }
        else if (frontier[k]) { fill = t.warn; ring = t.warn; }
        if (k === last) ring = t.accent;
        ctx.beginPath(); ctx.fillStyle = fill; ctx.strokeStyle = ring; ctx.lineWidth = (k === last) ? 4 : 2.5;
        ctx.arc(n.x, n.y, 22, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = (settled[k] || frontier[k]) ? "#0d1117" : t.ink;
        ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(k, n.x, n.y - 4);
        ctx.font = "11px sans-serif";
        ctx.fillText(isFinite(dist[k]) ? ("g=" + dist[k]) : "g=∞", n.x, n.y + 10);
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "UCS from <b>S</b> to <b>G</b>. <span style=\"color:" + t.accent2 + "\">Green = settled</span>, " +
        "<span style=\"color:" + t.warn + "\">orange = frontier</span>. <b>g</b> = best cost found so far.<br>" + (msg || "");
    }
    var row = mkRow(host);
    mkBtn(row, "Step (pop cheapest)", step);
    mkBtn(row, "Reset", reset);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "Graph search: dynamic programming and UCS (Uniform Cost Search)",
  tagline: "Don't redo work. Remember states you've solved, and always expand the cheapest one next.",
  prereqs: ["ai-tree-search"],
  bigIdea:
    `<p>Tree search can visit the same state many times. Wasteful.</p>
     <p><b>Graph search</b> remembers states it has already handled, so it never repeats them.</p>
     <p>Two key methods: <b>dynamic programming</b> (memoize the future cost) and <b>uniform cost search</b> (always expand the cheapest-so-far state).</p>`,
  buildup:
    `<p>If two paths reach the same state, the cost to finish from there is the same. So solve each state once and reuse the answer.</p>
     <p>For DP (Dynamic Programming) this works when the graph is <b>acyclic</b>: no loops, so "future cost" is well defined.</p>
     <p>For UCS, costs can vary, so we always pick the state with the smallest cost reached so far.</p>`,
  symbols: [
    { sym: "$\\text{FutureCost}(s)$", desc: "the cheapest cost to get from state $s$ to a goal." },
    { sym: "$\\text{PastCost}(s)$", desc: "the cheapest cost found so far to reach $s$ from the start." },
    { sym: "$\\min$", desc: "'the smallest of'. Picks the lowest value from a set of choices." },
    { sym: "UCS", desc: "uniform cost search: always expand the unexplored state with the smallest PastCost." },
    { sym: "memoize", desc: "store an answer the first time you compute it, then reuse it instead of recomputing." }
  ],
  formula: `$$ \\text{FutureCost}(s) = \\min_{a\\in\\text{Actions}(s)} \\big[\\, \\text{Cost}(s,a) + \\text{FutureCost}(\\text{Succ}(s,a)) \\,\\big] $$`,
  whatItDoes:
    `<p>The formula says: the best future cost from $s$ is the cheapest action now, plus the best future cost from wherever it leads.</p>
     <p>Dynamic programming computes this once per state and stores it (memoizes). Acyclic graphs only.</p>
     <p>Uniform cost search handles loops and any non-negative costs. It pulls out the cheapest frontier state each round, exactly like Dijkstra's algorithm.</p>`,
  example:
    `<p>States $A \\to B \\to D$ and $A \\to C \\to D$. Costs: $A\\to B = 1$, $B\\to D = 4$, $A\\to C = 2$, $C\\to D = 1$.</p>
     <ul class="steps">
       <li>Path through $B$: $1 + 4 = 5$.</li>
       <li>Path through $C$: $2 + 1 = 3$.</li>
       <li>$\\text{FutureCost}(A) = \\min(5, 3) = 3$. The $C$ route wins.</li>
       <li>UCS expands $B$ (PastCost $1$) before $C$ (PastCost $2$), but finally settles $D$ at cost $3$.</li>
     </ul>`,
  application:
    `<p>UCS (as Dijkstra) powers shortest-path routing in networks and maps. Dynamic programming solves scheduling, sequence alignment in biology, and many optimization tasks by reusing sub-answers.</p>`,
  whenToUse:
    `<p><b>Reach for graph search the moment the same state can be reached by many paths</b> — which is true of almost every real problem. Remembering solved states turns an exponential tree into a manageable graph.</p>
     <p><b>Which method:</b></p>
     <ul>
       <li><b>Dynamic programming (DP)</b> — when the graph is acyclic, so "future cost" is well-defined and each state can be solved once and memoized.</li>
       <li><b>Uniform cost search (UCS / Dijkstra)</b> — when there are cycles or varying non-negative costs and you need the cheapest path.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You have a heuristic toward the goal — use A*, which is UCS plus a goal-direction hint and explores far fewer states.</li>
       <li>Edge costs can be negative — Dijkstra is wrong; use Bellman-Ford instead.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>UCS / Dijkstra breaks on negative edges.</b> The "settle the cheapest node once" logic assumes costs never go below zero. A single negative edge gives wrong answers — switch to Bellman-Ford.</li>
       <li><b>DP needs an acyclic graph.</b> Apply dynamic programming to a graph with cycles and the future-cost recursion never bottoms out. Confirm the graph is a DAG (Directed Acyclic Graph) first.</li>
       <li><b>Forgetting the closed set.</b> The whole point is to not re-expand settled states. Skip the visited check and you are back to exponential tree search.</li>
       <li><b>Storing every state runs out of memory.</b> Memoizing or settling every state costs $\\mathcal{O}(\\text{states})$ space. For enormous spaces, prune with a heuristic (A*) instead of remembering everything.</li>
       <li><b>Reconstructing the path.</b> UCS gives the cost but you must store back-pointers to recover the actual route — easy to forget.</li>
       <li><b>Ties and floating-point costs.</b> Equal or near-equal costs can make the frontier order unstable; break ties deterministically for reproducible paths.</li>
     </ul>`,
  quiz: {
    q: `Two ways to reach goal $G$: via $X$ costs $2+2=4$, via $Y$ costs $3+5=8$. What is $\\text{FutureCost}$ of the start, and which route wins?`,
    a: `<p>$\\min(4, 8) = 4$. The route through $X$ wins, at a total cost of $4$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-astar",
  demo: function (host) {
    // 5 rows x 7 cols grid. Start and goal sit INSIDE the grid (same row) so that
    // f = g + h varies: a low corridor between them, rising as you move away.
    var ROWS = 5, COLS = 7;
    var sr = 2, sc = 1, gr = 2, gc = 5;
    function gOf(r, c) { return Math.abs(r - sr) + Math.abs(c - sc); }
    function hOf(r, c) { return Math.abs(r - gr) + Math.abs(c - gc); }
    var fOpt = gOf(gr, gc) + hOf(gr, gc);   // smallest possible f (lies on a shortest path)
    Demos.grid(host, {
      rows: ROWS, cols: COLS, cellSize: 56,
      cell: function (r, c) {
        var f = gOf(r, c) + hOf(r, c);
        var start = (r === sr && c === sc), goal = (r === gr && c === gc), onPath = (f === fOpt);
        var color;
        if (start) color = "#4ea1ff";
        else if (goal) color = "#ffb454";
        else if (onPath) color = "#2e7d32";
        else { var lit = Math.max(12, 34 - (f - fOpt) * 4); color = "hsl(205,28%," + lit + "%)"; }
        return { color: color, label: "f" + f, text: "#e6edf3" };
      },
      readout: function () {
        return "Each cell shows f = g + h (g = steps from <span style=\"color:#4ea1ff\">start</span>, " +
          "h = steps to <span style=\"color:#ffb454\">goal</span>). A* always expands the lowest f first. " +
          "The <span style=\"color:#2e7d32\">green</span> corridor (f = " + fOpt + ") is the cheapest route; " +
          "cells darken as f grows, so A* leaves those for last instead of exploring everywhere.";
      }
    });
  },
  title: "A* search",
  tagline: "Uniform cost search with a hint. Aim toward the goal and reach it much faster.",
  prereqs: ["ai-graph-search"],
  bigIdea:
    `<p>Uniform cost search explores in all directions. It does not know where the goal is.</p>
     <p><b>A* search</b> adds a <b>heuristic</b>: a cheap guess of the remaining distance to the goal.</p>
     <p>It explores states by past cost plus that guess. So it leans toward the goal and skips dead ends.</p>`,
  buildup:
    `<p>Imagine routing across a city. Pure UCS (Uniform Cost Search) spreads out evenly like a circle. Slow.</p>
     <p>But you have a hint: the straight-line distance to the destination. That guess pulls the search the right way.</p>
     <p>A* uses past cost (what you have paid) plus the heuristic (your guess of what is left).</p>`,
  symbols: [
    { sym: "$\\text{PastCost}(s)$", desc: "the cost already paid to reach state $s$ from the start." },
    { sym: "$h(s)$", desc: "the heuristic: a guess of the cost from $s$ to the goal." },
    { sym: "$\\text{Cost}'(s,a)$", desc: "the modified cost A* actually uses for action $a$ (the prime mark means 'modified')." },
    { sym: "$\\le$", desc: "'less than or equal to'. Used to say the heuristic never overshoots." },
    { sym: "admissible", desc: "the heuristic never overestimates: $h(s) \\le$ the true remaining cost." },
    { sym: "consistent", desc: "the heuristic's guess never drops by more than one step's real cost (a stronger, smoother condition)." }
  ],
  formula: `$$ \\text{Cost}'(s,a) = \\text{Cost}(s,a) + h(\\text{Succ}(s,a)) - h(s) $$`,
  whatItDoes:
    `<p>A* is just UCS run on these modified costs. The heuristic terms steer the search toward the goal.</p>
     <p>If the heuristic is <b>admissible</b> ($h \\le$ true remaining cost), A* is guaranteed to find the cheapest path.</p>
     <p>A <b>consistent</b> heuristic is even nicer: it keeps the modified costs non-negative, so the search behaves smoothly.</p>`,
  example:
    `<p>A* ranks states by $f = g + h$, where $g = \\text{PastCost}$ and $h$ is the guess to the goal. It always expands the smallest $f$ first. Two frontier cells, with $h$ = straight-line distance to the goal:</p>
     <ul class="steps">
       <li>Cell $P$ (toward the goal): $g = 2$, $h = 3$, so $f = 2 + 3 = 5$.</li>
       <li>Cell $Q$ (a detour): $g = 2$, $h = 6$, so $f = 2 + 6 = 8$.</li>
       <li>Both cost the same to reach ($g = 2$), but $f_P = 5 &lt; f_Q = 8$. A* expands $P$ first and leaves $Q$ for later. The heuristic, not the past cost, broke the tie toward the goal.</li>
       <li>Plain UCS ignores $h$, so it would treat $P$ and $Q$ as equals ($g = 2$ each) and waste effort on the detour.</li>
       <li>Admissibility check: if $P$'s true remaining cost is $5$, then $h = 3 \\le 5$ never overshoots, so A* is still guaranteed the cheapest path. An $h = 9 &gt; 5$ would overestimate and could break that guarantee.</li>
     </ul>`,
  application:
    `<p>A* is the workhorse of GPS (Global Positioning System) routing and video-game pathfinding. The straight-line distance heuristic lets it find the best route while exploring a tiny fraction of the map.</p>`,
  whenToUse:
    `<p><b>Reach for A* when you need the cheapest path AND you can cheaply estimate the distance to the goal.</b> That goal-direction hint is what makes it far faster than uniform-cost search on large maps.</p>
     <p><b>Choose A* over:</b></p>
     <ul>
       <li><b>Uniform cost search (UCS)</b> — when you have any admissible heuristic; A* explores far fewer nodes for the same optimal answer. With $h = 0$, A* simply degrades back to UCS.</li>
       <li><b>Greedy best-first search</b> — when you need the <i>optimal</i> path, not just a fast one; greedy follows $h$ alone and can return a bad route.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>No good heuristic exists — fall back to UCS or Dijkstra.</li>
       <li>Memory is tight on a huge map — use IDA* (Iterative-Deepening A*) or a weighted/bounded-suboptimal variant.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>A non-admissible heuristic breaks optimality.</b> If $h(s)$ ever overestimates the true remaining cost, A* can return a suboptimal path. Keep $h(s) \\le$ the true cost (straight-line distance is safe for road maps).</li>
       <li><b>Inconsistency causes re-expansions.</b> An admissible but inconsistent heuristic can force A* to reopen settled nodes. Prefer a consistent (monotone) $h$ so each node is expanded once.</li>
       <li><b>A weak heuristic is just slow UCS.</b> If $h$ is near zero everywhere, A* loses its advantage and explores almost the whole map. Invest in a tighter, still-admissible estimate.</li>
       <li><b>Memory still grows.</b> A* keeps the whole frontier and closed set; on giant graphs it can exhaust RAM. Use IDA* or bounded variants when space is the limit.</li>
       <li><b>Mismatched cost units.</b> If $h$ is in miles but edge costs are in minutes, the heuristic silently over- or under-estimates. Put $h$ in the same units as the path cost.</li>
       <li><b>Tie-breaking thrashes.</b> Many cells share the same $f = g + h$. Break ties toward higher $g$ (closer to goal) to cut needless expansions.</li>
     </ul>`,
  quiz: {
    q: `The true remaining cost from a state is $7$. Is a heuristic of $h=6$ admissible? Is $h=8$ admissible?`,
    a: `<p>$h=6$ is admissible because $6 \\le 7$ (it does not overshoot). $h=8$ is not, because $8 &gt; 7$ overestimates, which can break A*'s guarantee.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-mdp",
  demo: function (host) {
    gridworldDemo(host, {
      label: "A 4×3 gridworld MDP: a <b>+1 goal</b>, a <b>−1 pit</b>, a wall. Actions move the agent between states; rewards are collected. " +
        "Iterate to fill in each state's value V(s) and the best action (sweep {n})."
    });
  },
  title: "Markov Decision Processes (MDPs)",
  tagline: "Planning when actions are unreliable. Sometimes you slip, so plan with the odds.",
  prereqs: ["ai-search-problem", "prob-conditional"],
  bigIdea:
    `<p>In a search problem, an action always lands you where you expect. The real world is not so tidy.</p>
     <p>A <b>Markov Decision Process</b> handles randomness: an action might lead to different states by chance.</p>
     <p>We also collect <b>rewards</b> along the way, and prefer rewards sooner via a <b>discount</b>.</p>`,
  buildup:
    `<p>Picture a robot on ice. It tries to move right, but might slip and go up instead.</p>
     <p>So each action has a probability of landing in each possible next state.</p>
     <p>"Markov" means the next state depends only on the current state and action, not the whole history.</p>`,
  symbols: [
    { sym: "$s$", desc: "a state (the current situation)." },
    { sym: "$a$", desc: "an action the agent can take." },
    { sym: "$s'$", desc: "a possible next state ($s$-prime, read 's prime')." },
    { sym: "$T(s,a,s')$", desc: "the transition probability: the chance of landing in $s'$ after doing $a$ in $s$. It is a conditional probability." },
    { sym: "$\\text{Reward}(s,a,s')$", desc: "the reward earned for that particular move." },
    { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), a number in $[0,1]$. Smaller means future rewards count less." },
    { sym: "$\\gamma\\in[0,1]$", desc: "$\\gamma$ is between $0$ and $1$. $1$ = patient, $0$ = only the next reward matters." }
  ],
  formula: `$$ \\sum_{s'} T(s,a,s') = 1 \\qquad \\gamma \\in [0,1] $$`,
  whatItDoes:
    `<p>For a fixed state and action, the transition probabilities over all next states add up to $1$ (something must happen).</p>
     <p>Each move pays a reward. The discount $\\gamma$ shrinks rewards that come later, so the agent prefers sooner gains.</p>
     <p>The agent's job is to choose actions that earn the most reward over time, given the randomness.</p>`,
  example:
    `<p>Robot tries to move right. Outcomes: $80\\%$ it goes right, $20\\%$ it slips up.</p>
     <ul class="steps">
       <li>$T(s, \\text{right}, \\text{right-cell}) = 0.8$ and $T(s, \\text{right}, \\text{up-cell}) = 0.2$.</li>
       <li>Check: $0.8 + 0.2 = 1$. The probabilities sum to $1$. Good — something must happen.</li>
       <li>Reward for reaching the right-cell: $+5$. For slipping up: $0$.</li>
       <li>Plan with the odds: the <i>expected</i> reward of "right" is $0.8\\times5 + 0.2\\times0 = 4$, not the $5$ you would assume if the move always worked.</li>
       <li>That gap between $4$ and $5$ is exactly the cost of randomness. The agent must reason about it, not ignore it.</li>
     </ul>`,
  application:
    `<p>MDPs model robot control, inventory restocking, self-driving decisions, and game AI (Artificial Intelligence), where actions do not always work and the future is uncertain. They are the foundation of reinforcement learning.</p>`,
  whenToUse:
    `<p><b>Model a problem as an MDP when actions are unreliable, you collect rewards over time, and the next state depends only on the current state and action.</b> It is the right frame for sequential decisions under uncertainty.</p>
     <p><b>Choose an MDP over:</b></p>
     <ul>
       <li><b>Deterministic search</b> — when actions can fail or slip; search plans a brittle single path, an MDP plans a policy that handles every outcome.</li>
       <li><b>A one-shot reflex model</b> — when decisions compound over time and a reward now trades off against rewards later.</li>
     </ul>
     <p><b>Pick a different framework when:</b></p>
     <ul>
       <li>You cannot fully observe the state — use a Partially Observable MDP (POMDP) or a Hidden Markov Model (HMM).</li>
       <li>You do not know the transition probabilities or rewards — use reinforcement learning (for example Q-learning) to learn them from experience.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The Markov assumption can fail silently.</b> If the right decision depends on history, not just the current state, your MDP is mis-specified. Fold the needed history into the state.</li>
       <li><b>Reward shaping changes behavior.</b> Reward the wrong thing and the agent games it (it reaches the cell, not the goal). Reward outcomes you actually want, sparingly.</li>
       <li><b>Discount choice matters.</b> A $\\gamma$ near $1$ values the far future and can diverge or learn slowly; a small $\\gamma$ makes the agent myopic. Pick it to match your real time horizon.</li>
       <li><b>Transitions must be valid probabilities.</b> For each $(s,a)$, the outcomes must sum to $1$. An un-normalized table corrupts every value computed from it.</li>
       <li><b>State-space blow-up.</b> Cross-producting many variables makes states explode. Use function approximation or factored representations rather than a giant table.</li>
       <li><b>Confusing expected and actual reward.</b> Plan with the <i>expected</i> value of an action, not the value assuming it always succeeds — that gap is the cost of randomness.</li>
     </ul>`,
  quiz: {
    q: `An action has $T(s,a,s_1)=0.7$ and one other possible outcome $s_2$. What must $T(s,a,s_2)$ be?`,
    a: `<p>The probabilities must sum to $1$, so $T(s,a,s_2) = 1 - 0.7 = 0.3$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-policy-value",
  demo: function (host) {
    gridworldDemo(host, {
      label: "Gridworld <b>policy + value</b>. The blue arrow in each cell is the policy π(s): which action to take. " +
        "The number is V<sub>π</sub>(s): the value of following that policy from that cell (sweep {n})."
    });
  },
  title: "Policies and values",
  tagline: "A policy is your game plan. Its value is how much reward that plan earns on average.",
  prereqs: ["ai-mdp", "prob-expectation"],
  bigIdea:
    `<p>A <b>policy</b> tells the agent what to do: in each state, pick this action.</p>
     <p>The <b>value</b> of a policy at a state is the average total reward you collect by following it from there.</p>
     <p>Because actions are random, we average. And later rewards are discounted by $\\gamma$.</p>`,
  buildup:
    `<p>From the MDP (Markov Decision Process) lesson: actions are uncertain and rewards are discounted.</p>
     <p>A policy $\\pi$ is a rule: state in, action out. Follow it and you get a (random) stream of rewards.</p>
     <p>The <b>utility</b> of one run is the discounted sum of those rewards. The <b>value</b> is its average.</p>`,
  symbols: [
    { sym: "$\\pi$", desc: "a policy (Greek 'pi'): a rule mapping each state to an action." },
    { sym: "$\\pi: s \\mapsto a$", desc: "read 'pi sends state $s$ to action $a$'. The $\\mapsto$ means 'maps to'." },
    { sym: "$V_\\pi(s)$", desc: "the value of policy $\\pi$ at state $s$: the expected discounted reward starting from $s$." },
    { sym: "$u$", desc: "the utility of one run: the discounted total of the rewards actually received." },
    { sym: "$r_i$", desc: "the reward received at step $i$." },
    { sym: "$\\gamma^{i-1}$", desc: "the discount applied to step $i$: $\\gamma$ raised to the power $i-1$. Later steps shrink more." }
  ],
  formula: `$$ u = \\sum_{i} r_i\\,\\gamma^{\\,i-1} \\qquad V_\\pi(s) = \\text{expected value of } u \\text{ when following } \\pi \\text{ from } s $$`,
  whatItDoes:
    `<p>The utility $u$ adds up the rewards, but discounts each one. Step $1$ counts fully ($\\gamma^0 = 1$). Step $2$ is scaled by $\\gamma$. Step $3$ by $\\gamma^2$. And so on.</p>
     <p>The value $V_\\pi(s)$ is the <i>expected</i> (average) utility, because the outcomes are random.</p>
     <p>A good policy has high value everywhere.</p>`,
  example:
    `<p>A policy gives rewards $r_1 = 10$, then $r_2 = 10$, then $r_3 = 10$. Discount $\\gamma = 0.5$.</p>
     <ul class="steps">
       <li>Step 1: $10\\times\\gamma^0 = 10\\times1 = 10$.</li>
       <li>Step 2: $10\\times\\gamma^1 = 10\\times0.5 = 5$.</li>
       <li>Step 3: $10\\times\\gamma^2 = 10\\times0.25 = 2.5$.</li>
       <li>Utility $u = 10 + 5 + 2.5 = 17.5$. Later rewards counted for less.</li>
     </ul>
     <p>With no randomness here, the value equals this utility, $17.5$.</p>`,
  application:
    `<p>Policies are the decision rules learned by game AI (Artificial Intelligence), trading bots, and robot controllers. Discounting models the fact that a reward now is usually worth more than the same reward later.</p>`,
  whenToUse:
    `<p><b>This shows up whenever you need to compare two plans inside an MDP (Markov Decision Process).</b> The policy is the plan; its value is the yardstick that says which plan is better, averaging over the world's randomness.</p>
     <p><b>It unlocks:</b></p>
     <ul>
       <li><b>Policy evaluation</b> — fix a policy and compute its value everywhere, the inner loop of policy iteration.</li>
       <li><b>Comparing controllers</b> — pick the policy with the higher value $V_\\pi(s)$ at the states you care about.</li>
     </ul>
     <p><b>Reach further when:</b></p>
     <ul>
       <li>You want the <i>best</i> policy, not the value of a given one — use value iteration or policy iteration.</li>
       <li>You also need to rate a specific action, not just a state — use Q-values.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Value is an average, not a guarantee.</b> $V_\\pi(s)$ is the <i>expected</i> return; any single run can be much worse. For risk-sensitive settings, look at the spread, not just the mean.</li>
       <li><b>Wrong discount exponent.</b> Step $i$ is weighted by $\\gamma^{i-1}$, not $\\gamma^i$ — an off-by-one in the power silently mis-values every plan.</li>
       <li><b>Undiscounted infinite horizons can diverge.</b> With $\\gamma = 1$ and no terminal state, the discounted sum may not converge. Keep $\\gamma &lt; 1$ or guarantee episodes end.</li>
       <li><b>A high-value policy can be unsafe.</b> Maximizing average reward may accept rare catastrophic outcomes. Encode hard constraints in the reward or the action set.</li>
       <li><b>Comparing values across different MDPs is meaningless.</b> Values only rank policies within the same reward and discount setup; rescaling rewards rescales every value.</li>
     </ul>`,
  quiz: {
    q: `Rewards $r_1=4$, $r_2=4$, with $\\gamma=0.5$. What is the discounted utility $u$?`,
    a: `<p>$u = 4\\times1 + 4\\times0.5 = 4 + 2 = 6$. The second reward is discounted to $2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-qvalue",
  demo: function (host) {
    gridworldDemo(host, {
      label: "Each cell's value is the best <b>Q-value</b> over its actions: V(s) = max<sub>a</sub> Q(s,a), where " +
        "Q(s,a) = R + γ·V(s′). The blue arrow points to the action with the highest Q (sweep {n})."
    });
  },
  title: "Q-values",
  tagline: "How good is taking action a in state s? Average over where it might land you.",
  prereqs: ["ai-policy-value"],
  bigIdea:
    `<p>A value $V_\\pi(s)$ rates a <i>state</i>. A <b>Q-value</b> $Q_\\pi(s,a)$ rates a state <i>and</i> a chosen action.</p>
     <p>It answers: if I take action $a$ now, then follow policy $\\pi$ after, how much reward do I expect?</p>
     <p>Because the action is uncertain, we average over every possible next state, weighted by its probability.</p>`,
  buildup:
    `<p>Doing action $a$ leads to several possible next states $s'$, each with probability $T(s,a,s')$.</p>
     <p>For each one, you collect an immediate reward, then the value of carrying on from $s'$.</p>
     <p>Average those over all next states, weighting by their probabilities. That is the Q-value.</p>`,
  symbols: [
    { sym: "$Q_\\pi(s,a)$", desc: "the Q-value: expected reward of taking action $a$ in state $s$, then following $\\pi$." },
    { sym: "$\\sum_{s'}$", desc: "add up over every possible next state $s'$." },
    { sym: "$T(s,a,s')$", desc: "the probability of landing in $s'$ after action $a$ in $s$." },
    { sym: "$\\text{Reward}(s,a,s')$", desc: "the immediate reward for that move." },
    { sym: "$\\gamma V_\\pi(s')$", desc: "the discounted value of continuing from the next state $s'$." }
  ],
  formula: `$$ Q_\\pi(s,a) = \\sum_{s'} T(s,a,s')\\,\\big[\\,\\text{Reward}(s,a,s') + \\gamma\\,V_\\pi(s')\\,\\big] $$`,
  whatItDoes:
    `<p>For each possible next state $s'$: take its reward, add the discounted value of continuing from there.</p>
     <p>Weight that by how likely $s'$ is, $T(s,a,s')$. Sum over all $s'$.</p>
     <p>The result is the average worth of choosing action $a$ right now.</p>`,
  example:
    `<p>Action $a$ has two outcomes. $80\\%$: reward $5$, next-state value $V=10$. $20\\%$: reward $0$, next-state value $V=0$. Discount $\\gamma = 0.5$.</p>
     <ul class="steps">
       <li>Good outcome term: $0.8\\times[\\,5 + 0.5\\times10\\,] = 0.8\\times[5 + 5] = 0.8\\times10 = 8$.</li>
       <li>Bad outcome term: $0.2\\times[\\,0 + 0.5\\times0\\,] = 0.2\\times0 = 0$.</li>
       <li>Q-value: $8 + 0 = 8$. That is the average worth of action $a$ here.</li>
     </ul>`,
  application:
    `<p>Q-values are the heart of reinforcement learning. A game AI (Artificial Intelligence) compares the Q-value of each move and picks the highest. They let an agent rate actions without simulating the whole future by hand.</p>`,
  whenToUse:
    `<p><b>Use Q-values when you need to choose an action, not just rate a state.</b> A state value $V(s)$ tells you how good a position is; a Q-value $Q(s,a)$ tells you which move to make, which is what an agent actually needs.</p>
     <p><b>It unlocks:</b></p>
     <ul>
       <li><b>Acting greedily</b> — pick $\\arg\\max_a Q(s,a)$ with no extra lookahead or model rollout.</li>
       <li><b>Model-free learning</b> — Q-learning estimates $Q$ directly from experience, without ever knowing the transition table $T$.</li>
     </ul>
     <p><b>Reach for something else when:</b></p>
     <ul>
       <li>The action space is continuous or huge — tabular Q-values do not fit; use a policy-gradient method or an actor-critic.</li>
       <li>You only need to evaluate one fixed plan — a state value $V_\\pi$ is enough.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Forgetting to weight by transition probability.</b> The Q-value averages over <i>every</i> next state $s'$, weighted by $T(s,a,s')$ — not just the most likely one. Drop the weighting and the value is wrong.</li>
       <li><b>Mixing up immediate and future reward.</b> Each term is reward <i>plus</i> discounted future value, $R + \\gamma V(s')$. Omitting either piece breaks the recursion.</li>
       <li><b>Tabular Q does not scale.</b> One entry per state-action pair blows up for large spaces. Approximate $Q$ with a function (a network) instead.</li>
       <li><b>Stale $V(s')$ values.</b> A Q-value is only as good as the next-state values it is built from; during learning those are still moving, so early Q-values are unreliable.</li>
       <li><b>Greedy action selection while still learning.</b> Always taking the current best $Q$ means you never explore better moves. Mix in exploration (epsilon-greedy).</li>
     </ul>`,
  quiz: {
    q: `One outcome only: probability $1$, reward $6$, next-state value $V=4$, $\\gamma=0.5$. What is $Q(s,a)$?`,
    a: `<p>$Q = 1\\times[\\,6 + 0.5\\times4\\,] = 6 + 2 = 8$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-value-iteration",
  demo: function (host) {
    gridworldDemo(host, {
      stepLabel: "Run one Bellman sweep",
      label: "<b>Value iteration</b> in action. Press the button to run one Bellman backup over every cell. " +
        "Watch the values spread out from the goal and the arrows settle into the optimal policy π* (sweep {n}). " +
        "After enough sweeps they stop changing — that is convergence."
    });
  },
  title: "Value iteration",
  tagline: "Guess the values, improve them with the best action, repeat until they settle.",
  prereqs: ["ai-qvalue"],
  bigIdea:
    `<p>We want the <i>best</i> value for each state, not the value of some given policy.</p>
     <p><b>Value iteration</b> starts with rough guesses and improves them round by round.</p>
     <p>Each round, a state takes the value of its <i>best</i> action. Repeat until the values stop changing.</p>`,
  buildup:
    `<p>From the Q-value lesson: each action in a state has a Q-value. The best move is the one with the largest Q-value.</p>
     <p>If we knew the true values, computing Q-values would be easy. But we do not, so we iterate.</p>
     <p>This repeated improvement is called a <b>Bellman update</b>, after Richard Bellman.</p>`,
  symbols: [
    { sym: "$V^{(t)}(s)$", desc: "the value estimate for state $s$ at round $t$. The superscript $(t)$ is the round number." },
    { sym: "$Q^{(t-1)}(s,a)$", desc: "the Q-value computed using the previous round's value estimates." },
    { sym: "$\\max_a$", desc: "'the largest over all actions $a$'. Picks the best action's value." },
    { sym: "$\\arg\\max_a$", desc: "the action $a$ that achieves that largest value (the best action itself)." },
    { sym: "$\\pi^*(s)$", desc: "the optimal policy: the best action to take in state $s$ (star means 'optimal')." }
  ],
  formula: `$$ V^{(t)}(s) \\leftarrow \\max_a Q^{(t-1)}(s,a) \\qquad\\quad \\pi^*(s) = \\arg\\max_a Q(s,a) $$`,
  whatItDoes:
    `<p>Each round, update every state to the value of its best available action, using last round's values.</p>
     <p>$\\max_a$ gives the best <i>number</i>. $\\arg\\max_a$ gives the best <i>action</i>.</p>
     <p>The values keep improving until they barely change. At that point, reading off $\\arg\\max$ in every state gives the optimal policy $\\pi^*$.</p>`,
  example:
    `<p>One Bellman backup. State $s$ has two actions. Last round's neighbour values were $V^{(t-1)} = 0$ everywhere except the goal cell, worth $10$. Step reward $R = -1$, discount $\\gamma = 0.9$. Build each Q-value from $Q = R + \\gamma\\,V^{(t-1)}(s')$:</p>
     <ul class="steps">
       <li>$Q(s,\\text{right})$: right leads to the goal cell ($V = 10$), so $Q = -1 + 0.9\\times10 = -1 + 9 = 8$.</li>
       <li>$Q(s,\\text{left})$: left leads to an empty cell ($V = 0$), so $Q = -1 + 0.9\\times0 = -1$.</li>
       <li>Backup: $V^{(t)}(s) = \\max(8, -1) = 8$. The state's value jumps from $0$ to $8$ in one sweep.</li>
       <li>$\\pi^*(s) = \\arg\\max(8, -1) = \\text{right}$. Right is the best action.</li>
       <li>Next sweep reuses this $8$ to back up the neighbours. When the values stop moving, the plan is optimal.</li>
     </ul>`,
  application:
    `<p>Value iteration solves MDPs (Markov Decision Processes) exactly when the model is known: robot navigation, inventory control, board-game endgames. It is the textbook way to compute an optimal policy.</p>`,
  whenToUse:
    `<p><b>Use value iteration when you know the full MDP model</b> — the transitions $T$ and rewards — <b>and the state space is small enough to sweep.</b> It computes the optimal policy exactly, no learning required.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Policy iteration</b> — when you prefer many cheap Bellman backups to fewer, costlier full policy evaluations; both converge to $\\pi^*$, value iteration is simpler to code.</li>
       <li><b>Just evaluating one policy</b> — when you want the <i>best</i> policy, not the value of a fixed one; the $\\max_a$ is what optimizes.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You do not know $T$ or the rewards — use Q-learning, which learns from experience.</li>
       <li>The state space is huge or continuous — use approximate dynamic programming or a function approximator; a full sweep is infeasible.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>It needs the model.</b> Value iteration assumes you know $T(s,a,s')$ and the rewards exactly. Without them you cannot run a single backup — that is what reinforcement learning is for.</li>
       <li><b>Convergence depends on the discount.</b> A $\\gamma$ close to $1$ makes the values converge slowly; with $\\gamma = 1$ and no terminal state they may never settle. Keep $\\gamma &lt; 1$ or guarantee episodes end.</li>
       <li><b>Stopping too early.</b> Halt before the values stop moving and the extracted policy is suboptimal. Iterate until the largest change (the Bellman residual) drops below a small threshold.</li>
       <li><b>Each sweep is $\\mathcal{O}(\\text{states} \\times \\text{actions} \\times \\text{successors})$.</b> Large spaces make every sweep expensive. Use prioritized sweeping or asynchronous updates.</li>
       <li><b>Reusing the wrong round's values.</b> A synchronous sweep should back up from the <i>previous</i> round's estimates; mixing in this round's half-updated values changes the dynamics.</li>
       <li><b>Floating-point ties in $\\arg\\max$.</b> Near-equal Q-values make the greedy policy flicker between actions; break ties deterministically.</li>
     </ul>`,
  quiz: {
    q: `A state's actions have Q-values $Q(\\text{up})=2$, $Q(\\text{down})=9$, $Q(\\text{stay})=5$. What is the new value, and the optimal action?`,
    a: `<p>$V = \\max(2,9,5) = 9$. The optimal action is $\\arg\\max = \\text{down}$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-q-learning",
  demo: function (host) {
    gridworldDemo(host, {
      stepLabel: "Learn (one sweep)",
      label: "The same gridworld, but imagine the agent does not know the map and learns by acting. " +
        "Each sweep nudges every cell's value toward r + γ·V(s′), exactly what Q-learning does from experience. " +
        "The arrows are its current best guess at the policy (sweep {n})."
    });
  },
  title: "Q-learning (model-free)",
  tagline: "No map of the world? Learn the value of actions by trying them and seeing what happens.",
  prereqs: ["ai-qvalue", "ai-value-iteration"],
  bigIdea:
    `<p>Value iteration needs the transition probabilities $T$. Often we do not have them.</p>
     <p><b>Q-learning</b> learns Q-values directly from experience. No model needed.</p>
     <p>The agent acts, sees the reward, and nudges its Q-value estimate toward what it just observed.</p>`,
  buildup:
    `<p>The agent keeps an estimate $\\hat Q(s,a)$ for each state-action pair (the hat means 'estimated').</p>
     <p>It takes action $a$ in state $s$, gets reward $r$, and lands in $s'$.</p>
     <p>It then blends its old estimate with this new evidence, controlled by a learning rate $\\eta$.</p>`,
  symbols: [
    { sym: "$\\hat Q(s,a)$", desc: "the current estimate of the Q-value (the hat means 'estimated, not exact')." },
    { sym: "$\\eta$", desc: "the learning rate (Greek 'eta'), between $0$ and $1$: how much to trust the new observation." },
    { sym: "$r$", desc: "the reward just received after acting." },
    { sym: "$s'$", desc: "the state just landed in." },
    { sym: "$\\max_{a'} \\hat Q(s',a')$", desc: "the best estimated Q-value from the new state $s'$, over all next actions $a'$." },
    { sym: "epsilon-greedy", desc: "act greedily (best known action) most of the time, but explore a random action with a small probability epsilon." }
  ],
  formula: `$$ \\hat Q(s,a) \\leftarrow (1-\\eta)\\,\\hat Q(s,a) + \\eta\\,\\big[\\,r + \\gamma\\,\\max_{a'} \\hat Q(s',a')\\,\\big] $$`,
  whatItDoes:
    `<p>The new estimate is a blend. Keep a $(1-\\eta)$ share of the old value, and mix in an $\\eta$ share of the fresh target.</p>
     <p>The target is the reward just seen plus the discounted best value from the new state.</p>
     <p><b>Explore vs exploit</b>: to learn, the agent sometimes tries random actions (explore), but mostly takes its current best (exploit). Epsilon-greedy balances these.</p>`,
  example:
    `<p>Current estimate $\\hat Q(s,a) = 4$. The agent acts and sees reward $r = 10$. Best next value $\\max_{a'}\\hat Q(s',a') = 0$. Use $\\eta = 0.5$, $\\gamma = 0.5$.</p>
     <ul class="steps">
       <li>Target: $r + \\gamma\\times0 = 10 + 0.5\\times0 = 10$.</li>
       <li>Blend: $(1-0.5)\\times4 + 0.5\\times10 = 2 + 5 = 7$.</li>
       <li>New estimate $\\hat Q(s,a) = 7$. It moved from $4$ up toward the observed $10$.</li>
       <li>More trials pull it closer to the true value.</li>
     </ul>`,
  application:
    `<p>Q-learning trained early game-playing agents and robot controllers without a known model. Deep Q-Networks (DQN) used this idea, with a neural network, to learn Atari games straight from pixels.</p>`,
  whenToUse:
    `<p><b>Reach for Q-learning when you do NOT know the MDP (Markov Decision Process) model and must learn by acting.</b> The agent tries actions, sees rewards, and bootstraps Q-values from experience — no transition table needed.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Value / policy iteration</b> — when $T$ and the rewards are unknown; those methods need the model, Q-learning does not.</li>
       <li><b>SARSA (on-policy)</b> — when you want the optimal greedy policy regardless of how you explore; Q-learning is off-policy, so it can learn the best policy while behaving exploratorily.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The state or action space is large or continuous — use a Deep Q-Network (DQN) or a policy-gradient method; a Q-table will not fit.</li>
       <li>The model is actually known and small — value iteration is faster and exact.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>No exploration, no learning.</b> Always taking the current best action traps the agent in a local habit. Use epsilon-greedy (or another exploration scheme) and decay it over time.</li>
       <li><b>Learning rate must decay.</b> A fixed $\\eta$ never lets the estimates settle. Shrink $\\eta$ as visits accumulate so Q-values converge.</li>
       <li><b>Sparse or delayed rewards stall it.</b> If reward only comes at the very end, credit propagates one step per visit and learning crawls. Use reward shaping or eligibility traces.</li>
       <li><b>Tabular Q does not scale.</b> One cell per state-action pair is hopeless for big spaces. Move to function approximation — but then watch for instability.</li>
       <li><b>Function-approximation divergence.</b> Naive deep Q-learning can oscillate or blow up. Stabilize it with a replay buffer and a target network, as DQN does.</li>
       <li><b>Maximization bias.</b> The $\\max_{a'}$ over noisy estimates systematically over-estimates Q-values. Double Q-learning corrects this.</li>
     </ul>`,
  quiz: {
    q: `$\\hat Q=2$, reward $r=8$, best next value $0$, $\\gamma=0.5$, $\\eta=0.5$. What is the updated $\\hat Q$?`,
    a: `<p>Target $= 8 + 0.5\\times0 = 8$. Blend $= 0.5\\times2 + 0.5\\times8 = 1 + 4 = 5$. The new estimate is $5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-minimax",
  demo: function (host) {
    Demos.tree(host, { type: "minimax", leaves: [3, 5, 2, 9], min: 0, max: 10 });
  },
  title: "Minimax (game playing)",
  tagline: "You play to win, your opponent plays to beat you. Plan for their best reply.",
  bigIdea:
    `<p>In a two-player game, you and an opponent take turns. You want a high score. They want it low.</p>
     <p><b>Minimax</b> assumes the opponent plays perfectly against you.</p>
     <p>On your turn you take the <i>max</i>. On their turn they take the <i>min</i>. Work this up the game tree.</p>`,
  buildup:
    `<p>Lay out the game as a tree. Each node is a position. Each branch is a move.</p>
     <p>At the bottom (leaves) are final scores: good for you means a high number.</p>
     <p>Work upward. At your nodes, take the best (max) child. At opponent nodes, take the worst-for-you (min) child.</p>`,
  symbols: [
    { sym: "$V(s)$", desc: "the minimax value of position $s$: the score with both sides playing perfectly." },
    { sym: "$\\max$", desc: "'the largest of'. Used at your nodes, since you want the highest score." },
    { sym: "$\\min$", desc: "'the smallest of'. Used at opponent nodes, since they want your lowest score." },
    { sym: "leaf", desc: "a node at the bottom of the tree, a finished game with a known score." },
    { sym: "max node", desc: "a position where it is your move (you pick the max)." },
    { sym: "min node", desc: "a position where it is the opponent's move (they pick the min)." }
  ],
  formula: `$$ V(s) = \\begin{cases} \\max_a V(\\text{Succ}(s,a)) & \\text{your move} \\\\ \\min_a V(\\text{Succ}(s,a)) & \\text{opponent's move} \\end{cases} $$`,
  whatItDoes:
    `<p>Each node takes the best value it can force, given whose turn it is.</p>
     <p>You maximize. The opponent minimizes. The value flows up from the leaves to the root.</p>
     <p>The root value tells you the best outcome you can guarantee against perfect play.</p>`,
  example:
    `<p>Your move at the top. Two choices, $A$ and $B$. After each, the opponent moves.</p>
     <ul class="steps">
       <li>Branch $A$ leads to leaves with scores $3$ and $8$. The opponent (min) picks $\\min(3,8) = 3$.</li>
       <li>Branch $B$ leads to leaves with scores $5$ and $2$. The opponent (min) picks $\\min(5,2) = 2$.</li>
       <li>Now your turn (max): choose $\\max(3, 2) = 3$. So pick branch $A$.</li>
       <li>The minimax value of the game is $3$. That is what you can guarantee.</li>
     </ul>`,
  application:
    `<p>Minimax drives classic game engines for chess, checkers, and tic-tac-toe. It assumes a tough opponent, so its plans are safe even against the best play.</p>`,
  whenToUse:
    `<p><b>Use minimax for two-player, zero-sum, perfect-information games against an opponent who plays to beat you.</b> It gives the safe move: the best you can guarantee no matter how well the opponent replies.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A single-agent search</b> — when there is an adversary; ordinary search assumes you control every move, minimax alternates max and min.</li>
       <li><b>Expectimax</b> — when the opponent is a strong, deliberate player rather than random; the worst-case min is the right model.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The opponent or environment is random — use expectimax (average, not worst case).</li>
       <li>The game tree is too deep to reach the leaves — add an evaluation function and a depth cutoff, and prune with alpha-beta.</li>
       <li>The branching factor is enormous (Go) — use Monte Carlo Tree Search (MCTS) instead.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The tree is too big to search fully.</b> Real games have astronomically many positions. You must cut off at a depth and apply a heuristic <b>evaluation function</b> to non-terminal leaves.</li>
       <li><b>A bad evaluation function dooms the search.</b> Below the cutoff, the leaf scores are guesses; a poor heuristic makes deep search confidently wrong. Tune it carefully.</li>
       <li><b>Assuming a perfect opponent against a weak one.</b> Minimax leaves easy wins on the table when the real opponent blunders — model a random or imperfect opponent with expectimax.</li>
       <li><b>The horizon effect.</b> A fixed depth can hide a disaster just past the cutoff, so the agent "delays" bad news. Use quiescence search to extend volatile lines.</li>
       <li><b>Sign / perspective bugs.</b> Mixing up whose turn maximizes flips the whole evaluation. Keep one consistent convention (high = good for you).</li>
       <li><b>Ignoring repeated positions.</b> The same board reached by different move orders is re-searched; use a transposition table to cache it.</li>
     </ul>`,
  quiz: {
    q: `Your move. Branch $A$'s opponent reply gives $\\min(6,1)$; branch $B$'s gives $\\min(4,4)$. Which branch do you pick, and what is the value?`,
    a: `<p>Branch $A$: $\\min(6,1)=1$. Branch $B$: $\\min(4,4)=4$. You max: $\\max(1,4)=4$, so pick branch $B$. Value is $4$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-alpha-beta",
  demo: function (host) {
    Demos.tree(host, { type: "minimax", leaves: [3, 5, 2, 9], min: 0, max: 10 });
  },
  title: "Alpha-beta pruning",
  tagline: "Skip branches that cannot change your decision. Same answer, far less work.",
  prereqs: ["ai-minimax"],
  bigIdea:
    `<p>Minimax explores the whole game tree. That can be enormous.</p>
     <p><b>Alpha-beta pruning</b> skips branches that cannot possibly affect the final choice.</p>
     <p>It gives the exact same answer as minimax, but explores far fewer nodes.</p>`,
  buildup:
    `<p>As you search, you track the best score each side has already secured.</p>
     <p>If a branch is already worse than something you can guarantee elsewhere, stop. Do not explore it further.</p>
     <p>Two bookkeeping values do this: alpha and beta.</p>`,
  symbols: [
    { sym: "$\\alpha$", desc: "alpha: the best score the maximizing player can guarantee so far (Greek 'alpha')." },
    { sym: "$\\beta$", desc: "beta: the best (lowest) score the minimizing player can guarantee so far (Greek 'beta')." },
    { sym: "prune", desc: "stop exploring a branch because it cannot change the final decision." },
    { sym: "$\\ge$", desc: "'greater than or equal to'. Used to trigger a cutoff." }
  ],
  formula: `$$ \\text{prune when } \\alpha \\ge \\beta $$`,
  whatItDoes:
    `<p>While searching, update $\\alpha$ (max's best so far) and $\\beta$ (min's best so far).</p>
     <p>If $\\alpha \\ge \\beta$, the current branch can never beat what is already settled. Cut it off.</p>
     <p>The final root value is identical to plain minimax. Only wasted exploration is removed.</p>`,
  example:
    `<p>Your move (max). You already found branch $A$ gives a guaranteed $5$. Now you start exploring branch $B$ (an opponent min node).</p>
     <ul class="steps">
       <li>From branch $A$, you have $\\alpha = 5$ secured.</li>
       <li>In branch $B$, the opponent's first reply already gives a score of $2$.</li>
       <li>Branch $B$'s value is $\\min(2, \\dots)$, so it is at most $2$ no matter what the other replies are.</li>
       <li>Since $2 &lt; 5$, branch $B$ can never beat branch $A$. Prune it. Skip the remaining replies.</li>
     </ul>
     <p>You reached the same decision (branch $A$) without checking the rest of $B$.</p>`,
  application:
    `<p>Alpha-beta pruning is what made strong chess programs practical, including Deep Blue. By skipping doomed branches, it searches several moves deeper in the same time.</p>`,
  whenToUse:
    `<p><b>Apply alpha-beta whenever you run minimax — it is a free upgrade.</b> Same exact answer, far fewer nodes, so you can search several plies deeper in the same time.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Plain minimax</b> — always, for adversarial search; there is no downside, only skipped branches that could not change the decision.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The branching factor is huge (Go) — even pruned, the tree is too big; use Monte Carlo Tree Search (MCTS).</li>
       <li>The node is a chance node, not an opponent node — alpha-beta does not prune random averages cleanly; use expectimax with care.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Move ordering makes or breaks it.</b> Pruning power depends entirely on trying strong moves first. With perfect ordering you search $\\mathcal{O}(b^{d/2})$ nodes; with the worst ordering you save nothing. Order by a quick heuristic or iterative deepening.</li>
       <li><b>It does not change the answer.</b> A common bug is "pruning" a branch that could actually matter — alpha-beta only skips branches that provably cannot affect the root. If your pruned result differs from minimax, the cutoff logic is wrong.</li>
       <li><b>Off-by-one on the cutoff test.</b> Prune when $\\alpha \\ge \\beta$, and update the right bound at max vs min nodes. Swapping them silently breaks correctness.</li>
       <li><b>Still bounded by depth.</b> Pruning lets you go deeper but never to the leaves of a big game. You still need an evaluation function at the cutoff.</li>
       <li><b>Transpositions interact subtly.</b> Caching node values with a transposition table alongside alpha-beta needs care — stored bounds depend on the $\\alpha$, $\\beta$ window they were computed in.</li>
     </ul>`,
  quiz: {
    q: `Max already has $\\alpha=7$ secured. A new min-branch's first child returns $4$. Can the rest of that branch matter? Why?`,
    a: `<p>No. The branch is a min node, so its value is at most $4$. Since $4 &lt; 7$, it cannot beat the secured $7$. Prune it.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-expectimax",
  demo: function (host) {
    Demos.tree(host, { type: "expectimax", probs: [0.5, 0.5], leaves: [3, 5, 2, 9], min: 0, max: 10 });
  },
  title: "Expectimax",
  tagline: "When the opponent is random, not perfect, average the outcomes instead of taking the worst.",
  prereqs: ["ai-minimax", "prob-expectation"],
  bigIdea:
    `<p>Minimax assumes a perfect opponent. But sometimes the opponent is random, or there is a dice roll.</p>
     <p><b>Expectimax</b> replaces the opponent's <i>min</i> with an <i>average</i>.</p>
     <p>At chance nodes, weight each outcome by its probability and add them up.</p>`,
  buildup:
    `<p>If the opponent moves randomly, assuming the worst case is too pessimistic.</p>
     <p>Instead, use the expected value: each possible move times its probability, summed.</p>
     <p>Your own nodes still take the max. Only the opponent (or chance) nodes change.</p>`,
  symbols: [
    { sym: "$V(s)$", desc: "the expectimax value of position $s$." },
    { sym: "$\\pi_{opp}(s,a)$", desc: "the probability the random opponent picks action $a$ in state $s$." },
    { sym: "$\\sum_a$", desc: "add up over every action $a$ the opponent might take." },
    { sym: "$\\text{Succ}$", desc: "the next state after the opponent's action." },
    { sym: "chance node", desc: "a node where the outcome is random (a dice roll or a random opponent)." }
  ],
  formula: `$$ V(s) = \\sum_a \\pi_{opp}(s,a)\\,V(\\text{Succ}(s,a)) \\quad\\text{(at a chance node)} $$`,
  whatItDoes:
    `<p>At a chance node, take each possible outcome's value, multiply by its probability, and sum. That is an average (an expectation).</p>
     <p>At your own nodes, still take the max, because you choose deliberately.</p>
     <p>The result reflects what you can expect against a random opponent, not the worst case.</p>`,
  example:
    `<p>The opponent picks randomly between two replies, each with probability $0.5$. They lead to values $8$ and $2$.</p>
     <ul class="steps">
       <li>Expectimax (average): $0.5\\times8 + 0.5\\times2 = 4 + 1 = 5$.</li>
       <li>Compare to minimax (worst case): $\\min(8, 2) = 2$.</li>
       <li>Expectimax says $5$, because the opponent is not out to get you, just rolling dice.</li>
     </ul>
     <p>Treating a random opponent as perfect would waste good chances.</p>`,
  application:
    `<p>Expectimax fits games with dice or randomness, like backgammon, and AIs that face beginner (not perfect) opponents. It is the right model when "the other side" is chance.</p>`,
  whenToUse:
    `<p><b>Use expectimax when the "other side" is random, not adversarial</b> — a dice roll, a shuffled deck, or an opponent who does not play optimally. It averages over outcomes instead of assuming the worst.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Minimax</b> — when the opponent is chance or a known imperfect player; minimax's worst-case assumption is too pessimistic and leaves easy value on the table.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The opponent really does play to beat you — use minimax; assuming randomness there is dangerously optimistic.</li>
       <li>The chance branching is enormous — sample outcomes with Monte Carlo rollouts instead of enumerating them all.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Wrong opponent model is the core risk.</b> Expectimax against a strong adversary over-trusts them and can be exploited; minimax against a random world is needlessly cautious. Match the node type to reality.</li>
       <li><b>You need accurate outcome probabilities.</b> The average is only as good as the $\\pi_{opp}(s,a)$ weights. Bad probability estimates give a confidently wrong expected value.</li>
       <li><b>No clean pruning.</b> Unlike minimax, chance nodes resist alpha-beta cutoffs (every child contributes to the average), so expectimax explores more nodes — sample or bound the values.</li>
       <li><b>Evaluation-function scale matters.</b> Because outcomes are averaged, a non-linear or mis-scaled leaf evaluation distorts the expectation in ways minimax would not show.</li>
       <li><b>Forgetting your own nodes still maximize.</b> Only chance / random-opponent nodes average; your decision nodes take the max. Averaging your own move throws away your agency.</li>
     </ul>`,
  quiz: {
    q: `A chance node has outcomes worth $10$ and $0$, each with probability $0.5$. What is the expectimax value? How does it differ from minimax?`,
    a: `<p>Expectimax $= 0.5\\times10 + 0.5\\times0 = 5$. Minimax would take the worst case, $\\min(10,0)=0$. Expectimax is higher because it averages.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-csp",
  demo: function (host) {
    // Classic map-colouring CSP. Four regions, "adjacent regions must differ".
    // Click a region's button to cycle its colour; shared-colour edges turn red.
    host.innerHTML = "";
    var W = 640, H = 320;
    var regions = {
      A: { x: 170, y: 90, name: "A" }, B: { x: 400, y: 90, name: "B" },
      C: { x: 170, y: 240, name: "C" }, D: { x: 400, y: 240, name: "D" }
    };
    var edges = [["A", "B"], ["A", "C"], ["B", "C"], ["B", "D"], ["C", "D"]];
    var palette = [null, "#ff7b72", "#7ee787", "#4ea1ff"];
    var pnames = ["—", "Red", "Green", "Blue"];
    var col = { A: 0, B: 0, C: 0, D: 0 };
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    function conflict(e) { return col[e[0]] !== 0 && col[e[0]] === col[e[1]]; }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      edges.forEach(function (e) {
        var a = regions[e[0]], b = regions[e[1]], bad = conflict(e);
        ctx.beginPath(); ctx.lineWidth = bad ? 5 : 2;
        ctx.strokeStyle = bad ? "#ff3b30" : t.border;
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      var violations = 0;
      edges.forEach(function (e) { if (conflict(e)) violations++; });
      for (var k in regions) {
        var n = regions[k], fill = palette[col[k]] || t.panel;
        ctx.beginPath(); ctx.fillStyle = fill; ctx.strokeStyle = t.ink; ctx.lineWidth = 2.5;
        ctx.arc(n.x, n.y, 36, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = col[k] === 0 ? t.ink : "#0d1117"; ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(n.name, n.x, n.y);
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      var allColored = col.A && col.B && col.C && col.D;
      out.innerHTML = "Map colouring: adjacent regions must differ. Cycle each region's colour with its button. " +
        "<b style=\"color:#ff3b30\">Red edges = constraint violated</b> (two neighbours share a colour).<br>" +
        "current: A=" + pnames[col.A] + ", B=" + pnames[col.B] + ", C=" + pnames[col.C] + ", D=" + pnames[col.D] +
        ". violations: <b>" + violations + "</b>" +
        ((allColored && violations === 0) ? " &nbsp;<b style=\"color:" + t.accent2 + "\">solved!</b>" : "");
    }
    var row = mkRow(host);
    ["A", "B", "C", "D"].forEach(function (k) {
      mkBtn(row, "Colour " + k, function () { col[k] = (col[k] + 1) % 4; draw(); });
    });
    mkBtn(row, "Reset (clear all)", function () { col.A = col.B = col.C = col.D = 0; draw(); });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Constraint satisfaction problems (CSPs)",
  tagline: "Fill in variables so all the rules are happy. Many puzzles are exactly this.",
  bigIdea:
    `<p>A <b>constraint satisfaction problem</b> asks: assign values to variables so that all the rules hold.</p>
     <p>Each variable picks a value from its <b>domain</b> (its allowed choices).</p>
     <p>Each rule is a <b>factor</b>: a function that scores how well an assignment fits.</p>`,
  buildup:
    `<p>Think of coloring a map so neighboring regions differ. Each region is a variable. Each color is a domain value.</p>
     <p>Each "neighbors must differ" rule is a factor. A factor returns a number, never negative.</p>
     <p>A hard constraint is a $0/1$ factor: $1$ if satisfied, $0$ if broken. We picture all factors in a <b>factor graph</b>.</p>`,
  symbols: [
    { sym: "$x$", desc: "a full assignment: a chosen value for every variable." },
    { sym: "$f_j(x)$", desc: "factor $j$: scores assignment $x$. Always $\\ge 0$." },
    { sym: "$f_j(x)\\ge0$", desc: "factors are never negative." },
    { sym: "$\\prod_j$", desc: "multiply together, over all factors $j$. $\\prod$ is a capital Greek P, for Product." },
    { sym: "$\\text{Weight}(x)$", desc: "the total score of an assignment: the product of all factors." },
    { sym: "$0/1$ factor", desc: "a hard constraint: $1$ if the rule holds, $0$ if it is broken." }
  ],
  formula: `$$ \\text{Weight}(x) = \\prod_j f_j(x) $$`,
  whatItDoes:
    `<p>Multiply every factor's score together to get the weight of an assignment.</p>
     <p>If any hard constraint is broken, its factor is $0$, so the whole product becomes $0$. The assignment fails.</p>
     <p>A valid solution has weight greater than $0$: every hard constraint holds.</p>`,
  example:
    `<p>Color two neighboring regions, R1 and R2, using Red or Blue. Rule: neighbors must differ.</p>
     <ul class="steps">
       <li>Try R1 = Red, R2 = Red. The "differ" factor is $0$ (same color). Weight $= 0$. Invalid.</li>
       <li>Try R1 = Red, R2 = Blue. The factor is $1$ (they differ). Weight $= 1$. Valid.</li>
       <li>Any assignment that breaks a rule multiplies in a $0$ and fails.</li>
     </ul>
     <p>Sudoku works the same way: each row, column, and box is a "must all differ" set of factors.</p>`,
  application:
    `<p>CSPs model scheduling (no two classes share a room and time), Sudoku, map coloring, and circuit layout. State the variables, domains, and constraints, and a solver fills them in.</p>`,
  whenToUse:
    `<p><b>Frame a problem as a CSP (Constraint Satisfaction Problem) when the goal is an assignment that satisfies a set of hard rules</b> — variables to pick, each from a small domain, with constraints linking them. If you can list variables, domains, and "these must / must not" rules, a CSP solver does the rest.</p>
     <p><b>Choose a CSP over:</b></p>
     <ul>
       <li><b>Generic search</b> — when the structure is "assign all variables consistently"; CSP-specific pruning (forward checking, arc consistency) beats blind search.</li>
       <li><b>Hand-written rule code</b> — when the constraints interact in tangled ways that ad-hoc loops cannot manage cleanly.</li>
     </ul>
     <p><b>Pick a different framework when:</b></p>
     <ul>
       <li>You want the <i>best</i> assignment by some score, not just a valid one — use a weighted CSP, MAX-SAT, or integer programming.</li>
       <li>Constraints are numeric and linear over reals — use linear programming.</li>
       <li>There is uncertainty or sequential decisions — use an MDP or a Bayes net, not a CSP.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Modeling soft preferences as hard constraints.</b> A single $0$ factor kills an otherwise-good assignment. Use weighted factors for "nice to have" so the solver can trade them off.</li>
       <li><b>The search space is exponential.</b> $k$ values across $n$ variables is $k^n$ assignments. Never enumerate them — lean on backtracking with forward checking and arc consistency.</li>
       <li><b>Over-tight constraints make it unsatisfiable.</b> Add one rule too many and there is no solution at all. Check feasibility, and relax or report the conflicting constraints.</li>
       <li><b>Forgetting symmetry.</b> Interchangeable values (Red / Green / Blue are all "a colour") multiply equivalent solutions and waste search. Add symmetry-breaking constraints.</li>
       <li><b>A factor that returns a negative number.</b> Factors must be $\\ge 0$ so the product weight is meaningful; a stray negative inverts the logic.</li>
       <li><b>Ignoring variable ordering.</b> Which variable you branch on first hugely changes the search size — the most-constrained-variable heuristic matters (next lesson).</li>
     </ul>`,
  quiz: {
    q: `Three factors give scores $1$, $1$, and $0$ for an assignment. What is its weight, and is it a valid solution?`,
    a: `<p>Weight $= 1\\times1\\times0 = 0$. A zero means a hard constraint is broken, so it is not a valid solution.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-csp-search",
  demo: function (host) {
    // BEFORE -> AFTER forward checking on a map-colouring constraint graph.
    // BEFORE: every variable still has its full domain {R,G,B}.
    // Pick a variable and a colour to assign it; forward checking crosses out
    // that colour in every neighbour's domain (AFTER). Step through several
    // assignments to watch neighbour domains shrink. Reset restores full domains.
    host.innerHTML = "";
    var W = 640, H = 360;
    var DV = ["R", "G", "B"];                 // the three domain values
    var DCOL = { R: "#ff7b72", G: "#7ee787", B: "#4ea1ff" };
    var nodes = {
      A: { x: 150, y: 90 }, B: { x: 360, y: 70 }, C: { x: 540, y: 150 },
      D: { x: 250, y: 250 }, E: { x: 470, y: 280 }
    };
    var edges = [["A", "B"], ["A", "D"], ["B", "C"], ["B", "D"], ["C", "E"], ["D", "E"]];
    var nbr = {}; for (var nk in nodes) nbr[nk] = [];
    edges.forEach(function (e) { nbr[e[0]].push(e[1]); nbr[e[1]].push(e[0]); });
    var keys = Object.keys(nodes);
    var dom, assigned, sel;                   // dom[k] = {R:bool,G:bool,B:bool}; assigned[k] = colour or null
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    function reset() {
      dom = {}; assigned = {};
      keys.forEach(function (k) { dom[k] = { R: true, G: true, B: true }; assigned[k] = null; });
      sel = "A";
      draw("Every variable still has its full domain {R, G, B}. Pick a variable and assign a colour to start forward checking.");
    }
    function assign(colour) {
      if (assigned[sel]) { draw("<b>" + sel + "</b> is already assigned. Reset, or pick an unassigned variable."); return; }
      if (!dom[sel][colour]) { draw("Cannot give <b>" + sel + "</b> the colour " + colour + " — forward checking already removed it from its domain."); return; }
      assigned[sel] = colour;
      // collapse the assigned variable's own domain to the chosen value
      DV.forEach(function (v) { dom[sel][v] = (v === colour); });
      var changed = [];
      nbr[sel].forEach(function (m) {
        if (assigned[m]) return;
        if (dom[m][colour]) { dom[m][colour] = false; changed.push(m); }
      });
      var dead = changed.filter(function (m) { return !dom[m].R && !dom[m].G && !dom[m].B; });
      var msg = "Assigned <b>" + sel + " = " + colour + "</b>. Forward checking crossed out <b>" + colour +
        "</b> from neighbour" + (changed.length === 1 ? "" : "s") + " " + (changed.length ? changed.join(", ") : "(none — already gone)") + ".";
      if (dead.length) msg += " <b style=\"color:#ff3b30\">" + dead.join(", ") + " now has an EMPTY domain — dead end, backtrack!</b>";
      // auto-advance selection to next unassigned variable
      var nextU = keys.filter(function (k) { return !assigned[k]; });
      if (nextU.length) sel = nextU[0];
      draw(msg);
    }
    function panel(k, x, y, title) {
      var t = C();
      // header
      ctx.fillStyle = t.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(title, x + 80, y - 6);
      // domain chips for one variable, side by side
      var d = dom[k], cw = 50, gap = 4, x0 = x;
      for (var i = 0; i < 3; i++) {
        var v = DV[i], on = d[v], bx = x0 + i * (cw + gap);
        ctx.fillStyle = on ? DCOL[v] : t.panel;
        ctx.strokeStyle = t.border; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.rect(bx, y, cw, 30); ctx.fill(); ctx.stroke();
        ctx.fillStyle = on ? "#0d1117" : t.dim;
        ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(v, bx + cw / 2, y + 15);
        if (!on) {   // cross out removed values
          ctx.strokeStyle = "#ff3b30"; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(bx + 4, y + 4); ctx.lineTo(bx + cw - 4, y + 26);
          ctx.moveTo(bx + cw - 4, y + 4); ctx.lineTo(bx + 4, y + 26); ctx.stroke();
        }
      }
      ctx.textBaseline = "alphabetic";
    }
    function draw(msg) {
      var t = C(); ctx.clearRect(0, 0, W, H);
      // edges
      ctx.lineWidth = 2; ctx.strokeStyle = t.border;
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      // nodes with their remaining domain shown as three small chips under the circle
      keys.forEach(function (k) {
        var n = nodes[k], a = assigned[k], isSel = (k === sel);
        ctx.beginPath();
        ctx.fillStyle = a ? DCOL[a] : t.panel;
        ctx.strokeStyle = isSel ? t.warn : (a ? DCOL[a] : t.border);
        ctx.lineWidth = isSel ? 4 : 2.5;
        ctx.arc(n.x, n.y, 22, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = a ? "#0d1117" : t.ink; ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(k, n.x, n.y);
        // mini domain chips beside the node
        var d = dom[k], cw = 13, y0 = n.y + 26, x0 = n.x - (cw * 3 + 4) / 2;
        for (var i = 0; i < 3; i++) {
          var v = DV[i], on = d[v], bx = x0 + i * (cw + 2);
          ctx.fillStyle = on ? DCOL[v] : t.panel;
          ctx.strokeStyle = t.border; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.rect(bx, y0, cw, 13); ctx.fill(); ctx.stroke();
          if (!on) { ctx.strokeStyle = "#ff3b30"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx + 2, y0 + 2); ctx.lineTo(bx + cw - 2, y0 + 11); ctx.moveTo(bx + cw - 2, y0 + 2); ctx.lineTo(bx + 2, y0 + 11); ctx.stroke(); }
        }
      });
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      out.innerHTML = "Map-colouring CSP. Neighbours (joined by an edge) must differ. " +
        "Each variable shows its remaining domain {R, G, B}; <b style=\"color:#ff3b30\">a red cross = a value removed by forward checking</b>. " +
        "<span style=\"color:" + t.warn + "\">Orange ring = selected variable</span>.<br>" + (msg || "");
    }
    var row1 = mkRow(host);
    var lab = document.createElement("span"); lab.textContent = "select variable: ";
    lab.style.cssText = "color:var(--ink-dim);font-size:13px;margin-right:6px"; row1.appendChild(lab);
    keys.forEach(function (k) { mkBtn(row1, k, function () { sel = k; draw("Selected variable <b>" + k + "</b>. Now assign it a colour."); }); });
    var row2 = mkRow(host);
    var lab2 = document.createElement("span"); lab2.textContent = "assign colour to selected: ";
    lab2.style.cssText = "color:var(--ink-dim);font-size:13px;margin-right:6px"; row2.appendChild(lab2);
    ["R", "G", "B"].forEach(function (col) { mkBtn(row2, "= " + col, function () { assign(col); }); });
    mkBtn(row2, "Reset", reset);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "Solving CSPs (Constraint Satisfaction Problems): backtracking and consistency",
  tagline: "Try a value, check the rules, and back up the moment you get stuck.",
  prereqs: ["ai-csp"],
  bigIdea:
    `<p>To solve a CSP, assign variables one at a time. This is <b>backtracking search</b>.</p>
     <p>After each choice, check the rules. If a rule is already broken, undo and try another value.</p>
     <p>Smart pruning makes this fast: cut off bad choices before exploring them.</p>`,
  buildup:
    `<p>Naively trying every full assignment is too slow. Backtracking assigns one variable, then checks if it is still possible to finish.</p>
     <p><b>Forward checking</b> looks ahead: after a choice, remove now-impossible values from the neighbors' domains.</p>
     <p><b>Arc consistency</b> (the AC-3 algorithm) goes further, pruning domains until every constraint can still be met.</p>`,
  symbols: [
    { sym: "backtracking", desc: "assign variables one by one; undo a choice when it leads to a dead end." },
    { sym: "forward checking", desc: "after assigning a variable, delete conflicting values from neighbors' domains." },
    { sym: "domain", desc: "the set of values a variable is still allowed to take." },
    { sym: "arc consistency", desc: "prune domains so every constraint between two variables can still be satisfied." },
    { sym: "AC-3", desc: "a standard algorithm that enforces arc consistency by repeatedly checking pairs." },
    { sym: "most-constrained variable", desc: "the heuristic of assigning the variable with the fewest remaining choices first." }
  ],
  formula: `$$ \\text{pick the variable with the smallest remaining domain first (most constrained)} $$`,
  whatItDoes:
    `<p>Backtracking explores assignments like a tree, but abandons a branch as soon as a rule breaks.</p>
     <p>Forward checking and arc consistency shrink domains early, so fewer branches even exist.</p>
     <p>The <b>most-constrained-variable</b> heuristic tackles the hardest variable first, so dead ends are found sooner.</p>`,
  example:
    `<p>Map coloring with Red, Green, Blue. Region A is set to Red. Region B is a neighbor of A.</p>
     <ul class="steps">
       <li>Forward checking: remove Red from B's domain. B now allows only $\\{$Green, Blue$\\}$.</li>
       <li>Suppose another neighbor forces B to drop Green too. B's domain becomes just $\\{$Blue$\\}$.</li>
       <li>Most-constrained heuristic: assign B next, since it has only one choice left.</li>
       <li>If a domain ever becomes empty, backtrack: undo an earlier choice and try again.</li>
     </ul>`,
  application:
    `<p>These techniques power Sudoku solvers, exam and shift scheduling, and resource allocation. Forward checking and good variable ordering turn problems that look impossible into ones that solve in a blink.</p>`,
  whenToUse:
    `<p><b>Backtracking with consistency techniques is the default way to actually solve a CSP (Constraint Satisfaction Problem).</b> Use it whenever you have variables, domains, and constraints and need a valid assignment fast.</p>
     <p><b>Which technique to add:</b></p>
     <ul>
       <li><b>Plain backtracking</b> — the baseline: assign, check, undo on failure. Always start here.</li>
       <li><b>Forward checking</b> — when a choice obviously prunes neighbours' options; it catches dead ends one step early for little cost.</li>
       <li><b>Arc consistency (AC-3)</b> — when constraints are tight and propagation can collapse many domains; it prunes harder but costs more per step.</li>
       <li><b>Most-constrained-variable ordering</b> — almost always; tackling the variable with the fewest choices first finds failures sooner.</li>
     </ul>
     <p><b>Reach past backtracking when:</b></p>
     <ul>
       <li>The problem is huge and you only need a good-enough answer — use local search (min-conflicts) or a dedicated SAT solver.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Naive full-assignment enumeration is hopeless.</b> Trying every combination is $k^n$. Always assign one variable at a time and prune — that is the whole point of backtracking.</li>
       <li><b>Skipping consistency checks.</b> Without forward checking or arc consistency, backtracking thrashes deep into doomed branches before noticing. Propagate constraints after each assignment.</li>
       <li><b>Bad variable / value ordering.</b> Picking an easy variable first delays the inevitable conflict; order by most-constrained variable and least-constraining value.</li>
       <li><b>Arc consistency is not a solver.</b> AC-3 prunes domains but rarely solves the CSP alone; it is a preprocessing and inline pruning step inside backtracking, not a replacement for it.</li>
       <li><b>Forgetting to undo on backtrack.</b> A choice must fully restore the domains it pruned when it is abandoned, or later branches inherit phantom restrictions.</li>
       <li><b>No restart on heavy-tailed runs.</b> Some orderings get unlucky and run for ages; randomized restarts often finish far faster.</li>
     </ul>`,
  quiz: {
    q: `Variable A's domain is $\\{$Red, Blue$\\}$ and B's is $\\{$Red$\\}$. Using the most-constrained-variable heuristic, which do you assign first, and why?`,
    a: `<p>Assign B first. It has only one value left ($\\{$Red$\\}$), the smallest domain, so it is the most constrained.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-bayes-net",
  demo: function (host) {
    // A node-link DAG: Rain -> WetGrass <- Sprinkler. Toggle each parent ON/OFF;
    // the child probability P(WetGrass = true) updates from the CPT.
    host.innerHTML = "";
    var W = 640, H = 300;
    var rain = false, spr = false;
    var pRain = 0.3, pSpr = 0.4;
    // CPT for P(Wet=true | Rain, Sprinkler)
    function pWet(r, s) {
      if (r && s) return 0.99;
      if (r && !s) return 0.9;
      if (!r && s) return 0.8;
      return 0.05;   // neither
    }
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var nodes = {
      Rain: { x: 150, y: 70 }, Spr: { x: 490, y: 70, name: "Sprinkler" }, Wet: { x: 320, y: 220, name: "WetGrass" }
    };
    function nodeBox(t, key, on, label) {
      var n = nodes[key];
      ctx.beginPath();
      ctx.fillStyle = on ? t.accent : t.panel;
      ctx.strokeStyle = on ? t.accent : t.border; ctx.lineWidth = 2.5;
      ctx.arc(n.x, n.y, 38, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = on ? "#0d1117" : t.ink; ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, n.x, n.y - 6);
      ctx.font = "11px sans-serif";
      ctx.fillText(on ? "= true" : "= false", n.x, n.y + 12);
    }
    function arrow(a, b) {
      var t = C();
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy);
      var ux = dx / d, uy = dy / d;
      var x1 = a.x + ux * 38, y1 = a.y + uy * 38, x2 = b.x - ux * 40, y2 = b.y - uy * 40;
      ctx.strokeStyle = t.dim; ctx.fillStyle = t.dim; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var ang = Math.atan2(uy, ux);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 10 * Math.cos(ang - 0.4), y2 - 10 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 10 * Math.cos(ang + 0.4), y2 - 10 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      arrow(nodes.Rain, nodes.Wet); arrow(nodes.Spr, nodes.Wet);
      nodeBox(t, "Rain", rain, "Rain");
      nodeBox(t, "Spr", spr, "Sprinkler");
      var pw = pWet(rain, spr);
      // colour WetGrass node by its probability of being true
      var n = nodes.Wet;
      ctx.beginPath();
      ctx.fillStyle = "rgba(126,231,135," + (0.12 + 0.7 * pw).toFixed(3) + ")";
      ctx.strokeStyle = t.accent2; ctx.lineWidth = 2.5;
      ctx.arc(n.x, n.y, 44, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = t.ink; ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("WetGrass", n.x, n.y - 8);
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("P=" + pw.toFixed(2), n.x, n.y + 12);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "DAG: <b>Rain → WetGrass ← Sprinkler</b>. Toggle each cause; the child's probability comes from its CPT.<br>" +
        "P(Wet = true | Rain=" + rain + ", Sprinkler=" + spr + ") = <b>" + pw.toFixed(2) + "</b>. " +
        "Turning on a cause drives the grass-wet probability up.";
    }
    var row = mkRow(host);
    mkBtn(row, "Toggle Rain", function () { rain = !rain; draw(); });
    mkBtn(row, "Toggle Sprinkler", function () { spr = !spr; draw(); });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Bayesian networks",
  tagline: "Draw arrows showing what causes what. The picture compresses a giant probability table.",
  prereqs: ["prob-bayes", "prob-conditional"],
  bigIdea:
    `<p>The chance of many things happening together can need a huge table.</p>
     <p>A <b>Bayesian network</b> shrinks it. It is a diagram of arrows: each arrow points from a cause to an effect.</p>
     <p>The full joint probability is the product of each variable's chance given its direct causes (its parents).</p>`,
  buildup:
    `<p>The graph is a <b>DAG</b>: a directed acyclic graph. Directed = arrows. Acyclic = no loops.</p>
     <p>Each node is a random variable. Its <b>parents</b> are the nodes with arrows pointing into it.</p>
     <p>You only need each node's probability given its parents, not the full table over everything.</p>`,
  symbols: [
    { sym: "$X_1,\\dots,X_n$", desc: "the random variables, one per node in the graph." },
    { sym: "$P(\\dots)$", desc: "a probability: the chance of an event, between $0$ and $1$." },
    { sym: "$\\text{Parents}(i)$", desc: "the parents of node $i$: the nodes with arrows pointing into it." },
    { sym: "$P(X_i \\mid \\text{Parents}(i))$", desc: "the probability of $X_i$ given its parents. The $\\mid$ means 'given'." },
    { sym: "$\\prod_i$", desc: "multiply over all nodes $i$." },
    { sym: "DAG", desc: "directed acyclic graph: arrows, with no cycles." }
  ],
  formula: `$$ P(X_1,\\dots,X_n) = \\prod_i P\\big(X_i \\mid \\text{Parents}(i)\\big) $$`,
  whatItDoes:
    `<p>The joint probability factors into a product, one term per node.</p>
     <p>Each term is small: just that node's chance given its few parents.</p>
     <p>A node with no parents uses its plain probability $P(X_i)$. This factoring saves enormous space.</p>`,
  example:
    `<p>The classic net: Rain $\\rightarrow$ WetGrass $\\leftarrow$ Sprinkler. Two causes, one effect. Suppose $P(\\text{Rain})=0.3$, $P(\\text{Sprinkler})=0.4$, and the effect's table gives $P(\\text{Wet}\\mid\\text{Rain},\\text{Sprinkler})=0.99$.</p>
     <ul class="steps">
       <li>Rain and Sprinkler have no parents, so their terms are just $0.3$ and $0.4$.</li>
       <li>WetGrass has two parents, so its term is $P(\\text{Wet}\\mid\\text{Rain},\\text{Sprinkler}) = 0.99$.</li>
       <li>Joint for "all three true": $P(\\text{Rain},\\text{Sprinkler},\\text{Wet}) = 0.3 \\times 0.4 \\times 0.99 = 0.1188$.</li>
       <li>The payoff: the full table over 3 true/false variables needs $2^3 - 1 = 7$ numbers. The graph needs only $1 + 1 + 4 = 6$, and each is a small per-node table. More parents per node, bigger the saving.</li>
     </ul>
     <p>The arrows told us exactly which conditional probabilities to multiply.</p>`,
  application:
    `<p>Bayesian networks power medical diagnosis (symptoms given diseases), spam filtering, and fault detection. They let experts encode cause-and-effect knowledge and reason about it cleanly.</p>`,
  whenToUse:
    `<p><b>Reach for a Bayes net when you have variables with known cause-and-effect structure and want to reason about uncertainty.</b> It compresses a giant joint probability table into small per-node tables and makes "what causes what" explicit.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A full joint table</b> — when variables are mostly conditionally independent; the graph needs far fewer numbers and is interpretable.</li>
       <li><b>A black-box classifier</b> — when you need to encode expert knowledge, handle missing inputs gracefully, or explain <i>why</i> a prediction was made.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You have lots of labeled data and only care about prediction accuracy — a discriminative model (gradient boosting, a neural network) usually wins.</li>
       <li>The variables form a time series — use a Hidden Markov Model (HMM) or a Dynamic Bayes Net.</li>
       <li>Relationships are dense with no clean independence structure — the graph saves nothing.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Arrows are not proven causation.</b> A Bayes net encodes conditional independence, not real-world cause; a wrong arrow direction can still fit the data but mislead any intervention reasoning.</li>
       <li><b>The graph must be acyclic.</b> A cycle makes the factorization $\\prod_i P(X_i \\mid \\text{Parents}(i))$ ill-defined. Keep it a DAG (Directed Acyclic Graph).</li>
       <li><b>CPT (Conditional Probability Table) size explodes with parents.</b> A node with $k$ binary parents needs $2^k$ rows. Limit fan-in, or use a structured CPT (noisy-OR) to keep it estimable.</li>
       <li><b>Sparse data gives unreliable probabilities.</b> Rare parent combinations may have few or zero examples. Use priors / smoothing so a CPT entry is not $0$ just because it was unseen.</li>
       <li><b>Exact inference can be intractable.</b> On densely connected graphs, variable elimination blows up. Switch to approximate inference (sampling) for big networks.</li>
       <li><b>Confusing marginal and conditional independence.</b> Two causes can be independent on their own yet become dependent once their shared effect is observed (explaining away). Reason through the graph, not by intuition.</li>
     </ul>`,
  quiz: {
    q: `For Rain $\\rightarrow$ Wet, with $P(\\text{Rain})=0.4$ and $P(\\text{Wet}\\mid\\text{Rain})=0.5$, what is $P(\\text{Rain}, \\text{Wet})$?`,
    a: `<p>$P(\\text{Rain})\\times P(\\text{Wet}\\mid\\text{Rain}) = 0.4\\times0.5 = 0.2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-bayes-inference",
  demo: function (host) {
    // BEFORE -> AFTER Bayesian update over 3 disease hypotheses.
    // BEFORE: PRIOR bars P(H). AFTER: POSTERIOR bars P(H | evidence) after a
    // positive test, computed with Bayes' rule. A slider sets the test's
    // sensitivity P(+ | disease); the posterior bars (and numbers) update live.
    host.innerHTML = "";
    var W = 640, H = 320;
    var hyps = ["Flu", "Cold", "Healthy"];
    var prior = [0.20, 0.30, 0.50];           // P(H), sums to 1
    // likelihood of a positive test given each hypothesis, P(+ | H). Healthy = false-positive rate.
    var likeBase = [0.90, 0.50, 0.10];
    var sens = 0.90;                          // slider-controlled sensitivity for the *disease* hyps (scales Flu/Cold)
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    function likelihoods() {
      // Flu/Cold scale with the sensitivity slider; Healthy keeps a fixed false-positive rate.
      return [sens, sens * 0.55, 0.10];
    }
    function posterior() {
      var lk = likelihoods();
      var joint = prior.map(function (p, i) { return p * lk[i]; });
      var z = joint.reduce(function (a, b) { return a + b; }, 0) || 1;
      return { post: joint.map(function (j) { return j / z; }), z: z, lk: lk };
    }
    function bars(x0, title, vals, cols, hot) {
      var t = C();
      var n = vals.length, gw = 150, gap = 16, bw = (gw - (n - 1) * gap) / n;
      var baseY = 250, maxH = 170;
      ctx.fillStyle = t.ink; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(title, x0 + gw / 2, 40);
      ctx.strokeStyle = t.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, baseY); ctx.lineTo(x0 + gw, baseY); ctx.stroke();
      for (var i = 0; i < n; i++) {
        var bx = x0 + i * (bw + gap), h = vals[i] * maxH;
        ctx.fillStyle = cols[i]; if (hot) { ctx.globalAlpha = 1; }
        ctx.fillRect(bx, baseY - h, bw, h);
        ctx.fillStyle = t.ink; ctx.font = "bold 12px sans-serif";
        ctx.fillText(vals[i].toFixed(2), bx + bw / 2, baseY - h - 6);
        ctx.fillStyle = t.dim; ctx.font = "11px sans-serif";
        ctx.fillText(hyps[i], bx + bw / 2, baseY + 16);
      }
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var cols = ["#ff7b72", "#ffb454", "#7ee787"];
      var r = posterior();
      bars(60, "PRIOR  P(H)", prior, cols, false);
      // arrow between the two panels
      ctx.strokeStyle = t.accent; ctx.fillStyle = t.accent; ctx.lineWidth = 2.5;
      var ay = 150, ax1 = 250, ax2 = 360;
      ctx.beginPath(); ctx.moveTo(ax1, ay); ctx.lineTo(ax2, ay); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax2, ay); ctx.lineTo(ax2 - 12, ay - 7); ctx.lineTo(ax2 - 12, ay + 7); ctx.closePath(); ctx.fill();
      ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = t.accent; ctx.fillText("saw +test", (ax1 + ax2) / 2, ay - 12);
      bars(400, "POSTERIOR  P(H | +)", r.post, cols, true);
      ctx.textAlign = "start";
      out.innerHTML = "Bayesian update over 3 hypotheses after a <b>positive test</b>. " +
        "Posterior = (prior × likelihood) / evidence.<br>" +
        "P(+ | Flu)=" + r.lk[0].toFixed(2) + ", P(+ | Cold)=" + r.lk[1].toFixed(2) + ", P(+ | Healthy)=" + r.lk[2].toFixed(2) +
        ". Evidence P(+) = Σ prior·like = <b>" + r.z.toFixed(3) + "</b>.<br>" +
        "Posterior: Flu <b>" + r.post[0].toFixed(2) + "</b>, Cold <b>" + r.post[1].toFixed(2) + "</b>, Healthy <b>" + r.post[2].toFixed(2) +
        "</b>. The positive test pushes mass toward the hypothesis it is most consistent with.";
    }
    var slRow = mkRow(host);
    var sl = document.createElement("input"); sl.type = "range"; sl.min = "0.3"; sl.max = "0.99"; sl.step = "0.01"; sl.value = String(sens);
    sl.style.cssText = "vertical-align:middle";
    var slLab = document.createElement("label"); slLab.style.cssText = "display:block;font-size:13px;color:var(--ink-dim)";
    var slVal = document.createElement("span"); slVal.className = "out"; slVal.style.marginLeft = "6px"; slVal.textContent = sens.toFixed(2);
    slLab.textContent = "test sensitivity  P(+ | disease)"; slLab.appendChild(slVal);
    sl.addEventListener("input", function () { sens = parseFloat(sl.value); slVal.textContent = sens.toFixed(2); draw(); });
    slRow.appendChild(slLab); slRow.appendChild(sl);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Inference in Bayes nets",
  tagline: "Given what you've observed, what's the chance of the thing you care about?",
  prereqs: ["ai-bayes-net"],
  bigIdea:
    `<p>Once you have a Bayes net, you ask questions. This is <b>inference</b>.</p>
     <p>You observe some facts (the <b>evidence</b>) and want the probability of something else (the <b>query</b>).</p>
     <p>It is just conditional probability, computed cleverly over the network.</p>`,
  buildup:
    `<p>You want $P(\\text{query}\\mid\\text{evidence})$: the chance of the query given what you saw.</p>
     <p><b>Exact inference</b> (variable elimination) computes this precisely by summing out the unseen variables.</p>
     <p><b>Approximate inference</b> (Gibbs sampling) estimates it by drawing many random samples. Faster on big networks.</p>`,
  symbols: [
    { sym: "$P(\\text{query}\\mid\\text{evidence})$", desc: "the probability of the query, given the observed evidence. $\\mid$ means 'given'." },
    { sym: "evidence", desc: "the facts you have observed and are conditioning on." },
    { sym: "query", desc: "the unknown variable whose probability you want." },
    { sym: "variable elimination", desc: "exact method: sum out the unobserved variables one at a time." },
    { sym: "Gibbs sampling", desc: "approximate method: repeatedly resample variables to draw samples and estimate the probability." },
    { sym: "explaining away", desc: "when one cause is confirmed, a rival cause becomes less likely." }
  ],
  formula: `$$ P(\\text{query}\\mid\\text{evidence}) = \\frac{P(\\text{query},\\,\\text{evidence})}{P(\\text{evidence})} $$`,
  whatItDoes:
    `<p>Inference computes the conditional probability above by working through the network.</p>
     <p>Exact methods give the true number but can be slow on tangled networks.</p>
     <p>Approximate methods sample, trading a little accuracy for big speed. <b>Explaining away</b> is a key intuition: confirming one cause of an effect lowers the probability of another.</p>`,
  example:
    `<p>A worked posterior. Three hypotheses with priors $P(\\text{Flu})=0.2$, $P(\\text{Cold})=0.3$, $P(\\text{Healthy})=0.5$. A test comes back positive; its likelihoods are $P(+\\mid\\text{Flu})=0.9$, $P(+\\mid\\text{Cold})=0.5$, $P(+\\mid\\text{Healthy})=0.1$.</p>
     <ul class="steps">
       <li>Multiply prior × likelihood for each: Flu $= 0.2\\times0.9 = 0.18$; Cold $= 0.3\\times0.5 = 0.15$; Healthy $= 0.5\\times0.1 = 0.05$.</li>
       <li>Evidence $P(+) = 0.18 + 0.15 + 0.05 = 0.38$ (this is the normalizer).</li>
       <li>Divide each by $0.38$: $P(\\text{Flu}\\mid+) = 0.18/0.38 \\approx 0.47$, $P(\\text{Cold}\\mid+) \\approx 0.39$, $P(\\text{Healthy}\\mid+) \\approx 0.13$.</li>
       <li>The positive test flipped Healthy from the front-runner ($0.50$ prior) to least likely ($0.13$), and lifted Flu from $0.20$ to $0.47$. Evidence reshaped the beliefs.</li>
     </ul>
     <p><b>Explaining away</b> is the same idea between rival causes: if a second test later <i>confirms</i> Flu, the probability of Cold drops, because Flu now accounts for the positive result on its own.</p>`,
  application:
    `<p>Inference answers real questions: given these symptoms, how likely is this disease? Given these clicks, how likely is fraud? It is how a Bayes net turns from a diagram into a decision tool.</p>`,
  whenToUse:
    `<p><b>Run inference whenever you have a Bayes net and want $P(\\text{query}\\mid\\text{evidence})$</b> — the chance of something unobserved given what you have seen. The method depends on how big and tangled the network is.</p>
     <p><b>Which method:</b></p>
     <ul>
       <li><b>Exact inference (variable elimination)</b> — when the network is small or has low treewidth; it gives the true probability.</li>
       <li><b>Approximate inference (Gibbs / importance sampling)</b> — when the network is large or densely connected and exact inference is too slow; trade a little accuracy for speed.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The unknowns evolve over time — use the forward-backward algorithm on an HMM (Hidden Markov Model).</li>
       <li>You only ever query one fixed variable from data — a direct discriminative model may be simpler.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Exact inference is NP-hard in general.</b> On a densely connected network, variable elimination's intermediate tables explode. Watch the treewidth; switch to sampling when it grows.</li>
       <li><b>Elimination order matters enormously.</b> A bad ordering creates huge intermediate factors; a good one keeps them small. Use a min-fill or min-degree heuristic.</li>
       <li><b>Sampling can converge slowly.</b> Gibbs sampling mixes badly when variables are highly correlated, giving biased estimates from too-few effective samples. Use enough burn-in and check convergence.</li>
       <li><b>Zero-probability evidence breaks rejection sampling.</b> Rare evidence means almost all samples are thrown away. Use likelihood weighting or importance sampling instead.</li>
       <li><b>Forgetting to normalize.</b> The posterior must divide by the evidence $P(\\text{evidence})$; skip it and the "probabilities" do not sum to $1$.</li>
       <li><b>Misreading explaining-away.</b> Observing a shared effect couples two independent causes. Treating them as still-independent gives wrong posteriors.</li>
     </ul>`,
  quiz: {
    q: `In the alarm example, after the earthquake is confirmed, does the probability of a burglary go up or down? What is this effect called?`,
    a: `<p>It goes down. The earthquake already explains the alarm, so the rival cause (burglary) is less needed. This is called "explaining away".</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-hmm",
  demo: function (host) {
    // A trellis: two hidden states (Rainy / Sunny) drawn as a column per time step,
    // with transition arrows between steps. Each forward step runs one filtering update
    // and shows the belief P(state) as the node's fill, with the observed clue per step.
    host.innerHTML = "";
    var W = 640, H = 320;
    var T = 4;
    var obs = ["Umbrella", "Umbrella", "No-umbr", "Umbrella"];   // clue at each step
    var stay = 0.7;   // P(Rainy->Rainy) and P(Sunny->Sunny)
    var eUmbR = 0.9, eUmbS = 0.2;   // P(Umbrella | Rainy), P(Umbrella | Sunny)
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var belief, t_idx;   // belief[i] = {R, S} after processing step i
    function filterStep(prev, ob) {
      // predict using transition (symmetric: stay prob)
      var predR = stay * prev.R + (1 - stay) * prev.S;
      var predS = (1 - stay) * prev.R + stay * prev.S;
      // weight by emission
      var eR = (ob === "Umbrella") ? eUmbR : (1 - eUmbR);
      var eS = (ob === "Umbrella") ? eUmbS : (1 - eUmbS);
      var wR = predR * eR, wS = predS * eS, z = wR + wS;
      return z > 0 ? { R: wR / z, S: wS / z } : { R: 0.5, S: 0.5 };
    }
    function reset() {
      belief = [{ R: 0.5, S: 0.5 }];   // prior at step 1 before its emission
      // apply step 1 emission immediately
      belief[0] = filterStep({ R: 0.5, S: 0.5 }, obs[0]);
      t_idx = 0; draw();
    }
    function step() {
      if (t_idx >= T - 1) { draw(); return; }
      belief.push(filterStep(belief[t_idx], obs[t_idx + 1]));
      t_idx++; draw();
    }
    function colX(i) { return 90 + i * 150; }
    var rowY = 90, sunY = 220;
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      // transition arrows between revealed columns
      ctx.strokeStyle = t.border; ctx.lineWidth = 1.5;
      for (var i = 0; i < t_idx; i++) {
        var x1 = colX(i), x2 = colX(i + 1);
        [[rowY, rowY], [rowY, sunY], [sunY, rowY], [sunY, sunY]].forEach(function (yy) {
          ctx.beginPath(); ctx.moveTo(x1 + 26, yy[0]); ctx.lineTo(x2 - 26, yy[1]); ctx.stroke();
        });
      }
      for (var k = 0; k <= t_idx; k++) {
        var x = colX(k), b = belief[k];
        // Rainy node
        drawState(t, x, rowY, "Rainy", b.R, k === t_idx);
        drawState(t, x, sunY, "Sunny", b.S, k === t_idx);
        ctx.fillStyle = t.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("t" + (k + 1) + ": " + obs[k], x, 290);
      }
      ctx.textAlign = "start";
      var bf = belief[t_idx];
      out.innerHTML = "HMM trellis. Hidden state per time step (Rainy / Sunny); the clue below each column is the observation. " +
        "<span style=\"color:" + t.accent + "\">Node fill = belief P(state)</span>.<br>" +
        "After t" + (t_idx + 1) + " (saw " + obs[t_idx] + "): P(Rainy) = <b>" + bf.R.toFixed(2) + "</b>, P(Sunny) = <b>" + bf.S.toFixed(2) + "</b>. " +
        "Each forward step predicts via transitions, then reweights by the new clue.";
    }
    function drawState(t, x, y, name, p, hot) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(78,161,255," + (0.1 + 0.75 * p).toFixed(3) + ")";
      ctx.strokeStyle = hot ? t.warn : t.border; ctx.lineWidth = hot ? 3.5 : 2;
      ctx.arc(x, y, 26, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = t.ink; ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(name, x, y - 5);
      ctx.font = "11px sans-serif"; ctx.fillText(p.toFixed(2), x, y + 9);
      ctx.textBaseline = "alphabetic";
    }
    var row = mkRow(host);
    mkBtn(row, "Forward step ▶", step);
    mkBtn(row, "Reset", reset);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "Hidden Markov Models (HMMs)",
  tagline: "You can't see the true state, only noisy clues. Infer the hidden truth over time.",
  prereqs: ["ai-bayes-net", "prob-conditional"],
  bigIdea:
    `<p>Some things you cannot observe directly. You only see clues.</p>
     <p>A <b>Hidden Markov Model</b> has a hidden state that changes over time, and observations that hint at it.</p>
     <p>From the stream of clues, we infer the most likely hidden states.</p>`,
  buildup:
    `<p>At each time step $t$ there is a hidden state $H_t$ (the truth) and an observation $E_t$ (the clue).</p>
     <p>The hidden state follows a Markov chain: $H_t$ depends only on $H_{t-1}$.</p>
     <p>Each observation $E_t$ depends only on the current hidden state $H_t$.</p>`,
  symbols: [
    { sym: "$H_t$", desc: "the hidden state at time $t$ (the thing we cannot see)." },
    { sym: "$E_t$", desc: "the evidence (observation) at time $t$: the clue we do see." },
    { sym: "$P(H_t \\mid H_{t-1})$", desc: "the transition: how the hidden state evolves over time." },
    { sym: "$P(E_t \\mid H_t)$", desc: "the emission: how the clue depends on the current hidden state." },
    { sym: "forward-backward", desc: "an algorithm that combines past and future clues to estimate each hidden state (called smoothing)." },
    { sym: "smoothing", desc: "estimating a past hidden state using all the evidence, before and after it." }
  ],
  formula: `$$ P(H_{1:t}, E_{1:t}) = P(H_1)\\,P(E_1\\mid H_1)\\prod_{k=2}^{t} P(H_k\\mid H_{k-1})\\,P(E_k\\mid H_k) $$`,
  whatItDoes:
    `<p>The model chains together two simple rules: how the hidden state moves, and how each clue is produced.</p>
     <p>The <b>forward-backward</b> algorithm runs through the clues once forward and once backward, combining them.</p>
     <p>The result is the probability of each hidden state at each time, given all the evidence. That is <b>smoothing</b>.</p>`,
  example:
    `<p>One numeric forward (filtering) step. Hidden weather Rainy/Sunny. Transition: stays the same with prob $0.7$ (so switches with $0.3$). Emission: $P(\\text{Umbrella}\\mid\\text{Rainy})=0.9$, $P(\\text{Umbrella}\\mid\\text{Sunny})=0.2$. Start belief is even: $P(\\text{Rainy})=P(\\text{Sunny})=0.5$. You see an Umbrella.</p>
     <ul class="steps">
       <li><b>Predict</b> via transition: $P(\\text{Rainy}) = 0.7\\times0.5 + 0.3\\times0.5 = 0.5$, same for Sunny. (Symmetric, so unchanged here.)</li>
       <li><b>Reweight</b> by the emission: Rainy $= 0.5\\times0.9 = 0.45$; Sunny $= 0.5\\times0.2 = 0.10$.</li>
       <li><b>Normalize</b>: total $= 0.45 + 0.10 = 0.55$, so $P(\\text{Rainy}\\mid\\text{Umbrella}) = 0.45/0.55 \\approx 0.82$, $P(\\text{Sunny}\\mid\\text{Umbrella}) \\approx 0.18$.</li>
       <li>One clue moved the belief from $50/50$ to $82\\%$ Rainy. Each later day repeats predict-reweight-normalize, chaining the clues.</li>
     </ul>
     <p><b>Smoothing</b> goes further: a No-umbrella day wedged between wet days can still come out Rainy, because forward-backward also uses the <i>future</i> clues, not just the past.</p>`,
  application:
    `<p>HMMs power speech recognition (hidden words, observed sound waves), object tracking (hidden position, noisy sensors), and gene finding in DNA. They are the classic model for "infer the hidden truth from a noisy time series".</p>`,
  whenToUse:
    `<p><b>Reach for an HMM (Hidden Markov Model) when a hidden state evolves over time and you only see noisy clues</b> — and the state's next value depends only on its current value. It is the go-to model for "infer the hidden truth from a noisy sequence".</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A static Bayes net</b> — when the data is a time series; the HMM ties the steps together with a transition model.</li>
       <li><b>A Kalman filter</b> — when the hidden state is discrete (which word, which weather) rather than a continuous vector.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The hidden state is continuous with linear-Gaussian dynamics — use a Kalman filter.</li>
       <li>Long-range dependencies matter (the state $50$ steps back) — use a Recurrent Neural Network (RNN) or a transformer; the Markov assumption forgets.</li>
       <li>You have abundant labeled sequences and only want accuracy — a discriminative sequence model (a Conditional Random Field, or a neural tagger) often wins.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The Markov assumption forgets the past.</b> $H_t$ depends only on $H_{t-1}$, so genuine long-range dependencies are lost. Add states to encode needed history, or use an RNN.</li>
       <li><b>Confusing filtering with smoothing.</b> Filtering uses only past clues; smoothing (forward-backward) also uses future ones and is more accurate for past states. Pick the one your task needs.</li>
       <li><b>Numerical underflow.</b> Multiplying many small probabilities along the chain drives values to zero. Work in log-space or normalize (rescale) at every step.</li>
       <li><b>Forgetting to normalize each step.</b> The filtering update must renormalize the belief to sum to $1$; skip it and the probabilities decay away.</li>
       <li><b>Local optima in training.</b> Learning the transition / emission tables with Baum-Welch (an EM algorithm) only finds a local optimum. Try several random restarts.</li>
       <li><b>Wrong number of hidden states.</b> Too few states cannot capture the dynamics; too many overfit. Validate the state count on held-out data.</li>
     </ul>`,
  quiz: {
    q: `In the umbrella HMM, what is hidden and what is observed? Which probability links the two, $P(E_t\\mid H_t)$ or $P(H_t\\mid H_{t-1})$?`,
    a: `<p>The weather is hidden; the umbrella is observed. The emission $P(E_t\\mid H_t)$ links the observation to the hidden state. $P(H_t\\mid H_{t-1})$ instead describes how the hidden weather changes day to day.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-propositional-logic",
  demo: function (host) {
    // Truth table. Row 0 = header. Rows 1..4 = the 4 combinations of A,B.
    // Cols: 0 = A, 1 = B, 2 = A∧B, 3 = A∨B, 4 = ¬A, 5 = A→B.
    var combos = [[true, true], [true, false], [false, true], [false, false]];
    var heads = ["A", "B", "A∧B", "A∨B", "¬A", "A→B"];
    function tf(x) { return x ? "T" : "F"; }
    function valAt(row, col) {
      var A = combos[row][0], B = combos[row][1];
      if (col === 0) return A;
      if (col === 1) return B;
      if (col === 2) return A && B;
      if (col === 3) return A || B;
      if (col === 4) return !A;
      return (!A) || B;   // A → B
    }
    Demos.grid(host, {
      rows: 5, cols: 6, cellSize: 60,
      cell: function (r, c) {
        if (r === 0) return { color: "#161c24", label: heads[c], text: "#9aa7b4" };
        var v = valAt(r - 1, c);
        return { color: v ? "#1f5130" : "#5a1f24", label: tf(v), text: "#e6edf3" };
      },
      readout: function () {
        return "Truth table: each of the 4 rows is one combination of A, B. " +
          "<span style=\"color:#7ee787\">Green = true</span>, <span style=\"color:#ff7b72\">red = false</span>. " +
          "Note A→B is false only on row TF (A true, B false).";
      }
    });
  },
  title: "Propositional logic",
  tagline: "Build true/false statements with AND, OR, NOT. Then ask what must follow.",
  bigIdea:
    `<p>Some knowledge is best written as crisp true/false rules, not probabilities.</p>
     <p><b>Propositional logic</b> uses symbols that are true or false, joined by connectives.</p>
     <p>From a set of known facts, we ask what other statements must be true.</p>`,
  buildup:
    `<p>A <b>symbol</b> stands for a fact, like $R$ = "it is raining". It is either true or false.</p>
     <p>Connectives combine symbols: NOT, AND, OR, and IMPLIES.</p>
     <p>A <b>model</b> is one specific assignment of true/false to every symbol.</p>`,
  symbols: [
    { sym: "$\\neg$", desc: "NOT: flips true to false and false to true. $\\neg R$ = 'not raining'." },
    { sym: "$\\wedge$", desc: "AND: true only when both sides are true." },
    { sym: "$\\vee$", desc: "OR: true when at least one side is true." },
    { sym: "$\\rightarrow$", desc: "IMPLIES: '$f \\rightarrow g$' means 'if $f$ then $g$'." },
    { sym: "model", desc: "a complete true/false assignment to all the symbols." },
    { sym: "$\\models$", desc: "entails: 'KB (Knowledge Base) $\\models f$' means $f$ is true in every model where the knowledge base KB is true." }
  ],
  formula: `$$ \\text{KB} \\models f \\quad\\text{means}\\quad f \\text{ is true in every model where KB is true} $$`,
  whatItDoes:
    `<p>The connectives build sentences. A <b>truth table</b> lists every model and whether each sentence is true.</p>
     <p>A knowledge base (KB) is a set of sentences we accept as true.</p>
     <p><b>Entailment</b> ($\\models$) asks: does $f$ hold in <i>every</i> model that satisfies the KB? If so, $f$ must follow.</p>`,
  example:
    `<p>KB has two facts: $R$ (it is raining) and $R \\rightarrow W$ (if raining, the ground is wet). Does $W$ follow?</p>
     <ul class="steps">
       <li>For the KB to be true, $R$ must be true.</li>
       <li>The rule $R \\rightarrow W$ must also be true. With $R$ true, the rule forces $W$ to be true too.</li>
       <li>So in every model where the KB holds, $W$ is true. Therefore KB $\\models W$.</li>
       <li>Conclusion: the ground is wet. We derived it from the facts.</li>
     </ul>`,
  application:
    `<p>Logic underlies digital circuits (AND, OR, NOT gates), program verification, and rule-based expert systems. When facts are crisp and certain, logic gives exact, checkable reasoning.</p>`,
  whenToUse:
    `<p><b>Use propositional logic when knowledge is crisp and certain</b> — facts that are simply true or false, joined by AND / OR / NOT / IMPLIES — and you need exact, checkable conclusions rather than probabilities.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A Bayes net</b> — when there is no uncertainty; logic gives a hard yes/no entailment instead of a probability.</li>
       <li><b>Ad-hoc if/else code</b> — when you want to <i>ask what follows</i> from a knowledge base, not just hard-code one decision path.</li>
     </ul>
     <p><b>Pick a different framework when:</b></p>
     <ul>
       <li>Facts are uncertain or noisy — use probability (a Bayes net); logic has no notion of "probably".</li>
       <li>You need to talk about objects, relations, and "for all / there exists" — move up to first-order logic.</li>
       <li>The rules are learned from data rather than stated — use a machine-learning model.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Truth tables blow up.</b> $n$ symbols give $2^n$ rows, so checking entailment by table is exponential. Use inference rules or a SAT solver for anything sizeable.</li>
       <li><b>Implication is not causation.</b> $f \\rightarrow g$ only says "if $f$ then $g$"; it is vacuously true whenever $f$ is false, which trips up beginners reading rules.</li>
       <li><b>Brittleness with exceptions.</b> Classical logic cannot say "birds usually fly". One counterexample (a penguin) makes a universal rule false. Real knowledge often needs probabilities or default logic.</li>
       <li><b>An inconsistent knowledge base entails everything.</b> If the KB (Knowledge Base) contains a contradiction, every sentence follows, and the system is useless. Check consistency.</li>
       <li><b>Confusing satisfiable with valid.</b> "True in some model" (satisfiable) is not "true in every model" (valid / entailed). Mixing them gives wrong conclusions.</li>
       <li><b>The closed-world trap.</b> Logic does not assume "unstated means false" unless you say so; be explicit about which assumption you are making.</li>
     </ul>`,
  quiz: {
    q: `KB: $P$ is true, and $P \\rightarrow Q$. Does KB entail $Q$? Explain in one line.`,
    a: `<p>Yes. $P$ is true and the rule $P\\rightarrow Q$ forces $Q$ true, so $Q$ holds in every model of the KB. Thus KB $\\models Q$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-inference-rules",
  demo: function (host) {
    // BEFORE -> AFTER forward chaining on a small propositional KB.
    // BEFORE: only the seed facts are known. Each "Step" applies one round of
    // modus ponens: any rule whose premises are all known fires and adds its
    // conclusion. Newly derived facts are highlighted; the rules that fired glow.
    host.innerHTML = "";
    var W = 640, H = 360;
    // Facts (atoms) and their fixed positions.
    var atoms = ["Rain", "Sprinkler", "Wet", "Slippery", "Cold", "Ice"];
    var pos = {
      Rain: { x: 90, y: 60 }, Sprinkler: { x: 90, y: 150 }, Cold: { x: 90, y: 300 },
      Wet: { x: 330, y: 105 }, Slippery: { x: 560, y: 105 }, Ice: { x: 330, y: 300 }
    };
    // Horn rules: premises (all must hold) -> conclusion.
    var rules = [
      { pre: ["Rain"], con: "Wet" },
      { pre: ["Sprinkler"], con: "Wet" },
      { pre: ["Wet"], con: "Slippery" },
      { pre: ["Wet", "Cold"], con: "Ice" }
    ];
    var seeds = ["Rain", "Cold"];
    var known, justAdded, firedRule, round, done;
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    function reset() {
      known = {}; seeds.forEach(function (a) { known[a] = true; });
      justAdded = {}; firedRule = -1; round = 0; done = false;
      draw("Known facts (BEFORE): <b>" + seeds.join(", ") + "</b>. Press Step to apply modus ponens and derive new facts.");
    }
    function step() {
      if (done) { draw("No more rules can fire — the knowledge base is saturated."); return; }
      justAdded = {}; firedRule = -1;
      var added = [], fired = [];
      rules.forEach(function (r, i) {
        if (known[r.con]) return;                       // already derived
        if (r.pre.every(function (p) { return known[p]; })) {
          known[r.con] = true; justAdded[r.con] = true; added.push(r.con); fired.push(i);
        }
      });
      round++;
      if (added.length === 0) {
        done = true;
        draw("Round " + round + ": no rule's premises are all satisfied that wasn't already used. <b>Done — nothing new is entailed.</b>");
        return;
      }
      var firedTxt = fired.map(function (i) { return rules[i].pre.join("∧") + "→" + rules[i].con; }).join(", ");
      draw("Round " + round + ": fired " + firedTxt + ". <b style=\"color:" + C().accent2 + "\">Newly derived: " + added.join(", ") + "</b> (highlighted).");
    }
    function drawFact(t, a) {
      var p = pos[a], k = known[a], fresh = justAdded[a];
      ctx.beginPath();
      ctx.fillStyle = fresh ? t.accent2 : (k ? t.accent : t.panel);
      ctx.strokeStyle = fresh ? t.accent2 : (k ? t.accent : t.border);
      ctx.lineWidth = fresh ? 4 : 2.5;
      var w = 66, h = 30;
      ctx.beginPath(); ctx.rect(p.x - w / 2, p.y - h / 2, w, h); ctx.fill(); ctx.stroke();
      ctx.fillStyle = (k || fresh) ? "#0d1117" : t.dim; ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(a, p.x, p.y);
    }
    function draw(msg) {
      var t = C(); ctx.clearRect(0, 0, W, H);
      // rule edges premise -> conclusion
      rules.forEach(function (r) {
        var active = r.pre.every(function (p) { return known[p]; });
        r.pre.forEach(function (p) {
          var a = pos[p], b = pos[r.con];
          ctx.strokeStyle = active ? t.accent2 : t.border;
          ctx.lineWidth = active ? 2.5 : 1.5; ctx.setLineDash(active ? [] : [4, 4]);
          var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / d, uy = dy / d;
          var x1 = a.x + ux * 36, y1 = a.y + uy * 18, x2 = b.x - ux * 40, y2 = b.y - uy * 18;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.setLineDash([]);
          // arrowhead
          var ang = Math.atan2(y2 - y1, x2 - x1);
          ctx.fillStyle = active ? t.accent2 : t.dim;
          ctx.beginPath(); ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - 9 * Math.cos(ang - 0.4), y2 - 9 * Math.sin(ang - 0.4));
          ctx.lineTo(x2 - 9 * Math.cos(ang + 0.4), y2 - 9 * Math.sin(ang + 0.4));
          ctx.closePath(); ctx.fill();
        });
      });
      atoms.forEach(function (a) { drawFact(t, a); });
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      var ruleList = rules.map(function (r) { return r.pre.join("∧") + "→" + r.con; }).join("; &nbsp; ");
      out.innerHTML = "Forward chaining (modus ponens). Rules: " + ruleList + ".<br>" +
        "<span style=\"color:" + t.accent + "\">Blue = known fact</span>, " +
        "<span style=\"color:" + t.accent2 + "\">green = just derived this step</span>, grey = not yet known. " +
        "Green arrows = a rule whose premises all hold.<br>" + (msg || "");
    }
    var row = mkRow(host);
    mkBtn(row, "Step (apply rules)", step);
    mkBtn(row, "Reset", reset);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "Inference and resolution",
  tagline: "Mechanical rules that crank out new true facts from old ones.",
  prereqs: ["ai-propositional-logic"],
  bigIdea:
    `<p>Checking truth tables is slow when there are many symbols.</p>
     <p><b>Inference rules</b> derive new facts directly, by pattern. No table needed.</p>
     <p>The most famous is <b>modus ponens</b>; the most powerful is <b>resolution</b>.</p>`,
  buildup:
    `<p><b>Modus ponens</b>: if you know $f$, and you know $f \\rightarrow g$, then you may conclude $g$.</p>
     <p><b>Horn clauses</b> are simple rules ("if these, then that") that modus ponens handles fast.</p>
     <p><b>Resolution</b> is a single rule that, applied over and over, can prove anything that logically follows.</p>
     <p>Resolution requires the knowledge base in <b>CNF (Conjunctive Normal Form)</b> first — an AND of clauses, where each clause is an OR of literals. Convert any sentence to CNF in order:</p>
     <ol>
       <li>Eliminate $\\leftrightarrow$: replace $f \\leftrightarrow g$ with $(f \\rightarrow g) \\wedge (g \\rightarrow f)$.</li>
       <li>Eliminate $\\rightarrow$: replace $f \\rightarrow g$ with $\\neg f \\vee g$.</li>
       <li>Drive in negations using double-negation $\\neg\\neg f \\equiv f$ and De Morgan ($\\neg(f \\wedge g) \\equiv \\neg f \\vee \\neg g$, $\\neg(f \\vee g) \\equiv \\neg f \\wedge \\neg g$).</li>
       <li>Distribute $\\vee$ over $\\wedge$: $f \\vee (g \\wedge h) \\equiv (f \\vee g) \\wedge (f \\vee h)$.</li>
     </ol>`,
  symbols: [
    { sym: "$f, g$", desc: "logical sentences (each true or false)." },
    { sym: "modus ponens", desc: "from $f$ and $f \\rightarrow g$, conclude $g$." },
    { sym: "Horn clause", desc: "a rule with at most one positive conclusion, like 'if A and B then C'." },
    { sym: "resolution", desc: "a rule that combines two clauses and cancels a symbol that appears positive in one and negative in the other." },
    { sym: "soundness", desc: "every fact the rules derive is actually true. No false conclusions." },
    { sym: "completeness", desc: "the rules can derive every fact that truly follows. Nothing true is missed." }
  ],
  formula: `$$ \\frac{f,\\quad f \\rightarrow g}{g} \\qquad\\text{(modus ponens)} $$
     $$ \\frac{f_1 \\vee \\dots \\vee f_n \\vee p, \\quad \\neg p \\vee g_1 \\vee \\dots \\vee g_m}{f_1 \\vee \\dots \\vee f_n \\vee g_1 \\vee \\dots \\vee g_m} \\qquad\\text{(resolution)} $$
     <p>Resolution takes two clauses (disjunctions of literals) sharing a complementary literal $p$ / $\\neg p$ and cancels it, producing a new clause; applied repeatedly it is a complete proof procedure (proof by contradiction: derive the empty clause $=$ False).</p>`,
  whatItDoes:
    `<p>The bar means: from the facts on top, derive the fact below.</p>
     <p>An inference system is <b>sound</b> if it never derives a falsehood, and <b>complete</b> if it can derive every truth.</p>
     <p>Resolution is both sound and complete for propositional logic. <b>First-order logic</b> extends all this with variables and quantifiers (like "for all $x$" and "there exists $x$"), so rules can talk about whole classes of objects, not just fixed facts.</p>`,
  example:
    `<p>KB (Knowledge Base): $\\text{Human(Socrates)}$, and the rule $\\text{Human}(x) \\rightarrow \\text{Mortal}(x)$ ("every human is mortal").</p>
     <ul class="steps">
       <li>We know $\\text{Human(Socrates)}$ is true.</li>
       <li>The rule says: if someone is Human, they are Mortal.</li>
       <li>Match $x$ = Socrates. Modus ponens fires: conclude $\\text{Mortal(Socrates)}$.</li>
       <li>We derived a new true fact without any truth table.</li>
     </ul>
     <p>The quantified rule "for all $x$" is first-order logic; the plain $f, f\\rightarrow g$ step is propositional modus ponens.</p>`,
  application:
    `<p>Automated theorem provers, the Prolog programming language, and formal verification of software all run on resolution and modus ponens. They let a machine prove conclusions that are guaranteed correct.</p>`,
  whenToUse:
    `<p><b>Use inference rules when you need to derive new facts mechanically from a knowledge base, without building a full truth table.</b> They are how a logic system actually proves things.</p>
     <p><b>Which rule:</b></p>
     <ul>
       <li><b>Modus ponens / forward chaining</b> — when your knowledge is Horn clauses ("if these, then that"); it is fast and is exactly how Prolog and rule engines run.</li>
       <li><b>Resolution</b> — when you need a complete proof procedure for full propositional (or first-order) logic, including proof by contradiction.</li>
       <li><b>First-order logic</b> — when rules must quantify over objects ("for all $x$"), not just fixed facts.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>Facts are uncertain — use probabilistic inference, not logical entailment.</li>
       <li>You just need to test satisfiability of many clauses — a modern SAT solver beats hand-rolled resolution.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Forward chaining only handles Horn clauses.</b> Plain modus ponens cannot derive everything in full propositional logic. For general entailment you need resolution.</li>
       <li><b>Resolution needs Conjunctive Normal Form (CNF).</b> You must first convert sentences to CNF; a wrong conversion silently changes the meaning. Automate and test it.</li>
       <li><b>First-order resolution can run forever.</b> It is complete but only semi-decidable — on an unprovable goal it may never halt. Bound the search or depth.</li>
       <li><b>Unification bugs.</b> Matching variables across clauses (Socrates for $x$) is subtle; a missing occurs-check or wrong substitution yields false proofs.</li>
       <li><b>Soundness vs completeness confusion.</b> Sound means "never derives a falsehood"; complete means "derives every truth". A system can be one without the other — know which you have.</li>
       <li><b>Combinatorial blow-up.</b> Resolving every clause pair generates huge numbers of new clauses. Use ordering and subsumption strategies to keep it tractable.</li>
     </ul>`,
  quiz: {
    q: `You know $\\text{Bird(Tweety)}$ and the rule $\\text{Bird}(x) \\rightarrow \\text{CanFly}(x)$. What does modus ponens conclude?`,
    a: `<p>Match $x = $ Tweety. From $\\text{Bird(Tweety)}$ and the rule, modus ponens concludes $\\text{CanFly(Tweety)}$.</p>`
  }
});

})();
