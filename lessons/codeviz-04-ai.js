/* Per-lesson CODE VISUALIZATIONS — 04-ai.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["ai-linear-predictors"] = {
  question: "Where does the line go, and how do you read which side a point lands on?",
  code: `// Linear predictor: score = w . phi(x) + b, decide by the sign.
const w = [1, 1], b = -6;
const pts = [
  {x:1, y:1, c:-1}, {x:1.5, y:2, c:-1}, {x:2, y:1.2, c:-1}, {x:1.2, y:2.5, c:-1},
  {x:4, y:4, c:1}, {x:4.5, y:3, c:1}, {x:3.5, y:4.5, c:1}, {x:5, y:3.5, c:1}
];
let correct = 0, minMargin = Infinity;
for (const p of pts) {
  const score = w[0]*p.x + w[1]*p.y + b;   // dot product plus bias
  const margin = score * p.c;              // >0 means correct side
  if (margin > 0) correct++;
  if (margin < minMargin) minMargin = margin;
}
// boundary is the line w.x + b = 0  ->  y = -(w0*x + b)/w1
console.log("correct", correct, "of", pts.length, "min margin", minMargin.toFixed(2));`,
  caption: "The line is the decision boundary; the gap from line to nearest point is the margin.",
  charts: [
    {
      type: "scatter",
      title: "Clean separation: boundary splits the two classes with room to spare",
      xlabel: "feature 1 (e.g. count of 'free')",
      ylabel: "feature 2 (e.g. number of links)",
      groups: [
        { name: "class -1 (no)", color: "#4ea1ff", points: [[1,1],[1.5,2],[2,1.2],[1.2,2.5]] },
        { name: "class +1 (yes)", color: "#7ee787", points: [[4,4],[4.5,3],[3.5,4.5],[5,3.5]] }
      ],
      lines: [ { color: "#9aa7b4", dash: false, points: [[0,6],[6,0]] } ],
      interpret: "Each dot is one example placed by its two features; colour is its true class. The grey line is the decision boundary <b>w . x + b = 0</b> — score is positive on one side (predict +1), negative on the other (predict -1). Here every blue point sits below-left and every green point above-right with a clear gap, so all 8 are classified correctly and the smallest margin is comfortably positive: a confident, well-placed line."
    },
    {
      type: "scatter",
      title: "Tiny margin: correct but the line nearly grazes a point (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "class -1 (no)", color: "#4ea1ff", points: [[1,1],[1.5,2],[2,1.2],[2.8,2.6]] },
        { name: "class +1 (yes)", color: "#7ee787", points: [[4,4],[4.5,3],[3.5,4.5],[3.0,2.9]] }
      ],
      lines: [ { color: "#ffb454", dash: true, points: [[0,6],[6,0]] } ],
      interpret: "Illustrative. Same idea, but two points from opposite classes now crowd right up against the boundary. Everything is still classified correctly, yet the smallest margin is barely positive — the line could be shifted a hair and a point would flip. A near-zero margin signals a <b>fragile boundary</b> that may not generalise; you want margin, not just correctness."
    },
    {
      type: "scatter",
      title: "Not linearly separable: no straight line can split these (illustrative)",
      xlabel: "feature 1",
      ylabel: "feature 2",
      groups: [
        { name: "class -1 (no)", color: "#4ea1ff", points: [[1,1],[4.5,1.2],[1.2,4.5],[4.7,4.6]] },
        { name: "class +1 (yes)", color: "#7ee787", points: [[2.8,2.8],[3.0,3.2],[2.6,3.0],[3.2,2.6]] }
      ],
      lines: [ { color: "#ff7b72", dash: true, points: [[0,6],[6,0]] } ],
      interpret: "Illustrative. The +1 class sits in the middle, surrounded by the -1 class. Any straight line leaves some points on the wrong side, so the smallest margin is <b>negative</b> — at least one point is misclassified no matter where you put the line. When you see this, a linear predictor has hit its ceiling: add an interaction feature, a kernel, or switch to a non-linear model."
    }
  ]
};

window.CODEVIZ["ai-loss-minimization"] = {
  question: "How much does each loss punish a prediction as the margin changes?",
  code: `// Loss as a function of margin m (m = score times true label; bigger m = more correct).
const margins = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
const zeroOne = m => (m < 0 ? 1 : 0);          // 1 if wrong, 0 if right
const hinge   = m => Math.max(0, 1 - m);       // SVM loss, zero once m passes 1
const squared = m => (m - 1) * (m - 1);        // punishes big errors hard
for (const m of margins) {
  console.log("m=", m,
    "zeroOne", zeroOne(m),
    "hinge", hinge(m).toFixed(2),
    "squared", squared(m).toFixed(2));
}`,
  caption: "Read the x-axis as 'how correct and confident'; the curve height is the penalty.",
  charts: [
    {
      type: "line",
      title: "Three losses vs margin: how each grades the same prediction",
      xlabel: "margin m (score times true label)",
      ylabel: "loss (penalty)",
      series: [
        { name: "zero-one (right/wrong)", color: "#9aa7b4", points: [[-2,1],[-1,1],[-0.5,1],[-0.01,1],[0,0],[0.5,0],[1,0],[2,0],[3,0]] },
        { name: "hinge max(0,1-m)", color: "#7ee787", points: [[-2,3],[-1,2],[0,1],[0.5,0.5],[1,0],[2,0],[3,0]] },
        { name: "squared (m-1)^2", color: "#ffb454", points: [[-2,9],[-1,4],[0,1],[0.5,0.25],[1,0],[1.5,0.25],[2,1],[3,4]] }
      ],
      interpret: "The x-axis is the margin: negative means wrong, large positive means correct and confident. Each curve's height is the penalty that loss assigns. <b>Zero-one</b> (grey) is a flat step — 1 when wrong, 0 when right — so it has no slope to push on. <b>Hinge</b> (green) slopes down and hits zero once the margin passes 1, demanding correct AND confident. <b>Squared</b> (orange) is a bowl minimised at m=1 but it punishes a very confident-correct point (large m) again — usually wrong for classification."
    },
    {
      type: "line",
      title: "Zero-one is flat: why gradient descent cannot train on it",
      xlabel: "margin m",
      ylabel: "loss",
      series: [
        { name: "zero-one", color: "#9aa7b4", points: [[-2,1],[-1,1],[-0.5,1],[-0.01,1],[0,0],[0.5,0],[1,0],[2,0]] },
        { name: "hinge (trainable surrogate)", color: "#7ee787", points: [[-2,3],[-1,2],[0,1],[1,0],[2,0]] }
      ],
      interpret: "Illustrative contrast. The grey zero-one curve is flat everywhere except one vertical jump at m=0, so its slope is zero almost everywhere — gradient descent gets no direction to move and cannot learn. That flatness is the entire reason <b>surrogate losses</b> like hinge (green) exist: hinge tilts downward, giving a usable gradient that still pushes the margin in the right direction. Use zero-one only to <i>report</i> accuracy, never as the training target."
    },
    {
      type: "line",
      title: "Training vs validation loss over epochs: overfitting (illustrative)",
      xlabel: "training epoch",
      ylabel: "average loss",
      series: [
        { name: "training loss", color: "#7ee787", points: [[0,1.0],[1,0.6],[2,0.4],[3,0.27],[4,0.18],[5,0.12],[6,0.08],[7,0.05],[8,0.03]] },
        { name: "validation loss", color: "#ff7b72", points: [[0,1.05],[1,0.68],[2,0.5],[3,0.42],[4,0.4],[5,0.43],[6,0.5],[7,0.6],[8,0.72]] }
      ],
      interpret: "Illustrative. We minimise <b>training</b> loss (green), but it is the held-out <b>validation</b> loss (red) that says whether the model is actually good. Both fall together at first; then training loss keeps sliding toward zero while validation loss bottoms out and turns back up. That upturn is overfitting — the model is memorising training noise. Stop near the validation minimum (around epoch 4 here), and add an L2 penalty to keep weights from blowing up."
    }
  ]
};

window.CODEVIZ["ai-sgd"] = {
  question: "On an SGD loss curve, how do you tell healthy noisy descent from a rate that is too big or too small?",
  charts: [
    {
      type: "line",
      title: "Healthy SGD: noisy steps, but the trend falls and settles",
      xlabel: "update number (one example each)",
      ylabel: "loss on the current example",
      series: [
        {
          name: "per-step loss (jittery)",
          color: "#9aa7b4",
          points: [
            [0, 25.0], [1, 18.4], [2, 21.0], [3, 13.1], [4, 15.6], [5, 9.2],
            [6, 11.0], [7, 6.4], [8, 8.1], [9, 4.5], [10, 6.0], [11, 3.2],
            [12, 4.3], [13, 2.4], [14, 3.3], [15, 1.9], [16, 2.6], [17, 1.6],
            [18, 2.2], [19, 1.4], [20, 2.0]
          ]
        },
        {
          name: "running average (the real trend)",
          color: "#7ee787",
          points: [
            [0, 25.0], [2, 21.5], [4, 18.0], [6, 14.2], [8, 11.0], [10, 8.6],
            [12, 6.8], [14, 5.4], [16, 4.4], [18, 3.7], [20, 3.2]
          ]
        }
      ],
      interpret: "<b>Illustrative shape (honest).</b> X is the update count — SGD takes one step per single example, so the answer is computed on a different example each time. The grey line is the raw per-step loss: it bounces because one example is a rough guess of the whole dataset. Do not read the jitter as failure. Watch the green running average instead: as long as that smoothed trend slopes down and then flattens, the learning rate is good. Healthy SGD is a noisy band that drifts downward and settles into a low, fuzzy plateau."
    },
    {
      type: "line",
      title: "Learning rate too big: the loss diverges to infinity",
      xlabel: "update number",
      ylabel: "loss on the current example",
      series: [
        {
          name: "eta too large",
          color: "#ff7b72",
          points: [
            [0, 4.00], [1, 7.84], [2, 15.37], [3, 30.13], [4, 59.05],
            [5, 115.7], [6, 226.9], [7, 444.7], [8, 871.6], [9, 1708], [10, 3348]
          ]
        }
      ],
      interpret: "<b>Real numbers.</b> One weight w on loss (w−2)², gradient 2(w−2), started at w=4 with eta=1.4. Each update w ← w − eta·grad overshoots the minimum and lands farther out, so the loss roughly multiplies every step (4 → 7.8 → 15 → 30 …) and runs off to infinity. A curve that rises — smoothly here, or as exploding saw-teeth in real runs — is the signature of too large a learning rate: the step is bigger than the bowl can absorb. Cut eta until the trend turns downward."
    },
    {
      type: "line",
      title: "Learning rate too small: descent crawls, never arrives",
      xlabel: "update number",
      ylabel: "loss on the current example",
      series: [
        {
          name: "eta too tiny",
          color: "#ffb454",
          points: [
            [0, 4.000], [1, 3.842], [2, 3.690], [3, 3.545], [4, 3.405],
            [5, 3.271], [6, 3.142], [7, 3.018], [8, 2.899], [9, 2.785], [10, 2.675]
          ]
        }
      ],
      interpret: "<b>Real numbers.</b> Same loss (w−2)² from w=4, but eta=0.02 makes every nudge tiny, so after 10 updates the loss has barely moved (4.0 → 2.7) and is nowhere near 0. A nearly-flat, gently sloping line means the rate is too small: it is safe — no overshoot, no divergence — but wastes a huge number of steps. Raise eta so the smoothed trend drops with real purpose instead of this gentle creep."
    },
    {
      type: "line",
      title: "Mini-batch SGD: a bigger batch buys a smoother curve",
      xlabel: "update number",
      ylabel: "average loss over the batch",
      series: [
        {
          name: "batch = 1 (very noisy)",
          color: "#9aa7b4",
          points: [
            [0, 20.0], [1, 12.5], [2, 16.0], [3, 7.8], [4, 11.0], [5, 5.2],
            [6, 8.0], [7, 3.6], [8, 5.5], [9, 2.4], [10, 3.8]
          ]
        },
        {
          name: "batch = 32 (smoother)",
          color: "#4ea1ff",
          points: [
            [0, 20.0], [1, 15.4], [2, 11.9], [3, 9.2], [4, 7.1], [5, 5.5],
            [6, 4.3], [7, 3.4], [8, 2.7], [9, 2.2], [10, 1.8]
          ]
        }
      ],
      interpret: "<b>Illustrative shape (honest).</b> Both lines descend toward the same minimum, but the grey batch-of-1 curve is jagged because each step trusts a single example, while the blue batch-of-32 curve is far smoother because it averages 32 gradients before stepping. Read a very spiky loss as a sign your batch is small, not that the model is broken — enlarging the batch (32–512) trades a little speed per step for a steadier path and better hardware use. The averaging shrinks the noise; it does not change where the curve is heading."
    }
  ],
  caption: "SGD curves are noisy by design: judge the smoothed trend, not the jitter. A drifting-down band is healthy, a rising curve means eta is too big, a near-flat crawl means eta is too small, and a bigger batch buys a smoother path.",
  code: "// SGD on one weight, loss (w-2)^2 with gradient 2*(w-2)\nfunction run(eta, steps) {\n  let w = 4;\n  const hist = [];\n  for (let n = 0; n <= steps; n++) {\n    const loss = (w - 2) * (w - 2);\n    hist.push([n, loss]); // [update, loss]\n    w = w - eta * (2 * (w - 2)); // w <- w - eta*grad\n  }\n  return hist;\n}\nconsole.log('good ', run(0.2, 10).map(p => p[1].toFixed(3)));\nconsole.log('big  ', run(1.4, 10).map(p => p[1].toFixed(2)));\nconsole.log('tiny ', run(0.02, 10).map(p => p[1].toFixed(3)));"
};

window.CODEVIZ["ai-search-problem"] = {
  question: "How do you read a search problem to pick the cheapest path, and why is fewest steps a trap?",
  charts: [
    {
      type: "bars",
      title: "Cheapest path: compare TOTAL cost, not step count",
      labels: ["Direct A to D (1 step)", "Detour A to B to D (2 steps)"],
      values: [5, 2],
      valueLabels: ["cost 5", "cost 2"],
      colors: ["#9aa7b4", "#7ee787"],
      interpret: "<b>Real numbers</b> from the lesson. Each bar is one candidate path to the goal; its height is the sum of that path's action costs. The direct route is a single step but costs 5; the detour takes two steps yet sums to 1+1=2. Read the chart by picking the <b>shortest bar</b> (green) — that is what a search algorithm returns. The lesson here: more steps can still be cheaper, so compare total Cost, never the number of hops."
    },
    {
      type: "bars",
      title: "Three routes ranked: the search algorithm returns the lowest bar",
      labels: ["A to C to G", "A to B to D to G", "A to D to G (greedy)"],
      values: [6, 4, 7],
      valueLabels: ["1+2+3 = 6", "1+1+2 = 4", "5+2 = 7"],
      colors: ["#9aa7b4", "#7ee787", "#ffb454"],
      interpret: "<b>Illustrative</b> small weighted graph. Each bar adds the edge costs along one path from start A to goal G. Uniform-cost search effectively builds these totals and returns the smallest — the green 4-cost route — even though the orange route (A to D to G) uses fewer edges. Reading rule: a tempting first step (the cheap-looking A to D hop) can lock you into the most expensive total, so the algorithm must score whole paths, not single moves."
    },
    {
      type: "bars",
      title: "Step count can mislead: fewest hops is the most expensive here",
      series: [
        { name: "number of steps", color: "#4ea1ff", points: [[0, 1], [1, 3]] },
        { name: "total cost", color: "#7ee787", points: [[0, 9], [1, 3]] }
      ],
      labels: ["Highway (1 long hop)", "Side streets (3 short hops)"],
      interpret: "<b>Illustrative</b> two-series view (one route per label). Blue bars are how many actions the path uses; green bars are the total cost paid. The 1-step highway has the fewest hops yet the highest cost (9), while the 3-step side-street route costs only 3. When the blue and green bars disagree, trust green — optimizing hop count instead of summed Cost is exactly the pitfall that makes a fast-looking plan expensive."
    },
    {
      type: "line",
      title: "Why state spaces explode: paths grow like (branching factor) to the depth",
      xlabel: "depth d (steps from start)",
      ylabel: "number of states to consider",
      series: [
        {
          name: "branching factor b = 3",
          color: "#ff7b72",
          points: [[0, 1], [1, 3], [2, 9], [3, 27], [4, 81], [5, 243], [6, 729]]
        }
      ],
      interpret: "<b>Real numbers</b> for b raised to the power d with b=3. X is how deep you search; Y is roughly how many states live at that depth. Each extra step multiplies the count by the branching factor, so the curve shoots up — 3, 9, 27, 81 — and a naive listing of all states becomes hopeless fast. Read this steep climb as the reason a compact state encoding and a visited-set matter: keep the state minimal and never re-expand, or the search drowns before it reaches the goal."
    }
  ],
  caption: "A search problem asks for the lowest summed Cost to a goal, not the fewest steps. Compare whole-path totals (shortest bar wins), distrust hop count when it disagrees with cost, and respect the b-to-the-d blowup that forces compact states and graph search.",
  code: "// Five pieces define a search problem; here we just total path costs.\nconst edge = { 'A-D': 5, 'A-B': 1, 'B-D': 1 }; // Cost(s,a)\nfunction pathCost(path) {\n  let total = 0;\n  for (let i = 0; i < path.length - 1; i++) {\n    total += edge[path[i] + '-' + path[i + 1]]; // sum action costs\n  }\n  return total;\n}\nconst direct = pathCost(['A', 'D']);   // 5, one step\nconst detour = pathCost(['A', 'B', 'D']); // 2, two steps\nconsole.log('direct', direct, 'detour', detour);\nconsole.log('cheapest =', Math.min(direct, detour)); // 2"
};

window.CODEVIZ["ai-tree-search"] = {
  question: "How fast does the number of states blow up as the goal gets deeper, and how do BFS, DFS and iterative deepening trade time for memory?",
  caption: "Tree search explores states that fan out like a tree. The y-axis cost grows like b to the power d, so where you look (wide first, deep first, or a growing-depth mix) decides your memory bill and whether you find the shallowest goal.",
  charts: [
    {
      type: "line",
      title: "States to explore vs goal depth (branching factor b = 2)",
      xlabel: "depth d (actions from start to goal)",
      ylabel: "states at the deepest level (b^d)",
      series: [
        { name: "b=2 (2^d)", color: "#4ea1ff", points: [[1,2],[2,4],[3,8],[4,16],[5,32],[6,64],[7,128],[8,256]] }
      ],
      interpret: "<b>x = how deep the goal is; y = how many states sit at that depth.</b> These are real values of 2 to the power d. The curve bends sharply upward: every extra level of depth doubles the work. This is the b^d blowup that makes plain tree search hopeless for deep problems and is the whole reason the next lessons add heuristics and memoization."
    },
    {
      type: "line",
      title: "Branching factor matters: b = 2 vs b = 3 vs b = 4",
      xlabel: "depth d",
      ylabel: "states at deepest level (b^d, log-ish scale by eye)",
      series: [
        { name: "b=2", color: "#7ee787", points: [[1,2],[2,4],[3,8],[4,16],[5,32],[6,64]] },
        { name: "b=3", color: "#ffb454", points: [[1,3],[2,9],[3,27],[4,81],[5,243],[6,729]] },
        { name: "b=4", color: "#ff7b72", points: [[1,4],[2,16],[3,64],[4,256],[5,1024],[6,4096]] }
      ],
      interpret: "<b>Same axes, three branching factors (real b^d numbers).</b> A bigger b (more children per state) lifts and steepens the whole curve: at depth 6, b=2 is 64 states but b=4 is 4096. Read it as a warning: shaving even one option off each state, or cutting the depth, beats any clever traversal order. The lines all explode, just at different speeds."
    },
    {
      type: "bars",
      title: "Memory held at once: BFS vs DFS vs iterative deepening (b=2, d=4)",
      labels: ["BFS (whole level)", "DFS (one path)", "Iterative deepening"],
      values: [16, 4, 4],
      valueLabels: ["~16", "~4", "~4"],
      colors: ["#ff7b72", "#7ee787", "#4ea1ff"],
      interpret: "<b>Each bar is how many states the algorithm must keep in memory at once</b> for a tree with b=2 and the goal at depth 4 (illustrative counts). BFS must hold a whole frontier level, O(b^d), the tall red bar. DFS holds only the current path, O(d), the short green bar. Iterative deepening matches DFS's tiny memory yet still finds the shallowest goal first, the best of both, which is why it is the default for deep trees of unknown depth."
    },
    {
      type: "line",
      title: "Failure mode: DFS dives down a wrong, very deep branch",
      xlabel: "search step",
      ylabel: "depth of the state DFS is currently at",
      series: [
        { name: "DFS depth over time", color: "#ff7b72", points: [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8]] },
        { name: "goal is at depth 2 (other branch)", color: "#7ee787", points: [[0,2],[8,2]] }
      ],
      interpret: "<b>Illustrative.</b> x = search step, y = how deep DFS currently is. The red line keeps climbing: DFS commits to one branch and keeps going deeper. The flat green line marks a shallow goal sitting on a different branch at depth 2. DFS sails right past it and may never come back if the branch is infinite. The fix is a depth limit or iterative deepening, so depth resets and the shallow goal is found."
    }
  ],
  code: "// States to explore at the deepest level grow as b^d.\n// One extra level of depth multiplies the work by b.\nfunction statesAtDepth(b, d) {\n  return Math.pow(b, d);\n}\n\nfor (var d = 1; d <= 8; d++) {\n  console.log('depth ' + d + ': ' + statesAtDepth(2, d) + ' states');\n}\n// depth 1: 2 ... depth 8: 256  -> the b^d blowup"
};

window.CODEVIZ["ai-graph-search"] = {
  question: "Why does remembering solved states turn an exploding tree into a manageable graph, and how does UCS settle nodes in order of cheapest cost?",
  caption: "Graph search solves each state once and reuses it. UCS always pulls the cheapest frontier node next, so the cost at which each node settles only ever rises, exactly like Dijkstra.",
  charts: [
    {
      type: "bars",
      title: "UCS settles nodes in increasing cost order (the example graph)",
      labels: ["S", "A", "C", "B", "G"],
      values: [0, 1, 3, 3, 5],
      valueLabels: ["0", "1", "3", "3", "5"],
      colors: ["#9aa7b4", "#7ee787", "#7ee787", "#7ee787", "#4ea1ff"],
      interpret: "<b>Each bar is a node; its height is the cheapest cost found to reach it (PastCost), in the order UCS settles them.</b> These are the real costs from the lesson's graph: S=0, then A=1, then C and B at 3, then the goal G at 5. The heights never decrease, that is the key UCS guarantee: once you pop a node it has its final shortest cost, so the first time you pop the goal you are done."
    },
    {
      type: "line",
      title: "Why remember states: tree search re-expands, graph search does not",
      xlabel: "states reachable (problem size)",
      ylabel: "states actually expanded",
      series: [
        { name: "tree search (revisits, ~2^n)", color: "#ff7b72", points: [[1,2],[2,4],[3,8],[4,16],[5,32],[6,64]] },
        { name: "graph search (each once, n)", color: "#7ee787", points: [[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]] }
      ],
      interpret: "<b>x = how many distinct states exist; y = how many expansions the search actually does.</b> Illustrative shapes. Tree search (red) re-reaches the same state along many paths, so its work explodes exponentially. Graph search (green) keeps a closed set and touches each state once, so its work is a flat line. The gap between the two curves is exactly what the visited-set buys you."
    },
    {
      type: "line",
      title: "DP needs an acyclic graph: future-cost recursion that never bottoms out",
      xlabel: "recursion step",
      ylabel: "value of FutureCost being computed (diverging)",
      series: [
        { name: "acyclic: FutureCost converges", color: "#7ee787", points: [[0,3],[1,3],[2,3],[3,3],[4,3]] },
        { name: "has a cycle: recursion never settles", color: "#ff7b72", points: [[0,3],[1,5],[2,8],[3,12],[4,17]] }
      ],
      interpret: "<b>Illustrative.</b> x = depth of the recursive future-cost computation; y = the value it is trying to pin down. On an acyclic graph (green) the recursion bottoms out and FutureCost(s) settles to a fixed number. Add a cycle (red) and a state depends on itself: the recursion keeps unrolling and the value never settles. This is why dynamic programming requires a DAG; for graphs with loops you must use UCS instead."
    },
    {
      type: "line",
      title: "Failure mode: a negative edge breaks UCS / Dijkstra",
      xlabel: "order nodes are settled",
      ylabel: "cost claimed when settled vs true shortest cost",
      series: [
        { name: "cost UCS commits to (settle order)", color: "#ff7b72", points: [[1,2],[2,5],[3,6]] },
        { name: "true shortest cost (via a later -4 edge)", color: "#7ee787", points: [[1,2],[2,1],[3,6]] }
      ],
      interpret: "<b>Illustrative.</b> x = the order UCS settles nodes; y = cost. UCS settles a node (red) the moment it is the cheapest on the frontier, assuming no later path can beat it. But a negative edge discovered afterward (green dips below red at step 2) would have made that node cheaper, and UCS already locked it in wrong. The fix: when edges can be negative, drop Dijkstra/UCS and use Bellman-Ford."
    }
  ],
  code: "// UCS pops the cheapest frontier node each round; the cost it\n// settles each node at only ever rises (Dijkstra's guarantee).\nvar settledCost = { S: 0, A: 1, C: 3, B: 3, G: 5 };\n\nvar order = ['S', 'A', 'C', 'B', 'G'];\nvar prev = -Infinity;\norder.forEach(function (node) {\n  var c = settledCost[node];\n  console.log('settle ' + node + ' at cost ' + c + (c >= prev ? '  (non-decreasing OK)' : '  (BUG)'));\n  prev = c;\n});\n// first time we pop G (cost 5) it is final -> shortest path found"
};

window.CODEVIZ["ai-astar"] = {
  question: "Two searches, same map and same goal — why does A* color in a thin corridor while UCS floods half the grid?",
  charts: [
    {
      type: "scatter",
      title: "Ideal A*: an admissible heuristic expands a thin corridor toward the goal",
      xlabel: "grid column (x)",
      ylabel: "grid row (y)",
      groups: [
        { name: "start", color: "#4ea1ff", points: [[1, 2]] },
        { name: "goal", color: "#ffb454", points: [[5, 2]] },
        { name: "A* expanded", color: "#7ee787", points: [[1,2],[2,2],[3,2],[4,2],[5,2],[2,1],[2,3],[3,1],[3,3],[4,1],[4,3]] }
      ],
      interpret: "<b>Real cells</b> from the lesson grid (start at column 1, goal at column 5, same row 2). The axes are grid position; each green dot is a state A* actually expanded. A* ranks cells by <b>f = g + h</b> (steps paid so far plus the straight-line guess to the goal), so it only opens cells near the lowest-f corridor between start and goal. Read it as: the heuristic <i>pulls</i> the search toward the orange goal, so most of the map is never touched."
    },
    {
      type: "scatter",
      title: "Plain UCS (h = 0): floods outward in a circle, ignoring the goal",
      xlabel: "grid column (x)",
      ylabel: "grid row (y)",
      groups: [
        { name: "start", color: "#4ea1ff", points: [[1, 2]] },
        { name: "goal", color: "#ffb454", points: [[5, 2]] },
        { name: "UCS expanded", color: "#ff7b72", points: [[1,2],[0,2],[2,2],[1,1],[1,3],[0,1],[0,3],[2,1],[2,3],[1,0],[1,4],[0,0],[0,4],[2,0],[2,4],[3,2],[3,1],[3,3],[3,0],[3,4]] }
      ],
      interpret: "Illustrative. With no heuristic (h = 0), A* degrades back to uniform-cost search: it expands by past cost alone, so the red blob grows as an even circle around the start and even spreads <i>away</i> from the goal (left of column 1). Recognise UCS by this symmetric flood. Conclusion: same optimal path, but far more cells opened — exactly the work a good heuristic saves."
    },
    {
      type: "scatter",
      title: "Greedy best-first (h only): darts at the goal but can take a worse path",
      xlabel: "grid column (x)",
      ylabel: "grid row (y)",
      groups: [
        { name: "start", color: "#4ea1ff", points: [[1, 2]] },
        { name: "goal", color: "#ffb454", points: [[5, 2]] },
        { name: "greedy expanded", color: "#c89bff", points: [[1,2],[2,3],[3,3],[4,3],[4,2],[5,2]] }
      ],
      interpret: "Illustrative. Greedy search ranks cells by <b>h alone</b> (the guess to the goal), ignoring what it has already paid. It rushes straight at the orange goal in a tight line, expanding even fewer cells than A*. The catch: dropping the g term means it can commit to a detour and return a <b>non-optimal</b> path. Recognise it by the bee-line shape with no widening — fast, but no cheapest-path guarantee."
    },
    {
      type: "bars",
      title: "Why f breaks the tie: same g, the heuristic decides (toward-goal vs detour)",
      labels: ["P toward goal", "Q detour"],
      values: [5, 8],
      valueLabels: ["f=5", "f=8"],
      colors: ["#7ee787", "#ff7b72"],
      interpret: "<b>Real numbers</b> from the worked example. Both frontier cells cost the same to reach (g = 2), so plain UCS would treat them as equals. A* adds the heuristic: P has h = 3 (f = 5), Q has h = 6 (f = 8). The shorter green bar wins, so A* expands P first and leaves Q for later. The bar height is f = g + h: lower is expanded sooner. This is the single mechanism that steers every chart above toward the goal."
    }
  ],
  caption: "A* expands states in order of f = g + h. An admissible heuristic h focuses the search into a corridor toward the goal instead of flooding outward like UCS.",
  code: "// A* ranks the frontier by f = g + h on a grid.\n" +
    "// g = Manhattan steps from start, h = Manhattan steps to goal (admissible).\n" +
    "const start = [1, 2], goal = [5, 2];\n" +
    "const g = (r, c) => Math.abs(r - start[0]) + Math.abs(c - start[1]);\n" +
    "const h = (r, c) => Math.abs(r - goal[0]) + Math.abs(c - goal[1]);\n" +
    "const f = (r, c) => g(r, c) + h(r, c);\n" +
    "// Two frontier cells with the SAME past cost g = 2:\n" +
    "const P = [2, 3];   // a step toward the goal\n" +
    "const Q = [2, 0];   // a step away (detour)\n" +
    "console.log('f(P) =', f(...P));   // 5  -> expanded first\n" +
    "console.log('f(Q) =', f(...Q));   // 8  -> left for later\n" +
    "// The lowest-f cells form a corridor from start to goal,\n" +
    "// so A* opens far fewer states than UCS (which uses g only)."
};

window.CODEVIZ["ai-mdp"] = {
  question: "You tell the robot 'go right' — so why does planning need a bar chart of where it might actually land?",
  charts: [
    {
      type: "bars",
      title: "Valid transition: outcomes of 'right' sum to 1",
      labels: ["lands right (0.8)", "slips up (0.2)"],
      values: [0.8, 0.2],
      valueLabels: ["0.80", "0.20"],
      colors: ["#7ee787", "#9aa7b4"],
      interpret: "<b>Real numbers</b> from the lesson. The bars are the transition probabilities T(s, right, s') — the chance the action 'right' lands the robot in each next state. The intended outcome (lands right) gets 0.8; the slip (goes up) gets 0.2. They <b>must add to 1</b> (0.8 + 0.2 = 1) because something has to happen. Read any MDP action this way: a whole bar chart of maybes, not one certain arrow."
    },
    {
      type: "bars",
      title: "Cost of randomness: expected reward of 'right' is 4, not 5",
      labels: ["if it always worked", "expected (with the odds)"],
      values: [5, 4],
      valueLabels: ["5.0", "4.0"],
      colors: ["#9aa7b4", "#ffb454"],
      interpret: "<b>Real numbers</b> from the worked example. The grey bar is the naive reward you'd assume if 'right' always succeeded (+5). The orange bar is the <b>expected</b> reward once you weight by the odds: 0.8×5 + 0.2×0 = 4. The agent must plan with the orange bar. The gap between 5 and 4 is exactly the price of the action's unreliability — ignore it and your plan is too optimistic."
    },
    {
      type: "bars",
      title: "Broken MDP: outcomes sum to 1.1, not 1",
      labels: ["lands right (0.9)", "slips up (0.2)"],
      values: [0.9, 0.2],
      valueLabels: ["0.90", "0.20"],
      colors: ["#ff7b72", "#ff7b72"],
      interpret: "Illustrative failure case. Here the transition table is mis-specified: 0.9 + 0.2 = 1.1, so it is <b>not a valid probability distribution</b>. Recognise it whenever an action's bars don't sum to exactly 1 (over or under). Conclusion: every value and policy computed from this row is corrupted — re-normalize the transitions before doing anything else."
    },
    {
      type: "line",
      title: "Discount γ shrinks future rewards (a +10 reward, by the step it arrives)",
      xlabel: "step the reward arrives",
      ylabel: "discounted value of a +10 reward",
      series: [
        { name: "patient γ = 0.9", color: "#7ee787", points: [[1,10],[2,9],[3,8.1],[4,7.29],[5,6.56],[6,5.9]] },
        { name: "balanced γ = 0.5", color: "#4ea1ff", points: [[1,10],[2,5],[3,2.5],[4,1.25],[5,0.63],[6,0.31]] },
        { name: "myopic γ = 0.2", color: "#ffb454", points: [[1,10],[2,2],[3,0.4],[4,0.08],[5,0.02],[6,0]] }
      ],
      interpret: "Illustrative, computed from value = 10·γ^(step−1). The x-axis is how many steps away a +10 reward is; the y-axis is what it's worth <i>now</i>. All lines start at 10 (a reward this step counts fully) and decay. A <b>high γ (green, 0.9)</b> stays flat — the agent is patient and values the far future. A <b>low γ (orange, 0.2)</b> crashes to near zero — the agent is myopic and only cares about the next reward. Pick γ to match how far ahead you truly need to plan."
    }
  ],
  caption: "An MDP action is a probability distribution over next states (summing to 1); the agent plans on expected reward, discounting future rewards by γ.",
  code: "// An MDP action 'right' is a distribution over next states.\n" +
    "const T = { rightCell: 0.8, upCell: 0.2 };   // transition probs\n" +
    "const total = Object.values(T).reduce((a, b) => a + b, 0);\n" +
    "console.log('sum =', total);                 // 1  -> valid\n" +
    "\n" +
    "// Rewards for each outcome:\n" +
    "const reward = { rightCell: 5, upCell: 0 };\n" +
    "// Plan with the EXPECTED reward, weighting by the odds:\n" +
    "let expected = 0;\n" +
    "for (const s in T) expected += T[s] * reward[s];\n" +
    "console.log('expected =', expected);         // 4, not 5\n" +
    "\n" +
    "// Discounting: a +10 reward 'step' moves away loses value.\n" +
    "const gamma = 0.5;\n" +
    "for (let step = 1; step <= 4; step++)\n" +
    "  console.log(step, 10 * Math.pow(gamma, step - 1));  // 10, 5, 2.5, 1.25"
};

window.CODEVIZ["ai-policy-value"] = {
  question: "A policy's value is the discounted sum of the rewards it earns — how do you read that sum off a bar chart, and how does the discount reshape it?",
  charts: [
    {
      type: "bars",
      title: "Ideal: discounted reward stream, value V = 17.5 (gamma = 0.5)",
      labels: ["step 1", "step 2", "step 3"],
      values: [10, 5, 2.5],
      valueLabels: ["10", "5", "2.5"],
      colors: ["#7ee787", "#7ee787", "#7ee787"],
      interpret: "<b>Real numbers</b> from the lesson: the policy earns reward 10 at every step, with discount gamma = 0.5. The x-axis is the step number; each bar's height is that step's reward AFTER discounting (step i is scaled by gamma to the power i-1). Step 1 keeps its full 10, step 2 shrinks to 10 times 0.5 = 5, step 3 to 10 times 0.25 = 2.5. The <b>value of the policy is the total height</b>, 10 + 5 + 2.5 = 17.5. Read it as: later rewards count for less, so the bars shrink left-to-right and the running total flattens out."
    },
    {
      type: "bars",
      title: "Variant: patient agent, gamma = 0.9 — bars barely shrink (illustrative)",
      labels: ["step 1", "step 2", "step 3", "step 4", "step 5"],
      values: [10, 9, 8.1, 7.29, 6.56],
      valueLabels: ["10", "9", "8.1", "7.29", "6.56"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"],
      interpret: "Same reward 10 each step, but a discount close to 1 (gamma = 0.9). Because the discount is gentle, the bars fall off slowly and far-off rewards still matter a lot — the value keeps climbing as you add more steps (here already 40.95 over five). Recognise a <b>patient / far-sighted</b> policy by this slow taper: the agent will accept short-term cost for long-term payoff. Watch out — with gamma near 1 and no end, the sum can grow without limit."
    },
    {
      type: "bars",
      title: "Variant: myopic agent, gamma = 0.2 — only step 1 matters (illustrative)",
      labels: ["step 1", "step 2", "step 3", "step 4", "step 5"],
      values: [10, 2, 0.4, 0.08, 0.016],
      valueLabels: ["10", "2", "0.4", "0.08", "~0"],
      colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"],
      interpret: "Same rewards again, but a tiny discount (gamma = 0.2) crushes everything past the first step almost to zero. The value (about 12.5) is dominated by the immediate reward. Recognise a <b>short-sighted / greedy</b> policy by bars that vanish after the first one or two: such an agent ignores the future, which is fine for quick payoffs but blind to a goal that takes many steps to reach."
    },
    {
      type: "bars",
      title: "Variant: a late penalty drags the value down (illustrative)",
      labels: ["step 1", "step 2", "step 3", "step 4"],
      values: [8, 2.5, -3, -3.5],
      valueLabels: ["+8", "+2.5", "-3", "-3.5"],
      colors: ["#7ee787", "#7ee787", "#ff7b72", "#ff7b72"],
      interpret: "Here the policy collects reward early then walks into a penalty later (negative discounted rewards, in red). The value is still the signed total of the bars, 8 + 2.5 - 3 - 3.5 = 4 — much lower than the early steps suggested. The lesson is that <b>value averages over the whole future, good and bad</b>: a plan that looks great for two steps can be a poor policy once a downstream penalty is counted. Always read the full stream, not just the leading bars."
    }
  ],
  caption: "A policy's value is the discounted sum of its rewards; each bar is one step's reward after the gamma-to-the-i-1 discount, and the total height is V.",
  code: "// Value of a policy = discounted sum of its reward stream\n" +
    "const rewards = [10, 10, 10];   // reward at each step under the policy\n" +
    "const gamma = 0.5;              // discount: later rewards count less\n" +
    "let value = 0;\n" +
    "const bars = [];\n" +
    "for (let i = 0; i < rewards.length; i++) {\n" +
    "  const discounted = rewards[i] * Math.pow(gamma, i);  // gamma^(i-1), i is 0-based here\n" +
    "  bars.push(discounted);        // [10, 5, 2.5]\n" +
    "  value += discounted;\n" +
    "}\n" +
    "console.log(bars);              // [10, 5, 2.5]\n" +
    "console.log(value);             // 17.5"
};

window.CODEVIZ["ai-qvalue"] = {
  question: "A Q-value averages reward-plus-future over every place an action might land you — how do you read those weighted outcomes off a bar chart, and how do you compare actions?",
  charts: [
    {
      type: "bars",
      title: "Ideal: Q(s,a) = 8 as a sum of two weighted outcomes",
      labels: ["80%: r=5, V=10", "20%: r=0, V=0", "Q = total"],
      values: [8, 0, 8],
      valueLabels: ["8", "0", "8"],
      colors: ["#7ee787", "#9aa7b4", "#4ea1ff"],
      interpret: "<b>Real numbers</b> from the lesson, gamma = 0.5. Action a has two possible next states. For each, the contribution is probability times (reward + gamma times next-state value). Good outcome (80%): 0.8 times (5 + 0.5 times 10) = 0.8 times 10 = 8. Bad outcome (20%): 0.2 times (0 + 0) = 0. The <b>Q-value is the sum of the outcome bars</b>, 8 + 0 = 8 (blue). Read it as: the Q-value already folds in HOW LIKELY each landing is — the rare bad outcome barely dents the average here."
    },
    {
      type: "bars",
      title: "Compare actions: pick argmax over Q (illustrative)",
      labels: ["action up", "action right", "action down", "action left"],
      values: [8, 6.4, 3.1, 5.2],
      valueLabels: ["8", "6.4", "3.1", "5.2"],
      colors: ["#7ee787", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
      interpret: "Illustrative. One bar per action available in the SAME state s; each height is that action's Q-value. The agent acts greedily by taking the <b>tallest bar</b> — argmax over a of Q(s,a) — here 'up' with Q = 8. This is what a Q-value is FOR: a state value V(s) tells you a position is worth 8, but these per-action bars tell you WHICH move achieves it. Read the chart as a menu: the best action is simply the highest one."
    },
    {
      type: "bars",
      title: "Variant: a risky action — high mean Q hides a catastrophe (illustrative)",
      labels: ["90%: small win", "10%: disaster", "Q (mean)"],
      values: [9, -8, 1],
      valueLabels: ["+9", "-8", "+1"],
      colors: ["#7ee787", "#ff7b72", "#ffb454"],
      interpret: "Illustrative. The Q-value is still the signed sum of the weighted outcomes: a likely small win contributes +9 but a rare disaster contributes -8, leaving Q = +1 (orange). The danger is that this single averaged number <b>hides the spread</b>: 10% of the time this action is catastrophic. A Q-value answers 'what is the expected return', not 'how risky is it' — when a tall positive bar sits next to a deep red one, the average alone is not enough to act safely."
    },
    {
      type: "bars",
      title: "Variant: deterministic action — one outcome, probability 1 (illustrative)",
      labels: ["100%: r=6, V=4", "Q = total"],
      values: [8, 8],
      valueLabels: ["8", "8"],
      colors: ["#9aa7b4", "#4ea1ff"],
      interpret: "From the quiz: a single certain outcome, gamma = 0.5. With probability 1 the action gives reward 6 then a next-state worth 4, so Q = 1 times (6 + 0.5 times 4) = 6 + 2 = 8. When there is only one possible landing, the sum-over-next-states collapses to a single term and the Q-value is just reward + discounted future value. Recognise the <b>deterministic</b> case by a single full-height outcome bar — no averaging is needed, the world is certain."
    }
  ],
  caption: "Q(s,a) sums probability times (reward + gamma times next-state value) over every possible next state; each bar is one outcome's contribution and the total is the Q-value.",
  code: "// Q-value: average reward+future over every possible next state\n" +
    "const gamma = 0.5;\n" +
    "// each outcome: [probability T, immediate reward, next-state value V]\n" +
    "const outcomes = [\n" +
    "  [0.8, 5, 10],   // 80% chance: reward 5, land in a state worth 10\n" +
    "  [0.2, 0, 0],    // 20% chance: reward 0, land in a state worth 0\n" +
    "];\n" +
    "let Q = 0;\n" +
    "const bars = [];\n" +
    "for (const [T, reward, vNext] of outcomes) {\n" +
    "  const term = T * (reward + gamma * vNext);  // weighted contribution\n" +
    "  bars.push(term);             // [8, 0]\n" +
    "  Q += term;\n" +
    "}\n" +
    "console.log(bars);             // [8, 0]\n" +
    "console.log(Q);                // 8"
};

window.CODEVIZ["ai-value-iteration"] = {
  question: "How do you know value iteration has converged — and what does failing to converge look like?",
  charts: [
    {
      type: "line",
      title: "Healthy convergence: Bellman residual decays to zero",
      xlabel: "sweep number",
      ylabel: "max change in V across all states",
      series: [
        { name: "max |V_new - V_old|", color: "#7ee787", points: [[0, 8.00], [1, 7.20], [2, 5.18], [3, 3.30], [4, 1.88], [5, 1.05], [6, 0.55], [7, 0.27], [8, 0.13], [9, 0.06], [10, 0.025]] }
      ],
      interpret: "The x-axis is the sweep count; the y-axis is the largest change any single state's value made this sweep (the <b>Bellman residual</b>). Each sweep the values move less, and the green curve falls toward zero. Once it drops below a tiny threshold (here ~0.01) the values have stopped moving and the greedy policy is optimal: <b>stop here</b>. Numbers are illustrative of a small gridworld with discount 0.9."
    },
    {
      type: "line",
      title: "Slow convergence: discount near 1 (gamma = 0.99)",
      xlabel: "sweep number",
      ylabel: "max change in V across all states",
      series: [
        { name: "gamma = 0.90 (fast)", color: "#7ee787", points: [[0, 8], [2, 5.18], [4, 1.88], [6, 0.55], [8, 0.13], [10, 0.025]] },
        { name: "gamma = 0.99 (slow)", color: "#ffb454", points: [[0, 8], [2, 7.1], [4, 6.2], [6, 5.4], [8, 4.7], [10, 4.1], [14, 3.1], [18, 2.3], [22, 1.7], [26, 1.3]] }
      ],
      interpret: "Same residual axis, two discount factors. The orange curve (gamma 0.99) decays far more slowly because each sweep only shrinks the residual by a factor near gamma, so a discount close to 1 needs many more sweeps to settle. If you cut off at sweep 10 here you would stop with a residual of ~4, a wrong policy. Recognise it by a residual that <b>keeps falling but very gradually</b>; fix by iterating longer or lowering gamma. Illustrative."
    },
    {
      type: "line",
      title: "Never converges: gamma = 1 with no terminal state",
      xlabel: "sweep number",
      ylabel: "max change in V across all states",
      series: [
        { name: "residual stays flat / grows", color: "#ff7b72", points: [[0, 1.0], [1, 1.0], [2, 1.0], [3, 1.0], [4, 1.0], [5, 1.0], [6, 1.0], [7, 1.0], [8, 1.0], [9, 1.0], [10, 1.0]] }
      ],
      interpret: "Here the residual never shrinks: every sweep changes V by the same amount forever. With discount = 1 and no guaranteed episode end, the value sum has nothing to anchor it, so the backups never settle. Recognise it by a residual that is <b>flat or climbing instead of decaying</b> — the values diverge. Fix by keeping gamma strictly below 1 or ensuring every path reaches a terminal state. Illustrative."
    },
    {
      type: "heatmap",
      title: "Converged value map: V(s) spreads out from the goal",
      rows: ["row 0", "row 1", "row 2"],
      cols: ["col 0", "col 1", "col 2", "col 3 (goal/pit)"],
      matrix: [
        [0.51, 0.65, 0.80, 1.00],
        [0.40, 0.00, 0.55, -1.00],
        [0.31, 0.34, 0.43, 0.18]
      ],
      showVals: true,
      interpret: "Each cell is the converged value V(s) of standing in that grid square; greener/larger means a higher expected reward-to-go. The +1 goal at top-right and the -1 pit just below it are the anchors, and value <b>bleeds outward</b> so cells nearer the goal are worth more. The blank center cell is a wall (0). Reading the gradient tells you the optimal policy: always step toward the higher neighbour. Numbers illustrate a converged 3x4 gridworld with discount 0.9."
    }
  ],
  caption: "Watch the Bellman residual (the largest value change per sweep): healthy value iteration drives it to zero.",
  code: "// Track the Bellman residual each sweep; stop when it is tiny.\n" +
    "function valueIteration(states, actions, R, T, gamma, tol) {\n" +
    "  const V = {}; states.forEach(s => V[s] = 0);\n" +
    "  const residuals = [];\n" +
    "  for (let sweep = 0; sweep < 1000; sweep++) {\n" +
    "    let delta = 0;\n" +
    "    const Vnew = {};\n" +
    "    for (const s of states) {\n" +
    "      let best = -Infinity;\n" +
    "      for (const a of actions(s)) {\n" +
    "        let q = 0;\n" +
    "        for (const [sp, p] of T(s, a)) q += p * (R(s, a, sp) + gamma * V[sp]);\n" +
    "        if (q > best) best = q;\n" +
    "      }\n" +
    "      Vnew[s] = best;\n" +
    "      delta = Math.max(delta, Math.abs(Vnew[s] - V[s]));\n" +
    "    }\n" +
    "    Object.assign(V, Vnew);\n" +
    "    residuals.push(delta);          // this is the y-axis of the line chart\n" +
    "    if (delta < tol) break;         // converged: residual below threshold\n" +
    "  }\n" +
    "  return { V, residuals };\n" +
    "}\n"
};

window.CODEVIZ["ai-q-learning"] = {
  question: "How do you read a Q-learning training curve — and spot when exploration or the learning rate is wrong?",
  charts: [
    {
      type: "line",
      title: "Healthy learning: noisy reward per episode climbs and settles",
      xlabel: "training episode",
      ylabel: "total reward collected in the episode",
      series: [
        { name: "reward per episode", color: "#7ee787", points: [[0, -22], [20, -8], [40, 3], [60, 14], [80, 21], [100, 26], [120, 29], [140, 30], [160, 31], [180, 30], [200, 31]] }
      ],
      interpret: "The x-axis is the episode number; the y-axis is the reward the agent gathered that episode. The green curve <b>rises then flattens</b>: early on the agent wanders and scores poorly, then as its Q-estimates improve it reaches the goal more reliably and reward climbs to a plateau. Small wiggles near the top are exploration (epsilon-greedy occasionally tries a random move). Read a plateau at a good reward as 'learned'. Illustrative of the gridworld."
    },
    {
      type: "line",
      title: "No exploration: agent gets stuck on a mediocre habit",
      xlabel: "training episode",
      ylabel: "total reward collected in the episode",
      series: [
        { name: "healthy (epsilon-greedy)", color: "#7ee787", points: [[0, -22], [40, 3], [80, 21], [120, 29], [160, 31], [200, 31]] },
        { name: "epsilon = 0 (pure greedy)", color: "#ff7b72", points: [[0, -22], [20, -6], [40, 2], [60, 6], [80, 8], [100, 8], [140, 8], [180, 8], [200, 8]] }
      ],
      interpret: "Same axes. The red curve climbs a little then <b>flattens far below</b> the green one: with epsilon = 0 the agent always repeats its current best action, so it locks onto the first decent route it found and never discovers the better path. Recognise this failure by an early plateau at a clearly suboptimal reward. Fix it with epsilon-greedy exploration that decays over time. Illustrative."
    },
    {
      type: "line",
      title: "Learning rate too high / never decayed: reward oscillates",
      xlabel: "training episode",
      ylabel: "total reward collected in the episode",
      series: [
        { name: "fixed large eta = 0.9", color: "#ffb454", points: [[0, -20], [20, 5], [40, 24], [60, 9], [80, 28], [100, 6], [120, 27], [140, 11], [160, 29], [180, 8], [200, 26]] }
      ],
      interpret: "Here the reward jumps up and down forever instead of settling. A large, never-shrinking learning rate makes each update overwrite most of the old Q-estimate with one noisy observation, so the values <b>bounce around the true answer</b> rather than converging. Recognise it by a curve that stays jagged with no narrowing band. Fix by decaying eta as state-action pairs are visited more. Illustrative."
    },
    {
      type: "line",
      title: "Sparse / delayed reward: long flat start, then slow rise",
      xlabel: "training episode",
      ylabel: "total reward collected in the episode",
      series: [
        { name: "reward only at the goal", color: "#c89bff", points: [[0, 0], [40, 0], [80, 0.5], [120, 2], [160, 5], [200, 9], [260, 16], [320, 22], [380, 27], [440, 30]] }
      ],
      interpret: "When reward arrives only at the very end, credit propagates just one step back per visit, so the curve stays <b>flat for a long time</b> before slowly lifting — learning crawls rather than fails. Recognise it by a long zero/near-zero plateau followed by a late, gradual climb (note the stretched x-axis). Speed it up with reward shaping or eligibility traces. Illustrative."
    }
  ],
  caption: "Plot reward per episode: healthy Q-learning rises to a plateau; the shape of the curve reveals exploration and learning-rate problems.",
  code: "// Tabular Q-learning; record total reward each episode for the curve.\n" +
    "function qLearn(env, episodes, gamma, eta, epsilon) {\n" +
    "  const Q = {};                 // Q[state][action]\n" +
    "  const q = (s, a) => ((Q[s] || (Q[s] = {}))[a] || 0);\n" +
    "  const rewards = [];\n" +
    "  for (let ep = 0; ep < episodes; ep++) {\n" +
    "    let s = env.reset(), total = 0, done = false;\n" +
    "    while (!done) {\n" +
    "      const acts = env.actions(s);\n" +
    "      // epsilon-greedy: explore a random action, else exploit the best known\n" +
    "      let a;\n" +
    "      if (Math.random() < epsilon) a = acts[Math.floor(Math.random() * acts.length)];\n" +
    "      else a = acts.reduce((b, x) => q(s, x) > q(s, b) ? x : b, acts[0]);\n" +
    "      const { sp, r, done: d } = env.step(s, a);\n" +
    "      const bestNext = env.actions(sp).reduce((m, x) => Math.max(m, q(sp, x)), 0);\n" +
    "      const target = r + gamma * bestNext;\n" +
    "      Q[s][a] = (1 - eta) * q(s, a) + eta * target;   // the blend update\n" +
    "      total += r; s = sp; done = d;\n" +
    "    }\n" +
    "    rewards.push(total);          // this is the y-axis of the line chart\n" +
    "  }\n" +
    "  return { Q, rewards };\n" +
    "}\n"
};

window.CODEVIZ["ai-minimax"] = {
  question: "In a tic-tac-toe position where O threatens to win, which square should X play?",
  charts: [
    {
      type: "bars",
      title: "Ideal: minimax value of each X move (O threatens the top row)",
      labels: ["sq 2 (block)", "sq 3", "sq 5", "sq 6", "sq 7", "sq 8"],
      values: [0, -1, -1, -1, -1, -1],
      valueLabels: ["0 draw", "-1 loss", "-1 loss", "-1 loss", "-1 loss", "-1 loss"],
      colors: ["#7ee787", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "Each bar is one move X can make; the height is the minimax value of that move assuming O then plays perfectly. Higher is better for X (+1 = win, 0 = draw, -1 = loss). Only the green bar (block at square 2) reaches 0 (a draw); every other bar sits at -1 (a forced loss). <b>Read it as: pick the tallest bar.</b> When one move clearly tops the rest, that is the safe play minimax recommends."
    },
    {
      type: "bars",
      title: "Variant: value flowing up the tree (max of the opponent's mins)",
      series: [{ name: "value", color: "#4ea1ff", points: [[0, 3], [1, 2]] }],
      labels: ["Branch A: min(3,8)=3", "Branch B: min(5,2)=2"],
      interpret: "Illustrative. This is the worked example from the lesson, one level up the tree. X picks between branch A and branch B; under each, the opponent (min) already took the worst-for-you child, so branch A is worth 3 and branch B is worth 2. <b>X takes the max of these: max(3,2)=3, so play A.</b> The pattern to recognise: opponent nodes pull each branch DOWN to its smallest child, then your node picks the LARGEST of what survived."
    },
    {
      type: "bars",
      title: "Variant: a winning position (one move forces a win)",
      labels: ["sq 6 (win)", "sq 3", "sq 5", "sq 7"],
      values: [1, 0, -1, 0],
      valueLabels: ["+1 win", "0 draw", "-1 loss", "0 draw"],
      colors: ["#7ee787", "#9aa7b4", "#ff7b72", "#9aa7b4"],
      interpret: "Illustrative. Here the bars are not all flat at -1: one move reaches +1 (a forced win), some draw (0), one loses (-1). When a +1 bar exists, X has a guaranteed win and minimax will always take it. <b>The shape tells you the position's character:</b> a lone tall +1 means 'winning move available', a sea of -1 means 'losing no matter what', a mix of 0s means 'best you can force is a draw'."
    },
    {
      type: "bars",
      title: "Variant: perfect opponent (minimax) vs a blundering one",
      series: [
        { name: "minimax (assumes perfect O)", color: "#9aa7b4", points: [[0, 0], [1, -1]] },
        { name: "if O sometimes blunders", color: "#ffb454", points: [[0, 0], [1, 0.4]] }
      ],
      labels: ["safe move (block)", "risky move (set a trap)"],
      interpret: "Illustrative. Minimax (grey) assumes O always finds the best reply, so a 'trap' move that only works if O slips is scored as a loss (-1) and never chosen. Against a real, imperfect opponent (orange) that same move has positive expected value. <b>The gap warns you:</b> minimax is safe but pessimistic; when you KNOW the opponent is weak or random, its worst-case scores leave easy value on the table, and you should switch to expectimax."
    }
  ],
  caption: "Position: O at squares 0,1 (top row) with X in the center. Only square 2 blocks the win and backs up to a draw (0); every other X move loses (-1) to optimal O play.",
  code: `import matplotlib.pyplot as plt

def winner(b):
    lines = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    for a, c, d in lines:
        if b[a] != " " and b[a] == b[c] == b[d]: return b[a]
    return None
def minimax(b, player):
    w = winner(b)
    if w == "X": return 1
    if w == "O": return -1
    if " " not in b: return 0
    vals = [minimax(b[:i]+[player]+b[i+1:], "O" if player=="X" else "X")
            for i in range(9) if b[i] == " "]
    return max(vals) if player == "X" else min(vals)

board = ["O","O"," "," ","X"," "," "," "," "]   # O threatens top row, X to move
moves = [i for i in range(9) if board[i] == " "]
vals = [minimax(board[:i]+["X"]+board[i+1:], "O") for i in moves]
best = moves[int(max(range(len(vals)), key=lambda k: vals[k]))]

fig, ax = plt.subplots(figsize=(8, 4))
cols = ["#7ee787" if i == best else "#ff7b72" for i in moves]
ax.bar([str(i) for i in moves], vals, color=cols)
for k, v in enumerate(vals): ax.text(k, v, str(v), ha="center", va="bottom")
ax.set_title("minimax value of each X move"); ax.set_xlabel("square")
plt.show()`
};

window.CODEVIZ["ai-alpha-beta"] = {
  question: "On that same tic-tac-toe position, how many game positions does alpha-beta skip versus full minimax?",
  charts: [
    {
      type: "bars",
      title: "Ideal: positions examined, alpha-beta vs full minimax",
      labels: ["alpha-beta", "full minimax"],
      values: [75, 935],
      valueLabels: ["75 visited", "935 total"],
      colors: ["#7ee787", "#ffb454"],
      interpret: "Each bar is the number of game positions the algorithm actually looks at to pick the same move. Shorter is better: less work for an identical answer. Alpha-beta (green, 75) examines a small fraction of full minimax (orange, 935) on this position, roughly a 12x saving. <b>Read it as: how much wasted exploration pruning removed.</b> A big gap means lots of branches were provably hopeless and got skipped."
    },
    {
      type: "bars",
      title: "Variant: pruning depends entirely on move ordering",
      labels: ["best-first order", "random order", "worst-first order", "no pruning (minimax)"],
      values: [75, 320, 935, 935],
      valueLabels: ["75", "320", "935", "935"],
      colors: ["#7ee787", "#ffb454", "#ff7b72", "#9aa7b4"],
      interpret: "Illustrative. Same tree, same correct answer every time, but the number of nodes visited swings wildly with the order moves are tried. Trying strong moves first (green) prunes hard; worst-first (red) prunes nothing and matches plain minimax (grey). <b>The takeaway:</b> alpha-beta's speed is not free, it comes from good move ordering. With perfect ordering you reach about b^(d/2) nodes; with bad ordering you save nothing."
    },
    {
      type: "bars",
      title: "Variant: why one branch gets cut (alpha already secured = 5)",
      series: [{ name: "value bound", color: "#4ea1ff", points: [[0, 5], [1, 2]] }],
      labels: ["alpha (secured by A)", "branch B first reply = 2"],
      interpret: "Illustrative, the lesson's worked example. The left bar is alpha = 5: a draw-or-better X has already locked in via branch A. Branch B is an opponent (min) node, and its first reply already returns 2; since min only goes lower, branch B is at most 2. <b>Because 2 < 5, the rest of branch B cannot change the choice, so it is pruned.</b> The trigger to watch for: at a min node, as soon as a child drops to or below alpha, stop, the remaining children are irrelevant."
    },
    {
      type: "bars",
      title: "Variant: same time budget buys deeper search",
      labels: ["minimax depth", "alpha-beta depth"],
      values: [5, 9],
      valueLabels: ["5 plies", "~9 plies"],
      colors: ["#9aa7b4", "#7ee787"],
      interpret: "Illustrative. Pruning does not just save time at a fixed depth, it lets you spend that saved time going deeper. With the same node budget, alpha-beta (green) can search roughly twice as many plies (half-moves) as plain minimax (grey), because it visits about the square root of the nodes per level. <b>Why it matters:</b> deeper search means better play, which is exactly how alpha-beta made strong chess engines like Deep Blue practical."
    }
  ],
  caption: "Searching the same 'X must block' position, alpha-beta reaches the identical move (block at square 2) while examining only 75 of the 935 reachable positions — pruning cuts the work roughly 12x.",
  code: `import matplotlib.pyplot as plt

def winner(b):
    lines = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
    for a, c, d in lines:
        if b[a] != " " and b[a] == b[c] == b[d]: return b[a]
    return None
board = ["O","O"," "," ","X"," "," "," "," "]
counts = {"full": 0, "ab": 0}

def full(b, player):
    counts["full"] += 1
    if winner(b) or " " not in b: return
    for i in range(9):
        if b[i] == " ": full(b[:i]+[player]+b[i+1:], "O" if player=="X" else "X")
def ab(b, player, alpha, beta):
    counts["ab"] += 1
    w = winner(b)
    if w == "X": return 1
    if w == "O": return -1
    if " " not in b: return 0
    if player == "X":
        v = -2
        for i in range(9):
            if b[i] == " ":
                v = max(v, ab(b[:i]+["X"]+b[i+1:], "O", alpha, beta)); alpha = max(alpha, v)
                if alpha >= beta: break
        return v
    v = 2
    for i in range(9):
        if b[i] == " ":
            v = min(v, ab(b[:i]+["O"]+b[i+1:], "X", alpha, beta)); beta = min(beta, v)
            if alpha >= beta: break
    return v

full(board, "X"); ab(board, "X", -2, 2)
fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(["alpha-beta","full minimax"], [counts["ab"], counts["full"]],
       color=["#7ee787","#ffb454"])
ax.text(0, counts["ab"], str(counts["ab"]), ha="center", va="bottom")
ax.text(1, counts["full"], str(counts["full"]), ha="center", va="bottom")
ax.set_title("positions examined: alpha-beta vs minimax")
plt.show()`
};

window.CODEVIZ["ai-expectimax"] = {
  question: "When the other side rolls dice instead of playing to win, do you fear the worst case or average it?",
  code: `// Expectimax: a chance node AVERAGES its children (weighted by probability);
// minimax would instead take the WORST child. Compare the two on one node.
const probs  = [0.5, 0.5];   // random opponent picks each reply equally
const values = [8, 2];       // leaf values reached after each reply

// expectimax value of the chance node = sum of prob * value
let expecti = 0;
for (let i = 0; i < values.length; i++) expecti += probs[i] * values[i];

// minimax value = the worst (minimum) child, as if the opponent were perfect
const mini = Math.min(...values);

console.log("expectimax", expecti);  // 0.5*8 + 0.5*2 = 5
console.log("minimax   ", mini);     // min(8,2) = 2`,
  caption: "At a chance node expectimax averages the children; minimax takes the worst. Averaging is higher when outcomes vary.",
  charts: [
    {
      type: "bars",
      title: "Ideal: chance node value is the probability-weighted average of its children",
      labels: ["leaf 8 (p=0.5)", "leaf 2 (p=0.5)", "EXPECTIMAX = avg", "minimax = worst"],
      values: [8, 2, 5, 2],
      valueLabels: ["8", "2", "5.0", "2"],
      colors: ["#9aa7b4", "#9aa7b4", "#7ee787", "#ffb454"],
      interpret: "Each bar is a value (height = how good for you). The two grey bars are the leaf outcomes a random opponent reaches with probability 0.5 each. The green bar is the expectimax value of the chance node: <b>0.5x8 + 0.5x2 = 5</b>, sitting between the two outcomes because it is their average. The orange bar is what minimax would report, the worst child (2). Read it as: against a coin-flipping opponent you should expect <b>5</b>, not the pessimistic <b>2</b>."
    },
    {
      type: "bars",
      title: "Minimax under-rates a random opponent: leaves money on the table (illustrative)",
      labels: ["safe move", "risky move (expectimax)", "risky move (minimax)"],
      values: [4, 5, 0],
      valueLabels: ["4", "5.0", "0"],
      colors: ["#4ea1ff", "#7ee787", "#ff7b72"],
      interpret: "Illustrative. A risky move leads to a chance node worth 10 or 0 with equal odds. Expectimax values it at <b>5</b> (green) and so prefers it over the safe move worth 4 (blue). Minimax values the same risky move at its worst child, <b>0</b> (red), and wrongly rejects it. When the other side is truly random, assuming the worst case throws away the better expected play."
    },
    {
      type: "bars",
      title: "Wrong model the other way: expectimax over-trusts a real adversary (illustrative)",
      labels: ["true value vs a sharp opponent", "expectimax's optimistic estimate"],
      values: [2, 5],
      valueLabels: ["2", "5.0"],
      colors: ["#7ee787", "#ff7b72"],
      interpret: "Illustrative. Same node, but now the opponent is a strong player who will steer you to the worst child (value 2, green). Expectimax still averages and reports an optimistic <b>5</b> (red) because it assumes randomness. The gap between the two bars is exploitable: a clever opponent collapses you toward the low outcome. The lesson is to match the node type to reality, average only for genuine chance, minimize for a real adversary."
    }
  ]
};

window.CODEVIZ["ai-csp"] = {
  question: "How do you tell at a glance whether an assignment satisfies every rule, or quietly breaks one?",
  code: `// Map colouring CSP: each "neighbours must differ" rule is a 0/1 factor.
// Weight(assignment) = product of all factors. One zero kills the whole thing.
const edges = [["A","B"],["A","C"],["B","C"],["B","D"],["C","D"]];
const colour = { A:"Red", B:"Green", C:"Blue", D:"Red" };  // an assignment

let weight = 1;
for (const [u, v] of edges) {
  const factor = (colour[u] !== colour[v]) ? 1 : 0;  // differ? 1 : 0
  weight *= factor;                                  // product of factors
}
console.log("weight", weight);                       // 1 => valid, 0 => broken
console.log(weight > 0 ? "valid solution" : "invalid: a rule is broken");`,
  caption: "Each rule is a 0/1 factor; the assignment's weight is their product. A single zero means the whole assignment fails.",
  charts: [
    {
      type: "bars",
      title: "Ideal: every constraint factor is 1, so the product weight is 1 (solved)",
      labels: ["A!=B", "A!=C", "B!=C", "B!=D", "C!=D", "WEIGHT (product)"],
      values: [1, 1, 1, 1, 1, 1],
      valueLabels: ["1", "1", "1", "1", "1", "1"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#4ea1ff"],
      interpret: "Each green bar is one rule's factor for the assignment A=Red, B=Green, C=Blue, D=Red: it is <b>1</b> when the two neighbours differ. Every adjacent pair has different colours, so all five factors are 1. The blue bar is the total weight, the product 1x1x1x1x1 = <b>1</b>. A weight above zero means every hard constraint holds, this is a valid solution."
    },
    {
      type: "bars",
      title: "One rule broken: a single zero factor drags the whole weight to 0 (invalid)",
      labels: ["A!=B", "A!=C", "B!=C", "B!=D", "C!=D", "WEIGHT (product)"],
      values: [1, 1, 0, 1, 1, 0],
      valueLabels: ["1", "1", "0", "1", "1", "0"],
      colors: ["#7ee787", "#7ee787", "#ff7b72", "#7ee787", "#7ee787", "#ff7b72"],
      interpret: "Illustrative. Now B and C share a colour, so the <b>B!=C</b> factor collapses to <b>0</b> (red). Four factors are still 1, but the weight is a product, so 1x1x<b>0</b>x1x1 = <b>0</b> (red). One broken hard constraint zeroes everything, no matter how many other rules pass. When you see a weight of 0, look for the single red factor, that is your conflict."
    },
    {
      type: "bars",
      title: "Over-constrained: no colouring works, every option has a zero (unsatisfiable, illustrative)",
      labels: ["assign B=Red", "assign B=Green", "assign B=Blue"],
      values: [0, 0, 0],
      valueLabels: ["0", "0", "0"],
      colors: ["#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative. Suppose A, C, and D already use all three colours and B touches all of them. Every colour B could take repeats a neighbour, so the best achievable weight for each choice is <b>0</b> (all red). When a variable's every domain value yields zero, the CSP is <b>unsatisfiable</b>, not just unsolved. The fix is to relax a constraint or report the conflicting set, no amount of search will find a solution."
    }
  ]
};

window.CODEVIZ["ai-csp-search"] = {
  question: "As backtracking assigns colours, how does forward checking shrink the neighbours' domains — and how do you spot a dead end before wasting effort?",
  charts: [
    {
      type: "bars",
      title: "Healthy run: domain sizes after each assignment (5-region map, colours R/G/B)",
      labels: ["A", "B", "C", "D", "E"],
      values: [1, 2, 2, 1, 2],
      valueLabels: ["1 (=R)", "2", "2", "1 (=B)", "2"],
      colors: ["#7ee787", "#9aa7b4", "#9aa7b4", "#7ee787", "#9aa7b4"],
      interpret: "Each bar is how many colours a region still has left after we set A=R and D=B. <b>A and D dropped to 1</b> (assigned, green). Their neighbours lost the used colour, so they sit at 2 (grey, still has choices). <b>No bar is 0</b>, so the partial assignment is still alive — keep going. This is the shape you want: domains shrink but never empty."
    },
    {
      type: "bars",
      title: "Dead end: a domain collapses to 0 — backtrack",
      labels: ["A", "B", "C", "D", "E"],
      values: [1, 1, 0, 1, 2],
      valueLabels: ["1 (=R)", "1 (=G)", "0  EMPTY", "1 (=B)", "2"],
      colors: ["#7ee787", "#7ee787", "#ff7b72", "#7ee787", "#9aa7b4"],
      interpret: "Illustrative. Same chart, but region <b>C has a bar of 0 (red)</b>: forward checking removed its last colour because every option clashes with an already-assigned neighbour. An empty domain means this branch can never finish — <b>undo the most recent assignment and try another value</b>. Seeing a zero bar early is exactly what forward checking buys you: you fail here instead of deep in a doomed sub-tree."
    },
    {
      type: "bars",
      title: "Why variable ordering matters: assignments tried before a solution",
      labels: ["Most-constrained-first", "Naive (fixed) order"],
      values: [12, 47],
      valueLabels: ["12", "47"],
      colors: ["#7ee787", "#ffb454"],
      interpret: "Illustrative counts for the same map. Shorter green bar = picking the region with the <b>fewest colours left first</b> hits any conflict almost immediately, so it explores few assignments. The taller orange bar = a fixed left-to-right order delays the hard region, so backtracking thrashes through many more dead branches. Same answer, far less work — <b>order by most-constrained variable</b>."
    }
  ],
  caption: "Forward checking prunes neighbours' domains after each choice; an empty domain is the signal to backtrack, and assigning the most-constrained variable first finds those failures soonest.",
  code: `import matplotlib.pyplot as plt

# 5-region map-colouring CSP; edges = "must differ"
edges = [("A","B"),("A","D"),("B","C"),("B","D"),("C","E"),("D","E")]
nbr = {k: set() for k in "ABCDE"}
for a, b in edges:
    nbr[a].add(b); nbr[b].add(a)

dom = {k: {"R","G","B"} for k in "ABCDE"}      # full domains
def forward_check(var, colour, dom):
    for m in nbr[var]:
        dom[m].discard(colour)                 # remove clashing colour
    return dom

dom["A"] = {"R"}; forward_check("A", "R", dom)  # assign A=R
dom["D"] = {"B"}; forward_check("D", "B", dom)  # assign D=B

regions = list("ABCDE")
sizes = [len(dom[r]) for r in regions]
cols = ["#7ee787" if s == 1 else ("#ff7b72" if s == 0 else "#9aa7b4") for s in sizes]

fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(regions, sizes, color=cols)
for i, s in enumerate(sizes): ax.text(i, s, str(s), ha="center", va="bottom")
ax.set_ylabel("colours left in domain"); ax.set_ylim(0, 3.4)
ax.set_title("Domain sizes after A=R, D=B (forward checking)")
plt.show()`
};

window.CODEVIZ["ai-bayes-net"] = {
  question: "In the Rain -> WetGrass <- Sprinkler network, how does each cause change the chance of wet grass, and what does the graph actually buy you over one big table?",
  charts: [
    {
      type: "bars",
      title: "Child CPT: P(WetGrass = true) for each Rain/Sprinkler combination",
      labels: ["neither", "sprinkler only", "rain only", "rain + sprinkler"],
      values: [0.05, 0.80, 0.90, 0.99],
      valueLabels: ["0.05", "0.80", "0.90", "0.99"],
      colors: ["#9aa7b4", "#4ea1ff", "#ffb454", "#7ee787"],
      interpret: "Each bar is the wet-grass probability for one setting of its two parents (a row of WetGrass's conditional table). Left to right the causes switch on: <b>with neither cause, wet is rare (0.05)</b>; <b>either cause alone lifts it high (0.80 / 0.90)</b>; <b>both together push it near-certain (0.99)</b>. Reading the table this way shows what an arrow means — a parent being true raises the child's chance."
    },
    {
      type: "bars",
      title: "Why the graph helps: numbers needed, factored net vs full joint table",
      labels: ["Bayes net (1+1+4)", "Full joint table (2^3 - 1)"],
      values: [6, 7],
      valueLabels: ["6", "7"],
      colors: ["#7ee787", "#9aa7b4"],
      interpret: "For 3 binary variables the win is small (6 vs 7), but it grows fast. Green = the net stores one small table per node: <b>1 for Rain, 1 for Sprinkler, 4 for WetGrass's two parents</b>. Grey = one flat table over every combination needs 2^3 - 1 = 7. Add more variables that are mostly independent and the flat table doubles each time while the net barely grows — <b>that gap is the whole point of factoring</b>."
    },
    {
      type: "bars",
      title: "Explaining away: P(Rain) before vs after learning Sprinkler is ON (grass is wet)",
      labels: ["P(Rain) prior", "P(Rain | wet, sprinkler on)"],
      values: [0.30, 0.12],
      valueLabels: ["0.30", "0.12"],
      colors: ["#4ea1ff", "#ff7b72"],
      interpret: "Illustrative. Rain and Sprinkler have no arrow between them, so on their own they are independent. But once you observe the shared effect (wet grass) AND that the sprinkler ran, the sprinkler already explains the wetness, so <b>rain becomes less likely</b> — the bar drops from 0.30 to ~0.12. Two causes that were independent become dependent once their common effect is seen; reason through the graph, not by gut feel."
    }
  ],
  caption: "Each arrow's CPT says how a parent lifts the child's probability; storing one small table per node beats one giant joint table, and observing a shared effect can make independent causes compete (explaining away).",
  code: `import matplotlib.pyplot as plt

# WetGrass conditional table: P(Wet=true | Rain, Sprinkler)
def p_wet(rain, spr):
    if rain and spr:   return 0.99
    if rain and not spr: return 0.90
    if not rain and spr: return 0.80
    return 0.05                       # neither cause

combos = [(False, False), (False, True), (True, False), (True, True)]
labels = ["neither", "sprinkler only", "rain only", "rain + sprinkler"]
vals = [p_wet(r, s) for (r, s) in combos]
cols = ["#9aa7b4", "#4ea1ff", "#ffb454", "#7ee787"]

fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(labels, vals, color=cols)
for i, v in enumerate(vals): ax.text(i, v, v, ha="center", va="bottom")
ax.set_ylabel("P(WetGrass = true)"); ax.set_ylim(0, 1.1)
ax.set_title("WetGrass CPT: each parent combination")
plt.show()`
};

window.CODEVIZ["ai-bayes-inference"] = {
  question: "A test comes back positive — how should that one fact reshape your belief across the rival hypotheses?",
  charts: [
    {
      type: "bars",
      title: "Prior P(H): belief BEFORE the test",
      labels: ["Flu", "Cold", "Healthy"],
      values: [0.20, 0.30, 0.50],
      colors: ["#ff7b72", "#ffb454", "#7ee787"],
      interpret: "Each bar is one hypothesis; the height is its probability before any evidence, and the three sum to 1. Read it as your starting beliefs: <b>Healthy</b> is the front-runner at 0.50, Flu is least likely at 0.20. This is the baseline the evidence will push against — keep it in mind, because the whole point of inference is how much it moves."
    },
    {
      type: "bars",
      title: "Posterior P(H | +test): belief AFTER a positive test",
      labels: ["Flu", "Cold", "Healthy"],
      values: [0.47, 0.39, 0.13],
      colors: ["#ff7b72", "#ffb454", "#7ee787"],
      interpret: "Same hypotheses, but now each bar is the probability AFTER seeing a positive test, computed as prior x likelihood / evidence (evidence here is 0.18+0.15+0.05 = 0.38). Compare to the prior: a positive test is far more consistent with Flu (likelihood 0.9) than Healthy (0.1), so <b>Flu jumps 0.20 to 0.47</b> while Healthy collapses 0.50 to 0.13. The tallest bar is your best single guess; mass flowed toward whichever hypothesis best explains the clue."
    },
    {
      type: "bars",
      title: "Weak evidence: a near-useless test barely moves belief (illustrative)",
      labels: ["Flu", "Cold", "Healthy"],
      values: [0.22, 0.30, 0.48],
      colors: ["#ff7b72", "#ffb454", "#7ee787"],
      interpret: "Illustrative. Here the test is almost equally likely under every hypothesis (likelihoods roughly 0.45, 0.42, 0.40), so prior x likelihood scales every bar by nearly the same factor. After normalizing, the <b>posterior looks almost identical to the prior</b> — Healthy still leads. The lesson: a flat likelihood carries little information, so the bars barely shift. If your posterior never moves off the prior, your evidence is weak, not your math."
    },
    {
      type: "bars",
      title: "Explaining away: confirming one cause lowers a rival cause (illustrative)",
      labels: ["P(Burglary) — prior", "after Alarm", "after Earthquake confirmed"],
      values: [0.05, 0.38, 0.11],
      colors: ["#9aa7b4", "#ffb454", "#4ea1ff"],
      interpret: "Illustrative, and a different shape: each bar is P(Burglary) at a different stage, not three hypotheses. The alarm (a shared effect of burglary OR earthquake) raises burglary from 0.05 to 0.38. Then learning an earthquake actually happened <b>pulls burglary back down to 0.11</b> — the earthquake already explains the alarm, so the rival cause is needed less. A bar that rises on evidence then falls when a competing cause is confirmed is the signature of <b>explaining away</b>."
    }
  ],
  caption: "Inference reshapes prior beliefs into a posterior; the bars show how much, and explaining-away shows rival causes competing.",
  code: `// Bayes' rule over 3 hypotheses after a positive test.
const prior = [0.20, 0.30, 0.50];          // P(Flu), P(Cold), P(Healthy)
const like  = [0.90, 0.50, 0.10];          // P(+ | H) for each
const joint = prior.map((p, i) => p * like[i]);
const evidence = joint.reduce((a, b) => a + b, 0);   // P(+) = 0.38
const post = joint.map(j => j / evidence);           // normalize
console.log("posterior", post.map(p => p.toFixed(2)));
// -> [ "0.47", "0.39", "0.13" ]: the positive test lifts Flu, sinks Healthy`
};

window.CODEVIZ["ai-hmm"] = {
  question: "A guard never sees outside but watches whether the director brings an umbrella — how does the belief 'it is raining' shift over five days?",
  charts: [
    {
      type: "line",
      title: "Filtering: belief P(rain) using only past clues (umbrella on days 1,2,4,5; not 3)",
      xlabel: "day",
      ylabel: "P(rain)",
      series: [
        { name: "P(rain) filtered", color: "#4ea1ff", points: [[1, 0.8182], [2, 0.8834], [3, 0.1907], [4, 0.7308], [5, 0.8673]] }
      ],
      interpret: "The x-axis is the day; the y-axis is the belief P(rain) after that day's clue, between 0 and 1. Each point runs one predict-then-reweight-then-normalize step on the umbrella clue. Read the shape: umbrellas on days 1-2 drive belief up to ~0.88, the <b>no-umbrella day 3 collapses it to 0.19</b>, then umbrellas on 4-5 recover it. A sharp drop or rise marks a clue that disagreed with the running belief; this curve only ever uses clues up to the current day."
    },
    {
      type: "line",
      title: "Filtering vs smoothing: future clues soften the day-3 dip",
      xlabel: "day",
      ylabel: "P(rain)",
      series: [
        { name: "filtering (past only)", color: "#4ea1ff", points: [[1, 0.8182], [2, 0.8834], [3, 0.1907], [4, 0.7308], [5, 0.8673]] },
        { name: "smoothing (all clues)", color: "#7ee787", points: [[1, 0.8673], [2, 0.8204], [3, 0.3075], [4, 0.8204], [5, 0.8673]] }
      ],
      interpret: "Two curves over the same days. <b>Blue is filtering</b> (uses only clues so far); <b>green is smoothing</b> (forward-backward, uses every day's clue, past AND future). Look at day 3: filtering crashes to 0.19, but smoothing only dips to ~0.31 because the wet days on either side argue the dry day was a fluke. When the green curve sits higher than the blue at a dip, future evidence is overriding a single odd clue — that is smoothing being more accurate about the past than filtering can be."
    },
    {
      type: "line",
      title: "Sticky transitions: belief barely reacts to clues (illustrative)",
      xlabel: "day",
      ylabel: "P(rain)",
      series: [
        { name: "P(rain), stay=0.95", color: "#ffb454", points: [[1, 0.8182], [2, 0.9431], [3, 0.5260], [4, 0.8317], [5, 0.9469]] }
      ],
      interpret: "Illustrative. Same clues, but the transition now says the weather almost never changes (stay = 0.95 instead of 0.7). The predict step pulls each day hard toward the previous belief, so the <b>day-3 no-umbrella clue only nudges P(rain) to 0.53</b> instead of crashing to 0.19. A nearly flat curve that shrugs off contrary clues means a sticky transition model is dominating the evidence — too sticky and the model stops listening to its sensors."
    },
    {
      type: "line",
      title: "Weak emissions: noisy clues leave belief stuck near 0.5 (illustrative)",
      xlabel: "day",
      ylabel: "P(rain)",
      series: [
        { name: "P(rain), emission near 0.5", color: "#ff7b72", points: [[1, 0.5500], [2, 0.5697], [3, 0.4778], [4, 0.5412], [5, 0.5663]] }
      ],
      interpret: "Illustrative. Here the umbrella is almost as likely in sun as in rain (P(umbrella|rain)=0.55, P(umbrella|sun)=0.45), so each clue carries little signal. The belief <b>hovers around 0.5 and never commits</b> to either weather. A filtering curve that stays glued to the 50/50 line is a warning that your observations are nearly uninformative — the clue cannot separate the hidden states, so no amount of filtering will sharpen the belief."
    }
  ],
  caption: "Filtering tracks belief from past clues; smoothing adds future clues, and the transition/emission strengths control how sharply belief reacts.",
  code: `// HMM forward filtering: belief over hidden rain/sun from umbrella clues.
const T = [[0.7, 0.3], [0.3, 0.7]];        // transition rain/sun -> rain/sun
const eUmb = [0.9, 0.2];                    // P(umbrella | rain), P(umbrella | sun)
let belief = [0.5, 0.5];                    // even prior
const obs = [true, true, false, true, true];
const pRain = [];
for (const saw of obs) {
  const pr = belief[0]*T[0][0] + belief[1]*T[1][0];   // predict via transition
  const ps = belief[0]*T[0][1] + belief[1]*T[1][1];
  const eR = saw ? eUmb[0] : 1 - eUmb[0];
  const eS = saw ? eUmb[1] : 1 - eUmb[1];
  let wr = pr*eR, ws = ps*eS, z = wr + ws;            // reweight by clue
  belief = [wr/z, ws/z];                              // normalize
  pRain.push(belief[0]);
}
console.log(pRain.map(p => p.toFixed(2)));  // ["0.82","0.88","0.19","0.73","0.87"]`
};

window.CODEVIZ["ai-propositional-logic"] = {
  question: "How do you read a truth table, and how does it tell you what a knowledge base entails?",
  code: `// Build the truth table for A, B over 4 connectives, then check entailment.
// Symbols: A, B. Each row is one model (a full true/false assignment).
const rows = [[true,true],[true,false],[false,true],[false,false]];
const T = b => b ? "T" : "F";
for (const [A, B] of rows) {
  const AND = A && B, OR = A || B, NOT = !A, IMP = (!A) || B;  // A->B
  console.log(T(A), T(B), "| AND", T(AND), "OR", T(OR), "NOT-A", T(NOT), "A->B", T(IMP));
}
// Entailment KB |= W where KB = {R, R->W}: keep only models where KB is true,
// then check W in every survivor. Here only the model R=T,W=T survives, and W=T.
console.log("KB = {R, R->W} entails W:", true);`,
  caption: "Each row is one model; a connective's column is true/false in that model. Entailment keeps only the rows where the KB holds, then asks if the goal is true in all of them.",
  charts: [
    {
      type: "heatmap",
      title: "Truth table: every model and what each connective evaluates to",
      rows: ["A=T B=T", "A=T B=F", "A=F B=T", "A=F B=F"],
      cols: ["A", "B", "A AND B", "A OR B", "NOT A", "A -> B"],
      matrix: [
        [1, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 1, 1],
        [0, 0, 0, 0, 1, 1]
      ],
      showVals: true,
      interpret: "Each <b>row is one model</b> — a full true/false assignment to A and B — and each column is a sentence. A cell is <b>1 (true)</b> or <b>0 (false)</b> for that sentence in that model. Read across a row to evaluate a whole sentence at once. Notice <b>A -> B is 0 only on the second row</b> (A true, B false): an implication fails only when the premise holds but the conclusion does not. Everywhere else it is true, including vacuously when A is false."
    },
    {
      type: "heatmap",
      title: "Entailment: KB = {R, R->W} keeps one model, and W is true there",
      rows: ["R=T W=T", "R=T W=F", "R=F W=T", "R=F W=F"],
      cols: ["R", "R -> W", "KB holds?", "W (goal)"],
      matrix: [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
        [0, 1, 0, 1],
        [0, 1, 0, 0]
      ],
      showVals: true,
      interpret: "Same kind of table for the rain example. The third column is <b>1 only when every KB sentence is true</b> (R is true AND R->W is true) — that happens on just the top row. To test <b>KB entails W</b>, look at every row where 'KB holds?' is 1 and check the goal column: here the one surviving model has W = 1, so W is true in every model of the KB. <b>That is entailment.</b> The goal is forced, not merely possible."
    },
    {
      type: "heatmap",
      title: "Contradiction: KB = {A, NOT A} keeps zero models (illustrative)",
      rows: ["A=T", "A=F"],
      cols: ["A", "NOT A", "KB holds?", "anything Q"],
      matrix: [
        [1, 0, 0, 1],
        [0, 1, 0, 0]
      ],
      showVals: true,
      interpret: "Illustrative failure mode. The KB asserts both A and NOT A, so the 'KB holds?' column is <b>0 in every row</b> — no model satisfies an inconsistent knowledge base. With <b>no surviving models</b>, the entailment test ('true in every model where KB holds') is vacuously satisfied for <i>every</i> sentence Q. That is the warning sign: a contradictory KB <b>entails everything</b> and is useless. If your logic suddenly proves both a claim and its negation, check the KB for inconsistency first."
    },
    {
      type: "heatmap",
      title: "Satisfiable vs valid: A OR B is true in some models, not all (illustrative)",
      rows: ["A=T B=T", "A=T B=F", "A=F B=T", "A=F B=F"],
      cols: ["A OR B", "A OR NOT A"],
      matrix: [
        [1, 1],
        [1, 1],
        [1, 1],
        [0, 1]
      ],
      showVals: true,
      interpret: "Illustrative. Two columns contrast the easy-to-confuse cases. <b>A OR B is satisfiable</b> — true in some models (the top three rows) but <b>0 on the bottom row</b>, so it is not entailed on its own. <b>A OR NOT A is valid (a tautology)</b> — a 1 in <i>every</i> row, true in all models. 'True somewhere' (satisfiable) is a much weaker statement than 'true everywhere' (valid). Entailment needs the strong kind: the goal must be 1 in every model the KB allows."
    }
  ]
};

window.CODEVIZ["ai-inference-rules"] = {
  question: "How do you read a forward-chaining trace, and how do you know when the derivation is done?",
  code: `// Forward chaining with modus ponens on a Horn KB.
// Seeds (known facts) start true; each round fires every rule whose premises hold.
const rules = [
  { pre: ["Rain"], con: "Wet" },
  { pre: ["Sprinkler"], con: "Wet" },
  { pre: ["Wet"], con: "Slippery" },
  { pre: ["Wet", "Cold"], con: "Ice" }
];
const known = new Set(["Rain", "Cold"]);   // seeds
let round = 0, changed = true;
while (changed) {
  changed = false; round++;
  for (const r of rules) {
    if (!known.has(r.con) && r.pre.every(p => known.has(p))) {
      known.add(r.con); changed = true;     // modus ponens fires
    }
  }
}
console.log("rounds", round, "derived", [...known].join(", "));`,
  caption: "Each round applies modus ponens: any rule whose premises are all known adds its conclusion. The trace ends (saturates) when a full round adds nothing new.",
  charts: [
    {
      type: "heatmap",
      title: "Forward chaining trace: facts become known round by round",
      rows: ["Start (seeds)", "After round 1", "After round 2", "After round 3"],
      cols: ["Rain", "Cold", "Wet", "Slippery", "Ice"],
      matrix: [
        [1, 1, 0, 0, 0],
        [1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
      ],
      showVals: true,
      interpret: "Read <b>top to bottom as time</b>: each row is the set of known facts after one round of modus ponens; a column is <b>1 once that fact is derived</b>. The seeds Rain and Cold start at 1. Round 1 fires Rain->Wet, turning Wet on. Round 2 fires Wet->Slippery and Wet AND Cold->Ice. Round 3 adds nothing — the row is identical to round 2, which means the KB has <b>saturated</b> and the derivation is complete. A flat, unchanged final row is your stopping signal."
    },
    {
      type: "bars",
      title: "New facts derived per round: the count drops to zero at saturation",
      labels: ["Round 1", "Round 2", "Round 3"],
      values: [1, 2, 0],
      valueLabels: ["Wet", "Slippery, Ice", "(none)"],
      colors: ["#7ee787", "#7ee787", "#9aa7b4"],
      interpret: "Same run, viewed as how many <b>new</b> facts each round adds. Green bars show productive rounds (round 1 derives Wet; round 2 derives Slippery and Ice). The final <b>grey zero-height bar</b> is the round that fired no new rule — that empty round is exactly the <b>termination condition</b> for forward chaining. When the derivation count hits zero, every entailed Horn fact has already been found and you stop."
    },
    {
      type: "heatmap",
      title: "Missing seed: without Rain or Sprinkler, nothing downstream fires (illustrative)",
      rows: ["Start (seed: Cold)", "After round 1"],
      cols: ["Rain", "Cold", "Wet", "Slippery", "Ice"],
      matrix: [
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]
      ],
      showVals: true,
      interpret: "Illustrative. Here the only seed is Cold. <b>Wet has two possible triggers</b> (Rain or Sprinkler) but neither is known, so the rule Rain->Wet can never fire, and the whole chain Wet->Slippery, Wet AND Cold->Ice stays blocked. The table goes <b>flat immediately</b> — round 1 changes nothing. When a forward-chaining run derives far less than you expect, look for a <b>missing premise</b>: an unmet earlier fact silently starves every rule downstream of it."
    },
    {
      type: "bars",
      title: "Resolution as proof by contradiction: clauses collapse to the empty clause (illustrative)",
      labels: ["Negate goal + KB", "Resolve pair 1", "Resolve pair 2", "Empty clause []"],
      values: [4, 3, 2, 0],
      valueLabels: ["start clauses", "cancel a literal", "cancel a literal", "FALSE: goal proved"],
      colors: ["#9aa7b4", "#4ea1ff", "#4ea1ff", "#ff7b72"],
      interpret: "Illustrative, and a different rule. To prove a goal by <b>resolution</b>, you add its negation to the KB and resolve pairs of clauses that share a complementary literal (p in one, NOT p in the other), cancelling it each time. The bars show the working clause set shrinking as literals cancel. Reaching the <b>empty clause [] (red)</b> means the assumptions are contradictory — so the original goal must follow. Unlike modus ponens, resolution is <b>complete</b>: if a fact is entailed, this contradiction always exists. Beware the opposite failure: on hard problems the clause count can <i>explode</i> instead of shrinking."
    }
  ]
};
