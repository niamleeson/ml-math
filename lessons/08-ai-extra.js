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
    `<p>A* (say "A-star") is a way to find the cheapest route to a goal. It works faster if you can give it a <b>hint</b> about how far the goal still is. That hint is the <b>heuristic</b> $h(s)$ — read it as "h of s", a guess of the remaining cost from where you are now (the state $s$) to the goal.</p>
     <p>The one rule the hint must obey: it may be too low, but it must <b>never be too high</b>. (Why? A hint that exaggerates the distance can scare A* away from the real shortest path.)</p>
     <p>So where do we get a hint that is guaranteed never to exaggerate? We <b>relax</b> the problem: throw away one of the rules to make an easier version, and solve that. The easy version's cost is the hint.</p>
     <p>Think of a runner facing a hurdle race versus a flat sprint over the same distance. The flat sprint (rules removed) can only be faster or equal — never slower. So its time is a safe "you'll need at least this long" estimate for the real race.</p>`,
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
    `<p>Start at cell $(0,0)$, goal at $(4,4)$ in a $5\\times5$ maze. Walls force a long detour. Plug the cells into the Manhattan formula, then compare the relaxed cost to the true cost.</p>
     <ul class="steps">
       <li>Row gap: $|\\Delta r| = |4-0| = 4$.</li>
       <li>Column gap: $|\\Delta c| = |4-0| = 4$.</li>
       <li>Relax (remove walls): $h = |\\Delta r| + |\\Delta c| = 4 + 4 = 8$.</li>
       <li>True maze path winds around the walls: $\\text{Cost} = 12$ steps.</li>
       <li>Check admissibility: $h = 8 \\le 12 = \\text{Cost}$. Never overestimates. ✓</li>
     </ul>
     <table class="extable">
       <caption>Relaxed heuristic $h$ vs true cost for two start cells (goal $(4,4)$)</caption>
       <thead><tr><th>start $(r,c)$</th><th class="num">$h=|\\Delta r|+|\\Delta c|$</th><th class="num">true cost</th><th>admissible?</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$(0,0)$</td><td class="num">$8$</td><td class="num">$12$</td><td>yes ($8 \\le 12$)</td></tr>
         <tr><td class="row-h">$(2,4)$</td><td class="num">$2$</td><td class="num">$6$</td><td>yes ($2 \\le 6$)</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>Relaxation is the standard recipe for inventing heuristics. For the 8-puzzle, "ignore that tiles block each other" gives the Manhattan-distance heuristic. For routing, "ignore roads, fly straight" gives the straight-line heuristic. Every good A* heuristic is a relaxed problem in disguise.</p>`,
  whenToUse:
    `<p><b>Reach for a relaxed heuristic whenever you run A* (A-star) or any informed search and need an admissible estimate of cost-to-go</b> but cannot hand-craft one. Pick a constraint to delete so the easier problem has a closed-form or fast solution, and use that cost as $h$.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A hand-tuned guess</b> — a relaxation is provably admissible by construction, so A* stays optimal; a hand-tuned guess can overestimate and break optimality.</li>
       <li><b>$h=0$ (uniform-cost / Dijkstra)</b> — when blind search explores too many nodes; a relaxed $h$ aims the search and prunes hard.</li>
       <li><b>Pattern databases</b> — when you want a cheap, instantly-computable heuristic instead of precomputing and storing exact sub-problem costs.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You need the <i>tightest</i> possible heuristic and have memory to spare — build a pattern database or take the max of several relaxations.</li>
       <li>The state space is so large that even relaxed costs are expensive — switch to greedy best-first or learned heuristics, accepting sub-optimality.</li>
       <li>Costs are learned from data rather than known — train a heuristic (see the structured perceptron lesson) instead of relaxing.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>A relaxation that is too loose is useless.</b> Manhattan distance with most constraints dropped can return near-zero, giving A* almost no guidance. Relax as little as you can while keeping the sub-problem easy.</li>
       <li><b>Admissibility is not the same as consistency.</b> A* with a closed list needs a <b>consistent</b> (monotone) heuristic, $h(s) \\le c(s,s') + h(s')$, or it may re-expand nodes. Most natural relaxations are consistent, but verify it.</li>
       <li><b>Taking the max of two heuristics can break consistency.</b> The maximum of admissible heuristics stays admissible, but is only consistent if each component is; check before combining.</li>
       <li><b>Relaxing the wrong constraint helps nothing.</b> Drop a rule the search was not struggling with and the heuristic barely changes. Target the constraint that actually forces detours.</li>
       <li><b>Floating-point ties cause node thrashing.</b> When $h$ exactly equals true cost, rounding can flip the open-list order and re-expand states. Break ties deterministically (e.g. prefer higher $g$).</li>
       <li><b>Forgetting non-unit step costs.</b> "Number of grid steps" is only admissible when every move costs the same. With weighted edges, scale the relaxed cost by the minimum edge weight.</li>
     </ul>`,
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
    `<p>Start with the plain-English picture. Imagine a panel of judges scoring whole figure-skating routines, not single jumps. Each routine has a list of ingredients (a spin, a jump, a footwork sequence). Each judge has an opinion about how many points each ingredient is worth. The routine's total score is just: for every ingredient, multiply "how much of it" by "how many points the judges give it", and add those up.</p>
     <p>Now the same idea in symbols. We describe each candidate output by a <b>feature vector</b> $\\phi$ — read "phi": a list that says how much of each ingredient the output uses (e.g. "uses edge $e_1$ once"). The <b>weights</b> $w$ are the judges' points-per-ingredient. The score of an output is $w\\cdot\\phi$, the <b>dot product</b>: pair up each weight with its feature, multiply, and sum. That single number is how good the model currently thinks that output is.</p>
     <p>The model predicts the output with the highest score. Call it $\\hat y$ (read "y-hat" — the hat means "the model's guess"). If $\\hat y$ is not the true answer $y$, we made a mistake.</p>
     <p>The fix is the whole trick: on a mistake, nudge the weights so the <i>true</i> output scores a little higher next time and the <i>wrong</i> one a little lower. Reward the right answer's ingredients, penalize the impostor's. Repeat, and the true output eventually wins.</p>`,
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
    `<p>Two paths share start and goal. True path $y$ uses edges $\\{e_1, e_2\\}$; the model wrongly predicts $\\hat y$ using $\\{e_3, e_4\\}$. All weights start at $0$. Apply $w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$ once and watch the scores flip.</p>
     <ul class="steps">
       <li>Before: true score $= w_{e_1}+w_{e_2} = 0+0 = 0$; wrong score $= w_{e_3}+w_{e_4} = 0+0 = 0$. Tie breaks to wrong → a mistake.</li>
       <li>Update true edges: $w_{e_1} = 0+1 = 1$, $w_{e_2} = 0+1 = 1$.</li>
       <li>Update wrong edges: $w_{e_3} = 0-1 = -1$, $w_{e_4} = 0-1 = -1$.</li>
       <li>After: true score $= 1+1 = 2$; wrong score $= -1+(-1) = -2$.</li>
       <li>Gap $= 2-(-2) = 4$. The true path now wins; one correction flipped the decision.</li>
     </ul>
     <table class="extable">
       <caption>Edge weights and path scores, before vs after one update</caption>
       <thead><tr><th>edge</th><th class="num">before</th><th class="num">after</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$w_{e_1}$ (true)</td><td class="num">$0$</td><td class="num">$1$</td></tr>
         <tr><td class="row-h">$w_{e_2}$ (true)</td><td class="num">$0$</td><td class="num">$1$</td></tr>
         <tr><td class="row-h">$w_{e_3}$ (wrong)</td><td class="num">$0$</td><td class="num">$-1$</td></tr>
         <tr><td class="row-h">$w_{e_4}$ (wrong)</td><td class="num">$0$</td><td class="num">$-1$</td></tr>
         <tr><td class="row-h">true score</td><td class="num">$0$</td><td class="num">$2$</td></tr>
         <tr><td class="row-h">wrong score</td><td class="num">$0$</td><td class="num">$-2$</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>The structured perceptron trains part-of-speech taggers, dependency parsers, and named-entity recognizers, where the output is a whole sequence or tree, not a single label. It is also how you learn action costs for a search/planning agent from demonstrations (imitation learning).</p>`,
  whenToUse:
    `<p><b>Reach for the structured perceptron when the thing you predict is a whole structure</b> — a sequence, a tree, an alignment, a path — and you can find the highest-scoring structure with a fast decoder (Viterbi, dynamic programming, or search). It learns the scoring weights from labeled examples with one simple update rule.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A per-token classifier</b> (logistic regression on each label independently) — when neighboring labels constrain each other; the structured model scores the joint output, not isolated pieces.</li>
       <li><b>A CRF (Conditional Random Field)</b> — when you want something simpler and faster to train; the perceptron skips probability normalization and just needs argmax decoding.</li>
       <li><b>A neural sequence model</b> — when data is small, features are hand-designed, and you want a transparent linear model that trains in seconds.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You need calibrated probabilities per output — train a CRF or a softmax model instead; the perceptron gives scores, not probabilities.</li>
       <li>You have large data and raw inputs (text, audio) — a BiLSTM (Bidirectional Long Short-Term Memory) or transformer tagger will beat hand-built features.</li>
       <li>Exact argmax decoding is intractable — without a good decoder the update is unreliable; switch to a search-based or approximate-inference learner.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The raw perceptron overfits and oscillates.</b> The final weights bounce around. Use the <b>averaged perceptron</b> (average the weight vectors over all updates) — it generalizes far better at almost no extra cost.</li>
       <li><b>It only converges if the data is separable.</b> On noisy or non-separable data, weights never settle. Averaging, a margin, or a max-violation update keeps it stable.</li>
       <li><b>A wrong or approximate decoder corrupts learning.</b> The update assumes $\\hat y$ is the true argmax. If your Viterbi/search is buggy or pruned too hard, you train toward the wrong structure.</li>
       <li><b>Feature-pipeline skew between train and decode.</b> The exact same feature extraction must run at training and prediction time, or the learned weights apply to features the decoder never sees.</li>
       <li><b>No regularization knob.</b> Unlike a CRF there is no explicit penalty term; control capacity through feature design, averaging, and early stopping instead.</li>
       <li><b>Label-bias and tie-breaking.</b> Deterministic ties (e.g. always preferring the first label) can bake in a systematic error; break ties consistently and shuffle the training order each epoch.</li>
     </ul>`,
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
    `<p>Q-learning bootstraps off its own estimates. <b>Monte Carlo</b> RL (Reinforcement Learning) does something even simpler: it just averages real outcomes.</p>
     <p>Play a full episode to the end. Add up the discounted rewards you actually received: that is the <b>return</b> $u$.</p>
     <p>The Q-value of a state-action pair is estimated as the average return over all episodes where that pair appeared.</p>`,
  buildup:
    `<p>First, three everyday words. An <b>episode</b> is one complete play-through, from the start until the game ends — like one full round of a board game. A <b>reward</b> is the points you get on a single step (could be negative, like a penalty). The <b>return</b> is your total score for the whole round, added up over all the steps.</p>
     <p>There is one twist: points you get sooner count for slightly more than points far in the future. We shrink each later reward by a factor $\\gamma$ ("gamma", a number like $0.9$) once per step. This is "discounting" — a bird in the hand. The return from step $t$ onward, written $u_t$ (read "u at time t"), is the discounted sum of every reward from that step to the end.</p>
     <p>The analogy: you do not know the odds inside a slot machine, so you just pull the lever many times and write down what you actually won each time. The average of those winnings tells you what the machine is worth.</p>
     <p>That is exactly Monte Carlo. To estimate $\\hat Q(s,a)$ — the worth of taking action $a$ in state $s$ — collect every return $u_t$ that followed doing $a$ in $s$ across many episodes, and average them.</p>`,
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
    `<p>From $(s,a)$, with $\\gamma = 0.9$, one episode unfolds: reward $r_0 = -1$, then $r_1 = -1$, then $r_2 = +10$ at the goal. Compute its return $u = \\sum_k \\gamma^{\\,k} r_k$, then average over three episodes.</p>
     <ul class="steps">
       <li>Discount the rewards: $\\gamma^0 r_0 = 1\\times(-1) = -1$; $\\gamma^1 r_1 = 0.9\\times(-1) = -0.9$; $\\gamma^2 r_2 = 0.81\\times10 = 8.1$.</li>
       <li>Episode 1 return: $u = -1 - 0.9 + 8.1 = 6.2$.</li>
       <li>Two more episodes (different random lengths) give $u = 9$ and $u = 8$.</li>
       <li>Average: $\\hat Q(s,a) = (6.2 + 9 + 8)/3 = 23.2/3 \\approx 7.73$.</li>
       <li>No model used: each $u$ is a real discounted return; more episodes shrink the wobble toward the true $Q$.</li>
     </ul>
     <table class="extable">
       <caption>Episode 1: per-step discounting of $r_k$ ($\\gamma = 0.9$)</caption>
       <thead><tr><th>step $k$</th><th class="num">$r_k$</th><th class="num">$\\gamma^k$</th><th class="num">$\\gamma^k r_k$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$0$</td><td class="num">$-1$</td><td class="num">$1$</td><td class="num">$-1$</td></tr>
         <tr><td class="row-h">$1$</td><td class="num">$-1$</td><td class="num">$0.9$</td><td class="num">$-0.9$</td></tr>
         <tr><td class="row-h">$2$</td><td class="num">$10$</td><td class="num">$0.81$</td><td class="num">$8.1$</td></tr>
         <tr><td class="row-h">return $u$</td><td class="num"></td><td class="num"></td><td class="num">$6.2$</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>Monte Carlo evaluation underlies Monte Carlo Tree Search, the engine behind strong Go and game-playing AIs (Artificial Intelligences): it plays many random rollouts to the end and averages the outcomes to score a move. It is also used to evaluate policies when a simulator exists but the exact model does not.</p>`,
  whenToUse:
    `<p><b>Reach for Monte Carlo RL (Reinforcement Learning) when you have a simulator or can replay full episodes, but no transition model</b>, and episodes actually end. It needs zero knowledge of the dynamics — just the returns you actually observed — making it the simplest model-free estimator.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>TD (Temporal-Difference) / SARSA</b> — when you want an <i>unbiased</i> estimate and do not mind variance; Monte Carlo never bootstraps off a possibly-wrong value, so it cannot inherit that bias.</li>
       <li><b>Dynamic programming (value iteration)</b> — when you do not have the model's probabilities; Monte Carlo learns straight from experience.</li>
       <li><b>A learned model (model-based RL)</b> — when building an accurate model is harder than just sampling rollouts.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>Tasks never terminate (continuing problems) — there is no full return to average; use TD or n-step methods.</li>
       <li>Returns are extremely noisy or episodes are long — TD's lower variance learns faster per step.</li>
       <li>You need to update online, mid-episode — Monte Carlo must wait for the episode to finish; TD updates immediately.</li>
     </ul>
     <p><b>Where you meet it:</b> Monte Carlo Tree Search (game engines) and policy evaluation inside simulators.</p>`,
  pitfalls:
    `<ul>
       <li><b>High variance, slow convergence.</b> Full-episode returns swing wildly, so estimates need many episodes. Reduce it with baselines, control variates, or by switching to TD.</li>
       <li><b>It needs episodes to terminate.</b> On non-episodic tasks the return is undefined. Add an artificial horizon or discount, or use a bootstrapping method.</li>
       <li><b>First-visit vs every-visit confusion.</b> Averaging every visit to a state within one episode introduces correlation/bias; decide deliberately and stay consistent — first-visit is unbiased.</li>
       <li><b>Off-policy needs importance sampling.</b> If the episodes were generated by a different policy than the one you evaluate, raw averaging is wrong; weight by the importance ratio (and watch its variance explode).</li>
       <li><b>Unexplored state-action pairs get no estimate.</b> Without exploring starts or an $\\epsilon$-greedy (epsilon-greedy) policy, some pairs are never sampled and their values stay garbage.</li>
       <li><b>Running mean vs naive sum.</b> Summing returns then dividing can overflow or lose precision over millions of episodes; use the incremental running-average update.</li>
     </ul>`,
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
  title: "SARSA (State–Action–Reward–State–Action) and temporal-difference learning",
  tagline: "Don't wait for the episode to end. Update each step from the very next step's guess.",
  prereqs: ["aix-monte-carlo", "ai-q-learning"],
  bigIdea:
    `<p>Monte Carlo waits for the whole episode, then averages. <b>Temporal-difference (TD)</b> learning updates after every single step.</p>
     <p>It nudges a value toward the reward just seen plus the discounted value of the <i>next</i> state. This is called <b>bootstrapping</b>: using one estimate to improve another.</p>
     <p><b>SARSA</b> is TD applied to Q-values, using the actual quintuple $(s, a, r, s', a')$ the agent experienced.</p>`,
  buildup:
    `<p>Here is the everyday version. You are driving home and you keep a running guess of "minutes left". You do not wait until you arrive to learn whether your guess was good. The moment you pass a familiar landmark, you compare: "I thought 20 minutes; this landmark says more like 15." That gap is a little lesson, and you revise your earlier guess right away. That is temporal-difference learning — learn from the very next step, not the end of the trip.</p>
     <p>Now the pieces. At each step the agent is in a state $s$, takes an action $a$, gets a reward $r$, lands in the next state $s'$ (read "s prime"), then takes the next action $a'$. Line up those five and you spell the method's name: SARSA = $s, a, r, s', a'$.</p>
     <p>The <b>TD target</b> is $r + \\gamma V(s')$: the reward you just got, plus your current estimate of the value of where you landed (shrunk by the discount $\\gamma$). It is your freshly-updated "minutes left" using the new landmark.</p>
     <p>The <b>TD error</b> is the target minus your old value $V(s)$ — literally how surprised you were. We move the old value a small fraction $\\alpha$ ("alpha", the learning rate) of the way toward the target, so each surprise teaches a little, not everything at once.</p>`,
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
     <p><b>MC (Monte Carlo) vs TD in one line.</b> Monte Carlo uses the full return $u_t$ (low bias, high variance, must wait). TD uses $r + \\gamma V(s')$ (a little biased while $V$ is wrong, but low variance and usable immediately).</p>
     <p><b>Intuition.</b> You do not need to finish the trip to learn the route. The moment the next landmark looks closer than expected, you revise your estimate of where you started. Each step's small surprise teaches a little, and the goal's reward seeps backward one cell per update.</p>`,
  example:
    `<p>State $s$ has value $V(s) = 0$. The agent steps, gets reward $r = 0$, lands in $s'$ with $V(s') = 1$. Use $\\alpha = 0.5$, $\\gamma = 0.9$. Plug into $V(s) \\leftarrow V(s) + \\alpha[r + \\gamma V(s') - V(s)]$.</p>
     <ul class="steps">
       <li>TD target: $r + \\gamma V(s') = 0 + 0.9\\times1 = 0.9$.</li>
       <li>TD error: $\\text{target} - V(s) = 0.9 - 0 = 0.9$.</li>
       <li>Scaled step: $\\alpha \\times 0.9 = 0.5\\times0.9 = 0.45$.</li>
       <li>Update: $V(s) \\leftarrow 0 + 0.45 = 0.45$.</li>
       <li>$V(s)$ moved halfway to the target $0.9$; the goal's value flowed back one step.</li>
     </ul>
     <table class="extable">
       <caption>One TD update ($\\alpha = 0.5$, $\\gamma = 0.9$)</caption>
       <thead><tr><th>quantity</th><th class="num">value</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$V(s)$ old</td><td class="num">$0$</td></tr>
         <tr><td class="row-h">$r + \\gamma V(s')$ (target)</td><td class="num">$0.9$</td></tr>
         <tr><td class="row-h">TD error</td><td class="num">$0.9$</td></tr>
         <tr><td class="row-h">$V(s)$ new</td><td class="num">$0.45$</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>TD learning is the backbone of modern RL (Reinforcement Learning). TD-Gammon learned backgammon at expert level this way. The TD error even matches dopamine signals measured in the brain, making it a leading model of how animals learn from reward. SARSA's on-policy nature makes it safer than Q-learning when exploration can be costly.</p>`,
  whenToUse:
    `<p><b>Reach for TD (Temporal-Difference) / SARSA (State–Action–Reward–State–Action) when you want to learn from experience online, updating after every step</b>, especially on long or non-terminating tasks where waiting for a full episode is impractical. SARSA specifically when you want to learn the value of the policy you are actually following, exploration included.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Monte Carlo</b> — when you need low variance and immediate, mid-episode updates, and can tolerate a little bootstrapping bias.</li>
       <li><b>Q-learning (off-policy)</b> — when exploration is <i>costly or dangerous</i>; SARSA learns the safe on-policy value (it accounts for the exploratory moves it will actually make), so it avoids risky greedy paths near cliffs.</li>
       <li><b>Dynamic programming</b> — when you lack the transition model and must learn from samples.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You want the value of the <i>optimal</i> policy regardless of exploration — use Q-learning, which bootstraps off the max action.</li>
       <li>You need an unbiased estimate at any cost — Monte Carlo never inherits a wrong value.</li>
       <li>State/action spaces are huge or continuous — pair TD with function approximation (deep Q-networks, actor-critic) rather than a table.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Bootstrapping is biased while values are wrong.</b> Early in training the target $r + \\gamma V(s')$ uses bad estimates, so values can be systematically off until the chain settles.</li>
       <li><b>The "deadly triad" diverges.</b> Combining bootstrapping, off-policy learning, and function approximation can blow up. Keep on-policy (SARSA), use target networks, or smaller learning rates.</li>
       <li><b>Learning rate $\\alpha$ matters a lot.</b> Too high oscillates or diverges; too low crawls. Decay $\\alpha$ over time for convergence guarantees.</li>
       <li><b>Discount $\\gamma$ near $1$ slows credit assignment.</b> Value flows back one step per update, so long-horizon rewards take many sweeps to propagate. Eligibility traces (TD($\\lambda$)) speed this up.</li>
       <li><b>SARSA vs Q-learning mix-up.</b> Using the greedy next action in a SARSA update silently turns it into Q-learning and changes the safety properties. Use the action the policy actually takes ($a'$).</li>
       <li><b>Exploration schedule.</b> A fixed $\\epsilon$ (epsilon) never lets the policy converge to greedy; decay exploration as values stabilize, or SARSA's learned values stay pessimistic.</li>
     </ul>`,
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
    `<p>Picture two people playing rock-paper-scissors: they reveal at the same instant, neither sees the other's choice first. That is a <b>simultaneous</b> game. We write all the outcomes in a grid called a <b>payoff matrix</b>: player A picks a row, player B picks a column, and the cell where they meet lists the payoff $V(a,b)$ to each (a bigger number is better for that player).</p>
     <p>A <b>best response</b> is simply your smartest move <i>assuming you knew</i> what the other player picked: scan that row or column and choose the entry that pays you the most.</p>
     <p>A <b>Nash equilibrium</b> is a pair of choices where <i>both</i> players are simultaneously playing a best response to each other. The plain-English test: stand in that cell and ask each player, "knowing what the other did, do you wish you'd chosen differently?" If the answer is no for both, the cell is stable — that mutual "no regrets" is the equilibrium.</p>`,
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
    `<p>Prisoner's dilemma. Each cell is the payoff $V(a,b)$ as A's / B's (higher is better). Find A's best response to each column, then B's, then the cell where both best-respond.</p>
     <table class="extable">
       <caption>Payoff matrix $V(a,b)$ = (A's payoff, B's payoff)</caption>
       <thead><tr><th></th><th class="num">B: Cooperate</th><th class="num">B: Defect</th></tr></thead>
       <tbody>
         <tr><td class="row-h">A: Cooperate</td><td class="num">$(-1,\\,-1)$</td><td class="num">$(-3,\\,0)$</td></tr>
         <tr><td class="row-h">A: Defect</td><td class="num">$(0,\\,-3)$</td><td class="num">$(-2,\\,-2)$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>A vs "B Cooperates": $\\max(-1,\\,0) = 0$ → Defect.</li>
       <li>A vs "B Defects": $\\max(-3,\\,-2) = -2$ → Defect. So Defect dominates for A.</li>
       <li>By symmetry, Defect dominates for B too.</li>
       <li>Both best-respond at (Defect, Defect) $= (-2,-2)$: the Nash equilibrium.</li>
       <li>Yet (Cooperate, Cooperate) $= (-1,-1)$ pays both more — Nash is not the social optimum.</li>
     </ul>`,
  application:
    `<p>Game theory models pricing wars, ad auctions, network routing congestion, and security (attacker vs defender). Nash equilibrium predicts stable behavior; the minimax theorem underlies poker-bot strategies and adversarial machine learning, where one network maximizes and another minimizes.</p>`,
  whenToUse:
    `<p><b>Reach for game-theoretic analysis whenever multiple self-interested agents act and each one's best move depends on the others'</b> — pricing, auctions, bidding, routing, or any attacker-vs-defender setup. Use Nash equilibrium to predict where rational play settles; use the minimax value for two-player zero-sum contests.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Single-agent optimization (plain reward maximization)</b> — when other agents react to you; ignoring them gives a brittle plan they will exploit.</li>
       <li><b>Pure minimax search</b> — when moves are simultaneous or hidden; you then need mixed (randomized) strategies, not a deterministic game tree.</li>
       <li><b>Best-response heuristics</b> — when you need a stable, self-consistent prediction rather than a one-shot reaction.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>There is really one decision-maker against fixed nature — use an MDP (Markov Decision Process) or plain optimization.</li>
       <li>Agents cooperate and can bind agreements — use cooperative game theory or joint optimization, not Nash.</li>
       <li>Players are not rational / are learning over time — use empirical game theory, no-regret learning, or multi-agent RL (Reinforcement Learning).</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Pure-strategy Nash may not exist.</b> Many games (matching pennies) only have a <i>mixed</i> equilibrium. If you search only deterministic profiles you will find nothing — allow randomization.</li>
       <li><b>Multiple equilibria, no built-in selection.</b> When several Nash points exist the theory does not say which one happens; you need refinements (subgame-perfect, focal points) or extra assumptions.</li>
       <li><b>Nash is not the social optimum.</b> The prisoner's dilemma's equilibrium is worse for everyone than cooperation. Do not assume the equilibrium maximizes total welfare.</li>
       <li><b>Minimax equality needs zero-sum.</b> The maximin = minimax guarantee holds for two-player zero-sum games; in general-sum games the orders differ and the "value of the game" is not well defined.</li>
       <li><b>Garbage payoffs, garbage equilibrium.</b> Equilibria are exquisitely sensitive to the payoff numbers; if your utilities are mis-estimated the predicted behavior is meaningless.</li>
       <li><b>Computing equilibria is hard.</b> Finding a Nash equilibrium is PPAD-complete in general; for large games use approximate or no-regret methods (e.g. CFR, Counterfactual Regret Minimization) rather than exact solvers.</li>
     </ul>`,
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
    `<p>The cheap trick behind everything here is the one you learned in grade school: $ab + ac = a(b+c)$. The left side does two multiplications and an add; the right side does one of each. Same answer, less work, because we pulled the common $a$ out front. Variable elimination is that same "factor it out" move, applied to giant probability sums.</p>
     <p>A <b>factor</b> is just a little lookup table of non-negative numbers indexed by some variables — for example $f_1(A,B)$ stores a number for each combination of $A$ and $B$. A Bayes net is a bunch of these small tables that, multiplied together, describe the whole world.</p>
     <p>To answer a question we must add up over the variables we do not care about. Doing that by writing out the full combined table is the "expand everything" way, and it explodes. Instead we <b>eliminate</b> one unwanted variable $B$ at a time: collect every factor that mentions $B$, multiply just those, then sum over all values of $B$.</p>
     <p>What is left is one new, smaller table over $B$'s neighbours. $B$ has vanished, the problem shrank, and we never had to build the giant table. Repeat until only the answer remains.</p>`,
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
    `<p>Chain $A - f_1 - B - f_2 - C$, binary variables. Eliminate $B$ via $g(A,C) = \\sum_B f_1(A,B)\\,f_2(B,C)$. Start from the two factor tables:</p>
     <table class="extable">
       <caption>Input factors $f_1(A,B)$ and $f_2(B,C)$</caption>
       <thead><tr><th>row</th><th class="num">$f_1(A,B)$</th><th class="num">$f_2(B,C)$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$00$</td><td class="num">$2$</td><td class="num">$1$</td></tr>
         <tr><td class="row-h">$01$</td><td class="num">$1$</td><td class="num">$2$</td></tr>
         <tr><td class="row-h">$10$</td><td class="num">$1$</td><td class="num">$3$</td></tr>
         <tr><td class="row-h">$11$</td><td class="num">$3$</td><td class="num">$1$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>$g(0,0) = f_1(0,0)f_2(0,0) + f_1(0,1)f_2(1,0) = 2\\times1 + 1\\times3 = 5$.</li>
       <li>$g(0,1) = f_1(0,0)f_2(0,1) + f_1(0,1)f_2(1,1) = 2\\times2 + 1\\times1 = 5$.</li>
       <li>$g(1,0) = f_1(1,0)f_2(0,0) + f_1(1,1)f_2(1,0) = 1\\times1 + 3\\times3 = 10$.</li>
       <li>$g(1,1) = f_1(1,0)f_2(0,1) + f_1(1,1)f_2(1,1) = 1\\times2 + 3\\times1 = 5$.</li>
       <li>$g(A,C) = \\{00{:}5,\\,01{:}5,\\,10{:}10,\\,11{:}5\\}$: one factor, $B$ gone, graph now $A - g - C$.</li>
     </ul>`,
  application:
    `<p>Variable elimination is the standard exact-inference engine inside probabilistic systems: medical diagnosis networks, error-correcting decoders, and speech models. The same factor-graph machinery (the sum-product algorithm) underlies belief propagation and the decoding of LDPC (Low-Density Parity-Check) and turbo codes in your phone's modem.</p>`,
  whenToUse:
    `<p><b>Reach for variable elimination when you need an <i>exact</i> answer from a Bayes net or factor graph and the graph is not too densely connected</b> (low treewidth). It is the default exact-inference algorithm: pick an elimination order, multiply-and-sum out hidden variables one at a time.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Brute-force enumeration of the joint</b> — when there are more than a handful of variables; enumeration costs $2^n$, elimination costs roughly $2^{\\text{treewidth}}$.</li>
       <li><b>Sampling (Gibbs, particle filters)</b> — when you need the precise number, not an approximation, and the network is sparse enough.</li>
       <li><b>The junction-tree algorithm</b> — when you only need <i>one</i> query; junction trees pay extra to answer many queries fast.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The graph is densely connected (high treewidth) — exact inference is exponential; switch to approximate inference (sampling, loopy belief propagation, variational methods).</li>
       <li>You will run many different queries — compile a junction tree once and reuse it.</li>
       <li>Variables are continuous and non-Gaussian — closed-form sums do not exist; use sampling or assumed-density methods.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Elimination order makes or breaks it.</b> A bad order creates huge intermediate factors and blows up memory; a good order keeps them small. Use a heuristic like min-degree or min-fill — never just the variable index order.</li>
       <li><b>Cost is set by the largest factor, not the network size.</b> Even a "small" net with high treewidth is intractable. Estimate the induced width before committing to exact inference.</li>
       <li><b>Numerical underflow on long chains.</b> Multiplying many small probabilities drives factors toward zero. Work in log-space or renormalize intermediate factors.</li>
       <li><b>Forgetting to normalize at the end.</b> The final factor is unnormalized; divide by its sum to get a probability. Skipping this gives numbers that do not add to $1$.</li>
       <li><b>Mishandling evidence.</b> Observed variables must be fixed (their factors restricted to the observed value) <i>before</i> elimination, not summed out — summing out evidence answers the wrong query.</li>
       <li><b>Assuming it scales.</b> People reuse a working small-net solution on a big one and hit an exponential wall; switch to approximate methods rather than waiting forever.</li>
     </ul>`,
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
    `<p>Think of a pollster who cannot survey all 300 million people, so they phone a random few thousand and report the fractions. Sampling replaces an impossible exact calculation with "ask enough random cases and count." Here the "population" is the probability landscape, and a "poll" is a random draw from it.</p>
     <p>So to estimate $P(X \\mid \\text{evidence})$ — the chance the unknown $X$ takes each value, given what we observed — we draw many samples that respect the evidence and just count how often each value of $X$ shows up. The fractions are the answer.</p>
     <p><b>Gibbs sampling</b> is one way to produce those samples. It pins the observed values, then walks through the unknown variables one at a time, re-rolling each from its probability <i>given everyone else's current value</i>. One coordinate moves per step; over many steps the visited states behave like draws from the true posterior.</p>
     <p><b>Particle filtering</b> is the moving-target version, for tracking something over time. It carries a whole swarm of guesses ("particles"). Each new observation multiplies a particle's <b>weight</b> by how well that particle predicted the observation, so guesses that match reality survive and ones that do not fade away.</p>`,
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
    `<p>True posterior over three states is $[0.2, 0.5, 0.3]$. We draw $N = 10$ samples and get states: $2,2,2,1,2,3,3,2,2,3$. Estimate each $\\hat P$ by $\\#\\{X=x\\}/N$.</p>
     <ul class="steps">
       <li>Count: state 1 → $1$, state 2 → $6$, state 3 → $3$ (total $1+6+3 = 10$). ✓</li>
       <li>$\\hat P(1) = 1/10 = 0.1$.</li>
       <li>$\\hat P(2) = 6/10 = 0.6$.</li>
       <li>$\\hat P(3) = 3/10 = 0.3$.</li>
       <li>With only $10$ samples the fit is rough; thousands more tighten it onto $[0.2, 0.5, 0.3]$.</li>
     </ul>
     <table class="extable">
       <caption>Empirical estimate ($N=10$) vs true posterior</caption>
       <thead><tr><th>state</th><th class="num">count</th><th class="num">$\\hat P = $ count$/10$</th><th class="num">true $P$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$1$</td><td class="num">$1$</td><td class="num">$0.1$</td><td class="num">$0.2$</td></tr>
         <tr><td class="row-h">$2$</td><td class="num">$6$</td><td class="num">$0.6$</td><td class="num">$0.5$</td></tr>
         <tr><td class="row-h">$3$</td><td class="num">$3$</td><td class="num">$0.3$</td><td class="num">$0.3$</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>Particle filters track robot and self-driving-car positions (Monte Carlo localization), aircraft on radar, and objects in video. Gibbs sampling powers topic models, image denoising, and the Bayesian statistics packages (BUGS, Stan's cousins) used across science when the posterior has no closed form.</p>`,
  whenToUse:
    `<p><b>Reach for approximate inference when exact inference is too slow</b> — a densely connected (high-treewidth) network, or a posterior with no closed form. Use <b>Gibbs sampling</b> for static graphical models where each variable's conditional is easy; use a <b>particle filter</b> for tracking a hidden state through time as observations stream in.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Variable elimination / exact inference</b> — when the graph is too tangled for exact methods to finish.</li>
       <li><b>Variational inference</b> — when you want asymptotically <i>correct</i> samples and can afford to run long, rather than a fast but biased deterministic approximation.</li>
       <li><b>A Kalman filter</b> — for tracking when the dynamics are nonlinear or the noise is non-Gaussian; particles handle arbitrary distributions a Kalman filter cannot.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>Exact inference is feasible — prefer it; it gives the precise answer with no convergence worries.</li>
       <li>You need speed and a deterministic result — use variational inference or loopy belief propagation.</li>
       <li>The model is linear-Gaussian — a Kalman filter is exact and far cheaper than particles.</li>
     </ul>
     <p><b>Which library:</b> probabilistic programming systems (Stan, PyMC) for Gibbs/MCMC (Markov Chain Monte Carlo); dedicated particle-filter libraries for sequential tracking.</p>`,
  pitfalls:
    `<ul>
       <li><b>Gibbs needs burn-in and mixing checks.</b> Early samples reflect the starting point, not the posterior. Discard a burn-in window and check convergence (multiple chains, $\\hat R$ statistic) before trusting results.</li>
       <li><b>Correlated variables mix slowly.</b> When variables are strongly coupled, single-variable Gibbs crawls and gives correlated, low-information samples. Use block sampling or a reparameterization.</li>
       <li><b>Disconnected modes get stuck.</b> Gibbs can trap itself in one mode of a multi-modal posterior and never visit the others. Run multiple chains from dispersed starts.</li>
       <li><b>Particle degeneracy.</b> After a few steps almost all weight lands on one particle and the rest are wasted. Monitor effective sample size and <b>resample</b> when it drops.</li>
       <li><b>Sample impoverishment after resampling.</b> Repeated resampling collapses diversity; add jitter (roughening) or use resample-move steps to keep particles spread out.</li>
       <li><b>Too few samples / particles.</b> Estimates are noisy and over-confident with small $N$. Variance falls only like $1/\\sqrt{N}$, so budget enough samples for the precision you claim.</li>
     </ul>`,
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
    `<p>Think of gossip in a town. News about you can reach a stranger only through people connected to you. If you "block" everyone directly linked to you, no rumor can get through. The Markov blanket is exactly that ring of people you need to block.</p>
     <p>Who is in the ring? <b>Parents</b> (your direct causes) clearly matter — they push on you. <b>Children</b> (things you cause) matter too, because seeing an effect tells you something about its cause; information flows backward up an arrow.</p>
     <p><b>Co-parents</b> are the surprising one, and they enter through <b>explaining away</b>. Plain example: your lawn is wet (a shared child). It could be rain (you) or the sprinkler (a co-parent). If you learn it rained, the sprinkler becomes less likely — so once you observe the shared child, the two parents become linked even though they had nothing to do with each other before.</p>
     <p>Put parents, children, and co-parents together and you have fenced the node off completely: nothing outside can tell you anything new.</p>`,
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
    `<p>$X$ (binary) has one parent $P$ and one child $C$; a far node $U$ sits outside the blanket. Resample $X$ from its local factors only: $P(X \\mid \\text{rest}) \\propto P(X\\mid P)\\,P(C\\mid X)$. Take $P(X{=}1\\mid P) = 0.6$, $P(C\\mid X{=}1) = 0.5$, $P(C\\mid X{=}0) = 0.2$.</p>
     <ul class="steps">
       <li>Score $X{=}1$: $P(X{=}1\\mid P)\\,P(C\\mid X{=}1) = 0.6\\times0.5 = 0.30$.</li>
       <li>Score $X{=}0$: $P(X{=}0\\mid P)\\,P(C\\mid X{=}0) = 0.4\\times0.2 = 0.08$.</li>
       <li>Normalizer: $0.30 + 0.08 = 0.38$.</li>
       <li>$P(X{=}1\\mid\\text{rest}) = 0.30/0.38 \\approx 0.79$.</li>
       <li>The far node $U$ never appears — it cancels. The blanket $\\{P, C\\}$ alone fixes $X$'s belief.</li>
     </ul>
     <table class="extable">
       <caption>Resampling $X$ from its Markov blanket $\\{P, C\\}$</caption>
       <thead><tr><th>$X$</th><th class="num">$P(X\\mid P)$</th><th class="num">$P(C\\mid X)$</th><th class="num">unnorm. score</th><th class="num">normalized</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$1$</td><td class="num">$0.6$</td><td class="num">$0.5$</td><td class="num">$0.30$</td><td class="num">$0.79$</td></tr>
         <tr><td class="row-h">$0$</td><td class="num">$0.4$</td><td class="num">$0.2$</td><td class="num">$0.08$</td><td class="num">$0.21$</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>The Markov blanket makes large-scale probabilistic inference feasible: Gibbs samplers, belief propagation, and Markov random fields all update a variable using only its blanket. In feature selection, the Markov blanket of a target is provably the minimal optimal feature set. The concept even appears in theories of biological self-organization (the "free energy principle").</p>`,
  whenToUse:
    `<p><b>This shows up whenever you build, sample from, or do feature selection on a graphical model.</b> The Markov blanket is the local "scope" you exploit to make global problems tractable: to reason about a node you only ever touch its parents, children, and co-parents.</p>
     <p><b>What it unlocks in practice:</b></p>
     <ul>
       <li><b>Cheap Gibbs sampling</b> — to resample a variable you condition only on its blanket, never the whole network, which is what makes MCMC (Markov Chain Monte Carlo) on big models possible.</li>
       <li><b>Optimal feature selection</b> — the blanket of the target variable is provably the smallest feature set that makes every other feature redundant; algorithms like IAMB and HITON search for exactly this set.</li>
       <li><b>Local message passing</b> — belief propagation and Markov random fields update each node from blanket messages alone.</li>
     </ul>
     <p><b>When to reach for the broader idea instead:</b> if you actually need the <i>global</i> joint (e.g. the partition function), the blanket alone is not enough — you still need full inference. And in undirected models the blanket is simply the neighbors, so the parent/child/co-parent distinction only matters for directed Bayes nets.</p>`,
  pitfalls:
    `<ul>
       <li><b>Forgetting co-parents.</b> The single most common mistake: people include parents and children but drop the children's <i>other</i> parents. Omitting them leaks dependence (explaining-away) and corrupts a Gibbs update or feature-selection result.</li>
       <li><b>Confusing directed and undirected blankets.</b> In a Bayes net (directed) the blanket is parents + children + co-parents; in a Markov random field (undirected) it is just the immediate neighbors. Using the wrong rule gives the wrong set.</li>
       <li><b>Assuming the blanket is small.</b> A node with many children, or children with many parents, can have a huge blanket — then "local" inference is not cheap. Check the degree before assuming locality buys speed.</li>
       <li><b>Treating it as marginal independence.</b> $X \\perp \\text{Rest}$ holds only <i>given</i> the blanket's values. Without conditioning on the blanket, $X$ is not independent of the outside world.</li>
       <li><b>Estimating blankets from limited data.</b> In feature selection, statistical tests with too few samples add or drop neighbors wrongly, yielding an unstable blanket. Use enough data and stable conditional-independence tests.</li>
       <li><b>Hidden / latent variables widen the blanket.</b> An unobserved common cause couples nodes you thought were separate; the effective blanket is larger than the drawn graph suggests.</li>
     </ul>`,
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
  title: "HMM (Hidden Markov Model) smoothing (forward-backward)",
  tagline: "Use the future as well as the past. Combine both directions for the best estimate of each state.",
  prereqs: ["ai-hmm", "aix-variable-elimination"],
  bigIdea:
    `<p>Filtering an HMM uses only past clues. But to estimate a <i>past</i> hidden state, the clues that came <i>after</i> it also help.</p>
     <p>The <b>forward-backward</b> algorithm runs two passes. The forward pass $\\alpha$ gathers evidence from the start up to step $i$; the backward pass $\\beta$ gathers evidence from the end back to step $i$.</p>
     <p>Multiply them: the smoothed posterior $P(H_i \\mid E)$ is proportional to $\\alpha_i\\,\\beta_i$. This is called <b>smoothing</b>.</p>`,
  buildup:
    `<p>First the picture. A friend texts you a photo of their outfit each day, but never tells you the weather. You want to guess the weather on, say, Tuesday. Monday's and Tuesday's photos help — but so does <i>Wednesday's</i>: if Wednesday was clearly stormy, Tuesday was probably already turning bad. To judge a past moment, clues from both before <i>and</i> after it help. That is the whole idea of smoothing.</p>
     <p>The setup in symbols: $H_i$ is the <b>hidden</b> state at step $i$ (the unknown weather on day $i$), and $E$ is the whole list of observations $E_1,\\dots,E_T$ (every outfit photo).</p>
     <p>The <b>forward message</b> $\\alpha_i$ (read "alpha at i") sweeps left to right and gathers everything the photos up to and including day $i$ say about $H_i$.</p>
     <p>The <b>backward message</b> $\\beta_i$ ("beta at i") sweeps right to left and gathers everything the photos <i>after</i> day $i$ say about $H_i$. Multiply the two and you have used every clue.</p>`,
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
    `<p>At step $i$, forward message $\\alpha_i = [0.6, 0.2]$ over hidden states $\\{1, 2\\}$, backward message $\\beta_i = [0.5, 1.0]$. The smoothed posterior is $P(H_i \\mid E) \\propto \\alpha_i\\,\\beta_i$.</p>
     <ul class="steps">
       <li>Multiply elementwise: $\\alpha_i \\cdot \\beta_i = [0.6\\times0.5,\\; 0.2\\times1.0] = [0.30, 0.20]$.</li>
       <li>Normalizer: $0.30 + 0.20 = 0.50$.</li>
       <li>$P(H_i = 1 \\mid E) = 0.30/0.50 = 0.6$.</li>
       <li>$P(H_i = 2 \\mid E) = 0.20/0.50 = 0.4$.</li>
       <li>Filtering alone ($\\alpha$ only) would normalize $[0.6, 0.2]$ to $[0.75, 0.25]$; the future evidence $\\beta$ pulled it to $[0.6, 0.4]$.</li>
     </ul>
     <table class="extable">
       <caption>Combining forward and backward messages at step $i$</caption>
       <thead><tr><th>state $h$</th><th class="num">$\\alpha_i(h)$</th><th class="num">$\\beta_i(h)$</th><th class="num">$\\alpha_i\\beta_i$</th><th class="num">$P(H_i{=}h\\mid E)$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$1$</td><td class="num">$0.6$</td><td class="num">$0.5$</td><td class="num">$0.30$</td><td class="num">$0.6$</td></tr>
         <tr><td class="row-h">$2$</td><td class="num">$0.2$</td><td class="num">$1.0$</td><td class="num">$0.20$</td><td class="num">$0.4$</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>Forward-backward trains and decodes HMMs in speech recognition, gene finding (which DNA (Deoxyribonucleic Acid) regions are genes), and part-of-speech tagging. It is the E-step of the Baum-Welch (EM, Expectation–Maximization) algorithm that learns the HMM's parameters from unlabeled sequences.</p>`,
  whenToUse:
    `<p><b>Reach for forward-backward (smoothing) when you want the best estimate of a <i>past</i> hidden state in an HMM (Hidden Markov Model) and you have the whole observation sequence in hand</b> — offline analysis, where future clues can sharpen a belief about the past.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Filtering (forward pass only)</b> — when you can wait for all the data; using the future evidence ($\\beta$) gives a strictly better estimate than past-only filtering.</li>
       <li><b>The Viterbi algorithm</b> — when you want the marginal posterior of <i>each</i> state, not the single most-likely whole <i>path</i>; Viterbi maximizes the joint sequence, forward-backward gives per-step probabilities.</li>
       <li><b>Generic variable elimination</b> — it <i>is</i> elimination specialized to a chain, so it is the right, efficient choice for sequence models.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You must decide in real time as data arrives — use the forward filter alone; you cannot wait for the future.</li>
       <li>You need the single best label sequence — use Viterbi.</li>
       <li>The state space is continuous and linear-Gaussian — use the Kalman smoother (RTS), the continuous analogue.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Numerical underflow.</b> The $\\alpha$ and $\\beta$ messages are products of many probabilities and shrink toward zero on long sequences. Rescale each column (and track the log of the scale) or run entirely in log-space.</li>
       <li><b>Forgetting to normalize the smoothed posterior.</b> $\\alpha_i\\beta_i$ is unnormalized; divide by its sum over states. Skipping this leaves values that do not sum to $1$.</li>
       <li><b>Mismatched scaling between passes.</b> If you rescale $\\alpha$ but not $\\beta$ (or use inconsistent constants), the product is wrong. Apply the same per-step scaling to both, or use log-space throughout.</li>
       <li><b>Confusing smoothing with the Viterbi path.</b> Concatenating the per-step most-probable states does <i>not</i> give the most-probable sequence — that path can even have zero probability. Use Viterbi if you need a coherent path.</li>
       <li><b>Baum-Welch (EM, Expectation–Maximization) finds local optima.</b> Training the HMM with forward-backward as the E-step is sensitive to initialization and can converge to a poor local maximum. Use multiple random restarts.</li>
       <li><b>Label switching / unidentifiable states.</b> Hidden states have no inherent names, so learned states may permute between runs; align them before comparing models.</li>
     </ul>`,
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
    `<p><b>Latent Dirichlet Allocation (LDA)</b> reads a big pile of documents and figures out, all by itself, what themes ("topics") run through them — nobody hand-labels anything. "Latent" just means hidden: the topics are never written down, LDA infers them from which words appear together.</p>
     <p>Picture a few colored jugs, each full of its own favorite words: a "Sports" jug brimming with <i>game, team, score</i>, a "Finance" jug with <i>market, stock, bank</i>. Each document is poured from these jugs in some blend — those blend proportions are $\\theta$ ("theta"). Each jug's word mix is $\\phi$ ("phi").</p>
     <p>To produce one word, the model first picks a jug according to the document's blend, then draws a word from that jug. You only ever see the final mixed cup of words; LDA reverse-engineers which jugs exist and how much of each went into every document.</p>`,
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
    `<p>Two topics, Sports and Finance. Document mix $\\theta = [0.8, 0.2]$ (mostly Sports). Use $P(W{=}w) = \\sum_k \\theta_k\\,\\phi_{k,w}$ to score two words.</p>
     <ul class="steps">
       <li>$P(\\text{"team"}) = \\theta_{\\text{Sp}}\\phi_{\\text{Sp,team}} + \\theta_{\\text{Fin}}\\phi_{\\text{Fin,team}} = 0.8\\times0.4 + 0.2\\times0.0 = 0.32 + 0 = 0.32$.</li>
       <li>$P(\\text{"stock"}) = \\theta_{\\text{Sp}}\\phi_{\\text{Sp,stock}} + \\theta_{\\text{Fin}}\\phi_{\\text{Fin,stock}} = 0.8\\times0.0 + 0.2\\times0.3 = 0 + 0.06 = 0.06$.</li>
       <li>"team" ($0.32$) beats "stock" ($0.06$): a mostly-Sports document emits mostly Sports words.</li>
     </ul>
     <table class="extable">
       <caption>Mixture $P(W{=}w) = \\sum_k \\theta_k\\,\\phi_{k,w}$ with $\\theta = [0.8, 0.2]$</caption>
       <thead><tr><th>word $w$</th><th class="num">$\\phi_{\\text{Sp},w}$</th><th class="num">$\\phi_{\\text{Fin},w}$</th><th class="num">$P(W{=}w)$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">team</td><td class="num">$0.4$</td><td class="num">$0.0$</td><td class="num">$0.32$</td></tr>
         <tr><td class="row-h">stock</td><td class="num">$0.0$</td><td class="num">$0.3$</td><td class="num">$0.06$</td></tr>
       </tbody>
     </table>`,
  application:
    `<p>LDA organizes huge text collections: it powers topic browsers for news archives and scientific papers, content recommendation, and exploratory analysis of survey responses or customer reviews. The same mixture idea extends to images (objects as topics) and genetics (populations as topics).</p>`,
  whenToUse:
    `<p><b>Reach for LDA (Latent Dirichlet Allocation) when you have a large unlabeled collection of documents and want to discover its themes and a per-document topic breakdown</b> — exploratory analysis, browsing, or as interpretable features for a downstream model.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Plain clustering (k-means on bag-of-words)</b> — when documents are genuinely about <i>several</i> topics at once; LDA gives a soft mixture per document instead of one hard label.</li>
       <li><b>Latent Semantic Analysis (LSA / truncated SVD, Singular Value Decomposition)</b> — when you want a generative, probabilistic model with non-negative, interpretable topics rather than signed SVD components.</li>
       <li><b>Neural topic / embedding models (BERTopic, top2vec)</b> — when you want a simple, well-understood baseline that needs no GPU and few dependencies.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You have labels and a supervised target — train a classifier; LDA is unsupervised and not optimized for prediction.</li>
       <li>Documents are very short (tweets, queries) — word co-occurrence is too sparse; use a short-text model (biterm) or embeddings.</li>
       <li>You need semantic similarity, not theme discovery — use sentence/document embeddings.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>You must choose the number of topics $K$.</b> Too few blurs themes together, too many fragments them. Tune $K$ by held-out perplexity or topic-coherence scores — do not guess once and stop.</li>
       <li><b>Topics need human interpretation.</b> LDA returns word lists, not names; some "topics" are junk or duplicates. Inspect the top words and label or prune them before trusting the output.</li>
       <li><b>Stop-words and rare words dominate.</b> Without removing stop-words and very rare tokens, topics fill with "the", "and" or noise. Preprocess: lowercase, remove stop-words, filter by document frequency.</li>
       <li><b>Hyperparameters $\\alpha$ and $\\beta$ shape sparsity.</b> The Dirichlet priors control how peaked document-topic and topic-word mixtures are; defaults can give muddy topics. Tune them or use an asymmetric prior.</li>
       <li><b>Inference is stochastic and non-identifiable.</b> Different runs give different (permuted) topics. Fix the seed for reproducibility and align topics across runs before comparing.</li>
       <li><b>Bag-of-words throws away order.</b> LDA ignores word order and phrases, so "machine learning" is two unrelated tokens. Add bigrams/collocations if phrase meaning matters.</li>
     </ul>`,
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
    `<p>Why bother going beyond simple true/false logic? Because the world is full of objects and patterns. Saying "everyone who is human is mortal" in plain true/false logic would force you to write a separate fact for every single person. First-order logic lets you say it <i>once</i>, with a variable, and apply it to anybody.</p>
     <p>A <b>predicate</b> is a property or relationship that is true or false about specific objects: $\\text{Loves}(\\text{alice}, \\text{bob})$ asks "does Alice love Bob?". A <b>variable</b> like $x$ is a blank that stands for any object. A <b>quantifier</b> says how widely a statement applies: $\\forall x$ means "for every $x$" and $\\exists x$ means "there exists at least one $x$".</p>
     <p>To apply a general rule (with a variable) to a concrete fact (with a real name), you must first line them up so they talk about the same thing. <b>Unification</b> is that lining-up step: it finds which substitutions of variables make two statements become identical — pure pattern-matching, like fitting a stencil over a specific spot.</p>`,
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
    `<p>Unify $P(x, b)$ with $P(a, y)$ position by position, then resolve with a rule.</p>
     <table class="extable">
       <caption>Unifying $P(x,b)$ with $P(a,y)$, argument by argument</caption>
       <thead><tr><th>position</th><th>term in $P(x,b)$</th><th>term in $P(a,y)$</th><th>substitution</th></tr></thead>
       <tbody>
         <tr><td class="row-h">1</td><td>$x$ (variable)</td><td>$a$ (constant)</td><td>$\\{x/a\\}$</td></tr>
         <tr><td class="row-h">2</td><td>$b$ (constant)</td><td>$y$ (variable)</td><td>$\\{y/b\\}$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Combine the substitutions: unifier $\\theta = \\{x/a,\\; y/b\\}$.</li>
       <li>Apply $\\theta$: both atoms become $P(a, b)$ — identical. ✓</li>
       <li>Take the rule $\\neg P(a,b) \\vee Q(a)$ (i.e. "$P(a,b) \\Rightarrow Q(a)$") and the fact $P(a,b)$.</li>
       <li>Resolve on $P(a,b)$: $\\neg P(a,b)$ and $P(a,b)$ cancel, deriving the new fact $Q(a)$.</li>
     </ul>`,
  application:
    `<p>First-order logic and resolution power automated theorem provers, the Prolog programming language (its execution <i>is</i> resolution), formal verification of hardware and software, and the knowledge bases behind expert systems and the semantic web (ontologies, description logics).</p>`,
  whenToUse:
    `<p><b>Reach for first-order logic (FOL) when you need to represent objects, relations, and general rules with "for all" / "there exists", and to draw guaranteed-correct conclusions</b> — knowledge bases, formal verification, planning, and any setting where a wrong inference is unacceptable.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Propositional logic</b> — when facts involve objects and quantification; FOL avoids enumerating a separate proposition for every object.</li>
       <li><b>A machine-learning classifier</b> — when the rules are known and exact, and you need provable, auditable answers rather than a statistical guess.</li>
       <li><b>A relational database query</b> — when you need recursive rules and logical entailment, not just lookups (this is the Datalog / Prolog niche).</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The knowledge is uncertain or noisy — use probabilistic models (Bayes nets) or Markov logic, which blend logic with probabilities.</li>
       <li>You are learning patterns from data — use ML; FOL does not generalize from examples on its own.</li>
       <li>You only need decidable, lightweight reasoning over a taxonomy — use a description logic (OWL, Web Ontology Language) rather than full FOL.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Full FOL is only semi-decidable.</b> If a goal does <i>not</i> follow, a prover may run forever rather than report "no". Bound the search depth/time and treat non-termination as inconclusive.</li>
       <li><b>The skip-the-occurs-check trap.</b> Fast unifiers omit the occurs-check (does the variable appear in the term it binds to?), which can build cyclic terms and unsound proofs. Enable it when soundness matters.</li>
       <li><b>Clause blow-up from Skolemization and CNF (Conjunctive Normal Form) conversion.</b> Converting quantified formulas to clauses can explode in size; the variable order and Skolem-function choices matter. Use structure-preserving (Tseitin) transforms.</li>
       <li><b>Combinatorial explosion of resolvents.</b> Naive resolution generates astronomically many clauses. You need strategies (unit preference, set-of-support, subsumption deletion) to keep it tractable.</li>
       <li><b>Mis-scoped quantifiers change meaning.</b> $\\forall x\\,\\exists y$ versus $\\exists y\\,\\forall x$ are completely different claims; a swapped order silently encodes the wrong rule.</li>
       <li><b>Closed-world vs open-world confusion.</b> Prolog assumes anything unproven is false (closed world); classical FOL does not. Mixing the two leads to "facts" that are not actually entailed.</li>
     </ul>`,
  quiz: {
    q: `Find a unifier for $\\text{Loves}(x, \\text{mary})$ and $\\text{Loves}(\\text{john}, y)$. Then, given the rule $\\neg\\text{Loves}(\\text{john},\\text{mary}) \\vee \\text{Happy}(\\text{john})$ and the fact $\\text{Loves}(\\text{john},\\text{mary})$, what does resolution derive?`,
    a: `<p>Unifier $\\theta = \\{x/\\text{john},\\, y/\\text{mary}\\}$; both become $\\text{Loves}(\\text{john}, \\text{mary})$. Resolving on it cancels the complementary literal and derives $\\text{Happy}(\\text{john})$.</p>`
  }
});

})();
