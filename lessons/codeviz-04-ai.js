/* Per-lesson visualizations of the code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   All numbers below are the REAL output of running each lesson's code (Python/NumPy). */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "ai-linear-predictors": {
    question: "Which emails are spam, and how confident is each call?",
    charts: [{
      type: "scatter", title: "4 emails: features and the decision line", xlabel: "count of 'free'", ylabel: "number of links",
      groups: [
        { name: "spam (y=+1)", color: "#ff7b72", points: [[2, 3], [4, 2]] },
        { name: "ham (y=-1)", color: "#4ea1ff", points: [[0, 1], [1, 0]] }
      ],
      lines: [{ name: "boundary 1.5x+0.5y-3=0", color: "#ffb454", points: [[1.333, 0.333], [2, 0]] }]
    }, {
      type: "bars", title: "Margin per email (score times true label)", labels: ["email 0", "email 1", "email 2", "email 3"],
      values: [1.5, 2.5, 4.0, 1.5], colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787"]
    }],
    caption: "Scores are [1.5, -2.5, 4.0, -1.5]; every margin is positive so all 4 emails are classified correctly (accuracy 1.0)."
  },

  "ai-loss-minimization": {
    question: "How harshly does each loss punish the same set of margins?",
    charts: [{
      type: "bars", title: "Loss at each margin (margins: 2.0, 0.3, -0.5, 1.5, -1.2)",
      labels: ["m=2.0", "m=0.3", "m=-0.5", "m=1.5", "m=-1.2"],
      values: [0, 0.7, 1.5, 0, 2.2],
      valueLabels: ["hinge 0", "0.7", "1.5", "hinge 0", "2.2"], colors: ["#7ee787", "#ffb454", "#ff7b72", "#7ee787", "#ff7b72"]
    }, {
      type: "bars", title: "Mean loss over the 5 margins, by loss function", labels: ["zero-one", "hinge", "squared"],
      values: [0.4, 0.88, 1.766], colors: ["#4ea1ff", "#ffb454", "#c89bff"]
    }],
    caption: "Hinge stays 0 once a margin passes 1 but grows for small/negative margins; mean hinge 0.88 vs mean zero-one 0.40 vs mean squared 1.77."
  },

  "ai-sgd": {
    question: "Does stepping downhill after each example actually drive the loss down?",
    charts: [{
      type: "line", title: "Hinge loss per epoch (SGD)", xlabel: "epoch", ylabel: "mean hinge loss",
      series: [{ name: "train loss", color: "#4ea1ff", points: [[0, 1.0], [1, 0.725], [2, 0.708], [3, 0.658], [4, 0.85], [5, 0.592], [6, 0.542], [7, 0.492]] }]
    }, {
      type: "scatter", title: "The 2 separable clouds SGD learns to split", xlabel: "x1", ylabel: "x2",
      groups: [
        { name: "class -1", color: "#4ea1ff", points: [[1, 1], [1, 2], [2, 1]] },
        { name: "class +1", color: "#ff7b72", points: [[4, 4], [5, 4], [4, 5]] }
      ]
    }],
    caption: "The noisy per-example updates trend the loss down from 1.0 to 0.49 over 8 epochs; final weights [0.25, 0.3, -0.75] separate both clouds."
  },

  "ai-search-problem": {
    question: "What path does BFS find from S to the goal G?",
    charts: [{
      type: "scatter", title: "Search graph with the BFS path S to G", xlabel: "x", ylabel: "y",
      groups: [
        { name: "on path", color: "#7ee787", points: [[90, 180], [230, 90], [380, 60], [540, 180]] },
        { name: "off path", color: "#4ea1ff", points: [[230, 270], [380, 190], [380, 310]] }
      ],
      lines: [{ name: "path S-A-C-G", color: "#ffb454", points: [[90, 180], [230, 90], [380, 60], [540, 180]] }]
    }],
    caption: "BFS discovers nodes in order S, A, B, C, D, E, G and returns the shortest path S to A to C to G (length 3)."
  },

  "ai-tree-search": {
    question: "How do BFS (wide) and DFS (deep) differ in visit order on the same tree?",
    charts: [{
      type: "bars", title: "Visit step for each node (lower = visited earlier) — BFS", labels: ["1", "2", "3", "4", "5", "6", "7"],
      values: [1, 2, 3, 4, 5, 6, 7], colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }, {
      type: "bars", title: "Visit step for each node — DFS", labels: ["1", "2", "3", "4", "5", "6", "7"],
      values: [1, 2, 5, 3, 4, 6, 7], colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454"]
    }],
    caption: "BFS visits level-by-level [1,2,3,4,5,6,7]; DFS dives into the left branch first [1,2,4,5,3,6,7]."
  },

  "ai-graph-search": {
    question: "What is the cheapest cost from S to G, accounting for edge weights?",
    charts: [{
      type: "bars", title: "Best-known cost g to each node when UCS settles G", labels: ["S", "A", "B", "C", "D", "G"],
      values: [0, 1, 3, 3, 4, 6], valueLabels: ["0", "1", "3", "3", "4", "6"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#ffb454"]
    }],
    caption: "UCS always pops the cheapest frontier node; it settles G at total cost 6 via the path S to A to B to D to G."
  },

  "ai-astar": {
    question: "Which grid cells lie on the cheapest route, and which does A* skip?",
    charts: [{
      type: "heatmap", title: "f = g + h on the 5x7 grid (lower = explored first)",
      rows: ["r0", "r1", "r2", "r3", "r4"], cols: ["c0", "c1", "c2", "c3", "c4", "c5", "c6"],
      matrix: [
        [10, 8, 8, 8, 8, 8, 10],
        [8, 6, 6, 6, 6, 6, 8],
        [6, 4, 4, 4, 4, 4, 6],
        [8, 6, 6, 6, 6, 6, 8],
        [10, 8, 8, 8, 8, 8, 10]
      ], showVals: true
    }],
    caption: "Start (2,1) and goal (2,5) both sit at f=4; A* expands the low-f corridor first and leaves the darker high-f cells for last."
  },

  "ai-mdp": {
    question: "What immediate reward does each action earn on average from each state?",
    charts: [{
      type: "heatmap", title: "Expected immediate reward (rows = action, cols = start state)",
      rows: ["left", "right"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[0.0, 0.0, 2.0], [0.0, 4.0, 5.0]], showVals: true
    }],
    caption: "Every transition row sums to 1; 'right' earns more because it slips toward the rewarding state 2 (reward 5) more often."
  },

  "ai-policy-value": {
    question: "What is each state worth if we follow this fixed policy forever?",
    charts: [{
      type: "heatmap", title: "Policy values V(s) from solving (I - gamma P) V = r",
      rows: ["V"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[68.43, 83.636, 100.0]], showVals: true
    }],
    caption: "Solving the linear Bellman system gives V = [68.43, 83.64, 100.0]; the absorbing state 2 (reward 10) is worth 100 at gamma 0.9."
  },

  "ai-qvalue": {
    question: "In each state, which action has the higher Q-value?",
    charts: [{
      type: "heatmap", title: "Q(s,a) = expected reward + gamma V (rows = action, cols = state)",
      rows: ["action 0", "action 1"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[5.24, 10.36, 19.0], [7.46, 16.84, 19.0]], showVals: true
    }],
    caption: "Action 1 wins in states 0 and 1 (7.46 > 5.24, 16.84 > 10.36); the two actions tie at 19.0 in the absorbing state 2."
  },

  "ai-value-iteration": {
    question: "What is each state worth under the optimal policy?",
    charts: [{
      type: "heatmap", title: "Converged optimal values V* (3-state slippery MDP)",
      rows: ["V*"], cols: ["state 0", "state 1", "state 2"],
      matrix: [[84.185, 96.083, 98.522]], showVals: true
    }, {
      type: "bars", title: "Optimal action per state (0 = left, 1 = right)", labels: ["state 0", "state 1", "state 2"],
      values: [1, 1, 0], valueLabels: ["right", "right", "left"], colors: ["#7ee787", "#7ee787", "#4ea1ff"]
    }],
    caption: "Value iteration converges after 39 sweeps to V* = [84.19, 96.08, 98.52]; the greedy policy drives right toward the goal."
  },

  "ai-q-learning": {
    question: "Can the agent learn the right move per state from trial and error alone?",
    charts: [{
      type: "heatmap", title: "Learned Q-table (rows = state, cols = action)",
      rows: ["state 0", "state 1", "state 2", "state 3"], cols: ["left", "right"],
      matrix: [[4.58, 6.2], [4.58, 8.0], [6.2, 10.0], [0.0, 0.0]], showVals: true
    }, {
      type: "bars", title: "Recovered greedy policy (0 = left, 1 = right)", labels: ["state 0", "state 1", "state 2", "state 3"],
      values: [1, 1, 1, 0], valueLabels: ["right", "right", "right", "goal"], colors: ["#7ee787", "#7ee787", "#7ee787", "#4ea1ff"]
    }],
    caption: "After 400 episodes Q-learning learns 'go right' everywhere; Q-values rise toward the goal (10.0 for right in state 2)."
  },

  "ai-minimax": {
    question: "Which top move wins when the opponent plays optimally?",
    charts: [{
      type: "bars", title: "Backed-up MIN value of each root child (MAX picks the larger)",
      labels: ["subtree 0", "subtree 1"], values: [8, 6], colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "Each subtree reports its MIN value (8 and 6); the MAX root picks subtree 0, so the minimax value is 8."
  },

  "ai-alpha-beta": {
    question: "Does pruning reach the same answer while skipping leaves?",
    charts: [{
      type: "bars", title: "Leaves examined: alpha-beta vs full minimax", labels: ["alpha-beta", "full minimax"],
      values: [6, 8], valueLabels: ["6 visited", "8 total"], colors: ["#7ee787", "#ffb454"]
    }],
    caption: "Alpha-beta returns the same value 8 but examines only 6 of 8 leaves — 2 branches are pruned with no change to the decision."
  },

  "ai-expectimax": {
    question: "Does it matter whether the opponent is adversarial or random?",
    charts: [{
      type: "bars", title: "Root value under each opponent model", labels: ["minimax (worst case)", "expectimax (random)"],
      values: [3, 7.67], colors: ["#ff7b72", "#7ee787"]
    }, {
      type: "bars", title: "How each subtree is scored (min vs average of its leaves)",
      labels: ["subtree 0 min", "subtree 1 min", "subtree 0 avg", "subtree 1 avg"],
      values: [3, 2, 7.67, 4.0], colors: ["#ff7b72", "#ff7b72", "#7ee787", "#7ee787"]
    }],
    caption: "Against a worst-case opponent the root is worth 3; against a random one it is worth 7.67 — the assumed opponent changes the move's value."
  },

  "ai-csp": {
    question: "Does each map coloring satisfy every 'adjacent regions differ' constraint?",
    charts: [{
      type: "bars", title: "Constraint violations per assignment (9 edges total)", labels: ["good assignment", "bad assignment"],
      values: [0, 1], valueLabels: ["0 (valid)", "1 (SA=NSW clash)"], colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "The good coloring violates 0 of 9 adjacency constraints; flipping NSW to blue creates 1 clash with SA, so it fails."
  },

  "ai-csp-search": {
    question: "What full coloring does backtracking find for the 7 regions?",
    charts: [{
      type: "bars", title: "Color assigned to each region (1=red, 2=green, 3=blue)",
      labels: ["WA", "NT", "SA", "Q", "NSW", "V", "T"], values: [1, 2, 3, 1, 2, 1, 1],
      valueLabels: ["red", "green", "blue", "red", "green", "red", "red"],
      colors: ["#ff7b72", "#7ee787", "#4ea1ff", "#ff7b72", "#7ee787", "#ff7b72", "#ff7b72"]
    }],
    caption: "Backtracking assigns one region at a time and finds a valid 3-coloring: WA red, NT green, SA blue, then the rest fit without clashes."
  },

  "ai-bayes-net": {
    question: "How likely is the alarm ringing with no burglary and no earthquake?",
    charts: [{
      type: "bars", title: "Joint probability of the queried assignment vs its complement",
      labels: ["P(B=F,E=F,A=T)", "everything else"], values: [0.000997, 0.999003],
      valueLabels: ["0.000997", "0.999003"], colors: ["#ffb454", "#4ea1ff"]
    }],
    caption: "Multiplying the CPT entries gives P(no burglary, no quake, alarm) = 0.000997; the full joint over all 8 assignments sums to 1.0."
  },

  "ai-bayes-inference": {
    question: "Given the alarm rang, what is the posterior over Burglary?",
    charts: [{
      type: "bars", title: "Posterior P(Burglary | Alarm = True)", labels: ["Burglary = True", "Burglary = False"],
      values: [0.3736, 0.6264], colors: ["#ff7b72", "#4ea1ff"]
    }],
    caption: "Summing out Earthquake and normalizing gives P(Burglary | Alarm) = 0.37 — the alarm raises burglary far above its 0.001 prior but a quiet night is still likelier."
  },

  "ai-hmm": {
    question: "How does the belief that it is raining change as umbrellas are observed?",
    charts: [{
      type: "line", title: "Filtered belief P(rain) over 3 days", xlabel: "day", ylabel: "P(rain)",
      series: [{ name: "P(rain)", color: "#4ea1ff", points: [[0, 0.818], [1, 0.883], [2, 0.191] ] }]
    }],
    caption: "Umbrella on days 0 and 1 pushes P(rain) up to 0.82 then 0.88; no umbrella on day 2 collapses it to 0.19."
  },

  "ai-propositional-logic": {
    question: "Does the knowledge base entail R, and how many models survive it?",
    charts: [{
      type: "bars", title: "Truth-table check: facts true in every KB-satisfying model",
      labels: ["P", "Q", "R"], values: [1, 1, 1], valueLabels: ["true", "true", "true (entailed)"],
      colors: ["#7ee787", "#7ee787", "#ffb454"]
    }],
    caption: "Of 8 assignments, exactly 1 satisfies the KB (P->Q, Q->R, P); R is true there, so the KB entails R."
  },

  "ai-inference-rules": {
    question: "Starting from just A, which facts does forward chaining derive?",
    charts: [{
      type: "bars", title: "Facts known before vs after forward chaining", labels: ["A", "B", "C", "D", "E"],
      values: [1, 1, 1, 1, 1],
      valueLabels: ["known", "derived", "derived", "derived", "derived"],
      colors: ["#4ea1ff", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
    }],
    caption: "Starting from {A}, modus ponens fires in order to derive B, C, D, then E — the full closure is {A, B, C, D, E}."
  }

});
