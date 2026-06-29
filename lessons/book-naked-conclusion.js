/* Naked Statistics (Charles Wheelan) — Conclusion: "Five questions that statistics can help answer" */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-conc-future-of-football",
    chapter: "Conclusion",
    title: "The future of football",
    tagline: "Is the brain damage seen in football players a real causal effect, or just a statistical cluster of bad luck?",
    sections: [
      {
        h: "Gladwell's provocative comparison",
        body: "<p>Wheelan opens with a 2009 Malcolm Gladwell article that compared dog fighting and football. The link came from Michael Vick, a quarterback who had served time for running a dog-fighting ring and was being reinstated in the NFL just as evidence emerged that football head trauma may lead to depression, memory loss, and dementia. Gladwell's premise: both football and dog fighting are inherently devastating to the participants, and a contest that ends in suffering for entertainment is something society once accepted (dog fighting in the nineteenth century) but later rejected.</p>"
      },
      {
        h: "What we know",
        body: "<p>There is mounting evidence that concussions and repeated brain injuries from football cause serious, permanent neurological damage &mdash; similar effects show up in boxers and hockey players. Researcher Ann McKee documented a buildup of abnormal proteins called tau in the brains of athletes who suffered repeated head trauma, leading to chronic traumatic encephalopathy (CTE), a progressive disorder with many of the same symptoms as Alzheimer's. Kevin Guskiewicz put sensors inside North Carolina players' helmets and found routine blows with a force comparable to hitting the windshield in a 25-mph car crash. A survey gives the starkest figures.</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Group</th><th class=\"num\">Diagnosis rate vs. national average</th></tr></thead><tbody><tr><td class=\"row-h\">Former NFL players over 50</td><td class=\"num\">5&times;</td></tr><tr><td class=\"row-h\">Younger former NFL players</td><td class=\"num\">19&times;</td></tr></tbody></table><p>In a phone survey of 1,000 randomly selected former NFL players who played at least three years, 6.1 percent of those over fifty reported a diagnosis of dementia, Alzheimer's, or another memory-related disease &mdash; about five times the national average for that age group.</p>"
      },
      {
        h: "What we don't know",
        body: "<p>The hard statistical questions remain open. Is the evidence so far representative of the long-term risk all players face, or could it be a \"cluster\" of bad outcomes that is just a statistical aberration? Even if players really do face higher risk, causality still needs probing: maybe the kind of men drawn to football (and boxing and hockey) are already prone to these problems, or maybe a third factor such as steroid use contributes. If the evidence does point to a clear causal link, the overriding question for players, parents, coaches, officials, and regulators becomes whether football can be played in a way that removes most of the head-trauma risk &mdash; and if not, what then.</p>"
      }
    ],
    takeaways: [
      "Survey: 6.1% of older former NFL players reported a memory-disease diagnosis, ~5x the age-group average; ~19x for younger players.",
      "A real effect must be distinguished from a chance cluster of bad outcomes.",
      "Even a real association needs a causal check before blaming the sport itself."
    ]
  });
  window.CODEVIZ["naked-conc-future-of-football"] = {
    charts: [
      {
        type: "bars",
        title: "Memory-disease diagnosis rate among former NFL players",
        interpret: "Former players report diagnoses far above the national age-group baseline, but the open question is whether this is a true causal effect or a statistical cluster.",
        labels: ["National average", "Former players over 50", "Younger former players"],
        values: [1, 5, 19],
        valueLabels: ["1x", "5x", "19x"],
        colors: ["#7ee787", "#ffb454", "#ffb454"]
      }
    ]
  };

  B({
    id: "naked-conc-rise-in-autism",
    chapter: "Conclusion",
    title: "The rise in autism",
    tagline: "Is autism truly becoming more common, or are we just diagnosing it more often? And the vaccine link is correlation, not cause.",
    sections: [
      {
        h: "A doubling in a decade",
        body: "<p>In 2012 the CDC reported that 1 in 88 American children had been diagnosed with an autism spectrum disorder (ASD), based on 2008 data. The diagnosis rate had climbed steeply.</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Year</th><th class=\"num\">Diagnosis rate</th></tr></thead><tbody><tr><td class=\"row-h\">2002</td><td class=\"num\">1 in 150</td></tr><tr><td class=\"row-h\">2006</td><td class=\"num\">1 in 110</td></tr><tr><td class=\"row-h\">2008</td><td class=\"num\">1 in 88</td></tr></tbody></table><p>That is nearly a doubling in less than a decade. Boys are five times as likely to be diagnosed as girls. Wheelan notes the lifetime cost of managing a single case is about $3.5 million, so the stakes for families and society are enormous.</p>"
      },
      {
        h: "Epidemic, or epidemic of diagnosis?",
        body: "<p>The first statistical puzzle is whether this reflects a true epidemic of autism, an \"epidemic of diagnosis,\" or some combination. In earlier decades, children with ASD symptoms often went undiagnosed or were labeled with a generic \"learning disability.\" Today doctors, parents, and teachers are far more aware of the symptoms, which naturally produces more diagnoses regardless of whether the underlying incidence is rising. Researchers are still hunting for clues: a UC Davis study found ten California neighborhoods with double the surrounding autism rate, each a cluster of white, highly educated parents &mdash; which could point to an environmental cause, or could simply reflect that privileged families are more likely to get a diagnosis. Twin studies suggest a genetic component without ruling out environmental factors.</p>"
      },
      {
        h: "Debunking the vaccine link",
        body: "<p>One of statistics' most important contributions has been to debunk false causes that arise from confusing correlation with causation. Because ASD symptoms often appear between a child's first and second birthdays &mdash; right around the time of routine vaccinations, including the measles-mumps-rubella (MMR) shot &mdash; many people came to believe vaccines cause autism. But scientists have soundly refuted this. Autism rates did not fall when the preservative thimerosal was removed from vaccines, and rates are no lower in countries that never used the MMR vaccine. The timing was a coincidence, not a cause. The persistent false belief has led some parents to skip vaccination, offering no protection against autism while exposing children to other serious diseases.</p>"
      }
    ],
    takeaways: [
      "Diagnosis rate roughly doubled from 1 in 150 (2002) to 1 in 88 (2008).",
      "A rising count can mean more cases, more diagnosing, or both — the two must be separated.",
      "Symptoms appearing near vaccination age is coincidence; rates were unchanged by removing thimerosal and unaffected in non-MMR countries."
    ]
  });
  window.CODEVIZ["naked-conc-rise-in-autism"] = {
    charts: [
      {
        type: "line",
        title: "Reported autism diagnosis rate (cases per child)",
        interpret: "The diagnosis rate climbs steeply, but the rise may reflect greater awareness and diagnosis rather than a true increase in incidence.",
        xlabel: "Year",
        ylabel: "Diagnoses per child (1 in N)",
        series: [
          { name: "1 in N (lower N = more common)", color: "#4ea1ff", points: [[2002, 150], [2006, 110], [2008, 88]] }
        ]
      }
    ]
  };

  B({
    id: "naked-conc-rewarding-good-teachers",
    chapter: "Conclusion",
    title: "Rewarding good teachers",
    tagline: "Value-added assessment can measure a teacher's contribution, but the data are noisy and create a false precision that gets abused.",
    sections: [
      {
        h: "The value-added idea",
        body: "<p>We want to reward good teachers and schools and replace bad ones, but raw test scores reflect a lot that has nothing to do with the classroom. The appealing fix is to measure the <em>progress</em> students make over a year &mdash; what they knew at the start versus the end &mdash; which is the \"value added\" by that classroom. Statistics can refine this further by adjusting for student characteristics like race, income, and prior test performance, so a teacher who makes big gains with historically struggling students is credited as highly effective. In 2012 New York City published value-added ratings for all 18,000 of its public school teachers, and the <em>Los Angeles Times</em> had done the same for LA teachers in 2010.</p>"
      },
      {
        h: "Noisy data and false precision",
        body: "<p>The reaction was loud and mixed. Proponents note these measures are a huge improvement over uniform pay that ignores classroom performance. But economist Doug Staiger warns the data are inherently \"noisy\": a rating is often based on a single test, on a single day, for a single group of students, and all kinds of random factors &mdash; a tough group, even a clanking air conditioner on test day &mdash; can swing results. The year-to-year correlation in a single teacher's performance is only about .35.</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Year-to-year correlation</th><th class=\"num\">Value</th></tr></thead><tbody><tr><td class=\"row-h\">Single teacher's effectiveness</td><td class=\"num\">~0.35</td></tr><tr><td class=\"row-h\">MLB batting avg / ERA</td><td class=\"num\">~0.35</td></tr></tbody></table><p>Tellingly, the year-to-year correlation in Major League Baseball performance (batting average for hitters, earned run average for pitchers) is also around .35. The data get \"less noisy\" with more years and more classrooms, just as we learn more about an athlete over more seasons. The danger is that the public treats these ratings as a definitive guide &mdash; the way we treat U.S. News college rankings &mdash; even when the data don't support that precision. The NYC teachers' union spent over $100,000 on an ad campaign headlined \"This Is No Way to Rate a Teacher.\"</p>"
      },
      {
        h: "Measure the right outcome",
        body: "<p>Staiger adds a deeper warning: be sure the outcome you measure actually tracks what you care about long term. At the Air Force Academy, cadets are randomly assigned to course sections with identical syllabi and exams &mdash; an elegant natural experiment that removes selection effects. Scott Carrell and James West found that the professors with <em>less</em> experience and fewer fancy degrees produced students who scored higher on the introductory exams and gave better evaluations. The tempting conclusion is to fire the old professors. But the same study found that students of the more experienced professors did <em>better in their later follow-on courses</em>. The likely explanation is that inexperienced instructors \"teach to the test,\" boosting immediate scores, while experienced ones teach the deeper concepts that matter later. Test scores that glimmer now may not be gold in the future.</p>"
      }
    ],
    takeaways: [
      "Value-added assessment measures student progress, adjusting for background, rather than raw scores.",
      "A single teacher's year-to-year effectiveness correlates only ~0.35 — the same as MLB batting/ERA — so the data are noisy.",
      "Treating noisy ratings as precise is a false precision; and the measured outcome (today's test) may not track long-term learning."
    ]
  });
  window.CODEVIZ["naked-conc-rewarding-good-teachers"] = {
    charts: [
      {
        type: "bars",
        title: "Year-to-year correlation in performance",
        interpret: "A teacher's effectiveness from one year to the next correlates only about 0.35 — no steadier than a baseball player's stats — so a single year's rating is a noisy signal.",
        labels: ["Teacher effectiveness", "MLB batting avg / ERA"],
        values: [0.35, 0.35],
        valueLabels: ["0.35", "0.35"],
        colors: ["#ffb454", "#4ea1ff"]
      }
    ]
  };

  B({
    id: "naked-conc-fighting-global-poverty",
    chapter: "Conclusion",
    title: "Fighting global poverty",
    tagline: "Esther Duflo brings the randomized controlled experiment to economics, testing what actually makes poor people less poor.",
    sections: [
      {
        h: "An old tool for a new purpose",
        body: "<p>We know strikingly little about how to make poor countries less poor. French economist Esther Duflo, who teaches at MIT, is changing that by retrofitting an old laboratory tool &mdash; the randomized, controlled experiment &mdash; to test real interventions in developing countries. By randomly assigning who gets a program and comparing them with a control group, she can isolate what actually works.</p>"
      },
      {
        h: "Teacher attendance in Rajasthan",
        body: "<p>One persistent problem in rural Indian schools is teacher absenteeism, especially in one-teacher schools. Duflo and coauthor Rema Hanna tested a clever fix on a random sample of 60 one-teacher schools in Rajasthan: teachers were offered an attendance bonus and given cameras with tamperproof date-and-time stamps to photograph themselves with their students each day.</p><ul class=\"steps\"><li>60 schools received the camera-and-bonus program.</li><li>60 randomly chosen schools served as the control group.</li><li>Absenteeism dropped by half in the program schools versus the controls.</li><li>Student test scores rose and more students advanced to the next education level.</li></ul>"
      },
      {
        h: "Fertilizer in Kenya, and the gender experiment",
        body: "<p>In Kenya, Duflo gave a randomly selected group of farmers a small subsidy &mdash; free fertilizer delivery &mdash; offered right after the harvest while they still had cash, addressing a \"poverty trap\" in which subsistence farmers are too poor to buy the fertilizer that would raise their yields. The result: fertilizer use rose by 10 to 20 percentage points compared with a control group. Duflo even tackled the question of whether men or women better manage family money. In C&ocirc;te d'Ivoire, men and women grow different cash crops that respond differently to rainfall, creating a natural experiment: in good years for the men's crops the men have more cash, and in good years for the women's crops the women do. The finding &mdash; when the women have a bountiful harvest they spend the extra cash on more food for the family, and the men largely do not. For this body of work Duflo won the 2010 John Bates Clark Medal.</p>"
      }
    ],
    takeaways: [
      "Duflo applies randomized controlled experiments — long confined to the lab sciences — to fighting poverty.",
      "Rajasthan: camera-and-bonus program (60 schools vs. 60 controls) cut teacher absenteeism by half and raised test scores.",
      "Kenya: a post-harvest free-delivery subsidy raised fertilizer use 10–20 percentage points over the control group."
    ]
  });

  B({
    id: "naked-conc-who-knows-about-you",
    chapter: "Conclusion",
    title: "Who gets to know what about you",
    tagline: "Big data can predict your life in startling detail — like Target spotting a pregnancy — but math cannot supplant judgment.",
    sections: [
      {
        h: "The power of predictive analytics",
        body: "<p>Our ability to gather and analyze enormous quantities of data &mdash; digital information married to cheap computing and the Internet &mdash; is unique in human history, and we will need new rules for it. Wheelan illustrates with the retailer Target, which uses predictive analytics on sales and consumer data to figure out who buys what and why. Target learned that pregnancy, especially the second trimester, is a pivotal moment for forming lasting \"retail relationships,\" so it set out to identify pregnant shoppers and draw them in.</p>"
      },
      {
        h: "The pregnancy prediction score",
        body: "<p>The easy part is the baby registry, where expectant mothers effectively announce themselves. The statistical twist is that Target figured out how to spot <em>other</em> women with the same shopping patterns. Pregnant women tend to switch to unscented lotions, start buying vitamin supplements, and pick up extra-big bags of cotton balls. Target's analysts identified 25 such products that together produced a \"pregnancy prediction score,\" then mailed pregnancy-related coupons. How good was the model? A man stormed into a Minneapolis store, furious that his high-school daughter was getting coupons for baby clothes and cribs. He later called back to apologize &mdash; his daughter was indeed due in August. Target's statisticians had figured out she was pregnant before her own father did. To make it feel less intrusive, some companies now mix such targeted coupons in with unrelated ones to cover their tracks.</p>"
      },
      {
        h: "Privacy, surveillance, and judgment",
        body: "<p>This power is both their business and an intrusion. The same tension runs through the public arena: cities install thousands of security cameras, some destined for facial recognition; law enforcement can track a car by satellite. In 2012 the U.S. Supreme Court ruled unanimously that police can no longer attach a GPS tracker to a private vehicle without a warrant. Governments build DNA databases &mdash; raising the question of whose DNA belongs in them. Facebook, a company with almost no physical assets, is enormously valuable precisely because every click yields data; as its product VP Chris Cox put it, \"The challenge of the information age is what to do with it.\" Wheelan's bottom line: statistics matters more than ever because we have more meaningful chances to use data, yet the formulas will never tell us which uses are appropriate. <strong>Math cannot supplant judgment.</strong></p>"
      }
    ],
    takeaways: [
      "Target built a \"pregnancy prediction score\" from 25 telltale products to identify likely-pregnant shoppers.",
      "It once detected a teenager's pregnancy before her father knew — showing both the power and the intrusiveness of big data.",
      "More data means more responsibility: the formulas don't decide what is appropriate — math cannot supplant judgment."
    ]
  });
})();
