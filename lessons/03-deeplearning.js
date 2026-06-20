/* =====================================================================
   MODULE 3 — DEEP LEARNING (Stanford CS230).
   Same beginner style as the foundations module:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Deep Learning (CS230)";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---------------------------------------------------------------- */
L({
  id: "dl-neuron",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var st = { w1: 0.5, w2: -1, x1: 4, x2: 1, b: 3 };
    function node(c, x, y, r, fill, stroke) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
    function edge(x1, y1, x2, y2, col, w) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); }
    function draw() {
      var c = C();
      var sig = function (z) { return 1 / (1 + Math.exp(-z)); };
      var z = st.w1 * st.x1 + st.w2 * st.x2 + st.b;
      var a = sig(z);
      ctx.clearRect(0, 0, 640, 300);
      ctx.font = "13px -apple-system, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var x1y = 80, x2y = 220, ix = 90, nx = 330, ny = 150, ox = 560;
      // edges with weights
      edge(ix, x1y, nx, ny, c.accent, Math.min(7, 1 + Math.abs(st.w1) * 2));
      edge(ix, x2y, nx, ny, c.accent, Math.min(7, 1 + Math.abs(st.w2) * 2));
      // weight labels at mid-edge
      ctx.fillStyle = c.warn;
      ctx.fillText("w1=" + st.w1.toFixed(1) + " → " + (st.w1 * st.x1).toFixed(1), (ix + nx) / 2, (x1y + ny) / 2 - 12);
      ctx.fillText("w2=" + st.w2.toFixed(1) + " → " + (st.w2 * st.x2).toFixed(1), (ix + nx) / 2, (x2y + ny) / 2 + 14);
      // input nodes
      node(c, ix, x1y, 26, c.panel, c.accent2); node(c, ix, x2y, 26, c.panel, c.accent2);
      ctx.fillStyle = c.ink; ctx.fillText("x1=" + st.x1.toFixed(1), ix, x1y); ctx.fillText("x2=" + st.x2.toFixed(1), ix, x2y);
      // neuron node
      node(c, nx, ny, 40, c.panel, c.accent);
      ctx.fillStyle = c.ink; ctx.font = "12px sans-serif";
      ctx.fillText("Σw·x+b", nx, ny - 8); ctx.fillText("z=" + z.toFixed(2), nx, ny + 10);
      // bias arrow
      ctx.fillStyle = c.purple; ctx.font = "13px sans-serif"; ctx.fillText("b=" + st.b.toFixed(1), nx, ny + 62);
      edge(nx, ny + 50, nx, ny + 40, c.purple, 2);
      // output edge + activation
      edge(nx + 40, ny, ox - 34, ny, c.accent2, 3);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.fillText("σ(z)", (nx + ox) / 2, ny - 14);
      node(c, ox, ny, 32, c.panel, c.accent2);
      ctx.fillStyle = c.accent2; ctx.font = "14px sans-serif"; ctx.fillText(a.toFixed(3), ox, ny);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.fillText("output", ox, ny + 48);
      ctx.textAlign = "start";
    }
    function slider(label, key, min, max, step) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key];
      var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
      inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key]; draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    slider("w1", "w1", -3, 3, 0.1); slider("w2", "w2", -3, 3, 0.1);
    slider("x1", "x1", -3, 4, 0.1); slider("x2", "x2", -3, 4, 0.1);
    slider("b (bias)", "b", -5, 5, 0.1);
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    var origDraw = draw;
    draw = function () { origDraw(); var z = st.w1 * st.x1 + st.w2 * st.x2 + st.b; var a = 1 / (1 + Math.exp(-z)); rd.innerHTML = "z = w1·x1 + w2·x2 + b = " + (st.w1 * st.x1).toFixed(2) + " + " + (st.w2 * st.x2).toFixed(2) + " + " + st.b.toFixed(2) + " = <b>" + z.toFixed(3) + "</b>, &nbsp; σ(z) = <b>" + a.toFixed(3) + "</b>"; };
    draw();
  },
  title: "The neuron & network layers",
  tagline: "A neuron is a dot product plus a bump, then a squish. Stack many and you get a brain-ish machine.",
  prereqs: ["fnd-dot"],
  bigIdea:
    `<p>A <b>neuron</b> is the tiny building block of a neural network.</p>
     <p>It takes some input numbers. It multiplies each by a weight. It adds them up. It adds one more number called a bias. Then it squishes the result through an activation function.</p>
     <p>One neuron is weak. But stack thousands of them in <b>layers</b> and they can recognize faces, translate languages, and drive cars.</p>`,
  buildup:
    `<p>You already know the dot product: multiply matching numbers, then add. A neuron is exactly that, plus a small extra step.</p>
     <p>A network has three kinds of layers. The <b>input layer</b> holds your raw numbers. The <b>hidden layers</b> in the middle do the real work. The <b>output layer</b> gives the final answer.</p>`,
  symbols: [
    { sym: "$x$", desc: "the input vector: the list of numbers fed into the neuron." },
    { sym: "$w$", desc: "the weight vector: one weight per input. It says how much each input matters." },
    { sym: "$w^\\top x$", desc: "the dot product of weights and inputs. The little $\\top$ ('transpose') lines them up to multiply and add." },
    { sym: "$b$", desc: "the bias: a single number added on, to shift the result up or down." },
    { sym: "$z$", desc: "the result before the activation. Also called the 'pre-activation'." }
  ],
  formula: `$$ z = w^\\top x + b $$`,
  whatItDoes:
    `<p>Read it as: "take the dot product of weights and inputs, then add the bias."</p>
     <p>That gives one number, $z$. Next the neuron runs $z$ through an activation function (next lesson) to get its final output.</p>`,
  example:
    `<p>One neuron has weights $w = [0.5, -1, 2]$ and bias $b = 3$. The input is $x = [4, 1, 2]$.</p>
     <ul class="steps">
       <li>Multiply matching entries: $0.5\\times4 = 2$, &nbsp; $-1\\times1 = -1$, &nbsp; $2\\times2 = 4$.</li>
       <li>Add them: $2 - 1 + 4 = 5$. That is the dot product $w^\\top x$.</li>
       <li>Add the bias: $z = 5 + 3 = 8$.</li>
     </ul>
     <p>So this neuron outputs $z = 8$ before its activation. The bias nudged the answer from 5 up to 8.</p>`,
  application:
    `<p>Every layer of every deep network is full of these neurons. A digit recognizer might have 784 inputs (the pixels), a few hidden layers of neurons, and 10 output neurons (one per digit 0-9).</p>`,
  quiz: {
    q: `A neuron has $w = [2, -1]$, $b = 1$, and input $x = [3, 5]$. Find $z$.`,
    a: `<p>Dot product: $2\\times3 + (-1)\\times5 = 6 - 5 = 1$. Add bias: $z = 1 + 1 = 2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-activations",
  demo: function (host) {
    var sig = function (z) { return 1 / (1 + Math.exp(-z)); };
    var th = function (z) { return Math.tanh(z); };
    var rl = function (z) { return Math.max(0, z); };
    Demos.plot(host, {
      xmin: -5, xmax: 5, ymin: -1.2, ymax: 3,
      curves: [
        { f: sig, label: "sigmoid (0,1)", color: "#4ea1ff" },
        { f: th, label: "tanh (−1,1)", color: "#7ee787" },
        { f: rl, label: "ReLU max(0,z)", color: "#c89bff" }
      ],
      drag: {
        curve: 0, start: 1, label: "x",
        readout: function (z) {
          return "at x = <b>" + z.toFixed(2) + "</b>: &nbsp; sigmoid = <b style='color:#4ea1ff'>" +
            sig(z).toFixed(3) + "</b> &nbsp; tanh = <b style='color:#7ee787'>" +
            th(z).toFixed(3) + "</b> &nbsp; ReLU = <b style='color:#c89bff'>" +
            rl(z).toFixed(3) + "</b>";
        }
      }
    });
  },
  title: "Activation functions",
  tagline: "The squish that lets a network learn curvy, non-straight patterns.",
  prereqs: ["dl-neuron"],
  bigIdea:
    `<p>An <b>activation function</b> takes the neuron's number $z$ and reshapes it.</p>
     <p>Why bother? Without it, stacking layers just makes one big straight line. Straight lines cannot learn curvy patterns.</p>
     <p>The activation adds a <i>bend</i>. That bend is what lets deep networks learn complicated things.</p>`,
  buildup:
    `<p>You have $z = w^\\top x + b$, one number. Now pass it through one of these functions.</p>
     <p>Each function has a different shape. We pick the one that fits the job.</p>`,
  symbols: [
    { sym: "$z$", desc: "the input number (the neuron's pre-activation)." },
    { sym: "$e$", desc: "Euler's number, about 2.718. A fixed constant used for smooth curves." },
    { sym: "$\\sigma(z)$", desc: "the sigmoid function (Greek 'sigma'). Squishes any number into the range 0 to 1." },
    { sym: "$\\tanh(z)$", desc: "the tanh function. Squishes any number into the range -1 to 1." },
    { sym: "$\\max(0, z)$", desc: "the larger of 0 and $z$. This is ReLU: keep positives, turn negatives into 0." }
  ],
  formula: `$$ \\sigma(z) = \\frac{1}{1+e^{-z}} \\qquad \\tanh(z) = \\frac{e^{z}-e^{-z}}{e^{z}+e^{-z}} \\qquad \\text{ReLU}(z) = \\max(0, z) $$`,
  whatItDoes:
    `<p><b>Sigmoid</b> turns any number into a value between 0 and 1. Good for probabilities.</p>
     <p><b>Tanh</b> is like sigmoid but ranges from -1 to 1, centered at zero.</p>
     <p><b>ReLU</b> is the most popular. It just keeps positive numbers and flattens negatives to 0. Simple and fast.</p>
     <p><b>Leaky ReLU</b> is a small fix: instead of flat 0 for negatives, it lets a tiny slope through (like $0.01z$) so neurons never fully "die".</p>`,
  example:
    `<p>Let $z = 2$. Apply each activation.</p>
     <ul class="steps">
       <li>Sigmoid: $\\frac{1}{1+e^{-2}} = \\frac{1}{1+0.135} = \\frac{1}{1.135} \\approx 0.88$.</li>
       <li>ReLU: $\\max(0, 2) = 2$ (positive, so it passes through unchanged).</li>
       <li>Now let $z = -3$. ReLU: $\\max(0, -3) = 0$ (negative, so flattened to 0).</li>
       <li>Leaky ReLU at $z=-3$: $0.01\\times(-3) = -0.03$ (a tiny bit gets through).</li>
     </ul>`,
  application:
    `<p>ReLU powers almost all modern image and language networks because it trains fast. Sigmoid is used at the very end for yes/no predictions. Tanh shows up inside older recurrent networks.</p>`,
  quiz: {
    q: `Apply ReLU to $z = -7$ and to $z = 4$.`,
    a: `<p>ReLU$(-7) = \\max(0, -7) = 0$. ReLU$(4) = \\max(0, 4) = 4$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-forward-prop",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    // 2 inputs -> 2 hidden -> 1 output. Fixed weights.
    var st = { x1: 1, x2: 2 };
    var W1 = [[1, -1], [0.5, 2]];   // hidden[j] weights on x1,x2
    var b1 = [0, -1];
    var W2 = [1.5, -0.5];           // output weights on h1,h2
    var b2 = 1;
    var relu = function (z) { return Math.max(0, z); };
    function fwd() {
      var z1 = W1[0][0] * st.x1 + W1[0][1] * st.x2 + b1[0];
      var z2 = W1[1][0] * st.x1 + W1[1][1] * st.x2 + b1[1];
      var h1 = relu(z1), h2 = relu(z2);
      var zo = W2[0] * h1 + W2[1] * h2 + b2;
      return { z1: z1, z2: z2, h1: h1, h2: h2, zo: zo, y: zo };
    }
    function node(x, y, r, fill, stroke) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
    function draw() {
      var c = C(); var f = fwd();
      ctx.clearRect(0, 0, 640, 320);
      ctx.font = "12px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var L1x = 90, L2x = 320, L3x = 560;
      var inY = [100, 220], hiY = [80, 240], outY = 160;
      var inV = [st.x1, st.x2], hiV = [f.h1, f.h2];
      // edges in->hidden
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
        var w = W1[j][i];
        ctx.beginPath(); ctx.moveTo(L1x, inY[i]); ctx.lineTo(L2x, hiY[j]);
        ctx.strokeStyle = w >= 0 ? c.accent : c.warn; ctx.lineWidth = Math.min(5, 0.6 + Math.abs(w) * 1.5); ctx.stroke();
      }
      // edges hidden->out
      for (var j2 = 0; j2 < 2; j2++) {
        var w2 = W2[j2];
        ctx.beginPath(); ctx.moveTo(L2x, hiY[j2]); ctx.lineTo(L3x, outY);
        ctx.strokeStyle = w2 >= 0 ? c.accent : c.warn; ctx.lineWidth = Math.min(5, 0.6 + Math.abs(w2) * 1.5); ctx.stroke();
      }
      // weight labels for input->hidden (small)
      ctx.fillStyle = c.dim; ctx.font = "10px sans-serif";
      ctx.fillText(W1[0][0].toFixed(1), L1x + 70, inY[0] + (hiY[0] - inY[0]) * 70 / (L2x - L1x) - 8);
      // nodes
      for (var ii = 0; ii < 2; ii++) { node(L1x, inY[ii], 24, c.panel, c.accent2); ctx.fillStyle = c.ink; ctx.font = "12px sans-serif"; ctx.fillText("x" + (ii + 1) + "=" + inV[ii].toFixed(1), L1x, inY[ii]); }
      for (var jj = 0; jj < 2; jj++) { node(L2x, hiY[jj], 28, c.panel, c.accent); ctx.fillStyle = c.ink; ctx.font = "11px sans-serif"; ctx.fillText("h" + (jj + 1), L2x, hiY[jj] - 8); ctx.fillText("a=" + hiV[jj].toFixed(2), L2x, hiY[jj] + 8); }
      node(L3x, outY, 32, c.panel, c.accent2); ctx.fillStyle = c.accent2; ctx.font = "13px sans-serif"; ctx.fillText("y", L3x, outY - 9); ctx.fillText(f.y.toFixed(2), L3x, outY + 9);
      // layer labels
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("input", L1x, 290); ctx.fillText("hidden (ReLU)", L2x, 290); ctx.fillText("output", L3x, 290);
      ctx.textAlign = "start";
    }
    function slider(label, key, min, max, step) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key];
      var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
      inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key]; draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    slider("x1 (input)", "x1", -3, 3, 0.1); slider("x2 (input)", "x2", -3, 3, 0.1);
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    var origDraw = draw;
    draw = function () { origDraw(); var f = fwd(); rd.innerHTML = "h1 = ReLU(" + f.z1.toFixed(2) + ") = <b>" + f.h1.toFixed(2) + "</b>, h2 = ReLU(" + f.z2.toFixed(2) + ") = <b>" + f.h2.toFixed(2) + "</b><br>y = " + W2[0] + "·h1 + " + W2[1] + "·h2 + " + b2 + " = <b>" + f.y.toFixed(3) + "</b>. Blue edge = positive weight, orange = negative."; };
    draw();
  },
  title: "Forward propagation",
  tagline: "Push the input through every layer, left to right, to get the prediction.",
  prereqs: ["dl-neuron", "dl-activations"],
  bigIdea:
    `<p><b>Forward propagation</b> is how a network makes a prediction.</p>
     <p>You feed the input into the first layer. Its output becomes the input to the next layer. And so on, until the last layer.</p>
     <p>The final layer's output is the network's answer. That is all "running the model" means.</p>`,
  buildup:
    `<p>Each layer does the same thing: compute $z = w^\\top x + b$ for every neuron, then apply an activation.</p>
     <p>We call the output of a layer $a$ (for "activation"). The $a$ of one layer feeds in as the $x$ of the next.</p>`,
  symbols: [
    { sym: "$x$", desc: "the input numbers fed into the first layer." },
    { sym: "$z^{[1]}$", desc: "the pre-activation of layer 1. The $[1]$ in brackets means 'layer number 1'." },
    { sym: "$a^{[1]}$", desc: "the output (activation) of layer 1, after the activation function." },
    { sym: "$W^{[1]}, b^{[1]}$", desc: "the weights and bias of layer 1." },
    { sym: "$g(\\cdot)$", desc: "the activation function (like ReLU or sigmoid)." }
  ],
  formula: `$$ z^{[1]} = W^{[1]} x + b^{[1]}, \\quad a^{[1]} = g(z^{[1]}), \\quad a^{[2]} = g(W^{[2]} a^{[1]} + b^{[2]}) $$`,
  whatItDoes:
    `<p>Layer 1 takes the input $x$, computes $z^{[1]}$, then squishes it to $a^{[1]}$.</p>
     <p>Layer 2 takes $a^{[1]}$ as its input and does the same. Its output $a^{[2]}$ is the prediction.</p>`,
  example:
    `<p>Tiny 2-layer network. Input $x = 2$ (one number). Use ReLU as the activation.</p>
     <ul class="steps">
       <li>Layer 1: $w^{[1]} = 3$, $b^{[1]} = -1$. So $z^{[1]} = 3\\times2 - 1 = 5$. ReLU keeps it: $a^{[1]} = 5$.</li>
       <li>Layer 2: $w^{[2]} = -2$, $b^{[2]} = 4$. So $z^{[2]} = -2\\times5 + 4 = -6$. ReLU flattens it: $a^{[2]} = \\max(0, -6) = 0$.</li>
       <li>The network's prediction is $0$.</li>
     </ul>
     <p>Notice the output of layer 1 (which was 5) became the input to layer 2. That chaining is forward propagation.</p>`,
  application:
    `<p>Every time you ask a chatbot a question or a phone unlocks with your face, the device runs forward propagation through a trained network to produce the answer.</p>`,
  quiz: {
    q: `One layer, ReLU activation. $w = 2$, $b = -3$, input $x = 4$. What does it output?`,
    a: `<p>$z = 2\\times4 - 3 = 5$. ReLU$(5) = 5$. The output is $5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-cross-entropy",
  demo: function (host) {
    Demos.plot(host, {
      xmin: 0.01, xmax: 1, ymin: 0, ymax: 5, height: 300,
      curves: [
        { f: function (p) { return -Math.log(p); }, label: "loss = −log(p)" }
      ],
      drag: {
        curve: 0, start: 0.5, label: "predicted p",
        readout: function (p, y) {
          return "true label = 1. predicted p = <b>" + p.toFixed(3) +
            "</b> → loss = −log(p) = <b>" + y.toFixed(3) +
            "</b>. Loss → 0 as p → 1, and → ∞ as p → 0.";
        }
      }
    });
  },
  title: "Cross-entropy loss",
  tagline: "Measures how wrong a yes/no prediction is. Confident and wrong hurts the most.",
  prereqs: ["dl-forward-prop", "ml-loss", "ml-logistic-regression"],
  bigIdea:
    `<p>A <b>loss</b> is a number that says how wrong a prediction is. Smaller is better.</p>
     <p><b>Cross-entropy</b> is the loss we use when the answer is yes/no (1 or 0).</p>
     <p>Its special trick: it punishes confident wrong answers very harshly. Saying "99% sure it's a cat" when it's a dog gives a huge loss.</p>`,
  buildup:
    `<p>The network predicts a probability $z$ between 0 and 1 (usually from a sigmoid). The true answer $y$ is either 1 or 0.</p>
     <p>We want a formula that is near 0 when the prediction matches, and large when it does not.</p>`,
  symbols: [
    { sym: "$y$", desc: "the true label: 1 (yes) or 0 (no)." },
    { sym: "$z$", desc: "the predicted probability, a number between 0 and 1." },
    { sym: "$\\log$", desc: "the natural logarithm. $\\log$ of a number near 1 is near 0; $\\log$ of a tiny number is a big negative." },
    { sym: "$L(z, y)$", desc: "the loss: how wrong this single prediction is." }
  ],
  formula: `$$ L(z, y) = -\\big[\\, y \\log z + (1-y)\\log(1-z) \\,\\big] $$`,
  whatItDoes:
    `<p>If the truth is $y = 1$, only the first part survives: $L = -\\log z$. A confident-correct $z$ near 1 gives loss near 0. A wrong $z$ near 0 gives a huge loss.</p>
     <p>If the truth is $y = 0$, only the second part survives: $L = -\\log(1-z)$. The minus sign flips the negative log into a positive loss.</p>`,
  example:
    `<p>True label $y = 1$ (it really is a cat). Compare two predictions.</p>
     <ul class="steps">
       <li>Good prediction $z = 0.9$: $L = -\\log(0.9) = -(-0.105) = 0.105$. Small loss.</li>
       <li>Bad prediction $z = 0.1$: $L = -\\log(0.1) = -(-2.303) = 2.303$. Much bigger loss.</li>
       <li>Terrible prediction $z = 0.01$: $L = -\\log(0.01) = 4.605$. Confident <i>and</i> wrong, so a giant loss.</li>
     </ul>
     <p>The closer the prediction is to the truth, the smaller the loss. Being confidently wrong is punished the hardest.</p>`,
  application:
    `<p>Cross-entropy is the standard loss for classification: spam vs not-spam, cat vs dog, which of 1000 objects is in a photo. Training drives this loss down step by step.</p>`,
  quiz: {
    q: `True label $y = 0$. The model predicts $z = 0.2$. What is the loss? (Use $\\log(0.8) \\approx -0.223$.)`,
    a: `<p>Since $y=0$, $L = -\\log(1 - 0.2) = -\\log(0.8) = -(-0.223) = 0.223$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-backprop",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var st = { dLda: 2, dadz: 0.5, dzdw: 3, eta: 0.1, w: 1 };
    function node(x, y, r, fill, stroke) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
    // arrow drawn from (x1) to (x2) along the row at y, pointing toward x2
    function backArrow(x1, x2, y, col, lbl) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      var dir = x2 < x1 ? -1 : 1;
      ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2 - dir * 10, y - 6); ctx.lineTo(x2 - dir * 10, y + 6); ctx.closePath(); ctx.fill();
      ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText(lbl, (x1 + x2) / 2, y - 12);
    }
    function draw() {
      var c = C();
      var grad = st.dLda * st.dadz * st.dzdw;
      var wNew = st.w - st.eta * grad;
      ctx.clearRect(0, 0, 640, 300);
      ctx.font = "12px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var wx = 90, zx = 270, ax = 430, lx = 580, ny = 120;
      // forward-ish nodes w -> z -> a -> L
      node(wx, ny, 30, c.panel, c.accent2); ctx.fillStyle = c.ink; ctx.fillText("w", wx, ny - 8); ctx.fillText(st.w.toFixed(2), wx, ny + 8);
      node(zx, ny, 30, c.panel, c.accent); ctx.fillStyle = c.ink; ctx.fillText("z", zx, ny);
      node(ax, ny, 30, c.panel, c.accent); ctx.fillStyle = c.ink; ctx.fillText("a", ax, ny);
      node(lx, ny, 30, c.panel, c.warn); ctx.fillStyle = c.ink; ctx.fillText("L", lx, ny);
      // backward gradient arrows (right -> left)
      backArrow(lx - 30, ax + 30, ny - 50, c.purple, "∂L/∂a=" + st.dLda.toFixed(2));
      backArrow(ax - 30, zx + 30, ny - 50, c.purple, "∂a/∂z=" + st.dadz.toFixed(2));
      backArrow(zx - 30, wx + 30, ny - 50, c.purple, "∂z/∂w=" + st.dzdw.toFixed(2));
      // accumulated gradient at w
      ctx.fillStyle = c.purple; ctx.font = "13px sans-serif";
      ctx.fillText("∂L/∂w = " + grad.toFixed(2), wx, ny + 60);
      // update
      ctx.fillStyle = c.accent2; ctx.font = "13px sans-serif";
      ctx.fillText("w ← " + st.w.toFixed(2) + " − " + st.eta.toFixed(2) + "·(" + grad.toFixed(2) + ") = " + wNew.toFixed(3), wx + 120, ny + 100);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("gradients flow right → left (chain rule)", 320, 40);
      ctx.textAlign = "start";
    }
    function slider(label, key, min, max, step) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key];
      var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
      inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key]; draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    slider("∂L/∂a (upstream)", "dLda", -3, 3, 0.1);
    slider("∂a/∂z (local)", "dadz", -2, 2, 0.1);
    slider("∂z/∂w = x (local)", "dzdw", -3, 3, 0.1);
    slider("η (learning rate)", "eta", 0.01, 1, 0.01);
    slider("current w", "w", -5, 5, 0.1);
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    var origDraw = draw;
    draw = function () { origDraw(); var grad = st.dLda * st.dadz * st.dzdw; var wNew = st.w - st.eta * grad; rd.innerHTML = "∂L/∂w = (∂L/∂a)·(∂a/∂z)·(∂z/∂w) = " + st.dLda.toFixed(2) + "·" + st.dadz.toFixed(2) + "·" + st.dzdw.toFixed(2) + " = <b>" + grad.toFixed(3) + "</b><br>w ← w − η·grad = <b>" + wNew.toFixed(3) + "</b>"; };
    draw();
  },
  title: "Backpropagation",
  tagline: "Run the chain rule backward to find how each weight caused the error, then fix it.",
  prereqs: ["fnd-chain", "ml-gradient-descent", "dl-forward-prop", "dl-cross-entropy"],
  bigIdea:
    `<p><b>Backpropagation</b> is how a network learns.</p>
     <p>Forward propagation gives a prediction and a loss. Backprop works backward to find how much each weight is to blame for that loss.</p>
     <p>It does this with the chain rule: multiply the slopes of each step going backward. Then it nudges every weight in the direction that lowers the loss.</p>`,
  buildup:
    `<p>The loss $L$ depends on the output $a$. The output $a$ depends on $z$. And $z$ depends on the weight $w$.</p>
     <p>To find how $L$ changes when $w$ changes, the chain rule multiplies the three slopes together.</p>`,
  symbols: [
    { sym: "$\\frac{\\partial L}{\\partial w}$", desc: "how much the loss changes when weight $w$ changes. The curly $\\partial$ means 'partial' (one input at a time)." },
    { sym: "$\\frac{\\partial L}{\\partial a}$", desc: "how much the loss changes when the output $a$ changes." },
    { sym: "$\\frac{\\partial a}{\\partial z}$", desc: "how much $a$ changes when $z$ changes (the slope of the activation)." },
    { sym: "$\\frac{\\partial z}{\\partial w}$", desc: "how much $z$ changes when $w$ changes (this equals the input $x$)." },
    { sym: "$\\eta$", desc: "the learning rate (Greek 'eta'): how big a step we take. A small positive number." }
  ],
  formula: `$$ \\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a}\\cdot\\frac{\\partial a}{\\partial z}\\cdot\\frac{\\partial z}{\\partial w} \\qquad w \\leftarrow w - \\eta\\,\\frac{\\partial L}{\\partial w} $$`,
  whatItDoes:
    `<p>The first formula chains three slopes to find the total slope of the loss with respect to one weight.</p>
     <p>The second formula updates the weight: step in the <i>opposite</i> direction of the slope (downhill) by an amount $\\eta$. Repeat for every weight, many times.</p>`,
  example:
    `<p>Suppose for one weight: $\\frac{\\partial L}{\\partial a} = 2$, $\\frac{\\partial a}{\\partial z} = 0.5$, $\\frac{\\partial z}{\\partial w} = 3$. Learning rate $\\eta = 0.1$, current $w = 1$.</p>
     <ul class="steps">
       <li>Chain the slopes: $\\frac{\\partial L}{\\partial w} = 2 \\times 0.5 \\times 3 = 3$.</li>
       <li>Update: $w \\leftarrow 1 - 0.1\\times3 = 1 - 0.3 = 0.7$.</li>
       <li>The weight moved from 1 to 0.7, lowering the loss a little.</li>
     </ul>
     <p>Do this for all weights, over and over. That is training.</p>`,
  application:
    `<p>Backprop is the engine behind training every neural network ever built: image classifiers, translators, and the large language models behind chatbots. It is just the chain rule run at huge scale.</p>`,
  quiz: {
    q: `If $\\frac{\\partial L}{\\partial w} = 4$, $\\eta = 0.5$, and $w = 10$, what is the new $w$?`,
    a: `<p>$w \\leftarrow 10 - 0.5\\times4 = 10 - 2 = 8$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-optimizers",
  demo: function (host) {
    Demos.descent(host, {
      f: function (x) { return x * x; },
      df: function (x) { return 2 * x; },
      xmin: -5, xmax: 5, start: 4, lr: 0.1, height: 300
    });
  },
  title: "Optimizers: Momentum, RMSprop, Adam",
  tagline: "Smarter ways to step downhill so training is faster and steadier.",
  prereqs: ["dl-backprop"],
  bigIdea:
    `<p>Plain gradient descent takes one fixed step downhill at a time. It can be slow and shaky.</p>
     <p><b>Optimizers</b> are upgrades that make the steps smarter.</p>
     <p><b>Adam</b> is the most popular. It combines two good ideas (Momentum and RMSprop) and usually just works.</p>`,
  buildup:
    `<p>Imagine rolling downhill into a valley. Plain descent zig-zags and crawls.</p>
     <p>What if the ball built up speed? And what if it slowed down in steep directions but sped up in flat ones? Those are the two ideas.</p>`,
  symbols: [
    { sym: "Momentum", desc: "remembers past steps and keeps rolling in that direction, like a heavy ball. Smooths out zig-zags." },
    { sym: "RMSprop", desc: "scales each direction's step by how bumpy it has been. Big steps where flat, small steps where steep." },
    { sym: "Adam", desc: "Momentum + RMSprop together. Adapts the step per weight. The default choice for most deep learning." },
    { sym: "$\\eta$", desc: "the base learning rate: the starting step size before the optimizer adjusts it." }
  ],
  formula: `$$ \\text{SGD: } w \\leftarrow w - \\eta\\,\\frac{\\partial L}{\\partial w} \\qquad \\text{Adam: adjusts } \\eta \\text{ per weight using past gradients} $$`,
  whatItDoes:
    `<p><b>Momentum</b> adds a fraction of the previous step to the current one, building speed in consistent directions.</p>
     <p><b>RMSprop</b> divides the step by a running measure of how large recent gradients were, so wild directions get tamed.</p>
     <p><b>Adam</b> does both at once and is the usual default.</p>`,
  example:
    `<p>Imagine the gradient keeps pointing the same way: $+2, +2, +2$.</p>
     <ul class="steps">
       <li>Plain step (size 1 each): you move $2, 2, 2$. Steady but slow.</li>
       <li>With Momentum (keep 90% of past speed): step 1 moves $2$, step 2 builds to about $3.8$, step 3 to about $5.4$.</li>
       <li>Same consistent direction, but you accelerate and reach the bottom faster.</li>
     </ul>
     <p>When the gradient is consistent, Momentum speeds you up. When it flip-flops, it cancels out the noise.</p>`,
  application:
    `<p>Nearly every deep network today is trained with Adam. It saves engineers from hand-tuning the step size and makes training reliable on huge models.</p>`,
  quiz: {
    q: `Why is Adam usually preferred over plain gradient descent?`,
    a: `<p>It adapts the step size for each weight (using Momentum and RMSprop), so training is faster and needs less manual tuning of the learning rate.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-minibatch",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "N", label: "N (dataset size)", min: 1, max: 5000, val: 1000, step: 1 },
        { key: "m", label: "m (batch size)", min: 1, max: 1024, val: 100, step: 1 }
      ],
      compute: function (s) {
        var iters = Math.ceil(s.N / s.m);
        return { text: "iterations per epoch = ceil(N / m) = ceil(" + s.N + " / " + s.m +
          ") = <b>" + iters + "</b> weight updates per epoch." };
      }
    });
  },
  title: "Mini-batch gradient descent & epochs",
  tagline: "Update on small chunks of data instead of one example or the whole set.",
  prereqs: ["dl-backprop"],
  bigIdea:
    `<p>You can update the weights using one example, all examples, or a small chunk.</p>
     <p>A <b>mini-batch</b> is a small chunk (like 32 or 128 examples). It is the sweet spot.</p>
     <p>One full pass over all the data is called an <b>epoch</b>. Training usually runs many epochs.</p>`,
  buildup:
    `<p>Using the whole dataset for each step is accurate but very slow.</p>
     <p>Using one example per step is fast but jumpy and noisy.</p>
     <p>A mini-batch balances both: fast enough, and stable enough.</p>`,
  symbols: [
    { sym: "batch size", desc: "how many examples are in one mini-batch (e.g. 32)." },
    { sym: "epoch", desc: "one complete pass through the whole training set." },
    { sym: "iteration", desc: "one weight update, using one mini-batch." },
    { sym: "$N$", desc: "the total number of training examples." }
  ],
  formula: `$$ \\text{iterations per epoch} = \\frac{N}{\\text{batch size}} $$`,
  whatItDoes:
    `<p>Split the data into mini-batches. For each batch, run forward prop, compute the loss, run backprop, and update the weights.</p>
     <p>When you have used every batch once, that is one epoch. Then shuffle and go again.</p>`,
  example:
    `<p>You have $N = 1000$ training images. You choose a batch size of 100.</p>
     <ul class="steps">
       <li>Iterations per epoch: $1000 \\div 100 = 10$. So 10 weight updates make one epoch.</li>
       <li>If you train for 5 epochs, that is $10 \\times 5 = 50$ total updates.</li>
       <li>Each update uses 100 images, not just 1 and not all 1000.</li>
     </ul>`,
  application:
    `<p>All large-scale training uses mini-batches because they fit nicely in GPU memory and keep the GPU busy. Batch size is one of the first knobs engineers tune.</p>`,
  quiz: {
    q: `You have 800 examples and a batch size of 200. How many iterations are in one epoch?`,
    a: `<p>$800 \\div 200 = 4$ iterations per epoch.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-init",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "nin", label: "n_in (inputs to layer)", min: 1, max: 1000, val: 100, step: 1 }
      ],
      compute: function (s) {
        var xavier = 1 / s.nin;
        var he = 2 / s.nin;
        return { text: "Xavier variance = 1 / n_in = 1 / " + s.nin + " = <b>" + xavier.toFixed(5) +
          "</b> (std ≈ " + Math.sqrt(xavier).toFixed(4) + ")" +
          "<br>He variance = 2 / n_in = 2 / " + s.nin + " = <b>" + he.toFixed(5) +
          "</b> (std ≈ " + Math.sqrt(he).toFixed(4) + ")" +
          "<br>More inputs → smaller starting weights." };
      }
    });
  },
  title: "Weight initialization (Xavier)",
  tagline: "Start the weights at small, just-right random values. Zeros or huge values break training.",
  prereqs: ["dl-forward-prop"],
  bigIdea:
    `<p>Before training, every weight needs a starting value. The choice matters a lot.</p>
     <p>If all weights start at <b>zero</b>, every neuron computes the same thing and they never split apart. Learning is stuck.</p>
     <p>If weights start <b>too big</b>, the signals explode. <b>Xavier initialization</b> picks small random values that are just right.</p>`,
  buildup:
    `<p>We want the signal to flow through many layers without shrinking to nothing or blowing up.</p>
     <p>Xavier scales the random starting values based on how many inputs a layer has. More inputs means smaller starting weights.</p>`,
  symbols: [
    { sym: "$n_{in}$", desc: "the number of inputs coming into a layer." },
    { sym: "Var", desc: "the variance: a measure of how spread out the random values are. Small variance means values close to 0." },
    { sym: "$w$", desc: "a weight, picked at random from a spread set by the rule below." }
  ],
  formula: `$$ \\text{Var}(w) = \\frac{1}{n_{in}} $$`,
  whatItDoes:
    `<p>The rule says: the spread of the starting weights should be 1 divided by the number of inputs.</p>
     <p>Many inputs means each weight should start smaller, so their sum does not blow up. This keeps signals at a healthy size through deep networks.</p>`,
  example:
    `<p>A layer has $n_{in} = 100$ inputs.</p>
     <ul class="steps">
       <li>Xavier variance: $\\frac{1}{100} = 0.01$.</li>
       <li>The typical spread (standard deviation) is $\\sqrt{0.01} = 0.1$. So weights start around $\\pm 0.1$.</li>
       <li>If instead the layer had only 4 inputs: variance $\\frac{1}{4} = 0.25$, spread $\\sqrt{0.25} = 0.5$. Bigger, because fewer inputs add up.</li>
     </ul>
     <p>Compare with all-zeros: every neuron would be identical forever, so the network could never learn.</p>`,
  application:
    `<p>Good initialization lets very deep networks (dozens of layers) train at all. Xavier and its cousin He-initialization are the defaults in PyTorch and TensorFlow.</p>`,
  quiz: {
    q: `Why is starting all weights at zero a bad idea?`,
    a: `<p>Every neuron would compute the same value and get the same update, so they never become different. The network cannot learn distinct features.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-dropout",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    // 3 inputs -> 6 hidden -> 2 output. Hidden neurons get dropped.
    var st = { keep: 0.5 };
    var mask = [1, 1, 1, 1, 1, 1];
    function resample() { mask = mask.map(function () { return Math.random() < st.keep ? 1 : 0; }); }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, 640, 300);
      ctx.font = "12px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var inY = [80, 150, 220], hiY = [40, 90, 140, 190, 240, 290].slice(0, 6).map(function (v) { return v - 5; }), outY = [110, 190];
      var L1 = 90, L2 = 320, L3 = 550;
      // map 6 hidden to spread vertically
      var hY = [30, 78, 126, 174, 222, 270];
      // edges (faint), skip dropped hidden
      ctx.lineWidth = 1;
      for (var i = 0; i < 3; i++) for (var j = 0; j < 6; j++) { ctx.strokeStyle = mask[j] ? c.border : "rgba(120,120,120,0.12)"; ctx.beginPath(); ctx.moveTo(L1, inY[i]); ctx.lineTo(L2, hY[j]); ctx.stroke(); }
      for (var j2 = 0; j2 < 6; j2++) for (var o = 0; o < 2; o++) { ctx.strokeStyle = mask[j2] ? c.border : "rgba(120,120,120,0.12)"; ctx.beginPath(); ctx.moveTo(L2, hY[j2]); ctx.lineTo(L3, outY[o]); ctx.stroke(); }
      function node(x, y, r, fill, stroke) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
      for (var ii = 0; ii < 3; ii++) node(L1, inY[ii], 16, c.panel, c.accent2);
      for (var jj = 0; jj < 6; jj++) { var on = mask[jj]; node(L2, hY[jj], 16, on ? c.panel : "rgba(120,120,120,0.25)", on ? c.accent : "rgba(120,120,120,0.4)"); if (!on) { ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.fillText("✕", L2, hY[jj]); } }
      for (var oo = 0; oo < 2; oo++) node(L3, outY[oo], 16, c.panel, c.accent2);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("input", L1, 295); ctx.fillText("hidden (dropout)", L2, 295); ctx.fillText("output", L3, 295);
    }
    function readout() {
      var kept = mask.reduce(function (a, b) { return a + b; }, 0);
      rd.innerHTML = "keep prob p = " + st.keep.toFixed(2) + ". This pass: <b>" + kept + " of 6</b> hidden neurons kept, " + (6 - kept) + " dropped (greyed ✕).<br>inverted-dropout scales survivors by 1/p = <b>" + (1 / st.keep).toFixed(2) + "</b> so the total stays balanced.";
    }
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    var btn = document.createElement("button"); btn.textContent = "resample dropout mask";
    btn.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin:8px 0";
    btn.addEventListener("click", function () { resample(); draw(); readout(); });
    var row = document.createElement("div"); row.style.margin = "6px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "keep prob p = " + st.keep;
    var inp = document.createElement("input"); inp.type = "range"; inp.min = 0.1; inp.max = 1; inp.step = 0.05; inp.value = st.keep;
    inp.addEventListener("input", function () { st.keep = parseFloat(inp.value); lab.textContent = "keep prob p = " + st.keep.toFixed(2); resample(); draw(); readout(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    host.appendChild(btn); host.appendChild(rd);
    resample(); draw(); readout();
  },
  title: "Dropout",
  tagline: "Randomly switch off neurons during training so the network can't lean on any one of them.",
  prereqs: ["dl-forward-prop", "ml-regularization"],
  bigIdea:
    `<p><b>Overfitting</b> means the network memorizes the training data instead of learning general patterns.</p>
     <p><b>Dropout</b> fights this. During training, it randomly turns off some neurons each step.</p>
     <p>With neurons randomly missing, the network can't rely on any single one. It must spread out and learn sturdier patterns.</p>`,
  buildup:
    `<p>Each training step, every neuron is kept with some probability, or dropped (set to 0) otherwise.</p>
     <p>The drop probability $p$ is a setting, often around 0.5 for hidden layers. At test time, dropout is turned off and all neurons are used.</p>`,
  symbols: [
    { sym: "$p$", desc: "the drop probability: the chance a neuron is switched off this step (e.g. 0.5 = half)." },
    { sym: "keep", desc: "a neuron survives and passes its value on." },
    { sym: "drop", desc: "a neuron is set to 0 for this step, as if it weren't there." }
  ],
  formula: `$$ \\text{keep a neuron with probability } (1-p), \\quad \\text{else set it to } 0 $$`,
  whatItDoes:
    `<p>On each training pass, flip a weighted coin for every neuron. With probability $p$ it is dropped to 0. With probability $1-p$ it stays.</p>
     <p>This is like training many slightly different networks and averaging them, which reduces overfitting.</p>`,
  example:
    `<p>A hidden layer has 10 neurons. Dropout rate $p = 0.5$.</p>
     <ul class="steps">
       <li>On one training step, about half the neurons drop: say 5 are kept, 5 are set to 0.</li>
       <li>Only those 5 active neurons pass values forward this step.</li>
       <li>Next step, a different random 5 might be kept. The pattern changes every step.</li>
       <li>At test time: dropout off, all 10 neurons work together.</li>
     </ul>`,
  application:
    `<p>Dropout is a simple, cheap way to reduce overfitting in image and text networks. It was a key trick in many breakthrough models and is built into every deep learning library.</p>`,
  quiz: {
    q: `With dropout rate $p = 0.2$ on a layer of 50 neurons, about how many are kept each step?`,
    a: `<p>Keep probability is $1 - 0.2 = 0.8$, so about $0.8 \\times 50 = 40$ neurons are kept each step.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-batchnorm",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 240; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var st = { x1: 2, x2: 4, x3: 6 };
    var eps = 0.00001;
    function stats() {
      var xs = [st.x1, st.x2, st.x3], mu = (xs[0] + xs[1] + xs[2]) / 3;
      var v = (Math.pow(xs[0] - mu, 2) + Math.pow(xs[1] - mu, 2) + Math.pow(xs[2] - mu, 2)) / 3;
      var sd = Math.sqrt(v + eps), nm = xs.map(function (x) { return (x - mu) / sd; });
      return { xs: xs, mu: mu, v: v, sd: sd, nm: nm };
    }
    function line(y, lo, hi, label, vals, col, markZero) {
      var c = C(), L = 70, R = 600;
      var px = function (x) { return L + (x - lo) / (hi - lo) * (R - L); };
      ctx.strokeStyle = c.border; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
      // ticks
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var t = Math.ceil(lo); t <= hi; t++) { var X = px(t); ctx.strokeStyle = c.border; ctx.beginPath(); ctx.moveTo(X, y - 4); ctx.lineTo(X, y + 4); ctx.stroke(); if (t % 2 === 0) ctx.fillText(String(t), X, y + 8); }
      if (markZero && lo <= 0 && hi >= 0) { ctx.strokeStyle = c.dim; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(px(0), y - 26); ctx.lineTo(px(0), y + 6); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = c.ink; ctx.font = "12px sans-serif"; ctx.textAlign = "start"; ctx.textBaseline = "middle"; ctx.fillText(label, 8, y);
      vals.forEach(function (x, i) { var X = px(Math.max(lo, Math.min(hi, x))); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X, y, 7, 0, 7); ctx.fill(); ctx.fillStyle = "#161c24"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), X, y); ctx.textAlign = "start"; });
    }
    function draw() {
      var c = C(); var s = stats();
      ctx.clearRect(0, 0, 640, 240);
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      ctx.fillText("before BN: spread out, mean μ = " + s.mu.toFixed(2), 8, 30);
      line(70, -10, 10, "raw x", s.xs, c.warn, false);
      ctx.fillStyle = c.dim; ctx.fillText("after BN: centered at 0, unit spread", 8, 140);
      line(180, -3, 3, "norm", s.nm, c.accent2, true);
    }
    function slider(label, key) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key];
      var inp = document.createElement("input"); inp.type = "range"; inp.min = -10; inp.max = 10; inp.step = 0.1; inp.value = st[key];
      inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key]; draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    slider("x1", "x1"); slider("x2", "x2"); slider("x3", "x3");
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    var origDraw = draw;
    draw = function () { origDraw(); var s = stats(); rd.innerHTML = "mean μ = <b>" + s.mu.toFixed(3) + "</b>, variance = <b>" + s.v.toFixed(3) + "</b><br>normalized values = [" + s.nm.map(function (x) { return x.toFixed(2); }).join(", ") + "] — centered at 0."; };
    draw();
  },
  title: "Batch normalization",
  tagline: "Rescale each layer's inputs to be tidy and centered, so training is faster and smoother.",
  prereqs: ["dl-forward-prop", "fnd-norm"],
  bigIdea:
    `<p>As data flows through layers, its scale can drift, getting too big or too small. That slows training.</p>
     <p><b>Batch normalization</b> cleans up a layer's inputs: it centers them at 0 and scales them to a steady size.</p>
     <p>Then it lets the network re-stretch and re-shift them with two learned numbers, so no information is lost.</p>`,
  buildup:
    `<p>For each mini-batch, compute the average and the spread of the values. Subtract the average and divide by the spread. Now they are centered and standardized.</p>
     <p>Two learnable numbers, $\\gamma$ and $\\beta$, then let the network choose a final scale and shift.</p>`,
  symbols: [
    { sym: "$x_i$", desc: "one input value to normalize." },
    { sym: "$\\mu_B$", desc: "the mean (average) of the values in this mini-batch (Greek 'mu')." },
    { sym: "$\\sigma_B^2$", desc: "the variance of the batch: how spread out the values are (Greek 'sigma' squared)." },
    { sym: "$\\epsilon$", desc: "a tiny number (Greek 'epsilon') added so we never divide by zero." },
    { sym: "$\\gamma, \\beta$", desc: "learned scale and shift (Greek 'gamma' and 'beta'). The network tunes them during training." }
  ],
  formula: `$$ x_i \\leftarrow \\gamma\\,\\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}} + \\beta $$`,
  whatItDoes:
    `<p>The fraction subtracts the batch mean and divides by the batch spread. That makes the values centered at 0 with a standard size.</p>
     <p>Then $\\gamma$ rescales and $\\beta$ shifts, both learned, so the layer can recover any scale it actually needs.</p>`,
  example:
    `<p>A batch of three values: $[2, 4, 6]$. Suppose $\\gamma = 1$, $\\beta = 0$, $\\epsilon \\approx 0$.</p>
     <ul class="steps">
       <li>Mean: $\\mu_B = (2 + 4 + 6)\\div 3 = 4$.</li>
       <li>Variance: average of $(2-4)^2, (4-4)^2, (6-4)^2 = (4 + 0 + 4)\\div 3 \\approx 2.67$. Spread $\\sqrt{2.67} \\approx 1.63$.</li>
       <li>Normalize each: $(2-4)/1.63 \\approx -1.23$, $(4-4)/1.63 = 0$, $(6-4)/1.63 \\approx 1.23$.</li>
       <li>New values $[-1.23, 0, 1.23]$ are centered at 0 with a tidy spread.</li>
     </ul>`,
  application:
    `<p>Batch norm lets very deep image networks train faster and more reliably. It is standard in convolutional networks like ResNet and reduces the need for careful tuning.</p>`,
  quiz: {
    q: `For the batch $[1, 3, 5]$, what is the mean $\\mu_B$?`,
    a: `<p>$\\mu_B = (1 + 3 + 5)\\div 3 = 9 \\div 3 = 3$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-early-stopping",
  demo: function (host) {
    Demos.plot(host, {
      xmin: 1, xmax: 20, ymin: 0, ymax: 1, height: 300,
      curves: [
        { f: function (e) { return 0.9 * Math.exp(-0.18 * e) + 0.05; }, label: "training loss" },
        { f: function (e) { var d = e - 8; return 0.25 + 0.012 * d * d; }, label: "validation loss" }
      ],
      drag: {
        curve: 1, start: 8, label: "epoch",
        readout: function (e, y) {
          return "epoch = <b>" + e.toFixed(1) + "</b>, validation loss = <b>" + y.toFixed(3) +
            "</b>. Validation bottoms out near epoch 8, then turns up — stop there.";
        }
      }
    });
  },
  title: "Early stopping",
  tagline: "Stop training the moment the validation error stops improving.",
  prereqs: ["dl-minibatch", "ml-regularization"],
  bigIdea:
    `<p>Train too long and the network starts memorizing the training set. That is overfitting.</p>
     <p><b>Early stopping</b> watches a separate <b>validation set</b> (data the model isn't trained on).</p>
     <p>When validation error stops getting better and starts getting worse, you stop. You keep the model from the best moment.</p>`,
  buildup:
    `<p>During training, training error keeps falling. But validation error falls, bottoms out, then rises as overfitting begins.</p>
     <p>The bottom of the validation curve is the best model. Stop there.</p>`,
  symbols: [
    { sym: "training error", desc: "the loss on the data the model learns from. It keeps dropping." },
    { sym: "validation error", desc: "the loss on held-out data the model never trains on. It tells you how well the model generalizes." },
    { sym: "patience", desc: "how many epochs of no improvement you wait before stopping, to avoid quitting on a fluke." }
  ],
  formula: `$$ \\text{stop when validation error has not improved for } k \\text{ epochs} $$`,
  whatItDoes:
    `<p>After each epoch, check the validation error. If it improved, save this model. If it gets worse for several epochs in a row, stop and keep the best saved model.</p>`,
  example:
    `<p>Validation error by epoch: $0.50, 0.40, 0.35, 0.36, 0.39, 0.45$. Patience = 2.</p>
     <ul class="steps">
       <li>It improves through epoch 3 (down to 0.35). Best model saved at epoch 3.</li>
       <li>Epoch 4 (0.36) and epoch 5 (0.39) are both worse. That is 2 epochs of no improvement.</li>
       <li>Patience hit, so stop. Keep the epoch-3 model, not the later overfit ones.</li>
     </ul>`,
  application:
    `<p>Early stopping is a free, simple guard against overfitting used everywhere. It also saves compute time by not training longer than helpful.</p>`,
  quiz: {
    q: `Why watch the validation error instead of the training error to decide when to stop?`,
    a: `<p>Training error almost always keeps falling, even when the model is memorizing. Validation error reflects real-world performance, so its rise signals overfitting.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-conv",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var img = [[3, 5, 1, 0], [2, 4, 6, 2], [1, 0, 3, 5], [7, 2, 1, 4]];
    var filt = [[1, 0], [0, 1]];   // 2x2 filter, valid conv -> 3x3 output
    // precompute full output map
    function convAt(or, oc) { var s = 0; for (var r = 0; r < 2; r++) for (var k = 0; k < 2; k++) s += img[or + r][oc + k] * filt[r][k]; return s; }
    var out = []; for (var r = 0; r < 3; r++) { out.push([]); for (var k = 0; k < 3; k++) out[r].push(convAt(r, k)); }
    var st = { pos: 0 };   // position 0..8 across 3x3 output (row-major)
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 280; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function draw() {
      var c = C();
      var or = Math.floor(st.pos / 3), oc = st.pos % 3;
      ctx.clearRect(0, 0, 640, 280);
      ctx.font = "16px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var iz = 54, ix0 = 20, iy0 = 50;
      // input grid
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.fillText("input (4×4)", ix0 + 2 * iz, iy0 - 22); ctx.font = "16px sans-serif";
      for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) {
        var inW = (i >= or && i < or + 2 && j >= oc && j < oc + 2);
        ctx.fillStyle = inW ? c.accent : c.panel; ctx.fillRect(ix0 + j * iz, iy0 + i * iz, iz - 2, iz - 2);
        ctx.fillStyle = inW ? "#ffffff" : c.ink; ctx.fillText(String(img[i][j]), ix0 + j * iz + iz / 2 - 1, iy0 + i * iz + iz / 2);
      }
      // filter swatch
      var fz = 34, fx0 = 270, fy0 = 70;
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.fillText("filter", fx0 + fz, fy0 - 18); ctx.font = "15px sans-serif";
      for (var fi = 0; fi < 2; fi++) for (var fj = 0; fj < 2; fj++) {
        ctx.fillStyle = c.warn; ctx.fillRect(fx0 + fj * fz, fy0 + fi * fz, fz - 2, fz - 2);
        ctx.fillStyle = "#161c24"; ctx.fillText(String(filt[fi][fj]), fx0 + fj * fz + fz / 2 - 1, fy0 + fi * fz + fz / 2);
      }
      ctx.fillStyle = c.dim; ctx.font = "22px sans-serif"; ctx.fillText("→", fx0 + 2 * fz + 26, fy0 + fz);
      // output grid (built up to current pos)
      var oz = 50, ox0 = 430, oy0 = 50;
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.fillText("output (3×3)", ox0 + 1.5 * oz, oy0 - 22); ctx.font = "16px sans-serif";
      for (var p = 0; p < 9; p++) {
        var pr = Math.floor(p / 3), pc = p % 3;
        var done = p <= st.pos;
        var cur = p === st.pos;
        ctx.fillStyle = cur ? c.accent2 : (done ? c.panel : "transparent"); ctx.fillRect(ox0 + pc * oz, oy0 + pr * oz, oz - 2, oz - 2);
        ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(ox0 + pc * oz, oy0 + pr * oz, oz - 2, oz - 2);
        if (done) { ctx.fillStyle = cur ? "#161c24" : c.ink; ctx.fillText(String(out[pr][pc]), ox0 + pc * oz + oz / 2 - 1, oy0 + pr * oz + oz / 2); }
      }
      ctx.textAlign = "start";
    }
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    function readout() {
      var or = Math.floor(st.pos / 3), oc = st.pos % 3, sum = 0, terms = [];
      for (var r = 0; r < 2; r++) for (var k = 0; k < 2; k++) { sum += img[or + r][oc + k] * filt[r][k]; terms.push(img[or + r][oc + k] + "·" + filt[r][k]); }
      rd.innerHTML = "filter at output (" + or + "," + oc + "): Σ(window·filter) = " + terms.join(" + ") + " = <b>" + sum + "</b>. Move the slider to slide the filter and build the feature map.";
    }
    var row = document.createElement("div"); row.style.margin = "6px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "filter position";
    var inp = document.createElement("input"); inp.type = "range"; inp.min = 0; inp.max = 8; inp.step = 1; inp.value = 0;
    inp.addEventListener("input", function () { st.pos = parseInt(inp.value, 10); draw(); readout(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row); host.appendChild(rd);
    draw(); readout();
  },
  title: "Convolutional layer",
  tagline: "A small filter slides over an image, dot-producting as it goes, to spot patterns.",
  prereqs: ["fnd-dot"],
  bigIdea:
    `<p>Images are huge. Connecting every pixel to every neuron would need too many weights.</p>
     <p>A <b>convolutional layer</b> uses a small <b>filter</b> (a tiny grid of weights) that slides across the image.</p>
     <p>At each spot, it computes a dot product between the filter and the pixels under it. The results form a <b>feature map</b> that highlights a pattern (like edges).</p>`,
  buildup:
    `<p>Take a small filter, say 3×3. Place it on the top-left of the image. Multiply matching numbers, add them up: one dot product, one output number.</p>
     <p>Slide the filter one step right and repeat. Cover the whole image. The collected outputs are the feature map.</p>`,
  symbols: [
    { sym: "filter (kernel)", desc: "a small grid of weights, e.g. 3×3, that detects one kind of pattern." },
    { sym: "feature map", desc: "the grid of outputs after sliding the filter over the whole image." },
    { sym: "$\\odot$", desc: "element-wise multiply: multiply each filter number by the pixel under it." },
    { sym: "sum", desc: "add up all those products to get one output number for that position." }
  ],
  formula: `$$ \\text{output}(i,j) = \\sum \\big(\\text{filter} \\odot \\text{patch at } (i,j)\\big) $$`,
  whatItDoes:
    `<p>At each position, line the filter up over a patch of the image, multiply each pair, and sum. That single number measures how strongly the filter's pattern appears there.</p>
     <p>Slide everywhere to build the full feature map. The same filter weights are reused at every position, so it learns far fewer weights than a full layer.</p>`,
  example:
    `<p>Tiny 2×2 filter $\\begin{bmatrix}1 & 0\\\\0 & 1\\end{bmatrix}$ over an image patch $\\begin{bmatrix}3 & 5\\\\2 & 4\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>Multiply matching cells: $1\\times3 = 3$, $0\\times5 = 0$, $0\\times2 = 0$, $1\\times4 = 4$.</li>
       <li>Add them up: $3 + 0 + 0 + 4 = 7$.</li>
       <li>So this position of the feature map is $7$. Slide the filter and repeat for the next patch.</li>
     </ul>`,
  application:
    `<p>Convolutional layers are the heart of image recognition: detecting faces, reading handwriting, spotting tumors in medical scans, and seeing the road for self-driving cars.</p>`,
  quiz: {
    q: `Filter $\\begin{bmatrix}1 & 1\\\\0 & 0\\end{bmatrix}$ over patch $\\begin{bmatrix}2 & 3\\\\5 & 1\\end{bmatrix}$. What is the output?`,
    a: `<p>$1\\times2 + 1\\times3 + 0\\times5 + 0\\times1 = 2 + 3 + 0 + 0 = 5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-pooling",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var img = [[1, 7, 8, 3], [3, 2, 1, 0], [4, 6, 9, 2], [5, 0, 1, 4]];
    var tint = ["#1f6feb", "#2ea043", "#bb8009", "#8957e5"];
    function region(ri) { var r0 = ri >= 2 ? 2 : 0, k0 = (ri % 2 === 1) ? 2 : 0, v = []; for (var r = r0; r < r0 + 2; r++) for (var k = k0; k < k0 + 2; k++) v.push(img[r][k]); return v; }
    var st = { mode: 0 };  // 0 = max, 1 = avg
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 280; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function pooled(ri) { var v = region(ri); return st.mode === 0 ? Math.max(v[0], v[1], v[2], v[3]) : (v[0] + v[1] + v[2] + v[3]) / 4; }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, 640, 280);
      ctx.font = "16px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var iz = 54, ix0 = 20, iy0 = 50;
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.fillText("feature map (4×4)", ix0 + 2 * iz, iy0 - 22); ctx.font = "16px sans-serif";
      for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) {
        var ri = (i < 2 ? 0 : 2) + (j < 2 ? 0 : 1);
        ctx.fillStyle = tint[ri]; ctx.fillRect(ix0 + j * iz, iy0 + i * iz, iz - 2, iz - 2);
        ctx.fillStyle = "#ffffff"; ctx.fillText(String(img[i][j]), ix0 + j * iz + iz / 2 - 1, iy0 + i * iz + iz / 2);
      }
      // outline each 2x2 region thickly
      ctx.lineWidth = 3; ctx.strokeStyle = c.ink;
      for (var rr = 0; rr < 2; rr++) for (var cc = 0; cc < 2; cc++) ctx.strokeRect(ix0 + cc * 2 * iz, iy0 + rr * 2 * iz, 2 * iz - 2, 2 * iz - 2);
      ctx.lineWidth = 1;
      ctx.fillStyle = c.dim; ctx.font = "22px sans-serif"; ctx.fillText("→", ix0 + 4 * iz + 26, iy0 + 2 * iz);
      // pooled 2x2 output
      var oz = 60, ox0 = 470, oy0 = 70;
      ctx.fillStyle = c.dim; ctx.font = "13px sans-serif"; ctx.fillText((st.mode === 0 ? "max" : "avg") + " pool (2×2)", ox0 + oz, oy0 - 18); ctx.font = "17px sans-serif";
      for (var ro = 0; ro < 2; ro++) for (var co = 0; co < 2; co++) {
        var rii = ro * 2 + co;
        ctx.fillStyle = tint[rii]; ctx.fillRect(ox0 + co * oz, oy0 + ro * oz, oz - 2, oz - 2);
        var pv = pooled(rii);
        ctx.fillStyle = "#ffffff"; ctx.fillText(st.mode === 0 ? String(pv) : pv.toFixed(2), ox0 + co * oz + oz / 2 - 1, oy0 + ro * oz + oz / 2);
      }
      ctx.textAlign = "start";
    }
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    function readout() {
      var names = ["top-left", "top-right", "bottom-left", "bottom-right"], lines = ["Each outlined 2×2 region → one number (" + (st.mode === 0 ? "max" : "average") + "):"];
      for (var ri = 0; ri < 4; ri++) { var v = region(ri); lines.push(names[ri] + " [" + v.join(", ") + "] → <b>" + (st.mode === 0 ? String(Math.max(v[0], v[1], v[2], v[3])) : ((v[0] + v[1] + v[2] + v[3]) / 4).toFixed(2)) + "</b>"); }
      rd.innerHTML = lines.join("<br>");
    }
    var btn = document.createElement("button"); btn.textContent = "switch to average pool";
    btn.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin:8px 0";
    btn.addEventListener("click", function () { st.mode = st.mode === 0 ? 1 : 0; btn.textContent = st.mode === 0 ? "switch to average pool" : "switch to max pool"; draw(); readout(); });
    host.appendChild(btn); host.appendChild(rd);
    draw(); readout();
  },
  title: "Pooling (max / average)",
  tagline: "Shrink the feature map by summarizing each little region with one number.",
  prereqs: ["dl-conv"],
  bigIdea:
    `<p>Feature maps can be large. <b>Pooling</b> shrinks them to keep the important signal and cut the size.</p>
     <p><b>Max pooling</b> takes the biggest number in each small region. <b>Average pooling</b> takes the average.</p>
     <p>Smaller maps mean less computation and a model that cares about <i>whether</i> a feature appeared, not its exact pixel.</p>`,
  buildup:
    `<p>Slide a small window (say 2×2) over the feature map, in non-overlapping steps.</p>
     <p>For each window, replace its 4 numbers with one summary number: the max, or the average.</p>`,
  symbols: [
    { sym: "window", desc: "the small region pooled at once, e.g. 2×2." },
    { sym: "max pooling", desc: "keep only the largest value in each window (the strongest signal)." },
    { sym: "average pooling", desc: "keep the mean of the values in each window." },
    { sym: "downsample", desc: "make the map smaller, e.g. a 4×4 map becomes 2×2 with a 2×2 pool." }
  ],
  formula: `$$ \\text{max pool: output} = \\max(\\text{values in window}) $$`,
  whatItDoes:
    `<p>Cover the feature map with non-overlapping windows. From each window, output a single number (the max, or the average).</p>
     <p>A 2×2 pool turns each 2×2 block into one value, cutting both width and height in half.</p>`,
  example:
    `<p>Max-pool this 2×2 window: $\\begin{bmatrix}1 & 7\\\\3 & 2\\end{bmatrix}$.</p>
     <ul class="steps">
       <li>The four values are $1, 7, 3, 2$.</li>
       <li>Max pooling keeps the biggest: $\\max(1, 7, 3, 2) = 7$.</li>
       <li>Average pooling instead would give $(1 + 7 + 3 + 2)\\div 4 = 13 \\div 4 = 3.25$.</li>
     </ul>
     <p>The whole 2×2 block becomes a single number, shrinking the map.</p>`,
  application:
    `<p>Pooling is in nearly every image network. It makes recognition robust to small shifts: a cat slightly off-center still triggers the same strong features.</p>`,
  quiz: {
    q: `Max-pool the window $\\begin{bmatrix}4 & 1\\\\6 & 5\\end{bmatrix}$.`,
    a: `<p>$\\max(4, 1, 6, 5) = 6$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-conv-hyperparams",
  demo: function (host) {
    // Draw a padded grid. Padding ring (P) around an I×I input, with an F×F
    // filter window shaded over the top-left valid position.
    var GMAX = 16;   // fixed canvas size; covers I + 2P up to 16
    Demos.grid(host, {
      rows: GMAX, cols: GMAX, cellSize: 28,
      controls: [
        { key: "I", label: "I (input size)", min: 1, max: 10, val: 7, step: 1 },
        { key: "F", label: "F (filter size)", min: 1, max: 7, val: 3, step: 1 },
        { key: "P", label: "P (padding)", min: 0, max: 3, val: 0, step: 1 },
        { key: "S", label: "S (stride)", min: 1, max: 4, val: 1, step: 1 }
      ],
      cell: function (r, k, s) {
        var span = s.I + 2 * s.P;            // padded input extent
        if (r >= span || k >= span) return { color: "transparent" };
        var inPad = (r < s.P || k < s.P || r >= s.P + s.I || k >= s.P + s.I);
        var inFilter = (r < s.F && k < s.F); // F×F window at top-left
        if (inFilter) return { color: "#1f6feb", text: "#ffffff", label: "" };
        if (inPad) return { color: "#30363d", label: "0" };
        return { color: "#161c24", label: "" };
      },
      readout: function (s) {
        var O = Math.floor((s.I - s.F + 2 * s.P) / s.S) + 1;
        var note = (s.F > s.I + 2 * s.P) ? " (filter bigger than padded input — no valid position)" : "";
        return "Gray ring = padding (P), blue = the F×F filter window over the top-left.<br>" +
          "O = floor((I − F + 2P) / S) + 1 = floor((" + s.I + " − " + s.F + " + 2·" + s.P +
          ") / " + s.S + ") + 1 = <b>" + O + "</b> output size." + note;
      }
    });
  },
  title: "Filter hyperparameters & output size",
  tagline: "Filter size, stride, and padding decide how big the output map turns out.",
  prereqs: ["dl-conv"],
  bigIdea:
    `<p>Three settings control a convolution: the filter size, the stride, and the padding.</p>
     <p><b>Filter size $F$</b> is how wide the filter is. <b>Stride $S$</b> is how many pixels it jumps each slide. <b>Padding $P$</b> is extra zeros added around the edge.</p>
     <p>Together they decide the output map's size, given by a simple formula.</p>`,
  buildup:
    `<p>A bigger stride means fewer steps, so a smaller output. Padding adds a border so edge pixels get covered properly.</p>
     <p>The output size formula combines all three with the input size.</p>`,
  symbols: [
    { sym: "$I$", desc: "the input size (width or height of the image)." },
    { sym: "$F$", desc: "the filter size (e.g. 3 for a 3×3 filter)." },
    { sym: "$P$", desc: "the padding: zeros added on each side." },
    { sym: "$S$", desc: "the stride: how far the filter moves each step." },
    { sym: "$O$", desc: "the output size: width (or height) of the resulting feature map." }
  ],
  formula: `$$ O = \\frac{I - F + 2P}{S} + 1 $$`,
  whatItDoes:
    `<p>Read it as: start with the input size, subtract the filter size, add padding on both sides ($2P$), divide by the stride, then add 1.</p>
     <p>The result is how many positions the filter fits, which is the output width.</p>`,
  example:
    `<p>Input $I = 7$, filter $F = 3$, padding $P = 0$, stride $S = 1$.</p>
     <ul class="steps">
       <li>Plug in: $O = \\frac{7 - 3 + 2\\times0}{1} + 1$.</li>
       <li>Top: $7 - 3 + 0 = 4$. Divide by stride 1: $4$. Add 1: $O = 5$.</li>
       <li>So a 7×7 image with a 3×3 filter gives a 5×5 output.</li>
       <li>Now try stride $S = 2$: $\\frac{7-3+0}{2}+1 = \\frac{4}{2}+1 = 2+1 = 3$. A bigger stride shrinks the output to 3×3.</li>
     </ul>`,
  application:
    `<p>Designers use this formula to plan network shapes: how much each layer shrinks the image, and whether to pad to keep the size the same. It is everyday work in building CNNs.</p>`,
  quiz: {
    q: `Input $I = 5$, filter $F = 3$, padding $P = 1$, stride $S = 1$. What is the output size $O$?`,
    a: `<p>$O = \\frac{5 - 3 + 2\\times1}{1} + 1 = \\frac{5 - 3 + 2}{1} + 1 = 4 + 1 = 5$. The padding kept the size the same.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-cnn-params",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "F", label: "F (filter size)", min: 1, max: 11, val: 3, step: 1 },
        { key: "C", label: "C (input channels)", min: 1, max: 512, val: 3, step: 1 },
        { key: "K", label: "K (number of filters)", min: 1, max: 512, val: 10, step: 1 }
      ],
      compute: function (s) {
        var params = (s.F * s.F * s.C + 1) * s.K;
        return { text: "params = (F·F·C + 1)·K = (" + s.F + "·" + s.F + "·" + s.C +
          " + 1)·" + s.K + " = (" + (s.F * s.F * s.C) + " + 1)·" + s.K +
          " = <b>" + params + "</b>" };
      }
    });
  },
  title: "Counting CNN parameters",
  tagline: "How many weights a convolutional layer holds, and what a neuron can 'see'.",
  prereqs: ["dl-conv", "dl-conv-hyperparams"],
  bigIdea:
    `<p>A convolutional layer learns the numbers inside its filters. Counting them tells you the layer's size.</p>
     <p>Each filter is $F\\times F$ wide and goes through all $C$ input channels (like red, green, blue). Plus one bias each.</p>
     <p>The <b>receptive field</b> is the patch of the original image that one output number depends on. Deeper layers see bigger patches.</p>`,
  buildup:
    `<p>One filter has $F \\times F \\times C$ weights, plus 1 bias. If the layer has $K$ filters, multiply by $K$.</p>
     <p>Note: the count does not depend on the image size, because the same filter is reused everywhere.</p>`,
  symbols: [
    { sym: "$F$", desc: "filter width and height (e.g. 3 for 3×3)." },
    { sym: "$C$", desc: "number of input channels (e.g. 3 for a color image)." },
    { sym: "$K$", desc: "number of filters in the layer (each makes one feature map)." },
    { sym: "$+1$", desc: "the bias: one extra number per filter." },
    { sym: "receptive field", desc: "the region of the input that one output value is influenced by." }
  ],
  formula: `$$ \\text{params} = (F \\cdot F \\cdot C + 1)\\cdot K $$`,
  whatItDoes:
    `<p>Inside the parentheses: count the weights in one filter ($F \\times F \\times C$), then add 1 for its bias.</p>
     <p>Multiply by $K$ for all the filters. That total is how many numbers the layer learns.</p>`,
  example:
    `<p>A layer with $K = 10$ filters, each $F = 3$ (so 3×3), over a color image with $C = 3$ channels.</p>
     <ul class="steps">
       <li>Weights in one filter: $3 \\times 3 \\times 3 = 27$.</li>
       <li>Add the bias: $27 + 1 = 28$ numbers per filter.</li>
       <li>For all 10 filters: $28 \\times 10 = 280$ parameters.</li>
     </ul>
     <p>Only 280 numbers, no matter if the image is 32×32 or 1000×1000. That reuse is why CNNs are efficient.</p>`,
  application:
    `<p>Parameter counts tell engineers how big and how memory-hungry a model is. Knowing them helps fit networks on phones and edge devices.</p>`,
  quiz: {
    q: `A layer has $K = 5$ filters of size $F = 2$ over $C = 1$ channel (grayscale). How many parameters?`,
    a: `<p>$(2\\times2\\times1 + 1)\\times5 = (4 + 1)\\times5 = 5 \\times 5 = 25$ parameters.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-object-detection",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    // Box A fixed (true), Box B (predicted) moves. Coordinates in canvas px.
    var SC = 32, ox = 120, oy = 30; // grid scale: 1 unit = 32px
    var A = { x: 1, y: 1, w: 5, h: 5 };   // true box (in grid units)
    var st = { bx: 3, by: 3 };            // predicted box top-left; size 5x4
    var Bw = 5, Bh = 4;
    function rect(b) { return { x1: b.x, y1: b.y, x2: b.x + b.w, y2: b.y + b.h }; }
    function metrics() {
      var a = rect(A), b = rect({ x: st.bx, y: st.by, w: Bw, h: Bh });
      var ix = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1));
      var iy = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
      var inter = ix * iy, areaA = A.w * A.h, areaB = Bw * Bh, union = areaA + areaB - inter;
      return { inter: inter, areaA: areaA, areaB: areaB, union: union, iou: union > 0 ? inter / union : 0 };
    }
    function draw() {
      var c = C(); var m = metrics();
      ctx.clearRect(0, 0, 640, 300);
      // grid backdrop
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      for (var gx = 0; gx <= 12; gx++) { ctx.beginPath(); ctx.moveTo(ox + gx * SC, oy); ctx.lineTo(ox + gx * SC, oy + 8 * SC); ctx.stroke(); }
      for (var gy = 0; gy <= 8; gy++) { ctx.beginPath(); ctx.moveTo(ox, oy + gy * SC); ctx.lineTo(ox + 12 * SC, oy + gy * SC); ctx.stroke(); }
      // intersection fill
      var a = rect(A), b = rect({ x: st.bx, y: st.by, w: Bw, h: Bh });
      var ix1 = Math.max(a.x1, b.x1), iy1 = Math.max(a.y1, b.y1), ix2 = Math.min(a.x2, b.x2), iy2 = Math.min(a.y2, b.y2);
      if (ix2 > ix1 && iy2 > iy1) { ctx.fillStyle = c.warn; ctx.globalAlpha = 0.45; ctx.fillRect(ox + ix1 * SC, oy + iy1 * SC, (ix2 - ix1) * SC, (iy2 - iy1) * SC); ctx.globalAlpha = 1; }
      // box A (true)
      ctx.strokeStyle = c.accent2; ctx.lineWidth = 3; ctx.strokeRect(ox + A.x * SC, oy + A.y * SC, A.w * SC, A.h * SC);
      ctx.fillStyle = c.accent2; ctx.font = "13px sans-serif"; ctx.fillText("A: true box", ox + A.x * SC + 4, oy + A.y * SC - 6);
      // box B (predicted)
      ctx.strokeStyle = c.accent; ctx.lineWidth = 3; ctx.strokeRect(ox + st.bx * SC, oy + st.by * SC, Bw * SC, Bh * SC);
      ctx.fillStyle = c.accent; ctx.fillText("B: predicted", ox + st.bx * SC + 4, oy + (st.by + Bh) * SC + 16);
      // IoU readout on canvas
      ctx.fillStyle = c.ink; ctx.font = "15px sans-serif"; ctx.fillText("IoU = " + m.iou.toFixed(3), 16, 40);
      ctx.fillStyle = c.warn; ctx.font = "12px sans-serif"; ctx.fillText("overlap = " + m.inter, 16, 64);
    }
    function slider(label, key, min, max, step) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key];
      var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
      inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key]; draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    slider("predicted box x", "bx", 0, 7, 1);
    slider("predicted box y", "by", 0, 4, 1);
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    var origDraw = draw;
    draw = function () { origDraw(); var m = metrics(); rd.innerHTML = "intersection = <b>" + m.inter + "</b><br>union = A + B − intersection = " + m.areaA + " + " + m.areaB + " − " + m.inter + " = <b>" + m.union + "</b><br>IoU = intersection / union = <b>" + m.iou.toFixed(3) + "</b>" + (m.iou >= 0.5 ? " (good match)" : " (poor match)"); };
    draw();
  },
  title: "Object detection (IoU, YOLO)",
  tagline: "Not just 'is there a cat?' but 'where is it?' — draw a box and score how well it fits.",
  prereqs: ["dl-conv", "dl-pooling"],
  bigIdea:
    `<p>Classification asks "what is in the image?". <b>Object detection</b> also asks "where?", drawing a <b>bounding box</b> around each object.</p>
     <p>To score a predicted box against the true box, we use <b>Intersection-over-Union (IoU)</b>: how much they overlap.</p>
     <p><b>YOLO</b> ("You Only Look Once") splits the image into a grid and predicts boxes for each cell in one fast pass.</p>`,
  buildup:
    `<p>IoU compares two boxes. The <b>intersection</b> is the area where they overlap. The <b>union</b> is the total area they cover together.</p>
     <p>Divide overlap by union. A perfect match gives 1; no overlap gives 0.</p>`,
  symbols: [
    { sym: "bounding box", desc: "a rectangle drawn around an object." },
    { sym: "intersection", desc: "the overlapping area shared by two boxes." },
    { sym: "union", desc: "the total area covered by either box (overlap counted once)." },
    { sym: "IoU", desc: "intersection divided by union: a 0-to-1 overlap score." },
    { sym: "non-max suppression", desc: "if several boxes cover the same object, keep the best one and remove the rest." }
  ],
  formula: `$$ \\text{IoU} = \\frac{\\text{area of overlap}}{\\text{area of union}} $$`,
  whatItDoes:
    `<p>Compute the overlapping area of the two boxes (the intersection) and the combined area (the union). Divide them.</p>
     <p>A high IoU (say above 0.5) means the prediction sits well on the true object. Non-max suppression then cleans up duplicate boxes.</p>`,
  example:
    `<p>Two boxes overlap. Overlap area $= 20$. Box A area $= 40$, Box B area $= 30$.</p>
     <ul class="steps">
       <li>Union = area A + area B − overlap (so the shared part isn't counted twice): $40 + 30 - 20 = 50$.</li>
       <li>IoU = overlap ÷ union = $20 \\div 50 = 0.4$.</li>
       <li>0.4 is below 0.5, so this would usually count as a poor match.</li>
     </ul>`,
  application:
    `<p>Object detection powers self-driving cars (spotting pedestrians and signs), security cameras, and photo apps that tag the people and pets in your pictures.</p>`,
  quiz: {
    q: `Overlap area is 10. Box A is 25, Box B is 25, sharing the 10 overlap. Find the IoU.`,
    a: `<p>Union $= 25 + 25 - 10 = 40$. IoU $= 10 \\div 40 = 0.25$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-face-recognition",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "dap", label: "d(A,P) anchor-positive", min: 0, max: 2, val: 0.3, step: 0.05 },
        { key: "dan", label: "d(A,N) anchor-negative", min: 0, max: 2, val: 0.5, step: 0.05 },
        { key: "alpha", label: "α (margin)", min: 0, max: 1, val: 0.2, step: 0.05 }
      ],
      compute: function (s) {
        var inside = s.dap - s.dan + s.alpha;
        var loss = Math.max(0, inside);
        return { text: "inside = d(A,P) − d(A,N) + α = " + s.dap.toFixed(2) + " − " +
          s.dan.toFixed(2) + " + " + s.alpha.toFixed(2) + " = " + inside.toFixed(3) +
          "<br>triplet loss = max(0, inside) = <b>" + loss.toFixed(3) + "</b>" };
      }
    });
  },
  title: "Face verification & triplet loss",
  tagline: "Learn an encoding where the same person's faces sit close and different people sit far.",
  prereqs: ["dl-forward-prop", "fnd-norm"],
  bigIdea:
    `<p><b>Face recognition</b> turns a face photo into a list of numbers called an <b>encoding</b>.</p>
     <p>Two photos of the <i>same</i> person should get encodings that are close together. Two <i>different</i> people should be far apart.</p>
     <p>A <b>Siamese network</b> learns this using <b>triplet loss</b>: it studies three photos at once.</p>`,
  buildup:
    `<p>A triplet is three images: the <b>Anchor</b> (a reference face), a <b>Positive</b> (same person), and a <b>Negative</b> (different person).</p>
     <p>We want the anchor close to the positive and far from the negative. $d(\\cdot,\\cdot)$ measures distance between encodings.</p>`,
  symbols: [
    { sym: "$A, P, N$", desc: "Anchor, Positive (same person), Negative (different person)." },
    { sym: "$d(A, P)$", desc: "the distance between the anchor and positive encodings. We want this small." },
    { sym: "$d(A, N)$", desc: "the distance between the anchor and negative encodings. We want this large." },
    { sym: "$\\alpha$", desc: "the margin (Greek 'alpha'): how much farther the negative must be than the positive." },
    { sym: "$\\max(\\cdot, 0)$", desc: "keep the value if positive, otherwise 0. No loss once the margin is met." }
  ],
  formula: `$$ \\ell(A, P, N) = \\max\\big(\\, d(A,P) - d(A,N) + \\alpha,\\; 0 \\,\\big) $$`,
  whatItDoes:
    `<p>The loss wants $d(A,P)$ small and $d(A,N)$ large. If the negative is already farther than the positive by at least the margin $\\alpha$, the inside is negative and the $\\max$ makes the loss 0 (nothing to fix).</p>
     <p>Otherwise the loss is positive, and training pulls the same person closer and pushes the different person away.</p>`,
  example:
    `<p>Suppose $d(A, P) = 0.3$, $d(A, N) = 0.5$, margin $\\alpha = 0.2$.</p>
     <ul class="steps">
       <li>Inside the max: $0.3 - 0.5 + 0.2 = 0$.</li>
       <li>Loss $= \\max(0, 0) = 0$. The negative is exactly far enough, so no penalty.</li>
       <li>Now suppose $d(A, N) = 0.4$: inside $= 0.3 - 0.4 + 0.2 = 0.1$, loss $= 0.1$. Training pushes them apart.</li>
     </ul>`,
  application:
    `<p>This powers phone face-unlock and photo apps that group pictures by person. It works from just one example per person, since it compares encodings rather than memorizing faces.</p>`,
  quiz: {
    q: `$d(A,P) = 0.2$, $d(A,N) = 0.9$, $\\alpha = 0.3$. What is the triplet loss?`,
    a: `<p>Inside: $0.2 - 0.9 + 0.3 = -0.4$. Loss $= \\max(-0.4, 0) = 0$. The negative is far enough, so no loss.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-style-transfer",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "alpha", label: "α (content weight)", min: 0, max: 10, val: 1, step: 0.5 },
        { key: "beta", label: "β (style weight)", min: 0, max: 100, val: 40, step: 1 },
        { key: "Jc", label: "content cost Jc", min: 0, max: 10, val: 3, step: 0.5 },
        { key: "Js", label: "style cost Js", min: 0, max: 10, val: 2, step: 0.5 }
      ],
      compute: function (s) {
        var J = s.alpha * s.Jc + s.beta * s.Js;
        return { text: "J = α·Jc + β·Js = " + s.alpha.toFixed(1) + "·" + s.Jc.toFixed(1) +
          " + " + s.beta.toFixed(0) + "·" + s.Js.toFixed(1) + " = <b>" + J.toFixed(2) +
          "</b>. Raise β for a more painterly look." };
      }
    });
  },
  title: "Neural style transfer",
  tagline: "Keep a photo's content but repaint it in another image's artistic style.",
  prereqs: ["dl-conv"],
  bigIdea:
    `<p><b>Neural style transfer</b> mixes two images: the <b>content</b> of a photo and the <b>style</b> of a painting.</p>
     <p>The result keeps <i>what</i> is in your photo but paints it in the brushstrokes and colors of the artwork.</p>
     <p>It works by minimizing two costs at once: a content cost and a style cost.</p>`,
  buildup:
    `<p>A trained CNN's feature maps capture content. The <b>style</b> is captured by how feature maps correlate with each other, summarized in a <b>Gram matrix</b>.</p>
     <p>We start from a blank or noisy image and tweak its pixels to lower both costs.</p>`,
  symbols: [
    { sym: "content cost", desc: "how different the generated image's features are from the photo's. Keeps the subject." },
    { sym: "style cost", desc: "how different the generated image's feature correlations are from the painting's. Keeps the look." },
    { sym: "Gram matrix", desc: "a table of how strongly pairs of features fire together; it captures texture and style, not layout." },
    { sym: "total cost", desc: "content cost plus style cost, balanced by weights." }
  ],
  formula: `$$ \\text{total cost} = (\\text{content cost}) + (\\text{style cost}) $$`,
  whatItDoes:
    `<p>The content cost says "look like the photo's subject". The style cost says "use the painting's textures and colors".</p>
     <p>We adjust the generated image's pixels to drive both down. The balance between them controls how stylized the result is.</p>`,
  example:
    `<p>Take a photo of your street and the style of Van Gogh's Starry Night.</p>
     <ul class="steps">
       <li>Content cost keeps the buildings and road where they are.</li>
       <li>Style cost adds swirling brushstrokes and bold blues and yellows.</li>
       <li>Lower both at once: your street, repainted as if Van Gogh made it.</li>
     </ul>
     <p>Weight the style cost higher for a more painterly look, or the content cost higher to stay closer to the photo.</p>`,
  application:
    `<p>This is the magic behind art-filter apps that turn your selfies into paintings. It also helps artists and designers prototype looks quickly.</p>`,
  quiz: {
    q: `What does the Gram matrix capture that the raw feature map does not?`,
    a: `<p>It captures how features correlate (fire together) — the texture and style — rather than the exact spatial layout of the content.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-gan",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "D", label: "D(x) on a fake", min: 0.01, max: 0.99, val: 0.5, step: 0.01 }
      ],
      compute: function (s) {
        var dLoss = -Math.log(1 - s.D);
        var gLoss = -Math.log(s.D);
        var note = Math.abs(s.D - 0.5) < 0.03 ? " D ≈ 0.5: at equilibrium the discriminator is fooled." : "";
        return { text: "discriminator output on fake D(x) = " + s.D.toFixed(2) +
          "<br>discriminator loss = −log(1 − D) = <b>" + dLoss.toFixed(3) + "</b>" +
          "<br>generator loss = −log(D) = <b>" + gLoss.toFixed(3) + "</b>" + note };
      }
    });
  },
  title: "GANs (generator vs discriminator)",
  tagline: "A forger and a detective compete; the forger gets so good its fakes look real.",
  prereqs: ["dl-forward-prop", "dl-backprop"],
  bigIdea:
    `<p>A <b>GAN</b> (Generative Adversarial Network) makes new, realistic data, like fake photos of people who don't exist.</p>
     <p>It has two networks playing a game. The <b>generator</b> is a forger making fakes. The <b>discriminator</b> is a detective judging real vs fake.</p>
     <p>They train against each other. As the detective improves, the forger must improve too, until the fakes look real.</p>`,
  buildup:
    `<p>The generator turns random noise into a fake image. The discriminator looks at an image and guesses "real" or "fake".</p>
     <p>The generator wins when it fools the discriminator. The discriminator wins when it catches the fake. Each one's success pushes the other to get better.</p>`,
  symbols: [
    { sym: "generator", desc: "takes random noise and produces a fake sample. The forger." },
    { sym: "discriminator", desc: "judges whether a sample is real or fake. The detective." },
    { sym: "real vs fake", desc: "the discriminator's two labels: 1 for real data, 0 for the generator's fake." },
    { sym: "adversarial", desc: "the two networks compete; one's gain is the other's loss." }
  ],
  formula: `$$ \\text{generator tries to fool the discriminator}; \\quad \\text{discriminator tries to catch the fakes} $$`,
  whatItDoes:
    `<p>Each round, the generator makes fakes and the discriminator scores a mix of real and fake. Both update: the detective gets sharper, the forger gets sneakier.</p>
     <p>At balance, the generator's fakes are so good the discriminator can only guess (about 50/50).</p>`,
  example:
    `<p>Training a GAN to make fake handwritten digits.</p>
     <ul class="steps">
       <li>Early on: the generator makes blurry blobs. The discriminator easily labels them fake.</li>
       <li>The generator learns from being caught and makes sharper digits.</li>
       <li>The discriminator adapts, getting pickier. Back and forth.</li>
       <li>Eventually the fakes look like real digits, and the discriminator is fooled about half the time.</li>
     </ul>`,
  application:
    `<p>GANs create realistic faces, art, and game textures, fill in missing parts of photos, and upscale low-resolution images. They also drive the "deepfake" technology.</p>`,
  quiz: {
    q: `In a GAN, what is the generator's goal?`,
    a: `<p>To produce fakes realistic enough to fool the discriminator into labeling them as real.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-rnn",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var st = { Waa: 0.5, Wax: 1, b: 0, x1: 2, x2: 1, x3: -1 };
    function step(aPrev, x) { return Math.tanh(st.Waa * aPrev + st.Wax * x + st.b); }
    function draw() {
      var c = C();
      var xs = [st.x1, st.x2, st.x3];
      var a = [0]; for (var t = 0; t < 3; t++) a.push(step(a[t], xs[t]));
      ctx.clearRect(0, 0, 640, 300);
      ctx.font = "13px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var cx = [130, 320, 510], cy = 150, r = 36;
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("aₜ = tanh(Waa·aₜ₋₁ + Wax·xₜ + b)", 320, 30);
      // hidden-state arrows between cells (left->right)
      ctx.strokeStyle = c.purple; ctx.fillStyle = c.purple; ctx.lineWidth = 2.5;
      // a0 -> cell1
      function harrow(x1, x2, lbl) {
        ctx.beginPath(); ctx.moveTo(x1, cy); ctx.lineTo(x2, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, cy); ctx.lineTo(x2 - 9, cy - 5); ctx.lineTo(x2 - 9, cy + 5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = c.purple; ctx.font = "11px sans-serif"; ctx.fillText(lbl, (x1 + x2) / 2, cy - 12); ctx.fillStyle = c.purple;
      }
      harrow(40, cx[0] - r, "a0=0.00");
      harrow(cx[0] + r, cx[1] - r, "a1=" + a[1].toFixed(2));
      harrow(cx[1] + r, cx[2] - r, "a2=" + a[2].toFixed(2));
      ctx.strokeStyle = c.purple; ctx.beginPath(); ctx.moveTo(cx[2] + r, cy); ctx.lineTo(cx[2] + r + 50, cy); ctx.stroke();
      ctx.fillStyle = c.purple; ctx.font = "11px sans-serif"; ctx.fillText("a3=" + a[3].toFixed(2), cx[2] + r + 25, cy - 12);
      for (var i = 0; i < 3; i++) {
        // cell box
        ctx.beginPath(); ctx.arc(cx[i], cy, r, 0, 7); ctx.fillStyle = c.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = c.accent; ctx.stroke();
        ctx.fillStyle = c.ink; ctx.font = "12px sans-serif"; ctx.fillText("tanh", cx[i], cy - 8); ctx.fillText("a=" + a[i + 1].toFixed(2), cx[i], cy + 10);
        // input below
        ctx.strokeStyle = c.accent2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx[i], cy + 70); ctx.lineTo(cx[i], cy + r); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx[i], cy + 90, 20, 0, 7); ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = c.accent2; ctx.stroke();
        ctx.fillStyle = c.ink; ctx.fillText("x" + (i + 1) + "=" + xs[i].toFixed(1), cx[i], cy + 90);
        ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.fillText("t=" + (i + 1), cx[i], cy - r - 14);
      }
      ctx.textAlign = "start";
    }
    function slider(label, key, min, max, step) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key];
      var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
      inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key]; draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    slider("Waa (memory weight)", "Waa", -2, 2, 0.1);
    slider("Wax (input weight)", "Wax", -2, 2, 0.1);
    slider("x1", "x1", -3, 3, 0.1); slider("x2", "x2", -3, 3, 0.1); slider("x3", "x3", -3, 3, 0.1);
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    var origDraw = draw;
    draw = function () { origDraw(); var a = [0], xs = [st.x1, st.x2, st.x3]; for (var t = 0; t < 3; t++) a.push(step(a[t], xs[t])); rd.innerHTML = "a1 = tanh(" + st.Waa.toFixed(1) + "·0 + " + st.Wax.toFixed(1) + "·" + st.x1.toFixed(1) + ") = <b>" + a[1].toFixed(3) + "</b><br>The hidden state (purple) carries from each step into the next."; };
    draw();
  },
  title: "Recurrent neural networks (RNNs)",
  tagline: "Read a sequence one step at a time, carrying a memory of what came before.",
  prereqs: ["dl-forward-prop"],
  bigIdea:
    `<p>Some data is a <b>sequence</b>: words in a sentence, prices over days, sounds in speech. Order matters.</p>
     <p>A <b>recurrent neural network (RNN)</b> reads it one step at a time and keeps a <b>memory</b> of what it has seen.</p>
     <p>That memory, the <b>hidden state</b>, is updated at each step and passed along to the next.</p>`,
  buildup:
    `<p>At step $t$, the RNN takes the new input $x^{<t>}$ and the previous memory $a^{<t-1>}$, and blends them into a new memory $a^{<t>}$.</p>
     <p>The little $<t>$ marks the time step. The blend uses weights and an activation, just like before.</p>`,
  symbols: [
    { sym: "$x^{<t>}$", desc: "the input at time step $t$ (e.g. the $t$-th word)." },
    { sym: "$a^{<t>}$", desc: "the hidden state (memory) at step $t$." },
    { sym: "$a^{<t-1>}$", desc: "the hidden state from the previous step." },
    { sym: "$W_{aa}, W_{ax}, b_a$", desc: "weights on the old memory, weights on the new input, and a bias." },
    { sym: "$g$", desc: "an activation function, usually tanh." }
  ],
  formula: `$$ a^{<t>} = g\\big(W_{aa}\\,a^{<t-1>} + W_{ax}\\,x^{<t>} + b_a\\big) $$`,
  whatItDoes:
    `<p>Combine the old memory and the new input, each through their own weights, add a bias, and squish with $g$.</p>
     <p>The result is the new memory, which feeds into the next step. So information flows along the sequence.</p>`,
  example:
    `<p>Tiny RNN. Weights $W_{aa} = 0.5$, $W_{ax} = 1$, $b_a = 0$, activation tanh. Start memory $a^{<0>} = 0$. Input sequence $x = [2, 1]$.</p>
     <ul class="steps">
       <li>Step 1: combine $0.5\\times0 + 1\\times2 + 0 = 2$. Then $a^{<1>} = \\tanh(2) \\approx 0.96$.</li>
       <li>Step 2: combine $0.5\\times0.96 + 1\\times1 + 0 = 1.48$. Then $a^{<2>} = \\tanh(1.48) \\approx 0.90$.</li>
       <li>The memory $a^{<1>}$ from step 1 carried into step 2's calculation. That is the recurrence.</li>
     </ul>`,
  application:
    `<p>RNNs handle text, speech, and time series: early language models, speech-to-text, and forecasting. They process inputs in order and remember context.</p>`,
  quiz: {
    q: `Why is an RNN suited to sentences but a plain feed-forward net is not?`,
    a: `<p>An RNN carries a hidden state across steps, so earlier words influence later ones. A plain network treats each input independently, losing the order and context.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-vanishing-gradient",
  demo: function (host) {
    Demos.plot(host, {
      xmin: 1, xmax: 20, ymin: 0, ymax: 4, height: 300,
      controls: [
        { key: "r", label: "r (per-step factor)", min: 0, max: 2, val: 0.5, step: 0.05 }
      ],
      curves: [
        { f: function (k, s) { return Math.pow(s.r, k); }, label: "rᵏ vs depth k", color: "#4ea1ff" }
      ],
      drag: {
        curve: 0, start: 5, label: "depth k",
        readout: function (k, y, s) {
          var kk = Math.round(k);
          var prod = Math.pow(s.r, kk);
          var note = s.r < 1 ? "r < 1: shrinks toward 0 (vanishing)." :
            (s.r > 1 ? "r > 1: blows up (exploding)." : "r = 1: stays steady.");
          return "r = <b>" + s.r.toFixed(2) + "</b>, depth k = <b>" + kk +
            "</b> → rᵏ = <b>" + prod.toExponential(3) + "</b>. " + note;
        }
      }
    });
  },
  title: "Vanishing & exploding gradients",
  tagline: "Over long sequences, gradients shrink to nothing or blow up; clipping caps the blow-ups.",
  prereqs: ["dl-rnn", "dl-backprop"],
  bigIdea:
    `<p>Backprop through a long sequence multiplies many slopes together.</p>
     <p>If those slopes are small, the product shrinks toward 0: a <b>vanishing gradient</b>. The network can't learn long-range links.</p>
     <p>If the slopes are large, the product blows up: an <b>exploding gradient</b>. Training goes unstable.</p>`,
  buildup:
    `<p>Multiplying many numbers below 1 (like $0.5 \\times 0.5 \\times \\dots$) heads toward 0 fast.</p>
     <p>Multiplying many numbers above 1 heads toward infinity. <b>Gradient clipping</b> fixes the explosion by capping the gradient's size.</p>`,
  symbols: [
    { sym: "vanishing gradient", desc: "the gradient becomes tiny, so early steps barely update. Long-term memory fails." },
    { sym: "exploding gradient", desc: "the gradient becomes huge, so updates overshoot wildly." },
    { sym: "gradient clipping", desc: "if the gradient's size exceeds a threshold, scale it down to that threshold." },
    { sym: "threshold", desc: "the maximum allowed gradient size." }
  ],
  formula: `$$ \\text{if } \\|g\\| > \\text{threshold}, \\;\\; g \\leftarrow \\text{threshold}\\cdot\\frac{g}{\\|g\\|} $$`,
  whatItDoes:
    `<p>Measure the gradient's size (its norm). If it is bigger than the threshold, shrink it back down to the threshold while keeping its direction.</p>
     <p>This stops single giant steps from wrecking training. Vanishing gradients need a different fix (next lesson: LSTM/GRU).</p>`,
  example:
    `<p>Multiply slopes of 0.5 along a 5-step sequence: $0.5 \\times 0.5 \\times 0.5 \\times 0.5 \\times 0.5$.</p>
     <ul class="steps">
       <li>That is $0.5^5 = 0.03125$. Already tiny after just 5 steps.</li>
       <li>Over 20 steps it would be near $0.000001$: practically zero. The gradient has vanished.</li>
       <li>Now clipping: if a gradient's size is 100 but the threshold is 5, scale it down to size 5, same direction.</li>
     </ul>`,
  application:
    `<p>These problems are why plain RNNs struggle with long paragraphs. Gradient clipping is standard in training RNNs and even large language models to keep updates stable.</p>`,
  quiz: {
    q: `A gradient has size 40 and the clip threshold is 10. What happens to it?`,
    a: `<p>40 is above 10, so it is scaled down to size 10 (keeping its direction). If it had been size 8, it would be left unchanged.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-lstm-gru",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "f", label: "forget gate f", min: 0, max: 1, val: 0.7, step: 0.05 },
        { key: "c", label: "c (old cell)", min: -3, max: 3, val: 1, step: 0.1 },
        { key: "cand", label: "candidate (new info)", min: -3, max: 3, val: 2, step: 0.1 }
      ],
      compute: function (s) {
        var cNew = s.f * s.c + (1 - s.f) * s.cand;
        return { text: "new cell = f·c + (1 − f)·candidate = " + s.f.toFixed(2) + "·" +
          s.c.toFixed(1) + " + " + (1 - s.f).toFixed(2) + "·" + s.cand.toFixed(1) +
          " = <b>" + cNew.toFixed(3) + "</b>. f near 1 keeps old memory; f near 0 forgets it." };
      }
    });
  },
  title: "LSTM & GRU (gates)",
  tagline: "Add little gates that decide what to remember and what to forget over long sequences.",
  prereqs: ["dl-rnn", "dl-vanishing-gradient"],
  bigIdea:
    `<p>Plain RNNs forget the distant past because of vanishing gradients.</p>
     <p><b>LSTM</b> and <b>GRU</b> are smarter RNN cells. They add <b>gates</b>: little controls that decide what to keep, what to forget, and what to output.</p>
     <p>This lets them carry important information across long sequences.</p>`,
  buildup:
    `<p>A gate is a number between 0 and 1 (from a sigmoid). 0 means "block it", 1 means "let it all through", in between means "partly".</p>
     <p>LSTM has three gates: forget, update (input), and output. GRU is a simpler version with fewer gates.</p>`,
  symbols: [
    { sym: "forget gate", desc: "decides how much of the old memory to throw away (0 = forget all, 1 = keep all)." },
    { sym: "update gate", desc: "decides how much new information to add to the memory." },
    { sym: "output gate", desc: "decides how much of the memory to reveal as the step's output." },
    { sym: "GRU", desc: "a lighter cell with fewer gates; faster, often works just as well." }
  ],
  formula: `$$ \\text{gate} = \\sigma(\\cdots) \\in (0, 1), \\quad \\text{new memory} = \\text{forget}\\cdot\\text{old} + \\text{update}\\cdot\\text{new} $$`,
  whatItDoes:
    `<p>Each gate is a sigmoid, giving a value between 0 and 1. The forget gate scales the old memory, the update gate scales the new info, and they are added together.</p>
     <p>Because memory can pass through almost untouched (forget gate near 1), gradients don't vanish, so long-term memory survives.</p>`,
  example:
    `<p>Reading: "I grew up in France ... I speak fluent ___". The blank needs "French".</p>
     <ul class="steps">
       <li>At the word "France", the update gate opens (near 1) and stores "country = France" in memory.</li>
       <li>Through the many words in between, the forget gate stays near 1, so that memory is preserved.</li>
       <li>At the blank, the output gate reveals "France", helping predict "French".</li>
     </ul>
     <p>A plain RNN would likely have forgotten "France" by then. The gates kept it alive.</p>`,
  application:
    `<p>LSTMs and GRUs powered a generation of translation, speech recognition, and text generation systems before Transformers. They are still common for time-series forecasting.</p>`,
  quiz: {
    q: `What does a forget gate value near 0 do to the old memory?`,
    a: `<p>It throws most of the old memory away (multiplies it by nearly 0). A value near 1 would keep it.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-word-embeddings",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "V", label: "V (vocabulary size)", min: 2, max: 100000, val: 10000, step: 1 },
        { key: "d", label: "d (embedding dim)", min: 2, max: 1024, val: 300, step: 1 }
      ],
      compute: function (s) {
        var ratio = s.V / s.d;
        return { text: "one-hot length = V = <b>" + s.V + "</b> (mostly zeros)" +
          "<br>embedding length = d = <b>" + s.d + "</b> (dense)" +
          "<br>embedding is " + ratio.toFixed(1) + "× shorter than one-hot." };
      }
    });
  },
  title: "Word embeddings",
  tagline: "Turn words into number-vectors where similar words land near each other.",
  prereqs: ["fnd-vector", "fnd-matvec"],
  bigIdea:
    `<p>Computers need numbers, not words. So we turn each word into a vector.</p>
     <p>The naive way is <b>one-hot</b>: a long vector that is all 0 except a single 1. But one-hot vectors say nothing about meaning; "cat" and "dog" look as unrelated as "cat" and "car".</p>
     <p>A <b>word embedding</b> is a short dense vector where similar words sit close together. It captures meaning.</p>`,
  buildup:
    `<p>One-hot picks a word out of a vocabulary list with a single 1. To get its embedding, multiply an <b>embedding matrix</b> $E$ by that one-hot vector.</p>
     <p>That multiply just selects one column of $E$: the word's dense vector.</p>`,
  symbols: [
    { sym: "$o_w$", desc: "the one-hot vector for word $w$: all 0 except a single 1 at the word's position." },
    { sym: "$E$", desc: "the embedding matrix: each column is the dense vector for one word." },
    { sym: "$e_w$", desc: "the embedding of word $w$: a short dense vector capturing its meaning." },
    { sym: "dense vs sparse", desc: "dense = mostly nonzero, short. Sparse (one-hot) = mostly zero, long." }
  ],
  formula: `$$ e_w = E\\, o_w $$`,
  whatItDoes:
    `<p>The one-hot $o_w$ has a 1 in word $w$'s slot. Multiplying $E$ by it picks out the matching column of $E$.</p>
     <p>That column is $e_w$, the word's dense embedding: a handful of numbers instead of a huge mostly-zero vector.</p>`,
  example:
    `<p>Vocabulary of 4 words. The word "cat" is at position 2, so $o_{\\text{cat}} = [0, 1, 0, 0]$.</p>
     <ul class="steps">
       <li>Embedding matrix columns (each a 2-number embedding): cat $= [0.9, 0.8]$, dog $= [0.85, 0.82]$, car $= [0.1, 0.95]$, the $= [0.0, 0.1]$.</li>
       <li>Multiply $E$ by $o_{\\text{cat}}$: it selects column 2, giving $e_{\\text{cat}} = [0.9, 0.8]$.</li>
       <li>"dog" $= [0.85, 0.82]$ is very close to "cat" — similar meaning, nearby vectors. "car" is farther away.</li>
     </ul>`,
  application:
    `<p>Embeddings let search engines, translators, and chatbots understand that "happy" and "glad" mean almost the same thing. They are the first layer of nearly every language model.</p>`,
  quiz: {
    q: `Why are one-hot vectors poor at showing that "happy" and "glad" are similar?`,
    a: `<p>Each one-hot has its single 1 in a different slot, so any two distinct words are equally far apart. They carry no similarity information at all.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-word2vec",
  demo: function (host) {
    Demos.calc(host, {
      bars: true, barsHeight: 150,
      inputs: [
        { key: "s1", label: "score: word 1", min: -5, max: 5, val: 2, step: 0.1 },
        { key: "s2", label: "score: word 2", min: -5, max: 5, val: 1, step: 0.1 },
        { key: "s3", label: "score: word 3", min: -5, max: 5, val: 0, step: 0.1 }
      ],
      compute: function (s) {
        var e1 = Math.exp(s.s1), e2 = Math.exp(s.s2), e3 = Math.exp(s.s3);
        var Z = e1 + e2 + e3;
        var p1 = e1 / Z, p2 = e2 / Z, p3 = e3 / Z;
        return {
          text: "softmax P(t|c) = exp(score) / Σ exp. Probabilities sum to " +
            (p1 + p2 + p3).toFixed(3) + ".",
          bars: [
            { label: "word 1", val: p1 },
            { label: "word 2", val: p2 },
            { label: "word 3", val: p3 }
          ],
          max: 1
        };
      }
    });
  },
  title: "word2vec & GloVe",
  tagline: "Learn word vectors by predicting nearby words. Then king − man + woman ≈ queen.",
  prereqs: ["dl-word-embeddings", "ml-logistic-regression"],
  bigIdea:
    `<p>How do we get good embeddings? <b>word2vec</b> learns them by a guessing game.</p>
     <p>In the <b>skip-gram</b> version, given a center word, the model tries to predict the words around it. To do that well, it must put related words near each other.</p>
     <p>The result is famous: "king" − "man" + "woman" lands right next to "queen". The vectors capture analogies.</p>`,
  buildup:
    `<p>For a center word $c$ and a nearby word $t$, the model scores how likely $t$ is, using a dot product of their vectors, then a softmax to turn scores into probabilities.</p>
     <p>The softmax exponentiates each score and divides by the total, so the probabilities add to 1. <b>GloVe</b> reaches similar embeddings using word co-occurrence counts instead.</p>`,
  symbols: [
    { sym: "$c$", desc: "the center word — the one we look out from." },
    { sym: "$t$", desc: "a target word: one of the context words sitting near the center word $c$." },
    { sym: "$e_c$", desc: "the embedding of the center word." },
    { sym: "$\\theta_t$", desc: "the output vector for target word $t$ (Greek 'theta')." },
    { sym: "$\\exp$", desc: "the exponential function $e^{(\\cdot)}$, which turns any score into a positive number." },
    { sym: "$j$", desc: "an index that runs over every word in the vocabulary; the bottom sum adds one term per word." },
    { sym: "$P(t \\mid c)$", desc: "the probability of target $t$ given center $c$ (the bar means 'given')." }
  ],
  formula: `$$ P(t \\mid c) = \\frac{\\exp(\\theta_t^\\top e_c)}{\\sum_j \\exp(\\theta_j^\\top e_c)} $$`,
  whatItDoes:
    `<p>The top scores word $t$ by the dot product $\\theta_t^\\top e_c$: high when their vectors agree. The bottom sums that over all words $j$, so dividing turns scores into probabilities that add to 1.</p>
     <p>Training maximizes the probability of the real nearby words, which shapes the embeddings so related words cluster.</p>`,
  example:
    `<p>The analogy "king is to man as queen is to woman" shows up as vector math.</p>
     <ul class="steps">
       <li>Take the learned vectors and compute: king − man + woman.</li>
       <li>"king − man" captures the idea of royalty without gender. Adding "woman" puts the gender back as female.</li>
       <li>The closest word vector to the result is "queen". The embedding learned the relationship on its own.</li>
     </ul>`,
  application:
    `<p>word2vec and GloVe embeddings boosted search, recommendation, and translation. They showed that meaning can be learned just from which words appear near each other in text.</p>`,
  quiz: {
    q: `In the softmax $P(t \\mid c)$, what is the bottom sum for, and what does it guarantee?`,
    a: `<p>It adds the exponentiated scores over every word, so dividing by it makes the probabilities of all words add up to 1.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-cosine-similarity",
  demo: function (host) {
    Demos.vectors(host, {
      range: 5,
      vectors: [
        { key: "a", x: 4, y: 1, label: "a", color: "#4ea1ff" },
        { key: "b", x: 1, y: 4, label: "b", color: "#7ee787" }
      ],
      compute: function (vecs) {
        var a = vecs.a, b = vecs.b;
        var dot = a.x * b.x + a.y * b.y;
        var na = Math.sqrt(a.x * a.x + a.y * a.y);
        var nb = Math.sqrt(b.x * b.x + b.y * b.y);
        var denom = na * nb;
        var cos = denom > 0 ? dot / denom : 0;
        cos = Math.max(-1, Math.min(1, cos));
        var deg = Math.acos(cos) * 180 / Math.PI;
        return {
          text: "a = (" + a.x + ", " + a.y + "), &nbsp; b = (" + b.x + ", " + b.y + ")<br>" +
            "a·b = " + dot.toFixed(2) + ", &nbsp; ‖a‖ = " + na.toFixed(2) +
            ", &nbsp; ‖b‖ = " + nb.toFixed(2) + "<br>" +
            "cos θ = (a·b)/(‖a‖‖b‖) = <b>" + cos.toFixed(3) + "</b>, &nbsp; θ ≈ <b>" +
            deg.toFixed(1) + "°</b>"
        };
      }
    });
  },
  title: "Cosine similarity",
  tagline: "Measure how alike two vectors are by the angle between them, not their length.",
  prereqs: ["fnd-dot", "fnd-norm"],
  bigIdea:
    `<p><b>Cosine similarity</b> measures how similar two vectors point, ignoring how long they are.</p>
     <p>It is the cosine of the angle between them. Pointing the same way gives 1. At a right angle gives 0. Opposite gives -1.</p>
     <p>This is the go-to way to compare word embeddings: similar words point in nearly the same direction.</p>`,
  buildup:
    `<p>The dot product is big when vectors agree, but it also grows with length. To compare direction only, divide out the lengths (norms).</p>
     <p>That gives a clean score between -1 and 1 that depends only on the angle.</p>`,
  symbols: [
    { sym: "$w_1, w_2$", desc: "the two vectors being compared (e.g. two word embeddings)." },
    { sym: "$w_1\\cdot w_2$", desc: "their dot product: multiply matching entries and add." },
    { sym: "$\\|w_1\\|$", desc: "the length (L2 norm) of $w_1$." },
    { sym: "$\\cos\\theta$", desc: "the cosine of the angle $\\theta$ between them: the similarity score." }
  ],
  formula: `$$ \\frac{w_1\\cdot w_2}{\\|w_1\\|\\,\\|w_2\\|} = \\cos\\theta $$`,
  whatItDoes:
    `<p>Top: the dot product, which measures agreement. Bottom: the two lengths, which divide that agreement so length stops mattering.</p>
     <p>What's left is pure direction: 1 (same way), 0 (perpendicular, unrelated), or -1 (opposite).</p>`,
  example:
    `<p>Let $w_1 = [1, 2]$ and $w_2 = [2, 4]$.</p>
     <ul class="steps">
       <li>Dot product: $1\\times2 + 2\\times4 = 2 + 8 = 10$.</li>
       <li>Length of $w_1$: $\\sqrt{1^2 + 2^2} = \\sqrt{5} \\approx 2.24$. Length of $w_2$: $\\sqrt{2^2 + 4^2} = \\sqrt{20} \\approx 4.47$.</li>
       <li>Cosine: $\\frac{10}{2.24 \\times 4.47} = \\frac{10}{10.0} = 1.0$.</li>
       <li>The score is 1: $w_2$ points the exact same way as $w_1$ (it is just twice as long).</li>
     </ul>`,
  application:
    `<p>Search engines and recommenders use cosine similarity to find the closest matching documents, products, or words. It is the standard "how alike are these?" measure for embeddings.</p>`,
  quiz: {
    q: `Two vectors are at a right angle (perpendicular). What is their cosine similarity?`,
    a: `<p>$\\cos(90^\\circ) = 0$. A right angle means they are unrelated in direction, so the similarity is 0.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-attention",
  demo: function (host) {
    host.innerHTML = "";
    function C() {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var keys = ["the", "cat", "sat"], queries = ["le", "chat", "assis"];
    // raw score matrix (query rows x key cols), adjustable bias per row via sliders
    var base = [[3, 0, -1], [-1, 3, 0], [0, -1, 3]];
    var st = { focus: [0, 0, 0] };  // extra emphasis on diagonal per query
    function weights(qr) {
      var raw = base[qr].map(function (v, i) { return v + (i === qr ? st.focus[qr] : 0); });
      var ex = raw.map(Math.exp), Z = ex[0] + ex[1] + ex[2];
      return ex.map(function (e) { return e / Z; });
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 280; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function shade(c, w) {
      // blend accent over panel by weight w in [0,1]
      function hx(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
      var a = /^#[0-9a-fA-F]{6}$/.test(c.accent) ? hx(c.accent) : [78, 161, 255];
      var p = /^#[0-9a-fA-F]{6}$/.test(c.panel) ? hx(c.panel) : [22, 28, 36];
      var r = Math.round(p[0] + (a[0] - p[0]) * w), g = Math.round(p[1] + (a[1] - p[1]) * w), b = Math.round(p[2] + (a[2] - p[2]) * w);
      return "rgb(" + r + "," + g + "," + b + ")";
    }
    function draw() {
      var c = C();
      ctx.clearRect(0, 0, 640, 280);
      ctx.font = "13px sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var cz = 60, gx = 140, gy = 60;
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("keys →", gx + 1.5 * cz, gy - 26);
      for (var k = 0; k < 3; k++) { ctx.fillStyle = c.dim; ctx.fillText(keys[k], gx + k * cz + cz / 2, gy - 8); }
      for (var q = 0; q < 3; q++) {
        var w = weights(q);
        ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "end"; ctx.fillText(queries[q], gx - 8, gy + q * cz + cz / 2); ctx.textAlign = "center";
        for (var kk = 0; kk < 3; kk++) {
          ctx.fillStyle = shade(c, w[kk]); ctx.fillRect(gx + kk * cz, gy + q * cz, cz - 2, cz - 2);
          ctx.fillStyle = w[kk] > 0.5 ? "#ffffff" : c.ink; ctx.font = "13px sans-serif"; ctx.fillText(w[kk].toFixed(2), gx + kk * cz + cz / 2, gy + q * cz + cz / 2);
        }
        // row sum check
        ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.fillText("Σ=1.00", gx + 3 * cz + 26, gy + q * cz + cz / 2);
      }
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "start";
      ctx.fillText("queries ↓", 18, gy + 1.5 * cz);
      ctx.fillText("each row = softmax over keys, sums to 1. Darker = more attention.", 18, gy + 3 * cz + 24);
    }
    function slider(label, qi) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label;
      var inp = document.createElement("input"); inp.type = "range"; inp.min = -3; inp.max = 5; inp.step = 0.2; inp.value = 0;
      inp.addEventListener("input", function () { st.focus[qi] = parseFloat(inp.value); draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    slider("extra focus: query 'le' on 'the'", 0);
    slider("extra focus: query 'chat' on 'cat'", 1);
    slider("extra focus: query 'assis' on 'sat'", 2);
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    var origDraw = draw;
    draw = function () { origDraw(); var av = [1, 3, 5], w0 = weights(0); var cxt = w0[0] * av[0] + w0[1] * av[1] + w0[2] * av[2]; rd.innerHTML = "Row 'le' weights = [" + w0.map(function (x) { return x.toFixed(2); }).join(", ") + "], sum = <b>1.00</b>.<br>context = Σ α·a with values a=[1,3,5] = <b>" + cxt.toFixed(3) + "</b> (weighted average of the key values)."; };
    draw();
  },
  title: "Attention",
  tagline: "Let the model focus on the most relevant input parts, with weights that add to 1.",
  prereqs: ["dl-rnn", "dl-word2vec"],
  bigIdea:
    `<p>When producing each output, a model shouldn't treat all inputs equally. Some words matter more right now.</p>
     <p><b>Attention</b> lets the model focus. It gives each input part a weight, and the weights add up to 1.</p>
     <p>The output is a weighted blend of the inputs, leaning on the most relevant ones. This idea is the foundation of Transformers and LLMs.</p>`,
  buildup:
    `<p>For each input part, the model computes a raw score $e$ for how relevant it is. A softmax turns those scores into weights $\\alpha$ that sum to 1.</p>
     <p>Then the <b>context</b> is the weighted sum of the inputs $a$, using those weights.</p>`,
  symbols: [
    { sym: "$e^{<t,t'>}$", desc: "the raw relevance score of input part $t'$ for output step $t$." },
    { sym: "$\\alpha^{<t,t'>}$", desc: "the attention weight (Greek 'alpha'): how much to focus on input $t'$. All weights add to 1." },
    { sym: "$\\exp$", desc: "the exponential function, used by softmax to make scores positive." },
    { sym: "$a^{<t'>}$", desc: "the input representation at position $t'$ being attended to." },
    { sym: "$c$", desc: "the context: the weighted blend of inputs, focused on the relevant parts." }
  ],
  formula: `$$ \\alpha^{<t,t'>} = \\frac{\\exp(e^{<t,t'>})}{\\sum_{t'} \\exp(e^{<t,t'>})}, \\qquad c = \\sum_{t'} \\alpha^{<t,t'>}\\, a^{<t'>} $$`,
  whatItDoes:
    `<p>The softmax turns raw scores into weights between 0 and 1 that sum to 1: bigger score means more focus.</p>
     <p>The context $c$ is the weighted sum of the inputs. Inputs with big weights dominate; inputs with tiny weights are nearly ignored.</p>`,
  example:
    `<p>Translating, the model attends to 3 source words with raw scores $e = [2, 1, 0]$.</p>
     <ul class="steps">
       <li>Exponentiate: $e^2 \\approx 7.39$, $e^1 \\approx 2.72$, $e^0 = 1$. Sum $\\approx 11.11$.</li>
       <li>Weights: $7.39/11.11 \\approx 0.67$, $2.72/11.11 \\approx 0.24$, $1/11.11 \\approx 0.09$. They add to 1.</li>
       <li>So the model puts 67% of its focus on the first word, 24% on the second, 9% on the third.</li>
       <li>Context $c = 0.67\\,a_1 + 0.24\\,a_2 + 0.09\\,a_3$, mostly the first word.</li>
     </ul>`,
  application:
    `<p>Attention is the core of Transformers, which power modern translation, search, and large language models like the ones behind chatbots. It lets a model link any word to any other word.</p>`,
  quiz: {
    q: `Attention weights for 3 inputs are $0.7, 0.2, 0.1$. Which input does the model focus on most, and what do the weights add to?`,
    a: `<p>The first input (weight 0.7) gets the most focus. The weights add to $0.7 + 0.2 + 0.1 = 1$, as attention weights always do.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "dl-data-augmentation",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "flips", label: "flip variants", min: 1, max: 4, val: 2, step: 1 },
        { key: "rots", label: "rotation variants", min: 1, max: 12, val: 4, step: 1 },
        { key: "crops", label: "crop variants", min: 1, max: 10, val: 3, step: 1 }
      ],
      compute: function (s) {
        var total = s.flips * s.rots * s.crops;
        return { text: "total variants = flips × rotations × crops = " + s.flips + " × " +
          s.rots + " × " + s.crops + " = <b>" + total + "</b> images from one original." };
      }
    });
  },
  title: "Data augmentation",
  tagline: "Make more training images by flipping, rotating, and cropping the ones you have.",
  prereqs: ["dl-conv"],
  bigIdea:
    `<p>More data usually means a better model. But collecting it is expensive.</p>
     <p><b>Data augmentation</b> creates new training examples from existing ones with simple changes: flip, rotate, crop, shift colors.</p>
     <p>A flipped cat is still a cat. The label stays the same, but the model sees more variety, which reduces overfitting.</p>`,
  buildup:
    `<p>Each epoch, apply random small transformations to the images. The network rarely sees the exact same image twice.</p>
     <p>This teaches it that a cat is a cat whether it faces left or right, is a bit rotated, or is lit differently.</p>`,
  symbols: [
    { sym: "flip", desc: "mirror the image left-right (or up-down)." },
    { sym: "rotate", desc: "turn the image by a small angle." },
    { sym: "crop", desc: "cut out and zoom into a part of the image." },
    { sym: "color shift", desc: "tweak brightness, contrast, or hue slightly." }
  ],
  formula: `$$ \\text{new image} = \\text{transform}(\\text{original image}), \\quad \\text{label unchanged} $$`,
  whatItDoes:
    `<p>Apply a random transformation to each image before feeding it in. The label is kept, since the content is still the same object.</p>
     <p>The model effectively trains on a much larger, more varied dataset, so it generalizes better to new photos.</p>`,
  example:
    `<p>You have 1 photo of a dog. With augmentation you generate many variations.</p>
     <ul class="steps">
       <li>Flip it left-right: a mirror-image dog. Still a dog.</li>
       <li>Rotate it 10 degrees: a slightly tilted dog. Still a dog.</li>
       <li>Crop and zoom on the dog's head: a close-up. Still a dog.</li>
       <li>Brighten it: the same dog in better light. From 1 photo, several training examples, all labeled "dog".</li>
     </ul>`,
  application:
    `<p>Data augmentation is standard in image recognition for medical scans, self-driving, and photo apps, especially when labeled data is scarce. It is a cheap way to fight overfitting.</p>`,
  quiz: {
    q: `If you flip a photo labeled "cat" left-to-right, what label should the new image get?`,
    a: `<p>Still "cat". Flipping doesn't change what the object is, so the label stays the same.</p>`
  }
});

})();
