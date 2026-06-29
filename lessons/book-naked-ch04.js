/* Naked Statistics (Charles Wheelan) — Chapter 4 "Correlation". Self-registering book lessons. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const BOOK = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1 — What correlation measures
  B({
    id: "naked-ch4-what-correlation-measures",
    chapter: "Chapter 4",
    title: "What correlation measures",
    tagline: "Correlation captures the degree to which two phenomena move together.",
    sections: [
      {
        h: "Two things that move together",
        body:
          "<p>Correlation is a way to describe how strongly two measured things are related to each other. " +
          "Wheelan's everyday example is summer temperatures and ice cream sales: as the temperature rises, " +
          "ice cream sales rise too. The two move in step.</p>" +
          "<p>The key idea is that one number can summarize this kind of relationship. Instead of staring at a " +
          "pile of paired observations, we ask a single question: when one quantity changes, does the other " +
          "tend to change with it, and in which direction?</p>"
      }
    ],
    takeaways: [
      "Correlation describes how two phenomena move relative to one another.",
      "Wheelan's intuition: hotter days, more ice cream sold."
    ]
  });

  // 2 — Positive and negative correlation
  B({
    id: "naked-ch4-positive-negative",
    chapter: "Chapter 4",
    title: "Positive and negative correlation",
    tagline: "Same-direction change is positive correlation; opposite-direction change is negative.",
    sections: [
      {
        h: "Same direction vs opposite direction",
        body:
          "<p>Two variables are <strong>positively correlated</strong> when a change in one comes with a change " +
          "in the other in the <em>same</em> direction. Wheelan's example is height and weight: taller people " +
          "weigh more on average, and shorter people weigh less.</p>" +
          "<p>Two variables are <strong>negatively correlated</strong> when a change in one comes with a change " +
          "in the other in the <em>opposite</em> direction. His example is exercise and weight: people who " +
          "exercise more tend to weigh less.</p>" +
          "<p>He stresses that the relationship is a tendency, not a rule. Not every observation fits: sometimes a " +
          "short person outweighs a tall one, and sometimes someone who never exercises is thinner than someone " +
          "who works out constantly. The pattern still holds on average.</p>"
      }
    ],
    takeaways: [
      "Positive: variables move the same way (height and weight).",
      "Negative: variables move opposite ways (exercise and weight).",
      "It is an average tendency, not a guarantee for every individual."
    ]
  });

  // 3 — Scatter plots
  B({
    id: "naked-ch4-scatter-plots",
    chapter: "Chapter 4",
    title: "Scatter plots",
    tagline: "A scatter plot shows each paired observation as a dot, revealing the pattern.",
    sections: [
      {
        h: "Plotting the pairs",
        body:
          "<p>One way to see a relationship is to plot each observation as a dot, with one variable on each axis. " +
          "Wheelan shows a scatter plot of height (horizontal) against weight (vertical) for a random sample of " +
          "American adults. The cloud of dots drifts upward to the right: taller people tend to be heavier, which " +
          "is positive correlation.</p>" +
          "<p>But he points out that scatter plots become unwieldy at scale. If Netflix tried to recommend films " +
          "by plotting ratings for thousands of films by millions of customers, the dots would &quot;bury the " +
          "headquarters.&quot; That is why we want a single summarizing number instead — the correlation " +
          "coefficient.</p>"
      }
    ],
    takeaways: [
      "Each dot is one paired observation (e.g. one person's height and weight).",
      "An upward-drifting cloud signals positive correlation.",
      "Scatter plots do not scale to huge data — hence the need for a summary statistic."
    ]
  });
  window.CODEVIZ["naked-ch4-scatter-plots"] = {
    charts: [
      {
        type: "scatter",
        title: "Scatter Plot for Height and Weight (illustrative reconstruction)",
        interpret: "Dots drift up to the right: taller adults tend to weigh more — positive correlation.",
        xlabel: "Height (inches)",
        ylabel: "Weight (pounds)",
        groups: [
          {
            name: "Adults",
            color: "#4ea1ff",
            points: [
              [62, 128], [63, 135], [64, 140], [65, 138], [66, 150],
              [67, 148], [68, 155], [69, 152], [70, 165], [70, 158],
              [71, 170], [72, 168], [73, 175], [74, 178], [75, 185]
            ]
          }
        ]
      }
    ]
  };

  // 4 — The correlation coefficient scale
  B({
    id: "naked-ch4-coefficient-scale",
    chapter: "Chapter 4",
    title: "The correlation coefficient scale",
    tagline: "One unitless number from −1 to +1 summarizes the whole relationship.",
    sections: [
      {
        h: "From −1 to +1",
        body:
          "<p>The correlation coefficient collapses an entire association into one number that always falls between " +
          "$-1$ and $+1$. Wheelan highlights two attractive features.</p>" +
          "<p><strong>It runs on a fixed scale.</strong> A value of $+1$ is perfect positive correlation: every " +
          "change in one variable comes with an equivalent change in the other in the same direction. A value of " +
          "$-1$ is perfect negative correlation: equivalent change in the opposite direction. A value of $0$ (or " +
          "near it) means no meaningful association — his example is shoe size and SAT scores. The closer the " +
          "number is to $1$ or $-1$, the stronger the relationship.</p>" +
          "<p><strong>It has no units.</strong> Height is in inches and weight is in pounds, yet the coefficient " +
          "carries no units at all, so we can still compute and compare it. Wheelan calls it &quot;a single, " +
          "elegant descriptive statistic.&quot;</p>"
      },
      {
        h: "Some real correlations he cites",
        body:
          "<p>To give the scale meaning, the chapter quotes concrete correlations, all on the same $0$-to-$1$ scale.</p>" +
          "<table class=\"extable\">" +
          "<thead><tr><th>Relationship</th><th class=\"num\">Correlation</th></tr></thead>" +
          "<tbody>" +
          "<tr><td class=\"row-h\">Height and weight, adult U.S. men</td><td class=\"num\">0.4</td></tr>" +
          "<tr><td class=\"row-h\">High school GPA and first-year college GPA</td><td class=\"num\">0.56</td></tr>" +
          "<tr><td class=\"row-h\">SAT composite score and first-year college GPA</td><td class=\"num\">0.56</td></tr>" +
          "<tr><td class=\"row-h\">SAT plus high school GPA combined, vs college grades</td><td class=\"num\">0.64</td></tr>" +
          "</tbody></table>" +
          "<p>The combination of SAT and high school GPA ($0.64$) predicts first-year college grades better than " +
          "either one alone.</p>"
      }
    ],
    takeaways: [
      "The coefficient always lies between −1 and +1.",
      "+1 perfect positive, −1 perfect negative, 0 no meaningful link.",
      "It is unitless, so inches and pounds can be related on one scale.",
      "SAT and high school GPA together correlate 0.64 with college grades."
    ]
  });

  // 5 — Correlation is not causation
  B({
    id: "naked-ch4-not-causation",
    chapter: "Chapter 4",
    title: "Correlation is not causation",
    tagline: "An association can be driven by a hidden third variable, not by one causing the other.",
    sections: [
      {
        h: "The third variable",
        body:
          "<p>A positive or negative association does not mean one variable causes the change in the other. " +
          "Wheelan's example is the positive correlation between a student's SAT scores and the number of " +
          "televisions in the family home.</p>" +
          "<p>Buying more televisions will not raise a child's test scores, and watching more TV is not what helps " +
          "academics. The most logical explanation is a <strong>third variable</strong>: parental education. " +
          "Highly educated parents can afford many televisions and also tend to have children who test well, so " +
          "both the TVs and the scores are driven by that shared cause.</p>" +
          "<p>He backs the income link with the College Board's figures: students from families earning over " +
          "&dollar;200,000 have a mean SAT math score of 586, versus 460 for students from families earning " +
          "&dollar;20,000 or less — and wealthier families also own more televisions.</p>"
      }
    ],
    takeaways: [
      "Correlation does not imply causation.",
      "TVs and SAT scores correlate because of a third variable: parental education.",
      "College Board: SAT math 586 (family income over \\$200k) vs 460 (under \\$20k)."
    ]
  });

  // 6 — Netflix recommendations and the Netflix Prize
  B({
    id: "naked-ch4-netflix-prize",
    chapter: "Chapter 4",
    title: "Netflix recommendations and the Netflix Prize",
    tagline: "Netflix recommends films by exploiting correlation between customers' ratings.",
    sections: [
      {
        h: "How Netflix exploits correlation",
        body:
          "<p>Netflix does not know you personally — but it knows how you have rated films, because you told it. " +
          "Wheelan explains the &quot;big picture&quot;: Netflix compares your ratings with other customers' " +
          "ratings to find people whose tastes are highly correlated with yours. Those like-minded customers tend " +
          "to like what you like, so Netflix recommends films they rated highly that you have not yet seen.</p>" +
          "<p>His own case: the documentary <em>Bhutto</em> was recommended because he had given five stars to two " +
          "other documentaries, <em>Enron: The Smartest Guys in the Room</em> and <em>Fog of War</em>. He later " +
          "watched <em>Bhutto</em> and gave it five stars — just as Netflix predicted.</p>"
      },
      {
        h: "The \\$1,000,000 Netflix Prize",
        body:
          "<p>The real method is far more complex than the &quot;big picture.&quot; In 2006 Netflix launched a " +
          "contest offering &dollar;1,000,000 to anyone who could improve its recommendations by at least 10 " +
          "percent (i.e. 10 percent more accurate at predicting how a customer would rate a film after seeing it).</p>" +
          "<ul class=\"steps\">" +
          "<li>Each entrant received &quot;training data&quot;: more than 100 million ratings of 18,000 films by 480,000 customers.</li>" +
          "<li>A separate 2.8 million ratings were &quot;withheld&quot; — Netflix knew them, contestants did not.</li>" +
          "<li>Entries were judged on how well their algorithm predicted those withheld ratings.</li>" +
          "<li>Over three years, thousands of teams from more than 180 countries competed.</li>" +
          "<li>Two rules: the winner had to license the algorithm to Netflix and publicly describe how it worked.</li>" +
          "</ul>" +
          "<p>In 2009 a seven-person team of statisticians and computer scientists from the United States, Austria, " +
          "Canada, and Israel won. Their write-up ran 92 pages. Wheelan's point: even this fancy system is just a " +
          "sophisticated version of an old habit — find someone with similar tastes and ask them what to watch.</p>"
      }
    ],
    takeaways: [
      "Netflix finds customers whose ratings correlate with yours, then recommends what they liked.",
      "Bhutto was suggested from five-star ratings for Enron and Fog of War.",
      "The 2006 Netflix Prize: \\$1M for a 10% improvement; won in 2009.",
      "Training data: 100M+ ratings, 18,000 films, 480,000 customers; 2.8M ratings withheld."
    ]
  });

  // 7 — Appendix: the correlation coefficient formula
  B({
    id: "naked-ch4-appendix-formula",
    chapter: "Chapter 4",
    title: "The correlation coefficient formula",
    tagline: "Convert each variable to standard units, multiply, average — and you get r.",
    sections: [
      {
        h: "Standard units: the core trick",
        body:
          "<p>The appendix explains how the coefficient is actually computed and why it has no units. The trick is " +
          "to express every observation as its distance from the mean, measured in standard deviations — its " +
          "<strong>standard units</strong>.</p>" +
          "<p>Wheelan's worked illustration: suppose mean height is 66 inches with a standard deviation of 5 " +
          "inches, and mean weight is 177 pounds with a standard deviation of 10 pounds. A person who is 72 inches " +
          "tall and 168 pounds is:</p>" +
          "<ul class=\"steps\">" +
          "<li>Height in standard units: $(72 - 66)/5 = 1.2$ — that is, 1.2 standard deviations above the mean.</li>" +
          "<li>Weight in standard units: $(168 - 177)/10 = -0.9$ — that is, 0.9 standard deviations below the mean.</li>" +
          "</ul>" +
          "<p>Inches and pounds have vanished; both are now just numbers like $1.2$ and $-0.9$. That is what makes " +
          "the units go away. The formula then asks: when people are far from the mean in one variable, are they " +
          "also far from the mean in the other — and in which direction?</p>"
      },
      {
        h: "The formula",
        body:
          "<p>Writing $\\bar{x}$ for the mean of $x$ and $\\bar{y}$ for the mean of $y$, $\\sigma_x$ and $\\sigma_y$ " +
          "for their standard deviations, and $n$ for the number of observations, the correlation coefficient " +
          "$r$ for variables $x$ and $y$ is:</p>" +
          "<p>$$r = \\frac{1}{n} \\sum_{i=1}^{n} \\frac{(x_i - \\bar{x})}{\\sigma_x} \\cdot \\frac{(y_i - \\bar{y})}{\\sigma_y}$$</p>" +
          "<p>The symbol $\\sum$ (the summation sign) means &quot;add up the quantity that follows.&quot; So we " +
          "convert each $x$ to standard units, convert each $y$ to standard units, multiply the two for each " +
          "observation, add up all $n$ products, and divide by $n$. In words: the average product of the two " +
          "variables' standard units.</p>" +
          "<ul class=\"steps\">" +
          "<li>Step 1: convert each height to standard units, $(x_i - \\bar{x})/\\sigma_x$.</li>" +
          "<li>Step 2: convert each weight to standard units, $(y_i - \\bar{y})/\\sigma_y$.</li>" +
          "<li>Step 3: multiply the two standard-unit values for each student; this is largest when both are far from the mean.</li>" +
          "<li>Step 4: $r$ is the sum of those products divided by the number of observations $n$.</li>" +
          "</ul>"
      },
      {
        h: "Worked example: 15 students",
        body:
          "<p>The appendix runs the calculation on 15 hypothetical students. The mean height is 68.73 inches " +
          "(standard deviation 4.36) and the mean weight is 157.33 pounds (standard deviation 36.12). Each " +
          "student's height and weight are converted to standard units and multiplied; column F below is that " +
          "product.</p>" +
          "<table class=\"extable\">" +
          "<thead><tr><th>Student</th><th class=\"num\">Height</th><th class=\"num\">Weight</th>" +
          "<th class=\"num\">Height (std units)</th><th class=\"num\">Weight (std units)</th><th class=\"num\">Product</th></tr></thead>" +
          "<tbody>" +
          "<tr><td class=\"row-h\">Nick</td><td class=\"num\">74</td><td class=\"num\">193</td><td class=\"num\">1.21</td><td class=\"num\">0.99</td><td class=\"num\">1.19</td></tr>" +
          "<tr><td class=\"row-h\">Elana</td><td class=\"num\">66</td><td class=\"num\">133</td><td class=\"num\">-0.63</td><td class=\"num\">-0.67</td><td class=\"num\">0.42</td></tr>" +
          "<tr><td class=\"row-h\">Dinah</td><td class=\"num\">68</td><td class=\"num\">155</td><td class=\"num\">-0.17</td><td class=\"num\">-0.06</td><td class=\"num\">0.01</td></tr>" +
          "<tr><td class=\"row-h\">Rebecca</td><td class=\"num\">69</td><td class=\"num\">147</td><td class=\"num\">0.06</td><td class=\"num\">-0.29</td><td class=\"num\">-0.02</td></tr>" +
          "<tr><td class=\"row-h\">Ben</td><td class=\"num\">73</td><td class=\"num\">175</td><td class=\"num\">0.98</td><td class=\"num\">0.49</td><td class=\"num\">0.48</td></tr>" +
          "<tr><td class=\"row-h\">Charu</td><td class=\"num\">70</td><td class=\"num\">128</td><td class=\"num\">0.29</td><td class=\"num\">-0.81</td><td class=\"num\">-0.24</td></tr>" +
          "<tr><td class=\"row-h\">Sahar</td><td class=\"num\">60</td><td class=\"num\">100</td><td class=\"num\">-2.00</td><td class=\"num\">-1.59</td><td class=\"num\">3.18</td></tr>" +
          "<tr><td class=\"row-h\">Maggie</td><td class=\"num\">63</td><td class=\"num\">128</td><td class=\"num\">-1.32</td><td class=\"num\">-0.81</td><td class=\"num\">1.07</td></tr>" +
          "<tr><td class=\"row-h\">Faisal</td><td class=\"num\">67</td><td class=\"num\">170</td><td class=\"num\">-0.40</td><td class=\"num\">0.35</td><td class=\"num\">-0.14</td></tr>" +
          "<tr><td class=\"row-h\">Ted</td><td class=\"num\">70</td><td class=\"num\">182</td><td class=\"num\">0.29</td><td class=\"num\">0.68</td><td class=\"num\">0.20</td></tr>" +
          "<tr><td class=\"row-h\">Narciso</td><td class=\"num\">70</td><td class=\"num\">178</td><td class=\"num\">0.29</td><td class=\"num\">0.57</td><td class=\"num\">0.17</td></tr>" +
          "<tr><td class=\"row-h\">Karina</td><td class=\"num\">70</td><td class=\"num\">118</td><td class=\"num\">0.29</td><td class=\"num\">-1.09</td><td class=\"num\">-0.32</td></tr>" +
          "<tr><td class=\"row-h\">CJ</td><td class=\"num\">75</td><td class=\"num\">227</td><td class=\"num\">1.44</td><td class=\"num\">1.93</td><td class=\"num\">2.77</td></tr>" +
          "<tr><td class=\"row-h\">Sophia</td><td class=\"num\">62</td><td class=\"num\">115</td><td class=\"num\">-1.54</td><td class=\"num\">-1.17</td><td class=\"num\">1.81</td></tr>" +
          "<tr><td class=\"row-h\">Will</td><td class=\"num\">74</td><td class=\"num\">211</td><td class=\"num\">1.21</td><td class=\"num\">1.49</td><td class=\"num\">1.80</td></tr>" +
          "</tbody></table>" +
          "<ul class=\"steps\">" +
          "<li>Sum of the products (column F): $12.39$.</li>" +
          "<li>Divide by the number of observations: $r = 12.39 / 15 = 0.83$.</li>" +
          "</ul>" +
          "<p>A correlation of $0.83$ is a relatively high degree of positive correlation — just what we expect " +
          "between height and weight. Wheelan notes Microsoft Excel gives the same answer, $0.83$.</p>"
      }
    ],
    takeaways: [
      "Convert each variable to standard units: (value − mean)/standard deviation.",
      "r is the average over n observations of the product of the two standard-unit values.",
      "Σ means sum the quantity that follows it.",
      "For the 15 students: sum of products 12.39, r = 12.39/15 = 0.83."
    ]
  });
})();
