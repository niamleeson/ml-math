/* Naked Statistics (Charles Wheelan) — Chapter 6: "Problems with Probability".
   Self-registering book lessons, one per key point. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const BOOK = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // 1 — Statistics only as smart as their users
  B({
    id: "naked-ch6-smart-as-users",
    chapter: "Chapter 6",
    title: "Statistics Are Only as Smart as Their Users",
    tagline: "The tools do not make mistakes; the people using them do.",
    sections: [
      { h: "The thesis of the chapter", body:
        "<p>Wheelan opens with a blunt claim: a statistical method can never be smarter than the person wielding it. Worse, in the wrong hands it can lead clever people into foolish decisions. He frames the rest of the chapter as a catalog of common probability-related errors, misunderstandings, and ethical dilemmas.</p>" +
        "<p>He keeps his running metaphor from earlier chapters: statistics is a powerful weapon. Borrowing the phrasing of the gun-rights lobby, he summarizes the lesson this way — probability does not make mistakes; people using probability make mistakes.</p>" },
      { h: "Why it matters", body:
        "<p>The marquee example is Wall Street before the 2008 crisis. Sophisticated risk math did not protect the financial system; it gave overconfident experts a false sense of control. The same elegant calculation that a beer company used responsibly (the Schlitz blind taste test of an earlier chapter) was, in different hands, part of a global catastrophe. The difference was not the math — it was the judgment around it.</p>" }
    ],
    takeaways: [
      "A method is only as good as the assumptions and judgment behind it.",
      "The chapter is a guided tour of how probability gets misused.",
      "Blame the user, not the tool, for probability disasters."
    ]
  });

  // 2 — Value at Risk and the appeal of one number
  B({
    id: "naked-ch6-var-one-number",
    chapter: "Chapter 6",
    title: "Value at Risk and the Appeal of One Number",
    tagline: "VaR collapsed a firm's whole risk into a single, comforting dollar figure.",
    sections: [
      { h: "What VaR claimed to do", body:
        "<p>Before 2008, firms across finance used a common risk gauge: Value at Risk, or VaR. It combined the appeal of a single indicator (squeezing lots of information into one number) with the power of probability (attaching an expected gain or loss to each position). For any holding there is a range of possible outcomes — over, say, one week, a stock most likely ends near where it started, with a smaller chance of moving 10 percent, and a still smaller chance of moving 25 percent.</p>" +
        "<p>Quants turned that range into a dollar figure. For a position they might report a maximum loss with 99 percent probability — meaning 99 times out of 100 the loss would not exceed that figure, and 1 time out of 100 it would. Wheelan flags that last part as the thing to remember.</p>" },
      { h: "The book's worked figures", body:
        "<p>Wheelan walks the number up from one position to the whole firm:</p>" +
        "<ul class=\"steps\">" +
        "<li>A single trading position: at most $13 million lost over the period, with 99 percent probability (so a 1-in-100 chance of losing more).</li>" +
        "<li>The model even folded in correlations between positions — if two investments were negatively correlated, a loss in one tends to be offset by a gain in the other, making the pair less risky than either alone.</li>" +
        "<li>Bond trader Bob Smith: a 24-hour VaR of $19 million, again at 99 percent — the most he should lose over the next day, 99 times out of 100.</li>" +
        "<li>Aggregate up across currencies, leverage, and liquidity, and managers got one firm-wide risk number at any moment.</li>" +
        "</ul>" +
        "<table class=\"extable\"><thead><tr><th>Level</th><th class=\"num\">VaR (99% conf.)</th><th>Horizon</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">One position</td><td class=\"num\">$13M</td><td>~1 week</td></tr>" +
        "<tr><td class=\"row-h\">Trader Bob Smith</td><td class=\"num\">$19M</td><td>24 hours</td></tr>" +
        "</tbody></table>" },
      { h: "Why people loved it", body:
        "<p>As writer Joe Nocera put it, VaR's great selling point was that it expressed risk as a single number, a dollar figure — something non-quants could grasp. At J. P. Morgan, where VaR was refined, the daily figure landed on top executives' desks every afternoon and was nicknamed the \"4:15 report,\" arriving just after U.S. markets closed.</p>" }
    ],
    takeaways: [
      "VaR reports a worst-case loss at a stated probability, e.g. 99%.",
      "Book figures: $13M per position; $19M 24-hour VaR for trader Bob Smith.",
      "Its appeal was reducing complex risk to one dollar number.",
      "Remember the 1-in-100 tail — it becomes the whole problem."
    ]
  });
  window.CODEVIZ["naked-ch6-var-one-number"] = { charts: [ {
    type: "bars",
    title: "VaR figures from the chapter (99% confidence)",
    interpret: "VaR shrinks a position or trader's risk to a single dollar loss it should not exceed 99 times out of 100.",
    labels: ["One position (1 wk)", "Bob Smith (24 hr)"],
    values: [13, 19],
    valueLabels: ["$13M", "$19M"],
    colors: ["#4ea1ff", "#7ee787"]
  } ] };

  // 3 — Assuming the future resembles the past / false precision
  B({
    id: "naked-ch6-false-precision",
    chapter: "Chapter 6",
    title: "False Precision and Assuming the Future Looks Like the Past",
    tagline: "VaR was exact and wrong — a faulty speedometer is worse than none.",
    sections: [
      { h: "The faulty-speedometer problem", body:
        "<p>VaR has been called \"potentially catastrophic\" and \"a fraud.\" Wheelan likens it to a faulty speedometer, which he argues is worse than no speedometer at all: trust the broken gauge and you ignore every other clue that you are going too fast. With no gauge, you at least keep looking around. By 2005, with the 4:15 report on every desk, Wall Street was driving fast on a broken speedometer.</p>" },
      { h: "The future is not the past", body:
        "<p>The first deep flaw: the probabilities were built from past market movements, but financial markets (unlike beer tasting) need not repeat. There was no real justification for assuming 1980–2005 movements would predict what came after 2005. Wheelan compares it to the military's habit of preparing for the last war. Lending models for home mortgages assigned zero probability to large drops in housing prices — prices had never fallen so far so fast as they did starting in 2007, but they did. Alan Greenspan testified that the models drew on only the past two decades, a period of relative calm; fitted instead to historic periods of stress, capital requirements would have been far higher.</p>" },
      { h: "Precision versus accuracy", body:
        "<p>Wheelan separates two ideas the quants confused. He compares VaR to his golf range finder set to meters instead of yards: it gave an exact reading that was simply wrong. That false precision convinced executives they had risk on a leash when they did not.</p>" +
        "<ul class=\"steps\">" +
        "<li>Precision: a sharp, confident-looking number (the 99% dollar figure).</li>" +
        "<li>Accuracy: whether that number is actually correct.</li>" +
        "<li>VaR delivered precision without accuracy — exact and wrong.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "Past calm decades were the wrong basis for future market risk.",
      "Mortgage models gave large price drops zero probability — then prices crashed.",
      "Precision is not accuracy; a confident wrong number is dangerous."
    ]
  });

  // 4 — Tail risk and black swans
  B({
    id: "naked-ch6-tail-risk",
    chapter: "Chapter 6",
    title: "Tail Risk and Black Swans",
    tagline: "The 99% assurance is useless because it is the 1% that destroys you.",
    sections: [
      { h: "The 1 percent is the whole point", body:
        "<p>Even if the underlying probabilities were right, the 99 percent comfort was dangerous. Hedge-fund manager David Einhorn compared VaR to an air bag that works every time except when you have a crash. If a firm has a Value at Risk of $500 million, that 99 percent chance of losing no more than $500 million also means a 1 percent chance of losing more — possibly far more. The models said nothing about how bad that 1 percent could get. That neglected sliver is the <strong>tail risk</strong>: the small chance of a catastrophic outcome, named for the tail of the distribution.</p>" },
      { h: "Compounding the error", body:
        "<p>Firms made things worse with unrealistic assumptions about rare events. Treasury secretary Hank Paulson noted that many firms assumed they could raise cash in a pinch by selling assets — but in a crisis every firm wants cash and all are dumping the same assets. Wheelan's image: refusing to stock water before a disaster because you will \"just go buy some,\" only to arrive at a supermarket with broken windows and empty shelves.</p>" },
      { h: "Black swans (Taleb)", body:
        "<p>The deeper diagnosis comes from Nicholas Taleb, author of <em>The Black Swan</em> and a fierce VaR critic. Wheelan relays Taleb's point via Joe Nocera: the greatest risks are never the ones you can see and measure, but the ones you cannot see and therefore can never measure — events that seem so far outside normal probability you cannot imagine them, even though they do happen, more often than people care to realize. Wheelan adds his own reminder of how probability really works: unlikely things happen. Over enough time they are not even that unlikely — people get hit by lightning, and his mother once had three holes in one.</p>" }
    ],
    takeaways: [
      "A 99% bound hides a 1% tail that can be arbitrarily bad.",
      "Firms assumed they could raise cash in a crisis — when no one can.",
      "Black swans are the unmeasured risks that nonetheless occur.",
      "Given enough time, unlikely events stop being unlikely."
    ]
  });

  // 5 — Assuming independence when events are not
  B({
    id: "naked-ch6-false-independence",
    chapter: "Chapter 6",
    title: "Assuming Events Are Independent When They Are Not",
    tagline: "Multiplying probabilities only works when events truly do not affect each other.",
    sections: [
      { h: "The multiplication rule — and its trap", body:
        "<p>For independent events, you multiply: a fair coin lands heads with probability $\\frac{1}{2}$, so two heads in a row is $\\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4}$. Here $\\frac{1}{2}$ means \"one chance out of two\" and the exponent $2$ means \"this happens twice in a row.\" The rule is only valid when one outcome has no effect on the other.</p>" +
        "<p>Wheelan's airline example shows the trap. Suppose a jet engine fails on a transatlantic flight with probability $\\frac{1}{100{,}000}$ (one chance in a hundred thousand). An assistant reasons that two engines both failing is:</p>" +
        "<ul class=\"steps\">" +
        "<li>Treat the two engine failures as independent.</li>" +
        "<li>Multiply: $\\left(\\frac{1}{100{,}000}\\right)^2 = \\frac{1}{10{,}000{,}000{,}000}$ — one in 10 billion.</li>" +
        "<li>Conclude that this is a perfectly safe risk.</li>" +
        "</ul>" +
        "<p>The assistant should use up his vacation before he is fired. The failures are <em>not</em> independent: if a plane flies through a flock of geese on takeoff, both engines are compromised together — and the same is true of weather or bad maintenance. Once one engine fails, the chance the second fails is far higher than $\\frac{1}{100{,}000}$.</p>" },
      { h: "Meadow's Law and the SIDS cases", body:
        "<p>The same mistake jailed innocent people. Throughout the 1990s, British prosecutors confronted sudden infant death syndrome (SIDS) — the unexplained death of a healthy infant in the crib, which Britons call \"cot death.\" Because the deaths were mysterious, courts looked for a way to separate foul play from natural death and focused on families with multiple cot deaths. Pediatrician Sir Roy Meadow became a frequent expert witness. As the <em>Economist</em> summarized \"Meadow's Law\": one infant death is a tragedy, two are suspicious, and three are murder — on the notion that if an event is rare, repeats in one family are too improbable to be chance.</p>" +
        "<ul class=\"steps\">" +
        "<li>Incidence of a single cot death: rare, about $\\frac{1}{8{,}500}$ (one in 8,500).</li>" +
        "<li>Meadow treated two deaths in one family as independent and squared it: $\\left(\\frac{1}{8{,}500}\\right)^2$.</li>" +
        "<li>That gives roughly 1 in 73 million — a figure he presented as reeking of foul play.</li>" +
        "</ul>" +
        "<p>Juries convicted on this testimony, often with no corroborating medical evidence; some infants were taken from parents at birth after a sibling's unexplained death.</p>" },
      { h: "Why the math was wrong", body:
        "<p>The Royal Statistical Society pointed out the flaw: squaring the probability is fine only if cot deaths are entirely random and unlinked. But for something as mysterious as SIDS there may well be a link — a genetic factor, for instance — that makes a family which suffered one cot death <em>more</em>, not less, likely to suffer another. Since the convictions, scientists have suggested exactly such a link. In 2004 the British government announced it would review 258 trials in which parents had been convicted of murdering their infant children.</p>" }
    ],
    takeaways: [
      "You may multiply probabilities only for truly independent events.",
      "Two jet engines fail together (geese, weather) — not independently.",
      "Meadow squared 1/8,500 to get ~1 in 73 million for two cot deaths.",
      "A hidden genetic link makes a second cot death more likely, not less.",
      "Britain reviewed 258 convictions built on this error."
    ]
  });

  // 6 — Gambler's fallacy and the hot hand
  B({
    id: "naked-ch6-gamblers-fallacy",
    chapter: "Chapter 6",
    title: "The Gambler's Fallacy and the Hot Hand",
    tagline: "Independent events have no memory — and basketball streaks may be illusory.",
    sections: [
      { h: "Treating independent events as dependent", body:
        "<p>The opposite mistake is failing to treat truly independent events as independent. In a casino, people eye dice or cards and declare an outcome is \"due.\" If the roulette ball lands on black five times in a row, surely red is now due? No: the chance of red is unchanged at $\\frac{16}{38}$ (red numbers out of all slots). This is the <strong>gambler's fallacy</strong>. Even after a fair coin lands heads 1,000,000 times in a row, the chance of tails on the next flip is still $\\frac{1}{2}$. Statistical independence means one outcome has no effect on the next — and physically, how would a run of tails make heads more likely on the next flip?</p>" },
      { h: "The hot hand", body:
        "<p>Even in sports, streaks may be illusory. A famous paper by Gilovich, Vallone, and Tversky tested the \"hot hand\" — the belief that a player who just made a shot is more likely to hit the next — in three ways:</p>" +
        "<ul class=\"steps\">" +
        "<li>Philadelphia 76ers home-game shooting (1980–81 season): no evidence of a positive correlation between successive shots.</li>" +
        "<li>Boston Celtics free-throw data: same result.</li>" +
        "<li>A controlled experiment with the Cornell men's and women's teams.</li>" +
        "</ul>" +
        "<p>In the Cornell experiment, players hit on average 48 percent of shots after a make and 47 percent after a miss — essentially flat. For 14 of 26 players the correlation between one shot and the next was negative; only one showed a significant positive correlation.</p>" +
        "<table class=\"extable\"><thead><tr><th>Cornell shooters</th><th class=\"num\">Hit rate</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">After a make</td><td class=\"num\">48%</td></tr>" +
        "<tr><td class=\"row-h\">After a miss</td><td class=\"num\">47%</td></tr>" +
        "</tbody></table>" },
      { h: "Perception versus reality", body:
        "<p>Yet 91 percent of basketball fans surveyed at Stanford and Cornell agreed that a player has a better chance of making a shot after his last two or three than after missing his last two or three. The significance of the paper is exactly this gap between perception and empirical reality. As the authors put it, people's intuitive conceptions of randomness depart systematically from the laws of chance — we see patterns where none may exist.</p>" }
    ],
    takeaways: [
      "Roulette red stays at 16/38 no matter the recent run — events have no memory.",
      "A fair coin is 1/2 even after a million heads.",
      "Cornell players hit 48% after a make vs 47% after a miss — no hot hand.",
      "91% of surveyed fans believe in the hot hand anyway."
    ]
  });
  window.CODEVIZ["naked-ch6-gamblers-fallacy"] = { charts: [ {
    type: "bars",
    title: "Cornell shooting: after a make vs after a miss",
    interpret: "Nearly identical hit rates (48% vs 47%) mean making a shot barely changes the odds of the next — no hot hand.",
    labels: ["After a make", "After a miss"],
    values: [48, 47],
    valueLabels: ["48%", "47%"],
    colors: ["#4ea1ff", "#ffb454"]
  } ] };

  // 7 — Clusters happen by chance
  B({
    id: "naked-ch6-clusters-happen",
    chapter: "Chapter 6",
    title: "Clusters Happen by Chance",
    tagline: "Rare events are improbable in one place but near-certain across millions of places.",
    sections: [
      { h: "The cancer-cluster story", body:
        "<p>You have likely seen the news exposé: a statistically unlikely number of people in one area contract a rare cancer, and suspicion falls on the water, a power plant, or a cell tower. Any of those might truly be causing harm (later chapters explore how statistics can establish such causal links). But a cluster can also be pure chance, even when the number of cases looks highly improbable.</p>" },
      { h: "The book's worked intuition", body:
        "<ul class=\"steps\">" +
        "<li>The chance that five people in one school, church, or workplace get the same rare leukemia might be one in a million.</li>" +
        "<li>But there are millions of schools, churches, and workplaces.</li>" +
        "<li>So it is <em>not</em> improbable that five people get the same rare leukemia in <em>one</em> of those places.</li>" +
        "<li>We simply never think about all the places where it did not happen.</li>" +
        "</ul>" +
        "<p>Wheelan's lottery variation makes the same point: a single ticket's chance of winning may be 1 in 20 million, yet no one is surprised when <em>someone</em> wins, because millions of tickets are sold. He admits admiration for the Illinois slogan, \"Someone's gonna Lotto, might as well be you.\"</p>" }
    ],
    takeaways: [
      "An event rare in one location is likely somewhere across millions of locations.",
      "A 1-in-a-million leukemia cluster is expected in some school — we just miss the misses.",
      "A 1-in-20-million ticket loses, but someone wins because millions play."
    ]
  });

  // 8 — The prosecutor's fallacy
  B({
    id: "naked-ch6-prosecutors-fallacy",
    chapter: "Chapter 6",
    title: "The Prosecutor's Fallacy",
    tagline: "The same one-in-a-million match means very different things depending on how the suspect was found.",
    sections: [
      { h: "The exercise behind it", body:
        "<p>Wheelan primes the idea with a classroom exercise. A class of 100 students all flip coins; anyone who flips heads sits down. Roughly 50 sit after the first flip, ~25 after the second, and so on, until usually one student is left standing after five or six tails in a row. He jokingly asks that student about training, diet, and technique — and everyone laughs, because they just watched the whole process and know there is no special talent. But seen out of context, an anomalous event tempts us to assume something besides randomness is responsible.</p>" },
      { h: "The courtroom version", body:
        "<p>Now the trial. Testimony says: (1) a DNA sample at the crime scene matches the defendant's, and (2) there is only one chance in a million that the sample would match anyone else besides the defendant. Would you convict? Wheelan hopes not — because the <strong>prosecutor's fallacy</strong> occurs when the context around the statistical evidence is neglected. Two very different scenarios produce that same match:</p>" +
        "<table class=\"extable\"><thead><tr><th>Case</th><th>How the suspect was found</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Defendant 1</td><td>A spurned lover, arrested three blocks away carrying the murder weapon; court then compelled a DNA sample, which matched a hair at the scene.</td></tr>" +
        "<tr><td class=\"row-h\">Defendant 2</td><td>Convicted of a similar crime years earlier, so his DNA was in a database of over a million violent felons; the scene's sample was run through that database and hit on him — with no known link to the victim.</td></tr>" +
        "</tbody></table>" },
      { h: "Why the two differ", body:
        "<p>In both cases the prosecutor can truthfully say the sample matches and that a coincidental match has only a one-in-a-million chance. But for Defendant 2 there is a real chance he <em>is</em> that random one-in-a-million person, precisely because the sample was run through a database holding about a million people — so the odds of finding a coincidental one-in-a-million match are high. The bare match statistic is identical; the context flips its meaning.</p>" }
    ],
    takeaways: [
      "A one-in-a-million DNA match sounds damning but depends on context.",
      "Defendant 1 was identified independently; Defendant 2 was found by trawling a database.",
      "Searching a million-person database makes a one-in-a-million coincidental match likely.",
      "Neglecting that context is the prosecutor's fallacy."
    ]
  });

  // 9 — Reversion to the mean
  B({
    id: "naked-ch6-reversion-mean",
    chapter: "Chapter 6",
    title: "Reversion to the Mean",
    tagline: "Extreme performances are part luck, and luck does not last.",
    sections: [
      { h: "The Sports Illustrated jinx", body:
        "<p>You may have heard of the <em>Sports Illustrated</em> jinx — athletes or teams on the cover then see performance fall off. The superstitious explanation is that the cover is cursed. The sounder one is <strong>reversion to the mean</strong>: teams reach the cover <em>after</em> an unusually good stretch (say a twenty-game winning streak), and their later performance simply returns toward normal, the long-term average. Probability tells us any outlier — an observation far from the mean in either direction — tends to be followed by outcomes closer to that long-term average.</p>" },
      { h: "Talent plus luck", body:
        "<p>Wheelan's mechanism: performance, mental or physical, is underlying talent plus an element of luck, good or bad (statisticians call it random error). Whoever performs far above the mean for a stretch probably had luck on their side; whoever performs far below probably had bad luck. When the luck runs out — as it inevitably does — performance moves back toward the mean. His examples: the Chicago Cubs paying huge salaries to free agents right after an outlier season or two, then watching them revert; and students who do unusually well on a test tending to do slightly worse on a retest, and vice versa.</p>" },
      { h: "Reconciling it with the gambler's fallacy", body:
        "<p>Wheelan anticipates a confusion. After a student flips six tails in a row, is he \"due\" for heads? No — each flip is independent, so the next is still $\\frac{1}{2}$ heads (that would be the gambler's fallacy). Reversion to the mean is a different claim: the <em>ensuing flips</em> will tend toward what probability predicts, half heads and half tails, rather than toward the all-tails past.</p>" +
        "<ul class=\"steps\">" +
        "<li>He imagines offering a student a ten-year, $50 million contract after seeing six tails in a row, treating it as coin-flipping talent.</li>" +
        "<li>Each future flip is still independent at $\\frac{1}{2}$ — no \"hot streak\" carries over.</li>" +
        "<li>Over the contract the student flips about 50 percent tails, and Wheelan is disappointed.</li>" +
        "<li>The more flips, the closer the outcome to the 50-50 the law of large numbers predicts.</li>" +
        "</ul>" },
      { h: "The Businessweek twist", body:
        "<p>As a side note, CEOs named to <em>Businessweek</em>'s \"Best Managers\" subsequently see their companies underperform over the next three years in both profits and stock price. Economists Malmendier and Tate argue this is <em>more</em> than mean reversion: \"superstar\" CEOs get distracted by fame — writing memoirs, joining outside boards. As Wheelan quips, when a CEO makes the cover of <em>Businessweek</em>, sell the stock.</p>" }
    ],
    takeaways: [
      "Outliers are followed by results closer to the long-term average.",
      "Performance = talent + luck; luck runs out, so extremes revert.",
      "Reversion differs from the gambler's fallacy: future flips trend toward 50-50, each still 1/2.",
      "Cover athletes and 'Best Manager' CEOs tend to disappoint afterward."
    ]
  });

  // 10 — Statistical / rational discrimination
  B({
    id: "naked-ch6-statistical-discrimination",
    chapter: "Chapter 6",
    title: "Statistical Discrimination",
    tagline: "Acting on what probability predicts can be sound math and still be an ethical minefield.",
    sections: [
      { h: "When is it okay to act on probability?", body:
        "<p>Wheelan's final problem is ethical, not mathematical. In 2003 EU commissioner Anna Diamantopoulou proposed barring insurers from charging men and women different rates, calling it a violation of equal treatment. To insurers, gender-based premiums are not discrimination — just statistics: men typically pay more for auto insurance because they crash more, and women pay more for annuities because they live longer. Insurers do not care about any individual; they care only about averages, because getting the average right makes them money. The policy banning gender-based premiums took effect in 2012 (precipitated by a 2011 EU court ruling), and notably the authorities did not deny that gender is correlated with risk — they simply declared that charging different rates by sex is unacceptable.</p>" },
      { h: "The uncomfortable generalization", body:
        "<p>Wheelan presses harder. The same predictive analytics he praised in an earlier chapter is, less glamorously, <strong>profiling</strong> — also called statistical or rational discrimination. Consider:</p>" +
        "<ul class=\"steps\">" +
        "<li>The same modeling that finds people who buy birdseed are less likely to default on credit cards applies everywhere in life.</li>" +
        "<li>Suppose a model identifies drug smugglers correctly 80 out of 100 times.</li>" +
        "<li>Then the 20 percent it flags wrongly get harassed over and over.</li>" +
        "</ul>" +
        "<p>Probability tells us only what is more or less likely — that is just basic statistics. But these are statistics with social consequences.</p>" },
      { h: "Math is not the answer to the hard question", body:
        "<p>Wheelan's broader point: our ability to analyze data has outrun our thinking about what we ought to do with the results. We like to treat numbers as cold, hard facts — do the calculation right and you must have the right answer. The more dangerous reality is that we can do the math correctly and still blunder in a harmful direction: blowing up the financial system, or harassing a particular young man on a particular corner because the model says he is almost certainly there to buy drugs. What we should do with predictive information is a philosophical and legal question, not a statistical one. For all of probability's elegance, there is no substitute for thinking about what we are calculating and why.</p>" }
    ],
    takeaways: [
      "Insurers price by gender because, on average, it predicts risk — banned in the EU from 2012 anyway.",
      "Profiling is the unglamorous name for the same predictive analytics.",
      "An 80%-accurate model still wrongly harasses the other 20%.",
      "Correct math can still lead to harmful action — the ethics are separate."
    ]
  });
})();
