/* Per-lesson CODE VISUALIZATIONS — 08-ai-extra.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["aix-relaxation"] = {
  question: "Is my heuristic admissible — does the relaxed cost ever poke above the true cost?",
  caption: "An admissible heuristic must sit on or below the true-cost line for every state. Plot h against the true cost-to-go and read off whether the curve ever crosses above the diagonal.",
  charts: [
    {
      type: "line",
      title: "Ideal: Manhattan h stays on or below true cost (admissible)",
      xlabel: "true cost-to-go (steps around the walls)",
      ylabel: "heuristic h(s)",
      series: [
        { name: "y = x (true cost)", color: "#9aa7b4", points: [[0,0],[12,12]] },
        { name: "Manhattan h", color: "#7ee787", points: [[0,0],[2,2],[4,4],[6,6],[8,8],[10,9],[12,8]] }
      ],
      interpret: "<b>How to read it:</b> the x-axis is the real shortest-path cost from a cell to the goal; the y-axis is what the heuristic guesses. The grey line is y = x, where guess equals truth. The <b>green Manhattan curve never rises above the grey line</b> — at the far cells (true cost 12) it guesses only 8 because it ignores the walls. Staying on or under y = x is exactly admissibility, so A* is guaranteed to find the optimal path."
    },
    {
      type: "line",
      title: "Inadmissible: heuristic overshoots true cost (breaks optimality)",
      xlabel: "true cost-to-go",
      ylabel: "heuristic h(s)",
      series: [
        { name: "y = x (true cost)", color: "#9aa7b4", points: [[0,0],[12,12]] },
        { name: "over-eager h", color: "#ff7b72", points: [[0,0],[2,3],[4,6],[6,8],[8,11],[10,13],[12,15]] }
      ],
      interpret: "<b>Illustrative.</b> Here the red curve climbs <b>above</b> the grey y = x line: for true cost 8 it guesses 11. An over-estimating heuristic is <b>not admissible</b> — A* may prune the true cheapest path because it looks too expensive, and returns a sub-optimal route. If you see your heuristic curve poke above the diagonal anywhere, that is the bug: it lies high."
    },
    {
      type: "line",
      title: "Too loose: h collapses toward zero (admissible but useless)",
      xlabel: "true cost-to-go",
      ylabel: "heuristic h(s)",
      series: [
        { name: "y = x (true cost)", color: "#9aa7b4", points: [[0,0],[12,12]] },
        { name: "over-relaxed h", color: "#ffb454", points: [[0,0],[2,0.5],[4,1],[6,1.3],[8,1.6],[10,1.8],[12,2]] }
      ],
      interpret: "<b>Illustrative.</b> This orange curve hugs the bottom: it stays safely under y = x (still admissible), but it is almost flat at zero. Dropping too many constraints makes the relaxed problem trivial, so h gives A* <b>almost no guidance</b> and the search degenerates toward blind Dijkstra. The lesson: keep h as <i>high</i> as you can without ever crossing the diagonal — close to the grey line is best."
    }
  ],
  code: "// Manhattan heuristic vs true BFS cost on the 5x5 maze.\n" +
    "// h = |dr| + |dc| ignores walls, so it never overestimates.\n" +
    "function manhattan(s, goal) {\n" +
    "  return Math.abs(goal.r - s.r) + Math.abs(goal.c - s.c);\n" +
    "}\n" +
    "var start = { r: 0, c: 0 }, goal = { r: 4, c: 4 };\n" +
    "var h = manhattan(start, goal);   // 4 + 4 = 8\n" +
    "var trueCost = 12;                // BFS around the walls\n" +
    "console.log('h =', h, 'trueCost =', trueCost,\n" +
    "  'admissible?', h <= trueCost);  // 8 <= 12 -> true\n"
};

window.CODEVIZ["aix-structured-perceptron"] = {
  question: "After each correction, does the true structure pull ahead of the impostor?",
  caption: "Track the score gap (true path score minus predicted path score) as updates accumulate. A positive, growing gap means the perceptron has learned to prefer the true structure; oscillation means the data fights back.",
  charts: [
    {
      type: "line",
      title: "Ideal: separable data — gap crosses zero and stays positive",
      xlabel: "perceptron updates applied",
      ylabel: "score gap = true score − wrong score",
      series: [
        { name: "gap (true − wrong)", color: "#7ee787", points: [[0,0],[1,4],[2,8],[3,12]] },
        { name: "zero (tie)", color: "#9aa7b4", points: [[0,0],[3,0]] }
      ],
      interpret: "<b>How to read it:</b> the x-axis counts mistake-driven updates; the y-axis is the true path's score minus the wrong path's score. Each update adds +1 to both true edges and −1 to both wrong edges, so the gap jumps by 4. The <b>green line climbs steadily above the grey zero line</b> — once it is positive, the true path outscores the impostor and the model predicts correctly. On separable data the gap only ever grows: the perceptron converges."
    },
    {
      type: "line",
      title: "Non-separable data: gap oscillates, never settles",
      xlabel: "perceptron updates applied",
      ylabel: "score gap = true score − wrong score",
      series: [
        { name: "gap (true − wrong)", color: "#ff7b72", points: [[0,0],[1,4],[2,-2],[3,3],[4,-3],[5,2],[6,-1]] },
        { name: "zero (tie)", color: "#9aa7b4", points: [[0,0],[6,0]] }
      ],
      interpret: "<b>Illustrative.</b> When no single weight vector can separate the examples, every correction for one example breaks another, so the red gap <b>swings above and below zero forever</b> and never stays positive. The raw perceptron oscillates here. Recognise this saw-tooth as a sign the data is non-separable — add a margin, cap epochs, or switch to a max-violation update."
    },
    {
      type: "line",
      title: "Averaged perceptron: noisy raw weights, smooth averaged gap",
      xlabel: "perceptron updates applied",
      ylabel: "score gap = true score − wrong score",
      series: [
        { name: "raw weights (jittery)", color: "#ffb454", points: [[0,0],[1,4],[2,-1],[3,5],[4,1],[5,6],[6,2]] },
        { name: "averaged weights", color: "#4ea1ff", points: [[0,0],[1,2],[2,1.5],[3,2.4],[4,2.2],[5,2.8],[6,2.7]] },
        { name: "zero (tie)", color: "#9aa7b4", points: [[0,0],[6,0]] }
      ],
      interpret: "<b>Illustrative.</b> The orange raw-weight gap bounces around (it reflects only the latest update), while the blue <b>averaged</b> gap — the mean of all weight vectors seen so far — settles into a steady positive value above zero. Averaging cancels the noise, so the final classifier generalises far better at almost no extra cost. Prefer the blue curve's behaviour: stable and reliably positive."
    }
  ],
  code: "// Two paths share start and goal; score = sum of edge weights.\n" +
    "// On a mistake, reward true edges, punish predicted edges.\n" +
    "var w = { tA: 0, tB: 0, pA: 0, pB: 0 };\n" +
    "function trueScore() { return w.tA + w.tB; }\n" +
    "function predScore() { return w.pA + w.pB; }\n" +
    "function update() {\n" +
    "  if (predScore() >= trueScore()) {        // model is wrong\n" +
    "    w.tA += 1; w.tB += 1; w.pA -= 1; w.pB -= 1;\n" +
    "  }\n" +
    "}\n" +
    "update();\n" +
    "console.log('gap =', trueScore() - predScore());  // 2 - (-2) = 4\n"
};

window.CODEVIZ["aix-monte-carlo"] = {
  question: "Run episodes and average the returns — does Q-hat settle on the true value, or wobble, or converge to the wrong number?",
  caption: "Monte Carlo estimates Q(s,a) as the running average of full-episode returns. The dots are the noisy returns; the line is the average. How that line behaves tells you whether the estimate is healthy.",
  code: (function () {
    return [
      "// Monte Carlo estimate: running average of sampled episode returns",
      "// gamma=0.9; +10 at goal, -1 per step; episode length 2..4 steps",
      "function sampleReturn(rng) {",
      "  var gamma = 0.9, steps = 2 + Math.floor(rng() * 3); // 2,3,4",
      "  var u = 0, disc = 1;",
      "  for (var k = 0; k < steps; k++) { u += disc * (-1); disc *= gamma; }",
      "  u += disc * 10;            // discounted terminal reward",
      "  return u;",
      "}",
      "var seed = 7;",
      "function rng() { seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }",
      "var sum = 0, n = 0, running = [];",
      "for (var i = 0; i < 60; i++) {",
      "  sum += sampleReturn(rng); n++;",
      "  running.push(sum / n);     // Q-hat after i+1 episodes",
      "}",
      "// running[n-1] -> true Q ~= 8.1 as n grows (law of large numbers)"
    ].join("\n");
  })(),
  charts: [
    {
      type: "line",
      title: "Healthy: running average converges to the true Q",
      xlabel: "episodes sampled",
      ylabel: "Q-hat (running average of returns)",
      series: [
        { name: "true Q = 8.1", color: "#9aa7b4", points: [[1, 8.1], [60, 8.1]] },
        { name: "running average Q-hat", color: "#4ea1ff", points: [[1, 6.2], [2, 7.6], [3, 7.7], [5, 8.5], [8, 7.9], [12, 8.3], [20, 8.0], [30, 8.15], [45, 8.08], [60, 8.1]] }
      ],
      interpret: "Real numbers from the demo: gamma 0.9, plus 10 at the goal, minus 1 per step. The x-axis is how many episodes you have averaged; the y-axis is the running mean Q-hat. The <b>blue</b> line starts jumpy (few samples) then flattens onto the <b>grey</b> true-Q line at 8.1. <b>Read it as:</b> the noise in early episodes averages out, so wide swings that shrink and settle on a flat line mean a healthy, converging estimate."
    },
    {
      type: "scatter",
      title: "Healthy: noisy per-episode returns whose mean is the true Q",
      xlabel: "episode index",
      ylabel: "return u of that single episode",
      groups: [
        { name: "sampled returns u", color: "#ffb454", points: [[1, 6.2], [2, 9.0], [3, 8.0], [4, 5.6], [5, 9.0], [6, 8.1], [7, 6.2], [8, 9.0], [9, 8.0], [10, 5.6], [11, 9.0], [12, 8.1], [13, 6.2], [14, 8.0], [15, 9.0]] }
      ],
      lines: [
        { color: "#9aa7b4", dash: true, points: [[1, 8.1], [15, 8.1]] }
      ],
      interpret: "Each <b>orange</b> dot is one episode's actual discounted return u; the <b>grey</b> dashed line is the true Q = 8.1 they scatter around. The dots span roughly 5.6 to 9 because episode length is random, but they sit evenly above and below the line. <b>Read it as:</b> Monte Carlo is unbiased — individual returns are noisy, yet the cloud is centred on the truth, so averaging many of them lands on Q."
    },
    {
      type: "line",
      title: "High variance: same true Q, but the average wobbles for far longer",
      xlabel: "episodes sampled",
      ylabel: "Q-hat (running average of returns)",
      series: [
        { name: "true Q = 8.1", color: "#9aa7b4", points: [[1, 8.1], [60, 8.1]] },
        { name: "running average Q-hat", color: "#ffb454", points: [[1, 2.0], [3, 14.0], [6, 4.0], [10, 12.5], [15, 5.5], [22, 11.0], [30, 6.5], [40, 9.6], [50, 7.2], [60, 8.6]] }
      ],
      interpret: "Illustrative shape. Same axes and same true Q = 8.1, but the rewards here are far noisier, so the <b>orange</b> running average swings wide (2 up to 14) and is still drifting at 60 episodes. <b>Read it as:</b> a curve that keeps oscillating with big amplitude has not converged — the estimate is unreliable. This is Monte Carlo's classic weakness: full-episode returns have high variance, so you need many more episodes, a baseline, or a lower-variance method like TD."
    },
    {
      type: "line",
      title: "Biased: converges smoothly but to the WRONG value (off-policy, no importance weighting)",
      xlabel: "episodes sampled",
      ylabel: "Q-hat (running average of returns)",
      series: [
        { name: "true Q = 8.1", color: "#9aa7b4", points: [[1, 8.1], [60, 8.1]] },
        { name: "running average Q-hat", color: "#ff7b72", points: [[1, 5.5], [3, 5.9], [6, 6.0], [10, 6.05], [20, 6.1], [35, 6.1], [60, 6.1]] }
      ],
      interpret: "Illustrative shape. The <b>red</b> average looks healthy — it settles smoothly and stops wobbling — yet it locks onto about 6.1, well below the <b>grey</b> true Q = 8.1. <b>Read it as:</b> a flat, converged curve is not proof of correctness. Here the episodes came from a different (behaviour) policy than the one being evaluated, so raw averaging targets the wrong expectation. The fix is importance-sampling weights; the tell-tale sign is convergence to a confidently wrong plateau."
    }
  ]
};

window.CODEVIZ["aix-sarsa-td"] = {
  question: "Update each state from the very next step's guess — does the value climb cleanly to the truth, lag behind it, or blow up?",
  caption: "TD/SARSA nudges V(s) toward r + gamma*V(s'). Watching how a single state's value evolves over updates tells you whether the learning rate and bootstrapping are healthy.",
  code: (function () {
    return [
      "// TD(0) backup on a 1x5 corridor: s0..s3 then GOAL(+1) at index 4",
      "// V(s) <- V(s) + alpha[ r + gamma*V(s') - V(s) ], r = 0 each step",
      "var alpha = 0.5, gamma = 0.9;",
      "var V = [0, 0, 0, 0, 1];   // goal value fixed at 1",
      "var history = [];",
      "for (var sweep = 0; sweep < 12; sweep++) {",
      "  for (var s = 3; s >= 0; s--) {        // back-to-front sweep",
      "    var target = 0 + gamma * V[s + 1];  // TD target",
      "    V[s] = V[s] + alpha * (target - V[s]);",
      "  }",
      "  history.push(V[0]);                    // track V(s0) over sweeps",
      "}",
      "// V converges to the true values gamma^(4-s): s0=0.6561, s1=0.729, s2=0.81, s3=0.9"
    ].join("\n");
  })(),
  charts: [
    {
      type: "bars",
      title: "Converged values: gamma^(distance to goal) decaying from the goal",
      labels: ["s0", "s1", "s2", "s3", "GOAL"],
      values: [0.6561, 0.729, 0.81, 0.9, 1.0],
      valueLabels: ["0.66", "0.73", "0.81", "0.90", "1.00"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"],
      interpret: "Real numbers: with gamma = 0.9 the true value of a state d steps from the goal is 0.9 raised to d. Each bar is a corridor cell; height is its learned value V(s). The <b>green</b> goal bar is fixed at 1.0 and the <b>blue</b> bars step down 0.90, 0.81, 0.73, 0.66 as you move away. <b>Read it as:</b> value flows backward from the reward, discounted once per step — a clean geometric decay means TD has reached the correct fixed point."
    },
    {
      type: "line",
      title: "Healthy: V(s0) climbs smoothly to its true value",
      xlabel: "TD sweeps (back-to-front updates)",
      ylabel: "V(s0)",
      series: [
        { name: "true V(s0) = 0.656", color: "#9aa7b4", points: [[0, 0.656], [12, 0.656]] },
        { name: "V(s0) estimate", color: "#7ee787", points: [[0, 0], [1, 0.10], [2, 0.27], [3, 0.42], [4, 0.52], [6, 0.61], [8, 0.64], [10, 0.652], [12, 0.656]] }
      ],
      interpret: "Real run, alpha = 0.5. The x-axis counts back-to-front sweeps; the y-axis is the value of the farthest cell, V(s0). The <b>green</b> curve rises monotonically and flattens onto the <b>grey</b> true value 0.656. <b>Read it as:</b> because each sweep lets the goal's value seep back one more cell, a smooth no-overshoot climb that levels off is exactly what healthy TD convergence looks like."
    },
    {
      type: "line",
      title: "Learning rate too high: value oscillates and diverges",
      xlabel: "TD updates",
      ylabel: "V(s0)",
      series: [
        { name: "true V(s0) = 0.656", color: "#9aa7b4", points: [[0, 0.656], [12, 0.656]] },
        { name: "V(s0) estimate", color: "#ff7b72", points: [[0, 0], [1, 1.3], [2, -0.4], [3, 1.9], [4, -1.1], [5, 2.6], [6, -1.9], [7, 3.4], [8, -2.9], [10, 4.5], [12, -4.0]] }
      ],
      interpret: "Illustrative shape. Same target (grey 0.656), but with too large a learning rate (alpha near or above 1) every update overshoots the target and flips sign. <b>Read it as:</b> a <b>red</b> curve that zig-zags with growing amplitude instead of settling is diverging. This is the failure mode behind the 'deadly triad' (bootstrapping plus off-policy plus function approximation); the fix is a smaller, decaying alpha, on-policy SARSA, or target networks."
    },
    {
      type: "line",
      title: "Biased early bootstrapping: TD lags while its targets are still wrong",
      xlabel: "updates",
      ylabel: "V(s0)",
      series: [
        { name: "true V(s0) = 0.656", color: "#9aa7b4", points: [[0, 0.656], [12, 0.656]] },
        { name: "TD (bootstrapped)", color: "#ffb454", points: [[0, 0], [1, 0.05], [2, 0.13], [3, 0.22], [4, 0.31], [6, 0.45], [8, 0.55], [10, 0.61], [12, 0.64]] },
        { name: "Monte Carlo (full returns)", color: "#c89bff", points: [[0, 0], [1, 0.5], [2, 0.4], [3, 0.75], [4, 0.55], [6, 0.7], [8, 0.62], [10, 0.68], [12, 0.655]] }
      ],
      interpret: "Illustrative comparison. <b>Orange</b> TD rises in tiny, smooth steps but trails the true value for a while: early on it bootstraps off V(s') values that are themselves still near zero, so its targets are biased low. <b>Purple</b> Monte Carlo jumps around much more (high variance) but is centred on the truth from the start (unbiased). <b>Read it as:</b> a low-variance line that approaches the truth slowly from one side signals bootstrap bias; a jumpy line centred on the truth signals MC's variance — the classic bias-versus-variance trade between the two methods."
    }
  ]
};

window.CODEVIZ["aix-game-theory"] = {
  question: "How do you read a payoff matrix to find where rational play settles?",
  charts: [
    {
      type: "heatmap",
      title: "Prisoner's dilemma: one pure Nash at (Defect, Defect)",
      rows: ["A: Cooperate", "A: Defect"],
      cols: ["B: Cooperate", "B: Defect"],
      matrix: [[-1, -3], [0, -2]],
      showVals: true,
      interpret: "<b>Each cell holds A's payoff</b> (higher = better) for that row-vs-column combination; B's mirror values are symmetric. Read down a column to see A's best reply: against B-Cooperate, A prefers 0 (Defect) over -1; against B-Defect, A prefers -2 (Defect) over -3. Defect wins in <b>both</b> columns, so it is a dominant strategy and the bottom-right cell (Defect, Defect) is the unique Nash equilibrium. Note it pays -2 each, worse than mutual cooperation at -1 each: the stable outcome is not the best one."
    },
    {
      type: "heatmap",
      title: "Coordination game: TWO pure Nash on the diagonal",
      rows: ["A: Left", "A: Right"],
      cols: ["B: Left", "B: Right"],
      matrix: [[2, 0], [0, 2]],
      showVals: true,
      interpret: "Illustrative payoffs where both players just want to <b>match</b>. The two high cells (Left,Left)=2 and (Right,Right)=2 are each a Nash equilibrium: given the other picks Left, your best reply is Left, and likewise for Right. When you see a payoff grid whose best-responses agree in more than one cell, the theory predicts a stable outcome but <b>cannot tell you which one</b> happens, so you need a tie-breaker (a focal point or convention)."
    },
    {
      type: "heatmap",
      title: "Matching pennies: NO pure Nash (cell of zeros)",
      rows: ["A: Heads", "A: Tails"],
      cols: ["B: Heads", "B: Tails"],
      matrix: [[1, -1], [-1, 1]],
      showVals: true,
      interpret: "Illustrative zero-sum game: A wants to match, B wants to mismatch. Chase any cell with your finger and someone always wants to move: every cell has a player who gains by switching, so <b>no single cell is stable</b>. When a payoff grid has this cyclic, no-fixed-point pattern, the only equilibrium is a <b>mixed strategy</b> (here each plays 50/50), and the minimax theorem guarantees that randomizing secures the game's value of 0."
    }
  ],
  caption: "",
  code:
`// Find pure-strategy Nash equilibria of a 2x2 game.
// pay[row][col] = [A_payoff, B_payoff].
const pay = [
  [[-1,-1],[-3,0]],   // A Cooperate
  [[0,-3],[-2,-2]]    // A Defect
];
const aBest = (col) => pay[0][col][0] >= pay[1][col][0] ? 0 : 1;
const bBest = (row) => pay[row][0][1] >= pay[row][1][1] ? 0 : 1;
const names = [["Cooperate","Cooperate"],["Cooperate","Defect"],
               ["Defect","Cooperate"],["Defect","Defect"]];
for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
  const nash = (aBest(c) === r) && (bBest(r) === c);
  console.log("A=" + names[r*2+c][0] + ", B=" + names[r*2+c][1] +
              " -> payoff " + JSON.stringify(pay[r][c]) +
              (nash ? "  <-- NASH" : ""));
}
// -> (Defect, Defect) is the unique pure Nash equilibrium.`
};

window.CODEVIZ["aix-variable-elimination"] = {
  question: "Why is summing variables out one at a time so much cheaper than brute force?",
  charts: [
    {
      type: "bars",
      title: "Chain A-B-C: brute force vs variable elimination",
      labels: ["Brute force (sum full joint)", "Variable elimination (sum out B)"],
      values: [8, 4],
      valueLabels: ["8 terms", "4 terms"],
      colors: ["#ff7b72", "#7ee787"],
      interpret: "<b>Bars are the number of arithmetic terms</b> to compute the marginal over the 3-variable chain A-B-C (all binary). Brute force sums the full joint over all 2x2x2 = <b>8</b> combinations (red). Variable elimination sums B out of just the two factors touching it, building one new factor g(A,C) with 2x2 = <b>4</b> entries (green). The green bar is shorter: pushing the sum inward avoids ever writing the giant joint table. The lower the bar, the less work."
    },
    {
      type: "line",
      title: "Good vs bad elimination order: largest intermediate factor",
      xlabel: "variables eliminated so far",
      ylabel: "size of largest factor (table entries)",
      series: [
        { name: "good order (min-degree)", color: "#7ee787", points: [[0,2],[1,4],[2,4],[3,4],[4,2]] },
        { name: "bad order", color: "#ff7b72", points: [[0,2],[1,8],[2,16],[3,16],[4,4]] }
      ],
      interpret: "Illustrative. <b>X = how many variables you have eliminated; Y = the biggest factor table created so far</b>, which sets memory and time. The green order eliminates least-connected variables first and keeps factors small and flat. The red order eliminates a hub early, fusing many neighbours into one large factor and <b>spiking the curve</b>. Same correct answer, wildly different cost: when you see a tall hump like the red line, your elimination order is the problem, not the network."
    },
    {
      type: "bars",
      title: "Cost vs treewidth: dense graph defeats exact inference",
      labels: ["chain (tw 1)", "tree (tw 1)", "grid 4x4 (tw 4)", "dense (tw 10)"],
      values: [2, 2, 16, 1024],
      valueLabels: ["~2", "~2", "~16", "~1024"],
      colors: ["#7ee787", "#7ee787", "#ffb454", "#ff7b72"],
      interpret: "Illustrative. <b>Bars are roughly 2^treewidth</b> = the cost of the largest factor any elimination order must build. Cost is set by graph <b>connectivity (treewidth)</b>, not the number of variables: chains and trees stay cheap (green), but a densely-connected graph (red) forces an exponential factor no clever order can avoid. When this bar towers, stop trying to reorder and switch to <b>approximate inference</b> (sampling or loopy belief propagation)."
    }
  ],
  caption: "",
  code:
`// Eliminate B from a chain A - f1 - B - f2 - C (all binary).
// g(A,C) = sum_B f1(A,B) * f2(B,C)
const f1 = { "0,0":2, "0,1":1, "1,0":1, "1,1":3 };  // f1(A,B)
const f2 = { "0,0":1, "0,1":2, "1,0":3, "1,1":1 };  // f2(B,C)
const g = {};
for (let a = 0; a < 2; a++) for (let c = 0; c < 2; c++) {
  let s = 0;
  for (let b = 0; b < 2; b++) s += f1[a + "," + b] * f2[b + "," + c];
  g[a + "," + c] = s;
}
console.log(g);
// -> { "0,0":5, "0,1":5, "1,0":10, "1,1":5 }
// B is summed out; the graph is now just A - g - C.`
};

window.CODEVIZ["aix-gibbs-particle"] = {
  question: "If you can't compute the posterior, can you just sample it and read the answer off a histogram?",
  code:
`// Draw N samples from a fixed posterior and watch the histogram converge.
const target = [0.2, 0.5, 0.3];            // true posterior over 3 states
let seed = 13;
function rng(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }
function sampleOne(){
  let u = rng(), c = 0;
  for (let i=0;i<target.length;i++){ c += target[i]; if (u <= c) return i; }
  return target.length-1;
}
function estimate(N){
  const counts = [0,0,0];
  for (let k=0;k<N;k++) counts[sampleOne()]++;
  return counts.map(c => c/N);     // empirical fraction approximates P(state)
}
console.log("N=50  ", estimate(50));    // rough, noisy
console.log("N=5000", estimate(5000));  // tight, near [0.20, 0.50, 0.30]`,
  caption: "",
  charts: [
    {
      type: "bars",
      title: "Healthy: 5000 samples match the posterior",
      labels: ["state 1", "state 2", "state 3"],
      values: [0.20, 0.50, 0.30],
      valueLabels: ["0.20", "0.50", "0.30"],
      colors: ["#7ee787", "#7ee787", "#7ee787"],
      interpret: "<b>x-axis</b> = the three possible states; <b>y-axis</b> = estimated probability (fraction of samples landing in each). With enough samples the bar heights sit right on the true posterior 0.20 / 0.50 / 0.30. <b>Read it as:</b> the sampler converged, so trust these numbers as the answer."
    },
    {
      type: "bars",
      title: "Too few samples: noisy, over-confident (illustrative)",
      labels: ["state 1", "state 2", "state 3"],
      values: [0.10, 0.60, 0.30],
      valueLabels: ["0.10", "0.60", "0.30"],
      colors: ["#ffb454", "#ffb454", "#ffb454"],
      interpret: "Same axes, but here only ~10 samples were drawn (illustrative). The bars are off the true 0.20 / 0.50 / 0.30 just from luck. <b>Recognise it:</b> rerunning shifts the bars a lot. Error shrinks only like 1 over root-N, so a wobbly histogram means you need far more samples before quoting it."
    },
    {
      type: "bars",
      title: "Particle degeneracy: one particle hogs all the weight (illustrative)",
      labels: ["state 1", "state 2", "state 3"],
      values: [0.02, 0.96, 0.02],
      valueLabels: ["0.02", "0.96", "0.02"],
      colors: ["#9aa7b4", "#ff7b72", "#9aa7b4"],
      interpret: "Illustrative particle-filter failure: after a few steps nearly all weight collapses onto one particle (the tall red bar) while the rest are dead. This is NOT a sharp true posterior — it is degeneracy. <b>Recognise it:</b> effective sample size crashes toward 1. Fix by resampling and adding jitter so diversity survives."
    },
    {
      type: "bars",
      title: "Gibbs stuck in one mode of a bimodal posterior (illustrative)",
      labels: ["mode A lo", "mode A hi", "valley", "mode B lo", "mode B hi"],
      values: [0.40, 0.55, 0.02, 0.02, 0.01],
      valueLabels: ["0.40", "0.55", "0.02", "0.02", "0.01"],
      colors: ["#4ea1ff", "#4ea1ff", "#9aa7b4", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative: the true posterior has two peaks (mode A and mode B) separated by a low-probability valley. A single Gibbs chain fell into mode A (blue) and never crossed the valley, so mode B (red) is under-sampled and the estimate is wrong. <b>Recognise it:</b> different starting points give different histograms. Run multiple dispersed chains and check they agree."
    }
  ]
};

window.CODEVIZ["aix-markov-blanket"] = {
  question: "How much of the network does node X actually depend on — and which neighbors can you safely ignore?",
  code:
`// Resampling X needs only the factors that mention X.
// P(X | rest) is proportional to X's own factor times each child's factor.
// Those factors pull in exactly: parents, children, and co-parents = the Markov blanket.
const factorsWithX = [
  "P(X | P1, P2)",        // X's own term  -> brings in parents P1, P2
  "P(C1 | X)",            // child term    -> brings in child C1
  "P(C2 | X, CP)"         // child term    -> brings in child C2 AND co-parent CP
];
// Every other factor (e.g. P(U) ) has no X, so it cancels in normalization.
const blanket = ["P1","P2","C1","C2","CP"];   // parents + children + co-parents
const outside = ["U"];                         // independent of X given the blanket
console.log("MB(X) =", blanket);               // the only nodes that matter
console.log("X is independent of", outside, "given MB(X)");`,
  caption: "",
  charts: [
    {
      type: "bars",
      title: "Healthy: influence on belief about X, grouped by role",
      labels: ["P1 parent", "P2 parent", "C1 child", "C2 child", "CP co-parent", "U outside"],
      values: [1.0, 1.0, 1.0, 1.0, 1.0, 0.0],
      valueLabels: ["in", "in", "in", "in", "in", "0"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#9aa7b4"],
      interpret: "<b>x-axis</b> = each other node, labelled by its role toward X; <b>y-axis</b> = whether knowing it still changes belief about X once the blanket is fixed (1 = inside the blanket, 0 = irrelevant). Parents, children, and the co-parent CP are all green (in the blanket); the far node U is grey at 0. <b>Read it as:</b> fix those five values and U tells you nothing new about X."
    },
    {
      type: "bars",
      title: "Variant: child C2 NOT observed -> co-parent drops out (illustrative)",
      labels: ["P1 parent", "P2 parent", "C1 child", "C2 child", "CP co-parent", "U outside"],
      values: [1.0, 1.0, 1.0, 0.0, 0.0, 0.0],
      valueLabels: ["in", "in", "in", "?", "0", "0"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#ffb454", "#ff7b72", "#9aa7b4"],
      interpret: "Illustrative: if the shared child C2 is unobserved, the collider X to C2 from CP stays blocked, so the co-parent CP (red) carries no information about X and falls to 0. <b>Recognise it:</b> a co-parent only enters the blanket because observing the child opens the explaining-away path. No observed child, no co-parent dependence. The blanket is defined by graph structure, but which links are active depends on what is observed."
    },
    {
      type: "bars",
      title: "Pitfall: parents-only blanket leaks information (illustrative)",
      labels: ["P1 parent", "P2 parent", "C1 child", "C2 child", "CP co-parent", "U outside"],
      values: [1.0, 1.0, 0.7, 0.7, 0.4, 0.0],
      valueLabels: ["in", "in", "leak", "leak", "leak", "0"],
      colors: ["#7ee787", "#7ee787", "#ff7b72", "#ff7b72", "#ff7b72", "#9aa7b4"],
      interpret: "Illustrative WRONG blanket: someone used parents only and forgot children and co-parents. The red bars show those omitted nodes still move belief about X (information flows backward up an arrow from a child, and through the child to its co-parent), so X is NOT independent of the rest. <b>Recognise it:</b> conditioning on your candidate set leaves residual dependence. A correct Markov blanket drives every outside node to 0 like the first chart."
    }
  ]
};

window.CODEVIZ["aix-forward-backward"] = {
  question: "Weather-from-clothes HMM: how does smoothing (forward + backward) read each day's hidden weather, and how does it differ from filtering?",
  charts: [
    {
      type: "line",
      title: "Ideal: smoothed P(Sunny) per day uses ALL 4 observations",
      xlabel: "Day (observation A=light coat, B=heavy coat)",
      ylabel: "P(hidden state = Sunny)",
      series: [
        { name: "Smoothed (forward x backward)", color: "#7ee787", points: [[1, 0.866], [2, 0.816], [3, 0.284], [4, 0.731]] },
        { name: "Filtered (forward only, past)", color: "#9aa7b4", points: [[1, 0.818], [2, 0.883], [3, 0.191], [4, 0.731]] }
      ],
      interpret: "<b>Real numbers</b> from the lesson's HMM (P(stay)=0.7; Sunny emits A 0.9, Rainy emits B 0.8; observations A,A,B,A). The x-axis is the day; the y-axis is the chance that day's hidden weather is <b>Sunny</b>. The green line is the smoothed belief built from <i>all four</i> days; the grey line is filtering, which only knows the past. At day 3 the heavy-coat clue (B) drags P(Sunny) far down on both lines. Read off the value per day: above 0.5 means Sunny is more likely, below means Rainy."
    },
    {
      type: "line",
      title: "Variant - future evidence FLIPS an early belief (illustrative)",
      xlabel: "Day",
      ylabel: "P(hidden state = Sunny)",
      series: [
        { name: "Smoothed (all evidence)", color: "#7ee787", points: [[1, 0.20], [2, 0.30], [3, 0.55], [4, 0.85]] },
        { name: "Filtered (past only)", color: "#9aa7b4", points: [[1, 0.62], [2, 0.55], [3, 0.58], [4, 0.85]] }
      ],
      interpret: "<b>Illustrative.</b> Here day 1's filtered guess (grey, 0.62) leans Sunny, but a strong run of rainy clues later forces the smoothed belief (green) down to 0.20 - the future <b>overturns</b> the past. Recognise this when the green and grey lines sit on opposite sides of 0.5 early on: it is exactly why smoothing beats filtering when you can wait for all the data. The two lines must meet at the last day, where there is no future left to add."
    },
    {
      type: "line",
      title: "Variant - uninformative emissions: posterior stays flat near 0.5 (illustrative)",
      xlabel: "Day",
      ylabel: "P(hidden state = Sunny)",
      series: [
        { name: "Smoothed", color: "#ffb454", points: [[1, 0.52], [2, 0.49], [3, 0.51], [4, 0.50]] }
      ],
      interpret: "<b>Illustrative failure mode.</b> When each weather emits both coats almost equally (emissions near 0.5/0.5), the observations carry no signal, so the smoothed posterior hugs 0.5 every day - a flat, useless line. Recognise this as the model saying 'I cannot tell': the fix is a more discriminative emission model, not more passes. A near-flat smoothed curve means the clues, not the algorithm, are the problem."
    }
  ],
  caption: "The forward pass alpha carries evidence up to each day; the backward pass beta carries evidence from the end back. Smoothed P(H|E) is proportional to alpha*beta - the green line - and uses both directions, unlike past-only filtering.",
  code: `import numpy as np

# Weather HMM. Hidden: Sunny(0), Rainy(1). Obs: light coat A(0), heavy coat B(1).
stay = 0.7                                   # P(weather stays the same)
trans = np.array([[stay, 1-stay],            # rows = from-state
                  [1-stay, stay]])
emit  = np.array([[0.9, 0.1],                # Sunny emits A mostly
                  [0.2, 0.8]])               # Rainy emits B mostly
obs   = [0, 0, 1, 0]                         # A, A, B, A over 4 days
T = len(obs)

alpha = np.zeros((T, 2)); beta = np.zeros((T, 2))
alpha[0] = 0.5 * emit[:, obs[0]]             # forward init: uniform prior
for t in range(1, T):                        # forward recursion (left to right)
    alpha[t] = (alpha[t-1] @ trans) * emit[:, obs[t]]
beta[T-1] = 1.0                              # backward init
for t in range(T-2, -1, -1):                 # backward recursion (right to left)
    beta[t] = trans @ (emit[:, obs[t+1]] * beta[t+1])

smooth = alpha * beta                         # combine both directions
smooth /= smooth.sum(axis=1, keepdims=True)   # normalize per day
print("smoothed P(Sunny):", smooth[:, 0].round(3))   # -> [0.866 0.816 0.284 0.731]`
};

window.CODEVIZ["aix-lda-topic"] = {
  question: "News corpus: what do LDA's two recovered topics look like as a word x topic grid, and how do good vs muddy topics read?",
  charts: [
    {
      type: "heatmap",
      title: "Ideal: topic-word distributions phi (each column sums to 1)",
      rows: ["game", "team", "score", "market", "stock", "bank"],
      cols: ["Topic: Sports", "Topic: Finance"],
      matrix: [
        [0.30, 0.00],
        [0.40, 0.00],
        [0.20, 0.05],
        [0.05, 0.35],
        [0.05, 0.30],
        [0.00, 0.30]
      ],
      showVals: true,
      interpret: "Each <b>column is one topic</b>; each cell is phi(k,w) = the probability that topic emits that word. Read down a column to see a topic's signature vocabulary: Sports is dominated by game/team/score, Finance by market/stock/bank. The two columns barely overlap, so the topics are <b>well separated</b> - a clean result. A word that is near 0 in both columns (rare here) would be one LDA could not place."
    },
    {
      type: "bars",
      title: "Ideal: per-document topic mixture theta (real lesson values)",
      labels: ["Doc 1 (game report)", "Doc 2 (mixed)", "Doc 3 (earnings)"],
      series: [
        { name: "Sports", color: "#4ea1ff", points: [[0, 0.8], [1, 0.5], [2, 0.2]] },
        { name: "Finance", color: "#7ee787", points: [[0, 0.2], [1, 0.5], [2, 0.8]] }
      ],
      interpret: "Each bar is one document split into its <b>topic proportions</b> theta, which sum to 1. Doc 1 is 80% Sports, Doc 3 is 80% Finance, Doc 2 is a genuine 50/50 blend - LDA gives a soft mixture, not one hard label. Read the dominant colour to call a document's main theme; a near-even split (Doc 2) flags a document about several topics at once."
    },
    {
      type: "heatmap",
      title: "Variant - muddy/overlapping topics (K too small or weak priors, illustrative)",
      rows: ["game", "team", "market", "stock", "the", "said"],
      cols: ["Topic A", "Topic B"],
      matrix: [
        [0.18, 0.15],
        [0.17, 0.16],
        [0.16, 0.18],
        [0.15, 0.17],
        [0.19, 0.18],
        [0.15, 0.16]
      ],
      showVals: true,
      interpret: "<b>Illustrative.</b> Both columns share almost the same probabilities - the two topics are near-duplicates with no signature words. Recognise this when every cell hovers around 1/(vocab size) and the columns look identical: the topics are <b>not separated</b>. Causes: too few topics K, weak Dirichlet priors, or stop-words ('the','said') swamping the signal. Fix by tuning K, sharpening the prior, and removing stop-words."
    },
    {
      type: "bars",
      title: "Variant - one junk topic eats everything (stop-words, illustrative)",
      labels: ["game", "the", "and", "team", "of", "stock"],
      values: [0.04, 0.31, 0.24, 0.05, 0.20, 0.03],
      colors: ["#7ee787", "#ff7b72", "#ff7b72", "#7ee787", "#ff7b72", "#7ee787"],
      interpret: "<b>Illustrative.</b> The top words of one learned 'topic' are function words - the(0.31), and(0.24), of(0.20) - not a theme at all. Recognise a junk topic when its highest-probability words (red) are stop-words rather than content words (green). It means preprocessing failed: lowercase, strip stop-words, and filter very rare/common tokens before trusting any topic."
    }
  ],
  caption: "A document is a mixture of topics theta (the bars); each topic is a distribution over words phi (the heatmap columns). P(word) = sum over topics of theta_k * phi_(k,word) - e.g. 'team' in an 80% Sports doc scores 0.8*0.4 + 0.2*0.0 = 0.32.",
  code: `import numpy as np

vocab  = ["game", "team", "score", "market", "stock", "bank"]
topics = ["Sports", "Finance"]

# phi[k] = topic k's word distribution (columns of the heatmap), each sums to 1.
phi = np.array([
    [0.30, 0.40, 0.20, 0.05, 0.05, 0.00],   # Sports
    [0.00, 0.00, 0.05, 0.35, 0.30, 0.30],   # Finance
])

# theta[d] = document d's topic mixture (the bars), each sums to 1.
theta = np.array([
    [0.8, 0.2],   # Doc 1 mostly Sports
    [0.5, 0.5],   # Doc 2 a true blend
    [0.2, 0.8],   # Doc 3 mostly Finance
])

# P(word | doc) = sum_k theta_k * phi[k, word]  (the LDA mixture)
P = theta @ phi
team = vocab.index("team")
print("P('team' | Doc 1) =", round(P[0, team], 3))   # -> 0.32
print("word probs Doc 1 :", P[0].round(3))`
};

window.CODEVIZ["aix-fol"] = {
  question: "How do you read a unification grid and a resolution-proof trace, and how do you spot when a proof fails or blows up?",
  code: `// Resolution proof by contradiction in clause form.
// Prove Q(a) from the rule (NOT P(a,b) OR Q(a)) and the fact P(a,b).
// Add the negated goal NOT Q(a), then resolve away complementary literals
// until the empty clause [] appears (a contradiction = goal proved).
let clauses = [
  ["~P(a,b)", "Q(a)"],   // the rule, in clause form
  ["P(a,b)"],            // a fact
  ["~Q(a)"]              // the NEGATED goal we want to refute
];
const sizes = [clauses.length];   // track how many clauses we hold each step

// Step 1: resolve the rule with the fact P(a,b) -> cancels P(a,b), leaves Q(a).
clauses = clauses.concat([["Q(a)"]]);
sizes.push(clauses.length);

// Step 2: resolve Q(a) with the negated goal ~Q(a) -> empty clause [].
clauses = clauses.concat([[]]);   // [] means FALSE: contradiction reached
sizes.push(clauses.length);

console.log("clause counts per step:", sizes);     // 3, 4, 5 (last adds [])
console.log("empty clause derived -> Q(a) proved");`,
  caption: "Two engines power first-order logic. Unification (heatmaps) lines up two atoms argument by argument; resolution (bars) cancels complementary literals step by step. A clean proof reaches the empty clause; a failed unify or an exploding clause set are the failure modes to recognize.",
  charts: [
    {
      type: "heatmap",
      title: "Unification succeeds: P(x,b) vs P(a,y) match in every position",
      rows: ["Predicate name", "Arg 1", "Arg 2"],
      cols: ["matches?"],
      matrix: [[1], [1], [1]],
      showVals: true,
      interpret: "Read this <b>top to bottom as the three things unification checks</b> when lining up the two atoms P(x,b) and P(a,y). The predicate names match (both P), so row 1 is <b>1 (green)</b>. Arg 1 is variable x vs constant a: a variable unifies with anything, so bind x/a -> 1. Arg 2 is constant b vs variable y: bind y/b -> 1. <b>Every cell is 1</b>, so the whole atom unifies under the substitution {x/a, y/b}, and both sides become the identical atom P(a,b). An all-green column is your signal that a most-general unifier exists."
    },
    {
      type: "heatmap",
      title: "Unification fails: a constant clash blocks one position (illustrative)",
      rows: ["Predicate name", "Arg 1", "Arg 2"],
      cols: ["matches?"],
      matrix: [[1], [1], [0]],
      showVals: true,
      interpret: "Illustrative. Same check, but now compare P(x,b) with P(a,c): predicate matches (1), arg 1 binds x/a (1), but arg 2 pits constant b against constant c. <b>Two different constants can never be made equal</b> -- there is no variable to bind -- so that cell is <b>0 (red)</b>. A single 0 anywhere means the unifier <b>does not exist</b> and the two atoms cannot be resolved together. When a resolution step you expected refuses to fire, scan the argument positions for exactly this kind of constant-vs-constant clash (or an occurs-check failure, where a variable would have to contain itself)."
    },
    {
      type: "bars",
      title: "Resolution proof: clauses resolve down to the empty clause, proving Q(a)",
      labels: ["Negate goal + KB", "Resolve rule with P(a,b)", "Resolve Q(a) with ~Q(a)"],
      values: [3, 4, 5],
      valueLabels: ["3 clauses", "derive Q(a)", "empty clause []"],
      colors: ["#9aa7b4", "#4ea1ff", "#ff7b72"],
      interpret: "Read <b>left to right as proof steps</b>; bar height is how many clauses you hold. You start (grey) with 3 clauses: the rule NOT P(a,b) OR Q(a), the fact P(a,b), and the <b>negated goal</b> NOT Q(a). Step 2 (blue) resolves the rule against the fact -- the complementary literal P(a,b) cancels -- adding the new clause Q(a). Step 3 resolves Q(a) with NOT Q(a): nothing is left, producing the <b>empty clause [] (red)</b>. The empty clause means FALSE, so assuming NOT Q(a) was contradictory, and therefore <b>Q(a) is proved</b>. A short trace ending in [] is a successful refutation."
    },
    {
      type: "bars",
      title: "Combinatorial explosion: naive resolution generates clauses without end (illustrative)",
      labels: ["Round 0", "Round 1", "Round 2", "Round 3", "Round 4"],
      values: [4, 9, 21, 55, 140],
      valueLabels: ["start", "growing", "growing", "growing", "no [] yet"],
      colors: ["#9aa7b4", "#ffb454", "#ffb454", "#ffb454", "#ff7b72"],
      interpret: "Illustrative, and the opposite of a clean proof. Here each round resolves every compatible clause pair, so the working set <b>grows fast</b> (orange bars climbing) and the empty clause never appears. This is the practical failure mode of first-order resolution: full FOL is only <b>semi-decidable</b>, so if the goal does not follow, the search can run forever rather than report 'no'. A clause count that keeps climbing with no [] in sight (red) tells you to add a search strategy -- unit preference, set-of-support, subsumption deletion -- or to bound the depth and treat the run as <b>inconclusive</b>."
    }
  ]
};
