/* Naked Statistics (Charles Wheelan) — Chapter 5, "Basic Probability".
   One lesson per key point. Faithful summaries in original wording; the book's own
   examples and numbers, recomputed to confirm. Self-registering IIFE fragment. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const BOOK = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: BOOK }, o));

  // ── 1. Probability handles events under uncertainty — the Schlitz blind taste test ──
  B({
    id: "naked-ch5-schlitz-uncertainty",
    chapter: "Chapter 5",
    title: "Probability under uncertainty",
    tagline: "Schlitz bet \\$1.7 million on a live blind taste test — and the math made it nearly a sure thing.",
    sections: [
      { h: "The bold-looking gamble", body:
        "<p>In 1981 the Joseph Schlitz Brewing Company spent \\$1.7 million on a Super Bowl-halftime stunt: a live blind taste test pitting Schlitz against a rival. The daring twist was the panel — not random drinkers, but 100 people who already said they preferred the competing brand (Michelob in the Super Bowl spot; earlier playoff tests used Budweiser or Miller). Risking a public flop in front of 100 million viewers seems to suggest Schlitz must have been a spectacular beer.</p>" +
        "<p>Wheelan's point: it did not need to be. Probability shows the campaign was almost certain to look good for Schlitz, whatever the truth about taste.</p>" },
      { h: "Why a coin flip works in your favor", body:
        "<p>Suppose the typical drinker cannot actually tell these mainstream beers apart. Then a blind choice between two of them is essentially a coin flip — about a 50% chance of picking either one. Schlitz cleverly tested only people who claimed to like a <em>competitor</em>. If the choice is a coin flip, then about half of those self-described rival fans will pick Schlitz on camera. \"Half of all Bud drinkers like Schlitz better!\" looks fantastic — and costs Schlitz nothing in actual quality.</p>" +
        "<p>Probability is the study of events and outcomes that carry an element of uncertainty. You cannot know in advance which beer any one taster picks, but you <em>can</em> reason about how the whole group is likely to behave.</p>" },
      { h: "What actually happened", body:
        "<p>At the 1981 Super Bowl, exactly 50 percent of the Michelob drinkers chose Schlitz in the blind test — right in line with the coin-flip model.</p>" }
    ],
    takeaways: [
      "Probability reasons about events whose individual outcomes are uncertain.",
      "If two products are indistinguishable, a blind choice between them is a coin flip.",
      "Schlitz engineered a result that looked impressive regardless of true quality."
    ]
  });

  // ── 2. Known vs inferred probabilities ──
  B({
    id: "naked-ch5-known-vs-inferred",
    chapter: "Chapter 5",
    title: "Known versus inferred probabilities",
    tagline: "Some probabilities come from the rules of the game; others we estimate from past data.",
    sections: [
      { h: "Known probabilities", body:
        "<p>Many events have probabilities fixed by their structure. A fair coin lands heads with probability $\\frac{1}{2}$. A single fair die shows a one with probability $\\frac{1}{6}$. These follow directly from the equally likely outcomes — no data collection required.</p>" },
      { h: "Inferred probabilities", body:
        "<p>Other probabilities must be estimated from experience. The chance of making the extra-point kick after a touchdown in pro football is about $0.94$ — meaning kickers succeed on roughly 94 of every 100 attempts. That figure comes from history, not from first principles, and might shift slightly with the kicker or the weather.</p>" },
      { h: "Why even rough numbers help", body:
        "<p>Just having such figures clarifies decisions and makes risk explicit. The Australian Transport Safety Board quantified fatality risk by travel mode: commercial air travel is essentially zero fatalities per 100 million kilometers (Australia hadn't had a commercial air fatality since the 1960s), driving runs about $0.5$ per 100 million km, and motorcycles are roughly thirty-five times deadlier than cars per distance traveled.</p>" }
    ],
    takeaways: [
      "Known probabilities follow from a process's structure (coins, dice).",
      "Inferred probabilities are estimated from past data (the .94 extra-point rate).",
      "Quantifying risk — even approximately — makes trade-offs explicit."
    ]
  });

  // ── 3. Our fears don't track the numbers ──
  B({
    id: "naked-ch5-fears-vs-numbers",
    chapter: "Chapter 5",
    title: "Fears that miss the numbers",
    tagline: "Probabilities tell us what is more or less likely — not what we instinctively dread.",
    sections: [
      { h: "Likely versus unlikely, not certain", body:
        "<p>When a 6.5-ton NASA satellite was falling to earth in September 2011, NASA put the odds of any one specific person being struck at 1 in 21 trillion, and the odds that <em>anyone anywhere</em> on earth would be hit at a more sobering 1 in 3,200. No one was reported hurt. Probabilities don't say what will happen for sure; they tell us what is likely and what is unlikely. The sensible response to a falling satellite is not to race home on a motorcycle to warn the family.</p>" },
      { h: "Fear misallocated", body:
        "<p>Our instincts routinely mismatch the data. <em>Freakonomics</em> noted that backyard swimming pools are far deadlier to children than guns in the closet: a child under ten is about a hundred times more likely to die in a swimming pool than in a gun accident.</p>" +
        "<p>A Cornell study (Blalock, Kadiyali, and Simon) estimated that fear of flying after the September 11 attacks pushed many Americans to drive instead — causing an estimated 344 additional traffic deaths per month in October, November, and December of 2001, and perhaps more than 2,000 driving deaths overall. We may never know terrorism's true risk, but we know driving is dangerous.</p>" }
    ],
    takeaways: [
      "Probabilities describe likelihood, not certainty.",
      "Dread often targets vivid risks (planes, guns) over statistically larger ones (cars, pools).",
      "Acting on fear instead of numbers can cost more lives than the feared event."
    ]
  });

  // ── 4. The multiplication ("and") rule & independence ──
  B({
    id: "naked-ch5-and-rule",
    chapter: "Chapter 5",
    title: "The multiplication rule for and",
    tagline: "For independent events, multiply the probabilities to get the chance both happen.",
    sections: [
      { h: "Multiply for both", body:
        "<p>The probability that two independent events <em>both</em> happen is the product of their individual probabilities — the chance of A <strong>and</strong> B is $P(A)\\times P(B)$. Flipping heads is $\\frac{1}{2}$, so:</p>" +
        "<ul class=\"steps\">" +
        "<li>Two heads in a row: $\\frac{1}{2}\\times\\frac{1}{2}=\\frac{1}{4}$.</li>" +
        "<li>Three in a row: $\\frac{1}{8}$.</li>" +
        "<li>Four in a row: $\\frac{1}{16}$.</li>" +
        "</ul>" },
      { h: "Independence is required", body:
        "<p>The rule applies <em>only</em> when events are independent — when the outcome of one has no effect on the other. Coin flips qualify: the first flip doesn't change the second. But rain today is not independent of rain yesterday, because storm fronts last for days. Likewise, crashing your car this year and crashing it next year are linked — whatever made you crash (drunk driving, texting, drag racing) may still apply. That is why auto-insurance rates rise after an accident: the company now has new information that your probability of future crashes has gone up.</p>" }
    ],
    takeaways: [
      "P(A and B) = P(A) × P(B) for independent events.",
      "Four fair-coin heads in a row is 1/16.",
      "Independence means one outcome doesn't affect the other — rain and car crashes often aren't independent."
    ]
  });

  // ── 5. Counting combinations (passwords) ──
  B({
    id: "naked-ch5-counting-combinations",
    chapter: "Chapter 5",
    title: "Counting combinations",
    tagline: "Each added slot or symbol multiplies the possibilities — which is why longer passwords win.",
    sections: [
      { h: "Multiply the choices per slot", body:
        "<p>The same multiplicative logic counts how many arrangements are possible. A six-digit numbers-only password has 10 choices per slot:</p>" +
        "<ul class=\"steps\">" +
        "<li>$10\\times10\\times10\\times10\\times10\\times10 = 10^6 = 1{,}000{,}000$ possible passwords.</li>" +
        "<li>That sounds like a lot, but a computer can run through all of them in a fraction of a second.</li>" +
        "</ul>" },
      { h: "Adding letters and symbols", body:
        "<p>Allow letters too and each of the six slots now has 36 choices (26 letters + 10 digits):</p>" +
        "<ul class=\"steps\">" +
        "<li>$36^6 \\approx 2{,}176{,}782{,}336$ — over two billion.</li>" +
        "<li>Demand eight slots and add symbols like #, @, %, ! (46 choices each, as the University of Chicago requires): $46^8 \\approx 2.0\\times10^{13}$ — just over 20 trillion.</li>" +
        "</ul>" +
        "<p>This is why a system administrator keeps nagging you to lengthen and diversify your password.</p>" }
    ],
    takeaways: [
      "Possible arrangements = (choices per slot) raised to the number of slots.",
      "6 numeric digits → 10^6 = 1,000,000.",
      "More slots and more symbols (36^6, then 46^8) explode the count into billions and trillions."
    ]
  });
  window.CODEVIZ["naked-ch5-counting-combinations"] = {
    charts: [ {
      type: "bars",
      title: "Possible passwords explode with length and symbol set",
      interpret: "Each extra slot or allowed character multiplies the count — a 6-digit numeric password has a million combos; an 8-character set with symbols has ~20 trillion.",
      labels: ["6 digits (10^6)", "6 chars (36^6)", "8 chars (46^8)"],
      values: [1e6, 2176782336, 2.0e13],
      valueLabels: ["1 million", "~2.2 billion", "~20 trillion"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454"]
    } ]
  };

  // ── 6. The addition ("or") rule ──
  B({
    id: "naked-ch5-or-rule",
    chapter: "Chapter 5",
    title: "The addition rule for or",
    tagline: "For independent outcomes, add the probabilities to get the chance that one or another happens.",
    sections: [
      { h: "Add for either", body:
        "<p>When you want the chance that one outcome <strong>or</strong> another happens, sum their individual probabilities. The chance of rolling a 1, 2, or 3 on a single die is:</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\frac{1}{6}+\\frac{1}{6}+\\frac{1}{6}=\\frac{3}{6}=\\frac{1}{2}$.</li>" +
        "</ul>" +
        "<p>This matches intuition: three of the six equally likely faces make up half the outcomes, so a 50% chance.</p>" },
      { h: "Craps: rolling a 7 or 11", body:
        "<p>Two dice have $6\\times6=36$ equally likely outcomes. There are 6 ways to make 7 — (1,6), (2,5), (3,4), (6,1), (5,2), (4,3) — and 2 ways to make 11 — (5,6), (6,5). So the chance of throwing a 7 or 11 is the favorable combinations over the total:</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\frac{6+2}{36}=\\frac{8}{36}\\approx 0.222$.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "P(A or B) = P(A) + P(B) for the relevant independent outcomes.",
      "Rolling a 1, 2, or 3 on one die: 3/6 = 1/2.",
      "Rolling a 7 or 11 with two dice: 8/36."
    ]
  });

  // ── 7. Expected value, fair bets, football, the lottery ──
  B({
    id: "naked-ch5-expected-value",
    chapter: "Chapter 5",
    title: "Expected value and fair bets",
    tagline: "Sum each outcome times its probability — then compare it to the price to judge a bet.",
    sections: [
      { h: "The die-payoff game", body:
        "<p>Expected value is each possible payoff weighted by its probability, summed up. Play a game that pays \\$1 for a 1, \\$2 for a 2, on up to \\$6 for a 6. Each face has probability $\\frac{1}{6}$:</p>" +
        "<ul class=\"steps\">" +
        "<li>$\\frac{1}{6}(\\$1)+\\frac{1}{6}(\\$2)+\\frac{1}{6}(\\$3)+\\frac{1}{6}(\\$4)+\\frac{1}{6}(\\$5)+\\frac{1}{6}(\\$6)$</li>" +
        "<li>$=\\frac{1+2+3+4+5+6}{6}=\\frac{21}{6}=\\$3.50$.</li>" +
        "</ul>" +
        "<p>You can never actually roll \\$3.50, yet the figure tells you whether the bet is fair: if it costs \\$3 to play, the \\$3.50 expected value beats the price, so playing makes sense — not a guaranteed win, but the odds favor you.</p>" },
      { h: "Football: extra point vs. two-point conversion", body:
        "<p>After a touchdown a team can kick the extra point (1 point, success rate $0.94$) or go for two (2 points, success rate $0.37$). Expected value is payoff times probability of success:</p>" +
        "<table class=\"extable\"><thead><tr><th>Option</th><th class=\"num\">Points</th><th class=\"num\">Success</th><th class=\"num\">Expected value</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Kick extra point</td><td class=\"num\">1</td><td class=\"num\">0.94</td><td class=\"num\">0.94</td></tr>" +
        "<tr><td class=\"row-h\">Go for two</td><td class=\"num\">2</td><td class=\"num\">0.37</td><td class=\"num\">0.74</td></tr>" +
        "</tbody></table>" +
        "<p>$1\\times0.94 = 0.94$ beats $2\\times0.37 = 0.74$. The two-point payoff is bigger, but its success rate is so much lower that, to maximize points over a season, kicking the extra point wins. (Down by two with one second left, of course, a team must go for two.)</p>" },
      { h: "Why you should never buy a lottery ticket", body:
        "<p>Illinois prints each ticket's payoff probabilities on the back. Wheelan's \\$1 instant ticket listed chances such as 1 in 10 (free ticket), 1 in 15 (\\$2), 1 in 42.86 (\\$4), 1 in 75 (\\$5), on up to 1 in 40,000 (\\$1,000). Adding each cash prize weighted by its probability gives an expected payout of about \\$0.56 — a miserable return on a \\$1 outlay. As luck had it, he won \\$2, but the ticket was still a bad bet.</p>" }
    ],
    takeaways: [
      "Expected value = sum of (each payoff × its probability).",
      "Die game: 21/6 = \\$3.50, so it's worth playing at \\$3.",
      "Extra point (EV 0.94) beats going for two (EV 0.74) over the long run.",
      "A \\$1 Illinois lottery ticket has an expected payout of only ~\\$0.56."
    ]
  });
  window.CODEVIZ["naked-ch5-expected-value"] = {
    charts: [ {
      type: "bars",
      title: "Football: expected points after a touchdown",
      interpret: "The kick's higher success rate (0.94) makes its expected value (0.94) beat the riskier two-point try (2 × 0.37 = 0.74).",
      labels: ["Kick extra point", "Go for two"],
      values: [0.94, 0.74],
      valueLabels: ["0.94", "0.74"],
      colors: ["#7ee787", "#ffb454"]
    } ]
  };

  // ── 8. Law of large numbers ──
  B({
    id: "naked-ch5-law-large-numbers",
    chapter: "Chapter 5",
    title: "The law of large numbers",
    tagline: "Over many trials the average outcome converges to its expected value — which is why casinos win.",
    sections: [
      { h: "Good bets pay off in the long run", body:
        "<p>A single bad decision can turn out well — Wheelan won \\$2 on his \\$0.56-expected ticket — but the law of large numbers says that as the number of trials grows, the average outcome closes in on the expected value. Buy thousands of \\$1 tickets each worth \\$0.56, and losing becomes a near mathematical certainty: spend \\$1 million on tickets and you end up with something strikingly close to \\$560,000.</p>" +
        "<p>This is exactly why casinos always win over time: every game favors the house, so given enough wagers the casino is certain to come out ahead. It's also why Schlitz ran the taste test with 100 tasters rather than 10 — more trials make a fluke result far less likely.</p>" },
      { h: "More trials concentrate the outcome", body:
        "<p>For a coin-flip taste test where each tester has a $0.5$ chance of picking Schlitz, the distribution of \"number choosing Schlitz\" tightens around 50% as trials grow. The chance of getting at least 40% choosing Schlitz climbs sharply with sample size:</p>" +
        "<table class=\"extable\"><thead><tr><th>Blind taste testers</th><th class=\"num\">P(at least 40% choose Schlitz)</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">10</td><td class=\"num\">0.83</td></tr>" +
        "<tr><td class=\"row-h\">100</td><td class=\"num\">0.98</td></tr>" +
        "<tr><td class=\"row-h\">1,000</td><td class=\"num\">0.9999999999</td></tr>" +
        "<tr><td class=\"row-h\">1,000,000</td><td class=\"num\">1</td></tr>" +
        "</tbody></table>" }
    ],
    takeaways: [
      "As trials increase, the average outcome converges to the expected value.",
      "Spend \\$1M on \\$0.56-EV tickets → end near \\$560,000.",
      "More trials shrink the chance of a fluke — casinos win long-term, and 100 tasters were safer for Schlitz than 10."
    ]
  });
  window.CODEVIZ["naked-ch5-law-large-numbers"] = {
    charts: [ {
      type: "line",
      title: "Coin-flip taste test concentrates as trials grow",
      interpret: "With 10 trials the outcomes spread widely around 5 of 10; with 100 they bunch tightly near 50% — the law of large numbers in action. (Reconstruction of the book's density-function figure, scaled to % of tasters choosing Schlitz.)",
      xlabel: "Share of tasters choosing Schlitz (%)",
      ylabel: "Relative probability",
      series: [
        { name: "10 trials", color: "#4ea1ff", points: [[0,0.001],[10,0.01],[20,0.044],[30,0.117],[40,0.205],[50,0.246],[60,0.205],[70,0.117],[80,0.044],[90,0.01],[100,0.001]] },
        { name: "100 trials", color: "#ffb454", points: [[20,0],[30,0.0009],[35,0.0027],[40,0.0108],[45,0.0485],[50,0.0796],[55,0.0485],[60,0.0108],[65,0.0027],[70,0.0009],[80,0]] }
      ]
    } ]
  };

  // ── 9. Insurance as probability ──
  B({
    id: "naked-ch5-insurance",
    chapter: "Chapter 5",
    title: "Insurance as expected loss",
    tagline: "Insurance is a statistically bad bet you take only against losses you can't afford to absorb.",
    sections: [
      { h: "Premiums beat expected loss", body:
        "<p>The whole insurance industry runs on expected value with a twist — the \"expected loss\" on a policy. Insure a \\$40,000 car when the annual chance of theft is 1 in 1,000:</p>" +
        "<ul class=\"steps\">" +
        "<li>Expected loss $= \\frac{1}{1000}\\times\\$40{,}000 = \\$40$ per year.</li>" +
        "<li>To profit, the theft premium must be set <em>above</em> \\$40.</li>" +
        "</ul>" +
        "<p>At that point the insurer is just like the casino or the lottery: payouts happen, but over the long run more money comes in than goes out.</p>" },
      { h: "Only insure what you can't afford to lose", body:
        "<p>So insurance will <em>not</em> save you money on average — you pay the company more than you get back. What it buys is protection against a loss that would wreck you: a stolen \\$40,000 car or a \\$350,000 house burned down. Someone as wealthy as Warren Buffett could actually save money by skipping car, home, or health insurance, since he can absorb any single misfortune. The broader rule of personal finance: insure against any contingency you cannot comfortably afford to withstand — and skip insurance on everything else. That's why you should decline the \\$25 or \\$50 extended warranty on a \\$99 printer: a broken \\$99 printer won't change your life.</p>" }
    ],
    takeaways: [
      "Expected loss = probability of loss × size of loss; premiums must exceed it.",
      "\\$40,000 car, 1-in-1,000 theft → \\$40 expected loss, premium set above \\$40.",
      "Insurance is a bad bet on average — buy it only for losses you can't absorb (skip the \\$99-printer warranty)."
    ]
  });

  // ── 10. Decision trees with weighted payoffs ──
  B({
    id: "naked-ch5-decision-trees",
    chapter: "Chapter 5",
    title: "Decision trees with weighted payoffs",
    tagline: "Map every uncertain branch, weight each final payoff by its probability, and sum to an expected value.",
    sections: [
      { h: "The baldness-cure investment", body:
        "<p>A friend asks you to invest \\$1 million in a male-pattern-baldness cure. The uncertainties stack up: a 30% chance the team finds a working cure; if it does, a 60% chance the FDA approves it; if approved, a 90% chance a competitor doesn't beat you to market. Success returns \\$25 million. If no cure is found (70%), you get \\$250,000 back. A decision tree maps each branch, computes each final payoff times the product of probabilities along its path, then sums them.</p>" },
      { h: "Working the branches", body:
        "<table class=\"extable\"><thead><tr><th>Path</th><th class=\"num\">Combined probability</th><th class=\"num\">Payoff</th><th class=\"num\">Weighted payoff</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Cure, approved, no competitor</td><td class=\"num\">.3 × .6 × .9 = .162</td><td class=\"num\">\\$25,000,000</td><td class=\"num\">\\$4,050,000</td></tr>" +
        "<tr><td class=\"row-h\">Cure, approved, competitor wins</td><td class=\"num\">.3 × .6 × .1 = .018</td><td class=\"num\">\\$0</td><td class=\"num\">\\$0</td></tr>" +
        "<tr><td class=\"row-h\">Cure, not approved</td><td class=\"num\">.3 × .4 = .12</td><td class=\"num\">\\$0</td><td class=\"num\">\\$0</td></tr>" +
        "<tr><td class=\"row-h\">No cure</td><td class=\"num\">.7</td><td class=\"num\">\\$250,000</td><td class=\"num\">\\$175,000</td></tr>" +
        "</tbody></table>" +
        "<ul class=\"steps\">" +
        "<li>Expected payoff $= \\$4{,}050{,}000 + \\$0 + \\$0 + \\$175{,}000 = \\$4{,}225{,}000$.</li>" +
        "</ul>" +
        "<p>The expected value, \\$4.225 million, far exceeds the \\$1 million asked. Yet the single most likely outcome (70%) is no cure and only \\$250,000 back. Whether to invest depends on your risk profile — the law of large numbers says a firm or a Buffett-type investor should chase many such bets, winning on average even though most individual ventures fail.</p>" }
    ],
    takeaways: [
      "A decision tree lists every outcome with its path probability and payoff.",
      "Multiply along each branch, then sum the weighted payoffs.",
      "Baldness venture: expected payoff \\$4.225M, but the most likely single result is just \\$250,000."
    ]
  });
  window.CODEVIZ["naked-ch5-decision-trees"] = {
    charts: [ {
      type: "bars",
      title: "Decision tree: weighted payoffs for the baldness investment",
      interpret: "The big win (\\$4.05M weighted) and the no-cure fallback (\\$175K) sum to a \\$4.225M expected payoff — though the no-cure branch is by far the most likely single outcome.",
      labels: ["Cure→approved→no rival", "Cure→approved→rival", "Cure→not approved", "No cure"],
      values: [4050000, 0, 0, 175000],
      valueLabels: ["\\$4.05M", "\\$0", "\\$0", "\\$175K"],
      colors: ["#7ee787", "#2a3340", "#2a3340", "#4ea1ff"]
    } ]
  };

  // ── 11. Screening for a rare disease — false positives ──
  B({
    id: "naked-ch5-rare-disease-screening",
    chapter: "Chapter 5",
    title: "Screening for a rare disease",
    tagline: "Even a 99.9999%-accurate test floods you with false positives when the disease is rare.",
    sections: [
      { h: "An accurate test, a counterintuitive result", body:
        "<p>Suppose a disease affects 1 in 100,000 adults and a test is 99.9999% accurate: it never misses a true case (no false negatives), but about 1 in 10,000 healthy people tested gets a false positive. The striking outcome is that <em>most people who test positive don't actually have the disease.</em></p>" },
      { h: "Test the whole adult population", body:
        "<p>Run the test across roughly 175 million American adults. The decision tree splits the population, then splits each group by test result:</p>" +
        "<table class=\"extable\"><thead><tr><th>Group</th><th class=\"num\">People</th><th class=\"num\">Test result</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Have disease (.00001)</td><td class=\"num\">1,750</td><td class=\"num\">All test positive</td></tr>" +
        "<tr><td class=\"row-h\">Have disease, test negative</td><td class=\"num\">0</td><td class=\"num\">none (no false negatives)</td></tr>" +
        "<tr><td class=\"row-h\">Healthy, false positive (.0001)</td><td class=\"num\">17,500</td><td class=\"num\">positive</td></tr>" +
        "<tr><td class=\"row-h\">Healthy, true negative</td><td class=\"num\">174,980,750</td><td class=\"num\">negative</td></tr>" +
        "</tbody></table>" +
        "<ul class=\"steps\">" +
        "<li>Truly sick: $175{,}000{,}000 \\times 0.00001 = 1{,}750$, all testing positive.</li>" +
        "<li>Healthy false positives: about $174{,}998{,}250 \\times 0.0001 \\approx 17{,}500$.</li>" +
        "<li>Total told they have the disease: $1{,}750 + 17{,}500 = 19{,}250$.</li>" +
        "<li>Share actually sick: $\\frac{1{,}750}{19{,}250} \\approx 0.09 = 9\\%$.</li>" +
        "</ul>" },
      { h: "Why blanket screening can backfire", body:
        "<p>Of the 19,250 people notified they have the disease, only about 9% are truly sick — and that's with a very low false-positive rate. Mass screening of a healthy population generates enormous anxiety and wastes finite health-care resources on follow-up tests. This is why cost containment sometimes means screening <em>less</em>, focusing resources on the highest-risk groups.</p>" }
    ],
    takeaways: [
      "With a rare disease, false positives swamp true cases even for a very accurate test.",
      "175M tested: 1,750 truly sick, ~17,500 false positives → 19,250 positives total.",
      "Only ~9% of positives are real, so blanket screening can waste resources and cause needless alarm."
    ]
  });
  window.CODEVIZ["naked-ch5-rare-disease-screening"] = {
    charts: [ {
      type: "bars",
      title: "Who tests positive: true cases vs. false positives",
      interpret: "Of 19,250 people told they have the disease, only 1,750 (about 9%) actually do — the rest are false positives from the huge healthy population.",
      labels: ["Truly sick (positive)", "Healthy (false positive)"],
      values: [1750, 17500],
      valueLabels: ["1,750", "17,500"],
      colors: ["#ffb454", "#4ea1ff"]
    } ]
  };
})();
