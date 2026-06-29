/* Practical Statistics for Data Scientists (Bruce & Bruce, O'Reilly 2017)
   Chapter 2 — Data and Sampling Distributions.
   Self-registering book-template lessons. Faithful paraphrase of the book's
   own definitions, examples, and worked numbers — no verbatim copying. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Practical Statistics";
  const BOOK = "Practical Statistics for Data Scientists";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1. Random Sampling and Sample Bias
  B({
    id: "ps-ch2-random-sampling-sample-bias",
    chapter: "Chapter 2",
    title: "Random Sampling and Sample Bias",
    tagline: "Even with big data, a well-chosen sample beats a huge biased one.",
    sections: [
      { h: "Sample, population, and random sampling", body:
        "<p>A <em>sample</em> is a subset drawn from a larger data set, which statisticians call the <em>population</em>. The population is the larger data set or the idea of a data set; in statistics it can be large, defined, but sometimes only theoretical or imaginary. The book writes $N$ for the population size and $n$ for the sample size.</p>" +
        "<p><em>Random sampling</em> means every available member of the population has an equal chance of being chosen on each draw. The result is a <em>simple random sample</em>. Drawing can be done <em>with replacement</em> (each observation is put back and can be picked again) or <em>without replacement</em> (once chosen, an observation cannot be drawn again). In <em>stratified sampling</em> the population is split into <em>strata</em> and a random sample is taken from each stratum.</p>" },
      { h: "Bias and the Literary Digest example", body:
        "<p><em>Sample bias</em> means the sample misrepresents the population in some meaningful, nonrandom way. Hardly any sample is exactly representative; bias is when the difference is systematic and would repeat for other samples drawn the same way. The book's distinction: random chance produces scattered error in no particular direction, while <em>bias</em> is systematic error.</p>" +
        "<p>The classic case is the 1936 <em>Literary Digest</em> poll. The magazine polled over 10 million people (its subscribers plus marketing lists) and predicted a landslide for Landon. George Gallup polled only about 2,000 and correctly predicted a Roosevelt win.</p>" +
        "<ul class='steps'>" +
        "<li>The <em>Literary Digest</em> chose <strong>quantity</strong> over method, drawing from people of higher socioeconomic status (subscribers, telephone and automobile owners).</li>" +
        "<li>That group did not represent the wider electorate, so the sample was systematically biased.</li>" +
        "<li>Gallup's small but representative sample won — selection method, not size, decided accuracy.</li>" +
        "</ul>" +
        "<p>The book also notes <em>self-selection bias</em>: online reviews on sites like Yelp are written by people who chose to write them, so they may not reflect the typical customer.</p>" },
      { h: "Size versus quality", body:
        "<p>In the big-data era it can be surprising that smaller is sometimes better. Time spent on careful random sampling reduces bias and frees effort for data exploration and quality checks — tracking down missing values or inspecting outliers may be infeasible across millions of records but workable in a sample of a few thousand.</p>" +
        "<p>Big data still earns its keep when data is not only large but <em>sparse</em>. The book's example: Google's search matrix has columns for ~150,000+ English words and rows for over a trillion queries per year, with mostly zero entries. Only enormous data lets the rare query (the book's example phrase mixes Ricky Ricardo and Little Red Riding Hood) return a useful, specific result — and random sampling would not help here.</p>" },
      { h: "Sample mean versus population mean", body:
        "<p>The book keeps two symbols separate on purpose. $\\bar{x}$ (read \"x-bar\") is the mean of a <em>sample</em>; $\\mu$ (the Greek letter mu) is the mean of the whole <em>population</em>. Samples are observed directly, whereas the population mean is usually <em>inferred</em> from a smaller sample, so statisticians keep the two distinct in the notation.</p>" }
    ],
    takeaways: [
      "A sample is a subset; the population is the larger set it represents.",
      "Bias is systematic (repeatable) error; random error just scatters.",
      "The Literary Digest's 10M biased sample lost to Gallup's 2,000 representative one.",
      "Data quality often beats data quantity; $\\bar{x}$ is a sample mean, $\\mu$ a population mean."
    ]
  });

  // 2. Selection Bias
  B({
    id: "ps-ch2-selection-bias",
    chapter: "Chapter 2",
    title: "Selection Bias",
    tagline: "Hunt through enough data and you will always find something.",
    sections: [
      { h: "Choosing data to fit the answer", body:
        "<p><em>Selection bias</em> is choosing data — knowingly or not — in a way that leads to a misleading or fleeting conclusion. The book paraphrases Yogi Berra: if you don't know what you are looking for, look hard enough and you will find it. Related terms: <em>data snooping</em> (extensive hunting through data for something interesting) and the <em>vast search effect</em> (bias or non-reproducibility from repeatedly modeling data or using many predictor variables). As the saying goes, torture the data long enough and it will confess.</p>" },
      { h: "The coin-flip thought experiment", body:
        "<p>The book contrasts verifying a hypothesis with discovering a pattern by browsing data.</p>" +
        "<ul class='steps'>" +
        "<li>If someone claims she can flip 10 heads in a row and you challenge her (an experiment), and she does it, you are impressed — the chance of 10 heads by luck is about 1 in 1,000.</li>" +
        "<li>Now a stadium announcer asks 20,000 people to each flip 10 times. The chance that <em>somebody</em> gets 10 heads is over 99% (one minus the chance that nobody does).</li>" +
        "<li>Picking the winner <em>after the fact</em> shows no special talent — just luck found by searching a large group.</li>" +
        "</ul>" +
        "<p>To guard against this, the book recommends a <em>holdout set</em> (sometimes more than one) to validate performance, and <em>target shuffling</em> (a permutation test) to check whether a discovered association is real. Other forms of selection bias include nonrandom sampling, cherry-picking, choosing time intervals that flatter an effect, and stopping an experiment when results look interesting.</p>" },
      { h: "Regression to the mean", body:
        "<p><em>Regression to the mean</em> describes successive measurements of a variable: extreme observations tend to be followed by more central ones. Treating the extreme value as special leads to a form of selection bias.</p>" +
        "<p>The book's example is the \"rookie of the year, sophomore slump.\" Performance in ball-and-puck sports mixes two elements — <strong>skill</strong> and <strong>luck</strong>. The rookie picked as best had both skill and good luck; next season the skill remains but the luck usually does not, so performance regresses toward the average. Francis Galton first identified this in 1886, observing that children of very tall men tend to be shorter than their fathers (Figure 2-5).</p>" +
        "<p class='warn'>Note: regression to the mean (\"go back\") is a different idea from the modeling method of linear regression, which estimates a relationship between predictors and an outcome.</p>" }
    ],
    takeaways: [
      "Selection bias: picking data that makes a misleading conclusion look real.",
      "Search 20,000 coin-flippers and someone gets 10 heads — luck, not talent.",
      "Holdout sets and target shuffling (permutation tests) guard against it.",
      "Regression to the mean: extremes (with luck) are followed by more average values."
    ]
  });

  // 3. Sampling Distribution of a Statistic
  B({
    id: "ps-ch2-sampling-distribution",
    chapter: "Chapter 2",
    title: "Sampling Distribution of a Statistic",
    tagline: "A statistic varies from sample to sample, and it has its own distribution.",
    sections: [
      { h: "Data distribution versus sampling distribution", body:
        "<p>A <em>sample statistic</em> is a metric computed from a sample, such as a mean. The book draws a sharp line between two distributions:</p>" +
        "<ul>" +
        "<li><strong>Data distribution</strong> — the frequency distribution of the individual <em>values</em> in a data set.</li>" +
        "<li><strong>Sampling distribution</strong> — the frequency distribution of a <em>sample statistic</em> over many samples or resamples.</li>" +
        "</ul>" +
        "<p>Because an estimate is based on one sample, it could come out differently for a different sample. The spread of how different it might be is <em>sampling variability</em>. The distribution of a statistic like the mean is more bell-shaped and regular than the data itself, and the larger the sample, the narrower that distribution.</p>" },
      { h: "The Lending Club income example", body:
        "<p>The book illustrates this with annual income of loan applicants. It takes three samples: 1,000 individual income values; 1,000 <em>means of 5</em> values; and 1,000 <em>means of 20</em> values, then plots a histogram of each (Figure 2-6).</p>" +
        "<p>The raw data is broadly spread and skewed toward higher incomes, as income data tends to be. The means of 5 are tighter and more bell-shaped, and the means of 20 are tighter still — each averaging shrinks and regularizes the distribution.</p>" },
      { h: "Central limit theorem", body:
        "<p>The <em>central limit theorem</em> says that means drawn from many samples take on the familiar bell-shaped normal curve, even when the source population is not normal — provided the sample is large enough and the departure from normality is not too severe. This is what lets normal-approximation formulas (like the t-distribution) be used to compute sampling distributions for confidence intervals and hypothesis tests.</p>" +
        "<p>The book adds a data-science caveat: the CLT fills half of traditional statistics texts because it underpins formal tests and intervals, but since those play a small role in data science — and the bootstrap is always available — the CLT is less central in practice.</p>" },
      { h: "Standard error", body:
        "<p>The <em>standard error</em> ($SE$) is a single number summarizing the variability of the sampling distribution of a statistic. From the sample standard deviation $s$ and sample size $n$:</p>" +
        "<p>$SE = \\dfrac{s}{\\sqrt{n}}$</p>" +
        "<p>As $n$ grows, the standard error shrinks. This is the <em>square-root of n</em> rule: to cut the standard error in half, you must multiply the sample size by 4.</p>" +
        "<ul class='steps'>" +
        "<li>Collect several brand-new samples from the population.</li>" +
        "<li>Compute the statistic (e.g., the mean) for each sample.</li>" +
        "<li>Take the standard deviation of those statistics — that estimates the standard error.</li>" +
        "</ul>" +
        "<p>In practice drawing fresh samples is wasteful and often impossible, so the bootstrap is used instead. Do not confuse <em>standard deviation</em> (variability of individual data values) with <em>standard error</em> (variability of a sample statistic).</p>" }
    ],
    takeaways: [
      "Data distribution is about individual values; sampling distribution is about a statistic.",
      "Averaging more values (means of 5, then 20) gives a tighter, more bell-shaped curve.",
      "Central limit theorem: sample means look normal even when the data is not.",
      "Standard error $SE = s/\\sqrt{n}$; quartering it requires 4x the sample size."
    ]
  });
  window.CODEVIZ["ps-ch2-sampling-distribution"] = { charts: [ {
    type: "bars",
    title: "Income histograms get tighter with averaging",
    interpret: "Reconstruction of Figure 2-6. Raw incomes are wide and right-skewed; means of 5 are narrower; means of 20 are tightest and most bell-shaped — illustrating the central limit theorem.",
    labels: ["Raw spread (data)", "Spread of means of 5", "Spread of means of 20"],
    values: [100, 45, 23],
    valueLabels: ["wide", "narrower", "narrowest"],
    colors: ["#ffb454", "#4ea1ff", "#7ee787"]
  } ] };

  // 4. The Bootstrap
  B({
    id: "ps-ch2-bootstrap",
    chapter: "Chapter 2",
    title: "The Bootstrap",
    tagline: "Resample your own data with replacement to gauge a statistic's variability.",
    sections: [
      { h: "What the bootstrap is", body:
        "<p>The <em>bootstrap</em> is an easy, effective way to estimate the sampling distribution of a statistic (or of model parameters): draw additional samples <em>with replacement</em> from the sample itself and recompute the statistic each time. A <em>bootstrap sample</em> is a sample taken with replacement from an observed data set. The method makes no assumption that the data or statistic is normally distributed.</p>" +
        "<p>Conceptually, imagine replicating your original sample thousands or millions of times to form a hypothetical, larger population that carries all the information in your sample, then drawing from it. In practice you skip the replication: you simply replace each observation after drawing it, which effectively creates an infinite population where the draw probabilities never change.</p>" },
      { h: "Bootstrap algorithm for the mean", body:
        "<p>For a sample of size $n$:</p>" +
        "<ul class='steps'>" +
        "<li>Draw a value, record it, and replace it.</li>" +
        "<li>Repeat $n$ times.</li>" +
        "<li>Record the mean of the $n$ resampled values.</li>" +
        "<li>Repeat the whole process $R$ times.</li>" +
        "<li>Use the $R$ results to find the standard deviation (the standard error estimate), make a histogram or boxplot, or compute a confidence interval.</li>" +
        "</ul>" +
        "<p>More iterations ($R$) give a more accurate estimate. The result is a set of $R$ sample statistics whose variability you can examine.</p>" },
      { h: "Worked example: loan income median", body:
        "<p>The book applies the bootstrap to the median of loan-applicant incomes with $R = 1000$ resamples:</p>" +
        "<table class='extable'>" +
        "<thead><tr><th>quantity</th><th class='num'>value</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class='row-h'>original median estimate</td><td class='num'>\\$62,000</td></tr>" +
        "<tr><td class='row-h'>bias</td><td class='num'>about &minus;\\$70</td></tr>" +
        "<tr><td class='row-h'>standard error</td><td class='num'>about \\$209</td></tr>" +
        "</tbody></table>" +
        "<p>The bootstrap also works on multivariate data, sampling whole rows as units. Running models on bootstrap samples and aggregating their predictions (or majority-voting for classification) is called <em>bagging</em> — bootstrap aggregating — and generally beats a single model.</p>" +
        "<p class='warn'>Warning: the bootstrap does not compensate for a small sample, create new data, or fill holes. It tells you how additional samples drawn from a population like your sample would behave.</p>" },
      { h: "Resampling versus bootstrapping", body:
        "<p><em>Resampling</em> is the general process of taking repeated samples from observed data; it includes both the bootstrap and permutation (shuffling) procedures. Sometimes <em>resampling</em> is used as a synonym for <em>bootstrapping</em>, but more often resampling also covers permutation tests, where multiple samples are combined and sampling may be done <em>without</em> replacement. In all cases, <em>bootstrap</em> specifically means sampling <strong>with replacement</strong> from an observed data set.</p>" }
    ],
    takeaways: [
      "Bootstrap = resample your data with replacement and recompute the statistic.",
      "It needs no normality assumption and estimates standard error for almost any statistic.",
      "Loan-income median example: \\$62,000 estimate, ~\\$-70 bias, ~\\$209 standard error.",
      "Bootstrap always means with replacement; resampling also covers permutation tests."
    ]
  });

  // 5. Confidence Intervals
  B({
    id: "ps-ch2-confidence-intervals",
    chapter: "Chapter 2",
    title: "Confidence Intervals",
    tagline: "Present an estimate as a range, not a single overconfident number.",
    sections: [
      { h: "Why intervals", body:
        "<p>Frequency tables, histograms, boxplots, and standard errors all convey the potential error in a sample estimate; <em>confidence intervals</em> are another way. People place too much faith in an estimate shown as a single number — a <em>point estimate</em>. Presenting it as a range counteracts that, grounded in sampling principles.</p>" +
        "<p>Two key terms: the <em>confidence level</em> is the percentage of intervals, built the same way from the same population, that would be expected to contain the statistic of interest; the <em>interval endpoints</em> are the top and bottom of the interval.</p>" },
      { h: "Reading a confidence interval via the bootstrap", body:
        "<p>The book gives a concrete way to think of a 90% confidence interval: it is the interval enclosing the central 90% of the bootstrap sampling distribution of the statistic. More generally, an $x$% interval around an estimate should, on average, contain similar estimates $x$% of the time when the same sampling procedure is followed.</p>" +
        "<p>Bootstrap algorithm for a confidence interval, for a sample of size $n$:</p>" +
        "<ul class='steps'>" +
        "<li>Draw a resample of size $n$ with replacement from the data.</li>" +
        "<li>Record the statistic of interest for that resample.</li>" +
        "<li>Repeat steps 1&ndash;2 many ($R$) times.</li>" +
        "<li>For an $x$% interval, trim $[(1 - x/100)/2]$ of the $R$ results from each end of the distribution.</li>" +
        "<li>The trim points are the endpoints of the $x$% bootstrap confidence interval.</li>" +
        "</ul>" +
        "<p>The book's example (Figure 2-9): a 90% confidence interval for mean annual income of loan applicants, based on a sample of 20 with mean \\$57,573, runs from about \\$53,610 to \\$62,279 — trimming 5% from each tail of the bootstrap distribution.</p>" },
      { h: "How level and sample size affect width", body:
        "<p>The higher the confidence level, the wider the interval. The smaller the sample, the wider the interval (more uncertainty). Both make intuitive sense: more confidence and less data both force a wider range to be sure of capturing the true value.</p>" +
        "<p>The book notes that what people usually want to know — \"what is the probability the true value lies in this interval?\" — is not quite what a confidence interval answers, though that is how most people read it. For a data scientist, the interval is mainly a tool to gauge how variable a sample result is and whether a larger sample is needed.</p>" }
    ],
    takeaways: [
      "A confidence interval presents an estimate as a range around a point estimate.",
      "A 90% bootstrap interval encloses the central 90% of the resampled statistics.",
      "Example: mean income \\$57,573 from n=20 gives a ~\\$53,610–\\$62,279 90% interval.",
      "Higher confidence and smaller samples both widen the interval."
    ]
  });
  window.CODEVIZ["ps-ch2-confidence-intervals"] = { charts: [ {
    type: "bars",
    title: "90 percent interval for mean loan income",
    interpret: "Reconstruction of Figure 2-9. The bootstrap distribution of the mean (sample of 20, mean \\$57,573) is roughly bell-shaped; trimming 5% from each tail leaves the 90% interval \\$53,610 to \\$62,279.",
    labels: ["50,346", "52,625", "54,905", "57,184", "59,464", "61,743", "64,022"],
    values: [8, 30, 52, 60, 45, 22, 6],
    colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
  } ] };

  // 6. Normal Distribution
  B({
    id: "ps-ch2-normal-distribution",
    chapter: "Chapter 2",
    title: "Normal Distribution",
    tagline: "The bell curve is famous for sampling statistics, not raw data.",
    sections: [
      { h: "The bell curve and the 68-95-99.7 rule", body:
        "<p>The bell-shaped <em>normal distribution</em> is iconic in classical statistics because distributions of sample statistics are often normally shaped, which made it possible to build approximating formulas. In a normal distribution (Figure 2-10): about 68% of the data lies within one standard deviation of the mean, 95% within two, and 99.7% within three.</p>" +
        "<p class='warn'>Warning: the name does not mean most data is normally distributed. Most raw data in a data science project is <em>not</em> normal. The distribution's value comes from the fact that many <em>statistics</em> are normally distributed in their sampling distribution. Even so, normality assumptions are a last resort, used when empirical or bootstrap distributions are unavailable.</p>" +
        "<p>The normal distribution is also called the <em>Gaussian</em> distribution after Carl Friedrich Gauss; an older name was the \"error\" distribution, since an <em>error</em> is the difference between an actual value and a statistical estimate.</p>" },
      { h: "Standard normal, z-scores, and QQ-plots", body:
        "<p>A <em>standard normal</em> distribution has mean 0 and standard deviation 1; its x-axis is measured in standard deviations from the mean. To compare data to it you <em>standardize</em> (also called normalization): subtract the mean and divide by the standard deviation. The transformed value is a <em>z-score</em>, and the normal distribution is then sometimes called the z-distribution.</p>" +
        "<p>A <em>QQ-plot</em> shows visually how close a sample is to normal. It orders the z-scores from low to high and plots each value's z-score on the y-axis against the corresponding quantile of a normal distribution (for that value's rank) on the x-axis. If the points roughly follow the diagonal line, the sample is close to normal. The book's Figure 2-11 shows a QQ-plot for 100 values drawn from a normal distribution — the points closely follow the line, as expected.</p>" +
        "<p class='warn'>Warning: converting data to z-scores does <em>not</em> make the data normal. It only puts the data on the same scale as the standard normal, usually for comparison.</p>" }
    ],
    takeaways: [
      "Normal curve: ~68% within 1 SD, ~95% within 2 SD, ~99.7% within 3 SD.",
      "Most raw data is NOT normal; sampling statistics often are.",
      "A z-score standardizes a value: subtract the mean, divide by the SD.",
      "A QQ-plot near the diagonal line means the sample is close to normal."
    ]
  });
  window.CODEVIZ["ps-ch2-normal-distribution"] = { charts: [ {
    type: "scatter",
    title: "QQ-plot of a normal sample",
    interpret: "Reconstruction of Figure 2-11. For 100 values drawn from a normal distribution, the ordered z-scores fall almost exactly on the y = x diagonal, indicating closeness to normality.",
    xlabel: "theoretical normal quantile",
    ylabel: "sample z-score",
    groups: [ { name: "sample", color: "#4ea1ff", points: [[-2.6,-2.55],[-2.1,-2.15],[-1.6,-1.6],[-1.1,-1.05],[-0.6,-0.55],[-0.2,-0.15],[0.2,0.25],[0.6,0.6],[1.1,1.05],[1.6,1.55],[2.1,1.85],[2.55,2.5]] } ],
    lines: [ { name: "y = x", color: "#8b949e", points: [[-2.6,-2.6],[2.55,2.55]] } ]
  } ] };

  // 7. Long-Tailed Distributions
  B({
    id: "ps-ch2-long-tailed-distributions",
    chapter: "Chapter 2",
    title: "Long-Tailed Distributions",
    tagline: "Real data has fatter tails than the normal curve assumes.",
    sections: [
      { h: "Tails and skew", body:
        "<p>Despite the normal distribution's historical importance, data is generally <em>not</em> normally distributed. Two key terms: a <em>tail</em> is the long, narrow part of a frequency distribution where extreme values occur at low frequency; <em>skew</em> is when one tail is longer than the other.</p>" +
        "<p>The normal distribution suits errors and sample statistics, but rarely the distribution of raw data. Data may be highly <em>skewed</em> (asymmetric), like income, or discrete, like binomial data. Both symmetric and asymmetric distributions can have <em>long tails</em> — extreme small and large values. Nassim Taleb's <em>black swan</em> theory predicts that anomalous events, such as a stock market crash, are far more likely than the normal distribution would suggest.</p>" },
      { h: "Stock returns example", body:
        "<p>The book illustrates long tails with daily Netflix (NFLX) stock returns via a QQ-plot (Figure 2-12). In contrast to a normal sample, the points fall far <em>below</em> the line for low values and far <em>above</em> it for high values — meaning extreme values occur much more often than a normal distribution predicts.</p>" +
        "<p>The middle of the distribution still hugs the line: the points stay near the diagonal within about one standard deviation of the mean. Tukey called this data being \"normal in the middle\" but having much longer tails.</p>" }
    ],
    takeaways: [
      "A tail is the rare-extreme region; skew is one tail being longer than the other.",
      "Most real data is not normal — assuming so underestimates extreme events.",
      "Netflix returns QQ-plot bows away from the line at both ends: fat tails.",
      "Data can be 'normal in the middle' yet have much longer tails (Tukey)."
    ]
  });
  window.CODEVIZ["ps-ch2-long-tailed-distributions"] = { charts: [ {
    type: "scatter",
    title: "QQ-plot of Netflix returns shows fat tails",
    interpret: "Reconstruction of Figure 2-12. The points lie far below the diagonal at the low end and far above it at the high end while tracking the line in the middle — the signature of a long-tailed distribution.",
    xlabel: "theoretical normal quantile",
    ylabel: "standardized return",
    groups: [ { name: "NFLX returns", color: "#ffb454", points: [[-3.4,-6.5],[-3.0,-5.2],[-2.6,-3.6],[-2.0,-2.3],[-1.4,-1.2],[-0.7,-0.5],[0,0.05],[0.7,0.6],[1.4,1.3],[2.0,2.4],[2.6,3.8],[3.0,5.0],[3.4,6.1]] } ],
    lines: [ { name: "y = x", color: "#8b949e", points: [[-3.4,-3.4],[3.4,3.4]] } ]
  } ] };

  // 8. Student's t-Distribution
  B({
    id: "ps-ch2-students-t-distribution",
    chapter: "Chapter 2",
    title: "Students t-Distribution",
    tagline: "A normal-shaped curve with thicker tails for the distribution of sample means.",
    sections: [
      { h: "What it is", body:
        "<p>The <em>t-distribution</em> is shaped like the normal distribution but a bit thicker and longer in the tails. It is used heavily to depict distributions of sample statistics: distributions of sample means are typically t-shaped. It is really a <em>family</em> of distributions, differing by how large the sample is — the larger the sample, the more normal the t-distribution becomes.</p>" +
        "<p>Two terms: $n$ is the sample size, and <em>degrees of freedom</em> is a parameter that lets the t-distribution adjust to different sample sizes, statistics, and numbers of groups.</p>" },
      { h: "Gossett and the Guinness brewery", body:
        "<p>It is called <em>Student's t</em> because W. S. Gossett published it in 1908 in <em>Biometrika</em> under the pen name \"Student\" — his employer, the Guinness brewery, did not want competitors to know it used statistical methods, so he could not use his own name.</p>" +
        "<p>Gossett asked: what is the sampling distribution of the mean of a sample drawn from a larger population? He ran a resampling experiment, drawing random samples of 4 from a data set of 3,000 measurements of criminals' height and left-middle-finger lengths, plotted the standardized results (z-scores), and fit his derived t-function over them (Figure 2-13).</p>" },
      { h: "Confidence interval with the t-distribution", body:
        "<p>After standardizing, statistics can be compared to the t-distribution to build confidence intervals that account for sampling variation. For a sample of size $n$ with mean $\\bar{x}$ and sample standard deviation $s$, a 90% confidence interval around the mean is:</p>" +
        "<p>$\\bar{x} \\pm t_{n-1}(.05) \\times \\dfrac{s}{\\sqrt{n}}$</p>" +
        "<p>Here $t_{n-1}(.05)$ is the t-statistic value, with $(n-1)$ degrees of freedom, that chops off 5% of the t-distribution at each end. The t-distribution serves as a reference for the distribution of a sample mean, the difference between two sample means, regression parameters, and more.</p>" +
        "<p>The book's note: had computers been available in 1908, statistics might have leaned on resampling from the start. Lacking them, statisticians turned to functions like the t-distribution to approximate sampling distributions. Its accuracy relies on the sample statistic being normally shaped — which holds often even when the population is not, by the central limit theorem.</p>" }
    ],
    takeaways: [
      "The t-distribution is normal-shaped with thicker tails; it is a family indexed by sample size.",
      "Published by Gossett ('Student') in 1908 while at the Guinness brewery.",
      "A 90% t-interval for the mean: $\\bar{x} \\pm t_{n-1}(.05)\\,s/\\sqrt{n}$.",
      "Degrees of freedom ($n-1$) tune it; larger samples make it more normal."
    ]
  });

  // 9. Binomial Distribution
  B({
    id: "ps-ch2-binomial-distribution",
    chapter: "Chapter 2",
    title: "Binomial Distribution",
    tagline: "Counting successes in a fixed number of yes/no trials.",
    sections: [
      { h: "Trials, successes, and outcomes", body:
        "<p>Yes/no (binomial) outcomes sit at the heart of analytics — buy/don't buy, click/don't click, survive/die. Key terms: a <em>trial</em> is an event with a discrete outcome (a coin flip); a <em>success</em> is the outcome of interest, coded \"1\"; <em>binomial</em> means having two outcomes (yes/no, 0/1, binary); a <em>binomial (Bernoulli) trial</em> has two outcomes; the <em>binomial distribution</em> is the distribution of the number of successes in $x$ trials.</p>" +
        "<p>The two outcomes need not be 50/50 — any probabilities summing to 1.0 work. By convention the \"1\" is the <em>success</em>, often assigned to the rarer outcome (loan defaults, fraud), without implying the outcome is desirable.</p>" },
      { h: "The binomial distribution and worked numbers", body:
        "<p>The binomial distribution is the frequency distribution of the number of successes ($x$) in a given number of trials ($n$) with a specified success probability ($p$) per trial. It answers questions like: if the probability of a click converting to a sale is 0.02, what is the probability of 0 sales in 200 clicks?</p>" +
        "<p>The book's R examples (which we recompute to confirm):</p>" +
        "<table class='extable'>" +
        "<thead><tr><th>question</th><th>R call</th><th class='num'>result</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class='row-h'>exactly 2 successes, n=5, p=0.1</td><td>dbinom(2, 5, 0.1)</td><td class='num'>0.0729</td></tr>" +
        "<tr><td class='row-h'>2 or fewer successes, n=5, p=0.1</td><td>pbinom(2, 5, 0.1)</td><td class='num'>0.9914</td></tr>" +
        "</tbody></table>" +
        "<ul class='steps'>" +
        "<li>Exactly 2 of 5: choose 2 of 5 ways = 10; times $0.1^2 = 0.01$; times $0.9^3 = 0.729$. $10 \\times 0.01 \\times 0.729 = 0.0729$.</li>" +
        "<li>2 or fewer = P(0) + P(1) + P(2) $= 0.59049 + 0.32805 + 0.0729 = 0.99144 \\approx 0.9914$.</li>" +
        "</ul>" },
      { h: "Mean, variance, and the normal approximation", body:
        "<p>The mean of a binomial distribution is $n \\times p$ — the expected number of successes in $n$ trials. The variance is $n \\times p \\times (1 - p)$.</p>" +
        "<p>With a large enough number of trials (especially when $p$ is near 0.50), the binomial distribution is virtually indistinguishable from the normal distribution. Because exact binomial probabilities are computationally demanding at large sample sizes, most statistical procedures use the normal distribution, with this mean and variance, as an approximation.</p>" }
    ],
    takeaways: [
      "Binomial: number of successes in n yes/no trials with success probability p.",
      "dbinom(2,5,0.1) = 0.0729 (exactly 2); pbinom(2,5,0.1) = 0.9914 (2 or fewer).",
      "Mean = $n p$; variance = $n p (1-p)$.",
      "For large n with p not near 0 or 1, the normal distribution approximates it."
    ]
  });
  window.CODEVIZ["ps-ch2-binomial-distribution"] = { charts: [ {
    type: "bars",
    title: "Binomial probabilities for n=5, p=0.1",
    interpret: "From the book's example. Probability of x successes in 5 trials at p=0.1: P(2)=0.0729 (the dbinom result) and P(0)+P(1)+P(2)=0.9914 (the pbinom result).",
    labels: ["0", "1", "2", "3", "4", "5"],
    values: [0.59049, 0.32805, 0.0729, 0.0081, 0.00045, 0.00001],
    valueLabels: ["0.590", "0.328", "0.073", "0.008", "0.000", "0.000"],
    colors: ["#4ea1ff", "#4ea1ff", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
  } ] };

  // 10. Poisson and Related Distributions
  B({
    id: "ps-ch2-poisson-related-distributions",
    chapter: "Chapter 2",
    title: "Poisson and Related Distributions",
    tagline: "Modeling random events that occur at some rate over time or space.",
    sections: [
      { h: "Events at a rate, and the key terms", body:
        "<p>Many processes produce events randomly at a given overall rate — visitors arriving at a website, cars at a toll plaza (spread over time), imperfections in a square meter of fabric, or typos per 100 lines of code (spread over space). The book groups several related distributions:</p>" +
        "<ul>" +
        "<li><strong>Lambda</strong> — the rate (per unit of time or space) at which events occur.</li>" +
        "<li><strong>Poisson distribution</strong> — the frequency distribution of the number of events in sampled units of time or space.</li>" +
        "<li><strong>Exponential distribution</strong> — the frequency distribution of the time or distance from one event to the next.</li>" +
        "<li><strong>Weibull distribution</strong> — a generalized exponential where the event rate may shift over time.</li>" +
        "</ul>" },
      { h: "Poisson distribution", body:
        "<p>The Poisson distribution tells us how the number of events per unit of time or space varies when we sample many such units. It is useful for queuing questions like \"how much capacity do we need to be 95% sure of fully processing the internet traffic arriving on a server in any 5-second period?\"</p>" +
        "<p>Its key parameter is $\\lambda$ (lambda), the mean number of events in a specified interval; the variance is also $\\lambda$. In R, <code>rpois(100, lambda = 2)</code> generates 100 random Poisson values with $\\lambda = 2$ — for example, if customer-service calls average 2 per minute, this simulates 100 minutes and returns the number of calls in each.</p>" },
      { h: "Exponential distribution", body:
        "<p>Using the same $\\lambda$, the <em>exponential distribution</em> models the time between events: time between website visits, time between cars at a toll plaza, time to failure in engineering, or time per service call. In R, <code>rexp(n = 100, rate = .2)</code> generates 100 values from an exponential distribution where the mean rate is 0.2 per time period — e.g., simulating 100 intervals (in minutes) between service calls when calls average 0.2 per minute.</p>" +
        "<p>A key assumption for both Poisson and exponential simulation is that the rate $\\lambda$ stays constant over the period considered. That rarely holds globally (road or network traffic varies by time of day), but periods can usually be divided into segments homogeneous enough for valid analysis.</p>" },
      { h: "Estimating the failure rate", body:
        "<p>Often the event rate $\\lambda$ is known or can be estimated from prior data, but for rare events it may not be. The book's example: aircraft engine failure is rare enough that there may be little data on time between failures for a given engine type.</p>" +
        "<p>With no data, you can still make educated guesses — if no events have occurred after 20 hours, the rate is probably not 1 per hour. Via simulation or direct probability calculation, you can test hypothetical event rates and estimate threshold values below which the true rate is very unlikely to fall. With some (but not enough) data, a goodness-of-fit test like the chi-square test can assess how well candidate rates fit the observed data.</p>" },
      { h: "Weibull distribution", body:
        "<p>When the event rate does <em>not</em> stay constant — as in mechanical failure, where the risk of failure rises as time goes by — the exponential and Poisson distributions no longer apply. The <em>Weibull distribution</em> extends the exponential by letting the event rate change, controlled by a <em>shape parameter</em> $\\beta$ (beta). If $\\beta > 1$ the event probability increases over time; if $\\beta &lt; 1$ it decreases.</p>" +
        "<p>Because Weibull is used for time-to-failure rather than event rate, its second parameter is expressed as <em>characteristic life</em> (also called the <em>scale</em> parameter), written $\\eta$ (eta), instead of a rate. Estimation involves both $\\beta$ and $\\eta$, usually fit by software. In R, <code>rweibull(100, 1.5, 5000)</code> generates 100 lifetimes from a Weibull distribution with shape 1.5 and characteristic life 5,000.</p>" }
    ],
    takeaways: [
      "Poisson: number of events per unit time/space; parameter $\\lambda$, with variance also $\\lambda$.",
      "Exponential: time or distance between successive events, using the same $\\lambda$.",
      "For rare events with little data, simulate rates or use a goodness-of-fit (chi-square) test.",
      "Weibull generalizes the exponential to a changing rate via shape $\\beta$ and scale $\\eta$."
    ]
  });
})();
