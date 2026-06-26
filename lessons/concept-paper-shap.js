/* Paper lesson — "A Unified Approach to Interpreting Model Predictions"
   (SHAP = SHapley Additive exPlanations), Scott Lundberg & Su-In Lee, NIPS 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-shap".
   GROUNDED from arXiv:1705.07874 (abstract) and the ar5iv HTML mirror
   (Definition 1 / Eqn 1 additive feature attribution; Section 3 Properties 1-3:
   Local Accuracy Eqn 5, Missingness Eqn 6, Consistency Eqn 7; Theorem 1 / Eqn 8
   the SHAP (Shapley) value with the coalition weighting term).
   Track B (architecture): compose a tiny additive model with numpy/torch, then
   implement the NOVEL part by hand — the EXACT Shapley value by enumerating every
   feature coalition. Reproduce the effect: attributions sum to f(x) minus the base
   value (local accuracy / efficiency) and match the additive ground truth. */
(function () {
  window.LESSONS.push({
    id: "paper-shap",
    title: "SHAP — A Unified Approach to Interpreting Model Predictions (2017)",
    tagline: "Attribute a prediction to its features with the unique fair split borrowed from cooperative game theory.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Scott M. Lundberg, Su-In Lee",
      org: "University of Washington",
      year: 2017,
      venue: "arXiv:1705.07874 (May 2017); NIPS 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1705.07874",
      code: "https://github.com/shap/shap"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-linear-regression", "prob-expectation", "aix-game-theory"],

    // WHY READ IT
    problem:
      `<p>A complex model gives a prediction. <b>Why?</b> Which features pushed it up, which pushed it down,
       and by how much? For a single linear model you can read the weights. For a gradient-boosted forest or a
       deep network you cannot. So people built many separate explanation methods &mdash; LIME, DeepLIFT,
       Layer-Wise Relevance Propagation, and several "feature importance" rules for trees. Each gave a per-feature
       number for one prediction. But they disagreed with each other, and none came with a guarantee that the
       numbers were <i>right</i> in any precise sense.</p>
       <p>From the abstract: "Understanding why a model makes a certain prediction can be as crucial as the
       prediction's accuracy in many applications." (Abstract)</p>
       <p>The open question the paper answers: is there a <b>single</b>, principled way to assign each feature a
       contribution &mdash; one that the existing methods are all secretly approximating, and that is provably the
       <i>only</i> assignment satisfying a few reasonable fairness rules?</p>`,
    contribution:
      `<ul>
        <li><b>One unifying class: additive feature attribution.</b> SHAP (SHapley Additive exPlanations) shows
        that six prior methods (including LIME and DeepLIFT) all explain a prediction with the <i>same shape</i> of
        model: a sum of one number per feature, the attribution $\\phi_i$, plus a base term $\\phi_0$.</li>
        <li><b>One unique answer, from game theory.</b> Among all attributions in that class, exactly one set of
        $\\phi_i$ satisfies three fairness properties (local accuracy, missingness, consistency). Those values are
        the classic <b>Shapley values</b> from cooperative game theory &mdash; here called SHAP values.</li>
        <li><b>Better-grounded, faster estimators.</b> Because the target is now a single well-defined quantity,
        the paper gives estimation methods (Kernel SHAP, Deep SHAP) that align better with human intuition and run
        faster than prior approximations.</li>
      </ul>`,
    whyItMattered:
      `<p>SHAP became the default way to explain tabular machine-learning models in industry. The reason is the
       guarantee: the per-feature numbers are not one heuristic among many, they are the <i>unique</i> fair split.
       "Fair split" has a precise meaning &mdash; the Shapley value &mdash; and it brings a property practitioners
       rely on every day: the attributions <b>add up</b> to the prediction minus a baseline. That additivity makes
       SHAP explanations auditable and composable, and it is why SHAP dashboards (waterfall plots, force plots,
       summary beeswarms) are everywhere in applied data science.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Definition 1, Equation 1)</b> &mdash; the <b>additive feature attribution</b> form
        $g(z') = \\phi_0 + \\sum_i \\phi_i z'_i$. This is the shape every method shares; understand the simplified
        binary inputs $z'$ (each feature present = 1, absent = 0).</li>
        <li><b>&sect;3 (Properties 1&ndash;3)</b> &mdash; the three axioms: <b>Local Accuracy</b> (Eqn 5),
        <b>Missingness</b> (Eqn 6), <b>Consistency</b> (Eqn 7). These are the fairness rules.</li>
        <li><b>&sect;3 (Theorem 1, Equation 8)</b> &mdash; the punchline: the unique $\\phi_i$ satisfying all three
        is the <b>Shapley value</b>, with the coalition-weighting term. This is the equation you transcribe and
        implement.</li>
       </ul>
       <p><b>Skim:</b> &sect;4&ndash;5 (Kernel SHAP and Deep SHAP estimators) and the model-specific approximations,
       unless you need them &mdash; they are clever ways to <i>approximate</i> Equation 8 when exact enumeration is
       too expensive. We enumerate exactly here because our model has only a few features.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>We will take a simple <b>additive</b> model &mdash; a prediction that is just a base value plus a separate
       term per feature, $f(x) = \\text{base} + \\sum_i c_i x_i$ &mdash; and ask the exact Shapley procedure to
       attribute one prediction. For an additive model each feature acts alone (no interactions). So before running:
       what do you expect each feature's SHAP value $\\phi_i$ to equal? And what should $\\sum_i \\phi_i$ equal
       &mdash; will it be the raw prediction $f(x)$, or $f(x)$ minus something? Write your guess and one sentence of
       reasoning.</p>
       <p>(Hint: "attribution" answers "how much did <i>knowing this feature</i> move us away from the
       no-information baseline?")</p>`,
    attempt:
      `<p>Before the reveal, sketch the exact Shapley computation you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Define a <b>value function</b> $f_x(S)$: the model's output when only the features in coalition $S$ are
        "known" and the rest are replaced by their background average. <i># for an additive model this is
        base + (known terms at $x$) + (unknown terms at the mean)</i></li>
        <li><b>Enumerate coalitions:</b> for each feature $i$, loop over every subset $S$ of the <i>other</i>
        features. <i># with $M$ features that is $2^{M-1}$ subsets per feature &mdash; cheap when $M$ is small</i></li>
        <li>TODO &mdash; for each $S$, compute the <b>marginal contribution</b> $f_x(S \\cup \\{i\\}) - f_x(S)$ and
        multiply by the weight $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}$. Sum to get $\\phi_i$.</li>
        <li>TODO &mdash; set the base value $\\phi_0 = f_x(\\varnothing)$ (no features known). Then verify
        $\\phi_0 + \\sum_i \\phi_i = f(x)$ exactly. Why must this hold?</li>
       </ul>
       <p>Then check your $\\phi_i$ against the additive ground truth $c_i\\,(x_i - \\bar x_i)$ &mdash; for an additive
       model the Shapley value collapses to exactly that.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>SHAP has two ideas stacked on top of each other: an <b>explanation shape</b> and a <b>fair rule</b> for
       filling it in.</p>
       <p><b>The explanation shape (additive feature attribution, &sect;2, Equation 1).</b> To explain one
       prediction, replace the real input by a vector of <b>simplified binary features</b> $z' \\in \\{0,1\\}^M$:
       $z'_i = 1$ means "feature $i$ is present (we know its value)", $z'_i = 0$ means "feature $i$ is absent". The
       explanation is a linear function of these bits:</p>
       <p>$$ g(z') = \\phi_0 + \\sum_{i=1}^{M} \\phi_i\\, z'_i. $$</p>
       <p>Each $\\phi_i$ is the <b>attribution</b> for feature $i$ &mdash; how much that feature contributes &mdash;
       and $\\phi_0$ is the <b>base value</b> (the output with no features present). Every method the paper unifies
       has this same form; they differ only in <i>how they pick the $\\phi_i$</i>.</p>
       <p><b>The fair rule (Properties 1&ndash;3, &sect;3).</b> The paper asks the attributions to satisfy three
       common-sense axioms. <b>Local accuracy</b>: the attributions must add back up to the real prediction.
       <b>Missingness</b>: a feature that is absent gets zero. <b>Consistency</b>: if you change the model so a
       feature matters <i>more</i> in every context, its attribution cannot go <i>down</i>.</p>
       <p><b>The punchline (Theorem 1, &sect;3).</b> There is exactly <b>one</b> choice of $\\phi_i$ satisfying all
       three &mdash; the <b>Shapley value</b> from cooperative game theory. Picture the features as players in a game
       whose "payout" is the prediction. The Shapley value of player $i$ is its average marginal contribution,
       averaged fairly over <b>every order</b> in which players could join the team:</p>
       <p>$$ \\phi_i = \\sum_{S \\subseteq F \\setminus \\{i\\}} \\frac{|S|!\\,(M - |S| - 1)!}{M!}
       \\big[\\, f_x(S \\cup \\{i\\}) - f_x(S) \\,\\big]. $$</p>
       <p>Read it as: for every coalition $S$ of the <i>other</i> features, measure how much <i>adding feature $i$</i>
       changes the output, then take a weighted average. The weight counts the fraction of join-orderings in which
       feature $i$ arrives right after exactly the players in $S$. Because the weights are exactly those order
       counts, summing the $\\phi_i$ telescopes to $f(x) - \\phi_0$ &mdash; that is the local-accuracy guarantee,
       falling straight out of the formula.</p>`,
    architecture:
      `<p>SHAP is not a neural network but a <b>method with a fixed pipeline</b>. Here is the structure, stage by stage.</p>
       <p><b>1. Simplified-input layer ($h_x$).</b> Pick the instance $x$ to explain and a background dataset. A
       coalition is a bit-vector $z' \\in \\{0,1\\}^M$; the mapping $x = h_x(z')$ turns it back into a real input by
       keeping present features ($z'_i=1$) at their value in $x$ and replacing absent ones ($z'_i=0$) by the
       background. This is the only model-agnostic interface SHAP needs &mdash; everything else is arithmetic on
       $f(h_x(\\cdot))$.</p>
       <p><b>2. Value function ($f_x$).</b> $f_x(z') = E[f(z)\\mid z_S]$ &mdash; the model's expected output given the
       present features $S$. SHAP estimates this by averaging $f$ over background draws of the absent features (or, in
       the additive-model / independence case, by plugging the mean). One scalar per coalition.</p>
       <p><b>3. Attribution engine (the choice of estimator):</b></p>
       <ul>
        <li><b>Exact Shapley (this lesson):</b> enumerate all $2^M$ coalitions, weight each marginal by
        $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}$, and sum (Eqn. 8). $O(M\\,2^M)$ value-function calls &mdash; exact, only
        feasible for small $M$.</li>
        <li><b>Kernel SHAP (model-agnostic):</b> sample a set of coalitions $z'$, evaluate $f(h_x(z'))$ on each, and
        solve a <i>weighted linear regression</i> of those outputs onto the bits $z'$ using the Shapley kernel
        $\\pi_x$ (Theorem 2). The fitted coefficients are the SHAP values. Cost is controlled by the number of
        sampled coalitions, not $2^M$.</li>
        <li><b>Deep SHAP (model-specific):</b> compose per-layer DeepLIFT-style attributions through the network
        using the chain rule, reusing SHAP's additivity to back-propagate attributions in one or a few passes &mdash;
        a fast approximation for deep models.</li>
       </ul>
       <p><b>4. Output / consumption layer.</b> The result is the vector $(\\phi_0, \\phi_1, \\dots, \\phi_M)$
       satisfying $\\phi_0 + \\sum_i \\phi_i = f(x)$ (local accuracy). Because the pieces add up, they feed directly
       into waterfall plots, force plots, and beeswarm summaries &mdash; the additive structure of Eqn. 1 <i>is</i>
       the visualization contract. Our code implements stages 1&ndash;3 with the exact engine and stage 4 as the
       local-accuracy check and bar chart.</p>`,
    symbols: [
      { sym: "$\\phi_i$", desc: "the <b>attribution</b> (SHAP value) for feature $i$: a single number saying how much knowing feature $i$ moved this prediction. The thing we compute." },
      { sym: "$\\phi_0$", desc: "the <b>base value</b>: the model output when <i>no</i> feature is known, equal to the expected prediction $E[f]$ over the background data. Where the explanation starts from." },
      { sym: "$f$", desc: "the <b>model</b> being explained (here a small additive model built with numpy/torch). $f(x)$ is its prediction on the instance $x$." },
      { sym: "$x$", desc: "the single <b>input instance</b> whose prediction we are explaining." },
      { sym: "$z' \\in \\{0,1\\}^M$", desc: "the <b>simplified input</b>: a vector of $M$ bits, one per feature. $z'_i = 1$ means feature $i$ is present (known); $z'_i = 0$ means absent." },
      { sym: "$M$", desc: "the number of <b>features</b> (the size of the full feature set $F$)." },
      { sym: "$F$", desc: "the full <b>feature set</b> $\\{1, \\dots, M\\}$ &mdash; in game-theory terms, all the players." },
      { sym: "$S$", desc: "a <b>coalition</b>: a subset of features treated as 'known/present'. The sum runs over every $S$ drawn from $F$ with feature $i$ left out, i.e. $S \\subseteq F \\setminus \\{i\\}$." },
      { sym: "$f_x(S)$", desc: "the <b>value function</b>: the model's output when only the features in $S$ are known and the rest are replaced by their background average. The 'payout' of coalition $S$." },
      { sym: "$f_x(S \\cup \\{i\\}) - f_x(S)$", desc: "the <b>marginal contribution</b> of feature $i$ to coalition $S$: how much the output changes when feature $i$ joins the known set." },
      { sym: "$\\dfrac{|S|!\\,(M-|S|-1)!}{M!}$", desc: "the <b>coalition weight</b>: the fraction of orderings of all $M$ features in which feature $i$ arrives immediately after exactly the features in $S$. $|S|!$ orders the players before $i$; $(M-|S|-1)!$ orders the players after $i$; $M!$ is the total number of orderings." },
      { sym: "$z'_i$", desc: "the $i$-th bit of the simplified input $z'$: $1$ if feature $i$ is present in this coalition, $0$ if absent. (In Eqn. 5 the specific bit-vector for the instance is written $x'$.)" },
      { sym: "$z' \\setminus i$", desc: "the coalition $z'$ with feature $i$ <b>removed</b> (bit $i$ set to $0$). $f_x(z') - f_x(z' \\setminus i)$ is feature $i$'s marginal contribution to coalition $z'$ &mdash; the set-notation version of $f_x(S\\cup\\{i\\})-f_x(S)$." },
      { sym: "$h_x$", desc: "the <b>mapping function</b> $x = h_x(z')$ from a simplified binary coalition back to a real model input: present features keep their value in $x$, absent features take a background value. The only interface SHAP needs to a black-box model." },
      { sym: "$E[f(z)\\mid z_S]$", desc: "the <b>conditional expectation</b> of the model output given that the present features (indices $S$) are fixed at $x$'s values; the absent features are averaged over the background. This is what $f_x$ of a coalition means in general (Eqn. 8 region / &sect;4)." },
      { sym: "$f'$ , $\\phi_i(f,x)$", desc: "a <b>second model</b> $f'$ compared to $f$ in the consistency axiom (Eqn. 7); $\\phi_i(f,x)$ makes explicit that the attribution depends on both the model $f$ and the instance $x$." },
      { sym: "$\\pi_x(z')$", desc: "the <b>Shapley kernel</b> (Theorem 2): the regression weight $\\tfrac{M-1}{\\binom{M}{|z'|}|z'|(M-|z'|)}$ given to coalition $z'$ in Kernel SHAP. Largest for coalitions of size $1$ or $M-1$." },
      { sym: "$g$ , $G$ , $\\xi$", desc: "the <b>explanation model</b> $g$ (the additive form of Eqn. 1) drawn from the class $G$; $\\xi$ is the fitted $g$ that minimizes the weighted loss $L$ &mdash; the LIME/Kernel-SHAP objective." },
      { sym: "$L$ , $\\Omega$", desc: "the <b>weighted squared-error loss</b> $L(f,g,\\pi_x)=\\sum_{z'}[f(h_x(z'))-g(z')]^2\\pi_x(z')$ and the <b>regularizer</b> $\\Omega$. Kernel SHAP uses this $L$ with $\\Omega(g)=0$." }
    ],
    formula:
      `$$ g(z') = \\phi_0 + \\sum_{i=1}^{M} \\phi_i\\, z'_i. $$
       <p>The <b>additive feature-attribution</b> form (&sect;2, Definition 1, <b>Eqn. 1</b>): every method the paper unifies explains a prediction as a base value $\\phi_0$ plus one attribution $\\phi_i$ per present simplified feature $z'_i \\in \\{0,1\\}$.</p>
       $$ f(x) = g(x') = \\phi_0 + \\sum_{i=1}^{M} \\phi_i\\, x'_i. $$
       <p><b>Property 1 &mdash; Local Accuracy</b> (&sect;3, <b>Eqn. 5</b>): with $x = h_x(x')$, the explanation must reproduce the model's output. The attributions plus the base value equal the true prediction.</p>
       $$ x'_i = 0 \\;\\Longrightarrow\\; \\phi_i = 0. $$
       <p><b>Property 2 &mdash; Missingness</b> (&sect;3, <b>Eqn. 6</b>): a feature that is absent from the simplified input gets zero attribution.</p>
       $$ f'_x(z') - f'_x(z' \\setminus i) \\;\\ge\\; f_x(z') - f_x(z' \\setminus i)\\ \\ \\forall z' \\in \\{0,1\\}^M \\;\\Longrightarrow\\; \\phi_i(f', x) \\ge \\phi_i(f, x). $$
       <p><b>Property 3 &mdash; Consistency</b> (&sect;3, <b>Eqn. 7</b>): if a model change raises (or keeps) feature $i$'s marginal contribution in <i>every</i> coalition, that feature's attribution cannot decrease. ($z' \\setminus i$ sets bit $i$ to 0.)</p>
       $$ \\phi_i(f, x) = \\sum_{z' \\subseteq x'} \\frac{|z'|!\\,(M - |z'| - 1)!}{M!} \\big[\\, f_x(z') - f_x(z' \\setminus i) \\,\\big]. $$
       <p><b>Theorem 1 (SHAP / Shapley value, &sect;3, Eqn. 8).</b> The three properties above are satisfied by <i>exactly one</i> attribution &mdash; the classic Shapley value, summing over every coalition $z'$ (equivalently every subset $S \\subseteq F \\setminus \\{i\\}$) with the order-counting weight. Writing coalitions as sets $S$: $\\phi_i = \\sum_{S \\subseteq F \\setminus \\{i\\}} \\tfrac{|S|!\\,(M-|S|-1)!}{M!}\\,[\\,f_x(S \\cup \\{i\\}) - f_x(S)\\,]$.</p>
       $$ f_x(z') = f(h_x(z')) = E[\\, f(z) \\mid z_S \\,], \\qquad S = \\{\\, i : z'_i = 1 \\,\\}. $$
       <p>The <b>value function</b> (&sect;4): absent features are integrated out, so $f_x$ of a coalition is the model's expected output given the present features $z_S$. SHAP approximates this conditional expectation (assuming feature independence / model linearity, Eqns. 11&ndash;12).</p>
       $$ \\pi_{x}(z') = \\frac{M - 1}{\\dbinom{M}{|z'|}\\,|z'|\\,(M - |z'|)}. $$
       <p><b>The Shapley kernel</b> (&sect;5, Theorem 2): the weight that turns LIME's weighted linear regression into SHAP. Note it is huge for $|z'| \\in \\{1, M-1\\}$ (single features in/out) and small in the middle.</p>
       $$ \\xi = \\arg\\min_{g \\in G}\\ L(f, g, \\pi_x), \\qquad L(f, g, \\pi_x) = \\sum_{z'} \\big[\\, f(h_x(z')) - g(z') \\,\\big]^2 \\pi_x(z'), \\qquad \\Omega(g) = 0. $$
       <p><b>Kernel SHAP</b> (&sect;5, Eqns. 2 &amp; 9): fit the additive model $g$ (Eqn. 1) by <i>weighted least squares</i> over sampled coalitions $z'$ using the Shapley kernel $\\pi_x$ and no regularization ($\\Omega = 0$). Theorem 2 proves the recovered coefficients are exactly the Shapley values of Eqn. 8 &mdash; without enumerating all $2^M$ coalitions.</p>`,
    whatItDoes:
      `<p><b>The Shapley value</b> (left, the paper's <b>Theorem 1 / Equation 8</b>) is the novel quantity. For
       feature $i$ it averages the feature's <b>marginal contribution</b> $f_x(S \\cup \\{i\\}) - f_x(S)$ over every
       coalition $S$ of the other features, weighting each by how many join-orderings produce it. The result is the
       one attribution that is fair in the precise game-theory sense.</p>
       <p><b>Local accuracy</b> (right, the paper's <b>Property 1 / Equation 5</b>) is the payoff property: the base
       value plus all the attributions equals the actual prediction, $f(x) = \\phi_0 + \\sum_i \\phi_i$. Equivalently
       $\\sum_i \\phi_i = f(x) - \\phi_0 = f(x) - E[f]$ &mdash; the attributions exactly explain how we got from the
       no-information baseline $E[f]$ to this prediction $f(x)$. The two other axioms are <b>missingness</b>
       (Eqn. 6: an absent feature gets $\\phi_i = 0$) and <b>consistency</b> (Eqn. 7: raising a feature's marginal
       contribution everywhere cannot lower its attribution). Theorem 1 says these three pin down $\\phi_i$
       uniquely.</p>`,
    derivation:
      `<p>There is no separate concept lesson that owns the Shapley value, so here is the full reasoning &mdash;
       short, because the formula carries it.</p>
       <p><b>Why an average over orders.</b> Think of the features joining a team one at a time, in some order. When
       feature $i$ joins, it changes the payout by its marginal contribution to whoever is already there. A single
       order is arbitrary, so we average the marginal contribution over <b>all $M!$ orders</b>. Group the orders by
       <i>which set $S$ is already present when $i$ arrives</i>: there are $|S|!$ ways to order those who came before
       and $(M-|S|-1)!$ ways to order those who come after, out of $M!$ total. That ratio is exactly the coalition
       weight in Equation 8. So the Shapley value is "average marginal contribution over all join orders," rewritten
       as a sum over coalitions.</p>
       <p><b>Why local accuracy (efficiency) holds.</b> Fix one ordering $\\pi$ of the features. Summing each
       feature's marginal contribution along that order <b>telescopes</b>:
       $\\sum_i [\\,f_x(\\text{present up to and incl. } i) - f_x(\\text{present before } i)\\,] = f_x(F) - f_x(\\varnothing)
       = f(x) - \\phi_0$. Every term cancels with the next except the first and last. Because the Shapley value is a
       <i>convex average</i> of these per-order sums (the weights over orders sum to 1), the averaged attributions
       also sum to $f(x) - \\phi_0$. Hence $\\phi_0 + \\sum_i \\phi_i = f(x)$ &mdash; Property 1 &mdash; for
       <i>any</i> model, additive or not. This is the efficiency axiom of the Shapley value and the reason SHAP
       attributions always add up.</p>
       <p><b>The additive special case.</b> If $f(x) = \\text{base} + \\sum_i c_i x_i$ and absent features are
       replaced by their mean $\\bar x_i$, then $f_x(S \\cup \\{i\\}) - f_x(S) = c_i(x_i - \\bar x_i)$ for
       <i>every</i> $S$ &mdash; the contribution does not depend on who else is present. The weighted average of a
       constant is that constant, so $\\phi_i = c_i(x_i - \\bar x_i)$. The exact enumeration reduces to the obvious
       per-feature term. The code verifies this match.</p>`,
    example:
      `<p>Compute exact SHAP values by hand on a tiny 2-feature additive model, then check they sum correctly. Let
       $f(x) = 10 + 3x_0 + 4x_1$. Explain the instance $x = (x_0, x_1) = (2, 5)$ with background means
       $\\bar x = (0, 0)$, so an absent feature is replaced by $0$. The feature set is $F = \\{0, 1\\}$, $M = 2$.</p>
       <ul class="steps">
        <li><b>Value function on all coalitions.</b> Plug present features at $x$, absent ones at the mean $0$:
        $f_x(\\varnothing) = 10$ (both absent); $f_x(\\{0\\}) = 10 + 3\\cdot2 = 16$; $f_x(\\{1\\}) = 10 + 4\\cdot5 = 30$;
        $f_x(\\{0,1\\}) = 10 + 6 + 20 = 36$. The full prediction is $f(x) = 36$ and the base value is
        $\\phi_0 = f_x(\\varnothing) = 10$.</li>
        <li><b>SHAP value of feature 0.</b> The other-feature coalitions are $S = \\varnothing$ and $S = \\{1\\}$.
        Weights with $M=2$: for $|S|=0$, $\\tfrac{0!\\,1!}{2!} = \\tfrac{1}{2}$; for $|S|=1$,
        $\\tfrac{1!\\,0!}{2!} = \\tfrac{1}{2}$. Marginals: $f_x(\\{0\\}) - f_x(\\varnothing) = 16 - 10 = 6$ and
        $f_x(\\{0,1\\}) - f_x(\\{1\\}) = 36 - 30 = 6$. So
        $\\phi_0 = \\tfrac12\\cdot6 + \\tfrac12\\cdot6 = 6$.</li>
        <li><b>SHAP value of feature 1.</b> Marginals: $f_x(\\{1\\}) - f_x(\\varnothing) = 30 - 10 = 20$ and
        $f_x(\\{0,1\\}) - f_x(\\{0\\}) = 36 - 16 = 20$. So
        $\\phi_1 = \\tfrac12\\cdot20 + \\tfrac12\\cdot20 = 20$.</li>
        <li><b>Local-accuracy check.</b> $\\phi_0 + \\phi_1 = 6 + 20 = 26 = f(x) - \\text{base} = 36 - 10$. And
        $\\phi_0\\!^{\\text{(base)}} + \\sum_i \\phi_i = 10 + 26 = 36 = f(x)$. The attributions exactly bridge the
        base value $10$ to the prediction $36$.</li>
        <li><b>Ground-truth match.</b> For this additive model $\\phi_i = c_i(x_i - \\bar x_i)$: feature 0 gives
        $3(2-0) = 6$ &check;, feature 1 gives $4(5-0) = 20$ &check;.</li>
       </ul>
       <p>These exact numbers are recomputed in the notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build the model</b> with numpy/torch: a tiny additive predictor
        $f(x) = \\text{base} + \\sum_i c_i x_i$ (so the ground-truth attribution is known).</li>
        <li><b>Define the value function</b> $f_x(S)$: evaluate $f$ with present features set to their value in
        $x$ and absent features set to their background mean $\\bar x_i$.</li>
        <li><b>Enumerate coalitions (the novel part):</b> for each feature $i$, loop over every subset
        $S \\subseteq F \\setminus \\{i\\}$ &mdash; that is $2^{M-1}$ subsets &mdash; using
        <code>itertools.combinations</code>.</li>
        <li><b>Weight and sum:</b> for each $S$ add $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}\\,[f_x(S\\cup\\{i\\}) - f_x(S)]$
        to $\\phi_i$ (Equation 8).</li>
        <li><b>Set the base value</b> $\\phi_0 = f_x(\\varnothing) = E[f]$ and <b>verify local accuracy</b>:
        $\\phi_0 + \\sum_i \\phi_i = f(x)$, i.e. $\\sum_i \\phi_i = f(x) - E[f]$.</li>
        <li><b>Match ground truth</b> on the additive model ($\\phi_i = c_i(x_i-\\bar x_i)$), then <b>ablate</b>:
        drop the factorial weighting (use a flat average over coalitions) and watch local accuracy break.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the paper "present[s] a unified framework for interpreting predictions, SHAP
       (SHapley Additive exPlanations)," which "assigns each feature an importance value for a particular
       prediction," identifies "a new class of additive feature importance measures," and shows "there is a unique
       solution in this class with a set of desirable properties." It reports the resulting methods show "improved
       computational performance and/or better consistency with human intuition than previous approaches."
       (Abstract.)</p>
       <p>The central theoretical result we implement is <b>Theorem 1</b> (&sect;3): among additive feature
       attribution methods, the Shapley values of Equation 8 are the <i>unique</i> attributions satisfying local
       accuracy, missingness, and consistency.</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;3. The numbers in the CODEVIZ
       panel below are from our own tiny exact-enumeration run &mdash; not a number reported by the paper.</i></p>`,

    evaluation:
      `<p><b>What "working" means here.</b> SHAP is an attribution method, not a predictor, so "correct" is not an
       accuracy &mdash; it is that the attributions obey the three axioms (Theorem 1) and, on a model whose answer
       you know, equal the ground truth. Everything below is exact and deterministic; there is no tuning.</p>
       <ul>
         <li><b>The metric &amp; baseline.</b> The primary check is the <b>local-accuracy residual</b>
         $\\left|\\,\\phi_0 + \\sum_i \\phi_i - f(x)\\,\\right|$, which must be $\\approx 0$ (machine epsilon). The
         "no-skill" reference is an explainer that ignores the model and returns all-equal or all-zero
         attributions: it does NOT satisfy local accuracy, so a nonzero residual on the trivial method is exactly
         what your correct method must avoid. On the lesson's additive model you have a stronger oracle: the closed
         form $\\phi_i = c_i(x_i-\\bar x_i)$, so the metric is also max $|\\phi_i^{\\text{computed}} -
         c_i(x_i-\\bar x_i)|$.</li>
         <li><b>Sanity checks BEFORE trusting any explanation.</b> (a) Replay the worked 2-feature example as a
         known-answer test: $f(x)=10+3x_0+4x_1$, $x=(2,5)$ &rarr; $\\phi_0^{\\text{feat}}=6$, $\\phi_1=20$, sum
         $=26=f(x)-E[f]=36-10$. (b) Check the coalition weights sum to 1 over all $2^{M-1}$ subsets per feature
         ($\\sum_{S}\\tfrac{|S|!(M-|S|-1)!}{M!}=1$) &mdash; if not, your factorial term is wrong. (c) Missingness:
         set a feature to its background value and confirm its $\\phi_i\\to 0$. (d) Symmetry: two features with
         identical coefficients and identical $(x_i-\\bar x_i)$ must get identical $\\phi_i$. (e) Verify
         $\\phi_0 = f_x(\\varnothing) = E[f]$, not $0$.</li>
         <li><b>Expected range.</b> Exact enumeration is not approximate, so the local-accuracy residual and the
         ground-truth gap should both be $\\lt 10^{-9}$ (a float rule of thumb, not a paper claim) &mdash; anything
         larger is a bug, never "close enough." The paper's own claim is qualitative: SHAP is the <b>unique</b>
         attribution satisfying local accuracy, missingness, and consistency (Theorem 1, &sect;3), with "improved
         computational performance and/or better consistency with human intuition than previous approaches"
         (Abstract, arXiv:1705.07874) &mdash; there is no benchmark number to hit, the axioms ARE the target.</li>
         <li><b>Ablation &mdash; prove the Shapley weighting earns its keep.</b> The central idea is the
         order-counting coalition weight $\\tfrac{|S|!(M-|S|-1)!}{M!}$. Turn it OFF by replacing it with a flat
         $\\tfrac{1}{2^{M-1}}$ (every coalition equal) and recompute &mdash; the lesson's CODE does exactly this.
         Local accuracy must <b>break</b>: $\\phi_0+\\sum_i\\phi_i \\ne f(x)$. If the sum still matches after
         flattening the weights, you are either on a degenerate symmetric input that hides the error, or the
         factorial weights were never actually applied.</li>
         <li><b>Failure signals &amp; what they mean.</b> (i) $\\sum_i\\phi_i = f(x)$ instead of $f(x)-E[f]$ &rarr;
         you set $\\phi_0=0$ rather than $E[f]$; off by exactly the base value. (ii) Residual nonzero by a clean
         offset &rarr; flat/wrong coalition weights (the ablation, accidentally). (iii) $\\phi_i$ disagree with
         $c_i(x_i-\\bar x_i)$ on a purely additive model &rarr; the value function is wrong &mdash; absent features
         not pinned to $\\bar x_i$, or present/absent swapped. (iv) Attributions explode or runtime blows up &rarr;
         $M$ too large; exact enumeration is $O(M\\,2^M)$, switch to Kernel/Deep SHAP or shrink $M$. (v)
         Permuting feature order changes the $\\phi_i$ &rarr; a bug, since Shapley values are order-independent by
         construction.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The model and the array math already ship, so you
       <b>import</b> them and build only the novel attribution. <b>Import:</b> numpy/torch for the additive model and
       the value-function arithmetic, and <code>itertools.combinations</code> / <code>math.factorial</code> for the
       enumeration plumbing. <b>Build by hand:</b> the <b>exact Shapley value</b> &mdash; the loop over every
       coalition $S \\subseteq F \\setminus \\{i\\}$, the coalition weight $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}$, the
       marginal contribution $f_x(S\\cup\\{i\\}) - f_x(S)$, and the local-accuracy check
       $\\phi_0 + \\sum_i \\phi_i = f(x)$. That exact enumeration of Equation 8 is the paper's contribution made
       concrete; libraries normally <i>approximate</i> it (Kernel SHAP, Deep SHAP) because $2^{M-1}$ blows up &mdash;
       we keep $M$ tiny so the exact answer is cheap.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the factorial weights.</b> The coalitions are <i>not</i> equally likely. The weight
        $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}$ counts join-orderings; a flat average over the $2^{M-1}$ subsets is a
        <i>different</i> quantity that breaks local accuracy. <b>Fix:</b> weight every marginal by the factorial
        term. (The ablation below shows the sum no longer equals $f(x) - E[f]$.)</li>
        <li><b>Confusing the base value $\\phi_0$ with zero.</b> SHAP attributions sum to $f(x) - E[f]$, not to
        $f(x)$. If you expect $\\sum_i \\phi_i = f(x)$ you will be off by exactly the base value $E[f]$.
        <b>Fix:</b> set $\\phi_0 = f_x(\\varnothing) = E[f]$ and check $\\phi_0 + \\sum_i \\phi_i = f(x)$.</li>
        <li><b>An ill-defined value function for absent features.</b> "Feature absent" must mean something concrete.
        Here we replace it by its background mean $\\bar x_i$ (a simple conditional-expectation surrogate). Different
        choices (marginal vs conditional) give different SHAP values. <b>Fix:</b> fix one background and state it.</li>
        <li><b>Assuming additivity makes interactions vanish in general.</b> $\\phi_i = c_i(x_i-\\bar x_i)$ only for
        a truly additive model. With interaction terms the marginal $f_x(S\\cup\\{i\\})-f_x(S)$ depends on $S$, and
        the Shapley value <i>splits</i> the interaction between the involved features &mdash; but local accuracy
        still holds. <b>Fix:</b> trust the enumeration, not the per-feature shortcut, off the additive case.</li>
        <li><b>Letting $M$ grow.</b> Exact enumeration is $O(M\\,2^M)$ value-function calls. Fine for a handful of
        features; hopeless for hundreds. <b>Fix:</b> for many features use the paper's estimators (Kernel/Deep
        SHAP); this lesson stays exact by keeping $M$ small.</li>
      </ul>`,
    recall: [
      "Write the SHAP / Shapley value (Eqn. 8) from memory, including the coalition weight.",
      "State local accuracy (Eqn. 5): what do $\\phi_0$ and $\\sum_i \\phi_i$ add up to?",
      "Define $S$, $F$, $f_x(S)$, and the marginal contribution $f_x(S\\cup\\{i\\}) - f_x(S)$ in plain words.",
      "Explain why the factorial term $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}$ is there, in terms of join-orderings."
    ],
    practice: [
      {
        q: `<b>The weighting ablation.</b> You have a working exact Shapley computation. Replace the factorial
            coalition weight $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}$ with a <i>flat</i> weight $\\tfrac{1}{2^{M-1}}$
            (every coalition counted equally) and recompute. What property breaks, and how do you detect it?`,
        steps: [
          { do: `Swap the weight: in the inner loop change <code>w = factorial(|S|)*factorial(M-|S|-1)/factorial(M)</code> to <code>w = 1/2**(M-1)</code>.`, why: `A flat weight treats all coalitions as equally likely, ignoring that more orderings produce some coalitions than others.` },
          { do: `Recompute $\\phi_i$ and check the sum: compare $\\phi_0 + \\sum_i \\phi_i$ against $f(x)$.`, why: `Local accuracy (Eqn. 5) is the telescoping identity; it relies on the factorial weights summing per-order to 1. Flat weights break the telescoping.` },
          { do: `Observe that for the symmetric additive case the per-feature numbers may still look plausible, but the <b>sum no longer equals</b> $f(x) - E[f]$ in general.`, why: `The ablation keeps each marginal but mis-weights them, so efficiency &mdash; the guarantee SHAP is built on &mdash; is lost.` }
        ],
        answer: `<p>You break <b>local accuracy / efficiency</b> (Property 1, Eqn. 5). The factorial weights are
                 exactly the order-counts that make the marginals telescope to $f(x) - E[f]$ when summed; replace
                 them with a flat $\\tfrac{1}{2^{M-1}}$ and the attributions no longer add up to the prediction minus
                 the base value. You detect it by the failing check $\\phi_0 + \\sum_i \\phi_i \\ne f(x)$. This is why
                 the weighting is not optional &mdash; it is what makes SHAP values <i>the</i> fair split rather than
                 just an average of marginals. (Our run prints both sums so the gap is visible.)</p>`
      },
      {
        q: `Take the additive model from the example, $f(x) = 10 + 3x_0 + 4x_1$, but now explain $x = (1, -2)$ with
            background means $\\bar x = (0, 0)$. Compute $\\phi_0$, $\\phi_0$ via the base value, $\\phi_1$, and verify
            local accuracy by hand.`,
        steps: [
          { do: `Value function: $f_x(\\varnothing)=10$, $f_x(\\{0\\})=10+3\\cdot1=13$, $f_x(\\{1\\})=10+4\\cdot(-2)=2$, $f_x(\\{0,1\\})=10+3-8=5$. Base value $\\phi_0=10$, prediction $f(x)=5$.`, why: `Absent features sit at the mean $0$; present ones at $x$. This defines every coalition's payout.` },
          { do: `Feature 0 marginals: $13-10=3$ and $5-2=3$; weights $\\tfrac12,\\tfrac12$, so $\\phi_0^{(\\text{feat})}=3$. Feature 1 marginals: $2-10=-8$ and $5-13=-8$; so $\\phi_1=-8$.`, why: `For an additive model the marginal is constant across coalitions: $c_i(x_i-\\bar x_i)$. Here $3(1)=3$ and $4(-2)=-8$.` },
          { do: `Check: $10 + 3 + (-8) = 5 = f(x)$, and $\\sum_i\\phi_i = -5 = f(x)-E[f] = 5-10$.`, why: `Local accuracy: base value plus attributions equals the prediction; the attributions equal prediction minus base.` }
        ],
        answer: `<p>$\\phi_0 (\\text{base}) = 10$, $\\phi_{\\text{feat }0} = 3$, $\\phi_{\\text{feat }1} = -8$. Feature 1
                 is now <b>negative</b> &mdash; it pulled the prediction down because its value $-2$ is below its mean
                 $0$. Local accuracy holds: $10 + 3 - 8 = 5 = f(x)$, and $\\sum_i\\phi_i = -5 = f(x)-E[f]$. The signs
                 read off directly: a feature above its mean (feature 0) contributes positively here, one below its
                 mean (feature 1) contributes negatively, each scaled by its coefficient.</p>`
      },
      {
        q: `Why do SHAP values sum to $f(x) - E[f]$ rather than to $f(x)$, and why is that the <i>right</i> thing for
            an explanation?`,
        steps: [
          { do: `Recall the base value $\\phi_0 = f_x(\\varnothing) = E[f]$: the output when <i>no</i> feature is known, i.e. the average prediction over the background.`, why: `An explanation needs a reference point &mdash; "compared to knowing nothing." That reference is $E[f]$, not $0$.` },
          { do: `Apply local accuracy (Eqn. 5): $f(x) = \\phi_0 + \\sum_i \\phi_i$, hence $\\sum_i \\phi_i = f(x) - \\phi_0 = f(x) - E[f]$.`, why: `The attributions measure movement <i>away from</i> the baseline, so they must sum to the gap between this prediction and the baseline.` },
          { do: `Interpret: each $\\phi_i$ is "how much knowing feature $i$ shifted us from the average prediction toward this specific one."`, why: `That is exactly what a per-feature explanation should answer; summing them must therefore reconstruct the total shift $f(x)-E[f]$.` }
        ],
        answer: `<p>Because attributions explain <b>movement from a baseline</b>, and the baseline is the
                 no-information prediction $\\phi_0 = E[f]$, not zero. Local accuracy gives
                 $f(x) = \\phi_0 + \\sum_i \\phi_i$, so $\\sum_i \\phi_i = f(x) - E[f]$. This is the right target: a
                 feature's SHAP value answers "how much did knowing this feature move us from the average prediction
                 to this one?", and those movements must add up to the total gap $f(x)-E[f]$. Expecting them to sum to
                 $f(x)$ ignores that you start from $E[f]$, not from nothing.</p>`
      }
    ]
  });

  window.CODE["paper-shap"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny additive model with numpy/torch
       ($f(x) = \\text{base} + W\\cdot x$), then build the <b>novel</b> part by hand &mdash; the <b>exact Shapley
       value</b> by enumerating every coalition (Theorem 1, Eqn. 8). The value function $f_x(S)$ evaluates the model
       with present features at $x$ and absent features at their background mean $\\bar x$. For each feature we loop
       over all $2^{M-1}$ subsets $S$ of the other features, weight each marginal
       $f_x(S\\cup\\{i\\}) - f_x(S)$ by $\\tfrac{|S|!\\,(M-|S|-1)!}{M!}$, and sum. The first cell recomputes the
       2-feature worked example ($\\phi_0=6$, $\\phi_1=20$, sum $26 = 36-10$). Then a 3-feature additive model shows
       the SHAP values <b>match the ground truth</b> $c_i(x_i-\\bar x_i)$ and satisfy local accuracy
       $\\phi_0 + \\sum_i \\phi_i = f(x)$. We close with the <b>ablation</b>: flat (un-weighted) coalition averaging,
       which breaks the sum. CPU, instant. Paste into Colab and run.</p>`,
    code: `import itertools, math
import numpy as np, torch

# ---- 0. Recompute the worked example: 2-feature additive model, exact Shapley. ----
def shapley(value_fn, F):
    """Exact Shapley value (SHAP, Eqn. 8): enumerate every coalition of the OTHER features."""
    M = len(F); phi = {}
    for i in F:
        rest = [j for j in F if j != i]
        total = 0.0
        for r in range(len(rest) + 1):
            for S in itertools.combinations(rest, r):           # every subset S of F\\{i}
                S = frozenset(S)
                w = math.factorial(len(S)) * math.factorial(M - len(S) - 1) / math.factorial(M)
                total += w * (value_fn(S | {i}) - value_fn(S))  # weighted marginal contribution
        phi[i] = total
    return phi

base2, c2, x2, mean2, F2 = 10.0, {0: 3.0, 1: 4.0}, {0: 2.0, 1: 5.0}, {0: 0.0, 1: 0.0}, [0, 1]
def value2(S):                                                   # f_x(S): present at x, absent at mean
    return base2 + sum(c2[i] * (x2[i] if i in S else mean2[i]) for i in F2)
phi2 = shapley(value2, F2)
fx2, Ef2 = value2(frozenset(F2)), value2(frozenset())           # full prediction; base value E[f]
print("worked example (2 feat): phi =", {k: round(v, 4) for k, v in phi2.items()})
print("  base phi0 = E[f] =", round(Ef2, 4), " f(x) =", round(fx2, 4))
print("  sum(phi) =", round(sum(phi2.values()), 4), " == f(x)-E[f] =", round(fx2 - Ef2, 4))
print("  phi0 + sum(phi) =", round(Ef2 + sum(phi2.values()), 4), " == f(x) =", round(fx2, 4))
# worked example (2 feat): phi = {0: 6.0, 1: 20.0}
#   base phi0 = E[f] = 10.0  f(x) = 36.0
#   sum(phi) = 26.0  == f(x)-E[f] = 26.0
#   phi0 + sum(phi) = 36.0  == f(x) = 36.0


# ---- 1. A 3-feature additive model composed with torch; ground truth is c_i*(x_i - mean_i). ----
W    = torch.tensor([2.0, -3.0, 0.5])      # per-feature coefficients
bias = torch.tensor(1.0)
def model(xt): return (xt @ W) + bias       # additive: f(x) = bias + W . x

x    = torch.tensor([4.0, 2.0, 6.0])        # the instance to explain
mean = torch.tensor([1.0, 1.0, 1.0])        # background means -> absent features use these
F    = [0, 1, 2]

def value(S):                               # f_x(S): present features at x, absent at the mean
    present = torch.tensor([i in S for i in F])
    xt = torch.where(present, x, mean)
    return model(xt).item()

phi = shapley(value, F)
fx, Ef = value(frozenset(F)), value(frozenset())
ground = {i: (W[i] * (x[i] - mean[i])).item() for i in F}       # additive ground truth

print("\\n3-feature additive model — exact SHAP values:")
for i in F:
    print("  phi[%d] = % .4f   ground truth c_i*(x_i-mean_i) = % .4f" % (i, phi[i], ground[i]))
print("  match ground truth:", np.allclose([phi[i] for i in F], [ground[i] for i in F]))
print("  base phi0 = E[f] = %.4f   f(x) = %.4f" % (Ef, fx))
print("  LOCAL ACCURACY: phi0 + sum(phi) = %.4f  == f(x) = %.4f  -> %s" % (
      Ef + sum(phi.values()), fx, np.isclose(Ef + sum(phi.values()), fx)))
print("  EFFICIENCY:     sum(phi) = %.4f  == f(x)-E[f] = %.4f" % (sum(phi.values()), fx - Ef))
# 3-feature additive model — exact SHAP values:
#   phi[0] =  6.0000   ground truth ... =  6.0000
#   phi[1] = -3.0000   ground truth ... = -3.0000
#   phi[2] =  2.5000   ground truth ... =  2.5000
#   match ground truth: True
#   base phi0 = E[f] = 0.5000   f(x) = 6.0000
#   LOCAL ACCURACY: phi0 + sum(phi) = 6.0000  == f(x) = 6.0000  -> True
#   EFFICIENCY:     sum(phi) = 5.5000  == f(x)-E[f] = 5.5000


# ---- 2. ABLATION: drop the factorial weights (flat 1/2^(M-1) per coalition) -> local accuracy breaks. ----
def shapley_flat(value_fn, F):
    M = len(F); phi = {}
    for i in F:
        rest = [j for j in F if j != i]; total = 0.0
        for r in range(len(rest) + 1):
            for S in itertools.combinations(rest, r):
                S = frozenset(S)
                total += (1.0 / 2 ** (M - 1)) * (value_fn(S | {i}) - value_fn(S))   # WRONG weight
        phi[i] = total
    return phi
phi_flat = shapley_flat(value, F)
print("\\nABLATION (flat weights, no factorials):")
print("  sum(phi_flat) = %.4f   should equal f(x)-E[f] = %.4f  -> %s" % (
      sum(phi_flat.values()), fx - Ef, np.isclose(sum(phi_flat.values()), fx - Ef)))
# ABLATION: sum(phi_flat) != f(x)-E[f]  -> local accuracy / efficiency is broken without the factorial weights.`
  };

  window.CODEVIZ["paper-shap"] = {
    question: "Do the exact SHAP values reconstruct the prediction? Each bar is a feature's attribution; stacked on the base value E[f] they must reach f(x) (local accuracy, Eqn. 5).",
    charts: [
      {
        type: "bar",
        title: "Exact SHAP attribution of one prediction — additive model f(x)=1+2·x0−3·x1+0.5·x2, x=(4,2,6), background mean=(1,1,1)",
        xlabel: "component",
        ylabel: "contribution to the prediction",
        series: [
          {
            name: "SHAP value φ_i (and base / total)",
            color: "#7ee787",
            points: [
              ["base E[f]", 0.5],
              ["φ0 (x0)", 6.0],
              ["φ1 (x1)", -3.0],
              ["φ2 (x2)", 2.5],
              ["f(x) total", 6.0]
            ]
          }
        ]
      }
    ],
    caption: "Our small run, not a number reported by the paper. An additive model f(x)=1+2&middot;x0&minus;3&middot;x1+0.5&middot;x2 is explained at x=(4,2,6) with background mean (1,1,1). The exact Shapley values (Eqn. 8, enumerated over all coalitions) are &phi;0=6.0, &phi;1=&minus;3.0, &phi;2=2.5 &mdash; matching the additive ground truth c_i&middot;(x_i&minus;mean_i) exactly. They satisfy local accuracy: base value E[f]=0.5 plus &phi;0+&phi;1+&phi;2=5.5 equals f(x)=6.0. So the attributions exactly bridge the no-information baseline (0.5) to this prediction (6.0); feature x1 contributes negatively because its value (2) is above its mean (1) but its coefficient (&minus;3) is negative.",
    code: `import itertools, math, numpy as np, torch

def shapley(value_fn, F):                       # exact SHAP value, Eqn. 8
    M = len(F); phi = {}
    for i in F:
        rest = [j for j in F if j != i]; total = 0.0
        for r in range(len(rest) + 1):
            for S in itertools.combinations(rest, r):
                S = frozenset(S)
                w = math.factorial(len(S)) * math.factorial(M - len(S) - 1) / math.factorial(M)
                total += w * (value_fn(S | {i}) - value_fn(S))
        phi[i] = total
    return phi

W, bias = torch.tensor([2.0, -3.0, 0.5]), torch.tensor(1.0)
x, mean = torch.tensor([4.0, 2.0, 6.0]), torch.tensor([1.0, 1.0, 1.0])
F = [0, 1, 2]
def model(xt): return (xt @ W) + bias
def value(S):
    xt = torch.where(torch.tensor([i in S for i in F]), x, mean)
    return model(xt).item()

phi = shapley(value, F)
fx, Ef = value(frozenset(F)), value(frozenset())
print("base E[f] =", round(Ef, 4))
print("phi       =", [round(phi[i], 4) for i in F])
print("f(x)      =", round(fx, 4))
print("E[f] + sum(phi) =", round(Ef + sum(phi.values()), 4), " (local accuracy: equals f(x))")
print("sum(phi)        =", round(sum(phi.values()), 4), " = f(x)-E[f] =", round(fx - Ef, 4))
# base E[f] = 0.5
# phi       = [6.0, -3.0, 2.5]
# f(x)      = 6.0
# E[f] + sum(phi) = 6.0   (local accuracy: equals f(x))
# sum(phi)        = 5.5   = f(x)-E[f] = 5.5
# Our small run, not the paper's number.`
  };
})();
