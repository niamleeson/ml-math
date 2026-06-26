/* Paper lesson — "Towards Deep Learning Models Resistant to Adversarial Attacks"
   (PGD / robust optimization), Madry, Makelov, Schmidt, Tsipras, Vladu, ICLR 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-pgd".
   GROUNDED from arXiv:1706.06083 (abstract page) and the ar5iv HTML mirror
   (Section 2 saddle-point objective Eqn. 2.1; Section 2.1 the PGD iterate; the
   l-infinity perturbation set S; Section 3.2 "robustness against the PGD adversary
   yields robustness against all first-order adversaries"; Section 5 MNIST/CIFAR-10
   experimental settings).
   Track B (architecture): compose a tiny classifier with torch.nn, then implement the
   NOVEL part by hand — the Projected Gradient Descent attack (iterated FGSM with a
   projection back into the epsilon-ball) and the min-max adversarial-training loop. */
(function () {
  window.LESSONS.push({
    id: "paper-pgd",
    title: "PGD — Towards Deep Learning Models Resistant to Adversarial Attacks (2018)",
    tagline: "Frame robustness as a min-max game; attack with multi-step Projected Gradient Descent and train on those examples.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Aleksander Madry, Aleksandar Makelov, Ludwig Schmidt, Dimitris Tsipras, Adrian Vladu",
      org: "Massachusetts Institute of Technology (MIT)",
      year: 2018,
      venue: "arXiv:1706.06083 (Jun 2017); ICLR 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1706.06083",
      code: "https://github.com/MadryLab/mnist_challenge"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-gradient-descent", "dl-backprop", "dl-cross-entropy", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A trained image classifier can be near-perfect on clean data yet collapse under a tiny, crafted nudge.
       Add a perturbation so small a human cannot see it, and the network confidently outputs the wrong label.
       These are <b>adversarial examples</b> &mdash; inputs that look identical to real data but are misclassified.</p>
       <p>Before this paper, defenses were a patchwork. People found one attack, added a fix, then a stronger
       attack broke it. There was no clear way to say "this model is robust" or even to define what robust means.
       The field needed a single, principled frame. From the abstract:</p>
       <blockquote>"To address this problem, we study the adversarial robustness of neural networks through the lens
       of robust optimization. This approach provides us with a broad and unifying view on much of the prior work
       on this topic." (Abstract)</blockquote>
       <p>The open question: can we write robustness as <i>one</i> well-posed optimization problem &mdash; and then
       both attack and defend by solving it?</p>`,
    contribution:
      `<ul>
        <li><b>Robustness as a min-max (saddle-point) problem.</b> The defender minimizes a loss; an adversary,
        nested inside, first maximizes that loss over a small allowed perturbation. One equation captures both the
        attack and the defense (their Eqn. 2.1, &sect;2).</li>
        <li><b>Projected Gradient Descent (PGD) as a strong attack.</b> PGD = Projected Gradient Descent. It runs
        the single-step attack many times, re-projecting back into the allowed region after each step. The paper
        calls it "a multi-step variant, which is essentially projected gradient descent" (&sect;2.1) and a strong,
        near-universal first-order adversary.</li>
        <li><b>Adversarial training on PGD examples.</b> Solve the inner maximization with PGD, then minimize the
        loss on those worst-case inputs. This trains networks with "significantly improved resistance to a wide
        range of adversarial attacks" (Abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>This paper set the standard playbook for adversarial robustness. The min-max formulation gave the field a
       shared definition of the problem, and "robustness against the PGD adversary" became the default benchmark
       for whether a defense is real. The authors released public MNIST and CIFAR-10 challenge models that many
       proposed defenses were later tested (and broken) against. PGD adversarial training remains one of the few
       defenses that has held up, and the min-max lens still frames almost all follow-up work on certified and
       empirical robustness.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (An Optimization View on Adversarial Robustness)</b> &mdash; the saddle-point objective,
        their <b>Equation 2.1</b>. This is the one equation you transcribe; it contains both the attack (inner
        max) and the defense (outer min).</li>
        <li><b>&sect;2.1 (A Unified View ...)</b> &mdash; where the single-step attack and the multi-step
        <b>PGD</b> iterate are written down. This is the algorithm you implement.</li>
        <li><b>&sect;3.2</b> &mdash; the claim that PGD is a strong, near-universal first-order adversary:
        "robustness against the PGD adversary yields robustness against all first-order adversaries."</li>
        <li><b>&sect;5 (Experiments)</b> &mdash; the MNIST and CIFAR-10 setups (network, perturbation budget
        $\\epsilon$) and the reported robust-accuracy numbers.</li>
       </ul>
       <p><b>Skim:</b> the loss-landscape and capacity discussion (&sect;4 region) on a first pass &mdash; useful
       intuition for <i>why</i> larger models are easier to make robust, but not needed to implement the method.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two classifiers on a hard two-class toy dataset. One is trained normally. The other is
       trained adversarially &mdash; on PGD-perturbed inputs (the min-max loop). Then you attack <i>both</i> with
       PGD inside the same small perturbation budget $\\epsilon$.</p>
       <p>Two guesses, with one sentence of reasoning each:</p>
       <ul>
        <li>On the <b>normally-trained</b> model, which attack drops accuracy more &mdash; single-step
        <b>FGSM</b> (Fast Gradient Sign Method) or multi-step <b>PGD</b>? Or do they tie?</li>
        <li>Under PGD attack, will the <b>adversarially-trained</b> model keep higher accuracy than the
        normally-trained one? And do you expect its <i>clean</i> accuracy to go up, down, or stay the same?</li>
       </ul>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>One FGSM step</b> (the building block): forward the input, compute the loss against the true
        label, get $\\nabla_x L$ (gradient with respect to the <i>input</i>, not the weights), and step
        $x + \\epsilon\\,\\text{sign}(\\nabla_x L)$ to <i>raise</i> the loss.</li>
        <li><b>PGD</b>: TODO &mdash; start at a random point inside the $\\epsilon$-ball, then repeat: take an
        FGSM-sized step of size $\\alpha$, and <b>project</b> back into the ball (clip each coordinate to
        $[x-\\epsilon,\\, x+\\epsilon]$). Why project after <i>every</i> step, not just at the end?</li>
        <li><b>Adversarial training</b>: TODO &mdash; in each training iteration, first run PGD on the batch to
        get worst-case inputs, then take the normal gradient-descent step on the loss <i>at those inputs</i>.
        Which part of Eqn. 2.1 is the PGD call, and which part is the optimizer step?</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The whole paper is one nested optimization. Read it inside-out.</p>
       <p><b>The inner problem (the adversary).</b> Fix the network weights $\\theta$ and a labeled point
       $(x, y)$. The adversary may add any perturbation $\\delta$ from a small allowed set $S$ &mdash; here the
       <b>$\\ell_\\infty$-ball</b>, meaning every pixel may move by at most $\\epsilon$. The adversary picks the
       $\\delta$ that makes the loss as <i>large</i> as possible:</p>
       <p>$$ \\max_{\\delta \\in S} \\; L(\\theta,\\, x+\\delta,\\, y). $$</p>
       <p>This is the attack. We cannot solve it exactly for a neural network, so we <b>approximate</b> it by
       gradient ascent on the input.</p>
       <p><b>How the adversary climbs: FGSM, then PGD.</b> The single-step attack, the Fast Gradient Sign Method
       (FGSM), takes one big step in the direction that raises the loss, using only the <i>sign</i> of the input
       gradient (so every coordinate moves by exactly $\\epsilon$):</p>
       <p>$$ x_{\\text{adv}} = x + \\epsilon \\, \\text{sign}\\big(\\nabla_x L(\\theta, x, y)\\big). $$</p>
       <p>PGD does better by taking <i>many</i> smaller steps of size $\\alpha$, and after each step
       <b>projecting</b> the result back into the $\\epsilon$-ball so it never wanders outside the allowed set.
       This is the paper's multi-step iterate (&sect;2.1).</p>
       <p><b>The outer problem (the defender).</b> Now the defender chooses $\\theta$ to minimize the
       <i>worst-case</i> loss &mdash; the loss after the adversary has done its worst &mdash; averaged over the
       data. Stacking the two gives the <b>saddle-point</b> objective (their Eqn. 2.1, &sect;2).</p>
       <p><b>Adversarial training</b> is just gradient descent on this min-max objective: for each batch, run PGD
       to approximate the inner max, then take one optimizer step on the loss measured at those PGD inputs. The
       network learns to be flat in a small ball around every training point.</p>`,
    architecture:
      `<p>This is an algorithm paper, so the "architecture" is the <b>adversarial-training loop</b> wrapped around
       a standard classifier. Two nested procedures.</p>
       <p><b>Inner loop &mdash; the PGD attack</b> (approximates $\\max_{\\delta\\in S}$, &sect;2.1). Given fixed
       weights $\\theta$ and a batch $(x, y)$:</p>
       <ol>
        <li><b>Random start:</b> $x^0 = x + \\delta_0$, with $\\delta_0$ drawn uniformly from
        $[-\\epsilon, \\epsilon]$ per coordinate (a point inside the $\\ell_\\infty$-ball).</li>
        <li><b>Repeat for $t = 0 \\dots T-1$:</b>
          <ul>
            <li>Compute the <i>input</i> gradient $\\nabla_x L(\\theta, x^t, y)$ (backprop to $x$, not $\\theta$).</li>
            <li>Ascend: $x^{t+1}_{\\text{raw}} = x^t + \\alpha\\,\\text{sign}(\\nabla_x L)$.</li>
            <li>Project: $x^{t+1} = \\Pi_{x+S}(x^{t+1}_{\\text{raw}})$ = clip each coordinate to $[x-\\epsilon, x+\\epsilon]$.</li>
          </ul>
        </li>
        <li><b>Return</b> $x^T$ &mdash; the adversarial example $x+\\delta^\\star$.</li>
       </ol>
       <p><b>Outer loop &mdash; the defender</b> (the $\\min_\\theta$, Eqn. 2.1). For each minibatch:</p>
       <ol>
        <li>Run the inner PGD loop to get worst-case inputs $x+\\delta^\\star$.</li>
        <li>Compute the loss $L(\\theta, x+\\delta^\\star, y)$ at those inputs.</li>
        <li>Backprop to the <i>weights</i> and take one optimizer step (SGD/Adam). By <b>Danskin's theorem</b>
        (Appendix A) the gradient at $\\delta^\\star$ is a valid descent direction, so this single backward pass is
        a legitimate step on the saddle-point objective.</li>
       </ol>
       <p><b>The classifier itself</b> is an ordinary network &mdash; no special layers. In the paper's experiments
       (&sect;5): for <b>MNIST</b>, two convolutional layers (32 and 64 filters, each with $2\\times 2$ max-pooling)
       then a 1024-unit fully connected layer; for <b>CIFAR-10</b>, a wide residual network (5 residual units,
       $(16, 160, 320, 640)$ filters). The robustness comes entirely from <i>what it is trained on</i> (PGD
       examples), not from the architecture.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>clean input</b> (e.g. an image, as a vector of pixel values)." },
      { sym: "$y$", desc: "the <b>true label</b> for $x$." },
      { sym: "$\\theta$", desc: "the network's <b>weights</b> &mdash; what the defender (outer loop) trains." },
      { sym: "$\\delta$", desc: "the <b>perturbation</b>: the small nudge the adversary adds to the input. The perturbed input is $x+\\delta$." },
      { sym: "$S$", desc: "the <b>allowed perturbation set</b>: which $\\delta$ are permitted. Here it is the $\\ell_\\infty$-ball &mdash; every coordinate of $\\delta$ has absolute value at most $\\epsilon$." },
      { sym: "$\\epsilon$", desc: "the <b>perturbation budget</b> (the radius): the most any single coordinate may move. Small $\\epsilon$ means the change is imperceptible." },
      { sym: "$L(\\theta, x, y)$", desc: "the <b>loss</b> (here cross-entropy / binary cross-entropy): how wrong the network's prediction is. The adversary wants it large; the defender wants it small." },
      { sym: "$\\nabla_x L$", desc: "the <b>gradient of the loss with respect to the input $x$</b> (not the weights). It points in the input direction that <i>raises</i> the loss fastest." },
      { sym: "$\\text{sign}(\\cdot)$", desc: "the <b>sign function</b>: returns $+1$, $-1$, or $0$ per coordinate. Using only the sign makes every coordinate take a step of the same size." },
      { sym: "$\\alpha$", desc: "the <b>PGD step size</b>: how far each inner attack step moves (typically $\\alpha \\lt \\epsilon$ so many steps fit inside the ball)." },
      { sym: "$\\Pi_{x+S}$ (“Proj”)", desc: "the <b>projection</b> onto the set $x+S$ &mdash; the $\\epsilon$-ball around $x$. It snaps any point back to the nearest allowed point; for the $\\ell_\\infty$-ball this is just clipping each coordinate to $[x-\\epsilon,\\, x+\\epsilon]$." },
      { sym: "$\\rho(\\theta)$", desc: "the <b>robust risk</b>: the expected worst-case loss, i.e. the average over data of the inner maximum. The outer loop minimizes this." },
      { sym: "$\\phi(\\theta)$", desc: "the <b>inner-max value</b> for a single point: $\\phi(\\theta) = \\max_{\\delta\\in S} L(\\theta, x+\\delta, y)$. The robust risk $\\rho$ is the expectation of $\\phi$ over the data." },
      { sym: "$\\delta^\\star$", desc: "the <b>inner maximizer</b>: the worst-case perturbation, $\\delta^\\star \\in \\arg\\max_{\\delta\\in S} L$. PGD's output $x^T$ approximates $x+\\delta^\\star$." },
      { sym: "$\\nabla_\\theta L$", desc: "the <b>gradient of the loss with respect to the weights</b> &mdash; what the outer optimizer descends. Danskin's theorem says evaluating it at $\\delta^\\star$ gives a valid descent direction for $\\phi$." },
      { sym: "“FGSM”", desc: "a plain term: the <b>Fast Gradient Sign Method</b>, the single-step attack $x + \\epsilon\\,\\text{sign}(\\nabla_x L)$. PGD is FGSM iterated with projection." }
    ],
    formula:
      `<p><b>1. The saddle-point (min-max) robust-optimization objective &mdash; Equation 2.1 (&sect;2).</b></p>
       $$ \\min_\\theta \\; \\rho(\\theta), \\qquad \\rho(\\theta) = \\mathbb{E}_{(x,y)\\sim \\mathcal{D}}\\Big[ \\max_{\\delta \\in S} \\, L(\\theta,\\, x+\\delta,\\, y) \\Big]. $$
       <p>Outer $\\min_\\theta$ = the defender training weights; inner $\\max_{\\delta\\in S}$ = the adversary picking the worst perturbation. One equation holds both roles.</p>
       <p><b>2. The allowed perturbation set $S$ &mdash; the $\\ell_\\infty$-ball (&sect;2).</b></p>
       $$ S = \\{\\, \\delta : \\|\\delta\\|_\\infty \\le \\epsilon \\,\\} = \\{\\, \\delta : |\\delta_j| \\le \\epsilon \\ \\text{for every coordinate } j \\,\\}. $$
       <p>Every pixel may move by at most $\\epsilon$; the perturbation is invisible to a human.</p>
       <p><b>3. The PGD attack iterate &mdash; projected gradient ascent on the input (&sect;2.1).</b></p>
       $$ x^{t+1} = \\Pi_{x+S}\\big(x^t + \\alpha\\, \\text{sign}(\\nabla_x L(\\theta, x^t, y))\\big). $$
       <p>Take a sign-gradient step of size $\\alpha$ to raise the loss, then project $\\Pi_{x+S}$ back into the $\\ell_\\infty$-ball. Repeat. This approximately solves the inner max.</p>
       <p><b>4. FGSM &mdash; the single-step special case (&sect;2.1).</b></p>
       $$ x_{\\text{adv}} = x + \\epsilon\\, \\text{sign}(\\nabla_x L(\\theta, x, y)). $$
       <p>One step of size $\\epsilon$. PGD is FGSM iterated with re-projection.</p>
       <p><b>5. The $\\ell_\\infty$ projection is per-coordinate clipping (&sect;2.1).</b></p>
       $$ \\big(\\Pi_{x+S}(z)\\big)_j = \\text{clip}\\big(z_j,\\; x_j-\\epsilon,\\; x_j+\\epsilon\\big) = \\min\\!\\big(\\max(z_j,\\; x_j-\\epsilon),\\; x_j+\\epsilon\\big). $$
       <p>No matrix, no solve &mdash; just clamp each coordinate; this is why each PGD step is cheap.</p>
       <p><b>6. Danskin's theorem &mdash; why training on the inner maximizer is valid (Appendix A).</b></p>
       $$ \\nabla_\\theta \\, \\phi(\\theta) = \\nabla_\\theta \\, L(\\theta,\\, x+\\delta^\\star,\\, y), \\qquad \\phi(\\theta) = \\max_{\\delta \\in S} L(\\theta,\\, x+\\delta,\\, y), \\quad \\delta^\\star \\in \\arg\\max_{\\delta\\in S} L. $$
       <p>The gradient of the inner-max value equals the loss gradient evaluated <i>at</i> the maximizer $\\delta^\\star$. So $-\\nabla_\\theta L(\\theta, x+\\delta^\\star, y)$ is a valid descent direction for the outer min &mdash; we may legitimately backprop through the PGD-found adversarial example and ignore how $\\delta^\\star$ depends on $\\theta$.</p>`,
    whatItDoes:
      `<p><b>The saddle-point objective</b> (left, their <b>Equation 2.1</b>, &sect;2) reads inside-out. The inner
       $\\max_{\\delta \\in S}$ is the <b>attack</b>: among all allowed perturbations, find the one that hurts most.
       The outer $\\min_\\theta$ is the <b>defense</b>: choose weights that keep that worst case small, on average
       over the data. One equation, both roles.</p>
       <p><b>The PGD iterate</b> (right, &sect;2.1) is how we approximate that inner max. Starting from $x^t$, take
       a sign-gradient step of size $\\alpha$ to raise the loss, then apply $\\Pi_{x+S}$ &mdash; the
       <b>projection</b> ("Proj") that clips the result back inside the $\\epsilon$-ball. Repeat. Because the
       projection runs after <i>every</i> step, the iterate explores the ball thoroughly instead of shooting past
       its edge. Single-step FGSM is the special case of <i>one</i> step with $\\alpha=\\epsilon$; PGD's many
       smaller, re-projected steps make it a much stronger attack.</p>`,
    derivation:
      `<p><b>Why projection is needed.</b> The inner problem is a <i>constrained</i> maximization:
       $\\max_{\\delta \\in S} L(\\theta, x+\\delta, y)$. Plain gradient ascent would happily walk $\\delta$
       outside $S$, which is not allowed &mdash; the perturbation must stay imperceptible. <b>Projected</b>
       gradient ascent fixes this: take an unconstrained ascent step, then map the result back to the nearest
       point in the feasible set. That map is the projection $\\Pi_{x+S}$.</p>
       <p>For the $\\ell_\\infty$-ball, "nearest allowed point" decouples coordinate by coordinate. Each
       coordinate's constraint is $|\\delta_j| \\le \\epsilon$, i.e. $x_j - \\epsilon \\le (x+\\delta)_j \\le x_j +
       \\epsilon$. The closest in-bounds value to any number is just that number <b>clipped</b> to the interval:</p>
       <p>$$ \\Pi_{x+S}(z)_j = \\text{clip}\\big(z_j,\\; x_j-\\epsilon,\\; x_j+\\epsilon\\big) =
       \\min\\!\\big(\\max(z_j,\\; x_j-\\epsilon),\\; x_j+\\epsilon\\big). $$</p>
       <p>So "Proj onto the $\\ell_\\infty$-ball" is literally per-coordinate clamping &mdash; no matrix, no solve.
       That is why PGD is cheap: each step is one input-gradient plus a clip. <b>FGSM is one PGD step</b> with
       $\\alpha=\\epsilon$ and no random start; iterating with smaller $\\alpha$ and re-projecting is what makes
       PGD stronger. (This is the cross-link to the FGSM lesson: PGD = multi-step FGSM.)</p>
       <p><b>Why training on the PGD example is legitimate (Danskin's theorem, Appendix A).</b> The outer objective
       minimizes $\\phi(\\theta) = \\max_{\\delta\\in S} L(\\theta, x+\\delta, y)$, a maximum over $\\delta$. To run
       gradient descent on $\\theta$ we need $\\nabla_\\theta \\phi$ &mdash; but $\\phi$ involves a max, and the
       maximizer $\\delta^\\star$ itself shifts as $\\theta$ changes. Danskin's theorem says we can ignore that
       coupling: for a function that is a max over a compact set, the gradient of the max equals the gradient of
       the inner function evaluated <i>at the maximizer</i>,</p>
       <p>$$ \\nabla_\\theta \\phi(\\theta) = \\nabla_\\theta L(\\theta,\\, x+\\delta^\\star,\\, y), \\qquad
       \\delta^\\star \\in \\arg\\max_{\\delta\\in S} L. $$</p>
       <p>So once PGD has found (approximately) the worst-case $\\delta^\\star$, we simply backprop the loss at
       $x+\\delta^\\star$ to the weights as if $\\delta^\\star$ were a fixed constant &mdash; no second-order terms,
       no differentiating through the attack. That is the theoretical license for the whole training loop: a single
       ordinary backward pass on the adversarial example is a valid descent step on the saddle-point objective.
       (The theorem needs the true maximizer; PGD only approximates it, but the paper's experiments show the
       approximation is good enough that this descent direction works in practice.)</p>`,
    example:
      `<p>Work <b>one PGD step plus the projection clip</b> by hand so the iterate is concrete. Use a one-feature
       model with logit $= w\\,x$, weight $w=2.0$, true label $y=1$, and binary-cross-entropy loss. Start at
       $x^0 = 0.50$, step size $\\alpha = 0.20$, budget $\\epsilon = 0.15$, so the allowed $\\ell_\\infty$-ball is
       $[0.50-0.15,\\; 0.50+0.15] = [0.35,\\; 0.65]$.</p>
       <ul class="steps">
        <li><b>Loss + input gradient.</b> The logit is $2.0 \\cdot 0.5 = 1.0$. For binary cross-entropy with
        target $y=1$, the loss <i>decreases</i> as the logit grows, so raising the loss means <i>lowering</i> $x$.
        Concretely $\\partial L/\\partial(\\text{logit}) = \\sigma(\\text{logit}) - y = \\sigma(1.0) - 1 \\approx
        0.731 - 1 = -0.269$, and $\\partial L/\\partial x = (-0.269)\\cdot w = -0.538$. So
        $\\nabla_x L \\lt 0$ and $\\text{sign}(\\nabla_x L) = -1$.</li>
        <li><b>Ascent step</b> ($x + \\alpha\\,\\text{sign}(\\nabla_x L)$):
        $0.50 + 0.20\\cdot(-1) = 0.30$. The step moved <i>down</i> to raise the loss, as expected.</li>
        <li><b>Project back into the ball</b> ("Proj" = clip to $[0.35, 0.65]$): $0.30 \\lt 0.35$, so the step
        landed <i>outside</i> the budget. Clip up to the lower edge: $x^1 = 0.35$.</li>
        <li><b>Read the result.</b> After one PGD step, $x^1 = 0.35$ &mdash; the most the adversary may push the
        input within budget, in the loss-raising direction. A second step would try to leave the ball again and be
        clipped right back to $0.35$.</li>
       </ul>
       <p>The projection genuinely fired here: the raw ascent ($0.30$) was outside $[0.35, 0.65]$, so the clip
       pulled it to the edge. The notebook's first cell recomputes exactly this: sign $=-1$, ascend $=0.30$,
       project $=0.35$.</p>`,
    recipe:
      `<ol>
        <li><b>Build the classifier</b> with <code>torch.nn</code>: a small multi-layer perceptron (2 inputs
        &rarr; 64 &rarr; 64 &rarr; 1, ReLU) on a hard two-class toy dataset (interleaving "moons").</li>
        <li><b>Implement FGSM</b> (the building block): one input-gradient step,
        $x + \\epsilon\\,\\text{sign}(\\nabla_x L)$.</li>
        <li><b>Implement PGD</b> (the novel inner max): random start in the $\\epsilon$-ball, then repeat for
        $T$ steps &mdash; sign-gradient step of size $\\alpha$, then <b>project</b> by clipping each coordinate to
        $[x-\\epsilon,\\, x+\\epsilon]$.</li>
        <li><b>Train normally</b>: plain gradient descent on clean inputs (the baseline).</li>
        <li><b>Train adversarially</b> (the min-max loop): each step, run PGD on the batch, then optimizer-step on
        the loss at those PGD inputs &mdash; this is Eqn. 2.1.</li>
        <li><b>Evaluate</b> both models on clean inputs, under FGSM, and under PGD. Show PGD is the stronger attack
        and that adversarial training raises robust accuracy.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): these methods "let us train networks with significantly improved resistance
       to a wide range of adversarial attacks" and "suggest the notion of security against a first-order adversary
       as a natural and broad security guarantee."</p>
       <p>On PGD being the attack to beat (&sect;3.2, quoted): "robustness against the PGD adversary yields
       robustness against all first-order adversaries." On the benchmarks (&sect;5): for <b>MNIST</b> with
       $\\epsilon = 0.3$ ($\\ell_\\infty$), the adversarially-trained network reaches about <b>89%</b> accuracy
       against a strong PGD attack (the paper reports figures around the high-80s% under PGD with many steps and
       restarts); for <b>CIFAR-10</b> with $\\epsilon = 8/255$ and a wide residual network, robust accuracy under
       a 20-step PGD attack is in the <b>mid-40s%</b>. (Settings and figures from &sect;5; exact numbers are best
       read off the paper's tables.)</p>
       <p><i>These are the paper's own statements and settings, quoted/paraphrased from the abstract, &sect;3.2,
       and &sect;5. The numbers in the CODEVIZ panel below are from our own tiny run on a toy dataset &mdash; not
       the paper's reported results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> The headline number is <b>robust accuracy</b>: classification accuracy
       on test inputs that have first been attacked by a strong multi-step PGD adversary inside the
       $\\ell_\\infty$-ball of radius $\\epsilon$. Always report it next to <b>clean accuracy</b> (no attack) and
       <b>FGSM accuracy</b> (single-step). The trivial floors: a random two-class guesser sits at <b>50%</b>; a
       model that is robust in name only collapses toward <b>0%</b> under PGD. The paper's own targets to beat:
       MNIST $\\approx$ <b>89%</b> robust at $\\epsilon=0.3$, CIFAR-10 <b>mid-40s%</b> robust at $\\epsilon=8/255$
       (&sect;5).</p>
       <p><b>2. Sanity checks BEFORE the full run.</b></p>
       <ul>
        <li><b>Replay the worked example</b> (notebook cell 0): one PGD step from $x^0=0.5$, $\\alpha=0.2$,
        $\\epsilon=0.15$ must give $\\text{sign}=-1$, ascend $=0.30$, project $=0.35$. If the projection does not
        fire here, your clip is wrong.</li>
        <li><b>Attack should never help.</b> For <i>any</i> model, $\\text{acc}(\\text{PGD}) \\le
        \\text{acc}(\\text{FGSM}) \\le \\text{acc}(\\text{clean})$ &mdash; a stronger/equal attack can only lower
        accuracy. If an attack <i>raises</i> accuracy you stepped in the wrong sign (descending the loss instead of
        ascending).</li>
        <li><b>Perturbation budget.</b> Assert $\\lVert x_{\\text{adv}}-x\\rVert_\\infty \\le \\epsilon$ (up to
        float slack) after every PGD call &mdash; a violation means a missing or end-only projection.</li>
        <li><b>Loss at init.</b> A 2-class <code>BCEWithLogitsLoss</code> at random init should start near
        $-\\ln(1/2)=\\ln 2\\approx 0.69$ (rule of thumb); a wildly different value flags a label or
        logit-shape bug before you spend time adversarially training.</li>
       </ul>
       <p><b>3. Expected range.</b> On this toy "moons" task our run (not the paper) lands the
       <b>normally-trained</b> model at clean $\\approx0.96$ but PGD $\\approx0.15$ &mdash; well below the $0.50$
       random floor, because the attack actively pushes points across the boundary &mdash; while the
       <b>PGD-adv-trained</b> model holds PGD $\\approx0.48$ at the cost of clean $\\approx0.78$. Robust accuracy
       that stays pinned at $0$ for the adversarially-trained model, or clean accuracy that does not drop at all,
       means the min-max loop is not really running. On the paper's benchmarks, anchor to MNIST $\\approx89\\%$ /
       CIFAR-10 mid-40s% (approximate, &sect;5); being tens of points under those is "probably a bug," a few
       points is "tuning" ($\\epsilon$, $\\alpha$, steps, restarts).</p>
       <p><b>4. Ablation &mdash; prove adversarial training earns its keep.</b> The central knob is the
       <b>inner PGD call in the training loop</b>. Turn it OFF (train on clean batches, everything else identical):
       robust accuracy under PGD must <b>drop sharply</b> (our run: $0.48\\to0.15$). If it barely moves, either the
       PGD call was never wired into training or the attack at eval is too weak to separate the two models. A
       second ablation: remove the <b>random start</b> in PGD &mdash; a too-easy attack will overstate robustness
       and make a weak model look defended.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Robust acc stuck at chance/zero even after adv-training</b> &rarr; the PGD inner step is missing
        from the loop, or you backprop weight-gradients (<code>loss.backward()</code>) instead of input-gradients
        (<code>torch.autograd.grad(loss, x)</code>) inside the attack.</li>
        <li><b>Attack <i>raises</i> accuracy</b> &rarr; wrong step sign; the adversary must ascend
        $+\\alpha\\,\\text{sign}(\\nabla_x L)$.</li>
        <li><b>PGD no stronger than FGSM</b> &rarr; you forgot to re-project every step, or used a single step, or
        skipped the random start, so PGD never explores the ball.</li>
        <li><b>Loss NaN</b> &rarr; $\\alpha$ or learning rate too high; the adversarial loop amplifies it.</li>
        <li><b>"Robust" model also matches clean accuracy</b> &rarr; suspicious, not a win &mdash; usually a broken
        (too-weak) attack at eval, since the paper expects a robustness/accuracy trade-off.</li>
       </ul>
       <p><i>The toy numbers are our small run; the $\\approx89\\%$ / mid-40s% targets are the paper's (&sect;5).
       The init-loss and "tens of points off = bug" thresholds are rules of thumb, not paper claims.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The model and optimizer already ship in PyTorch, so you
       <b>import</b> them and build only the novel algorithm. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code> for the classifier, <code>nn.BCEWithLogitsLoss</code>, and
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> (1) the <b>FGSM</b> and <b>PGD</b> attacks &mdash;
       input-gradients via <code>torch.autograd.grad(loss, x)</code>, the sign-step, and the per-coordinate
       <b>projection</b> (clip into the $\\epsilon$-ball); and (2) the <b>min-max training loop</b> &mdash; call
       PGD to approximate the inner maximization, then take the optimizer step on the PGD inputs. The key
       mechanical detail PyTorch will not do for you: differentiate the loss with respect to the <i>input</i>, not
       the weights, and re-project after every attack step. The math owner is this paper itself
       (<code>conceptLink: null</code>), so the derivation is given in full above; the single-step special case is
       cross-linked to the FGSM lesson (PGD = multi-step FGSM).</p>`,
    pitfalls:
      `<ul>
        <li><b>Differentiating the loss with respect to the weights instead of the input.</b> The attack needs
        $\\nabla_x L$, the gradient with respect to the <i>input</i>. <b>Fix:</b> set
        <code>x.requires_grad_(True)</code> and call <code>torch.autograd.grad(loss, x)</code> &mdash; do not use
        the weight gradients from <code>loss.backward()</code>.</li>
        <li><b>Forgetting to project after every step.</b> If you only clip at the end, the intermediate iterates
        wander outside the $\\epsilon$-ball and you are no longer solving the constrained inner max. <b>Fix:</b>
        clip each coordinate to $[x-\\epsilon,\\, x+\\epsilon]$ <i>inside</i> the loop, every step.</li>
        <li><b>Stepping in the wrong sign.</b> The adversary <i>maximizes</i> the loss, so it steps <b>up</b> the
        gradient: $+\\alpha\\,\\text{sign}(\\nabla_x L)$. Subtracting (descending) makes the input <i>easier</i> to
        classify &mdash; the opposite of an attack.</li>
        <li><b>No random start in PGD.</b> The paper starts PGD from a random point in the ball. Starting exactly
        at $x$ can get stuck and understate the attack's strength, making a weak model look robust. <b>Fix:</b>
        initialize with a uniform perturbation in $[-\\epsilon, \\epsilon]$.</li>
        <li><b>Expecting robustness for free.</b> Adversarial training usually <i>lowers</i> clean accuracy &mdash;
        the robustness/accuracy trade-off. A robust model that also matches clean accuracy on a hard task is the
        exception, not the rule; do not treat the clean-accuracy drop as a bug.</li>
      </ul>`,
    recall: [
      "Write the saddle-point objective (Eqn. 2.1) and the PGD iterate from memory.",
      "Define $S$, $\\epsilon$, and “Proj” ($\\Pi_{x+S}$). What is the projection for an $\\ell_\\infty$-ball?",
      "Why is the input gradient $\\nabla_x L$ used, not the weight gradient? Which sign does the adversary step in?",
      "In one sentence, how is PGD related to FGSM, and why is it a stronger attack?"
    ],
    practice: [
      {
        q: `<b>The projection is the whole game.</b> Take the worked example but remove the projection: start at
            $x^0=0.50$, $\\alpha=0.20$, $\\epsilon=0.15$, and run <i>three</i> ascent steps with sign $-1$ each
            time, never clipping. Where does $x$ end up, and why does that break the attack's definition?`,
        steps: [
          { do: `Step without projecting: $0.50 \\to 0.30 \\to 0.10 \\to -0.10$ (subtract $0.20$ three times).`, why: `Each step subtracts $\\alpha\\cdot 1$; with no clip nothing stops it.` },
          { do: `Compare to the ball $[0.35, 0.65]$: the final $-0.10$ is far outside the allowed budget $\\epsilon=0.15$.`, why: `The perturbation $|x - x^0| = 0.60$ is $4\\times$ the budget &mdash; no longer "imperceptible".` },
          { do: `Now add the projection back: every step clips to $[0.35, 0.65]$, so the iterate is $0.50 \\to 0.35 \\to 0.35 \\to 0.35$.`, why: `Projection caps the perturbation at $\\epsilon$; the iterate sits at the ball's edge, which is the constrained maximizer here.` }
        ],
        answer: `<p>Without projection the input runs off to $-0.10$, a perturbation of $0.60$ &mdash; four times the
                 budget $\\epsilon=0.15$. That violates the inner problem $\\max_{\\delta\\in S}L$, which only allows
                 $|\\delta|\\le\\epsilon$. With projection, every step clips back to $[0.35,0.65]$, pinning the
                 iterate at the edge $0.35$. The projection is exactly what keeps PGD solving the
                 <i>constrained</i> maximization instead of unconstrained ascent.</p>`
      },
      {
        q: `<b>Why is PGD stronger than single-step FGSM?</b> Both stay inside the same $\\epsilon$-ball, so why
            does the multi-step attack lower a normal model's accuracy more?`,
        steps: [
          { do: `Write FGSM: one step of size $\\epsilon$ using only the sign of $\\nabla_x L$ at the <i>clean</i> point $x$.`, why: `It commits to a single straight-line direction based on the gradient at one point.` },
          { do: `Write PGD: many steps of size $\\alpha\\lt\\epsilon$, recomputing $\\nabla_x L$ at each new iterate and re-projecting.`, why: `The loss surface is curved; the best direction changes as you move. PGD re-aims each step.` },
          { do: `Conclude: PGD follows the curved loss surface to a higher-loss corner of the ball than FGSM's single straight shot reaches.`, why: `More gradient evaluations inside the ball find a worse-case input; that is why our run shows normal-model accuracy lower under PGD than under FGSM.` }
        ],
        answer: `<p>FGSM takes one straight step using the gradient at the clean input. The loss surface is curved, so
                 that single direction is only locally best. PGD takes many smaller steps, recomputing the gradient
                 and re-projecting each time, so it tracks the curvature to a higher-loss point inside the same
                 ball. Same budget, better search &mdash; a stronger attack. In our run the normally-trained model
                 drops to about <b>0.23</b> under FGSM but <b>0.15</b> under PGD.</p>`
      },
      {
        q: `<b>The ablation: turn off adversarial training.</b> You have a working min-max loop. Replace the PGD
            inner step in training with nothing (train on clean inputs only), everything else identical. What
            happens to clean accuracy and to PGD accuracy, and what trade-off does this expose?`,
        steps: [
          { do: `Remove the inner max: in each training step, drop the PGD call and use the clean batch.`, why: `This collapses Eqn. 2.1's min-max back to ordinary empirical-risk minimization &mdash; it is the normal-training baseline.` },
          { do: `Re-evaluate under PGD: the normally-trained model collapses (our run: ~0.15) while the adversarially-trained one holds far higher (~0.48).`, why: `Without seeing worst-case inputs in training, the model has no incentive to be flat in the $\\epsilon$-ball.` },
          { do: `Check clean accuracy: the normal model is higher on clean data (~0.96) than the robust one (~0.78).`, why: `Adversarial training spends capacity on robustness, which costs clean accuracy &mdash; the robustness/accuracy trade-off.` }
        ],
        answer: `<p>Dropping the PGD inner step turns the min-max objective back into normal training. That model wins
                 on <b>clean</b> data (our run: ~0.96 vs ~0.78 for the robust model) but collapses under PGD
                 (~0.15 vs ~0.48). The ablation exposes the central trade-off: PGD adversarial training buys robust
                 accuracy at the cost of some clean accuracy. The inner maximization is what forces the network to
                 be flat in a small ball around each point. <i>(Our small run, not the paper's numbers.)</i></p>`
      }
    ]
  });

  window.CODE["paper-pgd"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a small multi-layer perceptron with <code>nn.Linear</code> /
       <code>nn.ReLU</code>, then build the <b>novel</b> parts by hand &mdash; the <b>PGD</b> attack and the
       <b>min-max</b> training loop. PGD = Projected Gradient Descent: random start in the $\\epsilon$-ball, then
       repeated sign-gradient steps each followed by a <b>projection</b> (per-coordinate clip back into the ball,
       the $\\ell_\\infty$ form of $\\Pi_{x+S}$). Adversarial training (Eqn. 2.1) runs PGD on each batch, then
       takes the optimizer step on those worst-case inputs. We use a hard two-class "moons" dataset so the attack
       actually bites. The first cell recomputes the worked example: sign $=-1$, ascend $0.50\\to 0.30$, project
       (clip to $[0.35,0.65]$) $\\to 0.35$. CPU, well under a minute. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np
torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the worked example: one PGD step + projection clip. ---
# logit = w*x, w=2.0, label y=1, BCE loss; x0=0.5, alpha=0.20, eps=0.15 -> ball [0.35,0.65].
x0 = torch.tensor(0.5); w = torch.tensor(2.0); eps_we, alpha_we = 0.15, 0.20
xt = x0.clone().requires_grad_(True)
loss_we = F.binary_cross_entropy_with_logits(w*xt, torch.tensor(1.0))
g = torch.autograd.grad(loss_we, xt)[0]
ascend = x0.item() + alpha_we*torch.sign(g).item()
proj   = min(max(ascend, x0.item()-eps_we), x0.item()+eps_we)   # clip into the eps-ball
print("worked example: sign(grad)=%.0f  ascend=%.2f  project=%.2f  (ball [%.2f, %.2f])" % (
      torch.sign(g).item(), ascend, proj, x0.item()-eps_we, x0.item()+eps_we))
# worked example: sign(grad)=-1  ascend=0.30  project=0.35  (ball [0.35, 0.65])


# --- 1. A hard two-class toy dataset: interleaving "moons" (so attacks actually bite). ---
def moons(n, noise=0.25, seed=0):
    rng = np.random.RandomState(seed); h = n//2
    t = np.linspace(0, np.pi, h)
    outer = np.stack([np.cos(t), np.sin(t)], 1)
    inner = np.stack([1 - np.cos(t), 1 - np.sin(t) - 0.5], 1)
    X = np.concatenate([outer, inner]); y = np.concatenate([np.zeros(h), np.ones(h)])
    X += rng.normal(scale=noise, size=X.shape); p = rng.permutation(n)
    return torch.tensor(X[p], dtype=torch.float32), torch.tensor(y[p], dtype=torch.float32)
Xtr, ytr = moons(600, seed=1); Xte, yte = moons(400, seed=2)

# --- 2. The model, composed with torch.nn. ---
def make_net():
    return nn.Sequential(nn.Linear(2,64), nn.ReLU(), nn.Linear(64,64), nn.ReLU(), nn.Linear(64,1))
loss_fn = nn.BCEWithLogitsLoss()
EPS, ALPHA, PGD_STEPS = 0.6, 0.15, 10     # L-inf radius, PGD step size, iterations

# --- 3. The NOVEL attacks, built by hand: FGSM (one step) and PGD (multi-step + projection). ---
def fgsm(net, X, y, eps):
    Xa = X.clone().requires_grad_(True)
    l = loss_fn(net(Xa).squeeze(1), y)
    g, = torch.autograd.grad(l, Xa)                       # gradient w.r.t. the INPUT
    return (X + eps*torch.sign(g)).detach()               # one sign-step, raises the loss

def pgd(net, X, y, eps, alpha, steps):
    Xa = (X + torch.empty_like(X).uniform_(-eps, eps)).detach()   # random start in the ball
    for _ in range(steps):
        Xa.requires_grad_(True)
        l = loss_fn(net(Xa).squeeze(1), y)
        g, = torch.autograd.grad(l, Xa)
        Xa = Xa.detach() + alpha*torch.sign(g)                    # ascend the loss
        Xa = torch.min(torch.max(Xa, X-eps), X+eps).detach()      # Proj: clip into eps-ball
    return Xa

def acc(net, X, y):
    with torch.no_grad():
        return ((net(X).squeeze(1) > 0).float() == y).float().mean().item()

# --- 4. Training: normal vs the MIN-MAX adversarial loop (Eqn. 2.1). ---
def train(net, adversarial):
    opt = torch.optim.Adam(net.parameters(), lr=0.01)
    for ep in range(150):
        Xb = pgd(net, Xtr, ytr, EPS, ALPHA, PGD_STEPS) if adversarial else Xtr  # inner max
        opt.zero_grad(); loss_fn(net(Xb).squeeze(1), ytr).backward(); opt.step() # outer min
    return net

torch.manual_seed(1); normal = train(make_net(), adversarial=False)
torch.manual_seed(1); robust = train(make_net(), adversarial=True)

# --- 5. Evaluate: clean vs FGSM vs PGD, for both models. ---
def report(name, net):
    c = acc(net, Xte, yte)
    f = acc(net, fgsm(net, Xte, yte, EPS), yte)
    p = acc(net, pgd(net, Xte, yte, EPS, ALPHA, PGD_STEPS), yte)
    print("%-20s clean=%.3f  FGSM=%.3f  PGD=%.3f" % (name, c, f, p))

print("\\neps=%.2f (L-inf), PGD %d steps alpha=%.2f, test n=%d" % (EPS, PGD_STEPS, ALPHA, len(yte)))
report("Normally trained", normal)
report("PGD adv-trained", robust)
# Normally trained     clean=0.957  FGSM=0.228  PGD=0.153   <- PGD is the stronger attack
# PGD adv-trained      clean=0.777  FGSM=0.522  PGD=0.482   <- robust acc up 0.153 -> 0.482
# (Our small run, not the paper's reported numbers. Exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-pgd"] = {
    question: "Under the same epsilon-budget, how do clean / FGSM / PGD accuracy compare for a normally-trained model versus a PGD-adversarially-trained model?",
    charts: [
      {
        type: "bar",
        title: "Accuracy by setting — normal vs PGD-adversarial training (same ε-ball)",
        xlabel: "evaluation setting",
        ylabel: "test accuracy (400 held-out points)",
        series: [
          { name: "Normally trained", color: "#ff7b72", points: [["Clean", 0.957], ["FGSM attack", 0.228], ["PGD attack", 0.153]] },
          { name: "PGD adv-trained", color: "#7ee787", points: [["Clean", 0.777], ["FGSM attack", 0.522], ["PGD attack", 0.482]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny multi-layer perceptron (2&rarr;64&rarr;64&rarr;1, ReLU) on a hard interleaving-'moons' dataset, evaluated inside the same &#8467;&#8734;-ball (&epsilon;=0.6; PGD: 10 steps, &alpha;=0.15). Read two effects. (1) PGD is the stronger attack: the normally-trained model drops from 0.957 clean to 0.228 under single-step FGSM and further to 0.153 under multi-step PGD. (2) PGD adversarial training raises robust accuracy: under PGD it holds 0.482 versus the normal model's 0.153 &mdash; but its clean accuracy falls to 0.777, the robustness/accuracy trade-off.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

def moons(n, noise=0.25, seed=0):
    rng = np.random.RandomState(seed); h = n//2
    t = np.linspace(0, np.pi, h)
    outer = np.stack([np.cos(t), np.sin(t)], 1)
    inner = np.stack([1 - np.cos(t), 1 - np.sin(t) - 0.5], 1)
    X = np.concatenate([outer, inner]); y = np.concatenate([np.zeros(h), np.ones(h)])
    X += rng.normal(scale=noise, size=X.shape); p = rng.permutation(n)
    return torch.tensor(X[p], dtype=torch.float32), torch.tensor(y[p], dtype=torch.float32)
Xtr, ytr = moons(600, seed=1); Xte, yte = moons(400, seed=2)

def make_net(): return nn.Sequential(nn.Linear(2,64), nn.ReLU(), nn.Linear(64,64), nn.ReLU(), nn.Linear(64,1))
lf = nn.BCEWithLogitsLoss(); EPS, ALPHA, STEPS = 0.6, 0.15, 10

def fgsm(net, X, y):
    Xa = X.clone().requires_grad_(True); g, = torch.autograd.grad(lf(net(Xa).squeeze(1), y), Xa)
    return (X + EPS*torch.sign(g)).detach()
def pgd(net, X, y):
    Xa = (X + torch.empty_like(X).uniform_(-EPS, EPS)).detach()
    for _ in range(STEPS):
        Xa.requires_grad_(True); g, = torch.autograd.grad(lf(net(Xa).squeeze(1), y), Xa)
        Xa = Xa.detach() + ALPHA*torch.sign(g)
        Xa = torch.min(torch.max(Xa, X-EPS), X+EPS).detach()      # projection onto eps-ball
    return Xa
def acc(net, X, y):
    with torch.no_grad(): return ((net(X).squeeze(1) > 0).float() == y).float().mean().item()
def train(net, adv):
    opt = torch.optim.Adam(net.parameters(), lr=0.01)
    for ep in range(150):
        Xb = pgd(net, Xtr, ytr) if adv else Xtr
        opt.zero_grad(); lf(net(Xb).squeeze(1), ytr).backward(); opt.step()
    return net

torch.manual_seed(1); normal = train(make_net(), False)
torch.manual_seed(1); robust = train(make_net(), True)
for name, net in [("normal", normal), ("robust", robust)]:
    print(name, [round(acc(net, Xte, yte),3), round(acc(net, fgsm(net,Xte,yte), yte),3), round(acc(net, pgd(net,Xte,yte), yte),3)])
# normal [0.957, 0.228, 0.153]
# robust [0.777, 0.522, 0.482]
# PGD (0.153) beats FGSM (0.228) as an attack; adv-training lifts PGD acc 0.153 -> 0.482.
# Our small run, not the paper's number.`
  };
})();
