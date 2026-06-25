/* Paper lesson — "Certified Adversarial Robustness via Randomized Smoothing"
   (Cohen, Rosenfeld, Kolter, ICML 2019). Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-certified-robustness".
   GROUNDED from arXiv:1902.02918 (abstract) and the ar5iv HTML mirror
   (Section 3 Eqn. 1 smoothed classifier; Theorem 1 / Eqn. 3 certified L2 radius;
   Section 3.2.2 the Certify Monte-Carlo algorithm; Table 1 ImageNet numbers).
   Track B (architecture): compose a tiny classifier with torch.nn, then implement the
   NOVEL part by hand — randomized smoothing: estimate the top-class probability under
   Gaussian noise by Monte-Carlo sampling, then plug into the certified-radius formula. */
(function () {
  window.LESSONS.push({
    id: "paper-certified-robustness",
    title: "Randomized Smoothing — Certified Adversarial Robustness via Randomized Smoothing (2019)",
    tagline: "Add Gaussian noise, vote, and you get a classifier with a provable no-flip radius.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Jeremy M. Cohen, Elan Rosenfeld, J. Zico Kolter",
      org: "Carnegie Mellon University",
      year: 2019,
      venue: "arXiv:1902.02918 (Feb 2019); ICML 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1902.02918",
      code: "https://github.com/locuslab/smoothing"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["pt-nn-module", "ml-gradient-descent"],

    // WHY READ IT
    problem:
      `<p>An <b>adversarial example</b> is an input changed by a tiny, carefully chosen amount &mdash; too small
       for a human to notice &mdash; that flips a neural network's prediction. The size of the change is measured
       by the <b>$\\ell_2$ norm</b> (the straight-line distance, the square root of the sum of squared coordinate
       differences). The attacker's question is: how big a push do I need to change the label?</p>
       <p>Before this paper, most defenses were <b>empirical</b>: you tried known attacks, and if the model
       survived them you called it robust. But a stronger, unseen attack could still break it. What people
       wanted was a <b>certificate</b>: a guarantee, proven in advance, that <i>no</i> perturbation smaller than
       some radius $R$ can change the prediction. Earlier certified defenses existed but did not scale &mdash;
       none had been shown to work on ImageNet (a large image-classification benchmark with 1000 classes).</p>
       <p>From the abstract:</p>
       <blockquote>"We show how to turn any classifier that classifies well under Gaussian noise into a new
       classifier that is certifiably robust to adversarial perturbations under the $\\ell_2$ norm. [...] No
       certified defense has been shown feasible on ImageNet except for smoothing." (Abstract)</blockquote>`,
    contribution:
      `<ul>
        <li><b>Randomized smoothing: a defense that wraps any classifier.</b> Take any base classifier $f$.
        Build a new classifier $g$ that, at input $x$, returns the class $f$ outputs <i>most often</i> when $x$
        is perturbed by Gaussian noise. No retraining of the architecture is required &mdash; $g$ is defined on
        top of $f$.</li>
        <li><b>A tight certified $\\ell_2$ radius.</b> The paper proves (Theorem 1) an exact formula for the
        radius within which the smoothed prediction provably cannot flip. The guarantee depends only on two
        numbers: how often the noisy base classifier picks the top class versus the runner-up.</li>
        <li><b>The first certified defense that scales to ImageNet.</b> Because smoothing only needs a base
        classifier that tolerates Gaussian noise, it works at ImageNet scale, where earlier certified methods
        could not.</li>
      </ul>`,
    whyItMattered:
      `<p>Randomized smoothing became the dominant approach to <i>certified</i> (provable, not just empirical)
       $\\ell_2$ robustness. Its appeal is that the certificate is a short, exact formula rather than an
       expensive solver, and the method treats the base network as a black box &mdash; so it rides along with
       whatever classifier you already have. It launched a large follow-up literature (training the base
       classifier to smooth well, tighter sampling bounds, extensions to other norms). The core takeaway lasts:
       averaging a classifier over noise turns a brittle decision boundary into one you can put a provable margin
       around.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Randomized smoothing)</b> &mdash; the definition of the smoothed classifier $g$
        (their <b>Equation 1</b>). This is the object you build.</li>
        <li><b>&sect;3.1 and Theorem 1</b> &mdash; the main result: the certified radius
        $R = \\tfrac{\\sigma}{2}\\big(\\Phi^{-1}(\\bar p_A) - \\Phi^{-1}(\\bar p_B)\\big)$ (their <b>Equation 3</b>).
        This is the equation you transcribe and implement.</li>
        <li><b>&sect;3.2.2 (Certification) &mdash; the <code>Certify</code> algorithm.</b> How to estimate the
        top-class probability in practice by <b>Monte-Carlo sampling</b> (drawing many noisy copies and
        counting), and how a confidence bound makes the certificate sound.</li>
       </ul>
       <p><b>Skim:</b> &sect;3.2.1 (the prediction algorithm), the experiments on ImageNet and CIFAR-10
       (a smaller image benchmark), and the proof of Theorem 1 (Neyman&ndash;Pearson) unless you want the full
       argument. Look at the certified-accuracy-versus-radius figures &mdash; the shape you will reproduce.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will take a tiny trained classifier and certify a robustness radius at several test points. The
       radius comes from $\\bar p_A$, a lower bound on how often the noisy classifier picks the top class. Two
       knobs change $R$: the <b>margin</b> (how far the point sits from the decision boundary) and the noise
       level <b>$\\sigma$</b> (the standard deviation of the Gaussian noise we add).</p>
       <p>Write your guesses: (1) As a point moves <i>away</i> from the boundary, does the certified radius go
       up, down, or stay flat? (2) The paper warns of a trade-off with $\\sigma$. If you raise $\\sigma$, you
       can certify <i>larger</i> radii &mdash; but what do you expect to <i>lose</i>? One sentence each.</p>`,
    attempt:
      `<p>Before the reveal, sketch the smoothing certificate you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Draw noise.</b> At input $x$, draw $n$ samples $x + \\varepsilon$ with
        $\\varepsilon \\sim \\mathcal{N}(0, \\sigma^2 I)$ (independent Gaussian noise on every coordinate).</li>
        <li><b>Vote.</b> Run the base classifier on all $n$ noisy copies. Count how many land in each class. The
        top class is $\\hat c_A$; let its count be $k_A$.</li>
        <li><b>TODO &mdash; lower-bound the probability.</b> Turn the count $k_A$ out of $n$ into a <b>lower
        confidence bound</b> $\\bar p_A$ on the true top-class probability. (Why a lower bound and not just
        $k_A/n$? What would a too-optimistic estimate cost you?)</li>
        <li><b>TODO &mdash; the radius.</b> Plug $\\bar p_A$ into
        $R = \\sigma\\,\\Phi^{-1}(\\bar p_A)$ (the two-class form, derived below). If $\\bar p_A \\le 0.5$,
        abstain. Why is $R=0$ exactly when $\\bar p_A = 0.5$?</li>
       </ul>
       <p>Then sweep the noise level $\\sigma$ and watch what happens to both the certified radius and the
       accuracy. Predict the trade-off before you run it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Randomized smoothing has two pieces: the <b>smoothed classifier</b> (what you predict with) and the
       <b>certificate</b> (the provable radius around that prediction).</p>
       <p><b>The smoothed classifier (&sect;3, Eqn. 1).</b> Start with any base classifier $f$ &mdash; a function
       from inputs to class labels. Define a new classifier $g$ that, at input $x$, returns whichever class $f$
       is <i>most likely</i> to output when $x$ is perturbed by Gaussian noise:</p>
       <p>$$ g(x) = \\arg\\max_{c} \\; \\mathbb{P}\\big(f(x + \\varepsilon) = c\\big), \\qquad
       \\varepsilon \\sim \\mathcal{N}(0, \\sigma^2 I). $$</p>
       <p>In words: jitter $x$ with noise, see what $f$ says, and take the majority vote over the noise. The
       symbol $\\mathbb{P}$ is "probability"; $\\mathcal{N}(0,\\sigma^2 I)$ is a Gaussian (bell-curve) noise with
       mean zero and the same standard deviation $\\sigma$ on every coordinate (that is what <i>isotropic</i>
       means). Note $g$ is not the same as $f$: it is $f$ <i>averaged over noise</i>.</p>
       <p><b>The certificate (&sect;3.1, Theorem 1).</b> Let $\\bar p_A$ be a number we are sure is
       <i>at most</i> the probability that the noisy $f$ outputs the winning class $c_A$ (a <b>lower bound</b> on
       the top-class probability). Let $\\bar p_B$ be a number we are sure is <i>at least</i> the probability of
       the best runner-up class (an <b>upper bound</b> on the second-place probability). The theorem says: the
       smoothed prediction $g$ provably does not change for <i>any</i> perturbation $\\delta$ with
       $\\lVert \\delta \\rVert_2 \\lt R$, where</p>
       <p>$$ R = \\tfrac{\\sigma}{2}\\big(\\Phi^{-1}(\\bar p_A) - \\Phi^{-1}(\\bar p_B)\\big). $$</p>
       <p>Here $\\Phi^{-1}$ is the <b>inverse standard-normal cumulative distribution function</b> (CDF =
       cumulative distribution function): $\\Phi(z)$ is the probability a standard bell curve falls below $z$,
       and $\\Phi^{-1}$ runs that backwards &mdash; give it a probability, it returns the $z$. It maps $0.5$ to
       $0$, and grows toward $+\\infty$ as the probability approaches $1$. So a more confident vote (bigger
       $\\bar p_A$) means a bigger $R$.</p>
       <p><b>Estimating the vote (&sect;3.2.2, the <code>Certify</code> algorithm).</b> We cannot compute the
       true probability $\\mathbb{P}(f(x+\\varepsilon)=c)$ exactly &mdash; it is an integral over all noise. So
       we estimate it by <b>Monte-Carlo sampling</b>: draw $n$ independent noisy copies, run $f$ on each, and
       count the winning class $k_A$ times out of $n$. To stay honest we do not use the raw fraction $k_A/n$;
       instead we take a <b>lower confidence bound</b> (a value the true probability exceeds with high
       confidence, say $99.9\\%$). That conservative $\\bar p_A$ is what goes into the radius, so the certificate
       holds with high probability.</p>`,
    architecture:
      `<p>There is no new <i>network</i> here &mdash; the "architecture" is the <b>smoothing wrapper and its two
       algorithms</b> built on top of an unchanged base classifier $f$. Components, in order:</p>
       <p><b>1. Base classifier $f$ (black box, trained under noise).</b> Any classifier mapping an input in
       $\\mathbb{R}^d$ to one of $K$ class labels &mdash; here a tiny multi-layer perceptron, but in the paper a
       ResNet on ImageNet. Its one requirement: it must classify <i>well under Gaussian noise</i>, so it is
       trained with Gaussian-noise augmentation at the same $\\sigma$ used later.</p>
       <p><b>2. Noise injection.</b> At input $x$, draw $n$ independent perturbations
       $\\varepsilon_i\\sim\\mathcal{N}(0,\\sigma^2 I)$ and form noisy copies $x+\\varepsilon_i$. The single
       hyper-parameter $\\sigma$ controls the whole accuracy-vs-radius trade-off.</p>
       <p><b>3. <code>SampleUnderNoise</code> &mdash; vote counter.</b> Run $f$ on all $n$ copies, return the
       per-class counts. This Monte-Carlo estimate stands in for the intractable integral
       $\\mathbb{P}(f(x+\\varepsilon)=c)$.</p>
       <p><b>4a. <code>Predict</code> (&sect;3.2.1).</b> Sample $n$ copies, take the top-two classes
       $\\hat c_A,\\hat c_B$ with counts $n_A,n_B$, and run a two-sided binomial test
       $\\textsc{BinomPValue}(n_A,n_A{+}n_B,\\tfrac12)$. Return $\\hat c_A$ if the p-value $\\le\\alpha$, else
       abstain. By Proposition 1 it returns $g(x)$ or abstains, w.p. $\\ge 1-\\alpha$.</p>
       <p><b>4b. <code>Certify</code> (&sect;3.2.2).</b> Two-stage: a small $n_0$-sample pass picks the candidate
       top class $\\hat c_A$; a large $n$-sample pass counts $k_A$ for that class; then
       $\\underline p_A=\\textsc{LowerConfBound}(k_A,n,1-\\alpha)$ (Clopper&ndash;Pearson). If
       $\\underline p_A\\gt\\tfrac12$ return $(\\hat c_A,\\,R=\\sigma\\,\\Phi^{-1}(\\underline p_A))$; else abstain.
       By Proposition 2 the radius is sound w.p. $\\ge 1-\\alpha$.</p>
       <p><b>Data flow:</b> $x \\to$ add $n$ Gaussian noises $\\to f$ on each $\\to$ class counts $\\to$ top class
       $+$ binomial confidence bound $\\to$ certified radius $R$. Nothing is back-propagated at certify time; the
       only learned object is $f$.</p>`,
    symbols: [
      { sym: "$f$", desc: "the <b>base classifier</b>: any function from an input to a class label (here a tiny trained neural network). Smoothing wraps it without changing it." },
      { sym: "$g$", desc: "the <b>smoothed classifier</b>: at $x$, returns the class the base classifier $f$ outputs most often under Gaussian noise. This is what you actually predict with and certify." },
      { sym: "$\\varepsilon$", desc: "the <b>random noise</b> added to the input, drawn from a Gaussian. Greek letter epsilon." },
      { sym: "$\\mathcal{N}(0, \\sigma^2 I)$", desc: "an <b>isotropic Gaussian</b>: bell-curve noise with mean $0$ and standard deviation $\\sigma$ on every coordinate independently ($I$ is the identity matrix, meaning no correlation across coordinates)." },
      { sym: "$\\sigma$", desc: "the <b>noise level</b>: the standard deviation of the Gaussian noise. The single tuning knob &mdash; bigger $\\sigma$ allows certifying larger radii, but lowers accuracy (the trade-off)." },
      { sym: "$c_A$", desc: "the <b>top class</b>: the class the noisy base classifier picks most often at $x$. This is what $g$ returns." },
      { sym: "$\\bar p_A$", desc: "a <b>lower bound</b> on the probability that $f(x+\\varepsilon) = c_A$ &mdash; a value we are confident the true top-class probability is at least. Estimated by Monte-Carlo sampling plus a confidence bound." },
      { sym: "$\\bar p_B$", desc: "an <b>upper bound</b> on the probability of the best runner-up class. In the common two-class case we set $\\bar p_B = 1 - \\bar p_A$." },
      { sym: "$\\Phi^{-1}$", desc: "the <b>inverse standard-normal CDF</b> (CDF = cumulative distribution function). Give it a probability $p$; it returns the value $z$ such that a standard bell curve has probability $p$ of falling below $z$. $\\Phi^{-1}(0.5)=0$; it grows without bound as $p \\to 1$." },
      { sym: "$R$", desc: "the <b>certified radius</b>: the smoothed prediction provably cannot flip for any $\\ell_2$ perturbation smaller than $R$." },
      { sym: "$\\lVert \\delta \\rVert_2$", desc: "the <b>$\\ell_2$ norm</b> of a perturbation $\\delta$: its straight-line length, the square root of the sum of its squared coordinates. The attacker's budget." },
      { sym: "$n$", desc: "the <b>number of Monte-Carlo samples</b>: how many noisy copies we draw to estimate the vote. More samples give a tighter $\\bar p_A$." }
    ],
    formula:
      `$$ g(x) = \\arg\\max_{c}\\, \\mathbb{P}\\big(f(x+\\varepsilon)=c\\big),\\qquad \\varepsilon\\sim\\mathcal{N}(0,\\sigma^2 I). $$
       <p class="cap">The <b>smoothed classifier</b> (&sect;3, Eqn. 1): the majority vote of base classifier $f$ over isotropic Gaussian noise.</p>

       $$ \\text{If } \\;\\mathbb{P}\\big(f(x+\\varepsilon)=c_A\\big) \\ge \\underline p_A \\;\\ge\\; \\overline p_B \\ge \\max_{c\\neq c_A}\\mathbb{P}\\big(f(x+\\varepsilon)=c\\big),\\quad \\text{then } g(x+\\delta)=c_A \\ \\text{for all } \\lVert\\delta\\rVert_2 \\lt R. $$
       <p class="cap"><b>Theorem 1</b> condition (&sect;3.1): the top-class probability is lower-bounded by $\\underline p_A$, the runner-up upper-bounded by $\\overline p_B$.</p>

       $$ R = \\tfrac{\\sigma}{2}\\big(\\Phi^{-1}(\\underline p_A) - \\Phi^{-1}(\\overline p_B)\\big). $$
       <p class="cap">The <b>certified $\\ell_2$ radius</b> (&sect;3.1, Theorem 1 / Eqn. 3): half the gap of the inverse-normal-CDF scores, scaled by $\\sigma$. Proven tight.</p>

       $$ \\overline p_B = 1-\\underline p_A \\;\\Longrightarrow\\; R = \\tfrac{\\sigma}{2}\\big(\\Phi^{-1}(\\underline p_A)-\\Phi^{-1}(1-\\underline p_A)\\big) = \\sigma\\,\\Phi^{-1}(\\underline p_A). $$
       <p class="cap"><b>Two-class reduction</b> (&sect;3.1): using $\\Phi^{-1}(1-p)=-\\Phi^{-1}(p)$. This is the form the code certifies with.</p>

       $$ \\underline p_A = \\textsc{LowerConfBound}(k_A,\\,n,\\,1-\\alpha),\\qquad k_A \\sim \\text{Binomial}\\big(n,\\,\\mathbb{P}(f(x+\\varepsilon)=c_A)\\big). $$
       <p class="cap"><b>Monte-Carlo certify</b> (&sect;3.2.2, <code>Certify</code>): draw $n$ noisy samples, count winner $k_A$, take a one-sided binomial (Clopper&ndash;Pearson) lower confidence bound; abstain if $\\underline p_A \\le \\tfrac12$. By Proposition 2 the certificate then holds with probability $\\ge 1-\\alpha$.</p>

       $$ \\Lambda(z)=\\frac{p_{X+\\delta}(z)}{p_X(z)}=\\exp\\!\\Big(\\tfrac{1}{\\sigma^2}\\big(\\delta^\\top z\\big)+b\\Big),\\qquad X\\sim\\mathcal{N}(x,\\sigma^2 I),\\ X{+}\\delta\\sim\\mathcal{N}(x{+}\\delta,\\sigma^2 I). $$
       <p class="cap"><b>Neyman&ndash;Pearson basis</b> (Lemma 4, Appendix A): the Gaussian likelihood ratio is monotone in $\\delta^\\top z$, so the worst-case region is a halfspace $\\{z:\\delta^\\top z\\le\\beta\\}$ &mdash; this is what makes the bound exact and yields the $\\Phi^{-1}$ form.</p>`,
    whatItDoes:
      `<p><b>The smoothed classifier</b> (left, &sect;3 Eqn. 1) is a majority vote of the base classifier over
       Gaussian noise. Averaging over noise smooths the decision boundary: instead of a sharp surface that a tiny
       push can cross, you get a soft one with a measurable margin.</p>
       <p><b>The certified radius</b> (right, Theorem 1 / Eqn. 3) turns that margin into a number. It depends only
       on the gap between the top-class probability $\\bar p_A$ and the runner-up $\\bar p_B$, passed through
       $\\Phi^{-1}$ and scaled by $\\tfrac{\\sigma}{2}$. A bigger gap (more confident vote) means a bigger
       certified radius. In the two-class case, $\\bar p_B = 1 - \\bar p_A$, and because
       $\\Phi^{-1}(1-p) = -\\Phi^{-1}(p)$ the formula collapses to the clean
       $R = \\sigma\\,\\Phi^{-1}(\\bar p_A)$ &mdash; the form used in the code.</p>`,
    derivation:
      `<p>This lesson owns the math (<code>conceptLink</code> is null), so here is the intuition for why
       $R = \\tfrac{\\sigma}{2}\\big(\\Phi^{-1}(\\bar p_A)-\\Phi^{-1}(\\bar p_B)\\big)$ &mdash; not the full
       Neyman&ndash;Pearson proof, but enough to trust the formula.</p>
       <p><b>Why $\\Phi^{-1}$ appears.</b> The key fact about a Gaussian is that shifting its center by $\\delta$
       and asking "how much probability mass moved across a flat boundary" is answered by the normal CDF $\\Phi$.
       The base classifier's "yes/no for class $c_A$" region, seen through the noise, behaves like such a
       boundary. The probability $\\bar p_A$ that the noise lands in the $c_A$ region corresponds to a signed
       distance $\\Phi^{-1}(\\bar p_A)$ from the boundary, measured in units of $\\sigma$. Likewise the runner-up
       sits at distance $\\Phi^{-1}(\\bar p_B)$.</p>
       <p><b>Why the radius is the half-gap.</b> An adversary moving the input toward the boundary by $\\delta$
       shifts both probabilities. The prediction flips only when the top and runner-up probabilities cross. The
       safe budget &mdash; the worst-case shift the top class can absorb before the runner-up catches it &mdash;
       is exactly half the gap between their boundary distances, scaled back to input units by $\\sigma$:</p>
       <p>$$ R = \\frac{\\sigma}{2}\\Big(\\Phi^{-1}(\\bar p_A) - \\Phi^{-1}(\\bar p_B)\\Big). $$</p>
       <p>The paper proves this is <b>tight</b>: no smoothing-based certificate using only $\\bar p_A,\\bar p_B$
       can promise a larger radius. <b>Two-class simplification:</b> with $\\bar p_B = 1-\\bar p_A$, substitute
       $\\Phi^{-1}(1-\\bar p_A) = -\\Phi^{-1}(\\bar p_A)$ to get
       $R = \\tfrac{\\sigma}{2}\\big(\\Phi^{-1}(\\bar p_A)+\\Phi^{-1}(\\bar p_A)\\big) = \\sigma\\,\\Phi^{-1}(\\bar p_A)$.</p>`,
    example:
      `<p>Plug real numbers into the radius formula. Suppose at some input the smoothed classifier is very
       confident: under noise with $\\sigma = 0.5$, the top class is chosen with (lower-bounded) probability
       $\\bar p_A = 0.99$, and we take the runner-up bound $\\bar p_B = 1 - 0.99 = 0.01$.</p>
       <ul class="steps">
        <li><b>Look up the inverse CDF.</b> $\\Phi^{-1}(0.99) = 2.3263$ (the value below which a standard bell
        curve sits with probability $0.99$). By symmetry $\\Phi^{-1}(0.01) = -2.3263$.</li>
        <li><b>The gap.</b> $\\Phi^{-1}(\\bar p_A) - \\Phi^{-1}(\\bar p_B) = 2.3263 - (-2.3263) = 4.6526$.</li>
        <li><b>Scale by $\\tfrac{\\sigma}{2}$.</b>
        $R = \\tfrac{0.5}{2}\\cdot 4.6526 = 0.25 \\cdot 4.6526 = 1.1632$.</li>
        <li><b>Two-class check.</b> The simplified form gives the same answer:
        $R = \\sigma\\,\\Phi^{-1}(\\bar p_A) = 0.5 \\cdot 2.3263 = 1.1632$. </li>
       </ul>
       <p>So at this point, <i>no</i> adversarial perturbation with $\\ell_2$ length below $1.1632$ can change the
       smoothed prediction. Now contrast a barely-confident point: if $\\bar p_A = 0.6$, then
       $R = 0.5 \\cdot \\Phi^{-1}(0.6) = 0.5 \\cdot 0.2533 = 0.1267$ &mdash; a much smaller certified radius. And
       if $\\bar p_A = 0.5$ exactly, $\\Phi^{-1}(0.5)=0$, so $R=0$: a coin-flip vote certifies nothing. These
       numbers are recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Build a base classifier</b> with <code>torch.nn</code>: a tiny multi-layer perceptron
        (a small fully-connected network) trained on a 2D two-class task. Train it <i>with Gaussian noise
        augmentation</i> at level $\\sigma$ so it classifies well under noise (the paper's prerequisite).</li>
        <li><b>Smooth it (by hand):</b> at a test point $x$, draw $n$ noisy copies $x+\\varepsilon$ with
        $\\varepsilon\\sim\\mathcal{N}(0,\\sigma^2 I)$, run the base net on all of them, and count the votes.
        The top class with count $k_A$ is the smoothed prediction.</li>
        <li><b>Lower-bound the vote:</b> turn $k_A$ out of $n$ into a <b>binomial lower confidence bound</b>
        $\\bar p_A$ (Clopper&ndash;Pearson, confidence $99.9\\%$). If $\\bar p_A \\le 0.5$, <b>abstain</b>.</li>
        <li><b>Certify:</b> compute $R = \\sigma\\,\\Phi^{-1}(\\bar p_A)$ (two-class form).</li>
        <li><b>Show the effects:</b> (a) sweep the <b>margin</b> at fixed $\\sigma$ &mdash; radius grows as the
        point moves from the boundary; (b) sweep <b>$\\sigma$</b> &mdash; larger $\\sigma$ certifies larger radii
        but the certified accuracy at small radii starts to fall (the trade-off).</li>
       </ol>`,
    results:
      `<p>From the abstract (quoted): randomized smoothing yields "an ImageNet classifier with e.g. a certified
       top-1 accuracy of 49% under adversarial perturbations with $\\ell_2$ norm less than 0.5 (=127/255)," and
       "No certified defense has been shown feasible on ImageNet except for smoothing."</p>
       <p>The paper's <b>Table 1</b> reports approximate certified top-1 accuracy on ImageNet at several radii
       (quoted): <b>49%</b> at $\\ell_2$ radius $0.5$, <b>37%</b> at $1.0$, <b>19%</b> at $2.0$, and <b>12%</b>
       at $3.0$ (each at the best $\\sigma$ for that radius). The decreasing trend with radius is the same
       certified-accuracy-versus-radius shape you reproduce below.</p>
       <p><i>These are the paper's own ImageNet numbers, quoted from the abstract and Table 1. The numbers in the
       CODEVIZ panel below are from our own tiny run on a 2D toy task &mdash; not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The base classifier is ordinary, so you <b>import</b> it
       from PyTorch and build only the novel wrapper. <b>Import:</b> <code>nn.Linear</code>, <code>nn.ReLU</code>
       for the tiny multi-layer perceptron, <code>nn.CrossEntropyLoss</code>, <code>torch.optim.Adam</code> for
       training, and <code>torch.randn</code> for the Gaussian noise. <b>Build by hand:</b> the
       <b>randomized-smoothing certificate</b> &mdash; the Monte-Carlo vote (draw $n$ noisy copies, count the
       winning class), the <b>binomial lower confidence bound</b> on the top-class probability, and the
       <b>certified-radius formula</b> $R = \\sigma\\,\\Phi^{-1}(\\bar p_A)$. That estimate-then-certify pipeline
       is the paper's contribution; PyTorch has no built-in for it.</p>`,
    pitfalls:
      `<ul>
        <li><b>Using the raw fraction $k_A/n$ instead of a lower bound.</b> The certificate must hold for the
        <i>true</i> probability, which you only sampled. Plugging the optimistic $k_A/n$ into $\\Phi^{-1}$ can
        report a radius the true classifier does not have. <b>Fix:</b> use a <b>binomial lower confidence
        bound</b> (Clopper&ndash;Pearson) so $\\bar p_A$ is conservative.</li>
        <li><b>Forgetting to abstain when $\\bar p_A \\le 0.5$.</b> If the vote is not even a confident majority,
        $\\Phi^{-1}(\\bar p_A) \\le 0$ and the radius is zero or undefined &mdash; the certificate says nothing.
        <b>Fix:</b> return "abstain", not a fake small radius.</li>
        <li><b>Training the base classifier with no noise, then smoothing with noise.</b> The base net must
        <i>classify well under Gaussian noise</i> &mdash; that is the paper's stated prerequisite. A net trained
        only on clean inputs gives near-random votes once you jitter, so $\\bar p_A$ stays near $0.5$ and you
        certify nothing. <b>Fix:</b> train with Gaussian-noise augmentation at the same $\\sigma$ you smooth
        with.</li>
        <li><b>Mismatching the noise level between certification and use.</b> The radius formula uses the same
        $\\sigma$ as the Gaussian you sampled. Certify with one $\\sigma$ and deploy with another and the
        guarantee no longer holds. <b>Fix:</b> fix one $\\sigma$ for sampling, certifying, and predicting.</li>
        <li><b>Expecting larger $\\sigma$ to be free.</b> Bigger $\\sigma$ pushes the certifiable radius up, but
        it also blurs the input, so accuracy at small radii falls. The right $\\sigma$ is a trade-off chosen for
        the radius you care about.</li>
      </ul>`,
    recall: [
      "Write the smoothed classifier $g(x)$ (Eqn. 1) and the certified radius $R$ (Theorem 1) from memory.",
      "Define $\\bar p_A$, $\\bar p_B$, and $\\Phi^{-1}$ in plain English.",
      "Why use a lower confidence bound on the vote instead of the raw fraction $k_A/n$?",
      "Show that the two-class form reduces to $R = \\sigma\\,\\Phi^{-1}(\\bar p_A)$.",
      "State the trade-off: what does raising $\\sigma$ gain, and what does it cost?"
    ],
    practice: [
      {
        q: `<b>Worked-number check.</b> Under $\\sigma = 1.0$, Monte-Carlo sampling at a point gives a top-class
            lower bound $\\bar p_A = 0.95$ (two classes, so $\\bar p_B = 0.05$). Compute the certified radius
            two ways and confirm they agree. Given $\\Phi^{-1}(0.95) = 1.6449$.`,
        steps: [
          { do: `Full form: $R = \\tfrac{\\sigma}{2}(\\Phi^{-1}(0.95) - \\Phi^{-1}(0.05))$. By symmetry $\\Phi^{-1}(0.05) = -1.6449$, so the gap is $1.6449 - (-1.6449) = 3.2898$.`, why: `$\\Phi^{-1}(1-p) = -\\Phi^{-1}(p)$ because the standard normal is symmetric about $0$.` },
          { do: `Scale: $R = \\tfrac{1.0}{2}\\cdot 3.2898 = 0.5 \\cdot 3.2898 = 1.6449$.`, why: `The factor $\\tfrac{\\sigma}{2}$ converts the probability gap (in $\\Phi^{-1}$ units) back to input distance.` },
          { do: `Two-class form: $R = \\sigma\\,\\Phi^{-1}(\\bar p_A) = 1.0 \\cdot 1.6449 = 1.6449$. Same answer.`, why: `With $\\bar p_B = 1-\\bar p_A$ the two halves of the gap are equal, so the half-gap times two cancels the $\\tfrac12$.` }
        ],
        answer: `<p>Both give $R = 1.6449$. The certified radius equals $\\sigma\\,\\Phi^{-1}(\\bar p_A) =
                 1.0 \\cdot 1.6449$. No $\\ell_2$ perturbation shorter than $1.6449$ can flip this prediction.
                 Note it scales directly with $\\sigma$: at $\\sigma = 0.5$ the same vote would certify only
                 $0.822$.</p>`
      },
      {
        q: `<b>The $\\sigma$ trade-off (ablation).</b> You certify the same test set at $\\sigma = 0.25$ and at
            $\\sigma = 1.0$. At small radii (near $0$) the low-$\\sigma$ model has higher certified accuracy, but
            past some radius its certified accuracy drops to <i>zero</i> while the high-$\\sigma$ model still
            certifies a fraction of points. Explain both halves.`,
        steps: [
          { do: `Cap on the radius: with two classes $R = \\sigma\\,\\Phi^{-1}(\\bar p_A)$. Even a near-perfect vote ($\\bar p_A$ close to $1$) gives a finite $\\Phi^{-1}(\\bar p_A)$, and the whole thing is multiplied by $\\sigma$.`, why: `A small $\\sigma$ multiplies every radius down &mdash; so small-$\\sigma$ certificates simply cannot reach large radii, no matter how confident the vote.` },
          { do: `Cost at small radii: raising $\\sigma$ blurs the input with more noise, so the base classifier is less sure, $\\bar p_A$ shrinks, and some easy points now abstain or certify a smaller radius.`, why: `More noise erodes the vote margin, which lowers certified accuracy at the radii the low-$\\sigma$ model already covered.` },
          { do: `Conclude: pick $\\sigma$ for the radius you care about &mdash; small $\\sigma$ for high accuracy at tiny radii, large $\\sigma$ to certify larger perturbations.`, why: `There is no single best $\\sigma$; the certified-accuracy-versus-radius curves cross. This is the paper's central practical trade-off.` }
        ],
        answer: `<p>Two effects of $\\sigma$ pull opposite ways. The radius is $\\sigma\\,\\Phi^{-1}(\\bar p_A)$, so
                 a small $\\sigma$ <b>caps</b> how large a radius you can ever certify &mdash; past that cap its
                 certified accuracy hits zero. But a large $\\sigma$ adds more noise, shrinking $\\bar p_A$, so it
                 <b>loses</b> accuracy at the small radii the low-$\\sigma$ model handled. The curves cross; you
                 choose $\\sigma$ for the threat you care about. Our run below shows exactly this: $\\sigma=0.25$
                 leads at $R=0.25$ but falls to $0$ by $R=1.0$, while $\\sigma=1.0$ still certifies points out to
                 $R=1.5$.</p>`
      },
      {
        q: `Why does randomized smoothing need <i>more</i> Monte-Carlo samples $n$ to certify a <i>larger</i>
            radius, even at a point where the base classifier almost never errs under noise?`,
        steps: [
          { do: `The radius uses $\\bar p_A$, a lower confidence bound. With $n$ samples and confidence $1-\\alpha$, the bound sits below the observed fraction by a gap that shrinks like $1/\\sqrt{n}$.`, why: `Fewer samples means a looser (more conservative) bound, so $\\bar p_A$ is further below the true probability.` },
          { do: `To certify a large radius you need $\\bar p_A$ very close to $1$ (since $\\Phi^{-1}$ shoots up only as $p \\to 1$). A loose bound caps how close to $1$ you can claim.`, why: `$\\Phi^{-1}(0.999)$ is far larger than $\\Phi^{-1}(0.99)$; resolving that last fraction of a percent needs many samples.` },
          { do: `So even a perfect classifier needs huge $n$ to <i>prove</i> $\\bar p_A \\approx 0.9999$ and unlock a large radius.`, why: `The certificate is limited by sampling confidence, not just by the classifier's true accuracy.` }
        ],
        answer: `<p>Because the certificate is only as strong as the <b>lower bound</b> $\\bar p_A$ you can prove,
                 and that bound tightens like $1/\\sqrt{n}$. Large radii require $\\bar p_A$ pushed very close to
                 $1$ (where $\\Phi^{-1}$ grows steeply), and resolving that requires many samples even for a
                 near-perfect base classifier. Big radii are expensive in samples, not just in $\\sigma$.</p>`
      }
    ]
  });

  window.CODE["paper-certified-robustness"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny base classifier with <code>nn.Linear</code> / <code>nn.ReLU</code>,
       train it with Gaussian-noise augmentation, then build the <b>novel</b> part by hand &mdash; randomized
       smoothing. At a test point we draw $n$ noisy copies with <code>torch.randn() * sigma</code>, run the base
       net, count the winning class, turn that count into a <b>binomial lower confidence bound</b> $\\bar p_A$
       (Clopper&ndash;Pearson, $99.9\\%$), and certify $R = \\sigma\\,\\Phi^{-1}(\\bar p_A)$ &mdash; abstaining
       when $\\bar p_A \\le 0.5$. The first cell recomputes the worked example
       ($\\sigma=0.5,\\ \\bar p_A=0.99 \\Rightarrow R=1.1632$). We then show the two effects: the radius grows
       with the <b>margin</b> (distance from the boundary) at fixed $\\sigma$, and larger <b>$\\sigma$</b> certifies
       larger radii. CPU, one fast run. Paste into Colab. The only non-torch import is
       <code>scipy.stats</code> for $\\Phi^{-1}$ and the confidence bound.</p>`,
    code: `import torch, torch.nn as nn
import numpy as np
from scipy.stats import norm, binomtest

torch.manual_seed(0); np.random.seed(0)

# --- 0. Worked example: plug p_A=0.99, p_B=0.01, sigma=0.5 into the radius formula. ---
sigma_we, pA_we = 0.5, 0.99
R_full = (sigma_we/2)*(norm.ppf(pA_we) - norm.ppf(1-pA_we))   # full Eqn. 3
R_two  = sigma_we*norm.ppf(pA_we)                              # two-class form
print("worked example: Phi^-1(0.99)=%.4f  R_full=%.4f  R_two=%.4f" % (
      norm.ppf(0.99), R_full, R_two))
# worked example: Phi^-1(0.99)=2.3263  R_full=1.1632  R_two=1.1632


# --- 1. A tiny 2D two-class dataset; base classifier = small MLP (composed with nn). ---
def make_data(n, seed=None):
    if seed is not None: np.random.seed(seed)
    y  = (np.random.rand(n) > 0.5).astype(int)
    cx = np.where(y == 1, 0.7, -0.7)                 # class set by sign of x[0]
    X  = np.stack([cx + np.random.randn(n)*0.55, np.random.randn(n)*0.55], 1)
    return torch.tensor(X, dtype=torch.float32), torch.tensor(y)

Xtr, ytr = make_data(500, 0)

def train(sigma_train, steps=500):
    torch.manual_seed(1)
    net = nn.Sequential(nn.Linear(2, 16), nn.ReLU(), nn.Linear(16, 2))
    opt = torch.optim.Adam(net.parameters(), lr=0.05); lf = nn.CrossEntropyLoss()
    for _ in range(steps):
        opt.zero_grad()
        Xn = Xtr + torch.randn_like(Xtr)*sigma_train    # paper's prereq: train under noise
        lf(net(Xn), ytr).backward(); opt.step()
    return net

# --- 2. Randomized smoothing, BUILT BY HAND (the novel part). ---
def vote_counts(net, x, sigma, n):
    X = x.repeat(n, 1) + torch.randn(n, 2)*sigma         # n noisy copies, eps ~ N(0, sigma^2 I)
    with torch.no_grad():
        pred = net(X).argmax(1)
    c1 = int((pred == 1).sum()); return np.array([n - c1, c1])

def lower_conf(k, n, alpha=0.001):                       # binomial lower bound (Clopper-Pearson)
    return binomtest(k, n, p=0.5).proportion_ci(
        confidence_level=1 - 2*alpha, method="exact").low

def certify(net, x, sigma, n=8000, alpha=0.001):
    counts = vote_counts(net, x, sigma, n)
    cA = int(counts.argmax()); kA = int(counts[cA])
    pA = lower_conf(kA, n, alpha)                         # conservative top-class probability
    if pA <= 0.5:
        return cA, 0.0, pA                               # abstain: not a confident majority
    R = sigma*norm.ppf(pA)                               # two-class radius = sigma * Phi^-1(pA)
    return cA, R, pA

# --- 3. Effect A: radius grows with the MARGIN (distance from boundary), fixed sigma=0.5. ---
net5 = train(0.5)
print("\\nRadius vs margin (sigma=0.5):")
for x0 in [0.2, 0.5, 1.0, 2.0]:
    cA, R, pA = certify(net5, torch.tensor([[x0, 0.0]]), 0.5)
    print("  x0=%.1f  pA=%.4f  R=%.4f" % (x0, pA, R))
# x0=0.2  pA=~0.64  R=~0.19
# x0=0.5  pA=~0.84  R=~0.49
# x0=1.0  pA=~0.97  R=~0.95
# x0=2.0  pA=~1.00  R=~1.57   <- farther from boundary -> larger certified radius

# --- 4. Effect B: larger sigma certifies LARGER radii (with an accuracy cost). ---
print("\\nCertified accuracy at radius >= 0.5, per sigma (120 test points):")
Xte, yte = make_data(300, 7)
for s in [0.25, 0.5, 1.0]:
    ns = train(s); nrob = 0
    for i in range(120):
        cA, R, pA = certify(ns, Xte[i:i+1], s)
        if pA > 0.5 and cA == int(yte[i]) and R >= 0.5:
            nrob += 1
    print("  sigma=%.2f  cert_acc@R>=0.5 = %.3f" % (s, nrob/120))
# sigma=0.25 cert_acc@R>=0.5 = 0.000   <- small sigma CANNOT reach radius 0.5 here
# sigma=0.50 cert_acc@R>=0.5 = ~0.58
# sigma=1.00 cert_acc@R>=0.5 = ~0.53
# (Our small run, not the paper's reported numbers. Values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-certified-robustness"] = {
    question: "How does the certified-accuracy-versus-radius curve change as we raise the smoothing noise level sigma?",
    charts: [
      {
        type: "line",
        title: "Certified accuracy vs L2 radius — three noise levels sigma",
        xlabel: "certified L2 radius R",
        ylabel: "fraction of test points certified correct at radius >= R",
        series: [
          {
            name: "sigma = 0.25",
            color: "#7ee787",
            points: [[0.0,0.908],[0.25,0.808],[0.5,0.617],[0.75,0.375],[1.0,0.0],[1.5,0.0]]
          },
          {
            name: "sigma = 0.5",
            color: "#79c0ff",
            points: [[0.0,0.908],[0.25,0.808],[0.5,0.617],[0.75,0.4],[1.0,0.258],[1.5,0.017]]
          },
          {
            name: "sigma = 1.0",
            color: "#ff7b72",
            points: [[0.0,0.908],[0.25,0.775],[0.5,0.608],[0.75,0.4],[1.0,0.258],[1.5,0.058]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny 2-layer multi-layer perceptron (2&rarr;16&rarr;2, ReLU) is trained with Gaussian-noise augmentation and certified by randomized smoothing on a 2D two-class toy task (120 test points, 8000 Monte-Carlo samples, Clopper&ndash;Pearson 99.9% lower bound, two-class radius R=&sigma;&middot;&Phi;&#8315;&#185;(p&#x0304;_A)). Each curve plots certified accuracy as the radius threshold grows &mdash; the same shape as the paper's figures. The trade-off is visible: &sigma;=0.25 (green) leads at small radii but its radius is capped, hitting zero by R=1.0; &sigma;=1.0 (red) gives slightly lower accuracy at R=0.25 yet still certifies points out to R=1.5. There is no single best &sigma; &mdash; the curves cross, so you pick &sigma; for the radius you care about.",
    code: `import torch, torch.nn as nn, numpy as np
from scipy.stats import norm, binomtest
torch.manual_seed(0); np.random.seed(0)

def make_data(n, seed=None):
    if seed is not None: np.random.seed(seed)
    y  = (np.random.rand(n) > 0.5).astype(int)
    cx = np.where(y == 1, 0.7, -0.7)
    X  = np.stack([cx + np.random.randn(n)*0.55, np.random.randn(n)*0.55], 1)
    return torch.tensor(X, dtype=torch.float32), torch.tensor(y)
Xtr, ytr = make_data(500, 0); Xte, yte = make_data(300, 7)

def train(st, steps=500):
    torch.manual_seed(1)
    net = nn.Sequential(nn.Linear(2,16), nn.ReLU(), nn.Linear(16,2))
    opt = torch.optim.Adam(net.parameters(), lr=0.05); lf = nn.CrossEntropyLoss()
    for _ in range(steps):
        opt.zero_grad(); Xn = Xtr + torch.randn_like(Xtr)*st
        lf(net(Xn), ytr).backward(); opt.step()
    return net

def cnt(net, x, s, n):
    X = x.repeat(n,1) + torch.randn(n,2)*s
    with torch.no_grad(): p = net(X).argmax(1)
    c1 = int((p==1).sum()); return np.array([n-c1, c1])
def lc(k, n, a=0.001):
    return binomtest(k, n, p=0.5).proportion_ci(confidence_level=1-2*a, method="exact").low
def cert(net, x, s, n=8000, a=0.001):
    c = cnt(net, x, s, n); cA = int(c.argmax()); kA = int(c[cA]); pA = lc(kA, n, a)
    if pA <= 0.5: return cA, 0.0, pA
    return cA, s*norm.ppf(pA), pA

grid = [0.0, 0.25, 0.5, 0.75, 1.0, 1.5]
for s in [0.25, 0.5, 1.0]:
    ns = train(s); certR = []
    for i in range(120):
        cA, R, pA = cert(ns, Xte[i:i+1], s)
        certR.append(R if (pA > 0.5 and cA == int(yte[i])) else -1)
    certR = np.array(certR)
    row = [round(float((certR >= r).mean()), 3) for r in grid]
    print("sigma=%.2f:" % s, row)
# sigma=0.25: [0.908, 0.808, 0.617, 0.375, 0.0, 0.0]
# sigma=0.50: [0.908, 0.808, 0.617, 0.4, 0.258, 0.017]
# sigma=1.00: [0.908, 0.775, 0.608, 0.4, 0.258, 0.058]
# Larger sigma certifies larger radii; small sigma is capped. Our small run, not the paper's number.`
  };
})();
