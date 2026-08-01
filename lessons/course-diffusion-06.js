/* Rigorous Courses · Diffusion Models — Part 06: The forward process: destroying data on schedule.
   Owns the DDPM forward kernel, the why of sqrt(1-beta), alpha and abar, the closed form
   q(x_t | x_0), the one-line sampler, noise schedules, SNR, and the near-zero end state. */
(function () {
  window.LESSONS.push({
    id: "diff-06-forward-process",
    title: "Part 6 — The forward process: destroying data on schedule",
    tagline: "A fixed noising recipe, and a one-line shortcut that jumps any image to any noise level",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 6,
    partTotal: 12,
    prereqs: ["diff-05-likelihood-elbo"],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Write the forward kernel $q(x_t \\mid x_{t-1})$ from memory and say in plain English what each piece does to an image.</li>
        <li>Prove, using only Part 2's variance rules, that the $\\sqrt{1-\\beta_t}$ shrink keeps a variance-1 input at variance exactly 1.</li>
        <li>Derive the closed form $q(x_t \\mid x_0) = \\mathcal{N}(\\sqrt{\\bar\\alpha_t}\\, x_0,\\ (1-\\bar\\alpha_t)\\mathbf{I})$ by composing two steps, and point to the exact line where independence of the noise doses is used.</li>
        <li>Noise any data point to any step $t$ in one line, and check the numbers by hand on the $T=3$ running example.</li>
        <li>Read a noise schedule: compute $\\bar\\alpha_t$ and $\\mathrm{SNR}(t)$, and say when the image is basically gone.</li>
      </ul>`,
    sections: [
      { h: "Where we are",
        body: `<p>Five parts in, you own a real toolkit. Part 1 defined the goal: a dataset is a cloud of points, and generating means sampling a new point from the cloud's rule. Part 2 gave us the language of probability, including the two variance rules we will lean on today: scaling a random variable by $a$ scales its variance by $a^2$, and the variances of <b>independent</b> random variables add. Part 3 introduced the Gaussian and its algebra: a draw from $\\mathcal{N}(\\mu, \\sigma^2)$ can be written $\\mu + \\sigma z$ with $z$ standard, and a sum of independent Gaussians is again Gaussian, with means added and variances added. Part 4 built chains of randomness and showed a chain on the number line that settles at $\\mathcal{N}(0,1)$ no matter where it starts. Part 5 gave us the scoring machinery — likelihood, KL divergence, and the ELBO — which will come back in force in part 8.</p>
        <p>Now we start building the diffusion model itself. This part answers one question: what exactly is the "destroy it slowly" half of diffusion? We will write down the fixed recipe that turns any image into pure noise, understand why it is built the odd way it is, and derive the single most-used equation in the whole field: a one-line formula that jumps a clean image straight to any noise level without looping. Every tool we need is already on the table.</p>` },

      { h: "One small dose of noise",
        body: `<p>Here is one step of destruction, in words first. Take the current image — a long list of numbers, one per pixel. Do two things to every number in the list:</p>
        <ol>
          <li><b>Shrink it a little.</b> Multiply it by $\\sqrt{1-\\beta_t}$, a number a hair below 1. For $\\beta_t = 0.1$ the multiplier is $\\sqrt{0.9} \\approx 0.9487$.</li>
          <li><b>Add a small dose of fresh noise.</b> Draw a fresh Gaussian number with mean 0 and variance $\\beta_t$ and add it on. For $\\beta_t = 0.1$ the typical size of that dose is $\\sqrt{0.1} \\approx 0.3162$.</li>
        </ol>
        <p>The number $\\beta_t$ is the <b>noise dose</b> at step $t$: how much fresh noise variance step $t$ adds. It is small — in the standard setup it ranges from $0.0001$ up to $0.02$. The full list $\\beta_1, \\dots, \\beta_T$ is called the <b>noise schedule</b>, and it is chosen once, before training, and never learned. The forward process has no knobs to tune. In the language of part 4, this is a Markov chain: the recipe reads only the current $x_{t-1}$ and ignores all earlier history. Written as a probability statement, one step is:</p>
        <div class="formula-box">$$ q(x_t \\mid x_{t-1}) = \\mathcal{N}\\big(x_t;\\ \\sqrt{1-\\beta_t}\\, x_{t-1},\\ \\beta_t \\mathbf{I}\\big) $$</div>
        <p><b>Read it out loud:</b> given the data at step $t-1$, the data at step $t$ is a Gaussian draw centered at a slightly shrunken copy of $x_{t-1}$, with a small variance $\\beta_t$ in every coordinate.</p>
        <p>Recall from part 3 (or the refresher in <a onclick="App.open('prob-normal')">the normal distribution</a>) that a draw from $\\mathcal{N}(\\mu, \\sigma^2)$ can always be written as $\\mu + \\sigma z$ with $z$ a standard Gaussian draw. Applying that reparameterization here turns the probability statement into a line of code:</p>
        <div class="formula-box">$$ x_t = \\sqrt{1-\\beta_t}\\, x_{t-1} + \\sqrt{\\beta_t}\\, \\epsilon_t, \\qquad \\epsilon_t \\sim \\mathcal{N}(0, \\mathbf{I}) $$</div>
        <p><b>Read it out loud:</b> to get the next noisy image, shrink the current one by $\\sqrt{1-\\beta_t}$ and add $\\sqrt{\\beta_t}$ times a fresh standard-Gaussian noise image.</p>
        <p>One note on the symbol $\\mathbf{I}$. It says the noise is <b>isotropic</b>: every coordinate of the image gets its own independent 1-D dose of the same size, with no coordination between pixels. That is a gift for us: every calculation in this part can be done one coordinate at a time, as ordinary scalar algebra, and then read "per coordinate". We will do exactly that from here on.</p>` },

      { h: "Why the odd square root",
        body: `<p>The shrink factor $\\sqrt{1-\\beta_t}$ looks arbitrary. Why not leave $x_{t-1}$ alone and add noise? Why not shrink by $1-\\beta_t$ without the square root? The answer is a small variance computation, and it explains the entire design.</p>
        <p>Suppose the current step has variance 1 per coordinate: $\\mathrm{Var}(x_{t-1}) = 1$. (Real pixel data is scaled to roughly this range before training; part 4 already hinted that variance 1 is where this kind of chain wants to live.) Let's compute the variance after one step, one operation at a time:</p>
        <ol>
          <li>Start from the sampling form: $\\mathrm{Var}(x_t) = \\mathrm{Var}\\big(\\sqrt{1-\\beta_t}\\, x_{t-1} + \\sqrt{\\beta_t}\\, \\epsilon_t\\big)$. Allowed because $x_t$ is defined by exactly that expression.</li>
          <li>Split the variance across the sum: $\\mathrm{Var}(x_t) = \\mathrm{Var}\\big(\\sqrt{1-\\beta_t}\\, x_{t-1}\\big) + \\mathrm{Var}\\big(\\sqrt{\\beta_t}\\, \\epsilon_t\\big)$. Allowed because $\\epsilon_t$ is freshly drawn, independent of $x_{t-1}$, and part 2 proved that variances of independent variables add.</li>
          <li>Pull the constants out, squared: $\\mathrm{Var}(x_t) = (1-\\beta_t)\\,\\mathrm{Var}(x_{t-1}) + \\beta_t\\,\\mathrm{Var}(\\epsilon_t)$. Allowed by part 2's scaling rule $\\mathrm{Var}(aX) = a^2\\,\\mathrm{Var}(X)$ — and squaring is what erases the square roots.</li>
          <li>Insert the known variances, both equal to 1: $\\mathrm{Var}(x_t) = (1-\\beta_t)\\cdot 1 + \\beta_t \\cdot 1$.</li>
          <li>Add: $\\mathrm{Var}(x_t) = 1$.</li>
        </ol>
        <div class="formula-box">$$ (1-\\beta_t)\\cdot 1 + \\beta_t = 1 $$</div>
        <p><b>Read it out loud:</b> the shrink removes exactly the amount of variance that the fresh noise puts back, so the total spread of the data never changes.</p>
        <p>That is the whole point of the square root. The step swaps a $\\beta_t$-sized slice of signal variance for the same-sized slice of noise variance, keeping the total at 1 forever. Meanwhile the mean drifts to zero: $\\mathbb{E}[x_t] = \\sqrt{1-\\beta_t}\\,\\mathbb{E}[x_{t-1}]$, so every step drags the average a little closer to 0. Destination: $\\mathcal{N}(0, \\mathbf{I})$ — centered, spread 1, pure standard noise.</p>
        <p>Now compare the alternatives. <b>No shrink</b> ($x_t = x_{t-1} + \\sqrt{\\beta_t}\\,\\epsilon_t$): the variance becomes $1 + \\beta_t$ after one step and $1 + \\sum_t \\beta_t$ after all of them. For the standard schedule that sum is about $10.05$, so the data would end with variance around $11$ — the picture blows up instead of fading into standard noise, and the end state depends on the schedule. <b>Shrink by $1-\\beta_t$ without the root</b>: the variance becomes $(1-\\beta_t)^2 + \\beta_t = 1 - \\beta_t + \\beta_t^2$, slightly below 1, so spread leaks away step after step and the end state is too small. The square root is the one choice that balances the books exactly.</p>` },

      { h: "Names for what survives: alpha and alpha-bar",
        body: `<p>Two abbreviations make everything ahead cleaner. First, define $\\alpha_t = 1 - \\beta_t$: the <b>survival factor</b>, the fraction of variance the signal keeps at step $t$. With it, one forward step reads $x_t = \\sqrt{\\alpha_t}\\, x_{t-1} + \\sqrt{1-\\alpha_t}\\,\\epsilon_t$. Second, define the <b>cumulative survival</b>:</p>
        <div class="formula-box">$$ \\bar\\alpha_t = \\prod_{s=1}^{t} \\alpha_s = \\alpha_1 \\cdot \\alpha_2 \\cdots \\alpha_t $$</div>
        <p><b>Read it out loud:</b> $\\bar\\alpha_t$ is the product of all the survival factors up to step $t$ — the fraction of the original signal's variance that survives $t$ rounds of shrinking.</p>
        <p>Why a product? Each step keeps an $\\alpha_s$ fraction of the variance that reached it, and fractions of fractions multiply: keep 90%, then keep 80% of that, and you hold $0.9 \\times 0.8 = 72\\%$ of the original. One convention we will use constantly: $\\bar\\alpha_0 = 1$, because before any steps, all of the signal survives (a product of zero factors is 1).</p>
        <p>Here is the tiny chain that will be our shared hand example for parts 6 through 9. Take $T = 3$ with doses $\\beta = (0.1,\\ 0.2,\\ 0.3)$ — far larger than real doses, so the arithmetic stays visible:</p>
        <table class="symbols">
          <tr><td><b>step $t$</b></td><td><b>$\\beta_t$</b></td><td><b>$\\alpha_t = 1-\\beta_t$</b></td><td><b>$\\bar\\alpha_t$ (running product)</b></td></tr>
          <tr><td>1</td><td>0.1</td><td>0.9</td><td>$0.9$</td></tr>
          <tr><td>2</td><td>0.2</td><td>0.8</td><td>$0.9 \\times 0.8 = 0.72$</td></tr>
          <tr><td>3</td><td>0.3</td><td>0.7</td><td>$0.72 \\times 0.7 = 0.504$</td></tr>
        </table>
        <p>Plain reading: after three doses, about half of the original signal's variance is still there. Memorize these numbers — $\\bar\\alpha = (0.9,\\ 0.72,\\ 0.504)$. They will reappear in every hand calculation through part 9.</p>` },

      { h: "The shortcut: jumping straight to step t",
        body: `<p>Training will need noisy versions of images at random steps, millions of times. Looping $t$ steps for every training example would be painfully slow. Luckily, the chain has a closed form: you can jump from $x_0$ straight to $x_t$ in one draw. We will derive it by composing two steps and then note that the same argument repeats forever.</p>
        <p>Write out the first two steps of the chain using the $\\alpha$ notation:</p>
        <p>$x_1 = \\sqrt{\\alpha_1}\\, x_0 + \\sqrt{1-\\alpha_1}\\,\\epsilon_1$ and $x_2 = \\sqrt{\\alpha_2}\\, x_1 + \\sqrt{1-\\alpha_2}\\,\\epsilon_2$, where $\\epsilon_1$ and $\\epsilon_2$ are independent standard Gaussian draws — step 2's dose is drawn fresh, with no memory of step 1's. Now, one operation at a time:</p>
        <ol>
          <li><b>Substitute</b> the expression for $x_1$ into the $x_2$ line: $x_2 = \\sqrt{\\alpha_2}\\big(\\sqrt{\\alpha_1}\\, x_0 + \\sqrt{1-\\alpha_1}\\,\\epsilon_1\\big) + \\sqrt{1-\\alpha_2}\\,\\epsilon_2$. Allowed because $x_1$ is equal to that expression by definition.</li>
          <li><b>Distribute</b> $\\sqrt{\\alpha_2}$ across the parenthesis: $x_2 = \\sqrt{\\alpha_2}\\sqrt{\\alpha_1}\\, x_0 + \\sqrt{\\alpha_2}\\sqrt{1-\\alpha_1}\\,\\epsilon_1 + \\sqrt{1-\\alpha_2}\\,\\epsilon_2$. Allowed because multiplication distributes over addition.</li>
          <li><b>Combine the roots</b> in front of $x_0$: $\\sqrt{\\alpha_2}\\sqrt{\\alpha_1} = \\sqrt{\\alpha_1\\alpha_2} = \\sqrt{\\bar\\alpha_2}$. Allowed because a product of square roots of nonnegative numbers is the square root of the product, and $\\alpha_1\\alpha_2$ is the definition of $\\bar\\alpha_2$. The signal part is now $\\sqrt{\\bar\\alpha_2}\\, x_0$.</li>
          <li><b>Identify the first noise term's distribution</b>: $\\sqrt{\\alpha_2}\\sqrt{1-\\alpha_1}\\,\\epsilon_1 \\sim \\mathcal{N}\\big(0,\\ \\alpha_2(1-\\alpha_1)\\big)$. Allowed by part 3's scaling rule: a constant times a standard Gaussian is Gaussian with the constant squared as variance.</li>
          <li><b>Identify the second noise term's distribution</b>: $\\sqrt{1-\\alpha_2}\\,\\epsilon_2 \\sim \\mathcal{N}(0,\\ 1-\\alpha_2)$, by the same scaling rule.</li>
          <li><b>Add the two noise terms.</b> Because $\\epsilon_1$ and $\\epsilon_2$ are independent, part 3's sum rule applies: the sum of independent Gaussians is Gaussian, and the variances add. Total noise $\\sim \\mathcal{N}\\big(0,\\ \\alpha_2(1-\\alpha_1) + (1-\\alpha_2)\\big)$. This is the one line in the whole derivation where independence is essential — with correlated doses, neither "the variances add" nor "the sum is Gaussian" would be guaranteed.</li>
          <li><b>Expand</b> the first product inside the variance: $\\alpha_2(1-\\alpha_1) = \\alpha_2 - \\alpha_1\\alpha_2$, by distributing.</li>
          <li><b>Add the second piece and cancel</b>: $\\alpha_2 - \\alpha_1\\alpha_2 + 1 - \\alpha_2 = 1 - \\alpha_1\\alpha_2$. The $+\\alpha_2$ and $-\\alpha_2$ cancel.</li>
          <li><b>Recognize</b> $\\alpha_1\\alpha_2 = \\bar\\alpha_2$: the total noise variance is $1 - \\bar\\alpha_2$. So $x_2 = \\sqrt{\\bar\\alpha_2}\\, x_0 + \\sqrt{1-\\bar\\alpha_2}\\,\\epsilon$ for a single standard Gaussian $\\epsilon$.</li>
        </ol>
        <p>Nothing in that argument cared that $t$ was 2. If the claim holds up to step $t-1$, one more round of the same three moves — substitute, combine roots, add independent variances — gives variance $\\alpha_t(1-\\bar\\alpha_{t-1}) + (1-\\alpha_t) = 1 - \\alpha_t\\bar\\alpha_{t-1} = 1 - \\bar\\alpha_t$ at step $t$. So the pattern continues for every $t$; that repeat-forever argument is called induction. The result:</p>
        <div class="formula-box">$$ q(x_t \\mid x_0) = \\mathcal{N}\\big(x_t;\\ \\sqrt{\\bar\\alpha_t}\\, x_0,\\ (1-\\bar\\alpha_t)\\,\\mathbf{I}\\big) $$</div>
        <p><b>Read it out loud:</b> skipping straight from the clean image to step $t$, the result is a Gaussian centered at $\\sqrt{\\bar\\alpha_t}$ times the clean image, with noise variance $1-\\bar\\alpha_t$ in every coordinate.</p>
        <p>Reparameterizing one more time gives the <b>one-line sampler</b>, the single most-executed equation in diffusion models:</p>
        <div class="formula-box">$$ x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, \\mathbf{I}) $$</div>
        <p><b>Read it out loud:</b> a noisy image at step $t$ is a weighted blend — $\\sqrt{\\bar\\alpha_t}$ parts clean image plus $\\sqrt{1-\\bar\\alpha_t}$ parts fresh noise.</p>
        <p>This is Eq. 4 of the <a onclick="App.open('paper-ddpm')">DDPM paper</a>. Training will call this line millions of times: pick an image, pick a random $t$, draw one $\\epsilon$, blend. No loops, no history — one draw per training example. That efficiency is not a nice-to-have; without it, training a diffusion model would be impractical.</p>` },

      { h: "The hand check: two roads to the same place",
        body: `<p>Let's verify the shortcut on the running example, with real numbers you can redo on paper. Take $x_0 = 2$ (one coordinate of some clean data point) and ask: what are the mean and variance of $x_2$, the data after two doses?</p>
        <p><b>Road A — step by step.</b> Track the mean and variance through each dose, using the rules from the last two sections.</p>
        <ol>
          <li>Step 1 mean: $\\sqrt{\\alpha_1}\\, x_0 = \\sqrt{0.9} \\times 2 = 0.9487 \\times 2 = 1.8974$. The noise adds nothing to the mean because its center is 0.</li>
          <li>Step 1 variance: the input $x_0 = 2$ is a fixed number with variance 0, so $\\mathrm{Var}(x_1) = \\alpha_1 \\cdot 0 + \\beta_1 = 0.1$.</li>
          <li>Step 2 mean: $\\sqrt{\\alpha_2} \\times 1.8974 = \\sqrt{0.8} \\times 1.8974 = 0.8944 \\times 1.8974 = 1.6971$.</li>
          <li>Step 2 variance: scale then add the fresh dose — $\\alpha_2 \\times 0.1 + \\beta_2 = 0.8 \\times 0.1 + 0.2 = 0.08 + 0.2 = 0.28$.</li>
        </ol>
        <p><b>Road B — the closed form, one jump.</b> Mean: $\\sqrt{\\bar\\alpha_2}\\, x_0 = \\sqrt{0.72} \\times 2 = 0.8485 \\times 2 = 1.6971$. Variance: $1 - \\bar\\alpha_2 = 1 - 0.72 = 0.28$.</p>
        <p>Both roads give $q(x_2 \\mid x_0 = 2) = \\mathcal{N}(1.6971,\\ 0.28)$, agreeing to every decimal we computed. The shortcut is not an approximation — it is the same distribution, reached without the loop.</p>
        <p>One more concrete drill: draw an actual sample. Suppose the random draw comes out $\\epsilon = 1.0$. Then $x_2 = 1.6971 + \\sqrt{0.28} \\times 1.0 = 1.6971 + 0.5292 = 2.2263$. A different $\\epsilon$ gives a different $x_2$; the formula pins down the recipe, not the outcome. The notebook runs this check with 5,000 samples down both roads and the histograms lie on top of each other.</p>` },

      { h: "Schedules: choosing how fast to destroy",
        body: `<p>Everything so far works for any list of doses. Which list should we use? The DDPM paper's choice — the <b>linear schedule</b> — ramps the doses evenly from $\\beta_1 = 10^{-4}$ up to $\\beta_T = 0.02$ over $T = 1000$ steps. Early steps barely whisper noise; late steps pour it on. What matters for us downstream is the curve of $\\bar\\alpha_t$: near 1 for a long opening stretch, then sliding down toward 0.</p>
        <p>How close to 0 does it get? You can estimate this by hand with one honest approximation: for small $x$, $\\log(1-x) \\approx -x$ (numeric check: $\\log(0.98) = -0.0202$, close to $-0.02$). Taking the log of the product turns it into a sum:</p>
        <ol>
          <li>$\\log \\bar\\alpha_T = \\sum_{t=1}^{T} \\log(1-\\beta_t)$, because the log of a product is the sum of the logs (part 5 used this same move for likelihoods).</li>
          <li>$\\approx -\\sum_{t=1}^{T} \\beta_t$, applying $\\log(1-x) \\approx -x$ to each small term.</li>
          <li>The doses ramp evenly, so their average is the midpoint $\\tfrac{0.0001 + 0.02}{2} = 0.01005$, and the sum is $1000 \\times 0.01005 = 10.05$.</li>
          <li>So $\\bar\\alpha_T \\approx e^{-10.05} \\approx 4.3 \\times 10^{-5}$. The exact product (the notebook computes it) is $4.04 \\times 10^{-5}$ — the estimate is off by 7%, fine for a two-line hand calculation.</li>
        </ol>
        <p>Read that number: at the end of the forward process, about $0.00004$ of the original signal's variance survives. The image is, for every practical purpose, gone — $x_T$ is standard noise. That is exactly what part 8 needs when it fixes the generative model's starting distribution to $\\mathcal{N}(0, \\mathbf{I})$.</p>
        <p>A handy single number summarizes "how destroyed" step $t$ is — the <b>signal-to-noise ratio</b>:</p>
        <div class="formula-box">$$ \\mathrm{SNR}(t) = \\frac{\\bar\\alpha_t}{1-\\bar\\alpha_t} $$</div>
        <p><b>Read it out loud:</b> the signal-to-noise ratio at step $t$ is the surviving signal variance divided by the accumulated noise variance — how many parts signal per part noise.</p>
        <p>On the running example: $\\mathrm{SNR}(1) = 0.9/0.1 = 9$, $\\mathrm{SNR}(2) = 0.72/0.28 \\approx 2.57$, $\\mathrm{SNR}(3) = 0.504/0.496 \\approx 1.02$. By the third dose, signal and noise have an equal say. On the real schedule, $\\mathrm{SNR}$ starts around $10{,}000$ and ends near $0.00004$ — a fall of over eight orders of magnitude, spread across 1000 steps.</p>
        <p>The linear schedule is not the only option. A popular alternative, the <b>cosine schedule</b>, picks the $\\bar\\alpha_t$ curve directly, making it fall along a smooth cosine arc: $\\bar\\alpha_t \\propto \\cos^2\\big(\\tfrac{t/T + s}{1 + s} \\cdot \\tfrac{\\pi}{2}\\big)$ with a small offset $s = 0.008$. The motivation is that the linear schedule wastes steps at both ends — early steps change the image imperceptibly, and late steps keep pounding an image that is already pure noise. The cosine curve spreads the destruction more evenly across $t$. The notebook plots both curves side by side; the difference is easy to see and worth a careful look.</p>` },

      { h: "Sanity checks",
        body: `<p>Let's stress-test the results of this part the way part 2 taught us — limits, special cases, and shapes.</p>
        <ul>
          <li><b>Zero dose.</b> If $\\beta_t = 0$, the kernel becomes $x_t = \\sqrt{1}\\, x_{t-1} + 0 = x_{t-1}$: no dose, no change. The recipe does nothing when told to do nothing.</li>
          <li><b>First step.</b> At $t = 1$ the closed form says $x_1 = \\sqrt{\\bar\\alpha_1}\\, x_0 + \\sqrt{1-\\bar\\alpha_1}\\,\\epsilon$ with $\\bar\\alpha_1 = \\alpha_1$ — which is word for word the kernel applied once. The shortcut agrees with the chain on the shortest possible trip.</li>
          <li><b>$\\bar\\alpha_t$ always falls.</b> Each factor $\\alpha_s = 1 - \\beta_s$ is strictly below 1 (every dose is positive), so the running product strictly decreases and stays inside $(0, 1)$. Destruction never reverses on its own.</li>
          <li><b>The weights are partners.</b> $(\\sqrt{\\bar\\alpha_t})^2 + (\\sqrt{1-\\bar\\alpha_t})^2 = \\bar\\alpha_t + 1 - \\bar\\alpha_t = 1$. So if the dataset itself has mean 0 and variance 1 per coordinate, then $\\mathrm{Var}(x_t) = \\bar\\alpha_t \\cdot 1 + (1-\\bar\\alpha_t) \\cdot 1 = 1$ at every single $t$: the picture never blows up or shrinks — its content converts from signal to noise at constant total size.</li>
          <li><b>SNR only falls.</b> $\\mathrm{SNR}(t)$ is built from $\\bar\\alpha_t$ by a rising function ($u \\mapsto u/(1-u)$ increases as $u$ increases), so a falling $\\bar\\alpha_t$ means a falling SNR. Noise never loses ground.</li>
          <li><b>Constant-dose special case.</b> If every dose equals the same $\\beta$, then $\\bar\\alpha_t = (1-\\beta)^t$: clean exponential decay. This is exactly the number-line chain from part 4, now seen as one member of the schedule family.</li>
        </ul>` },

      { h: "What you can do now",
        body: `<p>You now own the entire forward half of a diffusion model. You can state the kernel $q(x_t \\mid x_{t-1})$ and explain why the strange $\\sqrt{1-\\beta_t}$ is the unique shrink that keeps variance balanced at 1. You can compute $\\alpha_t$ and $\\bar\\alpha_t$ for any schedule, derive the closed form $q(x_t \\mid x_0)$ from scratch — and point at the exact step where independence of the noise doses earns its keep. You can noise any data point to any level with the one-line sampler, and you verified by hand, on the $T=3$ running example, that the stepwise road and the one-jump road land on the same distribution: $\\mathcal{N}(1.6971,\\ 0.28)$. You can read a schedule's $\\bar\\alpha_t$ and SNR curves, and you know that after the real schedule's 1000 steps only $0.00004$ of the image survives.</p>
        <p>Here is the cliffhanger. Destruction is a one-line pleasure — but generation must run this movie backwards: given the noisy $x_t$, produce a plausible $x_{t-1}$. Part 4 promised that reversing a chain is a Bayes-flip problem, and part 2 gave us Bayes' rule. In part 7 we will aim those tools, plus part 3's complete-the-square recipe, at the forward kernel — and derive the exact reverse step $q(x_{t-1} \\mid x_t, x_0)$: the perfect one-step denoiser, valid whenever you know the clean image $x_0$. The catch inside that "whenever" is what the rest of the course is about.</p>` }
    ],
    symbols: [
      { sym: "$x_0$", desc: "a clean data point — an image flattened into a list of numbers" },
      { sym: "$x_t$", desc: "the data after $t$ small doses of noise" },
      { sym: "$T$", desc: "total number of noising steps (1000 in the standard setup; 3 in the hand example)" },
      { sym: "$\\beta_t$", desc: "the noise dose at step $t$ — how much fresh noise variance step $t$ adds (a small number like 0.0001-0.02)" },
      { sym: "$\\alpha_t = 1 - \\beta_t$", desc: "the survival factor — the fraction of variance kept at step $t$" },
      { sym: "$\\bar\\alpha_t = \\prod_{s=1}^{t} \\alpha_s$", desc: "the cumulative survival — the fraction of the original signal's variance surviving to step $t$; convention $\\bar\\alpha_0 = 1$" },
      { sym: "$\\epsilon, \\epsilon_t \\sim \\mathcal{N}(0, \\mathbf{I})$", desc: "fresh standard Gaussian noise, drawn independently at each step" },
      { sym: "$q(x_t \\mid x_{t-1})$", desc: "the forward kernel — the fixed one-step noising recipe" },
      { sym: "$q(x_t \\mid x_0)$", desc: "the closed form — jump straight from clean data to step $t$" },
      { sym: "$\\mathcal{N}(x;\\, \\mu, \\sigma^2)$", desc: "bell curve with center $\\mu$ and spread (variance) $\\sigma^2$" },
      { sym: "$\\mathbf{I}$", desc: "isotropic noise marker — every coordinate gets its own independent unit-variance dose" },
      { sym: "$\\mathrm{Var}(X)$", desc: "the variance — the typical squared spread of $X$ (part 2)" },
      { sym: "$\\mathrm{SNR}(t) = \\bar\\alpha_t / (1-\\bar\\alpha_t)$", desc: "signal-to-noise ratio at step $t$ — surviving signal variance per unit of noise variance" }
    ],
    recall: [
      "In one plain-English sentence, what does the forward kernel do to an image at step $t$?",
      "Why multiply by $\\sqrt{1-\\beta_t}$ before adding the noise, rather than leaving $x_{t-1}$ alone or shrinking by $1-\\beta_t$?",
      "What is $\\bar\\alpha_t$ in words, and what is its value at $t = 0$?",
      "Write the one-line sampler from memory. Which term is the surviving signal and which is the noise?",
      "In the closed-form derivation, at exactly which step is the independence of $\\epsilon_1$ and $\\epsilon_2$ required, and what could fail without it?",
      "What is $\\mathrm{SNR}(t)$, and what does $\\mathrm{SNR}(t) = 1$ mean in plain English?",
      "For the linear schedule with $T = 1000$, roughly what fraction of the original signal's variance survives to $x_T$?"
    ],
    practice: [
      { q: "A new schedule has $T = 2$ with $\\beta = (0.2,\\ 0.5)$. Compute $\\alpha_1, \\alpha_2$, then $\\bar\\alpha_1, \\bar\\alpha_2$, and finally the mean and variance of $q(x_2 \\mid x_0)$ for $x_0 = 3$.",
        steps: [
          { do: "Compute the survival factors: $\\alpha_1 = 1 - 0.2 = 0.8$ and $\\alpha_2 = 1 - 0.5 = 0.5$.",
            why: "By definition $\\alpha_t = 1 - \\beta_t$: whatever variance the dose adds, the shrink removed the same fraction first." },
          { do: "Form the running products: $\\bar\\alpha_1 = 0.8$, then $\\bar\\alpha_2 = 0.8 \\times 0.5 = 0.4$.",
            why: "Cumulative survival is the product of the per-step survivals — fractions of fractions multiply." },
          { do: "Compute the closed-form mean: $\\sqrt{\\bar\\alpha_2}\\, x_0 = \\sqrt{0.4} \\times 3 = 0.6325 \\times 3 = 1.8974$.",
            why: "The closed form $q(x_t \\mid x_0) = \\mathcal{N}(\\sqrt{\\bar\\alpha_t}\\, x_0,\\ 1-\\bar\\alpha_t)$ says the center is the clean value scaled by $\\sqrt{\\bar\\alpha_t}$." },
          { do: "Compute the closed-form variance: $1 - \\bar\\alpha_2 = 1 - 0.4 = 0.6$.",
            why: "All the variance that did not survive as signal has been replaced by noise — the weights are partners summing to 1." }
        ],
        answer: "$\\alpha = (0.8,\\ 0.5)$, $\\bar\\alpha = (0.8,\\ 0.4)$, and $q(x_2 \\mid x_0 = 3) = \\mathcal{N}(1.8974,\\ 0.6)$." },

      { q: "Rerun the two-step composition with fresh numbers: $\\alpha_1 = 0.96$, $\\alpha_2 = 0.75$. Show by the stepwise route that the total noise variance after two steps equals $1 - \\alpha_1\\alpha_2$, and give the signal coefficient.",
        steps: [
          { do: "Substitute step 1 into step 2: $x_2 = \\sqrt{0.75}\\big(\\sqrt{0.96}\\, x_0 + \\sqrt{0.04}\\,\\epsilon_1\\big) + \\sqrt{0.25}\\,\\epsilon_2$.",
            why: "$x_1$ equals the inner expression by the definition of the forward step, so we may replace it." },
          { do: "Distribute $\\sqrt{0.75}$: $x_2 = \\sqrt{0.72}\\, x_0 + \\sqrt{0.75}\\sqrt{0.04}\\,\\epsilon_1 + \\sqrt{0.25}\\,\\epsilon_2$, using $\\sqrt{0.75}\\sqrt{0.96} = \\sqrt{0.72}$.",
            why: "Multiplication distributes over addition, and a product of square roots is the square root of the product." },
          { do: "Find the first noise term's variance: $0.75 \\times 0.04 = 0.03$.",
            why: "Scaling a standard Gaussian by a constant squares the constant into the variance (part 3's scaling rule)." },
          { do: "Find the second noise term's variance: $0.25$.",
            why: "Same scaling rule: $(\\sqrt{0.25})^2 = 0.25$." },
          { do: "Add the variances: $0.03 + 0.25 = 0.28$.",
            why: "The doses $\\epsilon_1, \\epsilon_2$ are independent, so their variances add and the sum stays Gaussian (part 3's sum rule)." },
          { do: "Compare with the closed form: $1 - \\alpha_1\\alpha_2 = 1 - 0.96 \\times 0.75 = 1 - 0.72 = 0.28$. Match.",
            why: "This is the general identity $\\alpha_2(1-\\alpha_1) + (1-\\alpha_2) = 1 - \\alpha_1\\alpha_2$ evaluated at our numbers — both roads must agree." }
        ],
        answer: "Total noise variance $= 0.28 = 1 - \\alpha_1\\alpha_2$, and the signal coefficient is $\\sqrt{0.72} \\approx 0.8485$; equivalently $\\bar\\alpha_2 = 0.72$." },

      { q: "In the closed-form derivation, where exactly is the independence of $\\epsilon_1$ and $\\epsilon_2$ used — and why is it safe to assume?",
        steps: [
          { do: "Locate the move: independence is used when the two scaled noise terms are merged into one Gaussian with variance $\\alpha_2(1-\\alpha_1) + (1-\\alpha_2)$ — the 'add the variances' step.",
            why: "Every other step is pure algebra (substituting, distributing, combining roots) and would hold for any random variables." },
          { do: "Recall part 2's rule: $\\mathrm{Var}(X+Y) = \\mathrm{Var}(X) + \\mathrm{Var}(Y)$ holds when the cross term $\\mathbb{E}[XY] - \\mathbb{E}[X]\\mathbb{E}[Y]$ vanishes, which independence guarantees.",
            why: "For correlated variables the cross term survives and the variances would not add — the closed form's variance would be wrong." },
          { do: "Note the second dependence on independence: part 3's sum rule promises the merged term is Gaussian at all only for independent Gaussian summands.",
            why: "Without it, we could not even name the result a Gaussian, and the closed form would lose its $\\mathcal{N}(\\cdot)$ shape." },
          { do: "Justify the assumption: the chain's definition draws $\\epsilon_t$ fresh at every step, with no look at earlier draws or earlier data.",
            why: "Independence is not a lucky accident — it is built into the forward process on purpose, precisely so this derivation goes through." }
        ],
        answer: "It is used once, at the merge of the two noise terms: independence makes the variances add and keeps the sum Gaussian. It holds because each dose is drawn fresh by construction." },

      { q: "For the running example ($\\bar\\alpha = (0.9,\\ 0.72,\\ 0.504)$), compute $\\mathrm{SNR}(1)$, $\\mathrm{SNR}(2)$, $\\mathrm{SNR}(3)$, and interpret the value at $t = 3$.",
        steps: [
          { do: "Compute $\\mathrm{SNR}(1) = \\bar\\alpha_1 / (1-\\bar\\alpha_1) = 0.9 / 0.1 = 9$.",
            why: "The definition divides surviving signal variance by accumulated noise variance." },
          { do: "Compute $\\mathrm{SNR}(2) = 0.72 / 0.28 = 2.5714$.",
            why: "Same definition at $t = 2$; the ratio has already dropped by a factor of about 3.5." },
          { do: "Compute $\\mathrm{SNR}(3) = 0.504 / 0.496 = 1.0161$.",
            why: "Same definition at $t = 3$." },
          { do: "Interpret: $\\mathrm{SNR}(3) \\approx 1$ means signal variance and noise variance are nearly equal — what you see is half signal, half static.",
            why: "SNR $= 1$ is exactly the crossover point where noise catches up with signal, a natural landmark on any schedule." }
        ],
        answer: "$\\mathrm{SNR} = (9,\\ 2.5714,\\ 1.0161)$; by $t = 3$ the toy chain has destroyed enough that signal and noise have an equal say." },

      { q: "Double every dose in the running example: $\\beta = (0.2,\\ 0.4,\\ 0.6)$. Compute the new $\\bar\\alpha_t$, compare with the originals, and explain the small-dose rule of thumb for what doubling all $\\beta$ does to $\\bar\\alpha_t$.",
        steps: [
          { do: "Compute the new survival factors: $\\alpha = (0.8,\\ 0.6,\\ 0.4)$.",
            why: "$\\alpha_t = 1 - \\beta_t$, applied to each doubled dose." },
          { do: "Form the running products one multiplication at a time: $\\bar\\alpha_1 = 0.8$; $\\bar\\alpha_2 = 0.8 \\times 0.6 = 0.48$; $\\bar\\alpha_3 = 0.48 \\times 0.4 = 0.192$.",
            why: "Cumulative survival is the product of survivals — same recipe as before, new numbers." },
          { do: "Compare with the originals $(0.9,\\ 0.72,\\ 0.504)$: survival at $t = 3$ fell from about half to about a fifth.",
            why: "Bigger doses at every step compound — each factor is smaller, and products punish that multiplicatively." },
          { do: "State the small-dose rule: since $\\log\\bar\\alpha_t \\approx -\\sum_s \\beta_s$, doubling every dose doubles the log — which squares $\\bar\\alpha_t$ itself (because $e^{2u} = (e^u)^2$).",
            why: "The $\\log(1-x) \\approx -x$ approximation from the schedules section turns products into sums, where doubling is easy to track." },
          { do: "Check the rule against the exact numbers: the rule predicts $0.504^2 = 0.254$, the truth is $0.192$ — right direction, imperfect because these toy doses are not small.",
            why: "An honest approximation comes with its error bar: at real-schedule doses (0.0001-0.02) the squaring rule is excellent; at 0.3-sized doses it is only a sketch." }
        ],
        answer: "New $\\bar\\alpha = (0.8,\\ 0.48,\\ 0.192)$ versus $(0.9,\\ 0.72,\\ 0.504)$ — destruction is much faster. Rule of thumb: doubling every $\\beta$ approximately squares $\\bar\\alpha_t$, exact in the small-dose limit." },

      { q: "Show why the shrink is necessary: run the no-shrink recipe $x_t = x_{t-1} + \\sqrt{\\beta_t}\\,\\epsilon_t$ on the running example, starting from data with $\\mathrm{Var}(x_0) = 1$, and contrast with the real kernel.",
        steps: [
          { do: "Step 1: $\\mathrm{Var}(x_1) = \\mathrm{Var}(x_0) + \\beta_1 = 1 + 0.1 = 1.1$.",
            why: "The dose is independent of the data, so variances add (part 2), and nothing shrinks the incoming variance first." },
          { do: "Step 2: $\\mathrm{Var}(x_2) = 1.1 + 0.2 = 1.3$.",
            why: "Same rule again — each dose piles its variance on top of everything already there." },
          { do: "Step 3: $\\mathrm{Var}(x_3) = 1.3 + 0.3 = 1.6$.",
            why: "Same rule; after $t$ steps the variance is $1 + \\sum_s \\beta_s$, growing without bound as steps accumulate." },
          { do: "Contrast with the real kernel: each step gives $(1-\\beta_t) \\cdot 1 + \\beta_t = 1$, so the variance stays exactly 1 at every step.",
            why: "The $\\sqrt{1-\\beta_t}$ shrink removes exactly the variance the dose is about to add — the books balance." },
          { do: "Scale the failure up: on the real schedule $\\sum \\beta_t \\approx 10.05$, so the no-shrink end state has variance around $11.05$ (standard deviation about 3.3), not 1.",
            why: "Generation in part 8 must start from a known, fixed distribution; a $\\mathcal{N}(0, 11)$-ish end state that depends on the schedule would break that contract, while the real kernel delivers $\\mathcal{N}(0, 1)$ every time." }
        ],
        answer: "Without the shrink, variance grows to $1 + \\sum_s \\beta_s$ ($1.6$ after the toy chain, about $11$ on the real schedule). With the shrink it stays exactly 1, so the end state is the standard Gaussian we need." },

      { q: "One-line sampler plug-in: with the running example, $x_0 = 1.5$, $t = 2$, and the noise draw $\\epsilon = -0.5$, compute $x_2$ to four decimals.",
        steps: [
          { do: "Look up the cumulative survival: $\\bar\\alpha_2 = 0.72$.",
            why: "The one-line sampler needs only $\\bar\\alpha_t$ at the target step — that is the entire point of the closed form." },
          { do: "Compute the signal part: $\\sqrt{0.72} \\times 1.5 = 0.8485 \\times 1.5 = 1.2728$.",
            why: "The clean value is scaled by $\\sqrt{\\bar\\alpha_t}$, the surviving signal amplitude." },
          { do: "Compute the noise weight: $\\sqrt{1 - 0.72} = \\sqrt{0.28} = 0.5292$.",
            why: "The noise is scaled by $\\sqrt{1-\\bar\\alpha_t}$ so that its variance contribution is $1-\\bar\\alpha_t$." },
          { do: "Compute the noise part: $0.5292 \\times (-0.5) = -0.2646$.",
            why: "Multiply the weight by the actual draw; a negative draw pushes the sample below its mean." },
          { do: "Add the parts: $x_2 = 1.2728 - 0.2646 = 1.0082$.",
            why: "The sampler is a weighted blend — signal part plus noise part, nothing more." }
        ],
        answer: "$x_2 = \\sqrt{0.72} \\times 1.5 + \\sqrt{0.28} \\times (-0.5) \\approx 1.0082$." }
    ]
  });
})();
