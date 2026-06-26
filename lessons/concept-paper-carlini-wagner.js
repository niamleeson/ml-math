/* Paper lesson — "Towards Evaluating the Robustness of Neural Networks"
   (the Carlini & Wagner / C&W attack), Nicholas Carlini & David Wagner, IEEE S&P 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-carlini-wagner".
   GROUNDED from arXiv:1608.04644 (abstract) and the ar5iv HTML mirror
   (Section II-B logits Z; Section V-A objective + the f_6 logit loss; Section V-B box
   constraints via the tanh change-of-variables + Adam; Section VI-A the confidence kappa
   and the final L2 formulation; Section V-C 10,000 Adam iterations; Table IV L2 distortions).
   Track B (architecture): compose a tiny classifier with torch.nn, then implement the NOVEL
   part by hand — the C&W L2 attack: minimize ||delta||_2^2 + c*f(x+delta) with f the margin
   loss on logits, optimized over the tanh-reparametrized variable w with Adam. */
(function () {
  window.LESSONS.push({
    id: "paper-carlini-wagner",
    title: "C&W — Towards Evaluating the Robustness of Neural Networks (2017)",
    tagline: "A gradient-based attack that finds tiny, almost-invisible perturbations which fool any target class at 100% success.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Nicholas Carlini, David Wagner",
      org: "University of California, Berkeley",
      year: 2017,
      venue: "arXiv:1608.04644 (Aug 2016, rev. Mar 2017); IEEE Symposium on Security and Privacy (S&P) 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1608.04644",
      code: "https://github.com/carlini/nn_robust_attacks"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["pt-autograd", "pt-nn-module", "dl-backprop", "ml-gradient-descent"],

    // WHY READ IT
    problem:
      `<p>An <b>adversarial example</b> is an input that has been changed by a tiny, often invisible amount so
       that a neural network misclassifies it. The threat was already known. What was unsettled was how to
       <i>measure</i> a network's robustness: if your attack fails to fool a network, is the network actually
       robust, or is your attack just weak?</p>
       <p>This mattered because of a specific claim. A defense called <b>defensive distillation</b> (training a
       second network on the soft probabilities of a first) was reported to crush the success rate of existing
       attacks. From the abstract:</p>
       <blockquote>"Defensive distillation is a recently proposed approach that can take an arbitrary neural
       network, and increase its robustness, reducing the success rate of current attacks' ability to find
       adversarial examples from 95% to 0.5%." (Abstract)</blockquote>
       <p>The open question: was distillation truly robust, or did the existing attacks simply give up too
       early? A weak attack makes a weak defense look strong. To evaluate robustness honestly you need the
       <b>strongest possible attack</b>.</p>`,
    contribution:
      `<ul>
        <li><b>Three strong attacks, one per distance metric.</b> The paper introduces attacks tailored to the
        $L_2$, $L_\\infty$, and $L_0$ distances between the clean and the perturbed input. This lesson builds the
        <b>$L_2$ attack</b>, the most-used of the three. ("$L_2$" is the ordinary Euclidean distance: the square
        root of the sum of squared per-pixel changes.)</li>
        <li><b>Cast the attack as smooth optimization.</b> Instead of a hand-rolled rule, the attack
        <i>minimizes</i> an objective with gradient descent (Adam): a distortion term plus a
        <b>margin loss</b> on the network's raw logits, with a constant $c$ trading the two off (Section V-A).</li>
        <li><b>A box-constraint trick (the tanh change-of-variables) and a confidence knob $\\kappa$.</b> A
        change of variables keeps every pixel in the valid $[0,1]$ range automatically (Section V-B), and a
        parameter $\\kappa$ lets you dial up how confidently the network is fooled (Section VI-A).</li>
        <li><b>The headline result:</b> these attacks succeed with <b>100% probability</b> on both distilled and
        undistilled networks (Abstract) &mdash; showing defensive distillation does not actually make networks
        robust.</li>
      </ul>`,
    whyItMattered:
      `<p>The C&amp;W attack became the standard yardstick for adversarial robustness. After this paper, claiming
       a defense works meant showing it survives a strong, optimization-based attack &mdash; not just the cheap
       one-step methods. It exposed that many proposed defenses, distillation included, only broke
       <i>weak</i> attacks. The "minimize distortion plus a margin loss on logits, with a confidence term and a
       box-constraint reparametrization" template reappears throughout later attack and robustness-evaluation
       work. The lasting lesson: <b>a defense is only as proven as the strongest attack it survives.</b></p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;II-B (Notation)</b> &mdash; the one definition you must pin down: the <b>logits</b> $Z(x)$,
        "the output of all layers except the softmax." The whole attack works on $Z$, not on the softmax
        probabilities.</li>
        <li><b>&sect;V-A (Objective Function)</b> &mdash; the heart of the method. The general form
        $\\text{minimize}\\;\\mathcal{D}(x, x+\\delta) + c\\cdot f(x+\\delta)$, the seven candidate functions
        $f$, and why the logit-based one is chosen. This is the math you transcribe.</li>
        <li><b>&sect;V-B (Box constraints)</b> &mdash; the <b>tanh change-of-variables</b> that keeps
        $x+\\delta$ in $[0,1]$, and the note that they "use the Adam optimizer almost exclusively."</li>
        <li><b>&sect;VI-A</b> &mdash; the final $L_2$ formulation and the role of the confidence parameter
        $\\kappa$.</li>
       </ul>
       <p><b>Skim:</b> the $L_0$ and $L_\\infty$ attacks (&sect;V-D, &sect;V-E), and the distillation-specific
       experiments (&sect;VIII) unless you care about that defense. Glance at <b>Table IV</b> for the reported
       $L_2$ distortions.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will attack a tiny classifier two ways to flip inputs to a chosen <b>target</b> class. First the
       <b>Fast Gradient Sign Method (FGSM)</b>: a single step of size $\\varepsilon$ in the sign-of-the-gradient
       direction (a weaker baseline, covered in the FGSM lesson). Second the <b>C&amp;W $L_2$ attack</b>: many
       Adam steps minimizing distortion plus a margin loss.</p>
       <p>Hold the success rate fixed at "fool nearly everything." Which attack needs the <b>smaller</b> average
       $L_2$ perturbation to get there &mdash; or will they tie? Write your guess and one sentence of reasoning.</p>
       <p>(Hint: FGSM takes one fixed-size step for every input. C&amp;W keeps optimizing the perturbation per
       input until it is just barely big enough to cross the decision boundary. Which one wastes distortion?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the C&amp;W $L_2$ attack you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Reparametrize</b> so the image stays valid: set $x+\\delta = \\tfrac12(\\tanh(w)+1)$, and optimize
        the unconstrained variable $w$. Initialize $w$ so the start equals the clean image
        ($w = \\text{arctanh}(2x-1)$). <i># this is the box-constraint trick</i></li>
        <li><b>Margin loss on logits.</b> TODO &mdash; with target class $t$, write
        $f = \\max\\big(\\max_{i\\neq t} Z_i - Z_t,\\; -\\kappa\\big)$. When does $f$ become $0$ (or
        $-\\kappa$)? <i># when the target logit leads the pack by at least $\\kappa$</i></li>
        <li><b>The objective:</b> TODO &mdash; minimize $\\lVert (x+\\delta) - x \\rVert_2^2 + c\\cdot f$ over
        $w$ with <code>torch.optim.Adam</code>. Why minimize squared $L_2$ rather than the raw $\\sin$ or the
        softmax probability?</li>
        <li>TODO: what is the constant $c$ for? What happens to success and to distortion as $c$ grows?</li>
       </ul>
       <p>Then build the FGSM baseline: one signed-gradient step of size $\\varepsilon$, clamped to $[0,1]$.
       Sweep $\\varepsilon$ and compare success rate and mean $L_2$ against C&amp;W.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The attack turns "find a tiny change that flips the label" into a <b>smooth minimization problem</b>
       and solves it with gradient descent. Three ideas stack up.</p>
       <p><b>1. The objective (Section V-A).</b> We want the perturbation $\\delta$ to be small <i>and</i> to cause
       misclassification. The paper writes a single objective combining both:</p>
       <p>$$ \\text{minimize}\\;\\; \\mathcal{D}(x, x+\\delta) \\;+\\; c\\cdot f(x+\\delta)
       \\quad\\text{such that}\\quad x+\\delta \\in [0,1]^n. $$</p>
       <p>Here $\\mathcal{D}$ is the distortion (for the $L_2$ attack, $\\lVert\\delta\\rVert_2^2$), and $f$ is an
       <b>objective function</b> that is $\\le 0$ exactly when the input is classified as the target $t$. The
       constant $c$ balances "stay small" against "actually fool it."</p>
       <p><b>2. The margin loss on logits (Section V-A, their $f_6$; with confidence in Section VI-A).</b> The
       paper tests seven candidate $f$'s and finds the strongest is built on the <b>logits</b> $Z$ &mdash; the
       network's raw pre-softmax scores (Section II-B). The chosen loss is:</p>
       <p>$$ f(x') = \\max\\Big( \\max_{i \\neq t} Z(x')_i \\;-\\; Z(x')_t,\\;\\; -\\kappa \\Big). $$</p>
       <p>Read it as a <b>margin</b>: $\\max_{i\\neq t} Z_i$ is the best competing class's score; $Z_t$ is the
       target's score. While some other class still leads, the gap $\\max_{i\\neq t} Z_i - Z_t$ is positive and
       $f$ pushes the target's logit up. Once the target leads by at least $\\kappa$, $f$ saturates at $-\\kappa$
       and stops &mdash; no need to over-fool. The paper prefers a logit margin over a softmax / cross-entropy
       loss because the softmax-based loss has wildly varying gradients (Section V-A), which makes the constant
       $c$ hard to pick and the descent unstable.</p>
       <p><b>3. The box constraint via tanh (Section V-B).</b> Pixels must stay in $[0,1]$, but plain gradient
       descent ignores that. The trick is a <b>change of variables</b>: introduce a new free variable $w$ and set</p>
       <p>$$ \\delta_i = \\tfrac{1}{2}\\big(\\tanh(w_i)+1\\big) - x_i, \\qquad\\text{so}\\qquad
       x_i + \\delta_i = \\tfrac{1}{2}\\big(\\tanh(w_i)+1\\big). $$</p>
       <p>Because $\\tanh$ always lands in $[-1,1]$, the quantity $\\tfrac12(\\tanh(w)+1)$ always lands in
       $[0,1]$ &mdash; the constraint holds <i>for free</i>, for any $w$. So we optimize $w$ with no constraints,
       using <b>Adam</b> (Section V-B: "we use the Adam optimizer almost exclusively"). Substituting, the full
       $L_2$ attack (Section VI-A) is:</p>
       <p>$$ \\text{minimize}\\;\\; \\big\\lVert \\tfrac12(\\tanh(w)+1) - x \\big\\rVert_2^2
       \\;+\\; c\\cdot f\\big(\\tfrac12(\\tanh(w)+1)\\big). $$</p>
       <p>The constant $c$ is chosen by <b>binary search</b> (Section V-A): the smallest $c$ that still flips the
       label gives the smallest distortion. Small $c$ keeps $\\delta$ tiny but may not fool the net; large $c$
       guarantees a flip but spends more distortion than needed.</p>`,
    architecture:
      `<p>This is an <b>attack algorithm</b>, not a new network: it wraps a gradient-descent loop around a fixed,
       already-trained classifier. Two pieces stack &mdash; the victim model and the optimization loop.</p>
       <p><b>The victim classifier (&sect;IV, Tables I&ndash;II).</b> A standard convolutional net used as a black
       box for its <b>logits</b> $Z$. The MNIST/CIFAR model is: two $3\\times3$ conv layers of 32 channels +
       ReLU &rarr; $2\\times2$ max-pool &rarr; two $3\\times3$ conv layers of 64 channels + ReLU &rarr; max-pool
       &rarr; two fully-connected layers of 200 units + ReLU &rarr; a final dense layer to the class logits
       $Z(x)$ &rarr; softmax $F(x)=\\mathrm{softmax}(Z(x))$. Trained 50 epochs with momentum SGD (momentum $0.9$),
       dropout $0.5$. The attack reads the layer <i>before</i> the softmax, so $C(x)=\\arg\\max_i F(x)_i$.</p>
       <p><b>The attack loop (&sect;V-B, &sect;VI-A) &mdash; per-iteration procedure</b> for the $L_2$ attack on a
       batch of clean inputs $x$ with targets $t$:</p>
       <ol>
        <li><b>Initialize</b> the free variable at the clean image: $w \\leftarrow \\mathrm{arctanh}(2x-1)$ (clamp
        $x$ just inside $(0,1)$ first to avoid $\\pm\\infty$).</li>
        <li><b>Decode</b> the candidate image: $x' = \\tfrac12(\\tanh(w)+1)\\in[0,1]^n$.</li>
        <li><b>Forward pass</b> through the frozen classifier to get logits $Z(x')$; read the target logit
        $Z(x')_t$ and the best competitor $\\max_{i\\neq t}Z(x')_i$.</li>
        <li><b>Loss</b> $= \\lVert x'-x\\rVert_2^2 + c\\cdot\\max(\\max_{i\\neq t}Z(x')_i - Z(x')_t,\\,-\\kappa)$.</li>
        <li><b>Backprop &amp; step</b>: gradient w.r.t. $w$ (classifier weights frozen), one <b>Adam</b> update
        (&ldquo;we use the Adam optimizer almost exclusively&rdquo;, &sect;V-B).</li>
        <li><b>Repeat</b> for up to 10,000 iterations (&sect;V-C); keep the smallest-distortion $x'$ seen that is
        classified as $t$.</li>
       </ol>
       <p><b>Outer binary search (&sect;V-A).</b> Wrap the loop in ~20 steps of binary search over
       $c\\in[10^{-4},10^{10}]$: raise $c$ when no adversarial example is found, lower it when one is, converging on
       the smallest $c$ (hence smallest distortion) that still flips the label. The $L_0$ attack (&sect;VI-B)
       repeatedly runs this $L_2$ loop while freezing the least-important pixels; the $L_\\infty$ attack
       (&sect;VI-C) replaces the distance term with $\\sum_i(\\delta_i-\\tau)^+$ and shrinks the cap $\\tau$ by
       $0.9\\times$ each round.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>clean input</b> &mdash; the original, correctly classified image, with every pixel in $[0,1]$." },
      { sym: "$\\mathcal{D}(x,\\,x+\\delta)$", desc: "the <b>distance metric</b> measuring how big the perturbation is &mdash; one of $L_2$, $L_0$, or $L_\\infty$. For the $L_2$ attack it is the squared Euclidean distortion $\\lVert\\delta\\rVert_2^2$." },
      { sym: "$\\delta$", desc: "the <b>perturbation</b>: the small change we add. The adversarial input is $x' = x+\\delta$." },
      { sym: "$x'$", desc: "the <b>adversarial input</b> $x+\\delta$ &mdash; what we feed the network to fool it." },
      { sym: "$t$", desc: "the <b>target class</b>: the (wrong) label we want the network to output for $x'$. This is a <i>targeted</i> attack." },
      { sym: "$Z(x')$", desc: "the <b>logits</b> (Section II-B): the network's raw output vector <i>before</i> the softmax. $Z(x')_i$ is the score for class $i$. The attack works on these raw scores, not the probabilities." },
      { sym: "$Z(x')_t$", desc: "the <b>target's logit</b>: the raw score the network gives to the target class $t$ for input $x'$. We want this to become the largest." },
      { sym: "$\\max_{i\\neq t} Z(x')_i$", desc: "the <b>best competing logit</b>: the largest score among all classes <i>other than</i> the target. The attack tries to push $Z_t$ above this." },
      { sym: "$f(x')$", desc: "the <b>margin loss</b>: $\\max(\\max_{i\\neq t}Z_i - Z_t,\\,-\\kappa)$. It is $\\gt 0$ while some other class still wins, hits $0$ at the boundary, and saturates at $-\\kappa$ once the target leads by $\\kappa$." },
      { sym: "$\\kappa$", desc: "the <b>confidence parameter</b> (Section VI-A): it &ldquo;controls the confidence with which misclassification occurs.&rdquo; With $\\kappa=0$ the attack stops as soon as the target barely wins; larger $\\kappa$ forces the target to win by a margin, giving higher-confidence (and more transferable) adversarial examples." },
      { sym: "$c$", desc: "the <b>trade-off constant</b>: weights the misclassification term $f$ against the distortion term. Chosen by binary search (Section V-A) &mdash; the smallest $c$ that still fools the net gives the smallest perturbation." },
      { sym: "$\\lVert\\delta\\rVert_2^2$", desc: "the <b>squared $L_2$ distortion</b>: the sum of squared per-pixel changes, $\\sum_i \\delta_i^2$. Small means the change is hard to see." },
      { sym: "$w$", desc: "the <b>free optimization variable</b> introduced by the change of variables. We optimize $w$ unconstrained; the image $\\tfrac12(\\tanh(w)+1)$ stays in $[0,1]$ automatically." },
      { sym: "$\\tanh$", desc: "the <b>hyperbolic tangent</b>, a smooth function whose output is always between $-1$ and $1$. That bounded range is exactly what keeps the reparametrized pixels inside $[0,1]$." }
    ],
    formula:
      `$$ \\text{minimize}\\;\\; \\mathcal{D}(x,\\,x+\\delta) \\;+\\; c\\cdot f(x+\\delta)
        \\qquad\\text{such that}\\qquad x+\\delta \\in [0,1]^n. $$
       <p>The general attack (&sect;V): make the perturbation small under a distance $\\mathcal{D}$ (one of
       $L_2,\\,L_0,\\,L_\\infty$) while the objective $f$ drives misclassification to the target $t$; the constant
       $c\\gt 0$ balances the two.</p>
       $$ f(x') = \\max\\Big( \\max_{i \\neq t} Z(x')_i \\;-\\; Z(x')_t,\\;\\; -\\kappa \\Big). $$
       <p>The chosen objective function (&sect;V-A, their $f_6$; the best of seven candidates): the
       <b>margin loss on the logits</b> $Z$. It is $\\gt 0$ while a non-target class leads, $0$ at the boundary,
       and saturates at $-\\kappa$ once the target leads by $\\kappa$.</p>
       $$ \\delta_i = \\tfrac12\\big(\\tanh(w_i)+1\\big) - x_i
        \\qquad\\Longrightarrow\\qquad x_i+\\delta_i = \\tfrac12\\big(\\tanh(w_i)+1\\big) \\in (0,1). $$
       <p>The box-constraint change of variables (&sect;V-B): optimize an unconstrained $w$; since $\\tanh\\in(-1,1)$
       the reparametrized pixel always lands in $(0,1)$, so $x+\\delta\\in[0,1]^n$ holds for free.</p>
       $$ \\text{minimize}_{\\,w}\\;\\; \\big\\lVert \\tfrac12(\\tanh(w)+1) - x \\big\\rVert_2^2
        \\;+\\; c\\cdot f\\big(\\tfrac12(\\tanh(w)+1)\\big). $$
       <p>The final $L_2$ attack (&sect;VI-A): substitute the tanh map into the general objective with
       $\\mathcal{D}=\\lVert\\delta\\rVert_2^2$ and minimize over $w$ with Adam. The confidence $\\kappa$ sits inside
       $f$; the trade-off $c$ is chosen by <b>binary search</b> (&sect;V-A) &mdash; the smallest $c$ that still
       flips the label yields the smallest distortion.</p>`,
    whatItDoes:
      `<p><b>The margin loss</b> $f$ (left, Section V-A's $f_6$ with the $\\kappa$ term from Section VI-A) measures
       how far the target class is from winning. It compares the best competing logit to the target's logit. If
       another class leads, $f$ is positive and the gradient pushes the target's logit up. The instant the target
       leads by at least $\\kappa$, $f$ flattens at $-\\kappa$ and stops contributing &mdash; so the attack does
       not waste distortion over-fooling the network.</p>
       <p><b>The full $L_2$ objective</b> (right, Section VI-A) is what Adam minimizes. The first term is the
       squared Euclidean size of the perturbation &mdash; keep the change small. The second term, weighted by
       $c$, is the margin loss &mdash; make the network output the target. The $\\tfrac12(\\tanh(w)+1)$ wrapper is
       the box-constraint trick: it guarantees a valid image for any $w$, so we can run unconstrained gradient
       descent. The constant $c$ is the dial between the two goals; binary search finds the smallest $c$ that
       still flips the label, and that is where the perturbation is smallest.</p>`,
    derivation:
      `<p><b>Why the tanh trick works (Section V-B).</b> We need $0 \\le x_i + \\delta_i \\le 1$ for every pixel.
       Naive projected gradient descent would have to clip after every step, which fights the optimizer. Instead,
       define $x_i + \\delta_i = \\tfrac12(\\tanh(w_i)+1)$. Since $\\tanh$ maps the whole real line into
       $(-1,1)$, we have $-1 \\lt \\tanh(w_i) \\lt 1$, hence $0 \\lt \\tfrac12(\\tanh(w_i)+1) \\lt 1$. The
       constraint is satisfied for <i>any</i> real $w_i$, so optimizing $w$ is unconstrained. To start the attack
       at the clean image, invert the map: $w_i = \\text{arctanh}(2x_i - 1)$, the inverse of
       $\\tfrac12(\\tanh(w_i)+1)$.</p>
       <p><b>Why a margin on logits, not softmax (Section V-A).</b> A cross-entropy / softmax loss can be nearly
       flat where the network is confident, so its gradient is tiny near a valid image but huge near the
       adversarial one. The paper reports the average gradient of one softmax-based candidate "around the valid
       image is $2^{-20}$ but $2^{-1}$ at the adversarial example" (Section V-A). Such a $10^6$-scale gradient
       swing makes a single constant $c$ unable to balance the two terms. The logit <b>margin</b>
       $\\max_{i\\neq t}Z_i - Z_t$ is roughly linear in the logits, so its gradient is well-scaled everywhere,
       and binary search over $c$ behaves. The $\\max(\\cdot,-\\kappa)$ clamp simply stops the loss once the
       target wins by $\\kappa$, so the optimizer turns its attention back to shrinking the distortion.</p>`,
    example:
      `<p>Compute the margin loss $f$ on a tiny logit vector, by hand. Say the network outputs three logits for
       the adversarial input, $Z(x') = [\\,2.0,\\; 0.5,\\; -1.0\\,]$ for classes $0,1,2$. Our target is class
       $t=2$ (the last one). Use confidence $\\kappa = 0$.</p>
       <ul class="steps">
        <li><b>Target logit.</b> $Z_t = Z_2 = -1.0$.</li>
        <li><b>Best competing logit.</b> Among $i\\neq t$, the logits are $\\{2.0, 0.5\\}$, so
        $\\max_{i\\neq t} Z_i = 2.0$ (class $0$).</li>
        <li><b>Raw margin.</b> $\\max_{i\\neq t} Z_i - Z_t = 2.0 - (-1.0) = 3.0$. Positive: another class
        (class $0$) is winning, so the input is <i>not</i> yet classified as the target.</li>
        <li><b>Apply the clamp.</b> $f = \\max(3.0,\\; -\\kappa) = \\max(3.0, 0) = 3.0$. The attack still has work
        to do; its gradient will push $Z_2$ up and the others down.</li>
       </ul>
       <p><b>Now a case where the target wins, with $\\kappa = 1.0$.</b> Suppose after some optimization the
       logits become $Z(x') = [\\,2.0,\\; 0.5,\\; 3.0\\,]$, still target $t=2$. Then $Z_t = 3.0$,
       $\\max_{i\\neq t} Z_i = 2.0$, raw margin $= 2.0 - 3.0 = -1.0$, and
       $f = \\max(-1.0,\\, -1.0) = -1.0$. The target leads by exactly $\\kappa=1.0$, so $f$ has bottomed out at
       $-\\kappa$ &mdash; the attack is satisfied and will stop trading distortion for more confidence. Both
       numbers are recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Train a tiny classifier</b> with <code>torch.nn</code> on toy data whose inputs live in $[0,1]$,
        so the box constraint is meaningful. Read its <b>logits</b> $Z(x)$ (the output before any softmax).</li>
        <li><b>Pick clean, correctly-classified inputs</b> and a <b>target</b> class $t$ for each (here, the next
        class). The goal is to flip each input to its target.</li>
        <li><b>Reparametrize:</b> set the optimization variable $w = \\text{arctanh}(2x-1)$ so the start equals
        the clean image, and define the adversarial image as $\\tfrac12(\\tanh(w)+1)$.</li>
        <li><b>Build the objective:</b> squared $L_2$ distortion $\\lVert \\text{img} - x \\rVert_2^2$ plus
        $c\\cdot f$, where $f = \\max(\\max_{i\\neq t}Z_i - Z_t,\\,-\\kappa)$ is the margin on the logits.</li>
        <li><b>Optimize $w$ with Adam</b> for a few hundred steps (the paper runs 10,000 on real images,
        Section V-C; we use far fewer on toy data).</li>
        <li><b>Sweep the constant $c$:</b> report success rate and mean $L_2$ at each $c$. Compare to the
        <b>FGSM</b> baseline (one signed-gradient step, swept over $\\varepsilon$). <b>Ablate</b> by replacing the
        logit margin with a softmax cross-entropy loss to see the descent degrade.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the three attacks are "successful on both distilled and undistilled neural
       networks with 100% probability," and defensive distillation's reported drop in attack success "from 95%
       to 0.5%" does not hold up against them.</p>
       <p>On distortion, the paper's <b>Table IV</b> reports the $L_2$ attack's mean $L_2$ distortion at
       <b>1.36 on MNIST</b> and <b>0.17 on CIFAR</b>, both at 100% success &mdash; smaller than the prior
       DeepFool attack's reported 2.11 (MNIST) and 0.85 (CIFAR). <i>(Quoted from Table IV; numbers are the
       paper's, on real image datasets.)</i></p>
       <p><i>The numbers in the CODE and CODEVIZ panels below are from our own tiny run on a 2-D toy classifier
       &mdash; not the paper's reported results. They reproduce the qualitative effect (high success at low
       distortion vs FGSM), not the paper's exact distortions.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> A C&amp;W attack is judged by two numbers together: <b>targeted
       success rate</b> (fraction of inputs the network now classifies as the chosen target $t$) and the
       <b>mean $L_2$ distortion</b> $\\lVert\\delta\\rVert_2$ of the perturbations that succeed — lower distortion
       at equal success is a stronger attack. The paper's setup is MNIST/CIFAR classifiers; the &ldquo;better
       than trivial&rdquo; baseline is the weaker one-step <b>FGSM</b> (and the prior <b>DeepFool</b> attack).
       (Reported: <b>100% success</b> with mean $L_2$ <b>1.36 on MNIST, 0.17 on CIFAR</b>, Table IV — below
       DeepFool's 2.11 / 0.85.)</p>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> Verify the margin loss on the worked logits:
        $Z=[2.0,0.5,-1.0],t=2,\\kappa=0 \\Rightarrow f=\\max(2.0-(-1.0),0)=3.0$, and the target-winning case
        $Z=[2.0,0.5,3.0],\\kappa=1 \\Rightarrow f=\\max(-1.0,-1.0)=-1.0$ — the notebook's first cell recomputes both.
        Check the tanh reparametrization is an identity at init: $x' = \\tfrac12(\\tanh(\\mathrm{arctanh}(2x-1))+1)$
        should return the clean $x$ (so $\\lVert\\delta\\rVert_2=0$ at step 0). Confirm $x'\\in[0,1]^n$ for
        <i>any</i> $w$. Confirm the victim classifier hits ~100% clean accuracy first — you can only measure a
        flip on inputs it gets right.</li>
        <li><b>3. Expected range.</b> A correct $L_2$ attack should reach <b>near-100% targeted success</b> at a
        mean $L_2$ <i>well below</i> FGSM's at the same success. Our toy run: C&amp;W hits 100% at mean
        $L_2\\approx 0.33$ (at $c=0.3$), while FGSM tops out ~93% even at $L_2\\approx 0.57$. Anchor the real
        target to the paper's <b>1.36 (MNIST) / 0.17 (CIFAR)</b> at 100% (approximate, Table IV of
        arXiv:1608.04644). Far below 100% success usually means $c$ too small or too few Adam steps (tuning);
        success at a <i>huge</i> $L_2$ means a wiring bug.</li>
        <li><b>4. Ablation — prove the key idea earns its keep.</b> The paper's central design choice is the
        <b>margin loss on logits</b> $Z$ (its $f_6$), chosen over softmax cross-entropy for well-scaled
        gradients. Turn it OFF: replace $f$ with $\\text{CE}(\\mathrm{softmax}(Z),t)$, everything else identical.
        A correct comparison shows the search over $c$ become finicky and the perturbations <b>larger / less
        reliable</b> — the paper measures the softmax gradient swinging from $2^{-20}$ near the clean image to
        $2^{-1}$ at the adversarial point (Section V-A). If swapping in CE makes <i>no</i> difference, you are
        probably still reading logits somewhere. Secondary knob: raising $\\kappa$ should buy higher-confidence
        flips at the cost of more $L_2$.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>$L_2$ stays 0 / no perturbation</b>: $w$ never
        moved — check it <code>requires_grad</code> and that you optimize $w$, not $x$. <b>Loss NaN / $w\\to\\pm\\infty$</b>:
        forgot to clamp $x$ into $(0,1)$ before <code>atanh</code> (arctanh blows up at $\\pm1$), or LR too high.
        <b>Success near 0 at every $c$ with the target logit <i>dropping</i></b>: the margin sign is backwards —
        it must be $\\max_{i\\neq t}Z_i - Z_t$ (competitor minus target), not the reverse. <b>Success only at
        enormous $L_2$</b>: optimizing $\\delta$ with per-step clamping instead of the tanh map (the optimizer
        fights the clip), or $c$ pinned far too large. <b>Distortion never shrinks after the flip</b>: $f$ not
        clamped at $-\\kappa$, so the loss keeps over-fooling instead of minimizing $\\lVert\\delta\\rVert_2^2$.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the plumbing ships in PyTorch, so we <b>import</b> it and
       build only the novel attack. <b>Import:</b> <code>nn.Linear</code> / <code>nn.ReLU</code> for the tiny
       classifier, <code>torch.optim.Adam</code> as the attack's optimizer (the paper's choice, Section V-B), and
       <code>torch.tanh</code> / <code>torch.atanh</code> for the change of variables. <b>Build by hand:</b> the
       <b>C&amp;W $L_2$ objective</b> &mdash; reading the <i>logits</i> $Z$ (not the softmax), forming the margin
       loss $f = \\max(\\max_{i\\neq t}Z_i - Z_t,\\,-\\kappa)$, adding the squared-$L_2$ distortion weighted by
       $c$, optimizing over the tanh-reparametrized variable $w$. That objective is the paper's contribution;
       PyTorch has no "adversarial attack" call. The FGSM baseline (a single signed-gradient step) is the weaker
       attack recapped from the <b>FGSM</b> lesson, included here only for the side-by-side comparison.</p>`,
    pitfalls:
      `<ul>
        <li><b>Using softmax probabilities instead of logits.</b> The margin loss is defined on $Z$ (the raw
        pre-softmax scores), not on the softmax output. Feeding probabilities gives the flat-then-steep gradients
        the paper warns about (Section V-A) and makes $c$ impossible to tune. <b>Fix:</b> read the layer
        <i>before</i> the softmax; in our code the classifier returns logits directly.</li>
        <li><b>Forgetting the tanh box constraint.</b> Optimizing $\\delta$ directly and clamping to $[0,1]$ each
        step fights the optimizer and stalls. <b>Fix:</b> optimize $w$ and define the image as
        $\\tfrac12(\\tanh(w)+1)$ &mdash; valid for any $w$, no clipping needed.</li>
        <li><b>Initializing $w$ wrong.</b> If $w$ does not start at $\\text{arctanh}(2x-1)$, the attack begins at
        some other image and the distortion is mismeasured. <b>Fix:</b> clamp $x$ slightly inside $(0,1)$ before
        <code>atanh</code> to avoid infinities, then set $w = \\text{arctanh}(2x-1)$.</li>
        <li><b>Getting the margin's sign backwards.</b> The loss is
        $\\max_{i\\neq t}Z_i - Z_t$ (competitor minus target), which is positive while the target is <i>losing</i>;
        minimizing it raises $Z_t$. Writing $Z_t - \\max_{i\\neq t}Z_i$ instead would push the target's logit
        <i>down</i>. <b>Fix:</b> competitor first, target subtracted.</li>
        <li><b>Reading too much into one $c$.</b> A single $c$ is a point on a trade-off curve. Too small &rarr;
        the attack may not flip the label; too large &rarr; it flips but spends extra distortion. <b>Fix:</b>
        sweep (or binary-search) $c$ and report the smallest that succeeds.</li>
       </ul>`,
    recall: [
      "Write the C&W margin loss $f(x')$ on the logits from memory, including the $\\kappa$ clamp.",
      "Write the full $L_2$ objective minimized over $w$, with the tanh change of variables.",
      "What does the constant $c$ trade off, and how is it chosen?",
      "What does $\\kappa$ control, and what value makes the attack stop as soon as the target barely wins?",
      "Why does the attack use logits $Z$ rather than the softmax probabilities?"
    ],
    practice: [
      {
        q: `<b>The softmax-loss ablation.</b> You have a working C&W $L_2$ attack that uses the logit margin
            $f = \\max(\\max_{i\\neq t}Z_i - Z_t, -\\kappa)$. Replace it with a softmax cross-entropy loss toward
            the target (so the objective becomes distortion $+\\,c\\cdot \\text{CE}(\\text{softmax}(Z), t)$),
            everything else identical. What did you change, and what does the paper predict will happen to the
            search over $c$?`,
        steps: [
          { do: `Swap the loss: from the logit margin to <code>F.cross_entropy(logits, target)</code>, which internally applies softmax.`, why: `Cross-entropy depends on the softmax probabilities, which saturate when the network is confident &mdash; flattening the gradient near a valid image.` },
          { do: `Recall the paper's measurement (Section V-A): the softmax-based gradient is ~$2^{-20}$ near the valid image but ~$2^{-1}$ at the adversarial example &mdash; a ~$10^6$ swing.`, why: `A single constant $c$ cannot balance a term whose gradient changes by six orders of magnitude across the path; the descent is either stuck or unstable.` },
          { do: `Predict: $c$ becomes hard to choose; you need a much larger or finely-tuned $c$, and the attack finds larger perturbations or fails more often than the logit-margin version.`, why: `The logit margin is roughly linear in $Z$, so its gradient is well-scaled everywhere; that is exactly why the paper prefers it.` }
        ],
        answer: `<p>You replaced the well-scaled <b>logit margin</b> with a <b>softmax cross-entropy</b> loss,
                 reintroducing the saturating-gradient problem the paper avoids. Section V-A reports the
                 softmax-based gradient swings from about $2^{-20}$ near the valid image to $2^{-1}$ at the
                 adversarial point &mdash; roughly a million-fold change &mdash; so no single constant $c$
                 balances distortion against misclassification. Expect a harder, more finicky search over $c$ and
                 generally larger or less reliable perturbations. This is precisely the design reason the C&W
                 attack works on logits, not probabilities.</p>`
      },
      {
        q: `Why does the C&W $L_2$ attack find <b>smaller</b> $L_2$ perturbations than FGSM at the same success
            level, even though both follow gradients of the same network?`,
        steps: [
          { do: `Write what FGSM does: one step, $x' = x - \\varepsilon\\,\\text{sign}(\\nabla_x \\text{loss})$. The same fixed step size $\\varepsilon$ is applied to every input and every pixel.`, why: `A fixed-size sign step ignores how far each input actually is from the boundary &mdash; it moves the same amount whether the input is near or far.` },
          { do: `Write what C&W does: minimize $\\lVert\\delta\\rVert_2^2 + c\\,f$ over many Adam steps, per input.`, why: `The distortion term actively pulls $\\delta$ toward zero, while $f$ only pushes just hard enough to cross the boundary; the optimizer settles at a near-minimal perturbation for each input.` },
          { do: `Tie it to the margin clamp: once $f$ hits $-\\kappa$, it stops, so the optimizer spends the rest of its budget shrinking distortion.`, why: `C&W explicitly minimizes distortion subject to crossing the boundary; FGSM has no notion of minimizing distortion at all.` }
        ],
        answer: `<p>Because C&W <b>optimizes the perturbation</b> while FGSM takes one <b>fixed</b> step. FGSM moves
                 every input by the same $\\varepsilon$ in the sign direction, so to fool the stubborn inputs you
                 must raise $\\varepsilon$ &mdash; over-perturbing the easy ones and inflating the average $L_2$.
                 C&W minimizes $\\lVert\\delta\\rVert_2^2$ directly, per input, pushing on $f$ only until the
                 target just wins (the $-\\kappa$ clamp), then spending the rest of its steps shrinking the
                 change. The result is high success at low distortion. In our run below, C&W reaches 100% target
                 success at mean $L_2 \\approx 0.33$, while FGSM at a comparable success spends a substantially
                 larger mean $L_2$.</p>`
      },
      {
        q: `In the worked example, logits $Z(x')=[2.0, 0.5, -1.0]$, target $t=2$, $\\kappa=0$ gave $f=3.0$.
            Suppose the attack progresses and the logits become $Z(x')=[1.0, 0.5, 1.2]$, still $t=2$. Compute
            $f$ with $\\kappa=0$, then with $\\kappa=0.5$. What does each value tell the optimizer?`,
        steps: [
          { do: `Target logit $Z_t = Z_2 = 1.2$. Best competitor among $i\\neq t$: $\\max(1.0, 0.5) = 1.0$.`, why: `Same recipe: compare the best non-target logit to the target's logit.` },
          { do: `Raw margin $= 1.0 - 1.2 = -0.2$. With $\\kappa=0$: $f = \\max(-0.2, 0) = 0$.`, why: `The target now barely leads (by $0.2$). With $\\kappa=0$ the loss bottoms out at $0$: the attack is satisfied the moment the target wins, and will now only shrink distortion.` },
          { do: `With $\\kappa=0.5$: $f = \\max(-0.2, -0.5) = -0.2$.`, why: `The target leads by only $0.2$, less than the required margin $0.5$. Since $-0.2 \\gt -0.5$, $f$ is not yet saturated &mdash; the loss still has a small negative slope pushing $Z_2$ higher to reach a $0.5$ margin.` }
        ],
        answer: `<p>With $\\kappa=0$: raw margin $1.0-1.2=-0.2$, so $f=\\max(-0.2,0)=0$. The target already wins, so
                 the misclassification term is fully satisfied and the optimizer now spends its effort only on
                 shrinking $\\lVert\\delta\\rVert_2^2$. With $\\kappa=0.5$: $f=\\max(-0.2,-0.5)=-0.2$. Now the
                 target leads by just $0.2$, short of the demanded $0.5$ margin, so $f$ is <i>not</i> at its floor
                 and still pushes the target logit up &mdash; producing a higher-confidence adversarial example at
                 the cost of slightly more distortion. That is exactly what raising $\\kappa$ buys you.</p>`
      }
    ]
  });

  window.CODE["paper-carlini-wagner"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny classifier with <code>nn.Linear</code> / <code>nn.ReLU</code> on a 2-D
       3-class toy dataset squashed into $[0,1]^2$ (so the box constraint is real), then build the <b>novel</b>
       part by hand &mdash; the <b>C&amp;W $L_2$ attack</b>. We optimize the tanh-reparametrized variable
       $w=\\text{arctanh}(2x-1)$ with <code>torch.optim.Adam</code> (the paper's optimizer, &sect;V-B),
       minimizing $\\lVert\\tfrac12(\\tanh(w)+1)-x\\rVert_2^2 + c\\cdot f$ with the <b>margin loss on logits</b>
       $f=\\max(\\max_{i\\neq t}Z_i - Z_t,-\\kappa)$ (&sect;V-A / VI-A). The first cell recomputes the worked
       example: $Z=[2.0,0.5,-1.0],t=2,\\kappa=0 \\Rightarrow f=3.0$, and the target-winning case
       $Z=[2.0,0.5,3.0],\\kappa=1 \\Rightarrow f=-1.0$. We then sweep the constant $c$ and compare to the
       single-step <b>FGSM</b> baseline. CPU, a few hundred Adam steps. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

# --- 0. Worked example: the margin loss f on a tiny logit vector. ---
Z = torch.tensor([2.0, 0.5, -1.0]); t = 2; kappa = 0.0
others = torch.cat([Z[:t], Z[t+1:]])                  # logits i != t
f = max((others.max() - Z[t]).item(), -kappa)
print("worked: Z=%s t=%d  max_{i!=t}Z=%.1f  Z_t=%.1f  f=%.1f"
      % (Z.tolist(), t, others.max().item(), Z[t].item(), f))   # -> f = 3.0
Zb = torch.tensor([2.0, 0.5, 3.0]); tb = 2                      # target winning, kappa=1
ob = torch.cat([Zb[:tb], Zb[tb+1:]])
print("worked2: raw margin=%.1f  f(kappa=1)=%.1f"
      % (ob.max().item()-Zb[tb].item(),
         max(ob.max().item()-Zb[tb].item(), -1.0)))             # -> f = -1.0

# --- 1. A tiny classifier on toy data living in [0,1]^2 (so the box constraint matters). ---
def make_data(n):
    X, y, centers = [], [], [(-1.5,-1.5),(1.5,-1.5),(0.0,1.6)]
    for c,(cx,cy) in enumerate(centers):
        X.append(np.random.randn(n,2)*0.45 + np.array([cx,cy])); y += [c]*n
    X = np.vstack(X).astype(np.float32); X = (X-X.min(0))/(X.max(0)-X.min(0))   # -> [0,1]
    return torch.tensor(X), torch.tensor(y)

Xtr, ytr = make_data(120)
clf = nn.Sequential(nn.Linear(2,32), nn.ReLU(), nn.Linear(32,32), nn.ReLU(), nn.Linear(32,3))
opt = torch.optim.Adam(clf.parameters(), lr=0.01)
for _ in range(400):
    opt.zero_grad(); F.cross_entropy(clf(Xtr), ytr).backward(); opt.step()
def Z(x): return clf(x)                                  # logits = output BEFORE softmax
print("\\nclassifier train acc = %.3f" % (clf(Xtr).argmax(1)==ytr).float().mean().item())

# Correctly-classified points; target class = next class (a fixed mislabel).
idx = (clf(Xtr).argmax(1)==ytr).nonzero().squeeze()[:60]
Xc, yc = Xtr[idx].clone(), ytr[idx].clone(); tgt = (yc+1) % 3

# --- 2. The C&W L2 attack, built by hand: tanh box-constraint + margin loss + Adam. ---
def cw_l2(X0, target, c, kappa=0.0, steps=200, lr=0.05):
    X0c = X0.clamp(1e-6, 1-1e-6)
    w = torch.atanh(2*X0c - 1).clone().detach().requires_grad_(True)   # start AT the clean image
    o = torch.optim.Adam([w], lr=lr)                                   # paper's optimizer (Sec V-B)
    for _ in range(steps):
        o.zero_grad()
        xadv = 0.5*(torch.tanh(w) + 1)                                # in [0,1] for ANY w
        logits = Z(xadv)
        tgt_logit = logits.gather(1, target[:,None]).squeeze(1)        # Z_t
        other = logits.clone(); other.scatter_(1, target[:,None], -1e9)
        f = torch.clamp(other.max(1).values - tgt_logit, min=-kappa)   # max(max_{i!=t}Z_i - Z_t, -k)
        loss = ((xadv - X0).pow(2).sum(1) + c*f).sum()                 # ||delta||^2 + c*f
        loss.backward(); o.step()
    return (0.5*(torch.tanh(w)+1)).detach()

# --- 3. FGSM baseline: one signed-gradient step toward the target (the weaker attack). ---
def fgsm(X0, target, eps):
    x = X0.clone().detach().requires_grad_(True)
    g, = torch.autograd.grad(F.cross_entropy(Z(x), target), x)
    return (x - eps*g.sign()).clamp(0,1).detach()

# --- 4. Compare: success rate & mean L2 vs the constant c (C&W) and eps (FGSM). ---
print("\\nC&W L2 attack — success & mean L2 vs constant c (kappa=0):")
for c in [0.1, 0.3, 0.5, 1.0, 5.0, 20.0, 100.0]:
    xa = cw_l2(Xc, tgt, c); pred = Z(xa).argmax(1)
    succ = (pred==tgt).float().mean().item()
    l2 = (xa-Xc).pow(2).sum(1).sqrt().mean().item()
    print("  c=%6.1f  success=%.2f  mean L2=%.4f" % (c, succ, l2))

print("\\nFGSM baseline — success & mean L2 vs step size eps:")
for eps in [0.1, 0.2, 0.3, 0.4, 0.5]:
    xa = fgsm(Xc, tgt, eps); pred = Z(xa).argmax(1)
    succ = (pred==tgt).float().mean().item()
    l2 = (xa-Xc).pow(2).sum(1).sqrt().mean().item()
    print("  eps=%.2f  success=%.2f  mean L2=%.4f" % (eps, succ, l2))

# worked:  Z=[2.0, 0.5, -1.0] t=2  max_{i!=t}Z=2.0  Z_t=-1.0  f=3.0
# worked2: raw margin=-1.0  f(kappa=1)=-1.0
# classifier train acc = 1.000
# C&W: c=0.3 -> success=1.00 mean L2=0.3253 ;  c=0.5 -> 1.00 / 0.3451
# FGSM: eps=0.40 -> success=0.80 mean L2=0.4767 ; eps=0.50 -> 0.93 / 0.5673
# C&W hits 100% target success at mean L2 ~0.33; FGSM needs far larger L2 for similar success.
# (Our small toy run, not the paper's number. Exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-carlini-wagner"] = {
    question: "Holding the network fixed, how do success rate and mean L2 distortion trade off — for the C&W L2 attack as we vary the constant c, and for the FGSM baseline as we vary the step size?",
    charts: [
      {
        type: "line",
        title: "Targeted success rate vs mean L2 distortion — C&W L2 attack vs FGSM baseline",
        xlabel: "mean L2 distortion of the perturbation (lower-left of a point = cheaper)",
        ylabel: "targeted attack success rate (fraction flipped to the target class)",
        series: [
          {
            name: "C&W L2 (sweeping constant c: 0.1, 0.3, 0.5, 5, 20, 100)",
            color: "#7ee787",
            points: [[0.2896,0.933],[0.3253,1.0],[0.3451,1.0],[0.5276,1.0],[0.5640,1.0],[0.5727,1.0]]
          },
          {
            name: "FGSM (sweeping step size eps: 0.2, 0.3, 0.4, 0.5)",
            color: "#ff7b72",
            points: [[0.2731,0.117],[0.3837,0.433],[0.4767,0.8],[0.5673,0.933]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny classifier (2&rarr;32&rarr;32&rarr;3, ReLU) is trained to 100% accuracy on a 2-D 3-class toy dataset squashed into [0,1]&sup2;. We attack 60 correctly-classified points toward a fixed target class. The C&W L2 attack (green) optimizes the tanh-reparametrized perturbation with Adam, minimizing ||&delta;||&sup2; + c&middot;f where f is the margin loss on logits; the FGSM baseline (red) takes one signed-gradient step of size &epsilon;. Up-and-to-the-left is better (high success at low distortion). C&W reaches 100% target success at mean L2 &asymp; 0.33 (at c=0.3); FGSM only reaches ~93% even at mean L2 &asymp; 0.57, and is far weaker at the same distortion. This is the paper's qualitative effect: the optimization-based attack finds much smaller perturbations for the same success.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

def make_data(n):
    X, y, ctr = [], [], [(-1.5,-1.5),(1.5,-1.5),(0.0,1.6)]
    for c,(cx,cy) in enumerate(ctr):
        X.append(np.random.randn(n,2)*0.45+np.array([cx,cy])); y += [c]*n
    X = np.vstack(X).astype(np.float32); X = (X-X.min(0))/(X.max(0)-X.min(0))
    return torch.tensor(X), torch.tensor(y)

Xtr, ytr = make_data(120)
clf = nn.Sequential(nn.Linear(2,32), nn.ReLU(), nn.Linear(32,32), nn.ReLU(), nn.Linear(32,3))
opt = torch.optim.Adam(clf.parameters(), lr=0.01)
for _ in range(400):
    opt.zero_grad(); F.cross_entropy(clf(Xtr), ytr).backward(); opt.step()
def Z(x): return clf(x)
idx = (clf(Xtr).argmax(1)==ytr).nonzero().squeeze()[:60]
Xc, yc = Xtr[idx].clone(), ytr[idx].clone(); tgt = (yc+1)%3

def cw_l2(X0, target, c, kappa=0.0, steps=200, lr=0.05):
    w = torch.atanh(2*X0.clamp(1e-6,1-1e-6)-1).clone().detach().requires_grad_(True)
    o = torch.optim.Adam([w], lr=lr)
    for _ in range(steps):
        o.zero_grad(); xadv = 0.5*(torch.tanh(w)+1); lg = Z(xadv)
        tl = lg.gather(1, target[:,None]).squeeze(1)
        oth = lg.clone(); oth.scatter_(1, target[:,None], -1e9)
        f = torch.clamp(oth.max(1).values - tl, min=-kappa)
        (((xadv-X0).pow(2).sum(1) + c*f).sum()).backward(); o.step()
    return (0.5*(torch.tanh(w)+1)).detach()

def fgsm(X0, target, eps):
    x = X0.clone().detach().requires_grad_(True)
    g, = torch.autograd.grad(F.cross_entropy(Z(x), target), x)
    return (x - eps*g.sign()).clamp(0,1).detach()

for c in [0.1,0.3,0.5,5.0,20.0,100.0]:
    xa = cw_l2(Xc,tgt,c); p = Z(xa).argmax(1)
    print("CW   c=%6.1f  succ=%.3f  L2=%.4f"
          % (c,(p==tgt).float().mean().item(),(xa-Xc).pow(2).sum(1).sqrt().mean().item()))
for eps in [0.2,0.3,0.4,0.5]:
    xa = fgsm(Xc,tgt,eps); p = Z(xa).argmax(1)
    print("FGSM eps=%.2f  succ=%.3f  L2=%.4f"
          % (eps,(p==tgt).float().mean().item(),(xa-Xc).pow(2).sum(1).sqrt().mean().item()))
# CW   c=   0.1  succ=0.933  L2=0.2896      FGSM eps=0.20 succ=0.117 L2=0.2731
# CW   c=   0.3  succ=1.000  L2=0.3253      FGSM eps=0.30 succ=0.433 L2=0.3837
# CW   c=   0.5  succ=1.000  L2=0.3451      FGSM eps=0.40 succ=0.800 L2=0.4767
# CW   c=   5.0  succ=1.000  L2=0.5276      FGSM eps=0.50 succ=0.933 L2=0.5673
# CW   c=  20.0  succ=1.000  L2=0.5640
# CW   c= 100.0  succ=1.000  L2=0.5727
# C&W: 100% success at L2~0.33; FGSM never beats it at equal distortion.
# Our small run, not the paper's number.`
  };
})();
