/* Rigorous Courses · Diffusion Models — Part 09: Predict the noise: the loss that trains Stable Diffusion.
   Owns the reparameterization from posterior means to noise prediction, the weighted objective (DDPM Eq. 12),
   L_simple (Eq. 14), and Algorithms 1 and 2 line by line. */
(function () {
  window.LESSONS.push({
    id: "diff-09-simple-loss",
    title: "Part 9 — Predict the noise: the loss that trains Stable Diffusion",
    tagline: "Rewrite the posterior mean in terms of the noise, and the whole training objective collapses to one mean-squared error",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 9,
    partTotal: 12,
    prereqs: ["diff-08-variational-bound"],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Invert the one-line sampler to write the clean point $x_0$ in terms of the noisy point $x_t$ and the noise $\\epsilon$.</li>
        <li>Carry out, line by line, the substitution that turns the posterior mean $\\tilde\\mu_t$ into its noise form $\\frac{1}{\\sqrt{\\alpha_t}}\\big(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon\\big)$.</li>
        <li>Derive the weighted objective (DDPM Eq. 12) and explain why dropping the weight to get $L_{\\mathrm{simple}}$ (Eq. 14) is a choice, not a theorem.</li>
        <li>Execute Algorithm 1 (training) and Algorithm 2 (sampling) on paper with real numbers, including the $z = 0$ rule at the final step.</li>
        <li>Explain why the algorithm works with any good noise-guesser — a neural network is one way to build that guesser, not part of the theory.</li>
      </ul>`,
    sections: [
      {
        h: "Where we are",
        body: `<p>Here is the state of the course in one breath. Parts 2-5 built the toolkit: probability, the Gaussian, Markov chains, and the ELBO. <b>Part 6</b> defined the forward noising process and proved the closed form $q(x_t \\mid x_0) = \\mathcal{N}(\\sqrt{\\bar\\alpha_t}\\,x_0,\\ (1-\\bar\\alpha_t)\\mathbf{I})$, which gave us the one-line sampler: jump from clean to any noise level in a single draw. <b>Part 7</b> ran the noise backwards: if you know the clean point $x_0$, the exact one-step denoiser is a Gaussian, $q(x_{t-1} \\mid x_t, x_0) = \\mathcal{N}(\\tilde\\mu_t, \\tilde\\beta_t)$, with an explicit formula for the mean $\\tilde\\mu_t$ that blends $x_t$ and $x_0$. <b>Part 8</b> turned all of that into one number to train on: maximizing the ELBO means, step by step, making the network's mean $\\mu_\\theta(x_t, t)$ hit the true posterior mean, at cost $\\frac{1}{2\\sigma_t^2}\\|\\tilde\\mu_t - \\mu_\\theta(x_t, t)\\|^2$ per step.</p>
        <p>One gap has been nagging us since part 7: the formula for $\\tilde\\mu_t$ needs $x_0$, the clean data point. During training we have it. During generation we start from pure noise, and $x_0$ is exactly the thing we are trying to create. This part closes the gap with one clean idea: rewrite everything in terms of the <b>noise</b> instead of the clean point, and train the network to guess the noise. Out the other end comes the exact loss — DDPM's Equation 14 — that, scaled up, trains Stable Diffusion, plus the two short algorithms that do all the work. After this part, everything left in the course is engineering and speed.</p>`
      },
      {
        h: "Step 1 — Undo the sampler: the clean point in terms of the noise",
        body: `<p>Start from part 6's one-line sampler. Recall the cast: $\\bar\\alpha_t$ is the fraction of the original signal's variance that survives to step $t$, and $\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$ is fresh standard Gaussian noise.</p>
        <div class="formula-box">$$x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$$</div>
        <p><b>Read it out loud:</b> the noisy point at step $t$ is the clean point shrunk by the factor $\\sqrt{\\bar\\alpha_t}$, plus fresh noise scaled up by $\\sqrt{1-\\bar\\alpha_t}$.</p>
        <p>This equation has three players: $x_t$, $x_0$, and $\\epsilon$. Fix any two and the third is determined. That single observation powers this whole part. Let's solve for $x_0$, one operation per step.</p>
        <ol>
          <li><b>Do:</b> subtract $\\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$ from both sides, giving $x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon = \\sqrt{\\bar\\alpha_t}\\,x_0$. <b>Why:</b> subtracting the same quantity from both sides keeps an equation true, and it isolates the term that contains $x_0$.</li>
          <li><b>Do:</b> divide both sides by $\\sqrt{\\bar\\alpha_t}$, giving the boxed result below. <b>Why:</b> $\\bar\\alpha_t$ is a product of numbers strictly between 0 and 1, so it is positive and never zero — dividing by it is always allowed.</li>
        </ol>
        <div class="formula-box">$$x_0 = \\frac{x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon}{\\sqrt{\\bar\\alpha_t}}$$</div>
        <p><b>Read it out loud:</b> to recover the clean point, take the noisy point, remove the noise scaled exactly the way it was added, then undo the shrinking.</p>
        <p>Check it with the running example from part 6: $T = 3$, $\\beta = (0.1, 0.2, 0.3)$, so $\\bar\\alpha_2 = 0.72$. Take $x_0 = 2$ and $\\epsilon = 0.5$. Forward: $x_2 = \\sqrt{0.72}\\cdot 2 + \\sqrt{0.28}\\cdot 0.5 = 1.6971 + 0.2646 = 1.9616$. Backward: $(1.9616 - \\sqrt{0.28}\\cdot 0.5)/\\sqrt{0.72} = (1.9616 - 0.2646)/0.8485 = 1.6971/0.8485 = 2.0000$. The clean point comes back exactly, to every decimal we kept.</p>
        <p>Why this matters: at generation time nobody hands us $x_0$. But if a network can look at $x_t$ and guess the noise $\\epsilon$ hiding inside it, this equation instantly converts that guess into a guess for $x_0$. <b>Guessing the noise and guessing the clean point are the same skill</b> wearing different clothes.</p>`
      },
      {
        h: "Step 2 — The messy middle: substituting into the posterior mean",
        body: `<p>Now recall part 7's hard-won prize, the mean of the true one-step denoiser:</p>
        <div class="formula-box">$$\\tilde\\mu_t = \\frac{\\sqrt{\\bar\\alpha_{t-1}}\\,\\beta_t\\,x_0 + \\sqrt{\\alpha_t}\\,(1-\\bar\\alpha_{t-1})\\,x_t}{1-\\bar\\alpha_t}$$</div>
        <p><b>Read it out loud:</b> the best guess for the previous step is a weighted average of the clean point $x_0$ and the current noisy point $x_t$, with weights built from the schedule.</p>
        <p>We will substitute Step 1's expression for $x_0$ into this formula. The algebra gets messy in the middle — that is normal, and we will show every line. One identity does all the cleanup, so let's name it now: the <b>product identity</b> $\\bar\\alpha_t = \\alpha_t\\,\\bar\\alpha_{t-1}$. It holds because $\\bar\\alpha_t$ is by definition the running product $\\alpha_1 \\alpha_2 \\cdots \\alpha_t$, and peeling off the last factor leaves the running product up to $t-1$.</p>
        <ol>
          <li><b>Do:</b> replace $x_0$ by $\\frac{x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon}{\\sqrt{\\bar\\alpha_t}}$, so the numerator becomes $\\sqrt{\\bar\\alpha_{t-1}}\\,\\beta_t\\,\\frac{x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon}{\\sqrt{\\bar\\alpha_t}} + \\sqrt{\\alpha_t}\\,(1-\\bar\\alpha_{t-1})\\,x_t$. <b>Why:</b> Step 1's inversion is an exact identity — substituting an equal quantity changes nothing.</li>
          <li><b>Do:</b> simplify the ratio $\\frac{\\sqrt{\\bar\\alpha_{t-1}}}{\\sqrt{\\bar\\alpha_t}}$ to $\\frac{1}{\\sqrt{\\alpha_t}}$. <b>Why:</b> the product identity gives $\\frac{\\bar\\alpha_{t-1}}{\\bar\\alpha_t} = \\frac{1}{\\alpha_t}$; taking square roots of both sides (both are positive) preserves the equality.</li>
          <li><b>Do:</b> distribute, so the numerator reads $\\frac{\\beta_t}{\\sqrt{\\alpha_t}}\\,x_t - \\frac{\\beta_t\\sqrt{1-\\bar\\alpha_t}}{\\sqrt{\\alpha_t}}\\,\\epsilon + \\sqrt{\\alpha_t}\\,(1-\\bar\\alpha_{t-1})\\,x_t$. <b>Why:</b> multiplication distributes over subtraction.</li>
          <li><b>Do:</b> collect the two $x_t$ terms; their combined coefficient is $\\frac{\\beta_t}{\\sqrt{\\alpha_t}} + \\sqrt{\\alpha_t}\\,(1-\\bar\\alpha_{t-1})$. <b>Why:</b> grouping like terms is reordering an addition, which is always allowed.</li>
          <li><b>Do:</b> put that coefficient over the common denominator $\\sqrt{\\alpha_t}$: it becomes $\\frac{\\beta_t + \\alpha_t(1-\\bar\\alpha_{t-1})}{\\sqrt{\\alpha_t}}$. <b>Why:</b> $\\sqrt{\\alpha_t}\\cdot\\sqrt{\\alpha_t} = \\alpha_t$, so the second term picks up an $\\alpha_t$ upstairs when it moves over $\\sqrt{\\alpha_t}$.</li>
          <li><b>Do:</b> expand the top: $\\beta_t + \\alpha_t - \\alpha_t\\bar\\alpha_{t-1}$. <b>Why:</b> distribute $\\alpha_t$ over the parenthesis.</li>
          <li><b>Do:</b> apply the product identity again: $\\alpha_t\\bar\\alpha_{t-1} = \\bar\\alpha_t$, so the top is $\\beta_t + \\alpha_t - \\bar\\alpha_t$. <b>Why:</b> replacing a quantity by its equal.</li>
          <li><b>Do:</b> use $\\alpha_t = 1 - \\beta_t$, so $\\beta_t + \\alpha_t = 1$ and the top is $1 - \\bar\\alpha_t$. <b>Why:</b> that is the definition of the survival factor $\\alpha_t$ from part 6.</li>
          <li><b>Do:</b> divide the $x_t$ coefficient $\\frac{1-\\bar\\alpha_t}{\\sqrt{\\alpha_t}}$ by the outer denominator $1-\\bar\\alpha_t$; the factor $1-\\bar\\alpha_t$ cancels, leaving $\\frac{1}{\\sqrt{\\alpha_t}}$. <b>Why:</b> $t \\ge 1$ means $\\bar\\alpha_t < 1$, so $1-\\bar\\alpha_t$ is a nonzero common factor and cancelling it is allowed.</li>
          <li><b>Do:</b> divide the $\\epsilon$ coefficient too: $\\frac{\\beta_t\\sqrt{1-\\bar\\alpha_t}}{\\sqrt{\\alpha_t}\\,(1-\\bar\\alpha_t)} = \\frac{\\beta_t}{\\sqrt{\\alpha_t}\\,\\sqrt{1-\\bar\\alpha_t}}$. <b>Why:</b> for any positive $u$, $\\frac{\\sqrt{u}}{u} = \\frac{1}{\\sqrt{u}}$ — here with $u = 1-\\bar\\alpha_t$.</li>
          <li><b>Do:</b> factor $\\frac{1}{\\sqrt{\\alpha_t}}$ out of both surviving terms, giving the boxed result below. <b>Why:</b> both terms share the factor, and factoring is the reverse of distributing.</li>
        </ol>
        <div class="formula-box">$$\\tilde\\mu_t = \\frac{1}{\\sqrt{\\alpha_t}}\\left(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon\\right)$$</div>
        <p><b>Read it out loud:</b> the best guess for the previous step is: take where you are, subtract a carefully sized slice of the noise, then divide by $\\sqrt{\\alpha_t}$ to undo one step of shrinking.</p>
        <p>Look at what happened: <b>$x_0$ has vanished.</b> The posterior mean never needed the clean point as a separate ingredient — it needed the noise. On the running example ($t = 2$, $x_2 = 1.9616$, $\\epsilon = 0.5$): $\\tilde\\mu_2 = \\frac{1}{\\sqrt{0.8}}\\big(1.9616 - \\frac{0.2}{\\sqrt{0.28}}\\cdot 0.5\\big) = \\frac{1.9616 - 0.1890}{0.8944} = 1.9819$, and part 7's $x_0$-form gives the same 1.9819. The notebook checks the two forms agree to $10^{-10}$ on one hundred thousand random cases — this is exact algebra, not an approximation.</p>`
      },
      {
        h: "Step 3 — Let the network speak the same language",
        body: `<p>Now design the learned denoiser $p_\\theta(x_{t-1} \\mid x_t)$ around what we found. At sampling time the network receives $x_t$ and the step number $t$ — nothing else. Look at the boxed formula above: every ingredient except $\\epsilon$ is a schedule constant ($\\alpha_t$, $\\beta_t$, $\\bar\\alpha_t$ are fixed numbers we chose in part 6) or an input ($x_t$). <b>The one unknown is the noise.</b> So let the network's whole job be guessing it: call the guess $\\epsilon_\\theta(x_t, t)$, a function with knobs (parameters) $\\theta$ that eats the noisy point and the step number and outputs a noise guess of the same shape as $x_t$. Then build the network's mean by the exact recipe the true mean follows:</p>
        <div class="formula-box">$$\\mu_\\theta(x_t, t) = \\frac{1}{\\sqrt{\\alpha_t}}\\left(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon_\\theta(x_t, t)\\right)$$</div>
        <p><b>Read it out loud:</b> the network's guess for the previous step uses the same subtract-and-rescale recipe as the truth, with the network's noise guess standing in for the true noise. This is Equation 11 of the DDPM paper.</p>
        <p>Two remarks, both honest. First, nothing forces this design: we could let a network output $\\mu_\\theta$ directly, or output a guess for $x_0$. All are connected by exact algebra (Step 1 converts between noise guesses and clean-point guesses). Choosing the noise form is a decision, and the next section shows its reward: the loss collapses into something beautifully simple. Second, the conversion works both ways — from any noise guess we get an implied clean-point guess $\\hat{x}_0 = (x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon_\\theta)/\\sqrt{\\bar\\alpha_t}$, which we will meet again in part 11 as the reusable primitive behind fast samplers.</p>`
      },
      {
        h: "Step 4 — The weighted loss: DDPM Eq. 12",
        body: `<p>Part 8 proved that (with the reverse variance fixed at $\\sigma_t^2$) each training term is $L_{t-1} = \\frac{1}{2\\sigma_t^2}\\,\\|\\tilde\\mu_t - \\mu_\\theta(x_t, t)\\|^2 + \\text{const}$: make the network's mean hit the true posterior mean. Substitute both means in their noise forms, one operation per step.</p>
        <ol>
          <li><b>Do:</b> write the difference: $\\tilde\\mu_t - \\mu_\\theta = \\frac{1}{\\sqrt{\\alpha_t}}\\big(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon\\big) - \\frac{1}{\\sqrt{\\alpha_t}}\\big(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon_\\theta\\big)$. <b>Why:</b> substituting the two boxed formulas from Steps 2 and 3.</li>
          <li><b>Do:</b> cancel the identical $\\frac{x_t}{\\sqrt{\\alpha_t}}$ terms, leaving $\\tilde\\mu_t - \\mu_\\theta = -\\frac{\\beta_t}{\\sqrt{\\alpha_t}\\sqrt{1-\\bar\\alpha_t}}\\,(\\epsilon - \\epsilon_\\theta)$. <b>Why:</b> both expressions contain the same $x_t$ term, and equal terms vanish under subtraction. Notice what this says: the error in the mean is proportional to the error in the noise guess — nothing else.</li>
          <li><b>Do:</b> take the squared length: $\\|\\tilde\\mu_t - \\mu_\\theta\\|^2 = \\frac{\\beta_t^2}{\\alpha_t\\,(1-\\bar\\alpha_t)}\\,\\|\\epsilon - \\epsilon_\\theta\\|^2$. <b>Why:</b> for any constant $c$ and vector $v$, $\\|c\\,v\\|^2 = c^2\\|v\\|^2$ — squaring kills the minus sign and squares the scale factor.</li>
          <li><b>Do:</b> divide by $2\\sigma_t^2$ and restore the expectation, giving the boxed result. <b>Why:</b> that is exactly part 8's per-step cost.</li>
        </ol>
        <div class="formula-box">$$L_{t-1} = \\mathbb{E}\\!\\left[\\frac{\\beta_t^2}{2\\sigma_t^2\\,\\alpha_t\\,(1-\\bar\\alpha_t)}\\,\\big\\|\\epsilon - \\epsilon_\\theta(x_t, t)\\big\\|^2\\right] + \\text{const}$$</div>
        <p><b>Read it out loud:</b> each step's training cost is a schedule-dependent weight times the squared distance between the true noise and the network's noise guess, averaged over data and noise draws. This is Equation 12 of the DDPM paper.</p>
        <p>Call the weight $w_t = \\frac{\\beta_t^2}{2\\sigma_t^2\\,\\alpha_t\\,(1-\\bar\\alpha_t)}$. Let's compute it for the running example with the common choice $\\sigma_t^2 = \\tilde\\beta_t$ (the true posterior variance from part 7). At $t = 2$: $\\tilde\\beta_2 = \\frac{(1-\\bar\\alpha_1)\\,\\beta_2}{1-\\bar\\alpha_2} = \\frac{0.1 \\times 0.2}{0.28} = 0.0714$, so $w_2 = \\frac{0.2^2}{2 \\times 0.0714 \\times 0.8 \\times 0.28} = \\frac{0.04}{0.032} = 1.25$. At $t = 3$: $\\tilde\\beta_3 = \\frac{0.28 \\times 0.3}{0.496} = 0.1694$ and $w_3 = \\frac{0.09}{2 \\times 0.1694 \\times 0.7 \\times 0.496} = \\frac{0.09}{0.1176} = 0.765$. (A tidy shortcut you will verify in the practice: with $\\sigma_t^2 = \\tilde\\beta_t$ the weight collapses to $w_t = \\frac{\\beta_t}{2\\alpha_t(1-\\bar\\alpha_{t-1})}$ — same numbers.) At $t = 1$ the recipe hits a wall: $\\bar\\alpha_0 = 1$ makes $\\tilde\\beta_1 = 0$. That is not a bug — part 8 already set the $t = 1$ term aside as the decode term $L_0$, which gets its own treatment and is folded into the same noise-prediction form in practice.</p>`
      },
      {
        h: "Step 5 — Drop the weight: L_simple, the loss of Stable Diffusion",
        body: `<p>Here is the paper's final move, and it is disarmingly casual: <b>throw the weight away.</b> Set every $w_t$ to 1 and average over a uniformly random step number:</p>
        <div class="formula-box">$$L_{\\mathrm{simple}}(\\theta) = \\mathbb{E}_{x_0,\\ t,\\ \\epsilon}\\Big[\\big\\|\\epsilon - \\epsilon_\\theta\\big(\\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon,\\ t\\big)\\big\\|^2\\Big]$$</div>
        <p><b>Read it out loud:</b> draw a clean data point, a random step number, and fresh noise; noise the point in one line; the cost is the squared distance between the noise you used and the noise the network guessed. Average over everything. This is Equation 14 of the DDPM paper — the loss that, at scale, trains Stable Diffusion.</p>
        <p>Be clear about what kind of move this is. <b>Dropping the weight is a choice, not a theorem.</b> The ELBO says each step should count with weight $w_t$; setting all weights to 1 means you are no longer optimizing the bound on log-likelihood — you are optimizing a reweighted cousin of it. How big is the change? For the canonical schedule ($T = 1000$, $\\beta_1 = 10^{-4}$ to $\\beta_T = 0.02$), $w_t \\approx 0.60$ near $t = 2$ but only $\\approx 0.01$ at $t = 1000$ — a factor of about 60. So the true bound cares overwhelmingly about the nearly-clean steps, while $L_{\\mathrm{simple}}$ boosts the high-noise steps — the hard ones, where the network must conjure global structure out of near-pure static — and quiets the easy final touch-ups. Ho and colleagues report that this trade produces visibly better samples, at a small cost in measured likelihood. The field kept the trade. You can read the original argument in <a onclick="App.open('paper-ddpm')">the DDPM paper lesson</a>.</p>
        <p>One more connection: the expectation over $x_0$, $t$, and $\\epsilon$ is estimated during training by Monte-Carlo — average the loss over a minibatch of random draws, exactly the sampling estimator from part 2. Every training iteration is one noisy but unbiased reading of $L_{\\mathrm{simple}}$.</p>`
      },
      {
        h: "Algorithm 1, line by line: training",
        body: `<p>Everything above compresses into six lines of pseudocode — Algorithm 1 of the DDPM paper. Read each line with its why.</p>
        <ol>
          <li><b>repeat</b> — training is a loop of tiny improvements; each pass handles one random sample (in practice, a minibatch of them).</li>
          <li><b>draw $x_0$ from the training data</b> — the expectation in $L_{\\mathrm{simple}}$ starts with a clean data point; a random one is a Monte-Carlo sample of it.</li>
          <li><b>draw $t$ uniformly from $\\{1, \\dots, T\\}$</b> — one network with one set of knobs must denoise at every noise level, so every level must appear in training; uniform draws are the equal-weight average that $L_{\\mathrm{simple}}$ asks for.</li>
          <li><b>draw $\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$</b> — this is the noise we will hide in the data and then ask the network to find.</li>
          <li><b>take one gradient step on $\\big\\|\\epsilon - \\epsilon_\\theta\\big(\\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon,\\ t\\big)\\big\\|^2$</b> — the inner expression builds $x_t$ with the one-line sampler (no chain simulation, ever — part 6's closed form is why training is cheap), the network guesses the hidden noise, and we nudge the knobs $\\theta$ a little in the direction that shrinks this sample's squared error (part 10 spells out how the nudge is computed).</li>
          <li><b>until converged</b> — stop when the loss stops falling.</li>
        </ol>
        <p>Notice what is absent. No sampling loop. No $T$-step rollout. No second network. Training touches exactly one timestep per example per iteration, jumping there in closed form. This is the stability that made diffusion models take over: the training signal is a plain regression target, fixed by the schedule, the same on Tuesday as on Friday.</p>`
      },
      {
        h: "Algorithm 2, line by line: sampling",
        body: `<p>Generation is Algorithm 2: start from static and denoise $T$ times. Each step is one draw from the learned reverse Gaussian $p_\\theta(x_{t-1} \\mid x_t) = \\mathcal{N}(\\mu_\\theta(x_t, t),\\ \\sigma_t^2\\mathbf{I})$, produced with part 3's reparameterization: mean plus scale times standard noise.</p>
        <ol>
          <li><b>draw $x_T \\sim \\mathcal{N}(0, \\mathbf{I})$</b> — part 6 proved the forward chain ends in (nearly) standard noise, so standard noise is the right starting soup.</li>
          <li><b>for $t = T, T-1, \\dots, 1$:</b> — walk the chain backwards, one step at a time.</li>
          <li><b>draw $z \\sim \\mathcal{N}(0, \\mathbf{I})$ if $t > 1$, else set $z = 0$</b> — fresh randomness for every step except the last (why the exception: below).</li>
          <li><b>update</b> using the boxed rule:</li>
        </ol>
        <div class="formula-box">$$x_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}}\\left(x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\,\\epsilon_\\theta(x_t, t)\\right) + \\sigma_t z$$</div>
        <p><b>Read it out loud:</b> the new point is the network's best mean guess — where you are, minus a calibrated slice of the guessed noise, rescaled — plus a fresh wobble of size $\\sigma_t$.</p>
        <ol start="5">
          <li><b>return $x_0$</b> — after the $t = 1$ update, the current point is the finished sample.</li>
        </ol>
        <p>Why the wobble at all? Because part 7 showed the true one-step denoiser is a distribution, not a point: it has mean $\\tilde\\mu_t$ and spread $\\tilde\\beta_t$. Landing exactly on the mean every step would ignore the spread and collapse the variety the model is supposed to produce. For $\\sigma_t^2$, the paper reports both natural choices work: $\\sigma_t^2 = \\beta_t$ or $\\sigma_t^2 = \\tilde\\beta_t$.</p>
        <p>Why $z = 0$ at the final step? The $t = 1$ update produces the output itself. Fresh noise is only ever useful when a later step can remove it; after the last step there is no later step, so added noise would be pure damage. Setting $z = 0$ reports the mean — the center of the model's belief, and (from part 2) the single guess that minimizes expected squared error.</p>`
      },
      {
        h: "A worked example you can redo on paper",
        body: `<p>Run every formula of this part once, with the running numbers: $T = 3$, $\\beta = (0.1, 0.2, 0.3)$, $\\alpha = (0.9, 0.8, 0.7)$, $\\bar\\alpha = (0.9, 0.72, 0.504)$. Take the clean point $x_0 = 2$, the true noise $\\epsilon = 0.5$, the step $t = 2$, and suppose the network guesses $\\hat\\epsilon = 0.3$ (a decent guess, off by $0.2$).</p>
        <ol>
          <li><b>Noise it (Algorithm 1, line 5):</b> $x_2 = \\sqrt{0.72}\\cdot 2 + \\sqrt{0.28}\\cdot 0.5 = 0.8485\\cdot 2 + 0.5292\\cdot 0.5 = 1.6971 + 0.2646 = 1.9616$.</li>
          <li><b>Per-sample loss:</b> $\\|\\epsilon - \\hat\\epsilon\\|^2 = (0.5 - 0.3)^2 = 0.2^2 = 0.04$. That single number is this sample's contribution to $L_{\\mathrm{simple}}$.</li>
          <li><b>Implied clean point (Step 1's inversion with the guess):</b> $\\hat{x}_0 = \\frac{1.9616 - 0.5292 \\times 0.3}{0.8485} = \\frac{1.9616 - 0.1587}{0.8485} = \\frac{1.8029}{0.8485} = 2.1247$. A noise guess $0.2$ too low reads as a clean point $0.125$ too high.</li>
          <li><b>Network's mean (Eq. 11):</b> $\\mu_\\theta = \\frac{1}{\\sqrt{0.8}}\\big(1.9616 - \\frac{0.2}{\\sqrt{0.28}}\\times 0.3\\big) = \\frac{1.9616 - 0.3780 \\times 0.3}{0.8944} = \\frac{1.8482}{0.8944} = 2.0664$.</li>
          <li><b>True mean (Step 2's formula with the true noise):</b> $\\tilde\\mu_2 = \\frac{1.9616 - 0.3780 \\times 0.5}{0.8944} = \\frac{1.7726}{0.8944} = 1.9819$.</li>
          <li><b>The gap:</b> $\\mu_\\theta - \\tilde\\mu_2 = 2.0664 - 1.9819 = 0.0845$. Cross-check with Step 4's line 2: the gap should be $\\frac{\\beta_2}{\\sqrt{\\alpha_2}\\sqrt{1-\\bar\\alpha_2}}\\times(\\epsilon - \\hat\\epsilon) = \\frac{0.2}{0.8944 \\times 0.5292}\\times 0.2 = 0.4226 \\times 0.2 = 0.0845$. It matches to four decimals.</li>
        </ol>
        <p>Every number above is recomputed by the notebook with asserts at four-decimal precision. If you can reproduce this table with a pencil, you own this part.</p>`
      },
      {
        h: "Sanity checks",
        body: `<p><b>Check 1 — no noise in, clean signal out.</b> Set $\\epsilon = 0$ in the noise-form mean. Then $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0$, and $\\tilde\\mu_t = \\frac{1}{\\sqrt{\\alpha_t}}\\,x_t = \\sqrt{\\frac{\\bar\\alpha_t}{\\alpha_t}}\\,x_0 = \\sqrt{\\bar\\alpha_{t-1}}\\,x_0$ (product identity in the last step). That is exactly the clean signal at level $t-1$ — if nothing was noisy, the denoiser's best guess is the un-noised signal one step earlier. The formula knows.</p>
        <p><b>Check 2 — a perfect guesser is rewarded perfectly.</b> If $\\epsilon_\\theta = \\epsilon$ on some sample, then $\\mu_\\theta = \\tilde\\mu_t$ exactly and the per-sample loss is 0. The loss bottoms out exactly where the theory says the target is.</p>
        <p><b>Check 3 — but the average loss cannot reach zero.</b> Many different pairs $(x_0, \\epsilon)$ produce the same $x_t$, and the network sees only $x_t$ and $t$. The best it can do is the average of all noises consistent with what it sees, $\\mathbb{E}[\\epsilon \\mid x_t, t]$ — and averaging leaves an irreducible remainder whenever the data has more than one possibility. The notebook measures this floor and plots it against $t$: near zero for small $t$, growing as noise drowns the signal. Remember this curve — it explains why part 10's training loss plateaus above zero without anything being wrong.</p>
        <p><b>Check 4 — error propagation, verified.</b> Step 4 predicts mean-error $=$ $\\frac{\\beta_t}{\\sqrt{\\alpha_t}\\sqrt{1-\\bar\\alpha_t}}$ times noise-error. The worked example confirms it: $0.4226 \\times 0.2 = 0.0845$, matching the directly computed gap.</p>
        <p><b>Check 5 — tiny steps barely move.</b> As $\\beta_t \\to 0$: the slice coefficient $\\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}} \\to 0$, the rescale $\\frac{1}{\\sqrt{\\alpha_t}} \\to 1$, and $\\sigma_t \\to 0$, so the update becomes $x_{t-1} \\approx x_t$. A step that added almost no noise needs almost no undoing. Signs and limits all behave.</p>
        <p><b>Check 6 — shapes.</b> $\\epsilon_\\theta$ outputs one number per coordinate of $x_t$: same shape in, same shape out (for images, image-in, image-out). The subtraction in the update is coordinate-by-coordinate, as it must be for the per-coordinate scalar algebra we did to apply.</p>`
      },
      {
        h: "What you can do now",
        body: `<p>You can now derive, from part 8's abstract bound, the concrete loss that modern image generators train on. You inverted the one-line sampler, pushed the inversion through the posterior mean until $x_0$ vanished, matched the network to the same form, and watched the KL costs collapse into a weighted mean-squared error on noise — then made the deliberate, honest choice to drop the weight and got $L_{\\mathrm{simple}}$: guess the noise, score by squared error. You can run Algorithm 1 and Algorithm 2 by hand, and you know why the last sampling step adds no noise.</p>
        <p>Here is the punchline the notebook makes concrete: <b>nothing in this part mentioned neural networks.</b> The theory needs a good noise-guesser $\\epsilon_\\theta$; where it comes from is an implementation detail. For a toy dataset with two possible clean points, the best possible guesser can be written down exactly (Bayes, from part 2), and Algorithm 2 running on that formula generates flawlessly from pure noise — a complete diffusion model with zero learned parameters. For images no such formula exists, and that, at last, is the one job of the neural network. Part 10 builds that network in PyTorch — a small MLP with a time embedding — trains it with Algorithm 1 exactly as written here, and watches noise reassemble into data. Everything after this part is engineering and speed.</p>`
      }
    ],
    symbols: [
      { sym: "$x_0$", desc: "the clean data point (an image flattened into a list of numbers; a single number in our scalar examples)" },
      { sym: "$x_t$", desc: "the data after $t$ small doses of noise" },
      { sym: "$T$", desc: "total number of noising steps (3 in the hand example, 200 in code, 1000 in the canonical schedule)" },
      { sym: "$\\beta_t$", desc: "how much fresh noise step $t$ adds (a small number like 0.0001-0.02)" },
      { sym: "$\\alpha_t = 1-\\beta_t$", desc: "the fraction of variance kept at step $t$" },
      { sym: "$\\bar\\alpha_t = \\prod_{s=1}^{t}\\alpha_s$", desc: "the fraction of the original signal surviving to step $t$; product identity: $\\bar\\alpha_t = \\alpha_t\\bar\\alpha_{t-1}$" },
      { sym: "$\\epsilon \\sim \\mathcal{N}(0,\\mathbf{I})$", desc: "the fresh standard Gaussian noise hidden in $x_t$ — the training target" },
      { sym: "$\\epsilon_\\theta(x_t, t)$", desc: "the network's noise guess, given the noisy point and the step number; same shape as $x_t$" },
      { sym: "$\\hat\\epsilon$", desc: "a specific numeric value of the network's noise guess in worked examples" },
      { sym: "$\\tilde\\mu_t$", desc: "the mean of the true one-step denoiser $q(x_{t-1} \\mid x_t, x_0)$ (part 7)" },
      { sym: "$\\tilde\\beta_t$", desc: "the variance of the true one-step denoiser (part 7): $(1-\\bar\\alpha_{t-1})\\beta_t/(1-\\bar\\alpha_t)$" },
      { sym: "$\\mu_\\theta(x_t, t)$", desc: "the mean of the learned denoiser, built from $\\epsilon_\\theta$ by Eq. 11" },
      { sym: "$\\sigma_t^2$", desc: "the fixed variance chosen for the learned denoiser ($\\beta_t$ or $\\tilde\\beta_t$)" },
      { sym: "$w_t$", desc: "the per-step weight $\\beta_t^2/(2\\sigma_t^2\\alpha_t(1-\\bar\\alpha_t))$ multiplying the noise error in Eq. 12" },
      { sym: "$L_{\\mathrm{simple}}$", desc: "the equal-weight noise-prediction loss $\\mathbb{E}\\|\\epsilon-\\epsilon_\\theta(x_t,t)\\|^2$ (Eq. 14)" },
      { sym: "$\\hat{x}_0$", desc: "the clean-point guess implied by a noise guess: $(x_t - \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon_\\theta)/\\sqrt{\\bar\\alpha_t}$" },
      { sym: "$z$", desc: "fresh standard noise added at each sampling step; set to 0 at the final step" },
      { sym: "$\\|\\cdot\\|^2$", desc: "squared length of a vector: sum of squared coordinates (for a single number, its square)" }
    ],
    recall: [
      "Write the one-line sampler for $x_t$ in terms of $x_0$ and $\\epsilon$ from memory.",
      "Solve the one-line sampler for $x_0$. Which two operations do you use, in which order?",
      "State the noise form of the posterior mean $\\tilde\\mu_t$. Which identity did the simplification use repeatedly?",
      "What are the inputs of $\\epsilon_\\theta$, and what is the shape of its output?",
      "State $L_{\\mathrm{simple}}$, naming everything the expectation averages over.",
      "In Algorithm 2, why is $z$ fresh noise for $t > 1$ but zero at $t = 1$?",
      "Is dropping the weight $w_t$ a theorem or a choice? What does the change do to which timesteps dominate training?"
    ],
    practice: [
      {
        q: "Inversion with numbers. At $t = 2$ in the running schedule ($\\bar\\alpha_2 = 0.72$) you observe $x_2 = 1.9616$, and you are told the noise that was used was $\\epsilon = 0.5$. Recover the clean point $x_0$.",
        steps: [
          { do: "Write the inversion: $x_0 = (x_2 - \\sqrt{1-\\bar\\alpha_2}\\,\\epsilon)/\\sqrt{\\bar\\alpha_2}$.", why: "Solving the one-line sampler for $x_0$ (subtract the noise term, then divide by $\\sqrt{\\bar\\alpha_2}$) is exact algebra from Step 1." },
          { do: "Evaluate the two constants: $\\sqrt{1-0.72} = \\sqrt{0.28} = 0.5292$ and $\\sqrt{0.72} = 0.8485$.", why: "Computing the fixed schedule numbers first keeps the arithmetic tidy." },
          { do: "Compute the numerator: $1.9616 - 0.5292 \\times 0.5 = 1.9616 - 0.2646 = 1.6971$.", why: "Substitute the given values and multiply before subtracting." },
          { do: "Divide: $1.6971 / 0.8485 = 2.0000$.", why: "The last remaining operation in the inversion formula." }
        ],
        answer: "$x_0 = 2.0$. The inversion recovers the clean point exactly — the sampler loses no information when the noise is known."
      },
      {
        q: "Reproduce the key collection step of the substitution: show that $\\frac{\\beta_t}{\\sqrt{\\alpha_t}} + \\sqrt{\\alpha_t}\\,(1-\\bar\\alpha_{t-1}) = \\frac{1-\\bar\\alpha_t}{\\sqrt{\\alpha_t}}$.",
        steps: [
          { do: "Put both terms over the common denominator $\\sqrt{\\alpha_t}$: the sum becomes $\\frac{\\beta_t + \\alpha_t(1-\\bar\\alpha_{t-1})}{\\sqrt{\\alpha_t}}$.", why: "The second term is multiplied upstairs and downstairs by $\\sqrt{\\alpha_t}$, and $\\sqrt{\\alpha_t}\\cdot\\sqrt{\\alpha_t} = \\alpha_t$." },
          { do: "Distribute $\\alpha_t$: the top becomes $\\beta_t + \\alpha_t - \\alpha_t\\bar\\alpha_{t-1}$.", why: "Multiplication distributes over subtraction." },
          { do: "Apply the product identity $\\alpha_t\\bar\\alpha_{t-1} = \\bar\\alpha_t$: the top becomes $\\beta_t + \\alpha_t - \\bar\\alpha_t$.", why: "$\\bar\\alpha_t$ is the running product of the $\\alpha$'s, so peeling off $\\alpha_t$ leaves $\\bar\\alpha_{t-1}$." },
          { do: "Use $\\beta_t + \\alpha_t = 1$: the top becomes $1 - \\bar\\alpha_t$, giving $\\frac{1-\\bar\\alpha_t}{\\sqrt{\\alpha_t}}$.", why: "$\\alpha_t$ is defined as $1-\\beta_t$, so the pair sums to 1." }
        ],
        answer: "The identity holds. Divided by the posterior denominator $1-\\bar\\alpha_t$, it is exactly why the $x_t$ coefficient of $\\tilde\\mu_t$ collapses to $\\frac{1}{\\sqrt{\\alpha_t}}$."
      },
      {
        q: "Compute the Eq. 12 weight $w_2 = \\frac{\\beta_2^2}{2\\sigma_2^2\\,\\alpha_2\\,(1-\\bar\\alpha_2)}$ for the running schedule, using $\\sigma_2^2 = \\tilde\\beta_2$. Then verify the shortcut $w_t = \\frac{\\beta_t}{2\\alpha_t(1-\\bar\\alpha_{t-1})}$ gives the same number.",
        steps: [
          { do: "Compute $\\tilde\\beta_2 = \\frac{(1-\\bar\\alpha_1)\\beta_2}{1-\\bar\\alpha_2} = \\frac{0.1 \\times 0.2}{0.28} = 0.0714$.", why: "Part 7's posterior-variance formula with $\\bar\\alpha_1 = 0.9$, $\\beta_2 = 0.2$, $\\bar\\alpha_2 = 0.72$." },
          { do: "Compute the numerator: $\\beta_2^2 = 0.2^2 = 0.04$.", why: "Direct squaring." },
          { do: "Compute the denominator: $2 \\times 0.0714 \\times 0.8 \\times 0.28 = 0.032$.", why: "Multiply the four factors $2$, $\\sigma_2^2$, $\\alpha_2$, $1-\\bar\\alpha_2$ left to right." },
          { do: "Divide: $w_2 = 0.04 / 0.032 = 1.25$.", why: "Last operation in the weight formula." },
          { do: "Shortcut check: substitute $\\sigma_t^2 = \\tilde\\beta_t = \\frac{(1-\\bar\\alpha_{t-1})\\beta_t}{1-\\bar\\alpha_t}$ into $w_t$; one factor of $\\beta_t$ and the whole factor $1-\\bar\\alpha_t$ cancel, leaving $w_t = \\frac{\\beta_t}{2\\alpha_t(1-\\bar\\alpha_{t-1})}$.", why: "Cancelling a nonzero common factor from the top and bottom of a fraction is allowed." },
          { do: "Evaluate the shortcut: $\\frac{0.2}{2 \\times 0.8 \\times 0.1} = \\frac{0.2}{0.16} = 1.25$.", why: "Plug in $\\beta_2 = 0.2$, $\\alpha_2 = 0.8$, $1-\\bar\\alpha_1 = 0.1$." }
        ],
        answer: "$w_2 = 1.25$ by both routes."
      },
      {
        q: "Trace Algorithm 1 by hand with $T = 2$, $\\beta = (0.1, 0.2)$ (so $\\bar\\alpha = (0.9, 0.72)$). The draws are: $x_0 = 1$, $t = 2$, $\\epsilon = -1$. The network currently outputs $\\epsilon_\\theta = -0.4$ for this input. Compute the noisy input $x_2$ and the per-sample loss, and say which direction the update pushes the network's output.",
        steps: [
          { do: "Form the noisy input with the one-line sampler: $x_2 = \\sqrt{0.72}\\times 1 + \\sqrt{0.28}\\times(-1) = 0.8485 - 0.5292 = 0.3194$.", why: "Algorithm 1, line 5 builds $x_t$ in closed form — no stepping through the chain." },
          { do: "Compute the per-sample loss: $\\|\\epsilon - \\epsilon_\\theta\\|^2 = (-1 - (-0.4))^2 = (-0.6)^2 = 0.36$.", why: "That is the $L_{\\mathrm{simple}}$ integrand for this single draw." },
          { do: "Read the gradient direction: the loss shrinks as $\\epsilon_\\theta$ moves from $-0.4$ toward $-1$, so the gradient step nudges the knobs $\\theta$ to make the output more negative for this input.", why: "A squared error $(target - output)^2$ always pushes the output toward the target; here the target is the true noise $-1$." }
        ],
        answer: "$x_2 = 0.3194$, per-sample loss $= 0.36$, and the update pushes $\\epsilon_\\theta(0.3194, 2)$ toward $-1$."
      },
      {
        q: "Trace Algorithm 2 by hand with $T = 2$, $\\beta = (0.1, 0.2)$, $\\bar\\alpha = (0.9, 0.72)$, using $\\sigma_t = \\sqrt{\\beta_t}$. The draws are: $x_2 = 0.9$, then $z = -1$ at step $t = 2$. The network returns $\\epsilon_\\theta(x_2, 2) = 0.5$ and later $\\epsilon_\\theta(x_1, 1) = 0.2$. Compute $x_1$ and the final output $x_0$ to 4 decimals.",
        steps: [
          { do: "Step $t = 2$, mean part: $\\frac{1}{\\sqrt{0.8}}\\big(0.9 - \\frac{0.2}{\\sqrt{0.28}}\\times 0.5\\big) = \\frac{0.9 - 0.3780\\times 0.5}{0.8944} = \\frac{0.7110}{0.8944} = 0.7949$.", why: "This is the update rule's mean term with $\\alpha_2 = 0.8$, $\\beta_2 = 0.2$, $1-\\bar\\alpha_2 = 0.28$." },
          { do: "Step $t = 2$, add the wobble: $x_1 = 0.7949 + \\sqrt{0.2}\\times(-1) = 0.7949 - 0.4472 = 0.3477$.", why: "$t = 2 > 1$, so line 3 draws fresh $z$ and the update adds $\\sigma_2 z$ with $\\sigma_2 = \\sqrt{\\beta_2}$." },
          { do: "Step $t = 1$, mean part: $\\frac{1}{\\sqrt{0.9}}\\big(0.3477 - \\frac{0.1}{\\sqrt{0.1}}\\times 0.2\\big) = \\frac{0.3477 - 0.3162\\times 0.2}{0.9487} = \\frac{0.2845}{0.9487} = 0.2999$.", why: "Same rule at $t = 1$: $\\alpha_1 = 0.9$, $\\beta_1 = 0.1$, and $1-\\bar\\alpha_1 = 0.1$ so $\\frac{\\beta_1}{\\sqrt{0.1}} = \\sqrt{0.1} = 0.3162$." },
          { do: "Step $t = 1$, no wobble: $x_0 = 0.2999 + \\sigma_1 \\times 0 = 0.2999$.", why: "At the final step $z = 0$ — the output is the mean, with no fresh noise left un-denoised." }
        ],
        answer: "$x_1 = 0.3477$ and the generated sample is $x_0 = 0.2999$."
      },
      {
        q: "Explain, in a short chain of reasons, why Algorithm 2 sets $z = 0$ at the final step instead of drawing fresh noise.",
        steps: [
          { do: "Recall what each sampling step is: a draw from the Gaussian $\\mathcal{N}(\\mu_\\theta, \\sigma_t^2)$, implemented as mean $+$ $\\sigma_t z$ by part 3's reparameterization.", why: "That is exactly what line 4 of Algorithm 2 computes." },
          { do: "Note the role of the added noise: the wobble at step $t$ models the genuine spread $\\tilde\\beta_t$ of the true denoiser, and any randomness it injects is processed — and if unhelpful, removed — by the remaining $t-1$ steps.", why: "Each later step denoises whatever it receives; noise added mid-chain is part of the process the model was built for." },
          { do: "Observe that the $t = 1$ update has no later step: its result is the returned sample $x_0$ itself.", why: "The loop ends at $t = 1$; line 5 returns the current point." },
          { do: "Conclude: noise added at $t = 1$ would sit in the output uncorrected, blurring it for no benefit; reporting the mean instead gives the single best guess, since the mean of a Gaussian minimizes expected squared error (part 2).", why: "Comparing the two options, one strictly damages the output and the other is optimal in the squared-error sense." }
        ],
        answer: "Fresh noise is only useful when a later step can denoise it. At the last step there is no later step, so the algorithm reports the mean — the center of the model's belief."
      },
      {
        q: "Reasoning: suppose you train the network to predict the clean point $\\hat{x}_0$ directly, with an equal-weight loss $\\mathbb{E}\\|x_0 - \\hat{x}_0\\|^2$ averaged uniformly over $t$. Using the inversion identity, work out what this is equivalent to in noise space, and explain what goes wrong.",
        steps: [
          { do: "Write both the true noise and the implied noise guess at a fixed $x_t$: $\\epsilon = \\frac{x_t - \\sqrt{\\bar\\alpha_t}\\,x_0}{\\sqrt{1-\\bar\\alpha_t}}$ and $\\hat\\epsilon = \\frac{x_t - \\sqrt{\\bar\\alpha_t}\\,\\hat{x}_0}{\\sqrt{1-\\bar\\alpha_t}}$.", why: "The one-line sampler ties noise and clean point together through the same $x_t$; this is Step 1's identity read in the other direction." },
          { do: "Subtract them: $\\epsilon - \\hat\\epsilon = \\frac{\\sqrt{\\bar\\alpha_t}}{\\sqrt{1-\\bar\\alpha_t}}\\,(\\hat{x}_0 - x_0)$.", why: "The identical $x_t$ terms cancel under subtraction." },
          { do: "Square both sides: $\\|\\epsilon - \\hat\\epsilon\\|^2 = \\frac{\\bar\\alpha_t}{1-\\bar\\alpha_t}\\,\\|x_0 - \\hat{x}_0\\|^2 = \\mathrm{SNR}(t)\\,\\|x_0 - \\hat{x}_0\\|^2$.", why: "Squaring a scaled vector squares the scale, and part 6 defined $\\mathrm{SNR}(t) = \\bar\\alpha_t/(1-\\bar\\alpha_t)$." },
          { do: "Read the direction of the equivalence: equal weight in $x_0$-space means weight $\\frac{1}{\\mathrm{SNR}(t)}$ in noise space — for the canonical schedule, $\\mathrm{SNR}(T) \\approx 4\\times 10^{-5}$, so the final steps get weight of order 25,000 relative to the noise loss.", why: "Divide the identity by $\\mathrm{SNR}(t)$: $\\|x_0 - \\hat{x}_0\\|^2 = \\frac{1}{\\mathrm{SNR}(t)}\\|\\epsilon-\\hat\\epsilon\\|^2$, then plug in part 6's end-state number $\\bar\\alpha_T \\approx 4\\times 10^{-5}$." },
          { do: "Note what those high-$t$ steps look like: $x_t$ is nearly pure static, so the best possible $\\hat{x}_0$ is close to the dataset average, and most of the $x_0$-error there is irreducible.", why: "Part 6's end state: almost no signal survives, so no predictor can recover the individual $x_0$." },
          { do: "Conclude: the loss and its gradients are dominated by timesteps the network cannot improve, while the near-clean steps that sharpen fine detail contribute almost nothing, so they train weakly.", why: "Compare the relative magnitudes computed in the previous two steps." }
        ],
        answer: "Equal-weight $x_0$-prediction is a noise loss reweighted by $1/\\mathrm{SNR}(t)$: it over-trains the unlearnable high-noise steps (where the best answer is roughly the dataset mean) and under-trains the detail-forming low-noise steps, yielding blurry, averaged-looking samples. Systems that do predict $x_0$ (or $v$) reintroduce SNR-based weights to correct exactly this imbalance."
      }
    ]
  });
})();
