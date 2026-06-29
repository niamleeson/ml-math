/* Naked Statistics (Charles Wheelan) — Introduction: "Why I hated calculus but love statistics" */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-intro-purpose-over-formulas",
    chapter: "Introduction",
    title: "Math needs a purpose",
    tagline: "Wheelan disliked calculus because no one explained why it mattered, but loved physics because it had a clear use.",
    sections: [
      {
        h: "The complaint",
        body: "<p>Wheelan opens by admitting an uncomfortable relationship with math. He never liked numbers for their own sake, and was unimpressed by fancy formulas with no real-world use. His chief gripe with high school calculus was that no one told him why he needed it &mdash; \"What is the area beneath a parabola? Who cares?\"</p>"
      },
      {
        h: "Physics, by contrast, had a point",
        body: "<p>He loved high school physics even though it leans on the very same calculus he refused to do in class. The difference was purpose. He recalls his physics teacher, during the World Series, using the basic formula for acceleration to estimate how far a home run had been hit &mdash; a concrete, interesting use of the same math. In college he enjoyed probability for the same reason: it gave insight into real-life situations.</p><p>His later realization: it was never the math itself that bothered him, but that no one bothered to explain the point of it.</p>"
      }
    ],
    takeaways: [
      "The objection was to math without motivation, not to math itself.",
      "Physics and probability hooked him because they answered real questions.",
      "Intuition and purpose come first; the formulas follow."
    ]
  });

  B({
    id: "naked-intro-statistics-everywhere",
    chapter: "Introduction",
    title: "Statistics is everywhere",
    tagline: "The same set of tools explains topics from DNA testing to the lottery, disease risk, cheating, and even game shows.",
    sections: [
      {
        h: "The paradox of statistics",
        body: "<p>Wheelan loves statistics (which, for this book, he treats as including probability). He notes a paradox: statistics is everywhere &mdash; from batting averages to presidential polls &mdash; yet the field has a reputation for being dull and inaccessible.</p>"
      },
      {
        h: "What it can do",
        body: "<p>He lists concrete payoffs to make the case that it is worth learning:</p><ul class=\"steps\"><li>Explain DNA testing.</li><li>Expose the idiocy of playing the lottery.</li><li>Identify factors associated with diseases like cancer and heart disease.</li><li>Help spot cheating on standardized tests.</li><li>Even help you win on game shows.</li></ul>"
      }
    ],
    takeaways: [
      "Statistics shows up far more often than its dull reputation suggests.",
      "Wheelan folds probability into \"statistics\" for the book's purposes."
    ]
  });

  B({
    id: "naked-intro-monty-hall",
    chapter: "Introduction",
    title: "The Monty Hall problem",
    tagline: "On Let's Make a Deal a player faces three doors; after one losing door is revealed, switching is the better choice.",
    sections: [
      {
        h: "The setup",
        body: "<p>Wheelan uses the game show <em>Let's Make a Deal</em>, hosted by Monty Hall, as a teaser for the power of statistics. A successful player faces three doors: Door no. 1, no. 2, and no. 3. A desirable prize (say a new car) sits behind one door; a goat sits behind each of the other two. The player picks a door and wins whatever is behind it.</p>"
      },
      {
        h: "The twist",
        body: "<p>At first the player has a 1-in-3 chance of picking the prize door. But the show adds a twist. Suppose the player chooses Door no. 1. Monty &mdash; who knows where the prize is &mdash; opens one of the other two doors to reveal a goat (say Door no. 3). Two doors stay closed, nos. 1 and 2. Monty then asks whether the player wants to switch from no. 1 to no. 2.</p>"
      },
      {
        h: "Should he switch?",
        body: "<p>The only new information is that a goat showed up behind a door the player did not pick. Wheelan poses the question &mdash; should he switch? &mdash; and gives the answer: <strong>yes</strong>. He defers the explanation of why to Chapter 5&frac12; of the book.</p>"
      }
    ],
    takeaways: [
      "Initial pick wins with probability 1 in 3.",
      "Monty always reveals a goat behind a door you did not choose.",
      "Switching is the better strategy; the reasoning comes later in the book."
    ]
  });

  B({
    id: "naked-intro-intuition-first",
    chapter: "Introduction",
    title: "Intuition before the math",
    tagline: "An infinite series of half-steps toward a wall never reaches it, yet the total distance converges to a finite 2 feet.",
    sections: [
      {
        h: "The math-camp epiphany",
        body: "<p>In graduate-school \"math camp,\" an instructor tried to show how the sum of an infinite series can converge to a finite number. An infinite series is a pattern of numbers that continues forever, such as $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$ &mdash; the dots meaning it goes on to infinity. The class struggled with how something infinite could add up to something finite.</p>"
      },
      {
        h: "The walk-to-the-wall picture",
        body: "<p>Wheelan found the intuition by imagining standing exactly 2 feet from a wall and repeatedly moving half the remaining distance:</p><table class=\"extable\"><thead><tr><th class=\"row-h\">Move</th><th class=\"num\">Distance moved</th><th class=\"num\">Distance left to wall</th></tr></thead><tbody><tr><td class=\"row-h\">Start</td><td class=\"num\">&mdash;</td><td class=\"num\">2 ft</td></tr><tr><td class=\"row-h\">1</td><td class=\"num\">1 ft</td><td class=\"num\">1 ft</td></tr><tr><td class=\"row-h\">2</td><td class=\"num\">&frac12; ft (6 in)</td><td class=\"num\">&frac12; ft</td></tr><tr><td class=\"row-h\">3</td><td class=\"num\">&frac14; ft (3 in)</td><td class=\"num\">&frac14; ft</td></tr><tr><td class=\"row-h\">4</td><td class=\"num\">&frac18; ft (1&frac12; in)</td><td class=\"num\">&frac18; ft</td></tr></tbody></table><p>Each step covers only half of what remains, so you get infinitely close to the wall but never hit it &mdash; for example, from 1/1024th of an inch away you move another 1/2048th of an inch. In feet the moves form the series $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$</p>"
      },
      {
        h: "The insight",
        body: "<p>Although you keep moving forever, the total distance traveled can never exceed your starting distance of 2 feet. A mathematician would say the series $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\dots$ converges to 2. Wheelan still can't reproduce the formal proof, but the intuition made the math make sense &mdash; his point being that intuition makes the technical details understandable, and not usually the other way around.</p>"
      }
    ],
    takeaways: [
      "Halving the gap forever gets you arbitrarily close but never to the wall.",
      "The half-step series sums (converges) to the starting distance of 2 feet.",
      "Grasp the intuition first; the formulas then follow more easily."
    ]
  });
  window.CODEVIZ["naked-intro-intuition-first"] = {
    charts: [
      {
        type: "line",
        title: "Cumulative distance traveled toward the wall (feet)",
        interpret: "Each half-step adds less than the last, so the running total climbs toward 2 feet but never reaches it.",
        xlabel: "Move number",
        ylabel: "Total distance traveled (ft)",
        series: [
          { name: "Cumulative distance", color: "#4ea1ff", points: [[1, 1], [2, 1.5], [3, 1.75], [4, 1.875], [5, 1.9375], [6, 1.96875]] }
        ]
      }
    ]
  };

  B({
    id: "naked-intro-overly-accessible",
    chapter: "Introduction",
    title: "Statistics can mislead",
    tagline: "Cheap computing lets anyone run sophisticated procedures, so bad data or misuse can produce dangerously wrong conclusions.",
    sections: [
      {
        h: "Power in the wrong hands",
        body: "<p>Having argued statistics should be more accessible, Wheelan makes a seemingly contradictory point: it can be <em>overly</em> accessible. Anyone with data and a computer can run sophisticated procedures with a few keystrokes. If the data are poor or the techniques are misused, the conclusions can be wildly misleading and even dangerous.</p>"
      },
      {
        h: "The short-breaks-and-cancer example",
        body: "<p>He invents a deliberately absurd headline: <em>People Who Take Short Breaks at Work Are Far More Likely to Die of Cancer.</em> The supposed evidence:</p><ul class=\"steps\"><li>A study of 36,000 office workers &mdash; a huge data set.</li><li>Workers who reported taking regular ten-minute breaks were 41 percent more likely to develop cancer over the next five years than those who did not leave their offices.</li></ul><p>The naive reaction is to launch a campaign against short breaks. The likelier explanation: the break-takers are stepping outside to smoke cigarettes. It is probably the smoking, not the breaks, that causes the cancer &mdash; a correlation mistaken for a cause.</p>"
      },
      {
        h: "Handle with care",
        body: "<p>Wheelan compares statistics to a high-caliber weapon: helpful when used correctly and potentially disastrous in the wrong hands. The book won't make you an expert, but it aims to teach enough care and respect that you don't do \"the statistical equivalent of blowing someone's head off.\"</p>"
      }
    ],
    takeaways: [
      "Easy tools plus bad data or misuse equals confidently wrong answers.",
      "The 41 percent gap reflects who takes breaks (smokers), not the breaks themselves.",
      "Correlation is not causation; treat statistical power with care."
    ]
  });

  B({
    id: "naked-intro-book-mission",
    chapter: "Introduction",
    title: "The mission of the book",
    tagline: "Teach the intuition behind the most relevant statistical ideas, because it is easy to lie with statistics but hard to tell the truth without them.",
    sections: [
      {
        h: "Intuition over machinery",
        body: "<p>This is not a textbook, which frees Wheelan to choose the most relevant topics and the clearest explanations. The book is short on math, equations, and graphs and long on examples, organized around the concepts that matter most in everyday life &mdash; how scientists conclude something causes cancer, how polling works and what can go wrong, how people lie with statistics, and how a credit card company uses your purchases to predict whether you'll miss a payment.</p>"
      },
      {
        h: "The guiding quote",
        body: "<p>Every chapter promises to answer the question Wheelan once asked his calculus teacher to no effect: \"What is the point of this?\" He hopes to persuade readers of an observation by Swedish mathematician and writer Andrejs Dunkels: \"It's easy to lie with statistics, but it's hard to tell the truth without them.\"</p><p>His bolder aspiration is that you might actually enjoy statistics. The key is to separate the important ideas from the arcane technical details that get in the way &mdash; \"That is Naked Statistics.\"</p>"
      }
    ],
    takeaways: [
      "Goal: make the most relevant statistical concepts intuitive and accessible.",
      "Dunkels: it's easy to lie with statistics, but hard to tell the truth without them.",
      "Strip away the arcane detail to expose the useful core ideas."
    ]
  });
})();
