/* Paper lesson — "Explaining and Harnessing Adversarial Examples" (FGSM),
   Goodfellow, Shlens, Szegedy, ICLR 2015. Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-fgsm".
   GROUNDED from arXiv:1412.6572 (abstract) and the ar5iv HTML mirror:
   Section 3 (linear explanation, eta = eps*sign(w), activation grows by eps*m*n);
   Section 4 (the Fast Gradient Sign Method: eta = eps*sign(grad_x J); MNIST error
   rates 99.9% softmax / 89.4% maxout at eps=0.25); Section 6 (adversarial-training
   objective J~ = alpha*J + (1-alpha)*J(adv), alpha=0.5; error fell to 17.9%).
   Track B (architecture): compose a tiny classifier with torch.nn, then implement the
   NOVEL part by hand — the FGSM perturbation and FGSM adversarial training. */
(function () {
  window.LESSONS.push({
    id: "paper-fgsm",
    title: "FGSM — Explaining and Harnessing Adversarial Examples (2015)",
    tagline: "A tiny perturbation in the gradient-sign direction flips a classifier; training on those examples is the fix.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Ian J. Goodfellow, Jonathon Shlens, Christian Szegedy",
      org: "Google Inc.",
      year: 2015,
      venue: "arXiv:1412.6572 (Dec 2014); ICLR 2015",
      citations: "",
      arxiv: "https://arxiv.org/abs/1412.6572",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-cross-entropy", "dl-backprop", "fnd-gradient", "fnd-dot", "fnd-norm", "pt-autograd", "pt-nn-module", "ml-gradient-descent"],

    // WHY READ IT
    problem:
      `<p>A trained image classifier can be near-perfect on test data and still be fooled by a change you cannot
       see. Take a correctly classified image. Add a small, carefully chosen perturbation to every pixel. The
       picture looks identical to a human. The network now reports the wrong class &mdash; often with high
       confidence. These are <b>adversarial examples</b>.</p>
       <p>Before this paper, the leading guess was that this happened because deep networks are highly
       <b>non-linear</b> and <b>overfit</b> &mdash; they carve out strange little pockets of misclassification.
       The authors disagree. From the abstract:</p>
       <blockquote>"We argue instead that the primary cause of neural networks' vulnerability to adversarial
       perturbation is their linear nature." (Abstract)</blockquote>
       <p>The open questions they answer: <i>why</i> do these examples exist, why does the <i>same</i>
       adversarial image fool many different models, and can we <b>cheaply generate</b> them &mdash; and then
       use them to <b>defend</b> the network?</p>`,
    contribution:
      `<ul>
        <li><b>A linear explanation.</b> The paper argues adversarial examples come from networks being too
        <b>linear</b>, not too non-linear. In high dimensions, many tiny per-pixel changes add up. The change to
        a linear unit's output grows with the input <b>dimension</b>, so a perturbation too small to see can
        still swing the output a lot.</li>
        <li><b>The Fast Gradient Sign Method (FGSM).</b> A one-shot, one-backprop recipe for the worst-case
        perturbation under a max-size budget: step every pixel by the same amount $\\epsilon$ in the direction
        that the loss gradient says increases the loss &mdash; the <b>sign</b> of the gradient with respect to
        the input.</li>
        <li><b>Adversarial training as a defense.</b> Generate FGSM examples during training and add them to the
        loss. This is a cheap regularizer that measurably hardens the network against the same attack.</li>
      </ul>`,
    whyItMattered:
      `<p>FGSM made adversarial examples easy to study: one gradient sign, one backward pass, no inner
       optimization. That turned a curiosity into a whole subfield &mdash; robustness research, stronger attacks
       (iterative FGSM / projected gradient descent), and certified defenses all trace back here. The
       "perturbation grows with dimension" argument reframed robustness as a property of the model's geometry,
       not a bug in the data. Adversarial training remains one of the few defenses that actually holds up, and
       the FGSM step is still the building block of the strong iterative attacks used to stress-test models
       today.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (The Linear Explanation of Adversarial Examples)</b> &mdash; the core argument. A
        perturbation $\\eta$ with max-size $\\epsilon$ chosen as $\\eta = \\epsilon\\,\\text{sign}(w)$ makes a
        linear unit's output grow by $\\epsilon m n$ ($m$ = average weight magnitude, $n$ = input dimension).
        The output change scales with $n$ while the perturbation size does not. This is the "grows with
        dimension" point.</li>
        <li><b>&sect;4 (Linear Perturbation of Non-Linear Models)</b> &mdash; the <b>Fast Gradient Sign Method</b>
        itself: $\\eta = \\epsilon\\,\\text{sign}(\\nabla_x J(\\theta,x,y))$. This is the equation you transcribe
        and implement. It also reports the MNIST error rates at $\\epsilon=0.25$.</li>
        <li><b>&sect;6 (Adversarial Training of Deep Networks)</b> &mdash; the defense: the modified loss
        $\\tilde J = \\alpha J + (1-\\alpha) J(\\text{adv})$ with $\\alpha=0.5$, and the error rate after
        training on FGSM examples.</li>
       </ul>
       <p><b>Skim:</b> &sect;5 (the maxout-unit linear argument), &sect;7-9 (why adversarial examples transfer
       across models, the "rubbish class" experiments, and the broader discussion). Read the first paragraph of
       &sect;3 carefully &mdash; it sets up the whole linearity thesis.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a small digit classifier to high clean accuracy, then attack its test set with FGSM:
       nudge every pixel by $\\epsilon$ in the gradient-sign direction. You sweep $\\epsilon$ from $0$ upward.
       Two questions before you run: (1) At a perturbation small enough that the digits still look like the same
       digits, how far do you think test accuracy falls &mdash; a few points, or off a cliff? (2) If you then
       <i>retrain</i> the network on its own FGSM examples (adversarial training) and re-attack, does accuracy
       at that same $\\epsilon$ recover a lot, a little, or not at all? Write your two guesses.</p>
       <p>(Hint: the linear argument says the loss climbs roughly linearly in $\\epsilon$ &mdash; but
       classification accuracy can collapse once the loss crosses the decision boundary for most inputs.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build by hand. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>FGSM attack.</b> Given a batch <code>x</code> and labels <code>y</code>, mark the input as needing
        a gradient: <code>x = x.clone().detach().requires_grad_(True)</code>. Compute
        <code>loss = F.cross_entropy(net(x), y)</code>, then
        <code>g, = torch.autograd.grad(loss, x)</code>. TODO &mdash; form the adversarial input
        $x_{\\text{adv}} = x + \\epsilon\\,\\text{sign}(g)$ and clamp it back into the valid pixel range
        $[0,1]$. <i># note: gradient is w.r.t. the INPUT x, not the weights</i></li>
        <li><b>Adversarial training.</b> In each training step, compute the clean loss, then generate FGSM
        examples from the current network and compute their loss too. TODO &mdash; combine them as
        $\\tilde J = \\alpha J_{\\text{clean}} + (1-\\alpha) J_{\\text{adv}}$ with $\\alpha = 0.5$, and step.</li>
        <li>TODO: why the <b>sign</b> of the gradient, and not the gradient itself? (Hint: what norm is the
        perturbation budget measured in?)</li>
       </ul>
       <p>Then sweep $\\epsilon$ and compare the clean-trained and adversarially-trained networks. Predict which
       curve stays higher.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The paper has two ideas that fit together: <b>why</b> adversarial examples exist (a linearity argument),
       and a fast <b>method</b> that exploits it.</p>
       <p><b>1. The linear explanation (&sect;3).</b> Consider a single linear unit: it outputs the dot product
       $w^\\top x$ (each input multiplied by its weight, summed). Perturb the input to
       $\\tilde x = x + \\eta$. The output becomes $w^\\top\\tilde x = w^\\top x + w^\\top\\eta$. So the
       perturbation changes the output by exactly $w^\\top\\eta$. Now limit the perturbation so no single pixel
       moves more than $\\epsilon$ &mdash; that is, bound its <b>max-norm</b> (the largest absolute entry) by
       $\\epsilon$. The change $w^\\top\\eta$ is largest when $\\eta$ points each pixel the same way its weight
       does: $\\eta = \\epsilon\\,\\text{sign}(w)$. Then (&sect;3):</p>
       <p>$$ w^\\top \\eta = \\epsilon \\sum_j |w_j| = \\epsilon\\, m\\, n, $$</p>
       <p>where $m$ is the average magnitude of a weight and $n$ is the number of inputs (the dimension). Read
       the punch line: the perturbation's <b>size</b> ($\\epsilon$, the max-norm) does <i>not</i> grow with $n$,
       but the <b>output change</b> ($\\epsilon m n$) grows <i>linearly</i> with $n$. In high dimensions, many
       imperceptible nudges accumulate into a large swing. That is why a change too small to see can flip the
       prediction.</p>
       <p><b>2. The Fast Gradient Sign Method (&sect;4).</b> A real network is non-linear, but the paper's claim
       is that it behaves linearly enough that the same trick works. Replace the single weight vector $w$ with
       the gradient of the loss $J(\\theta,x,y)$ with respect to the input $x$. Step every input coordinate by
       $\\epsilon$ in the direction that <i>increases</i> the loss &mdash; the sign of that gradient (&sect;4):</p>
       <p>$$ \\eta = \\epsilon\\, \\text{sign}\\big(\\nabla_x J(\\theta, x, y)\\big), \\qquad
       x_{\\text{adv}} = x + \\eta. $$</p>
       <p>One forward pass and one backward pass give $\\nabla_x J$; the sign and the scaling are free. That is
       the whole attack &mdash; hence "fast." The paper reports (&sect;4) that at $\\epsilon=0.25$ this causes a
       shallow softmax classifier to misclassify "99.9%" of MNIST adversarial examples.</p>
       <p><b>3. Adversarial training (&sect;6).</b> If FGSM examples break the network, train on them. Mix the
       clean loss and the adversarial loss into one objective and minimize as usual. With $\\alpha=0.5$, half the
       weight goes on clean inputs and half on the network's own FGSM examples, regenerated each step from the
       current weights.</p>`,
    architecture:
      `<p>FGSM is not a network architecture but a <b>per-step attack + training procedure</b> wrapped around any
       differentiable classifier. The structure has three reusable pieces.</p>
       <p><b>(a) The victim classifier.</b> Any model $f_\\theta$ trained with a differentiable loss $J$. In the
       paper the strongest demonstrations use a <b>maxout network</b> (and a shallow softmax classifier) on MNIST;
       the linear argument of &sect;3 applies to any unit whose output is (locally) $w^\\top x$ &mdash; ReLU,
       maxout, LSTM gates &mdash; which the paper notes are all <i>deliberately</i> designed to behave linearly
       for easy optimization, and that is exactly why they are vulnerable.</p>
       <p><b>(b) The FGSM perturbation step (&sect;4).</b> One forward pass computes $J(\\theta,x,y)$; one backward
       pass computes $\\nabla_x J$ &mdash; the gradient differentiated w.r.t. the <i>input</i> $x$, not the weights
       $\\theta$. Apply $\\text{sign}(\\cdot)$ entrywise, scale by $\\epsilon$, add to $x$, and clamp to the valid
       pixel range. Cost: one extra backprop. No inner optimization loop &mdash; that is what makes it "fast."</p>
       <p><b>(c) The adversarial-training loop (&sect;6).</b> Each training iteration:
       (1) compute the clean loss $J(\\theta,x,y)$;
       (2) run step (b) on the <i>current</i> weights to build $x_{\\text{adv}} = x + \\epsilon\\,\\text{sign}(\\nabla_x J)$;
       (3) compute the adversarial loss $J(\\theta, x_{\\text{adv}}, y)$;
       (4) form the mixed objective $\\tilde J = \\alpha J + (1-\\alpha)J_{\\text{adv}}$ with $\\alpha = 0.5$;
       (5) backpropagate $\\tilde J$ through $\\theta$ and update. The attack is <b>regenerated every step</b>, so
       it always targets the model's current decision surface rather than a frozen set of examples. Data flow per
       step: $x \\to f_\\theta \\to J \\to \\nabla_x J \\to x_{\\text{adv}} \\to f_\\theta \\to J_{\\text{adv}}
       \\to \\tilde J \\to \\nabla_\\theta \\tilde J \\to$ weight update.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input</b> (here a digit image, flattened to a vector of pixel values in $[0,1]$). The attack perturbs $x$, not the weights." },
      { sym: "$y$", desc: "the <b>true label</b> of input $x$ (which digit it actually is)." },
      { sym: "$\\theta$", desc: "the network's <b>weights</b>. Fixed during the attack &mdash; FGSM moves the input, not the model." },
      { sym: "$J(\\theta,x,y)$", desc: "the <b>loss</b> the network was trained to minimize (here cross-entropy: how wrong the prediction is). The attack tries to make this <i>larger</i>." },
      { sym: "$\\nabla_x J$", desc: "the <b>gradient of the loss with respect to the input</b> $x$: a vector with one entry per pixel, telling how a tiny change to that pixel changes the loss. Computed by backpropagation, the same way as the weight gradient &mdash; just differentiated w.r.t. $x$ instead of $\\theta$." },
      { sym: "$\\text{sign}(\\cdot)$", desc: "the <b>sign function</b>, applied entrywise: $+1$ where the input is positive, $-1$ where negative, $0$ where zero. It throws away the magnitude and keeps only the direction." },
      { sym: "$\\epsilon$", desc: "the <b>perturbation budget</b> (epsilon): the maximum amount any single pixel may move. It bounds the perturbation in <b>max-norm</b> (the largest absolute entry). For MNIST the paper uses $\\epsilon = 0.25$." },
      { sym: "$\\eta$", desc: "the <b>perturbation</b> (eta) added to the input: $\\eta = \\epsilon\\,\\text{sign}(\\nabla_x J)$. Every entry is exactly $+\\epsilon$ or $-\\epsilon$." },
      { sym: "$x_{\\text{adv}}$", desc: "the <b>adversarial example</b>: $x_{\\text{adv}} = x + \\eta$, then clamped back into the valid pixel range." },
      { sym: "$w$", desc: "in the linear argument (&sect;3), a <b>weight vector</b> of a single linear unit; $w^\\top x$ is its output (a dot product)." },
      { sym: "$m$", desc: "the <b>average magnitude</b> of a weight (the mean of $|w_j|$ over the $n$ entries), used in the dimension argument $w^\\top\\eta = \\epsilon m n$." },
      { sym: "$n$", desc: "the <b>input dimension</b> (number of pixels). The output change $\\epsilon m n$ grows with $n$; the perturbation size $\\epsilon$ does not." },
      { sym: "$\\alpha$", desc: "the <b>adversarial-training mix weight</b> (alpha): how much of the loss is the clean term vs. the FGSM term. The paper uses $\\alpha = 0.5$." },
      { sym: "“max-norm”", desc: "a plain term: the largest absolute entry of a vector, written $\\lVert\\cdot\\rVert_\\infty$. FGSM bounds the perturbation in this norm &mdash; \"no pixel moves more than $\\epsilon$.\"" }
    ],
    formula:
      `$$ w^\\top \\tilde x = w^\\top x + w^\\top \\eta $$
       <p class="cap">A linear unit's output under a perturbed input $\\tilde x = x + \\eta$: the change is exactly $w^\\top\\eta$ (&sect;3, linear explanation).</p>
       $$ \\eta = \\epsilon\\,\\text{sign}(w) \\;\\Longrightarrow\\; w^\\top \\eta = \\epsilon \\sum_j |w_j| = \\epsilon\\, m\\, n $$
       <p class="cap">The max-norm-bounded perturbation that maximizes the output change; the change grows as $\\epsilon m n$ &mdash; linearly in the dimension $n$ &mdash; while $\\epsilon$ stays fixed (&sect;3, dimension-growth argument).</p>
       $$ \\eta = \\epsilon\\,\\text{sign}\\big(\\nabla_x J(\\theta,x,y)\\big), \\qquad x_{\\text{adv}} = x + \\eta $$
       <p class="cap">The Fast Gradient Sign Method: step every input pixel by $\\epsilon$ along the sign of the loss gradient w.r.t. the input (&sect;4).</p>
       $$ \\tilde J(\\theta,x,y) = \\alpha\\,J(\\theta,x,y) + (1-\\alpha)\\,J\\big(\\theta,\\,x+\\epsilon\\,\\text{sign}(\\nabla_x J(\\theta,x,y)),\\,y\\big) $$
       <p class="cap">The adversarial-training objective: a mix ($\\alpha = 0.5$) of the clean loss and the loss on the FGSM example regenerated from the current weights (&sect;6).</p>`,
    whatItDoes:
      `<p><b>The FGSM equation</b> (left, &sect;4) says: find the direction in input space that most increases the
       loss (that is $\\nabla_x J$), strip it down to just its sign, and step every pixel by the same amount
       $\\epsilon$ that way. Because the budget is on the <b>max-norm</b> (no pixel moves more than $\\epsilon$),
       the loss-maximizing step under that budget is exactly the sign &mdash; using the raw gradient would make
       big-gradient pixels move more and waste budget where it does not help most. One backward pass gives the
       whole perturbation. The result $x_{\\text{adv}}$ looks unchanged to a human but pushes the network toward
       the wrong class.</p>
       <p><b>The adversarial-training objective</b> (right, &sect;6) is the defense. It is a weighted average of
       two losses: the ordinary loss on the clean input, and the loss on the FGSM example generated from the
       <i>current</i> weights. Minimizing it forces the network to be correct not only on the data but on a
       shell of worst-case neighbors around each point. With $\\alpha=0.5$ the two count equally. The adversarial
       term is regenerated every step, so the defense tracks the model as it changes.</p>`,
    derivation:
      `<p><b>Why the sign, and why it is the worst case under the budget.</b> Locally, a small perturbation
       $\\eta$ changes the loss by the first-order (linear) approximation</p>
       <p>$$ J(\\theta, x+\\eta, y) \\;\\approx\\; J(\\theta, x, y) + (\\nabla_x J)^\\top \\eta. $$</p>
       <p>This is just the first term of a Taylor expansion: $\\nabla_x J$ is the loss's local slope in each
       pixel, and the dot product $(\\nabla_x J)^\\top\\eta$ is how much the loss moves when we add $\\eta$. The
       attacker wants to <b>maximize</b> this increase, subject to spending no more than $\\epsilon$ on any one
       pixel &mdash; that is, $\\lVert\\eta\\rVert_\\infty \\le \\epsilon$. The dot product $\\sum_j (\\nabla_x
       J)_j\\,\\eta_j$ is largest, term by term, when each $\\eta_j$ has the same sign as its gradient entry and
       takes the full size $\\epsilon$. So the optimal $\\eta$ is</p>
       <p>$$ \\eta^\\star = \\arg\\max_{\\lVert\\eta\\rVert_\\infty \\le \\epsilon}\\, (\\nabla_x J)^\\top \\eta
       \\;=\\; \\epsilon\\,\\text{sign}(\\nabla_x J). $$</p>
       <p>That is the FGSM formula &mdash; it is the closed-form maximizer of the linearized loss inside the
       max-norm ball. The magnitude of the gradient does not matter, only its sign, because the budget caps each
       coordinate independently. This is the same algebra as the linear argument in &sect;3, where the
       loss-gradient $\\nabla_x J$ plays the role of the weight vector $w$ and the maximizing perturbation is
       $\\epsilon\\,\\text{sign}(w)$.</p>`,
    example:
      `<p>Work one FGSM step by hand on a tiny linear classifier so the perturbation is concrete. Use a 3-pixel
       input and a single linear score for the positive class: $s = w^\\top x + b$ with
       $w = [2,\\,-3,\\,0.5]$, $b = 1$, input $x = [1,\\,1,\\,1]$, true label $y = 1$ (the positive class), and
       budget $\\epsilon = 0.1$. The loss is binary cross-entropy
       $J = \\text{softplus}(-s) = \\log(1 + e^{-s})$ (small when the score $s$ is large and positive).</p>
       <ul class="steps">
        <li><b>Score.</b> $s = 2(1) + (-3)(1) + 0.5(1) + 1 = 2 - 3 + 0.5 + 1 = 0.5$. The model is correct but
        not confident.</li>
        <li><b>Gradient w.r.t. the input.</b> For this loss, $\\nabla_x J = -\\sigma(-s)\\,w$, where
        $\\sigma$ is the sigmoid. Here $\\sigma(-0.5) = 0.3775$, so
        $\\nabla_x J = -0.3775\\cdot[2,-3,0.5] = [-0.7550,\\; 1.1326,\\; -0.1888]$.</li>
        <li><b>Sign.</b> $\\text{sign}(\\nabla_x J) = [-1,\\; +1,\\; -1]$ &mdash; keep only the direction.</li>
        <li><b>Perturbation.</b> $\\eta = \\epsilon\\,\\text{sign}(\\nabla_x J) = 0.1\\cdot[-1,+1,-1] =
        [-0.1,\\; +0.1,\\; -0.1]$. Every entry is exactly $\\pm 0.1$.</li>
        <li><b>Effect on the score.</b> The new score is $s_{\\text{adv}} = w^\\top(x+\\eta) + b = s + w^\\top\\eta$.
        Here $w^\\top\\eta = 2(-0.1) + (-3)(0.1) + 0.5(-0.1) = -0.2 - 0.3 - 0.05 = -0.55$, so
        $s_{\\text{adv}} = 0.5 - 0.55 = -0.05$. The score flipped from $+0.5$ (class 1) to $-0.05$ (class 0).
        A $0.1$ nudge per pixel changed the prediction.</li>
       </ul>
       <p>Notice $w^\\top\\eta = -\\epsilon\\sum_j|w_j| = -0.1\\cdot(2+3+0.5) = -0.55$ &mdash; exactly the
       $\\epsilon m n$ formula from &sect;3 (here $\\sum|w_j| = m\\,n = 5.5$). These exact numbers are recomputed
       in the notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build the classifier</b> with <code>torch.nn</code>: a tiny multi-layer perceptron (input &rarr;
        128 ReLU &rarr; 10 classes) over a small digit dataset with pixels scaled to $[0,1]$.</li>
        <li><b>Train it normally</b> to high clean accuracy &mdash; this is the victim model.</li>
        <li><b>Implement FGSM (by hand):</b> for a batch, set <code>x.requires_grad_(True)</code>, compute the
        cross-entropy loss, take <code>autograd.grad(loss, x)</code>, and form
        $x_{\\text{adv}} = \\text{clamp}(x + \\epsilon\\,\\text{sign}(g),\\,0,\\,1)$.</li>
        <li><b>Attack:</b> sweep $\\epsilon \\in \\{0, 0.05, \\dots, 0.3\\}$ and measure test accuracy on the
        FGSM examples. Watch it fall.</li>
        <li><b>Defend (adversarial training):</b> retrain a fresh network with the mixed loss
        $\\tilde J = \\tfrac12 J_{\\text{clean}} + \\tfrac12 J_{\\text{adv}}$, regenerating FGSM examples each
        step at $\\epsilon = 0.25$.</li>
        <li><b>Compare:</b> sweep $\\epsilon$ again and plot accuracy vs. $\\epsilon$ for the clean-trained vs.
        adversarially-trained models. <b>Ablate</b> the defense by setting $\\alpha = 1$ (clean only) to confirm
        the recovery came from the FGSM term.</li>
      </ol>`,
    results:
      `<p>From &sect;4 (quoted): a shallow softmax classifier on MNIST hits an "error rate of 99.9% with an
       average confidence of 79.3%" on FGSM adversarial examples at $\\epsilon = 0.25$; a maxout network
       "misclassifies 89.4% of our adversarial examples with an average confidence of 97.6%."</p>
       <p>From &sect;6 (quoted): adversarial training makes the network "somewhat robust to adversarial examples"
       &mdash; the maxout network's "error rate fell to 17.9%" on adversarial examples after training with the
       FGSM-augmented objective, while its clean test error improved to "0.782%" (vs. "0.94% without adversarial
       training").</p>
       <p><i>These are the paper's own reported numbers, quoted from &sect;4 and &sect;6 of arXiv:1412.6572. The
       numbers in the CODEVIZ panel below are from our own tiny run on an 8&times;8 digit dataset &mdash; not the
       paper's reported results.</i></p>`,

    evaluation:
      `<p><b>1. The metric &amp; benchmark.</b> The metric is <b>accuracy (or error rate) on FGSM adversarial
       examples</b> as you sweep the budget $\\epsilon$ &mdash; the paper's setup is <b>MNIST</b> at
       $\\epsilon=0.25$ (&sect;4 / &sect;6). The "no-skill" floor is <b>10% accuracy</b> (10-way uniform guessing),
       which a successfully attacked clean model approaches. Two reference points from the paper: a clean-trained
       shallow softmax hits <b>99.9% error</b> on FGSM examples at $\\epsilon=0.25$ (&sect;4), and adversarial
       training cuts a maxout net's adversarial error to <b>17.9%</b> (&sect;6) &mdash; the gap between those is the
       effect you are measuring.</p>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> (a) <b>Clean accuracy first:</b> at $\\epsilon=0$ both the
        clean- and adversarially-trained nets must report the <i>same</i> accuracy (in our run <b>94.07%</b>); if
        they differ at $\\epsilon=0$ your eval data or seeding drifted. (b) <b>Gradient target:</b> assert the
        FGSM gradient is w.r.t. the <b>input</b> (<code>x.requires_grad_(True)</code> + <code>autograd.grad(loss,
        x)</code>), not the weights. (c) <b>Perturbation shape:</b> every entry of $\\eta$ must be exactly
        $\\pm\\epsilon$ (it is $\\epsilon\\,\\text{sign}(g)$); print $\\eta$ and check. (d) <b>Clamp:</b>
        $x_{\\text{adv}}\\in[0,1]$ after the step. (e) <b>Worked-example unit test:</b> the 3-pixel linear case must
        reproduce score $0.5\\to$ sign $[-1,+1,-1]\\to$ adversarial score $-0.05$ with $w\\!\\cdot\\!\\eta=-0.55$
        (the first CODE cell checks this). (f) <b>Monotonicity:</b> clean accuracy should be non-increasing as
        $\\epsilon$ grows.</li>
        <li><b>3. Expected range.</b> A correct attack should drive the clean model toward the <b>10%</b> floor by
        a moderate $\\epsilon$ (in our 8&times;8-digit run, <b>0%</b> by $\\epsilon=0.25$), and adversarial
        training should hold meaningfully above that ($\\approx$<b>18.7%</b> at $\\epsilon=0.25$ in our run). On
        MNIST the paper's targets are <b>99.9% error</b> (clean, softmax, &sect;4) and <b>17.9% error</b> after
        adversarial training (&sect;6) &mdash; these are the paper's reported figures; our toy 8&times;8 numbers
        only need to match the <i>shape</i> (clean collapses, defense degrades slowly). If the clean model does
        <i>not</i> collapse as $\\epsilon$ rises, the attack is not really perturbing the input.</li>
        <li><b>4. Ablation &mdash; prove the key idea earns its keep.</b> The defense knob is the mix weight
        <b>$\\alpha$</b>. Set <b>$\\alpha=1$</b> (drop the $(1-\\alpha)J_{\\text{adv}}$ term &mdash; clean-only
        training) and retrain: adversarial accuracy at $\\epsilon=0.25$ must <b>fall back to the clean-trained
        model's level</b> (near zero in our run). If it does not drop, the FGSM examples were never actually fed
        into the loss (e.g. frozen / not regenerated each step), and the "robustness" is an artifact.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>Accuracy unchanged as $\\epsilon$ grows</b> &rarr;
        you took the gradient w.r.t. weights, not the input, so $x_{\\text{adv}}=x$. <b>Attack too weak / budget
        ignored</b> &rarr; you used the raw gradient $\\epsilon g$ instead of $\\epsilon\\,\\text{sign}(g)$,
        violating the max-norm budget. <b>Adversarial training doesn't help</b> &rarr; FGSM examples generated once
        and frozen instead of regenerated from current weights each step. <b>Impossible-looking inputs / inflated
        attack</b> &rarr; forgot to <code>.clamp(0,1)</code>. <b>Accuracy drops as a sharp cliff</b> &rarr; this is
        <i>expected</i>: the loss climbs ~linearly in $\\epsilon$ but accuracy collapses once most inputs cross the
        decision boundary &mdash; not a bug.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The classifier and the optimizer already ship in PyTorch,
       so you <b>import</b> them and build only the novel parts. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code> for the multi-layer perceptron, <code>F.cross_entropy</code> for the loss, and
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> (1) the <b>FGSM perturbation</b> &mdash; take the
       gradient of the loss <i>with respect to the input</i> via
       <code>torch.autograd.grad(loss, x)</code>, then $x + \\epsilon\\,\\text{sign}(g)$; and (2) <b>adversarial
       training</b> &mdash; the mixed loss $\\alpha J_{\\text{clean}} + (1-\\alpha) J_{\\text{adv}}$ with the FGSM
       example regenerated each step. The key mental shift is that the gradient is taken w.r.t. the <i>input</i>,
       not the weights &mdash; the same backprop machinery, pointed at $x$.</p>`,
    pitfalls:
      `<ul>
        <li><b>Differentiating w.r.t. the weights instead of the input.</b> FGSM needs $\\nabla_x J$, the
        gradient of the loss with respect to the <i>input</i> pixels. <b>Fix:</b> mark the input with
        <code>x.requires_grad_(True)</code> and call <code>torch.autograd.grad(loss, x)</code>; do not use
        <code>loss.backward()</code> on the weights.</li>
        <li><b>Using the raw gradient instead of its sign.</b> Stepping by $\\epsilon\\,g$ (not
        $\\epsilon\\,\\text{sign}(g)$) violates the max-norm budget: big-gradient pixels move far, small ones
        barely move. FGSM's whole point is that under a per-pixel budget the optimal step is the <b>sign</b>.
        <b>Fix:</b> $x + \\epsilon\\,\\text{sign}(g)$.</li>
        <li><b>Forgetting to clamp.</b> $x + \\epsilon\\,\\text{sign}(g)$ can push pixels outside the valid
        $[0,1]$ range, creating impossible images and inflating the attack. <b>Fix:</b>
        <code>.clamp(0,1)</code> after the step.</li>
        <li><b>Generating the FGSM examples once and freezing them.</b> In adversarial training the attack must
        be recomputed each step from the <i>current</i> weights, or the network learns to beat a stale attack.
        <b>Fix:</b> regenerate $x_{\\text{adv}}$ inside the training loop.</li>
        <li><b>Reading accuracy as a smooth line.</b> The loss climbs roughly linearly in $\\epsilon$ (the
        linear argument), but accuracy can collapse abruptly once most inputs cross the decision boundary. A
        sharp cliff is expected, not a bug.</li>
        <li><b>Comparing across different seeds/scales as if they were the paper's numbers.</b> Our run uses a
        toy 8&times;8 dataset; absolute percentages differ from the paper. Only the <i>qualitative</i> effect
        (sharp drop; defense recovers some accuracy) is the point.</li>
      </ul>`,
    recall: [
      "Write the FGSM perturbation $\\eta$ (&sect;4) and the adversarial-training objective $\\tilde J$ (&sect;6) from memory.",
      "Why the <b>sign</b> of the gradient, not the gradient itself? Which norm bounds the perturbation?",
      "In the linear argument (&sect;3), why does the output change $\\epsilon m n$ grow with dimension $n$ while the perturbation size $\\epsilon$ does not?",
      "FGSM differentiates the loss with respect to what &mdash; the weights or the input? Define $\\nabla_x J$."
    ],
    practice: [
      {
        q: `<b>The defense ablation.</b> You have working adversarial training with $\\alpha=0.5$. Set
            $\\alpha=1$ (use only the clean loss, drop the FGSM term) and retrain, everything else identical.
            What did you just remove, and what do you expect to happen to accuracy on FGSM examples at
            $\\epsilon=0.25$?`,
        steps: [
          { do: `Find the mixed loss <code>loss = 0.5*J_clean + 0.5*J_adv</code> and change it to
                 <code>loss = J_clean</code> (equivalently $\\alpha=1$).`, why: `$\\alpha=1$ zeroes the
                 $(1-\\alpha)J_{\\text{adv}}$ term, so the network never sees its own FGSM examples during
                 training &mdash; it reduces to ordinary clean training.` },
          { do: `Identify what was dropped: the worst-case neighbor term that forces correctness on a shell
                 around each input.`, why: `Without it, the network optimizes only the data points, leaving the
                 same linear directions exploitable by FGSM.` },
          { do: `Retrain and re-attack at $\\epsilon=0.25$: expect accuracy on adversarial examples to fall back
                 toward the clean-trained model's level.`, why: `The robustness came specifically from training
                 on FGSM examples; remove that term and you remove the defense.` }
        ],
        answer: `<p>Setting $\\alpha=1$ deletes the adversarial term $(1-\\alpha)\\,J_{\\text{adv}}$, so training
                 reverts to clean-only &mdash; the network never practices on its own FGSM examples. Re-attacked
                 at $\\epsilon=0.25$, its adversarial accuracy collapses back to roughly the clean-trained
                 model's level (near zero in our run). This confirms the recovery in the CODEVIZ panel came from
                 the FGSM term, not from anything else. The defense <i>is</i> the augmented loss.</p>`
      },
      {
        q: `Why does FGSM use $\\text{sign}(\\nabla_x J)$ rather than the gradient $\\nabla_x J$ itself, or a
            normalized gradient $\\nabla_x J / \\lVert\\nabla_x J\\rVert_2$? Tie your answer to which norm the
            perturbation budget is measured in.`,
        steps: [
          { do: `Write the linearized loss increase: $(\\nabla_x J)^\\top\\eta$, to be maximized subject to a
                 budget on $\\eta$.`, why: `Locally the loss change is this dot product; FGSM maximizes it under
                 a size constraint.` },
          { do: `State the budget: $\\lVert\\eta\\rVert_\\infty \\le \\epsilon$ &mdash; no single pixel moves more
                 than $\\epsilon$.`, why: `This is a max-norm (per-pixel) cap, the natural "imperceptible to a
                 human" constraint for images.` },
          { do: `Maximize term by term: each $\\eta_j$ should match its gradient's sign and take the full
                 $\\epsilon$. The maximizer is $\\epsilon\\,\\text{sign}(\\nabla_x J)$.`, why: `Under a per-pixel
                 cap the magnitude of the gradient is irrelevant &mdash; only its sign and the cap $\\epsilon$
                 matter.` }
        ],
        answer: `<p>Because the budget is the <b>max-norm</b> $\\lVert\\eta\\rVert_\\infty \\le \\epsilon$: every
                 pixel may move at most $\\epsilon$. To make the loss climb as much as possible under that
                 per-pixel cap, push each pixel the full $\\epsilon$ in the direction its gradient points
                 &mdash; that is exactly $\\epsilon\\,\\text{sign}(\\nabla_x J)$. The gradient's <i>magnitude</i>
                 does not matter, so the raw or $L_2$-normalized gradient would be the wrong shape for this
                 budget (those maximize the loss under an $L_2$ budget instead). The sign is the closed-form
                 max-norm maximizer.</p>`
      },
      {
        q: `In the worked example you had $w=[2,-3,0.5]$, $b=1$, $x=[1,1,1]$, $\\epsilon=0.1$, giving score
            $s=0.5$ and adversarial score $s_{\\text{adv}}=-0.05$. Suppose instead the input had $n=12$ pixels,
            each weight $\\pm$ a similar magnitude with $\\sum_j|w_j| = 22$. With the same $\\epsilon=0.1$, how
            much does the worst-case perturbation move the score, and what does this say about dimension?`,
        steps: [
          { do: `Recall the worst-case score shift: $w^\\top\\eta$ with $\\eta=\\epsilon\\,\\text{sign}(w)$
                 pointed to <i>decrease</i> the positive-class score gives $-\\epsilon\\sum_j|w_j|$.`, why: `Each
                 pixel contributes $\\epsilon|w_j|$ to the shift; summing gives $\\epsilon\\sum|w_j|$.` },
          { do: `Plug in: $-0.1 \\times 22 = -2.2$.`, why: `The score can be driven from its starting value down
                 by $2.2$ &mdash; far past any reasonable decision boundary.` },
          { do: `Compare to the 3-pixel case ($\\sum|w_j|=5.5$, shift $-0.55$). Same per-pixel budget
                 $\\epsilon=0.1$, but the shift grew with $\\sum|w_j|=mn$.`, why: `This is the &sect;3 argument:
                 output change $\\epsilon m n$ scales with dimension $n$, the perturbation size $\\epsilon$ does
                 not.` }
        ],
        answer: `<p>The worst-case shift is $-\\epsilon\\sum_j|w_j| = -0.1\\times 22 = -2.2$ &mdash; four times the
                 $-0.55$ shift in the 3-pixel case, from the <i>same</i> per-pixel budget $\\epsilon=0.1$. This
                 is exactly the dimensionality argument of &sect;3: $w^\\top\\eta = \\epsilon m n$ grows with the
                 input dimension $n$ (via $\\sum|w_j| = mn$), while the perturbation's max-norm stays fixed at
                 $\\epsilon$. High-dimensional inputs are easier to attack with imperceptible perturbations
                 precisely because the tiny per-pixel nudges accumulate.</p>`
      }
    ]
  });

  window.CODE["paper-fgsm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny digit classifier with <code>nn.Linear</code> / <code>nn.ReLU</code>,
       then build the <b>novel</b> parts by hand. <b>FGSM</b> (&sect;4): mark the input with
       <code>requires_grad_(True)</code>, take <code>torch.autograd.grad(loss, x)</code> &mdash; the gradient
       w.r.t. the <i>input</i> &mdash; and form $x_{\\text{adv}} = \\text{clamp}(x +
       \\epsilon\\,\\text{sign}(g),0,1)$. <b>Adversarial training</b> (&sect;6): the mixed loss
       $\\tilde J = 0.5\\,J_{\\text{clean}} + 0.5\\,J_{\\text{adv}}$ with the FGSM example regenerated every step.
       We use the 8&times;8 <code>sklearn</code> digits dataset (no download), scale pixels to $[0,1]$, train a
       clean model and an adversarially-trained model, then sweep $\\epsilon$ and print accuracy for both. The
       first cell recomputes the worked example: score $0.5\\to$ gradient sign $[-1,+1,-1]\\to$ adversarial score
       $-0.05$. CPU, a few seconds. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the worked example: FGSM on a 3-pixel linear classifier. ---
# Score s = w.x + b for the positive class; loss J = softplus(-s) (label y=1).
# grad_x J = -sigmoid(-s)*w  ->  eta = eps*sign(grad_x J).
w = torch.tensor([2.0, -3.0, 0.5]); b = torch.tensor(1.0)
x = torch.tensor([1.0, 1.0, 1.0], requires_grad=True)
s = (w*x).sum() + b
J = F.softplus(-s)                                   # -log sigmoid(s), target class 1
g, = torch.autograd.grad(J, x)
eta = 0.1 * torch.sign(g)
print("worked example: s=%.3f  grad_x J=%s" % (s.item(), [round(v,4) for v in g.tolist()]))
print("  sign=%s  eta(eps=0.1)=%s" % ([int(v) for v in torch.sign(g).tolist()],
                                      [round(v,2) for v in eta.tolist()]))
s_adv = (w*(x.detach()+eta)).sum() + b
print("  score before=%.3f  after FGSM=%.3f  (w.eta = -eps*sum|w| = %.2f)" % (
      s.item(), s_adv.item(), -0.1*w.abs().sum().item()))
# worked example: s=0.500  grad_x J=[-0.755, 1.1326, -0.1888]
#   sign=[-1, 1, -1]  eta(eps=0.1)=[-0.1, 0.1, -0.1]
#   score before=0.500  after FGSM=-0.050  (w.eta = -eps*sum|w| = -0.55)


# --- 1. Data: 8x8 sklearn digits (no download), pixels scaled to [0,1]. ---
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
X, y = load_digits(return_X_y=True); X = X.astype(np.float32)/16.0
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
Xtr, ytr = torch.tensor(Xtr), torch.tensor(ytr)
Xte, yte = torch.tensor(Xte), torch.tensor(yte)

# --- 2. The model: a tiny multi-layer perceptron, composed with torch.nn. ---
def make_net():
    torch.manual_seed(1)
    return nn.Sequential(nn.Linear(64,128), nn.ReLU(), nn.Linear(128,10))

# --- 3. FGSM, built by hand: gradient w.r.t. the INPUT, then eps*sign (Sec 4). ---
def fgsm(net, x, y, eps):
    x = x.clone().detach().requires_grad_(True)
    loss = F.cross_entropy(net(x), y)
    g, = torch.autograd.grad(loss, x)                # grad of loss w.r.t. INPUT x
    return (x + eps*g.sign()).clamp(0, 1).detach()   # eps*sign, clamp to valid range

def acc(net, x, y):
    with torch.no_grad():
        return (net(x).argmax(1) == y).float().mean().item()

# --- 4. Train: clean, and adversarially with mixed loss (Sec 6, alpha=0.5). ---
def train(adversarial, eps=0.25, epochs=120):
    net = make_net(); opt = torch.optim.Adam(net.parameters(), lr=1e-3)
    for _ in range(epochs):
        opt.zero_grad()
        loss = F.cross_entropy(net(Xtr), ytr)        # J_clean
        if adversarial:                              # J~ = 0.5*J_clean + 0.5*J_adv
            Xadv = fgsm(net, Xtr, ytr, eps)          # regenerated every step
            loss = 0.5*loss + 0.5*F.cross_entropy(net(Xadv), ytr)
        loss.backward(); opt.step()
    return net

clean = train(adversarial=False)
advt  = train(adversarial=True, eps=0.25)

# --- 5. Sweep epsilon: FGSM accuracy for clean vs adversarially-trained models. ---
print("\\neps    clean-trained acc   adv-trained acc")
for e in [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3]:
    if e == 0.0:
        ca, aa = acc(clean, Xte, yte), acc(advt, Xte, yte)
    else:
        ca = acc(clean, fgsm(clean, Xte, yte, e), yte)
        aa = acc(advt,  fgsm(advt,  Xte, yte, e), yte)
    print("%.2f       %.4f            %.4f" % (e, ca, aa))
# eps    clean-trained acc   adv-trained acc
# 0.00       0.9407            0.9407      <- identical clean accuracy
# 0.10       0.5815            0.7352
# 0.25       0.0000            0.1870      <- attack wrecks clean model; defense holds some
# 0.30       0.0000            0.0463
# (Our small run on 8x8 digits, NOT the paper's MNIST numbers.)`
  };

  window.CODEVIZ["paper-fgsm"] = {
    question: "As we raise the FGSM perturbation budget epsilon, how fast does test accuracy fall for a normally-trained model versus one hardened with adversarial training?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs FGSM epsilon — clean-trained vs adversarially-trained",
        xlabel: "FGSM perturbation budget ε (max per-pixel change, pixels in [0,1])",
        ylabel: "test accuracy on FGSM examples",
        series: [
          {
            name: "Clean-trained",
            color: "#ff7b72",
            points: [[0.0,0.9407],[0.05,0.8278],[0.1,0.5815],[0.15,0.2667],[0.2,0.0556],[0.25,0.0],[0.3,0.0]]
          },
          {
            name: "Adversarially-trained (FGSM, α=0.5)",
            color: "#7ee787",
            points: [[0.0,0.9407],[0.05,0.8537],[0.1,0.7352],[0.15,0.5611],[0.2,0.3722],[0.25,0.187],[0.3,0.0463]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny multi-layer perceptron (64→128→10, ReLU) on the 8×8 sklearn digits dataset (pixels in [0,1]). Both models reach the SAME clean accuracy (94.07% at ε=0). As the FGSM budget ε rises, the clean-trained model collapses — from 94% to ~58% at ε=0.10 and to 0% by ε=0.25 — a tiny per-pixel nudge in the gradient-sign direction. The adversarially-trained model (mixed loss, α=0.5, FGSM examples regenerated each step) degrades far more slowly: 73.5% at ε=0.10 and 18.7% still correct at ε=0.25, where the clean model is at zero. This reproduces the paper's qualitative effect (§4 attack, §6 defense): the sign-gradient perturbation sharply drops accuracy, and adversarial training recovers robustness.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

X, y = load_digits(return_X_y=True); X = X.astype(np.float32)/16.0   # 8x8, pixels in [0,1]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
Xtr, ytr = torch.tensor(Xtr), torch.tensor(ytr)
Xte, yte = torch.tensor(Xte), torch.tensor(yte)

def make_net():
    torch.manual_seed(1)
    return nn.Sequential(nn.Linear(64,128), nn.ReLU(), nn.Linear(128,10))

def fgsm(net, x, y, eps):                              # FGSM, Sec 4
    x = x.clone().detach().requires_grad_(True)
    g, = torch.autograd.grad(F.cross_entropy(net(x), y), x)   # grad w.r.t. INPUT
    return (x + eps*g.sign()).clamp(0,1).detach()

def acc(net, x, y):
    with torch.no_grad(): return (net(x).argmax(1)==y).float().mean().item()

def train(adversarial, eps=0.25, epochs=120):         # Sec 6 mixed loss, alpha=0.5
    net = make_net(); opt = torch.optim.Adam(net.parameters(), lr=1e-3)
    for _ in range(epochs):
        opt.zero_grad(); loss = F.cross_entropy(net(Xtr), ytr)
        if adversarial:
            Xadv = fgsm(net, Xtr, ytr, eps)
            loss = 0.5*loss + 0.5*F.cross_entropy(net(Xadv), ytr)
        loss.backward(); opt.step()
    return net

clean = train(adversarial=False); advt = train(adversarial=True, eps=0.25)
eps_grid = [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3]
clean_c = [acc(clean, Xte, yte) if e==0 else acc(clean, fgsm(clean,Xte,yte,e), yte) for e in eps_grid]
adv_c   = [acc(advt,  Xte, yte) if e==0 else acc(advt,  fgsm(advt, Xte,yte,e), yte) for e in eps_grid]
print("eps   :", eps_grid)
print("clean :", [round(v,4) for v in clean_c])
print("adv   :", [round(v,4) for v in adv_c])
# eps   : [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3]
# clean : [0.9407, 0.8278, 0.5815, 0.2667, 0.0556, 0.0, 0.0]
# adv   : [0.9407, 0.8537, 0.7352, 0.5611, 0.3722, 0.187, 0.0463]
# At eps=0.25 the clean model is at 0% while the adv-trained model holds 18.7%.
# Our small run, not the paper's number.`
  };
})();
