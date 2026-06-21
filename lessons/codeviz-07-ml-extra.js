/* =====================================================================
   CODEVIZ for MODULE 7 — Machine Learning — more.
   One window.CODEVIZ entry per lesson in 07-ml-extra.js.
   Numbers come from running code-07-ml-extra.js with numpy / scikit-learn.
   Chart types: line | scatter | bars.
   Colors: blue #4ea1ff, green #7ee787, amber #ffb454, red #ff7b72, purple #c89bff.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "mlx-newton": {
    question: "Can one step using curvature land on the minimum?",
    charts: [
      {
        type: "line",
        title: "Newton iterates jump to the bottom of the parabola",
        xlabel: "t (parameter)",
        ylabel: "J(t) = 3t^2 - 12t + 7",
        series: [
          {
            name: "cost J(t)",
            color: "#4ea1ff",
            points: [
              [-1, 22], [-0.5, 13.75], [0, 7], [0.5, 1.75], [1, -2],
              [1.5, -4.25], [2, -5], [2.5, -4.25], [3, -2], [3.5, 1.75],
              [4, 7], [4.5, 13.75], [5, 22]
            ]
          },
          {
            name: "Newton iterates (start 5 -> min 2)",
            color: "#c89bff",
            points: [[5, 22], [2, -5]]
          }
        ]
      }
    ],
    caption: "Because J is a true parabola its curvature is constant, so one Newton step jumps from t=5 straight onto the minimum at t=2."
  },

  "mlx-lwr": {
    question: "Can we fit a curve without a single global model?",
    charts: [
      {
        type: "scatter",
        title: "Curvy data with a locally-weighted fit (tau = 0.8)",
        xlabel: "x",
        ylabel: "y = sin(x) + 0.25x + noise",
        groups: [
          {
            name: "training data",
            color: "#4ea1ff",
            points: [
              [-5, -0.026], [-4.487, 0], [-3.974, 0.026], [-3.462, -0.408],
              [-2.949, -0.944], [-2.436, -1.236], [-1.923, -1.305], [-1.41, -1.273],
              [-0.897, -0.782], [-0.385, -0.424], [0.128, -0.223], [0.641, 0.888],
              [1.154, 1.543], [1.667, 1.419], [2.179, 1.595], [2.692, 1.131],
              [3.205, 0.605], [3.718, 0.332], [4.231, 0.356], [4.744, 0.128], [5, 0.246]
            ]
          }
        ],
        lines: [
          {
            name: "LWR fit (refit a line at every x)",
            color: "#ffb454",
            points: [
              [-5, 0.053], [-4.487, -0.047], [-3.974, -0.255], [-3.462, -0.53],
              [-2.949, -0.805], [-2.436, -1.011], [-1.923, -1.089], [-1.41, -1.007],
              [-0.897, -0.758], [-0.385, -0.369], [0.128, 0.109], [0.641, 0.591],
              [1.154, 0.972], [1.667, 1.178], [2.179, 1.183], [2.692, 1.01],
              [3.205, 0.744], [3.718, 0.49], [4.231, 0.314], [4.744, 0.214], [5, 0.181]
            ]
          }
        ]
      }
    ],
    caption: "No global formula: at each x we refit a weighted line, and stitched together they trace the bending shape of the data."
  },

  "mlx-cross-validation": {
    question: "How good is the model when every slice gets a turn as the test set?",
    charts: [
      {
        type: "bars",
        title: "Per-fold MSE and the mean across 5 folds",
        labels: ["fold 1", "fold 2", "fold 3", "fold 4", "fold 5", "MEAN"],
        values: [270.344, 117.574, 142.784, 207.444, 104.345, 168.498],
        valueLabels: ["270.3", "117.6", "142.8", "207.4", "104.3", "168.5"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787"]
      }
    ],
    caption: "Folds scatter from 104 to 270 MSE; averaging the 5 honest tests gives the trusted CV error of 168.5."
  },

  "mlx-model-selection": {
    question: "Which polynomial degree is best?",
    charts: [
      {
        type: "line",
        title: "AIC and BIC vs polynomial degree (minimum = best)",
        xlabel: "polynomial degree",
        ylabel: "criterion score (lower is better)",
        series: [
          {
            name: "AIC",
            color: "#4ea1ff",
            points: [[1, 270.62], [2, 92.38], [3, 94.34], [4, 95.31], [5, 97.25], [6, 98.93], [7, 100.44]]
          },
          {
            name: "BIC",
            color: "#c89bff",
            points: [[1, 276.91], [2, 100.76], [3, 104.81], [4, 107.88], [5, 111.91], [6, 115.68], [7, 119.29]]
          }
        ]
      }
    ],
    caption: "Both AIC and BIC bottom out at degree 2, exactly the true degree of the data; higher degrees only add penalty."
  },

  "mlx-clustering-metrics": {
    question: "How many clusters does the data really have?",
    charts: [
      {
        type: "line",
        title: "Average silhouette vs k (peak = best k)",
        xlabel: "number of clusters k",
        ylabel: "average silhouette score",
        series: [
          {
            name: "avg silhouette",
            color: "#7ee787",
            points: [[2, 0.4933], [3, 0.5571], [4, 0.4596], [5, 0.3989], [6, 0.3339]]
          }
        ]
      }
    ],
    caption: "The silhouette peaks at k=3 (0.557), correctly recovering the three real blobs in the data."
  },

  "mlx-error-analysis": {
    question: "Which feature block actually earns its keep?",
    charts: [
      {
        type: "bars",
        title: "Accuracy lost when each feature block is removed",
        labels: ["feat0-1", "feat2-3", "feat4-5", "feat6-7"],
        values: [0.0875, -0.0150, 0.0050, 0.0300],
        valueLabels: ["+8.75%", "-1.50%", "+0.50%", "+3.00%"],
        colors: ["#ffb454", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
      }
    ],
    caption: "Removing feat0-1 costs 8.75% accuracy (the biggest drop), so it contributes most; feat2-3 even slightly hurts."
  }

});
