/* =====================================================================
   MODULE 1 — PROBABILITY & STATISTICS: how to reason about uncertainty.
   Same lesson style as the foundations gold standard:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Probability & Statistics";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---------------------------------------------------------------- */
L({
  id: "prob-sample-space",
  demo: function (host) {
    Demos.bars(host, {
      controls: [{ key: "dice", label: "number of dice", min: 1, max: 2, val: 1, step: 1 }],
      pmf: function (s) {
        var d = Math.round(s.dice), o = [];
        if (d <= 1) {
          for (var f = 1; f <= 6; f++) o.push({ k: f, p: 1 / 6 });
        } else {
          for (var sum = 2; sum <= 12; sum++) {
            var ways = 6 - Math.abs(sum - 7);
            o.push({ k: sum, p: ways / 36 });
          }
        }
        return o;
      },
      readout: function (s) {
        var d = Math.round(s.dice);
        return d <= 1
          ? "One fair die. Sample space Ω = {1,…,6}, each outcome has probability 1/6 ≈ 0.167."
          : "Two fair dice, plotting the sum. 36 equally likely outcomes; the sum 7 is most likely (6/36 ≈ 0.167).";
      }
    });
  },
  title: "Sample space & events",
  tagline: "List everything that could happen. That list is where all probability lives.",
  bigIdea:
    `<p>Before you can talk about chance, you must list what <i>could</i> happen.</p>
     <p>The <b>sample space</b> is that complete list of possible outcomes.</p>
     <p>An <b>event</b> is just a chunk of that list — a group of outcomes you care about.</p>
     <p>Everything in probability is built on these two simple ideas.</p>`,
  buildup:
    `<p>Flip a coin. The only things that can happen are heads or tails.</p>
     <p>Write them down: $\\{H, T\\}$. That full set of possibilities is the sample space.</p>
     <p>An event is a question you ask about it, like "did we get heads?"</p>`,
  symbols: [
    { sym: "$\\Omega$", desc: "the sample space: the set of ALL possible outcomes. It is a capital Greek 'omega'." },
    { sym: "$\\{\\,\\}$", desc: "curly braces mean 'a set', i.e. a collection of things listed inside." },
    { sym: "$A$", desc: "an event: a subset of $\\Omega$ (some of the outcomes, not always all)." },
    { sym: "$\\subseteq$", desc: "'is a subset of'. $A \\subseteq \\Omega$ means every outcome in $A$ is also in $\\Omega$." },
    { sym: "$\\omega$", desc: "a single outcome (lower-case omega), one item inside $\\Omega$." }
  ],
  formula: `$$ \\Omega = \\{\\,\\omega_1, \\omega_2, \\dots\\,\\} \\qquad A \\subseteq \\Omega $$`,
  whatItDoes:
    `<p>The left side says: $\\Omega$ is the set holding every outcome $\\omega$.</p>
     <p>The right side says: an event $A$ is some of those outcomes grouped together.</p>
     <p>If the outcome that actually happens is inside $A$, we say "the event $A$ occurred".</p>`,
  example:
    `<p>Roll one fair six-sided die. Sample space $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$ — six equally likely outcomes, each with probability $\\frac{1}{6}$.</p>
     <table class="extable">
       <caption>Two events as subsets of the same $\\Omega = \\{1,2,3,4,5,6\\}$</caption>
       <thead><tr><th>event</th><th>subset</th><th class="num">outcomes in it</th><th class="num">probability</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$A$ = "even"</td><td>$\\{2, 4, 6\\}$</td><td class="num">3</td><td class="num">$\\frac{3}{6} = 0.5$</td></tr>
         <tr><td class="row-h">$B$ = "more than 4"</td><td>$\\{5, 6\\}$</td><td class="num">2</td><td class="num">$\\frac{2}{6} \\approx 0.333$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>$P(A) = \\frac{|A|}{|\\Omega|} = \\frac{3}{6} = 0.5$ (count of even faces over total faces).</li>
       <li>$P(B) = \\frac{|B|}{|\\Omega|} = \\frac{2}{6} \\approx 0.333$.</li>
       <li>Roll a 4: it is inside $A$ ($4 \\in \\{2,4,6\\}$), so event $A$ occurred.</li>
       <li>That same 4 is NOT inside $B$ ($4 \\notin \\{5,6\\}$), so event $B$ did not occur.</li>
     </ul>`,
  application:
    `<p>A spam filter's sample space is every email it could see. The event "this email is spam" is a subset. Defining the sample space clearly is the first step in any model that handles uncertainty.</p>`,
  whenToUse:
    `<p><b>You reach for sample spaces and events whenever you set up a probabilistic model from scratch</b> — before any formula, you must pin down what can happen and which outcomes you care about. It is the framing step for classification, simulation, and any decision under uncertainty.</p>
     <p><b>Use this framing over:</b></p>
     <ul>
       <li><b>Jumping straight to a formula</b> — when the problem is new and you are unsure what "all outcomes" even are; listing $\\Omega$ first prevents double-counting and missed cases.</li>
       <li><b>An informal "list of cases"</b> — when outcomes overlap or are not mutually exclusive; set notation forces you to be precise about subsets.</li>
     </ul>
     <p><b>Pick a different framing when:</b></p>
     <ul>
       <li>The outcome is a real number on a continuum (a price, a delay) — use a continuous density and CDF (Cumulative Distribution Function) instead of an enumerable set.</li>
       <li>The space is astronomically large (all word sequences) — you model structure with random variables and factorized distributions, not an explicit list.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>An incomplete sample space breaks everything.</b> If $\\Omega$ misses an outcome, probabilities won't sum to 1 and every downstream number is wrong. List exhaustively before you compute.</li>
       <li><b>Overlapping events are not disjoint.</b> "Even" and "greater than 3" share the outcome 4, so you cannot just add their probabilities. Check for shared outcomes first.</li>
       <li><b>Outcomes are not always equally likely.</b> The $1/|\\Omega|$ shortcut only holds for a fair, symmetric setup. A loaded die or a biased sensor needs explicit per-outcome weights.</li>
       <li><b>Confusing an outcome with an event.</b> An outcome is one element of $\\Omega$; an event is a subset. Rolling a 4 is an outcome; "rolling an even number" is an event containing it.</li>
       <li><b>Continuous quantities have no listable outcomes.</b> For a measured weight or time, single points have probability zero — switch to intervals and densities rather than forcing a discrete list.</li>
     </ul>`,
  quiz: {
    q: `Toss two coins. Write the sample space $\\Omega$. Then write the event $A$ = "exactly one head".`,
    a: `<p>$\\Omega = \\{HH, HT, TH, TT\\}$ (four outcomes). $A = \\{HT, TH\\}$ — the two outcomes with exactly one head.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-axioms",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "pa", label: "P(A)", min: 0, max: 1, val: 0.3, step: 0.01 },
        { key: "pb", label: "P(B)", min: 0, max: 1, val: 0.3, step: 0.01 },
        { key: "pc", label: "P(C)", min: 0, max: 1, val: 0.2, step: 0.01 }
      ],
      bars: true, barsHeight: 150,
      compute: function (s) {
        var sum = s.pa + s.pb + s.pc;
        var ok = sum <= 1;
        var msg = ok
          ? "Sum P(A)+P(B)+P(C) = " + sum.toFixed(2) + " ≤ 1. Each is in [0,1] and they fit inside one sample space — valid for disjoint events."
          : "Sum = " + sum.toFixed(2) + " > 1. <b>Invalid</b> if these are disjoint events: total probability can never exceed 1.";
        return { text: msg,
          bars: [
            { label: "P(A)", val: s.pa, color: "#4ea1ff" },
            { label: "P(B)", val: s.pb, color: "#7ee787" },
            { label: "P(C)", val: s.pc, color: "#c89bff" }
          ], max: 1 };
      }
    });
  },
  title: "Probability axioms",
  tagline: "Three simple rules that every probability must obey. No more, no less.",
  prereqs: ["prob-sample-space"],
  bigIdea:
    `<p>A probability is a number between 0 and 1 attached to an event.</p>
     <p>0 means "never happens". 1 means "always happens".</p>
     <p>For these numbers to make sense, they must follow three plain rules.</p>
     <p>Every formula in probability is built on top of these rules.</p>`,
  buildup:
    `<p>You have a sample space $\\Omega$ and events inside it.</p>
     <p>You want to assign each event a chance. But you cannot assign chances randomly — they have to be consistent.</p>
     <p>These three rules (axioms) keep them consistent.</p>`,
  symbols: [
    { sym: "$P(A)$", desc: "the probability of event $A$: a number from 0 to 1." },
    { sym: "$\\ge$", desc: "'greater than or equal to'. So $P(A) \\ge 0$ means the chance is never negative." },
    { sym: "$P(\\Omega)$", desc: "the probability that SOME outcome happens. It must be 1 (something always happens)." },
    { sym: "$A \\cup B$", desc: "'A union B': the event that A OR B (or both) happens. The cup $\\cup$ means 'or'." },
    { sym: "$A^c$", desc: "the complement of $A$: the event that $A$ does NOT happen. The little 'c' means 'complement'." },
    { sym: "disjoint", desc: "two events are disjoint if they cannot both happen at once (no shared outcomes)." }
  ],
  formula: `$$ P(A) \\ge 0 \\qquad P(\\Omega) = 1 \\qquad P(A \\cup B) = P(A) + P(B)\\;\\text{ if disjoint} $$`,
  whatItDoes:
    `<p>Rule 1 (nonnegativity): a chance is never below 0.</p>
     <p>Rule 2 (normalization): the chance that anything at all happens is exactly 1.</p>
     <p>Rule 3 (additivity): if two events can't overlap, the chance of "one or the other" is just their chances added.</p>
     <p>A handy result follows: $P(A^c) = 1 - P(A)$. The chance it doesn't happen is 1 minus the chance it does.</p>`,
  example:
    `<p>Roll a fair die. Each face has probability $\\frac{1}{6} \\approx 0.167$. Take $A = \\{1,2\\}$ and $B = \\{5,6\\}$ — they share no faces, so they are disjoint.</p>
     <table class="extable">
       <caption>Checking each axiom on the fair die</caption>
       <thead><tr><th>axiom</th><th>plug in</th><th class="num">value</th></tr></thead>
       <tbody>
         <tr><td class="row-h">nonnegativity $P(A)\\ge 0$</td><td>$\\frac{2}{6}$</td><td class="num">$0.333 \\ge 0$ ✔</td></tr>
         <tr><td class="row-h">normalization $P(\\Omega)$</td><td>$\\frac{6}{6}$</td><td class="num">$1$ ✔</td></tr>
         <tr><td class="row-h">additivity $P(A\\cup B)$</td><td>$\\frac{2}{6}+\\frac{2}{6}$</td><td class="num">$\\frac{4}{6} \\approx 0.667$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>$P(A) = \\frac{2}{6}$ and $P(B) = \\frac{2}{6}$ (two faces each).</li>
       <li>$A$ and $B$ are disjoint, so additivity applies: $P(A \\cup B) = \\frac{2}{6} + \\frac{2}{6} = \\frac{4}{6} = \\frac{2}{3} \\approx 0.667$.</li>
       <li>Complement rule: $P(\\text{not } A) = 1 - P(A) = 1 - \\frac{2}{6} = \\frac{4}{6} \\approx 0.667$.</li>
       <li>Check: "not $A$" is faces $\\{3,4,5,6\\}$ — four faces, so $\\frac{4}{6}$. ✔ Matches.</li>
     </ul>`,
  application:
    `<p>When a classifier outputs probabilities over many classes (cat, dog, bird), those numbers must each be $\\ge 0$ and sum to 1. That is the normalization axiom in action. The 'softmax' function exists to enforce it.</p>`,
  whenToUse:
    `<p><b>The axioms are your sanity-check layer</b> — you reach for them whenever a model emits numbers that claim to be probabilities and you need to confirm they are valid (non-negative, summing to 1) and combine them correctly. They are the rules every probability formula must obey.</p>
     <p><b>Lean on them over:</b></p>
     <ul>
       <li><b>Trusting raw model scores</b> — when an output layer produces unbounded logits; the axioms tell you to push them through softmax or a sigmoid before treating them as probabilities.</li>
       <li><b>Ad-hoc addition</b> — when events overlap; the axioms give you the inclusion–exclusion rule $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$ instead of double-counting.</li>
     </ul>
     <p><b>Reach elsewhere when:</b> you need conditional reasoning (use Bayes' rule) or expectations and spread (use expectation and variance) — the axioms underlie those but don't compute them for you.</p>`,
  pitfalls:
    `<ul>
       <li><b>Probabilities that don't sum to 1.</b> Raw model outputs or hand-built tables often miss this. Normalize explicitly; a vector summing to 0.97 is not a valid distribution.</li>
       <li><b>Adding non-disjoint events.</b> $P(A\\cup B)=P(A)+P(B)$ only holds when $A$ and $B$ cannot both happen. Subtract the overlap otherwise.</li>
       <li><b>Negative or above-one "probabilities".</b> A floating-point bug or a bad normalization can push values outside $[0,1]$. Clamp and assert during development.</li>
       <li><b>Forgetting the complement.</b> $P(\\text{not } A)=1-P(A)$ is the cheapest sanity check; if it gives something weird, your numbers are off.</li>
       <li><b>Treating "low probability" as impossible.</b> An event with probability $0.001$ still happens roughly once in a thousand trials — rare is not never at scale.</li>
     </ul>`,
  quiz: {
    q: `If $P(\\text{rain}) = 0.3$, what is $P(\\text{no rain})$?`,
    a: `<p>Use the complement rule: $P(\\text{no rain}) = 1 - 0.3 = 0.7$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-conditional",
  demo: function (host) {
    // BESPOKE Venn diagram: two overlapping circles A and B inside the sample space.
    // Sliders set each circle's radius and how far apart their centers are, which
    // controls the overlap. We shade B as the "given" universe, then highlight A∩B
    // inside it, and report P(A|B) = area(A∩B) / area(B).
    host.innerHTML = "";
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return (s && s.getPropertyValue(n).trim()) || d; } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 340; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    var state = { rA: 95, rB: 110, d: 120 };

    // lens (intersection) area of two circles, radii r0,r1 with centers distance dd apart
    function lensArea(r0, r1, dd) {
      if (dd >= r0 + r1) return 0;                 // disjoint
      if (dd <= Math.abs(r0 - r1)) {               // one inside the other
        var rm = Math.min(r0, r1); return Math.PI * rm * rm;
      }
      var a0 = (dd * dd + r0 * r0 - r1 * r1) / (2 * dd);
      var a1 = dd - a0;
      var h0 = Math.max(0, r0 * r0 - a0 * a0), h1 = Math.max(0, r1 * r1 - a1 * a1);
      var t0 = r0 * r0 * Math.acos(Math.max(-1, Math.min(1, a0 / r0))) - a0 * Math.sqrt(h0);
      var t1 = r1 * r1 * Math.acos(Math.max(-1, Math.min(1, a1 / r1))) - a1 * Math.sqrt(h1);
      return t0 + t1;
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, 640, 340);
      ctx.font = "14px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      // sample space box
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.strokeRect(20, 18, 600, 270);
      ctx.fillStyle = c.dim; ctx.fillText("Ω  (sample space)", 28, 38);

      var cy = 165;
      var rA = state.rA, rB = state.rB, d = state.d;
      // center the pair horizontally inside the box
      var span = d, mid = 320;
      var bx = mid - span / 2, ax = mid + span / 2;   // B on the left (the given world), A on the right

      // 1) shade B fully = the "given" universe
      ctx.save();
      ctx.beginPath(); ctx.arc(bx, cy, rB, 0, 7); ctx.closePath(); ctx.clip();
      ctx.fillStyle = c.accent2 + "33"; ctx.fillRect(0, 0, 640, 340);
      ctx.restore();

      // 2) highlight A∩B (the part of B that is also A) by clipping to BOTH circles
      ctx.save();
      ctx.beginPath(); ctx.arc(bx, cy, rB, 0, 7); ctx.closePath(); ctx.clip();
      ctx.beginPath(); ctx.arc(ax, cy, rA, 0, 7); ctx.closePath(); ctx.clip();
      ctx.fillStyle = c.purple + "aa"; ctx.fillRect(0, 0, 640, 340);
      ctx.restore();

      // outlines
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = c.accent2;
      ctx.beginPath(); ctx.arc(bx, cy, rB, 0, 7); ctx.stroke();
      ctx.strokeStyle = c.accent;
      ctx.beginPath(); ctx.arc(ax, cy, rA, 0, 7); ctx.stroke();

      // labels
      ctx.font = "bold 18px -apple-system, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = c.accent2; ctx.fillText("B", bx - rB - 12, cy);
      ctx.fillStyle = c.accent; ctx.fillText("A", ax + rA + 12, cy);
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = c.purple; ctx.font = "13px -apple-system, sans-serif";
      var inter = lensArea(rA, rB, d);
      if (inter > 300) ctx.fillText("A∩B", (ax + bx) / 2 - 16, cy + 4);

      var areaB = Math.PI * rB * rB;
      var cond = areaB > 0 ? inter / areaB : 0;

      // legend swatches under the box
      ctx.font = "12px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic";
      var ly = 308;
      ctx.fillStyle = c.accent2 + "55"; ctx.fillRect(28, ly - 10, 14, 14); ctx.strokeStyle = c.accent2; ctx.lineWidth = 1.5; ctx.strokeRect(28, ly - 10, 14, 14);
      ctx.fillStyle = c.ink; ctx.fillText("B = the given world", 48, ly + 1);
      ctx.fillStyle = c.purple + "aa"; ctx.fillRect(220, ly - 10, 14, 14);
      ctx.fillStyle = c.ink; ctx.fillText("A∩B inside B", 240, ly + 1);

      readout.innerHTML = "Once B is given, B becomes the whole world (green). P(A | B) is the fraction of that world also in A (purple). " +
        "P(A | B) = area(A∩B) / area(B) = <b>" + Math.round(inter) + "</b> / <b>" + Math.round(areaB) + "</b> = <b>" + cond.toFixed(3) + "</b>.";
    }

    function mkSlider(label, min, max, val, step, set) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = String(val);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = min; inp.max = max; inp.step = step; inp.value = val;
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); vs.textContent = String(v); set(v); draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    mkSlider("size of A (radius)", 40, 130, state.rA, 1, function (v) { state.rA = v; });
    mkSlider("size of B (the given event, radius)", 40, 130, state.rB, 1, function (v) { state.rB = v; });
    mkSlider("distance between centers (overlap)", 0, 250, state.d, 1, function (v) { state.d = v; });
    host.appendChild(readout);
    draw();
  },
  title: "Conditional probability",
  tagline: "Once you learn something is true, the odds of everything else change. This measures by how much.",
  prereqs: ["prob-axioms"],
  bigIdea:
    `<p>New information changes the odds.</p>
     <p>Conditional probability answers: "given that $B$ already happened, how likely is $A$ now?"</p>
     <p>The trick: shrink your whole world down to just $B$. Forget everything outside $B$.</p>
     <p>Then ask what fraction of that smaller world is also $A$.</p>`,
  buildup:
    `<p>Normally $A$'s chance is measured against the full sample space $\\Omega$.</p>
     <p>But if you know $B$ happened, $\\Omega$ is no longer the playing field. $B$ is.</p>
     <p>So you re-measure $A$ inside $B$ only.</p>`,
  symbols: [
    { sym: "$P(A \\mid B)$", desc: "the probability of $A$ GIVEN that $B$ happened. The bar '$\\mid$' means 'given'." },
    { sym: "$A \\cap B$", desc: "'A intersect B': the event that A AND B both happen. The cap $\\cap$ means 'and'." },
    { sym: "$P(A \\cap B)$", desc: "the probability that both $A$ and $B$ happen." },
    { sym: "$P(B)$", desc: "the probability of $B$ (must be more than 0, or 'given B' makes no sense)." }
  ],
  formula: `$$ P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} $$`,
  whatItDoes:
    `<p>The bottom $P(B)$ is your new, smaller world.</p>
     <p>The top $P(A \\cap B)$ is the part of that world where $A$ is also true.</p>
     <p>Dividing gives the fraction of $B$ that is also $A$ — exactly the chance of $A$ inside $B$.</p>`,
  example:
    `<p>Roll a fair die. Let $A$ = "rolled a 2", and $B$ = "rolled an even number" $= \\{2,4,6\\}$. Someone tells you the roll was even. Now, how likely is a 2?</p>
     <table class="extable">
       <caption>Plugging real numbers into $P(A\\mid B) = \\dfrac{P(A\\cap B)}{P(B)}$</caption>
       <thead><tr><th>piece</th><th>outcomes</th><th class="num">probability</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$B$ (the given world)</td><td>$\\{2,4,6\\}$</td><td class="num">$\\frac{3}{6} = 0.5$</td></tr>
         <tr><td class="row-h">$A \\cap B$ (2 and even)</td><td>$\\{2\\}$</td><td class="num">$\\frac{1}{6} \\approx 0.167$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>$P(B) = \\frac{3}{6} = \\frac{1}{2}$ (three even faces out of six).</li>
       <li>$A \\cap B$ = "rolled a 2 AND it's even" = just $\\{2\\}$, so $P(A \\cap B) = \\frac{1}{6}$.</li>
       <li>$P(A \\mid B) = \\frac{1/6}{1/2} = \\frac{1}{6} \\times \\frac{2}{1} = \\frac{2}{6} = \\frac{1}{3} \\approx 0.333$.</li>
       <li>Makes sense: once you know it's even, there are only 3 faces left and 2 is one of them — $\\frac{1}{3}$.</li>
     </ul>`,
  application:
    `<p>Recommendation systems ask "given that you watched this movie, how likely are you to watch that one?" Conditioning on what a user already did is the core of personalization.</p>`,
  whenToUse:
    `<p><b>You reach for conditional probability the moment new information should change a prediction</b> — it is how you update a belief once you know something. Any model that personalizes, filters, or reasons "given X, what about Y?" runs on conditioning.</p>
     <p><b>Choose conditioning over:</b></p>
     <ul>
       <li><b>A flat, unconditional rate</b> — when context matters; the base click rate is far less useful than the click rate <i>given</i> this user and this hour.</li>
       <li><b>Assuming independence</b> — when features actually interact; conditioning keeps the dependence that a naive product would throw away.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You need to flip the direction (you have $P(B\\mid A)$ but want $P(A\\mid B)$) — that is Bayes' rule.</li>
       <li>You want a single summary number given inputs — use conditional expectation $E[Y\\mid X]$ rather than a full conditional distribution.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Reversing the condition.</b> $P(A\\mid B)$ is not $P(B\\mid A)$. "Spam given these words" differs wildly from "these words given spam" — mixing them is the classic Bayesian blunder.</li>
       <li><b>Conditioning on a zero-probability event.</b> Dividing by $P(B)=0$ is undefined. If $B$ never occurs in your data, you cannot condition on it without smoothing.</li>
       <li><b>Tiny conditioning sets.</b> $P(A\\mid B)$ estimated from a handful of matching rows is wildly noisy. Watch the count behind every conditional rate; n &lt; 30 is shaky.</li>
       <li><b>Selection bias sneaks in.</b> Conditioning on a variable affected by the outcome (a collider) can create fake correlations. Be careful what you filter on.</li>
       <li><b>Assuming conditioning implies causation.</b> "Survival given treatment" mixes the treatment's effect with who got treated. Conditioning describes association, not cause.</li>
     </ul>`,
  quiz: {
    q: `A die came up greater than 3 (so it's in $\\{4,5,6\\}$). What is the probability it's a 6?`,
    a: `<p>The new world is $\\{4,5,6\\}$, three equally likely faces. $P(6 \\mid &gt;3) = \\frac{1/6}{3/6} = \\frac{1}{3}$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-bayes",
  demo: function (host) {
    Demos.grid(host, {
      rows: 10, cols: 10,
      controls: [
        { key: "prev", label: "prevalence (sick per 100)", min: 1, max: 30, val: 5, step: 1 },
        { key: "sens", label: "sensitivity P(+ | sick) %", min: 50, max: 100, val: 90, step: 1 },
        { key: "fpr", label: "false-positive rate P(+ | healthy) %", min: 0, max: 40, val: 9, step: 1 }
      ],
      cell: function (r, c, s) {
        var i = r * 10 + c;
        var sick = Math.round(s.prev);
        var falsePos = Math.round((100 - sick) * (s.fpr / 100));
        if (i < sick) return { color: "#ff7b72" };
        if (i < sick + falsePos) return { color: "#ffb454" };
        return { color: "#2a3340" };
      },
      readout: function (s) {
        var sick = Math.round(s.prev);
        var falsePos = Math.round((100 - sick) * (s.fpr / 100));
        var truePos = Math.round(sick * (s.sens / 100));
        var posTotal = truePos + falsePos;
        var ppv = posTotal > 0 ? (truePos / posTotal) * 100 : 0;
        return "Red = the <b>" + sick + "</b> truly sick (per 100). Orange = the <b>" + falsePos +
          "</b> healthy people who get a false positive. Of those, the test actually flags <b>" + truePos +
          "</b> of the sick and <b>" + falsePos + "</b> of the healthy. So among the <b>" + posTotal +
          "</b> who test positive, only <b>" + truePos + "</b> are really sick &rarr; P(sick | +) = <b>" +
          ppv.toFixed(1) + "%</b>. A rare disease keeps this low even with a strong test.";
      }
    });
  },
  title: "Bayes' rule",
  tagline: "Flip a conditional probability around. The secret weapon for tests and beliefs.",
  prereqs: ["prob-conditional"],
  bigIdea:
    `<p>Sometimes you know $P(B \\mid A)$ but really want $P(A \\mid B)$.</p>
     <p>Bayes' rule flips one into the other.</p>
     <p>It is how you update a belief after seeing evidence.</p>
     <p>The big lesson: the starting rate (how common $A$ is to begin with) matters a LOT.</p>`,
  buildup:
    `<p>A medical test tells you $P(\\text{test positive} \\mid \\text{sick})$ — how often a sick person tests positive.</p>
     <p>But you actually want $P(\\text{sick} \\mid \\text{test positive})$ — given a positive test, are you sick?</p>
     <p>Those are different numbers. Bayes' rule connects them.</p>`,
  symbols: [
    { sym: "$P(A \\mid B)$", desc: "what we want: chance of $A$ given evidence $B$ (the 'posterior')." },
    { sym: "$P(B \\mid A)$", desc: "what we usually know: chance of evidence $B$ if $A$ is true (the 'likelihood')." },
    { sym: "$P(A)$", desc: "the base rate: how common $A$ is before any evidence (the 'prior')." },
    { sym: "$P(B)$", desc: "the total chance of seeing evidence $B$, any way it could happen." }
  ],
  formula: `$$ P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)} $$`,
  whatItDoes:
    `<p>Start with your prior belief $P(A)$.</p>
     <p>Multiply by how well the evidence fits, $P(B \\mid A)$.</p>
     <p>Divide by how likely the evidence was overall, $P(B)$.</p>
     <p>Out comes your updated belief $P(A \\mid B)$.</p>`,
  example:
    `<p>A disease affects 1 in 1000 people. A test is 99% accurate (it catches sick people 99% of the time, and gives a false alarm just 1% of the time for healthy people). You test positive. Are you sick?</p>
     <table class="extable">
       <caption>Prior × likelihood = the two ways to test positive</caption>
       <thead><tr><th>group</th><th class="num">prior $P(A)$</th><th class="num">likelihood $P(+\\mid A)$</th><th class="num">product</th></tr></thead>
       <tbody>
         <tr><td class="row-h">sick</td><td class="num">0.001</td><td class="num">0.99</td><td class="num">0.00099</td></tr>
         <tr><td class="row-h">healthy</td><td class="num">0.999</td><td class="num">0.01</td><td class="num">0.00999</td></tr>
         <tr><td class="row-h">total $P(+)$</td><td class="num"></td><td class="num"></td><td class="num">0.01098</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Prior: $P(\\text{sick}) = 0.001$, so $P(\\text{healthy}) = 0.999$.</li>
       <li>Likelihood: $P(+ \\mid \\text{sick}) = 0.99$, false alarm $P(+ \\mid \\text{healthy}) = 0.01$.</li>
       <li>Evidence $P(+) = 0.99 \\times 0.001 + 0.01 \\times 0.999 = 0.00099 + 0.00999 = 0.01098$.</li>
       <li>Bayes: $P(\\text{sick} \\mid +) = \\frac{0.99 \\times 0.001}{0.01098} = \\frac{0.00099}{0.01098} \\approx 0.09$.</li>
       <li>Only about <b>9%</b>! Even with a "99% accurate" test, a positive usually means you're healthy — because the disease is so rare to begin with.</li>
     </ul>`,
  application:
    `<p>Bayes' rule powers spam filters (given these words, is it spam?), medical diagnosis, and Bayesian machine learning. The lesson about base rates is one of the most important ideas in all of statistics.</p>`,
  whenToUse:
    `<p><b>Reach for Bayes' rule when you can measure one direction of a relationship but need the other</b> — you know how likely the evidence is under each hypothesis, and you want the probability of the hypothesis given the evidence. It is the engine of diagnosis, spam filtering, and belief updating.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Reading a test result at face value</b> — when the base rate is low; Bayes forces you to fold in how rare the condition is, which a raw "95% accurate" claim hides.</li>
       <li><b>A discriminative model</b> — when you want interpretable, updatable beliefs and have a clean generative story for the evidence.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You only care about a decision boundary, not calibrated probabilities — a discriminative classifier (logistic regression, a tree) is often simpler and more accurate.</li>
       <li>The likelihood is intractable — you may need approximate inference (variational methods, MCMC, Markov Chain Monte Carlo) rather than the closed-form rule.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Ignoring the base rate.</b> The single most common error. A 99%-accurate test for a 1-in-10,000 disease still flags mostly false positives. Always multiply by the prior.</li>
       <li><b>Confusing $P(A\\mid B)$ with $P(B\\mid A)$.</b> "Disease given a positive test" is not "positive test given disease." Bayes exists precisely to convert between them.</li>
       <li><b>A bad prior dominates with little data.</b> When evidence is thin, the posterior is mostly the prior. Choose priors deliberately and report sensitivity to them.</li>
       <li><b>Treating correlated evidence as independent.</b> Multiplying likelihoods of overlapping signals overcounts the evidence and gives a falsely confident posterior.</li>
       <li><b>Numerical underflow.</b> Multiplying many small likelihoods drives products toward zero. Work in log-space with $\\log P$ sums instead of raw products.</li>
       <li><b>Stale priors.</b> A prior estimated last year may no longer match today's population; revisit base rates as the data distribution drifts.</li>
     </ul>`,
  quiz: {
    q: `Why was a positive test only 9% likely to mean illness, despite the test being 99% accurate?`,
    a: `<p>Because the disease is rare (1 in 1000). Healthy people vastly outnumber sick people, so even a tiny 1% false-alarm rate produces many more false positives than true positives. The base rate dominates.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-total-prob",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "pa1", label: "P(A₁) — weight of case 1 (A₂ = 1−A₁)", min: 0, max: 1, val: 0.6, step: 0.01 },
        { key: "pb1", label: "P(B|A₁)", min: 0, max: 1, val: 0.02, step: 0.01 },
        { key: "pb2", label: "P(B|A₂)", min: 0, max: 1, val: 0.05, step: 0.01 }
      ],
      bars: true, barsHeight: 130,
      compute: function (s) {
        var pa2 = 1 - s.pa1;
        var c1 = s.pa1 * s.pb1, c2 = pa2 * s.pb2, pb = c1 + c2;
        return { text: "P(B) = P(A₁)P(B|A₁) + P(A₂)P(B|A₂) = " + c1.toFixed(3) + " + " + c2.toFixed(3) +
          " = <b>" + pb.toFixed(3) + "</b>. Each case contributes its weight times B's chance inside it.",
          bars: [
            { label: "case 1: P(A₁)P(B|A₁)", val: c1, color: "#4ea1ff" },
            { label: "case 2: P(A₂)P(B|A₂)", val: c2, color: "#7ee787" },
            { label: "total P(B)", val: pb, color: "#c89bff" }
          ], max: 1 };
      }
    });
  },
  title: "Total probability theorem",
  tagline: "Split a hard question into easy cases, then weigh and add them up.",
  prereqs: ["prob-conditional"],
  bigIdea:
    `<p>Sometimes the chance of $B$ is hard to find directly.</p>
     <p>But if you split the world into separate cases, $B$ is easy inside each case.</p>
     <p>So compute $B$'s chance case by case, weight each by how likely that case is, and add.</p>
     <p>This is "divide and conquer" for probability.</p>`,
  buildup:
    `<p>Suppose the world splits cleanly into pieces $A_1, A_2, \\dots$ that don't overlap and cover everything. That is called a <b>partition</b>.</p>
     <p>Example: every person is either an adult or a child — two pieces that cover everyone with no overlap.</p>
     <p>Inside each piece, $B$'s chance is simpler to reason about.</p>`,
  symbols: [
    { sym: "$A_i$", desc: "the $i$-th case in the partition (the pieces the world is split into)." },
    { sym: "partition", desc: "a set of non-overlapping cases $A_1, A_2, \\dots$ that together cover all of $\\Omega$." },
    { sym: "$P(A_i)$", desc: "how likely case $A_i$ is — its weight." },
    { sym: "$P(B \\mid A_i)$", desc: "the chance of $B$ inside case $A_i$." },
    { sym: "$\\sum_i$", desc: "'add up over all cases $i$'. The $\\Sigma$ is a capital Greek S, for Sum." }
  ],
  formula: `$$ P(B) = \\sum_i P(A_i)\\, P(B \\mid A_i) $$`,
  whatItDoes:
    `<p>For each case $A_i$: multiply how likely that case is, $P(A_i)$, by the chance of $B$ inside it, $P(B \\mid A_i)$.</p>
     <p>Add all those products together.</p>
     <p>The cases cover everything with no overlap, so nothing is missed and nothing is double-counted.</p>`,
  example:
    `<p>Two factories make light bulbs. Factory 1 makes 60% of them, with a 2% defect rate. Factory 2 makes 40%, with a 5% defect rate. Pick a random bulb. What's the chance it's defective?</p>
     <table class="extable">
       <caption>Each case contributes $P(A_i)\\,P(B\\mid A_i)$ to the total</caption>
       <thead><tr><th>case $A_i$</th><th class="num">weight $P(A_i)$</th><th class="num">$P(D\\mid A_i)$</th><th class="num">contribution</th></tr></thead>
       <tbody>
         <tr><td class="row-h">factory 1</td><td class="num">0.60</td><td class="num">0.02</td><td class="num">0.012</td></tr>
         <tr><td class="row-h">factory 2</td><td class="num">0.40</td><td class="num">0.05</td><td class="num">0.020</td></tr>
         <tr><td class="row-h">total $P(D)$</td><td class="num">1.00</td><td class="num"></td><td class="num">0.032</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Cases partition the bulbs: $P(A_1) = 0.6$, $P(A_2) = 0.4$ (they sum to 1).</li>
       <li>Factory 1 contribution: $P(A_1)\\,P(D\\mid A_1) = 0.6 \\times 0.02 = 0.012$.</li>
       <li>Factory 2 contribution: $P(A_2)\\,P(D\\mid A_2) = 0.4 \\times 0.05 = 0.020$.</li>
       <li>Add: $P(D) = 0.012 + 0.020 = 0.032$, i.e. a 3.2% defect rate overall.</li>
     </ul>`,
  application:
    `<p>This theorem is the denominator $P(B)$ inside Bayes' rule. Any time a model averages over hidden cases (which topic generated this word? which cluster is this point in?), total probability is doing the work.</p>`,
  whenToUse:
    `<p><b>Reach for the law of total probability whenever the easy path to an answer runs through cases you cannot observe directly</b> — split the problem by a hidden variable, solve each case, then average weighted by how likely each case is. It is the standard move for marginalizing out a latent label or cluster.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Attacking $P(B)$ head-on</b> — when $B$ is tangled but becomes simple once you condition on which scenario you are in.</li>
       <li><b>Ignoring a mixture structure</b> — when your data is generated by several sub-populations; summing over components is exactly this law.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The hidden cases form a continuum — replace the sum with an integral (marginalizing a continuous latent variable).</li>
       <li>There are too many cases to enumerate — use sampling or variational approximation instead of an exact sum.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The cases must partition the space.</b> They have to be mutually exclusive <i>and</i> cover every possibility. Overlapping or missing cases make the total wrong.</li>
       <li><b>Forgetting the weights.</b> You average $P(B\\mid A_i)$ weighted by $P(A_i)$, not a plain average. Equal weighting silently assumes equal priors.</li>
       <li><b>Combinatorial blow-up.</b> Summing over many latent configurations is exponential. For large hidden spaces, exact marginalization is infeasible — approximate it.</li>
       <li><b>Numerical underflow in the sum.</b> Adding many tiny terms loses precision; use the log-sum-exp trick to stay stable.</li>
       <li><b>Mismatched conditioning.</b> Every term must condition on the same evidence. Mixing conditions across the partition gives a meaningless total.</li>
     </ul>`,
  quiz: {
    q: `A bag has 70% red apples (10% bruised) and 30% green apples (20% bruised). What is the overall chance an apple is bruised?`,
    a: `<p>$0.7 \\times 0.10 + 0.3 \\times 0.20 = 0.07 + 0.06 = 0.13$, or 13%.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-independence",
  demo: function (host) {
    // BESPOKE side-by-side: LEFT a unit square (the sample space) with A as a
    // horizontal strip of height P(A) and B as a vertical strip of width P(B);
    // their overlap rectangle has area P(A)·P(B) — what independence PREDICTS.
    // RIGHT shows the ACTUAL P(A∩B) you dial in. Equal areas ⇔ independent.
    host.innerHTML = "";
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return (s && s.getPropertyValue(n).trim()) || d; } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
    var state = { pa: 0.5, pb: 0.4, pab: 0.2 };

    function panel(ox, oy, sz, title, drawInner) {
      var c = C();
      ctx.strokeStyle = c.border; ctx.lineWidth = 1.5; ctx.strokeRect(ox, oy, sz, sz);
      ctx.fillStyle = c.dim; ctx.font = "13px -apple-system, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(title, ox + sz / 2, oy - 10);
      drawInner(ox, oy, sz);
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, 640, 320);
      var sz = 220, oy = 40, oxL = 40, oxR = 380;
      var pa = state.pa, pb = state.pb, pab = state.pab;
      var prod = pa * pb;

      // LEFT: independence model — strips + product rectangle
      panel(oxL, oy, sz, "Independence model:  P(A)·P(B)", function (ox, oM, s) {
        // A strip (height pa) along the bottom
        ctx.fillStyle = c.accent + "22"; ctx.fillRect(ox, oM + s * (1 - pa), s, s * pa);
        // B strip (width pb) along the left
        ctx.fillStyle = c.accent2 + "22"; ctx.fillRect(ox, oM, s * pb, s);
        // overlap = product rectangle
        ctx.fillStyle = c.purple + "cc"; ctx.fillRect(ox, oM + s * (1 - pa), s * pb, s * pa);
        ctx.fillStyle = c.accent; ctx.font = "12px -apple-system, sans-serif"; ctx.textAlign = "start";
        ctx.fillText("A: height = P(A) = " + pa.toFixed(2), ox + s * 0.34, oM + s * (1 - pa) - 4);
        ctx.fillStyle = c.accent2; ctx.fillText("B: width", ox + 4, oM + 14);
        ctx.fillText("= " + pb.toFixed(2), ox + 4, oM + 28);
        ctx.fillStyle = c.ink; ctx.textAlign = "center";
        ctx.fillText("area = " + prod.toFixed(3), ox + s / 2, oM + s + 22);
      });

      // RIGHT: actual P(A∩B) as a square block of equal area for visual compare
      panel(oxR, oy, sz, "Actual:  P(A∩B)", function (ox, oM, s) {
        var side = Math.sqrt(Math.max(0, pab)) * s;     // square with area pab*s^2
        ctx.fillStyle = c.warn + "cc"; ctx.fillRect(ox, oM + s - side, side, side);
        ctx.fillStyle = c.ink; ctx.textAlign = "center"; ctx.font = "12px -apple-system, sans-serif";
        ctx.fillText("area = " + pab.toFixed(3), ox + s / 2, oM + s + 22);
      });
      ctx.textAlign = "start";

      var diff = Math.abs(prod - pab);
      var indep = diff < 0.005;
      readout.innerHTML = "P(A)·P(B) = <b>" + prod.toFixed(3) + "</b> &nbsp; vs &nbsp; P(A∩B) = <b>" + pab.toFixed(3) + "</b>. " +
        (indep ? "<b style='color:var(--accent-2)'>Areas match → independent.</b> Knowing B leaves A's chance unchanged."
               : "<b style='color:var(--warn)'>Areas differ by " + diff.toFixed(3) + " → dependent.</b> Independent exactly when the purple rectangle equals the orange one.");
    }

    function mkSlider(label, val, set) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = val.toFixed(2);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = 0; inp.max = 1; inp.step = 0.01; inp.value = val;
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); vs.textContent = v.toFixed(2); set(v); draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    mkSlider("P(A)", state.pa, function (v) { state.pa = v; });
    mkSlider("P(B)", state.pb, function (v) { state.pb = v; });
    mkSlider("P(A∩B) — actual 'both'", state.pab, function (v) { state.pab = v; });
    host.appendChild(readout);
    draw();
  },
  title: "Independence",
  tagline: "When one event tells you nothing about another, they're independent — and the math gets easy.",
  prereqs: ["prob-conditional"],
  bigIdea:
    `<p>Two events are <b>independent</b> when knowing one tells you nothing about the other.</p>
     <p>A coin flip doesn't care what the last flip did. Those flips are independent.</p>
     <p>When events are independent, the chance of both is just their chances multiplied.</p>
     <p>This 'multiply' rule makes huge calculations possible.</p>`,
  buildup:
    `<p>Conditional probability $P(A \\mid B)$ asks how $B$ changes $A$'s odds.</p>
     <p>What if $B$ changes nothing? Then $P(A \\mid B) = P(A)$.</p>
     <p>Plug that into the conditional formula and the 'and' probability simplifies beautifully.</p>`,
  symbols: [
    { sym: "$A, B$", desc: "two events." },
    { sym: "$P(A \\cap B)$", desc: "the chance that both $A$ and $B$ happen." },
    { sym: "$P(A)\\,P(B)$", desc: "the two individual chances multiplied together." },
    { sym: "iff", desc: "'if and only if' — the rule on the left is true exactly when the rule on the right is." }
  ],
  formula: `$$ A, B \\text{ independent} \\iff P(A \\cap B) = P(A)\\,P(B) \\iff P(A \\mid B) = P(A) $$`,
  whatItDoes:
    `<p>The middle test: if the chance of both equals the product of the two chances, the events are independent.</p>
     <p>The right test says the same thing differently: knowing $B$ leaves $A$'s probability unchanged.</p>
     <p>Warning: independent is NOT the same as disjoint. Disjoint events can't co-occur, so they actually depend on each other a lot.</p>`,
  example:
    `<p>Flip a fair coin twice; outcomes $\\{HH, HT, TH, TT\\}$, each with probability $\\frac{1}{4}$. Let $A$ = "first flip heads" $= \\{HH, HT\\}$, $P(A) = \\frac{1}{2}$. Test the product rule against three partners $B, C, D$.</p>
     <table class="extable">
       <caption>$A$ vs each partner: compare $P(A)P(\\cdot)$ with the actual $P(A\\cap\\cdot)$</caption>
       <thead><tr><th>event</th><th class="num">$P(\\cdot)$</th><th class="num">$P(A)\\,P(\\cdot)$</th><th class="num">actual $P(A\\cap\\cdot)$</th><th>verdict</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$B$ = 2nd is H</td><td class="num">$\\frac{1}{2}$</td><td class="num">$\\frac{1}{4} = 0.25$</td><td class="num">$\\frac{1}{4} = 0.25$</td><td>independent</td></tr>
         <tr><td class="row-h">$C$ = same face</td><td class="num">$\\frac{1}{2}$</td><td class="num">$\\frac{1}{4} = 0.25$</td><td class="num">$\\frac{1}{4} = 0.25$</td><td>independent</td></tr>
         <tr><td class="row-h">$D$ = at least 1 H</td><td class="num">$\\frac{3}{4}$</td><td class="num">$\\frac{3}{8} = 0.375$</td><td class="num">$\\frac{1}{2} = 0.5$</td><td>dependent</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>$B$ = "second flip heads": $P(A)P(B) = \\frac{1}{2}\\times\\frac{1}{2} = \\frac{1}{4}$, and $A\\cap B = \\{HH\\}$ gives $\\frac{1}{4}$ — equal, so <b>independent</b>.</li>
       <li>"Knowing $B$" view agrees: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{1/4}{1/2} = \\frac{1}{2} = P(A)$. Learning the second flip changed nothing.</li>
       <li>$C$ = "same face" $= \\{HH, TT\\}$: $P(A)P(C) = \\frac{1}{4}$ and $A\\cap C = \\{HH\\}$ gives $\\frac{1}{4}$ — equal, so <b>independent</b> (even though it "feels" related).</li>
       <li>$D$ = "at least one head" $= \\{HH, HT, TH\\}$: $P(A)P(D) = \\frac{1}{2}\\times\\frac{3}{4} = \\frac{3}{8}$, but $A\\cap D = \\{HH, HT\\}$ gives $\\frac{1}{2}$. Since $\\frac{1}{2} \\neq \\frac{3}{8}$, <b>dependent</b>.</li>
     </ul>`,
  application:
    `<p>The 'Naive Bayes' spam classifier assumes every word appears independently. That assumption is not quite true, but it lets the model just multiply many small probabilities together — and it works shockingly well.</p>`,
  whenToUse:
    `<p><b>You invoke independence as a modeling simplification</b> — when assuming variables don't influence each other lets you multiply probabilities instead of estimating a giant joint table. It is the assumption that makes Naive Bayes, many graphical models, and bootstrap resampling tractable.</p>
     <p><b>Assume independence over:</b></p>
     <ul>
       <li><b>A full joint distribution</b> — when you have too little data to estimate every interaction; independence trades a little accuracy for a model you can actually fit.</li>
       <li><b>Modeling every correlation</b> — when the dependencies are weak enough that the simpler factorized model generalizes better.</li>
     </ul>
     <p><b>Drop the assumption when:</b></p>
     <ul>
       <li>Variables clearly move together (pixels in an image, words in a phrase) — use a model that captures structure, such as a CRF (Conditional Random Field) or a neural network.</li>
       <li>You need to model joint extremes or tail co-movement (correlated failures, financial risk) — independence badly underestimates them.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Independence is an assumption, not a fact.</b> Most real features are at least mildly dependent. Naive Bayes works <i>despite</i> being wrong; don't assume it because it's convenient and forget to check.</li>
       <li><b>Confusing independence with zero correlation.</b> Zero correlation only rules out linear association. Variables can be uncorrelated yet strongly dependent (e.g. $Y=X^2$).</li>
       <li><b>Pairwise does not imply mutual.</b> Three variables can be independent in every pair yet dependent together. Verify the level of independence you actually need.</li>
       <li><b>Multiplying dependent probabilities over-counts.</b> If signals are correlated, the product is too confident — the classic Naive Bayes over-confidence.</li>
       <li><b>Conditional independence is subtle.</b> $A$ and $B$ may be independent only given $C$. Conditioning on the wrong variable can create or destroy independence.</li>
     </ul>`,
  quiz: {
    q: `$P(A) = 0.5$, $P(B) = 0.4$, and $P(A \\cap B) = 0.2$. Are $A$ and $B$ independent?`,
    a: `<p>Check: $P(A)P(B) = 0.5 \\times 0.4 = 0.2$, which equals $P(A \\cap B) = 0.2$. Yes, they are independent.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-counting",
  demo: function (host) {
    // BESPOKE: draw the actual r slots being filled from n labelled items (A,B,C,...).
    // The "slots" view shows the n × (n-1) × ... choice cascade for permutations;
    // below it we list a sample of the real arrangements (ordered) and picks (unordered),
    // so you SEE why dividing the permutations by r! collapses them into combinations.
    host.innerHTML = "";
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return (s && s.getPropertyValue(n).trim()) || d; } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
    var state = { n: 5, r: 3 };

    function perms(items, r) {            // ordered arrangements (list of arrays)
      if (r === 0) return [[]];
      var out = [];
      for (var i = 0; i < items.length; i++) {
        var rest = items.slice(0, i).concat(items.slice(i + 1));
        perms(rest, r - 1).forEach(function (p) { out.push([items[i]].concat(p)); });
      }
      return out;
    }
    function combos(items, r) {           // unordered picks (sorted strings)
      if (r === 0) return [[]];
      if (items.length < r) return [];
      var out = [];
      for (var i = 0; i <= items.length - r; i++) {
        combos(items.slice(i + 1), r - 1).forEach(function (cb) { out.push([items[i]].concat(cb)); });
      }
      return out;
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, 640, 300);
      var n = Math.round(state.n), r = Math.round(state.r);
      if (r > n) r = n;
      var items = LETTERS.slice(0, n);

      ctx.font = "13px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      // ---- slot cascade: r slots, each labelled with how many choices remain ----
      ctx.fillStyle = c.dim; ctx.fillText("Filling " + r + " ordered slots from " + n + " items {" + items.join(",") + "}:", 20, 26);
      var sw = 70, sh = 50, sy = 40, gap = 92, ox = 24;
      for (var k = 0; k < r; k++) {
        var x = ox + k * gap;
        ctx.fillStyle = c.panel; ctx.strokeStyle = c.accent; ctx.lineWidth = 2;
        ctx.fillRect(x, sy, sw, sh); ctx.strokeRect(x, sy, sw, sh);
        ctx.fillStyle = c.accent; ctx.font = "bold 20px -apple-system, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(String(n - k), x + sw / 2, sy + sh / 2 + 7);
        ctx.fillStyle = c.dim; ctx.font = "11px -apple-system, sans-serif";
        ctx.fillText("choices", x + sw / 2, sy + sh + 14);
        if (k < r - 1) { ctx.fillStyle = c.ink; ctx.font = "20px -apple-system, sans-serif"; ctx.fillText("×", x + sw + gap / 2 - 36 + 8, sy + sh / 2 + 7); }
      }
      ctx.textAlign = "start";

      var perm = Demos._fact(n) / Demos._fact(n - r);
      var comb = Demos._comb(n, r);

      // ---- sample list of actual arrangements (ordered) and picks (unordered) ----
      var allP = perms(items, r), allC = combos(items, r);
      var showP = allP.slice(0, 8).map(function (p) { return p.join(""); });
      var showC = allC.slice(0, 8).map(function (cb) { return cb.join(""); });
      var ly = 150;
      ctx.font = "12px -apple-system, sans-serif";
      ctx.fillStyle = c.accent; ctx.fillText("Ordered arrangements (order matters): " + perm + " total", 20, ly);
      ctx.fillStyle = c.ink; ctx.font = "13px ui-monospace, monospace";
      ctx.fillText(showP.join("  ") + (allP.length > showP.length ? "  …" : ""), 20, ly + 20);
      ctx.fillStyle = c.accent2; ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("Unordered picks (order ignored): " + comb + " total", 20, ly + 56);
      ctx.fillStyle = c.ink; ctx.font = "13px ui-monospace, monospace";
      ctx.fillText(showC.join("  ") + (allC.length > showC.length ? "  …" : ""), 20, ly + 76);
      // bracket linking the two
      ctx.fillStyle = c.dim; ctx.font = "12px -apple-system, sans-serif";
      ctx.fillText("Each pick of " + r + " can be ordered in " + r + "! = " + Demos._fact(r) + " ways → divide to collapse them.", 20, ly + 108);

      readout.innerHTML = "Order matters: P(n,r) = n!/(n−r)! = " + Demos._fact(n) + "/" + Demos._fact(n - r) +
        " = <b>" + perm + "</b>.<br>Order doesn't: C(n,r) = P/r! = " + perm + "/" + Demos._fact(r) +
        " = <b>" + comb + "</b>. (r is capped at n.)";
    }

    function mkSlider(label, min, max, val, set) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = String(val);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = min; inp.max = max; inp.step = 1; inp.value = val;
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); vs.textContent = String(v); set(v); draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    mkSlider("n (items to choose from)", 1, 8, state.n, function (v) { state.n = v; });
    mkSlider("r (how many to pick)", 0, 8, state.r, function (v) { state.r = v; });
    host.appendChild(readout);
    draw();
  },
  title: "Counting: permutations & combinations",
  tagline: "To find a probability, you often just have to count carefully. Order is the key question.",
  prereqs: ["prob-axioms"],
  bigIdea:
    `<p>Many probabilities are just "favorable count divided by total count".</p>
     <p>So you need to count how many ways something can happen.</p>
     <p>The key question: does order matter?</p>
     <p>If order matters, use permutations. If it doesn't, use combinations.</p>`,
  buildup:
    `<p>To arrange $r$ items out of $n$, the first slot has $n$ choices, the next $n-1$, and so on.</p>
     <p>That product is a permutation — order matters (gold, silver, bronze are different).</p>
     <p>If order does NOT matter (just 'which 3 people', not their ranks), you've over-counted. Divide out the orderings to get a combination.</p>`,
  symbols: [
    { sym: "$n$", desc: "the total number of items to choose from." },
    { sym: "$r$", desc: "how many you pick." },
    { sym: "$n!$", desc: "'n factorial': $n \\times (n-1) \\times \\dots \\times 2 \\times 1$. So $4! = 4\\times3\\times2\\times1 = 24$. Also, $0! = 1$." },
    { sym: "$\\binom{n}{r}$", desc: "'n choose r': the number of ways to pick $r$ items when order does NOT matter." }
  ],
  formula: `$$ \\text{order matters: } \\frac{n!}{(n-r)!} \\qquad\\quad \\text{order doesn't: } \\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!} $$`,
  whatItDoes:
    `<p>The permutation $\\frac{n!}{(n-r)!}$ counts ordered arrangements of $r$ items.</p>
     <p>The combination $\\binom{n}{r}$ takes that and divides by $r!$, the number of ways to reorder $r$ chosen items, since those reorderings are all the 'same' pick.</p>`,
  example:
    `<p>A class of $n = 5$ students; pick $r = 3$. (a) How many ways to line up 3 for a photo (order matters)? (b) How many ways to pick 3 for a team (order doesn't)?</p>
     <table class="extable">
       <caption>Same $n=5$, $r=3$ — order is the only difference</caption>
       <thead><tr><th>question</th><th>formula</th><th class="num">arithmetic</th><th class="num">count</th></tr></thead>
       <tbody>
         <tr><td class="row-h">line-up (order matters)</td><td>$\\frac{n!}{(n-r)!}$</td><td class="num">$\\frac{120}{2}$</td><td class="num">60</td></tr>
         <tr><td class="row-h">team (order doesn't)</td><td>$\\binom{n}{r} = \\frac{n!}{r!(n-r)!}$</td><td class="num">$\\frac{120}{12}$</td><td class="num">10</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Permutations: $\\frac{5!}{(5-3)!} = \\frac{5!}{2!} = \\frac{120}{2} = 60$ ordered line-ups.</li>
       <li>Combinations: $\\binom{5}{3} = \\frac{5!}{3!\\,2!} = \\frac{120}{6 \\times 2} = \\frac{120}{12} = 10$ teams.</li>
       <li>Notice $60 = 10 \\times 6$: each team of 3 can be lined up in $3! = 6$ orders, so dividing by $3!$ collapses them.</li>
     </ul>`,
  application:
    `<p>Combinations appear inside the binomial distribution (next lessons), in counting possible feature subsets, and in calculating the odds of card hands or lottery wins. Counting correctly is the foundation of discrete probability.</p>`,
  whenToUse:
    `<p><b>You reach for counting whenever a probability reduces to "favorable outcomes over total outcomes" and the outcomes are discrete arrangements</b> — hands of cards, subsets of features, orderings, or the coefficients inside a binomial. It is the bookkeeping under every discrete distribution.</p>
     <p><b>Use combinatorics over:</b></p>
     <ul>
       <li><b>Brute-force enumeration</b> — when the space is too large to list but has clean multiplicative structure; a formula gives the count instantly.</li>
       <li><b>Guessing the size of a search space</b> — when you need to know how many models, splits, or hyperparameter grids exist before committing compute.</li>
     </ul>
     <p><b>Reach elsewhere when:</b></p>
     <ul>
       <li>Outcomes are continuous — counting doesn't apply; use densities and integration.</li>
       <li>The exact count is astronomically large and you only need an estimate — use sampling or asymptotic approximations (Stirling's formula).</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Order matters or it doesn't — decide first.</b> Permutations count ordered arrangements; combinations count unordered sets. Using the wrong one is the #1 counting error.</li>
       <li><b>Double-counting.</b> Treating $\\{A,B\\}$ and $\\{B,A\\}$ as distinct inflates the count. Divide out the repeats you didn't mean to count.</li>
       <li><b>With- vs without-replacement.</b> Drawing the same item twice changes the formula entirely. Be explicit about whether items can repeat.</li>
       <li><b>Factorial overflow.</b> $n!$ explodes fast; $20!$ already overflows a 64-bit integer. Compute in log-space or cancel terms before multiplying.</li>
       <li><b>Forgetting equal-likelihood.</b> The favorable-over-total shortcut assumes every outcome is equally likely. Weighted or biased outcomes need probabilities, not raw counts.</li>
     </ul>`,
  quiz: {
    q: `How many ways can you choose 2 toppings from 4 available (order doesn't matter)?`,
    a: `<p>$\\binom{4}{2} = \\frac{4!}{2!\\,2!} = \\frac{24}{2 \\times 2} = \\frac{24}{4} = 6$ ways.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-random-variable",
  demo: function (host) {
    Demos.bars(host, {
      controls: [],
      pmf: function () {
        var n = 3, o = [];
        for (var k = 0; k <= n; k++) o.push({ k: k, p: Demos._comb(n, k) * Math.pow(0.5, n) });
        return o;
      },
      readout: function (s, bars) {
        var sum = 0; bars.forEach(function (b) { sum += b.p; });
        return "X = number of heads in 3 fair flips. PMF values: 1/8, 3/8, 3/8, 1/8. They sum to <b>" + sum.toFixed(2) + "</b> = 1.";
      }
    });
  },
  title: "Random variable & PMF",
  tagline: "Turn messy outcomes into numbers, then list how likely each number is.",
  prereqs: ["prob-axioms"],
  bigIdea:
    `<p>Outcomes like "heads" or "defective" are hard to do math with.</p>
     <p>A <b>random variable</b> turns each outcome into a number.</p>
     <p>The <b>PMF</b> (probability mass function) then lists how likely each number is.</p>
     <p>Now you can add, average, and compute — because everything is numbers.</p>`,
  buildup:
    `<p>Say you flip 3 coins. The outcome is messy: $HTH$, $TTH$, and so on.</p>
     <p>Define a random variable $X$ = "number of heads". Now every outcome becomes 0, 1, 2, or 3.</p>
     <p>The PMF tells you the chance of each of those numbers.</p>`,
  symbols: [
    { sym: "$X$", desc: "a random variable: a rule that assigns a number to each outcome. Capital letter." },
    { sym: "$x$", desc: "a particular value that $X$ can take (lower-case)." },
    { sym: "$p_X(x)$", desc: "the PMF: the probability that $X$ equals the value $x$." },
    { sym: "$P(X = x)$", desc: "another way to write 'the probability that $X$ equals $x$'." },
    { sym: "$\\sum_x$", desc: "'add up over every value $x$ that $X$ can take'." }
  ],
  formula: `$$ p_X(x) = P(X = x) \\qquad \\sum_x p_X(x) = 1 $$`,
  whatItDoes:
    `<p>The left part defines the PMF: plug in a value $x$, get the chance $X$ lands on it.</p>
     <p>The right part is the normalization rule: $X$ must take SOME value, so all the chances add to 1.</p>`,
  example:
    `<p>Flip 2 fair coins. Let $X$ = number of heads. Outcomes $\\{HH, HT, TH, TT\\}$, each with chance $\\frac{1}{4}$.</p>
     <table class="extable">
       <caption>The PMF $p_X(x) = P(X=x)$</caption>
       <thead><tr><th>$x$</th><th>outcomes giving it</th><th class="num">$p_X(x)$</th></tr></thead>
       <tbody>
         <tr><td class="num">0</td><td>$TT$</td><td class="num">$\\frac{1}{4} = 0.25$</td></tr>
         <tr><td class="num">1</td><td>$HT, TH$</td><td class="num">$\\frac{2}{4} = 0.5$</td></tr>
         <tr><td class="num">2</td><td>$HH$</td><td class="num">$\\frac{1}{4} = 0.25$</td></tr>
         <tr><td class="row-h">sum</td><td></td><td class="num">$1.0$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>$X = 0$ (no heads): only $TT$, so $p_X(0) = \\frac{1}{4}$.</li>
       <li>$X = 1$ (one head): $HT$ or $TH$, so $p_X(1) = \\frac{2}{4} = \\frac{1}{2}$.</li>
       <li>$X = 2$ (two heads): only $HH$, so $p_X(2) = \\frac{1}{4}$.</li>
       <li>Normalization check: $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{4} = 1$. ✔</li>
     </ul>`,
  application:
    `<p>A model's output 'how many clicks will this ad get?' is a random variable. Its PMF is the model's prediction. Random variables are how we attach numbers and probabilities to real-world uncertainty.</p>`,
  whenToUse:
    `<p><b>You reach for the random-variable framing whenever you need to attach numbers and probabilities to an uncertain outcome</b> — it is the bridge from "things that could happen" to quantities you can average, compare, and feed into a model. Every prediction, label, and loss is a random variable.</p>
     <p><b>Use it over:</b></p>
     <ul>
       <li><b>Reasoning about raw outcomes</b> — when you want to compute an expectation or variance; those need a numeric variable, not a list of events.</li>
       <li><b>A single point estimate</b> — when the spread matters as much as the center; a random variable carries the whole distribution, not just one number.</li>
     </ul>
     <p><b>Choose a specific distribution when:</b> you know the data's shape — a Bernoulli for yes/no, a Poisson for counts, a Normal for noise. The random variable is the abstract object; the distribution (covered next) is its concrete law.</p>`,
  pitfalls:
    `<ul>
       <li><b>Discrete vs continuous mix-up.</b> Discrete variables have a PMF (Probability Mass Function) that sums to 1; continuous ones have a density that integrates to 1. Treating one as the other gives nonsense.</li>
       <li><b>A density value is not a probability.</b> A PDF (Probability Density Function) can exceed 1; only its integral over an interval is a probability. Don't read a density off as a chance.</li>
       <li><b>Forgetting variables depend on the same draw.</b> $X$ and $Y$ from one experiment can be coupled. Computing them as if independent loses that link.</li>
       <li><b>Encoding categories as numbers carelessly.</b> Mapping "red, green, blue" to 1, 2, 3 invents a fake ordering. Use indicator variables unless the category is truly ordinal.</li>
       <li><b>Ignoring the support.</b> A count can't be negative; a probability lives in $[0,1]$. A model that predicts outside the variable's range is misspecified.</li>
     </ul>`,
  quiz: {
    q: `Roll a fair die, $X$ = the face shown. What is $p_X(3)$, and do all six values' probabilities add to 1?`,
    a: `<p>$p_X(3) = \\frac{1}{6}$. Each of the six faces has probability $\\frac{1}{6}$, and $6 \\times \\frac{1}{6} = 1$. ✔</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-expectation",
  demo: function (host) {
    Demos.bars(host, {
      controls: [],
      pmf: function () {
        var o = [];
        for (var f = 1; f <= 6; f++) o.push({ k: f, p: 1 / 6 });
        return o;
      },
      readout: function (s, bars) {
        var ex = 0; bars.forEach(function (b) { ex += b.k * b.p; });
        return "Fair die. E[X] = Σ k·p(k) = (1+2+3+4+5+6)/6 = <b>" + ex.toFixed(2) +
          "</b>. The mean 3.5 is never an actual face — it is the long-run average.";
      }
    });
  },
  title: "Expectation (the mean)",
  tagline: "The long-run average value. Weight each outcome by its chance, then add.",
  prereqs: ["prob-random-variable"],
  bigIdea:
    `<p>The <b>expectation</b> is the average value you'd get if you repeated the experiment forever.</p>
     <p>It is a weighted average: each value counts in proportion to how likely it is.</p>
     <p>It is the single number that best summarizes 'what to expect'.</p>
     <p>Almost every model is trained to make its expected error small.</p>`,
  buildup:
    `<p>A plain average treats every value equally. But some values are more likely than others.</p>
     <p>So weight each value by its probability before adding.</p>
     <p>Rare big values count less; common values count more. That weighted sum is the expectation.</p>`,
  symbols: [
    { sym: "$E[X]$", desc: "the expectation (mean) of $X$. 'E' for Expected value." },
    { sym: "$\\mu$", desc: "another name for the mean (Greek 'mu'). $\\mu = E[X]$." },
    { sym: "$x$", desc: "a value $X$ can take." },
    { sym: "$p_X(x)$", desc: "the probability that $X$ equals $x$ (the PMF)." },
    { sym: "$aX + b$", desc: "a rescaled variable: multiply $X$ by a constant $a$ and add a constant $b$." }
  ],
  formula: `$$ E[X] = \\sum_x x\\, p_X(x) \\qquad E[aX + b] = a\\,E[X] + b $$
$$ E[g(X)] = \\sum_x g(x)\\,p(x) \\quad\\text{(discrete)}, \\qquad E[g(X)] = \\int_{-\\infty}^{\\infty} g(x)\\,f(x)\\,dx \\quad\\text{(continuous)} $$`,
  whatItDoes:
    `<p>For each value $x$: multiply it by its chance $p_X(x)$, then add up all those products.</p>
     <p>The second formula (linearity) says: scaling and shifting $X$ scales and shifts its mean the same way. Very handy.</p>
     <p><b>Law of the Unconscious Statistician (LOTUS):</b> you can take the expectation of a FUNCTION of $X$ by weighting $g(x)$ by the distribution of $X$ — you do NOT need the distribution of $g(X)$ itself (that is why it is the "unconscious statistician").</p>
     <p>The <b>$k$-th moment</b> is $E[X^k]$: so $k = 1$ is the mean, and the variance uses the 2nd moment.</p>`,
  example:
    `<p>A game: roll a fair die, win that many dollars. What's your expected winning? Each face has probability $\\frac{1}{6}$, so weight each value by $\\frac{1}{6}$ and add.</p>
     <table class="extable">
       <caption>$E[X] = \\sum_x x\\,p_X(x)$ — the value × probability ledger</caption>
       <thead><tr><th class="num">$x$</th><th class="num">$p_X(x)$</th><th class="num">$x\\,p_X(x)$</th></tr></thead>
       <tbody>
         <tr><td class="num">1</td><td class="num">$\\frac{1}{6}$</td><td class="num">$0.1\\overline{6}$</td></tr>
         <tr><td class="num">2</td><td class="num">$\\frac{1}{6}$</td><td class="num">$0.3\\overline{3}$</td></tr>
         <tr><td class="num">3</td><td class="num">$\\frac{1}{6}$</td><td class="num">$0.5$</td></tr>
         <tr><td class="num">4</td><td class="num">$\\frac{1}{6}$</td><td class="num">$0.6\\overline{6}$</td></tr>
         <tr><td class="num">5</td><td class="num">$\\frac{1}{6}$</td><td class="num">$0.8\\overline{3}$</td></tr>
         <tr><td class="num">6</td><td class="num">$\\frac{1}{6}$</td><td class="num">$1.0$</td></tr>
         <tr><td class="row-h">sum</td><td class="num">$1.0$</td><td class="num">$3.5$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>$E[X] = 1\\cdot\\frac{1}{6} + 2\\cdot\\frac{1}{6} + 3\\cdot\\frac{1}{6} + 4\\cdot\\frac{1}{6} + 5\\cdot\\frac{1}{6} + 6\\cdot\\frac{1}{6}$.</li>
       <li>$= \\frac{1+2+3+4+5+6}{6} = \\frac{21}{6} = 3.5$.</li>
       <li>So on average you win \\$3.50 per roll — even though 3.5 is never an actual roll.</li>
       <li>Linearity: if the prize doubles and adds \\$1, $E[2X+1] = 2 \\times 3.5 + 1 = \\$8$.</li>
     </ul>`,
  application:
    `<p>'Expected loss' is the quantity nearly every ML (Machine Learning) model minimizes during training. Expected value also drives decision-making: an A/B test picks the option with the higher expected payoff.</p>`,
  whenToUse:
    `<p><b>You reach for expectation whenever you need one number to summarize an uncertain quantity's long-run average</b> — expected loss to train a model, expected reward to choose an action, expected value to compare two bets. It is the target that almost all of supervised learning minimizes.</p>
     <p><b>Use the expectation over:</b></p>
     <ul>
       <li><b>A single sampled outcome</b> — when you want the stable long-run value rather than one noisy draw.</li>
       <li><b>The most likely value (the mode)</b> — when every outcome's magnitude matters, not just the peak; expectation weights by both value and probability.</li>
     </ul>
     <p><b>Prefer a different summary when:</b></p>
     <ul>
       <li>The distribution is heavy-tailed or has outliers — the mean is dragged around, so the median is more robust.</li>
       <li>You care about risk or worst cases, not the average — use a quantile, VaR (Value at Risk), or the variance instead.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The mean can be a value that never occurs.</b> The expected roll of a die is 3.5. Don't interpret an expectation as a typical single outcome.</li>
       <li><b>Outliers wreck the mean.</b> A few extreme values pull the average far from the bulk of the data. Inspect the distribution; consider the median for skewed data.</li>
       <li><b>Undefined expectation.</b> Heavy-tailed distributions (e.g. Cauchy) have no finite mean — averaging more samples does not converge. Check the tail before trusting an average.</li>
       <li><b>Estimating from too few samples.</b> A sample mean from n &lt; 30 noisy points can be far from the true expectation. Report a confidence interval alongside it.</li>
       <li><b>Linearity is your friend — non-linearity isn't.</b> $E[X+Y]=E[X]+E[Y]$ always holds, but $E[g(X)]\\ne g(E[X])$ for non-linear $g$ (Jensen's inequality). Don't push a function through the mean.</li>
       <li><b>Mismatched weights.</b> An expectation over the wrong distribution (training vs deployment) gives a biased estimate of real-world performance.</li>
     </ul>`,
  quiz: {
    q: `A coin pays \\$10 for heads, \\$0 for tails, each with chance $\\frac{1}{2}$. What is $E[X]$?`,
    a: `<p>$E[X] = 10 \\times \\frac{1}{2} + 0 \\times \\frac{1}{2} = 5$. The expected payout is \\$5.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-variance",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "p", label: "p — chance of the value 2 (else 0)", min: 0, max: 1, val: 0.5, step: 0.01 }
      ],
      bars: true, barsHeight: 110,
      compute: function (s) {
        var ex = 2 * s.p;
        var ex2 = 4 * s.p;
        var varx = ex2 - ex * ex;
        var sd = Math.sqrt(varx);
        return { text: "Two-point variable: 2 with prob p, 0 otherwise. E[X] = 2p = " + ex.toFixed(2) +
          ", E[X²] = 4p = " + ex2.toFixed(2) + ". Var = E[X²] − (E[X])² = <b>" + varx.toFixed(3) +
          "</b>, σ = √Var = " + sd.toFixed(3) + ". Spread is largest at p = 0.5.",
          bars: [
            { label: "E[X]", val: ex, color: "#4ea1ff" },
            { label: "Var(X)", val: varx, color: "#7ee787" }
          ], max: 2 };
      }
    });
  },
  title: "Variance & standard deviation",
  tagline: "The mean tells you the center. Variance tells you the spread.",
  prereqs: ["prob-expectation"],
  bigIdea:
    `<p>Two things can have the same average but feel totally different.</p>
     <p>One is steady; the other swings wildly. The <b>variance</b> measures that swing.</p>
     <p>It is the expected squared distance from the mean.</p>
     <p>The <b>standard deviation</b> is its square root — spread in the original units.</p>`,
  buildup:
    `<p>You know the mean $\\mu$ is the center.</p>
     <p>For each value, measure how far it is from $\\mu$. Square that distance (so big gaps count extra and signs don't cancel).</p>
     <p>Average those squared distances. That average is the variance.</p>`,
  symbols: [
    { sym: "$\\mu$", desc: "the mean of $X$, i.e. $E[X]$ (Greek 'mu')." },
    { sym: "$\\operatorname{Var}(X)$", desc: "the variance of $X$: the average squared distance from the mean." },
    { sym: "$(X - \\mu)^2$", desc: "the squared distance of $X$ from its mean." },
    { sym: "$E[X^2]$", desc: "the mean of $X$ squared (square first, then average)." },
    { sym: "$\\sigma$", desc: "the standard deviation (Greek 'sigma'): the square root of the variance." },
    { sym: "$\\sqrt{\\;}$", desc: "the square root: undoes the squaring, putting spread back in original units." }
  ],
  formula: `$$ \\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2 \\qquad \\sigma = \\sqrt{\\operatorname{Var}(X)} $$`,
  whatItDoes:
    `<p>The first form: average the squared distances from the mean.</p>
     <p>The second form is a shortcut: 'mean of the square' minus 'square of the mean'. It gives the same answer with less work.</p>
     <p>Take the square root to get $\\sigma$, the spread measured in the same units as $X$.</p>
     <p><b>Variance and standard deviation carry the same information — the only difference is units.</b> Squaring the distances also squares the units. If $X$ is in dollars, the variance comes out in <i>dollars squared</i> — which is not a real-world thing (1 <i>what</i>?). The square root undoes that, so $\\sigma$ is back in plain dollars: a typical distance from the mean.</p>
     <p>So use <b>variance</b> when you are doing the math — it behaves nicely in formulas (variances of independent things simply add). Report <b>standard deviation</b> to a human, because it is a real, feelable distance in the data's own units. The notation even says it: variance is $\\sigma^2$, standard deviation is $\\sigma$ — one is literally the square of the other.</p>`,
  example:
    `<p>Let $X$ be a fair coin worth \\$0 (tails) or \\$2 (heads), each chance $\\frac{1}{2}$.</p>
     <table class="extable">
       <caption>Ledger for $E[X]$ and $E[X^2]$</caption>
       <thead><tr><th class="num">$x$</th><th class="num">$p(x)$</th><th class="num">$x\\,p(x)$</th><th class="num">$x^2\\,p(x)$</th></tr></thead>
       <tbody>
         <tr><td class="num">0</td><td class="num">0.5</td><td class="num">0</td><td class="num">0</td></tr>
         <tr><td class="num">2</td><td class="num">0.5</td><td class="num">1</td><td class="num">2</td></tr>
         <tr><td class="row-h">sum</td><td class="num">1.0</td><td class="num">$E[X]=1$</td><td class="num">$E[X^2]=2$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Mean: $E[X] = 0 \\times \\frac{1}{2} + 2 \\times \\frac{1}{2} = 1$. So $\\mu = 1$.</li>
       <li>$E[X^2] = 0^2 \\times \\frac{1}{2} + 2^2 \\times \\frac{1}{2} = 0 + 2 = 2$.</li>
       <li>$\\operatorname{Var}(X) = E[X^2] - (E[X])^2 = 2 - 1^2 = 2 - 1 = 1$.</li>
       <li>Standard deviation: $\\sigma = \\sqrt{1} = 1$. Values sit about \\$1 away from the \\$1 mean — which matches \\$0 and \\$2.</li>
     </ul>`,
  application:
    `<p>In finance, variance is risk. In ML (Machine Learning), high variance in a model's predictions signals overfitting. The bias-variance tradeoff — a central idea in machine learning — is named after this exact quantity.</p>`,
  whenToUse:
    `<p><b>You reach for variance (and its square root, standard deviation) whenever the spread of a quantity matters, not just its average</b> — to quantify risk, to detect overfitting, to set error bars, or to standardize features before training. It is the second half of the story the mean alone can't tell.</p>
     <p><b>Use variance over:</b></p>
     <ul>
       <li><b>Reporting only the mean</b> — when two options share an average but differ in risk; variance separates a steady bet from a volatile one.</li>
       <li><b>The range (max minus min)</b> — when you want a measure that uses all the data and isn't dictated by a single extreme point.</li>
     </ul>
     <p><b>Prefer a different measure when:</b></p>
     <ul>
       <li>The data has heavy tails or outliers — variance is inflated by squared deviations; use the IQR (Interquartile Range) or MAD (Median Absolute Deviation).</li>
       <li>You need spread on the original scale and units — report the standard deviation, not the variance (whose units are squared).</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Variance is in squared units.</b> A variance of 9 "dollars-squared" is hard to read. Take the square root for a standard deviation in dollars before interpreting.</li>
       <li><b>Outliers dominate.</b> Squaring deviations gives extreme points outsized weight, so one bad measurement can blow up the variance. Inspect for outliers first.</li>
       <li><b>Population vs sample formula.</b> Dividing by $n$ underestimates the true variance; the unbiased sample estimator divides by $n-1$. Use the right denominator.</li>
       <li><b>Naive one-pass formulas lose precision.</b> Computing $E[X^2]-E[X]^2$ can subtract two large near-equal numbers and produce catastrophic cancellation. Use Welford's algorithm for streaming data.</li>
       <li><b>Zero variance breaks downstream math.</b> A constant feature has variance 0, so standardizing it divides by zero. Detect and drop constant columns.</li>
       <li><b>Variance is not the whole shape.</b> Two distributions with equal variance can be wildly different (skewed vs symmetric). Don't assume Normality from spread alone.</li>
     </ul>`,
  quiz: {
    q: `A variable is always exactly 7 (no randomness). What is its variance?`,
    a: `<p>0. It never moves away from its mean of 7, so the average squared distance is 0. No spread.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-bernoulli-binomial",
  demo: function (host) {
    Demos.bars(host, {
      controls: [{ key: "n", label: "n (number of trials)", min: 1, max: 20, val: 10, step: 1 }, { key: "p", label: "p (success chance)", min: 0, max: 1, val: 0.5, step: 0.05 }],
      pmf: function (s) { var n = Math.round(s.n), o = []; for (var k = 0; k <= n; k++) o.push({ k: k, p: Demos._comb(n, k) * Math.pow(s.p, k) * Math.pow(1 - s.p, n - k) }); return o; },
      readout: function (s) { var n = Math.round(s.n); return "Binomial(n = " + n + ", p = " + s.p.toFixed(2) + "). Mean np = <b>" + (n * s.p).toFixed(2) + "</b>, variance np(1−p) = <b>" + (n * s.p * (1 - s.p)).toFixed(2) + "</b>."; }
    });
  },
  title: "Bernoulli & Binomial",
  tagline: "One yes/no trial, then many of them. The building blocks of counting successes.",
  prereqs: ["prob-expectation", "prob-counting", "prob-random-variable"],
  bigIdea:
    `<p>A <b>Bernoulli</b> trial is a single yes/no event: success or failure.</p>
     <p>One coin flip. One ad shown: clicked or not.</p>
     <p>A <b>Binomial</b> is many independent Bernoulli trials added up.</p>
     <p>It answers: 'out of $n$ tries, how many successes?'</p>`,
  buildup:
    `<p>Call success probability $p$. A Bernoulli variable is 1 with chance $p$, and 0 with chance $1-p$.</p>
     <p>Now do $n$ of these independently and count the successes.</p>
     <p>To land exactly $k$ successes you need $k$ wins and $n-k$ losses, and there are $\\binom{n}{k}$ ways to arrange which trials won.</p>`,
  symbols: [
    { sym: "$p$", desc: "the probability of success on one trial (between 0 and 1)." },
    { sym: "$1 - p$", desc: "the probability of failure on one trial." },
    { sym: "$n$", desc: "the number of trials." },
    { sym: "$k$", desc: "the number of successes we ask about." },
    { sym: "$\\binom{n}{k}$", desc: "'n choose k': the number of ways to pick which $k$ of the $n$ trials succeeded." },
    { sym: "$p^k$", desc: "$p$ multiplied by itself $k$ times: the chance of $k$ specific successes." }
  ],
  formula: `$$ \\text{Bernoulli: } E[X] = p,\\;\\; \\operatorname{Var}(X) = p(1-p) \\qquad \\text{Binomial: } P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k},\\;\\; E[X] = np $$`,
  whatItDoes:
    `<p>For the Binomial: $p^k (1-p)^{n-k}$ is the chance of one specific pattern with $k$ wins, and $\\binom{n}{k}$ counts all the patterns with exactly $k$ wins.</p>
     <p>Multiply them to get the total chance of exactly $k$ successes.</p>
     <p>The mean $np$ is intuitive: $n$ trials each contributing $p$ on average.</p>
     <p><b>Why the Bernoulli variance is $p(1-p)$.</b> A Bernoulli $X$ is only ever 0 or 1. And $0^2 = 0$, $1^2 = 1$ — so squaring does nothing: $X^2 = X$. That means $E[X^2] = E[X] = p$. Now use the variance formula $\\operatorname{Var}(X) = E[X^2] - (E[X])^2$:</p>
     <div class="formula-box">$$ \\operatorname{Var}(X) = E[X^2] - (E[X])^2 = p - p^2 = p(1-p) $$</div>
     <p>Read $p(1-p)$ as (chance of success) × (chance of failure). It is <b>largest at $p = 0.5$</b> ($0.5 \\times 0.5 = 0.25$, a fair coin — most unpredictable) and <b>zero at $p = 0$ or $p = 1$</b> (the result never changes, so there is no spread). For the Binomial of $n$ such trials, the variances add: $\\operatorname{Var} = np(1-p)$.</p>`,
  example:
    `<p>Flip a fair coin ($p = 0.5$) $n = 3$ times. What's the chance of exactly $k = 2$ heads? Use $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$.</p>
     <table class="extable">
       <caption>Full Binomial PMF for $n=3$, $p=0.5$</caption>
       <thead><tr><th class="num">$k$</th><th class="num">$\\binom{3}{k}$</th><th class="num">$p^k(1-p)^{3-k}$</th><th class="num">$P(X=k)$</th></tr></thead>
       <tbody>
         <tr><td class="num">0</td><td class="num">1</td><td class="num">0.125</td><td class="num">0.125</td></tr>
         <tr><td class="num">1</td><td class="num">3</td><td class="num">0.125</td><td class="num">0.375</td></tr>
         <tr><td class="num">2</td><td class="num">3</td><td class="num">0.125</td><td class="num">0.375</td></tr>
         <tr><td class="num">3</td><td class="num">1</td><td class="num">0.125</td><td class="num">0.125</td></tr>
         <tr><td class="row-h">sum</td><td class="num"></td><td class="num"></td><td class="num">1.0</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Count the patterns for $k=2$: $\\binom{3}{2} = 3$ ways (HHT, HTH, THH).</li>
       <li>Each pattern's chance: $p^2 (1-p)^1 = 0.5^2 \\times 0.5^1 = 0.25 \\times 0.5 = 0.125$.</li>
       <li>Multiply: $P(X=2) = 3 \\times 0.125 = 0.375$, i.e. 37.5%.</li>
       <li>Mean number of heads: $np = 3 \\times 0.5 = 1.5$.</li>
       <li>Variance: $np(1-p) = 3 \\times 0.5 \\times 0.5 = 0.75$, so spread $\\sigma = \\sqrt{0.75} \\approx 0.87$ heads.<div class="why">$p = 0.5$ is the most unpredictable coin. Bias it to $p = 0.9$ and the variance drops to $3 \\times 0.9 \\times 0.1 = 0.27$ — a near-certain coin barely varies.</div></li>
     </ul>`,
  application:
    `<p>Click-through rates, conversion counts, and A/B test outcomes are all Binomial: $n$ visitors, each clicking with probability $p$. Logistic regression models the Bernoulli success probability $p$ for each example.</p>`,
  whenToUse:
    `<p><b>Reach for Bernoulli and Binomial whenever you count successes out of a fixed number of independent yes/no trials with the same success probability</b> — clicks out of impressions, conversions out of visitors, defects out of units. Bernoulli is a single trial; Binomial is the count over $n$ of them.</p>
     <p><b>Choose this model over:</b></p>
     <ul>
       <li><b>A continuous distribution</b> — when the outcome is a count of successes, not a measured magnitude.</li>
       <li><b>A Poisson</b> — when the number of trials $n$ is fixed and known; Poisson is the limit when $n$ is huge and $p$ tiny with no fixed ceiling.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>Trials aren't independent or $p$ varies between them — use a Beta-Binomial or a regression with covariates instead.</li>
       <li>You want to predict $p$ per example from features — that is logistic regression (the Bernoulli likelihood with a learned $p$).</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Trials must be independent with constant $p$.</b> Correlated users or a drifting click rate violate the Binomial. The variance is then larger than $np(1-p)$ (over-dispersion).</li>
       <li><b>Small samples give noisy rate estimates.</b> 1 click in 5 visits is not a 20% rate with any confidence. Use a confidence interval (Wilson, not the naive normal) for small n.</li>
       <li><b>Zero successes don't mean zero probability.</b> 0/200 conversions still has an upper-bound rate well above zero. Apply smoothing or a Bayesian (Beta) prior.</li>
       <li><b>The Normal approximation fails at the extremes.</b> When $np$ or $n(1-p)$ is small (rare events), the symmetric Normal interval is wrong — use exact or Poisson methods.</li>
       <li><b>Confusing the count with the rate.</b> The Binomial models the number of successes; divide by $n$ only when you want the proportion, and track that $n$ for uncertainty.</li>
       <li><b>Peeking inflates false positives.</b> Repeatedly checking an A/B test's running conversion count and stopping early breaks the fixed-$n$ assumption.</li>
     </ul>`,
  quiz: {
    q: `An archer hits the target with probability $0.8$ on each shot. In 5 shots, what is the expected number of hits?`,
    a: `<p>$E[X] = np = 5 \\times 0.8 = 4$ hits on average.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-geometric-poisson",
  demo: function (host) {
    Demos.bars(host, {
      controls: [{ key: "lam", label: "λ (average events)", min: 1, max: 10, val: 3, step: 0.5 }],
      pmf: function (s) {
        var o = [], lam = s.lam;
        for (var k = 0; k <= 15; k++) {
          o.push({ k: k, p: Math.pow(lam, k) * Math.exp(-lam) / Demos._fact(k) });
        }
        return o;
      },
      readout: function (s) {
        return "Poisson(λ = " + s.lam.toFixed(1) + "). p(k) = λᵏ·e^(−λ)/k!, k = 0..15. For a Poisson, mean = variance = λ = <b>" + s.lam.toFixed(1) + "</b>.";
      }
    });
  },
  title: "Geometric & Poisson",
  tagline: "How long until the first success? And how many rare events in a window?",
  prereqs: ["prob-bernoulli-binomial"],
  bigIdea:
    `<p>The <b>Geometric</b> distribution counts trials until the first success.</p>
     <p>'How many times must I roll before I get a six?'</p>
     <p>The <b>Poisson</b> distribution counts rare events in a fixed window.</p>
     <p>'How many emails will arrive this hour?'</p>`,
  buildup:
    `<p>For Geometric: to get the first success on trial $k$, you must fail $k-1$ times, then succeed once. Failures multiply, then one success.</p>
     <p>For Poisson: imagine many tiny independent chances over a window, with $\\lambda$ events expected on average. The formula below pops out.</p>`,
  symbols: [
    { sym: "$p$", desc: "the success probability on each trial (Geometric)." },
    { sym: "$k$", desc: "the trial number of the first success (Geometric), or the count of events (Poisson)." },
    { sym: "$\\lambda$", desc: "the average number of events expected in the window (Poisson). Greek 'lambda'." },
    { sym: "$e$", desc: "Euler's number, about $2.718$. A fixed constant that shows up in growth and decay." },
    { sym: "$k!$", desc: "'k factorial': $k \\times (k-1) \\times \\dots \\times 1$." }
  ],
  formula: `$$ \\text{Geometric: } P(X = k) = (1-p)^{k-1} p,\\;\\; E[X] = \\frac{1}{p} \\qquad \\text{Poisson: } P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!},\\;\\; E[X] = \\lambda $$`,
  whatItDoes:
    `<p>Geometric: $(1-p)^{k-1}$ is the chance of failing the first $k-1$ times, and $p$ is the success on trial $k$. Mean $\\frac{1}{p}$: rarer success means longer wait.</p>
     <p>Poisson: with average rate $\\lambda$, this gives the chance of seeing exactly $k$ events. Its mean is simply $\\lambda$.</p>`,
  example:
    `<p>(a) Roll a die until the first six ($p = \\frac{1}{6}$). Chance the first six comes on roll 3? (b) A call center gets $\\lambda = 2$ calls per minute. Chance of exactly 0 calls in a minute?</p>
     <table class="extable">
       <caption>Two count distributions side by side</caption>
       <thead><tr><th>distribution</th><th>formula used</th><th class="num">plug-in</th><th class="num">result</th></tr></thead>
       <tbody>
         <tr><td class="row-h">Geometric $P(X=3)$</td><td>$(1-p)^{k-1}p$</td><td class="num">$(\\frac{5}{6})^2\\frac{1}{6}$</td><td class="num">$\\approx 0.116$</td></tr>
         <tr><td class="row-h">Geometric mean</td><td>$\\frac{1}{p}$</td><td class="num">$\\frac{1}{1/6}$</td><td class="num">6 rolls</td></tr>
         <tr><td class="row-h">Poisson $P(X=0)$</td><td>$\\frac{\\lambda^k e^{-\\lambda}}{k!}$</td><td class="num">$e^{-2}$</td><td class="num">$\\approx 0.135$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Geometric: $P(X=3) = (1-\\frac{1}{6})^{2} \\times \\frac{1}{6} = (\\frac{5}{6})^2 \\times \\frac{1}{6} = \\frac{25}{36} \\times \\frac{1}{6} \\approx 0.116$.</li>
       <li>Expected wait for a six: $\\frac{1}{p} = \\frac{1}{1/6} = 6$ rolls.</li>
       <li>Poisson: $P(X=0) = \\frac{\\lambda^0 e^{-\\lambda}}{0!} = \\frac{1 \\times e^{-2}}{1} = e^{-2} \\approx 0.135$.</li>
       <li>So about a 13.5% chance of a quiet minute with no calls.</li>
     </ul>`,
  application:
    `<p>Poisson models website hits, server requests, and rare defects. Geometric models 'tries until conversion'. Both appear in queueing systems and in modeling counts of rare events in data.</p>`,
  whenToUse:
    `<p><b>Reach for Poisson when you count how many rare events land in a fixed window</b> (requests per second, defects per batch), and for Geometric when you count how many trials until the first success (visits until a conversion). Both model "rare events over a fixed exposure" from opposite angles.</p>
     <p><b>Choose Poisson over:</b></p>
     <ul>
       <li><b>A Binomial</b> — when the number of opportunities is huge or unknown and the per-event chance is tiny; Poisson needs only the rate $\\lambda$.</li>
       <li><b>A Normal for counts</b> — when counts are small (near zero), where the Normal would put mass on impossible negatives.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The variance far exceeds the mean (over-dispersion) — use a Negative Binomial instead of Poisson.</li>
       <li>Events cluster in bursts rather than arriving independently — Poisson's constant-rate assumption breaks; model the bursts explicitly.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Poisson assumes mean equals variance.</b> Real count data is usually over-dispersed (variance &gt; mean). Check the ratio; if it's far above 1, switch to Negative Binomial.</li>
       <li><b>The rate must be constant over the window.</b> Traffic spikes at peak hours violate a single $\\lambda$. Segment by time or use a time-varying rate.</li>
       <li><b>Events must be independent.</b> One failure triggering a cascade breaks Poisson — arrivals that clump are not Poisson-distributed.</li>
       <li><b>Geometric's memorylessness surprises people.</b> Past failures don't make the next success "due"; the probability resets every trial.</li>
       <li><b>Off-by-one in the Geometric definition.</b> Some texts count trials <i>until</i> success, others count failures <i>before</i> it. Confirm which convention your library uses.</li>
       <li><b>Zero-inflation.</b> If far more zeros appear than Poisson predicts (many windows with no events at all), use a zero-inflated model.</li>
     </ul>`,
  quiz: {
    q: `A Poisson process averages $\\lambda = 3$ events per hour. What is the expected number of events in an hour?`,
    a: `<p>For a Poisson distribution, $E[X] = \\lambda = 3$ events.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-pdf-cdf",
  title: "Continuous variables: PDF & CDF",
  tagline: "When outcomes are smooth (like height), probability becomes area under a curve.",
  prereqs: ["prob-random-variable", "fnd-derivative"],
  bigIdea:
    `<p>Some quantities are continuous: height, weight, time. They can be any value in a range.</p>
     <p>There are infinitely many exact values, so any single one has probability 0.</p>
     <p>Instead, probability becomes <b>area under a curve</b> over a range.</p>
     <p>The curve is the PDF (Probability Density Function); the running total of area is the CDF (Cumulative Distribution Function).</p>`,
  buildup:
    `<p>For discrete variables, the PMF (Probability Mass Function) gave the chance of each exact value.</p>
     <p>For continuous variables, we use a <b>density</b> curve $f_X$ instead. Height of the curve is not probability — area is.</p>
     <p>'Area under a curve' is computed by an integral, written $\\int$. Total area must be 1.</p>`,
  symbols: [
    { sym: "$f_X(x)$", desc: "the PDF (probability density function): the height of the curve at value $x$." },
    { sym: "$\\int$", desc: "an integral: it adds up area under a curve (the smooth version of a sum $\\sum$)." },
    { sym: "$F_X(x)$", desc: "the CDF (cumulative distribution function): total probability up to and including $x$." },
    { sym: "$P(X \\le x)$", desc: "the probability that $X$ is at most $x$." },
    { sym: "$-\\infty$", desc: "'negative infinity': start counting area from the far left, before any value." }
  ],
  formula: `$$ \\int_{-\\infty}^{\\infty} f_X(x)\\, dx = 1 \\qquad F_X(x) = P(X \\le x) = \\int_{-\\infty}^{x} f_X(t)\\, dt $$`,
  whatItDoes:
    `<p>The first equation: the total area under the whole density curve is exactly 1 (probabilities must sum to 1).</p>
     <p>The CDF $F_X(x)$ accumulates area from the far left up to $x$. So it climbs from 0 to 1 as $x$ increases.</p>
     <p>The chance $X$ lands between $a$ and $b$ is the area in that slice, $F_X(b) - F_X(a)$.</p>`,
  example:
    `<p>Let $X$ be uniform on $[0, 2]$: the density is a flat line at height $\\frac{1}{2}$ over that range. The CDF accumulates area, so $F_X(x) = \\frac{x}{2}$ for $x$ in $[0,2]$.</p>
     <table class="extable">
       <caption>CDF $F_X(x) = P(X \\le x) =$ area to the left $= \\frac{x}{2}$</caption>
       <thead><tr><th class="num">$x$</th><th class="num">area $=$ width $\\times \\frac{1}{2}$</th><th class="num">$F_X(x)$</th></tr></thead>
       <tbody>
         <tr><td class="num">0</td><td class="num">$0 \\times \\frac{1}{2}$</td><td class="num">0.0</td></tr>
         <tr><td class="num">1</td><td class="num">$1 \\times \\frac{1}{2}$</td><td class="num">0.5</td></tr>
         <tr><td class="num">2</td><td class="num">$2 \\times \\frac{1}{2}$</td><td class="num">1.0</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Total area: width $\\times$ height $= 2 \\times \\frac{1}{2} = 1$. ✔ It's a valid PDF.</li>
       <li>Chance $X \\le 1$: area from 0 to 1 is $1 \\times \\frac{1}{2} = \\frac{1}{2}$. So $F_X(1) = 0.5$.</li>
       <li>Chance $X$ between 0.5 and 1.5: $F_X(1.5) - F_X(0.5) = 0.75 - 0.25 = \\frac{1}{2}$.</li>
       <li>Chance $X$ equals exactly 1: a line has zero width, so the area — and the probability — is 0.</li>
     </ul>`,
  application:
    `<p>Continuous densities model sensor readings, prices, and neural-network outputs. When a model reports 'the probability the value is below this threshold', it is reading off a CDF.</p>`,
  whenToUse:
    `<p><b>You reach for the PDF (Probability Density Function) and CDF (Cumulative Distribution Function) whenever the outcome lives on a continuum</b> — a price, a delay, a sensor reading. The PDF describes relative likelihood across the range; the CDF answers "what is the probability of being below this threshold?"</p>
     <p><b>Use these over:</b></p>
     <ul>
       <li><b>A discrete PMF</b> — when values are real numbers with no natural minimum gap; a density, not a mass at each point, is the right object.</li>
       <li><b>Just a mean and variance</b> — when you need tail probabilities, quantiles, or thresholds, which require the full CDF.</li>
     </ul>
     <p><b>Reach for the CDF specifically when:</b> you need percentiles, p-values, or threshold probabilities; reach for the inverse CDF (the quantile function) to <i>generate</i> samples or set a confidence cutoff.</p>`,
  pitfalls:
    `<ul>
       <li><b>A PDF value is not a probability.</b> A density can exceed 1; only the area under it over an interval is a probability. $P(X=x)=0$ for any single point.</li>
       <li><b>Probability of an exact value is zero.</b> Ask for $P(a\\le X\\le b)$, never $P(X=3.7)$. Continuous variables only assign probability to ranges.</li>
       <li><b>The density must integrate to 1.</b> A hand-built or learned density that doesn't normalize is invalid — divide by the normalizing constant.</li>
       <li><b>Change of variables needs the Jacobian.</b> Transforming $X$ to $g(X)$ rescales the density by $|dg/dx|$; forgetting it gives a density that no longer integrates to 1.</li>
       <li><b>Reading the CDF backwards.</b> The CDF is $P(X\\le x)$, non-decreasing from 0 to 1. For the upper tail use the survival function $1-\\text{CDF}$.</li>
       <li><b>Binning continuous data hides structure.</b> A coarse histogram can erase modes or skew; choose bin width carefully or use a kernel density estimate.</li>
     </ul>`,
  demo: function (host) {
    host.innerHTML = '';
    var lab = document.createElement('label');
    lab.innerHTML = 'Drag the cutoff <b>x</b>. Watch the shaded area under the PDF (top) equal the height of the CDF (bottom).';
    var slider = document.createElement('input');
    slider.type = 'range'; slider.min = '-40'; slider.max = '40'; slider.value = '0'; slider.step = '1';
    var out = document.createElement('div'); out.className = 'out';
    var cv = document.createElement('canvas'); cv.width = 640; cv.height = 420;
    host.appendChild(lab); host.appendChild(slider); host.appendChild(out); host.appendChild(cv);
    var ctx = cv.getContext('2d');
    // Standard normal data over [-4, 4]
    var N = 321, lo = -4, hi = 4, dx = (hi - lo) / (N - 1);
    var xs = [], pdf = [], cdf = [], c = 1 / Math.sqrt(2 * Math.PI), acc = 0, pmax = c;
    for (var i = 0; i < N; i++) {
      var x = lo + i * dx, p = c * Math.exp(-x * x / 2);
      xs.push(x); pdf.push(p); acc += p * dx; cdf.push(acc);
    }
    var tot = cdf[N - 1];
    for (var j = 0; j < N; j++) cdf[j] /= tot;          // normalize so total area = 1
    var L = 48, R = 624, padTop = 26, Atop = 32, Abot = 190, Btop = 248, Bbot = 398;
    function px(v) { return L + (v - lo) / (hi - lo) * (R - L); }
    function pyA(v) { return Abot - (v / pmax) * (Abot - Atop); }
    function pyB(v) { return Bbot - v * (Bbot - Btop); }
    function draw() {
      var cs = getComputedStyle(document.documentElement);
      var ink = (cs.getPropertyValue('--ink') || '#e6edf3').trim();
      var dim = (cs.getPropertyValue('--ink-dim') || '#9aa7b4').trim();
      var a1 = (cs.getPropertyValue('--accent') || '#4ea1ff').trim();
      var a2 = (cs.getPropertyValue('--accent-2') || '#7ee787').trim();
      var bd = (cs.getPropertyValue('--border') || '#2a3340').trim();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textBaseline = 'alphabetic';
      var xv = parseFloat(slider.value) / 10;
      var idx = Math.round((xv - lo) / dx); if (idx < 0) idx = 0; if (idx > N - 1) idx = N - 1;
      var area = cdf[idx];
      // --- PDF panel ---
      ctx.fillStyle = ink; ctx.fillText('PDF  f(x)   — height = density,  area = probability', L, padTop - 6);
      ctx.beginPath(); ctx.moveTo(px(lo), Abot);
      for (var a = 0; a <= idx; a++) ctx.lineTo(px(xs[a]), pyA(pdf[a]));
      ctx.lineTo(px(xs[idx]), Abot); ctx.closePath();
      ctx.fillStyle = a1 + '55'; ctx.fill();
      ctx.beginPath();
      for (var b = 0; b < N; b++) { var X = px(xs[b]), Y = pyA(pdf[b]); b ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.strokeStyle = a1; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(L, Abot); ctx.lineTo(R, Abot); ctx.strokeStyle = bd; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px(xv), Atop - 4); ctx.lineTo(px(xv), Bbot); ctx.strokeStyle = a2; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = a1; ctx.fillText('shaded area = ' + area.toFixed(3), L + 6, Atop + 14);
      // --- CDF panel ---
      ctx.fillStyle = ink; ctx.fillText('CDF  F(x) = P(X ≤ x)   — the running total of that area', L, Btop - 12);
      ctx.strokeStyle = bd; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L, Bbot); ctx.lineTo(R, Bbot); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(L, Btop); ctx.lineTo(R, Btop); ctx.stroke();
      ctx.fillStyle = dim; ctx.fillText('1', L - 16, Btop + 4); ctx.fillText('0', L - 16, Bbot + 4);
      ctx.beginPath();
      for (var d = 0; d < N; d++) { var X2 = px(xs[d]), Y2 = pyB(cdf[d]); d ? ctx.lineTo(X2, Y2) : ctx.moveTo(X2, Y2); }
      ctx.strokeStyle = a1; ctx.lineWidth = 2; ctx.stroke();
      var yb = pyB(area);
      ctx.strokeStyle = a2; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(L, yb); ctx.lineTo(px(xv), yb); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(px(xv), yb, 4.5, 0, 2 * Math.PI); ctx.fillStyle = a2; ctx.fill();
      ctx.fillStyle = a2; ctx.fillText('F(x) = ' + area.toFixed(3), px(xv) + 8, yb - 6);
      out.innerHTML = 'cutoff x = ' + xv.toFixed(1) + '  →  area under the PDF left of x = <b>' + area.toFixed(3) +
        '</b> = F(x) on the CDF. The CDF rises fastest where the bell is tallest — that is exactly "PDF = slope of CDF".';
    }
    slider.addEventListener('input', draw);
    draw();
  },
  quiz: {
    q: `For the uniform density on $[0,2]$ at height $\\frac{1}{2}$, what is the probability that $X$ is between 1 and 2?`,
    a: `<p>Area $=$ width $\\times$ height $= 1 \\times \\frac{1}{2} = \\frac{1}{2}$. A 50% chance.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-uniform-exponential",
  demo: function (host) {
    Demos.plot(host, {
      xmin: 0, xmax: 8, ymin: 0,
      controls: [
        { key: "shape", label: "shape: 0 = Uniform, 1 = Exponential", min: 0, max: 1, val: 0, step: 1 },
        { key: "b", label: "b (Uniform upper end, over [0, b])", min: 1, max: 8, val: 4, step: 0.5 },
        { key: "lam", label: "λ (Exponential rate)", min: 0.2, max: 3, val: 1, step: 0.1 }
      ],
      curves: [
        // Uniform(0, b): flat height 1/b on [0, b], else 0. Shown when shape rounds to 0.
        { f: function (x, s) { return Math.round(s.shape) === 0 ? (x >= 0 && x <= s.b ? 1 / s.b : 0) : 0; }, label: "Uniform 1/b", color: "#7ee787" },
        // Exponential(λ): λe^(−λx). Shown when shape rounds to 1.
        { f: function (x, s) { return Math.round(s.shape) === 1 ? s.lam * Math.exp(-s.lam * x) : 0; }, label: "Exp λe^(−λx)", color: "#4ea1ff" }
      ],
      readout: function (s) {
        if (Math.round(s.shape) === 0) {
          return "<b>Uniform(0, " + s.b.toFixed(1) + ")</b>: a flat density at height 1/b = <b>" + (1 / s.b).toFixed(3) +
            "</b> over [0, " + s.b.toFixed(1) + "]. Every value in range is equally likely. Mean = b/2 = <b>" +
            (s.b / 2).toFixed(2) + "</b>. Slide shape to 1 to compare the Exponential.";
        }
        return "<b>Exponential</b>, rate λ = " + s.lam.toFixed(1) + ". Density λe^(−λx) decays: short waits common, long waits rare. " +
          "Mean wait = 1/λ = <b>" + (1 / s.lam).toFixed(2) + "</b>. Slide shape to 0 to compare the flat Uniform.";
      }
    });
  },
  title: "Uniform & Exponential",
  tagline: "Perfectly flat odds, and the math of waiting times.",
  prereqs: ["prob-pdf-cdf"],
  bigIdea:
    `<p>The <b>Uniform</b> distribution is perfectly flat: every value in a range is equally likely.</p>
     <p>The <b>Exponential</b> distribution models waiting time until the next event.</p>
     <p>'How long until the next bus?' is exponential.</p>
     <p>It is <b>memoryless</b>: having waited already doesn't change how much longer you'll wait.</p>`,
  buildup:
    `<p>Uniform: if nothing favors any value, the density is a constant. Over $[a,b]$ that height must be $\\frac{1}{b-a}$ so the area is 1.</p>
     <p>Exponential: events happen at a steady rate $\\lambda$. The wait until the next one decays — short waits are common, long waits rare.</p>`,
  symbols: [
    { sym: "$a, b$", desc: "the low and high ends of the Uniform range." },
    { sym: "$f(x)$", desc: "the PDF: the height of the density curve at $x$." },
    { sym: "$\\frac{1}{b-a}$", desc: "the constant height of the Uniform density (1 over the width of the range)." },
    { sym: "$\\lambda$", desc: "the rate of the Exponential: events per unit time (Greek 'lambda')." },
    { sym: "$e^{-\\lambda x}$", desc: "a decaying curve: starts high and drops as $x$ grows. $e \\approx 2.718$." }
  ],
  formula: `$$ \\text{Uniform: } f(x) = \\frac{1}{b-a},\\;\\; E[X] = \\frac{a+b}{2} \\qquad \\text{Exponential: } f(x) = \\lambda e^{-\\lambda x},\\;\\; E[X] = \\frac{1}{\\lambda} $$`,
  whatItDoes:
    `<p>Uniform: a flat curve of height $\\frac{1}{b-a}$. Its mean $\\frac{a+b}{2}$ is just the midpoint of the range.</p>
     <p>Exponential: a curve that decays. Mean wait $\\frac{1}{\\lambda}$ — a faster rate $\\lambda$ means a shorter wait.</p>`,
  example:
    `<p>(a) A bus is equally likely to arrive any minute in $[0, 10]$. (b) Calls arrive at rate $\\lambda = \\frac{1}{5}$ per minute (one every 5 minutes on average).</p>
     <table class="extable">
       <caption>Two continuous distributions — both happen to have mean 5</caption>
       <thead><tr><th>distribution</th><th>density $f(x)$</th><th>mean formula</th><th class="num">mean value</th></tr></thead>
       <tbody>
         <tr><td class="row-h">Uniform$[0,10]$</td><td>$\\frac{1}{b-a} = \\frac{1}{10}$</td><td>$\\frac{a+b}{2}$</td><td class="num">5 min</td></tr>
         <tr><td class="row-h">Exponential $\\lambda=\\frac{1}{5}$</td><td>$\\lambda e^{-\\lambda x}$</td><td>$\\frac{1}{\\lambda}$</td><td class="num">5 min</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Uniform mean wait: $\\frac{a+b}{2} = \\frac{0 + 10}{2} = 5$ minutes.</li>
       <li>Uniform density height: $\\frac{1}{b-a} = \\frac{1}{10}$ over the range.</li>
       <li>Exponential mean wait: $\\frac{1}{\\lambda} = \\frac{1}{1/5} = 5$ minutes until the next call.</li>
       <li><b>Memoryless, with numbers.</b> The chance of waiting more than $t$ minutes is $P(X \\gt t) = e^{-\\lambda t}$. So $P(X \\gt 5) = e^{-(1/5)(5)} = e^{-1} \\approx 0.368$.</li>
       <li>Now suppose you've <i>already</i> waited 3 minutes. The chance you wait 5 more is $P(X \\gt 8 \\mid X \\gt 3) = \\frac{P(X \\gt 8)}{P(X \\gt 3)} = \\frac{e^{-8/5}}{e^{-3/5}} = e^{-(8-3)/5} = e^{-1} \\approx 0.368$.<div class="why">Same $0.368$ as a fresh start — the 3 minutes already spent change nothing. That equality $P(X \\gt 8 \\mid X \\gt 3) = P(X \\gt 5)$ IS the memoryless property, shown in numbers.</div></li>
     </ul>`,
  application:
    `<p>Uniform is used to initialize neural-network weights and to generate random samples. Exponential models time-between-events: server request gaps, equipment failures, customer arrivals.</p>`,
  whenToUse:
    `<p><b>Reach for the Uniform when every value in a range is equally plausible</b> — random initialization, sampling, a non-informative prior. Reach for the Exponential when you model the waiting time until the next event from a constant-rate process — request gaps, failures, arrivals.</p>
     <p><b>Choose these over:</b></p>
     <ul>
       <li><b>A Normal</b> — Uniform when you genuinely have no preference inside an interval; Exponential when the quantity is a non-negative waiting time, which the symmetric Normal can't represent.</li>
       <li><b>A Geometric</b> — Exponential is its continuous analog; use it when time is measured continuously rather than in discrete trials.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The event rate changes over time (aging equipment, ramps) — the Exponential's constant-hazard assumption fails; use a Weibull or Gamma.</li>
       <li>You need bounded values with a central tendency — a Beta on $[0,1]$ beats a flat Uniform.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The Exponential is memoryless.</b> The expected remaining wait never shrinks no matter how long you've waited. If "overdue" failures get more likely with age, this model is wrong — use a Weibull.</li>
       <li><b>Uniform initialization can hurt deep nets.</b> A naive symmetric range can shrink or explode signals across layers; use a scaled scheme (Xavier/Glorot, He) tied to layer width.</li>
       <li><b>Rate vs scale confusion.</b> The Exponential is parameterized by rate $\\lambda$ or mean $1/\\lambda$ depending on the library. Mixing them silently scales everything wrong.</li>
       <li><b>Uniform's hard boundaries.</b> Exactly-at-the-edge values and the discontinuous density cause trouble for methods that assume smoothness.</li>
       <li><b>Heavy real-world tails.</b> Inter-arrival times are often more heavy-tailed than Exponential predicts; check before assuming a constant rate.</li>
       <li><b>RNG quality.</b> Sampling "Uniform" from a weak pseudo-random generator introduces structure; use a vetted generator for simulations and security.</li>
     </ul>`,
  quiz: {
    q: `A Uniform random variable runs over $[2, 8]$. What is its mean?`,
    a: `<p>$E[X] = \\frac{a+b}{2} = \\frac{2+8}{2} = \\frac{10}{2} = 5$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-normal",
  demo: function (host) {
    // BESPOKE bell curve with a draggable shaded region [a,b]. We numerically
    // integrate the PDF over [a,b] to show P(a≤X≤b), and shade the ±1σ/±2σ bands
    // behind the curve to make the 68-95-99.7 rule visible.
    host.innerHTML = "";
    function C() {
      var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
      var g = function (n, d) { try { return (s && s.getPropertyValue(n).trim()) || d; } catch (e) { return d; } };
      return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
    }
    var W = 640, H = 320, L = 46, R = 624, T = 18, B = H - 30;
    var xmin = -8, xmax = 8;
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";
    var state = { mu: 0, sig: 1, a: -1, b: 1 };
    var ymax = 1.1;
    var px = function (x) { return L + (x - xmin) / (xmax - xmin) * (R - L); };
    var py = function (y) { return B - (y - 0) / (ymax - 0) * (B - T); };
    function pdf(x) { var sg = state.sig; return (1 / (sg * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - state.mu) * (x - state.mu)) / (2 * sg * sg)); }
    function integ(a, b) { if (b < a) { var t = a; a = b; b = t; } var n = 400, h = (b - a) / n, s = 0; for (var i = 0; i <= n; i++) { var w = (i === 0 || i === n) ? 1 : (i % 2 ? 4 : 2); s += w * pdf(a + i * h); } return s * h / 3; }

    function band(lo, hi, fill) {
      ctx.fillStyle = fill;
      ctx.fillRect(px(lo), T, px(hi) - px(lo), B - T);
    }

    function draw() {
      var c = C();
      ctx.clearRect(0, 0, W, H);
      ctx.font = "13px -apple-system, sans-serif"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
      var mu = state.mu, sg = state.sig;
      // ±1σ, ±2σ bands behind everything
      band(mu - 2 * sg, mu + 2 * sg, c.warn + "14");
      band(mu - sg, mu + sg, c.accent2 + "1e");

      // shaded P(a≤X≤b) under the curve
      var a = Math.min(state.a, state.b), b = Math.max(state.a, state.b);
      ctx.beginPath(); ctx.moveTo(px(a), py(0));
      var ns = 200;
      for (var i = 0; i <= ns; i++) { var x = a + (b - a) * i / ns; ctx.lineTo(px(x), py(pdf(x))); }
      ctx.lineTo(px(b), py(0)); ctx.closePath();
      ctx.fillStyle = c.accent + "55"; ctx.fill();

      // axis
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L, py(0)); ctx.lineTo(R, py(0)); ctx.stroke();

      // the bell
      ctx.beginPath();
      for (var j = 0; j <= 240; j++) { var xx = xmin + (xmax - xmin) * j / 240, X = px(xx), Y = py(pdf(xx)); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.stroke();

      // a,b handles
      [["a", a], ["b", b]].forEach(function (p) {
        ctx.strokeStyle = c.warn; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px(p[1]), T); ctx.lineTo(px(p[1]), B); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = c.warn; ctx.font = "bold 12px -apple-system, sans-serif";
        ctx.fillText(p[0], px(p[1]) - 3, B + 14);
      });

      // σ-band labels: μ at the peak; the two σ labels staggered to the
      // inner edge of each band so they sit over their own region, not on top
      // of one another.
      ctx.font = "11px -apple-system, sans-serif";
      ctx.fillStyle = c.dim; ctx.textAlign = "center"; ctx.fillText("μ", px(mu), T + 12);
      ctx.textAlign = "left";
      var sigLabelX = Math.min(px(mu + sg) + 4, R - 78);
      ctx.fillStyle = c.accent2; ctx.fillText("±1σ (≈68%)", sigLabelX, T + 28);
      ctx.fillStyle = c.warn; ctx.fillText("±2σ (≈95%)", sigLabelX, T + 44);

      var area = integ(a, b);
      readout.innerHTML = "Normal μ = " + mu.toFixed(1) + ", σ = " + sg.toFixed(1) +
        ". Shaded blue region P(" + a.toFixed(2) + " ≤ X ≤ " + b.toFixed(2) + ") = <b>" + area.toFixed(3) +
        "</b>. Green band ±1σ ≈ 0.683, orange band ±2σ ≈ 0.954 (the 68-95-99.7 rule).";
    }

    function mkSlider(label, min, max, val, step, set) {
      var row = document.createElement("div"); row.style.margin = "6px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var vs = document.createElement("span"); vs.className = "out"; vs.style.marginLeft = "6px"; vs.textContent = (+val).toFixed(2);
      lab.textContent = label; lab.appendChild(vs);
      var inp = document.createElement("input"); inp.setAttribute("type", "range");
      inp.min = min; inp.max = max; inp.step = step; inp.value = val;
      inp.addEventListener("input", function () { var v = parseFloat(inp.value); vs.textContent = v.toFixed(2); set(v); draw(); });
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    mkSlider("μ (center)", -3, 3, state.mu, 0.1, function (v) { state.mu = v; });
    mkSlider("σ (spread)", 0.4, 3, state.sig, 0.1, function (v) { state.sig = v; });
    mkSlider("a (left edge of region)", -8, 8, state.a, 0.1, function (v) { state.a = v; });
    mkSlider("b (right edge of region)", -8, 8, state.b, 0.1, function (v) { state.b = v; });
    host.appendChild(readout);
    draw();
  },
  title: "Normal (Gaussian) distribution",
  tagline: "The famous bell curve. Nature's default shape, and it's everywhere.",
  prereqs: ["prob-pdf-cdf", "prob-variance"],
  bigIdea:
    `<p>The <b>Normal</b> distribution is the classic bell-shaped curve.</p>
     <p>Most values cluster near the middle; extremes are rare on both sides.</p>
     <p>It shows up everywhere: heights, test scores, measurement errors.</p>
     <p>It is described by just two numbers: the center $\\mu$ and the spread $\\sigma$.</p>`,
  buildup:
    `<p>You know the mean $\\mu$ sets the center and $\\sigma$ sets the spread.</p>
     <p>The Normal curve is tallest at $\\mu$ and falls off symmetrically on each side.</p>
     <p>The formula looks scary, but it just encodes 'peak at $\\mu$, width set by $\\sigma$'.</p>`,
  symbols: [
    { sym: "$\\mathcal{N}(\\mu, \\sigma^2)$", desc: "a Normal distribution with mean $\\mu$ and variance $\\sigma^2$." },
    { sym: "$\\mu$", desc: "the mean: where the bell is centered (Greek 'mu')." },
    { sym: "$\\sigma$", desc: "the standard deviation: how wide the bell is (Greek 'sigma')." },
    { sym: "$\\sigma^2$", desc: "the variance: $\\sigma$ squared." },
    { sym: "$\\pi$", desc: "pi, about $3.14159$ — yes, the circle constant shows up here too." },
    { sym: "$e$", desc: "Euler's number, about $2.718$. The $e^{-(\\dots)}$ makes the tails fall off fast." }
  ],
  formula: `$$ f(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\, e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2} $$`,
  whatItDoes:
    `<p>The $\\frac{x - \\mu}{\\sigma}$ part measures 'how many standard deviations is $x$ from the center?'</p>
     <p>Squaring it and putting it in $e^{-(\\dots)}$ makes the curve drop quickly as you move away from $\\mu$.</p>
     <p>The front fraction $\\frac{1}{\\sqrt{2\\pi}\\,\\sigma}$ just scales the curve so its total area is 1.</p>`,
  example:
    `<p>Adult heights are roughly Normal with $\\mu = 170$ cm and $\\sigma = 10$ cm. Use the <b>68-95-99.7 rule</b>: a fixed share of values falls within 1, 2, and 3 standard deviations of the mean.</p>
     <table class="extable">
       <caption>$\\mu = 170$, $\\sigma = 10$: bands $\\mu \\pm k\\sigma$</caption>
       <thead><tr><th class="num">$k$</th><th class="num">range $\\mu \\pm k\\sigma$ (cm)</th><th class="num">share inside</th></tr></thead>
       <tbody>
         <tr><td class="num">1</td><td class="num">160 to 180</td><td class="num">~68%</td></tr>
         <tr><td class="num">2</td><td class="num">150 to 190</td><td class="num">~95%</td></tr>
         <tr><td class="num">3</td><td class="num">140 to 200</td><td class="num">~99.7%</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>1 $\\sigma$ band: $170 - 10 = 160$ to $170 + 10 = 180$ cm holds ~68%.</li>
       <li>2 $\\sigma$ band: $170 - 20 = 150$ to $170 + 20 = 190$ cm holds ~95%.</li>
       <li>3 $\\sigma$ band: $170 - 30 = 140$ to $170 + 30 = 200$ cm holds ~99.7%.</li>
       <li>So a height of 200 cm is about 3 $\\sigma$ out — very rare (top ~0.15%).</li>
     </ul>`,
  application:
    `<p>The Normal is the default assumption for noise and errors in countless models. Linear regression assumes Normal residuals. Many neural-network weights are initialized from a Normal. It is the most important distribution in all of ML (Machine Learning).</p>`,
  whenToUse:
    `<p><b>Reach for the Normal (Gaussian) as your default model for measurement noise, errors, and sums of many small independent effects</b> — the CLT (Central Limit Theorem) makes it the right shape for averages and aggregates. It is the assumed residual in linear regression and the standard weight initializer.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A more exotic distribution</b> — when you have a symmetric, single-peaked quantity and no strong reason to expect skew or heavy tails; the Normal is analytically convenient and well understood.</li>
       <li><b>Modeling raw data directly</b> — when a transform (log) makes the data roughly Normal, unlocking simple methods.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The data is bounded, skewed, or count-valued — use Beta, log-Normal, or Poisson; forcing Normality predicts impossible values.</li>
       <li>Outliers and heavy tails are real — use a Student-$t$ for robustness; the Normal's thin tails dismiss extremes as near-impossible.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Assuming Normality without checking.</b> Many real distributions are skewed or heavy-tailed. Plot a histogram or Q-Q plot before relying on Normal-based methods.</li>
       <li><b>Thin tails underestimate extremes.</b> A "6-sigma" event is treated as essentially impossible, yet financial and failure data show such events regularly. Don't model fat tails with a Normal.</li>
       <li><b>Outliers distort the fit.</b> Mean and standard deviation are non-robust; a few extreme points shift the whole curve. Consider robust estimators.</li>
       <li><b>Normality of data vs of the mean.</b> The CLT makes <i>averages</i> Normal, not the raw data. Don't claim individual observations are Normal just because their mean is.</li>
       <li><b>Negative or bounded quantities.</b> A Normal puts mass below zero, so it's wrong for prices, counts, or durations. Use a bounded or positive distribution.</li>
       <li><b>Standardize before Normal-assuming methods.</b> PCA and many models assume centered, comparably scaled features; skipping standardization quietly breaks the assumption.</li>
     </ul>`,
  quiz: {
    q: `Test scores are Normal with $\\mu = 500$, $\\sigma = 100$. Roughly what percent of scores fall between 400 and 600?`,
    a: `<p>That's $\\mu \\pm 1\\sigma$ (one standard deviation each way). By the 68-95-99.7 rule, about <b>68%</b> of scores fall there.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-joint-marginal",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "a", label: "weight (x₁,y₁)", min: 0, max: 1, val: 0.4, step: 0.01 },
        { key: "b", label: "weight (x₂,y₁)", min: 0, max: 1, val: 0.1, step: 0.01 },
        { key: "c", label: "weight (x₁,y₂)", min: 0, max: 1, val: 0.2, step: 0.01 },
        { key: "d", label: "weight (x₂,y₂)", min: 0, max: 1, val: 0.3, step: 0.01 }
      ],
      bars: true, barsHeight: 150,
      compute: function (s) {
        var tot = s.a + s.b + s.c + s.d;
        if (tot <= 0) tot = 1;
        var a = s.a / tot, b = s.b / tot, c = s.c / tot, d = s.d / tot;
        var px1 = a + c, px2 = b + d, py1 = a + b, py2 = c + d;
        return { text: "Joint table normalized to sum 1. Row marginals: P(x₁) = " + px1.toFixed(2) +
          ", P(x₂) = " + px2.toFixed(2) + ". Column marginals: P(y₁) = " + py1.toFixed(2) +
          ", P(y₂) = " + py2.toFixed(2) + ". Each marginal sums out the other variable.",
          bars: [
            { label: "P(x₁)", val: px1, color: "#4ea1ff" },
            { label: "P(x₂)", val: px2, color: "#4ea1ff" },
            { label: "P(y₁)", val: py1, color: "#7ee787" },
            { label: "P(y₂)", val: py2, color: "#7ee787" }
          ], max: 1 };
      }
    });
  },
  title: "Joint & marginal distributions",
  tagline: "Two variables at once. Sum out one to get the other back.",
  prereqs: ["prob-random-variable"],
  bigIdea:
    `<p>Often two things vary together: height and weight, ad shown and click.</p>
     <p>A <b>joint distribution</b> gives the chance of every combination of the two.</p>
     <p>Think of it as a table: rows for one variable, columns for the other.</p>
     <p>A <b>marginal</b> distribution recovers one variable alone by summing out the other.</p>`,
  buildup:
    `<p>One variable had a PMF (Probability Mass Function) $p_X(x)$. Two variables have a joint PMF $p_{X,Y}(x, y)$ — a chance for each pair.</p>
     <p>To get $X$ by itself, you don't care about $Y$. So add up over all values of $Y$.</p>
     <p>Summing over a variable 'integrates it out' — the answer sits in the margin of the table, hence 'marginal'.</p>`,
  symbols: [
    { sym: "$p_{X,Y}(x, y)$", desc: "the joint PMF: the chance that $X = x$ AND $Y = y$ together." },
    { sym: "$p_X(x)$", desc: "the marginal PMF of $X$ alone: the chance $X = x$, ignoring $Y$." },
    { sym: "$\\sum_y$", desc: "'add up over every value $y$ of $Y$'." },
    { sym: "$x, y$", desc: "particular values of the two variables $X$ and $Y$." }
  ],
  formula: `$$ p_X(x) = \\sum_y p_{X,Y}(x, y) \\qquad \\Big(\\text{continuous: } f_X(x) = \\int f_{X,Y}(x, y)\\, dy\\Big) $$
$$ f_{X\\mid Y}(x\\mid y) = \\frac{f_{X,Y}(x,y)}{f_Y(y)} $$`,
  whatItDoes:
    `<p>To find the marginal of $X$ at value $x$: fix $x$, then add the joint probabilities across all $y$.</p>
     <p>You're collapsing the table down one direction. $Y$ disappears; $X$ remains.</p>
     <p>For continuous variables, replace the sum $\\sum$ with an integral $\\int$.</p>
     <p>The <b>conditional density</b> $f_{X\\mid Y}(x\\mid y) = \\frac{f_{X,Y}(x,y)}{f_Y(y)}$ rescales the joint density by the marginal of the variable you are conditioning on, so it integrates to 1 once $y$ is fixed.</p>
     <p><b>Independence (continuous):</b> $X$ and $Y$ are independent iff $f_{X,Y}(x,y) = f_X(x)\\,f_Y(y)$ for all $x, y$ — that is, the joint factors into the product of the two marginals.</p>`,
  example:
    `<p>Joint distribution of weather ($Y$ = Sunny/Rainy) and your mood ($X$ = Happy/Sad). The four inner cells add to 1; each margin is a row or column sum.</p>
     <table class="extable">
       <caption>Joint cells inside; marginals in the last row/column</caption>
       <thead><tr><th></th><th class="num">Sunny</th><th class="num">Rainy</th><th class="num">$P(\\text{mood})$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">Happy</td><td class="num">0.4</td><td class="num">0.1</td><td class="num">0.5</td></tr>
         <tr><td class="row-h">Sad</td><td class="num">0.2</td><td class="num">0.3</td><td class="num">0.5</td></tr>
         <tr><td class="row-h">$P(\\text{weather})$</td><td class="num">0.6</td><td class="num">0.4</td><td class="num">1.0</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Joint cells: $P(\\text{Happy, Sunny}) = 0.4$, $P(\\text{Happy, Rainy}) = 0.1$, $P(\\text{Sad, Sunny}) = 0.2$, $P(\\text{Sad, Rainy}) = 0.3$. They sum to 1.</li>
       <li>Marginal mood = Happy: sum its row over weather $= 0.4 + 0.1 = 0.5$.</li>
       <li>Marginal mood = Sad: $0.2 + 0.3 = 0.5$.</li>
       <li>Marginal weather = Sunny: sum its column over mood $= 0.4 + 0.2 = 0.6$. So it's sunny 60% of the time.</li>
     </ul>`,
  application:
    `<p>Joint distributions describe how features relate. Probabilistic graphical models and Bayesian networks are built entirely from joint and marginal distributions. Marginalizing out hidden variables is a core inference step.</p>`,
  whenToUse:
    `<p><b>You reach for joint and marginal distributions whenever you need to reason about several variables at once</b> — how features co-vary, what one variable says about another, or what's left when you average a nuisance variable away. They are the substrate of every probabilistic graphical model.</p>
     <p><b>Use the joint over:</b></p>
     <ul>
       <li><b>Per-variable marginals alone</b> — when the variables interact; the product of marginals throws away exactly the dependence you care about.</li>
       <li><b>A correlation number</b> — when you need full conditional or tail behavior, not just a single linear summary.</li>
     </ul>
     <p><b>Marginalize (sum/integrate out) when:</b> a variable is a hidden nuisance you don't want to predict — that is the core inference step in mixture models and Bayesian networks. Reach for a factorized representation when the full joint is too large to store directly.</p>`,
  pitfalls:
    `<ul>
       <li><b>The joint blows up combinatorially.</b> A full table over many discrete variables has exponentially many cells. You can't estimate or store it without structure (independence assumptions, factorization).</li>
       <li><b>Marginals don't rebuild the joint.</b> Knowing each variable separately tells you nothing about how they relate. You cannot recover dependence from marginals alone.</li>
       <li><b>Marginalizing the wrong variable.</b> Summing out a confounder vs a mediator gives different — sometimes misleading — answers. Know what each variable means.</li>
       <li><b>Sparse cells, noisy estimates.</b> High-dimensional joints leave most cells with few or zero samples, so estimates are unreliable. Smooth or assume structure.</li>
       <li><b>Confusing joint, marginal, and conditional.</b> $P(X,Y)$, $P(X)$, and $P(X\\mid Y)$ are three different objects. Mixing them up corrupts the whole derivation.</li>
     </ul>`,
  quiz: {
    q: `From the table above, what is the marginal probability that the weather is Rainy?`,
    a: `<p>Sum the Rainy column: $P(\\text{Happy, Rainy}) + P(\\text{Sad, Rainy}) = 0.1 + 0.3 = 0.4$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-covariance-correlation",
  demo: function (host) {
    // 30 fixed unit-variance pairs: zx is the X coordinate, e is independent noise.
    // Tilt toward correlation r via y = r*zx + sqrt(1-r^2)*e, which has correlation r with x.
    var N = 30, zx = [], e = [];
    for (var k = 0; k < N; k++) {
      var ang = (k + 0.5) / N * 2 * Math.PI;
      zx.push(2.2 * Math.cos(ang * 1.3 + 0.7) + 0.9 * Math.sin(ang * 2.7));
      e.push(2.2 * Math.sin(ang * 1.7 + 0.3) + 0.9 * Math.cos(ang * 3.1));
    }
    // initial points span the worst-case range so px/py axes never clip
    var points = [];
    for (var m = 0; m < N; m++) points.push({ x: zx[m], y: e[m], c: 0 });
    Demos.scatter(host, {
      points: points,
      init: function (api) {
        function corr(xs, ys) {
          var n = xs.length, mx = 0, my = 0, i;
          for (i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; }
          mx /= n; my /= n;
          var sxy = 0, sxx = 0, syy = 0;
          for (i = 0; i < n; i++) { var dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
          var den = Math.sqrt(sxx * syy);
          return den > 0 ? sxy / den : 0;
        }
        function render(r) {
          var xs = [], ys = [];
          for (var j = 0; j < N; j++) {
            var yv = r * zx[j] + Math.sqrt(1 - r * r) * e[j];
            api.pts[j].x = zx[j]; api.pts[j].y = yv;
            xs.push(zx[j]); ys.push(yv);
          }
          var rho = corr(xs, ys);
          // least-squares trend line  y = mx + b  over the cloud
          var n = xs.length, mx = 0, my = 0, i;
          for (i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; }
          mx /= n; my /= n;
          var sxy = 0, sxx = 0;
          for (i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
          var slope = sxx > 0 ? sxy / sxx : 0, intercept = my - slope * mx;
          var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs);
          api.draw(function (ctx, c, px, py) {
            ctx.strokeStyle = c.warn; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(px(x0), py(slope * x0 + intercept)); ctx.lineTo(px(x1), py(slope * x1 + intercept)); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = c.warn; ctx.font = "bold 15px -apple-system, sans-serif";
            ctx.fillText("ρ = " + rho.toFixed(2), px(x0) + 8, py(slope * x1 + intercept) + 18);
          });
          var word = Math.abs(rho) < 0.1 ? "no clear linear link" : (rho > 0 ? "rise together" : "move oppositely");
          api.readout.innerHTML = "Correlation slider r = <b>" + r.toFixed(2) +
            "</b>. The cloud tilts along the orange trend line and has &rho; &asymp; <b>" + rho.toFixed(2) +
            "</b>: as |r| grows the points tighten onto the line; near 0 the cloud is round. They " + word + ".";
        }
        api.slider("correlation r", -1, 1, 0.6, 0.05, render);
        render(0.6);
      }
    });
  },
  title: "Covariance & correlation",
  tagline: "Do two variables move together? These numbers tell you, and by how much.",
  prereqs: ["prob-joint-marginal", "prob-variance"],
  bigIdea:
    `<p>When one variable goes up, does the other tend to go up too?</p>
     <p><b>Covariance</b> answers that: positive means they rise together, negative means one rises as the other falls.</p>
     <p>But covariance's size depends on units, so it's hard to read.</p>
     <p><b>Correlation</b> rescales it to a clean range from $-1$ to $+1$.</p>`,
  buildup:
    `<p>Variance measured how one variable spreads. Covariance extends that to two variables moving together.</p>
     <p>If $X$ and $Y$ tend to be big at the same time, the product $XY$ is big on average — bigger than $E[X]E[Y]$.</p>
     <p>To compare across different scales, divide by both standard deviations. That gives correlation.</p>`,
  symbols: [
    { sym: "$\\operatorname{Cov}(X, Y)$", desc: "covariance: how $X$ and $Y$ move together." },
    { sym: "$E[XY]$", desc: "the mean of the product $X$ times $Y$." },
    { sym: "$E[X]\\,E[Y]$", desc: "the product of the two separate means." },
    { sym: "$\\rho$", desc: "correlation (Greek 'rho'): covariance rescaled to lie in $[-1, 1]$." },
    { sym: "$\\sigma_X, \\sigma_Y$", desc: "the standard deviations of $X$ and $Y$." }
  ],
  formula: `$$ \\operatorname{Cov}(X, Y) = E[XY] - E[X]\\,E[Y] \\qquad \\rho = \\frac{\\operatorname{Cov}(X, Y)}{\\sigma_X\\,\\sigma_Y} \\in [-1, 1] $$`,
  whatItDoes:
    `<p>Covariance: 'mean of the product' minus 'product of the means'. If they move together, this is positive; if oppositely, negative; if unrelated, near 0.</p>
     <p>Correlation divides covariance by both spreads, giving a unit-free number. $+1$ = perfect straight-line up, $-1$ = perfect straight-line down, $0$ = no linear link.</p>`,
  example:
    `<p>Two variables with $E[X] = 2$, $E[Y] = 3$, $E[XY] = 8$, $\\sigma_X = 1$, $\\sigma_Y = 2$.</p>
     <table class="extable">
       <caption>Given quantities and the two results computed from them</caption>
       <thead><tr><th>quantity</th><th class="num">value</th></tr></thead>
       <tbody>
         <tr><td class="row-h">$E[X]$</td><td class="num">2</td></tr>
         <tr><td class="row-h">$E[Y]$</td><td class="num">3</td></tr>
         <tr><td class="row-h">$E[XY]$</td><td class="num">8</td></tr>
         <tr><td class="row-h">$\\sigma_X,\\ \\sigma_Y$</td><td class="num">1, 2</td></tr>
         <tr><td class="row-h">$\\operatorname{Cov}(X,Y)$</td><td class="num">2</td></tr>
         <tr><td class="row-h">$\\rho$</td><td class="num">1</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Covariance: $E[XY] - E[X]E[Y] = 8 - (2 \\times 3) = 8 - 6 = 2$. Positive — they move together.</li>
       <li>Correlation: $\\rho = \\frac{\\operatorname{Cov}}{\\sigma_X \\sigma_Y} = \\frac{2}{1 \\times 2} = \\frac{2}{2} = 1$.</li>
       <li>$\\rho = 1$ means a perfect positive linear relationship.</li>
     </ul>`,
  application:
    `<p>Correlation finds related features in data. Highly correlated features are often redundant, so dropping one speeds up models. PCA (Principal Component Analysis) works directly on the covariance matrix to find the main directions of variation.</p>`,
  whenToUse:
    `<p><b>Reach for covariance and correlation whenever you want to measure how two quantities move together</b> — to spot redundant features, find leading indicators, or build the covariance matrix that PCA (Principal Component Analysis) and many models consume. Correlation is the scale-free, unit-less version that compares across features.</p>
     <p><b>Choose correlation over:</b></p>
     <ul>
       <li><b>Raw covariance</b> — when features have different units or scales; correlation normalizes to $[-1,1]$ for an apples-to-apples comparison.</li>
       <li><b>A scatter eyeball</b> — when you need one comparable number across many feature pairs to rank or filter them.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The relationship is non-linear (U-shaped, threshold) — Pearson correlation misses it; use mutual information or Spearman rank correlation.</li>
       <li>You suspect a confounder driving both variables — correlation won't separate it; you need partial correlation or a causal model.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>Correlation is not causation.</b> Two variables can move together because a third drives both. Never read a correlation as a cause without a design that supports it.</li>
       <li><b>Pearson only sees linear structure.</b> A perfect parabola can have zero correlation. Zero correlation does not mean independence — plot the data.</li>
       <li><b>Outliers fake or hide correlation.</b> One extreme point can create a strong correlation out of noise or mask a real one. Inspect and consider robust measures.</li>
       <li><b>Spurious correlation in high dimensions.</b> With many features and few rows, some pairs correlate strongly by chance. Correct for multiple comparisons.</li>
       <li><b>Covariance matrices go non-invertible.</b> Collinear features make the matrix singular, breaking PCA and Gaussian models. Regularize (add to the diagonal) or drop redundant columns.</li>
       <li><b>Scale sensitivity of covariance.</b> Unscaled covariance is dominated by high-variance features. Standardize before comparing or before PCA.</li>
     </ul>`,
  quiz: {
    q: `If $\\operatorname{Cov}(X, Y) = 0$, what does that say about their correlation $\\rho$?`,
    a: `<p>$\\rho = \\frac{0}{\\sigma_X \\sigma_Y} = 0$. There's no linear relationship between $X$ and $Y$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-conditional-expectation",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "e1", label: "E[X | Y=y₁]", min: 0, max: 100, val: 10, step: 1 },
        { key: "e2", label: "E[X | Y=y₂]", min: 0, max: 100, val: 20, step: 1 },
        { key: "py1", label: "P(Y=y₁)  (P(Y=y₂)=1−this)", min: 0, max: 1, val: 0.6, step: 0.01 }
      ],
      bars: true, barsHeight: 110,
      compute: function (s) {
        var py2 = 1 - s.py1;
        var ex = s.py1 * s.e1 + py2 * s.e2;
        return { text: "E[X] = Σ P(y)·E[X|y] = " + s.py1.toFixed(2) + "·" + s.e1 + " + " + py2.toFixed(2) + "·" + s.e2 +
          " = <b>" + ex.toFixed(2) + "</b>. Law of iterated expectations: averaging the group-averages recovers the overall mean.",
          bars: [
            { label: "E[X|y₁]", val: s.e1, color: "#9aa7b4" },
            { label: "E[X|y₂]", val: s.e2, color: "#9aa7b4" },
            { label: "E[X] overall", val: ex, color: "#4ea1ff" }
          ], max: 100 };
      }
    });
  },
  title: "Conditional expectation",
  tagline: "The average of one variable once you know the other. Averages can be done in stages.",
  prereqs: ["prob-expectation", "prob-joint-marginal"],
  bigIdea:
    `<p>The expectation gave the overall average of $X$.</p>
     <p><b>Conditional expectation</b> $E[X \\mid Y]$ is the average of $X$ once you know $Y$.</p>
     <p>It is a 'group-by' average: pick a group (a value of $Y$), then average $X$ inside it.</p>
     <p>A neat law says: averaging those group-averages gets you back the overall average.</p>`,
  buildup:
    `<p>Different groups have different averages. Tall parents tend to have taller kids.</p>
     <p>So $E[\\text{child height} \\mid \\text{tall parents}]$ differs from the overall average.</p>
     <p>If you weight each group's average by how common the group is and add, you recover the grand average. That's the <b>law of iterated expectations</b>.</p>`,
  symbols: [
    { sym: "$E[X \\mid Y]$", desc: "the average of $X$ given the value of $Y$. It depends on $Y$, so it's itself a random thing." },
    { sym: "$E[X]$", desc: "the overall (unconditional) average of $X$." },
    { sym: "$E[E[X \\mid Y]]$", desc: "the average (over $Y$) of the group-by-group averages." },
    { sym: "$Y$", desc: "the variable you condition on (the grouping variable)." }
  ],
  formula: `$$ E\\big[E[X \\mid Y]\\big] = E[X] $$`,
  whatItDoes:
    `<p>Inside: $E[X \\mid Y]$ gives one average per group of $Y$.</p>
     <p>Outside: average those group-averages, weighting each by how likely that group is.</p>
     <p>The result is the plain overall average $E[X]$. You can compute a mean in two stages and still land in the same place.</p>`,
  example:
    `<p>A factory's items come from two machines. Machine A (60% of items) makes items averaging 10 grams. Machine B (40%) averages 20 grams. What's the overall average weight?</p>
     <table class="extable">
       <caption>Weight each group-average by how common the group is</caption>
       <thead><tr><th>group $Y$</th><th class="num">$P(Y)$</th><th class="num">$E[X\\mid Y]$</th><th class="num">$P(Y)\\,E[X\\mid Y]$</th></tr></thead>
       <tbody>
         <tr><td class="row-h">Machine A</td><td class="num">0.6</td><td class="num">10 g</td><td class="num">6 g</td></tr>
         <tr><td class="row-h">Machine B</td><td class="num">0.4</td><td class="num">20 g</td><td class="num">8 g</td></tr>
         <tr><td class="row-h">overall $E[X]$</td><td class="num">1.0</td><td class="num"></td><td class="num">14 g</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Group averages: $E[X \\mid A] = 10$, $E[X \\mid B] = 20$.</li>
       <li>Group sizes: $P(A) = 0.6$, $P(B) = 0.4$.</li>
       <li>Weight and add: $E[X] = 0.6 \\times 10 + 0.4 \\times 20 = 6 + 8 = 14$ grams.</li>
       <li>So the overall mean is 14 grams — exactly the law of iterated expectations $E[E[X\\mid Y]] = E[X]$ in action.</li>
     </ul>`,
  application:
    `<p>A regression model literally predicts $E[Y \\mid X]$ — the average output given the inputs. Conditional expectation is the formal target of nearly all supervised learning.</p>`,
  whenToUse:
    `<p><b>You reach for conditional expectation whenever you want the best single-number prediction of an output given some inputs</b> — $E[Y\\mid X]$ is exactly what a regression model estimates and the formal target of nearly all supervised learning under squared-error loss.</p>
     <p><b>Use it over:</b></p>
     <ul>
       <li><b>The unconditional mean $E[Y]$</b> — when features carry signal; conditioning on $X$ sharpens the prediction beyond the overall average.</li>
       <li><b>A full conditional distribution</b> — when you only need a point estimate and downstream cost is symmetric (squared error), where the conditional mean is optimal.</li>
     </ul>
     <p><b>Prefer a different target when:</b></p>
     <ul>
       <li>Your loss isn't squared error — the conditional median minimizes absolute error; a conditional quantile targets a percentile (quantile regression).</li>
       <li>You need uncertainty, not just a center — predict the conditional variance or the full predictive distribution too.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The mean isn't always the right target.</b> For skewed outcomes or asymmetric costs, $E[Y\\mid X]$ can be a poor decision; match the estimator to the loss.</li>
       <li><b>Tower property abuse.</b> $E[E[Y\\mid X]]=E[Y]$ holds, but only when you average over the correct distribution of $X$ — train/serving skew breaks it.</li>
       <li><b>Conditioning on too many things.</b> Predicting $E[Y\\mid X]$ with high-dimensional $X$ and few rows gives noisy, overfit estimates. Regularize.</li>
       <li><b>Conditioning on a post-outcome variable.</b> Including a feature influenced by $Y$ (leakage or a collider) makes $E[Y\\mid X]$ look great offline and fail live.</li>
       <li><b>Heteroscedastic noise.</b> The conditional mean can be right while the conditional <i>variance</i> changes across $X$; reporting one error bar everywhere misleads.</li>
       <li><b>Extrapolation.</b> $E[Y\\mid X]$ learned on one region of $X$ has no guarantee outside it. Flag inputs far from the training support.</li>
     </ul>`,
  quiz: {
    q: `Class A (half the students) averages 80 on a test; class B (the other half) averages 90. What is the overall average?`,
    a: `<p>$E[X] = 0.5 \\times 80 + 0.5 \\times 90 = 40 + 45 = 85$.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-inequalities",
  demo: function (host) {
    Demos.calc(host, {
      inputs: [
        { key: "mu", label: "μ (mean, for Markov)", min: 0.1, max: 100, val: 50, step: 1 },
        { key: "a", label: "a (threshold, for Markov)", min: 0.1, max: 200, val: 100, step: 1 },
        { key: "sig", label: "σ (std dev, for Chebyshev)", min: 0.1, max: 50, val: 10, step: 0.1 },
        { key: "k", label: "k (how many σ away)", min: 0.1, max: 10, val: 3, step: 0.1 }
      ],
      bars: true, barsHeight: 150,
      compute: function (s) {
        var markov = Math.min(1, s.mu / s.a);
        var cheb = Math.min(1, 1 / (s.k * s.k));
        return { text: "Markov: P(X ≥ a) ≤ μ/a = " + s.mu.toFixed(0) + "/" + s.a.toFixed(0) + " = <b>" + markov.toFixed(3) +
          "</b>.<br>Chebyshev: P(|X−μ| ≥ kσ) ≤ 1/k² = 1/" + (s.k * s.k).toFixed(2) + " = <b>" + cheb.toFixed(3) +
          "</b>. Both beat the trivial bound of 1 — that is how much the mean (and variance) buy you.",
          bars: [
            { label: "trivial bound", val: 1, color: "#9aa7b4" },
            { label: "Markov μ/a", val: markov, color: "#4ea1ff" },
            { label: "Chebyshev 1/k²", val: cheb, color: "#7ee787" }
          ], max: 1 };
      }
    });
  },
  title: "Markov & Chebyshev inequalities",
  tagline: "Bound the chance of extremes using only the mean and variance. No full distribution needed.",
  prereqs: ["prob-expectation", "prob-variance"],
  bigIdea:
    `<p>Sometimes you don't know the full distribution — just its mean, maybe its variance.</p>
     <p>These inequalities still let you bound how often extreme values happen.</p>
     <p><b>Markov</b> uses just the mean. <b>Chebyshev</b> uses the mean and variance for a tighter bound.</p>
     <p>They guarantee 'big surprises can't be too common'.</p>`,
  buildup:
    `<p>If a positive variable has a small mean, it can't often be huge — there's not enough 'average' to go around. That's Markov.</p>
     <p>If the variance (spread) is small, values can't stray far from the mean very often. That's Chebyshev.</p>
     <p>Both give upper bounds: 'at most this probability', without assuming any particular curve.</p>`,
  symbols: [
    { sym: "$X \\ge 0$", desc: "for Markov, $X$ must be nonnegative (no negative values)." },
    { sym: "$a$", desc: "a threshold: we ask how often $X$ reaches at least $a$." },
    { sym: "$E[X]$", desc: "the mean of $X$." },
    { sym: "$\\mu$", desc: "the mean (Greek 'mu'), same as $E[X]$." },
    { sym: "$\\epsilon$", desc: "a distance from the mean (Greek 'epsilon'): how far is 'far'?" },
    { sym: "$\\sigma^2$", desc: "the variance of $X$." }
  ],
  formula: `$$ \\text{Markov: } P(X \\ge a) \\le \\frac{E[X]}{a} \\qquad \\text{Chebyshev: } P(|X - \\mu| \\ge \\epsilon) \\le \\frac{\\sigma^2}{\\epsilon^2} $$`,
  whatItDoes:
    `<p>Markov: the chance $X$ reaches $a$ or more is at most the mean divided by $a$. A bigger threshold $a$ means a smaller bound.</p>
     <p>Chebyshev: the chance $X$ is at least $\\epsilon$ away from its mean is at most $\\frac{\\sigma^2}{\\epsilon^2}$. Less variance, or a bigger gap $\\epsilon$, means a smaller bound.</p>`,
  example:
    `<p>(a) Markov: scores average $E[X] = 50$ (and are nonnegative). Bound the chance of scoring 100 or more. (b) Chebyshev: mean $\\mu = 50$, variance $\\sigma^2 = 100$ (so $\\sigma = 10$). Bound the chance of being 30+ points from the mean.</p>
     <table class="extable">
       <caption>Both bounds beat the trivial "at most 1", using only mean (and variance)</caption>
       <thead><tr><th>bound</th><th>formula</th><th class="num">plug-in</th><th class="num">upper bound</th></tr></thead>
       <tbody>
         <tr><td class="row-h">Markov $P(X\\ge 100)$</td><td>$\\frac{E[X]}{a}$</td><td class="num">$\\frac{50}{100}$</td><td class="num">0.5</td></tr>
         <tr><td class="row-h">Chebyshev $P(|X-50|\\ge 30)$</td><td>$\\frac{\\sigma^2}{\\epsilon^2}$</td><td class="num">$\\frac{100}{900}$</td><td class="num">$\\approx 0.11$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Markov: $P(X \\ge 100) \\le \\frac{E[X]}{a} = \\frac{50}{100} = 0.5$. At most 50%.</li>
       <li>Chebyshev: $P(|X - 50| \\ge 30) \\le \\frac{\\sigma^2}{\\epsilon^2} = \\frac{100}{30^2} = \\frac{100}{900} \\approx 0.11$.</li>
       <li>So at most ~11% of scores are more than 30 points from the mean — and we never assumed any specific distribution.</li>
     </ul>`,
  application:
    `<p>These bounds underpin the Law of Large Numbers (next lesson) and many guarantees in machine-learning theory. They give worst-case safety nets when you can't or won't assume a distribution's exact shape.</p>`,
  whenToUse:
    `<p><b>Reach for probability inequalities (Markov, Chebyshev, Hoeffding) when you need a guarantee but won't commit to a distribution's exact shape</b> — they bound the chance of a large deviation using only a mean, or a mean and variance. They are the workhorses behind generalization and concentration bounds in ML theory.</p>
     <p><b>Use a bound over:</b></p>
     <ul>
       <li><b>An exact tail probability</b> — when you don't know the distribution; the inequality gives a safe worst case from minimal assumptions.</li>
       <li><b>A Normal approximation</b> — when sample sizes are too small for the CLT (Central Limit Theorem) to apply or you need a distribution-free guarantee.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You know the distribution — use its exact tail; the bound is far looser than the truth.</li>
       <li>You need a tight, usable interval, not a conservative one — bootstrap or an exact method beats a worst-case inequality.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>The bounds are loose by design.</b> Chebyshev can say "at most 25%" when the real tail is 0.1%. Use them for guarantees, not for accurate probabilities.</li>
       <li><b>Markov needs non-negativity.</b> Markov's inequality applies only to non-negative variables. Applying it to signed quantities gives nonsense.</li>
       <li><b>Hoeffding needs bounded, independent terms.</b> Correlated samples or unbounded values violate its assumptions and the bound no longer holds.</li>
       <li><b>Required moments must be finite.</b> Chebyshev needs a finite variance; for heavy-tailed data without one, it simply doesn't apply.</li>
       <li><b>One-sided vs two-sided confusion.</b> Some forms bound $P(X\\ge a)$, others $P(|X-\\mu|\\ge a)$. Using the wrong one mis-states the guarantee by a factor of two.</li>
     </ul>`,
  quiz: {
    q: `A nonnegative variable has mean 4. By Markov, what is the most that $P(X \\ge 8)$ can be?`,
    a: `<p>$P(X \\ge 8) \\le \\frac{E[X]}{a} = \\frac{4}{8} = 0.5$. At most 50%.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-lln",
  demo: function (host) {
    Demos.sampler(host, {
      lo: 1, hi: 6, bins: 6,
      draw1: function () { return Math.floor(Math.random() * 6) + 1; },
      readout: function (samples, mean) {
        var n = samples.length;
        var gap = Math.abs(mean - 3.5);
        return "Rolling a fair die (true mean = <b>3.5</b>). n = <b>" + n +
          "</b> rolls so far. Running average X&#772; = <b>" + mean.toFixed(3) +
          "</b>, which is <b>" + gap.toFixed(3) + "</b> away from 3.5. " +
          "Draw 1 jumps around; keep drawing and the running mean converges to 3.5 &mdash; the Law of Large Numbers.";
      }
    });
  },
  title: "Law of Large Numbers",
  tagline: "Average enough samples and you home in on the true mean. Why averages are trustworthy.",
  prereqs: ["prob-expectation", "prob-inequalities"],
  bigIdea:
    `<p>One sample is noisy. But average many samples and the noise cancels out.</p>
     <p>The <b>Law of Large Numbers</b> says: as you collect more data, the sample average closes in on the true mean.</p>
     <p>It is why polls, casinos, and experiments work.</p>
     <p>More data means a more reliable average.</p>`,
  buildup:
    `<p>Flip a fair coin 10 times: you might get 7 heads (70%), far from 50%.</p>
     <p>Flip it 10,000 times and you'll be very close to 50%.</p>
     <p>The sample average $\\overline{X}$ stops bouncing around and settles toward the true mean $\\mu$.</p>`,
  symbols: [
    { sym: "$X_1, \\dots, X_n$", desc: "$n$ independent samples from the same distribution." },
    { sym: "$\\overline{X}$", desc: "the sample average: add the $n$ samples and divide by $n$. The bar means 'average'." },
    { sym: "$\\mu$", desc: "the true mean of the distribution we're sampling (Greek 'mu')." },
    { sym: "$n$", desc: "the number of samples." },
    { sym: "$\\to$", desc: "'approaches' or 'goes to' as $n$ grows large." }
  ],
  formula: `$$ \\overline{X} = \\frac{1}{n}\\sum_{i=1}^{n} X_i \\;\\longrightarrow\\; \\mu \\quad \\text{as } n \\to \\infty $$`,
  whatItDoes:
    `<p>$\\overline{X}$ is the average of your samples so far.</p>
     <p>As the sample count $n$ grows toward infinity, that average converges to the true mean $\\mu$.</p>
     <p>The gap between your estimate and the truth shrinks the more data you gather.</p>`,
  example:
    `<p>Roll a fair die (true mean $\\mu = 3.5$, one-roll std $\\sigma = \\sqrt{35/12} \\approx 1.71$) and track the running average $\\overline{X}$. The typical distance of $\\overline{X}$ from $3.5$ shrinks like $\\frac{\\sigma}{\\sqrt{n}}$.</p>
     <table class="extable">
       <caption>Typical wobble $\\frac{\\sigma}{\\sqrt{n}}$ with $\\sigma \\approx 1.71$</caption>
       <thead><tr><th class="num">$n$</th><th class="num">$\\sqrt{n}$</th><th class="num">$\\frac{1.71}{\\sqrt{n}}$</th></tr></thead>
       <tbody>
         <tr><td class="num">5</td><td class="num">2.24</td><td class="num">$\\approx 0.76$</td></tr>
         <tr><td class="num">100</td><td class="num">10</td><td class="num">$\\approx 0.17$</td></tr>
         <tr><td class="num">10000</td><td class="num">100</td><td class="num">$\\approx 0.017$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>After $n = 5$ rolls $[6, 2, 5, 1, 4]$: average $= \\frac{18}{5} = 3.6$, off by $0.10$. Typical error $\\frac{\\sigma}{\\sqrt{5}} = \\frac{1.71}{2.24} \\approx 0.76$ — wobble is large.</li>
       <li>After $n = 100$: typical error $\\frac{1.71}{\\sqrt{100}} = \\frac{1.71}{10} \\approx 0.17$. The bound on wobble already fell ~4.4×.</li>
       <li>After $n = 10000$: typical error $\\frac{1.71}{\\sqrt{10000}} = \\frac{1.71}{100} \\approx 0.017$. So $\\overline{X}$ now sits within a couple hundredths of $3.5$.</li>
       <li><b>Punchline:</b> going from $n = 100$ to $n = 10000$ (100× the data) cut the typical error 10×, since $\\sqrt{10000}/\\sqrt{100} = 10$. The average homes in on $3.5$ — and the $\\frac{1}{\\sqrt{n}}$ shrink rate says exactly how fast.</li>
     </ul>`,
  application:
    `<p>Stochastic gradient descent relies on this: a gradient from a small batch is a noisy estimate of the true gradient, but averaging over many steps points the right way. Monte Carlo simulation and A/B testing also depend on the Law of Large Numbers.</p>`,
  whenToUse:
    `<p><b>You lean on the Law of Large Numbers (LLN) whenever you estimate something by averaging many samples</b> — it is the promise that a sample mean converges to the true mean as data grows. Monte Carlo estimation, mini-batch gradients, and A/B test averages all rest on it.</p>
     <p><b>Invoke it over:</b></p>
     <ul>
       <li><b>A single measurement</b> — when one noisy reading is unreliable but its average over many trials is trustworthy.</li>
       <li><b>An analytic integral</b> — when the integral is intractable; averaging random samples (Monte Carlo) estimates it instead.</li>
     </ul>
     <p><b>Don't rely on it when:</b></p>
     <ul>
       <li>Samples are dependent or the distribution has no finite mean (heavy tails) — the average may not converge.</li>
       <li>You need to know <i>how fast</i> it converges or want error bars — that is the CLT (Central Limit Theorem), which the LLN alone doesn't give.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>It says nothing about the rate.</b> "Eventually converges" can mean an enormous sample. For how-many-samples and error bars, use the CLT, not the LLN.</li>
       <li><b>Gambler's fallacy.</b> The LLN does not make outcomes "balance out" in the short run. A streak of tails doesn't make heads due next.</li>
       <li><b>Independence (or weak dependence) required.</b> Strongly correlated samples — autocorrelated time series, repeated near-duplicate rows — break convergence to the true mean.</li>
       <li><b>No finite mean, no convergence.</b> For heavy-tailed data (Cauchy-like), the running average wanders forever. Check that a mean exists.</li>
       <li><b>Biased sampling converges to the wrong number.</b> The LLN converges to the mean <i>of the sampled distribution</i>. If sampling is skewed, you converge confidently to a biased answer.</li>
     </ul>`,
  quiz: {
    q: `You flip a fair coin (true heads rate 0.5). After 100,000 flips, roughly what fraction will be heads, and why?`,
    a: `<p>Very close to 0.5. By the Law of Large Numbers, the sample fraction converges to the true probability as the number of flips grows large.</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-clt",
  demo: function (host) {
    Demos.sampler(host, {
      lo: 1, hi: 6, bins: 24,
      draw1: function () {
        var sum = 0;
        for (var i = 0; i < 5; i++) sum += Math.floor(Math.random() * 6) + 1;
        return sum / 5;
      },
      readout: function (samples, mean) {
        return "Each draw is the <b>mean of 5 die rolls</b>. n = <b>" + samples.length +
          "</b> such means drawn; their average = <b>" + mean.toFixed(3) +
          "</b>. One roll alone is flat (uniform), but the histogram of these sample-means piles into a <b>bell centered at 3.5</b> &mdash; the Central Limit Theorem. The bell narrows as you average more rolls.";
      }
    });
  },
  title: "Central Limit Theorem",
  tagline: "Add up many independent things and the total looks Normal — no matter where they came from.",
  prereqs: ["prob-lln", "prob-normal"],
  bigIdea:
    `<p>Here's the magic: average many independent random things, and the average looks like a bell curve.</p>
     <p>This happens even if each thing came from a weird, non-bell-shaped distribution.</p>
     <p>That is the <b>Central Limit Theorem</b>.</p>
     <p>It explains why the Normal distribution shows up absolutely everywhere.</p>`,
  buildup:
    `<p>The Law of Large Numbers told you the average $\\overline{X}$ converges to $\\mu$.</p>
     <p>The CLT (Central Limit Theorem) goes further: it describes the <i>shape</i> of $\\overline{X}$'s wobble around $\\mu$.</p>
     <p>That shape is Normal, centered at $\\mu$, with a spread that shrinks as $n$ grows.</p>`,
  symbols: [
    { sym: "$\\overline{X}$", desc: "the sample average of $n$ independent samples." },
    { sym: "$\\mu$", desc: "the true mean of each sample (Greek 'mu')." },
    { sym: "$\\sigma^2$", desc: "the variance of one sample." },
    { sym: "$\\sigma^2/n$", desc: "the variance of the AVERAGE — it shrinks as you take more samples." },
    { sym: "$\\approx$", desc: "'is approximately'." },
    { sym: "$\\mathcal{N}(\\mu, \\sigma^2/n)$", desc: "a Normal distribution centered at $\\mu$ with variance $\\sigma^2/n$." }
  ],
  formula: `$$ \\overline{X} \\;\\approx\\; \\mathcal{N}\\!\\left(\\mu,\\; \\frac{\\sigma^2}{n}\\right) \\quad \\text{for large } n $$`,
  whatItDoes:
    `<p>For a large sample size $n$, the sample average $\\overline{X}$ follows a Normal distribution.</p>
     <p>It is centered at the true mean $\\mu$, just like the Law of Large Numbers said.</p>
     <p>Its variance is $\\frac{\\sigma^2}{n}$: more samples means a tighter, narrower bell around $\\mu$.</p>`,
  example:
    `<p>Roll a die. One roll is Uniform (flat, not bell-shaped) with $\\mu = 3.5$ and $\\sigma^2 \\approx 2.92$. Now average $n = 30$ rolls.</p>
     <table class="extable">
       <caption>One roll vs the average of 30 — the CLT bell tightens</caption>
       <thead><tr><th>quantity</th><th>shape</th><th class="num">center</th><th class="num">variance</th></tr></thead>
       <tbody>
         <tr><td class="row-h">one roll $X$</td><td>flat (uniform)</td><td class="num">3.5</td><td class="num">$\\approx 2.92$</td></tr>
         <tr><td class="row-h">average $\\overline{X}$ of 30</td><td>bell (Normal)</td><td class="num">3.5</td><td class="num">$\\frac{2.92}{30} \\approx 0.097$</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>The average $\\overline{X}$ is centered at $\\mu = 3.5$.</li>
       <li>Its variance is $\\frac{\\sigma^2}{n} = \\frac{2.92}{30} \\approx 0.097$, so its spread $\\sigma_{\\overline{X}} = \\sqrt{0.097} \\approx 0.31$.</li>
       <li>Repeat 'average 30 rolls' many times and plot the averages: they form a bell curve, even though one roll is flat.</li>
       <li>That bell is $\\mathcal{N}(3.5,\\, 0.097)$ — the CLT predicted its center and width.</li>
     </ul>`,
  application:
    `<p>The CLT is why confidence intervals and hypothesis tests use the Normal distribution. A/B tests, polling margins of error, and quality control all lean on it. It's the reason measurement noise is so often assumed Normal.</p>`,
  whenToUse:
    `<p><b>You invoke the CLT (Central Limit Theorem) whenever you need the distribution of an average or a sum</b> — it says that mean of enough independent samples is approximately Normal regardless of the underlying shape. It is the justification for confidence intervals, z-tests, and t-tests in A/B testing and polling.</p>
     <p><b>Lean on it over:</b></p>
     <ul>
       <li><b>The LLN (Law of Large Numbers) alone</b> — when you need not just convergence but the <i>spread</i> of the estimate (the $1/\\sqrt{n}$ shrinkage) for error bars.</li>
       <li><b>Modeling raw data as Normal</b> — the CLT licenses Normality for the <i>average</i>, which is what most tests actually use.</li>
     </ul>
     <p><b>Reach for something else when:</b></p>
     <ul>
       <li>The sample is small (n &lt; 30) or skewed — use a t-distribution or a bootstrap instead of the Normal approximation.</li>
       <li>The data is heavy-tailed with infinite variance — the classic CLT fails; you need a generalized (stable) limit or robust methods.</li>
     </ul>`,
  pitfalls:
    `<ul>
       <li><b>It applies to the average, not the data.</b> The sample mean becomes Normal; the individual observations do not. Don't claim raw data is Normal because of the CLT.</li>
       <li><b>"Large enough n" depends on skew.</b> Symmetric data converges fast; highly skewed data may need hundreds of samples before the Normal approximation is good.</li>
       <li><b>Independence is required.</b> Correlated samples (time series, clustered users) shrink the effective sample size, so the naive $1/\\sqrt{n}$ interval is too narrow.</li>
       <li><b>Finite variance is required.</b> Heavy-tailed distributions with infinite variance don't obey the standard CLT — the average won't be Normal.</li>
       <li><b>Peeking and multiple looks.</b> Repeatedly applying a CLT-based test as data trickles in inflates false positives. Use sequential or corrected methods.</li>
       <li><b>Small samples need the t-distribution.</b> Using the Normal instead of Student-$t$ for small $n$ produces over-confident intervals.</li>
     </ul>`,
  quiz: {
    q: `Samples have mean $\\mu = 10$ and variance $\\sigma^2 = 16$. For an average of $n = 4$ samples, what is the variance of $\\overline{X}$?`,
    a: `<p>$\\frac{\\sigma^2}{n} = \\frac{16}{4} = 4$. (So the average's standard deviation is $\\sqrt{4} = 2$, half of the single-sample $\\sigma = 4$.)</p>`
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "prob-estimation",
  demo: function (host) {
    Demos.sampler(host, {
      lo: 1, hi: 6, bins: 6,
      draw1: function () { return Math.floor(Math.random() * 6) + 1; },
      readout: function (samples, mean) {
        var n = samples.length;
        var s2 = 0;
        if (n >= 2) {
          var ss = 0;
          for (var i = 0; i < n; i++) { var d = samples[i] - mean; ss += d * d; }
          s2 = ss / (n - 1);
        }
        return "Rolling a fair die (true mean = 3.5, true variance = 35/12 &asymp; 2.917). " +
          "n = <b>" + n + "</b> draws. Sample mean X&#772; = <b>" + mean.toFixed(3) +
          "</b>. Sample variance s&sup2; (divide by n&minus;1) = <b>" + (n >= 2 ? s2.toFixed(3) : "—") +
          "</b>. Draw more and both estimates settle onto the truth.";
      }
    });
  },
  title: "Parameter estimation",
  tagline: "Guess a distribution's hidden numbers from data. And know when your guess is fair.",
  prereqs: ["prob-expectation", "prob-variance", "prob-lln"],
  bigIdea:
    `<p>The real world doesn't hand you a distribution's true mean or variance.</p>
     <p>You only have data. So you <b>estimate</b> those hidden numbers from samples.</p>
     <p>A good estimate is <b>unbiased</b>: on average, it hits the true value, not consistently too high or low.</p>
     <p>This is the bridge from probability to real statistics.</p>`,
  buildup:
    `<p>Call the true hidden number $\\theta$ (could be a mean, a rate, anything). Your guess from data is $\\hat\\theta$, said 'theta-hat'.</p>
     <p>The <b>bias</b> is how far off your guess is on average: $E[\\hat\\theta] - \\theta$. Zero bias is ideal.</p>
     <p>The sample mean estimates the true mean. The sample variance estimates the true variance — but it needs a sneaky fix.</p>`,
  symbols: [
    { sym: "$\\theta$", desc: "the true, unknown parameter (Greek 'theta'). What we want to know." },
    { sym: "$\\hat\\theta$", desc: "the estimator: our data-based guess of $\\theta$. The 'hat' means 'estimate of'." },
    { sym: "bias", desc: "$E[\\hat\\theta] - \\theta$: how far the guess is off on average. 0 = unbiased." },
    { sym: "$\\overline{X}$", desc: "the sample mean: average of the data. Estimates the true mean." },
    { sym: "$s^2$", desc: "the sample variance: our estimate of the true variance." },
    { sym: "$n - 1$", desc: "the divisor in $s^2$ (NOT $n$). This correction makes the estimate unbiased." }
  ],
  formula: `$$ \\overline{X} = \\frac{1}{n}\\sum_{i=1}^{n} X_i \\qquad s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}\\big(X_i - \\overline{X}\\big)^2 \\qquad \\text{bias} = E[\\hat\\theta] - \\theta $$`,
  whatItDoes:
    `<p>$\\overline{X}$ averages your data to estimate the true mean. It's unbiased.</p>
     <p>$s^2$ averages the squared distances from $\\overline{X}$ to estimate the variance — but divides by $n - 1$, not $n$.</p>
     <p>Why $n-1$? The data looks a little too close to its OWN average $\\overline{X}$, which slightly underestimates the true spread. Dividing by the smaller $n-1$ corrects exactly for that, making $s^2$ unbiased.</p>`,
  example:
    `<p>Data: $\\{2, 4, 6\\}$. Estimate the mean and variance.</p>
     <table class="extable">
       <caption>Squared-distance ledger around $\\overline{X} = 4$</caption>
       <thead><tr><th class="num">$X_i$</th><th class="num">$X_i - \\overline{X}$</th><th class="num">$(X_i - \\overline{X})^2$</th></tr></thead>
       <tbody>
         <tr><td class="num">2</td><td class="num">$-2$</td><td class="num">4</td></tr>
         <tr><td class="num">4</td><td class="num">0</td><td class="num">0</td></tr>
         <tr><td class="num">6</td><td class="num">$+2$</td><td class="num">4</td></tr>
         <tr><td class="row-h">sum</td><td class="num">0</td><td class="num">8</td></tr>
       </tbody>
     </table>
     <ul class="steps">
       <li>Sample mean: $\\overline{X} = \\frac{2 + 4 + 6}{3} = \\frac{12}{3} = 4$.</li>
       <li>Sum of squared distances from 4 is $4 + 0 + 4 = 8$.</li>
       <li>Sample variance (divide by $n - 1 = 2$): $s^2 = \\frac{8}{2} = 4$. ← unbiased.</li>
       <li>Divide wrongly by $n = 3$: $\\frac{8}{3} \\approx 2.67$ — too small. The $n-1$ fix corrects this downward bias.</li>
     </ul>`,
  application:
    `<p>Every statistic computed from a dataset is an estimator: a model's accuracy, a feature's average, an A/B test's lift. Understanding bias keeps you from being fooled by your own measurements. Maximum likelihood estimation generalizes this idea to fit entire models.</p>`,
  whenToUse:
    `<p><b>You think in terms of estimators (bias, variance, consistency) whenever a number you report is computed from a finite sample</b> — a model's accuracy, a feature mean, an A/B lift. The framing tells you how much to trust that number and whether it's systematically off.</p>
     <p><b>Use this lens over:</b></p>
     <ul>
       <li><b>Treating a sample statistic as ground truth</b> — when n is finite; every estimate carries variance and possibly bias you should quantify.</li>
       <li><b>Point estimates alone</b> — when decisions ride on the number; pair it with a standard error or confidence interval.</li>
     </ul>
     <p><b>Choose a specific estimator when:</b> you can write a likelihood — use MLE (Maximum Likelihood Estimation) to fit whole models. Reach for a Bayesian estimator (a posterior mean) when you have prior information or little data; reach for a robust estimator (median, trimmed mean) when outliers are present.</p>`,
  pitfalls:
    `<ul>
       <li><b>The bias–variance tradeoff.</b> An unbiased estimator can have huge variance; a slightly biased one (regularized) often predicts better. Don't chase unbiasedness blindly.</li>
       <li><b>Evaluating on training data.</b> A model's accuracy measured on the data it was fit to is an optimistically biased estimator. Always hold out a test set.</li>
       <li><b>Small samples, wild estimates.</b> Statistics from n &lt; 30 are high-variance. Report uncertainty; don't act on a noisy point estimate.</li>
       <li><b>Sampling bias dooms the estimate.</b> If the sample isn't representative, even infinite data converges to the wrong value. Audit how the data was collected.</li>
       <li><b>Plug-in bias.</b> Some quantities (variance with $1/n$, ratios) are biased even on clean data. Use the bias-corrected form ($1/(n-1)$) or a bootstrap correction.</li>
       <li><b>Multiple testing inflates lift.</b> Picking the best of many A/B variants overstates the winner's effect (the winner's curse). Correct for selection.</li>
     </ul>`,
  quiz: {
    q: `For the data $\\{1, 3\\}$, compute the sample mean and the sample variance $s^2$ (using $n-1$).`,
    a: `<p>Mean $= \\frac{1+3}{2} = 2$. Squared distances: $(1-2)^2 = 1$ and $(3-2)^2 = 1$, sum $= 2$. Divide by $n-1 = 1$: $s^2 = \\frac{2}{1} = 2$.</p>`
  }
});

})();
