/* Rigorous Courses · Diffusion Models — Part 08: One number to train on: the ELBO for diffusion.
   Owns the generative chain p_theta(x_{0:T}), the ELBO with the fixed forward chain as q, and the
   full decomposition into L_T + sum L_{t-1} + L_0, down to "hit the posterior mean". */
(function () {
  window.LESSONS.push({
    id: "diff-08-variational-bound",
    title: "Part 8 — One number to train on: the ELBO for diffusion",
    tagline: "The whole reverse chain gets scored by one trainable number, and it splits into per-step Gaussian comparisons",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 8,
    partTotal: 12,
    prereqs: ["diff-07-reverse-posterior"],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Write down the diffusion generative model $p_\\theta(x_{0:T})$ and explain why its starting distribution $p(x_T)$ is fixed at pure noise rather than learned.</li>
        <li>Apply part 5's ELBO with the fixed forward chain playing the role of the helper $q$, and say precisely how this differs from a VAE.</li>
        <li>Derive, line by line, the decomposition $-\\mathrm{ELBO} = L_T + \\sum_{t&gt;1} L_{t-1} + L_0$, including the Bayes flip and the telescoping cancellation.</li>
        <li>Say which terms depend on $\\theta$, and reduce each $L_{t-1}$ to a squared distance between means when the variances are fixed.</li>
        <li>Compute a KL term of a tiny discrete diffusion by hand, by enumeration.</li>
      </ul>`,
    sections: [
      {
        h: "Where we are",
        body: `<p>Here is where the course stands. Part 5 built the scoring toolkit: the <b>likelihood</b> measures how much probability a model assigns to the data, the <b>KL divergence</b> $D_{\\mathrm{KL}}(q \\,\\|\\, p)$ measures the mismatch cost from $q$ to $p$, and the ELBO gave us an exact identity: log-likelihood equals a computable bound plus a gap, and the gap is a KL, so it is never negative. Part 6 built the destruction machine: the fixed forward chain turns any clean point $x_0$ into near-perfect noise, with the closed form $q(x_t \\mid x_0) = \\mathcal{N}(\\sqrt{\\bar\\alpha_t}\\, x_0,\\ (1-\\bar\\alpha_t)\\mathbf{I})$, and by step $T = 1000$ only a fraction $\\bar\\alpha_T \\approx 4 \\times 10^{-5}$ of the original signal survives. Part 7 built the ideal repair step: if you know the clean point $x_0$, the exact one-step denoiser is the Gaussian $q(x_{t-1} \\mid x_t, x_0) = \\mathcal{N}(\\tilde\\mu_t, \\tilde\\beta_t)$, and the oracle sampler showed that chaining these exact steps really does rebuild data from pure noise.</p>
        <p>What we do not have yet is anything to train. We want a network whose one-step denoiser $p_\\theta(x_{t-1} \\mid x_t)$ imitates the ideal one. But "imitate" is a wish, not an objective. Training needs <b>one number</b> that scores the entire reverse chain at once — a number that improves exactly when the model improves, and that a computer can evaluate from samples. This part derives that number. It is part 5's ELBO applied to the diffusion chain, and under the algebra it falls apart into a sum of per-step Gaussian comparisons: one small, honest question per timestep — "did your guess for the previous frame match the true denoiser's guess?"</p>`
      },
      {
        h: "The generative model: noise in, data out",
        body: `<p>Let's write down the machine we intend to build. Generation starts at pure noise and walks backward: draw $x_T$, denoise one step to get $x_{T-1}$, then $x_{T-2}$, and so on down to $x_0$. Each backward step is random, not deterministic — part 7 showed the ideal step is a Gaussian with a small spread, so we make our model's steps Gaussians too. The model assigns a probability to the whole path. We write the path as $x_{0:T}$, shorthand for "$x_0$ through $x_T$, all together". By the <b>chain rule of probability</b> from part 4 — a joint probability is a product of one-step conditionals — the model factorizes into a start times $T$ steps:</p>
        <div class="formula-box">$$p_\\theta(x_{0:T}) = p(x_T)\\,\\prod_{t=1}^{T} p_\\theta(x_{t-1} \\mid x_t), \\qquad p(x_T) = \\mathcal{N}(x_T;\\, 0,\\, \\mathbf{I})$$</div>
        <p><b>Read it out loud:</b> the probability the model gives to a full path is the probability of the starting noise $x_T$, times the probability of each denoising step from $x_t$ down to $x_{t-1}$, multiplied over all $T$ steps. The start $p(x_T)$ is fixed at the standard bell curve in every coordinate; only the step rule $p_\\theta$ has knobs $\\theta$ to learn.</p>
        <p>Why may we <b>fix</b> $p(x_T)$ instead of learning it? Because of part 6's end-state calculation. After the full forward schedule, only $\\bar\\alpha_T \\approx 4 \\times 10^{-5}$ of the signal survives — whatever image you started from, $x_T$ is statistically indistinguishable from $\\mathcal{N}(0, \\mathbf{I})$ noise. A starting distribution that every input reaches contains nothing about the data, so there is nothing left in it to learn. In the Sanity checks section we will price this choice in actual numbers: it costs about $8 \\times 10^{-5}$ nats per coordinate. (A <b>nat</b>, recall from part 5, is the unit of log-probability when logs are natural logs. Everything in this part uses natural logs.)</p>
        <p>What do we want from training? Part 5's answer: make the data likely — maximize the log-likelihood. But there is a mismatch of shapes. The model assigns probability to full paths $x_{0:T}$, while the dataset only contains clean points $x_0$. The noisy frames $x_{1:T}$ are nobody's data; they are internal scaffolding. So the number we care about is the <b>marginal</b> probability of $x_0$ alone: add up the path probability over every possible way the scaffolding could be filled in. For continuous values, "add up over every possibility" is an integral — the accumulated-area idea from part 2, here run over many coordinates at once:</p>
        <div class="formula-box">$$p_\\theta(x_0) = \\int p_\\theta(x_{0:T})\\; dx_{1:T}$$</div>
        <p><b>Read it out loud:</b> the probability the model gives to a clean point is the total, accumulated over every possible noisy path that ends at that clean point, of the probability of the whole path.</p>
        <p>And here is the wall. For images with $T = 1000$ steps of a 784-number image, that integral runs over $1000 \\times 784 = 784{,}000$ linked numbers. No computer can enumerate that, and no formula collapses it directly. Part 5 hit exactly this wall with a single latent variable and answered with the ELBO. Here the latent is the entire noisy path — but the answer is the same.</p>`
      },
      {
        h: "Borrow the ELBO: the forward chain is our q",
        body: `<p>Recall part 5's setup. You have a model with a hidden (latent) variable, you cannot compute the marginal likelihood directly, so you bring in a <b>helper distribution</b> $q$ over the hidden variable and get an exact identity: the log-likelihood splits into a computable part (the ELBO) plus a gap, and the gap is a KL. Diffusion drops straight into this template. The hidden variable is the whole noisy path $x_{1:T}$. The helper is something we already own: the forward noising chain from part 6, $q(x_{1:T} \\mid x_0) = \\prod_{t=1}^{T} q(x_t \\mid x_{t-1})$ — a fixed recipe with zero learnable parameters. Part 5's identity, with these names plugged in, reads:</p>
        <div class="formula-box">$$\\log p_\\theta(x_0) = \\mathrm{ELBO}(x_0) + D_{\\mathrm{KL}}\\big(q(x_{1:T} \\mid x_0)\\,\\big\\|\\,p_\\theta(x_{1:T} \\mid x_0)\\big)$$</div>
        <p><b>Read it out loud:</b> the true log-likelihood of a clean point equals the ELBO plus a gap; the gap is the mismatch cost between the forward chain's distribution over noisy paths and the model's own idea of which noisy paths lead to that clean point. Since a KL is never negative (part 5 proved this with Jensen's inequality), the ELBO never exceeds the true log-likelihood: push the ELBO up and the log-likelihood is dragged up with it.</p>
        <p>The ELBO itself is the same expression as in part 5 — an average, under the helper, of a log-ratio of the two joint probabilities:</p>
        <div class="formula-box">$$\\mathrm{ELBO}(x_0) = \\mathbb{E}_{q(x_{1:T} \\mid x_0)}\\big[\\log p_\\theta(x_{0:T}) - \\log q(x_{1:T} \\mid x_0)\\big]$$</div>
        <p><b>Read it out loud:</b> run the forward noising chain on $x_0$ to get a random noisy path; score that full path under the model, minus its score under the forward chain itself; the ELBO is the long-run average of that difference over many runs of the noising chain. Every ingredient is computable: the forward chain is a fixed recipe we can sample and score, and the model is a product of Gaussians we can score.</p>
        <p>One design decision makes diffusion different from the <a onclick="App.open('mod-vae')">variational autoencoder</a>, and it is worth staring at:</p>
        <table class="symbols">
          <tr><td></td><td><b>VAE</b></td><td><b>Diffusion</b></td></tr>
          <tr><td>hidden variable</td><td>a compressed code $z$</td><td>the whole noisy path $x_{1:T}$</td></tr>
          <tr><td>helper $q$</td><td>a learned encoder network</td><td>the fixed forward noising chain — zero parameters</td></tr>
          <tr><td>what training moves</td><td>both $q$ and $p_\\theta$</td><td>only $p_\\theta$</td></tr>
          <tr><td>how the gap shrinks</td><td>$q$ chases the model's posterior</td><td>$p_\\theta$'s reverse chain learns to match the fixed $q$'s reversal</td></tr>
        </table>
        <p>In a VAE, the helper is trained to chase the model. In diffusion, the helper cannot move — so training reshapes the model until the model's own posterior over paths agrees with the fixed noising chain. Same bound, opposite direction of chase.</p>
        <p>Two bookkeeping conventions before the algebra. First, signs: we want to <b>maximize</b> the ELBO. Optimizers prefer minimizing, so we will define the loss as $L = -\\mathrm{ELBO}$ and minimize it; the two are the same request. Second, the expectation $\\mathbb{E}_{q}$ always means "average over noisy paths drawn from the forward chain, started at the given $x_0$" — we will abbreviate the subscript when the context is clear.</p>`
      },
      {
        h: "Unpacking the bound: sums of logs",
        body: `<p>Now we do the honest work: turn the one-line ELBO into something with visible, separately-fixable pieces. Substitute the two factorized chains — the model from this part, the forward chain from part 6 — into the ELBO:</p>
        <div class="formula-box">$$\\mathrm{ELBO}(x_0) = \\mathbb{E}_{q}\\left[\\log \\frac{p(x_T)\\,\\prod_{t=1}^{T} p_\\theta(x_{t-1} \\mid x_t)}{\\prod_{t=1}^{T} q(x_t \\mid x_{t-1})}\\right]$$</div>
        <p><b>Read it out loud:</b> the ELBO is the average log-ratio between the model's probability for the whole path — starting noise times all the denoising steps — and the forward chain's probability for the same path, which is the product of its noising steps.</p>
        <p>We take this apart one legal move at a time.</p>
        <ol>
          <li><b>Split the quotient.</b> The log of a quotient is the difference of logs, so the big log becomes $\\log\\big(p(x_T)\\prod_t p_\\theta(x_{t-1} \\mid x_t)\\big) - \\log\\prod_t q(x_t \\mid x_{t-1})$. <b>Why allowed:</b> the log rule $\\log(a/b) = \\log a - \\log b$, valid because both probabilities are positive.</li>
          <li><b>Split the top product.</b> The log of a product is the sum of logs, so the first piece becomes $\\log p(x_T) + \\sum_{t=1}^{T} \\log p_\\theta(x_{t-1} \\mid x_t)$. <b>Why allowed:</b> the log rule $\\log(ab) = \\log a + \\log b$, applied $T$ times.</li>
          <li><b>Split the bottom product.</b> The same rule turns the second piece into $\\sum_{t=1}^{T} \\log q(x_t \\mid x_{t-1})$. <b>Why allowed:</b> same log rule.</li>
          <li><b>Assemble.</b> Substituting the pieces back in gives the expanded form shown in the box below. <b>Why allowed:</b> we only rewrote the inside of the expectation; the average of an unchanged quantity is unchanged.</li>
          <li><b>Set the $t = 1$ terms aside.</b> Pull $\\log p_\\theta(x_0 \\mid x_1)$ out of the first sum and $\\log q(x_1 \\mid x_0)$ out of the second, leaving both sums running from $t = 2$. <b>Why this move:</b> the next section's Bayes flip rewrites $q(x_t \\mid x_{t-1})$ using the posterior $q(x_{t-1} \\mid x_t, x_0)$, and at $t = 1$ that posterior would be "$q(x_0 \\mid x_1, x_0)$" — a distribution over $x_0$ that already conditions on $x_0$. That is a meaningless self-reference, so $t = 1$ gets separate treatment. Watch what happens to the set-aside $\\log q(x_1 \\mid x_0)$: the derivation is about to cancel it perfectly.</li>
        </ol>
        <div class="formula-box">$$\\mathrm{ELBO}(x_0) = \\mathbb{E}_{q}\\Big[\\log p(x_T) + \\log p_\\theta(x_0 \\mid x_1) - \\log q(x_1 \\mid x_0) + \\sum_{t=2}^{T} \\log p_\\theta(x_{t-1} \\mid x_t) - \\sum_{t=2}^{T} \\log q(x_t \\mid x_{t-1})\\Big]$$</div>
        <p><b>Read it out loud:</b> the ELBO is the average of five pieces: the score of the final noise under the fixed start, the score of the last decode step, minus the score of the first noising step, plus all the later denoising-step scores, minus all the later noising-step scores.</p>
        <p>Look at the last sum. Each $q(x_t \\mid x_{t-1})$ runs <b>forward</b> in time, while each $p_\\theta(x_{t-1} \\mid x_t)$ runs <b>backward</b>. Comparing a forward step against a backward step is awkward — they answer different questions. The fix is the move this whole course has been building toward.</p>`
      },
      {
        h: "The Bayes flip and the telescope",
        body: `<p>Part 7 taught us how to turn the forward kernel around: condition on the clean point $x_0$, and Bayes' rule rewrites the forward step as a backward step times a ratio of marginals. Two one-line moves. First, the <b>Markov property</b> from part 4: given $x_{t-1}$, the earlier history adds nothing, so $q(x_t \\mid x_{t-1}) = q(x_t \\mid x_{t-1}, x_0)$ — we may quietly add $x_0$ to the condition. Second, Bayes' rule from part 2, applied with $x_0$ riding along in every condition:</p>
        <div class="formula-box">$$q(x_t \\mid x_{t-1}) \\;=\\; q(x_t \\mid x_{t-1}, x_0) \\;=\\; \\frac{q(x_{t-1} \\mid x_t, x_0)\\; q(x_t \\mid x_0)}{q(x_{t-1} \\mid x_0)}$$</div>
        <p><b>Read it out loud:</b> a forward noising step, once you also know the clean start, equals the true backward denoising step from part 7, times the chance of being at the new spot, divided by the chance of being at the old spot — both chances measured from the clean start via part 6's closed form.</p>
        <p>Now substitute this into the sum $-\\sum_{t=2}^{T} \\log q(x_t \\mid x_{t-1})$, one legal move at a time.</p>
        <ol>
          <li><b>Take logs of the flip.</b> For each $t \\ge 2$: $\\log q(x_t \\mid x_{t-1}) = \\log q(x_{t-1} \\mid x_t, x_0) + \\log q(x_t \\mid x_0) - \\log q(x_{t-1} \\mid x_0)$. <b>Why allowed:</b> log of a product is a sum of logs; log of a quotient is a difference.</li>
          <li><b>Substitute into the sum.</b> $-\\sum_{t=2}^{T} \\log q(x_t \\mid x_{t-1}) = -\\sum_{t=2}^{T} \\log q(x_{t-1} \\mid x_t, x_0) \\;-\\; \\sum_{t=2}^{T} \\big[\\log q(x_t \\mid x_0) - \\log q(x_{t-1} \\mid x_0)\\big]$. <b>Why allowed:</b> replacing each summand by an equal expression, then splitting one sum into two.</li>
          <li><b>Stare at the second sum.</b> It is a <b>telescope</b>: each term subtracts the marginal at one step and adds it back at the next. Write $q_t$ as shorthand for the number $\\log q(x_t \\mid x_0)$ and watch $T = 3$ in full below. <b>Why this works:</b> adding the same number with opposite signs contributes exactly zero.</li>
        </ol>
        <div class="formula-box">$$\\big(\\underbrace{q_2 - q_1}_{t=2}\\big) + \\big(\\underbrace{q_3 - q_2}_{t=3}\\big) = q_3 - q_1 \\qquad \\text{because } +q_2 \\text{ meets } -q_2$$</div>
        <p><b>Read it out loud:</b> for a three-step chain, the telescoping sum is "step-2 marginal minus step-1 marginal, plus step-3 marginal minus step-2 marginal"; the step-2 marginal appears once with a plus and once with a minus, so it vanishes, leaving only the last marginal minus the first. The notebook prints these ratios with real numbers so you can watch the middle terms disappear.</p>
        <p>The same cancellation runs for any $T$: every intermediate marginal is added by one term and subtracted by the next. Only two survivors remain — the very last top and the very first bottom:</p>
        <div class="formula-box">$$\\sum_{t=2}^{T} \\log\\frac{q(x_t \\mid x_0)}{q(x_{t-1} \\mid x_0)} = \\log\\frac{q(x_T \\mid x_0)}{q(x_1 \\mid x_0)}$$</div>
        <p><b>Read it out loud:</b> the sum of all the step-to-step marginal ratios collapses to a single ratio — the chance of the final noisy frame over the chance of the first noisy frame, both measured from the clean start. A sum of $T - 1$ terms became one term.</p>
        <p>And now the payoff for setting $t = 1$ aside. The telescope hands us a $+\\log q(x_1 \\mid x_0)$ (from the collapsed ratio's denominator, once the minus sign in front of the sum is applied). Back in the expanded ELBO there is a $-\\log q(x_1 \\mid x_0)$ waiting — the term we split off in the previous section. They are the same number with opposite signs: they cancel, completely. The awkward score of the first noising step leaves the story, and it is exactly the reason the derivation split $t = 1$ off in the first place.</p>`
      },
      {
        h: "Three kinds of terms: naming the pieces",
        body: `<p>Collect everything that survived. The $\\log p(x_T)$ pairs with the telescope's surviving $-\\log q(x_T \\mid x_0)$; each denoising score $\\log p_\\theta(x_{t-1} \\mid x_t)$ pairs with its flipped partner $-\\log q(x_{t-1} \\mid x_t, x_0)$; and the decode score $\\log p_\\theta(x_0 \\mid x_1)$ stands alone:</p>
        <div class="formula-box">$$\\mathrm{ELBO}(x_0) = \\mathbb{E}_{q}\\Big[\\log\\frac{p(x_T)}{q(x_T \\mid x_0)} \\;+\\; \\sum_{t=2}^{T} \\log\\frac{p_\\theta(x_{t-1} \\mid x_t)}{q(x_{t-1} \\mid x_t, x_0)} \\;+\\; \\log p_\\theta(x_0 \\mid x_1)\\Big]$$</div>
        <p><b>Read it out loud:</b> the ELBO is the average of three kinds of comparison — how well the fixed noise start explains where the forward chain actually ended; at every middle step, how well the learned denoiser matches the true denoiser from part 7; and how well the final step explains the clean data point.</p>
        <p>Two finishing moves turn each comparison into a named, non-negative cost. First, negate: minimizing $-\\mathrm{ELBO}$ is the same request as maximizing the ELBO, and negating a log-ratio flips its fraction — so every "model over truth" ratio becomes "truth over model", the exact shape of a KL divergence. Second, <b>average in stages</b>. The outer $\\mathbb{E}_q$ averages over whole paths, but each term only mentions one or two frames. Part 2's rule — an average of averages is the overall average — lets us average the inner frame first, holding the outer frames fixed. For the middle terms: freeze $x_t$, average the log-ratio over $x_{t-1} \\sim q(x_{t-1} \\mid x_t, x_0)$, and that inner average <b>is</b>, by definition, the KL divergence $D_{\\mathrm{KL}}\\big(q(x_{t-1} \\mid x_t, x_0) \\,\\|\\, p_\\theta(x_{t-1} \\mid x_t)\\big)$; then average that KL over where $x_t$ lands. For the first term, only $x_T$ matters, and averaging over $x_T \\sim q(x_T \\mid x_0)$ gives a plain KL. The result is the most important equation of this part:</p>
        <div class="formula-box">$$-\\mathrm{ELBO}(x_0) \\;=\\; L_T \\;+\\; \\sum_{t=2}^{T} L_{t-1} \\;+\\; L_0$$</div>
        <p><b>Read it out loud:</b> the loss — the thing we minimize — is a sum of $T + 1$ separate costs: one for the start of the reverse chain, one for every middle denoising step, and one for the final decode into clean data.</p>
        <div class="formula-box">$$\\begin{aligned} L_T &= D_{\\mathrm{KL}}\\big(q(x_T \\mid x_0) \\,\\|\\, p(x_T)\\big) \\\\ L_{t-1} &= \\mathbb{E}_{q(x_t \\mid x_0)}\\, D_{\\mathrm{KL}}\\big(q(x_{t-1} \\mid x_t, x_0) \\,\\|\\, p_\\theta(x_{t-1} \\mid x_t)\\big) \\\\ L_0 &= -\\,\\mathbb{E}_{q(x_1 \\mid x_0)}\\, \\log p_\\theta(x_0 \\mid x_1) \\end{aligned}$$</div>
        <p><b>Read it out loud:</b> the start cost $L_T$ is the mismatch between where the forward chain actually ends and the pure-noise start we assumed; each middle cost $L_{t-1}$ is the mismatch between the true one-step denoiser and the learned one, averaged over the noisy inputs the network will actually face; the decode cost $L_0$ is how surprised the final step is by the true clean point.</p>
        <p>Now read each piece as a job description.</p>
        <ul>
          <li><b>$L_T$ — no knobs, ignore it.</b> Look inside: $q(x_T \\mid x_0)$ is fixed by the schedule, and $p(x_T)$ is the fixed noise start. No $\\theta$ appears anywhere. It is a constant of the schedule — training cannot change it, so we drop it from the loss. (Sanity checks below: for the real schedule it is about $8 \\times 10^{-5}$ nats per coordinate. Tiny, exactly because part 6's forward process really does end in noise.)</li>
          <li><b>$L_{t-1}$ — the training signal.</b> Each one compares the learned denoiser against the true denoiser from part 7 — the one that knows $x_0$. Here is the quiet resolution of part 7's cliffhanger: at <b>sampling</b> time we lack $x_0$, but at <b>training</b> time $x_0$ is the training image itself, sitting right there in the batch. So the target $q(x_{t-1} \\mid x_t, x_0)$ is fully computable during training. Better still, both distributions inside the KL are Gaussians — the true one by part 7's derivation, the learned one by our design — so part 5's closed-form Gaussian KL applies. No integrals, ever. The next section cashes this in.</li>
          <li><b>$L_0$ — the final decode, handled honestly.</b> Real images are stored as discrete brightness levels (integers 0 to 255), while our model produces continuous densities. The DDPM paper defines $p_\\theta(x_0 \\mid x_1)$ by integrating the final Gaussian's density over each pixel's brightness bin, so genuine probabilities come out — this is the "discretized decoder" of <a onclick="App.open('paper-ddpm')">the DDPM paper</a>, section 3.3. In practice the term is folded into the same squared-error form as the middle terms (it is the $t = 1$ case with the noise term switched off), and that is what every implementation does. We flag the subtlety once, honestly, and move on.</li>
        </ul>`
      },
      {
        h: "When both sides are Gaussian: hit the mean",
        body: `<p>Time to cash the check. Inside each $L_{t-1}$ sit two Gaussians. From part 7, the true denoiser: $q(x_{t-1} \\mid x_t, x_0) = \\mathcal{N}(\\tilde\\mu_t(x_t, x_0),\\ \\tilde\\beta_t)$, with a mean that is a weighted average of $x_t$ and $x_0$, and a spread $\\tilde\\beta_t$ fixed by the schedule. For the learned side we make a design choice, the same one DDPM makes: let the network output only the <b>mean</b>, and fix the spread to a schedule constant $\\sigma_t^2$: $p_\\theta(x_{t-1} \\mid x_t) = \\mathcal{N}(\\mu_\\theta(x_t, t),\\ \\sigma_t^2)$. DDPM tries $\\sigma_t^2 = \\beta_t$ and $\\sigma_t^2 = \\tilde\\beta_t$; both work about equally well, and nothing below depends on which you pick. Part 5 derived the KL between two 1-D Gaussians in closed form:</p>
        <div class="formula-box">$$D_{\\mathrm{KL}}\\big(\\mathcal{N}(\\mu_1, \\sigma_1^2)\\,\\|\\,\\mathcal{N}(\\mu_2, \\sigma_2^2)\\big) = \\log\\frac{\\sigma_2}{\\sigma_1} + \\frac{\\sigma_1^2 + (\\mu_1 - \\mu_2)^2}{2\\sigma_2^2} - \\frac{1}{2}$$</div>
        <p><b>Read it out loud:</b> the mismatch cost between two bell curves has three parts — a spread-ratio term, a term that grows with the first curve's spread and with the squared distance between the centers, and a constant one-half correction.</p>
        <p>Substitute our two Gaussians, one move at a time.</p>
        <ol>
          <li><b>Identify the players.</b> $\\mu_1 = \\tilde\\mu_t(x_t, x_0)$, $\\sigma_1^2 = \\tilde\\beta_t$ (the true denoiser); $\\mu_2 = \\mu_\\theta(x_t, t)$, $\\sigma_2^2 = \\sigma_t^2$ (the learned one). <b>Why:</b> KL is written "truth first, model second" — that is the order our $L_{t-1}$ demands.</li>
          <li><b>Substitute.</b> The KL becomes $\\log\\dfrac{\\sigma_t}{\\sqrt{\\tilde\\beta_t}} + \\dfrac{\\tilde\\beta_t + (\\tilde\\mu_t - \\mu_\\theta)^2}{2\\sigma_t^2} - \\dfrac{1}{2}$. <b>Why allowed:</b> plugging specific values into a proven identity.</li>
          <li><b>Split the middle fraction.</b> $\\dfrac{\\tilde\\beta_t + (\\tilde\\mu_t - \\mu_\\theta)^2}{2\\sigma_t^2} = \\dfrac{\\tilde\\beta_t}{2\\sigma_t^2} + \\dfrac{(\\tilde\\mu_t - \\mu_\\theta)^2}{2\\sigma_t^2}$. <b>Why allowed:</b> $(a + b)/c = a/c + b/c$.</li>
          <li><b>Hunt for $\\theta$.</b> Scan every piece: $\\log(\\sigma_t/\\sqrt{\\tilde\\beta_t})$ — schedule only; $\\tilde\\beta_t / 2\\sigma_t^2$ — schedule only; $-1/2$ — constant; $(\\tilde\\mu_t - \\mu_\\theta)^2/2\\sigma_t^2$ — contains $\\mu_\\theta$, which is the network. Exactly one piece is trainable. <b>Why this matters:</b> constants shift the loss but not where its minimum sits; the optimizer only feels the trainable piece.</li>
          <li><b>Go to $d$ dimensions.</b> Our Gaussians are isotropic — independent bells per coordinate (part 3) — so the KL of the whole vector is the sum of per-coordinate KLs, and summing $(\\tilde\\mu_{t,i} - \\mu_{\\theta,i})^2$ over coordinates $i$ gives the squared length $\\|\\tilde\\mu_t - \\mu_\\theta\\|^2$. <b>Why allowed:</b> for independent coordinates, log-ratios add, so KLs add.</li>
          <li><b>Reassemble $L_{t-1}$.</b> Put the surviving piece back under the expectation over $x_t$. <b>Why allowed:</b> we dropped only additive constants, which do not depend on $x_t$ or $\\theta$.</li>
        </ol>
        <div class="formula-box">$$L_{t-1} = \\frac{1}{2\\sigma_t^2}\\; \\mathbb{E}_{q}\\,\\big\\|\\tilde\\mu_t(x_t, x_0) - \\mu_\\theta(x_t, t)\\big\\|^2 \\;+\\; \\mathrm{const}$$</div>
        <p><b>Read it out loud:</b> the per-step training cost is, up to a constant, the average squared distance between the true posterior mean and the network's predicted mean, scaled by one over twice the fixed variance. Training the reverse chain means exactly this: teach the network's mean to hit the true posterior mean, at every timestep, for every noisy input it might face.</p>
        <p>A pleasing special case: choose $\\sigma_t^2 = \\tilde\\beta_t$, matched variances. Then step 2's expression is $\\log 1 + \\tilde\\beta_t/2\\tilde\\beta_t + \\Delta^2/2\\tilde\\beta_t - 1/2 = \\Delta^2 / 2\\tilde\\beta_t$ where $\\Delta$ is the distance between means — the constant is exactly zero. This is part 5's "when spreads match, KL is squared distance between centers", reappearing precisely where part 5 promised it would: on the road to a mean-squared-error loss.</p>
        <p>Keep the sign story straight, because it is where implementations go wrong: we <b>maximize</b> the log-likelihood, so we <b>maximize</b> the ELBO, so we <b>minimize</b> $-\\mathrm{ELBO} = L_T + \\sum_{t \\ge 2} L_{t-1} + L_0$. Every $L$ with a KL inside is $\\ge 0$ (part 5), so the loss is a sum of genuine mismatch costs: zero is perfection, bigger is worse. If your code ever reports an ELBO larger than the exact log-likelihood, a sign or a mismatched distribution is hiding somewhere — the math says it cannot happen.</p>`
      },
      {
        h: "A toy diffusion you can enumerate by hand",
        body: `<p>The whole derivation above works for any Markov chain, not only Gaussians — nothing used the bell curve until the last section. So let's build the smallest possible diffusion model, one where every probability is a number you can write down, and compute one $L_{t-1}$ term completely by hand. The notebook then rebuilds this toy in code and pushes further: it computes the exact log-likelihood, the full ELBO, and watches the gap close.</p>
        <p>The world has 3 states, labeled 0, 1, 2 — think of them as a "pixel" with three brightness levels. The forward "noising" kernel is the same at every step: a state <b>keeps</b> its value with probability 0.7 and hops to each of the other two states with probability 0.15 each. (Real DDPM uses a different dose $\\beta_t$ each step; a repeated kernel keeps our arithmetic readable and changes nothing in the logic.) Run it for $T = 3$ steps and the chain gradually forgets its start — a tiny discrete cousin of part 6's forward process.</p>
        <p><b>The task:</b> compute the inner KL of the $t = 2$ term, for a chain that started at $x_0 = 0$ and was observed at $x_2 = 2$, against a candidate reverse model that guesses uniformly: $p_\\theta(x_1 \\mid x_2 = 2) = (1/3, 1/3, 1/3)$. First we need the true posterior $q(x_1 \\mid x_2 = 2, x_0 = 0)$ — Bayes' rule by enumeration, exactly like part 2's tables:</p>
        <ol>
          <li><b>Forward reach:</b> $q(x_1 = j \\mid x_0 = 0) = (0.7,\\ 0.15,\\ 0.15)$ for $j = 0, 1, 2$. <b>Why:</b> one step of the kernel from state 0 — row 0 of the transition table.</li>
          <li><b>Backward look:</b> $q(x_2 = 2 \\mid x_1 = j) = (0.15,\\ 0.15,\\ 0.7)$. <b>Why:</b> the probability of hopping into state 2 from each possible $j$ — column 2 of the table.</li>
          <li><b>Multiply elementwise:</b> $(0.7 \\times 0.15,\\ 0.15 \\times 0.15,\\ 0.15 \\times 0.7) = (0.105,\\ 0.0225,\\ 0.105)$. <b>Why:</b> Bayes' numerator — each path's probability is reach times look.</li>
          <li><b>Normalize:</b> the three numbers sum to $0.2325$; dividing gives the posterior $(0.4516,\\ 0.0968,\\ 0.4516)$. <b>Why:</b> a conditional is the renormalized slice (part 2); probabilities must sum to 1.</li>
        </ol>
        <p>Pause and read the posterior: states 0 and 2 are equally likely midpoints (a direct path that hopped late, or an early hop that stayed), while the detour through state 1 is much less likely. Now the KL against the uniform guess, term by term, with natural logs:</p>
        <ol>
          <li><b>State 0:</b> $0.4516 \\times \\log(0.4516 / 0.3333) = 0.4516 \\times 0.3037 = 0.1371$. <b>Why:</b> KL is the average of $\\log(q/p)$, weighted by $q$ — this is the first summand.</li>
          <li><b>State 1:</b> $0.0968 \\times \\log(0.0968 / 0.3333) = 0.0968 \\times (-1.2368) = -0.1197$. <b>Why:</b> same recipe; the summand is negative because the posterior puts less mass here than the model does — individual summands may dip below zero even though the total cannot.</li>
          <li><b>State 2:</b> by the same arithmetic as state 0: $0.1371$.</li>
          <li><b>Total:</b> carrying five decimals, $0.13715 - 0.11969 + 0.13715 = 0.15461$, which rounds to $0.1546$ nats. (The 4-decimal summands above sum to $0.1545$ — the last digit needs the extra precision.) <b>Why:</b> KL is the sum of its summands.</li>
        </ol>
        <div class="formula-box">$$q(x_1 \\mid x_2 = 2,\\ x_0 = 0) = (0.4516,\\ 0.0968,\\ 0.4516), \\qquad D_{\\mathrm{KL}}\\big(q \\,\\|\\, \\mathrm{uniform}\\big) \\approx 0.1546 \\ \\mathrm{nats}$$</div>
        <p><b>Read it out loud:</b> for this one conditioning pair, the true denoiser is confident it came through state 0 or state 2; a reverse model that shrugs uniformly pays about 0.15 nats of mismatch at this single step. Training would push the model's row toward $(0.45, 0.10, 0.45)$, driving this cost toward zero. The full $L_1$ term would average such KLs over every possible $x_2$, weighted by how often each occurs — a finite sum here, which is exactly what the notebook computes.</p>`
      },
      {
        h: "Sanity checks",
        body: `<p><b>Check 1 — the bound points the right way.</b> The gap $\\log p_\\theta(x_0) - \\mathrm{ELBO}(x_0)$ is a KL, and part 5 proved every KL is $\\ge 0$. So the ELBO can never exceed the true log-likelihood, for any model, any data point, any schedule. The notebook verifies this on the 3-state toy where both sides are exactly computable — and it is a genuinely useful bug detector: an "ELBO" above the log-likelihood is always a coding error, never a discovery.</p>
        <p><b>Check 2 — the bound is tight when the model is right.</b> Set every $p_\\theta(x_{t-1} \\mid x_t)$ to the true reverse conditional of the forward chain, and the start to the chain's true end marginal. Then the model's posterior over paths equals the forward chain exactly, the gap-KL is zero, and $\\mathrm{ELBO} = \\log p_\\theta(x_0)$ on the nose. The notebook asserts this to ten decimal places. Nothing is lost by optimizing the bound: a perfect model scores a perfect bound.</p>
        <p><b>Check 3 — $L_T$ really is negligible.</b> Price the fixed-start choice for the real schedule. With $T = 1000$ and the linear schedule, $\\bar\\alpha_T \\approx 4 \\times 10^{-5}$ (part 6). For a coordinate with $x_0 = 2$: $q(x_T \\mid x_0) = \\mathcal{N}(\\sqrt{\\bar\\alpha_T} \\cdot 2,\\ 1 - \\bar\\alpha_T) = \\mathcal{N}(0.0126,\\ 0.99996)$. Plug into part 5's Gaussian KL against $\\mathcal{N}(0, 1)$: $\\log(1/0.99998) + (0.99996 + 0.00016)/2 - 1/2 \\approx 0.00002 + 0.50006 - 0.5 \\approx 8 \\times 10^{-5}$ nats. Dropping $L_T$ costs less than a ten-thousandth of a nat — the forward process really does deliver the model to the doorstep of pure noise.</p>
        <p><b>Check 4 — matched variances, clean special case.</b> With $\\sigma_t^2 = \\tilde\\beta_t$, the constant in the Gaussian KL collapses to exactly zero and $L_{t-1}$'s inner KL is exactly $\\|\\tilde\\mu_t - \\mu_\\theta\\|^2 / 2\\tilde\\beta_t$ — part 5's equal-variance special case, no leftovers. A quick limit read: as $\\tilde\\beta_t \\to 0$ (the low-noise timesteps, small $t$ — the final steps of generation), the same mean error costs more — precision matters most where the true denoiser is most certain.</p>
        <p><b>Check 5 — the decomposition collapses gracefully.</b> Set $T = 1$: the sum over $t \\ge 2$ is empty, and $-\\mathrm{ELBO} = L_T + L_0$ — a one-latent model scored by a start mismatch plus a decode term, which is exactly a VAE-shaped bound with a fixed encoder. The chain structure added the middle terms; removing the chain removes them, and nothing else breaks.</p>`
      },
      {
        h: "What you can do now",
        body: `<p>You can now do the thing that stumps most first readings of the DDPM paper: derive its training objective from scratch. Concretely, you can write the generative chain $p_\\theta(x_{0:T})$ and defend fixing $p(x_T)$ at pure noise with a number ($8 \\times 10^{-5}$ nats per coordinate); you can apply part 5's ELBO with the fixed forward chain as the helper and articulate how that differs from a VAE; you can run the full decomposition — logs of products into sums, the Bayes flip, the telescope, the $t = 1$ cancellation — and land on $-\\mathrm{ELBO} = L_T + \\sum_{t \\ge 2} L_{t-1} + L_0$; you can argue which terms carry $\\theta$; and you can reduce each middle term to "hit the true posterior mean", verified by hand on a 3-state toy where the KL came out to $0.1546$ nats.</p>
        <p>One target, one loose thread. The target: $\\mu_\\theta$ must hit $\\tilde\\mu_t(x_t, x_0)$ — computable during training because $x_0$ is the training image. The thread: part 7 gave $\\tilde\\mu_t$ as a clunky weighted average of $x_t$ and $x_0$, and asking a network to output that whole expression is asking it to re-learn schedule arithmetic we already know. Part 6's one-line sampler says $x_t = \\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\epsilon$ — so given $x_t$, knowing the noise $\\epsilon$ is the same as knowing $x_0$. Part 9 pulls that thread: substitute the noise for the clean point inside $\\tilde\\mu_t$, simplify line by line, and the mean-matching loss collapses into something almost embarrassingly simple — <b>predict the noise</b>. Out drops the one-line mean-squared-error objective that trains Stable Diffusion, plus the two little algorithms, training and sampling, that the rest of the course turns into working code.</p>`
      }
    ],
    symbols: [
      { sym: "$x_0$", desc: "the clean data point (image as a list of numbers) — the only frame the dataset actually contains" },
      { sym: "$x_t$", desc: "the data after $t$ small doses of noise" },
      { sym: "$x_{0:T}$", desc: "the whole path $x_0, x_1, \\dots, x_T$ taken together" },
      { sym: "$x_{1:T}$", desc: "the noisy frames only — the hidden (latent) part of the path" },
      { sym: "$T$", desc: "total number of noising steps (1000 in the real schedule, 2-3 in hand examples)" },
      { sym: "$\\beta_t$", desc: "how much fresh noise step $t$ adds (a small number like 0.0001-0.02)" },
      { sym: "$\\alpha_t = 1 - \\beta_t$", desc: "the fraction of variance kept at step $t$" },
      { sym: "$\\bar\\alpha_t$", desc: "the fraction of the original signal surviving to step $t$ (product of the $\\alpha$'s)" },
      { sym: "$q(x_t \\mid x_{t-1})$", desc: "the fixed noising recipe — one forward step" },
      { sym: "$q(x_t \\mid x_0)$", desc: "part 6's closed form: jump straight from clean to step $t$" },
      { sym: "$q(x_{1:T} \\mid x_0)$", desc: "the forward chain over the whole path — our fixed helper distribution" },
      { sym: "$q(x_{t-1} \\mid x_t, x_0)$", desc: "the true one-step denoiser from part 7 — exact IF you know $x_0$" },
      { sym: "$\\tilde\\mu_t(x_t, x_0)$", desc: "the true posterior's mean — a weighted average of $x_t$ and $x_0$" },
      { sym: "$\\tilde\\beta_t$", desc: "the true posterior's variance — fixed by the schedule" },
      { sym: "$p(x_T)$", desc: "the fixed start of the reverse chain: pure noise $\\mathcal{N}(0, \\mathbf{I})$" },
      { sym: "$p_\\theta(x_{t-1} \\mid x_t)$", desc: "the learned one-step denoiser" },
      { sym: "$p_\\theta(x_{0:T})$", desc: "the model's probability for a whole path: start times all denoising steps" },
      { sym: "$\\mu_\\theta(x_t, t)$", desc: "the network's predicted mean for the previous frame" },
      { sym: "$\\sigma_t^2$", desc: "the learned denoiser's variance, fixed by choice to $\\beta_t$ or $\\tilde\\beta_t$" },
      { sym: "$\\theta$", desc: "the network's knobs (parameters) — the only thing training changes" },
      { sym: "$D_{\\mathrm{KL}}(q \\,\\|\\, p)$", desc: "the mismatch cost from $q$ to $p$; never negative; zero only when equal" },
      { sym: "$\\mathbb{E}_{q}[\\cdot]$", desc: "the long-run average over noisy paths drawn from the forward chain" },
      { sym: "$L_T$", desc: "the start-mismatch cost — no $\\theta$ inside, so it is dropped" },
      { sym: "$L_{t-1}$", desc: "the step-$t$ training cost: true denoiser vs learned denoiser, as a KL" },
      { sym: "$L_0$", desc: "the final decode cost: how surprised the last step is by the clean data" },
      { sym: "$\\mathcal{N}(x;\\, \\mu, \\sigma^2)$", desc: "bell curve with center $\\mu$ and spread $\\sigma^2$" },
      { sym: "$\\mathbf{I}$", desc: "the identity matrix — shorthand for 'the same spread, independently, in every coordinate'" },
      { sym: "$\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$", desc: "fresh standard Gaussian noise, from part 3 — the $\\epsilon$ in part 6's one-line sampler" },
      { sym: "$q_t$", desc: "this part's shorthand for the closed-form marginal $q(x_t \\mid x_0)$ inside the telescope" },
      { sym: "$\\Delta$", desc: "the gap between the true and learned denoising means in the matched-variance KL" }
    ],
    recall: [
      "When we apply part 5's ELBO to diffusion, what plays the role of the latent variable?",
      "In a VAE the helper $q$ is a learned encoder. What is $q$ in diffusion, and how many learnable parameters does it have?",
      "Why are we allowed to fix $p(x_T) = \\mathcal{N}(0, \\mathbf{I})$ instead of learning it, and roughly what does that choice cost in nats?",
      "In $-\\mathrm{ELBO} = L_T + \\sum_{t &gt; 1} L_{t-1} + L_0$, which term contains no $\\theta$, and what do we do with it?",
      "What two distributions does $L_{t-1}$ compare, and which earlier part derived each of them?",
      "In the telescoping sum $\\sum_{t=2}^{T} \\log\\big(q(x_t \\mid x_0) / q(x_{t-1} \\mid x_0)\\big)$, which two factors survive the cancellation?",
      "Why does the derivation split the $t = 1$ term off before applying the Bayes flip?",
      "With both variances fixed at $\\sigma_t^2 = \\tilde\\beta_t$, what does the KL inside $L_{t-1}$ reduce to?"
    ],
    practice: [
      {
        q: "Write out the telescope sum $\\sum_{t=2}^{4} \\log\\dfrac{q(x_t \\mid x_0)}{q(x_{t-1} \\mid x_0)}$ for $T = 4$, term by term, and show it collapses to $\\log\\dfrac{q(x_4 \\mid x_0)}{q(x_1 \\mid x_0)}$. Use the shorthand $q_t$ for $\\log q(x_t \\mid x_0)$.",
        steps: [
          { do: "Substitute $t = 2, 3, 4$ to write the three terms: $\\log\\frac{q(x_2 \\mid x_0)}{q(x_1 \\mid x_0)} + \\log\\frac{q(x_3 \\mid x_0)}{q(x_2 \\mid x_0)} + \\log\\frac{q(x_4 \\mid x_0)}{q(x_3 \\mid x_0)}$", why: "a sum is evaluated by listing each value of its index" },
          { do: "Split each log of a quotient into a difference: $(q_2 - q_1) + (q_3 - q_2) + (q_4 - q_3)$", why: "the log rule $\\log(a/b) = \\log a - \\log b$, applied to each term" },
          { do: "Cancel the $+q_2$ from the first bracket against the $-q_2$ from the second, leaving $q_1$ subtracted, then $(q_3) + (q_4 - q_3)$ still to handle", why: "the same number with opposite signs sums to zero" },
          { do: "Cancel the $+q_3$ against the $-q_3$, leaving $-q_1 + q_4$", why: "the same cancellation move, one more time" },
          { do: "Collect the two survivors: $q_4 - q_1$", why: "every intermediate marginal appeared once with each sign; only the last top and the first bottom remain" },
          { do: "Recombine the difference into a single log: $\\log\\frac{q(x_4 \\mid x_0)}{q(x_1 \\mid x_0)}$", why: "the log rule run in reverse: $\\log a - \\log b = \\log(a/b)$" }
        ],
        answer: "The sum collapses to $\\log\\big(q(x_4 \\mid x_0) / q(x_1 \\mid x_0)\\big)$: the marginals at $t = 2$ and $t = 3$ cancel completely, and only the last and first survive."
      },
      {
        q: "For $T = 4$, the decomposition reads $-\\mathrm{ELBO} = L_T + L_3 + L_2 + L_1 + L_0$. Which terms depend on the network parameters $\\theta$, which do not, and what does that mean for training?",
        steps: [
          { do: "Inspect $L_T = D_{\\mathrm{KL}}(q(x_4 \\mid x_0) \\,\\|\\, p(x_4))$: it contains the fixed forward marginal and the fixed noise start — no $\\theta$ anywhere", why: "a term can only depend on $\\theta$ if $p_\\theta$ appears inside it" },
          { do: "Inspect $L_3, L_2, L_1$: each is $\\mathbb{E}\\, D_{\\mathrm{KL}}(q(x_{t-1} \\mid x_t, x_0) \\,\\|\\, p_\\theta(x_{t-1} \\mid x_t))$ for $t = 4, 3, 2$, and each contains $p_\\theta$ — so all three depend on $\\theta$", why: "the second argument of each KL is the learned denoiser" },
          { do: "Inspect $L_0 = -\\mathbb{E} \\log p_\\theta(x_0 \\mid x_1)$: it contains $p_\\theta$, so it depends on $\\theta$", why: "the decode step is part of the learned reverse chain" },
          { do: "Conclude: drop $L_T$ from the training loss; keep $L_3 + L_2 + L_1 + L_0$", why: "adding a constant to a loss moves every value equally, so it changes nothing about where the minimum sits or which way gradients point" }
        ],
        answer: "All terms except $L_T$ depend on $\\theta$. $L_T$ is a schedule constant, so training minimizes $L_3 + L_2 + L_1 + L_0$ and ignores $L_T$."
      },
      {
        q: "The true posterior at some step is $\\mathcal{N}(1.2,\\ 0.09)$ and the learned denoiser predicts $\\mathcal{N}(1.5,\\ 0.09)$ — same variance. Compute $D_{\\mathrm{KL}}$ from the first to the second, in nats.",
        steps: [
          { do: "Recall the matched-variance special case: when both spreads equal $\\sigma^2$, the KL is $\\dfrac{(\\mu_1 - \\mu_2)^2}{2\\sigma^2}$", why: "derived in part 5 and re-derived in this part: the spread-ratio and constant terms cancel exactly when $\\sigma_1 = \\sigma_2$" },
          { do: "Compute the center gap: $\\mu_1 - \\mu_2 = 1.2 - 1.5 = -0.3$", why: "identify the pieces before squaring" },
          { do: "Square it: $(-0.3)^2 = 0.09$", why: "the formula uses the squared distance, so the sign of the gap does not matter" },
          { do: "Compute the denominator: $2\\sigma^2 = 2 \\times 0.09 = 0.18$", why: "plug the shared variance into $2\\sigma^2$" },
          { do: "Divide: $0.09 / 0.18 = 0.5$", why: "final substitution into the formula" }
        ],
        answer: "$D_{\\mathrm{KL}} = 0.5$ nats. A center miss of 0.3 with spread 0.09 is a substantial mismatch — more than three thousand times the entire $L_T$ term of the real schedule."
      },
      {
        q: "For one data point, the exact log-likelihood is $\\log p_\\theta(x_0) = -3.2$ and the gap KL is $0.7$. What is the ELBO? A colleague's code then reports $\\mathrm{ELBO} = -2.9$ for a point with $\\log p_\\theta(x_0) = -3.2$. What do you tell them?",
        steps: [
          { do: "Write the gap identity: $\\log p_\\theta(x_0) = \\mathrm{ELBO} + \\mathrm{gap}$, so $\\mathrm{ELBO} = \\log p_\\theta(x_0) - \\mathrm{gap}$", why: "rearranging part 5's exact identity by subtracting the gap from both sides" },
          { do: "Substitute: $\\mathrm{ELBO} = -3.2 - 0.7 = -3.9$", why: "plug in the two given numbers" },
          { do: "For the colleague: note the gap is a KL, so $\\mathrm{gap} \\ge 0$ always, which forces $\\mathrm{ELBO} \\le \\log p_\\theta(x_0)$", why: "part 5 proved KL $\\ge 0$ via Jensen's inequality — with no exceptions" },
          { do: "Compare: $-2.9 &gt; -3.2$, so the reported ELBO exceeds the log-likelihood, which the math forbids", why: "on the number line, $-2.9$ sits to the right of $-3.2$" },
          { do: "Diagnose: the code has a bug — most likely a sign flip on the loss, or the KL computed with its two arguments swapped or mismatched", why: "an impossible number cannot be a discovery; the bound direction is a theorem" }
        ],
        answer: "$\\mathrm{ELBO} = -3.9$. The colleague's $-2.9$ is impossible, because the ELBO can never exceed the log-likelihood; they should hunt for a sign error or swapped KL arguments."
      },
      {
        q: "Complete the comparison table between a VAE's ELBO and diffusion's ELBO, row by row: (a) what is the latent variable, (b) is the helper $q$ learned or fixed, (c) what does the generator look like, (d) when is the bound tight and how does each model get there?",
        steps: [
          { do: "Row (a): VAE — a single compressed code $z$, usually much smaller than the data; diffusion — the entire noisy path $x_{1:T}$, which is $T$ full-size frames", why: "the ELBO template needs a hidden variable; diffusion promotes every intermediate noisy frame into the latent" },
          { do: "Row (b): VAE — $q$ is a learned encoder network with its own parameters; diffusion — $q$ is the fixed forward noising chain, with zero parameters", why: "this is the defining design difference: diffusion spends no capacity on inference and hard-codes the corruption recipe" },
          { do: "Row (c): VAE — one decoder $p_\\theta(x \\mid z)$ that generates in a single step; diffusion — a chain of $T$ small Gaussian denoising steps sharing one network", why: "diffusion trades one hard generative leap for many easy ones — the core bet of the whole approach" },
          { do: "Row (d): the bound is tight exactly when the helper equals the model's true posterior over the latent (part 5's gap identity); a VAE trains $q$ toward that posterior, while diffusion cannot move $q$, so training moves $p_\\theta$ until its posterior matches the fixed forward chain", why: "the gap is $D_{\\mathrm{KL}}(q \\,\\|\\, \\text{model posterior})$ — you can shrink it from either side, and the two designs pick opposite sides" }
        ],
        answer: "Latent: code $z$ vs whole path $x_{1:T}$. Helper: learned encoder vs fixed noising chain. Generator: one-step decoder vs $T$-step Gaussian chain. Tightness: both need helper = model posterior; the VAE moves the helper, diffusion moves the model."
      },
      {
        q: "Using the 3-state toy (keep probability 0.7, hop probability 0.15 to each other state), compute the inner KL of a middle term for $x_0 = 0$ and $x_2 = 0$, against the candidate $p_\\theta(x_1 \\mid x_2 = 0) = (0.6,\\ 0.2,\\ 0.2)$.",
        steps: [
          { do: "Forward reach: $q(x_1 = j \\mid x_0 = 0) = (0.7,\\ 0.15,\\ 0.15)$", why: "one kernel step from state 0 — row 0 of the transition table" },
          { do: "Backward look: $q(x_2 = 0 \\mid x_1 = j) = (0.7,\\ 0.15,\\ 0.15)$", why: "the probability of landing in state 0 from each possible midpoint $j$ — column 0 of the table" },
          { do: "Multiply elementwise: $(0.49,\\ 0.0225,\\ 0.0225)$", why: "Bayes' numerator: reach times look, per midpoint" },
          { do: "Sum the three numbers: $0.49 + 0.0225 + 0.0225 = 0.535$", why: "the normalizer — the total probability of being at $x_2 = 0$ given $x_0 = 0$, through any midpoint" },
          { do: "Divide: posterior $q(x_1 \\mid x_2 = 0, x_0 = 0) = (0.9159,\\ 0.0421,\\ 0.0421)$", why: "a conditional is the renormalized slice; the chain almost surely stayed home both steps" },
          { do: "KL term for state 0: $0.9159 \\times \\log(0.9159 / 0.6) = 0.9159 \\times 0.4230 = 0.3874$", why: "KL sums $q \\log(q/p)$ over states — first summand" },
          { do: "KL terms for states 1 and 2 (identical): $0.0421 \\times \\log(0.0421 / 0.2) = 0.0421 \\times (-1.5593) = -0.0656$ each", why: "same recipe; negative summands are fine — only the total must be nonnegative" },
          { do: "Total: $0.3874 - 0.0656 - 0.0656 = 0.2562$ nats", why: "KL is the sum of its summands" }
        ],
        answer: "The posterior is $(0.9159,\\ 0.0421,\\ 0.0421)$ and the KL is about $0.2562$ nats. The true denoiser is very confident the chain stayed at 0, so the hedging candidate pays a sizable mismatch cost."
      }
    ]
  });
})();
