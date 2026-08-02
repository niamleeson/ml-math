/* Rigorous Courses · Diffusion Models — Part 03: The Gaussian: the noise we will use.
   Owns the 1-D Gaussian anatomy, standardization and reparameterization, the scaling and sum
   rules, complete-the-square, the product of two Gaussian densities, and the isotropic
   multivariate Gaussian. */
(function () {
  window.LESSONS.push({
    id: "diff-03-gaussian",
    title: "Part 3 — The Gaussian: the noise we will use",
    tagline: "One bell curve, four algebra rules, and the square-completing trick behind every diffusion derivation",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 3,
    partTotal: 12,
    prereqs: ["diff-02-probability"],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Evaluate the Gaussian density $\\mathcal{N}(x;\\, \\mu, \\sigma^2)$ at any point by hand, and say in plain English what each piece of the formula is doing.</li>
        <li>Turn standard-normal draws into draws from any Gaussian with the reparameterization line $x = \\mu + \\sigma z$, and standardize any observation back into sigma-units.</li>
        <li>Predict, without simulating, the distribution of $aX$ and of $X + Y$ when $X$ and $Y$ are independent Gaussians — and say exactly where independence is used.</li>
        <li>Complete the square on any quadratic in four named steps, and read off the hidden bell's mean and variance from the quadratic's coefficients.</li>
        <li>Multiply two Gaussian density curves and state the new center and spread using the precision-weighted-average formula — the exact tool Part 7's big derivation runs on.</li>
      </ul>`,
    sections: [
      {
        h: "Where we are",
        body: `<p>Part 1 gave us the goal: a picture is a list of numbers, a dataset is a cloud of points in a huge space, and <b>generating</b> means sampling a brand-new point from the cloud's rule. Part 2 built the language for that rule: distributions and densities, joint, marginal, and conditional probabilities, Bayes' rule, and the two summary numbers — <b>expectation</b> (the long-run average, written $\\mathbb{E}[\\cdot]$) and <b>variance</b> (the typical squared spread, written $\\mathrm{Var}(X)$). Part 2 also handed us three workhorse facts we will lean on today: expectation is linear, $\\mathrm{Var}(aX + b) = a^2\\,\\mathrm{Var}(X)$, and for <b>independent</b> variables, variances add.</p>
        <p>This part answers one question: what exactly is the noise that diffusion models add and remove? The answer is the <b>Gaussian</b> distribution — the bell curve. Diffusion models destroy images with Gaussian noise, and every derivation in Parts 6 through 9 is Gaussian algebra: scaling a Gaussian, adding two, or multiplying their density curves. So we slow down here and learn that algebra properly. By the end you will own four rules and one technique — <b>completing the square</b> — and Part 7's centerpiece derivation will be a routine application of what you can already do.</p>`
      },
      {
        h: "The bell curve, term by term",
        body: `<p>Recall from Part 2 that a <b>density</b> is a curve over the number line: the probability of landing in an interval is the area under the curve over that interval. The Gaussian — also called the <b>normal distribution</b> — is one specific density, and it is the single most important formula in this course. Here it is.</p>
        <div class="formula-box">$$\\mathcal{N}(x;\\, \\mu, \\sigma^2) \\;=\\; \\frac{1}{\\sqrt{2\\pi\\sigma^2}}\\; \\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$</div>
        <p><b>Read it out loud:</b> the height of the bell at position $x$, for a bell centered at $\\mu$ with spread $\\sigma$, is one over the square root of two-pi-sigma-squared, times $e$ raised to minus the squared distance from the center divided by twice the variance.</p>
        <p>The curve has exactly two knobs. The <b>mean</b> $\\mu$ says where the center of the bell sits. The <b>standard deviation</b> $\\sigma$ says how wide the bell is, in the same units as $x$; its square $\\sigma^2$ is the <b>variance</b> from Part 2. That is all — every Gaussian in existence is pinned down by these two numbers, which is why we can name one compactly as $\\mathcal{N}(\\mu, \\sigma^2)$.</p>
        <p>One new symbol needs defining: $\\exp(u)$ means the number $e \\approx 2.71828$ raised to the power $u$. Three facts about it are all we need. First, $\\exp(0) = 1$. Second, $\\exp$ of a large negative number is very close to zero — $\\exp(-5) \\approx 0.0067$ — and it shrinks fast. Third, $\\exp(a)\\exp(b) = \\exp(a+b)$: multiplying exponentials means adding their exponents. Keep that third fact in your pocket; it is the reason products of Gaussians stay manageable, and we cash it in two sections from now.</p>
        <p>Now read the formula as two parts with two different jobs.</p>
        <ul>
          <li><b>The exponent</b> $-\\frac{(x-\\mu)^2}{2\\sigma^2}$ shapes the curve. It is a penalty on distance from the center, measured in units of $\\sigma$: you can rewrite it as $-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2$, which is minus one half times "how many sigmas away" squared. At the center, $x = \\mu$, the penalty is $0$ and $\\exp(0) = 1$: the peak. One sigma away the exponent is $-\\tfrac{1}{2}$, and $e^{-1/2} \\approx 0.607$ — the curve has dropped to about 61 percent of its peak. Two sigmas away it is $e^{-2} \\approx 0.135$, about 14 percent. Distance is squared, so the penalty is symmetric (left and right of center look the same) and grows quickly.</li>
          <li><b>The normalizer</b> $\\frac{1}{\\sqrt{2\\pi\\sigma^2}}$ does not bend the curve at all — it is a fixed number that scales the whole thing so that the total area is exactly $1$, which every legal density must have (Part 2). It also tells you the peak height, since at $x=\\mu$ the exponential equals 1: the peak is $\\frac{1}{\\sigma\\sqrt{2\\pi}} \\approx \\frac{0.3989}{\\sigma}$. A narrow bell (small $\\sigma$) must be tall to keep its area at 1 — with $\\sigma = 0.1$ the peak is about $3.99$, comfortably above 1, which is fine for a density (recall Part 2: heights are not probabilities, areas are).</li>
        </ul>
        <p>Let's evaluate it once by hand, with real numbers. What is the height of the standard bell — $\\mu = 0$, $\\sigma^2 = 1$ — at $x = 2$? The exponent is $-\\frac{(2-0)^2}{2 \\cdot 1} = -2$. Then $e^{-2} \\approx 0.1353$. The normalizer is $\\frac{1}{\\sqrt{2\\pi}} \\approx 0.3989$. Multiply: $0.3989 \\times 0.1353 \\approx 0.054$. So the density at two sigmas out is about $0.054$ — the notebook confirms this to four decimals.</p>
        <p>Finally, the famous <b>68-95-99.7 rule</b>, with a numeric read. For any Gaussian: about $68.3\\%$ of draws land within one $\\sigma$ of the center, about $95.4\\%$ within two, and about $99.7\\%$ within three. For $\\mathcal{N}(5, 4)$ — center 5, variance 4, so $\\sigma = 2$ — that means: about two thirds of draws land in $[3, 7]$, about 19 out of 20 land in $[1, 9]$, and nearly all land in $[-1, 11]$. Draws four or more sigmas out land on average only about once in sixteen thousand draws — you may well go ten thousand draws without seeing one. You met this curve briefly in <a onclick="App.open('prob-normal')">the normal distribution lesson</a>; here we go further and learn its algebra.</p>
        <p>Why does this particular curve deserve the whole course? Two honest reasons. Practically, its algebra is closed: scale it, add two, multiply their densities — you get Gaussians back every time, as we are about to prove. Deeply, nature keeps producing it: sums of many small independent effects settle into this exact shape (the <b>central limit theorem</b> — we state it as a fact and leave its proof outside this course). Diffusion models exploit the practical reason relentlessly.</p>`
      },
      {
        h: "Standardize: measure surprise in sigmas",
        body: `<p>Suppose a value $x$ came from $\\mathcal{N}(\\mu, \\sigma^2)$ and you want to know: how unusual is it? Raw distance from the center is not the answer, because a distance of 3 is shocking for a bell with $\\sigma = 0.5$ and unremarkable for a bell with $\\sigma = 10$. The right currency is sigmas. To <b>standardize</b> an observation, subtract the center and divide by the spread:</p>
        <div class="formula-box">$$z \\;=\\; \\frac{x - \\mu}{\\sigma}$$</div>
        <p><b>Read it out loud:</b> the <b>z-score</b> of an observation is how far it sits from the center, measured in units of standard deviation.</p>
        <p>A concrete run: the observation $x = 2.6$ came from $\\mathcal{N}(2, 0.25)$, so $\\mu = 2$ and $\\sigma = \\sqrt{0.25} = 0.5$. Then $z = (2.6 - 2)/0.5 = 1.2$: this value sits 1.2 sigmas above center — inside the 68 percent band's edge neighborhood, nothing surprising. The 68-95-99.7 rule now reads directly off $z$: $|z| \\le 1$ is everyday, $|z| \\approx 2$ is noteworthy, $|z| \\ge 3$ is rare.</p>
        <p>Does $z$ itself have a clean distribution? Yes — mean 0, variance 1. Let's derive that, one operation per step, using only Part 2's rules.</p>
        <ol>
          <li>Write $z = \\frac{1}{\\sigma}x - \\frac{\\mu}{\\sigma}$. <b>Why:</b> splitting the fraction rewrites standardization as "multiply $x$ by a number, then subtract a number" — the shape that Part 2's rules handle.</li>
          <li>$\\mathbb{E}[z] = \\frac{1}{\\sigma}\\mathbb{E}[x] - \\frac{\\mu}{\\sigma}$. <b>Why:</b> linearity of expectation (Part 2): constants factor out and shifts pass through.</li>
          <li>$\\mathbb{E}[z] = \\frac{\\mu}{\\sigma} - \\frac{\\mu}{\\sigma} = 0$. <b>Why:</b> substitute $\\mathbb{E}[x] = \\mu$, the mean of the bell $x$ came from.</li>
          <li>$\\mathrm{Var}(z) = \\frac{1}{\\sigma^2}\\mathrm{Var}(x)$. <b>Why:</b> Part 2's rule $\\mathrm{Var}(aX + b) = a^2 \\mathrm{Var}(X)$ with $a = \\frac{1}{\\sigma}$ — the shift $-\\frac{\\mu}{\\sigma}$ moves the whole cloud without changing its spread.</li>
          <li>$\\mathrm{Var}(z) = \\frac{\\sigma^2}{\\sigma^2} = 1$. <b>Why:</b> substitute $\\mathrm{Var}(x) = \\sigma^2$.</li>
        </ol>
        <p>So every standardized Gaussian observation lives on the same yardstick: the <b>standard normal</b> $\\mathcal{N}(0, 1)$. That is what makes z-scores comparable across different bells — and it is the honest way to answer "which of two observations is more surprising", a question one of this part's practice problems makes deliberately tricky: comparing raw density heights across bells with different $\\sigma$ can point you to the wrong answer.</p>`
      },
      {
        h: "Reparameterization: any Gaussian from the standard one",
        body: `<p>Now run standardization backwards. If subtracting $\\mu$ and dividing by $\\sigma$ turns a $\\mathcal{N}(\\mu, \\sigma^2)$ draw into a standard one, then multiplying by $\\sigma$ and adding $\\mu$ must turn a standard draw into a $\\mathcal{N}(\\mu, \\sigma^2)$ one:</p>
        <div class="formula-box">$$x \\;=\\; \\mu + \\sigma z, \\qquad z \\sim \\mathcal{N}(0, 1)$$</div>
        <p><b>Read it out loud:</b> to draw from the bell centered at $\\mu$ with spread $\\sigma$, first draw a standard-normal $z$, then stretch it by $\\sigma$, then shift it by $\\mu$. (The symbol $\\sim$ means "is distributed as" — "$z$ is a draw from the standard bell".)</p>
        <p>This one-line move is called the <b>reparameterization</b> of a Gaussian, and it may be the single most reused line in this course. Let's verify its two summary numbers, one operation per step.</p>
        <ol>
          <li>$\\mathbb{E}[\\mu + \\sigma z] = \\mu + \\sigma\\,\\mathbb{E}[z]$. <b>Why:</b> linearity of expectation — the constant $\\mu$ passes through, the constant factor $\\sigma$ comes out.</li>
          <li>$\\mathbb{E}[\\mu + \\sigma z] = \\mu + \\sigma \\cdot 0 = \\mu$. <b>Why:</b> the standard normal has mean 0.</li>
          <li>$\\mathrm{Var}(\\mu + \\sigma z) = \\sigma^2\\,\\mathrm{Var}(z)$. <b>Why:</b> Part 2's rule $\\mathrm{Var}(aX+b) = a^2\\mathrm{Var}(X)$: the shift $\\mu$ changes nothing, the factor $\\sigma$ enters squared.</li>
          <li>$\\mathrm{Var}(\\mu + \\sigma z) = \\sigma^2 \\cdot 1 = \\sigma^2$. <b>Why:</b> the standard normal has variance 1.</li>
        </ol>
        <p>Mean $\\mu$, variance $\\sigma^2$ — the right numbers. Is the <b>shape</b> still a bell? Yes: adding $\\mu$ slides the whole curve along the axis without bending it, and multiplying by $\\sigma$ stretches the axis uniformly — a slid, stretched bell is still a bell. We take that geometric argument as our justification and check it numerically in the notebook, where a histogram of one hundred thousand values of <code>mu + sigma * z</code> lands exactly on the predicted density curve.</p>
        <p>A worked example with the kind of numbers diffusion actually uses. Take a clean data value $x_0 = 2$ (recall from Part 1: one pixel of a clean image is one number like this). Say we want to add noise with spread $\\sigma = 0.5$ around it. Draw $z = 1.2$ from the standard bell. Then the noisy value is $x = 2 + 0.5 \\times 1.2 = 2.6$. Standardizing $2.6$ hands back $(2.6 - 2)/0.5 = 1.2$ — the round trip is exact.</p>
        <p>Why this matters so much: a computer only needs one random-number routine — a standard-normal generator — to sample from every Gaussian there is. And in Part 6 the entire forward noising process will collapse into a single reparameterization line, $x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\epsilon$, where $\\bar\\alpha_t$ is the fraction of the original signal surviving to step $t$ and $\\epsilon$ is fresh standard noise. You cannot read that line yet — Part 6 earns it — but notice its skeleton: something plus a spread times standard noise. It is this section's formula wearing a schedule.</p>`
      },
      {
        h: "The scaling rule: stretching a Gaussian",
        body: `<p>First of two algebra rules about combining Gaussians with arithmetic. Suppose $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$ and we multiply every draw by a fixed number $a$. What is the distribution of $aX$?</p>
        <div class="formula-box">$$X \\sim \\mathcal{N}(\\mu, \\sigma^2) \\;\\Rightarrow\\; aX \\sim \\mathcal{N}\\!\\left(a\\mu,\\; a^2\\sigma^2\\right)$$</div>
        <p><b>Read it out loud:</b> multiplying a Gaussian variable by $a$ gives another Gaussian, whose center is $a$ times the old center and whose variance is $a$ <b>squared</b> times the old variance.</p>
        <p>The derivation is three moves on the reparameterization line.</p>
        <ol>
          <li>Write $X = \\mu + \\sigma Z$ with $Z \\sim \\mathcal{N}(0,1)$. <b>Why:</b> the previous section showed every Gaussian is a stretched-and-shifted standard bell, so we may represent $X$ this way.</li>
          <li>Multiply both sides by $a$: $\\; aX = a\\mu + a\\sigma Z$. <b>Why:</b> multiplying a random quantity by a fixed number multiplies every one of its draws, so the equation between draws stays true.</li>
          <li>Read the right side as a reparameterization with center $a\\mu$ and stretch $a\\sigma$: $\\; aX \\sim \\mathcal{N}(a\\mu, (a\\sigma)^2)$. <b>Why:</b> "a constant plus a constant times standard noise" is exactly the pattern that defines a Gaussian with that mean and that spread. (If $a$ is negative, one extra fact closes the gap: $-Z$ has the same distribution as $Z$, because the standard bell is symmetric about 0 — so the pattern holds with stretch $|a|\\sigma$.)</li>
          <li>Expand the square: $(a\\sigma)^2 = a^2\\sigma^2$. <b>Why:</b> the square of a product is the product of squares.</li>
        </ol>
        <p>Real numbers: if $X \\sim \\mathcal{N}(1, 4)$, then $3X \\sim \\mathcal{N}(3, 36)$. The standard deviation went from 2 to 6 (times $a = 3$), so the variance went from 4 to 36 (times $a^2 = 9$). This square trips people up constantly, so say it once more: <b>spread scales like $a$, variance scales like $a^2$.</b> It also explains, in advance, an oddity you will meet in Part 6: to make a variable's variance come out as $1 - \\beta_t$ (where $\\beta_t$ is the small noise dose that noising step $t$ adds — part 6 defines it properly), the recipe multiplies by $\\sqrt{1 - \\beta_t}$ — the square root is there precisely because variances pick up the square of the scale.</p>
        <p>One small but useful companion: adding a constant, $X + b \\sim \\mathcal{N}(\\mu + b, \\sigma^2)$ — the whole bell slides, the spread is untouched. Same proof pattern: $X + b = (\\mu + b) + \\sigma Z$.</p>`
      },
      {
        h: "The sum rule: adding independent Gaussians",
        body: `<p>Second rule, and the engine of the entire forward process. Take two <b>independent</b> Gaussians — recall from Part 2 that independent means knowing one tells you nothing about the other, and it is exactly the condition that makes variances add. Say $X \\sim \\mathcal{N}(\\mu_1, \\sigma_1^2)$ and $Y \\sim \\mathcal{N}(\\mu_2, \\sigma_2^2)$, independent. Then:</p>
        <div class="formula-box">$$X + Y \\;\\sim\\; \\mathcal{N}\\!\\left(\\mu_1 + \\mu_2,\\; \\sigma_1^2 + \\sigma_2^2\\right)$$</div>
        <p><b>Read it out loud:</b> the sum of two independent Gaussians is again a Gaussian; its center is the sum of the centers, and its variance is the sum of the variances.</p>
        <p>This compact statement is really three separate claims, and they deserve separate honesty levels.</p>
        <ol>
          <li><b>The means add.</b> $\\mathbb{E}[X + Y] = \\mathbb{E}[X] + \\mathbb{E}[Y] = \\mu_1 + \\mu_2$. <b>Why:</b> linearity of expectation (Part 2) — and remember, linearity holds whether or not the variables are independent.</li>
          <li><b>The variances add.</b> $\\mathrm{Var}(X + Y) = \\mathrm{Var}(X) + \\mathrm{Var}(Y) = \\sigma_1^2 + \\sigma_2^2$. <b>Why:</b> Part 2's addition rule for variances — and <b>this</b> is where independence is spent. Part 2 showed a dependent pair (there, $Y$ built out of $X$ plus noise) where this fails and the sum spreads more than the parts suggest. Without independence, everything after this line is unjustified.</li>
          <li><b>The sum is again bell-shaped.</b> This is the genuinely special claim, and we will be honest: we do not prove it in this course. It is not a consequence of the mean and variance bookkeeping — most distributions do <b>not</b> keep their shape under addition (add two uniform variables and you get a triangle-shaped density, not a uniform one). Proving the Gaussian case takes an integral called a convolution, or a tool called characteristic functions — both beyond our toolkit. We state it as a fact, and the notebook stress-tests it: a histogram of $X + Y$ over two hundred thousand draws lies exactly on the predicted bell.</li>
        </ol>
        <p>Real numbers: $\\mathcal{N}(1, 4) + \\mathcal{N}(2, 9) = \\mathcal{N}(3, 13)$ for independent draws. Note carefully what does <b>not</b> add: the standard deviations. $\\sqrt{13} \\approx 3.61$, not $2 + 3 = 5$. Variances add; spreads combine like the sides of a right triangle.</p>
        <p>Why this rule owns Part 6: a noised image at step $t$ will be "surviving signal plus fresh noise" — a scaled Gaussian plus an independent Gaussian. The sum rule is what lets us collapse two, then three, then a thousand noising steps into a single Gaussian whose mean and variance we can write down exactly. Every collapse is one application of the two rules on this page.</p>`
      },
      {
        h: "Complete the square: a four-step recipe",
        body: `<p>Look back at the Gaussian formula: all of its personality lives in the exponent, and the exponent is a <b>quadratic</b> in $x$ — an expression of the form $Ax^2 + Bx + C$. This has a powerful flip side: whenever some derivation hands you an exponential of a quadratic, there is a bell curve hiding in it, and you can identify <b>which</b> bell by rearranging the quadratic. The rearranging move is called <b>completing the square</b>, and Part 7's centerpiece — deriving the true denoising step — is one long, careful application of it. So let's learn it as a named, four-step recipe you can run on anything.</p>
        <p>Given a quadratic $Ax^2 + Bx + C$ with $A \\neq 0$:</p>
        <ol>
          <li><b>Collect.</b> Gather the $x^2$ and $x$ terms, and set the lone constant aside: work with $Ax^2 + Bx$. <b>Why:</b> the constant never interacts with $x$; we will bring it back at the end.</li>
          <li><b>Factor.</b> Pull $A$ out of both terms: $A\\left(x^2 + \\frac{B}{A}x\\right)$. <b>Why:</b> the perfect-square pattern we are aiming for, $(x + h)^2 = x^2 + 2hx + h^2$, has a bare $x^2$, so the coefficient must come out first.</li>
          <li><b>Add and subtract.</b> Inside the parentheses, add and subtract the square of half the $x$-coefficient: $A\\left(x^2 + \\frac{B}{A}x + \\left(\\frac{B}{2A}\\right)^2 - \\left(\\frac{B}{2A}\\right)^2\\right)$. <b>Why:</b> adding zero changes nothing, and this particular zero completes the perfect-square pattern.</li>
          <li><b>Regroup.</b> The first three terms inside are exactly $\\left(x + \\frac{B}{2A}\\right)^2$, so the whole thing is $A\\left(x + \\frac{B}{2A}\\right)^2 - \\frac{B^2}{4A}$; now restore the set-aside constant $C$. <b>Why:</b> recognize the pattern $x^2 + 2hx + h^2 = (x+h)^2$ with $h = \\frac{B}{2A}$, then multiply the leftover $-\\left(\\frac{B}{2A}\\right)^2$ through by $A$.</li>
        </ol>
        <p>Run it once on pure numbers: $3x^2 - 12x + 7$.</p>
        <ol>
          <li><b>Collect:</b> $3x^2 - 12x$, with the $7$ set aside. <b>Why:</b> step 1 of the recipe.</li>
          <li><b>Factor:</b> $3(x^2 - 4x)$. <b>Why:</b> pull out the leading coefficient $3$.</li>
          <li><b>Add and subtract:</b> half of $4$ is $2$, and $2^2 = 4$, so write $3(x^2 - 4x + 4 - 4)$. <b>Why:</b> insert the completing zero.</li>
          <li><b>Regroup:</b> $x^2 - 4x + 4 = (x-2)^2$, so we have $3(x-2)^2 - 12$; restore the $7$: $\\;3(x-2)^2 - 5$. <b>Why:</b> recognize the perfect square, multiply the $-4$ through by $3$, then add back the constant.</li>
        </ol>
        <p>Always check by expanding back: $3(x-2)^2 - 5 = 3x^2 - 12x + 12 - 5 = 3x^2 - 12x + 7$. It matches. The notebook checks the same identity at a thousand points.</p>
        <p>Now the payoff — the <b>Gaussian reading rule</b>. In Part 7 we will meet exponents of the form $-\\frac{1}{2}\\left(Ax^2 - 2Bx + \\cdots\\right)$ with $A > 0$, where the dots are terms with no $x$ in them. (The symbol $\\propto$ below means "proportional to": equal up to a fixed multiplier that does not depend on $x$.) Complete the square, one operation per step:</p>
        <ol>
          <li>Drop the $x$-free terms into a constant: the exponent is $-\\frac{A}{2}x^2 + Bx + \\mathrm{const}$. <b>Why:</b> distribute the $-\\frac{1}{2}$; constants in the exponent only multiply the curve by a fixed number, which renormalizing will absorb.</li>
          <li>Factor $-\\frac{A}{2}$ from the $x$ terms: $-\\frac{A}{2}\\left(x^2 - \\frac{2B}{A}x\\right) + \\mathrm{const}$. <b>Why:</b> recipe step 2.</li>
          <li>Add and subtract $\\left(\\frac{B}{A}\\right)^2$ inside: $-\\frac{A}{2}\\left(x^2 - \\frac{2B}{A}x + \\left(\\frac{B}{A}\\right)^2 - \\left(\\frac{B}{A}\\right)^2\\right) + \\mathrm{const}$. <b>Why:</b> half of $\\frac{2B}{A}$ is $\\frac{B}{A}$; recipe step 3.</li>
          <li>Regroup: $-\\frac{A}{2}\\left(x - \\frac{B}{A}\\right)^2 + \\frac{B^2}{2A} + \\mathrm{const}$. <b>Why:</b> recognize the perfect square; the leftover $+\\frac{A}{2}\\left(\\frac{B}{A}\\right)^2 = \\frac{B^2}{2A}$ has no $x$, so it joins the constant.</li>
          <li>Match against the Gaussian exponent $-\\frac{(x-\\mu)^2}{2\\sigma^2}$: the coefficient gives $\\frac{1}{2\\sigma^2} = \\frac{A}{2}$, so $\\sigma^2 = \\frac{1}{A}$, and the center gives $\\mu = \\frac{B}{A}$. <b>Why:</b> two curves with identical exponents-in-$x$ are the same curve up to a constant factor.</li>
        </ol>
        <div class="formula-box">$$\\exp\\!\\left(-\\tfrac{1}{2}\\left(Ax^2 - 2Bx\\right) + \\mathrm{const}\\right) \\;\\propto\\; \\mathcal{N}\\!\\left(x;\\; \\tfrac{B}{A},\\; \\tfrac{1}{A}\\right)$$</div>
        <p><b>Read it out loud:</b> whenever an exponent is a downward-opening quadratic in $x$, the curve is a bell in disguise — its variance is one over the $x^2$ coefficient $A$, and its mean is $B$ over $A$. Memorize this reading rule; Part 7 uses it verbatim to read off the true denoiser's mean and variance.</p>`
      },
      {
        h: "Multiplying two bell curves",
        body: `<p>Here is the situation the recipe was built for. Part 2's Bayes' rule combines beliefs by <b>multiplying</b> densities: a posterior is proportional to a prior times a likelihood. In Part 7, both factors will be Gaussians in the same variable. So we need to answer: what curve do you get when you multiply two Gaussian densities pointwise?</p>
        <div class="formula-box">$$\\mathcal{N}(x;\\, \\mu_1, \\sigma_1^2)\\;\\cdot\\;\\mathcal{N}(x;\\, \\mu_2, \\sigma_2^2) \\;\\propto\\; \\mathcal{N}(x;\\, \\mu_*, \\sigma_*^2)$$</div>
        <p><b>Read it out loud:</b> the product of two bells in the same variable is, after rescaling its area back to 1, another bell — with a new center $\\mu_*$ and a new spread $\\sigma_*^2$ given below.</p>
        <div class="formula-box">$$\\frac{1}{\\sigma_*^2} \\;=\\; \\frac{1}{\\sigma_1^2} + \\frac{1}{\\sigma_2^2}, \\qquad \\mu_* \\;=\\; \\sigma_*^2\\left(\\frac{\\mu_1}{\\sigma_1^2} + \\frac{\\mu_2}{\\sigma_2^2}\\right)$$</div>
        <p><b>Read it out loud:</b> one over the new variance is the sum of one-over-the-old-variances; and the new center is a weighted average of the two old centers, where each center is weighted by one over its own variance.</p>
        <p>The quantity $\\frac{1}{\\sigma^2}$ is worth naming: it is the <b>precision</b> of a Gaussian — its sharpness. In that language the rule sings: <b>precisions add, and the new center is the precision-weighted average of the old centers.</b> Two witnesses each report where a value lies, one confident and one vague; combining their reports gives an answer sharper than either witness alone, pulled toward the confident one. Now the derivation — every line one operation, using only tools you already have.</p>
        <ol>
          <li>Write out the product: $\\frac{1}{\\sqrt{2\\pi\\sigma_1^2}}\\exp\\!\\left(-\\frac{(x-\\mu_1)^2}{2\\sigma_1^2}\\right) \\cdot \\frac{1}{\\sqrt{2\\pi\\sigma_2^2}}\\exp\\!\\left(-\\frac{(x-\\mu_2)^2}{2\\sigma_2^2}\\right)$. <b>Why:</b> substitute the density formula for each factor.</li>
          <li>Set the two normalizers aside as one fixed number. <b>Why:</b> neither contains $x$, so they only scale the curve — and we are working up to proportionality, with renormalization at the end.</li>
          <li>Merge the exponentials: $\\exp\\!\\left(-\\frac{(x-\\mu_1)^2}{2\\sigma_1^2} - \\frac{(x-\\mu_2)^2}{2\\sigma_2^2}\\right)$. <b>Why:</b> the pocket fact from the anatomy section — $\\exp(a)\\exp(b) = \\exp(a+b)$.</li>
          <li>Expand the first square: $(x - \\mu_1)^2 = x^2 - 2\\mu_1 x + \\mu_1^2$. <b>Why:</b> multiply out the binomial.</li>
          <li>Expand the second square the same way: $(x - \\mu_2)^2 = x^2 - 2\\mu_2 x + \\mu_2^2$. <b>Why:</b> same move, second term.</li>
          <li>Collect the $x^2$ terms across both fractions: their total coefficient is $-\\frac{1}{2}\\left(\\frac{1}{\\sigma_1^2} + \\frac{1}{\\sigma_2^2}\\right)$. <b>Why:</b> each expanded square contributes its $x^2$ divided by its own $2\\sigma^2$; we are grouping like powers of $x$.</li>
          <li>Collect the $x$ terms: their total coefficient is $+\\left(\\frac{\\mu_1}{\\sigma_1^2} + \\frac{\\mu_2}{\\sigma_2^2}\\right)$. <b>Why:</b> the $-2\\mu x$ pieces, each divided by $-2\\sigma^2$, flip sign and lose the 2.</li>
          <li>Fold the $x$-free pieces $-\\frac{\\mu_1^2}{2\\sigma_1^2} - \\frac{\\mu_2^2}{2\\sigma_2^2}$ into the constant. <b>Why:</b> each expanded square contributed its $-\\mu^2/(2\\sigma^2)$ piece; no $x$ means no effect on the shape, only on the overall scale.</li>
          <li>Name $A = \\frac{1}{\\sigma_1^2} + \\frac{1}{\\sigma_2^2}$ and $B = \\frac{\\mu_1}{\\sigma_1^2} + \\frac{\\mu_2}{\\sigma_2^2}$, so the exponent reads $-\\frac{1}{2}\\left(Ax^2 - 2Bx\\right) + \\mathrm{const}$. <b>Why:</b> pure renaming, to put the exponent in exactly the reading rule's form.</li>
          <li>Apply the Gaussian reading rule from the previous section: the curve is proportional to $\\mathcal{N}\\!\\left(x;\\, \\frac{B}{A}, \\frac{1}{A}\\right)$. <b>Why:</b> we derived that rule by completing the square; this is its first real use.</li>
          <li>Translate back: $\\sigma_*^2 = \\frac{1}{A} = \\left(\\frac{1}{\\sigma_1^2} + \\frac{1}{\\sigma_2^2}\\right)^{-1}$ and $\\mu_* = \\frac{B}{A} = \\sigma_*^2\\left(\\frac{\\mu_1}{\\sigma_1^2} + \\frac{\\mu_2}{\\sigma_2^2}\\right)$. <b>Why:</b> substitute the named quantities back in — and these are exactly the boxed formulas.</li>
        </ol>
        <p>Worked example, the one this part promised: multiply $\\mathcal{N}(x;\\, 1, 1)$ and $\\mathcal{N}(x;\\, 3, 2)$. The precisions are $\\frac{1}{1} = 1$ and $\\frac{1}{2} = 0.5$; they add to $1.5$, so $\\sigma_*^2 = \\frac{1}{1.5} = \\frac{2}{3} \\approx 0.667$. The weighted-center sum is $\\frac{1}{1} + \\frac{3}{2} = 2.5$, so $\\mu_* = \\frac{2.5}{1.5} = \\frac{5}{3} \\approx 1.667$. Sanity-read the answer: the new center lies between the old centers 1 and 3, but closer to 1 — the first bell is sharper, so its vote counts double. And the new variance $0.667$ is smaller than both 1 and 2: multiplying evidence sharpens the answer. The notebook multiplies the two curves numerically, renormalizes, and finds the predicted bell to within about a hundred-thousandth everywhere.</p>
        <p>One last word on that $\\propto$: the discarded constants make the product's total area come out below 1, so the product is not itself a legal density — dividing by its area fixes that without changing the shape. In Part 7, Bayes' rule will supply the dividing constant automatically (it is the denominator $q(x_t \\mid x_0)$), so nothing is swept under the rug.</p>`
      },
      {
        h: "Gaussians in many dimensions",
        body: `<p>Images are not single numbers — Part 1 flattened even a tiny image into hundreds of numbers. So the noise we add must be a whole <b>vector</b> of noise: one number per pixel. The version diffusion uses is the friendliest possible one: give every coordinate its own 1-D Gaussian, all with the same spread, all <b>independent</b> of each other. This is the <b>isotropic</b> Gaussian ("isotropic" means "the same in every direction"), written $\\mathcal{N}(\\mu, \\sigma^2 \\mathbf{I})$. Here $\\mu$ is a vector of per-coordinate centers, and $\\mathbf{I}$ is the <b>identity matrix</b> — for us, pure shorthand for "same variance $\\sigma^2$ in every coordinate, and no linkage between coordinates".</p>
        <div class="formula-box">$$\\mathcal{N}(x;\\, \\mu, \\sigma^2 \\mathbf{I}) \\;=\\; \\prod_{i=1}^{d} \\mathcal{N}(x_i;\\, \\mu_i, \\sigma^2)$$</div>
        <p><b>Read it out loud:</b> the density of the whole $d$-dimensional vector is the product, over the coordinates $i = 1$ to $d$, of an ordinary 1-D bell for coordinate $x_i$ centered at $\\mu_i$ with variance $\\sigma^2$. (The tall $\\prod$ symbol means "multiply all of these together", the same way $\\sum$ means "add all of these".) The product form is Part 2's independence rule for densities: independent things multiply.</p>
        <p>Two consequences you can see. First, in 2-D, a scatter of draws from $\\mathcal{N}(0, \\mathbf{I})$ is a circular blob, and the curves of equal density are perfect circles: merging the two exponents gives $-\\frac{1}{2}(x_1^2 + x_2^2)$, which depends only on the overall distance from the center, not the direction. The notebook draws the scatter, overlays the circular contours, and checks that the two coordinates are uncorrelated (correlation $\\approx 0$). Second — and this is the point of the whole section — because the coordinates never interact, <b>every rule in this part applies coordinate by coordinate</b>. Scale an isotropic Gaussian vector: the scaling rule fires in each coordinate. Add two independent ones: the sum rule fires in each coordinate. Multiply densities: per coordinate again.</p>
        <p>This is exactly why the course's contract notation $\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$ — fresh standard Gaussian noise — is safe to reason about with 1-D algebra. When Part 6 noises a 784-pixel image, it draws 784 independent standard-normal numbers, one per pixel, and every derivation from Part 6 through Part 9 will be written for a single coordinate with the words "per coordinate" said once. You now know precisely what those words license.</p>`
      },
      {
        h: "Sanity checks",
        body: `<p>Run each of this part's results through a quick stress test — the habit matters as much as the results.</p>
        <ul>
          <li><b>Peak height vs. width.</b> The peak is $\\frac{0.3989}{\\sigma}$. As $\\sigma$ shrinks, the peak grows — a narrow bell must be tall to keep its area at 1. At $\\sigma = 0.1$ the peak is about $3.99$: a density above 1, which Part 2 taught us is legal (areas, not heights, are probabilities).</li>
          <li><b>Scaling rule, boring cases.</b> With $a = 1$: $\\mathcal{N}(\\mu, \\sigma^2)$ unchanged — good. With $a = -1$: $\\mathcal{N}(-\\mu, \\sigma^2)$ — a mirror image with the <b>same positive</b> variance, because $a$ enters squared. A negative variance can never appear; the algebra protects itself.</li>
          <li><b>Sum rule, degenerate case.</b> Adding a constant $b$ is like adding a "Gaussian" with zero variance: the rule predicts $\\mathcal{N}(\\mu + b, \\sigma^2 + 0)$, which matches the shift rule exactly. The two rules agree on their overlap.</li>
          <li><b>Standard deviations do not add.</b> $\\mathcal{N}(1,4) + \\mathcal{N}(2,9)$ has spread $\\sqrt{13} \\approx 3.61$, not $5$. If you ever find yourself adding sigmas, stop and add variances instead.</li>
          <li><b>Product rule, equal spreads.</b> Multiply two bells with the same $\\sigma^2$: precisions $\\frac{1}{\\sigma^2} + \\frac{1}{\\sigma^2}$ give $\\sigma_*^2 = \\frac{\\sigma^2}{2}$, and the weights are equal so $\\mu_*$ is the midpoint. Two equally reliable witnesses: split the difference, double the sharpness. Exactly what intuition orders.</li>
          <li><b>Product rule, one vague witness.</b> Let $\\sigma_2^2 \\to \\infty$: its precision $\\frac{1}{\\sigma_2^2} \\to 0$, so $\\sigma_*^2 \\to \\sigma_1^2$ and $\\mu_* \\to \\mu_1$. An infinitely uncertain report changes nothing. Also, the formulas are symmetric — swapping the two bells cannot change the answer, and indeed it does not.</li>
          <li><b>Complete the square, always verify.</b> Expand $3(x-2)^2 - 5$ back out: $3x^2 - 12x + 12 - 5 = 3x^2 - 12x + 7$. Ten seconds of multiplication catches every sign slip. Make this reflex — Part 7's derivation will give you several chances to use it.</li>
          <li><b>Round trip.</b> Standardize then reparameterize: $\\mu + \\sigma \\cdot \\frac{x - \\mu}{\\sigma} = x$. The two moves are exact inverses, as claimed.</li>
        </ul>`
      },
      {
        h: "What you can do now",
        body: `<p>You can now read the Gaussian density like a sentence — normalizer for area 1, exponent penalizing sigma-distance from the center — and evaluate it by hand. You can standardize any observation to the universal $\\mathcal{N}(0,1)$ yardstick and build any Gaussian back from it with $x = \\mu + \\sigma z$. You hold two combination rules with full derivations: $aX \\sim \\mathcal{N}(a\\mu, a^2\\sigma^2)$, and for independent Gaussians, $X + Y \\sim \\mathcal{N}(\\mu_1 + \\mu_2, \\sigma_1^2 + \\sigma_2^2)$ — knowing exactly which step spends independence. You own a four-step recipe for completing the square, the reading rule that converts any downward quadratic exponent into a named bell, and the product rule it implies: precisions add, centers average by precision. And you know that $\\mathcal{N}(\\mu, \\sigma^2\\mathbf{I})$ is nothing but an independent 1-D bell per coordinate, so all of the above works pixel by pixel.</p>
        <p>Next, Part 4 puts these rules in motion. Diffusion does not add noise once — it adds hundreds of small doses, one after another, each step depending only on the step before. That structure is called a <b>Markov chain</b>, and Part 4 builds the language of chains from a two-state weather toy up to the continuous chain $x_t = \\sqrt{1-\\beta}\\, x_{t-1} + \\sqrt{\\beta}\\, \\epsilon_t$ (here $\\beta$ is a small noise dose and $\\epsilon_t$ is a fresh standard-normal draw at step $t$) — which you will recognize as this part's scaling rule and sum rule applied over and over. The punchline there: if the chain's input is already $\\mathcal{N}(0,1)$, one more step leaves it exactly $\\mathcal{N}(0,1)$ — your first glimpse of why the forward process must end in pure noise.</p>`
      }
    ],
    symbols: [
      { sym: "$\\mathcal{N}(x;\\, \\mu, \\sigma^2)$", desc: "the Gaussian (normal) density at point $x$: a bell curve with center $\\mu$ and spread $\\sigma^2$" },
      { sym: "$\\mu$", desc: "the mean — where the center of the bell sits" },
      { sym: "$\\sigma$", desc: "the standard deviation — the bell's width, in the same units as $x$" },
      { sym: "$\\sigma^2$", desc: "the variance — the squared spread (Part 2's typical squared distance from the mean)" },
      { sym: "$e$, $\\exp(u)$", desc: "the number $2.71828\\ldots$; $\\exp(u)$ means $e$ raised to the power $u$" },
      { sym: "$z$", desc: "a standard-normal value: an observation re-expressed as 'how many sigmas from the center' (its z-score)" },
      { sym: "$\\sim$", desc: "'is distributed as' — $X \\sim \\mathcal{N}(0,1)$ says $X$ is a draw from the standard bell" },
      { sym: "$a$, $b$", desc: "fixed (non-random) numbers used to scale ($aX$) or shift ($X + b$) a random variable" },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the expectation — the long-run average (from Part 2)" },
      { sym: "$\\mathrm{Var}(X)$", desc: "the variance of $X$ (from Part 2)" },
      { sym: "$1/\\sigma^2$", desc: "the precision of a Gaussian — its sharpness; precisions add when densities multiply" },
      { sym: "$\\mu_*$, $\\sigma_*^2$", desc: "the center and spread of the bell you get by multiplying two Gaussian densities and renormalizing" },
      { sym: "$\\propto$", desc: "'proportional to' — equal up to a fixed multiplier that does not depend on $x$" },
      { sym: "$d$", desc: "the number of coordinates (dimensions) of a vector — 784 for a 28-by-28 image" },
      { sym: "$\\mathbf{I}$", desc: "the identity matrix — here, shorthand for 'same variance in every coordinate, no linkage between coordinates'" },
      { sym: "$\\prod$", desc: "'multiply all of these together', the way $\\sum$ means 'add all of these'" },
      { sym: "$\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$", desc: "fresh standard Gaussian noise: an independent standard-normal draw in every coordinate" },
      { sym: "$x_0$, $x_t$", desc: "previewed here, owned by part 6: the clean data point and its noisy version after $t$ doses" },
      { sym: "$\\beta_t$", desc: "previewed here, owned by part 6: the small noise dose that noising step $t$ adds" },
      { sym: "$\\bar\\alpha_t$", desc: "previewed here, owned by part 6: the fraction of the original signal surviving to step $t$" }
    ],
    recall: [
      "What job does the normalizer $\\frac{1}{\\sqrt{2\\pi\\sigma^2}}$ do, and what job does the exponent do?",
      "Write the reparameterization line that turns a standard-normal draw $z$ into a draw from $\\mathcal{N}(\\mu, \\sigma^2)$.",
      "If $X \\sim \\mathcal{N}(2, 9)$, what is the distribution of $3X$ — and which part of the answer picks up a square?",
      "For the sum of two independent Gaussians, what adds: standard deviations or variances? And exactly which claim in the sum rule spends the independence assumption?",
      "Recite the four named steps of the complete-the-square recipe.",
      "In the Gaussian reading rule, an exponent $-\\frac{1}{2}(Ax^2 - 2Bx) + \\mathrm{const}$ hides a bell with what mean and what variance?",
      "When you multiply two Gaussian densities and renormalize, is the result narrower or wider than either input — and why does that make sense?",
      "In plain English, what does $\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$ say about the noise added to each pixel of an image?"
    ],
    practice: [
      {
        q: "Compute the Gaussian density $\\mathcal{N}(x;\\, \\mu, \\sigma^2)$ at $x = 1$ for $\\mu = 0$ and $\\sigma^2 = 4$. Work to three decimals.",
        steps: [
          { do: "Write the normalizer: $\\frac{1}{\\sqrt{2\\pi \\cdot 4}} = \\frac{1}{\\sqrt{8\\pi}} \\approx \\frac{1}{5.013} \\approx 0.1995$.", why: "The normalizer only needs the variance; plugging in $\\sigma^2 = 4$ fixes it as one number." },
          { do: "Compute the exponent: $-\\frac{(1-0)^2}{2 \\cdot 4} = -\\frac{1}{8} = -0.125$.", why: "The exponent is minus the squared distance from the center, divided by twice the variance." },
          { do: "Exponentiate: $e^{-0.125} \\approx 0.8825$.", why: "Apply $\\exp$ to the exponent; a small negative exponent gives a value a little below 1." },
          { do: "Multiply the two parts: $0.1995 \\times 0.8825 \\approx 0.176$.", why: "The density is normalizer times exponential — the two jobs recombine." }
        ],
        answer: "$\\mathcal{N}(1;\\, 0, 4) \\approx 0.176$. Note it is well below the standard bell's peak $0.399$: a wide bell ($\\sigma = 2$) is a low bell, because its area must still be 1."
      },
      {
        q: "An observation $x = 7.5$ came from $\\mathcal{N}(5, 4)$. Standardize it and say, using the 68-95-99.7 rule, how surprising it is.",
        steps: [
          { do: "Get the standard deviation: $\\sigma = \\sqrt{4} = 2$.", why: "Standardization divides by $\\sigma$, not by the variance — take the square root first." },
          { do: "Subtract the center: $7.5 - 5 = 2.5$.", why: "First move of the z-score: measure the raw distance from the mean." },
          { do: "Divide by the spread: $z = \\frac{2.5}{2} = 1.25$.", why: "Second move: convert the raw distance into sigma-units." },
          { do: "Place $z = 1.25$ on the rule: it is beyond the 1-sigma band (68 percent) but well inside the 2-sigma band (95 percent).", why: "The 68-95-99.7 rule reads directly off $|z|$: between 1 and 2 sigmas means noteworthy but not remarkable." }
        ],
        answer: "$z = 1.25$: the observation sits 1.25 standard deviations above center — mildly unusual, nothing more. Roughly one draw in five lands further from the center than this."
      },
      {
        q: "$X \\sim \\mathcal{N}(2, 3)$ and $Y \\sim \\mathcal{N}(-1, 5)$ are independent. What is the distribution of $X + Y$? Give its standard deviation too.",
        steps: [
          { do: "Add the means: $2 + (-1) = 1$.", why: "Linearity of expectation (Part 2) — means add, independence not even needed for this part." },
          { do: "Add the variances: $3 + 5 = 8$.", why: "Variances add for independent variables (Part 2) — this is the step that spends the independence assumption." },
          { do: "Conclude the shape: the sum of two independent Gaussians is Gaussian, so $X + Y \\sim \\mathcal{N}(1, 8)$.", why: "The sum rule's third claim — stated in this part and verified numerically in the notebook; the full proof lives beyond our toolkit." },
          { do: "Take the square root for the spread: $\\sqrt{8} \\approx 2.83$.", why: "The standard deviation is the square root of the variance — and note it is not $\\sqrt{3} + \\sqrt{5} \\approx 3.97$; sigmas do not add." }
        ],
        answer: "$X + Y \\sim \\mathcal{N}(1, 8)$, with standard deviation $\\sqrt{8} \\approx 2.83$."
      },
      {
        q: "$X \\sim \\mathcal{N}(4, 9)$. Find the distribution of $0.5X$ and the distribution of $-2X$.",
        steps: [
          { do: "Scale the mean for $0.5X$: $0.5 \\times 4 = 2$.", why: "The scaling rule sends $\\mu$ to $a\\mu$." },
          { do: "Scale the variance for $0.5X$: $0.5^2 \\times 9 = 0.25 \\times 9 = 2.25$.", why: "Variance picks up $a^2$, not $a$ — halving the variable quarters the variance." },
          { do: "Scale the mean for $-2X$: $-2 \\times 4 = -8$.", why: "Same rule with $a = -2$; the center flips to the negative side." },
          { do: "Scale the variance for $-2X$: $(-2)^2 \\times 9 = 4 \\times 9 = 36$.", why: "The square erases the sign: variance comes out positive, as it must." }
        ],
        answer: "$0.5X \\sim \\mathcal{N}(2, 2.25)$ and $-2X \\sim \\mathcal{N}(-8, 36)$."
      },
      {
        q: "Complete the square on the exponent $-\\frac{1}{2}\\left(3x^2 - 4x + 7\\right)$ and read off the mean and variance of the bell it hides.",
        steps: [
          { do: "Work inside the parentheses first. Collect the $x$ terms: $3x^2 - 4x$, setting the constant $7$ aside.", why: "Recipe step 1 (collect): the lone constant never interacts with $x$." },
          { do: "Factor out the leading coefficient: $3\\left(x^2 - \\frac{4}{3}x\\right)$.", why: "Recipe step 2 (factor): the perfect-square pattern needs a bare $x^2$." },
          { do: "Add and subtract the square of half the $x$-coefficient — half of $\\frac{4}{3}$ is $\\frac{2}{3}$, squared is $\\frac{4}{9}$: $3\\left(x^2 - \\frac{4}{3}x + \\frac{4}{9} - \\frac{4}{9}\\right)$.", why: "Recipe step 3 (add and subtract): inserting zero in the exact form that completes the square." },
          { do: "Regroup: $3\\left(x - \\frac{2}{3}\\right)^2 - \\frac{4}{3}$, then restore the $7$: $3\\left(x - \\frac{2}{3}\\right)^2 + \\frac{17}{3}$.", why: "Recipe step 4 (regroup): recognize the perfect square, multiply $-\\frac{4}{9}$ through by 3 to get $-\\frac{4}{3}$, then $-\\frac{4}{3} + 7 = \\frac{17}{3}$." },
          { do: "Apply the outer $-\\frac{1}{2}$: the exponent is $-\\frac{3}{2}\\left(x - \\frac{2}{3}\\right)^2 - \\frac{17}{6}$.", why: "Multiply every term by $-\\frac{1}{2}$; the constant piece $-\\frac{17}{6}$ only rescales the curve." },
          { do: "Match against $-\\frac{(x-\\mu)^2}{2\\sigma^2}$: from $\\frac{1}{2\\sigma^2} = \\frac{3}{2}$ read $\\sigma^2 = \\frac{1}{3}$, and the center is $\\mu = \\frac{2}{3}$.", why: "The Gaussian reading rule: the squared-term coefficient fixes the variance, the shift inside the square fixes the mean." }
        ],
        answer: "The exponent equals $-\\frac{3}{2}\\left(x - \\frac{2}{3}\\right)^2 - \\frac{17}{6}$: a Gaussian with mean $\\frac{2}{3}$ and variance $\\frac{1}{3}$, times a constant."
      },
      {
        q: "Multiply the densities $\\mathcal{N}(x;\\, 0, 4)$ and $\\mathcal{N}(x;\\, 2, 4)$. Find the new mean and variance, and sanity-check them.",
        steps: [
          { do: "Add the precisions: $\\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}$, so $\\sigma_*^2 = 2$.", why: "The product rule says one over the new variance is the sum of one over the old variances; invert $\\frac{1}{2}$ to get 2." },
          { do: "Form the weighted-center sum: $\\frac{0}{4} + \\frac{2}{4} = \\frac{1}{2}$.", why: "Each center is weighted by its own precision — the numerator of the precision-weighted average." },
          { do: "Multiply by the new variance: $\\mu_* = 2 \\times \\frac{1}{2} = 1$.", why: "The product-rule formula is $\\mu_* = \\sigma_*^2 (\\mu_1/\\sigma_1^2 + \\mu_2/\\sigma_2^2)$." },
          { do: "Sanity-check: equal spreads, so the center should be the midpoint of 0 and 2 — it is (1) — and the variance should halve — it does ($4 \\to 2$).", why: "The equal-spreads special case from the sanity checks section: split the difference, double the sharpness." }
        ],
        answer: "The product is proportional to $\\mathcal{N}(x;\\, 1, 2)$: center at the midpoint 1, variance halved from 4 to 2."
      },
      {
        q: "Which is more surprising: observing $x = 2.1$ from $\\mathcal{N}(0, 1)$, or observing $x = 6$ from $\\mathcal{N}(0, 9)$? Careful — computing the two density heights leads you astray.",
        steps: [
          { do: "Standardize the first: $z_1 = \\frac{2.1 - 0}{1} = 2.1$.", why: "Surprise across different bells must be compared in sigma-units, so convert each observation to its z-score." },
          { do: "Standardize the second: $\\sigma = \\sqrt{9} = 3$, so $z_2 = \\frac{6 - 0}{3} = 2.0$.", why: "Same conversion for the second observation, using its own bell's spread." },
          { do: "Compare: $2.1 > 2.0$, so the first observation sits further out in sigma-units.", why: "On the shared $\\mathcal{N}(0,1)$ yardstick, a larger $|z|$ means a rarer event — less area remains beyond it." },
          { do: "Now see why densities mislead: $\\mathcal{N}(2.1;\\, 0, 1) \\approx 0.3989 \\times e^{-2.205} \\approx 0.044$, while $\\mathcal{N}(6;\\, 0, 9) \\approx \\frac{0.3989}{3} \\times e^{-2} \\approx 0.018$.", why: "Plugging into the density formula: the first height is more than double the second — the wide bell is low everywhere, so its raw heights cannot be compared with a narrow bell's." },
          { do: "Resolve the conflict in favor of the z-scores: the first observation is (slightly) more surprising even though its density is higher.", why: "Density heights are not probabilities and are scaled differently for different sigmas; the standardized distance is the honest comparison." }
        ],
        answer: "$x = 2.1$ under $\\mathcal{N}(0,1)$ is more surprising: its z-score is 2.1 versus 2.0. The raw densities (0.044 versus 0.018) point the other way and are the trap — standardize first."
      }
    ]
  });
})();
