/* Rigorous Courses · Diffusion Models — Part 4: Chains of randomness.
   Owns the chain rule of probability, the Markov property and factorized joint, transition
   kernels, stationary distributions, the Gaussian chain on the number line (N(0,1) is where
   it settles), and reversing a chain with Bayes' rule. */
(function () {
  window.LESSONS.push({
    id: "diff-04-markov-chains",
    title: "Part 4 — Chains of randomness",
    tagline: "Randomness that unfolds in steps — and why every start ends in the same noise",
    module: "Rigorous Courses · Diffusion Models",
    superGroup: "Rigorous Courses",
    template: "course",
    part: 4,
    partTotal: 12,
    prereqs: ["diff-03-gaussian"],
    goal: `<p>After this part you can:</p>
      <ul>
        <li>Break any joint distribution into a step-by-step story with the <b>chain rule</b>, and state exactly which factors the <b>Markov property</b> lets you shrink.</li>
        <li>Compute multi-step transition probabilities for a small chain by enumerating paths — multiply along each path, add over paths.</li>
        <li>Verify that a distribution is <b>stationary</b> for a chain, and prove with two Gaussian rules that $\\mathcal{N}(0,1)$ is stationary for the noising step $x_t = \\sqrt{1-\\beta}\\,x_{t-1} + \\sqrt{\\beta}\\,\\epsilon_t$.</li>
        <li>Flip a chain's direction with Bayes' rule, and explain why the flip needs more than the transition table.</li>
        <li>Say precisely, with numbers, why the noising chain forgets its starting point.</li>
      </ul>`,
    sections: [
      {
        h: "Where we are",
        body: `<p>Three parts in, here is what you own. Part 1: generating data means <b>sampling</b> a new point from the data cloud's rule — a rule we are never handed, only shown examples of. Part 2: the language for such rules is probability — joint, marginal, and conditional distributions, Bayes' rule for flipping a conditional, expectation as the long-run average, and variance as the typical spread. One fact from part 2 to keep warm: for <b>independent</b> random quantities, variances add. Part 3: the Gaussian — you can shift it, scale it (variance picks up the square of the scale factor), add two independent ones (means add, variances add, and the result is again Gaussian), and multiply two Gaussian densities by completing the square.</p>
        <p>Now look at what diffusion actually does to an image: it destroys it over $T$ small steps, each step adding one more dose of noise to the output of the step before. That is a random process unfolding in time — day after day, step after step. This part builds the mathematics of step-by-step randomness: <b>Markov chains</b>. You will learn to write down the probability of a whole random path, meet the one assumption that makes long chains manageable, watch a chain settle into a distribution it can never leave, and — the move the entire course turns on — run a chain <b>backwards</b> using Bayes' rule. By the end you will see the first honest glimpse of why forward diffusion always ends in pure noise, and exactly what makes the reverse direction hard.</p>`
      },
      {
        h: "The chain rule: telling a random story one step at a time",
        body: `<p>Recall from part 2: a <b>joint distribution</b> assigns a probability to each full combination of several random quantities, and a <b>conditional</b> is a renormalized slice of it: $p(b \\mid a) = p(a, b)/p(a)$, read "the probability of $b$ once you know $a$ happened." One rearrangement of that definition is the backbone of every model that unfolds in time. Let's derive it for three quantities $a$, $b$, $c$ — think of the weather on three consecutive days.</p>
        <ol>
          <li><b>Peel off $c$.</b> The definition of the conditional says $p(c \\mid a, b) = p(a, b, c)/p(a, b)$, valid whenever $p(a, b) \\gt 0$. Multiply both sides by $p(a, b)$, giving $p(a, b, c) = p(a, b)\\, p(c \\mid a, b)$. <b>Why allowed:</b> multiplying both sides of a true equation by the same number keeps it true.</li>
          <li><b>Peel off $b$.</b> Apply the same definition one variable earlier: $p(b \\mid a) = p(a, b)/p(a)$, so $p(a, b) = p(a)\\, p(b \\mid a)$. <b>Why:</b> it is the identical move, applied to the two-variable joint.</li>
          <li><b>Substitute.</b> Replace $p(a, b)$ in step 1 by the product from step 2. <b>Why:</b> equals may replace equals.</li>
        </ol>
        <div class="formula-box">$$p(a, b, c) \\;=\\; p(a)\\; p(b \\mid a)\\; p(c \\mid a, b)$$</div>
        <p><b>Read it out loud:</b> the chance of the whole three-day story equals the chance of day one, times the chance of day two given how day one went, times the chance of day three given how the first two days went.</p>
        <p>Two things deserve a pause. First, this <b>chain rule of probability</b> is an <b>identity</b>, not an assumption — we used nothing but the definition of a conditional, so it holds for any three quantities, dependent or not, and extends to any number of them: keep peeling one variable at a time. Second, you may peel in any order you like. Peeling $a$ first and $c$ last gives $p(a, b, c) = p(c)\\, p(b \\mid c)\\, p(a \\mid b, c)$ — the same joint, told <b>backwards</b>. Keep that in your pocket. A diffusion model is one joint distribution over a noising path, told in two directions: forwards to destroy, backwards to create.</p>`
      },
      {
        h: "The Markov property: tomorrow only cares about today",
        body: `<p>The chain rule is exact, but its last factor is a problem in the making. In a $T$-step process, the final factor conditions on the <b>entire history</b> — for the real diffusion setup with $T = 1000$ steps, that is a conditional on 999 earlier states. A rule that needs the whole history is astronomically expensive to write down, store, or learn. One assumption tames it.</p>
        <p>A process has the <b>Markov property</b> when, once you know the current state, the earlier history adds nothing to your prediction of the next state. In weather terms: if you know today is rainy, then learning last Tuesday was sunny does not change your forecast for tomorrow. In symbols, for our noising process (recall the notation: $x_0$ is the clean data point, $x_t$ is the data after $t$ doses of noise):</p>
        <div class="formula-box">$$q(x_t \\mid x_{t-1}, x_{t-2}, \\ldots, x_0) \\;=\\; q(x_t \\mid x_{t-1})$$</div>
        <p><b>Read it out loud:</b> the distribution of the next state, given the whole history, is the same as its distribution given only the current state. Everything before the present is forecast-irrelevant.</p>
        <p>Now feed this into the chain rule. Two moves, one operation each:</p>
        <ol>
          <li><b>Chain rule, conditioned on the start.</b> Holding $x_0$ fixed throughout and peeling $x_T$ first, then $x_{T-1}$, and so on: $q(x_1, \\ldots, x_T \\mid x_0) = \\prod_{t=1}^{T} q(x_t \\mid x_{t-1}, \\ldots, x_0)$. <b>Why allowed:</b> the chain rule is an identity; conditioning every factor on $x_0$ is the same derivation run inside the world where $x_0$ is known.</li>
          <li><b>Collapse each factor.</b> The Markov property replaces each history-conditional by a one-step conditional. <b>Why:</b> that is exactly what the property asserts, applied at every $t$.</li>
        </ol>
        <p>Two notation pieces before the result. The shorthand $x_{1:T}$ means the whole path $x_1, x_2, \\ldots, x_T$ as one object. And the tall $\\prod$ (capital pi) is the product sign: multiply together one factor for each $t$ from 1 to $T$, the way the tall $\\Sigma$ from part 2 adds terms.</p>
        <div class="formula-box">$$q(x_{1:T} \\mid x_0) \\;=\\; \\prod_{t=1}^{T} q(x_t \\mid x_{t-1})$$</div>
        <p><b>Read it out loud:</b> the probability of the entire noising path, given the clean starting point, is the product of the one-step probabilities — the first step's chance, times the second step's chance, and so on through step $T$.</p>
        <p>Why this matters — count what it saves. A 2-state weather process over 10 days needs, in general, a table of $2^{10} = 1024$ path probabilities. If the process is Markov, ten small 2-by-2 tables (40 numbers) describe it completely, and if the rule is the same every day, one table of 4 numbers does. The Markov property turns an exponential object into a stack of small, identical-shaped pieces.</p>
        <p>One honest caveat: for weather, Markov-ness is an approximation that a meteorologist could dispute. For diffusion there is no dispute — <b>we</b> design the noising process, so we build it Markov on purpose. The factorized joint above is definitional for the forward process you will meet in part 6.</p>`
      },
      {
        h: "Transition kernels: the weather chain",
        body: `<p>If one step fully determines the next state's distribution, all you need to specify a chain is the rule for one step. That rule is called the <b>transition kernel</b>: for each possible current state, it hands you the distribution of the next state. For a chain with finitely many states, the kernel is a table. Here is the running example for this part — a 2-state weather chain:</p>
        <table class="symbols">
          <tr><td></td><td><b>tomorrow: sunny</b></td><td><b>tomorrow: rainy</b></td></tr>
          <tr><td><b>today: sunny</b></td><td>0.8</td><td>0.2</td></tr>
          <tr><td><b>today: rainy</b></td><td>0.4</td><td>0.6</td></tr>
        </table>
        <p>Each row is a conditional distribution — "given today, here is tomorrow" — so each row must sum to 1, and indeed $0.8 + 0.2 = 1$ and $0.4 + 0.6 = 1$. Sunny weather tends to persist; rain does too, a little less stubbornly.</p>
        <p>Now a question the table does not answer directly: starting sunny, what is the chance of sun <b>two</b> days from now? Tomorrow is not mentioned in the question, but the chain must pass through it, so we enumerate the ways:</p>
        <ol>
          <li><b>Route through a sunny tomorrow.</b> Stay sunny, then stay sunny again: $0.8 \\cdot 0.8 = 0.64$. <b>Why multiply:</b> by the chain rule plus the Markov property, a path's probability is the product of its one-step probabilities.</li>
          <li><b>Route through a rainy tomorrow.</b> Dip into rain, then recover: $0.2 \\cdot 0.4 = 0.08$. <b>Why:</b> same rule, other route.</li>
          <li><b>Add the routes.</b> $0.64 + 0.08 = 0.72$. <b>Why add:</b> the two routes are mutually exclusive ways for the event to happen, and part 2 established that probabilities of disjoint events add.</li>
        </ol>
        <div class="formula-box">$$P(\\text{sunny in two days} \\mid \\text{sunny today}) \\;=\\; 0.8 \\cdot 0.8 \\;+\\; 0.2 \\cdot 0.4 \\;=\\; 0.72$$</div>
        <p><b>Read it out loud:</b> to be sunny two days out, either stay sunny through both days or dip into rain and recover — multiply the steps along each route, then add the two routes.</p>
        <p>Sanity check inside the example: the same recipe gives $P(\\text{rainy in two days} \\mid \\text{sunny today}) = 0.8 \\cdot 0.2 + 0.2 \\cdot 0.6 = 0.16 + 0.12 = 0.28$, and $0.72 + 0.28 = 1$. The two-step rule is again a proper distribution.</p>
        <p>This "multiply along a path, add over paths" recipe has a famous name: it is exactly <b>matrix multiplication</b> of the table with itself. You do not need any linear-algebra background here — the recipe above is the whole content, and the notebook checks that numpy's <code>@</code> operator produces precisely the enumeration you did by hand. Squaring the table gives the two-step table; multiplying again gives three steps, and so on.</p>
        <p>Last definition of the section. A chain whose kernel is the same at every step — like our weather table — is <b>time-homogeneous</b>. A chain whose kernel changes with the step number is <b>time-inhomogeneous</b>. Diffusion's forward process is the second kind: the noise dose $\\beta_t$ follows a schedule, growing from $\\beta_1 = 0.0001$ to $\\beta_T = 0.02$ across $T = 1000$ steps in the standard linear schedule (part 6 owns those numbers). Everything in this part works for both kinds; where the difference matters, I will flag it.</p>`
      },
      {
        h: "Where chains settle: stationary distributions",
        body: `<p>Run the weather chain for a year and tally the sunny days. You will find a stable ratio, and it does not depend on whether January 1st was sunny or rainy. The chain has a preferred long-run balance. Here is the concept that captures it.</p>
        <p>A distribution $\\pi$ over the states is <b>stationary</b> for a chain when it reproduces itself under one step: if today's state is drawn from $\\pi$, then tomorrow's state — random though the step is — is again distributed as $\\pi$. The chain leaves $\\pi$ untouched. In symbols, writing $\\pi(s)$ for the probability the distribution assigns to state $s$ (and recalling that the tall $\\Sigma$ adds one term per state):</p>
        <div class="formula-box">$$\\pi(s') \\;=\\; \\sum_{s} \\pi(s)\\, q(s' \\mid s) \\qquad \\text{for every state } s'$$</div>
        <p><b>Read it out loud:</b> for each state, tomorrow's chance of being there — accumulated over every possible today, each weighted by its $\\pi$-chance — equals the chance $\\pi$ already assigns to that state. Nothing shifts.</p>
        <p>Claim: for the weather chain, $\\pi = (\\tfrac{2}{3}, \\tfrac{1}{3})$ — two-thirds sunny, one-third rainy. Verify by direct substitution, one operation per step:</p>
        <ol>
          <li><b>Tomorrow-sunny mass.</b> $\\tfrac{2}{3} \\cdot 0.8 + \\tfrac{1}{3} \\cdot 0.4$. <b>Why:</b> the stationarity sum with our two states, target state sunny.</li>
          <li><b>Convert and add.</b> $\\tfrac{2}{3} \\cdot \\tfrac{4}{5} = \\tfrac{8}{15}$ and $\\tfrac{1}{3} \\cdot \\tfrac{2}{5} = \\tfrac{2}{15}$, so the sum is $\\tfrac{10}{15} = \\tfrac{2}{3}$. <b>Why:</b> arithmetic with fractions; the result matches $\\pi(\\text{sunny})$.</li>
          <li><b>Tomorrow-rainy mass.</b> $\\tfrac{2}{3} \\cdot 0.2 + \\tfrac{1}{3} \\cdot 0.6 = \\tfrac{2}{15} + \\tfrac{3}{15} = \\tfrac{5}{15} = \\tfrac{1}{3}$. <b>Why:</b> same substitution, target state rainy; matches $\\pi(\\text{rainy})$.</li>
        </ol>
        <p>Both components reproduce themselves, so $(\\tfrac{2}{3}, \\tfrac{1}{3})$ is stationary. Where did those numbers come from? Solve for them. Call the unknown stationary chance of sunny $p$; then rainy has chance $1 - p$, and stationarity for the sunny state demands $p = 0.8\\,p + 0.4\\,(1-p)$. Expand the right side: $0.8\\,p + 0.4 - 0.4\\,p = 0.4\\,p + 0.4$. Subtract $0.4\\,p$ from both sides: $0.6\\,p = 0.4$. Divide by $0.6$: $p = \\tfrac{2}{3}$. One equation, one unknown, done.</p>
        <p>Two more facts, stated informally because this part only needs the idea. First, this chain does not merely tolerate $\\pi$ — it is <b>pulled toward</b> it: start it sunny, start it rainy, start it from any mix, and the day-$t$ distribution slides toward $(\\tfrac{2}{3}, \\tfrac{1}{3})$, fast. The notebook shows both starting points landing on the same distribution to six decimal places within 20 steps. The general theory of when and how fast chains settle (the keyword is "mixing") is genuinely beyond our scope — but every chain we build in this course is designed to settle, and you will verify each one numerically. Second, the punchline you can now anticipate: diffusion's forward chain is engineered so that its settling distribution is <b>pure noise</b>. The next section shows the cleanest version of that engineering.</p>`
      },
      {
        h: "A Markov chain on the number line",
        body: `<p>States do not have to be "sunny" and "rainy". Let the state be a real number — one coordinate of a data point — and let the kernel be a recipe rather than a table: from the current value, shrink it a little, then add a small dose of fresh Gaussian noise. With a fixed <b>noise dose</b> $\\beta$ (a small number between 0 and 1) and fresh noise $\\epsilon_t \\sim \\mathcal{N}(0, 1)$ drawn independently at each step, the update is:</p>
        <div class="formula-box">$$x_t \\;=\\; \\sqrt{1-\\beta}\\; x_{t-1} \\;+\\; \\sqrt{\\beta}\\; \\epsilon_t, \\qquad \\epsilon_t \\sim \\mathcal{N}(0, 1)$$</div>
        <p><b>Read it out loud:</b> the next value is the current value shrunk by the factor root-one-minus-beta, plus a fresh standard-Gaussian draw scaled by root-beta.</p>
        <p>This is a Markov chain: the next state's distribution depends only on the current value $x_{t-1}$. Its transition kernel, written as a distribution — recall $\\mathcal{N}(x;\\, \\mu, \\sigma^2)$ from <a onclick="App.open('diff-03-gaussian')">part 3's Gaussian</a>, the bell curve with center $\\mu$ and spread $\\sigma^2$:</p>
        <div class="formula-box">$$q(x_t \\mid x_{t-1}) \\;=\\; \\mathcal{N}\\big(x_t;\\; \\sqrt{1-\\beta}\\, x_{t-1},\\; \\beta\\big)$$</div>
        <p><b>Read it out loud:</b> given the current value, the next value is Gaussian, centered at the shrunk current value, with spread beta.</p>
        <p>Real numbers make it concrete. Take $\\beta = 0.3$, so $\\sqrt{1-\\beta} = \\sqrt{0.7} \\approx 0.8367$ and $\\sqrt{\\beta} \\approx 0.5477$. If the current value is $x_{t-1} = 2$, the next value is drawn from $\\mathcal{N}(1.6733,\\, 0.3)$: centered at the shrunk value $0.8367 \\times 2 \\approx 1.6733$, typical wobble $\\sqrt{0.3} \\approx 0.55$ either way.</p>
        <p>Now the punchline of this part. The odd-looking pair $\\sqrt{1-\\beta}$ and $\\sqrt{\\beta}$ is not decoration — it is calibrated so that the standard Gaussian is <b>stationary</b> for this chain. Claim: if $x_{t-1} \\sim \\mathcal{N}(0,1)$, then $x_t \\sim \\mathcal{N}(0,1)$ too. The proof needs exactly the two rules you built in part 3, one operation per step:</p>
        <ol>
          <li><b>Scale the current state.</b> Recall part 3's scaling rule: multiplying a Gaussian variable by a constant $a$ multiplies its mean by $a$ and its variance by $a^2$. With $a = \\sqrt{1-\\beta}$: the term $\\sqrt{1-\\beta}\\, x_{t-1}$ is Gaussian with mean $\\sqrt{1-\\beta} \\cdot 0 = 0$ and variance $(\\sqrt{1-\\beta})^2 \\cdot 1$. <b>Why allowed:</b> $x_{t-1}$ is Gaussian by assumption, and the scaling rule applies to any Gaussian.</li>
          <li><b>Square the square root.</b> $(\\sqrt{1-\\beta})^2 = 1-\\beta$, so the term is $\\mathcal{N}(0,\\, 1-\\beta)$. <b>Why:</b> squaring undoes the square root, and $1-\\beta \\ge 0$ since $\\beta \\le 1$.</li>
          <li><b>Scale the fresh noise.</b> The same rule with $a = \\sqrt{\\beta}$ gives $\\sqrt{\\beta}\\, \\epsilon_t \\sim \\mathcal{N}(0,\\, \\beta)$. <b>Why:</b> $\\epsilon_t$ is standard Gaussian by construction.</li>
          <li><b>Add the two pieces.</b> $x_{t-1}$ and $\\epsilon_t$ are independent — the fresh noise is drawn without looking at the state — so their scaled versions are independent too, and part 3's sum rule applies: the sum of independent Gaussians is Gaussian, means add, variances add. Mean: $0 + 0 = 0$. <b>Why allowed:</b> independence is exactly the hypothesis the sum rule needs.</li>
          <li><b>Add the variances.</b> $(1-\\beta) + \\beta = 1$: the $\\beta$ cancels. <b>Why:</b> arithmetic — and this cancellation is the entire design.</li>
        </ol>
        <div class="formula-box">$$\\text{if } x_{t-1} \\sim \\mathcal{N}(0,1)\\text{, then } x_t \\sim \\mathcal{N}\\big(0,\\; \\underbrace{(1-\\beta) \\cdot 1 + \\beta}_{=\\,1}\\big) = \\mathcal{N}(0,1)$$</div>
        <p><b>Read it out loud:</b> if the current state is standard Gaussian, the next state is Gaussian with mean zero and variance one-minus-beta plus beta — which is one. The standard Gaussian goes in, and the standard Gaussian comes out.</p>
        <p>So $\\mathcal{N}(0,1)$ is where this chain settles: once the state's distribution reaches the standard bell, no number of further steps changes it. And the chain is pulled there from anywhere. Watch the memory of the start decay. Suppose $x_0 = 4$ exactly, with $\\beta = 0.3$. Each step multiplies the mean by $\\sqrt{0.7} \\approx 0.8367$ (the noise adds nothing to the mean, since $\\mathbb{E}[\\epsilon_t] = 0$ and expectation is linear — part 2). After 10 steps the mean is $4 \\times 0.7^{5} \\approx 4 \\times 0.168 = 0.672$; after 30 steps, $4 \\times 0.7^{15} \\approx 0.019$. Meanwhile the variance obeys $v_t = (1-\\beta)\\, v_{t-1} + \\beta$, climbing from 0 toward its fixed point 1 (after 10 steps: $1 - 0.7^{10} \\approx 0.972$). The starting value is squashed geometrically while the noise budget refills to keep the total spread at 1: every start flows to the same $\\mathcal{N}(0,1)$. This is the first glimpse of why forward diffusion ends in pure noise — the fact that makes generation-from-noise possible at all.</p>
        <p>Two connections to the real thing. First, for an image, this chain runs <b>per coordinate</b>: every pixel-number gets its own independent copy of the update, which is exactly part 3's isotropic Gaussian picture — a bell in every coordinate. Second, real diffusion lets the dose vary with the step, $\\beta_t$ instead of a fixed $\\beta$ — a time-inhomogeneous version of this exact chain. Part 6 takes that step and derives what $t$ doses do to a real data point.</p>`
      },
      {
        h: "Running a chain backwards",
        body: `<p>Everything so far runs forward: today to tomorrow, clean to noisy. But generation must travel the other way — from noise back to data. So the question this whole course hinges on: given <b>today's</b> state, what can we say about <b>yesterday's</b>? Does "yesterday given today" even make sense as a probability? It does, and part 2 already gave you the tool: <a onclick="App.open('prob-bayes')">Bayes' rule</a> — recall, the rule that flips a conditional by reweighting with the prior and dividing by the evidence. For a chain, writing $p(x_{t-1})$ for the distribution of the state at step $t-1$:</p>
        <div class="formula-box">$$p(x_{t-1} \\mid x_t) \\;=\\; \\frac{q(x_t \\mid x_{t-1})\\; p(x_{t-1})}{p(x_t)}$$</div>
        <p><b>Read it out loud:</b> the chance that yesterday was such-and-such, given today, equals the forward chance of today from that yesterday, times how likely that yesterday was in the first place, divided by the total chance of today.</p>
        <p>Let's compute one, with real numbers, on the weather chain. Setup: the historical record says yesterday was sunny with probability 0.9 (that is our prior $p(\\text{yesterday} = \\text{S}) = 0.9$, rainy 0.1). Today you wake up to rain. What is the chance yesterday was sunny? One operation per step:</p>
        <ol>
          <li><b>Joint of "sunny then rain".</b> $0.9 \\times 0.2 = 0.18$. <b>Why:</b> the chain rule — prior probability of the yesterday-state, times the forward transition probability from the table ($\\text{S} \\to \\text{R}$ is 0.2).</li>
          <li><b>Joint of "rainy then rain".</b> $0.1 \\times 0.6 = 0.06$. <b>Why:</b> same rule on the other yesterday ($\\text{R} \\to \\text{R}$ is 0.6).</li>
          <li><b>Total chance of today's rain.</b> $0.18 + 0.06 = 0.24$. <b>Why:</b> the two yesterdays are disjoint, and a marginal is the sum of the joint over the options — part 2.</li>
          <li><b>Divide.</b> $p(\\text{yesterday} = \\text{S} \\mid \\text{today} = \\text{R}) = 0.18 / 0.24 = 0.75$. <b>Why:</b> Bayes' rule — the conditional is the matching joint mass divided by the total mass of what was observed.</li>
        </ol>
        <p>So despite rain being unusual after sunshine, a rainy today still points to a sunny yesterday with chance 0.75 — sunny yesterdays are so common under this prior that they account for three-quarters of all rainy todays. And the complement checks out: $0.06/0.24 = 0.25$, and $0.75 + 0.25 = 1$.</p>
        <p>Now the observation that sets up the rest of the course. Rerun the computation with an even-odds prior, $p(\\text{yesterday} = \\text{S}) = 0.5$, and the answer changes to $0.25$ (practice problem 5 walks it through). Same chain, same transition table, different reverse conditional. <b>The forward table alone does not determine the reverse step.</b> The flip needs $p(x_{t-1})$ — the marginal distribution of where the chain was — and that is an extra ingredient the kernel does not carry.</p>
        <p>Translate this to diffusion and you have the central obstacle. The forward noising kernel $q(x_t \\mid x_{t-1})$ is fixed and fully known — we designed it. But its Bayes flip needs the marginal distribution of $x_{t-1}$, and at early steps that marginal is essentially the <b>data distribution</b> — the very thing we do not have and are trying to learn. The reverse direction exists as a well-defined mathematical object; we are only unable to write it down. Part 7 finds the workaround: condition on the clean start $x_0$ as well. With $x_0$ in hand, every ingredient of the flip becomes a known Gaussian, and part 3's complete-the-square turns the crank to an exact formula. One more wrinkle to expect: diffusion's chain is time-inhomogeneous ($\\beta_t$ changes per step), and the marginals $p(x_{t-1})$ change per step too — so the reverse chain needs a separate Bayes flip at every $t$. That per-step flip, with Gaussians in every slot, is precisely the computation part 7 performs.</p>`
      },
      {
        h: "Sanity checks",
        body: `<p>Habits of a careful reader — run each result through a quick check.</p>
        <ul>
          <li><b>The chain rule conserves probability.</b> The four two-step weather paths from a sunny start have probabilities $0.8 \\cdot 0.8 = 0.64$, $\\;0.8 \\cdot 0.2 = 0.16$, $\\;0.2 \\cdot 0.4 = 0.08$, $\\;0.2 \\cdot 0.6 = 0.12$, and $0.64 + 0.16 + 0.08 + 0.12 = 1.00$. Multiplying conditionals never leaks probability.</li>
          <li><b>Kernel rows are distributions.</b> Every row of a transition table sums to 1 — if a row of yours does not, it is not a kernel.</li>
          <li><b>Stationarity is a fixed point, checked by substitution.</b> Feeding $(\\tfrac{2}{3}, \\tfrac{1}{3})$ through the weather table returned $(\\tfrac{2}{3}, \\tfrac{1}{3})$. If your candidate $\\pi$ comes back changed, it is not stationary.</li>
          <li><b>The variance calibration is exact for every dose.</b> $(1-\\beta) \\cdot 1 + \\beta = 1$ holds for any $\\beta$, not only our 0.3 — the shrink is matched to the dose by construction.</li>
          <li><b>Limits of the number-line chain behave.</b> As $\\beta \\to 0$: $x_t = x_{t-1}$, a frozen chain that never forgets its start. As $\\beta \\to 1$: $x_t = \\epsilon_t$, one step wipes everything and the state is pure noise immediately. The dose interpolates between "no destruction" and "instant destruction" — which is exactly the knob a noise schedule turns.</li>
          <li><b>Reverse conditionals are still distributions.</b> Our Bayes flip returned $0.75$ and $0.25$, summing to 1. A flip that does not sum to 1 has an arithmetic error in the marginal.</li>
        </ul>`
      },
      {
        h: "What you can do now",
        body: `<p>Take stock — this part handed you the machinery of step-by-step randomness:</p>
        <ul>
          <li>You can factor any joint distribution into a step-by-step story with the <b>chain rule</b>, in either direction, and you know it is an identity, not an assumption.</li>
          <li>You know the <b>Markov property</b> — tomorrow only cares about today — and how it collapses the factorized joint to $q(x_{1:T} \\mid x_0) = \\prod_t q(x_t \\mid x_{t-1})$.</li>
          <li>You can read a <b>transition kernel</b>, compute multi-step probabilities by multiplying along paths and adding over paths, and you know the diffusion schedule makes its chain time-inhomogeneous.</li>
          <li>You can verify a <b>stationary distribution</b> by substitution, and you proved with part 3's scaling and sum rules that $\\mathcal{N}(0,1)$ is stationary for $x_t = \\sqrt{1-\\beta}\\, x_{t-1} + \\sqrt{\\beta}\\, \\epsilon_t$ — the first rigorous glimpse of why noising ends in pure noise, with the start forgotten geometrically fast.</li>
          <li>You can run a chain <b>backwards</b> with Bayes' rule, and you know the catch: the flip needs the marginal of the earlier state, which for diffusion is the unknown data distribution — the exact obstacle part 7 dismantles.</li>
        </ul>
        <p>What you cannot do yet is <b>score</b> a model. Suppose someone hands you a candidate reverse chain — a learned guess at the backwards kernels. Is it good? You need a single number that says "this model explains the observed data this well," a principled way to compare two candidates, and a way to keep the number computable when the model has hidden pieces. That toolkit — likelihood and why we take its log, KL divergence as the mismatch cost between distributions, and the ELBO, the trainable lower bound that diffusion's whole loss function is built from — is part 5. It is the last piece of pure probability machinery before we assemble the forward process for real in part 6.</p>`
      }
    ],
    symbols: [
      { sym: "$x_0$", desc: "the chain's starting state — for diffusion, the clean data point (image as a list of numbers)" },
      { sym: "$x_t$", desc: "the state after $t$ steps — for diffusion, the data after $t$ small doses of noise" },
      { sym: "$x_{1:T}$", desc: "shorthand for the whole path $x_1, x_2, \\ldots, x_T$ treated as one object" },
      { sym: "$T$", desc: "total number of steps in the chain" },
      { sym: "$q(x_t \\mid x_{t-1})$", desc: "the transition kernel — the rule giving the distribution of the next state from the current one; for diffusion, the fixed noising recipe" },
      { sym: "$\\prod_{t=1}^{T}$", desc: "the product sign: multiply one factor for each $t$ from 1 to $T$ (the multiplicative cousin of $\\Sigma$)" },
      { sym: "$\\beta$", desc: "the noise dose per step — a small number between 0 and 1 (the real schedule varies it as $\\beta_t$)" },
      { sym: "$\\epsilon_t$", desc: "fresh standard Gaussian noise drawn independently at step $t$" },
      { sym: "$\\mathcal{N}(\\mu, \\sigma^2)$", desc: "the Gaussian (bell curve) with center $\\mu$ and spread $\\sigma^2$" },
      { sym: "$\\pi$", desc: "a stationary distribution — one the chain's step leaves exactly unchanged" },
      { sym: "$p(x_{t-1} \\mid x_t)$", desc: "the reverse conditional — the distribution of yesterday's state given today's, obtained by a Bayes flip" }
    ],
    recall: [
      "State the chain rule of probability for three variables. Is it an assumption or an identity, and why?",
      "What does the Markov property say, in one plain sentence about weather?",
      "What is a transition kernel, and what must each row of a transition table sum to?",
      "What is the difference between a time-homogeneous and a time-inhomogeneous chain? Which kind is diffusion's forward process, and why?",
      "What does it mean for a distribution to be stationary for a chain?",
      "Which two Gaussian rules from part 3 combine to show that $\\mathcal{N}(0,1)$ is stationary for $x_t = \\sqrt{1-\\beta}\\,x_{t-1} + \\sqrt{\\beta}\\,\\epsilon_t$, and what do the two variance contributions add up to?",
      "Why can you not compute $p(\\text{yesterday} \\mid \\text{today})$ from the transition table alone? What extra ingredient does Bayes' rule demand?"
    ],
    practice: [
      {
        q: "Factorize the joint $p(a, b, c)$ two ways: forward (peeling $c$ last) and backward (peeling $a$ last). Then write what each factorization becomes if the process is Markov with step order $a \\to b \\to c$.",
        steps: [
          { do: "Forward, peel off $c$: by the definition of the conditional, $p(a, b, c) = p(a, b)\\, p(c \\mid a, b)$.", why: "The definition $p(c \\mid a, b) = p(a,b,c)/p(a,b)$, with both sides multiplied by $p(a, b)$ — multiplying both sides of a true equation by the same number keeps it true." },
          { do: "Peel off $b$ the same way: $p(a, b) = p(a)\\, p(b \\mid a)$.", why: "The identical definition applied one variable earlier." },
          { do: "Substitute that into step 1's result: $p(a, b, c) = p(a)\\, p(b \\mid a)\\, p(c \\mid a, b)$.", why: "Equals may replace equals." },
          { do: "Backward, peel off $a$: $p(a, b, c) = p(b, c)\\, p(a \\mid b, c)$.", why: "The chain rule is bookkeeping, not an assumption — the peeling order is free, so the same joint can be told from $c$ backwards." },
          { do: "Peel off $b$ from the remaining pair: $p(b, c) = p(c)\\, p(b \\mid c)$, giving $p(a, b, c) = p(c)\\, p(b \\mid c)\\, p(a \\mid b, c)$.", why: "One more application of the same definition, then equals-for-equals substitution." },
          { do: "Apply Markov to the forward telling: $p(c \\mid a, b) = p(c \\mid b)$, giving $p(a)\\, p(b \\mid a)\\, p(c \\mid b)$.", why: "The Markov property says that given the present state $b$, the future $c$ ignores the past $a$." },
          { do: "Apply Markov to the backward telling: $p(a \\mid b, c) = p(a \\mid b)$, giving $p(c)\\, p(b \\mid c)\\, p(a \\mid b)$.", why: "The Markov property makes past and future independent given the present, so conditioning the past $a$ on the future $c$ as well as on $b$ changes nothing." }
        ],
        answer: "Forward: $p(a)\\,p(b \\mid a)\\,p(c \\mid a, b)$, which under Markov becomes $p(a)\\,p(b \\mid a)\\,p(c \\mid b)$. Backward: $p(c)\\,p(b \\mid c)\\,p(a \\mid b, c)$, which under Markov becomes $p(c)\\,p(b \\mid c)\\,p(a \\mid b)$ — every factor is one-step."
      },
      {
        q: "A three-day weather record (letters are day 1, day 2, day 3; S = sunny, R = rainy) has path probabilities: SSS 0.36, SSR 0.04, SRS 0.04, SRR 0.06, RSS 0.10, RSR 0.10, RRS 0.12, RRR 0.18. Is this process Markov? Decide by computing $p(\\text{day 3} = \\text{S} \\mid \\text{day 2} = \\text{S}, \\text{day 1} = \\text{S})$ and $p(\\text{day 3} = \\text{S} \\mid \\text{day 2} = \\text{S}, \\text{day 1} = \\text{R})$.",
        steps: [
          { do: "Collect the paths matching the first condition (day 1 = S, day 2 = S): SSS with 0.36 and SSR with 0.04, total slice mass $0.36 + 0.04 = 0.40$.", why: "Conditioning keeps only the outcomes consistent with what is known — part 2's renormalized slice." },
          { do: "Divide the day-3-sunny mass by the slice mass: $0.36 / 0.40 = 0.90$.", why: "The definition of conditional probability: matching joint mass over total slice mass." },
          { do: "Collect the paths for the second condition (day 1 = R, day 2 = S): RSS with 0.10 and RSR with 0.10, total $0.10 + 0.10 = 0.20$.", why: "Same conditioning move, now with a rainy day 1." },
          { do: "Divide: $0.10 / 0.20 = 0.50$.", why: "Definition of conditional probability again." },
          { do: "Compare: $0.90 \\ne 0.50$, so knowing day 1 still changes the forecast for day 3 even after day 2 is known. The process is not Markov.", why: "The Markov property requires the history-conditional to equal the one-step conditional for every history; a single mismatch breaks it." }
        ],
        answer: "Not Markov: given a sunny day 2, the day-3 forecast is 0.90 after a sunny day 1 but 0.50 after a rainy day 1 — the past leaks through."
      },
      {
        q: "A chain has kernel $P(\\text{S} \\to \\text{S}) = 0.7$, $P(\\text{S} \\to \\text{R}) = 0.3$, $P(\\text{R} \\to \\text{S}) = 0.5$, $P(\\text{R} \\to \\text{R}) = 0.5$. Starting sunny, compute the probability of sunny two steps later.",
        steps: [
          { do: "List the routes to a sunny step 2: through a sunny step 1 ($\\text{S} \\to \\text{S} \\to \\text{S}$) or through a rainy step 1 ($\\text{S} \\to \\text{R} \\to \\text{S}$).", why: "The chain must pass through one of the two intermediate states, and the two routes are mutually exclusive." },
          { do: "Route 1: $0.7 \\times 0.7 = 0.49$.", why: "Chain rule plus Markov: a path's probability is the product of its one-step transition probabilities." },
          { do: "Route 2: $0.3 \\times 0.5 = 0.15$.", why: "Same multiplication rule along the other route." },
          { do: "Add the routes: $0.49 + 0.15 = 0.64$.", why: "Probabilities of disjoint events add — part 2." },
          { do: "Check the complement: $P(\\text{rainy in two}) = 0.7 \\times 0.3 + 0.3 \\times 0.5 = 0.21 + 0.15 = 0.36$, and $0.64 + 0.36 = 1$.", why: "A two-step rule is still a distribution; if the pair does not sum to 1, a route was missed or double-counted." }
        ],
        answer: "$P(\\text{sunny two steps later} \\mid \\text{sunny now}) = 0.64$."
      },
      {
        q: "Let $\\beta = 0.08$. Show that if $x_{t-1} \\sim \\mathcal{N}(0,1)$ and $\\epsilon_t \\sim \\mathcal{N}(0,1)$ is independent of it, then $x_t = \\sqrt{0.92}\\, x_{t-1} + \\sqrt{0.08}\\, \\epsilon_t$ is again $\\mathcal{N}(0,1)$.",
        steps: [
          { do: "Scale the state: $\\sqrt{0.92}\\, x_{t-1}$ is Gaussian with mean $\\sqrt{0.92} \\cdot 0 = 0$ and variance $(\\sqrt{0.92})^2 \\cdot 1 = 0.92$.", why: "Part 3's scaling rule: multiplying a Gaussian by $a$ scales the mean by $a$ and the variance by $a^2$; squaring undoes the square root." },
          { do: "Scale the noise: $\\sqrt{0.08}\\, \\epsilon_t \\sim \\mathcal{N}(0,\\, 0.08)$.", why: "The same scaling rule with $a = \\sqrt{0.08}$." },
          { do: "Add the means of the two independent pieces: $0 + 0 = 0$.", why: "Part 3's sum rule for independent Gaussians: means add." },
          { do: "Add the variances: $0.92 + 0.08 = 1$.", why: "The sum rule again: for independent variables, variances add — and independence holds because the fresh noise is drawn without looking at the state." },
          { do: "Conclude the shape: the sum of two independent Gaussians is Gaussian, so $x_t \\sim \\mathcal{N}(0, 1)$.", why: "Part 3 established that Gaussian-ness survives independent addition — the sum is not merely matching in mean and variance, it is exactly Gaussian." }
        ],
        answer: "$x_t \\sim \\mathcal{N}(0,1)$ exactly. The shrink factor $\\sqrt{1-\\beta}$ and dose $\\sqrt{\\beta}$ are calibrated so the variances sum to $(1-\\beta) + \\beta = 1$ for any $\\beta$ — 0.08 included."
      },
      {
        q: "Same weather kernel as the lesson ($\\text{S} \\to \\text{R}$ has probability 0.2, $\\text{R} \\to \\text{R}$ has probability 0.6), but now the prior is even odds: $p(\\text{yesterday} = \\text{S}) = 0.5$. Today it rains. Compute $p(\\text{yesterday} = \\text{S} \\mid \\text{today} = \\text{R})$ and compare with the lesson's answer under the 0.9 prior.",
        steps: [
          { do: "Joint of sunny-then-rain: $0.5 \\times 0.2 = 0.10$.", why: "Chain rule: prior probability of the yesterday-state times the forward transition probability." },
          { do: "Joint of rainy-then-rain: $0.5 \\times 0.6 = 0.30$.", why: "Same rule on the other possible yesterday." },
          { do: "Marginal chance of today's rain: $0.10 + 0.30 = 0.40$.", why: "The two yesterdays are disjoint, and the marginal is the sum of the joint over them — part 2." },
          { do: "Bayes flip: $0.10 / 0.40 = 0.25$.", why: "The conditional is the matching joint mass divided by the total mass of what was observed." },
          { do: "Compare: under the 0.9 prior the lesson got 0.75; under the 0.5 prior the answer is 0.25 — same kernel, different prior, different reverse conditional.", why: "The reverse conditional depends on the marginal distribution of the earlier state, not only on the forward table — this is the exact reason diffusion's reverse step cannot be read off the noising kernel alone." }
        ],
        answer: "$p(\\text{yesterday} = \\text{S} \\mid \\text{today} = \\text{R}) = 0.25$, versus 0.75 under the 0.9 prior. The forward table is identical in both computations; only the prior changed."
      },
      {
        q: "Why does the noising chain forget its start? Make it quantitative: with $\\beta = 0.3$ and the deterministic start $x_0 = 10$, find the mean and variance of $x_{20}$, and state the general principle.",
        steps: [
          { do: "Mean recursion: taking expectations of the update gives $m_t = \\sqrt{0.7}\\, m_{t-1}$, where $m_t = \\mathbb{E}[x_t]$.", why: "Expectation is linear (part 2), and the noise term contributes $\\sqrt{0.3}\\, \\mathbb{E}[\\epsilon_t] = 0$." },
          { do: "Unroll 20 steps: $m_{20} = (\\sqrt{0.7})^{20} \\times 10 = 0.7^{10} \\times 10$.", why: "Applying the same multiplication 20 times stacks the factors, and $(\\sqrt{0.7})^{20} = 0.7^{10}$." },
          { do: "Evaluate: $0.7^{10} \\approx 0.0282$, so $m_{20} \\approx 0.28$.", why: "Arithmetic — the starting value 10 has been squashed to roughly 3 percent of itself." },
          { do: "Variance recursion: $v_t = 0.7\\, v_{t-1} + 0.3$ with $v_0 = 0$.", why: "Variance picks up the square of a scale factor, variances of independent pieces add (part 2), and a deterministic start has variance 0." },
          { do: "Verify the closed form $v_t = 1 - 0.7^{t}$: substituting it into the recursion gives $0.7\\,(1 - 0.7^{t-1}) + 0.3 = 0.7 - 0.7^{t} + 0.3 = 1 - 0.7^{t}$, and it matches $v_0 = 0$. So $v_{20} = 1 - 0.7^{20} \\approx 0.9992$.", why: "A formula that satisfies both the recursion and the starting value is the solution — checking by substitution is the one-step way to confirm it." },
          { do: "Conclude: $x_{20}$ is approximately $\\mathcal{N}(0.28,\\, 0.999)$ — nearly the standard Gaussian, despite starting at 10.", why: "Each step multiplies the memory of the start by $\\sqrt{1-\\beta} \\lt 1$, a geometric decay, while the injected noise rebuilds the variance toward the fixed point 1 — so every start flows to the same $\\mathcal{N}(0,1)$." }
        ],
        answer: "Mean $\\approx 0.28$, variance $\\approx 0.999$: after 20 steps the chain is essentially standard noise. In general the start's influence on the mean decays like $(1-\\beta)^{t/2}$ — geometrically fast — while the variance is pulled to 1, so the chain forgets where it began."
      }
    ]
  });
})();
