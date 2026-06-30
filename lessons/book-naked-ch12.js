/* "Naked Statistics" (Charles Wheelan) — Chapter 12: Common Regression Mistakes
   One consolidated lesson covering every concept in the chapter. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch12",
    chapter: "Chapter 12",
    title: "Common Regression Mistakes",
    tagline: "The mandatory warning label — the ways a regression can mislead.",
    sections: [
      { body: "<h3 class=\"book-concept\">Regression on a nonlinear relationship</h3><p class=\"book-lead\">A regression coefficient is the slope of one straight line, so it cannot describe a relationship whose slope keeps changing.</p><h4 class=\"book-sub\">The warning label</h4><p>Wheelan jokes that if regression came with a warning label like a hair dryer, it would read: do not use when there is no linear association between the variables. A regression coefficient describes the slope of the single \"line of best fit.\" A relationship that is not straight has a different slope in different places, so one number cannot capture it.</p><h4 class=\"book-sub\">The golf-lessons example</h4><p>His example plots the number of golf lessons he takes in a month (the explanatory variable) against his average score for an eighteen-hole round (the dependent variable; lower is better). The scatter shows a clear pattern, but it bends &mdash; it splits into three stretches with three different slopes:</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Spending range</th><th class=\"row-h\">What happens to score</th><th class=\"row-h\">Slope</th></tr></thead><tbody><tr><td class=\"row-h\">Up to about \\$100/mo</td><td>Score drops sharply (improves)</td><td>Negative</td></tr><tr><td class=\"row-h\">About \\$200&ndash;\\$300/mo</td><td>Little or no change</td><td>Zero</td></tr><tr><td class=\"row-h\">Above \\$300/mo</td><td>Score rises (gets worse)</td><td>Positive</td></tr></tbody></table><h4 class=\"book-sub\">Why one coefficient fails</h4><p>Because the slope is negative, then flat, then positive, no single coefficient can summarize the relationship. Feed this data into a statistics package and it will still spit out one number &mdash; but that number will not reflect the true relationship. Wheelan calls relying on it the statistical equivalent of using a hair dryer in the bathtub. Regression is meant for linear relationships; the further you stray from that, the less useful and more dangerous it becomes.</p>" },
      { body: "<h3 class=\"book-concept\">Correlation is not causation</h3><p class=\"book-lead\">Regression shows association, not cause; two unrelated things that both rise over time can look strongly linked.</p><h4 class=\"book-sub\">Association, not proof</h4><p>Regression can only show that two variables move together. It cannot prove, on its own, that a change in one is <em>causing</em> a change in the other. A careless regression can even report a large, statistically significant link between two variables that have nothing to do with each other.</p><h4 class=\"book-sub\">Autism and incomes in China</h4><p>Wheelan's example: suppose we search for causes of the rising rate of autism in the United States over the last two decades, with the outcome measured as diagnosed cases per 1,000 children. If we throw in annual per capita income in China as an explanatory variable, we would almost certainly find a positive, statistically significant association &mdash; simply because both numbers have been climbing sharply over the same period. Yet a recession in China would not lower U.S. autism rates. This kind of false link is an example of <strong>spurious causation</strong>.</p>" },
      { body: "<h3 class=\"book-concept\">Reverse causality</h3><p class=\"book-lead\">An association between A and B does not say which causes which; B may be driving A.</p><h4 class=\"book-sub\">The direction can flip</h4><p>A statistical link between A and B does not prove A causes B &mdash; it is entirely possible B is causing A. Back in the golf example, if a complex model shows that more lessons go with worse scores, one reading is that the instructor is terrible. The more plausible reading is reverse causality: Wheelan tends to take more lessons when he is playing badly, so bad golf is causing the lessons, not the other way around. A simple fix is to use lessons in one month to explain scores in the <em>next</em> month.</p><h4 class=\"book-sub\">Education spending and growth</h4><p>He gives a second case: states that spend more on K&ndash;12 education show higher economic growth. The positive link says nothing about direction. Education spending could boost growth, or a strong economy could let a state afford more education spending &mdash; the causality could run both ways. The lesson: do not use an explanatory variable that might itself be affected by the outcome, or the results get hopelessly tangled. For instance, using the unemployment rate to explain GDP growth is backwards, since unemployment is clearly affected by GDP growth.</p>" },
      { body: "<h3 class=\"book-concept\">Omitted variable bias</h3><p class=\"book-lead\">Leaving out an important variable lets another variable secretly pick up its effect, distorting the result.</p><h4 class=\"book-sub\">Golfers and disease</h4><p>Imagine a headline: golfers are more prone to heart disease, cancer, and arthritis. Wheelan would not be surprised &mdash; but not because golf is harmful. People play more golf as they age, especially in retirement, so golfers are on average older than nongolfers. Any study of golf's health effects must control for age. Leave age out, and the \"playing golf\" variable takes on <strong>two roles</strong>: it measures the effect of golf <em>and</em> the effect of being old. The golf variable \"picks up\" the effect of age, and the two get comingled. The worst case is concluding golf is bad for you, when among people of the same age it may be mildly protective.</p><h4 class=\"book-sub\">School spending and test scores</h4><p>A second case: explaining school quality (measured by test scores) using school spending. If spending is the only explanatory variable, you will find a large, significant link &mdash; and conclude you can spend your way to better schools. The crucial omitted variable is parental education and socioeconomic status. Well-educated, affluent families live in areas that spend more on schools, and their children also tend to score well. Without controlling for the student body's socioeconomic status, the result may reflect who walks in the school door, not the money spent inside.</p><h4 class=\"book-sub\">Cars and SAT scores</h4><p>Wheelan recalls a professor noting that SAT scores correlate strongly with the number of cars a family owns, insinuating the SAT is therefore unfair. But the number of cars is just a proxy for income, education, and socioeconomic status. As noted earlier in the book, the mean SAT critical reading score for students from families earning over \\$200,000 is 134 points higher than for students from families earning below \\$20,000. The real worry is whether the SAT is \"coachable\" through prep classes that wealthy families can better afford.</p>" },
      { body: "<h3 class=\"book-concept\">Highly correlated explanatory variables</h3><p class=\"book-lead\">When two explanatory variables move together, regression cannot cleanly separate their individual effects.</p><h4 class=\"book-sub\">Multicollinearity</h4><p>If a regression includes two or more explanatory variables that are highly correlated with each other, it cannot reliably tell apart the true effect of each one on the outcome. Recall the \"rooms\" image from the prior chapter: regression isolates one variable's effect by comparing observations that are identical except for that one variable. When two variables almost always travel together, there are too few observations that differ on just one of them, so there is little variation left to work with.</p><h4 class=\"book-sub\">Cocaine and heroin</h4><p>Suppose we want the separate effects of cocaine use and heroin use on SAT scores. People who have used heroin have very likely also used cocaine, so putting both in the equation leaves almost no one who used one but not the other. Wheelan's illustrative counts:</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Group</th><th class=\"num\">Individuals</th></tr></thead><tbody><tr><td class=\"row-h\">Used both cocaine and heroin</td><td class=\"num\">692</td></tr><tr><td class=\"row-h\">Used cocaine but not heroin</td><td class=\"num\">3</td></tr><tr><td class=\"row-h\">Used heroin but not cocaine</td><td class=\"num\">2</td></tr></tbody></table><p>Any estimate of one drug's independent effect rests on those tiny samples of 3 and 2 people, so the coefficients are meaningless &mdash; and they may even hide the larger, real link between drug use and SAT scores.</p><h4 class=\"book-sub\">What researchers do</h4><p>When two explanatory variables are this correlated, researchers usually use just one of them, or combine them into a composite variable like \"used cocaine or heroin.\" The same problem appears with a mother's and father's education: their attainments are so correlated that regression cannot cleanly isolate either parent's effect.</p>" },
      { body: "<h3 class=\"book-concept\">Extrapolating beyond the data</h3><p class=\"book-lead\">Results hold only for a population like the sample; pushing the equation outside that range gives nonsense.</p><h4 class=\"book-sub\">Valid only near the sample</h4><p>Regression seeks patterns that hold for a larger population, but those results are valid only for a population similar to the sample the analysis was built on. In the prior chapter Wheelan built an equation to predict weight, with an $R^2$ of .29, meaning it explained a decent share of the variation in weight &mdash; for a large sample of people who all happened to be adults.</p><h4 class=\"book-sub\">Predicting a newborn's weight</h4><p>He tests it by plugging in his newborn daughter's values:</p><ul class=\"steps\"><li>Length at birth: 21 inches.</li><li>Age: 0 years.</li><li>Education: none.</li><li>Exercise: none.</li><li>White and female.</li></ul><p>The adult-based equation predicts her birth weight should have been <strong>negative 19.6 pounds</strong>. She actually weighed 8&frac12; pounds. The equation was fine for adults but produces nonsense for a newborn, because a newborn is nothing like the sample it was estimated on.</p><h4 class=\"book-sub\">State the population</h4><p>Wheelan praises one of the Whitehall studies for being explicit about its limits, concluding that low control in the work environment is tied to higher coronary heart disease risk specifically among men and women employed in government offices &mdash; not everyone, everywhere.</p>" },
      { body: "<h3 class=\"book-concept\">Data mining with too many variables</h3><p class=\"book-lead\">Throw in enough junk variables and one will look significant purely by chance.</p><h4 class=\"book-sub\">More variables is not the fix</h4><p>If leaving out important variables is a problem, it might seem that adding as many variables as possible is the solution. It is not. Stuffing in extraneous explanatory variables that have no theoretical justification can corrupt the results. Put enough junk variables into an equation and one of them is bound to clear the bar for statistical significance just by chance. Worse, junk variables are not always easy to spot.</p><h4 class=\"book-sub\">The coin-flipping class</h4><p>Wheelan illustrates with his coin-flipping exercise. In a class of about forty students, everyone flips a coin; anyone who flips tails is out, and the survivors flip again, round after round, until one student has flipped five or six heads in a row. Classmates joke: what's your secret? It's obviously just luck &mdash; but in a scientific frame the numbers can mislead:</p><ul class=\"steps\"><li>The chance of flipping five heads in a row is $1/32$, which equals about .03.</li><li>That .03 sits below the usual .05 threshold for rejecting a null hypothesis.</li><li>The null hypothesis is that the student has no special coin-flipping talent.</li><li>So the math would let us reject it and declare the student specially skilled &mdash; which is nonsense.</li></ul><h4 class=\"book-sub\">The same trap in real research</h4><p>The convention is to reject a null hypothesis when a result would happen by chance only 1 in 20 times. So if you run 20 studies &mdash; or include 20 junk variables in one equation &mdash; on average 1 will turn up bogus but \"significant.\" Wheelan quotes epidemiologist Richard Peto: epidemiology is beautiful and important, \"but an incredible amount of rubbish is published.\"</p>" },
      { body: "<h3 class=\"book-concept\">Building the theory after the result</h3><p class=\"book-lead\">Inventing an explanation after a fluke turns up significant dresses up noise as a finding.</p><h4 class=\"book-sub\">The after-the-fact danger</h4><p>The most insidious part of data mining is that clever researchers can always build a theory <em>after the fact</em> to explain why some odd variable that is really just noise showed up as statistically significant. Once the lucky coin-flipper has \"won,\" we are tempted to study him for the secret &mdash; his flipping form, his concentration, his Harvard sweatshirt &mdash; even though it was all luck.</p><h4 class=\"book-sub\">Why so much research is wrong</h4><p>This plagues legitimate research too. The <em>Wall Street Journal</em> reported that most results, even in top peer-reviewed journals, cannot be reproduced. One cause is positive publication bias: journals print the one study that finds an effect and ignore the nineteen that found nothing. Small samples and researcher bias make it worse. John Ioannidis examined forty-nine heavily cited studies and found that roughly one-third were later refuted (some had promoted estrogen replacement therapy); he estimates about half of all published scientific papers will eventually prove wrong.</p>" },
      { body: "<h3 class=\"book-concept\">A sound equation beats the math</h3><p class=\"book-lead\">Choosing the right variables and data sources matters more than the underlying calculations.</p><h4 class=\"book-sub\">The first big takeaway</h4><p>Wheelan boils the whole warning label down to two lessons. The first: designing a good regression equation &mdash; deciding which variables to examine and where the data should come from &mdash; matters more than the statistical calculations themselves. This step is called specifying the equation. The best researchers are the ones who can reason logically about what belongs in the equation, what might be missing, and how to interpret the results &mdash; not the ones who are fastest at the arithmetic.</p><h4 class=\"book-sub\">Still an awesome tool</h4><p>He is careful not to dismiss regression. Used properly, it finds key patterns in large data sets and gives objective standards for evaluating them, making it a genuine part of the scientific method. The chapter is the mandatory warning label, not a rejection of the tool.</p>" },
      { body: "<h3 class=\"book-concept\">Regression builds only a circumstantial case</h3><p class=\"book-lead\">An association is like a fingerprint at a crime scene — suggestive, but it needs theory and replication to convict.</p><h4 class=\"book-sub\">The second big takeaway</h4><p>The second lesson: like most statistical inference, regression builds only a circumstantial case. An association between two variables is like a fingerprint at a crime scene &mdash; it points in a direction but is rarely enough to convict, and sometimes a fingerprint does not even belong to the culprit. Any regression needs a theoretical underpinning: why are these explanatory variables in the equation, and what from other fields could explain the result? Findings need to be replicated, or at least consistent with other evidence &mdash; otherwise claims like purple shoes boosting SAT math scores have nothing behind them.</p><h4 class=\"book-sub\">The hormone-replacement cautionary tale</h4><p>The chapter opens and closes on this story. Beginning in the 1990s the medical establishment embraced estrogen supplements for older women, and by 2001 some 15 million women were prescribed estrogen to stay healthier. The basis was strong: the Nurses' Health Study, a longitudinal study of 122,000 women run by Harvard, found women taking estrogen had only one-third as many heart attacks as women who did not, and there was a plausible theory (aging ovaries make less estrogen, so replacing it should help). Hence \"hormone replacement therapy.\"</p><h4 class=\"book-sub\">Then the trials came in</h4><p>Estrogen was finally put through clinical trials &mdash; controlled experiments giving one group the treatment and another a placebo, rather than mining an existing data set for associations. The trials showed women taking estrogen had <em>higher</em> rates of heart disease, stroke, blood clots, and breast cancer; the benefits were far outweighed by the risks. In 2002 doctors were advised to stop prescribing it. Asked how many women died prematurely or suffered strokes or breast cancer from a pill meant to keep them healthy, the answer was a reasonable estimate of tens of thousands. Wheelan's grim opening rule: when doing regression research, try not to kill anyone.</p>" }
    ],
    takeaways: [
      "A regression coefficient is the slope of one straight line.",
      "Regression demonstrates association; it cannot prove cause by itself.",
      "A link between A and B does not reveal which one drives the other.",
      "An omitted variable makes a remaining variable absorb its effect.",
      "Highly correlated explanatory variables cannot be teased apart by regression.",
      "A regression's findings apply only to a population like its sample.",
      "Adding theory-free variables invites false positives.",
      "A theory invented after seeing a fluke makes noise look like a real effect.",
      "Specifying a good equation matters more than the math behind it.",
      "An association is a fingerprint at the scene — suggestive, not a conviction."
    ]
  });
  window.CODEVIZ["naked-ch12"] = {
    charts: [
      {
        "type": "scatter",
        "title": "Effect of golf lessons on score",
        "interpret": "Score falls fast at first, levels off in the middle, then rises again — three different slopes, so one straight line cannot fit it.",
        "xlabel": "Money spent on lessons per month (\\$)",
        "ylabel": "Average score (lower is better)",
        "groups": [
          {
            "name": "Monthly rounds",
            "color": "#4ea1ff",
            "points": [
              [
                20,
                90
              ],
              [
                40,
                88
              ],
              [
                50,
                84
              ],
              [
                80,
                86
              ],
              [
                100,
                82
              ],
              [
                120,
                80
              ],
              [
                150,
                76
              ],
              [
                170,
                74
              ],
              [
                190,
                73
              ],
              [
                210,
                74
              ],
              [
                230,
                73
              ],
              [
                250,
                74
              ],
              [
                270,
                73
              ],
              [
                290,
                75
              ],
              [
                310,
                76
              ],
              [
                330,
                79
              ],
              [
                360,
                84
              ],
              [
                390,
                90
              ],
              [
                410,
                95
              ],
              [
                440,
                98
              ]
            ]
          }
        ]
      },
      {
        "type": "bars",
        "title": "Drug-use overlap in the sample",
        "interpret": "Almost everyone who used either drug used both, so there is almost no data to estimate each drug's separate effect.",
        "labels": [
          "Both",
          "Cocaine only",
          "Heroin only"
        ],
        "values": [
          692,
          3,
          2
        ],
        "colors": [
          "#4ea1ff",
          "#ffb454",
          "#c89bff"
        ]
      }
    ]
  };
})();
