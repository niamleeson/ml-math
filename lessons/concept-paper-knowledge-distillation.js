/* Paper lesson — "Distilling the Knowledge in a Neural Network", Hinton, Vinyals & Dean, 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-knowledge-distillation".
   GROUNDED from arXiv:1503.02531 (abstract) and the ar5iv HTML mirror (Section 2 — the softened
   softmax Eqn. 1 and the T^2 loss scaling; Section 3 — the MNIST experiment).
   Track B (architecture): import nn.Linear / nn.Sequential; implement ONLY the novel part — the
   temperature-softened softmax and the combined distillation loss (KL to soft teacher targets at
   temperature T, scaled by T^2, PLUS the hard-label cross-entropy). Reproduce the qualitative effect
   (a small student trained with distillation beats the same student on hard labels alone) and ablate T. */
(function () {
  window.LESSONS.push({
    id: "paper-knowledge-distillation",
    title: "Knowledge Distillation — Distilling the Knowledge in a Neural Network (2015)",
    tagline: "Train a small model to copy a big model's softened class probabilities, not just the hard labels.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Geoffrey Hinton, Oriol Vinyals, Jeff Dean",
      org: "Google Inc.",
      year: 2015,
      venue: "arXiv:1503.02531 (Mar 2015); NIPS 2014 Deep Learning Workshop",
      citations: "",
      arxiv: "https://arxiv.org/abs/1503.02531",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-softmax", "dl-cross-entropy", "pt-nn-module", "pt-loss-optim", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>The best accuracy often comes from a <b>big, slow</b> model &mdash; or an <b>ensemble</b> (many
       models averaged together). Great for winning a benchmark; painful to ship. It is expensive to run for
       every user request. The paper opens on exactly this tension (&sect;1):</p>
       <blockquote>"it is possible to compress the knowledge in an ensemble into a single model which is much
       easier to deploy."</blockquote>
       <p>The naive fix &mdash; train a <b>small</b> model on the same <b>hard labels</b> (the one correct
       class per example) &mdash; under-performs. A small model trained on hard labels alone usually lands
       well short of the big model. The question the paper asks: can we hand the small model something richer
       than the one-hot answer, so it learns more from the same data?</p>`,
    contribution:
      `<ul>
        <li><b>Soft targets carry "dark knowledge".</b> A trained model's full probability vector says more
        than the top label. The paper's example (&sect;1): "An image of a BMW &hellip; may only have a very
        small chance of being mistaken for a garbage truck, but that mistake is still many times more probable
        than mistaking it for a carrot." Those tiny relative odds tell the student how the big model
        generalizes.</li>
        <li><b>Temperature softening.</b> Divide the logits (a model's raw, pre-softmax scores) by a
        <b>temperature</b> $T$ before the softmax. A higher $T$ flattens the distribution, so the small,
        informative probabilities of the wrong classes become visible instead of being crushed near zero.</li>
        <li><b>The distillation loss.</b> Train the small "student" on a weighted sum of two terms: match the
        big "teacher's" softened probabilities (soft targets) <i>and</i> match the true hard labels. The
        soft-target term is scaled by $T^2$ so the two terms stay balanced.</li>
      </ul>`,
    whyItMattered:
      `<p>Distillation became the standard way to <b>shrink</b> models for deployment. The same recipe trains
       compact production networks across vision, speech, and language. It is the engine behind compressed
       language models such as <b>DistilBERT</b> (a smaller, distilled version of the BERT language model).
       The terms "teacher", "student", and "soft targets" entered the everyday vocabulary of model
       compression because of this paper.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the BMW / garbage-truck / carrot example. This is the whole
        intuition: the relative probabilities of the <i>wrong</i> answers carry information.</li>
        <li><b>&sect;2 (Distillation)</b> &mdash; the softened-softmax equation (Eqn. 1) and the rule to scale
        the soft-target gradients by $T^2$. This is the math you will transcribe and implement.</li>
        <li><b>&sect;3 (Preliminary experiments on MNIST)</b> &mdash; the small, clean result you can compare
        your toy run against: a distilled small net beats the same small net trained without soft targets.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the speech-recognition system) and &sect;5 (specialist models on a giant
       internal dataset) &mdash; impressive at scale but not needed to understand the core method. The math
       you need is one short equation and one scaling rule in &sect;2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have a small student network. Train it two ways on the <i>same</i> data: (a) on the hard labels
       alone, and (b) on the big teacher's softened probabilities plus the hard labels (distillation). Which
       student reaches <b>higher test accuracy</b> &mdash; (a), (b), or a tie? Write your guess and one
       sentence of reasoning.</p>
       <p>Then a second guess: as you raise the temperature $T$ from $1$ upward, does the distilled student
       keep getting better, get worse, or rise then fall? (Hint: $T=1$ is the ordinary softmax; very large
       $T$ makes every class nearly equally probable.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Softened softmax.</b> Given logits <code>z</code> and temperature <code>T</code>:
        <code>soft = softmax(z / T)</code>. TODO: write it for both teacher targets and student outputs.</li>
        <li><b>The distillation loss.</b>
        <code>kd = KL(student_log_softmax(z_s / T), teacher_softmax(z_t / T))</code>.
        TODO: <b>multiply <code>kd</code> by <code>T*T</code></b> (the $T^2$ rule).</li>
        <li><code>hard = cross_entropy(z_s, true_labels)</code>  <i># the ordinary hard-label term, at T=1</i></li>
        <li>TODO: combine &mdash; <code>loss = alpha * kd + (1 - alpha) * hard</code>.</li>
       </ul>
       <p>Then train one student with this loss and a matched student on <code>hard</code> alone, and compare.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>Start with how a network turns scores into probabilities. The final layer produces a vector of
       <b>logits</b> $z = (z_1, \\ldots, z_K)$ &mdash; one raw, unbounded score per class. The <b>softmax</b>
       turns them into probabilities that sum to $1$. The paper's twist (&sect;2) is to first divide every
       logit by a <b>temperature</b> $T$:</p>
       <p>$$ q_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}. $$</p>
       <p>At $T = 1$ this is the ordinary softmax. As you raise $T$, the gaps between logits shrink, so the
       output gets <b>softer</b> &mdash; the paper: "Using a higher value for $T$ produces a softer
       probability distribution over classes." The biggest class stays biggest, but the small probabilities of
       the other classes grow and become readable. Those small numbers are the "dark knowledge": they encode
       which wrong classes the teacher finds plausible.</p>
       <p>Now the transfer (&sect;2). Run the big <b>teacher</b> on each training input at a high temperature
       to get a soft target distribution. Train the small <b>student</b> to match it, using the <i>same</i>
       high $T$ in the student's own softmax. The paper: "knowledge is transferred to the distilled model by
       training it on a transfer set and using a soft target distribution for each case &hellip; produced by
       using the cumbersome model with a high temperature in its softmax. The same high temperature is used
       when training the distilled model, but after it has been trained it uses a temperature of 1."</p>
       <p>The student is trained on <b>two</b> objectives at once (&sect;2): "a weighted average of two
       different objective functions. The first &hellip; is the cross entropy with the soft targets &hellip;
       The second &hellip; is the cross entropy with the correct labels." The soft-target term uses the high
       $T$; the hard-label term uses $T = 1$.</p>
       <p>One subtlety makes the two terms cooperate. Softening by $T$ <i>shrinks</i> the gradients of the
       soft-target term &mdash; they scale as $1/T^2$. So the paper rescales: "it is important to multiply them
       by $T^2$ when using both hard and soft targets &hellip; the relative contributions of the hard and soft
       targets remain roughly unchanged." Without this, a high temperature would silently mute the soft term.</p>`,
    architecture:
      `<p>Distillation is not a new network &mdash; it is a <b>training setup with two models</b> and a
       <b>two-term loss</b>. The data flow, component by component:</p>
       <ul>
        <li><b>Teacher</b> (the "cumbersome" model) &mdash; a large network or an ensemble, already trained on
        the hard labels. For each transfer input $x$ it produces logits $v = (v_1, \\ldots, v_N)$. It is
        <b>frozen</b>: no gradients flow into it. Soft targets $q^{\\text{teacher}}_T = \\mathrm{softmax}(v / T)$
        are computed once, under <code>no_grad</code>, at the high temperature $T$.</li>
        <li><b>Student</b> (the "distilled" model) &mdash; a much smaller network with the <b>same $N$ output
        classes</b>. For each input it produces logits $z = (z_1, \\ldots, z_N)$. These logits feed <b>two
        softmax heads at once</b>, sharing the same logits but different temperatures:</li>
        <li><b>Soft head</b> &mdash; $q^{\\text{student}}_T = \\mathrm{softmax}(z / T)$ at the <b>same high $T$</b>
        as the teacher. Loss term 1: $\\mathrm{CE}(q^{\\text{student}}_T,\\, q^{\\text{teacher}}_T)$, scaled by
        $T^2$. (In code: <code>kl_div(log_softmax(z/T), softmax(v/T)) * T*T</code>.)</li>
        <li><b>Hard head</b> &mdash; $p^{\\text{student}} = \\mathrm{softmax}(z)$ at $T=1$. Loss term 2:
        $\\mathrm{CE}(p^{\\text{student}},\\, y)$ against the true one-hot label $y$.</li>
        <li><b>Combiner</b> &mdash; the total loss is the weighted average
        $\\mathcal{L} = \\alpha\\, T^2\\, (\\text{soft CE}) + (1-\\alpha)\\,(\\text{hard CE})$. Only the
        student's weights are updated.</li>
        <li><b>Inference</b> &mdash; after training, the soft head is discarded; the student runs the hard head
        alone at $T=1$, exactly like an ordinary classifier.</li>
       </ul>
       <p>So the same student logits $z$ fan out to two heads during training (high-$T$ soft + $T{=}1$ hard) and
       collapse to one head ($T{=}1$) at test time; the teacher contributes only frozen targets.</p>`,
    symbols: [
      { sym: "$z_i$", desc: "the <b>logit</b> for class $i$ &mdash; the network's raw, unbounded score for that class, before any softmax." },
      { sym: "$q_i$", desc: "the <b>softened probability</b> of class $i$: the temperature-scaled softmax output. At $T=1$ it is the ordinary class probability." },
      { sym: "$T$", desc: "the <b>temperature</b> &mdash; a positive number you divide the logits by. $T=1$ is the normal softmax; larger $T$ flattens (softens) the distribution; the paper says it is \"normally set to 1\"." },
      { sym: "$K$", desc: "the <b>number of classes</b> (the length of the logit vector). The paper's matching-logits derivation (&sect;2.1) calls this same count $N$." },
      { sym: "$v_i$", desc: "the <b>teacher logit</b> for class $i$ &mdash; the cumbersome model's raw score, the soft-target counterpart of the student's $z_i$ (paper notation, &sect;2.1)." },
      { sym: "$N$", desc: "the <b>number of classes</b> in the matching-logits derivation (&sect;2.1) &mdash; the same count as $K$; appears in $1/(N T^2)$." },
      { sym: "$\\sum_j$", desc: "a <b>sum over all classes</b> $j = 1 \\ldots K$ &mdash; the softmax denominator that normalizes the probabilities to add up to $1$." },
      { sym: "teacher", desc: "a plain term: the big (or ensembled) trained model whose softened probabilities are the targets." },
      { sym: "student", desc: "a plain term: the small model being trained to copy the teacher (also called the \"distilled\" model)." },
      { sym: "soft targets", desc: "a plain term: the teacher's full softened probability vector $q$, used as the training target instead of the one-hot hard label." },
      { sym: "$\\alpha$", desc: "a plain weight in $[0,1]$ that mixes the two loss terms: $\\alpha$ on the soft-target term, $1-\\alpha$ on the hard-label term (our notation, not a paper symbol)." },
      { sym: "KL", desc: "the <b>Kullback&ndash;Leibler divergence</b> &mdash; a measure of how far the student's distribution is from the teacher's. Minimizing it (with fixed teacher) equals the soft-target cross-entropy up to a constant." }
    ],
    formula:
      `$$ q_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)} $$
       <p class="cap">Eqn. 1 (&sect;2) &mdash; the <b>temperature-softened softmax</b>: divide each logit by $T$, then normalize. $T=1$ is the ordinary softmax; larger $T$ softens the distribution.</p>
       $$ \\mathcal{L} \\;=\\; \\alpha\\, T^2\\, \\mathrm{CE}\\big(q^{\\text{student}}_T,\\; q^{\\text{teacher}}_T\\big) \\;+\\; (1-\\alpha)\\, \\mathrm{CE}\\big(p^{\\text{student}},\\; y\\big) $$
       <p class="cap">&sect;2 (in words in the paper; written out here) &mdash; the <b>distillation objective</b>: a weighted average of the soft-target cross-entropy at temperature $T$ (scaled by $T^2$) and the hard-label cross-entropy (at $T=1$).</p>
       $$ \\frac{\\partial C}{\\partial z_i} \\;=\\; \\frac{1}{T}\\,(q_i - p_i) \\;=\\; \\frac{1}{T}\\!\\left(\\frac{e^{z_i/T}}{\\sum_j e^{z_j/T}} \\;-\\; \\frac{e^{v_i/T}}{\\sum_j e^{v_j/T}}\\right) $$
       <p class="cap">Eqn. 2 (&sect;2.1) &mdash; the gradient of the soft cross-entropy w.r.t. a student logit $z_i$, with $v_i$ the teacher logits. The $1/T$ is the chain-rule factor.</p>
       $$ \\frac{\\partial C}{\\partial z_i} \\;\\approx\\; \\frac{1}{T}\\!\\left(\\frac{1 + z_i/T}{N + \\sum_j z_j/T} \\;-\\; \\frac{1 + v_i/T}{N + \\sum_j v_j/T}\\right) $$
       <p class="cap">Eqn. 3 (&sect;2.1) &mdash; the high-$T$ approximation: for $T$ large, $e^{x/T}\\approx 1 + x/T$.</p>
       $$ \\frac{\\partial C}{\\partial z_i} \\;\\approx\\; \\frac{1}{N\\,T^2}\\,(z_i - v_i) $$
       <p class="cap">Eqn. 4 (&sect;2.1) &mdash; if the logits are zero-meaned per case ($\\sum_j z_j = \\sum_j v_j = 0$), high-$T$ distillation reduces to minimizing $\\tfrac{1}{2}(z_i - v_i)^2$, i.e. <b>matching logits</b>. The $1/T^2$ here is exactly what the $T^2$ multiplier in $\\mathcal{L}$ cancels.</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> is the softened softmax: divide each logit by $T$, then take the normal softmax.
       At $T=1$ it is the ordinary probability; at $T \\gt 1$ it spreads probability mass toward the
       non-top classes, exposing the teacher's "dark knowledge".</p>
       <p>The <b>second equation</b> is the combined distillation loss (the paper describes it in words in
       &sect;2; we write it out). The first term is the cross-entropy ($\\mathrm{CE}$) between the student's
       and teacher's <i>softened</i> distributions (both at temperature $T$), multiplied by $T^2$ to undo the
       $1/T^2$ gradient shrinkage. The second term is the ordinary cross-entropy between the student's
       <i>un-softened</i> output $p^{\\text{student}}$ (at $T=1$) and the true label $y$. The weight $\\alpha$
       trades the two off.</p>
       <p><b>Equations 2&ndash;4</b> trace the soft-target gradient $\\partial C/\\partial z_i$: it starts as
       $\\tfrac{1}{T}(q_i - p_i)$ (Eqn. 2), and in the high-$T$ limit with zero-meaned logits collapses to
       $\\tfrac{1}{N T^2}(z_i - v_i)$ (Eqn. 4). That last form says two things at once: the gradient scales as
       $1/T^2$ (hence the $T^2$ multiplier), and high-temperature distillation is just <b>matching the
       student's logits $z_i$ to the teacher's logits $v_i$</b>.</p>`,
    derivation:
      `<p><b>Why the $T^2$ factor?</b> (No separate concept lesson owns this &mdash; here is the full
       argument.) Look at the gradient of the soft cross-entropy with respect to a student logit $z_k$. With
       student softened probability $q_k = \\mathrm{softmax}(z/T)_k$ and teacher target $p_k$, the standard
       softmax-cross-entropy gradient is</p>
       <p>$$ \\frac{\\partial C}{\\partial z_i} = \\frac{1}{T}\\,(q_i - p_i) = \\frac{1}{T}\\!\\left(\\frac{e^{z_i/T}}{\\sum_j e^{z_j/T}} - \\frac{e^{v_i/T}}{\\sum_j e^{v_j/T}}\\right). \\qquad\\text{(Eqn. 2)} $$</p>
       <p>Here $p_i = \\mathrm{softmax}(v/T)_i$ is the frozen teacher target and $v_i$ the teacher logits. The
       $1/T$ comes from the chain rule: the loss depends on $z_i$ only through $z_i / T$, so each derivative
       picks up a factor $1/T$.</p>
       <p><b>The high-temperature limit &mdash; matching logits.</b> Now take $T$ large compared to the logits.
       Then $e^{x/T} \\approx 1 + x/T$, and Eqn. 2 becomes</p>
       <p>$$ \\frac{\\partial C}{\\partial z_i} \\approx \\frac{1}{T}\\!\\left(\\frac{1 + z_i/T}{N + \\sum_j z_j/T} - \\frac{1 + v_i/T}{N + \\sum_j v_j/T}\\right). \\qquad\\text{(Eqn. 3)} $$</p>
       <p>If the logits are <b>zero-meaned</b> for each transfer case ($\\sum_j z_j = \\sum_j v_j = 0$), both
       denominators collapse to $N$ and this simplifies to</p>
       <p>$$ \\frac{\\partial C}{\\partial z_i} \\approx \\frac{1}{N\\,T^2}\\,(z_i - v_i). \\qquad\\text{(Eqn. 4)} $$</p>
       <p>This is exactly the gradient of $\\tfrac{1}{2}(z_i - v_i)^2$ (up to the $1/(NT^2)$ scale). So in the
       paper's words, "in the high temperature limit, distillation is equivalent to minimizing
       $\\tfrac{1}{2}(z_i - v_i)^2$, provided the logits are zero-meaned" &mdash; the student is simply pulled to
       <b>match the teacher's logits</b>. Logit-matching (an older compression trick) is a special case of
       distillation, not a separate method.</p>
       <p><b>Why the $T^2$ factor?</b> Eqn. 4 also exposes the gradient's scale: it shrinks as $1/T^2$. So as
       you soften, the soft-target term quietly fades. To keep the soft term pulling its weight next to the
       (un-scaled) hard term, multiply the soft loss by $T^2$. That cancels the $1/T^2$, so &mdash; in the
       paper's words &mdash; "the relative contributions of the hard and soft targets remain roughly unchanged"
       no matter what $T$ you pick. (At intermediate $T$, where the logits are not small relative to $T$,
       distillation pays <i>less</i> attention to very negative logits; the paper notes this can be an
       advantage, since those logits are noisier.)</p>
       <p>(In code we minimize the Kullback&ndash;Leibler divergence to the fixed teacher, which differs from
       the soft cross-entropy only by a constant in the teacher, so it has the same gradient with respect to
       the student.)</p>`,
    example:
      `<p>Soften a real logit vector and watch the small probabilities grow. Take logits
       $z = [2.0,\\,1.0,\\,0.1,\\,-1.0]$ for four classes.</p>
       <ul class="steps">
        <li><b>At $T = 1$</b> (ordinary softmax). Exponentiate: $e^{2.0}=7.389$, $e^{1.0}=2.718$,
        $e^{0.1}=1.105$, $e^{-1.0}=0.368$. Sum $= 11.580$. Divide:
        $q = [7.389,\\,2.718,\\,1.105,\\,0.368] / 11.580 = [0.638,\\,0.235,\\,0.095,\\,0.032]$.</li>
        <li><b>At $T = 4$</b> (softened). First divide the logits by $4$: $[0.5,\\,0.25,\\,0.025,\\,-0.25]$.
        Exponentiate: $[1.649,\\,1.284,\\,1.025,\\,0.779]$, sum $= 4.737$. Divide:
        $q = [0.348,\\,0.271,\\,0.217,\\,0.164]$.</li>
        <li><b>Read the difference.</b> The top class fell from $0.638$ to $0.348$; the bottom class rose from
        $0.032$ to $0.164$ &mdash; a $5\\times$ jump. Softening did not change the <i>ranking</i>, but it made
        the wrong-class odds <b>visible</b>. That visible structure is exactly what the student learns from.</li>
       </ul>
       <p>These exact numbers are recomputed in the notebook's first cell:
       $T{=}1 \\to [0.6381, 0.2347, 0.0954, 0.0318]$ and $T{=}4 \\to [0.3481, 0.2711, 0.2165, 0.1644]$.</p>`,
    recipe:
      `<ol>
        <li><b>Train (or take) a teacher.</b> A big network trained on the hard labels until it is accurate.</li>
        <li><b>Precompute soft targets.</b> Run the teacher on every training input, soften with temperature
        $T$: <code>soft_t = softmax(teacher_logits / T)</code>. Freeze them (no gradients flow to the teacher).</li>
        <li><b>Build the student.</b> A much smaller network with the same output classes.</li>
        <li><b>Distillation loss.</b> For each batch, compute student logits <code>z_s</code>. Soft term:
        <code>kd = KL(log_softmax(z_s / T), soft_t) * (T*T)</code>. Hard term:
        <code>hard = cross_entropy(z_s, labels)</code> at $T=1$. Combine:
        <code>loss = alpha*kd + (1-alpha)*hard</code>.</li>
        <li><b>Train the student</b> on that loss.</li>
        <li><b>Test at $T=1$.</b> Switch back to the ordinary softmax for inference, exactly as the paper does.</li>
        <li><b>Ablate $T$.</b> Sweep $T \\in \\{1, 2, 4, 8, 16\\}$ and watch test accuracy rise then fall.</li>
      </ol>`,
    results:
      `<p>From the MNIST experiment (&sect;3, quoted): a big net "with two hidden layers of 1200 rectified
       linear hidden units &hellip; achieved 67 test errors whereas a smaller net with two hidden layers of
       800 rectified linear hidden units and no regularization achieved 146 errors. But if the smaller net was
       regularized solely by adding the additional task of matching the soft targets produced by the large net
       at a temperature of 20, it achieved 74 test errors." So distillation roughly halved the small net's
       errors (146 &rarr; 74), nearly matching the big net.</p>
       <p>On speech (&sect;4, Table 1, quoted): a single baseline reached "58.9%" frame accuracy; an ensemble
       of 10 models reached "61.1%"; the distilled single model reached "60.8%" &mdash; capturing most of the
       ensemble's gain in one deployable model.</p>
       <p><i>These are the paper's reported figures, quoted. The numbers in the CODEVIZ panel below are from
       our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The primary metric is <b>student test accuracy</b> (or test errors) on a held-out set. The paper's clean benchmark is MNIST (&sect;3): a small net trained on hard labels alone made <b>146 test errors</b>, while the same net distilled at $T=20$ made <b>74 errors</b> &mdash; nearly matching the big teacher's <b>67 errors</b>. The two baselines that bracket "working" are: the <b>hard-labels-only student</b> (the floor distillation must beat) and the <b>teacher</b> (the ceiling it tries to approach). A distilled student that does not beat its own hard-label twin is not working.</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> Verify the softened softmax first: logits $[2.0, 1.0, 0.1, -1.0]$ must give $T{=}1 \\to [0.6381, 0.2347, 0.0954, 0.0318]$ and $T{=}4 \\to [0.3481, 0.2711, 0.2165, 0.1644]$ &mdash; each row sums to $1$ and the high-$T$ row is flatter. Check the KL term is non-negative and hits $\\approx 0$ when student logits equal teacher logits (feed the teacher's own logits as the student output). Confirm the soft targets are detached (no <code>grad_fn</code>). At init, a $K$-way student's hard cross-entropy should be $\\approx \\ln K$ (e.g. $\\ln 10 \\approx 2.30$ for the toy problem) &mdash; a rule-of-thumb check that the loss is wired up.</li>
        <li><b>Expected range.</b> Anchor to the paper: distillation roughly <i>halved</i> the small net's errors ($146 \\to 74$, &sect;3). On the toy problem the lesson reports student-hard $\\approx 0.597$ rising to $\\approx 0.657$ at $T{=}4$ and a peak $\\approx 0.710$ at $T{=}8$, versus teacher $0.768$ (our run, not the paper's). Rule of thumb: a correct distilled student should land <i>strictly above</i> its hard-label twin and <i>at or below</i> the teacher. Landing below the hard twin, or at the teacher's exact accuracy on the first try, is "probably a bug"; a few points of wobble between $T$ values is "tuning."</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central component is the <b>soft-target term</b>. Turn it off by setting $\\alpha = 0$ (pure hard labels) &mdash; accuracy must drop back to the hard-label baseline; if it does not, the soft term was never contributing (check it is summed into the loss). Second knob: <b>sweep $T \\in \\{1,2,4,8,16\\}$</b> and confirm the inverted-U &mdash; rising then falling. Third: <b>remove the $T^2$ multiplier</b> at high $T$ and watch the gain shrink toward zero, since the soft gradients fade as $1/T^2$ &mdash; this proves the $T^2$ rule is load-bearing, not decoration.</li>
        <li><b>Failure signals &amp; what they mean.</b> Distillation barely helps even at high $T$ &rarr; the $T^2$ multiplier is missing (soft gradients muted) or temperatures are mismatched between teacher targets and student head. Loss NaN &rarr; you took <code>log</code> of a plain softmax instead of <code>log_softmax</code>, or passed probabilities where <code>kl_div</code> wants log-probabilities (wrong argument order). Student tracks the teacher's <i>errors</i> too perfectly / overfits &rarr; $\\alpha$ too high with a weak teacher. Accuracy flat across all $T$ &rarr; gradients are flowing into the teacher (targets not detached / not under <code>no_grad</code>), so the "teacher" is drifting. The CODEVIZ bar chart is the check: if the KD bars do not exceed the hard-only bar, the soft term is not wired in.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks already ship in PyTorch, so you
       <b>import</b> them and implement only the novel idea. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.Sequential</code>, <code>nn.ReLU</code>, <code>nn.CrossEntropyLoss</code>,
       <code>F.softmax</code> / <code>F.log_softmax</code> / <code>F.kl_div</code>, and the optimizer.
       <b>Build by hand:</b> the temperature-softened softmax, the combined distillation loss (KL to soft
       teacher targets at temperature $T$, scaled by $T^2$, plus the hard-label cross-entropy), and the
       <b>ablation</b> over $T$. The teacher is an ordinary network you also train. The full $T^2$ gradient
       argument is derived above &mdash; there is no separate concept lesson to defer to.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the $T^2$ scale.</b> Without it, the soft-target gradients shrink as $1/T^2$, so a
        high temperature silently mutes the soft term and distillation barely helps. <b>Fix:</b> multiply the
        soft loss by <code>T*T</code>.</li>
        <li><b>Letting gradients flow into the teacher.</b> The soft targets are fixed numbers. Compute them
        under <code>torch.no_grad()</code> (or <code>.detach()</code>); never back-propagate into the teacher.</li>
        <li><b>Mismatched temperatures.</b> Both the teacher's targets and the student's soft predictions must
        use the <i>same</i> high $T$. The hard-label term, by contrast, uses $T=1$. Mixing these up scrambles
        the loss.</li>
        <li><b>Testing at the training temperature.</b> Train at high $T$, but switch back to $T=1$ for
        inference &mdash; the paper is explicit about this ("after it has been trained it uses a temperature
        of 1").</li>
        <li><b>Using <code>kl_div</code> with the wrong argument order or reduction.</b> PyTorch's
        <code>F.kl_div</code> wants <b>log-</b>probabilities for the student (first argument) and plain
        probabilities for the teacher (second). Use <code>reduction="batchmean"</code> so the loss is a proper
        per-example average.</li>
        <li><b>Expecting a win on easy data.</b> If the student is already big enough to nail the task, soft
        targets add little. Distillation helps most when the student is genuinely under-capacity or the
        training set is small &mdash; pick such a regime to see the effect.</li>
      </ul>`,
    recall: [
      "Write the softened-softmax equation (Eqn. 1) from memory, and say what $T$ does.",
      "Why must the soft-target loss be multiplied by $T^2$?",
      "What two terms make up the distillation loss, and which temperature does each use?",
      "In the high-temperature limit (with zero-meaned logits), what simpler objective does distillation reduce to?",
      "What is \"dark knowledge\" &mdash; what information do the wrong-class probabilities carry?",
      "At inference time, what temperature does the student use?"
    ],
    practice: [
      {
        q: `<b>The headline effect.</b> You train one small student on hard labels alone and an identical
            student with the distillation loss (soft teacher targets at $T=4$ plus hard labels). On a small,
            noisy training set, which reaches higher test accuracy, and what does that show?`,
        steps: [
          { do: `Keep everything identical &mdash; same student architecture, optimizer, seed, data &mdash; and change only whether the soft-target term is present.`, why: `An honest comparison isolates the one variable: the soft targets.` },
          { do: `Train both, then evaluate at $T=1$. The distilled student lands higher (in our run, 0.6570 vs 0.5970).`, why: `The soft targets act as a richer, lower-variance training signal than one-hot labels, regularizing the small student.` },
          { do: `Conclude that the teacher's softened probabilities &mdash; not extra parameters &mdash; closed part of the gap to the big teacher.`, why: `Both students have identical capacity; only the training signal differs.` }
        ],
        answer: `<p>The <b>distilled</b> student wins. In our small run the hard-labels-only student reached
                 about <b>0.597</b> test accuracy, while the same student trained with soft targets at $T=4$
                 reached about <b>0.657</b> &mdash; closing much of the gap toward the teacher's <b>0.768</b>.
                 Since the only difference is the soft-target term, this isolates the teacher's softened
                 probabilities as the cause. It is a <b>regularization / information</b> effect, not a
                 capacity one. (Our small run, not the paper's number.)</p>`
      },
      {
        q: `<b>The temperature ablation.</b> Holding the student, teacher, and weight $\\alpha$ fixed, you
            sweep the distillation temperature $T \\in \\{1, 2, 4, 8, 16\\}$. What shape do you expect the test
            accuracy to trace as $T$ grows, and why?`,
        steps: [
          { do: `At $T=1$ the soft targets are nearly one-hot (the teacher is confident), so they carry little extra signal beyond the hard labels.`, why: `Almost no "dark knowledge" is exposed; distillation ~ hard-label training.` },
          { do: `At moderate $T$ (say 4&ndash;8) the wrong-class probabilities become readable, giving the student the most useful structure.`, why: `This is the sweet spot the paper relies on &mdash; informative but not washed out.` },
          { do: `At very large $T$ every class approaches equal probability, so the targets carry almost no class information and accuracy falls again.`, why: `Over-softening destroys the signal; the inverted-U turns back down.` }
        ],
        answer: `<p>An <b>inverted U</b>: accuracy rises from $T=1$, peaks at a moderate temperature, then
                 falls as $T$ gets too large. In our run: $T{=}1 \\to 0.607$, $T{=}2 \\to 0.600$,
                 $T{=}4 \\to 0.657$, $T{=}8 \\to 0.710$ (best), $T{=}16 \\to 0.676$. Too cold and the targets are
                 nearly one-hot; too hot and they are nearly uniform; in between they expose the most useful
                 dark knowledge. (Our small run, not the paper's number.)</p>`
      },
      {
        q: `Your worked example had logits $z = [2.0, 1.0, 0.1, -1.0]$, giving $T{=}1$ probabilities
            $[0.638, 0.235, 0.095, 0.032]$. Without softening, the smallest class is $0.032$. Why does the
            teacher's $0.032$ matter to the student, and how does raising $T$ help convey it?`,
        steps: [
          { do: `Note that $0.032$ is small but not zero &mdash; it says the teacher finds that class slightly plausible, more so than a class it would rate near $0$.`, why: `These relative wrong-class odds are the "dark knowledge" &mdash; they encode the teacher's learned similarities.` },
          { do: `At $T=1$ a hard label would hand the student a flat $0$ for that class, discarding the nuance. Raise $T$ to 4: the class rises to $0.164$.`, why: `Softening amplifies the small probabilities so the student's loss actually feels them.` },
          { do: `Train the student to match the softened vector, then test at $T=1$.`, why: `The student absorbs the similarity structure during training, then reverts to ordinary probabilities for deployment.` }
        ],
        answer: `<p>The $0.032$ tells the student that the teacher considers that class a near-miss, not an
                 impossibility &mdash; structure a one-hot label throws away. At $T=1$ that signal is tiny and
                 easily ignored; raising $T$ to $4$ lifts it to $0.164$ (a $5\\times$ jump), so the soft-target
                 loss actually transmits it. The student learns the teacher's class-similarity structure, then
                 switches back to $T=1$ at test time.</p>`
      }
    ]
  });

  window.CODE["paper-knowledge-distillation"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>import</b> <code>nn.Linear</code>/<code>nn.Sequential</code> and implement only the
       novel part &mdash; the temperature-softened softmax (Eqn. 1) and the combined distillation loss. The
       key lines are <code>soft_t = softmax(teacher_logits / T)</code> and
       <code>kd = kl_div(log_softmax(z_s / T), soft_t) * (T*T)</code> (the $T^2$ rule), added to the ordinary
       <code>cross_entropy(z_s, labels)</code>. We train a big <b>teacher</b>, then two identical small
       <b>students</b> &mdash; one on hard labels alone, one with distillation &mdash; on a small, noisy toy
       problem so the effect is visible, and print both test accuracies. Then we <b>ablate</b> the temperature
       $T \\in \\{1,2,4,8,16\\}$. The first cell recomputes the worked example
       ($T{=}1 \\to [0.6381,\\ldots]$, $T{=}4 \\to [0.3481,\\ldots]$). Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# --- 0. Sanity-check the lesson's worked example: softened softmax at T=1 vs T=4. ---
z = torch.tensor([2.0, 1.0, 0.1, -1.0])
for T in (1.0, 4.0):
    q = F.softmax(z / T, dim=0)
    print(f"T={T}: ", [round(v, 4) for v in q.tolist()])
# T=1.0:  [0.6381, 0.2347, 0.0954, 0.0318]
# T=4.0:  [0.3481, 0.2711, 0.2165, 0.1644]


# --- 1. A small, noisy toy classification problem (where a tiny student under-fits). ---
g = torch.Generator().manual_seed(1)
K, n = 10, 30                       # 10 classes, 30-dim inputs
centers = torch.randn(K, n, generator=g) * 1.6
def make(N):
    y = torch.randint(0, K, (N,), generator=g)
    X = centers[y] + torch.randn(N, n, generator=g) * 3.2   # heavy overlap -> hard
    return X, y
Xtr, ytr = make(300)                # SMALL train set -> soft targets help most
Xte, yte = make(2000)


class Net(nn.Module):
    def __init__(self, h, layers=2):
        super().__init__()
        mods = [nn.Linear(n, h), nn.ReLU()]
        for _ in range(layers - 1):
            mods += [nn.Linear(h, h), nn.ReLU()]
        mods += [nn.Linear(h, K)]
        self.net = nn.Sequential(*mods)
    def forward(self, x):
        return self.net(x)


def acc(net, X, y):
    net.eval()
    with torch.no_grad():
        return (net(X).argmax(1) == y).float().mean().item()


def train_hard(net, epochs, lr=0.01, wd=0.0):
    opt = torch.optim.Adam(net.parameters(), lr=lr, weight_decay=wd)
    ce = nn.CrossEntropyLoss(); net.train()
    for _ in range(epochs):
        opt.zero_grad(); ce(net(Xtr), ytr).backward(); opt.step()
    return net


# --- 2. THE NOVEL PART: the combined distillation loss. ---
def train_distill(net, teacher, T, alpha=0.7, epochs=600, lr=0.01):
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    ce  = nn.CrossEntropyLoss()
    teacher.eval()
    with torch.no_grad():
        soft_t = F.softmax(teacher(Xtr) / T, dim=1)        # Eqn. 1: softened TEACHER targets (frozen)
    net.train()
    for _ in range(epochs):
        opt.zero_grad()
        z_s = net(Xtr)                                     # student logits
        log_soft_s = F.log_softmax(z_s / T, dim=1)         # Eqn. 1: softened STUDENT, in log-space
        kd   = F.kl_div(log_soft_s, soft_t, reduction="batchmean") * (T * T)   # the T^2 rule
        hard = ce(z_s, ytr)                                # hard-label cross-entropy, at T=1
        loss = alpha * kd + (1 - alpha) * hard             # weighted average of the two objectives
        loss.backward(); opt.step()
    return net


# --- 3. Train a big teacher, then two matched small students. ---
torch.manual_seed(0); teacher = train_hard(Net(512, layers=3), epochs=2000, wd=1e-4)
print(f"Teacher (h=512, 3L)        test acc = {acc(teacher, Xte, yte):.4f}")

torch.manual_seed(0); s_hard = train_hard(Net(8, layers=2), epochs=600)
print(f"Student hard-only (h=8)    test acc = {acc(s_hard, Xte, yte):.4f}")

torch.manual_seed(0); s_kd = train_distill(Net(8, layers=2), teacher, T=4.0)
print(f"Student +KD (T=4, h=8)     test acc = {acc(s_kd, Xte, yte):.4f}")

# --- 4. Ablation: sweep the temperature. ---
print("Ablation over temperature T (student h=8, alpha=0.7):")
for T in (1.0, 2.0, 4.0, 8.0, 16.0):
    torch.manual_seed(0); s = train_distill(Net(8, layers=2), teacher, T=T)
    print(f"  T={T:<5} test acc = {acc(s, Xte, yte):.4f}")

# Our small run (CPU, seeds fixed), NOT the paper's reported numbers:
#   Teacher 0.7680 | Student hard-only 0.5970 | Student +KD (T=4) 0.6570
#   T-ablation: T=1 0.6070 | T=2 0.5995 | T=4 0.6570 | T=8 0.7100 | T=16 0.6755
# Distillation beats hard labels; accuracy traces an inverted-U in T (peaks near T=8).`
  };

  window.CODEVIZ["paper-knowledge-distillation"] = {
    question: "Does a small student trained with distillation beat the same student on hard labels alone, and how does test accuracy vary with the temperature T?",
    charts: [
      {
        type: "bar",
        title: "Student test accuracy: hard-labels vs distillation across temperature T",
        xlabel: "training signal",
        ylabel: "test accuracy",
        series: [
          {
            name: "test accuracy",
            color: "#7ee787",
            points: [
              ["hard-only", 0.5970],
              ["KD T=1", 0.6070],
              ["KD T=2", 0.5995],
              ["KD T=4", 0.6570],
              ["KD T=8", 0.7100],
              ["KD T=16", 0.6755],
              ["teacher", 0.7680]
            ]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. One big teacher (h=512, 3 layers, test acc 0.768) and identical tiny students (h=8, 2 layers) on a small, noisy 10-class toy problem (300 train / 2000 test). The student on HARD LABELS alone reaches 0.597. With DISTILLATION it improves &mdash; and the temperature matters: accuracy rises to a peak near T=8 (0.710, nearly matching the teacher) then falls at T=16 (0.676), the inverted-U the paper relies on. Too cold (T=1, 0.607) the soft targets are nearly one-hot; too hot (T=16) they wash out. Same student, optimizer, seed, and data; only the soft-target loss and T change.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

g = torch.Generator().manual_seed(1)
K, n = 10, 30
centers = torch.randn(K, n, generator=g) * 1.6
def make(N):
    y = torch.randint(0, K, (N,), generator=g)
    X = centers[y] + torch.randn(N, n, generator=g) * 3.2
    return X, y
Xtr, ytr = make(300); Xte, yte = make(2000)

class Net(nn.Module):
    def __init__(self, h, layers=2):
        super().__init__()
        m = [nn.Linear(n, h), nn.ReLU()]
        for _ in range(layers - 1): m += [nn.Linear(h, h), nn.ReLU()]
        m += [nn.Linear(h, K)]; self.net = nn.Sequential(*m)
    def forward(self, x): return self.net(x)

def acc(net, X, y):
    net.eval()
    with torch.no_grad(): return (net(X).argmax(1) == y).float().mean().item()

def train_hard(net, epochs, wd=0.0):
    opt = torch.optim.Adam(net.parameters(), lr=0.01, weight_decay=wd)
    ce = nn.CrossEntropyLoss(); net.train()
    for _ in range(epochs):
        opt.zero_grad(); ce(net(Xtr), ytr).backward(); opt.step()
    return net

def train_distill(net, teacher, T, alpha=0.7, epochs=600):
    opt = torch.optim.Adam(net.parameters(), lr=0.01); ce = nn.CrossEntropyLoss()
    teacher.eval()
    with torch.no_grad(): soft_t = F.softmax(teacher(Xtr) / T, dim=1)
    net.train()
    for _ in range(epochs):
        opt.zero_grad(); z = net(Xtr)
        kd = F.kl_div(F.log_softmax(z / T, dim=1), soft_t, reduction="batchmean") * (T * T)
        loss = alpha * kd + (1 - alpha) * ce(z, ytr)
        loss.backward(); opt.step()
    return net

torch.manual_seed(0); teacher = train_hard(Net(512, 3), 2000, wd=1e-4)
torch.manual_seed(0); hard = acc(train_hard(Net(8, 2), 600), Xte, yte)
rows = [["hard-only", round(hard, 4)]]
for T in (1.0, 2.0, 4.0, 8.0, 16.0):
    torch.manual_seed(0)
    rows.append([f"KD T={int(T)}", round(acc(train_distill(Net(8, 2), teacher, T), Xte, yte), 4)])
rows.append(["teacher", round(acc(teacher, Xte, yte), 4)])
for r in rows: print(r)
# [['hard-only', 0.597], ['KD T=1', 0.607], ['KD T=2', 0.5995], ['KD T=4', 0.657],
#  ['KD T=8', 0.71], ['KD T=16', 0.6755], ['teacher', 0.768]]`
  };
})();
