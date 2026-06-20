/* =====================================================================
   MODULE 10 — MODERN DEEP LEARNING & AI.
   Same beginner style as the other modules:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
     - bespoke canvas demos that render on load and are theme-aware
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Modern Deep Learning & AI";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* shared theme reader for bespoke demos */
function THEME() {
  var s = getComputedStyle(document.documentElement);
  var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
  return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
}
/* blend a 6-hex color over the panel color by weight w in [0,1] -> rgb string */
function BLEND(c, hexTop, w) {
  function hx(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var a = /^#[0-9a-fA-F]{6}$/.test(hexTop) ? hx(hexTop) : [78, 161, 255];
  var p = /^#[0-9a-fA-F]{6}$/.test(c.panel) ? hx(c.panel) : [22, 28, 36];
  var ww = Math.max(0, Math.min(1, w));
  var r = Math.round(p[0] + (a[0] - p[0]) * ww), g = Math.round(p[1] + (a[1] - p[1]) * ww), b = Math.round(p[2] + (a[2] - p[2]) * ww);
  return "rgb(" + r + "," + g + "," + b + ")";
}

/* ================================================================ */
/* 1. TRANSFORMERS & SELF-ATTENTION                                 */
/* ================================================================ */
L({
  id: "mod-transformer",
  demo: function (host) {
    host.innerHTML = "";
    var tokens = ["The", "cat", "sat", "down"];
    var n = tokens.length;
    // fixed raw scores QK^T/sqrt(d): each row = how token i looks at token j
    var raw = [
      [2.0, 0.5, -0.5, -1.0],
      [0.5, 2.0, 1.0, -0.5],
      [-0.5, 1.5, 2.0, 0.5],
      [-1.0, 0.0, 1.0, 2.0]
    ];
    var st = { temp: 1.0 };
    function softmaxRow(r) {
      var sc = raw[r].map(function (v) { return v / st.temp; });
      var mx = Math.max(sc[0], sc[1], sc[2], sc[3]);
      var ex = sc.map(function (v) { return Math.exp(v - mx); });
      var Z = ex[0] + ex[1] + ex[2] + ex[3];
      return ex.map(function (e) { return e / Z; });
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function draw() {
      var c = THEME();
      ctx.clearRect(0, 0, 640, 320);
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var cz = 56, gx = 160, gy = 70;
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("keys (attended to) →", gx + (n * cz) / 2, gy - 32);
      for (var k = 0; k < n; k++) { ctx.fillStyle = c.dim; ctx.fillText(tokens[k], gx + k * cz + cz / 2, gy - 12); }
      for (var q = 0; q < n; q++) {
        var w = softmaxRow(q);
        ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "end";
        ctx.fillText(tokens[q], gx - 10, gy + q * cz + cz / 2); ctx.textAlign = "center";
        for (var kk = 0; kk < n; kk++) {
          ctx.fillStyle = BLEND(c, "#4ea1ff", w[kk]);
          ctx.fillRect(gx + kk * cz, gy + q * cz, cz - 3, cz - 3);
          ctx.fillStyle = w[kk] > 0.5 ? "#ffffff" : c.ink; ctx.font = "12px sans-serif";
          ctx.fillText(w[kk].toFixed(2), gx + kk * cz + cz / 2, gy + q * cz + cz / 2);
        }
        ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
        ctx.fillText("Σ=1.00", gx + n * cz + 24, gy + q * cz + cz / 2);
      }
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "start";
      ctx.fillText("queries (each token's view) ↓", 12, gy + (n * cz) / 2);
      ctx.fillText("Each row is a softmax over keys and sums to 1. Darker = more attention.", 12, gy + n * cz + 18);
    }
    var row = document.createElement("div"); row.style.margin = "8px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "temperature (scaling) = 1.00";
    var inp = document.createElement("input"); inp.type = "range"; inp.min = 0.3; inp.max = 3; inp.step = 0.1; inp.value = 1;
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    function refresh() {
      draw();
      var w = softmaxRow(1);
      rd.innerHTML = "Row 'cat' weights = [" + w.map(function (x) { return x.toFixed(2); }).join(", ") +
        "], sum = <b>1.00</b>.<br>The new 'cat' vector = " + w.map(function (x, i) { return x.toFixed(2) + "·" + tokens[i]; }).join(" + ") +
        " (a weighted blend of all four value vectors).";
    }
    inp.addEventListener("input", function () { st.temp = parseFloat(inp.value); lab.textContent = "temperature (scaling) = " + st.temp.toFixed(2); refresh(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row); host.appendChild(rd);
    refresh();
  },
  title: "Transformers & self-attention",
  tagline: "Every token looks at every other token and pulls in what matters. No loops, all at once.",
  prereqs: ["dl-attention", "dl-word-embeddings"],
  bigIdea:
    `<p>A <b>Transformer</b> reads a whole sentence at once. It does not crawl word by word.</p>
     <p>The trick is <b>self-attention</b>. Every word builds three small vectors: a <i>query</i> (what am I looking for?), a <i>key</i> (what do I offer?), and a <i>value</i> (what I carry).</p>
     <p>Each word compares its query to every key, decides who to listen to, and pulls in a weighted blend of their values. That blend becomes its new, context-aware meaning.</p>`,
  buildup:
    `<p>You already know attention: turn scores into weights with a softmax, then take a weighted sum. Self-attention is the same idea, but a word attends to its own sentence.</p>
     <p>The scores come from a dot product of queries and keys. We divide by $\\sqrt{d}$ so the numbers do not get huge when the vectors are long.</p>`,
  symbols: [
    { sym: "$Q$", desc: "the query matrix. One query vector per token: 'what am I looking for?'" },
    { sym: "$K$", desc: "the key matrix. One key vector per token: 'what do I offer to others?'" },
    { sym: "$V$", desc: "the value matrix. One value vector per token: the actual content carried." },
    { sym: "$K^\\top$", desc: "the transpose of $K$. The little $\\top$ flips $K$ so $Q$ and $K$ line up to multiply." },
    { sym: "$QK^\\top$", desc: "all query-key dot products: a score for how much each token attends to each other token." },
    { sym: "$d$", desc: "the length of each query/key vector (the 'head dimension')." },
    { sym: "$\\sqrt{d}$", desc: "the square root of $d$. Dividing by it keeps the scores from blowing up when $d$ is large." },
    { sym: "$\\text{softmax}$", desc: "turns a row of scores into weights between 0 and 1 that sum to 1." }
  ],
  formula: `$$ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right) V $$`,
  whatItDoes:
    `<p>Read it inside out. First $QK^\\top$ scores every pair of tokens. Then divide by $\\sqrt{d}$ to keep scores tame.</p>
     <p>The softmax turns each row of scores into attention weights that sum to 1. Finally, multiply by $V$: each token's output is a weighted average of all value vectors.</p>`,
  derivation:
    `<p>Why divide by $\\sqrt{d}$? Suppose each entry of a query $q$ and a key $k$ is independent with mean 0 and variance 1.</p>
     <ul class="steps">
       <li>A score is a dot product: $q^\\top k = \\sum_{i=1}^{d} q_i k_i$.</li>
       <li>Each term $q_i k_i$ has mean 0 and variance 1. Summing $d$ independent terms adds the variances: $\\text{Var}(q^\\top k) = d$.</li>
       <li>So a typical score has size about $\\sqrt{d}$ (the standard deviation).</li>
       <li>Large scores push the softmax into a flat 0/1 region where gradients vanish. To cancel the growth, divide by $\\sqrt{d}$, giving variance 1 again.</li>
     </ul>
     <p>That single $\\frac{1}{\\sqrt{d}}$ keeps the softmax in a healthy range no matter how long the vectors are. $\\blacksquare$</p>`,
  example:
    `<p>One token attends to three others. The scaled scores are $\\frac{QK^\\top}{\\sqrt{d}} = [2, 1, 0]$.</p>
     <ul class="steps">
       <li>Exponentiate: $e^{2} \\approx 7.39$, $e^{1} \\approx 2.72$, $e^{0} = 1$. Sum $\\approx 11.11$.</li>
       <li>Softmax weights: $7.39/11.11 \\approx 0.67$, $2.72/11.11 \\approx 0.24$, $1/11.11 \\approx 0.09$. They add to 1.</li>
       <li>The output is $0.67\\,V_1 + 0.24\\,V_2 + 0.09\\,V_3$: mostly the first token's value, a little of the others.</li>
     </ul>
     <p>So this token's new meaning leans 67% on the first neighbor. That is self-attention picking what matters.</p>`,
  application:
    `<p>Transformers are the backbone of GPT, BERT, image models, and protein folders. Because every token attends to every token in parallel, they train fast on GPUs and capture long-range links a word-by-word model would miss.</p>`,
  quiz: {
    q: `Scaled scores for 3 tokens are $[0, 0, 0]$. What attention weights does the softmax give, and why?`,
    a: `<p>Equal scores give $e^0 = 1$ each, sum $3$, so each weight is $1/3 \\approx 0.33$. With no preference, attention spreads evenly across all tokens.</p>`
  }
});

/* ================================================================ */
/* 2. MULTI-HEAD ATTENTION                                          */
/* ================================================================ */
L({
  id: "mod-multihead",
  demo: function (host) {
    host.innerHTML = "";
    var tokens = ["The", "cat", "sat"];
    var n = tokens.length;
    // three heads, each a 3x3 raw-score matrix focusing on a different pattern
    var heads = [
      { name: "Head 1: self / identity", raw: [[3, 0, 0], [0, 3, 0], [0, 0, 3]] },
      { name: "Head 2: look at previous", raw: [[2, 0, 0], [3, 0, 0], [0, 3, 0]] },
      { name: "Head 3: look at the verb", raw: [[0, 0, 3], [0, 0, 3], [0, 0, 2]] }
    ];
    function softmaxRow(r) {
      var mx = Math.max(r[0], r[1], r[2]);
      var ex = r.map(function (v) { return Math.exp(v - mx); });
      var Z = ex[0] + ex[1] + ex[2];
      return ex.map(function (e) { return e / Z; });
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 280; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function draw() {
      var c = THEME();
      ctx.clearRect(0, 0, 640, 280);
      ctx.textBaseline = "middle";
      var cz = 34, gap = 30, blockW = n * cz, startX = 30, topY = 60;
      var cols = ["#4ea1ff", "#7ee787", "#c89bff"];
      for (var h = 0; h < 3; h++) {
        var gx = startX + h * (blockW + gap + 22);
        ctx.textAlign = "start"; ctx.fillStyle = c.ink; ctx.font = "12px sans-serif";
        ctx.fillText(heads[h].name, gx, 28);
        ctx.textAlign = "center"; ctx.font = "10px sans-serif"; ctx.fillStyle = c.dim;
        for (var k = 0; k < n; k++) ctx.fillText(tokens[k], gx + k * cz + cz / 2, topY - 8);
        for (var q = 0; q < n; q++) {
          var w = softmaxRow(heads[h].raw[q]);
          ctx.textAlign = "end"; ctx.fillStyle = c.dim; ctx.font = "10px sans-serif";
          ctx.fillText(tokens[q], gx - 4, topY + q * cz + cz / 2); ctx.textAlign = "center";
          for (var kk = 0; kk < n; kk++) {
            ctx.fillStyle = BLEND(c, cols[h], w[kk]);
            ctx.fillRect(gx + kk * cz, topY + q * cz, cz - 2, cz - 2);
            ctx.fillStyle = w[kk] > 0.55 ? "#0d1117" : c.dim; ctx.font = "9px sans-serif";
            ctx.fillText(w[kk].toFixed(2), gx + kk * cz + cz / 2, topY + q * cz + cz / 2);
          }
        }
      }
      ctx.textAlign = "start"; ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("Three heads run in parallel, each learning a different relation, then their outputs are concatenated.", 18, topY + n * cz + 30);
    }
    draw();
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    rd.innerHTML = "Each head is its own softmax-over-keys map. Head 1 attends to itself, Head 2 looks back one word, Head 3 fixes on 'sat'. Concatenating all three gives a richer per-token vector than any single head.";
    host.appendChild(rd);
  },
  title: "Multi-head attention",
  tagline: "Run several attention heads at once. Each learns a different relationship, then you stitch them together.",
  prereqs: ["mod-transformer"],
  bigIdea:
    `<p>One attention pattern can only focus on one kind of relationship at a time.</p>
     <p><b>Multi-head attention</b> runs several attentions side by side. Each <i>head</i> has its own query, key, and value vectors, so each learns to focus on something different.</p>
     <p>One head might track grammar, another might link a pronoun to its noun, another might watch the verb. You then glue the heads' outputs together.</p>`,
  buildup:
    `<p>We split the model's vector into $h$ smaller pieces, one per head. Each piece runs the same scaled-dot-product attention from the last lesson.</p>
     <p>Each head returns its own little output vector. We line them up side by side (concatenate), then mix them with one more weight matrix.</p>`,
  symbols: [
    { sym: "$h$", desc: "the number of heads (e.g. 8). Each head attends independently." },
    { sym: "$\\text{head}_i$", desc: "the output of head number $i$: its own scaled-dot-product attention." },
    { sym: "$W_i^Q, W_i^K, W_i^V$", desc: "the weight matrices that build head $i$'s own queries, keys, and values from the input." },
    { sym: "$\\text{Concat}$", desc: "concatenation: stack the head outputs side by side into one long vector." },
    { sym: "$W^O$", desc: "the output weight matrix. It mixes the concatenated heads back into the model's vector size." }
  ],
  formula: `$$ \\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)\\,W^O, \\quad \\text{head}_i = \\text{Attention}(QW_i^Q,\\,KW_i^K,\\,VW_i^V) $$`,
  whatItDoes:
    `<p>Each head projects the input into its own small query/key/value space and runs attention there. Because the projections differ, the heads notice different things.</p>
     <p>The concatenation lines up all the heads' answers, and $W^O$ blends them into a single output vector for each token.</p>`,
  derivation:
    `<p>Why split into heads instead of using one big attention? Look at the cost.</p>
     <ul class="steps">
       <li>Say the model vector has size $d$. One full-size head works in $d$ dimensions.</li>
       <li>Split into $h$ heads, each of size $d/h$. Each head's attention costs proportionally to its size, so the total work is about the same as one big head.</li>
       <li>But a single head produces one weighted average per token: one focus. With $h$ heads you get $h$ independent focuses for nearly the same cost.</li>
       <li>Concatenating gives back a length-$d$ vector ($h$ pieces of size $d/h$), so the rest of the network is unchanged.</li>
     </ul>
     <p>Same budget, many views. That is why every Transformer uses multiple heads. $\\blacksquare$</p>`,
  example:
    `<p>A model with vector size $d = 8$ and $h = 2$ heads. The input "cat" vector is split into two halves of size 4.</p>
     <ul class="steps">
       <li>Head 1 (first 4 dims) attends back to "The" and returns a 4-number vector, say $[0.2, 0.9, -0.1, 0.3]$.</li>
       <li>Head 2 (last 4 dims) attends to "sat" and returns $[0.5, -0.2, 0.7, 0.1]$.</li>
       <li>Concatenate: $[0.2, 0.9, -0.1, 0.3,\\; 0.5, -0.2, 0.7, 0.1]$, back to length 8.</li>
       <li>Multiply by $W^O$ to mix the two views into the final "cat" vector.</li>
     </ul>
     <p>One head caught the article, the other caught the verb. Combined, "cat" now knows about both.</p>`,
  application:
    `<p>GPT-style models use dozens of heads per layer. Researchers have found heads that specialize: some track sentence structure, some copy the previous token, some link quotes to speakers. Multi-head attention is why one layer can capture many kinds of relationships at once.</p>`,
  quiz: {
    q: `A model has vector size $d = 12$ and $h = 3$ heads. What size is each head's query vector, and what length is the concatenated output?`,
    a: `<p>Each head works in $12 / 3 = 4$ dimensions, so each query is length 4. Concatenating 3 heads of size 4 gives back length $3 \\times 4 = 12$.</p>`
  }
});

/* ================================================================ */
/* 3. LARGE LANGUAGE MODELS (BERT / GPT)                            */
/* ================================================================ */
L({
  id: "mod-llm",
  demo: function (host) {
    host.innerHTML = "";
    var vocab = ["mat", "sofa", "roof", "moon", "idea"];
    // fixed logits (raw scores) for the prompt "The cat sat on the ___"
    var logits = [3.2, 2.1, 1.0, -0.5, -1.5];
    var st = { temp: 1.0 };
    function probs() {
      var sc = logits.map(function (v) { return v / st.temp; });
      var mx = Math.max.apply(null, sc);
      var ex = sc.map(function (v) { return Math.exp(v - mx); });
      var Z = ex.reduce(function (a, b) { return a + b; }, 0);
      return ex.map(function (e) { return e / Z; });
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 280; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function draw() {
      var c = THEME();
      ctx.clearRect(0, 0, 640, 280);
      ctx.textBaseline = "middle"; ctx.textAlign = "start";
      ctx.fillStyle = c.ink; ctx.font = "13px sans-serif";
      ctx.fillText("Prompt:  “The cat sat on the ___”", 24, 30);
      var p = probs();
      var x0 = 120, y0 = 60, barMax = 420, rowH = 38;
      for (var i = 0; i < vocab.length; i++) {
        var y = y0 + i * rowH;
        ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "end";
        ctx.fillText(vocab[i], x0 - 12, y + 12);
        ctx.fillStyle = c.border; ctx.fillRect(x0, y, barMax, 24);
        var bw = Math.max(2, barMax * p[i]);
        ctx.fillStyle = i === 0 ? c.accent2 : c.accent; ctx.fillRect(x0, y, bw, 24);
        ctx.fillStyle = c.ink; ctx.font = "12px sans-serif"; ctx.textAlign = "start";
        ctx.fillText((p[i] * 100).toFixed(1) + "%", x0 + bw + 8, y + 12);
      }
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
      ctx.fillText("softmax over the vocabulary. All bars sum to 100%.", x0, y0 + vocab.length * rowH + 6);
    }
    var row = document.createElement("div"); row.style.margin = "8px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "temperature = 1.00 (lower = sharper, higher = flatter)";
    var inp = document.createElement("input"); inp.type = "range"; inp.min = 0.2; inp.max = 3; inp.step = 0.1; inp.value = 1;
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    function refresh() {
      draw();
      var p = probs();
      rd.innerHTML = "Top guess: <b>" + vocab[0] + "</b> at <b>" + (p[0] * 100).toFixed(1) +
        "%</b>. Low temperature makes the model confident (one tall bar); high temperature flattens it toward a uniform guess.";
    }
    inp.addEventListener("input", function () { st.temp = parseFloat(inp.value); lab.textContent = "temperature = " + st.temp.toFixed(2) + " (lower = sharper, higher = flatter)"; refresh(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row); host.appendChild(rd);
    refresh();
  },
  title: "Large Language Models (BERT / GPT)",
  tagline: "Predict the next word over and over. Do it on the whole internet and language understanding falls out.",
  prereqs: ["mod-transformer", "prob-normal"],
  bigIdea:
    `<p>A <b>large language model</b> (LLM) is a giant Transformer trained on a simple game: guess the next word.</p>
     <p>Two famous styles. <b>GPT</b> reads left to right and predicts the <i>next</i> token. <b>BERT</b> sees the whole sentence and predicts <i>masked</i> (hidden) tokens.</p>
     <p>This is <b>pretraining</b>: cheap because the text is its own answer key. Afterward you <b>fine-tune</b> the model on a smaller, specific task.</p>`,
  buildup:
    `<p>The model turns its final token vector into one raw score (a <i>logit</i>) for every word in its vocabulary.</p>
     <p>A softmax turns those scores into probabilities that sum to 1. The biggest probability is the model's top guess for the next word.</p>`,
  symbols: [
    { sym: "$x_{1:t}$", desc: "the prompt so far: the tokens from position 1 up to $t$." },
    { sym: "$z_v$", desc: "the logit (raw score) for vocabulary word $v$, before softmax." },
    { sym: "$P(x_{t+1} \\mid x_{1:t})$", desc: "the probability of the next word given everything before it." },
    { sym: "$V$", desc: "the vocabulary: the full list of words (or tokens) the model can output." },
    { sym: "$T$", desc: "the temperature: a knob that sharpens ($T&lt;1$) or flattens ($T&gt;1$) the probabilities." }
  ],
  formula: `$$ P(x_{t+1} = v \\mid x_{1:t}) = \\frac{\\exp(z_v / T)}{\\sum_{u \\in V} \\exp(z_u / T)} $$`,
  whatItDoes:
    `<p>The model scores every possible next word, then the softmax converts scores to probabilities. Training nudges the weights so the true next word gets a high probability.</p>
     <p>The temperature $T$ reshapes the output. Small $T$ makes the top word dominate (focused, repetitive). Large $T$ evens the bars out (creative, riskier).</p>`,
  derivation:
    `<p>Why does next-token prediction teach so much? Because the chain rule of probability says the likelihood of a whole text factors into per-word predictions.</p>
     <ul class="steps">
       <li>The probability of a sentence is $P(x_1, x_2, \\dots, x_n)$.</li>
       <li>By the product rule, split it one word at a time: $P(x_1)\\,P(x_2 \\mid x_1)\\,P(x_3 \\mid x_1 x_2)\\cdots$.</li>
       <li>So $P(\\text{sentence}) = \\prod_{t} P(x_t \\mid x_{1:t-1})$. Every factor is exactly one next-token prediction.</li>
       <li>Maximizing the sentence's likelihood is the same as getting each next-word prediction right. To do that across all human text, the model must learn grammar, facts, and reasoning.</li>
     </ul>
     <p>One humble objective, predict the next token, secretly forces the model to model the world. $\\blacksquare$</p>`,
  example:
    `<p>Prompt: "The cat sat on the ___". Logits over a tiny vocabulary are $z = [3.2, 2.1, 1.0]$ for ["mat", "sofa", "roof"]. Use temperature $T = 1$.</p>
     <ul class="steps">
       <li>Exponentiate: $e^{3.2} \\approx 24.5$, $e^{2.1} \\approx 8.2$, $e^{1.0} \\approx 2.7$. Sum $\\approx 35.4$.</li>
       <li>Probabilities: $24.5/35.4 \\approx 0.69$, $8.2/35.4 \\approx 0.23$, $2.7/35.4 \\approx 0.08$.</li>
       <li>"mat" wins at 69%. The model would likely emit "mat".</li>
       <li>Raise temperature to $T = 2$: scores become $[1.6, 1.05, 0.5]$, probabilities flatten to about $0.52, 0.30, 0.17$. Less sure, more varied.</li>
     </ul>`,
  application:
    `<p>GPT models power chatbots and coding assistants by sampling next tokens one at a time. BERT's masked-token pretraining made it a workhorse for search ranking, sentiment, and question answering. Both start from the same idea: learn language by filling in the blanks, then fine-tune.</p>`,
  quiz: {
    q: `Logits for ["yes", "no"] are $[2, 0]$ at temperature $T = 1$. What probability does the model give "yes"? (Use $e^2 \\approx 7.39$.)`,
    a: `<p>$P(\\text{yes}) = \\frac{e^2}{e^2 + e^0} = \\frac{7.39}{7.39 + 1} = \\frac{7.39}{8.39} \\approx 0.88$, about 88%.</p>`
  }
});

/* ================================================================ */
/* 4. AUTOENCODERS                                                  */
/* ================================================================ */
L({
  id: "mod-autoencoder",
  demo: function (host) {
    host.innerHTML = "";
    // input -> bottleneck(2) -> reconstruction. Fixed linear weights.
    var st = { x: [0.8, 0.2, 0.9, 0.1, 0.6] };
    // encoder: 5 -> 2 ; decoder: 2 -> 5
    var We = [
      [0.5, 0.1, 0.5, 0.0, 0.3],
      [0.0, 0.6, 0.1, 0.6, 0.2]
    ];
    var Wd = [
      [0.9, 0.0], [0.1, 0.8], [0.9, 0.1], [0.0, 0.9], [0.4, 0.3]
    ];
    function encode(x) { return [ We[0].reduce(function (s, w, i) { return s + w * x[i]; }, 0), We[1].reduce(function (s, w, i) { return s + w * x[i]; }, 0) ]; }
    function decode(z) { return Wd.map(function (roww) { return roww[0] * z[0] + roww[1] * z[1]; }); }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function bar(x, y, w, h, val, col, cap) {
      var c = THEME();
      ctx.fillStyle = c.border; ctx.fillRect(x, y, w, h);
      var fh = Math.max(1, Math.min(1, Math.abs(val) / cap) * h);
      ctx.fillStyle = col; ctx.fillRect(x, y + h - fh, w, fh);
      ctx.fillStyle = c.dim; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(val.toFixed(2), x + w / 2, y + h + 10);
    }
    function draw() {
      var c = THEME();
      ctx.clearRect(0, 0, 640, 300);
      ctx.textBaseline = "middle";
      var z = encode(st.x), r = decode(z);
      var topY = 50;
      // input column
      ctx.textAlign = "center"; ctx.fillStyle = c.ink; ctx.font = "12px sans-serif";
      ctx.fillText("input (5)", 70, 30);
      for (var ii = 0; ii < 5; ii++) bar(45, topY + ii * 26, 50, 22, st.x[ii], c.accent2, 1.5);
      // code column (bottleneck)
      ctx.fillStyle = c.warn; ctx.font = "12px sans-serif"; ctx.fillText("code (2)", 300, 30);
      for (var j = 0; j < 2; j++) bar(275, topY + 40 + j * 60, 50, 40, z[j], c.warn, 2);
      // reconstruction column
      ctx.fillStyle = c.ink; ctx.font = "12px sans-serif"; ctx.fillText("reconstruction (5)", 555, 30);
      for (var k = 0; k < 5; k++) bar(530, topY + k * 26, 50, 22, r[k], c.accent, 1.5);
      // arrows
      ctx.strokeStyle = c.dim; ctx.lineWidth = 1.5; ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
      ctx.beginPath(); ctx.moveTo(100, 130); ctx.lineTo(270, 130); ctx.stroke();
      ctx.fillText("encoder", 185, 118);
      ctx.beginPath(); ctx.moveTo(330, 130); ctx.lineTo(525, 130); ctx.stroke();
      ctx.fillText("decoder", 425, 118);
    }
    function sliders() {
      for (var i = 0; i < 5; i++) (function (idx) {
        var rw = document.createElement("div"); rw.style.margin = "4px 0";
        var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "input x" + (idx + 1) + " = " + st.x[idx].toFixed(2);
        var inp = document.createElement("input"); inp.type = "range"; inp.min = 0; inp.max = 1; inp.step = 0.05; inp.value = st.x[idx];
        inp.addEventListener("input", function () { st.x[idx] = parseFloat(inp.value); lab.textContent = "input x" + (idx + 1) + " = " + st.x[idx].toFixed(2); refresh(); });
        rw.appendChild(lab); rw.appendChild(inp); host.appendChild(rw);
      })(i);
    }
    sliders();
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    function refresh() {
      draw();
      var z = encode(st.x), r = decode(z);
      var err = 0; for (var i = 0; i < 5; i++) err += Math.pow(st.x[i] - r[i], 2); err /= 5;
      rd.innerHTML = "5 numbers → squeezed into code [" + z.map(function (v) { return v.toFixed(2); }).join(", ") +
        "] → rebuilt to 5 numbers.<br>reconstruction error (mean squared) = <b>" + err.toFixed(4) +
        "</b>. The bottleneck forces the model to keep only what matters.";
    }
    refresh();
  },
  title: "Autoencoders",
  tagline: "Squeeze the input through a tiny bottleneck, then rebuild it. What survives is the essence.",
  prereqs: ["dl-backprop", "dl-neuron"],
  bigIdea:
    `<p>An <b>autoencoder</b> is a network that tries to copy its input to its output. But there is a catch in the middle.</p>
     <p>The <b>encoder</b> squeezes the input down to a few numbers, called the <b>code</b> or <b>bottleneck</b>. The <b>decoder</b> expands those few numbers back to a full reconstruction.</p>
     <p>Because the bottleneck is small, the network cannot just copy everything. It must keep only the important structure. That compressed code is a learned summary of the data.</p>`,
  buildup:
    `<p>The training signal is simple: make the output look like the input. We measure the gap with a <b>reconstruction loss</b>, usually mean squared error.</p>
     <p>No labels are needed. The input is its own target. So autoencoders learn from raw, unlabeled data.</p>`,
  symbols: [
    { sym: "$x$", desc: "the input vector: the original numbers we feed in." },
    { sym: "$z$", desc: "the code (bottleneck): a short vector, much smaller than $x$." },
    { sym: "$f(x)$", desc: "the encoder: the function that compresses $x$ into $z$." },
    { sym: "$g(z)$", desc: "the decoder: the function that expands $z$ back into a reconstruction $\\hat{x}$." },
    { sym: "$\\hat{x}$", desc: "the reconstruction: the decoder's attempt to rebuild $x$." },
    { sym: "$\\lVert x - \\hat{x} \\rVert^2$", desc: "the squared error between input and reconstruction, summed over all entries." }
  ],
  formula: `$$ z = f(x), \\quad \\hat{x} = g(z), \\quad \\mathcal{L} = \\lVert x - \\hat{x} \\rVert^2 = \\sum_i (x_i - \\hat{x}_i)^2 $$`,
  whatItDoes:
    `<p>The encoder $f$ maps a big input to a tiny code. The decoder $g$ maps the tiny code back to full size.</p>
     <p>The loss $\\mathcal{L}$ is small only when the rebuilt $\\hat{x}$ matches the original $x$. Minimizing it forces the code to carry the input's essential information.</p>`,
  derivation:
    `<p>Why does a narrow bottleneck force useful learning? Think about information.</p>
     <ul class="steps">
       <li>Suppose the input has 5 numbers but the code holds only 2. The decoder must rebuild 5 numbers from 2.</li>
       <li>If the 5 inputs were truly independent, this is impossible: you cannot pack 5 free numbers into 2 without loss.</li>
       <li>So the network can only succeed if the data has structure: the 5 inputs are correlated and really live on a 2-D surface.</li>
       <li>To minimize $\\mathcal{L}$, the encoder is pushed to find those 2 directions that explain the data best. With linear layers and squared loss, those directions are exactly the top principal components (PCA).</li>
     </ul>
     <p>The bottleneck turns "copy the input" into "find the hidden low-dimensional structure." $\\blacksquare$</p>`,
  example:
    `<p>Input $x = [0.8, 0.2, 0.9, 0.1, 0.6]$. The encoder squeezes it to a 2-number code $z = [1.1, 0.4]$. The decoder rebuilds $\\hat{x} = [0.79, 0.25, 0.85, 0.18, 0.55]$.</p>
     <ul class="steps">
       <li>Compare entry by entry: gaps are $0.01, 0.05, 0.05, 0.08, 0.05$.</li>
       <li>Square them: $0.0001, 0.0025, 0.0025, 0.0064, 0.0025$.</li>
       <li>Average: $(0.0001 + 0.0025 + 0.0025 + 0.0064 + 0.0025)/5 = 0.0140/5 = 0.0028$. Small error.</li>
       <li>So 5 numbers were faithfully captured by just 2. The code is a compressed summary.</li>
     </ul>`,
  application:
    `<p>Autoencoders power denoising (rebuild a clean image from a noisy one), anomaly detection (a fraud transaction reconstructs badly, so its error spikes), and dimensionality reduction for visualizing high-dimensional data.</p>`,
  quiz: {
    q: `An autoencoder reconstructs $x = [1, 0]$ as $\\hat{x} = [0.8, 0.1]$. What is the squared-error reconstruction loss?`,
    a: `<p>$\\mathcal{L} = (1 - 0.8)^2 + (0 - 0.1)^2 = 0.04 + 0.01 = 0.05$.</p>`
  }
});

/* ================================================================ */
/* 5. VARIATIONAL AUTOENCODERS (VAE)                               */
/* ================================================================ */
L({
  id: "mod-vae",
  demo: function (host) {
    host.innerHTML = "";
    // 2-D latent space; a point (z1,z2) decodes to a small 1-D "shape" curve.
    var st = { z1: 0.0, z2: 0.0 };
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    // decode latent (z1,z2) into 12 output values forming a smooth morphing curve
    function decode(z1, z2) {
      var out = [];
      for (var i = 0; i < 12; i++) {
        var t = i / 11;
        var v = 0.5 + 0.35 * Math.sin(2 * Math.PI * t + z1) + 0.25 * z2 * Math.cos(Math.PI * t);
        out.push(Math.max(0, Math.min(1, v)));
      }
      return out;
    }
    function draw() {
      var c = THEME();
      ctx.clearRect(0, 0, 640, 320);
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      // left: latent plane
      var px = 40, py = 50, pw = 220, ph = 220;
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(px, py, pw, ph);
      ctx.beginPath(); ctx.moveTo(px + pw / 2, py); ctx.lineTo(px + pw / 2, py + ph); ctx.moveTo(px, py + ph / 2); ctx.lineTo(px + pw, py + ph / 2); ctx.stroke();
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
      ctx.fillText("latent space (z1, z2)", px + pw / 2, py - 16);
      ctx.fillText("z1 →", px + pw - 18, py + ph / 2 - 10);
      ctx.fillText("z2 ↑", px + pw / 2 + 18, py + 12);
      // the chosen latent point
      var cx = px + pw / 2 + st.z1 * (pw / 6);
      var cy = py + ph / 2 - st.z2 * (ph / 6);
      cx = Math.max(px, Math.min(px + pw, cx)); cy = Math.max(py, Math.min(py + ph, cy));
      ctx.fillStyle = c.purple; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, 7); ctx.fill();
      // right: decoded output as a curve
      var ox = 320, oy = 70, ow = 280, oh = 180;
      ctx.strokeStyle = c.border; ctx.strokeRect(ox, oy, ow, oh);
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.fillText("generated output", ox + ow / 2, oy - 16);
      var out = decode(st.z1, st.z2);
      ctx.beginPath();
      for (var i = 0; i < out.length; i++) {
        var X = ox + (i / (out.length - 1)) * ow;
        var Y = oy + oh - out[i] * oh;
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.strokeStyle = c.accent2; ctx.lineWidth = 2.5; ctx.stroke();
      for (var j = 0; j < out.length; j++) {
        var X2 = ox + (j / (out.length - 1)) * ow, Y2 = oy + oh - out[j] * oh;
        ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(X2, Y2, 3, 0, 7); ctx.fill();
      }
    }
    var sliderInputs = [];
    function slider(label, key) {
      var rowEl = document.createElement("div"); rowEl.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key].toFixed(2);
      var inp = document.createElement("input"); inp.type = "range"; inp.min = -3; inp.max = 3; inp.step = 0.1; inp.value = st[key];
      inp.dataset_key = key; sliderInputs.push({ inp: inp, lab: lab, key: key, label: label });
      inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key].toFixed(2); refresh(); });
      rowEl.appendChild(lab); rowEl.appendChild(inp); host.appendChild(rowEl);
    }
    slider("latent z1", "z1"); slider("latent z2", "z2");
    var btn = document.createElement("button"); btn.textContent = "sample a random latent z ~ N(0, I)";
    btn.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin:8px 0";
    function gauss() { var u = Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u + 1e-9)) * Math.cos(2 * Math.PI * v); }
    btn.addEventListener("click", function () {
      st.z1 = Math.max(-3, Math.min(3, gauss())); st.z2 = Math.max(-3, Math.min(3, gauss()));
      sliderInputs.forEach(function (s) { s.inp.value = st[s.key]; s.lab.textContent = s.label + " = " + st[s.key].toFixed(2); });
      refresh();
    });
    host.appendChild(btn);
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
    function refresh() {
      draw();
      rd.innerHTML = "Latent point z = (" + st.z1.toFixed(2) + ", " + st.z2.toFixed(2) +
        "). Drag the sliders or sample from N(0, I) to move smoothly across outputs. Nearby latents → similar outputs, so the space morphs continuously.";
    }
    refresh();
  },
  title: "Variational Autoencoders (VAE)",
  tagline: "Encode to a distribution, not a point. Sample it, decode it, and you can generate brand-new data.",
  prereqs: ["mod-autoencoder", "prob-normal"],
  bigIdea:
    `<p>A plain autoencoder maps each input to one point in the code space. Gaps between points decode to garbage, so you cannot generate new samples.</p>
     <p>A <b>variational autoencoder</b> fixes this. The encoder outputs a small <i>distribution</i> for each input: a mean $\\mu$ and a spread $\\sigma$.</p>
     <p>We sample a code from that distribution, then decode it. Training packs all the distributions near a standard bell curve, so the whole space is smooth. To generate, just sample a random code and decode.</p>`,
  buildup:
    `<p>The loss has two jobs. <b>Reconstruction</b> keeps the decoded output close to the input. The <b>KL term</b> pulls each encoded distribution toward the standard normal $N(0, 1)$.</p>
     <p>The KL term is what makes the latent space tidy and continuous. Without it, you would just have a regular autoencoder again.</p>`,
  symbols: [
    { sym: "$x$", desc: "the input we want to encode and rebuild." },
    { sym: "$\\mu$", desc: "the mean vector the encoder outputs: the center of the code distribution." },
    { sym: "$\\sigma$", desc: "the standard-deviation vector: how much spread (uncertainty) the code has." },
    { sym: "$\\epsilon$", desc: "random noise drawn from the standard normal $N(0, 1)$." },
    { sym: "$z$", desc: "a code sampled from the distribution $N(\\mu, \\sigma^2)$." },
    { sym: "$\\hat{x}$", desc: "the decoder's reconstruction of $x$ from the sampled code $z$." },
    { sym: "$\\odot$", desc: "element-wise multiply: multiply matching entries of two vectors." },
    { sym: "$D_{KL}$", desc: "the KL divergence: a number measuring how far the encoded distribution is from $N(0, 1)$." }
  ],
  formula: `$$ z = \\mu + \\sigma \\odot \\epsilon, \\;\\; \\epsilon \\sim N(0, I); \\qquad \\mathcal{L} = \\underbrace{\\lVert x - \\hat{x} \\rVert^2}_{\\text{reconstruction}} + \\underbrace{D_{KL}\\!\\big(N(\\mu,\\sigma^2)\\,\\Vert\\,N(0,1)\\big)}_{\\text{keep latent tidy}} $$`,
  whatItDoes:
    `<p>The encoder outputs $\\mu$ and $\\sigma$. We sample noise $\\epsilon$ and form $z = \\mu + \\sigma\\epsilon$ (the "reparameterization trick"), which lets gradients flow through the random step.</p>
     <p>The decoder rebuilds $x$ from $z$. The reconstruction term keeps outputs faithful; the KL term keeps all codes near the standard bell curve so the space is smooth and samplable.</p>`,
  derivation:
    `<p>Why does $z = \\mu + \\sigma\\epsilon$ let us train through randomness? The problem: you cannot backpropagate through "draw a random sample."</p>
     <ul class="steps">
       <li>We want gradients of the loss with respect to $\\mu$ and $\\sigma$, but sampling $z \\sim N(\\mu, \\sigma^2)$ is a random, non-differentiable step.</li>
       <li>Reparameterize: move the randomness outside. Sample fixed noise $\\epsilon \\sim N(0, 1)$, then compute $z = \\mu + \\sigma\\epsilon$.</li>
       <li>This $z$ has the same distribution $N(\\mu, \\sigma^2)$, because shifting a standard normal by $\\mu$ and scaling by $\\sigma$ gives exactly that.</li>
       <li>Now $z$ is a smooth function of $\\mu$ and $\\sigma$ (with $\\epsilon$ a constant), so $\\frac{\\partial z}{\\partial \\mu} = 1$ and $\\frac{\\partial z}{\\partial \\sigma} = \\epsilon$. Gradients flow.</li>
     </ul>
     <p>The randomness is pushed into $\\epsilon$, leaving a differentiable path to the parameters. $\\blacksquare$</p>`,
  example:
    `<p>The encoder outputs $\\mu = 0.5$, $\\sigma = 0.2$ for one latent dimension. We sample noise $\\epsilon = 1.3$.</p>
     <ul class="steps">
       <li>Form the code: $z = \\mu + \\sigma\\epsilon = 0.5 + 0.2 \\times 1.3 = 0.5 + 0.26 = 0.76$.</li>
       <li>Sample again with $\\epsilon = -0.5$: $z = 0.5 + 0.2 \\times (-0.5) = 0.4$. Same input, slightly different code each time.</li>
       <li>The decoder turns $0.76$ and $0.4$ into two similar-but-different outputs. That variety is what lets a VAE generate.</li>
       <li>The KL term meanwhile nudges $\\mu$ toward 0 and $\\sigma$ toward 1, keeping the code near a standard bell curve.</li>
     </ul>`,
  application:
    `<p>VAEs generate faces, molecules, and music, and they give a smooth latent space you can interpolate: walk from one face to another and every step in between is a plausible face. They are also used for anomaly detection and as a building block inside larger generative systems.</p>`,
  quiz: {
    q: `An encoder gives $\\mu = 1.0$ and $\\sigma = 0.5$. With sampled noise $\\epsilon = -2$, what code $z$ does the reparameterization trick produce?`,
    a: `<p>$z = \\mu + \\sigma\\epsilon = 1.0 + 0.5 \\times (-2) = 1.0 - 1.0 = 0$.</p>`
  }
});

/* ================================================================ */
/* 6. DIFFUSION MODELS                                              */
/* ================================================================ */
L({
  id: "mod-diffusion",
  demo: function (host) {
    host.innerHTML = "";
    // a clear 1-D pattern (a smooth bump) progressively noised, then denoised back.
    var N = 32, STEPS = 6;
    var clean = [];
    for (var i = 0; i < N; i++) { var t = i / (N - 1); clean.push(0.5 + 0.4 * Math.exp(-Math.pow((t - 0.5) * 5, 2))); }
    // precompute a fixed pseudo-noise field so forward/reverse are deterministic
    var noise = [];
    for (var s2 = 0; s2 <= STEPS; s2++) {
      var rowN = [];
      for (var j = 0; j < N; j++) {
        var raw = Math.sin(j * 12.9898 + s2 * 78.233) * 43758.5453;
        rowN.push(raw - Math.floor(raw)); // fractional part in [0,1)
      }
      noise.push(rowN);
    }
    var st = { step: 0 };  // 0 = clean, STEPS = full noise
    function noiseLevel(step) { return step / STEPS; }
    function signal(step) {
      var lvl = noiseLevel(step);
      var out = [];
      for (var i = 0; i < N; i++) {
        var nz = (noise[step][i] - 0.5) * 1.4;  // roughly [-0.7,0.7]
        var v = (1 - lvl) * clean[i] + lvl * (0.5 + nz);
        out.push(Math.max(0, Math.min(1, v)));
      }
      return out;
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function draw() {
      var c = THEME();
      ctx.clearRect(0, 0, 640, 300);
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      var ox = 40, oy = 50, ow = 560, oh = 180;
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(ox, oy, ow, oh);
      // clean reference (faint)
      ctx.strokeStyle = c.dim; ctx.lineWidth = 1; ctx.beginPath();
      for (var r = 0; r < N; r++) { var Xr = ox + (r / (N - 1)) * ow, Yr = oy + oh - clean[r] * oh; if (r === 0) ctx.moveTo(Xr, Yr); else ctx.lineTo(Xr, Yr); }
      ctx.stroke();
      // current signal
      var sig = signal(st.step);
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var i = 0; i < N; i++) { var X = ox + (i / (N - 1)) * ow, Y = oy + oh - sig[i] * oh; if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
      ctx.stroke();
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
      ctx.fillText("faint grey = original clean pattern,  blue = current noisy state", ox + ow / 2, oy - 14);
      var lvl = (noiseLevel(st.step) * 100).toFixed(0);
      ctx.fillStyle = c.warn; ctx.font = "13px sans-serif";
      ctx.fillText("step " + st.step + " of " + STEPS + "   →   noise level " + lvl + "%", ox + ow / 2, oy + oh + 28);
    }
    var row = document.createElement("div"); row.style.margin = "8px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "step 0 (clean)  —  slide right to add noise, left to denoise";
    var inp = document.createElement("input"); inp.type = "range"; inp.min = 0; inp.max = STEPS; inp.step = 1; inp.value = 0;
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    function refresh() {
      draw();
      var dir = st.step === 0 ? "clean data (start)" : (st.step === STEPS ? "pure noise (end of forward process)" : "partly noised");
      rd.innerHTML = "Forward process adds Gaussian noise step by step (left → right). Reverse process, learned by the network, removes it (right → left). Now showing: <b>" + dir + "</b>.";
    }
    inp.addEventListener("input", function () { st.step = parseInt(inp.value, 10); lab.textContent = "step " + st.step + (st.step === 0 ? " (clean)" : st.step === STEPS ? " (pure noise)" : "") + "  —  slide right to add noise, left to denoise"; refresh(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row); host.appendChild(rd);
    refresh();
  },
  title: "Diffusion models",
  tagline: "Destroy a picture with noise step by step, then teach a network to undo it. Run the undo from pure noise to create.",
  prereqs: ["dl-backprop", "prob-normal"],
  bigIdea:
    `<p>A <b>diffusion model</b> learns to generate by first learning to destroy, then reversing it.</p>
     <p>The <b>forward process</b> takes a clean image and adds a little Gaussian noise, again and again, until it is pure static. This part is fixed, no learning needed.</p>
     <p>The <b>reverse process</b> is what we train. A network looks at a noisy image and predicts the noise to subtract. Run it from pure static and, step by step, a brand-new image appears.</p>`,
  buildup:
    `<p>At each forward step, the image $x_{t-1}$ becomes a slightly noisier $x_t$. After many steps, all structure is gone and $x_T$ is just Gaussian noise.</p>
     <p>The network is trained to predict the noise $\\epsilon$ that was added. If it can name the noise, it can remove it, walking the chain backward.</p>`,
  symbols: [
    { sym: "$x_0$", desc: "the clean starting data (e.g. a real image)." },
    { sym: "$x_t$", desc: "the data after $t$ steps of added noise. Bigger $t$ means noisier." },
    { sym: "$T$", desc: "the total number of noising steps. At $x_T$ the image is pure noise." },
    { sym: "$\\beta_t$", desc: "the noise schedule: how much fresh noise to add at step $t$ (a small positive fraction)." },
    { sym: "$\\epsilon$", desc: "the random Gaussian noise drawn from $N(0, 1)$ and added at a step." },
    { sym: "$\\theta$", desc: "the network's weights (Greek 'theta')." },
    { sym: "$\\epsilon_\\theta(x_t, t)$", desc: "the network's prediction of the noise present in $x_t$, given the step $t$." }
  ],
  formula: `$$ \\text{forward: } x_t = \\sqrt{1-\\beta_t}\\,x_{t-1} + \\sqrt{\\beta_t}\\,\\epsilon \\qquad \\text{train: } \\min_\\theta \\; \\big\\lVert \\epsilon - \\epsilon_\\theta(x_t, t) \\big\\rVert^2 $$`,
  whatItDoes:
    `<p>The forward formula blends a shrunk copy of the previous image with a dash of fresh noise. Repeat $T$ times and the picture dissolves into static.</p>
     <p>Training shows the network a noisy $x_t$ and asks it to guess the noise $\\epsilon$. The loss is the gap between the true noise and the guess. Once trained, subtract the predicted noise step by step to denoise, even starting from pure static.</p>`,
  derivation:
    `<p>Why does $\\sqrt{1-\\beta_t}$ in front and $\\sqrt{\\beta_t}$ on the noise keep things stable? It preserves the variance.</p>
     <ul class="steps">
       <li>Assume $x_{t-1}$ has variance 1 and the noise $\\epsilon$ has variance 1, and they are independent.</li>
       <li>Then $\\text{Var}(x_t) = (1-\\beta_t)\\,\\text{Var}(x_{t-1}) + \\beta_t\\,\\text{Var}(\\epsilon)$.</li>
       <li>Substitute: $(1-\\beta_t)\\cdot 1 + \\beta_t \\cdot 1 = 1$.</li>
       <li>So the variance stays at 1 at every step. The signal never explodes or vanishes; it just gradually trades structure for noise.</li>
     </ul>
     <p>The two square roots are chosen exactly so the total energy is conserved across all $T$ steps. $\\blacksquare$</p>`,
  example:
    `<p>One forward step with $\\beta_t = 0.2$. A pixel has value $x_{t-1} = 0.9$ and the drawn noise is $\\epsilon = -1.0$.</p>
     <ul class="steps">
       <li>Keep factor: $\\sqrt{1 - 0.2} = \\sqrt{0.8} \\approx 0.894$.</li>
       <li>Noise factor: $\\sqrt{0.2} \\approx 0.447$.</li>
       <li>New pixel: $x_t = 0.894 \\times 0.9 + 0.447 \\times (-1.0) = 0.805 - 0.447 = 0.358$.</li>
       <li>The pixel shifted toward noise. After many such steps it forgets its original value entirely.</li>
     </ul>
     <p>To reverse, the network would predict that $\\epsilon \\approx -1.0$ was added, and subtract it to recover $0.9$.</p>`,
  application:
    `<p>Diffusion models power Stable Diffusion, DALL-E, and Midjourney for image generation, plus tools for video, audio, and 3-D shapes. They produce sharp, diverse samples and are now the dominant approach to image generation.</p>`,
  quiz: {
    q: `In a forward step with $\\beta_t = 0.5$, what are the keep factor $\\sqrt{1-\\beta_t}$ and the noise factor $\\sqrt{\\beta_t}$?`,
    a: `<p>Keep factor $\\sqrt{1 - 0.5} = \\sqrt{0.5} \\approx 0.707$. Noise factor $\\sqrt{0.5} \\approx 0.707$. At $\\beta_t = 0.5$ the image and the noise are mixed in equal measure.</p>`
  }
});

/* ================================================================ */
/* 7. NORMALIZING FLOWS                                             */
/* ================================================================ */
L({
  id: "mod-normalizing-flows",
  demo: function (host) {
    host.innerHTML = "";
    // push a 1-D Gaussian through an invertible transform x = g(u) into a bimodal density.
    var st = { sep: 1.6 };  // how far the two modes split
    // transform: x = u + sep * tanh(u)  (invertible, monotonic: derivative > 0)
    function g(u) { return u + st.sep * Math.tanh(u); }
    function gp(u) { var th = Math.tanh(u); return 1 + st.sep * (1 - th * th); } // derivative, always > 0
    function basePdf(u) { return Math.exp(-u * u / 2) / Math.sqrt(2 * Math.PI); }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function draw() {
      var c = THEME();
      ctx.clearRect(0, 0, 640, 320);
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      // left: base Gaussian over u
      var ax = 40, ay = 50, aw = 250, ah = 200;
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.strokeRect(ax, ay, aw, ah);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.fillText("base density: Gaussian in u", ax + aw / 2, ay - 14);
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      // scale so the whole Gaussian peak fits inside the panel with headroom:
      // peak basePdf(0) ≈ 0.399 should reach ~85% of the panel height, not overshoot it
      var baseScale = (ah * 0.85) / basePdf(0);
      for (var i = 0; i <= 120; i++) {
        var u = -4 + (8 * i) / 120; var p = basePdf(u);
        var X = ax + ((u + 4) / 8) * aw; var Y = ay + ah - p * baseScale;
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      // right: transformed density via change of variables p_x(x) = p_u(u)/|g'(u)|
      var bx = 350, by = 50, bw = 250, bh = 200;
      ctx.strokeStyle = c.border; ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.fillText("transformed density in x (bimodal)", bx + bw / 2, by - 14);
      ctx.strokeStyle = c.accent2; ctx.lineWidth = 2.5; ctx.beginPath();
      var first = true;
      var span = 4 + st.sep;
      for (var k = 0; k <= 200; k++) {
        var uu = -4 + (8 * k) / 200;
        var x = g(uu); var px = basePdf(uu) / Math.abs(gp(uu));
        var X2 = bx + ((x + span) / (2 * span)) * bw;
        var Y2 = by + bh - px * bh * 4.8;
        if (X2 < bx || X2 > bx + bw) { first = true; continue; }
        if (first) { ctx.moveTo(X2, Y2); first = false; } else ctx.lineTo(X2, Y2);
      }
      ctx.stroke();
      // arrow between
      ctx.strokeStyle = c.dim; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(295, 150); ctx.lineTo(345, 150); ctx.stroke();
      ctx.fillStyle = c.purple; ctx.font = "12px sans-serif"; ctx.fillText("x = g(u)", 320, 132);
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
      ctx.fillText("invertible transform stretches the single hump into two", 320, by + bh + 36);
    }
    var row = document.createElement("div"); row.style.margin = "8px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "mode separation = 1.60";
    var inp = document.createElement("input"); inp.type = "range"; inp.min = 0; inp.max = 3; inp.step = 0.1; inp.value = 1.6;
    var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";
    function refresh() {
      draw();
      rd.innerHTML = "Transform x = u + " + st.sep.toFixed(2) + "·tanh(u). At separation 0 it is the identity (still one Gaussian hump). " +
        "Increase it and the single hump splits into two peaks. The density divides by |g'(u)| so it still integrates to 1.";
    }
    inp.addEventListener("input", function () { st.sep = parseFloat(inp.value); lab.textContent = "mode separation = " + st.sep.toFixed(2); refresh(); });
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row); host.appendChild(rd);
    refresh();
  },
  title: "Normalizing flows",
  tagline: "Bend a plain Gaussian through an invertible map into any shape, and read off the exact probability.",
  prereqs: ["prob-normal", "dl-backprop"],
  bigIdea:
    `<p>A <b>normalizing flow</b> builds a complex probability distribution out of a simple one.</p>
     <p>Start with an easy density, a standard Gaussian. Pass each sample through an <b>invertible</b> transform $g$. The Gaussian gets stretched and folded into a rich, multi-peaked shape.</p>
     <p>Because $g$ can be undone, you also get the <i>exact</i> probability of any data point, something GANs and VAEs only approximate.</p>`,
  buildup:
    `<p>The key tool is the <b>change-of-variables</b> formula. When you transform a random variable, its density does not just move, it also rescales by how much the transform stretches space.</p>
     <p>That stretch factor is the absolute derivative $|g'(u)|$ in 1-D (the Jacobian determinant in higher dimensions). Dividing by it keeps the total probability equal to 1.</p>`,
  symbols: [
    { sym: "$u$", desc: "a sample from the simple base distribution (a standard Gaussian)." },
    { sym: "$x$", desc: "the transformed sample, $x = g(u)$, living in the complex target distribution." },
    { sym: "$g$", desc: "the invertible transform from base to data. It must be reversible: $u = g^{-1}(x)$." },
    { sym: "$g^{-1}(x)$", desc: "the inverse transform: run a data point $x$ backward to its base point $u$." },
    { sym: "$p_u(u)$", desc: "the base density: the standard Gaussian probability at $u$." },
    { sym: "$p_x(x)$", desc: "the data density we want: the probability of the transformed point $x$." },
    { sym: "$\\left|\\frac{dg^{-1}}{dx}\\right|$", desc: "the absolute derivative of the inverse: how much $g$ stretches space near $x$. In many dimensions this is the Jacobian determinant." }
  ],
  formula: `$$ p_x(x) = p_u\\big(g^{-1}(x)\\big)\\,\\left| \\frac{d\\,g^{-1}(x)}{dx} \\right| $$`,
  whatItDoes:
    `<p>To find the probability of a data point $x$, first run it backward through $g^{-1}$ to get the matching base point $u$. Look up its easy Gaussian probability.</p>
     <p>Then correct for stretching: multiply by the absolute derivative of $g^{-1}$. Where $g$ spreads points apart, the density thins out; where it squeezes them together, the density piles up.</p>`,
  derivation:
    `<p>Why does the derivative term appear at all? It comes from conserving probability mass.</p>
     <ul class="steps">
       <li>Probability in a tiny interval must be preserved by the map: $p_x(x)\\,|dx| = p_u(u)\\,|du|$.</li>
       <li>The widths relate through the transform: $|dx| = |g'(u)|\\,|du|$, since $g$ stretches the interval by its slope.</li>
       <li>Substitute and solve for $p_x$: $p_x(x) = p_u(u)\\,\\dfrac{|du|}{|dx|} = \\dfrac{p_u(u)}{|g'(u)|}$.</li>
       <li>Writing $u = g^{-1}(x)$ and using $\\frac{d g^{-1}}{dx} = \\frac{1}{g'(u)}$ gives the boxed formula above.</li>
     </ul>
     <p>The Jacobian factor is just bookkeeping so that no probability is created or lost while space is bent. $\\blacksquare$</p>`,
  example:
    `<p>Use a simple stretch $x = g(u) = 2u$, so $g^{-1}(x) = x/2$ and $\\frac{d g^{-1}}{dx} = \\frac{1}{2}$. Take the base point $u = 0$ where $p_u(0) = \\frac{1}{\\sqrt{2\\pi}} \\approx 0.399$.</p>
     <ul class="steps">
       <li>The data point is $x = g(0) = 0$.</li>
       <li>Stretch factor: $\\left|\\frac{d g^{-1}}{dx}\\right| = \\frac{1}{2}$.</li>
       <li>Apply the formula: $p_x(0) = p_u(0) \\times \\frac{1}{2} = 0.399 \\times 0.5 \\approx 0.199$.</li>
       <li>Makes sense: doubling spreads the bell over twice the width, so its peak height drops by half.</li>
     </ul>`,
  application:
    `<p>Normalizing flows give exact likelihoods, so they are used for density estimation, anomaly detection (low-probability points are flagged), and generating audio, where the invertible WaveGlow flow produces speech in real time.</p>`,
  quiz: {
    q: `A flow uses $x = g(u) = 3u$, so $g^{-1}(x) = x/3$ and the stretch factor is $\\frac{1}{3}$. If the base density at the matching $u$ is $p_u(u) = 0.3$, what is $p_x(x)$?`,
    a: `<p>$p_x(x) = p_u(u) \\times \\left|\\frac{d g^{-1}}{dx}\\right| = 0.3 \\times \\frac{1}{3} = 0.1$. Stretching by 3 thins the density to one third.</p>`
  }
});

})();
