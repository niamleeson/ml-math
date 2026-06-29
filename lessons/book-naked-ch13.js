/* Naked Statistics (Charles Wheelan) — Chapter 13: "Program Evaluation: Will going to Harvard change your life?" */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch13-program-evaluation",
    chapter: "Chapter 13",
    title: "Program evaluation",
    tagline: "Program evaluation is the process of measuring the causal effect of some intervention, called the treatment.",
    sections: [
      {
        h: "Measuring a causal effect",
        body: "<p>Wheelan defines program evaluation as the process by which we seek to measure the <em>causal</em> effect of some intervention &mdash; anything from a new cancer drug to a job placement program for high school dropouts to putting more police officers on the street. The intervention we care about is called the <strong>treatment</strong>. He notes that in statistics this word is used more broadly than in everyday speech: a treatment can be a literal medical procedure, but it can also be something like attending college or receiving job training after release from prison.</p><p>The goal is to isolate the effect of that single factor: how does the group that receives the treatment fare compared with some other group whose members are identical in every other respect?</p>"
      },
      {
        h: "Why a simple comparison fails",
        body: "<p>His running example asks whether putting more police officers on the street deters crime &mdash; a socially important question, since police are expensive. We cannot answer it just by checking whether places with more police per capita have lower crime. \"Zurich is not Los Angeles.\" Even comparing big American cities is deeply flawed, because Los Angeles, New York, Houston, Miami, Detroit, and Chicago all differ in demographics and crime challenges.</p><p>Regression doesn't rescue us here either, because of <strong>reverse causality</strong>: cities hit by crime waves hire more police, so we might find a positive but misleading association where the places with the most police have the worst crime. Wheelan's analogy: places with lots of doctors also have the most sick people &mdash; the doctors aren't making people sick, they're located where they're needed. Banishing oncologists from Florida won't make its retirees healthier.</p>"
      }
    ],
    takeaways: [
      "Program evaluation measures the causal effect of an intervention (the treatment).",
      "A treatment can be literal (a drug) or figurative (attending college, job training).",
      "Simple comparisons fail because groups differ and crime can cause police hiring (reverse causality)."
    ]
  });

  B({
    id: "naked-ch13-counterfactual",
    chapter: "Chapter 13",
    title: "The counterfactual",
    tagline: "To know a treatment's true effect we need the counterfactual: what would have happened in the absence of the treatment.",
    sections: [
      {
        h: "What would have happened otherwise",
        body: "<p>To measure the effect of going to Harvard, Wheelan argues, we'd have to know both what happens to you after you go to Harvard <em>and</em> what happens to you after you <em>don't</em> go to Harvard. Obviously we can never observe both for the same person. The <strong>counterfactual</strong> is exactly that missing piece: what would have happened in the absence of the treatment. Clever researchers find ways to compare a treatment against an estimate of the counterfactual.</p>"
      },
      {
        h: "The Iraq invasion example",
        body: "<p>Wheelan illustrates how impossible the counterfactual can be with a deliberately non-statistical question: did the U.S. invasion of Iraq make America safer? His answer is that we will never know, because we cannot observe what would have happened had the U.S. <em>not</em> invaded. He spins out two whimsical alternate histories &mdash; one where Saddam Hussein, left in power, decides to seek a hydrogen bomb, and one where he slips on a bar of soap and dies the day after a non-invasion. The point is serious: the counterfactual is often difficult or impossible to observe, which is the central challenge of establishing cause and effect.</p>"
      }
    ],
    takeaways: [
      "The counterfactual is what would have happened without the treatment.",
      "We can never observe the same subject both treated and untreated.",
      "Every method in the chapter is a clever way of approximating the counterfactual."
    ]
  });

  B({
    id: "naked-ch13-treatment-control",
    chapter: "Chapter 13",
    title: "Treatment and control groups",
    tagline: "The treatment group receives the intervention; the control group, ideally identical in all other respects, stands in for the counterfactual.",
    sections: [
      {
        h: "Two groups, one difference",
        body: "<p>The core tool of program evaluation is to compare a <strong>treatment group</strong>, whose members receive the intervention, with a <strong>control group</strong>, whose members do not. Ideally the two groups are identical in every respect except for the treatment, so any difference in outcomes can be attributed to the treatment alone. In a controlled experiment the control group <em>is</em> the counterfactual &mdash; it shows us what would have happened to the treated group had it not been treated.</p><p>When a controlled experiment is impractical or immoral, Wheelan says, we have to find some other way of approximating the counterfactual. He then walks through the common strategies for doing exactly that.</p>"
      }
    ],
    takeaways: [
      "Treatment group gets the intervention; control group does not.",
      "The control group is meant to be identical except for the treatment.",
      "In a controlled experiment the control group serves as the counterfactual."
    ]
  });

  B({
    id: "naked-ch13-randomized-controlled",
    chapter: "Chapter 13",
    title: "Randomized controlled experiments",
    tagline: "Randomly assigning subjects to treatment and control evens out all other characteristics, observed and unobserved.",
    sections: [
      {
        h: "The power of randomization",
        body: "<p>The most straightforward way to build comparable groups is to assign study participants <em>randomly</em> to treatment and control. Wheelan calls this a rare case where the best approach involves the least work. Randomization tends to spread the non-treatment characteristics &mdash; obvious ones like sex, race, age, and education, and even unobservable ones &mdash; roughly evenly across both groups, so they don't bias the result.</p>"
      },
      {
        h: "Why bigger samples help",
        body: "<p>His thought experiment: start with a sample of 1,000 people, half of them women, and split it randomly into two groups. The most likely outcome is about 500 women per group. We won't get an exact split, but probability is our friend &mdash; it's very unlikely one group gets a wildly disproportionate share of women (or of any other characteristic).</p><ul class=\"steps\"><li>Sample: 1,000 people, 500 women.</li><li>Split randomly into two groups; expected count is 500 in each group, with women splitting near 250 / 250.</li><li>The chance of getting fewer than 450 women in one group or the other is less than 1 percent.</li><li>The bigger the sample, the more effective randomization is at producing two broadly similar groups.</li></ul>"
      },
      {
        h: "Two limits of the approach",
        body: "<p>Wheelan flags two big challenges. First, there are many experiments we simply cannot perform on people; we can run controlled experiments on human subjects only when the treatment is expected to have a positive outcome, which rules out \"treatments\" like experimenting with drugs or dropping out of high school. Second, there's far more variation among people than among lab rats, so other characteristics could confound the result &mdash; which is precisely the problem randomization is designed to solve.</p>"
      }
    ],
    takeaways: [
      "Random assignment balances observed and unobservable traits across groups.",
      "With 1,000 people (500 women), there's under a 1% chance of fewer than 450 women in a group.",
      "Larger samples make randomization more reliable; ethics limit which treatments we can test."
    ]
  });

  B({
    id: "naked-ch13-double-blind-placebo",
    chapter: "Chapter 13",
    title: "Double-blind trials and placebos",
    tagline: "In a double-blind trial neither patient nor physician knows who gets the real treatment; a placebo controls for the act of being treated.",
    sections: [
      {
        h: "Blinding and placebos",
        body: "<p>Medical trials aspire to be randomized and controlled, and ideally <strong>double-blind</strong>: neither the patient nor the physician knows who is receiving the real treatment and who is getting a <strong>placebo</strong> &mdash; a sham treatment that controls for the psychological effect of merely being treated. Blinding is obviously impossible for some interventions; a heart surgeon, one hopes, knows which patients actually got the bypass.</p>"
      },
      {
        h: "The sham knee surgery",
        body: "<p>Wheelan's favorite example shows that even surgery can sometimes be blinded. In an evaluation of a knee surgery meant to relieve pain, the treatment group got the real operation while the control group got a \"sham\" surgery: the surgeon made three small incisions in the knee and \"pretended to operate.\" The striking result was that the real surgery was <em>no more effective</em> than the sham surgery at relieving knee pain. (The participants did know they were in a trial and might receive the sham procedure.)</p>"
      },
      {
        h: "The prayer study",
        body: "<p>Randomized trials can probe surprising questions. Wheelan describes a controlled study, published in the <em>American Heart Journal</em>, of whether prayers offered by strangers improve outcomes after heart bypass surgery. The 1,800 coronary-bypass patients were split into three groups:</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Group</th><th>Prayed for?</th><th>Told?</th></tr></thead><tbody><tr><td class=\"row-h\">1</td><td>No</td><td>&mdash;</td></tr><tr><td class=\"row-h\">2</td><td>Yes</td><td>Yes, told they were prayed for</td></tr><tr><td class=\"row-h\">3</td><td>Yes</td><td>Told they might or might not be (placebo control)</td></tr></tbody></table><p>Members of three religious congregations prayed for specific patients by first name and last initial. The result: no difference in the rate of complications within thirty days for those offered prayers versus those not. Critics noted an omitted variable &mdash; the unknown amount of prayer each person already received from friends and family.</p>"
      }
    ],
    takeaways: [
      "Double-blind means neither patient nor physician knows who got the real treatment.",
      "A placebo (e.g., sham knee surgery) controls for the effect of merely being treated.",
      "The real knee surgery was no more effective than the sham; the prayer study found no effect."
    ]
  });

  B({
    id: "naked-ch13-cost-ethics-project-star",
    chapter: "Chapter 13",
    title: "Cost and ethical limits",
    tagline: "Controlled experiments on humans are constrained by ethics and expense, as Tennessee's Project STAR on class size shows.",
    sections: [
      {
        h: "Project STAR",
        body: "<p>There is still room in the social sciences for randomized experiments on human subjects. Wheelan's example is Tennessee's <strong>Project STAR</strong>, begun in 1985, which tested the effect of smaller class sizes on learning. Studying class size honestly is hard: schools with small classes tend to have more resources, and within a school a principal might assign difficult students &mdash; or veteran teachers might choose &mdash; small classes, creating spurious associations. Project STAR avoided this by random assignment.</p><ul class=\"steps\"><li>Across 79 schools, kindergartners were randomly assigned to one of three class types.</li><li>Small class: 13&ndash;17 students.</li><li>Regular class: 22&ndash;25 students.</li><li>Regular class with both a regular teacher and a teacher's aide.</li><li>Teachers were also randomly assigned; students stayed in their assigned class type through third grade.</li></ul>"
      },
      {
        h: "Results, and the price tag",
        body: "<p>Project STAR remains the only randomized test of the effect of smaller classes, and its results were statistically and socially significant.</p><ul class=\"steps\"><li>Students in small classes scored about .15 standard deviations higher on standardized tests than students in regular-size classes.</li><li>Black students in small classes had gains twice as large.</li></ul><p>Now the bad news: the finest studies cost big bucks. Project STAR cost roughly \\$12 million, and the prayer study on postsurgical complications cost \\$2.4 million. Real life also chipped away at the randomization &mdash; students entered and left mid-experiment, some were moved for disciplinary reasons, and some parents lobbied to get their kids into smaller classes.</p>"
      }
    ],
    takeaways: [
      "Ethics restrict experiments on humans; the finest studies are also very expensive.",
      "Project STAR randomized 79 schools' kindergartners into small, regular, and aide classes.",
      "Small classes gave a .15 standard-deviation gain (double for black students); the study cost ~\\$12M."
    ]
  });

  B({
    id: "naked-ch13-natural-experiment",
    chapter: "Chapter 13",
    title: "Natural experiments",
    tagline: "When random circumstances accidentally create treatment and control groups, researchers can exploit them cheaply.",
    sections: [
      {
        h: "Letting life do the randomizing",
        body: "<p>Not everyone has millions of dollars for a randomized trial. A cheaper alternative is the <strong>natural experiment</strong>: random circumstances that happen to create something close to a randomized, controlled experiment. Life sometimes builds a treatment and control group by accident, and researchers leap on the result.</p>"
      },
      {
        h: "D.C. terror-alert policing",
        body: "<p>Wheelan opens the chapter with this case. Jonathan Klick and Alexander Tabarrok studied how more police affect crime by exploiting the terrorism alert system. On \"high alert\" days, Washington, D.C., puts more officers in certain areas because the capital is a terror target. We can assume the terror threat is unrelated to ordinary street crime &mdash; it is <em>exogenous</em> &mdash; so the extra police presence is effectively random with respect to crime. The researchers' insight was to ask what happens to <em>ordinary</em> crime on high-alert days.</p><ul class=\"steps\"><li>On Orange alert days (high alert, more police), crime was roughly 7 percent lower than on Yellow alert days (elevated, but no extra police).</li><li>The drop was sharpest in the district that gets the most police attention &mdash; the area including the White House, the Capitol, and the National Mall.</li></ul>"
      },
      {
        h: "Schooling laws and longevity",
        body: "<p>Education is consistently linked to longer life, but that's only a correlation; people who choose more education differ from those who don't. We can't run a randomized experiment forcing some people to leave school early. Adriana Lleras-Muney exploited a natural experiment instead: states have minimum schooling laws, and <em>those laws have changed</em> at different times. That change is exogenous &mdash; not caused by the individuals studied. Her control group was states that did <em>not</em> change their laws, which guards against the fact that life expectancy was rising over time anyway (people lived longer in 1900 than in 1850 regardless of any law).</p><ul class=\"steps\"><li>The setup approximates a giant experiment &mdash; e.g., Illinois residents forced to stay in school seven years while neighboring Indiana could leave after six.</li><li>Result: for adults who reached age 35, one additional year of schooling extended life expectancy by an extra 1.5 years.</li><li>The finding has been replicated in other countries with similar law-driven variation; still, some skepticism is warranted since the mechanism isn't understood.</li></ul>"
      }
    ],
    takeaways: [
      "A natural experiment uses random circumstances to mimic a controlled experiment.",
      "On D.C. high-alert days, more police coincided with ~7% less ordinary crime.",
      "Lleras-Muney found one extra year of schooling added ~1.5 years of life expectancy at age 35."
    ]
  });

  B({
    id: "naked-ch13-nonequivalent-control",
    chapter: "Chapter 13",
    title: "Nonequivalent control groups",
    tagline: "When randomizing is impossible, researchers compare nonrandom groups they hope are broadly similar, as Dale and Krueger did for elite colleges.",
    sections: [
      {
        h: "The idea and its risk",
        body: "<p>Sometimes the best option is a <strong>nonequivalent control</strong>: nonrandomized treatment and control groups that we hope are broadly similar. The good news is we have a control group; the bad news is that any nonrandom assignment creates the potential for bias &mdash; there may be unobserved differences between the groups related to how members ended up in one or the other.</p>"
      },
      {
        h: "Dale and Krueger on elite colleges",
        body: "<p>This addresses the chapter's title question: is there a real life advantage to attending a highly selective college? Harvard, Princeton, and Dartmouth graduates do very well &mdash; a 2008 PayScale.com study found median pay (ten to twenty years' experience) of \\$134,000 for Dartmouth grads, the highest of any undergraduate institution, with Princeton second at \\$131,000. But those numbers say nothing about the <em>value</em> of the education: these students were talented when they applied; <em>that's why they got accepted</em>. The hard question is the treatment effect of attending an elite school versus the selection effect of elite schools admitting the most talented students.</p>"
      },
      {
        h: "Exploiting multiple applications",
        body: "<p>We can't randomly assign students to colleges. Economists Stacy Dale and Alan Krueger found a clever workaround by exploiting the fact that many students apply to multiple colleges. Some students get into a highly selective school <em>and</em> attend it; others get into an equally selective school but <em>choose</em> to go somewhere less selective. The second group acts as a nonequivalent control: students talented enough to be admitted to a top school who opted out of it.</p><ul class=\"steps\"><li>Treatment group: talented students who attended highly selective schools.</li><li>Control group: equally-admitted students who chose a less selective school.</li><li>Finding: students who attended more selective colleges earned roughly the same as similar-ability students who attended less selective schools.</li><li>The one exception: students from low-income families <em>did</em> earn more by attending a selective college.</li></ul><p>As Krueger put it in summarizing the work, your own motivation, ambition, and talents will determine your success more than the name of the college on your diploma.</p>"
      }
    ],
    takeaways: [
      "Nonequivalent controls use nonrandom groups hoped to be similar, risking hidden bias.",
      "Dale and Krueger compared elite-college attendees with equally-admitted students who went elsewhere.",
      "Attending a selective college didn't raise earnings on average, except for low-income students."
    ]
  });

  B({
    id: "naked-ch13-difference-in-differences",
    chapter: "Chapter 13",
    title: "Difference in differences",
    tagline: "Compare the before-and-after change for a treated group against the same-period change for a similar untreated group.",
    sections: [
      {
        h: "Why before-and-after alone fails",
        body: "<p>One tempting way to find cause and effect is to do something and watch what happens &mdash; cut taxes, and if the economy improves, credit the tax cut. The pitfall is that life is more complex: over the same stretch many other \"interventions\" unfold (more women going to college, the Internet raising productivity, the Chinese currency being undervalued, and so on). Just because one thing follows another doesn't mean it caused it.</p>"
      },
      {
        h: "The two-step comparison",
        body: "<p>A <strong>difference in differences</strong> approach fixes this by doing two things. First, examine the before-and-after data for the group that got the treatment &mdash; say, the unemployment figures for a county that started a job training program. Second, compare that change against the unemployment figures over the same period for a <em>similar</em> county that did not start any such program. The key assumption is that the two counties are comparable except for the treatment, and that a good control group is exposed to the same broader economic forces. The treatment effect is the difference between the two counties' changes &mdash; the \"difference in differences.\"</p>"
      },
      {
        h: "When the treatment looks like a failure",
        body: "<p>Wheelan's example: a county in Illinois starts a job training program to fight high unemployment, but over the next two years unemployment keeps rising. Does that make the program a failure? Not necessarily. The chapter shows two figures &mdash; first County A's unemployment alone, then County A plotted against a comparison County B with no program. This approach is especially enlightening when the treatment <em>appears</em> ineffective (unemployment higher after the program than before), yet the control county reveals the trend would have been even worse without the intervention.</p>"
      }
    ],
    takeaways: [
      "A pure before-and-after comparison can't separate the treatment from other forces.",
      "Difference in differences compares the treated group's change to a similar untreated group's change.",
      "It can show a program helped even when outcomes worsened, if they'd have worsened more without it."
    ]
  });
  window.CODEVIZ["naked-ch13-difference-in-differences"] = {
    charts: [
      {
        type: "line",
        title: "Unemployment: County A (job training) vs County B (no program)",
        interpret: "Both counties track together until training begins; afterward County A's unemployment rises less than County B's, so the gap that opens up is the estimated treatment effect.",
        xlabel: "Time (training begins at period 5)",
        ylabel: "Unemployment (illustrative)",
        series: [
          { name: "County A (treated)", color: "#4ea1ff", points: [[1, 9], [2, 7.5], [3, 6.5], [4, 6.3], [5, 6.4], [6, 7], [7, 7.4], [8, 7.6]] },
          { name: "County B (control)", color: "#ffb454", points: [[1, 9.2], [2, 7.6], [3, 6.6], [4, 6.3], [5, 6.4], [6, 7.3], [7, 8.3], [8, 9.2]] }
        ]
      }
    ]
  };

  B({
    id: "naked-ch13-discontinuity-analysis",
    chapter: "Chapter 13",
    title: "Discontinuity analysis",
    tagline: "Compare those who barely cleared an arbitrary cutoff with those who barely missed it, since the two groups are otherwise nearly identical.",
    sections: [
      {
        h: "Just above versus just below a cutoff",
        body: "<p><strong>Discontinuity analysis</strong> builds a treatment and control group around an arbitrary threshold &mdash; an exam score, a minimum household income, and the like. People who fall just above and just below the cutoff are nearly identical in most respects; which side they land on is essentially arbitrary, so comparing their outcomes gives meaningful results about the treatment.</p><p>Wheelan's example: a district requires summer school for struggling students. We can't just compare summer-school students with everyone else &mdash; they're there <em>because they are struggling</em>, so they'd likely do worse regardless. But a student who scores 59 percent (failing) is not appreciably different from one who scores 60 percent (passing). If failing the midterm triggers a treatment like mandatory tutoring, comparing those who barely failed (and got tutoring) with those who barely passed (and didn't) yields a reasonable treatment and control group.</p>"
      },
      {
        h: "Juvenile incarceration in Washington",
        body: "<p>Randi Hjalmarsson used this to study whether incarceration deters future crime among juvenile offenders. You can't just compare imprisoned offenders with those who got lighter sentences &mdash; the imprisoned ones committed more serious crimes; <em>that's why they go to prison</em> &mdash; nor can you randomly assign prison sentences. Instead she exploited Washington State's rigid sentencing grid:</p><ul class=\"steps\"><li>The x-axis is the offender's prior offenses: each prior felony = 1 point, each prior misdemeanor = &frac14; point; the total is rounded down to a whole number.</li><li>The y-axis is the severity of the current offense, from E (least serious) to A+ (most serious).</li><li>The sentence is read off the box on the grid. With two prior points and a Class B felony, an offender gets 15&ndash;36 months in juvenile jail; with only one point for the same crime, no jail.</li><li>Her own example: two offenders with a current offense of Class C+ and prior scores of 2&frac34; and 3 &mdash; rounding down makes them 2 and 3 points &mdash; so only the second is incarcerated.</li></ul><p>For research purposes those two offenders are essentially the same until one goes to jail. At that point their behavior diverges sharply: juveniles who went to jail were significantly less likely to be convicted of another crime after release.</p>"
      }
    ],
    takeaways: [
      "Discontinuity analysis compares those just above and just below an arbitrary cutoff.",
      "A 59% (fail) student is nearly identical to a 60% (pass) student, making a clean comparison.",
      "Using Washington's sentencing grid, Hjalmarsson found jailed juveniles reoffended less."
    ]
  });
})();
