/* Rigorous Courses · Diffusion Models — Part 02: Probability: the language of clouds.
   Owns random variables, PMF/PDF, joint/marginal/conditional, independence, Bayes' rule,
   expectation, variance, linearity, LOTUS, and Monte-Carlo averaging — all from zero. */
(function () {
  window.LESSONS.push({
    id: "diff-02-probability",
    title: "Part 2 — Probability: the language of clouds",
    tagline: "Random variables, joint tables, Bayes' rule, expectation, and variance — the toolkit every later part speaks in",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 2,
    partTotal: 12,
    prereqs: ["diff-01-generative-modeling"],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Read and write the notation $p(x)$, $p(x, y)$, and $p(y \\mid x)$, and say what each one means in an ordinary English sentence.</li>
        <li>Compute marginals, conditionals, and a Bayes flip from a small joint table by hand — and check your answers by counting.</li>
        <li>Compute the expectation and variance of any small probability table, and use the three workhorse rules: linearity of expectation, $\\mathrm{Var}(aX+b) = a^2\\,\\mathrm{Var}(X)$, and "variances add for independent variables".</li>
        <li>Point to the exact step in the variance-addition derivation where independence is used — and produce a dependent pair where the rule fails.</li>
        <li>Explain why averaging many samples estimates an expectation, and how fast the error shrinks as you take more samples.</li>
      </ul>`,
    sections: [
      {
        h: "Where we are",
        body: `<p>Part 1 gave us the picture. An image is a list of numbers, so it is one point in a huge space. A dataset is a cloud of such points. Realistic images live in a few crowded regions of that space, and almost all of the space is empty static. And <b>generating</b> means producing a brand-new point by following the cloud's rule — the rule that says which regions are likely and which are not. That phrase, "the cloud's rule," was deliberately informal. We used it, we drew pictures of it, but we never said what kind of mathematical object it is.</p>
        <p>This part fixes that. The cloud's rule is a <b>probability distribution</b>, and this part builds, from zero, every probability tool the rest of the course stands on. Nothing here is filler — each tool has a scheduled job later. Conditional probability is the grammar of the noising recipe $q(x_t \\mid x_{t-1})$ in part 6. Bayes' rule is the machine that flips forward noising into reverse denoising in part 7. The variance rules are the entire bookkeeping of the forward process, including the strange-looking $\\sqrt{1-\\beta_t}$ factor (here $\\beta_t$ is the small noise dose that step $t$ adds — part 6 defines it properly; you only need to know it is a number between 0 and 1). Expectation is the outer shell of the training loss in part 9. And Monte-Carlo averaging is the reason training on small random batches works at all in part 10. We start with dice and tickets — small enough to count by hand — because every rule we prove on a six-row table holds unchanged for the 784-dimensional image clouds of part 1.</p>`
      },
      {
        h: "Random variables: numbers with a spread",
        body: `<p>Start with the most familiar random thing there is: a six-sided die. Before you roll it, you do not know what number will come up. After you roll it, you get one specific result — a 4, say. Each possible result is called an <b>outcome</b>. There are six outcomes here: 1, 2, 3, 4, 5, 6.</p>
        <p>A <b>random variable</b> is a number whose value is decided by chance. Think of it as a machine that, when asked, produces one number. The die-about-to-be-rolled is a random variable. We write random variables with capital letters, like $X$, and we write the particular values they might take with lowercase letters, like $x$. So "$X = 4$" reads as "the roll came up 4". The capital letter is the machine; the lowercase letter is one thing the machine might output.</p>
        <p>The <b>probability</b> of an outcome is the fraction of the time it would occur if you repeated the random situation an enormous number of times. For a fair die, each face comes up $1/6$ of the time. We can record the whole behavior of $X$ in a table:</p>
        <table class="symbols">
          <tr><td><b>value $x$</b></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>
          <tr><td><b>probability $p(x)$</b></td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td></tr>
        </table>
        <p>This table is called the <b>probability mass function</b>, or <b>PMF</b>. The name is less scary than it sounds: it is a table that says how much probability "mass" sits on each value. The notation $p(x)$ is shorthand for "the probability that $X$ equals the value $x$". Tables do not have to be flat. A loaded die might have the table $p = (0.25,\\ 0.15,\\ 0.15,\\ 0.15,\\ 0.15,\\ 0.15)$ — the 1 face is heavier than the rest. Any table of numbers is a legal PMF as long as it obeys two rules:</p>
        <div class="formula-box">$$p(x) \\ge 0 \\quad \\text{for every } x, \\qquad \\sum_x p(x) = 1$$</div>
        <p><b>Read it out loud:</b> every probability is zero or positive — you cannot have a negative chance of anything — and if you add up the probabilities of all possible values, the total is exactly 1, because some value must occur. The symbol $\\sum_x$ means "add up, once for each possible value $x$". Check the loaded die: $0.25 + 5 \\times 0.15 = 0.25 + 0.75 = 1$. It passes.</p>
        <p>Why do we care, in a course about images? Because the generator we are building is a random variable. Ask it for an image and it produces a list of 784 numbers, decided partly by chance. "The cloud's rule" from part 1 is exactly this kind of table — one entry per possible image — except the set of possible images is so astronomically large that we will need the continuous version next.</p>`
      },
      {
        h: "From tables to curves: continuous variables",
        body: `<p>A die has six outcomes, so a six-column table describes it completely. Now picture a fair spinner: a needle you flick, which comes to rest at some position around a circle marked from 0 to 1. The result $X$ can be 0.5, or 0.4999, or 0.500001, or any of the infinitely many numbers in between. No finite table can list them all. Random variables like this are called <b>continuous</b>.</p>
        <p>Here is the surprise that trips everyone up once: for the spinner, the probability of landing on <b>exactly</b> 0.5 is zero. Here is the argument. By symmetry, every exact position is equally likely. Suppose each exact position had some probability bigger than zero — even one-in-a-trillion. There are infinitely many disjoint positions, so adding up their probabilities would pass 1 and keep going forever, breaking the sum-to-1 rule. The only consistent assignment is zero for every single exact value. And yet the needle certainly lands somewhere. The resolution: for continuous variables, probability does not live on individual points. It lives on <b>intervals</b>. "Exactly 0.5" has probability zero, but "between 0.4 and 0.6" has probability 0.2 for the fair spinner — a perfectly ordinary number.</p>
        <p>To describe where the probability is concentrated, we use a <b>density</b>, also written $p(x)$ and also called the <b>PDF</b> (probability density function). Density is <b>probability per unit length</b>: the curve is high where landing is likely and low where it is rare, and the probability of an interval is the <b>area under the curve</b> over that interval. You can picture it as a histogram whose bars have been made thinner and thinner until they merge into a smooth curve.</p>
        <div class="formula-box">$$P(a \\le X \\le b) = \\int_a^b p(x)\\, dx$$</div>
        <p><b>Read it out loud:</b> the probability that $X$ lands somewhere between $a$ and $b$ is the area under the density curve from $a$ to $b$. The elongated-S symbol $\\int_a^b$ is not a mystery operation — it means "slice the stretch from $a$ to $b$ into many thin slivers, take each sliver's height $p(x)$ times its tiny width $dx$, and add all those sliver areas up". It is a sum of areas, written compactly. That accumulated-area meaning is all this course will ever ask of the integral sign.</p>
        <p>One consequence surprises people: <b>a density can be bigger than 1</b>. Take a spinner that only lands between 0 and $1/2$, uniformly. The total area under its density must be 1, and the base of the region is only $1/2$ wide, so the height must be 2: a flat density of 2 on $[0, 1/2]$ and 0 everywhere else. Check the area: height $\\times$ width $= 2 \\times \\tfrac{1}{2} = 1$. Correct. And no probability ever exceeds 1: the interval $[0.1, 0.3]$ has probability $2 \\times 0.2 = 0.4$, and even the whole interval $[0, 1/2]$ only reaches $2 \\times 0.5 = 1$. The height 2 is fine because density is a <b>rate</b>, not a probability — the same way a car can move at 120 km/h during a trip that only covers 60 km. Rates can exceed the totals they accumulate. Only areas are probabilities.</p>
        <p>The image clouds of part 1 are described by densities like this — one density over a 784-dimensional space, high on the crowded regions of realistic images and nearly zero on static. We cannot draw that one, but every rule we learn on the number line carries over.</p>`
      },
      {
        h: "Several random things at once",
        body: `<p>Diffusion models constantly juggle several random quantities at once: the clean image, the noisy image, the noise itself. So we need the grammar for "two random variables together". We will build it by counting, on an example small enough to hold in your head — and this exact table is the running example for the rest of the part and for the notebook.</p>
        <p>A box holds 100 raffle tickets. Each ticket has two numbers printed on it: an $x$ that is 0 or 1, and a $y$ that is 1, 2, or 3. The counts:</p>
        <table class="symbols">
          <tr><td></td><td><b>$y=1$</b></td><td><b>$y=2$</b></td><td><b>$y=3$</b></td></tr>
          <tr><td><b>$x=0$</b></td><td>10 tickets</td><td>20 tickets</td><td>10 tickets</td></tr>
          <tr><td><b>$x=1$</b></td><td>30 tickets</td><td>10 tickets</td><td>20 tickets</td></tr>
        </table>
        <p>Draw one ticket at random. The pair $(X, Y)$ is two random variables produced by one random act. The <b>joint probability</b> $p(x, y)$ is the chance of a particular pair — count over total. Dividing every count by 100 gives the joint table, with the row and column sums written in the margins:</p>
        <table class="symbols">
          <tr><td></td><td><b>$y=1$</b></td><td><b>$y=2$</b></td><td><b>$y=3$</b></td><td><b>row sum $=p(x)$</b></td></tr>
          <tr><td><b>$x=0$</b></td><td>0.10</td><td>0.20</td><td>0.10</td><td><b>0.40</b></td></tr>
          <tr><td><b>$x=1$</b></td><td>0.30</td><td>0.10</td><td>0.20</td><td><b>0.60</b></td></tr>
          <tr><td><b>column sum $=p(y)$</b></td><td><b>0.40</b></td><td><b>0.30</b></td><td><b>0.30</b></td><td><b>1.00</b></td></tr>
        </table>
        <p>Two questions you can ask this table:</p>
        <p><b>Question 1: what is the probability that $x = 0$, ignoring $y$ entirely?</b> Count the tickets: $10 + 20 + 10 = 40$ of the 100 tickets have $x = 0$, so the answer is 0.40 — the row sum. A probability obtained this way is called a <b>marginal</b> probability, named for the humble reason that you write it in the margin of the table.</p>
        <div class="formula-box">$$p(x) = \\sum_y p(x, y)$$</div>
        <p><b>Read it out loud:</b> to get the probability of a particular $x$ on its own, add up the joint probabilities of that $x$ paired with every possible $y$. You are summing away the variable you do not care about.</p>
        <p><b>Question 2: someone peeks at your ticket and tells you $x = 0$. Now what are the odds that $y = 2$?</b> The information changes things: you are no longer drawing from all 100 tickets but effectively from the 40 tickets with $x = 0$. Among those 40, exactly 20 have $y = 2$, so the answer is $20/40 = 0.50$. A probability updated by information like this is called a <b>conditional</b> probability, written $p(y \\mid x)$ — the vertical bar reads as "given".</p>
        <div class="formula-box">$$p(y \\mid x) = \\frac{p(x, y)}{p(x)}$$</div>
        <p><b>Read it out loud:</b> the probability of $y$ once you know $x$ is the joint probability of the pair, divided by the probability of the $x$ you were told. Notice this is exactly our count computation in disguise: $\\frac{20/100}{40/100} = \\frac{20}{40}$ — the 100s cancel. A conditional is a <b>slice of the table, rescaled</b>. Take the $x=0$ row: $(0.10,\\ 0.20,\\ 0.10)$. It sums to 0.40, so it is not a legal PMF on its own. Divide the whole row by 0.40 and you get $(0.25,\\ 0.50,\\ 0.25)$, which sums to 1 — a fully legitimate probability table for $y$ in the world where $x = 0$ is known.</p>
        <p>Finally, the most important structural question you can ask of two random variables: does knowing one tell you anything about the other? $X$ and $Y$ are called <b>independent</b> if $p(x, y) = p(x)\\,p(y)$ for every single cell — the joint is the product of the margins, so conditioning changes nothing. Test our table at the cell $(x{=}0, y{=}1)$: the joint says 0.10, but the product of marginals says $0.40 \\times 0.40 = 0.16$. Not equal, so these two are <b>dependent</b>: learning $x$ genuinely shifts the odds of $y$. Concretely, $p(y{=}1) = 0.40$ before any information, but $p(y{=}1 \\mid x{=}1) = 0.30/0.60 = 0.50$ after hearing $x = 1$.</p>
        <p>Hold on to both ideas. The fixed noising recipe of part 6 is a conditional, $q(x_t \\mid x_{t-1})$: "given the current noisy image, here is the rule for the next one". And independence is the load-bearing assumption behind the variance arithmetic coming two sections from now.</p>`
      },
      {
        h: "Bayes' rule: flipping the direction of knowledge",
        body: `<p>Conditionals have a direction. Often the world hands you the easy direction and you need the other one. A medical test is the classic case: the test's manufacturer tells you $p(\\text{positive} \\mid \\text{sick})$ — how the test behaves given the disease. But a patient holding a positive result needs $p(\\text{sick} \\mid \\text{positive})$ — the disease given the test. Those are different numbers, and confusing them is one of the most consequential mistakes in applied probability. <b>Bayes' rule</b> converts one into the other, and we can derive it in three moves from the conditional definition alone.</p>
        <ol>
          <li><b>Multiply the conditional definition through by $p(x)$.</b> The definition $p(y \\mid x) = p(x, y)/p(x)$ becomes $p(x, y) = p(y \\mid x)\\,p(x)$. This is allowed because $p(x) > 0$ (we only condition on things that can happen), and multiplying both sides of an equation by the same nonzero number preserves it.</li>
          <li><b>Write the same joint the other way around.</b> The definition applies with the roles of the variables swapped: $p(x, y) = p(x \\mid y)\\,p(y)$. The joint probability of a pair does not care which member you name first, so both expressions equal the same number.</li>
          <li><b>Set the two expressions equal and divide by $p(y)$.</b> From $p(x \\mid y)\\,p(y) = p(y \\mid x)\\,p(x)$, dividing both sides by $p(y)$ (again positive) isolates the conditional we want.</li>
        </ol>
        <div class="formula-box">$$p(x \\mid y) = \\frac{p(y \\mid x)\\; p(x)}{p(y)}$$</div>
        <p><b>Read it out loud:</b> to reverse the direction of a conditional, take the forward conditional, weight it by how likely $x$ was before you learned anything, and divide by the overall probability of the $y$ you actually observed. Three ingredients: the forward rule, the prior odds, and a normalizer.</p>
        <p>Now the worked example, done first by pure counting so you can trust it. A disease affects 1% of a population. The test catches 99% of sick people (a positive result), but also falsely alarms on 5% of healthy people. You test positive. How worried should you be? Follow 10,000 people:</p>
        <ul>
          <li>1% of 10,000 are sick: <b>100 sick</b>, 9,900 healthy.</li>
          <li>Of the 100 sick, 99% test positive: <b>99 true positives</b>, 1 sick person slips through.</li>
          <li>Of the 9,900 healthy, 5% test positive: $0.05 \\times 9{,}900 = $ <b>495 false positives</b>.</li>
        </ul>
        <table class="symbols">
          <tr><td></td><td><b>tests positive</b></td><td><b>tests negative</b></td><td><b>total</b></td></tr>
          <tr><td><b>sick</b></td><td>99</td><td>1</td><td>100</td></tr>
          <tr><td><b>healthy</b></td><td>495</td><td>9,405</td><td>9,900</td></tr>
          <tr><td><b>total</b></td><td>594</td><td>9,406</td><td>10,000</td></tr>
        </table>
        <p>Everyone who tested positive is in the first column: $99 + 495 = 594$ people, of whom only 99 are sick. So $p(\\text{sick} \\mid \\text{positive}) = 99/594 = 1/6 \\approx 0.167$. A positive result from a 99%-sensitive test leaves you with only a one-in-six chance of being sick — because healthy people so vastly outnumber sick ones that their rare false alarms still swamp the true alarms. Now check that the formula says the same thing: $p(\\text{positive}) = 0.99 \\times 0.01 + 0.05 \\times 0.99 = 0.0099 + 0.0495 = 0.0594$, and $p(\\text{sick} \\mid \\text{positive}) = \\frac{0.99 \\times 0.01}{0.0594} = \\frac{0.0099}{0.0594} = 1/6$. Counting and formula agree exactly — they always do, because the formula is the counting argument written once and for all.</p>
        <p>Why this rule sits at the heart of the course: in diffusion we <b>design</b> the forward direction — the noising recipe $q(x_t \\mid x_{t-1})$ is a conditional we choose and therefore know perfectly. Generation needs the reverse direction: given the noisier image, what was the less-noisy one? That is a Bayes flip. Part 7 performs it with Gaussian densities in place of this section's counts (plus one extra trick — conditioning on the clean image), and out falls the exact denoising step. If you want more reps on the rule itself, <a onclick="App.open('prob-bayes')">Bayes' rule</a> has extra practice.</p>`
      },
      {
        h: "Expectation: the long-run average",
        body: `<p>Suppose you play a game: roll the fair die, win the face value in dollars. Some rolls pay $1, some pay $6. What is the game worth per play, on average, in the long run? Intuitively: each face contributes its value weighted by how often it occurs. That weighted average is called the <b>expectation</b> (or <b>expected value</b>, or <b>mean</b>) of the random variable.</p>
        <div class="formula-box">$$\\mathbb{E}[X] = \\sum_x x\\; p(x)$$</div>
        <p><b>Read it out loud:</b> the expectation of $X$ is each possible value, times the probability of that value, all added up — a probability-weighted average. For the fair die: $\\mathbb{E}[X] = \\tfrac{1}{6}(1+2+3+4+5+6) = \\tfrac{21}{6} = 3.5$. Notice that 3.5 is not a possible roll. Expectation is not "the most likely value"; it is the long-run average of many plays, and it is allowed to sit between the outcomes.</p>
        <p>For our ticket table, using the marginals: $\\mathbb{E}[X] = 0 \\times 0.40 + 1 \\times 0.60 = 0.60$, and $\\mathbb{E}[Y] = 1 \\times 0.40 + 2 \\times 0.30 + 3 \\times 0.30 = 0.40 + 0.60 + 0.90 = 1.90$.</p>
        <p>Often we need the average of a <b>function</b> of a random variable — say $X^2$ instead of $X$. There is a wonderfully lazy shortcut: you do not need to work out the distribution of $X^2$ at all. Run each value through the function first, then take the same weighted average. This fact has the joke name <b>LOTUS</b> — the "law of the unconscious statistician" — because people use it without noticing it needs stating:</p>
        <div class="formula-box">$$\\mathbb{E}[f(X)] = \\sum_x f(x)\\; p(x)$$</div>
        <p><b>Read it out loud:</b> the average of $f$-of-$X$ is: apply $f$ to each possible value, weight by that value's probability, add up. Check it on the die with $f(x) = x^2$: $\\mathbb{E}[X^2] = \\tfrac{1}{6}(1+4+9+16+25+36) = \\tfrac{91}{6} \\approx 15.17$. And note the trap it saves you from: $(\\mathbb{E}[X])^2 = 3.5^2 = 12.25$, a different number. Averaging then squaring is not squaring then averaging — the average of $f(X)$ is generally not $f$ of the average.</p>
        <p>Now the single most-used fact in this entire course: expectation passes through sums and scalings untouched. This is called <b>linearity of expectation</b>. Let us derive $\\mathbb{E}[X + Y] = \\mathbb{E}[X] + \\mathbb{E}[Y]$ for our two ticket numbers, one operation per step. The average of the sum over the whole table is $\\mathbb{E}[X+Y] = \\sum_{x,y} (x + y)\\, p(x, y)$ — that is LOTUS applied to the pair, with $f(x,y) = x + y$.</p>
        <ol>
          <li><b>Split the sum in two.</b> Each term $(x+y)\\,p(x,y)$ equals $x\\,p(x,y) + y\\,p(x,y)$, so the whole sum splits: $\\sum_{x,y} x\\, p(x,y) + \\sum_{x,y} y\\, p(x,y)$. Allowed because a finite sum can be regrouped in any order.</li>
          <li><b>In the first sum, do the $y$-part of the summation first.</b> While $y$ runs over its values, $x$ is a fixed number, so it factors out of the inner sum: $\\sum_x x \\sum_y p(x, y)$. Allowed because a common factor can be pulled out of a sum.</li>
          <li><b>Recognize the inner sum as a marginal.</b> $\\sum_y p(x, y) = p(x)$ — that is the marginal rule from two sections ago. The first sum is now $\\sum_x x\\, p(x)$, which is the definition of $\\mathbb{E}[X]$.</li>
          <li><b>Repeat the same two moves on the second sum</b> (factor out $y$, recognize $\\sum_x p(x,y) = p(y)$), giving $\\mathbb{E}[Y]$.</li>
        </ol>
        <p>Look hard at what we did <b>not</b> use: independence. Nowhere. The derivation only regrouped a finite sum and used the marginal rule. Verify on our thoroughly dependent table by brute force over all six cells: $\\mathbb{E}[X+Y] = 1(0.10) + 2(0.20) + 3(0.10) + 2(0.30) + 3(0.10) + 4(0.20) = 0.10 + 0.40 + 0.30 + 0.60 + 0.30 + 0.80 = 2.50$. And $\\mathbb{E}[X] + \\mathbb{E}[Y] = 0.60 + 1.90 = 2.50$. It holds. The same argument with constant multipliers gives the full statement:</p>
        <div class="formula-box">$$\\mathbb{E}[aX + bY] = a\\,\\mathbb{E}[X] + b\\,\\mathbb{E}[Y]$$</div>
        <p><b>Read it out loud:</b> the average of a weighted sum is the weighted sum of the averages — always, whether or not the variables have anything to do with each other. Two special cases you will use constantly: $\\mathbb{E}[cX] = c\\,\\mathbb{E}[X]$ (constants slide out), and $\\mathbb{E}[c] = c$ (the average of a constant is itself).</p>`
      },
      {
        h: "Variance: the typical spread",
        body: `<p>Two games can have the same average and feel completely different. Game A: you always win $3.50$. Game B: half the time you win $0$, half the time $7$. Both average $3.50$, but B is a gamble and A is a salary. The missing ingredient is <b>spread</b>: how far from its mean the variable typically lands.</p>
        <p>A first attempt: average the deviation $X - \\mu$, where $\\mu$ is shorthand for $\\mathbb{E}[X]$. This fails instantly — by linearity, $\\mathbb{E}[X - \\mu] = \\mathbb{E}[X] - \\mu = 0$ for every random variable, because overshoots and undershoots cancel exactly. The fix: square the deviation first, so both directions count as positive. The result is the <b>variance</b>:</p>
        <div class="formula-box">$$\\mathrm{Var}(X) = \\mathbb{E}\\!\\left[(X - \\mu)^2\\right]$$</div>
        <p><b>Read it out loud:</b> variance is the average squared distance between $X$ and its own mean. Big variance: the variable roams far from home. Zero variance: it is a constant. Because of the squaring, variance carries squared units (dollars-squared, pixels-squared); its square root, the <b>standard deviation</b>, is the "typical distance from the mean" in original units. For the fair die, the variance works out to $35/12 \\approx 2.92$, so the standard deviation is about $1.71$: a roll typically lands within a couple of units of 3.5.</p>
        <p>Computing $\\mathbb{E}[(X-\\mu)^2]$ directly means subtracting $\\mu$ from every value before squaring. There is a shortcut, and its derivation is a two-line showcase of linearity. Start from the definition and do one operation per step:</p>
        <ol>
          <li><b>Expand the square.</b> $(X - \\mu)^2 = X^2 - 2\\mu X + \\mu^2$. Pure algebra on the inside of the expectation.</li>
          <li><b>Apply expectation to each term.</b> $\\mathbb{E}[X^2 - 2\\mu X + \\mu^2] = \\mathbb{E}[X^2] - 2\\mu\\,\\mathbb{E}[X] + \\mu^2$. Allowed by linearity: $\\mu$ is a fixed number, so $2\\mu$ slides out of the middle term and the constant $\\mu^2$ averages to itself.</li>
          <li><b>Substitute $\\mathbb{E}[X] = \\mu$.</b> The middle term becomes $-2\\mu^2$, giving $\\mathbb{E}[X^2] - 2\\mu^2 + \\mu^2$. That is the definition of $\\mu$ being used.</li>
          <li><b>Combine like terms.</b> $-2\\mu^2 + \\mu^2 = -\\mu^2$.</li>
        </ol>
        <div class="formula-box">$$\\mathrm{Var}(X) = \\mathbb{E}[X^2] - \\mu^2$$</div>
        <p><b>Read it out loud:</b> variance is the average of the square, minus the square of the average. Sanity-check it on the die: $\\mathbb{E}[X^2] = 91/6 \\approx 15.167$ and $\\mu^2 = 12.25$, so $\\mathrm{Var} = 15.167 - 12.25 = 2.917 = 35/12$. It matches the direct computation. For the ticket table: $\\mathrm{Var}(X) = 0.60 - 0.60^2 = 0.24$ and $\\mathrm{Var}(Y) = 4.30 - 1.90^2 = 4.30 - 3.61 = 0.69$ (where $\\mathbb{E}[Y^2] = 1(0.4) + 4(0.3) + 9(0.3) = 4.30$ by LOTUS).</p>
        <p>Next: what does variance do under shifting and scaling? Take $aX + b$, one operation per step:</p>
        <ol>
          <li><b>Find the mean of $aX + b$.</b> By linearity it is $a\\mu + b$.</li>
          <li><b>Form the deviation.</b> $(aX + b) - (a\\mu + b) = a(X - \\mu)$. The $b$'s cancel: shifting moves the variable and its mean by the same amount, so the distance between them is untouched.</li>
          <li><b>Square the deviation.</b> $\\big(a(X-\\mu)\\big)^2 = a^2 (X - \\mu)^2$. Squaring a product squares each factor.</li>
          <li><b>Take the expectation.</b> The constant $a^2$ slides out by linearity, leaving $a^2\\, \\mathbb{E}[(X-\\mu)^2]$.</li>
        </ol>
        <div class="formula-box">$$\\mathrm{Var}(aX + b) = a^2\\, \\mathrm{Var}(X)$$</div>
        <p><b>Read it out loud:</b> shifting a random quantity does not change its spread at all — the $b$ vanishes — and scaling it by $a$ multiplies the variance by $a$ squared, because variance lives in squared units. Quick check: doubling a die roll doubles the typical distance from the mean, hence four times the variance.</p>
        <p>Now the rule this entire course runs on. For the sum of two random variables, one operation per step (write $\\mu_X = \\mathbb{E}[X]$, $\\mu_Y = \\mathbb{E}[Y]$):</p>
        <ol>
          <li><b>Mean of the sum.</b> By linearity, $\\mathbb{E}[X + Y] = \\mu_X + \\mu_Y$.</li>
          <li><b>Deviation of the sum.</b> $(X + Y) - (\\mu_X + \\mu_Y) = (X - \\mu_X) + (Y - \\mu_Y)$. Regrouping only.</li>
          <li><b>Square it.</b> $(X-\\mu_X)^2 + 2(X-\\mu_X)(Y-\\mu_Y) + (Y-\\mu_Y)^2$. The binomial expansion — algebra again.</li>
          <li><b>Average each of the three terms.</b> By linearity: $\\mathrm{Var}(X) + 2\\,\\mathbb{E}[(X-\\mu_X)(Y-\\mu_Y)] + \\mathrm{Var}(Y)$. The middle expectation is important enough to have a name: the <b>covariance</b>, $\\mathrm{Cov}(X, Y)$ — the average of "both deviations multiplied", which is positive when the two tend to overshoot together and negative when one overshoots while the other undershoots.</li>
          <li><b>THIS is where independence enters — nowhere before.</b> For independent random variables, the average of a product is the product of the averages: $\\mathbb{E}[UV] = \\mathbb{E}[U]\\,\\mathbb{E}[V]$ (the joint splits as $p(u)p(v)$, so the double sum factors into two separate sums; the notebook checks this numerically). Applying it: $\\mathrm{Cov}(X,Y) = \\mathbb{E}[X-\\mu_X]\\cdot\\mathbb{E}[Y-\\mu_Y] = 0 \\cdot 0 = 0$. The cross term dies.</li>
        </ol>
        <div class="formula-box">$$\\mathrm{Var}(X + Y) = \\mathrm{Var}(X) + \\mathrm{Var}(Y) \\qquad \\text{when } X, Y \\text{ are independent}$$</div>
        <p><b>Read it out loud:</b> for independent random variables, spreads — measured as variances, not standard deviations — add up. And the derivation tells you exactly what you are owed when independence fails: the correction term $2\\,\\mathrm{Cov}(X, Y)$. Our dependent ticket table demonstrates the failure with real numbers. Direct computation over the six cells gives $\\mathbb{E}[(X+Y)^2] = 7.10$, so $\\mathrm{Var}(X+Y) = 7.10 - 2.50^2 = 0.85$. But $\\mathrm{Var}(X) + \\mathrm{Var}(Y) = 0.24 + 0.69 = 0.93$. The shortfall is $-0.08$ — and indeed $\\mathrm{Cov}(X,Y) = \\mathbb{E}[XY] - \\mu_X\\mu_Y = 1.10 - 1.14 = -0.04$, so $2\\,\\mathrm{Cov} = -0.08$ accounts for it to the last decimal.</p>
        <p>Why this is the course's workhorse: in part 6, every noising step adds <b>fresh, independent</b> noise to the image. Tracking how much total noise has accumulated by step $t$ — including why the recipe multiplies by the odd factor $\\sqrt{1-\\beta_t}$, where $\\beta_t$ is step $t$'s small noise dose (part 6's headline symbol) — is this addition rule applied over and over, plus the scaling rule you proved above. When you meet that algebra, it will already be an old friend.</p>`
      },
      {
        h: "Estimating expectations by sampling",
        body: `<p>Every expectation so far came from a table we could enumerate. For images there is no such table: the training loss of part 9 is an expectation over all possible clean images, all timesteps, and all noise draws. Nobody can sum that. But there is a beautiful escape hatch: <b>you can estimate any expectation by averaging samples</b>. Roll the die 1,000 times and average the results; you will get something close to 3.5 without ever writing down the PMF. This idea is called <b>Monte-Carlo estimation</b>, after the casino.</p>
        <div class="formula-box">$$\\bar{X}_n = \\frac{1}{n} \\sum_{i=1}^{n} X_i$$</div>
        <p><b>Read it out loud:</b> draw $n$ independent samples $X_1, \\dots, X_n$ from the same distribution, add them up, divide by $n$ — the ordinary average, now wearing the formal name "sample mean". The <b>law of large numbers</b> says, in words: as $n$ grows, this average settles down onto the true expectation $\\mathbb{E}[X]$. The full proof is beyond this course, but the two rules you derived in the last two sections let us compute exactly how fast the settling happens — a genuinely satisfying payoff. One operation per step:</p>
        <ol>
          <li><b>The estimate is centered on the truth.</b> $\\mathbb{E}[\\bar{X}_n] = \\tfrac{1}{n}\\big(\\mathbb{E}[X_1] + \\cdots + \\mathbb{E}[X_n]\\big) = \\tfrac{1}{n}(n\\mu) = \\mu$. Linearity alone — no independence needed. On average, the average is right.</li>
          <li><b>Variance of the sum.</b> The samples are independent, so the addition rule applies $n-1$ times: $\\mathrm{Var}(X_1 + \\cdots + X_n) = n\\,\\mathrm{Var}(X)$.</li>
          <li><b>Variance of the average.</b> The average is the sum scaled by $a = 1/n$, so the scaling rule gives $\\mathrm{Var}(\\bar{X}_n) = \\tfrac{1}{n^2} \\cdot n\\,\\mathrm{Var}(X)$.</li>
          <li><b>Simplify the fraction.</b> $\\tfrac{n}{n^2} = \\tfrac{1}{n}$.</li>
        </ol>
        <div class="formula-box">$$\\mathrm{Var}(\\bar{X}_n) = \\frac{\\mathrm{Var}(X)}{n}$$</div>
        <p><b>Read it out loud:</b> the variance of an $n$-sample average is the single-sample variance divided by $n$. The typical error is the square root of that, so it shrinks like $1/\\sqrt{n}$: one hundred times more samples buys you a ten times smaller error. Real numbers: for die rolls, $\\mathrm{Var}(X) = 35/12 \\approx 2.92$, so a 100-roll average has variance $\\approx 0.029$ and typical error $\\approx 0.17$. Hundred-roll averages cluster around $3.5 \\pm 0.17$ — the notebook draws the picture.</p>
        <p>This one result is why deep learning training works. The loss we <b>want</b> to minimize is an expectation over the entire data distribution — uncomputable. The loss we <b>actually compute</b> each step is the average over a random minibatch of a few hundred samples — a Monte-Carlo estimate of the true loss. It is noisy (variance $\\mathrm{Var}/n$, not zero), which is why loss curves wiggle; and it is centered on the truth (step 1 above), which is why following it still leads downhill on average. When you watch your diffusion model's loss curve jitter its way downward in part 10, you are watching this section happen.</p>`
      },
      {
        h: "Sanity checks",
        body: `<p>Habits of a careful reader: after building tools, poke them with special cases and see that nothing breaks.</p>
        <ul>
          <li><b>Every conditional is a legal PMF.</b> The slice-and-rescale recipe guarantees it sums to 1. Check $p(y \\mid x{=}1)$ from the ticket table: $\\tfrac{0.30}{0.60} + \\tfrac{0.10}{0.60} + \\tfrac{0.20}{0.60} = \\tfrac{1}{2} + \\tfrac{1}{6} + \\tfrac{1}{3} = 1$. Passes.</li>
          <li><b>Densities exceed 1; probabilities never do.</b> On the uniform-on-$[0, \\tfrac12]$ spinner with density 2, an interval of width $w$ inside $[0, \\tfrac12]$ has probability $2w \\le 2 \\times \\tfrac{1}{2} = 1$. The rate is 2; no area ever passes 1.</li>
          <li><b>Bayes on independent variables changes nothing.</b> If $X$ and $Y$ are independent, then $p(y \\mid x) = p(y)$, and the rule gives $p(x \\mid y) = \\frac{p(y)\\,p(x)}{p(y)} = p(x)$. Observing a $y$ that carries no information about $x$ leaves your beliefs about $x$ exactly where they were. The formula knows.</li>
          <li><b>Linearity in the smallest case.</b> Set $a = 1, b = 0$: it says $\\mathbb{E}[X] = \\mathbb{E}[X]$. No contradiction hiding in the base case.</li>
          <li><b>Variance limits.</b> $\\mathrm{Var}(aX+b)$ with $a = 1$: shifting alone leaves variance unchanged, matching the intuition that sliding a histogram sideways does not widen it. With $a = 0$: $\\mathrm{Var}(b) = 0$ — a constant has no spread. And variance can never be negative: it is an average of squares.</li>
          <li><b>The addition rule refuses a dependent pair.</b> Try $Y = X$ (perfectly dependent): $\\mathrm{Var}(X + X) = \\mathrm{Var}(2X) = 4\\,\\mathrm{Var}(X)$ by the scaling rule, while naive addition would claim $2\\,\\mathrm{Var}(X)$. The discrepancy is exactly the cross term $2\\,\\mathrm{Cov}(X, X) = 2\\,\\mathrm{Var}(X)$. Consistent.</li>
          <li><b>Monte Carlo at $n = 1$.</b> The formula says $\\mathrm{Var}(\\bar{X}_1) = \\mathrm{Var}(X)$: a single sample is an honest but maximally noisy estimate. Also consistent.</li>
        </ul>`
      },
      {
        h: "What you can do now",
        body: `<p>You can now speak the language the rest of this course is written in. You can read $p(x)$, $p(x,y)$, and $p(y \\mid x)$ and say each one as an English sentence. You can take a joint table apart into marginals and conditionals by counting, and reverse a conditional with Bayes' rule — the exact maneuver that will turn forward noising into reverse denoising in part 7. You can compute expectations and variances by hand, push them through sums and scalings with linearity and the $a^2$ rule, and add variances of independent quantities while knowing precisely which derivation step breaks when independence fails. And you can explain why an average of samples estimates an expectation with error shrinking like $1/\\sqrt{n}$ — the fact that makes minibatch training legitimate.</p>
        <p>Next, we meet the single most important distribution in this course — and arguably in all of applied mathematics. The noise we add to images in the forward process, the noise we remove in the reverse process, and the posterior we derive in part 7 are all drawn from one family: the <b>Gaussian</b>, the bell curve $\\mathcal{N}(\\mu, \\sigma^2)$. Part 3 dissects its formula term by term, then proves the four rules that make it the perfect noise for diffusion: how it shifts and scales, how independent Gaussians add, how to build any Gaussian from a standard one, and how the product of two Gaussian densities is another Gaussian — the tool the part 7 derivation turns on. Every proof will lean on the expectation and variance rules you now own. (For a first look at the bell curve, see <a onclick="App.open('prob-normal')">the normal distribution</a>.)</p>`
      }
    ],
    symbols: [
      { sym: "$X$", desc: "a random variable — a number whose value is decided by chance (capital letter = the machine)" },
      { sym: "$x$", desc: "one particular value the random variable might take (lowercase = a possible output)" },
      { sym: "$p(x)$", desc: "for a discrete variable, the probability that $X = x$ (the PMF); for a continuous variable, the density at $x$ — probability per unit length" },
      { sym: "$\\sum_x$", desc: "add up the expression that follows, once for each possible value $x$" },
      { sym: "$P(a \\le X \\le b)$", desc: "the probability that $X$ lands between $a$ and $b$" },
      { sym: "$\\int_a^b p(x)\\,dx$", desc: "the area under the curve $p(x)$ between $a$ and $b$ — slice into slivers of height $p(x)$ and tiny width $dx$, add the sliver areas" },
      { sym: "$p(x, y)$", desc: "the joint probability that $X = x$ and $Y = y$ at the same time — one cell of the joint table" },
      { sym: "$p(y \\mid x)$", desc: "the conditional probability of $y$ given that $x$ is known — a slice of the joint table, rescaled to sum to 1; the bar reads as 'given'" },
      { sym: "$\\mathbb{E}[X]$", desc: "the expectation of $X$ — the probability-weighted average of its values; the long-run average over many repeats" },
      { sym: "$\\mu$", desc: "shorthand for $\\mathbb{E}[X]$, the mean" },
      { sym: "$\\mathrm{Var}(X)$", desc: "the variance — the average squared distance between $X$ and its mean; its square root (the standard deviation) is the typical distance in original units" },
      { sym: "$\\mathrm{Cov}(X, Y)$", desc: "the covariance — the average of both deviations multiplied, $\\mathbb{E}[(X-\\mu_X)(Y-\\mu_Y)]$; zero for independent variables" },
      { sym: "$\\bar{X}_n$", desc: "the average of $n$ independent samples — the Monte-Carlo estimate of $\\mathbb{E}[X]$" },
      { sym: "$\\beta_t$", desc: "previewed here, owned by part 6: the small noise dose that noising step $t$ adds" },
      { sym: "$q(x_t \\mid x_{t-1})$", desc: "previewed here, owned by part 6: the fixed noising recipe, one step of the forward process" }
    ],
    recall: [
      "What two rules must the numbers in a probability table (PMF) obey?",
      "For a spinner that can land anywhere between 0 and 1, why is the probability of hitting exactly 0.5 equal to zero — and where does probability live instead?",
      "How do you compute a marginal from a joint table? How do you compute a conditional, and why must every conditional sum to 1?",
      "State Bayes' rule and say in one sentence what it lets you flip.",
      "State linearity of expectation. Does it require the variables to be independent?",
      "State the variance shortcut formula, and the rule for $\\mathrm{Var}(aX + b)$. Why does the $b$ disappear?",
      "When is $\\mathrm{Var}(X + Y) = \\mathrm{Var}(X) + \\mathrm{Var}(Y)$ guaranteed, and which step of the derivation needs that assumption?",
      "Why does the average of many independent samples estimate an expectation, and how fast does the typical error shrink as $n$ grows?"
    ],
    practice: [
      {
        q: "Using the ticket table from the lesson (joint probabilities: $p(0,1)=0.10$, $p(0,2)=0.20$, $p(0,3)=0.10$, $p(1,1)=0.30$, $p(1,2)=0.10$, $p(1,3)=0.20$), compute the conditional distribution $p(x \\mid y{=}3)$ and check that it sums to 1.",
        steps: [
          { do: "Read off the two joint probabilities in the $y=3$ column: $p(x{=}0, y{=}3) = 0.10$ and $p(x{=}1, y{=}3) = 0.20$.", why: "The conditional we want lives entirely in this one column — a conditional is a slice of the joint table." },
          { do: "Add the column to get the marginal: $p(y{=}3) = 0.10 + 0.20 = 0.30$.", why: "A marginal is the sum of the joint over the variable you are ignoring; here we sum over both values of $x$." },
          { do: "Divide the first cell by the marginal: $p(x{=}0 \\mid y{=}3) = 0.10 / 0.30 = 1/3$.", why: "The conditional definition $p(x \\mid y) = p(x,y)/p(y)$ — rescale the slice by the probability of what was observed." },
          { do: "Divide the second cell by the marginal: $p(x{=}1 \\mid y{=}3) = 0.20 / 0.30 = 2/3$.", why: "Same definition applied to the other cell of the slice." },
          { do: "Check the sum: $1/3 + 2/3 = 1$.", why: "A conditional is a full-fledged PMF on the remaining variable; if it did not sum to 1 we made an arithmetic error." }
        ],
        answer: "$p(x{=}0 \\mid y{=}3) = 1/3$ and $p(x{=}1 \\mid y{=}3) = 2/3$; the two values sum to 1 as every conditional must."
      },
      {
        q: "A spam filter's numbers: 20% of all email is spam. The word 'free' appears in 60% of spam messages and in 5% of legitimate messages. An email contains 'free'. What is the probability it is spam? Work it out by counting a population of 10,000 emails, then confirm with Bayes' formula.",
        steps: [
          { do: "Split the population: $0.20 \\times 10{,}000 = 2{,}000$ spam and $8{,}000$ legitimate emails.", why: "Turning percentages into concrete counts makes every later step a matter of counting people — no formulas needed yet." },
          { do: "Count spam containing 'free': $0.60 \\times 2{,}000 = 1{,}200$.", why: "The forward conditional $p(\\text{'free'} \\mid \\text{spam}) = 0.60$ applied to the spam group." },
          { do: "Count legitimate emails containing 'free': $0.05 \\times 8{,}000 = 400$.", why: "The other forward conditional, applied to the much larger legitimate group." },
          { do: "Count all emails containing 'free': $1{,}200 + 400 = 1{,}600$.", why: "The observed event 'contains free' happens in both groups; we need everyone it happens to." },
          { do: "Take the fraction that is spam: $1{,}200 / 1{,}600 = 0.75$.", why: "Conditioning means restricting attention to the 1,600 emails consistent with what we observed and asking what fraction of those are spam." },
          { do: "Confirm with the formula: $p(\\text{spam} \\mid \\text{'free'}) = \\frac{0.60 \\times 0.20}{0.60 \\times 0.20 + 0.05 \\times 0.80} = \\frac{0.12}{0.16} = 0.75$.", why: "Bayes' rule is the counting argument compressed into symbols — the two routes must agree, and they do." }
        ],
        answer: "The probability the email is spam is 0.75. Note it is much higher than the medical-test example's 1/6 because here the prior (20% spam) is not tiny."
      },
      {
        q: "A random variable $X$ takes the values $-1$, $0$, and $2$ with probabilities $0.2$, $0.5$, and $0.3$. Compute $\\mathbb{E}[X]$ and $\\mathrm{Var}(X)$ by hand.",
        steps: [
          { do: "Form the value-times-probability products: $(-1)(0.2) = -0.2$, $(0)(0.5) = 0$, $(2)(0.3) = 0.6$.", why: "The expectation definition $\\mathbb{E}[X] = \\sum_x x\\,p(x)$ says: weight each value by its probability." },
          { do: "Add them: $\\mathbb{E}[X] = -0.2 + 0 + 0.6 = 0.4$.", why: "Completing the sum in the definition." },
          { do: "Compute $\\mathbb{E}[X^2]$ by LOTUS: the squared values are $1, 0, 4$, so $\\mathbb{E}[X^2] = (1)(0.2) + (0)(0.5) + (4)(0.3) = 0.2 + 0 + 1.2 = 1.4$.", why: "LOTUS: to average a function of $X$, apply the function to each value first, then take the same weighted average." },
          { do: "Apply the shortcut: $\\mathrm{Var}(X) = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2 = 1.4 - (0.4)^2 = 1.4 - 0.16 = 1.24$.", why: "The shortcut derived in the lesson avoids subtracting the mean from every value before squaring." }
        ],
        answer: "$\\mathbb{E}[X] = 0.4$ and $\\mathrm{Var}(X) = 1.24$."
      },
      {
        q: "For the same $X$ as the previous problem (with $\\mathrm{Var}(X) = 1.24$), compute $\\mathrm{Var}(3X - 2)$ and $\\mathbb{E}[3X - 2]$.",
        steps: [
          { do: "Identify the scaling and shift: $a = 3$ and $b = -2$ in the pattern $aX + b$.", why: "The variance rule $\\mathrm{Var}(aX+b) = a^2\\,\\mathrm{Var}(X)$ needs $a$ and $b$ named before it can be applied." },
          { do: "Apply the rule: $\\mathrm{Var}(3X - 2) = 3^2 \\times 1.24 = 9 \\times 1.24 = 11.16$.", why: "Scaling by 3 multiplies variance by $3^2 = 9$; the shift $b = -2$ contributes nothing because sliding a distribution sideways does not change its spread." },
          { do: "Compute the mean by linearity: $\\mathbb{E}[3X - 2] = 3\\,\\mathbb{E}[X] - 2 = 3(0.4) - 2 = -0.8$.", why: "Linearity of expectation: constants scale and shift the mean directly — unlike the variance, the mean does feel the $-2$." }
        ],
        answer: "$\\mathrm{Var}(3X - 2) = 11.16$ and $\\mathbb{E}[3X - 2] = -0.8$. The shift moves the mean but not the spread."
      },
      {
        q: "A continuous random variable is uniform on $[0, 1/10]$ — it lands in that short interval with all positions equally likely. Find its density, verify the total area is 1, compute $P(0.02 \\le X \\le 0.05)$, and explain why a density of 10 does not violate any rule of probability.",
        steps: [
          { do: "Set up the shape: the density is a flat, unknown height $c$ on $[0, 1/10]$ and 0 everywhere else.", why: "'Uniform' means all positions in the interval are equally likely, which forces a flat curve there and nothing outside." },
          { do: "Impose total area 1: $c \\times \\tfrac{1}{10} = 1$, so $c = 10$.", why: "The area under every density must be exactly 1 (something must happen); for a rectangle, area is height times width." },
          { do: "Compute the interval probability as an area: $P(0.02 \\le X \\le 0.05) = 10 \\times (0.05 - 0.02) = 10 \\times 0.03 = 0.3$.", why: "For continuous variables, probability of an interval is the area under the density over that interval; for a flat density that is height times width." },
          { do: "Explain the legality: density is probability per unit length — a rate. Only areas are probabilities, and the largest possible area is $10 \\times \\tfrac{1}{10} = 1$.", why: "The rules of probability constrain probabilities (areas), never the height of the rate curve — like a speedometer reading 120 km/h on a 60 km trip." }
        ],
        answer: "The density is 10 on $[0, 1/10]$ and 0 elsewhere; the total area is 1; $P(0.02 \\le X \\le 0.05) = 0.3$; the height 10 is legal because density is a rate, and every actual probability (area) stays at or below 1."
      },
      {
        q: "Let $X$ be a fair coin recorded as a number ($0$ or $1$, each with probability $1/2$) and let $Y = X$ — an exact copy. Compute $\\mathrm{Var}(X)$, $\\mathrm{Var}(Y)$, and $\\mathrm{Var}(X+Y)$, and show that the variances do not add. Identify the term in the lesson's derivation that is responsible.",
        steps: [
          { do: "Compute $\\mathbb{E}[X] = 0 \\times \\tfrac12 + 1 \\times \\tfrac12 = 0.5$.", why: "The expectation definition on the two-value table." },
          { do: "Compute $\\mathbb{E}[X^2] = 0^2 \\times \\tfrac12 + 1^2 \\times \\tfrac12 = 0.5$.", why: "LOTUS with $f(x) = x^2$; conveniently $0^2 = 0$ and $1^2 = 1$." },
          { do: "Apply the shortcut: $\\mathrm{Var}(X) = 0.5 - 0.25 = 0.25$, and $\\mathrm{Var}(Y) = 0.25$ as well.", why: "$Y$ is an exact copy of $X$, so it has the identical table and identical variance." },
          { do: "Rewrite the sum: $X + Y = X + X = 2X$.", why: "Substituting $Y = X$ — the whole point of the construction is that the 'two' variables are one." },
          { do: "Apply the scaling rule: $\\mathrm{Var}(2X) = 2^2 \\times 0.25 = 1$.", why: "$\\mathrm{Var}(aX) = a^2\\,\\mathrm{Var}(X)$ with $a = 2$." },
          { do: "Compare: $\\mathrm{Var}(X+Y) = 1$ but $\\mathrm{Var}(X) + \\mathrm{Var}(Y) = 0.5$. The gap is $0.5 = 2\\,\\mathrm{Cov}(X,Y)$, since $\\mathrm{Cov}(X,X) = \\mathbb{E}[(X-\\mu)^2] = \\mathrm{Var}(X) = 0.25$.", why: "The derivation's cross term $2\\,\\mathbb{E}[(X-\\mu_X)(Y-\\mu_Y)]$ only vanishes under independence; with $Y = X$ it equals $2\\,\\mathrm{Var}(X)$, exactly the discrepancy." }
        ],
        answer: "$\\mathrm{Var}(X) = \\mathrm{Var}(Y) = 0.25$ but $\\mathrm{Var}(X+Y) = 1 \\ne 0.5$. The covariance cross term, which independence would have killed, contributes the missing $2 \\times 0.25 = 0.5$."
      },
      {
        q: "For one roll of a fair die, use LOTUS to compute $\\mathbb{E}[(X-1)^2]$, and show it differs from $(\\mathbb{E}[X] - 1)^2$.",
        steps: [
          { do: "Apply $f(x) = (x-1)^2$ to each face: for $x = 1, \\dots, 6$ the values are $0, 1, 4, 9, 16, 25$.", why: "LOTUS says to run every possible value through the function first, before any averaging." },
          { do: "Add the transformed values: $0 + 1 + 4 + 9 + 16 + 25 = 55$.", why: "Each face has the same probability $1/6$, so the weighted sum is the plain sum divided by 6 — do the sum first." },
          { do: "Divide by 6: $\\mathbb{E}[(X-1)^2] = 55/6 \\approx 9.17$.", why: "Completing the LOTUS formula $\\sum_x f(x)\\,p(x)$ with $p(x) = 1/6$." },
          { do: "Compute the other order: $(\\mathbb{E}[X] - 1)^2 = (3.5 - 1)^2 = 2.5^2 = 6.25$.", why: "This is $f$ applied to the average, rather than the average of $f$ — the thing LOTUS is careful not to be." },
          { do: "Compare: $9.17 \\ne 6.25$.", why: "Averaging then transforming is generally not transforming then averaging; the squaring function bends upward, so spread inflates the average of the squares." }
        ],
        answer: "$\\mathbb{E}[(X-1)^2] = 55/6 \\approx 9.17$, while $(\\mathbb{E}[X]-1)^2 = 6.25$. The order of 'average' and 'function' matters."
      }
    ]
  });
})();
