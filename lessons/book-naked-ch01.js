/* "Naked Statistics" (Charles Wheelan) — Chapter 1: What's the Point?
   One consolidated lesson covering every concept in the chapter. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch1",
    chapter: "Chapter 1",
    title: "What's the Point?",
    tagline: "Why we reduce the world to single numbers, and what those numbers can and can't tell us.",
    sections: [
      { body: "<h3 class=\"book-concept\">The Passer Rating as One Number</h3><p class=\"book-lead\">A single statistic squeezes a quarterback's whole game into one comparable figure.</p><h4 class=\"book-sub\">What the number does</h4>The NFL passer rating is the book's opening example of a statistic. It folds four separate inputs about a quarterback's day — completion rate, average yards per pass attempt, share of pass attempts that are touchdowns, and interception rate — into one figure. Wheelan stresses that the rating is not the only way to combine those inputs: weight the pieces differently and you would get a different, equally defensible number. It is therefore somewhat flawed and arbitrary, yet handy, because one number lets you encapsulate a performance and compare two players at a glance.<h4 class=\"book-sub\">The book's worked comparison</h4>Wheelan uses the 2011 playoffs (Bears versus Packers, which the Packers won) and one earlier-season game to show how the single number drives a quick comparison.<table class=\"extable\"><thead><tr><th>passer</th><th>game</th><th class=\"num\">passer rating</th></tr></thead><tbody><tr><td class=\"row-h\">Jay Cutler (Bears)</td><td>2011 playoffs vs. Packers</td><td class=\"num\">31.8</td></tr><tr><td class=\"row-h\">Aaron Rodgers (Packers)</td><td>2011 playoffs</td><td class=\"num\">55.4</td></tr><tr><td class=\"row-h\">Jay Cutler (Bears)</td><td>earlier-season game vs. Green Bay</td><td class=\"num\">85.6</td></tr></tbody></table><ul class=\"steps\"><li>In the playoff loss Cutler's 31.8 sits below Rodgers' 55.4 — one number says Cutler was outgunned.</li><li>Cutler's earlier 85.6 against the same opponent dwarfs his playoff 31.8, hinting at why the Bears beat the Packers earlier but lost in the playoffs.</li><li>No play-by-play needed: the lone figures already tell much of the story.</li></ul>" },
      { body: "<h3 class=\"book-concept\">Simplifying Is Strength and Weakness</h3><p class=\"book-lead\">Collapsing data to one number is exactly what helps and what hurts.</p><h4 class=\"book-sub\">The double-edged trade</h4>Wheelan says simplifying is \"both the strength and the weakness of any descriptive statistic.\" The single passer rating tells you Cutler was outgunned by Rodgers in the playoff loss. The same number stays silent on the texture of the game: whether a quarterback got a bad break (a perfect pass bobbled by a receiver and intercepted), whether he \"stepped up\" on a crucial third down rather than a meaningless end-of-game play (every completion is weighted the same), or whether the defense was simply terrible. He generalizes this with examples the reader already knows — a batting average that compresses a long career, and a grade point average.<h4 class=\"book-sub\">The GPA example and its distortion</h4>A GPA assigns each letter a point value, then averages. It is easy to compute, easy to read, easy to compare across students — a nice descriptive statistic. But it ignores course difficulty, so a 3.4 in easy classes can outrank a 2.9 earned in calculus and physics.<table class=\"extable\"><thead><tr><th>letter grade</th><th class=\"num\">point value</th></tr></thead><tbody><tr><td class=\"row-h\">A</td><td class=\"num\">4</td></tr><tr><td class=\"row-h\">B</td><td class=\"num\">3</td></tr><tr><td class=\"row-h\">C</td><td class=\"num\">2</td></tr></tbody></table><ul class=\"steps\"><li>Wheelan's school tried to fix this by counting an A in an honors class as 5 instead of 4.</li><li>That backfired: for a heavy honors student, any A in a nonhonors course (gym, health) would pull the GPA below 5 and so drag it down.</li><li>Moral: leaning too hard on one descriptive statistic can mislead or push odd behavior — simplifying always sheds some nuance.</li></ul>" },
      { body: "<h3 class=\"book-concept\">The Gini Index for Inequality</h3><p class=\"book-lead\">One number from 0 to 1 captures how evenly a country shares its wealth.</p><h4 class=\"book-sub\">Definition and scale</h4>The Gini index is economics' standard single-number tool for income (or wealth) inequality, and Wheelan's point is that it works \"just like the passer rating\" — it collapses complex information into one figure with no intrinsic meaning, useful only for comparison. It runs on a scale from zero to one.<ul class=\"steps\"><li>A country where every household holds identical wealth would score 0 (perfectly equal).</li><li>A country where one household held all the wealth would score 1 (perfectly unequal).</li><li>So the closer to 1, the more unequal the distribution.</li></ul>It can be computed for income or wealth, per individual or per household; those versions are highly correlated but not identical.<h4 class=\"book-sub\">The United States figure</h4>Per the CIA, the United States has a Gini index of .45. (The index is sometimes multiplied by 100 to make it a whole number, which would put the U.S. at 45.) By itself .45 means little; it only becomes informative once placed beside other countries or other years — the subject of the next lesson." },
      { body: "<h3 class=\"book-concept\">Comparing Across Place and Time</h3><p class=\"book-lead\">A lone statistic gains meaning only next to others — across countries or across years.</p><h4 class=\"book-sub\">Across countries</h4>Once the U.S. .45 is set against other nations, it locates the country in the global spread of inequality.<table class=\"extable\"><thead><tr><th>country</th><th class=\"num\">Gini index</th></tr></thead><tbody><tr><td class=\"row-h\">Sweden</td><td class=\"num\">.23</td></tr><tr><td class=\"row-h\">Canada</td><td class=\"num\">.32</td></tr><tr><td class=\"row-h\">China</td><td class=\"num\">.42</td></tr><tr><td class=\"row-h\">United States</td><td class=\"num\">.45</td></tr><tr><td class=\"row-h\">Brazil</td><td class=\"num\">.54</td></tr><tr><td class=\"row-h\">South Africa</td><td class=\"num\">.65</td></tr></tbody></table>The U.S. sits in the more-unequal half of this list — well above Sweden and Canada, below Brazil and South Africa.<h4 class=\"book-sub\">Across time</h4>The index also tracks change within one country.<ul class=\"steps\"><li>The U.S. Gini went from .41 in 1997 to .45 over the next decade (latest CIA data are 2007) — the country grew richer while wealth grew more unequal.</li><li>Canada's inequality was basically unchanged over roughly the same stretch.</li><li>Sweden's Gini fell from .25 in 1992 to .23 in 2005 — it grew richer and more equal.</li></ul>Wheelan's verdict: the Gini index is no more a perfect measure of inequality than the passer rating is of quarterbacking, but it delivers valuable information on a socially important phenomenon in a convenient format." },
      { body: "<h3 class=\"book-concept\">Inference From Samples</h3><p class=\"book-lead\">Use the data you can gather to draw conclusions about the world you cannot fully see.</p><h4 class=\"book-sub\">From the known world to the unknown</h4>A core job of statistics, Wheelan writes, is to take data we have and make informed conjectures about larger questions we lack full information on — using the \"known world\" to infer the \"unknown world.\" How many homeless people live on Chicago's streets is his lead example: counting everyone is expensive and hard, yet a credible number is needed for social services, funding eligibility, and congressional representation. The tool is sampling — gather careful data on a small piece (a handful of census tracts) and extrapolate to the whole city. Sampling uses far fewer resources and, done right, can be every bit as accurate.<h4 class=\"book-sub\">Polling as sampling</h4>A political poll is sampling in action: a research firm contacts a sample of households chosen to represent the larger population and asks their views, far cheaper and faster than reaching everyone.<ul class=\"steps\"><li>Gallup reckons a methodologically sound poll of 1,000 households yields roughly the same result as polling every household in America.</li><li>The same logic let the National Opinion Research Center (University of Chicago) study American sexual behavior in the mid-1990s from a large, representative in-person sample.</li></ul>" },
      { body: "<h3 class=\"book-concept\">Probability for Risk and Cheating</h3><p class=\"book-lead\">Knowing the odds underpins insurance, risk management, and spotting suspicious patterns.</p><h4 class=\"book-sub\">Risk and insurance</h4>Any single dice roll or card turn is uncertain, but the underlying probabilities are known — which is why casinos always win in the long run as bets pile up. Wheelan extends this beyond casinos. Businesses cannot make risk vanish, but they can engineer processes so an adverse outcome's probability is acceptably low, and Wall Street weights portfolio scenarios by their probability (he notes the 2008 crisis sprang partly from events deemed extremely unlikely). Insurance rests on the same foundation: the industry does not stop cars crashing or houses burning; it charges premiums set to more than cover the expected payouts from those events, and it nudges expected payouts down by encouraging safe driving, smoke detectors, and so on.<h4 class=\"book-sub\">Catching cheating</h4>Probability can flag wrongdoing. The firm Caveon Test Security does \"data forensics\" on exams.<ul class=\"steps\"><li>It flags a school or test site where the count of identical <em>wrong</em> answers is wildly unlikely — a pattern that would arise by chance less than one time in a million.</li><li>Many students getting an answer right is uninformative; many sharing the <em>same wrong</em> answer suggests copying.</li><li>It also flags exams where a taker does far better on hard questions than easy ones, or where \"wrong to right\" erasures far outnumber \"right to wrong\" ones.</li></ul>Wheelan cautions that probability needs judgment: a statistical anomaly is not proof. Delma Kinney won \\$1 million in an instant lottery game in 2008 and another in 2011; the chance of the same person doing that is roughly 1 in 25 trillion, yet that figure alone cannot convict him of fraud." },
      { body: "<h3 class=\"book-concept\">Association Versus Causation</h3><p class=\"book-lead\">Statistics can isolate a relationship between variables yet stop short of proving cause.</p><h4 class=\"book-sub\">Why a clean experiment is often impossible</h4>To prove smoking causes cancer the scientific method wants a controlled experiment where only the variable of interest differs between groups — but we cannot assign people to smoke for decades; it would be unethical. We also cannot simply compare smokers and nonsmokers at a class reunion: the two groups likely differ in other ways (heavy drinking, poor diet) that also harm health, so any difference is confounded, and the sickest smokers are least likely to attend, biasing the data. Statistics, Wheelan says, becomes less like long division and more like good detective work — the data are clues, and analysis crafts them into a conclusion.<h4 class=\"book-sub\">Regression isolates association, not always cause</h4>Regression analysis isolates the relationship between two variables while holding other important variables constant (\"controlling for\" diet, exercise, weight). Wheelan's illustration: a study might find people who eat a bran muffin daily have a 9 percent lower incidence of colon cancer, controlling for other factors, and also gauge how likely that link is mere coincidence.<ul class=\"steps\"><li>Regression can (1) quantify the association and (2) estimate the chance it is just a quirk of this sample.</li><li>A \"statistically significant\" finding means the association is unlikely to be chance alone.</li><li>But a strong association need not be causal — we may not know <em>why</em> the relationship exists.</li></ul>His real example: economist Alan Krueger found terrorists \"tend to be drawn from well-educated, middle-class or high-income families\" — an association, while the causal explanation (motivation by political goals, reaction to repression) remains a hypothesis." }
    ],
    takeaways: [
      "A descriptive statistic packs many inputs into one comparable number.",
      "One number is handy precisely because it drops detail — that loss of detail is the cost.",
      "Gini runs 0 (everyone equal) to 1 (one household owns everything).",
      "U.S. .45 ranks between China (.42) and Brazil (.54); Sweden (.23) and Canada (.32) are more equal, South Africa (.65) more unequal.",
      "Inference uses a known sample to estimate an unknown whole.",
      "Casinos, Wall Street, and insurers all rest on knowing the underlying probabilities.",
      "Ethics and confounding often rule out the clean controlled experiment."
    ]
  });
  window.CODEVIZ["naked-ch1"] = {
    charts: [
      {
        "type": "bars",
        "title": "Passer ratings the book compares",
        "interpret": "Cutler's playoff 31.8 trails Rodgers' 55.4 and is far below his own earlier 85.6.",
        "labels": [
          "Cutler playoff",
          "Rodgers playoff",
          "Cutler earlier"
        ],
        "values": [
          31.8,
          55.4,
          85.6
        ],
        "colors": [
          "#ffb454",
          "#7ee787",
          "#4ea1ff"
        ]
      },
      {
        "type": "bars",
        "title": "Gini index by country",
        "interpret": "The U.S. (.45) lands in the more-unequal half — above Sweden and Canada, below Brazil and South Africa.",
        "labels": [
          "Sweden",
          "Canada",
          "China",
          "United States",
          "Brazil",
          "South Africa"
        ],
        "values": [
          0.23,
          0.32,
          0.42,
          0.45,
          0.54,
          0.65
        ],
        "colors": [
          "#7ee787",
          "#7ee787",
          "#4ea1ff",
          "#ffb454",
          "#c89bff",
          "#c89bff"
        ]
      },
      {
        "type": "line",
        "title": "Gini index over time",
        "interpret": "U.S. inequality rose (.41 to .45) while Sweden's eased (.25 to .23).",
        "xlabel": "year",
        "ylabel": "Gini index",
        "series": [
          {
            "name": "United States",
            "color": "#ffb454",
            "points": [
              [
                1997,
                0.41
              ],
              [
                2007,
                0.45
              ]
            ]
          },
          {
            "name": "Sweden",
            "color": "#7ee787",
            "points": [
              [
                1992,
                0.25
              ],
              [
                2005,
                0.23
              ]
            ]
          }
        ]
      }
    ]
  };
})();
