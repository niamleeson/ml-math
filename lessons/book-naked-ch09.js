/* "Naked Statistics" (Charles Wheelan) — Chapter 9: Inference
   One consolidated lesson covering every concept in the chapter. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch9",
    chapter: "Chapter 9",
    title: "Inference",
    tagline: "Hypothesis testing: how we decide whether a result is real or just chance.",
    sections: [
      { body: "<h3 class=\"book-concept\">Inference finds the most likely explanation</h3><p class=\"book-lead\">Statistics cannot prove anything with certainty; it tells us what is likely and what is unlikely.</p><h4 class=\"book-sub\">What inference does</h4><p>Wheelan opens with his own story: he scored far better on the final than the midterm, and his statistics professor suspected him of cheating. Across many courses there really is a strong correlation between midterm and final scores, so a student who is below average on one and near the top on the other is an unusual pattern. The professor saw an unlikely pattern and looked for an explanation.</p><p>That anecdote is the heart of inference. Statistics cannot <em>prove</em> anything with certainty. Its power comes from spotting a pattern in data and then using probability to decide on the <strong>most likely explanation</strong> for it.</p><h4 class=\"book-sub\">The strange gambler</h4><p>A gambler offers a wager: he pays you \\$1,000 if he rolls a six on a single die, and you win \\$500 if he rolls anything else — a bet that looks good for you. He then rolls ten sixes in a row and takes \\$10,000 from you.</p><ul class='steps'><li>One explanation: he got lucky.</li><li>Alternative explanation: he cheated.</li><li>The probability of ten sixes in a row with a fair die is roughly 1 in 60 million.</li></ul><p>You cannot <em>prove</em> he cheated, but the pattern is so improbable that the most likely explanation is foul play — you ought at least to inspect the die.</p><h4 class=\"book-sub\">The most likely explanation can still be wrong</h4><p>Wheelan warns that rare things do happen. Linda Cooper, a South Carolina woman, has been struck by lightning four times, even though the chance of being struck even once is about 1 in 600,000. Her insurer cannot deny coverage just because her injuries are statistically improbable. An unlikely pattern is just an unlikely pattern unless other evidence corroborates it.</p>" },
      { body: "<h3 class=\"book-concept\">Hypothesis testing</h3><p class=\"book-lead\">Accept or reject explanations based on how likely the observed data would be by chance.</p><h4 class=\"book-sub\">The core question</h4><p>Hypothesis testing is one of the most common tools of inference. Researchers start from an assumption and then ask: if that assumption were true, how likely is it that we would see this pattern of data purely by chance? If the data would be very unlikely under the assumption, we discard the assumption.</p><h4 class=\"book-sub\">The heart-disease drug</h4><p>Wheelan uses a clinical trial comparing a new heart-disease drug against a placebo. The comparison hinges on how big the gap is between the two groups.</p><table class='extable'><thead><tr><th>Scenario</th><th class='num'>Drug improved</th><th class='num'>Placebo improved</th><th>Conclusion</th></tr></thead><tbody><tr><td class='row-h'>Small gap</td><td class='num'>53 / 100</td><td class='num'>49 / 100</td><td>Easily explained by chance — do not conclude the drug works.</td></tr><tr><td class='row-h'>Large gap</td><td class='num'>91 / 100</td><td class='num'>49 / 100</td><td>Very unlikely by chance — likely the drug has a real effect.</td></tr></tbody></table><h4 class=\"book-sub\">The formal logic</h4><p>For the 91-vs-49 case, the reasoning runs in three steps:</p><ul class='steps'><li>If the drug had no effect, we would rarely see this much difference between the groups.</li><li>It is therefore highly improbable that the drug has no positive effect.</li><li>The more likely explanation is that the drug does have a positive effect.</li></ul><p>Inference is the marriage of two ideas already covered: data and probability, with help from the central limit theorem.</p>" },
      { body: "<h3 class=\"book-concept\">The null and alternative hypotheses</h3><p class=\"book-lead\">Inference begins with a null hypothesis; rejecting it forces us to accept its logical complement.</p><h4 class=\"book-sub\">Two complementary statements</h4><p>Every statistical inference begins with a <strong>null hypothesis</strong> — the starting assumption that will be rejected or not on the basis of analysis. If we reject the null, we accept an <strong>alternative hypothesis</strong> that fits the data better. The two are logical complements: if one is true the other is false, so rejecting one means accepting the other. In a courtroom the null is that the defendant is innocent; the prosecution's job is to make the jury reject it and accept the alternative, that the defendant is guilty.</p><h4 class=\"book-sub\">Malaria drug — reject the null</h4><p>Null: the new drug is no more effective than a placebo at preventing malaria. Alternative: the drug helps prevent malaria. When the treatment group has far fewer cases than the control group — an outcome that would be extremely unlikely if the drug did nothing — we reject the null and accept the alternative.</p><h4 class=\"book-sub\">Prisoner treatment — cannot reject</h4><p>Null: substance-abuse treatment for prisoners does not reduce their rearrest rate. Alternative: it makes them less likely to be rearrested. After five years both groups have similar rearrest rates, so the data give us no reason to discard the starting assumption.</p><p>Wheelan notes the counterintuitive twist: researchers often build a null hypothesis hoping to reject it. A research \"success\" — a working malaria drug or lower recidivism — means rejecting the null. Here that happened only for the malaria drug.</p>" },
      { body: "<h3 class=\"book-concept\">Reject versus cannot reject the null</h3><p class=\"book-lead\">Statistics defines \"beyond a reasonable doubt\" quantitatively.</p><h4 class=\"book-sub\">Beyond a reasonable doubt</h4><p>In a courtroom the threshold for rejecting the presumption of innocence is the qualitative judgment that guilt is established \"beyond a reasonable doubt,\" with the jury left to decide what that means. Statistics uses the same idea but defines it quantitatively, asking: if the null hypothesis is true, how likely is it that we would observe this data by chance? If that probability is extremely small, we reject the null and accept the alternative.</p><h4 class=\"book-sub\">The Atlanta cheating scandal</h4><p>Atlanta test results were flagged for an unusual number of \"wrong-to-right\" erasures. The null hypothesis: the scores are legitimate and any odd erasure patterns are just chance. But some classrooms had wrong-to-right erasures twenty to fifty standard deviations above the state norm — and most observations in a distribution fall within two standard deviations of the mean.</p><p>An official compared the odds of the pattern arising honestly to the chance of 70,000 people at the Georgia Dome all happening to be over seven feet tall. Officials could not <em>prove</em> cheating, but they could reject the null that the results were legitimate with a high degree of confidence, and accept the alternative that something was wrong. Later investigation uncovered the \"smoking erasers.\"</p>" },
      { body: "<h3 class=\"book-concept\">The significance level</h3><p class=\"book-lead\">The threshold for rejecting the null is set in advance — commonly .05, sometimes .01 or .1.</p><h4 class=\"book-sub\">How implausible is implausible enough</h4><p>How unlikely must the null be before we reject it? The most common threshold is 5 percent, written .05. This is the <strong>significance level</strong>: the upper bound on the probability of seeing a pattern of data at least as extreme as observed if the null were true. We reject at the .05 level when there is less than a 5 percent chance of such an outcome under the null.</p><h4 class=\"book-sub\">Other common levels</h4><p>The .05 level is admittedly arbitrary; there is no single standard. Rejecting at .01 carries more weight than rejecting at .1.</p><table class='extable'><thead><tr><th>Level</th><th class='num'>Chance under null</th><th>Statistical heft</th></tr></thead><tbody><tr><td class='row-h'>.1</td><td class='num'>1 in 10</td><td>Lowest</td></tr><tr><td class='row-h'>.05</td><td class='num'>1 in 20</td><td>Common</td></tr><tr><td class='row-h'>.01</td><td class='num'>1 in 100</td><td>Higher</td></tr></tbody></table><h4 class=\"book-sub\">Set it before the analysis</h4><p>Wheelan stresses that the threshold should be established <em>before</em> the analysis is run. Otherwise a researcher could pick a convenient cutoff after the fact to make results look significant. When the null can be rejected at a reasonable, pre-set level, the results are called \"statistically significant.\"</p>" },
      { body: "<h3 class=\"book-concept\">Significance versus size of effect</h3><p class=\"book-lead\">Statistical significance says the effect is probably real — not that it is large.</p><h4 class=\"book-sub\">What significance does and does not say</h4><p>Statistical significance says nothing about the <em>size</em> of an association. A finding only means the observed effect, however tiny, is unlikely to be a coincidence. \"No statistically significant association\" means any relationship can reasonably be explained by chance alone.</p><h4 class=\"book-sub\">Bran muffins</h4><p>Suppose data show people who eat twenty bran muffins a day have a lower incidence of colon cancer, and the gap is statistically significant. Significance tells us the gap is probably not a coincidence — but the difference could still be trivial in size. (It is also only a correlation, not proof of cause; heavy bran-muffin eaters may also exercise, eat less red meat, and get screened — the \"healthy user bias.\")</p><h4 class=\"book-sub\">Banana before the SAT</h4><p>Imagine a well-designed study finds a statistically significant positive link between eating a banana before the SAT and a higher math score. The first question to ask is: how big is the effect? It could be just .9 points. On a test with a mean score of 500, that is not a life-changing figure — significant, but trivially small.</p>" },
      { body: "<h3 class=\"book-concept\">The p-value</h3><p class=\"book-lead\">The probability of a result at least as extreme as observed, if the null is true.</p><h4 class=\"book-sub\">The hijacked-bus mission</h4><p>Wheelan's action-movie example: each Changing Lives study bus carries about 60 passengers, treated as a random sample. The population mean weight is 162 pounds with standard deviation 36, so the standard error of the sample mean is:</p><ul class='steps'><li>$SE = s/\\sqrt{n} = 36/\\sqrt{60}$</li><li>$\\sqrt{60} \\approx 7.75$</li><li>$SE = 36/7.75 \\approx 4.6$ pounds</li></ul><p>About 95 percent of 60-person samples should have a mean weight within two standard errors of 162 — roughly 153 to 171 pounds. Outside that range, you reject the null that the bus holds Changing Lives participants (a two-tailed test).</p><h4 class=\"book-sub\">Sampling distribution of the mean</h4><p>The book scans this distribution onto your retina. Marks sit at the population mean and at one and two standard errors on each side.</p><h4 class=\"book-sub\">Computing the p-value</h4><p>You weigh the passengers: the mean is 136 pounds, far below 153. Mission control asks for a p-value — the probability of a result at least as extreme as observed if the null is true.</p><ul class='steps'><li>Distance from the mean: $162 - 136 = 26$ pounds.</li><li>In standard errors: $26 / 4.6 \\approx 5.7\\,SE$ below the mean.</li><li>The probability of a result that extreme under the null is less than .0001, reported as $p\\lt.0001$.</li></ul><p>You reject the null: this is not a busful of Changing Lives participants (they turn out to be children at a hockey camp).</p>" },
      { body: "<h3 class=\"book-concept\">The confidence interval</h3><p class=\"book-lead\">Sample mean ± two standard errors contains the population mean about 95 times in 100.</p><h4 class=\"book-sub\">Building the interval</h4><p>The autism study compares total brain volume in children with and without autism spectrum disorder. The central limit theorem says that for about 95 samples out of 100 the sample mean lies within two standard errors of the true population mean. A <strong>confidence interval</strong> is the sample mean plus or minus two standard errors.</p><h4 class=\"book-sub\">Autism group</h4><ul class='steps'><li>Sample mean brain volume: 1310.4 cubic centimeters.</li><li>Standard error: 13; two standard errors = 26.</li><li>Interval: $1310.4 \\pm 26$, i.e. 1284.4 to 1336.4 cubic centimeters.</li></ul><p>We can say with 95 percent confidence this range contains the average brain volume for all children with autism spectrum disorder.</p><h4 class=\"book-sub\">Control group and the key clue</h4><ul class='steps'><li>Sample mean: 1238.8 cubic centimeters.</li><li>Standard error: 18; two standard errors = 36.</li><li>Interval: $1238.8 \\pm 36$, i.e. 1202.8 to 1274.8 cubic centimeters.</li></ul><p>The two intervals do not overlap: the lower bound for the autism group (1284.4) is still above the upper bound for the control group (1274.8). That non-overlap is the first clue of a real anatomical difference.</p><h4 class=\"book-sub\">The two intervals side by side</h4><table class='extable'><thead><tr><th>Group</th><th class='num'>Mean</th><th class='num'>2 SE</th><th class='num'>Lower</th><th class='num'>Upper</th></tr></thead><tbody><tr><td class='row-h'>Non-autism</td><td class='num'>1238.8</td><td class='num'>36</td><td class='num'>1202.8</td><td class='num'>1274.8</td></tr><tr><td class='row-h'>Autism</td><td class='num'>1310.4</td><td class='num'>26</td><td class='num'>1284.4</td><td class='num'>1336.4</td></tr></tbody></table>" },
      { body: "<h3 class=\"book-concept\">Type I and Type II errors</h3><p class=\"book-lead\">False positives and false negatives trade off against each other — there is no free lunch.</p><h4 class=\"book-sub\">Two ways to be wrong</h4><p>Inference rests on probability, not certainty, so hypothesis tests can err in two ways. A <strong>Type I error</strong> wrongly rejects a true null hypothesis — a <em>false positive</em>. A <strong>Type II error</strong> fails to reject a null that should be rejected — a <em>false negative</em>. Wheelan reconciles the jargon with a medical test: the null is that you are healthy; rejecting it means testing positive, and a false positive is a Type I error.</p><h4 class=\"book-sub\">The ESP study and the trade-off</h4><p>A Cornell researcher rejected the null \"ESP does not exist\" at the .05 level after participants picked a curtain hiding an erotic photo 53 percent of the time (chance says 50). Critics argued a single significant result can easily be chance. A stricter level like .001 cuts false positives, but choosing a level always involves a trade-off:</p><table class='extable'><thead><tr><th>If the threshold is...</th><th>Effect</th></tr></thead><tbody><tr><td class='row-h'>Too low (e.g. .1)</td><td>More Type I errors — reject true nulls (1 in 10 \"guilty\" defendants actually innocent).</td></tr><tr><td class='row-h'>Too high (e.g. .001)</td><td>More Type II errors — fail to reject false nulls (effective drugs not approved).</td></tr></tbody></table><h4 class=\"book-sub\">Which error is worse depends on context</h4><ul class='steps'><li>Spam filters: null = the e-mail is not spam. Missing a real message is costly, so most people tolerate Type II errors (some spam gets through).</li><li>Cancer screening: historically a false positive (Type I) was preferred to missing a diagnosis (Type II), though high costs of false positives now challenge that.</li><li>Capturing terrorists: neither error is acceptable, which fuels ongoing debate over the balance.</li></ul><p>The key point: recognize the trade-off; there is no statistical \"free lunch.\"</p>" },
      { body: "<h3 class=\"book-concept\">Standard error of a difference of means</h3><p class=\"book-lead\">Compare two means by scaling their difference against the standard error of that difference.</p><h4 class=\"book-sub\">The intuition</h4><p>From the chapter appendix. If two large samples come from the same population, our best guess is that their means are identical. Pull 100 NBA players and you expect another sample of 100 to average close to the same height; a gap of an inch or two is plausible, but a gap of 6 or 8 inches is unlikely. We can compute a standard error for the difference between two sample means, which measures how much that difference tends to vary by chance.</p><h4 class=\"book-sub\">Why the difference is normal</h4><ul class='steps'><li>If two samples are from the same population, the best guess for the difference in their means is zero.</li><li>The central limit theorem says that across repeated samples the difference between the two means is distributed roughly normally.</li><li>So about 68% of the time the difference is within one SE of zero, 95% within two SE, and 99.7% within three SE.</li></ul><h4 class=\"book-sub\">The formula</h4><p>Compare two means by dividing the observed difference by the standard error of the difference:</p><p>$$\\frac{\\bar{x} - \\bar{y}}{\\sqrt{\\dfrac{s_x^2}{n_x} + \\dfrac{s_y^2}{n_y}}}$$</p><p>The numerator is the size of the difference in means; the denominator is the standard error of that difference. Here $\\bar{x}, \\bar{y}$ are the two sample means, $s_x, s_y$ the standard deviations, and $n_x, n_y$ the sample sizes.</p><h4 class=\"book-sub\">The autism numbers</h4><ul class='steps'><li>Difference in mean brain volume: $1310.4 - 1238.8 = 71.6$ cubic centimeters.</li><li>Standard error of the difference: 22.7.</li><li>Ratio: $71.6 / 22.7 \\approx 3.15$ standard errors.</li><li>A difference of 3.15 SE or larger arises only about 2 times in 1,000 if the samples come from the same population — a p-value of .002, matching the published paper.</li></ul><h4 class=\"book-sub\">One-tailed versus two-tailed</h4><p>The appendix also distinguishes one- and two-tailed tests, set by the alternative hypothesis.</p><table class='extable'><thead><tr><th>Test</th><th>Alternative hypothesis</th><th class='num'>.05 cutoff</th></tr></thead><tbody><tr><td class='row-h'>Two-tailed</td><td>The means differ in either direction (e.g. bus passengers heavier or lighter than the study mean).</td><td class='num'>1.96 SE</td></tr><tr><td class='row-h'>One-tailed</td><td>The means differ in one known direction (e.g. NBA players can only be taller, not shorter).</td><td class='num'>1.64 SE</td></tr></tbody></table><p>With background knowledge ruling out one direction, the whole 5 percent sits in a single tail, so the cutoff is smaller (1.64 SE) than the two-tailed cutoff (1.96 SE).</p>" }
    ],
    takeaways: [
      "Inference uses data plus probability to find the most likely explanation.",
      "Ask: how likely is this data by chance if the starting assumption holds?",
      "The null is the starting assumption you test against.",
      "\"Cannot reject\" means the data give no reason to abandon the null — not that the null is proven.",
      "The significance level caps the probability of the data under the null.",
      "Significant = unlikely to be chance, not necessarily large.",
      "p-value = chance of data this extreme (or more) if the null holds.",
      "Confidence interval = sample mean ± 2 SE, covering the true mean ~95% of the time.",
      "Type I = false positive (reject a true null); Type II = false negative (fail to reject a false null).",
      "Test two means with (x̄ − ȳ) divided by the SE of the difference."
    ]
  });
  window.CODEVIZ["naked-ch9"] = {
    charts: [
      {
        "type": "bars",
        "title": "Distribution of Sample Means (162, SE ≈ 4.6)",
        "interpret": "About 95% of 60-person samples fall within ±2 SE (153 to 171 lb); a sample mean of 136 lb is far out in the tail, so the null is rejected.",
        "labels": [
          "-2 SE",
          "-1 SE",
          "162",
          "+1 SE",
          "+2 SE"
        ],
        "values": [
          152.8,
          157.4,
          162,
          166.6,
          171.2
        ],
        "valueLabels": [
          "152.8",
          "157.4",
          "162",
          "166.6",
          "171.2"
        ]
      },
      {
        "type": "scatter",
        "title": "95% Confidence Intervals for Mean Brain Volume",
        "interpret": "The intervals do not overlap: the autism lower bound (1284.4) sits above the non-autism upper bound (1274.8), the first clue of a real anatomical difference.",
        "xlabel": "Brain volume (cubic centimeters)",
        "groups": [
          {
            "name": "Non-autism",
            "color": "#4ea1ff",
            "points": [
              [
                1238.8,
                1
              ]
            ]
          },
          {
            "name": "Autism",
            "color": "#ffb454",
            "points": [
              [
                1310.4,
                2
              ]
            ]
          }
        ],
        "lines": [
          {
            "color": "#4ea1ff",
            "points": [
              [
                1202.8,
                1
              ],
              [
                1274.8,
                1
              ]
            ]
          },
          {
            "color": "#ffb454",
            "points": [
              [
                1284.4,
                2
              ],
              [
                1336.4,
                2
              ]
            ]
          }
        ]
      },
      {
        "type": "bars",
        "title": "Difference in Sample Means — autism vs control",
        "interpret": "The observed difference of 71.6 cm³ is 3.15 standard errors from zero; a gap this large (or larger) occurs only ~2 in 1,000 if the samples share one population, so p ≈ .002.",
        "labels": [
          "0 SE",
          "1 SE",
          "2 SE",
          "3 SE",
          "3.15 SE (observed)"
        ],
        "values": [
          0,
          22.7,
          45.4,
          68.1,
          71.6
        ],
        "valueLabels": [
          "0",
          "22.7",
          "45.4",
          "68.1",
          "71.6"
        ],
        "colors": [
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#4ea1ff",
          "#ffb454"
        ]
      }
    ]
  };
})();
