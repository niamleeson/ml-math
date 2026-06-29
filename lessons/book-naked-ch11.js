/* Naked Statistics — Chapter 11 "Regression Analysis" + appendix.
   Self-registering book lessons. One lesson per key point. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  // 1) Ceteris paribus / isolating one variable
  B({
    id: "naked-ch11-ceteris-paribus",
    chapter: "Chapter 11",
    title: "Isolating one variable",
    tagline: "Regression measures one variable's effect while holding the others constant.",
    sections: [
      { h: "The problem a simple comparison cannot solve", body:
        "Wheelan opens with the Whitehall studies of British civil servants. Workers low in the job hierarchy — those with little control over their work — die at higher rates from heart disease. But you cannot conclude that low job control causes heart disease just by comparing low-rank and high-rank workers. Low-rank workers also differ in many other ways: they tend to have less education, smoke more, had less healthy childhoods, and have less access to health care. Any of these could be the real cause. These confounding differences obscure the relationship we actually care about." },
      { h: "What regression does", body:
        "Regression analysis quantifies the relationship between one explanatory variable and an outcome <em>while controlling for other factors</em>. It lets us isolate the effect of one variable — say, having a low-control job — while holding the effects of the other variables constant. The Latin phrase the book uses for this is <strong>ceteris paribus</strong>, meaning \"other things being equal.\" The Whitehall researchers used regression to compare people who were similar in smoking and other respects, so the leftover association between low job control and heart disease could be attributed to the job itself." },
      { h: "Why this is everywhere", body:
        "Most studies you read about in the newspaper rest on regression because researchers usually cannot run a controlled experiment — you cannot randomly assign people to jobs, or randomly assign infants to day care versus home care. Families that choose day care differ from those that do not, and those differences also affect how children turn out. Done properly, regression estimates the effect of day care apart from family income, family structure, and parental education." }
    ],
    takeaways: [
      "A raw comparison between two groups is confounded by all the other ways the groups differ.",
      "Regression isolates one variable's effect while holding the others constant — ceteris paribus.",
      "It is the main tool for finding patterns when controlled experiments are impossible."
    ]
  });

  // 2) Line of best fit / OLS / sum of squared residuals  (+ scatter-with-fit chart)
  B({
    id: "naked-ch11-ols-best-fit",
    chapter: "Chapter 11",
    title: "The line of best fit",
    tagline: "Ordinary least squares fits the line that minimizes the sum of the squared residuals.",
    sections: [
      { h: "Fitting a line to a cloud of points", body:
        "Wheelan uses the height-and-weight scatter plot for graduate students from Chapter 4. Taller people tend to weigh more, so the points slope upward, but they do not fall on a single line. Many lines are broadly consistent with the data. Regression goes a step beyond \"weight seems to increase with height\" and fits the one line that best describes the linear relationship." },
      { h: "Residuals", body:
        "Each data point has a <strong>residual</strong>: its vertical distance from the regression line. A point sitting exactly on the line has a residual of zero. The larger the residuals overall, the worse the line fits. In the book's diagram a hypothetical person A sits above the line, and the gap between A and the line is labeled the residual, $e$." },
      { h: "Ordinary least squares", body:
        "The method regression uses is <strong>ordinary least squares (OLS)</strong>. The \"least squares\" part is the key: OLS fits the line that minimizes the <strong>sum of the squared residuals</strong>. Squaring each residual before adding them up gives extra weight to points that lie far from the line — the outliers — so the fitted line works hard to avoid large misses." },
      { h: "Why squared", body:
        "<ul class='steps'>" +
        "<li>For a candidate line, find each point's residual $e$ (vertical distance to the line).</li>" +
        "<li>Square each residual: $e^2$. Squaring removes the sign and magnifies big misses.</li>" +
        "<li>Add them up across all points to get the sum of squared residuals.</li>" +
        "<li>OLS picks the line that makes that total as small as possible.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "A residual is a point's vertical distance from the fitted line; on-line points have residual zero.",
      "OLS chooses the line minimizing the sum of the SQUARED residuals.",
      "Squaring penalizes outliers more heavily than small misses."
    ]
  });
  window.CODEVIZ["naked-ch11-ols-best-fit"] = {
    charts: [{
      type: "scatter",
      title: "Line of best fit for height and weight",
      interpret: "Illustrative recreation of the book's height-weight scatter (Changing Lives line WEIGHT = -135 + 4.5*HEIGHT). Points scatter around the OLS line; vertical gaps are residuals.",
      xlabel: "Height (inches)",
      ylabel: "Weight (pounds)",
      groups: [{ name: "graduate students", color: "#4ea1ff", points: [
        [62, 138], [63, 130], [64, 160], [65, 150], [66, 185], [67, 170],
        [67, 150], [68, 200], [69, 175], [69, 210], [70, 165], [70, 195],
        [71, 220], [72, 205], [72, 235], [73, 215], [74, 245]
      ] }],
      lines: [{ name: "OLS fit", color: "#ffb454", points: [[62, 144], [74, 198]] }]
    }]
  };

  // 3) Regression equation y = a + bx
  B({
    id: "naked-ch11-regression-equation",
    chapter: "Chapter 11",
    title: "The regression equation",
    tagline: "y = a + bx: an intercept, a slope, a dependent variable, and an explanatory variable.",
    sections: [
      { h: "The equation", body:
        "OLS produces not just a line but an equation: $y = a + bx$. Here $y$ is weight in pounds; $a$ is the y-intercept (the value of $y$ when $x = 0$), also called the constant; $b$ is the slope; and $x$ is height in inches. Each real observation is $\\text{WEIGHT} = a + b(\\text{HEIGHT}) + e$, where $e$ is the residual — the part of a person's weight that height does not explain. The expected value of the residual is zero, because a person is as likely to weigh more than the line predicts as less." },
      { h: "Dependent vs explanatory variables", body:
        "The variable being explained — weight here — is the <strong>dependent variable</strong>, because it depends on other factors. The variables used to explain it are the <strong>explanatory variables</strong> (also called independent or control variables); here, height. The Changing Lives study has 3,537 adult participants, so the number of observations is $n = 3{,}537$." },
      { h: "The fitted Changing Lives result", body:
        "Running a simple regression with weight as the dependent variable and height as the only explanatory variable gives: $\\text{WEIGHT} = -135 + 4.5 \\times \\text{HEIGHT (in)}$. So $a = -135$ and $b = 4.5$." },
      { h: "Reading the parts", body:
        "<ul class='steps'>" +
        "<li>$a = -135$ is the intercept. On its own it is meaningless — taken literally, a person 0 inches tall would weigh $-135$ pounds. It is just the starting point for the calculation.</li>" +
        "<li>$b = 4.5$ is the slope: each extra inch of height is associated with about 4.5 more pounds.</li>" +
        "<li>Best guess for someone 5 ft 10 in (70 in): $-135 + 4.5 \\times 70 = -135 + 315 = 180$ pounds.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "Regression equation: y = a + bx, with intercept a and slope b.",
      "Dependent variable = the outcome explained; explanatory variables do the explaining.",
      "Changing Lives: WEIGHT = -135 + 4.5*HEIGHT, so a 70-inch person is predicted at 180 lb."
    ]
  });

  // 4) Interpreting a coefficient: sign, size, significance
  B({
    id: "naked-ch11-sign-size-significance",
    chapter: "Chapter 11",
    title: "Sign, size, and significance",
    tagline: "For any coefficient, ask three things: its direction, its magnitude, and whether it is real.",
    sections: [
      { h: "Sign", body:
        "The sign of a coefficient tells the direction of the association. The coefficient on height is positive — taller people tend to weigh more. Some relationships run the other way: Wheelan expects a coefficient on \"miles run per month\" to be negative, since running more is associated with weighing less." },
      { h: "Size", body:
        "Size asks whether the effect is big enough to matter. Each inch of height is associated with 4.5 pounds, which is a sizable share of a typical person's weight, so height is clearly an important factor in explaining weight. In other studies a variable can be statistically real yet have an effect too small to care about." },
      { h: "Significance", body:
        "Significance asks whether the observed result reflects a true association in the whole population, or is just a quirk of this sample. A different large sample would yield a slightly different coefficient, so we use the tools of inference to judge whether the relationship would show up again. The next two lessons unpack practical-vs-statistical significance and the standard-error machinery." }
    ],
    takeaways: [
      "Sign = direction of the association (positive or negative).",
      "Size = magnitude; is the effect large enough to be meaningful?",
      "Significance = is the result likely real in the population, not a fluke of this sample?"
    ]
  });

  // 5) Statistical vs practical significance
  B({
    id: "naked-ch11-statistical-vs-practical",
    chapter: "Chapter 11",
    title: "Statistical vs practical significance",
    tagline: "A result can be statistically real and still too small to matter.",
    sections: [
      { h: "The white-teeth example", body:
        "Wheelan imagines a study of what determines income. In a large data set, researchers might find that people with whiter teeth earn $86 more per year than others, ceteris paribus — and that this finding is statistically significant. That means two things: the null hypothesis that white teeth have no association with income is rejected with high confidence, and a similar relationship would likely appear in other samples." },
      { h: "So what?", body:
        "Statistically significant does not mean important. $86 a year is not life-changing money. From a policy angle, $86 is probably less than the annual cost of whitening teeth, so it is not even worth doing. The effect is real but practically trivial." },
      { h: "The two questions are separate", body:
        "<ul class='steps'>" +
        "<li>Statistical significance: is the effect likely real rather than chance? (white teeth: yes)</li>" +
        "<li>Practical significance: is the effect large enough to matter? (white teeth: no — only $86/yr)</li>" +
        "<li>A finding must clear BOTH bars to be worth acting on.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "Statistical significance asks 'is it real?'; practical significance asks 'is it big enough to care?'",
      "The $86/year whiter-teeth effect is statistically significant yet practically meaningless.",
      "Always check the size of an effect, not just whether it is significant."
    ]
  });

  // 6) Standard error + "at least twice its SE" rule
  B({
    id: "naked-ch11-standard-error",
    chapter: "Chapter 11",
    title: "The standard error of a coefficient",
    tagline: "A coefficient is likely significant when it is at least twice the size of its standard error.",
    sections: [
      { h: "What the standard error measures", body:
        "If you re-ran the regression on repeated samples drawn from the same population, the coefficient would come out a bit different each time. The <strong>standard error</strong> measures how much the coefficient would bounce around across those samples. One sample of 3,000 Americans might give 4.3 pounds per inch; another might give 5.2. For large samples the coefficients are distributed normally around the true population value: more than half land within one standard error of it, and roughly 95 percent land within two." },
      { h: "The Changing Lives numbers", body:
        "Wheelan runs the height regression and reports a standard error on the height coefficient of 0.13, against a coefficient of 4.5. From this we can build a 95 percent confidence interval, $4.5 \\pm 0.26$ (which is two standard errors)." },
      { h: "Building the interval", body:
        "<ul class='steps'>" +
        "<li>Standard error $= 0.13$; coefficient $= 4.5$.</li>" +
        "<li>Two standard errors $= 2 \\times 0.13 = 0.26$.</li>" +
        "<li>95% confidence interval $= 4.5 \\pm 0.26$, i.e. from $4.24$ to $4.76$.</li>" +
        "<li>The interval does not include zero, so we reject the null hypothesis of no association at the 95% level.</li>" +
        "</ul>" },
      { h: "The rule of thumb", body:
        "There is a quick check: a coefficient is likely statistically significant when it is <strong>at least twice the size of its standard error</strong>. Here the coefficient (4.5) is far more than twice the standard error (0.13) — about 35 times it — so the result is strongly significant. Equivalently, the result is significant at the 0.05 level: only a 5 percent chance of wrongly rejecting the null." }
    ],
    takeaways: [
      "Standard error = expected sample-to-sample dispersion of the coefficient.",
      "Coefficient +/- 2*SE gives a 95% confidence interval: 4.5 +/- 0.26 -> 4.24 to 4.76.",
      "Rule of thumb: significant when the coefficient is at least twice its standard error."
    ]
  });

  // 7) The p-value
  B({
    id: "naked-ch11-p-value",
    chapter: "Chapter 11",
    title: "The p-value",
    tagline: "The chance of seeing a result this extreme if there were truly no association.",
    sections: [
      { h: "What it reports", body:
        "Along with the coefficient and standard error, a statistics package reports a <strong>p-value</strong>. It is the probability of getting an outcome as extreme as the one observed (or more extreme) if there were no true association between the variables in the population." },
      { h: "The height result", body:
        "For the height coefficient the p-value is 0.000. That means there is essentially zero chance of observing an association as strong as 4.5 pounds per inch if height and weight were truly unrelated in the general population." },
      { h: "What it does not prove", body:
        "A tiny p-value does not <em>prove</em> that taller people weigh more. It shows that our sample result would be wildly anomalous if there were no real relationship — which is the same logic of rejecting a null hypothesis used throughout statistical inference, not a proof of causation." }
    ],
    takeaways: [
      "p-value = probability of a result this extreme if the true association were zero.",
      "Height coefficient p-value is 0.000 — essentially no chance under the null.",
      "A small p-value rejects the null; it does not prove the relationship is real or causal."
    ]
  });

  // 8) R-squared
  B({
    id: "naked-ch11-r-squared",
    chapter: "Chapter 11",
    title: "R-squared",
    tagline: "The share of the variation in the outcome that the regression explains.",
    sections: [
      { h: "What it measures", body:
        "Regression also reports an <strong>R-squared</strong> ($R^2$): the share of the total variation in the dependent variable that the regression equation explains. Weights in the Changing Lives sample vary a lot — many people weigh more than the group mean, many weigh less. $R^2$ tells how much of that variation around the mean is associated with differences in height alone." },
      { h: "The height-only result", body:
        "With height as the only explanatory variable, $R^2 = 0.25$, or 25 percent. So height alone explains a quarter of the variation in weight. The arguably more telling number is the flip side: 75 percent of the variation in weight remains unexplained — there are clearly other factors at work, which is what makes adding more variables interesting." },
      { h: "The endpoints", body:
        "<ul class='steps'>" +
        "<li>$R^2 = 0$: the regression does no better than just using the mean to predict any individual's weight.</li>" +
        "<li>$R^2 = 1$: the regression predicts every person's weight perfectly.</li>" +
        "<li>Height-only model: $R^2 = 0.25$, so 25% explained, 75% unexplained.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "R-squared = fraction of the outcome's variation the model explains.",
      "Height alone gives R-squared = 0.25; 75% of weight variation is left unexplained.",
      "R-squared ranges 0 (no better than the mean) to 1 (perfect prediction)."
    ]
  });

  // 9) Multiple regression + dummy variables
  B({
    id: "naked-ch11-multiple-regression",
    chapter: "Chapter 11",
    title: "Multiple regression and dummy variables",
    tagline: "Add explanatory variables to get each one's effect holding the others constant; encode categories with 0/1 dummies.",
    sections: [
      { h: "Adding variables", body:
        "Multiple regression includes several explanatory variables at once. Each coefficient then estimates that variable's association with the outcome <em>while holding the other variables constant</em>. The method is the same — a package finds the coefficients that minimize the total sum of squared residuals — but with more than one explanatory variable you can no longer plot the data in two dimensions." },
      { h: "Adding age", body:
        "Adding age to the height model gives: $\\text{WEIGHT} = -145 + 4.6 \\times \\text{HEIGHT} + 0.1 \\times \\text{AGE}$. The age coefficient of 0.1 means that, holding height constant, each additional year of age is associated with 0.1 more pounds — so among same-height people, those ten years older weigh about one pound more. Notice the height coefficient nudged up to 4.6 now that age is controlled for." },
      { h: "Dummy variables", body:
        "Sex has only two values, so it is entered as a <strong>binary (dummy) variable</strong>: 1 for female, 0 for male. Its coefficient is the effect of being female, ceteris paribus. The fuller equation is $\\text{WEIGHT} = -118 + 4.3 \\times \\text{HEIGHT} + 0.12 \\times \\text{AGE} - 4.8 \\times (\\text{FEMALE})$. The $-4.8$ means that among people of the same height and age, women weigh about 4.8 pounds less than men." },
      { h: "Worked predictions", body:
        "<table class='extable'><thead><tr><th>Person</th><th class='num'>Height</th><th class='num'>Age</th><th>Female?</th><th class='num'>Predicted weight</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>53-yr-old woman, 5 ft 5 in</td><td class='num'>65</td><td class='num'>53</td><td>yes (1)</td><td class='num'>163 lb</td></tr>" +
        "<tr><td class='row-h'>35-yr-old man, 6 ft 3 in</td><td class='num'>75</td><td class='num'>35</td><td>no (0)</td><td class='num'>209 lb</td></tr>" +
        "</tbody></table>" +
        "<ul class='steps'>" +
        "<li>Woman: $-118 + 4.3 \\times 65 + 0.12 \\times 53 - 4.8 = -118 + 279.5 + 6.36 - 4.8 \\approx 163$ pounds.</li>" +
        "<li>Man: $-118 + 4.3 \\times 75 + 0.12 \\times 35 = -118 + 322.5 + 4.2 \\approx 209$ pounds. The $-4.8$ female term is dropped because he is male.</li>" +
        "</ul>" },
      { h: "More variables, real significance", body:
        "Adding education, exercise, poverty (proxied by receiving food stamps), and race keeps the original variables significant and raises $R^2$ from 0.25 to 0.29. Among the new findings, all significant at the 0.05 level: each year of education is associated with about $-1.3$ pounds; food-stamp recipients weigh about 5.6 pounds more, ceteris paribus; and non-Hispanic black adults weigh roughly 10 pounds more than other adults, with a p-value of 0.000 and a 95 percent confidence interval running from 7.7 to 16.1 pounds." }
    ],
    takeaways: [
      "Multiple regression gives each variable's effect holding the others constant.",
      "A dummy variable codes a category as 0/1 (female = 1, male = 0); its coefficient is the effect of that category.",
      "Worked: 53-yr-old 65-in woman -> 163 lb; 35-yr-old 75-in man -> 209 lb (female term dropped)."
    ]
  });

  // 10) Appendix: t-distribution / degrees of freedom / small samples
  B({
    id: "naked-ch11-t-distribution",
    chapter: "Chapter 11",
    title: "The t-distribution for small samples",
    tagline: "With small samples the coefficients follow a fatter-tailed t-distribution set by the degrees of freedom.",
    sections: [
      { h: "When the normal curve stops helping", body:
        "Everything above assumed a large sample, where coefficients are distributed normally around the true value. With a small sample — say 25 adults instead of 3,000 — that assumption breaks. Smaller samples generate more dispersion, so we should be less confident generalizing from 25 people than from 3,000." },
      { h: "The t-distribution", body:
        "With small samples the coefficients are still centered on the true population value, but the shape is no longer the familiar bell curve. Instead they follow a <strong>t-distribution</strong>, which is more spread out than the normal curve and therefore has <em>fatter tails</em>. The t-distribution is really a whole family of curves whose shape depends on the sample size: repeated samples of 25 give fatter tails than large samples, and samples of 10 give fatter tails still." },
      { h: "Degrees of freedom", body:
        "Which t-curve applies is set by the <strong>degrees of freedom</strong>, which Wheelan says are, for our purposes, roughly the number of observations in the sample. A basic regression with a sample of 10 and a single explanatory variable has 9 degrees of freedom. More degrees of freedom means more confidence that the sample represents the true population, and a tighter distribution." },
      { h: "Reading the picture", body:
        "<ul class='steps'>" +
        "<li>Big sample: distribution is the tight, normal bell curve.</li>" +
        "<li>Sample of 25: fatter tails, more dispersion.</li>" +
        "<li>Sample of 10 (9 degrees of freedom): fatter tails still.</li>" +
        "<li>More degrees of freedom -> tighter, more confident distribution.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "Small samples follow a t-distribution: same center as normal, but fatter tails.",
      "The t-distribution is a family of curves indexed by degrees of freedom (~ number of observations).",
      "Sample of 10 with one explanatory variable has 9 degrees of freedom; more df = tighter distribution."
    ]
  });
})();
