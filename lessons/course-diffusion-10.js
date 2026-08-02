/* Rigorous Courses · Diffusion Models — Part 10: Build and train a real DDPM.
   Turns part 9's algorithms into working PyTorch: time embedding, MLP noise-guesser,
   Algorithm 1 training loop, Algorithm 2 sampling loop, evaluation, failure modes. */
(function () {
  window.LESSONS.push({
    id: "diff-10-train-ddpm",
    title: "Part 10 — Build and train a real DDPM",
    tagline: "Turn the noise-prediction loss into working PyTorch and watch pure noise organize into data",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 10,
    partTotal: 12,
    prereqs: ["diff-09-simple-loss"],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Explain why one network with one set of weights can denoise every noise level — provided it is told $t$ — and compute a sinusoidal time embedding by hand.</li>
        <li>Read every line of the DDPM training loop (Algorithm 1) and the sampling loop (Algorithm 2) as PyTorch code, and say what each line is for.</li>
        <li>Train a working DDPM on a 2-D toy dataset on a laptop CPU, and read its loss curve correctly — including why it must not reach zero.</li>
        <li>Evaluate a toy generative model with moment and mode-coverage checks, and diagnose the four classic failure modes.</li>
      </ul>`,
    sections: [
      { h: "Where we are",
        body: `<p>Nine parts of theory are behind you, and every piece you need is proved. Part 6 built the forward process and its one-line sampler: $x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$, where $\\bar\\alpha_t$ is the fraction of the original signal surviving to step $t$. Part 7 derived the true one-step denoiser $q(x_{t-1} \\mid x_t, x_0)$ — exact, but it needs the clean point $x_0$. Part 8 turned "learn to denoise" into one trainable number, the ELBO, and showed that minimizing it means hitting the true posterior mean. Part 9 reparameterized everything into the loss that trains Stable Diffusion, $L_{\\mathrm{simple}} = \\mathbb{E}\\,\\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2$, and gave us two short recipes: Algorithm 1 (training) and Algorithm 2 (sampling).</p>
        <p>Part 9 ended with something remarkable: a complete, working diffusion model in numpy with no neural network at all. For 1-D data with only two possible clean values, we could write the best possible noise guess $\\mathbb{E}[\\epsilon \\mid x_t, t]$ down as an exact formula, plug it into Algorithm 2, and watch pure noise turn into data. For real data that formula is unknowable — the whole point of the course is that we never get the data's rule, only samples. So this part answers the practical question: <b>how do we build and train a network that learns the noise guess, and how do we run Algorithms 1 and 2 in real code?</b> By the end you will have trained a genuine DDPM — the same algorithm behind Stable Diffusion's engine, at friendly size — and watched it turn noise into structure on your own CPU.</p>` },

      { h: "The dataset: a ring of eight clusters",
        body: `<p>We need data that is easy to look at but hard enough to be honest. Our choice: <b>4,096 points in the plane, arranged in 8 small clusters spaced evenly around a circle of radius 4</b>, each cluster a little Gaussian blob with spread 0.15. Each data point is a vector of 2 numbers — think of it as a 2-pixel image, exactly the toy from part 1.</p>
        <p>Why this dataset? Three reasons. First, it is 2-D, so you can see the <b>entire distribution</b> in one scatter plot — no averaging, no projections, no trusting a metric you cannot check by eye. Second, it has 8 separate <b>modes</b> (crowded regions separated by empty space), so the classic generative failure — producing only some of the modes — is instantly visible. Third, it is small enough that training takes seconds on a CPU.</p>
        <p>Here is the exact code that builds it, line by line:</p>
        <ul>
          <li><code>mode = rng.integers(0, 8, size=n)</code> — for each of the $n = 4096$ points, pick which of the 8 clusters it belongs to, uniformly at random.</li>
          <li><code>angle = 2 * np.pi * mode / 8</code> — convert the cluster index into an angle around the circle (cluster 0 sits at angle 0, cluster 2 a quarter-turn up, and so on).</li>
          <li><code>centers = 4.0 * np.stack([np.cos(angle), np.sin(angle)], axis=1)</code> — place each cluster's center on the circle of radius 4.</li>
          <li><code>x0 = centers + 0.15 * rng.standard_normal((n, 2))</code> — sprinkle each point around its center with Gaussian spread 0.15. Recall from part 3: this is the reparameterization $x = \\mu + \\sigma z$ in code.</li>
        </ul>
        <p>What would it mean to "learn" this distribution? A model that has learned it should generate points that (a) land on all 8 clusters, not a favorite few, (b) sit at the right radius (about 4 from the origin), and (c) have the right spread within each cluster (about 0.15). Keep these three checks in mind — they become our evaluation at the end.</p>` },

      { h: "One network, every noise level: why it must be told t",
        body: `<p>Recall the loss we are about to implement:</p>
        <div class="formula-box">$$L_{\\mathrm{simple}}(\\theta) \\;=\\; \\mathbb{E}_{x_0,\\, t,\\, \\epsilon}\\, \\big\\| \\epsilon - \\epsilon_\\theta(x_t, t) \\big\\|^2 , \\qquad x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$$</div>
        <p><b>Read it out loud:</b> average over random clean points $x_0$, random timesteps $t$, and random fresh noise $\\epsilon$: take the squared distance between the noise that was actually added and the network's guess of that noise, given the noisy point and the timestep. Training makes this average small.</p>
        <p>Notice the network's signature: $\\epsilon_\\theta(x_t, t)$. It takes <b>two</b> inputs — the noisy point <b>and the timestep</b>. This is not decoration. The same noisy point means completely different things at different noise levels. Concretely: suppose the network sees the point $(3.7,\\ 1.5)$ — on the ring (radius 4), but midway between cluster 0 and cluster 1, on no mode.</p>
        <ul>
          <li>If $t = 5$, almost no noise has been added ($1-\\bar\\alpha_5$ is tiny), so the point must have started very close to where it is now — in the empty gap. The tiny noise dose could not have carried it far, so the best noise guess is a <b>small</b> vector.</li>
          <li>If $t = 190$, the point is mostly noise. Its clean ancestor was almost certainly on one of the clusters, and the best guess is a <b>large</b> noise vector — the displacement that would carry a (shrunken) cluster point out to $(3.7,\\ 1.5)$, scaled the way part 7's posterior dictates.</li>
        </ul>
        <p>You saw this dependence explicitly in part 9: the exact best predictor for the two-point toy was a formula with $\\bar\\alpha_t$ inside it. Change $t$, and the correct answer changes. So the network must know $t$.</p>
        <p>Why one shared network rather than 200 separate ones (one per level)? Two reasons. First, economy: 200 networks would need 200 times the parameters and 200 times the data. Second, and more importantly, the denoising tasks at neighboring levels are <b>nearly identical</b> — the best guess at $t=100$ is almost the best guess at $t=101$. A single network with $t$ as an input can share what it learns across levels, so every training example helps every level a little. This <b>parameter sharing</b> is the same bet that makes all of deep learning work.</p>` },

      { h: "The sinusoidal time embedding",
        body: `<p>So the network needs $t$. Can we feed the raw integer in as a third input coordinate? We could, but it works poorly, for two concrete reasons.</p>
        <ul>
          <li><b>Scale.</b> Our data coordinates live in roughly $[-4.5,\\ 4.5]$, while $t$ runs from 1 to 200. A raw $t$ input is up to 50 times larger than everything else, so early in training the network's output is dominated by $t$ and it must slowly learn to shrink that influence back down. Badly scaled inputs waste training time.</li>
          <li><b>Expressiveness.</b> A single number gives the network only one knob for representing 200 distinct-but-related behaviors. It can learn smooth trends in $t$ easily, but sharp changes (like "behave differently below $t = 20$") require contorted weights.</li>
        </ul>
        <p>The standard fix is the <b>sinusoidal time embedding</b>: spread $t$ across many numbers, every one of them in $[-1, 1]$, smooth in $t$, and jointly unique for each $t$. The trick is to read $t$ off a bank of clocks that tick at different speeds:</p>
        <div class="formula-box">$$e(t) \\;=\\; \\big(\\sin(\\omega_1 t),\\ \\dots,\\ \\sin(\\omega_K t),\\ \\cos(\\omega_1 t),\\ \\dots,\\ \\cos(\\omega_K t)\\big), \\qquad \\omega_k = 10000^{-\\frac{k-1}{K-1}}$$</div>
        <p><b>Read it out loud:</b> the embedding of timestep $t$ is a list of $2K$ numbers: the sine and the cosine of $t$ multiplied by each of $K$ fixed frequencies, where the frequencies slide from $\\omega_1 = 1$ (a fast clock) down to $\\omega_K = 1/10000$ (a very slow clock), evenly spaced in powers of ten.</p>
        <p>We use $K = 16$ frequencies, so the embedding has 32 numbers. Think of each frequency as one hand on a strange clock. The fast hand ($\\omega_1 = 1$) completes a full turn every $2\\pi \\approx 6.3$ timesteps — over our 200 steps it wraps around about 32 times, so it distinguishes <b>nearby</b> timesteps sharply. The slow hand ($\\omega_{16} = 0.0001$) barely moves — over all 200 steps it advances only $0.0199$ radians, about one degree — so it distinguishes <b>early from late</b> without ever wrapping. Between them sit 14 hands at intermediate speeds. No single hand identifies $t$, but the full set of readings is a smooth, unique fingerprint. And why both sine and cosine? A sine alone is ambiguous (many angles share one sine value); the pair pins the angle down.</p>
        <p>Here are the actual values at three timesteps, for the fastest and slowest hands (the notebook checks every one):</p>
        <table class="symbols">
          <tr><td><b>t</b></td><td>$\\sin(\\omega_1 t)$, fast</td><td>$\\cos(\\omega_1 t)$, fast</td><td>$\\sin(\\omega_{16} t)$, slow</td><td>$\\cos(\\omega_{16} t)$, slow</td></tr>
          <tr><td>0</td><td>0.000</td><td>1.000</td><td>0.000</td><td>1.000</td></tr>
          <tr><td>50</td><td>-0.262</td><td>0.965</td><td>0.005</td><td>1.000</td></tr>
          <tr><td>199</td><td>-0.882</td><td>-0.472</td><td>0.020</td><td>1.000</td></tr>
        </table>
        <p>Read the table down the columns: the fast pair jumps around (it has wrapped many times between the rows), while the slow pair creeps: 0.000, 0.005, 0.020. Every entry is inside $[-1, 1]$ — perfectly scaled inputs. The code is three lines:</p>
        <ul>
          <li><code>freqs = torch.exp(-math.log(10000.0) * torch.arange(half) / (half - 1))</code> — the 16 frequencies, sliding from 1 down to 1/10000 (taking exp of evenly spaced logs gives evenly spaced powers).</li>
          <li><code>args = t[:, None].float() * freqs[None, :]</code> — every timestep in the batch times every frequency: a grid of clock angles.</li>
          <li><code>emb = torch.cat([torch.sin(args), torch.cos(args)], dim=1)</code> — read every hand twice, sine then cosine, and glue the readings into one row of 32 numbers per timestep.</li>
        </ul>
        <p>One aside you can file away: this is the same trick transformers use to tell their network <b>where</b> a word sits in a sentence. Here the "position" is time.</p>` },

      { h: "The network: a small MLP that outputs noise, not labels",
        body: `<p>Now the network itself. An <b>MLP</b> (multi-layer perceptron) is the plainest neural network: alternate "multiply by a matrix of learned weights and add a learned offset" (a <code>Linear</code> layer) with a fixed nonlinear squashing function (an <b>activation</b>). Ours:</p>
        <ul>
          <li><code>nn.Linear(2 + 32, 128)</code> — input is the noisy point's 2 coordinates glued to the 32-number time embedding: 34 numbers in, 128 out.</li>
          <li><code>nn.SiLU()</code> — the activation; a smooth cousin of the popular ReLU. Without a nonlinearity, stacked linear layers collapse into one linear layer and can only learn straight-line rules.</li>
          <li><code>nn.Linear(128, 128)</code> then <code>nn.SiLU()</code> — one more hidden layer of 128 units.</li>
          <li><code>nn.Linear(128, 2)</code> — output: 2 numbers.</li>
        </ul>
        <p>Look hard at that output shape: <b>2 numbers — the same shape as the data</b>. This network is not a classifier squeezing an input down to a label. It maps a point to a <b>noise guess of the same shape</b>: data-shaped in, data-shaped out. For images the same idea holds — the denoiser eats an image and outputs an image of per-pixel noise guesses (real systems use a U-Net there, a convolutional architecture built for image-to-image maps; our MLP is the honest small version of the same contract).</p>
        <p>How big is this network? Count the knobs. Each <code>Linear(a, b)</code> layer has $a \\times b$ weights plus $b$ offsets:</p>
        <ul>
          <li>Layer 1: $34 \\times 128 + 128 = 4480$.</li>
          <li>Layer 2: $128 \\times 128 + 128 = 16512$.</li>
          <li>Layer 3: $128 \\times 2 + 2 = 258$.</li>
        </ul>
        <p>Total: $\\theta$ is a list of <b>21,250</b> learnable numbers. For scale: Stable Diffusion's denoiser has roughly 900 million. Same algorithm, different budget.</p>` },

      { h: "The training loop: Algorithm 1 with minibatches",
        body: `<p>Part 9 gave you Algorithm 1 in five lines of math. Here is each line as PyTorch, annotated. One pass through this list is one <b>training step</b>; we repeat it 2,500 times.</p>
        <ul>
          <li><code>idx = torch.randint(0, n, (256,))</code> and <code>x0 = data[idx]</code> — Algorithm 1's "sample $x_0$ from the data": grab 256 random clean points. A group processed together is a <b>minibatch</b>; $B = 256$ is the batch size.</li>
          <li><code>t = torch.randint(1, T + 1, (256,))</code> — "sample $t$ uniformly from $\\{1, \\dots, T\\}$": each of the 256 examples gets its own random noise level, so one batch trains many levels at once.</li>
          <li><code>eps = torch.randn(256, 2)</code> — "sample $\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$": the fresh standard Gaussian noise we will hide in the data and then ask the network to find.</li>
          <li><code>xt = sqrt_abar[t - 1][:, None] * x0 + sqrt_1m_abar[t - 1][:, None] * eps</code> — part 6's one-line sampler $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$, applied to the whole batch at once (the <code>[t - 1]</code> looks up each example's own schedule entry; <code>[:, None]</code> lines the 256 scale factors up against the 256 rows).</li>
          <li><code>eps_pred = model(xt, t)</code> — the network's guess $\\epsilon_\\theta(x_t, t)$.</li>
          <li><code>loss = ((eps - eps_pred) ** 2).mean()</code> — the squared error, averaged over the batch and over the 2 coordinates. Averaging over coordinates instead of summing divides by a constant 2, which rescales the loss but not its minimizer — a cosmetic choice.</li>
          <li><code>opt.zero_grad()</code> then <code>loss.backward()</code> — <b>backpropagation</b>: the bookkeeping algorithm that computes, for every one of the 21,250 knobs, the slope of the loss with respect to that knob. (<code>zero_grad</code> clears the previous step's slopes first.)</li>
          <li><code>opt.step()</code> — the update. We use <b>Adam</b>, a gradient-descent variant that adapts a per-knob step size; the base step size is the <b>learning rate</b> $\\eta = 10^{-3}$.</li>
        </ul>
        <p>What number is the batch loss, exactly? It is a <b>Monte-Carlo estimate</b> — part 2's sampling trick — of the true loss:</p>
        <div class="formula-box">$$\\hat L \\;=\\; \\frac{1}{B} \\sum_{i=1}^{B} \\big\\| \\epsilon^{(i)} - \\epsilon_\\theta\\big(x^{(i)}_{t_i},\\ t_i\\big) \\big\\|^2 \\;\\approx\\; L_{\\mathrm{simple}}(\\theta)$$</div>
        <p><b>Read it out loud:</b> the batch loss is the plain average, over the 256 randomly drawn (clean point, timestep, noise) triples, of the squared guessing error — and by the law of large numbers this average approximates the true expectation, with a spread that shrinks like one over the square root of the batch size.</p>
        <p><b>A worked example with tiny numbers.</b> Use the running $T=3$ schedule from part 6 ($\\bar\\alpha_2 = 0.72$) and a batch of one. Say the sampled triple is $x_0 = (2,\\ 0)$, $t = 2$, $\\epsilon = (0.5,\\ -1.0)$.</p>
        <ol>
          <li>$\\sqrt{\\bar\\alpha_2} = \\sqrt{0.72} = 0.8485$, so the signal part is $0.8485 \\cdot (2,\\ 0) = (1.6971,\\ 0)$.</li>
          <li>$\\sqrt{1-\\bar\\alpha_2} = \\sqrt{0.28} = 0.5292$, so the noise part is $0.5292 \\cdot (0.5,\\ -1.0) = (0.2646,\\ -0.5292)$.</li>
          <li>Add them: $x_2 = (1.9617,\\ -0.5292)$. That is the network's first input; the second is $t = 2$.</li>
          <li>Suppose the network answers $\\epsilon_\\theta = (0.3,\\ -0.8)$. The error vector is $\\epsilon - \\epsilon_\\theta = (0.2,\\ -0.2)$.</li>
          <li>Square each coordinate: $(0.04,\\ 0.04)$; the mean over the 2 coordinates gives $\\hat L = 0.04$.</li>
          <li>Backprop then tells every knob its slope; the slope at the output layer pushes each output coordinate toward the truth — the first output up toward 0.5, the second down toward $-1.0$.</li>
        </ol>` },

      { h: "Reading the loss curve",
        body: `<p>Run the loop and the printed loss traces a curve. Knowing what a <b>healthy</b> curve looks like is half of practical deep learning, so let's set expectations before looking.</p>
        <ul>
          <li><b>It starts near 1.0 — and you can predict that.</b> An untrained network outputs small, essentially arbitrary numbers near 0. So the initial loss is about $\\mathbb{E}[\\epsilon^2]$ per coordinate, and $\\epsilon$ is standard Gaussian: variance 1. First printed loss: close to 1. This is a free sanity check on your whole pipeline.</li>
          <li><b>It falls fast, then wiggles.</b> Each printed value is the Monte-Carlo estimate $\\hat L$ from one random batch of 256, so it carries sampling noise — recall from part 2 that the spread of such an average shrinks like $1/\\sqrt{B}$, but never to zero. The wiggle is the estimate's noise, not the model's mood. Judge the trend, not single points.</li>
          <li><b>It plateaus well above zero — and that is correct.</b> Part 9's loss-versus-$t$ curve showed that even the exact best predictor has leftover error: the variance of $\\epsilon$ that $x_t$ cannot reveal. At tiny $t$ the added noise is microscopic next to the data's own spread, so the noisy point tells you almost nothing about which $\\epsilon$ was drawn, and the floor there is near 1 no matter how good the network is. (Note this small-$t$ end is opposite to part 9's two-point toy: there the clean values were isolated points with no within-mode spread, so tiny noise was fully recoverable and the floor started near zero. Our clusters have their own spread of 0.15, far larger than the earliest noise doses — the floor's shape depends on the dataset.) Averaged over all $t$, the floor for our dataset sits around 0.42 — you can compute it exactly, because for this toy the best possible noise guess $\\mathbb{E}[\\epsilon \\mid x_t, t]$ has a closed form, and its average squared error over the schedule comes out to 0.42. A training loss near zero would be evidence of a bug (or of the network memorizing specific noise draws) — not of success.</li>
        </ul>
        <p>In the canonical notebook run, the loss starts at about 1.0, falls to about 0.6 by step 500, and flattens near 0.46 by step 2,500 — falling, noisy, floored above zero, and sitting just above the 0.42 floor. Exactly the healthy shape: the network is close to the best any predictor could do, not close to zero.</p>` },

      { h: "The sampling loop: Algorithm 2 in code",
        body: `<p>Training never generates anything — it only teaches the network to guess noise. Generation is part 9's Algorithm 2: start from pure noise and apply the learned one-step denoiser $T$ times. The update, once per step from $t = T$ down to $t = 1$:</p>
        <div class="formula-box">$$x_{t-1} \\;=\\; \\frac{1}{\\sqrt{\\alpha_t}}\\left( x_t - \\frac{\\beta_t}{\\sqrt{1-\\bar\\alpha_t}}\\; \\epsilon_\\theta(x_t, t) \\right) + \\sigma_t z, \\qquad z \\sim \\mathcal{N}(0, \\mathbf{I}),\\ \\ \\sigma_t = \\sqrt{\\beta_t},\\ \\ z = 0 \\text{ at } t = 1$$</div>
        <p><b>Read it out loud:</b> to step from level $t$ down to level $t-1$: subtract the right multiple of the network's noise guess from the current point, divide by the square root of the survival factor $\\alpha_t = 1-\\beta_t$ to undo that step's shrinkage, then add a small fresh Gaussian kick of size $\\sigma_t$ — except at the very last step, where you add nothing and keep the clean mean. (Recall from part 9 why the mean has this exact form, and why $z = 0$ at the end.)</p>
        <p>In code, with a batch of 2,000 points walked down together:</p>
        <ul>
          <li><code>xt = torch.randn(2000, 2)</code> — Algorithm 2's "sample $x_T \\sim \\mathcal{N}(0, \\mathbf{I})$": start from pure noise.</li>
          <li><code>for t in range(T, 0, -1):</code> — walk the levels from 200 down to 1.</li>
          <li><code>eps_pred = model(xt, tvec)</code> — ask the network for its noise guess at this level (<code>tvec</code> repeats the current $t$ for the whole batch).</li>
          <li><code>mean = (xt - coef * eps_pred) / torch.sqrt(alphas[t - 1])</code> — the update's mean, with <code>coef</code> $= \\beta_t / \\sqrt{1-\\bar\\alpha_t}$.</li>
          <li><code>xt = mean + torch.sqrt(betas[t - 1]) * torch.randn_like(xt)</code> if $t > 1$, else <code>xt = mean</code> — add the fresh kick, except at the final step.</li>
        </ul>
        <p>Two numbers to hold in your head while you watch it run. Starting points drawn from a 2-D standard Gaussian sit at typical distance $\\sqrt{\\pi/2} \\approx 1.25$ from the origin — but the data lives at radius 4. Where does the growth come from? Each step divides by $\\sqrt{\\alpha_t}$, and $\\alpha_t$ is slightly below 1, so each division stretches the cloud slightly; across all 200 steps the stretches compound to $1/\\sqrt{\\bar\\alpha_T} = 1/\\sqrt{0.132} \\approx 2.75$, and the network's guesses steer the stretched cloud onto the clusters. The notebook snapshots the walk at $t = 200, 150, 100, 50, 25, 0$ so you can watch a featureless blob drift outward, form a ring, and sharpen into eight clusters.</p>` },

      { h: "Did it work? Checks and failure modes",
        body: `<p>For images, judging a generative model is famously slippery. For our toy it is delightfully concrete. Three checks, matching the three requirements from the data section:</p>
        <ul>
          <li><b>Moments.</b> The dataset is symmetric around the origin, so generated points should average to roughly $(0, 0)$, and their mean distance from the origin should be close to 4 (we accept within 15%).</li>
          <li><b>Mode coverage.</b> Assign every generated point to its nearest cluster center; count the points per cluster. A healthy model populates all 8 (we assert at least 6, and the canonical run hits 8). Missing modes is the classic generative failure — the model plays it safe by producing only some kinds of data.</li>
          <li><b>Within-cluster spread.</b> The spread of points around their assigned centers should be near the true 0.15 — not 0 (too tidy: diversity has collapsed) and not 1 (too sloppy: clusters smeared together).</li>
        </ul>
        <p>When a run fails, it usually fails in one of four recognizable ways. This table is worth keeping:</p>
        <table class="symbols">
          <tr><td><b>Symptom</b></td><td><b>Likely cause</b></td><td><b>Fix</b></td></tr>
          <tr><td>Loss plateaus higher than it should, jumping around more than usual</td><td>Learning rate too high — steps overshoot the downhill direction</td><td>Lower $\\eta$ (we use $10^{-3}$). At 100$\\times$ our rate, Adam still limps to a raised plateau (about 0.5-0.65 instead of 0.46) — it takes a considerably larger rate still, or a less forgiving optimizer, to hit outright spikes or NaN</td></tr>
          <tr><td>Loss looks healthy, but samples land short of the true radius with blurry, distorted clusters</td><td>$T$ too small — the forward process never reaches anything like pure noise, so starting Algorithm 2 from $\\mathcal{N}(0, \\mathbf{I})$ starts it somewhere the network never trained</td><td>Raise $T$ (and/or the noise doses) so $\\bar\\alpha_T$ is small. With $T = 20$ here, samples average radius about 3.5 instead of 4 — a real, visible defect, though milder than you might guess</td></tr>
          <tr><td>Loss plateaus higher than usual; samples form one smeared ring with no distinct clusters</td><td>Time embedding missing — one compromise guess is forced to serve every noise level</td><td>Restore $\\epsilon_\\theta(x_t, t)$; the $t$ input is load-bearing</td></tr>
          <tr><td>Samples sit in eight needle-thin dots — within-cluster spread far below 0.15</td><td>Sampling with $z = 0$ at every step — the $\\sigma_t z$ kicks are the sampler's source of diversity</td><td>Keep the noise term at every step except the last</td></tr>
        </table>
        <p>And one non-failure to re-emphasize: a loss plateau above zero is <b>correct behavior</b>, per the previous section. Do not "fix" it.</p>
        <p>The notebook ends with a teaser. Sampling takes 200 network calls, which is the practical pain of DDPMs. What if we naively run only 20 of the 200 update steps, evenly spaced, and just skip the rest? The result is visibly terrible — the samples stay a noisy blob, because each update only removes one small step's worth of noise and we skipped 180 of them. There is a principled way to take big steps; that is part 11.</p>` },

      { h: "Sanity checks",
        body: `<p>Nearly all of these are verified with asserts in the notebook.</p>
        <ul>
          <li><b>Initial loss $\\approx 1$.</b> An untrained network guesses near zero, so the loss starts near the per-coordinate variance of $\\epsilon$, which is exactly 1. Seeing about 1.0 on the first print means the sampler, lookup, and loss wiring are all sane.</li>
          <li><b>Embedding at $t=0$.</b> Every clock angle is $0$, so the embedding is 16 sines equal to 0 followed by 16 cosines equal to 1. Any other pattern means the sin/cos halves are wired wrong.</li>
          <li><b>Embedding range.</b> Sines and cosines of real numbers live in $[-1, 1]$, so every entry of the embedding matrix must too — the promised well-scaled inputs.</li>
          <li><b>Output shape equals data shape.</b> A batch of 256 points must produce a $(256, 2)$ noise guess. If you see $(256, 1)$ or $(256, 34)$, the network is not a denoiser.</li>
          <li><b>Scale growth during sampling.</b> Start: typical radius $\\approx 1.25$ (2-D standard Gaussian). End: mean radius $\\approx 4$. The compounded stretch $1/\\sqrt{\\bar\\alpha_T} \\approx 2.75$ times the steering of the noise guesses accounts for the growth — if samples stay small, suspect the schedule or the loop direction.</li>
          <li><b>The floor is real.</b> Final training loss settles near 0.46, not 0 — just above the exact 0.42 floor that part 9's irreducible-variance analysis predicts for this dataset, averaged over $t$.</li>
          <li><b>Last step adds no noise.</b> With $z = 0$ at $t = 1$, the final positions are posterior means, not draws — remove that special case and the clusters get an extra blur of size $\\sqrt{\\beta_1} = 0.01$ — imperceptible next to this data's cluster spread, but the principle (never hand the user a gratuitously noisy final answer) matters more at scale.</li>
        </ul>` },

      { h: "What you can do now",
        body: `<p>You have trained a real DDPM. Not a metaphor for one — the actual algorithm: Algorithm 1 with minibatches teaching a 21,250-parameter network to guess noise at every level, then Algorithm 2 walking 2,000 pure-noise points down 200 learned steps into eight crisp clusters on a ring of radius 4. You can explain why the network needs $t$, build the sinusoidal embedding from scratch, predict the initial loss before running, defend the plateau above zero, and evaluate the result with moment, coverage, and spread checks. Everything in it was proved in parts 1-9; this part only asked you to believe your own code. If you want to see how the original authors present the same two algorithm boxes, you can now read them directly in <a onclick="App.open('paper-ddpm')">the DDPM paper lesson</a>.</p>
        <p>One discomfort remains, and the notebook's last experiment made it concrete: generation costs one network call per step, 200 calls for one batch of samples — and naive step-skipping wrecks the output. Real systems sample in 20-50 steps anyway. The key that unlocks this is a new reading of the network we just trained: its noise guess is secretly an estimate of the <b>score</b> — the uphill direction of the log density — and once you see that, a deterministic sampler (DDIM) can take principled big jumps along it. That reading, its proof via Tweedie's formula, and the 20-step sampler are part 11.</p>` }
    ],
    symbols: [
      { sym: "$x_0$", desc: "a clean data point — here, one 2-D point from the eight-cluster ring" },
      { sym: "$x_t$", desc: "the data after $t$ small doses of noise" },
      { sym: "$t$", desc: "the timestep (noise level), an integer from 1 to $T$; also the network's second input" },
      { sym: "$T$", desc: "total number of noising steps; 200 in our training code" },
      { sym: "$\\beta_t$", desc: "how much fresh noise step $t$ adds (linear schedule from 0.0001 to 0.02)" },
      { sym: "$\\alpha_t = 1 - \\beta_t$", desc: "the fraction of variance kept at step $t$" },
      { sym: "$\\bar\\alpha_t$", desc: "the fraction of the original signal surviving to step $t$ (product of the $\\alpha$'s)" },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the long-run average (expectation), from part 2 — what the batch loss estimates" },
      { sym: "$\\epsilon$", desc: "fresh standard Gaussian noise, $\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$" },
      { sym: "$\\epsilon_\\theta(x_t, t)$", desc: "the noise-guessing network: data-shaped input and output, timestep-aware" },
      { sym: "$\\theta$", desc: "the network's learnable knobs (parameters); 21,250 numbers in our MLP" },
      { sym: "$L_{\\mathrm{simple}}$", desc: "the training loss: expected squared error between true and guessed noise" },
      { sym: "$\\hat L$", desc: "the batch loss — a Monte-Carlo estimate of $L_{\\mathrm{simple}}$ from $B$ random triples" },
      { sym: "$B$", desc: "the minibatch size; 256 in our training loop" },
      { sym: "$e(t)$", desc: "the sinusoidal time embedding: 32 numbers, sines and cosines of $t$ at 16 frequencies" },
      { sym: "$\\omega_k$", desc: "the $k$-th embedding frequency, sliding from 1 down to 1/10000" },
      { sym: "$K$", desc: "the number of embedding frequencies; 16 here, giving a $2K = 32$-number embedding" },
      { sym: "$\\eta$", desc: "the learning rate — the optimizer's base step size; 0.001 here" },
      { sym: "$\\sigma_t$", desc: "the sampling noise scale at step $t$; we use $\\sigma_t = \\sqrt{\\beta_t}$" },
      { sym: "$z$", desc: "the fresh Gaussian kick added at each sampling step; set to 0 at the final step" }
    ],
    recall: [
      "Why must a single noise-guessing network be told the timestep $t$? Give the concrete two-noise-levels argument.",
      "Raw $t$ is a poor network input for two reasons — what are they?",
      "In the clock picture of the sinusoidal embedding, what do the fastest and slowest frequencies each contribute, and why are both sine and cosine needed?",
      "In Algorithm 1's loop, which three things are sampled fresh at every training step?",
      "What quantity does the minibatch loss approximate, and by which principle from part 2?",
      "Why does a healthy training loss plateau well above zero — and what would a near-zero loss suggest?",
      "In Algorithm 2, what does the $\\sigma_t z$ term provide, and why is $z$ set to 0 at the last step?",
      "Name the four failure modes from the table and one telltale symptom of each."
    ],
    practice: [
      { q: "Shape tracking. The notebook's network processes a minibatch of $B = 256$ noisy points with a 32-number time embedding and hidden layers of 128 units. Build the shape table: give the shape of (a) the batch of noisy points, (b) the timestep vector, (c) the embedding, (d) the concatenated network input, (e) each hidden activation, and (f) the output — and check that the output shape matches the data shape.",
        steps: [
          { do: "(a) The batch holds 256 points with 2 coordinates each, so <code>xt</code> has shape $(256, 2)$.", why: "A minibatch stacks one example per row; columns are that example's numbers." },
          { do: "(b) Each example carries one integer noise level, so <code>t</code> has shape $(256,)$ — a flat vector.", why: "There is exactly one $t$ per example, sampled independently in Algorithm 1." },
          { do: "(c) The embedding turns each integer into 32 numbers (16 sines, 16 cosines), so <code>emb</code> has shape $(256, 32)$.", why: "The embedding maps one number to $2K = 32$ clock readings, row by row." },
          { do: "(d) Concatenating along the feature dimension glues 2 and 32 into $2 + 32 = 34$, giving shape $(256, 34)$.", why: "<code>torch.cat(..., dim=1)</code> adds feature counts and leaves the batch dimension alone." },
          { do: "(e) The first Linear maps 34 features to 128, giving $(256, 128)$; the second maps 128 to 128, keeping $(256, 128)$.", why: "A Linear layer changes only the last (feature) dimension, from its input width to its output width." },
          { do: "(f) The output Linear maps 128 to 2, giving $(256, 2)$ — the same shape as the batch of data points.", why: "The network predicts one noise vector per point, and a noise vector has the data's shape: data-shaped in, data-shaped out." }
        ],
        answer: "$(256,2) \\to (256,) \\to (256,32) \\to (256,34) \\to (256,128) \\to (256,128) \\to (256,2)$. The output shape equals the data shape, as a denoiser requires." },
      { q: "Time embedding by hand. Take a small embedding with $K = 2$ frequencies: $\\omega_1 = 1$ and $\\omega_2 = 0.1$, so $e(t) = (\\sin(t), \\sin(0.1\\,t), \\cos(t), \\cos(0.1\\,t))$. Compute $e(0)$ exactly, and $e(5)$ with a calculator to 3 decimals. Which coordinates changed a lot between the two, and which barely moved?",
        steps: [
          { do: "At $t=0$ every clock angle is $0 \\cdot \\omega = 0$, and $\\sin(0) = 0$, $\\cos(0) = 1$, so $e(0) = (0,\\ 0,\\ 1,\\ 1)$.", why: "Multiplying by 0 sends every frequency to angle zero; sine of zero is 0 and cosine of zero is 1." },
          { do: "At $t=5$ the fast angle is $\\omega_1 t = 1 \\cdot 5 = 5$ radians.", why: "The clock angle is always frequency times timestep." },
          { do: "Calculator: $\\sin(5) = -0.959$ and $\\cos(5) = 0.284$.", why: "5 radians is most of a full turn ($2\\pi \\approx 6.28$), so the fast hand has swung far around the clock." },
          { do: "The slow angle is $\\omega_2 t = 0.1 \\cdot 5 = 0.5$ radians, and $\\sin(0.5) = 0.479$, $\\cos(0.5) = 0.878$.", why: "The slow hand ticks at one tenth the speed, so it has moved only half a radian." },
          { do: "Assemble: $e(5) = (-0.959,\\ 0.479,\\ 0.284,\\ 0.878)$, versus $e(0) = (0,\\ 0,\\ 1,\\ 1)$.", why: "The embedding lists all sines first, then all cosines, in frequency order." },
          { do: "Compare coordinate by coordinate: the fast pair moved from $(0, 1)$ to $(-0.959, 0.284)$ — a large swing — while the slow pair moved from $(0, 1)$ to $(0.479, 0.878)$ — a modest drift.", why: "Five timesteps is nearly a full turn for the fast hand but only a twelfth of a turn for the slow one; fast frequencies resolve nearby timesteps, slow ones track global position." }
        ],
        answer: "$e(0) = (0, 0, 1, 1)$ and $e(5) = (-0.959,\\ 0.479,\\ 0.284,\\ 0.878)$. The fast-frequency pair changed dramatically; the slow-frequency pair barely moved — the fast hand separates nearby $t$'s, the slow hand separates early from late." },
      { q: "What the batch loss estimates. The loop computes $\\hat L = \\frac{1}{256}\\sum_i \\|\\epsilon^{(i)} - \\epsilon_\\theta(x^{(i)}_{t_i}, t_i)\\|^2$ from one random minibatch. What exact quantity is $\\hat L$ an estimate of, why is the estimate trustworthy, and what happens to its reliability if you grow the batch from 256 to 1,024?",
        steps: [
          { do: "Identify the target: the true loss $L_{\\mathrm{simple}}(\\theta) = \\mathbb{E}_{x_0, t, \\epsilon}\\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2$, an expectation — a long-run average over every possible (clean point, timestep, noise) triple.", why: "The batch loss has exactly this expression inside the sum; only the averaging differs — a finite sample average instead of the full expectation." },
          { do: "Recognize the estimator: each of the 256 triples is drawn independently from the same recipe the expectation averages over, so $\\hat L$ is a Monte-Carlo estimate of $L_{\\mathrm{simple}}$.", why: "Part 2's sampling principle: the average of independent samples of a random quantity approaches that quantity's expectation — the law of large numbers." },
          { do: "State its behavior: on average over redraws, $\\hat L$ equals the true loss (no systematic bias), and its random spread around the truth shrinks like $1/\\sqrt{B}$.", why: "Averaging $B$ independent copies divides the variance by $B$ (part 2's variance rule for independent sums), so the typical deviation scales as $1/\\sqrt{B}$." },
          { do: "Apply it: growing $B$ from 256 to 1,024 multiplies $B$ by 4, so the spread shrinks by $\\sqrt{4} = 2$ — a loss curve half as wiggly, at 4 times the compute per step.", why: "The $1/\\sqrt{B}$ law means each halving of the noise costs a quadrupling of the batch — accuracy of the estimate gets expensive fast." }
        ],
        answer: "$\\hat L$ is a Monte-Carlo estimate of $L_{\\mathrm{simple}}(\\theta)$, the expectation over clean points, timesteps, and noise. It is trustworthy by the law of large numbers, with spread shrinking like $1/\\sqrt{B}$: quadrupling the batch to 1,024 halves the wiggle in the loss curve." },
      { q: "Trace one training iteration on paper. Use the running $T = 3$ schedule from part 6, where $\\bar\\alpha_1 = 0.9$. The sampled triple is $x_0 = (1,\\ -1)$, $t = 1$, $\\epsilon = (-0.5,\\ 0.5)$, and the network answers $\\epsilon_\\theta = (0.1,\\ 0.1)$. Compute the noisy input $x_1$, the batch loss $\\hat L$ (mean over the 2 coordinates), and say which direction the update pushes each output coordinate.",
        steps: [
          { do: "Signal scale: $\\sqrt{\\bar\\alpha_1} = \\sqrt{0.9} = 0.9487$.", why: "The one-line sampler needs the square root of the survival fraction, because variances scale with the square of a multiplier (part 3's scaling rule)." },
          { do: "Signal part: $0.9487 \\cdot (1,\\ -1) = (0.9487,\\ -0.9487)$.", why: "Multiply the clean point by the signal scale, coordinate by coordinate." },
          { do: "Noise scale: $\\sqrt{1 - \\bar\\alpha_1} = \\sqrt{0.1} = 0.3162$, so the noise part is $0.3162 \\cdot (-0.5,\\ 0.5) = (-0.1581,\\ 0.1581)$.", why: "The remaining fraction of variance, $1-\\bar\\alpha_t$, belongs to the noise; again the amplitude is its square root." },
          { do: "Add: $x_1 = (0.9487 - 0.1581,\\ -0.9487 + 0.1581) = (0.7906,\\ -0.7906)$.", why: "The one-line sampler is exactly signal part plus noise part: $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$." },
          { do: "Error vector: $\\epsilon - \\epsilon_\\theta = (-0.5 - 0.1,\\ 0.5 - 0.1) = (-0.6,\\ 0.4)$.", why: "The loss compares the true noise against the guess, coordinate by coordinate." },
          { do: "Square each coordinate: $(0.36,\\ 0.16)$.", why: "Squared error penalizes each coordinate's miss by its square, making the loss smooth and always nonnegative." },
          { do: "Average the two squares: $\\hat L = (0.36 + 0.16)/2 = 0.26$.", why: "The code uses <code>.mean()</code>, which averages over coordinates (and over the batch — here of size 1)." },
          { do: "Update direction: the first guess (0.1) is above the truth ($-0.5$), so its slope pushes it down; the second (0.1) is below the truth (0.5), so its slope pushes it up.", why: "The slope of a squared error with respect to a guess points from the truth toward the guess, so gradient descent moves each guess toward its truth." }
        ],
        answer: "$x_1 = (0.7906,\\ -0.7906)$, loss $\\hat L = 0.26$, and the update pushes the first output down toward $-0.5$ and the second up toward $0.5$." },
      { q: "Why sample $t$ uniformly? Algorithm 1 draws $t$ uniformly from $\\{1, \\dots, T\\}$ at every training step. Explain what this choice accomplishes, and what would go wrong at generation time if we trained only on $t \\le 100$ (of $T = 200$).",
        steps: [
          { do: "State what the loss demands: $L_{\\mathrm{simple}}$ averages the guessing error over $t$ drawn uniformly, so a faithful Monte-Carlo estimate must draw $t$ from that same uniform recipe.", why: "Part 2's sampling principle only works when the samples come from the distribution the expectation is over — sample differently and you estimate a different loss." },
          { do: "Note the coverage consequence: uniform $t$ means every noise level appears in training equally often, so the single shared network gets practice at all 200 of its jobs.", why: "The network is 200 denoisers sharing one set of weights; a level it never trains on is a job it never learned." },
          { do: "Now run the failure forward: train only on $t \\le 100$, then start Algorithm 2 at $t = 200$. The very first call is $\\epsilon_\\theta(x_{200}, 200)$ — a level (and an input scale) the network has never seen.", why: "Algorithm 2 visits every level from $T$ down to 1 in order; there is no way to skip the untrained ones." },
          { do: "Propagate the damage: the guesses at levels 200 down to 101 are unreliable, so by the time the walk reaches the well-trained levels, $x_{100}$ is not the kind of half-denoised point those levels trained on — garbage in, garbage down the whole chain.", why: "Each step's input is the previous step's output; early errors are inherited, and the trained levels only work on inputs that look like the forward process at that level." }
        ],
        answer: "Uniform $t$ makes the batch loss an unbiased estimate of the true loss and gives every noise level equal practice. Training only on $t \\le 100$ leaves levels 101-200 unlearned — and Algorithm 2 calls those levels first, so the walk is corrupted from its very first steps and the later, well-trained levels receive inputs unlike anything they trained on." },
      { q: "Failure-mode matching. Four runs went wrong. Match each symptom to its cause (learning rate too high; $T$ too small; time embedding missing; sampling noise $\\sigma_t z$ dropped) and state the fix. (A) Samples form eight needle-thin dots with within-cluster spread around 0.06 — far below the data's 0.15. (B) The loss becomes NaN before step 500. (C) The loss plateaus noticeably higher than usual and samples form one smeared ring with no distinct clusters. (D) The loss curve looks healthy but samples average radius about 3.5 instead of 4, with blurry, distorted clusters.",
        steps: [
          { do: "(A) Needle-thin dots means the samples reached the right places but with collapsed diversity — that is sampling with $z = 0$ at every step. Fix: keep the $\\sigma_t z$ kick at every step except the last.", why: "The mean update is a deterministic pull toward high-probability points; the $\\sigma_t z$ term is the sampler's only source of within-cluster spread, so removing it shrinks each cluster far below the true 0.15." },
          { do: "(B) NaN loss early in training is the signature of a learning rate far too high — well beyond the 100$\\times$ that the failure-mode table showed merely raises the plateau under Adam. Fix: reduce $\\eta$ toward $10^{-3}$.", why: "Oversized steps overshoot the downhill direction, the loss grows, the slopes grow with it, and the feedback loop blows the weights up to overflow within a few hundred steps." },
          { do: "(C) A raised plateau plus a single smeared ring is the missing time embedding. Fix: restore the $t$ input.", why: "Without $t$ the network must produce one compromise guess for all 200 levels; it cannot specialize, so its best achievable loss is higher, and sampling with compromise guesses blurs the clusters into a ring." },
          { do: "(D) Healthy loss but samples short of the ring with degraded clusters is $T$ too small. Fix: increase $T$ so $\\bar\\alpha_T$ is genuinely tiny.", why: "With too few steps the forward process never reaches pure noise, so $q(x_T)$ still carries signal — but Algorithm 2 starts from $\\mathcal{N}(0, \\mathbf{I})$ anyway, a mismatch the training loss never measures. The walk begins off-distribution; the network's large off-distribution noise guesses stretch the cloud most of the way out, but the residual radius deficit and distorted clusters remain as the visible symptom." }
        ],
        answer: "A: dropped $\\sigma_t z$ — restore the per-step noise. B: learning rate too high — lower $\\eta$. C: missing time embedding — restore the $t$ input. D: $T$ too small — lengthen the schedule so $\\bar\\alpha_T \\approx 0$. Note that B and C's raised plateau show up in the loss curve; A and D require looking at samples — which is why we always evaluate generations, not just losses." }
    ]
  });
})();
