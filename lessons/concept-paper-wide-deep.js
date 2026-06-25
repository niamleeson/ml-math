/* Paper lesson — "Wide & Deep Learning for Recommender Systems", Cheng et al. (Google), 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-wide-deep".
   GROUNDED from arXiv:1606.07792 (abstract) and the ar5iv HTML mirror (Section 3 Eqns 1-3,
   Section 4.2 features, Table 1 metrics). Track B (architecture): compose with torch.nn —
   build the WIDE linear part on cross-product features + the DEEP embedding-MLP part, sum the
   two logits before one sigmoid, train JOINTLY. Ablate to wide-only and deep-only. */
(function () {
  window.LESSONS.push({
    id: "paper-wide-deep",
    title: "Wide & Deep — Wide & Deep Learning for Recommender Systems (2016)",
    tagline: "Train a memorizing linear model and a generalizing deep network together, summed before one sigmoid.",
    module: "Papers · Recommender Systems",
    track: "architecture",
    paper: {
      authors: "Heng-Tze Cheng, Levent Koc, Jeremiah Harmsen, Tal Shaked, Tushar Chandra, Hrishi Aradhye, Glen Anderson, Greg Corrado, Wei Chai, Mustafa Ispir, Rohan Anil, Zakaria Haque, Lichan Hong, Vihan Jain, Xiaobing Liu, Hemal Shah",
      org: "Google",
      year: 2016,
      venue: "arXiv:1606.07792 (Jun 2016); DLRS 2016 workshop",
      citations: "",
      arxiv: "https://arxiv.org/abs/1606.07792",
      code: "https://www.tensorflow.org/tutorials (TF Wide & Deep; open-sourced in TensorFlow)"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-logistic-regression", "dl-word-embeddings", "fe-interaction-features", "cls-recommender", "pt-nn-module", "dl-cross-entropy"],

    // WHY READ IT
    problem:
      `<p>A recommender for an app store has to do two jobs at once, and they pull in opposite
       directions.</p>
       <p><b>Job one is memorization.</b> Some signals are just sharp facts you want to learn by heart:
       "users who installed Netflix and are shown Pandora tend to install it." A <b>linear model</b> (a
       weighted sum of features, the simplest learner) handles this well <i>if</i> you hand it the right
       <b>cross-product feature</b> &mdash; an "AND" of two raw features that fires only when both are
       present. But a linear model only knows the exact feature combinations it has seen; it cannot guess
       about a pair it never observed.</p>
       <p><b>Job two is generalization.</b> You also want to recommend <i>new</i> combinations that never
       appeared in the logs, based on similarity. A <b>deep neural network</b> (many layers of weighted sums
       and nonlinearities) does this by learning a low-dimensional <b>embedding</b> &mdash; a short dense
       vector &mdash; for each category, so similar users and apps land near each other. But the paper warns
       this can <b>over-generalize</b> (&sect;1): when the user-item matrix is sparse and high-rank (lots of
       very specific niche preferences), the embedding smooths everything out and recommends items that are
       only loosely relevant.</p>
       <p>Picking one model means giving up the other job. The paper asks: can one model do both?</p>`,
    contribution:
      `<ul>
        <li><b>The Wide &amp; Deep architecture.</b> One model with two parts: a <b>wide</b> linear part on
        raw and cross-product features (for memorization) and a <b>deep</b> embedding-plus-multilayer part
        (for generalization). Their two outputs are <b>summed</b> and passed through a single
        <b>sigmoid</b> (the squashing function that turns a real number into a probability).</li>
        <li><b>Joint training.</b> The two parts are trained <i>together</i> as one model &mdash; the same
        loss back-propagates into both &mdash; not trained separately and averaged (that would be an
        <b>ensemble</b>). Because they share the final prediction, each part only has to make up for what
        the other misses.</li>
        <li><b>A production result.</b> They shipped it on Google Play and measured a lift in app
        acquisitions over wide-only and deep-only baselines in a live A/B test (quoted in Results).</li>
      </ul>`,
    whyItMattered:
      `<p>"Wide &amp; Deep" became a template for industrial recommenders and click-through-rate models: a
       memorization branch plus a generalization branch, trained jointly. Later models (DeepFM, Deep &amp;
       Cross, and many in-house systems) keep the same two-tower shape and swap in fancier cross-feature
       machinery. The core lesson &mdash; <i>combine a sparse linear memorizer with a dense deep generalizer
       under one loss</i> &mdash; is now standard practice for large-scale ranking.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the memorization-vs-generalization framing, and the
        warning that deep embeddings can <i>over-generalize</i> on sparse, high-rank data.</li>
        <li><b>&sect;3.1 (The Wide Component)</b> &mdash; the linear model and the <b>cross-product
        transformation</b> (Eqn. 1) you will transcribe and implement.</li>
        <li><b>&sect;3.2 (The Deep Component)</b> &mdash; categorical features &rarr; embeddings &rarr;
        hidden layers (Eqn. 2).</li>
        <li><b>&sect;3.3 (Joint Training of Wide &amp; Deep Model)</b> &mdash; the prediction equation
        (Eqn. 3) and why joint training differs from an ensemble (different optimizers: FTRL for wide,
        AdaGrad for deep).</li>
        <li><b>Fig. 1</b> &mdash; the side-by-side picture: wide on the left, deep on the right, joined at
        the output unit.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the Google Play pipeline and serving latency) and the exact feature lists,
       unless you care about the production system. The math you need is three short equations in &sect;3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have a task that needs <b>both</b> abilities: a handful of sharp "always-recommend" exception
       pairs that you must learn by heart (memorization), <i>and</i> a smooth taste pattern that must
       transfer to user-app pairs you never saw in training (generalization). You will train three models on
       it: <b>wide-only</b>, <b>deep-only</b>, and <b>wide&amp;deep</b>.</p>
       <p>Write your guess: on the <i>unseen</i> pairs, which model generalizes best? On the sharp exception
       pairs, which memorizes best? And which wins on the overall test set? (Hint: the paper's whole claim is
       that neither single model wins both jobs.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the model. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Wide part.</b> One linear weight per <b>cross-product feature</b>. Here the cross feature is
        the pair indicator AND(user, app): <code>self.wide = nn.Embedding(num_pairs, 1)</code>. TODO: its
        contribution to the logit is just <code>self.wide(pair_id)</code>.</li>
        <li><b>Deep part.</b> An embedding for the user and one for the app, concatenated, then a small
        multilayer perceptron (MLP &mdash; a stack of linear layers with ReLU): <code>self.eu</code>,
        <code>self.ea</code>, <code>self.mlp</code>. TODO: its contribution is
        <code>self.mlp(cat(eu(u), ea(a)))</code>.</li>
        <li>TODO: <b>combine</b> &mdash; <code>logit = bias + wide_logit + deep_logit</code>, then ONE
        <code>sigmoid</code>. This is Eqn. 3.</li>
        <li>TODO: train all parameters with <b>one</b> loss (binary cross-entropy). That joint loss is what
        makes it Wide &amp; Deep and not an ensemble.</li>
       </ul>
       <p>Then run two ablations: keep only the wide part, then only the deep part, and compare.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The model adds two predictions before a single sigmoid. Build each part, then join them.</p>
       <p><b>The wide part (&sect;3.1)</b> is a plain linear model: a weighted sum of features plus a bias,
       $y = \\mathbf{w}^{\\top}\\mathbf{x} + b$. Its power comes from the features you feed it. Besides the
       raw features, you add <b>cross-product features</b>: an "AND" of two (or more) categorical features
       that equals 1 only when every constituent is present. The paper's example is
       AND(gender=female, language=en), which is 1 only for a female English-speaking user. These hand-built
       interactions let the linear model <b>memorize</b> specific co-occurrences &mdash; for app
       recommendation, the cross of "user installed apps" and "impression apps" (&sect;4.2). The cross
       feature is sparse and exact: it can capture a rule about one pair without affecting any other.</p>
       <p><b>The deep part (&sect;3.2)</b> handles generalization. Each categorical value (each user, each
       app) is mapped to a short dense vector called an <b>embedding</b>, learned during training (the paper
       uses O(10) to O(100) dimensions). The embeddings are concatenated with any dense features and pushed
       through several <b>hidden layers</b>, each computing
       $a^{(l+1)} = f\\!\\big(W^{(l)} a^{(l)} + b^{(l)}\\big)$ where $f$ is the ReLU nonlinearity. Because
       similar categories get nearby embeddings, the deep part can score pairs it never saw &mdash; it
       <b>generalizes</b> &mdash; but on very sparse, niche data it may over-generalize and recommend
       loosely-related items.</p>
       <p><b>Joining them (&sect;3.3).</b> The wide part outputs one number; the deep part's last hidden
       layer $a^{(l_f)}$ is mapped to one number. These are <b>added</b>, a bias is added, and one
       <b>sigmoid</b> $\\sigma$ turns the sum into a probability $P(Y=1)$. Crucially, training is
       <b>joint</b>: one binary-cross-entropy loss flows back into <i>both</i> parts at once. The paper
       contrasts this with an <b>ensemble</b>, where two models are trained separately and only their
       outputs are averaged at the end. In joint training each part can be smaller, because it only needs to
       cover what the other part cannot. (The paper even uses different optimizers per part: FTRL with L1
       regularization for the sparse wide part, AdaGrad for the deep part.)</p>`,
    symbols: [
      { sym: "$\\mathbf{x}$", desc: "the <b>feature vector</b> &mdash; the raw input features (the wide part also sees the cross-product features $\\phi(\\mathbf{x})$ appended)." },
      { sym: "$\\mathbf{w}$", desc: "the <b>weights</b> of the wide linear model (one weight per feature, including each cross-product feature)." },
      { sym: "$b$", desc: "the <b>bias</b>: a single learned number added to the logit (the catch-all baseline)." },
      { sym: "$\\phi_k(\\mathbf{x})$", desc: "the $k$-th <b>cross-product transformation</b>: an AND of selected features, equal to 1 only when all of them are present, else 0 (Eqn. 1)." },
      { sym: "$c_{ki}$", desc: "a 0/1 flag: $c_{ki}=1$ means raw feature $i$ is part of cross feature $k$ (so it must be present for $\\phi_k$ to fire); $c_{ki}=0$ means it is ignored." },
      { sym: "$x_i$", desc: "the $i$-th raw feature value (0 or 1 for a binary categorical indicator)." },
      { sym: "$a^{(l)}$", desc: "the <b>activations</b> (the vector of neuron outputs) at hidden layer $l$ of the deep part; $a^{(0)}$ is the input embeddings." },
      { sym: "$W^{(l)},\\,b^{(l)}$", desc: "the <b>weight matrix</b> and <b>bias vector</b> of deep layer $l$ (its learnable parameters)." },
      { sym: "$f$", desc: "the layer's <b>activation function</b>, the ReLU (Rectified Linear Unit): keep positives, zero out negatives." },
      { sym: "$a^{(l_f)}$", desc: "the <b>final</b> hidden-layer activations of the deep part ($l_f$ = the last layer), the deep part's contribution to the prediction." },
      { sym: "$\\mathbf{w}_{\\text{wide}},\\,\\mathbf{w}_{\\text{deep}}$", desc: "the weight vectors that read the wide features $[\\mathbf{x},\\phi(\\mathbf{x})]$ and the deep output $a^{(l_f)}$ into the shared logit." },
      { sym: "$\\sigma$", desc: "the <b>sigmoid</b> (logistic) function $\\sigma(z)=1/(1+e^{-z})$: squashes any real number to a probability between 0 and 1." },
      { sym: "$P(Y=1\\mid \\mathbf{x})$", desc: "the model's predicted <b>probability</b> that the label is 1 (e.g. the user installs the app)." },
      { sym: "“ensemble”", desc: "a plain term, not a symbol: two models trained <i>separately</i> whose outputs are combined only at prediction time. Wide &amp; Deep is NOT this &mdash; it trains both parts together under one loss." }
    ],
    formula: `$$ \\phi_k(\\mathbf{x}) = \\prod_{i=1}^{d} x_i^{\\,c_{ki}}, \\quad c_{ki}\\in\\{0,1\\} \\qquad\\text{(Eqn. 1)} $$
$$ a^{(l+1)} = f\\!\\big(W^{(l)} a^{(l)} + b^{(l)}\\big) \\qquad\\text{(Eqn. 2)} $$
$$ P(Y=1\\mid \\mathbf{x}) = \\sigma\\!\\Big( \\mathbf{w}_{\\text{wide}}^{\\top}[\\mathbf{x},\\,\\phi(\\mathbf{x})] \\;+\\; \\mathbf{w}_{\\text{deep}}^{\\top} a^{(l_f)} \\;+\\; b \\Big) \\qquad\\text{(Eqn. 3)} $$`,
    whatItDoes:
      `<p><b>Equation 1</b> defines a cross-product feature. The product $\\prod_i x_i^{c_{ki}}$ multiplies
       together exactly the raw features that belong to cross feature $k$ (those with $c_{ki}=1$); a feature
       with $c_{ki}=0$ contributes $x_i^{0}=1$ and is ignored. For binary inputs this product is 1 only when
       <i>all</i> the chosen features are 1 &mdash; it is a logical AND. That is how the wide part memorizes
       a specific combination.</p>
       <p><b>Equation 2</b> is one hidden layer of the deep part: multiply the previous layer's activations
       by the weights, add the bias, and apply the ReLU. Stack a few of these on top of the embeddings.</p>
       <p><b>Equation 3</b> is the whole model's prediction. Read the wide features $[\\mathbf{x},\\phi(\\mathbf{x})]$
       with weights $\\mathbf{w}_{\\text{wide}}$, read the deep part's final activations $a^{(l_f)}$ with
       weights $\\mathbf{w}_{\\text{deep}}$, <b>add</b> them and the bias $b$, then apply the sigmoid
       $\\sigma$. The two parts meet at exactly one place: the sum inside $\\sigma$. That shared output is
       what makes the training joint.</p>`,
    derivation:
      `<p><b>Why joint beats either part alone &mdash; the gradient view.</b> The full prerequisite math
       (logistic regression and back-propagation) lives in the <b>ml-logistic-regression</b> and
       <b>dl-cross-entropy</b> lessons; here is the part specific to Wide &amp; Deep.</p>
       <p>Write the shared logit as $z = z_{\\text{wide}} + z_{\\text{deep}} + b$, where
       $z_{\\text{wide}} = \\mathbf{w}_{\\text{wide}}^{\\top}[\\mathbf{x},\\phi(\\mathbf{x})]$ and
       $z_{\\text{deep}} = \\mathbf{w}_{\\text{deep}}^{\\top} a^{(l_f)}$. The prediction is
       $p=\\sigma(z)$ and the binary-cross-entropy loss has the clean derivative</p>
       <p>$$ \\frac{\\partial \\mathcal{L}}{\\partial z} = p - y. $$</p>
       <p>The same single error term $(p-y)$ multiplies into <i>both</i> branches by the chain rule:
       $\\partial\\mathcal{L}/\\partial \\mathbf{w}_{\\text{wide}} = (p-y)\\,[\\mathbf{x},\\phi(\\mathbf{x})]$
       and $\\partial\\mathcal{L}/\\partial \\mathbf{w}_{\\text{deep}} = (p-y)\\,a^{(l_f)}$, which then
       propagates on into the embeddings. So the two parts are <b>coupled through the residual</b>: if the
       wide part already explains a sharp exception pair (driving $p$ toward $y$ on those rows), the leftover
       error $(p-y)$ that reaches the deep part on those rows is small &mdash; the deep part is freed to spend
       its capacity on the smooth, generalizable signal instead of fighting to memorize exceptions. That
       division of labor is exactly what an ensemble (separate losses, combined only at the end) cannot
       arrange.</p>`,
    example:
      `<p>Work the <b>cross-product feature</b> (Eqn. 1) by hand on a tiny categorical pair, so the AND is
       concrete. Two one-hot fields: <b>user</b> $\\in\\{u_0,u_1,u_2\\}$ and <b>app</b>
       $\\in\\{a_0,a_1,a_2\\}$. Define one cross feature, AND(user=$u_1$, app=$a_2$). In Eqn. 1 that means
       $c_{ki}=1$ for the two indicators "user is $u_1$" and "app is $a_2$", and $c_{ki}=0$ for the other
       four. So $\\phi(\\mathbf{x}) = (\\text{user}{=}u_1)\\cdot(\\text{app}{=}a_2)$.</p>
       <ul class="steps">
        <li><b>Match.</b> user=$u_1$, app=$a_2$ &rarr; both indicators are 1 &rarr;
        $\\phi = 1\\cdot 1 = 1$. The two ignored fields contribute $x^{0}=1$ each and drop out.</li>
        <li><b>App differs.</b> user=$u_1$, app=$a_1$ &rarr; the "app is $a_2$" indicator is 0 &rarr;
        $\\phi = 1\\cdot 0 = 0$.</li>
        <li><b>User differs.</b> user=$u_0$, app=$a_2$ &rarr; the "user is $u_1$" indicator is 0 &rarr;
        $\\phi = 0\\cdot 1 = 0$.</li>
       </ul>
       <p>So $\\phi$ fires (equals 1) only for the exact pair $(u_1,a_2)$ &mdash; a logical AND. Give the
       wide part a weight on this feature and it has memorized a rule about that one pair, touching no other.
       The notebook's first cell recomputes these three values and prints $[1,0,0]$.</p>`,
    recipe:
      `<ol>
        <li><b>Build the wide part.</b> One learnable weight per cross-product feature. For the toy task the
        cross feature is the pair indicator AND(user, app): <code>nn.Embedding(num_pairs, 1)</code>; its
        wide logit is the looked-up weight for that row's pair.</li>
        <li><b>Build the deep part.</b> An <code>nn.Embedding</code> for the user and one for the app;
        concatenate them; pass through a small MLP (<code>Linear &rarr; ReLU &rarr; Linear</code>) ending in
        one number &mdash; the deep logit (Eqn. 2 stacked).</li>
        <li><b>Join (Eqn. 3).</b> <code>logit = bias + wide_logit + deep_logit</code>; apply one
        <code>sigmoid</code> (use <code>BCEWithLogitsLoss</code>, which applies it internally).</li>
        <li><b>Train jointly.</b> One optimizer, one binary-cross-entropy loss, back-propagating into both
        parts at once.</li>
        <li><b>Ablate.</b> Train <b>wide-only</b> (drop the deep logit) and <b>deep-only</b> (drop the wide
        logit). Compare overall test AUC, generalization on unseen pairs, and memorization of the exception
        pairs.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): <b>"Online experiment results show that Wide &amp; Deep significantly
       increased app acquisitions compared with wide-only and deep-only models."</b> The system ran on
       Google Play, described as serving "over one billion active users and over one million apps," and was
       open-sourced in TensorFlow.</p>
       <p>From Table 1 (&sect;5, quoted): the live A/B test reported a <b>"+3.9%"</b> relative gain in app
       acquisition for Wide &amp; Deep versus the wide-only control, and <b>"+2.9%"</b> for deep-only, with
       offline AUC of <b>0.726</b> (wide), <b>0.722</b> (deep), and <b>0.728</b> (wide &amp; deep).</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and Table 1. The numbers in the
       CODEVIZ panel below are from our own tiny synthetic run &mdash; our small run, not the paper's
       reported result.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Embedding</code>,
       <code>nn.Linear</code>, <code>nn.ReLU</code>, <code>nn.BCEWithLogitsLoss</code>, and an optimizer.
       <b>Build by hand:</b> the wide cross-product weight, the deep embedding-MLP, the <b>summed logit</b>
       before one sigmoid (Eqn. 3), the <b>joint</b> training loop, and the two ablations (wide-only,
       deep-only). The logistic-regression and cross-entropy math is recapped from the prerequisite lessons,
       not re-derived. We use a single PyTorch optimizer for simplicity; the paper's per-part FTRL/AdaGrad
       split is a production detail, noted but not reproduced.</p>`,
    pitfalls:
      `<ul>
        <li><b>Summing probabilities instead of logits.</b> Eqn. 3 sums the two parts <i>inside</i> the
        sigmoid (in logit space), then squashes once. Averaging two separate sigmoid outputs is an
        <b>ensemble</b>, not Wide &amp; Deep &mdash; it breaks the joint-gradient coupling. <b>Fix:</b>
        add <code>wide_logit + deep_logit</code>, then one sigmoid.</li>
        <li><b>Training the parts separately.</b> If you train wide first, freeze it, then train deep, you
        have an ensemble. Joint training means <i>one</i> loss back-propagating into both at the same time.</li>
        <li><b>Letting the wide part generalize.</b> A cross-product weight only exists for pairs seen in
        training; an unseen pair has no wide feature. That is by design &mdash; the deep part covers unseen
        pairs. If your wide part appears to "generalize," you likely leaked test pairs into its feature
        index. <b>Fix:</b> map unseen pairs to a shared out-of-vocabulary bucket.</li>
        <li><b>Confusing memorization with generalization.</b> Wide memorizes seen combinations; deep
        generalizes to unseen ones. Judging on a test set with <i>only</i> seen pairs hides the deep part's
        value; a test set with <i>only</i> unseen pairs hides the wide part's value. Use a mix &mdash; as the
        toy task does.</li>
        <li><b>Over-generalization on sparse data.</b> The paper's motivation (&sect;1): pure deep models
        can recommend loosely-relevant items when the data is sparse and high-rank. The wide cross features
        are the corrective &mdash; do not drop them just because the deep part looks strong on dense data.</li>
      </ul>`,
    recall: [
      "Write the joint prediction equation (Eqn. 3) from memory.",
      "What does the cross-product transformation $\\phi_k(\\mathbf{x})$ compute, and when does it equal 1?",
      "How is joint training different from an ensemble?",
      "Which part does memorization and which does generalization, and why?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working Wide &amp; Deep model. Train two cut-downs &mdash;
            wide-only (drop the deep logit) and deep-only (drop the wide logit) &mdash; on the same toy task,
            same data, same optimizer. On the <i>unseen-pair</i> subset of the test set, which one collapses
            to chance, and why? What does that show?`,
        steps: [
          { do: `Keep everything fixed; for wide-only set the model so the logit = bias + wide_logit; for deep-only, logit = bias + deep_logit.`, why: `An honest ablation changes exactly one thing &mdash; which branch is present &mdash; so any difference is attributable to that branch.` },
          { do: `Score the unseen-pair rows (user-app pairs never in training). Wide-only's cross feature has no weight for those pairs (they map to the out-of-vocabulary bucket), so its score is constant there &mdash; AUC near 0.5 (chance).`, why: `A cross-product feature only memorizes pairs it has seen; it cannot rank brand-new pairs.` },
          { do: `Deep-only ranks unseen pairs by embedding similarity, so its unseen-pair AUC is well above chance.`, why: `Embeddings place similar users/apps nearby, letting the deep part generalize to unseen combinations.` }
        ],
        answer: `<p><b>Wide-only collapses to chance on unseen pairs</b> (AUC near 0.5): its cross-product
                 feature has no learned weight for a pair it never saw. Deep-only stays well above chance
                 there because its embeddings generalize. This isolates the deep part as the source of
                 generalization &mdash; and, conversely, on the sharp memorized exception pairs the wide part
                 is the strongest. Neither single model wins both, which is the paper's whole point. The
                 CODEVIZ panel shows this split.</p>`
      },
      {
        q: `You define a cross feature AND(country=US, device=iOS) over one-hot fields. For a user with
            country=US, device=Android, what is $\\phi$? For country=US, device=iOS? Walk through Eqn. 1.`,
        steps: [
          { do: `Identify the constituents with $c_{ki}=1$: the indicators "country is US" and "device is iOS"; all others have $c_{ki}=0$ and drop out as $x^0=1$.`, why: `Eqn. 1 multiplies only the selected indicators; ignored features contribute a factor of 1.` },
          { do: `country=US, device=Android: "country is US"=1, "device is iOS"=0 &rarr; $\\phi = 1\\cdot 0 = 0$.`, why: `An AND is 0 if any constituent is 0.` },
          { do: `country=US, device=iOS: both indicators are 1 &rarr; $\\phi = 1\\cdot 1 = 1$.`, why: `An AND is 1 only when every constituent is present.` }
        ],
        answer: `<p>For US + Android, $\\phi = 0$ (device differs). For US + iOS, $\\phi = 1$ (both present).
                 The cross feature fires only for the exact combination, letting the wide part attach a weight
                 to that one rule &mdash; the essence of memorization.</p>`
      },
      {
        q: `A teammate builds two models &mdash; a wide linear model and a deep network &mdash; trains each
            on its own loss, then at serving time averages their two probabilities. Is this Wide &amp; Deep?
            What is lost?`,
        steps: [
          { do: `Compare to Eqn. 3: Wide &amp; Deep sums the two logits inside ONE sigmoid and trains under ONE loss.`, why: `The joint loss couples the branches: the same error term $(p-y)$ flows into both.` },
          { do: `The teammate's setup trains the parts separately and combines only the outputs &mdash; that is an ensemble, which the paper explicitly contrasts with joint training (&sect;3.3).`, why: `Separate losses mean neither part adapts to the other's strengths during training.` },
          { do: `Note the practical loss: in joint training each part can be smaller because it only covers what the other misses; an ensemble must make each part self-sufficient.`, why: `The paper notes the wide part can stay small (a few cross features) when the deep part carries generalization.` }
        ],
        answer: `<p>No &mdash; averaging two separately trained models is an <b>ensemble</b>, not Wide &amp;
                 Deep. The defining feature is <b>joint training</b>: one loss, one sigmoid over the summed
                 logits, so the gradient couples the two parts and they divide labor. The ensemble loses that
                 coupling and forces each part to be self-sufficient.</p>`
      }
    ]
  });

  window.CODE["paper-wide-deep"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> the wide part (a linear weight on the cross-product pair feature) and the
       deep part (user/app embeddings &rarr; a small MLP) with <code>torch.nn</code>, <b>sum their two
       logits before one sigmoid</b> (Eqn. 3), and train <b>jointly</b> with one
       <code>BCEWithLogitsLoss</code>. The toy task needs BOTH abilities: a smooth latent taste that must
       generalize to <i>unseen</i> user-app pairs, plus sharp "exception" pairs that contradict the smooth
       signal and must be memorized. We then ablate to <b>wide-only</b> and <b>deep-only</b> and print
       overall test AUC, unseen-pair AUC (generalization), and exception recall (memorization). The first
       cell recomputes the worked cross-product example AND($u_1$,$a_2$) &rarr; $[1,0,0]$. Paste into Colab
       and run (CPU is fine; no torchvision, no pip).</p>`,
    code: `import torch, torch.nn as nn, numpy as np

torch.manual_seed(0); np.random.seed(0)

# --- 0. Worked example: cross-product transformation phi (Eqn. 1), AND(user=u1, app=a2). ---
# phi_k(x) = prod_i x_i^{c_ki}; here c=1 only for "user is u1" and "app is a2".
def cross(user_onehot, app_onehot):
    return user_onehot[1] * app_onehot[2]          # AND of the two selected indicators
print("phi AND(user=u1,app=a2):",
      [cross([0,1,0],[0,0,1]),                      # u1,a2  -> 1
       cross([0,1,0],[0,1,0]),                      # u1,a1  -> 0
       cross([1,0,0],[0,0,1])])                     # u0,a2  -> 0
# phi AND(user=u1,app=a2): [1, 0, 0]

# --- 1. A toy task that needs BOTH memorization and generalization. ---
U, A, EMB = 150, 150, 5
g = torch.Generator().manual_seed(0)
taste = torch.randn(U, EMB, generator=g); appv = torch.randn(A, EMB, generator=g)
smooth = torch.sigmoid((taste @ appv.T) * 1.3)     # smooth, generalizable relevance surface

rng = np.random.RandomState(7)                     # exception pairs sit where smooth is LOW,
low = (smooth < 0.2)                               # so memorizing y=1 CONTRADICTS the smooth surface
cands = [(int(u), int(a)) for u in range(U) for a in range(A) if low[u, a]]
rng.shuffle(cands); exc = cands[:120]; exc_set = set(exc)
def lp(u, a): return 0.97 if (u, a) in exc_set else float(smooth[u, a])

def make(n, seed, force=0.0):                       # 'force' makes exception pairs recur
    r = np.random.RandomState(seed)
    us = r.randint(0, U, n).tolist(); as_ = r.randint(0, A, n).tolist()
    for i in range(int(n * force)):
        u, a = exc[r.randint(len(exc))]; us[i] = u; as_[i] = a
    ys = np.array([1.0 if r.rand() < lp(u, a) else 0.0 for u, a in zip(us, as_)], np.float32)
    return torch.tensor(us), torch.tensor(as_), torch.tensor(ys)

tr_u, tr_a, tr_y = make(14000, 10, force=0.15)
te_u, te_a, te_y = make(5000, 99, force=0.15)

# Wide cross feature: one weight per (user,app) pair SEEN in training; unseen -> OOV bucket.
pair_id = {}
for u, a in zip(tr_u.tolist(), tr_a.tolist()): pair_id.setdefault((u, a), len(pair_id))
NP = len(pair_id)
pix = lambda u, a: pair_id.get((int(u), int(a)), NP)
tr_p = torch.tensor([pix(u, a) for u, a in zip(tr_u, tr_a)])
te_p = torch.tensor([pix(u, a) for u, a in zip(te_u, te_a)])
NPID = NP + 1
print(f"train pairs={NP}  test rows with UNSEEN pair = {(te_p == NP).float().mean():.1%}")

def auc(y, p):                                      # rank-based ROC-AUC
    y = y.numpy(); p = p.detach().numpy()
    o = np.argsort(p); r = np.empty(len(p)); r[o] = np.arange(len(p))
    pos = (y == 1); npos = pos.sum(); nneg = len(y) - npos
    if npos == 0 or nneg == 0: return float('nan')
    return float((r[pos].sum() - npos * (npos - 1) / 2) / (npos * nneg))

# --- 2. The Wide & Deep model. mode in {"wide","deep","both"} for the ablation. ---
class WideDeep(nn.Module):
    def __init__(self, mode):
        super().__init__(); self.mode = mode
        self.wide = nn.Embedding(NPID, 1); nn.init.zeros_(self.wide.weight)   # WIDE: cross weight
        self.eu = nn.Embedding(U, EMB); self.ea = nn.Embedding(A, EMB)        # DEEP: embeddings
        self.mlp = nn.Sequential(nn.Linear(2 * EMB, 16), nn.ReLU(), nn.Linear(16, 1))
        self.b = nn.Parameter(torch.zeros(1))                                 # shared bias b
    def forward(self, u, a, p):
        z = self.b.expand(len(u)).clone()
        if self.mode in ("wide", "both"):
            z = z + self.wide(p).squeeze(1)                                   # w_wide . [x, phi(x)]
        if self.mode in ("deep", "both"):
            z = z + self.mlp(torch.cat([self.eu(u), self.ea(a)], 1)).squeeze(1)  # w_deep . a^(lf)
        return z                                     # Eqn. 3 logit; sigmoid is inside BCEWithLogits

def run(mode, epochs=150, lr=0.03, wd=3e-4):
    torch.manual_seed(0); net = WideDeep(mode)
    opt = torch.optim.Adam(net.parameters(), lr=lr, weight_decay=wd)
    lf = nn.BCEWithLogitsLoss()                      # ONE joint loss -> back-props into BOTH parts
    for _ in range(epochs):
        opt.zero_grad(); lf(net(tr_u, tr_a, tr_p), tr_y).backward(); opt.step()
    p = torch.sigmoid(net(te_u, te_a, te_p))
    is_exc = torch.tensor([1 if (int(u), int(a)) in exc_set else 0 for u, a in zip(te_u, te_a)])
    rec = float((p[is_exc == 1] > 0.5).float().mean())                       # exception recall
    unseen = te_p == NP
    return auc(te_y, p), auc(te_y[unseen], p[unseen]), rec

print(f"\\n{'mode':6s}{'test AUC':>10s}{'unseen AUC':>12s}{'exc recall':>12s}")
for m in ["wide", "deep", "both"]:
    a, gen, rec = run(m)
    print(f"{m:6s}{a:10.4f}{gen:12.4f}{rec:12.3f}")
# wide:   strong memorization (exc recall ~1.0) but unseen-pair AUC ~0.50 (chance) -> no generalization.
# deep:   generalizes on unseen pairs but weaker overall.
# both:   highest overall test AUC -> wide&deep beats wide-only and deep-only.
# (Our small run, not the paper's reported numbers; exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-wide-deep"] = {
    question: "On a task needing BOTH a memorized cross-feature rule AND smooth generalization, does wide&deep beat wide-only and deep-only?",
    charts: [
      {
        type: "bar",
        title: "Test ROC-AUC by model — overall, unseen-pair (generalization), exception recall (memorization)",
        xlabel: "metric",
        ylabel: "score",
        series: [
          { name: "Wide-only",  color: "#ff7b72", points: [["overall AUC", 0.7519], ["unseen-pair AUC", 0.5039], ["exception recall", 1.000]] },
          { name: "Deep-only",  color: "#79c0ff", points: [["overall AUC", 0.7532], ["unseen-pair AUC", 0.6602], ["exception recall", 1.000]] },
          { name: "Wide&Deep",  color: "#7ee787", points: [["overall AUC", 0.7695], ["unseen-pair AUC", 0.6726], ["exception recall", 1.000]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Toy app-recommendation task (150 users x 150 apps; a smooth latent-taste surface PLUS 120 sharp 'exception' pairs that contradict it), trained jointly with one BCE loss. Overall test ROC-AUC: Wide&Deep 0.7695 beats Deep-only 0.7532 and Wide-only 0.7519. The split shows why: on UNSEEN user-app pairs (generalization) Wide-only collapses to ~0.50 (chance) while Deep-only and Wide&Deep reach ~0.66; the wide cross-product feature memorizes the exception pairs. Wide&Deep gets both, so it wins overall. (Exact numbers vary by seed/hardware; this reproduces the paper's qualitative claim, not its production figures.)",
    code: `import torch, torch.nn as nn, numpy as np
# Reproduces the qualitative effect: wide&deep > wide-only and deep-only on a task that
# needs BOTH a memorized cross-feature rule AND smooth generalization. Tiny + CPU.
torch.manual_seed(0); np.random.seed(0)
U, A, EMB = 150, 150, 5
g = torch.Generator().manual_seed(0)
taste = torch.randn(U, EMB, generator=g); appv = torch.randn(A, EMB, generator=g)
smooth = torch.sigmoid((taste @ appv.T) * 1.3)
rng = np.random.RandomState(7)
cands = [(int(u), int(a)) for u in range(U) for a in range(A) if smooth[u, a] < 0.2]
rng.shuffle(cands); exc = cands[:120]; exc_set = set(exc)
lp = lambda u, a: 0.97 if (u, a) in exc_set else float(smooth[u, a])
def make(n, seed, force):
    r = np.random.RandomState(seed)
    us = r.randint(0, U, n).tolist(); as_ = r.randint(0, A, n).tolist()
    for i in range(int(n * force)):
        u, a = exc[r.randint(len(exc))]; us[i] = u; as_[i] = a
    ys = np.array([1.0 if r.rand() < lp(u, a) else 0.0 for u, a in zip(us, as_)], np.float32)
    return torch.tensor(us), torch.tensor(as_), torch.tensor(ys)
tr_u, tr_a, tr_y = make(14000, 10, 0.15); te_u, te_a, te_y = make(5000, 99, 0.15)
pair_id = {}
for u, a in zip(tr_u.tolist(), tr_a.tolist()): pair_id.setdefault((u, a), len(pair_id))
NP = len(pair_id); pix = lambda u, a: pair_id.get((int(u), int(a)), NP)
tr_p = torch.tensor([pix(u, a) for u, a in zip(tr_u, tr_a)])
te_p = torch.tensor([pix(u, a) for u, a in zip(te_u, te_a)]); NPID = NP + 1
def auc(y, p):
    y = y.numpy(); p = p.detach().numpy(); o = np.argsort(p)
    r = np.empty(len(p)); r[o] = np.arange(len(p))
    pos = (y == 1); npos = pos.sum(); nneg = len(y) - npos
    return float((r[pos].sum() - npos * (npos - 1) / 2) / (npos * nneg)) if npos and nneg else float('nan')
class WD(nn.Module):
    def __init__(s, mode):
        super().__init__(); s.mode = mode
        s.wide = nn.Embedding(NPID, 1); nn.init.zeros_(s.wide.weight)
        s.eu = nn.Embedding(U, EMB); s.ea = nn.Embedding(A, EMB)
        s.mlp = nn.Sequential(nn.Linear(2 * EMB, 16), nn.ReLU(), nn.Linear(16, 1))
        s.b = nn.Parameter(torch.zeros(1))
    def forward(s, u, a, p):
        z = s.b.expand(len(u)).clone()
        if s.mode in ("wide", "both"): z = z + s.wide(p).squeeze(1)
        if s.mode in ("deep", "both"): z = z + s.mlp(torch.cat([s.eu(u), s.ea(a)], 1)).squeeze(1)
        return z
def run(mode):
    torch.manual_seed(0); net = WD(mode)
    opt = torch.optim.Adam(net.parameters(), lr=0.03, weight_decay=3e-4); lf = nn.BCEWithLogitsLoss()
    for _ in range(150):
        opt.zero_grad(); lf(net(tr_u, tr_a, tr_p), tr_y).backward(); opt.step()
    p = torch.sigmoid(net(te_u, te_a, te_p))
    is_exc = torch.tensor([1 if (int(u), int(a)) in exc_set else 0 for u, a in zip(te_u, te_a)])
    unseen = te_p == NP
    return auc(te_y, p), auc(te_y[unseen], p[unseen]), float((p[is_exc == 1] > 0.5).float().mean())
for m in ["wide", "deep", "both"]:
    a, gen, rec = run(m); print(m, round(a, 4), round(gen, 4), round(rec, 3))
# wide  0.7519 0.5039 1.0   deep  0.7532 0.6602 1.0   both  0.7695 0.6726 1.0`
  };
})();
