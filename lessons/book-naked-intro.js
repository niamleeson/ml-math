/* "Naked Statistics" (Charles Wheelan) — Introduction: Why I Hated Calculus but Love Statistics
   One consolidated lesson covering every concept in the chapter. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-intro",
    chapter: "Introduction",
    title: "Why I Hated Calculus but Love Statistics",
    tagline: "Why purpose and intuition — not formulas — are the way into statistics.",
    sections: [
      { body: "<h3 class=\"book-concept\">Math needs a purpose</h3><p class=\"book-lead\">Wheelan disliked calculus because no one explained why it mattered, but loved physics because it had a clear use.</p><h4 class=\"book-sub\">The complaint</h4><p>Wheelan opens by admitting an uncomfortable relationship with math. He never liked numbers for their own sake, and was unimpressed by fancy formulas with no real-world use. His chief gripe with high school calculus was that no one told him why he needed it &mdash; \"What is the area beneath a parabola? Who cares?\"</p><h4 class=\"book-sub\">Physics, by contrast, had a point</h4><p>He loved high school physics even though it leans on the very same calculus he refused to do in class. The difference was purpose. He recalls his physics teacher, during the World Series, using the basic formula for acceleration to estimate how far a home run had been hit &mdash; a concrete, interesting use of the same math. In college he enjoyed probability for the same reason: it gave insight into real-life situations.</p><p>His later realization: it was never the math itself that bothered him, but that no one bothered to explain the point of it.</p>" },
      { body: "<h3 class=\"book-concept\">Statistics is everywhere</h3><p class=\"book-lead\">The same set of tools explains topics from DNA testing to the lottery, disease risk, cheating, and even game shows.</p><h4 class=\"book-sub\">The paradox of statistics</h4><p>Wheelan loves statistics (which, for this book, he treats as including probability). He notes a paradox: statistics is everywhere &mdash; from batting averages to presidential polls &mdash; yet the field has a reputation for being dull and inaccessible.</p><h4 class=\"book-sub\">What it can do</h4><p>He lists concrete payoffs to make the case that it is worth learning:</p><ul class=\"steps\"><li>Explain DNA testing.</li><li>Expose the idiocy of playing the lottery.</li><li>Identify factors associated with diseases like cancer and heart disease.</li><li>Help spot cheating on standardized tests.</li><li>Even help you win on game shows.</li></ul>" },
      { body: "<h3 class=\"book-concept\">The Monty Hall problem</h3><p class=\"book-lead\">On Let's Make a Deal a player faces three doors; after one losing door is revealed, switching is the better choice.</p><h4 class=\"book-sub\">The setup</h4><p>Wheelan uses the game show <em>Let's Make a Deal</em>, hosted by Monty Hall, as a teaser for the power of statistics. A successful player faces three doors: Door no. 1, no. 2, and no. 3. A desirable prize (say a new car) sits behind one door; a goat sits behind each of the other two. The player picks a door and wins whatever is behind it.</p><h4 class=\"book-sub\">The twist</h4><p>At first the player has a 1-in-3 chance of picking the prize door. But the show adds a twist. Suppose the player chooses Door no. 1. Monty &mdash; who knows where the prize is &mdash; opens one of the other two doors to reveal a goat (say Door no. 3). Two doors stay closed, nos. 1 and 2. Monty then asks whether the player wants to switch from no. 1 to no. 2.</p><h4 class=\"book-sub\">Should he switch?</h4><p>The only new information is that a goat showed up behind a door the player did not pick. Wheelan poses the question &mdash; should he switch? &mdash; and gives the answer: <strong>yes</strong>. He defers the explanation of why to Chapter 5&frac12; of the book.</p>" },
      { body: "<h3 class=\"book-concept\">Intuition before the math</h3><p class=\"book-lead\">An infinite series of half-steps toward a wall never reaches it, yet the total distance converges to a finite 2 feet.</p><h4 class=\"book-sub\">The math-camp epiphany</h4><p>In graduate-school \"math camp,\" an instructor tried to show how the sum of an infinite series can converge to a finite number. An infinite series is a pattern of numbers that continues forever, such as $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$ &mdash; the dots meaning it goes on to infinity. The class struggled with how something infinite could add up to something finite.</p><h4 class=\"book-sub\">The walk-to-the-wall picture</h4><p>Wheelan found the intuition by imagining standing exactly 2 feet from a wall and repeatedly moving half the remaining distance:</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Move</th><th class=\"num\">Distance moved</th><th class=\"num\">Distance left to wall</th></tr></thead><tbody><tr><td class=\"row-h\">Start</td><td class=\"num\">&mdash;</td><td class=\"num\">2 ft</td></tr><tr><td class=\"row-h\">1</td><td class=\"num\">1 ft</td><td class=\"num\">1 ft</td></tr><tr><td class=\"row-h\">2</td><td class=\"num\">&frac12; ft (6 in)</td><td class=\"num\">&frac12; ft</td></tr><tr><td class=\"row-h\">3</td><td class=\"num\">&frac14; ft (3 in)</td><td class=\"num\">&frac14; ft</td></tr><tr><td class=\"row-h\">4</td><td class=\"num\">&frac18; ft (1&frac12; in)</td><td class=\"num\">&frac18; ft</td></tr></tbody></table><p>Each step covers only half of what remains, so you get infinitely close to the wall but never hit it &mdash; for example, from 1/1024th of an inch away you move another 1/2048th of an inch. In feet the moves form the series $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$</p><h4 class=\"book-sub\">The insight</h4><p>Although you keep moving forever, the total distance traveled can never exceed your starting distance of 2 feet. A mathematician would say the series $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$ converges to 2. Wheelan still can't reproduce the formal proof, but the intuition made the math make sense &mdash; his point being that intuition makes the technical details understandable, and not usually the other way around.</p>" },
      { body: "<h3 class=\"book-concept\">Statistics can mislead</h3><p class=\"book-lead\">Cheap computing lets anyone run sophisticated procedures, so bad data or misuse can produce dangerously wrong conclusions.</p><h4 class=\"book-sub\">Power in the wrong hands</h4><p>Having argued statistics should be more accessible, Wheelan makes a seemingly contradictory point: it can be <em>overly</em> accessible. Anyone with data and a computer can run sophisticated procedures with a few keystrokes. If the data are poor or the techniques are misused, the conclusions can be wildly misleading and even dangerous.</p><h4 class=\"book-sub\">The short-breaks-and-cancer example</h4><p>He invents a deliberately absurd headline: <em>People Who Take Short Breaks at Work Are Far More Likely to Die of Cancer.</em> The supposed evidence:</p><ul class=\"steps\"><li>A study of 36,000 office workers &mdash; a huge data set.</li><li>Workers who reported taking regular ten-minute breaks were 41 percent more likely to develop cancer over the next five years than those who did not leave their offices.</li></ul><p>The naive reaction is to launch a campaign against short breaks. The likelier explanation: the break-takers are stepping outside to smoke cigarettes. It is probably the smoking, not the breaks, that causes the cancer &mdash; a correlation mistaken for a cause.</p><h4 class=\"book-sub\">Handle with care</h4><p>Wheelan compares statistics to a high-caliber weapon: helpful when used correctly and potentially disastrous in the wrong hands. The book won't make you an expert, but it aims to teach enough care and respect that you don't do \"the statistical equivalent of blowing someone's head off.\"</p>" },
      { body: "<h3 class=\"book-concept\">The mission of the book</h3><p class=\"book-lead\">Teach the intuition behind the most relevant statistical ideas, because it is easy to lie with statistics but hard to tell the truth without them.</p><h4 class=\"book-sub\">Intuition over machinery</h4><p>This is not a textbook, which frees Wheelan to choose the most relevant topics and the clearest explanations. The book is short on math, equations, and graphs and long on examples, organized around the concepts that matter most in everyday life &mdash; how scientists conclude something causes cancer, how polling works and what can go wrong, how people lie with statistics, and how a credit card company uses your purchases to predict whether you'll miss a payment.</p><h4 class=\"book-sub\">The guiding quote</h4><p>Every chapter promises to answer the question Wheelan once asked his calculus teacher to no effect: \"What is the point of this?\" He hopes to persuade readers of an observation by Swedish mathematician and writer Andrejs Dunkels: \"It's easy to lie with statistics, but it's hard to tell the truth without them.\"</p><p>His bolder aspiration is that you might actually enjoy statistics. The key is to separate the important ideas from the arcane technical details that get in the way &mdash; \"That is Naked Statistics.\"</p>" }
    ],
    takeaways: [
      "The objection was to math without motivation, not to math itself.",
      "Statistics shows up far more often than its dull reputation suggests.",
      "Initial pick wins with probability 1 in 3.",
      "Halving the gap forever gets you arbitrarily close but never to the wall.",
      "Easy tools plus bad data or misuse equals confidently wrong answers.",
      "Goal: make the most relevant statistical concepts intuitive and accessible."
    ]
  });
  window.CODEVIZ["naked-intro"] = {
    charts: [
      {
        "type": "line",
        "title": "Cumulative distance traveled toward the wall (feet)",
        "interpret": "Each half-step adds less than the last, so the running total climbs toward 2 feet but never reaches it.",
        "xlabel": "Move number",
        "ylabel": "Total distance traveled (ft)",
        "series": [
          {
            "name": "Cumulative distance",
            "color": "#4ea1ff",
            "points": [
              [
                1,
                1
              ],
              [
                2,
                1.5
              ],
              [
                3,
                1.75
              ],
              [
                4,
                1.875
              ],
              [
                5,
                1.9375
              ],
              [
                6,
                1.96875
              ]
            ]
          }
        ]
      }
    ]
  };
})();
