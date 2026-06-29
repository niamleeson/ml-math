/* Naked Statistics — Chapter 2: Descriptive Statistics (incl. Appendix). Self-registering fragment. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const BOOK = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1) Mean and its sensitivity to outliers
  B({
    id: "naked-ch2-mean",
    chapter: "Chapter 2",
    title: "The mean and its weakness with outliers",
    tagline: "The average is the simplest measure of the middle, but a single extreme value can drag it anywhere.",
    sections: [
      { h: "What the mean is", body:
        "<p>The most basic descriptive task is to find the middle of a set of data, what statisticians call its <em>central tendency</em>. The mean (the average) is the simplest such measure: add up all the values and divide by how many there are. The symbol $\\bar{x}$ means the average, and $n$ means the number of observations.</p>" +
        "<p>Wheelan's printer example: you compare warranty defects on the laser printers your firm sold against a competitor's. Tally every reported quality problem, then divide by the number of printers sold. Your firm averages <strong>9.1</strong> defects per printer; the competitor averages <strong>2.8</strong>. At a glance, your printers break far more often.</p>" },
      { h: "Why the mean can mislead", body:
        "<p>The trouble is that the mean is pulled by <em>outliers</em> — observations sitting far from the center. The bar-stool story makes this vivid: ten people sit in a Seattle bar, each earning $35{,}000 a year, so the mean income is $35{,}000. Then Bill Gates walks in (with a talking parrot) and, for the sake of the example, earns $1 billion a year.</p>" +
        "<ul class='steps'>" +
        "<li>Before Gates: total income $= 10 \\times 35{,}000 = 350{,}000$, so mean $= 350{,}000 / 10 = 35{,}000$.</li>" +
        "<li>After Gates: total $= 350{,}000 + 1{,}000{,}000{,}000 = 1{,}000{,}350{,}000$, divided by $11$ people $\\approx 90{,}940{,}909$, i.e. about $91 million.</li>" +
        "</ul>" +
        "<p>None of the original ten earns a penny more, yet calling this a bar of $91-million-a-year patrons is technically correct and grossly misleading. This is exactly why Wheelan says we should not judge the economic health of the middle class by per capita income: explosive growth at the very top can lift the average without helping the typical person.</p>" }
    ],
    takeaways: [
      "The mean = sum of values divided by the count.",
      "A single extreme value (Bill Gates) can move the mean far from where most data sit.",
      "An accurate average can still be a deeply misleading summary."
    ]
  });

  // 2) The median (robust middle)
  B({
    id: "naked-ch2-median",
    chapter: "Chapter 2",
    title: "The median resists outliers",
    tagline: "The median splits the data in half and barely flinches at extreme values.",
    sections: [
      { h: "What the median is", body:
        "<p>The median is the value that divides a distribution in half: half the observations lie above it and half below. With an even number of observations, the median is the midpoint between the two middle values.</p>" +
        "<p>Picture the bar patrons lined up on stools in ascending order of income. With ten original drinkers, the median is the midpoint of the fifth and sixth stools — $35{,}000. When Bill Gates joins, there are eleven people, and the income of the person on the sixth stool is the middle one: still <strong>$35{,}000</strong>. Even if Warren Buffett then takes a twelfth stool, the median does not budge.</p>" },
      { h: "Mean vs. median side by side", body:
        "<p>The bar-stool numbers show the contrast clearly.</p>" +
        "<table class='extable'><thead><tr><th>Scenario</th><th class='num'>Mean income</th><th class='num'>Median income</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>Ten original drinkers</td><td class='num'>$35{,}000</td><td class='num'>$35{,}000</td></tr>" +
        "<tr><td class='row-h'>After Bill Gates joins</td><td class='num'>~$91{,}000{,}000</td><td class='num'>$35{,}000</td></tr>" +
        "</tbody></table>" +
        "<p>Footnote detail from the book: with twelve patrons the median is the midpoint of the sixth and seventh stools. If both earn $35{,}000, the median is $35{,}000; if one earns $35{,}000 and the other $36{,}000, the median would be $35{,}500.</p>" +
        "<p>Neither measure is hard to compute. The real skill is judging which measure of the middle is the honest one for a given situation — a choice that is easy to exploit.</p>" }
    ],
    takeaways: [
      "The median is the middle value once the data are sorted.",
      "It ignores how extreme an outlier is, so it stays put when Bill Gates walks in.",
      "When you must pick, ask which 'middle' tells the truth here."
    ]
  });

  // 3) Frequency distribution & skew
  B({
    id: "naked-ch2-frequency-distribution",
    chapter: "Chapter 2",
    title: "Frequency distributions and skew",
    tagline: "Laying out how often each value occurs reveals shape — and shape explains why mean and median can diverge.",
    sections: [
      { h: "Reading a frequency distribution", body:
        "<p>A frequency distribution arrays every possible outcome along the bottom and shows how often each occurs. In Wheelan's competitor data, the number of quality problems per printer runs from zero to ten-or-more, and each bar's height is the share of printers with that many defects. Because the bars cover all outcomes, they must sum to 1 (100 percent). For example, 36 percent of the competitor's printers had exactly two defects.</p>" },
      { h: "Skew, and why the two firms differ", body:
        "<p>The competitor's distribution is nearly symmetrical, so its mean and median sit close together; it is only <em>slightly</em> skewed right by the few printers with many defects, which nudge the mean rightward but leave the median alone. The competitor's median is 2 defects.</p>" +
        "<p>Your own firm's distribution looks very different. Most printers cluster at zero or one defect, but a chunk of printers sit at 'ten or more.' That is a 'lemon' problem: a small number of badly broken printers inflate the mean to 9.1 while the median stays at just <strong>1</strong>. So your typical printer is actually <em>better</em> than the competitor's — and the fix is to find the bad batch, not retool the whole line.</p>" +
        "<p>Counts come from the chapter's appendix table. Charts below show both firms' frequency distributions.</p>" }
    ],
    takeaways: [
      "A frequency distribution shows the shape of the data; the bars sum to 1.",
      "Right-skew (a long tail of large values) pulls the mean above the median.",
      "Your firm's median (1) beats the competitor's (2) even though your mean (9.1) is far worse."
    ]
  });
  window.CODEVIZ["naked-ch2-frequency-distribution"] = {
    charts: [
      { type: "bars",
        title: "Competitor's printers — defects per printer (counts)",
        interpret: "Nearly symmetrical, peaking at two defects; mean and median both near 2.",
        labels: ["0","1","2","3","4","5","6","7","8","9","10+"],
        values: [12,14,36,13,8,6,5,3,0,2,1] },
      { type: "bars",
        title: "Your firm's printers — defects per printer (counts)",
        interpret: "Most printers have 0 or 1 defect, but a 'lemon' spike at 10+ inflates the mean to 9.1 while the median stays at 1.",
        labels: ["0","1","2","3","4","5","6","7","8","9","10+"],
        values: [25,31,9,4,3,0,0,1,1,0,26] }
    ]
  };

  // 4) Percentiles, quartiles, deciles
  B({
    id: "naked-ch2-percentiles",
    chapter: "Chapter 2",
    title: "Percentiles, quartiles, and deciles",
    tagline: "The median has relatives that locate any observation against the whole group.",
    sections: [
      { h: "Slicing the distribution", body:
        "<p>Just as the median cuts a distribution in half, you can cut it more finely:</p>" +
        "<ul class='steps'>" +
        "<li><strong>Quartiles</strong> split it into four equal quarters: the first quartile is the bottom 25 percent, the second the next 25 percent, and so on.</li>" +
        "<li><strong>Deciles</strong> split it into ten equal tenths. Being in the top decile of income means you earn more than 90 percent of fellow workers.</li>" +
        "<li><strong>Percentiles</strong> split it into hundredths. The 1st percentile is the bottom 1 percent; the 99th percentile is the top 1 percent.</li>" +
        "</ul>" },
      { h: "Why a percentile is useful", body:
        "<p>These statistics tell you where one observation sits relative to everyone else. If your child scores in the 3rd percentile on a reading test, you know at once the family should spend more time at the library — no need to know the test's content or how many questions were on it. A percentile ranks performance against all other test takers, which is exactly the kind of context a single raw score lacks.</p>" }
    ],
    takeaways: [
      "Quartiles = quarters, deciles = tenths, percentiles = hundredths.",
      "A percentile tells you where you rank, not what you scored.",
      "3rd percentile = near the bottom; 99th = near the top."
    ]
  });

  // 5) Absolute vs relative
  B({
    id: "naked-ch2-absolute-relative",
    chapter: "Chapter 2",
    title: "Absolute versus relative figures",
    tagline: "Some numbers mean something on their own; others only have meaning in comparison.",
    sections: [
      { h: "Two kinds of numbers", body:
        "<p>An <strong>absolute</strong> figure has intrinsic meaning you can read without context. If Wheelan shoots an 83 over eighteen holes of golf on a 58-degree day, both 83 and 58 are absolute figures — you can judge the round without knowing what anyone else shot.</p>" +
        "<p>A <strong>relative</strong> figure only has meaning compared with something else. Placing ninth in the golf tournament is relative: it means eight golfers shot better. Most standardized tests are relative in this way.</p>" },
      { h: "When relative beats absolute", body:
        "<p>His test example: a third grader in Illinois scores 43 out of 60 on the state math test. That raw 43 (an absolute score) tells you little. Convert it to a percentile by placing it among all Illinois third graders, and it gains meaning. If 43 lands in the <strong>83rd percentile</strong>, the student is doing better than most peers statewide; if it lands in the <strong>8th percentile</strong>, the student is really struggling. Here the relative figure is far more informative than the absolute one.</p>" }
    ],
    takeaways: [
      "Absolute: meaningful alone (an 83 in golf).",
      "Relative: meaningful only in comparison (ninth place; a percentile).",
      "43 out of 60 is uninformative until it becomes a percentile."
    ]
  });

  // 6) Standard deviation as dispersion
  B({
    id: "naked-ch2-standard-deviation",
    chapter: "Chapter 2",
    title: "Standard deviation measures spread",
    tagline: "Two groups can share a mean yet differ wildly in how spread out they are.",
    sections: [
      { h: "Why the middle is not enough", body:
        "<p>The standard deviation describes how dispersed the data are around their mean — how spread out the observations are. Two datasets can have the same middle but very different spread.</p>" +
        "<p>Wheelan's example: weigh 250 airline passengers and 250 Boston Marathon qualifiers. Suppose both groups average about 155 pounds. The airplane crowd, though, mixes 320-pound football players with tiny screaming infants, so its weights are spread far from the midpoint. The marathoners are all built much alike, so their weights cluster tightly. Same mean, very different dispersion — and the standard deviation is the single number that captures that difference.</p>" },
      { h: "The HCb2 blood-count story", body:
        "<p>Standard deviation gives 'excessive' a precise meaning. Your doctor reports an HCb2 count (a made-up blood chemical) of 134, while the mean for your age is 122 (and the median is about the same). Panic — until you learn the standard deviation is 18.</p>" +
        "<ul class='steps'>" +
        "<li>Your count is $134 - 122 = 12$ points above the mean.</li>" +
        "<li>That gap (12) is less than one standard deviation (18), so you are well inside the normal range.</li>" +
        "</ul>" +
        "<p>He anchors the idea with height: American adult men average about 5 feet 10 inches with a standard deviation of roughly 3 inches, so most men fall between 5 feet 7 and 6 feet 1 — within one standard deviation. A man three standard deviations above the mean would be 6 feet 7 or taller, which is genuinely rare. Likewise, with SAT math scores averaging 500 and a standard deviation of 100, most scores fall between 400 and 600, and a 720 (more than two standard deviations up) is scored by very few.</p>" }
    ],
    takeaways: [
      "Standard deviation = how far observations typically sit from the mean.",
      "Airline passengers and marathoners share a mean but differ in spread.",
      "An HCb2 of 134 is only 12 above a mean of 122 — under one SD of 18, so it is normal."
    ]
  });

  // 7) Normal distribution & 68–95–99.7
  B({
    id: "naked-ch2-normal-distribution",
    chapter: "Chapter 2",
    title: "The normal distribution and its bands",
    tagline: "The bell curve fixes exactly how much data falls within each standard deviation of the mean.",
    sections: [
      { h: "The bell shape", body:
        "<p>Normally distributed data are symmetrical around their mean in a bell shape. Wheelan likens it to popcorn on a stove: a few kernels pop early, the popping crescendos, then fades at about the same rate it built. The heights of American men, SAT scores (designed to have mean 500, SD 100), and — per the <em>Wall Street Journal</em> — even where Americans park at the mall all follow this pattern, peaking at the center with tails trailing off on both sides.</p>" },
      { h: "The 68–95–99.7 rule", body:
        "<p>The power of the normal curve is that the proportion of observations within each standard-deviation band is fixed by definition:</p>" +
        "<table class='extable'><thead><tr><th>Range around the mean</th><th class='num'>Share of data</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>Within 1 standard deviation</td><td class='num'>68.2%</td></tr>" +
        "<tr><td class='row-h'>Within 2 standard deviations</td><td class='num'>95.4%</td></tr>" +
        "<tr><td class='row-h'>Within 3 standard deviations</td><td class='num'>99.7%</td></tr>" +
        "</tbody></table>" +
        "<p>The chapter's figure splits the curve into bands: 34.1% of the data sits between the mean and one SD on each side, and another 13.6% in the next band out (the $\\mu \\pm 2\\sigma$ band). The mean is written $\\mu$ and the standard deviation $\\sigma$. Wheelan calls this the foundation on which much of statistics is built.</p>" }
    ],
    takeaways: [
      "Normal data are symmetric and bell-shaped around the mean $\\mu$.",
      "68.2% within 1 SD, 95.4% within 2 SD, 99.7% within 3 SD.",
      "Each half-band: 34.1% just outside the mean, then 13.6% further out."
    ]
  });
  window.CODEVIZ["naked-ch2-normal-distribution"] = {
    charts: [
      { type: "line",
        title: "The normal distribution",
        interpret: "Symmetric bell shape: 34.1% of data sits between the mean and one SD on each side, 13.6% in each next band, so 68.2% lies within one SD.",
        xlabel: "Standard deviations from the mean (μ)",
        ylabel: "Relative frequency",
        series: [ { name: "Normal curve", color: "#4ea1ff", points: [
          [-3.5,0.001],[-3,0.004],[-2.5,0.018],[-2,0.054],[-1.5,0.130],[-1,0.242],[-0.5,0.352],[0,0.399],
          [0.5,0.352],[1,0.242],[1.5,0.130],[2,0.054],[2.5,0.018],[3,0.004],[3.5,0.001] ] } ] }
    ]
  };

  // 8) An index as a built-up statistic
  B({
    id: "naked-ch2-index",
    chapter: "Chapter 2",
    title: "An index and its weighting tradeoffs",
    tagline: "Combining several statistics into one number enables ranking — but the weights you choose decide the winner.",
    sections: [
      { h: "What an index does", body:
        "<p>Some questions resist a single statistic. Aaron Rodgers throws for 365 yards but no touchdowns; Peyton Manning throws for only 127 yards but three touchdowns. Who played better? The NFL passer rating answers by building an <strong>index</strong> — a descriptive statistic assembled from other descriptive statistics. Once many measures fold into one number, you can rank quarterbacks for a day or a career. The Miss America winner is likewise an index combining five separate competitions.</p>" },
      { h: "The weighting tradeoff", body:
        "<p>The very advantage of an index — collapsing complex information into one number — is also its weakness, because there are countless ways to do the collapsing, each able to crown a different winner.</p>" +
        "<p>Wheelan cites Malcolm Gladwell on <em>Car and Driver</em>'s ranking of three sports cars (Porsche Cayman, Chevrolet Corvette, Lotus Evora) using a 21-variable formula. The Porsche won, but 'exterior styling' counted for only <strong>4 percent</strong> of the score. Reweight styling up to <strong>25 percent</strong> and the Lotus wins. Reweight to put more weight on sticker price (so price, styling, and vehicle characteristics count equally) and the Chevy Corvette wins. Same cars, different weights, different champion.</p>" +
        "<p>So indices range from useful-but-imperfect to outright charades. The UN Human Development Index is a useful one: it blends income with life expectancy and education. The U.S. ranks 11th in per capita output but 4th in human development — and no reasonable reweighting will ever vault Zimbabwe past Norway.</p>" }
    ],
    takeaways: [
      "An index is a statistic built from other statistics, enabling ranking.",
      "The chosen weights drive the result: Porsche, Lotus, or Corvette can each 'win'.",
      "Good indices (like the HDI) are robust to small reweightings; weak ones are charades."
    ]
  });

  // 9) Appendix: variance and standard deviation formulas
  B({
    id: "naked-ch2-variance-formula",
    chapter: "Chapter 2",
    title: "Variance and standard deviation formulas",
    tagline: "Variance is the mean of the squared distances from the mean; standard deviation is its square root.",
    sections: [
      { h: "The formula", body:
        "<p>The chapter's appendix gives the formulas. Variance, written $\\sigma^2$, measures how far observations lie from the mean — but each distance is <em>squared</em> first, then those squared terms are summed and divided by the number of observations $n$.</p>" +
        "<p>For $n$ observations $x_1, x_2, \\ldots, x_n$ with mean $\\mu$:</p>" +
        "<p>$\\sigma^2 = \\dfrac{(x_1-\\mu)^2 + (x_2-\\mu)^2 + \\cdots + (x_n-\\mu)^2}{n}$</p>" +
        "<p>Squaring means observations far from the mean (outliers) get extra weight. The standard deviation $\\sigma$ is simply the square root of the variance: $\\sigma = \\sqrt{\\sigma^2}$.</p>" },
      { h: "The two student-height groups", body:
        "<p>The appendix table compares two groups of six students, each with a mean height $\\mu = 70$ inches, and each group's heights differing from the mean by the same <em>total</em> of 14 inches. By that crude measure they look identical — but squaring exposes a difference.</p>" +
        "<p><strong>Group 1</strong> heights: 74, 66, 68, 69, 73, 70.</p>" +
        "<table class='extable'><thead><tr><th>Student</th><th class='num'>Height</th><th class='num'>|x − μ|</th><th class='num'>(x − μ)²</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>Nick</td><td class='num'>74</td><td class='num'>4</td><td class='num'>16</td></tr>" +
        "<tr><td class='row-h'>Elana</td><td class='num'>66</td><td class='num'>4</td><td class='num'>16</td></tr>" +
        "<tr><td class='row-h'>Dinah</td><td class='num'>68</td><td class='num'>2</td><td class='num'>4</td></tr>" +
        "<tr><td class='row-h'>Rebecca</td><td class='num'>69</td><td class='num'>1</td><td class='num'>1</td></tr>" +
        "<tr><td class='row-h'>Ben</td><td class='num'>73</td><td class='num'>3</td><td class='num'>9</td></tr>" +
        "<tr><td class='row-h'>Charu</td><td class='num'>70</td><td class='num'>0</td><td class='num'>0</td></tr>" +
        "<tr><td class='row-h'>Total</td><td class='num'>—</td><td class='num'>14</td><td class='num'>46</td></tr>" +
        "</tbody></table>" +
        "<p><strong>Group 2</strong> heights: 65, 68, 69, 70, 71, 75.</p>" +
        "<table class='extable'><thead><tr><th>Student</th><th class='num'>Height</th><th class='num'>|x − μ|</th><th class='num'>(x − μ)²</th></tr></thead><tbody>" +
        "<tr><td class='row-h'>Sahar</td><td class='num'>65</td><td class='num'>5</td><td class='num'>25</td></tr>" +
        "<tr><td class='row-h'>Maggie</td><td class='num'>68</td><td class='num'>2</td><td class='num'>4</td></tr>" +
        "<tr><td class='row-h'>Faisal</td><td class='num'>69</td><td class='num'>1</td><td class='num'>1</td></tr>" +
        "<tr><td class='row-h'>Ted</td><td class='num'>70</td><td class='num'>0</td><td class='num'>0</td></tr>" +
        "<tr><td class='row-h'>Jeff</td><td class='num'>71</td><td class='num'>1</td><td class='num'>1</td></tr>" +
        "<tr><td class='row-h'>Narciso</td><td class='num'>75</td><td class='num'>5</td><td class='num'>25</td></tr>" +
        "<tr><td class='row-h'>Total</td><td class='num'>—</td><td class='num'>14</td><td class='num'>56</td></tr>" +
        "</tbody></table>" },
      { h: "Computing the spread", body:
        "<ul class='steps'>" +
        "<li>Group 1 variance $= 46 / 6 = 7.7$, so standard deviation $= \\sqrt{7.7} = 2.8$.</li>" +
        "<li>Group 2 variance $= 56 / 6 = 9.3$, so standard deviation $= \\sqrt{9.3} = 3.0$.</li>" +
        "</ul>" +
        "<p>Both groups have the same mean (70) and the same total absolute deviation (14), yet Group 2 has the larger variance — because squaring gives extra weight to its two students far from the mean (Sahar and Narciso, each 5 inches off). Variance is rarely reported on its own; it is mainly a stepping stone to the more intuitive standard deviation.</p>" }
    ],
    takeaways: [
      "Variance $\\sigma^2$ = average of the squared deviations from the mean.",
      "Squaring punishes outliers: Group 2's variance (9.3) tops Group 1's (7.7) despite equal totals.",
      "Standard deviation $\\sigma = \\sqrt{\\sigma^2}$ — 2.8 vs 3.0 inches here."
    ]
  });
})();
