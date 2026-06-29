/* "Practical Statistics for Data Scientists" (Bruce & Bruce, O'Reilly 2017)
   Chapter 1 — Exploratory Data Analysis.
   Self-registering IIFE fragment. One lesson per named concept/section. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Practical Statistics";
  const BOOK = "Practical Statistics for Data Scientists";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1) Elements of Structured Data
  B({
    id: "ps-ch1-structured-data",
    chapter: "Chapter 1",
    title: "Elements of Structured Data",
    tagline: "Raw data must be shaped into a few well-defined types before statistics can be applied.",
    sections: [
      {
        h: "Why a taxonomy of data types",
        body: "Data arrives from many sources — sensors, events, text, images, video, clickstreams — and much of it is unstructured. To use the methods in this book, that raw material must be processed into a structured form, as it would appear in a relational table. The authors stress that the data type of each variable is not a bookkeeping detail: it tells the software how to display, analyze, and model that variable, and how to handle computations on it. Knowing a variable is categorical, for example, signals software to produce the right chart or fit the right model, lets storage and indexing be optimized, and lets the allowed values be enforced like an enum."
      },
      {
        h: "The two basic types and their forms",
        body: "There are two basic types of structured data: <em>numeric</em> and <em>categorical</em>. Numeric data comes in two forms, and categorical data has a binary special case plus an ordered form.<table class=\"extable\"><thead><tr><th>type</th><th>meaning</th><th>synonyms</th></tr></thead><tbody><tr><td class=\"row-h\">Continuous</td><td>any value in an interval (wind speed, time duration)</td><td>interval, float, numeric</td></tr><tr><td class=\"row-h\">Discrete</td><td>only integer values, such as counts</td><td>integer, count</td></tr><tr><td class=\"row-h\">Categorical</td><td>only a fixed set of category values (TV type, state name)</td><td>enums, enumerated, factors, nominal, polychotomous</td></tr><tr><td class=\"row-h\">Binary</td><td>categorical with just two values (0/1, true/false)</td><td>dichotomous, logical, indicator, boolean</td></tr><tr><td class=\"row-h\">Ordinal</td><td>categorical with an explicit ordering (a 1–5 rating)</td><td>ordered factor</td></tr></tbody></table>The authors note one practical gotcha: R's default data-import behavior turns a text column into a factor, so later operations assume only the originally seen values are allowed, and a new value produces a warning and an NA."
      }
    ],
    takeaways: [
      "Structured data is either numeric (continuous or discrete) or categorical (which includes binary).",
      "Ordinal data is categorical data with an explicit ordering.",
      "The data type acts as a signal telling software how to process and model a variable."
    ]
  });

  // 2) Rectangular Data
  B({
    id: "ps-ch1-rectangular-data",
    chapter: "Chapter 1",
    title: "Rectangular Data",
    tagline: "A two-dimensional table of rows and columns is the fundamental object of data science.",
    sections: [
      {
        h: "Rows, columns, and the vocabulary",
        body: "The typical frame of reference for an analysis is a <em>rectangular data</em> object — a spreadsheet or database table — essentially a two-dimensional matrix where rows are records and columns are features. The book warns that terminology varies by discipline, so it pins down its own words.<table class=\"extable\"><thead><tr><th>term</th><th>meaning</th><th>synonyms</th></tr></thead><tbody><tr><td class=\"row-h\">Feature</td><td>a column in the table</td><td>attribute, input, predictor, variable</td></tr><tr><td class=\"row-h\">Outcome</td><td>the thing being predicted, often yes/no</td><td>dependent variable, response, target, output</td></tr><tr><td class=\"row-h\">Record</td><td>a row in the table</td><td>case, example, instance, observation, pattern, sample</td></tr></tbody></table>A particularly confusing clash: to a computer scientist <em>sample</em> means a single row, but to a statistician a <em>sample</em> is a collection of rows. The book's Table 1-1 mixes measured/counted fields (Duration, ClosePrice) with categorical fields (Category, currency) and a binary indicator in the last column showing whether an auction was competitive."
      },
      {
        h: "Data frames and indexes",
        body: "Traditional database tables designate one or more columns as an index to speed up queries. In Python the basic rectangular structure is the pandas <code>DataFrame</code>, which by default gets an automatic integer index based on row order and can also take multilevel/hierarchical indexes. In R the structure is <code>data.frame</code>, which likewise has an implicit integer index by row order; a custom key can be set via <code>row.names</code>, but native R does not support user-specified or multilevel indexes. The packages <code>data.table</code> and <code>dplyr</code> add multilevel indexes and meaningful speedups. The chapter also notes nonrectangular structures — time series, spatial (object vs. field views), and graph/network data — but the book focuses on rectangular data as the building block of predictive modeling."
      }
    ],
    takeaways: [
      "Rectangular data is a matrix of records (rows) and features (columns).",
      "Feature, outcome, and record each carry several discipline-specific synonyms — 'sample' is especially ambiguous.",
      "pandas DataFrame and R data.frame are the standard rectangular structures, both with an implicit row index."
    ]
  });

  // 3) Estimates of Location
  B({
    id: "ps-ch1-location",
    chapter: "Chapter 1",
    title: "Estimates of Location",
    tagline: "A typical value summarizes where most of the data sits — but the mean is not the only choice.",
    sections: [
      {
        h: "Mean, trimmed mean, weighted mean",
        body: "The first step in exploring a variable is finding a typical value — an estimate of central tendency. The most basic is the <em>mean</em> (average), the sum of all values divided by their count. For the set {3, 5, 1, 2} the mean is $\\bar{x} = (3+5+1+2)/4 = 11/4 = 2.75$. The general formula for $n$ values is $\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$.<ul class=\"steps\"><li><strong>Trimmed mean</strong>: drop a fixed number $p$ of the smallest and largest sorted values, then average the rest: $\\bar{x} = \\frac{1}{n-2p}\\sum_{i=p+1}^{n-p} x_{(i)}$. It removes the influence of extreme values — the book's example is international diving, where the top and bottom of five judges' scores are dropped so no single judge can manipulate the result.</li><li><strong>Weighted mean</strong>: multiply each value by a weight $w_i$ and divide by the sum of weights: $\\bar{x}_w = \\frac{\\sum w_i x_i}{\\sum w_i}$. Two motivations are given — downweighting intrinsically noisier observations (e.g. a less-accurate sensor), and upweighting groups that were underrepresented in the collected data.</li></ul>"
      },
      {
        h: "Median and robust estimates",
        body: "The <em>median</em> is the middle value of the sorted data (with an even count, the average of the two middle values). Unlike the mean, it depends only on the center of the sorted data, which makes it <em>robust</em> — not influenced by <em>outliers</em>. The book's intuition: comparing typical household incomes near Lake Washington, the mean for the Medina neighborhood is distorted because Bill Gates lives there, but the median is unaffected since the middle observation's position does not move no matter how rich he is. A <em>weighted median</em> is the value where half the sum of the weights lies on each side of the sorted data, and it too is robust to outliers. The trimmed mean (commonly trimming the top and bottom 10%) is a compromise: robust to extremes like the median, but using more of the data than the median does."
      },
      {
        h: "Worked example — population and murder rates",
        body: "The book's <code>state</code> data set holds each state's population and murder rate (murders per 100,000 people per year). Computing three estimates of location for population in R gives:<table class=\"extable\"><thead><tr><th>estimate</th><th class=\"num\">population</th></tr></thead><tbody><tr><td class=\"row-h\">mean</td><td class=\"num\">6,162,876</td></tr><tr><td class=\"row-h\">trimmed mean (trim = 0.1)</td><td class=\"num\">4,783,697</td></tr><tr><td class=\"row-h\">median</td><td class=\"num\">4,436,370</td></tr></tbody></table><ul class=\"steps\"><li>The mean is bigger than the trimmed mean, which is bigger than the median.</li><li>The trimmed mean drops the five largest and five smallest states (10% from each end), pulling the estimate below the mean.</li><li>For an overall murder rate the states must be weighted by population: the weighted mean is 4.45 and the weighted median is 4.4 — in this case about the same.</li></ul>"
      }
    ],
    takeaways: [
      "Mean of {3,5,1,2} = 2.75; it is easy but sensitive to outliers.",
      "Trimmed mean and median are robust; the median ignores all but the central values.",
      "For state population: mean 6,162,876 > trimmed mean 4,783,697 > median 4,436,370."
    ]
  });
  window.CODEVIZ["ps-ch1-location"] = {
    charts: [
      {
        type: "bars",
        title: "Three location estimates for state population",
        interpret: "Mean > trimmed mean > median: the right-skewed populations pull the mean upward while robust estimates stay lower.",
        labels: ["mean", "trimmed mean", "median"],
        values: [6162876, 4783697, 4436370],
        colors: ["#ffb454", "#4ea1ff", "#7ee787"]
      }
    ]
  };

  // 4) Estimates of Variability
  B({
    id: "ps-ch1-variability",
    chapter: "Chapter 1",
    title: "Estimates of Variability",
    tagline: "Variability measures whether data is tightly clustered or spread out — and like location, it has many estimates.",
    sections: [
      {
        h: "Deviations, variance, standard deviation, MAD",
        body: "Variability (also called dispersion) is the second dimension of summarizing a feature. Most estimates start from <em>deviations</em>: the differences between observed values and an estimate of location. For {1, 4, 4} the mean is 3, so the deviations are $1-3=-2$, $4-3=1$, $4-3=1$. The deviations sum to zero, so simply averaging them tells us nothing; two fixes are used.<ul class=\"steps\"><li><strong>Mean absolute deviation</strong>: average the absolute deviations. Here $|{-2}|, |1|, |1| = \\{2, 1, 1\\}$, average $(2+1+1)/3 = 1.33$. Formula: $\\frac{1}{n}\\sum_{i=1}^{n} |x_i - \\bar{x}|$.</li><li><strong>Variance</strong>: average the <em>squared</em> deviations, dividing by $n-1$: $s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n-1}$.</li><li><strong>Standard deviation</strong>: the square root of the variance, $s = \\sqrt{s^2}$, on the same scale as the data and easier to interpret.</li></ul>The book explains the $n-1$ denominator via degrees of freedom: dividing by $n$ underestimates the population variance (a biased estimate), while $n-1$ gives an unbiased estimate, reflecting the one constraint that the sample mean was already used. None of variance, standard deviation, or mean absolute deviation is robust to outliers; the squared deviations make variance and SD especially sensitive. A robust alternative is the <em>median absolute deviation from the median</em> (MAD): $\\text{MAD} = \\text{Median}(|x_1 - m|, \\ldots, |x_N - m|)$, where $m$ is the median."
      },
      {
        h: "Estimates based on percentiles",
        body: "A different approach looks at the spread of the sorted (ranked) data — <em>order statistics</em>. The simplest is the <em>range</em>: largest minus smallest. The range is very sensitive to outliers, so a better measure drops values from each end using <em>percentiles</em>. The $P$th percentile is a value such that at least $P$ percent of values are at or below it and at least $(100-P)$ percent at or above it; the median is the 50th percentile. The <em>interquartile range</em> (IQR) is the 75th percentile minus the 25th. The book's small example: sort 3, 1, 5, 3, 6, 7, 2, 9 to get 1, 2, 3, 3, 5, 6, 7, 9; the 25th percentile is 2.5 and the 75th is 6.5, so $\\text{IQR} = 6.5 - 2.5 = 4$."
      },
      {
        h: "Worked example — state population variability",
        body: "Using R's built-in functions on the state population data:<table class=\"extable\"><thead><tr><th>estimate</th><th class=\"num\">population</th></tr></thead><tbody><tr><td class=\"row-h\">standard deviation (sd)</td><td class=\"num\">6,848,235</td></tr><tr><td class=\"row-h\">interquartile range (IQR)</td><td class=\"num\">4,847,308</td></tr><tr><td class=\"row-h\">median absolute deviation (mad)</td><td class=\"num\">3,849,870</td></tr></tbody></table>The standard deviation is almost twice as large as the MAD (R scales the MAD to match the SD scale for a normal distribution). This is expected because the standard deviation is sensitive to outliers and the MAD is not."
      }
    ],
    takeaways: [
      "Variance averages squared deviations over n-1; standard deviation is its square root, on the data's scale.",
      "For {1,4,4} the mean absolute deviation is 1.33; for 1,2,3,3,5,6,7,9 the IQR is 4.",
      "MAD and percentile-based ranges are robust; SD is roughly twice the MAD on the state data because SD reacts to outliers."
    ]
  });
  window.CODEVIZ["ps-ch1-variability"] = {
    charts: [
      {
        type: "bars",
        title: "Three variability estimates for state population",
        interpret: "Standard deviation is far larger than the robust MAD because the very populous states inflate the squared deviations.",
        labels: ["sd", "IQR", "mad"],
        values: [6848235, 4847308, 3849870],
        colors: ["#ffb454", "#4ea1ff", "#7ee787"]
      }
    ]
  };

  // 5) Exploring the Data Distribution
  B({
    id: "ps-ch1-distribution",
    chapter: "Chapter 1",
    title: "Exploring the Data Distribution",
    tagline: "Beyond single summaries, plots reveal how the whole data is distributed.",
    sections: [
      {
        h: "Percentiles and boxplots",
        body: "Single numbers summarize location or spread, but it is also useful to see how the data is distributed overall. Percentiles summarize the entire distribution: it is common to report the quartiles (25th, 50th, 75th) and deciles (10th, 20th, …, 90th), and percentiles are especially valuable for the tails. The book's quartiles of the state murder rate are:<table class=\"extable\"><thead><tr><th class=\"num\">5%</th><th class=\"num\">25%</th><th class=\"num\">50%</th><th class=\"num\">75%</th><th class=\"num\">95%</th></tr></thead><tbody><tr><td class=\"num\">1.60</td><td class=\"num\">2.42</td><td class=\"num\">4.00</td><td class=\"num\">5.55</td><td class=\"num\">6.51</td></tr></tbody></table>The median is 4 murders per 100,000 people, but there is much variability: the 5th percentile is only 1.6 and the 95th is 6.51. A <em>boxplot</em>, introduced by Tukey, is built from these percentiles: the top and bottom of the box are the 75th and 25th percentiles, a line marks the median, and dashed <em>whiskers</em> extend to show the bulk of the range. By default R extends a whisker to the furthest point within 1.5 times the IQR of the box; anything beyond is plotted as an individual point. Figure 1-2 boxplots state populations (in millions) and clearly flags several large states as points above the upper whisker."
      },
      {
        h: "Frequency tables and histograms",
        body: "A <em>frequency table</em> divides a variable's range into equally spaced bins (segments) and counts how many values fall in each. The book bins state population into 10 equal-width bins. The least populous state is Wyoming (563,626) and the most populous is California (37,253,956), a range of $37{,}253{,}956 - 563{,}626 = 36{,}690{,}330$, giving a bin width of about 3,669,033. Each value falls in one bin:<table class=\"extable\"><thead><tr><th class=\"row-h\">bin</th><th>population range</th><th class=\"num\">count</th></tr></thead><tbody><tr><td class=\"row-h\">1</td><td>563,626 – 4,232,658</td><td class=\"num\">24</td></tr><tr><td class=\"row-h\">2</td><td>4,232,659 – 7,901,691</td><td class=\"num\">14</td></tr><tr><td class=\"row-h\">3</td><td>7,901,692 – 11,570,724</td><td class=\"num\">6</td></tr><tr><td class=\"row-h\">4</td><td>11,570,725 – 15,239,757</td><td class=\"num\">2</td></tr><tr><td class=\"row-h\">5</td><td>15,239,758 – 18,908,790</td><td class=\"num\">1</td></tr><tr><td class=\"row-h\">6</td><td>18,908,791 – 22,577,823</td><td class=\"num\">1</td></tr><tr><td class=\"row-h\">7</td><td>22,577,824 – 26,246,856</td><td class=\"num\">1</td></tr><tr><td class=\"row-h\">8</td><td>26,246,857 – 29,915,889</td><td class=\"num\">0</td></tr><tr><td class=\"row-h\">9</td><td>29,915,890 – 33,584,922</td><td class=\"num\">0</td></tr><tr><td class=\"row-h\">10</td><td>33,584,923 – 37,253,956</td><td class=\"num\">1</td></tr></tbody></table>A <em>histogram</em> plots this frequency table with bins on the x-axis and counts on the y-axis. Empty bins (here bins 8 and 9) are kept, because the absence of values is itself informative — Texas sits in bin 7 and California alone in bin 10, with two empty bins between them."
      },
      {
        h: "Density estimates",
        body: "A <em>density plot</em> shows the distribution as a continuous line — a smoothed histogram — computed directly from the data through a kernel density estimate. The key difference from the count histogram is the y-axis: a density plot plots proportions rather than counts (R's <code>freq=FALSE</code>). The book superimposes a density estimate on a histogram of the state murder rate (Figure 1-4), and both reveal a bimodal shape with peaks near murder rates of about 2 and 5 per 100,000."
      }
    ],
    takeaways: [
      "Murder-rate percentiles: 5% 1.60, 25% 2.42, 50% 4.00, 75% 5.55, 95% 6.51 — median 4 with wide tails.",
      "A boxplot is built from quartiles; R's whiskers stop within 1.5 IQR, beyond which points are outliers.",
      "Frequency tables/histograms use equal-width bins and keep empty bins; density plots are smoothed histograms on a proportion scale."
    ]
  });
  window.CODEVIZ["ps-ch1-distribution"] = {
    charts: [
      {
        type: "hist",
        title: "Histogram of state populations (reconstruction of Figure 1-3)",
        interpret: "Right-skewed: 24 states fall in the smallest bin and counts drop off sharply, with California isolated in the top bin.",
        labels: ["0–4.2M", "4.2–7.9M", "7.9–11.6M", "11.6–15.2M", "15.2–18.9M", "18.9–22.6M", "22.6–26.2M", "26.2–29.9M", "29.9–33.6M", "33.6–37.3M"],
        values: [24, 14, 6, 2, 1, 1, 1, 0, 0, 1],
        colors: ["#4ea1ff"]
      },
      {
        type: "bars",
        title: "Percentiles of state murder rate (Table 1-4)",
        interpret: "The median is 4 per 100,000, but the 5th-to-95th span (1.60 to 6.51) shows substantial variability.",
        labels: ["5%", "25%", "50%", "75%", "95%"],
        values: [1.60, 2.42, 4.00, 5.55, 6.51],
        colors: ["#7ee787", "#7ee787", "#ffb454", "#7ee787", "#7ee787"]
      }
    ]
  };

  // 6) Exploring Binary and Categorical Data
  B({
    id: "ps-ch1-categorical",
    chapter: "Chapter 1",
    title: "Exploring Binary and Categorical Data",
    tagline: "Categorical data is summarized by proportions, a mode, an expected value, and bar charts.",
    sections: [
      {
        h: "Proportions, mode, and bar charts",
        body: "For categorical data, simple proportions or percentages tell the story; summarizing a binary variable is just finding the proportion of 1s. The <em>mode</em> is the most commonly occurring category — the book notes the mode of the cause of delay at Dallas/Fort Worth airport is 'Inbound', and that the mode is generally used for categorical, not numeric, data. A <em>bar chart</em> plots the frequency or proportion of each category as bars, with categories on the x-axis. Table 1-6 gives the percentage of delayed flights at Dallas/Fort Worth by cause since 2010:<table class=\"extable\"><thead><tr><th>cause</th><th class=\"num\">% of delays</th></tr></thead><tbody><tr><td class=\"row-h\">Carrier</td><td class=\"num\">23.02</td></tr><tr><td class=\"row-h\">ATC</td><td class=\"num\">30.40</td></tr><tr><td class=\"row-h\">Weather</td><td class=\"num\">4.03</td></tr><tr><td class=\"row-h\">Security</td><td class=\"num\">0.12</td></tr><tr><td class=\"row-h\">Inbound</td><td class=\"num\">42.43</td></tr></tbody></table>A bar chart resembles a histogram, but in a bar chart the x-axis holds distinct categories (drawn with gaps between bars), whereas a histogram's x-axis is a numeric scale (bars touch). The authors note that statisticians and visualization experts generally avoid pie charts as less informative."
      },
      {
        h: "Expected value",
        body: "When categories map to numeric values, the <em>expected value</em> gives an average weighted by each category's probability — a weighted mean whose weights are probabilities. The book's example: a cloud-service marketer offers a \\$300/month tier and a \\$50/month tier, and estimates that of webinar attendees 5% will buy the \\$300 service, 15% the \\$50 service, and 80% nothing.<ul class=\"steps\"><li>Multiply each outcome by its probability of occurring.</li><li>Sum those products.</li><li>$EV = (0.05)(300) + (0.15)(50) + (0.80)(0) = 15 + 7.5 + 0 = 22.5$ — an expected value of \\$22.50 per attendee per month.</li></ul>The book frames expected value as a fundamental tool in business valuation and capital budgeting."
      }
    ],
    takeaways: [
      "Categorical data is summarized by proportions and visualized with bar charts (gaps between bars, unlike a histogram).",
      "The mode is the most frequent category; at DFW the leading delay cause is Inbound at 42.43%.",
      "Expected value is a probability-weighted mean: (0.05)(300)+(0.15)(50)+(0.80)(0) = \\$22.50."
    ]
  });
  window.CODEVIZ["ps-ch1-categorical"] = {
    charts: [
      {
        type: "bars",
        title: "Airline delays at DFW by cause (reconstruction of Figure 1-5)",
        interpret: "Inbound (42.43%) is the modal cause, followed by ATC (30.40%); Security is negligible at 0.12%.",
        labels: ["Carrier", "ATC", "Weather", "Security", "Inbound"],
        values: [23.02, 30.40, 4.03, 0.12, 42.43],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#ffb454"]
      }
    ]
  };

  // 7) Correlation
  B({
    id: "ps-ch1-correlation",
    chapter: "Chapter 1",
    title: "Correlation",
    tagline: "A single standardized number, and a scatterplot, capture how two numeric variables move together.",
    sections: [
      {
        h: "The correlation coefficient",
        body: "Two variables X and Y are <em>positively correlated</em> if high values of X go with high values of Y (and low with low), and <em>negatively correlated</em> if high X goes with low Y. The book builds intuition with two perfectly aligned vectors, $v_1 = \\{1, 2, 3\\}$ and $v_2 = \\{4, 5, 6\\}$: the sum of their products is $1{\\cdot}4 + 2{\\cdot}5 + 3{\\cdot}6 = 4 + 10 + 18 = 32$, and shuffling either one can never raise that sum above 32. That sum could serve as a metric, but it is hard to interpret. The standardized version is <em>Pearson's correlation coefficient</em>: $r = \\frac{\\sum_{i=1}^{N}(x_i - \\bar{x})(y_i - \\bar{y})}{(N-1)\\,s_x s_y}$, where $s_x$ and $s_y$ are the standard deviations. It always lies between $+1$ (perfect positive) and $-1$ (perfect negative), with 0 meaning no correlation. The authors warn it only captures <em>linear</em> association (the tax-rate-versus-revenue relationship is non-monotone and would fool it) and, like the mean and SD, it is sensitive to outliers."
      },
      {
        h: "Correlation matrix and scatterplots",
        body: "A <em>correlation matrix</em> shows the variables on both rows and columns, with each cell the correlation between two of them; the diagonal is all 1s and the table is symmetric. For daily telecommunication-stock returns (July 2012–June 2015), Verizon (VZ) and AT&T (T) have the highest correlation at 0.678, while the infrastructure company Level Three (LVLT) has the lowest correlations.<table class=\"extable\"><thead><tr><th>pair</th><th class=\"num\">correlation</th></tr></thead><tbody><tr><td class=\"row-h\">T &amp; VZ</td><td class=\"num\">0.678</td></tr><tr><td class=\"row-h\">T &amp; CTL</td><td class=\"num\">0.475</td></tr><tr><td class=\"row-h\">CTL &amp; FTR</td><td class=\"num\">0.420</td></tr><tr><td class=\"row-h\">VZ &amp; LVLT</td><td class=\"num\">0.242</td></tr></tbody></table>A <em>scatterplot</em> is the standard way to visualize two measured variables: x-axis is one variable, y-axis the other, and each point is a record. The book's scatterplot of daily ATT versus Verizon returns (Figure 1-7) shows a strong positive relationship — on most days both stocks move up or down together."
      }
    ],
    takeaways: [
      "For v1={1,2,3}, v2={4,5,6} the sum of products is 32, which shuffling can never beat.",
      "Pearson's r ranges from -1 to +1, captures only linear association, and is sensitive to outliers.",
      "Among telecom stocks, T and VZ are most correlated (0.678); a scatterplot shows each record as a point."
    ]
  });
  window.CODEVIZ["ps-ch1-correlation"] = {
    charts: [
      {
        type: "bars",
        title: "Selected telecom-stock return correlations (Table 1-7)",
        interpret: "AT&T and Verizon move together most tightly (0.678); pairs involving LVLT are the weakest.",
        labels: ["T & VZ", "T & CTL", "CTL & FTR", "VZ & LVLT"],
        values: [0.678, 0.475, 0.420, 0.242],
        colors: ["#7ee787", "#4ea1ff", "#4ea1ff", "#ffb454"]
      }
    ]
  };

  // 8) Exploring Two or More Variables
  B({
    id: "ps-ch1-two-or-more",
    chapter: "Chapter 1",
    title: "Exploring Two or More Variables",
    tagline: "Bivariate and multivariate plots extend EDA to relationships among several variables.",
    sections: [
      {
        h: "Hexagonal binning and contours — numeric vs numeric",
        body: "Scatterplots work for a small number of points (the stock plot had about 750), but with hundreds of thousands of records the plot becomes a solid dark cloud. The book uses the <code>kc_tax</code> data of tax-assessed values for residential properties in King County, Washington; after subsetting to focus on the main part of the data (assessed value under 750,000 and finished area between 100 and 3,500 sq ft) there are 432,733 records. <em>Hexagonal binning</em> (Figure 1-8) groups records into hexagons colored by how many records fall in each, revealing a clear positive relationship between finished square feet and tax-assessed value — plus a faint second cloud above the main one (homes with higher value for the same footage). <em>Contour plots</em> (Figure 1-9) act like a topographical map: each contour band marks a density of points, rising toward a peak, and show the same secondary peak. Heat maps, hexagonal binning, and contour plots are all natural two-dimensional analogs of histograms and density plots."
      },
      {
        h: "Two categorical variables — contingency tables",
        body: "A <em>contingency table</em> tallies counts (and optionally percentages) between two categorical variables. The book cross-tabulates Lending Club personal-loan grade (A high to G low) against loan status (fully paid, current, late, charged off). High-grade loans have a very low late/charge-off rate compared with lower grades.<table class=\"extable\"><thead><tr><th>grade</th><th class=\"num\">fully paid</th><th class=\"num\">current</th><th class=\"num\">late</th><th class=\"num\">charged off</th><th class=\"num\">total</th></tr></thead><tbody><tr><td class=\"row-h\">A</td><td class=\"num\">20,715</td><td class=\"num\">52,058</td><td class=\"num\">494</td><td class=\"num\">1,588</td><td class=\"num\">74,855</td></tr><tr><td class=\"row-h\">B</td><td class=\"num\">31,782</td><td class=\"num\">97,601</td><td class=\"num\">2,149</td><td class=\"num\">5,384</td><td class=\"num\">136,916</td></tr><tr><td class=\"row-h\">G</td><td class=\"num\">655</td><td class=\"num\">2,042</td><td class=\"num\">206</td><td class=\"num\">419</td><td class=\"num\">3,322</td></tr></tbody></table>Reading the row proportions, grade A loans are charged off only about 2.1% of the time versus about 12.6% for grade G — risk rises sharply as grade falls."
      },
      {
        h: "Categorical and numeric, and many variables",
        body: "To compare a numeric variable across categories, <em>boxplots</em> are placed side by side. Figure 1-10 compares the daily percentage of delayed flights across airlines: Alaska stands out with the fewest delays (its upper quartile is below American's lower quartile), while American has the most. A <em>violin plot</em> enhances the boxplot by adding a mirrored density estimate; Figure 1-11 reveals a concentration of values near zero for Alaska that the boxplot does not make obvious, though the boxplot shows outliers more clearly. For more than two variables, the same chart types extend through <em>conditioning</em> (faceting): Figure 1-12 redraws the King County hexbin plot split by zip code, showing that tax-assessed value is much higher in some zip codes (98112, 98105) than others (98108, 98057) — explaining the secondary cluster. This conditioning idea originated with Trellis graphics at Bell Labs."
      }
    ],
    takeaways: [
      "Hexagonal binning and contour plots replace overplotted scatterplots for large numeric-vs-numeric data (432,733 KC records).",
      "Contingency tables tally two categorical variables: loan charge-off rate climbs from ~2.1% (grade A) to ~12.6% (grade G).",
      "Side-by-side boxplots/violin plots compare a numeric variable across categories; conditioning (facets) extends plots to more variables."
    ]
  });
  window.CODEVIZ["ps-ch1-two-or-more"] = {
    charts: [
      {
        type: "bars",
        title: "Loan charge-off rate by grade (from Table 1-8 row proportions)",
        interpret: "Charge-off risk rises steeply as loan grade falls from A (2.1%) to G (12.6%).",
        labels: ["A", "B", "G"],
        values: [2.1, 3.9, 12.6],
        valueLabels: ["2.1%", "3.9%", "12.6%"],
        colors: ["#7ee787", "#4ea1ff", "#ffb454"]
      }
    ]
  };
})();
