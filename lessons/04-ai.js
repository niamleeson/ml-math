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
    { sym: "$\\text{sign}(s)$", desc: "gives $+1$ if $s>0$, and $-1$ if $s<0$. The final yes/no answer." },
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
  quiz: {
    q: `$w=10$, gradient $\\nabla_w=4$, learning rate $\\eta=0.25$. What is the new $w$?`,
    a: `<p>$w \\leftarrow 10 - 0.25\\times4 = 10 - 1 = 9$. The weight steps down from $10$ to $9$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-search-problem",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "c1", label: "cost of edge 1", min: 0, max: 10, val: 1, step: 0.5 },
        { key: "c2", label: "cost of edge 2", min: 0, max: 10, val: 1, step: 0.5 },
        { key: "c3", label: "cost of edge 3", min: 0, max: 10, val: 2, step: 0.5 }
      ],
      compute: function (s) {
        var total = s.c1 + s.c2 + s.c3;
        return { text: "total path cost = c1 + c2 + c3 = " + s.c1 + " + " + s.c2 + " + " + s.c3 +
          " = <b>" + total.toFixed(1) + "</b>. (each action adds its cost; we want the cheapest such sum.)" };
      }
    });
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
    `<p>Tiny line of cells: $A - B - C$. Start at $A$, goal is $C$.</p>
     <ul class="steps">
       <li>$\\text{Actions}(A) = \\{\\text{right}\\}$. $\\text{Cost}(A,\\text{right}) = 1$, $\\text{Succ}(A,\\text{right}) = B$.</li>
       <li>$\\text{Actions}(B) = \\{\\text{right}\\}$. $\\text{Cost}(B,\\text{right}) = 1$, $\\text{Succ}(B,\\text{right}) = C$.</li>
       <li>$\\text{IsEnd}(C)$ is true. The path right-right costs $1 + 1 = 2$.</li>
     </ul>
     <p>Here only one path exists. Real mazes have many, and we want the cheapest.</p>`,
  application:
    `<p>GPS routing, puzzle solvers, robot path planning, and even compiling a program all become search problems. Define the five pieces, and a search algorithm finds the best plan.</p>`,
  quiz: {
    q: `In the $A-B-C$ line, if $\\text{Cost}(B,\\text{right})$ were $5$ instead of $1$, what is the cost of the path from $A$ to $C$?`,
    a: `<p>$\\text{Cost}(A,\\text{right}) + \\text{Cost}(B,\\text{right}) = 1 + 5 = 6$. The total path cost is $6$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-tree-search",
  demo: function (host) {
    // Binary tree of 7 nodes laid on a 3-row x 7-col grid.
    // Each node shows its BFS order (level order) and DFS order (preorder).
    // node key -> {row, col, bfs, dfs}
    var nodes = {
      root: { row: 0, col: 3, bfs: 1, dfs: 1 },
      L:    { row: 1, col: 1, bfs: 2, dfs: 2 },
      R:    { row: 1, col: 5, bfs: 3, dfs: 5 },
      LL:   { row: 2, col: 0, bfs: 4, dfs: 3 },
      LR:   { row: 2, col: 2, bfs: 5, dfs: 4 },
      RL:   { row: 2, col: 4, bfs: 6, dfs: 6 },
      RR:   { row: 2, col: 6, bfs: 7, dfs: 7 }
    };
    var at = {};   // "row,col" -> node
    for (var k in nodes) { var n = nodes[k]; at[n.row + "," + n.col] = n; }
    Demos.grid(host, {
      rows: 3, cols: 7, cellSize: 64,
      controls: [{ key: "mode", label: "0 = BFS order, 1 = DFS order", min: 0, max: 1, val: 0, step: 1 }],
      cell: function (r, c, state) {
        var node = at[r + "," + c];
        if (!node) return { color: "#0d1117" };
        var order = state.mode === 1 ? node.dfs : node.bfs;
        return { color: "#1b4f72", label: String(order), text: "#e6edf3" };
      },
      readout: function (state) {
        return state.mode === 1
          ? "DFS visit order (dive deep first): root, then all the way down the left subtree, then the right. Numbers are the order each node is reached."
          : "BFS visit order (level by level): visit row 0, then row 1, then row 2, left to right. Numbers are the order each node is reached.";
      }
    });
  },
  title: "Tree search: BFS, DFS, iterative deepening",
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
  quiz: {
    q: `Branching factor $b=3$, goal depth $d=2$. Roughly how many states are at the deepest level, $b^d$?`,
    a: `<p>$b^d = 3^2 = 9$. There are about $9$ states at depth $2$. The count grows fast as $d$ rises.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-graph-search",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "a1", label: "route A: step 1 cost", min: 0, max: 10, val: 1, step: 0.5 },
        { key: "a2", label: "route A: step 2 cost", min: 0, max: 10, val: 4, step: 0.5 },
        { key: "b1", label: "route B: step 1 cost", min: 0, max: 10, val: 2, step: 0.5 },
        { key: "b2", label: "route B: step 2 cost", min: 0, max: 10, val: 1, step: 0.5 }
      ],
      compute: function (s) {
        var ca = s.a1 + s.a2, cb = s.b1 + s.b2, best = Math.min(ca, cb);
        var winner = ca <= cb ? "A" : "B";
        return { text: "route A cost = " + s.a1 + " + " + s.a2 + " = <b>" + ca.toFixed(1) +
          "</b>, route B cost = " + s.b1 + " + " + s.b2 + " = <b>" + cb.toFixed(1) +
          "</b>.<br>UCS picks the cheaper frontier: min(" + ca.toFixed(1) + ", " + cb.toFixed(1) +
          ") = <b>" + best.toFixed(1) + "</b>, route <b>" + winner + "</b> wins." };
      }
    });
  },
  title: "Graph search: dynamic programming and UCS",
  tagline: "Don't redo work. Remember states you've solved, and always expand the cheapest one next.",
  prereqs: ["ai-tree-search"],
  bigIdea:
    `<p>Tree search can visit the same state many times. Wasteful.</p>
     <p><b>Graph search</b> remembers states it has already handled, so it never repeats them.</p>
     <p>Two key methods: <b>dynamic programming</b> (memoize the future cost) and <b>uniform cost search</b> (always expand the cheapest-so-far state).</p>`,
  buildup:
    `<p>If two paths reach the same state, the cost to finish from there is the same. So solve each state once and reuse the answer.</p>
     <p>For DP this works when the graph is <b>acyclic</b>: no loops, so "future cost" is well defined.</p>
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
  quiz: {
    q: `Two ways to reach goal $G$: via $X$ costs $2+2=4$, via $Y$ costs $3+5=8$. What is $\\text{FutureCost}$ of the start, and which route wins?`,
    a: `<p>$\\min(4, 8) = 4$. The route through $X$ wins, at a total cost of $4$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-astar",
  demo: function (host) {
    // 5 rows x 7 cols grid. Start top-left, goal bottom-right.
    // g = Manhattan distance from start, h = Manhattan distance to goal, f = g + h.
    var ROWS = 5, COLS = 7;
    var sr = 0, sc = 0, gr = ROWS - 1, gc = COLS - 1;
    function gOf(r, c) { return Math.abs(r - sr) + Math.abs(c - sc); }
    function hOf(r, c) { return Math.abs(r - gr) + Math.abs(c - gc); }
    var fOpt = gOf(gr, gc) + hOf(gr, gc);   // smallest possible f (lies on a shortest path)
    Demos.grid(host, {
      rows: ROWS, cols: COLS, cellSize: 56,
      cell: function (r, c) {
        var g = gOf(r, c), h = hOf(r, c), f = g + h;
        var onPath = (f === fOpt);   // cells with minimum f lie on an optimal route
        var start = (r === sr && c === sc), goal = (r === gr && c === gc);
        var color = onPath ? "#2e7d32" : "#1b2733";
        if (start) color = "#4ea1ff";
        if (goal) color = "#ffb454";
        return { color: color, label: "f" + f, text: "#e6edf3" };
      },
      readout: function () {
        return "Each cell shows f = g + h (g = steps from <span style=\"color:#4ea1ff\">start</span>, " +
          "h = straight-line guess to <span style=\"color:#ffb454\">goal</span>). " +
          "A* expands the lowest g+h first; the <span style=\"color:#2e7d32\">green</span> band of minimum f = " +
          fOpt + " is the cheapest path it follows.";
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
    `<p>Imagine routing across a city. Pure UCS spreads out evenly like a circle. Slow.</p>
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
    `<p>Routing on a grid. True remaining distance to the goal from cell $s$ is $5$. Use straight-line distance as $h$.</p>
     <ul class="steps">
       <li>$h(s) = 4$ (straight-line guess). Since $4 \\le 5$, the heuristic is admissible. Good.</li>
       <li>A* prefers states with low PastCost $+ h$. A cell near the goal gets a small $h$, so it is explored first.</li>
       <li>Cells in the wrong direction have a large $h$, so A* mostly ignores them.</li>
       <li>If instead $h(s) = 9 > 5$, the heuristic overestimates. A* might miss the true cheapest path.</li>
     </ul>`,
  application:
    `<p>A* is the workhorse of GPS routing and video-game pathfinding. The straight-line distance heuristic lets it find the best route while exploring a tiny fraction of the map.</p>`,
  quiz: {
    q: `The true remaining cost from a state is $7$. Is a heuristic of $h=6$ admissible? Is $h=8$ admissible?`,
    a: `<p>$h=6$ is admissible because $6 \\le 7$ (it does not overshoot). $h=8$ is not, because $8 > 7$ overestimates, which can break A*'s guarantee.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-mdp",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "r1", label: "reward r1 (step 1)", min: -5, max: 10, val: 10, step: 0.5 },
        { key: "r2", label: "reward r2 (step 2)", min: -5, max: 10, val: 10, step: 0.5 },
        { key: "r3", label: "reward r3 (step 3)", min: -5, max: 10, val: 10, step: 0.5 },
        { key: "g", label: "discount γ", min: 0, max: 1, val: 0.5, step: 0.05 }
      ],
      compute: function (s) {
        var ret = s.r1 + s.g * s.r2 + s.g * s.g * s.r3;
        return { text: "discounted return = r1 + γ·r2 + γ²·r3 = " + s.r1 + " + " + s.g + "·" + s.r2 +
          " + " + (s.g * s.g).toFixed(3) + "·" + s.r3 + " = <b>" + ret.toFixed(2) +
          "</b>. (later rewards shrink by powers of γ.)" };
      }
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
       <li>Check: $0.8 + 0.2 = 1$. The probabilities sum to $1$. Good.</li>
       <li>Reward for reaching the right-cell: say $+5$. For slipping up: $0$.</li>
       <li>Because outcomes are random, the agent must plan with these odds, not assume success.</li>
     </ul>`,
  application:
    `<p>MDPs model robot control, inventory restocking, self-driving decisions, and game AI, where actions do not always work and the future is uncertain. They are the foundation of reinforcement learning.</p>`,
  quiz: {
    q: `An action has $T(s,a,s_1)=0.7$ and one other possible outcome $s_2$. What must $T(s,a,s_2)$ be?`,
    a: `<p>The probabilities must sum to $1$, so $T(s,a,s_2) = 1 - 0.7 = 0.3$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-policy-value",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "r1", label: "policy reward r1 (step 1)", min: -5, max: 10, val: 4, step: 0.5 },
        { key: "r2", label: "policy reward r2 (step 2)", min: -5, max: 10, val: 4, step: 0.5 },
        { key: "r3", label: "policy reward r3 (step 3)", min: -5, max: 10, val: 4, step: 0.5 },
        { key: "g", label: "discount γ", min: 0, max: 1, val: 0.5, step: 0.05 }
      ],
      compute: function (s) {
        var v = s.r1 + s.g * s.r2 + s.g * s.g * s.r3;
        return { text: "value of the policy = r1 + γ·r2 + γ²·r3 = " + s.r1 + " + " + s.g + "·" + s.r2 +
          " + " + (s.g * s.g).toFixed(3) + "·" + s.r3 + " = <b>" + v.toFixed(2) +
          "</b>. (with no randomness, value equals this discounted return.)" };
      }
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
    `<p>From the MDP lesson: actions are uncertain and rewards are discounted.</p>
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
    `<p>Policies are the decision rules learned by game AI, trading bots, and robot controllers. Discounting models the fact that a reward now is usually worth more than the same reward later.</p>`,
  quiz: {
    q: `Rewards $r_1=4$, $r_2=4$, with $\\gamma=0.5$. What is the discounted utility $u$?`,
    a: `<p>$u = 4\\times1 + 4\\times0.5 = 4 + 2 = 6$. The second reward is discounted to $2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-qvalue",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "t", label: "T (probability of next state)", min: 0, max: 1, val: 1, step: 0.05 },
        { key: "r", label: "Reward(s,a,s′)", min: -5, max: 10, val: 6, step: 0.5 },
        { key: "g", label: "discount γ", min: 0, max: 1, val: 0.5, step: 0.05 },
        { key: "v", label: "V(s′) value of next state", min: -5, max: 20, val: 4, step: 0.5 }
      ],
      compute: function (s) {
        var q = s.t * (s.r + s.g * s.v);
        return { text: "Q = T·(R + γ·V(s′)) = " + s.t + "·(" + s.r + " + " + s.g + "·" + s.v +
          ") = " + s.t + "·" + (s.r + s.g * s.v).toFixed(2) + " = <b>" + q.toFixed(2) +
          "</b>. (one outcome shown; sum this over all next states for the full Q-value.)" };
      }
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
    `<p>Q-values are the heart of reinforcement learning. A game AI compares the Q-value of each move and picks the highest. They let an agent rate actions without simulating the whole future by hand.</p>`,
  quiz: {
    q: `One outcome only: probability $1$, reward $6$, next-state value $V=4$, $\\gamma=0.5$. What is $Q(s,a)$?`,
    a: `<p>$Q = 1\\times[\\,6 + 0.5\\times4\\,] = 6 + 2 = 8$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-value-iteration",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "q1", label: "Q(s, action 1)", min: -5, max: 20, val: 3, step: 0.5 },
        { key: "q2", label: "Q(s, action 2)", min: -5, max: 20, val: 7, step: 0.5 }
      ],
      compute: function (s) {
        var v = Math.max(s.q1, s.q2);
        var best = s.q1 >= s.q2 ? "action 1" : "action 2";
        return { text: "one Bellman backup: V(s) = max(Q1, Q2) = max(" + s.q1 + ", " + s.q2 +
          ") = <b>" + v.toFixed(1) + "</b>. best action = arg max = <b>" + best + "</b>." };
      }
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
    `<p>State $s$ has two actions. Using last round's values, their Q-values come out to: $Q(s,\\text{left}) = 3$, $Q(s,\\text{right}) = 7$.</p>
     <ul class="steps">
       <li>$V^{(t)}(s) = \\max(3, 7) = 7$. We keep the bigger one.</li>
       <li>$\\pi^*(s) = \\arg\\max(3, 7) = \\text{right}$. Right is the best action.</li>
       <li>Next round recomputes Q-values with the updated values, and we repeat.</li>
       <li>When the values stop moving, we have the optimal plan.</li>
     </ul>`,
  application:
    `<p>Value iteration solves MDPs exactly when the model is known: robot navigation, inventory control, board-game endgames. It is the textbook way to compute an optimal policy.</p>`,
  quiz: {
    q: `A state's actions have Q-values $Q(\\text{up})=2$, $Q(\\text{down})=9$, $Q(\\text{stay})=5$. What is the new value, and the optimal action?`,
    a: `<p>$V = \\max(2,9,5) = 9$. The optimal action is $\\arg\\max = \\text{down}$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-q-learning",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "q", label: "old Q(s,a)", min: 0, max: 20, val: 5, step: 0.5 },
        { key: "r", label: "reward r", min: -5, max: 10, val: 1, step: 0.5 },
        { key: "g", label: "discount γ", min: 0, max: 1, val: 0.9, step: 0.05 },
        { key: "qn", label: "max Q at next state", min: 0, max: 20, val: 8, step: 0.5 },
        { key: "eta", label: "learning rate η", min: 0.01, max: 1, val: 0.5, step: 0.01 }
      ],
      compute: function (s) {
        var target = s.r + s.g * s.qn, nq = (1 - s.eta) * s.q + s.eta * target;
        return { text: "target = r + γ·maxQ = " + s.r + " + " + s.g + "·" + s.qn + " = <b>" + target.toFixed(2) + "</b>.<br>new Q = (1−η)·Q + η·target = " + (1 - s.eta).toFixed(2) + "·" + s.q + " + " + s.eta + "·" + target.toFixed(2) + " = <b>" + nq.toFixed(2) + "</b>." };
      }
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
       <li>Since $2 < 5$, branch $B$ can never beat branch $A$. Prune it. Skip the remaining replies.</li>
     </ul>
     <p>You reached the same decision (branch $A$) without checking the rest of $B$.</p>`,
  application:
    `<p>Alpha-beta pruning is what made strong chess programs practical, including Deep Blue. By skipping doomed branches, it searches several moves deeper in the same time.</p>`,
  quiz: {
    q: `Max already has $\\alpha=7$ secured. A new min-branch's first child returns $4$. Can the rest of that branch matter? Why?`,
    a: `<p>No. The branch is a min node, so its value is at most $4$. Since $4 < 7$, it cannot beat the secured $7$. Prune it.</p>`
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
  quiz: {
    q: `A chance node has outcomes worth $10$ and $0$, each with probability $0.5$. What is the expectimax value? How does it differ from minimax?`,
    a: `<p>Expectimax $= 0.5\\times10 + 0.5\\times0 = 5$. Minimax would take the worst case, $\\min(10,0)=0$. Expectimax is higher because it averages.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-csp",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "f1", label: "factor 1 (0 = broken, 1 = holds)", min: 0, max: 1, val: 1, step: 1 },
        { key: "f2", label: "factor 2 (0 = broken, 1 = holds)", min: 0, max: 1, val: 1, step: 1 },
        { key: "f3", label: "factor 3 (0 = broken, 1 = holds)", min: 0, max: 1, val: 1, step: 1 }
      ],
      compute: function (s) {
        var w = s.f1 * s.f2 * s.f3;
        return { text: "Weight(x) = f1 · f2 · f3 = " + s.f1 + " · " + s.f2 + " · " + s.f3 +
          " = <b>" + w + "</b>. consistent iff all factors = 1: <b>" +
          (w > 0 ? "yes — valid assignment" : "no — a hard constraint is broken") + "</b>." };
      }
    });
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
  quiz: {
    q: `Three factors give scores $1$, $1$, and $0$ for an assignment. What is its weight, and is it a valid solution?`,
    a: `<p>Weight $= 1\\times1\\times0 = 0$. A zero means a hard constraint is broken, so it is not a valid solution.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-csp-search",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "dom", label: "neighbor domain size (values left)", min: 0, max: 5, val: 3, step: 1 },
        { key: "removed", label: "values removed by forward checking", min: 0, max: 5, val: 1, step: 1 }
      ],
      compute: function (s) {
        var left = Math.max(0, s.dom - s.removed);
        return { text: "after forward checking: " + s.dom + " − " + s.removed +
          " = <b>" + left + "</b> values remain in the neighbor's domain.<br>" +
          (left === 0 ? "<b>empty domain — dead end, backtrack!</b>"
                      : "domain non-empty, so this branch can still be completed.") };
      }
    });
  },
  title: "Solving CSPs: backtracking and consistency",
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
  quiz: {
    q: `Variable A's domain is $\\{$Red, Blue$\\}$ and B's is $\\{$Red$\\}$. Using the most-constrained-variable heuristic, which do you assign first, and why?`,
    a: `<p>Assign B first. It has only one value left ($\\{$Red$\\}$), the smallest domain, so it is the most constrained.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-bayes-net",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "pa", label: "P(A)", min: 0, max: 1, val: 0.3, step: 0.05 },
        { key: "pba", label: "P(B | A)", min: 0, max: 1, val: 0.9, step: 0.05 }
      ],
      compute: function (s) {
        var joint = s.pa * s.pba;
        return { text: "factorization: P(A, B) = P(A) · P(B | A) = " + s.pa.toFixed(2) + " · " + s.pba.toFixed(2) +
          " = <b>" + joint.toFixed(3) + "</b>. (each node contributes its probability given its parents.)" };
      }
    });
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
    `<p>Rain causes a Wet sidewalk. Arrow: Rain $\\rightarrow$ Wet. Suppose $P(\\text{Rain}) = 0.3$, and $P(\\text{Wet}\\mid\\text{Rain}) = 0.9$.</p>
     <ul class="steps">
       <li>Rain has no parents, so its term is $P(\\text{Rain}) = 0.3$.</li>
       <li>Wet's parent is Rain, so its term is $P(\\text{Wet}\\mid\\text{Rain})$.</li>
       <li>Joint: $P(\\text{Rain}, \\text{Wet}) = P(\\text{Rain})\\times P(\\text{Wet}\\mid\\text{Rain}) = 0.3\\times0.9 = 0.27$.</li>
     </ul>
     <p>The graph told us exactly which conditional probabilities to multiply.</p>`,
  application:
    `<p>Bayesian networks power medical diagnosis (symptoms given diseases), spam filtering, and fault detection. They let experts encode cause-and-effect knowledge and reason about it cleanly.</p>`,
  quiz: {
    q: `For Rain $\\rightarrow$ Wet, with $P(\\text{Rain})=0.4$ and $P(\\text{Wet}\\mid\\text{Rain})=0.5$, what is $P(\\text{Rain}, \\text{Wet})$?`,
    a: `<p>$P(\\text{Rain})\\times P(\\text{Wet}\\mid\\text{Rain}) = 0.4\\times0.5 = 0.2$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-bayes-inference",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "prior", label: "prior P(query)", min: 0, max: 1, val: 0.2, step: 0.05 },
        { key: "like", label: "likelihood P(evidence | query)", min: 0, max: 1, val: 0.8, step: 0.05 },
        { key: "evid", label: "evidence P(evidence)", min: 0.05, max: 1, val: 0.4, step: 0.05 }
      ],
      compute: function (s) {
        var post = (s.like * s.prior) / s.evid;
        var capped = Math.min(post, 1);
        return { text: "posterior = (likelihood · prior) / evidence = (" + s.like.toFixed(2) + " · " + s.prior.toFixed(2) +
          ") / " + s.evid.toFixed(2) + " = <b>" + post.toFixed(3) + "</b>." +
          (post > 1 ? " (over 1 — these numbers are inconsistent; a real evidence ≥ likelihood·prior, so the true posterior is ≤ 1, here " + capped.toFixed(2) + ".)" : "") };
      }
    });
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
    `<p>An alarm can be set off by a Burglary or an Earthquake. You hear the alarm (evidence).</p>
     <ul class="steps">
       <li>At first, both Burglary and Earthquake are possible causes. Each grows more likely.</li>
       <li>Now the radio reports an Earthquake. That cause is confirmed.</li>
       <li>The alarm is explained. So Burglary becomes <i>less</i> likely again. This is "explaining away".</li>
       <li>Inference does this arithmetic for you, using $P(\\text{Burglary}\\mid\\text{Alarm},\\text{Earthquake})$.</li>
     </ul>`,
  application:
    `<p>Inference answers real questions: given these symptoms, how likely is this disease? Given these clicks, how likely is fraud? It is how a Bayes net turns from a diagram into a decision tool.</p>`,
  quiz: {
    q: `In the alarm example, after the earthquake is confirmed, does the probability of a burglary go up or down? What is this effect called?`,
    a: `<p>It goes down. The earthquake already explains the alarm, so the rival cause (burglary) is less needed. This is called "explaining away".</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-hmm",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "prior", label: "prior P(state = Rainy)", min: 0, max: 1, val: 0.5, step: 0.05 },
        { key: "stay", label: "transition P(Rainy → Rainy)", min: 0, max: 1, val: 0.7, step: 0.05 },
        { key: "switch", label: "transition P(Sunny → Rainy)", min: 0, max: 1, val: 0.3, step: 0.05 },
        { key: "eR", label: "emission P(Umbrella | Rainy)", min: 0, max: 1, val: 0.9, step: 0.05 },
        { key: "eS", label: "emission P(Umbrella | Sunny)", min: 0, max: 1, val: 0.2, step: 0.05 }
      ],
      compute: function (s) {
        // predict: P(Rainy next) = stay*P(Rainy) + switch*P(Sunny)
        var predR = s.stay * s.prior + s.switch * (1 - s.prior);
        var predS = 1 - predR;
        // weight by emission of observing Umbrella
        var wR = predR * s.eR, wS = predS * s.eS;
        var z = wR + wS;
        var postR = z > 0 ? wR / z : 0;
        return { text: "predict: P(Rainy) = " + s.stay.toFixed(2) + "·" + s.prior.toFixed(2) + " + " +
          s.switch.toFixed(2) + "·" + (1 - s.prior).toFixed(2) + " = <b>" + predR.toFixed(3) +
          "</b> (Sunny = " + predS.toFixed(3) + ").<br>weight by emission (saw Umbrella): Rainy " + predR.toFixed(3) + "·" + s.eR.toFixed(2) +
          " = " + wR.toFixed(3) + ", Sunny " + predS.toFixed(3) + "·" + s.eS.toFixed(2) + " = " + wS.toFixed(3) +
          ".<br>normalize: P(Rainy | Umbrella) = " + wR.toFixed(3) + " / " + z.toFixed(3) + " = <b>" + postR.toFixed(3) + "</b>." };
      }
    });
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
    `<p>You cannot see the weather (hidden), but you see whether a friend carries an umbrella (clue).</p>
     <ul class="steps">
       <li>Hidden states: Rainy or Sunny. Observation: Umbrella or No-umbrella.</li>
       <li>Emission: $P(\\text{Umbrella}\\mid\\text{Rainy})$ is high, $P(\\text{Umbrella}\\mid\\text{Sunny})$ is low.</li>
       <li>You see an umbrella three days in a row. The forward-backward algorithm infers it was probably Rainy.</li>
       <li>A No-umbrella day in between still leans Rainy, because the neighbors are wet. That is smoothing using future clues too.</li>
     </ul>`,
  application:
    `<p>HMMs power speech recognition (hidden words, observed sound waves), object tracking (hidden position, noisy sensors), and gene finding in DNA. They are the classic model for "infer the hidden truth from a noisy time series".</p>`,
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
    { sym: "$\\models$", desc: "entails: 'KB $\\models f$' means $f$ is true in every model where the knowledge base KB is true." }
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
  quiz: {
    q: `KB: $P$ is true, and $P \\rightarrow Q$. Does KB entail $Q$? Explain in one line.`,
    a: `<p>Yes. $P$ is true and the rule $P\\rightarrow Q$ forces $Q$ true, so $Q$ holds in every model of the KB. Thus KB $\\models Q$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "ai-inference-rules",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "p", label: "premise p present (0/1)", min: 0, max: 1, val: 1, step: 1 },
        { key: "imp", label: "premise p → q present (0/1)", min: 0, max: 1, val: 1, step: 1 }
      ],
      compute: function (s) {
        var derives = (s.p === 1 && s.imp === 1);
        return { text: "modus ponens: from p and (p → q), conclude q.<br>p present = <b>" + s.p +
          "</b>, (p → q) present = <b>" + s.imp + "</b>.<br>derive q? <b>" +
          (derives ? "yes — q is concluded" : "no — both premises are required") + "</b>." };
      }
    });
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
     <p><b>Resolution</b> is a single rule that, applied over and over, can prove anything that logically follows.</p>`,
  symbols: [
    { sym: "$f, g$", desc: "logical sentences (each true or false)." },
    { sym: "modus ponens", desc: "from $f$ and $f \\rightarrow g$, conclude $g$." },
    { sym: "Horn clause", desc: "a rule with at most one positive conclusion, like 'if A and B then C'." },
    { sym: "resolution", desc: "a rule that combines two clauses and cancels a symbol that appears positive in one and negative in the other." },
    { sym: "soundness", desc: "every fact the rules derive is actually true. No false conclusions." },
    { sym: "completeness", desc: "the rules can derive every fact that truly follows. Nothing true is missed." }
  ],
  formula: `$$ \\frac{f,\\quad f \\rightarrow g}{g} \\qquad\\text{(modus ponens)} $$`,
  whatItDoes:
    `<p>The bar means: from the facts on top, derive the fact below.</p>
     <p>An inference system is <b>sound</b> if it never derives a falsehood, and <b>complete</b> if it can derive every truth.</p>
     <p>Resolution is both sound and complete for propositional logic. <b>First-order logic</b> extends all this with variables and quantifiers (like "for all $x$" and "there exists $x$"), so rules can talk about whole classes of objects, not just fixed facts.</p>`,
  example:
    `<p>KB: $\\text{Human(Socrates)}$, and the rule $\\text{Human}(x) \\rightarrow \\text{Mortal}(x)$ ("every human is mortal").</p>
     <ul class="steps">
       <li>We know $\\text{Human(Socrates)}$ is true.</li>
       <li>The rule says: if someone is Human, they are Mortal.</li>
       <li>Match $x$ = Socrates. Modus ponens fires: conclude $\\text{Mortal(Socrates)}$.</li>
       <li>We derived a new true fact without any truth table.</li>
     </ul>
     <p>The quantified rule "for all $x$" is first-order logic; the plain $f, f\\rightarrow g$ step is propositional modus ponens.</p>`,
  application:
    `<p>Automated theorem provers, the Prolog programming language, and formal verification of software all run on resolution and modus ponens. They let a machine prove conclusions that are guaranteed correct.</p>`,
  quiz: {
    q: `You know $\\text{Bird(Tweety)}$ and the rule $\\text{Bird}(x) \\rightarrow \\text{CanFly}(x)$. What does modus ponens conclude?`,
    a: `<p>Match $x = $ Tweety. From $\\text{Bird(Tweety)}$ and the rule, modus ponens concludes $\\text{CanFly(Tweety)}$.</p>`
  }
});

})();
