/* Practical Statistics for Data Scientists (Bruce & Bruce, O'Reilly 2017) —
   Chapter 4 "Regression and Prediction". Self-registering book lessons. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Practical Statistics";
  const BOOK = "Practical Statistics for Data Scientists";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1 — Simple Linear Regression
  B({
    id: "ps-ch4-simple-linear-regression",
    chapter: "Chapter 4",
    title: "Simple linear regression",
    tagline: "One predictor, one response, joined by a straight line fit to minimize squared error.",
    sections: [
      {
        h: "What regression adds beyond correlation",
        body:
          "<p>Simple linear regression models how the magnitude of one variable relates to the magnitude of a " +
          "second: as $X$ rises, $Y$ rises (or falls). The book contrasts this with correlation. Correlation only " +
          "measures the <em>strength</em> of an association and treats the two variables as interchangeable. " +
          "Regression goes further: it <em>quantifies the nature</em> of the relationship by predicting the " +
          "response $Y$ from the predictor $X$.</p>" +
          "<p>The vocabulary the book uses: the variable we predict is the <strong>response</strong> (also called " +
          "the dependent variable, target, or outcome, $Y$). The variable we predict from is the " +
          "<strong>predictor</strong> (independent variable, feature, $X$). One row of predictor-and-outcome values " +
          "is a <strong>record</strong>.</p>"
      },
      {
        h: "The regression equation",
        body:
          "<p>The straight-line relationship is written as</p>" +
          "<p>$$Y = b_0 + b_1 X$$</p>" +
          "<p>read as &quot;$Y$ equals $b_1$ times $X$ plus a constant $b_0$.&quot; Here $b_0$ is the " +
          "<strong>intercept</strong> (the predicted $Y$ when $X = 0$) and $b_1$ is the <strong>regression " +
          "coefficient</strong> or <strong>slope</strong> for $X$. In machine-learning language, $Y$ is the target " +
          "and $X$ is a feature.</p>" +
          "<p>The book's running example is occupational lung data: how many years a worker was exposed to cotton " +
          "dust ($\\text{Exposure}$) versus a measure of lung capacity ($\\text{PEFR}$, peak expiratory flow rate). " +
          "The model is $\\text{PEFR} = b_0 + b_1 \\, \\text{Exposure}$. Fitting it (R's $\\text{lm}$ function) gives:</p>" +
          "<ul class=\"steps\">" +
          "<li>Intercept $b_0 = 424.583$ — the predicted PEFR for a worker with zero years of exposure.</li>" +
          "<li>Slope $b_1 = -4.185$ — each additional year of cotton-dust exposure lowers predicted PEFR by 4.185.</li>" +
          "</ul>" +
          "<p>So the fitted line is $\\text{PEFR} = 424.583 - 4.185 \\, \\text{Exposure}$. The scatter is so noisy " +
          "that the relationship is hard to see by eye, which is exactly why we fit a line.</p>"
      },
      {
        h: "Fitted values and residuals",
        body:
          "<p>Real data does not fall exactly on a line, so the equation carries an explicit error term $e_i$:</p>" +
          "<p>$$Y_i = b_0 + b_1 X_i + e_i$$</p>" +
          "<p>The <strong>fitted</strong> (or predicted) values, written $\\hat{Y}_i$, come from the estimated line:</p>" +
          "<p>$$\\hat{Y}_i = \\hat{b}_0 + \\hat{b}_1 X_i$$</p>" +
          "<p>The hats on $\\hat{b}_0$ and $\\hat{b}_1$ flag these as <em>estimates</em> rather than known true " +
          "values — the estimate carries uncertainty, whereas the true value is fixed. The <strong>residuals</strong> " +
          "$\\hat{e}_i$ are the leftover errors, found by subtracting each fitted value from the observed value:</p>" +
          "<p>$$\\hat{e}_i = Y_i - \\hat{Y}_i$$</p>" +
          "<p>In the lung-data figure, the residuals are the vertical distances from each data point up or down to " +
          "the fitted line.</p>"
      },
      {
        h: "Least squares",
        body:
          "<p>How is the line chosen? By <strong>least squares</strong>: pick the $\\hat{b}_0$ and $\\hat{b}_1$ that " +
          "minimize the <em>residual sum of squares</em> (RSS), the total of the squared residuals.</p>" +
          "<p>$$\\text{RSS} = \\sum_{i=1}^{n} \\left(Y_i - \\hat{Y}_i\\right)^2 = \\sum_{i=1}^{n}\\left(Y_i - \\hat{b}_0 - \\hat{b}_1 X_i\\right)^2$$</p>" +
          "<p>This method (also called ordinary least squares, OLS) is often credited to Gauss but was first " +
          "published by Adrien-Marie Legendre in 1805. It leads to closed-form formulas for the coefficients:</p>" +
          "<p>$$\\hat{b}_1 = \\frac{\\sum_{i=1}^{n}(Y_i - \\bar{Y})(X_i - \\bar{X})}{\\sum_{i=1}^{n}(X_i - \\bar{X})^2}, \\qquad \\hat{b}_0 = \\bar{Y} - \\hat{b}_1 \\bar{X}$$</p>" +
          "<p>The book notes least squares is computationally convenient (a virtue in the big-data era) but, like the " +
          "mean, is sensitive to outliers — a concern mainly in small or moderate problems.</p>"
      },
      {
        h: "Prediction versus explanation",
        body:
          "<p>Regression serves two distinct goals. Historically the goal was <strong>explanation</strong> " +
          "(profiling): understanding a relationship from the data at hand, with focus on the estimated slope " +
          "$\\hat{b}$. Economists studying spending versus GDP growth, or public-health officials gauging a campaign, " +
          "care about the overall relationship, not individual cases.</p>" +
          "<p>With big data, regression is more often used for <strong>prediction</strong> of individual outcomes on " +
          "new data; here the items of interest are the fitted values $\\hat{Y}$ (e.g. predicting revenue from ad " +
          "spend, or student GPA from SAT scores). The book stresses a caution: a good fit does not by itself prove " +
          "causation. A regression may relate ad clicks to conversions, but it is our knowledge of the marketing " +
          "process — not the equation — that tells us clicks lead to sales and not the reverse.</p>"
      }
    ],
    takeaways: [
      "Regression quantifies the relationship Y = b0 + b1 X; correlation only measures strength.",
      "Lung data: PEFR = 424.583 - 4.185 x Exposure; each year of exposure cuts predicted PEFR by 4.185.",
      "Fitted value Yhat = b0hat + b1hat X; residual ehat = Y - Yhat (vertical gap to the line).",
      "Least squares (OLS) picks coefficients that minimize the residual sum of squares RSS.",
      "Regression is used for both explanation (the slope) and prediction (the fitted values)."
    ]
  });
  window.CODEVIZ["ps-ch4-simple-linear-regression"] = {
    charts: [
      {
        type: "scatter",
        title: "Cotton Exposure vs Lung Capacity with Fitted Line (illustrative reconstruction of Figure 4-1 / 4-3)",
        interpret: "The fitted line PEFR = 424.583 - 4.185 x Exposure slopes gently down; residuals are the vertical gaps from each point to the line.",
        xlabel: "Exposure (years)",
        ylabel: "PEFR",
        groups: [
          {
            name: "Workers",
            color: "#4ea1ff",
            points: [
              [0, 390], [0, 460], [2, 520], [2, 280], [3, 610], [3, 320],
              [4, 110], [4, 460], [5, 520], [6, 200], [6, 550], [7, 560],
              [9, 310], [10, 500], [12, 250], [13, 490], [14, 220], [16, 320],
              [17, 130], [19, 460], [20, 380], [20, 290], [21, 510], [22, 370]
            ]
          }
        ],
        lines: [
          { name: "Fitted line", color: "#ffb454", points: [[0, 424.583], [22, 332.51]] }
        ]
      }
    ]
  };

  // 2 — Multiple Linear Regression
  B({
    id: "ps-ch4-multiple-linear-regression",
    chapter: "Chapter 4",
    title: "Multiple linear regression",
    tagline: "Add more predictors, assess fit with RMSE and R-squared, validate out-of-sample, and prune to a parsimonious model.",
    sections: [
      {
        h: "Extending to many predictors",
        body:
          "<p>With several predictors the equation simply gains more terms:</p>" +
          "<p>$$Y = b_0 + b_1 X_1 + b_2 X_2 + \\dots + b_p X_p + e$$</p>" +
          "<p>The result is no longer a line but a linear <em>model</em> — each coefficient relates linearly to its " +
          "own feature. Everything from simple regression carries over: least-squares fitting, fitted values, and " +
          "residuals. The fitted values become $\\hat{Y}_i = \\hat{b}_0 + \\hat{b}_1 X_{1,i} + \\dots + \\hat{b}_p X_{p,i}$.</p>"
      },
      {
        h: "Example: King County housing data",
        body:
          "<p>The chapter's worked example predicts house sale price from property attributes in King County " +
          "(Seattle). The model regresses $\\text{AdjSalePrice}$ on five predictors. The fitted coefficients are:</p>" +
          "<table class=\"extable\">" +
          "<thead><tr><th>Term</th><th class=\"num\">Coefficient</th></tr></thead>" +
          "<tbody>" +
          "<tr><td class=\"row-h\">Intercept</td><td class=\"num\">-521,900</td></tr>" +
          "<tr><td class=\"row-h\">SqFtTotLiving</td><td class=\"num\">228.8</td></tr>" +
          "<tr><td class=\"row-h\">SqFtLot</td><td class=\"num\">-0.0605</td></tr>" +
          "<tr><td class=\"row-h\">Bathrooms</td><td class=\"num\">-19,440</td></tr>" +
          "<tr><td class=\"row-h\">Bedrooms</td><td class=\"num\">-47,780</td></tr>" +
          "<tr><td class=\"row-h\">BldgGrade</td><td class=\"num\">106,100</td></tr>" +
          "</tbody></table>" +
          "<p>Each coefficient is read holding the others fixed. Adding one finished square foot raises the predicted " +
          "value by about &dollar;229, so adding 1,000 finished square feet implies an increase of about &dollar;228,800.</p>"
      },
      {
        h: "Assessing the model",
        body:
          "<p>From a data-science view the key metric is <strong>root mean squared error</strong> (RMSE), the square " +
          "root of the average squared prediction error:</p>" +
          "<p>$$\\text{RMSE} = \\sqrt{\\frac{\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2}{n}}$$</p>" +
          "<p>A closely related quantity is the <strong>residual standard error</strong> (RSE), identical except the " +
          "denominator is the degrees of freedom $n - p - 1$ rather than $n$. For linear regression the two are " +
          "almost identical, especially with big data.</p>" +
          "<p>$$\\text{RSE} = \\sqrt{\\frac{\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2}{n - p - 1}}$$</p>" +
          "<p>Software also reports <strong>R-squared</strong> ($R^2$), the proportion of variance explained, between " +
          "0 and 1, useful mainly in explanatory work:</p>" +
          "<p>$$R^2 = 1 - \\frac{\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2}{\\sum_{i=1}^{n}(y_i - \\bar{y})^2}$$</p>" +
          "<p>For the King County fit, R reports a residual standard error of 261,200 on 22,683 degrees of freedom, " +
          "$R^2 = 0.5407$, and adjusted $R^2 = 0.5406$. It also reports a standard error (SE) and a " +
          "<strong>t-statistic</strong> for each coefficient, $t_b = \\hat{b} / \\text{SE}(\\hat{b})$. A high " +
          "t-statistic (low p-value) argues for keeping a predictor; a low one suggests it could be dropped. The book " +
          "advises data scientists to use the t-statistic as a guide for variable inclusion and not fuss over formal " +
          "statistical significance.</p>"
      },
      {
        h: "Cross-validation",
        body:
          "<p>Classic metrics ($R^2$, F-statistics, p-values) are all <em>in-sample</em> — computed on the very data " +
          "used to fit. It makes more sense to set some data aside, fit on the rest, and test on the holdout. " +
          "<strong>k-fold cross-validation</strong> systematizes this:</p>" +
          "<ul class=\"steps\">" +
          "<li>Set aside $1/k$ of the data as a holdout.</li>" +
          "<li>Train the model on the remaining data.</li>" +
          "<li>Score the model on the $1/k$ holdout and record assessment metrics.</li>" +
          "<li>Restore that fold and set aside the next $1/k$ (excluding records already used).</li>" +
          "<li>Repeat training and scoring.</li>" +
          "<li>Continue until every record has served once in a holdout.</li>" +
          "<li>Average (or otherwise combine) the metrics across folds.</li>" +
          "</ul>" +
          "<p>Each train/holdout split is called a <strong>fold</strong>.</p>"
      },
      {
        h: "Model selection and stepwise regression",
        body:
          "<p>With many candidate predictors, more is not always better: adding variables always lowers RMSE and " +
          "raises $R^2$, so those in-sample metrics cannot guide model choice. Following Occam's razor (prefer the " +
          "simpler model), statisticians use a metric that penalizes extra terms — Akaike's Information Criteria " +
          "(<strong>AIC</strong>), developed by Hirotugu Akaike in the 1970s:</p>" +
          "<p>$$\\text{AIC} = 2P + n\\log(\\text{RSS}/n)$$</p>" +
          "<p>where $P$ is the number of variables and $n$ the number of records; each extra $k$ variables add a $2k$ " +
          "penalty, and we seek the model that minimizes AIC. Variants include AICc (small-sample correction), BIC " +
          "(stronger penalty), and Mallows Cp.</p>" +
          "<p>Searching all possible models (<em>all subset regression</em>) is too expensive at scale. " +
          "<strong>Stepwise regression</strong> instead successively adds and drops predictors to lower AIC. On the " +
          "full King County model, R's $\\text{stepAIC}$ dropped four variables — SqFtLot, NbrLivingUnits, " +
          "YrRenovated, and NewConstruction. Simpler relatives are <em>forward selection</em> (start empty, add the " +
          "best contributor until gains stop being significant) and <em>backward elimination</em> (start full, remove " +
          "non-significant predictors). <em>Penalized regression</em> (ridge, lasso) is similar in spirit but shrinks " +
          "coefficients toward zero instead of discretely searching. Because stepwise and all-subset are in-sample " +
          "they can overfit; cross-validation guards against this.</p>"
      },
      {
        h: "Weighted regression",
        body:
          "<p><strong>Weighted regression</strong> gives records different weights. Data scientists find it useful in " +
          "two cases: inverse-variance weighting when observations are measured with differing precision, and " +
          "weighting aggregated data so each row's weight reflects how many original observations it represents.</p>" +
          "<p>The book's example treats older house sales as less reliable. Using the sale year, a $\\text{Weight}$ is " +
          "set to the number of years since 2005 (the start of the data), and the model is refit with that weight. " +
          "The weighted coefficients shift slightly from the unweighted ones:</p>" +
          "<table class=\"extable\">" +
          "<thead><tr><th>Term</th><th class=\"num\">Unweighted</th><th class=\"num\">Weighted</th></tr></thead>" +
          "<tbody>" +
          "<tr><td class=\"row-h\">Intercept</td><td class=\"num\">-521,924.7</td><td class=\"num\">-584,265.2</td></tr>" +
          "<tr><td class=\"row-h\">SqFtTotLiving</td><td class=\"num\">228.832</td><td class=\"num\">245.017</td></tr>" +
          "<tr><td class=\"row-h\">SqFtLot</td><td class=\"num\">-0.061</td><td class=\"num\">-0.292</td></tr>" +
          "<tr><td class=\"row-h\">Bathrooms</td><td class=\"num\">-19,438.1</td><td class=\"num\">-26,079.2</td></tr>" +
          "<tr><td class=\"row-h\">Bedrooms</td><td class=\"num\">-47,781.2</td><td class=\"num\">-53,625.4</td></tr>" +
          "<tr><td class=\"row-h\">BldgGrade</td><td class=\"num\">106,117.2</td><td class=\"num\">115,259.0</td></tr>" +
          "</tbody></table>"
      }
    ],
    takeaways: [
      "Multiple regression adds terms: Y = b0 + b1 X1 + ... + bp Xp + e; least squares still applies.",
      "King County housing: each finished square foot adds ~\\$229; 1,000 sq ft implies ~\\$228,800.",
      "Assess with RMSE and R-squared; King County R-squared = 0.5407, RSE = 261,200.",
      "Cross-validation tests out-of-sample by rotating k holdout folds.",
      "AIC = 2P + n log(RSS/n) penalizes extra terms; stepwise regression minimizes it.",
      "Weighted regression weights records (e.g. by recency); coefficients shift slightly."
    ]
  });
  window.CODEVIZ["ps-ch4-multiple-linear-regression"] = {
    charts: [
      {
        type: "bars",
        title: "Unweighted vs Weighted King County Coefficients (book values)",
        interpret: "Weighting by sale recency nudges every coefficient; SqFtTotLiving rises from 228.8 to 245.0 per square foot.",
        labels: ["SqFtTotLiving", "Bathrooms (k\\$)", "Bedrooms (k\\$)"],
        values: [228.8, -19.4, -47.8],
        valueLabels: ["228.8", "-19.4", "-47.8"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff"]
      }
    ]
  };

  // 3 — Prediction Using Regression
  B({
    id: "ps-ch4-prediction-using-regression",
    chapter: "Chapter 4",
    title: "Prediction using regression",
    tagline: "Do not extrapolate past the data, and distinguish confidence intervals for coefficients from prediction intervals for outcomes.",
    sections: [
      {
        h: "The dangers of extrapolation",
        body:
          "<p>A regression model is valid only over the range of predictor values for which it had adequate data; it " +
          "should not be used to <strong>extrapolate</strong> beyond that range. The book's extreme illustration: " +
          "feed the King County model a 5,000-square-foot empty lot. All building-related predictors are zero, and " +
          "the equation returns an absurd prediction of about $-521{,}900 + 5{,}000 \\times (-0.0605) = -\\$522{,}202$ " +
          "— a negative price. Why? The training data contains only parcels with buildings, none for vacant land, so " +
          "the model has no information about how to price an empty lot.</p>"
      },
      {
        h: "Confidence and prediction intervals",
        body:
          "<p>Much of statistics is about measuring variability. Two kinds of uncertainty interval appear in " +
          "regression output. A <strong>confidence interval</strong> wraps around a regression coefficient (or a " +
          "mean prediction); a <strong>prediction interval</strong> wraps around a single individual predicted value. " +
          "The book explains both via the bootstrap, but says the formula-based intervals R reports carry the same " +
          "meaning.</p>" +
          "<p>Confidence intervals for coefficients can be built by a bootstrap: treat each row (including the " +
          "outcome) as a ticket in a box, draw $n$ tickets with replacement to form a resample, refit the regression " +
          "and record the coefficients, repeat (say) 1,000 times, then take percentiles (e.g. the 5th and 95th for a " +
          "90&percnt; interval).</p>" +
          "<p>Data scientists usually care more about intervals around the predicted value $\\hat{Y}_i$. Its " +
          "uncertainty comes from <em>two</em> sources: (1) uncertainty about the coefficients, and (2) the extra " +
          "error inherent in an individual data point. Even with a perfectly known equation, several houses with " +
          "identical features (8 rooms, a 6,500-square-foot lot, 3 bathrooms, a basement) would still sell for " +
          "different prices. The bootstrap for a prediction interval adds the individual error explicitly:</p>" +
          "<ul class=\"steps\">" +
          "<li>Take a bootstrap sample from the data.</li>" +
          "<li>Fit the regression and predict the new value.</li>" +
          "<li>Take one residual at random from the original fit, add it to the prediction, record the result.</li>" +
          "<li>Repeat (say) 1,000 times.</li>" +
          "<li>Take the 2.5th and 97.5th percentiles of the results.</li>" +
          "</ul>" +
          "<p>Because a prediction interval must absorb that individual-value error, it is much wider than a " +
          "confidence interval for the same value. The book warns: using a confidence interval where a prediction " +
          "interval is needed will greatly underestimate the uncertainty in a single predicted value.</p>"
      }
    ],
    takeaways: [
      "Do not extrapolate beyond the data: the empty-lot prediction came out to about -\\$522,202.",
      "Confidence intervals quantify uncertainty around coefficients (or a mean).",
      "Prediction intervals quantify uncertainty around a single individual prediction.",
      "A prediction interval is much wider; it also includes individual data-point error.",
      "Both can be built with the bootstrap; formula-based R outputs mean the same thing."
    ]
  });

  // 4 — Factor Variables in Regression
  B({
    id: "ps-ch4-factor-variables",
    chapter: "Chapter 4",
    title: "Factor variables in regression",
    tagline: "Recode categorical predictors as dummy variables, consolidate high-cardinality factors, and keep ordered factors numeric.",
    sections: [
      {
        h: "Dummy variables",
        body:
          "<p><strong>Factor</strong> (categorical) variables take a limited number of discrete values — a loan " +
          "purpose might be &quot;debt consolidation,&quot; &quot;wedding,&quot; &quot;car,&quot; and so on. A " +
          "binary yes/no <em>indicator</em> is a special case. Because regression needs numeric inputs, a factor must " +
          "be recoded into a set of binary <strong>dummy variables</strong> (0/1 columns).</p>" +
          "<p>The King County data has a $\\text{PropertyType}$ factor with three levels: Multiplex, Single Family, " +
          "Townhouse. One-hot encoding turns it into three 0/1 columns — useful for tree models and nearest " +
          "neighbors, but <em>not</em> appropriate for regression. In regression a factor with $P$ levels is " +
          "represented by only $P - 1$ columns. With an intercept present, once $P - 1$ dummies are set the $P$th is " +
          "implied; including all $P$ would create a multicollinearity error.</p>" +
          "<p>R's default is <strong>reference coding</strong> (treatment coding): the first level is the reference, " +
          "and other levels are interpreted relative to it. With Multiplex as the reference, the regression reports a " +
          "coefficient for Single Family of about $-\\$84{,}690$ and for Townhouse of about $-\\$115{,}100$ — so a " +
          "Single Family home is worth almost &dollar;85,000 less, and a Townhouse over &dollar;150,000 less, than a " +
          "comparable Multiplex. (Other codings exist — deviation coding / sum contrasts compares each level to the " +
          "overall mean — but data scientists rarely need anything beyond reference coding or one-hot.)</p>"
      },
      {
        h: "Factor variables with many levels",
        body:
          "<p>Some factors explode into huge numbers of dummies — US zip codes alone number about 43,000. King " +
          "County has 82 zip codes with a house sale. Including all levels would require 81 coefficients and 81 " +
          "degrees of freedom (the base model had only 5), and several zips have just one sale. Truncating to the " +
          "first two or three digits doesn't help here, since almost all sales fall in 980xx or 981xx.</p>" +
          "<p>The book's better approach: group the zip codes using the <em>residuals</em> from an initial model. The " +
          "median residual is computed per zip, zips are sorted by that median, and the $\\text{ntile}$ function " +
          "splits them into five groups ($\\text{ZipGroup}$). Using residuals to guide grouping is a fundamental " +
          "modeling step, and ZipGroup later becomes a powerful predictor of location.</p>"
      },
      {
        h: "Ordered factor variables",
        body:
          "<p>Some factor levels carry a natural order — <strong>ordered factor variables</strong>. A loan grade A, " +
          "B, C... carries increasing risk. These can usually be left as numeric values, which preserves the ordering " +
          "information that would be lost by treating them as an unordered factor. The book's example is " +
          "$\\text{BldgGrade}$, whose numeric codes rise from low- to high-grade homes:</p>" +
          "<table class=\"extable\">" +
          "<thead><tr><th class=\"num\">Value</th><th>Description</th></tr></thead>" +
          "<tbody>" +
          "<tr><td class=\"num\">1</td><td class=\"row-h\">Cabin</td></tr>" +
          "<tr><td class=\"num\">2</td><td class=\"row-h\">Substandard</td></tr>" +
          "<tr><td class=\"num\">5</td><td class=\"row-h\">Fair</td></tr>" +
          "<tr><td class=\"num\">10</td><td class=\"row-h\">Very good</td></tr>" +
          "<tr><td class=\"num\">12</td><td class=\"row-h\">Luxury</td></tr>" +
          "<tr><td class=\"num\">13</td><td class=\"row-h\">Mansion</td></tr>" +
          "</tbody></table>" +
          "<p>In the King County model, BldgGrade was used directly as a numeric variable.</p>"
      }
    ],
    takeaways: [
      "Factor variables must be recoded numerically; the common route is binary dummy variables.",
      "In regression, a P-level factor uses P-1 dummies (one-hot's P columns cause multicollinearity).",
      "Reference coding: PropertyType vs Multiplex — Single Family ~-\\$85k, Townhouse over -\\$150k.",
      "High-cardinality factors (82 zip codes) can be consolidated into groups from model residuals.",
      "Ordered factors (BldgGrade 1..13) are best kept numeric to preserve the ordering."
    ]
  });
  window.CODEVIZ["ps-ch4-factor-variables"] = {
    charts: [
      {
        type: "bars",
        title: "PropertyType Coefficients Relative to Multiplex (book values)",
        interpret: "With Multiplex as the reference (0), a Single Family home is worth ~\\$85k less and a Townhouse ~\\$115k less.",
        labels: ["Multiplex (ref)", "Single Family", "Townhouse"],
        values: [0, -84690, -115100],
        valueLabels: ["0", "-84,690", "-115,100"],
        colors: ["#7ee787", "#ffb454", "#ffb454"]
      }
    ]
  };

  // 5 — Interpreting the Regression Equation
  B({
    id: "ps-ch4-interpreting-the-equation",
    chapter: "Chapter 4",
    title: "Interpreting the regression equation",
    tagline: "Correlated predictors, multicollinearity, confounding, and interactions all complicate reading coefficients.",
    sections: [
      {
        h: "Correlated predictors",
        body:
          "<p>In multiple regression the predictors are often correlated with one another, which makes individual " +
          "coefficients hard to read. The book's striking example: in the stepwise King County model the coefficient " +
          "for $\\text{Bedrooms}$ is <em>negative</em> (about $-49{,}807$), implying that adding a bedroom lowers a " +
          "home's value. The resolution is that the predictors are correlated — larger houses tend to have more " +
          "bedrooms, and it is <em>size</em> that drives value. For two homes of identical size, the one chopped into " +
          "more (and therefore smaller) bedrooms is reasonably seen as less desirable.</p>" +
          "<p>Correlated predictors can also inflate the standard errors of the estimates. Refitting after removing " +
          "SqFtTotLiving, SqFtFinBasement, and Bathrooms flips the Bedrooms coefficient to positive (about " +
          "$+27{,}657$), in line with intuition — though now Bedrooms is really standing in as a proxy for house " +
          "size.</p>"
      },
      {
        h: "Multicollinearity",
        body:
          "<p><strong>Multicollinearity</strong> is the extreme case of correlated predictors: redundancy among the " +
          "predictors. <em>Perfect</em> multicollinearity occurs when one predictor can be written as a linear " +
          "combination of others. It arises when a variable is accidentally included twice, when $P$ dummies (instead " +
          "of $P - 1$) are created from a factor, or when two variables are nearly perfectly correlated.</p>" +
          "<p>A regression has no well-defined solution under perfect multicollinearity, so the offending variables " +
          "must be removed. Many packages (R included) handle some cases automatically — e.g. including SqFtTotLiving " +
          "twice gives the same result as including it once. Under near-perfect multicollinearity a solution may be " +
          "found but the results can be unstable. (For non-regression models like trees, clustering, and nearest " +
          "neighbors, multicollinearity is less of a problem and retaining $P$ dummies may even be advisable — though " +
          "non-redundancy is still a virtue.)</p>"
      },
      {
        h: "Confounding variables",
        body:
          "<p>Where correlated predictors are a problem of <em>commission</em> (including overlapping variables), a " +
          "<strong>confounding variable</strong> is a problem of <em>omission</em>: an important predictor left out " +
          "of the equation. Naively interpreting the coefficients can then mislead. In the King County model, " +
          "$\\text{SqFtLot}$, $\\text{Bathrooms}$, and $\\text{Bedrooms}$ all had negative coefficients, partly " +
          "because the model contained no variable for <em>location</em> — a very important driver of house price.</p>" +
          "<p>Adding $\\text{ZipGroup}$ (the five location groups from least to most expensive) repairs much of this. " +
          "ZipGroup turns out to be a major predictor: a home in the most expensive zip group is estimated to sell " +
          "for almost &dollar;340,000 more. With location in the model, SqFtLot and Bathrooms turn positive, and " +
          "adding a bathroom now raises the sale price by about &dollar;7,500. (Bedrooms stays negative — a " +
          "well-known real-estate phenomenon for homes of equal area: more, hence smaller, bedrooms means lower value.)</p>"
      },
      {
        h: "Interactions and main effects",
        body:
          "<p>The <strong>main effects</strong> are the predictor variables themselves; including only main effects " +
          "assumes each predictor's relationship with the response is independent of the others — often false. An " +
          "<strong>interaction</strong> captures an interdependent relationship between predictors and the response.</p>" +
          "<p>Location is everything in real estate, so house size and location plausibly interact: a big house in a " +
          "cheap district will not hold the value of the same house in an expensive one. Fitting an interaction " +
          "between $\\text{SqFtTotLiving}$ and $\\text{ZipGroup}$ shows a strong effect. For a home in the lowest " +
          "ZipGroup the slope equals the main effect, about &dollar;177 per square foot. For the highest ZipGroup the " +
          "slope is the main effect plus the interaction term: $\\$177 + \\$230 = \\$447$ per square foot — meaning " +
          "an extra square foot in the priciest zip group boosts predicted price by a factor of almost 2.7 relative " +
          "to the cheapest group. Interaction terms can be chosen by prior knowledge, stepwise selection, penalized " +
          "regression, or — most commonly — tree-based models that search for them automatically.</p>"
      }
    ],
    takeaways: [
      "Correlated predictors make coefficients hard to read: Bedrooms came out negative (~-49,807) due to size.",
      "Multicollinearity (redundant predictors) leaves no well-defined solution; remove the offenders.",
      "A confounding variable is an omitted important predictor; adding ZipGroup fixed sign anomalies.",
      "Most expensive zip group adds almost \\$340,000; with location, a bathroom adds about \\$7,500.",
      "Interactions: per-sqft value is ~\\$177 in the cheapest zip group vs \\$177+\\$230=\\$447 in the priciest."
    ]
  });
  window.CODEVIZ["ps-ch4-interpreting-the-equation"] = {
    charts: [
      {
        type: "line",
        title: "SqFtTotLiving x ZipGroup Interaction (book values)",
        interpret: "Price rises ~\\$177 per square foot in the cheapest zip group but ~\\$447 per square foot in the priciest — almost a 2.7x steeper slope.",
        xlabel: "SqFtTotLiving",
        ylabel: "Predicted price contribution (\\$)",
        series: [
          { name: "Lowest ZipGroup (~\\$177/sqft)", color: "#4ea1ff", points: [[1000, 177000], [4000, 708000]] },
          { name: "Highest ZipGroup (~\\$447/sqft)", color: "#ffb454", points: [[1000, 447000], [4000, 1788000]] }
        ]
      }
    ]
  };

  // 6 — Regression Diagnostics
  B({
    id: "ps-ch4-regression-diagnostics",
    chapter: "Chapter 4",
    title: "Regression diagnostics",
    tagline: "Residual-based checks for outliers, influential points, heteroskedasticity and nonlinearity.",
    sections: [
      {
        h: "Outliers",
        body:
          "<p>Diagnostics test the assumptions behind a model, mostly through the residuals. In regression an " +
          "<strong>outlier</strong> is a record whose actual $y$ value is far from the predicted value. They are " +
          "detected with the <strong>standardized residual</strong> — the residual divided by the standard error of " +
          "the residuals — interpreted as &quot;the number of standard errors away from the regression line.&quot; " +
          "There is no theory separating outliers from non-outliers, only rules of thumb.</p>" +
          "<p>Fitting a regression to King County sales in zip code 98105 and ordering the standardized residuals, " +
          "the largest one is $-4.33$ — more than four standard errors, an overestimate of about &dollar;757,753. " +
          "Inspecting that record (a 2,900-square-foot home recorded as selling for only &dollar;119,748) and its " +
          "deed reveals the sale involved only a partial (25&percnt;) interest in the property; it is anomalous and " +
          "should not be in the regression. Outliers can also stem from fat-finger entry or unit mismatches " +
          "(thousands of dollars vs dollars). In big-data prediction outliers rarely distort the fit, but in " +
          "<em>anomaly detection</em> finding them is the whole point.</p>"
      },
      {
        h: "Influential values",
        body:
          "<p>An <strong>influential observation</strong> is one whose removal would substantially change the " +
          "regression equation. Such a point need not have a large residual: a point far out along the x-axis can " +
          "swing the whole line while sitting close to it. The book's Figure 4-5 shows a regression line tilting " +
          "sharply when a single far-right point is dropped — that point has high <strong>leverage</strong>.</p>" +
          "<p>Leverage is measured by the <strong>hat-value</strong>; values above $2(P+1)/n$ flag a high-leverage " +
          "point. <strong>Cook's distance</strong> combines leverage and residual size; a rule of thumb flags high " +
          "influence when Cook's distance exceeds $4/(n - P - 1)$. An <em>influence plot</em> (bubble plot) puts " +
          "hat-values on the x-axis, standardized residuals on the y-axis, and scales bubble size by Cook's distance. " +
          "Removing the highly influential King County points changed the Bathrooms coefficient dramatically — from " +
          "about &dollar;2,282 to about $-\\$16{,}132$. For big data a single record rarely dominates the fit, but " +
          "for anomaly detection influential points are very useful.</p>"
      },
      {
        h: "Heteroskedasticity and non-normal residuals",
        body:
          "<p><strong>Heteroskedasticity</strong> is non-constant residual variance across the range of predicted " +
          "values — errors larger for some portions than others. Plotting the absolute residuals against the " +
          "predicted values for the 98105 model (with a loess smooth) shows the spread growing for higher-valued " +
          "homes and also large for low-valued ones — heteroskedastic errors. For data scientists this matters " +
          "because it may signal the model has left some signal uncaptured.</p>" +
          "<p>Ordinary least squares is unbiased and, under broad conditions, optimal, so the residual " +
          "<em>distribution</em> usually matters little for prediction. <strong>Non-normal residuals</strong> mainly " +
          "threaten formal inference (p-values, confidence intervals for predictions). A histogram of the 98105 " +
          "standardized residuals has noticeably longer tails than a normal distribution and mild skew toward larger " +
          "residuals. (For time-series data, the Durbin-Watson statistic checks whether errors are independent.) The " +
          "book's bottom line: satisfying distributional assumptions purely to validate formal inference is not very " +
          "important for the data scientist.</p>"
      },
      {
        h: "Partial residual plots and nonlinearity",
        body:
          "<p>A <strong>partial residual plot</strong> visualizes how well the fit captures the relationship between " +
          "one predictor and the outcome, accounting for all the other predictors — along with outlier detection, " +
          "the most important diagnostic for data scientists. The partial residual for predictor $X_i$ is the " +
          "ordinary residual plus that predictor's regression term:</p>" +
          "<p>$$\\text{Partial residual} = \\text{Residual} + \\hat{b}_i X_i$$</p>" +
          "<p>Plotting the partial residual for $\\text{SqFtTotLiving}$ against SqFtTotLiving, with a smooth overlaid, " +
          "shows the relationship is clearly <em>nonlinear</em>: the straight regression line underestimates price " +
          "for homes under 1,000 square feet and overestimates it for homes between 2,000 and 3,000 square feet. This " +
          "makes sense — adding 500 feet to a small home matters far more than adding 500 to a large one — and " +
          "suggests replacing the simple linear term with a nonlinear one.</p>"
      }
    ],
    takeaways: [
      "Outliers have large standardized residuals; zip 98105's worst was -4.33 (a partial-interest sale).",
      "Influential points (high leverage / Cook's distance) can swing the fit without a big residual.",
      "Removing influential King County points moved Bathrooms from ~\\$2,282 to ~-\\$16,132.",
      "Heteroskedasticity = non-constant residual variance; non-normal residuals mainly hurt inference.",
      "Partial residual = residual + bhat_i X_i; the SqFtTotLiving plot reveals a nonlinear relationship."
    ]
  });
  window.CODEVIZ["ps-ch4-regression-diagnostics"] = {
    charts: [
      {
        type: "scatter",
        title: "Partial Residual Plot for SqFtTotLiving (illustrative reconstruction of Figure 4-9)",
        interpret: "The smooth (orange) curves above the straight fit (green dashed) at small sizes and dips below near 2,000-3,000 sq ft: the relationship is nonlinear.",
        xlabel: "SqFtTotLiving",
        ylabel: "Partial residual",
        groups: [
          {
            name: "Partial residuals",
            color: "#4ea1ff",
            points: [
              [600, -10000], [800, -120000], [1000, -130000], [1200, -90000],
              [1400, -60000], [1600, -40000], [1800, 30000], [2000, 20000],
              [2200, 120000], [2400, 90000], [2600, 180000], [2800, 250000],
              [3000, 300000], [3400, 470000], [3800, 600000], [4200, 700000],
              [4600, 1300000], [5000, 1050000], [5500, 730000]
            ]
          }
        ],
        lines: [
          { name: "Linear fit", color: "#7ee787", dash: true, points: [[600, -300000], [5500, 730000]] },
          { name: "loess smooth", color: "#ffb454", points: [[600, -120000], [1000, -150000], [2000, -50000], [3000, 250000], [4000, 600000], [5000, 700000], [5500, 730000]] }
        ]
      }
    ]
  };

  // 7 — Polynomial and Spline Regression
  B({
    id: "ps-ch4-polynomial-and-spline",
    chapter: "Chapter 4",
    title: "Polynomial and spline regression",
    tagline: "Capture nonlinearity with polynomial terms, flexible splines, or automatically-knotted GAMs.",
    sections: [
      {
        h: "Polynomial regression",
        body:
          "<p>The relationship between a response and a predictor need not be linear — a drug response or marketing " +
          "demand often saturates. The book gives three ways to extend regression to nonlinearity, the simplest being " +
          "<strong>polynomial regression</strong>, which adds polynomial terms (squares, cubes...). Its use dates " +
          "back almost to regression itself, with an 1815 paper by Gergonne. A quadratic fit takes the form:</p>" +
          "<p>$$Y = b_0 + b_1 X + b_2 X^2 + e$$</p>" +
          "<p>Fitting a quadratic in $\\text{SqFtTotLiving}$ on the 98105 data yields two coefficients for that " +
          "predictor — a linear term and a quadratic term. The partial residual plot of the fitted curve matches the " +
          "smooth more closely than a straight line, confirming curvature.</p>"
      },
      {
        h: "Splines",
        body:
          "<p>Polynomials capture only a limited amount of curvature; adding high-order terms invites undesirable " +
          "&quot;wiggliness.&quot; <strong>Splines</strong> are an often-superior alternative — they smoothly " +
          "interpolate between fixed points. The name comes from draftsmen who bent thin wood strips with weights " +
          "(&quot;ducks&quot;) to draw smooth curves for ship and aircraft building.</p>" +
          "<p>Technically a spline is a series of piecewise continuous polynomials, joined smoothly at fixed points " +
          "called <strong>knots</strong>. They were developed during World War II at the US Aberdeen Proving Grounds " +
          "by I. J. Schoenberg. Fitting requires two choices: the polynomial degree and the knot locations. The " +
          "book's example uses a cubic b-spline ($\\text{degree}=3$) for SqFtTotLiving, with knots placed at the " +
          "boundaries plus the lower quartile, median, and upper quartile (p = 0.25, 0.5, 0.75). The spline " +
          "coefficients are not interpretable individually; the partial residual plot is read visually, and it " +
          "matches the smooth more closely than the polynomial, showing splines' greater flexibility.</p>"
      },
      {
        h: "Generalized additive models",
        body:
          "<p>When polynomial terms aren't flexible enough and you don't want to specify knots by hand, " +
          "<strong>generalized additive models</strong> (GAM) automatically fit a spline regression, choosing the " +
          "knots for you. In R the $\\text{gam}$ function with a term like $s(\\text{SqFtTotLiving})$ tells it to find " +
          "the &quot;best&quot; knots for a spline term. The GAM partial residual plot closely tracks the smooth.</p>" +
          "<p>The book ends with a caution echoing the confounding discussion: although the spline and GAM fits hug " +
          "the data, the curve implying very small homes (under 1,000 square feet) are worth more than slightly " +
          "larger ones does not make economic sense — it is likely an artifact of the omitted location variable, not " +
          "evidence that a more flexible model is truly better.</p>"
      }
    ],
    takeaways: [
      "Polynomial regression adds X^2, X^3,... terms; the quadratic is Y = b0 + b1 X + b2 X^2 + e.",
      "Splines join piecewise polynomial segments smoothly at knots; cubic b-spline with quartile knots.",
      "Spline coefficients are not interpretable; read the fit from the partial residual plot.",
      "GAMs automate knot selection for a spline fit, e.g. s(SqFtTotLiving) in R's gam.",
      "A flexible curve that fits well can still be an artifact of a confounder (omitted location)."
    ]
  });
})();
