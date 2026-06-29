/* =====================================================================
   MODULE 0 — FOUNDATIONS: the math you need before anything else.
   This file is the GOLD STANDARD for lesson style:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Foundations: Math you need first";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---------------------------------------------------------------- */
L({
  id: "fnd-vector",
  demo: function (host) {
    // Bespoke: a draggable arrow on a light coordinate grid, with the x-leg (to
    // the right) and y-leg (up) drawn so the [x, y] decomposition is visible.
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 520; cv.height = 360; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var v = [3, 2];
    var rng = 5, P = 24, cx = 260, cy = 180, sc = (260 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      // light grid
      ctx.lineWidth = 1;
      for (var g = -rng; g <= rng; g++) {
        ctx.strokeStyle = (g === 0) ? c.border : (c.border + "66");
        ctx.beginPath(); ctx.moveTo(px(g), py(-rng)); ctx.lineTo(px(g), py(rng)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px(-rng), py(g)); ctx.lineTo(px(rng), py(g)); ctx.stroke();
      }
      var x = v[0], y = v[1];
      // component legs: x to the right, y up
      ctx.setLineDash([5, 4]); ctx.lineWidth = 2;
      ctx.strokeStyle = c.warn;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(x), py(0)); ctx.stroke();
      ctx.strokeStyle = c.accent2;
      ctx.beginPath(); ctx.moveTo(px(x), py(0)); ctx.lineTo(px(x), py(y)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = c.warn; ctx.fillText("x = " + x, (px(0) + px(x)) / 2, py(0) + (y >= 0 ? 16 : -16));
      ctx.fillStyle = c.accent2; ctx.fillText("y = " + y, px(x) + (x >= 0 ? 26 : -26), (py(0) + py(y)) / 2);

      // the vector arrow
      ctx.strokeStyle = c.accent; ctx.fillStyle = c.accent; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(x), py(y)); ctx.stroke();
      if (x !== 0 || y !== 0) {
        var ang = Math.atan2(py(y) - py(0), px(x) - px(0));
        ctx.beginPath(); ctx.moveTo(px(x), py(y));
        ctx.lineTo(px(x) - 11 * Math.cos(ang - 0.4), py(y) - 11 * Math.sin(ang - 0.4));
        ctx.lineTo(px(x) - 11 * Math.cos(ang + 0.4), py(y) - 11 * Math.sin(ang + 0.4));
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = c.accent; ctx.textAlign = "left";
      ctx.fillText("x", px(x) + 8, py(y) - 8);

      var len = Math.sqrt(x * x + y * y);
      ctx.textBaseline = "alphabetic"; ctx.font = "14px sans-serif";
      ctx.fillStyle = c.ink; ctx.fillText("x = [" + x + ", " + y + "]", 16, cv.height - 26);
      ctx.fillStyle = c.accent;
      ctx.fillText("‖x‖ = √(" + (x * x) + " + " + (y * y) + ") = " + len.toFixed(3), 200, cv.height - 26);
    }

    function rel(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }; }
    var drag = false;
    cv.addEventListener("mousedown", function (e) { var m = rel(e); if (Math.hypot(m.x - px(v[0]), m.y - py(v[1])) < 18) drag = true; });
    cv.addEventListener("mousemove", function (e) {
      if (!drag) return; var m = rel(e);
      v[0] = Math.max(-rng, Math.min(rng, Math.round((m.x - cx) / sc)));
      v[1] = Math.max(-rng, Math.min(rng, Math.round((cy - m.y) / sc)));
      draw();
    });
    window.addEventListener("mouseup", function () { drag = false; });
    var hint = document.createElement("div"); hint.className = "hint";
    hint.textContent = "Drag the arrow tip. The dashed legs show the [x, y] components.";
    host.appendChild(hint);
    draw();
  },
  title: "Vectors",
  tagline: "A vector is just a list of numbers. That's the whole secret.",
  bigIdea:
    `<p>A <b>vector</b> is an ordered list of numbers.</p>
     <p>That's it. No magic.</p>
     <p>One house can be described by numbers: size, bedrooms, age. Put them in a list. That list is a vector.</p>
     <p>In machine learning, every example (a house, a photo, a user) becomes a vector of numbers. The whole field runs on vectors.</p>`,
  buildup:
    `<p>You already know a single number, like $5$. We call that a <b>scalar</b>.</p>
     <p>A vector stacks several scalars together. We write it standing up (a column):</p>`,
  symbols: [
    { sym: "$x$", desc: "the whole vector. Bold or lower-case letters are common." },
    { sym: "$x_i$", desc: "the $i$-th number inside the vector. The little $i$ is the position." },
    { sym: "$\\mathbb{R}^n$", desc: "the set of all vectors with $n$ real numbers. 'R' = real numbers, 'n' = how many." },
    { sym: "$n$", desc: "the length of the vector (how many numbers it holds). Also called the dimension." }
  ],
  formula: `$$ x = \\begin{bmatrix} x_1 \\\\ x_2 \\\\ \\vdots \\\\ x_n \\end{bmatrix} \\in \\mathbb{R}^n $$`,
  whatItDoes:
    `<p>Read it left to right: "$x$ is a stack of $n$ numbers, $x_1$ down to $x_n$, and it lives in $\\mathbb{R}^n$."</p>
     <p>$\\in$ means "is a member of". So $x \\in \\mathbb{R}^n$ just means "$x$ is one of the $n$-number vectors".</p>`,
  example:
    `<p>Let's turn one house into a vector. Start with the raw measurements, in a fixed order.</p>
     <table class="extable">
       <caption>One house, three features, stacked into position order.</caption>
       <thead><tr><th>Position $i$</th><th>Feature</th><th class="num">Value $x_i$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">1</td><td>size (sq ft)</td><td class="num">1500</td></tr>
         <tr><td class="row-h">2</td><td>bedrooms</td><td class="num">3</td></tr>
         <tr><td class="row-h">3</td><td>age (years)</td><td class="num">10</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Stack the values in that order into a column:
           $x = \\begin{bmatrix} 1500 \\\\ 3 \\\\ 10 \\end{bmatrix}$.</li>
       <li>Read the entries back by position: $x_1 = 1500$ (size), $x_2 = 3$ (bedrooms), $x_3 = 10$ (age).</li>
       <li>Count the entries: there are $3$, so $n = 3$ and we write $x \\in \\mathbb{R}^3$.</li>
     </ul>
     <p>A second house is just another vector. A whole dataset is many such vectors.</p>`,
  application:
    `<p>Every input to every ML (Machine Learning) model is a vector. A 28×28 grayscale digit becomes a vector of 784 pixel values. A user becomes a vector of their actions. Learning to think in vectors is step one.</p>`,
  whenToUse:
    `<p>Vectors show up the instant you turn any real thing — a user, a document, an image, a sensor reading — into numbers a model can chew on. The "feature vector" is the universal input format for ML (Machine Learning).</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Feature engineering</b> — every column you add is one more entry in the vector; the whole pipeline exists to build good ones.</li>
       <li><b>Embeddings</b> — words, products, and faces become dense vectors so "similar" means "close", which powers search and recommendations.</li>
       <li><b>Batching</b> — stacking example vectors into a matrix is what lets GPUs (Graphics Processing Units) score thousands at once.</li>
     </ul>
     <p><b>Think bigger than a list when:</b> the data is a grid (an image is better held as a 2-D array / tensor) or a sequence (text needs order, not just a bag of numbers) — though both still flatten to vectors eventually. In practice you build them with <code>numpy</code> arrays or <code>torch</code> tensors, not Python lists.</p>`,
  pitfalls:
    `<ul>
       <li><b>Order is part of the meaning.</b> Entry 2 must be "bedrooms" for <i>every</i> example. Shuffle the columns of one row and the model learns garbage — fix a schema and never reorder.</li>
       <li><b>Unscaled features dominate.</b> A "size" of 1500 and an "age" of 10 live on wildly different scales, so distance and gradients drown out the small one. Standardize (zero mean, unit variance) before anything that uses magnitude.</li>
       <li><b>Mixing units silently breaks things.</b> Square feet in one row and square meters in another is invisible to the code but poison to the model. Normalize units at ingest.</li>
       <li><b>Categories are not numbers.</b> Encoding "red=1, green=2, blue=3" invents a fake ordering. Use one-hot or learned embeddings instead.</li>
       <li><b>Missing entries aren't zero.</b> A blank becoming $0$ quietly says "this house has size zero". Impute explicitly and add a "was-missing" flag.</li>
       <li><b>Length must be fixed.</b> Two examples with different vector lengths can't share a model. Pad, truncate, or aggregate to a constant $n$.</li>
     </ul>`,
  quiz: {
    q: `A movie is described by [running time = 120, rating = 8.5, year = 1999]. What are $n$, $x_2$, and what does $\\mathbb{R}^n$ mean here?`,
    a: `<p>$n = 3$ (three numbers). $x_2 = 8.5$ (the second entry, the rating). $\\mathbb{R}^3$ = the set of all 3-number vectors, which is where this movie-vector lives.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-dot",
  demo: function (host) {
    // Bespoke: two columns of numbers a and b, pairing lines, products in the
    // middle, summed at the bottom = dot product. Plus a small 2D axis with the
    // two arrows and the angle between them. Drag arrow tips to drive numbers.
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var a = [3, 1], b = [1, 3];
    var rng = 5;
    // axis box on the right of the canvas
    var ax0 = 430, ay0 = 30, axW = 180, axH = 180;
    var ocx = ax0 + axW / 2, ocy = ay0 + axH / 2, asc = (axW / 2 - 14) / rng;
    function apx(x) { return ocx + x * asc; }
    function apy(y) { return ocy - y * asc; }

    function arrow(x1, y1, x2, y2, col) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 10 * Math.cos(ang - 0.4), y2 - 10 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 10 * Math.cos(ang + 0.4), y2 - 10 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.textBaseline = "middle";
      var p0 = a[0] * b[0], p1 = a[1] * b[1], dot = p0 + p1;
      // column x positions
      var xA = 70, xB = 150, xP = 300, yTop = 70, rowH = 60;
      ctx.font = "13px sans-serif"; ctx.textAlign = "center";
      // headers
      ctx.fillStyle = c.accent; ctx.fillText("a", xA, 36);
      ctx.fillStyle = c.purple; ctx.fillText("b", xB, 36);
      ctx.fillStyle = c.warn; ctx.fillText("aᵢ · bᵢ", xP, 30);
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
      ctx.fillText("multiply matching entries", xP, 48);

      function cell(x, y, txt, col, w) {
        ctx.fillStyle = c.panel; ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.fillRect(x - w / 2, y - 18, w, 36); ctx.strokeRect(x - w / 2, y - 18, w, 36);
        ctx.fillStyle = col; ctx.font = "16px sans-serif"; ctx.fillText(txt, x, y);
      }
      for (var i = 0; i < 2; i++) {
        var y = yTop + i * rowH;
        // pairing line a_i -> b_i
        ctx.strokeStyle = c.dim; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(xA + 18, y); ctx.lineTo(xB - 18, y); ctx.stroke();
        // line b_i -> product
        ctx.beginPath(); ctx.moveTo(xB + 18, y); ctx.lineTo(xP - 30, y); ctx.stroke();
        ctx.setLineDash([]);
        cell(xA, y, String(a[i]), c.accent, 34);
        cell(xB, y, String(b[i]), c.purple, 34);
        ctx.fillStyle = c.dim; ctx.font = "13px sans-serif";
        ctx.fillText("×", (xA + xB) / 2, y);
        cell(xP, y, a[i] + "·" + b[i] + " = " + (i === 0 ? p0 : p1), c.warn, 90);
      }
      // sum bracket at the bottom
      var yS = yTop + rowH + 50;
      ctx.strokeStyle = c.border; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(xP - 50, yTop + rowH + 22); ctx.lineTo(xP + 50, yTop + rowH + 22); ctx.stroke();
      ctx.fillStyle = c.ink; ctx.font = "15px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("sum:  " + p0 + " + " + p1 + " = ", xP - 28, yS);
      ctx.fillStyle = c.accent2; ctx.font = "20px sans-serif";
      ctx.fillText(String(dot), xP + 78, yS);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("a · b  (the dot product)", xP, yS + 26);

      // -------- small 2D axis with arrows + angle --------
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(ax0, ocy); ctx.lineTo(ax0 + axW, ocy);
      ctx.moveTo(ocx, ay0); ctx.lineTo(ocx, ay0 + axH);
      ctx.stroke();
      arrow(apx(0), apy(0), apx(a[0]), apy(a[1]), c.accent);
      arrow(apx(0), apy(0), apx(b[0]), apy(b[1]), c.purple);
      ctx.fillStyle = c.accent; ctx.font = "13px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("a", apx(a[0]) + 6, apy(a[1]) - 6);
      ctx.fillStyle = c.purple;
      ctx.fillText("b", apx(b[0]) + 6, apy(b[1]) - 6);
      // angle arc + label
      var na = Math.hypot(a[0], a[1]), nb = Math.hypot(b[0], b[1]);
      ctx.textAlign = "center"; ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
      if (na > 0 && nb > 0) {
        var cos = Math.max(-1, Math.min(1, dot / (na * nb)));
        var th = Math.acos(cos) * 180 / Math.PI;
        var aa = Math.atan2(a[1], a[0]), ab = Math.atan2(b[1], b[0]);
        ctx.strokeStyle = c.warn; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(apx(0), apy(0), 26, -Math.max(aa, ab), -Math.min(aa, ab)); ctx.stroke();
        ctx.fillStyle = c.warn;
        ctx.fillText("θ ≈ " + th.toFixed(0) + "°", ocx, ay0 + axH + 16);
      }
    }

    function rel(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }; }
    var drag = null;
    cv.addEventListener("mousedown", function (e) {
      var m = rel(e);
      if (Math.hypot(m.x - apx(a[0]), m.y - apy(a[1])) < 16) drag = a;
      else if (Math.hypot(m.x - apx(b[0]), m.y - apy(b[1])) < 16) drag = b;
    });
    cv.addEventListener("mousemove", function (e) {
      if (!drag) return; var m = rel(e);
      drag[0] = Math.max(-rng, Math.min(rng, Math.round((m.x - ocx) / asc)));
      drag[1] = Math.max(-rng, Math.min(rng, Math.round((ocy - m.y) / asc)));
      draw();
    });
    window.addEventListener("mouseup", function () { drag = null; });
    var hint = document.createElement("div"); hint.className = "hint";
    hint.textContent = "Drag arrow tip a or b on the small axis to change the numbers.";
    host.appendChild(hint);
    draw();
  },
  title: "The dot product (inner product)",
  tagline: "Multiply two lists, add it all up, get one number. It measures agreement.",
  prereqs: ["fnd-vector"],
  bigIdea:
    `<p>The <b>dot product</b> takes two vectors and returns a single number.</p>
     <p>Recipe: multiply matching entries, then add everything.</p>
     <p>Why care? The result tells you how much two vectors <i>point the same way</i>. Big positive number = they agree. Zero = unrelated. Negative = they disagree.</p>
     <p>This one operation is the heart of almost every model: a prediction is usually a dot product of "weights" and "features".</p>`,
  buildup:
    `<p>You have two vectors of the same length. You want to combine them into one score.</p>
     <p>The natural way: pair them up and multiply, position by position. Then sum.</p>`,
  symbols: [
    { sym: "$x, y$", desc: "two vectors, each with $n$ numbers." },
    { sym: "$x^\\top y$", desc: "the dot product of $x$ and $y$. The little $\\top$ ('transpose') just lays $x$ on its side so the multiply lines up. Also written $x \\cdot y$." },
    { sym: "$\\sum_{i=1}^{n}$", desc: "'add up, for $i$ going from 1 to $n$'. The $\\Sigma$ is a capital Greek S, for Sum." },
    { sym: "$x_i y_i$", desc: "the $i$-th number of $x$ times the $i$-th number of $y$." },
    { sym: "$w$", desc: "a weight vector used in the example: how much each feature counts. Same length as $x$." }
  ],
  formula: `$$ x^\\top y = \\sum_{i=1}^{n} x_i\\, y_i \\;\\in\\; \\mathbb{R} $$`,
  whatItDoes:
    `<p>The $\\sum$ says: walk through every position $i$, multiply $x_i$ by $y_i$, and keep a running total.</p>
     <p>The answer is a plain number (it lives in $\\mathbb{R}$), not a vector.</p>`,
  example:
    `<p>First, the recipe as a prediction. Let $x = [1500, 3, 10]$ be a house and $w = [200, 10000, -500]$ be "price weights" (dollars per sq ft, per bedroom, per year of age). The dot product pairs them up:</p>
     <table class="extable">
       <caption>$w^\\top x$: multiply matching entries, then sum the column.</caption>
       <thead><tr><th>$i$</th><th class="num">$x_i$</th><th class="num">$w_i$</th><th class="num">$x_i\\, w_i$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">size</td><td class="num">1500</td><td class="num">200</td><td class="num">300000</td></tr>
         <tr><td class="row-h">bedrooms</td><td class="num">3</td><td class="num">10000</td><td class="num">30000</td></tr>
         <tr><td class="row-h">age</td><td class="num">10</td><td class="num">−500</td><td class="num">−5000</td></tr>
         <tr><td class="row-h">sum</td><td class="num"></td><td class="num"></td><td class="num">325000</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Multiply matching entries: $1500\\times200 = 300000$, &nbsp; $3\\times10000 = 30000$, &nbsp; $10\\times(-500) = -5000$.</li>
       <li>Add them: $300000 + 30000 - 5000 = 325000$. So $w^\\top x = \\$325{,}000$, a price prediction.</li>
     </ul>
     <p>Now the real punchline: <b>the dot product measures agreement.</b> Take $a = [1, 0]$ (points right) and dot it with three other vectors to see all three cases with numbers:</p>
     <table class="extable">
       <caption>Same fixed $a=[1,0]$, three partners: sign of $a\\cdot b$ tells the relationship.</caption>
       <thead><tr><th>Partner $b$</th><th class="num">$a\\cdot b$</th><th>Meaning</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$[3, 0]$</td><td class="num">3</td><td>positive &rarr; agree (same direction)</td></tr>
         <tr><td class="row-h">$[0, 5]$</td><td class="num">0</td><td>zero &rarr; unrelated (perpendicular)</td></tr>
         <tr><td class="row-h">$[-4, 0]$</td><td class="num">−4</td><td>negative &rarr; disagree (opposite)</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li><b>Same direction</b> &mdash; $a\\cdot[3,0] = 1\\times3 + 0\\times0 = 3$.
           <div class="why">Pointing the same way makes every pair positive, so the sum is positive.</div></li>
       <li><b>Perpendicular</b> &mdash; $a\\cdot[0,5] = 1\\times0 + 0\\times5 = 0$.
           <div class="why">A dot product of exactly $0$ is the signal for "at right angles / unrelated". This is why $0$ means orthogonal.</div></li>
       <li><b>Opposite direction</b> &mdash; $a\\cdot[-4,0] = 1\\times(-4) + 0\\times0 = -4$.
           <div class="why">Pointing against each other makes the products negative, so the sum goes negative: they disagree.</div></li>
     </ul>
     <p>So $+3$ (agree), $0$ (unrelated), $-4$ (disagree) &mdash; one number tells you how much two vectors point the same way. That is exactly why the negative age-weight $-500$ above pushes the price <i>down</i>: it disagrees with age.</p>`,
  application:
    `<p>Linear regression, logistic regression, SVMs (Support Vector Machines), and every neuron in a neural net compute a dot product of weights and inputs first, then do something with that number. Master this and half of ML (Machine Learning) stops being scary.</p>`,
  whenToUse:
    `<p>The dot product is the workhorse "agreement score" — reach for it any time you need one number that says how aligned two vectors are. It is the atom that every linear model and attention layer is built from.</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Every prediction</b> — a linear or logistic model is literally weights dotted with features, then a squashing function.</li>
       <li><b>Similarity search</b> — cosine similarity is a dot product of length-normalized vectors; it ranks embeddings in recommendations and RAG (Retrieval-Augmented Generation).</li>
       <li><b>Attention</b> — transformers score query against key with a dot product to decide what to focus on.</li>
       <li><b>Projection</b> — dotting with a unit vector tells you "how much of this points along that direction".</li>
     </ul>
     <p><b>Use a different measure when:</b> you care about magnitude differences, not just direction — then L2 (Euclidean) distance fits better; or when features are on different scales — normalize first or the largest entry dominates. In code it is one <code>np.dot</code> / <code>@</code> call, fused into matrix multiplies for speed.</p>`,
  pitfalls:
    `<ul>
       <li><b>It explodes with scale.</b> The dot product grows with vector length, so a big-magnitude feature can dominate the score. For pure direction use <b>cosine similarity</b> (divide by both norms).</li>
       <li><b>Zero means orthogonal, not "opposite".</b> A common mix-up: $0$ is "unrelated / at right angles", while a <i>negative</i> value is "pointing against". Don't read $0$ as disagreement.</li>
       <li><b>Lengths must match.</b> Dotting an $n$-vector with an $m$-vector ($m \\ne n$) is undefined — a shape mismatch, not a small bug. Check dimensions.</li>
       <li><b>Float summation drifts.</b> Adding many terms accumulates rounding error; for very long or ill-scaled vectors use a stable reduction (pairwise / Kahan summation) or higher precision.</li>
       <li><b>Cosine is undefined for a zero vector.</b> If either vector is all zeros, its norm is $0$ and you divide by zero. Guard with an epsilon or skip the row.</li>
       <li><b>Forgetting to center.</b> Cosine on un-centered data can call everything "similar" because all entries are positive. Mean-center when "shape" matters more than sign.</li>
     </ul>`,
  quiz: {
    q: `Compute the dot product of $[2, 0, 1]$ and $[3, 5, 4]$.`,
    a: `<p>$2\\times3 + 0\\times5 + 1\\times4 = 6 + 0 + 4 = 10$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-matrix",
  demo: function (host) {
    Demos.grid(host, {
      rows: 2, cols: 2, cellSize: 90,
      controls: [
        { key: "a11", label: "A₁,₁", min: -5, max: 5, val: 1, step: 1 },
        { key: "a12", label: "A₁,₂", min: -5, max: 5, val: 2, step: 1 },
        { key: "a21", label: "A₂,₁", min: -5, max: 5, val: 3, step: 1 },
        { key: "a22", label: "A₂,₂", min: -5, max: 5, val: 4, step: 1 }
      ],
      cell: function (r, c, s) {
        var keys = [["a11", "a12"], ["a21", "a22"]];
        var v = s[keys[r][c]];
        var mag = Math.min(1, Math.abs(v) / 5);
        var aa = Math.round(40 + mag * 160).toString(16);
        if (aa.length < 2) aa = "0" + aa;
        var color = v >= 0 ? ("#4ea1ff" + aa) : ("#ff7b72" + aa);
        return { color: color, label: "A" + (r + 1) + (c + 1) + " = " + v };
      },
      readout: function (s) {
        return "Shape: 2 rows × 2 columns = <b>2×2</b>. " +
          "Each cell is one entry; e.g. A₂,₁ = <b>" + s.a21 + "</b> (row 2, column 1). " +
          "Blue = positive, red = negative; darker = larger.";
      }
    });
  },
  title: "Matrices",
  tagline: "A grid of numbers. Stack many vectors and you get a matrix.",
  prereqs: ["fnd-vector"],
  bigIdea:
    `<p>A <b>matrix</b> is a rectangle of numbers, with rows and columns.</p>
     <p>Think of a spreadsheet. Each row is one example. Each column is one feature.</p>
     <p>A whole dataset of 1000 houses, each with 3 numbers, is a $1000 \\times 3$ matrix.</p>`,
  buildup:
    `<p>One vector describes one thing. But you have many things. Stack their vectors as rows. Now you have a matrix.</p>`,
  symbols: [
    { sym: "$A$", desc: "the matrix. Capital letters are used for matrices." },
    { sym: "$\\mathbb{R}^{m\\times n}$", desc: "all matrices with $m$ rows and $n$ columns." },
    { sym: "$m$", desc: "number of rows (often: number of examples)." },
    { sym: "$n$", desc: "number of columns (often: number of features)." },
    { sym: "$A_{i,j}$", desc: "the number in row $i$, column $j$. Row first, column second." }
  ],
  formula: `$$ A = \\begin{bmatrix} A_{1,1} & \\cdots & A_{1,n} \\\\ \\vdots & \\ddots & \\vdots \\\\ A_{m,1} & \\cdots & A_{m,n} \\end{bmatrix} \\in \\mathbb{R}^{m\\times n} $$`,
  whatItDoes:
    `<p>$A_{2,3}$ means "go to row 2, column 3, read that number". The dots ($\\cdots$, $\\vdots$, $\\ddots$) just mean "and so on" across, down, and diagonally.</p>`,
  example:
    `<p>Let's build a matrix from three houses, two features each (size, bedrooms). One house per row, one feature per column.</p>
     <table class="extable">
       <caption>Three houses &times; two features. Each row is one example.</caption>
       <thead><tr><th>House (row)</th><th class="num">size (col 1)</th><th class="num">bedrooms (col 2)</th></tr></thead>
       <tbody>
         <tr><td class="row-h">1</td><td class="num">1500</td><td class="num">3</td></tr>
         <tr><td class="row-h">2</td><td class="num">900</td><td class="num">2</td></tr>
         <tr><td class="row-h">3</td><td class="num">2200</td><td class="num">4</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Stack the three rows into a grid:
           $A = \\begin{bmatrix} 1500 & 3 \\\\ 900 & 2 \\\\ 2200 & 4 \\end{bmatrix}$.</li>
       <li>Count the shape: $3$ rows, $2$ columns. So $m = 3$, $n = 2$, and $A \\in \\mathbb{R}^{3\\times 2}$.</li>
       <li>Read a cell by (row, column): $A_{2,1} = 900$ (house 2's size).</li>
       <li>Another cell: $A_{3,2} = 4$ (house 3's bedrooms).</li>
     </ul>`,
  application:
    `<p>Datasets are matrices (rows = examples, columns = features). Images are matrices of pixels. Neural-network layers are matrices of weights. Almost all ML (Machine Learning) computation is "matrix in, matrix out".</p>`,
  whenToUse:
    `<p>The moment you have <i>many</i> examples or <i>many</i> features, you reach for a matrix. It is the data structure the whole numerical stack is optimized around, so packing data into one is how you make ML (Machine Learning) code both clean and fast.</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Vectorized batches</b> — one matrix multiply scores a whole dataset, replacing a slow per-row Python loop and letting BLAS / GPU (Graphics Processing Unit) kernels run flat-out.</li>
       <li><b>Neural-network layers</b> — each dense layer is a weight matrix; the forward pass is matrix multiplies.</li>
       <li><b>Decompositions</b> — SVD (Singular Value Decomposition) and eigen-decomposition power PCA (Principal Component Analysis), recommenders, and compression.</li>
     </ul>
     <p><b>Reach for something else when:</b> the data is mostly zeros (use a <b>sparse</b> matrix like <code>scipy.sparse</code> to save memory) or has more than two axes — images and sequences need a higher-rank <b>tensor</b>, not a flat 2-D grid. Day to day this is a <code>numpy</code> 2-D array or a <code>torch</code> tensor.</p>`,
  pitfalls:
    `<ul>
       <li><b>Row-major vs column-major confusion.</b> Is a row an example or a feature? Pick the convention (rows = examples here) and label your shapes, or transposes will silently corrupt results.</li>
       <li><b>Shape mismatches in multiplication.</b> An $(m\\times n)$ times $(p\\times q)$ only works when $n = p$. Most matrix bugs are a missing transpose — print <code>.shape</code> first.</li>
       <li><b>Dense storage blows up memory.</b> A $100000 \\times 100000$ dense matrix is tens of gigabytes. If it is mostly zeros, store it sparse.</li>
       <li><b>Indexing is row-then-column, and often 0-based in code.</b> Math writes $A_{2,1}$ (1-based); <code>numpy</code> writes <code>A[1, 0]</code>. Off-by-one and swapped indices are classic slips.</li>
       <li><b>In-place edits alias.</b> A slice of a <code>numpy</code> array is a view, so writing to it mutates the original. Copy when you mean to copy.</li>
       <li><b>Mixed dtypes downcast silently.</b> An integer matrix that meets a float can truncate or overflow. Set the dtype on purpose.</li>
     </ul>`,
  quiz: {
    q: `In the house matrix above, what is $A_{1,2}$, and what does it mean?`,
    a: `<p>$A_{1,2} = 3$: row 1, column 2 — the first house has 3 bedrooms.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-matvec",
  demo: function (host) {
    // Bespoke: A (2x2 grid) times x (column) = result (column). Highlight the
    // active row of A and all of x, show that row dotted with x, write it into
    // the result. A button steps row 1 -> row 2.
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var A = [[2, 0], [0, 1]];
    var x = [3, 2];
    var step = 0; // 0 = nothing done, 1 = row1 done, 2 = both done
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 260; host.appendChild(cv);
    var ctx = cv.getContext("2d");

    function cellBox(cx, cy, w, h, txt, fill, txtCol, border) {
      ctx.fillStyle = fill; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
      ctx.strokeStyle = border; ctx.lineWidth = 1.5; ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
      ctx.fillStyle = txtCol; ctx.font = "17px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(txt, cx, cy);
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      var active = (step >= 1 && step <= 2) ? (step - 1) : -1; // row currently highlighted
      var cw = 46, ch = 46, gap = 4;
      var Ax = 70, Ay0 = 70;            // top-left of A grid
      var xCol = Ax + 2 * (cw + gap) + 40;
      var eqX = xCol + cw + 36;
      var rCol = eqX + 36;

      // label A and x
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("A", Ax + (cw + gap) / 2 + cw / 2, Ay0 - 36);
      ctx.fillText("x", xCol, Ay0 - 36);
      ctx.fillText("Ax", rCol, Ay0 - 36);

      // A grid
      for (var r = 0; r < 2; r++) {
        var rowHi = (r === active);
        for (var k = 0; k < 2; k++) {
          var bx = Ax + k * (cw + gap) + cw / 2;
          var by = Ay0 + r * (ch + gap) + ch / 2;
          var fill = rowHi ? (c.accent + "33") : c.panel;
          var bord = rowHi ? c.accent : c.border;
          cellBox(bx, by, cw, ch, String(A[r][k]), fill, c.ink, bord);
        }
      }
      // x column (always highlighted, it is used for every row)
      for (var j = 0; j < 2; j++) {
        var xy = Ay0 + j * (ch + gap) + ch / 2;
        cellBox(xCol, xy, cw, ch, String(x[j]), c.purple + "33", c.ink, c.purple);
      }
      // equals
      var midY = Ay0 + ch + gap / 2;
      ctx.fillStyle = c.dim; ctx.font = "22px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("=", eqX, midY);

      // result column
      var res = [A[0][0] * x[0] + A[0][1] * x[1], A[1][0] * x[0] + A[1][1] * x[1]];
      for (var m = 0; m < 2; m++) {
        var ry = Ay0 + m * (ch + gap) + ch / 2;
        var done = (m < step);
        var fill2 = done ? (c.accent2 + "33") : c.panel;
        var bord2 = (m === active) ? c.accent2 : c.border;
        cellBox(rCol, ry, cw, ch, done ? String(res[m]) : "?", fill2, done ? c.ink : c.dim, bord2);
      }

      // explanation line for the active / just-finished row
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "14px sans-serif";
      var explY = 210;
      ctx.fillStyle = c.ink;
      var msg;
      if (step === 0) {
        msg = "Click the button: take row 1 of A, dot it with all of x.";
      } else {
        var r2 = step - 1;
        msg = "row " + step + " · x = " + A[r2][0] + "·" + x[0] + " + " + A[r2][1] + "·" + x[1] +
          " = " + res[r2] + "   →   write " + res[r2] + " into Ax slot " + step + ".";
      }
      ctx.fillText(msg, 40, explY);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("Each row of A makes one dot product. Ax has one number per row.", 40, explY + 22);
    }

    var btnRow = document.createElement("div"); btnRow.style.margin = "8px 0";
    var nextBtn = document.createElement("button");
    var resetBtn = document.createElement("button");
    var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
    nextBtn.style.cssText = BTN; resetBtn.style.cssText = BTN;
    nextBtn.textContent = "Do next row ▸"; resetBtn.textContent = "Reset";
    nextBtn.addEventListener("click", function () { step = (step >= 2) ? 2 : step + 1; draw(); });
    resetBtn.addEventListener("click", function () { step = 0; draw(); });
    btnRow.appendChild(nextBtn); btnRow.appendChild(resetBtn);
    host.appendChild(btnRow);
    draw();
  },
  title: "Matrix × vector",
  tagline: "Apply the same dot product to every row at once.",
  prereqs: ["fnd-dot", "fnd-matrix"],
  bigIdea:
    `<p>Multiplying a matrix by a vector does one dot product per row.</p>
     <p>So you can score a whole dataset of examples in a single step.</p>
     <p>This is why ML code is fast: one matrix multiply replaces a thousand loops.</p>`,
  buildup:
    `<p>You learned the dot product turns weights + one example into one prediction.</p>
     <p>You have many examples stacked in a matrix. Do the dot product against each row. Collect the answers into a new vector.</p>`,
  symbols: [
    { sym: "$A$", desc: "an $m\\times n$ matrix. Each of its $m$ rows is one example/vector." },
    { sym: "$x$", desc: "a vector with $n$ numbers (e.g. the weights). Length must match the columns of $A$." },
    { sym: "$Ax$", desc: "the result: a vector with $m$ numbers (one score per row)." },
    { sym: "$a_{r,i}^{\\top}$", desc: "row $i$ of $A$, written as a flat vector so it can dot with $x$." }
  ],
  formula: `$$ Ax = \\begin{bmatrix} a_{r,1}^{\\top} x \\\\ \\vdots \\\\ a_{r,m}^{\\top} x \\end{bmatrix} \\in \\mathbb{R}^{m} $$`,
  whatItDoes:
    `<p>Row by row: take row $i$ of $A$, dot it with $x$, write the number in slot $i$ of the answer.</p>
     <p>Rule to remember: an $(m\\times n)$ matrix times an $(n)$ vector gives an $(m)$ vector. The inner $n$'s must match and cancel.</p>`,
  example:
    `<p>Two houses $A=\\begin{bmatrix}1500 & 3\\\\900 & 2\\end{bmatrix}$, price weights $x=\\begin{bmatrix}200\\\\10000\\end{bmatrix}$. Each row of $A$ gets dotted with $x$, giving one price per row.</p>
     <table class="extable">
       <caption>$Ax$: one dot product per row &rarr; one score per row.</caption>
       <thead><tr><th>Row of $A$</th><th>row $\\cdot\\, x$</th><th class="num">result</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$[1500, 3]$</td><td>$1500\\times200 + 3\\times10000$</td><td class="num">330000</td></tr>
         <tr><td class="row-h">$[900, 2]$</td><td>$900\\times200 + 2\\times10000$</td><td class="num">200000</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Row 1 dot $x$: $1500\\times200 + 3\\times10000 = 300000 + 30000 = 330000$.</li>
       <li>Row 2 dot $x$: $900\\times200 + 2\\times10000 = 180000 + 20000 = 200000$.</li>
       <li>Stack the two answers: $Ax = \\begin{bmatrix}330000\\\\200000\\end{bmatrix}$ &mdash; both prices at once.</li>
     </ul>`,
  application:
    `<p>Predicting on a batch of data, passing inputs through a neural-network layer, rotating 3D points in graphics — all are matrix×vector. GPUs exist mainly to do this operation very fast.</p>`,
  whenToUse:
    `<p>Whenever you want to apply the <i>same</i> linear operation to a whole batch — score every example, transform every point, run one network layer — matrix×vector (and its big sibling, matrix×matrix) is the tool. It is the single most-run operation in all of ML (Machine Learning).</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Forward pass</b> — a dense layer is $Wx$ (then a bias and a nonlinearity); stacking these is a neural network.</li>
       <li><b>Batched inference</b> — one matrix multiply replaces thousands of dot-product loops, which is exactly what GPUs (Graphics Processing Units) accelerate.</li>
       <li><b>Geometry</b> — rotations, scalings, and projections of points are all matrix×vector.</li>
     </ul>
     <p><b>When something else fits better:</b> if the matrix is huge and sparse, an iterative solver that only needs matrix×vector products (e.g. conjugate gradient) beats forming a dense inverse; if you truly need a one-off single dot product, just use the dot product directly. In code it is <code>A @ x</code> in <code>numpy</code> / <code>torch</code>, dispatched to tuned BLAS kernels.</p>`,
  pitfalls:
    `<ul>
       <li><b>Inner dimensions must cancel.</b> An $(m\\times n)$ matrix times an $(n)$ vector needs the $n$'s to match. Mismatched shapes are the number-one bug — check before you multiply.</li>
       <li><b>Multiplication does not commute.</b> $Ax$ is not $xA$, and $AB \\ne BA$ for matrices. Order is meaning, not decoration.</li>
       <li><b>Broadcasting can hide a bug.</b> <code>numpy</code> may silently broadcast a wrong-shaped array into something that "works" but is meaningless. Assert the output shape you expect.</li>
       <li><b>Forgetting the bias / affine term.</b> A pure $Wx$ has no offset; most layers need $Wx + b$. Leaving out $b$ pins every output through the origin.</li>
       <li><b>Don't form an inverse to solve $Ax=b$.</b> Computing $A^{-1}$ is slow and numerically worse than a direct solve (<code>np.linalg.solve</code> or an LU / QR factorization).</li>
       <li><b>Memory layout costs.</b> Repeatedly multiplying against a transposed or non-contiguous matrix thrashes the cache. Make arrays contiguous for the hot loop.</li>
     </ul>`,
  quiz: {
    q: `If $A$ is $5\\times 3$ and $x$ has 3 numbers, how many numbers does $Ax$ have?`,
    a: `<p>5. The $3$'s match and cancel, leaving the row count $m=5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-norm",
  demo: function (host) {
    // Bespoke: a draggable vector arrow with its horizontal leg (a) and vertical
    // leg (b) drawn as a right triangle; the hypotenuse is the L2 norm. Pythagoras
    // made visible. L1 = |a| + |b| shown alongside.
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 520; cv.height = 360; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var v = [3, -4];
    // Keep the whole right triangle inside the canvas: leave room at the bottom
    // for the text panel and size the scale so ±rng never runs off either edge.
    var rng = 5, P = 24, cx = 260, cy = 150, sc = (130 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      // axes
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(cv.width - P, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (130 - P)); ctx.stroke();

      var a = v[0], b = v[1];
      // right-triangle legs: horizontal leg along x, vertical leg up to the tip
      ctx.lineWidth = 2;
      // horizontal leg (a)
      ctx.strokeStyle = c.warn;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(a), py(0)); ctx.stroke();
      // vertical leg (b)
      ctx.strokeStyle = c.purple;
      ctx.beginPath(); ctx.moveTo(px(a), py(0)); ctx.lineTo(px(a), py(b)); ctx.stroke();
      // right-angle marker
      if (a !== 0 && b !== 0) {
        var sx = a > 0 ? -10 : 10, sy = b > 0 ? 10 : -10;
        ctx.strokeStyle = c.dim; ctx.lineWidth = 1;
        ctx.strokeRect(Math.min(px(a), px(a) + sx), Math.min(py(0), py(0) + sy), 10, 10);
      }
      // leg labels
      ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = c.warn; ctx.fillText("a = " + a, (px(0) + px(a)) / 2, py(0) + (b > 0 ? 16 : -16));
      ctx.fillStyle = c.purple; ctx.fillText("b = " + b, px(a) + (a > 0 ? 26 : -26), (py(0) + py(b)) / 2);

      // the vector arrow = hypotenuse
      ctx.strokeStyle = c.accent; ctx.fillStyle = c.accent; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(a), py(b)); ctx.stroke();
      var ang = Math.atan2(py(b) - py(0), px(a) - px(0));
      if (a !== 0 || b !== 0) {
        ctx.beginPath(); ctx.moveTo(px(a), py(b));
        ctx.lineTo(px(a) - 11 * Math.cos(ang - 0.4), py(b) - 11 * Math.sin(ang - 0.4));
        ctx.lineTo(px(a) - 11 * Math.cos(ang + 0.4), py(b) - 11 * Math.sin(ang + 0.4));
        ctx.closePath(); ctx.fill();
      }
      var l2 = Math.sqrt(a * a + b * b), l1 = Math.abs(a) + Math.abs(b);
      // hypotenuse label: offset perpendicular to the arrow so it never sits on the line
      var mxh = (px(0) + px(a)) / 2, myh = (py(0) + py(b)) / 2;
      var nlen = Math.hypot(px(a) - px(0), py(b) - py(0)) || 1;
      var nx = -(py(b) - py(0)) / nlen, ny = (px(a) - px(0)) / nlen; // unit normal
      var side = (a >= 0) ? -1 : 1; // push to the open side of the triangle
      ctx.fillStyle = c.accent; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("‖x‖ = √(a²+b²)", mxh + side * nx * 26, myh + side * ny * 26);

      // text panel along the bottom
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.font = "14px sans-serif";
      ctx.fillStyle = c.ink;
      ctx.fillText("x = [" + a + ", " + b + "]", 16, cv.height - 44);
      ctx.fillStyle = c.accent;
      ctx.fillText("L2 = √(" + (a * a) + " + " + (b * b) + ") = √" + (a * a + b * b) + " = " + l2.toFixed(3), 16, cv.height - 24);
      ctx.fillStyle = c.warn;
      ctx.fillText("L1 = |" + a + "| + |" + b + "| = " + l1, 320, cv.height - 44);
    }

    function rel(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }; }
    var drag = false;
    cv.addEventListener("mousedown", function (e) { var m = rel(e); if (Math.hypot(m.x - px(v[0]), m.y - py(v[1])) < 18) drag = true; });
    cv.addEventListener("mousemove", function (e) {
      if (!drag) return; var m = rel(e);
      v[0] = Math.max(-rng, Math.min(rng, Math.round((m.x - cx) / sc)));
      v[1] = Math.max(-rng, Math.min(rng, Math.round((cy - m.y) / sc)));
      draw();
    });
    window.addEventListener("mouseup", function () { drag = false; });
    var hint = document.createElement("div"); hint.className = "hint";
    hint.textContent = "Drag the blue arrow tip. The hypotenuse of the right triangle is the L2 length.";
    host.appendChild(hint);
    draw();
  },
  title: "Norms (the length of a vector)",
  tagline: "How big is a vector? Norms measure that. They power 'distance' and regularization.",
  prereqs: ["fnd-vector", "fnd-dot"],
  bigIdea:
    `<p>A <b>norm</b> measures the size (length) of a vector — a single non-negative number.</p>
     <p>The most common one is ordinary straight-line length, from the Pythagorean theorem.</p>
     <p>Norms let us say how <i>far apart</i> two vectors are, and how <i>big</i> a model's weights are. Both matter a lot in ML (Machine Learning).</p>`,
  buildup:
    `<p>In 2D, the length of an arrow $[a, b]$ is $\\sqrt{a^2+b^2}$ (Pythagoras). Norms generalize that to any number of dimensions.</p>`,
  symbols: [
    { sym: "$\\lVert x \\rVert_2$", desc: "the Euclidean (L2) norm: ordinary straight-line length." },
    { sym: "$\\lVert x \\rVert_1$", desc: "the Manhattan (L1) norm: add up the sizes, like walking city blocks." },
    { sym: "$\\lvert x_i \\rvert$", desc: "the absolute value of $x_i$ (drop the minus sign)." },
    { sym: "$x_i^2$", desc: "$x_i$ squared. Squaring also removes minus signs and punishes big values more." }
  ],
  formula: `$$ \\lVert x \\rVert_2 = \\sqrt{\\sum_{i=1}^{n} x_i^2} \\qquad\\quad \\lVert x \\rVert_1 = \\sum_{i=1}^{n} \\lvert x_i \\rvert $$`,
  whatItDoes:
    `<p>L2: square every entry, add them, take the square root. That is the Pythagorean distance.</p>
     <p>L1: just add up the absolute values. Simpler, and it likes to push small weights all the way to zero (useful for feature selection).</p>`,
  example:
    `<p>First, the size of one vector. Let $x = [3, -4]$.</p>
     <ul class="steps">
       <li>L2: $\\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.</li>
       <li>L1: $|3| + |-4| = 3 + 4 = 7$.</li>
     </ul>
     <table class="extable">
       <caption>Same vector $x=[3,-4]$, two different "sizes".</caption>
       <thead><tr><th>Norm</th><th>computation</th><th class="num">value</th></tr></thead>
       <tbody>
         <tr><td class="row-h">L2 (Euclidean)</td><td>$\\sqrt{9 + 16} = \\sqrt{25}$</td><td class="num">5</td></tr>
         <tr><td class="row-h">L1 (Manhattan)</td><td>$3 + 4$</td><td class="num">7</td></tr>
       </tbody>
     </table>
     <p>Now the key use: <b>distance between two vectors is the norm of their difference</b>, $\\lVert x - y\\rVert$. Let's see it with numbers. Take $x = [4, 6]$ and $y = [1, 2]$:</p>
     <ul class="steps">
       <li>Subtract entry by entry: $x - y = [4-1,\\; 6-2] = [3, 4]$.
           <div class="why">The difference vector is the "arrow from $y$ to $x$". Its length is how far apart they are.</div></li>
       <li>Take its L2 norm: $\\lVert x - y\\rVert_2 = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.
           <div class="why">So $x$ and $y$ sit a straight-line distance of $5$ apart &mdash; the norm turned two points into one "how far" number.</div></li>
       <li>The L1 version: $\\lVert x - y\\rVert_1 = |3| + |4| = 7$ &mdash; the city-block distance, longer because you can't cut the corner.</li>
     </ul>`,
  application:
    `<p>L2 distance powers k-means and k-NN (k-Nearest Neighbors). L2 on the weights = <b>Ridge</b> regularization; L1 = <b>LASSO</b>, which zeroes out useless features. Norms are how models avoid getting too "big" and overfitting.</p>`,
  whenToUse:
    `<p>Reach for a norm whenever you need a single "how big" or "how far" number — to measure distance between examples, to penalize large weights, or to check whether training has converged. Picking L1 (Manhattan) vs L2 (Euclidean) is a real modeling choice, not a detail.</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Distance-based models</b> — k-NN (k-Nearest Neighbors) and k-means rank neighbors by L2 distance.</li>
       <li><b>Regularization</b> — L2 on the weights gives <b>Ridge</b> (shrinks smoothly); L1 gives <b>LASSO</b> (drives weights to exactly zero, so it selects features).</li>
       <li><b>Gradient clipping</b> — capping the gradient's L2 norm keeps deep-network training from blowing up.</li>
       <li><b>Normalization</b> — dividing a vector by its norm makes a unit vector, the basis of cosine similarity.</li>
     </ul>
     <p><b>Choose by goal:</b> want sparsity? L1. Want a smooth, rotation-invariant length? L2. Want worst-case (the single largest entry)? the L∞ (max) norm. In code these are one <code>np.linalg.norm</code> call with an <code>ord</code> argument.</p>`,
  pitfalls:
    `<ul>
       <li><b>Distance lies on unscaled features.</b> A feature measured in thousands swamps one measured in single digits, so the norm tracks only the big one. Standardize before any distance or k-NN (k-Nearest Neighbors).</li>
       <li><b>The curse of dimensionality.</b> In very high dimensions all pairwise L2 distances bunch together, so "nearest" becomes meaningless. Reduce dimensions first.</li>
       <li><b>L1 vs L2 is not interchangeable.</b> L2 squares errors, so it overreacts to outliers; L1 is robust but its corner makes optimization non-smooth at zero. Pick on purpose.</li>
       <li><b>Squaring can overflow.</b> Naively computing $\\sum x_i^2$ on large values can overflow before the square root. Use a scaled (hypot-style) computation or <code>np.linalg.norm</code>, which handles it.</li>
       <li><b>Never gradient-descend the raw L1 at zero.</b> The L1 norm has no derivative at $0$; use the subgradient or a proximal step, or training stalls.</li>
       <li><b>A norm is always non-negative.</b> Getting a negative "length" means a sign or absolute-value bug — norms can't be below zero.</li>
     </ul>`,
  quiz: {
    q: `Find the L2 and L1 norm of $[0, 6, 8]$.`,
    a: `<p>L2 $=\\sqrt{0+36+64}=\\sqrt{100}=10$. L1 $=0+6+8=14$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-derivative",
  demo: function (host) {
    Demos.plot(host, {
      xmin: -3, xmax: 3, ymin: -1, ymax: 9,
      curves: [{ f: function (x) { return x * x; }, label: "f(x) = x²" }],
      drag: { curve: 0, df: function (x) { return 2 * x; }, start: 1.5, label: "point x",
        readout: function (x) { return "At x = " + x.toFixed(2) + ", the slope is 2x = <b>" + (2 * x).toFixed(2) + "</b> (orange tangent). Flat at x = 0; steeper as |x| grows."; } }
    });
  },
  title: "Derivatives (slope)",
  tagline: "How fast does the output change when you nudge the input? That's the derivative.",
  bigIdea:
    `<p>A <b>derivative</b> is a slope: the rate of change of a function.</p>
     <p>It answers: "if I increase the input a tiny bit, how much does the output move, and in which direction?"</p>
     <p>Training a model = changing numbers to make error smaller. Derivatives tell you which way to change them. No derivatives, no learning.</p>`,
  buildup:
    `<p>Picture a curve. Zoom in on one point until the curve looks like a straight line. The steepness of that line is the derivative there.</p>
     <p>Positive slope = going uphill. Negative = downhill. Zero = flat (a peak, a valley, or a plateau).</p>`,
  symbols: [
    { sym: "$f(x)$", desc: "a function: feed in $x$, get out a number." },
    { sym: "$f'(x)$", desc: "the derivative: the slope of $f$ at the point $x$." },
    { sym: "$\\frac{df}{dx}$", desc: "another way to write the same derivative ('change in $f$ per change in $x$')." },
    { sym: "$h$", desc: "a tiny step in $x$. We imagine it shrinking toward 0." }
  ],
  formula: `$$ f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} $$`,
  whatItDoes:
    `<p>$f(x+h) - f(x)$ is how much the output changed. Divide by $h$ (how much the input changed) to get rise-over-run: a slope.</p>
     <p>$\\lim_{h\\to 0}$ means "let the step shrink to nearly nothing", so you get the slope exactly at the point, not an average over a gap.</p>
     <p>Handy rule: the slope of $x^2$ is $2x$.</p>`,
  example:
    `<p>Let $f(x) = x^2$ (a U-shaped bowl). Its derivative is $f'(x) = 2x$. Plug in a few points:</p>
     <table class="extable">
       <caption>Slope $f'(x)=2x$ of $f(x)=x^2$ at three points.</caption>
       <thead><tr><th class="num">$x$</th><th class="num">$f'(x) = 2x$</th><th>what it means</th></tr></thead>
       <tbody>
         <tr><td class="num">3</td><td class="num">6</td><td>steep, uphill to the right</td></tr>
         <tr><td class="num">0</td><td class="num">0</td><td>flat &mdash; bottom of the bowl (minimum)</td></tr>
         <tr><td class="num">−2</td><td class="num">−4</td><td>downhill to the right</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>At $x = 3$: slope $= 2\\times3 = 6$.</li>
       <li>At $x = 0$: slope $= 2\\times0 = 0$.</li>
       <li>At $x = -2$: slope $= 2\\times(-2) = -4$.</li>
     </ul>
     <p>To reach the bottom, step <i>opposite</i> the slope. That single idea is gradient descent.</p>`,
  application:
    `<p>Every model is trained by computing the derivative of its error and stepping downhill. Backpropagation is just the chain rule (next lessons) applied to millions of derivatives at once.</p>`,
  whenToUse:
    `<p>The derivative is the heartbeat of <i>learning</i>: any time you want to make an output smaller (or bigger) by nudging a knob, the derivative tells you which way and how hard to push. Every gradient-based optimizer rests on it.</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Gradient descent</b> — step opposite the derivative of the loss to shrink error; this is how essentially all models train.</li>
       <li><b>Backpropagation</b> — the chain rule (next lesson) chains derivatives through every layer of a neural network.</li>
       <li><b>Sensitivity analysis</b> — the derivative says which input the output is most responsive to.</li>
     </ul>
     <p><b>How you actually get them:</b> rarely by hand. <b>Autodiff</b> (automatic differentiation, as in <code>torch.autograd</code> or JAX) computes exact derivatives from your code. Use a closed-form rule when you can; fall back to a finite-difference check only to <i>verify</i>. When a function has no derivative (a hard threshold, a non-smooth loss), reach for a subgradient or a smooth surrogate instead.</p>`,
  pitfalls:
    `<ul>
       <li><b>Zero slope is not always a minimum.</b> A derivative of $0$ marks a flat spot — it could be a maximum, a minimum, or a saddle. Check the curvature (second derivative) before celebrating.</li>
       <li><b>Non-differentiable points bite.</b> Functions like $|x|$ or a step have a kink or jump with no derivative there. Smooth them or use a subgradient, or the optimizer stalls.</li>
       <li><b>Finite differences are fragile.</b> Approximating with $(f(x+h)-f(x))/h$ is haunted by a trade-off: too-large $h$ is inaccurate, too-small $h$ drowns in floating-point round-off. Prefer autodiff (automatic differentiation).</li>
       <li><b>Sign and direction slips.</b> To <i>minimize</i> you step against the derivative; flipping the sign sends you uphill and the loss climbs. Watch the minus.</li>
       <li><b>Vanishing and exploding slopes.</b> Chaining many derivatives can make them shrink to nothing or blow up — the core reason deep nets are hard to train; mitigate with good activations and normalization.</li>
       <li><b>Units matter for step size.</b> A derivative's magnitude depends on input scaling, so an un-normalized feature can force a tiny or huge learning rate. Standardize inputs.</li>
     </ul>`,
  quiz: {
    q: `For $f(x)=x^2$, what is the slope at $x=-5$? Are we going up or down as $x$ increases?`,
    a: `<p>$f'(-5)=2(-5)=-10$. Negative slope means the function is going <i>down</i> as $x$ increases there.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-gradient",
  demo: function (host) {
    // Bespoke: a 2-D bowl f = x^2 + y^2 shown as contour rings. At a draggable
    // point, draw the gradient arrow (uphill) and the downhill step -grad f.
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 520; cv.height = 380; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var p = [2, 1.5];
    var rng = 3, P = 28, cx = 260, cy = 190, sc = (190 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }

    function arrow(x1, y1, x2, y2, col, lw) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw || 2.5;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      if (x1 === x2 && y1 === y2) return;
      var ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 11 * Math.cos(ang - 0.4), y2 - 11 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 11 * Math.cos(ang + 0.4), y2 - 11 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      // contour rings: f = r^2 -> ring of f = level is a circle of radius sqrt(level)
      ctx.lineWidth = 1;
      var levels = [0.5, 1, 2, 3.5, 5, 7, 9];
      for (var i = 0; i < levels.length; i++) {
        var rad = Math.sqrt(levels[i]);
        if (rad > rng + 0.5) continue;
        ctx.strokeStyle = c.accent + "55";
        ctx.beginPath(); ctx.arc(px(0), py(0), rad * sc, 0, Math.PI * 2); ctx.stroke();
      }
      // axes
      ctx.strokeStyle = c.border; ctx.beginPath();
      ctx.moveTo(P, cy); ctx.lineTo(cv.width - P, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (cy - P)); ctx.stroke();
      // center / minimum
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText("min (0,0)", px(0) + 6, py(0) + 14);

      var x = p[0], y = p[1];
      // gradient = [2x, 2y]; scale arrow for display
      var gx = 2 * x, gy = 2 * y;
      var disp = 0.35; // shrink so arrow stays on canvas
      // uphill gradient arrow
      arrow(px(x), py(y), px(x + gx * disp), py(y + gy * disp), c.warn);
      // downhill step -grad
      arrow(px(x), py(y), px(x - gx * disp), py(y - gy * disp), c.accent2);
      // the point
      ctx.fillStyle = c.purple; ctx.beginPath(); ctx.arc(px(x), py(y), 5, 0, Math.PI * 2); ctx.fill();
      // labels near arrow tips
      ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillStyle = c.warn; ctx.fillText("∇f (uphill)", px(x + gx * disp), py(y + gy * disp) - 8);
      ctx.fillStyle = c.accent2; ctx.fillText("−∇f (downhill)", px(x - gx * disp), py(y - gy * disp) + 14);

      // text panel
      ctx.textAlign = "left"; ctx.font = "14px sans-serif";
      ctx.fillStyle = c.ink; ctx.fillText("point = (" + x.toFixed(1) + ", " + y.toFixed(1) + "),  f = " + (x * x + y * y).toFixed(2), 16, cv.height - 40);
      ctx.fillStyle = c.warn; ctx.fillText("∇f = [2x, 2y] = [" + gx.toFixed(1) + ", " + gy.toFixed(1) + "]", 16, cv.height - 20);
      ctx.fillStyle = c.accent2; ctx.fillText("step −∇f heads back toward the center", 280, cv.height - 20);
    }

    function rel(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }; }
    var drag = false;
    cv.addEventListener("mousedown", function (e) { var m = rel(e); if (Math.hypot(m.x - px(p[0]), m.y - py(p[1])) < 18) drag = true; });
    cv.addEventListener("mousemove", function (e) {
      if (!drag) return; var m = rel(e);
      p[0] = Math.max(-rng, Math.min(rng, (m.x - cx) / sc));
      p[1] = Math.max(-rng, Math.min(rng, (cy - m.y) / sc));
      // round to 1 decimal to keep readouts tidy
      p[0] = Math.round(p[0] * 10) / 10; p[1] = Math.round(p[1] * 10) / 10;
      draw();
    });
    window.addEventListener("mouseup", function () { drag = false; });
    var hint = document.createElement("div"); hint.className = "hint";
    hint.textContent = "Drag the point. Orange = uphill gradient; green = the downhill step.";
    host.appendChild(hint);
    draw();
  },
  title: "The gradient (slope in many directions)",
  tagline: "A derivative for functions with many inputs. It points straight uphill.",
  prereqs: ["fnd-derivative", "fnd-vector"],
  bigIdea:
    `<p>Most ML (Machine Learning) functions have many inputs (millions of weights), not one.</p>
     <p>The <b>gradient</b> collects the slope in <i>each</i> input direction into one vector.</p>
     <p>Key fact: the gradient points in the direction that makes the output grow fastest. To shrink error, step the opposite way.</p>`,
  buildup:
    `<p>With one input you had a single slope $f'(x)$.</p>
     <p>With inputs $x_1, x_2, \\dots$, ask: "how does the output change if I nudge <i>only</i> $x_1$?" That is a <b>partial derivative</b>, written $\\frac{\\partial f}{\\partial x_1}$. Do it for every input and stack the answers.</p>`,
  symbols: [
    { sym: "$\\nabla f$", desc: "the gradient of $f$ (the upside-down triangle is called 'nabla'). It is a vector." },
    { sym: "$\\frac{\\partial f}{\\partial x_i}$", desc: "the partial derivative: slope in the $x_i$ direction, holding the others fixed. The curly $\\partial$ = 'partial'." },
    { sym: "$x_i$", desc: "the $i$-th input/weight." }
  ],
  formula: `$$ \\nabla f(x) = \\begin{bmatrix} \\dfrac{\\partial f}{\\partial x_1} \\\\[4pt] \\vdots \\\\[2pt] \\dfrac{\\partial f}{\\partial x_n} \\end{bmatrix} $$`,
  whatItDoes:
    `<p>Each slot of the gradient is the slope in one direction. Together they form an arrow pointing toward steepest increase.</p>
     <p>Going downhill (to reduce error) means moving along $-\\nabla f$, the negative gradient.</p>`,
  example:
    `<p>Let $f(x_1, x_2) = x_1^2 + x_2^2$ (a round bowl). Partials: $\\frac{\\partial f}{\\partial x_1} = 2x_1$, $\\frac{\\partial f}{\\partial x_2} = 2x_2$. Evaluate each one at the point $(3, 4)$:</p>
     <table class="extable">
       <caption>Each partial = one slot of $\\nabla f$, evaluated at $(3,4)$.</caption>
       <thead><tr><th>direction</th><th>partial</th><th class="num">at $(3,4)$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$x_1$</td><td>$2x_1 = 2\\times3$</td><td class="num">6</td></tr>
         <tr><td class="row-h">$x_2$</td><td>$2x_2 = 2\\times4$</td><td class="num">8</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Stack the two partials: $\\nabla f = [\\,2\\times3,\\; 2\\times4\\,] = [6, 8]$.</li>
       <li>That arrow points away from the center &mdash; straight uphill.</li>
       <li>To go downhill, step toward $-[6,8] = [-6,-8]$, heading back to the bottom at $(0,0)$.</li>
     </ul>`,
  application:
    `<p>Training = "compute gradient of the error, step downhill, repeat." This is gradient descent, the engine behind linear models, SVMs (Support Vector Machines), and every deep neural network.</p>`,
  whenToUse:
    `<p>The gradient is the derivative for functions of <i>many</i> inputs — exactly the situation in ML (Machine Learning), where the loss depends on millions of weights. Whenever you optimize anything multi-dimensional, the gradient is the compass pointing steepest-uphill (so you step the other way).</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Training every model</b> — gradient descent and its variants (SGD (Stochastic Gradient Descent), Adam) move all the weights at once by following $-\\nabla L$.</li>
       <li><b>Backpropagation</b> — produces the gradient of the loss with respect to every parameter in one backward sweep.</li>
       <li><b>Constrained / regularized objectives</b> — gradients drive Lagrangian and proximal methods too.</li>
     </ul>
     <p><b>Reach past plain gradients when:</b> the surface is ill-conditioned (long narrow valleys) — momentum or Adam help; the function is non-smooth — use subgradients; or you can afford curvature — second-order methods (Newton, L-BFGS) converge in far fewer steps on small problems. In practice an autodiff (automatic differentiation) library hands you $\\nabla L$ for free.</p>`,
  pitfalls:
    `<ul>
       <li><b>The gradient points uphill.</b> $\\nabla f$ is the direction of steepest <i>increase</i>; to minimize you must step toward $-\\nabla f$. Forgetting the minus makes the loss grow.</li>
       <li><b>Learning rate is everything.</b> Too large and the steps overshoot and diverge; too small and training crawls. Tune it, and consider a schedule or an adaptive optimizer.</li>
       <li><b>Local minima and saddles.</b> A zero gradient can be a saddle point or a poor local minimum, especially in high dimensions. Momentum, noise (SGD (Stochastic Gradient Descent)), and restarts help escape.</li>
       <li><b>Vanishing / exploding gradients.</b> Deep chains can drive $\\nabla L$ toward zero or infinity. Use good initialization, normalization, residual connections, and gradient clipping.</li>
       <li><b>Unscaled features warp the bowl.</b> Features on different scales make the loss surface a stretched ravine that gradient descent zig-zags down slowly. Standardize inputs.</li>
       <li><b>The whole loss must be differentiable.</b> A hard <code>argmax</code> or a discrete step in the middle of the model zeroes the gradient and blocks learning. Use a smooth surrogate (softmax, sigmoid).</li>
     </ul>`,
  quiz: {
    q: `For $f(x_1,x_2)=x_1^2+x_2^2$, what is the gradient at $(0,0)$, and what does it tell you?`,
    a: `<p>$\\nabla f = [0,0]$. A zero gradient means you're at a flat spot — here, the minimum of the bowl. Nowhere is downhill, so learning stops.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-chain",
  demo: function (host) {
    Demos.plot(host, {
      xmin: -1.5, xmax: 1.5, ymin: -1, ymax: 21,
      curves: [{ f: function (x) { return (3 * x) * (3 * x); }, label: "z = (3x)²" }],
      drag: { curve: 0, df: function (x) { return 18 * x; }, start: 0.8, label: "point x",
        readout: function (x) {
          return "At x = " + x.toFixed(2) + ": dz/dx = (outer')·(inner') = 2(3x)·3 = 18x = <b>" +
            (18 * x).toFixed(2) + "</b> (orange tangent). Outer 2(3x) = " + (6 * x).toFixed(2) +
            ", inner 3.";
        } }
    });
  },
  title: "The chain rule",
  tagline: "Derivative of a function inside a function: multiply the slopes. This IS backprop (backpropagation).",
  prereqs: ["fnd-derivative"],
  bigIdea:
    `<p>Often a value passes through several steps: $x \\to$ step 1 $\\to$ step 2 $\\to$ output.</p>
     <p>The <b>chain rule</b> says: to get the overall slope, multiply the slope of each step together.</p>
     <p>A neural network is just many steps stacked. The chain rule is exactly how we get the gradient through all of them. Its nickname is "backpropagation".</p>`,
  buildup:
    `<p>Suppose $z$ depends on $y$, and $y$ depends on $x$. If $x$ wiggles, $y$ wiggles, which makes $z$ wiggle.</p>
     <p>How much does $z$ move per unit of $x$? Combine the two rates by multiplying.</p>`,
  symbols: [
    { sym: "$\\frac{dz}{dx}$", desc: "how much output $z$ changes per change in input $x$ (what we want)." },
    { sym: "$\\frac{dz}{dy}$", desc: "how much $z$ changes per change in the middle value $y$." },
    { sym: "$\\frac{dy}{dx}$", desc: "how much $y$ changes per change in $x$." }
  ],
  formula: `$$ \\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx} $$`,
  whatItDoes:
    `<p>Read it as: "rate of $z$ over $x$ = (rate of $z$ over $y$) times (rate of $y$ over $x$)."</p>
     <p>The middle term $dy$ "cancels" like a fraction — a good memory trick (it is not literally division, but it behaves that way here).</p>`,
  example:
    `<p>Let $y = 3x$ and $z = y^2$. So $z$ depends on $x$ through $y$. Find each step's slope, then multiply.</p>
     <table class="extable">
       <caption>Two steps, two slopes; the chain rule multiplies them.</caption>
       <thead><tr><th>step</th><th>local slope</th></tr></thead>
       <tbody>
         <tr><td class="row-h">outer: $z = y^2$</td><td>$\\frac{dz}{dy} = 2y$</td></tr>
         <tr><td class="row-h">inner: $y = 3x$</td><td>$\\frac{dy}{dx} = 3$</td></tr>
         <tr><td class="row-h">product</td><td>$\\frac{dz}{dx} = 2y\\cdot3 = 18x$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Slope of the outer step: $\\frac{dz}{dy} = 2y$.</li>
       <li>Slope of the inner step: $\\frac{dy}{dx} = 3$.</li>
       <li>Multiply: $\\frac{dz}{dx} = 2y \\cdot 3 = 6y = 6(3x) = 18x$.</li>
       <li>Check at $x=1$: $z = (3\\cdot1)^2 = 9$, and the slope is $18\\times1 = 18$. &#10003;</li>
     </ul>`,
  application:
    `<p>Backpropagation runs the chain rule backward through every layer of a network, multiplying local slopes, to find how each weight affects the final loss. Without it, deep learning would be impossible.</p>`,
  whenToUse:
    `<p>The chain rule is how you differentiate <i>composed</i> functions — and a neural network is nothing but functions stacked on functions. Any time a value passes through several steps and you need its sensitivity to an early input, the chain rule is the tool.</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>Backpropagation</b> — the chain rule applied backward through every layer is what gives you the gradient of the loss for each weight; it is the whole training algorithm of deep learning.</li>
       <li><b>Reverse-mode autodiff</b> — frameworks like <code>torch.autograd</code> and JAX implement exactly this rule, multiplying local Jacobians as they walk the computation graph backward.</li>
       <li><b>Composed transforms</b> — change-of-variables in probability and the reparameterization trick both lean on it.</li>
     </ul>
     <p><b>Two modes, pick by shape:</b> <b>reverse mode</b> (one output, many inputs — i.e. a scalar loss over millions of weights) is what neural nets use; <b>forward mode</b> is cheaper when there are few inputs and many outputs. You almost never apply it by hand — the framework does, exactly and fast.</p>`,
  pitfalls:
    `<ul>
       <li><b>Multiply, don't add, the local slopes.</b> The overall rate is the <i>product</i> of each step's derivative. Adding them is a classic beginner error.</li>
       <li><b>Evaluate each factor at the right point.</b> The outer derivative is taken at the inner function's value, not at the original input. Plug $y = g(x)$ into $f'$, not $x$.</li>
       <li><b>Vanishing / exploding products.</b> Many factors below $1$ multiply toward zero (vanishing gradient); factors above $1$ blow up. This is the central deep-learning training problem — fix with good activations, normalization, and residuals.</li>
       <li><b>Cache the forward pass.</b> Backprop needs the intermediate values from the forward pass; recompute or store them, or the backward gradients are wrong.</li>
       <li><b>Branches and shared inputs sum.</b> When one variable feeds several downstream paths, its gradient is the <i>sum</i> over all paths (the multivariable chain rule). Miss a path and the gradient is undercounted.</li>
       <li><b>A non-differentiable link breaks the chain.</b> A hard step or <code>argmax</code> in the middle zeroes the product. Use a smooth surrogate or a straight-through estimator.</li>
     </ul>`,
  quiz: {
    q: `If $y = 2x$ and $z = y^3$, use the chain rule to find $\\frac{dz}{dx}$.`,
    a: `<p>$\\frac{dz}{dy}=3y^2$ and $\\frac{dy}{dx}=2$, so $\\frac{dz}{dx}=3y^2\\cdot2=6y^2=6(2x)^2=24x^2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "fnd-eigen",
  demo: function (host) {
    // Bespoke: the unit circle of vectors transformed by A into an ellipse.
    // Eigenvector axes (here the x and y axes) only stretch, labeled with lambda.
    // A draggable test vector v shows Av; when v lines up with an eigen-axis,
    // Av is parallel to v. A = [[2,0],[0,3]] -> eigenvectors x,y; lambda = 2,3.
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var A = [[2, 0], [0, 3]];
    var cv = document.createElement("canvas"); cv.width = 520; cv.height = 400; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var v = [1, 1];
    var rng = 4, P = 26, cx = 260, cy = 200, sc = (200 - P) / rng;
    function px(X) { return cx + X * sc; }
    function py(Y) { return cy - Y * sc; }

    function arrow(x2, y2, col, lw) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw || 2.5;
      ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(x2, y2); ctx.stroke();
      var ang = Math.atan2(y2 - py(0), x2 - px(0));
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 11 * Math.cos(ang - 0.4), y2 - 11 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 11 * Math.cos(ang + 0.4), y2 - 11 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, cv.width, cv.height);
      // axes
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, cy); ctx.lineTo(cv.width - P, cy);
      ctx.moveTo(cx, P); ctx.lineTo(cx, cy + (cy - P)); ctx.stroke();

      // unit circle (dashed)
      ctx.strokeStyle = c.dim; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(px(0), py(0), 1 * sc, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      // transformed ellipse: x scaled by 2 (a=2), y scaled by 3 (b=3)
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2;
      ctx.beginPath();
      for (var t = 0; t <= 64; t++) {
        var th = t / 64 * Math.PI * 2;
        var ux = Math.cos(th), uy = Math.sin(th);
        var wx = A[0][0] * ux + A[0][1] * uy, wy = A[1][0] * ux + A[1][1] * uy;
        var X = px(wx), Y = py(wy);
        if (t === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      // labels for circle / ellipse — placed near each object, well apart
      ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic";
      // unit circle: label up-left, near its own outline
      ctx.fillStyle = c.dim; ctx.textAlign = "right";
      ctx.fillText("unit circle", px(-0.72) - 2, py(0.72) - 4);
      // ellipse: label at its top, where it stretches highest (λ=3 direction)
      ctx.fillStyle = c.accent; ctx.textAlign = "center";
      ctx.fillText("ellipse = A·(circle)", px(0), py(3) - 8);

      // eigen-axes: x-axis (lambda 2), y-axis (lambda 3) only stretch
      ctx.strokeStyle = c.purple; ctx.lineWidth = 2; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(px(-rng), py(0)); ctx.lineTo(px(rng), py(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px(0), py(-rng)); ctx.lineTo(px(0), py(rng)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = c.purple; ctx.font = "12px sans-serif";
      ctx.textAlign = "right"; ctx.fillText("λ = 2 axis", px(rng) - 4, py(0) + 16);
      ctx.textAlign = "left"; ctx.fillText("λ = 3 axis", px(0) + 8, py(rng) + 14);

      // test vector v and Av
      var w0 = A[0][0] * v[0] + A[0][1] * v[1];
      var w1 = A[1][0] * v[0] + A[1][1] * v[1];
      arrow(px(w0), py(w1), c.accent2, 2.5);   // Av
      arrow(px(v[0]), py(v[1]), c.warn, 2.5);  // v
      ctx.fillStyle = c.warn; ctx.font = "13px sans-serif";
      ctx.fillText("v", px(v[0]) + 8, py(v[1]) - 8);
      ctx.fillStyle = c.accent2;
      ctx.fillText("Av", px(w0) + 8, py(w1) - 8);

      // readout
      ctx.textBaseline = "alphabetic"; ctx.font = "14px sans-serif";
      ctx.fillStyle = c.ink; ctx.fillText("v = [" + v[0] + ", " + v[1] + "],  Av = [" + w0 + ", " + w1 + "]", 16, cv.height - 38);
      var cross = w0 * v[1] - w1 * v[0];
      var aligned = (v[0] === 0 && v[1] === 0) ? false : (cross === 0);
      if (v[0] === 0 && v[1] === 0) {
        ctx.fillStyle = c.dim; ctx.fillText("v is the zero vector — not an eigenvector.", 16, cv.height - 18);
      } else if (aligned) {
        var lam = (v[0] !== 0) ? (w0 / v[0]) : (w1 / v[1]);
        ctx.fillStyle = c.accent2; ctx.fillText("Av is parallel to v: eigenvector! λ = " + lam, 16, cv.height - 18);
      } else {
        ctx.fillStyle = c.warn; ctx.fillText("Av points a new way. Drag v onto an eigen-axis to line them up.", 16, cv.height - 18);
      }
    }

    function rel(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }; }
    var drag = false;
    cv.addEventListener("mousedown", function (e) { var m = rel(e); if (Math.hypot(m.x - px(v[0]), m.y - py(v[1])) < 18) drag = true; });
    cv.addEventListener("mousemove", function (e) {
      if (!drag) return; var m = rel(e);
      v[0] = Math.max(-rng, Math.min(rng, Math.round((m.x - cx) / sc)));
      v[1] = Math.max(-rng, Math.min(rng, Math.round((cy - m.y) / sc)));
      draw();
    });
    window.addEventListener("mouseup", function () { drag = false; });
    var hint = document.createElement("div"); hint.className = "hint";
    hint.textContent = "Drag v (orange). On an eigen-axis, Av (green) lines up with v.";
    host.appendChild(hint);
    draw();
  },
  title: "Eigenvalues & eigenvectors",
  tagline: "Special directions a matrix only stretches, never rotates. The skeleton of your data.",
  prereqs: ["fnd-matvec"],
  bigIdea:
    `<p>A matrix usually rotates <i>and</i> stretches a vector when it multiplies it.</p>
     <p>But for a few special directions, the matrix only stretches — it does not change the direction at all.</p>
     <p>Those directions are <b>eigenvectors</b>. The stretch amount is the <b>eigenvalue</b>. They reveal the main axes hidden inside data (this is what PCA (Principal Component Analysis) uses).</p>`,
  buildup:
    `<p>Multiplying $A$ by $z$ normally gives a vector pointing somewhere new.</p>
     <p>Ask: is there a $z$ where $Az$ points the <i>same</i> way as $z$, just longer or shorter? If yes, $z$ is special.</p>`,
  symbols: [
    { sym: "$A$", desc: "a square matrix ($n\\times n$)." },
    { sym: "$z$", desc: "the eigenvector — the special direction (not the zero vector)." },
    { sym: "$\\lambda$", desc: "the eigenvalue — the stretch factor (Greek 'lambda'). 2 = twice as long, 0.5 = half, negative = flipped." }
  ],
  formula: `$$ A z = \\lambda z $$`,
  whatItDoes:
    `<p>Left side: run $z$ through the matrix. Right side: just scale $z$ by the number $\\lambda$.</p>
     <p>When both sides match, the matrix's effect on $z$ is pure stretching. Same direction in, same direction out.</p>`,
  example:
    `<p>Let $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$. Run two directions through it and compare $Az$ to $z$.</p>
     <table class="extable">
       <caption>Special (eigen) vs ordinary direction under $A$.</caption>
       <thead><tr><th>$z$</th><th class="num">$Az$</th><th>same direction as $z$?</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$[1, 0]$</td><td class="num">$[2, 0]$</td><td>yes &mdash; $= 2z$, so $\\lambda = 2$</td></tr>
         <tr><td class="row-h">$[0, 1]$</td><td class="num">$[0, 3]$</td><td>yes &mdash; $= 3z$, so $\\lambda = 3$</td></tr>
         <tr><td class="row-h">$[1, 1]$</td><td class="num">$[2, 3]$</td><td>no &mdash; direction changed</td></tr>
       </tbody>
     </table>
     <p>First a <i>special</i> direction, $z=\\begin{bmatrix}1\\\\0\\end{bmatrix}$:</p>
     <ul class="steps">
       <li>$Az=\\begin{bmatrix}2\\cdot1 + 0\\cdot0\\\\0\\cdot1 + 3\\cdot0\\end{bmatrix}=\\begin{bmatrix}2\\\\0\\end{bmatrix}$.</li>
       <li>That equals $2\\begin{bmatrix}1\\\\0\\end{bmatrix} = 2z$. So $Az = \\lambda z$ holds exactly with $\\lambda = 2$.
           <div class="why">$Az$ is just $z$ scaled by $2$ &mdash; same direction (still flat along the x-axis), twice as long. That is the whole equation $Az=\\lambda z$ checked with real numbers.</div></li>
       <li>So $z=[1,0]$ is an eigenvector with eigenvalue $\\lambda = 2$. (Similarly $[0,1]$ has $\\lambda=3$.)</li>
     </ul>
     <p>Now contrast an <i>ordinary</i> direction, $z=\\begin{bmatrix}1\\\\1\\end{bmatrix}$:</p>
     <ul class="steps">
       <li>$Az=\\begin{bmatrix}2\\cdot1 + 0\\cdot1\\\\0\\cdot1 + 3\\cdot1\\end{bmatrix}=\\begin{bmatrix}2\\\\3\\end{bmatrix}$.</li>
       <li>Is $[2,3]$ a scaled copy of $[1,1]$? No &mdash; that would need both entries times the same number, but $2/1 = 2$ while $3/1 = 3$. The direction <b>changed</b>.
           <div class="why">$[1,1]$ points at $45°$; $[2,3]$ tilts steeper. The matrix rotated it, so there is no single $\\lambda$ with $Az=\\lambda z$. This is why eigenvectors are special: almost every other vector gets turned.</div></li>
     </ul>`,
  application:
    `<p>PCA finds the eigenvectors of your data's covariance matrix — the directions of greatest spread — and keeps only the top few to compress data. Google's original PageRank was an eigenvector problem too.</p>`,
  whenToUse:
    `<p>Eigen-decomposition is the tool for finding the <i>intrinsic axes</i> of a square matrix — the directions it merely stretches. Reach for it whenever you want to understand, compress, or simplify a linear operator or a covariance structure.</p>
     <p><b>Where it unlocks things:</b></p>
     <ul>
       <li><b>PCA (Principal Component Analysis)</b> — the top eigenvectors of the covariance matrix are the directions of greatest spread; keep a few to compress and denoise data.</li>
       <li><b>PageRank and graphs</b> — the steady-state ranking is the dominant eigenvector of a transition matrix; spectral clustering uses the smallest ones.</li>
       <li><b>Stability and conditioning</b> — eigenvalues tell you whether a dynamical system or an optimization landscape is well-behaved.</li>
     </ul>
     <p><b>Use the SVD (Singular Value Decomposition) instead when:</b> the matrix is rectangular (data is rows×columns, not square) or you need numerical robustness — SVD always exists and is more stable. For just the top few directions on a huge matrix, a truncated / randomized solver (<code>scipy.sparse.linalg.eigsh</code>, <code>sklearn</code>'s PCA) beats a full decomposition.</p>`,
  pitfalls:
    `<ul>
       <li><b>Eigen-decomposition needs a square matrix.</b> For non-square data (examples × features), eigenvectors aren't defined — use the SVD (Singular Value Decomposition), which factors any shape.</li>
       <li><b>Real matrices can have complex eigenvalues.</b> A rotation has no real eigenvectors. Only symmetric matrices (like covariance) are guaranteed real eigenvalues and orthogonal eigenvectors — the case PCA (Principal Component Analysis) relies on.</li>
       <li><b>PCA without centering is wrong.</b> Subtract the mean first, or the leading component just points at the data's offset from the origin instead of its spread.</li>
       <li><b>Scale changes the answer.</b> Eigenvectors of a covariance matrix depend on feature units, so an unscaled feature dominates. Standardize (or use the correlation matrix).</li>
       <li><b>Eigenvectors aren't unique.</b> Sign and ordering can flip between libraries or runs, and repeated eigenvalues leave a whole subspace free. Don't depend on a fixed sign.</li>
       <li><b>Near-equal eigenvalues are unstable.</b> When two eigenvalues are close, their eigenvectors are numerically ill-conditioned and swap easily. Trust the subspace, not the individual vectors.</li>
     </ul>`,
  quiz: {
    q: `For $A=\\begin{bmatrix}5&0\\\\0&5\\end{bmatrix}$, what does $Az$ do to ANY vector $z$? What is the eigenvalue?`,
    a: `<p>It scales every vector by 5 without turning it. So every direction is an eigenvector, all with eigenvalue $\\lambda=5$.</p>`
  }
});

})();
