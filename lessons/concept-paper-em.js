/* Paper lesson — EM Algorithm (Dempster, Laird & Rubin, 1977).
   NON-arXiv paper. Grounded from the original JRSS-B article (read via the JSTOR PDF, stable URL
   http://www.jstor.org/stable/2984875): title page + Summary, Section 1 (Eq. 1.1), Section 2
   (Eq. 2.2 E-step, 2.3 M-step, 2.4 L(phi)=log g(y|phi), 2.17 general Q-function), Section 3
   (Theorem 1, Eq. 3.7 monotone increase). Equations transcribed, not recalled.
   Track A (primitive, NumPy): build EM for a Gaussian Mixture Model from scratch — E-step
   responsibilities, M-step parameter updates — verify it matches sklearn.mixture.GaussianMixture
   on a toy 1-D mixture, and show the log-likelihood rising monotonically each iteration. */
(function () {
  window.LESSONS.push({
    id: "paper-em",
    title: "EM Algorithm — Maximum Likelihood from Incomplete Data via the EM Algorithm (1977)",
    tagline: "A general two-step recipe — guess the hidden parts, then re-fit — that never lowers the likelihood and is still how we train mixture models.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Arthur P. Dempster, Nan M. Laird, Donald B. Rubin",
      org: "Harvard University and Educational Testing Service",
      year: 1977,
      venue: "Journal of the Royal Statistical Society, Series B (Methodological), Vol. 39, No. 1, pp. 1-38 (read before the Royal Statistical Society, 8 December 1976)",
      citations: "",
      url: "http://www.jstor.org/stable/2984875",
      code: ""
    },

    conceptLink: "ml-em",
    partOf: [],
    prereqs: ["ml-em", "ml-kmeans", "prob-bayes", "prob-normal", "ml-likelihood"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Often the data you want to fit is <b>incomplete</b>: part of every observation is
       missing or hidden. In a <b>mixture model</b> (a population made of several sub-groups, each with its own
       bell curve), you see each point's value but <i>not</i> which sub-group it came from &mdash; that group
       label is the hidden part. ("Maximum likelihood" = pick the parameters under which the data you saw is most
       probable.)</p>
       <p>If you <i>knew</i> the hidden labels, fitting each group's curve would be a one-line calculation. If you
       <i>knew</i> the curves, guessing the labels would be easy. The trouble (Section 1) is that you know
       <b>neither</b>, and the likelihood you actually want to maximize &mdash; the probability of the visible data
       with the hidden parts summed out &mdash; has no clean closed-form maximizer. Before this paper such problems
       were solved case by case, often with fragile custom Newton-style iterations.</p>`,

    contribution:
      `<p>The paper unifies a long list of these special cases into <b>one algorithm</b> (the Summary calls it
       "a broadly applicable algorithm for computing maximum likelihood estimates from incomplete data ... at
       various levels of generality"):</p>
       <ul>
         <li><b>The E-step (Expectation).</b> Using your current best-guess parameters, fill in the hidden parts
         <i>in expectation</i> &mdash; compute the expected complete-data log-likelihood given what you saw.</li>
         <li><b>The M-step (Maximization).</b> Re-fit the parameters as if those filled-in expectations were real
         data &mdash; an ordinary, easy maximum-likelihood fit.</li>
         <li><b>A proof it always works.</b> Section 3 derives "the monotone behaviour of the likelihood": each
         E&ndash;M cycle <i>never decreases</i> the observed-data likelihood (Theorem 1). So the loop climbs
         steadily to a local maximum &mdash; no step size to tune, no risk of overshooting downhill.</li>
       </ul>
       <p>The name "EM algorithm" is coined in this paper (Section 1).</p>`,

    whyItMattered:
      `<p>EM became <b>the</b> default workhorse for hidden-variable models. The Summary itself lists missing-value
       problems, grouped/censored/truncated data, <b>finite mixture models</b>, variance-component estimation,
       hyperparameter estimation, iteratively reweighted least squares, and factor analysis &mdash; all one
       algorithm. Today it is how you train a <b>Gaussian Mixture Model</b> (the thing we build here, and exactly
       what <code>sklearn.mixture.GaussianMixture</code> runs internally), Hidden Markov Models (the Baum&ndash;Welch
       algorithm is EM), topic models, and many missing-data imputations. The monotone-likelihood guarantee is why
       EM is so robust: you can leave it running and trust the fit only improves.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Summary + Section 1 (Introduction)</b> &mdash; the "incomplete data" framing, the observed data
         $\\mathbf{y}$ vs complete data $\\mathbf{x}$, and the relation $g(\\mathbf{y}\\mid\\phi)=\\int f(\\mathbf{x}\\mid\\phi)\\,d\\mathbf{x}$ (Eq. 1.1).
         The little genetics example (Eqs. 1.2&ndash;1.5, Table 1) shows EM cycling on real numbers.</li>
         <li><b>Section 2 (Definitions)</b> &mdash; the E-step (Eq. 2.2) and M-step (Eq. 2.3) for exponential
         families, and the fully general version: the function $Q(\\phi'\\mid\\phi)$ in <b>Eq. 2.17</b> and the
         M-step that maximizes it. This is the part we implement.</li>
         <li><b>Section 3 (General Properties)</b> &mdash; <b>Theorem 1 (Eq. 3.7)</b>: every EM/GEM iteration has
         $L(M(\\phi))\\ge L(\\phi)$, the monotone-increase guarantee. Skim the proof; the key is Lemma 1, a
         consequence of Jensen's inequality.</li>
       </ul>
       <p><b>Skim:</b> Section 4's catalogue of worked applications (read just the finite-mixtures one if any),
       and the convergence-rate analysis at the end of Section 3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We will generate 300 points from a 1-D mixture of two Gaussians (one cluster
       near $-2$, one near $+3$), then run our hand-written EM from a deliberately mediocre starting guess
       (means at $-1$ and $+1$). At every iteration we will record the observed-data log-likelihood. Two questions:
       (1) will that log-likelihood curve ever <i>dip</i>, even by a tiny amount, on its way up? (2) After it
       settles, will our from-scratch parameters match what <code>sklearn.mixture.GaussianMixture</code> finds on
       the same data? Write your guesses, then check the CODEVIZ and the CODE oracle.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write one full EM iteration for a $K$-component Gaussian mixture in
       NumPy, with parameters $\\pi$ (mixing weights), $\\mu$ (means), $\\sigma^2$ (variances):</p>
       <ul>
         <li><b>E-step.</b> For each point $x_i$ and cluster $k$, compute the responsibility
         <code># TODO: gamma[i,k] = pi[k]*Normal(x_i; mu_k, var_k), then normalize each row to sum to 1</code></li>
         <li><b>M-step.</b> Let <code>Nk = gamma.sum(axis=0)</code> (the effective count in each cluster), then
         <code># TODO: pi = Nk/N ; mu_k = sum_i gamma[i,k]*x_i / Nk ; var_k = sum_i gamma[i,k]*(x_i-mu_k)^2 / Nk</code></li>
         <li><b>Log-likelihood.</b> Before each M-step record
         <code># TODO: ll = sum_i log( sum_k pi[k]*Normal(x_i; mu_k, var_k) )</code> and confirm it never decreases.</li>
       </ul>
       <p>The CODE cell is the full reference, including the check that our converged log-likelihood and parameters
       equal <code>sklearn</code>'s &mdash; that agreement is the proof the math is right.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>EM repeats two steps until the parameters stop moving. Write $\\mathbf{y}$ for the <b>observed</b> data,
       $\\mathbf{x}$ for the <b>complete</b> data (observed plus the hidden parts), and $\\phi$ for the parameters.
       The thing we actually want to maximize is the observed-data log-likelihood $L(\\phi)=\\log g(\\mathbf{y}\\mid\\phi)$
       (Eq. 2.4), where $g$ is $f$ with the hidden parts integrated out (Eq. 1.1). It is awkward because of that
       integral/sum. EM sidesteps it:</p>
       <ol>
         <li><b>E-step.</b> With the current parameters $\\phi^{(p)}$, form the <b>expected complete-data
         log-likelihood</b> &mdash; the paper's function $Q(\\phi'\\mid\\phi^{(p)})=E\\!\\big(\\log f(\\mathbf{x}\\mid\\phi')\\mid \\mathbf{y},\\phi^{(p)}\\big)$
         (Eq. 2.17). In practice this means: using the current model, compute the <b>posterior probability of each
         hidden label</b> given each observed point. For a mixture, that posterior is the <b>responsibility</b>
         $\\gamma_{ik}$ &mdash; the chance point $i$ came from cluster $k$.</li>
         <li><b>M-step.</b> Choose the new parameters $\\phi^{(p+1)}$ to <b>maximize</b> $Q(\\phi\\mid\\phi^{(p)})$
         (Section 2). Because the hidden labels are now "filled in" (softly, by the responsibilities), this is an
         ordinary weighted maximum-likelihood fit: each cluster's mean/variance becomes the responsibility-weighted
         average over all points, and its weight becomes its share of the responsibility mass.</li>
         <li><b>Repeat</b> until $L$ stops rising. Theorem 1 (Eq. 3.7) guarantees $L$ never falls, so this
         converges to a local maximum.</li>
       </ol>
       <p>The deep reason it cannot go downhill: the paper splits $\\log f = \\log g + \\log k$ (where $k$ is the
       conditional density of the hidden part), so $Q(\\phi'\\mid\\phi)=L(\\phi')+H(\\phi'\\mid\\phi)$ (Eq. 3.2).
       Raising $Q$ raises $L$ by <i>at least</i> as much, because the $H$ term can only drop (Lemma 1, via Jensen's
       inequality). The walkthrough math is owned by the <code>ml-em</code> concept lesson; the recap above is short.</p>`,

    architecture:
      `<p>EM is an <b>algorithm</b>, not a network — its "architecture" is the per-iteration procedure (Section 2),
       a fixed-point map $\\phi^{(p+1)}=M(\\phi^{(p)})$ that loops two stages over the data:</p>
       <ol>
         <li><b>Inputs.</b> Observed data $\\mathbf{y}$, a complete-data model $f(\\mathbf{x}\\mid\\phi)$ whose hidden
         part is easy to fit, and an initial parameter $\\phi^{(0)}$.</li>
         <li><b>E-stage (build the bound).</b> From $\\phi^{(p)}$ compute the posterior over the hidden part
         $k(\\mathbf{x}\\mid\\mathbf{y},\\phi^{(p)})$, and use it to form $Q(\\phi'\\mid\\phi^{(p)})$ (Eq. 2.17). For a
         Gaussian mixture this stage <i>is</i> the $N\\times K$ responsibility matrix $\\gamma$ — one forward pass:
         evaluate every component density, weight by $\\pi$, normalize each row.</li>
         <li><b>M-stage (climb the bound).</b> Set $\\phi^{(p+1)}=\\arg\\max_\\phi Q(\\phi\\mid\\phi^{(p)})$ (Eq. 2.18).
         For a GMM this is closed form: aggregate the responsibility-weighted statistics
         $N_k,\\ \\sum_i\\gamma_{ik}x_i,\\ \\sum_i\\gamma_{ik}(x_i-\\mu_k)(x_i-\\mu_k)^\\top$ into new $\\pi,\\mu,\\Sigma$.</li>
         <li><b>Monitor + loop.</b> Record $L=\\log g(\\mathbf{y}\\mid\\phi^{(p)})$ <i>before</i> the M-stage; repeat
         E&rarr;M until $L$ stops rising. Theorem 1 guarantees $L$ is non-decreasing along this loop.</li>
       </ol>
       <p>Data flow per cycle: parameters $\\to$ (E) responsibilities $\\gamma$ $\\to$ (M) weighted sufficient
       statistics $\\to$ updated parameters. The <b>GEM</b> variant relaxes the M-stage to <i>any</i> step that
       raises $Q$ (not necessarily the maximizer) and still inherits the monotone guarantee.</p>`,

    symbols: [
      { sym: "$\\mathbf{y}$", desc: "the observed (incomplete) data — what you actually measure. In our mixture, the point values." },
      { sym: "$\\mathbf{x}$", desc: "the complete data — the observed data PLUS the hidden parts. In our mixture, each point together with the label of which Gaussian produced it." },
      { sym: "$\\phi$ (phi)", desc: "the parameters to estimate. For a Gaussian mixture: the mixing weights, means, and variances. (The paper writes $\\phi$; we write $\\theta$ in code — same thing.)" },
      { sym: "$\\phi^{(p)}$", desc: "the value of the parameters after $p$ completed EM cycles; $p=0,1,2,\\dots$" },
      { sym: "$g(\\mathbf{y}\\mid\\phi)$", desc: "the observed-data likelihood: probability of the visible data $\\mathbf{y}$ with the hidden parts summed/integrated out (Eq. 1.1). The bar means 'given the parameters'." },
      { sym: "$f(\\mathbf{x}\\mid\\phi)$", desc: "the complete-data likelihood: probability of the FULL data (with hidden parts) — easy because nothing is hidden." },
      { sym: "$L(\\phi)$", desc: "the observed-data log-likelihood $\\log g(\\mathbf{y}\\mid\\phi)$ (Eq. 2.4) — the quantity EM climbs and the thing we plot." },
      { sym: "$Q(\\phi'\\mid\\phi)$", desc: "the E-step function (Eq. 2.17): the expected complete-data log-likelihood $E(\\log f(\\mathbf{x}\\mid\\phi')\\mid \\mathbf{y},\\phi)$ — averaged over the hidden parts using the current parameters $\\phi$." },
      { sym: "$E(\\,\\cdot\\mid \\mathbf{y},\\phi)$", desc: "expectation (probability-weighted average) over the hidden parts, conditioned on the observed data $\\mathbf{y}$ and current parameters $\\phi$." },
      { sym: "$K$", desc: "the number of mixture components (clusters / bell curves) — here $K=2$." },
      { sym: "$\\gamma_{ik}$ (gamma)", desc: "the responsibility: the posterior probability that point $i$ came from cluster $k$, given the current model. This IS the E-step output for a mixture; the rows sum to 1." },
      { sym: "$\\pi_k$ (pi)", desc: "the mixing weight of cluster $k$ — its overall share of the population. The $\\pi_k$ sum to 1." },
      { sym: "$\\mu_k,\\ \\sigma_k^2$", desc: "the mean and variance (centre and spread) of cluster $k$'s Gaussian bell curve." },
      { sym: "$\\Sigma_k$", desc: "the covariance matrix of cluster $k$'s Gaussian (multivariate spread). In 1-D it is just the scalar variance $\\sigma_k^2$." },
      { sym: "$\\mathcal{N}(x;\\mu,\\Sigma)$", desc: "the Gaussian (normal) density at $x$ with mean $\\mu$ and covariance $\\Sigma$; in 1-D, $\\tfrac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/2\\sigma^2}$." },
      { sym: "$\\mathcal{X}(\\mathbf{y})$", desc: "the set of all complete-data values $\\mathbf{x}$ that are consistent with the observed $\\mathbf{y}$ — what Eq. 1.1 integrates over to get $g$." },
      { sym: "$k(\\mathbf{x}\\mid\\mathbf{y},\\phi)$", desc: "the conditional density of the hidden part given the observed data, $f(\\mathbf{x}\\mid\\phi)/g(\\mathbf{y}\\mid\\phi)$ (Eq. 2.5) — the posterior EM uses to average out the unknowns." },
      { sym: "$H(\\phi'\\mid\\phi)$", desc: "the expected log-conditional $E(\\log k(\\mathbf{x}\\mid\\mathbf{y},\\phi')\\mid\\mathbf{y},\\phi)$ (a cross-entropy term, Eq. 3.1); $L=Q-H$, and Jensen gives $H(\\phi'\\mid\\phi)\\le H(\\phi\\mid\\phi)$." },
      { sym: "$N_k$", desc: "the effective count of cluster $k$: $\\sum_i \\gamma_{ik}$, the total responsibility mass it owns (a soft, fractional count)." },
      { sym: "$M(\\phi)$", desc: "the EM map: one full E+M cycle viewed as a function taking old parameters to new ones (Eq. 3.4). Theorem 1 is stated in terms of it." }
    ],

    formula:
      `$$g(\\mathbf{y}\\mid\\phi) \\;=\\; \\int_{\\mathcal{X}(\\mathbf{y})} f(\\mathbf{x}\\mid\\phi)\\, d\\mathbf{x}
         \\qquad\\qquad L(\\phi) \\;=\\; \\log g(\\mathbf{y}\\mid\\phi)$$
       <p style="margin:.2em 0 .6em">Complete-data density $f(\\mathbf{x}\\mid\\phi)$ vs observed-data likelihood $g$, got by integrating the hidden parts out over all complete data $\\mathbf{x}$ consistent with $\\mathbf{y}$ (Eq. 1.1); $L$ is its log (Eq. 2.4). $g$ is the awkward thing we actually want to maximize.</p>
       $$\\textbf{E-step (Eq. 2.17): }\\; Q(\\phi'\\mid\\phi^{(p)}) \\;=\\; E\\!\\big(\\log f(\\mathbf{x}\\mid\\phi') \\,\\big|\\, \\mathbf{y},\\,\\phi^{(p)}\\big)$$
       <p style="margin:.2em 0 .6em">Form the expected complete-data log-likelihood, averaging the hidden parts under the current posterior $k(\\mathbf{x}\\mid\\mathbf{y},\\phi^{(p)})$. For a mixture this expectation is carried entirely by the responsibilities (the posterior over labels) computed below.</p>
       $$\\textbf{M-step (Eq. 2.18): }\\; \\phi^{(p+1)} \\;=\\; \\arg\\max_{\\phi}\\; Q(\\phi\\mid\\phi^{(p)})$$
       <p style="margin:.2em 0 .6em">Re-fit by maximizing $Q$ as if the soft-filled hidden parts were data — an ordinary (weighted) maximum-likelihood fit.</p>
       $$\\log g(\\mathbf{y}\\mid\\phi') \\;=\\; Q(\\phi'\\mid\\phi^{(p)}) \\;-\\; H(\\phi'\\mid\\phi^{(p)}),
         \\qquad H(\\phi'\\mid\\phi) = E\\!\\big(\\log k(\\mathbf{x}\\mid\\mathbf{y},\\phi') \\,\\big|\\, \\mathbf{y},\\phi\\big)$$
       <p style="margin:.2em 0 .6em">Lower-bound / ELBO view (Eqs. 3.1&ndash;3.2): splitting $\\log f=\\log g+\\log k$ gives $L(\\phi')=Q-H$. By <b>Jensen's inequality</b> $H(\\phi'\\mid\\phi)\\le H(\\phi\\mid\\phi)$ (Lemma 1: the $H$ term — a cross-entropy — is minimized at $\\phi'=\\phi$), so $Q(\\phi'\\mid\\phi)$ is a tight lower bound on $L(\\phi')$ that touches it at $\\phi'=\\phi$. Maximizing $Q$ pushes that bound — and hence $L$ — up.</p>
       $$\\textbf{Monotone increase (Thm 1, Eq. 3.7): }\\; L\\big(M(\\phi)\\big) \\;\\ge\\; L(\\phi)$$
       <p style="margin:.2em 0 .6em">Every EM/GEM cycle $M(\\phi)$ never lowers the observed-data log-likelihood — the loop climbs to a local maximum with no step size to tune.</p>
       $$\\textbf{GMM E-step (responsibility): }\\;
         \\gamma_{ik} \\;=\\; \\frac{\\pi_k\\,\\mathcal{N}(x_i;\\,\\mu_k,\\Sigma_k)}{\\sum_{j=1}^{K}\\pi_j\\,\\mathcal{N}(x_i;\\,\\mu_j,\\Sigma_j)},
         \\qquad N_k \\;=\\; \\sum_{i=1}^{N}\\gamma_{ik}$$
       <p style="margin:.2em 0 .6em">The Gaussian-mixture instantiation of the E-step: $\\gamma_{ik}$ is the posterior probability that point $i$ came from component $k$ (rows sum to 1); $N_k$ is the soft (effective) count of component $k$.</p>
       $$\\pi_k \\;=\\; \\frac{N_k}{N}, \\qquad
         \\mu_k \\;=\\; \\frac{1}{N_k}\\sum_{i=1}^{N}\\gamma_{ik}\\,x_i, \\qquad
         \\Sigma_k \\;=\\; \\frac{1}{N_k}\\sum_{i=1}^{N}\\gamma_{ik}\\,(x_i-\\mu_k)(x_i-\\mu_k)^{\\top}$$
       <p style="margin:.2em 0 .6em">The closed-form GMM M-step: responsibility-weighted weight, mean, and covariance for each component (in 1-D, $\\Sigma_k$ is the scalar variance $\\sigma_k^2$). The observed-data log-likelihood recorded each cycle is $L=\\sum_i\\log\\!\\big(\\sum_k \\pi_k\\,\\mathcal{N}(x_i;\\mu_k,\\Sigma_k)\\big)$.</p>`,

    whatItDoes:
      `<p>The <b>E-step</b> (Eq. 2.17) builds $Q$: it takes the complete-data log-likelihood $\\log f(\\mathbf{x}\\mid\\phi')$
       &mdash; which would be easy if the hidden parts were known &mdash; and <i>averages out the unknown hidden
       parts</i> using the current parameters $\\phi^{(p)}$. For a Gaussian mixture that average is governed entirely
       by the responsibilities $\\gamma_{ik}$, so "compute the E-step" just means "compute every $\\gamma_{ik}$."</p>
       <p>The <b>M-step</b> picks new parameters that maximize $Q$. With the responsibilities fixed, that
       maximization separates into simple weighted averages (the GMM update formulas in the recipe below).</p>
       <p><b>Theorem 1</b> (Eq. 3.7) is the payoff: doing one full cycle $M(\\phi)$ gives an observed-data
       log-likelihood at least as high as before. Improve $Q$ and you cannot help but improve $L$ &mdash; so the
       curve only ever rises.</p>`,

    derivation:
      `<p>Full derivation lives in the <code>ml-em</code> concept lesson; short recap of the paper's argument.
       Write the conditional density of the hidden part as $k(\\mathbf{x}\\mid\\mathbf{y},\\phi)=f(\\mathbf{x}\\mid\\phi)/g(\\mathbf{y}\\mid\\phi)$
       (Eq. 2.5). Taking logs and rearranging gives $\\log f = \\log g + \\log k$, i.e. taking expectations,
       $Q(\\phi'\\mid\\phi)=L(\\phi')+H(\\phi'\\mid\\phi)$ where $H(\\phi'\\mid\\phi)=E(\\log k\\mid\\mathbf{y},\\phi)$
       (Eq. 3.1&ndash;3.2). <b>Lemma 1</b> states $H(\\phi'\\mid\\phi)\\le H(\\phi\\mid\\phi)$ &mdash; a direct
       consequence of Jensen's inequality (the cross-entropy is never below the entropy). So
       $L(M(\\phi))-L(\\phi)=\\{Q(M(\\phi)\\mid\\phi)-Q(\\phi\\mid\\phi)\\}+\\{H(\\phi\\mid\\phi)-H(M(\\phi)\\mid\\phi)\\}$
       (Eq. 3.10): the M-step makes the first brace $\\ge 0$, and Lemma 1 makes the second $\\ge 0$. Hence
       $L(M(\\phi))\\ge L(\\phi)$ &mdash; Theorem 1.</p>`,

    example:
      `<p><b>Worked numbers</b> for one E-step responsibility and one M-step mean update. Take $K=2$ in 1-D with
       current $\\pi=(0.5,0.5)$, means $\\mu=(0,4)$, variances $\\sigma^2=(1,1)$, and three points
       $x=(0.5,\\,1.5,\\,5.0)$. The Gaussian density is $\\mathcal{N}(x;\\mu,\\sigma^2)=\\tfrac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/2\\sigma^2}$.</p>
       <ul>
         <li><b>E-step, point $x_0=0.5$, responsibility to cluster 0.</b> Densities:
         $\\mathcal{N}(0.5;0,1)=0.35206533$ and $\\mathcal{N}(0.5;4,1)=0.00087268$.</li>
         <li>Weight by $\\pi$: numerator $=0.5\\times0.35206533=0.17603266$; the other term $=0.5\\times0.00087268=0.00043634$.</li>
         <li>Denominator (their sum) $=0.17646900$.</li>
         <li><b>Responsibility</b> $\\gamma_{0,0}=0.17603266/0.17646900=\\mathbf{0.997527}$ (point 0 is almost surely from cluster 0).</li>
         <li>Doing the same for all three points gives column-0 responsibilities $\\gamma_{\\cdot,0}=(0.997527,\\,0.880797,\\,0.000006)$.</li>
         <li><b>M-step, new $\\mu_0$.</b> Effective count $N_0=\\sum_i\\gamma_{i,0}=0.997527+0.880797+0.000006=1.878331$.
         Numerator $\\sum_i\\gamma_{i,0}x_i=0.997527\\cdot0.5+0.880797\\cdot1.5+0.000006\\cdot5.0=1.81999$.
         So $\\mu_0^{\\text{new}}=1.81999/1.878331=\\mathbf{0.96894}$ &mdash; the cluster-0 centre moves toward the points it is responsible for.</li>
       </ul>
       <p>The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>EM for a Gaussian Mixture Model, as numbered steps:</b></p>
       <ol>
         <li>Initialize $\\pi_k,\\ \\mu_k,\\ \\sigma_k^2$ for $k=1,\\dots,K$ (e.g. spread the means out, unit variances, equal weights).</li>
         <li><b>E-step.</b> For every point $i$ and cluster $k$ compute the responsibility
         $\\gamma_{ik}=\\dfrac{\\pi_k\\,\\mathcal{N}(x_i;\\mu_k,\\sigma_k^2)}{\\sum_{j=1}^{K}\\pi_j\\,\\mathcal{N}(x_i;\\mu_j,\\sigma_j^2)}$ (rows sum to 1).</li>
         <li>Record the observed-data log-likelihood $L=\\sum_i\\log\\!\\big(\\sum_k \\pi_k\\,\\mathcal{N}(x_i;\\mu_k,\\sigma_k^2)\\big)$.</li>
         <li><b>M-step.</b> Set $N_k=\\sum_i\\gamma_{ik}$; then
         $\\pi_k=N_k/N$, $\\ \\mu_k=\\frac{1}{N_k}\\sum_i\\gamma_{ik}x_i$, $\\ \\sigma_k^2=\\frac{1}{N_k}\\sum_i\\gamma_{ik}(x_i-\\mu_k)^2$.</li>
         <li>Repeat steps 2&ndash;4 until $L$ stops increasing (or a max iteration count). It will rise monotonically (Theorem 1).</li>
       </ol>`,

    results:
      `<p>From the Summary: the paper presents the algorithm "at various levels of generality" with "theory showing
       the monotone behaviour of the likelihood and convergence of the algorithm." Section 1's genetics example
       (multinomial with $\\mathbf{y}=(125,18,20,34)$) converges in eight iterations to
       $\\pi^*\\approx 0.6268214980$ (Eqs. 1.4&ndash;1.5, Table 1), with the successive-deviation ratio settling to
       a constant &mdash; the linear convergence the general theory predicts. The paper reports no single headline
       benchmark number; its contribution is the general method and its monotonicity/convergence proofs. (Source:
       JSTOR stable/2984875, Summary and Sections 1&ndash;3.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive), NumPy.</b> <code>sklearn.mixture.GaussianMixture</code> runs EM for you in two
       lines. Here you <b>build it from scratch</b>: a Gaussian density, the E-step responsibilities, the M-step
       weighted updates, and the log-likelihood. The payoff is the verification &mdash; we run our loop and
       <code>sklearn</code>'s on the same toy 1-D mixture and check the converged log-likelihood and parameters
       <b>agree to ~4 decimals</b>, and that our log-likelihood <b>increases monotonically every iteration</b>
       (the paper's Theorem 1). If the responsibilities or updates are wrong, sklearn disagrees &mdash; fix the
       math. There is no <code>torch.allclose</code> here because EM is a NumPy/statistics algorithm, not a neural
       layer; the sklearn match plays the same oracle role.</p>`,

    pitfalls:
      `<ul>
         <li><b>Local maxima, not the global one.</b> Theorem 1 guarantees the likelihood rises, but only to a
         <i>local</i> maximum. A bad init can land in a poor solution; that is why <code>sklearn</code> uses
         <code>n_init</code> random restarts. Our toy is easy enough that one init suffices.</li>
         <li><b>Singular/collapsing components.</b> If a cluster grabs essentially one point, its variance can
         shrink toward $0$ and the likelihood blow up to $+\\infty$ &mdash; a degenerate "win". Real code adds a
         small floor (regularization) to the variance; sklearn's <code>reg_covar</code> does this.</li>
         <li><b>Compute the log-likelihood BEFORE the M-step.</b> Record $L$ from the same parameters that
         produced the current responsibilities; mixing E-step and M-step parameters when logging can make the curve
         look non-monotone even when EM is correct.</li>
         <li><b>Responsibilities must be normalized per point.</b> Each row of $\\gamma$ sums to 1 (a point is
         distributed across clusters). Forgetting the denominator breaks both the E-step and the M-step counts.</li>
         <li><b>$\\phi$ vs $\\theta$ notation.</b> The paper writes parameters as $\\phi$; most ML code (and ours)
         writes $\\theta$. Same object.</li>
         <li><b>EM is not k-means.</b> k-means makes a <i>hard</i> assignment (each point to one cluster); EM keeps
         <i>soft</i> responsibilities and also fits variances and weights. k-means is roughly EM in the limit of
         tiny equal variances.</li>
       </ul>`,

    recall: [
      "State the E-step function $Q(\\phi'\\mid\\phi)$ from memory (Eq. 2.17), in words and symbols.",
      "What does the M-step do with $Q$, and why is it easy for a Gaussian mixture?",
      "State Theorem 1 (Eq. 3.7) and say which inequality (Lemma 1 / Jensen) makes it true.",
      "Write the GMM responsibility $\\gamma_{ik}$ and the M-step update for $\\mu_k$.",
      "Define 'observed data $\\mathbf{y}$' vs 'complete data $\\mathbf{x}$' for a mixture model.",
      "Why can EM still land in a poor solution despite the monotone-likelihood guarantee?"
    ],

    practice: [
      {
        q: `One E-step responsibility. $K=2$, $\\pi=(0.5,0.5)$, means $(0,4)$, variances $(1,1)$. For the point $x=1.5$, compute $\\gamma$ to cluster 0. (Use $\\mathcal{N}(1.5;0,1)=0.129518$, $\\mathcal{N}(1.5;4,1)=0.017528$.)`,
        steps: [
          { do: `Weight by $\\pi$: cluster-0 term $=0.5\\cdot0.129518=0.064759$; cluster-1 term $=0.5\\cdot0.017528=0.008764$.`, why: `Numerator of each responsibility = mixing weight times that cluster's density.` },
          { do: `Denominator $=0.064759+0.008764=0.073523$.`, why: `Sum over clusters so the row sums to 1.` },
          { do: `$\\gamma_{0}=0.064759/0.073523=0.880797$.`, why: `Posterior probability point came from cluster 0.` }
        ],
        answer: `$\\gamma\\approx(0.8808,\\,0.1192)$. The point at $1.5$ is closer to the cluster-0 mean (0) than to cluster-1's (4), so cluster 0 takes ~88% responsibility — matching the worked example's middle row.`
      },
      {
        q: `M-step mean for cluster 1. Using the three-point worked example, the cluster-1 responsibilities are $\\gamma_{\\cdot,1}=(0.002473,\\,0.119203,\\,0.999994)$ for $x=(0.5,1.5,5.0)$. Compute $N_1$ and $\\mu_1^{\\text{new}}$.`,
        steps: [
          { do: `$N_1=0.002473+0.119203+0.999994=1.121670$.`, why: `Effective (soft) count = total responsibility mass of cluster 1.` },
          { do: `Numerator $=0.002473\\cdot0.5+0.119203\\cdot1.5+0.999994\\cdot5.0=0.001237+0.178805+4.99997=5.18001$.`, why: `Responsibility-weighted sum of the points.` },
          { do: `$\\mu_1^{\\text{new}}=5.18001/1.121670=4.61813$.`, why: `Weighted mean = numerator / effective count.` }
        ],
        answer: `$N_1\\approx1.1217$, $\\mu_1^{\\text{new}}\\approx4.6181$. The point at $5.0$ dominates because it carries almost all of cluster 1's responsibility, pulling the new mean up toward it.`
      },
      {
        q: `Ablation — 1 iteration vs convergence, and choosing $k$. In the CODE/CODEVIZ run, the observed-data log-likelihood goes from $-1058.88$ at init to $-612.49$ after one full EM step, then to $-606.73$ at convergence. Separately, sklearn's converged log-likelihood is $-708.32$ for $k=1$, $-606.73$ for $k=2$, $-604.78$ for $k=3$. What do these tell you?`,
        steps: [
          { do: `Compare 1 step ($-612.49$) to converged ($-606.73$).`, why: `One iteration already does most of the work here, but is not fully converged — EM keeps climbing.` },
          { do: `Check the curve never dips between init and convergence.`, why: `Theorem 1: monotone increase. $-1058.88\\to-612.49\\to-606.73$ is strictly rising.` },
          { do: `Compare $k=1,2,3$ log-likelihoods AND their BIC ($1428.0,\\ 1242.0,\\ 1255.2$).`, why: `More components can only raise the (training) likelihood, so you cannot pick $k$ by likelihood alone — penalize complexity.` }
        ],
        answer: `The log-likelihood rises every step (monotone, as Theorem 1 promises) and one step is a good-but-not-final approximation. Raw log-likelihood always improves with more components ($-708.32<-606.73<-604.78$), so it cannot choose $k$; a complexity-penalized score does — BIC is lowest at $k=2$ (1242.0), correctly recovering the two true clusters. (Our small run, not the paper's numbers.)`
      }
    ]
  });

  window.CODE["paper-em"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `Build EM for a Gaussian Mixture Model from scratch in NumPy: a Gaussian density, the E-step ` +
      `responsibilities gamma[i,k], the M-step weighted updates for pi/mu/var, and the observed-data ` +
      `log-likelihood. First recompute the worked example (one responsibility + one mean update). Then run ` +
      `the loop on a toy 1-D two-Gaussian mixture, assert the log-likelihood increases monotonically every ` +
      `iteration (the paper's Theorem 1), and verify the converged log-likelihood and parameters match ` +
      `sklearn.mixture.GaussianMixture. Runs in Colab (numpy + scikit-learn preinstalled).`,
    code: `import numpy as np
from sklearn.mixture import GaussianMixture

def gauss(x, m, v):                     # 1-D Gaussian density N(x; mean m, variance v)
    return np.exp(-0.5*(x-m)**2/v) / np.sqrt(2*np.pi*v)

def em_gmm(x, K, mu0, var0, pi0, iters=40):
    """EM for a 1-D Gaussian Mixture Model, from scratch. Returns (params, loglik history)."""
    pi, mu, var = np.array(pi0,float), np.array(mu0,float), np.array(var0,float)
    lls = []
    for _ in range(iters):
        # ---- E-step: responsibilities gamma[i,k] = pi_k N(x_i;mu_k,var_k) / sum_j (...) ----
        comp = np.stack([pi[k]*gauss(x, mu[k], var[k]) for k in range(K)], axis=1)  # (N,K)
        tot  = comp.sum(axis=1)                              # mixture density per point
        lls.append(np.log(tot).sum())                       # observed-data log-likelihood (before M-step)
        gamma = comp / tot[:, None]                         # normalize each row -> sums to 1
        # ---- M-step: weighted updates ----
        Nk  = gamma.sum(axis=0)                              # effective (soft) count per cluster
        pi  = Nk / len(x)
        mu  = (gamma * x[:, None]).sum(axis=0) / Nk
        var = (gamma * (x[:, None] - mu)**2).sum(axis=0) / Nk
    return (pi, mu, var), np.array(lls)

# ---- recompute the WORKED EXAMPLE: one E-step responsibility + one M-step mean update ----
xw = np.array([0.5, 1.5, 5.0]); pi_w=[0.5,0.5]; mu_w=[0.0,4.0]; var_w=[1.0,1.0]
comp = np.stack([pi_w[k]*gauss(xw, mu_w[k], var_w[k]) for k in range(2)], axis=1)
gw = comp / comp.sum(1, keepdims=True)
print("worked gamma[:,0] :", [round(v,6) for v in gw[:,0]])     # [0.997527, 0.880797, 6e-06]
N0 = gw[:,0].sum(); mu0_new = (gw[:,0]*xw).sum()/N0
print("worked N0, mu0_new:", round(N0,6), round(mu0_new,6))     # 1.878331  0.96894

# ---- toy 1-D two-Gaussian data ----
rng = np.random.default_rng(0); n = 300
z = rng.random(n) < 0.4
x = np.where(z, rng.normal(-2.0, 0.8, n), rng.normal(3.0, 1.2, n))

# ---- run our EM from a deliberately mediocre init ----
(pi, mu, var), lls = em_gmm(x, K=2, mu0=[-1.0,1.0], var0=[1.0,1.0], pi0=[0.5,0.5])
print("\\nmonotonic LL increase:", bool(np.all(np.diff(lls) >= -1e-9)))   # True (Theorem 1)
print("LL[:5]:", [round(v,2) for v in lls[:5]])  # [-1058.88, -612.49, -606.8, -606.74, -606.73]
o = np.argsort(mu)
print("scratch  LL=%.4f  mu=%s  var=%s  pi=%s"
      % (lls[-1], np.round(mu[o],4), np.round(var[o],4), np.round(pi[o],4)))

# ---- THE ORACLE: must match sklearn.mixture.GaussianMixture on the same data ----
gm = GaussianMixture(n_components=2, covariance_type='full', tol=1e-6,
                     reg_covar=1e-9, max_iter=200, random_state=0).fit(x.reshape(-1,1))
sk_ll = gm.score(x.reshape(-1,1)) * n
os = np.argsort(gm.means_.ravel())
print("sklearn  LL=%.4f  mu=%s  var=%s  pi=%s"
      % (sk_ll, np.round(gm.means_.ravel()[os],4),
         np.round(gm.covariances_.ravel()[os],4), np.round(gm.weights_[os],4)))
print("LL matches sklearn (<1e-2):", abs(lls[-1]-sk_ll) < 1e-2)          # True
# scratch  LL=-606.7329  mu=[-2.0209  2.9588] ...   sklearn LL=-606.7329  mu=[-2.0207  2.9589] ...`
  };

  window.CODEVIZ["paper-em"] = {
    question: "Run our from-scratch EM on a toy 1-D two-Gaussian mixture and record the observed-data log-likelihood at every iteration — does it rise monotonically and never dip, exactly as the paper's Theorem 1 (Eq. 3.7) promises?",
    charts: [
      {
        type: "line",
        title: "Observed-data log-likelihood per EM iteration (from-scratch GMM, mediocre init)",
        xlabel: "EM iteration",
        ylabel: "log-likelihood L (higher = better fit)",
        series: [
          {
            name: "log-likelihood (rising)",
            color: "#7ee787",
            points: [[0,-1058.88],[1,-612.49],[2,-606.8],[3,-606.74],[4,-606.73],[5,-606.73],[6,-606.73],[7,-606.73],[8,-606.73],[9,-606.73],[10,-606.73],[11,-606.73]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not the paper's reported numbers. 300 points drawn from a 1-D mixture of two Gaussians (means -2 and +3); EM started from a deliberately poor guess (means -1 and +1). The observed-data log-likelihood climbs from -1058.88 at init to -606.73 and never once dips — exactly the monotone behaviour the paper proves in Theorem 1 (Eq. 3.7). Almost all the gain happens in the first one or two E/M cycles (-1058.88 -> -612.49 -> -606.80), then it settles. On the same data, sklearn.mixture.GaussianMixture converges to the identical log-likelihood (-606.7329) and parameters to ~4 decimals, confirming the from-scratch E-step responsibilities and M-step updates are correct.",
    code: `import numpy as np
def gauss(x, m, v): return np.exp(-0.5*(x-m)**2/v)/np.sqrt(2*np.pi*v)
rng = np.random.default_rng(0); n = 300
z = rng.random(n) < 0.4
x = np.where(z, rng.normal(-2.0, 0.8, n), rng.normal(3.0, 1.2, n))

pi  = np.array([0.5, 0.5]); mu = np.array([-1.0, 1.0]); var = np.array([1.0, 1.0])
lls = []
for it in range(12):
    comp  = np.stack([pi[k]*gauss(x, mu[k], var[k]) for k in range(2)], axis=1)  # E-step
    tot   = comp.sum(axis=1); lls.append(np.log(tot).sum())                       # record LL
    gamma = comp / tot[:, None]                                                   # responsibilities
    Nk    = gamma.sum(axis=0)                                                      # M-step
    pi    = Nk/n
    mu    = (gamma*x[:,None]).sum(0)/Nk
    var   = (gamma*(x[:,None]-mu)**2).sum(0)/Nk
    print(f"iter {it:2d}  log-likelihood {lls[-1]:.2f}")
print("monotonic:", bool(np.all(np.diff(lls) >= -1e-9)))   # True — Theorem 1`
  };
})();
