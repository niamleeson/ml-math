/* =====================================================================
   MODULE 8 — ARTIFICIAL INTELLIGENCE — MORE.
   Extra AI lessons that sit beside Module 4 (CS221): relaxed heuristics,
   structured perceptron, model-free RL (Monte Carlo, SARSA/TD), game
   theory, exact and approximate inference, the Markov blanket, HMM
   smoothing, LDA, and first-order logic.
   Same lesson style as the rest of the course:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real derivation, proved with ∎
     - a bespoke, theme-aware canvas demo that renders on load
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Artificial Intelligence — more";
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

/* ---------------------------------------------------------------- */
L({
  id: "aix-relaxation",
  demo: function (host) {
    // A small 5x5 maze. Toggle "remove walls": with walls the true path winds
    // around; with walls removed the agent goes straight, and that straight
    // (Manhattan) distance is the relaxed heuristic h. h is always <= true cost.
    host.innerHTML = "";
    var ROWS = 5, COLS = 5, cz = 56, ox = 20, oy = 20;
    var start = { r: 0, c: 0 }, goal = { r: 4, c: 4 };
    // walls between cells force a detour; true shortest path length here is 12 steps
    var walls = { "1,0": 1, "1,1": 1, "1,2": 1, "1,3": 1, "3,1": 1, "3,2": 1, "3,3": 1, "3,4": 1 };
    var removed = false;
    function manhattan() { return Math.abs(goal.r - start.r) + Math.abs(goal.c - start.c); }
    // BFS through the open cells to get the true shortest path length
    function trueCost() {
      var seen = {}, q = [{ r: start.r, c: start.c, d: 0 }];
      seen[start.r + "," + start.c] = true;
      while (q.length) {
        var n = q.shift();
        if (n.r === goal.r && n.c === goal.c) return n.d;
        var moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (var i = 0; i < 4; i++) {
          var nr = n.r + moves[i][0], nc = n.c + moves[i][1];
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
          if (walls[nr + "," + nc]) continue;
          var k = nr + "," + nc;
          if (!seen[k]) { seen[k] = true; q.push({ r: nr, c: nc, d: n.d + 1 }); }
        }
      }
      return Infinity;
    }
    var c0 = mkCanvas(host, 640, 340), ctx = c0.ctx;
    var out = mkOut(host);
    function draw() {
      var t = C(); ctx.clearRect(0, 0, 640, 340);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
        var x = ox + c * cz, y = oy + r * cz;
        var isWall = walls[r + "," + c] && !removed;
        ctx.fillStyle = isWall ? t.border : t.panel;
        ctx.fillRect(x, y, cz - 2, cz - 2);
        ctx.strokeStyle = t.border; ctx.lineWidth = 1; ctx.strokeRect(x, y, cz - 2, cz - 2);
        var cx = x + (cz - 2) / 2, cy = y + (cz - 2) / 2;
        if (r === start.r && c === start.c) { ctx.fillStyle = t.accent; ctx.font = "bold 16px sans-serif"; ctx.fillText("S", cx, cy); }
        else if (r === goal.r && c === goal.c) { ctx.fillStyle = t.accent2; ctx.font = "bold 16px sans-serif"; ctx.fillText("G", cx, cy); }
        else if (isWall) { ctx.fillStyle = t.dim; ctx.font = "12px sans-serif"; ctx.fillText("wall", cx, cy); }
      }
      // draw the route
      ctx.strokeStyle = removed ? t.accent2 : t.warn; ctx.lineWidth = 3;
      ctx.beginPath();
      var sX = ox + start.c * cz + (cz - 2) / 2, sY = oy + start.r * cz + (cz - 2) / 2;
      var gX = ox + goal.c * cz + (cz - 2) / 2, gY = oy + goal.r * cz + (cz - 2) / 2;
      if (removed) { ctx.moveTo(sX, sY); ctx.lineTo(gX, sY); ctx.lineTo(gX, gY); }
      else {
        // a winding path that respects the walls
        ctx.moveTo(sX, sY);
        ctx.lineTo(ox + 4 * cz + (cz - 2) / 2, sY);
        ctx.lineTo(ox + 4 * cz + (cz - 2) / 2, oy + 2 * cz + (cz - 2) / 2);
        ctx.lineTo(ox + 0 * cz + (cz - 2) / 2, oy + 2 * cz + (cz - 2) / 2);
        ctx.lineTo(ox + 0 * cz + (cz - 2) / 2, gY);
        ctx.lineTo(gX, gY);
      }
      ctx.stroke();
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      var h = manhattan(), tc = trueCost();
      out.innerHTML = "Drop the constraint 'cannot pass through walls'. " +
        "<span style=\"color:" + t.warn + "\">Orange = true path (with walls)</span>, " +
        "<span style=\"color:" + t.accent2 + "\">green = relaxed straight path (walls removed)</span>.<br>" +
        "Relaxed cost h = Manhattan distance = <b>" + h + "</b>. True cost (around the walls) = <b>" + tc + "</b>. " +
        "Because " + h + " &le; " + tc + ", h never overestimates: it is <b>admissible</b>, so A* can safely use it.";
    }
    var row = mkRow(host);
    mkBtn(row, "Remove walls (relax)", function () { removed = true; draw(); });
    mkBtn(row, "Put walls back", function () { removed = false; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Relaxed heuristics for A*",
  tagline: "Drop a rule to make an easier problem. Its cost becomes a heuristic that never lies high.",
  prereqs: ["ai-astar"],
  bigIdea:
    `<p>A* needs a <b>heuristic</b> $h(s)$: a guess of the remaining cost to the goal. It must never overestimate.</p>
     <p>Where do we get such a guess? <b>Relax</b> the problem: throw away a constraint to make an easier version.</p>
     <p>The cost of the easier problem is the heuristic. It is automatically admissible, because removing rules can only make things cheaper.</p>`,
  buildup:
    `<p>Take a maze. The hard rule is "you cannot walk through walls".</p>
     <p>Drop that rule. Now you can fly straight to the goal. The straight-line (or Manhattan) distance is the cost of this relaxed maze.</p>
     <p>The real maze is harder, so its true cost is at least that. The relaxed cost is a safe, never-too-high guess.</p>`,
  symbols: [
    { sym: "$s$", desc: "a state (a cell in the maze)." },
    { sym: "$h(s)$", desc: "the heuristic: a guess of the cost from $s$ to the goal." },
    { sym: "$\\text{Cost}(s)$", desc: "the true cheapest cost from $s$ to the goal in the original problem." },
    { sym: "$\\text{Cost}_{rel}(s)$", desc: "the cheapest cost from $s$ in the relaxed (easier) problem." },
    { sym: "$\\le$", desc: "'less than or equal to'. Says the relaxed cost is never larger than the true cost." },
    { sym: "admissible", desc: "a heuristic that never overestimates the true remaining cost." },
    { sym: "Manhattan distance", desc: "the number of grid steps (up/down + left/right) ignoring walls: $|\\Delta r| + |\\Delta c|$." }
  ],
  formula: `$$ h(s) = \\text{Cost}_{rel}(s) \\le \\text{Cost}(s) $$`,
  whatItDoes:
    `<p>Build an easier problem by deleting a constraint. Solve <i>it</i> (often by a simple formula like straight-line distance).</p>
     <p>Use that easy cost as the heuristic $h$. Since the relaxed problem allows everything the real one does and more, its cost can only be lower or equal.</p>
     <p>So $h \\le \\text{Cost}$ always holds. That is exactly the admissibility A* requires to guarantee the optimal path.</p>`,
  derivation:
    `<p>Why is a relaxed cost <b>always</b> admissible? Because relaxing only ever adds options, and more options can never cost more.</p>
     <p><b>Setup.</b> The original problem has a set of allowed moves $A$. A relaxation deletes a constraint, giving a larger set of allowed moves $A_{rel} \\supseteq A$ (everything you could do before, plus more).</p>
     <ul class="steps">
       <li>Let $P^\\star$ be the true optimal path from $s$ to the goal, with cost $\\text{Cost}(s)$. Every move in $P^\\star$ is legal in $A$.</li>
       <li>Since $A \\subseteq A_{rel}$, that same path $P^\\star$ is also legal in the relaxed problem.</li>
       <li>So the relaxed problem can at worst copy $P^\\star$: its best cost satisfies $\\text{Cost}_{rel}(s) \\le \\text{cost}(P^\\star) = \\text{Cost}(s)$.</li>
       <li>Therefore $h(s) = \\text{Cost}_{rel}(s) \\le \\text{Cost}(s)$: the heuristic never overestimates. It is admissible. ∎</li>
     </ul>
     <p><b>Why the maze gives Manhattan distance.</b> Delete "no walking through walls". Now the only cost is one per grid step, and the cheapest way to cover $|\\Delta r|$ rows and $|\\Delta c|$ columns is $|\\Delta r| + |\\Delta c|$ steps. That sum is the relaxed cost, hence an admissible $h$.</p>
     <p><b>Intuition.</b> A relaxation is the same problem with the handcuffs off. With fewer rules to obey, you can always do at least as well, never worse. So its cost is a lower bound on the real cost: a guess that is honest about being optimistic.</p>`,
  example:
    `<p>Start at cell $(0,0)$, goal at $(4,4)$ in a $5\\times5$ maze. Walls force a long detour.</p>
     <ul class="steps">
       <li>Relax: remove the walls. Now $h = $ Manhattan distance $= |4-0| + |4-0| = 4 + 4 = 8$.</li>
       <li>The real maze winds around the walls; suppose its true shortest path is $12$ steps.</li>
       <li>Check: $8 \\le 12$. The heuristic does not overestimate, so it is admissible.</li>
       <li>A* uses $h = 8$ to aim toward the goal, exploring far fewer cells than blind search.</li>
     </ul>`,
  application:
    `<p>Relaxation is the standard recipe for inventing heuristics. For the 8-puzzle, "ignore that tiles block each other" gives the Manhattan-distance heuristic. For routing, "ignore roads, fly straight" gives the straight-line heuristic. Every good A* heuristic is a relaxed problem in disguise.</p>`,
  quiz: {
    q: `In a grid, start $(1,1)$ and goal $(1,5)$. Walls force a detour costing $8$ steps. What is the relaxed (Manhattan) heuristic, and is it admissible?`,
    a: `<p>Manhattan $= |1-1| + |5-1| = 0 + 4 = 4$. Since $4 \\le 8$, it does not overestimate, so it is admissible.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-structured-perceptron",
  demo: function (host) {
    // A tiny path-scoring problem. Two competing paths share a start and goal.
    // Each edge has a weight; path score = sum of its edge weights. The TRUE path
    // is the bottom one. Click "Update": if the model's highest-scoring (predicted)
    // path is wrong, raise the true path's edge weights by 1 and lower the
    // predicted path's by 1. Watch the scores swap so the true path wins.
    host.innerHTML = "";
    var W = 640, H = 300;
    // features: each path uses two edges; weight per edge name
    var w = { tA: 0, tB: 0, pA: 0, pB: 0 };   // true edges tA,tB ; predicted(wrong) edges pA,pB
    var updates = 0;
    function trueScore() { return w.tA + w.tB; }
    function predScore() { return w.pA + w.pB; }
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    function node(x, y, label) {
      var t = C();
      ctx.beginPath(); ctx.fillStyle = t.panel; ctx.strokeStyle = t.border; ctx.lineWidth = 2;
      ctx.arc(x, y, 22, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = t.ink; ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, x, y);
    }
    function edge(x1, y1, x2, y2, val, hot) {
      var t = C();
      ctx.strokeStyle = hot; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.fillStyle = t.ink; ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(val.toFixed(0), (x1 + x2) / 2, (y1 + y2) / 2 - 12);
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var sx = 80, mx = 320, gx = 560, topY = 90, botY = 210;
      // predicted (top) path
      edge(sx, 150, mx, topY, w.pA, t.warn);
      edge(mx, topY, gx, 150, w.pB, t.warn);
      // true (bottom) path
      edge(sx, 150, mx, botY, w.tA, t.accent2);
      edge(mx, botY, gx, 150, w.tB, t.accent2);
      node(sx, 150, "Start"); node(gx, 150, "Goal");
      node(mx, topY, "wrong"); node(mx, botY, "TRUE");
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      var ts = trueScore(), ps = predScore();
      var picked = (ps >= ts) ? "wrong (top)" : "TRUE (bottom)";
      out.innerHTML = "Edge numbers are learned weights; a path's score is the sum of its edges. The model picks the highest-scoring path.<br>" +
        "<span style=\"color:" + t.accent2 + "\">TRUE path score = " + ts + "</span>, " +
        "<span style=\"color:" + t.warn + "\">wrong path score = " + ps + "</span>. Model currently picks: <b>" + picked + "</b>. " +
        "Updates applied: <b>" + updates + "</b>.<br>" +
        "One update (when the prediction is wrong): <b>+1</b> to each true edge, <b>−1</b> to each predicted edge.";
    }
    var row = mkRow(host);
    mkBtn(row, "Update (perceptron step)", function () {
      var ts = trueScore(), ps = predScore();
      if (ps >= ts) {   // model is wrong (ties broken against the true path) -> correct it
        w.tA += 1; w.tB += 1; w.pA -= 1; w.pB -= 1; updates++;
      }
      draw();
    });
    mkBtn(row, "Reset", function () { w = { tA: 0, tB: 0, pA: 0, pB: 0 }; updates = 0; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Learning costs (structured perceptron)",
  tagline: "Score whole structures. When you pick the wrong one, reward the right one and punish your pick.",
  prereqs: ["ai-search-problem", "aix-relaxation"],
  bigIdea:
    `<p>Search needs costs (or scores) on actions. Where do those numbers come from? We can <b>learn</b> them.</p>
     <p>The <b>structured perceptron</b> scores a whole output (a path, a parse, a labeling) and fixes its weights when it picks the wrong one.</p>
     <p>The rule: nudge the true output's features up, and the wrongly predicted output's features down.</p>`,
  buildup:
    `<p>Describe each output by a feature vector $\\phi$. Its score is $w\\cdot\\phi$: weights dotted with features.</p>
     <p>The model predicts the highest-scoring output. If that prediction $\\hat y$ differs from the truth $y$, we made a mistake.</p>
     <p>On a mistake, push the weights so the true output scores higher next time and the wrong one scores lower.</p>`,
  symbols: [
    { sym: "$y$", desc: "the true (gold) output, e.g. the correct path." },
    { sym: "$\\hat y$", desc: "the predicted output: the one the current weights score highest (the hat means 'predicted')." },
    { sym: "$\\phi(y)$", desc: "the feature vector of output $y$: which edges/actions it uses, counted up." },
    { sym: "$w$", desc: "the weight vector; the score of an output is $w\\cdot\\phi(y)$." },
    { sym: "$w\\cdot\\phi(y)$", desc: "the dot product: the total score of output $y$ under the current weights." },
    { sym: "$\\leftarrow$", desc: "the update arrow: replace the left side with the right side." }
  ],
  formula: `$$ \\hat y = \\arg\\max_{y'} \\; w\\cdot\\phi(y') \\qquad w \\leftarrow w + \\phi(y) - \\phi(\\hat y) $$`,
  whatItDoes:
    `<p>First predict: pick the output $\\hat y$ with the highest score $w\\cdot\\phi$.</p>
     <p>If $\\hat y = y$, the prediction was right: do nothing.</p>
     <p>If $\\hat y \\ne y$, update: add the true output's features and subtract the predicted output's. This raises the true score and lowers the wrong score, by exactly the amount they differ.</p>`,
  derivation:
    `<p>Why does $w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$ fix the mistake? Because it moves the score gap in the right direction, provably.</p>
     <p><b>The gap before the update.</b> A mistake means the wrong output scored at least as high: $w\\cdot\\phi(\\hat y) \\ge w\\cdot\\phi(y)$.</p>
     <ul class="steps">
       <li>Apply the update: $w' = w + \\phi(y) - \\phi(\\hat y)$.</li>
       <li>New true score: $w'\\cdot\\phi(y) = w\\cdot\\phi(y) + \\phi(y)\\cdot\\phi(y) - \\phi(\\hat y)\\cdot\\phi(y)$.</li>
       <li>New wrong score: $w'\\cdot\\phi(\\hat y) = w\\cdot\\phi(\\hat y) + \\phi(y)\\cdot\\phi(\\hat y) - \\phi(\\hat y)\\cdot\\phi(\\hat y)$.</li>
       <li>Subtract: the gap changes by $\\big(w'\\cdot\\phi(y) - w'\\cdot\\phi(\\hat y)\\big) - \\big(w\\cdot\\phi(y) - w\\cdot\\phi(\\hat y)\\big) = \\lVert \\phi(y) - \\phi(\\hat y)\\rVert^2$.</li>
       <li>A squared length is $\\ge 0$. So the true output's lead grows by a non-negative amount every update. The score moves toward making $y$ win. ∎</li>
     </ul>
     <p><b>Connection to gradient descent.</b> The update is exactly a gradient step on the hinge-style loss $\\max_{y'}\\big[w\\cdot\\phi(y') - w\\cdot\\phi(y)\\big]$: its (sub)gradient is $\\phi(\\hat y) - \\phi(y)$, and stepping against it gives $+\\phi(y) - \\phi(\\hat y)$.</p>
     <p><b>Intuition.</b> Each edge the true path uses but the wrong path does not gets cheaper to prefer (weight $+1$). Each edge only the wrong path uses gets penalized (weight $-1$). Shared edges cancel out. After enough corrections, the true structure outscores the impostor.</p>`,
  example:
    `<p>Two paths share start and goal. True path uses edges $\\{e_1, e_2\\}$; the model wrongly predicts a path using $\\{e_3, e_4\\}$. All weights start at $0$.</p>
     <ul class="steps">
       <li>Scores tie at $0$, and the tie is broken toward the wrong path: a mistake.</li>
       <li>Update: $w_{e_1} \\mathbin{+}= 1$, $w_{e_2} \\mathbin{+}= 1$, $w_{e_3} \\mathbin{-}= 1$, $w_{e_4} \\mathbin{-}= 1$.</li>
       <li>Now true score $= 1 + 1 = 2$; wrong score $= -1 + -1 = -2$.</li>
       <li>The true path wins by $4$. One correction flipped the decision.</li>
     </ul>`,
  application:
    `<p>The structured perceptron trains part-of-speech taggers, dependency parsers, and named-entity recognizers, where the output is a whole sequence or tree, not a single label. It is also how you learn action costs for a search/planning agent from demonstrations (imitation learning).</p>`,
  quiz: {
    q: `True output features $\\phi(y)=[1,0]$, predicted features $\\phi(\\hat y)=[0,1]$, weights $w=[0,0]$. After one update $w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$, what is $w$?`,
    a: `<p>$w = [0,0] + [1,0] - [0,1] = [1,-1]$. The true feature's weight rose to $1$, the wrong feature's fell to $-1$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-monte-carlo",
  demo: function (host) {
    // A short chain s0 - s1 - s2 - GOAL(+10). From a fixed (s,a) we sample whole
    // episodes; each episode's return u is recorded; the Q estimate is the running
    // average of those returns, converging to the true value.
    host.innerHTML = "";
    var W = 640, H = 300;
    var trueQ = 8.1;          // discounted return target the average should approach
    var returns = [];         // sampled episode returns
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    var seed = 7;
    function rng() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function sampleReturn() {
      // gamma=0.9; reach goal in 2..4 steps; +10 at goal, -1 per step (noisy length)
      var gamma = 0.9, steps = 2 + Math.floor(rng() * 3);   // 2,3,4
      var u = 0, disc = 1;
      for (var k = 0; k < steps; k++) { u += disc * (-1); disc *= gamma; }
      u += disc * 10;   // terminal reward
      return u;
    }
    function avg() { if (!returns.length) return 0; var s = 0; for (var i = 0; i < returns.length; i++) s += returns[i]; return s / returns.length; }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      // plot returns as dots and the running average as a line toward trueQ
      var x0 = 60, x1 = 600, y0 = 250, y1 = 40;
      var lo = 4, hi = 11;
      function px(i, n) { return x0 + (x1 - x0) * (n <= 1 ? 0.5 : i / (n - 1)); }
      function py(v) { return y0 + (y1 - y0) * ((v - lo) / (hi - lo)); }
      // true-Q reference line
      ctx.strokeStyle = t.accent2; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x0, py(trueQ)); ctx.lineTo(x1, py(trueQ)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = t.accent2; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("true Q ≈ " + trueQ.toFixed(2), x1 - 110, py(trueQ) - 8);
      // axes
      ctx.strokeStyle = t.border; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      // sampled returns (dots) and running average (line)
      var n = returns.length, run = 0;
      ctx.fillStyle = t.warn;
      for (var i = 0; i < n; i++) {
        run += returns[i];
        ctx.beginPath(); ctx.arc(px(i, n), py(returns[i]), 3, 0, 7); ctx.fill();
      }
      ctx.strokeStyle = t.accent; ctx.lineWidth = 2.5; run = 0;
      ctx.beginPath();
      for (var j = 0; j < n; j++) { run += returns[j]; var a = run / (j + 1); var xx = px(j, n), yy = py(a); if (j === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); }
      ctx.stroke();
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "Each <span style=\"color:" + t.warn + "\">dot</span> is one episode's return u (noisy). " +
        "The <span style=\"color:" + t.accent + "\">blue line</span> is the running average Q̂ = mean of the returns so far.<br>" +
        "episodes: <b>" + n + "</b>, current estimate Q̂(s,a) = <b>" + (n ? avg().toFixed(2) : "—") + "</b>, " +
        "true Q ≈ <b>" + trueQ.toFixed(2) + "</b>. More episodes → the average converges.";
    }
    var row = mkRow(host);
    mkBtn(row, "Sample one episode", function () { returns.push(sampleReturn()); draw(); });
    mkBtn(row, "Sample 20 episodes", function () { for (var i = 0; i < 20; i++) returns.push(sampleReturn()); draw(); });
    mkBtn(row, "Reset", function () { returns = []; seed = 7; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Monte Carlo reinforcement learning",
  tagline: "No model? Just play out whole episodes and average the rewards you actually got.",
  prereqs: ["ai-q-learning", "ai-qvalue"],
  bigIdea:
    `<p>Q-learning bootstraps off its own estimates. <b>Monte Carlo</b> RL does something even simpler: it just averages real outcomes.</p>
     <p>Play a full episode to the end. Add up the discounted rewards you actually received: that is the <b>return</b> $u$.</p>
     <p>The Q-value of a state-action pair is estimated as the average return over all episodes where that pair appeared.</p>`,
  buildup:
    `<p>An episode is one complete run from a start state until the game ends.</p>
     <p>For each step in the episode, the return $u_t$ is the discounted sum of all rewards from that step onward.</p>
     <p>To estimate $\\hat Q(s,a)$, collect every $u_t$ that followed taking action $a$ in state $s$, and average them.</p>`,
  symbols: [
    { sym: "$s, a$", desc: "a state and the action taken in it." },
    { sym: "$u_t$", desc: "the return from step $t$: the discounted total of rewards received from step $t$ to the end of the episode." },
    { sym: "$\\hat Q(s,a)$", desc: "the estimated Q-value (the hat means 'estimated from data, not exact')." },
    { sym: "$\\gamma$", desc: "the discount factor in $[0,1]$; later rewards count less." },
    { sym: "$r_k$", desc: "the reward received at step $k$." },
    { sym: "$N(s,a)$", desc: "how many times the pair $(s,a)$ has been visited across episodes." },
    { sym: "average", desc: "the sum of the returns divided by how many there were." }
  ],
  formula: `$$ u_t = \\sum_{k\\ge t} \\gamma^{\\,k-t}\\, r_k \\qquad \\hat Q(s,a) = \\frac{1}{N(s,a)} \\sum_{\\text{episodes with }(s,a)} u_t $$`,
  whatItDoes:
    `<p>Run episodes. Whenever the pair $(s,a)$ shows up, record the return $u_t$ that followed it.</p>
     <p>The estimate $\\hat Q(s,a)$ is just the average of those recorded returns.</p>
     <p>No transition probabilities, no model. The randomness of the world is already baked into the sampled returns, and averaging cancels the noise.</p>`,
  derivation:
    `<p>Why does averaging returns give the right Q-value? Because the true Q-value <i>is</i> an expectation, and an average is how you estimate an expectation.</p>
     <p><b>Definition.</b> By definition $Q(s,a) = \\mathbb{E}[\\,u \\mid s, a\\,]$: the expected (average over all possible futures) return after taking $a$ in $s$.</p>
     <ul class="steps">
       <li>Each episode that passes through $(s,a)$ produces one return $u_t$. That $u_t$ is a single random draw from the distribution of returns.</li>
       <li>The sample mean of independent draws estimates their expectation: $\\frac{1}{N}\\sum u_t \\to \\mathbb{E}[u\\mid s,a]$ as $N$ grows (the law of large numbers).</li>
       <li>The expectation it converges to is exactly $Q(s,a)$. So $\\hat Q(s,a) \\to Q(s,a)$. ∎</li>
     </ul>
     <p><b>Why it is unbiased.</b> Each $u_t$ is a complete, real return: no estimate feeds into it. So $\\mathbb{E}[\\hat Q] = \\mathbb{E}[u] = Q$ even with few samples. The price is variance: full-episode returns wobble a lot, so you need many episodes.</p>
     <p><b>Intuition.</b> You do not need to know the dice to learn the game. Roll enough times and write down what you actually scored; the average tells you what each move is worth. Monte Carlo trusts experience over any model.</p>`,
  example:
    `<p>From $(s,a)$ we run $3$ episodes and record their returns: $u = 7$, $u = 9$, $u = 8$.</p>
     <ul class="steps">
       <li>First episode: $\\hat Q = 7$.</li>
       <li>After two: $\\hat Q = (7 + 9)/2 = 8$.</li>
       <li>After three: $\\hat Q = (7 + 9 + 8)/3 = 24/3 = 8$.</li>
       <li>The estimate settles near the true expected return. More episodes shrink the wobble.</li>
     </ul>`,
  application:
    `<p>Monte Carlo evaluation underlies Monte Carlo Tree Search, the engine behind strong Go and game-playing AIs: it plays many random rollouts to the end and averages the outcomes to score a move. It is also used to evaluate policies when a simulator exists but the exact model does not.</p>`,
  quiz: {
    q: `Three episodes from $(s,a)$ give returns $u = 4$, $u = 10$, $u = 7$. What is the Monte Carlo estimate $\\hat Q(s,a)$?`,
    a: `<p>$\\hat Q = (4 + 10 + 7)/3 = 21/3 = 7$. The estimate is the average of the observed returns.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-sarsa-td",
  demo: function (host) {
    // A 1x5 corridor: cells 0..3 then GOAL at 4 (reward +1). Values start at 0.
    // Each "TD step" picks the cell just left of the rightmost updated cell and
    // applies V(s) <- V(s) + alpha[r + gamma V(s') - V(s)], so value flows back
    // from the goal one step at a time.
    host.innerHTML = "";
    var N = 5, cz = 110, ox = 30, oy = 90;
    var alpha = 0.5, gamma = 0.9;
    var V, frontier;   // frontier = index of the cell we update next (moves left)
    function reset() { V = [0, 0, 0, 0, 1]; frontier = 3; draw(); }
    function tdStep() {
      if (frontier < 0) { draw(); return; }
      var s = frontier, sp = frontier + 1;
      var r = 0;   // step reward 0; goal value carries the +1
      var target = r + gamma * V[sp];
      V[s] = V[s] + alpha * (target - V[s]);
      frontier--; if (frontier < 0) frontier = 3;   // loop back so repeated steps refine
      draw();
    }
    var c0 = mkCanvas(host, 640, 280), ctx = c0.ctx;
    var out = mkOut(host);
    function draw() {
      var t = C(); ctx.clearRect(0, 0, 640, 280);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var i = 0; i < N; i++) {
        var x = ox + i * cz, y = oy;
        var goal = (i === N - 1);
        var v = V[i];
        ctx.fillStyle = goal ? "rgba(126,231,135,0.45)" : "rgba(78,161,255," + (0.1 + 0.7 * Math.max(0, Math.min(1, v))).toFixed(3) + ")";
        ctx.fillRect(x, y, cz - 6, cz - 6);
        ctx.strokeStyle = (i === (frontier < 0 ? 3 : frontier)) ? t.warn : t.border;
        ctx.lineWidth = (i === (frontier < 0 ? 3 : frontier)) ? 4 : 1.5;
        ctx.strokeRect(x, y, cz - 6, cz - 6);
        var cx = x + (cz - 6) / 2, cy = y + (cz - 6) / 2;
        ctx.fillStyle = t.ink; ctx.font = "bold 20px sans-serif";
        ctx.fillText(v.toFixed(2), cx, cy - 8);
        ctx.fillStyle = goal ? t.accent2 : t.dim; ctx.font = "12px sans-serif";
        ctx.fillText(goal ? "GOAL +1" : ("s" + i), cx, cy + 22);
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      var s = (frontier < 0 ? 3 : frontier);
      out.innerHTML = "Corridor s0…s3 → GOAL. One TD step updates the <span style=\"color:" + t.warn + "\">highlighted cell</span> toward " +
        "r + γ·V(s′).<br>V(s" + s + ") ← V(s" + s + ") + α[ r + γ·V(s" + (s + 1) + ") − V(s" + s + ") ], with α = " + alpha + ", γ = " + gamma + ", r = 0. " +
        "Value spreads back from the goal, one step per update.";
    }
    var row = mkRow(host);
    mkBtn(row, "One TD step", tdStep);
    mkBtn(row, "Reset", reset);
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "SARSA and temporal-difference learning",
  tagline: "Don't wait for the episode to end. Update each step from the very next step's guess.",
  prereqs: ["aix-monte-carlo", "ai-q-learning"],
  bigIdea:
    `<p>Monte Carlo waits for the whole episode, then averages. <b>Temporal-difference (TD)</b> learning updates after every single step.</p>
     <p>It nudges a value toward the reward just seen plus the discounted value of the <i>next</i> state. This is called <b>bootstrapping</b>: using one estimate to improve another.</p>
     <p><b>SARSA</b> is TD applied to Q-values, using the actual quintuple $(s, a, r, s', a')$ the agent experienced.</p>`,
  buildup:
    `<p>At each step the agent is in state $s$, takes action $a$, gets reward $r$, lands in $s'$, then takes $a'$. That is the name SARSA: $s, a, r, s', a'$.</p>
     <p>The <b>TD target</b> is $r + \\gamma V(s')$: the reward now plus the discounted estimate of what follows.</p>
     <p>The <b>TD error</b> is target minus current value: how surprised we are. We step the value a fraction $\\alpha$ toward the target.</p>`,
  symbols: [
    { sym: "$V(s)$", desc: "the estimated value of state $s$." },
    { sym: "$s'$", desc: "the next state, after taking the action (read 's prime')." },
    { sym: "$r$", desc: "the reward received on this step." },
    { sym: "$\\alpha$", desc: "the learning rate (Greek 'alpha') in $[0,1]$: how far to step toward the target." },
    { sym: "$\\gamma$", desc: "the discount factor in $[0,1]$; future value counts less." },
    { sym: "$r + \\gamma V(s')$", desc: "the TD target: reward now plus discounted value of the next state." },
    { sym: "$r + \\gamma V(s') - V(s)$", desc: "the TD error: how far the current value is from the target." },
    { sym: "SARSA", desc: "TD on Q-values using $(s,a,r,s',a')$: the actual action taken next, $a'$, drives the update." }
  ],
  formula: `$$ V(s) \\leftarrow V(s) + \\alpha\\big[\\, r + \\gamma V(s') - V(s)\\,\\big] \\qquad Q(s,a) \\leftarrow Q(s,a) + \\alpha\\big[\\, r + \\gamma Q(s',a') - Q(s,a)\\,\\big] $$`,
  whatItDoes:
    `<p>Compute the TD error: the target $r + \\gamma V(s')$ minus the old value $V(s)$.</p>
     <p>Move $V(s)$ a fraction $\\alpha$ of the way toward the target. A positive error raises the value; a negative one lowers it.</p>
     <p>SARSA does the same on $Q(s,a)$, but uses $Q(s',a')$ for the action the policy actually picks next, so it learns the value of the policy it is following (on-policy).</p>`,
  derivation:
    `<p>Why bootstrap off the next step instead of waiting for the end? Because the value function obeys a one-step self-consistency, and TD enforces it.</p>
     <p><b>The fixed point.</b> The true value satisfies $V(s) = \\mathbb{E}[\\,r + \\gamma V(s')\\,]$: a state's value equals the immediate reward plus the discounted value of where you go next. This is the Bellman equation.</p>
     <ul class="steps">
       <li>Define the TD error $\\delta = r + \\gamma V(s') - V(s)$: the gap between the two sides of that equation for one sampled step.</li>
       <li>If our estimates were already correct, $\\mathbb{E}[\\delta] = 0$: no expected gap.</li>
       <li>When $\\mathbb{E}[\\delta] \\ne 0$, the estimate violates Bellman. Step toward closing it: $V(s) \\leftarrow V(s) + \\alpha\\,\\delta$.</li>
       <li>This is stochastic approximation of the Bellman fixed point. With $\\alpha$ shrinking suitably, $V$ converges to the value that makes $\\mathbb{E}[\\delta] = 0$ everywhere — the true value. ∎</li>
     </ul>
     <p><b>MC vs TD in one line.</b> Monte Carlo uses the full return $u_t$ (low bias, high variance, must wait). TD uses $r + \\gamma V(s')$ (a little biased while $V$ is wrong, but low variance and usable immediately).</p>
     <p><b>Intuition.</b> You do not need to finish the trip to learn the route. The moment the next landmark looks closer than expected, you revise your estimate of where you started. Each step's small surprise teaches a little, and the goal's reward seeps backward one cell per update.</p>`,
  example:
    `<p>State $s$ has value $V(s) = 0$. The agent steps, gets reward $r = 0$, lands in $s'$ with $V(s') = 1$. Use $\\alpha = 0.5$, $\\gamma = 0.9$.</p>
     <ul class="steps">
       <li>TD target: $r + \\gamma V(s') = 0 + 0.9\\times1 = 0.9$.</li>
       <li>TD error: $0.9 - V(s) = 0.9 - 0 = 0.9$.</li>
       <li>Update: $V(s) \\leftarrow 0 + 0.5\\times0.9 = 0.45$.</li>
       <li>$V(s)$ moved from $0$ to $0.45$, halfway to the target. The goal's value flowed back one step.</li>
     </ul>`,
  application:
    `<p>TD learning is the backbone of modern RL. TD-Gammon learned backgammon at expert level this way. The TD error even matches dopamine signals measured in the brain, making it a leading model of how animals learn from reward. SARSA's on-policy nature makes it safer than Q-learning when exploration can be costly.</p>`,
  quiz: {
    q: `$V(s)=2$, reward $r=1$, next value $V(s')=4$, $\\alpha=0.5$, $\\gamma=0.5$. Compute the TD target, the TD error, and the new $V(s)$.`,
    a: `<p>Target $= 1 + 0.5\\times4 = 3$. Error $= 3 - 2 = 1$. New value $= 2 + 0.5\\times1 = 2.5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-game-theory",
  demo: function (host) {
    // A 2x2 payoff matrix (Prisoner's Dilemma). Each cell shows (A's payoff, B's payoff).
    // Best responses are highlighted; the cell where both best-respond is the Nash equilibrium.
    host.innerHTML = "";
    var W = 640, H = 320;
    // payoffs as (A,B); rows = A's choice {Cooperate, Defect}, cols = B's choice
    // classic PD years-in-prison turned to payoffs (higher = better): cooperate=-1, etc.
    var pay = [
      [[-1, -1], [-3, 0]],   // A Cooperate: B Coop / B Defect
      [[0, -3], [-2, -2]]    // A Defect:    B Coop / B Defect
    ];
    var rowL = ["A: Cooperate", "A: Defect"], colL = ["B: Cooperate", "B: Defect"];
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    // A's best response to each column; B's best response to each row
    function aBest(col) { return pay[0][col][0] >= pay[1][col][0] ? 0 : 1; }
    function bBest(row) { return pay[row][0][1] >= pay[row][1][1] ? 0 : 1; }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var ox = 180, oy = 70, cw = 200, ch = 100;
      ctx.font = "13px sans-serif"; ctx.fillStyle = t.dim; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(colL[0], ox + cw * 0.5, oy - 20);
      ctx.fillText(colL[1], ox + cw * 1.5, oy - 20);
      for (var r = 0; r < 2; r++) {
        ctx.save(); ctx.translate(ox - 30, oy + ch * (r + 0.5)); ctx.rotate(0);
        ctx.fillStyle = t.dim; ctx.textAlign = "right"; ctx.fillText(rowL[r], 0, 0); ctx.restore();
      }
      for (var rr = 0; rr < 2; rr++) for (var cc = 0; cc < 2; cc++) {
        var x = ox + cc * cw, y = oy + rr * ch;
        var aBR = (aBest(cc) === rr);   // A best-responds by choosing this row given column cc
        var bBR = (bBest(rr) === cc);   // B best-responds by choosing this col given row rr
        var nash = aBR && bBR;
        ctx.fillStyle = nash ? "rgba(126,231,135,0.30)" : t.panel;
        ctx.fillRect(x, y, cw - 6, ch - 6);
        ctx.strokeStyle = nash ? t.accent2 : t.border; ctx.lineWidth = nash ? 3 : 1.5;
        ctx.strokeRect(x, y, cw - 6, ch - 6);
        var cx = x + (cw - 6) / 2, cy = y + (ch - 6) / 2;
        ctx.font = "bold 18px sans-serif"; ctx.textAlign = "center";
        ctx.fillStyle = aBR ? t.accent : t.ink;
        ctx.fillText("A: " + pay[rr][cc][0], cx, cy - 12);
        ctx.fillStyle = bBR ? t.warn : t.ink;
        ctx.fillText("B: " + pay[rr][cc][1], cx, cy + 14);
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "Prisoner's dilemma payoffs (higher = better) shown as A / B per cell. " +
        "<span style=\"color:" + t.accent + "\">Blue A-number = A's best response</span> to that column; " +
        "<span style=\"color:" + t.warn + "\">orange B-number = B's best response</span> to that row.<br>" +
        "The <span style=\"color:" + t.accent2 + "\">green cell</span> is the <b>Nash equilibrium</b> (Defect, Defect): each is best-responding, so neither gains by switching alone.";
    }
    var row = mkRow(host);
    mkBtn(row, "Show best responses & Nash", draw);
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Simultaneous games and Nash equilibrium",
  tagline: "Both move at once. A stable outcome is one where no one wishes they'd chosen differently.",
  prereqs: ["ai-minimax", "prob-expectation"],
  bigIdea:
    `<p>In a <b>simultaneous game</b>, players choose at the same time, without seeing each other's move. A <b>payoff matrix</b> lists everyone's reward for each combination.</p>
     <p>A <b>Nash equilibrium</b> is a choice for each player where no single player can do better by switching alone.</p>
     <p>Players may use <b>mixed strategies</b>: randomizing over moves. The <b>minimax theorem</b> says for two-player zero-sum games, the order of who commits first does not matter.</p>`,
  buildup:
    `<p>Player A picks a row, player B picks a column. The cell gives the payoff $V(a,b)$ to each.</p>
     <p>A <b>best response</b> is the move that maximizes your payoff given what the other does.</p>
     <p>If both players are simultaneously best-responding to each other, no one wants to deviate. That mutual stability is the equilibrium.</p>`,
  symbols: [
    { sym: "$a$", desc: "player A's action (a row of the matrix)." },
    { sym: "$b$", desc: "player B's action (a column of the matrix)." },
    { sym: "$V(a,b)$", desc: "the payoff matrix entry: the value to a player when A plays $a$ and B plays $b$." },
    { sym: "$\\pi_A$", desc: "player A's mixed strategy: a probability for each of A's actions." },
    { sym: "$\\pi_B$", desc: "player B's mixed strategy: a probability for each of B's actions." },
    { sym: "$\\max_{\\pi_A}\\min_{\\pi_B}$", desc: "A picks its strategy to maximize, anticipating B then minimizing. The 'maximin' value." },
    { sym: "$\\min_{\\pi_B}\\max_{\\pi_A}$", desc: "B commits first to minimize, then A maximizes. The 'minimax' value." },
    { sym: "Nash equilibrium", desc: "a strategy profile where each player best-responds to the others, so no one gains by deviating alone." }
  ],
  formula: `$$ \\max_{\\pi_A}\\min_{\\pi_B} V(\\pi_A,\\pi_B) \\;=\\; \\min_{\\pi_B}\\max_{\\pi_A} V(\\pi_A,\\pi_B) \\quad\\text{(minimax theorem, zero-sum)} $$`,
  whatItDoes:
    `<p>For a profile to be a Nash equilibrium, each player's choice must be a best response to the other's.</p>
     <p>The minimax theorem (von Neumann) handles two-player zero-sum games: whether A or B reveals their (mixed) strategy first, the game's value is the same number, the <b>value of the game</b>.</p>
     <p>That common value is the payoff both rational players settle on, and equilibrium mixed strategies achieve it.</p>`,
  derivation:
    `<p>Why must the maximin never exceed the minimax, and why are they equal for zero-sum games?</p>
     <p><b>One direction always holds.</b> Whoever moves first is at a disadvantage: revealing your plan lets the opponent exploit it.</p>
     <ul class="steps">
       <li>If A commits first ($\\max_{\\pi_A}\\min_{\\pi_B}$), B sees A's strategy and replies optimally against it.</li>
       <li>If B commits first ($\\min_{\\pi_B}\\max_{\\pi_A}$), A gets the last word.</li>
       <li>Having more information cannot hurt, so the second mover does at least as well: $\\max_{\\pi_A}\\min_{\\pi_B} V \\le \\min_{\\pi_B}\\max_{\\pi_A} V$. This inequality holds for <i>any</i> game. ∎ (weak duality)</li>
     </ul>
     <p><b>Why equality holds (zero-sum).</b> With mixed strategies, $V(\\pi_A,\\pi_B)$ is linear in each player's probabilities, and the strategy sets are closed convex sets (probability simplexes). Von Neumann's minimax theorem says a continuous function that is concave in one argument and convex in the other has a saddle point, so the two optimization orders meet at the same value. The gap closes once randomization is allowed.</p>
     <p><b>Why a pure Nash can be bad for everyone.</b> In the prisoner's dilemma, Defect strictly beats Cooperate <i>whatever the opponent does</i> (it is a dominant strategy). So (Defect, Defect) is the unique Nash, even though (Cooperate, Cooperate) pays both more. Individual best-responding does not maximize the group.</p>
     <p><b>Intuition.</b> A Nash equilibrium is a "no regrets" outcome: looking back at the others' choices, you would not change yours. The minimax theorem says that against a worst-case opponent, randomizing your moves guarantees the game's value, and you cannot be punished for revealing a randomized plan you yourself follow by chance.</p>`,
  example:
    `<p>Prisoner's dilemma, payoffs (higher is better) shown as A's / B's:</p>
     <ul class="steps">
       <li>Both Cooperate: $(-1, -1)$. Both Defect: $(-2, -2)$. One Defects, other Cooperates: $(0, -3)$.</li>
       <li>A's view: if B Cooperates, A gets $-1$ (Coop) vs $0$ (Defect) → Defect. If B Defects, A gets $-3$ vs $-2$ → Defect. Defect dominates.</li>
       <li>By symmetry, Defect dominates for B too.</li>
       <li>So the Nash equilibrium is (Defect, Defect) at $(-2,-2)$, even though (Cooperate, Cooperate) at $(-1,-1)$ is better for both.</li>
     </ul>`,
  application:
    `<p>Game theory models pricing wars, ad auctions, network routing congestion, and security (attacker vs defender). Nash equilibrium predicts stable behavior; the minimax theorem underlies poker-bot strategies and adversarial machine learning, where one network maximizes and another minimizes.</p>`,
  quiz: {
    q: `In a 2×2 game, given B plays "Left", A's payoffs are $5$ (Up) and $3$ (Down). Given B plays "Right", A gets $2$ (Up) and $4$ (Down). What is A's best response to "Left", and to "Right"?`,
    a: `<p>Against Left: $\\max(5,3) = 5$ → play Up. Against Right: $\\max(2,4) = 4$ → play Down. A's best response depends on B's move.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-variable-elimination",
  demo: function (host) {
    // A small factor graph A - f1 - B - f2 - C. "Eliminate B" sums B out of the
    // factors touching it, producing a new factor over A and C. We show the
    // tables before and after.
    host.innerHTML = "";
    var W = 640, H = 320;
    // f1(A,B) and f2(B,C); A,B,C binary (0/1). values chosen as small integers.
    var f1 = { "0,0": 2, "0,1": 1, "1,0": 1, "1,1": 3 };   // f1(A,B)
    var f2 = { "0,0": 1, "0,1": 2, "1,0": 3, "1,1": 1 };   // f2(B,C)
    var eliminated = false;
    // new factor g(A,C) = sum_B f1(A,B)*f2(B,C)
    function g() {
      var out = {};
      for (var a = 0; a < 2; a++) for (var cc = 0; cc < 2; cc++) {
        var s = 0;
        for (var b = 0; b < 2; b++) s += f1[a + "," + b] * f2[b + "," + cc];
        out[a + "," + cc] = s;
      }
      return out;
    }
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    function nodeCircle(x, y, label, on) {
      var t = C();
      ctx.beginPath(); ctx.fillStyle = on ? t.warn : t.panel; ctx.strokeStyle = on ? t.warn : t.border; ctx.lineWidth = 2.5;
      ctx.arc(x, y, 24, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = on ? "#0d1117" : t.ink; ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, x, y);
    }
    function factorBox(x, y, label) {
      var t = C();
      ctx.fillStyle = t.accent; ctx.fillRect(x - 12, y - 12, 24, 24);
      ctx.fillStyle = "#0d1117"; ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, x, y);
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var y0 = 80;
      ctx.strokeStyle = t.border; ctx.lineWidth = 2;
      if (!eliminated) {
        // A - f1 - B - f2 - C
        var xs = [90, 200, 320, 440, 550];
        ctx.beginPath(); ctx.moveTo(xs[0], y0); ctx.lineTo(xs[4], y0); ctx.stroke();
        nodeCircle(xs[0], y0, "A", false);
        factorBox(xs[1], y0, "f1");
        nodeCircle(xs[2], y0, "B", true);
        factorBox(xs[3], y0, "f2");
        nodeCircle(xs[4], y0, "C", false);
      } else {
        // A - g - C
        var x2 = [160, 320, 480];
        ctx.beginPath(); ctx.moveTo(x2[0], y0); ctx.lineTo(x2[2], y0); ctx.stroke();
        nodeCircle(x2[0], y0, "A", false);
        factorBox(x2[1], y0, "g");
        nodeCircle(x2[2], y0, "C", false);
      }
      // tables below
      ctx.font = "13px sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = t.dim;
      if (!eliminated) {
        ctx.fillText("f1(A,B): " + JSON.stringify(f1).replace(/"/g, ""), 40, 180);
        ctx.fillText("f2(B,C): " + JSON.stringify(f2).replace(/"/g, ""), 40, 205);
        ctx.fillStyle = t.ink;
        ctx.fillText("Click to eliminate B: g(A,C) = Σ_B  f1(A,B)·f2(B,C).", 40, 240);
      } else {
        var gg = g();
        ctx.fillStyle = t.accent2; ctx.font = "bold 13px sans-serif";
        ctx.fillText("new factor  g(A,C) = " + JSON.stringify(gg).replace(/"/g, ""), 40, 190);
        ctx.fillStyle = t.dim; ctx.font = "13px sans-serif";
        ctx.fillText("e.g. g(0,0) = f1(0,0)·f2(0,0) + f1(0,1)·f2(1,0) = 2·1 + 1·3 = 5.", 40, 220);
        ctx.fillText("B is gone; the graph is now just A — g — C.", 40, 245);
      }
      out.innerHTML = "Factor graph " + (eliminated ? "<b>after</b> eliminating B: A — g — C." : "<b>before</b>: A — f1 — B — f2 — C.") +
        " To eliminate <b>B</b>, multiply the factors touching B, then sum over B's values. " +
        "The result is one new factor over B's other neighbours (A and C).";
    }
    var row = mkRow(host);
    mkBtn(row, "Eliminate B (sum out)", function () { eliminated = true; draw(); });
    mkBtn(row, "Reset", function () { eliminated = false; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Exact inference: variable elimination",
  tagline: "Sum out the variables you don't care about, one at a time, multiplying factors as you go.",
  prereqs: ["ai-bayes-net", "ai-bayes-inference"],
  bigIdea:
    `<p>To answer a query in a Bayes net exactly, you must sum the joint probability over every variable you did not observe and do not care about.</p>
     <p>Done naively, that sum is astronomically large. <b>Variable elimination</b> makes it tractable by pushing sums inward.</p>
     <p>It removes hidden variables one at a time: gather the factors that mention the variable, multiply them, and sum the variable out into a smaller new factor.</p>`,
  buildup:
    `<p>A <b>factor</b> is a table of non-negative numbers over some variables, e.g. $f_1(A,B)$.</p>
     <p>To eliminate variable $B$: collect every factor that contains $B$, multiply them together, then sum over all values of $B$.</p>
     <p>The leftover is a new factor over $B$'s neighbours. $B$ is gone, and the remaining problem is smaller.</p>`,
  symbols: [
    { sym: "$f(\\cdots)$", desc: "a factor: a table of non-negative numbers indexed by some variables." },
    { sym: "$\\prod$", desc: "multiply the listed factors together, entry by matching entry." },
    { sym: "$\\sum_{B}$", desc: "add up over all values the variable $B$ can take." },
    { sym: "$g$", desc: "the new factor produced after eliminating a variable; it covers that variable's neighbours." },
    { sym: "eliminate", desc: "remove a variable by multiplying its factors and summing it out." },
    { sym: "marginalize", desc: "sum a variable out of a factor, leaving a factor over the rest." }
  ],
  formula: `$$ g(A,C) \\;=\\; \\sum_{B} \\; f_1(A,B)\\, f_2(B,C) $$`,
  whatItDoes:
    `<p>Pick a hidden variable to eliminate. Multiply all factors that mention it. Then sum it away.</p>
     <p>The product-then-sum yields one new factor over the variable's other neighbours.</p>
     <p>Repeat for each hidden variable. The final factor, normalized, is the answer to the query.</p>`,
  derivation:
    `<p>Why is multiplying-then-summing correct, and why is it so much faster than the brute-force sum?</p>
     <p><b>Correctness.</b> The query's denominator/numerator is a sum of the joint over hidden variables. The joint factors into a product of conditional tables (the Bayes net), so the marginal is a big sum of products:</p>
     <div class="formula-box">$$ \\sum_{B}\\sum_{\\text{others}} \\prod_j f_j $$</div>
     <ul class="steps">
       <li>The distributive law lets us pull a sum past any factor that does not contain the summed variable: $\\sum_B (f_1(A,B)\\,f_2(B,C)\\,h(A)) = h(A)\\sum_B f_1(A,B)\\,f_2(B,C)$.</li>
       <li>So summing out $B$ only touches the factors that actually mention $B$. Their product summed over $B$ is a valid new factor $g$. The total sum is unchanged. ∎</li>
     </ul>
     <p><b>Why it is cheaper.</b> Brute force sums the full joint over all $n$ variables at once: cost grows like $2^n$ for binary variables. Variable elimination sums out one variable at a time, so cost is set by the <b>largest intermediate factor</b> (the treewidth of the graph), often far smaller than $2^n$.</p>
     <p><b>Why order matters.</b> Different elimination orders create intermediate factors of different sizes. A good order keeps factors small; a bad one can blow them up. Finding the optimal order is itself hard, but cheap heuristics (eliminate the least-connected variable first) work well.</p>
     <p><b>Intuition.</b> It is the same trick as factoring $ab + ac = a(b+c)$: do the small multiplications and the small sums in a smart order instead of expanding everything. You never write down the giant joint table; you collapse it variable by variable.</p>`,
  example:
    `<p>Chain $A - f_1 - B - f_2 - C$ with binary variables. Eliminate $B$ to get $g(A,C)$.</p>
     <ul class="steps">
       <li>$f_1(A{=}0,B{=}0)=2$, $f_1(0,1)=1$; $f_2(B{=}0,C{=}0)=1$, $f_2(1,0)=3$.</li>
       <li>$g(0,0) = \\sum_B f_1(0,B)\\,f_2(B,0) = f_1(0,0)f_2(0,0) + f_1(0,1)f_2(1,0)$.</li>
       <li>$= 2\\times1 + 1\\times3 = 2 + 3 = 5$.</li>
       <li>Repeat for the other $A,C$ combinations. $B$ is now eliminated; the graph is just $A - g - C$.</li>
     </ul>`,
  application:
    `<p>Variable elimination is the standard exact-inference engine inside probabilistic systems: medical diagnosis networks, error-correcting decoders, and speech models. The same factor-graph machinery (the sum-product algorithm) underlies belief propagation and the decoding of LDPC and turbo codes in your phone's modem.</p>`,
  quiz: {
    q: `Eliminate $B$ from $f_1(A,B)$ and $f_2(B,C)$. Given $f_1(1,0)=1$, $f_1(1,1)=3$, $f_2(0,1)=2$, $f_2(1,1)=1$, compute $g(A{=}1, C{=}1) = \\sum_B f_1(1,B)f_2(B,1)$.`,
    a: `<p>$g(1,1) = f_1(1,0)f_2(0,1) + f_1(1,1)f_2(1,1) = 1\\times2 + 3\\times1 = 2 + 3 = 5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-gibbs-particle",
  demo: function (host) {
    // Build up a posterior histogram by sampling. The target posterior over 3 states
    // is fixed (e.g. [0.2, 0.5, 0.3]). Each "sample" draws a state from that posterior;
    // a running histogram of counts converges to the posterior shape.
    host.innerHTML = "";
    var W = 640, H = 320;
    var target = [0.2, 0.5, 0.3];
    var labels = ["state 1", "state 2", "state 3"];
    var counts = [0, 0, 0], total = 0;
    var seed = 13;
    function rng() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function sampleOne() {
      var u = rng(), c = 0;
      for (var i = 0; i < target.length; i++) { c += target[i]; if (u <= c) return i; }
      return target.length - 1;
    }
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var ox = 90, oy = 250, bw = 120, gap = 60, maxH = 180;
      ctx.strokeStyle = t.border; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ox - 20, oy); ctx.lineTo(ox + 3 * (bw + gap), oy); ctx.stroke();
      for (var i = 0; i < 3; i++) {
        var x = ox + i * (bw + gap);
        // target (faint outline) and empirical (filled)
        var th = target[i] * maxH;
        ctx.strokeStyle = t.accent2; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.strokeRect(x, oy - th, bw, th); ctx.setLineDash([]);
        var frac = total ? counts[i] / total : 0;
        var eh = frac * maxH;
        ctx.fillStyle = "rgba(78,161,255,0.6)";
        ctx.fillRect(x, oy - eh, bw, eh);
        ctx.fillStyle = t.ink; ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(labels[i], x + bw / 2, oy + 20);
        ctx.font = "bold 13px sans-serif";
        ctx.fillText(frac.toFixed(2), x + bw / 2, oy - eh - 8);
        ctx.fillStyle = t.accent2; ctx.font = "11px sans-serif";
        ctx.fillText("target " + target[i].toFixed(2), x + bw / 2, oy - th - 22);
      }
      ctx.textAlign = "start";
      out.innerHTML = "Sampling toward the posterior. <span style=\"color:" + t.accent2 + "\">Green dashed = true posterior</span>, " +
        "<span style=\"color:" + t.accent + "\">blue bars = empirical fraction of samples</span>.<br>" +
        "samples drawn: <b>" + total + "</b>. As samples pile up, each bar's height → the posterior probability of that state.";
    }
    var row = mkRow(host);
    mkBtn(row, "Draw 1 sample", function () { counts[sampleOne()]++; total++; draw(); });
    mkBtn(row, "Draw 100 samples", function () { for (var i = 0; i < 100; i++) counts[sampleOne()]++; total += 100; draw(); });
    mkBtn(row, "Reset", function () { counts = [0, 0, 0]; total = 0; seed = 13; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Approximate inference: Gibbs sampling and particle filtering",
  tagline: "Too big to compute exactly? Draw many samples and let the histogram be your answer.",
  prereqs: ["ai-bayes-inference", "aix-variable-elimination"],
  bigIdea:
    `<p>Exact inference is too slow on big, tangled networks. <b>Approximate inference</b> trades exactness for speed by sampling.</p>
     <p><b>Gibbs sampling</b> walks through the variables, resampling one at a time from its conditional given all the others. The visited states form samples from the posterior.</p>
     <p><b>Particle filtering</b> tracks a swarm of guesses (particles) over time, reweighting them by how well they match each new observation.</p>`,
  buildup:
    `<p>To estimate $P(X \\mid \\text{evidence})$, draw many samples consistent with the evidence and count how often each value of $X$ appears.</p>
     <p>Gibbs sampling fixes the evidence, then repeatedly picks one non-evidence variable and resamples it from $P(\\text{that variable}\\mid\\text{all others})$.</p>
     <p>Particle filtering keeps a set of weighted particles; each new observation multiplies a particle's weight by how likely that observation was under it.</p>`,
  symbols: [
    { sym: "$X$", desc: "the query variable whose posterior we want." },
    { sym: "$P(X_i \\mid X_{-i})$", desc: "the conditional of one variable given all the others ($X_{-i}$ means 'all variables except $i$')." },
    { sym: "evidence", desc: "the observed variables, held fixed during sampling." },
    { sym: "particle", desc: "one complete guess of the hidden state; many particles together approximate the distribution." },
    { sym: "weight", desc: "how much a particle counts, set by how well it explains the observed evidence." },
    { sym: "$\\frac{\\text{count}(X=x)}{N}$", desc: "the empirical estimate of $P(X=x)$: the fraction of $N$ samples with that value." }
  ],
  formula: `$$ \\hat P(X = x \\mid \\text{evidence}) \\;\\approx\\; \\frac{\\#\\{\\text{samples with } X = x\\}}{N} $$`,
  whatItDoes:
    `<p>Generate $N$ samples that respect the evidence. Estimate any probability by the fraction of samples that satisfy it.</p>
     <p>Gibbs sampling produces those samples by resampling one variable at a time, which only needs each variable's local conditional, never the full joint.</p>
     <p>Particle filtering does the time-series version: predict each particle forward, weight by the new observation, and resample to keep good particles alive.</p>`,
  derivation:
    `<p>Why does a histogram of samples converge to the true posterior?</p>
     <p><b>Sampling estimates probabilities.</b> Any probability is an expectation of an indicator: $P(X=x) = \\mathbb{E}[\\mathbf{1}\\{X=x\\}]$.</p>
     <ul class="steps">
       <li>Draw $N$ samples from the posterior. Count how many have $X=x$; divide by $N$.</li>
       <li>That fraction is the sample mean of the indicator. By the law of large numbers it converges to its expectation, $P(X=x)$. ∎</li>
     </ul>
     <p><b>Why Gibbs samples the right distribution.</b> Resampling each variable from its conditional given the rest defines a Markov chain whose stationary distribution is exactly the joint posterior. Run it long enough (past the burn-in) and the states you visit are (correlated) draws from the posterior. The key cheapness: $P(X_i \\mid X_{-i})$ depends only on $X_i$'s Markov blanket, a handful of neighbours, not the whole network.</p>
     <p><b>Why particle weights work.</b> Each particle is a sample from a proposal; multiplying its weight by the observation likelihood $P(\\text{obs}\\mid\\text{particle})$ is importance sampling. Resampling in proportion to weights focuses computation on particles that explain the data, so a fixed swarm tracks a moving posterior.</p>
     <p><b>Intuition.</b> You cannot compute the whole probability landscape, so you scatter darts that land more often where probability is high, then read the answer off where the darts cluster. More darts, sharper picture. Gibbs moves one coordinate at a time; particle filters carry a cloud of hypotheses through time, pruning the ones reality contradicts.</p>`,
  example:
    `<p>True posterior over three states is $[0.2, 0.5, 0.3]$. We sample $10$ times and get states: $2,2,2,1,2,3,3,2,2,3$.</p>
     <ul class="steps">
       <li>Counts: state 1 → $1$, state 2 → $6$, state 3 → $3$.</li>
       <li>Estimates: $\\hat P(1) = 1/10 = 0.1$, $\\hat P(2) = 6/10 = 0.6$, $\\hat P(3) = 3/10 = 0.3$.</li>
       <li>With only $10$ samples the estimates are rough (true values $0.2, 0.5, 0.3$).</li>
       <li>Draw thousands more and the histogram tightens onto $[0.2, 0.5, 0.3]$.</li>
     </ul>`,
  application:
    `<p>Particle filters track robot and self-driving-car positions (Monte Carlo localization), aircraft on radar, and objects in video. Gibbs sampling powers topic models, image denoising, and the Bayesian statistics packages (BUGS, Stan's cousins) used across science when the posterior has no closed form.</p>`,
  quiz: {
    q: `Sampling a query variable $X$, out of $200$ samples $50$ have $X=\\text{true}$. What is the estimated $P(X=\\text{true}\\mid\\text{evidence})$?`,
    a: `<p>$\\hat P(X=\\text{true}) = 50/200 = 0.25$. The estimate is just the fraction of samples with that value.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-markov-blanket",
  demo: function (host) {
    // A Bayes net. Highlight node X's Markov blanket: parents, children, and
    // children's other parents (co-parents). Everything else is shaded out, showing
    // X is conditionally independent of it given the blanket.
    host.innerHTML = "";
    var W = 640, H = 340;
    var nodes = {
      P1: { x: 150, y: 60, name: "P1" }, P2: { x: 330, y: 60, name: "P2" },
      X: { x: 240, y: 160, name: "X" },
      C1: { x: 150, y: 260, name: "C1" }, C2: { x: 380, y: 260, name: "C2" },
      CP: { x: 520, y: 160, name: "CP" },   // co-parent: shares child C2 with X
      U: { x: 540, y: 60, name: "U" }        // unrelated/far node
    };
    var edges = [
      ["P1", "X"], ["P2", "X"],       // parents of X
      ["X", "C1"], ["X", "C2"],       // children of X
      ["CP", "C2"],                   // co-parent of child C2
      ["U", "CP"]                     // U is outside the blanket
    ];
    // Markov blanket of X = parents + children + co-parents
    var blanket = { P1: 1, P2: 1, C1: 1, C2: 1, CP: 1 };
    var show = false;
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    function arrow(a, b, dim) {
      var t = C();
      var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy);
      var ux = dx / d, uy = dy / d;
      var x1 = a.x + ux * 24, y1 = a.y + uy * 24, x2 = b.x - ux * 26, y2 = b.y - uy * 26;
      ctx.strokeStyle = dim ? t.border : t.dim; ctx.fillStyle = dim ? t.border : t.dim; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var ang = Math.atan2(uy, ux);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(ang - 0.4), y2 - 9 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 9 * Math.cos(ang + 0.4), y2 - 9 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      edges.forEach(function (e) {
        var inB = show && (blanket[e[0]] || e[0] === "X") && (blanket[e[1]] || e[1] === "X");
        arrow(nodes[e[0]], nodes[e[1]], show && !inB);
      });
      for (var k in nodes) {
        var n = nodes[k], fill = t.panel, ring = t.border, fade = false;
        if (k === "X") { fill = t.accent; ring = t.accent; }
        else if (show && blanket[k]) { fill = "rgba(126,231,135,0.35)"; ring = t.accent2; }
        else if (show) { fade = true; }
        ctx.globalAlpha = fade ? 0.3 : 1;
        ctx.beginPath(); ctx.fillStyle = fill; ctx.strokeStyle = ring; ctx.lineWidth = 2.5;
        ctx.arc(n.x, n.y, 24, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = (k === "X") ? "#0d1117" : t.ink; ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(n.name, n.x, n.y);
        ctx.globalAlpha = 1;
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "Bayes net around node <span style=\"color:" + t.accent + "\">X</span>. " +
        (show ? "Its <b>Markov blanket</b> (green) = parents <b>P1, P2</b>, children <b>C1, C2</b>, and the child's other parent (co-parent) <b>CP</b>.<br>" +
                "Given the blanket, X is independent of everything else (faded), like node <b>U</b>. The blanket shields X completely."
              : "Click to reveal X's Markov blanket: parents, children, and children's other parents.");
    }
    var row = mkRow(host);
    mkBtn(row, "Show Markov blanket", function () { show = true; draw(); });
    mkBtn(row, "Hide", function () { show = false; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "The Markov blanket",
  tagline: "A node only needs to know its neighbors. Given them, the rest of the world is irrelevant.",
  prereqs: ["ai-bayes-net", "aix-gibbs-particle"],
  bigIdea:
    `<p>In a Bayes net, a node is not tangled up with the whole graph. It depends on a small local set: its <b>Markov blanket</b>.</p>
     <p>The blanket is the node's <b>parents</b>, its <b>children</b>, and its <b>children's other parents</b> (co-parents).</p>
     <p>Given the values of its blanket, a node is conditionally independent of every other variable in the network.</p>`,
  buildup:
    `<p>Parents directly influence the node. Children are directly influenced by it. So both clearly matter.</p>
     <p>Co-parents matter because of <b>explaining away</b>: once you observe a shared child, the parents become coupled.</p>
     <p>Put those three groups together and you have shielded the node from everything else.</p>`,
  symbols: [
    { sym: "$X$", desc: "the node of interest." },
    { sym: "$\\text{MB}(X)$", desc: "the Markov blanket of $X$: its parents, children, and co-parents." },
    { sym: "$\\text{Rest}$", desc: "all variables not in $X$ and not in its blanket." },
    { sym: "$\\perp$", desc: "'is independent of'. $A \\perp B$ means knowing $B$ tells you nothing new about $A$." },
    { sym: "$\\mid$", desc: "'given' (conditioning): the bar before the things we already know." },
    { sym: "co-parent", desc: "another parent of one of $X$'s children." }
  ],
  formula: `$$ X \\;\\perp\\; \\text{Rest} \\;\\big|\\; \\text{MB}(X) \\qquad \\text{MB}(X) = \\text{parents} \\cup \\text{children} \\cup \\text{co-parents} $$`,
  whatItDoes:
    `<p>The Markov blanket is the smallest set of nodes that makes $X$ independent of all the rest.</p>
     <p>Once you know the blanket's values, no other variable changes your belief about $X$.</p>
     <p>This is why Gibbs sampling is cheap: to resample $X$ you only look at its blanket, never the whole graph.</p>`,
  derivation:
    `<p>Why exactly these three groups, and why not more or fewer?</p>
     <p><b>Start from the factored joint.</b> $P(\\text{all}) = \\prod_i P(X_i \\mid \\text{Parents}(i))$. To get $P(X \\mid \\text{everything else})$, keep only the factors that contain $X$; the rest are constants that cancel in the normalization.</p>
     <ul class="steps">
       <li>Which factors contain $X$? (1) $X$'s own term $P(X \\mid \\text{Parents}(X))$ — brings in $X$'s <b>parents</b>.</li>
       <li>(2) Each child's term $P(\\text{child} \\mid \\text{Parents}(\\text{child}))$, since $X$ is one of those parents — brings in the <b>children</b>, and also the children's <i>other</i> parents, the <b>co-parents</b>.</li>
       <li>No other factor mentions $X$. So $P(X \\mid \\text{rest})$ depends only on parents, children, and co-parents. Everything else cancels. ∎</li>
     </ul>
     <p><b>Why co-parents cannot be dropped.</b> A child is a collider: $X \\to \\text{child} \\leftarrow \\text{co-parent}$. Observing the child opens the path between $X$ and the co-parent (explaining away). So conditioning on the child <i>creates</i> a dependence on the co-parent that you must include to seal the blanket.</p>
     <p><b>Why parents alone are not enough.</b> Knowing a child's value also tells you about $X$ (information flows backward up an arrow). So children must be in the blanket too, even though $X$ does not point the other way.</p>
     <p><b>Intuition.</b> The blanket is a fence. Influence can reach $X$ only through its parents (causes), its children (effects), or the back-door explaining-away link via a shared child. Stand on the whole fence and nothing outside can sneak in. That locality is what makes large probabilistic models computable at all.</p>`,
  example:
    `<p>Node $X$ has parents $\\{P_1, P_2\\}$, children $\\{C_1, C_2\\}$, and $C_2$ has another parent $\\text{CP}$.</p>
     <ul class="steps">
       <li>Parents in the blanket: $P_1, P_2$.</li>
       <li>Children in the blanket: $C_1, C_2$.</li>
       <li>Co-parent (other parent of child $C_2$): $\\text{CP}$.</li>
       <li>So $\\text{MB}(X) = \\{P_1, P_2, C_1, C_2, \\text{CP}\\}$. Given these five, $X$ is independent of all other nodes, however far they are.</li>
     </ul>`,
  application:
    `<p>The Markov blanket makes large-scale probabilistic inference feasible: Gibbs samplers, belief propagation, and Markov random fields all update a variable using only its blanket. In feature selection, the Markov blanket of a target is provably the minimal optimal feature set. The concept even appears in theories of biological self-organization (the "free energy principle").</p>`,
  quiz: {
    q: `Node $Y$ has parents $\\{A\\}$, one child $Z$, and $Z$'s other parent is $W$. List the Markov blanket of $Y$.`,
    a: `<p>$\\text{MB}(Y) = \\{A, Z, W\\}$: parent $A$, child $Z$, and co-parent $W$. Given these, $Y$ is independent of everything else.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-forward-backward",
  demo: function (host) {
    // A 4-step trellis with 2 hidden states. A forward pass (left->right) builds
    // alpha; a backward pass (right->left) builds beta; the smoothed posterior is
    // proportional to alpha*beta. Step through forward, then backward, then combine.
    host.innerHTML = "";
    var W = 640, H = 340, T = 4;
    var stay = 0.7;                       // P(stay in same state)
    var emit = [[0.9, 0.1], [0.2, 0.8]];  // emit[state][obs]
    var obs = [0, 0, 1, 0];               // observation per step (0 or 1)
    function trans(i, j) { return i === j ? stay : 1 - stay; }
    var alpha, beta, phase, fIdx, bIdx;
    function reset() {
      alpha = []; beta = [];
      for (var i = 0; i < T; i++) { alpha.push([0, 0]); beta.push([1, 1]); }
      // forward init
      alpha[0] = [0.5 * emit[0][obs[0]], 0.5 * emit[1][obs[0]]];
      phase = "forward"; fIdx = 0; bIdx = T - 1; draw();
    }
    function fStep() {
      if (fIdx >= T - 1) { phase = "backward"; bIdx = T - 1; draw(); return; }
      var n = fIdx + 1, a = [0, 0];
      for (var j = 0; j < 2; j++) {
        var s = 0; for (var i = 0; i < 2; i++) s += alpha[fIdx][i] * trans(i, j);
        a[j] = s * emit[j][obs[n]];
      }
      alpha[n] = a; fIdx++; draw();
    }
    function bStep() {
      if (bIdx <= 0) { phase = "combine"; draw(); return; }
      var p = bIdx - 1, b = [0, 0];
      for (var i = 0; i < 2; i++) {
        var s = 0; for (var j = 0; j < 2; j++) s += trans(i, j) * emit[j][obs[bIdx]] * beta[bIdx][j];
        b[i] = s;
      }
      beta[p] = b; bIdx--; draw();
    }
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    function colX(i) { return 90 + i * 150; }
    var y0 = 90, y1 = 200;
    function post(t) {
      var u0 = alpha[t][0] * beta[t][0], u1 = alpha[t][1] * beta[t][1], z = u0 + u1;
      return z > 0 ? [u0 / z, u1 / z] : [0.5, 0.5];
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = t.border; ctx.lineWidth = 1.5;
      for (var i = 0; i < T - 1; i++) {
        var x1 = colX(i), x2 = colX(i + 1);
        [[y0, y0], [y0, y1], [y1, y0], [y1, y1]].forEach(function (yy) {
          ctx.beginPath(); ctx.moveTo(x1 + 24, yy[0]); ctx.lineTo(x2 - 24, yy[1]); ctx.stroke();
        });
      }
      for (var k = 0; k < T; k++) {
        var x = colX(k), pr = (phase === "combine") ? post(k) : null;
        drawNode(t, x, y0, "H=1", k, 0, pr);
        drawNode(t, x, y1, "H=2", k, 1, pr);
        ctx.fillStyle = t.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText("t" + (k + 1) + " obs=" + (obs[k] === 0 ? "A" : "B"), x, 300);
      }
      ctx.textAlign = "start";
      var msg;
      if (phase === "forward") msg = "<b>Forward pass</b> (left→right): α<sub>i</sub> accumulates evidence from the start up to step i. At step t" + (fIdx + 1) + ".";
      else if (phase === "backward") msg = "<b>Backward pass</b> (right→left): β<sub>i</sub> accumulates evidence from the end back to step i. At step t" + (bIdx + 1) + ".";
      else msg = "<b>Combine</b>: smoothed posterior P(H<sub>i</sub>|E) ∝ α<sub>i</sub>·β<sub>i</sub>. Node fill now shows the full belief using <i>all</i> observations.";
      out.innerHTML = "HMM trellis, 2 hidden states. " + msg + "<br>" +
        "α at t" + (fIdx + 1) + ": [" + alpha[Math.min(fIdx, T - 1)].map(function (v) { return v.toFixed(3); }).join(", ") + "]. " +
        (phase === "combine" ? "Smoothed P(H|E) at t1: [" + post(0).map(function (v) { return v.toFixed(2); }).join(", ") + "]." : "");
    }
    function drawNode(t, x, y, name, k, state, pr) {
      var fillP = pr ? pr[state] : Math.min(1, alpha[k][state] * 4);
      ctx.beginPath();
      ctx.fillStyle = "rgba(78,161,255," + (0.1 + 0.75 * Math.max(0, Math.min(1, fillP))).toFixed(3) + ")";
      ctx.strokeStyle = t.border; ctx.lineWidth = 2;
      ctx.arc(x, y, 24, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = t.ink; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(name, x, y);
      ctx.textBaseline = "alphabetic";
    }
    var row = mkRow(host);
    mkBtn(row, "Forward step ▶", fStep);
    mkBtn(row, "◀ Backward step", bStep);
    mkBtn(row, "Reset", reset);
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  title: "HMM smoothing (forward-backward)",
  tagline: "Use the future as well as the past. Combine both directions for the best estimate of each state.",
  prereqs: ["ai-hmm", "aix-variable-elimination"],
  bigIdea:
    `<p>Filtering an HMM uses only past clues. But to estimate a <i>past</i> hidden state, the clues that came <i>after</i> it also help.</p>
     <p>The <b>forward-backward</b> algorithm runs two passes. The forward pass $\\alpha$ gathers evidence from the start up to step $i$; the backward pass $\\beta$ gathers evidence from the end back to step $i$.</p>
     <p>Multiply them: the smoothed posterior $P(H_i \\mid E)$ is proportional to $\\alpha_i\\,\\beta_i$. This is called <b>smoothing</b>.</p>`,
  buildup:
    `<p>Let $H_i$ be the hidden state at step $i$ and $E$ the whole sequence of observations $E_1,\\dots,E_T$.</p>
     <p>The forward message $\\alpha_i$ is the joint probability of the observations up to step $i$ together with $H_i$.</p>
     <p>The backward message $\\beta_i$ is the probability of the observations <i>after</i> step $i$, given $H_i$.</p>`,
  symbols: [
    { sym: "$H_i$", desc: "the hidden state at time step $i$." },
    { sym: "$E$", desc: "the full sequence of observations $E_1,\\dots,E_T$ (all the clues)." },
    { sym: "$\\alpha_i(h)$", desc: "the forward message: $P(E_{1:i}, H_i = h)$, evidence from the start up to and including step $i$." },
    { sym: "$\\beta_i(h)$", desc: "the backward message: $P(E_{i+1:T} \\mid H_i = h)$, evidence from after step $i$ to the end." },
    { sym: "$\\propto$", desc: "'is proportional to': equal up to a constant factor that makes the values sum to $1$." },
    { sym: "smoothing", desc: "estimating a past hidden state using all the evidence, both before and after it." }
  ],
  formula: `$$ P(H_i = h \\mid E) \\;\\propto\\; \\alpha_i(h)\\,\\beta_i(h) $$`,
  whatItDoes:
    `<p>Run the forward pass to fill in every $\\alpha_i$, sweeping left to right.</p>
     <p>Run the backward pass to fill in every $\\beta_i$, sweeping right to left.</p>
     <p>At each step, multiply $\\alpha_i(h)\\,\\beta_i(h)$ and normalize. That gives the posterior over the hidden state using <i>all</i> the evidence, not just the past.</p>`,
  derivation:
    `<p>Why does $\\alpha_i \\cdot \\beta_i$ give the posterior, and why does it factor so cleanly?</p>
     <p><b>Split the evidence at step $i$.</b> The observations divide into past ($E_{1:i}$) and future ($E_{i+1:T}$).</p>
     <div class="formula-box">$$ P(H_i, E) = P(E_{1:i}, H_i)\\;P(E_{i+1:T}\\mid H_i, E_{1:i}) $$</div>
     <ul class="steps">
       <li>The first factor is exactly $\\alpha_i(H_i)$ by definition.</li>
       <li>By the Markov property, the future depends on the past <i>only</i> through the current state: $P(E_{i+1:T}\\mid H_i, E_{1:i}) = P(E_{i+1:T}\\mid H_i) = \\beta_i(H_i)$.</li>
       <li>So $P(H_i, E) = \\alpha_i(H_i)\\,\\beta_i(H_i)$. Dividing by $P(E)$ (a constant in $H_i$) gives $P(H_i\\mid E) \\propto \\alpha_i \\beta_i$. ∎</li>
     </ul>
     <p><b>Why each pass is a simple recursion.</b> $\\alpha$ moves forward by summing over the previous state: $\\alpha_{i+1}(h') = \\big[\\sum_h \\alpha_i(h)\\,P(h'\\mid h)\\big]P(E_{i+1}\\mid h')$ — predict via the transition, reweight by the new emission. $\\beta$ mirrors it moving backward. Each step is one sum-out of one variable: forward-backward is just variable elimination run along the chain in both directions.</p>
     <p><b>Why smoothing beats filtering.</b> Filtering uses $\\alpha_i$ alone (past only). Multiplying in $\\beta_i$ injects the future evidence, which can sharply revise a belief — a later clue can reveal what an earlier ambiguous step must have been.</p>
     <p><b>Intuition.</b> To judge where you were a minute ago, it helps to know both where you came from and where you ended up. The forward pass carries the story up to now; the backward pass carries it from the end back. Glue them at the same instant and you get the best possible estimate of that instant.</p>`,
  example:
    `<p>At step $i$, the forward message is $\\alpha_i = [0.6, 0.2]$ over hidden states $\\{1, 2\\}$, and the backward message is $\\beta_i = [0.5, 1.0]$.</p>
     <ul class="steps">
       <li>Multiply elementwise: $\\alpha_i \\cdot \\beta_i = [0.6\\times0.5,\\; 0.2\\times1.0] = [0.30, 0.20]$.</li>
       <li>Normalize: divide by the total $0.30 + 0.20 = 0.50$.</li>
       <li>$P(H_i = 1 \\mid E) = 0.30/0.50 = 0.6$, $P(H_i = 2 \\mid E) = 0.20/0.50 = 0.4$.</li>
       <li>The future evidence ($\\beta$) reweighted the belief away from what filtering alone would have said.</li>
     </ul>`,
  application:
    `<p>Forward-backward trains and decodes HMMs in speech recognition, gene finding (which DNA regions are genes), and part-of-speech tagging. It is the E-step of the Baum-Welch (EM) algorithm that learns the HMM's parameters from unlabeled sequences.</p>`,
  quiz: {
    q: `Forward $\\alpha_i = [0.4, 0.4]$ and backward $\\beta_i = [1.0, 0.0]$ over states $\\{1,2\\}$. What is the smoothed posterior $P(H_i \\mid E)$?`,
    a: `<p>Products: $[0.4\\times1.0,\\,0.4\\times0.0] = [0.4, 0.0]$. Normalize by $0.4$: $P(H_i{=}1)=1.0$, $P(H_i{=}2)=0.0$. The backward evidence ruled out state $2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-lda-topic",
  demo: function (host) {
    // Three documents, each a topic-proportion bar over 2 topics. Two topics, each
    // a word list. Toggle a document's dominant topic to see its bar shift and its
    // generated words lean toward that topic's vocabulary.
    host.innerHTML = "";
    var W = 640, H = 340;
    var topics = [
      { name: "Sports", color: "#4ea1ff", words: ["game", "team", "score", "win", "coach"] },
      { name: "Finance", color: "#7ee787", words: ["market", "stock", "price", "trade", "bank"] }
    ];
    // theta[d] = [P(topic0), P(topic1)] for document d
    var theta = [[0.8, 0.2], [0.5, 0.5], [0.2, 0.8]];
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      // topics legend
      ctx.font = "bold 13px sans-serif";
      for (var k = 0; k < 2; k++) {
        ctx.fillStyle = topics[k].color; ctx.fillRect(360, 30 + k * 90, 14, 14);
        ctx.fillStyle = t.ink; ctx.fillText(topics[k].name + ": " + topics[k].words.join(", "), 384, 37 + k * 90);
      }
      // document bars
      for (var d = 0; d < 3; d++) {
        var y = 50 + d * 80, x0 = 40, barW = 280, h = 36;
        ctx.fillStyle = t.dim; ctx.font = "13px sans-serif";
        ctx.fillText("Doc " + (d + 1), x0, y - 14);
        var w0 = theta[d][0] * barW;
        ctx.fillStyle = topics[0].color; ctx.fillRect(x0, y, w0, h);
        ctx.fillStyle = topics[1].color; ctx.fillRect(x0 + w0, y, barW - w0, h);
        ctx.strokeStyle = t.border; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y, barW, h);
        ctx.fillStyle = "#0d1117"; ctx.font = "bold 12px sans-serif"; ctx.textBaseline = "middle";
        if (theta[d][0] > 0.12) ctx.fillText((theta[d][0] * 100).toFixed(0) + "%", x0 + 6, y + h / 2);
        if (theta[d][1] > 0.12) ctx.fillText((theta[d][1] * 100).toFixed(0) + "%", x0 + w0 + 6, y + h / 2);
      }
      ctx.textBaseline = "alphabetic";
      out.innerHTML = "Each document is a <b>mixture of topics</b> θ (the bar). Each topic is a distribution over words (the legend).<br>" +
        "To generate a word: pick a topic Z ∼ θ, then a word W ∼ φ<sub>Z</sub>. A doc that is mostly " +
        "<span style=\"color:" + topics[0].color + "\">Sports</span> emits mostly sports words.";
    }
    var row = mkRow(host);
    mkBtn(row, "Doc 1 → more Sports", function () { theta[0] = [Math.min(1, theta[0][0] + 0.1), 0]; theta[0][1] = 1 - theta[0][0]; draw(); });
    mkBtn(row, "Doc 3 → more Finance", function () { theta[2] = [Math.max(0, theta[2][0] - 0.1), 0]; theta[2][1] = 1 - theta[2][0]; draw(); });
    mkBtn(row, "Reset", function () { theta = [[0.8, 0.2], [0.5, 0.5], [0.2, 0.8]]; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "Latent Dirichlet Allocation (topic modeling)",
  tagline: "Every document is a blend of hidden topics. Each topic is a favorite set of words.",
  prereqs: ["aix-gibbs-particle", "ai-bayes-net"],
  bigIdea:
    `<p><b>Latent Dirichlet Allocation (LDA)</b> discovers hidden <b>topics</b> in a collection of documents, with no labels.</p>
     <p>Each document is a <b>mixture of topics</b>, described by proportions $\\theta$. Each topic is a distribution over words, $\\phi$.</p>
     <p>To make a word, the model first picks a topic from the document's mix, then picks a word from that topic's vocabulary.</p>`,
  buildup:
    `<p>Imagine writing a document. First decide its topic blend $\\theta$: maybe $70\\%$ sports, $30\\%$ finance.</p>
     <p>For each word slot, draw a topic $Z_i$ from that blend. Then draw a word $W_i$ from the chosen topic's word distribution $\\phi_{Z_i}$.</p>
     <p>We never see the topics; we only see the words. LDA works backward to recover the hidden $\\theta$ and $\\phi$.</p>`,
  symbols: [
    { sym: "$\\theta$", desc: "the document's topic proportions: a probability for each topic (Greek 'theta')." },
    { sym: "$\\phi_k$", desc: "topic $k$'s word distribution: a probability for each word (Greek 'phi')." },
    { sym: "$Z_i$", desc: "the hidden topic chosen for word slot $i$." },
    { sym: "$W_i$", desc: "the actual word in slot $i$ (the only thing we observe)." },
    { sym: "$Z_i \\sim \\theta$", desc: "draw the topic $Z_i$ at random according to the document's topic mix $\\theta$." },
    { sym: "$W_i \\sim \\phi_{Z_i}$", desc: "draw the word $W_i$ from the chosen topic's word distribution." },
    { sym: "Dirichlet", desc: "the prior distribution over the proportion vectors $\\theta$ and $\\phi$ (it favors sparse, peaked mixtures)." }
  ],
  formula: `$$ Z_i \\sim \\text{Categorical}(\\theta) \\qquad W_i \\sim \\text{Categorical}(\\phi_{Z_i}) $$`,
  whatItDoes:
    `<p>The model is a recipe for generating documents: per document choose a topic mix $\\theta$, then per word choose a topic $Z_i$ and then a word $W_i$.</p>
     <p>Given the observed words, inference (usually Gibbs sampling) runs the recipe backward to find the $\\theta$ and $\\phi$ that most likely produced them.</p>
     <p>The output is a set of human-readable topics (word lists) and, for each document, how much of each topic it contains.</p>`,
  derivation:
    `<p>Why does this two-step "pick a topic, then a word" recipe recover meaningful topics?</p>
     <p><b>The generative story fixes a likelihood.</b> The probability of one word $W_i$ in a document is a mixture:</p>
     <div class="formula-box">$$ P(W_i = w \\mid \\theta, \\phi) = \\sum_k P(Z_i = k \\mid \\theta)\\,P(W_i = w \\mid \\phi_k) = \\sum_k \\theta_k\\,\\phi_{k,w} $$</div>
     <ul class="steps">
       <li>Sum over the hidden topic $k$: the chance the slot used topic $k$ ($\\theta_k$) times the chance that topic emits word $w$ ($\\phi_{k,w}$).</li>
       <li>The whole document's likelihood is the product of this over all its word slots; the corpus likelihood is the product over documents.</li>
       <li>Inference maximizes (or samples from) this likelihood over $\\theta$ and $\\phi$. The settings that explain the words best are the ones where words that <i>co-occur</i> get grouped into the same topic. ∎</li>
     </ul>
     <p><b>Why the Dirichlet prior matters.</b> A Dirichlet prior on $\\theta$ and $\\phi$ pushes them toward <b>sparse</b> vectors: documents about a few topics, topics with a few signature words. Without it, the model could spread mass uniformly and learn nothing. The prior is the "Dirichlet" in LDA.</p>
     <p><b>Why topics emerge unsupervised.</b> Words like "game", "team", "score" tend to appear together; LDA can raise their joint likelihood by assigning them to one topic. Co-occurrence is the only signal, yet it reliably carves a corpus into themes.</p>
     <p><b>Intuition.</b> Think of each document as poured from a few colored jugs (topics), each jug full of its own favorite words. You only see the final mixed cup of words. LDA reverse-engineers which jugs exist and how much of each went into every cup.</p>`,
  example:
    `<p>Two topics: Sports $= \\{$game, team, score$\\}$, Finance $= \\{$market, stock, price$\\}$. A document has topic mix $\\theta = [0.8, 0.2]$ (mostly Sports).</p>
     <ul class="steps">
       <li>For a word slot, draw the topic: $P(Z = \\text{Sports}) = 0.8$, $P(Z = \\text{Finance}) = 0.2$.</li>
       <li>Most slots draw Sports, so most words come from $\\{$game, team, score$\\}$.</li>
       <li>Probability the word is "stock": $\\theta_{\\text{Fin}} \\times \\phi_{\\text{Fin, stock}} = 0.2 \\times P(\\text{stock}\\mid\\text{Finance})$.</li>
       <li>If $P(\\text{stock}\\mid\\text{Finance}) = 0.3$, that is $0.2\\times0.3 = 0.06$: rare, because the document is mostly Sports.</li>
     </ul>`,
  application:
    `<p>LDA organizes huge text collections: it powers topic browsers for news archives and scientific papers, content recommendation, and exploratory analysis of survey responses or customer reviews. The same mixture idea extends to images (objects as topics) and genetics (populations as topics).</p>`,
  quiz: {
    q: `A document has topic mix $\\theta = [0.6, 0.4]$ over (Sports, Finance). Topic Finance gives the word "bank" probability $0.5$. What is $P(\\text{word} = \\text{"bank"} \\text{ from Finance})$?`,
    a: `<p>$\\theta_{\\text{Fin}} \\times \\phi_{\\text{Fin, bank}} = 0.4 \\times 0.5 = 0.2$. There is a $0.2$ chance a given slot is a Finance topic emitting "bank".</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "aix-fol",
  demo: function (host) {
    // Show unification of two atoms P(x,b) and P(a,y) -> {x/a, y/b}, then one
    // resolution step combining two clauses on a complementary literal.
    host.innerHTML = "";
    var W = 640, H = 320;
    var stage = 0;   // 0: atoms, 1: unified, 2: resolution
    var c0 = mkCanvas(host, W, H), ctx = c0.ctx;
    var out = mkOut(host);
    function txt(x, y, s, color, bold, size) {
      var t = C(); ctx.fillStyle = color || t.ink;
      ctx.font = (bold ? "bold " : "") + (size || 16) + "px monospace";
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillText(s, x, y);
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      txt(40, 50, "Unification", t.accent2, true, 18);
      txt(60, 90, "P(x, b)", t.accent, true);
      txt(60, 120, "P(a, y)", t.warn, true);
      if (stage >= 1) {
        txt(220, 105, "→  substitution θ = { x/a,  y/b }", t.ink, true);
        txt(60, 160, "after applying θ:  P(a, b)  =  P(a, b)   ✓ identical", t.accent2, true, 15);
      }
      if (stage >= 2) {
        txt(40, 210, "Resolution", t.accent2, true, 18);
        txt(60, 245, "Clause 1:  ¬P(a, b)  ∨  Q(a)", t.warn, true, 15);
        txt(60, 272, "Clause 2:  P(a, b)             (a fact)", t.accent, true, 15);
        txt(60, 300, "resolve on P(a,b):  ⇒  Q(a)", t.accent2, true, 15);
      }
      out.innerHTML = "<b>First-order logic.</b> " +
        (stage === 0 ? "Two atoms P(x,b) and P(a,y). Click to <b>unify</b> them: find a substitution making them identical."
        : stage === 1 ? "Unified by θ = {x/a, y/b}: both become P(a,b). Click again for a <b>resolution</b> step."
        : "Resolution: ¬P(a,b)∨Q(a) and the fact P(a,b) cancel the complementary literal P(a,b), deriving the new fact <b>Q(a)</b>.");
    }
    var row = mkRow(host);
    mkBtn(row, "Next step", function () { stage = Math.min(2, stage + 1); draw(); });
    mkBtn(row, "Reset", function () { stage = 0; draw(); });
    host.insertBefore(c0.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  title: "First-order logic",
  tagline: "Talk about objects, their properties, and 'for all' / 'there exists'. Then reason by unifying and resolving.",
  prereqs: ["ai-propositional-logic", "ai-inference-rules"],
  bigIdea:
    `<p>Propositional logic only has whole true/false facts. <b>First-order logic (FOL)</b> can talk about <i>objects</i> and their relations.</p>
     <p>It adds <b>predicates</b> like $P(x,y)$ ("$x$ relates to $y$"), <b>variables</b>, and <b>quantifiers</b> $\\forall$ ("for all") and $\\exists$ ("there exists").</p>
     <p>Reasoning works by <b>unification</b> (find a substitution that makes two atoms identical) and <b>resolution</b> (cancel matching opposite literals to derive new facts).</p>`,
  buildup:
    `<p>A <b>predicate</b> takes objects and returns true/false: $\\text{Loves}(\\text{alice}, \\text{bob})$.</p>
     <p>A <b>variable</b> like $x$ stands for any object. A <b>quantifier</b> says how many: $\\forall x$ ("for every $x$") or $\\exists x$ ("for some $x$").</p>
     <p>To use a general rule on a specific fact, we must line them up. <b>Unification</b> finds the substitution of variables that makes two atoms match.</p>`,
  symbols: [
    { sym: "$P(x, y)$", desc: "a predicate applied to terms $x$ and $y$; it is true or false for given objects." },
    { sym: "$\\forall$", desc: "the universal quantifier: 'for all'. $\\forall x\\,P(x)$ means $P$ holds for every object." },
    { sym: "$\\exists$", desc: "the existential quantifier: 'there exists'. $\\exists x\\,P(x)$ means $P$ holds for at least one object." },
    { sym: "$\\{x/a\\}$", desc: "a substitution: replace variable $x$ with term $a$ everywhere." },
    { sym: "$\\theta$", desc: "a unifier (Greek 'theta'): the substitution that makes two atoms identical." },
    { sym: "$\\neg$", desc: "logical negation: 'not'. $\\neg P$ is true exactly when $P$ is false." },
    { sym: "$\\vee$", desc: "logical 'or': $A \\vee B$ is true if at least one of $A$, $B$ holds." },
    { sym: "resolution", desc: "an inference rule: from $A \\vee L$ and $\\neg L' \\vee B$ with $L,L'$ unifiable, derive $A \\vee B$." }
  ],
  formula: `$$ \\text{unify}\\big(P(x,b),\\, P(a,y)\\big) = \\{x/a,\\; y/b\\} \\qquad \\frac{\\neg P \\vee Q,\\quad P}{Q} $$`,
  whatItDoes:
    `<p><b>Unification</b> matches two atoms by substituting variables. $P(x,b)$ and $P(a,y)$ both become $P(a,b)$ under $\\{x/a, y/b\\}$.</p>
     <p><b>Resolution</b> takes two clauses with a complementary literal (one has $P$, the other $\\neg P$, made identical by unification) and cancels it, joining the leftovers into a new clause.</p>
     <p>Repeatedly resolving lets you derive new facts, or prove a goal by deriving a contradiction (the empty clause) from the negated goal.</p>`,
  derivation:
    `<p>Why is resolution a <i>sound</i> way to reason, and why does unification make it work in first-order logic?</p>
     <p><b>Soundness of resolution.</b> Suppose both clauses are true: $\\neg P \\vee Q$ and $P$.</p>
     <ul class="steps">
       <li>$P$ is true (it is asserted as a fact).</li>
       <li>For $\\neg P \\vee Q$ to be true while $P$ is true, the $\\neg P$ part is false, so the $Q$ part must carry the truth: $Q$ is true.</li>
       <li>Therefore $Q$ follows from the two clauses. The resolvent is a logical consequence: resolution never invents a falsehood. ∎</li>
     </ul>
     <p>This is just <b>modus ponens</b> in clause form: $P$ and "$P \\Rightarrow Q$" (which is $\\neg P \\vee Q$) give $Q$.</p>
     <p><b>Why unification.</b> A general rule like $\\forall x\\,[\\neg P(x,b) \\vee Q(x)]$ and a fact $P(a,b)$ do not literally share a symbol — one has variable $x$, the other constant $a$. Unification finds $\\theta = \\{x/a\\}$ so both name the same atom $P(a,b)$. Only then can resolution cancel them, yielding $Q(a)$. The <b>most general unifier</b> commits to the fewest substitutions, keeping conclusions as general as possible.</p>
     <p><b>Why completeness matters.</b> Resolution refutation is <i>complete</i> for FOL: if a set of clauses is unsatisfiable, repeated resolution will eventually derive the empty clause. So to prove "$KB \\models \\text{goal}$", add $\\neg\\text{goal}$ and resolve until you reach a contradiction.</p>
     <p><b>Intuition.</b> Predicates and quantifiers let logic describe a whole world of objects, not just a fixed list of yes/no facts. Unification is pattern-matching: line up a general law with a specific case. Resolution is the single engine that, fed unified clauses, grinds out every consequence.</p>`,
  example:
    `<p>Unify $P(x, b)$ with $P(a, y)$, then resolve with a rule.</p>
     <ul class="steps">
       <li>Match position 1: $x$ vs $a$ → substitute $\\{x/a\\}$. Match position 2: $b$ vs $y$ → substitute $\\{y/b\\}$.</li>
       <li>Unifier $\\theta = \\{x/a, y/b\\}$. Both atoms become $P(a, b)$: identical. ✓</li>
       <li>Now take the rule $\\neg P(a,b) \\vee Q(a)$ (i.e. "$P(a,b) \\Rightarrow Q(a)$") and the fact $P(a,b)$.</li>
       <li>Resolve on $P(a,b)$: the $\\neg P(a,b)$ and $P(a,b)$ cancel, leaving the new fact $Q(a)$.</li>
     </ul>`,
  application:
    `<p>First-order logic and resolution power automated theorem provers, the Prolog programming language (its execution <i>is</i> resolution), formal verification of hardware and software, and the knowledge bases behind expert systems and the semantic web (ontologies, description logics).</p>`,
  quiz: {
    q: `Find a unifier for $\\text{Loves}(x, \\text{mary})$ and $\\text{Loves}(\\text{john}, y)$. Then, given the rule $\\neg\\text{Loves}(\\text{john},\\text{mary}) \\vee \\text{Happy}(\\text{john})$ and the fact $\\text{Loves}(\\text{john},\\text{mary})$, what does resolution derive?`,
    a: `<p>Unifier $\\theta = \\{x/\\text{john},\\, y/\\text{mary}\\}$; both become $\\text{Loves}(\\text{john}, \\text{mary})$. Resolving on it cancels the complementary literal and derives $\\text{Happy}(\\text{john})$.</p>`
  }
});

})();
