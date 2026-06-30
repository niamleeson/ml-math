/* "Naked Statistics" (Charles Wheelan) — Chapter 3: Deceptive Description
   One consolidated lesson covering every concept in the chapter. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch3",
    chapter: "Chapter 3",
    title: "Deceptive Description",
    tagline: "How the same honest-looking statistics get arranged to mislead.",
    sections: [
      { body: "<h3 class=\"book-concept\">True but misleading statements</h3><p class=\"book-lead\">A statement can be perfectly true and still deceive.</p><h4 class=\"book-sub\">The great personality problem</h4><p>Wheelan opens with a dating phrase. Calling someone \"a great personality\" can be true. But it sets off alarm bells. Why. Because a true statement is being used to hide other facts. Maybe the person has a prison record. Maybe the divorce is not final. The praise is real. The danger is what it leaves out.</p><p>This is not a lie. It would not get you convicted of perjury. But it can still be so incomplete that it misleads.</p><h4 class=\"book-sub\">Why statistics are easy to bend</h4><p>Statistics rest on math, and math is exact. But using statistics to describe messy real things is not exact. That leaves room to shade the truth. Mark Twain is said to have named three kinds of lies: lies, damned lies, and statistics.</p><p>The deep reason: most things we care about can be described in many ways. \"He has a great personality\" or \"he was convicted of securities fraud\" can describe the same man. Once many true descriptions exist, the one you pick shapes the impression. Good facts can support a bad conclusion.</p>" },
      { body: "<h3 class=\"book-concept\">Precision versus accuracy</h3><p class=\"book-lead\">Precision is exactness of expression; accuracy is being close to the truth.</p><h4 class=\"book-sub\">Two different words</h4><p>People treat these as the same. They are not. Precision is how exactly you state something. \"41.6 miles\" is more precise than \"about 40 miles,\" which beats \"a long way.\" Accuracy is whether the figure is close to the truth.</p><p>Wheelan's example: you ask how far to the gas station. He says \"1.265 miles to the east.\" Very precise. But if the station is the other way, that precise answer is dead wrong. A vaguer set of directions that points you the right way is less precise yet far more accurate. An accurate figure gets better when you add precision. No amount of precision fixes an inaccurate figure.</p><h4 class=\"book-sub\">False certainty</h4><p>Precision can hide inaccuracy by faking certainty. In 1950, Senator Joseph McCarthy waved a paper and claimed a list of 205 communists in the State Department. The paper had no names. But the exact-sounding count gave a bald-faced lie an air of credibility.</p><p>Wheelan's golf range finder makes the same point gently. It read distances like \"147.2 yards\" — but it was set to meters, not yards, so every precise reading was wrong. And he sometimes aimed the laser at trees behind the green. A \"perfect\" shot then flew over the green into the forest. The lesson: even precise measurements must be checked against common sense.</p><p>Wall Street's pre-2008 \"value at risk\" models did this on a grand scale. The math produced reassuringly precise risk figures. But the assumptions about markets were just wrong — the range finder was set to meters — so the precise answers were wildly inaccurate.</p>" },
      { body: "<h3 class=\"book-concept\">What is actually being measured</h3><p class=\"book-lead\">Disputes often come from never agreeing on what to define.</p><h4 class=\"book-sub\">Talking past one another</h4><p>Even precise, accurate stats hit a deeper problem: a lack of clarity over what we are trying to describe. Wheelan compares statistical arguments to bad marriages — the disputants talk past one another.</p><p>His question: how healthy is American manufacturing. One side says factory jobs are vanishing to China and India. The other side says high-tech manufacturing thrives and the U.S. is a top exporter. Which is true.</p><h4 class=\"book-sub\">Both, depending on the definition</h4><p>The Economist reconciled the two with one graph (\"The Rustbelt Recovery,\" March 10, 2011). \"Health\" can mean output or it can mean employment.</p><ul class=\"steps\"><li>By output — the total value of goods produced and sold — U.S. manufacturing grew steadily in the 2000s, dipped in the recession, then bounced back. The U.S. is the world's third-largest manufacturing exporter, behind China and Germany.</li><li>By employment, jobs fell steadily — roughly six million manufacturing jobs lost in the last decade.</li><li>Together they tell the full story: U.S. manufacturing got far more productive — more output from fewer workers. Good for competitiveness, terrible for the displaced workers.</li></ul><p>The most complete picture includes both figures, as the Economist did.</p>" },
      { body: "<h3 class=\"book-concept\">Choosing the unit of analysis</h3><p class=\"book-lead\">Who or what is being counted can flip the message.</p><h4 class=\"book-sub\">Schools versus students</h4><p>The unit of analysis is the entity being compared or described. Change it and a true claim can reverse.</p><p>Two politicians, same town:</p><ul class=\"steps\"><li>Challenger: \"Sixty percent of our schools had lower test scores this year.\" Unit = schools.</li><li>Incumbent: \"Eighty percent of our students had higher test scores this year.\" Unit = students.</li></ul><p>Both can be true at once. Schools differ in size. If the improving students sit in a few very big schools, most students can improve while most schools decline.</p><h4 class=\"book-sub\">States versus Americans, and globalization</h4><p>Same trick with states: \"Thirty states had falling incomes\" versus \"Seventy percent of Americans had rising incomes.\" The biggest states (New York, California, Texas, Illinois) can carry most people upward while many small states slip.</p><p>A real version: is globalization making world income inequality better or worse. Comparing countries, richer 1980 countries grew faster than poorer ones from 1980 to 2000 — inequality looks worse. But we care about people, not countries. China and India, each over a billion people, were poor in 1980 and grew fast. Weighting China (1.3 billion) the same as Mauritius (1.3 million) makes no sense. With people as the unit, the Economist notes global inequality is falling rapidly.</p><p>The AT&T / Verizon ad war is the same. Verizon touted geographic coverage — \"area covered\" — because it had more of it. AT&T countered: \"AT&T covers 97 percent of Americans.\" Note \"Americans,\" not \"America.\" People do not live evenly across the map, so the chosen unit changes who wins.</p>" },
      { body: "<h3 class=\"book-concept\">Mean versus median</h3><p class=\"book-lead\">Pick the measure of the middle that flatters your case.</p><h4 class=\"book-sub\">Two measures of the middle</h4><p>The mean is the simple average: sum divided by count. The median is the midpoint — half the values lie above, half below. They can differ a lot.</p><p>Wheelan's set: 3, 4, 5, 6, and 102.</p><table class=\"extable\"><thead><tr><th>Measure</th><th class=\"num\">Value</th><th>How</th></tr></thead><tbody><tr><td class=\"row-h\">Mean</td><td class=\"num\">24</td><td>(3 + 4 + 5 + 6 + 102) / 5 = 120 / 5</td></tr><tr><td class=\"row-h\">Median</td><td class=\"num\">5</td><td>middle value of the sorted list</td></tr></tbody></table><p>To make the group look big, cite the mean (24). To make it look small, cite the median (5).</p><h4 class=\"book-sub\">The Bush tax cuts</h4><p>The Bush administration said 92 million Americans would get an average tax cut of over \\$1,000 (\\$1,083 to be precise). Was that accurate.</p><ul class=\"steps\"><li>Would 92 million people get a cut? Yes.</li><li>Would most get about \\$1,000? No — the median cut was less than \\$100.</li></ul><p>A few very wealthy people got huge cuts. Those outliers pulled the mean up. The median, immune to outliers, better described the typical household.</p><h4 class=\"book-sub\">When the median lies instead</h4><p>The median can deceive too, precisely because it ignores outliers. A pricey new drug raises median life expectancy by only two weeks — sounds not worth it. But suppose 30 to 40 percent of patients are cured entirely. That success hides in the median, though the mean would look impressive.</p><p>This is real. Biologist Stephen Jay Gould had a cancer with a median survival of eight months; he lived twenty more years (dying of an unrelated cancer). In his essay \"The Median Isn't the Message,\" he saw that the median only says half live at least eight months — and the distribution was right-skewed, so possibly far longer. The mean is affected by dispersion; the median is not. Whether outliers distort the message or are the message is a matter of judgment. A good analysis usually shows both.</p>" },
      { body: "<h3 class=\"book-concept\">Apples to oranges and real versus nominal</h3><p class=\"book-lead\">Compare figures in comparable units, especially across time.</p><h4 class=\"book-sub\">Convert to comparable units</h4><p>Many tricks are \"apples and oranges\" comparisons. A hotel in Paris at 180 a night sounds dearer than London at 150 — until you realize one is euros and the other pounds. Numbers in different currencies mean nothing until converted at the exchange rate.</p><p>The subtle version politicians and Hollywood exploit is inflation. A dollar today buys less than a dollar long ago. Something that cost \\$1 in 1950 would cost \\$9.37 in 2011. So comparing 1950 and 2011 dollars without adjusting is worse than comparing pounds and euros — those two are closer in value than a 1950 dollar is to a 2011 dollar.</p><h4 class=\"book-sub\">Nominal versus real</h4><p>Nominal figures are not adjusted for inflation; real figures are. A veterans' housing program at \\$10 million in 1970 and \\$40 million in 2011 looks like more spending. But one 1970 dollar equals \\$5.83 in 2011, so matching the old \\$10 million would take \\$58.3 million in 2011. At \\$40 million, the real commitment actually fell.</p><table class=\"extable\"><thead><tr><th>Year</th><th class=\"num\">Nominal spend</th><th class=\"num\">Needed to match 1970</th></tr></thead><tbody><tr><td class=\"row-h\">1970</td><td class=\"num\">\\$10M</td><td class=\"num\">\\$10M</td></tr><tr><td class=\"row-h\">2011</td><td class=\"num\">\\$40M</td><td class=\"num\">\\$58.3M</td></tr></tbody></table><p>The federal minimum wage (then \\$7.25) is nominal — the boss only owes the number on the check, not its buying power. Inflation erodes that, which is why unions bargain for cost-of-living adjustments.</p><h4 class=\"book-sub\">Top-grossing films</h4><p>Hollywood quotes nominal box office, so recent films look biggest only because tickets cost more now. As of 2011 the nominal top five were Avatar (2009), Titanic (1997), The Dark Knight (2008), Star Wars Episode IV (1977), and Shrek 2 (2004). Adjusted for inflation, the list changes completely: Gone with the Wind (1939), Star Wars Episode IV (1977), The Sound of Music (1965), E.T. (1982), and The Ten Commandments (1956). In real terms Avatar falls to 14th and Shrek 2 all the way to 31st.</p>" },
      { body: "<h3 class=\"book-concept\">Percentages from a low base</h3><p class=\"book-lead\">A huge percent change can be a tiny absolute change, and vice versa.</p><h4 class=\"book-sub\">Big percent, small money</h4><p>Percentages give scale and context, but they can exaggerate. Growth off a tiny starting point looks explosive. Wheelan saw his taxes for the Suburban Cook County Tuberculosis Sanitarium District set to rise 527 percent. Alarming — until the Chicago Sun-Times noted the typical homeowner's bill would go from \\$1.15 to \\$6. The base was tiny, so any rise looks huge.</p><table class=\"extable\"><thead><tr><th>Item</th><th class=\"num\">From</th><th class=\"num\">To</th><th class=\"num\">% change</th></tr></thead><tbody><tr><td class=\"row-h\">TB district tax bill</td><td class=\"num\">\\$1.15</td><td class=\"num\">\\$6.00</td><td class=\"num\">~527%</td></tr></tbody></table><h4 class=\"book-sub\">Small percent, huge money</h4><p>The flip side: a small percent of an enormous sum is big. A 4 percent rise in a roughly \\$700 billion defense budget is 4% × \\$700B = \\$28 billion — more than the entire NASA budget and about the Labor and Treasury budgets combined.</p><p>And a fair-sounding equal percent can hide huge gaps. \"Everyone gets the same 10 percent raise\" sounds generous. But a boss making \\$1,000,000 gets \\$100,000; an employee making \\$50,000 gets \\$5,000. \"Same 10 percent raise\" sounds better than \"my raise is twenty times bigger than yours\" — both true.</p><ul class=\"steps\"><li>Boss: 10% × \\$1,000,000 = \\$100,000.</li><li>Employee: 10% × \\$50,000 = \\$5,000.</li><li>Ratio: \\$100,000 / \\$5,000 = 20 times.</li></ul>" },
      { body: "<h3 class=\"book-concept\">Picking start and end points</h3><p class=\"book-lead\">The same data can flatter either party depending on where the clock starts.</p><h4 class=\"book-sub\">Republican slides and Democratic slides</h4><p>Any change over time needs a start point and an end point, and you can move them. Wheelan's professor spoke of his \"Republican slides\" and \"Democratic slides\" — the same defense-spending data arranged to please either audience.</p><p>For Republicans: a chart of defense spending 1981–1988 shows a steady climb, crediting Ronald Reagan's buildup. For Democrats: the same nominal data over a longer window, 1977–1988, shows the same rising trend already starting under Jimmy Carter. Same numbers; different start point; different hero.</p>" },
      { body: "<h3 class=\"book-concept\">Gaming a metric and perverse incentives</h3><p class=\"book-lead\">Be sure what you measure is really what you want to manage.</p><h4 class=\"book-sub\">You can't manage what you can't measure</h4><p>We do not just describe with statistics; we act on them. The aphorism says \"you can't manage what you can't measure.\" True — but you had better be sure the thing you measure is really what you want to manage.</p><p>School quality is the example. Raw test scores reflect students' family education and income, not just the school. What we want is \"value-added\" — how much the school changed achievement — not the absolute level. Even a pretest/posttest fails, because students learn at different rates. So ranking the \"best\" schools by test scores can mislead: the top Chicago high schools are selective-enrollment schools that admit students on the basis of high test scores. Honoring them for high scores is like giving the basketball team an award for producing tall students.</p><h4 class=\"book-sub\">When the metric changes behavior badly</h4><p>Managing by statistics can change behavior for the better — tie a bonus to fewer defective products and defects fall. The bad news is people may instead just make the statistic look better.</p><ul class=\"steps\"><li>Houston dropouts: schools reclassified quitters as transfers, returns abroad, or GED-seekers — none counted as dropouts. Houston reported a 1.5 percent dropout rate; 60 Minutes calculated the true rate at 25 to 50 percent.</li><li>Test scores: keeping the weakest students from reaching the tenth-grade test raises the average. One student spent three years in ninth grade, then jumped to eleventh — dodging the tenth-grade exam without dropping out.</li></ul><p>Superintendent Rod Paige's accountability program paid principals cash for meeting dropout and test targets and fired those who missed. Principals responded to the incentives — that is the lesson.</p><h4 class=\"book-sub\">Cardiologist scorecards</h4><p>New York published \"scorecards\" of mortality rates for cardiologists doing coronary angioplasty. Reasonable in theory. But the easiest way to improve a mortality rate is not to save more patients — it is to refuse the sickest ones. A University of Rochester survey found:</p><table class=\"extable\"><thead><tr><th>Surveyed cardiologists who said...</th><th class=\"num\">Share</th></tr></thead><tbody><tr><td class=\"row-h\">some at-risk patients might not get angioplasty because of the public stats</td><td class=\"num\">83%</td></tr><tr><td class=\"row-h\">the data influenced some of their personal medical decisions</td><td class=\"num\">79%</td></tr></tbody></table><p>The sad paradox: a helpful-looking statistic led doctors to rationally withhold care from the patients who needed it most.</p>" },
      { body: "<h3 class=\"book-concept\">Indices compound distortions</h3><p class=\"book-lead\">Collapsing many indicators into one number bakes in every choice.</p><h4 class=\"book-sub\">Every index inherits its construction</h4><p>An index has all the pitfalls of any descriptive statistic plus the distortions of merging several indicators into one number. By definition it depends on which measures go in and how each is weighted. Why does the NFL passer rating ignore third-down completions? In the Human Development Index, how should literacy be weighed against per capita income? The real question is whether the simplicity is worth the inaccuracy.</p><h4 class=\"book-sub\">The U.S. News college rankings</h4><p>The USNWR rankings use sixteen indicators. In 2010, \"student selectivity\" was 15 percent of the index, itself built from acceptance rate, share of entering students in the top 10 percent of their high school class, and average SAT/ACT scores. Much of the underlying data is genuinely useful.</p><p>But collapsing it into one authoritative-seeming rank is another matter. Former Macalester president Michael McPherson notes that ranking institutions in exact numerical order is a precision the data do not support. Why should alumni giving count 5 percent, not 10? The most heavily weighted variable for national universities is \"academic reputation,\" set by a peer-assessment survey of administrators and guidance counselors. Malcolm Gladwell skewers this: a survey once asked about a hundred lawyers to rank ten law schools, and they ranked Penn State near the middle — at a time when Penn State had no law school.</p><h4 class=\"book-sub\">Perverse incentives, again</h4><p>Most USNWR criteria measure inputs (who is admitted, faculty pay, share of full-time faculty), not learning. And the index encourages bad behavior. \"Financial resources per student\" rewards spending money but has no measure of spending it well, so a school that gets more effect for less money — and charges lower tuition — is punished. Schools also have an incentive to solicit applications from students with no real chance, just to look more selective. As Bard president Leon Botstein put it, people love easy answers — what is the best place? Number 1.</p>" }
    ],
    takeaways: [
      "A true statement is not always an honest one.",
      "Precision = exactness of expression. Accuracy = closeness to truth.",
      "Many fights are really about which definition to use.",
      "Unit of analysis = the entity being described (schools, students, states, people, area).",
      "Mean is pulled by outliers; median is not.",
      "Convert to common units before comparing — currency or inflation.",
      "527% sounds huge but was \\$1.15 to \\$6.",
      "Moving the start/end of a time series can change the story.",
      "Measuring something changes the behavior around it.",
      "An index hides choices: which inputs, what weights."
    ]
  });
  window.CODEVIZ["naked-ch3"] = {
    charts: [
      {
        "type": "line",
        "title": "Rustbelt recovery: output up, employment down (illustrative reconstruction of the Economist graph)",
        "interpret": "Output recovered after 2009 while manufacturing employment kept falling — both lines describe the same sector.",
        "xlabel": "Year",
        "ylabel": "Index",
        "series": [
          {
            "name": "Output (Dec 2007 = 100)",
            "color": "#4ea1ff",
            "points": [
              [
                2000,
                89
              ],
              [
                2002,
                87
              ],
              [
                2004,
                92
              ],
              [
                2006,
                99
              ],
              [
                2007,
                100
              ],
              [
                2008,
                95
              ],
              [
                2009,
                86
              ],
              [
                2010,
                95
              ]
            ]
          },
          {
            "name": "Employment (m)",
            "color": "#ffb454",
            "points": [
              [
                2000,
                17.3
              ],
              [
                2002,
                16
              ],
              [
                2004,
                14.3
              ],
              [
                2006,
                14.2
              ],
              [
                2008,
                13.4
              ],
              [
                2009,
                12
              ],
              [
                2010,
                11.6
              ]
            ]
          }
        ]
      },
      {
        "type": "bars",
        "title": "Mean vs median of 3, 4, 5, 6, 102",
        "interpret": "One outlier (102) drags the mean to 24 while the median stays at 5.",
        "labels": [
          "3",
          "4",
          "5",
          "6",
          "102",
          "mean",
          "median"
        ],
        "values": [
          3,
          4,
          5,
          6,
          102,
          24,
          5
        ],
        "colors": [
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#ffb454",
          "#7ee787"
        ]
      },
      {
        "type": "bars",
        "title": "Defense spending in billions, 1977-1988 (illustrative reconstruction)",
        "interpret": "Starting at 1981 credits Reagan; extending back to 1977 shows the climb began under Carter — same data.",
        "labels": [
          "1977",
          "1978",
          "1979",
          "1980",
          "1981",
          "1982",
          "1983",
          "1984",
          "1985",
          "1986",
          "1987",
          "1988"
        ],
        "values": [
          120,
          130,
          142,
          168,
          192,
          220,
          245,
          268,
          295,
          312,
          318,
          328
        ],
        "colors": [
          "#7ee787",
          "#7ee787",
          "#7ee787",
          "#7ee787",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff"
        ]
      }
    ]
  };
})();
