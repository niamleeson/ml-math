/* Per-lesson visualizations of the code's data & results. Merged into window.CODEVIZ by id.
   { question?, charts:[ chartSpec ], caption? }  — chartSpec types: bars/line/scatter/roc/confusion/heatmap.
   Numbers below are REAL outputs from running each lesson's Python (numpy/stdlib). */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "aix-relaxation": {
    question: "What does the relaxed (walls-removed) heuristic look like across the whole grid?",
    charts: [{
      type: "heatmap", title: "Relaxed heuristic h = Manhattan steps to goal (4,4)",
      rows: ["row 0", "row 1", "row 2", "row 3", "row 4"],
      cols: ["col 0", "col 1", "col 2", "col 3", "col 4"],
      matrix: [[8, 7, 6, 5, 4], [7, 6, 5, 4, 3], [6, 5, 4, 3, 2], [5, 4, 3, 2, 1], [4, 3, 2, 1, 0]],
      showVals: true
    }],
    caption: "Each cell holds its straight-line distance to the goal; from start (0,0) h = 8, while the true walled cost is 16, so h never overestimates (admissible)."
  },

  "aix-structured-perceptron": {
    question: "Does one perceptron update flip the score so the true path wins?",
    charts: [{
      type: "bars", title: "Path scores before vs after the single update",
      labels: ["true path", "wrong path"],
      values: [2, -2],
      valueLabels: ["+2", "-2"],
      colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "Starting from all-zero weights both paths tie at 0; one update (+1 to true edges, -1 to wrong edges) makes the true path score +2 and the wrong path -2, a winning gap of 4."
  },

  "aix-monte-carlo": {
    question: "Does averaging real episode returns converge to the true Q-value?",
    charts: [{
      type: "line", title: "Running mean of sampled returns vs episodes",
      xlabel: "episodes (log-ish steps)", ylabel: "Q-hat estimate",
      series: [
        { name: "running Q-hat", color: "#4ea1ff", points: [[1, 3.122], [2, 3.851], [5, 4.936], [10, 5.26], [25, 4.632], [50, 4.787], [100, 4.54], [250, 4.5], [500, 4.534], [1000, 4.573], [2000, 4.587]] },
        { name: "true Q ~ 4.59", color: "#7ee787", points: [[1, 4.587], [2000, 4.587]] }
      ]
    }],
    caption: "The running average wobbles early (5.26 at 10 episodes) then settles onto the true expected return ~4.59 by 2000 episodes, exactly as the law of large numbers predicts."
  },

  "aix-sarsa-td": {
    question: "How does value flow back from the goal toward the start over TD sweeps?",
    charts: [{
      type: "line", title: "V(s0) climbing toward true discounted value over sweeps",
      xlabel: "sweep", ylabel: "value estimate",
      series: [
        { name: "V(s0)", color: "#4ea1ff", points: [[1, 0.041], [2, 0.123], [3, 0.226], [5, 0.418], [10, 0.626], [20, 0.656]] },
        { name: "true V(s0) = 0.656", color: "#7ee787", points: [[1, 0.656], [20, 0.656]] }
      ]
    }],
    caption: "Each TD(0) sweep seeps the +1 goal reward one cell further back; V(s0) rises from 0.04 to 0.656, matching the true discounted distance gamma^4 exactly (max error 0)."
  },

  "aix-game-theory": {
    question: "Which cell of the prisoner's dilemma is the Nash equilibrium?",
    charts: [{
      type: "heatmap", title: "Sum of payoffs A+B per cell (Nash = Defect,Defect highlighted by value)",
      rows: ["A: Cooperate", "A: Defect"],
      cols: ["B: Cooperate", "B: Defect"],
      matrix: [[-2, -3], [-3, -4]],
      showVals: true
    }],
    caption: "Defect strictly dominates for both players, so the unique Nash cell is (Defect, Defect) at A+B = -4 — worse for the pair than (Cooperate, Cooperate) at -2, yet individually stable."
  },

  "aix-variable-elimination": {
    question: "What factor results from summing variable B out of f1 and f2?",
    charts: [{
      type: "bars", title: "New factor g(A,C) values after eliminating B",
      labels: ["g(0,0)", "g(0,1)", "g(1,0)", "g(1,1)"],
      values: [5, 5, 7, 4],
      valueLabels: ["5", "5", "7", "4"],
      colors: ["#4ea1ff", "#4ea1ff", "#ffb454", "#4ea1ff"]
    }],
    caption: "einsum('ab,bc->ac') computes g(A,C) = sum_B f1(A,B)*f2(B,C); g(0,0)=2*1+1*3=5 and the largest entry g(1,0)=7, leaving a single factor over A and C with B gone."
  },

  "aix-gibbs-particle": {
    question: "Does the Gibbs sampler's visit histogram converge to the true posterior?",
    charts: [{
      type: "bars", title: "Gibbs estimate vs true posterior over (X,Y) cells (20k samples)",
      labels: ["(0,0)", "(0,1)", "(1,0)", "(1,1)"],
      values: [0.098, 0.201, 0.297, 0.405],
      valueLabels: ["0.098", "0.201", "0.297", "0.405"],
      colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }],
    caption: "Resampling one variable at a time from its conditional drives the empirical cell fractions to [0.098, 0.201, 0.297, 0.405], matching the true posterior [0.1, 0.2, 0.3, 0.4] within 0.005."
  },

  "aix-markov-blanket": {
    question: "Given only its Markov blanket, what is node X's local conditional posterior?",
    charts: [{
      type: "bars", title: "Local conditional posterior P(X | blanket) from blanket factors",
      labels: ["X = 1", "X = 0"],
      values: [0.789, 0.211],
      valueLabels: ["0.789", "0.211"],
      colors: ["#7ee787", "#ff7b72"]
    }],
    caption: "Using only parent and child factors (X=1 scores 0.6*0.5=0.30, X=0 scores 0.4*0.2=0.08), X's posterior is 0.789 vs 0.211 — the rest of the net cancels, which is why Gibbs only needs the blanket {A,B,C,D,Y,Z}."
  },

  "aix-forward-backward": {
    question: "What is the smoothed posterior over the hidden state at each time step?",
    charts: [{
      type: "line", title: "Smoothed P(H = state 1 | all evidence) per time step",
      xlabel: "time step", ylabel: "P(H = state 1 | E)",
      series: [
        { name: "P(state 1)", color: "#4ea1ff", points: [[1, 0.811], [2, 0.26], [3, 0.792]] }
      ]
    }],
    caption: "Multiplying forward alpha by backward beta and normalizing gives smoothed beliefs [0.811, 0.26, 0.792] for state 1; the middle step dips because its observation favors state 2, using future as well as past evidence."
  },

  "aix-lda-topic": {
    question: "Did the collapsed Gibbs sampler separate the two hidden topics' words?",
    charts: [{
      type: "heatmap", title: "Recovered topic-word distributions phi (rows = topics)",
      rows: ["topic 0", "topic 1"],
      cols: ["word 0", "word 1", "word 2", "word 3"],
      matrix: [[0.488, 0.488, 0.012, 0.012], [0.012, 0.012, 0.488, 0.488]],
      showVals: true
    }],
    caption: "After 300 Gibbs sweeps each topic concentrates ~0.49 mass on its own word pair (topic 0 -> words 0,1; topic 1 -> words 2,3), cleanly recovering the two clusters with near-zero cross-leakage."
  },

  "aix-fol": {
    question: "How many ground facts can resolution derive on top of the asserted ones?",
    charts: [{
      type: "bars", title: "Facts known: before vs after one unify + resolve step",
      labels: ["before (given)", "after resolution"],
      values: [1, 2],
      valueLabels: ["1", "2"],
      colors: ["#ffb454", "#7ee787"]
    }],
    caption: "Unifying Knows(x,John) with Knows(Alice,y) yields {x/Alice, y/John}; resolving the fact P(a,b) against the rule not-P(a,b) or Q(a) cancels the literal and derives the new fact Q(a), growing known facts from 1 to 2."
  }

});
