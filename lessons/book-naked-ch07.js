/* Naked Statistics (Charles Wheelan) — Chapter 7: "The Importance of Data: Garbage in, garbage out" */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch7-garbage-in-garbage-out",
    chapter: "Chapter 7",
    title: "Garbage in garbage out",
    tagline: "No amount of fancy analysis can rescue conclusions built on bad data.",
    sections: [
      {
        h: "Data deserve respect",
        body: "<p>Wheelan opens with the 2012 study, published in <em>Science</em>, that found male fruit flies repeatedly rejected by females drank more alcohol than males that mated freely. He stresses the results were not a triumph of statistics but a triumph of <em>data</em>: the clever part was engineering one group of sexually satisfied males and one group of frustrated males so their drinking could be compared. Once that data existed, the number crunching was no harder than a high school science fair.</p>"
      },
      {
        h: "The cookbook analogy",
        body: "<p>He compares data to a quarterback's offensive line: unglamorous blockers without whom you never see a star. Most statistics books assume you are working with good data, just as a cookbook assumes you are not starting with rancid meat and rotten vegetables. Even the finest recipe can't save a meal built from spoiled ingredients &mdash; and no fancy analysis can make up for fundamentally flawed data. That is the meaning of \"garbage in, garbage out.\"</p>"
      }
    ],
    takeaways: [
      "Good analysis on bad data still yields garbage.",
      "The fruit-fly study's genius was the data design, not the math.",
      "Statistics assumes good ingredients the way a recipe does."
    ]
  });

  B({
    id: "naked-ch7-three-things-we-ask-of-data",
    chapter: "Chapter 7",
    title: "Three things we ask of data",
    tagline: "We want a representative sample, a source of comparison, or simply to capture whatever we might study later.",
    sections: [
      {
        h: "A representative sample",
        body: "<p>First, we often want a sample that mirrors a larger population. To gauge attitudes toward a candidate we interview voters representative of the relevant jurisdiction &mdash; and not everyone living there, but those <em>likely to vote</em>. One of statistics' most powerful results, explored in later chapters, is that inferences from a reasonably large, properly drawn sample can be as accurate as surveying the entire population.</p>"
      },
      {
        h: "A source of comparison",
        body: "<p>Second, we ask data to give us something to compare against. Is a new medicine better than the current one? Are ex-convicts who get job training less likely to reoffend? Do charter-school students outperform similar public-school students? The aim is to find two broadly similar groups that differ only in the one intervention or attribute we care about &mdash; exactly what the fruit-fly experiment achieved with its mated and spurned males.</p>"
      },
      {
        h: "Capturing what we may want to study",
        body: "<p>Third, we sometimes gather data with no specific plan &mdash; \"just because,\" as Wheelan's teenage daughter put it &mdash; suspecting it will prove useful later. He likens this to a crime-scene detective who demands all possible evidence be collected so it can be sifted for clues afterward. If we already knew exactly what would matter, we probably wouldn't need the investigation at all.</p>"
      }
    ],
    takeaways: [
      "Representative sample: mirror a larger population.",
      "Comparison: two similar groups differing in one thing.",
      "Capture: collect broadly now, sort for clues later."
    ]
  });

  B({
    id: "naked-ch7-simple-random-sample",
    chapter: "Chapter 7",
    title: "The simple random sample",
    tagline: "Give every member of the population an equal chance of selection and the sample will look like the population.",
    sections: [
      {
        h: "Equal chance for everyone",
        body: "<p>The easiest way to get a representative sample is to pick a subset of the population at random &mdash; the \"simple random sample.\" The defining requirement is that every observation has an equal chance of being chosen. If you survey 100 adults in a neighborhood of 4,328 adult residents, your method must give each of those 4,328 the same probability of becoming one of the 100 surveyed.</p>"
      },
      {
        h: "The urn of marbles",
        body: "<p>Statistics texts illustrate this by drawing colored marbles from an urn. Wheelan's setup: an urn holding 60,000 blue marbles and 40,000 red ones. A random draw of 100 marbles will most likely come out 60 blue and 40 red, matching the urn's 60/40 split.</p><ul class=\"steps\"><li>Urn composition: 60,000 blue out of 100,000 total &rarr; 60% blue, 40% red.</li><li>Most likely sample of 100: 60 blue, 40 red.</li><li>Draw again and you get sample-to-sample variation &mdash; perhaps 62 blue / 38 red, or 58 blue / 42 red.</li><li>A sample wildly off from 60/40 is very, very unlikely.</li></ul>"
      },
      {
        h: "Taste one spoonful of soup",
        body: "<p>Real populations are messier than marbles &mdash; how would you randomly sample all American adults for a phone poll, when low-income people may lack phones and high-income people may screen calls? The key idea survives the complications: a properly drawn sample looks like the population it came from. Wheelan's intuition: think of sampling a pot of soup with a single spoonful. If you've stirred well, one spoonful tells you how the whole pot tastes.</p>"
      }
    ],
    takeaways: [
      "Simple random sample: every member has an equal chance of selection.",
      "A 60/40 urn yields a roughly 60/40 sample of 100.",
      "Stir the soup, then one spoonful reveals the whole pot."
    ]
  });
  window.CODEVIZ["naked-ch7-simple-random-sample"] = {
    charts: [
      {
        type: "bars",
        title: "Urn (60,000 blue / 40,000 red) vs. a random sample of 100",
        interpret: "A properly drawn sample mirrors the population: the 60/40 split in the urn shows up as roughly 60 blue and 40 red in the sample.",
        labels: ["Blue %", "Red %"],
        values: [60, 40],
        colors: ["#4ea1ff", "#ffb454"]
      }
    ]
  };

  B({
    id: "naked-ch7-size-cant-fix-bias",
    chapter: "Chapter 7",
    title: "Size cannot fix bias",
    tagline: "A bigger sample smooths random variation, but it cannot repair a sample drawn from the wrong group.",
    sections: [
      {
        h: "Bigger is better, with one caveat",
        body: "<p>Wheelan lists what to appreciate about representative samples: they unlock statistics' most powerful tools; a good sample is harder to get than it looks; many egregious errors come from good methods applied to bad samples; and size matters &mdash; a larger sample smooths away freak variation (a bowl of soup tests better than a spoonful). The crucial caveat: a bigger sample will <em>not</em> correct errors in its composition, that is, <strong>bias</strong>. A bad sample is a bad sample.</p>"
      },
      {
        h: "The Washington D.C. poll",
        body: "<p>No supercomputer or fancy formula can validate a <em>national</em> presidential poll whose respondents come only from a phone survey of Washington, D.C. residents &mdash; D.C. doesn't vote like the rest of America. Calling 100,000 D.C. residents instead of 1,000 doesn't fix the flaw. In fact, a large biased sample is arguably worse than a small one, because its size lends a false sense of confidence.</p>"
      }
    ],
    takeaways: [
      "Larger samples reduce random variation, not bias.",
      "A D.C.-only sample stays unrepresentative no matter how big.",
      "A big biased sample is worse: it feels trustworthy but isn't."
    ]
  });

  B({
    id: "naked-ch7-treatment-control-randomization",
    chapter: "Chapter 7",
    title: "Treatment control and randomization",
    tagline: "Randomly assigning subjects to treatment and control is the gold standard for isolating one intervention's effect.",
    sections: [
      {
        h: "Isolating one intervention",
        body: "<p>When data serve as a comparison, the goal is two groups alike except for the \"treatment\" we study &mdash; which in social science can mean anything from being a frustrated fruit fly to receiving a tax rebate. In the physical and biological sciences this is straightforward: chemists vary test tubes, biologists vary petri dishes, and rats can be assigned to exercise or not. With humans it gets hard, because we cannot force people to do what we make lab rats do. Questions like whether repeated concussions cause later neurological harm matter enormously yet can't be settled by experimenting on people.</p>"
      },
      {
        h: "Randomization as the gold standard",
        body: "<p>The recurring challenge is creating treatment and control groups that differ <em>only</em> in who gets the treatment. The \"gold standard\" solution is randomization: subjects (or schools, or hospitals) are randomly assigned to treatment or control. We don't assume the subjects are identical; instead we trust that randomization spreads all relevant characteristics evenly across both groups &mdash; both observable ones like race or income and unmeasured confounders we never thought of, like perseverance or faith.</p>"
      }
    ],
    takeaways: [
      "Treatment vs. control isolates one specific intervention.",
      "Humans can't be forced into lab-rat conditions, so design is harder.",
      "Randomization evenly distributes even unmeasured confounders."
    ]
  });

  B({
    id: "naked-ch7-longitudinal-vs-cross-sectional",
    chapter: "Chapter 7",
    title: "Longitudinal vs cross-sectional data",
    tagline: "Following the same subjects over time is the Ferrari of data; a single-snapshot study is the Toyota.",
    sections: [
      {
        h: "The Framingham Heart Study",
        body: "<p>Much of what we know about heart disease comes from the Framingham Heart Study, a longitudinal study in Framingham, Massachusetts. A longitudinal study collects data on a large group at many points in time &mdash; the same people interviewed periodically for years or decades, building a rich trove. In 1948 researchers gathered data on 5,209 adult residents (height, weight, blood pressure, education, diet, smoking, drug use) and have followed those same participants, and their offspring, ever since.</p>"
      },
      {
        h: "Findings that take decades to emerge",
        body: "<p>Framingham data fed over two thousand articles since 1950, nearly a thousand of them between 2000 and 2009, establishing relationships we now take for granted:</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Finding</th><th class=\"num\">Year</th></tr></thead><tbody><tr><td class=\"row-h\">Cigarette smoking increases heart-disease risk</td><td class=\"num\">1960</td></tr><tr><td class=\"row-h\">Physical activity reduces, and obesity increases, heart-disease risk</td><td class=\"num\">1967</td></tr><tr><td class=\"row-h\">High blood pressure increases stroke risk</td><td class=\"num\">1970</td></tr><tr><td class=\"row-h\">High HDL (\"good cholesterol\") reduces risk of death</td><td class=\"num\">1988</td></tr><tr><td class=\"row-h\">Family history significantly raises cardiovascular risk</td><td class=\"num\">2004&ndash;05</td></tr></tbody></table><p>Wheelan calls longitudinal data the research equivalent of a Ferrari, ideal for causal relationships that unfold over years. The Perry Preschool Study is another example: 123 poor African American three- and four-year-olds were randomly assigned to an intensive preschool program or a comparison group and tracked for the next forty years. Those who got the program had higher IQs at five, were likelier to graduate high school, earned more at forty, and the comparison group was far more likely to have been arrested five or more times by forty.</p>"
      },
      {
        h: "Cross-sectional data, the Toyota",
        body: "<p>We can't always afford the Ferrari. A cross-sectional data set gathers information at a single point in time &mdash; the Toyota. Epidemiologists hunting the cause of a new disease may collect data from everyone afflicted (what they ate, where they traveled, what they share in common) plus data from unaffected people for contrast. Wheelan recalls becoming such a data point himself when, a week before his wedding in Kathmandu, he tested positive for a stomach illness later identified as a water-borne cyanobacterium &mdash; filling out a thirty-page survey on every aspect of his life, as did everyone else diagnosed.</p>"
      }
    ],
    takeaways: [
      "Longitudinal: same subjects tracked over time (Framingham, 5,209 in 1948).",
      "Cross-sectional: a single snapshot across subjects (the Toyota).",
      "Long-running data reveal causes that take years or decades to surface."
    ]
  });
  window.CODEVIZ["naked-ch7-longitudinal-vs-cross-sectional"] = {
    charts: [
      {
        type: "line",
        title: "Major Framingham findings by year",
        interpret: "A longitudinal study pays off slowly: landmark cardiovascular findings emerged across nearly fifty years of following the same participants.",
        xlabel: "Year",
        ylabel: "Cumulative landmark findings",
        series: [
          { name: "Cumulative findings", color: "#7ee787", points: [[1960, 1], [1967, 2], [1970, 3], [1988, 4], [2005, 5]] }
        ]
      }
    ]
  };

  B({
    id: "naked-ch7-selection-bias",
    chapter: "Chapter 7",
    title: "Selection bias",
    tagline: "How a sample is chosen can warp it; the Literary Digest poll of 1936 is the classic disaster.",
    sections: [
      {
        h: "Always ask how the sample was chosen",
        body: "<p>Wheelan cites the (likely apocryphal) line attributed to film critic Pauline Kael after Nixon's election &mdash; that she didn't know anyone who voted for him &mdash; as a tidy illustration of how a lousy sample (one's circle of liberal friends) misrepresents a larger population (American voters). The question to always ask: <em>how was the sample chosen?</em> The Iowa straw poll is biased the same way &mdash; Iowans who pay \\$30 to vote differ from other Iowa Republicans, who differ from Republicans nationally (it has predicted only three of the last five nominees). Airport surveys skew wealthy; rest-stop surveys skew the other way; and in any public-place survey, the people willing to stop and answer differ from those who walk by.</p>"
      },
      {
        h: "Literary Digest, 1936",
        body: "<p>The most famous blunder: the <em>Literary Digest</em> poll of 1936, with Republican Alf Landon challenging incumbent Franklin Roosevelt. The magazine mailed a poll to its subscribers and to automobile and telephone owners pulled from public records &mdash; an enormous 10 million prospective voters. But size couldn't save it.</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Popular vote</th><th class=\"num\">Literary Digest prediction</th><th class=\"num\">Actual result</th></tr></thead><tbody><tr><td class=\"row-h\">Landon (R)</td><td class=\"num\">57%</td><td class=\"num\">40%</td></tr><tr><td class=\"row-h\">Roosevelt (D)</td><td class=\"num\">43%</td><td class=\"num\">60%</td></tr></tbody></table><p>Roosevelt won in a landslide, taking forty-six of forty-eight states. The sample was \"garbage in\": in 1936, subscribers and households with cars and telephones were wealthier than average Americans and therefore more likely to vote Republican. Wheelan's warning: as bad samples grow larger, the pile of garbage just gets bigger and smellier.</p>"
      }
    ],
    takeaways: [
      "Always ask how the sample was selected.",
      "Literary Digest: 10 million surveys, predicted 57% Landon; he got 40%.",
      "Car/phone owners in 1936 were richer and skewed Republican."
    ]
  });
  window.CODEVIZ["naked-ch7-selection-bias"] = {
    charts: [
      {
        type: "bars",
        title: "Literary Digest 1936: prediction vs. actual popular vote",
        interpret: "A 10-million-person sample was useless because it was biased toward wealthier, more Republican households; the prediction missed the landslide entirely.",
        labels: ["Landon predicted", "Landon actual", "Roosevelt predicted", "Roosevelt actual"],
        values: [57, 40, 43, 60],
        colors: ["#ffb454", "#ffb454", "#4ea1ff", "#4ea1ff"]
      }
    ]
  };

  B({
    id: "naked-ch7-self-selection-bias",
    chapter: "Chapter 7",
    title: "Self-selection bias",
    tagline: "When subjects volunteer for a treatment group, they differ from everyone else in ways that confound the result.",
    sections: [
      {
        h: "Non-random sorting into groups",
        body: "<p>The same comparison problem arises when the mechanism sorting people into treatment versus control isn't random. Wheelan first notes a related issue with a prostate-cancer study of 1,000 men documenting sexual function two years after each of three treatments: 35% retained function in the surgery group, 37% in the radiation group, and 43% in the brachytherapy group. One cannot conclude brachytherapy best preserves function &mdash; the study's authors warn its recipients tend to be younger and fitter; the study only meant to document side effects, not rank the treatments.</p>"
      },
      {
        h: "Volunteers are different",
        body: "<p>Self-selection bias arises whenever individuals <em>volunteer</em> for a treatment group. Prisoners who volunteer for a drug-treatment program differ from other prisoners precisely <em>because</em> they volunteered. If those participants stay out of prison after release, that's great &mdash; but it tells us nothing about the program's value. They may have turned their lives around because of the program, or because of other traits (like a strong desire to avoid returning to prison) that also made them likely to volunteer. We cannot separate the program's effect from the kind of person who signs up.</p>"
      }
    ],
    takeaways: [
      "Self-selection: volunteers differ from non-volunteers by definition.",
      "Drug-program volunteers staying out of prison proves nothing about the program.",
      "Brachytherapy's 43% reflects younger, fitter patients, not a better treatment."
    ]
  });

  B({
    id: "naked-ch7-publication-bias",
    chapter: "Chapter 7",
    title: "Publication bias",
    tagline: "Positive findings get published and negative ones get buried, distorting the literature the public sees.",
    sections: [
      {
        h: "Why negative findings vanish",
        body: "<p>Positive findings are more likely to be published than negative ones. Suppose a rigorous twenty-year study of 100,000 Americans concludes that playing video games does <em>not</em> prevent colon cancer. No journal would publish it: there's no reason to expect a link, and \"does not prevent cancer\" isn't an interesting result. But if a classmate's study finds video games <em>do</em> lower colon-cancer incidence, that's exciting &mdash; it gets published, covered, and amplified. The danger: of 100 studies, the 99 finding no link stay unpublished while the lone fluke makes print, so a reader of the literature sees only the one study suggesting video games prevent cancer.</p>"
      },
      {
        h: "The antidepressant numbers",
        body: "<p>The problem is real. Wheelan cites a <em>New York Times</em> report that makers of antidepressants like Prozac and Paxil never published about a third of the trials they ran for government approval, misleading doctors and consumers.</p><ul class=\"steps\"><li>94% of studies with <em>positive</em> findings on these drugs were published.</li><li>Only 14% of studies with <em>nonpositive</em> results were published.</li><li>When all studies are counted, the drugs beat a placebo by only \"a modest margin.\"</li></ul><p>To combat this, medical journals now typically require studies to be registered at the outset to be eligible for publication later &mdash; giving editors a way to detect how many nonpositive results went unreported.</p>"
      }
    ],
    takeaways: [
      "Publication bias: exciting positives print, dull negatives don't.",
      "94% of positive antidepressant studies published vs. only 14% of nonpositive ones.",
      "Registering studies up front exposes the buried negative results."
    ]
  });
  window.CODEVIZ["naked-ch7-publication-bias"] = {
    charts: [
      {
        type: "bars",
        title: "Antidepressant trials: publication rate by result",
        interpret: "Positive results were published far more often than nonpositive ones, so the visible literature overstates the drugs' effectiveness.",
        labels: ["Positive findings", "Nonpositive findings"],
        values: [94, 14],
        colors: ["#7ee787", "#ffb454"]
      }
    ]
  };

  B({
    id: "naked-ch7-recall-bias",
    chapter: "Chapter 7",
    title: "Recall bias",
    tagline: "Memory is systematically fragile; a present outcome can quietly rewrite how people remember their past.",
    sections: [
      {
        h: "Memory rewrites the past",
        body: "<p>We instinctively try to explain present outcomes as logical consequences of the past, but memory turns out to be \"systematically fragile\" when we reach back to explain a good or bad outcome. A 1993 study by a Harvard researcher compiled a group of women with breast cancer and an age-matched group without it, then asked both about their earlier dietary habits. The clear finding: women with breast cancer were significantly more likely to report having eaten high-fat diets when younger.</p>"
      },
      {
        h: "A study of memory, not diet",
        body: "<p>But this wasn't really a study of how diet affects cancer &mdash; it was a study of how getting cancer affects a woman's <em>memory</em> of her earlier diet. All the women had filled out dietary surveys years earlier, before any diagnosis. The striking part: women later diagnosed with breast cancer recalled diets far higher in fat than what they had actually reported eating; women without cancer did not. The diagnosis had altered not just their present and future but their past &mdash; they unconsciously decided a high-fat diet had predisposed them and then recalled one.</p><p>This is a key reason longitudinal studies are often preferred to cross-sectional ones: in a longitudinal study data are collected contemporaneously. You can ask a five-year-old about school now, then revisit him thirteen years later to see if he dropped out &mdash; rather than asking an eighteen-year-old dropout to recall how he felt at five, which is far less reliable.</p>"
      }
    ],
    takeaways: [
      "Recall bias: the present outcome reshapes memory of the past.",
      "Breast-cancer patients \"remembered\" higher-fat diets than they had reported.",
      "Collecting data contemporaneously (longitudinal) avoids this trap."
    ]
  });

  B({
    id: "naked-ch7-survivorship-bias",
    chapter: "Chapter 7",
    title: "Survivorship bias",
    tagline: "When the worst observations drop out, the survivors' average rises even though nothing actually improved.",
    sections: [
      {
        h: "The principal whose scores keep rising",
        body: "<p>Suppose a principal reports that a cohort's test scores rose every year &mdash; sophomore beat freshman, junior beat sophomore, senior best of all &mdash; with no cheating and no statistical trickery, improving by every measure: mean, median, percentage at grade level. Nominate him for principal of the year, or demand more data? Wheelan says demand more, because he smells <strong>survivorship bias</strong>: results shift when observations fall out of the sample, changing the composition of what remains.</p>"
      },
      {
        h: "Dropouts can lift the average",
        body: "<p>Suppose the principal is actually awful and each year half the students drop out. If the worst (lowest-scoring) students are likeliest to leave, the average of those remaining climbs steadily &mdash; without any individual student improving. As Wheelan puts it, forcing the short people to leave a room raises the room's average height, but it doesn't make anyone taller.</p>"
      },
      {
        h: "The mutual-fund trick",
        body: "<p>The mutual-fund industry exploits this. Funds are gauged against the S&amp;P 500, and beating it consistently is hard &mdash; roughly half of actively managed funds outperform in a given year, half underperform. So a company opens many new funds (say 20), each with about a 50% chance of beating the index each year, and lets chance do the work:</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Stage</th><th class=\"num\">Funds still beating the S&amp;P 500</th></tr></thead><tbody><tr><td class=\"row-h\">20 new funds opened</td><td class=\"num\">20</td></tr><tr><td class=\"row-h\">Beat it year 1 (about half)</td><td class=\"num\">10</td></tr><tr><td class=\"row-h\">Beat it 2 years running</td><td class=\"num\">5</td></tr><tr><td class=\"row-h\">Beat it 3 years running</td><td class=\"num\">2&ndash;3</td></tr></tbody></table><p>The unimpressive funds are quietly closed and folded into others, and the surviving two or three are advertised as having \"consistently outperformed the S&amp;P 500\" &mdash; even though that record is the stock-picking equivalent of flipping three heads in a row. Their performance tends to revert to the mean once investors pile in.</p>"
      }
    ],
    takeaways: [
      "Survivorship bias: dropping the worst observations inflates the survivors' average.",
      "Removing the shortest people raises average height without anyone growing.",
      "20 funds at 50% odds leave 2&ndash;3 \"winners\" after three years by pure chance."
    ]
  });
  window.CODEVIZ["naked-ch7-survivorship-bias"] = {
    charts: [
      {
        type: "bars",
        title: "Funds still beating the S&P 500 over three years (20 starting funds)",
        interpret: "With a 50% chance each year, the number of consistent 'winners' shrinks by half annually; the survivors are advertised as skilled when they are merely lucky.",
        labels: ["Start", "Year 1", "Year 2", "Year 3"],
        values: [20, 10, 5, 2.5],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff"]
      }
    ]
  };

  B({
    id: "naked-ch7-healthy-user-bias",
    chapter: "Chapter 7",
    title: "Healthy user bias",
    tagline: "People who do healthy things differ from those who don't, so the behavior gets credit that the person deserves.",
    sections: [
      {
        h: "Vitamins and purple pajamas",
        body: "<p>People who take vitamins regularly tend to be healthy &mdash; because they are the kind of people who take vitamins regularly, whether or not the vitamins do anything. Wheelan dramatizes this with a thought experiment: imagine officials claim babies should sleep only in purple pajamas to stimulate brain development. Twenty years on, research finds wearing purple pajamas as a child is overwhelmingly associated with later success &mdash; 98% of entering Harvard freshmen wore purple pajamas as children, versus only 3% of inmates in the Massachusetts prison system.</p>"
      },
      {
        h: "The person, not the behavior",
        body: "<p>The pajamas don't matter; having the <em>kind of parents</em> who put their children in purple pajamas does. Even controlling for things like parental education, unobservable differences remain between those parents and the rest. As Gary Taubes explains, people who faithfully do things that are good for them &mdash; taking a drug as prescribed, eating what they believe is a healthy diet &mdash; are fundamentally different from those who don't. This confounds any study of healthful activities like exercising or eating kale: if treatment and control aren't randomly assigned, the two groups differ in two respects, not one.</p>"
      }
    ],
    takeaways: [
      "Healthy-user bias: the healthy behavior marks a different kind of person.",
      "Purple pajamas: 98% of Harvard freshmen vs. 3% of inmates &mdash; the parents matter, not the pajamas.",
      "Without randomization, treatment and control differ in more than the treatment."
    ]
  });
  window.CODEVIZ["naked-ch7-healthy-user-bias"] = {
    charts: [
      {
        type: "bars",
        title: "Wore purple pajamas as a child (thought experiment)",
        interpret: "The huge gap reflects the kind of parents a child had, not any effect of the pajamas themselves — the hallmark of healthy-user bias.",
        labels: ["Harvard freshmen", "State prison inmates"],
        values: [98, 3],
        colors: ["#c89bff", "#ffb454"]
      }
    ]
  };
})();
