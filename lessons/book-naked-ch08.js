/* Naked Statistics (Charles Wheelan) — Chapter 8: The Central Limit Theorem.
   Self-registering book-template lessons, one per key point. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  // 1 — CLT as the engine of inference
  B({
    id: "naked-ch8-engine-of-inference",
    chapter: "Chapter 8",
    title: "The Central Limit Theorem as the Engine of Inference",
    tagline: "It is the power source that lets a small sample speak for a huge population.",
    sections: [
      { h: "Why a tiny sample can settle a big question", body:
        "<p>Statistics can feel like magic. A poll of about a thousand voters can describe a whole presidential election. A test of a hundred chicken breasts can clear or condemn an entire poultry plant. Wheelan asks where this power to generalize comes from, and answers: much of it comes from the central limit theorem.</p>" +
        "<p>He calls the theorem the Lebron James of statistics. It is the power source behind the activities that use a sample to make inferences about a large population. The mechanics combine two tools the book has already covered: probability and proper sampling. They are not actually that mystical once you see them together.</p>" },
      { h: "Four kinds of inference it unlocks", body:
        "<p>Wheelan lists the inferences the theorem makes possible, all explored further in the next chapter:</p>" +
        "<ul class=\"steps\">" +
        "<li>Know a population well, and you can predict any proper sample drawn from it (a principal who knows every student's test scores can predict how 100 random students will score).</li>" +
        "<li>Know a proper sample well, and you can infer the population it came from (a district official tests 100 students per school and judges the whole school). This is how polling works.</li>" +
        "<li>Given a sample and a candidate population, decide whether the sample plausibly came from it (the missing-bus problem).</li>" +
        "<li>Given two samples, decide whether they came from the same population (two crashed buses, marathon vs. sausage festival).</li>" +
        "</ul>" +
        "<p>Points 1 and 2 are mirror images: if a sample usually resembles its population, then a population usually resembles a sample drawn from it. If children look like their parents, parents look like their children.</p>" }
    ],
    takeaways: [
      "The central limit theorem is the power source for using a sample to infer about a population.",
      "It is just probability plus proper sampling working together.",
      "It unlocks four inference moves: population to sample, sample to population, sample vs. population, and sample vs. sample."
    ]
  });

  // 2 — Broken-down bus intuition (a large proper sample resembles the population)
  B({
    id: "naked-ch8-sample-resembles-population",
    chapter: "Chapter 8",
    title: "A Large Sample Resembles Its Population",
    tagline: "The core principle: a properly drawn sample looks like the population it came from.",
    sections: [
      { h: "The broken-down bus", body:
        "<p>A city hosts a marathon. Runners are bused to the start, and one bus goes missing. As a civic leader on the search team you find a broken-down bus full of unhappy passengers who do not speak English. At a glance they look very large; you estimate their average weight is over 220 pounds. You radio that this is the wrong bus, and you are right: it was headed to the International Festival of Sausage.</p>" +
        "<p>Grasping why a quick look at passenger weights tells you they are probably not marathoners is, Wheelan says, the basic idea of the central limit theorem. The rest is fleshing out details.</p>" },
      { h: "Why the snap judgment works", body:
        "<p>The core principle: a large, properly drawn sample will resemble the population it came from. There is sample-to-sample variation, but the chance that a sample deviates massively from its population is very low. Lots of big people run marathons, but most runners are relatively thin, so the odds that so many of the largest runners landed on one bus by chance are tiny. You could be wrong, but probability says you would usually be right.</p>" },
      { h: "Putting a number on the hunch", body:
        "<p>Adding statistical bells and whistles lets us quantify how likely we are to be right. Wheelan previews a calculation: in a marathon field of 10,000 runners with a mean weight of 155 pounds, there is less than a 1-in-100 chance that a random sample of 60 of them would have a mean weight of 220 pounds or more.</p>" +
        "<ul class=\"steps\">" +
        "<li>Population: 10,000 runners, mean weight 155 pounds.</li>" +
        "<li>Sample: 60 runners (one busload).</li>" +
        "<li>Observed bus mean: 220 pounds or more.</li>" +
        "<li>Probability of that by chance: less than 1 in 100, so almost certainly not the marathon bus.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "A large, properly drawn sample rarely deviates massively from its population.",
      "That is why a glance at the heavy passengers justified rejecting the bus as the marathon's.",
      "The intuition becomes a probability: under 1 in 100 that 60 random 155-lb runners average 220+."
    ]
  });

  // 3 — Two samples / same population test (variation between vs within)
  B({
    id: "naked-ch8-two-samples-same-population",
    chapter: "Chapter 8",
    title: "Telling Two Samples Apart",
    tagline: "Compare variation between two groups with variation within each to see if they share a population.",
    sections: [
      { h: "The two-bus collision", body:
        "<p>Now two buses collide, one possibly marathon runners and one possibly sausage enthusiasts. Paramedics give you the weights on each bus, and from weights alone you judge whether both were headed to the same event.</p>" },
      { h: "The numbers", body:
        "<p>Wheelan supplies concrete figures for the two buses:</p>" +
        "<table class=\"extable\">" +
        "<thead><tr><th>Bus</th><th class=\"num\">Mean</th><th class=\"num\">SD</th><th class=\"num\">1 SD below</th><th class=\"num\">1 SD above</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">Skinny bus</td><td class=\"num\">157</td><td class=\"num\">11</td><td class=\"num\">146</td><td class=\"num\">168</td></tr>" +
        "<tr><td class=\"row-h\">Heavy bus</td><td class=\"num\">211</td><td class=\"num\">21</td><td class=\"num\">190</td><td class=\"num\">232</td></tr>" +
        "</tbody></table>" +
        "<p>(A high proportion of each bus falls within one standard deviation of its mean, so 146 to 168 on one bus and 190 to 232 on the other.)</p>" },
      { h: "Between vs. within", body:
        "<p>Forget formulas and use logic: were these two buses drawn from the same population? Almost certainly not. The variation between the two buses is large compared with the variation within each bus. Someone one standard deviation above the mean on the skinny bus weighs 168 pounds, which is less than someone one standard deviation below the mean on the heavy bus, who weighs 190 pounds. The two groups barely overlap, a telltale sign they came from different populations.</p>" }
    ],
    takeaways: [
      "Compare variation between the groups against variation within each group.",
      "Skinny bus: 157 +/- 11 (146-168). Heavy bus: 211 +/- 21 (190-232).",
      "The +1 SD point of one (168) sits below the -1 SD point of the other (190): different populations."
    ]
  });

  // 4 — Sample means are approximately normal regardless of population shape
  B({
    id: "naked-ch8-sample-means-normal",
    chapter: "Chapter 8",
    title: "Sample Means Are Distributed Normally",
    tagline: "Repeated sample means cluster as a bell curve around the population mean, whatever the population's shape.",
    sections: [
      { h: "What the theorem actually says", body:
        "<p>The headline result: the sample means for any population are distributed roughly as a normal distribution around the population mean. Wheelan unpacks it in steps:</p>" +
        "<ul class=\"steps\">" +
        "<li>Take a population, say the marathon field, and a quantity of interest, say weight.</li>" +
        "<li>Draw repeated samples, like many random groups of 60 runners; each sample has its own mean. These are the sample means.</li>" +
        "<li>Most sample means sit very close to the population mean; a few land notably higher, a few notably lower.</li>" +
        "<li>Those sample means form a bell-shaped normal curve around the population mean: 68 percent within one standard deviation, 95 percent within two.</li>" +
        "<li>This holds no matter what the underlying population looks like; the population need not be normal for the sample means to be normal.</li>" +
        "</ul>" },
      { h: "Household income: a skewed population", body:
        "<p>U.S. household income is skewed right; no household earns below $0, while a few earn enormous amounts, giving a long right tail. The median household income is about $51,900 and the mean is about $70,900 (high earners pull the mean rightward).</p>" +
        "<p>Take a random sample of 1,000 households. The best guess for the sample mean is the population mean, about $70,900, because a proper sample looks like America in miniature. Repeated samples of 1,000 cluster around $70,900: a sample mean of $427,000 or $8,000 is possible but highly unlikely. Crucially, even though income itself is skewed, the distribution of the sample means is not skewed; it forms the familiar bell shape around $70,900.</p>" }
    ],
    takeaways: [
      "Repeated sample means form a normal curve centered on the population mean.",
      "The best guess for a single sample mean is the population mean itself.",
      "Income is skewed (median ~$51,900, mean ~$70,900), yet its sample means are not skewed."
    ]
  });

  // 5 — n >= 30 rule of thumb
  B({
    id: "naked-ch8-n-at-least-30",
    chapter: "Chapter 8",
    title: "The Sample Size Must Be at Least 30",
    tagline: "A rule of thumb: the theorem needs samples of at least 30 to hold.",
    sections: [
      { h: "The rule and the reason", body:
        "<p>As a rule of thumb, the sample size must be at least 30 for the central limit theorem to hold. The reasoning is intuitive: a larger sample is less likely to be thrown off by random variation. A sample of 2 can be badly skewed by one unusually large or small person; a sample of 500 will not be unduly swayed by a few extreme individuals.</p>" +
        "<p>Wheelan also notes a companion condition: to treat the sample's standard deviation as a stand-in for the population's, you want a relatively large sample. Statistical fixes exist when these conditions are not met, but they are frosting on the cake; the big picture is simple and powerful.</p>" },
      { h: "Tested on real weights", body:
        "<p>To check the theorem, Wheelan uses the University of Michigan's Americans' Changing Lives study, with detailed weights on several thousand adults. The weight distribution is slightly right-skewed (it is biologically easier to be 100 pounds overweight than 100 pounds underweight), and the mean weight for all adults is 162 pounds. Software drew 100 random samples of 100 people each, and the 100 sample means piled up in a tight bell shape around 162 pounds, just as the theorem predicts.</p>" }
    ],
    takeaways: [
      "Rule of thumb: sample size of at least 30 for the theorem to hold.",
      "Bigger samples resist distortion by a few extreme individuals.",
      "Changing Lives data (mean 162 lb) confirmed the bell-shaped pile of sample means."
    ]
  });

  // 6 — Larger samples tighten the distribution
  B({
    id: "naked-ch8-larger-samples-tighter",
    chapter: "Chapter 8",
    title: "Larger Samples Tighten the Distribution",
    tagline: "The bigger each sample, the more tightly the sample means cluster around the population mean.",
    sections: [
      { h: "More samples and bigger samples", body:
        "<p>Two effects sharpen the picture. The larger the number of samples taken, the more closely their distribution approximates the normal curve. And the larger the size of each sample, the tighter that distribution becomes around the population mean. A bigger sample is less prone to distortion by extreme outliers.</p>" },
      { h: "Three Changing Lives experiments", body:
        "<p>Wheelan shows three sets of 100 sample means from the Changing Lives data (all weights in pounds). The spread shrinks as sample size grows, and shrinks again when sampling a less varied subgroup:</p>" +
        "<ul class=\"steps\">" +
        "<li>n = 20 from the whole population: the widest, most spread-out cluster of sample means.</li>" +
        "<li>n = 100 from the whole population: noticeably tighter around the mean than n = 20.</li>" +
        "<li>n = 100 from women only: the tightest of all, because women's weights vary less; these center on a slightly different mean since the female mean differs from the overall mean.</li>" +
        "</ul>" +
        "<p>The general pattern: sample means cluster more tightly as each sample grows, and cluster less tightly when the underlying population is more spread out.</p>" }
    ],
    takeaways: [
      "More samples make the distribution look more normal.",
      "Bigger samples make the distribution tighter around the population mean.",
      "Spread also depends on the population: less-varied subgroups (women only) give the tightest cluster."
    ]
  });

  // 7 — Standard deviation vs standard error, SE = s / sqrt(n)
  B({
    id: "naked-ch8-standard-error",
    chapter: "Chapter 8",
    title: "Standard Deviation Versus Standard Error",
    tagline: "The standard error is the standard deviation of the sample means, equal to s over the square root of n.",
    sections: [
      { h: "Keeping the two straight", body:
        "<p>The chapter introduces a second measure of dispersion and warns against confusing it with the first:</p>" +
        "<ul class=\"steps\">" +
        "<li>The standard deviation measures dispersion in the underlying population, for example the spread of weights across the whole marathon field.</li>" +
        "<li>The standard error measures the dispersion of the sample means, how tightly repeated sample means cluster around the population mean.</li>" +
        "<li>The link: the standard error is simply the standard deviation of the sample means.</li>" +
        "</ul>" +
        "<p>A large standard error means the sample means are spread out widely; a small one means they are clustered tightly.</p>" },
      { h: "The formula", body:
        "<p>The standard error follows naturally from this logic:</p>" +
        "<p>$SE = \\frac{s}{\\sqrt{n}}$</p>" +
        "<p>Here $s$ is the standard deviation of the population the sample is drawn from, and $n$ is the size of the sample. Don't let the letters obscure the intuition. The standard deviation $s$ sits in the numerator because a more dispersed population produces more dispersed sample means, so the standard error grows when $s$ grows. The sample size $n$ sits in the denominator because larger samples resist distortion by outliers, so the standard error shrinks as $n$ grows. (Why the square root of $n$ specifically is left for a more advanced text.)</p>" +
        "<p>When the population standard deviation is unknown, for large samples we treat the sample's standard deviation as a close stand-in for the population's.</p>" }
    ],
    takeaways: [
      "Standard deviation describes the population; standard error describes the sample means.",
      "Standard error is the standard deviation of the sample means.",
      "SE = s / sqrt(n): bigger s widens it, bigger n shrinks it."
    ]
  });

  // 8 — Applying 68-95-99.7 to sample means to quantify confidence and reject a hypothesis
  B({
    id: "naked-ch8-confidence-and-rejection",
    chapter: "Chapter 8",
    title: "Quantifying Confidence and Rejecting a Hypothesis",
    tagline: "Because sample means are normal, the 68-95-99.7 rule turns a hunch into a confidence level.",
    sections: [
      { h: "The payoff", body:
        "<p>Because the sample means are distributed normally, we can use the normal curve. Roughly 68 percent of sample means lie within one standard error of the population mean, 95 percent within two standard errors, and 99.7 percent within three. The further a sample mean sits from the population mean (in standard errors), the less plausible it is that the sample came from that population, and the more confidently we can reject that idea.</p>" },
      { h: "The crashed bus, with numbers", body:
        "<p>A Changing Lives bus crashes; paramedics report the mean weight of its 62 passengers is 194 pounds. You know the population mean is 162 pounds with a standard deviation of 36 pounds. Compute the standard error for a 62-person sample:</p>" +
        "<ul class=\"steps\">" +
        "<li>$SE = \\frac{s}{\\sqrt{n}} = \\frac{36}{\\sqrt{62}}$</li>" +
        "<li>$\\sqrt{62} \\approx 7.9$</li>" +
        "<li>$SE = \\frac{36}{7.9} \\approx 4.6$ pounds</li>" +
        "<li>Gap between sample mean and population mean: $194 - 162 = 32$ pounds.</li>" +
        "<li>In standard errors: $\\frac{32}{4.6} \\approx 7$, well more than three standard errors.</li>" +
        "</ul>" +
        "<p>Since 99.7 percent of sample means lie within three standard errors of the population mean, a sample more than three away is extremely unlikely to be a random group of Changing Lives participants. You can reject the idea that this is the missing study bus at the 99.7 percent confidence level, offering statistical evidence rather than just a hunch.</p>" },
      { h: "The marathon hunch, restated", body:
        "<p>Earlier in the chapter the same logic gives the marathon figures: 99 times out of 100 the mean weight of a random bus of marathoners falls within nine pounds of the field's mean. The broken-down bus was twenty-one pounds heavier, something expected by chance less than 1 time in 100, so you reject the missing-marathon-bus hypothesis with 99 percent confidence, while accepting you will be wrong about 1 time in 100.</p>" }
    ],
    takeaways: [
      "68 / 95 / 99.7 percent of sample means lie within 1 / 2 / 3 standard errors of the population mean.",
      "Crashed bus: SE = 36/sqrt(62) ~ 4.6; the 32-lb gap is ~7 SE, so reject at 99.7% confidence.",
      "The less likely an outcome is by chance, the more confident we are another factor is in play."
    ]
  });

  // Chart: how the spread of sample means shrinks with n (Changing Lives histograms, n=20 vs n=100)
  window.CODEVIZ["naked-ch8-larger-samples-tighter"] = {
    charts: [{
      type: "bars",
      title: "100 Sample Means: n = 20 vs n = 100 (Changing Lives weights)",
      interpret: "Both pile up near the 162-lb population mean, but the n = 100 samples are far tighter. Bigger samples shrink the standard error. (Illustrative frequencies read from the book's histograms.)",
      labels: ["148", "152", "156", "160", "164", "168", "172", "176", "180"],
      values: [2, 6, 12, 11, 12, 8, 5, 4, 1],
      valueLabels: ["", "", "", "", "", "", "", "", ""],
      colors: ["#4ea1ff"]
    }, {
      type: "bars",
      title: "100 Sample Means, n = 100",
      interpret: "With n = 100 the sample means concentrate in a narrow band around 162 lb, the tight bell the central limit theorem predicts. (Illustrative frequencies read from the book's histogram.)",
      labels: ["148", "152", "156", "160", "164", "168", "172"],
      values: [1, 0, 4, 22, 25, 11, 2],
      colors: ["#7ee787"]
    }]
  };

  // Chart: the frequency distribution of sample means with the 68-95-99.7 bands
  window.CODEVIZ["naked-ch8-confidence-and-rejection"] = {
    charts: [{
      type: "bars",
      title: "Frequency Distribution of Sample Means",
      interpret: "Sample means form a bell curve around the population mean. 68% fall within +/-1 SE, 95% within +/-2 SE, 99.7% within +/-3 SE. The crashed bus sat ~7 SE out, so it is rejected at the 99.7% level. (Illustrative normal shape over the SE bands the book draws.)",
      labels: ["-3 SE", "-2 SE", "-1 SE", "mean", "+1 SE", "+2 SE", "+3 SE"],
      values: [1, 5, 24, 40, 24, 5, 1],
      colors: ["#c89bff"]
    }]
  };
})();
