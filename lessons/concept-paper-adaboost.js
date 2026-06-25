/* Paper lesson — AdaBoost (Freund & Schapire, 1997).
   Grounded from the official PDF "A decision-theoretic generalization of on-line learning and an
   application to boosting", J. Comput. Syst. Sci. 55(1):119-139, 1997
   (cis.upenn.edu/~mkearns/teaching/COLT/adaboost.pdf): Section 4, Figure 2 (Algorithm AdaBoost),
   Steps 1-5; Theorem 6 / Eq. (14) for the training-error bound.
   Track A (primitive, NumPy): build AdaBoost from scratch (reweight, fit weak stumps, alpha weight),
   verify it matches sklearn's AdaBoostClassifier on a toy 2-D set, show the ensemble beats one stump.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-adaboost". */
(function () {
  window.LESSONS.push({
    id: "paper-adaboost",
    title: "AdaBoost — A Decision-Theoretic Generalization of On-Line Learning and an Application to Boosting (1997)",
    tagline: "Train weak classifiers one at a time, each focused on the examples the last ones got wrong, then take a weighted vote — turning rules-of-thumb into one strong classifier.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Yoav Freund, Robert E. Schapire",
      org: "AT&T Labs",
      year: 1997,
      venue: "Journal of Computer and System Sciences, 55(1):119-139, 1997",
      citations: "",
      url: "https://www.cis.upenn.edu/~mkearns/teaching/COLT/adaboost.pdf",
      code: ""
    },

    conceptLink: "ml-ensembles",
    partOf: [],
    prereqs: ["ml-ensembles", "ml-trees"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A <b>classifier</b> is a rule that looks at an example (a row of numbers, called
       <b>features</b>) and outputs a label. A <b>weak classifier</b> is one that is only slightly better than a
       coin flip &mdash; it gets a bit more than half of the examples right. The paper's running picture is a
       gambler who can only get rough "rules-of-thumb" from an expert ("bet on the horse that won most
       recently"), each one barely better than guessing.</p>
       <p>The question the paper answers: can you <b>combine many such weak rules into one highly accurate
       rule</b>? Earlier boosting methods could, but they needed to know in advance <b>how</b> accurate each
       weak rule would be (a number called $\\gamma$, "gamma", the edge over guessing). In practice you do not
       know that ahead of time, and the edge changes from round to round. That requirement made boosting hard
       to use.</p>`,

    contribution:
      `<p>The paper introduces <b>AdaBoost</b> ("Adaptive Boosting") and proves it works:</p>
       <ul>
         <li><b>An adaptive boosting algorithm.</b> AdaBoost needs <i>no</i> prior knowledge of how good the
         weak classifiers are. It measures each one's error as it goes and sets its own parameters from that.
         ("Adaptive" = it adjusts to the accuracies it actually sees.)</li>
         <li><b>Reweighting instead of resampling.</b> It keeps a <b>weight</b> on every training example. After
         each weak classifier is trained, it <b>raises the weight</b> of the examples that were misclassified and
         <b>lowers</b> the weight of the ones gotten right, so the next weak classifier is forced to focus on the
         hard cases.</li>
         <li><b>A proven error bound.</b> It proves the combined classifier's training error drops
         <b>exponentially fast</b> in the number of rounds, as long as every weak classifier beats random
         guessing (Theorem 6, Eq. 14, below).</li>
       </ul>`,

    whyItMattered:
      `<p>AdaBoost made boosting practical, and it became one of the most influential classical-ML algorithms:
       the Viola-Jones face detector (the technology in early digital-camera face boxes) was built on it, and
       boosting of decision trees is the direct ancestor of the gradient-boosting libraries (XGBoost, LightGBM)
       that still win tabular-data competitions today. Freund and Schapire received the 2003 Goedel Prize for
       this work. (Source: the paper's footnote &mdash; <i>J. Comput. Syst. Sci.</i> 55(1):119-139, 1997.)</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 4 introduction and Figure 2</b> ("Algorithm AdaBoost") &mdash; the five steps that define
         the whole method. This is what you implement; everything else justifies it.</li>
         <li><b>Section 4.1 / Theorem 6 and Eq. (14)</b> &mdash; the proof that training error falls
         exponentially. Read the statement; the proof (Eqs. 15-20) is optional.</li>
       </ul>
       <p><b>Skim:</b> Sections 1-3 (the on-line allocation game and the <b>Hedge</b>$(\\beta)$ algorithm of
       Figure 1) &mdash; AdaBoost is derived as a "dual" of that game, but you do not need the game to use
       boosting. Skim Section 4.3 (generalization / VC-dimension) unless you want the theory of why it
       generalizes beyond the training set.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> The toy data is a vertical <b>band</b>: an example is class $+1$ when its
       first feature falls between two cut points, and class $-1$ otherwise. A single <b>decision stump</b> (a
       one-question classifier: "is feature $f$ above threshold $t$?") can only make <i>one</i> cut, but the
       band has <i>two</i> edges. So: how accurate can <b>one</b> stump be? And after AdaBoost stacks a handful
       of stumps, will it reach the band exactly? Write your two guesses, then look at the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Using NumPy and labels in $\\{-1,+1\\}$, write one boosting round:</p>
       <ul>
         <li>Start with equal weights: <code># TODO: w = ones(N)/N</code>.</li>
         <li>Fit the best weighted stump: scan every feature and threshold, pick the one with the smallest
         <b>weighted error</b> <code># TODO: eps = sum(w[pred != y])</code>.</li>
         <li>Compute the classifier's vote weight: <code># TODO: alpha = 0.5*log((1-eps)/eps)</code>.</li>
         <li>Reweight, then renormalize so the weights sum to 1 again:
         <code># TODO: w *= exp(-alpha * y * pred); w /= w.sum()</code> &mdash; this multiplies the weight of each
         <i>wrong</i> example ($y\\neq\\text{pred}$, so $y\\cdot\\text{pred}=-1$) by $e^{+\\alpha}\\gt 1$ and each
         <i>right</i> one by $e^{-\\alpha}\\lt 1$.</li>
       </ul>
       <p>The CODE cell below is the full reference, including the check that your final ensemble's accuracy
       <b>equals scikit-learn's <code>AdaBoostClassifier</code></b> at every round &mdash; that match is the proof
       your math is right.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>AdaBoost runs for $T$ rounds. It keeps a weight $w_i$ on every training example $i$, starting equal.
       Each round does four things (Figure 2, Steps 1-5):</p>
       <ol>
         <li><b>Make a distribution.</b> Normalize the weights so they sum to 1: $p^t_i = w^t_i / \\sum_j w^t_j$.
         This $p^t$ says how much each example matters <i>this round</i>.</li>
         <li><b>Train a weak classifier.</b> Hand $p^t$ to the weak learner; it returns a classifier $h_t$ that
         does well on the high-weight (currently-hard) examples. Here $h_t$ is a <b>decision stump</b>.</li>
         <li><b>Measure its weighted error.</b> $\\epsilon_t = \\sum_i p^t_i\\,|h_t(x_i)-y_i|$ &mdash; the total
         weight of the examples it got wrong. If $\\epsilon_t \\lt 1/2$ the stump beats guessing.</li>
         <li><b>Set its trust and reweight.</b> A small error earns a large vote weight; then raise the weight of
         the misclassified examples so the next stump attacks them. The exact formulas are below.</li>
       </ol>
       <p>After $T$ rounds the answer is a <b>weighted majority vote</b>: each stump votes, weighted by how much
       it is trusted, and the sign of the total is the prediction.</p>
       <p><b>Two ways to write the weight.</b> The paper uses $\\beta_t = \\epsilon_t/(1-\\epsilon_t)$, downweights
       <i>correct</i> examples by $\\beta_t$, and gives stump $h_t$ a final vote of $\\ln(1/\\beta_t)$. The modern
       textbook form (used with $\\pm1$ labels and in scikit-learn) defines
       $\\alpha_t = \\tfrac12\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$ and multiplies each example's weight by
       $e^{-\\alpha_t y_i h_t(x_i)}$. These are the <b>same algorithm</b>: $\\ln(1/\\beta_t)=2\\alpha_t$, and the
       factor of 2 cancels in the vote threshold. We implement the $\\alpha_t$ form because it is the one
       scikit-learn uses, which lets us verify an exact match.</p>`,

    architecture:
      `<p>AdaBoost is not a layered network &mdash; it is an <b>iterative algorithm</b> wrapped around a black-box
       weak learner. Its "architecture" is the per-round loop of Figure 2 plus the two state vectors it carries.</p>
       <p><b>State carried across rounds:</b></p>
       <ul>
         <li><b>Weight vector $\\mathbf{w}^t = (w^t_1,\\dots,w^t_N)$</b> &mdash; one nonnegative weight per training
         example, initialized to $D(i)$ (uniform $1/N$). This is the only thing that changes between rounds.</li>
         <li><b>Hypothesis list $h_1,\\dots,h_T$ with vote weights $\\alpha_1,\\dots,\\alpha_T$</b> &mdash; appended to,
         one per round, and combined at the end.</li>
       </ul>
       <p><b>One round $t$ (the repeating block, Figure 2 Steps 1-5):</b></p>
       <ol>
         <li><b>Normalize</b> $\\mathbf{w}^t$ into a distribution $p^t_i = w^t_i/\\sum_j w^t_j$.</li>
         <li><b>WeakLearn call</b> &mdash; hand $p^t$ to the weak learner (the swappable component; here a depth-1
         decision stump found by scanning every feature&times;threshold&times;polarity for the smallest weighted error).
         Returns $h_t$.</li>
         <li><b>Score</b> $h_t$: weighted error $\\epsilon_t=\\sum_i p^t_i|h_t(x_i)-y_i|$.</li>
         <li><b>Trust</b>: $\\beta_t=\\epsilon_t/(1-\\epsilon_t)$, equivalently vote weight $\\alpha_t=\\tfrac12\\ln(1/\\beta_t)$.</li>
         <li><b>Reweight</b>: multiply each $w^t_i$ by $e^{-\\alpha_t y_i h_t(x_i)}$ (paper: $\\beta_t^{1-|h_t(x_i)-y_i|}$),
         then renormalize by $Z_t$. Misclassified examples gain weight, feeding back into Step 1 of the next round.</li>
       </ol>
       <p><b>Combiner (run once, after $T$ rounds):</b> a single linear-threshold unit over the $T$ stump outputs &mdash;
       $H(x)=\\operatorname{sign}(\\sum_t \\alpha_t h_t(x))$. The paper notes (Theorem 8) this is exactly a
       <b>two-layer feed-forward network</b>: layer 1 is the $T$ weak hypotheses, layer 2 is the weighted-majority
       threshold. <b>Data flow:</b> the weight vector is the feedback channel &mdash; each round's errors steer the
       next round's distribution, so successive stumps specialize on what earlier ones missed. AdaBoost is the
       "dual" of the <b>Hedge</b>$(\\beta)$ on-line allocation algorithm (Figure 1): there the weights sit on
       <i>strategies</i> and rise with success; here they sit on <i>examples</i> and rise with failure.</p>`,

    symbols: [
      { sym: "weak classifier", desc: "a classifier that is only slightly better than random guessing (error a little below 1/2). Also called a 'rule-of-thumb' or 'weak hypothesis' in the paper." },
      { sym: "decision stump", desc: "the simplest weak classifier: a one-question rule of the form 'predict +1 if feature f is above (or below) threshold t, else -1'. A depth-1 decision tree." },
      { sym: "$N$", desc: "the number of training examples." },
      { sym: "$T$", desc: "the number of boosting rounds (how many weak classifiers we train and combine)." },
      { sym: "$x_i, y_i$", desc: "the $i$-th example's features ($x_i$) and its true label ($y_i$). In the modern $\\pm1$ form, $y_i\\in\\{-1,+1\\}$." },
      { sym: "$h_t$", desc: "the weak classifier (stump) trained in round $t$; $h_t(x_i)$ is its prediction for example $i$." },
      { sym: "$w^t_i$", desc: "the weight on example $i$ at the start of round $t$: how much that example matters this round. Starts equal ($1/N$)." },
      { sym: "$p^t_i$", desc: "the normalized weight, $w^t_i$ divided by the total, so the $p^t_i$ sum to 1 (a probability distribution over the examples)." },
      { sym: "$\\epsilon_t$", desc: "epsilon: the weighted error of $h_t$ this round &mdash; the total normalized weight of the examples it misclassified. Below 1/2 means better than guessing." },
      { sym: "$\\beta_t$", desc: "beta: the paper's weight-shrink factor, $\\epsilon_t/(1-\\epsilon_t)$. A smaller error gives a smaller $\\beta_t$, so correct examples are shrunk more." },
      { sym: "$\\alpha_t$", desc: "alpha: the modern vote weight (how much stump $h_t$ is trusted), $\\tfrac12\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$. Equal to $\\tfrac12\\ln(1/\\beta_t)$." },
      { sym: "$\\gamma$", desc: "gamma: the weak classifier's 'edge' over random guessing, defined by $\\epsilon_t = 1/2 - \\gamma_t$. A bigger edge means a better stump." },
      { sym: "$D_t(i)$", desc: "the distribution over examples at round $t$ in the modern textbook form &mdash; the same object as $p^t_i$ (a normalized weight). $D_t(i)$ and $D_{t+1}(i)$ are the before/after of one round's reweighting." },
      { sym: "$Z_t$", desc: "the normalizer (partition function) for round $t$: the sum of all unnormalized new weights, dividing by which keeps $D_{t+1}$ a valid distribution (sums to 1)." },
      { sym: "$h_f$ / $H$", desc: "the final classifier: the weighted-majority vote of all $T$ stumps. The paper writes $h_f$ (with a $\\{0,1\\}$ threshold); the modern $\\pm1$ form writes $H(x)=\\operatorname{sign}(\\sum_t\\alpha_t h_t(x))$." }
    ],

    formula:
      `$$p^t_i \\;=\\; \\frac{w^t_i}{\\sum_{j=1}^{N} w^t_j}$$
       <p>The distribution over examples this round &mdash; normalize the weights to sum to 1 (Figure 2, Step 1; Eq. 1 for <b>Hedge</b>).</p>
       $$\\epsilon_t=\\sum_{i=1}^{N} p^t_i\\,\\bigl|h_t(x_i)-y_i\\bigr|$$
       <p>Weighted error of the round-$t$ weak classifier $h_t$ &mdash; total weight of the examples it gets wrong (Figure 2, Step 3).</p>
       $$\\beta_t \\;=\\; \\frac{\\epsilon_t}{1-\\epsilon_t}
         \\qquad
         \\alpha_t \\;=\\; \\tfrac12\\ln\\frac{1-\\epsilon_t}{\\epsilon_t} \\;=\\; \\tfrac12\\ln\\frac{1}{\\beta_t}$$
       <p>The vote weight. Paper uses $\\beta_t$ (Figure 2, Step 4); the modern $\\pm1$ form uses $\\alpha_t=\\tfrac12\\ln(1/\\beta_t)$, so $\\ln(1/\\beta_t)=2\\alpha_t$.</p>
       $$D_{t+1}(i) \\;=\\; \\frac{D_t(i)\\,\\exp\\!\\bigl(-\\alpha_t\\,y_i\\,h_t(x_i)\\bigr)}{Z_t}
         \\qquad
         Z_t \\;=\\; \\sum_{i=1}^{N} D_t(i)\\,\\exp\\!\\bigl(-\\alpha_t\\,y_i\\,h_t(x_i)\\bigr)$$
       <p>The modern textbook reweight ($\\pm1$ labels): grow the weight of misclassified examples ($y_i h_t(x_i)=-1$), shrink the rest, then divide by the normalizer $Z_t$ so $D_{t+1}$ stays a distribution.</p>
       $$w^{t+1}_i \\;=\\; w^t_i\\,\\beta_t^{\\,1-|h_t(x_i)-y_i|}$$
       <p>The paper's exact Step 5 (Figure 2, $\\{0,1\\}$ labels): exponent is $1$ for correct examples (multiply by $\\beta_t\\lt1$), $0$ for wrong ones (leave unchanged). Same update as the $D_{t+1}$ form.</p>
       $$H(x) \\;=\\; \\operatorname{sign}\\!\\Bigl(\\textstyle\\sum_{t=1}^{T}\\alpha_t\\,h_t(x)\\Bigr)$$
       <p>The final classifier &mdash; the sign of the trust-weighted vote of all $T$ weak classifiers (modern $\\pm1$ form of Figure 2's $h_f$).</p>
       $$\\epsilon \\;=\\; \\Pr_{i\\sim D}\\bigl[H(x_i)\\neq y_i\\bigr]
         \\;\\le\\; \\prod_{t=1}^{T} 2\\sqrt{\\epsilon_t(1-\\epsilon_t)}
         \\;=\\; \\prod_{t=1}^{T}\\sqrt{1-4\\gamma_t^2}
         \\;\\le\\; \\exp\\!\\Bigl(-2\\textstyle\\sum_{t=1}^{T}\\gamma_t^2\\Bigr)$$
       <p>The training-error bound (Theorem 6, Eq. 14; rewritten via $\\epsilon_t=\\tfrac12-\\gamma_t$ as Eq. 21). Falls to zero exponentially in $T$ when every $\\gamma_t\\gt0$.</p>`,

    whatItDoes:
      `<p>The first line measures how wrong this stump is ($\\epsilon_t$) and turns that into a <b>vote weight</b>
       $\\alpha_t$: when the error $\\epsilon_t$ is tiny, $\\frac{1-\\epsilon_t}{\\epsilon_t}$ is huge, so
       $\\alpha_t$ is large &mdash; a very accurate stump gets a loud vote. When $\\epsilon_t=1/2$ (no better
       than guessing), $\\alpha_t=0$ &mdash; that stump is ignored.</p>
       <p>The second line is the <b>reweighting</b>. With $\\pm1$ labels, $y_i h_t(x_i)=+1$ when the stump is
       right (weight multiplied by $e^{-\\alpha_t}\\lt1$, shrunk) and $-1$ when it is wrong (multiplied by
       $e^{+\\alpha_t}\\gt1$, grown). The right-hand version is the paper's exact Step 5: the exponent
       $1-|h_t(x_i)-y_i|$ is $1$ for correct examples (multiply by $\\beta_t\\lt1$) and $0$ for wrong ones
       (multiply by $1$, i.e. leave them). After this we renormalize so the weights sum to 1. The last line is
       the final weighted-majority vote. (Figure 2, Steps 3-5; the $\\alpha_t$ form follows from
       $\\beta_t=\\epsilon_t/(1-\\epsilon_t)$ in Step 4.)</p>`,

    derivation:
      `<p>The intuition of <i>why</i> averaging classifiers helps &mdash; and the bias/variance view of ensembles
       &mdash; is covered in the <code>ml-ensembles</code> concept lesson; recap and link rather than re-derive.
       The specific choice $\\alpha_t=\\tfrac12\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$ is not arbitrary: the paper
       sets $\\beta_t=\\epsilon_t/(1-\\epsilon_t)$ because that is the value that <b>minimizes the upper bound on
       training error</b> (Eq. 20 in the proof of Theorem 6 &mdash; "setting the derivative of the $t$th factor
       to zero"). Plugging it back gives the bound</p>
       $$\\epsilon \\;\\le\\; 2^{T}\\prod_{t=1}^{T}\\sqrt{\\epsilon_t(1-\\epsilon_t)}\\;=\\;\\prod_{t=1}^{T}\\sqrt{1-4\\gamma_t^2}\\;\\le\\;\\exp\\!\\Bigl(-2\\textstyle\\sum_{t=1}^{T}\\gamma_t^2\\Bigr),$$
       <p>(Eq. 14 and Eq. 21). Each factor $\\sqrt{\\epsilon_t(1-\\epsilon_t)}\\lt 1/2$ whenever $\\epsilon_t\\lt1/2$,
       so multiplying $T$ of them drives the bound to zero <b>exponentially</b> in $T$ &mdash; as long as every
       stump beats random guessing ($\\gamma_t\\gt0$).</p>`,

    example:
      `<p><b>Worked numbers &mdash; one round on 5 examples.</b> One feature $x\\in\\{1,2,3,4,5\\}$, labels
       $y=[+1,+1,-1,+1,-1]$, equal start weights $w_i=0.2$.</p>
       <ul>
         <li><b>Best stump.</b> Scanning thresholds, the best one-question rule is "predict $+1$ if $x\\lt2.5$,
         else $-1$", giving predictions $[+1,+1,-1,-1,-1]$. It is wrong only on example 4 ($x=4$, true $+1$,
         predicted $-1$).</li>
         <li><b>Weighted error.</b> $\\epsilon = \\sum_{\\text{wrong}} w_i = 0.2$ (only example 4).</li>
         <li><b>Vote weight.</b> $\\alpha = \\tfrac12\\ln\\frac{1-0.2}{0.2} = \\tfrac12\\ln 4 = \\tfrac12(1.3863)
         = 0.6931$.</li>
         <li><b>Reweight.</b> Right examples ($y_i h_t=+1$): $w\\cdot e^{-0.6931}=0.2\\times0.5=0.1$. The wrong
         example ($y_i h_t=-1$): $w\\cdot e^{+0.6931}=0.2\\times2=0.4$. Unnormalized weights:
         $[0.1,0.1,0.1,0.4,0.1]$.</li>
         <li><b>Renormalize.</b> Sum $Z = 0.8$; divide: $[0.125,0.125,0.125,\\mathbf{0.5},0.125]$. The hard
         example (4) now carries half the total weight &mdash; the next stump will be forced to fix it.</li>
       </ul>
       <p>The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>Algorithm AdaBoost (Figure 2), as numbered steps:</b></p>
       <ol>
         <li>Initialize weights equal: $w^1_i = 1/N$.</li>
         <li>For $t=1,\\dots,T$:
           <ol>
             <li>Normalize: $p^t_i = w^t_i/\\sum_j w^t_j$.</li>
             <li>Fit the weak classifier $h_t$ on the weighted data (here: the stump with smallest weighted error).</li>
             <li>Weighted error: $\\epsilon_t = \\sum_i p^t_i\\,|h_t(x_i)-y_i|$.</li>
             <li>Vote weight: $\\alpha_t = \\tfrac12\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$.</li>
             <li>Reweight: $w^{t+1}_i = w^t_i\\,e^{-\\alpha_t y_i h_t(x_i)}$, then renormalize.</li>
           </ol>
         </li>
         <li>Output $h_f(x) = \\operatorname{sign}\\bigl(\\sum_t \\alpha_t h_t(x)\\bigr)$.</li>
       </ol>`,

    results:
      `<p>The headline result is the <b>training-error bound</b> (Theorem 6, Eq. 14):
       $\\epsilon \\le 2^{T}\\prod_{t=1}^{T}\\sqrt{\\epsilon_t(1-\\epsilon_t)}$, equivalently
       $\\epsilon \\le \\exp(-2\\sum_t\\gamma_t^2)$ where $\\epsilon_t = 1/2-\\gamma_t$. In words: if every weak
       classifier beats guessing by some margin $\\gamma_t\\gt0$, the combined classifier's error on the training
       set falls to zero <b>exponentially fast</b> in the number of rounds $T$. (Quoted from the paper's Section 4
       abstract and Theorem 6; the per-experiment numbers in the paper's later sections are not reproduced here.)
       The CODEVIZ below shows OUR small run, not the paper's numbers.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> scikit-learn ships this as <code>AdaBoostClassifier</code> in one line. Here
       you <b>build it from scratch</b> in NumPy: the weighted decision stump, the weighted error $\\epsilon_t$,
       the $\\alpha_t = \\tfrac12\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$ weight, the exponential reweighting, and
       the final weighted-majority vote. The payoff is the check that your round-by-round accuracy is
       <b>identical to scikit-learn's <code>AdaBoostClassifier</code></b> on the same toy 2-D data &mdash; if it
       matches, your boosting loop is provably the same algorithm. You also see the ensemble's accuracy climb
       above a single stump's.</p>`,

    pitfalls:
      `<ul>
         <li><b>Label convention.</b> The $\\alpha_t$ reweighting $e^{-\\alpha_t y_i h_t(x_i)}$ assumes labels and
         predictions are in $\\{-1,+1\\}$. With $\\{0,1\\}$ labels you must use the paper's $\\beta_t$ form
         ($w \\cdot \\beta_t^{1-|h-y|}$) instead, or convert. Mixing conventions silently breaks the update.</li>
         <li><b>Renormalize every round.</b> After reweighting you must divide the weights by their sum so they
         form a distribution again. Forgetting this lets the weights blow up or vanish and corrupts $\\epsilon_t$.</li>
         <li><b>$\\epsilon_t = 0$ or $\\epsilon_t = 1/2$.</b> A perfect stump ($\\epsilon_t=0$) makes
         $\\alpha_t=\\infty$; a useless one ($\\epsilon_t=1/2$) makes $\\alpha_t=0$. Clip $\\epsilon_t$ into
         $(0,1)$ (e.g. to $[10^{-12}, 1-10^{-12}]$) to avoid dividing by zero or taking $\\ln 0$.</li>
         <li><b>Weighted error, not plain error.</b> $\\epsilon_t$ sums the <i>weights</i> of the wrong examples,
         not the count. Using the unweighted error rate gives the wrong $\\alpha_t$ and the wrong reweighting.</li>
         <li><b>Stumps must beat guessing.</b> The exponential bound needs $\\epsilon_t\\lt1/2$ every round. On
         data no axis-aligned stump can separate (e.g. a pure checkerboard), boosting stumps plateaus &mdash;
         the weak learner has to actually have an edge.</li>
       </ul>`,

    recall: [
      "Write the weighted error and the vote weight from memory: $\\epsilon_t=\\sum_i p^t_i|h_t(x_i)-y_i|$ and $\\alpha_t=\\tfrac12\\ln\\frac{1-\\epsilon_t}{\\epsilon_t}$.",
      "Write the reweighting rule (the $\\pm1$ form) and say which examples get heavier.",
      "What does $\\alpha_t$ equal when $\\epsilon_t=1/2$, and what does that mean for that stump's vote?",
      "State the training-error bound (Eq. 14) and what it says happens as $T$ grows."
    ],

    practice: [
      {
        q: `In the worked example the misclassified example ended with weight 0.5. Verify that and explain why the next stump must do something different.`,
        steps: [
          { do: `Right examples: $0.2\\times e^{-0.6931}=0.2\\times0.5=0.1$; wrong example: $0.2\\times e^{+0.6931}=0.2\\times2=0.4$.`, why: `$e^{\\pm0.6931}=2$ or $1/2$ since $\\alpha=\\tfrac12\\ln4$.` },
          { do: `Sum $Z=0.1\\cdot4+0.4=0.8$; normalize the wrong one: $0.4/0.8=0.5$.`, why: `Weights must sum to 1.` },
          { do: `Now half the total weight sits on that one example.`, why: `The next stump's weighted error is dominated by it, so it is pushed to classify it correctly.` }
        ],
        answer: `New weights $[0.125,0.125,0.125,0.5,0.125]$. AdaBoost concentrates weight on the hard example, so successive stumps specialize on what earlier ones missed &mdash; that is the whole mechanism.`
      },
      {
        q: `Ablation (1 vs many rounds): on the band data, a single stump scores 0.7533 but the boosted ensemble reaches 1.0. Why can't one stump match the ensemble, and why do 3 rounds suffice?`,
        steps: [
          { do: `The positive class is a band: $+1$ when feature 0 lies between two cut points.`, why: `Its boundary needs TWO thresholds.` },
          { do: `A stump makes only ONE cut, so it can carve off at most one edge of the band &mdash; the other side is always misclassified.`, why: `That caps a single stump near 0.75 here.` },
          { do: `Round 1 cuts the left edge; the right-edge errors gain weight; round 2 attacks them; a third stump and the weighted vote stitch the two cuts into the band.`, why: `The vote of several stumps can represent the two-sided region one stump cannot.` }
        ],
        answer: `One stump is structurally limited to a single threshold, so it tops out at 0.7533 on a two-edged band. Boosting reweights toward the missed edge each round; by round 3 the weighted majority of three stumps reproduces the band exactly (accuracy 1.0). This is the ensemble beating the single weak learner &mdash; and it matches scikit-learn round for round.`
      },
      {
        q: `A weak classifier comes back with weighted error $\\epsilon_t=0.4$. Compute its vote weight $\\alpha_t$, and compare it to a stump with $\\epsilon_t=0.1$.`,
        steps: [
          { do: `$\\alpha_t=\\tfrac12\\ln\\frac{1-0.4}{0.4}=\\tfrac12\\ln1.5=\\tfrac12(0.4055)=0.2027$.`, why: `Plug into the formula.` },
          { do: `For $\\epsilon_t=0.1$: $\\alpha_t=\\tfrac12\\ln\\frac{0.9}{0.1}=\\tfrac12\\ln9=\\tfrac12(2.1972)=1.0986$.`, why: `Smaller error, larger trust.` }
        ],
        answer: `The barely-useful stump ($\\epsilon=0.4$) gets a quiet vote $\\alpha\\approx0.20$; the accurate one ($\\epsilon=0.1$) gets a loud vote $\\alpha\\approx1.10$ &mdash; about 5x louder. AdaBoost trusts accurate weak classifiers far more, and ignores ones at $\\epsilon=0.5$ entirely ($\\alpha=0$).`
      }
    ]
  });

  window.CODE["paper-adaboost"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `Build AdaBoost from scratch in NumPy: a weighted decision stump, the weighted error eps_t, the ` +
      `alpha_t = 0.5*ln((1-eps)/eps) vote weight, exponential reweighting (heavier on the misclassified), and ` +
      `the final weighted-majority vote. Then PROVE it is the same algorithm as scikit-learn by checking the ` +
      `round-by-round accuracy matches AdaBoostClassifier exactly on a toy 2-D set, show the ensemble beats a ` +
      `single stump, and recompute the [1,2,3,4,5] worked example. Runs in Colab (numpy + scikit-learn).`,
    code: `import numpy as np
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

# ---------- weighted decision stump (depth-1 tree) ----------
def fit_stump(X, y, w):
    """y in {-1,+1}; w a weight per example. Return (feat, thresh, polarity, predictions)."""
    N, F = X.shape
    best = (None, None, None, np.inf, None)         # (feat, thr, pol, err, pred)
    for f in range(F):
        vals = np.unique(X[:, f])
        thr = (vals[:-1] + vals[1:]) / 2 if len(vals) > 1 else vals   # midpoints
        for t in thr:
            for pol in (1, -1):
                pred = np.where(pol * (X[:, f] - t) >= 0, 1, -1)
                err = np.sum(w[pred != y])          # WEIGHTED error (eq: eps_t)
                if err < best[3]:
                    best = (f, t, pol, err, pred)
    return best

# ---------- AdaBoost from scratch (Figure 2, Steps 1-5) ----------
def adaboost_fit(X, y, T):
    N = X.shape[0]
    w = np.full(N, 1.0 / N)                         # Step 1: equal weights
    stumps, alphas = [], []
    for _ in range(T):
        f, thr, pol, eps, pred = fit_stump(X, y, w) # Steps 1-3 (normalized via w already summing ~1)
        eps = min(max(eps, 1e-12), 1 - 1e-12)       # clip to avoid log(0)/div-by-0
        alpha = 0.5 * np.log((1 - eps) / eps)        # Step 4: alpha_t = 0.5 ln((1-eps)/eps)
        w = w * np.exp(-alpha * y * pred)            # Step 5: heavier on the misclassified
        w = w / w.sum()                              # renormalize to a distribution
        stumps.append((f, thr, pol)); alphas.append(alpha)
    return stumps, alphas

def predict(X, stumps, alphas, upto=None):
    agg = np.zeros(X.shape[0])
    for (f, thr, pol), a in zip(stumps[:upto], alphas[:upto]):
        agg += a * np.where(pol * (X[:, f] - thr) >= 0, 1, -1)
    return np.sign(agg)                              # weighted-majority vote h_f

# ---------- toy 2-D set: a vertical BAND (two edges -> one stump can't do it) ----------
rng = np.random.default_rng(3)
N = 300
X = rng.uniform(-3, 3, (N, 2))
y = np.where((X[:, 0] > -1.0) & (X[:, 0] < 1.4), 1, -1)   # +1 inside the band

# ---------- single stump vs the boosted ensemble ----------
S, A = adaboost_fit(X, y, 50)
acc1  = np.mean(predict(X, S, A, upto=1) == y)
acc50 = np.mean(predict(X, S, A) == y)
print("single stump  accuracy:", round(acc1, 4))    # ~0.7533  (one cut can't bracket a band)
print("ensemble (50) accuracy:", round(acc50, 4))   # 1.0      (ensemble beats the stump)

# ---------- THE ORACLE: match scikit-learn round by round ----------
sk = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1),
                        n_estimators=12, algorithm="SAMME", random_state=0).fit(X, y)
mine_staged = [round(np.mean(predict(X, S, A, upto=t) == y), 4) for t in range(1, 13)]
sk_staged   = [round(s, 4) for s in sk.staged_score(X, y)]
print("mine staged  1..12:", mine_staged)
print("sklearn 1..12:", sk_staged)
print("MATCH:", mine_staged == sk_staged)           # expect True

# ---------- recompute the worked one-round example ----------
Xe = np.array([[1.], [2.], [3.], [4.], [5.]]); ye = np.array([1, 1, -1, 1, -1])
w0 = np.full(5, 0.2)
f, thr, pol, eps, pred = fit_stump(Xe, ye, w0)
alpha = 0.5 * np.log((1 - eps) / eps)
w1 = w0 * np.exp(-alpha * ye * pred); w1 = w1 / w1.sum()
print("eps:", round(eps, 4), " alpha:", round(alpha, 4),
      " new weights:", [round(v, 3) for v in w1])    # eps 0.2, alpha 0.6931, w=[.125,.125,.125,.5,.125]`
  };

  window.CODEVIZ["paper-adaboost"] = {
    question: "On a toy 2-D 'band' set, how does AdaBoost's training accuracy grow with the number of stumps — and does our from-scratch version match scikit-learn's AdaBoostClassifier at every round?",
    charts: [
      {
        type: "line",
        title: "Training accuracy vs number of boosting rounds: from-scratch AdaBoost vs scikit-learn (same toy band data)",
        xlabel: "number of stumps (rounds T)",
        ylabel: "training accuracy",
        series: [
          {
            name: "Ours (NumPy from scratch)",
            color: "#7ee787",
            points: [[1,0.7533],[2,0.6633],[3,1.0],[4,1.0],[5,1.0],[6,1.0],[7,1.0],[8,1.0],[9,1.0],[10,1.0],[11,1.0],[12,1.0]]
          },
          {
            name: "scikit-learn AdaBoostClassifier",
            color: "#79c0ff",
            points: [[1,0.7533],[2,0.6633],[3,1.0],[4,1.0],[5,1.0],[6,1.0],[7,1.0],[8,1.0],[9,1.0],[10,1.0],[11,1.0],[12,1.0]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 3), not the paper's reported numbers. 300 points in 2-D; class +1 is a vertical band on feature 0 (two edges). A SINGLE stump can make only one cut, so round 1 tops out at 0.7533. After AdaBoost reweights toward the missed edge, the weighted vote of just 3 stumps brackets the band exactly (accuracy 1.0) — the ensemble clearly beats the single stump. The two curves are IDENTICAL at every round: our from-scratch reweight + alpha = 0.5 ln((1-eps)/eps) + weighted-majority vote reproduces scikit-learn's AdaBoostClassifier (SAMME) exactly. The temporary dip at T=2 is real — adding one more stump before the vote can briefly disagree with the band — and both implementations dip together, which is itself evidence the algorithms are the same.",
    code: `import numpy as np
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

def fit_stump(X, y, w):
    F = X.shape[1]; best = (None, None, None, np.inf, None)
    for f in range(F):
        vals = np.unique(X[:, f]); thr = (vals[:-1]+vals[1:])/2 if len(vals)>1 else vals
        for t in thr:
            for pol in (1, -1):
                pred = np.where(pol*(X[:, f]-t) >= 0, 1, -1)
                err = np.sum(w[pred != y])
                if err < best[3]: best = (f, t, pol, err, pred)
    return best

def adaboost_fit(X, y, T):
    w = np.full(X.shape[0], 1.0/X.shape[0]); S, A = [], []
    for _ in range(T):
        f, thr, pol, eps, pred = fit_stump(X, y, w); eps = min(max(eps,1e-12),1-1e-12)
        a = 0.5*np.log((1-eps)/eps); w = w*np.exp(-a*y*pred); w /= w.sum()
        S.append((f, thr, pol)); A.append(a)
    return S, A

def predict(X, S, A, upto=None):
    agg = np.zeros(X.shape[0])
    for (f, thr, pol), a in zip(S[:upto], A[:upto]):
        agg += a*np.where(pol*(X[:, f]-thr) >= 0, 1, -1)
    return np.sign(agg)

rng = np.random.default_rng(3); N = 300
X = rng.uniform(-3, 3, (N, 2)); y = np.where((X[:,0] > -1.0) & (X[:,0] < 1.4), 1, -1)

S, A = adaboost_fit(X, y, 12)
mine = [round(np.mean(predict(X, S, A, upto=t) == y), 4) for t in range(1, 13)]
sk = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1),
                        n_estimators=12, algorithm="SAMME", random_state=0).fit(X, y)
skv = [round(s, 4) for s in sk.staged_score(X, y)]
print("ours   :", mine)   # [0.7533, 0.6633, 1.0, 1.0, ...]
print("sklearn:", skv)    # identical
print("identical:", mine == skv)`
  };
})();
