/* Practical Statistics for Data Scientists (Bruce & Bruce, O'Reilly 2017)
   Chapter 3 — Statistical Experiments and Significance Testing.
   Self-registering book-template lessons, one per named concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Practical Statistics";
  const BOOK = "Practical Statistics for Data Scientists";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // ---------------------------------------------------------------- A/B Testing
  B({
    id: "ps-ch3-ab-testing",
    chapter: "Chapter 3",
    title: "A/B Testing",
    tagline: "An experiment with two groups to learn which of two treatments is better.",
    sections: [
      { h: "What it is", body:
        "<p>An A/B test runs an experiment with two groups to find out which of two treatments, products, " +
        "procedures, or the like is superior. Often one group gets the standard existing treatment (or no " +
        "treatment); that group is the <em>control</em>. The typical hypothesis is that the new treatment beats " +
        "the control.</p>" +
        "<p>The book's key terms: a <strong>treatment</strong> is the thing a subject is exposed to (a drug, a " +
        "price, a web headline); the <strong>treatment group</strong> gets a specific treatment and the " +
        "<strong>control group</strong> gets no (or standard) treatment; <strong>randomization</strong> is " +
        "assigning subjects to treatments at random; <strong>subjects</strong> are the items exposed (web " +
        "visitors, patients); the <strong>test statistic</strong> is the metric used to measure the effect.</p>" },
      { h: "Why randomize and why a control", body:
        "<p>With proper randomization any difference between the groups can come from only two sources: a real " +
        "effect of the treatments, or the luck of the draw in who landed in which group. A control group matters " +
        "because comparing the treatment to mere &quot;baseline&quot; or prior experience leaves other factors " +
        "free to differ — the control is held under the same conditions except for the treatment itself.</p>" +
        "<p>You must pick the single test statistic <em>before</em> the experiment. Choosing it afterward, once " +
        "you have seen the data, opens the door to researcher bias.</p>" },
      { h: "Examples and a worked 2x2 table", body:
        "<p>A/B testing fits web design and marketing because results are easy to measure: two soil treatments " +
        "for seed germination, two cancer therapies, two prices for net profit, two web headlines for clicks, " +
        "two web ads for conversions. The most common metric is a binary outcome (click / no-click, buy / " +
        "no-buy), summarized in a 2&times;2 table. The book's actual price test:</p>" +
        "<table class=\"extable\"><thead><tr><th>Outcome</th><th>Price A</th><th>Price B</th></tr></thead>" +
        "<tbody><tr><td class=\"row-h\">Conversion</td><td class=\"num\">200</td><td class=\"num\">182</td></tr>" +
        "<tr><td class=\"row-h\">No conversion</td><td class=\"num\">23,539</td><td class=\"num\">22,406</td></tr></tbody></table>" +
        "<p>If instead the metric were continuous — say revenue per page view — software might report " +
        "<em>price A: mean = 3.87, SD = 51.10</em> and <em>price B: mean = 4.11, SD = 62.98</em>. The book warns " +
        "this output is misleading: the data is a few high values (page views with a conversion) plus a flood of " +
        "zeros, so a standard deviation that suggests large negative revenue is unhelpful. The mean absolute " +
        "deviation (7.68 for A, 8.15 for B) describes the spread more reasonably.</p>" +
        "<pre><code class=\"language-python\"># Book numbers for the ecommerce price test\n# --- R (Practical Statistics, 1st ed.; arithmetic shown from Table 3-1) ---\n# conv &lt;- c(A=200, B=182); n &lt;- c(A=23739, B=22588)\n# conv / n                         # A 0.008424955, B 0.008057376\n# 100 * (conv['A']/n['A'] - conv['B']/n['B'])  # 0.0367579 percentage points\n# c(mean_A=3.87, sd_A=51.10, mad_A=7.68, mean_B=4.11, sd_B=62.98, mad_B=8.15)\n\n# --- Python equivalent ---\nconv = {'A': 200, 'B': 182}\nn = {'A': 23739, 'B': 22588}\nrates = {k: conv[k] / n[k] for k in conv}\nprint(rates)                       # {'A': 0.008424955, 'B': 0.008057376}\nprint(100 * (rates['A'] - rates['B']))  # 0.0367579 percentage points</code></pre>" },
      { h: "Why just A/B?", body:
        "<p>A/B is not the only design — more treatments can be added, and pharmaceutical trials sometimes build " +
        "in multiple chances to stop early. Traditional designs answer a static question (&quot;is A vs B " +
        "significant?&quot;). Data scientists more often care about &quot;which of many options is best?&quot;, " +
        "for which a newer design — the multi-arm bandit — is used.</p>" }
    ],
    takeaways: [
      "Two (or more) groups treated identically except for the treatment under study.",
      "Randomize subjects to groups so any difference is due to treatment or chance only.",
      "Fix a single test statistic in advance to avoid researcher bias.",
      "A control group keeps &quot;other things equal.&quot;"
    ]
  });

  // -------------------------------------------------------- Hypothesis Tests
  B({
    id: "ps-ch3-hypothesis-tests",
    chapter: "Chapter 3",
    title: "Hypothesis Tests",
    tagline: "Tools to learn whether random chance could be behind an observed effect.",
    sections: [
      { h: "Purpose", body:
        "<p>Hypothesis tests (also called significance tests) are everywhere in published research. Their job is " +
        "to help you judge whether random chance might be responsible for an observed effect. They exist because " +
        "the human mind underestimates how wild pure randomness can be: we fail to anticipate extreme &quot;black " +
        "swan&quot; events, and we read meaningful patterns into noise.</p>" +
        "<p>The book's coin-flip demonstration: ask friends to invent a fake series of 50 coin flips, then to flip " +
        "a real coin 50 times. The real sequence is easy to spot — it has longer runs (five or six heads in a row " +
        "is not unusual in 50 real flips), while invented sequences switch too soon because three or four in a row " +
        "&quot;feels&quot; non-random. The flip side: when a real headline beats another by 10%, we are tempted to " +
        "call it real rather than chance.</p>" },
      { h: "Null hypothesis", body:
        "<p>The <strong>null hypothesis</strong> is the baseline assumption that the treatments are equivalent and " +
        "any difference between groups is due to chance — in short, &quot;chance is to blame.&quot; The logic of a " +
        "test: because people over-read random behavior, we demand proof that the observed difference is more " +
        "extreme than chance could reasonably produce. Our hope is to prove the null <em>wrong</em>. One way to do " +
        "this is a resampling permutation procedure: shuffle the results of A and B together, repeatedly deal them " +
        "back into similar-sized groups, and see how often a difference as extreme as the observed one appears.</p>" },
      { h: "Alternative hypothesis", body:
        "<p>Every test also has an <strong>alternative hypothesis</strong> — the counterpoint to the null, the " +
        "thing you hope to prove. Together null and alternative must cover all possibilities. The book's examples:</p>" +
        "<ul class=\"steps\">" +
        "<li>Null = &quot;no difference between the means of A and B,&quot; alternative = &quot;A differs from B&quot; (bigger or smaller).</li>" +
        "<li>Null = &quot;A $\\le$ B,&quot; alternative = &quot;B $\\gt$ A.&quot;</li>" +
        "<li>Null = &quot;B is not X% greater than A,&quot; alternative = &quot;B is X% greater than A.&quot;</li>" +
        "</ul>" },
      { h: "One-way and two-way tests", body:
        "<p>When you test a new option B against an established default A and will keep A unless B proves itself " +
        "definitively better, you only care about being fooled by chance in B's favor. You then use a directional " +
        "alternative (B better than A) and a <strong>one-way</strong> (one-tail) test: extreme chance results in " +
        "only one direction count toward the p-value.</p>" +
        "<p>If you want protection against being fooled in <em>either</em> direction, the alternative is " +
        "bidirectional (A differs from B) and you use a <strong>two-way</strong> (two-tail) test: extreme chance " +
        "results in both directions count. A one-tail test often matches A/B decision-making, but software " +
        "(including R) usually defaults to two-tail, and many statisticians prefer it to avoid argument. The book " +
        "notes the distinction is not that important for data science, where p-value precision rarely matters.</p>" +
        "<pre><code class=\"language-python\"># Coin-flip demonstration of random runs (book: 50 flips; runs of 5 or 6 are not unusual)\n# --- R ---\n# flips &lt;- sample(c('H','T'), 50, replace=TRUE)\n# rle(flips)$lengths\n# max(rle(flips)$lengths)           # often 5 or 6 in a real random series\n\n# --- Python equivalent ---\nimport random, itertools\nflips = [random.choice(['H', 'T']) for _ in range(50)]\nruns = [len(list(g)) for _, g in itertools.groupby(flips)]\nprint(max(runs))                   # real random flips commonly produce long runs</code></pre>" }
    ],
    takeaways: [
      "A null hypothesis says nothing special happened — any effect is just chance.",
      "The test assumes the null is true, builds a probability &quot;null model,&quot; and asks if your effect is a reasonable outcome.",
      "One-tail counts extremes in one direction; two-tail counts both."
    ]
  });

  // ------------------------------------------------------------- Resampling
  B({
    id: "ps-ch3-resampling",
    chapter: "Chapter 3",
    title: "Resampling",
    tagline: "Repeatedly resample observed data to gauge a statistic's chance variability.",
    sections: [
      { h: "What resampling is", body:
        "<p>Resampling means repeatedly drawing samples from observed data to assess random variability in a " +
        "statistic. There are two main kinds: the <strong>bootstrap</strong> (assesses the reliability of an " +
        "estimate, covered in the previous chapter) and <strong>permutation tests</strong> (test hypotheses, " +
        "usually involving two or more groups). This lesson covers permutation. <em>With or without " +
        "replacement</em> refers to whether a drawn item is returned to the pool before the next draw.</p>" },
      { h: "The permutation test procedure", body:
        "<p>To <em>permute</em> means to change the order of a set of values. Combining the groups and reshuffling " +
        "is the logical embodiment of the null hypothesis that the treatments do not differ. The book's procedure:</p>" +
        "<ul class=\"steps\">" +
        "<li>Combine the results from the different groups into a single data set.</li>" +
        "<li>Shuffle the combined data; draw (without replacing) a resample the same size as group A.</li>" +
        "<li>From the rest, draw (without replacing) a resample the same size as group B.</li>" +
        "<li>Do the same for groups C, D, and so on.</li>" +
        "<li>Compute the same statistic as for the originals (e.g., difference in proportions); record it. This is one permutation iteration.</li>" +
        "<li>Repeat $R$ times to build a permutation distribution of the test statistic.</li>" +
        "</ul>" +
        "<p>Then compare the observed difference to the permuted ones. If the observed value sits well inside the " +
        "permuted set, you have proven nothing — it is within chance range. If it lies outside most of the " +
        "distribution, chance is <em>not</em> responsible: the difference is statistically significant.</p>" },
      { h: "Example: web stickiness", body:
        "<p>A company selling a high-value service wants to know which of two web presentations sells better. " +
        "Sales are too infrequent to measure directly, so it uses a <em>proxy</em> variable: average session time " +
        "on the detailed interior page (a page that holds attention longer should lead to more sales). After " +
        "removing the zeros Google Analytics records for final sessions, there are 36 sessions total — 21 for " +
        "page A and 15 for page B.</p>" +
        "<p>The difference in mean session times is:</p>" +
        "<ul class=\"steps\">" +
        "<li>mean_a = average Time for Page A; mean_b = average Time for Page B.</li>" +
        "<li>mean_b $-$ mean_a $= 21.4$ — page B sessions run, on average, 21.4 seconds longer than page A.</li>" +
        "</ul>" +
        "<p>Is 21.4 within chance range? Combine all 36 times, then repeatedly shuffle and split into groups of 21 " +
        "and 15, recording the difference of means each time. Doing this $R = 1{,}000$ times yields a permutation " +
        "distribution. The histogram (Figure 3-4) shows the vertical line at the observed 21.4 sitting well inside " +
        "the cloud of permuted differences — so the difference is within the range of chance variation and is " +
        "<em>not</em> statistically significant.</p>" },
      { h: "Exhaustive and bootstrap permutation tests", body:
        "<p>The random shuffling above is a <em>random permutation test</em> (or randomization test). Two variants:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Exhaustive permutation test</strong>: instead of random shuffles, enumerate every possible " +
        "way the data could be divided. Practical only for small samples. These are also called <em>exact tests</em> " +
        "because they guarantee the null model will not test &quot;significant&quot; more than the alpha level. With " +
        "many random shuffles, the random test approaches the exhaustive one in the limit.</li>" +
        "<li><strong>Bootstrap permutation test</strong>: the draws in steps 2 and 3 are made <em>with</em> " +
        "replacement instead of without. This models both the random assignment of treatment to subject and the " +
        "random selection of subjects from a population. The book says the distinction between the two is " +
        "convoluted and of no consequence in data science practice.</li>" +
        "</ul>" +
        "<p>Bottom line: permutation tests are easy to code and explain, sidestep the &quot;false determinism&quot; " +
        "of formulas, and come close to a one-size-fits-all approach — data can be numeric or binary, sample sizes " +
        "equal or not, with no need for a normality assumption.</p>" }
    ],
    takeaways: [
      "Combine multiple samples, shuffle, then split into resamples and compute the statistic of interest.",
      "Repeat to build a distribution, then compare the observed value to it.",
      "Bootstrap = reliability of an estimate; permutation = hypothesis testing."
    ]
  });
  window.CODEVIZ["ps-ch3-resampling"] = { charts: [ {
    type: "bars",
    title: "Permutation distribution of session-time differences (reconstruction of Figure 3-4)",
    interpret: "The observed difference of 21.4 s (between the +0 and +50 bars) sits inside the bulk of permuted " +
      "differences, so it is well within chance variation — not significant. Bar heights are read from the book's histogram.",
    labels: ["-100", "-75", "-50", "-25", "0", "+25", "+50", "+75", "+100"],
    values: [2, 7, 32, 62, 161, 224, 258, 148, 80],
    colors: ["#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff","#4ea1ff"]
  } ],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# ggplot(session_times, aes(x=Page, y=Time)) + geom_boxplot()\n# mean_a <- mean(session_times[session_times['Page']=='Page A', 'Time'])\n# mean_b <- mean(session_times[session_times['Page']=='Page B', 'Time'])\n# mean_b - mean_a                  # [1] 21.4\n# perm_fun <- function(x, n1, n2) { n <- n1 + n2; idx_b <- sample(1:n, n2); idx_a <- setdiff(1:n, idx_b); mean(x[idx_b]) - mean(x[idx_a]) }\n# perm_diffs <- rep(0, 1000); for(i in 1:1000) perm_diffs[i] = perm_fun(session_times[,'Time'], 21, 15)\n# hist(perm_diffs); abline(v = mean_b - mean_a)  # Figure 3-4; permutation p about 0.124\n\n# --- Python equivalent ---\nimport numpy as np\n# times = session_times['Time'].to_numpy(); observed = 21.4\ndef perm_fun(x, n1=21, n2=15):\n    idx_b = np.random.choice(len(x), n2, replace=False)\n    mask = np.ones(len(x), dtype=bool); mask[idx_b] = False\n    return x[idx_b].mean() - x[mask].mean()\n# perm_diffs = np.array([perm_fun(times) for _ in range(1000)])\n# (perm_diffs > observed).mean()   # approximately 0.124"
  };

  // ------------------------------------------- Statistical Significance & P-Values
  B({
    id: "ps-ch3-significance-pvalues",
    chapter: "Chapter 3",
    title: "Statistical Significance and P-Values",
    tagline: "Measuring whether a result is more extreme than chance would produce.",
    sections: [
      { h: "Statistical significance", body:
        "<p>Statistical significance is how statisticians judge whether an experiment (or study of existing data) " +
        "gives a result more extreme than chance could produce. If a result is beyond the realm of chance " +
        "variation, it is said to be statistically significant.</p>" +
        "<p>The book reuses the price test (Table 3-2). Price A converts almost 5% better than B (0.8425% vs " +
        "0.8057%, a gap of 0.0368 percentage points). With over 45,000 records it is tempting to treat this as " +
        "&quot;big data&quot; needing no significance test, but conversions number only in the hundreds, so the test " +
        "still matters. Resampling under the null (the two prices share one conversion rate) asks: &quot;could chance " +
        "produce a difference as big as 0.0368 percentage points?&quot;</p>" +
        "<ul class=\"steps\">" +
        "<li>Build an urn with 382 ones (clicks) and 45,945 zeros (no clicks) — the shared rate 382/46,327 = 0.008246 = 0.8246%.</li>" +
        "<li>Shuffle; draw a resample of size 23,739 (price A's n) and count the 1s.</li>" +
        "<li>Record the 1s in the remaining 22,588 (price B's n).</li>" +
        "<li>Record the difference in proportion of 1s.</li>" +
        "<li>Repeat steps 2&ndash;4 (say 1,000 times).</li>" +
        "<li>How often was the difference $\\ge 0.0368$?</li>" +
        "</ul>" +
        "<p>The histogram (Figure 3-5) puts the observed difference well inside the chance variation.</p>" },
      { h: "P-value", body:
        "<p>Eyeballing a graph is imprecise, so the <strong>p-value</strong> is more useful: given a chance model " +
        "embodying the null, it is the frequency with which the model produces a result as extreme as (or more " +
        "extreme than) the observed result. Estimated from the permutation test as the proportion of permuted " +
        "differences at least as large as the observed one:</p>" +
        "<ul class=\"steps\">" +
        "<li>mean(perm_diffs $\\gt$ obs_pct_diff) = 0.308.</li>" +
        "<li>So we would expect a result this extreme, or more, by chance over 30% of the time.</li>" +
        "</ul>" +
        "<p>Here a permutation test was not even needed: with a binomial distribution the p-value can be " +
        "approximated by the normal distribution. R's <code>prop.test(x=c(200,182), n=c(23739,22588), " +
        "alternative=&quot;greater&quot;)</code> gives X-squared = 0.14893, df = 1, and p-value = 0.3498 — close to " +
        "the permutation p-value.</p>" },
      { h: "Alpha", body:
        "<p>Statisticians dislike leaving &quot;too unusual&quot; to the researcher's discretion. Instead an " +
        "<strong>alpha</strong> threshold is fixed in advance — the probability of &quot;unusualness&quot; that " +
        "chance results must surpass for an outcome to count as significant. Typical alpha levels are 5% and 1%. " +
        "The choice is arbitrary and guarantees nothing about being right x% of the time, because the question is " +
        "not &quot;what is the probability this happened by chance?&quot; but &quot;given a chance model, what is the " +
        "probability of a result this extreme?&quot;</p>" +
        "<p>What people <em>want</em> the p-value to mean is &quot;the probability that the result is due to " +
        "chance.&quot; What it <em>actually</em> means is &quot;the probability that, given a chance model, results " +
        "as extreme as observed could occur.&quot; The difference is subtle but real, which is why in 2016 the " +
        "American Statistical Association issued a cautionary statement of six principles — among them that " +
        "p-values do not measure the probability a hypothesis is true, and that conclusions should not rest on " +
        "whether a p-value clears a threshold.</p>" },
      { h: "Type 1 and Type 2 errors", body:
        "<p>Two errors are possible in assessing significance:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Type 1 error</strong>: mistakenly concluding an effect is real when it is really just chance.</li>" +
        "<li><strong>Type 2 error</strong>: mistakenly concluding an effect is due to chance when it really is real.</li>" +
        "</ul>" +
        "<p>The book notes a Type 2 error is less an error than a judgment that the sample was too small to detect " +
        "the effect — a larger sample might yield a smaller p-value. The basic job of significance tests is to " +
        "guard against being fooled by chance, so they are structured to minimize Type 1 errors. For a data " +
        "scientist a p-value is just one input among many — for instance, a feature might be kept or dropped from a " +
        "model depending on its p-value.</p>" }
    ],
    takeaways: [
      "Significance tests check whether an effect is within chance range for a null model.",
      "P-value: probability of results as extreme as observed, given the null model.",
      "Alpha: the threshold of &quot;unusualness&quot; in the null model.",
      "Type 1 = false positive; Type 2 = false negative (often just too-small a sample)."
    ]
  });
  window.CODEVIZ["ps-ch3-significance-pvalues"] = { charts: [ {
    type: "bars",
    title: "Permutation distribution of conversion-rate differences (reconstruction of Figure 3-5)",
    interpret: "The observed difference is only 0.0368 percentage points; in the book's permutation test, results at least this large occurred 30.8% of the time.",
    labels: ["-0.20:-0.15", "-0.15:-0.10", "-0.10:-0.05", "-0.05:0", "0:0.05", "0.05:0.10", "0.10:0.15", "0.15:0.20", "0.20:0.25"],
    values: [24, 98, 125, 265, 210, 138, 93, 32, 6],
    colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
  } ],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# obs_pct_diff <- 100*(200/23739 - 182/22588)    # 0.03675791 percentage points\n# conversion <- c(rep(0, 45945), rep(1, 382))    # shared null rate 382/46327 = 0.8246%\n# perm_diffs <- rep(0, 1000)\n# for(i in 1:1000) perm_diffs[i] = 100*perm_fun(conversion, 23739, 22588)\n# mean(perm_diffs > obs_pct_diff)                # [1] 0.308\n# prop.test(x=c(200,182), n=c(23739,22588), alternative=\"greater\")\n# # X-squared = 0.14893, df = 1, p-value = 0.3498; prop1=0.008424955, prop2=0.008057376\n\n# --- Python equivalent ---\nfrom statsmodels.stats.proportion import proportions_ztest\ncount = [200, 182]; nobs = [23739, 22588]\nprint(100 * (count[0]/nobs[0] - count[1]/nobs[1]))  # 0.03675791 percentage points\n# z, p = proportions_ztest(count, nobs, alternative='larger')\n# print(p)  # close to R's one-sided normal approximation, about 0.35"
  };

  // ----------------------------------------------------------------- t-Tests
  B({
    id: "ps-ch3-t-tests",
    chapter: "Chapter 3",
    title: "t-Tests",
    tagline: "A standardized significance test for comparing two group means.",
    sections: [
      { h: "What it is", body:
        "<p>There are many significance tests depending on whether data is counts or measurements, how many " +
        "samples there are, and what is measured. A very common one is the <strong>t-test</strong>, named for " +
        "Student's t-distribution, developed by W. S. Gossett to approximate the distribution of a single sample " +
        "mean. Key terms: the <strong>test statistic</strong> measures the effect of interest, the " +
        "<strong>t-statistic</strong> is a standardized version of it, and the <strong>t-distribution</strong> is " +
        "the reference distribution (from the null) the observed t-statistic is compared against.</p>" },
      { h: "Resampling vs the t-distribution", body:
        "<p>Every significance test needs a test statistic to measure the effect. In a resampling (permutation) " +
        "test the scale of the data does not matter — you build the reference distribution from the data itself " +
        "and use the statistic as is. But in the 1920s and 30s, shuffling data thousands of times was not " +
        "feasible. Statisticians found that Gossett's t-distribution was a good approximation to the permutation " +
        "distribution for the common two-sample (A/B) numeric comparison. For the t-distribution to apply " +
        "regardless of scale, a standardized form of the test statistic must be used.</p>" +
        "<p>The book omits the standardization formulas — all statistical software (R, Python) includes commands " +
        "that embody them.</p>" },
      { h: "Worked example: web stickiness", body:
        "<p>Applying R's <code>t.test(Time ~ Page, data=session_times, alternative='less')</code> to the page " +
        "session-time data gives a Welch Two Sample t-test:</p>" +
        "<ul class=\"steps\">" +
        "<li>t $= -1.0983$, df $= 27.693$, p-value $= 0.1408$.</li>" +
        "<li>Alternative: the true difference in means is less than 0 (mean of page A less than page B).</li>" +
        "<li>Sample estimates: mean of page A $= 126.33$, mean of page B $= 162.00$.</li>" +
        "</ul>" +
        "<pre><code class=\"language-python\"># --- R (Practical Statistics, 1st ed.) ---\n# t.test(Time ~ Page, data=session_times, alternative='less')\n# # Welch Two Sample t-test\n# # t = -1.0983, df = 27.693, p-value = 0.1408\n# # 95 percent confidence interval: -Inf 19.59674\n# # mean Page A = 126.3333; mean Page B = 162.0000\n\n# --- Python equivalent ---\nfrom scipy import stats\n# page_a = session_times.loc[session_times.Page == 'Page A', 'Time']\n# page_b = session_times.loc[session_times.Page == 'Page B', 'Time']\n# res = stats.ttest_ind(page_a, page_b, equal_var=False, alternative='less')\n# print(res.statistic, res.pvalue)  # -1.0983, 0.1408</code></pre>" +
        "<p>This p-value of 0.1408 is fairly close to the permutation-test p-value of 0.124 from the web " +
        "stickiness example — the two approaches agree.</p>" +
        "<p>The book's takeaway: in resampling mode you structure the solution to fit the observed data and the " +
        "hypothesis, not worrying about whether data is numeric or binary, balanced or not. In the formula world " +
        "the many variations can be bewildering; statisticians must learn its map, but data scientists generally " +
        "do not need to sweat those details.</p>" }
    ],
    takeaways: [
      "Before computers, resampling was impractical, so standard reference distributions were used.",
      "A test statistic can be standardized and compared to a reference distribution.",
      "The t-statistic is one widely used standardized statistic."
    ]
  });

  // ----------------------------------------------------------- Multiple Testing
  B({
    id: "ps-ch3-multiple-testing",
    chapter: "Chapter 3",
    title: "Multiple Testing",
    tagline: "Asking enough questions of the data almost guarantees a chance &quot;finding.&quot;",
    sections: [
      { h: "Torture the data and it will confess", body:
        "<p>A statistics saying: &quot;torture the data long enough, and it will confess.&quot; Look at data from " +
        "enough angles and ask enough questions, and you will almost always find something statistically " +
        "significant. Key terms: a <strong>Type 1 error</strong> is mistakenly calling an effect significant; the " +
        "<strong>false discovery rate</strong> is the rate of Type 1 errors across multiple tests; " +
        "<strong>adjustment of p-values</strong> accounts for doing multiple tests on the same data; and " +
        "<strong>overfitting</strong> is fitting the noise.</p>" },
      { h: "The worked example: 20 random predictors", body:
        "<p>Suppose you have 20 predictor variables and one outcome, all randomly generated, and you run 20 " +
        "significance tests at alpha = 0.05. The odds are good that at least one predictor falsely tests " +
        "significant — a Type 1 error. The book computes this:</p>" +
        "<ul class=\"steps\">" +
        "<li>Probability one predictor correctly tests non-significant = 0.95.</li>" +
        "<li>Probability all 20 correctly test non-significant = $0.95^{20} = 0.36$.</li>" +
        "<li>Probability at least one falsely tests significant = $1 - 0.36 = 0.64$.</li>" +
        "</ul>" +
        "<p>This is the overfitting problem of data mining — &quot;fitting the model to the noise.&quot; The more " +
        "variables or models you try, the higher the chance something emerges as &quot;significant&quot; by luck. In " +
        "supervised learning a holdout set (assessing the model on unseen data) mitigates the risk; without a " +
        "labeled holdout set the risk persists.</p>" },
      { h: "Adjustment procedures and their limits", body:
        "<p>Statistics offers procedures for specific structured cases. Comparing treatments A&ndash;C raises " +
        "multiple questions (A vs B? B vs C? A vs C?), each adding a chance of being fooled. Adjustment procedures " +
        "set the significance bar more stringently by &quot;dividing up the alpha&quot; by the number of tests, " +
        "giving a smaller alpha per test. One such, the <strong>Bonferroni adjustment</strong>, simply divides " +
        "alpha by the number of observations n.</p>" +
        "<p>But the broader multiplicity problem (data &quot;dredging&quot;) goes beyond these neat cases: multiple " +
        "pairwise comparisons, fishing through subgroups (&quot;no effect overall, but an effect for unmarried " +
        "women under 30&quot;), trying many models, including many variables, asking many questions. The book notes " +
        "the number of journal articles nearly doubled between 2002 and 2010, and that Bayer in 2011 could fully " +
        "replicate only 14 of 67 studies it tried.</p>" +
        "<p>The bottom line for data scientists: for predictive modeling, cross-validation and a holdout sample " +
        "guard against illusory models; for procedures without a labeled holdout set, rely on awareness that more " +
        "querying means more chance involvement, plus resampling and simulation to provide chance benchmarks.</p>" }
    ],
    takeaways: [
      "Multiplicity (many comparisons, variables, or models) raises the risk of a chance &quot;significant&quot; result.",
      "Structured statistical adjustments (e.g., Bonferroni) exist for specific cases.",
      "In data mining, a labeled holdout sample helps avoid misleading results."
    ]
  });
  window.CODEVIZ["ps-ch3-multiple-testing"] = { charts: [ {
    type: "bars",
    title: "Chance of at least one false &quot;significant&quot; result vs number of tests (illustrative, alpha=0.05)",
    interpret: "Computed as 1 - 0.95^k for k tests, the book's formula. At k=20 the chance reaches 0.64, " +
      "matching the worked example. Values are an illustrative reconstruction of the book's arithmetic.",
    labels: ["1", "5", "10", "20", "40"],
    values: [0.05, 0.23, 0.40, 0.64, 0.87]
  } ],
    code: "# Book's multiplicity arithmetic\n# --- R ---\n# 0.95^20                         # [1] 0.3584859  (all 20 nonsignificant)\n# 1 - 0.95^20                     # [1] 0.6415141  (at least one false significant)\n# p.adjust(p_values, method='bonferroni')  # divide alpha across multiple tests\n\n# --- Python equivalent ---\nalpha = 0.05\nfor k in [1, 5, 10, 20, 40]:\n    print(k, 1 - (1 - alpha)**k)\n# k=20 -> 0.641514, matching the book's 0.64"
  };

  // -------------------------------------------------------- Degrees of Freedom
  B({
    id: "ps-ch3-degrees-of-freedom",
    chapter: "Chapter 3",
    title: "Degrees of Freedom",
    tagline: "The number of values free to vary once constraints are known.",
    sections: [
      { h: "The idea", body:
        "<p>Degrees of freedom apply to statistics computed from sample data and refer to the number of values " +
        "free to vary. The book's example: if you know the mean of 10 values and also know 9 of them, the 10th is " +
        "fixed — only 9 are free to vary. Related terms: <strong>n or sample size</strong> is the number of " +
        "observations (rows, records) in the data, and <strong>d.f.</strong> is the abbreviation for degrees of " +
        "freedom.</p>" },
      { h: "Why it matters", body:
        "<p>Degrees of freedom is the name for the $n - 1$ denominator in variance and standard deviation " +
        "calculations. When you use a sample to estimate a population variance, dividing by $n$ biases the " +
        "estimate slightly downward; dividing by $n - 1$ removes that bias.</p>" +
        "<p>When sample statistics are standardized for traditional formulas (t-test, F-test, etc.), degrees of " +
        "freedom is part of the standardization that makes the standardized data match the right reference " +
        "distribution (t-distribution, F-distribution, etc.).</p>" },
      { h: "Relevance for data science", body:
        "<p>For significance testing, not very relevant: formal tests are used sparingly in data science, and data " +
        "is usually large enough that $n$ versus $n - 1$ rarely makes a real difference.</p>" +
        "<p>One context where it does matter: factored (categorical) variables in regression, including logistic " +
        "regression. Regression algorithms choke on exactly redundant predictors. The book's example: although " +
        "there are seven days of the week, day-of-week has only six degrees of freedom — once you know it is not " +
        "Monday through Saturday, it must be Sunday. Including all seven binary indicators (Mon&ndash;Sat " +
        "<em>plus</em> Sunday) causes a <strong>multicollinearity</strong> error, so you use only $n - 1$ dummy " +
        "indicators.</p>" +
        "<pre><code class=\"language-python\"># Degrees of freedom in the book's examples\n# --- R ---\n# n &lt;- 10; df_variance &lt;- n - 1       # 9 values free once the mean is fixed\n# model.matrix(~ day_of_week, data=df) # 7 weekdays produce 6 dummy columns plus intercept\n\n# --- Python equivalent ---\nn = 10\nprint(n - 1)                          # 9 degrees of freedom for sample variance\nweekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']\nprint(len(weekdays) - 1)              # 6 d.f.; omit one dummy to avoid multicollinearity</code></pre>" }
    ],
    takeaways: [
      "Degrees of freedom (d.f.) is part of standardizing test statistics against reference distributions.",
      "It underlies factoring categorical variables into n-1 dummy variables to avoid multicollinearity."
    ]
  });

  // ------------------------------------------------------------------- ANOVA
  B({
    id: "ps-ch3-anova",
    chapter: "Chapter 3",
    title: "ANOVA",
    tagline: "A single omnibus test for differences among the means of several groups.",
    sections: [
      { h: "The conundrum", body:
        "<p>When comparing more than two groups (say A-B-C-D), each with numeric data, the procedure that tests " +
        "for a statistically significant difference among the groups is <strong>analysis of variance (ANOVA)</strong>. " +
        "Key terms: a <strong>pairwise comparison</strong> is a hypothesis test between two of the groups; an " +
        "<strong>omnibus test</strong> is a single test of the overall variance among all group means; " +
        "<strong>decomposition of variance</strong> separates the components contributing to a value (grand " +
        "average, treatment effect, residual error); the <strong>F-statistic</strong> measures how far the " +
        "differences among group means exceed a chance model; and <strong>SS</strong> is &quot;sum of " +
        "squares,&quot; deviations from some average.</p>" +
        "<p>The book's data — stickiness (seconds) for four web pages, five visitors each, randomly assigned:</p>" +
        "<table class=\"extable\"><thead><tr><th>Visitor</th><th>Page 1</th><th>Page 2</th><th>Page 3</th><th>Page 4</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">1</td><td class=\"num\">164</td><td class=\"num\">178</td><td class=\"num\">175</td><td class=\"num\">155</td></tr>" +
        "<tr><td class=\"row-h\">2</td><td class=\"num\">172</td><td class=\"num\">191</td><td class=\"num\">193</td><td class=\"num\">166</td></tr>" +
        "<tr><td class=\"row-h\">3</td><td class=\"num\">177</td><td class=\"num\">182</td><td class=\"num\">171</td><td class=\"num\">164</td></tr>" +
        "<tr><td class=\"row-h\">4</td><td class=\"num\">156</td><td class=\"num\">185</td><td class=\"num\">163</td><td class=\"num\">170</td></tr>" +
        "<tr><td class=\"row-h\">5</td><td class=\"num\">195</td><td class=\"num\">177</td><td class=\"num\">176</td><td class=\"num\">168</td></tr>" +
        "<tr><td class=\"row-h\">Average</td><td class=\"num\">172</td><td class=\"num\">185</td><td class=\"num\">176</td><td class=\"num\">162</td></tr>" +
        "</tbody></table>" +
        "<p>Grand average = 173.75. With four means there are six possible pairwise comparisons, and each extra " +
        "comparison raises the chance of being fooled. Instead of all those comparisons, a single omnibus test " +
        "asks: &quot;could all pages share the same underlying stickiness, with the differences arising from the " +
        "random way a common set of session times got allocated?&quot;</p>" },
      { h: "The resampling basis of ANOVA", body:
        "<p>The logic behind ANOVA, as a resampling procedure for the A-B-C-D test:</p>" +
        "<ul class=\"steps\">" +
        "<li>Combine all the data into a single box.</li>" +
        "<li>Shuffle and draw four resamples of five values each.</li>" +
        "<li>Record the mean of each of the four groups.</li>" +
        "<li>Record the variance among the four group means.</li>" +
        "<li>Repeat steps 2&ndash;4 many times (say 1,000).</li>" +
        "</ul>" +
        "<p>The p-value is the proportion of times the resampled variance exceeded the observed variance. R's " +
        "<code>aovp</code> function (lmPerm package) computes this permutation test and reports Pr(Prob) = " +
        "<strong>0.09278</strong> for the page data.</p>" },
      { h: "The F-statistic", body:
        "<p>Just as the t-test can replace a permutation test for two means, the <strong>F-statistic</strong> " +
        "provides a formula-based ANOVA test. It is the ratio of the variance across group means (the treatment " +
        "effect) to the variance from residual error. The higher the ratio, the more significant the result. If " +
        "data is normal, the statistic follows a known distribution, so a p-value can be computed. R's " +
        "<code>aov</code> gives the ANOVA table:</p>" +
        "<table class=\"extable\"><thead><tr><th>Source</th><th>Df</th><th>Sum Sq</th><th>Mean Sq</th><th>F value</th><th>Pr(&gt;F)</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">Page</td><td class=\"num\">3</td><td class=\"num\">831.4</td><td class=\"num\">277.1</td><td class=\"num\">2.74</td><td class=\"num\">0.0776</td></tr>" +
        "<tr><td class=\"row-h\">Residuals</td><td class=\"num\">16</td><td class=\"num\">1618.4</td><td class=\"num\">101.2</td><td class=\"num\"></td><td class=\"num\"></td></tr>" +
        "</tbody></table>" +
        "<p>Df is degrees of freedom, Sum Sq is sum of squares, Mean Sq is mean squares (sum of squares divided by " +
        "df), and F value is the F-statistic = MS(treatment) / MS(error) = $277.1 / 101.2 = 2.74$. The treatment " +
        "means have 3 d.f. (once three are set and the grand average is set, the fourth cannot vary); residuals " +
        "have 16 d.f. The F value depends only on this ratio and is compared to a standard F distribution.</p>" +
        "<p><strong>Decomposition of variance.</strong> Any observed value breaks into grand average + treatment " +
        "effect + residual error. For the top-left value in the table:</p>" +
        "<ul class=\"steps\">" +
        "<li>Start with grand average: 173.75.</li>" +
        "<li>Add treatment (group) effect: $-1.75$ (= 172 $-$ 173.75).</li>" +
        "<li>Add residual: $-8$ (= 164 $-$ 172).</li>" +
        "<li>Equals: 164.</li>" +
        "</ul>" },
      { h: "Two-way ANOVA", body:
        "<p>The A-B-C-D test is a &quot;one-way&quot; ANOVA — one varying factor (page). With a second factor — say " +
        "&quot;weekend versus weekday,&quot; with data on each combination (group A weekend, group A weekday, etc.) " +
        "— you have a <strong>two-way ANOVA</strong>, handled similarly by identifying the &quot;interaction " +
        "effect.&quot; After the grand-average effect and the treatment effect, you separate the weekend and " +
        "weekday observations for each group and find the difference between those subset averages and the " +
        "treatment average. ANOVA and two-way ANOVA are the first steps toward a full statistical model such as " +
        "regression and logistic regression.</p>" }
    ],
    takeaways: [
      "ANOVA tests whether overall variation among several group means is within chance range.",
      "It extends the A/B-test idea to multiple groups via a single omnibus test.",
      "It identifies variance components for group treatments, interaction effects, and errors."
    ]
  });
  window.CODEVIZ["ps-ch3-anova"] = { charts: [ {
    type: "bars",
    title: "Average session time per page (book's four-page stickiness data, Figure 3-6)",
    interpret: "Group means 172, 185, 176, 162 s; grand average 173.75. The spread looks sizeable, but the " +
      "F-statistic of 2.74 gives p = 0.0776 (aovp permutation p = 0.093) — not significant at alpha = 0.05.",
    labels: ["Page 1", "Page 2", "Page 3", "Page 4"],
    values: [172, 185, 176, 162]
  } ],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# library(lmPerm)\n# summary(aovp(Time ~ Page, data=four_sessions))\n# # Page: Df=3, R Sum Sq=831.4, R Mean Sq=277.13, Iter=3104, Pr(Prob)=0.09278\n# summary(aov(Time ~ Page, data=four_sessions))\n# # Page: Df=3, Sum Sq=831.4, Mean Sq=277.1, F value=2.74, Pr(>F)=0.0776\n# # Residuals: Df=16, Sum Sq=1618.4, Mean Sq=101.2\n\n# --- Python equivalent ---\nimport pandas as pd, statsmodels.api as sm\nfrom statsmodels.formula.api import ols\nfour_sessions = pd.DataFrame({'Page': sum(([f'Page {i}']*5 for i in [1,2,3,4]), []),\n    'Time': [164,172,177,156,195,178,191,182,185,177,175,193,171,163,176,155,166,164,170,168]})\nmodel = ols('Time ~ C(Page)', data=four_sessions).fit()\nprint(sm.stats.anova_lm(model, typ=1))  # F=2.7398, p=0.0776"
  };

  // -------------------------------------------------------------- Chi-Square Test
  B({
    id: "ps-ch3-chi-square",
    chapter: "Chapter 3",
    title: "Chi-Square Test",
    tagline: "Testing whether count data departs from an expected (independence) distribution.",
    sections: [
      { h: "What it is", body:
        "<p>Web testing often tests more than two treatments at once. The <strong>chi-square test</strong> is used " +
        "with count data to test how well it fits an expected distribution; its most common use is with $r \\times " +
        "c$ contingency tables to assess whether the null hypothesis of independence among variables is " +
        "reasonable. It was developed by Karl Pearson in 1900; &quot;chi&quot; is the Greek letter Pearson used. " +
        "Key terms: the <strong>chi-square statistic</strong> measures how far observed data departs from " +
        "expectation; <strong>expectation / expected</strong> is how the data would look under an assumption " +
        "(usually the null); and $r \\times c$ means &quot;rows by columns.&quot;</p>" },
      { h: "A resampling approach", body:
        "<p>Suppose three headlines A, B, C are each shown to 1,000 visitors (Table 3-4):</p>" +
        "<table class=\"extable\"><thead><tr><th>Outcome</th><th>Headline A</th><th>Headline B</th><th>Headline C</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">Click</td><td class=\"num\">14</td><td class=\"num\">8</td><td class=\"num\">12</td></tr>" +
        "<tr><td class=\"row-h\">No-click</td><td class=\"num\">986</td><td class=\"num\">992</td><td class=\"num\">988</td></tr>" +
        "</tbody></table>" +
        "<p>Headline A draws nearly twice B's click rate, but the counts are tiny. Under the null (all three share " +
        "one click rate of 34/3,000) the expected clicks are 11.33 per headline (and 988.67 no-clicks). The " +
        "<strong>Pearson residual</strong> $R = (\\text{Observed} - \\text{Expected}) / \\sqrt{\\text{Expected}}$ " +
        "measures how far each cell departs:</p>" +
        "<table class=\"extable\"><thead><tr><th>Outcome</th><th>Headline A</th><th>Headline B</th><th>Headline C</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">Click</td><td class=\"num\">0.792</td><td class=\"num\">-0.990</td><td class=\"num\">0.198</td></tr>" +
        "<tr><td class=\"row-h\">No-click</td><td class=\"num\">-0.085</td><td class=\"num\">0.106</td><td class=\"num\">-0.021</td></tr>" +
        "</tbody></table>" +
        "<p>The chi-squared statistic is the sum of the squared Pearson residuals, $\\xi = \\sum_i^r \\sum_j^c R^2 " +
        "= 1.666$. Is that more than chance would produce? The resampling test:</p>" +
        "<ul class=\"steps\">" +
        "<li>Build a box with 34 ones (clicks) and 2,966 zeros (no clicks).</li>" +
        "<li>Shuffle, take three separate samples of 1,000, count the clicks in each.</li>" +
        "<li>Find the squared differences between shuffled and expected counts, and sum them.</li>" +
        "<li>Repeat steps 2&ndash;3 (say 1,000 times).</li>" +
        "<li>How often does the resampled sum of squared deviations exceed the observed? That is the p-value.</li>" +
        "</ul>" +
        "<p>R's <code>chisq.test(clicks, simulate.p.value=TRUE)</code> gives X-squared = 1.6659 and p-value = " +
        "0.4853 — the result could easily have arisen by randomness.</p>" },
      { h: "Statistical theory", body:
        "<p>Asymptotic theory shows the chi-squared statistic's distribution can be approximated by a " +
        "<strong>chi-square distribution</strong>. The right standard distribution is set by the degrees of " +
        "freedom; for a contingency table, $\\text{d.f.} = (r - 1) \\times (c - 1)$. The distribution is skewed " +
        "with a long right tail; the further out the observed statistic, the lower the p-value. Running " +
        "<code>chisq.test(clicks, simulate.p.value=FALSE)</code> gives X-squared = 1.6659, df = 2, p-value = " +
        "0.4348 — a little less than the resampling p-value because the chi-square distribution is only an " +
        "approximation of the statistic's actual distribution.</p>" },
      { h: "Fisher's exact test", body:
        "<p>The chi-square distribution approximates the resampling test well except when counts are extremely low " +
        "(single digits, especially five or fewer), where resampling gives more accurate p-values. " +
        "<strong>Fisher's exact test</strong> (after R. A. Fisher) goes further: most software can enumerate " +
        "<em>all</em> possible rearrangements (permutations), tabulate their frequencies, and find exactly how " +
        "extreme the observed result is. R's <code>fisher.test(clicks)</code> gives p-value = 0.4824 — very close " +
        "to the resampling 0.4853. When some counts are very low but others very high (e.g., a conversion-rate " +
        "denominator), enumerating every permutation may be infeasible, so a shuffled permutation test is used " +
        "instead.</p>" +
        "<p><strong>Detecting scientific fraud.</strong> Tufts researcher Thereza Imanishi-Kari was accused in 1991 " +
        "of fabricating data (later exonerated). Investigators examined the interior digits of her lab data, which " +
        "should follow a uniform random distribution (each digit equally likely). The observed frequencies of 315 " +
        "interior digits:</p>" +
        "<table class=\"extable\"><thead><tr><th>Digit</th><th>Frequency</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">0</td><td class=\"num\">14</td></tr>" +
        "<tr><td class=\"row-h\">1</td><td class=\"num\">71</td></tr>" +
        "<tr><td class=\"row-h\">2</td><td class=\"num\">7</td></tr>" +
        "<tr><td class=\"row-h\">3</td><td class=\"num\">65</td></tr>" +
        "<tr><td class=\"row-h\">4</td><td class=\"num\">23</td></tr>" +
        "<tr><td class=\"row-h\">5</td><td class=\"num\">19</td></tr>" +
        "<tr><td class=\"row-h\">6</td><td class=\"num\">12</td></tr>" +
        "<tr><td class=\"row-h\">7</td><td class=\"num\">45</td></tr>" +
        "<tr><td class=\"row-h\">8</td><td class=\"num\">53</td></tr>" +
        "<tr><td class=\"row-h\">9</td><td class=\"num\">6</td></tr>" +
        "</tbody></table>" +
        "<p>A strictly uniform distribution would give about 31.5 per digit (315/10). The departure from this " +
        "expectation, assessed by a chi-square test, was well beyond normal chance variation — the data looks " +
        "non-random.</p>" },
      { h: "Relevance for data science", body:
        "<p>Standard uses of the chi-square or Fisher's exact test are not terribly relevant for data science, " +
        "where the goal is usually the best treatment rather than statistical significance (multi-arm bandits suit " +
        "that better). But these tests help with power and sample-size calculations for low-click-rate web " +
        "experiments. In data science they serve more as a <em>filter</em> — is an effect or feature worth further " +
        "study? — for example in spatial statistics (are crimes concentrated more than chance allows?) and in " +
        "automated feature selection (flagging features where a class is unusually prevalent).</p>" }
    ],
    takeaways: [
      "A common procedure tests whether observed counts are consistent with an assumption of independence.",
      "The chi-square distribution is the reference distribution embodying independence.",
      "Fisher's exact test enumerates all permutations and is best when counts are very low."
    ]
  });
  window.CODEVIZ["ps-ch3-chi-square"] = { charts: [ {
    type: "bars",
    title: "Frequency of interior digits in Imanishi-Kari lab data (Figure 3-8)",
    interpret: "A uniform random distribution would put ~31.5 per digit (the dashed expectation). The observed " +
      "spikes at 1, 3, 7, 8 and dips at 2, 9 depart far beyond chance — the basis of the chi-square fraud finding.",
    labels: ["0","1","2","3","4","5","6","7","8","9"],
    values: [14, 71, 7, 65, 23, 19, 12, 45, 53, 6]
  }, {
    type: "line",
    title: "Chi-square distributions with 1, 2, 5, and 10 degrees of freedom (Figure 3-7)",
    interpret: "The reference distribution is right-skewed; with the headline table's df = (2-1)(3-1) = 2, X-squared = 1.6659 gives p = 0.4348.",
    xlabel: "chi-square statistic",
    ylabel: "density",
    series: [
      { name: "df=1", color: "#4ea1ff", points: [[0.5,0.4394],[1,0.2420],[2,0.1038],[3,0.0514],[5,0.0146],[7,0.0046],[10,0.0009],[15,0.0001],[20,0.0000]] },
      { name: "df=2", color: "#7ee787", points: [[0.5,0.3894],[1,0.3033],[2,0.1839],[3,0.1116],[5,0.0410],[7,0.0151],[10,0.0034],[15,0.0003],[20,0.0000]] },
      { name: "df=5", color: "#ffb454", points: [[0.5,0.0366],[1,0.0807],[2,0.1384],[3,0.1542],[5,0.1220],[7,0.0744],[10,0.0283],[15,0.0043],[20,0.0005]] },
      { name: "df=10", color: "#c89bff", points: [[0.5,0.0001],[1,0.0008],[2,0.0077],[3,0.0235],[5,0.0668],[7,0.0944],[10,0.0877],[15,0.0365],[20,0.0095]] }
    ]
  } ],
    code: "# --- R (Practical Statistics, 1st ed.) ---\n# clicks <- matrix(c(14, 8, 12, 986, 992, 988), nrow=2, byrow=TRUE)\n# chisq.test(clicks, simulate.p.value=TRUE)\n# # X-squared = 1.6659, df = NA, p-value = 0.4853 (based on 2000 replicates)\n# chisq.test(clicks, simulate.p.value=FALSE)\n# # X-squared = 1.6659, df = 2, p-value = 0.4348\n# fisher.test(clicks)                # p-value = 0.4824\n\n# --- Python equivalent ---\nimport numpy as np\nfrom scipy.stats import chi2_contingency, fisher_exact\nclicks = np.array([[14, 8, 12], [986, 992, 988]])\nchi2, p, dof, expected = chi2_contingency(clicks, correction=False)\nprint(chi2, dof, p)                  # 1.6659, 2, 0.4348\nprint(expected)                      # click row: 11.33 each; no-click row: 988.67 each"
  };

  // ----------------------------------------------------- Multi-Arm Bandit Algorithm
  B({
    id: "ps-ch3-multi-arm-bandit",
    chapter: "Chapter 3",
    title: "Multi-Arm Bandit Algorithm",
    tagline: "Shift sampling toward the winning treatment during the experiment, not after.",
    sections: [
      { h: "What it is", body:
        "<p>Multi-arm bandits offer an approach to testing — especially web testing — that allows explicit " +
        "optimization and faster decisions than the traditional design-an-experiment approach. Key terms: a " +
        "<strong>multi-arm bandit</strong> is an imaginary slot machine with multiple arms of different payoffs, " +
        "an analogy for a multi-treatment experiment; an <strong>arm</strong> is a treatment (e.g., headline A); " +
        "and a <strong>win</strong> is the analog of a slot-machine win (e.g., a customer clicks the link).</p>" +
        "<p>A traditional A/B test collects data per a fixed design, answers &quot;which is better?&quot;, then " +
        "stops. The book lists its difficulties: the answer may be inconclusive (&quot;effect not proven&quot;); we " +
        "may want to start exploiting early results before the experiment ends; and we may want to change course " +
        "based on later data. The traditional approach dates to the 1920s and is inflexible; computing power " +
        "enables more flexible methods, and data science cares more about optimizing overall results than about " +
        "significance.</p>" },
      { h: "The slot-machine intuition", body:
        "<p>Slot machines are &quot;one-armed bandits&quot; (they extract money steadily). Imagine one with several " +
        "arms, each paying out at a different unknown rate; that is a multi-armed bandit. Your goal is to win as " +
        "much as possible and settle on the best arm soon. The book's example — try each arm 50 times:</p>" +
        "<ul class=\"steps\">" +
        "<li>Arm A: 10 wins out of 50.</li>" +
        "<li>Arm B: 2 wins out of 50.</li>" +
        "<li>Arm C: 4 wins out of 50.</li>" +
        "</ul>" +
        "<p>One extreme: declare A the winner and stop trying B and C — great if A is truly best, but you lose any " +
        "chance to discover a hidden better arm. The other extreme: keep pulling all arms equally — maximum chance " +
        "for alternatives to show themselves, but you waste pulls on inferior treatments. Bandit algorithms take a " +
        "hybrid path: pull A more often (exploit its apparent edge) without abandoning B and C, and shift pulls " +
        "back if C starts doing better and A worse.</p>" },
      { h: "Epsilon-greedy and Thompson's sampling", body:
        "<p>Applied to web testing, the arms become offers/headlines/colors; a win is a click. Offers start shown " +
        "randomly and equally; if one outperforms, it is shown (&quot;pulled&quot;) more often. The book's simple " +
        "<strong>epsilon-greedy</strong> algorithm for an A/B test:</p>" +
        "<ul class=\"steps\">" +
        "<li>Generate a random number between 0 and 1.</li>" +
        "<li>If it lies between 0 and epsilon (a small number), flip a fair coin: heads show offer A, tails show offer B.</li>" +
        "<li>If the number is $\\ge$ epsilon, show whichever offer has had the highest response rate so far.</li>" +
        "</ul>" +
        "<p>Epsilon is the single governing parameter. At epsilon = 1 you get a standard A/B experiment (random " +
        "allocation); at epsilon = 0 you get a purely <em>greedy</em> algorithm that always assigns visitors to " +
        "the best-performing offer with no further exploration.</p>" +
        "<p>A more sophisticated approach is <strong>Thompson's sampling</strong>, which samples (pulls an arm) at " +
        "each stage to maximize the probability of choosing the best arm. It uses a Bayesian approach: assume a " +
        "prior distribution of rewards (a <em>beta distribution</em>), then update it as each payoff is observed, " +
        "so later draws are better optimized. Bandits handle 3+ treatments efficiently — exactly where the " +
        "decision complexity of traditional testing balloons.</p>" +
        "<pre><code class=\"language-python\"># Epsilon-greedy algorithm described in the book\n# --- R-style pseudocode ---\n# if (runif(1) &lt; epsilon) sample(c('A','B'), 1) else names(which.max(response_rates))\n# epsilon = 1 -&gt; ordinary random A/B allocation; epsilon = 0 -&gt; purely greedy\n# initial slot-arm results: A 10/50 = 0.20, B 2/50 = 0.04, C 4/50 = 0.08\n\n# --- Python equivalent ---\nimport random\nwins = {'A': 10, 'B': 2, 'C': 4}; pulls = {'A': 50, 'B': 50, 'C': 50}\ndef choose_arm(epsilon=0.1):\n    if random.random() &lt; epsilon:\n        return random.choice(list(wins))\n    return max(wins, key=lambda arm: wins[arm] / pulls[arm])\nprint({a: wins[a] / pulls[a] for a in wins})  # A=0.20, B=0.04, C=0.08</code></pre>" }
    ],
    takeaways: [
      "Traditional A/B tests can over-expose visitors to the inferior treatment.",
      "Bandits alter the sampling to use information learned mid-experiment, cutting exposure to losers.",
      "They handle more than two treatments efficiently.",
      "Different algorithms (epsilon-greedy, Thompson's sampling) shift sampling toward the apparent winner."
    ]
  });

  // ------------------------------------------------------- Power and Sample Size
  B({
    id: "ps-ch3-power-sample-size",
    chapter: "Chapter 3",
    title: "Power and Sample Size",
    tagline: "How much data you need to detect an effect of a given size.",
    sections: [
      { h: "The question", body:
        "<p>If you run a web test, how long should it run — how many impressions per treatment? Despite popular " +
        "guides, the book says there is no good general rule; it depends mainly on the frequency with which your " +
        "goal is met. Key terms: <strong>effect size</strong> is the minimum effect you hope to detect (e.g., a " +
        "20% improvement in click rate); <strong>power</strong> is the probability of detecting a given effect " +
        "size with a given sample size; and <strong>significance level</strong> is the alpha at which the test " +
        "runs.</p>" },
      { h: "Power, with the baseball example", body:
        "<p>A sample-size calculation starts by asking &quot;will the test actually reveal a difference between A " +
        "and B?&quot; The p-value depends on the real difference and on the luck of the draw. The bigger the actual " +
        "difference, the easier to detect; the smaller it is, the more data is needed. The book's analogy: " +
        "distinguishing a .350 hitter from a .200 hitter needs few at-bats, but distinguishing a .300 hitter from " +
        "a .280 hitter needs many more.</p>" +
        "<p><strong>Power</strong> is the probability of detecting a specified effect size given the sample's size " +
        "and variability. The book's (hypothetical) figures:</p>" +
        "<ul class=\"steps\">" +
        "<li>Distinguish a .330 hitter from a .200 hitter — effect size = .130.</li>" +
        "<li>In 25 at-bats ($n = 25$), the probability of detecting that difference is 0.75.</li>" +
        "<li>So this experiment has (hypothetical) power of 0.75, or 75%.</li>" +
        "</ul>" +
        "<p>&quot;Detecting&quot; means a hypothesis test rejects the null of &quot;no difference&quot; and concludes " +
        "a real effect exists. There are several moving parts and many statistical assumptions; special software " +
        "computes power. Most data scientists need not report power formally, but a rough sense of how much data " +
        "to collect helps avoid spending effort only to reach an inconclusive result.</p>" },
      { h: "An intuitive resampling approach to power", body:
        "<p>The book offers a fairly intuitive alternative:</p>" +
        "<ul class=\"steps\">" +
        "<li>Start with hypothetical data representing your best guess (e.g., a box of 20 ones and 80 zeros for a .200 hitter).</li>" +
        "<li>Make a second sample by adding the desired effect size (e.g., a box of 33 ones and 67 zeros).</li>" +
        "<li>Draw a bootstrap sample of size $n$ from each box.</li>" +
        "<li>Run a permutation (or formula-based) hypothesis test on the two and record whether the difference is significant.</li>" +
        "<li>Repeat many times; the fraction that come out significant is the estimated power.</li>" +
        "</ul>" },
      { h: "Sample size, with the click-rate example", body:
        "<p>The most common use of power calculations is estimating sample size. Suppose you test a new ad against " +
        "an existing one and require the new ad to beat the old by some percentage (the effect size), which then " +
        "drives the sample size. The book's worked attempts:</p>" +
        "<ul class=\"steps\">" +
        "<li>Current click rate ~1.1%, seeking a 10% boost to 1.21%. Box A: 110 ones / 9,890 zeros; Box B: 121 ones / 9,879 zeros.</li>" +
        "<li>Try 300 draws from each box. A first draw of Box A: 3 ones, Box B: 5 ones — that 5-vs-3 gap is well within chance. $n = 300$ with a 10% effect is too small.</li>" +
        "<li>Increase to 2,000 draws and require a 50% boost (1.1% to 1.65%). Box A: 110/9,890; Box B: 165/9,868.</li>" +
        "<li>A first draw of Box A: 19 ones, Box B: 34 ones. The 34-vs-19 gap still tests &quot;not significant,&quot; though far closer than 5-vs-3.</li>" +
        "</ul>" +
        "<p>The takeaway from these draws: even detecting a 50% improvement will require several thousand ad " +
        "impressions.</p>" },
      { h: "The four moving parts", body:
        "<p>For calculating power or required sample size there are four moving parts:</p>" +
        "<ul class=\"steps\">" +
        "<li>Sample size.</li>" +
        "<li>Effect size you want to detect.</li>" +
        "<li>Significance level (alpha) at which the test runs.</li>" +
        "<li>Power.</li>" +
        "</ul>" +
        "<p>Specify any three and the fourth can be computed. Most often you compute sample size, so you specify " +
        "the other three. R's <code>pwr.2p.test(h = ..., n = ..., sig.level = ..., power = )</code> (pwr package) " +
        "does this for two-proportion tests, where h is the effect size as a proportion.</p>" +
        "<pre><code class=\"language-python\"># --- R (Practical Statistics, 1st ed.) ---\n# library(pwr)\n# pwr.2p.test(h = ..., n = ..., sig.level = ..., power = )\n# # h = effect size; n = sample size; sig.level = alpha; power = probability of detecting the effect\n# # Book trial 1: A 110/9890 vs B 121/9879, n=300 draws -&gt; first draw 3 vs 5, not significant\n# # Book trial 2: A 110/9890 vs B 165/9868, n=2000 draws -&gt; first draw 19 vs 34, still not significant\n\n# --- Python equivalent ---\nfrom statsmodels.stats.power import NormalIndPower\nfrom statsmodels.stats.proportion import proportion_effectsize\np1, p2 = 0.011, 0.0165             # 50% boost from 1.1% to 1.65%\neffect = proportion_effectsize(p1, p2)\n# n = NormalIndPower().solve_power(effect_size=effect, alpha=0.05, power=0.8, ratio=1)\n# print(n)                         # several thousand impressions per group</code></pre>" }
    ],
    takeaways: [
      "Finding the needed sample size means thinking ahead to the test you plan to run.",
      "Specify the minimum effect size you want to detect.",
      "Specify the required power (probability of detecting that effect).",
      "Specify the significance level (alpha); any three of the four parts give the fourth."
    ]
  });
})();
