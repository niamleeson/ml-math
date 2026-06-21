/* Per-lesson CODE VISUALIZATIONS for Module 9B — Classical ML (beyond the cheat sheet).
   Each entry: { question, charts:[<chartSpec>], caption }.
   All numbers below are REAL outputs from running the lesson code in
   code-09-classical-b.js with python3 (numpy / scikit-learn). Merged into
   window.CODEVIZ by lesson id. */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "cls-stacking": {
    question: "Does stacking the base models beat each one alone?",
    charts: [
      {
        type: "bars",
        title: "5-fold accuracy: base models vs the stacked ensemble",
        labels: ["RandomForest", "kNN", "Stacked"],
        values: [0.942, 0.948, 0.953],
        valueLabels: ["0.942", "0.948", "0.953"],
        colors: ["#4ea1ff", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "The stacked ensemble (0.953) edges out both base models, so the learned combiner adds accuracy on top of the best single model."
  },

  "cls-anomaly": {
    question: "Which points are anomalies?",
    charts: [
      {
        type: "scatter",
        title: "Isolation Forest: normal points vs flagged outliers",
        xlabel: "feature 1",
        ylabel: "feature 2",
        groups: [
          { name: "normal", color: "#4ea1ff", points: [[1.09,-0.05],[0.32,-0.36],[-1.94,-1.31],[-0.53,-0.24],[1.3,-0.35],[-1.19,-2.4],[-0.76,0.81],[-1.42,-0.83],[-0.22,-0.53],[-0.7,-1.27],[-0.65,0.68],[-0.62,0.04],[0.36,-0.39],[-1.53,2.03],[-0.46,0.22],[0.84,1.16],[-1.9,-0.11],[-0.47,0.59],[1.2,0.64],[-0.85,-0.51],[-0.58,0.11],[1.23,-1.11],[0.35,-0.47],[-1.26,0.83],[-2.37,1.23],[0.05,2.0],[1.3,0.95],[0.19,-0.63],[0.58,1.29],[-0.29,1.57],[-1.09,-0.6],[-1.17,-1.43],[1.58,-1.72],[-0.29,0.3],[-0.16,-1.07],[0.36,-1.21],[0.06,0.41],[0.34,0.42],[0.26,-0.31],[-0.15,-0.63],[0.5,0.99],[1.65,0.92],[0.9,0.09],[1.46,1.96],[-0.37,0.22]] },
          { name: "anomaly (flagged)", color: "#ff7b72", points: [[-0.87,3.07],[-3.11,-1.14],[0.56,-3.77],[-3.92,1.04],[5.5,2.6],[5.77,0.89],[5.8,4.04],[3.34,4.66],[0.34,-3.28],[3.33,-3.96],[2.06,3.13]] }
        ]
      }
    ],
    caption: "The dense central blob is normal; the 11 scattered points far from the crowd are flagged red as anomalies."
  },

  "cls-recommender": {
    question: "Can we fill the blank ratings the users never gave?",
    charts: [
      {
        type: "heatmap",
        title: "Observed ratings (blank cells were hidden from the model)",
        rows: ["U1", "U2", "U3", "U4", "U5", "U6"],
        cols: ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8"],
        matrix: [[null,-0.7,-0.6,0.2,-0.1,0.7,-0.2,0.2],[-0.3,null,-0.5,0.5,-0.7,-0.2,-0.8,null],[1.8,null,-1.2,-2.5,null,null,-2.2,0.6],[null,null,null,null,-1.3,null,null,-0.8],[-2.1,null,null,2.3,-1.1,null,4.8,null],[-1.1,1.4,1.1,1.2,-1.0,-1.9,1.0,null]],
        showVals: true
      },
      {
        type: "heatmap",
        title: "Reconstructed matrix (every blank now filled by rank-3 SVD)",
        rows: ["U1", "U2", "U3", "U4", "U5", "U6"],
        cols: ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8"],
        matrix: [[0.2,-0.4,-0.3,-0.0,0.1,0.5,-0.3,0.2],[-0.2,-0.3,-0.1,0.4,-0.5,-0.2,-0.4,-0.0],[0.8,-0.9,-1.2,-1.6,0.9,0.9,-1.9,0.4],[-0.6,0.8,0.8,0.9,-0.7,-1.1,0.9,-0.4],[-1.2,2.7,2.3,1.4,-0.8,-2.5,3.3,-0.9],[-0.8,0.8,0.9,0.9,-1.0,-1.7,0.5,-0.5]],
        showVals: true
      }
    ],
    caption: "Factoring the sparse table fills every blank; reconstruction RMSE is 0.517 on observed cells and 0.858 on the held-out hidden ones."
  },

  "cls-tsne": {
    question: "Is there hidden structure in the 10-D data?",
    charts: [
      {
        type: "scatter",
        title: "t-SNE projection of 10-D data to 2-D, colored by true cluster",
        xlabel: "t-SNE 1",
        ylabel: "t-SNE 2",
        groups: [
          { name: "cluster A", color: "#4ea1ff", points: [[16.6,-3.1],[18.9,-5.7],[16.3,-5.0],[16.7,-3.5],[18.8,-3.7],[17.2,-4.0],[17.8,-4.3],[16.9,-3.2],[17.5,-2.9],[17.4,-4.6],[15.9,-3.6],[18.2,-3.2],[15.9,-4.5],[17.3,-5.6],[17.2,-5.5],[17.8,-4.5]] },
          { name: "cluster B", color: "#7ee787", points: [[-4.6,14.4],[-4.3,16.0],[-6.7,17.1],[-4.6,16.8],[-4.6,15.3],[-6.7,16.2],[-6.8,16.7],[-5.6,15.7],[-4.6,16.5],[-4.8,15.9],[-4.2,14.8],[-6.0,16.3],[-5.3,14.8],[-6.4,15.5],[-4.8,15.7],[-6.4,16.2]] },
          { name: "cluster C", color: "#ffb454", points: [[-6.4,-10.2],[-6.9,-10.4],[-10.0,-10.2],[-8.2,-9.5],[-9.1,-9.2],[-8.4,-12.3],[-9.1,-10.5],[-7.8,-9.6],[-8.9,-11.1],[-6.3,-11.3],[-6.4,-9.9],[-9.1,-11.7],[-8.0,-11.7],[-7.3,-10.1],[-8.6,-10.3],[-7.5,-11.4]] }
        ]
      }
    ],
    caption: "Yes — the three colored groups land in well-separated blobs (between/within gap ratio 22.63), so the hidden cluster structure is real."
  },

  "cls-factor-analysis": {
    question: "How does each hidden factor load onto the six signals?",
    charts: [
      {
        type: "bars",
        title: "Factor 1 loadings across the six observed signals",
        labels: ["x1", "x2", "x3", "x4", "x5", "x6"],
        values: [-1.48, -0.13, -0.4, -0.21, 1.08, 0.32],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
      },
      {
        type: "bars",
        title: "Factor 2 loadings across the six observed signals",
        labels: ["x1", "x2", "x3", "x4", "x5", "x6"],
        values: [-0.2, 0.34, -0.34, 0.13, -0.77, -0.27],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"]
      }
    ],
    caption: "Each factor loads with a different strength and sign on each signal — that loading pattern is exactly how two hidden causes drive six correlated measurements."
  },

  "cls-svr": {
    question: "Where does the SVR curve fit, and which points sit inside the tube?",
    charts: [
      {
        type: "scatter",
        title: "SVR fit of a noisy sine with the epsilon-tube",
        xlabel: "x",
        ylabel: "y",
        groups: [
          { name: "noisy data", color: "#4ea1ff", points: [[0.02,0.1],[0.1,0.17],[0.1,0.18],[0.17,0.03],[0.2,0.19],[0.24,0.16],[0.25,0.1],[0.35,0.29],[0.5,0.51],[0.69,0.63],[0.75,0.78],[1.19,0.96],[1.39,1.02],[1.62,0.99],[1.86,0.93],[1.93,0.94],[2.02,0.82],[2.03,0.85],[2.19,0.67],[2.33,0.71],[2.35,0.59],[2.43,0.42],[2.64,0.46],[2.76,0.38],[2.98,0.25],[3.25,-0.12],[3.48,-0.53],[3.69,-0.46],[3.74,-0.61],[3.82,-0.68],[3.88,-0.54],[4.11,-0.96],[4.13,-0.73],[4.27,-0.91],[4.32,-0.95],[4.38,-0.99],[4.41,-1.02],[4.71,-0.93],[4.72,-0.92],[4.93,-0.84],[5.14,-0.99],[5.18,-0.84],[5.18,-0.91],[5.26,-0.8],[5.34,-0.81],[5.48,-0.42],[5.56,-0.72],[5.59,-0.5],[5.6,-0.53],[5.65,-0.64]] }
        ],
        lines: [
          { name: "SVR fit", color: "#7ee787", points: [[0.0,-0.01],[0.15,0.14],[0.31,0.29],[0.46,0.45],[0.62,0.59],[0.77,0.71],[0.92,0.82],[1.08,0.9],[1.23,0.96],[1.38,0.99],[1.54,0.99],[1.69,0.97],[1.85,0.93],[2.0,0.86],[2.15,0.79],[2.31,0.69],[2.46,0.59],[2.62,0.47],[2.77,0.34],[2.92,0.21],[3.08,0.06],[3.23,-0.09],[3.38,-0.24],[3.54,-0.39],[3.69,-0.53],[3.85,-0.66],[4.0,-0.78],[4.15,-0.88],[4.31,-0.95],[4.46,-1.0],[4.62,-1.02],[4.77,-1.01],[4.92,-0.97],[5.08,-0.92],[5.23,-0.84],[5.38,-0.75],[5.54,-0.66],[5.69,-0.56],[5.85,-0.46],[6.0,-0.37]] },
          { name: "tube upper", color: "#ffb454", points: [[0.0,0.09],[0.15,0.24],[0.31,0.39],[0.46,0.55],[0.62,0.69],[0.77,0.81],[0.92,0.92],[1.08,1.0],[1.23,1.06],[1.38,1.09],[1.54,1.09],[1.69,1.07],[1.85,1.03],[2.0,0.96],[2.15,0.89],[2.31,0.79],[2.46,0.69],[2.62,0.57],[2.77,0.44],[2.92,0.31],[3.08,0.16],[3.23,0.01],[3.38,-0.14],[3.54,-0.29],[3.69,-0.43],[3.85,-0.56],[4.0,-0.68],[4.15,-0.78],[4.31,-0.85],[4.46,-0.9],[4.62,-0.92],[4.77,-0.91],[4.92,-0.87],[5.08,-0.82],[5.23,-0.74],[5.38,-0.65],[5.54,-0.56],[5.69,-0.46],[5.85,-0.36],[6.0,-0.27]] },
          { name: "tube lower", color: "#ffb454", points: [[0.0,-0.11],[0.15,0.04],[0.31,0.19],[0.46,0.35],[0.62,0.49],[0.77,0.61],[0.92,0.72],[1.08,0.8],[1.23,0.86],[1.38,0.89],[1.54,0.89],[1.69,0.87],[1.85,0.83],[2.0,0.76],[2.15,0.69],[2.31,0.59],[2.46,0.49],[2.62,0.37],[2.77,0.24],[2.92,0.11],[3.08,-0.04],[3.23,-0.19],[3.38,-0.34],[3.54,-0.49],[3.69,-0.63],[3.85,-0.76],[4.0,-0.88],[4.15,-0.98],[4.31,-1.05],[4.46,-1.1],[4.62,-1.12],[4.77,-1.11],[4.92,-1.07],[5.08,-1.02],[5.23,-0.94],[5.38,-0.85],[5.54,-0.76],[5.69,-0.66],[5.85,-0.56],[6.0,-0.47]] }
        ]
      }
    ],
    caption: "The green curve tracks the sine through the noise; 39 of 120 points became support vectors, the rest sit quietly inside the amber epsilon-tube."
  },

  "cls-bandits": {
    question: "Which arm is best, and does UCB beat random pulling?",
    charts: [
      {
        type: "line",
        title: "Cumulative reward over 2000 rounds: UCB vs random",
        xlabel: "round",
        ylabel: "cumulative reward",
        series: [
          { name: "UCB1", color: "#7ee787", points: [[3,3.0],[83,50.0],[163,90.0],[243,137.0],[323,180.0],[403,233.0],[483,289.0],[563,344.0],[643,401.0],[723,453.0],[803,503.0],[883,551.0],[963,610.0],[1043,671.0],[1123,724.0],[1203,775.0],[1283,836.0],[1363,901.0],[1443,941.0],[1523,1000.0],[1603,1053.0],[1683,1108.0],[1763,1164.0],[1843,1227.0],[1923,1286.0],[1999,1345.0]] },
          { name: "random", color: "#ff7b72", points: [[3,2.0],[83,39.0],[163,80.0],[243,122.0],[323,160.0],[403,197.0],[483,238.0],[563,276.0],[643,314.0],[723,362.0],[803,403.0],[883,458.0],[963,498.0],[1043,542.0],[1123,583.0],[1203,622.0],[1283,669.0],[1363,710.0],[1443,756.0],[1523,791.0],[1603,825.0],[1683,863.0],[1763,909.0],[1843,955.0],[1923,989.0],[1999,1024.0]] }
        ]
      },
      {
        type: "bars",
        title: "Total pulls per arm by UCB1 (true win rates 0.30 / 0.55 / 0.70)",
        labels: ["arm 0", "arm 1", "arm 2"],
        values: [58, 229, 1713],
        colors: ["#4ea1ff", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Arm 2 is best — UCB1 quickly concentrates its pulls there (1713 of 2000) and ends with more cumulative reward than random."
  }

});
