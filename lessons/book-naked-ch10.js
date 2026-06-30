/* "Naked Statistics" (Charles Wheelan) — Chapter 10: Polling
   One consolidated lesson covering every concept in the chapter. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch10",
    chapter: "Chapter 10",
    title: "Polling",
    tagline: "Confidence intervals and the margin of error behind every poll.",
    sections: [
      { body: "<h3 class=\"book-concept\">A poll is inference from a sample</h3><p class=\"book-lead\">We judge a whole population from a small representative sample.</p><h4 class=\"book-sub\">The basic idea</h4><p>A poll, or survey, is a statement about the opinions of an entire population built only from the answers of a sample drawn from that population. When the New York Times reports that some percentage of Americans feel a certain way, nobody asked hundreds of millions of adults. They asked a sample and inferred the rest.</p><p>Wheelan stresses that this is just another form of statistical inference. The engine underneath it is the same one used throughout the book: the central limit theorem. If a large, representative sample is drawn, we can reasonably assume the sample looks much like the population it came from.</p><h4 class=\"book-sub\">Why it works</h4><p>If roughly half of all American adults held some view, then a representative sample of about 1,000 people should also show roughly half holding that view. The author runs the logic in reverse too, which is the part that matters for polling: if a sample of 1,000 shows 46 percent feeling a certain way, we infer the population likely feels close to that as well.</p><p>His soup metaphor captures it: taste a spoonful, stir, taste again, and the two spoonfuls taste similar. Two independent samples of the same population should not diverge wildly.</p>" },
      { body: "<h3 class=\"book-concept\">The statistic is a proportion</h3><p class=\"book-lead\">Polls estimate a percentage, not an average.</p><h4 class=\"book-sub\">Proportion instead of mean</h4><p>The one fundamental difference between polling and the earlier sampling examples is the quantity being measured. Earlier the sample statistic was a mean, like a mean weight of 187 pounds. In a poll the statistic is a percentage or proportion, such as 47 percent of voters, written as .47.</p><p>Everything else is identical. We expect the proportion of respondents who feel a certain way (for instance, the 9 percent who thought Congress was doing a good job) to be roughly equal to the proportion of the whole population who feel that way, just as a sample mean weight should be roughly equal to the population mean weight.</p><h4 class=\"book-sub\">Variation from sample to sample</h4><p>We still expect some wobble. If the same questions were asked of a fresh sample of 1,000 adults, the results would almost surely not be identical to the first poll, but they should not diverge widely either. How much they wobble is exactly what the standard error describes, here measured poll to poll.</p>" },
      { body: "<h3 class=\"book-concept\">Margin of error is a 95 percent confidence interval</h3><p class=\"book-lead\">Plus-or-minus 3 percent is the same 95 percent interval from earlier chapters.</p><h4 class=\"book-sub\">What the margin of error means</h4><p>When a poll reports a margin of error of $\\pm 3$ percent, that is simply the 95 percent confidence interval from the previous chapter. Saying we have 95 percent confidence means that if we ran 100 different polls on samples from the same population, about 95 of them would land within 3 percentage points of the population's true sentiment.</p><p>For the New York Times / CBS job-approval question, 46 percent disapproved with a margin of error of $\\pm 3$ percent. So we can be 95 percent confident the true proportion of all Americans who disapprove lies in the range 46 percent $\\pm 3$ percent.</p><h4 class=\"book-sub\">The worked interval</h4><ul class=\"steps\"><li>Sample result: 46 percent disapprove.</li><li>Margin of error: $\\pm 3$ percentage points.</li><li>Lower bound: $46 - 3 = 43$ percent.</li><li>Upper bound: $46 + 3 = 49$ percent.</li><li>Conclusion: 95 percent confident the true value is between 43 and 49 percent.</li></ul><p>The small print on the actual poll said the same thing in plain words: in 19 cases out of 20 (that is, 95 percent), results from such samples would differ by no more than 3 percentage points from interviewing every American adult.</p>" },
      { body: "<h3 class=\"book-concept\">Standard error of a proportion</h3><p class=\"book-lead\">SE for a percentage uses p, one minus p, and the sample size.</p><h4 class=\"book-sub\">The formula</h4><p>The standard error formula for a proportion looks a little different from the one introduced earlier, but the intuition is identical. For any properly drawn random sample,</p><p style=\"text-align:center\">$\\text{SE} = \\sqrt{\\dfrac{p(1-p)}{n}}$</p><p>Here $p$ is the proportion expressing one view, $1-p$ is the proportion expressing a different view, and $n$ is the total number of respondents. The standard error tells us how much dispersion to expect in our sample proportion from one poll to the next.</p><h4 class=\"book-sub\">Worked example — the exit poll</h4><p>An exit poll of 500 voters finds 53 percent for the Republican, 45 percent for the Democrat, and 2 percent for a third-party candidate. Using the Republican share as $p$:</p><ul class=\"steps\"><li>$p = .53$, so $1-p = .47$, and $n = 500$.</li><li>$p(1-p) = .53 \\times .47 = .2491$.</li><li>Divide by $n$: $.2491 / 500 = .0005$ (rounded).</li><li>Take the square root: $\\sqrt{.0005} = .02236$.</li><li>Round for simplicity: $\\text{SE} \\approx .02$, i.e. about 2 percentage points.</li></ul><h4 class=\"book-sub\">Why the standard error matters</h4><p>The standard error sets how often the sample proportion lands close to the true value. About 68 percent of the time the sample proportion falls within one standard error of the true tally. So with 68 percent confidence the network could say the Republican has 53 percent $\\pm 2$ percent, or between 51 and 55 percent, while the Democrat has 45 percent $\\pm 2$ percent, or between 43 and 47 percent. On that arithmetic the Republican is ahead.</p>" },
      { body: "<h3 class=\"book-concept\">A bigger sample shrinks the standard error</h3><p class=\"book-lead\">Sample size sits in the denominator, so more respondents means tighter results.</p><h4 class=\"book-sub\">n is in the denominator</h4><p>Because $n$ sits under the square root in the denominator, the standard error falls as the sample grows. A bigger sample makes for a shrinking standard error, which is how large national polls can end up surprisingly accurate.</p><h4 class=\"book-sub\">Worked example — quadrupling the sample</h4><p>A second exit poll uses 2,000 voters (four times the first poll of 500) and shows the Republican at 52 percent. The new standard error:</p><ul class=\"steps\"><li>$p = .52$, $1-p = .48$, $n = 2{,}000$.</li><li>$p(1-p) = .52 \\times .48 = .2496$.</li><li>Divide by $n$: $.2496 / 2{,}000 = .0001248$.</li><li>Square root: $\\sqrt{.0001248} = .01117$, which rounds to $.01$.</li></ul><p>Quadrupling the sample roughly halved the standard error, from about .02 to about .01.</p><h4 class=\"book-sub\">Now the call is safe</h4><p>With a .01 standard error the 95 percent intervals are Republican 52 $\\pm 2$ (50 to 54 percent) and Democrat 45 $\\pm 2$ (43 to 47 percent). The two intervals no longer overlap, so the Republican can be declared the winner with more than 95 percent confidence. At three standard errors (99.7 percent confidence) the intervals are 52 $\\pm 3$ and 45 $\\pm 3$, still not overlapping.</p>" },
      { body: "<h3 class=\"book-concept\">The trade-off between confidence and precision</h3><p class=\"book-lead\">Without new data, more confidence means a wider, less specific claim.</p><h4 class=\"book-sub\">Buying confidence with width</h4><p>About 95 percent of sample proportions lie within two standard errors of the truth. For the original 500-voter exit poll, two standard errors is about 4 percentage points. To be 95 percent confident instead of 68 percent confident, the station must widen the margin of error from $\\pm 2$ to $\\pm 4$ percent.</p><h4 class=\"book-sub\">What that does to the call</h4><ul class=\"steps\"><li>At 95 percent confidence the Republican is 53 $\\pm 4$ percent, or 49 to 57 percent.</li><li>The Democrat is 45 $\\pm 4$ percent, or 41 to 49 percent.</li><li>Both intervals reach 49 percent, so a tie can no longer be ruled out.</li><li>The clear winner has vanished, even though nothing about the data changed.</li></ul><p>This is an inevitable trade-off: without collecting new data, the only way to be more certain is to be less specific. Wheelan's everyday version: you may be \"pretty sure\" Thomas Jefferson was the third or fourth president, but you can be \"absolutely positive\" he was one of the first five. More confidence, less precision.</p>" },
      { body: "<h3 class=\"book-concept\">Assuming p equals point five</h3><p class=\"book-lead\">Pollsters use the most cautious proportion to set one margin for the whole poll.</p><h4 class=\"book-sub\">Each question has its own standard error</h4><p>Strictly, the standard error depends on the response, because $p(1-p)$ changes with $p$. The finding that 9 percent approve of Congress should have a smaller standard error than the finding that 46 percent approve of the president, since $.09 \\times .91 = .0819$ is less than $.46 \\times .54 = .2484$.</p><h4 class=\"book-sub\">The largest standard error is at p = .5</h4><p>The product $p(1-p)$ is largest when $p = .5$. Compare $(.05)(.95) = .0475$ against $(.5)(.5) = .25$: opinions split 50-50 give the biggest standard error. Because it would be confusing to publish a different margin of error for every question, polls typically assume $p = .5$, which yields the largest possible standard error for a given sample size, and apply that single margin to the whole poll.</p><table class=\"extable\"><thead><tr><th>proportion p</th><th class=\"num\">p (1 - p)</th></tr></thead><tbody><tr><td class=\"row-h\">.05</td><td class=\"num\">.0475</td></tr><tr><td class=\"row-h\">.09</td><td class=\"num\">.0819</td></tr><tr><td class=\"row-h\">.46</td><td class=\"num\">.2484</td></tr><tr><td class=\"row-h\">.50</td><td class=\"num\">.2500</td></tr></tbody></table><h4 class=\"book-sub\">Why the largest SE is the safe choice</h4><p>Using the biggest possible standard error builds extra caution into the intervals. The chapter appendix gives the intuition: when $p$ and $1-p$ are near 50 percent, small sampling errors blow up into large absolute errors. A 20 percent over-count in a 50-50 Republican-Democrat split shifts the result by 10 percentage points, while the same 20 percent error on a group that is truly 10 percent of the population shifts it by only about 2 points. Since the standard error is measured in absolute terms, the formula correctly makes it largest at $p = .5$.</p>" },
      { body: "<h3 class=\"book-concept\">What makes a poll go wrong</h3><p class=\"book-lead\">Bad polls come from bad samples and bad questions, not bad arithmetic.</p><h4 class=\"book-sub\">Garbage in, garbage out</h4><p>A properly conducted poll of about 1,000 people can describe a whole country, as Gallup's Frank Newport notes. But bad polling rarely comes from miscalculating the standard error. It comes from a biased sample, bad questions, or both. Wheelan lists the key methodological questions to ask of any poll.</p><h4 class=\"book-sub\">Is this an accurate sample of the population?</h4><p>Watch for selection bias, especially self-selection. A radio call-in show or a voluntary internet survey captures only people motivated enough to respond, who tend to feel strongly or have free time, and are not representative. The author recalls a caller who pulled his car off the highway to find a pay phone and register his dissent.</p><h4 class=\"book-sub\">Does the method systematically exclude anyone?</h4><p>Any method that systematically leaves out part of the population invites bias. Professional pollsters work hard to avoid this. The New York Times / CBS poll used telephone interviews of 1,650 adults, sampling from the roughly 69,000 residential phone exchanges so each region appeared in proportion to its share, adding random digits to reach both listed and unlisted numbers, and including random dialing of cell phones.</p><h4 class=\"book-sub\">Nonresponse bias and the response rate</h4><p>The response rate (the share of contacted people who actually complete the poll) is a validity indicator. A low response rate is a warning sign: the people who opt out or cannot be reached may differ in some material way. Interviewers therefore make repeated calls, as many as ten or twelve to one number, rather than just dialing fresh numbers until enough people pick up, since the easy-to-reach are skewed toward the unemployed and the elderly. Pollsters test for nonresponse bias by examining who they could not contact.</p><h4 class=\"book-sub\">Are the questions worded fairly?</h4><p>Survey results can be very sensitive to wording. The chapter's headline example: a solid majority of Americans support the death penalty (over 60 percent every year since 2002, ranging from a high of 70 percent in 2003 to a low of 64 percent). But a 2006 Gallup poll found only 47 percent chose the death penalty when life imprisonment without parole was offered as an alternative, against 48 percent who preferred imprisonment. Phrasing also colors answers: people favor \"tax relief\" over \"tax cuts,\" and worry more about \"global warming\" than \"climate change,\" though each pair describes the same thing.</p><table class=\"extable\"><thead><tr><th>death-penalty question</th><th class=\"num\">support</th></tr></thead><tbody><tr><td class=\"row-h\">favor for convicted murder (Gallup, since 2002)</td><td class=\"num\">over 60%</td></tr><tr><td class=\"row-h\">high point, 2003</td><td class=\"num\">70%</td></tr><tr><td class=\"row-h\">low point</td><td class=\"num\">64%</td></tr><tr><td class=\"row-h\">vs life without parole (2006)</td><td class=\"num\">47%</td></tr></tbody></table><h4 class=\"book-sub\">Are respondents telling the truth?</h4><p>Even a careful poll relies on honest answers, and people shade the truth on sensitive topics, overstating income or whether they vote. The challenging NORC \"Sex Study\" used ninety-minute interviews of 3,342 representative adults, with nearly 80 percent completing the survey, to coax accurate answers on a delicate subject.</p><h4 class=\"book-sub\">Likely-voter screens</h4><p>Election polls must separate people who will actually vote from those who will not, since only voters matter for predicting a winner. People over-report voting: studies comparing self-reports with records find one-quarter to one-third of respondents claim to have voted when they did not. To reduce this bias, pollsters ask whether someone voted in past elections, since consistent past voters are the most likely future voters.</p>" }
    ],
    takeaways: [
      "A poll infers a population's opinions from a sample's opinions.",
      "Polling estimates a proportion (a percentage), not a mean.",
      "Margin of error is a 95 percent confidence interval in polling language.",
      "SE of a proportion = square root of p times (1 minus p) divided by n.",
      "Bigger n means smaller standard error, because n is in the denominator.",
      "More confidence with the same data forces a wider margin of error.",
      "p(1 - p) is largest at p = .5, giving the biggest standard error.",
      "Bad polls stem from biased samples or loaded questions, not bad math."
    ]
  });
  window.CODEVIZ["naked-ch10"] = {
    charts: [
      {
        "type": "line",
        "title": "Standard error of a proportion vs sample size (p = .5)",
        "interpret": "SE drops sharply as n grows, then flattens — quadrupling n roughly halves SE.",
        "xlabel": "sample size n",
        "ylabel": "standard error",
        "series": [
          {
            "name": "SE = sqrt(.25 / n)",
            "color": "#4ea1ff",
            "points": [
              [
                100,
                0.05
              ],
              [
                250,
                0.0316
              ],
              [
                500,
                0.0224
              ],
              [
                1000,
                0.0158
              ],
              [
                1650,
                0.0123
              ],
              [
                2000,
                0.0112
              ],
              [
                3000,
                0.0091
              ],
              [
                4000,
                0.0079
              ]
            ]
          }
        ]
      },
      {
        "type": "bars",
        "title": "p (1 - p) peaks at p = .5",
        "interpret": "The variance term is largest at a 50-50 split, which is why pollsters assume p = .5.",
        "labels": [
          ".05",
          ".09",
          ".46",
          ".50",
          ".91"
        ],
        "values": [
          0.0475,
          0.0819,
          0.2484,
          0.25,
          0.0819
        ]
      }
    ]
  };
})();
