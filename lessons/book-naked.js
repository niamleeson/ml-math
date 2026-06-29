/* =====================================================================
   Book companion — "Naked Statistics" by Charles Wheelan (2013).
   Lessons follow the BOOK'S own chapter structure (template: "book"):
   flowing prose + sub-headings + key takeaways, not the concept/formula
   scaffold used elsewhere. Content is drawn from the book itself.
   ===================================================================== */
(function () {
  window.LESSONS = window.LESSONS || [];
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: M }, o));

  B({
    id: "naked-ch1",
    chapter: "Chapter 1",
    title: "What's the Point?",
    tagline: "Why a single number — a passer rating, a Gini index — can capture something real.",
    sections: [
      { h: "The curious phenomenon",
        body: `<p>Wheelan opens with a puzzle he noticed as a teacher: students call statistics
        "confusing and irrelevant," then walk out of class and happily argue about batting averages,
        the windchill factor, or grade point averages. They already trust the NFL's
        <b>passer rating</b> — a single number that boils a quarterback's day down to one figure —
        without a second thought.</p>
        <p>The same people who are comfortable with sports statistics "seize up with anxiety" the
        moment a researcher mentions something like the Gini index. The math is not the real barrier.
        The barrier is that no one explains <i>the point</i>. Every chapter of the book promises to
        answer the question Wheelan once asked his calculus teacher to no effect: <i>What is the point
        of this?</i></p>` },

      { h: "One number for a complicated thing: the passer rating",
        body: `<p>A quarterback's performance has many moving parts: completion rate, average yards
        per attempt, the share of passes that go for touchdowns, and the share intercepted. The passer
        rating combines those four inputs into one number so you can make a quick comparison.</p>
        <p>Wheelan's example is the 2011 playoff game between his Chicago Bears and the Green Bay Packers,
        which the Packers won:</p>
        <ul>
          <li>Bears QB Jay Cutler: passer rating <b>31.8</b></li>
          <li>Packers QB Aaron Rodgers: passer rating <b>55.4</b></li>
          <li>Cutler in an earlier-season game vs. Green Bay: <b>85.6</b></li>
        </ul>
        <p>Those three numbers tell you most of what you need to know: Cutler was outgunned by Rodgers
        in the playoff loss, and Cutler himself had played far better earlier in the season. One figure
        each, and the story is clear.</p>` },

      { h: "Every descriptive statistic is a simplification — strength and weakness at once",
        body: `<p>Is the passer rating "perfect"? No. As Wheelan stresses, statistics rarely offer a
        single "right" way of doing anything. The same four inputs could be weighted differently to
        produce a different but equally defensible rating.</p>
        <p>That simplification is <b>both the strength and the weakness</b> of any descriptive statistic.
        The single number is handy — but it also throws information away. The passer rating can't tell
        you whether a quarterback threw a perfect pass that the receiver bobbled into an interception,
        or whether he "stepped up" on a crucial third down rather than a meaningless play at the end of
        the game. Every completion counts the same. Knowing what a summary <i>hides</i> is as important
        as knowing what it shows.</p>` },

      { h: "The same trick for income inequality: the Gini index",
        body: `<p>Here is Wheelan's key move: the Gini index "is just like the passer rating." It is a
        standard tool in economics for collapsing the complex distribution of income or wealth across a
        whole country into a single number for comparison.</p>
        <p>The Gini index runs from <b>0 to 1</b>. A country where every household had identical wealth
        would score <b>0</b>; a country where one household held everything would score <b>1</b>. The
        closer to 1, the more unequal. Wheelan lays the numbers side by side:</p>
        <ul>
          <li>United States: <b>.45</b> (2007, per the CIA)</li>
          <li>Sweden .23 &nbsp;·&nbsp; Canada .32 &nbsp;·&nbsp; China .42 &nbsp;·&nbsp; Brazil .54 &nbsp;·&nbsp; South Africa .65</li>
        </ul>
        <p>Put in context, one number tells a lot. It places the U.S. among its peers, and it can be
        tracked over time: the U.S. Gini index was <b>.41 in 1997</b> and grew to <b>.45</b> over the
        next decade — an objective way of saying that as the country grew richer, the distribution of
        wealth grew more unequal.</p>` },

      { h: "So what's the point?",
        body: `<p>A good descriptive statistic does the same job as the passer rating: it takes
        something sprawling and hard to hold in your head — a season of football, the wealth of a nation —
        and gives you a handle on it. That handle lets you <b>compare</b> (one country to another, one
        quarterback to another) and <b>track change</b> (the same country across years).</p>
        <p>The rest of the book builds on this: statistics let us summarize data, judge what's likely,
        find relationships between things, and — carefully — reason about cause and effect. The
        recurring warning is that the same tools, used carelessly or on bad data, mislead just as easily
        as they enlighten. Wheelan's promise for the whole book is to keep asking "what's the point"
        so the intuition comes first and the formulas make sense afterward.</p>` }
    ],
    takeaways: [
      "A descriptive statistic condenses many facts into one number you can actually use.",
      "Condensing is simultaneously the strength (easy comparison) and the weakness (lost detail) of any summary.",
      "The passer rating and the Gini index are the same idea: a single comparable score for a complex thing.",
      "The Gini index runs 0 (perfect equality) to 1 (one household owns everything); the U.S. rose from .41 in 1997 to .45 by 2007.",
      "Always ask what a number hides, not just what it shows."
    ]
  });
})();
