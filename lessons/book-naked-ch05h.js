/* "Naked Statistics" (Charles Wheelan) — Chapter 5½: The Monty Hall Problem
   One consolidated lesson covering every concept in the chapter. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "Naked Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "Naked Statistics" }, o));

  B({
    id: "naked-ch5h",
    chapter: "Chapter 5½",
    title: "The Monty Hall Problem",
    tagline: "Why switching doors wins two times out of three.",
    sections: [
      { body: "<h3 class=\"book-concept\">The setup</h3><p class=\"book-lead\">Three doors, one car, two goats.</p><h4 class=\"book-sub\">The game</h4><p>The puzzle comes from the TV game show <em>Let's Make a Deal</em>. At the end of the show a contestant stands with host Monty Hall in front of three big doors: Door 1, Door 2, and Door 3.</p><p>Behind one door is a desirable prize (a car). Behind each of the other two doors is a goat. The player picks one door and wins whatever is behind it. The book assumes the player wants the car, not the goat.</p><h4 class=\"book-sub\">The twist</h4><p>After the contestant picks a door, Monty does not open it right away. Instead he opens one of the two doors the contestant did <em>not</em> pick, and that door <strong>always</strong> reveals a goat.</p><p>Monty then asks the contestant a single question: do you want to keep your original door, or switch to the other door that is still closed?</p>" },
      { body: "<h3 class=\"book-concept\">The initial one in three</h3><p class=\"book-lead\">Your first pick wins the car 1 out of 3 times.</p><h4 class=\"book-sub\">Counting the doors</h4><p>Before anything is opened, the math is simple. There are three doors and only one car. Each door is equally likely to hide the car.</p><p>So the door you choose at the start has a $1/3$ chance of hiding the car. Here $1/3$ means one favorable door out of three possible doors.</p><h4 class=\"book-sub\">Where the rest of the chance lives</h4><p>If your door holds the car only $1/3$ of the time, then the car is somewhere else the other $2/3$ of the time. That leftover $2/3$ is spread across the two doors you did not pick.</p><ul class='steps'><li>Your chosen door: probability of car $= 1/3$.</li><li>The two doors you did not choose, together: probability of car $= 2/3$.</li></ul><p>This split is the key fact the rest of the chapter builds on.</p>" },
      { body: "<h3 class=\"book-concept\">Why switching wins two thirds</h3><p class=\"book-lead\">Stay wins 1/3; switch wins 2/3.</p><h4 class=\"book-sub\">Should you switch?</h4><p>Yes. The book states it plainly: if you stick with your first choice you win the car $1/3$ of the time, and if you switch you win $2/3$ of the time. Switching doubles your chance.</p><p>This feels wrong at first. After Monty opens a goat door, two closed doors remain, so it seems like each should be a $1/2$ coin flip. The reason it is not a coin flip comes in the next lesson.</p><h4 class=\"book-sub\">The two outcomes</h4><p>The table compares the two strategies. Each value is a probability of winning the car: $1/3 \\approx 0.333$ and $2/3 \\approx 0.667$.</p><table class='extable'><thead><tr><th>Strategy</th><th class='num'>Chance of winning the car</th><th class='num'>As a fraction</th></tr></thead><tbody><tr><td class='row-h'>Stay with first door</td><td class='num'>0.333</td><td class='num'>1/3</td></tr><tr><td class='row-h'>Switch doors</td><td class='num'>0.667</td><td class='num'>2/3</td></tr></tbody></table><h4 class=\"book-sub\">What the author saw</h4><p>The book offers an empirical check. The author had one child play the game 100 times always switching, and another play 100 times never switching.</p><ul class='steps'><li>The switcher won 72 out of 100 times.</li><li>The non-switcher won 33 out of 100 times.</li></ul><p>These results sit close to the predicted $2/3$ and $1/3$. The book also notes that real episodes of the show point the same way: contestants who switched won about twice as often as those who did not.</p>" },
      { body: "<h3 class=\"book-concept\">The host knows and reveals information</h3><p class=\"book-lead\">Switching means picking both of the other two doors.</p><h4 class=\"book-sub\">Monty is not guessing</h4><p>The whole puzzle turns on one fact: Monty Hall knows what is behind every door. He never opens the car by accident; he always opens a goat. So the door he opens is chosen on purpose, and that choice carries information.</p><p>Suppose you pick Door 1. If the car is behind Door 2, Monty must open Door 3. If the car is behind Door 3, Monty must open Door 2. Either way he is forced to reveal which of the other two doors is the goat, leaving the car-holding one closed.</p><h4 class=\"book-sub\">Switching = taking both other doors</h4><p>The book's central insight: switching is the same as being allowed to pick <em>both</em> of the doors you did not originally choose. One of those two always hides a goat anyway, so Monty opening it costs you nothing. By opening it, he is doing you a favor.</p><p>In effect Monty is saying: there is a $2/3$ chance the car is behind one of the doors you did not pick, and here is which of those two it is not.</p><p>These two situations have exactly the same chance of winning:</p><ul class='steps'><li>Pick Door 1, then before any door opens agree to take Door 2 <em>and</em> Door 3.</li><li>Pick Door 1, then switch to the one door left closed after Monty reveals a goat.</li></ul><p>Both give you the benefit of two doors instead of one, so both raise your chance from $1/3$ to $2/3$.</p>" },
      { body: "<h3 class=\"book-concept\">The hundred door extreme</h3><p class=\"book-lead\">With 100 doors the intuition becomes obvious.</p><h4 class=\"book-sub\">Scaling the game up</h4><p>The book's most convincing argument stretches the same idea to 100 doors. There is one car and 99 goats. You pick a single door, say Door 47.</p><p>Your first pick has only a $1/100$ chance of being right. The other 99 doors together hold the car with probability $99/100$.</p><h4 class=\"book-sub\">Monty clears the field</h4><p>Monty, who knows where the car is, now opens 98 of the other doors, every one revealing a goat. Two doors stay closed: your Door 47 and one other, say Door 61.</p><ul class='steps'><li>Chance your original Door 47 is right: $1/100$.</li><li>Chance the car was among the other 99 doors: $99/100$.</li><li>Monty removed 98 wrong doors from that group, so the full $99/100$ now sits on Door 61.</li></ul><p>Here switching wins 99 times out of 100. Stretched this far, the answer is obvious, and it is the very same logic as the three-door game.</p><h4 class=\"book-sub\">The broader lesson</h4><p>The chapter closes with a wider point: if you are ever a contestant, switch. And more generally, your gut instinct about probability can lead you astray.</p>" }
    ],
    takeaways: [
      "Three doors: one hides a car, two hide goats.",
      "Your first pick holds the car with probability 1/3.",
      "Staying wins 1/3 of the time; switching wins 2/3 of the time.",
      "Monty knows where the car is and always opens a goat on purpose.",
      "With 100 doors your first pick is right only 1/100 of the time."
    ]
  });
  window.CODEVIZ["naked-ch5h"] = {
    charts: [
      {
        "type": "bars",
        "title": "Chance of winning the car: stay vs switch",
        "interpret": "Switching wins about 2/3 of the time, double the 1/3 you get by staying.",
        "labels": [
          "Stay",
          "Switch"
        ],
        "values": [
          0.333,
          0.667
        ],
        "valueLabels": [
          "1/3",
          "2/3"
        ],
        "colors": [
          "#ffb454",
          "#7ee787"
        ]
      }
    ]
  };
})();
