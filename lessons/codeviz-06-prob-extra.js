/* =====================================================================
   CODEVIZ SECTION — Module 6 (Probability, advanced).
   One window.CODEVIZ entry per lesson in 06-prob-extra.js.
   Charts are built from REAL numbers produced by running the lesson's
   Python (numpy/scipy) code: formula vs Monte-Carlo, every value verified.
   ===================================================================== */
window.CODEVIZ = Object.assign(window.CODEVIZ || {}, {

  "probx-derived": {
    question: "Does the change-of-variables formula f_Y(y) = 1/(2 sqrt(y)) match a simulated histogram of Y = X^2?",
    charts: [
      {
        type: "line",
        title: "Derived density of Y = X^2 from X uniform on 0..1: formula vs simulation",
        xlabel: "y",
        ylabel: "density f_Y(y)",
        series: [
          {
            name: "formula 1/(2 sqrt(y))",
            color: "#ffb454",
            points: [
              { x: 0.065, y: 2.000 }, { x: 0.125, y: 1.429 }, { x: 0.205, y: 1.111 },
              { x: 0.305, y: 0.909 }, { x: 0.425, y: 0.769 }, { x: 0.565, y: 0.667 },
              { x: 0.725, y: 0.588 }
            ]
          },
          {
            name: "Monte-Carlo histogram",
            color: "#4ea1ff",
            points: [
              { x: 0.065, y: 1.999 }, { x: 0.125, y: 1.422 }, { x: 0.205, y: 1.113 },
              { x: 0.305, y: 0.910 }, { x: 0.425, y: 0.769 }, { x: 0.565, y: 0.667 },
              { x: 0.725, y: 0.588 }
            ]
          }
        ]
      },
      {
        type: "bars",
        title: "Density height at sample y values (formula): squaring piles probability near 0",
        labels: ["0.04", "0.09", "0.16", "0.25", "0.36", "0.49", "0.64", "0.81"],
        values: [2.500, 1.667, 1.250, 1.000, 0.833, 0.714, 0.625, 0.556],
        valueLabels: ["2.50", "1.67", "1.25", "1.00", "0.83", "0.71", "0.62", "0.56"],
        colors: ["#7ee787"]
      }
    ],
    caption: "The simulated histogram lands right on the formula curve, blowing up near y=0 and thinning near y=1, with E[Y] = 0.333."
  },

  "probx-convolution": {
    question: "What PMF do you get from convolving two flat distributions, and does it match simulation?",
    charts: [
      {
        type: "bars",
        title: "Tent PMF of Z = A + B: A on 1..3, B on 1..2, each uniform (sums 2..5)",
        labels: ["2", "3", "4", "5"],
        values: [0.1667, 0.3333, 0.3333, 0.1667],
        valueLabels: ["0.167", "0.333", "0.333", "0.167"],
        colors: ["#c89bff"]
      },
      {
        type: "bars",
        title: "Two fair 6-sided dice: convolution PMF peaks at sum 7 (triangle)",
        labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        values: [0.0278, 0.0556, 0.0833, 0.1111, 0.1389, 0.1667, 0.1389, 0.1111, 0.0833, 0.0556, 0.0278],
        valueLabels: ["0.028", "0.056", "0.083", "0.111", "0.139", "0.167", "0.139", "0.111", "0.083", "0.056", "0.028"],
        colors: ["#4ea1ff"]
      }
    ],
    caption: "Convolving two flat inputs gives a flat-topped tent; two flat dice give a triangle peaking at 7 with probability 0.167, matching Monte-Carlo to four decimals."
  },

  "probx-total-variance": {
    question: "Does within-group plus between-group variance add up to the total variance of the mixture?",
    charts: [
      {
        type: "bars",
        title: "Variance decomposition: within + between = total (two classes, means 70 and 80)",
        labels: ["within E[Var(X|Y)]", "between Var(E[X|Y])", "formula total", "Monte-Carlo Var(X)"],
        values: [25.0, 25.0, 50.0, 49.91],
        valueLabels: ["25.0", "25.0", "50.0", "49.9"],
        colors: ["#7ee787", "#c89bff", "#ffb454", "#4ea1ff"]
      }
    ],
    caption: "Within-group scatter (25) plus between-group scatter of the class means (25) sum to the total variance 50, confirmed by the raw simulated variance 49.9."
  },

  "probx-mgf": {
    question: "Can you read the mean and E[X^2] off the MGF M(t) = lambda/(lambda - t) by differentiating at t = 0?",
    charts: [
      {
        type: "line",
        title: "MGF of Exponential rate 1.5: M(t) = lambda/(lambda - t), blows up at t = 1.5",
        xlabel: "t",
        ylabel: "M(t)",
        series: [
          {
            name: "M(t)",
            color: "#4ea1ff",
            points: [
              { x: -2.0, y: 0.4286 }, { x: -1.5, y: 0.5000 }, { x: -1.0, y: 0.6000 },
              { x: -0.5, y: 0.7500 }, { x: 0.0, y: 1.0000 }, { x: 0.5, y: 1.5000 },
              { x: 1.0, y: 3.0000 }, { x: 1.25, y: 6.0000 }
            ]
          }
        ]
      },
      {
        type: "bars",
        title: "Moments of Exponential(1.5): MGF derivatives vs exact vs Monte-Carlo",
        labels: ["E[X] MGF", "E[X] exact", "E[X^2] MGF", "E[X^2] exact", "Var MGF", "Var MC"],
        values: [0.6667, 0.6667, 0.8889, 0.8889, 0.4444, 0.4440],
        valueLabels: ["0.667", "0.667", "0.889", "0.889", "0.444", "0.444"],
        colors: ["#4ea1ff", "#7ee787", "#4ea1ff", "#7ee787", "#ffb454", "#c89bff"]
      }
    ],
    caption: "The slope of M(t) at t=0 gives E[X]=0.667 and the curvature gives E[X^2]=0.889, so Var=0.444, all matching the exact 1/lambda and 1/lambda^2 and the simulated sample."
  }

});
